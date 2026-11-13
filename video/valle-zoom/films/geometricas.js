// «Progresiones geométricas» (lección alg-14c de Zuka, Escalera de Sigma, video 3) en estilo Scale Zoom Explainer.
// Ejemplos (los de las escenas de respaldo; no salen en los ejercicios de la lección): la hoja que se dobla 1, 2, 4, 8, 16 capas,
// 1, 3, 5, 7, 9 frente a 1, 2, 4, 8, 16, las razones 800, 400, 200, 100 (r = 1/2) y 1, −2, 4, −8 (r = −2), 3, 6, 12, … con
// a₇ = 3 · 2⁶ = 192 y los medios entre 2 y 162 (r = ±3).
// Hilo (docs/storytelling-videos.md): Ana dobla una hoja de 0.1 mm. ¿Cuántos dobleces harían falta para llegar a la Luna?
// La sorpresa: multiplicar crece lento al principio y luego se dispara. Cierre: con 42 dobleces (si se pudiera doblar tanto)
// el grosor sería 0.1 mm · 2⁴² ≈ 440 000 km, más que los 384 400 km a la Luna; 42 hojas apiladas miden 4.2 mm.
// Niveles: 0 los dobleces → 1 por «× 2»: la razón → 2 por a₇: el término general → 3 por 2 … 162: medios geométricos.
const POSTER = 44.0;
const JX = i => 255 + i * 190;

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [350, 690], r: 80, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1385], r: 100, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 120, A: [540, 700] },
  ],
  open: { Z0: 2.4, C: [540, 900], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'la razón', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'el término 7', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'los medios', L: [330, 1560] },
  ],
  stops: ['los dobleces', 'la razón', 'el término n', 'los medios'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[22.6, 24.2], [80.0, 81.6], [119.0, 135]],
    wides: [[72.6, 74.0], [110.8, 112.2]],
    looks: [],
  },
};
const aN = (n, col) => ['a', { sub: String(n), col }];
// pila de capas de papel con base en (x, y)
function stack(p, x, y, n, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), hh = Math.min(16, 170 / n), w = 130;
  for (let j = 0; j < n; j++) el('rect', { x: x - w / 2 + (j % 2) * 4, y: r1(y - (j + 1) * hh), width: w, height: r1(Math.max(3, hh - 3)), rx: 3, fill: j % 2 ? C.cream : C.creamD }, S);
}
// barras con valores (admite negativos): centro cx, base y
function bars(p, t, t0, vals, cx, y, sc, col, cap) {
  const n = vals.length, bw = 50, gap = 64;
  vals.forEach((v, i) => {
    const x = cx + (i - (n - 1) / 2) * gap, k = pop(t, t0 + i * .3); if (k <= 0.01) return;
    const S = scaleAt(p, x, y, k), h = Math.abs(v) * sc, c = v < 0 ? NEG : col;
    shaded(S, 'rect', { x: x - bw / 2, y: v < 0 ? y : y - h, width: bw, height: Math.max(4, h), rx: 10 }, c[0], c[1], 4, 4);
    tag(S, x, v < 0 ? y + h + 40 : y - h - 16, minus(v), 1, C.cream, 32);
  });
  if (cap) tag(p, cx, y + 120, cap, pop(t, t0 + n * .3 + .2), col[0], 40);
}

