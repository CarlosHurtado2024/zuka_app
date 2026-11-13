// «Sucesiones y progresiones aritméticas» (lección alg-14 de Zuka, Escalera de Sigma, video 1) en estilo Scale Zoom Explainer.
// Ejemplos (los de las escenas de respaldo de la lección; no salen en sus ejercicios): la alcancía de Caro 7, 11, 15, 19
// (a₂₀ = 83), los cuadrados 1, 4, 9, 16, las escaleras 20, 25, 30 (d = 5), 30, 28, 26 (d = −2) y 6, 6, 6 (d = 0),
// a₃ = 10 y a₈ = 25 (d = 3, a₁ = 4) y los medios 10, 15, 20 entre 5 y 25.
// Hilo (docs/storytelling-videos.md): Caro echa monedas a su alcancía; ¿cuántas tendrá en la semana 20? La trampa: 20 semanas
// son 19 saltos (los postes y los tramos de una cerca). Cierre: 7 más 19 saltos de 4, 83 monedas.
// Niveles: 0 la sucesión → 1 por el «+4»: la diferencia → 2 por a₂₀: el término general → 3 por a₃ = 10: dos pistas.
const POSTER = 80.0;
const JX = i => 255 + i * 190;

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [350, 560], r: 90, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1385], r: 100, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 110, A: [540, 700] },
  ],
  open: { Z0: 2.4, C: [540, 820], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'la diferencia', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'la semana 20', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'dos pistas', L: [330, 1560] },
  ],
  stops: ['la sucesión', 'la diferencia', 'el término n', 'dos pistas'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[17.0, 18.6], [80.0, 81.6], [119.0, 135]],
    wides: [[72.6, 74.0], [44.6, 46.0]],
    looks: [],
  },
};

// alcancía: base en (x, y)
function jar(p, x, y, n, k, col = MINT, s = 1) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 62 * s, y: y - 150 * s, width: 124 * s, height: 150 * s, rx: 28 * s }, col[0], col[1], 5, 5);
  el('rect', { x: r1(x - 44 * s), y: r1(y - 172 * s), width: r1(88 * s), height: r1(26 * s), rx: 10, fill: C.cream }, S);
  el('rect', { x: r1(x - 22 * s), y: r1(y - 166 * s), width: r1(44 * s), height: 8, rx: 4, fill: C.night }, S);
  tag(S, x, y - 52 * s, String(n), 1, C.night, 56 * s);
}
const aN = (n, col) => ['a', { sub: String(n), col }];
// escalerita de barras: vals, centro x, base y, ancho de barra
function stair(p, t, t0, vals, cx, y, sc, col, d) {
  const n = vals.length, bw = 52, gap = 66;
  vals.forEach((v, i) => {
    const x = cx + (i - (n - 1) / 2) * gap, k = pop(t, t0 + i * .3); if (k <= 0.01) return;
    const S = scaleAt(p, x, y, k), h = v * sc;
    shaded(S, 'rect', { x: x - bw / 2, y: y - h, width: bw, height: h, rx: 10 }, col[0], col[1], 4, 4);
    tag(S, x, y - h - 18, minus(v), 1, C.cream, 34);
  });
  tag(p, cx, y + 60, d, pop(t, t0 + n * .3 + .2), col[0], 40);
}

