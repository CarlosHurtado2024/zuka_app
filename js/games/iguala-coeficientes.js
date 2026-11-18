// Iguala los coeficientes (Álgebra, alg-23b; spec 2026-11-18-algebra-revision): dos polinomios son iguales si tienen los
// mismos coeficientes. Se busca (x − c)(x² + ax + b) igual a un cúbico dado: se arrastran a y b y se ve el producto
// desarrollado junto al cúbico, coeficiente por coeficiente; cada uno que coincide se pone verde.
// params = { rounds: [{ c, P: [1, p2, p1, p0] }] }   state = { rounds: [{ a, b }] }   (de −8 a 8)
GAMES['iguala-coeficientes'] = (() => {
  const prod = (c, a, b) => [1, a - c, b - c * a, -c * b];
  const answer = r => ({ a: r.P[1] + r.c, b: r.P[2] + r.c * (r.P[1] + r.c) });
  const ok = (s, r) => prod(r.c, s.a, s.b).join() === r.P.join();
  const poly3 = P => { const t = []; [[P[0], 'x^3'], [P[1], 'x^2'], [P[2], 'x'], [P[3], '']].forEach(([v, x]) => { if (!v) return; const a = Math.abs(v); t.push((v < 0 ? '-' : t.length ? '+' : '') + (x ? (a === 1 ? x : a + x) : a)); }); return t.join(' ') || '0'; };
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ a: 0, b: 0 }),
    ok,
    solution: r => { const { a, b } = answer(r); return `(x ${r.c < 0 ? '+' : '−'} ${Math.abs(r.c)})(x² ${a < 0 ? '−' : '+'} ${Math.abs(a)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)})`; },
    prompt: r => `Escribe $${poly3(r.P)}$ como $(x ${r.c < 0 ? '+' : '-'} ${Math.abs(r.c)})(x^2 + ax + b)$`,
    foot: () => 'Arrastra a y b: compara coeficiente por coeficiente',
    layout(G) { G.t1 = G.H - 150; G.t2 = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, Q = prod(r.c, s.a, s.b), w = (G.W - 40) / 4;
      ['x³', 'x²', 'x', '1'].forEach((n, i) => {
        const x = 20 + i * w;
        TK.label(p, C, n, x + w / 2, 110, C.mute, 11, w);
        RK.chip(p, C, { x: x + 4, y: 122, w: w - 8, h: 32 }, String(r.P[i]), { on: true, col: C.sky, size: 14 });
        RK.chip(p, C, { x: x + 4, y: 164, w: w - 8, h: 32 }, String(Q[i]), { on: true, col: Q[i] === r.P[i] ? C.ok : C.coral, size: 14 });
      });
      TK.label(p, C, 'meta', 14, 138, C.mute, 9, 30); TK.label(p, C, 'tuyo', 14, 180, C.mute, 9, 30);
      G.X1 = RK.track(p, C, 50, G.W - 24, G.t1, 17, s.a + 8, i => (i % 4 === 0 ? String(i - 8) : null)); TK.label(p, C, 'a', 28, G.t1, C.mute, 12, 20);
      G.X2 = RK.track(p, C, 50, G.W - 24, G.t2, 17, s.b + 8, i => (i % 4 === 0 ? String(i - 8) : null)); TK.label(p, C, 'b', 28, G.t2, C.mute, 12, 20);
      RK.strip(p, C, G.fb, `$(x ${r.c < 0 ? '+' : '-'} ${Math.abs(r.c)})(x^2 ${s.a < 0 ? '-' : '+'} ${Math.abs(s.a)}x ${s.b < 0 ? '-' : '+'} ${Math.abs(s.b)}) = ${poly3(Q)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 14 });
    },
    press(G, x, y) { const k = Math.abs(y - G.t1) < 20 ? 'a' : Math.abs(y - G.t2) < 20 ? 'b' : null; if (!k) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X1(G.s.a + 8), y: G.t1 }, to: { x: G.X1(G.s.a + 10), y: G.t1 }, text: 'Arrastra a y b', ty: G.t1 - 26 }),
    peek: G => ({ t1: G.t1, t2: G.t2 }),
  });
  game.move = (G, x) => { G.s[G.grab] = RK.pick(x, 50, G.W - 24, 17) - 8; G.touch(); };
  return Object.assign(game, { answer, poly3 });
})();