// ---------- nivel 0 · los dobleces ----------
function level0(G, t) {
  starField(G, 11, 150);
  el('rect', { x: 120, y: 1000, width: 840, height: 8, rx: 4, fill: C.n3 }, G);
  [1, 2, 4, 8].forEach((n, i) => {
    stack(G, JX(i), 1000, n, pop(t, [1.0, 9.8, 12.8, 14.0][i]));
    tag(G, JX(i), 1056, n === 1 ? '1 capa' : `${n} capas`, pop(t, [6.8, 10.0, 13.0, 14.2][i]), C.mist, 32);
  });
  dots(G, 965, 930, pop(t, 10.4));
  for (let i = 0; i < 3; i++) {
    const t0 = 13.0 + i * .5;
    hop(G, JX(i) + 40, JX(i + 1) - 40, 780, 46, eo(seg(t, t0, t0 + .5)), C.sun, 6);
    if (i === 0) fchip(G, 350, 690, ['× 2'], pop(t, t0 + .3) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 40);
    else tag(G, (JX(i) + JX(i + 1)) / 2, 706, '× 2', pop(t, t0 + .3), C.sun, 40);
  }
  bars(G, t, 19.2, [1, 3, 5, 7, 9], 260, 1250, 8, MINT, null);
  bars(G, t, 20.4, [1, 2, 4, 8, 16], 580, 1250, 8, ZERO, null);
  tag(G, 260, 1310, 'suma 2', pop(t, 20.4), C.mint, 38); tag(G, 580, 1310, 'por 2', pop(t, 21.8), C.sun, 38);
}
// ---------- nivel 1 · la razón ----------
function level1(G, t) {
  starField(G, 21, 90);
  fchip(G, 540, 700, ['× 2'], 1, ZERO, 40);
  riseFormula(G, t, 32.6, 999, 540, 870, 58, ['r', '=', '4 ÷ 2', '=', '2'], { colors: { '2': C.sun } });
  bars(G, t, 38.6, [800, 400, 200, 100], 300, 1150, .3, SKY, 'r = 1/2');
  bars(G, t, 44.8, [1, -2, 4, -8], 780, 1100, 14, MINT, null);
  tag(G, 780, 1260, 'r = −2', pop(t, 46.4), C.coral, 40);
  fchip(G, 540, 1385, aN(7), pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 54);
}
// ---------- nivel 2 · el término general ----------
const PX = i => 150 + i * 130, SEQ = [3, 6, 12, 24, 48, 96, 192];
function level2(G, t) {
  starField(G, 33, 90);
  fchip(G, 540, 700, aN(7), out(t, 61.0), ZERO, 54);
  SEQ.forEach((v, i) => {
    chip(G, PX(i), 960, String(v), pop(t, 60.4 + i * .3), i === 6 ? ZERO : i ? POS : MINT, C.night, 36);
    tag(G, PX(i), 1030, `a${'₁₂₃₄₅₆₇'[i]}`, pop(t, 60.6 + i * .3), C.mist, 30);
    if (i < 6) {
      const t0 = 66.4 + i * .4;
      hop(G, PX(i) + 22, PX(i + 1) - 22, 920, 40, eo(seg(t, t0, t0 + .35)), C.sun, 5);
      tag(G, (PX(i) + PX(i + 1)) / 2, 862, String(i + 1), pop(t, t0 + .25), C.sun, 34);
    }
  });
  riseFormula(G, t, 72.6, 84.4, 540, 1260, 52, ['3 · 2', { sup: '7' }, '=', '384'], { colors: { '384': C.coral } });
  badge(G, 760, 1240, pop(t, 73.4) * out(t, 84.4), false);
  riseFormula(G, t, 78.8, 999, 540, 1140, 60, ['3 · 2', { sup: '6' }, '=', '192'], { colors: { '192': C.mint } });
  riseFormula(G, t, 84.8, 999, 540, 1260, 58, [...aN('n'), '=', ...aN(1), '·', 'r', { sup: 'n − 1' }], { colors: {} });
  fchip(G, 540, 1385, ['2 … 162'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 44);
}
// ---------- nivel 3 · los medios ----------
const MX = i => 220 + i * 160;
function level3(G, t) {
  starField(G, 45, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['2 … 162'], out(t, 96.0), SKY, 44);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 1000, k1);
    [2, 6, 18, 54, 162].forEach((v, i) => {
      const mid = i > 0 && i < 4;
      chip(R, MX(i), 900, mid && t < 101.8 ? '?' : String(v), mid ? pop(t, 96.6 + i * .2) : pop(t, 95.8 + (i ? .3 : 0)), mid ? MINT : POS, C.night, 40);
      chip(R, MX(i), 1010, minus(i % 2 ? -v : v), pop(t, 104.6 + i * .25), mid ? (i % 2 ? NEG : MINT) : POS, C.night, 40);
      if (i < 4) tag(R, (MX(i) + MX(i + 1)) / 2, 830, '× r', pop(t, 97.6 + i * .3), C.sun, 34);
    });
    riseFormula(R, t, 98.8, 107.4, 540, 1150, 58, ['2 · r', { sup: '4' }, '=', '162'], { colors: {} });
    riseFormula(R, t, 101.6, 107.4, 540, 1260, 58, ['r', { sup: '4' }, '=', '81', ',', 'r', '=', '3', 'o', '−3'], { colors: { '3': C.mint, '−3': C.coral } });
  }
  // la hoja hasta la Luna
  const km = pop(t, 108.0);
  if (km > 0.01) {
    const M = scaleAt(S, 780, 900, km);
    shaded(M, 'circle', { cx: 780, cy: 900, r: 110 }, C.cream, C.creamD, 6, 6);
    for (const [x, y, r] of [[740, 870, 22], [810, 940, 16], [800, 850, 12]]) el('circle', { cx: x, cy: y, r, fill: C.creamD }, M);
    tag(M, 780, 1070, '384 400 km', 1, C.mist, 36);
  }
  const kp = eo(seg(t, 108.6, 110.2));
  if (kp > 0.01) { el('rect', { x: 236, y: r1(1260 - 520 * kp), width: 28, height: r1(520 * kp), rx: 6, fill: C.cream }, S); }
  tag(S, 250, 1310, '2⁴² capas', pop(t, 109.0), C.cream, 38);
  riseFormula(S, t, 110.6, 999, 610, 1200, 46, ['0.1 mm · 2', { sup: '42' }, '≈', '440 000 km'], { colors: { '440 000 km': C.sun } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Progresiones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'geométricas', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA HOJA DE ANA', 'tiene 0.1 mm de grosor', 'y la dobla por la mitad');
  label(p, t, 12.8, 18.6, 'CADA DOBLEZ', 'las capas se duplican', '1, 2, 4, 8…');
  label(p, t, 19.0, 24.4, 'SUMAR O MULTIPLICAR', 'sumar 2 crece parejo', 'multiplicar por 2 se dispara');
  label(p, t, 24.8, 29.0, 'LA CLAVE', 'siempre por el mismo número', '¿cómo se llama?');
  label(p, t, 31.8, 37.8, 'LA RAZÓN r', 'un término entre el anterior', '4 ÷ 2 = 2');
  label(p, t, 38.2, 44.2, 'RAZÓN MENOR QUE 1', '800, 400, 200, 100', 'cada vez la mitad');
  label(p, t, 44.6, 50.2, 'RAZÓN NEGATIVA', '1, −2, 4, −8', 'el signo cambia en cada paso');
  label(p, t, 50.6, 56.6, 'EL SÉPTIMO', '3, 6, 12…', '¿cuánto vale el término 7?');
  label(p, t, 60.0, 66.0, 'PASO A PASO', 'cada término, el anterior por 2', 'hasta llegar al séptimo');
  label(p, t, 66.4, 72.2, 'CUENTA LAS VECES', 'del término 1 al 7', 'se multiplica 6 veces');
  label(p, t, 72.6, 78.4, 'LA TRAMPA', '3 · 2⁷ está mal', '7 términos, 6 multiplicaciones');
  label(p, t, 78.8, 84.4, 'EL TÉRMINO 7', '3 por 2 a la 6', '192');
  label(p, t, 84.8, 90.4, 'EL TÉRMINO GENERAL', 'el primero por r a la n − 1', '¿y entre dos términos?');
  label(p, t, 95.4, 101.4, 'MEDIOS GEOMÉTRICOS', 'tres números entre 2 y 162', 'cuatro veces por r');
  label(p, t, 101.8, 107.4, 'DOS RESPUESTAS', 'r a la 4 es 81', 'r = 3 o r = −3');
  label(p, t, 107.8, 114.0, 'VOLVAMOS A LA HOJA', '1 capa, y 42 veces por 2', '2⁴² capas: más allá de la Luna');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['GEOMÉTRICA', 'siempre por el mismo número'],
  ['LA RAZÓN', ['r', '=', ...aN('n + 1'), '÷', ...aN('n')]],
  ['TÉRMINO GENERAL', [...aN('n'), '=', ...aN(1), '·', 'r', { sup: 'n − 1' }]],
  ['MEDIOS', ['r', { sup: 'saltos' }, '=', 'último ÷ primero']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }];
  for (const t0 of [9.8, 12.8, 14.0]) ev.push({ t: t0, type: 'paint', d: .4 });
  for (let i = 0; i < 3; i++) ev.push({ t: 13.0 + i * .5, type: 'slide', d: .5 });
  for (let i = 0; i < 5; i++) ev.push({ t: 19.2 + i * .3, type: 'count', i }, { t: 20.4 + i * .3, type: 'count', i: i + 2 });
  ev.push({ t: 32.6, type: 'rise' }, { t: 33.2, type: 'yes' });
  for (let i = 0; i < 4; i++) ev.push({ t: 38.6 + i * .3, type: 'tile', i }, { t: 44.8 + i * .3, type: 'tile', i: i + 2 });
  ev.push({ t: 52.4, type: 'pop', i: 2 });
  for (let i = 0; i < 7; i++) ev.push({ t: 60.4 + i * .3, type: 'tile', i });
  for (let i = 0; i < 6; i++) ev.push({ t: 66.4 + i * .4, type: 'count', i });
  ev.push({ t: 72.6, type: 'rise' }, { t: 73.4, type: 'no' }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 84.8, type: 'rise' }, { t: 87.8, type: 'pop', i: 3 });
  for (let i = 0; i < 4; i++) ev.push({ t: 97.6 + i * .3, type: 'count', i });
  ev.push({ t: 98.8, type: 'rise' }, { t: 101.6, type: 'rise' }, { t: 101.8, type: 'merge', i: 1 }, { t: 102.2, type: 'yes' });
  for (let i = 0; i < 5; i++) ev.push({ t: 104.6 + i * .25, type: 'tile', i });
  ev.push({ t: 108.0, type: 'pop', i: 0 }, { t: 108.6, type: 'fly', d: 1.6 }, { t: 110.6, type: 'rise' }, { t: 111.2, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana tiene una hoja de papel.'],
  [4.0, 6.4, '¿Cuántos dobleces hasta la Luna?'],
  [6.8, 9.6, 'Tiene una décima de milímetro de grosor.'],
  [9.8, 12.4, 'Al doblarla, una capa se vuelve dos.'],
  [12.8, 15.6, 'Dos se vuelven cuatro; cuatro, ocho.'],
  [15.8, 18.6, 'Cada doblez multiplica por dos.'],
  [19.0, 21.8, 'Sumar dos cada vez crece parejo.'],
  [22.0, 24.4, 'Multiplicar empieza lento y se dispara.'],
  [24.8, 29.0, 'Una lista que siempre multiplica por lo mismo es geométrica.'],
  [31.8, 34.8, 'Ese número fijo es la razón, r.'],
  [35.0, 37.8, 'Se halla dividiendo un término entre el anterior.'],
  [38.2, 41.0, 'Si la razón es un medio,'],
  [41.2, 44.2, 'cada término es la mitad del anterior.'],
  [44.6, 47.4, 'Si es negativa, el signo salta:'],
  [47.6, 50.2, 'positivo, negativo, positivo…'],
  [50.6, 53.6, 'Tres, seis, doce… ¿cuánto vale el séptimo?'],
  [53.8, 56.6, 'Ojo, que aquí hay una trampa.'],
  [60.0, 63.0, 'Paso a paso: tres, seis, doce,'],
  [63.2, 66.0, 'y así, cada vez el doble.'],
  [66.4, 69.2, 'Contemos las multiplicaciones:'],
  [69.4, 72.2, 'del primero al séptimo, son seis.'],
  [72.6, 75.4, 'Trampa: dos a la siete es de más.'],
  [75.6, 78.4, 'Siete términos, seis multiplicaciones.'],
  [78.8, 81.6, 'Tres por dos a la sexta:'],
  [81.8, 84.4, 'ciento noventa y dos.'],
  [84.8, 87.6, 'Primero por r a la n menos uno.'],
  [87.8, 90.4, '¿Y si conocemos dos términos lejanos?'],
  [95.4, 98.4, 'Tres números entre dos y ciento sesenta y dos.'],
  [98.6, 101.4, 'Son medios geométricos: cuatro veces por r.'],
  [101.8, 104.6, 'r a la cuarta es ochenta y uno.'],
  [104.8, 107.4, 'r es tres, o menos tres.'],
  [107.8, 110.6, 'La hoja: una capa; cada doblez, por dos.'],
  [110.8, 114.0, 'Cuarenta y dos dobleces: dos a la cuarenta y dos.'],
  [115.4, 119.6, 'Con cuarenta y dos dobleces, si se pudiera, llegaría a la Luna.'],
  [119.8, 124.4, 'Cuarenta y dos hojas apiladas no llegan a medio centímetro.'],
];
