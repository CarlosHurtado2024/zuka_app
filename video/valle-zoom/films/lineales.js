// «Ecuaciones lineales» (lección alg-1 de Zuka, Fuente de la Parábola, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): las baldosas de Ana 3x + 4 = 25 (x = 7),
// 4x + 3 = x + 15 (x = 4), 2(x + 3) = x + 11 (x = 5), (x + 1)/3 − 1 = 2 (x = 8), x + 1 = x + 3 (sin solución) y
// 2(x + 1) = 2x + 2 (todo x sirve).
// Hilo (docs/storytelling-videos.md): Ana compra baldosas para la fuente: tres cajas cerradas y cuatro sueltas son 25.
// ¿Cuántas trae cada caja? Una ecuación es una balanza. Sorpresa anunciada: hay balanzas que nunca se equilibran y otras que
// siempre lo están. Cierre: cada caja trae 7 baldosas.
// Niveles: 0 la balanza → 1 por «− 4»: despejar → 2 por cajas a los dos lados → 3 por 2(x + 3): paréntesis, fracciones y casos raros.
const POSTER = 40.0;
const SP = s => ({ sup: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1400], r: 80, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1400], r: 170, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1400], r: 110, A: [540, 700] },
  ],
  open: { Z0: 2.2, C: [540, 950], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'despejar', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'cajas a los dos lados', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'casos raros', L: [330, 1560] },
  ],
  stops: ['la balanza', 'despejar', 'dos lados', 'casos raros'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[47.6, 49.2], [81.8, 83.4], [119.0, 135]],
    wides: [[15.8, 17.2], [101.8, 103.2]],
    looks: [],
  },
};

// la balanza: L y R son listas de piezas { b: caja | u: baldosa, k: escala, a: opacidad }; tilt en grados (positivo: baja la derecha)
const BX = [310, 770], BY = 1060;
function balance(G, t, kIn, L, R, tilt = 0) {
  if (kIn <= 0.01) return;
  const S = scaleAt(G, 540, 1100, kIn);
  shaded(S, 'path', { d: 'M540,920 L610,1200 L470,1200 Z' }, C.n3, C.n2, 4, 4);
  const B = g(S, { transform: `rotate(${tilt.toFixed(2)} 540 920)` });
  el('rect', { x: 130, y: 912, width: 820, height: 16, rx: 8, fill: C.mist }, B);
  [L, R].forEach((items, side) => {
    const cx = BX[side];
    el('line', { x1: cx, y1: 920, x2: cx, y2: BY, stroke: C.mist, 'stroke-width': 4 }, B);
    el('rect', { x: cx - 160, y: BY, width: 320, height: 14, rx: 7, fill: C.cream }, B);
    let bx = 0, ux = 0, uy = 0;
    const boxes = items.filter(q => q.b), units = items.filter(q => !q.b), nb = boxes.length;
    boxes.forEach(q => { const x = cx - (nb - 1) * 40 + bx * 80; bx++; if (q.k > 0.01) { blk(B, x - 38, BY - 82, 76, 76, q.k, SKY, ['x'], 40); } });
    units.forEach(q => {
      const x = cx - 140 + ux * 40, y = (nb ? BY - 120 : BY - 42) - uy * 40;
      ux++; if (ux === 8) { ux = 0; uy++; }
      if (q.k > 0.01) blk(B, x, y, 34, 34, q.k, ZERO, null);
    });
  });
}
const items = (nb, nu, f) => [...Array(nb)].map((_, i) => ({ b: 1, k: f ? f('b', i) : 1 })).concat([...Array(nu)].map((_, i) => ({ k: f ? f('u', i) : 1 })));

