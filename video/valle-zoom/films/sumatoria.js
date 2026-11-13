// «Sumatoria y productoria» (lección alg-15 de Zuka, Escalera de Sigma, video 5) en estilo Scale Zoom Explainer.
// Ejemplos (no salen en los ejercicios de la lección): la suma de los cien primeros cuadrados = 338 350, Σ 2k (k = 1…5) = 30
// (escenas de respaldo), Σ 4 (k = 1…6) = 24, 1² + 2² + 3² = 14, Π k (k = 1…5) = 5! = 120, la cadena 1, 2, 6, 24, 120,
// 10! = 3 628 800 y Π 2k (k = 1…4) = 384 (respaldo).
// Hilo (docs/storytelling-videos.md): Beto quiere escribir la suma de los cien primeros cuadrados y la pizarra no le alcanza.
// La sorpresa: la sigma de un 4 no da 4, da 24. Cierre: un solo renglón, Σ k² de 1 a 100, y la fórmula da 338 350.
// Niveles: 0 la pizarra → 1 por 4 + 4 + …: las reglas → 2 por 1 + 2 + … + n: sumas famosas → 3 por 1 · 2 · 3 · 4 · 5: productoria.
const POSTER = 16.0;
const SG = (hi, lo = 'k = 1') => ({ big: 'sum', hi, lo });
const PI = (hi, lo = 'k = 1') => ({ big: 'prod', hi, lo });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 170, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1385], r: 140, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 150, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 820], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.6, lock: 26.2, name: 'las reglas', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'sumas famosas', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'productoria', L: [330, 1560] },
  ],
  stops: ['la pizarra', 'las reglas', 'sumas famosas', 'productoria'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[15.0, 16.6], [86.0, 87.6], [119.0, 135]],
    wides: [[34.8, 36.2], [104.8, 106.2]],
    looks: [],
  },
};

