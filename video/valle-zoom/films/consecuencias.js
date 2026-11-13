// «Consecuencias de los axiomas» (lección alg-12c de Zuka, Valle de los Números, video 5) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (9 − 4 en la recta, 3 − (−6) en el ascensor, 12 ÷ 3, 2/5 ÷ 3/4 = 8/15, cinco cajas
// con cero dulces, la tabla del 3, el espejo del cero, x + 7 = 2 + 7, 4x = 4 · 9, 0 · 2 = 0 · 5 y 7 · b = 0), que
// tests/axiomas-desde-cero.test.js mantiene fuera de los ejercicios.
// Niveles: 0 restar (la recta y el ascensor) → 1 por el ÷: dividir → 2 por (−)(−): los signos → 3 por la balanza: cancelar.
const POSTER = 76.4;
const X0 = v => 170 + 74 * v, LY0 = 760;
const FY = v => 1100 - 54 * v, SX = 300;                                // el ascensor
const DOOR0 = [760, 1150];
const XS = v => 540 + 80 * v;
const BAL = { x: 540, y: 760 };

const FILM = {
  DUR: 141, endAt: 125.8,
  DT: [[29.4, 31.6], [63.6, 65.8], [93.0, 95.2]],
  dives: () => [
    { a: 29.4, b: 31.6, P: DOOR0, r: 72, A: [540, 640] },
    { a: 63.6, b: 65.8, P: [540, 1250], r: 150, A: [540, 640] },
    { a: 93.0, b: 95.2, P: [540, 1300], r: 110, A: [BAL.x, BAL.y + 60] },
  ],
  open: { Z0: 2.3, C: [X0(9), LY0], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.4, lock: 26.0, name: 'dividir', L: [330, 1530] },
    { fire: 59.6, lock: 60.2, name: 'los signos', L: [330, 1530] },
    { fire: 89.0, lock: 89.6, name: 'cancelar', L: [330, 1530] },
  ],
  stops: ['restar', 'dividir', 'los signos', 'cancelar'],
  guide: {
    blinks: [7.4, 13.0, 19.6, 27.0, 35.4, 41.8, 48.2, 54.6, 61.8, 69.4, 75.6, 82.0, 87.4, 98.2, 104.6, 110.8, 117.0, 123.2, 132.0],
    smiles: [[22.6, 24.2], [36.4, 38.0], [76.8, 78.4], [104.0, 105.6], [130.0, 150]],
    wides: [[52.0, 53.4], [114.6, 116.0]],
    looks: [],
  },
};

