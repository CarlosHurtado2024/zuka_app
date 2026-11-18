// «El cuadrado de Euclides» · escenas de la lección alg-3. Motor en kit.js y polinomio.js; guion en notables.data.js.
// a² en ámbar, los rectángulos ab en cian, b² en verde; lo que se quita o falta en rosa.
const AA = C.amber, AB = C.cyan, BB = C.green, MI = C.mag;
// Cuadrado de lado a + b en (x0, y0) con las cuatro piezas; k (0–1) cuántas piezas se ven; o.lab rótulos.
function split(x0, y0, a, b, k = 1, o = {}) {
  const P = [[x0, y0, a, a, AA, 'a²'], [x0 + a, y0, b, a, AB, 'ab'], [x0, y0 + a, a, b, AB, 'ab'], [x0 + a, y0 + a, b, b, BB, 'b²']];
  P.forEach(([x, y, w, h, col, s], i) => fade(clamp(k * 4 - i), () => { bar(x, y, w, h, col, 1, { fill: .25 }); if (o.lab !== false) T(o.names ? o.names[i] : s, x + w / 2, y + h / 2 + 14, { k: 'i', s: Math.min(44, w * .4, h * .5 + 10), a: 'c', c: C.ink }); }));
  if (o.sides !== false) { T(o.la || 'a', x0 + a / 2, y0 - 16, { k: 'i', s: 36, a: 'c', c: AA }); T(o.lb || 'b', x0 + a + b / 2, y0 - 16, { k: 'i', s: 36, a: 'c', c: BB }); }
}
const S = {
  // 1 · Euclides: el rollo de los Elementos y el cuadrado partido.
  euclides(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { stroke('#ffd9a0', 3, () => X.roundRect(310, 400, 460, 130, 20), { g: 12 }); T('ΣΤΟΙΧΕΙΑ · II.4', CX, 482, { k: 'r', s: 48, a: 'c', c: '#ffd9a0', ls: 4 }); });
    fade(A(t, 9.8, .6), () => split(300, 640, 320, 160, seg(t, 10, 14), { lab: false, sides: false }));
    fade(A(t, 18.8, .6), () => T('un dibujo = una fórmula', CX, 1220, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }));
  },
  // 2 · El cuadrado de una suma: piezas con rótulos y la fórmula.
  cuadrado(t) {
    stars(t, .3);
    split(300, 460, 320, 160, seg(t, 1, 5));
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['a', 'i', AA], [' + ', 'r'], ['b', 'i', BB], [')² = ', 'r'], ['a', 'i', AA], ['²', 'r', AA], [' + ', 'r'], ['2', 'r', AB], ['ab', 'i', AB], [' + ', 'r'], ['b', 'i', BB], ['²', 'r', BB]], CX, 1100, 64));
    fade(A(t, 20.2, .6), () => T('tres términos: el doble producto no se olvida', CX, 1190, { k: 'mono', s: 26, a: 'c', c: AB }));
  },
  // 3 · Cálculo mental: 51² con la cuadrícula de 50 y 1.
  mental(t) {
    stars(t, .3);
    split(260, 460, 500, 10, seg(t, 1, 4), { lab: false, la: '50', lb: '1' });
    fade(A(t, 4, .5), () => { T('2 500', 510, 720, { k: 'r', s: 64, a: 'c', c: AA }); T('50', 780, 720, { k: 'r', s: 28, c: AB }); T('50', 500, 1000, { k: 'r', s: 28, a: 'c', c: AB }); T('1', 790, 990, { k: 'r', s: 28, c: BB }); });
    fade(A(t, 10.2, .6), () => F([['2 500', 'r', AA], [' + ', 'r'], ['100', 'r', AB], [' + ', 'r'], ['1', 'r', BB]], CX, 1110, 64));
    fade(A(t, 19.2, .6), () => F([['51² = ', 'r'], ['2 601', 'r', C.ink]], CX, 1220, 72));
  },
  // 4 · El cuadrado de una resta: se quitan dos tiras y la esquina vuelve.
  diferencia(t) {
    stars(t, .3);
    const x0 = 300, y0 = 440, a = 480, b = 140, k1 = seg(t, 10.4, 12), k2 = seg(t, 12.4, 14);
    bar(x0, y0, a, a, AA, 1, { fill: .12 }); T('a', x0 + a / 2, y0 - 16, { k: 'i', s: 36, a: 'c', c: AA });
    bar(x0, y0, a - b, a - b, C.violet, 1, { fill: .28 }); T('b', x0 + a - b / 2, y0 - 16, { k: 'i', s: 32, a: 'c', c: MI }); T('(a − b)²', x0 + (a - b) / 2, y0 + (a - b) / 2 + 14, { k: 'r', s: 40, a: 'c', c: C.ink });
    fade(k1, () => { X.save(); X.fillStyle = hexA(MI, .25); X.fillRect(x0 + a - b, y0, b, a); X.restore(); stroke(MI, 2.5, () => X.rect(x0 + a - b, y0, b, a), { g: 10 }); T('− ab', x0 + a - b / 2, y0 + a / 2, { k: 'r', s: 30, a: 'c', c: MI }); });
    fade(k2, () => { X.save(); X.fillStyle = hexA(MI, .25); X.fillRect(x0, y0 + a - b, a, b); X.restore(); stroke(MI, 2.5, () => X.rect(x0, y0 + a - b, a, b), { g: 10 }); T('− ab', x0 + a / 2, y0 + a - b / 2 + 10, { k: 'r', s: 30, a: 'c', c: MI }); });
    fade(A(t, 15, .5), () => { stroke(BB, 3, () => X.rect(x0 + a - b, y0 + a - b, b, b), { g: 14 }); T('+ b²', x0 + a - b / 2, y0 + a - b / 2 + 10, { k: 'r', s: 30, a: 'c', c: BB }); T('se quitó dos veces', x0 + a + 20, y0 + a - b / 2, { k: 'mono', s: 20, c: BB }); });
    fade(A(t, .8, .6), () => F([['(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [')² = ', 'r'], ['a', 'i', AA], ['² − 2', 'r', MI], ['ab', 'i', MI], [' + ', 'r'], ['b', 'i', BB], ['²', 'r', BB]], CX, 1080, 60));
    fade(A(t, 20.2, .6), () => F([['49² = 2 500 − 100 + 1 = ', 'r'], ['2 401', 'r', BB]], CX, 1190, 56));
  },
  // 5 · Suma por diferencia: a² − b² se reacomoda; 31 · 29.
  sumadif(t) {
    stars(t, .3);
    const a = 380, b = 140, x0 = 260, y0 = 560, m = eio(seg(t, 3, 6));
    bar(x0, y0, a - b, a, AA, 1, { fill: .22 });
    const cx = lerp(x0 + a - b / 2, x0 + (a - b) / 2, m), cy = lerp(y0 + b + (a - b) / 2, y0 - b / 2, m);
    X.save(); X.translate(cx, cy); X.rotate(Math.PI / 2 * m); bar(-b / 2, -(a - b) / 2, b, a - b, AB, 1, { fill: .22 }); X.restore();
    fade(1 - m, () => stroke(MI, 2.5, () => X.rect(x0 + a - b, y0, b, b), { g: 10, dash: [8, 6] }));
    fade(m, () => { T('a + b', x0 + a - b + 90, y0 + (a - b) / 2, { k: 'i', s: 36, a: 'c', c: AB }); T('a − b', x0 + (a - b) / 2, y0 + a + 50, { k: 'i', s: 36, a: 'c', c: AB }); });
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [')(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [') = ', 'r'], ['a', 'i', AA], ['² ', 'r', AA], ['+ ab − ab', 'r', MI], [' − ', 'r'], ['b', 'i', BB], ['²', 'r', BB]], CX, 1080, 52, { max: 960 }));
    fade(A(t, 19.2, .6), () => F([['31 · 29 = 30² − 1² = ', 'r'], ['899', 'r', BB]], CX, 1190, 60));
  },
  // 6 · El sueño de repartir: el cuadrado de lado 1 + 1 tiene 4 cuadritos, no 2.
  sueno(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i'], [' + ', 'r'], ['y', 'i'], [')²', 'r'], [' = ', 'r', MI], ['x', 'i'], ['² + ', 'r'], ['y', 'i'], ['²', 'r']], CX, 560, 80);
    fade(A(t, 3, .5), () => stroke(MI, 5, () => { X.moveTo(CX - 40, 590); X.lineTo(CX + 30, 500); }, { g: 14 }));
    fade(A(t, 10.2, .6), () => {
      split(260, 720, 160, 160, seg(t, 10.4, 13), { names: ['1', '1', '1', '1'], la: '1', lb: '1' });
      T('(1 + 1)² = 4', 780, 800, { k: 'r', s: 48, a: 'c', c: C.ink }); T('1² + 1² = 2', 780, 900, { k: 'r', s: 48, a: 'c', c: MI });
    });
    fade(A(t, 20.2, .6), () => T('faltan los dos rectángulos: 2xy', CX, 1150, { k: 'mono', s: 28, a: 'c', c: AB }));
  },
  // 7 · Un término común: (x + 3)(x + 7) en un rectángulo.
  comun(t) {
    stars(t, .3);
    const ux = 280, u = 30, x0 = 260, y0 = 470;
    const P = [[x0, y0, ux, ux, AA, 'x²'], [x0 + ux, y0, 7 * u, ux, AB, '7x'], [x0, y0 + ux, ux, 3 * u, AB, '3x'], [x0 + ux, y0 + ux, 7 * u, 3 * u, BB, '21']];
    P.forEach(([x, y, w, h, col, s], i) => fade(A(t, 1 + i * .8, .4), () => { bar(x, y, w, h, col, 1, { fill: .25 }); T(s, x + w / 2, y + h / 2 + 14, { k: 'r', s: 38, a: 'c', c: C.ink }); }));
    T('x', x0 + ux / 2, y0 - 16, { k: 'i', s: 36, a: 'c', c: AA }); T('7', x0 + ux + 3.5 * u, y0 - 16, { k: 'r', s: 36, a: 'c', c: BB }); T('x', x0 - 18, y0 + ux / 2 + 12, { k: 'i', s: 36, a: 'r', c: AA }); T('3', x0 - 18, y0 + ux + 1.5 * u + 12, { k: 'r', s: 36, a: 'r', c: BB });
    fade(A(t, 10.2, .6), () => F([['x', 'i'], ['² + (', 'r'], ['3 + 7', 'r', AB], [')', 'r'], ['x', 'i'], [' + ', 'r'], ['3 · 7', 'r', BB]], CX, 1010, 56));
    fade(A(t, 19.2, .6), () => F([['x', 'i'], ['² + ', 'r'], ['10', 'r', AB], ['x', 'i'], [' + ', 'r'], ['21', 'r', BB]], CX, 1120, 72));
  },
  // 8 · Con signos: (x + 4)(x − 9).
  negativos(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i'], [' + ', 'r'], ['4', 'r', AB], [')(', 'r'], ['x', 'i'], [' − ', 'r'], ['9', 'r', MI], [')', 'r']], CX, 620, 96);
    fade(A(t, 10.2, .6), () => { F([['4 + (−9) = ', 'r'], ['−5', 'r', AB]], 300, 820, 52); F([['4 · (−9) = ', 'r'], ['−36', 'r', MI]], 780, 820, 52); });
    fade(A(t, 19.2, .6), () => F([['x', 'i'], ['² − ', 'r'], ['5', 'r', AB], ['x', 'i'], [' − ', 'r'], ['36', 'r', MI]], CX, 1000, 88));
  },
  // 9 · De un vistazo: 102² y 98 · 102.
  tabla(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['102² = (100 + 2)²', 'r']], CX, 560, 60); F([['10 000', 'r', AA], [' + ', 'r'], ['400', 'r', AB], [' + ', 'r'], ['4', 'r', BB], [' = 10 404', 'r']], CX, 650, 56, { rev: seg(t, 1.6, 5) }); });
    fade(A(t, 10.2, .6), () => { F([['98 · 102 = (100 − 2)(100 + 2)', 'r']], CX, 820, 54); F([['10 000', 'r', AA], [' − ', 'r'], ['4', 'r', MI], [' = 9 996', 'r']], CX, 910, 56, { rev: seg(t, 11, 14) }); });
    fade(A(t, 20.2, .6), () => T('reconocer la forma', CX, 1080, { k: 'it', s: 52, a: 'c', c: '#c3ccec', g: 8 }));
  },
  // 10 · Cierre: el cuadrado de Euclides; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => split(300, 480, 320, 160, 1));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [')² = ', 'r'], ['a', 'i'], ['² + 2', 'r'], ['ab', 'i'], [' + ', 'r'], ['b', 'i'], ['²', 'r']], 'cuadrado de una suma'], [[['(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [')² = ', 'r'], ['a', 'i'], ['² − 2', 'r'], ['ab', 'i'], [' + ', 'r'], ['b', 'i'], ['²', 'r']], 'cuadrado de una resta'], [[['(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [')(', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i'], [') = ', 'r'], ['a', 'i'], ['² − ', 'r'], ['b', 'i'], ['²', 'r']], 'suma por diferencia'], [[['(', 'r'], ['x', 'i'], [' + ', 'r'], ['a', 'i'], [')(', 'r'], ['x', 'i'], [' + ', 'r'], ['b', 'i'], [')', 'r']], 'x² + (a + b)x + ab']], 420, 170, 40);
      endCard(t, 19.6, D.TITLE, D.LINE, [AA, AB, BB]);
    });
  },
};
