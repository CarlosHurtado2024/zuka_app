// «Los números naturales y enteros» (lección alg-11 de Zuka) en estilo Scale Zoom Explainer. Motor: zoomkit.js.
// Mismos ejemplos que el video actual de la lección (tres manzanas, 2 − 5 en el termómetro, el opuesto de 4, el mar y la
// deuda), que tests/sistemas-numericos.test.js mantiene fuera de los ejercicios.
// Niveles: 0 contar (manzanas → la fila de los naturales) → 1 por el hueco a la izquierda del 1: la resta se escapa y
// nacen los enteros → 2 dentro del cero: el espejo y el opuesto → 3 dentro de los positivos: ℕ vive dentro de ℤ.
const AP = [[330, 720], [540, 720], [750, 720]];                         // las tres manzanas
const ROW = 880, RX = i => 300 + 130 * i;                                // la fila de los naturales (i = 0 → el 1)
const TX = 330, Yv = v => 800 - 80 * v;                                  // el termómetro
const IX = v => 540 + 120 * v;                                           // la fila de los enteros
const LX = v => 540 + 85 * v, LY = 880;                                  // la recta del espejo
const CZ = { x: 540, y: 860, r: 360 }, CN = { x: 680, y: 860, r: 170 };  // ℤ y ℕ

const FILM = {
  DUR: 118, endAt: 104.6,
  DT: [[30.2, 32.4], [56.4, 58.6], [82.4, 84.6]],
  dives: () => [
    { a: 30.2, b: 32.4, P: [RX(-1), ROW], r: 60, A: [540, 820] },
    { a: 56.4, b: 58.6, P: [IX(0), ROW], r: 58, A: [540, LY] },
    { a: 82.4, b: 84.6, P: [LX(2), LY], r: 60, A: [CN.x, CN.y] },
  ],
  open: { Z0: 2.6, C: AP[0], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.6, lock: 26.2, name: 'la resta', L: [330, 1330] },
    { fire: 53.0, lock: 53.6, name: 'el cero', L: [330, 1330] },
    { fire: 78.8, lock: 79.4, name: 'familias', L: [330, 1330] },
  ],
  stops: ['contar', 'la resta', 'el espejo', 'familias'],
  guide: {
    blinks: [7.6, 16.2, 23.4, 35.0, 45.0, 51.0, 61.8, 69.6, 77.0, 88.8, 96.4, 101.8, 112.0],
    smiles: [[8.4, 10.0], [20.0, 21.6], [50.8, 52.4], [71.0, 72.6], [110.0, 130]],
    wides: [[41.2, 42.6]],
    looks: [],
  },
};

