// ¿Cuántas veces corta? (Álgebra, alg-4; spec 2026-11-18-algebra-revision): subir o bajar la parábola cambia su
// discriminante. y = x² + bx + c: se arrastra c y la parábola sube o baja; se ven sus cortes con el eje x y Δ = b² − 4c.
// Cada ronda pide un caso: dos cortes, uno (toca) o ninguno.
// params = { rounds: [{ b, want: 2 | 1 | 0 }] }   state = { rounds: [{ c }] }   (de −8 a 12)
GAMES['discriminante-traslada'] = (() => {
  const V = { x0: -7, x1: 7, y0: -8, y1: 12 };
  const D = (r, c) => r.b * r.b - 4 * c;
  const n = d => (d > 0 ? 2 : d === 0 ? 1 : 0);
  const ok = (s, r) => n(D(r, s.c)) === r.want;
  const answer = r => { for (let c = -8; c <= 12; c++) if (n(D(r, c)) === r.want) return { c }; return null; };
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ c: r.want === 1 ? (r.b * r.b) / 4 + 1 : r.want === 0 ? -1 : 12 }),
    ok,
    solution: r => `c = ${answer(r).c}`,
    prompt: r => `Mueve $y = x^2 ${r.b < 0 ? '-' : '+'} ${Math.abs(r.b)}x + c$ para que corte el eje ${r.want === 2 ? 'dos veces' : r.want === 1 ? 'una sola vez' : 'ninguna vez'}`,
    foot: () => 'Arrastra c: la parábola sube o baja',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.5 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, c = G.locked && !ok(G.s, r) ? answer(r).c : G.s.c, d = D(r, c), M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => x * x + r.b * x + c, ok({ c }, r) ? C.ok : C.sky, 2.6);
      if (d >= 0) [(-r.b - Math.sqrt(d)) / 2, (-r.b + Math.sqrt(d)) / 2].forEach(x => drawDot(p, C, M.X(x), M.Y(0), 11, C.coral));
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, 21, c + 8, i => (i % 4 === 0 ? String(i - 8) : null));
      RK.strip(p, C, G.fb, `$\\Delta = ${r.b}^2 - 4\\cdot${c} = ${d}$`, { kicker: d > 0 ? 'positivo: dos cortes' : d === 0 ? 'cero: toca una vez' : 'negativo: ningún corte', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.c + 8), y: G.tY }, to: { x: G.X(G.s.c + 4), y: G.tY }, text: 'Arrastra c', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const c = RK.pick(x, 24, G.W - 24, 21) - 8; if (c !== G.s.c || !G.touched[G.cur]) { G.s.c = c; G.touch(); } };
  return Object.assign(game, { answer, D });
})();