// ---------- nivel 0 · la pizarra ----------
const LONG = '1 + 4 + 9 + 16 + 25 + 36 + 49 + 64 + 81 + 100 + 121 + …';
function level0(G, t) {
  starField(G, 15, 150);
  const kb = pop(t, 1.0);
  if (kb > 0.01) {
    const S = scaleAt(G, 540, 790, kb);
    shaded(S, 'rect', { x: 120, y: 600, width: 840, height: 380, rx: 26 }, C.n2, C.n3, 6, 6);
    el('rect', { x: 120, y: 980, width: 840, height: 18, rx: 9, fill: C.creamD }, S);
    const kw = eo(seg(t, 6.8, 11.6)) * (1 - eio(seg(t, 12.6, 13.2)));
    if (kw > 0.01) {
      const B = g(S, { 'clip-path': clipOf('rect', { x: 140, y: 600, width: r1(800 * Math.min(1, kw * 1.4)), height: 380 }) });
      text(B, 160, 820, LONG, { 'font-size': 58, 'font-weight': 600, fill: C.cream, 'data-pass': 1 });
    }
    riseFormula(S, t, 13.2, 999, 540, 840, 100, [SG('100'), 'k', { sup: '2' }], { colors: {} });
  }
  const ka = pop(t, 15.6);
  if (ka > 0.01) {
    tag(G, 420, 690, 'hasta 100', ka, C.sun, 34, 'end');
    tag(G, 420, 930, 'desde k = 1', ka, C.mint, 34, 'end');
    tag(G, 700, 812, 'término', ka, C.coral, 34, 'start');
  }
  riseFormula(G, t, 19.0, 999, 540, 1170, 56, [SG('5'), '2k', '=', '2 + 4 + 6 + 8 + 10', '=', '30'], { colors: { '30': C.mint } });
  fchip(G, 540, 1385, ['4 + 4 + 4 + 4 + 4 + 4'], pop(t, 24.8) * (1 + .1 * wob(t, 25.6, 14, 6)), ZERO, 42);
}
// ---------- nivel 1 · las reglas ----------
function level1(G, t) {
  starField(G, 25, 90);
  fchip(G, 540, 700, ['4 + 4 + 4 + 4 + 4 + 4'], out(t, 33.0), ZERO, 42);
  riseFormula(G, t, 32.4, 999, 540, 860, 50, [SG('6'), '4', '=', '4 + 4 + 4 + 4 + 4 + 4', '=', '24'], { colors: { '24': C.sun } });
  const kn = life(t, 35.4, 44.2); if (kn > 0.01) chip(G, 900, 760, '¡no es 4!', kn, NEG, C.night, 36);
  riseFormula(G, t, 38.4, 999, 540, 990, 56, [SG('n'), 'c', '=', 'n · c'], { colors: { 'n · c': C.sun } });
  riseFormula(G, t, 44.6, 999, 540, 1120, 50, [SG('5'), '2k', '=', '2 ·', SG('5'), 'k', '=', '2 · 15', '=', '30'], { colors: { '30': C.mint } });
  riseFormula(G, t, 50.6, 999, 500, 1250, 44, [SG('n'), '(a', { sub: 'k' }, '+', 'b', { sub: 'k' }, ')', '=', SG('n'), 'a', { sub: 'k' }, '+', SG('n'), 'b', { sub: 'k' }], { colors: {} });
  fchip(G, 540, 1385, ['1 + 2 + … + n'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 42);
}
// ---------- nivel 2 · sumas famosas ----------
function sq(p, x, y, m, k, col) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), c = 40;
  for (let r = 0; r < m; r++) for (let j = 0; j < m; j++) el('rect', { x: r1(x + (j - m / 2) * c + 2), y: r1(y - (r + 1) * c + 2), width: c - 4, height: c - 4, rx: 6, fill: col }, S);
  tag(S, x, y + 50, String(m * m), 1, C.cream, 38);
}
function level2(G, t) {
  starField(G, 39, 90);
  fchip(G, 540, 700, ['1 + 2 + … + n'], out(t, 61.0), MINT, 42);
  riseFormula(G, t, 60.6, 999, 540, 880, 60, [SG('n'), 'k', '=', 'n(n + 1) ÷ 2'], { colors: {} });
  const kq = 1 - eio(seg(t, 84.2, 84.6));
  if (kq > 0.01) {
    const Q = scaleAt(G, 540, 1080, kq);
    sq(Q, 300, 1120, 1, pop(t, 66.6), C.sun); sq(Q, 500, 1120, 2, pop(t, 67.4), C.mint); sq(Q, 740, 1120, 3, pop(t, 68.2), C.blue);
    tag(Q, 400, 1060, '+', pop(t, 67.4), C.mist, 50); tag(Q, 610, 1060, '+', pop(t, 68.2), C.mist, 50);
  }
  riseFormula(G, t, 72.6, 78.4, 540, 1290, 50, ['3 · 4 · 7 ÷ 6', '=', '14'], { colors: { '14': C.mint } });
  riseFormula(G, t, 78.8, 999, 540, 1280, 50, [SG('n'), 'k', { sup: '2' }, '=', 'n(n + 1)(2n + 1) ÷ 6'], { colors: {} });
  riseFormula(G, t, 84.8, 999, 540, 1110, 52, ['100 · 101 · 201 ÷ 6', '=', '338 350'], { colors: { '338 350': C.sun } });
  fchip(G, 540, 1385, ['1 · 2 · 3 · 4 · 5'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), SKY, 42);
}
// ---------- nivel 3 · productoria ----------
const FX = i => 180 + i * 180, FACT = [1, 2, 6, 24, 120];
function level3(G, t) {
  starField(G, 51, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['1 · 2 · 3 · 4 · 5'], out(t, 96.0), SKY, 42);
  riseFormula(S, t, 95.8, 999, 540, 880, 56, [PI('5'), 'k', '=', '1 · 2 · 3 · 4 · 5', '=', '120'], { colors: { '120': C.sun } });
  FACT.forEach((v, i) => {
    chip(S, FX(i), 1050, String(v), pop(t, 101.8 + i * .4), i === 4 ? ZERO : SKY, C.night, 36);
    tag(S, FX(i), 1120, `${i + 1}!`, pop(t, 102.0 + i * .4), C.mist, 32);
    if (i) tag(S, (FX(i - 1) + FX(i)) / 2, 1000, `×${i + 1}`, pop(t, 102.2 + i * .4), C.sun, 30);
  });
  riseFormula(S, t, 104.8, 107.4, 540, 1230, 52, ['10!', '=', '3 628 800'], { colors: { '3 628 800': C.coral } });
  riseFormula(S, t, 107.8, 999, 540, 1240, 56, [PI('4'), '2k', '=', '2 · 4 · 6 · 8', '=', '384'], { colors: { '384': C.mint } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Sumatoria', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'y productoria', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LA PIZARRA DE BETO', 'los cien primeros cuadrados', '1 + 4 + 9 + … no cabe');
  label(p, t, 12.8, 18.6, 'EN UN RENGLÓN', 'la letra griega sigma', 'quiere decir «suma»');
  label(p, t, 19.0, 24.4, 'LAS PARTES', 'k va de 1 a 5', 'en cada paso, el término 2k');
  label(p, t, 24.8, 29.0, '¿Y SI NO HAY k?', 'el término es solo un 4', '¿cuánto da?');
  label(p, t, 31.8, 37.8, 'LA SORPRESA', 'el 4 se suma 6 veces', 'da 24, no 4');
  label(p, t, 38.2, 44.2, 'UNA CONSTANTE', 'se suma n veces', 'n por c');
  label(p, t, 44.6, 50.2, 'EL NÚMERO SALE', 'un factor común sale', 'de la sigma');
  label(p, t, 50.6, 56.6, 'SE REPARTE', 'una suma de dos listas', 'se separa en dos sigmas');
  label(p, t, 60.0, 66.0, 'SUMAS FAMOSAS', 'la de Gauss', '1 + 2 + … + n');
  label(p, t, 66.4, 72.2, 'LOS CUADRADOS', '1 + 4 + 9', 'cuadrados de 1, 2 y 3');
  label(p, t, 72.6, 78.4, 'CON FÓRMULA', 'n = 3: 3 · 4 · 7 ÷ 6', 'da 14');
  label(p, t, 78.8, 84.4, 'PARA CUALQUIER n', 'la suma de cuadrados', 'tiene su propia fórmula');
  label(p, t, 84.8, 90.4, 'LA DE BETO', 'n = 100', '338 350');
  label(p, t, 95.4, 101.4, 'PRODUCTORIA', 'la pi grande multiplica', 'en vez de sumar');
  label(p, t, 101.8, 107.4, 'EL FACTORIAL', '5! = 1 · 2 · 3 · 4 · 5', 'crece rapidísimo');
  label(p, t, 107.8, 114.0, 'OTRO TÉRMINO', 'con 2k, de 1 a 4', '2 · 4 · 6 · 8 = 384');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SIGMA', 'k recorre de abajo hasta arriba'],
  ['UNA CONSTANTE', [SG('n'), 'c', '=', 'n · c']],
  ['CUADRADOS', [SG('n'), 'k', { sup: '2' }, '=', 'n(n + 1)(2n + 1) ÷ 6']],
  ['PRODUCTORIA', [PI('n'), 'k', '=', 'n!']],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'pop', i: 0 }, { t: 6.8, type: 'paint', d: 4.8 }];
  ev.push({ t: 12.6, type: 'away', d: .6 }, { t: 13.2, type: 'rise' }, { t: 13.8, type: 'yes' }, { t: 15.6, type: 'pop', i: 1 }, { t: 19.0, type: 'rise' }, { t: 24.8, type: 'pop', i: 2 });
  ev.push({ t: 32.4, type: 'rise' }, { t: 35.4, type: 'hit' }, { t: 38.4, type: 'rise' }, { t: 44.6, type: 'rise' }, { t: 45.2, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.6, type: 'rise' }, { t: 66.6, type: 'tile', i: 0 }, { t: 67.4, type: 'tile', i: 1 }, { t: 68.2, type: 'tile', i: 2 });
  ev.push({ t: 72.6, type: 'rise' }, { t: 73.2, type: 'yes' }, { t: 78.8, type: 'rise' }, { t: 84.8, type: 'rise' }, { t: 85.4, type: 'yes' }, { t: 87.8, type: 'pop', i: 1 });
  ev.push({ t: 95.8, type: 'rise' });
  for (let i = 0; i < 5; i++) ev.push({ t: 101.8 + i * .4, type: 'count', i });
  ev.push({ t: 104.8, type: 'rise' }, { t: 105.4, type: 'hit' }, { t: 107.8, type: 'rise' }, { t: 108.4, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto quiere sumar los cien primeros cuadrados.'],
  [4.0, 6.4, 'Pero antes tiene que escribir la suma.'],
  [6.8, 9.6, 'Uno, más cuatro, más nueve, más dieciséis…'],
  [9.8, 12.4, 'La pizarra no le alcanza.'],
  [12.8, 15.6, 'La letra sigma lo dice en un renglón:'],
  [15.8, 18.6, 'suma k al cuadrado, desde uno hasta cien.'],
  [19.0, 21.8, 'Sigma de dos k, de uno a cinco:'],
  [22.0, 24.4, 'Dos, cuatro, seis, ocho y diez: treinta.'],
  [24.8, 29.0, '¿Y si el término no tiene k? Por ejemplo, un cuatro.'],
  [31.8, 34.8, 'De uno a seis, cada k pone un cuatro.'],
  [35.0, 37.8, 'Sorpresa: no da cuatro, da veinticuatro.'],
  [38.2, 41.0, 'Una constante se suma n veces:'],
  [41.2, 44.2, 'n por c.'],
  [44.6, 47.4, 'Un número que multiplica a todos los términos'],
  [47.6, 50.2, 'puede salir de la sigma.'],
  [50.6, 53.6, 'Y una suma se reparte en dos sigmas.'],
  [53.8, 56.6, 'Con estas reglas, algunas sumas tienen fórmula.'],
  [60.0, 63.0, 'La más famosa, la de Gauss:'],
  [63.2, 66.0, 'n por n más uno, entre dos.'],
  [66.4, 69.2, 'Los cuadrados: uno, cuatro, nueve.'],
  [69.4, 72.2, 'Suman catorce.'],
  [72.6, 75.4, 'La fórmula con n igual a tres:'],
  [75.6, 78.4, 'tres por cuatro por siete, entre seis: catorce.'],
  [78.8, 81.6, 'Sirve para cualquier n.'],
  [81.8, 84.4, 'Para Beto, n es cien:'],
  [84.8, 87.6, 'trescientos treinta y ocho mil trescientos cincuenta.'],
  [87.8, 90.4, '¿Y si en vez de sumar multiplicamos?'],
  [95.4, 98.4, 'La pi grande multiplica los términos:'],
  [98.6, 101.4, 'uno por dos por tres, hasta cinco.'],
  [101.8, 104.6, 'Es cinco factorial: ciento veinte.'],
  [104.8, 107.4, 'Diez factorial pasa de tres millones.'],
  [107.8, 110.6, 'Con dos k, de uno a cuatro:'],
  [110.8, 114.0, 'dos, cuatro, seis y ocho: trescientos ochenta y cuatro.'],
  [115.4, 119.6, 'Beto escribe un solo renglón: sigma de k al cuadrado.'],
  [119.8, 124.4, 'Y la fórmula le da trescientos treinta y ocho mil trescientos cincuenta.'],
];
