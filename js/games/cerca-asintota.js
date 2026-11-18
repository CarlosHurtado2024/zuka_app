// Cerca de la asíntota (Álgebra, alg-25a; spec 2026-11-18-algebra-revision): cuando el denominador se acerca a 0, la
// fracción se dispara. Se arrastra x cada vez más cerca del valor prohibido (en pasos que se achican) y una barra muestra
// el valor de la fracción, que crece sin límite. Hay que encontrar el primer paso en que la fracción supera la meta.
// params = { rounds: [{ k, a, side: 1 | -1, target }] }   (f = k/(x − a); x = a + side·d)   state = { rounds: [{ i }] }   (índice en D)
GAMES['cerca-asintota'] = (() => {
  const D = [1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.001];
  const f = (r, d) => r.k / (r.side * d);
  const need = r => D.findIndex(d => Math.abs(f(r, d)) > r.target);
  const ok = (s, r) => s.i === need(r);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ i: 0 }),
    ok,
    solution: r => `a ${D[need(r)]} de distancia: |f| = ${Math.abs(f(r, D[need(r)]))}`,
    prompt: r => `Acércate a x = ${r.a} ${r.side > 0 ? 'por la derecha' : 'por la izquierda'}: ¿cuándo pasa |f| de ${r.target}?`,
    foot: () => 'Arrastra la distancia al valor prohibido',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, i = G.locked && !ok(G.s, r) ? need(r) : G.s.i, d = D[i], v = f(r, d), x = r.a + r.side * d, top = G.tY - 60, base = 112, scale = Math.log10(Math.abs(v) + 1) / Math.log10(Math.abs(f(r, 0.001)) + 1);
      p.noStroke(); p.fill(v > 0 ? C.sky : C.coral); p.rect(G.W / 2 - 30, top - (top - base) * scale, 60, (top - base) * scale, 4);
      TK.label(p, C, `f(${+x.toFixed(4)}) = ${+v.toFixed(2)}`, G.W / 2, base - 6, ok({ i }, r) ? C.ok : C.ink, 14, G.W - 30);
      TK.label(p, C, '(escala que se comprime)', G.W / 2, top + 12, C.mute, 9, 150);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, D.length, i, k => (k % 2 === 0 ? String(D[k]) : null));
      const fx = `x ${r.a < 0 ? '+' : '-'} ${Math.abs(r.a)}`;
      RK.strip(p, C, G.fb, `$\\dfrac{${r.k}}{${fx}}\\ \\text{con } ${fx} = ${r.side > 0 ? '' : '-'}${d}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.i), y: G.tY }, to: { x: G.X([2, 3, 4].map(d => G.s.i + d).find(i => i !== need(G.r) && i < 9)), y: G.tY }, text: 'Acércate', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const i = RK.pick(x, 24, G.W - 24, D.length); if (i !== G.s.i || !G.touched[G.cur]) { G.s.i = i; G.touch(); } };
  return Object.assign(game, { need });
})();
