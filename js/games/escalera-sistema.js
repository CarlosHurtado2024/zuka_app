// Sistema escalonado de tres ecuaciones (Álgebra, alg-101; spec 2026-11-18-algebra-revision): si la última ecuación tiene
// una sola incógnita, se resuelve de abajo hacia arriba. Tres ecuaciones y tres deslizadores (x, y, z); cada ecuación se
// enciende cuando se cumple con los valores puestos. Hay que encender las tres.
// params = { rounds: [{ eqs: [[a, b, c, d]] , sol: [x, y, z] }] }   (ax + by + cz = d)   state = { rounds: [{ v: [x, y, z] }] }   (de −5 a 5)
GAMES['escalera-sistema'] = (() => {
  const holds = (e, v) => e[0] * v[0] + e[1] * v[1] + e[2] * v[2] === e[3];
  const ok = (s, r) => r.eqs.every(e => holds(e, s.v));
  const eqt = e => { const parts = ['x', 'y', 'z'].map((n, i) => [e[i], n]).filter(([k]) => k); return parts.map(([k, n], i) => `${k < 0 ? '-' : i ? '+' : ''}${Math.abs(k) === 1 ? '' : Math.abs(k)}${n}`).join(' ') + ` = ${e[3]}`; };
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ v: [0, 0, 0] }),
    ok,
    solution: r => `x = ${r.sol[0]}, y = ${r.sol[1]}, z = ${r.sol[2]}`,
    prompt: () => 'Resuelve el sistema de abajo hacia arriba',
    foot: () => 'Arrastra x, y y z; cada ecuación se enciende al cumplirse',
    layout(G) { G.tr = [G.H - 194, G.H - 152, G.H - 110]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: r.sol } : G.s;
      r.eqs.forEach((e, i) => { const g = holds(e, s.v); RK.chip(p, C, { x: 24, y: 104 + i * 42, w: G.W - 48, h: 34 }, `$${eqt(e)}$`, { on: g, col: g ? C.ok : C.line, size: 14 }); });
      G.X = ['x', 'y', 'z'].map((n, j) => { TK.label(p, C, `${n} = ${s.v[j]}`, 30, G.tr[j] - 14, C.ink, 11, 50); return RK.track(p, C, 34, G.W - 24, G.tr[j], 11, s.v[j] + 5, i => (i % 2 === 0 ? String(i - 5) : null), [C.sky, C.mint, C.coral][j]); });
      const n = r.eqs.filter(e => holds(e, s.v)).length;
      RK.strip(p, C, G.fb, `$(x, y, z) = (${s.v.join(', ')})$`, { kicker: `${n} de 3 ecuaciones se cumplen`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 18); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[2](5), y: G.tr[2] }, to: { x: G.X[2]([9, 1, 8].find(i => i - 5 !== G.r.sol[2])), y: G.tr[2] }, text: 'Empieza por z', ty: G.tr[0] - 28 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 34, G.W - 24, 11) - 5, j = G.grab; if (v !== G.s.v[j] || !G.touched[G.cur]) { G.s.v[j] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ v: r.sol }) });
})();
