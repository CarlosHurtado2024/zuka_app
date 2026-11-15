// «Ley de senos» (lección trig-46a, Faro de los Ángulos, video 7) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): dos faros a 10 km ven una bengala con 75° y 60° (tercer ángulo 45°;
// 10 sen 60°/sen 45° ≈ 12.25 km y 10 sen 75°/sen 45° ≈ 13.66 km) y el caso ambiguo A = 40°, b = 12, a = 9 (h ≈ 7.71;
// B ≈ 59.0° o 121.0°).
// Hilo: una bengala de auxilio en el mar: ¿a qué distancia está de cada faro? El triángulo no es rectángulo.
// Sorpresa anunciada: la ley nace de partir el triángulo (y a veces hay dos triángulos). Cierre: 12.25 y 13.66 km.
const POSTER = 76;
const FILM = stdFilm({
  open: { Z0: 1.6, C: [500, 900], t1: 3.8, t2: 6.0 },
  aims: ['partir el triángulo', 'resolver', 'el caso ambiguo'],
  stops: ['la bengala', 'la ley', 'resolver', 'dos triángulos'],
  wides: [[15.8, 17.4], [104.8, 106.4]],
  smiles: [[53.8, 55.6], [119.0, 135]],
});
const KM = 52, FP = [190, 1180], FQ = [190 + 10 * KM, 1180];
const FF = pc(FP[0], FP[1], 10 * Math.sin(60 * D2R) / Math.sin(45 * D2R) * KM, 75);
function flare(p, t, x, y, k) {
  if (k <= 0.01) return;
  for (let j = 0; j < 8; j++) { const q = pc(x, y, 30 + 8 * Math.sin(t * 6 + j), j * 45); capsule(p, x, y, q[0], q[1], 6, C.coral); }
  dot(p, x, y, k, C.sun, 14);
  boat(p, x + 30, y + 70, 36, k, [C.cream, C.creamD]);
}
function coast(p, t, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, 540, FP[1], k);
  el('rect', { x: -200, y: FP[1] + 50, width: 1480, height: 60, fill: C.mintD }, S);
  sea(S, t, 520, -200, W + 200, 1, 4);
  el('rect', { x: -200, y: FP[1] + 40, width: 1480, height: 60, fill: C.mint }, S);
  lighthouse(S, FP[0], FP[1] + 40, 150, 1, 1); lighthouse(S, FQ[0], FQ[1] + 40, 150, 1, 1);
}
function level0(G, t) {
  starField(G, 451, 150);
  const k = pop(t, 0.3) * out(t, 28.8);
  coast(G, t, k);
  if (k > 0.01) {
    flare(G, t, FF[0], FF[1], pop(t, 4.0) * k);
    const kb = eio(seg(t, 7.0, 8.0)) * k;
    segAB(G, FP, FF, kb, C.sun, 5); segAB(G, FQ, FF, kb, C.sun, 5); segAB(G, FP, FQ, eio(seg(t, 1.0, 1.8)) * k, C.cream, 5);
    angMark(G, FP, FQ, FF, 90, eio(seg(t, 9.8, 10.4)) * k, C.cream, '75°', 36);
    angMark(G, FQ, FF, FP, 90, eio(seg(t, 10.6, 11.2)) * k, C.cream, '60°', 36);
    tag(G, (FP[0] + FQ[0]) / 2, FP[1] + 30 - 0, '10 km', pop(t, 1.8) * k, C.night, 38);
    const kq = pop(t, 13.0) * k;
    if (kq > 0.01) { sideLab(G, FP, FF, '?', 40, kq, C.coral, 50); sideLab(G, FF, FQ, '?', 40, kq, C.coral, 50); }
    if (t > 19.0) badge(G, 860, 700, pop(t, 19.2) * k, false);
  }
  fchip(G, 480, 1440, ['h'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 56);
}
// ---------- nivel 1 · la ley ----------
const TA = [170, 1180], TB = [920, 1180], TC = [400, 640];
function level1(G, t) {
  starField(G, 453, 90);
  fchip(G, 540, 700, ['h'], out(t, 32.4), ZERO, 56);
  const H = [TC[0], TA[1]];
  tri(G, [TA, TB, TC], pop(t, 31.8), C.n2, [C.cream, C.mint, C.coral], 8);
  tag(G, TA[0] - 20, TA[1] + 50, 'A', pop(t, 32.2), C.cream, 44); tag(G, TB[0] + 20, TB[1] + 50, 'B', pop(t, 32.4), C.cream, 44); tag(G, TC[0], TC[1] - 30, 'C', pop(t, 32.6), C.cream, 44);
  sideLab(G, TC, TA, 'b', -40, pop(t, 33.0), C.coral, 46); sideLab(G, TB, TC, 'a', -40, pop(t, 33.2), C.mint, 46); sideLab(G, TA, TB, 'c', -10, pop(t, 33.4), C.cream, 46);
  const kh = eio(seg(t, 32.6, 33.6));
  if (kh > 0.01) { segAB(G, TC, H, kh, C.sun, 8); rightMark(G, H, TA, TC, 30, kh, C.mist); tag(G, TC[0] + 24, (TC[1] + H[1]) / 2, 'h', kh, C.sun, 48, 'start'); }
  angMark(G, TA, TB, TC, 80, eio(seg(t, 38.4, 39.0)), C.coral, null);
  angMark(G, TB, TA, TC, 80, eio(seg(t, 41.4, 42.0)), C.mint, null);
  riseFormula(G, t, 38.6, 50.2, 540, 1330, 46, ['h', '=', 'b', '·', 'sen A'], { fill: C.coral });
  riseFormula(G, t, 41.6, 50.2, 540, 1420, 46, ['h', '=', 'a', '·', 'sen B'], { fill: C.mint });
  riseFormula(G, t, 44.8, 50.2, 540, 520, 50, ['a', '·', 'sen B', '=', 'b', '·', 'sen A']);
  riseFormula(G, t, 50.8, 56.6, 540, 520, 50, [FR('a', 'sen A'), '=', FR('b', 'sen B'), '=', FR('c', 'sen C')], { fill: C.sun });
  fchip(G, 480, 1440, ['45°'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), ZERO, 52);
}
// ---------- nivel 2 · resolver ----------
function level2(G, t) {
  starField(G, 455, 90);
  fchip(G, 540, 700, ['45°'], out(t, 61.0), ZERO, 52);
  const k = pop(t, 60.2) * (1 - eio(seg(t, 90.6, 91.0)));
  if (k > 0.01) {
    const S = scaleAt(G, 540, 1000, k * .95);
    coast(S, t, 1);
    tri(S, [FP, FQ, FF], 1, C.n2, [C.cream, C.mint, C.coral], 6);
    angMark(S, FP, FQ, FF, 80, 1, C.cream, '75°', 32); angMark(S, FQ, FF, FP, 80, 1, C.cream, '60°', 32);
    angMark(S, FF, FP, FQ, 90, eio(seg(t, 61.4, 62.2)), C.sun, '45°', 36);
    const k1 = eio(seg(t, 75.8, 76.6)), k2 = eio(seg(t, 81.8, 82.6));
    if (k1 > 0.01) { segAB(S, FP, FF, k1, C.sun, 10); sideLab(S, FP, FF, '12.25 km', 70, k1, C.sun, 38); }
    if (k2 > 0.01) { segAB(S, FQ, FF, k2, C.sun, 10); sideLab(S, FF, FQ, '13.66 km', 70, k2, C.sun, 38); }
    flare(S, t, FF[0], FF[1], 1);
  }
  riseFormula(G, t, 66.6, 72.2, 540, 1380, 44, [FR('10', 'sen 45°'), '=', FR('PF', 'sen 60°'), '=', FR('QF', 'sen 75°')]);
  riseFormula(G, t, 72.8, 78.4, 540, 1380, 44, ['PF', '=', FR('10 · sen 60°', 'sen 45°'), '≈', '12.25']);
  riseFormula(G, t, 79.0, 84.4, 540, 1380, 44, ['QF', '=', FR('10 · sen 75°', 'sen 45°'), '≈', '13.66']);
  fchip(G, 480, 1440, ['LLA'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 52);
}
// ---------- nivel 3 · el caso ambiguo ----------
function level3(G, t) {
  starField(G, 457, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['LLA'], out(t, 96.0), NEG, 52);
  const U = 46, A = [140, 1150], b = 12, a = 9, Cc = pc(A[0], A[1], b * U, 40), h = b * Math.sin(40 * D2R);
  const dx = Math.sqrt(a * a - h * h), x1 = b * Math.cos(40 * D2R) - dx, x2 = b * Math.cos(40 * D2R) + dx;
  const B1 = [A[0] + x1 * U, A[1]], B2 = [A[0] + x2 * U, A[1]], k = pop(t, 95.6);
  if (k > 0.01) {
    el('rect', { x: 100, y: A[1] - 3, width: 880, height: 6, rx: 3, fill: C.mist }, E);
    segAB(E, A, Cc, k, C.coral, 8);
    angMark(E, A, [A[0] + 200, A[1]], Cc, 110, k, C.cream, '40°', 34);
    sideLab(E, A, Cc, 'b = 12', 44, k, C.coral, 38);
    const kh = eio(seg(t, 102.0, 102.8)); if (kh > 0.01) el('line', { x1: r1(Cc[0]), y1: r1(Cc[1]), x2: r1(Cc[0]), y2: r1(lerp(Cc[1], A[1], kh)), stroke: C.sun, 'stroke-width': 4, 'stroke-dasharray': '10 10' }, E);
    const sw = kf(t, [[102.8, -95], [104.8, -150], [106.0, -150], [107.4, -38], [113.8, -38]]);
    const tip = pc(Cc[0], Cc[1], a * U, sw);
    capsule(E, Cc[0], Cc[1], tip[0], tip[1], 8, C.mint);
    if (t > 102.6) arcDeg(E, Cc[0], Cc[1], a * U, -150, -30, eio(seg(t, 103.0, 104.6)), C.n3, 4);
    [[B1, 104.9], [B2, 107.5]].forEach(([B, t0]) => { const kk = pop(t, t0); if (kk > 0.01) { dot(E, B[0], B[1], kk, C.sun, 14); segAB(E, B, Cc, eio(seg(t, 107.8, 108.6)), C.mint, 5); } });
    if (t > 107.8) { tag(E, B1[0], B1[1] + 60, '121°', pop(t, 109.0), C.sun, 38); tag(E, B2[0], B2[1] + 60, '59°', pop(t, 108.6), C.sun, 38); }
    dot(E, Cc[0], Cc[1], k, C.cream, 12);
  }
  riseFormula(E, t, 102.2, 107.4, 540, 1320, 42, ['h', '=', '12', '·', 'sen 40°', '≈', '7.71', '<', '9']);
  riseFormula(E, t, 108.2, 113.8, 540, 1320, 42, ['sen B', '=', FR('12 · sen 40°', '9'), '≈', '0.857']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Ley de', 'senos');
  label(p, t, 6.6, 12.4, 'LA BENGALA', 'dos faros a 10 km', 'miden 75° y 60°');
  label(p, t, 12.8, 18.6, 'LA PREGUNTA', '¿a qué distancia', 'está de cada faro?');
  label(p, t, 19.0, 24.4, 'OBLICUO', 'sin ángulo recto', 'SOH CAH TOA no basta');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'un truco:', 'partir el triángulo');
  label(p, t, 31.8, 37.8, 'EL TRUCO', 'baja la altura h', 'dos triángulos rectángulos');
  label(p, t, 38.2, 44.2, 'h DOS VECES', 'h = b sen A', 'h = a sen B');
  label(p, t, 44.6, 50.2, 'IGUALA', 'la misma altura', 'a sen B = b sen A');
  label(p, t, 50.6, 56.6, 'LEY DE SENOS', 'cada lado', 'entre el seno opuesto');
  label(p, t, 60.0, 66.0, 'EL TERCER ÁNGULO', '180° − 75° − 60°', '= 45°');
  label(p, t, 66.4, 72.2, 'LA PAREJA', '10 km', 'frente a 45°');
  label(p, t, 72.6, 78.4, 'PRIMER FARO', 'frente a 60°', '≈ 12.25 km');
  label(p, t, 78.8, 84.4, 'SEGUNDO FARO', 'frente a 75°', '≈ 13.66 km');
  label(p, t, 84.8, 90.4, 'LA TRAMPA', 'a veces hay', 'dos triángulos');
  label(p, t, 95.4, 101.4, 'CASO AMBIGUO', 'LLA: A = 40°', 'b = 12, a = 9');
  label(p, t, 101.8, 107.4, 'EL COMPÁS', 'h ≈ 7.71', 'a = 9 llega dos veces');
  label(p, t, 107.8, 114.0, 'DOS TRIÁNGULOS', 'B ≈ 59° o 121°', 'suplementarios');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['OBLICUOS', 'sin ángulo recto'],
  ['LEY DE SENOS', [FR('a', 'sen A'), '=', FR('b', 'sen B'), '=', FR('c', 'sen C')]],
  ['NECESITA', 'un lado y su ángulo opuesto'],
  ['LOS ÁNGULOS', 'suman 180°'],
  ['LLA', 'puede dar dos triángulos'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [1.0, 'paint', .8], [4.0, 'pop', 1], [7.0, 'line', 1.0], [9.8, 'paint', .6], [10.6, 'paint', .6], [13.0, 'pop', 2], [19.2, 'no'], [24.8, 'pop', 3],
  [31.8, 'pop'], [32.6, 'paint', 1.0], [38.6, 'rise'], [41.6, 'rise'], [44.8, 'rise'], [50.8, 'rise'], [51.2, 'yes'], [52.4, 'pop', 3],
  [60.2, 'pop'], [61.4, 'paint', .8], [66.6, 'rise'], [72.8, 'rise'], [75.8, 'paint', .8], [76.4, 'yes'], [79.0, 'rise'], [81.8, 'paint', .8], [82.4, 'yes'], [88.0, 'pop', 1],
  [95.6, 'pop'], [102.0, 'paint', .8], [102.2, 'rise'], [102.8, 'slide', 2.0], [104.9, 'yes'], [106.0, 'slide', 1.4], [107.5, 'yes'], [108.2, 'rise'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Dos faros vigilan la costa, a diez kilómetros.'],
  [4.0, 6.6, 'De noche, ambos ven una bengala de auxilio.'],
  [7.0, 9.6, 'Cada faro mide el ángulo hacia la luz.'],
  [9.8, 12.4, 'Setenta y cinco grados, y sesenta.'],
  [12.8, 15.6, '¿A qué distancia está de cada faro?'],
  [15.8, 18.6, 'El triángulo no tiene ángulo recto.'],
  [19.0, 21.8, 'SOH CAH TOA no sirve aquí.'],
  [22.0, 24.4, 'Hace falta una ley nueva.'],
  [24.8, 29.0, 'Y nace de un truco: partir el triángulo.'],
  [31.8, 34.8, 'Baja una altura desde un vértice.'],
  [35.0, 37.8, 'Ahora hay dos triángulos rectángulos.'],
  [38.2, 41.0, 'En uno: h, b por seno de A.'],
  [41.2, 44.2, 'En el otro, a por seno de B.'],
  [44.6, 47.4, 'Es la misma altura: igualamos.'],
  [47.6, 50.2, 'Cada lado entre el seno opuesto…'],
  [50.6, 53.6, 'da siempre el mismo número.'],
  [53.8, 56.6, 'Esa es la ley de senos.'],
  [60.0, 63.0, 'Primero, el tercer ángulo.'],
  [63.2, 66.0, 'Lo que falta para 180: cuarenta y cinco.'],
  [66.4, 69.2, 'Ya hay una pareja: lado y ángulo opuesto.'],
  [69.4, 72.2, 'Diez kilómetros, frente a cuarenta y cinco.'],
  [72.6, 75.4, 'Primer faro: diez por seno de sesenta…'],
  [75.6, 78.4, 'entre seno de 45: unos 12.25 kilómetros.'],
  [78.8, 81.6, 'Segundo faro: con seno de setenta y cinco,'],
  [81.8, 84.4, 'unos 13.66 kilómetros.'],
  [84.8, 87.6, 'Pero la ley de senos tiene una trampa.'],
  [87.8, 90.4, 'A veces hay dos triángulos.'],
  [95.4, 98.4, 'Dos lados y un ángulo no comprendido.'],
  [98.6, 101.4, 'Ángulo de cuarenta, lados doce y nueve.'],
  [101.8, 104.6, 'El lado de nueve gira como un compás.'],
  [104.8, 107.4, 'Toca la base en dos puntos.'],
  [107.8, 110.6, 'B mide 59 o 121 grados.'],
  [110.8, 114.0, 'Suplementarios: tienen el mismo seno.'],
  [115.4, 119.6, 'La bengala estaba a 12.25 kilómetros de un faro'],
  [119.8, 124.4, 'y a 13.66 del otro: la encontró la ley de senos.'],
];
