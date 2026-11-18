// Factorizar ax² + bx + c partiendo el término del medio (Álgebra, alg-24b; spec 2026-11-18-algebra-revision): se buscan
// dos números m y n con m + n = b y m·n = a·c; entonces bx = mx + nx y se agrupa de a dos. Un rectángulo de cuatro
// casillas (ax², mx, nx, c); se arrastran m y n y el juego dice si las dos condiciones se cumplen y factoriza.
// params = { rounds: [{ a, b, c }] }   state = { rounds: [{ m, n }] }   (de −12 a 12)
GAMES['parte-medio'] = (() => {
  const R = Array.from({ length: 25 }, (_, i) => i - 12);
  const ok = (s, r) => s.m + s.n === r.b && s.m * s.n === r.a * r.c;
  const answer = r => { for (const m of R) for (const n of R) if (m <= n && ok({ m, n }, r)) return { m, n }; return null; };
  const sg = v => (v < 0 ? `- ${-v}` : `+ ${v}`);
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ m: 0, n: 0 }),
    ok,
    solution: r => { const a = answer(r); return `${r.b}x = ${a.m}x + ${a.n}x`; },
    prompt: r => `Factoriza $${r.a}x^2 ${sg(r.b)}x ${sg(r.c)}$ partiendo el término del medio`,
    foot: () => 'Arrastra m y n: suman b y multiplican a·c',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, cw = (G.W - 60) / 2, x0 = 30, y0 = 104, ch = 40;
      [[`${r.a}x^2`, C.sky], [`${s.m}x`, C.mint], [`${s.n}x`, C.mint], [`${r.c}`, C.coral]].forEach(([t, col], i) => { const b = { x: x0 + (i % 2) * cw, y: y0 + Math.floor(i / 2) * ch, w: cw - 4, h: ch - 4 }; RK.chip(p, C, b, `$${t}$`, { on: true, col, size: 14 }); });
      const sum = s.m + s.n === r.b, prod = s.m * s.n === r.a * r.c;
      [[`m + n = ${s.m + s.n}  (meta ${r.b})`, sum], [`m · n = ${s.m * s.n}  (meta a·c = ${r.a * r.c})`, prod]].forEach(([t, g], i) => TK.label(p, C, t, G.W / 2, y0 + 2 * ch + 14 + i * 18, g ? C.ok : C.mute, 11, G.W - 30));
      G.X = ['m', 'n'].map((k, j) => { TK.label(p, C, k, 18, G.tr[j], C.mute, 12, 20); return RK.track(p, C, 34, G.W - 24, G.tr[j], R.length, s[k] + 12, i => (i % 6 === 0 ? String(R[i]) : null), j ? C.coral : C.sky); });
      RK.strip(p, C, G.fb, `$${r.a}x^2 ${sg(s.m)}x ${sg(s.n)}x ${sg(r.c)}$`, { kicker: ok(s, r) ? 'Ahora se agrupa de a dos' : 'Busca m y n', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](12), y: G.tr[0] }, to: { x: G.X[0](17), y: G.tr[0] }, text: 'Arrastra m', ty: G.tr[0] - 30 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = R[RK.pick(x, 34, G.W - 24, R.length)], k = G.grab ? 'n' : 'm'; if (v !== G.s[k] || !G.touched[G.cur]) { G.s[k] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
