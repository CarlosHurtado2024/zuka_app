// Simplificar el índice (Álgebra, alg-22b; spec 2026-11-18-algebra-revision): ⁿ√(aᵏ) = a^(k/n), así que índice y exponente
// se pueden dividir entre lo mismo: ⁶√8 = ⁶√(2³) = √2. Se arrastran el índice y el radicando de un radical más sencillo;
// dos barras comparan su valor con el del radical dado. Debe dar lo mismo con el índice más pequeño posible.
// params = { rounds: [{ n0, m0, n, m }] }   state = { rounds: [{ n, m }] }   (índice de 2 a 6, radicando de 1 a 12)
GAMES['indice-radical'] = (() => {
  const v = (n, m) => m ** (1 / n);
  const ok = (s, r) => s.n === r.n && s.m === r.m;
  const answer = r => ({ n: r.n, m: r.m });
  const rt = (n, m) => (n === 2 ? `\\sqrt{${m}}` : `\\sqrt[${n}]{${m}}`);
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ n: 2, m: 1 }),
    ok,
    solution: r => `${r.n === 2 ? '√' : r.n === 3 ? '∛' : `raíz ${r.n}-ésima de `}${r.m}`,
    prompt: r => `Escribe $${rt(r.n0, r.m0)}$ con el índice más pequeño`,
    foot: () => 'Arrastra el índice y el radicando; las barras comparan los valores',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, a = v(r.n0, r.m0), b = v(s.n, s.m), u = (G.W - 60) / Math.max(a, b, 1) / 1.15, same = Math.abs(a - b) < 1e-9;
      [[`$${rt(r.n0, r.m0)} \\approx ${a.toFixed(3)}$`, a, C.mute], [`$${rt(s.n, s.m)} \\approx ${b.toFixed(3)}$`, b, same ? C.ok : C.sky]].forEach(([t, val, col], i) => { const y = 108 + i * 52; p.noStroke(); p.fill(col); p.rect(24, y, val * u, 22, 4); TK.label(p, C, t, G.W / 2, y + 36, C.ink, 12, G.W - 30); });
      G.X = [RK.track(p, C, 40, G.W - 30, G.tr[0], 5, s.n - 2, i => String(i + 2), C.sky), RK.track(p, C, 40, G.W - 30, G.tr[1], 12, s.m - 1, i => (i % 2 === 1 ? String(i + 1) : null), C.coral)];
      TK.label(p, C, 'índice', 20, G.tr[0] - 16, C.mute, 10, 40); TK.label(p, C, 'radicando', 30, G.tr[1] - 16, C.mute, 10, 60);
      RK.strip(p, C, G.fb, `$${rt(r.n0, r.m0)} ${same ? '=' : '\\ne'} ${rt(s.n, s.m)}$`, { kicker: same && !ok(s, r) ? 'Igual, pero el índice puede ser menor' : '', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[1](0), y: G.tr[1] }, to: { x: G.X[1](3), y: G.tr[1] }, text: 'Arrastra el radicando', ty: G.tr[0] - 34 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const j = G.grab; if (j === 0) { const n = RK.pick(x, 40, G.W - 30, 5) + 2; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } } else { const m = RK.pick(x, 40, G.W - 30, 12) + 1; if (m !== G.s.m || !G.touched[G.cur]) { G.s.m = m; G.touch(); } } };
  return Object.assign(game, { answer });
})();
