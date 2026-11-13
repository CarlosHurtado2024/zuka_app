// «Cambios sucesivos» (lección alg-13d de Zuka, Mercado de las razones, video 6) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (la bicicleta de 100 000 con 20 % y 10 % → 80 000 → 72 000, la acción de
// 100 que sube y baja 50 %, −20 % y +25 %, el pueblo de 1 000 que crece 10 % tres años: 1.1³ = 1.331), que
// tests/porcentajes-desde-cero.test.js mantiene fuera de los ejercicios. Hilo (docs/storytelling-videos.md): Beto cree que
// ahorró el 30 %.
// Niveles: 0 la bicicleta → 1 por «0.8 · 0.9»: se multiplican → 2 por «+50 % −50 %»: sube y baja → 3 por el pueblo: año tras año.
const POSTER = 21.4;
const BX0 = 180, BW = 720;
const CX_ = [260, 540, 820], PY = v => 1260 - 5 * v;

const FILM = {
  DUR: 129, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1380], r: 100, A: [540, 690] },
    { a: 57.4, b: 59.6, P: [540, 1360], r: 120, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1360], r: 130, A: [540, 690] },
  ],
  open: { Z0: 2.2, C: [320, 680], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'se multiplican', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'sube y baja', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'año tras año', L: [330, 1560] },
  ],
  stops: ['la bicicleta', 'se multiplican', 'sube y baja', 'año tras año'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 120.0],
    smiles: [[39.0, 40.6], [80.8, 82.4], [109.4, 111.0], [118.0, 135]],
    wides: [[25.0, 26.4], [68.0, 69.4]],
    looks: [],
  },
};

// ---------- piezas ----------
function bike(p, x, y, s, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), u = v => r1(v * s), A = { fill: 'none', stroke: C.mint, 'stroke-width': u(.05), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  for (const sx of [-1, 1]) { el('circle', { cx: x + sx * u(.34), cy: y + u(.12), r: u(.22), fill: 'none', stroke: C.cream, 'stroke-width': u(.04) }, S); el('circle', { cx: x + sx * u(.34), cy: y + u(.12), r: u(.03), fill: C.cream }, S); }
  el('path', { ...A, d: `M${x - u(.34)},${y + u(.12)}L${x - u(.08)},${y - u(.18)}L${x + u(.2)},${y - u(.18)}L${x + u(.34)},${y + u(.12)}M${x - u(.08)},${y - u(.18)}L${x + u(.02)},${y + u(.12)}L${x + u(.2)},${y - u(.18)}M${x - u(.34)},${y + u(.12)}L${x + u(.02)},${y + u(.12)}M${x - u(.12)},${y - u(.26)}L${x - u(.02)},${y - u(.26)}M${x + u(.2)},${y - u(.18)}L${x + u(.16)},${y - u(.3)}L${x + u(.26)},${y - u(.32)}` }, S);
}
function house(p, x, y, s, k, col = C.coral) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), u = v => r1(v * s);
  shaded(S, 'rect', { x: x - u(.3), y: y - u(.1), width: u(.6), height: u(.4), rx: u(.04) }, C.cream, C.creamD, 3, 3);
  el('path', { d: `M${x - u(.38)},${y - u(.06)}L${x},${y - u(.4)}L${x + u(.38)},${y - u(.06)}Z`, fill: col }, S);
  el('rect', { x: x - u(.07), y: y + u(.1), width: u(.14), height: u(.2), fill: C.blueD }, S);
}
function chart(p, t, pts, t0, cols, lbls, k) {
  if (k <= 0.01) return;
  el('rect', { x: 200, y: PY(100) - 2, width: 680, height: 4, fill: C.n3 }, p);
  tag(p, 190, PY(100) + 12, '100', k, C.mist, 32, 'end');
  for (let i = 0; i < pts.length - 1; i++) {
    const q = eio(seg(t, t0 + 1.2 + i * 4.6, t0 + 2.2 + i * 4.6)); if (q <= 0.01) continue;
    el('path', { d: `M${CX_[i]},${r1(PY(pts[i]))}L${r1(lerp(CX_[i], CX_[i + 1], q))},${r1(lerp(PY(pts[i]), PY(pts[i + 1]), q))}`, stroke: cols[i], 'stroke-width': 8, 'stroke-linecap': 'round' }, p);
    const dx = CX_[i + 1] - CX_[i], dy = PY(pts[i + 1]) - PY(pts[i]), L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
    tag(p, (CX_[i] + CX_[i + 1]) / 2 + nx * 56, (PY(pts[i]) + PY(pts[i + 1])) / 2 + ny * 56 + 14, lbls[i], q * k, cols[i], 40);
  }
  pts.forEach((v, i) => { const kk = pop(t, t0 + (i ? 2.2 + (i - 1) * 4.6 : 0)) * k; mark(p, CX_[i], r1(PY(v)), String(v), kk, i ? cols[i - 1] : C.cream, !(i && v < pts[i - 1]), 46); });
}

