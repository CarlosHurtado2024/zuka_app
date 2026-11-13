// «Simplificar y racionalizar» (lección alg-22b de Zuka, Torres de Potencias, video 4) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios): la baldosa de diagonal √72 = 6√2, 2√3 + 5√3 = 7√3, √2 + √3 ≠ √5,
// √8 + √18 = 5√2, 1/√2 = √2/2, 9/(4 + √5) = 9(4 − √5)/11.
// Hilo (docs/storytelling-videos.md): Beto, constructor de torres, trabaja sin calculadora, como los de antes; dividir entre
// 1.41421356… a mano era una pesadilla. Cierre: escribe 6√2 y divide sin sufrir.
// Niveles: 0 simplificar (la baldosa) → 1 por 2√3 + 5√3: semejantes → 2 por 1/√2: racionalizar → 3 por 9/(4 + √5): el conjugado.
const POSTER = 76.4;
const R2 = { rad: '2', tight: true }, R3 = { rad: '3', tight: true };

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1395], r: 110, A: [540, 690] },
    { a: 57.4, b: 59.6, P: [540, 1395], r: 90, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1395], r: 100, A: [540, 690] },
  ],
  open: { Z0: 2.2, C: [540, 760], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'semejantes', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'racionalizar', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'el conjugado', L: [330, 1560] },
  ],
  stops: ['simplificar', 'semejantes', 'racionalizar', 'conjugado'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[21.0, 22.6], [35.4, 37.0], [80.0, 81.6], [110.0, 111.6], [120.0, 135]],
    wides: [[61.4, 62.8], [40.0, 41.4]],
    looks: [],
  },
};

