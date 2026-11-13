// «Proporciones y magnitudes» (lección alg-12e de Zuka, Mercado de las razones, video 2) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (la receta de 4 huevos por 6 tazas y la de 10 por 15, 2/3 y 5/7, x/8 = 9/12,
// cuadernos de 2 500, 24 caramelos, el taxi de 4 000 + 2 000 por km, el premio de 45 000 en 2 : 3 : 4), que
// tests/razones-desde-cero.test.js mantiene fuera de los ejercicios. Hilo (docs/storytelling-videos.md): Ana quiere más pan
// para el puesto sin que cambie el sabor.
// Niveles: 0 dos recetas (la proporción) → 1 por el «×»: en cruz → 2 por el cuaderno: directa e inversa → 3 por el premio: repartir.
const POSTER = 66.4;
const O2 = [200, 1080];

const FILM = {
  DUR: 129, endAt: 113.4,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1320], r: 78, A: [540, 725] },
    { a: 57.4, b: 59.6, P: [540, 1330], r: 85, A: [540, 860] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 95, A: [540, 700] },
  ],
  open: { Z0: 2.3, C: [275, 660], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'en cruz', L: [330, 1530] },
    { fire: 53.0, lock: 53.6, name: 'directa e inversa', L: [360, 1530] },
    { fire: 88.6, lock: 89.2, name: 'repartir', L: [330, 1530] },
  ],
  stops: ['dos recetas', 'en cruz', 'directa e inversa', 'repartir'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 120.0],
    smiles: [[15.6, 17.2], [48.4, 50.0], [65.0, 66.6], [104.6, 106.2], [118.0, 135]],
    wides: [[40.0, 41.4], [86.0, 87.4]],
    looks: [],
  },
};

