// Las raíces a los dos lados del eje (Álgebra, alg-4; spec 2026-11-18-algebra-revision): la fórmula general dice
// x = h ± d, con h = −b/(2a) el eje y d = √Δ/(2|a|) la distancia. Las dos marcas salen del eje a la misma distancia; se
// arrastra d hasta que caigan en los cortes de la parábola.
// params = { rounds: [{ a, b, c }] }   (raíces reales con d múltiplo de 0.5)   state = { rounds: [{ d }] }   (de 0 a 6 de medio en medio)
GAMES['raices-simetricas'] = (() => {
  const V = { x0: -7, x1: 7, y0: -10, y1: 10 };
  const h = r => -r.b / (2 * r.a), need = r => Math.sqrt(r.b * r.b - 4 * r.a * r.c) / (2 * Math.abs(r.a));
  const ok = (s, r) => Math.abs(s.d - need(r)) < 1e-9;
  const poly = r => GAMES['bloques-polinomio'].poly([r.a, r.b, r.c]);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ d: 0.5 }),
    ok,
    solution: r => `x = ${h(r)} ± ${need(r)}`,
    prompt: r => `Raíces de $${poly(r)} = 0$: abre las marcas desde el eje`,
    foot: () => 'Arrastra la distancia: las dos marcas se separan igual del eje',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.5 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, d = G.locked && !ok(G.s, r) ? need(r) : G.s.d, M = RK.plane(p, C, G.b, V, { step: 2 }), H = h(r);
      RK.curve(p, G.b, M, V, x => r.a * x * x + r.b * x + r.c, C.sky, 2.6);
      p.stroke(C.brand); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 4]); p.line(M.X(H), G.b.y, M.X(H), G.b.y + G.b.h); p.drawingContext.setLineDash([]);
      [H - d, H + d].forEach(x => { p.stroke(ok({ d }, r) ? C.ok : C.coral); p.strokeWeight(2.5); p.line(M.X(x), M.Y(0) - 10, M.X(x), M.Y(0) + 10); });
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, 13, d * 2, i => (i % 2 === 0 ? String(i / 2) : null));
      RK.strip(p, C, G.fb, `$x = ${RK.num(H)} \\pm ${RK.num(d)}$`, { kicker: `Eje en x = ${H}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.d * 2), y: G.tY }, to: { x: G.X(G.s.d * 2 + 4), y: G.tY }, text: 'Arrastra la distancia', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const d = RK.pick(x, 24, G.W - 24, 13) / 2; if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } };
  return Object.assign(game, { need });
})();
