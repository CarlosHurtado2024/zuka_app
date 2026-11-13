// «Aumentos y descuentos» (lección alg-13c de Zuka, Mercado de las razones, video 5) en estilo Scale Zoom Explainer.
// Mismos ejemplos que el video actual de la lección (la camisa de 60 000 con 25 %, el IVA de 19 % sobre 50 000, ±8 % y +100 %,
// el televisor de 71 400 con IVA, el pasaje de 2 500 a 3 000), que tests/porcentajes-desde-cero.test.js mantiene fuera de los
// ejercicios. Hilo (docs/storytelling-videos.md): Caro hace compras y cada precio esconde un porcentaje.
// Niveles: 0 el descuento → 1 por el IVA: el aumento y el factor → 2 por el televisor: al revés → 3 por el pasaje: cambio porcentual.
const POSTER = 75.4;
const BX0 = 180;

const FILM = {
  DUR: 134, endAt: 119.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1390], r: 90, A: [540, 690] },
    { a: 57.4, b: 59.6, P: [540, 1350], r: 95, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1350], r: 90, A: [540, 690] },
  ],
  open: { Z0: 2.3, C: [300, 700], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el aumento', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'al revés', L: [330, 1530] },
    { fire: 88.6, lock: 89.2, name: 'cambio porcentual', L: [360, 1530] },
  ],
  stops: ['el descuento', 'el aumento', 'al revés', 'cambio %'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 116.6, 126.0],
    smiles: [[21.4, 23.0], [40.2, 41.8], [80.6, 82.2], [104.0, 105.6], [124.0, 140]],
    wides: [[68.0, 69.4], [109.0, 110.4]],
    looks: [],
  },
};

// ---------- piezas ----------
function shirt(p, x, y, s, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), u = v => r1(v * s);
  shaded(S, 'path', { d: `M${x - u(.2)},${y - u(.5)}L${x - u(.55)},${y - u(.3)}L${x - u(.42)},${y - u(.05)}L${x - u(.3)},${y - u(.12)}L${x - u(.3)},${y + u(.5)}L${x + u(.3)},${y + u(.5)}L${x + u(.3)},${y - u(.12)}L${x + u(.42)},${y - u(.05)}L${x + u(.55)},${y - u(.3)}L${x + u(.2)},${y - u(.5)}Q${x},${y - u(.36)} ${x - u(.2)},${y - u(.5)}Z` }, C.coral, C.coralD, u(.05), u(.05));
}
function tv(p, x, y, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 110, y: y - 70, width: 220, height: 140, rx: 16 }, C.mist, C.n3, 5, 5);
  el('rect', { x: x - 94, y: y - 56, width: 188, height: 112, rx: 8, fill: C.blue }, S);
  el('rect', { x: x - 30, y: y + 72, width: 60, height: 14, rx: 5, fill: C.mist }, S);
}
function ticket(p, x, y, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 90, y: y - 46, width: 180, height: 92, rx: 12 }, C.sun, C.sunD, 4, 4);
  for (const sx of [-1, 1]) el('circle', { cx: x + sx * 90, cy: y, r: 14, fill: C.night }, S);
  tag(S, x, y + 14, 'BUS', 1, C.night, 40);
}
function bar(p, x, y, w, h, col, k = 1, lbl, ink = C.night) {
  if (k <= 0.01 || w <= 1) return;
  el('rect', { x: r1(x), y, width: r1(w * k), height: h, rx: 12, fill: col }, p);
  if (lbl && k > .6) tag(p, x + w * k / 2, y + h / 2 + 14, lbl, 1, ink, 36);
}

