// «Ceros de un polinomio» (lección alg-93 de Zuka, Cordillera Cúbica, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): la cordillera de Caro Q(x) = x³ − 3x² + 4x − 2,
// que cruza la vía solo en x = 1; R(x) = (x − 2)²(x + 1), que toca en 2 y cruza en −1; los candidatos ±1, ±2; Descartes
// (+ − + −: 3 o 1 positivos; Q(−x) sin cambios: ningún negativo); Q(1) = 0, Q(2) = 2; Q = (x − 1)(x² − 2x + 2) y 1 ± i.
// Hilo (docs/storytelling-videos.md): la cordillera de Caro es de grado 3 pero cruza la vía una sola vez, y el teorema
// fundamental promete tres ceros. Sorpresa anunciada: los otros dos están fuera del dibujo.
// Cierre: son 1 + i y 1 − i, un espejo uno del otro, fuera de la vía.
// Niveles: 0 la cordillera de Caro → 1 por (x − 2)²(x + 1): multiplicidad → 2 por ±1, ±2: candidatos y Descartes →
// 3 por x² − 2x + 2: los ceros complejos.
const POSTER = 104.0;
const SP = s => ({ sup: s });
const QC = x => x ** 3 - 3 * x * x + 4 * x - 2;
const RR = x => (x - 2) ** 2 * (x + 1);
const QT = ['x', SP('3'), '− 3x', SP('2'), '+ 4x − 2'];

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 150, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1440], r: 120, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [520, 1440], r: 160, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 930], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'tocar sin cruzar', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'los candidatos', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'lo que queda', L: [330, 1560] },
  ],
  stops: ['tres ceros', 'multiplicidad', 'candidatos', 'plano complejo'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[79.0, 80.6], [101.8, 103.4], [119.0, 135]],
    wides: [[19.0, 20.4], [38.2, 39.6]],
    looks: [],
  },
};

