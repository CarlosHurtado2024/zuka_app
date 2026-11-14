// «Binomio de Newton» (lección alg-24c de Zuka, Taller de los Bloques, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): (a + b)¹, (a + b)², (a + b)³, el triángulo de Pascal
// hasta la fila 4, (a + b)⁴ = a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴ (1 + 4 + 6 + 4 + 1 = 16 productos), el término con x² de
// (x + 2)⁴ = 24x² y C(4, 2) = 6 como maneras de elegir 2 paréntesis de 4.
// Hilo (docs/storytelling-videos.md): Ana tiene que desarrollar (a + b)⁴: son 16 productos de una letra por paréntesis.
// La sorpresa anunciada: los 16 productos caben en una fila del triángulo. Cierre: 1 + 4 + 6 + 4 + 1 = 16.
// Niveles: 0 las potencias de a + b → 1 por «1 3 3 1»: el triángulo → 2 por a³b: los exponentes → 3 por el 6: elegir.
const POSTER = 44.0;
const PAS = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]];
const PX = (r, i) => 540 + (i - r / 2) * 140, PY = r => 740 + r * 115;

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 120, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1460], r: 90, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1385], r: 80, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 900], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'el triángulo', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'los exponentes', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'de dónde sale el 6', L: [330, 1560] },
  ],
  stops: ['las potencias', 'el triángulo', 'los exponentes', 'elegir'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[47.6, 49.2], [105.0, 106.6], [119.0, 135]],
    wides: [[44.6, 46.0], [19.0, 20.4]],
    looks: [],
  },
};
const SP = s => ({ sup: s });

