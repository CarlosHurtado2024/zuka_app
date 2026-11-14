// «Operaciones con fracciones algebraicas» (lección alg-25b de Zuka, Río de las Asíntotas, video 2) en estilo Scale Zoom
// Explainer. Ejemplos propios del video (no salen en los ejercicios de la lección): el estanque de Ana (3 h) y Beto (6 h):
// 1/3 + 1/6 = 2/6 + 1/6 = 1/2 por hora y 1 ÷ 1/2 = 2 h; con letras 1/x + 1/(x + 3) = (2x + 3)/(x(x + 3)); el producto
// (x² − 25)/(3x) · 6x/(x + 5) = 2(x − 5); dividir es multiplicar por la volteada; y la fracción compleja
// t = 1 ÷ (2x + 3)/(x(x + 3)) = x(x + 3)/(2x + 3), que con x = 3 da 3 · 6 ÷ 9 = 2.
// Hilo (docs/storytelling-videos.md): Ana sola llena el estanque junto al río en 3 horas y Beto en 6. ¿Juntos? El
// promedio (4.5 h) no puede ser: con ayuda debe tardar menos que Ana. Sorpresa anunciada: al final, una fracción dentro
// de otra. Cierre: juntos tardan 2 horas.
// Niveles: 0 el estanque → 1 por 1/3 + 1/6: sumar con números → 2 por 1/x + 1/(x + 3): con letras, multiplicar, dividir →
// 3 por t = 1 ÷ ritmo: la fracción compleja.
const POSTER = 70.0;
const SP = s => ({ sup: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1440], r: 120, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [500, 1440], r: 170, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [500, 1440], r: 170, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 940], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'sumar', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'con letras', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'el tiempo', L: [330, 1560] },
  ],
  stops: ['el estanque', 'con números', 'con letras', 'el tiempo'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[50.6, 52.2], [107.8, 109.4], [119.0, 135]],
    wides: [[12.8, 14.2], [98.6, 100.0]],
    looks: [],
  },
};

// un estanque de n franjas lleno hasta la fracción f (0 a 1), agua del color col
function tank(p, x, y, w, h, n, f, k, col) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x + w / 2, y + h, k), hh = h * clamp(f);
  el('rect', { x, y, width: w, height: h, rx: 18, fill: C.n2 }, S);
  if (hh > 1) el('rect', { x: x + 6, y: r1(y + h - hh), width: w - 12, height: r1(hh), rx: 14, fill: col }, S);
  for (let i = 1; i < n; i++) el('rect', { x: x + 8, y: r1(y + h * i / n - 2), width: w - 16, height: 4, rx: 2, fill: C.night, opacity: .6 }, S);
  el('rect', { x, y, width: w, height: h, rx: 18, fill: 'none', stroke: C.cream, 'stroke-width': 6 }, S);
}

