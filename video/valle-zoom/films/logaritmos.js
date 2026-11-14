// «Logaritmos y sus propiedades» (lección alg-72 de Zuka, Selva Exponencial, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): Caro necesita mil lirios: 2^9 = 512 y 2^10 = 1024;
// log₂ 32 = 5, log₁₀ 1000 = 3, log 1 = 0; la gráfica de log₂ x como espejo de 2^x; log₂(4 · 16) = 2 + 4 = 6, cociente,
// potencia, log(x + y) no se parte; log y ln; cambio de base log₂ 1000 = log 1000 ÷ log 2 = 3 ÷ 0.301 ≈ 9.97.
// Hilo (docs/storytelling-videos.md): Caro recibe un pedido de mil lirios; la exponencial cuenta lirios a partir del día y
// ella pregunta al revés. Sorpresa anunciada: multiplicar se volverá sumar. Cierre: el pedido está listo el día 9.97.
// Niveles: 0 el pedido → 1 por log₂ 32: qué es un logaritmo → 2 por log₂(4 · 16): las propiedades → 3 por
// log 1000 ÷ log 2: cambio de base.
const POSTER = 66.0;
const SP = s => ({ sup: s }), SB = s => ({ sub: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 110, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [480, 1440], r: 150, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [480, 1440], r: 170, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 960], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el logaritmo', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'el truco', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'cambiar la base', L: [330, 1560] },
  ],
  stops: ['el pedido', 'el logaritmo', 'propiedades', 'cambio de base'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[63.2, 64.8], [101.8, 103.4], [119.0, 135]],
    wides: [[15.8, 17.2], [75.6, 77.0]],
    looks: [],
  },
};

// recta de los días 0 a 10
const MD = { ox: 140, oy: 1270, s: 80 };
function days(p, t, t0) {
  axes(p, t, t0, MD, 0, 10.4, 0, 0.01, { ticks: true });
  for (const d of [0, 5, 9, 10]) tag(p, mx(MD, d), MD.oy + 46, String(d), pop(t, t0 + .3), C.mist, 30);
  tag(p, mx(MD, 10.4), MD.oy - 20, 'días', pop(t, t0 + .3), C.mist, 28, 'end');
}

