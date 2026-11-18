// Fracciones parciales, coeficiente a coeficiente (Álgebra, alg-102; spec 2026-11-18-algebra-revision): al juntar
// A/(x − p) + B/(x − q) el numerador queda A(x − q) + B(x − p). Se arrastran A y B; dos barras comparan el coeficiente de x
// y el número suelto con los del numerador que hay que obtener. Las dos deben coincidir a la vez: es un sistema.
// params = { rounds: [{ p, q, c, d }] }   (numerador c·x + d)   state = { rounds: [{ A, B }] }   (enteros de −6 a 6)
GAMES['parciales-tapar'] = (() => {
  const R = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  const num = (r, s) => [s.A + s.B, -s.A * r.q - s.B * r.p];
  const ok = (s, r) => { const [c, d] = num(r, s); return c === r.c && d === r.d; };
  const answer = r => { for (const A of R) for (const B of R) if (ok({ A, B }, r)) return { A, B }; return null; };
  const fac = v => `x ${v < 0 ? '+' : '-'} ${Math.abs(v)}`;
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ A: 0, B: 0 }),
    ok,
    solution: r => { const a = answer(r); return `A = ${a.A}, B = ${a.B}`; },
    prompt: r => `Parte $\\dfrac{${r.c === 1 ? '' : r.c}x ${r.d < 0 ? '-' : '+'} ${Math.abs(r.d)}}{(${fac(r.p)})(${fac(r.q)})}$ en $\\dfrac{A}{${fac(r.p)}} + \\dfrac{B}{${fac(r.q)}}$`,
    foot: () => 'Arrastra A y B hasta que las dos barras coincidan con su meta',
    layout(G) { G.tr = [G.H - 158, G.H - 116]; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, [c, d] = num(r, s), cx = G.W / 2, u = Math.min(9, (cx - 50) / 12);
      TK.label(p, C, `$A(${fac(r.q)}) + B(${fac(r.p)}) = ${c}x ${d < 0 ? '-' : '+'} ${Math.abs(d)}$`, cx, 104, C.ink, 14, G.W - 24);
      [['x', c, r.c], ['número', d, r.d]].forEach(([n, v, t], i) => {
        const y = 134 + i * 46;
        TK.label(p, C, n, 34, y + 11, C.mute, 11, 56);
        p.stroke(C.line); p.strokeWeight(1); p.line(cx, y - 6, cx, y + 28);
        p.noStroke(); p.fill(v === t ? C.ok : C.sky); p.rect(cx, y, Math.max(-cx + 70, Math.min(cx - 30, v * u)), 22, 3);
        p.stroke(C.ink); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.line(cx + t * u, y - 6, cx + t * u, y + 28); p.drawingContext.setLineDash([]);
      });
      G.X = ['A', 'B'].map((k, j) => { TK.label(p, C, `${k} = ${s[k]}`, 40, G.tr[j] - 16, C.ink, 11, 70); return RK.track(p, C, 30, G.W - 30, G.tr[j], R.length, R.indexOf(s[k]), i => (i % 3 === 0 ? String(R[i]) : null), j ? C.coral : C.sky); });
      RK.strip(p, C, G.fb, `$\\dfrac{${s.A}}{${fac(r.p)}} + \\dfrac{${s.B}}{${fac(r.q)}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](6), y: G.tr[0] }, to: { x: G.X[0]([8, 4, 9].find(i => R[i] !== answer(G.r).A)), y: G.tr[0] }, text: 'Arrastra A', ty: G.tr[0] - 34 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = R[RK.pick(x, 30, G.W - 30, R.length)], k = G.grab ? 'B' : 'A'; if (v !== G.s[k] || !G.touched[G.cur]) { G.s[k] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
