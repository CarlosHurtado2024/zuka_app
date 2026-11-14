// «Polinomio cuadrático y parábola» (lección alg-4a de Zuka, Fuente de la Parábola, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): y = x² con sus puntos, y = (x − 4)² + 1,
// y = −(x − 4)² + 5, x² + 4x + 7 = (x + 2)² + 3 con bloques (vértice (−2, 3)) y el chorro de la fuente de Caro
// y = −x² + 4x + 1: h = 2, k = 5.
// Hilo (docs/storytelling-videos.md): Caro diseña una fuente; ¿qué tan alto subirá el chorro? La sorpresa anunciada: no hace
// falta dibujar la curva, el punto más alto se lee en la fórmula. Cierre: 5 m de alto, a 2 m de la boquilla.
// Niveles: 0 y = x² → 1 por (x − 4)²: mover la parábola → 2 por x² + 4x + 7: completar el cuadrado → 3 por −b ÷ 2a: la fuente.
const POSTER = 104.0;
const SP = s => ({ sup: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1420], r: 100, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1420], r: 130, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1440], r: 110, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 1000], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'mover', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'completar', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'la fuente', L: [330, 1560] },
  ],
  stops: ['y = x²', 'mover', 'completar', 'la fuente'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[22.0, 23.6], [104.8, 106.4], [119.0, 135]],
    wides: [[44.6, 46.0], [78.8, 80.2]],
    looks: [],
  },
};

