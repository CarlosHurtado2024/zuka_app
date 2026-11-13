// «Regla de tres» (lección alg-12f de Zuka, Mercado de las razones, video 3) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (4 kg de arroz por 10 000 y 7 kg, comida para 8 personas 15 días y 12 personas,
// 3 impresoras, 900 hojas, 5 min → 5 impresoras y 1 800 hojas), que tests/razones-desde-cero.test.js mantiene fuera de los
// ejercicios. Hilo (docs/storytelling-videos.md): Beto atiende el puesto de arroz y cada cliente le trae un problema.
// Niveles: 0 la tabla → 1 por «× 2 → × 2»: directa → 2 por las 8 personas: inversa → 3 por la impresora: compuesta.
const POSTER = 79.4;
const TB = { x: 270, y: 780, w: 540, rh: 92 };
const RT = (r, c, R) => [TB.x + TB.w * (c + .5) / 2, TB.y + TB.rh * (r + .5)];

const FILM = {
  DUR: 135, endAt: 119.4,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1320], r: 100, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1330], r: 110, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1340], r: 85, A: [540, 600] },
  ],
  open: { Z0: 2.3, C: [420, 640], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'directa', L: [330, 1530] },
    { fire: 53.0, lock: 53.6, name: 'inversa', L: [330, 1530] },
    { fire: 88.6, lock: 89.2, name: 'compuesta', L: [330, 1530] },
  ],
  stops: ['la tabla', 'directa', 'inversa', 'compuesta'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 116.6, 126.0],
    smiles: [[46.2, 47.8], [80.6, 82.2], [116.0, 117.6], [124.0, 140]],
    wides: [[85.0, 86.4]],
    looks: [],
  },
};

// ---------- piezas ----------
function sack(p, x, y, s, k, lbl) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'path', { d: `M${r1(x - s * .34)},${r1(y - s * .26)}Q${r1(x - s * .5)},${r1(y + s * .46)} ${x},${r1(y + s * .46)}Q${r1(x + s * .5)},${r1(y + s * .46)} ${r1(x + s * .34)},${r1(y - s * .26)}Z` }, C.cream, C.creamD, s * .06, s * .06);
  el('path', { d: `M${r1(x - s * .34)},${r1(y - s * .26)}Q${x},${r1(y - s * .48)} ${r1(x + s * .34)},${r1(y - s * .26)}`, fill: C.creamD }, S);
  el('rect', { x: r1(x - s * .3), y: r1(y - s * .3), width: r1(s * .6), height: r1(s * .08), rx: r1(s * .04), fill: C.sunD }, S);
  if (lbl) tag(S, x, r1(y + s * .2), lbl, 1, C.night, s * .26);
}
function grid(p, t, t0, rows, hdr, k = 1) {                            // la tabla de la regla de tres
  const kf_ = eio(seg(t, t0, t0 + .6)) * k; if (kf_ <= 0.01) return;
  const cols = hdr.length, w = TB.w, h = TB.rh * rows.length + TB.rh * .9;
  el('rect', { x: TB.x, y: TB.y - TB.rh * .9, width: r1(w * kf_), height: h, rx: 18, fill: C.n3 }, p);
  for (let c = 1; c < cols; c++) el('rect', { x: r1(TB.x + w * c / cols - 2), y: TB.y - TB.rh * .9, width: 4, height: r1(h * kf_), fill: C.night }, p);
  el('rect', { x: TB.x, y: TB.y - 2, width: r1(w * kf_), height: 4, fill: C.night }, p);
  hdr.forEach((s, c) => tag(p, TB.x + w * (c + .5) / cols, TB.y - TB.rh * .3, s, kf_, C.mist, 36));
  rows.forEach(([cells, tr], r) => cells.forEach((s, c) => tag(p, TB.x + w * (c + .5) / cols, TB.y + TB.rh * (r + .5) + 16, s, pop(t, tr + c * .25) * k, s === 'x' ? C.sun : C.cream, 50)));
}
function printer(p, x, y, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  el('rect', { x: x - 28, y: y - 52, width: 56, height: 40, fill: C.cream }, S);
  shaded(S, 'rect', { x: x - 50, y: y - 20, width: 100, height: 56, rx: 12 }, C.blue, C.blueD, 4, 4);
  el('rect', { x: x - 30, y: y + 20, width: 60, height: 30, fill: C.cream }, S);
  el('circle', { cx: x + 32, cy: y - 4, r: 6, fill: C.mint }, S);
}

