// El logaritmo es un exponente (Álgebra, alg-72; spec 2026-11-18-algebra-revision): log_b N es cuántas veces hay que
// multiplicar por b (o dividir, si es negativo) para llegar a N desde 1. Se arrastra el exponente n y se ve la cadena de
// factores b y el resultado; hay que llegar justo a N.
// params = { rounds: [{ b, N }] }   state = { rounds: [{ n }] }   (entero de −4 a 8)
GAMES['exponente-buscado'] = (() => {
  const R = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  const ok = (s, r) => Math.abs(r.b ** s.n - r.N) < 1e-9 * Math.max(1, r.N);
  const answer = r => ({ n: R.find(n => ok({ n }, r)) });
  const nt = v => (v >= 1 ? RK.num(v) : `\\tfrac{1}{${RK.num(1 / v)}}`);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `log_${r.b} ${r.N} = ${answer(r).n}`,
    prompt: r => `Calcula $\\log_{${r.b}} ${nt(r.N)}$: ¿cuántas veces ${r.b}?`,
    foot: () => 'Arrastra el exponente; negativo es dividir',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? answer(r).n : G.s.n, k = Math.abs(n), w = Math.min(40, (G.W - 60) / Math.max(1, k) - 4), val = r.b ** n;
      TK.label(p, C, n === 0 ? 'ningún factor: queda 1' : n > 0 ? `1 multiplicado ${k} ${k === 1 ? 'vez' : 'veces'} por ${r.b}` : `1 dividido ${k} ${k === 1 ? 'vez' : 'veces'} entre ${r.b}`, G.W / 2, 108, C.mute, 12, G.W - 30);
      for (let i = 0; i < k; i++) RK.chip(p, C, { x: G.W / 2 - (k * (w + 4) - 4) / 2 + i * (w + 4), y: 128, w, h: 34 }, n > 0 ? `×${r.b}` : `÷${r.b}`, { on: true, col: n > 0 ? C.sky : C.coral, size: 11 });
      TK.label(p, C, `$= ${nt(val)}$`, G.W / 2, 196, ok({ n }, r) ? C.ok : C.ink, 20, G.W - 40);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, R.length, R.indexOf(n), i => (i % 2 === 0 ? String(R[i]) : null));
      RK.strip(p, C, G.fb, `$${r.b}^{${n}} = ${nt(val)}$`, { kicker: ok({ n }, r) ? `Logaritmo: ${n}` : `Meta: ${r.N >= 1 ? r.N : `1/${1 / r.N}`}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(5), y: G.tY }, to: { x: G.X(7), y: G.tY }, text: 'Arrastra el exponente', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = R[RK.pick(x, 24, G.W - 24, R.length)]; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { answer });
})();
