// El eje de la parábola (Álgebra, alg-4a; spec 2026-11-18-algebra-revision): la parábola es simétrica respecto a la recta
// vertical x = h que pasa por el vértice. Hay dos puntos de la parábola a la misma altura; se arrastra la recta de simetría
// y el reflejo de uno aparece del otro lado: el eje está justo en el punto medio.
// params = { rounds: [{ a, h, k, x1 }] }   (puntos en x1 y 2h − x1)   state = { rounds: [{ e }] }   (de medio en medio)
GAMES['simetria-parabola'] = (() => {
  const V = { x0: -6, x1: 6, y0: -8, y1: 10 };
  const f = (r, x) => r.a * (x - r.h) ** 2 + r.k;
  const ok = (s, r) => Math.abs(s.e - r.h) < 1e-9;
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ e: r.h === 0 ? 1 : 0 }),
    ok,
    solution: r => `x = ${r.h}: el punto medio de ${r.x1} y ${2 * r.h - r.x1}`,
    prompt: r => `Los puntos en x = ${r.x1} y x = ${2 * r.h - r.x1} están a la misma altura. ¿Dónde está el eje?`,
    foot: () => 'Arrastra la recta de simetría: el reflejo debe caer en el otro punto',
    layout(G) { G.b = { x: 16, y: 104, w: G.W - 32, h: G.H * 0.56 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, e = G.locked && !ok(G.s, r) ? r.h : G.s.e, M = G.M = RK.plane(p, C, G.b, V, { step: 1 }), x2 = 2 * r.h - r.x1, y = f(r, r.x1);
      RK.curve(p, G.b, M, V, x => f(r, x), C.sky, 2.6);
      drawDot(p, C, M.X(r.x1), M.Y(y), 12, C.coral); drawDot(p, C, M.X(x2), M.Y(y), 12, C.coral);
      const refl = 2 * e - r.x1; p.noFill(); p.stroke(ok({ e }, r) ? C.ok : C.brand); p.strokeWeight(2); p.circle(M.X(refl), M.Y(y), 18);
      p.stroke(C.brand); p.strokeWeight(2); p.drawingContext.setLineDash([6, 4]); p.line(M.X(e), G.b.y, M.X(e), G.b.y + G.b.h); p.drawingContext.setLineDash([]);
      RK.knob(p, C, M.X(e), G.b.y + G.b.h - 14, C.brand);
      RK.strip(p, C, G.fb, `$x = ${RK.num(e)}$`, { kicker: `Punto medio de ${r.x1} y ${x2}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.e), y: G.b.y + G.b.h - 14 }, to: { x: G.M.X(G.s.e + 2), y: G.b.y + G.b.h - 14 }, text: 'Arrastra el eje', ty: G.b.y + 14 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x) => { const e = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x) * 2) / 2)); if (e !== G.s.e || !G.touched[G.cur]) { G.s.e = e; G.touch(); } };
  return game;
})();