// ---------- nivel 0 · la tabla ----------
function level0(G, t) {
  starField(G, 7, 150);
  if (t < 6.4) halo(G, 420, 640, 160, 220);
  for (let i = 0; i < 4; i++) sack(G, 240 + i * 120, 640, 110, 1 + .1 * wob(t, 7.0 + i * .12, 14, 6), 'kg');
  chip(G, 860, 640, '$10 000', pop(t, 8.0), ZERO, C.night, 44);
  grid(G, t, 12.8, [[['4', '10 000'], 18.8], [['7', 'x'], 19.8]], ['kilos', 'pesos']);
  const kh = pop(t, 21.4) * out(t, 24.6);
  if (kh > 0.01) { el('rect', { x: TB.x + 20, y: TB.y + 6, width: TB.w / 2 - 40, height: TB.rh * 2 - 12, rx: 14, fill: 'none', stroke: C.mint, 'stroke-width': 6 }, G); el('rect', { x: TB.x + TB.w / 2 + 20, y: TB.y + 6, width: TB.w / 2 - 40, height: TB.rh * 2 - 12, rx: 14, fill: 'none', stroke: C.sun, 'stroke-width': 6 }, G); }
  chip(G, 540, 1320, '× 2  →  × 2 ?', pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), MINT, C.night, 50);
}
// ---------- nivel 1 · directa ----------
function level1(G, t) {
  starField(G, 17, 90);
  chip(G, 540, 700, '× 2  →  × 2', 1, MINT, C.night, 50);
  const m = eio(seg(t, 44.2, 45.2));
  for (let i = 0; i < 7; i++) {
    const x = i < 4 ? lerp(360 + i * 120, 180 + i * 120, m) : 180 + i * 120, k = i < 4 ? pop(t, 32.0 + i * .12) : pop(t, 44.8 + (i - 4) * .2);
    sack(G, x, 860, 104, k, 'kg');
    const kp = i < 4 ? pop(t, 36.2 + i * .2) : pop(t, 45.4 + (i - 4) * .2);
    if (kp > 0.01) chip(G, x, 950, '2 500', kp, ZERO, C.night, 24);
  }
  riseFormula(G, t, 36.4, 49.8, 540, 1080, 66, ['10 000 ÷ 4', '=', '2 500'], { colors: { '2 500': C.sun } });
  riseFormula(G, t, 46.2, 999, 540, 1190, 66, ['7 · 2 500', '=', '17 500'], { colors: { '17 500': C.sun } });
  riseFormula(G, t, 50.4, 999, 540, 1080, 62, [{ fr: ['4', '7'] }, '=', { fr: ['10 000', 'x'] }]);
  chip(G, 540, 1330, '8 personas · 15 días', pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), NEG, C.night, 44);
}
// ---------- nivel 2 · inversa ----------
function level2(G, t) {
  starField(G, 29, 90);
  chip(G, 540, 690, '8 personas · 15 días', out(t, 62.0), NEG, C.night, 44);
  const m = eio(seg(t, 78.6, 80.4));
  for (let i = 0; i < 120; i++) {
    const r0 = Math.floor(i / 15), c0 = i % 15, r1_ = Math.floor(i / 10), c1 = i % 10;
    const x = lerp(260 + c0 * 40, 360 + c1 * 40, m), y = lerp(800 + r0 * 40, 760 + r1_ * 40, m) - 30 * Math.sin(Math.PI * m) * ((i % 7) / 7);
    const k = pop(t, 60.2 + r0 * .25 + c0 * .01); if (k <= 0.01) continue;
    el('circle', { cx: r1(x), cy: r1(y), r: r1(14 * k), fill: r0 % 2 ? C.sun : C.sunD }, G);
  }
  const k8 = pop(t, 62.4) * out(t, 78.4), k12 = pop(t, 80.6) * (1 - eio(seg(t, 84.3, 84.6)) * (1 - eio(seg(t, 90.0, 90.3))));
  tag(G, 240, 950, '8 personas', k8, C.coral, 36, 'end'); tag(G, 540, 772, '15 días', k8, C.mint, 40);
  tag(G, 340, 1000, '12 personas', k12, C.coral, 36, 'end'); tag(G, 540, 732, '10 días', k12, C.mint, 40);
  riseFormula(G, t, 72.6, 78.2, 540, 1270, 70, ['8 · 15', '=', '120', 'raciones'], { colors: { '120': C.sun } });
  riseFormula(G, t, 80.8, 999, 540, 1270, 64, ['12 · x', '=', '120', { s: 'arrow' }, 'x = 10'], { colors: { 'x = 10': C.sun } });
  chip(G, 540, 690, '¿22.5 días?', life(t, 84.6, 90.0), NEG, C.night, 48);
  badge(G, 720, 690, life(t, 85.2, 90.0), false);
  printer(G, 540, 1340, pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)));
}
// ---------- nivel 3 · compuesta ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 119.4, 120.0)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  for (let i = 0; i < 3; i++) printer(S, 540 + (i - 1) * 130, 600, i === 1 ? 1 : pop(t, 95.4 + i * .2));
  TB.x = 160; TB.w = 760;
  grid(S, t, 96.0, [[['3', '900', '5'], 97.0], [['5', '1 800', 'x'], 98.4]], ['impresoras', 'hojas', 'minutos']);
  TB.x = 270; TB.w = 540;
  riseFormula(S, t, 101.8, 999, 540, 1150, 60, ['5 ·', { fr: ['3', '5'] }, '=', '3 min'], { colors: { '3 min': C.mint } });
  riseFormula(S, t, 107.8, 999, 540, 1240, 60, ['3 · 2', '=', '6 min'], { colors: { '6 min': C.mint } });
  riseFormula(S, t, 113.8, 999, 540, 1330, 62, ['5 ·', { fr: ['3', '5'] }, '· 2', '=', '6 min'], { fill: C.sun });
  tag(S, 300, 1100, 'inversa', life(t, 102.4, 107.6), C.coral, 36); tag(S, 300, 1190, 'directa', life(t, 108.4, 113.6), C.mint, 36);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'La regla', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'de tres', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL ARROZ DE BETO', '4 kilos cuestan 10 000', 'una clienta pide 7 kilos');
  label(p, t, 12.8, 18.4, 'LA TABLA', 'una columna por magnitud', 'una fila por situación');
  label(p, t, 18.8, 24.4, 'NO MEZCLAR', 'kilos con kilos', 'pesos con pesos');
  label(p, t, 24.8, 29.0, '¿DIRECTA O INVERSA?', 'el doble de kilos…', '¿el doble de pesos?');
  label(p, t, 31.8, 37.6, 'DIRECTA', 'las dos crecen juntas', 'por el mismo número');
  label(p, t, 38.0, 43.8, 'A LA UNIDAD', 'un kilo: 10 000 ÷ 4', '2 500 pesos');
  label(p, t, 44.2, 49.8, 'SIETE KILOS', 'siete veces 2 500', '17 500 pesos');
  label(p, t, 50.2, 56.6, 'CON PROPORCIÓN', '4 es a 7 como 10 000 es a x', 'en cruz sale lo mismo');
  label(p, t, 60.0, 65.8, 'OTRO PROBLEMA', '8 personas, comida para 15 días', 'llegan 4 más: ¿cuántos días?');
  label(p, t, 66.2, 72.2, 'INVERSA', 'el doble de personas', 'la mitad de días');
  label(p, t, 72.6, 78.2, 'EL PRODUCTO', '8 · 15 = 120 raciones', 'esas no cambian');
  label(p, t, 78.6, 84.2, '12 PERSONAS', 'se comen las mismas 120', '12 · x = 120: 10 días');
  label(p, t, 84.6, 90.2, 'EL ERROR', 'hacerla directa da 22.5 días', '¿más gente y más días? no');
  label(p, t, 95.4, 101.4, 'COMPUESTA', '3 impresoras: 900 hojas en 5 min', '¿5 impresoras y 1 800 hojas?');
  label(p, t, 101.8, 107.4, 'UNA A LA VEZ', 'más impresoras, menos tiempo', 'inversa: 5 · 3/5 = 3 min');
  label(p, t, 107.8, 113.4, 'LUEGO LAS HOJAS', 'doble de hojas, doble de tiempo', 'directa: 3 · 2 = 6 min');
  label(p, t, 113.8, 119.2, 'EN UNA CUENTA', 'directa va al derecho', 'inversa va volteada');
};
FILM.summary = (p, t) => summaryList(p, t, 120.0, 'En resumen', [
  ['1 · LA TABLA', 'una columna por magnitud'],
  ['2 · DECIDE', 'directa o inversa'],
  ['3 · RESUELVE', 'iguala razones o productos'],
  ['4 · REVISA', '¿el resultado tiene sentido?'],
  ['COMPUESTA', 'una magnitud a la vez'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 4; i++) ev.push({ t: 7.0 + i * .12, type: 'count', i });
  ev.push({ t: 8.0, type: 'pop', i: 0 }, { t: 12.8, type: 'line', d: .6 });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) ev.push({ t: 18.8 + r + c * .25, type: 'tile', i: r * 2 + c });
  ev.push({ t: 21.4, type: 'lasso', d: .6 }, { t: 24.8, type: 'pop', i: 1 });
  for (let i = 0; i < 4; i++) ev.push({ t: 32.0 + i * .12, type: 'tile', i }, { t: 36.2 + i * .2, type: 'count', i });
  ev.push({ t: 36.4, type: 'rise' }, { t: 44.2, type: 'slide', d: 1.0 });
  for (let i = 0; i < 3; i++) ev.push({ t: 44.8 + i * .2, type: 'tile', i: i + 4 });
  ev.push({ t: 46.2, type: 'rise' }, { t: 46.8, type: 'yes' }, { t: 50.4, type: 'rise' }, { t: 52.4, type: 'pop', i: 2 });
  for (let r = 0; r < 8; r++) ev.push({ t: 60.2 + r * .25, type: 'tile', i: r });
  ev.push({ t: 72.6, type: 'rise' }, { t: 78.6, type: 'fly', d: 1.8 }, { t: 80.6, type: 'pop', i: 0 }, { t: 80.8, type: 'rise' }, { t: 81.4, type: 'yes' });
  ev.push({ t: 84.6, type: 'pop', i: 1 }, { t: 85.2, type: 'no' }, { t: 87.8, type: 'pop', i: 2 });
  ev.push({ t: 95.4, type: 'tile', i: 0 }, { t: 95.8, type: 'tile', i: 1 }, { t: 96.0, type: 'line', d: .6 });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) ev.push({ t: 97.0 + r * 1.4 + c * .25, type: 'tile', i: c });
  ev.push({ t: 101.8, type: 'rise' }, { t: 107.8, type: 'rise' }, { t: 113.8, type: 'rise' }, { t: 114.4, type: 'yes' });
  ev.push({ t: 119.4, type: 'away', d: .6 }, { t: 120.0, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 120.6 + k * .55, type: 'stop', i: k });
  ev.push({ t: 123.6, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto vende arroz en el mercado.'],
  [4.0, 6.4, 'Y cada cliente le trae un problema.'],
  [6.8, 9.6, 'Cuatro kilos cuestan diez mil pesos.'],
  [9.8, 12.4, 'Una clienta pide siete kilos. ¿Cuánto cobra?'],
  [12.8, 15.6, 'Primero, una tabla.'],
  [15.8, 18.4, 'Una columna por magnitud, una fila por situación.'],
  [18.8, 21.6, 'Kilos con kilos, pesos con pesos.'],
  [21.8, 24.4, 'Nunca se mezclan en una columna.'],
  [24.8, 29.0, 'Luego se decide: si los kilos se duplican, ¿los pesos también?'],
  [31.8, 34.8, 'Sí: el doble de arroz cuesta el doble.'],
  [35.0, 37.6, 'Es una regla de tres directa.'],
  [38.0, 40.8, 'Reducimos a la unidad: diez mil entre cuatro,'],
  [41.0, 43.8, 'dos mil quinientos por kilo.'],
  [44.2, 46.8, 'Siete kilos son siete veces eso:'],
  [47.0, 49.8, 'diecisiete mil quinientos pesos.'],
  [50.2, 53.2, 'Con proporción: 4 es a 7 como 10 000 es a equis.'],
  [53.4, 56.6, 'En cruz, sale lo mismo.'],
  [60.0, 63.0, 'Otro cliente: ocho personas tienen comida para quince días.'],
  [63.2, 65.8, 'Llegan cuatro más. ¿Para cuántos días alcanza?'],
  [66.2, 69.0, 'Con el doble de personas, la comida dura la mitad.'],
  [69.2, 72.2, 'Una crece y la otra baja: es inversa.'],
  [72.6, 75.4, 'Ocho personas por quince días son ciento veinte raciones.'],
  [75.6, 78.2, 'Esas raciones no cambian.'],
  [78.6, 81.4, 'Doce personas se comen las mismas ciento veinte.'],
  [81.6, 84.2, 'Doce por equis es ciento veinte: diez días.'],
  [84.6, 87.4, 'El error: hacerla directa. Saldrían 22.5 días.'],
  [87.6, 90.2, '¿Más gente, más días? No tiene sentido.'],
  [95.4, 98.4, 'El último cliente imprime: tres impresoras, novecientas hojas, cinco minutos.'],
  [98.6, 101.4, '¿Y con cinco impresoras y mil ochocientas hojas?'],
  [101.8, 104.6, 'Cambiamos una magnitud a la vez. Primero las impresoras:'],
  [104.8, 107.4, 'más impresoras, menos tiempo. Tres minutos.'],
  [107.8, 110.6, 'Luego las hojas: el doble de hojas,'],
  [110.8, 113.4, 'el doble de tiempo. Seis minutos.'],
  [113.8, 116.6, 'En una sola cuenta: la directa va al derecho,'],
  [116.8, 119.2, 'la inversa, volteada.'],
  [120.6, 124.8, 'La clienta del arroz paga diecisiete mil quinientos.'],
  [125.0, 129.8, 'La regla de tres: tabla, decide directa o inversa, resuelve y revisa.'],
];
