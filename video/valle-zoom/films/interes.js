// «Interés simple y compuesto» (lección alg-13b de Zuka, Selva Exponencial, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): Beto ahorra 2 000 000 al 6 % anual. Simple:
// 120 000 cada año, I = C·r·t, M = C(1 + rt), se duplica en 16 años y 8 meses. Compuesto: 2 120 000, 2 247 200,
// 2 382 032 …, M = C(1 + r)^n, pasa los 4 millones hacia los 12 años (11.9). Continuo: C·e^(rt), 4 108 866 a los 12 años.
// Hilo (docs/storytelling-videos.md): dos bancos le ofrecen a Beto el mismo 6 %; el primer año pagan igual. Sorpresa
// anunciada: con los años uno se escapa. Cierre: con compuesto duplica casi cinco años antes.
// Niveles: 0 los dos bancos → 1 por I = C·r·t: el simple → 2 por M = C(1 + r)^n: el compuesto → 3 por C·e^(rt):
// el continuo y la carrera.
const POSTER = 80.0;
const SP = s => ({ sup: s });
const money = v => Math.round(v).toLocaleString('es-CO').replace(/,/g, '.');

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 140, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [470, 1440], r: 170, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [470, 1440], r: 130, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 960], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el simple', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'el compuesto', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'el continuo', L: [330, 1560] },
  ],
  stops: ['dos bancos', 'simple', 'compuesto', 'la carrera'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[66.4, 68.0], [110.8, 112.4], [119.0, 135]],
    wides: [[22.0, 23.4], [78.8, 80.2]],
    looks: [],
  },
};

// una barra de ahorro: base en y0, ancho w, alto proporcional a v (millones)
function bar(p, x, y0, w, v, k, col, lab) {
  if (k <= 0.01) return;
  const h = v * 120 * k;
  shaded(p, 'rect', { x: r1(x - w / 2), y: r1(y0 - h), width: w, height: r1(h), rx: 14 }, col[0], col[1], 4, 4);
  if (lab) tag(p, x, y0 - h - 18, lab, k, col[0], 32);
}

