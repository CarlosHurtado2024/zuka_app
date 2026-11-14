// «Sistemas no lineales y fracciones parciales» (lección alg-102 de Zuka, Río de las Asíntotas, video 4) en estilo Scale
// Zoom Explainer. Ejemplos propios del video (no salen en los ejercicios de la lección): la curva de Beto
// f(x) = (3x + 1)/(x² − 1) con ríos en x = 1 y x = −1; la orilla y = x² y el puente y = 2x + 3, que se cortan en (3, 9) y
// (−1, 1); la impropia (x² + 4)/(x² − 1) = 1 + 5/(x² − 1); las formas Bx + C para un cuadrático y una fracción por potencia
// para un factor repetido; y 3x + 1 = A(x + 1) + B(x − 1): A + B = 3, A − B = 1, A = 2, B = 1.
// Hilo (docs/storytelling-videos.md): Beto dibuja el mapa del río; una curva se enreda entre dos ríos. Sorpresa anunciada:
// es la suma de dos curvas simples, cada una con su río. Cierre: f = 2/(x − 1) + 1/(x + 1), una por cada factor.
// Niveles: 0 la curva de los dos ríos → 1 por y = x², y = 2x + 3: el sistema no lineal → 2 por A/(x − 1) + B/(x + 1):
// la forma de las fracciones parciales → 3 por A(x + 1) + B(x − 1): hallar A y B y ver las dos curvas.
const POSTER = 111.0;
const SP = s => ({ sup: s });
const FF = x => (3 * x + 1) / (x * x - 1);

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [480, 1440], r: 160, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [480, 1440], r: 200, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [480, 1440], r: 180, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 960], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'dónde se cortan', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'partir', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'A y B', L: [330, 1560] },
  ],
  stops: ['dos ríos', 'el puente', 'partir', 'A y B'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[47.6, 49.2], [110.8, 112.4], [119.0, 135]],
    wides: [[19.0, 20.4], [101.8, 103.2]],
    looks: [],
  },
};

// la curva f en sus tres ramas
function three(p, M, f, k, col, sw, ylo, yhi) {
  curve(p, M, f, -4, -1.01, k, col, sw, ylo, yhi);
  curve(p, M, f, -0.99, 0.99, k, col, sw, ylo, yhi);
  curve(p, M, f, 1.01, 4, k, col, sw, ylo, yhi);
}

