// Cajas dentro de cajas (Álgebra 0, alg-0a; spec 2026-11-18-algebra-revision): un conjunto puede tener conjuntos como
// elementos. Arriba está la caja A (una membrana) y abajo una bandeja con números sueltos y bolsas: {2, 3} es una bolsa
// con dos fichas, ∅ es una bolsa vacía y {∅} es una bolsa que guarda una bolsa vacía. Se arrastran a A las piezas que
// pide la notación, y A cuenta sus elementos: una bolsa cuenta como uno solo, tenga lo que tenga adentro.
// params = { rounds: [{ name, target: [etiquetas], tray: [etiquetas] }] }   (etiquetas: '1', '{2, 3}', '∅', '{∅}')
// state = { rounds: [{ in: [índices de la bandeja] }] }
GAMES['cajas-anidadas'] = (() => {
  const kids = l => (l === '∅' ? [] : l.startsWith('{') ? l.slice(1, -1).split(', ') : null);   // null = ficha suelta
  const tex = l => (l === '∅' ? '\\varnothing' : l.startsWith('{') ? `\\{${kids(l).map(tex).join(', ')}\\}` : l);
  const same = (s, r) => s.in.map(i => r.tray[i]).sort().join('|') === [...r.target].sort().join('|');
  const sizeOf = l => { const k = kids(l); return k === null ? { w: 40, h: 30 } : { w: Math.max(44, 18 + k.length * 30), h: 38 }; };
  // Dibuja una pieza centrada en (x, y): ficha o bolsa con lo que tiene adentro.
  function piece(p, C, l, x, y, st, col) {
    const k = kids(l), { w, h } = sizeOf(l);
    if (k === null) return SK.chip(p, C, { x: x - w / 2, y: y - h / 2, w, h }, l, { state: st, col, size: 14, r: 9 });
    SK.membrane(p, C, x, y, w / 2, h / 2, st === 'bad' ? C.bad : st === 'ok' ? C.ok : col, { fill: st === 'idle' ? 14 : 40, w: 1.6 });
    k.forEach((c, j) => {
      const cx = x - (k.length - 1) * 15 + j * 30;
      if (c === '∅') SK.membrane(p, C, cx, y, 11, 8, col, { fill: 10, w: 1.2 });
      else SK.chip(p, C, { x: cx - 12, y: y - 10, w: 24, h: 20 }, c, { state: 'idle', size: 11, r: 7 });
    });
  }
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ in: [] }),
    ok: same,
    answered: s => s.in.length > 0,
    solution: r => `${r.name} = {${r.target.join(', ')}}: ${r.target.length} elemento${r.target.length === 1 ? '' : 's'}`,
    prompt: r => `Arma $${r.name} = \\{${r.target.map(tex).join(', ')}\\}$`,
    foot: () => 'Arrastra a la membrana las piezas que pide la notación',
    layout(G) { const W = G.W, H = G.H; G.box = { x: W / 2, y: H * 0.36, rx: W / 2 - 22, ry: H * 0.13 }; G.fb = { x: 12, y: H - 84, w: W - 24, h: 52 }; G.trayY = H * 0.6; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, box } = G, A = SK.sets(C)[0], good = same(G.s, r);
      const s = G.locked && !good ? { in: r.target.map(t => r.tray.indexOf(t)) } : G.s;
      SK.membrane(p, C, box.x, box.y, box.rx, box.ry, A.line, { fill: 24 });
      SK.tag(p, C, r.name, box.x - box.rx + 2, box.y, A);
      // Lo que está adentro, en fila.
      G.spots = {};
      // Si lo de adentro no cabe en una fila, va en dos.
      const ws = s.in.map(i => sizeOf(r.tray[i]).w), tot = ws.reduce((a, b) => a + b + 10, -10), two = tot > 2 * box.rx - 40, half = two ? Math.ceil(s.in.length / 2) : s.in.length;
      const rowW = (j0, j1) => ws.slice(j0, j1).reduce((a, b) => a + b + 10, -10);
      let x = box.x - rowW(0, half) / 2;
      s.in.forEach((i, j) => { if (j === half) x = box.x - rowW(half) / 2; const cx = x + ws[j] / 2, cy = two ? box.y + (j < half ? -21 : 21) : box.y; x += ws[j] + 10; if (G.drag?.i === i) return; G.spots[i] = { x: cx, y: cy }; piece(p, C, r.tray[i], cx, cy, G.locked ? 'ok' : 'on', A.line); });
      // La bandeja: dos filas.
      const rest = r.tray.map((_, i) => i).filter(i => !s.in.includes(i)), rows = [rest.slice(0, Math.ceil(rest.length / 2)), rest.slice(Math.ceil(rest.length / 2))];
      rows.forEach((row, ri) => {
        const ws2 = row.map(i => sizeOf(r.tray[i]).w), t2 = ws2.reduce((a, b) => a + b + 12, -12); let xx = G.W / 2 - t2 / 2;
        row.forEach((i, j) => { const cx = xx + ws2[j] / 2; xx += ws2[j] + 12; if (G.drag?.i === i) return; G.spots[i] = { x: cx, y: G.trayY + ri * 46 }; piece(p, C, r.tray[i], cx, G.trayY + ri * 46, 'idle', A.line); });
      });
      if (G.drag) piece(p, C, r.tray[G.drag.i], G.drag.x, G.drag.y, 'on', C.brand);
      const els = s.in.map(i => tex(r.tray[i]));
      SK.formal(p, C, G.fb, `$${r.name} = ${els.length ? `\\{${els.join(', ')}\\}` : '\\varnothing'}\\qquad n(${r.name}) = ${els.length}$`, { kicker: 'Lo que hay adentro', col: G.locked ? C.ok : A.line });
    },
    press(G, x, y) {
      const hit = Object.entries(G.spots || {}).find(([i, q]) => { const { w, h } = sizeOf(G.r.tray[i]); return Math.abs(x - q.x) < w / 2 + 4 && Math.abs(y - q.y) < h / 2 + 4; });
      if (!hit) return false;
      G.drag = { i: +hit[0], x, y }; return true;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      if (!G.drag) return;
      const i = G.drag.i, b = G.box, inBox = ((x - b.x) / b.rx) ** 2 + ((y - b.y) / b.ry) ** 2 < 1.1, s = G.s, k = s.in.indexOf(i);
      if (inBox && k < 0) s.in.push(i); else if (!inBox && k >= 0) s.in.splice(k, 1);
      G.drag = null; G.touch();
    },
    demo(G) { const i = G.r.tray.findIndex((t, j) => !G.s.in.includes(j) && G.r.target.includes(t)), q = G.spots?.[i]; return q ? { from: q, to: { x: G.box.x, y: G.box.y }, text: 'Arrastra cada pieza a la membrana', ty: G.H - 104 } : null; },
    peek: G => ({ spots: G.spots, box: G.box }),
  });
  return Object.assign(game, { tex, kids });
})();
