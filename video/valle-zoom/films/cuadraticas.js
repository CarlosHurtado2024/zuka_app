// «Ecuaciones cuadráticas» (lección alg-4 de Zuka, Fuente de la Parábola, video 4) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): y = x² − x − 6 = (x − 3)(x + 2) con raíces 3 y −2,
// el producto cero, el chorro de Caro −x² + 4x + 1 = 0 con la fórmula general (x = 2 ± √5: cae a unos 4.24 m), y la familia
// x² − 4x + 3, x² − 4x + 4, x² − 4x + 5 con discriminante 4, 0 y −4 (la última tiene raíces 2 ± i).
// Hilo (docs/storytelling-videos.md): el chorro de Caro sube 5 m (video anterior); ¿dónde cae el agua? La sorpresa anunciada:
// la fórmula da dos respuestas y una no sirve. Cierre: el agua cae a 2 + √5 ≈ 4.24 m de la boquilla.
// Niveles: 0 las raíces → 1 por (x − 3)(x + 2): el producto cero → 2 por la fuente: la fórmula general → 3 por b² − 4ac.
const POSTER = 78.0;
const SP = s => ({ sup: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1470], r: 140, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1440], r: 170, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1440], r: 100, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 1000], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el producto cero', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'la fórmula', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'el discriminante', L: [330, 1560] },
  ],
  stops: ['las raíces', 'producto cero', 'la fórmula', 'discriminante'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[47.6, 49.2], [78.8, 80.4], [119.0, 135]],
    wides: [[72.6, 74.0], [104.8, 106.2]],
    looks: [],
  },
};

