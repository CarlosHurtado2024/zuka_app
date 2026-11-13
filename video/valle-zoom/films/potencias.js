// «Potencias y exponentes» (lección alg-21a de Zuka, Torres de Potencias, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): el secreto de Caro (3, 9, 27, 81 = 3⁴), (−3)² y −3²,
// (−3)³ y (−3)⁴, la escalera de potencias de 3 hasta 3⁰ = 1 y 3⁻² = 1/9, 10⁻² = 0.01.
// Hilo (docs/storytelling-videos.md): Caro cuenta un secreto en la torre; ¿cuántos lo saben el cuarto día? Cierre: el día cero
// solo lo sabía Caro, y eso es 3⁰ = 1.
// Niveles: 0 el secreto (multiplicación repetida) → 1 por (−3)²: el signo → 2 por la escalera: exponente cero → 3 bajo cero: negativos.
const POSTER = 75.6;
const DAYS = [[1, 1150, 30], [3, 1030, 30], [9, 910, 22], [27, 790, 9], [81, 670, 3.4]];   // personas, renglón, radio
const STEP = i => ({ x: 170 + i * 150, y: 720 + i * 70 });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1380], r: 100, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1370], r: 100, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1370], r: 100, A: [540, 700] },
  ],
  open: { Z0: 2.4, C: [540, 1100], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el signo', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'la escalera', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'bajo cero', L: [330, 1560] },
  ],
  stops: ['el secreto', 'el signo', 'exponente cero', 'negativos'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[17.0, 18.6], [74.0, 75.6], [119.0, 135]],
    wides: [[72.6, 74.0], [38.6, 40.0]],
    looks: [],
  },
};