// ---------- nivel 0 · la bicicleta ----------
function level0(G, t) {
  starField(G, 7, 150);
  bike(G, 320, 680, 360, 1 + .06 * wob(t, 6.8, 12, 5));
  chip(G, 770, 600, '$100 000', pop(t, 7.2), POS, C.night, 48);
  chip(G, 770, 700, '− 20 %', pop(t, 8.4), NEG, C.night, 44);
  chip(G, 770, 790, '− 10 %', pop(t, 9.6), NEG, C.night, 44);
  const kb = pop(t, 12.6);
  if (kb > 0.01) {
    const c1 = eio(seg(t, 13.6, 14.4)), c2 = eio(seg(t, 19.6, 20.4)), w0 = BW * kb;
    el('rect', { x: BX0, y: 900, width: r1(w0), height: 90, rx: 12, fill: C.mint }, G);
    if (c1 > 0.01) el('rect', { x: r1(BX0 + w0 - 144 * c1), y: 900, width: r1(144 * c1), height: 90, rx: 12, fill: C.coral }, G);
    if (c2 > 0.01) el('rect', { x: r1(BX0 + 576 - 57.6 * c2), y: 900, width: r1(57.6 * c2), height: 90, rx: 12, fill: C.coralD }, G);
    tag(G, BX0 + 288, 958, t < 20.4 ? (t < 14.8 ? '100 000' : '80 000') : '72 000', kb, C.night, 40);
  }
  riseFormula(G, t, 14.4, 999, 540, 1090, 58, ['100 000 · 0.8', '=', '80 000']);
  riseFormula(G, t, 20.4, 999, 540, 1180, 58, ['80 000 · 0.9', '=', '72 000'], { colors: { '72 000': C.sun } });
  chip(G, 790, 862, '¿30 % menos?', life(t, 24.8, 29.0), NEG, C.night, 44);
  chip(G, 540, 1380, '0.8 · 0.9', pop(t, 25.0) * (1 + .1 * wob(t, 25.4, 14, 6)), ZERO, C.night, 50);
}
// ---------- nivel 1 · se multiplican ----------
function level1(G, t) {
  starField(G, 17, 90);
  chip(G, 540, 690, '0.8 · 0.9', 1, ZERO, C.night, 50);
  riseFormula(G, t, 32.4, 999, 540, 860, 70, ['0.8 · 0.9', '=', '0.72'], { colors: { '0.72': C.sun } });
  riseFormula(G, t, 35.0, 999, 540, 960, 62, ['se paga el 72 %']);
  riseFormula(G, t, 38.4, 999, 540, 1060, 66, ['descuento', '=', '28 %'], { colors: { '28 %': C.mint } });
  const kx = pop(t, 39.4);
  if (kx > 0.01) { chip(G, 880, 940, '30 %', kx, NEG, C.night, 40); el('path', { d: 'M820,960L940,920', stroke: C.cream, 'stroke-width': 6, 'stroke-linecap': 'round' }, G); }
  // el orden no importa
  const m = eio(seg(t, 45.4, 46.6)), k2 = pop(t, 44.4) * out(t, 50.2);
  if (k2 > 0.01) {
    chip(G, lerp(400, 680, m), 1200 - 70 * Math.sin(Math.PI * m), '− 20 %', k2, NEG, C.night, 44);
    chip(G, lerp(680, 400, m), 1200 + 70 * Math.sin(Math.PI * m), '− 10 %', k2, NEG, C.night, 44);
  }
  riseFormula(G, t, 47.0, 50.2, 540, 1320, 60, ['0.9 · 0.8', '=', '0.72'], { fill: C.mint });
  chip(G, 540, 1360, '+50 %  −50 %', pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, C.night, 48);
}
// ---------- nivel 2 · sube y baja ----------
function level2(G, t) {
  starField(G, 29, 90);
  chip(G, 540, 690, '+50 %  −50 %', out(t, 61.0), MINT, C.night, 48);
  chart(G, t, [100, 150, 75], 60.4, [C.mint, C.coral], ['+50 %', '−50 %'], out(t, 78.2));
  riseFormula(G, t, 68.0, 78.0, 540, 1200, 60, ['100 · 1.5 · 0.5', '=', '75'], { colors: { '75': C.coral } });
  chart(G, t, [100, 80, 100], 78.6, [C.coral, C.mint], ['−20 %', '+25 %'], 1);
  riseFormula(G, t, 84.4, 999, 540, 1200, 60, ['80 · 1.25', '=', '100'], { colors: { '100': C.mint } });
  house(G, 540, 1360, 200, pop(t, 87.6) * (1 + .1 * wob(t, 88.6, 14, 6)));
}
// ---------- nivel 3 · año tras año ----------
const POP = [1000, 1100, 1210, 1331], YL = ['hoy', '1 año', '2 años', '3 años'];
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  house(S, 540, 690, 260, out(t, 96.0));
  POP.forEach((v, i) => {
    const t0 = 96.2 + (i ? 4.4 + (i - 1) * 1.6 : 0), k = eio(seg(t, t0, t0 + .8)), h = v * .35, x = 220 + i * 180;
    if (k <= 0.01) return;
    el('rect', { x: x - 60, y: r1(1200 - h * k), width: 120, height: r1(h * k), rx: 14, fill: i ? C.mint : C.blue }, S);
    if (i) el('rect', { x: x - 60, y: r1(1200 - h * k), width: 120, height: r1((v - POP[i - 1]) * .35 * k), rx: 14, fill: C.sun }, S);
    tag(S, x, r1(1200 - h * k - 20), v.toLocaleString('es-CO').replace(/\./g, ' '), k, C.cream, 40);
    tag(S, x, 1250, YL[i], k, C.mist, 34);
  });
  [['+100', 1], ['+110', 2], ['+121', 3]].forEach(([s, i]) => tag(S, 220 + i * 180, 1290, s, pop(t, 100.8 + (i - 1) * 1.6), C.sun, 32));
  riseFormula(S, t, 107.8, 999, 540, 640, 76, ['1.1', { sup: '3' }, '=', '1.331'], { colors: { '1.331': C.sun } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Cambios', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'sucesivos', { 'font-size': 92, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA BICI DE BETO', '100 000, con 20 % de descuento', 'y en caja, otro 10 % de descuento');
  label(p, t, 12.8, 18.4, 'PRIMERO EL 20 %', 'queda el 80 %', '80 000');
  label(p, t, 18.8, 24.4, 'LUEGO EL 10 %', 'sobre 80 000, no sobre 100 000', 'queda 72 000');
  label(p, t, 24.8, 29.0, '¿EL 30 %?', 'Beto pagó 72 000', 'no es 30 % menos');
  label(p, t, 31.8, 37.8, 'SE MULTIPLICAN', 'los factores: 0.8 por 0.9', '0.72: se paga el 72 %');
  label(p, t, 38.2, 44.0, 'DESCUENTO REAL', '28 %, no 30 %', 'el 10 % fue sobre menos');
  label(p, t, 44.4, 50.0, 'EL ORDEN NO IMPORTA', 'primero el 10 %, luego el 20 %', 'da lo mismo: conmutativa');
  label(p, t, 50.4, 56.6, '¿Y SI SUBE Y BAJA?', 'una acción vale 100', 'sube 50 % y luego baja 50 %');
  label(p, t, 60.0, 65.8, 'SUBE', 'el 50 % de 100 es 50', 'llega a 150');
  label(p, t, 66.2, 72.0, 'BAJA', 'el 50 % de 150 es 75', 'queda en 75: no vuelve a 100');
  label(p, t, 72.4, 78.2, 'POR QUÉ', 'la bajada es sobre 150', 'un número más grande');
  label(p, t, 78.6, 84.4, 'PARA VOLVER', 'si baja el 20 %, queda en 80', 'hay que subir 20 sobre 80');
  label(p, t, 84.8, 90.4, 'EL 25 %', '20 entre 80 es 0.25', 'subir y bajar lo mismo no se cancela');
  label(p, t, 95.4, 101.2, 'UN PUEBLO', '1 000 habitantes', 'crece el 10 % cada año');
  label(p, t, 101.6, 107.4, 'CADA AÑO, POR 1.1', '1 100, 1 210, 1 331', 'el 10 % de un pueblo más grande');
  label(p, t, 107.8, 114.0, 'UNA POTENCIA', '1.1 al cubo es 1.331', 'creció 33.1 %, no 30 %');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SE MULTIPLICAN', ['0.8 · 0.9', '=', '0.72']],
  ['SUBE Y BAJA', 'no vuelve al inicio'],
  ['AÑO TRAS AÑO', ['1.1', { sup: '3' }, '=', '1.331']],
  ['LA REGLA', 'cada cambio, sobre lo que queda'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 7.2, type: 'pop', i: 0 }, { t: 8.4, type: 'card' }, { t: 9.6, type: 'card' }];
  ev.push({ t: 12.6, type: 'line', d: .6 }, { t: 13.6, type: 'paint', d: .8 }, { t: 14.4, type: 'rise' }, { t: 19.6, type: 'paint', d: .8 }, { t: 20.4, type: 'rise' }, { t: 24.8, type: 'no' }, { t: 25.0, type: 'pop', i: 1 });
  ev.push({ t: 32.4, type: 'rise' }, { t: 35.0, type: 'rise' }, { t: 38.4, type: 'rise' }, { t: 39.0, type: 'yes' }, { t: 39.4, type: 'no' });
  ev.push({ t: 44.4, type: 'tile', i: 0 }, { t: 45.4, type: 'fly', d: 1.2 }, { t: 47.0, type: 'rise' }, { t: 47.6, type: 'yes' }, { t: 52.4, type: 'pop', i: 2 });
  for (const t0 of [60.4, 78.6]) ev.push({ t: t0, type: 'pop', i: 0 }, { t: t0 + 1.2, type: 'slide', d: 1.0 }, { t: t0 + 2.2, type: 'pop', i: 1 }, { t: t0 + 5.8, type: 'slide', d: 1.0 }, { t: t0 + 6.8, type: 'pop', i: 2 });
  ev.push({ t: 67.2, type: 'no' }, { t: 68.0, type: 'rise' }, { t: 78.2, type: 'away', d: .4 }, { t: 84.4, type: 'rise' }, { t: 85.0, type: 'yes' }, { t: 87.6, type: 'pop', i: 3 });
  POP.forEach((v, i) => ev.push({ t: 96.2 + (i ? 4.4 + (i - 1) * 1.6 : 0), type: 'tile', i }));
  ev.push({ t: 107.8, type: 'rise' }, { t: 108.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto sale feliz del mercado.'],
  [4.0, 6.4, 'Cree que ahorró el treinta por ciento.'],
  [6.8, 9.6, 'La bici costaba 100 000, con 20 % menos.'],
  [9.8, 12.4, 'Y en caja, otro 10 % de descuento.'],
  [12.8, 15.6, 'Primero el veinte por ciento: queda el ochenta,'],
  [15.8, 18.4, 'ochenta mil.'],
  [18.8, 21.6, 'Luego el 10 %, pero sobre 80 000.'],
  [21.8, 24.4, 'Queda setenta y dos mil.'],
  [24.8, 29.0, 'Treinta por ciento menos serían setenta mil. No cuadra.'],
  [31.8, 34.8, 'Los factores se multiplican: 0.8 por 0.9.'],
  [35.0, 37.8, '0.72: se paga el 72 %.'],
  [38.2, 41.0, 'El descuento real es del veintiocho.'],
  [41.2, 44.0, 'El segundo se aplicó sobre un precio menor.'],
  [44.4, 47.2, 'Y el orden no importa:'],
  [47.4, 50.0, 'la multiplicación es conmutativa.'],
  [50.4, 53.4, 'Ahora una acción que vale cien.'],
  [53.6, 56.6, 'Sube el cincuenta por ciento, y luego baja el cincuenta.'],
  [60.0, 62.8, 'Sube: el cincuenta por ciento de cien es cincuenta.'],
  [63.0, 65.8, 'Llega a ciento cincuenta.'],
  [66.2, 69.0, 'Baja: la mitad de ciento cincuenta es setenta y cinco.'],
  [69.2, 72.0, '¡No vuelve a cien!'],
  [72.4, 75.2, 'La bajada se calcula sobre ciento cincuenta,'],
  [75.4, 78.2, 'un número más grande.'],
  [78.6, 81.4, 'Si algo baja el veinte por ciento, queda en ochenta.'],
  [81.6, 84.4, 'Para volver a cien hay que subir veinte sobre ochenta.'],
  [84.8, 87.6, 'Es el veinticinco por ciento.'],
  [87.8, 90.4, 'Subir y bajar lo mismo no se cancela.'],
  [95.4, 98.4, 'Un pueblo de mil habitantes crece el 10 % al año.'],
  [98.6, 101.2, '¿En tres años creció el treinta?'],
  [101.6, 104.4, 'Cada año se multiplica por uno punto uno:'],
  [104.6, 107.4, 'mil cien, mil doscientos diez, mil trescientos treinta y uno.'],
  [107.8, 110.6, 'Es una potencia: uno punto uno al cubo.'],
  [110.8, 114.0, 'Creció el treinta y tres punto uno por ciento.'],
  [115.4, 119.8, 'Beto ahorró el veintiocho por ciento, no el treinta.'],
  [120.0, 124.6, 'Los cambios sucesivos no se suman: se multiplican.'],
];
