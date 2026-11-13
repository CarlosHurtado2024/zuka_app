// «Los números racionales» (lección alg-11b de Zuka, Valle de los Números, video 2) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (tres panes entre cuatro amigos, 1/2 = 2/4 = 3/6, −3 = −3/1, 3/4 = 0.75,
// 2/11 = 0.1818…, 0.777… = 7/9), que tests/sistemas-numericos.test.js mantiene fuera de los ejercicios.
// Niveles: 0 repartir (panes → 3/4) → 1 dentro de la fracción: numerador, denominador y ℚ → 2 dentro de 1/2: equivalentes y
// bolsas → 3 dentro de 3/4: el decimal termina o se repite.
const POSTER = 77.6;
const BX = [300, 540, 780], BY = 640, BW = 190;                          // los tres panes
const FX = [210, 430, 650, 870], FY = 990;                               // los cuatro amigos
const DOOR0 = [560, 1290];
const QC = { x: 540, y: 860, r: 340 }, ZC = { x: 600, y: 900, r: 230 }, NC = { x: 650, y: 930, r: 120 };

const FILM = {
  DUR: 128, endAt: 114.2,
  DT: [[31.0, 33.2], [58.4, 60.6], [85.4, 87.6]],
  dives: () => [
    { a: 31.0, b: 33.2, P: DOOR0, r: 100, A: [540, 760] },
    { a: 58.4, b: 60.6, P: [780, 1080], r: 82, A: [160, 690] },
    { a: 85.4, b: 87.6, P: [330, 720], r: 82, A: [200, 640] },
  ],
  open: { Z0: 2.6, C: [BX[0], BY], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 26.8, lock: 27.4, name: 'la fracción', L: [330, 1530] },
    { fire: 54.4, lock: 55.0, name: 'equivalentes', L: [330, 1530] },
    { fire: 81.2, lock: 81.8, name: 'decimales', L: [330, 1530] },
  ],
  stops: ['repartir', 'la fracción', 'equivalentes', 'decimales'],
  guide: {
    blinks: [7.6, 13.2, 20.4, 29.0, 36.2, 44.0, 50.6, 62.6, 70.4, 77.0, 90.6, 97.2, 103.0, 108.8, 120.0],
    smiles: [[17.0, 18.6], [24.2, 25.4], [64.6, 66.2], [91.0, 92.6], [110.8, 112.4], [118.0, 140]],
    wides: [[48.0, 49.4], [96.0, 97.4]],
    looks: [],
  },
};

