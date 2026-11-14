// «Productos notables» (lección alg-3 de Zuka, Taller de los Bloques, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): la mesa de Beto (x + 4)² = x² + 8x + 16,
// 99² = (100 − 1)² = 9 801, 21 · 19 = 400 − 1 = 399 con el cuadrado recortado, (x + 2)(x + 6) = x² + 8x + 12 y el cubo
// (a + b)³ = a³ + 3a²b + 3ab² + b³.
// Hilo (docs/storytelling-videos.md): Beto agranda 4 unidades por lado una mesa cuadrada de lado x y cree que el área crece
// solo 16. La sorpresa: faltan dos tablas. Cierre: crece 8x + 16.
// Niveles: 0 la mesa de Beto → 1 por 99²: el cuadrado de una resta → 2 por 21 · 19: suma por diferencia → 3 por (x + 2)(x + 6).
const POSTER = 23.0;
const X2 = ['x', { sup: '2' }];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 90, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1440], r: 100, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1520], r: 150, A: [540, 700] },
  ],
  open: { Z0: 2.3, C: [540, 900], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'una resta', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'suma por resta', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'dos binomios', L: [330, 1560] },
  ],
  stops: ['la mesa', 'una resta', 'suma por resta', 'dos binomios'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[22.0, 23.6], [47.6, 49.2], [119.0, 135]],
    wides: [[15.8, 17.2], [72.6, 74.0]],
    looks: [],
  },
};

