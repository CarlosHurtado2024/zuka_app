// «Dominio y simplificación» (lección alg-25a de Zuka, Río de las Asíntotas, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): el sendero de Beto
// R(x) = (x² − 1)/(x² + 2x − 3) = (x − 1)(x + 1)/((x − 1)(x + 3)) = (x + 1)/(x + 3), x ≠ 1; 6 ÷ 0; 1 ÷ x cerca de 0 y lejos;
// el error (x + 5)/5 ≠ x + 1; dominio: todos los reales menos −3 y 1.
// Hilo (docs/storytelling-videos.md): Beto camina por un sendero junto al río; la fórmula falla en dos puntos.
// Sorpresa anunciada: en uno de ellos no hay río, solo falta una piedra (un hueco).
// Cierre: en −3 el sendero choca con un río (asíntota); en 1 solo le falta una piedra.
// Niveles: 0 el sendero → 1 por 1 ÷ x: dividir entre cero y la asíntota → 2 por x − 1: factorizar y cancelar →
// 3 por el dominio: río y hueco.
const POSTER = 104.0;
const SP = s => ({ sup: s });
const g1 = x => (x + 1) / (x + 3);
const RT = ['R(x)', '=', { fr: ['x² − 1', 'x² + 2x − 3'] }];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1440], r: 90, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1440], r: 90, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [520, 1440], r: 150, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 940], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'cerca de cero', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'el factor común', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'el dominio', L: [330, 1560] },
  ],
  stops: ['el sendero', 'dividir entre 0', 'simplificar', 'el dominio'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[84.8, 86.4], [110.8, 112.4], [119.0, 135]],
    wides: [[24.8, 26.2], [44.6, 46.0]],
    looks: [],
  },
};

// la curva (x + 1)/(x + 3) en sus dos ramas, recortada a [ylo, yhi]
function branches(p, M, k, col, sw, ylo, yhi) {
  curve(p, M, g1, -8, -3.05, k, col, sw, ylo, yhi);
  curve(p, M, g1, -2.95, 4, k, col, sw, ylo, yhi);
}
// Beto: un punto con cara que camina sobre la curva
function walker(p, M, x, k) {
  if (k <= 0.01) return;
  buddy(p, mx(M, x), my(M, g1(x)) - 44, 54, k, C.coral, C.coralD);
}

