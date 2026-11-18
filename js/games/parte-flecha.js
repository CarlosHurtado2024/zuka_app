// Parte la flecha (Álgebra, alg-12c; spec 2026-11-18-algebra-revision): dividir es multiplicar por el recíproco. La
// flecha de a se parte en |b| pedazos iguales arrastrando la tijera (una marca de corte que se puede correr) y un pedazo
// es a · (1/|b|). Si b es negativo, además se voltea el pedazo (se arrastra su punta al otro lado del 0). Así salen la
// división y su signo: (−12) ÷ 3 = −4 y 15 ÷ (−5) = −3.
// params = { min, max, rounds: [{ a, b }] }   state = { rounds: [{ n, flip }] }
GAMES['parte-flecha'] = (() => {
  const ok = (s, r) => s.n === Math.abs(r.b) && s.flip === r.b < 0;
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ n: 1, flip: false }),
    ok,
    solution: r => `${r.a} ÷ (${r.b}) = ${r.a} · (1/${r.b}) = ${r.a / r.b}`,
    prompt: r => `Calcula $${RK.num(r.a)} \\div ${RK.par(r.b)}$ partiendo la flecha`,
    foot: (r, s) => (s.n !== Math.abs(r.b) ? 'Corre la tijera: la flecha se parte en pedazos iguales' : 'Si el divisor es negativo, voltea el pedazo'),
    layout(G) { G.L = { x0: 22, x1: G.W - 22, y: G.H * 0.45, min: G.params.min ?? -18, max: G.params.max ?? 18 }; G.yb = G.H * 0.66; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r, L } = G, s = G.locked && !ok(G.s, r) ? { n: Math.abs(r.b), flip: r.b < 0 } : G.s;
      const X = drawNumLine(p, C, L, { step: 1, every: 3 }), piece = r.a / s.n, pv = s.flip ? -piece : piece;
      G.X = X;
      RK.arrow(p, X(0), X(r.a), L.y - 26, C.sky, 5);
      for (let i = 1; i < s.n; i++) { const x = X(piece * i); p.stroke(C.ink); p.strokeWeight(2); p.line(x, L.y - 36, x, L.y - 16); }
      G.cut = { x: X(piece), y: L.y - 52 };
      p.noStroke(); p.fill(C.brand); p.triangle(G.cut.x, L.y - 38, G.cut.x - 8, L.y - 54, G.cut.x + 8, L.y - 54); RK.knob(p, C, G.cut.x, L.y - 64, C.brand);
      TK.label(p, C, `${s.n} pedazo${s.n === 1 ? '' : 's'}`, G.W / 2, L.y + 44, C.mute, 11, 120);
      // El pedazo, abajo: se puede voltear.
      const col = s.flip ? C.mint : C.coral;
      RK.arrow(p, X(0), X(pv), G.yb, col, 5); drawDot(p, C, X(0), G.yb, 10, C.ink); RK.knob(p, C, X(pv), G.yb + 26, col);
      G.tip = { x: X(pv), y: G.yb + 26 };
      RK.strip(p, C, G.fb, `$${RK.num(r.a)} \\cdot \\tfrac{1}{${s.flip ? '-' : ''}${s.n}} = ${RK.num(pv)}$`, { kicker: 'Dividir = multiplicar por el recíproco', col: G.locked ? C.ok : col, size: 18 });
    },
    press(G, x, y) {
      if (Math.hypot(x - G.cut.x, y - (G.L.y - 64)) < 30 || (Math.abs(y - (G.L.y - 26)) < 22)) { G.grab = 'cut'; game.cut(G, x); return true; }
      if (Math.hypot(x - G.tip.x, y - G.tip.y) < 28) { G.grab = 'flip'; return true; }
      return false;
    },
    drag(G, x) {
      if (G.grab === 'cut') { game.cut(G, x); return true; }
      if (G.grab === 'flip') { const f = Math.sign(x - G.X(0)) !== Math.sign(G.r.a); if (f !== G.s.flip) { G.s.flip = f; G.touch(); } return true; }
      return false;
    },
    release(G) { G.grab = null; },
    demo(G) { return { from: { x: G.cut.x, y: G.L.y - 64 }, to: { x: G.X(G.r.a / 3), y: G.L.y - 64 }, text: 'Corre la tijera', ty: G.yb + 60 }; },
    peek: G => ({ L: G.L, yb: G.yb }),
  });
  // La tijera marca el largo de un pedazo; el número de pedazos es el que más se le acerca (de 1 a 9).
  game.cut = (G, x) => {
    const a = G.r.a, v = G.L.min + (x - G.L.x0) / (G.L.x1 - G.L.x0) * (G.L.max - G.L.min);
    let best = 1; for (let n = 1; n <= 9; n++) if (Math.abs(a / n - v) < Math.abs(a / best - v)) best = n;
    if (best !== G.s.n || !G.touched[G.cur]) { G.s.n = best; G.touch(); }
  };
  return game;
})();
