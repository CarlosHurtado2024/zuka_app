// «Ecuaciones exponenciales y logarítmicas» (lección alg-73 de Zuka, Selva Exponencial, video 4) en estilo Scale Zoom
// Explainer. Ejemplos propios del video (no salen en los ejercicios de la lección): los ahorros de Beto,
// 2 000 000 · 1.06^t = 6 000 000 → 1.06^t = 3 → t = ln 3 ÷ ln 1.06 ≈ 18.85 años (18 años y 10 meses);
// 8^x = 4^(x + 1) → 2^(3x) = 2^(2x + 2) → x = 2 (64 = 64); y log₂ x + log₂(x − 2) = 3 → x(x − 2) = 8 → x = 4 o x = −2,
// pero log₂(−2) no existe (solución extraña).
// Hilo (docs/storytelling-videos.md): Beto ya sabe cuándo duplica sus dos millones; ahora quiere triplicarlos y la
// incógnita queda en el exponente. Sorpresa anunciada: una trampa en el camino. Cierre: se triplican en unos 18 años y
// 10 meses.
// Niveles: 0 triplicar → 1 por 8^x = 4^(x + 1): igualar bases → 2 por ln: tomar logaritmos → 3 por log₂ x + log₂(x − 2):
// la trampa del dominio.
const POSTER = 104.0;
const SP = s => ({ sup: s }), SB = s => ({ sub: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [470, 1440], r: 140, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [480, 1440], r: 120, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [470, 1440], r: 210, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 960], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'igualar bases', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'logaritmos', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'la trampa', L: [330, 1560] },
  ],
  stops: ['triplicar', 'misma base', 'logaritmos', 'la trampa'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[72.6, 74.2], [107.8, 109.4], [119.0, 135]],
    wides: [[22.0, 23.4], [104.8, 106.2]],
    looks: [],
  },
};

// barras de ahorro cada 6 años hasta el año 18, con la meta de 6 millones
function savings(p, t, t0, y0 = 1230) {
  const k = pop(t, t0); if (k <= 0.01) return;
  [0, 6, 12, 18].forEach((yr, i) => {
    const v = 2 * 1.06 ** yr, kk = pop(t, t0 + .3 + i * .4), x = 250 + i * 190, h = v * 70 * kk;
    if (kk <= 0.01) return;
    shaded(p, 'rect', { x: x - 60, y: r1(y0 - h), width: 120, height: r1(h), rx: 14 }, C.mint, C.mintD, 4, 4);
    tag(p, x, y0 + 40, `año ${yr}`, kk, C.mist, 28);
    tag(p, x, y0 - h - 16, v.toFixed(2), kk, C.mint, 28);
  });
  const kl = eio(seg(t, t0 + 2, t0 + 2.6));
  if (kl > 0.01) for (let j = 0; j < 28; j++) if (j / 28 <= kl) el('rect', { x: 160 + j * 28, y: y0 - 6 * 70 - 2, width: 16, height: 4, rx: 2, fill: C.coral }, p);
  tag(p, 160, y0 - 6 * 70 - 18, 'meta: 6 millones', pop(t, t0 + 2.4), C.coral, 30, 'start');
}

