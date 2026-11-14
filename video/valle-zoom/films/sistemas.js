// «Sistemas de ecuaciones lineales» (lección alg-101 de Zuka, Río de las Asíntotas, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): el bote de Caro, v + c = 15 y v − c = 9
// (v = 12, c = 3) con sus soluciones sueltas 10 y 5, 12 y 3, 14 y 1; reducción, sustitución e igualación; paralelas
// (v + c = 15, v + c = 10: 0 = 5) y la misma recta (2v + 2c = 30); y la escalera x + y + z = 9, x + 2y + 2z = 14,
// x + y + 2z = 11 → y + z = 5, z = 2 → x = 4, y = 3, z = 2.
// Hilo (docs/storytelling-videos.md): con la corriente el bote de Caro va a 15 km/h y contra ella a 9. ¿Cuánto pone el
// bote y cuánto el río? Sorpresa anunciada: una sola pista no alcanza. Cierre: Caro rema a 12 km/h y el río la empuja a 3.
// Niveles: 0 el bote → 1 por v + c = 15: cada ecuación es una recta → 2 por (v + c) + (v − c): los tres métodos y los
// casos → 3 por x + y + z = 9: tres incógnitas en escalera.
const POSTER = 46.0;
const SP = s => ({ sup: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 130, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [480, 1440], r: 170, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [480, 1440], r: 150, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 940], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'una pista', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'tres métodos', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'la escalera', L: [330, 1560] },
  ],
  stops: ['el bote', 'dos rectas', 'tres métodos', 'la escalera'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[47.6, 49.2], [104.8, 106.4], [119.0, 135]],
    wides: [[24.8, 26.2], [78.8, 80.2]],
    looks: [],
  },
};

// río horizontal entre y0 e y1 con ondas que corren a la derecha
function hRiver(p, t, y0, y1, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, 540, (y0 + y1) / 2, k);
  el('rect', { x: 40, y: y0, width: 1000, height: y1 - y0, rx: 30, fill: C.blueD, opacity: .6 }, S);
  for (let j = 0; j < 3; j++) {
    const yy = y0 + (y1 - y0) * (j + 1) / 4; let d = '';
    for (let i = 0; i <= 60; i++) { const x = 60 + i * 16; d += (i ? 'L' : 'M') + x + ',' + r1(yy + 8 * Math.sin(x / 40 - t * 3 + j)); }
    el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: .8 }, S);
  }
}
// el bote de Caro: centro de la línea de flotación (x, y); dir = 1 mira a la derecha
function boat(p, x, y, s, k, dir = 1) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), d = dir;
  shaded(S, 'path', { d: `M${x - s},${y - s * .3}L${x + s},${y - s * .3}L${x + s * .7},${y + s * .25}L${x - s * .7},${y + s * .25}Z` }, C.coral, C.coralD, 4, 4);
  el('rect', { x: x - 4, y: y - s * 1.5, width: 8, height: s * 1.2, rx: 3, fill: C.cream }, S);
  el('path', { d: `M${x + 6 * d},${y - s * 1.45}L${x + 6 * d + s * .8 * d},${y - s * .45}L${x + 6 * d},${y - s * .45}Z`, fill: C.sun }, S);
  buddy(S, x - s * .45 * d, y - s * .55, s * .5, 1, C.mint, C.mintD);
}