// ---------- nivel 0 · repartir ----------
const piece = i => { const b = Math.floor(i / 4), q = i % 4; return { b, q, f: q, t0: 14.6 + i * .14 }; };
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, BX[0], BY, 120, 170);
  const kc = eio(seg(t, 12.6, 14.0));
  BX.forEach((x, b) => {
    if (t < 14.6) bread(G, x, BY, BW, 1 + .1 * wob(t, 7.0 + b * .6, 14, 6), 4, kc);
    else for (let q = 0; q < 4; q++) {                                    // los cuartos vuelan a cada amigo
      const P = piece(b * 4 + q), m = eio(seg(t, P.t0, P.t0 + .8));
      const x0 = x - BW / 2 + BW * (q + .5) / 4, x1 = FX[P.f] + (b - 1) * 46, y1 = 1150;
      const xx = lerp(x0, x1, m), yy = lerp(BY, y1, m) - 120 * Math.sin(Math.PI * m), s = lerp(1, .82, m), pw = (BW / 4 - 8) * s, ph = BW * .46 * s;
      shaded(G, 'rect', { x: r1(xx - pw / 2), y: r1(yy - ph / 2), width: r1(pw), height: r1(ph), rx: r1(pw * .3) }, C.sun, C.sunD, 4, 4);
    }
  });
  FX.forEach((x, i) => buddy(G, x, FY, 110, pop(t, 8.4 + i * .25) * (1 + .1 * wob(t, 17.4 + i * .1, 14, 6)), i % 2 ? C.mint : C.blue, i % 2 ? C.mintD : C.blueD));
  // la respuesta: 3 ÷ 4 = 3/4
  riseFormula(G, t, 18.6, 24.4, 470, DOOR0[1] + 26, 70, ['3', '÷', '4', '='], { anchor: 'end' });
  fracTile(G, DOOR0[0], DOOR0[1], 130, '3', '4', pop(t, 19.2) * (1 + .1 * wob(t, 24.6, 14, 6)), ZERO);
  riseFormula(G, t, 24.8, 999, 660, DOOR0[1] + 26, 76, [{ s: 'notin' }, { s: 'dZ' }], { anchor: 'start', fill: C.coral });
}
// ---------- nivel 1 · la fracción ----------
function level1(G, t) {
  starField(G, 17, 90);
  halo(G, 540, 760, 200, 270);
  fracAt(G, 540, 760, 220, '3', '4', C.cream);
  const ka = eio(seg(t, 34.0, 34.6)), kb = eio(seg(t, 36.0, 36.6));
  if (ka > 0.01) { arrowLine(G, [[790, 640], [680, 660]], ka, C.sun, 6); tag(G, 810, 652, 'cuántas', ka, C.sun, 44, 'start'); tag(G, 810, 702, 'se toman', ka, C.sun, 44, 'start'); }
  if (kb > 0.01) { arrowLine(G, [[790, 880], [680, 870]], kb, C.mint, 6); tag(G, 810, 880, 'partes', kb, C.mint, 44, 'start'); tag(G, 810, 930, 'iguales', kb, C.mint, 44, 'start'); }
  const kbar = pop(t, 37.4) * out(t, 45.6);
  partBar(G, 190, 1030, 700, 110, 4, 3, kbar, eio(seg(t, 38.0, 39.4)));
  riseFormula(G, t, 40.0, 58.0, 540, 1310, 50, [{ s: 'dQ' }, '=', '{', { fr: ['a', 'b'] }, ':', 'a, b', { s: 'in' }, { s: 'dZ' }, ',', 'b ≠ 0', '}'], { colors: { 'b ≠ 0': C.sun } });
  // abajo nunca va cero
  const k0 = life(t, 46.0, 51.6);
  fracTile(G, 470, 1085, 120, '3', '0', k0, NEG);
  badge(G, 610, 1040, life(t, 46.8, 51.6), false);
  // ejemplos
  [['−2', '5', NEG, 300], ['7', '2', POS, 540], ['1', '2', ZERO, 780]].forEach(([n, d, c, x], i) =>
    fracTile(G, x, 1080, 120, n, d, pop(t, 52.2 + i * .4) * (1 + .1 * wob(t, 52.2 + i * .4, 14, 6))));
}
// ---------- nivel 2 · equivalentes ----------
function level2(G, t) {
  starField(G, 29, 90);
  const ko = 1 - eio(seg(t, 73.0, 73.6));
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 860, ko);
    [[1, 2, 690], [2, 4, 870], [3, 6, 1050]].forEach(([m, n, y], i) => {
      const t0 = 61.0 + i * 1.0;
      fracTile(S, 160, y, 100, String(m), String(n), pop(t, t0));
      partBar(S, 260, y - 50, 600, 100, n, m, pop(t, t0 + .1), eio(seg(t, t0 + .5, t0 + 1.2)));
    });
    const kl = eio(seg(t, 64.6, 65.4));
    if (kl > 0.01) el('rect', { x: 556, y: 610, width: 8, height: r1(520 * kl), rx: 4, fill: C.cream }, S);
    badge(S, 940, 870, pop(t, 65.2), true);
  }
  riseFormula(G, t, 67.4, 73.0, 540, 1320, 76, [{ fr: ['1', '2'] }, '=', { fr: ['2', '4'] }, '=', { fr: ['3', '6'] }]);
  const kx = life(t, 68.4, 73.0);
  if (kx > 0.01) { tag(G, 540, 1185, '× 2 arriba y abajo', kx, C.sun, 44); }
  riseFormula(G, t, 73.6, 79.0, 540, 1320, 76, ['−3', '=', { fr: ['−3', '1'] }], { fill: C.coral });
  // las bolsas
  const kq = eo(seg(t, 74.4, 75.2)), kz = eo(seg(t, 75.0, 75.8)), kn = eo(seg(t, 75.6, 76.4));
  if (kq > 0.01) el('circle', { cx: QC.x, cy: QC.y, r: r1(QC.r * kq), fill: C.n2 }, G);
  if (kz > 0.01) el('circle', { cx: ZC.x, cy: ZC.y, r: r1(ZC.r * kz), fill: C.n3 }, G);
  if (kn > 0.01) el('circle', { cx: NC.x, cy: NC.y, r: r1(NC.r * kn), fill: C.blueD }, G);
  lasso(G, QC.x, QC.y, QC.r, QC.r, eio(seg(t, 74.4, 75.4)), C.sun, 6);
  lasso(G, ZC.x, ZC.y, ZC.r, ZC.r, eio(seg(t, 75.0, 76.0)), C.coral, 6);
  lasso(G, NC.x, NC.y, NC.r, NC.r, eio(seg(t, 75.6, 76.6)), C.cream, 6);
  const sQ = pop(t, 75.4), sZ = pop(t, 76.0), sN = pop(t, 76.6);
  if (sQ > 0.01) sym(G, 'dQ', 210, 880, 76 * sQ, C.sun);
  if (sZ > 0.01) sym(G, 'dZ', 400, 820, 70 * sZ, C.coral);
  if (sN > 0.01) sym(G, 'dN', 600, 900, 64 * sN, C.cream);
  tile(G, 690, 980, 70, '2', pop(t, 76.8));
  tile(G, 450, 960, 80, '−3', pop(t, 77.2), NEG, C.night);
  fracTile(G, 400, 1110, 84, '−2', '5', pop(t, 77.6), NEG);
  fracTile(G, 330, 720, 84, '3', '4', pop(t, 78.0) * (1 + .12 * wob(t, 81.2, 14, 6)), ZERO);
  riseFormula(G, t, 79.4, 999, 540, 1330, 80, [{ s: 'dN' }, { s: 'sube' }, { s: 'dZ' }, { s: 'sube' }, { s: 'dQ' }], { fill: C.sun });
}
// ---------- nivel 3 · decimales ----------
const GROUPS = 3;
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  const k1 = 1 - eio(seg(t, 105.2, 105.8));
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 780, k1);
    fracTile(R, 200, 640, 110, '3', '4', 1, ZERO);
    tag(R, 330, 676, '=', pop(t, 88.6), C.cream, 90);
    const k75 = pop(t, 89.0); if (k75 > 0.01) text(R, 390, 680, '0.75', { 'font-size': r1(110 * k75), 'font-weight': 700, fill: C.cream });
    chip(R, 850, 645, 'termina', pop(t, 90.2), MINT, C.night, 40);
    // 2/11 = 0.1818…
    fracTile(R, 200, 900, 110, '2', '11', pop(t, 94.0));
    tag(R, 330, 936, '=', pop(t, 94.4), C.cream, 90);
    const k0 = pop(t, 94.6); if (k0 > 0.01) text(R, 390, 940, '0.', { 'font-size': r1(100 * k0), 'font-weight': 700, fill: C.cream });
    let x = 390 + tw('0.', 100, 700);
    for (let j = 0; j < GROUPS; j++) {
      const k = pop(t, 95.2 + j * .6), w = tw('18', 100, 700), col = j % 2 ? C.mint : C.sun;
      if (k > 0.01) text(R, r1(x + w / 2), 940, '18', { 'font-size': r1(100 * k), 'font-weight': 700, fill: col, 'text-anchor': 'middle' });
      const kb = eio(seg(t, 99.8 + j * .25, 100.3 + j * .25));
      if (kb > 0.01) el('rect', { x: r1(x + 6), y: 968, width: r1((w - 12) * kb), height: 8, rx: 4, fill: col }, R);
      x += w + 6;
    }
    dots(R, x + 40, 920, pop(t, 97.0), C.cream);
    riseFormula(R, t, 100.6, 999, 540, 1110, 84, ['0.1818…', '=', '0.', { ov: '18' }], { colors: { '0.': C.sun }, fill: C.sun });
  }
  // 0.777… = 7/9
  const row = (t0, y, L, R_, colL) => {
    riseFormula(S, t, t0, 999, 470, y, 70, L, { anchor: 'end', fill: colL || C.cream });
    riseFormula(S, t, t0 + .15, 999, 510, y, 70, ['='], {});
    riseFormula(S, t, t0 + .3, 999, 560, y, 70, R_, { anchor: 'start', fill: colL || C.cream });
  };
  if (t > 105.8) {
    row(107.6, 700, ['10x'], ['7.777…']);
    row(106.4, 830, ['x'], ['0.777…']);
    const km = eio(seg(t, 109.0, 109.6));
    if (km > 0.01) {
      el('rect', { x: 240, y: 872, width: r1(600 * km), height: 8, rx: 4, fill: C.mist }, S);
      text(S, 210, 846, '−', { 'font-size': 70, 'font-weight': 700, fill: C.mist, 'text-anchor': 'middle' });
      for (const y of [700, 830]) el('rect', { x: 620, y: y - 28, width: r1(150 * km), height: 8, rx: 4, fill: C.coral }, S);
    }
    row(109.8, 970, ['9x'], ['7'], C.cream);
    riseFormula(S, t, 111.0, 999, 540, 1180, 96, ['x', '=', { fr: ['7', '9'] }], { fill: C.sun });
    badge(S, 760, 1130, pop(t, 111.6), true);
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(840 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Los números', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'racionales', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.2, 'REPARTIR', 'tres panes, cuatro amigos', '¿cuánto le toca a cada uno?');
  label(p, t, 12.6, 18.2, 'PARTIR EN CUARTOS', 'cada pan, en 4 partes iguales', 'a cada amigo le tocan 3');
  label(p, t, 18.6, 24.4, 'A CADA UNO', 'tres cuartos de pan', 'ni siquiera un pan entero');
  label(p, t, 24.8, 30.6, 'LA DIVISIÓN SE ESCAPA', '3/4 no es un entero', 'hace falta otra familia');
  label(p, t, 33.6, 39.6, 'LA FRACCIÓN', 'abajo: en cuántas partes', 'arriba: cuántas se toman');
  label(p, t, 40.0, 45.6, 'LOS RACIONALES', 'todas las fracciones de enteros', 'la Q viene de «cociente»');
  label(p, t, 46.0, 51.8, 'ABAJO NUNCA VA CERO', 'repartir entre cero amigos', 'no hay a quién darle');
  label(p, t, 52.2, 58.0, 'EJEMPLOS', 'menos dos quintos, siete medios', 'y un medio: todos racionales');
  label(p, t, 61.0, 67.0, 'LA MISMA CANTIDAD', 'medio, dos cuartos, tres sextos', 'pintan lo mismo');
  label(p, t, 67.4, 73.2, 'EQUIVALENTES', 'multiplicar arriba y abajo', 'por el mismo número');
  label(p, t, 73.6, 79.2, 'LOS ENTEROS TAMBIÉN', 'basta ponerles un 1 abajo', 'menos tres es −3 sobre 1');
  label(p, t, 79.6, 85.2, 'BOLSAS', 'los naturales caben en los enteros', 'y los enteros, en los racionales');
  label(p, t, 88.0, 93.6, 'A DECIMAL', 'arriba entre abajo', 'tres entre cuatro: termina');
  label(p, t, 94.0, 99.6, 'NUNCA TERMINA', 'dos entre once: 0.181818…', 'pero el 18 se repite');
  label(p, t, 100.0, 105.6, 'EL PERÍODO', 'lo que se repite lleva rayita', 'o termina, o se repite');
  label(p, t, 106.0, 113.8, 'Y AL REVÉS', 'todo periódico es una fracción', 'al restar, las colas se cancelan');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['RACIONALES · DIVIDIR', [{ s: 'dQ' }, '=', '{', { fr: ['a', 'b'] }, ':', 'b ≠ 0', '}']],
  ['EQUIVALENTES', [{ fr: ['1', '2'] }, '=', { fr: ['2', '4'] }, '=', { fr: ['3', '6'] }]],
  ['UNA BOLSA DENTRO DE OTRA', [{ s: 'dN' }, { s: 'sube' }, { s: 'dZ' }, { s: 'sube' }, { s: 'dQ' }]],
  ['EL DECIMAL', 'termina o se repite'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 3; i++) ev.push({ t: 7.0 + i * .6, type: 'count', i });
  for (let i = 0; i < 4; i++) ev.push({ t: 8.4 + i * .25, type: 'pop', i });
  ev.push({ t: 12.6, type: 'paint', d: 1.4 });
  for (let i = 0; i < 12; i++) { ev.push({ t: 14.6 + i * .14, type: 'fly', d: .8 }); if (i % 3 === 0) ev.push({ t: 15.4 + i * .14, type: 'tile', i }); }
  ev.push({ t: 18.6, type: 'rise' }, { t: 19.2, type: 'pop', i: 2 }, { t: 24.8, type: 'rise' }, { t: 25.2, type: 'no' });
  ev.push({ t: 34.0, type: 'slide', d: .6 }, { t: 36.0, type: 'slide', d: .6 }, { t: 37.4, type: 'pop', i: 0 }, { t: 38.0, type: 'paint', d: 1.4 });
  ev.push({ t: 40.0, type: 'rise' }, { t: 46.0, type: 'pop', i: 1 }, { t: 46.8, type: 'no' });
  for (let i = 0; i < 3; i++) ev.push({ t: 52.2 + i * .4, type: 'tile', i });
  for (let i = 0; i < 3; i++) ev.push({ t: 61.0 + i, type: 'tile', i }, { t: 61.5 + i, type: 'paint', d: .7 });
  ev.push({ t: 64.6, type: 'slide', d: .8 }, { t: 65.2, type: 'yes' }, { t: 67.4, type: 'rise' }, { t: 73.0, type: 'away', d: .6 }, { t: 73.6, type: 'rise' });
  ev.push({ t: 74.4, type: 'lasso', d: 1.0 }, { t: 75.0, type: 'lasso', d: 1.0 }, { t: 75.6, type: 'lasso', d: 1.0 });
  for (let i = 0; i < 4; i++) ev.push({ t: 76.8 + i * .4, type: 'tile', i: i + 3 });
  ev.push({ t: 79.4, type: 'rise' });
  ev.push({ t: 88.6, type: 'pop', i: 0 }, { t: 89.0, type: 'pop', i: 1 }, { t: 90.2, type: 'yes' });
  ev.push({ t: 94.0, type: 'tile', i: 0 }, { t: 94.6, type: 'pop', i: 2 });
  for (let j = 0; j < GROUPS; j++) ev.push({ t: 95.2 + j * .6, type: 'count', i: j });
  ev.push({ t: 99.8, type: 'paint', d: 1.0 }, { t: 100.6, type: 'rise' }, { t: 105.2, type: 'away', d: .6 });
  ev.push({ t: 106.4, type: 'rise' }, { t: 107.6, type: 'rise' }, { t: 109.0, type: 'slide', d: .6 }, { t: 109.8, type: 'rise' }, { t: 111.0, type: 'rise' }, { t: 111.6, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Con los enteros sumamos, restamos y multiplicamos.'],
  [4.0, 6.4, 'Pero falta dividir.'],
  [6.8, 9.8, 'Tres panes para repartir entre cuatro amigos.'],
  [10.0, 12.4, 'A nadie le toca un pan entero.'],
  [12.8, 15.4, 'Partimos cada pan en cuatro partes iguales.'],
  [15.6, 18.4, 'Salen doce cuartos: tres para cada amigo.'],
  [18.8, 21.6, 'Tres entre cuatro da tres cuartos de pan.'],
  [21.8, 24.6, 'Ni siquiera un pan entero.'],
  [24.8, 27.8, 'Tres cuartos no es un entero.'],
  [28.0, 30.8, 'La división se escapó de los enteros.'],
  [33.6, 36.6, 'Una fracción son dos números y una raya.'],
  [36.8, 39.6, 'Abajo, en cuántas partes; arriba, cuántas tomo.'],
  [40.0, 42.8, 'Todas las fracciones de enteros son los racionales.'],
  [43.0, 45.8, 'Se escriben con una cu: de cociente.'],
  [46.0, 49.0, 'El de abajo nunca es cero:'],
  [49.2, 51.8, 'repartir entre cero amigos no tiene sentido.'],
  [52.2, 55.0, 'Menos dos quintos, siete medios, un medio:'],
  [55.2, 58.0, 'todos son racionales. Entremos al medio.'],
  [61.0, 64.2, 'Medio pan, dos cuartos y tres sextos.'],
  [64.4, 67.0, 'Pintan exactamente lo mismo.'],
  [67.4, 70.4, 'Son fracciones equivalentes:'],
  [70.6, 73.2, 'arriba y abajo por el mismo número.'],
  [73.6, 76.4, 'Los enteros también son racionales:'],
  [76.6, 79.2, 'menos tres es menos tres sobre uno.'],
  [79.6, 82.4, 'Bolsas, una dentro de otra:'],
  [82.6, 85.2, 'naturales, enteros y racionales.'],
  [88.0, 90.8, 'Para el decimal, divide arriba entre abajo.'],
  [91.0, 93.6, 'Tres cuartos: cero punto setenta y cinco.'],
  [94.0, 96.8, 'Dos entre once nunca termina:'],
  [97.0, 99.6, 'dieciocho, dieciocho, dieciocho, sin parar.'],
  [100.0, 102.8, 'Lo que se repite lleva rayita: el período.'],
  [103.0, 105.6, 'Con fracciones, el decimal termina o se repite.'],
  [106.0, 108.8, 'Al revés: equis es cero punto siete periódico.'],
  [109.0, 111.2, 'Restamos, y las colas infinitas se cancelan.'],
  [111.4, 113.8, 'Equis es siete novenos.'],
  [115.4, 119.6, 'Los racionales son las fracciones de enteros.'],
  [119.8, 124.2, 'Su decimal termina o se repite, y los enteros viven dentro de ellos.'],
];
