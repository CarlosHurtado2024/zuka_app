// «La suma que se derrumba» · escenas de la lección alg-102. Motor en kit.js y fraccion.js; guion en parciales.data.js.
// La fracción completa en ámbar, las piezas en cian y verde, lo que se cancela en rosa.
const FU = C.amber, P1 = C.cyan, P2 = C.green, CN = C.mag;
// Barra de sumas parciales de 1/(k(k+1)) hasta n términos, de largo w.
function bars(x0, y0, w, n) { let acc = 0; for (let k = 1; k <= n; k++) { const v = 1 / (k * (k + 1)); bar(x0 + acc * w, y0, Math.max(0, v * w - 2), 70, k % 2 ? P1 : P2, 1, { fill: .35 }); acc += v; } stroke('rgba(225,232,255,.6)', 2, () => X.rect(x0, y0, w, 70), { g: 0 }); return acc; }
const S = {
  // 1 · Leibniz y Bernoulli; la suma 1/2 + 1/6 + 1/12 + …
  leibniz(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('Gottfried Leibniz · Johann Bernoulli · hacia 1702', CX, 460, { k: 'mono', s: 24, a: 'c', c: C.mute }));
    fade(A(t, 9.6, .6), () => { F([['(', 'r'], ['x', 'i'], [' + 7) / ((', 'r'], ['x', 'i'], [' − 1)(', 'r'], ['x', 'i'], [' + 3))', 'r']], CX, 620, 52); const k = eio(seg(t, 11, 13.5)); fade(k, () => F([['= ', 'r'], ['2', 'r', P1], ['/(', 'r'], ['x', 'i'], [' − 1) − ', 'r'], ['1', 'r', P2], ['/(', 'r'], ['x', 'i'], [' + 3)', 'r']], CX, 720, 52)); });
    fade(A(t, 18.6, .6), () => { F([['1/2 + 1/6 + 1/12 + 1/20 + …', 'r', FU]], CX, 900, 60); bars(140, 980, 800, Math.min(12, 1 + Math.floor(seg(t, 19, 26) * 12))); });
  },
  // 2 · Una curva y una recta: y = x² y y = x + 2.
  nolineal(t) {
    stars(t, .3);
    const u = 90, ox = CX, oy = 1150, P = (x, y) => [ox + x * u, oy - y * u];
    stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox - 3.5 * u, oy); X.lineTo(ox + 3.5 * u, oy); X.moveTo(ox, oy + 30); X.lineTo(ox, oy - 7.5 * u); }, { g: 4 });
    curve(x => P(x, x * x), -2.6, 2.6, FU, seg(t, 1, 3)); curve(x => P(x, x + 2), -3, 3.4, P1, seg(t, 2, 4));
    fade(A(t, 10.2, .6), () => F([['x', 'i'], ['² = ', 'r'], ['x', 'i'], [' + 2  ⟹  ', 'r'], ['x', 'i'], ['² − ', 'r'], ['x', 'i'], [' − 2 = 0', 'r']], CX, 460, 50));
    fade(A(t, 20.2, .6), () => [[2, 4], [-1, 1]].forEach(([a, b]) => { const [x, y] = P(a, b); dot(x, y, 12, P2, 26); T('(' + String(a).replace('-', '−') + ', ' + b + ')', x + (a > 0 ? 20 : -20), y - 16, { k: 'r', s: 34, a: a > 0 ? 'l' : 'r', c: P2 }); }));
  },
  // 3 · La idea: 1/2 − 1/3 = 1/6, al derecho y al revés.
  idea(t) {
    stars(t, .3);
    const x0 = 140, w = 800;
    bar(x0, 560, w / 2, 70, P1, 1, { fill: .3 }); T('1/2', x0 + w / 4, 608, { k: 'r', s: 34, a: 'c', c: C.ink });
    bar(x0, 660, w / 3, 70, P2, 1, { fill: .3 }); T('1/3', x0 + w / 6, 708, { k: 'r', s: 34, a: 'c', c: C.ink });
    fade(A(t, 2, .5), () => { bar(x0 + w / 3, 760, w / 6, 70, FU, 1, { fill: .4 }); T('1/6', x0 + w / 3 + w / 12, 808, { k: 'r', s: 34, a: 'c', c: C.ink }); F([['1/2 − 1/3 = ', 'r'], ['1/6', 'r', FU]], CX, 940, 60); });
    fade(A(t, 10.2, .6), () => { arrow(840, 960, 840, 1060, CN, 1, 3); F([['1/6', 'r', FU], [' = ', 'r'], ['1/2', 'r', P1], [' − ', 'r'], ['1/3', 'r', P2]], CX, 1110, 60); T('al revés: partir', CX, 1180, { k: 'mono', s: 24, a: 'c', c: CN }); });
  },
  // 4 · Partir: un factor, una fracción.
  partir(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i'], [' + 7)', 'r'], [' / ', 'r'], ['((', 'r'], ['x', 'i', P1], [' − 1', 'r', P1], [')(', 'r'], ['x', 'i', P2], [' + 3', 'r', P2], ['))', 'r']], CX, 560, 64);
    fade(A(t, 10.2, .6), () => { arrow(CX - 120, 600, 340, 700, P1, eo(seg(t, 10.4, 11.4)), 3); arrow(CX + 120, 600, 740, 700, P2, eo(seg(t, 10.4, 11.4)), 3); F([['A', 'i', P1], [' / (', 'r'], ['x', 'i'], [' − 1)', 'r']], 340, 780, 56); T('+', CX, 780, { k: 'r', s: 56, a: 'c' }); F([['B', 'i', P2], [' / (', 'r'], ['x', 'i'], [' + 3)', 'r']], 740, 780, 56); });
    fade(A(t, 20.2, .6), () => T('se buscan dos números: A y B', CX, 920, { k: 'mono', s: 28, a: 'c', c: C.mute }));
  },
  // 5 · Igualar numeradores: x = 1 y x = −3.
  igualar(t) {
    stars(t, .3);
    F([['x', 'i'], [' + 7 = ', 'r'], ['A', 'i', P1], ['(', 'r'], ['x', 'i'], [' + 3) + ', 'r'], ['B', 'i', P2], ['(', 'r'], ['x', 'i'], [' − 1)', 'r']], CX, 560, 60);
    fade(A(t, 10.2, .6), () => { F([['x', 'i'], [' = 1:  8 = 4', 'r'], ['A', 'i', P1], [' + ', 'r', CN], ['0', 'r', CN], ['  ⟹  ', 'r'], ['A', 'i', P1], [' = 2', 'r', P1]], CX, 720, 50); });
    fade(A(t, 20.2, .6), () => { F([['x', 'i'], [' = −3:  4 = ', 'r'], ['0', 'r', CN], [' − 4', 'r'], ['B', 'i', P2], ['  ⟹  ', 'r'], ['B', 'i', P2], [' = −1', 'r', P2]], CX, 840, 50); });
  },
  // 6 · Comprobar: la suma de las piezas y x = 2.
  comprobar(t) {
    stars(t, .3);
    F([['2', 'r', P1], ['/(', 'r'], ['x', 'i'], [' − 1) − ', 'r'], ['1', 'r', P2], ['/(', 'r'], ['x', 'i'], [' + 3)', 'r']], CX, 560, 64);
    fade(A(t, 10.2, .6), () => F([['(2(', 'r'], ['x', 'i'], [' + 3) − (', 'r'], ['x', 'i'], [' − 1)) / (…) = (', 'r'], ['x', 'i', FU], [' + 7', 'r', FU], [') / (…)', 'r']], CX, 700, 46, { max: 960 }));
    fade(A(t, 19.2, .6), () => { F([['x', 'i'], [' = 2:  9/5', 'r', FU], ['  =  ', 'r'], ['2', 'r', P1], [' − ', 'r'], ['1/5', 'r', P2]], CX, 860, 56); check(CX + 330, 840, 24, true, A(t, 20.4, .5)); });
  },
  // 7 · Otros factores: cuadrático y repetido; propia.
  casos(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['(', 'r'], ['B', 'i', P1], ['x', 'i'], [' + ', 'r'], ['C', 'i', P1], [') / (', 'r'], ['x', 'i'], ['² + 1)', 'r']], CX, 560, 60));
    fade(A(t, 10.2, .6), () => F([['A', 'i', P2], ['/(', 'r'], ['x', 'i'], [' − 2) + ', 'r'], ['B', 'i', P2], ['/(', 'r'], ['x', 'i'], [' − 2)²', 'r']], CX, 720, 60));
    fade(A(t, 20.2, .6), () => { T('propia: grado de arriba < grado de abajo', CX, 880, { k: 'mono', s: 26, a: 'c', c: FU }); T('si no, primero se divide', CX, 940, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
  },
  // 8 · La suma que se derrumba: cada pieza se cancela con la siguiente.
  derrumbe(t) {
    stars(t, .3);
    F([['1/(', 'r'], ['k', 'i'], ['(', 'r'], ['k', 'i'], [' + 1)) = ', 'r'], ['1/', 'r', P1], ['k', 'i', P1], [' − ', 'r'], ['1/(', 'r', P2], ['k', 'i', P2], [' + 1)', 'r', P2]], CX, 500, 56);
    const rows = [['1/2', '1', '1/2'], ['1/6', '1/2', '1/3'], ['1/12', '1/3', '1/4'], ['1/20', '1/4', '1/5']];
    rows.forEach(([l, a, b], i) => fade(A(t, 10.2 + i * 1, .4), () => { const y = 620 + i * 80; T(l + ' = ', 300, y, { k: 'r', s: 40, a: 'r', c: FU }); T(a, 400, y, { k: 'r', s: 40, a: 'c', c: P1 }); T('−', 480, y, { k: 'r', s: 40, a: 'c' }); T(b, 560, y, { k: 'r', s: 40, a: 'c', c: P2 }); if (i && t > 15) stroke(CN, 3, () => { X.moveTo(360, y + 10); X.lineTo(440, y - 30); X.moveTo(520, y - 70); X.lineTo(600, y - 110); }, { g: 10 }); }));
    fade(A(t, 20.2, .6), () => F([['suma = 1 − 1/(', 'r'], ['n', 'i'], [' + 1)  →  ', 'r'], ['1', 'r', FU]], CX, 1020, 60));
  },
  // 9 · En barras: las sumas parciales se acercan a 1.
  barras(t) {
    stars(t, .3);
    const n = Math.min(30, 1 + Math.floor(seg(t, 1, 22) * 30)), s = bars(140, 640, 800, n);
    T(n + ' términos: ' + n + '/' + (n + 1) + ' ≈ ' + s.toFixed(4), CX, 800, { k: 'mono', s: 30, a: 'c', c: FU, g: 8 });
    T('1', 940, 610, { k: 'r', s: 36, a: 'c', c: C.ink });
    fade(A(t, 19.2, .6), () => F([['1/2 + 1/6 + 1/12 + … = ', 'r'], ['1', 'r', FU]], CX, 960, 64));
  },
  // 10 · Cierre: piezas que se cancelan; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { bars(140, 700, 800, 30); F([['1/2 + 1/6 + 1/12 + … = ', 'r'], ['1', 'r', FU]], CX, 900, 64); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['x', 'i'], ['² = ', 'r'], ['x', 'i'], [' + 2', 'r']], 'igualar las y'], [[['A', 'i'], ['/(', 'r'], ['x', 'i'], [' − 1) + ', 'r'], ['B', 'i'], ['/(', 'r'], ['x', 'i'], [' + 3)', 'r']], 'una fracción por factor'], [[['x', 'i'], [' = 1 ⟹ ', 'r'], ['A', 'i'], [' = 2', 'r']], 'igualar numeradores'], [[['1/', 'r'], ['k', 'i'], [' − 1/(', 'r'], ['k', 'i'], [' + 1)', 'r']], 'la suma se derrumba']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [FU, P2, P1]);
    });
  },
};