// ---------- nivel 0 · simplificar ----------
function level0(G, t) {
  starField(G, 7, 150);
  const kb = 1 + .06 * wob(t, 6.8, 12, 5);
  { const S = scaleAt(G, 540, 760, kb); shaded(S, 'rect', { x: 390, y: 610, width: 300, height: 300, rx: 16 }, C.blue, C.blueD, 6, 6); for (const q of [1, 2]) { el('rect', { x: 390 + q * 100 - 2, y: 610, width: 4, height: 300, fill: C.blueD }, S); el('rect', { x: 390, y: 610 + q * 100 - 2, width: 300, height: 4, fill: C.blueD }, S); } }
  const kd = eio(seg(t, 7.4, 8.4));
  if (kd > 0.01) el('path', { d: `M390,910L${r1(390 + 300 * kd)},${r1(910 - 300 * kd)}`, stroke: C.sun, 'stroke-width': 10, 'stroke-linecap': 'round' }, G);
  fchip(G, 760, 640, [{ rad: '72' }, 'cm'], pop(t, 8.6), ZERO, 40);
  // el árbol: 72 = 36 · 2 = 6 · 6 · 2
  const kt = out(t, 24.6), k1 = pop(t, 13.0) * kt, k2 = pop(t, 14.0) * kt, k3 = pop(t, 15.4) * kt;
  if (k2 > 0.01) { el('path', { d: 'M540,1010L420,1090M540,1010L660,1090', stroke: C.mist, 'stroke-width': 5 }, G); }
  if (k3 > 0.01) { el('path', { d: 'M420,1130L360,1190M420,1130L480,1190', stroke: C.mist, 'stroke-width': 5 }, G); }
  chip(G, 540, 990, '72', k1, POS, C.night, 44);
  chip(G, 420, 1110, '36', k2, MINT, C.night, 44); chip(G, 660, 1110, '2', k2, POS, C.night, 44);
  chip(G, 360, 1210, '6', k3, MINT, C.night, 40); chip(G, 480, 1210, '6', k3, MINT, C.night, 40);
  riseFormula(G, t, 19.0, 24.4, 540, 1290, 62, [{ rad: '72' }, '=', { rad: '36 · 2' }, '=', '6', R2], { colors: {}, fill: C.cream });
  riseFormula(G, t, 24.8, 999, 540, 1110, 56, ['6', R2, '≈', '6 · 1.414', '≈', '8.49'], { colors: { '8.49': C.sun } });
  fchip(G, 540, 1395, ['2', R3, '+', '5', R3], pop(t, 24.8) * .9 * (1 + .1 * wob(t, 25.2, 14, 6)), MINT, 40);
}
// ---------- nivel 1 · semejantes ----------
function level1(G, t) {
  starField(G, 17, 90);
  fchip(G, 540, 690, ['2', R3, '+', '5', R3], out(t, 33.0), MINT, 40);
  const m = eio(seg(t, 34.0, 35.0)), kt = out(t, 37.6);
  for (let i = 0; i < 7; i++) {
    const x0 = i < 2 ? 200 + i * 100 : 460 + (i - 2) * 100, x1 = 240 + i * 100;
    fchip(G, lerp(x0, x1, m), 880, [{ rad: '3' }], pop(t, 32.2 + i * .1) * kt, MINT, 34);
  }
  tag(G, 400, 896, '+', (1 - m) * kt * pop(t, 32.4), C.cream, 60);
  riseFormula(G, t, 35.2, 37.6, 540, 1060, 64, ['2', R3, '+', '5', R3, '=', '7', R3], { colors: { '7': C.sun } });
  riseFormula(G, t, 38.2, 43.8, 540, 1000, 54, [{ rad: '2' }, '+', { rad: '3' }, '≈', '1.41 + 1.73', '=', '3.14']);
  riseFormula(G, t, 39.6, 43.8, 540, 1110, 60, [{ rad: '5' }, '≈', '2.24'], { fill: C.coral });
  badge(G, 760, 1070, life(t, 40.2, 43.8), false);
  riseFormula(G, t, 44.4, 999, 540, 1000, 60, [{ rad: '8' }, '+', { rad: '18' }]);
  riseFormula(G, t, 46.2, 999, 540, 1110, 60, ['=', '2', R2, '+', '3', R2, '=', '5', R2], { colors: { '5': C.sun } });
  fchip(G, 540, 1395, [{ fr: ['1', '√2'] }], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 40);
}
// ---------- nivel 2 · racionalizar ----------
function level2(G, t) {
  starField(G, 29, 90);
  fchip(G, 540, 690, [{ fr: ['1', '√2'] }], out(t, 61.0), SKY, 40);
  const ks = pop(t, 60.4) * out(t, 66.0);
  if (ks > 0.01) {
    tag(G, 540, 880, '1 ÷ 1.41421356…', ks, C.cream, 64);
    const R = rng(5), n = Math.floor(clamp((t - 61.0) / 4) * 40);
    for (let i = 0; i < n; i++) { const x = 220 + R() * 640, y = 960 + R() * 260; el('path', { d: `M${r1(x)},${r1(y)}q${r1(20 + R() * 30)},${r1(-10 - R() * 20)} ${r1(40 + R() * 40)},0`, fill: 'none', stroke: C.mist, 'stroke-width': 3, opacity: 1 }, G); }
    tag(G, 540, 1290, '¿y cuándo termina?', pop(t, 63.0) * ks, C.coral, 40);
  }
  const F = riseFormula(G, t, 66.4, 999, 540, 900, 84, [{ fr: ['1', '√2'] }, '·', { fr: ['√2', '√2'] }], {});
  if (F) tag(G, F.at[2][0], 1010, 'vale 1', life(t, 67.6, 72.0), C.mint, 38);
  riseFormula(G, t, 72.6, 999, 540, 1070, 80, ['=', { fr: ['√2', '√2 · √2'] }, '=', { fr: ['√2', '2'] }], { colors: {} });
  riseFormula(G, t, 78.8, 999, 540, 1200, 54, ['1.41421356 ÷ 2', '=', '0.70710678'], { colors: { '0.70710678': C.mint } });
  badge(G, 980, 1160, pop(t, 79.6), true);
  fchip(G, 540, 1395, [{ fr: ['9', '4 + √5'] }], pop(t, 87.6) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 40);
}
// ---------- nivel 3 · el conjugado ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 690, [{ fr: ['9', '4 + √5'] }], out(t, 96.0), NEG, 40);
  riseFormula(S, t, 96.0, 999, 540, 850, 72, [{ fr: ['9', '4 + √5'] }, '·', { fr: ['4 − √5', '4 − √5'], col: C.mint }]);
  riseFormula(S, t, 102.0, 999, 540, 990, 54, ['(4 + √5)(4 − √5)', '=', '4² − (√5)²']);
  riseFormula(S, t, 104.6, 999, 540, 1090, 60, ['=', '16 − 5', '=', '11'], { colors: { '11': C.sun } });
  riseFormula(S, t, 108.4, 999, 540, 1240, 82, ['=', { fr: ['9(4 − √5)', '11'] }], { fill: C.sun });
  badge(S, 830, 1190, pop(t, 109.4), true);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Radicales', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'sin calculadora', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.6, 'LA BALDOSA DE BETO', 'su diagonal mide √72 cm', '¿se puede escribir más simple?');
  label(p, t, 13.0, 18.6, 'BUSCA UN CUADRADO', '72 = 36 · 2', '36 es un cuadrado perfecto');
  label(p, t, 19.0, 24.4, 'SALE DE LA RAÍZ', 'el 36 sale como 6', 'el 2 se queda: 6√2');
  label(p, t, 24.8, 29.0, 'COMPRUEBA', '6√2 y √72 valen', 'lo mismo: 8.49');
  label(p, t, 31.8, 37.6, 'SEMEJANTES', 'dos √3 más cinco √3', 'como contar manzanas: 7√3');
  label(p, t, 38.0, 43.8, 'DISTINTOS NO SE JUNTAN', '√2 + √3 no es √5', '3.14 contra 2.24');
  label(p, t, 44.2, 50.0, 'SIMPLIFICA PRIMERO', '√8 = 2√2 y √18 = 3√2', 'ahora sí se juntan: 5√2');
  label(p, t, 50.4, 56.6, 'SIN CALCULADORA', 'los constructores de antes', 'dividían a mano');
  label(p, t, 60.0, 66.0, 'DIVIDIR ENTRE √2', '1 ÷ 1.41421356…', 'una división eterna');
  label(p, t, 66.4, 72.2, 'UNO DISFRAZADO', '√2 entre √2 vale 1', 'multiplicar por 1 no cambia nada');
  label(p, t, 72.6, 78.4, 'RACIONALIZAR', '√2 · √2 = 2', 'abajo ya no hay raíz');
  label(p, t, 78.8, 84.6, 'AHORA ES FÁCIL', 'la mitad de 1.41421356', '0.70710678');
  label(p, t, 85.0, 90.4, '¿Y CON UN BINOMIO?', '9 entre 4 + √5', 'multiplicar por √5 no basta');
  label(p, t, 95.4, 101.6, 'EL CONJUGADO', '4 − √5: lo mismo, otro signo', 'otra vez un uno disfrazado');
  label(p, t, 102.0, 108.0, 'SUMA POR DIFERENCIA', 'da cuadrado menos cuadrado', '16 − 5 = 11: sin raíz');
  label(p, t, 108.4, 114.0, 'LISTO', 'abajo queda 11', 'y se divide sin sufrir');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SIMPLIFICAR', [{ rad: '72' }, '=', '6', R2]],
  ['SEMEJANTES', ['2', R3, '+', '5', R3, '=', '7', R3]],
  ['RACIONALIZAR', [{ fr: ['1', '√2'] }, '=', { fr: ['√2', '2'] }]],
  ['EL CONJUGADO', ['(a + √b)(a − √b)', '=', 'a² − b']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 7.4, type: 'paint', d: 1.0 }, { t: 8.6, type: 'pop', i: 0 }];
  ev.push({ t: 13.0, type: 'tile', i: 0 }, { t: 14.0, type: 'tile', i: 1 }, { t: 15.4, type: 'tile', i: 2 }, { t: 19.0, type: 'rise' }, { t: 19.6, type: 'yes' }, { t: 24.8, type: 'rise' }, { t: 25.0, type: 'pop', i: 1 });
  for (let i = 0; i < 7; i++) ev.push({ t: 32.2 + i * .1, type: 'tile', i });
  ev.push({ t: 34.0, type: 'fly', d: 1.0 }, { t: 35.2, type: 'rise' }, { t: 35.8, type: 'yes' }, { t: 38.2, type: 'rise' }, { t: 39.6, type: 'rise' }, { t: 40.2, type: 'no' }, { t: 44.4, type: 'rise' }, { t: 46.2, type: 'rise' }, { t: 46.8, type: 'yes' }, { t: 52.4, type: 'pop', i: 2 });
  ev.push({ t: 60.4, type: 'pop', i: 0 }, { t: 61.0, type: 'paint', d: 4.0 }, { t: 63.0, type: 'no' }, { t: 66.0, type: 'away', d: .4 }, { t: 66.4, type: 'rise' }, { t: 67.6, type: 'pop', i: 1 });
  ev.push({ t: 72.6, type: 'rise' }, { t: 78.8, type: 'rise' }, { t: 79.6, type: 'yes' }, { t: 87.6, type: 'pop', i: 2 });
  ev.push({ t: 96.0, type: 'rise' }, { t: 102.0, type: 'rise' }, { t: 104.6, type: 'rise' }, { t: 108.4, type: 'rise' }, { t: 109.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto construye torres como los constructores de antes:'],
  [4.0, 6.4, 'sin calculadora.'],
  [6.8, 9.6, 'La diagonal de esta baldosa mide raíz de setenta y dos.'],
  [9.8, 12.6, '¿Se puede escribir más simple?'],
  [13.0, 15.8, 'Buscamos un cuadrado escondido:'],
  [16.0, 18.6, 'setenta y dos es treinta y seis por dos.'],
  [19.0, 21.8, 'La raíz de treinta y seis sale: seis.'],
  [22.0, 24.4, 'El dos se queda adentro: seis raíz de dos.'],
  [24.8, 29.0, 'Comprobamos: las dos valen ocho punto cuarenta y nueve.'],
  [31.8, 34.8, 'Dos raíz de tres más cinco raíz de tres:'],
  [35.0, 37.6, 'como contar manzanas. Siete raíz de tres.'],
  [38.0, 41.0, 'Pero raíz de dos más raíz de tres no es raíz de cinco.'],
  [41.2, 43.8, 'Tres punto catorce contra dos punto veinticuatro.'],
  [44.2, 47.2, 'A veces hay que simplificar primero:'],
  [47.4, 50.0, 'raíz de ocho más raíz de dieciocho es cinco raíz de dos.'],
  [50.4, 53.6, 'Los constructores de antes dividían a mano.'],
  [53.8, 56.6, 'Y había una división que odiaban.'],
  [60.0, 63.0, 'Uno entre raíz de dos: uno entre 1.41421356…'],
  [63.2, 66.0, 'Una división a mano que no termina.'],
  [66.4, 69.2, 'El truco: multiplicar por raíz de dos sobre raíz de dos,'],
  [69.4, 72.2, 'que vale uno. No cambia nada.'],
  [72.6, 75.4, 'Abajo, raíz de dos por raíz de dos es dos.'],
  [75.6, 78.4, 'Ya no hay raíz abajo: eso es racionalizar.'],
  [78.8, 81.6, 'Y dividir entre dos es fácil:'],
  [81.8, 84.6, 'la mitad de 1.414, cero punto setecientos siete.'],
  [85.0, 87.8, '¿Y si abajo hay un binomio?'],
  [88.0, 90.4, 'Nueve entre cuatro más raíz de cinco.'],
  [95.4, 98.4, 'Multiplicamos por el conjugado: cuatro menos raíz de cinco.'],
  [98.6, 101.6, 'Arriba y abajo: otra vez un uno disfrazado.'],
  [102.0, 105.0, 'Suma por diferencia da cuadrado menos cuadrado:'],
  [105.2, 108.0, 'dieciséis menos cinco, once. La raíz se fue.'],
  [108.4, 111.2, 'Queda nueve por cuatro menos raíz de cinco,'],
  [111.4, 114.0, 'entre once.'],
  [115.4, 119.8, 'Beto escribe seis raíz de dos y divide sin sufrir.'],
  [120.0, 124.6, 'Así trabajaban los constructores, antes de las calculadoras.'],
];
