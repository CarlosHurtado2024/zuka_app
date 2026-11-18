// El cubo de bloques (Álgebra, alg-21a; spec 2026-11-18-algebra-revision): el cubo de un número es el volumen de un cubo.
// Se arrastra la arista (de 1 a 6) y el cubo se arma con bloquecitos; se ve que el volumen crece mucho más rápido que la
// arista: n³ = n · n · n. Hay que dejar el cubo con el volumen pedido.
// params = { rounds: [{ vol }] }   state = { rounds: [{ n }] }
GAMES['cubo-bloques'] = (() => {
  const need = r => Math.round(Math.cbrt(r.vol));
  const ok = (s, r) => s.n ** 3 === r.vol;
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `arista ${need(r)}: ${need(r)}³ = ${r.vol}`,
    prompt: r => `Arma un cubo de ${r.vol} bloques`,
    foot: () => 'Arrastra la arista del cubo',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, s = Math.min(26, 130 / n), ox = G.W / 2 - n * s * 0.1, oy = 120 + n * s * 0.5 + 40;
      // Proyección isométrica: (i, j, k) → pantalla.
      const P = (i, j, k) => [ox + (i - j) * s * 0.87, oy + (i + j) * s * 0.5 - k * s];
      const face = (pts, col) => { p.fill(col); p.stroke(C.bg); p.strokeWeight(1); p.beginShape(); pts.forEach(q => p.vertex(...q)); p.endShape(p.CLOSE); };
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) face([P(i, j, n), P(i + 1, j, n), P(i + 1, j + 1, n), P(i, j + 1, n)], C.sky);
      for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) face([P(i, n, k), P(i + 1, n, k), P(i + 1, n, k + 1), P(i, n, k + 1)], RK.al(p, C.sky, 160));
      for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) face([P(n, j, k), P(n, j + 1, k), P(n, j + 1, k + 1), P(n, j, k + 1)], RK.al(p, C.sky, 110));
      G.X = RK.track(p, C, 40, G.W - 40, G.tY, 6, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$${n}^3 = ${n} \\cdot ${n} \\cdot ${n} = ${n ** 3}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 1), y: G.tY }, text: 'Arrastra la arista', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 40, G.W - 40, 6) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
