// Ceros con su multiplicidad (Álgebra, alg-93; spec 2026-11-18-algebra-revision): un polinomio de grado n tiene n ceros
// contando las repeticiones. Se ve la gráfica de un polinomio; se arrastran fichas de cero a la recta (una ficha sobre
// otra es un cero doble) hasta que el polinomio armado coincida con la gráfica y su grado sea el pedido.
// params = { rounds: [{ zeros: [[c, m], …] }] }   state = { rounds: [{ marks: { c: m } }] }
GAMES['arma-ceros'] = (() => {
  const L = { min: -5, max: 5 };
  const deg = r => r.zeros.reduce((a, z) => a + z[1], 0);
  const ok = (s, r) => { const want = Object.fromEntries(r.zeros.map(([c, m]) => [c, m])); const ks = Object.keys(s.marks).filter(k => s.marks[k] > 0); return ks.length === r.zeros.length && ks.every(k => want[k] === s.marks[k]); };
  const answer = r => ({ marks: Object.fromEntries(r.zeros.map(([c, m]) => [c, m])) });
  const P = (zs, x) => zs.reduce((a, [c, m]) => a * (x - c) ** m, 1);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ marks: {} }),
    ok,
    answered: s => Object.values(s.marks).some(Boolean),
    solution: r => r.zeros.map(([c, m]) => `(x ${c < 0 ? '+' : '-'} ${Math.abs(c)})${m > 1 ? `^${m}` : ''}`).join(''),
    prompt: r => `Pon los ${deg(r)} ceros de este polinomio de grado ${deg(r)}`,
    foot: () => 'Arrastra fichas de cero a la recta; una sobre otra es un cero repetido. Arrastra afuera para quitar',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.42 }; G.L = { x0: 26, x1: G.W - 26, y: G.b.y + G.b.h + 40, min: L.min, max: L.max }; G.src = { x: G.W / 2 - 22, y: G.L.y + 40, w: 44, h: 30 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, V = { x0: -5, x1: 5, y0: -12, y1: 12 }, M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => P(r.zeros, x), C.sky, 2.4);
      const mine = Object.entries(s.marks).filter(([, m]) => m > 0).map(([c, m]) => [+c, m]);
      if (mine.length) { p.drawingContext.setLineDash([5, 4]); RK.curve(p, G.b, M, V, x => P(mine, x), C.coral, 1.6); p.drawingContext.setLineDash([]); }
      const X = drawNumLine(p, C, G.L, { step: 1 }); G.X = X;
      mine.forEach(([c, m]) => { for (let k = 0; k < m; k++) drawDot(p, C, X(c), G.L.y - 12 - k * 13, 12, C.coral); });
      RK.chip(p, C, G.src, 'cero', { on: true, col: C.coral, size: 11 });
      if (G.drag) drawDot(p, C, G.drag.x, G.drag.y, 14, C.brand);
      const total = mine.reduce((a, z) => a + z[1], 0);
      RK.strip(p, C, G.fb, mine.length ? `$${mine.map(([c, m]) => `(x ${c < 0 ? '+' : '-'} ${Math.abs(c)})${m > 1 ? `^{${m}}` : ''}`).join('')}\\quad\\text{grado } ${total}$` : '$\\text{sin ceros todavía}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      if (hitBox(G.src, x, y)) { G.drag = { from: null, x, y }; return true; }
      const L = G.L, c = Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min));
      if (Math.abs(y - (L.y - 20)) < 30 && G.s.marks[c] > 0) { G.drag = { from: c, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const L = G.L, c = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))), on = Math.abs(y - L.y) < 50, mk = G.s.marks;
      if (d.from != null) mk[d.from]--;
      if (on && Object.values(mk).reduce((a, b) => a + b, 0) < 6) mk[c] = (mk[c] || 0) + 1;
      G.touch();
    },
    demo(G) { const X = G.X; return X ? { from: { x: G.src.x + 22, y: G.src.y + 15 }, to: { x: X(G.r.zeros[0][0]), y: G.L.y }, text: 'Arrastra un cero a la recta', ty: G.src.y + 46 } : null; },
    peek: G => ({ L: G.L, src: G.src }),
  });
  return Object.assign(game, { answer });
})();