// ---------- nivel 0 · la sucesión ----------
function level0(G, t) {
  starField(G, 5, 150);
  el('rect', { x: 120, y: 900, width: 840, height: 8, rx: 4, fill: C.n3 }, G);
  [7, 11, 15, 19].forEach((n, i) => {
    jar(G, JX(i), 900, n, pop(t, i ? 7.6 + i * .7 : 1.0));
    tag(G, JX(i), 950, `semana ${i + 1}`, pop(t, i ? 7.8 + i * .7 : 6.8), C.mist, 30);
    const ka = pop(t, 13.0 + i * .3);
    if (ka > 0.01) formula(scaleAt(G, JX(i), 680, ka), JX(i), 690, 50, aN(i + 1), { fill: C.sun });
  });
  dots(G, 965, 830, pop(t, 10.2));
  riseFormula(G, t, 15.2, 18.6, 540, 1080, 62, [...aN(3), '=', '15'], { colors: { '15': C.mint } });
  // los cuadrados: otra sucesión
  [1, 2, 3, 4].forEach((m, i) => {
    const k = pop(t, 19.2 + i * .35); if (k <= 0.01) return;
    const S = scaleAt(G, JX(i), 1180, k), sp = 22;
    for (let r = 0; r < m; r++) for (let c = 0; c < m; c++) el('circle', { cx: r1(JX(i) + (c - (m - 1) / 2) * sp), cy: r1(1180 + (r - (m - 1) / 2) * sp), r: 8, fill: C.sun }, S);
    tag(S, JX(i), 1290, String(m * m), 1, C.cream, 38);
  });
  riseFormula(G, t, 21.4, 999, 420, 1370, 56, [...aN('n'), '=', 'n', { sup: '2' }], { colors: {} });
  // los saltos de +4
  for (let i = 0; i < 3; i++) {
    const t0 = 24.6 + i * .3;
    hop(G, JX(i) + 30, JX(i + 1) - 30, 620, 50, eo(seg(t, t0, t0 + .5)), C.mint, 6);
    if (i === 0) fchip(G, 350, 560, ['+4'], pop(t, t0 + .3) * (1 + .1 * wob(t, 25.2, 14, 6)), MINT, 40);
    else tag(G, (JX(i) + JX(i + 1)) / 2, 574, '+4', pop(t, t0 + .3), C.mint, 40);
  }
}
// ---------- nivel 1 · la diferencia ----------
function level1(G, t) {
  starField(G, 17, 90);
  fchip(G, 540, 700, ['+4'], 1, MINT, 40);
  riseFormula(G, t, 32.6, 999, 540, 870, 58, ['d', '=', '11 − 7', '=', '4'], { colors: { '4': C.mint } });
  stair(G, t, 38.6, [20, 25, 30, 35], 220, 1170, 7, MINT, 'd = 5');
  stair(G, t, 40.4, [30, 28, 26, 24], 540, 1170, 7, NEG, 'd = −2');
  stair(G, t, 44.8, [6, 6, 6, 6], 860, 1170, 7, ZERO, 'd = 0');
  fchip(G, 540, 1385, aN(20), pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 54);
}
// ---------- nivel 2 · el término general ----------
const PX = i => 220 + i * 160;
function level2(G, t) {
  starField(G, 29, 90);
  fchip(G, 540, 700, aN(20), 1, ZERO, 54);
  el('rect', { x: 140, y: 1000, width: 800, height: 6, rx: 3, fill: C.n3 }, G);
  [7, 11, 15, 19, 23].forEach((n, i) => {
    jar(G, PX(i), 1000, n, pop(t, 60.2 + i * .35), i ? MINT : ZERO, .72);
    tag(G, PX(i), 1046, `sem. ${i + 1}`, pop(t, 60.4 + i * .35), C.mist, 28);
    if (i < 4) {
      const t0 = 66.4 + i * .45;
      hop(G, PX(i) + 22, PX(i + 1) - 22, 860, 46, eo(seg(t, t0, t0 + .4)), C.sun, 6);
      tag(G, (PX(i) + PX(i + 1)) / 2, 800, String(i + 1), pop(t, t0 + .3), C.sun, 40);
    }
  });
  const kc = life(t, 69.0, 78.4);
  if (kc > 0.01) chip(G, 540, 1140, '5 semanas, 4 saltos', kc, ZERO, C.night, 40);
  riseFormula(G, t, 78.8, 999, 540, 1150, 60, ['7', '+', '19 · 4', '=', '83'], { colors: { '83': C.mint } });
  riseFormula(G, t, 74.6, 84.4, 540, 1260, 52, ['7 + 20 · 4', '=', '87'], { colors: { '87': C.coral } });
  badge(G, 830, 1240, pop(t, 75.2) * out(t, 84.4), false);
  riseFormula(G, t, 84.8, 999, 540, 1260, 56, [...aN('n'), '=', ...aN(1), '+', '(n − 1) · d'], { colors: {} });
  fchip(G, 540, 1385, [...aN(3), '=', '10'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 44);
}
// ---------- nivel 3 · dos pistas ----------
const QX = n => 150 + (n - 1) * 110;
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, [...aN(3), '=', '10'], out(t, 96.0), SKY, 44);
  el('rect', { x: 110, y: 937, width: 860, height: 6, rx: 3, fill: C.n3 }, S);
  for (let n = 1; n <= 8; n++) {
    const k = pop(t, 95.6 + n * .12), known = n === 3 || n === 8, found = n === 1;
    if (k <= 0.01) continue;
    el('circle', { cx: QX(n), cy: 940, r: r1((known ? 20 : 12) * k), fill: known ? C.blue : found && t > 104.6 ? C.sun : C.mist }, S);
    tag(S, QX(n), 1000, String(n), k, C.mist, 30);
  }
  tag(S, QX(3), 896, '10', pop(t, 96.6), C.cream, 44); tag(S, QX(8), 896, '25', pop(t, 96.8), C.cream, 44);
  for (let j = 0; j < 5; j++) hop(S, QX(3 + j) + 14, QX(4 + j) - 14, 920, 40, eo(seg(t, 98.4 + j * .3, 98.8 + j * .3)), C.sun, 5);
  riseFormula(S, t, 98.8, 107.4, 540, 1110, 52, ['25 − 10', '=', '15', 'en 5 saltos'], { colors: {} });
  riseFormula(S, t, 103.0, 107.4, 540, 1210, 60, ['d', '=', '15 ÷ 5', '=', '3'], { colors: { '3': C.mint } });
  for (let j = 0; j < 2; j++) hop(S, QX(3 - j) - 14, QX(2 - j) + 14, 960, -40, eo(seg(t, 104.2 + j * .3, 104.6 + j * .3)), C.coral, 5);
  tag(S, QX(1), 896, '4', pop(t, 104.8), C.sun, 44);
  // los medios entre 2 y 18
  const km = eio(seg(t, 107.6, 108.2)) * (1 - eio(seg(t, 114.0, 114.2)));
  if (km > 0.01) {
    [5, 10, 15, 20, 25].forEach((v, i) => {
      const mid = i > 0 && i < 4, k = mid ? pop(t, 109.4 + i * .4) : pop(t, 107.8 + (i ? .2 : 0));
      tile(S, 260 + i * 140, 1200, 100, String(v), k, mid ? MINT : POS);
    });
    tag(S, 540, 1310, '20 en 4 saltos: d = 5', pop(t, 110.6), C.mint, 40);
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Progresiones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'aritméticas', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA ALCANCÍA DE CARO', 'empieza con 7 monedas', 'y cada semana echa 4');
  label(p, t, 12.8, 18.6, 'UNA SUCESIÓN', 'una lista con puestos', 'a₃ es el tercer término');
  label(p, t, 19.0, 24.4, 'OTRA SUCESIÓN', 'los cuadrados: 1, 4, 9, 16', 'el término n es n²');
  label(p, t, 24.8, 29.0, 'DE SEMANA A SEMANA', 'siempre suma 4', '¿qué pasa si siempre suma lo mismo?');
  label(p, t, 31.8, 37.8, 'LA DIFERENCIA d', 'lo que se suma cada vez', 'un término menos el anterior');
  label(p, t, 38.2, 44.2, 'PROGRESIÓN ARITMÉTICA', 'd puede ser positiva', 'o negativa: la escalera baja');
  label(p, t, 44.6, 50.2, 'Y TAMBIÉN CERO', 'd = 0: todos iguales', 'una escalera plana');
  label(p, t, 50.6, 56.6, 'LA PREGUNTA', '¿cuántas en la semana 20?', 'sin contar una por una');
  label(p, t, 60.0, 66.0, 'POSTES Y SALTOS', 'cinco semanas en fila', 'entre ellas, saltos de 4');
  label(p, t, 66.4, 72.2, 'CUENTA LOS SALTOS', 'de la semana 1 a la 5', 'hay 4 saltos, no 5');
  label(p, t, 72.6, 78.4, 'LA TRAMPA', 'contar 20 saltos está mal', '20 semanas, 19 saltos');
  label(p, t, 78.8, 84.4, 'LA SEMANA 20', 'las 7 del comienzo', 'más 19 saltos de 4: 83');
  label(p, t, 84.8, 90.4, 'EL TÉRMINO GENERAL', 'el primero más n − 1 saltos', '¿y si no sé el primero?');
  label(p, t, 95.4, 101.4, 'DOS PISTAS', 'el término 3 es 10', 'y el término 8 es 25');
  label(p, t, 101.8, 107.4, 'SALTOS ENTRE PISTAS', 'de 3 a 8 hay 5 saltos', 'suben 15: cada uno, 3');
  label(p, t, 107.8, 114.0, 'MEDIOS ARITMÉTICOS', 'tres números entre 5 y 25', '10, 15 y 20');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SUCESIÓN', [...aN(1), ',', ...aN(2), ',', ...aN(3), ', …']],
  ['DIFERENCIA', ['d', '=', ...aN('n + 1'), '−', ...aN('n')]],
  ['TÉRMINO GENERAL', [...aN('n'), '=', ...aN(1), '+', '(n − 1) · d']],
  ['DOS PISTAS', 'lo que suben, entre los saltos, da d'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }];
  for (let i = 1; i < 4; i++) ev.push({ t: 7.6 + i * .7, type: 'count', i });
  for (let i = 0; i < 4; i++) ev.push({ t: 13.0 + i * .3, type: 'tile', i });
  ev.push({ t: 15.2, type: 'rise' });
  for (let i = 0; i < 4; i++) ev.push({ t: 19.2 + i * .35, type: 'pop', i });
  ev.push({ t: 21.4, type: 'rise' });
  for (let i = 0; i < 3; i++) ev.push({ t: 24.6 + i * .3, type: 'slide', d: .5 });
  ev.push({ t: 32.6, type: 'rise' }, { t: 33.4, type: 'yes' });
  for (let i = 0; i < 4; i++) ev.push({ t: 38.6 + i * .3, type: 'count', i }, { t: 40.4 + i * .3, type: 'count', i: 4 - i }, { t: 44.8 + i * .3, type: 'tile', i });
  ev.push({ t: 52.4, type: 'pop', i: 2 });
  for (let i = 0; i < 5; i++) ev.push({ t: 60.2 + i * .35, type: 'tile', i });
  for (let i = 0; i < 4; i++) ev.push({ t: 66.4 + i * .45, type: 'count', i });
  ev.push({ t: 69.0, type: 'card' }, { t: 74.6, type: 'rise' }, { t: 75.2, type: 'no' }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 84.8, type: 'rise' }, { t: 87.8, type: 'pop', i: 3 });
  for (let n = 1; n <= 8; n++) ev.push({ t: 95.6 + n * .12, type: 'tile', i: n });
  for (let j = 0; j < 5; j++) ev.push({ t: 98.4 + j * .3, type: 'count', i: j });
  ev.push({ t: 98.8, type: 'rise' }, { t: 103.0, type: 'rise' }, { t: 103.6, type: 'yes' }, { t: 104.2, type: 'slide', d: .6 }, { t: 104.8, type: 'pop', i: 1 });
  ev.push({ t: 107.8, type: 'tile', i: 0 }, { t: 108.0, type: 'tile', i: 4 });
  for (let i = 1; i < 4; i++) ev.push({ t: 109.4 + i * .4, type: 'pop', i });
  ev.push({ t: 110.8, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro guarda monedas en una alcancía.'],
  [4.0, 6.4, '¿Cuántas tendrá en la semana veinte?'],
  [6.8, 9.6, 'Empieza con siete, y cada semana echa cuatro.'],
  [9.8, 12.4, 'Siete, once, quince, diecinueve…'],
  [12.8, 15.6, 'Una lista en orden es una sucesión.'],
  [15.8, 18.6, 'El tercero, a tres, es quince.'],
  [19.0, 21.8, 'Hay sucesiones de todo tipo.'],
  [22.0, 24.4, 'Cuadrados: a n es n al cuadrado.'],
  [24.8, 29.0, 'La de Caro tiene algo especial: siempre suma cuatro.'],
  [31.8, 34.8, 'Lo que se suma es la diferencia, d.'],
  [35.0, 37.8, 'Se halla restando al término el anterior.'],
  [38.2, 41.0, 'Si d no cambia, es una progresión aritmética.'],
  [41.2, 44.2, 'Con d negativa, la escalera baja.'],
  [44.6, 47.4, 'Y con d igual a cero,'],
  [47.6, 50.2, 'todos los términos son iguales.'],
  [50.6, 53.6, 'Volvamos a Caro: ¿y la semana veinte?'],
  [53.8, 56.6, 'Ojo: aquí casi todos caen en una trampa.'],
  [60.0, 63.0, 'Pongamos cinco semanas en fila.'],
  [63.2, 66.0, 'Cada una, cuatro más que la anterior.'],
  [66.4, 69.2, 'De la semana uno a la cinco,'],
  [69.4, 72.2, 'hay cuatro saltos, no cinco.'],
  [72.6, 75.4, 'Aquí está la trampa:'],
  [75.6, 78.4, 'no son veinte saltos, son diecinueve.'],
  [78.8, 81.6, 'Las siete del comienzo,'],
  [81.8, 84.4, 'más diecinueve saltos de cuatro: ochenta y tres.'],
  [84.8, 87.6, 'El primero, más n menos uno saltos.'],
  [87.8, 90.4, '¿Y si no conocemos el primero?'],
  [95.4, 98.4, 'Dos pistas: el término tres es diez,'],
  [98.6, 101.4, 'y el ocho es veinticinco.'],
  [101.8, 104.6, 'Entre ellos hay cinco saltos que suben quince:'],
  [104.8, 107.4, 'cada salto es tres; el primero, cuatro.'],
  [107.8, 110.6, 'Los números de en medio son los medios:'],
  [110.8, 114.0, 'entre cinco y veinticinco caben diez, quince y veinte.'],
  [115.4, 119.6, 'En la semana veinte, Caro tiene ochenta y tres monedas:'],
  [119.8, 124.4, 'siete, más diecinueve saltos de cuatro.'],
];
