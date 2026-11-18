// El tanque que gotea (Álgebra, alg-14; spec 2026-11-18-algebra-revision): una progresión aritmética que baja. El tanque
// empieza con a₁ litros y cada hora pierde lo mismo (la diferencia es negativa). Se arrastran las horas y aparece una
// barra por hora; hay que encontrar la hora en que el nivel llega a la marca: aₙ = a₁ + (n − 1)·d.
// params = { rounds: [{ a1, d, target }] }   (d < 0)   state = { rounds: [{ n }] }   (n de 1 a 12: la n-ésima medición)
GAMES['goteo-tanque'] = (() => {
  const MAX = 12;
  const term = (r, n) => r.a1 + (n - 1) * r.d;
  const need = r => (r.target - r.a1) / r.d + 1;
  const ok = (s, r) => term(r, s.n) === r.target;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `medición ${need(r)}: ${r.a1} + ${need(r) - 1} · (${r.d}) = ${r.target}`,
    prompt: r => `Empieza con ${r.a1} L y pierde ${-r.d} L por hora. ¿En qué medición marca ${r.target}?`,
    foot: () => 'La primera medición es al empezar: entre la 1 y la n hay n − 1 horas',
    layout(G) { G.base = G.H - 150; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, w = (G.W - 40) / MAX, Y = v => G.base - (G.base - 110) * v / r.a1;
      for (let k = 1; k <= n; k++) { const v = term(r, k); p.noStroke(); p.fill(v === r.target && k === n ? C.ok : C.sky); p.rect(20 + (k - 1) * w + 2, Y(Math.max(0, v)), w - 4, G.base - Y(Math.max(0, v)), 3); if (w > 18) TK.label(p, C, String(v), 20 + (k - 0.5) * w, Y(Math.max(0, v)) - 9, C.mute, 9, w); }
      p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.line(16, Y(r.target), G.W - 16, Y(r.target)); p.drawingContext.setLineDash([]);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, MAX, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$a_{${n}} = ${r.a1} + ${n - 1}\\cdot(${r.d}) = ${term(r, n)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 3), y: G.tY }, text: 'Arrastra las mediciones', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
