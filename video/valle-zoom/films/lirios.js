// «Función exponencial» (lección alg-71 de Zuka, Selva Exponencial, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): los lirios de Caro, y = 2^x (1, 2, 4 … 1024 el día
// 10); la gráfica con 1/4, 1/2, 1, 2, 4, 8; el espejo (1/2)^x; (1 + 1/n)^n → e; 2^x = 512 = 2^9 y 25^x = 125 → x = 3/2.
// Hilo (docs/storytelling-videos.md): en la laguna de la selva los lirios se duplican cada día y el día 10 la cubren.
// Caro pregunta qué día estaba medio llena; la intuición dice «el cinco». Sorpresa anunciada: la respuesta sorprende.
// Cierre: el día nueve, un día antes de llenarse.
// Niveles: 0 la laguna → 1 por y = 2^x: la gráfica y la asíntota → 2 por (1/2)^x: decrecer y el número e →
// 3 por 2^x = 512: igualar bases.
const POSTER = 8.6;
const SP = s => ({ sup: s }), SB = s => ({ sub: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 100, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [480, 1440], r: 130, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [480, 1440], r: 130, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 980], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'la gráfica', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'otras bases', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'igualar bases', L: [330, 1560] },
  ],
  stops: ['la laguna', 'la gráfica', 'otras bases', 'medio llena'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[101.8, 103.4], [107.8, 109.4], [119.0, 135]],
    wides: [[9.8, 11.2], [15.8, 17.2]],
    looks: [],
  },
};

