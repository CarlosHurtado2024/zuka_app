// El módulo es una distancia (Álgebra, alg-23c; spec 2026-11-18-algebra-revision): |a + bi| = √(a² + b²) es la distancia
// del punto al origen. Se arrastra el radio de un círculo con centro en el origen hasta que pase por z; el triángulo de
// catetos a y b muestra el teorema de Pitágoras.
// params = { rounds: [{ a, b }] }   (a² + b² es un cuadrado)   state = { rounds: [{ R }] }   (de 1 a 15)
GAMES['modulo-circulo'] = (() => {
  const need = r => Math.round(Math.hypot(r.a, r.b));
  const ok = (s, r) => s.R === need(r);
  const z = (a, b) => GAMES['plano-complejo'].z(a, b);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ R: 1 }),
    ok,
    solution: r => `|${z(r.a, r.b)}| = √(${r.a * r.a} + ${r.b * r.b}) = ${need(r)}`,
    prompt: r => `Abre el círculo hasta $${z(r.a, r.b)}$: ¿cuál es su módulo?`,
    foot: () => 'Arrastra el borde del círculo',
    layout(G) { const s = Math.min(G.W - 32, G.H - 190); G.b = { x: (G.W - s) / 2, y: 96, w: s, h: s }; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, R = G.locked && !ok(G.s, r) ? need(r) : G.s.R, m = Math.max(need(r), 5) + 2, V = { x0: -m, x1: m, y0: -m, y1: m }, M = G.M = RK.plane(p, C, G.b, V, { step: m > 10 ? 2 : 1, lx: 'Re', ly: 'Im' });
      p.stroke(RK.al(p, C.sky, 160)); p.strokeWeight(1.6); p.line(M.X(0), M.Y(0), M.X(r.a), M.Y(0)); p.line(M.X(r.a), M.Y(0), M.X(r.a), M.Y(r.b));
      p.stroke(C.sky); p.strokeWeight(2.6); p.line(M.X(0), M.Y(0), M.X(r.a), M.Y(r.b)); drawDot(p, C, M.X(r.a), M.Y(r.b), 12, C.sky);
      p.noFill(); p.stroke(ok({ R }, r) || G.locked ? C.ok : C.coral); p.strokeWeight(2.4); p.circle(M.X(0), M.Y(0), 2 * (M.X(R) - M.X(0)));
      G.kx = M.X(R); RK.knob(p, C, G.kx, M.Y(0), C.coral); G.m = m;
      RK.strip(p, C, G.fb, `$\\text{radio } ${R}\\qquad |z| = \\sqrt{${r.a}^2 + ${r.b}^2}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.kx, y: G.M.Y(0) }, to: { x: G.kx + 50, y: G.M.Y(0) }, text: 'Arrastra el borde', ty: G.b.y + G.b.h + 14 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x, y) => { const R = Math.max(1, Math.min(15, Math.round(Math.hypot(G.M.iX(x), G.M.iY(y))))); if (R !== G.s.R || !G.touched[G.cur]) { G.s.R = R; G.touch(); } };
  return Object.assign(game, { need });
})();