// ---------- piezas ----------
function egg(p, x, y, s, k) { if (k > 0.01) shaded(scaleAt(p, x, y, k), 'ellipse', { cx: x, cy: y, rx: s * .36, ry: s * .46 }, C.cream, C.creamD, s * .08, s * .08); }
function cup(p, x, y, s, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  el('path', { d: `M${r1(x + s * .3)},${r1(y - s * .1)}a${r1(s * .16)},${r1(s * .16)} 0 1 1 0,${r1(s * .3)}`, fill: 'none', stroke: C.blueD, 'stroke-width': r1(s * .09) }, S);
  shaded(S, 'path', { d: `M${r1(x - s * .38)},${r1(y - s * .3)}L${r1(x + s * .38)},${r1(y - s * .3)}L${r1(x + s * .3)},${r1(y + s * .34)}Q${x},${r1(y + s * .44)} ${r1(x - s * .3)},${r1(y + s * .34)}Z` }, C.blue, C.blueD, s * .07, s * .07);
}
function coin(p, x, y, k, lbl) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'circle', { cx: x, cy: y, r: 30 }, C.sun, C.sunD, 4, 4);
  el('circle', { cx: x, cy: y, r: 20, fill: 'none', stroke: C.sunD, 'stroke-width': 4 }, S);
  if (lbl) tag(S, x, y + 9, lbl, 1, C.night, 22);
}
function axes(p, t, t0, k, xl, yl) {
  const ka = eio(seg(t, t0, t0 + .6)) * k; if (ka <= 0.01) return;
  el('rect', { x: O2[0] - 3, y: r1(O2[1] - 500 * ka), width: 6, height: r1(500 * ka), rx: 3, fill: C.mist }, p);
  el('rect', { x: O2[0], y: O2[1] - 3, width: r1(720 * ka), height: 6, rx: 3, fill: C.mist }, p);
  tag(p, 920, O2[1] + 104, xl, ka, C.mist, 36, 'end'); tag(p, O2[0] + 20, 560, yl, ka, C.mist, 36, 'start');
}
function curvePath(p, f, x0, x1, X, Y, k, col) {
  if (k <= 0.01) return;
  const pts = []; for (let j = 0; j <= 40; j++) { const v = lerp(x0, x1, j / 40 * k); pts.push(`${r1(X(v))},${r1(Y(f(v)))}`); }
  el('path', { d: 'M' + pts.join('L'), fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}

// ---------- nivel 0 · dos recetas ----------
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, 275, 660, 140, 190);
  for (let i = 0; i < 4; i++) egg(G, 170 + i * 70, 660, 70, 1 + .1 * wob(t, 7.0 + i * .12, 14, 6));
  for (let i = 0; i < 6; i++) cup(G, 470 + i * 70, 660, 70, pop(t, 7.6 + i * .08));
  for (let i = 0; i < 10; i++) egg(G, 160 + (i % 5) * 56, 830 + Math.floor(i / 5) * 66, 54, pop(t, 9.4 + i * .05));
  for (let i = 0; i < 15; i++) cup(G, 470 + (i % 5) * 64, 810 + Math.floor(i / 5) * 58, 52, pop(t, 10.0 + i * .04));
  tag(G, 1000, 674, 'chica', pop(t, 7.4), C.mist, 36, 'end'); tag(G, 1000, 874, 'grande', pop(t, 9.8), C.mist, 36, 'end');
  riseFormula(G, t, 13.2, 18.4, 540, 1100, 72, [{ fr: ['4', '6'] }, '=', { fr: ['2', '3'] }, '=', { fr: ['10', '15'] }], { colors: {} });
  riseFormula(G, t, 18.8, 999, 540, 1100, 80, [{ fr: ['a', 'b'] }, '=', { fr: ['c', 'd'] }], { fill: C.sun });
  const ke = pop(t, 24.6);
  if (ke > 0.01) { tag(G, 300, 1240, 'extremos: a y d', ke, C.sun, 40); tag(G, 780, 1240, 'medios: b y c', ke, C.mint, 40); }
  tile(G, 540, 1320, 110, '×', pop(t, 24.8) * (1 + .12 * wob(t, 25.2, 14, 6)), NEG, C.night);
}
// ---------- nivel 1 · en cruz ----------
function level1(G, t) {
  starField(G, 17, 90);
  const L = [['a', 400, 660, C.sun], ['b', 400, 840, C.mint], ['c', 680, 660, C.mint], ['d', 680, 840, C.sun]];
  for (const x of [400, 680]) el('rect', { x: x - 60, y: 744, width: 120, height: 10, rx: 5, fill: C.cream }, G);
  tag(G, 540, 774, '=', 1, C.cream, 80);
  L.forEach(([s, x, y, c]) => tag(G, x, y + 34, s, 1, c, 100));
  const k1 = eio(seg(t, 32.0, 32.8)), k2 = eio(seg(t, 32.6, 33.4));
  if (k1 > 0.01) el('path', { d: `M440,${660 + 10}L${r1(lerp(440, 640, k1))},${r1(lerp(670, 830, k1))}`, stroke: C.sun, 'stroke-width': 7, 'stroke-linecap': 'round' }, G);
  if (k2 > 0.01) el('path', { d: `M440,830L${r1(lerp(440, 640, k2))},${r1(lerp(830, 670, k2))}`, stroke: C.mint, 'stroke-width': 7, 'stroke-linecap': 'round' }, G);
  riseFormula(G, t, 33.6, 999, 540, 990, 72, ['a · d', '=', 'b · c'], { colors: { 'a · d': C.sun, 'b · c': C.mint } });
  riseFormula(G, t, 38.2, 43.6, 540, 1120, 64, [{ fr: ['2', '3'] }, '¿=?', { fr: ['5', '7'] }]);
  riseFormula(G, t, 39.4, 43.6, 540, 1230, 60, ['2 · 7 = 14', '≠', '3 · 5 = 15'], { fill: C.coral });
  badge(G, 960, 1190, life(t, 40.2, 43.6), false);
  riseFormula(G, t, 44.2, 49.8, 540, 1120, 64, [{ fr: ['x', '8'] }, '=', { fr: ['9', '12'] }]);
  riseFormula(G, t, 45.6, 49.8, 540, 1230, 60, ['12x', '=', '8 · 9', '=', '72']);
  riseFormula(G, t, 47.0, 49.8, 540, 1320, 64, ['x', '=', '6'], { fill: C.sun });
  riseFormula(G, t, 50.4, 999, 540, 1120, 64, [{ fr: ['6', '8'] }, '=', { fr: ['9', '12'] }, '=', { fr: ['3', '4'] }], { fill: C.mint });
  badge(G, 880, 1080, pop(t, 51.2), true);
  // el cuaderno (puerta)
  const kn = pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6));
  if (kn > 0.01) { const S = scaleAt(G, 540, 1330, kn); shaded(S, 'rect', { x: 490, y: 1270, width: 100, height: 124, rx: 10 }, C.mint, C.mintD, 5, 5); for (let j = 0; j < 4; j++) el('rect', { x: 508, y: 1300 + j * 22, width: 64, height: 6, rx: 3, fill: C.mintD }, S); el('rect', { x: 490, y: 1270, width: 16, height: 124, fill: C.mintD }, S); }
}
// ---------- nivel 2 · directa e inversa ----------
function level2(G, t) {
  starField(G, 29, 90);
  // directa: cuadernos de 2 500
  const kD = out(t, 71.8), XD = v => O2[0] + 160 * v, YD = v => O2[1] - .046 * v;
  if (kD > 0.01) {
    const S = scaleAt(G, 540, 860, kD);
    axes(S, t, 59.8, 1, 'cuadernos', 'pesos');
    for (let v = 1; v <= 4; v++) { tag(S, XD(v), O2[1] + 50, String(v), pop(t, 60.4), C.mist, 34); tag(S, O2[0] - 16, YD(2500 * v) + 12, (2500 * v).toLocaleString('es-CO').replace(/\./g, ' '), pop(t, 60.4), C.mist, 30, 'end'); }
    curvePath(S, v => 2500 * v, 0, 4.2, XD, YD, eio(seg(t, 63.6, 64.8)), C.mint);
    for (let v = 1; v <= 4; v++) mark(S, XD(v), r1(YD(2500 * v)), '', pop(t, 61.0 + v * .5), C.sun);
  }
  riseFormula(G, t, 65.0, 71.6, 540, 1275, 64, [{ fr: ['precio', 'cuadernos'] }, '=', '2 500', '=', 'k'], { colors: { 'k': C.sun } });
  // inversa: 24 caramelos
  const kI = pop(t, 72.2) * out(t, 84.2), XI = v => O2[0] + 85 * v, YI = v => O2[1] - 19 * v;
  if (kI > 0.01) {
    const S = scaleAt(G, 540, 860, kI);
    axes(S, t, 72.2, 1, 'niños', 'caramelos');
    [1, 2, 3, 4, 6, 8].forEach(v => tag(S, XI(v), O2[1] + 50, String(v), 1, C.mist, 34));
    [6, 12, 24].forEach(v => tag(S, O2[0] - 16, YI(v) + 12, String(v), 1, C.mist, 30, 'end'));
    curvePath(S, v => 24 / v, 1, 8.4, XI, YI, eio(seg(t, 76.0, 77.6)), C.coral);
    [1, 2, 3, 4, 6, 8].forEach((v, i) => mark(S, XI(v), r1(YI(24 / v)), '', pop(t, 73.0 + i * .4), C.sun));
  }
  riseFormula(G, t, 77.8, 84.0, 540, 1275, 64, ['niños · caramelos', '=', '24'], { colors: { '24': C.sun } });
  // ni una ni otra: el taxi
  const kT = eo(seg(t, 84.6, 85.2)), XT = v => O2[0] + 160 * v, YT = v => O2[1] - .038 * v;
  if (kT > 0.01) {
    const S = scaleAt(G, 540, 860, kT);
    axes(S, t, 84.6, 1, 'km', 'pesos');
    for (let v = 1; v <= 4; v++) tag(S, XT(v), O2[1] + 50, String(v), 1, C.mist, 34);
    [4000, 8000, 12000].forEach(v => tag(S, O2[0] - 16, YT(v) + 12, v.toLocaleString('es-CO').replace(/\./g, ' '), 1, C.mist, 30, 'end'));
    curvePath(S, v => 4000 + 2000 * v, 0, 4, XT, YT, eio(seg(t, 85.4, 86.6)), C.blue);
    mark(S, XT(0), r1(YT(4000)), '', pop(t, 85.4), C.coral);
    mark(S, XT(1), r1(YT(6000)), '', pop(t, 86.0), C.sun); mark(S, XT(2), r1(YT(8000)), '', pop(t, 86.4), C.sun);
  }
  riseFormula(G, t, 86.8, 999, 540, 1275, 60, ['8 000', '≠', '2 · 6 000'], { fill: C.coral });
  chip(G, 540, 1385, '$45 000', pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, C.night, 54);
}
// ---------- nivel 3 · repartir ----------
const SH = [['Ana', 300, 2], ['Beto', 540, 3], ['Caro', 780, 4]];
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 113.4, 114.0)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  chip(S, 540, 700, '$45 000', 1, ZERO, C.night, 54);
  SH.forEach(([n, x, parts], i) => {
    const k = pop(t, 95.6 + i * .3);
    buddy(S, x, 1060, 100, k, [C.blue, C.mint, C.coral][i], [C.blueD, C.mintD, C.coralD][i]);
    chip(S, x, 1170, `${n} · ${parts} mil`, k, POS, C.night, 34);
  });
  let c = 0;
  SH.forEach(([, x, parts], i) => {
    for (let j = 0; j < parts; j++, c++) {
      const x0 = 220 + c * 80, m = eio(seg(t, 102.6 + c * .15, 103.4 + c * .15));
      const x1 = x + (j - (parts - 1) / 2) * 58, xx = lerp(x0, x1, m), yy = lerp(860, 930, m) - 60 * Math.sin(Math.PI * m);
      coin(S, xx, yy, pop(t, 101.6 + c * .06), '5 mil');
    }
  });
  riseFormula(S, t, 101.8, 999, 540, 790, 50, ['2 + 3 + 4', '=', '9 partes']);
  riseFormula(S, t, 104.8, 999, 540, 870, 50, ['45 000 ÷ 9', '=', '5 000'], { colors: { '5 000': C.sun } });
  SH.forEach(([, x, parts], i) => chip(S, x, 1255, `$${(parts * 5).toString()} 000`, pop(t, 107.6 + i * .3), MINT, C.night, 40));
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Proporciones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y magnitudes', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.6, 'EL PAN DE ANA', 'chica: 4 huevos, 6 tazas', 'grande: 10 huevos, 15 tazas');
  label(p, t, 13.0, 18.4, 'SABEN IGUAL', 'las dos razones valen 2/3', 'por eso el sabor no cambia');
  label(p, t, 18.8, 24.4, 'PROPORCIÓN', 'dos razones iguales', 'a es a b como c es a d');
  label(p, t, 24.8, 29.0, 'EXTREMOS Y MEDIOS', 'a y d, afuera', 'b y c, adentro');
  label(p, t, 31.8, 37.8, 'EN CRUZ', 'extremos por extremos', 'igual a medios por medios');
  label(p, t, 38.2, 43.6, 'NO SIEMPRE', 'dos tercios y cinco séptimos', '14 no es 15: no hay proporción');
  label(p, t, 44.0, 49.8, 'EL QUE FALTA', 'x es a 8 como 9 es a 12', 'en cruz: 12x = 72');
  label(p, t, 50.2, 56.6, 'COMPRUEBA', 'seis octavos y nueve doceavos', 'los dos valen 3/4');
  label(p, t, 59.8, 65.6, 'DIRECTA', 'cada cuaderno, 2 500 pesos', 'el doble de cuadernos, el doble de precio');
  label(p, t, 66.0, 71.8, 'UNA RECTA', 'el cociente no cambia: k', 'y la recta pasa por el origen');
  label(p, t, 72.2, 78.0, 'INVERSA', '24 caramelos para repartir', 'más niños, menos para cada uno');
  label(p, t, 78.4, 84.2, 'UNA CURVA', 'el producto no cambia: 24', 'baja cada vez más despacio');
  label(p, t, 84.6, 92.2, 'NI UNA NI OTRA', 'el taxi: 4 000 por subirse', 'más 2 000 por kilómetro');
  label(p, t, 95.4, 101.4, 'UN PREMIO', 'pusieron 2, 3 y 4 mil', 'y ganaron 45 000');
  label(p, t, 101.8, 107.4, 'NUEVE PARTES', '2 + 3 + 4 = 9', 'cada parte vale 5 000');
  label(p, t, 107.8, 113.2, 'LO JUSTO', 'en la razón 2 : 3 : 4', '10 000, 15 000 y 20 000');
};
FILM.summary = (p, t) => summaryList(p, t, 114.0, 'En resumen', [
  ['PROPORCIÓN', [{ fr: ['a', 'b'] }, '=', { fr: ['c', 'd'] }]],
  ['EN CRUZ', ['ad', '=', 'bc']],
  ['DIRECTA', [{ fr: ['y', 'x'] }, '=', 'k']],
  ['INVERSA', ['x · y', '=', 'k']],
  ['REPARTIR', 'suma las partes y divide'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 4; i++) ev.push({ t: 7.0 + i * .12, type: 'count', i });
  ev.push({ t: 7.6, type: 'tile', i: 0 }, { t: 9.4, type: 'tile', i: 1 }, { t: 10.0, type: 'tile', i: 2 });
  ev.push({ t: 13.2, type: 'rise' }, { t: 14.0, type: 'yes' }, { t: 18.8, type: 'rise' }, { t: 24.6, type: 'pop', i: 0 }, { t: 24.8, type: 'tile', i: 3 });
  ev.push({ t: 32.0, type: 'slide', d: .8 }, { t: 32.6, type: 'slide', d: .8 }, { t: 33.6, type: 'rise' });
  ev.push({ t: 38.2, type: 'rise' }, { t: 39.4, type: 'rise' }, { t: 40.2, type: 'no' }, { t: 44.2, type: 'rise' }, { t: 45.6, type: 'rise' }, { t: 47.0, type: 'rise' }, { t: 47.4, type: 'yes' });
  ev.push({ t: 50.4, type: 'rise' }, { t: 51.2, type: 'yes' }, { t: 52.4, type: 'pop', i: 1 });
  ev.push({ t: 59.8, type: 'line', d: .6 });
  for (let v = 1; v <= 4; v++) ev.push({ t: 61.0 + v * .5, type: 'pop', i: v });
  ev.push({ t: 63.6, type: 'paint', d: 1.2 }, { t: 65.0, type: 'rise' }, { t: 71.8, type: 'away', d: .4 }, { t: 72.2, type: 'line', d: .6 });
  for (let i = 0; i < 6; i++) ev.push({ t: 73.0 + i * .4, type: 'pop', i });
  ev.push({ t: 76.0, type: 'paint', d: 1.6 }, { t: 77.8, type: 'rise' }, { t: 84.2, type: 'away', d: .4 }, { t: 84.6, type: 'line', d: .6 }, { t: 85.4, type: 'paint', d: 1.2 }, { t: 86.8, type: 'rise' }, { t: 87.2, type: 'no' }, { t: 88.0, type: 'pop', i: 2 });
  ev.push({ t: 95.6, type: 'pop', i: 0 }, { t: 95.9, type: 'pop', i: 1 }, { t: 96.2, type: 'pop', i: 2 }, { t: 101.6, type: 'count', i: 0 }, { t: 101.8, type: 'rise' });
  for (let c = 0; c < 9; c++) ev.push({ t: 103.4 + c * .15, type: 'tile', i: c });
  for (let i = 0; i < 3; i++) ev.push({ t: 107.6 + i * .3, type: 'pop', i });
  ev.push({ t: 108.6, type: 'yes' }, { t: 113.4, type: 'away', d: .6 }, { t: 114.0, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 114.6 + k * .55, type: 'stop', i: k });
  ev.push({ t: 117.6, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana quiere hornear más pan para su puesto.'],
  [4.0, 6.4, 'Pero sin que cambie el sabor.'],
  [6.8, 9.8, 'La receta chica: cuatro huevos por seis tazas.'],
  [10.0, 12.6, 'La grande, diez huevos por quince tazas.'],
  [13.0, 15.8, 'Las dos razones se simplifican a dos tercios.'],
  [16.0, 18.4, 'Por eso los dos panes saben igual.'],
  [18.8, 21.6, 'Dos razones iguales forman una proporción:'],
  [21.8, 24.4, 'a es a b como c es a d.'],
  [24.8, 29.0, 'Los de afuera son los extremos; los de adentro, los medios.'],
  [31.8, 34.8, 'La propiedad clave: multiplicar en cruz.'],
  [35.0, 37.8, 'Extremos por extremos es igual a medios por medios.'],
  [38.2, 41.0, '¿Dos tercios y cinco séptimos forman proporción?'],
  [41.2, 43.6, 'Catorce no es quince: no.'],
  [44.0, 46.8, 'Equis es a ocho como nueve es a doce.'],
  [47.0, 49.8, 'En cruz: doce equis es setenta y dos.'],
  [50.2, 53.2, 'Comprobamos: seis octavos y nueve doceavos'],
  [53.4, 56.6, 'valen tres cuartos. Sí es proporción.'],
  [59.8, 62.8, 'Cada cuaderno cuesta dos mil quinientos pesos.'],
  [63.0, 65.6, 'El doble de cuadernos, el doble de precio.'],
  [66.0, 68.8, 'El cociente no cambia: es la constante k.'],
  [69.0, 71.8, 'Son directamente proporcionales: una recta por el origen.'],
  [72.2, 75.0, 'Ahora hay veinticuatro caramelos para repartir.'],
  [75.2, 78.0, 'Más niños, menos caramelos para cada uno.'],
  [78.4, 81.2, 'Lo que no cambia es el producto: veinticuatro.'],
  [81.4, 84.2, 'Son inversamente proporcionales: una curva.'],
  [84.6, 88.4, 'Cuidado con el taxi: 4 000 por subirse y 2 000 por km.'],
  [88.6, 92.2, 'Dos kilómetros no cuestan el doble que uno: no es ninguna de las dos.'],
  [95.4, 98.4, 'Ana, Beto y Caro pusieron 2, 3 y 4 mil en un boleto.'],
  [98.6, 101.4, 'Ganaron 45 000. ¿Cómo repartir con justicia?'],
  [101.8, 104.6, 'Juntos son nueve partes iguales.'],
  [104.8, 107.4, 'Cada parte vale cinco mil.'],
  [107.8, 110.6, 'Dos partes para Ana, tres y cuatro para los otros.'],
  [110.8, 113.2, 'Diez, quince y veinte mil.'],
  [114.6, 118.8, 'El pan de Ana sabe igual porque sus razones son iguales.'],
  [119.0, 123.6, 'Eso es una proporción, y en cruz se resuelve.'],
];