// ---------- nivel 0 · la laguna ----------
const LX = 540, LY = 960;
function level0(G, t) {
  starField(G, 211, 150);
  const kf = eio(seg(t, 9.8, 10.8));
  lagoon(G, LX, LY, 420, 270, pop(t, 0.6), kf);
  const day = t < 4.0 ? 0 : Math.min(5, Math.floor(t - 4.0) + 1), n = 2 ** day;
  if (kf < 0.99) for (let i = 0; i < n; i++) {
    const c = i % 8, r = Math.floor(i / 8);
    pad(G, LX + (c - 3.5) * 80, LY + (r - 1.5) * 80, 32, pop(t, i ? 4.0 + Math.log2(i + 1) * .9 : 1.2) * (1 - kf), MINT);
  }
  for (let d = 0; d <= 5; d++) { const kd = life(t, d ? 4.0 + (d - 1) : 1.2, 9.8); if (kd > 0.01) chip(G, 250 + (d % 3) * 250, 1270 + Math.floor(d / 3) * 76, `día ${d}: ${2 ** d}`, kd, ZERO, C.night, 38); }
  const kl = pop(t, 10.0);
  if (kl > 0.01) chip(G, 540, 1310, 'día 10: 1024 lirios, llena', kl * out(t, 24.4), MINT, C.night, 44);
  const kq = life(t, 12.8, 24.4);
  if (kq > 0.01) chip(G, 540, 640, '¿qué día estaba medio llena?', kq, POS, C.night, 42);
  const k5 = life(t, 15.8, 24.4);
  if (k5 > 0.01) { chip(G, 450, 1420, '¿el día 5?', k5, NEG, C.night, 44); }
  fchip(G, 470, 1440, ['y = 2', SP('x')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · la gráfica y la asíntota ----------
const M1 = { ox: 600, oy: 1250, s: 110, sy: 38 };
function level1(G, t) {
  starField(G, 213, 90);
  fchip(G, 540, 700, ['y = 2', SP('x')], out(t, 32.4), ZERO, 50);
  axes(G, t, 32.0, M1, -4, 3.6, -0.6, 13, { ticks: true, nums: true, xl: 'x', yl: 'y' });
  curve(G, M1, x => 2 ** x, -4, 0, eio(seg(t, 38.2, 39.6)), C.sun, 7, -1, 13);
  curve(G, M1, x => 2 ** x, 0, 3.6, eio(seg(t, 35.0, 36.6)), C.sun, 7, -1, 13);
  [[0, '1', 32.6], [1, '2', 35.2], [2, '4', 35.8], [3, '8', 36.4], [-1, '1/2', 38.6], [-2, '1/4', 39.2]].forEach(([x, s, t0]) => {
    const k = pop(t, t0); if (k <= 0.01) return;
    el('circle', { cx: mx(M1, x), cy: my(M1, 2 ** x), r: r1(12 * k), fill: C.mint }, G);
    tag(G, mx(M1, x) - 16, my(M1, 2 ** x) - 24, s, k, C.mint, 32, 'end');
  });
  const ka = eio(seg(t, 44.6, 45.6));
  if (ka > 0.01) for (let j = 0; j < 14; j++) { const x0 = mx(M1, -4) + j * 30; if (j / 14 <= ka) el('rect', { x: x0, y: M1.oy - 16, width: 16, height: 5, rx: 2, fill: C.coral }, G); }
  tag(G, mx(M1, -3.8), M1.oy + 90, 'asíntota: y = 0', pop(t, 45.0), C.coral, 34, 'start');
  riseFormula(G, t, 47.6, 999, 540, 700, 44, ['dominio: todos los reales', ';', 'rango: y > 0'], { colors: {} });
  tag(G, mx(M1, 2.4), my(M1, 10), 'base > 1: sube', pop(t, 50.6), C.sun, 34, 'end');
  fchip(G, 480, 1440, ['y = (1/2)', SP('x')], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 46);
}
// ---------- nivel 2 · decrecer y el número e ----------
const M2 = { ox: 540, oy: 1180, s: 100, sy: 46 };
function level2(G, t) {
  starField(G, 215, 90);
  fchip(G, 540, 700, ['y = (1/2)', SP('x')], out(t, 61.0), MINT, 46);
  const kg = 1 - eio(seg(t, 69.0, 69.4));
  if (kg > 0.01) {
    const Q = scaleAt(G, 540, 1000, kg);
    axes(Q, t, 60.2, M2, -3.6, 3.6, -0.6, 9.5, { ticks: true, nums: true });
    curve(Q, M2, x => 2 ** x, -3.6, 3.2, 1, C.n3, 5, -1, 9.5);
    curve(Q, M2, x => 0.5 ** x, -3.2, 3.6, eio(seg(t, 60.4, 62.2)), C.mint, 7, -1, 9.5);
    formula(Q, mx(M2, -3.1), my(M2, 8.4), 34, ['y = (1/2)', SP('x')], { anchor: 'start', fill: C.mint });
    if (t > 61.6) formula(Q, mx(M2, 3.1), my(M2, 8.4), 34, ['y = 2', SP('x')], { anchor: 'end', fill: C.mist });
    const km = eio(seg(t, 63.2, 64.0));
    if (km > 0.01) el('rect', { x: M2.ox - 5, y: r1(my(M2, 9.5)), width: 10, height: r1(9.5 * M2.sy * km), rx: 5, fill: C.sun, opacity: .7 }, Q);
    tag(Q, M2.ox, my(M2, 9.5) - 16, 'espejo', pop(t, 63.6), C.sun, 34);
  }
  riseFormula(G, t, 72.6, 999, 540, 790, 64, ['(1 + 1/n)', SP('n')], { colors: {} });
  [['n = 1: 2', 74.4], ['n = 2: 2.25', 75.2], ['n = 10: 2.594', 76.0], ['n = 100: 2.705', 76.8], ['n = 1000: 2.717', 77.6]].forEach(([s, t0], i) => {
    const k = pop(t, t0); if (k > 0.01) chip(G, 540, 900 + i * 76, s, k, POS, C.night, 36);
  });
  const ke = pop(t, 78.8);
  if (ke > 0.01) chip(G, 540, 1300, 'e ≈ 2.71828', ke, ZERO, C.night, 50);
  riseFormula(G, t, 81.8, 999, 470, 1395, 44, ['P = P', SB('0'), '· e', SP('kt')], { colors: {} });
  fchip(G, 480, 1440, ['2', SP('x'), '= 512'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 48);
}
// ---------- nivel 3 · igualar bases ----------
function level3(G, t) {
  starField(G, 217, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['2', SP('x'), '= 512'], out(t, 96.0), ZERO, 48);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    tag(Q, 540, 790, 'medio llena: 1024 ÷ 2 = 512', pop(t, 95.6), C.mist, 36);
    riseFormula(Q, t, 98.6, 999, 540, 900, 64, ['2', SP('x'), '=', '2', SP('9')], { colors: {} });
    const kx = pop(t, 101.8);
    if (kx > 0.01) chip(Q, 540, 1010, 'misma base: x = 9', kx, ZERO, C.night, 46);
    riseFormula(Q, t, 104.8, 999, 540, 1160, 46, ['25', SP('x'), '= 125', ':', '5', SP('2x'), '= 5', SP('3'), ',', 'x = 3/2'], { colors: {} });
  }
  const kh = pop(t, 107.8), kf = pop(t, 110.8);
  if (kf < 0.5) { lagoon(S, 540, 960, 380, 240, kh, 0.5); if (kh > 0.01) chip(S, 540, 1290, 'día 9: medio llena', kh * (1 - eio(seg(t, 110.6, 110.8))), ZERO, C.night, 44); }
  else { lagoon(S, 540, 960, 380, 240, 1, eio(seg(t, 110.8, 111.6)) * .5 + .5); chip(S, 540, 1290, 'día 10: llena', kf, MINT, C.night, 44); }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'La función', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'exponencial', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA LAGUNA DE CARO', 'los lirios se duplican', 'cada día');
  label(p, t, 12.8, 18.6, 'LA PREGUNTA', '¿qué día estaba', 'medio llena?');
  label(p, t, 19.0, 24.4, 'CUIDADO', 'el tiempo no reparte', 'por partes iguales');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la respuesta', 'te va a sorprender');
  label(p, t, 31.8, 37.8, 'LA GRÁFICA', 'cada paso a la derecha', 'el doble');
  label(p, t, 38.2, 44.2, 'HACIA ATRÁS', 'la mitad: 1/2, 1/4…', 'nunca llega a 0');
  label(p, t, 44.6, 50.2, 'ASÍNTOTA', 'el eje x', 'x cualquiera, y > 0');
  label(p, t, 50.6, 56.6, 'BASE MAYOR QUE 1', 'la curva sube', '¿y si es menor?');
  label(p, t, 60.0, 66.0, 'BASE 1/2', 'cada paso, la mitad', 'el espejo de la anterior');
  label(p, t, 66.4, 72.2, 'DECRECE', 'tampoco toca el 0', 'base entre 0 y 1');
  label(p, t, 72.6, 78.4, 'EL NÚMERO e', '(1 + 1/n) elevado a n', 'con n cada vez mayor');
  label(p, t, 78.8, 84.4, 'e ≈ 2.71828', 'y = e elevado a x', 'crecimiento continuo');
  label(p, t, 84.8, 90.4, 'HALLAR EL EXPONENTE', 'igualando', 'las bases');
  label(p, t, 95.4, 101.4, 'MEDIO LLENA', '512 lirios', '512 es 2 elevado a 9');
  label(p, t, 101.8, 107.4, 'MISMA BASE', 'mismo exponente', 'x = 9');
  label(p, t, 107.8, 114.0, 'LA LAGUNA', 'día 9: la mitad', 'día 10: llena');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['EXPONENCIAL', ['y = a', SP('x'), ',', 'a > 0, a ≠ 1']],
  ['GRÁFICA', 'nunca toca el eje x'],
  ['CRECE O DECRECE', 'a > 1 sube; 0 < a < 1 baja'],
  ['EL NÚMERO e', '≈ 2.71828'],
  ['ECUACIONES', 'misma base, mismo exponente'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 0.6, type: 'pop', i: 0 }, { t: 1.2, type: 'pop', i: 1 }];
  for (let d = 1; d <= 5; d++) ev.push({ t: 4.0 + (d - 1) + .1, type: 'tile', i: d % 4 });
  ev.push({ t: 9.8, type: 'paint', d: 1.0 }, { t: 10.0, type: 'yes' }, { t: 12.8, type: 'card' }, { t: 15.8, type: 'pop', i: 2 }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'slide', d: .6 }, { t: 35.0, type: 'paint', d: 1.6 });
  for (let i = 0; i < 4; i++) ev.push({ t: 35.2 + i * .6 - (i ? 0 : 2.6), type: 'pop', i });
  ev.push({ t: 38.2, type: 'paint', d: 1.4 }, { t: 38.6, type: 'pop', i: 0 }, { t: 39.2, type: 'pop', i: 1 }, { t: 44.6, type: 'slide', d: 1.0 }, { t: 47.6, type: 'rise' }, { t: 50.6, type: 'card' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'paint', d: 1.8 }, { t: 63.2, type: 'slide', d: .8 }, { t: 69.0, type: 'away', d: .4 }, { t: 72.6, type: 'rise' });
  for (let i = 0; i < 5; i++) ev.push({ t: 74.4 + i * .8, type: 'tile', i: i % 4 });
  ev.push({ t: 78.8, type: 'yes' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'card' }, { t: 98.6, type: 'rise' }, { t: 101.8, type: 'yes' }, { t: 104.8, type: 'rise' }, { t: 107.4, type: 'away', d: .4 }, { t: 107.8, type: 'pop', i: 0 }, { t: 110.8, type: 'paint', d: .8 }, { t: 111.2, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k % 4 });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'En la laguna de la selva flota un lirio.'],
  [4.0, 6.6, 'Cada día, los lirios se duplican.'],
  [6.8, 9.6, 'Uno, dos, cuatro, ocho, dieciséis…'],
  [9.8, 12.4, 'El día diez cubren toda la laguna.'],
  [12.8, 15.6, 'Caro pregunta: ¿qué día estaba medio llena?'],
  [15.8, 18.6, 'La mitad de diez es cinco… ¿o no?'],
  [19.0, 21.8, 'Cuidado: aquí el tiempo no reparte por igual.'],
  [22.0, 24.4, 'Miremos cómo crece.'],
  [24.8, 29.0, 'Y prepárate: la respuesta te va a sorprender.'],
  [31.8, 34.8, 'La fórmula: y igual a dos a la x.'],
  [35.0, 37.8, 'Cada paso a la derecha, el doble.'],
  [38.2, 41.0, 'Hacia atrás, la mitad: un medio, un cuarto…'],
  [41.2, 44.2, 'Se acerca a cero, pero nunca llega.'],
  [44.6, 47.4, 'El eje x es una asíntota horizontal.'],
  [47.6, 50.2, 'x puede ser cualquier real; y, siempre positiva.'],
  [50.6, 53.6, 'Base mayor que uno: la curva sube.'],
  [53.8, 56.6, '¿Y si la base es menor que uno?'],
  [60.0, 63.0, 'Base un medio: cada paso, la mitad.'],
  [63.2, 66.0, 'Es el espejo de dos a la x.'],
  [66.4, 69.2, 'Decrece, pero tampoco llega a cero.'],
  [69.4, 72.2, 'Hay una base muy especial: e.'],
  [72.6, 75.4, 'Uno más uno sobre n, a la n:'],
  [75.6, 78.4, 'dos, dos punto veinticinco, dos punto cincuenta y nueve…'],
  [78.8, 81.6, 'Se acerca a dos punto setenta y dos.'],
  [81.8, 84.4, 'e a la x: el crecimiento continuo.'],
  [84.8, 87.6, '¿Y cómo se halla un exponente?'],
  [87.8, 90.4, 'Igualando las bases.'],
  [95.4, 98.4, 'Medio llena son quinientos doce lirios.'],
  [98.6, 101.4, 'Y quinientos doce es dos a la nueve.'],
  [101.8, 104.6, 'Misma base, mismo exponente: x es nueve.'],
  [104.8, 107.4, 'Igual: veinticinco a la x, ciento veinticinco.'],
  [107.8, 110.6, 'El día nueve, la laguna estaba a la mitad.'],
  [110.8, 114.0, 'Un solo día después, llena.'],
  [115.4, 119.6, 'La laguna de Caro estaba medio llena el día nueve,'],
  [119.8, 124.4, 'no el cinco: un día antes de cubrirse.'],
];