// ---------- nivel 0 · el sendero ----------
const M0 = { ox: 680, oy: 1000, s: 70, sy: 60 };
function level0(G, t) {
  starField(G, 171, 150);
  axes(G, t, 0.6, M0, -8, 4.2, -4, 6, { ticks: true });
  river(G, t, 1.2, M0, -3, -4, 6);
  branches(G, M0, eio(seg(t, 1.6, 4.4)), C.sun, 7, -4, 6);
  const xw = lerp(3.8, 1.25, eio(seg(t, 4.4, 11.4))) - (t > 12.8 ? 0 : 0);
  walker(G, M0, xw, pop(t, 4.0) * out(t, 28.6));
  const ka = pop(t, 12.8), kb = pop(t, 13.4);
  if (ka > 0.01) { el('circle', { cx: mx(M0, -3), cy: M0.oy, r: r1(14 * ka), fill: C.coral }, G); tag(G, mx(M0, -3) - 18, M0.oy + 50, 'x = −3', ka, C.coral, 34, 'end'); }
  if (kb > 0.01) { el('circle', { cx: mx(M0, 1), cy: M0.oy, r: r1(14 * kb), fill: C.coral }, G); tag(G, mx(M0, 1), M0.oy + 50, 'x = 1', kb, C.coral, 34); }
  tag(G, 470, 1400, 'abajo: 9 − 6 − 3 = 0 y 1 + 2 − 3 = 0', life(t, 13.0, 24.4), C.coral, 32);
  riseFormula(G, t, 6.8, 999, 470, 1310, 54, RT, { colors: {} });
  const kq = life(t, 15.8, 24.4);
  if (kq > 0.01) chip(G, 450, 1470, 'abajo da 0: ¿dividir entre 0?', kq, NEG, C.night, 36);
  fchip(G, 540, 1440, ['1 ÷ x'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · dividir entre cero y la asíntota ----------
const M1 = { ox: 260, oy: 1260, s: 110, sy: 55 };
function level1(G, t) {
  starField(G, 173, 90);
  fchip(G, 540, 700, ['1 ÷ x'], out(t, 32.4), ZERO, 50);
  const kd = 1 - eio(seg(t, 41.0, 41.4));
  if (kd > 0.01) {
    const Q = scaleAt(G, 540, 1000, kd);
    riseFormula(Q, t, 32.0, 999, 540, 820, 64, ['6 ÷ 2', '=', '3'], { colors: {} });
    for (let gI = 0; gI < 3; gI++) for (let j = 0; j < 2; j++) {
      const k = pop(t, 32.6 + gI * .3 + j * .1); if (k <= 0.01) continue;
      el('circle', { cx: 360 + gI * 180 + j * 50, cy: 900, r: r1(17 * k), fill: C.sun }, Q);
    }
    for (let gI = 0; gI < 3; gI++) { const k = eio(seg(t, 33.8 + gI * .2, 34.3 + gI * .2)); if (k > 0.01) el('rect', { x: 323 + gI * 180, y: 868, width: r1(124 * k), height: 64, rx: 30, fill: 'none', stroke: C.sunD, 'stroke-width': 4 }, Q); }
    riseFormula(Q, t, 35.0, 999, 540, 1060, 64, ['6 ÷ 0', '=', '?'], { colors: { '?': C.coral } });
    tag(Q, 540, 1140, 'ningún número de grupos de 0 hace 6', pop(t, 37.4), C.coral, 34);
  }
  axes(G, t, 41.2, M1, -0.5, 6, -0.5, 9.4, { ticks: true });
  river(G, t, 47.4, M1, 0, -0.5, 9.4);
  curve(G, M1, x => 1 / x, 0.106, 6, eio(seg(t, 41.6, 43.4)), C.sun, 7, -1, 9.4);
  const T = [['1 ÷ 1 = 1', 44.6], ['1 ÷ 0.1 = 10', 45.2], ['1 ÷ 0.01 = 100', 45.8], ['1 ÷ 0.001 = 1000', 46.4]];
  T.forEach(([s, t0], i) => { const k = pop(t, t0); if (k > 0.01) chip(G, 720, 700 + i * 76, s, k, i ? ZERO : POS, C.night, 34); });
  tag(G, mx(M1, 5.6), my(M1, 1 / 5.6) - 30, 'casi 0', pop(t, 50.8), C.mint, 34, 'end');
  arrowLine(G, [[mx(M1, 3.2), my(M1, 0.75)], [mx(M1, 5.8), my(M1, 0.3)]], eio(seg(t, 50.6, 51.4)), C.mint, 5);
  fchip(G, 540, 1440, ['x − 1'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), NEG, 50);
}
// ---------- nivel 2 · factorizar y cancelar ----------
const M2 = { ox: 620, oy: 1110, s: 55, sy: 46 };
function level2(G, t) {
  starField(G, 175, 90);
  fchip(G, 540, 700, ['x − 1'], out(t, 61.0), NEG, 50);
  const kr = 1 - eio(seg(t, 78.2, 78.6));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1000, kr);
    riseFormula(Q, t, 60.4, 999, 540, 830, 60, RT, { colors: {} });
    riseFormula(Q, t, 63.2, 999, 540, 980, 56, ['=', { fr: ['(x − 1)(x + 1)', '(x − 1)(x + 3)'] }], { colors: {} });
    const kc = eio(seg(t, 66.6, 67.2));
    if (kc > 0.01) for (const yy of [941, 983]) el('rect', { x: 418, y: yy - 4, width: r1(128 * kc), height: 7, rx: 3, fill: C.coral }, Q);
    riseFormula(Q, t, 69.4, 999, 540, 1130, 54, ['=', { fr: ['x + 1', 'x + 3'] }, ',', 'x ≠ 1'], { colors: { 'x ≠ 1': C.sun } });
    riseFormula(Q, t, 72.6, 999, 470, 1290, 50, [{ fr: ['x + 5', '5'] }, '≠', 'x + 1'], { colors: { '≠': C.coral } });
    badge(Q, 720, 1270, pop(t, 74.0), false);
    tag(Q, 470, 1380, 'el 5 de arriba es un término, no un factor', pop(t, 74.4), C.coral, 30);
  }
  axes(G, t, 78.6, M2, -8, 4.2, -4, 6, { ticks: true });
  branches(G, M2, eio(seg(t, 79.0, 80.4)), C.sun, 6, -4, 6);
  hole(G, mx(M2, 1), my(M2, 0.5), pop(t, 81.8), C.sun);
  lasso(G, mx(M2, 1), my(M2, 0.5), 36, 36, eio(seg(t, 82.0, 82.8)), C.mint, 5);
  tag(G, mx(M2, 1), my(M2, 0.5) - 44, 'hueco', pop(t, 82.4), C.mint, 34);
  river(G, t, 84.8, M2, -3, -4, 6);
  tag(G, mx(M2, -3) - 30, my(M2, 5.4), 'río', pop(t, 85.4), C.blue, 36, 'end');
  fchip(G, 520, 1440, ['¿qué x sirven?'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 46);
}
// ---------- nivel 3 · el dominio: río y hueco ----------
const M3 = { ox: 680, oy: 1180, s: 65, sy: 42 };
function level3(G, t) {
  starField(G, 177, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['¿qué x sirven?'], out(t, 96.0), ZERO, 46);
  riseFormula(S, t, 95.6, 107.4, 540, 820, 60, ['Dom', '=', { s: 'dR' }, '− {−3, 1}'], { colors: {} });
  tag(S, 540, 890, 'se mira en la fracción original, sin cancelar', pop(t, 98.6) * out(t, 107.4), C.mist, 32);
  axes(S, t, 99.4, M3, -8, 4.2, -4, 6, { ticks: true });
  river(S, t, 101.8, M3, -3, -4, 6);
  branches(S, M3, eio(seg(t, 99.8, 101.4)), C.sun, 6, -4, 6);
  hole(S, mx(M3, 1), my(M3, 0.5), pop(t, 104.8), C.sun);
  // Beto camina hacia la izquierda, salta el hueco y se detiene antes del río
  const xw = t < 109.6 ? lerp(3.6, 1.5, eio(seg(t, 106.6, 109.6))) : t < 110.6 ? lerp(1.5, 0.4, eio(seg(t, 109.6, 110.6))) : lerp(0.4, -1.6, eio(seg(t, 110.8, 112.8)));
  const jump = t > 109.6 && t < 110.6 ? Math.sin(Math.PI * seg(t, 109.6, 110.6)) * 40 : 0;
  const kw = pop(t, 106.4);
  if (kw > 0.01) buddy(S, mx(M3, xw), my(M3, g1(xw)) - 44 - jump, 54, kw, C.coral, C.coralD);
  const k1 = pop(t, 107.8), k2 = pop(t, 108.4);
  if (k1 > 0.01) chip(S, 540, 800, 'en −3: un río (asíntota)', k1, SKY, C.night, 40);
  if (k2 > 0.01) chip(S, 540, 880, 'en 1: falta una piedra (hueco)', k2, ZERO, C.night, 40);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Dominio y', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'simplificación', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EXPRESIÓN RACIONAL', 'polinomio ÷ polinomio', 'el sendero de Beto');
  label(p, t, 12.8, 18.6, 'DOS PROBLEMAS', 'abajo da 0', 'en x = −3 y en x = 1');
  label(p, t, 19.0, 24.4, 'EN x = −3', 'un río', 'la curva no lo cruza');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'en x = 1', 'pasa algo raro');
  label(p, t, 31.8, 37.8, 'DIVIDIR ENTRE CERO', '6 ÷ 2 = 3', '6 ÷ 0: ¿cuántos grupos?');
  label(p, t, 38.2, 44.2, 'NO ESTÁ DEFINIDO', 'ningún número sirve', 'pero cerca de 0…');
  label(p, t, 44.6, 50.2, 'UNA ASÍNTOTA', '1 ÷ x se dispara', 'y nunca toca el eje');
  label(p, t, 50.6, 56.6, 'MUY LEJOS', '1 ÷ x se acerca a 0', 'sin llegar');
  label(p, t, 60.0, 66.0, 'FACTORIZAR', 'arriba y abajo', 'factor común, cuadrados, trinomios');
  label(p, t, 66.4, 72.2, 'CANCELAR', 'el factor x − 1', 'queda (x + 1) ÷ (x + 3)');
  label(p, t, 72.6, 78.4, 'CUIDADO', 'solo factores', 'nunca términos sueltos');
  label(p, t, 78.8, 84.4, 'LA MISMA CURVA', 'salvo en x = 1', 'ahí queda un hueco');
  label(p, t, 84.8, 90.4, 'HUECO Y RÍO', 'x = 1: hueco', 'x = −3: asíntota');
  label(p, t, 95.4, 101.4, 'EL DOMINIO', 'todos menos −3 y 1', 'con la fracción original');
  label(p, t, 101.8, 107.4, 'EN LA GRÁFICA', 'x = −3: río', 'x = 1: hueco');
  label(p, t, 107.8, 114.0, 'EL SENDERO DE BETO', 'no cruza el río', 'y salta el hueco');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['RACIONAL', 'polinomio entre polinomio'],
  ['DOMINIO', 'sin los ceros del denominador'],
  ['SIMPLIFICAR', 'factorizar y cancelar factores'],
  ['ASÍNTOTA', 'la curva se acerca sin tocar'],
  ['HUECO', 'donde se canceló un factor'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.2, type: 'slide', d: .8 }, { t: 1.6, type: 'paint', d: 2.8 }, { t: 4.0, type: 'pop', i: 0 }];
  ev.push({ t: 6.8, type: 'rise' }, { t: 12.8, type: 'pop', i: 1 }, { t: 13.4, type: 'pop', i: 2 }, { t: 15.8, type: 'card' }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'rise' }, { t: 32.6, type: 'tile', i: 0 }, { t: 32.9, type: 'tile', i: 1 }, { t: 33.2, type: 'tile', i: 2 }, { t: 35.0, type: 'rise' }, { t: 38.2, type: 'no' });
  ev.push({ t: 41.0, type: 'away', d: .4 }, { t: 41.6, type: 'paint', d: 1.8 });
  for (let i = 0; i < 4; i++) ev.push({ t: 44.6 + i * .6, type: 'pop', i });
  ev.push({ t: 47.4, type: 'slide', d: .8 }, { t: 50.6, type: 'slide', d: .8 }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'rise' }, { t: 66.6, type: 'slide', d: .6 }, { t: 69.4, type: 'rise' }, { t: 72.6, type: 'rise' }, { t: 74.0, type: 'no' });
  ev.push({ t: 78.2, type: 'away', d: .4 }, { t: 79.0, type: 'paint', d: 1.4 }, { t: 81.8, type: 'pop', i: 1 }, { t: 82.0, type: 'lasso', d: .8 }, { t: 84.8, type: 'slide', d: .8 }, { t: 87.8, type: 'pop', i: 2 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 98.6, type: 'card' }, { t: 99.8, type: 'paint', d: 1.6 }, { t: 101.8, type: 'slide', d: .8 }, { t: 104.8, type: 'pop', i: 1 });
  ev.push({ t: 106.4, type: 'pop', i: 0 }, { t: 107.8, type: 'hit' }, { t: 108.4, type: 'hit' }, { t: 109.6, type: 'yes' }, { t: 112.8, type: 'no' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k % 4 });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto camina por un sendero junto al río.'],
  [4.0, 6.6, 'El sendero sigue una fórmula.'],
  [6.8, 9.6, 'Una fracción de polinomios: una expresión racional.'],
  [9.8, 12.4, 'Pero en dos puntos, la fórmula falla.'],
  [12.8, 15.6, 'En menos tres y en uno, abajo da cero.'],
  [15.8, 18.6, 'Y dividir entre cero no se puede.'],
  [19.0, 21.8, 'En menos tres hay un río.'],
  [22.0, 24.4, '¿Y en uno?'],
  [24.8, 29.0, 'Pero en uno pasa algo raro: ya verás.'],
  [31.8, 34.8, 'Seis entre dos: tres grupos de dos.'],
  [35.0, 37.8, 'Seis entre cero: ¿cuántos grupos de cero?'],
  [38.2, 41.0, 'Ninguna cantidad sirve: no está definido.'],
  [41.2, 44.2, 'Cerca de cero, uno entre x se dispara.'],
  [44.6, 47.4, 'Diez, cien, mil: sube pegada al eje.'],
  [47.6, 50.2, 'Nunca lo toca: es una asíntota.'],
  [50.6, 53.6, 'Para x muy grande, se acerca a cero.'],
  [53.8, 56.6, 'Ahora, el sendero de Beto factorizado.'],
  [60.0, 63.0, 'Se factoriza arriba y abajo.'],
  [63.2, 66.0, 'Arriba, diferencia de cuadrados; abajo, un trinomio.'],
  [66.4, 69.2, 'Aparece x menos uno en los dos.'],
  [69.4, 72.2, 'Se cancela: es un factor común.'],
  [72.6, 75.4, 'Ojo: solo se cancelan factores.'],
  [75.6, 78.4, 'En x más cinco, el cinco no es factor.'],
  [78.8, 81.6, 'La curva simplificada es la misma…'],
  [81.8, 84.4, 'salvo en uno: ahí falta un punto.'],
  [84.8, 87.6, 'Un hueco, no un río.'],
  [87.8, 90.4, 'Entonces, ¿qué x se permiten?'],
  [95.4, 98.4, 'Todos los reales, menos menos tres y uno.'],
  [98.6, 101.4, 'Se miran en la fracción original, sin cancelar.'],
  [101.8, 104.6, 'En menos tres, la curva huye hacia el infinito.'],
  [104.8, 107.4, 'En uno, sigue derecho, con un hueco.'],
  [107.8, 110.6, 'Beto salta el hueco de un paso,'],
  [110.8, 114.0, 'pero el río no lo puede cruzar.'],
  [115.4, 119.6, 'En menos tres, el sendero choca con un río;'],
  [119.8, 124.4, 'en uno, solo le falta una piedra.'],
];
