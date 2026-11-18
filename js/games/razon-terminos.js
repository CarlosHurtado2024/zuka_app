// La razón escondida (Álgebra, alg-14c; spec 2026-11-18-algebra-revision): con dos términos de una progresión geométrica
// se halla la razón. Se ven aᵢ y aⱼ en su puesto; se arrastra la razón r y los términos de en medio se llenan
// multiplicando: hay que caer justo en el segundo término. Entre ellos hay j − i multiplicaciones: rʲ⁻ⁱ = aⱼ / aᵢ.
// params = { rounds: [{ i, ai, j, aj }] }   state = { rounds: [{ k }] }   (índice de la razón en R)
GAMES['razon-terminos'] = (() => {
  const R = [-3, -2, -1.5, -0.5, 0.5, 1.5, 2, 3, 4, 5];
  const need = r => R.findIndex(x => Math.abs(r.ai * x ** (r.j - r.i) - r.aj) < 1e-9);
  const ok = (s, r) => Math.abs(r.ai * R[s.k] ** (r.j - r.i) - r.aj) < 1e-9;   // vale cualquier razón que funcione (±3 si el salto es par)
  const game = roundsGame({
    aspect: 1,
    init: () => ({ k: 5 }),
    ok,
    solution: r => `r = ${R[need(r)]}: ${r.ai} · (${R[need(r)]})^${r.j - r.i} = ${r.aj}`,
    prompt: r => `$a_{${r.i}} = ${RK.num(r.ai)}$ y $a_{${r.j}} = ${RK.num(r.aj)}$. Halla la razón`,
    foot: () => 'Arrastra la razón: los términos de en medio se llenan solos',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? need(r) : G.s.k, x = R[k], n = r.j - r.i + 1, w = Math.min(64, (G.W - 24) / n - 6);
      for (let t = 0; t < n; t++) {
        const v = r.ai * x ** t, b = { x: G.W / 2 - (n * (w + 6) - 6) / 2 + t * (w + 6), y: 150, w, h: 42 }, last = t === n - 1;
        RK.chip(p, C, b, `$${RK.num(+v.toFixed(4))}$`, { on: t === 0 || last, col: last ? (Math.abs(v - r.aj) < 1e-9 ? C.ok : C.coral) : C.sky, size: 14 });
        TK.label(p, C, `$a_{${r.i + t}}$`, b.x + w / 2, b.y - 14, C.mute, 11, w);
        if (t) TK.label(p, C, `×${RK.num(x).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}`, b.x - 3, b.y + 58, C.mute, 10, 40);
      }
      TK.label(p, C, `meta: ${RK.num(r.aj).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}`, G.W / 2, 228, C.ok, 12, 120);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, R.length, k, i => RK.num(R[i]).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2'));
      RK.strip(p, C, G.fb, `$r^{${r.j - r.i}} = \\tfrac{a_{${r.j}}}{a_{${r.i}}}\\qquad r = ${RK.num(x)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k), y: G.tY }, to: { x: G.X(G.s.k + 2), y: G.tY }, text: 'Arrastra la razón', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 24, G.W - 24, R.length); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { need, R });
})();
