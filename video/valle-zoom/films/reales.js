// «Irracionales y reales» (lección alg-11c de Zuka, Valle de los Números, video 3) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (dos cuadritos que forman uno de área 2, 1.4² = 1.96, 1.42² ≈ 2.0164, la rueda
// de un metro y π = 3.14159…, √3, −3/7, −6 y 8 en el mapa), que tests/sistemas-numericos.test.js mantiene fuera de los ejercicios.
// Niveles: 0 el cuadrado (área 2) → 1 por el lado: acorralar √2 → 2 por π: la rueda → 3 dentro de la rueda: el mapa de los
// números → 4 por √3: la recta real, sin huecos.
const POSTER = 47.6;
const SA = 220, O = [540, 900];
const TRI = [                                                            // [R inicial, α (grados), color] → R final = O
  [[540, 650], 90, ZERO], [[320, 870], 270, ZERO], [[540, 650], 0, MINT], [[760, 870], 180, MINT]];
const DOOR0 = [682, 758];
const X1 = v => 260 + (v - 1) * 560, R2 = Math.SQRT2;
const WR = 110, WY = 890, WX0 = 170, WX1 = WX0 + Math.PI * 2 * WR;
const QC = { x: 420, y: 920, r: 270 }, ZC = { x: 455, y: 970, r: 175 }, NC = { x: 490, y: 1010, r: 90 }, IB = [730, 600, 210, 640];
const X4 = v => 540 + 200 * v;

const FILM = {
  DUR: 138, endAt: 124.2,
  DT: [[29.4, 31.6], [57.6, 59.8], [79.6, 81.8], [105.6, 107.8]],
  dives: () => [
    { a: 29.4, b: 31.6, P: DOOR0, r: 62, A: [X1(R2), 900] },
    { a: 57.6, b: 59.8, P: [780, 1180], r: 75, A: [WX0, WY] },
    { a: 79.6, b: 81.8, P: [WX1, WY], r: 120, A: [IB[0] + IB[2] / 2, IB[1] + IB[3] / 2] },
    { a: 105.6, b: 107.8, P: [835, 1160], r: 70, A: [X4(Math.sqrt(3)), 900] },
  ],
  open: { Z0: 2.2, C: [430, 760], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.4, lock: 26.0, name: 'el lado', L: [330, 1530] },
    { fire: 54.0, lock: 54.6, name: 'pi', L: [330, 1530] },
    { fire: 75.8, lock: 76.4, name: 'el mapa', L: [330, 1530] },
    { fire: 101.9, lock: 102.5, name: 'la recta', L: [330, 1530] },
  ],
  stops: ['el cuadrado', 'raíz de 2', 'pi', 'el mapa', 'la recta'],
  guide: {
    blinks: [7.6, 12.0, 19.4, 24.0, 35.4, 41.2, 49.6, 63.4, 70.2, 85.6, 92.0, 98.0, 111.0, 118.0, 130.0],
    smiles: [[16.2, 17.8], [47.4, 49.0], [67.4, 69.0], [101.0, 102.4], [116.0, 117.4], [128.0, 150]],
    wides: [[44.6, 46.0], [96.2, 97.6]],
    looks: [],
  },
};