// ---------- nivel 0 · triplicar ----------
function level0(G, t) {
  starField(G, 241, 150);
  savings(G, t, 1.0);
  riseFormula(G, t, 6.8, 999, 540, 1320, 44, ['2.000.000 · 1.06', SP('t'), '= 6.000.000'], { colors: {} });
  riseFormula(G, t, 9.8, 999, 540, 700, 60, ['1.06', SP('t'), '= 3'], { colors: { '= 3': C.sun } });
  tag(G, 540, 770, 'primero se divide entre 2.000.000', pop(t, 10.4), C.mist, 30);
  const ke = life(t, 12.8, 24.4);
  if (ke > 0.01) chip(G, 540, 1400, 'la incógnita en el exponente', ke, ZERO, C.night, 36);
  fchip(G, 470, 1440, ['8', SP('x'), '= 4', SP('x + 1')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), SKY, 50);
}
// ---------- nivel 1 · igualar bases ----------
function level1(G, t) {
  starField(G, 243, 90);
  fchip(G, 540, 700, ['8', SP('x'), '= 4', SP('x + 1')], out(t, 32.4), SKY, 50);
  riseFormula(G, t, 32.0, 999, 540, 830, 54, ['8 = 2', SP('3'), ',', '4 = 2', SP('2')], { colors: {} });
  riseFormula(G, t, 35.0, 999, 540, 950, 60, ['2', SP('3x'), '=', '2', SP('2x + 2')], { colors: {} });
  tag(G, 540, 1030, 'misma base: se igualan los exponentes', pop(t, 38.2), C.mist, 34);
  riseFormula(G, t, 41.2, 999, 540, 1130, 60, ['3x = 2x + 2', ',', 'x = 2'], { colors: { 'x = 2': C.sun } });
  const kc = pop(t, 44.6);
  if (kc > 0.01) chip(G, 540, 1240, '8² = 64 y 4³ = 64', kc, MINT, C.night, 42);
  const kn = life(t, 47.6, 56.6);
  if (kn > 0.01) chip(G, 540, 1340, '¿1.06 y 3 en la misma base? no', kn, NEG, C.night, 36);
  fchip(G, 480, 1440, ['ln'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 56);
}
// ---------- nivel 2 · tomar logaritmos ----------
function level2(G, t) {
  starField(G, 245, 90);
  fchip(G, 540, 700, ['ln'], out(t, 61.0), ZERO, 56);
  riseFormula(G, t, 60.4, 999, 540, 820, 56, ['ln(1.06', SP('t'), ')', '=', 'ln 3'], { colors: {} });
  riseFormula(G, t, 63.2, 999, 540, 930, 56, ['t · ln 1.06', '=', 'ln 3'], { colors: { 't · ln 1.06': C.sun } });
  tag(G, 540, 1010, 'el exponente baja como factor', pop(t, 63.8), C.mist, 34);
  riseFormula(G, t, 69.4, 999, 540, 1120, 56, ['t', '=', { fr: ['ln 3', 'ln 1.06'] }, '=', { fr: ['1.0986', '0.05827'] }], { colors: {} });
  const kt = pop(t, 72.6);
  if (kt > 0.01) chip(G, 540, 1250, 't ≈ 18.85 años', kt, ZERO, C.night, 48);
  const km = pop(t, 75.6);
  if (km > 0.01) chip(G, 540, 1340, 'año 18: 5.71 · año 19: 6.05', km, POS, C.night, 36);
  const kl = life(t, 78.8, 87.4);
  if (kl > 0.01) chip(G, 540, 730, 'con logaritmos: juntar y pasar a potencia', kl, SKY, C.night, 32);
  fchip(G, 470, 1440, ['log', SB('2'), 'x + log', SB('2'), '(x − 2) = 3'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 40);
}
// ---------- nivel 3 · la trampa del dominio ----------
function level3(G, t) {
  starField(G, 247, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['log', SB('2'), 'x + log', SB('2'), '(x − 2) = 3'], out(t, 96.0), NEG, 40);
  const k1 = 1 - eio(seg(t, 110.4, 110.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    riseFormula(Q, t, 95.6, 999, 540, 820, 54, ['log', SB('2'), '[x(x − 2)]', '=', '3'], { colors: {} });
    riseFormula(Q, t, 98.6, 999, 540, 930, 54, ['x(x − 2)', '=', '2', SP('3'), '=', '8'], { colors: {} });
    riseFormula(Q, t, 101.8, 999, 540, 1040, 54, ['(x − 4)(x + 2) = 0'], { colors: {} });
    const ka = pop(t, 102.4), kb = pop(t, 102.8);
    if (ka > 0.01) chip(Q, 360, 1150, 'x = 4', ka, MINT, C.night, 46);
    if (kb > 0.01) chip(Q, 720, 1150, 'x = −2', kb, NEG, C.night, 46);
    badge(Q, 820, 1110, pop(t, 104.8), false);
    tag(Q, 720, 1230, 'no hay logaritmo de −2', pop(t, 105.2), C.coral, 30);
    badge(Q, 450, 1110, pop(t, 107.8), true);
    tag(Q, 360, 1230, '2 + 1 = 3', pop(t, 108.2), C.mint, 32);
  }
  savings(S, t, 110.8, 1250);
  const kc = pop(t, 111.0);
  if (kc > 0.01) chip(S, 540, 720, 'se triplica en el año 19', kc, ZERO, C.night, 42);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Ecuaciones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'exponenciales', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'TRIPLICAR', 'de 2 a 6 millones', 'al 6 % compuesto');
  label(p, t, 12.8, 18.6, 'EN EL EXPONENTE', 'la incógnita es t', 'ecuación exponencial');
  label(p, t, 19.0, 24.4, 'DOS CAMINOS', 'igualar bases', 'o tomar logaritmos');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'hay una trampa', 'en el camino');
  label(p, t, 31.8, 37.8, 'MISMA BASE', '8 = 2 · 2 · 2, 4 = 2 · 2', 'todo en base 2');
  label(p, t, 38.2, 44.2, 'IGUALAR', 'los exponentes', '3x = 2x + 2: x = 2');
  label(p, t, 44.6, 50.2, 'COMPROBAR', '64 a cada lado', 'x = 2 sirve');
  label(p, t, 50.6, 56.6, '¿Y 1.06 Y 3?', 'no comparten base', 'se toma logaritmo');
  label(p, t, 60.0, 66.0, 'LOGARITMO', 'a los dos lados', 'el exponente baja; ln e = 1');
  label(p, t, 66.4, 72.2, 'DESPEJAR', 't = ln 3 ÷ ln 1.06', '1.0986 ÷ 0.05827');
  label(p, t, 72.6, 78.4, '18.85 AÑOS', 'con años completos:', 'se triplica en el año 19');
  label(p, t, 78.8, 84.4, 'AL REVÉS', 'con logaritmos:', 'juntar y pasar a potencia');
  label(p, t, 84.8, 90.4, 'LA TRAMPA', 'el logaritmo', 'solo acepta positivos');
  label(p, t, 95.4, 101.4, 'JUNTAR', 'suma de logaritmos', 'logaritmo del producto');
  label(p, t, 101.8, 107.4, 'DOS RESPUESTAS', 'x = 4 o x = −2', '−2 es una solución extraña');
  label(p, t, 107.8, 114.0, 'SOLO x = 4', 'en base 2: 4 da 2 y 2 da 1', '2 + 1 = 3');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['MISMA BASE', 'se igualan los exponentes'],
  ['SI NO', 'logaritmo a los dos lados'],
  ['CON LOGARITMOS', 'juntar y pasar a potencia'],
  ['SIEMPRE', 'comprobar el dominio'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 4; i++) ev.push({ t: 1.3 + i * .4, type: 'tile', i });
  ev.push({ t: 3.0, type: 'slide', d: .6 }, { t: 6.8, type: 'rise' }, { t: 9.8, type: 'rise' }, { t: 12.8, type: 'card' }, { t: 24.8, type: 'pop', i: 3 });
  ev.push({ t: 32.0, type: 'rise' }, { t: 35.0, type: 'rise' }, { t: 38.2, type: 'card' }, { t: 41.2, type: 'rise' }, { t: 44.6, type: 'yes' }, { t: 47.6, type: 'no' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.4, type: 'rise' }, { t: 63.2, type: 'rise' }, { t: 69.4, type: 'rise' }, { t: 72.6, type: 'hit' }, { t: 75.6, type: 'pop', i: 1 }, { t: 78.8, type: 'card' }, { t: 87.8, type: 'pop', i: 2 });
  ev.push({ t: 95.6, type: 'rise' }, { t: 98.6, type: 'rise' }, { t: 101.8, type: 'rise' }, { t: 102.4, type: 'pop', i: 0 }, { t: 102.8, type: 'pop', i: 1 }, { t: 104.8, type: 'no' }, { t: 107.8, type: 'yes' });
  ev.push({ t: 110.4, type: 'away', d: .4 }, { t: 111.1, type: 'tile', i: 0 }, { t: 111.9, type: 'tile', i: 2 }, { t: 112.4, type: 'hit' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto ya sabe duplicar sus dos millones.'],
  [4.0, 6.6, 'Ahora quiere triplicarlos: seis millones.'],
  [6.8, 9.6, 'Al seis por ciento anual compuesto.'],
  [9.8, 12.4, 'La incógnita queda arriba, en el exponente.'],
  [12.8, 15.6, 'Es una ecuación exponencial.'],
  [15.8, 18.6, 'Y tres no es potencia fácil de esa base.'],
  [19.0, 21.8, 'Hay dos caminos, según las bases.'],
  [22.0, 24.4, 'Y una trampa en el camino.'],
  [24.8, 29.0, 'Primero, el camino fácil: igualar bases.'],
  [31.8, 34.8, 'Ocho y cuatro son potencias de dos.'],
  [35.0, 37.8, 'Todo se escribe en base dos.'],
  [38.2, 41.0, 'Misma base: se igualan los exponentes.'],
  [41.2, 44.2, 'Tres x, dos x más dos: x es dos.'],
  [44.6, 47.4, 'Comprobación: sesenta y cuatro a cada lado.'],
  [47.6, 50.2, 'Pero uno punto cero seis y tres…'],
  [50.6, 53.6, 'no se dejan escribir con la misma base.'],
  [53.8, 56.6, 'Entonces, se toma logaritmo.'],
  [60.0, 63.0, 'Logaritmo natural a los dos lados.'],
  [63.2, 66.0, 'El exponente t baja como factor.'],
  [66.4, 69.2, 'Queda un producto: t por un número.'],
  [69.4, 72.2, 'Se divide: t es ln 3 entre ln 1.06.'],
  [72.6, 75.4, 'Unos dieciocho punto ochenta y cinco años.'],
  [75.6, 78.4, 'Con años completos: el año diecinueve.'],
  [78.8, 81.6, 'Las ecuaciones con logaritmos van al revés:'],
  [81.8, 84.4, 'se juntan y se pasa a potencia.'],
  [84.8, 87.6, 'Y ahí está la trampa de la selva.'],
  [87.8, 90.4, 'Atención al dominio.'],
  [95.4, 98.4, 'Suma de logaritmos: logaritmo del producto.'],
  [98.6, 101.4, 'x por x menos dos debe dar ocho.'],
  [101.8, 104.6, 'Salen dos respuestas: cuatro y menos dos.'],
  [104.8, 107.4, 'Menos dos no tiene logaritmo: trampa.'],
  [107.8, 110.6, 'Solo cuatro sirve: dos más uno, tres.'],
  [110.8, 114.0, 'Volvamos a los ahorros de Beto.'],
  [115.4, 119.6, 'Los dos millones de Beto se triplican'],
  [119.8, 124.4, 'durante el año diecinueve.'],
];