// ---------- nivel 0 · el descuento ----------
function level0(G, t) {
  starField(G, 7, 150);
  shirt(G, 300, 700, 260, 1 + .08 * wob(t, 6.8, 12, 5));
  chip(G, 680, 650, '$60 000', pop(t, 7.2), POS, C.night, 52);
  chip(G, 680, 760, '− 25 %', pop(t, 8.4) * (1 + .1 * wob(t, 8.4, 14, 6)), NEG, C.night, 52);
  const kb = pop(t, 12.6), kq = eio(seg(t, 13.4, 14.0)), km = eio(seg(t, 18.8, 19.6));
  if (kb > 0.01) {
    for (let q = 0; q < 4; q++) {
      const off = q === 3 ? 40 * kq : 0, col = q === 3 ? (kq > .5 ? C.coral : C.n3) : (km > .5 ? C.mint : C.n3);
      bar(G, BX0 + q * 180 + off, 900, 172, 90, col, kb, q === 3 ? '15 000' : '');
    }
    tag(G, BX0 + 270, 880, '75 %', km, C.mint, 40); tag(G, BX0 + 670, 880, '25 %', kq, C.coral, 40);
  }
  riseFormula(G, t, 14.0, 999, 540, 1080, 56, ['60 000 − 15 000', '=', '45 000'], { colors: { '45 000': C.sun } });
  riseFormula(G, t, 19.8, 999, 540, 1170, 56, ['60 000 · 0.75', '=', '45 000'], { colors: { '45 000': C.sun } });
  riseFormula(G, t, 24.8, 999, 540, 1260, 56, ['60 000 · (1 − 0.25)'], { fill: C.mint });
  chip(G, 540, 1390, 'IVA 19 %', pop(t, 25.0) * (1 + .1 * wob(t, 25.4, 14, 6)), ZERO, C.night, 46);
}
// ---------- nivel 1 · el aumento ----------
function level1(G, t) {
  starField(G, 17, 90);
  chip(G, 540, 690, 'IVA 19 %', 1, ZERO, C.night, 54);
  const kb = pop(t, 32.2) * out(t, 44.0), ks = eio(seg(t, 34.6, 35.4));
  if (kb > 0.01) {
    bar(G, BX0, 860, 600, 90, C.mint, kb, '50 000');
    bar(G, BX0 + 606, 860, 114, 90, C.sun, ks * kb, '');
    tag(G, BX0 + 663, 840, '+19 %', ks * kb, C.sun, 38);
    tag(G, BX0 + 360, 1010, '119 %', pop(t, 38.4) * kb, C.cream, 44);
  }
  riseFormula(G, t, 38.6, 43.8, 540, 1130, 64, ['50 000 · 1.19', '=', '59 500'], { colors: { '59 500': C.sun } });
  [['+ 8 %', '· 1.08', C.mint], ['− 8 %', '· 0.92', C.coral], ['+ 100 %', '· 2', C.sun]].forEach(([a, b, c], i) => {
    riseFormula(G, t, 50.6 + i * .5, 999, 470, 860 + i * 96, 56, [a], { anchor: 'end', fill: c });
    riseFormula(G, t, 50.8 + i * .5, 999, 510, 860 + i * 96, 56, [{ s: 'arrow' }, b], { anchor: 'start' });
  });
  riseFormula(G, t, 44.4, 999, 540, 1220, 62, ['factor', '=', '1 ±', { fr: ['r', '100'] }], { fill: C.sun });
  tv(G, 540, 1350, pop(t, 52.6) * .55 * (1 + .1 * wob(t, 53.0, 14, 6)));
}
// ---------- nivel 2 · al revés ----------
function level2(G, t) {
  starField(G, 29, 90);
  tv(G, 540, 690, 1);
  chip(G, 540, 690, '$71 400', pop(t, 60.4), ZERO, C.night, 44);
  riseFormula(G, t, 66.4, 71.8, 540, 900, 60, ['71 400 − 19 %', '=', '57 834'], { fill: C.coral });
  badge(G, 960, 860, life(t, 67.4, 71.8), false);
  const kb = pop(t, 72.4) * out(t, 78.0);
  if (kb > 0.01) {
    bar(G, BX0, 900, 600, 80, C.mint, kb, '60 000');
    bar(G, BX0 + 606, 900, 114, 80, C.sun, kb, '');
    tag(G, BX0 + 663, 880, '19 % de 60 000', kb, C.sun, 30);
    const kw = eio(seg(t, 74.4, 75.2)) * kb;
    if (kw > 0.01) { el('rect', { x: r1(BX0 + 720 - 137 * kw), y: 1000, width: r1(137 * kw), height: 16, rx: 8, fill: C.coral }, G); tag(G, BX0 + 650, 1060, '19 % de 71 400: más grande', kw, C.coral, 32, 'end'); }
  }
  riseFormula(G, t, 78.6, 999, 540, 1180, 66, ['71 400 ÷ 1.19', '=', '60 000'], { colors: { '60 000': C.mint } });
  riseFormula(G, t, 84.6, 999, 540, 1280, 60, ['60 000 · 1.19', '=', '71 400'], {});
  badge(G, 900, 1240, pop(t, 85.2), true);
  ticket(G, 540, 1360, pop(t, 87.6) * .7 * (1 + .1 * wob(t, 88.6, 14, 6)));
}
// ---------- nivel 3 · cambio porcentual ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 119.2, 119.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  ticket(S, 540, 690, 1);
  const k1 = pop(t, 95.8), k2 = pop(t, 96.6), kd = eio(seg(t, 98.0, 98.8));
  bar(S, BX0, 840, 500, 76, C.mint, k1, '2 500');
  bar(S, BX0, 940, 600, 76, C.sun, k2, '3 000');
  if (kd > 0.01) { el('rect', { x: BX0 + 500, y: 830, width: 6, height: 196, fill: C.coral }, S); el('rect', { x: BX0 + 500, y: 1030, width: r1(100 * kd), height: 12, rx: 6, fill: C.coral }, S); tag(S, BX0 + 640, 1050, '+500', kd, C.coral, 36, 'start'); }
  tag(S, BX0 - 20, 890, 'antes', k1, C.mint, 32, 'end'); tag(S, BX0 - 20, 990, 'ahora', k2, C.sun, 32, 'end');
  riseFormula(S, t, 101.6, 999, 540, 1130, 56, [{ fr: ['500', '2 500'] }, '=', '0.2', '=', '+20 %'], { colors: { '+20 %': C.mint } });
  riseFormula(S, t, 107.6, 999, 540, 1230, 56, [{ fr: ['−500', '3 000'] }, '≈', '−16.7 %'], { fill: C.coral });
  riseFormula(S, t, 113.6, 999, 500, 1330, 50, [{ fr: ['nuevo − viejo', 'viejo'] }, '· 100'], { fill: C.sun });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Aumentos', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y descuentos', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA CAMISA DE CARO', 'cuesta 60 000', 'y tiene 25 % de descuento');
  label(p, t, 12.8, 18.4, 'UNA FORMA', 'el 25 % de 60 000 es 15 000', 'se resta: quedan 45 000');
  label(p, t, 18.8, 24.4, 'MÁS RÁPIDO', 'si quitan el 25 %, pagas el 75 %', 'por 0.75: 45 000');
  label(p, t, 24.8, 29.0, 'LA MISMA CUENTA', 'distributiva: 60 000 · (1 − 0.25)', 'las dos formas son una');
  label(p, t, 31.8, 37.8, 'EL IVA', '50 000 sin impuesto', 'el IVA le suma el 19 %');
  label(p, t, 38.2, 44.0, 'EL 119 %', 'se paga el 119 %', 'por 1.19: 59 500');
  label(p, t, 44.4, 50.2, 'EL FACTOR', 'aumentar: 1 + r/100', 'descontar: 1 − r/100');
  label(p, t, 50.6, 56.6, 'EJEMPLOS', 'subir 8 %: por 1.08', 'subir 100 %: el doble');
  label(p, t, 60.0, 66.0, 'AL REVÉS', 'un televisor: 71 400 con IVA', '¿cuánto costaba sin IVA?');
  label(p, t, 66.4, 72.0, 'EL ERROR', 'quitarle el 19 % a 71 400', 'da 57 834: está mal');
  label(p, t, 72.4, 78.2, 'POR QUÉ', 'el 19 % era de 60 000', 'no de 71 400');
  label(p, t, 78.6, 84.4, 'DIVIDE', 'deshacer · 1.19 es ÷ 1.19', 'costaba 60 000');
  label(p, t, 84.8, 90.4, 'COMPRUEBA', '60 000 · 1.19 = 71 400', 'sí cuadra');
  label(p, t, 95.4, 101.2, 'EL PASAJE', 'subió de 2 500 a 3 000', '¿en qué porcentaje?');
  label(p, t, 101.6, 107.2, 'SOBRE EL DE ANTES', 'la subida entre el precio viejo', '500 ÷ 2 500 = 20 %');
  label(p, t, 107.6, 113.2, 'DE VUELTA', 'si baja de 3 000 a 2 500', '−16.7 %: no es simétrico');
  label(p, t, 113.6, 119.0, 'LA FÓRMULA', 'nuevo menos viejo', 'entre viejo, por 100');
};
FILM.summary = (p, t) => summaryList(p, t, 119.8, 'En resumen', [
  ['DESCUENTO', ['por', '(1 −', { fr: ['r', '100'] }, ')']],
  ['AUMENTO', ['por', '(1 +', { fr: ['r', '100'] }, ')']],
  ['AL REVÉS', 'divide entre el factor'],
  ['CAMBIO PORCENTUAL', 'sobre el valor de antes'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 7.2, type: 'pop', i: 0 }, { t: 8.4, type: 'card' }];
  for (let q = 0; q < 4; q++) ev.push({ t: 12.6 + q * .05, type: 'tile', i: q });
  ev.push({ t: 13.4, type: 'fly', d: .6 }, { t: 14.0, type: 'rise' }, { t: 18.8, type: 'paint', d: .8 }, { t: 19.8, type: 'rise' }, { t: 20.4, type: 'yes' }, { t: 24.8, type: 'rise' }, { t: 25.0, type: 'pop', i: 1 });
  ev.push({ t: 32.2, type: 'line', d: .6 }, { t: 34.6, type: 'paint', d: .8 }, { t: 38.4, type: 'pop', i: 0 }, { t: 38.6, type: 'rise' }, { t: 44.0, type: 'away', d: .4 }, { t: 44.4, type: 'rise' });
  for (let i = 0; i < 3; i++) ev.push({ t: 50.6 + i * .5, type: 'rise' });
  ev.push({ t: 52.6, type: 'pop', i: 2 }, { t: 60.4, type: 'pop', i: 0 }, { t: 66.4, type: 'rise' }, { t: 67.4, type: 'no' });
  ev.push({ t: 72.4, type: 'line', d: .6 }, { t: 74.4, type: 'paint', d: .8 }, { t: 78.0, type: 'away', d: .4 }, { t: 78.6, type: 'rise' }, { t: 84.6, type: 'rise' }, { t: 85.2, type: 'yes' }, { t: 87.6, type: 'pop', i: 1 });
  ev.push({ t: 95.8, type: 'line', d: .6 }, { t: 96.6, type: 'line', d: .6 }, { t: 98.0, type: 'paint', d: .8 }, { t: 101.6, type: 'rise' }, { t: 102.2, type: 'yes' }, { t: 107.6, type: 'rise' }, { t: 113.6, type: 'rise' });
  ev.push({ t: 119.2, type: 'away', d: .6 }, { t: 119.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 120.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 123.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Caro sale de compras al mercado.'],
  [4.0, 6.4, 'Y cada precio esconde un porcentaje.'],
  [6.8, 9.6, 'Una camisa cuesta sesenta mil.'],
  [9.8, 12.4, 'Tiene un descuento del veinticinco por ciento.'],
  [12.8, 15.6, 'Una forma: el descuento es quince mil.'],
  [15.8, 18.4, 'Se resta y quedan cuarenta y cinco mil.'],
  [18.8, 21.6, 'Más rápido: si quitan el 25 %, pagas el 75 %.'],
  [21.8, 24.4, 'Por cero punto setenta y cinco.'],
  [24.8, 29.0, 'Las dos formas son la misma cuenta: la distributiva.'],
  [31.8, 34.8, 'Un producto vale cincuenta mil sin impuesto.'],
  [35.0, 37.8, 'El IVA le suma el diecinueve por ciento.'],
  [38.2, 41.0, 'Se paga el ciento diecinueve por ciento:'],
  [41.2, 44.0, 'por uno punto diecinueve.'],
  [44.4, 47.2, 'Ese número es el factor.'],
  [47.4, 50.2, 'Para aumentar se suma a uno; para descontar, se resta.'],
  [50.6, 53.6, 'Subir ocho por ciento es por uno punto cero ocho.'],
  [53.8, 56.6, 'Subir el cien por ciento es el doble.'],
  [60.0, 63.0, 'Un televisor cuesta setenta y un mil cuatrocientos con IVA.'],
  [63.2, 66.0, '¿Cuánto costaba sin IVA?'],
  [66.4, 69.2, 'El error común: quitarle el diecinueve por ciento.'],
  [69.4, 72.0, 'Da 57 834. Está mal.'],
  [72.4, 75.2, 'El 19 % se calculó sobre el precio sin IVA,'],
  [75.4, 78.2, 'no sobre el precio final.'],
  [78.6, 81.4, 'Para deshacer una multiplicación, se divide:'],
  [81.6, 84.4, 'entre uno punto diecinueve. Sesenta mil.'],
  [84.8, 87.6, 'Comprobamos: sesenta mil por uno punto diecinueve'],
  [87.8, 90.4, 'da setenta y un mil cuatrocientos.'],
  [95.4, 98.4, 'El pasaje subió de 2 500 a 3 000.'],
  [98.6, 101.2, '¿En qué porcentaje subió?'],
  [101.6, 104.4, 'La subida, quinientos, entre el precio de antes:'],
  [104.6, 107.2, 'veinte por ciento.'],
  [107.6, 110.4, 'Si bajara de vuelta a dos mil quinientos,'],
  [110.6, 113.2, 'bajaría el 16.7 %. No es simétrico.'],
  [113.6, 116.4, 'El cambio porcentual se mide'],
  [116.6, 119.0, 'siempre sobre el valor de antes.'],
  [120.4, 124.6, 'Caro paga cuarenta y cinco mil por la camisa,'],
  [124.8, 129.4, 'porque cada porcentaje es un factor que multiplica.'],
];