// ---------- nivel 0 · las potencias de a + b ----------
function level0(G, t) {
  starField(G, 81, 150);
  riseFormula(G, t, 1.0, 999, 540, 760, 58, ['(a + b)', SP('4'), '=', '?'], { colors: { '?': C.sun } });
  riseFormula(G, t, 6.8, 999, 540, 880, 50, ['(a + b)', SP('1'), '=', 'a + b'], { colors: {} });
  riseFormula(G, t, 9.8, 999, 540, 980, 50, ['(a + b)', SP('2'), '=', 'a', SP('2'), '+', '2', 'ab +', 'b', SP('2')], { colors: { '2': C.sun } });
  riseFormula(G, t, 12.8, 999, 540, 1080, 46, ['(a + b)', SP('3'), '=', 'a', SP('3'), '+', '3', 'a', SP('2'), 'b +', '3', 'a', 'b', SP('2'), '+', 'b', SP('3')], { colors: { '3': C.sun } });
  const kp = pop(t, 19.2);
  if (kp > 0.01) {
    for (let i = 0; i < 4; i++) chip(G, 270 + i * 180, 1200, '(a + b)', kp, i % 2 ? MINT : SKY, C.night, 38);
    tag(G, 540, 1290, '2 · 2 · 2 · 2 = 16 productos', pop(t, 20.6), C.coral, 40);
  }
  fchip(G, 540, 1385, ['1  3  3  1'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 46);
}
// ---------- nivel 1 · el triángulo ----------
function level1(G, t) {
  starField(G, 83, 90);
  fchip(G, 540, 700, ['1  3  3  1'], out(t, 32.4), ZERO, 46);
  PAS.forEach((row, r) => row.forEach((v, i) => {
    const t0 = r < 4 ? 32.4 + r * .5 + i * .1 : 39.0 + i * .5, k = pop(t, t0);
    if (k <= 0.01) return;
    if (r === 4 && i > 0 && i < 4) {
      const kl = eio(seg(t, t0 - .4, t0));
      for (const j of [i - 1, i]) el('line', { x1: PX(3, j), y1: PY(3) + 34, x2: r1(lerp(PX(3, j), PX(4, i), kl)), y2: r1(lerp(PY(3) + 34, PY(4) - 34, kl)), stroke: C.sun, 'stroke-width': 4, 'stroke-linecap': 'round' }, G);
    }
    const hot = r === 4 && i === 2 && t > 41.0;
    tile(G, PX(r, i), PY(r), 84, String(v), k, hot ? ZERO : r === 3 ? ZERO : r === 4 ? MINT : SKY);
  }));
  const ks = pop(t, 44.8);
  if (ks > 0.01) chip(G, 490, 1360, '1 + 4 + 6 + 4 + 1 = 16', ks, NEG, C.night, 44);
  fchip(G, 540, 1460, ['a', SP('3'), 'b'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 50);
}
// ---------- nivel 2 · los exponentes ----------
const TERMS = [['a⁴', 4, 0, '1'], ['a³b', 3, 1, '4'], ['a²b²', 2, 2, '6'], ['ab³', 1, 3, '4'], ['b⁴', 0, 4, '1']];
const TX = i => 160 + i * 190;
function level2(G, t) {
  starField(G, 85, 90);
  fchip(G, 540, 700, ['a', SP('3'), 'b'], out(t, 61.0), SKY, 50);
  TERMS.forEach(([s, ea, eb, c], i) => {
    const k = pop(t, 60.6 + i * .4);
    chip(G, TX(i), 830, (c === '1' ? '' : c) + s, k, i === 2 ? ZERO : POS, C.night, 40);
    if (i < 4) tag(G, (TX(i) + TX(i + 1)) / 2, 845, '+', k, C.mist, 40);
    tag(G, TX(i), 930, `a: ${ea}`, pop(t, 66.6 + i * .3), C.sun, 34);
    tag(G, TX(i), 980, `b: ${eb}`, pop(t, 69.6 + i * .3), C.mint, 34);
  });
  tag(G, 540, 1060, 'en cada término, los exponentes suman 4', pop(t, 72.8), C.cream, 36);
  riseFormula(G, t, 78.8, 999, 540, 1180, 50, ['(x + 2)', SP('4'), ':', '6 · x', SP('2'), '· 2', SP('2'), '=', '24x', SP('2')], { colors: { '24x': C.sun } });
  tag(G, 540, 1260, 'el término con x²', pop(t, 79.6), C.mist, 34);
  fchip(G, 540, 1385, ['6'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 54);
}
// ---------- nivel 3 · elegir ----------
const PICKS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
function level3(G, t) {
  starField(G, 87, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['6'], out(t, 96.0), ZERO, 54);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const R = scaleAt(S, 540, 960, k1);
    PICKS.forEach((pk, n) => {
      const cx = n % 2 ? 750 : 330, cy = 800 + Math.floor(n / 2) * 95, k = pop(t, 97.6 + n * .5);
      for (let j = 0; j < 4; j++) {
        const isB = pk.includes(j), x = cx + (j - 1.5) * 76;
        if (k > 0.01) { const B = scaleAt(R, x, cy, k); shaded(B, 'rect', { x: x - 32, y: cy - 32, width: 64, height: 64, rx: 12 }, isB ? C.mint : C.blue, isB ? C.mintD : C.blueD, 3, 3); tag(B, x, cy + 14, isB ? 'b' : 'a', 1, C.night, 38); }
      }
    });
    riseFormula(R, t, 101.8, 999, 430, 1150, 54, ['C(4, 2)', '=', '4 · 3 ÷ 2', '=', '6'], { colors: { '6': C.sun } });
    const kb = pop(t, 102.6);
    if (kb > 0.01) { const B = scaleAt(R, 860, 1120, kb); tag(B, 812, 1160, '(', 1, C.cream, 120); tag(B, 908, 1160, ')', 1, C.cream, 120); tag(B, 860, 1100, '4', 1, C.cream, 48); tag(B, 860, 1160, '2', 1, C.cream, 48); tag(B, 860, 1225, 'también así', 1, C.mist, 28); }
    riseFormula(R, t, 104.8, 999, 540, 1260, 46, ['término:', 'C(n, k) · a', SP('n − k'), 'b', SP('k')], { colors: {} });
  }
  riseFormula(S, t, 108.0, 999, 540, 900, 44, ['(a + b)', SP('4'), '=', 'a', SP('4'), '+ 4a', SP('3'), 'b + 6a', SP('2'), 'b', SP('2'), '+ 4ab', SP('3'), '+', 'b', SP('4')], { colors: {} });
  const kf = pop(t, 109.4);
  if (kf > 0.01) chip(S, 540, 1040, '1 + 4 + 6 + 4 + 1 = 16', kf, ZERO, C.night, 44);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Binomio', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'de Newton', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL ENCARGO DE ANA', 'desarrollar (a + b)⁴', 'empieza por las potencias chicas');
  label(p, t, 12.8, 18.6, 'LOS NÚMEROS DE ADELANTE', '1, 2, 1', 'y luego 1, 3, 3, 1');
  label(p, t, 19.0, 24.4, 'A MANO', 'una letra de cada paréntesis', '16 productos');
  label(p, t, 24.8, 29.0, 'UNA PISTA', 'esos números forman un triángulo', 'y esconden los 16 productos');
  label(p, t, 31.8, 37.8, 'EL TRIÁNGULO DE PASCAL', 'arriba, la fila 0: potencia 0', 'cada fila empieza y termina en 1');
  label(p, t, 38.2, 44.2, 'LA REGLA', 'cada número es la suma', 'de los dos de arriba: 3 + 3 = 6');
  label(p, t, 44.6, 50.2, 'LOS 16 PRODUCTOS', 'la fila 4 (potencia 4) suma 16', 'ahí están todos');
  label(p, t, 50.6, 56.6, 'FALTAN LAS LETRAS', '¿qué potencias de a y de b', 'van con cada número?');
  label(p, t, 60.0, 66.0, '(a + b) A LA CUARTA', 'cinco términos', 'con los números 1, 4, 6, 4, 1');
  label(p, t, 66.4, 72.2, 'LOS EXPONENTES', 'los de a bajan: 4, 3, 2, 1, 0', 'los de b suben: 0, 1, 2, 3, 4');
  label(p, t, 72.6, 78.4, 'SIEMPRE SUMAN 4', 'en cada término', 'la potencia del binomio');
  label(p, t, 78.8, 84.4, 'CON NÚMEROS', 'en (x + 2)⁴', 'el término con x² es 24x²');
  label(p, t, 84.8, 90.4, '¿Y EL 6?', '¿por qué el término del medio', 'lleva un 6?');
  label(p, t, 95.4, 101.4, 'ELEGIR', 'de 4 paréntesis, 2 dan b', 'hay 6 maneras');
  label(p, t, 101.8, 107.4, 'NÚMERO COMBINATORIO', 'C(4, 2) = 6', 'maneras de elegir 2 entre 4');
  label(p, t, 107.8, 114.0, 'EL ENCARGO DE ANA', 'en un renglón', 'sin hacer 16 productos');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['PASCAL', 'cada número suma los dos de arriba'],
  ['EXPONENTES', 'los de a bajan, los de b suben'],
  ['COEFICIENTES', 'C(n, k): maneras de elegir k'],
  ['TÉRMINO', ['C(n, k) · a', SP('n − k'), 'b', SP('k')]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'rise' }];
  ev.push({ t: 6.8, type: 'rise' }, { t: 9.8, type: 'rise' }, { t: 12.8, type: 'rise' }, { t: 19.2, type: 'tile', i: 0 }, { t: 20.6, type: 'no' }, { t: 24.8, type: 'pop', i: 1 });
  for (let r = 0; r < 4; r++) ev.push({ t: 32.4 + r * .5, type: 'tile', i: r });
  for (let i = 0; i < 5; i++) ev.push({ t: 39.0 + i * .5, type: 'count', i });
  ev.push({ t: 41.0, type: 'yes' }, { t: 44.8, type: 'hit' }, { t: 45.4, type: 'yes' }, { t: 52.4, type: 'pop', i: 2 });
  for (let i = 0; i < 5; i++) ev.push({ t: 60.6 + i * .4, type: 'tile', i }, { t: 66.6 + i * .3, type: 'count', i }, { t: 69.6 + i * .3, type: 'count', i: 4 - i });
  ev.push({ t: 72.8, type: 'card' }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 87.8, type: 'pop', i: 3 });
  for (let n = 0; n < 6; n++) ev.push({ t: 97.6 + n * .5, type: 'tile', i: n });
  ev.push({ t: 101.8, type: 'rise' }, { t: 102.4, type: 'yes' }, { t: 104.8, type: 'rise' }, { t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 109.4, type: 'hit' }, { t: 110.0, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana debe desarrollar a más b, a la cuarta.'],
  [4.0, 6.4, '¿Hay un atajo?'],
  [6.8, 9.6, 'Empieza por las potencias pequeñas.'],
  [9.8, 12.4, 'Al cuadrado salen los números uno, dos, uno.'],
  [12.8, 15.6, 'Al cubo: uno, tres, tres, uno.'],
  [15.8, 18.6, 'Ya los vimos en el cubo de bloques.'],
  [19.0, 21.8, 'A la cuarta hay cuatro paréntesis.'],
  [22.0, 24.4, 'Una letra de cada uno: dieciséis productos.'],
  [24.8, 29.0, 'Los números esconden un triángulo, y ahí caben los dieciséis.'],
  [31.8, 34.8, 'Es el triángulo de Pascal.'],
  [35.0, 37.8, 'Arriba está la fila cero.'],
  [38.2, 41.0, 'Cada número suma los dos de arriba.'],
  [41.2, 44.2, 'Tres más tres, seis: uno, cuatro, seis, cuatro, uno.'],
  [44.6, 47.4, 'Y la sorpresa: la fila suma dieciséis,'],
  [47.6, 50.2, 'los dieciséis productos de Ana.'],
  [50.6, 53.6, 'Faltan las letras de cada término.'],
  [53.8, 56.6, 'Miremos los exponentes.'],
  [60.0, 63.0, 'A la cuarta hay cinco términos.'],
  [63.2, 66.0, 'Cada uno con su número del triángulo.'],
  [66.4, 69.2, 'Los exponentes de a bajan: cuatro a cero.'],
  [69.4, 72.2, 'Los de b suben de cero a cuatro.'],
  [72.6, 75.4, 'En cada término suman cuatro,'],
  [75.6, 78.4, 'la potencia del binomio.'],
  [78.8, 81.6, 'Con números: x más dos, a la cuarta.'],
  [81.8, 84.4, 'seis, por x cuadrado, por dos al cuadrado.'],
  [84.8, 87.6, '¿Por qué el del medio lleva un seis?'],
  [87.8, 90.4, 'Hay que contar maneras.'],
  [95.4, 98.4, 'Para el término a cuadrado b cuadrado,'],
  [98.6, 101.4, 'dos de los cuatro paréntesis dan b: seis maneras.'],
  [101.8, 104.6, 'Es el número combinatorio cuatro sobre dos.'],
  [104.8, 107.4, 'Cada coeficiente cuenta maneras de elegir.'],
  [107.8, 110.6, 'Ana escribe su binomio en un renglón.'],
  [110.8, 114.0, 'Uno, cuatro, seis, cuatro y uno suman dieciséis.'],
  [115.4, 119.6, 'Los dieciséis productos no desaparecieron:'],
  [119.8, 124.4, 'se agruparon en cinco términos, contados por el triángulo.'],
];
