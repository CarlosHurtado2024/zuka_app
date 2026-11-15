// El rectángulo de la suma (Trigonometría, trig-48a): un triángulo de hipotenusa 1 inclinado dentro de un rectángulo. Sus
// catetos miden cos β y sen β, y cada uno es la hipotenusa de un triángulo pequeño de ángulo α. El estudiante le pone su
// medida a los dos tramos que forman el lado «?»: sen(α + β) es una suma; cos(α + β), una resta.
// item = { ask: 'sen'|'cos', a?, b?, vals?: [cc, sc, cs, ss] (TeX), res? }
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
GAMES['rectangulo-suma'] = (() => {
  const LAB = ['\\cos\\alpha\\cos\\beta', '\\operatorname{sen}\\alpha\\cos\\beta', '\\cos\\alpha\\operatorname{sen}\\beta', '\\operatorname{sen}\\alpha\\operatorname{sen}\\beta'];
  const ORDER = [2, 0, 3, 1];   // orden de las fichas, para que no coincida con el de los tramos
  const want = it => (it.ask === 'sen' ? [1, 2] : [0, 3]), lab = (it, i) => it.vals?.[i] ?? LAB[i];
  const name = it => `${TK.FN[it.ask]}${it.a ? ` ${it.a + it.b}^\\circ` : '(\\alpha + \\beta)'}`;
  const right = (s, it, i) => s.lab[i] != null && lab(it, s.lab[i]) === lab(it, i);
  return questGame({
    aspect: 1.45,
    init: () => ({ sel: null, lab: {} }),
    ok: (s, it) => want(it).every(i => right(s, it, i)),
    answer: it => ({ sel: null, lab: Object.fromEntries(want(it).map(i => [i, i])) }),
    solution: it => `$${name(it)} = ${lab(it, want(it)[0])} ${it.ask === 'sen' ? '+' : '-'} ${lab(it, want(it)[1])}${it.res ? ` = ${it.res}` : ''}$`,
    prompt: () => 'Toca cada tramo de color y luego la ficha con su medida',
    foot: it => (it.ask === 'sen' ? 'El lado «?» mide lo mismo que los dos tramos de color juntos' : 'El lado «?» es el tramo largo menos el tramo corto'),
    layout(G) {
      const it = G.item, al = TK.rad(it.a ?? 35), be = TK.rad(it.b ?? 25), xA = Math.cos(al) * Math.cos(be), yA = Math.sin(al) * Math.cos(be), xB = Math.cos(al + be), yB = Math.sin(al + be);
      const w = (G.W - 24 - 18) / 4, ty = G.bottom - 46;
      G.tile = ORDER.map((k, i) => ({ k, x: 12 + i * (w + 6), y: ty, w, h: 40 }));
      const u = Math.min((G.W - 90) / xA, (ty - G.top - 96) / yB), x0 = (G.W - xA * u) / 2, yb = ty - 26, P = (x, y) => [x0 + x * u, yb - y * u];
      const O = P(0, 0), F = P(xA, 0), A = P(xA, yA), TR = P(xA, yB), B = P(xB, yB), TL = P(0, yB);
      Object.assign(G, { O, F, A, TR, B, TL, seg: [[O, F], [F, A], [A, TR], [TR, B]] });
    },
    draw(G) {
      const { p, C, s, item: it, O, F, A, TR, B, TL, seg } = G, need = want(it), cols = [C.sky, C.coral];
      const sq = k => (right(s, it, need[k]) ? lab(it, need[k]) : '\\square');
      TK.label(p, C, `$${name(it)} = ${sq(0)} ${it.ask === 'sen' ? '+' : '-'} ${sq(1)}${G.solved && it.res ? ` = ${it.res}` : ''}$`, G.W / 2, G.top + 24, G.solved ? C.ok : C.ink, 17, G.W - 20);
      p.noStroke(); p.fill(C.card); p.triangle(...O, ...A, ...B);
      p.stroke(C.mute); p.strokeWeight(1.5); p.line(...O, ...TL); p.line(...TL, ...B); seg.forEach(([a, b]) => p.line(...a, ...b));
      p.stroke(C.ink); p.strokeWeight(2.5); p.line(...O, ...B); p.line(...O, ...A); p.line(...A, ...B);
      // Lo que se sabe: hipotenusa 1 y los dos catetos del triángulo inclinado.
      const mid = (a, b, dx, dy) => [(a[0] + b[0]) / 2 + dx, (a[1] + b[1]) / 2 + dy];
      TK.label(p, C, '1', ...mid(O, B, -9, -5), C.ink, 13, 20);
      TK.label(p, C, it.vals ? `$\\cos ${it.b}^\\circ$` : '$\\cos\\beta$', ...mid(O, A, 4, -11), C.ink, 12, 70); TK.label(p, C, it.vals ? `$\\operatorname{sen} ${it.b}^\\circ$` : '$\\operatorname{sen}\\beta$', ...mid(A, B, -22, -2), C.ink, 12, 70);
      TK.label(p, C, it.a ? `${it.a}°` : 'α', O[0] + 44, O[1] - 8, C.N, 12, 34); TK.label(p, C, it.b ? `${it.b}°` : 'β', O[0] + 30, O[1] - 27, C.N, 12, 34);
      TK.label(p, C, it.a ? `${it.a}°` : 'α', A[0] - 9, A[1] - 28, C.N, 11, 30);
      const tg = it.ask === 'sen' ? [O, TL] : [TL, B]; p.stroke(C.N); p.strokeWeight(6); p.line(...tg[0], ...tg[1]);
      TK.label(p, C, '?', it.ask === 'sen' ? O[0] - 13 : (TL[0] + B[0]) / 2, it.ask === 'sen' ? (O[1] + TL[1]) / 2 : TL[1] - 13, C.N, 17, 20);
      // Los dos tramos por medir.
      need.forEach((i, k) => {
        const [a, b] = seg[i], ok = right(s, it, i), col = G.solved ? C.ok : cols[k];
        p.stroke(col); p.strokeWeight(s.sel === i ? 8 : 5); p.line(...a, ...b);
        const horiz = i === 0 || i === 3, lx = horiz ? (a[0] + b[0]) / 2 : a[0] + 14, ly = horiz ? a[1] + (i === 0 ? 14 : -13) : (a[1] + b[1]) / 2;
        if (horiz) TK.label(p, C, ok ? `$${lab(it, i)}$` : '¿?', Math.max(lx, 44), ly, col, 12, 110);
        else { p.noStroke(); p.fill(col === C.sky ? C.Z : col === C.coral ? C.I : col); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); fitText(p, ok ? `$${lab(it, i)}$` : '¿?', lx - 6, ly, G.W - lx, 12); }
      });
      G.tile.forEach(t => drawTile(p, C, t, `$${lab(it, t.k)}$`, { fill: C.cream, size: 12, r: 9 }));
    },
    press(G, x, y) {
      const s = G.s, it = G.item, t = G.tile.find(b => hitBox(b, x, y));
      if (t) {
        if (s.sel == null) { G.a.say('Toca primero un tramo de color', G.C.N); return true; }
        const i = s.sel; s.sel = null;
        if (lab(it, t.k) !== lab(it, i)) { G.bad('Mira de cuál triángulo pequeño es cateto ese tramo, y cuál es su hipotenusa'); return true; }
        s.lab[i] = t.k; G.api.sfx?.tap?.();
        if (want(it).every(q => right(s, it, q))) G.good(it.ask === 'sen' ? 'El seno de la suma es una suma de dos productos' : 'El coseno de la suma es una resta');
        return true;
      }
      const i = want(it).find(q => !right(s, it, q) && TK.segDist(x, y, ...G.seg[q]) < 22);
      if (i == null) return false;
      s.sel = i; G.api.sfx?.tap?.();
      return true;
    },
    peek: G => ({ solve: want(G.item).filter(i => !right(G.s, G.item, i)).flatMap(i => [TK.mid(...G.seg[i]), G.tile.find(t => t.k === i)]) }),
  });
})();
