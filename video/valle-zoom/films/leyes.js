// «Leyes de los exponentes» (lección alg-21b de Zuka, Torres de Potencias, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios): 2³ · 2⁴ = 2⁷, 5⁶ ÷ 5² = 5⁴, 5² ÷ 5² = 5⁰, 5² ÷ 5⁵ = 5⁻³, (2³)² = 2⁶,
// (2 · 5)³ = 1 000, (1 + 2)² ≠ 1² + 2², 150 000 000 km = 1.5 × 10⁸ km, 0.000002 m = 2 × 10⁻⁶ m.
// Hilo (docs/storytelling-videos.md): Beto se cansa de escribir doses; cada ley es un atajo. Cierre: escribe en un renglón lo
// que antes ocupaba la página.
// Niveles: 0 multiplicar (torres que se juntan) → 1 por la fracción: dividir → 2 por (2³)²: potencia de potencia → 3 por el número
// gigante: notación científica.
const POSTER = 15.6;
const TWX = (i, tower) => tower === 0 ? 300 : 780, TWY = i => 1150 - i * 96;

const FILM = {
  DUR: 131, endAt: 115.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1380], r: 95, A: [540, 690] },
    { a: 57.4, b: 59.6, P: [540, 1370], r: 95, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1370], r: 120, A: [540, 690] },
  ],
  open: { Z0: 2.3, C: [300, 1000], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'dividir', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'potencia de potencia', L: [380, 1560] },
    { fire: 88.6, lock: 89.2, name: 'notación científica', L: [380, 1560] },
  ],
  stops: ['multiplicar', 'dividir', 'potencia de potencia', 'científica'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[15.0, 16.6], [66.0, 67.6], [100.4, 102.0], [120.0, 135]],
    wides: [[80.4, 81.8]],
    looks: [],
  },
};

// ---------- piezas ----------
function block(p, x, y, s, ch, k, col = ZERO) { tile(p, x, y, s, ch, k, col, C.night); }
function digits(p, t, x0, y, ds, sp, size, p0, p1, t0, dur, col = C.cream) {   // cifras y una coma que salta
  ds.split('').forEach((d, i) => text(p, r1(x0 + i * sp), y, d, { 'font-size': size, 'font-weight': 700, fill: col, 'text-anchor': 'middle' }));
  const n = Math.abs(p1 - p0), u = clamp((t - t0) / dur) * n, j = Math.floor(u), f = u - j, dir = Math.sign(p1 - p0);
  const gx = q => x0 + (q - .5) * sp, a = p0 + dir * Math.min(j, n), b = a + dir;
  const x = j >= n ? gx(p1) : lerp(gx(a), gx(b), eio(f)), yy = y + 10 - (j >= n ? 0 : 60 * Math.sin(Math.PI * eio(f)));
  el('circle', { cx: r1(x), cy: r1(yy), r: 12, fill: C.sun }, p);
  for (let q = 0; q < Math.min(j, n); q++) { const xa = gx(p0 + dir * q), xb = gx(p0 + dir * (q + 1)); hop(p, xa, xb, y + 20, 50, 1, C.sun, 4); }
}

