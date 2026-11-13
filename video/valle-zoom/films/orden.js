// «El orden y el valor absoluto» (lección alg-12d de Zuka, Valle de los Números, video 6) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (−5 < −2, Ana, Beto y Caro, 1 < 4 sumando 2, por 3 y por −1, |−6|, la distancia
// entre −4 y 3, |x − 1| ≤ 2), que tests/axiomas-desde-cero.test.js mantiene fuera de los ejercicios.
// Niveles: 0 los positivos (la recta y la tricotomía) → 1 por el «<»: comparar → 2 por «· (−1)»: el espejo → 3 por |−6|: distancia.
const POSTER = 75.6;
const XA = v => 540 + 80 * v, LYA = 800;
const XB = v => 540 + 70 * v, XC = v => 540 + 66 * v;

const FILM = {
  DUR: 124, endAt: 109.0,
  DT: [[29.0, 31.2], [56.6, 58.8], [80.6, 82.8]],
  dives: () => [
    { a: 29.0, b: 31.2, P: [540, 1320], r: 80, A: [540, 700] },
    { a: 56.6, b: 58.8, P: [540, 1330], r: 95, A: [540, 900] },
    { a: 80.6, b: 82.8, P: [540, 1300], r: 90, A: [540, 700] },
  ],
  open: { Z0: 2.4, C: [540, LYA], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.0, lock: 25.6, name: 'comparar', L: [330, 1530] },
    { fire: 52.8, lock: 53.4, name: 'el espejo', L: [330, 1530] },
    { fire: 77.0, lock: 77.6, name: 'la distancia', L: [330, 1530] },
  ],
  stops: ['positivos', 'comparar', 'el espejo', 'distancia'],
  guide: {
    blinks: [7.6, 13.6, 20.2, 27.0, 35.0, 41.6, 47.4, 61.6, 68.2, 74.6, 86.0, 92.4, 98.8, 105.0, 116.0],
    smiles: [[9.0, 10.6], [22.4, 24.0], [46.4, 48.0], [64.6, 66.2], [87.2, 88.8], [113.0, 130]],
    wides: [[75.0, 76.4], [105.4, 106.8]],
    looks: [],
  },
};

