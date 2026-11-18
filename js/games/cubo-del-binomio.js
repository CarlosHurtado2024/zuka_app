// El cubo de un binomio (Álgebra, alg-3; spec 2026-11-18-algebra-revision): el cubo de arista x + b se parte en 8 piezas:
// un cubo x³, tres losas x²·b, tres barras x·b² y un cubito b³. Por eso (x + b)³ = x³ + 3b·x² + 3b²·x + b³. Se arrastran los
// tres coeficientes y las piezas se apilan; el juego compara con el volumen del cubo para x = 2.
// params = { rounds: [{ b }] }   state = { rounds: [{ c: [c2, c1, c0] }] }   (de 0 a 30)
GAMES['cubo-del-binomio'] = (() => {
  const need = r => [3 * r.b, 3 * r.b * r.b, r.b ** 3];
  const ok = (s, r) => s.c.join() === need(r).join();
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ c: [1, 1, 1] }),
    ok,
    solution: r => `x³ + ${need(r)[0]}x² + ${need(r)[1]}x + ${need(r)[2]}`,
    prompt: r => `Desarrolla $(x + ${r.b})^3$`,
    foot: () => 'Arrastra los coeficientes de x², de x y el número',
    layout(G) { G.tr = [G.H - 190, G.H - 148, G.H - 106]; G.fb = { x: 12, y: G.H - 64, w: G.W - 24, h: 42 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { c: need(r) } : G.s, x = 2, real = (x + r.b) ** 3, mine = x ** 3 + s.c[0] * x * x + s.c[1] * x + s.c[2], u = (G.W - 60) / Math.max(real, mine) / 1.1;
      const parts = [[1, 'x³', C.sky], [s.c[0], 'x²', C.mint], [s.c[1], 'x', C.coral], [s.c[2], '1', C.brand]];
      let px = 24; parts.forEach(([n, , col], i) => { const v = n * x ** (3 - i); p.noStroke(); p.fill(col); p.rect(px, 112, v * u, 24); px += v * u; });
      p.noStroke(); p.fill(RK.al(p, C.mute, 120)); p.rect(24, 146, real * u, 14, 3);
      TK.label(p, C, `con x = 2: cubo ${real}, tus piezas ${mine}`, G.W / 2, 176, ok(s, r) ? C.ok : C.mute, 10, G.W - 30);
      const lab = ['x²', 'x', 'número'];
      G.X = [0, 1, 2].map(j => { TK.label(p, C, lab[j], 20, G.tr[j] - 14, C.mute, 10, 40); return RK.track(p, C, 40, G.W - 30, G.tr[j], 31, s.c[j], i => (i % 5 === 0 ? String(i) : null), [C.mint, C.coral, C.brand][j]); });
      RK.strip(p, C, G.fb, `$x^3 + ${s.c[0]}x^2 + ${s.c[1]}x + ${s.c[2]}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 18); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](1), y: G.tr[0] }, to: { x: G.X[0](2), y: G.tr[0] }, text: 'Arrastra un coeficiente', ty: G.tr[0] - 28 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 40, G.W - 30, 31), j = G.grab; if (v !== G.s.c[j] || !G.touched[G.cur]) { G.s.c[j] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ c: need(r) }) });
})();
