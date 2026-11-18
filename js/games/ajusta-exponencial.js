// La curva por dos puntos (Álgebra, alg-71; spec 2026-11-18-algebra-revision): en y = a·bˣ, a es la altura en x = 0 y b el
// factor por el que se multiplica la altura en cada paso a la derecha. Se arrastran a y b y la curva cambia en vivo; hay
// que hacerla pasar por los dos puntos marcados.
// params = { rounds: [{ a, b, pts: [[x, y], [x, y]] }] }   state = { rounds: [{ a, bi }] }   (a de 1 a 6; b de la lista B)
GAMES['ajusta-exponencial'] = (() => {
  const B = [1 / 4, 1 / 3, 1 / 2, 2, 3, 4], BT = ['\\tfrac14', '\\tfrac13', '\\tfrac12', '2', '3', '4'];
  const ok = (s, r) => s.a === r.a && Math.abs(B[s.bi] - r.b) < 1e-9;
  const answer = r => ({ a: r.a, bi: B.findIndex(b => Math.abs(b - r.b) < 1e-9) });
  const game = roundsGame({
    aspect: 1.25,
    init: r => (r.a === 1 && r.b === 2 ? { a: 2, bi: 3 } : { a: 1, bi: 3 }),
    ok,
    solution: r => { const s = answer(r); return `y = ${r.a}·${BT[s.bi].replace('\\tfrac', '').replace(/(\d)(\d)/, '$1/$2')}^x`; },
    prompt: () => 'Haz pasar $y = a \\cdot b^x$ por los dos puntos',
    foot: () => 'Arrastra a (la altura en x = 0) y b (el factor de cada paso)',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.5 }; G.tr = [G.H - 146, G.H - 106]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, top = Math.max(...r.pts.map(q => q[1])) * 1.35, V = { x0: -3, x1: 3, y0: 0, y1: Math.ceil(top) };
      const M = RK.plane(p, C, G.b, V, { step: 1 });
      RK.curve(p, G.b, M, V, x => s.a * B[s.bi] ** x, ok(s, r) ? C.ok : C.sky, 2.6);
      r.pts.forEach(([x, y]) => { const hit = Math.abs(s.a * B[s.bi] ** x - y) < 1e-9; drawDot(p, C, M.X(x), M.Y(y), 13, hit ? C.ok : C.coral); });
      G.X = [RK.track(p, C, 40, G.W - 30, G.tr[0], 6, s.a - 1, i => String(i + 1), C.sky), RK.track(p, C, 40, G.W - 30, G.tr[1], B.length, s.bi, i => `$${BT[i]}$`, C.coral)];
      TK.label(p, C, 'a', 20, G.tr[0], C.mute, 13, 20); TK.label(p, C, 'b', 20, G.tr[1], C.mute, 13, 20);
      RK.strip(p, C, G.fb, `$y = ${s.a} \\cdot \\left(${BT[s.bi]}\\right)^x$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](G.s.a - 1), y: G.tr[0] }, to: { x: G.X[0](G.s.a + 1), y: G.tr[0] }, text: 'Arrastra a', ty: G.tr[0] - 30 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const j = G.grab; if (j === 0) { const a = RK.pick(x, 40, G.W - 30, 6) + 1; if (a !== G.s.a || !G.touched[G.cur]) { G.s.a = a; G.touch(); } } else { const bi = RK.pick(x, 40, G.W - 30, B.length); if (bi !== G.s.bi || !G.touched[G.cur]) { G.s.bi = bi; G.touch(); } } };
  return Object.assign(game, { answer });
})();