// ---------- nivel 0 · las raíces ----------
const M0 = { ox: 480, oy: 1060, s: 56 };
const F0 = x => x * x - x - 6;
function level0(G, t) {
  starField(G, 131, 150);
  axes(G, t, 5.4, M0, -3.6, 4.6, -6.6, 6.2, { nums: true, xl: 'x', yl: 'y' });
  curve(G, M0, F0, -3.4, 4.3, eio(seg(t, 6.4, 8.6)), C.sun, 7, -6.6, 6.2);
  for (const [x, i] of [[-2, 0], [3, 1]]) {
    const k = pop(t, 12.8 + i * .6); if (k <= 0.01) continue;
    el('circle', { cx: mx(M0, x), cy: M0.oy, r: r1(16 * k), fill: C.mint }, G);
    lasso(G, mx(M0, x), M0.oy, 34, 34, eio(seg(t, 13.0 + i * .6, 13.8 + i * .6)), C.mint, 5);
  }
  tag(G, mx(M0, -2) - 20, M0.oy - 34, 'x = −2', pop(t, 13.4), C.mint, 34, 'end');
  tag(G, mx(M0, 3) + 20, M0.oy - 34, 'x = 3', pop(t, 14.0), C.mint, 34, 'start');
  riseFormula(G, t, 19.0, 999, 540, 620, 58, ['x', SP('2'), '− x − 6', '=', '0'], { colors: {} });
  fchip(G, 540, 1470, ['(x − 3)(x + 2)'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), MINT, 44);
}
// ---------- nivel 1 · el producto cero ----------
function level1(G, t) {
  starField(G, 133, 90);
  fchip(G, 540, 700, ['(x − 3)(x + 2)'], out(t, 32.4), MINT, 44);
  riseFormula(G, t, 32.0, 999, 540, 830, 56, ['5 · 0', '=', '0', ',', '0 · 7', '=', '0'], { colors: {} });
  tag(G, 540, 910, 'si un producto da 0, algún factor es 0', pop(t, 35.4), C.sun, 36);
  riseFormula(G, t, 38.4, 999, 540, 1030, 60, ['(x − 3)(x + 2)', '=', '0'], { colors: {} });
  tag(G, 540, 1094, '−3 · 2 = −6 y −3 + 2 = −1', pop(t, 39.6), C.mist, 32);
  const ka = pop(t, 44.8), kb = pop(t, 46.0);
  if (ka > 0.01) { chip(G, 330, 1150, 'x − 3 = 0', ka, MINT, C.night, 44); chip(G, 330, 1250, 'x = 3', pop(t, 47.2), ZERO, C.night, 48); }
  if (kb > 0.01) { chip(G, 750, 1150, 'x + 2 = 0', kb, MINT, C.night, 44); chip(G, 750, 1250, 'x = −2', pop(t, 47.6), ZERO, C.night, 48); }
  tag(G, 540, 1162, 'o', ka, C.cream, 44);
  tag(G, 540, 1340, 'comprobación: 9 − 3 − 6 = 0', pop(t, 50.6), C.mint, 34);
  fchip(G, 540, 1440, ['−x', SP('2'), '+ 4x + 1 = 0'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 44);
}
// ---------- nivel 2 · la fórmula general ----------
const M2 = { ox: 300, oy: 1250, s: 76 };
const JET = x => -x * x + 4 * x + 1;
function level2(G, t) {
  starField(G, 135, 90);
  fchip(G, 540, 700, ['−x', SP('2'), '+ 4x + 1 = 0'], out(t, 61.0), SKY, 44);
  const kq = 1 - eio(seg(t, 72.2, 72.6));
  if (kq > 0.01) {
    const Q = scaleAt(G, 540, 900, kq);
    riseFormula(Q, t, 60.4, 999, 540, 840, 62, ['x', '=', { fr: ['−b ± √(b² − 4ac)', '2a'] }], { colors: {} });
    tag(Q, 540, 960, 'sale de completar el cuadrado', pop(t, 63.4), C.mist, 34);
    riseFormula(Q, t, 66.6, 999, 540, 1080, 50, ['a = −1', ',', 'b = 4', ',', 'c = 1'], { colors: {} });
    riseFormula(Q, t, 68.4, 999, 540, 1180, 50, ['b² − 4ac', '=', '16 + 4', '=', '20'], { colors: { '20': C.sun } });
    riseFormula(Q, t, 69.8, 999, 540, 1300, 52, ['x', '=', { fr: ['−4 ± 2√5', '−2'] }, '=', '2 ± √5'], { colors: {} });
  }
  axes(G, t, 72.6, M2, -1, 5, -1.2, 5.6, { nums: true });
  if (t > 72.4) {
    const kb = pop(t, 72.6), F = scaleAt(G, 540, 1260, kb);
    shaded(F, 'rect', { x: 140, y: 1262, width: 760, height: 40, rx: 16 }, C.blue, C.blueD, 4, 4);
    el('rect', { x: M2.ox - 12, y: my(M2, 1), width: 24, height: r1(M2.oy - my(M2, 1)), rx: 8, fill: C.cream }, F);
  }
  curve(G, M2, JET, 0, 4.236, eio(seg(t, 73.0, 74.8)), C.blue, 9, 0, 9);
  curve(G, M2, JET, -0.236, 0, eio(seg(t, 78.8, 79.6)), C.n3, 6, -1, 9);
  const k1 = pop(t, 75.0), k2 = pop(t, 79.6);
  if (k1 > 0.01) { el('circle', { cx: mx(M2, 4.236), cy: M2.oy, r: r1(16 * k1), fill: C.mint }, G); tag(G, mx(M2, 4.236), M2.oy - 40, '2 + √5 ≈ 4.24', k1, C.mint, 36); }
  if (k2 > 0.01) { el('circle', { cx: mx(M2, -0.236), cy: M2.oy, r: r1(14 * k2), fill: C.coral }, G); tag(G, mx(M2, -0.236) - 10, M2.oy + 80, '2 − √5 ≈ −0.24', k2, C.coral, 32, 'start'); }
  badge(G, mx(M2, -0.236) - 50, M2.oy - 50, pop(t, 80.4), false);
  fchip(G, 540, 1440, ['b² − 4ac'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 46);
}
// ---------- nivel 3 · el discriminante ----------
const M3 = { ox: 260, oy: 1140, s: 74 };
const FAM = [[3, 'Δ = 4: dos raíces', MINT], [4, 'Δ = 0: una raíz', ZERO], [5, 'Δ = −4: ninguna real', NEG]];
function level3(G, t) {
  starField(G, 137, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['b² − 4ac'], out(t, 96.0), ZERO, 46);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    axes(Q, t, 95.6, M3, -0.4, 4.6, -1.4, 3.2, { ticks: true });
    FAM.forEach(([c, s, col], i) => {
      const t0 = 96.6 + i * 1.6;
      curve(Q, M3, x => x * x - 4 * x + c, 0.1, 3.9, eio(seg(t, t0, t0 + .9)), col[0], 6, -1.4, 3.3);
      tag(Q, 660, 830 + i * 64, s, pop(t, t0 + .6), col[0], 36, 'start');
    });
    riseFormula(Q, t, 101.8, 999, 540, 1290, 44, ['x', SP('2'), '− 4x + 5 = 0', ':', 'x', '=', { fr: ['4 ± √−4', '2'] }, '=', '2 ± i'], { colors: { '2 ± i': C.coral } });
  }
  // vuelta a la fuente
  riseFormula(S, t, 108.0, 999, 540, 900, 60, ['−x', SP('2'), '+ 4x + 1 = 0'], { colors: {} });
  const kc = pop(t, 109.2);
  if (kc > 0.01) chip(S, 540, 1040, 'el agua cae a 2 + √5 ≈ 4.24 m', kc, MINT, C.night, 42);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Ecuaciones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'cuadráticas', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, '¿DÓNDE CAE EL AGUA?', 'el chorro de Caro sube 5 m', 'antes, una que se factoriza');
  label(p, t, 12.8, 18.6, 'LAS RAÍCES', 'donde la curva toca el eje', 'ahí y vale 0');
  label(p, t, 19.0, 24.4, 'UNA ECUACIÓN', 'buscar las raíces', 'es resolver = 0');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'a veces salen dos respuestas', 'y una no sirve');
  label(p, t, 31.8, 37.8, 'EL PRODUCTO CERO', 'si un producto da 0', 'algún factor es 0');
  label(p, t, 38.2, 44.2, 'FACTORIZADA', '(x − 3)(x + 2) = 0', 'una de las dos es 0');
  label(p, t, 44.6, 50.2, 'DOS RAÍCES', 'x = 3 o x = −2', 'las de la gráfica');
  label(p, t, 50.6, 56.6, '¿Y SI NO FACTORIZA?', 'el chorro de Caro', 'no se deja factorizar fácil');
  label(p, t, 60.0, 66.0, 'LA FÓRMULA GENERAL', 'sirve para toda cuadrática', 'sale de completar el cuadrado');
  label(p, t, 66.4, 72.2, 'CON LA FUENTE', 'a = −1, b = 4, c = 1', 'x = 2 ± √5');
  label(p, t, 72.6, 78.4, 'UNA RESPUESTA', '2 + √5 ≈ 4.24 m', 'ahí cae el agua');
  label(p, t, 78.8, 84.4, 'Y LA OTRA', '2 − √5 ≈ −0.24', 'detrás de la boquilla: no sirve');
  label(p, t, 84.8, 90.4, 'LO DE ADENTRO', 'Δ = b² − 4ac', 'el discriminante');
  label(p, t, 95.4, 101.4, 'EL DISCRIMINANTE', 'positivo: dos; cero: una', 'negativo: ninguna real');
  label(p, t, 101.8, 107.4, 'SIN TOCAR EL EJE', 'las raíces son complejas', '2 + i y 2 − i');
  label(p, t, 107.8, 114.0, 'LA FUENTE DE CARO', 'el agua cae a 4.24 m', 'el otro número no tenía sentido');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['RAÍCES', 'donde la parábola toca el eje x'],
  ['PRODUCTO CERO', ['(x − 3)(x + 2) = 0', ':', 'x = 3 o x = −2']],
  ['FÓRMULA', ['x', '=', { fr: ['−b ± √(b² − 4ac)', '2a'] }]],
  ['DISCRIMINANTE', 'positivo, cero o negativo'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'slide', d: .6 }, { t: 6.8, type: 'paint', d: 2.2 }];
  ev.push({ t: 12.8, type: 'pop', i: 0 }, { t: 13.4, type: 'pop', i: 1 }, { t: 19.0, type: 'rise' }, { t: 24.8, type: 'pop', i: 2 });
  ev.push({ t: 32.0, type: 'rise' }, { t: 35.4, type: 'card' }, { t: 38.4, type: 'rise' }, { t: 44.8, type: 'tile', i: 0 }, { t: 46.0, type: 'tile', i: 1 }, { t: 47.2, type: 'yes' }, { t: 50.6, type: 'pop', i: 0 }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 66.6, type: 'rise' }, { t: 68.4, type: 'rise' }, { t: 69.8, type: 'rise' }, { t: 72.2, type: 'away', d: .4 });
  ev.push({ t: 72.6, type: 'hit' }, { t: 73.0, type: 'paint', d: 1.8 }, { t: 75.0, type: 'yes' }, { t: 78.8, type: 'slide', d: .8 }, { t: 80.4, type: 'no' }, { t: 87.8, type: 'pop', i: 1 });
  for (let i = 0; i < 3; i++) ev.push({ t: 96.6 + i * 1.6, type: 'paint', d: .9 }, { t: 97.2 + i * 1.6, type: 'pop', i });
  ev.push({ t: 101.8, type: 'rise' }, { t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 109.2, type: 'hit' }, { t: 109.8, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'El chorro de Caro sube cinco metros.'],
  [4.0, 6.4, 'Pero ¿dónde cae el agua?'],
  [6.8, 9.6, 'Primero, una que se deja factorizar.'],
  [9.8, 12.4, 'Baja, da la vuelta y vuelve a subir.'],
  [12.8, 15.6, 'Toca el eje en menos dos y en tres.'],
  [15.8, 18.6, 'Ahí la altura y vale cero: son las raíces.'],
  [19.0, 21.8, 'Buscar las raíces es resolver una ecuación:'],
  [22.0, 24.4, 'el polinomio igual a cero.'],
  [24.8, 29.0, 'Un aviso: a veces salen dos respuestas y una no sirve.'],
  [31.8, 34.8, 'Cinco por cero es cero; cero por siete, también.'],
  [35.0, 37.8, 'Si un producto da cero, algún factor es cero.'],
  [38.2, 41.0, 'Dos números que multiplicados den menos seis'],
  [41.2, 44.2, 'y sumados menos uno: menos tres y dos.'],
  [44.6, 47.4, 'O x es tres,'],
  [47.6, 50.2, 'o x es menos dos.'],
  [50.6, 53.6, 'Tres al cuadrado, menos tres, menos seis: cero.'],
  [53.8, 56.6, '¿Y si no se deja factorizar?'],
  [60.0, 63.0, 'La fórmula general sirve para cualquiera.'],
  [63.2, 66.0, 'Sale de completar el cuadrado.'],
  [66.4, 69.2, 'En la fuente, a es menos uno.'],
  [69.4, 72.2, 'Da dos más o menos raíz de cinco.'],
  [72.6, 75.4, 'Dos más raíz de cinco: unos cuatro punto veinticuatro.'],
  [75.6, 78.4, 'Ahí cae el agua.'],
  [78.8, 81.6, 'La otra queda detrás de la boquilla.'],
  [81.8, 84.4, 'El chorro nunca pasa por ahí: no sirve.'],
  [84.8, 87.6, 'Y lo de adentro de la raíz'],
  [87.8, 90.4, 'cuenta cuántas raíces hay.'],
  [95.4, 98.4, 'Si es positivo, la parábola cruza dos veces.'],
  [98.6, 101.4, 'Si es cero, toca una vez; negativo, ninguna.'],
  [101.8, 104.6, 'Sin cruces, las raíces son complejas:'],
  [104.8, 107.4, 'dos más i y dos menos i.'],
  [107.8, 110.6, 'Volvamos al chorro de Caro.'],
  [110.8, 114.0, 'De las dos respuestas, una tenía sentido.'],
  [115.4, 119.6, 'El agua de la fuente de Caro'],
  [119.8, 124.4, 'cae a unos cuatro punto veinticuatro metros de la boquilla.'],
];
