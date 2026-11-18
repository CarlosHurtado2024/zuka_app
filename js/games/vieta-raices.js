// Suma y producto de las raíces (Álgebra, alg-4; spec 2026-11-18-algebra-revision): si x² − Sx + P = 0 tiene raíces r₁ y
// r₂, entonces r₁ + r₂ = S y r₁·r₂ = P (fórmulas de Vieta). Se arrastran las dos raíces por el eje; la parábola que pasa
// por ellas se dibuja sola y se leen su suma y su producto. Hay que lograr los pedidos.
// params = { rounds: [{ S, P }] }   state = { rounds: [{ x: [r1, r2] }] }   (enteros de −6 a 6)
GAMES['vieta-raices'] = (() => {
  const V = { x0: -7, x1: 7, y0: -12, y1: 10 };
  const ok = (s, r) => s.x[0] + s.x[1] === r.S && s.x[0] * s.x[1] === r.P;
  const answer = r => { for (let a = -6; a <= 6; a++) for (let b = a; b <= 6; b++) if (ok({ x: [a, b] }, r)) return { x: [a, b] }; return null; };
  const sg = v => (v < 0 ? `+ ${-v}` : `- ${v}`);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ x: [-1, 1] }),
    ok,
    solution: r => `raíces ${answer(r).x.join(' y ')}`,
    prompt: r => `Raíces de $x^2${r.S ? ` ${sg(r.S)}x` : ''} ${r.P < 0 ? '-' : '+'} ${Math.abs(r.P)} = 0$: suman ${r.S} y multiplican ${r.P}`,
    foot: () => 'Arrastra las dos raíces por el eje',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.52 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, M = G.M = RK.plane(p, C, G.b, V, { step: 1 }), [a, b] = s.x;
      RK.curve(p, G.b, M, V, x => (x - a) * (x - b), ok(s, r) ? C.ok : C.sky, 2.4);
      s.x.forEach((x, i) => RK.knob(p, C, M.X(x), M.Y(0), i ? C.coral : C.brand));
      const sum = a + b === r.S, pr = a * b === r.P;
      [[`suma ${a + b}`, sum], [`producto ${a * b}`, pr]].forEach(([t, g], i) => RK.chip(p, C, { x: 20 + i * (G.W - 40) / 2, y: G.b.y + G.b.h + 8, w: (G.W - 40) / 2 - 6, h: 28 }, t, { on: g, col: g ? C.ok : C.line, size: 11 }));
      RK.strip(p, C, G.fb, `$(x ${a < 0 ? '+' : '-'} ${Math.abs(a)})(x ${b < 0 ? '+' : '-'} ${Math.abs(b)})$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.M.Y(0)) > 34) return false; const d = s => Math.abs(G.M.X(s) - x); G.grab = d(G.s.x[0]) <= d(G.s.x[1]) ? 0 : 1; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.M.X(G.s.x[1]), y: G.M.Y(0) }, to: { x: G.M.X(5), y: G.M.Y(0) }, text: 'Arrastra una raíz', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  game.move = (G, x) => { const v = Math.max(-6, Math.min(6, Math.round(G.M.iX(x)))), j = G.grab; if (v !== G.s.x[j] || !G.touched[G.cur]) { G.s.x[j] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