function head(p, x, y, s, k, gl, col) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  el('circle', { cx: x, cy: y, r: r1(s * .42), fill: col }, S);
  for (const sx of [-1, 1]) el('circle', { cx: r1(x + sx * s * .13), cy: r1(y - s * .04), r: r1(s * .05), fill: C.night }, S);
}
// ---------- nivel 0 · el secreto ----------
function level0(G, t) {
  starField(G, 7, 150);
  // la torre
  el('rect', { x: 120, y: 620, width: 840, height: 580, rx: 30, fill: C.n2 }, G);
  DAYS.forEach(([n, y, r], d) => {
    el('rect', { x: 140, y: y - 52, width: 800, height: 4, fill: C.n3 }, G);
    const t0 = d ? 7.4 + (d - 1) * 1.6 : 0, sp = Math.min(70, 600 / n);
    for (let i = 0; i < n; i++) {
      const k = d ? pop(t, t0 + i * (1.2 / n)) : 1, x = 540 + (i - (n - 1) / 2) * sp;
      if (k <= 0.01) continue;
      if (r > 10) head(G, x, y, r * 2.2, k, 0, d ? C.sun : C.coral);
      else el('circle', { cx: r1(x), cy: y, r: r1(r * k), fill: C.sun }, G);
    }
    tag(G, 150, y + 12, d ? `día ${d}` : 'Caro', d ? pop(t, t0) : 1, C.mist, 30, 'start');
    tag(G, 930, y + 14, String(n), d ? pop(t, t0 + 1.2) : pop(t, 6.6), C.cream, 40, 'end');
  });
  riseFormula(G, t, 15.0, 18.6, 540, 1300, 68, ['3 · 3 · 3 · 3', '=', '81']);
  riseFormula(G, t, 19.0, 999, 540, 1300, 80, ['3', { sup: '4' }, '=', '81'], { colors: { '81': C.sun } });
  const kb = pop(t, 21.0);
  if (kb > 0.01) { tag(G, 380, 1260, 'base', kb, C.mint, 36, 'end'); tag(G, 500, 1200, 'exponente', kb, C.sun, 32, 'end'); }
  fchip(G, 540, 1385, ['(−3)', { sup: '2' }], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), NEG, 50);
}
// ---------- nivel 1 · el signo ----------
function level1(G, t) {
  starField(G, 17, 90);
  fchip(G, 540, 700, ['(−3)', { sup: '2' }], 1, NEG, 50);
  const F1 = riseFormula(G, t, 32.4, 999, 540, 880, 60, ['(−3)', { sup: '2' }, '=', '(−3)(−3)', '=', '9'], { colors: { '9': C.mint } });
  const kv = eio(seg(t, 33.2, 33.8));
  if (kv > 0.01 && F1) { const w = tw('(−3)', 60, 600) + 24; el('rect', { x: r1(F1.at[0][0] - w / 2), y: 812, width: r1(w * kv), height: 90, rx: 18, fill: 'none', stroke: C.mint, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, G); }
  riseFormula(G, t, 38.4, 999, 540, 1000, 60, ['−3', { sup: '2' }, '=', '−(3 · 3)', '=', '−9'], { colors: { '−9': C.coral } });
  badge(G, 960, 960, pop(t, 39.4), false);
  riseFormula(G, t, 44.6, 999, 540, 1130, 60, ['(−2)', { sup: '5' }, '=', '−32'], { colors: { '−32': C.coral } });
  riseFormula(G, t, 45.6, 999, 540, 1230, 60, ['(−2)', { sup: '6' }, '=', '64'], { colors: { '64': C.mint } });
  tag(G, 820, 1110, 'impar: −', pop(t, 46.6), C.coral, 36, 'start'); tag(G, 820, 1210, 'par: +', pop(t, 46.9), C.mint, 36, 'start');
  // la escalera (puerta)
  const ke = pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6));
  if (ke > 0.01) { const S = scaleAt(G, 540, 1370, ke * .3); for (let i = 0; i < 4; i++) el('rect', { x: 340 + i * 100, y: 1270 + i * 50, width: 96, height: 230 - i * 50, rx: 10, fill: [C.mint, C.sun, C.blue, C.coral][i] }, S); }
}
// ---------- nivel 2 · la escalera ----------
const VAL = ['81', '27', '9', '3', '1'], EXP = ['4', '3', '2', '1', '0'];
function level2(G, t) {
  starField(G, 29, 90);
  for (let i = 0; i < 5; i++) {
    const { x, y } = STEP(i), t0 = i < 4 ? 60.2 + i * .5 : 72.6, k = pop(t, t0);
    if (k <= 0.01) continue;
    const S = scaleAt(G, x, y + 60, k), col = i === 4 ? ZERO : [MINT, MINT, SKY, SKY][i];
    shaded(S, 'rect', { x: x - 70, y, width: 140, height: 1150 - y, rx: 16 }, col[0], col[1], 5, 5);
    tag(S, x, y + 66, VAL[i], 1, C.night, 52);
    formula(S, x, y - 24, 46, ['3', { sup: EXP[i] }], { fill: i === 4 ? C.sun : C.cream });
    if (i > 0) { const ka = pop(t, i < 4 ? 66.4 + (i - 1) * .4 : 72.2); tag(G, x - 75, 1200, '÷ 3', ka, C.sun, 34); }
  }
  const kq = life(t, 72.4, 76.0);
  if (kq > 0.01) chip(G, 820, 640, '¡no es 0!', kq, NEG, C.night, 40);
  riseFormula(G, t, 78.8, 999, 540, 1250, 70, ['a', { sup: '0' }, '=', '1'], { colors: { '1': C.sun } });
  tag(G, 540, 1320, 'si a ≠ 0', pop(t, 79.6), C.mist, 36);
  fchip(G, 540, 1385, ['3', { sup: '−1' }], pop(t, 87.6) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 50);
}
// ---------- nivel 3 · bajo cero ----------
const NEGS = [['0', '1', ZERO], ['−1', ['1', '3'], SKY], ['−2', ['1', '9'], SKY], ['−3', ['1', '27'], SKY]];
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['3', { sup: '−1' }], out(t, 96.0), SKY, 50);
  el('rect', { x: 120, y: 836, width: 840, height: 6, rx: 3, fill: C.sun }, S);
  tag(S, 950, 820, 'cero', pop(t, 95.6), C.sun, 30, 'end');
  NEGS.forEach(([e, v, col], i) => {
    const x = 240 + i * 200, y = 905 + i * 60, k = pop(t, 95.6 + i * .8);
    if (k <= 0.01) return;
    const R = scaleAt(S, x, y, k);
    shaded(R, 'rect', { x: x - 80, y, width: 160, height: 260 - i * 30, rx: 16 }, col[0], col[1], 5, 5);
    if (typeof v === 'string') tag(R, x, y + 66, v, 1, C.night, 52); else fracAt(R, x, y + 70, 40, v[0], v[1], C.night);
    formula(R, x, y - 20, 44, ['3', { sup: e }], { fill: C.cream });
  });
  riseFormula(S, t, 101.8, 107.4, 540, 1300, 64, ['3', { sup: '−2' }, '=', { fr: ['1', '3²'] }, '=', { fr: ['1', '9'] }], { colors: {} });
  riseFormula(S, t, 107.8, 999, 540, 1300, 62, ['10', { sup: '−2' }, '=', { fr: ['1', '100'] }, '=', '0.01'], { colors: { '0.01': C.sun } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Potencias', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y exponentes', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL SECRETO DE CARO', 'se lo cuenta a 3 vecinos', 'y cada uno, a otros 3');
  label(p, t, 12.8, 18.6, 'DÍA A DÍA', '3, 9, 27, 81', 'cada día, por 3');
  label(p, t, 19.0, 24.4, 'UNA POTENCIA', 'tres multiplicado cuatro veces', 'se escribe 3 a la cuarta');
  label(p, t, 24.8, 29.0, 'BASE Y EXPONENTE', 'la base se repite', 'el exponente cuenta las veces');
  label(p, t, 31.8, 37.8, 'CON PARÉNTESIS', 'el signo entra en la potencia', '(−3) por (−3) = 9');
  label(p, t, 38.2, 44.2, 'SIN PARÉNTESIS', 'el exponente solo toca al 3', 'primero 3 por 3, luego el −');
  label(p, t, 44.6, 50.2, 'PAR O IMPAR', 'base negativa, exponente impar: −', 'exponente par: +');
  label(p, t, 50.6, 56.6, '¿Y SI BAJA?', 'el exponente sube de uno en uno', '¿qué pasa al bajar?');
  label(p, t, 60.0, 66.0, 'LA ESCALERA', '81, 27, 9, 3', 'cada escalón, un exponente');
  label(p, t, 66.4, 72.2, 'BAJAR ES DIVIDIR', 'subir: por 3', 'bajar: entre 3');
  label(p, t, 72.6, 78.4, 'EL ESCALÓN CERO', '3 entre 3 es 1', '3 a la 0 es 1, no 0');
  label(p, t, 78.8, 84.6, 'CUALQUIER BASE', 'a la 0 es 1', 'siempre que a no sea 0');
  label(p, t, 85.0, 90.4, 'SIGUE BAJANDO', 'después del 1', '¿qué hay debajo?');
  label(p, t, 95.4, 101.4, 'BAJO CERO', 'seguimos dividiendo entre 3', 'un tercio, un noveno…');
  label(p, t, 101.8, 107.4, 'EXPONENTE NEGATIVO', '3 a la −2 es 1 entre 9', 'no pone un signo menos');
  label(p, t, 107.8, 114.0, 'CON 10', '10 a la −2 es 0.01', 'un centímetro: 0.01 m');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['POTENCIA', ['3', { sup: '4' }, '=', '3 · 3 · 3 · 3']],
  ['EL SIGNO', ['(−3)', { sup: '2' }, '=', '9', ',', '−3', { sup: '2' }, '=', '−9']],
  ['EXPONENTE CERO', ['a', { sup: '0' }, '=', '1']],
  ['NEGATIVO', ['a', { sup: '−n' }, '=', '1 ÷ a', { sup: 'n' }]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 6.6, type: 'pop', i: 0 }];
  for (let d = 1; d < 5; d++) { const t0 = 7.4 + (d - 1) * 1.6; for (let j = 0; j < 3; j++) ev.push({ t: t0 + j * .4, type: 'count', i: d + j }); }
  ev.push({ t: 15.0, type: 'rise' }, { t: 19.0, type: 'rise' }, { t: 19.6, type: 'yes' }, { t: 21.0, type: 'pop', i: 1 }, { t: 24.8, type: 'pop', i: 2 });
  ev.push({ t: 32.4, type: 'rise' }, { t: 33.2, type: 'lasso', d: .6 }, { t: 33.0, type: 'yes' }, { t: 38.4, type: 'rise' }, { t: 39.4, type: 'no' });
  ev.push({ t: 44.6, type: 'rise' }, { t: 45.6, type: 'rise' }, { t: 46.6, type: 'pop', i: 0 }, { t: 46.9, type: 'pop', i: 1 }, { t: 52.4, type: 'pop', i: 3 });
  for (let i = 0; i < 4; i++) ev.push({ t: 60.2 + i * .5, type: 'tile', i });
  for (let i = 0; i < 3; i++) ev.push({ t: 66.4 + i * .4, type: 'slide', d: .4 });
  ev.push({ t: 72.2, type: 'slide', d: .4 }, { t: 72.6, type: 'hit' }, { t: 72.9, type: 'card' }, { t: 78.8, type: 'rise' }, { t: 87.6, type: 'pop', i: 2 });
  for (let i = 0; i < 4; i++) ev.push({ t: 95.6 + i * .8, type: 'tile', i });
  ev.push({ t: 101.8, type: 'rise' }, { t: 107.8, type: 'rise' }, { t: 108.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro vive en una torre y sabe un secreto.'],
  [4.0, 6.4, '¿A cuántos nuevos les llega el cuarto día?'],
  [6.8, 9.6, 'El primer día se lo cuenta a tres vecinos.'],
  [9.8, 12.4, 'Y cada uno se lo cuenta a otros tres.'],
  [12.8, 15.6, 'Tres, nueve, veintisiete, ochenta y uno.'],
  [15.8, 18.6, 'Cada día se multiplica por tres.'],
  [19.0, 21.8, 'Tres por sí mismo cuatro veces:'],
  [22.0, 24.4, 'tres a la cuarta. Es una potencia.'],
  [24.8, 29.0, 'La base es lo que se repite; el exponente, cuántas veces.'],
  [31.8, 34.8, 'Cuidado con el signo.'],
  [35.0, 37.8, 'Con paréntesis, menos tres por menos tres: nueve.'],
  [38.2, 41.0, 'Sin paréntesis, el exponente solo toca al tres:'],
  [41.2, 44.2, 'primero nueve, y luego el signo: menos nueve.'],
  [44.6, 47.4, 'Con base negativa, un exponente impar da negativo,'],
  [47.6, 50.2, 'y uno par da positivo.'],
  [50.6, 53.6, 'El exponente sube de uno en uno.'],
  [53.8, 56.6, '¿Qué pasa si lo bajamos?'],
  [60.0, 63.0, 'Ochenta y uno, veintisiete, nueve, tres.'],
  [63.2, 66.0, 'Una escalera de potencias de tres.'],
  [66.4, 69.2, 'Subir un escalón es multiplicar por tres.'],
  [69.4, 72.2, 'Bajar uno es dividir entre tres.'],
  [72.6, 75.4, 'Tres entre tres es uno.'],
  [75.6, 78.4, 'Tres a la cero es uno, no cero.'],
  [78.8, 81.6, 'Pasa con cualquier base:'],
  [81.8, 84.6, 'a la cero es uno, si a no es cero.'],
  [85.0, 87.8, '¿Y si seguimos bajando,'],
  [88.0, 90.4, 'por debajo del cero?'],
  [95.4, 98.4, 'Seguimos dividiendo entre tres:'],
  [98.6, 101.4, 'un tercio, un noveno, un veintisieteavo.'],
  [101.8, 104.6, 'Tres a la menos dos es uno entre nueve.'],
  [104.8, 107.4, 'No pone un signo menos: manda la potencia abajo.'],
  [107.8, 110.6, 'Con base diez: diez a la menos dos es cero punto cero uno.'],
  [110.8, 114.0, 'Un centímetro es la centésima parte de un metro.'],
  [115.4, 119.6, 'El cuarto día se enteran ochenta y uno: tres a la cuarta.'],
  [119.8, 124.4, 'Y el día cero solo lo sabía Caro: tres a la cero, uno.'],
];