// ---------- nivel 0 · el estanque ----------
function level0(G, t) {
  starField(G, 181, 150);
  const kt = pop(t, 0.8);
  // Ana: 3 franjas en 3 horas; Beto: 6 franjas en 6 horas (cada hora una franja)
  const fa = Math.floor(clamp(seg(t, 1.6, 4.6)) * 3 + 1e-6) / 3, fb = Math.floor(clamp(seg(t, 1.6, 7.6)) * 6 + 1e-6) / 6;
  tank(G, 200, 700, 260, 440, 3, fa, kt, C.blue);
  tank(G, 620, 700, 260, 440, 6, fb, kt, C.mint);
  tag(G, 330, 670, 'Ana: 3 horas', pop(t, 6.2), C.blue, 38);
  tag(G, 750, 670, 'Beto: 6 horas', pop(t, 6.4), C.mint, 38);
  const kq = life(t, 9.8, 18.6);
  if (kq > 0.01) { chip(G, 450, 1260, '¿juntos, 4.5 horas?', kq, NEG, C.night, 40); badge(G, 700, 1220, pop(t, 12.8) * out(t, 18.6), false); }
  tag(G, 330, 1210, '1/3 por hora', pop(t, 19.0), C.blue, 40);
  tag(G, 750, 1210, '1/6 por hora', pop(t, 19.6), C.mint, 40);
  riseFormula(G, t, 21.6, 999, 470, 1320, 60, [{ fr: ['1', '3'] }, '+', { fr: ['1', '6'] }, '=', '?'], { colors: { '?': C.sun } });
  fchip(G, 540, 1440, ['1/3 + 1/6'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 46);
}
// ---------- nivel 1 · sumar con números ----------
function level1(G, t) {
  starField(G, 183, 90);
  fchip(G, 540, 700, ['1/3 + 1/6'], out(t, 32.4), ZERO, 46);
  const kd = 1 - eio(seg(t, 44.2, 44.6));
  if (kd > 0.01) {
    const Q = scaleAt(G, 540, 1000, kd), sw = eio(seg(t, 35.2, 35.8));
    tag(Q, 200, 812, 'tercios', pop(t, 32.0), C.blue, 34, 'end');
    partBar(Q, 230, 770, 640, 70, 3, 1, pop(t, 32.0) * (1 - sw), 1, C.blue);
    partBar(Q, 230, 770, 640, 70, 6, 2, sw, 1, C.blue);
    tag(Q, 200, 912, 'sextos', pop(t, 32.6), C.mint, 34, 'end');
    partBar(Q, 230, 870, 640, 70, 6, 1, pop(t, 32.6), 1, C.mint);
    tag(Q, 900, 812, '2/6', pop(t, 36.0), C.blue, 36, 'start');
    const kc = pop(t, 38.2);
    if (kc > 0.01) { partBar(Q, 230, 1000, 640, 70, 6, 3, kc, eio(seg(t, 38.4, 39.4)), C.mint); partBar(Q, 230, 1000, 640, 70, 6, 2, kc, eio(seg(t, 38.4, 39.0)), C.blue); }
    riseFormula(Q, t, 39.6, 999, 540, 1190, 62, [{ fr: ['2', '6'] }, '+', { fr: ['1', '6'] }, '=', { fr: ['3', '6'] }, '=', { fr: ['1', '2'] }], { colors: {} });
    tag(Q, 540, 1290, 'medio estanque por hora', pop(t, 41.8), C.sun, 36);
  }
  riseFormula(G, t, 44.6, 999, 540, 860, 60, ['t', '=', '1 ÷', { fr: ['1', '2'] }], { colors: {} });
  riseFormula(G, t, 47.6, 999, 540, 1010, 60, ['=', '1 ·', { fr: ['2', '1'] }, '=', '2'], { colors: { '2': C.sun } });
  tag(G, 540, 1100, 'dividir: multiplicar por la volteada', pop(t, 48.6), C.mist, 34);
  const kh = pop(t, 50.6);
  if (kh > 0.01) chip(G, 540, 1220, 'juntos: 2 horas', kh, MINT, C.night, 46);
  fchip(G, 500, 1440, ['1/x + 1/(x + 3)'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 42);
}
// ---------- nivel 2 · con letras: sumar, multiplicar, dividir ----------
function level2(G, t) {
  starField(G, 185, 90);
  fchip(G, 540, 700, ['1/x + 1/(x + 3)'], out(t, 61.0), SKY, 42);
  const ks = 1 - eio(seg(t, 75.2, 75.6));
  if (ks > 0.01) {
    const Q = scaleAt(G, 540, 1000, ks);
    riseFormula(Q, t, 60.4, 999, 540, 830, 66, [{ fr: ['1', 'x'] }, '+', { fr: ['1', 'x + 3'] }], { colors: {} });
    tag(Q, 540, 920, 'se factorizan los de abajo; común: x(x + 3)', pop(t, 63.2), C.mist, 34);
    riseFormula(Q, t, 66.4, 999, 540, 1050, 56, ['=', { fr: ['x + 3', 'x(x + 3)'] }, '+', { fr: ['x', 'x(x + 3)'] }], { colors: {} });
    riseFormula(Q, t, 69.4, 999, 540, 1200, 64, ['=', { fr: ['2x + 3', 'x(x + 3)'] }], { colors: { '=': C.sun } });
    tag(Q, 540, 1300, 'el ritmo de los dos juntos', pop(t, 72.6), C.sun, 36);
  }
  const km = 1 - eio(seg(t, 84.2, 84.6));
  if (km > 0.01) {
  const G0 = G; G = scaleAt(G0, 540, 1000, km);
  riseFormula(G, t, 75.6, 999, 540, 830, 62, [{ fr: ['x² − 25', '3x'] }, '·', { fr: ['6x', 'x + 5'] }], { colors: {} });
  riseFormula(G, t, 78.8, 999, 540, 990, 54, ['=', { fr: ['(x − 5)(x + 5) · 6x', '3x · (x + 5)'] }], { colors: {} });
  riseFormula(G, t, 81.8, 999, 540, 1120, 56, ['=', '2(x − 5)', ',', 'x ≠ 0, −5'], { colors: { '2(x − 5)': C.sun } });
  G = G0;
  }
  riseFormula(G, t, 84.8, 999, 540, 850, 56, [{ fr: ['2', 'x'] }, '−', { fr: ['x − 1', 'x + 3'] }], { colors: {} });
  riseFormula(G, t, 85.8, 999, 540, 1010, 52, ['=', { fr: ['2(x + 3) − x(x − 1)', 'x(x + 3)'] }], { colors: {} });
  tag(G, 540, 1110, '− x(x − 1) = −x² + x: el signo va a todo', pop(t, 86.2), C.coral, 32);
  fchip(G, 500, 1440, ['t = 1 ÷ ritmo'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 44);
}
// ---------- nivel 3 · la fracción compleja ----------
function level3(G, t) {
  starField(G, 187, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['t = 1 ÷ ritmo'], out(t, 96.0), ZERO, 44);
  const k1 = 1 - eio(seg(t, 110.4, 110.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    riseFormula(Q, t, 95.6, 999, 540, 830, 56, ['t', '=', { fr: ['1', '1/x + 1/(x + 3)'] }], { colors: {} });
    riseFormula(Q, t, 97.0, 999, 540, 950, 52, ['=', { fr: ['1', '(2x + 3)/(x(x + 3))'] }], { colors: {} });
    riseFormula(Q, t, 98.6, 999, 540, 1090, 62, ['t', '=', { fr: ['x(x + 3)', '2x + 3'] }], { colors: { 't': C.sun } });
    riseFormula(Q, t, 105.2, 999, 540, 1220, 60, ['x = 3', ':', { fr: ['3 · 6', '9'] }, '=', '2'], { colors: { '2': C.sun } });
  }
  const kt = pop(t, 110.8);
  tank(S, 380, 760, 320, 420, 2, eio(seg(t, 111.2, 113.4)), kt, C.blue);
  if (kt > 0.01) chip(S, 540, 1270, 'juntos: 2 horas', pop(t, 111.4), MINT, C.night, 46);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Operaciones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'con fracciones', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL ESTANQUE', 'Ana: 3 h · Beto: 6 h', '¿y juntos?');
  label(p, t, 12.8, 18.6, '¿4.5 HORAS?', 'no: con ayuda es menos', 'que las 3 horas de Ana');
  label(p, t, 19.0, 24.4, 'POR HORA', 'Ana 1/3, Beto 1/6', 'sumar fracciones');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'al final', 'una fracción dentro de otra');
  label(p, t, 31.8, 37.8, 'DENOMINADOR COMÚN', 'tercios y sextos', 'pasan a sextos');
  label(p, t, 38.2, 44.2, 'SUMAR', '2/6 + 1/6 = 3/6', 'medio estanque por hora');
  label(p, t, 44.6, 50.2, 'EL TIEMPO', '1 ÷ 1/2 = 2', 'se voltea');
  label(p, t, 50.6, 56.6, 'JUNTOS', '2 horas', 'menos que las 3 de Ana');
  label(p, t, 60.0, 66.0, 'CON LETRAS', 'Ana x horas, Beto x + 3', 'común: x(x + 3)');
  label(p, t, 66.4, 72.2, 'COMPLETAR', 'a cada una, lo que le falta', 'arriba: 2x + 3');
  label(p, t, 72.4, 75.4, 'EL RITMO', '(2x + 3) ÷ [x(x + 3)]', 'por hora');
  label(p, t, 75.6, 84.4, 'MULTIPLICAR', 'factorizar y cancelar', 'queda 2(x − 5), x ≠ 0, −5');
  label(p, t, 84.8, 90.4, 'RESTAR', 'el menos afecta', 'a todo el numerador');
  label(p, t, 95.4, 101.4, 'FRACCIÓN COMPLEJA', 'primero se suma abajo', 'dividir: por la volteada');
  label(p, t, 101.8, 107.4, 'EL TIEMPO', 'x(x + 3) ÷ (2x + 3)', 'con x = 3: 2 horas');
  label(p, t, 107.8, 114.0, 'ANA Y BETO', 'llenan juntos en 2 horas', 'como con números');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SUMAR', 'denominador común'],
  ['MULTIPLICAR', 'factorizar y cancelar'],
  ['DIVIDIR', 'por la fracción volteada'],
  ['COMPLEJA', 'una fracción dentro de otra'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 0.8, type: 'pop', i: 0 }];
  for (let i = 1; i <= 6; i++) ev.push({ t: 1.6 + i, type: 'tile', i: i % 4 });
  ev.push({ t: 9.8, type: 'card' }, { t: 12.8, type: 'no' }, { t: 19.0, type: 'pop', i: 1 }, { t: 19.6, type: 'pop', i: 2 }, { t: 21.6, type: 'rise' }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'tile', i: 0 }, { t: 32.6, type: 'tile', i: 1 }, { t: 35.2, type: 'slide', d: .6 }, { t: 38.2, type: 'paint', d: 1.2 }, { t: 39.6, type: 'rise' }, { t: 41.8, type: 'card' });
  ev.push({ t: 44.2, type: 'away', d: .4 }, { t: 44.6, type: 'rise' }, { t: 47.6, type: 'rise' }, { t: 50.6, type: 'yes' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'card' }, { t: 66.4, type: 'rise' }, { t: 69.4, type: 'rise' }, { t: 72.6, type: 'card' }, { t: 75.2, type: 'away', d: .4 });
  ev.push({ t: 75.6, type: 'rise' }, { t: 78.8, type: 'rise' }, { t: 81.8, type: 'rise' }, { t: 84.8, type: 'rise' }, { t: 85.8, type: 'rise' }, { t: 86.2, type: 'card' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 97.0, type: 'rise' }, { t: 98.6, type: 'rise' }, { t: 105.2, type: 'rise' }, { t: 110.4, type: 'away', d: .4 }, { t: 110.8, type: 'pop', i: 0 }, { t: 111.2, type: 'paint', d: 2.2 }, { t: 111.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana sola llena el estanque en tres horas.'],
  [4.0, 6.6, 'Beto solo, en seis.'],
  [6.8, 9.6, '¿Cuánto tardan si llenan juntos?'],
  [9.8, 12.4, '¿Cuatro horas y media, el promedio?'],
  [12.8, 15.6, 'Imposible: con ayuda, Ana tardaría menos de tres.'],
  [15.8, 18.6, 'Hay que pensar en cuánto llenan por hora.'],
  [19.0, 21.8, 'Ana, un tercio; Beto, un sexto.'],
  [22.0, 24.4, 'Toca sumar fracciones.'],
  [24.8, 29.0, 'Y al final, una fracción dentro de otra fracción.'],
  [31.8, 34.8, 'Tercios y sextos no se suman directo.'],
  [35.0, 37.8, 'Se pasan a sextos: el denominador común.'],
  [38.2, 41.0, 'Dos sextos más un sexto:'],
  [41.2, 44.2, 'tres sextos, medio estanque por hora.'],
  [44.6, 47.4, 'Para llenar uno entero: uno entre un medio.'],
  [47.6, 50.2, 'Se voltea el medio: dos.'],
  [50.6, 53.6, 'Juntos tardan dos horas.'],
  [53.8, 56.6, '¿Y si los tiempos tienen letras?'],
  [60.0, 63.0, 'Ana tarda x horas; Beto, tres más.'],
  [63.2, 66.0, 'Común denominador: x por x más tres.'],
  [66.4, 69.2, 'Cada fracción se completa con lo que le falta.'],
  [69.4, 72.2, 'Arriba queda dos x más tres.'],
  [72.6, 75.4, 'Ese es el ritmo de los dos juntos.'],
  [75.6, 78.4, 'Multiplicar es más directo:'],
  [78.8, 81.6, 'se factoriza todo y se cancela.'],
  [81.8, 84.4, 'Queda dos por x menos cinco.'],
  [84.8, 87.6, 'Al restar, el menos va a todo el numerador.'],
  [87.8, 90.4, 'Con eso sale el tiempo de los dos.'],
  [95.4, 98.4, 'El tiempo es uno entre la suma de ritmos.'],
  [98.6, 101.4, 'Se suma abajo y se divide: se voltea.'],
  [101.8, 105.0, 'x por x más tres, entre dos x más tres.'],
  [105.2, 107.4, 'Con x igual a tres…'],
  [107.8, 110.6, 'tres por seis, entre nueve: dos.'],
  [110.8, 114.0, 'Lo mismo que con números.'],
  [115.4, 119.6, 'Juntos, Ana y Beto llenan el estanque'],
  [119.8, 124.4, 'en dos horas: menos que las tres de Ana.'],
];