// ---------- nivel 0 · el pedido ----------
function level0(G, t) {
  starField(G, 231, 150);
  lagoon(G, 540, 760, 300, 150, pop(t, 0.6), eio(seg(t, 1.0, 4.0)) * .5);
  const kq = life(t, 4.0, 12.4);
  if (kq > 0.01) chip(G, 540, 960, 'pedido: 1000 lirios', kq, POS, C.night, 44);
  riseFormula(G, t, 6.8, 999, 540, 1060, 50, ['día x', ':', '2', SP('x'), 'lirios'], { colors: {} });
  riseFormula(G, t, 9.8, 999, 540, 1160, 54, ['2', SP('x'), '= 1000', ',', 'x = ?'], { colors: { 'x = ?': C.sun } });
  days(G, t, 12.4);
  const k9 = pop(t, 12.8), k10 = pop(t, 15.8);
  if (k9 > 0.01) { el('circle', { cx: mx(MD, 9), cy: MD.oy, r: r1(13 * k9), fill: C.coral }, G); tag(G, mx(MD, 9) - 10, MD.oy - 30, '512', k9, C.coral, 32, 'end'); }
  if (k10 > 0.01) { el('circle', { cx: mx(MD, 10), cy: MD.oy, r: r1(13 * k10), fill: C.coral }, G); tag(G, mx(MD, 10) + 4, MD.oy - 70, '1024', k10, C.coral, 32); }
  lasso(G, mx(MD, 9.5), MD.oy, 64, 36, eio(seg(t, 19.0, 19.8)), C.sun, 5);
  fchip(G, 470, 1440, ['log', SB('2'), '32'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · qué es un logaritmo ----------
const M1 = { ox: 330, oy: 1180, s: 64 };
function level1(G, t) {
  starField(G, 233, 90);
  fchip(G, 540, 700, ['log', SB('2'), '32'], out(t, 32.4), ZERO, 50);
  const kr = 1 - eio(seg(t, 44.2, 44.6));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1000, kr);
    riseFormula(Q, t, 32.0, 35.0, 540, 820, 66, ['log', SB('2'), '32', '=', '?'], { colors: { '?': C.sun } });
    riseFormula(Q, t, 35.2, 999, 540, 820, 66, ['log', SB('2'), '32', '=', '5'], { colors: { '5': C.sun } });
    riseFormula(Q, t, 35.6, 999, 540, 920, 52, ['porque', '2', SP('5'), '= 32'], { colors: {} });
    riseFormula(Q, t, 38.2, 999, 540, 1040, 60, ['log', SB('10'), '1000', '=', '3'], { colors: { '3': C.sun } });
    riseFormula(Q, t, 41.2, 999, 540, 1180, 50, ['log', SB('a'), 'x = y', ':', 'a', SP('y'), '= x'], { colors: {} });
    riseFormula(Q, t, 41.6, 999, 540, 1270, 46, ['log', SB('2'), 'x = 6', { s: 'arrow' }, 'x = 2', SP('6'), '= 64'], { colors: {} });
  }
  axes(G, t, 44.6, M1, -2.2, 9, -3.2, 7, { ticks: true, xl: 'x', yl: 'y' });
  curve(G, M1, x => x, -2.2, 7, eio(seg(t, 44.8, 45.4)), C.n3, 4);
  curve(G, M1, x => 2 ** x, -2.2, 2.8, eio(seg(t, 45.0, 46.0)), C.blue, 5, -3.2, 7);
  curve(G, M1, x => Math.log2(x), 0.11, 9, eio(seg(t, 45.6, 46.8)), C.sun, 7, -3.2, 7);
  if (t > 46.0) formula(G, mx(M1, 1.6), my(M1, 6.2), 32, ['y = 2', SP('x')], { anchor: 'end', fill: C.blue });
  if (t > 46.8) formula(G, mx(M1, 8.8), my(M1, 3.6), 32, ['y = log', SB('2'), 'x'], { anchor: 'end', fill: C.sun });
  tag(G, mx(M1, 0.3), my(M1, -2.6), 'solo x > 0', pop(t, 47.6), C.coral, 32, 'start');
  const k1 = pop(t, 50.6);
  if (k1 > 0.01) { el('circle', { cx: mx(M1, 1), cy: M1.oy, r: r1(13 * k1), fill: C.mint }, G); tag(G, mx(M1, 1) + 18, M1.oy + 44, 'log 1 = 0', k1, C.mint, 32, 'start'); }
  fchip(G, 480, 1440, ['log', SB('2'), '(4 · 16)'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 46);
}
// ---------- nivel 2 · las propiedades ----------
function level2(G, t) {
  starField(G, 235, 90);
  fchip(G, 540, 700, ['log', SB('2'), '(4 · 16)'], out(t, 61.0), MINT, 46);
  const kr = 1 - eio(seg(t, 78.4, 78.8));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1000, kr);
    riseFormula(Q, t, 60.4, 999, 540, 810, 52, ['4 · 16', '=', '2', SP('2'), '· 2', SP('4'), '=', '2', SP('6')], { colors: {} });
    riseFormula(Q, t, 63.2, 999, 540, 910, 54, ['log', SB('2'), '(4 · 16)', '=', '2 + 4', '=', '6'], { colors: { '2 + 4': C.sun } });
    riseFormula(Q, t, 66.4, 999, 540, 1020, 46, ['log(xy)', '=', 'log x + log y'], { colors: {} });
    riseFormula(Q, t, 69.4, 999, 540, 1100, 46, ['log(x ÷ y)', '=', 'log x − log y'], { colors: {} });
    riseFormula(Q, t, 72.6, 999, 540, 1180, 46, ['log(x', SP('k'), ')', '=', 'k · log x'], { colors: {} });
    riseFormula(Q, t, 75.6, 999, 540, 1280, 44, ['log(x + y)', '≠', 'log x + log y'], { colors: { '≠': C.coral } });
    badge(Q, 900, 1262, pop(t, 76.0), false);
  }
  riseFormula(G, t, 78.8, 999, 540, 830, 52, ['log x', '=', 'log', SB('10'), 'x'], { colors: {} });
  riseFormula(G, t, 81.8, 999, 540, 940, 52, ['ln x', '=', 'log', SB('e'), 'x'], { colors: {} });
  riseFormula(G, t, 84.8, 999, 540, 1110, 58, ['log', SB('a'), 'x', '=', { fr: ['log x', 'log a'] }], { colors: {} });
  tag(G, 540, 1230, 'cambio de base', pop(t, 85.4), C.sun, 36);
  fchip(G, 480, 1440, ['log 1000 ÷ log 2'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 44);
}
// ---------- nivel 3 · cambio de base ----------
function level3(G, t) {
  starField(G, 237, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['log 1000 ÷ log 2'], out(t, 96.0), SKY, 44);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    riseFormula(Q, t, 95.6, 999, 540, 830, 58, ['log', SB('2'), '1000', '=', { fr: ['log 1000', 'log 2'] }], { colors: {} });
    riseFormula(Q, t, 98.6, 999, 540, 990, 58, ['=', { fr: ['3', '0.301'] }], { colors: {} });
    const kx = pop(t, 101.8);
    if (kx > 0.01) chip(Q, 540, 1110, '≈ 9.97', kx, ZERO, C.night, 56);
    riseFormula(Q, t, 104.8, 999, 540, 1240, 52, ['2', SP('9.97'), '≈ 1000'], { colors: {} });
  }
  lagoon(S, 540, 820, 300, 150, pop(t, 107.8), eio(seg(t, 108.0, 110.6)) * .98);
  days(S, t, 107.8);
  const km = pop(t, 110.8);
  if (km > 0.01) { el('circle', { cx: mx(MD, 9.97), cy: MD.oy, r: r1(15 * km), fill: C.sun }, S); tag(S, mx(MD, 9.97) - 12, MD.oy - 34, '9.97', km, C.sun, 36, 'end'); }
  const kc = pop(t, 111.4);
  if (kc > 0.01) chip(S, 540, 1080, 'mil lirios: día 9.97', kc, MINT, C.night, 46);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Logaritmos', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y propiedades', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL PEDIDO DE CARO', 'mil lirios', '¿qué día los habrá?');
  label(p, t, 12.8, 18.6, 'ENTRE DOS DÍAS', 'día 9: 512', 'día 10: 1024');
  label(p, t, 19.0, 24.4, 'AL REVÉS', 'se conoce el resultado', 'falta el exponente');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'si crecen sin parar', '¿será el día 9.5?');
  label(p, t, 31.8, 37.8, 'EL LOGARITMO', '¿2 a qué da 32?', 'a la 5: el logaritmo es 5');
  label(p, t, 38.2, 44.2, 'UN EXPONENTE', 'base 10: log 1000 = 3', 'porque 10 · 10 · 10 = 1000');
  label(p, t, 44.6, 50.2, 'SU GRÁFICA', 'espejo de la exponencial', 'solo x positivos');
  label(p, t, 50.6, 56.6, 'EL CERO', 'log 1 = 0', 'en cualquier base');
  label(p, t, 60.0, 66.0, 'EL TRUCO', 'multiplicar potencias', 'es sumar exponentes');
  label(p, t, 66.4, 72.2, 'PRODUCTO Y COCIENTE', 'producto: suma', 'cociente: resta');
  label(p, t, 72.6, 78.4, 'POTENCIA', 'el exponente sale adelante', 'la suma no se parte');
  label(p, t, 78.8, 84.4, 'DOS BASES FAMOSAS', 'log: base 10', 'ln: base e');
  label(p, t, 84.8, 90.4, 'CAMBIO DE BASE', 'dividir entre', 'el logaritmo de la base');
  label(p, t, 95.4, 101.4, 'MIL LIRIOS', 'log 1000 ÷ log 2', '3 ÷ 0.301');
  label(p, t, 101.8, 107.4, 'CASI 10', 'x ≈ 9.97', 'comprobación: casi 1000');
  label(p, t, 107.8, 114.0, 'EL PEDIDO', 'listo el día 9.97', 'el día 9.5 solo hay 724');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['LOGARITMO', ['log', SB('a'), 'x = y', ':', 'a', SP('y'), '= x']],
  ['PRODUCTO', 'se vuelve suma'],
  ['POTENCIA', 'el exponente sale adelante'],
  ['CAMBIO DE BASE', ['log', SB('a'), 'x', '=', 'log x ÷ log a']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 0.6, type: 'pop', i: 0 }, { t: 1.0, type: 'paint', d: 3.0 }, { t: 4.0, type: 'card' }, { t: 6.8, type: 'rise' }, { t: 9.8, type: 'rise' }];
  ev.push({ t: 12.4, type: 'slide', d: .6 }, { t: 12.8, type: 'no' }, { t: 15.8, type: 'no' }, { t: 19.0, type: 'lasso', d: .8 }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'rise' }, { t: 35.2, type: 'rise' }, { t: 35.6, type: 'rise' }, { t: 38.2, type: 'rise' }, { t: 41.2, type: 'rise' }, { t: 44.2, type: 'away', d: .4 });
  ev.push({ t: 44.6, type: 'slide', d: .6 }, { t: 45.0, type: 'paint', d: 1.8 }, { t: 47.6, type: 'card' }, { t: 50.6, type: 'pop', i: 1 }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'rise' }, { t: 66.4, type: 'rise' }, { t: 69.4, type: 'rise' }, { t: 72.6, type: 'rise' }, { t: 75.6, type: 'rise' }, { t: 76.0, type: 'no' });
  ev.push({ t: 78.4, type: 'away', d: .4 }, { t: 78.8, type: 'rise' }, { t: 81.8, type: 'rise' }, { t: 84.8, type: 'rise' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 98.6, type: 'rise' }, { t: 101.8, type: 'hit' }, { t: 104.8, type: 'rise' }, { t: 107.4, type: 'away', d: .4 }, { t: 107.8, type: 'paint', d: 2.6 }, { t: 110.8, type: 'pop', i: 0 }, { t: 111.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro recibe un pedido: mil lirios.'],
  [4.0, 6.6, '¿Qué día tendrá la laguna mil lirios?'],
  [6.8, 9.6, 'Dos a la x cuenta los lirios del día.'],
  [9.8, 12.4, 'Ahora la pregunta va al revés.'],
  [12.8, 15.6, 'Dos a la nueve, quinientos doce: poco.'],
  [15.8, 18.6, 'Dos a la diez, mil veinticuatro: se pasa.'],
  [19.0, 21.8, 'El día está entre nueve y diez.'],
  [22.0, 24.4, '¿A mitad de camino?'],
  [24.8, 29.0, 'Si crecen sin parar, la respuesta te sorprenderá.'],
  [31.8, 34.8, 'Logaritmo en base dos de treinta y dos:'],
  [35.0, 37.8, '¿dos a qué da treinta y dos? A cinco.'],
  [38.2, 41.0, 'Logaritmo base diez de mil: tres.'],
  [41.2, 44.2, 'El logaritmo es un exponente.'],
  [44.6, 47.4, 'Su gráfica es el espejo de la exponencial.'],
  [47.6, 50.2, 'Solo acepta números positivos.'],
  [50.6, 53.6, 'Y el logaritmo de uno es cero.'],
  [53.8, 56.6, 'Ahora, unas reglas muy útiles.'],
  [60.0, 63.0, 'Cuatro por dieciséis es sesenta y cuatro.'],
  [63.2, 66.0, 'En exponentes: dos más cuatro, seis.'],
  [66.4, 69.2, 'El logaritmo de un producto es una suma.'],
  [69.4, 72.2, 'El de un cociente, una resta.'],
  [72.6, 75.4, 'Y una potencia sale adelante, multiplicando.'],
  [75.6, 78.4, 'Ojo: el logaritmo de una suma no se parte.'],
  [78.8, 81.6, 'Las calculadoras traen base diez y base e.'],
  [81.8, 84.4, 'Logaritmo natural: el de base e.'],
  [84.8, 87.6, 'Para otra base, se cambia:'],
  [87.8, 90.4, 'se divide entre el logaritmo de la base.'],
  [95.4, 98.4, 'Logaritmo de mil, en base diez, es tres.'],
  [98.6, 101.4, 'El de dos es cero punto tres cero uno.'],
  [101.8, 104.6, 'Tres entre eso: nueve punto nueve siete.'],
  [104.8, 107.4, 'Comprobación: dos a esa potencia…'],
  [107.8, 110.6, 'da casi exactamente mil.'],
  [110.8, 114.0, 'No a la mitad: casi al final del día.'],
  [115.4, 119.6, 'El pedido de Caro estará listo el día nueve punto nueve siete:'],
  [119.8, 124.4, 'el logaritmo le dio el exponente.'],
];
