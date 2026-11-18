// El residuo es P(c) (Álgebra, alg-92; spec 2026-11-18-algebra-revision): al dividir P(x) entre x − c el residuo es P(c).
// Ojo con el signo: x + 2 es x − (−2). Se arrastra c por la recta; la gráfica de P marca su altura en c, que es el residuo
// de dividir entre x − c. Hay que poner c donde lo pide el divisor de la ronda.
// params = { rounds: [{ P: [coef. de mayor a menor grado], c }] }   state = { rounds: [{ x }] }   (de −4 a 4)
GAMES['signo-divisor'] = (() => {
  const val = (P, x) => P.reduce((a, k) => a * x + k, 0);
  const ok = (s, r) => s.x === r.c;
  const poly = P => GAMES['iguala-coeficientes'].poly3([...Array(4 - P.length).fill(0), ...P]);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ x: 0 }),
    ok,
    solution: r => `c = ${r.c}: residuo P(${r.c}) = ${val(r.P, r.c)}`,
    prompt: r => `¿Qué residuo deja $${poly(r.P)}$ al dividir entre $x ${r.c < 0 ? '+' : '-'} ${Math.abs(r.c)}$?`,
    foot: () => 'Arrastra c: la altura de la gráfica en c es el residuo',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.5 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? r.c : G.s.x, ys = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(t => val(r.P, t)), lo = Math.min(...ys, 0), hi = Math.max(...ys, 0), V = { x0: -4.5, x1: 4.5, y0: lo - 2, y1: hi + 2 }, M = G.M = RK.plane(p, C, G.b, V, { step: Math.max(1, Math.round((hi - lo) / 8)) });
      RK.curve(p, G.b, M, V, t => val(r.P, t), C.sky, 2.4);
      const y = val(r.P, x);
      p.stroke(C.coral); p.strokeWeight(3); p.line(M.X(x), M.Y(0), M.X(x), M.Y(y)); drawDot(p, C, M.X(x), M.Y(y), 11, C.coral);
      RK.knob(p, C, M.X(x), G.b.y + G.b.h - 12, C.brand);
      RK.strip(p, C, G.fb, `$\\text{entre } x ${x < 0 ? '+' : '-'} ${Math.abs(x)}:\\quad P(${x}) = ${y}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.x), y: G.b.y + G.b.h - 12 }, to: { x: G.M.X(G.s.x - 2), y: G.b.y + G.b.h - 12 }, text: 'Arrastra c', ty: G.b.y + 14 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x) => { const v = Math.max(-4, Math.min(4, Math.round(G.M.iX(x)))); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { val });
})();
