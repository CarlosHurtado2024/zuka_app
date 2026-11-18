// Triángulo en la cuadrícula (Preuniversitario, pu-ge-5; spec 2026-11-18-preuda-razonamiento-completo): con la base sobre una
// línea de la cuadrícula, el área es base × altura ÷ 2, y la altura es qué tan lejos está el tercer vértice de esa línea
// (correrlo de lado no cambia el área). Se arrastra el vértice de arriba por los puntos de la cuadrícula hasta el área pedida.
// params = { rounds: [{ b, target }] }   (base de (0, 0) a (b, 0))   state = { rounds: [{ x, y }] }   (enteros, x de 0 a 8, y de 1 a 7)
GAMES['triangulo-cuadricula'] = (() => {
  const ok = (s, r) => r.b * s.y === 2 * r.target;
  const answer = r => ({ x: 1, y: 2 * r.target / r.b });
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ x: 2, y: 2 * r.target / r.b === 1 ? 2 : 1 }),
    ok,
    solution: r => `altura ${2 * r.target / r.b}`,
    prompt: r => `La base mide ${r.b}. Lleva el vértice a un punto que dé área ${r.target}`,
    foot: () => 'Arrastra el vértice de arriba por la cuadrícula',
    layout(G) { const s = Math.min(G.W - 40, G.H - 200); G.u = s / 8; G.o = { x: (G.W - s) / 2, y: 100 + s }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, u = G.u, o = G.o, X = x => o.x + x * u, Y = y => o.y - y * u, good = ok(s, r);
      p.stroke(RK.al(p, C.line, 110)); p.strokeWeight(1); for (let i = 0; i <= 8; i++) { p.line(X(i), Y(0), X(i), Y(8)); p.line(X(0), Y(i), X(8), Y(i)); }
      p.stroke(C.ink); p.strokeWeight(2); p.fill(RK.al(p, good ? C.ok : C.sky, 120)); p.triangle(X(0), Y(0), X(r.b), Y(0), X(s.x), Y(s.y));
      p.stroke(C.brand); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 3]); p.line(X(s.x), Y(s.y), X(s.x), Y(0)); p.drawingContext.setLineDash([]);
      RK.knob(p, C, X(s.x), Y(s.y), C.brand);
      RK.strip(p, C, G.fb, `$\\dfrac{${r.b} \\cdot ${s.y}}{2} = ${RK.num(r.b * s.y / 2)}$`, { kicker: `altura ${s.y}`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const X = G.o.x + G.s.x * G.u, Y = G.o.y - G.s.y * G.u; if (Math.hypot(x - X, y - Y) > 40) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const nx = Math.max(0, Math.min(8, Math.round((x - G.o.x) / G.u))), ny = Math.max(1, Math.min(7, Math.round((G.o.y - y) / G.u))); if (nx !== G.s.x || ny !== G.s.y || !G.touched[G.cur]) { G.s.x = nx; G.s.y = ny; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.o.x + G.s.x * G.u, y: G.o.y - G.s.y * G.u }, to: { x: G.o.x + (G.s.x + 3) * G.u, y: G.o.y - G.s.y * G.u }, text: 'Arrastra el vértice', ty: G.o.y + 18 }),
    peek: G => ({ o: G.o, u: G.u }),
  });
  return Object.assign(game, { answer });
})();
