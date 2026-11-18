// La base menor que 1 (Álgebra, alg-71; spec 2026-11-18-algebra-revision): (1/b)ˣ = b^(−x): la curva de base 1/b es el
// reflejo de bˣ en el eje y, y decrece. Se ven las dos curvas; se arrastra x y se lee la altura de (1/b)ˣ. Hay que llegar
// a la altura pedida, que solo se alcanza con x negativo cuando es mayor que 1.
// params = { rounds: [{ b, target }] }   state = { rounds: [{ x }] }   (entero de −5 a 5)
GAMES['mitad-espejo'] = (() => {
  const g = (r, x) => (1 / r.b) ** x;
  const ok = (s, r) => Math.abs(g(r, s.x) - r.target) < 1e-9;
  const answer = r => { for (let x = -5; x <= 5; x++) if (ok({ x }, r)) return { x }; return null; };
  const fr = v => (v >= 1 || v === 0 ? RK.num(v) : `\\tfrac{1}{${RK.num(1 / v)}}`);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ x: 0 }),
    ok,
    solution: r => `x = ${answer(r).x}`,
    prompt: r => `¿Para qué x vale ${r.target >= 1 ? r.target : `1/${1 / r.target}`} la curva $y = \\left(\\tfrac{1}{${r.b}}\\right)^x$?`,
    foot: () => 'Arrastra x; la curva clara es su reflejo, la de base mayor que 1',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.56 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? answer(r).x : G.s.x, V = { x0: -5, x1: 5, y0: 0, y1: Math.max(4, r.target * 1.3) }, M = G.M = RK.plane(p, C, G.b, V, { step: V.y1 > 20 ? 5 : 1 });
      RK.curve(p, G.b, M, V, t => r.b ** t, RK.al(p, C.mute, 160), 1.8);
      RK.curve(p, G.b, M, V, t => g(r, t), C.sky, 2.6);
      p.stroke(C.coral); p.strokeWeight(1.4); p.drawingContext.setLineDash([5, 4]); p.line(G.b.x, M.Y(r.target), G.b.x + G.b.w, M.Y(r.target)); p.drawingContext.setLineDash([]);
      const y = g(r, x); p.stroke(C.brand); p.strokeWeight(1.6); p.line(M.X(x), M.Y(0), M.X(x), M.Y(Math.min(V.y1, y)));
      if (y <= V.y1) drawDot(p, C, M.X(x), M.Y(y), 13, ok({ x }, r) ? C.ok : C.brand);
      RK.knob(p, C, M.X(x), M.Y(0), C.brand);
      RK.strip(p, C, G.fb, `$\\left(\\tfrac{1}{${r.b}}\\right)^{${x}} = ${r.b}^{${-x}} = ${fr(y)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.x), y: G.M.Y(0) }, to: { x: G.M.X([-2, 2, -1].map(d => G.s.x + d).find(v => v !== answer(G.r).x)), y: G.M.Y(0) }, text: 'Arrastra x', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  game.move = (G, x) => { const v = Math.max(-5, Math.min(5, Math.round(G.M.iX(x)))); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
