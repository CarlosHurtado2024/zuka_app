// La abertura (Álgebra, alg-4a; spec 2026-11-18-algebra-revision): en y = a(x − h)² + k el número a dice qué tan abierta
// está la parábola y hacia dónde: si a > 0 abre hacia arriba y si a < 0 hacia abajo; cuanto mayor |a|, más cerrada. El
// vértice está fijo; se arrastra a hasta que la parábola pase por el punto marcado.
// params = { rounds: [{ h, k, pt: [x, y] }] }   state = { rounds: [{ i }] }   (índice en A)
GAMES['abertura-a'] = (() => {
  const A = [-3, -2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2, 3];
  const V = { x0: -6, x1: 6, y0: -10, y1: 12 };
  const need = r => A.findIndex(a => Math.abs(a * (r.pt[0] - r.h) ** 2 + r.k - r.pt[1]) < 1e-9);
  const ok = (s, r) => s.i === need(r);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ i: 7 }),
    ok,
    solution: r => `a = ${A[need(r)]}`,
    prompt: r => `Vértice (${r.h}, ${r.k}). Ajusta a para pasar por (${r.pt[0]}, ${r.pt[1]})`,
    foot: () => 'Arrastra a: negativo abre hacia abajo; grande, más cerrada',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.5 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, i = G.locked && !ok(G.s, r) ? need(r) : G.s.i, a = A[i], M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => a * (x - r.h) ** 2 + r.k, ok({ i }, r) ? C.ok : C.sky, 2.6);
      drawDot(p, C, M.X(r.h), M.Y(r.k), 11, C.ink); drawDot(p, C, M.X(r.pt[0]), M.Y(r.pt[1]), 13, C.coral);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, A.length, i, k => String(A[k]));
      RK.strip(p, C, G.fb, `$y = ${a}(x ${r.h < 0 ? '+' : '-'} ${Math.abs(r.h)})^2 ${r.k < 0 ? '-' : '+'} ${Math.abs(r.k)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.i), y: G.tY }, to: { x: G.X(G.s.i - 3), y: G.tY }, text: 'Arrastra a', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const i = RK.pick(x, 24, G.W - 24, A.length); if (i !== G.s.i || !G.touched[G.cur]) { G.s.i = i; G.touch(); } };
  return Object.assign(game, { need, A });
})();
