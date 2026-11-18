// Dividir entre ax − b (Álgebra, alg-92; spec 2026-11-18-algebra-revision): el residuo de dividir P(x) entre ax − b es
// P(b/a), porque b/a es el número que anula el divisor. Se arrastra c por la recta (de media en media); el divisor
// evaluado en c y la gráfica de P se ven en vivo. Hay que dejar c donde el divisor vale cero; ahí se lee el residuo.
// params = { rounds: [{ P: [coef], a, b }] }   state = { rounds: [{ c }] }   (c de −3 a 3, de media en media)
GAMES['divisor-fraccion'] = (() => {
  const ev = (P, x) => P.reduce((s, k) => s * x + k, 0);
  const ok = (s, r) => Math.abs(s.c - r.b / r.a) < 1e-9;
  const pt = P => P.map((k, i) => { const e = P.length - 1 - i; if (!k) return ''; const m = Math.abs(k) === 1 && e ? '' : Math.abs(k); return `${k < 0 ? ' - ' : i ? ' + ' : ''}${m}${e ? (e === 1 ? 'x' : `x^{${e}}`) : ''}`; }).join('');
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ c: 0 }),
    ok,
    solution: r => `c = ${r.b / r.a}: residuo ${ev(r.P, r.b / r.a)}`,
    prompt: r => `Residuo de $(${pt(r.P)}) \\div (${r.a}x ${r.b < 0 ? '+' : '-'} ${Math.abs(r.b)})$`,
    foot: () => 'Arrastra c hasta que el divisor valga cero',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.48 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, c = G.locked && !ok(G.s, r) ? r.b / r.a : G.s.c, V = { x0: -3, x1: 3, y0: -8, y1: 8 }, M = G.M = RK.plane(p, C, G.b, V, { step: 1 });
      RK.curve(p, G.b, M, V, x => ev(r.P, x), C.sky, 2.4);
      const d = r.a * c - r.b, y = ev(r.P, c);
      p.stroke(C.brand); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 3]); p.line(M.X(c), G.b.y, M.X(c), G.b.y + G.b.h); p.drawingContext.setLineDash([]);
      if (y >= V.y0 && y <= V.y1) drawDot(p, C, M.X(c), M.Y(y), 12, ok({ c }, r) ? C.ok : C.brand);
      RK.knob(p, C, M.X(c), M.Y(0), C.brand);
      TK.label(p, C, `divisor en c: ${r.a}·(${c}) ${r.b < 0 ? '+' : '−'} ${Math.abs(r.b)} = ${d}`, G.W / 2, G.b.y + G.b.h + 14, d === 0 ? C.ok : C.mute, 11, G.W - 30);
      RK.strip(p, C, G.fb, ok({ c }, r) ? `$\\text{residuo} = P(${c}) = ${y}$` : `$P(${c}) = ${y}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.c), y: G.M.Y(0) }, to: { x: G.M.X(G.r.b / G.r.a === 2 ? -2 : 2), y: G.M.Y(0) }, text: 'Arrastra c', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  game.move = (G, x) => { const v = Math.max(-3, Math.min(3, Math.round(G.M.iX(x) * 2) / 2)); if (v !== G.s.c || !G.touched[G.cur]) { G.s.c = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ c: r.b / r.a }) });
})();