// ---------- nivel 0 · los dos bancos ----------
function level0(G, t) {
  starField(G, 221, 150);
  const k0 = pop(t, 1.0);
  bar(G, 540, 1180, 200, 2, k0 * out(t, 6.6), ZERO, '2.000.000');
  const kb = pop(t, 6.8);
  tag(G, 330, 1250, 'banco simple', kb, C.blue, 36);
  tag(G, 750, 1250, 'banco compuesto', kb, C.mint, 36);
  const y1 = eio(seg(t, 12.8, 14.0)), y2 = eio(seg(t, 22.0, 23.2));
  bar(G, 330, 1180, 180, 2 + .12 * y1 + .12 * y2, kb, SKY, y2 > .5 ? '2.240.000' : y1 > .5 ? '2.120.000' : '2.000.000');
  bar(G, 750, 1180, 180, 2 + .12 * y1 + .1272 * y2, kb, MINT, y2 > .5 ? '2.247.200' : y1 > .5 ? '2.120.000' : '2.000.000');
  tag(G, 540, 1320, y2 > .5 ? 'año 2' : y1 > .5 ? 'año 1' : 'año 0', kb, C.cream, 38);
  const kq = life(t, 4.0, 12.4);
  if (kq > 0.01) chip(G, 540, 700, 'meta: 4.000.000', kq, POS, C.night, 42);
  const ki = life(t, 15.8, 21.8);
  if (ki > 0.01) chip(G, 540, 700, 'interés del año 1: 120.000 en los dos', ki, ZERO, C.night, 38);
  fchip(G, 470, 1440, ['I = C · r · t'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 48);
}
// ---------- nivel 1 · el simple ----------
function level1(G, t) {
  starField(G, 223, 90);
  fchip(G, 540, 700, ['I = C · r · t'], out(t, 32.4), SKY, 48);
  for (let y = 0; y <= 5; y++) {
    const k = pop(t, 32.2 + y * .5);
    bar(G, 210 + y * 132, 1280, 96, 2 + .12 * y, k, SKY, null);
    if (y) { const kk = pop(t, 32.6 + y * .5); if (kk > 0.01) el('rect', { x: 210 + y * 132 - 48, y: r1(1280 - (2 + .12 * y) * 120), width: 96, height: r1(.12 * y * 120), rx: 10, fill: C.sun, opacity: .9 * kk }, G); }
    tag(G, 210 + y * 132, 1326, `año ${y}`, k, C.mist, 28);
  }
  tag(G, 540, 930, '+120.000 cada año, siempre igual', pop(t, 35.4), C.sun, 36);
  riseFormula(G, t, 38.2, 999, 540, 810, 52, ['I', '=', '2.000.000 · 0.06 · t'], { colors: {} });
  riseFormula(G, t, 41.2, 999, 540, 870, 46, ['M', '=', 'C(1 + rt)'], { colors: {} });
  const kd = pop(t, 47.6);
  if (kd > 0.01) chip(G, 540, 720, '16.67 años: lo pasa en el año 17', kd, ZERO, C.night, 38);
  fchip(G, 470, 1440, ['M = C(1 + r)', SP('n')], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 46);
}
// ---------- nivel 2 · el compuesto ----------
const M2 = { ox: 170, oy: 1300, s: 38, sy: 80 };
function level2(G, t) {
  starField(G, 225, 90);
  fchip(G, 540, 700, ['M = C(1 + r)', SP('n')], out(t, 61.0), MINT, 46);
  const kr = 1 - eio(seg(t, 75.2, 75.6));
  if (kr > 0.01) {
    const Q = scaleAt(G, 540, 1000, kr);
    [['año 1: 2.120.000', 60.6, MINT], ['año 2: 2.247.200', 63.4, MINT], ['año 3: 2.382.032', 66.6, MINT]].forEach(([s, t0, c], i) => { const k = pop(t, t0); if (k > 0.01) chip(Q, 540, 820 + i * 90, s, k, c, C.night, 42); });
    tag(Q, 540, 1110, 'el año 2 paga 127.200: 7.200 son interés del interés', pop(t, 66.6), C.sun, 32);
    riseFormula(Q, t, 69.4, 999, 540, 1250, 56, ['M', '=', '2.000.000 · 1.06', SP('n')], { colors: {} });
  }
  axes(G, t, 75.6, M2, 0, 21, 0, 7, { ticks: false, xl: 'años', yl: 'millones' });
  const k4 = eio(seg(t, 81.4, 82.0));
  if (k4 > 0.01) for (let j = 0; j < 26; j++) if (j / 26 <= k4) el('rect', { x: mx(M2, 0) + j * 30, y: my(M2, 4) - 2, width: 16, height: 4, rx: 2, fill: C.cream, opacity: .7 }, G);
  tag(G, mx(M2, 0.4), my(M2, 4) - 14, '4 millones', pop(t, 81.6), C.cream, 30, 'start');
  curve(G, M2, x => 2 + .12 * x, 0, 20, eio(seg(t, 76.0, 80.0)), C.blue, 6);
  curve(G, M2, x => 2 * 1.06 ** x, 0, 20, eio(seg(t, 76.0, 80.0)), C.mint, 7);
  tag(G, mx(M2, 20.4), my(M2, 4.4) + 10, 'simple', pop(t, 79.0), C.blue, 32, 'end');
  tag(G, mx(M2, 18.6), my(M2, 6.4), 'compuesto', pop(t, 79.0), C.mint, 32, 'end');
  [[12, C.mint, 'año 12'], [17, C.blue, 'año 17']].forEach(([x, c, s], i) => {
    const k = pop(t, 82.2 + i * .6); if (k <= 0.01) return;
    el('circle', { cx: mx(M2, x), cy: my(M2, 4), r: r1(13 * k), fill: c }, G);
    tag(G, mx(M2, x), M2.oy + 44, s, k, c, 30);
  });
  fchip(G, 470, 1440, ['C = M ÷ (1 + r)', SP('n')], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 48);
}
// ---------- nivel 3 · el continuo y la carrera ----------
function level3(G, t) {
  starField(G, 227, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['C = M ÷ (1 + r)', SP('n')], out(t, 96.0), ZERO, 48);
  const k1 = 1 - eio(seg(t, 104.4, 104.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    riseFormula(Q, t, 95.6, 999, 540, 830, 56, ['C', '=', '4.000.000 ÷ 1.06', SP('12')], { colors: {} });
    const kc = pop(t, 98.6);
    if (kc > 0.01) chip(Q, 540, 960, '≈ 1.987.938 hoy', kc, ZERO, C.night, 46);
    const ka = pop(t, 101.0);
    if (ka > 0.01) chip(Q, 540, 1070, 'tasa mensual: n cuenta meses', ka, MINT, C.night, 40);
  }
  // la carrera hacia los 4 millones
  const kt = eio(seg(t, 105.0, 105.6));
  if (kt > 0.01) {
    el('rect', { x: 160, y: 900, width: r1(760 * kt), height: 8, rx: 4, fill: C.n3 }, S);
    el('rect', { x: 160, y: 1100, width: r1(760 * kt), height: 8, rx: 4, fill: C.n3 }, S);
    tag(S, 160, 880, 'simple', kt, C.blue, 34, 'start');
    tag(S, 160, 1080, 'compuesto', kt, C.mint, 34, 'start');
  }
  const ys = 17 * eio(seg(t, 107.8, 110.6)), yc = Math.min(12, 17 * eio(seg(t, 107.8, 110.6)));
  if (t > 107.6) {
    el('circle', { cx: r1(160 + 760 * ys / 17), cy: 904, r: 18, fill: C.blue }, S);
    el('circle', { cx: r1(160 + 760 * yc / 17), cy: 1104, r: 18, fill: C.mint }, S);
  }
  const kf = pop(t, 110.8);
  if (kf > 0.01) { chip(S, 700, 960, 'año 17', kf, SKY, C.night, 40); chip(S, 560, 1170, 'año 12', kf, MINT, C.night, 40); }
  const kd = pop(t, 112.0);
  if (kd > 0.01) chip(S, 540, 1300, '5 años antes', kd, ZERO, C.night, 46);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Interés simple', { 'font-size': 100, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y compuesto', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LOS AHORROS DE BETO', '2.000.000 al 6 % anual', 'meta: duplicarlos');
  label(p, t, 12.8, 18.6, 'EL PRIMER AÑO', 'los dos pagan igual', '120.000 de interés');
  label(p, t, 19.0, 24.4, '¿DA LO MISMO?', 'mira el segundo año', null);
  label(p, t, 24.8, 29.0, 'UN AVISO', 'esa diferencia mínima', 'se volverá años');
  label(p, t, 31.8, 37.8, 'INTERÉS SIMPLE', 'siempre sobre el capital', '+120.000 cada año');
  label(p, t, 38.2, 44.2, 'LA FÓRMULA', 'I = C · r · t', 'M = C(1 + rt): una recta');
  label(p, t, 44.6, 50.2, '¿CUÁNDO 4 MILLONES?', 'faltan 2.000.000', 'a 120.000 por año');
  label(p, t, 50.6, 56.6, 'CON SIMPLE', 'en el año 17', 'ahora, el compuesto');
  label(p, t, 60.0, 66.0, 'INTERÉS COMPUESTO', 'el interés se suma', 'y también gana interés');
  label(p, t, 66.4, 72.2, 'POR 1.06', 'cada año se multiplica', 'por 1.06 otra vez');
  label(p, t, 72.6, 78.4, 'UNA EXPONENCIAL', 'del tiempo', 'al principio, casi iguales');
  label(p, t, 78.8, 84.4, 'SE DESPEGA', 'el compuesto llega a 4', 'en el año 12');
  label(p, t, 84.8, 90.4, '¿Y AL REVÉS?', 'para tener una meta', '¿cuánto depositar hoy?');
  label(p, t, 95.4, 101.4, 'AL REVÉS', 'se divide entre el factor', '4 millones en 12 años: 1.987.938');
  label(p, t, 101.8, 107.4, 'OJO CON LA TASA', 'mensual: n en meses', 'una simple alta puede ganar');
  label(p, t, 107.8, 114.0, 'LA CARRERA', 'simple: año 17', 'compuesto: año 12');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SIMPLE', ['I = C · r · t', ':', 'una recta']],
  ['COMPUESTO', ['M = C(1 + r)', SP('n')]],
  ['AL REVÉS', ['C = M ÷ (1 + r)', SP('n')]],
  ['LA DIFERENCIA', 'el interés también gana interés'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }, { t: 4.0, type: 'card' }, { t: 6.8, type: 'tile', i: 1 }, { t: 12.8, type: 'slide', d: 1.2 }];
  ev.push({ t: 15.8, type: 'card' }, { t: 22.0, type: 'slide', d: 1.2 }, { t: 24.8, type: 'pop', i: 3 });
  for (let y = 0; y <= 5; y++) ev.push({ t: 32.2 + y * .5, type: 'tile', i: y % 4 });
  ev.push({ t: 35.4, type: 'card' }, { t: 38.2, type: 'rise' }, { t: 41.2, type: 'rise' }, { t: 47.6, type: 'hit' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.6, type: 'pop', i: 0 }, { t: 63.4, type: 'pop', i: 1 }, { t: 66.6, type: 'pop', i: 2 }, { t: 69.4, type: 'rise' }, { t: 75.2, type: 'away', d: .4 });
  ev.push({ t: 75.6, type: 'slide', d: .6 }, { t: 76.0, type: 'paint', d: 4.0 }, { t: 81.4, type: 'slide', d: .6 }, { t: 82.2, type: 'yes' }, { t: 82.8, type: 'pop', i: 1 }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 98.6, type: 'hit' }, { t: 101.0, type: 'pop', i: 2 }, { t: 104.4, type: 'away', d: .4 }, { t: 105.0, type: 'slide', d: .6 }, { t: 107.8, type: 'slide', d: 2.8 }, { t: 110.8, type: 'yes' }, { t: 112.0, type: 'hit' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto tiene dos millones ahorrados.'],
  [4.0, 6.6, 'Quiere duplicarlos: llegar a cuatro.'],
  [6.8, 9.6, 'Dos bancos le ofrecen el seis por ciento anual.'],
  [9.8, 12.4, 'Uno con interés simple; otro, compuesto.'],
  [12.8, 15.6, 'El primer año, los dos pagan igual:'],
  [15.8, 18.6, 'ciento veinte mil pesos de interés.'],
  [19.0, 21.8, '¿Entonces da lo mismo?'],
  [22.0, 24.4, 'Mira el segundo año.'],
  [24.8, 29.0, 'Esa diferencia mínima se volverá años.'],
  [31.8, 34.8, 'Interés simple: siempre sobre el capital inicial.'],
  [35.0, 37.8, 'Cada año, ciento veinte mil, igual.'],
  [38.2, 41.0, 'Interés: capital por tasa por tiempo.'],
  [41.2, 44.2, 'El monto crece en línea recta.'],
  [44.6, 47.4, '¿Cuándo llega a cuatro millones?'],
  [47.6, 50.2, 'Faltan dos millones, a ciento veinte mil:'],
  [50.6, 53.6, 'lo pasa en el año diecisiete.'],
  [53.8, 56.6, 'Ahora, el banco compuesto.'],
  [60.0, 63.0, 'Interés compuesto: el interés se suma al capital.'],
  [63.2, 66.0, 'El segundo año paga sobre lo que ya creció.'],
  [66.4, 69.2, 'Siete mil doscientos más: el interés también gana.'],
  [69.4, 72.2, 'Cada año se multiplica por uno punto cero seis.'],
  [72.6, 75.4, 'Es una función exponencial del tiempo.'],
  [75.6, 78.4, 'Al principio, las dos curvas van juntas…'],
  [78.8, 81.6, 'luego, la compuesta se despega.'],
  [81.8, 84.4, 'En el año doce pasa los cuatro millones.'],
  [84.8, 87.6, 'Y al revés: para tener una meta…'],
  [87.8, 90.4, '¿cuánto hay que depositar hoy?'],
  [95.4, 98.4, 'Para tener cuatro millones en doce años,'],
  [98.6, 101.4, 'se divide entre el factor de doce años.'],
  [101.8, 104.6, 'Si la tasa es mensual, n cuenta meses.'],
  [104.8, 107.4, 'Y ahora, la carrera completa:'],
  [107.8, 110.6, 'simple, hasta el año diecisiete.'],
  [110.8, 114.0, 'Compuesto: en el año doce.'],
  [115.4, 119.6, 'Beto duplica sus ahorros cinco años antes'],
  [119.8, 124.4, 'si el interés también gana interés.'],
];
