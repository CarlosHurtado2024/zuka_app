// «El duelo de Tartaglia» · escenas de la lección alg-23b. Motor en kit.js y ceros.js; guion en division.data.js.
// El dividendo en ámbar, el divisor en cian, el cociente en verde, el residuo en rosa.
const DV = C.amber, DS = C.cyan, QT = C.green, RS = C.mag;
// Una «galera» de división: dividendo arriba a la izquierda, divisor a la derecha, cociente debajo del divisor.
function galera(x, y, dividendo, divisor, s = 48) {
  F(dividendo, x, y, s, { a: 'l' });
  stroke(C.ink, 2.5, () => { X.moveTo(x + 560, y - s); X.lineTo(x + 560, y + 20); X.lineTo(x + 900, y + 20); }, { g: 6 });
  F(divisor, x + 580, y, s, { a: 'l' });
}
// Un calendario de semanas: d días en filas de 7; los que sobran resaltados.
function weeks(x0, y0, d, cell, k = 1) {
  const n = Math.floor(d * k);
  for (let i = 0; i < n; i++) { const r = Math.floor(i / 7), c = i % 7, extra = i >= 98; X.save(); X.fillStyle = hexA(extra ? RS : DS, extra ? .7 : .4); X.fillRect(x0 + c * cell, y0 + r * cell, cell - 3, cell - 3); X.restore(); }
}
const S = {
  // 1 · El duelo: dos columnas de 30 problemas; Tartaglia los tacha todos.
  duelo(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { T('Antonio Fior', 300, 470, { k: 'it', s: 40, a: 'c', c: DS }); T('Niccolò Tartaglia', 780, 470, { k: 'it', s: 40, a: 'c', c: DV }); });
    fade(A(t, 9.6, .6), () => { for (let i = 0; i < 30; i++) { const x = 600 + (i % 6) * 60, y = 540 + Math.floor(i / 6) * 70; chip(x, y, 50, 50, DS, String(i + 1), { s: 22, c: C.ink }); if (t > 18.6 + i * .2) check(x, y, 14, true, A(t, 18.6 + i * .2, .2)); } });
    fade(A(t, 18.6, .6), () => F([['x', 'i'], ['³ + ', 'r'], ['p', 'i'], ['x', 'i'], [' = ', 'r'], ['q', 'i']], 300, 760, 64));
    fade(A(t, 2, .6), () => T('Venecia · 1535', CX, 1000, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 2 · Dividir números: 100 días en semanas.
  numeros(t) {
    stars(t, .3);
    weeks(CX - 7 * 26, 430, 100, 52, seg(t, 1, 7));
    T('días = ' + Math.floor(100 * seg(t, 1, 7)), 96, 1250, { k: 'mono', s: 26, c: DS, g: 8 });
    fade(A(t, 10.2, .6), () => F([['100', 'r', DV], [' = ', 'r'], ['7', 'r', DS], [' · ', 'r'], ['14', 'r', QT], [' + ', 'r'], ['2', 'r', RS]], CX, 1360, 72));
    fade(A(t, 19.2, .6), () => T('2 < 7', CX + 300, 1200, { k: 'r', s: 40, a: 'c', c: RS }));
  },
  // 3 · Con polinomios: P = D · Q + R; grado del residuo menor.
  polinomios(t) {
    stars(t, .3);
    F([['P', 'i', DV], [' = ', 'r'], ['D', 'i', DS], [' · ', 'r'], ['Q', 'i', QT], [' + ', 'r'], ['R', 'i', RS]], CX, 640, 130);
    fade(A(t, 10.2, .6), () => F([['gr ', 'r'], ['R', 'i', RS], [' < gr ', 'r'], ['D', 'i', DS]], CX, 840, 80));
    fade(A(t, 20.2, .6), () => { F([['D', 'i', DS], [' = ', 'r'], ['x', 'i'], [' − 2', 'r'], ['   (grado 1)', 'it', C.mute]], CX, 1000, 56); F([['R', 'i', RS], [' es un número', 'it']], CX, 1090, 56); });
  },
  // 4 · Paso a paso: la galera de (x² + 3x + 5) ÷ (x + 1).
  pasos(t) {
    stars(t, .3);
    const x0 = 110, y0 = 560;
    galera(x0, y0, [['x', 'i'], ['² + 3', 'r'], ['x', 'i'], [' + 5', 'r']], [['x', 'i'], [' + 1', 'r']]);
    fade(A(t, 2, .5), () => F([['x', 'i', QT]], x0 + 580, y0 + 80, 48, { a: 'l' }));
    fade(A(t, 10.2, .5), () => { F([['−', 'r', C.mute], ['x', 'i', C.mute], ['² − ', 'r', C.mute], ['x', 'i', C.mute]], x0, y0 + 80, 48, { a: 'l' }); stroke(C.ink, 2, () => { X.moveTo(x0, y0 + 100); X.lineTo(x0 + 400, y0 + 100); }, { g: 0 }); fade(A(t, 12, .5), () => F([['2', 'r'], ['x', 'i'], [' + 5', 'r']], x0 + 113, y0 + 160, 48, { a: 'l' })); });
    fade(A(t, 20.2, .5), () => { F([[' + 2', 'r', QT]], x0 + 620, y0 + 80, 48, { a: 'l' }); F([['−2', 'r', C.mute], ['x', 'i', C.mute], [' − 2', 'r', C.mute]], x0 + 113, y0 + 240, 48, { a: 'l' }); stroke(C.ink, 2, () => { X.moveTo(x0 + 100, y0 + 260); X.lineTo(x0 + 400, y0 + 260); }, { g: 0 }); fade(A(t, 22.4, .5), () => { T('3', x0 + 232, y0 + 320, { k: 'r', s: 48, c: RS, g: 12 }); T('residuo', x0 + 290, y0 + 320, { k: 'mono', s: 22, c: RS }); }); });
  },
  // 5 · Comprobar: (x + 1)(x + 2) + 3.
  comprobar(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i'], [' + 1', 'r', DS], [')(', 'r'], ['x', 'i'], [' + 2', 'r', QT], [') + ', 'r'], ['3', 'r', RS]], CX, 620, 80);
    fade(A(t, 10.2, .6), () => { F([['= ', 'r'], ['x', 'i'], ['² + 3', 'r'], ['x', 'i'], [' + 2 + ', 'r'], ['3', 'r', RS]], CX, 760, 64); F([['= ', 'r'], ['x', 'i', DV], ['² + 3', 'r', DV], ['x', 'i', DV], [' + 5', 'r', DV]], CX, 870, 72); check(CX + 330, 850, 24, true, A(t, 14, .5)); });
    fade(A(t, 19.2, .6), () => F([['7 · 14 + 2 = ', 'r'], ['100', 'r', DV]], CX, 1060, 56));
  },
  // 6 · Residuo cero: x − 2 es factor.
  factor(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i', DV], ['³ + 2', 'r', DV], ['x', 'i', DV], ['² − 5', 'r', DV], ['x', 'i', DV], [' − 6', 'r', DV], [') ÷ (', 'r'], ['x', 'i', DS], [' − 2', 'r', DS], [')', 'r']], CX, 540, 54);
    fade(A(t, 2.4, .6), () => F([['cociente  ', 'it', C.mute], ['x', 'i', QT], ['² + 4', 'r', QT], ['x', 'i', QT], [' + 3', 'r', QT]], CX, 650, 56));
    fade(A(t, 10.2, .6), () => { F([['residuo  ', 'it', C.mute], ['0', 'r', RS]], CX, 760, 64); T('x − 2 es un factor', CX, 860, { k: 'r', s: 52, a: 'c', c: DS, g: 12 }); });
    fade(A(t, 20.2, .6), () => { weeks(CX - 7 * 14, 950, 98, 28, 1); F([['98 = 7 · 14', 'r', QT]], CX, 1395, 52); });
  },
  // 7 · En piezas: la gráfica de grado 3 y sus tres cortes.
  piezas(t) {
    stars(t, .3);
    const u = 80, ox = CX, oy = 1000, P = (x, y) => [ox + x * u, oy - y * u * .25];
    stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox - 5 * u, oy); X.lineTo(ox + 4.5 * u, oy); }, { g: 4 });
    curve(x => P(x, (x - 2) * (x + 1) * (x + 3)), -3.6, 2.6, DV, seg(t, 1, 4));
    fade(A(t, .8, .6), () => F([['x', 'i'], ['² + 4', 'r'], ['x', 'i'], [' + 3 = (', 'r'], ['x', 'i'], [' + 1)(', 'r'], ['x', 'i'], [' + 3)', 'r']], CX, 470, 52));
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['x', 'i'], [' − 2)(', 'r', DS], ['x', 'i'], [' + 1)(', 'r', QT], ['x', 'i'], [' + 3)', 'r', RS]], CX, 570, 60));
    fade(A(t, 19.2, .6), () => [[2, DS], [-1, QT], [-3, RS]].forEach(([r, c]) => { const [x, y] = P(r, 0); dot(x, y, 12, c, 26); T(String(r).replace('-', '−'), x, y + 50, { k: 'r', s: 36, a: 'c', c }); }));
  },
  // 8 · Igualdad de polinomios: los coeficientes se comparan uno a uno.
  igualdad(t) {
    stars(t, .3);
    const L = [['a', '2'], ['b', '−1'], ['c', '7']], cols = [DV, DS, QT];
    fade(A(t, 10.2, .6), () => { F([['a', 'i', DV], ['x', 'i'], ['² + ', 'r'], ['b', 'i', DS], ['x', 'i'], [' + ', 'r'], ['c', 'i', QT]], 300, 640, 60); T('=', CX, 640, { k: 'r', s: 60, a: 'c' }); F([['2', 'r', DV], ['x', 'i'], ['² − ', 'r'], ['1', 'r', DS], ['x', 'i'], [' + ', 'r'], ['7', 'r', QT]], 790, 640, 60); });
    fade(A(t, 1, .6), () => T('mismos coeficientes', CX, 520, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }));
    L.forEach(([l, v], i) => fade(A(t, 20.4 + i * .8, .4), () => F([[l, 'i', cols[i]], [' = ' + v, 'r', cols[i]]], 240 + i * 300, 860, 72)));
  },
  // 9 · Dividir sin dividir: (x − 1)(x² + ax + b) y comparar.
  comparar(t) {
    stars(t, .3);
    F([['x', 'i'], ['³ − 6', 'r'], ['x', 'i'], ['² + 11', 'r'], ['x', 'i'], [' − 6', 'r']], CX, 500, 60);
    fade(A(t, 1.6, .5), () => F([['= (', 'r'], ['x', 'i'], [' − 1)(', 'r'], ['x', 'i'], ['² + ', 'r'], ['a', 'i', DS], ['x', 'i'], [' + ', 'r'], ['b', 'i', QT], [')', 'r']], CX, 590, 56));
    fade(A(t, 10.2, .6), () => F([['= ', 'r'], ['x', 'i'], ['³ + (', 'r'], ['a', 'i', DS], [' − 1)', 'r'], ['x', 'i'], ['² + (', 'r'], ['b', 'i', QT], [' − ', 'r'], ['a', 'i', DS], [')', 'r'], ['x', 'i'], [' − ', 'r'], ['b', 'i', QT]], CX, 700, 48, { max: 960 }));
    fade(A(t, 20.2, .6), () => { F([['−', 'r'], ['b', 'i', QT], [' = −6 ⟹ ', 'r'], ['b', 'i', QT], [' = 6', 'r', QT]], CX, 840, 50); F([['a', 'i', DS], [' − 1 = −6 ⟹ ', 'r'], ['a', 'i', DS], [' = −5', 'r', DS]], CX, 930, 50); F([['b', 'i', QT], [' − ', 'r'], ['a', 'i', DS], [' = 6 + 5 = 11', 'r']], CX, 1020, 50); check(CX + 260, 1000, 22, true, A(t, 24, .5)); });
  },
  // 10 · Cierre: la galera y el factor; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => F([['P', 'i', DV], [' = ', 'r'], ['D', 'i', DS], [' · ', 'r'], ['Q', 'i', QT], [' + ', 'r'], ['R', 'i', RS]], CX, 760, 140));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['100 = 7 · 14 + 2', 'r']], 'con números'], [[['gr ', 'r'], ['R', 'i'], [' < gr ', 'r'], ['D', 'i']], 'el residuo'], [[['R', 'i'], [' = 0', 'r']], 'el divisor es un factor'], [[['a', 'i'], ['x', 'i'], ['² + … = 2', 'r'], ['x', 'i'], ['² + …', 'r']], 'mismos coeficientes']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [DV, QT, DS]);
    });
  },
};
