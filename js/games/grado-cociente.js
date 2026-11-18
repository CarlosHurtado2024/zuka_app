// Grados en la división (Álgebra, alg-23b; spec 2026-11-18-algebra-revision): si P = D·Q + R, el grado de P es el de D
// más el de Q, y el residuo tiene grado menor que D. Torres de bloques muestran los grados; se arrastra el grado del
// cociente hasta que D y Q apilados igualen a P.
// params = { rounds: [{ n, m }] }   (grado de P y de D)   state = { rounds: [{ q }] }   (de 0 a 6)
GAMES['grado-cociente'] = (() => {
  const ok = (s, r) => s.q === r.n - r.m;
  const game = roundsGame({
    aspect: 1,
    init: r => ({ q: r.n - r.m === 1 ? 2 : 1 }),
    ok,
    solution: r => `grado del cociente ${r.n - r.m}; el residuo, menor que ${r.m}`,
    prompt: r => `P tiene grado ${r.n} y el divisor grado ${r.m}. ¿Grado del cociente?`,
    foot: () => 'Arrastra el grado del cociente: al multiplicar, los grados se suman',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, q = G.locked && !ok(G.s, r) ? r.n - r.m : G.s.q, h = 18, base = G.tY - 50;
      const tower = (x, k, col, t) => { for (let i = 0; i < k; i++) { p.stroke(C.bg); p.fill(col); p.rect(x, base - (i + 1) * h, 50, h - 2, 3); } TK.label(p, C, t, x + 25, base + 12, C.mute, 11, 70); };
      tower(30, r.n, C.sky, `P: ${r.n}`); tower(120, r.m, C.mint, `D: ${r.m}`);
      for (let i = 0; i < q; i++) { p.stroke(C.bg); p.fill(C.coral); p.rect(120, base - (r.m + i + 1) * h, 50, h - 2, 3); }
      TK.label(p, C, `Q: ${q}`, 200, base - (r.m + q) * h, C.coral, 11, 50);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 7, q, i => String(i));
      RK.strip(p, C, G.fb, `$${r.m} + ${q} = ${r.m + q}\\quad\\text{(P tiene ${r.n})}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.q), y: G.tY }, to: { x: G.X(G.s.q + 2), y: G.tY }, text: 'Arrastra el grado', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const q = RK.pick(x, 30, G.W - 30, 7); if (q !== G.s.q || !G.touched[G.cur]) { G.s.q = q; G.touch(); } };
  return game;
})();
