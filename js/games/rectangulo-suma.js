// El rectángulo de la suma (Trigonometría, trig-48a): un triángulo de hipotenusa 1 inclinado dentro de un rectángulo. El lado izquierdo
// mide sen(α + β) y es igual al derecho, que tiene dos tramos; el de arriba mide cos(α + β): el de abajo menos un pedazo.
// item = { ask: 'sen'|'cos', a?, b?, vals?: [cc, sc, cs, ss] (TeX), res? }
GAMES['rectangulo-suma'] = (() => {
  const LAB = ['\\cos\\alpha\\cos\\beta', '\\operatorname{sen}\\alpha\\cos\\beta', '\\cos\\alpha\\operatorname{sen}\\beta', '\\operatorname{sen}\\alpha\\operatorname{sen}\\beta'];
  const want = it => (it.ask === 'sen' ? [1, 2] : [0, 3]), lab = (it, i) => it.vals?.[i] ?? LAB[i];
  const name = it => `${TK.FN[it.ask]}${it.a ? ` ${it.a + it.b}^\\circ` : '(\\alpha + \\beta)'}`;
  return questGame({
    aspect: 1.35,
    init: () => ({ pick: [] }),
    ok: (s, it) => (it.ask === 'sen' ? [...s.pick].sort().join() : s.pick.join()) === want(it).join(),
    answer: it => ({ pick: want(it) }),
    solution: it => `$${name(it)} = ${lab(it, want(it)[0])} ${it.ask === 'sen' ? '+' : '-'} ${lab(it, want(it)[1])}${it.res ? ` = ${it.res}` : ''}$`,
    prompt: it => (it.ask === 'sen' ? 'Toca los dos tramos que, sumados, dan el lado «?»' : 'Toca dos tramos: uno menos el otro debe dar el lado «?»'),
    foot: it => (it.a ? `Aquí $\\alpha = ${it.a}^\\circ$ y $\\beta = ${it.b}^\\circ$` : 'El triángulo inclinado tiene hipotenusa 1'),
    no: it => (it.ask === 'sen' ? 'Mira el lado derecho: está hecho de dos tramos' : 'Primero el tramo largo de abajo; después el pedacito de arriba'),
    retry: G => { G.s.pick = []; },
    layout(G) {
      const it = G.item, al = TK.rad(it.a ?? 35), be = TK.rad(it.b ?? 25), xA = Math.cos(al) * Math.cos(be), yA = Math.sin(al) * Math.cos(be), xB = Math.cos(al + be), yB = Math.sin(al + be);
      const u = Math.min((G.W - 150) / xA, (G.bottom - G.top - 110) / yB), x0 = 26, yb = G.bottom - 34, P = (x, y) => [x0 + x * u, yb - y * u];
      const O = P(0, 0), F = P(xA, 0), A = P(xA, yA), TR = P(xA, yB), B = P(xB, yB), TL = P(0, yB);
      Object.assign(G, { O, F, A, TR, B, TL, seg: [[O, F], [F, A], [A, TR], [TR, B]], al: it.a ?? 35, be: it.b ?? 25 });
    },
    draw(G) {
      const { p, C, s, item: it, O, F, A, TR, B, TL, seg } = G, col = i => (s.pick[0] === i ? C.sky : s.pick[1] === i ? C.coral : C.ink);
      const sq = i => (s.pick[i] == null ? '\\square' : lab(it, s.pick[i]));
      TK.label(p, C, `$${name(it)} = ${sq(0)} ${it.ask === 'sen' ? '+' : '-'} ${sq(1)}${G.solved && it.res ? ` = ${it.res}` : ''}$`, G.W / 2, G.top + 24, G.solved ? C.ok : C.ink, 17, G.W - 20);
      p.noStroke(); p.fill(C.card); p.triangle(...O, ...A, ...B);
      p.stroke(C.mute); p.strokeWeight(1.5); p.line(...O, ...A); p.line(...A, ...B); p.line(...O, ...TL); p.line(...TL, ...B);
      p.stroke(C.ink); p.strokeWeight(2.5); p.line(...O, ...B); TK.label(p, C, '1', (O[0] + B[0]) / 2 - 10, (O[1] + B[1]) / 2 - 4, C.ink, 14, 20);
      // El tramo que se busca.
      const tg = it.ask === 'sen' ? [O, TL] : [TL, B]; p.stroke(C.N); p.strokeWeight(6); p.line(...tg[0], ...tg[1]);
      TK.label(p, C, '?', it.ask === 'sen' ? O[0] - 13 : (TL[0] + B[0]) / 2, it.ask === 'sen' ? (O[1] + TL[1]) / 2 : TL[1] - 13, C.N, 17, 20);
      seg.forEach(([a, b], i) => { p.stroke(col(i)); p.strokeWeight(s.pick.includes(i) ? 6 : 3.5); p.line(...a, ...b); });
      const t = (i, x, y, w) => TK.label(p, C, `$${lab(it, i)}$`, x, y, col(i), 12, w);
      t(0, (O[0] + F[0]) / 2, O[1] + 15, F[0] - O[0]); t(1, F[0] + 56, (F[1] + A[1]) / 2, 104); t(2, F[0] + 56, (A[1] + TR[1]) / 2, 104); t(3, Math.max((TR[0] + B[0]) / 2, B[0] + 40), TR[1] - 13, 100);
      TK.label(p, C, it.a ? `${it.a}°` : 'α', O[0] + 46, O[1] - 9, C.N, 12, 34); TK.label(p, C, it.b ? `${it.b}°` : 'β', O[0] + 34, O[1] - 30, C.N, 12, 34);
    },
    press(G, x, y) {
      const s = G.s, i = TK.hitSeg(G.seg, x, y, 20);
      if (i < 0 || s.pick.includes(i)) return i >= 0;
      s.pick.push(i); G.api.sfx?.tap?.();
      if (s.pick.length === 2) G.submit();
      return true;
    },
    peek: G => ({ solve: G.s.pick.length ? [] : want(G.item).map(i => TK.mid(...G.seg[i])) }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
