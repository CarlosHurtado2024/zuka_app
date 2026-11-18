// «La tesis de Gauss» · escenas de la lección alg-93. Motor en kit.js y ceros.js; guion en ceros.data.js.
// La curva en ámbar, los ceros reales en verde, los complejos en rosa, los candidatos y signos en cian.
const CU = C.amber, ZR = C.green, ZC = C.mag, CA = C.cyan;
function plot(ox, oy, u, sy, f, x0, x1, k = 1, col = CU) {
  stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox + x0 * u - 20, oy); X.lineTo(ox + x1 * u + 20, oy); }, { g: 4 });
  for (let i = Math.ceil(x0); i <= x1; i++) if (i) T(String(i).replace('-', '−'), ox + i * u, oy + 36, { k: 'r', s: 22, a: 'c', c: C.mute });
  curve(x => [ox + x * u, oy - f(x) * sy], x0, x1, col, k);
  return x => [ox + x * u, oy - f(x) * sy];
}
// Plano complejo pequeño con los puntos dados.
function cplane2(ox, oy, u, pts, k = 1) {
  stroke('rgba(225,232,255,.7)', 2, () => { X.moveTo(ox - 1.6 * u, oy); X.lineTo(ox + 1.6 * u, oy); X.moveTo(ox, oy + 1.6 * u); X.lineTo(ox, oy - 1.6 * u); }, { g: 4 });
  ring(ox, oy, u, hexA(CA, .4), 1.5, k);
  pts.forEach(([a, b, col, lab], i) => fade(clamp(k * pts.length - i), () => { dot(ox + a * u, oy - b * u, 12, col, 24); if (lab) T(lab, ox + a * u + (a < 0 ? -18 : 18), oy - b * u - 16, { k: 'r', s: 30, a: a < 0 ? 'r' : 'l', c: col }); }));
}
const S = {
  // 1 · Gauss, 1799: grado n, n ceros.
  gauss(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { stroke('#ffd9a0', 3, () => X.roundRect(300, 420, 480, 220, 16), { g: 12 }); T('Demonstratio nova', CX, 510, { k: 'it', s: 44, a: 'c', c: '#ffd9a0' }); T('C. F. Gauss · 1799', CX, 580, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 9.6, .6), () => { [1, 2, 3, 4, 5].forEach((n, i) => fade(A(t, 10 + i * .6, .4), () => { T('grado ' + n, 300, 760 + i * 70, { k: 'r', s: 40, c: C.ink }); T(n + (n > 1 ? ' ceros' : ' cero'), 640, 760 + i * 70, { k: 'r', s: 40, c: ZR }); })); });
    fade(A(t, 18.6, .6), () => T('reales o complejos, contando repetidos', CX, 1160, { k: 'mono', s: 26, a: 'c', c: ZC }));
  },
  // 2 · Un cero: P(c) = 0 y el punto en el eje.
  cero(t) {
    stars(t, .3);
    const f = x => (x - 1) * (x + 1.5) * (x - 2.5) * .5, p = plot(CX, 960, 120, 60, f, -1.9, 3.2, seg(t, .8, 3));
    fade(A(t, 10.2, .6), () => [[1, '1'], [-1.5, '−1.5'], [2.5, '2.5']].forEach(([c, l]) => { const [a, b] = p(c); dot(a, b, 12, ZR, 24); T(l, a, b - 24, { k: 'r', s: 30, a: 'c', c: ZR }); }));
    fade(A(t, 19.2, .6), () => F([['(', 'r'], ['x', 'i'], [' − 1)(', 'r', ZR], ['x', 'i'], [' + 1.5)(', 'r', ZR], ['x', 'i'], [' − 2.5)', 'r', ZR]], CX, 1240, 52));
    fade(A(t, .8, .6), () => F([['P', 'i'], ['(', 'r'], ['c', 'i', ZR], [') = 0', 'r']], CX, 480, 72));
  },
  // 3 · Cruzar o rebotar: (x − 1)²(x + 2).
  multiplicidad(t) {
    stars(t, .3);
    const f = x => (x - 1) ** 2 * (x + 2), p = plot(CX - 60, 1020, 140, 50, f, -2.5, 2.3, seg(t, .8, 3.5));
    fade(A(t, 10.2, .6), () => { const [a, b] = p(1); dot(a, b, 13, ZR, 26); T('doble: rebota', a + 20, b + 70, { k: 'mono', s: 24, c: ZR }); });
    fade(A(t, 20.2, .6), () => { const [a, b] = p(-2); dot(a, b, 13, CA, 26); T('simple: cruza', a + 20, b + 70, { k: 'mono', s: 24, c: CA }); T('2 + 1 = 3 ceros', CX, 1220, { k: 'r', s: 44, a: 'c', c: C.ink }); });
    F([['(', 'r'], ['x', 'i'], [' − 1)²', 'r', ZR], ['(', 'r'], ['x', 'i'], [' + 2)', 'r', CA]], CX, 480, 72);
  },
  // 4 · Candidatos racionales.
  candidatos(t) {
    stars(t, .3);
    F([['2', 'r', CA], ['x', 'i'], ['³ + ', 'r'], ['x', 'i'], ['² − 7', 'r'], ['x', 'i'], [' − ', 'r'], ['6', 'r', ZR]], CX, 500, 68);
    fade(A(t, 10.2, .6), () => { T('p divide a 6:  1, 2, 3, 6', 320, 640, { k: 'r', s: 36, a: 'c', c: ZR }); T('q divide a 2:  1, 2', 780, 640, { k: 'r', s: 36, a: 'c', c: CA }); });
    fade(A(t, 20.2, .6), () => ['±1', '±2', '±3', '±6', '±1/2', '±3/2'].forEach((s, i) => fade(A(t, 20.4 + i * .4, .3), () => chip(170 + (i % 3) * 370, 800 + Math.floor(i / 3) * 120, 220, 90, CU, s, { s: 44, c: CU }))));
  },
  // 5 · Probar: P(2) = 0 y la factorización.
  probar(t) {
    stars(t, .3);
    const f = x => 2 * x ** 3 + x * x - 7 * x - 6, p = plot(CX, 980, 140, 36, f, -1.9, 2.2, seg(t, .8, 3));
    fade(A(t, .8, .6), () => F([['P', 'i'], ['(2) = 16 + 4 − 14 − 6 = ', 'r'], ['0', 'r', ZR]], CX, 470, 56));
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['x', 'i'], [' − 2)(2', 'r'], ['x', 'i'], [' + 3)(', 'r'], ['x', 'i'], [' + 1)', 'r']], CX, 570, 56));
    fade(A(t, 19.2, .6), () => [[2, '2'], [-1.5, '−3/2'], [-1, '−1']].forEach(([c, l], i) => { const [a, b] = p(c); dot(a, b, 12, ZR, 24); T(l, a + (i === 1 ? -20 : 20), b - 24, { k: 'r', s: 30, a: i === 1 ? 'r' : 'l', c: ZR }); }));
  },
  // 6 · Descartes: signos de los coeficientes.
  descartes(t) {
    stars(t, .3);
    const sg = ['+', '−', '+', '−'], cs = ['x³', '− 6x²', '+ 11x', '− 6'];
    fade(A(t, .8, .6), () => T('René Descartes · 1637', CX, 460, { k: 'mono', s: 24, a: 'c', c: C.mute }));
    fade(A(t, 10.2, .6), () => { cs.forEach((s, i) => { T(s, 200 + i * 220, 600, { k: 'r', s: 48, a: 'c', c: C.ink }); T(sg[i], 200 + i * 220, 690, { k: 'r', s: 60, a: 'c', c: sg[i] === '+' ? ZR : ZC }); if (i) fade(A(t, 11 + i * .6, .3), () => hop(200 + (i - 1) * 220 + 30, 200 + i * 220 - 30, 730, 40, CA, 1, 2.5)); }); T('3 cambios: 3 o 1 ceros positivos', CX, 820, { k: 'mono', s: 28, a: 'c', c: CA }); });
    fade(A(t, 20.2, .6), () => { ['−x³', '− 6x²', '− 11x', '− 6'].forEach((s, i) => { T(s, 200 + i * 220, 960, { k: 'r', s: 44, a: 'c', c: C.ink }); T('−', 200 + i * 220, 1040, { k: 'r', s: 60, a: 'c', c: ZC }); }); T('P(−x): ningún cambio, ningún cero negativo', CX, 1140, { k: 'mono', s: 26, a: 'c', c: CA }); T('ceros: 1, 2 y 3', CX, 1220, { k: 'r', s: 44, a: 'c', c: ZR }); });
  },
  // 7 · x³ − 1: cruza una vez; el resto, complejo.
  sorpresa(t) {
    stars(t, .3);
    const f = x => x ** 3 - 1, p = plot(CX, 1060, 160, 60, f, -1.6, 1.8, seg(t, .8, 3));
    fade(A(t, 2, .5), () => { const [a, b] = p(1); dot(a, b, 13, ZR, 26); T('1', a, b - 24, { k: 'r', s: 32, a: 'c', c: ZR }); });
    fade(A(t, 10.2, .6), () => F([['x', 'i'], ['² + ', 'r'], ['x', 'i'], [' + 1     ', 'r'], ['Δ', 'r', CA], [' = 1 − 4 = −3', 'r', CA]], CX, 470, 52));
    fade(A(t, 20.2, .6), () => F([['−1/2 ± (√3/2) ', 'r', ZC], ['i', 'i', ZC]], CX, 570, 56));
  },
  // 8 · En pareja: conjugados; grado impar tiene un real.
  parejas(t) {
    stars(t, .3);
    cplane2(CX, 760, 200, [[.6, .8, ZC, 'a + bi'], [.6, -.8, ZC, 'a − bi']], seg(t, 1, 3));
    fade(A(t, 10.2, .6), () => stroke(hexA(ZC, .5), 2, () => { X.moveTo(CX + 120, 600); X.lineTo(CX + 120, 920); }, { g: 0, dash: [6, 8] }));
    fade(A(t, 19.2, .6), () => { T('grado 3: 2 complejos + 1 real', CX, 1140, { k: 'r', s: 44, a: 'c', c: C.ink }); T('o 3 reales', CX, 1210, { k: 'r', s: 40, a: 'c', c: ZR }); });
  },
  // 9 · En el plano: las tres raíces cúbicas de 1.
  plano(t) {
    stars(t, .3);
    const s3 = Math.sqrt(3) / 2;
    cplane2(CX, 800, 260, [[1, 0, ZR, '1'], [-.5, s3, ZC, '−1/2 + (√3/2)i'], [-.5, -s3, ZC, '−1/2 − (√3/2)i']], seg(t, 1, 4));
    fade(A(t, 10.2, .6), () => { for (let i = 0; i < 3; i++) { const a = i * 2 * Math.PI / 3; stroke(hexA(CA, .5), 2, () => { X.moveTo(CX, 800); X.lineTo(CX + 260 * Math.cos(a), 800 - 260 * Math.sin(a)); }, { g: 0 }); } T('120°', CX + 50, 760, { k: 'r', s: 28, c: CA }); });
    fade(A(t, 20.2, .6), () => F([['x', 'i'], ['³ = 1', 'r']], CX, 1290, 72));
  },
  // 10 · Cierre: grado n en factores; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const s3 = Math.sqrt(3) / 2; cplane2(CX, 760, 220, [[1, 0, ZR], [-.5, s3, ZC], [-.5, -s3, ZC]], 1); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['grado ', 'r'], ['n', 'i'], [' → ', 'r'], ['n', 'i'], [' ceros', 'r']], 'Gauss, 1799'], [[['(', 'r'], ['x', 'i'], [' − 1)²', 'r']], 'doble: rebota'], [[['±', 'r'], ['p', 'i'], ['/', 'r'], ['q', 'i']], 'candidatos racionales'], [[['a', 'i'], [' ± ', 'r'], ['b', 'i'], ['i', 'i']], 'complejos en pareja']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [CU, ZR, ZC]);
    });
  },
};
