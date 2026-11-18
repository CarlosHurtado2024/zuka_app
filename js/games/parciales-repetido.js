// Fracciones parciales con un factor repetido (Álgebra, alg-102; spec 2026-11-18-algebra-revision): un factor al cuadrado
// (x − p)² pide dos fracciones, A/(x − p) + B/(x − p)², y al juntarlas el numerador es A(x − p) + B. Se arrastran A y B; dos
// barras comparan el coeficiente de x y el número suelto con los del numerador pedido.
// params = { rounds: [{ p, c, d }] }   (numerador c·x + d)   state = { rounds: [{ A, B }] }   (de −8 a 8)
GAMES['parciales-repetido'] = (() => {
  const R = Array.from({ length: 17 }, (_, i) => i - 8);
  const num = (r, s) => [s.A, -s.A * r.p + s.B];
  const ok = (s, r) => { const [c, d] = num(r, s); return c === r.c && d === r.d; };
  const answer = r => ({ A: r.c, B: r.d + r.c * r.p });
  const fac = v => `x ${v < 0 ? '+' : '-'} ${Math.abs(v)}`;
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ A: 0, B: 0 }),
    ok,
    solution: r => `A = ${answer(r).A}, B = ${answer(r).B}`,
    prompt: r => `Parte $\\dfrac{${r.c === 1 ? '' : r.c === -1 ? '-' : r.c}x ${r.d < 0 ? '-' : '+'} ${Math.abs(r.d)}}{(${fac(r.p)})^2}$ en $\\dfrac{A}{${fac(r.p)}} + \\dfrac{B}{(${fac(r.p)})^2}$`,
    foot: () => 'Arrastra A y B hasta que las barras lleguen a su meta',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, [c, d] = num(r, s), cx = G.W / 2, u = Math.min(9, (cx - 50) / 16);
      TK.label(p, C, `$A(${fac(r.p)}) + B = ${c}x ${d < 0 ? '-' : '+'} ${Math.abs(d)}$`, cx, 104, C.ink, 14, G.W - 24);
      [['x', c, r.c], ['número', d, r.d]].forEach(([n, v, t], i) => {
        const y = 134 + i * 46;
        TK.label(p, C, n, 34, y + 11, C.mute, 11, 56);
        p.stroke(C.line); p.strokeWeight(1); p.line(cx, y - 6, cx, y + 28);
        p.noStroke(); p.fill(v === t ? C.ok : C.sky); p.rect(cx, y, Math.max(-cx + 70, Math.min(cx - 30, v * u)), 22, 3);
        p.stroke(C.ink); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.line(cx + t * u, y - 6, cx + t * u, y + 28); p.drawingContext.setLineDash([]);
      });
      G.X = ['A', 'B'].map((k, j) => { TK.label(p, C, `${k} = ${s[k]}`, 40, G.tr[j] - 16, C.ink, 11, 70); return RK.track(p, C, 30, G.W - 30, G.tr[j], R.length, s[k] + 8, i => (i % 4 === 0 ? String(R[i]) : null), j ? C.coral : C.sky); });
      RK.strip(p, C, G.fb, `$\\dfrac{${s.A}}{${fac(r.p)}} + \\dfrac{${s.B}}{(${fac(r.p)})^2}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[1](8), y: G.tr[1] }, to: { x: G.X[1]([14, 2, 13].find(i => R[i] !== answer(G.r).B)), y: G.tr[1] }, text: 'Arrastra B', ty: G.tr[0] - 32 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = R[RK.pick(x, 30, G.W - 30, R.length)], k = G.grab ? 'B' : 'A'; if (v !== G.s[k] || !G.touched[G.cur]) { G.s[k] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
