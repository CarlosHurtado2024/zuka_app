// La fila suma una potencia de 2 (Álgebra, alg-24c; spec 2026-11-18-algebra-revision): los coeficientes de (a + b)ⁿ suman
// 2ⁿ, porque cuentan todas las maneras de elegir a o b en n paréntesis. Se arrastra n y la fila de Pascal se dibuja como
// barras apiladas con su suma. Hay que llegar a la suma pedida.
// params = { rounds: [{ total }] }   state = { rounds: [{ n }] }   (de 0 a 8)
GAMES['fila-potencia'] = (() => {
  const row = n => GAMES['triangulo-pascal'].row(n);
  const ok = (s, r) => 2 ** s.n === r.total;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `n = ${Math.log2(r.total)}: 2^${Math.log2(r.total)} = ${r.total}`,
    prompt: r => `¿En qué fila de Pascal los números suman ${r.total}?`,
    foot: () => 'Arrastra la fila',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? Math.log2(r.total) : G.s.n, R = row(n), tot = 2 ** n, k = (G.W - 40) / 256;
      let x = 20; R.forEach((v, i) => { p.stroke(C.bg); p.strokeWeight(1); p.fill(i % 2 ? C.sky : C.mint); p.rect(x, 150, v * k, 34); x += v * k; });
      p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.rect(20, 144, r.total * k, 46, 4);
      TK.label(p, C, R.join('  '), G.W / 2, 118, C.ink, 13, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 9, n, i => String(i));
      RK.strip(p, C, G.fb, `$${R.join(' + ')} = ${tot} = 2^{${n}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n), y: G.tY }, to: { x: G.X(G.s.n + 3), y: G.tY }, text: 'Arrastra la fila', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, 9); if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return game;
})();
