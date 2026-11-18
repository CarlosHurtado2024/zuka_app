// «Multiplicar es fácil» · escenas de la lección alg-24b. Motor en kit.js y polinomio.js; guion en factorizacion.data.js.
// La suma (lo que se tiene) en ámbar, los factores (lo que se busca) en cian y verde, lo que no se puede en rosa.
const SU = C.amber, F1 = C.cyan, F2 = C.green, NOP = C.mag;
// Un candado esquemático en (x, y), abierto según o (0–1).
function lock(x, y, s, open = 0, col = SU) { stroke(col, 4, () => X.roundRect(x - s / 2, y - s * .2, s, s * .8, 12), { g: 14 }); stroke(col, 4, () => { X.moveTo(x - s * .3, y - s * .2); X.lineTo(x - s * .3, y - s * .5 - open * s * .3); X.arc(x, y - s * .5 - open * s * .3, s * .3, Math.PI, 0); X.lineTo(x + s * .3, y - s * .2 - open * s * .3); }, { g: 14 }); dot(x, y + s * .15, 8, col, 12); }
const S = {
  // 1 · RSA, 1977: multiplicar 61 · 53 es fácil; volver es difícil.
  rsa(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { lock(CX, 640, 160, 0); T('Rivest · Shamir · Adleman · 1977', CX, 820, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 9.8, .6), () => { F([['61', 'r', F1], [' · ', 'r'], ['53', 'r', F2], [' = ', 'r'], ['3 233', 'r', SU]], CX, 960, 80); arrow(300, 1020, 780, 1020, F2, eo(seg(t, 10.4, 11.6)), 3); T('fácil', CX, 1070, { k: 'mono', s: 24, a: 'c', c: F2 }); });
    fade(A(t, 18.8, .6), () => {
      arrow(780, 1120, 300, 1120, NOP, eo(seg(t, 19, 20.2)), 3); T('difícil', CX, 1170, { k: 'mono', s: 24, a: 'c', c: NOP });
      const d = Math.min(53, 2 + Math.floor(seg(t, 20, 26.5) * 51)); T('3 233 ÷ ' + d + (3233 % d ? ': no da exacto' : ' = ' + 3233 / d), CX, 1250, { k: 'mono', s: 30, a: 'c', c: 3233 % d ? C.mute : F2, g: 3233 % d ? 0 : 10 });
    });
  },
  // 2 · Factorizar: el rectángulo con área conocida y lados por hallar.
  factorizar(t) {
    stars(t, .3);
    F([['2', 'r'], ['x', 'i'], ['² + 7', 'r'], ['x', 'i'], [' + 3', 'r']], CX, 520, 72);
    fade(A(t, 10.2, .6), () => { const m = eo(seg(t, 10.4, 12)); arrow(CX, 560, CX, 640, F1, m, 3); F([['(', 'r'], ['x', 'i', F1], [' + 3', 'r', F1], [')(2', 'r'], ['x', 'i', F2], [' + 1', 'r', F2], [')', 'r']], CX, 720, 72); });
    fade(A(t, 19.2, .6), () => { area(320, 860, 120, [1, 3], [2, 1], 1); T('lados = factores', 850, 1000, { k: 'mono', s: 24, a: 'c', c: F1 }); });
  },
  // 3 · Factor común: 6x² + 9x = 3x(2x + 3).
  comun(t) {
    stars(t, .3);
    const r = F([['6', 'r'], ['x', 'i'], ['²', 'r'], [' + ', 'r'], ['9', 'r'], ['x', 'i']], CX, 620, 100);
    fade(A(t, 10.2, .6), () => { F([['3', 'r', F1], [' · 2 · ', 'r'], ['x', 'i', F1], [' · ', 'r'], ['x', 'i'], ['  +  ', 'r'], ['3', 'r', F1], [' · 3 · ', 'r'], ['x', 'i', F1]], CX, 780, 60); T('en los dos: 3 y x', CX, 860, { k: 'mono', s: 26, a: 'c', c: F1 }); void r; });
    fade(A(t, 20.2, .6), () => { F([['3', 'r', F1], ['x', 'i', F1], ['(2', 'r', F2], ['x', 'i', F2], [' + 3', 'r', F2], [')', 'r', F2]], CX, 1000, 100); T('comprobación: 3x · 2x + 3x · 3 = 6x² + 9x', CX, 1100, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 4 · Diferencia de cuadrados: 4x² − 25.
  diferencia(t) {
    stars(t, .3);
    F([['a', 'i'], ['² − ', 'r'], ['b', 'i'], ['² = (', 'r'], ['a', 'i', F1], [' − ', 'r'], ['b', 'i', F1], [')(', 'r'], ['a', 'i', F2], [' + ', 'r'], ['b', 'i', F2], [')', 'r']], CX, 520, 64);
    fade(A(t, 10.2, .6), () => { F([['4', 'r'], ['x', 'i'], ['² − 25', 'r']], CX, 700, 88); T('(2x)²', 400, 790, { k: 'r', s: 36, a: 'c', c: SU }); T('5²', 640, 790, { k: 'r', s: 36, a: 'c', c: SU }); });
    fade(A(t, 19.2, .6), () => F([['(2', 'r', F1], ['x', 'i', F1], [' − 5', 'r', F1], [')(2', 'r', F2], ['x', 'i', F2], [' + 5', 'r', F2], [')', 'r', F2]], CX, 960, 84));
  },
  // 5 · x² + bx + c: la tabla de parejas que multiplican −12; la que suma 1.
  trinomio(t) {
    stars(t, .3);
    F([['x', 'i'], ['² + ', 'r'], ['x', 'i'], [' − 12', 'r']], CX, 520, 80);
    const P = [[1, -12], [-1, 12], [2, -6], [-2, 6], [3, -4], [-3, 4]];
    fade(A(t, 10.2, .6), () => { T('producto −12', 330, 620, { k: 'mono', s: 22, a: 'c', c: F1 }); T('suma', 740, 620, { k: 'mono', s: 22, a: 'c', c: F2 }); P.forEach(([a, b], i) => fade(A(t, 10.6 + i * .6, .3), () => { const ok = a + b === 1; T(neg(a) + ' · (' + neg(b) + ')', 330, 680 + i * 60, { k: 'r', s: 36, a: 'c', c: ok ? F1 : C.ink }); T(String(a + b), 740, 680 + i * 60, { k: 'r', s: 36, a: 'c', c: ok ? F2 : C.mute, g: ok ? 12 : 0 }); if (ok) stroke(F2, 2.5, () => X.roundRect(200, 640 + i * 60, 680, 54, 12), { g: 10 }); })); });
    fade(A(t, 20.2, .6), () => F([['(', 'r'], ['x', 'i'], [' + 4', 'r', F1], [')(', 'r'], ['x', 'i'], [' − 3', 'r', F2], [')', 'r']], CX, 1140, 80));
  },
  // 6 · Cuadrado perfecto: x² + 10x + 25 = (x + 5)².
  perfecto(t) {
    stars(t, .3);
    F([['x', 'i'], ['² + 10', 'r'], ['x', 'i'], [' + 25', 'r']], CX, 520, 80);
    fade(A(t, 10.2, .6), () => { T('25 = 5²', 300, 640, { k: 'r', s: 44, a: 'c', c: F1 }); T('10x = 2 · x · 5', 760, 640, { k: 'r', s: 44, a: 'c', c: F2 }); });
    fade(A(t, 19.2, .6), () => { const u = 300, b = 110, x0 = 360, y0 = 720; [[x0, y0, u, u, SU, 'x²'], [x0 + u, y0, b, u, F1, '5x'], [x0, y0 + u, u, b, F1, '5x'], [x0 + u, y0 + u, b, b, F2, '25']].forEach(([x, y, w, h, c, l]) => { bar(x, y, w, h, c, 1, { fill: .22 }); T(l, x + w / 2, y + h / 2 + 12, { k: 'r', s: 34, a: 'c', c: C.ink }); }); T('x + 5', x0 + (u + b) / 2, y0 - 16, { k: 'r', s: 36, a: 'c', c: C.ink }); F([['(', 'r'], ['x', 'i'], [' + 5)²', 'r']], CX, 1230, 72); });
  },
  // 7 · Completar el cuadrado: 13 = 9 + 4.
  completar(t) {
    stars(t, .3);
    F([['x', 'i'], ['² + 6', 'r'], ['x', 'i'], [' + 13', 'r']], CX, 520, 80);
    fade(win(t, 1.4, 9.8), () => T('ninguna pareja multiplica 13 y suma 6', CX, 620, { k: 'mono', s: 26, a: 'c', c: NOP }));
    fade(A(t, 10.2, .6), () => { const u = 280, b = 100, x0 = 300, y0 = 640; [[x0, y0, u, u, SU, 'x²'], [x0 + u, y0, b, u, F1, '3x'], [x0, y0 + u, u, b, F1, '3x']].forEach(([x, y, w, h, c, l]) => { bar(x, y, w, h, c, 1, { fill: .22 }); T(l, x + w / 2, y + h / 2 + 12, { k: 'r', s: 34, a: 'c', c: C.ink }); }); bar(x0 + u, y0 + u, b, b, F2, 1, { fill: .22 }); T('9', x0 + u + b / 2, y0 + u + b / 2 + 12, { k: 'r', s: 36, a: 'c', c: C.ink }); for (let i = 0; i < 4; i++) chip(820, 700 + i * 70, 60, 60, NOP, '1', { s: 30, c: NOP }); T('sobran 4', 820, 1000, { k: 'mono', s: 22, a: 'c', c: NOP }); });
    fade(A(t, 20.2, .6), () => F([['(', 'r'], ['x', 'i'], [' + 3)²', 'r', F2], [' + 4', 'r', NOP]], CX, 1200, 80));
  },
  // 8 · No siempre se puede: la gráfica de x² + 4 nunca toca el eje.
  nosiempre(t) {
    stars(t, .3);
    const x0 = CX, y0 = 1060, s = 70;
    stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(140, y0); X.lineTo(940, y0); X.moveTo(x0, y0 + 60); X.lineTo(x0, 420); }, { g: 4 });
    curve(u => [x0 + u * s, y0 - (u * u + 4) * s * .8], -2.6, 2.6, SU, seg(t, 1, 4));
    fade(A(t, 4, .5), () => { dot(x0, y0 - 4 * s * .8, 10, F2, 18); T('mínimo 4', x0 + 20, y0 - 4 * s * .8 + 40, { k: 'mono', s: 22, c: F2 }); });
    fade(A(t, 10.2, .6), () => T('x² ≥ 0  ⟹  x² + 4 ≥ 4 > 0', CX, 1160, { k: 'r', s: 44, a: 'c', c: C.ink }));
    fade(A(t, 19.2, .6), () => T('nunca cruza el eje: no hay factor (x − r)', CX, 1240, { k: 'mono', s: 26, a: 'c', c: NOP }));
  },
  // 9 · Números enormes: un número de 250 cifras.
  grande(t) {
    stars(t, .3);
    const R = rng(250), digits = Array.from({ length: 250 }, (_, i) => i ? Math.floor(R() * 10) : 2).join('');
    for (let r = 0; r < 10; r++) T(digits.slice(r * 25, r * 25 + 25).replace(/(\d{5})/g, '$1 '), CX, 460 + r * 50, { k: 'mono', s: 30, a: 'c', c: hexA(SU, .8) });
    T('(cifras de muestra)', CX, 980, { k: 'mono', s: 20, a: 'c', c: C.mute });
    fade(A(t, 10.2, .6), () => { T('≈ 2 700 años de un núcleo', CX, 1080, { k: 'r', s: 48, a: 'c', c: F1 }); });
    fade(A(t, 20.2, .6), () => lock(CX, 1220, 110, 0, F2));
  },
  // 10 · Cierre: el candado; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { lock(CX, 700, 180, 0); F([['3 233', 'r', SU], [' = ', 'r'], ['61', 'r', F1], [' · ', 'r'], ['53', 'r', F2]], CX, 960, 72); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['6', 'r'], ['x', 'i'], ['² + 9', 'r'], ['x', 'i'], [' = 3', 'r'], ['x', 'i'], ['(2', 'r'], ['x', 'i'], [' + 3)', 'r']], 'factor común'], [[['a', 'i'], ['² − ', 'r'], ['b', 'i'], ['² = (', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [')(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [')', 'r']], 'diferencia de cuadrados'], [[['x', 'i'], ['² + ', 'r'], ['x', 'i'], [' − 12 = (', 'r'], ['x', 'i'], [' + 4)(', 'r'], ['x', 'i'], [' − 3)', 'r']], 'suman b, multiplican c'], [[['(', 'r'], ['x', 'i'], [' + 3)² + 4', 'r']], 'completar el cuadrado']], 420, 170, 40);
      endCard(t, 19.6, D.TITLE, D.LINE, [SU, F2, F1]);
    });
  },
};
