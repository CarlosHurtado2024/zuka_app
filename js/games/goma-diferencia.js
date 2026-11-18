// La goma (Álgebra 0, alg-0c; spec 2026-11-18-algebra-revision): diferencia, complemento y diferencia simétrica se
// hacen borrando. Arriba está el diagrama de A y B con sus elementos; abajo, el punto de partida de la operación
// (A para A − B, U para el complemento, A ∪ B para la diferencia simétrica). Se arrastran a la goma los elementos que
// hay que quitar, y la escritura formal muestra lo que queda. Lo borrado se puede devolver.
// params = { rounds: [{ op: 'A-B' | 'B-A' | 'Ac' | 'AdB', U, A, B }] }   state = { rounds: [{ gone: [etiquetas] }] }
GAMES['goma-diferencia'] = (() => {
  const uni = (X, Y) => [...X, ...Y.filter(v => !X.includes(v))];
  const start = r => (r.op === 'A-B' ? r.A : r.op === 'B-A' ? r.B : r.op === 'Ac' ? r.U : uni(r.A, r.B));
  const target = r => start(r).filter(v => (r.op === 'A-B' ? !r.B.includes(v) : r.op === 'B-A' ? !r.A.includes(v) : r.op === 'Ac' ? !r.A.includes(v) : !(r.A.includes(v) && r.B.includes(v))));
  const left = (s, r) => start(r).filter(v => !s.gone.includes(v));
  const ok = (s, r) => left(s, r).join() === target(r).join();
  const OP = { 'A-B': ['A - B', 'Parte de A y borra lo que también está en B'], 'B-A': ['B - A', 'Parte de B y borra lo que también está en A'], Ac: ['A^c', 'Parte de U y borra lo que está en A'], AdB: ['A \\,\\triangle\\, B', 'Parte de A ∪ B y borra lo que está en los dos'] };
  const tset = xs => (xs.length ? `\\{${xs.join(', ')}\\}` : '\\varnothing');
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ gone: [] }),
    ok,
    answered: s => s.gone.length > 0,
    solution: r => `${OP[r.op][0].replace(/\\,|\\triangle|\^c/g, m => (m === '^c' ? 'ᶜ' : m === '\\triangle' ? 'Δ' : ''))} = {${target(r).join(', ')}}`,
    prompt: r => OP[r.op][1],
    foot: () => 'Arrastra a la goma lo que hay que quitar',
    layout(G) {
      const W = G.W, H = G.H; G.box = { x: 12, y: 96, w: W - 24, h: H * 0.34 }; G.cs = SK.venn2(G.box, 0.55, 4);
      G.trayY = G.box.y + G.box.h + 30; G.eraser = { x: W - 86, y: G.trayY + 46, w: 74, h: 40 }; G.fb = { x: 12, y: H - 86, w: W - 24, h: 52 };
    },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, box, cs } = G, [SA, SB] = SK.sets(C), good = ok(G.s, r), s = G.locked && !good ? { gone: start(r).filter(v => !target(r).includes(v)) } : G.s;
      SK.panel(p, C, box, { u: true });
      SK.membrane(p, C, cs[0].x, cs[0].y, cs[0].r, cs[0].r, SA.line, { fill: 22 }); SK.membrane(p, C, cs[1].x, cs[1].y, cs[1].r, cs[1].r, SB.line, { fill: 22 });
      SK.tag(p, C, 'A', cs[0].x - cs[0].r * 0.7, cs[0].y - cs[0].r * 0.75, SA); SK.tag(p, C, 'B', cs[1].x + cs[1].r * 0.7, cs[1].y - cs[1].r * 0.75, SB);
      // Elementos en su zona del diagrama.
      const zone = v => (r.A.includes(v) ? (r.B.includes(v) ? 'AB' : 'A') : r.B.includes(v) ? 'B' : 'U'), cnt = {}, tot = {};
      r.U.forEach(v => { tot[zone(v)] = (tot[zone(v)] || 0) + 1; });
      r.U.forEach(v => {
        const z = zone(v), i = (cnt[z] = (cnt[z] || 0) + 1) - 1, n = tot[z];
        // Los de afuera de A y de B van en columnas junto al borde derecho del universo.
        const pos = z === 'U' ? { x: box.x + box.w - 16 - Math.floor(i / 4) * 20, y: box.y + 30 + (i % 4) * 22 }
          : { x: z === 'A' ? cs[0].x - cs[0].r * 0.45 : z === 'B' ? cs[1].x + cs[1].r * 0.45 : (cs[0].x + cs[1].x) / 2, y: cs[0].y + (i - (n - 1) / 2) * 22 };
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(13); p.text(v, pos.x, pos.y);
      });
      // La bandeja con lo que queda y la goma con lo borrado.
      const rest = start(r).filter(v => !s.gone.includes(v)), w = 36;
      G.spots = [];
      rest.forEach((v, i) => { const x = 18 + (i % 6) * (w + 6), y = G.trayY + Math.floor(i / 6) * 36; G.spots.push({ v, x, y, out: false }); if (G.drag?.v !== v) SK.chip(p, C, { x, y, w, h: 28 }, v, { state: G.locked ? 'ok' : 'on', col: SA.line, size: 13, r: 9 }); });
      const e = G.eraser;
      p.stroke(C.coral); p.strokeWeight(1.6); p.fill(SK.al(p, C.coral, 40)); p.rect(e.x, e.y, e.w, e.h, 10);
      TK.label(p, C, 'goma', e.x + e.w / 2, e.y - 9, C.mute, 10, 60);
      s.gone.forEach((v, i) => { const x = e.x + 3 + (i % 4) * 17.5, y = e.y + 3 + Math.floor(i / 4) * 18; G.spots.push({ v, x, y, out: true }); if (G.drag?.v !== v) SK.chip(p, C, { x, y, w: 16, h: 16 }, v, { state: 'idle', size: 9, r: 5 }); });
      if (G.drag) SK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 14, w, h: 28 }, G.drag.v, { state: 'on', col: C.brand, size: 13, r: 9 });
      SK.formal(p, C, G.fb, `$${OP[r.op][0]} = ${tset(rest)}$`, { kicker: 'Lo que queda', col: G.locked ? C.ok : SA.line, size: 17 });
    },
    press(G, x, y) {
      const q = (G.spots || []).find(q => x > q.x - 4 && x < q.x + (q.out ? 18 : 40) && y > q.y - 4 && y < q.y + (q.out ? 18 : 30));
      if (!q) return false; G.drag = { v: q.v, out: q.out, x, y }; return true;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const e = G.eraser, inE = x > e.x - 14 && x < e.x + e.w + 14 && y > e.y - 18 && y < e.y + e.h + 14, g = G.s.gone;
      if (!d.out && inE) { g.push(d.v); G.touch(); } else if (d.out && !inE) { g.splice(g.indexOf(d.v), 1); G.touch(); }
    },
    demo(G) { const t = target(G.r), q = G.spots?.find(q => !q.out && !t.includes(q.v)); return q ? { from: { x: q.x + 18, y: q.y + 14 }, to: { x: G.eraser.x + 36, y: G.eraser.y + 20 }, text: 'Arrastra a la goma', ty: G.trayY - 14 } : null; },
    peek: G => ({ spots: G.spots, eraser: G.eraser, target: target(G.r) }),
  });
  return Object.assign(game, { target, start });
})();
