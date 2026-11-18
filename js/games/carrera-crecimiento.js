// Sumar o multiplicar (Álgebra, alg-14c; spec 2026-11-18-algebra-revision): una progresión aritmética crece en línea recta
// y una geométrica crece cada vez más rápido. Dos columnas de barras, una que suma d y otra que multiplica por r; se
// arrastra el puesto n y hay que encontrar el primer término en que la geométrica pasa a la aritmética.
// params = { rounds: [{ a, d, g, r }] }   (aritmética a + (n−1)d; geométrica g·rⁿ⁻¹)   state = { rounds: [{ n }] }
GAMES['carrera-crecimiento'] = (() => {
  const MAX = 10;
  const A = (q, n) => q.a + (n - 1) * q.d, Gm = (q, n) => q.g * q.r ** (n - 1);
  const need = q => { for (let n = 1; n <= MAX; n++) if (Gm(q, n) > A(q, n)) return n; return -1; };
  const ok = (s, q) => s.n === need(q);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ n: 1 }),
    ok,
    solution: q => `en el término ${need(q)}: ${Gm(q, need(q))} > ${A(q, need(q))}`,
    prompt: q => `Suma ${q.d} desde ${q.a} o multiplica por ${q.r} desde ${q.g}: ¿cuándo pasa la segunda?`,
    foot: () => 'Arrastra el puesto: busca el primero en que la barra coral pasa a la azul',
    layout(G) { G.base = G.H - 150; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q } = G, n = G.locked && !ok(G.s, q) ? need(q) : G.s.n, top = Math.max(A(q, MAX), Gm(q, Math.min(MAX, need(q) + 1))) * 1.1, Y = v => G.base - (G.base - 110) * Math.min(v, top) / top, w = (G.W - 40) / MAX;
      for (let k = 1; k <= n; k++) { const x = 20 + (k - 1) * w; p.noStroke(); p.fill(C.sky); p.rect(x + 2, Y(A(q, k)), w / 2 - 3, G.base - Y(A(q, k)), 2); p.fill(C.coral); p.rect(x + w / 2 + 1, Y(Gm(q, k)), w / 2 - 3, G.base - Y(Gm(q, k)), 2); }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, MAX, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$a_{${n}} = ${A(q, n)}\\qquad g_{${n}} = ${Gm(q, n)}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 3), y: G.tY }, text: 'Arrastra el puesto', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
