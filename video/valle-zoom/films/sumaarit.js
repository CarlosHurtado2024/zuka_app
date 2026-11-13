// «La suma de una progresión aritmética» (lección alg-14b de Zuka, Escalera de Sigma, video 2) en estilo Scale Zoom Explainer.
// Ejemplos (no salen en los ejercicios de la lección): Gauss y 1 + 2 + … + 100 = 5 050 (escenas de respaldo), las dos escaleras
// 3 + 5 + 7 + 9 + 11 = 35 (respaldo), 7 + 12 + … + 57 = 352 (11 términos) y los impares que forman cuadrados (respaldo).
// Hilo (docs/storytelling-videos.md): cuenta la historia que un maestro mandó sumar del 1 al 100 y el niño Gauss terminó en un
// minuto. La sorpresa: cada columna suma 101, pero hay que sacar la mitad. Cierre: las dos escaleras explican la mitad.
// Niveles: 0 al derecho y al revés → 1 por «÷ 2»: las dos escaleras → 2 por 7 + … + 57: cuántos términos → 3 por los impares: cuadrados.
const POSTER = 46.0;
const XS = [170, 290, 410, 670, 790, 910], TOP = [1, 2, 3, 98, 99, 100];
const BX = i => 340 + i * 100, U = 34, BASE = 1250, VAL = [3, 5, 7, 9, 11];
const NX = i => 140 + i * 80;

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 90, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1385], r: 150, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 140, A: [540, 700] },
  ],
  open: { Z0: 2.4, C: [540, 820], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'la mitad', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: '¿cuántos hay?', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'los impares', L: [330, 1560] },
  ],
  stops: ['al revés', 'dos escaleras', 'cuántos hay', 'los impares'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[22.0, 23.6], [45.0, 46.6], [119.0, 135]],
    wides: [[16.0, 17.4], [76.6, 78.0]],
    looks: [],
  },
};

