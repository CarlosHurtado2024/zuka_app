// «Grado y operaciones» (lección alg-23a de Zuka, Taller de los Bloques, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): la caja de Caro 2x² + 3x + 4, el cubo x³ y
// P(x) = x³ − 4x² + x − 6, la suma (2x² + 3x + 4) + (x² − 5x + 1) = 3x² − 2x + 5 con parejas que se anulan,
// (x + 1)(x + 4) = x² + 5x + 4 como rectángulo, y 2x² + 3x + 4 con x = 10 → 234.
// Hilo (docs/storytelling-videos.md): Caro tiene una caja de bloques (cuadrados, barras y cuadritos) y quiere anotarla sin
// dibujarla. Sorpresa anunciada: con x = 10 su polinomio es un número que ya conoce. Cierre: 200 + 30 + 4 = 234.
// Niveles: 0 la caja → 1 por x³: el grado → 2 por «+»: sumar y restar → 3 por (x + 1)(x + 4): multiplicar.
const POSTER = 22.0;
const X2 = ['x', { sup: '2' }];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 90, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1385], r: 90, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 150, A: [540, 700] },
  ],
  open: { Z0: 2.3, C: [540, 840], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el grado', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'sumar', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'multiplicar', L: [330, 1560] },
  ],
  stops: ['la caja', 'el grado', 'sumar', 'multiplicar'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[17.0, 18.6], [72.6, 74.2], [119.0, 135]],
    wides: [[66.4, 67.8], [110.8, 112.2]],
    looks: [],
  },
};

