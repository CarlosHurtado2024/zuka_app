// La parábola por tres puntos (Álgebra, alg-4a; spec 2026-11-18-algebra-revision): tres puntos (con x distintas) determinan
// una sola parábola y = ax² + bx + c. Se arrastran a, b y c: c es la altura en x = 0, a abre o cierra y b la corre. Hay
// que hacerla pasar por los tres puntos.
// params = { rounds: [{ a, b, c, xs: [x, x, x] }] }   state = { rounds: [{ v: [a, b, c] }] }   (a de −3 a 3, b y c de −6 a 6)
GAMES['tres-puntos'] = (() => {
  const V = { x0: -5, x1: 5, y0: -8, y1: 10 };
  const f = (v, x) => v[0] * x * x + v[1] * x + v[2];
  const ok = (s, r) => s.v[0] === r.a && s.v[1] === r.b && s.v[2] === r.c;
  const RG = [[-3, 3], [-6, 6], [-6, 6]];
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ v: [1, 0, 0] }),
    ok,
    solution: r => `y = ${r.a === 1 ? '' : r.a === -1 ? '−' : r.a}x²${r.b ? ` ${r.b < 0 ? '−' : '+'} ${Math.abs(r.b)}x` : ''}${r.c ? ` ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)}` : ''}`,
    prompt: () => 'Haz pasar la parábola por los tres puntos',
    foot: () => 'Arrastra a, b y c',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.44 }; G.tr = [G.H - 194, G.H - 152, G.H - 110]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: [r.a, r.b, r.c] } : G.s, M = RK.plane(p, C, G.b, V, { step: 1 }), t = [r.a, r.b, r.c];
      RK.curve(p, G.b, M, V, x => f(s.v, x), ok(s, r) ? C.ok : C.sky, 2.6);
      r.xs.forEach(x => { const y = f(t, x), hit = f(s.v, x) === y; drawDot(p, C, M.X(x), M.Y(y), 13, hit ? C.ok : C.coral); });
      G.X = ['a', 'b', 'c'].map((k, j) => { TK.label(p, C, k, 18, G.tr[j], C.mute, 12, 20); return RK.track(p, C, 34, G.W - 24, G.tr[j], RG[j][1] - RG[j][0] + 1, s.v[j] - RG[j][0], i => ((i + RG[j][0]) % 2 === 0 ? String(i + RG[j][0]) : null), [C.sky, C.mint, C.coral][j]); });
      RK.strip(p, C, G.fb, `$y = ${s.v[0]}x^2 ${s.v[1] < 0 ? '-' : '+'} ${Math.abs(s.v[1])}x ${s.v[2] < 0 ? '-' : '+'} ${Math.abs(s.v[2])}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 18); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[2](6), y: G.tr[2] }, to: { x: G.X[2](8), y: G.tr[2] }, text: 'Arrastra c', ty: G.tr[0] - 26 }),
    peek: G => ({ tr: G.tr, b: G.b }),
  });
  game.move = (G, x) => { const j = G.grab, n = RG[j][1] - RG[j][0] + 1, v = RK.pick(x, 34, G.W - 24, n) + RG[j][0]; if (v !== G.s.v[j] || !G.touched[G.cur]) { G.s.v[j] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ v: [r.a, r.b, r.c] }) });
})();
