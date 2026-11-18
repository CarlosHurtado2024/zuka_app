// Copias de una raíz (Álgebra, alg-22b; spec 2026-11-18-algebra-revision): meter el coeficiente al radical. k√n son k
// segmentos de largo √n puestos en fila. Debajo hay un solo segmento √m; se arrastra m hasta que mida lo mismo que la
// fila. Así se ve que k√n = √(k²·n), y comparar dos radicales es fácil cuando los dos están adentro.
// params = { rounds: [{ k, n }] }   state = { rounds: [{ m }] }   (de 1 a 100)
GAMES['copias-raiz'] = (() => {
  const need = r => r.k * r.k * r.n;
  const ok = (s, r) => s.m === need(r);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ m: 10 }),
    ok,
    solution: r => `${r.k}√${r.n} = √${need(r)}`,
    prompt: r => `Escribe $${r.k}\\sqrt{${r.n}}$ como una sola raíz`,
    foot: () => 'Arrastra hasta que el segmento de abajo mida lo mismo que la fila',
    layout(G) { G.tY = G.H - 110; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, m = G.locked && !ok(G.s, r) ? need(r) : G.s.m, u = (G.W - 40) / Math.sqrt(100), y1 = 140, y2 = 196;
      for (let i = 0; i < r.k; i++) { const x = 20 + i * Math.sqrt(r.n) * u; p.stroke(i % 2 ? C.sky : C.mint); p.strokeWeight(8); p.line(x + 1, y1, x + Math.sqrt(r.n) * u - 1, y1); TK.label(p, C, `√${r.n}`, x + Math.sqrt(r.n) * u / 2, y1 - 16, C.mute, 10, 40); }
      const L = Math.sqrt(m) * u, good = ok({ m }, r);
      p.stroke(good || G.locked ? C.ok : C.coral); p.strokeWeight(8); p.line(20, y2, 20 + L, y2); TK.label(p, C, `√${m} ≈ ${Math.sqrt(m).toFixed(2)}`, Math.min(G.W - 60, 20 + L + 50), y2 + 18, C.ink, 11, 100);
      p.stroke(C.line); p.strokeWeight(1); p.drawingContext.setLineDash([3, 4]); p.line(20 + r.k * Math.sqrt(r.n) * u, y1 - 10, 20 + r.k * Math.sqrt(r.n) * u, y2 + 10); p.drawingContext.setLineDash([]);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, 100, m - 1, i => ((i + 1) % 20 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$${r.k}\\sqrt{${r.n}} = \\sqrt{${r.k}^2 \\cdot ${r.n}} \\;\\;?\\;\\; \\sqrt{${m}}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.m - 1), y: G.tY }, to: { x: G.X(G.s.m + 20), y: G.tY }, text: 'Arrastra m', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const m = RK.pick(x, 24, G.W - 24, 100) + 1; if (m !== G.s.m || !G.touched[G.cur]) { G.s.m = m; G.touch(); } };
  return Object.assign(game, { need });
})();