// ---------- nivel 0 · la caja ----------
function level0(G, t) {
  starField(G, 61, 150);
  const kb = pop(t, 1.0);
  if (kb > 0.01) { const S = scaleAt(G, 540, 760, kb); shaded(S, 'rect', { x: 110, y: 600, width: 860, height: 330, rx: 30 }, C.n2, C.n3, 6, 6); }
  blk(G, 150, 680, 170, 170, pop(t, 6.8), SKY, X2, 52);
  blk(G, 340, 680, 170, 170, pop(t, 7.1), SKY, X2, 52);
  for (let i = 0; i < 3; i++) blk(G, 560 + i * 54, 680, 44, 170, pop(t, 8.2 + i * .25), MINT, ['x'], 30);
  for (let i = 0; i < 4; i++) blk(G, 780 + (i % 2) * 54, 700 + Math.floor(i / 2) * 54, 44, 44, pop(t, 9.4 + i * .2), ZERO, ['1'], 26);
  tag(G, 330, 900, 'lado x', pop(t, 7.6), C.mist, 30); tag(G, 640, 900, 'x por 1', pop(t, 8.8), C.mist, 30); tag(G, 834, 900, '1 por 1', pop(t, 10.2), C.mist, 30);
  const F = riseFormula(G, t, 12.8, 999, 540, 1060, 72, ['2x', { sup: '2' }, '+', '3x', '+', '4'], { colors: {} });
  const kt = pop(t, 15.8);
  if (kt > 0.01 && F) {
    tag(G, F.at[0][0], 1130, 'término', kt, C.sky || C.blue, 30); tag(G, F.at[3][0], 1130, 'término', kt, C.mint, 30); tag(G, F.at[5][0], 1130, 'término', kt, C.sun, 30);
  }
  const kc = pop(t, 19.4);
  if (kc > 0.01) { chip(G, 300, 1230, 'coeficiente: 2', kc, SKY, C.night, 34); chip(G, 760, 1230, 'variable: x', kc, MINT, C.night, 34); }
  fchip(G, 540, 1385, ['x', { sup: '3' }], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 50);
}
// ---------- nivel 1 · el grado ----------
function level1(G, t) {
  starField(G, 63, 90);
  const kf = out(t, 32.4);
  fchip(G, 540, 700, ['x', { sup: '3' }], kf, SKY, 50);
  cube(G, 540, 760, 150, pop(t, 32.0) * out(t, 37.6), SKY, ['x', { sup: '3' }]);
  const F = riseFormula(G, t, 38.2, 999, 540, 760, 70, ['x', { sup: '3' }, '−', '4x', { sup: '2' }, '+', 'x', '−', '6'], { colors: { '−': C.coral } });
  if (F) {
    tag(G, F.at[0][0] + 10, 640, 'grado 3', pop(t, 39.6), C.sun, 34);
    tag(G, F.at[0][0], 850, 'coef. principal 1', pop(t, 41.6), C.blue, 30, 'start');
    tag(G, F.at[8][0], 850, 'independiente −6', pop(t, 42.8), C.coral, 30, 'end');
  }
  riseFormula(G, t, 44.6, 999, 540, 1000, 56, ['5x', '+', '7x', { sup: '4' }, '−', '1'], { colors: {} });
  tag(G, 540, 1080, 'grado 4: el mayor exponente, no el primero', pop(t, 46.0), C.sun, 34);
  riseFormula(G, t, 50.6, 999, 540, 1200, 52, ['9', ':', 'grado 0'], { colors: {} });
  fchip(G, 540, 1385, ['+'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 54);
}
// ---------- nivel 2 · sumar y restar ----------
function rowTiles(G, t, y, sq, bars, ones, t0, kGone = 0) {
  let x = 130;
  for (let i = 0; i < sq; i++) { blk(G, x, y, 120, 120, pop(t, t0 + i * .2), SKY, X2, 38); x += 130; }
  x = 400;
  const bc = bars < 0 ? NEG : MINT, nb = Math.abs(bars);
  for (let i = 0; i < nb; i++) { const g = i < 3 ? kGone : 0; blk(G, x, y, 32, 120, pop(t, t0 + .5 + i * .15) * (1 - g), bc, null); x += 40; }
  x = 620;
  for (let i = 0; i < ones; i++) blk(G, x + (i % 2) * 40, y + Math.floor(i / 2) * 40, 32, 32, pop(t, t0 + 1.2 + i * .1), ZERO, null);
}
function level2(G, t) {
  starField(G, 65, 90);
  fchip(G, 540, 700, ['+'], out(t, 61.0), MINT, 54);
  const kg = eio(seg(t, 69.4, 70.6));
  riseFormula(G, t, 60.0, 999, 540, 760, 48, ['(2x', { sup: '2' }, '+', '3x', '+', '4)', '+', '(x', { sup: '2' }, '−', '5x', '+', '1)'], { colors: {} });
  rowTiles(G, t, 820, 2, 3, 4, 60.4, kg);
  rowTiles(G, t, 990, 1, -5, 1, 63.4, kg);
  for (let i = 0; i < 3; i++) { const k = life(t, 66.6 + i * .3, 69.4); if (k > 0.01) lasso(G, 416 + i * 40, 965, 30, 160, k, C.cream, 4); }
  tag(G, 860, 1150, 'barra + barra roja = 0', pop(t, 67.0) * out(t, 72.2), C.cream, 32, 'end');
  riseFormula(G, t, 72.6, 999, 540, 1210, 64, ['3x', { sup: '2' }, '−', '2x', '+', '5'], { colors: { '−': C.coral } });
  const kn = life(t, 78.8, 84.4);
  if (kn > 0.01) { blk(G, 280, 1270, 90, 90, kn, SKY, X2, 30); tag(G, 410, 1330, '+', kn, C.cream, 44); blk(G, 450, 1270, 26, 90, kn, MINT, null); tag(G, 560, 1330, '≠ 2x³', kn, C.coral, 44, 'start'); }
  fchip(G, 540, 1385, ['(x + 1)(x + 4)'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 44);
}
// ---------- nivel 3 · multiplicar ----------
const RX = 300, RY = 790, XX = 200, UU = 46;
function level3(G, t) {
  starField(G, 67, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['(x + 1)(x + 4)'], out(t, 96.0), ZERO, 44);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 1000, k1);
    // lados
    tag(R, RX + XX / 2, RY - 20, 'x', pop(t, 95.8), C.cream, 40); tag(R, RX + XX + UU / 2, RY - 20, '1', pop(t, 95.8), C.cream, 40);
    tag(R, RX - 24, RY + XX / 2 + 14, 'x', pop(t, 96.2), C.cream, 40, 'end');
    for (let j = 0; j < 4; j++) tag(R, RX - 24, RY + XX + j * UU + 36, '1', pop(t, 96.2), C.cream, 34, 'end');
    blk(R, RX, RY, XX, XX, pop(t, 97.0), SKY, X2, 56);
    blk(R, RX + XX, RY, UU, XX, pop(t, 97.6), MINT, null);
    for (let j = 0; j < 4; j++) blk(R, RX, RY + XX + j * UU, XX, UU, pop(t, 98.2 + j * .2), MINT, null);
    for (let j = 0; j < 4; j++) blk(R, RX + XX, RY + XX + j * UU, UU, UU, pop(t, 99.2 + j * .2), ZERO, null);
    tag(R, RX + XX / 2, RY + XX + 2 * UU + 14, '4x', pop(t, 98.8), C.night, 40);
    tag(R, 600, RY + XX / 2 + 14, 'x', pop(t, 97.8), C.mint, 40, 'start');
    riseFormula(R, t, 101.8, 999, 540, 1290, 58, ['x', { sup: '2' }, '+', '5x', '+', '4'], { colors: {} });
    tag(R, 820, 980, 'grado 1 + grado 1', pop(t, 104.8), C.sun, 32, 'middle');
    tag(R, 820, 1030, '= grado 2', pop(t, 105.0), C.sun, 32, 'middle');
  }
  // vuelta a la caja de Caro: x = 10
  riseFormula(S, t, 108.0, 999, 540, 900, 66, ['2x', { sup: '2' }, '+', '3x', '+', '4'], { colors: {} });
  riseFormula(S, t, 109.4, 999, 540, 1030, 60, ['200', '+', '30', '+', '4', '=', '234'], { colors: { '234': C.sun } });
  tag(S, 540, 1130, 'con x = 10', pop(t, 109.0), C.mist, 40);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Polinomios', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'grado y operaciones', { 'font-size': 76, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA CAJA DE CARO', 'cuadrados, barras y cuadritos', 'el lado x no es un número fijo');
  label(p, t, 12.8, 18.6, 'UN POLINOMIO', 'la caja en un renglón', 'cada grupo es un término');
  label(p, t, 19.0, 24.4, 'SUS PARTES', 'el número de adelante: coeficiente', 'la letra: la variable');
  label(p, t, 24.8, 29.0, 'UNA SORPRESA', 'con x = 10, la caja', 'esconde un número');
  label(p, t, 31.8, 37.8, 'UN BLOQUE MÁS', 'un cubo de lado x', 'es x³');
  label(p, t, 38.2, 44.2, 'EL GRADO', 'el mayor exponente: 3', 'el número solo: independiente');
  label(p, t, 44.6, 50.2, 'OJO', 'el grado es el mayor exponente', 'aunque no esté de primero');
  label(p, t, 50.6, 56.6, 'UN NÚMERO SOLO', 'distinto de 0: grado 0', '¿y si juntamos dos cajas?');
  label(p, t, 60.0, 66.0, 'DOS CAJAS', 'se juntan bloque con bloque', 'cuadrados con cuadrados');
  label(p, t, 66.4, 72.2, 'PAREJAS QUE SE ANULAN', 'una barra y una barra roja', 'suman cero');
  label(p, t, 72.6, 78.4, 'TÉRMINOS SEMEJANTES', 'se suman sus coeficientes', 'la letra no cambia');
  label(p, t, 78.8, 84.4, 'NO SE MEZCLAN', 'un cuadrado y una barra', 'son piezas distintas');
  label(p, t, 84.8, 90.4, 'Y MULTIPLICAR', 'dos lados de un rectángulo', '¿qué área cubren?');
  label(p, t, 95.4, 101.4, 'UN RECTÁNGULO', 'lados x + 1 y x + 4', 'se llena con bloques');
  label(p, t, 101.8, 107.4, 'EL ÁREA', 'x² + 5x + 4', 'los grados se suman');
  label(p, t, 107.8, 114.0, 'LA SORPRESA', 'con x = 10 se lee 234', 'las cifras son los coeficientes');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['POLINOMIO', 'suma de términos como 2x², 3x y 4'],
  ['GRADO', 'el mayor exponente'],
  ['SUMAR', 'solo términos semejantes'],
  ['MULTIPLICAR', 'cada pieza por cada pieza: área'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }];
  ev.push({ t: 6.8, type: 'tile', i: 0 }, { t: 7.1, type: 'tile', i: 1 });
  for (let i = 0; i < 3; i++) ev.push({ t: 8.2 + i * .25, type: 'tile', i: i + 2 });
  for (let i = 0; i < 4; i++) ev.push({ t: 9.4 + i * .2, type: 'count', i });
  ev.push({ t: 12.8, type: 'rise' }, { t: 15.8, type: 'pop', i: 1 }, { t: 19.4, type: 'pop', i: 2 }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'hit' }, { t: 38.2, type: 'rise' }, { t: 39.6, type: 'pop', i: 0 }, { t: 41.6, type: 'pop', i: 1 }, { t: 42.8, type: 'pop', i: 2 });
  ev.push({ t: 44.6, type: 'rise' }, { t: 46.0, type: 'card' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 1 });
  ev.push({ t: 60.0, type: 'rise' });
  for (let i = 0; i < 6; i++) ev.push({ t: 60.4 + i * .3, type: 'tile', i }, { t: 63.4 + i * .3, type: 'tile', i: i + 1 });
  for (let i = 0; i < 3; i++) ev.push({ t: 66.6 + i * .3, type: 'lasso', d: .5 });
  ev.push({ t: 69.4, type: 'merge', i: 0 }, { t: 72.6, type: 'rise' }, { t: 73.2, type: 'yes' }, { t: 78.8, type: 'no' }, { t: 87.8, type: 'pop', i: 2 });
  ev.push({ t: 97.0, type: 'hit' }, { t: 97.6, type: 'tile', i: 0 });
  for (let j = 0; j < 4; j++) ev.push({ t: 98.2 + j * .2, type: 'tile', i: j + 1 }, { t: 99.2 + j * .2, type: 'count', i: j });
  ev.push({ t: 101.8, type: 'rise' }, { t: 102.4, type: 'yes' }, { t: 104.8, type: 'pop', i: 0 });
  ev.push({ t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 109.4, type: 'rise' }, { t: 110.2, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro tiene una caja llena de bloques.'],
  [4.0, 6.4, '¿Cómo anotarla sin dibujarla?'],
  [6.8, 9.6, 'Cuadrados de lado x, barras de x por uno,'],
  [9.8, 12.4, 'y cuadritos de uno por uno.'],
  [12.8, 15.6, 'Dos cuadrados, tres barras, cuatro cuadritos:'],
  [15.8, 18.6, 'dos x cuadrado, más tres x, más cuatro.'],
  [19.0, 21.8, 'La letra x es la variable.'],
  [22.0, 24.4, 'El número que la multiplica, el coeficiente.'],
  [24.8, 29.0, 'Y esconde una sorpresa: un número, cuando x vale diez.'],
  [31.8, 34.8, 'Un cubo de lado x es x al cubo.'],
  [35.0, 37.8, 'Además de áreas, hay volúmenes.'],
  [38.2, 41.0, 'En este polinomio, el mayor exponente es tres:'],
  [41.2, 44.2, 'grado tres; menos seis es el independiente.'],
  [44.6, 47.4, 'Ojo: el grado es el exponente mayor,'],
  [47.6, 50.2, 'aunque no esté de primero.'],
  [50.6, 53.6, 'Un número solo, distinto de cero, tiene grado cero.'],
  [53.8, 56.6, '¿Y si juntamos dos cajas?'],
  [60.0, 63.0, 'Se juntan cuadrados con cuadrados,'],
  [63.2, 66.0, 'barras con barras, cuadritos con cuadritos.'],
  [66.4, 69.2, 'Las barras rojas son negativas.'],
  [69.4, 72.2, 'Una barra y una roja se anulan.'],
  [72.6, 75.4, 'Quedan tres x al cuadrado, menos dos x,'],
  [75.6, 78.4, 'más cinco. Así se suman los semejantes.'],
  [78.8, 81.6, 'Un cuadrado y una barra no se juntan.'],
  [81.8, 84.4, 'Son piezas distintas.'],
  [84.8, 87.6, '¿Y multiplicar? Piensa en un rectángulo:'],
  [87.8, 90.4, 'los factores son sus lados.'],
  [95.4, 98.4, 'Lados x más uno y x más cuatro.'],
  [98.6, 101.4, 'Lo llenan un cuadrado, cinco barras, cuatro cuadritos.'],
  [101.8, 104.6, 'x cuadrado, más cinco x, más cuatro.'],
  [104.8, 107.4, 'Los grados se suman: uno más uno, dos.'],
  [107.8, 110.6, 'La caja de Caro, con x igual a diez:'],
  [110.8, 114.0, 'doscientos treinta y cuatro: sus cifras son los coeficientes.'],
  [115.4, 119.6, 'Caro anota su caja en un renglón,'],
  [119.8, 124.4, 'y con x igual a diez, se lee doscientos treinta y cuatro.'],
];