// ---------- nivel 0 · el cuadrado ----------
const u = a => [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)];
function triPath(R, a) { const [p, q] = [u(a), u(a + 90)]; return `M${r1(R[0])},${r1(R[1])}L${r1(R[0] + SA * p[0])},${r1(R[1] + SA * p[1])}L${r1(R[0] + SA * q[0])},${r1(R[1] + SA * q[1])}Z`; }
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, 430, 760, 190, 260);
  TRI.forEach(([R, a, col], i) => {
    const sq = Math.floor(i / 2) === 0 ? 0 : 1, k = 1 + .1 * wob(t, 6.8 + sq * .6, 14, 6);
    if (k <= 0.01) return;
    const sp = eio(seg(t, 13.6, 14.2)) * (1 - eio(seg(t, 14.4 + i * .2, 15.4 + i * .2)));   // se separan un poco y viajan
    const m = eio(seg(t, 14.4 + i * .2, 15.4 + i * .2)), c = [R[0] + SA * (u(a)[0] + u(a + 90)[0]) / 3, R[1] + SA * (u(a)[1] + u(a + 90)[1]) / 3];
    const ctr = sq ? [650, 760] : [430, 760], dx = (c[0] - ctr[0]) * .12 * sp, dy = (c[1] - ctr[1]) * .12 * sp;
    const Rn = [lerp(R[0], O[0], m) + dx, lerp(R[1], O[1], m) + dy - 90 * Math.sin(Math.PI * m)];
    const S = scaleAt(G, ctr[0], ctr[1], m > 0 ? 1 : k);
    el('path', { d: triPath(Rn, a), fill: col[0], stroke: col[1], 'stroke-width': 6, 'stroke-linejoin': 'round' }, S);
  });
  const kd = eio(seg(t, 12.6, 13.4)) * (1 - eio(seg(t, 13.6, 13.8)));     // los cortes, en diagonal
  if (kd > 0.01) {
    el('path', { d: `M320,650L${r1(lerp(320, 540, kd))},${r1(lerp(650, 870, kd))}`, stroke: C.night, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': '14 12' }, G);
    el('path', { d: `M760,650L${r1(lerp(760, 540, kd))},${r1(lerp(650, 870, kd))}`, stroke: C.night, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': '14 12' }, G);
  }
  const ka = life(t, 8.0, 12.4);
  tag(G, 430, 778, 'área 1', ka, C.night, 44); tag(G, 650, 778, 'área 1', ka, C.night, 44);
  tag(G, O[0], O[1] + 16, 'área 2', pop(t, 16.4), C.night, 52);
  // el lado: ?
  const kq = pop(t, 18.0) * (1 + .12 * wob(t, 25.4, 14, 6));
  if (kq > 0.01) { el('circle', { cx: DOOR0[0], cy: DOOR0[1], r: r1(40 * kq), fill: C.night, stroke: C.sun, 'stroke-width': 5 }, G); tag(G, DOOR0[0], DOOR0[1] + 22, '?', kq, C.sun, 62); }
  riseFormula(G, t, 22.6, 999, 540, 1300, 72, ['lado', '×', 'lado', '=', '2'], { colors: { '2': C.sun } });
}
// ---------- nivel 1 · acorralar √2 ----------
const ROWS = [
  [34.2, ['1', { sup: '2' }, '=', '1'], ['2', { sup: '2' }, '=', '4']],
  [39.2, ['1.4', { sup: '2' }, '=', '1.96'], ['1.5', { sup: '2' }, '=', '2.25']],
  [43.6, ['1.41', { sup: '2' }, '=', '1.9881'], ['1.42', { sup: '2' }, '=', '2.0164']],
];
function level1(G, t) {
  starField(G, 17, 90);
  const lo = kf(t, [[33.6, 1], [39.4, 1], [40.6, 1.4], [43.8, 1.4], [45.0, 1.41]]), hi = kf(t, [[33.6, 2], [40.2, 2], [41.4, 1.5], [44.6, 1.5], [45.8, 1.42]]);
  const ki = eio(seg(t, 33.6, 34.4));
  if (ki > 0.01) {
    el('rect', { x: r1(X1(lo)), y: 872, width: r1((X1(hi) - X1(lo)) * ki), height: 56, rx: 10, fill: C.n3 }, G);
    for (const v of [lo, hi]) el('rect', { x: r1(X1(v) - 5), y: 856, width: 10, height: 88, rx: 5, fill: C.sun }, G);
  }
  numLine(G, t, 32.0, X1, 900, 1, 2, { step: .1, labels: false });
  [[1, '1'], [1.5, '1.5'], [2, '2']].forEach(([v, s]) => tag(G, X1(v), 970, s, pop(t, 32.4), C.mist, 44));
  const kr = out(t, 51.6);
  if (kr > 0.01) {
    const S = scaleAt(G, 540, 1180, kr);
    tag(S, 300, 1030, 'le falta', pop(t, 34.0), C.mint, 42); tag(S, 780, 1030, 'se pasa', pop(t, 34.8), C.coral, 42);
    ROWS.forEach(([t0, L, R], j) => {
      riseFormula(S, t, t0, 999, 300, 1110 + j * 88, 48, L, { fill: C.mint });
      riseFormula(S, t, t0 + .8, 999, 780, 1110 + j * 88, 48, R, { fill: C.coral });
    });
  }
  mark(G, X1(R2), 900, '√2', pop(t, 47.0) * (1 + .12 * wob(t, 47.0, 14, 6)), C.sun);
  riseFormula(G, t, 47.4, 999, 540, 690, 70, ['√2', '=', '1.41421356…'], { fill: C.sun });
  [['√3', 300, NEG], ['√19', 540, POS], ['π', 780, ZERO]].forEach(([s, x, c], i) =>
    chip(G, x, 1180, s, pop(t, 52.2 + i * .4) * (1 + .12 * wob(t, i === 2 ? 54.0 : 99, 14, 6)), c, C.night, 54));
}
// ---------- nivel 2 · la rueda de π ----------
function level2(G, t) {
  starField(G, 29, 90);
  const cx = kf(t, [[62.8, WX0], [67.0, WX1]]), th = (cx - WX0) / WR, gy = WY + WR;
  el('rect', { x: 70, y: gy - 3, width: 940, height: 6, rx: 3, fill: C.mist }, G);
  for (let k = 0; k <= 4; k++) {
    const x = WX0 + 2 * WR * k; if (x > 1000) break;
    el('rect', { x: x - 3, y: gy - 14, width: 6, height: 28, rx: 3, fill: C.mist }, G);
    tag(G, x, gy + 58, k ? `${k} m` : '0', pop(t, 61.2 + k * .15), C.mist, 38);
  }
  if (cx > WX0 + 1) el('rect', { x: WX0, y: gy - 5, width: r1(cx - WX0), height: 10, rx: 5, fill: C.sun }, G);
  // la rueda
  shaded(G, 'circle', { cx: r1(cx), cy: WY, r: WR }, C.blue, C.blueD, 8, 8);
  el('circle', { cx: r1(cx), cy: WY, r: WR - 22, fill: C.n3 }, G);
  for (let k = 0; k < 4; k++) { const a = th + k * Math.PI / 2; capsule(G, cx, WY, cx - (WR - 24) * Math.sin(a), WY + (WR - 24) * Math.cos(a), 8, C.mist); }
  el('circle', { cx: r1(cx), cy: WY, r: 16, fill: C.cream }, G);
  el('circle', { cx: r1(cx - WR * Math.sin(th)), cy: r1(WY + WR * Math.cos(th)), r: 14, fill: C.coral }, G);
  const kdm = life(t, 60.8, 62.6);
  if (kdm > 0.01) { capsule(G, WX0, WY - WR, WX0, WY + WR, 8 * kdm, C.sun); tag(G, WX0 + 140, WY + 14, '1 m', kdm, C.sun, 48); }
  const ke = pop(t, 67.2);
  if (ke > 0.01) { el('rect', { x: r1(WX1 - 4), y: gy - 30, width: 8, height: 60, rx: 4, fill: C.coral }, G); tag(G, WX1 - 10, gy + 120, '3.14159… m', ke, C.coral, 46); }
  riseFormula(G, t, 67.8, 73.2, 540, 1320, 88, ['π', '=', '3.14159…'], { fill: C.sun });
  riseFormula(G, t, 73.6, 999, 540, 1320, 88, ['π', { s: 'notin' }, { s: 'dQ' }], { fill: C.coral });
}
// ---------- nivel 3 · el mapa de los números ----------
const EX = [['8', NC.x, 1052, POS, 100.4], ['−6', 380, 900, NEG, 100.9], ['−3/7', 240, 1000, NEG, 101.4], ['√3', 835, 1160, ZERO, 101.9]];
function level3(G, t) {
  starField(G, 43, 90);
  const kr = eio(seg(t, 88.6, 89.8));
  el('rect', { x: 110, y: 560, width: 860, height: 720, rx: 40, fill: C.n2 }, G);
  if (kr > 0.01) el('rect', { x: 110, y: 560, width: 860, height: 720, rx: 40, fill: 'none', stroke: C.cream, 'stroke-width': 6, pathLength: 1, 'stroke-dasharray': `${kr.toFixed(4)} 2` }, G);
  const kR = pop(t, 89.4); if (kR > 0.01) sym(G, 'dR', 140, 650, 70 * kR, C.cream);
  // irracionales
  shaded(G, 'rect', { x: IB[0], y: IB[1], width: IB[2], height: IB[3], rx: 36 }, C.n3, C.n3, 0, 0);
  sym(G, 'dI', 805, 690, 66, C.sun);
  chip(G, 835, 820, '√2', pop(t, 80.0), ZERO, C.night, 50); chip(G, 835, 960, 'π', pop(t, 80.3), ZERO, C.night, 50);
  // racionales, enteros, naturales
  const kq = eo(seg(t, 83.0, 83.8)), kz = eo(seg(t, 83.6, 84.4)), kn = eo(seg(t, 84.2, 85.0));
  if (kq > 0.01) el('circle', { cx: QC.x, cy: QC.y, r: r1(QC.r * kq), fill: C.n3 }, G);
  if (kz > 0.01) el('circle', { cx: ZC.x, cy: ZC.y, r: r1(ZC.r * kz), fill: C.n2 }, G);
  if (kn > 0.01) el('circle', { cx: NC.x, cy: NC.y, r: r1(NC.r * kn), fill: C.blueD }, G);
  lasso(G, QC.x, QC.y, QC.r, QC.r, eio(seg(t, 83.0, 84.0)), C.mint, 6);
  lasso(G, ZC.x, ZC.y, ZC.r, ZC.r, eio(seg(t, 83.6, 84.6)), C.coral, 6);
  lasso(G, NC.x, NC.y, NC.r, NC.r, eio(seg(t, 84.2, 85.2)), C.cream, 6);
  const sQ = pop(t, 84.0), sZ = pop(t, 84.6), sN = pop(t, 85.2);
  if (sQ > 0.01) sym(G, 'dQ', 175, 830, 70 * sQ, C.mint);
  if (sZ > 0.01) sym(G, 'dZ', 330, 1080, 64 * sZ, C.coral);
  if (sN > 0.01) sym(G, 'dN', 474, 985, 52 * sN, C.cream);
  EX.forEach(([s, x, y, c, t0]) => {
    const m = eio(seg(t, t0, t0 + .7)); if (t < t0) return;
    const xx = lerp(540, x, m), yy = lerp(500, y, m) - 80 * Math.sin(Math.PI * m), k = 1 + .14 * wob(t, t0 + .7, 14, 6) + (s === '√3' ? .12 * wob(t, 101.9, 14, 6) : 0);
    if (s === '−3/7') fracTile(G, xx, yy, 76, '−3', '7', k, c);
    else chip(G, xx, yy, s, k, c, C.night, s === '8' ? 50 : 46);
  });
  riseFormula(G, t, 88.8, 94.2, 440, 1400, 72, [{ s: 'dR' }, '=', { s: 'dQ' }, { s: 'cup' }, { s: 'dI' }], { fill: C.sun });
  riseFormula(G, t, 94.6, 100.2, 440, 1400, 72, [{ s: 'dQ' }, { s: 'cap' }, { s: 'dI' }, '=', '∅'], { fill: C.sun });
}
// ---------- nivel 4 · la recta real ----------
// la cámara se acerca a [1, 2] (FILM.tweak); lo que se dibuja aquí divide sus tamaños entre Z4 para verse igual
const Z4 = t => lerp(1, 3.2, eio(seg(t, 113.4, 115.0)));
function level4(G, t) {
  starField(G, 53, 90);
  const ko = 1 - eio(seg(t, 124.2, 124.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko), z = Z4(t), y = 900;
  const kx = eio(seg(t, 103.0, 103.7));
  if (kx > 0.01) el('rect', { x: r1(lerp(540, X4(-2) - 60, kx)), y: r1(y - 3 / z), width: r1((X4(2) - X4(-2) + 120) * kx), height: r1(6 / z), rx: r1(3 / z), fill: C.mist }, S);
  const kp = eio(seg(t, 109.0, 110.6)) * out(t, 113.2);
  if (kp > 0.01) el('rect', { x: X4(-2) - 60, y: 894, width: r1((X4(2) - X4(-2) + 120) * kp), height: 12, rx: 6, fill: C.sun }, S);
  for (let v = -2; v <= 2; v++) {
    const k = pop(t, 103.2 + Math.abs(v) * .08); if (k <= 0.01) continue;
    const c = v === 0 ? C.sun : C.mist;
    el('rect', { x: r1(X4(v) - 3 / z), y: r1(y - 16 * k / z), width: r1(6 / z), height: r1(32 * k / z), rx: r1(3 / z), fill: c }, S);
    tag(S, X4(v), y + 58 / z, minus(v), k, c, 38 / z);
  }
  const kd = eio(seg(t, 114.6, 115.4));                                   // décimas entre 1 y 2, como en una regla
  if (kd > 0.01) for (let j = 1; j < 10; j++) el('rect', { x: r1(X4(1 + j / 10) - 2 / z), y: r1(y - 9 * kd / z), width: r1(4 / z), height: r1(18 * kd / z), fill: C.n3 }, S);
  const km = out(t, 112.8);
  mark(S, X4(Math.sqrt(3)), y, '√3', pop(t, 104.0) * km, C.sun);
  mark(S, X4(-3 / 7), y, '−3/7', pop(t, 108.4) * km, C.coral);
  const MID = [[115.4, 1, 2, 1.5, 90], [117.2, 1, 1.5, 1.25, 170], [119.0, 1, 1.25, 1.125, 250]];
  MID.forEach(([t0, a, b, m, ly]) => {
    const kh = eio(seg(t, t0, t0 + .8)); if (kh <= 0.01) return;
    hop(S, X4(a), X4(m), y, 50 / z, kh, C.mint, 5 / z); hop(S, X4(b), X4(m), y, 50 / z, kh, C.mint, 5 / z);
    const k = pop(t, t0 + .8); if (k <= 0.01) return;
    el('circle', { cx: r1(X4(m)), cy: y, r: r1(12 * k / z), fill: C.cream }, S);
    el('rect', { x: r1(X4(m) - 2 / z), y: r1(y - ly / z + 14 / z), width: r1(4 / z), height: r1((ly - 44) * k / z), fill: C.cream }, S);
    tag(S, X4(m), y - ly / z, String(m), k, C.cream, 46 / z);
  });
  dots(S, X4(1.03), y - 430 / z, pop(t, 120.6) / z, C.cream);
}
FILM.tweak = (i, t, c) => {
  if (i !== 4) return c;
  const k = eio(seg(t, 113.4, 115.0));
  return { z: c.z * Z4(t), C: [lerp(c.C[0], X4(1.38), k), lerp(c.C[1], 860, k)] };
};
FILM.levels = [level0, level1, level2, level3, level4];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(840 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Irracionales', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y reales', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.2, 'UN EXPERIMENTO', 'dos cuadritos de área 1', '¿un solo cuadrado de área 2?');
  label(p, t, 12.6, 18.2, 'CORTAR Y ARMAR', 'cada uno, por su diagonal', 'las cuatro mitades, juntas');
  label(p, t, 18.6, 24.4, 'ÁREA 2', 'lo mismo que los dos cuadritos', 'pero ¿cuánto mide su lado?');
  label(p, t, 24.8, 29.2, 'EL LADO', 'un número que al cuadrado dé 2', 'vamos a buscarlo');
  label(p, t, 32.4, 38.6, 'ACORRALARLO', 'uno es poco: da 1', 'dos es mucho: da 4');
  label(p, t, 39.0, 45.0, 'MÁS CERCA', '1.4 queda corto, 1.5 se pasa', 'y con dos cifras, igual');
  label(p, t, 45.4, 51.4, 'NUNCA EXACTO', 'ninguna fracción al cuadrado da 2', 'es un número nuevo: raíz de 2');
  label(p, t, 51.8, 57.4, 'IRRACIONALES', 'nunca terminan, nunca se repiten', 'y hay infinitos');
  label(p, t, 60.6, 66.6, 'UNA RUEDA', 'de un metro de ancho', 'da una vuelta completa');
  label(p, t, 67.0, 73.2, 'AVANZA', 'un poco más de tres metros', 'esa distancia es pi');
  label(p, t, 73.6, 79.4, 'TAMPOCO ES FRACCIÓN', 'pi también es irracional', 'salen en diagonales y curvas');
  label(p, t, 82.2, 88.2, 'EL MAPA', 'racionales a un lado', 'irracionales al otro');
  label(p, t, 88.6, 94.2, 'LOS REALES', 'todos juntos son los reales', 'racionales unidos con irracionales');
  label(p, t, 94.6, 100.2, 'NADA EN COMÚN', 'un número es fracción o no lo es', 'los dos grupos son disjuntos');
  label(p, t, 100.6, 106.2, 'CADA UNO EN SU CASA', 'la bolsa más pequeña donde cabe', 'y todas las que la rodean');
  label(p, t, 108.2, 114.0, 'LA RECTA REAL', 'a cada punto, un número real', 'la recta no tiene huecos');
  label(p, t, 114.4, 120.2, 'SIEMPRE CABE OTRO', 'entre dos reales distintos', 'por ejemplo, el de la mitad');
  label(p, t, 120.6, 124.2, 'SIN FIN', 'y entre esos, otro más');
};
FILM.summary = (p, t) => summaryList(p, t, 124.8, 'En resumen', [
  ['IRRACIONALES', 'nunca terminan ni se repiten'],
  ['LOS REALES', [{ s: 'dR' }, '=', { s: 'dQ' }, { s: 'cup' }, { s: 'dI' }]],
  ['NADA EN COMÚN', [{ s: 'dQ' }, { s: 'cap' }, { s: 'dI' }, '=', '∅']],
  ['LA RECTA REAL', 'llena, sin huecos'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 6.8, type: 'tile', i: 0 }, { t: 7.4, type: 'tile', i: 1 }, { t: 8.0, type: 'pop', i: 0 }];
  ev.push({ t: 12.6, type: 'paint', d: .8 }, { t: 13.6, type: 'pop', i: 1 });
  for (let i = 0; i < 4; i++) ev.push({ t: 14.4 + i * .2, type: 'fly', d: 1.0 }, { t: 15.4 + i * .2, type: 'tile', i: i + 2 });
  ev.push({ t: 16.4, type: 'yes' }, { t: 18.0, type: 'pop', i: 2 }, { t: 22.6, type: 'rise' });
  ev.push({ t: 32.0, type: 'line', d: .7 }, { t: 33.6, type: 'slide', d: .8 });
  ROWS.forEach(([t0], j) => ev.push({ t: t0, type: 'rise' }, { t: t0 + .8, type: 'rise' }, { t: t0 + 1.0, type: 'no' }));
  ev.push({ t: 39.4, type: 'slide', d: 2.0 }, { t: 43.8, type: 'slide', d: 2.0 }, { t: 47.0, type: 'pop', i: 3 }, { t: 47.4, type: 'rise' }, { t: 51.6, type: 'away', d: .4 });
  for (let i = 0; i < 3; i++) ev.push({ t: 52.2 + i * .4, type: 'tile', i });
  ev.push({ t: 60.8, type: 'pop', i: 0 }, { t: 62.8, type: 'slide', d: 4.2 }, { t: 67.2, type: 'hit' }, { t: 67.8, type: 'rise' }, { t: 73.6, type: 'rise' }, { t: 74.0, type: 'no' });
  ev.push({ t: 83.0, type: 'lasso', d: 1.0 }, { t: 83.6, type: 'lasso', d: 1.0 }, { t: 84.2, type: 'lasso', d: 1.0 }, { t: 88.6, type: 'lasso', d: 1.2 }, { t: 88.8, type: 'rise' }, { t: 94.6, type: 'rise' });
  EX.forEach(([, , , , t0], i) => ev.push({ t: t0, type: 'fly', d: .7 }, { t: t0 + .7, type: 'tile', i }));
  ev.push({ t: 103.0, type: 'line', d: .7 }, { t: 109.0, type: 'paint', d: 1.6 });
  for (const t0 of [115.0, 116.8, 118.6]) ev.push({ t: t0, type: 'slide', d: .8 }, { t: t0 + .8, type: 'pop', i: 1 });
  ev.push({ t: 120.4, type: 'rise' }, { t: 124.2, type: 'away', d: .6 }, { t: 124.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 125.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 128.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Hasta ahora, todo número era una fracción.'],
  [4.0, 6.4, 'Hagamos un experimento.'],
  [6.8, 9.6, 'Dos cuadritos, cada uno de área uno.'],
  [9.8, 12.4, 'Queremos un solo cuadrado de área dos.'],
  [12.8, 15.4, 'Cortamos cada uno por su diagonal.'],
  [15.6, 18.2, 'Y con las cuatro mitades armamos uno nuevo.'],
  [18.6, 21.4, 'Su área es dos, como los dos cuadritos.'],
  [21.6, 24.4, 'Pero, ¿cuánto mide su lado?'],
  [24.8, 29.2, 'Un número que, multiplicado por sí mismo, dé dos.'],
  [32.4, 35.4, 'Uno por uno da uno: muy poco.'],
  [35.6, 38.6, 'Dos por dos da cuatro: demasiado.'],
  [39.0, 42.2, 'Uno punto cuatro queda corto; uno punto cinco, se pasa.'],
  [42.4, 45.0, 'Con dos cifras, lo mismo.'],
  [45.4, 48.4, 'Ninguna fracción al cuadrado da exactamente dos.'],
  [48.6, 51.4, 'Es un número nuevo: la raíz de dos.'],
  [51.8, 54.6, 'Su decimal nunca termina y nunca se repite.'],
  [54.8, 57.4, 'Es irracional, como raíz de tres o pi.'],
  [60.6, 63.6, 'Una rueda de un metro de ancho.'],
  [63.8, 66.6, 'Da una vuelta completa.'],
  [67.0, 70.0, 'Avanza un poco más de tres metros.'],
  [70.2, 73.2, 'Esa distancia es pi: tres punto catorce, y sigue.'],
  [73.6, 76.6, 'Pi tampoco es una fracción.'],
  [76.8, 79.4, 'Los irracionales salen en diagonales y curvas.'],
  [82.2, 85.2, 'Este es el mapa de los números.'],
  [85.4, 88.2, 'Racionales a un lado, irracionales al otro.'],
  [88.6, 91.4, 'Juntos forman los números reales.'],
  [91.6, 94.2, 'Se escriben con una erre de doble trazo.'],
  [94.6, 97.4, 'Un número es fracción, o no lo es.'],
  [97.6, 100.2, 'Los dos grupos no comparten nada.'],
  [100.6, 103.4, 'Ocho, menos seis, menos tres séptimos…'],
  [103.6, 106.2, 'cada uno en su bolsa más pequeña.'],
  [108.2, 111.0, 'Los reales llenan toda la recta.'],
  [111.2, 114.0, 'A cada punto le corresponde un número real.'],
  [114.4, 117.2, 'Entre dos reales distintos siempre cabe otro:'],
  [117.4, 120.2, 'por ejemplo, el de la mitad.'],
  [120.6, 124.2, 'Y entre esos, otro más. Nunca se acaba.'],
  [125.4, 129.8, 'Los reales son racionales e irracionales juntos.'],
  [130.0, 134.4, 'No comparten ningún número, y llenan toda la recta.'],
];
