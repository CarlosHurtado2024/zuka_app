// Bajar el exponente con logaritmos (Álgebra, alg-73; spec 2026-11-18-algebra-revision): si en bˣ = N no se pueden igualar
// las bases, se toma logaritmo a los dos lados y el exponente baja: x·log b = log N, una ecuación lineal. Arriba, la curva
// bˣ y la altura N; abajo, dos barras: x·log b (crece con x, como una recta) y log N (fija). Se arrastra x hasta el cruce de
// la curva, que es justo donde las dos barras miden lo mismo.
// params = { rounds: [{ b, N, max }] }   state = { rounds: [{ x }] }   (x de 0 a max, de centésima en centésima)
GAMES['baja-con-log'] = (() => {
  const sol = r => Math.log(r.N) / Math.log(r.b);
  const ok = (s, r) => Math.abs(s.x - sol(r)) <= 0.03 * Math.max(1, r.max / 6);
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ x: 0 }),
    ok,
    solution: r => `x = log ${r.N} ÷ log ${r.b} ≈ ${sol(r).toFixed(2)}`,
    prompt: r => `Resuelve $${r.b}^x = ${r.N}$`,
    foot: () => 'Arrastra x hasta que las dos barras midan lo mismo',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.4 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? sol(r) : G.s.x, V = { x0: 0, x1: r.max, y0: 0, y1: r.N * 1.6 }, M = G.M = RK.plane(p, C, G.b, V, { step: r.max > 8 ? 2 : 1 }), good = ok({ x }, r);
      RK.curve(p, G.b, M, V, t => r.b ** t, C.sky, 2.4);
      p.stroke(C.coral); p.strokeWeight(1.4); p.drawingContext.setLineDash([5, 4]); p.line(G.b.x, M.Y(r.N), G.b.x + G.b.w, M.Y(r.N)); p.drawingContext.setLineDash([]);
      p.stroke(C.brand); p.strokeWeight(1.4); p.line(M.X(x), G.b.y, M.X(x), G.b.y + G.b.h); RK.knob(p, C, M.X(x), G.b.y + G.b.h - 12, C.brand);
      const L = x * Math.log10(r.b), R2 = Math.log10(r.N), u = (G.W - 130) / (R2 * 1.4), y0 = G.b.y + G.b.h + 18;
      [[`x · log ${r.b}`, L, C.sky], [`log ${r.N}`, R2, C.coral]].forEach(([t, v, col], i) => { TK.label(p, C, t, 56, y0 + i * 28 + 9, C.mute, 10, 100); p.noStroke(); p.fill(good ? C.ok : col); p.rect(112, y0 + i * 28, Math.min(G.W - 130, v * u), 18, 3); TK.label(p, C, v.toFixed(3), Math.min(G.W - 30, 112 + v * u + 26), y0 + i * 28 + 9, C.ink, 9, 44); });
      RK.strip(p, C, G.fb, `$x = ${x.toFixed(2)}:\\ ${r.b}^{x} \\approx ${(r.b ** x).toFixed(2)}$`, { kicker: 'x·log b = log N', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.x), y: G.b.y + G.b.h - 12 }, to: { x: G.M.X(G.s.x + G.r.max * 0.15), y: G.b.y + G.b.h - 12 }, text: 'Arrastra x', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  game.move = (G, x) => { const v = Math.max(0, Math.min(G.r.max, Math.round(G.M.iX(x) * 100) / 100)); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ x: Math.round(sol(r) * 100) / 100 }), sol });
})();