// ---------- nivel 0 · el bote ----------
function level0(G, t) {
  starField(G, 191, 150);
  hRiver(G, t, 820, 1060, pop(t, 0.8));
  for (let j = 0; j < 4; j++) { const x = 150 + ((t * 70 + j * 250) % 1000); arrowLine(G, [[x - 40, 1000], [x + 30, 1000]], pop(t, 1.2), C.blue, 5); }
  // con la corriente (rápido, a la derecha) y luego contra ella (lento, a la izquierda)
  const bx = t < 6.8 ? lerp(240, 820, eio(seg(t, 4.0, 6.6))) : lerp(820, 460, eio(seg(t, 6.8, 9.8)));
  boat(G, bx, 930, 70, pop(t, 1.6), t < 6.8 ? 1 : -1);
  tag(G, bx, 790, t < 6.8 ? '15 km/h' : '9 km/h', t < 6.8 ? life(t, 4.2, 6.6) : life(t, 7.0, 12.4), t < 6.8 ? C.mint : C.coral, 44);
  const kv = pop(t, 12.8), kc = pop(t, 13.4);
  if (kv > 0.01) chip(G, 330, 1160, 'v: lo que pone el bote', kv, MINT, C.night, 34);
  if (kc > 0.01) chip(G, 760, 1160, 'c: el río', kc, SKY, C.night, 34);
  riseFormula(G, t, 15.8, 999, 470, 1270, 56, ['v + c', '=', '15'], { colors: { 'v + c': C.mint } });
  riseFormula(G, t, 19.0, 999, 470, 1350, 56, ['v − c', '=', '9'], { colors: { 'v − c': C.coral } });
  fchip(G, 470, 1440, ['v + c = 15'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), MINT, 44);
}
// ---------- nivel 1 · cada ecuación es una recta ----------
const M1 = { ox: 220, oy: 1250, s: 36 };
function level1(G, t) {
  starField(G, 193, 90);
  fchip(G, 540, 700, ['v + c = 15'], out(t, 32.4), MINT, 44);
  axes(G, t, 32.0, M1, 0, 17, 0, 15.5, { ticks: false, xl: 'v', yl: 'c' });
  [[10, 5, 35.0], [12, 3, 35.6], [14, 1, 36.2]].forEach(([v, c, t0]) => {
    const k = pop(t, t0); if (k <= 0.01) return;
    el('circle', { cx: mx(M1, v), cy: my(M1, c), r: r1(13 * k), fill: C.mint }, G);
    tag(G, mx(M1, v) + 14, my(M1, c) - 22, `(${v}, ${c})`, k * out(t, 44.4), C.mint, 30, 'start');
  });
  curve(G, M1, v => 15 - v, 0, 15, eio(seg(t, 38.2, 39.4)), C.mint, 6);
  curve(G, M1, v => v - 9, 9, 17, eio(seg(t, 41.2, 42.2)), C.coral, 6);
  tag(G, mx(M1, 2.6), my(M1, 13.6), 'v + c = 15', pop(t, 39.0), C.mint, 34, 'start');
  tag(G, mx(M1, 16.8), my(M1, 8.8), 'v − c = 9', pop(t, 42.0), C.coral, 34, 'end');
  const ki = pop(t, 44.6);
  if (ki > 0.01) { el('circle', { cx: mx(M1, 12), cy: my(M1, 3), r: r1(17 * ki), fill: C.sun }, G); lasso(G, mx(M1, 12), my(M1, 3), 38, 38, eio(seg(t, 44.8, 45.6)), C.sun, 6); }
  const kr = pop(t, 47.6);
  if (kr > 0.01) chip(G, 560, 1340, 'v = 12 y c = 3', kr, ZERO, C.night, 44);
  fchip(G, 480, 1440, ['(v + c) + (v − c)'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 42);
}
// ---------- nivel 2 · tres métodos y los casos ----------
const MA = { ox: 130, oy: 1180, s: 21 }, MB = { ox: 590, oy: 1180, s: 21 };
function level2(G, t) {
  starField(G, 195, 90);
  fchip(G, 540, 700, ['(v + c) + (v − c)'], out(t, 61.0), ZERO, 42);
  const kr = 1 - eio(seg(t, 78.2, 78.6));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1000, kr), F = { colors: {}, anchor: 'start' };
    riseFormula(Q, t, 60.4, 999, 330, 810, 48, ['v + c = 15'], F);
    riseFormula(Q, t, 60.8, 999, 330, 880, 48, ['v − c = 9'], F);
    tag(Q, 300, 880, '+', pop(t, 61.2), C.sun, 48, 'end');
    const kl = eio(seg(t, 61.6, 62.0)); if (kl > 0.01) el('rect', { x: 290, y: 902, width: r1(330 * kl), height: 6, rx: 3, fill: C.mist }, Q);
    riseFormula(Q, t, 63.2, 999, 330, 960, 48, ['2v = 24', { s: 'arrow' }, 'v = 12'], { ...F, colors: { 'v = 12': C.sun } });
    tag(Q, 130, 810, 'reducción', pop(t, 60.4), C.mist, 30, 'start');
    tag(Q, 540, 1015, 'si no se anulan, antes se multiplica una por un número', pop(t, 64.4), C.mist, 28);
    tag(Q, 130, 1080, 'sustitución', pop(t, 66.4), C.mist, 30, 'start');
    riseFormula(Q, t, 66.4, 999, 330, 1080, 46, ['v = 15 − c'], F);
    riseFormula(Q, t, 69.4, 999, 330, 1150, 46, ['(15 − c) − c = 9', { s: 'arrow' }, 'c = 3'], { ...F, colors: { 'c = 3': C.sun } });
    tag(Q, 130, 1260, 'igualación', pop(t, 72.6), C.mist, 30, 'start');
    riseFormula(Q, t, 72.6, 999, 330, 1260, 46, ['15 − c = 9 + c', { s: 'arrow' }, 'c = 3'], { ...F, colors: { 'c = 3': C.sun } });
  }
  // paralelas y la misma recta
  axes(G, t, 78.8, MA, 0, 17, 0, 16, { ticks: false, xl: 'v', yl: 'c' });
  curve(G, MA, v => 15 - v, 0, 15, eio(seg(t, 79.0, 79.8)), C.mint, 6);
  curve(G, MA, v => 10 - v, 0, 10, eio(seg(t, 79.4, 80.2)), C.coral, 6);
  tag(G, mx(MA, 8.5), MA.oy + 60, 'misma inclinación: ninguna', pop(t, 80.0), C.coral, 32);
  tag(G, mx(MA, 0.4), my(MA, 10) - 14, 'v + c = 10', pop(t, 79.8), C.coral, 28, 'start');
  tag(G, mx(MA, 9), my(MA, 14) - 14, 'v + c = 15', pop(t, 79.4), C.mint, 28, 'start');
  tag(G, mx(MA, 8.5), MA.oy + 104, 'restando: 0 = 5', pop(t, 80.6), C.mist, 30);
  axes(G, t, 81.8, MB, 0, 17, 0, 16, { ticks: false, xl: 'v', yl: 'c' });
  curve(G, MB, v => 15 - v, 0, 15, eio(seg(t, 82.0, 82.8)), C.mint, 14);
  curve(G, MB, v => 15 - v, 0, 15, eio(seg(t, 82.4, 83.2)), C.sun, 5);
  tag(G, mx(MB, 8.5), MB.oy + 60, 'la misma: infinitas', pop(t, 82.8), C.sun, 32);
  tag(G, mx(MB, 8.5), MB.oy + 104, '2v + 2c = 30', pop(t, 83.2), C.mist, 30);
  fchip(G, 480, 1440, ['x + y + z = 9'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 44);
}
// ---------- nivel 3 · tres incógnitas en escalera ----------
function level3(G, t) {
  starField(G, 197, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['x + y + z = 9'], out(t, 96.0), SKY, 44);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    ['x + y + z = 9', 'x + 2y + 2z = 14', 'x + y + 2z = 11'].forEach((s, i) => riseFormula(Q, t, 95.6 + i * .3, 999, 540, 800 + i * 66, 44, [s], { colors: {} }));
    tag(Q, 540, 1000, 'se resta la primera a las otras dos', pop(t, 97.6), C.mist, 32);
    [['x + y + z = 9', 260], ['y + z = 5', 360], ['z = 2', 460]].forEach(([s, x], i) => riseFormula(Q, t, 98.6 + i * .3, 999, x, 1090 + i * 80, 50, [s], { colors: {}, anchor: 'start' }));
    const ks = eio(seg(t, 99.4, 100.2));
    if (ks > 0.01) el('path', { d: 'M230,1110L230,1190L330,1190L330,1270L430,1270L430,1300', fill: 'none', stroke: C.sun, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': `${ks.toFixed(3)} 2` }, Q);
    [['z = 2', 1250, 99.6], ['y = 3', 1170, 101.8], ['x = 4', 1090, 104.8]].forEach(([s, y, t0]) => { const k = pop(t, t0); if (k > 0.01) chip(Q, 860, y - 16, s, k, ZERO, C.night, 40); });
  }
  // vuelta al bote
  hRiver(S, t, 900, 1100, pop(t, 107.8));
  boat(S, lerp(300, 760, eio(seg(t, 108.4, 112.4))), 1000, 64, pop(t, 108.2), 1);
  const ka = pop(t, 110.8), kb = pop(t, 111.4);
  if (ka > 0.01) chip(S, 330, 1220, 'bote: 12 km/h', ka, MINT, C.night, 40);
  if (kb > 0.01) chip(S, 760, 1220, 'río: 3 km/h', kb, SKY, C.night, 40);
  tag(S, 540, 820, '12 + 3 = 15 · 12 − 3 = 9', pop(t, 111.8), C.sun, 36);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Sistemas de', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'ecuaciones', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL BOTE DE CARO', 'a favor: 15 km/h', 'en contra: 9 km/h');
  label(p, t, 12.8, 18.6, 'DOS INCÓGNITAS', 'v: el bote · c: el río', 'a favor se suman');
  label(p, t, 19.0, 24.4, 'UN SISTEMA', 'v + c = 15', 'v − c = 9');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'una sola pista', 'no alcanza');
  label(p, t, 31.8, 37.8, 'UNA ECUACIÓN', 'v + c = 15', 'muchas parejas sirven');
  label(p, t, 38.2, 44.2, 'UNA RECTA', 'cada ecuación', 'es una recta');
  label(p, t, 44.6, 50.2, 'LA SOLUCIÓN', 'donde se cortan', 'v = 12 y c = 3');
  label(p, t, 50.6, 56.6, 'SIN DIBUJAR', 'tres métodos', 'para hallar el corte');
  label(p, t, 60.0, 66.0, 'REDUCCIÓN', 'se suman las ecuaciones', 'y c desaparece');
  label(p, t, 66.4, 72.2, 'SUSTITUCIÓN', 'se despeja v', 'y se reemplaza en la otra');
  label(p, t, 72.6, 78.4, 'IGUALACIÓN', 'v en las dos', 'y se igualan');
  label(p, t, 78.8, 84.4, 'TRES CASOS', 'se cortan: una solución', 'paralelas: ninguna · iguales: infinitas');
  label(p, t, 84.8, 90.4, 'TRES INCÓGNITAS', 'tres ecuaciones', 'en escalera');
  label(p, t, 95.4, 101.4, 'ELIMINAR', 'restar la primera', 'queda una escalera');
  label(p, t, 101.8, 107.4, 'DE ABAJO ARRIBA', 'z = 2, y = 3, x = 4', 'cada escalón da una');
  label(p, t, 107.8, 114.0, 'EL BOTE DE CARO', 'el bote: 12 km/h', 'el río la empuja a 3');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['UNA ECUACIÓN', 'una recta: muchas soluciones'],
  ['UN SISTEMA', 'el punto donde se cortan'],
  ['MÉTODOS', 'reducción, sustitución, igualación'],
  ['CASOS', 'una, ninguna o infinitas'],
  ['ESCALERA', 'eliminar y despejar de abajo arriba'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 0.8, type: 'slide', d: .8 }, { t: 1.6, type: 'pop', i: 0 }, { t: 4.0, type: 'slide', d: 2.6 }, { t: 6.8, type: 'slide', d: 3.0 }];
  ev.push({ t: 12.8, type: 'pop', i: 1 }, { t: 13.4, type: 'pop', i: 2 }, { t: 15.8, type: 'rise' }, { t: 19.0, type: 'rise' }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'slide', d: .6 }, { t: 35.0, type: 'pop', i: 0 }, { t: 35.6, type: 'pop', i: 1 }, { t: 36.2, type: 'pop', i: 2 }, { t: 38.2, type: 'paint', d: 1.2 }, { t: 41.2, type: 'paint', d: 1.0 });
  ev.push({ t: 44.6, type: 'hit' }, { t: 44.8, type: 'lasso', d: .8 }, { t: 47.6, type: 'yes' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'rise' }, { t: 66.4, type: 'rise' }, { t: 69.4, type: 'rise' }, { t: 72.6, type: 'rise' }, { t: 78.2, type: 'away', d: .4 });
  ev.push({ t: 79.0, type: 'paint', d: 1.2 }, { t: 80.0, type: 'no' }, { t: 82.0, type: 'paint', d: 1.2 }, { t: 82.8, type: 'yes' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 97.6, type: 'card' }, { t: 98.6, type: 'rise' }, { t: 99.4, type: 'slide', d: .8 }, { t: 99.6, type: 'pop', i: 0 }, { t: 101.8, type: 'pop', i: 1 }, { t: 104.8, type: 'pop', i: 2 });
  ev.push({ t: 107.4, type: 'away', d: .4 }, { t: 107.8, type: 'slide', d: .8 }, { t: 108.4, type: 'slide', d: 4.0 }, { t: 110.8, type: 'yes' }, { t: 111.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k % 4 });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro navega en el río de las asíntotas.'],
  [4.0, 6.6, 'A favor de la corriente, va a quince.'],
  [6.8, 9.6, 'Contra la corriente, solo a nueve.'],
  [9.8, 12.4, '¿Cuánto pone el bote y cuánto el río?'],
  [12.8, 15.6, 'Dos incógnitas: v, el bote; c, la corriente.'],
  [15.8, 18.6, 'A favor se suman: v más c, quince.'],
  [19.0, 21.8, 'En contra se restan: v menos c, nueve.'],
  [22.0, 24.4, 'Un sistema de ecuaciones.'],
  [24.8, 29.0, 'Ojo: con una sola pista no alcanza.'],
  [31.8, 34.8, 'v más c igual a quince tiene muchas soluciones:'],
  [35.0, 37.8, 'diez y cinco, doce y tres, catorce y uno…'],
  [38.2, 41.0, 'Todas forman una recta.'],
  [41.2, 44.2, 'La segunda pista es otra recta.'],
  [44.6, 47.4, 'Solo un punto cumple las dos:'],
  [47.6, 50.2, 'v igual a doce, c igual a tres.'],
  [50.6, 53.6, 'La solución es donde se cortan.'],
  [53.8, 56.6, 'Hay tres caminos para hallarla sin dibujar.'],
  [60.0, 63.0, 'Reducción: se suman y c desaparece.'],
  [63.2, 66.0, 'Dos v es veinticuatro: v es doce.'],
  [66.4, 69.2, 'Sustitución: v es quince menos c.'],
  [69.4, 72.2, 'Se reemplaza en la otra: c es tres.'],
  [72.6, 75.4, 'Igualación: se despeja v en las dos.'],
  [75.6, 78.4, 'Y se igualan: el mismo resultado.'],
  [78.8, 81.6, 'Si las rectas son paralelas, no hay solución.'],
  [81.8, 84.4, 'Si son la misma, hay infinitas.'],
  [84.8, 87.6, '¿Y con tres incógnitas?'],
  [87.8, 90.4, 'Se arma una escalera.'],
  [95.4, 98.4, 'Se resta la primera ecuación a las otras dos.'],
  [98.6, 101.4, 'Queda una escalera: z vale dos.'],
  [101.8, 104.6, 'Sube un escalón: y vale tres.'],
  [104.8, 107.4, 'Arriba, x vale cuatro.'],
  [107.8, 110.6, 'Volvamos al bote de Caro.'],
  [110.8, 114.0, 'Con dos pistas, el sistema tiene respuesta.'],
  [115.4, 119.6, 'El bote de Caro va a doce kilómetros por hora'],
  [119.8, 124.4, 'y el río la empuja a tres.'],
];
