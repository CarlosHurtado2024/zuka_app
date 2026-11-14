// «Factorización» (lección alg-24b de Zuka, Taller de los Bloques, video 4) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): 3x + 6 = 3(x + 2), x² − 16 = (x + 4)(x − 4),
// x³ − 8 = (x − 2)(x² + 2x + 4), el montón de Caro x² + 5x + 6 = (x + 2)(x + 3), x² + 5x + 7 (sobra un cuadrito),
// 2x² + 7x + 3 = (2x + 1)(x + 3) y x² + 8x + 20 = (x + 4)² + 4.
// Hilo (docs/storytelling-videos.md): Caro tiene un montón de bloques (un cuadrado, cinco barras, seis cuadritos) y quiere
// armar con todos un rectángulo. Factorizar es encontrar sus lados. Sorpresa anunciada: con siete cubitos no se puede.
// Cierre: su rectángulo mide x + 2 por x + 3.
// Niveles: 0 el montón y el factor común → 1 por x² − 16: diferencia de cuadrados → 2 por x² + 5x + 6: el trinomio →
// 3 por x² + 8x + 20: completar el cuadrado.
const POSTER = 70.0;
const X2 = ['x', { sup: '2' }], SP = s => ({ sup: s });
const PILE = [['q', 170, 700, -8], ['b', 420, 680, 12], ['b', 500, 760, -20], ['b', 610, 690, 6], ['b', 740, 740, 28], ['b', 830, 690, -10],
  ['u', 380, 900, 10], ['u', 470, 930, -15], ['u', 560, 880, 20], ['u', 650, 940, 0], ['u', 760, 900, -25], ['u', 860, 930, 14]];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 100, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1440], r: 120, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1440], r: 130, A: [540, 700] },
  ],
  open: { Z0: 2.3, C: [540, 830], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'cuadrados', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'el montón', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'completar', L: [330, 1560] },
  ],
  stops: ['factor común', 'cuadrados', 'el trinomio', 'completar'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[68.0, 69.6], [104.8, 106.4], [119.0, 135]],
    wides: [[72.6, 74.0], [12.8, 14.2]],
    looks: [],
  },
};