// ---------- piezas ----------
function apple(p, x, y, r, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  el('path', { d: `M${x},${y - r * .78}Q${x + 6},${y - r * 1.15} ${x + 18},${y - r * 1.32}`, fill: 'none', stroke: C.creamD, 'stroke-width': 9, 'stroke-linecap': 'round' }, S);
  shaded(S, 'ellipse', { cx: x + r * .38, cy: y - r * 1.12, rx: r * .34, ry: r * .17, transform: `rotate(-24 ${x + r * .38} ${y - r * 1.12})` }, C.mint, C.mintD, 3, 3);
  shaded(S, 'path', { d: blobPath(polar(x, y, 24, a => r * (1 - .1 * Math.pow(Math.max(0, Math.sin(a)), 8) - .12 * Math.pow(Math.max(0, -Math.sin(a)), 14)))) }, C.coral, C.coralD, r * .16, r * .14);
  el('ellipse', { cx: x - r * .4, cy: y - r * .36, rx: r * .14, ry: r * .2, fill: C.cream, transform: `rotate(28 ${x - r * .4} ${y - r * .36})` }, S);
}
const NEG = [C.coral, C.coralD], ZERO = [C.sun, C.sunD], POS = [C.cream, C.creamD];
const tcol = v => v < 0 ? NEG : v === 0 ? ZERO : POS;
const minus = v => String(v).replace('-', '−');
function arrowLine(p, pts, k, col = C.sun, sw = 7) {
  if (k <= 0.01) return;
  const n = pts.length - 1, m = n * clamp(k), i = Math.min(n - 1, Math.floor(m)), f = m - i;
  const tip = [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
  const d = 'M' + pts.slice(0, i + 1).map(q => `${r1(q[0])},${r1(q[1])}`).join('L') + `L${r1(tip[0])},${r1(tip[1])}`;
  el('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  const a = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]), L = 26;
  el('path', { d: `M${r1(tip[0] - L * Math.cos(a - .5))},${r1(tip[1] - L * Math.sin(a - .5))}L${r1(tip[0])},${r1(tip[1])}L${r1(tip[0] - L * Math.cos(a + .5))},${r1(tip[1] - L * Math.sin(a + .5))}`, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}
const dots = (p, x, y, k, col = C.mist) => { if (k > 0.01) text(p, x, y + 20, '…', { 'font-size': r1(70 * k), 'font-weight': 700, fill: col, 'text-anchor': 'middle' }); };

// ---------- nivel 0 · contar ----------
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, AP[0][0], AP[0][1], 110, 160);
  const ka = 1 - eio(seg(t, 12.0, 12.6));
  AP.forEach(([x, y], i) => apple(G, x, y, 70, ka * (1 + .1 * wob(t, 7.0 + i * .6, 14, 6))));
  for (let i = 0; i < 3; i++) {                                          // 1, 2, 3 bajo las manzanas y luego a la fila
    const m = eio(seg(t, 12.4 + i * .12, 13.4 + i * .12));
    tile(G, lerp(AP[i][0], RX(i), m), lerp(860, ROW, m) - 60 * Math.sin(Math.PI * m), 96, String(i + 1), pop(t, 7.0 + i * .6));
  }
  for (let i = 3; i < 5; i++) tile(G, RX(i), ROW, 96, String(i + 1), pop(t, 14.0 + (i - 3) * .4));
  dots(G, RX(5) - 10, ROW, pop(t, 14.8));
  // el hueco a la izquierda del 1
  const kq = pop(t, 24.8);
  if (kq > 0.01) {
    el('rect', { x: r1(RX(-1) - 48 * kq), y: r1(ROW - 48 * kq), width: r1(96 * kq), height: r1(96 * kq), rx: r1(19 * kq), fill: 'none', stroke: C.sun, 'stroke-width': 5, 'stroke-dasharray': '12 10' }, G);
    text(G, RX(-1), r1(ROW + 22 * kq), '?', { 'font-size': r1(64 * kq), 'font-weight': 700, fill: C.sun, 'text-anchor': 'middle' });
  }
  riseFormula(G, t, 15.0, 18.6, 540, 1120, 64, [{ s: 'dN' }, '=', '{1, 2, 3, 4, …}']);
  riseFormula(G, t, 19.0, 24.4, 540, 1080, 60, ['3', '+', '4', '=', '7']);
  riseFormula(G, t, 21.6, 24.4, 540, 1200, 60, ['3', '×', '4', '=', '12']);
  badge(G, 760, 1058, life(t, 19.8, 24.4), true); badge(G, 790, 1178, life(t, 22.4, 24.4), true);
  riseFormula(G, t, 25.0, 999, 540, 1120, 64, ['2', '−', '5', '=', '?'], { colors: { '?': C.sun } });
}
// ---------- nivel 1 · la resta se escapa ----------
function level1(G, t) {
  starField(G, 17, 90);
  const ko = 1 - eio(seg(t, 47.4, 48.0));
  if (ko > 0.01) {
    const S = scaleAt(G, TX, 860, ko);
    shaded(S, 'rect', { x: TX - 36, y: Yv(4.2), width: 72, height: Yv(-3.6) - Yv(4.2), rx: 36 }, C.cream, C.creamD, 5, 5);
    shaded(S, 'circle', { cx: TX, cy: 1140, r: 70 }, C.cream, C.creamD, 6, 6);
    const lv = kf(t, [[33.4, 2], [38.4, 2], [41.2, -3]]);
    el('rect', { x: TX - 18, y: r1(Yv(lv)), width: 36, height: r1(1140 - Yv(lv)), rx: 18, fill: C.coral }, S);
    el('circle', { cx: TX, cy: 1140, r: 52, fill: C.coral }, S);
    for (let v = 3; v >= -3; v--) {
      el('rect', { x: TX + 44, y: Yv(v) - 3, width: 30, height: 6, rx: 3, fill: v === 0 ? C.sun : C.mist }, S);
      text(S, TX + 92, Yv(v) + 14, minus(v), { 'font-size': 40, 'font-weight': 600, fill: v === 0 ? C.sun : C.mist });
    }
    const lead = (v, s, t0, col) => { const k = pop(t, t0); if (k <= 0.01) return; el('circle', { cx: TX - 70, cy: Yv(v), r: r1(12 * k), fill: col }, S); text(S, TX - 96, Yv(v) + 16, s, { 'font-size': r1(46 * k), 'font-weight': 700, fill: col, 'text-anchor': 'end' }); };
    lead(2, '2 °C', 33.6, C.cream); lead(-3, '−3 °C', 41.2, C.coral);
    arrowLine(S, [[TX - 70, Yv(2) + 30], [TX - 90, Yv(-0.5)], [TX - 70, Yv(-3) - 30]], eio(seg(t, 35.8, 41.0)), C.sun, 6);
    const kb = pop(t, 36.0); if (kb > 0.01) text(S, 640, Yv(-0.2), 'baja 5', { 'font-size': r1(50 * kb), 'font-weight': 700, fill: C.sun });
  }
  riseFormula(G, t, 41.6, 44.2, 540, 1310, 62, ['2', '−', '5', '=', '−3']);
  riseFormula(G, t, 44.4, 47.4, 540, 1310, 66, ['−3', { s: 'notin' }, { s: 'dN' }], { fill: C.coral });
  // nacen los enteros
  for (let v = -3; v <= 3; v++) tile(G, IX(v), ROW, 92, minus(v), pop(t, 48.4 + Math.abs(v) * .3), tcol(v), C.night);
  dots(G, IX(-3.85), ROW, pop(t, 49.6)); dots(G, IX(3.85), ROW, pop(t, 49.6));
  const kl = eio(seg(t, 51.0, 51.8));                                    // los negativos y los naturales, señalados
  if (kl > 0.01) {
    el('rect', { x: r1(IX(-3) - 46), y: ROW + 66, width: r1((IX(-1) - IX(-3) + 92) * kl), height: 8, rx: 4, fill: C.coral }, G);
    el('rect', { x: r1(IX(1) - 46), y: ROW + 66, width: r1((IX(3) - IX(1) + 92) * kl), height: 8, rx: 4, fill: C.cream }, G);
    wipeText(G, IX(-2), ROW + 128, 'negativos', { 'font-size': 42, 'font-weight': 600, fill: C.coral, 'text-anchor': 'middle' }, kl, 48);
    wipeText(G, IX(2), ROW + 128, 'naturales', { 'font-size': 42, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, kl, 48);
  }
  riseFormula(G, t, 49.8, 999, 540, 1150, 54, [{ s: 'dZ' }, '=', '{…, −2, −1, 0, 1, 2, …}']);
}
// ---------- nivel 2 · el espejo del cero ----------
function level2(G, t) {
  starField(G, 29, 90);
  const kx = eio(seg(t, 58.6, 59.4));
  el('rect', { x: r1(540 - 470 * kx), y: LY - 3, width: r1(940 * kx), height: 6, rx: 3, fill: C.mist }, G);
  for (let v = -5; v <= 5; v++) {
    const k = pop(t, 58.8 + Math.abs(v) * .06); if (k <= 0.01) continue;
    el('rect', { x: LX(v) - 3, y: r1(LY - 16 * k), width: 6, height: r1(32 * k), rx: 3, fill: v === 0 ? C.sun : C.mist }, G);
    text(G, LX(v), LY + 62, minus(v), { 'font-size': r1(38 * k), 'font-weight': 600, fill: v === 0 ? C.sun : C.mist, 'text-anchor': 'middle' });
  }
  const km = eio(seg(t, 59.2, 59.9));                                    // el espejo
  if (km > 0.01) el('rect', { x: 536, y: r1(LY - 230 * km), width: 8, height: r1(400 * km), rx: 4, fill: C.sun }, G);
  // el 4 y su reflejo
  const k4 = pop(t, 61.8);
  if (k4 > 0.01) { el('circle', { cx: LX(4), cy: LY, r: r1(18 * k4), fill: C.cream }, G); text(G, LX(4), LY - 44, '4', { 'font-size': r1(56 * k4), 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle' }); }
  const m = eio(seg(t, 62.6, 63.8));
  if (m > 0.01) {
    const x = lerp(LX(4), LX(-4), m), y = LY - 190 * Math.sin(Math.PI * m);
    const arc = []; for (let j = 0; j <= 24; j++) { const q = m * j / 24; arc.push([lerp(LX(4), LX(-4), q), LY - 190 * Math.sin(Math.PI * q)]); }
    el('path', { d: 'M' + arc.map(q => `${r1(q[0])},${r1(q[1])}`).join('L'), fill: 'none', stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '6 10', 'stroke-linecap': 'round' }, G);
    el('circle', { cx: r1(x), cy: r1(y), r: 18, fill: m < 1 ? C.cream : C.coral }, G);
    if (m >= 1) text(G, LX(-4), LY - 44, '−4', { 'font-size': 56, 'font-weight': 700, fill: C.coral, 'text-anchor': 'middle' });
  }
  const kd = eio(seg(t, 64.6, 65.4)) * (1 - eio(seg(t, 70.0, 70.4)));   // a cuatro pasos de cada lado
  if (kd > 0.01) {
    el('rect', { x: r1(540 - (540 - LX(-4)) * kd), y: LY + 96, width: r1((540 - LX(-4)) * kd), height: 8, rx: 4, fill: C.coral }, G);
    el('rect', { x: 540, y: LY + 96, width: r1((LX(4) - 540) * kd), height: 8, rx: 4, fill: C.cream }, G);
    wipeText(G, LX(-2), LY + 152, '4 pasos', { 'font-size': 40, 'font-weight': 600, fill: C.coral, 'text-anchor': 'middle' }, kd, 46);
    wipeText(G, LX(2), LY + 152, '4 pasos', { 'font-size': 40, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, kd, 46);
  }
  riseFormula(G, t, 67.2, 70.2, 540, 1190, 54, ['−(4) = −4', '·', '−(−4) = 4']);
  riseFormula(G, t, 70.6, 73.2, 540, 1190, 62, ['4', '+', '(−4)', '=', '0']);
  riseFormula(G, t, 73.6, 76.0, 540, 1190, 62, ['−0', '=', '0'], { fill: C.sun });
  const use = (x, y, s, t0) => chip(G, x, y, s, life(t, t0, 82.0) * (1 + .1 * wob(t, t0, 14, 6)), NEG, C.night, 40);
  use(320, 600, 'bajo el mar: −10 m', 76.6); use(800, 600, 'deuda: −$3 000', 79.6);
}
// ---------- nivel 3 · una familia dentro de otra ----------
const NT = [['1', 620, 920], ['2', 745, 880], ['3', 690, 1000]], ZT = [['0', 420, 720], ['−1', 300, 880], ['−4', 400, 1040], ['−10', 520, 1150]];
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 104.6, 105.2)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  const kz = eo(seg(t, 86.4, 87.2));
  if (kz > 0.01) el('circle', { cx: CZ.x, cy: CZ.y, r: r1(CZ.r * kz), fill: C.n2 }, S);
  el('circle', { cx: CN.x, cy: CN.y, r: CN.r, fill: C.n3 }, S);
  lasso(S, CN.x, CN.y, CN.r, CN.r, eio(seg(t, 84.8, 85.8)), C.cream, 6);
  lasso(S, CZ.x, CZ.y, CZ.r, CZ.r, eio(seg(t, 86.4, 87.4)), C.coral, 6);
  const kN = pop(t, 85.6), kZ = pop(t, 87.2);
  if (kN > 0.01) sym(S, 'dN', CN.x - 30, CN.y - 70, 70 * kN, C.cream);
  if (kZ > 0.01) sym(S, 'dZ', 296, 650, 80 * kZ, C.coral);
  NT.forEach(([s, x, y], i) => tile(S, x, y, 78, s, pop(t, 85.8 + i * .2) * (1 + .12 * wob(t, 88.8 + i * .12, 16, 6)), POS));
  ZT.forEach(([s, x, y], i) => tile(S, x, y, s.length > 2 ? 96 : 78, s, pop(t, 87.6 + i * .2) * (1 + .12 * wob(t, 91.6 + i * .12, 16, 6)), s === '0' ? ZERO : NEG, C.night));
  riseFormula(S, t, 95.2, 98.4, 540, 1340, 80, [{ s: 'dN' }, { s: 'sube' }, { s: 'dZ' }], { fill: C.sun });
  riseFormula(S, t, 98.8, 104.4, 540, 1340, 52, [{ s: 'dZ' }, '−', { s: 'dN' }, '=', '{0, −1, −2, …}']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(840 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Los números', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'naturales y enteros', { 'font-size': 84, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.2, 'CONTAR', 'una, dos, tres manzanas', 'así nacen los naturales');
  label(p, t, 12.6, 18.4, 'LOS NATURALES', 'empiezan en 1, uno tras otro', 'el cero no es natural');
  label(p, t, 18.8, 24.4, 'SUMAR Y MULTIPLICAR', 'el resultado es natural', 'son «cerrados» para + y ×');
  label(p, t, 24.8, 30.0, '¿Y SI RESTAMOS?', 'dos menos cinco…', 'a la izquierda del 1 no hay nada');
  label(p, t, 32.8, 38.2, 'EL TERMÓMETRO', 'marca dos grados', 'y la temperatura baja cinco');
  label(p, t, 41.0, 47.2, 'LA RESTA SE ESCAPA', 'llega a menos tres', 'y −3 no sirve para contar');
  label(p, t, 47.6, 52.8, 'LOS ENTEROS', 'naturales, cero y negativos', 'ahora toda resta tiene respuesta');
  label(p, t, 59.0, 64.2, 'EL ESPEJO DEL CERO', 'el 4 y su reflejo, el −4', 'cada uno de un lado');
  label(p, t, 64.4, 70.2, 'EL OPUESTO', 'el − delante pide el opuesto', 'el opuesto de −4 es 4');
  label(p, t, 70.4, 76.0, 'SUMAN CERO', 'un número y su opuesto', 'el 0 es su propio reflejo');
  label(p, t, 76.2, 82.0, 'PARA QUÉ SIRVEN', 'lo que está por debajo', 'del mar, o lo que se debe');
  label(p, t, 85.0, 90.6, 'UNA FAMILIA DENTRO DE OTRA', 'los naturales viven en los enteros', 'todo natural es entero');
  label(p, t, 91.0, 96.4, 'AFUERA DE LOS NATURALES', 'el cero y los negativos', 'son enteros, pero no naturales');
  label(p, t, 96.8, 104.2, 'CONTENIDO', 'los naturales caben en los enteros', 'lo que sobra: el cero y los negativos');
};
FILM.summary = (p, t) => summaryList(p, t, 105.2, 'En resumen', [
  ['NATURALES · CONTAR', [{ s: 'dN' }, '= {1, 2, 3, …}']],
  ['ENTEROS · RESTAR', [{ s: 'dZ' }, '= {…, −1, 0, 1, …}']],
  ['EL OPUESTO · EL ESPEJO', ['4 + (−4) = 0']],
  ['UNA DENTRO DE OTRA', [{ s: 'dN' }, { s: 'sube' }, { s: 'dZ' }]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 3; i++) ev.push({ t: 7.0 + i * .6, type: 'count', i });
  ev.push({ t: 12.0, type: 'away', d: .6 });
  for (let i = 0; i < 3; i++) ev.push({ t: 12.4 + i * .12, type: 'fly', d: 1.0 });
  ev.push({ t: 14.0, type: 'tile', i: 3 }, { t: 14.4, type: 'tile', i: 4 }, { t: 14.8, type: 'pop', i: 0 }, { t: 15.0, type: 'rise' });
  ev.push({ t: 19.0, type: 'rise' }, { t: 19.8, type: 'yes' }, { t: 21.6, type: 'rise' }, { t: 22.4, type: 'yes' }, { t: 24.8, type: 'pop', i: 1 }, { t: 25.0, type: 'rise' });
  ev.push({ t: 33.6, type: 'pop', i: 0 }, { t: 35.8, type: 'slide', d: 5.2 }, { t: 41.2, type: 'no' }, { t: 41.6, type: 'rise' }, { t: 44.4, type: 'rise' }, { t: 47.4, type: 'away', d: .6 });
  for (let v = 0; v <= 3; v++) ev.push({ t: 48.4 + v * .3, type: 'tile', i: v });
  ev.push({ t: 49.8, type: 'rise' }, { t: 51.0, type: 'paint', d: .8 });
  ev.push({ t: 59.2, type: 'lasso', d: .7 }, { t: 61.8, type: 'pop', i: 0 }, { t: 62.6, type: 'fly', d: 1.2 }, { t: 63.8, type: 'pop', i: 1 }, { t: 64.6, type: 'paint', d: .8 });
  ev.push({ t: 67.2, type: 'rise' }, { t: 70.6, type: 'rise' }, { t: 71.4, type: 'yes' }, { t: 73.6, type: 'rise' }, { t: 76.6, type: 'card' }, { t: 79.6, type: 'card' });
  ev.push({ t: 84.8, type: 'lasso', d: 1.0 }, { t: 86.4, type: 'lasso', d: 1.0 });
  for (let i = 0; i < 3; i++) ev.push({ t: 85.8 + i * .2, type: 'tile', i });
  for (let i = 0; i < 4; i++) ev.push({ t: 87.6 + i * .2, type: 'tile', i: i + 3 });
  ev.push({ t: 88.8, type: 'merge', i: 0 }, { t: 91.6, type: 'merge', i: 1 }, { t: 95.2, type: 'rise' }, { t: 98.8, type: 'rise' });
  ev.push({ t: 104.6, type: 'away', d: .6 }, { t: 105.2, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 105.8 + k * .55, type: 'stop', i: k });
  ev.push({ t: 108.4, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Empecemos por lo más simple: contar.'],
  [4.0, 6.4, 'Aquí hay tres manzanas.'],
  [6.8, 9.8, 'Una, dos, tres: así contamos.'],
  [10.0, 12.4, 'Esos números se llaman naturales.'],
  [12.8, 15.6, 'Empiezan en uno: el cero no cuenta nada.'],
  [15.8, 18.6, 'Siempre hay uno más: la lista no termina.'],
  [19.0, 21.8, 'Si sumas dos naturales, te da otro natural.'],
  [22.0, 24.6, 'Si los multiplicas, también.'],
  [24.8, 27.6, 'Pero, ¿y si restamos?'],
  [27.8, 30.2, 'Dos menos cinco no tiene casilla aquí.'],
  [32.8, 35.4, 'Un termómetro marca dos grados.'],
  [35.6, 38.2, 'Y la temperatura baja cinco.'],
  [38.4, 41.0, 'Pasa por el cero y sigue bajando.'],
  [41.2, 44.0, 'Llega a menos tres: dos menos cinco.'],
  [44.2, 47.2, 'Menos tres no cuenta objetos: no es natural.'],
  [47.6, 50.6, 'Para que toda resta funcione, nacen los enteros.'],
  [50.8, 53.6, 'Los naturales, el cero y los negativos.'],
  [53.8, 56.2, 'Entremos al cero.'],
  [59.0, 61.4, 'El cero hace de espejo.'],
  [61.6, 64.2, 'El cuatro tiene su reflejo: menos cuatro.'],
  [64.4, 66.8, 'Los dos, a cuatro pasos del cero.'],
  [67.0, 70.2, 'El signo menos delante pide el opuesto.'],
  [70.4, 73.2, 'Un número y su opuesto suman cero.'],
  [73.4, 76.0, 'Y el cero es su propio reflejo.'],
  [76.2, 79.2, 'Los negativos miden lo que está por debajo:'],
  [79.4, 82.2, 'bajo el nivel del mar, o una deuda.'],
  [85.0, 88.4, 'Los naturales no desaparecen: viven dentro de los enteros.'],
  [88.6, 91.0, 'Todo natural también es entero.'],
  [91.2, 94.8, 'Pero el cero y los negativos no son naturales.'],
  [95.0, 98.4, 'Por eso decimos: los naturales están contenidos en los enteros.'],
  [98.6, 102.2, 'Quita los naturales y quedan el cero y los negativos.'],
  [105.6, 109.8, 'Los naturales sirven para contar; los enteros, también para restar.'],
  [110.0, 114.4, 'Y cada entero tiene su reflejo al otro lado del cero.'],
];