// ---------- nivel 0 · la balanza ----------
function level0(G, t) {
  starField(G, 111, 150);
  const kin = pop(t, 1.0);
  const L = items(3, 4, (ty, i) => ty === 'b' ? pop(t, i ? 6.8 + i * .3 : 1.0) : pop(t, 8.0 + i * .2));
  const R = items(0, 25, (ty, i) => i === 24 ? pop(t, 9.8 + i * .06) * (1 - eio(seg(t, 15.8, 16.2)) + eio(seg(t, 18.0, 18.4))) : pop(t, 9.8 + i * .06));
  const tilt = -6 * (eio(seg(t, 16.0, 16.6)) - eio(seg(t, 18.0, 18.6)));
  balance(G, t, kin, L, R, tilt);
  riseFormula(G, t, 12.8, 999, 540, 1300, 70, ['3x + 4', '=', '25'], { colors: {} });
  fchip(G, 540, 1400, ['− 4'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), NEG, 46);
}
// ---------- nivel 1 · despejar ----------
function level1(G, t) {
  starField(G, 113, 90);
  fchip(G, 540, 700, ['− 4'], out(t, 32.4), NEG, 46);
  const gone = eio(seg(t, 33.4, 34.4));
  const L = items(3, 4, (ty) => ty === 'b' ? 1 : 1 - gone);
  const R = items(0, 25, (ty, i) => i >= 21 ? 1 - gone : 1);
  balance(G, t, pop(t, 32.0) * out(t, 44.2), L, R, 0);
  riseFormula(G, t, 32.6, 37.8, 540, 1300, 56, ['3x + 4 − 4', '=', '25 − 4'], { colors: {} });
  riseFormula(G, t, 38.2, 44.2, 540, 1300, 60, ['3x', '=', '21'], { colors: {} });
  // tres cajas, tres grupos
  const kg = pop(t, 44.6);
  if (kg > 0.01) {
    for (let r = 0; r < 3; r++) {
      blk(G, 220, 820 + r * 110, 80, 80, kg, SKY, ['x'], 40);
      tag(G, 340, 872 + r * 110, '=', kg, C.cream, 48);
      for (let j = 0; j < 7; j++) blk(G, 390 + j * 60, 830 + r * 110, 52, 52, pop(t, 45.6 + r * .4 + j * .05), ZERO, null);
    }
  }
  riseFormula(G, t, 44.6, 999, 540, 1180, 58, ['3x', '=', '21'], { colors: {} });
  riseFormula(G, t, 47.6, 999, 540, 1290, 64, ['x', '=', '21 ÷ 3', '=', '7'], { colors: { '7': C.sun } });
  fchip(G, 540, 1400, ['4x + 3 = x + 15'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 44);
}
// ---------- nivel 2 · cajas a los dos lados ----------
function level2(G, t) {
  starField(G, 115, 90);
  fchip(G, 540, 700, ['4x + 3 = x + 15'], out(t, 61.0), SKY, 44);
  const g1 = eio(seg(t, 66.6, 67.6)), g2 = eio(seg(t, 72.8, 73.8));
  const L = items(4, 3, (ty, i) => ty === 'b' ? pop(t, 60.4 + i * .2) * (i === 3 ? 1 - g1 : 1) : pop(t, 61.4 + i * .2) * (1 - g2));
  const R = items(1, 15, (ty, i) => ty === 'b' ? pop(t, 62.0) * (1 - g1) : pop(t, 62.4 + i * .06) * (i >= 12 ? 1 - g2 : 1));
  balance(G, t, pop(t, 60.2), L, R, 0);
  riseFormula(G, t, 66.6, 72.2, 540, 1300, 54, ['4x + 3 − x', '=', 'x + 15 − x'], { colors: {} });
  riseFormula(G, t, 72.6, 78.4, 540, 1300, 58, ['3x + 3 − 3', '=', '15 − 3'], { colors: {} });
  riseFormula(G, t, 78.8, 999, 540, 1300, 60, ['3x', '=', '12', ',', 'x', '=', '4'], { colors: { '4': C.sun } });
  tag(G, 540, 760, 'comprobación: 4 · 4 + 3 = 19 = 4 + 15', pop(t, 82.0), C.mint, 36);
  fchip(G, 540, 1400, ['2(x + 3)'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 46);
}
// ---------- nivel 3 · paréntesis, fracciones y casos raros ----------
function level3(G, t) {
  starField(G, 117, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['2(x + 3)'], out(t, 96.0), MINT, 46);
  const k1 = 1 - eio(seg(t, 101.4, 101.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    riseFormula(Q, t, 95.6, 999, 540, 820, 54, ['2(x + 3)', '=', 'x + 11'], { colors: {} });
    riseFormula(Q, t, 96.2, 999, 540, 920, 54, ['2x + 6', '=', 'x + 11'], { colors: {} });
    riseFormula(Q, t, 96.8, 999, 540, 1020, 58, ['x', '=', '5'], { colors: { '5': C.sun } });
    riseFormula(Q, t, 97.4, 999, 540, 1150, 50, [{ fr: ['x + 1', '3'] }, '− 1', '=', '2', { s: 'arrow' }, 'x + 1 − 3', '=', '6'], { colors: {} });
    tag(Q, 540, 1260, 'todo por 3, también el 1: x = 8', pop(t, 97.8), C.sun, 40);
  }
  const k2 = 1 - eio(seg(t, 107.4, 107.8));
  if (k2 > 0.01 && t > 101.6) {
    const Q = scaleAt(S, 540, 1000, k2);
    riseFormula(Q, t, 101.8, 999, 540, 860, 54, ['x + 1', '=', 'x + 3', { s: 'arrow' }, '1', '=', '3'], { colors: { '3': C.coral } });
    badge(Q, 900, 840, pop(t, 102.2), false);
    tag(Q, 540, 940, 'ningún x sirve: no tiene solución', pop(t, 102.4), C.coral, 36);
    riseFormula(Q, t, 103.2, 999, 540, 1080, 50, ['2(x + 1)', '=', '2x + 2', { s: 'arrow' }, '0', '=', '0'], { colors: {} });
    badge(Q, 900, 1060, pop(t, 103.8), true);
    tag(Q, 540, 1160, 'todo x sirve: infinitas soluciones', pop(t, 103.6), C.mint, 36);
  }
  // vuelta a Ana
  riseFormula(S, t, 108.0, 999, 540, 900, 64, ['3 · 7 + 4', '=', '25'], { colors: { '25': C.mint } });
  const kc = pop(t, 109.2);
  if (kc > 0.01) chip(S, 540, 1040, 'cada caja trae 7 baldosas', kc, ZERO, C.night, 44);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Ecuaciones', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'lineales', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'LAS BALDOSAS DE ANA', 'tres cajas cerradas y cuatro sueltas', 'pesan como 25 sueltas');
  label(p, t, 12.8, 18.6, 'UNA ECUACIÓN', 'es una balanza en equilibrio', 'x: lo que trae cada caja');
  label(p, t, 19.0, 24.4, 'LA REGLA', 'si se quita de un lado, se inclina', 'hay que hacer lo mismo en los dos');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'algunas nunca se equilibran', 'y otras siempre lo están');
  label(p, t, 31.8, 37.8, 'QUITAR 4', 'de los dos lados', 'el equilibrio sigue');
  label(p, t, 38.2, 44.2, 'QUEDA', 'tres cajas', 'contra 21 baldosas');
  label(p, t, 44.6, 50.2, 'REPARTIR', '21 entre las 3 cajas', 'cada una, 7');
  label(p, t, 50.6, 56.6, 'DESPEJAR', 'deshacer lo que le hicieron a x', 'en orden inverso');
  label(p, t, 60.0, 66.0, 'CAJAS A LOS DOS LADOS', '4x + 3 = x + 15', '¿qué se quita primero?');
  label(p, t, 66.4, 72.2, 'UNA CAJA DE CADA LADO', 'se quita de los dos', 'quedan cajas solo a la izquierda');
  label(p, t, 72.6, 78.4, 'Y LAS SUELTAS', 'se quitan 3 de cada lado', '3x = 12');
  label(p, t, 78.8, 84.4, 'x = 4', 'y se comprueba', '4 · 4 + 3 = 19 = 4 + 15');
  label(p, t, 84.8, 90.4, 'CON PARÉNTESIS', 'primero se reparte', 'y luego se despeja');
  label(p, t, 95.4, 101.4, 'PARÉNTESIS Y FRACCIONES', 'se reparte el 2', 'y una fracción se quita multiplicando');
  label(p, t, 101.8, 107.4, 'LOS CASOS RAROS', 'si sale 1 = 3: no hay solución', 'si sale lo mismo: todas sirven');
  label(p, t, 107.8, 114.0, 'LAS CAJAS DE ANA', '3 · 7 + 4 = 25', 'cada caja trae 7');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['BALANZA', 'lo mismo a los dos lados'],
  ['DESPEJAR', 'deshacer en orden inverso'],
  ['COMPROBAR', 'reemplazar x en la ecuación'],
  ['CASOS RAROS', 'ninguna solución o todas'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'hit' }];
  for (let i = 1; i < 3; i++) ev.push({ t: 6.8 + i * .3, type: 'tile', i });
  for (let i = 0; i < 4; i++) ev.push({ t: 8.0 + i * .2, type: 'count', i });
  for (let i = 0; i < 25; i += 3) ev.push({ t: 9.8 + i * .06, type: 'count', i });
  ev.push({ t: 12.8, type: 'rise' }, { t: 15.8, type: 'away', d: .4 }, { t: 16.0, type: 'no' }, { t: 18.0, type: 'pop', i: 0 }, { t: 18.6, type: 'yes' }, { t: 24.8, type: 'pop', i: 1 });
  ev.push({ t: 32.6, type: 'rise' }, { t: 33.4, type: 'away', d: 1.0 }, { t: 44.6, type: 'rise' });
  for (let r = 0; r < 3; r++) ev.push({ t: 45.6 + r * .4, type: 'tile', i: r });
  ev.push({ t: 47.6, type: 'rise' }, { t: 48.2, type: 'yes' }, { t: 52.4, type: 'pop', i: 2 });
  ev.push({ t: 60.2, type: 'hit' }, { t: 66.6, type: 'rise' }, { t: 66.6, type: 'away', d: 1.0 }, { t: 72.6, type: 'rise' }, { t: 72.8, type: 'away', d: 1.0 }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 82.0, type: 'pop', i: 0 }, { t: 87.8, type: 'pop', i: 3 });
  for (let i = 0; i < 4; i++) ev.push({ t: 95.8 + i, type: 'rise' });
  ev.push({ t: 101.4, type: 'away', d: .4 }, { t: 101.8, type: 'rise' }, { t: 102.8, type: 'no' }, { t: 104.8, type: 'rise' }, { t: 105.8, type: 'yes' });
  ev.push({ t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 109.2, type: 'hit' }, { t: 109.8, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana compra baldosas para la fuente.'],
  [4.0, 6.4, '¿Cuántas trae cada caja?'],
  [6.8, 9.6, 'Tres cajas cerradas iguales y cuatro sueltas,'],
  [9.8, 12.4, 'pesan lo mismo que veinticinco baldosas.'],
  [12.8, 15.6, 'Tres x más cuatro, igual a veinticinco.'],
  [15.8, 18.6, 'Si quitamos algo de un solo lado, se inclina.'],
  [19.0, 21.8, 'La regla: lo que se hace en un lado,'],
  [22.0, 24.4, 'se hace también en el otro.'],
  [24.8, 29.0, 'Y un aviso: hay balanzas que nunca se equilibran.'],
  [31.8, 34.8, 'Quitamos las cuatro sueltas de los dos lados.'],
  [35.0, 37.8, 'El equilibrio sigue.'],
  [38.2, 41.0, 'Quedan tres cajas,'],
  [41.2, 44.2, 'contra veintiuna baldosas.'],
  [44.6, 47.4, 'Repartimos las veintiuna entre las tres cajas:'],
  [47.6, 50.2, 'siete en cada una.'],
  [50.6, 53.6, 'Despejar es deshacer en orden inverso.'],
  [53.8, 56.6, '¿Y si hay cajas en los dos lados?'],
  [60.0, 63.0, 'Cuatro cajas y tres sueltas,'],
  [63.2, 66.0, 'contra una caja y quince sueltas.'],
  [66.4, 69.2, 'Quitamos una caja de cada lado.'],
  [69.4, 72.2, 'Ahora hay cajas solo a la izquierda.'],
  [72.6, 75.4, 'Quitamos tres sueltas de cada lado:'],
  [75.6, 78.4, 'tres cajas contra doce.'],
  [78.8, 81.6, 'Cada caja trae cuatro.'],
  [81.8, 84.4, 'Y se comprueba: los dos lados dan diecinueve.'],
  [84.8, 87.6, '¿Y con paréntesis?'],
  [87.8, 90.4, 'Primero se reparte.'],
  [95.4, 98.4, 'Se reparte el dos, y x es cinco.'],
  [98.6, 101.4, 'Una fracción se quita multiplicando todo por tres.'],
  [101.8, 104.6, 'Si sale uno igual a tres, no hay solución.'],
  [104.8, 107.4, 'Si sale cero igual a cero, todas sirven.'],
  [107.8, 110.6, 'Volvamos a las cajas de Ana:'],
  [110.8, 114.0, 'tres por siete, más cuatro, es veinticinco.'],
  [115.4, 119.6, 'La balanza de Ana se equilibra con siete:'],
  [119.8, 124.4, 'cada caja trae siete baldosas.'],
];
