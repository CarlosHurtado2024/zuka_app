// Puntos porcentuales o por ciento (Álgebra, alg-13d; spec 2026-11-18-algebra-revision): si una tasa pasa del 20 % al 25 %,
// subió 5 puntos, pero creció un 25 %: el cambio se mide sobre el valor de antes. Dos barras (antes y después) y la de la
// diferencia; se arrastra el cambio relativo hasta que la diferencia, comparada con la barra de antes, quede bien medida.
// params = { rounds: [{ what, from, to }] }   state = { rounds: [{ p }] }   (p de −50 a 100, de 5 en 5)
GAMES['puntos-o-porciento'] = (() => {
  const P = Array.from({ length: 31 }, (_, i) => -50 + i * 5);
  const need = r => (r.to - r.from) / r.from * 100;
  const ok = (s, r) => Math.abs(s.p - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ p: 0 }),
    ok,
    solution: r => `${r.to - r.from > 0 ? '+' : '−'}${Math.abs(r.to - r.from)} puntos = ${need(r) > 0 ? '+' : ''}${need(r)} %`,
    prompt: r => `${r.what} pasó del ${r.from} % al ${r.to} %. ¿En qué porcentaje cambió?`,
    foot: () => 'Arrastra el cambio: se mide sobre el valor de antes',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, pc = G.locked && !ok(G.s, r) ? need(r) : G.s.p, x0 = 24, u = (G.W - 60) / Math.max(r.from, r.to, r.from * 2), y = 112;
      [['antes', r.from, C.sky], ['después', r.to, C.mint]].forEach(([t, v, col], i) => { p.noStroke(); p.fill(col); p.rect(x0, y + i * 36, v * u, 24, 4); TK.label(p, C, `${t}: ${v} %`, x0 + v * u + 46, y + i * 36 + 12, C.ink, 10, 86); });
      const pred = r.from * (1 + pc / 100), good = ok({ p: pc }, r);
      p.noStroke(); p.fill(RK.al(p, good ? C.ok : C.coral, 150)); p.rect(x0, y + 80, pred * u, 24, 4);
      TK.label(p, C, `${r.from} con ${pc > 0 ? '+' : ''}${pc} %: ${+pred.toFixed(2)}`, G.W / 2, y + 120, good ? C.ok : C.mute, 11, G.W - 30);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, P.length, P.indexOf(pc), i => (i % 5 === 0 ? `${P[i]}` : null));
      RK.strip(p, C, G.fb, `$\\dfrac{${r.to} - ${r.from}}{${r.from}} ${good ? '=' : '\\ne'} ${pc}\\%$`, { kicker: `${Math.abs(r.to - r.from)} puntos de diferencia`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(10), y: G.tY }, to: { x: G.X(13), y: G.tY }, text: 'Arrastra el cambio', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = P[RK.pick(x, 24, G.W - 24, P.length)]; if (v !== G.s.p || !G.touched[G.cur]) { G.s.p = v; G.touch(); } };
  return Object.assign(game, { need });
})();