// ---------- nivel 0 · los positivos ----------
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, 540, LYA, 110, 160);
  const kp = eio(seg(t, 7.0, 8.2)), kn = eio(seg(t, 8.2, 9.4));
  if (kp > 0.01) el('rect', { x: 540, y: LYA - 7, width: r1((XA(5) + 50 - 540) * kp), height: 14, rx: 7, fill: C.mint }, G);
  if (kn > 0.01) el('rect', { x: r1(540 - (540 - XA(-5) + 50) * kn), y: LYA - 7, width: r1((540 - XA(-5) + 50) * kn), height: 14, rx: 7, fill: C.coral }, G);
  numLine(G, t, -1, XA, LYA, -5, 5, { size: 40 });
  tag(G, XA(3), LYA - 70, 'positivos', pop(t, 8.0), C.mint, 48); tag(G, XA(-3), LYA - 70, 'negativos', pop(t, 9.2), C.coral, 48);
  riseFormula(G, t, 13.0, 18.2, 540, 1010, 50, ['a, b > 0', { s: 'arrow' }, 'a + b > 0', ',', 'ab > 0'], { colors: { 'a + b > 0': C.mint, 'ab > 0': C.mint } });
  // tricotomía: tres casas, una sola para cada número
  const H = [['positivo', 280, MINT], ['cero', 540, ZERO], ['negativo', 800, NEG]];
  H.forEach(([s, x, c], i) => chip(G, x, 1120, s, pop(t, 18.8 + i * .3) * out(t, 24.6), c, C.night, 46));
  const DR = [['3', 280, 20.6], ['0', 540, 21.6], ['−2', 800, 22.6]];
  DR.forEach(([s, x, t0]) => {
    const m = eio(seg(t, t0, t0 + .7)), k = pop(t, t0 - .3) * out(t, 24.6); if (k <= 0.01) return;
    const X = lerp(XA(+s.replace('−', '-')), x, m), Y = lerp(LYA, 1020, m) - 90 * Math.sin(Math.PI * m);
    tile(G, X, Y, 70, s, k, tcol(+s.replace('−', '-')), C.night);
  });
  tile(G, 540, 1320, 110, '<', pop(t, 24.8) * (1 + .12 * wob(t, 25.0, 14, 6)), ZERO, C.night);
}
// ---------- nivel 1 · comparar ----------
function level1(G, t) {
  starField(G, 17, 90);
  const ko = out(t, 50.0);
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 900, ko);
    tile(S, 540, 700, 110, '<', 1, ZERO, C.night);
    tag(S, 420, 730, 'a', pop(t, 31.6), C.cream, 96, 'end'); tag(S, 660, 730, 'b', pop(t, 31.8), C.cream, 96, 'start');
    riseFormula(S, t, 33.0, 999, 540, 860, 60, ['si', 'b − a > 0'], { colors: { 'b − a > 0': C.mint } });
    numLine(S, t, 38.0, XB, 1020, -6, 6, { size: 36 });
    mark(S, XB(-5), 1020, '−5', pop(t, 38.6), C.coral); mark(S, XB(-2), 1020, '−2', pop(t, 39.0), C.coral);
    const ka = eio(seg(t, 39.6, 40.6));
    if (ka > 0.01) { arrowLine(S, [[XB(-5) + 10, 1020 + 96], [lerp(XB(-5) + 10, XB(-2) - 4, ka), 1020 + 96]], ka, C.mint, 6); tag(S, XB(-3.5), 1020 + 150, '3 pasos', ka, C.mint, 40); }
    riseFormula(S, t, 40.8, 44.0, 540, 1250, 54, ['−2 − (−5)', '=', '3', '>', '0'], { colors: { '3': C.mint } });
    riseFormula(S, t, 44.4, 999, 540, 1240, 84, ['<', '>', '≤', '≥'], { fill: C.sun });
    const k4 = pop(t, 46.4); if (k4 > 0.01) { tag(S, 540, 1360, '4 ≤ 4', k4, C.cream, 60); badge(S, 680, 1340, k4, true); }
  }
  // transitiva: Ana, Beto y Caro
  const P = [['Ana', 300, 80, C.blue, C.blueD], ['Beto', 540, 110, C.mint, C.mintD], ['Caro', 780, 140, C.coral, C.coralD]];
  P.forEach(([n, x, s, c, d], i) => {
    const k = pop(t, 50.6 + i * .3); if (k <= 0.01) return;
    buddy(G, x, 1090 - s * .9, s, k, c, d);
    chip(G, x, 1150, n, k, POS, C.night, 40);
  });
  riseFormula(G, t, 51.6, 999, 540, 800, 56, ['a < b', 'y', 'b < c', { s: 'arrow' }, 'a < c'], { colors: { 'a < c': C.sun } });
  chip(G, 540, 1330, '· (−1)', pop(t, 52.4) * (1 + .1 * wob(t, 52.8, 14, 6)), NEG, C.night, 56);
}
// ---------- nivel 2 · el espejo ----------
function level2(G, t) {
  starField(G, 29, 90);
  const X2 = v => 540 + 36 * v;                                          // recta ancha: llega a 12
  numLine(G, t, 56.0, X2, 900, -12, 12, { size: 30, step: 2 });
  const km = eio(seg(t, 72.8, 73.6));
  if (km > 0.01) el('rect', { x: 536, y: r1(900 - 220 * km), width: 8, height: r1(380 * km), rx: 4, fill: C.sun }, G);
  // 1 y 4: +2 → 3 y 6 · vuelven (se desvanecen) · ×3 → 3 y 12 · vuelven · ×(−1) → −1 y −4
  const A = seg(t, 62.4, 63.4), Cx = seg(t, 68.0, 69.0), E = seg(t, 74.0, 75.0);
  const pos = v0 => {
    let v = v0, h = 0;
    if (t < 66.8) { v = v0 + 2 * eio(A); h = 120 * Math.sin(Math.PI * A); }
    else if (t < 67.1) v = v0 + 2;
    else if (t < 72.6) { v = lerp(v0, 3 * v0, eio(Cx)); h = 150 * Math.sin(Math.PI * Cx); }
    else if (t < 72.9) v = 3 * v0;
    else { v = lerp(v0, -v0, eio(E)); h = 180 * Math.sin(Math.PI * E); }
    return [X2(v), 900 - h, E > .5];
  };
  const fade = 1 - .98 * (Math.sin(Math.PI * seg(t, 66.8, 67.4)) + Math.sin(Math.PI * seg(t, 72.6, 73.2)));
  [1, 4].forEach((v0, i) => {
    const k = pop(t, 59.6 + i * .3) * Math.max(0, fade); if (k <= 0.01) return;
    const [x, y, flip] = pos(v0);
    el('circle', { cx: r1(x), cy: r1(y), r: r1(18 * k), fill: flip ? C.coral : i ? C.sun : C.cream }, G);
  });
  const moving = [A, Cx, E].some(q => q > 0 && q < 1);
  const lbl = t < 62.4 ? ['1', '4'] : t < 67.1 ? ['3', '6'] : t < 68.0 ? ['1', '4'] : t < 72.9 ? ['3', '12'] : t < 74.6 ? ['1', '4'] : ['−1', '−4'];
  const kl = pop(t, 60.2) * (moving ? 0 : 1) * Math.max(0, fade);
  [1, 4].forEach((v0, i) => { const [x, , flip] = pos(v0); tag(G, x, 840, lbl[i], kl, flip ? C.coral : i ? C.sun : C.cream, 50); });
  riseFormula(G, t, 59.8, 999, 540, 1090, 70, ['1 < 4']);
  riseFormula(G, t, 63.6, 66.6, 540, 1190, 66, [{ s: 'arrow' }, '3 < 6'], { fill: C.mint });
  riseFormula(G, t, 67.8, 72.6, 540, 1190, 66, [{ s: 'arrow' }, '3 < 12'], { fill: C.mint });
  riseFormula(G, t, 75.2, 999, 540, 1190, 66, [{ s: 'arrow' }, '−1 > −4'], { fill: C.coral });
  tag(G, 540, 700, '+ 2', life(t, 62.2, 66.6), C.mint, 56); tag(G, 540, 700, '· 3', life(t, 67.8, 72.6), C.mint, 56); tag(G, 760, 700, '· (−1)', life(t, 73.6, 79.8), C.coral, 56);
  chip(G, 540, 1300, '|−6|', pop(t, 76.6) * (1 + .1 * wob(t, 77.0, 14, 6)), ZERO, C.night, 60);
}
// ---------- nivel 3 · la distancia ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 109.0, 109.6)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko), Y = 950;
  chip(S, 540, 700, '|−6|', out(t, 89.4), ZERO, C.night, 60);
  numLine(S, t, 82.4, XC, Y, -7, 7, { size: 34 });
  const k6 = out(t, 89.4);
  if (k6 > 0.01) {
    mark(S, XC(-6), Y, '−6', pop(t, 83.4) * k6, C.coral);
    for (let j = 0; j < 6; j++) hop(S, XC(-6 + j), XC(-5 + j), Y, 40, eio(seg(t, 84.0 + j * .4, 84.4 + j * .4)) * k6, C.sun, 5);
    tag(S, XC(-3), Y + 120, '6 pasos', pop(t, 86.4) * k6, C.sun, 44);
  }
  riseFormula(S, t, 86.8, 89.4, 540, 1180, 72, ['|−6|', '=', '6'], { colors: { '6': C.sun } });
  riseFormula(S, t, 89.8, 95.4, 540, 1150, 56, ['|a| = a', 'si', 'a ≥ 0'], { colors: { 'si': C.mist } });
  riseFormula(S, t, 90.6, 95.4, 540, 1250, 56, ['|a| = −a', 'si', 'a < 0'], { colors: { 'si': C.mist, '|a| = −a': C.coral } });
  riseFormula(S, t, 89.8, 95.4, 540, 720, 60, ['|a|', '=', 'distancia de a al 0'], { fill: C.sun });
  // entre −4 y 3
  const kd = life(t, 95.8, 101.6);
  if (kd > 0.01) {
    mark(S, XC(-4), Y, '−4', kd, C.coral); mark(S, XC(3), Y, '3', kd, C.cream);
    const kb = eio(seg(t, 96.4, 97.4)) * out(t, 101.6);
    if (kb > 0.01) { el('rect', { x: XC(-4), y: Y + 70, width: r1((XC(3) - XC(-4)) * kb), height: 10, rx: 5, fill: C.mint }, S); tag(S, XC(-0.5), Y + 130, '7 pasos', kb, C.mint, 44); }
  }
  riseFormula(S, t, 97.0, 101.6, 540, 1200, 52, ['|−4 − 3|', '=', '|3 − (−4)|', '=', '7'], { colors: { '7': C.mint } });
  // |x − 1| ≤ 2
  const ki = eio(seg(t, 103.4, 104.6));
  if (t > 102.0) {
    mark(S, XC(1), Y, '1', pop(t, 102.4), C.sun);
    if (ki > 0.01) {
      el('rect', { x: r1(XC(1) - (XC(1) - XC(-1)) * ki), y: Y - 8, width: r1((XC(3) - XC(-1)) * ki), height: 16, rx: 8, fill: C.sun }, S);
      for (const v of [-1, 3]) { const k = pop(t, 104.6); if (k > 0.01) { el('circle', { cx: XC(v), cy: Y, r: r1(18 * k), fill: C.sun }, S); tag(S, XC(v), Y - 44, minus(v), k, C.sun, 48); } }
      hop(S, XC(1), XC(-1), Y, 70, ki, C.mint, 5); hop(S, XC(1), XC(3), Y, 70, ki, C.mint, 5);
    }
  }
  riseFormula(S, t, 102.4, 999, 540, 1180, 66, ['|x − 1|', '≤', '2']);
  riseFormula(S, t, 105.0, 999, 540, 1290, 72, ['[−1, 3]'], { fill: C.sun });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(840 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'El orden y', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'el valor absoluto', { 'font-size': 84, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LOS POSITIVOS', 'a la derecha del cero', 'con ellos se ordena todo');
  label(p, t, 12.8, 18.4, 'PRIMERA REGLA', 'suma o producto de positivos', 'también es positivo');
  label(p, t, 18.8, 24.4, 'TRICOTOMÍA', 'positivo, cero o negativo', 'exactamente una de las tres');
  label(p, t, 24.8, 28.8, 'COMPARAR', '¿quién es menor?', 'lo deciden los positivos');
  label(p, t, 31.6, 37.6, 'MENOR QUE', 'a es menor que b', 'cuando b − a es positivo');
  label(p, t, 38.0, 44.0, 'CON NEGATIVOS', '−5 es menor que −2', 'el menor queda a la izquierda');
  label(p, t, 44.4, 50.0, 'CUATRO SIGNOS', 'la punta señala al menor', 'con rayita: «o igual»');
  label(p, t, 50.4, 56.2, 'TRANSITIVA', 'Ana es más baja que Beto', 'y Beto que Caro: Ana, que Caro');
  label(p, t, 59.4, 66.6, 'SUMAR CONSERVA', 'a los dos lados, más 2', 'el orden sigue igual');
  label(p, t, 67.0, 72.6, 'POR UN POSITIVO', 'multiplicar por 3, también', 'el orden no cambia');
  label(p, t, 73.0, 79.4, 'POR UN NEGATIVO', 'cada punto salta a su reflejo', 'el orden se voltea');
  label(p, t, 83.2, 89.4, 'VALOR ABSOLUTO', 'la distancia al cero', 'seis pasos son seis pasos');
  label(p, t, 89.8, 95.4, 'EN FÓRMULA', 'positivo o cero: se queda igual', 'negativo: se toma su opuesto');
  label(p, t, 95.8, 101.6, 'DISTANCIA ENTRE DOS', 'el valor absoluto de la resta', 'no importa el orden');
  label(p, t, 102.0, 108.8, 'UN INTERVALO', 'a lo sumo 2 pasos del 1', 'con corchetes: los extremos entran');
};
FILM.summary = (p, t) => summaryList(p, t, 109.6, 'En resumen', [
  ['MENOR QUE', ['a < b', 'si', 'b − a > 0']],
  ['TRICOTOMÍA', 'positivo, cero o negativo'],
  ['POR UN NEGATIVO', 'el orden se voltea'],
  ['VALOR ABSOLUTO', 'la distancia al cero'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 7.0, type: 'paint', d: 1.2 }, { t: 8.2, type: 'paint', d: 1.2 }];
  ev.push({ t: 13.0, type: 'rise' }, { t: 13.6, type: 'yes' });
  for (let i = 0; i < 3; i++) ev.push({ t: 18.8 + i * .3, type: 'tile', i }, { t: 20.6 + i, type: 'fly', d: .7 }, { t: 21.3 + i, type: 'pop', i });
  ev.push({ t: 24.8, type: 'tile', i: 3 });
  ev.push({ t: 31.6, type: 'pop', i: 0 }, { t: 31.8, type: 'pop', i: 1 }, { t: 33.0, type: 'rise' }, { t: 38.0, type: 'line', d: .7 }, { t: 38.6, type: 'pop', i: 2 }, { t: 39.0, type: 'pop', i: 3 });
  ev.push({ t: 39.6, type: 'slide', d: 1.0 }, { t: 40.8, type: 'rise' }, { t: 41.4, type: 'yes' }, { t: 44.4, type: 'rise' }, { t: 46.4, type: 'yes' }, { t: 50.0, type: 'away', d: .4 });
  for (let i = 0; i < 3; i++) ev.push({ t: 50.6 + i * .3, type: 'count', i });
  ev.push({ t: 51.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 1 });
  ev.push({ t: 56.0, type: 'line', d: .7 }, { t: 59.6, type: 'pop', i: 0 }, { t: 59.9, type: 'pop', i: 1 }, { t: 59.8, type: 'rise' });
  ev.push({ t: 62.4, type: 'fly', d: 1.0 }, { t: 63.6, type: 'rise' }, { t: 66.8, type: 'fly', d: .8 }, { t: 67.8, type: 'rise' }, { t: 72.8, type: 'lasso', d: .8 }, { t: 74.0, type: 'fly', d: 1.0 }, { t: 75.2, type: 'rise' }, { t: 75.6, type: 'no' }, { t: 76.6, type: 'pop', i: 2 });
  ev.push({ t: 82.4, type: 'line', d: .7 }, { t: 83.4, type: 'pop', i: 0 });
  for (let j = 0; j < 6; j++) ev.push({ t: 84.0 + j * .4, type: 'count', i: j });
  ev.push({ t: 86.8, type: 'rise' }, { t: 89.8, type: 'rise' }, { t: 90.6, type: 'rise' }, { t: 95.8, type: 'pop', i: 1 }, { t: 96.4, type: 'paint', d: 1.0 }, { t: 97.0, type: 'rise' }, { t: 97.6, type: 'yes' });
  ev.push({ t: 102.4, type: 'rise' }, { t: 103.4, type: 'slide', d: 1.2 }, { t: 104.6, type: 'pop', i: 2 }, { t: 105.0, type: 'rise' }, { t: 105.4, type: 'yes' });
  ev.push({ t: 109.0, type: 'away', d: .6 }, { t: 109.6, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 110.2 + k * .55, type: 'stop', i: k });
  ev.push({ t: 112.8, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Los reales, además de operarse, se ordenan.'],
  [4.0, 6.4, 'Todo empieza con los positivos.'],
  [6.8, 9.6, 'Los positivos están a la derecha del cero.'],
  [9.8, 12.4, 'Los negativos, a la izquierda.'],
  [12.8, 15.6, 'Si sumas o multiplicas dos positivos,'],
  [15.8, 18.4, 'el resultado también es positivo.'],
  [18.8, 21.6, 'Todo real es positivo, cero o negativo.'],
  [21.8, 24.4, 'Exactamente una de las tres.'],
  [24.8, 28.8, '¿Cómo sabemos cuál es menor?'],
  [31.6, 34.6, 'A es menor que be'],
  [34.8, 37.6, 'cuando be menos a es positivo.'],
  [38.0, 41.0, 'Menos cinco es menor que menos dos:'],
  [41.2, 44.0, 'la resta da tres: positivo.'],
  [44.4, 47.2, 'Hay cuatro signos; la punta señala al menor.'],
  [47.4, 50.0, 'Con rayita, se lee «o igual».'],
  [50.4, 53.4, 'Si Ana es más baja que Beto, y Beto que Caro,'],
  [53.6, 56.2, 'Ana es más baja que Caro.'],
  [59.4, 62.4, 'Uno es menor que cuatro.'],
  [62.6, 66.6, 'Sumamos dos a los dos lados: tres es menor que seis.'],
  [67.0, 69.8, 'Por tres, igual: tres es menor que doce.'],
  [70.0, 72.6, 'Un positivo conserva el orden.'],
  [73.0, 76.2, 'Por menos uno, cada punto salta a su reflejo.'],
  [76.4, 79.4, 'Menos uno queda a la derecha: el orden se voltea.'],
  [83.2, 86.2, 'El valor absoluto es la distancia al cero.'],
  [86.4, 89.4, 'Seis pasos a la izquierda siguen siendo seis.'],
  [89.8, 92.6, 'Si el número es positivo o cero, se queda igual.'],
  [92.8, 95.4, 'Si es negativo, se toma su opuesto.'],
  [95.8, 98.8, 'Distancia entre dos: el absoluto de su resta.'],
  [99.0, 101.6, 'Entre menos cuatro y tres hay siete.'],
  [102.0, 105.0, 'Los números a lo sumo a dos pasos del uno'],
  [105.2, 108.8, 'van de menos uno a tres: un intervalo.'],
  [110.2, 114.6, 'A es menor que be cuando be menos a es positivo.'],
  [114.8, 119.4, 'Por un negativo, el orden se voltea. Y el valor absoluto mide distancias.'],
];
