// «Residuo, factor y división sintética» (lección alg-92 de Zuka, Cordillera Cúbica, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): la cordillera de Ana P(x) = x³ − 2x² − 5x + 6,
// P(2) = −4 (residuo de dividir entre x − 2), P(3) = 0 (x − 3 es factor) y la división sintética entre x − 3:
// 1, −2, −5, 6 → 1, 1, −2 | 0, cociente x² + x − 2 = (x + 2)(x − 1).
// Hilo (docs/storytelling-videos.md): Beto apuesta a que la vía cruza la cordillera en x = 2. Para saberlo habría que
// dividir entre x − 2. Sorpresa anunciada: el residuo ya está en el dibujo, es la altura del terreno ahí.
// Cierre: en 2 el terreno va 4 por debajo de la vía (Beto pierde); los cruces son −2, 1 y 3.
// Niveles: 0 la apuesta → 1 por P = (x − 2)q + r: el teorema del residuo → 2 por P(3): el teorema del factor →
// 3 por la fila de coeficientes: la división sintética.
const POSTER = 101.0;
const SP = s => ({ sup: s });
const P = x => x ** 3 - 2 * x * x - 5 * x + 6;
const PT = ['x', SP('3'), '− 2x', SP('2'), '− 5x + 6'];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 210, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1440], r: 90, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [500, 1440], r: 170, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 900], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el residuo', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'en x = 3', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'la tabla', L: [330, 1560] },
  ],
  stops: ['la apuesta', 'el residuo', 'el factor', 'la tabla'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[63.2, 64.8], [104.8, 106.4], [119.0, 135]],
    wides: [[15.8, 17.2], [50.6, 52.0]],
    looks: [],
  },
};