// ---------- nivel 0 · al derecho y al revés ----------
function level0(G, t) {
  starField(G, 9, 150);
  XS.forEach((x, i) => {
    chip(G, x, 760, String(TOP[i]), pop(t, i === 0 ? 1.0 : 6.8 + i * .15), POS, C.night, 40);
    chip(G, x, 870, String(101 - TOP[i]), pop(t, 12.8 + i * .15), SKY, C.night, 40);
    tag(G, x, 1004, '101', pop(t, 15.4 + i * .2), C.sun, 44);
  });
  dots(G, 540, 760, pop(t, 7.8)); dots(G, 540, 870, pop(t, 13.8)); dots(G, 540, 990, pop(t, 16.6), C.sun);
  tag(G, 80, 772, '+', pop(t, 6.8), C.mist, 40); tag(G, 80, 882, '+', pop(t, 12.8), C.mist, 40);
  const kl = eio(seg(t, 15.0, 15.6)); if (kl > 0.01) el('rect', { x: 110, y: 925, width: r1(860 * kl), height: 6, rx: 3, fill: C.mist }, G);
  riseFormula(G, t, 19.0, 999, 540, 1120, 60, ['100 · 101', '=', '10 100'], { colors: {} });
  riseFormula(G, t, 22.2, 999, 540, 1240, 60, ['10 100 ÷ 2', '=', '5 050'], { colors: { '5 050': C.sun } });
  fchip(G, 540, 1385, ['÷ 2'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 44);
}
// ---------- nivel 1 · dos escaleras ----------
function level1(G, t) {
  starField(G, 19, 90);
  fchip(G, 540, 700, ['÷ 2'], out(t, 33.0), ZERO, 44);
  VAL.forEach((v, i) => {
    const x = BX(i), k = pop(t, 32.4 + i * .3);
    if (k > 0.01) {
      const S = scaleAt(G, x, BASE, k);
      shaded(S, 'rect', { x: x - 45, y: BASE - v * U, width: 90, height: v * U, rx: 10 }, C.mint, C.mintD, 4, 4);
      tag(S, x, BASE - 20, String(v), 1, C.night, 40);
    }
    const c = 14 - v, kc = eo(seg(t, 38.6 + i * .25, 39.3 + i * .25));
    if (kc > 0.01) {
      const dy = -360 * (1 - kc), y0 = BASE - 14 * U + dy;
      shaded(G, 'rect', { x: x - 45, y: r1(y0 + 4), width: 90, height: c * U - 8, rx: 10 }, C.sun, C.sunD, 4, 4);
      tag(G, x, y0 + 46, String(c), kc, C.night, 40);
    }
  });
  const kr = eio(seg(t, 44.6, 45.4));
  if (kr > 0.01) {
    el('rect', { x: BX(0) - 55, y: BASE - 14 * U - 6, width: r1(510 * kr), height: 14 * U + 12, rx: 16, fill: 'none', stroke: C.cream, 'stroke-width': 5, 'stroke-dasharray': '12 10' }, G);
    tag(G, 540, BASE + 56, '5 columnas', pop(t, 45.2), C.cream, 38);
    tag(G, BX(4) + 80, BASE - 7 * U + 14, '14', pop(t, 45.6), C.cream, 52, 'start');
  }
  riseFormula(G, t, 47.4, 50.2, 540, 650, 60, ['5 · 14 ÷ 2', '=', '35'], { colors: { '35': C.mint } });
  riseFormula(G, t, 50.6, 999, 540, 650, 52, ['S', { sub: 'n' }, '=', 'n · (a', { sub: '1' }, '+', 'a', { sub: 'n' }, ')', '÷ 2'], { colors: {} });
  fchip(G, 540, 1385, ['7 + 12 + … + 57'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 40);
}
// ---------- nivel 2 · cuántos términos ----------
function level2(G, t) {
  starField(G, 31, 90);
  fchip(G, 540, 700, ['7 + 12 + … + 57'], out(t, 61.0), SKY, 40);
  const kx = eio(seg(t, 60.4, 61.0));
  if (kx > 0.01) el('rect', { x: 100, y: 937, width: r1(880 * kx), height: 6, rx: 3, fill: C.n3 }, G);
  for (let i = 0; i <= 10; i++) {
    const k = pop(t, 61.0 + i * .15); if (k <= 0.01) continue;
    el('circle', { cx: NX(i), cy: 940, r: r1((i === 0 || i === 10 ? 16 : 11) * k), fill: i === 0 || i === 10 ? C.blue : C.cream }, G);
    tag(G, NX(i), 1004, String(7 + 5 * i), k, C.cream, 32);
    if (i < 10) {
      const t0 = 66.6 + i * .3;
      hop(G, NX(i) + 10, NX(i + 1) - 10, 916, 34, eo(seg(t, t0, t0 + .35)), C.sun, 5);
      tag(G, (NX(i) + NX(i + 1)) / 2, 858, String(i + 1), pop(t, t0 + .25), C.sun, 30);
    }
  }
  riseFormula(G, t, 69.8, 78.4, 540, 1120, 56, ['57 − 7', '=', '50', ',', '50 ÷ 5', '=', '10 saltos'], { colors: {} });
  const kc = life(t, 72.8, 78.4);
  if (kc > 0.01) chip(G, 540, 1230, '10 saltos, 11 términos', kc, ZERO, C.night, 40);
  riseFormula(G, t, 78.8, 999, 540, 1120, 60, ['n', '=', '10 + 1', '=', '11'], { colors: { '11': C.sun } });
  riseFormula(G, t, 81.8, 999, 540, 1230, 50, ['S', { sub: '11' }, '=', '11 · (7 + 57) ÷ 2', '=', '352'], { colors: { '352': C.mint } });
  fchip(G, 540, 1385, ['1 + 3 + 5 + 7'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 40);
}
// ---------- nivel 3 · los impares ----------
const GX = 180, GY = 1100, CS = 70, LAY = [C.sun, C.mint, C.blue, C.coral];
function level3(G, t) {
  starField(G, 47, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['1 + 3 + 5 + 7'], out(t, 96.0), MINT, 40);
  for (let m = 0; m < 4; m++) {
    const t0 = 96.4 + m * 1.3;
    for (let r = 0; r <= m; r++) for (let c = 0; c <= m; c++) {
      if (Math.max(r, c) !== m) continue;
      const x = GX + c * CS + CS / 2, y = GY - r * CS - CS / 2, k = pop(t, t0 + (r + c - m) * .08);
      if (k <= 0.01) continue;
      el('rect', { x: r1(x - CS * .44 * k), y: r1(y - CS * .44 * k), width: r1(CS * .88 * k), height: r1(CS * .88 * k), rx: 10, fill: LAY[m] }, S);
    }
    const lines = ['1 = 1²', '1 + 3 = 2²', '1 + 3 + 5 = 3²', '1 + 3 + 5 + 7 = 4²'];
    tag(S, 520, 860 + m * 80, lines[m], pop(t, t0 + .4), LAY[m], 44, 'start');
  }
  riseFormula(S, t, 101.8, 107.4, 540, 1250, 52, ['1 + 3 + … + (2n − 1)', '=', 'n', { sup: '2' }], { colors: {} });
  riseFormula(S, t, 107.8, 999, 540, 1250, 52, ['4 · (1 + 7) ÷ 2', '=', '16', '=', '4', { sup: '2' }], { colors: { '16': C.mint } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'La suma', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'aritmética', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA TAREA', 'sumar del 1 al 100', 'cuentan que el niño Gauss lo resolvió');
  label(p, t, 12.8, 18.6, 'AL REVÉS', 'la misma suma, de atrás', 'hacia adelante');
  label(p, t, 19.0, 24.4, 'CADA COLUMNA, 101', '100 columnas: 10 100', 'pero así cuenta todo dos veces');
  label(p, t, 24.8, 29.0, 'LA MITAD', '5 050', '¿por qué dividir entre 2?');
  label(p, t, 31.8, 37.8, 'UNA ESCALERA', '3 + 5 + 7 + 9 + 11', 'cada término, un escalón');
  label(p, t, 38.2, 44.2, 'Y OTRA AL REVÉS', 'encaja encima', 'cada columna mide 14');
  label(p, t, 44.6, 50.2, 'UN RECTÁNGULO', '5 columnas de 14', 'cada escalera es la mitad');
  label(p, t, 50.6, 56.6, 'LA FÓRMULA', 'cuántos por (primero + último)', 'y la mitad');
  label(p, t, 60.0, 66.0, '¿CUÁNTOS HAY?', 'de 7 a 57, de 5 en 5', 'sin contarlos uno a uno');
  label(p, t, 66.4, 72.2, 'CUENTA LOS SALTOS', 'de 7 a 57 hay 50', 'saltos de 5: diez');
  label(p, t, 72.6, 78.4, 'OJO', '10 saltos unen 11 números', 'como postes y tramos');
  label(p, t, 78.8, 84.4, 'ONCE TÉRMINOS', 'los saltos, más uno', 'n = 11');
  label(p, t, 84.8, 90.4, 'LA SUMA', '11 por 64, la mitad', '352');
  label(p, t, 95.4, 101.4, 'LOS IMPARES', 'cada impar es una escuadra', 'que agranda el cuadrado');
  label(p, t, 101.8, 107.4, 'SIEMPRE UN CUADRADO', 'los n primeros impares', 'suman n²');
  label(p, t, 107.8, 114.0, 'CON LA FÓRMULA', '4 términos, de 1 a 7', '4 por 8, la mitad: 16');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['AL REVÉS', 'cada pareja suma primero + último'],
  ['LA SUMA', ['S', { sub: 'n' }, '=', 'n · (a', { sub: '1' }, '+', 'a', { sub: 'n' }, ')', '÷ 2']],
  ['CUÁNTOS HAY', ['n', '=', 'saltos + 1']],
  ['LOS IMPARES', ['1 + 3 + … + (2n − 1)', '=', 'n', { sup: '2' }]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }];
  for (let i = 1; i < 6; i++) ev.push({ t: 6.8 + i * .15, type: 'tile', i });
  for (let i = 0; i < 6; i++) ev.push({ t: 12.8 + i * .15, type: 'tile', i }, { t: 15.4 + i * .2, type: 'count', i });
  ev.push({ t: 19.0, type: 'rise' }, { t: 22.2, type: 'rise' }, { t: 22.8, type: 'yes' }, { t: 24.8, type: 'pop', i: 2 });
  for (let i = 0; i < 5; i++) ev.push({ t: 32.4 + i * .3, type: 'tile', i }, { t: 38.6 + i * .25, type: 'slide', d: .5 });
  ev.push({ t: 44.6, type: 'lasso', d: .8 }, { t: 47.4, type: 'rise' }, { t: 48.0, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 3 });
  for (let i = 0; i <= 10; i++) ev.push({ t: 61.0 + i * .15, type: 'tile', i });
  for (let i = 0; i < 10; i++) ev.push({ t: 66.6 + i * .3, type: 'count', i });
  ev.push({ t: 69.8, type: 'rise' }, { t: 72.8, type: 'card' }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 81.8, type: 'rise' }, { t: 85.4, type: 'yes' }, { t: 87.8, type: 'pop', i: 1 });
  for (let m = 0; m < 4; m++) ev.push({ t: 96.4 + m * 1.3, type: 'merge', i: m });
  ev.push({ t: 101.8, type: 'rise' }, { t: 107.8, type: 'rise' }, { t: 108.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Un maestro pidió sumar del uno al cien.'],
  [4.0, 6.4, 'Un niño terminó rapidísimo.'],
  [6.8, 9.6, 'Cuenta la historia que era Gauss.'],
  [9.8, 12.4, 'Escribió uno más dos, hasta cien.'],
  [12.8, 15.6, 'Y debajo, la misma suma al revés.'],
  [15.8, 18.6, 'Cada columna suma lo mismo: ciento uno.'],
  [19.0, 21.8, 'Cien columnas de ciento uno: diez mil cien.'],
  [22.0, 24.4, 'Pero así contó todo dos veces.'],
  [24.8, 29.0, 'La mitad: cinco mil cincuenta. ¿Por qué la mitad?'],
  [31.8, 34.8, 'Tres, cinco, siete, nueve, once:'],
  [35.0, 37.8, 'cada término es un escalón.'],
  [38.2, 41.0, 'Ponemos otra escalera igual, al revés, encima.'],
  [41.2, 44.2, 'Encajan: cada columna mide catorce.'],
  [44.6, 47.4, 'Forman un rectángulo de cinco por catorce.'],
  [47.6, 50.2, 'Cada escalera es la mitad: treinta y cinco.'],
  [50.6, 53.6, 'Cuántos términos, por primero más último, y la mitad.'],
  [53.8, 56.6, 'Pero a veces no sabemos cuántos hay.'],
  [60.0, 63.0, 'Siete, doce, diecisiete, hasta cincuenta y siete.'],
  [63.2, 66.0, '¿Cuántos términos son?'],
  [66.4, 69.2, 'Del siete al cincuenta y siete hay cincuenta.'],
  [69.4, 72.2, 'En saltos de cinco, son diez saltos.'],
  [72.6, 75.4, 'Cuidado: diez saltos unen once números,'],
  [75.6, 78.4, 'como los postes de una cerca.'],
  [78.8, 81.6, 'Once términos: los saltos, más uno.'],
  [81.8, 84.4, 'Ahora sí: once por sesenta y cuatro,'],
  [84.8, 87.6, 'y la mitad: trescientos cincuenta y dos.'],
  [87.8, 90.4, 'Y los impares guardan una sorpresa.'],
  [95.4, 98.4, 'Uno, más tres, más cinco, más siete.'],
  [98.6, 101.4, 'Cada impar, una escuadra que agranda el cuadrado.'],
  [101.8, 104.6, 'Los primeros n impares suman n al cuadrado.'],
  [104.8, 107.4, 'Cuatro impares: cuatro al cuadrado, dieciséis.'],
  [107.8, 110.6, 'La fórmula de las escaleras da lo mismo:'],
  [110.8, 114.0, 'cuatro por ocho, la mitad: dieciséis.'],
  [115.4, 119.6, 'Así, cuentan, lo vio el joven Gauss:'],
  [119.8, 124.4, 'cien por ciento uno, la mitad: cinco mil cincuenta.'],
];