// ---------- nivel 0 · multiplicar ----------
function level0(G, t) {
  starField(G, 7, 150);
  const m = eio(seg(t, 13.0, 14.4));
  const kt = out(t, 24.6);
  for (let i = 0; i < 3; i++) block(G, lerp(300, 540, m), TWY(i), 88, '2', kt * (1 + .1 * wob(t, 7.0 + i * .2, 14, 6)));
  for (let i = 0; i < 4; i++) block(G, lerp(780, 540, m), lerp(TWY(i), TWY(i + 3), m) - 40 * Math.sin(Math.PI * m), 88, '2', kt * pop(t, 8.4 + i * .2), MINT);
  tag(G, 300, 1250, '3 veces', (1 - m) * pop(t, 7.6), C.sun, 36); tag(G, 780, 1250, '4 veces', (1 - m) * pop(t, 9.4), C.mint, 36);
  tag(G, 540, 1250, '7 veces', pop(t, 14.6) * kt, C.cream, 40);
  riseFormula(G, t, 9.8, 12.4, 540, 1340, 66, ['2', { sup: '3' }, '·', '2', { sup: '4' }]);
  riseFormula(G, t, 14.8, 18.6, 540, 1340, 66, ['2', { sup: '3' }, '·', '2', { sup: '4' }, '=', '2', { sup: '7' }, '=', '128'], { colors: { '128': C.sun } });
  riseFormula(G, t, 19.0, 24.4, 540, 1340, 66, ['a', { sup: 'm' }, '·', 'a', { sup: 'n' }, '=', 'a', { sup: 'm + n' }], { fill: C.sun });
  riseFormula(G, t, 24.8, 999, 540, 1000, 66, ['2', { sup: '3' }, '·', '3', { sup: '4' }, '≠', '6', { sup: '7' }], { fill: C.coral });
  fchip(G, 540, 1390, [{ fr: ['5⁶', '5²'] }], pop(t, 25.0) * (1 + .1 * wob(t, 25.4, 14, 6)), SKY, 40);
}
// ---------- nivel 1 · dividir ----------
function level1(G, t) {
  starField(G, 17, 90);
  fchip(G, 540, 690, [{ fr: ['5⁶', '5²'] }], out(t, 32.4), SKY, 40);
  const kf_ = pop(t, 32.0) * out(t, 44.0);
  if (kf_ > 0.01) {
    const S = scaleAt(G, 540, 860, kf_);
    el('rect', { x: 200, y: 856, width: 680, height: 8, rx: 4, fill: C.cream }, S);
    for (let i = 0; i < 6; i++) block(S, 255 + i * 114, 780, 92, '5', 1, SKY);
    for (let i = 0; i < 2; i++) block(S, 255 + i * 114, 940, 92, '5', 1, SKY);
    for (let i = 0; i < 2; i++) {
      const k = eio(seg(t, 34.6 + i * .5, 35.2 + i * .5));
      if (k > 0.01) el('path', { d: `M${215 + i * 114},${980}L${r1(215 + i * 114 + 80 * k)},${r1(980 - 240 * k)}`, stroke: C.coral, 'stroke-width': 8, 'stroke-linecap': 'round' }, S);
    }
  }
  riseFormula(G, t, 36.0, 43.8, 540, 1110, 64, [{ fr: ['5⁶', '5²'] }, '=', '5', { sup: '6 − 2' }, '=', '5', { sup: '4' }], { colors: {} });
  riseFormula(G, t, 38.4, 43.8, 540, 1240, 60, ['a', { sup: 'm' }, '÷', 'a', { sup: 'n' }, '=', 'a', { sup: 'm − n' }], { fill: C.sun });
  riseFormula(G, t, 44.4, 999, 540, 880, 64, [{ fr: ['5²', '5²'] }, '=', '5', { sup: '0' }, '=', '1'], { colors: { '1': C.sun } });
  riseFormula(G, t, 50.6, 999, 540, 1060, 64, [{ fr: ['5²', '5⁵'] }, '=', '5', { sup: '−3' }, '=', { fr: ['1', '125'] }], { colors: {} });
  fchip(G, 540, 1370, ['(2³)', { sup: '2' }], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 48);
}
// ---------- nivel 2 · potencia de potencia ----------
function level2(G, t) {
  starField(G, 29, 90);
  fchip(G, 540, 690, ['(2³)', { sup: '2' }], out(t, 61.0), MINT, 48);
  const kt = pop(t, 60.4) * out(t, 66.2);
  if (kt > 0.01) for (let c = 0; c < 2; c++) for (let i = 0; i < 3; i++) block(G, 420 + c * 240, 1060 - i * 96, 86, '2', kt * pop(t, 60.6 + c * .6 + i * .15), MINT);
  riseFormula(G, t, 61.4, 66.2, 540, 1240, 62, ['(2³)', { sup: '2' }, '=', '2³ · 2³', '=', '2', { sup: '6' }], { colors: {} });
  riseFormula(G, t, 63.2, 66.2, 540, 1340, 58, ['(a', { sup: 'm' }, ')', { sup: 'n' }, '=', 'a', { sup: 'm · n' }], { fill: C.sun });
  riseFormula(G, t, 66.8, 72.2, 540, 900, 64, ['(2 · 5)', { sup: '3' }, '=', '2³ · 5³'], {});
  riseFormula(G, t, 68.2, 72.2, 540, 1010, 64, ['=', '8 · 125', '=', '1 000'], { colors: { '1 000': C.sun } });
  riseFormula(G, t, 72.8, 999, 540, 900, 64, ['(1 + 2)', { sup: '2' }, '=', '9'], { colors: { '9': C.mint } });
  riseFormula(G, t, 74.4, 999, 540, 1010, 64, ['1² + 2²', '=', '5'], { colors: { '5': C.coral } });
  badge(G, 820, 970, pop(t, 75.0), false);
  riseFormula(G, t, 78.8, 999, 540, 1150, 52, ['(a + b)', { sup: '2' }, '≠', 'a² + b²'], { fill: C.coral });
  chip(G, 540, 1370, '150 000 000 km', pop(t, 87.6) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, C.night, 46);
}
// ---------- nivel 3 · notación científica ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 115.2, 115.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  chip(S, 540, 690, '150 000 000 km', out(t, 96.0), ZERO, C.night, 46);
  const k1 = pop(t, 96.2) * out(t, 106.4);
  if (k1 > 0.01) { const R = scaleAt(S, 540, 860, k1); digits(R, t, 300, 880, '150000000', 60, 72, 9, 1, 97.6, 3.6); }
  riseFormula(S, t, 101.6, 106.4, 540, 1060, 70, ['1.5 × 10', { sup: '8' }, 'km'], { colors: {} , fill: C.sun });
  const k2 = pop(t, 106.8);
  if (k2 > 0.01) { const R = scaleAt(S, 540, 860, k2); digits(R, t, 360, 880, '0000002', 60, 72, 1, 7, 107.6, 2.6, C.cream); }
  riseFormula(S, t, 110.6, 999, 540, 1060, 70, ['2 × 10', { sup: '−6' }, 'm'], { fill: C.mint });
  riseFormula(S, t, 112.0, 999, 540, 1200, 54, ['a × 10', { sup: 'n' }, ',', '1 ≤ a < 10'], { fill: C.cream });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Leyes de los', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'exponentes', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LAS TORRES DE BETO', 'una de 3 doses, otra de 4', 'quiere multiplicarlas');
  label(p, t, 12.8, 18.6, 'SE JUNTAN', '3 + 4 = 7 doses', 'se suman los exponentes');
  label(p, t, 19.0, 24.4, 'PRIMER ATAJO', 'misma base, multiplicar:', 'se suman los exponentes');
  label(p, t, 24.8, 29.0, 'OJO', 'con bases distintas', 'no se juntan');
  label(p, t, 31.8, 37.6, 'DIVIDIR', 'seis cincos entre dos', 'se cancelan por parejas');
  label(p, t, 38.0, 44.0, 'SEGUNDO ATAJO', 'misma base, dividir:', 'se restan los exponentes');
  label(p, t, 44.4, 50.2, 'IGUALES', 'todo se cancela', '5 a la 0: uno, como ya vimos');
  label(p, t, 50.6, 56.6, 'MÁS ABAJO QUE ARRIBA', '2 − 5 = −3', 'un exponente negativo');
  label(p, t, 60.0, 66.2, 'TORRE DE TORRES', 'dos torres de tres doses', 'seis doses: se multiplican');
  label(p, t, 66.6, 72.4, 'UN PRODUCTO', 'el exponente va a cada factor', '8 · 125 = 1 000');
  label(p, t, 72.8, 78.6, 'CON SUMAS, NO', '(1 + 2) al cuadrado es 9', 'pero 1² + 2² es 5');
  label(p, t, 79.0, 84.8, 'LA TRAMPA', 'el exponente no se reparte', 'en una suma');
  label(p, t, 85.2, 90.4, 'NÚMEROS GIGANTES', 'del Sol a la Tierra', '150 000 000 km');
  label(p, t, 95.4, 101.4, 'SALTA EL PUNTO', '8 saltos a la izquierda', 'hasta que quede 1.5');
  label(p, t, 101.8, 106.6, 'NOTACIÓN CIENTÍFICA', '1.5 por 10 a la 8', 'el 8 cuenta los saltos');
  label(p, t, 107.0, 115.0, 'MUY PEQUEÑO', 'una bacteria: 0.000002 m', '6 saltos a la derecha: 10 a la −6');
};
FILM.summary = (p, t) => summaryList(p, t, 115.8, 'En resumen', [
  ['MULTIPLICAR', ['a', { sup: 'm' }, '·', 'a', { sup: 'n' }, '=', 'a', { sup: 'm + n' }]],
  ['DIVIDIR', ['a', { sup: 'm' }, '÷', 'a', { sup: 'n' }, '=', 'a', { sup: 'm − n' }]],
  ['POTENCIA DE POTENCIA', ['(a', { sup: 'm' }, ')', { sup: 'n' }, '=', 'a', { sup: 'm · n' }]],
  ['NUNCA EN SUMAS', ['(a + b)', { sup: '2' }, '≠', 'a² + b²']],
  ['CIENTÍFICA', ['1.5 × 10', { sup: '8' }]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 3; i++) ev.push({ t: 7.0 + i * .2, type: 'tile', i });
  for (let i = 0; i < 4; i++) ev.push({ t: 8.4 + i * .2, type: 'tile', i: i + 3 });
  ev.push({ t: 9.8, type: 'rise' }, { t: 13.0, type: 'fly', d: 1.4 }, { t: 14.4, type: 'hit' }, { t: 14.8, type: 'rise' }, { t: 15.4, type: 'yes' }, { t: 19.0, type: 'rise' }, { t: 24.8, type: 'rise' }, { t: 25.0, type: 'pop', i: 0 });
  ev.push({ t: 32.0, type: 'tile', i: 0 }, { t: 34.6, type: 'paint', d: .6 }, { t: 35.1, type: 'paint', d: .6 }, { t: 36.0, type: 'rise' }, { t: 38.4, type: 'rise' }, { t: 44.0, type: 'away', d: .4 });
  ev.push({ t: 44.4, type: 'rise' }, { t: 45.0, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 1 });
  for (let c = 0; c < 2; c++) for (let i = 0; i < 3; i++) ev.push({ t: 60.6 + c * .6 + i * .15, type: 'tile', i: c * 3 + i });
  ev.push({ t: 61.4, type: 'rise' }, { t: 63.2, type: 'rise' }, { t: 66.8, type: 'rise' }, { t: 68.2, type: 'rise' }, { t: 68.8, type: 'yes' }, { t: 72.8, type: 'rise' }, { t: 74.4, type: 'rise' }, { t: 75.0, type: 'no' }, { t: 78.8, type: 'rise' }, { t: 87.6, type: 'pop', i: 2 });
  for (let q = 0; q < 8; q++) ev.push({ t: 97.6 + q * .45, type: 'count', i: q });
  ev.push({ t: 101.6, type: 'rise' }, { t: 106.4, type: 'away', d: .4 });
  for (let q = 0; q < 6; q++) ev.push({ t: 107.6 + q * .43, type: 'count', i: q });
  ev.push({ t: 110.6, type: 'rise' }, { t: 112.0, type: 'rise' });
  ev.push({ t: 115.2, type: 'away', d: .6 }, { t: 115.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 116.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 119.4, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto tiene que escribir dos por dos por dos…'],
  [4.0, 6.4, 'muchas veces. Y se cansa.'],
  [6.8, 9.6, 'Tiene una torre de tres doses y otra de cuatro.'],
  [9.8, 12.4, 'Quiere multiplicarlas.'],
  [12.8, 15.6, 'Al juntarlas quedan siete doses:'],
  [15.8, 18.6, 'dos a la siete, ciento veintiocho.'],
  [19.0, 21.8, 'Primer atajo: con la misma base,'],
  [22.0, 24.4, 'al multiplicar se suman los exponentes.'],
  [24.8, 29.0, 'Ojo: si las bases son distintas, no se juntan.'],
  [31.8, 34.8, 'Ahora seis cincos arriba y dos abajo.'],
  [35.0, 37.6, 'Se cancelan por parejas.'],
  [38.0, 41.0, 'Quedan cuatro cincos: seis menos dos.'],
  [41.2, 44.0, 'Segundo atajo: al dividir, se restan.'],
  [44.4, 47.4, 'Si arriba y abajo hay lo mismo, todo se cancela:'],
  [47.6, 50.2, 'cinco a la cero es uno.'],
  [50.6, 53.6, 'Y si abajo hay más, la resta da negativa:'],
  [53.8, 56.6, 'cinco a la menos tres, un ciento veinticincoavo.'],
  [60.0, 63.0, 'Dos torres iguales de tres doses cada una:'],
  [63.2, 66.2, 'seis doses. Los exponentes se multiplican.'],
  [66.6, 69.4, 'Con un producto, el exponente va a cada factor:'],
  [69.6, 72.4, 'ocho por ciento veinticinco, mil.'],
  [72.8, 75.6, 'Pero con una suma, cuidado:'],
  [75.8, 78.6, 'uno más dos, al cuadrado, es nueve, no cinco.'],
  [79.0, 81.8, 'El exponente no se reparte'],
  [82.0, 84.8, 'en una suma.'],
  [85.2, 87.8, 'Ahora números gigantes:'],
  [88.0, 90.4, 'del Sol a la Tierra: 150 millones de km.'],
  [95.4, 98.4, 'El punto decimal salta ocho lugares a la izquierda'],
  [98.6, 101.4, 'hasta que queda uno punto cinco.'],
  [101.8, 104.6, 'Uno punto cinco por diez a la ocho.'],
  [104.8, 106.6, 'El ocho cuenta los saltos.'],
  [107.0, 110.4, 'Una bacteria mide dos millonésimas de metro.'],
  [110.6, 115.0, 'Seis saltos a la derecha: dos por diez a la menos seis.'],
  [116.4, 120.6, 'Beto escribe en un renglón lo que antes ocupaba una página.'],
  [120.8, 125.4, 'Los atajos tienen nombre: las leyes de los exponentes.'],
];