// niebla sobre el tramo 1.6 < x < 3.5: Beto no ve el terreno ahí
function fog(p, t) {
  const k = pop(t, 0.8); if (k <= 0.01) return;
  [[2.0, 760, 150], [2.9, 700, 140], [2.4, 920, 170], [3.2, 1000, 120], [1.9, 1100, 130], [2.7, 1170, 150]].forEach(([x, y, r], i) =>
    el('ellipse', { cx: r1(mx(M0, x) + 14 * Math.sin(t * .7 + i)), cy: y, rx: r1(r * 1.3 * k), ry: r1(r * .8 * k), fill: C.mist, opacity: .93 }, p));
}
// ---------- nivel 0 · la apuesta de Beto ----------
const M0 = { ox: 480, oy: 900, s: 130, sy: 45 };
function level0(G, t) {
  starField(G, 151, 150);
  rail(G, t, 0.6, M0, -2.4, 3.5);
  ridge(G, M0, P, -2.4, 3.5, eio(seg(t, 1.0, 3.6)), -7.4, 8.4);
  fog(G, t);
  const kb = pop(t, 4.4);
  if (kb > 0.01) {
    el('circle', { cx: mx(M0, 2), cy: M0.oy, r: r1(16 * kb), fill: C.coral }, G);
    tag(G, mx(M0, 2), M0.oy - 34, 'x = 2 ?', kb, C.coral, 40);
  }
  const kq = life(t, 6.8, 18.6);
  if (kq > 0.01) chip(G, 450, 1440, 'P ÷ (x − 2): ¿residuo 0?', kq, NEG, C.night, 36);
  tag(G, mx(M0, 2) + 30, M0.oy + 150, '?', pop(t, 16.8), C.sun, 72, 'start');
  riseFormula(G, t, 9.8, 999, 520, 1320, 44, ['P(x)', '=', ...PT], { colors: {} });
  fchip(G, 470, 1440, ['P(x) = (x − 2) · q(x) + r'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 40);
}
// ---------- nivel 1 · el teorema del residuo ----------
function level1(G, t) {
  starField(G, 153, 90);
  fchip(G, 540, 700, ['P(x) = (x − 2) · q(x) + r'], out(t, 32.4), ZERO, 40);
  riseFormula(G, t, 32.0, 999, 540, 830, 54, ['P(x)', '=', '(x − 2) · q(x)', '+ r'], { colors: { '+ r': C.sun } });
  tag(G, 540, 900, 'divisor · cociente + residuo', pop(t, 35.0), C.mist, 34);
  riseFormula(G, t, 38.2, 999, 540, 1000, 50, ['P(2)', '=', '(2 − 2) · q(2)', '+ r'], { colors: { '(2 − 2) · q(2)': C.coral, '+ r': C.sun } });
  tag(G, 540, 1070, '2 − 2 = 0: ese pedazo vale 0', pop(t, 41.2), C.coral, 34);
  riseFormula(G, t, 44.6, 999, 540, 1180, 68, ['P(2)', '=', 'r'], { colors: { 'r': C.sun } });
  riseFormula(G, t, 47.6, 999, 540, 1290, 46, ['P(2)', '=', '8 − 8 − 10 + 6', '=', '−4'], { colors: { '−4': C.coral } });
  badge(G, 870, 1180, pop(t, 50.6), false);
  fchip(G, 540, 1440, ['P(3)'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 48);
}
// ---------- nivel 2 · el teorema del factor ----------
const M2 = { ox: 480, oy: 1170, s: 110, sy: 28 };
function level2(G, t) {
  starField(G, 155, 90);
  fchip(G, 540, 700, ['P(3)'], out(t, 61.0), MINT, 48);
  riseFormula(G, t, 60.4, 72.2, 540, 800, 46, ['P(3)', '=', '27 − 18 − 15 + 6', '=', '0'], { colors: { '0': C.mint } });
  riseFormula(G, t, 72.6, 78.4, 540, 800, 48, ['P(c) = 0', { s: 'arrow' }, 'x − c es factor'], { colors: {} });
  riseFormula(G, t, 78.8, 999, 540, 800, 48, ['x − c es factor', { s: 'arrow' }, 'P(c) = 0'], { colors: {} });
  rail(G, t, 66.2, M2, -2.4, 3.5);
  ridge(G, M2, P, -2.4, 3.5, eio(seg(t, 66.4, 67.8)), -7.4, 8.4);
  const k3 = pop(t, 68.0);
  if (k3 > 0.01) { el('circle', { cx: mx(M2, 3), cy: M2.oy, r: r1(15 * k3), fill: C.mint }, G); tag(G, mx(M2, 3) + 20, M2.oy + 56, 'P(3) = 0', k3, C.mint, 34); }
  const kh = eio(seg(t, 69.4, 70.2));
  if (kh > 0.01) el('rect', { x: mx(M2, 2) - 5, y: M2.oy, width: 10, height: r1((my(M2, P(2)) - M2.oy) * kh), rx: 5, fill: C.coral }, G);
  tag(G, mx(M2, 2) - 20, my(M2, P(2)) + 50, 'P(2) = −4', pop(t, 70.2), C.coral, 34, 'end');
  [[-2, 79.6], [1, 80.2]].forEach(([x, t0]) => { const k = pop(t, t0); if (k > 0.01) el('circle', { cx: mx(M2, x), cy: M2.oy, r: r1(15 * k), fill: C.sun }, G); });
  tag(G, 540, 880, 'cada cruce es un factor', pop(t, 80.6), C.sun, 36);
  fchip(G, 500, 1440, ['1', '−2', '−5', '6'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 46);
}
// ---------- nivel 3 · la división sintética ----------
const CX = [400, 540, 680, 820], R1 = 860, R2 = 970, R3 = 1100;
function level3(G, t) {
  starField(G, 157, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['1', '−2', '−5', '6'], out(t, 96.0), SKY, 46);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    const A = { 'font-size': 60, 'font-weight': 700, 'text-anchor': 'middle' };
    [1, -2, -5, 6].forEach((v, i) => { const k = pop(t, 95.6 + i * .15); if (k > 0.01) text(Q, CX[i], R1, minus(v), { ...A, 'font-size': r1(60 * k), fill: C.cream }); });
    const kc = pop(t, 96.6);
    if (kc > 0.01) { shaded(Q, 'rect', { x: 196, y: R1 - 64, width: 96, height: 90, rx: 20 }, C.sun, C.sunD, 4, 4); text(Q, 244, R1, '3', { ...A, 'font-size': r1(60 * kc), fill: C.night }); }
    const kl = eio(seg(t, 97.6, 98.2));
    if (kl > 0.01) el('rect', { x: 330, y: R2 + 40, width: r1(560 * kl), height: 6, rx: 3, fill: C.mist }, Q);
    // bajar, multiplicar por 3, sumar
    const SUMS = [1, 1, -2, 0], PROD = [null, 3, 3, -6];
    SUMS.forEach((v, i) => {
      const ts = i ? 98.6 + i * 1.8 : 98.6, tp = ts - .8;
      if (i) {
        arrowLine(Q, [[CX[i - 1] + 20, R3 - 50], [CX[i] - 26, R2 + 8]], eio(seg(t, tp - .4, tp)) * out(t, tp + 1.4), C.sun, 5);
        const kp = pop(t, tp); if (kp > 0.01) text(Q, CX[i], R2, minus(PROD[i]), { ...A, 'font-size': r1(52 * kp), fill: C.sun });
      } else arrowLine(Q, [[CX[0], R1 + 24], [CX[0], R3 - 60]], eio(seg(t, 98.2, 98.6)) * out(t, 99.6), C.sun, 5);
      const k = pop(t, ts); if (k > 0.01) text(Q, CX[i], R3, minus(v), { ...A, 'font-size': r1(64 * k), fill: i === 3 ? C.mint : C.cream });
    });
    lasso(Q, CX[3], R3 - 22, 54, 54, eio(seg(t, 104.8, 105.6)), C.mint, 6);
    tag(Q, CX[3], R3 + 80, 'residuo', pop(t, 105.2), C.mint, 34);
    tag(Q, (CX[0] + CX[2]) / 2, R3 + 80, 'cociente', pop(t, 105.6), C.cream, 34);
    riseFormula(Q, t, 105.6, 999, 540, 1300, 48, ['x', SP('2'), '+ x − 2'], { colors: {} });
  }
  riseFormula(S, t, 108.0, 999, 540, 880, 46, ['P(x)', '=', '(x − 3)(x + 2)(x − 1)'], { colors: {} });
  const kc = pop(t, 110.4);
  if (kc > 0.01) chip(S, 540, 1010, 'cruces en −2, 1 y 3', kc, MINT, C.night, 42);
  const kd = pop(t, 111.2);
  if (kd > 0.01) chip(S, 540, 1130, 'en 2: el terreno va 4 abajo', kd, NEG, C.night, 40);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Residuo', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y factor', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA APUESTA DE BETO', 'la vía cruza en x = 2', 'la niebla tapa ese tramo');
  label(p, t, 12.8, 18.6, 'PARA SABERLO', 'dividir entre x − 2', 'y ver si el residuo es 0');
  label(p, t, 19.0, 24.4, 'UNA PISTA', 'el residuo', 'es la altura del terreno');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'y luego una tabla', 'que divide sin las x');
  label(p, t, 31.8, 37.8, 'TODA DIVISIÓN', 'P = (x − 2) · q + r', 'divisor, cociente, residuo');
  label(p, t, 38.2, 44.2, 'x = 2', 'el primer pedazo vale 0', 'porque 2 − 2 = 0');
  label(p, t, 44.6, 50.2, 'TEOREMA DEL RESIDUO', 'P ÷ (x − c) deja P(c)', 'entre x + 3, c = −3');
  label(p, t, 50.6, 56.6, 'MENOS CUATRO', 'Beto pierde', 'en 2 la vía no se cruza');
  label(p, t, 60.0, 66.0, 'EN x = 3', 'P(3) = 0', 'residuo cero');
  label(p, t, 66.4, 72.2, 'EN EL DIBUJO', 'el residuo es la altura', 'en 3 la montaña corta la vía');
  label(p, t, 72.6, 78.4, 'TEOREMA DEL FACTOR', 'si P(c) = 0', 'x − c es un factor');
  label(p, t, 78.8, 84.4, 'Y AL REVÉS', 'si x − c es factor', 'P(c) = 0: un cruce en c');
  label(p, t, 84.8, 90.4, 'DIVISIÓN SINTÉTICA', 'solo los coeficientes', 'sin escribir las x');
  label(p, t, 95.4, 101.4, 'LA TABLA', 'coeficientes 1, −2, −5, 6', 'y el 3 a un lado');
  label(p, t, 101.8, 107.4, 'BAJAR, MULTIPLICAR, SUMAR', 'la última casilla', 'es el residuo: 0');
  label(p, t, 107.8, 114.0, 'EL COCIENTE', 'x² + x − 2 = (x + 2)(x − 1)', 'cruces en −2, 1 y 3');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['RESIDUO', ['P ÷ (x − c)', ':', 'r = P(c)']],
  ['FACTOR', ['P(c) = 0', { s: 'arrow' }, 'x − c es factor']],
  ['SINTÉTICA', 'bajar, multiplicar por c, sumar'],
  ['LA ÚLTIMA', 'casilla es el residuo'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'paint', d: 2.6 }, { t: 4.4, type: 'pop', i: 0 }];
  ev.push({ t: 6.8, type: 'card' }, { t: 9.8, type: 'rise' }, { t: 15.8, type: 'slide', d: 1.0 }, { t: 16.8, type: 'pop', i: 1 }, { t: 24.8, type: 'pop', i: 2 });
  ev.push({ t: 32.0, type: 'rise' }, { t: 35.0, type: 'card' }, { t: 38.2, type: 'rise' }, { t: 41.2, type: 'card' }, { t: 44.6, type: 'rise' }, { t: 47.6, type: 'rise' }, { t: 50.6, type: 'no' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'yes' }, { t: 66.4, type: 'paint', d: 1.4 }, { t: 68.0, type: 'pop', i: 0 }, { t: 69.4, type: 'slide', d: .8 });
  ev.push({ t: 72.6, type: 'rise' }, { t: 78.8, type: 'rise' }, { t: 79.6, type: 'pop', i: 1 }, { t: 80.2, type: 'pop', i: 2 }, { t: 87.8, type: 'pop', i: 1 });
  for (let i = 0; i < 4; i++) ev.push({ t: 95.6 + i * .15, type: 'tile', i });
  ev.push({ t: 96.6, type: 'pop', i: 0 }, { t: 98.6, type: 'slide', d: .4 });
  for (let i = 1; i < 4; i++) ev.push({ t: 98.6 + i * 1.8 - .8, type: 'pop', i: 1 }, { t: 98.6 + i * 1.8, type: 'pop', i: 2 });
  ev.push({ t: 104.8, type: 'lasso', d: .8 }, { t: 105.6, type: 'rise' }, { t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 110.4, type: 'yes' }, { t: 111.2, type: 'hit' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto ve la cordillera de Ana entre niebla.'],
  [4.0, 6.6, 'Apuesta: la vía también cruza en dos.'],
  [6.8, 9.6, 'Para saberlo, habría que dividir entre x menos dos.'],
  [9.8, 12.4, 'Una división larga, paso a paso.'],
  [12.8, 15.6, 'Si el residuo es cero, gana la apuesta.'],
  [15.8, 18.6, 'Pero ese residuo tiene un secreto.'],
  [19.0, 21.8, 'Es la altura del terreno en ese punto.'],
  [22.0, 24.4, 'Veamos por qué.'],
  [24.8, 29.0, 'Y luego, una tabla que divide sin escribir las x.'],
  [31.8, 34.8, 'Toda división se escribe así:'],
  [35.0, 37.8, 'divisor por cociente, más residuo.'],
  [38.2, 41.0, 'Ahora pon x igual a dos.'],
  [41.2, 44.2, 'Dos menos dos es cero: ese pedazo desaparece.'],
  [44.6, 47.4, 'P de dos es el residuo.'],
  [47.6, 50.2, 'Ocho, menos ocho, menos diez, más seis…'],
  [50.6, 53.6, 'Menos cuatro: Beto pierde la apuesta.'],
  [53.8, 56.6, '¿Y en x igual a tres?'],
  [60.0, 63.0, 'Veintisiete, menos dieciocho, menos quince, más seis.'],
  [63.2, 66.0, 'Cero. Sin dividir, ya sabemos el residuo.'],
  [66.4, 69.2, 'En el dibujo, en tres corta la vía.'],
  [69.4, 72.2, 'En dos, el residuo es la altura: menos cuatro.'],
  [72.6, 75.4, 'Teorema del factor: si P de c es cero,'],
  [75.6, 78.4, 'x menos c es un factor de P.'],
  [78.8, 81.6, 'Al revés: factor x menos c, cruce en c.'],
  [81.8, 84.4, 'Falta la otra parte de P.'],
  [84.8, 87.6, 'Para hallarla hay una tabla'],
  [87.8, 90.4, 'que divide sin escribir las x.'],
  [95.4, 98.4, 'Los coeficientes en fila, y el tres al lado.'],
  [98.6, 101.4, 'Baja el uno; por tres, y se suma.'],
  [101.8, 104.6, 'Por tres y se suma, hasta el final.'],
  [104.8, 107.4, 'La última casilla, cero, es el residuo.'],
  [107.8, 110.6, 'Los otros números son el cociente.'],
  [110.8, 114.0, 'Y ese cociente cruza en menos dos y en uno.'],
  [115.4, 119.6, 'La vía cruza en menos dos, uno y tres.'],
  [119.8, 124.4, 'En dos, el terreno va menos cuatro: Beto perdió.'],
];