// ---------- nivel 0 · restar ----------
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, X0(9), LY0, 110, 160);
  const ko = out(t, 18.2, .5);
  if (ko > 0.01) {
    const S = scaleAt(G, 540, LY0, ko);
    numLine(S, t, -1, X0, LY0, 0, 10, { size: 40 });
    mark(S, X0(9), LY0, '9', 1, C.cream);
    for (let j = 0; j < 4; j++) hop(S, X0(9 - j), X0(8 - j), LY0, 60, eio(seg(t, 7.4 + j * .5, 7.9 + j * .5)), C.coral, 6);
    mark(S, X0(5), LY0, '5', pop(t, 9.6), C.sun);
    const kb = pop(t, 8.0); if (kb > 0.01) tag(S, X0(7), LY0 - 120, '4 pasos a la izquierda', kb, C.coral, 40);
    riseFormula(S, t, 12.6, 999, 540, 960, 64, ['9 − 4', '=', '9 + (−4)', '=', '5'], { colors: { '9 + (−4)': C.sun } });
  }
  // el ascensor: 3 − (−6)
  const ke = eio(seg(t, 18.4, 19.2));
  if (ke > 0.01) {
    const S = scaleAt(G, SX, 900, ke);
    el('rect', { x: SX - 70, y: FY(9.6), width: 140, height: FY(-3.6) - FY(9.6), rx: 20, fill: C.n2 }, S);
    for (let v = -3; v <= 9; v++) {
      const c = v < 0 ? C.coral : v === 0 ? C.sun : C.mist;
      el('rect', { x: SX + 82, y: FY(v) - 3, width: 26, height: 6, rx: 3, fill: c }, S);
      text(S, SX + 124, FY(v) + 14, minus(v), { 'font-size': 38, 'font-weight': 600, fill: c });
    }
    el('rect', { x: SX - 120, y: FY(0) + 24, width: 240, height: 8, rx: 4, fill: C.sun }, S);
    text(S, SX - 140, FY(0) + 40, 'calle', { 'font-size': 36, 'font-weight': 600, fill: C.sun, 'text-anchor': 'end' });
    const fl = kf(t, [[21.0, 3], [23.2, 9]]);
    shaded(S, 'rect', { x: SX - 52, y: r1(FY(fl) - 44), width: 104, height: 88, rx: 14 }, C.blue, C.blueD, 5, 5);
    el('rect', { x: SX - 2, y: r1(FY(fl) - 34), width: 4, height: 68, fill: C.blueD }, S);
    const kc = life(t, 19.4, 21.0), up = eio(seg(t, 20.4, 21.0));
    chip(S, SX + 2, FY(3) - 200 * up, '−6', kc, NEG, C.night, 44);
  }
  riseFormula(G, t, 19.6, 24.6, 560, 820, 62, ['3 − (−6)'], { anchor: 'start' });
  riseFormula(G, t, 21.0, 24.6, 560, 920, 62, ['= 3 + 6'], { anchor: 'start', fill: C.sun });
  riseFormula(G, t, 23.2, 24.6, 560, 1020, 62, ['= 9'], { anchor: 'start', fill: C.sun });
  const kd = pop(t, 24.8) * (1 + .12 * wob(t, 25.4, 14, 6));
  tile(G, DOOR0[0], DOOR0[1], 110, '÷', kd, ZERO, C.night);
}
// ---------- nivel 1 · dividir ----------
function level1(G, t) {
  starField(G, 17, 90);
  const k1 = out(t, 44.4);
  if (k1 > 0.01) {
    const S = scaleAt(G, 540, 800, k1);
    tile(S, 540, 640, 110, '÷', 1, ZERO, C.night);
    tag(S, 430, 668, '12', pop(t, 32.0), C.cream, 80, 'end'); tag(S, 650, 668, '3', pop(t, 32.2), C.cream, 80, 'start');
    const gs = eio(seg(t, 33.4, 34.4)), hi = eio(seg(t, 35.0, 35.6));
    for (let i = 0; i < 12; i++) {
      const gi = Math.floor(i / 4), x = 540 + (i - 5.5) * 60 + (gi - 1) * 50 * gs, k = pop(t, 32.6 + i * .05);
      el('circle', { cx: r1(x), cy: 860, r: r1(22 * k), fill: gi === 0 && hi > .5 ? C.sun : C.mist }, S);
    }
    if (hi > 0.01) lasso(S, 540 + (1.5 - 5.5) * 60 - 50, 860, 130, 52, hi, C.sun, 5);
    riseFormula(S, t, 36.0, 999, 540, 1060, 64, ['12 ÷ 3', '=', '12 ·', { fr: ['1', '3'] }, '=', '4'], { colors: { '4': C.sun } });
  }
  // fracciones: se voltea la segunda
  const k2 = pop(t, 44.8) * out(t, 50.6);
  if (k2 > 0.01) {
    const f = seg(t, 45.6, 46.4), sy = Math.cos(Math.PI * f), up = f > .5;
    fracTile(G, 330, 760, 120, '2', '5', k2);
    tag(G, 450, 784, f > .5 ? '·' : '÷', k2, C.cream, 80);
    const F = g(G, { transform: `translate(570,760) scale(1,${Math.max(.02, Math.abs(sy)).toFixed(3)}) translate(-570,-760)` });
    fracTile(F, 570, 760, 120, up ? '4' : '3', up ? '3' : '4', k2, up ? MINT : POS);
    tag(G, 700, 784, '=', pop(t, 47.0) * out(t, 50.6), C.cream, 80);
    fracTile(G, 820, 760, 120, '8', '15', pop(t, 47.4) * out(t, 50.6), ZERO);
  }
  riseFormula(G, t, 46.6, 50.6, 540, 1060, 64, [{ fr: ['2', '5'] }, '÷', { fr: ['3', '4'] }, '=', { fr: ['2', '5'] }, '·', { fr: ['4', '3'] }, '=', { fr: ['8', '15'] }]);
  // entre cero no
  riseFormula(G, t, 51.2, 56.4, 540, 900, 76, ['5 ÷ 0', '=', '5 ·', '?'], { fill: C.coral });
  badge(G, 820, 860, life(t, 52.0, 56.4), false);
  // cinco cajas con cero dulces
  for (let i = 0; i < 5; i++) {
    const k = pop(t, 57.0 + i * .15); if (k <= 0.01) continue;
    const x = 540 + (i - 2) * 160, S = scaleAt(G, x, 860, k);
    shaded(S, 'rect', { x: x - 60, y: 820, width: 120, height: 90, rx: 12 }, C.sun, C.sunD, 5, 5);
    el('rect', { x: x - 66, y: 806, width: 132, height: 22, rx: 8, fill: C.sunD }, S);
    tag(S, x, 885, '0', 1, C.night, 46);
  }
  riseFormula(G, t, 57.8, 999, 540, 1070, 72, ['5 · 0', '=', '0'], { colors: { '0': C.sun } });
  chip(G, 540, 1250, '(−) · (−) = ?', pop(t, 59.0) * (1 + .1 * wob(t, 59.6, 14, 6)), NEG, C.night, 56);
}
// ---------- nivel 2 · los signos ----------
function level2(G, t) {
  starField(G, 29, 90);
  const ko = out(t, 78.4);
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 900, ko);
    chip(S, 540, 640, '(−) · (−) = ?', 1, NEG, C.night, 56);
    for (let j = 0; j < 5; j++) {
      const k = 2 - j, y = 790 + j * 92;
      const L = `3 · ${k < 0 ? `(${minus(k)})` : k}`, R = `(−3) · ${k < 0 ? `(${minus(k)})` : k}`, rl = 3 * k, rr = -3 * k;
      riseFormula(S, t, 66.6 + j * .45, 999, 330, y, 46, [L, '=', minus(rl)], { colors: { [minus(rl)]: rl < 0 ? C.coral : rl === 0 ? C.sun : C.cream } });
      riseFormula(S, t, 72.8 + j * .45, 999, 770, y, 46, [R, '=', minus(rr)], { colors: { [minus(rr)]: rr < 0 ? C.coral : rr === 0 ? C.sun : C.mint } });
    }
    const ka = pop(t, 68.4), kb = pop(t, 74.6);
    if (ka > 0.01) tag(S, 330, 1290, '−3 cada vez', ka, C.coral, 40);
    if (kb > 0.01) tag(S, 770, 1290, '+3 cada vez', kb, C.mint, 40);
    badge(S, 975, 1140, pop(t, 75.4), true);
  }
  // el espejo
  const km = eio(seg(t, 78.8, 79.6));
  if (km > 0.01) {
    numLine(G, t, 78.8, XS, 900, -5, 5);
    el('rect', { x: 536, y: r1(900 - 220 * km), width: 8, height: r1(380 * km), rx: 4, fill: C.sun }, G);
    const m1 = eio(seg(t, 80.6, 81.6)), m2 = eio(seg(t, 82.4, 83.4));
    const x = m2 > 0 ? lerp(XS(-2), XS(2), m2) : lerp(XS(2), XS(-2), m1), y = 900 - 160 * Math.sin(Math.PI * (m2 > 0 ? m2 : m1));
    mark(G, x, y, '', pop(t, 79.8) * out(t, 90.0), m1 >= 1 && m2 < 1 ? C.coral : C.cream);
    tag(G, XS(-2) - 60, 760, '· (−1)', life(t, 80.4, 82.6), C.coral, 44); tag(G, XS(2) + 60, 760, '· (−1)', life(t, 82.6, 84.4), C.mint, 44);
  }
  riseFormula(G, t, 85.0, 999, 540, 1070, 58, ['(−2) · (−5)', '=', '10'], { colors: { '10': C.mint } });
  riseFormula(G, t, 86.2, 999, 540, 1160, 58, ['(−1)(−2)(−3)', '=', '−6'], { colors: { '−6': C.coral } });
  // la puerta: una balanza pequeña
  const kb = pop(t, 87.6) * (1 + .1 * wob(t, 89.0, 14, 6));
  if (kb > 0.01) { const S = scaleAt(G, 540, 1300, kb * .32); balance(S, t, 540, 1240, 0); }
}
// ---------- nivel 3 · cancelar ----------
function balance(p, t, x, y, tilt, L = [], R = []) {
  const a = tilt * Math.PI / 180, pans = [-1, 1].map(s => [x + s * 290 * Math.cos(a), y + s * 290 * Math.sin(a)]);
  el('path', { d: `M${x},${y + 10}L${x - 70},${y + 230}L${x + 70},${y + 230}Z`, fill: C.mist }, p);
  el('rect', { x: x - 120, y: y + 222, width: 240, height: 22, rx: 10, fill: C.mist }, p);
  capsule(p, pans[0][0], pans[0][1], pans[1][0], pans[1][1], 16, C.cream);
  el('circle', { cx: x, cy: y, r: 20, fill: C.sun }, p);
  pans.forEach(([px, py], i) => {
    capsule(p, px, py, px - 90, py + 140, 5, C.mist); capsule(p, px, py, px + 90, py + 140, 5, C.mist);
    el('path', { d: `M${px - 130},${py + 140}Q${px},${py + 200} ${px + 130},${py + 140}Z`, fill: i ? C.mint : C.sun }, p);
    (i ? R : L).forEach(([s, k, col], j, arr) => s.length > 2 ? chip(p, px, py + 96, s, k, col, C.night, 38) : tile(p, px + (j - (arr.length - 1) / 2) * 92, py + 96, 82, s, k, col, C.night));
  });
}
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 125.8, 126.4)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  const lift = eio(seg(t, 102.4, 103.4)), k7 = 1 - eio(seg(t, 103.0, 103.4));
  const sev = t < 107.6 ? 'x' : t < 113.6 ? '4x' : t < 119.6 ? '0 · 2' : '7 · b';
  const rv = t < 107.6 ? '2' : t < 113.6 ? '4 · 9' : t < 119.6 ? '0 · 5' : '0';
  const L = [[sev, 1, POS]], R = [[rv, 1, POS]];
  if (t < 107.6) { L.push(['7', k7, ZERO]); R.push(['7', k7, ZERO]); }
  const tl = t > 113.6 && t < 119.6 ? 3 * wob(t, 114.6, 6, 1.2) : 0;
  balance(S, t, BAL.x, BAL.y, tl, L.map(([s, k, c]) => [s, k * (1 + .08 * wob(t, 107.6, 14, 6) + .08 * wob(t, 113.6, 14, 6) + .08 * wob(t, 119.6, 14, 6)), c]), R);
  for (const s of [-1, 1]) if (lift > 0.01 && lift < 1) tile(S, BAL.x + s * 290 + 46, BAL.y + 96 - 260 * lift, 82, '7', 1 - lift * .3, ZERO, C.night);
  riseFormula(S, t, 96.4, 107.4, 540, 1180, 72, ['x + 7', '=', '2 + 7']);
  riseFormula(S, t, 103.6, 107.4, 540, 1290, 80, ['x', '=', '2'], { fill: C.sun });
  riseFormula(S, t, 108.0, 113.4, 540, 1180, 72, ['4 · x', '=', '4 · 9']);
  riseFormula(S, t, 109.6, 113.4, 540, 1290, 80, ['x', '=', '9'], { fill: C.sun });
  riseFormula(S, t, 114.0, 119.4, 540, 1180, 72, ['0 · 2', '=', '0 · 5']);
  riseFormula(S, t, 115.4, 119.4, 540, 1290, 80, ['2', '≠', '5'], { fill: C.coral });
  badge(S, 700, 1250, life(t, 116.0, 119.4), false);
  riseFormula(S, t, 120.0, 999, 540, 1180, 72, ['7 · b', '=', '0']);
  riseFormula(S, t, 121.4, 999, 540, 1290, 80, [{ s: 'arrow' }, 'b = 0'], { fill: C.sun });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(840 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Restar, dividir', { 'font-size': 100, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y los signos', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.2, 'RESTAR', 'nueve menos cuatro', 'cuatro pasos a la izquierda');
  label(p, t, 12.6, 18.2, 'ES SUMAR EL OPUESTO', 'restar 4 es sumar −4', 'llegamos al mismo 5');
  label(p, t, 18.6, 24.4, 'UN ASCENSOR', 'quitar 6 pisos de sótano', 'es subir 6 pisos');
  label(p, t, 24.8, 29.2, '¿Y DIVIDIR?', 'también se cambia', 'por algo que ya conocemos');
  label(p, t, 32.2, 38.2, 'DIVIDIR', 'doce entre tres: tres grupos', 'y tomamos uno');
  label(p, t, 38.6, 44.4, 'POR EL RECÍPROCO', 'dividir entre 3', 'es multiplicar por 1/3');
  label(p, t, 44.8, 50.6, 'FRACCIONES', 'se voltea la segunda', 'y se multiplica');
  label(p, t, 51.0, 56.6, 'ENTRE CERO, NO', 'sería por el recíproco del cero', 'y el cero no tiene');
  label(p, t, 57.0, 63.2, 'CERO DULCES', 'cinco cajas vacías', 'cualquier número por cero da cero');
  label(p, t, 66.4, 72.4, 'LA TABLA DEL 3', 'baja 1 el factor', 'y el resultado baja 3');
  label(p, t, 72.8, 78.4, 'AHORA CON −3', 'baja 1 el factor y sube 3', 'pasando el cero: (−3)(−1) = 3');
  label(p, t, 78.8, 84.6, 'EL ESPEJO', 'por −1 es reflejar en el cero', 'dos reflejos: vuelves al inicio');
  label(p, t, 85.0, 92.6, 'CUENTA LOS NEGATIVOS', 'si son pares, positivo', 'si son impares, negativo');
  label(p, t, 95.8, 101.8, 'UNA BALANZA', 'equis más siete, dos más siete', 'en equilibrio');
  label(p, t, 102.2, 107.4, 'QUITA LO MISMO', 'de los dos platillos', 'sigue en equilibrio: x = 2');
  label(p, t, 107.8, 113.4, 'CON EL PRODUCTO', 'cuatro equis igual a cuatro por 9', 'el 4 se cancela: x = 9');
  label(p, t, 113.8, 119.4, 'PERO NO CON CERO', 'cero por dos, cero por cinco', 'y dos no es cinco');
  label(p, t, 119.8, 125.6, 'PRODUCTO CERO', 'si un producto da cero', 'algún factor es cero');
};
FILM.summary = (p, t) => summaryList(p, t, 126.4, 'En resumen', [
  ['RESTAR', ['a − b', '=', 'a + (−b)']],
  ['DIVIDIR', ['a ÷ b', '=', 'a ·', { fr: ['1', 'b'] }]],
  ['LOS SIGNOS', ['(−a)(−b)', '=', 'ab']],
  ['CANCELAR', ['a + c = b + c', { s: 'arrow' }, 'a = b']],
  ['PRODUCTO CERO', ['ab = 0', { s: 'arrow' }, 'a = 0 o b = 0']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let j = 0; j < 4; j++) ev.push({ t: 7.4 + j * .5, type: 'count', i: j });
  ev.push({ t: 9.6, type: 'pop', i: 0 }, { t: 12.6, type: 'rise' }, { t: 13.2, type: 'yes' }, { t: 18.2, type: 'away', d: .5 }, { t: 18.4, type: 'slide', d: .8 });
  ev.push({ t: 19.4, type: 'pop', i: 1 }, { t: 19.6, type: 'rise' }, { t: 20.4, type: 'fly', d: .6 }, { t: 21.0, type: 'enter', d: 2.2 }, { t: 21.0, type: 'rise' }, { t: 23.2, type: 'rise' }, { t: 23.4, type: 'yes' }, { t: 24.8, type: 'tile', i: 0 });
  ev.push({ t: 32.0, type: 'pop', i: 0 }, { t: 32.6, type: 'tile', i: 0 }, { t: 33.4, type: 'slide', d: 1.0 }, { t: 35.0, type: 'lasso', d: .6 }, { t: 36.0, type: 'rise' }, { t: 44.4, type: 'away', d: .4 });
  ev.push({ t: 44.8, type: 'tile', i: 1 }, { t: 45.6, type: 'fly', d: .8 }, { t: 46.6, type: 'rise' }, { t: 47.4, type: 'pop', i: 2 }, { t: 51.2, type: 'rise' }, { t: 52.0, type: 'no' });
  for (let i = 0; i < 5; i++) ev.push({ t: 57.0 + i * .15, type: 'tile', i });
  ev.push({ t: 57.8, type: 'rise' }, { t: 59.0, type: 'pop', i: 3 });
  for (let j = 0; j < 5; j++) ev.push({ t: 66.6 + j * .45, type: 'rise' }, { t: 72.8 + j * .45, type: 'rise' });
  ev.push({ t: 75.4, type: 'yes' }, { t: 78.4, type: 'away', d: .4 }, { t: 78.8, type: 'line', d: .7 }, { t: 79.2, type: 'lasso', d: .6 }, { t: 80.6, type: 'fly', d: 1.0 }, { t: 82.4, type: 'fly', d: 1.0 });
  ev.push({ t: 85.0, type: 'rise' }, { t: 86.2, type: 'rise' }, { t: 87.6, type: 'pop', i: 1 });
  ev.push({ t: 96.4, type: 'rise' }, { t: 102.4, type: 'fly', d: 1.0 }, { t: 103.6, type: 'rise' }, { t: 104.0, type: 'yes' });
  ev.push({ t: 107.6, type: 'tile', i: 2 }, { t: 108.0, type: 'rise' }, { t: 109.6, type: 'rise' }, { t: 110.0, type: 'yes' });
  ev.push({ t: 113.6, type: 'tile', i: 3 }, { t: 114.0, type: 'rise' }, { t: 115.4, type: 'rise' }, { t: 116.0, type: 'no' });
  ev.push({ t: 119.6, type: 'tile', i: 4 }, { t: 120.0, type: 'rise' }, { t: 121.4, type: 'rise' });
  ev.push({ t: 125.8, type: 'away', d: .6 }, { t: 126.4, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 127.0 + k * .55, type: 'stop', i: k });
  ev.push({ t: 130.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Los axiomas solo hablan de sumar y multiplicar.'],
  [4.0, 6.4, 'Todo lo demás sale de ellos.'],
  [6.8, 9.6, 'Nueve menos cuatro: desde el nueve,'],
  [9.8, 12.4, 'cuatro pasos a la izquierda. Llegamos al cinco.'],
  [12.8, 15.6, 'Es lo mismo que sumar menos cuatro.'],
  [15.8, 18.2, 'Restar es sumar el opuesto.'],
  [18.6, 21.4, 'Así se entiende restar un negativo.'],
  [21.6, 24.4, 'Quitar seis pisos de sótano es subir seis.'],
  [24.8, 29.2, '¿Y dividir? También se cambia por algo conocido.'],
  [32.2, 35.2, 'Doce entre tres: tres grupos iguales.'],
  [35.4, 38.2, 'Tomamos uno: cuatro.'],
  [38.6, 41.6, 'Es lo mismo que tomar un tercio de doce.'],
  [41.8, 44.4, 'Dividir es multiplicar por el recíproco.'],
  [44.8, 47.6, 'Con fracciones, se voltea la segunda.'],
  [47.8, 50.6, 'Y se multiplica: ocho quinceavos.'],
  [51.0, 53.8, 'Entre cero no se puede dividir:'],
  [54.0, 56.6, 'el cero no tiene recíproco.'],
  [57.0, 60.0, 'Cinco cajas con cero dulces cada una.'],
  [60.2, 63.2, 'En total, cero. Cualquier número por cero da cero.'],
  [66.4, 69.4, 'Ahora, ¿por qué menos por menos da más?'],
  [69.6, 72.4, 'La tabla del tres baja de a tres.'],
  [72.8, 75.6, 'Con menos tres, sube de a tres.'],
  [75.8, 78.4, 'Pasando el cero: menos por menos, más.'],
  [78.8, 81.8, 'Multiplicar por menos uno es reflejar en el cero.'],
  [82.0, 84.6, 'Dos reflejos te devuelven al principio.'],
  [85.0, 88.8, 'Cuenta los factores negativos.'],
  [89.0, 92.6, 'Si son pares, positivo; si son impares, negativo.'],
  [95.8, 98.8, 'Una igualdad es una balanza en equilibrio.'],
  [99.0, 101.8, 'Equis más siete, igual a dos más siete.'],
  [102.2, 104.8, 'Quitamos el siete de los dos lados.'],
  [105.0, 107.4, 'Sigue en equilibrio: equis es dos.'],
  [107.8, 110.6, 'Con el producto: cuatro equis, cuatro por nueve.'],
  [110.8, 113.4, 'El cuatro se cancela: equis es nueve.'],
  [113.8, 116.6, 'Pero el factor no puede ser cero:'],
  [116.8, 119.4, 'cero por dos y cero por cinco dan igual.'],
  [119.8, 122.6, 'Si un producto da cero,'],
  [122.8, 125.6, 'al menos un factor es cero.'],
  [127.0, 131.4, 'Restar es sumar el opuesto; dividir, multiplicar por el recíproco.'],
  [131.6, 136.0, 'Y de los axiomas salen los signos y la ley cancelativa.'],
];