// ---------- nivel 0 · la curva de los dos ríos ----------
const M0 = { ox: 540, oy: 960, s: 95, sy: 50 };
function level0(G, t) {
  starField(G, 201, 150);
  axes(G, t, 0.6, M0, -4, 4.2, -6, 6, { ticks: true });
  river(G, t, 1.0, M0, -1, -6, 6);
  river(G, t, 1.3, M0, 1, -6, 6);
  three(G, M0, FF, eio(seg(t, 1.6, 4.6)), C.sun, 7, -6, 6);
  riseFormula(G, t, 6.8, 999, 470, 1320, 66, ['f(x)', '=', { fr: ['3x + 1', 'x² − 1'] }], { colors: {} });
  const ka = pop(t, 9.8), kb = pop(t, 10.4);
  if (ka > 0.01) tag(G, mx(M0, -1) - 24, my(M0, 5.4), 'x = −1', ka, C.blue, 34, 'end');
  if (kb > 0.01) tag(G, mx(M0, 1) + 24, my(M0, 5.4), 'x = 1', kb, C.blue, 34, 'start');
  fchip(G, 480, 1440, ['y = x', SP('2'), ',', 'y = 2x + 3'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 42);
}
// ---------- nivel 1 · el sistema no lineal ----------
const M1 = { ox: 440, oy: 1260, s: 90, sy: 48 };
function level1(G, t) {
  starField(G, 203, 90);
  fchip(G, 540, 700, ['y = x', SP('2'), ',', 'y = 2x + 3'], out(t, 32.4), SKY, 42);
  axes(G, t, 32.0, M1, -2.6, 4.4, -0.6, 10.8, { ticks: true });
  curve(G, M1, x => x * x, -2.6, 3.3, eio(seg(t, 32.4, 34.2)), C.blue, 9, -1, 10.8);
  curve(G, M1, x => 2 * x + 3, -2.6, 3.9, eio(seg(t, 35.0, 36.4)), C.sun, 7, -1, 10.8);
  tag(G, mx(M1, -2.4), my(M1, 7.0), 'orilla: y = x²', pop(t, 33.6), C.blue, 34, 'start');
  tag(G, mx(M1, 2.6), my(M1, 10.3), 'puente: y = 2x + 3', pop(t, 36.0), C.sun, 34, 'end');
  riseFormula(G, t, 41.2, 999, 540, 560, 56, ['x', SP('2'), '=', '2x + 3'], { colors: {} });
  riseFormula(G, t, 44.6, 999, 540, 650, 50, ['(x − 3)(x + 1)', '=', '0'], { colors: {} });
  [[3, 9, 47.6, '(3, 9)', 'end', -24], [-1, 1, 48.2, '(−1, 1)', 'start', 24]].forEach(([x, y, t0, s, a, dx]) => {
    const k = pop(t, t0); if (k <= 0.01) return;
    el('circle', { cx: mx(M1, x), cy: my(M1, y), r: r1(16 * k), fill: C.mint }, G);
    lasso(G, mx(M1, x), my(M1, y), 36, 36, eio(seg(t, t0 + .2, t0 + 1.0)), C.mint, 5);
    tag(G, mx(M1, x) + dx, my(M1, y) - 30, s, pop(t, 50.6), C.mint, 36, a);
  });
  fchip(G, 480, 1440, ['A/(x − 1) + B/(x + 1)'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 40);
}
// ---------- nivel 2 · la forma de las fracciones parciales ----------
function level2(G, t) {
  starField(G, 205, 90);
  fchip(G, 540, 700, ['A/(x − 1) + B/(x + 1)'], out(t, 61.0), ZERO, 40);
  const kr = 1 - eio(seg(t, 72.0, 72.4));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1000, kr);
    riseFormula(Q, t, 60.4, 999, 540, 840, 78, [{ fr: ['3x + 1', 'x² − 1'] }], { colors: {} });
    tag(Q, 540, 940, 'grado 1 arriba, grado 2 abajo: propia', pop(t, 63.2), C.mint, 34);
    riseFormula(Q, t, 66.4, 999, 540, 1070, 62, [{ fr: ['x² + 4', 'x² − 1'] }, '=', '1 +', { fr: ['5', 'x² − 1'] }], { colors: {} });
    tag(Q, 540, 1160, 'impropia: primero se divide', pop(t, 67.4), C.coral, 34);
    riseFormula(Q, t, 69.4, 999, 540, 1260, 52, ['x² − 1', '=', '(x − 1)(x + 1)'], { colors: { '(x − 1)(x + 1)': C.sun } });
  }
  riseFormula(G, t, 72.6, 999, 540, 860, 62, [{ fr: ['3x + 1', '(x − 1)(x + 1)'] }, '=', { fr: ['A', 'x − 1'] }, '+', { fr: ['B', 'x + 1'] }], { colors: {} });
  tag(G, 540, 960, 'una letra por cada factor lineal', pop(t, 75.6), C.sun, 34);
  riseFormula(G, t, 78.8, 999, 540, 1080, 58, ['x² + x + 1', ':', { fr: ['Bx + C', 'x² + x + 1'] }], { colors: {} });
  riseFormula(G, t, 81.8, 999, 540, 1230, 58, ['(x − 2)', SP('2'), ':', { fr: ['A', 'x − 2'] }, '+', { fr: ['B', '(x − 2)²'] }], { colors: {} });
  fchip(G, 480, 1440, ['A(x + 1) + B(x − 1)'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 40);
}
// ---------- nivel 3 · hallar A y B ----------
const M3 = { ox: 540, oy: 1110, s: 95, sy: 34 };
function level3(G, t) {
  starField(G, 207, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['A(x + 1) + B(x − 1)'], out(t, 96.0), MINT, 40);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1), col = { '(A + B)x': C.sun, '(A − B)': C.mint, '3x': C.sun, '+ 1': C.mint };
    riseFormula(Q, t, 95.6, 999, 540, 820, 48, ['A(x + 1) + B(x − 1)', '=', '3x + 1'], { colors: {} });
    riseFormula(Q, t, 97.0, 999, 540, 910, 48, ['(A + B)x', '+', '(A − B)', '=', '3x', '+ 1'], { colors: col });
    const ka = pop(t, 98.6), kb = pop(t, 99.2);
    if (ka > 0.01) chip(Q, 340, 1020, 'A + B = 3', ka, ZERO, C.night, 42);
    if (kb > 0.01) chip(Q, 740, 1020, 'A − B = 1', kb, MINT, C.night, 42);
    const kc = pop(t, 101.8);
    if (kc > 0.01) chip(Q, 540, 1130, 'sumando: 2A = 4, A = 2 y B = 1', kc, POS, C.night, 40);
    tag(Q, 540, 1240, 'atajo: x = 1 da 4 = 2A; x = −1 da −2 = −2B', pop(t, 102.8), C.mist, 32);
  }
  riseFormula(S, t, 107.8, 999, 540, 790, 62, ['f', '=', { fr: ['2', 'x − 1'] }, '+', { fr: ['1', 'x + 1'] }], { colors: {} });
  axes(S, t, 108.0, M3, -4, 4.2, -7, 7, { ticks: true });
  river(S, t, 108.2, M3, -1, -7, 7);
  river(S, t, 108.4, M3, 1, -7, 7);
  curve(S, M3, x => 2 / (x - 1), -4, 0.98, eio(seg(t, 108.6, 109.6)), C.blue, 4, -7, 7);
  curve(S, M3, x => 2 / (x - 1), 1.02, 4, eio(seg(t, 108.6, 109.6)), C.blue, 4, -7, 7);
  curve(S, M3, x => 1 / (x + 1), -4, -1.02, eio(seg(t, 109.4, 110.4)), C.mint, 4, -7, 7);
  curve(S, M3, x => 1 / (x + 1), -0.98, 4, eio(seg(t, 109.4, 110.4)), C.mint, 4, -7, 7);
  three(S, M3, FF, eio(seg(t, 110.8, 112.4)), C.sun, 7, -7, 7);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Cortar y', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'partir fracciones', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL MAPA DE BETO', 'una curva entre dos ríos', '(3x + 1) ÷ (x² − 1)');
  label(p, t, 12.8, 18.6, 'DOS RÍOS', 'x = 1 y x = −1', 'ahí abajo da 0');
  label(p, t, 19.0, 24.4, 'UN SECRETO', 'esta curva esconde algo', 'se verá al final');
  label(p, t, 24.8, 29.0, 'ANTES', '¿dónde se cortan', 'dos curvas?');
  label(p, t, 31.8, 37.8, 'LA ORILLA Y EL PUENTE', 'y = x² · y = 2x + 3', 'un sistema no lineal');
  label(p, t, 38.2, 44.2, 'IGUALAR', 'la misma altura', 'x² = 2x + 3');
  label(p, t, 44.6, 50.2, 'FACTORIZAR', '(x − 3)(x + 1) = 0', 'x = 3 o x = −1');
  label(p, t, 50.6, 56.6, 'DOS CORTES', '(3, 9) y (−1, 1)', 'donde las curvas se tocan');
  label(p, t, 60.0, 66.0, 'PROPIA', 'arriba, menor grado', 'que abajo');
  label(p, t, 66.4, 72.2, 'SI NO ES PROPIA', 'primero se divide', 'luego se factoriza abajo');
  label(p, t, 72.6, 78.4, 'UNA POR FACTOR', 'A ÷ (x − 1) + B ÷ (x + 1)', 'una letra por factor lineal');
  label(p, t, 78.8, 84.4, 'OTROS FACTORES', 'cuadrático sin raíces: Bx + C', 'repetido: una por potencia');
  label(p, t, 84.8, 90.4, '¿A Y B?', 'igualar', 'los numeradores');
  label(p, t, 95.4, 101.4, 'IGUALAR COEFICIENTES', 'A + B = 3', 'A − B = 1');
  label(p, t, 101.8, 107.4, 'UN SISTEMA', 'A = 2 y B = 1', 'como el del bote de Caro');
  label(p, t, 107.8, 114.0, 'LOS DOS RÍOS', '2 ÷ (x − 1): río en 1', '1 ÷ (x + 1): río en −1');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['NO LINEAL', 'igualar: donde se cortan'],
  ['PROPIA', 'si no lo es, dividir primero'],
  ['PARCIALES', 'una fracción por factor'],
  ['CONSTANTES', 'igualar los numeradores'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'slide', d: .8 }, { t: 1.6, type: 'paint', d: 3.0 }, { t: 6.8, type: 'rise' }, { t: 9.8, type: 'pop', i: 0 }, { t: 10.4, type: 'pop', i: 1 }];
  ev.push({ t: 15.8, type: 'card' }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'slide', d: .6 }, { t: 32.4, type: 'paint', d: 1.8 }, { t: 35.0, type: 'paint', d: 1.4 }, { t: 41.2, type: 'rise' }, { t: 44.6, type: 'rise' }, { t: 47.6, type: 'pop', i: 0 }, { t: 48.2, type: 'pop', i: 1 }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'card' }, { t: 66.4, type: 'rise' }, { t: 69.4, type: 'rise' }, { t: 72.0, type: 'away', d: .4 }, { t: 72.6, type: 'rise' }, { t: 75.6, type: 'card' }, { t: 78.8, type: 'rise' }, { t: 81.8, type: 'rise' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 97.0, type: 'rise' }, { t: 98.6, type: 'pop', i: 0 }, { t: 99.2, type: 'pop', i: 1 }, { t: 101.8, type: 'yes' }, { t: 104.8, type: 'card' });
  ev.push({ t: 107.4, type: 'away', d: .4 }, { t: 107.8, type: 'rise' }, { t: 108.2, type: 'slide', d: .8 }, { t: 108.6, type: 'paint', d: 1.0 }, { t: 109.4, type: 'paint', d: 1.0 }, { t: 110.8, type: 'paint', d: 1.6 });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto dibuja el mapa del río.'],
  [4.0, 6.6, 'Una curva se enreda entre dos ríos.'],
  [6.8, 9.6, 'Es una fracción con x al cuadrado abajo.'],
  [9.8, 12.4, 'Abajo da cero en uno y menos uno.'],
  [12.8, 15.6, 'Ahí están los dos ríos.'],
  [15.8, 18.6, '¿Cómo se dibuja algo tan enredado?'],
  [19.0, 21.8, 'Pero esta curva esconde un secreto.'],
  [22.0, 24.4, 'Lo verás al final.'],
  [24.8, 29.0, 'Pero antes: ¿dónde se cortan dos curvas?'],
  [31.8, 34.8, 'Una orilla curva: y igual a x al cuadrado.'],
  [35.0, 37.8, 'Un puente recto: dos x más tres.'],
  [38.2, 41.0, 'Se cortan donde las dos alturas son iguales.'],
  [41.2, 44.2, 'x al cuadrado igual a dos x más tres.'],
  [44.6, 47.4, 'Se factoriza: x menos tres por x más uno.'],
  [47.6, 50.2, 'x es tres, o menos uno.'],
  [50.6, 53.6, 'Los puntos: tres, nueve, y menos uno, uno.'],
  [53.8, 56.6, 'Igualar sirve también para partir fracciones.'],
  [60.0, 63.0, 'Primero, la fracción debe ser propia:'],
  [63.2, 66.0, 'arriba, menor grado que abajo.'],
  [66.4, 69.2, 'Si no, se divide antes.'],
  [69.4, 72.2, 'Luego se factoriza el denominador.'],
  [72.6, 75.4, 'Cada factor lineal pone una fracción con una letra.'],
  [75.6, 78.4, 'A con x menos uno; B, con la otra.'],
  [78.8, 81.6, 'Un factor cuadrático pide Bx más C;'],
  [81.8, 84.4, 'uno repetido, una fracción por potencia.'],
  [84.8, 87.6, '¿Cuánto valen A y B?'],
  [87.8, 90.4, 'Se igualan los numeradores.'],
  [95.4, 98.4, 'Se igualan los de arriba, término a término.'],
  [98.6, 101.4, 'A más B da tres; A menos B, uno.'],
  [101.8, 104.6, 'Como el bote de Caro: A dos, B uno.'],
  [104.8, 107.4, 'Atajo: x igual a uno da A.'],
  [107.8, 110.2, 'La curva enredada es dos simples:'],
  [110.4, 114.0, 'dos entre x menos uno, más uno entre x más uno.'],
  [115.4, 119.6, 'Los dos ríos de Beto son dos fracciones simples:'],
  [119.8, 124.4, 'una por cada factor del denominador.'],
];
