// ¿Cuándo se encuentran? (Álgebra, alg-1; spec 2026-11-18-algebra-revision): dos caminantes en un mismo camino; uno sale
// adelante y el otro va más rápido. Su posición es lineal en el tiempo: a·t + b. Se arrastra el reloj y se mueven los
// dos; hay que parar el reloj cuando están en el mismo punto: a·t + b = c·t + d.
// params = { rounds: [{ A: [vel, inicio], B: [vel, inicio], max }] }   state = { rounds: [{ t }] }   (minutos enteros)
GAMES['encuentro-caminantes'] = (() => {
  const pos = (q, t) => q[0] * t + q[1];
  const need = r => (r.B[1] - r.A[1]) / (r.A[0] - r.B[0]);
  const ok = (s, r) => pos(r.A, s.t) === pos(r.B, s.t);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ t: 0 }),
    ok,
    solution: r => `t = ${need(r)}: ${r.A[0]}t + ${r.A[1]} = ${r.B[0]}t + ${r.B[1]}`,
    prompt: r => `Ana sale a ${r.A[1]} m y anda ${r.A[0]} m/min; Beto, a ${r.B[1]} m, ${r.B[0]} m/min. ¿Cuándo se juntan?`,
    foot: () => 'Arrastra el reloj',
    layout(G) { G.y1 = 150; G.y2 = 200; G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, t = G.locked && !ok(G.s, r) ? need(r) : G.s.t, D = Math.max(pos(r.A, r.max), pos(r.B, r.max)) * 1.05, X = v => 20 + (G.W - 40) * v / D;
      [[G.y1, r.A, C.sky, 'Ana'], [G.y2, r.B, C.coral, 'Beto']].forEach(([y, q, col, n]) => { p.stroke(C.line); p.strokeWeight(2); p.line(20, y + 12, G.W - 20, y + 12); const x = X(pos(q, t)); p.noStroke(); p.fill(col); p.circle(x, y, 18); TK.label(p, C, `${n}: ${pos(q, t)} m`, Math.min(G.W - 50, Math.max(50, x)), y - 18, col, 11, 90); });
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, r.max + 1, t, i => (i % 2 === 0 ? String(i) : null));
      TK.label(p, C, `t = ${t} min`, G.W / 2, G.tY - 22, C.ink, 13, 100);
      RK.strip(p, C, G.fb, `$${r.A[0]}\\cdot${t} + ${r.A[1]} = ${pos(r.A, t)} \\quad ${r.B[0]}\\cdot${t} + ${r.B[1]} = ${pos(r.B, t)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.t), y: G.tY }, to: { x: G.X(G.s.t + 4), y: G.tY }, text: 'Arrastra el reloj', ty: G.tY - 46 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const t = RK.pick(x, 30, G.W - 30, G.r.max + 1); if (t !== G.s.t || !G.touched[G.cur]) { G.s.t = t; G.touch(); } };
  return Object.assign(game, { need });
})();
