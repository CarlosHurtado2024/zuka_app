// Suma y producto (Álgebra, alg-24b; spec 2026-11-18-algebra-revision): x² + sx + p = (x + m)(x + n) si m + n = s y
// m·n = p. Dos fichas en la recta de los enteros; se arrastran y arriba se ven su suma y su producto. Hay que dejar la
// pareja que da la suma y el producto del trinomio (con signos: si p es negativo, una ficha va a cada lado del 0).
// params = { rounds: [{ s, p }] }   state = { rounds: [{ m, n }] }   (de −10 a 10)
GAMES['suma-producto'] = (() => {
  const ok = (st, r) => st.m + st.n === r.s && st.m * st.n === r.p;
  const answer = r => { for (let m = -10; m <= 10; m++) for (let n = m; n <= 10; n++) if (m + n === r.s && m * n === r.p) return { m, n }; return null; };
  const t = (v, x = 'x') => (v === 0 ? '' : `${v < 0 ? '-' : '+'} ${Math.abs(v) === 1 && x ? '' : Math.abs(v)}${x}`);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ m: 1, n: 2 }),
    ok,
    solution: r => { const { m, n } = answer(r); return `(x ${m < 0 ? '−' : '+'} ${Math.abs(m)})(x ${n < 0 ? '−' : '+'} ${Math.abs(n)})`; },
    prompt: r => `Factoriza $x^2 ${t(r.s)} ${t(r.p, '')}$`,
    foot: () => 'Arrastra las dos fichas: busca la suma y el producto',
    layout(G) { G.L = { x0: 22, x1: G.W - 22, y: G.H * 0.55, min: -10, max: 10 }; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r, L } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, X = drawNumLine(p, C, L, { step: 1, every: 5 });
      G.X = X;
      RK.knob(p, C, X(s.m), L.y - 24, C.sky); RK.knob(p, C, X(s.n), L.y + 24 + 4, C.coral);
      TK.label(p, C, `suma ${s.m + s.n} · meta ${r.s}`, G.W / 2, 116, s.m + s.n === r.s ? C.ok : C.ink, 14, G.W - 30);
      TK.label(p, C, `producto ${s.m * s.n} · meta ${r.p}`, G.W / 2, 142, s.m * s.n === r.p ? C.ok : C.ink, 14, G.W - 30);
      const f = v => `(x ${v < 0 ? '-' : '+'} ${Math.abs(v)})`;
      RK.strip(p, C, G.fb, `$${f(s.m)}${f(s.n)} = x^2 ${t(s.m + s.n)} ${t(s.m * s.n, '')}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 50) return false; G.grab = y < G.L.y ? 'm' : 'n'; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X(G.s.m), y: G.L.y - 24 }, to: { x: G.X(G.s.m + 3), y: G.L.y - 24 }, text: 'Arrastra las fichas', ty: G.L.y + 70 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); G.s[G.grab] = v; G.touch(); };
  return Object.assign(game, { answer });
})();
