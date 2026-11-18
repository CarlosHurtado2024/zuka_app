// Deshaz el camino (Álgebra, alg-12b; spec 2026-11-18-algebra-revision): los inversos. Un número pasa por dos puertas
// (sumar, multiplicar) y sale cambiado. Para volver al número de partida se ponen en las puertas de regreso las tarjetas
// que deshacen cada paso: el opuesto deshace una suma y el recíproco deshace un producto, y se deshace en orden
// contrario: lo último que se hizo es lo primero que se deshace. El valor se ve en cada tramo.
// params = { rounds: [{ x, ops: [[op, v], [op, v]], cards: [[op, v], …] }] }   (op '+' o '×'; v número)
// state = { rounds: [{ slots: [índice de tarjeta | null, …] }] }
GAMES['deshaz-camino'] = (() => {
  const apply = (x, [op, v]) => (op === '+' ? x + v : x * v);
  const inv = ([op, v]) => (op === '+' ? ['+', -v] : ['×', 1 / v]);
  const same = (a, b) => a[0] === b[0] && Math.abs(a[1] - b[1]) < 1e-9;
  const ok = (s, r) => s.slots.every((c, i) => c != null && same(r.cards[c], inv(r.ops[r.ops.length - 1 - i])));
  const lab = ([op, v]) => (op === '+' ? `+\\,${RK.par(v)}` : `\\times\\,${RK.par(v)}`);
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ slots: r.ops.map(() => null) }),
    ok,
    answered: s => s.slots.some(c => c != null),
    solution: r => `deshacer con ${[...r.ops].reverse().map(o => { const [op, v] = inv(o); return op === '+' ? `+ (${v})` : `× ${RK.num(v).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}`; }).join(', luego ')}`,
    prompt: r => `Regresa al ${r.x} deshaciendo los pasos`,
    foot: () => 'Arrastra a las puertas de regreso las tarjetas que deshacen cada paso',
    layout(G) {
      const W = G.W, H = G.H, n = 2, gw = (W - 40) / 5;
      G.go = { y: 112 }; G.back = { y: H * 0.42 };
      G.gx = i => 20 + gw * (0.5 + 2 * i + 1) - gw / 2; G.gw = gw; G.cardY = H * 0.6; G.fb = { x: 12, y: H - 84, w: W - 24, h: 52 };
      G.slot = i => ({ x: 20 + gw * (2 * i + 1), y: G.back.y - 18, w: gw, h: 36 });
    },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, good = ok(G.s, r), s = G.locked && !good ? { slots: [...r.ops].reverse().map(o => r.cards.findIndex(c => same(c, inv(o)))) } : G.s, gw = G.gw;
      // Ida: x → puerta 1 → puerta 2 → y.
      const vals = [r.x]; r.ops.forEach(o => vals.push(apply(vals.at(-1), o)));
      const box = (i, y, v, col) => RK.chip(p, C, { x: 20 + gw * 2 * i, y: y - 16, w: gw, h: 32 }, `$${RK.num(v)}$`, { on: true, col, size: 15 });
      TK.label(p, C, 'ida', 30, G.go.y - 26, C.mute, 10, 40);
      vals.forEach((v, i) => box(i, G.go.y, v, C.sky));
      r.ops.forEach((o, i) => { const x = 20 + gw * (2 * i + 1); RK.arrow(p, x + 4, x + gw - 6, G.go.y, C.line, 2); TK.label(p, C, `$${lab(o)}$`, x + gw / 2, G.go.y - 16, C.ink, 13, gw + 10); });
      // Regreso: y → puerta → puerta → ¿x?
      TK.label(p, C, 'regreso', 36, G.back.y - 30, C.mute, 10, 60);
      const back = [vals.at(-1)]; s.slots.forEach(c => back.push(c == null || back.at(-1) == null ? null : apply(back.at(-1), r.cards[c])));
      back.forEach((v, i) => { if (v == null) { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 4]); p.rect(20 + gw * 2 * i, G.back.y - 16, gw, 32, 9); p.drawingContext.setLineDash([]); } else box(i, G.back.y, v, i === back.length - 1 ? (Math.abs(v - r.x) < 1e-9 ? C.ok : C.coral) : C.sky); });
      G.spots = [];
      s.slots.forEach((c, i) => { const b = G.slot(i); p.stroke(C.brand); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 24)); p.rect(b.x + 4, b.y, b.w - 8, b.h, 9); if (c != null) { G.spots.push({ c, from: i, ...b }); if (G.drag?.c !== c) TK.label(p, C, `$${lab(r.cards[c])}$`, b.x + b.w / 2, b.y + b.h / 2, C.ink, 13, b.w); } });
      // Tarjetas.
      const free = r.cards.map((_, i) => i).filter(i => !s.slots.includes(i)), cw = Math.min(70, (G.W - 24) / free.length - 6);
      free.forEach((c, j) => { const b = { x: G.W / 2 - (free.length * (cw + 6) - 6) / 2 + j * (cw + 6), y: G.cardY, w: cw, h: 36, c, from: -1 }; G.spots.push(b); if (G.drag?.c !== c) RK.chip(p, C, b, `$${lab(r.cards[c])}$`, { size: 13 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - cw / 2, y: G.drag.y - 18, w: cw, h: 36 }, `$${lab(r.cards[G.drag.c])}$`, { on: true, size: 13 });
      const end = back.at(-1);
      RK.strip(p, C, G.fb, end == null ? `$\\text{faltan puertas}$` : `$${RK.num(vals.at(-1))} \\to ${RK.num(end)}$`, { kicker: end != null && Math.abs(end - r.x) < 1e-9 ? 'De vuelta al inicio' : `Meta: volver al ${r.x}`, col: G.locked ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { c: q.c, from: q.from, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const s = G.s, k = s.slots.findIndex((_, i) => hitBox({ ...G.slot(i), y: G.slot(i).y - 14, h: 64 }, x, y));
      if (d.from >= 0) s.slots[d.from] = null;
      if (k >= 0) { const prev = s.slots[k]; s.slots[k] = d.c; if (prev != null && d.from >= 0) s.slots[d.from] = prev; }
      G.touch();
    },
    demo(G) { const q = G.spots?.find(q => q.from < 0), b = G.slot(0); return q ? { from: { x: q.x + q.w / 2, y: q.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 18 }, text: 'Arrastra a la puerta de regreso', ty: G.cardY + 56 } : null; },
    peek: G => ({ spots: G.spots, slot: [0, 1].map(i => G.slot(i)) }),
  });
  return Object.assign(game, { inv, apply });
})();