// ---------- nivel 0 · el montón y el factor común ----------
function level0(G, t) {
  starField(G, 91, 150);
  const kout = 1 - eio(seg(t, 18.6, 19.2));
  PILE.forEach(([kind, x, y, rot], i) => {
    const k = pop(t, i ? 6.8 + i * .15 : 1.0) * kout; if (k <= 0.01) return;
    const R = g(G, { transform: `rotate(${rot + 4 * Math.sin(t * 1.3 + i)} ${x} ${y})` });
    if (kind === 'q') blk(R, x - 90, y - 90, 180, 180, k, SKY, X2, 50);
    else if (kind === 'b') blk(R, x - 22, y - 90, 44, 180, k, MINT, null);
    else blk(R, x - 22, y - 22, 44, 44, k, ZERO, null);
  });
  const kq = life(t, 12.8, 18.6);
  if (kq > 0.01) chip(G, 540, 1100, '¿un rectángulo con todo?', kq, NEG, C.night, 40);
  // 3x + 6 = 3(x + 2)
  const X = 260, U = 60, x0 = 350, y0 = 760;
  for (let r = 0; r < 3; r++) {
    blk(G, x0, y0 + r * U, X, U, pop(t, 19.4 + r * .25), MINT, ['x'], 30);
    for (let j = 0; j < 2; j++) blk(G, x0 + X + j * U, y0 + r * U, U, U, pop(t, 20.2 + r * .2 + j * .1), ZERO, null);
  }
  tag(G, x0 - 24, y0 + 1.5 * U + 14, '3', pop(t, 22.2), C.cream, 50, 'end');
  tag(G, x0 + (X + 2 * U) / 2, y0 - 22, 'x + 2', pop(t, 22.2), C.cream, 44);
  riseFormula(G, t, 22.0, 999, 540, 1120, 64, ['3x + 6', '=', '3(x + 2)'], { colors: { '3(x + 2)': C.sun } });
  tag(G, 540, 1200, 'el factor común sale', pop(t, 23.4), C.mist, 36);
  fchip(G, 540, 1385, ['x', SP('2'), '− 16'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 48);
}
// ---------- nivel 1 · diferencia de cuadrados ----------
const AX = 330, AY = 780, A = 260, B = 120;
function level1(G, t) {
  starField(G, 93, 90);
  fchip(G, 540, 700, ['x', SP('2'), '− 16'], out(t, 32.4), SKY, 48);
  const kq = pop(t, 32.0);
  blk(G, AX, AY, A - B, A, kq, SKY, null);
  blk(G, AX + A - B, AY, B, B, kq * (1 - eio(seg(t, 38.4, 39.2))), NEG, ['16'], 40);
  const m = eio(seg(t, 40.6, 42.2));
  blk(G, lerp(AX + A - B, AX, m), lerp(AY + B, AY + A, m), lerp(B, A - B, m), lerp(A - B, B, m), kq, MINT, null);
  tag(G, AX + A / 2, AY - 22, 'x', pop(t, 32.6) * out(t, 40.4), C.cream, 44);
  tag(G, AX + A - B / 2, AY + B + 40, '4', pop(t, 33.6) * out(t, 38.4), C.night, 36);
  const kr = eio(seg(t, 42.4, 43.0));
  if (kr > 0.01) {
    tag(G, AX + (A - B) / 2, AY - 22, 'x − 4', kr, C.cream, 40);
    tag(G, AX + A - B + 24, AY + (A + B) / 2 + 14, 'x + 4', kr, C.cream, 40, 'start');
  }
  riseFormula(G, t, 44.6, 999, 540, 1240, 58, ['x', SP('2'), '− 16', '=', '(x + 4)(x − 4)'], { colors: { '(x + 4)(x − 4)': C.sun } });
  riseFormula(G, t, 50.6, 999, 490, 1340, 42, ['a', SP('3'), '+', 'b', SP('3'), '=', '(a + b)(a', SP('2'), '− ab +', 'b', SP('2'), ')'], { colors: { '− ab +': C.coral } });
  fchip(G, 540, 1440, ['x', SP('2'), '+ 5x + 6'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 46);
}
// ---------- nivel 2 · el trinomio ----------
const TX = 330, TY = 780, XX = 200, UU = 50;
function level2(G, t) {
  starField(G, 95, 90);
  fchip(G, 540, 700, ['x', SP('2'), '+ 5x + 6'], out(t, 61.0), ZERO, 46);
  blk(G, TX, TY, XX, XX, pop(t, 60.4), SKY, X2, 56);
  for (let j = 0; j < 3; j++) blk(G, TX + XX + j * UU, TY, UU, XX, pop(t, 61.2 + j * .2), MINT, null);
  for (let j = 0; j < 2; j++) blk(G, TX, TY + XX + j * UU, XX, UU, pop(t, 62.0 + j * .2), MINT, null);
  for (let j = 0; j < 6; j++) blk(G, TX + XX + (j % 3) * UU, TY + XX + Math.floor(j / 3) * UU, UU, UU, pop(t, 66.6 + j * .2), ZERO, null);
  tag(G, TX + XX / 2, TY - 22, 'x', pop(t, 63.0), C.cream, 40); tag(G, TX + XX + 1.5 * UU, TY - 22, '+3', pop(t, 63.0), C.cream, 40);
  tag(G, TX - 22, TY + XX / 2 + 14, 'x', pop(t, 63.4), C.cream, 40, 'end'); tag(G, TX - 22, TY + XX + UU + 12, '+2', pop(t, 63.4), C.cream, 36, 'end');
  tag(G, 540, 1150, '2 · 3 = 6 y 2 + 3 = 5', pop(t, 68.2) * out(t, 78.4), C.mist, 38);
  tag(G, 540, 1150, '2 · 3 = 6, y 6 + 1 = 7: 2x² + 6x + x + 3', pop(t, 79.6), C.mist, 34);
  riseFormula(G, t, 69.4, 999, 540, 1240, 56, ['x', SP('2'), '+ 5x + 6', '=', '(x + 2)(x + 3)'], { colors: { '(x + 2)(x + 3)': C.sun } });
  const k7 = life(t, 72.8, 78.4);
  if (k7 > 0.01) { blk(G, 760, 1010, UU, UU, k7 * (1 + .1 * wob(t, 73.0, 14, 6)), ZERO, null); tag(G, 785, 1110, 'sobra', k7, C.coral, 34); badge(G, 860, 1035, pop(t, 74.0) * out(t, 78.4), false); }
  riseFormula(G, t, 78.8, 999, 490, 1340, 42, ['2x', SP('2'), '+ 7x + 3', '=', '(2x + 1)(x + 3)'], { colors: {} });
  fchip(G, 540, 1440, ['x', SP('2'), '+ 8x + 20'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 46);
}
// ---------- nivel 3 · completar el cuadrado ----------
const CX = 300, CY = 770, CS = 240, CU = 40;
function level3(G, t) {
  starField(G, 97, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['x', SP('2'), '+ 8x + 20'], out(t, 96.0), MINT, 46);
  blk(S, CX, CY, CS, CS, pop(t, 95.8), SKY, X2, 60);
  for (let j = 0; j < 4; j++) blk(S, CX + CS + j * CU, CY, CU, CS, pop(t, 96.6 + j * .15), MINT, null);
  for (let j = 0; j < 4; j++) blk(S, CX, CY + CS + j * CU, CS, CU, pop(t, 97.4 + j * .15), MINT, null);
  const kh = eio(seg(t, 98.4, 99.0));
  if (kh > 0.01) el('rect', { x: CX + CS, y: CY + CS, width: 4 * CU, height: 4 * CU, rx: 10, fill: 'none', stroke: C.sun, 'stroke-width': 4, 'stroke-dasharray': '10 8', opacity: kh.toFixed(2) }, S);
  for (let j = 0; j < 20; j++) {
    const inside = j < 16, k = pop(t, 101.8 + j * .1);
    const x = inside ? CX + CS + (j % 4) * CU : 820 + ((j - 16) % 2) * CU, y = inside ? CY + CS + Math.floor(j / 4) * CU : 1100 + Math.floor((j - 16) / 2) * CU;
    blk(S, x, y, CU, CU, k, ZERO, null);
  }
  tag(S, 860, 1220, 'sobran 4', pop(t, 104.0), C.coral, 34);
  tag(S, CX + (CS + 4 * CU) / 2, CY - 22, 'x + 4', pop(t, 104.4), C.cream, 40);
  riseFormula(S, t, 104.8, 999, 540, 1290, 54, ['x', SP('2'), '+ 8x + 20', '=', '(x + 4)', SP('2'), '+ 4'], { colors: {} });
  const kc = pop(t, 110.8);
  if (kc > 0.01) chip(S, 540, 1380, 'Caro: (x + 2)(x + 3)', kc, ZERO, C.night, 42);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 300, 'Factorización', { 'font-size': 100, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL MONTÓN DE CARO', 'un cuadrado, cinco barras', 'y seis cuadritos');
  label(p, t, 12.8, 18.6, 'EL RETO', 'armar un rectángulo con todos', 'factorizar es hallar sus lados');
  label(p, t, 19.0, 24.4, 'EMPECEMOS FÁCIL', '3x + 6: tres filas iguales', 'el 3 es el factor común');
  label(p, t, 24.8, 29.0, 'UNA SORPRESA', 'no todo montón se deja armar', 'ya veremos cuál');
  label(p, t, 31.8, 37.8, 'UN CUADRADO MENOS OTRO', 'x² con una esquina de 16', 'la esquina se quita');
  label(p, t, 38.2, 44.2, 'SE REACOMODA', 'la tira pasa abajo', 'lados x + 4 y x − 4');
  label(p, t, 44.6, 50.2, 'DIFERENCIA DE CUADRADOS', 'a² − b² = (a + b)(a − b)', 'el producto notable, al revés');
  label(p, t, 50.6, 56.6, 'CON CUBOS', 'a³ + b³ y a³ − b³', 'el signo del medio, al revés');
  label(p, t, 60.0, 66.0, 'EL MONTÓN DE CARO', 'el cuadrado en la esquina', 'las barras a los lados');
  label(p, t, 66.4, 72.2, 'DOS NÚMEROS', 'que multiplicados den 6', 'y sumados den 5: 2 y 3');
  label(p, t, 72.6, 78.4, 'LA SORPRESA', 'con un cuadrito más: x² + 5x + 7', 'sobra uno: no se arma');
  label(p, t, 78.8, 84.4, 'CON 2x²', '2 · 3 = 6: 6 y 1 suman 7', '7x se parte en 6x + x');
  label(p, t, 84.8, 90.4, '¿Y SI NO SE ARMA?', 'se puede completar', 'un cuadrado');
  label(p, t, 95.4, 101.4, 'COMPLETAR EL CUADRADO', 'las 8 barras: 4 y 4', 'falta la esquina');
  label(p, t, 101.8, 107.4, 'LA ESQUINA', 'pide 16 cuadritos de 20', 'sobran 4');
  label(p, t, 107.8, 114.0, 'UN CUADRADO Y ALGO MÁS', '(x + 4)² + 4', 'no es un producto, pero ayuda');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['FACTOR COMÚN', ['3x + 6', '=', '3(x + 2)']],
  ['DIF. DE CUADRADOS', ['a', SP('2'), '−', 'b', SP('2'), '=', '(a + b)(a − b)']],
  ['TRINOMIO', 'dos números: su producto y su suma'],
  ['COMPLETAR', ['x', SP('2'), '+ 8x + 20', '=', '(x + 4)', SP('2'), '+ 4']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 1.0, type: 'tile', i: 0 }];
  for (let i = 1; i < 12; i++) ev.push({ t: 6.8 + i * .15, type: i < 6 ? 'tile' : 'count', i });
  ev.push({ t: 12.8, type: 'card' }, { t: 18.6, type: 'away', d: .6 });
  for (let r = 0; r < 3; r++) ev.push({ t: 19.4 + r * .25, type: 'tile', i: r });
  ev.push({ t: 22.0, type: 'rise' }, { t: 22.6, type: 'yes' }, { t: 24.8, type: 'pop', i: 1 });
  ev.push({ t: 32.0, type: 'tile', i: 0 }, { t: 38.4, type: 'away', d: .8 }, { t: 40.6, type: 'slide', d: 1.6 }, { t: 44.6, type: 'rise' }, { t: 45.2, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 2 });
  ev.push({ t: 60.4, type: 'hit' });
  for (let j = 0; j < 5; j++) ev.push({ t: 61.2 + j * .2, type: 'tile', i: j });
  for (let j = 0; j < 6; j++) ev.push({ t: 66.6 + j * .2, type: 'count', i: j });
  ev.push({ t: 69.4, type: 'rise' }, { t: 70.0, type: 'yes' }, { t: 72.8, type: 'pop', i: 0 }, { t: 74.0, type: 'no' }, { t: 78.8, type: 'rise' }, { t: 87.8, type: 'pop', i: 3 });
  ev.push({ t: 95.8, type: 'hit' });
  for (let j = 0; j < 8; j++) ev.push({ t: 96.6 + j * .15 + (j > 3 ? .2 : 0), type: 'tile', i: j });
  ev.push({ t: 98.4, type: 'lasso', d: .6 });
  for (let j = 0; j < 20; j += 2) ev.push({ t: 101.8 + j * .1, type: 'count', i: j });
  ev.push({ t: 104.8, type: 'rise' }, { t: 105.4, type: 'yes' }, { t: 110.8, type: 'pop', i: 1 });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro tiene un montón de bloques revueltos.'],
  [4.0, 6.4, '¿Puede armar con todos un rectángulo?'],
  [6.8, 9.6, 'Un cuadrado, cinco barras,'],
  [9.8, 12.4, 'y seis cuadritos.'],
  [12.8, 15.6, 'Armar el rectángulo es hallar sus lados.'],
  [15.8, 18.6, 'Eso es factorizar: convertir una suma en producto.'],
  [19.0, 21.8, 'Algo fácil: tres barras y seis cuadritos.'],
  [22.0, 24.4, 'Tres filas de x más dos.'],
  [24.8, 29.0, 'Pero ojo: no todo montón se deja armar.'],
  [31.8, 34.8, 'Un cuadrado de lado x,'],
  [35.0, 37.8, 'con una esquina de cuatro por cuatro.'],
  [38.2, 41.0, 'Si quitamos la esquina,'],
  [41.2, 44.2, 'y pasamos la tira abajo, sale un rectángulo.'],
  [44.6, 47.4, 'x al cuadrado menos dieciséis:'],
  [47.6, 50.2, 'x más cuatro, por x menos cuatro.'],
  [50.6, 53.6, 'Con cubos: el signo del medio va al revés.'],
  [53.8, 56.6, 'Ahora sí, el montón de Caro.'],
  [60.0, 63.0, 'El cuadrado en la esquina.'],
  [63.2, 66.0, 'Tres barras a un lado, dos al otro.'],
  [66.4, 69.2, 'Los seis cuadritos llenan el hueco.'],
  [69.4, 72.2, 'Dos por tres, seis; dos más tres, cinco.'],
  [72.6, 75.4, 'La sorpresa: con siete cuadritos,'],
  [75.6, 78.4, 'uno sobra. Ese montón no se arma.'],
  [78.8, 81.6, 'Con dos cuadrados: dos por tres, seis;'],
  [81.8, 84.4, 'seis y uno suman siete.'],
  [84.8, 87.6, '¿Y si no forma un rectángulo?'],
  [87.8, 90.4, 'Se puede completar un cuadrado.'],
  [95.4, 98.4, 'Las ocho barras se reparten: cuatro y cuatro.'],
  [98.6, 101.4, 'Falta la esquina.'],
  [101.8, 104.6, 'Pide dieciséis cuadritos de veinte: sobran cuatro.'],
  [104.8, 107.4, 'x más cuatro al cuadrado, más cuatro.'],
  [107.8, 110.6, 'Un cuadrado más algo, no un producto.'],
  [110.8, 114.0, 'Volvamos al montón de Caro.'],
  [115.4, 119.6, 'Con un cuadrado, cinco barras y seis cuadritos,'],
  [119.8, 124.4, 'Caro arma x más dos por x más tres.'],
];
