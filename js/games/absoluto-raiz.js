// La raíz del cuadrado (Álgebra, alg-22a; spec 2026-11-18-algebra-revision): √(x²) = |x|, no x. Se arrastra x por la
// recta; arriba se ven x², √(x²) y la distancia de x al 0. Cada ronda pide un x que cumpla una condición, como
// «√(x²) = 4 con x negativo» o «√(x²) ≠ x».
// params = { rounds: [{ kind: 'eq' | 'neq', v?, neg? }] }   state = { rounds: [{ x }] }   (entero de −6 a 6)
GAMES['absoluto-raiz'] = (() => {
  const ok = (s, r) => (r.kind === 'neq' ? Math.abs(s.x) !== s.x : Math.abs(s.x) === r.v && (r.neg ? s.x < 0 : s.x > 0));
  const answer = r => ({ x: r.kind === 'neq' ? -2 : r.neg ? -r.v : r.v });
  const ASK = { eq: r => `Encuentra x ${r.neg ? 'negativo' : 'positivo'} con √(x²) = ${r.v}`, neq: () => 'Encuentra un x con √(x²) distinto de x' };
  const game = roundsGame({
    aspect: 1,
    init: () => ({ x: 1 }),
    ok,
    solution: r => `x = ${answer(r).x}`,
    prompt: r => ASK[r.kind](r),
    foot: () => 'Arrastra x por la recta',
    layout(G) { G.L = { x0: 24, x1: G.W - 24, y: G.H * 0.56, min: -6, max: 6 }; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, L } = G, x = G.locked && !ok(G.s, r) ? answer(r).x : G.s.x, X = drawNumLine(p, C, L, { step: 1 });
      G.X = X;
      if (x) { p.stroke(C.brand); p.strokeWeight(4); p.line(X(0), L.y - 26, X(x), L.y - 26); TK.label(p, C, `|x| = ${Math.abs(x)}`, (X(0) + X(x)) / 2, L.y - 42, C.brand, 12, 80); }
      RK.knob(p, C, X(x), L.y, x < 0 ? C.coral : C.sky);
      TK.label(p, C, `x = ${x}`, G.W * 0.2, 118, C.ink, 14, 90); TK.label(p, C, `x² = ${x * x}`, G.W * 0.5, 118, C.ink, 14, 90); TK.label(p, C, `√(x²) = ${Math.abs(x)}`, G.W * 0.8, 118, C.ink, 14, 100);
      RK.strip(p, C, G.fb, `$\\sqrt{(${x})^2} = \\sqrt{${x * x}} = ${Math.abs(x)} = |${x}|$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 40) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x), y: G.L.y }, to: { x: G.X(G.s.x - 3), y: G.L.y }, text: 'Arrastra x', ty: G.L.y + 46 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