// ---------- nivel 0 · la cordillera de Caro ----------
const M0 = { ox: 310, oy: 930, s: 230, sy: 55 };
function level0(G, t) {
  starField(G, 161, 150);
  rail(G, t, 0.6, M0, -0.6, 2.6);
  ridge(G, M0, QC, -0.6, 2.6, eio(seg(t, 1.0, 3.6)));
  const k1 = pop(t, 9.8);
  if (k1 > 0.01) {
    el('circle', { cx: mx(M0, 1), cy: M0.oy, r: r1(16 * k1), fill: C.sun }, G);
    lasso(G, mx(M0, 1), M0.oy, 36, 36, eio(seg(t, 10.0, 10.8)), C.sun, 6);
  }
  tag(G, mx(M0, 1) + 26, M0.oy + 60, 'x = 1', k1, C.sun, 38, 'start');
  riseFormula(G, t, 6.8, 999, 520, 1320, 46, ['Q(x)', '=', ...QT], { colors: {} });
  const kc = life(t, 13.0, 18.6);
  if (kc > 0.01) chip(G, 450, 1440, 'grado 3: tres ceros', kc, ZERO, C.night, 40);
  tag(G, mx(M0, 0.1), M0.oy + 150, '?', life(t, 19.4, 24.4), C.coral, 72);
  tag(G, mx(M0, 1.9), M0.oy - 110, '?', life(t, 19.8, 24.4), C.coral, 72);
  fchip(G, 470, 1440, ['(x − 2)', SP('2'), '(x + 1)'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 44);
}
// ---------- nivel 1 · multiplicidad ----------
const M1 = { ox: 440, oy: 1050, s: 150, sy: 55 }, M1Q = { ox: 290, oy: 1050, s: 200, sy: 55 };
function level1(G, t) {
  starField(G, 163, 90);
  fchip(G, 540, 700, ['(x − 2)', SP('2'), '(x + 1)'], out(t, 32.4), SKY, 44);
  riseFormula(G, t, 32.4, 50.2, 540, 610, 50, ['R(x)', '=', '(x − 2)', SP('2'), '(x + 1)'], { colors: {} });
  riseFormula(G, t, 50.6, 999, 540, 610, 46, ['Q(x)', '=', ...QT], { colors: {} });
  rail(G, t, 50.6, M1Q, -0.6, 2.6);
  ridge(G, M1Q, QC, -0.6, 2.6, eio(seg(t, 50.8, 51.8)));
  fchip(G, 540, 1440, ['±1', ',', '±2'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 48);
  const kR = 1 - eio(seg(t, 50.0, 50.4)); if (kR <= 0.01) return;
  G = scaleAt(G, 540, 1050, kR);
  rail(G, t, 33.0, M1, -1.5, 3.2);
  ridge(G, M1, RR, -1.5, 3.2, eio(seg(t, 33.6, 35.6)), -5.5, 6.2);
  const ka = pop(t, 35.4);
  if (ka > 0.01) { el('circle', { cx: mx(M1, -1), cy: M1.oy, r: r1(16 * ka), fill: C.mint }, G); tag(G, mx(M1, -1) - 20, M1.oy - 34, 'cruza', ka, C.mint, 36, 'end'); }
  const kb = pop(t, 38.6);
  if (kb > 0.01) {
    el('circle', { cx: mx(M1, 2), cy: M1.oy, r: r1(16 * kb), fill: C.sun }, G);
    lasso(G, mx(M1, 2), M1.oy, 40, 40, eio(seg(t, 38.8, 39.6)), C.sun, 6);
    tag(G, mx(M1, 2), M1.oy + 80, 'toca y rebota', kb, C.sun, 36);
  }
  tag(G, mx(M1, 2), M1.oy + 126, 'cero doble', pop(t, 41.4), C.cream, 34);
  const kz = life(t, 44.6, 51.8);
  if (kz > 0.01) chip(G, 450, 1440, 'ceros: −1, 2, 2', kz, MINT, C.night, 40);
}
// ---------- nivel 2 · candidatos y Descartes ----------
const CAND = [['+1', 300], ['−1', 460], ['+2', 620], ['−2', 780]];
function level2(G, t) {
  starField(G, 165, 90);
  fchip(G, 540, 700, ['±1', ',', '±2'], out(t, 61.0), ZERO, 48);
  riseFormula(G, t, 60.4, 999, 540, 800, 50, ['Q(x)', '=', ...QT], { colors: {} });
  tag(G, 540, 880, 'arriba divide al 2; abajo, al 1', pop(t, 63.4), C.mist, 34);
  CAND.forEach(([s, x], i) => {
    const k = pop(t, 66.6 + i * .2), neg = s[0] === '−', kx = neg ? eio(seg(t, 76.4, 76.8)) : 0;
    if (k <= 0.01) return;
    chip(G, x, 990, s, k, neg && t > 76.4 ? [C.n3, C.n3] : ZERO, C.night, 46);
    if (kx > 0.01) el('rect', { x: x - 50, y: 987, width: r1(100 * kx), height: 8, rx: 4, fill: C.coral }, G);
  });
  badge(G, 300 + 58, 940, pop(t, 79.0), true);
  badge(G, 620 + 58, 940, pop(t, 82.0), false);
  const SX = [360, 480, 600, 720];
  const sg = (signs, t0, t1, y) => signs.forEach((s, i) => { const k = life(t, t0 + i * .15, t1); if (k > 0.01) tile(G, SX[i], y, 80, s, k, s === '+' ? MINT : NEG); });
  sg(['+', '−', '+', '−'], 69.4, 75.4, 1130);
  for (let i = 0; i < 3; i++) hop(G, SX[i] + 10, SX[i + 1] - 10, 1080, 50, eio(seg(t, 70.4 + i * .4, 70.8 + i * .4)) * out(t, 75.4), C.sun, 5);
  tag(G, 540, 1220, '3 cambios: 3 o 1 positivos', life(t, 72.3, 75.4), C.sun, 36);
  sg(['−', '−', '−', '−'], 75.6, 79.8, 1130);
  tag(G, 540, 1220, 'Q(−x): sin cambios, ningún negativo', life(t, 75.8, 79.8), C.coral, 34);
  riseFormula(G, t, 78.8, 81.6, 520, 1310, 44, ['Q(1)', '=', '1 − 3 + 4 − 2', '=', '0'], { colors: { '0': C.mint } });
  riseFormula(G, t, 81.8, 999, 520, 1310, 44, ['Q(2)', '=', '8 − 12 + 8 − 2', '=', '2'], { colors: { '2': C.coral } });
  fchip(G, 520, 1440, ['x', SP('2'), '− 2x + 2'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 46);
}
// ---------- nivel 3 · los ceros complejos ----------
const M3 = { ox: 330, oy: 1220, s: 170 };
function level3(G, t) {
  starField(G, 167, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['x', SP('2'), '− 2x + 2'], out(t, 96.0), MINT, 46);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const P = scaleAt(S, 540, 1000, k1);
    riseFormula(P, t, 95.6, 999, 540, 790, 46, ['Q(x)', '=', '(x − 1)(x', SP('2'), '− 2x + 2)'], { colors: {} });
    tag(P, 540, 860, 'al dividir entre x − 1', pop(t, 97.0), C.mist, 34);
    riseFormula(P, t, 98.8, 999, 540, 950, 48, ['x', '=', { fr: ['2 ± √−4', '2'] }, '=', '1 ± i'], { colors: { '1 ± i': C.mint } });
    axes(P, t, 101.4, M3, -0.8, 3, -1.3, 1.3, { ticks: true });
    const kv = pop(t, 101.6);
    tag(P, M3.ox - 20, my(M3, 1.3) + 30, 'i', kv, C.mist, 36, 'end');
    tag(P, mx(M3, 2.9), M3.oy + 50, 'reales', kv, C.mist, 30, 'end');
    tag(P, mx(M3, 2.4), my(M3, 1.3) + 10, 'plano complejo', kv, C.cream, 34);
    const pts = [[0, C.sun, '1', 101.8], [1, C.mint, '1 + i', 102.4], [-1, C.mint, '1 − i', 103.0]];
    pts.forEach(([y, c, s, t0]) => {
      const k = pop(t, t0); if (k <= 0.01) return;
      el('circle', { cx: mx(M3, 1), cy: my(M3, y), r: r1(16 * k), fill: c }, P);
      tag(P, mx(M3, 1) + 30, my(M3, y) + (y ? 12 : 50), s, k, c, 38, 'start');
    });
    const km = eio(seg(t, 104.8, 105.6));
    if (km > 0.01) for (let j = 0; j < 8; j++) { const y0 = my(M3, 1) + 30 + j * 36; if ((j + 1) / 8 <= km + .01) el('rect', { x: mx(M3, 1) - 3, y: r1(y0), width: 6, height: 18, rx: 3, fill: C.sun }, P); }
  }
  riseFormula(S, t, 108.0, 999, 540, 900, 60, ['1', ',', '1 + i', ',', '1 − i'], { colors: { '1 + i': C.mint, '1 − i': C.mint } });
  const kc = pop(t, 110.4);
  if (kc > 0.01) chip(S, 540, 1030, 'grado 3: tres ceros', kc, ZERO, C.night, 42);
  const kd = pop(t, 111.2);
  if (kd > 0.01) chip(S, 540, 1150, 'dos fuera de la recta real', kd, MINT, C.night, 40);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Ceros de un', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'polinomio', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA CORDILLERA DE CARO', 'grado 3', 'cruza la vía una sola vez');
  label(p, t, 12.8, 18.6, 'TEOREMA FUNDAMENTAL', 'grado n: n ceros', 'contando complejos y repetidos');
  label(p, t, 19.0, 24.4, '¿Y LOS OTROS DOS?', 'no se ven', 'en la vía');
  label(p, t, 24.8, 29.0, 'ANTES', 'una que toca', 'la vía sin cruzarla');
  label(p, t, 31.8, 37.8, 'MULTIPLICIDAD', 'x − 2 aparece dos veces', 'en −1 cruza la vía');
  label(p, t, 38.2, 44.2, 'TOCA Y REBOTA', 'en 2 no cruza', 'es un cero doble');
  label(p, t, 44.6, 50.2, 'CONTANDO REPETIDOS', '1 + 2 = 3 ceros', 'tantos como el grado');
  label(p, t, 50.6, 56.6, 'LA DE CARO', 'cruza una sola vez', '¿cero triple o dos escondidos?');
  label(p, t, 60.0, 66.0, 'CEROS RACIONALES', 'c ÷ d, con c divisor del 2', 'y d divisor del 1, simplificada');
  label(p, t, 66.4, 72.2, 'CANDIDATOS', '±1 y ±2', 'si el primero fuera 2: también ±½');
  label(p, t, 72.6, 78.4, 'REGLA DE DESCARTES', '3 o 1 ceros positivos', 'Q(−x): ningún negativo');
  label(p, t, 78.8, 84.4, 'PROBAR', 'Q(1) = 0', 'Q(2) = 2: no');
  label(p, t, 84.8, 90.4, 'UN SOLO CERO REAL', 'x = 1', 'Q(0) < 0 < Q(2): cruza en medio');
  label(p, t, 95.4, 101.4, 'LO QUE QUEDA', 'x² − 2x + 2', 'Δ = 4 − 8 = −4');
  label(p, t, 101.8, 107.4, 'EL PLANO COMPLEJO', '1 + i y 1 − i', 'uno es el espejo del otro');
  label(p, t, 107.8, 114.0, 'EN PAREJAS', 'reales: a + bi con a − bi', 'enteros: s + t√u con s − t√u');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['FUNDAMENTAL', 'grado n: n ceros'],
  ['MULTIPLICIDAD', 'par rebota, impar cruza'],
  ['CANDIDATOS', 'c divide al último; d, al primero'],
  ['DESCARTES', 'cambios de signo: ceros positivos'],
  ['CONJUGADOS', '1 + i llega con 1 − i'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'paint', d: 2.6 }, { t: 6.8, type: 'rise' }, { t: 9.8, type: 'pop', i: 0 }, { t: 10.0, type: 'lasso', d: .8 }];
  ev.push({ t: 13.0, type: 'card' }, { t: 19.4, type: 'pop', i: 1 }, { t: 19.8, type: 'pop', i: 2 }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.4, type: 'rise' }, { t: 33.6, type: 'paint', d: 2.0 }, { t: 35.4, type: 'pop', i: 0 }, { t: 38.6, type: 'pop', i: 1 }, { t: 38.8, type: 'lasso', d: .8 }, { t: 44.6, type: 'card' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.4, type: 'card' });
  for (let i = 0; i < 4; i++) ev.push({ t: 66.6 + i * .2, type: 'tile', i }, { t: 69.4 + i * .15, type: 'pop', i });
  for (let i = 0; i < 3; i++) ev.push({ t: 70.4 + i * .4, type: 'slide', d: .4 });
  ev.push({ t: 75.6, type: 'pop', i: 0 }, { t: 76.4, type: 'no' }, { t: 78.8, type: 'rise' }, { t: 79.0, type: 'yes' }, { t: 81.8, type: 'rise' }, { t: 82.0, type: 'no' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 98.8, type: 'rise' }, { t: 101.4, type: 'slide', d: .6 }, { t: 101.8, type: 'pop', i: 0 }, { t: 102.4, type: 'pop', i: 1 }, { t: 103.0, type: 'pop', i: 2 }, { t: 104.8, type: 'slide', d: .8 });
  ev.push({ t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 110.4, type: 'yes' }, { t: 111.2, type: 'hit' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k % 4 });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro también tiene una cordillera.'],
  [4.0, 6.6, 'De grado tres, como la de Ana.'],
  [6.8, 9.6, 'Pero la suya cruza la vía una sola vez.'],
  [9.8, 12.4, 'En x igual a uno, y nada más.'],
  [12.8, 15.6, 'Y un teorema dice: grado tres, tres ceros.'],
  [15.8, 18.6, 'El teorema fundamental del álgebra.'],
  [19.0, 21.8, '¿Dónde están los otros dos?'],
  [22.0, 24.4, 'Fuera del dibujo, ya verás.'],
  [24.8, 29.0, 'Primero, una montaña que toca la vía sin cruzarla.'],
  [31.8, 34.8, 'Esta tiene el factor x menos dos repetido.'],
  [35.0, 37.8, 'En menos uno, la montaña cruza la vía.'],
  [38.2, 41.0, 'En dos, la toca y se devuelve.'],
  [41.2, 44.2, 'Es un cero doble: cuenta dos veces.'],
  [44.6, 47.4, 'Uno más dos: tres ceros, su grado.'],
  [47.6, 50.2, 'Repetido impar cruza; par, rebota.'],
  [50.6, 53.6, 'La de Caro cruza una vez: ¿cero triple?'],
  [53.8, 56.6, 'Toca buscar sus ceros con método.'],
  [60.0, 63.0, 'Con coeficientes enteros, un cero racional c sobre d'],
  [63.2, 66.0, 'tiene c divisor del último y d del primero.'],
  [66.4, 69.2, 'Aquí solo hay cuatro candidatos.'],
  [69.4, 72.2, 'Los signos de Q cambian tres veces:'],
  [72.6, 75.4, 'tres ceros positivos, o uno.'],
  [75.6, 78.4, 'Con menos x no cambian: ningún negativo.'],
  [78.8, 81.6, 'Se prueba: Q de uno es cero.'],
  [81.8, 84.4, 'Q de dos da dos: no sirve.'],
  [84.8, 87.6, 'Un solo cero real, el uno.'],
  [87.8, 90.4, 'Los otros dos se esconden en la división.'],
  [95.4, 98.4, 'Al dividir entre x menos uno queda una parábola.'],
  [98.6, 101.4, 'Su discriminante es negativo:'],
  [101.8, 104.6, 'sus ceros: uno más i, uno menos i.'],
  [104.8, 107.4, 'En el plano complejo: uno, espejo del otro.'],
  [107.8, 110.6, 'Con coeficientes reales, llegan en pareja.'],
  [110.8, 114.0, 'Uno, más dos complejos: tres ceros, como prometió.'],
  [115.4, 119.6, 'Los ceros perdidos de Caro son uno más i'],
  [119.8, 124.4, 'y uno menos i: no están en la recta real.'],
];