// ---------- nivel 0 · la mesa de Beto ----------
const MX = 250, MY = 640, MS = 300, ME = 200;
function level0(G, t) {
  starField(G, 71, 150);
  blk(G, MX, MY, MS, MS, pop(t, 1.0), SKY, X2, 80);
  tag(G, MX + MS / 2, MY - 20, 'x', pop(t, 6.8), C.cream, 44); tag(G, MX - 20, MY + MS / 2 + 14, 'x', pop(t, 6.8), C.cream, 44, 'end');
  const ko = eio(seg(t, 9.8, 10.6));
  if (ko > 0.01) el('rect', { x: MX, y: MY, width: r1((MS + ME) * ko), height: r1((MS + ME) * ko), rx: 14, fill: 'none', stroke: C.cream, 'stroke-width': 5, 'stroke-dasharray': '14 10' }, G);
  tag(G, MX + MS + ME / 2, MY - 20, '+4', pop(t, 10.6), C.sun, 44); tag(G, MX - 20, MY + MS + ME / 2 + 14, '+4', pop(t, 10.6), C.sun, 44, 'end');
  blk(G, MX + MS, MY + MS, ME, ME, pop(t, 13.4), ZERO, ['16'], 60);
  riseFormula(G, t, 13.8, 18.6, 540, 1250, 62, ['x', { sup: '2' }, '+', '16', '?'], { colors: { '?': C.coral } });
  badge(G, 820, 1230, pop(t, 16.2) * out(t, 18.6), false);
  blk(G, MX + MS, MY, ME, MS, pop(t, 19.2), MINT, ['4x'], 56);
  blk(G, MX, MY + MS, MS, ME, pop(t, 19.6), MINT, ['4x'], 56);
  riseFormula(G, t, 19.0, 999, 540, 1250, 60, ['(x + 4)', { sup: '2' }, '=', 'x', { sup: '2' }, '+', '8x', '+', '16'], { colors: { '8x': C.mint } });
  fchip(G, 540, 1385, ['99', { sup: '2' }], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 50);
}
// ---------- nivel 1 · el cuadrado de una resta ----------
const QX = 340, QY = 820, QS = 380, QB = 22;
function level1(G, t) {
  starField(G, 73, 90);
  fchip(G, 540, 700, ['99', { sup: '2' }], out(t, 32.4), SKY, 50);
  blk(G, QX, QY, QS, QS, pop(t, 32.0), SKY, null);
  tag(G, QX + QS / 2, QY + QS / 2 + 20, '100 · 100', pop(t, 32.6), C.night, 52);
  tag(G, QX + QS / 2, QY - 20, '100', pop(t, 32.4), C.cream, 40); tag(G, QX - 20, QY + QS / 2 + 14, '100', pop(t, 32.4), C.cream, 40, 'end');
  const k1 = pop(t, 38.6), k2 = pop(t, 39.4), k3 = pop(t, 41.6);
  if (k1 > 0.01) el('rect', { x: QX + QS - QB, y: QY, width: QB, height: QS, rx: 4, fill: C.coral, opacity: k1.toFixed(2) }, G);
  if (k2 > 0.01) el('rect', { x: QX, y: QY + QS - QB, width: QS, height: QB, rx: 4, fill: C.coral, opacity: k2.toFixed(2) }, G);
  if (k3 > 0.01) { el('rect', { x: QX + QS - QB, y: QY + QS - QB, width: QB, height: QB, rx: 3, fill: C.sun }, G); lasso(G, QX + QS - QB / 2, QY + QS - QB / 2, 30, 30, k3, C.sun, 5); }
  tag(G, QX + QS + 20, QY + QS / 2, '− 100', k1, C.coral, 38, 'start');
  tag(G, QX + QS / 2, QY + QS + 56, '− 100', k2, C.coral, 38);
  tag(G, QX + QS + 40, QY + QS + 30, '+ 1', k3, C.sun, 38, 'start');
  riseFormula(G, t, 44.6, 50.2, 540, 1330, 52, ['10 000 − 200 + 1', '=', '9 801'], { colors: { '9 801': C.sun } });
  riseFormula(G, t, 50.6, 999, 540, 1330, 52, ['(a − b)', { sup: '2' }, '=', 'a', { sup: '2' }, '− 2ab +', 'b', { sup: '2' }], { colors: {} });
  fchip(G, 540, 1440, ['21 · 19'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 46);
}
// ---------- nivel 2 · suma por diferencia ----------
const AX = 330, AY = 800, A = 300, B = 90;
function level2(G, t) {
  starField(G, 75, 90);
  fchip(G, 540, 700, ['21 · 19'], out(t, 61.0), ZERO, 46);
  const kq = pop(t, 60.4);
  blk(G, AX, AY, A - B, A, kq, SKY, null);
  blk(G, AX + A - B, AY, B, B, pop(t, 60.4) * (1 - eio(seg(t, 66.4, 67.2))), NEG, ['b²'], 34);
  const m = eio(seg(t, 69.6, 71.2));
  const sx = lerp(AX + A - B, AX, m), sy = lerp(AY + B, AY + A, m), sw = lerp(B, A - B, m), sh = lerp(A - B, B, m);
  blk(G, sx, sy, sw, sh, kq, MINT, null);
  tag(G, AX + A / 2, AY - 20, 'a', pop(t, 61.0) * out(t, 69.4), C.cream, 44);
  tag(G, AX - 20, AY + A / 2 + 14, 'a', pop(t, 61.0), C.cream, 44, 'end');
  tag(G, AX + A - B / 2, AY - 20, 'b', pop(t, 61.4) * out(t, 66.4), C.coral, 40);
  const kr = eio(seg(t, 71.4, 72.0));
  if (kr > 0.01) {
    el('rect', { x: AX, y: AY, width: A - B, height: A + B, rx: 12, fill: 'none', stroke: C.cream, 'stroke-width': 5, 'stroke-dasharray': '12 10', opacity: kr.toFixed(2) }, G);
    tag(G, AX + (A - B) / 2, AY - 20, 'a − b', kr, C.cream, 40);
    tag(G, AX + A - B + 24, AY + (A + B) / 2 + 14, 'a + b', kr, C.cream, 40, 'start');
  }
  riseFormula(G, t, 72.6, 999, 540, 1260, 54, ['(a + b)(a − b)', '=', 'a', { sup: '2' }, '−', 'b', { sup: '2' }], { colors: {} });
  riseFormula(G, t, 78.8, 999, 500, 1345, 44, ['21 · 19', '=', '400 − 1', '=', '399'], { colors: { '399': C.sun } });
  fchip(G, 540, 1520, ['(x + 2)(x + 6)'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 44);
}
// ---------- nivel 3 · dos binomios con un término común ----------
const RX = 250, RY = 800, XX = 200, UU = 40;
function level3(G, t) {
  starField(G, 77, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['(x + 2)(x + 6)'], out(t, 96.0), MINT, 44);
  const k1 = 1 - eio(seg(t, 104.4, 104.8));
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 960, k1);
    tag(R, RX + XX / 2, RY - 20, 'x', pop(t, 95.8), C.cream, 40); tag(R, RX + XX + 3 * UU, RY - 20, '+6', pop(t, 95.8), C.cream, 40);
    tag(R, RX - 20, RY + XX / 2 + 14, 'x', pop(t, 96.2), C.cream, 40, 'end'); tag(R, RX - 20, RY + XX + UU + 12, '+2', pop(t, 96.2), C.cream, 36, 'end');
    blk(R, RX, RY, XX, XX, pop(t, 96.8), SKY, X2, 56);
    for (let j = 0; j < 6; j++) blk(R, RX + XX + j * UU, RY, UU, XX, pop(t, 97.4 + j * .12), MINT, null);
    for (let j = 0; j < 2; j++) blk(R, RX, RY + XX + j * UU, XX, UU, pop(t, 98.2 + j * .2), MINT, null);
    for (let j = 0; j < 12; j++) blk(R, RX + XX + (j % 6) * UU, RY + XX + Math.floor(j / 6) * UU, UU, UU, pop(t, 98.8 + j * .08), ZERO, null);
    riseFormula(R, t, 99.8, 999, 540, 1200, 58, ['x', { sup: '2' }, '+', '8x', '+', '12'], { colors: { '8x': C.mint, '12': C.sun } });
    tag(R, 540, 1280, '6 + 2 = 8 y 6 · 2 = 12', pop(t, 101.8), C.mist, 38);
  }
  riseFormula(S, t, 104.8, 999, 540, 900, 52, ['(a + b)', { sup: '3' }, '=', 'a', { sup: '3' }, '+ 3a', { sup: '2' }, 'b + 3a', 'b', { sup: '2' }, '+', 'b', { sup: '3' }], { colors: {} });
  cube(S, 540, 1100, 130, pop(t, 105.6), SKY, null);
  tag(S, 540, 1250, '1, 3, 3, 1', pop(t, 106.4), C.sun, 48);
  riseFormula(S, t, 110.8, 999, 540, 1360, 50, ['la mesa:', '+ 8x + 16'], { colors: { '+ 8x + 16': C.mint } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Productos', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'notables', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA MESA DE BETO', 'una mesa cuadrada de lado x', 'cada lado crece 4: x + 4');
  label(p, t, 12.8, 18.6, 'LA CUENTA DE BETO', 'x² + 4²: le suma 16', '¿le alcanzan las tablas?');
  label(p, t, 19.0, 24.4, 'FALTAN DOS TABLAS', 'dos rectángulos de 4x', '(x + 4)² = x² + 8x + 16');
  label(p, t, 24.8, 29.0, 'EL CUADRADO DE UNA SUMA', '(a + b)² = a² + 2ab + b²', '¿y con una resta?');
  label(p, t, 31.8, 37.8, '99 AL CUADRADO', 'sin calculadora', '99 es 100 − 1');
  label(p, t, 38.2, 44.2, 'SE QUITAN DOS TIRAS', 'de 100 cada una', 'pero la esquina se quitó dos veces');
  label(p, t, 44.6, 50.2, 'SE DEVUELVE LA ESQUINA', '10 000 − 200 + 1', '9 801');
  label(p, t, 50.6, 56.6, 'EL CUADRADO DE UNA RESTA', '(a − b)² = a² − 2ab + b²', 'el doble producto resta');
  label(p, t, 60.0, 66.0, '21 POR 19', '(20 + 1)(20 − 1)', 'a = 20 y b = 1');
  label(p, t, 66.4, 72.2, 'SE QUITA LA ESQUINA', 'y la tira se pasa abajo', 'queda un rectángulo');
  label(p, t, 72.6, 78.4, 'SUMA POR DIFERENCIA', 'lados a + b y a − b', 'área a² − b²');
  label(p, t, 78.8, 84.4, 'LA CUENTA', '21 · 19 = 20² − 1²', '399');
  label(p, t, 84.8, 90.4, 'DOS BINOMIOS', 'con una x en común', '¿hay atajo?');
  label(p, t, 95.4, 101.4, 'UN RECTÁNGULO', 'lados x + 6 y x + 2', 'cuadrado, barras y cuadritos');
  label(p, t, 101.8, 107.4, 'EL ATAJO', 'los números se suman: 8x', 'y se multiplican: 12');
  label(p, t, 107.8, 114.0, 'EL CUBO', '(a + b)³ trae 1, 3, 3, 1', 'otro patrón por descubrir');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['CUADRADO DE UNA SUMA', ['(a + b)', { sup: '2' }, '=', 'a', { sup: '2' }, '+ 2ab +', 'b', { sup: '2' }]],
  ['CUADRADO DE UNA RESTA', ['(a − b)', { sup: '2' }, '=', 'a', { sup: '2' }, '− 2ab +', 'b', { sup: '2' }]],
  ['SUMA POR DIFERENCIA', ['(a + b)(a − b)', '=', 'a', { sup: '2' }, '−', 'b', { sup: '2' }]],
  ['TÉRMINO COMÚN', ['(x + a)(x + b)', '=', 'x', { sup: '2' }, '+ (a + b)x + ab']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'tile', i: 0 }];
  ev.push({ t: 6.8, type: 'pop', i: 0 }, { t: 9.8, type: 'lasso', d: .8 }, { t: 10.6, type: 'pop', i: 1 }, { t: 13.4, type: 'tile', i: 1 }, { t: 13.8, type: 'rise' }, { t: 16.2, type: 'no' });
  ev.push({ t: 19.0, type: 'rise' }, { t: 19.2, type: 'hit' }, { t: 19.6, type: 'hit' }, { t: 20.4, type: 'yes' }, { t: 24.8, type: 'pop', i: 2 });
  ev.push({ t: 32.0, type: 'tile', i: 0 }, { t: 38.6, type: 'slide', d: .4 }, { t: 39.4, type: 'slide', d: .4 }, { t: 41.6, type: 'lasso', d: .6 });
  ev.push({ t: 44.6, type: 'rise' }, { t: 45.2, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'tile', i: 0 }, { t: 66.4, type: 'away', d: .8 }, { t: 69.6, type: 'slide', d: 1.6 }, { t: 71.4, type: 'lasso', d: .6 });
  ev.push({ t: 72.6, type: 'rise' }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 96.8, type: 'hit' });
  for (let j = 0; j < 6; j++) ev.push({ t: 97.4 + j * .12, type: 'tile', i: j });
  for (let j = 0; j < 12; j += 2) ev.push({ t: 98.8 + j * .08, type: 'count', i: j });
  ev.push({ t: 99.8, type: 'rise' }, { t: 100.4, type: 'yes' }, { t: 104.4, type: 'away', d: .4 }, { t: 104.8, type: 'rise' }, { t: 105.6, type: 'hit' }, { t: 110.8, type: 'rise' }, { t: 111.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto tiene una mesa cuadrada de lado x.'],
  [4.0, 6.4, 'La quiere más grande. ¿Cuánto crece?'],
  [6.8, 9.6, 'Su área es x al cuadrado.'],
  [9.8, 12.4, 'Cada lado crece cuatro: x más cuatro.'],
  [12.8, 15.6, 'Beto calcula: x al cuadrado más dieciséis.'],
  [15.8, 18.6, 'Pero al armarla, le faltan dos tablas.'],
  [19.0, 21.8, 'Dos rectángulos de cuatro por x.'],
  [22.0, 24.4, 'x cuadrado, más ocho x, más dieciséis.'],
  [24.8, 29.0, 'Al elevar una suma al cuadrado, aparece el doble producto.'],
  [31.8, 34.8, '¿Y noventa y nueve al cuadrado, de cabeza?'],
  [35.0, 37.8, 'Noventa y nueve es cien menos uno.'],
  [38.2, 41.0, 'Al cuadrado de cien le quitamos dos tiras.'],
  [41.2, 44.2, 'Pero la esquina se quitó dos veces.'],
  [44.6, 47.4, 'Diez mil, menos doscientos, más uno.'],
  [47.6, 50.2, 'Nueve mil ochocientos uno.'],
  [50.6, 53.6, 'Con una resta, el doble producto resta.'],
  [53.8, 56.6, '¿Y veintiuno por diecinueve?'],
  [60.0, 63.0, 'Veintiuno es veinte más uno; diecinueve, veinte menos uno.'],
  [63.2, 66.0, 'Un cuadrado de lado a, y una esquina b.'],
  [66.4, 69.2, 'Quitamos la esquina.'],
  [69.4, 72.2, 'La tira de la derecha se pasa abajo.'],
  [72.6, 75.4, 'Un rectángulo: a más b, por a menos b.'],
  [75.6, 78.4, 'Su área: a cuadrado menos b cuadrado.'],
  [78.8, 81.6, 'Veintiuno por diecinueve: veinte al cuadrado, menos uno,'],
  [81.8, 84.4, 'trescientos noventa y nueve.'],
  [84.8, 87.6, '¿Y si los dos binomios comparten la x?'],
  [87.8, 90.4, 'Otro rectángulo lo muestra.'],
  [95.4, 98.4, 'Lados x más seis y x más dos.'],
  [98.6, 101.4, 'Un cuadrado, ocho barras y doce cuadritos.'],
  [101.8, 104.6, 'Ocho es seis más dos; doce, seis por dos.'],
  [104.8, 107.4, 'Y el cubo de una suma,'],
  [107.8, 110.6, 'trae uno, tres, tres, uno: otro patrón.'],
  [110.8, 114.0, 'Y la mesa de Beto: ocho x más dieciséis.'],
  [115.4, 119.6, 'La mesa de Beto no creció dieciséis:'],
  [119.8, 124.4, 'creció ocho x más dieciséis. Le faltaban las dos tablas.'],
];
