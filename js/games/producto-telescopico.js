// Productoria telescópica (Álgebra, alg-15; spec 2026-11-18-algebra-revision): en Π (k + 1)/k cada numerador se cancela con
// el denominador siguiente y solo quedan los extremos. Se arrastra el límite de arriba n; la fila de fracciones crece y
// las que se cancelan se apagan. Hay que llegar al producto pedido.
// params = { rounds: [{ kind: 'up' | 'down', target }] }   ('up': Π_{k=1}^n (k+1)/k = n + 1; 'down': Π_{k=2}^n (k−1)/k = 1/n)
// state = { rounds: [{ n }] }   (n de 2 a 12)
GAMES['producto-telescopico'] = (() => {
  const val = (r, n) => (r.kind === 'up' ? n + 1 : 1 / n);
  const ok = (s, r) => Math.abs(val(r, s.n) - r.target) < 1e-12;
  const answer = r => ({ n: r.kind === 'up' ? r.target - 1 : Math.round(1 / r.target) });
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ n: 2 }),
    ok,
    solution: r => `n = ${answer(r).n}`,
    prompt: r => (r.kind === 'up' ? `¿Hasta qué n da ${r.target} el producto $\\prod_{k=1}^{n} \\tfrac{k+1}{k}$?` : `¿Hasta qué n da $\\tfrac{1}{${Math.round(1 / r.target)}}$ el producto $\\prod_{k=2}^{n} \\tfrac{k-1}{k}$?`),
    foot: () => 'Arrastra n y mira qué se cancela',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, ks = r.kind === 'up' ? Array.from({ length: s.n }, (_, i) => i + 1) : Array.from({ length: s.n - 1 }, (_, i) => i + 2);
      const show = ks.length > 6 ? [...ks.slice(0, 3), null, ...ks.slice(-2)] : ks, w = (G.W - 30) / show.length;
      show.forEach((k, i) => {
        const x = 15 + i * w + w / 2;
        if (k == null) { TK.label(p, C, '⋯', x, 150, C.mute, 16, w); return; }
        const [a, b] = r.kind === 'up' ? [k + 1, k] : [k - 1, k], first = i === 0, last = i === show.length - 1;
        const keepTop = r.kind === 'up' ? last : first, keepBot = r.kind === 'up' ? first : last;
        TK.label(p, C, String(a), x, 132, keepTop ? C.ok : RK.al(p, C.mute, 120), 15, w); p.stroke(C.ink); p.strokeWeight(1.4); p.line(x - w * 0.3, 148, x + w * 0.3, 148);
        TK.label(p, C, String(b), x, 164, keepBot ? C.ok : RK.al(p, C.mute, 120), 15, w);
        if (!keepTop) { p.stroke(C.coral); p.line(x - 8, 140, x + 8, 124); } if (!keepBot) { p.stroke(C.coral); p.line(x - 8, 172, x + 8, 156); }
      });
      const v = val(r, s.n);
      TK.label(p, C, `quedan los extremos: ${r.kind === 'up' ? `${s.n + 1}/1` : `1/${s.n}`}`, G.W / 2, 200, C.ink, 12, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 11, s.n - 2, i => String(i + 2));
      RK.strip(p, C, G.fb, `$\\text{producto} = ${r.kind === 'up' ? v : `\\tfrac{1}{${s.n}}`}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(1), y: G.tY }, text: 'Arrastra n', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 11) + 2; if (v !== G.s.n || !G.touched[G.cur]) { G.s.n = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