// ---------- nivel 0 · y = x² ----------
const M0 = { ox: 540, oy: 1270, s: 72 };
function level0(G, t) {
  starField(G, 121, 150);
  axes(G, t, 1.0, M0, -3.6, 3.6, -0.5, 8.5, { nums: true, xl: 'x', yl: 'y' });
  [0, 1, -1, 2, -2].forEach((x, i) => {
    const k = pop(t, 9.8 + i * .5); if (k <= 0.01) return;
    mark(G, mx(M0, x), my(M0, x * x), '', k, C.cream);
    tag(G, mx(M0, x) + (x < 0 ? -26 : 26), my(M0, x * x) - 18, `(${minus(x)}, ${x * x})`, k, C.cream, 30, x < 0 ? 'end' : 'start');
  });
  curve(G, M0, x => x * x, -2.9, 2.9, eio(seg(t, 12.8, 14.8)), C.sun, 7);
  const ke = eio(seg(t, 19.0, 19.8));
  if (ke > 0.01) el('line', { x1: M0.ox, y1: my(M0, 0), x2: M0.ox, y2: r1(my(M0, 8.2 * ke)), stroke: C.mint, 'stroke-width': 4, 'stroke-dasharray': '12 10' }, G);
  tag(G, M0.ox, M0.oy + 90, 'vértice', pop(t, 16.0), C.sun, 34);
  tag(G, M0.ox + 20, my(M0, 7.6), 'eje de simetría', pop(t, 19.8), C.mint, 32, 'start');
  fchip(G, 540, 1420, ['(x − 4)', SP('2')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 46);
}
// ---------- nivel 1 · mover la parábola ----------
const M1 = { ox: 260, oy: 1240, s: 62 };
function level1(G, t) {
  starField(G, 123, 90);
  fchip(G, 540, 700, ['(x − 4)', SP('2')], out(t, 32.4), SKY, 46);
  axes(G, t, 32.0, M1, -2.5, 7.5, -0.5, 8, { nums: true });
  curve(G, M1, x => x * x, -2.4, 2.4, pop(t, 32.4) > .5 ? 1 : 0, C.n3, 6);
  const h = 4 * eio(seg(t, 35.0, 36.6)), k = 1 * eio(seg(t, 38.4, 39.2)) + 4 * eio(seg(t, 44.6, 46.0)), a = 1 - 2 * eio(seg(t, 44.6, 46.0));
  const f = x => a * (x - h) ** 2 + k;
  if (t > 34.6) curve(G, M1, f, h - 3, h + 3, 1, C.sun, 7, -0.6, 8);
  if (t > 34.6) mark(G, mx(M1, h), my(M1, k), '', 1, C.sun);
  const lab = t >= 36.6 && t < 38.6 ? '(4, 0)' : t >= 39.3 && t < 44.4 ? '(4, 1)' : t > 46.0 ? '(4, 5)' : null;
  if (lab) tag(G, mx(M1, h) + 26, my(M1, k) + (a > 0 ? 44 : -24), lab, 1, C.sun, 34, 'start');
  riseFormula(G, t, 36.8, 44.2, 540, 1330, 50, ['y', '=', '(x − 4)', SP('2'), '+ 1'], { colors: {} });
  riseFormula(G, t, 46.0, 999, 540, 1330, 50, ['y', '=', '−(x − 4)', SP('2'), '+ 5'], { colors: { '−(x − 4)': C.coral } });
  riseFormula(G, t, 50.6, 999, 540, 600, 52, ['y', '=', 'a(x − h)', SP('2'), '+ k'], { colors: {} });
  tag(G, 540, 668, 'a grande: más angosta; a < 0: boca abajo', pop(t, 51.6), C.mist, 30);
  fchip(G, 540, 1420 + 0, ['x', SP('2'), '+ 4x + 7'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 46);
}
// ---------- nivel 2 · completar el cuadrado ----------
const CX = 300, CY = 780, CS = 230, CU = 50;
function level2(G, t) {
  starField(G, 125, 90);
  fchip(G, 540, 700, ['x', SP('2'), '+ 4x + 7'], out(t, 61.0), ZERO, 46);
  blk(G, CX, CY, CS, CS, pop(t, 60.4), SKY, ['x', SP('2')], 56);
  for (let j = 0; j < 2; j++) blk(G, CX + CS + j * CU, CY, CU, CS, pop(t, 61.4 + j * .2), MINT, null);
  for (let j = 0; j < 2; j++) blk(G, CX, CY + CS + j * CU, CS, CU, pop(t, 62.2 + j * .2), MINT, null);
  for (let j = 0; j < 7; j++) {
    const inside = j < 4, m = inside ? eio(seg(t, 67.0 + j * .3, 67.6 + j * .3)) : 0;
    const x0 = 760 + (j % 2) * CU, y0 = 820 + Math.floor(j / 2) * CU;
    const x1 = CX + CS + (j % 2) * CU, y1 = CY + CS + Math.floor(j / 2) * CU;
    blk(G, lerp(x0, x1, m), lerp(y0, y1, m), CU, CU, pop(t, 63.0 + j * .1), ZERO, null);
  }
  tag(G, 810, 1050, 'sobran 3', pop(t, 70.6), C.sun, 34);
  tag(G, CX + (CS + 2 * CU) / 2, CY - 22, 'x + 2', pop(t, 70.0), C.cream, 40);
  tag(G, CX - 22, CY + (CS + 2 * CU) / 2 + 14, 'x + 2', pop(t, 70.0), C.cream, 40, 'end');
  riseFormula(G, t, 72.6, 999, 540, 1200, 56, ['x', SP('2'), '+ 4x + 7', '=', '(x + 2)', SP('2'), '+ 3'], { colors: {} });
  riseFormula(G, t, 78.8, 999, 540, 1300, 52, ['vértice', '(−2, 3)'], { colors: { '(−2, 3)': C.sun } });
  tag(G, 540, 1360, 'nunca baja de 3: es el mínimo', pop(t, 81.0), C.mist, 30);
  fchip(G, 540, 1440, ['−b ÷ (2a)'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 46);
}
// ---------- nivel 3 · la fuente ----------
const M3 = { ox: 230, oy: 1180, s: 92 };
const JET = x => -x * x + 4 * x + 1;
function level3(G, t) {
  starField(G, 127, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['−b ÷ (2a)'], out(t, 96.0), MINT, 46);
  // la fuente: pileta y boquilla
  const kf = pop(t, 95.6);
  if (kf > 0.01) {
    const F = scaleAt(S, 540, 1200, kf);
    shaded(F, 'rect', { x: 120, y: 1190, width: 760, height: 60, rx: 20 }, C.blue, C.blueD, 4, 4);
    el('rect', { x: M3.ox - 14, y: my(M3, 1), width: 28, height: r1(M3.oy - my(M3, 1) + 20), rx: 8, fill: C.cream }, F);
  }
  axes(S, t, 95.8, M3, 0, 5, 0, 5.8, { nums: true, ticks: true });
  curve(S, M3, JET, 0, 4.236, eio(seg(t, 106.4, 108.0)), C.blue, 9, 0, 9);
  for (let j = 0; j < 6; j++) { const x = 0.35 + j * .65, kk = pop(t, 108.0 + j * .1); if (kk > 0.01) el('circle', { cx: r1(mx(M3, x)), cy: r1(my(M3, JET(x)) + 18), r: r1(6 * kk), fill: C.blue }, S); }
  riseFormula(S, t, 98.8, 999, 540, 610, 50, ['y', '=', '−x', SP('2'), '+ 4x + 1'], { colors: {} });
  riseFormula(S, t, 101.8, 999, 470, 1330, 46, ['h', '=', '−4 ÷ (2 · (−1))', '=', '2'], { colors: { '2': C.sun } });
  riseFormula(S, t, 104.8, 999, 470, 1420, 46, ['k', '=', '−4 + 8 + 1', '=', '5'], { colors: { '5': C.sun } });
  const kv = pop(t, 105.6);
  if (kv > 0.01) {
    el('line', { x1: mx(M3, 2), y1: my(M3, 5), x2: mx(M3, 2), y2: r1(lerp(my(M3, 5), M3.oy, eio(seg(t, 105.6, 106.4)))), stroke: C.sun, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, S);
    mark(S, mx(M3, 2), my(M3, 5), '', kv, C.sun);
    tag(S, mx(M3, 2) + 26, my(M3, 5) - 14, 'máximo: 5 m', kv, C.sun, 38, 'start');
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'La parábola', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'polinomio cuadrático', { 'font-size': 76, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA FUENTE DE CARO', '¿qué tan alto sube el chorro?', 'empecemos por la curva más simple');
  label(p, t, 12.8, 18.6, 'y = x²', 'los puntos forman una parábola', 'da la vuelta en el vértice');
  label(p, t, 19.0, 24.4, 'SIMÉTRICA', '2 y −2 dan lo mismo: 4', 'el eje de simetría la parte en dos');
  label(p, t, 24.8, 29.0, 'UNA PROMESA', 'el punto más alto se lee', 'en la fórmula, sin dibujar');
  label(p, t, 31.8, 37.8, 'A LA DERECHA', '(x − 4)² corre la curva 4', 'el signo engaña: − es derecha');
  label(p, t, 38.2, 44.2, 'HACIA ARRIBA', 'el + 1 la sube 1', 'vértice (4, 1)');
  label(p, t, 44.6, 50.2, 'BOCA ABAJO', 'con un − delante se voltea', 'vértice (4, 5): un máximo');
  label(p, t, 50.6, 56.6, 'FORMA CANÓNICA', 'y = a(x − h)² + k', 'vértice (h, k)');
  label(p, t, 60.0, 66.0, '¿Y SI VIENE SIN ARMAR?', 'x² + 4x + 7', 'con bloques');
  label(p, t, 66.4, 72.2, 'COMPLETAR EL CUADRADO', 'la esquina pide 4 de los 7', 'sobran 3');
  label(p, t, 72.6, 78.4, 'FORMA CANÓNICA', 'x² + 4x + 7 = (x + 2)² + 3', 'ya se ve el vértice');
  label(p, t, 78.8, 84.4, 'EL VÉRTICE', '(−2, 3)', 'un mínimo: abre hacia arriba');
  label(p, t, 84.8, 90.4, 'UN ATAJO', 'h = −b ÷ (2a)', 'y k es el valor en h');
  label(p, t, 95.4, 101.4, 'EL CHORRO DE CARO', 'y = −x² + 4x + 1', 'a = −1: abre hacia abajo');
  label(p, t, 101.8, 107.4, 'EL ATAJO', 'h = 2 metros de la boquilla', 'k = 5 metros de alto');
  label(p, t, 107.8, 114.0, 'LA PROMESA', 'el punto más alto, sin dibujar', 'salió de la fórmula');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['PARÁBOLA', ['y = ax', SP('2'), '+ bx + c', ',', 'a ≠ 0']],
  ['FORMA CANÓNICA', ['y = a(x − h)', SP('2'), '+ k', ':', 'vértice (h, k)']],
  ['COMPLETAR', 'la mitad de b, al cuadrado'],
  ['ATAJO', ['h = −b ÷ (2a)', ';', 'a < 0: máximo']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'slide', d: .6 }];
  for (let i = 0; i < 5; i++) ev.push({ t: 7.0 + i * .6, type: 'count', i });
  ev.push({ t: 12.8, type: 'paint', d: 2.0 }, { t: 16.0, type: 'pop', i: 0 }, { t: 19.0, type: 'lasso', d: .8 }, { t: 24.8, type: 'pop', i: 1 });
  ev.push({ t: 32.0, type: 'slide', d: .6 }, { t: 35.0, type: 'slide', d: 1.6 }, { t: 36.8, type: 'rise' }, { t: 38.4, type: 'slide', d: .8 }, { t: 44.6, type: 'fly', d: 1.4 }, { t: 46.0, type: 'rise' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 2 });
  ev.push({ t: 60.4, type: 'hit' });
  for (let j = 0; j < 4; j++) ev.push({ t: 61.4 + j * .2 + (j > 1 ? .4 : 0), type: 'tile', i: j }, { t: 67.0 + j * .3, type: 'slide', d: .5 });
  ev.push({ t: 70.6, type: 'pop', i: 0 }, { t: 72.6, type: 'rise' }, { t: 73.2, type: 'yes' }, { t: 78.8, type: 'rise' }, { t: 81.0, type: 'card' }, { t: 87.8, type: 'pop', i: 3 });
  ev.push({ t: 95.6, type: 'hit' }, { t: 106.4, type: 'paint', d: 1.6 }, { t: 98.8, type: 'rise' }, { t: 101.8, type: 'rise' }, { t: 104.8, type: 'rise' }, { t: 105.6, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro está diseñando una fuente.'],
  [4.0, 6.4, '¿Qué tan alto subirá el chorro?'],
  [6.8, 9.6, 'La curva más sencilla: y igual a x cuadrado.'],
  [9.8, 12.4, 'Cero da cero; uno, uno; dos, cuatro.'],
  [12.8, 15.6, 'Los puntos dibujan una parábola.'],
  [15.8, 18.6, 'Da la vuelta en un solo punto: el vértice.'],
  [19.0, 21.8, 'Dos y menos dos dan lo mismo.'],
  [22.0, 24.4, 'La curva es simétrica.'],
  [24.8, 29.0, 'Y una promesa: el punto más alto se leerá en la fórmula.'],
  [31.8, 34.8, 'Para mover la parábola,'],
  [35.0, 37.8, 'x menos cuatro la corre cuatro a la derecha.'],
  [38.2, 41.0, 'Y el más uno la sube uno.'],
  [41.2, 44.2, 'El vértice queda en cuatro, uno.'],
  [44.6, 47.4, 'Con un menos adelante se voltea,'],
  [47.6, 50.2, 'y con más cinco sube: vértice más alto.'],
  [50.6, 53.6, 'En la forma canónica, el vértice es h, k.'],
  [53.8, 56.6, '¿Y si la fórmula viene sin armar?'],
  [60.0, 63.0, 'x cuadrado, más cuatro x, más siete.'],
  [63.2, 66.0, 'Las cuatro barras se reparten: dos y dos.'],
  [66.4, 69.2, 'Mitad de cuatro, dos; al cuadrado, cuatro.'],
  [69.4, 72.2, 'De los siete, sobran tres.'],
  [72.6, 75.4, 'Es x más dos, al cuadrado, más tres.'],
  [75.6, 78.4, 'Completamos el cuadrado.'],
  [78.8, 81.6, 'El vértice es menos dos, tres.'],
  [81.8, 84.4, 'Como abre hacia arriba, tres es el mínimo.'],
  [84.8, 87.6, 'Atajo: h es menos b entre dos a.'],
  [87.8, 90.4, 'Probémoslo en la fuente.'],
  [95.4, 98.4, 'El chorro de Caro sigue esta parábola.'],
  [98.6, 101.4, 'Con a negativo, abre hacia abajo.'],
  [101.8, 104.6, 'h: menos cuatro entre menos dos, dos metros.'],
  [104.8, 107.4, 'k: el valor en dos, cinco metros.'],
  [107.8, 110.6, 'La promesa se cumplió:'],
  [110.8, 114.0, 'el punto más alto salió de la fórmula.'],
  [115.4, 119.6, 'El chorro de Caro llega a cinco metros de altura,'],
  [119.8, 124.4, 'a dos metros de la boquilla. ¿Y dónde caerá?'],
];
