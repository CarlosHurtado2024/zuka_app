// El término buscado (Álgebra, alg-24c; spec 2026-11-18-algebra-revision): en (x + c)ⁿ los exponentes de x bajan de n a 0
// mientras los de c suben. Se arrastra el número de término k (de 0 a n) y se ve el término C(n, k)·xⁿ⁻ᵏ·cᵏ con su
// coeficiente calculado. Hay que llegar al término que tiene la potencia de x pedida.
// params = { rounds: [{ n, c, p }] }   state = { rounds: [{ k }] }
GAMES['exponentes-binomio'] = (() => {
  const C_ = (n, k) => (k === 0 || k === n ? 1 : C_(n - 1, k - 1) + C_(n - 1, k));
  const ok = (s, r) => r.n - s.k === r.p;
  const coef = (r, k) => C_(r.n, k) * r.c ** k;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ k: 0 }),
    ok,
    solution: r => `k = ${r.n - r.p}: ${coef(r, r.n - r.p)}x^${r.p}`,
    prompt: r => `En $(x + ${r.c})^{${r.n}}$, busca el término con $x^{${r.p}}$`,
    foot: () => 'Arrastra el término: los exponentes de x bajan y los del número suben',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? r.n - r.p : G.s.k, w = Math.min(54, (G.W - 20) / (r.n + 1) - 4);
      for (let j = 0; j <= r.n; j++) { const b = { x: G.W / 2 - ((r.n + 1) * (w + 4) - 4) / 2 + j * (w + 4), y: 118, w, h: 44 }; RK.chip(p, C, b, `$x^{${r.n - j}}${r.c}^{${j}}$`, { on: j === k, col: j === k ? C.brand : C.sky, size: 11 }); }
      TK.label(p, C, `$C(${r.n}, ${k})\\, x^{${r.n - k}}\\cdot ${r.c}^{${k}} = ${coef(r, k)}\\,x^{${r.n - k}}$`, G.W / 2, 196, C.ink, 17, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, r.n + 1, k, i => String(i));
      RK.strip(p, C, G.fb, `$\\text{término } k = ${k}:\\ ${coef(r, k)}\\,x^{${r.n - k}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k), y: G.tY }, to: { x: G.X(Math.min(G.r.n, G.s.k + 2)), y: G.tY }, text: 'Arrastra el término', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 30, G.W - 30, G.r.n + 1); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { coef });
})();
