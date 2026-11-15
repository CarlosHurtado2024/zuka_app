// «Suma y resta de ángulos» (lección trig-48a, Faro de los Ángulos, video 4) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): el brazo robótico de 1 m que gira 30° y luego 45° (sen 75° ≈ 0.966, no
// 1.207), la figura de los dos tramos (sen α cos β + cos α sen β), cos 75° ≈ 0.259 y tan 75° = 2 + √3 ≈ 3.73.
// Hilo: ¿a qué altura queda la punta del brazo? Sumar los senos da más que el brazo entero. Sorpresa anunciada: el seno de
// una suma no se reparte. Cierre: 0.966 m.
const POSTER = 52;
const FILM = stdFilm({
  open: { Z0: 1.7, C: [420, 900], t1: 3.8, t2: 6.0 },
  aims: ['dos giros', 'el valor exacto', 'la tangente'],
  stops: ['el brazo', 'dos giros', 'el valor exacto', 'la tangente'],
  wides: [[19.0, 20.6], [72.6, 74.2]],
  smiles: [[53.8, 55.6], [104.8, 106.4], [119.0, 135]],
});
const OB = [260, 1200], UL = 560;
function robot(p, t, a1, a2, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, OB[0], OB[1], k), J = pc(OB[0], OB[1], UL * .45, a1), T = pc(J[0], J[1], UL * .55, a1 + a2);
  el('rect', { x: OB[0] - 90, y: OB[1] + 20, width: 180, height: 40, rx: 12, fill: C.n3 }, S);
  shaded(S, 'circle', { cx: OB[0], cy: OB[1], r: 46 }, C.coral, C.coralD, 4, 4);
  capsule(S, OB[0], OB[1], J[0], J[1], 34, C.blueD); capsule(S, OB[0] - 3, OB[1] - 3, J[0] - 3, J[1] - 3, 26, C.blue);
  capsule(S, J[0], J[1], T[0], T[1], 28, C.blueD); capsule(S, J[0] - 3, J[1] - 3, T[0] - 3, T[1] - 3, 20, C.blue);
  shaded(S, 'circle', { cx: J[0], cy: J[1], r: 30 }, C.sun, C.sunD, 3, 3);
  const g1 = pc(T[0], T[1], 34, a1 + a2 + 30), g2 = pc(T[0], T[1], 34, a1 + a2 - 30);
  capsule(S, T[0], T[1], g1[0], g1[1], 10, C.cream); capsule(S, T[0], T[1], g2[0], g2[1], 10, C.cream);
  return T;
}
function level0(G, t) {
  starField(G, 421, 150);
  const k = pop(t, 0.3) * out(t, 28.8), a = 30 * eio(seg(t, 4.0, 5.2)), b = 45 * eio(seg(t, 5.6, 6.8));
  const T = robot(G, t, a + b, 0, k);
  // como un solo brazo rígido: la punta queda en el ángulo a + b a distancia 1
  if (T) {
    el('line', { x1: 100, y1: OB[1] - UL, x2: 1000, y2: OB[1] - UL, stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '12 12' }, G);
    tag(G, 1000, OB[1] - UL - 18, '1 m', k, C.mist, 36, 'end');
    const kh = eio(seg(t, 9.8, 10.6)) * k; if (kh > 0.01) { segAB(G, [T[0], OB[1]], T, kh, C.sun, 8); tag(G, T[0] + 24, (OB[1] + T[1]) / 2, 'sen 75°', kh, C.sun, 40, 'start'); }
    arcDeg(G, OB[0], OB[1], 110, 0, a, k, C.mint, 7); arcDeg(G, OB[0], OB[1], 140, a, a + b, k, C.coral, 7);
    const kf2 = eio(seg(t, 16.0, 17.0)) * k;
    if (kf2 > 0.01) { const x = 880, h = UL * 1.207 * kf2; el('rect', { x: x - 14, y: r1(OB[1] - h), width: 28, height: r1(h), rx: 10, fill: C.coral }, G); tag(G, x, OB[1] - h - 24, '1.207', pop(t, 17.0), C.coral, 42); }
    if (t > 19.0) badge(G, 880, OB[1] - UL - 150, pop(t, 19.2) * k, false);
  }
  riseFormula(G, t, 13.0, 18.6, 400, 1330, 42, ['sen 30°', '+', 'sen 45°', '≈', '0.5 + 0.707'], { fill: C.coral });
  fchip(G, 480, 1440, ['sen(α + β)'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 48);
}
// ---------- nivel 1 · los dos tramos ----------
const O1 = [200, 1230], U1 = 600, AL = 30, BE = 45;
function level1(G, t) {
  starField(G, 423, 90);
  fchip(G, 540, 700, ['sen(α + β)'], out(t, 32.4), ZERO, 48);
  const P = pc(O1[0], O1[1], U1, AL + BE), A = pc(O1[0], O1[1], U1 * Math.cos(BE * D2R), AL);
  el('rect', { x: 120, y: O1[1] - 2, width: 860, height: 5, rx: 2, fill: C.n3 }, G);
  segAB(G, O1, P, eio(seg(t, 32.0, 32.8)), C.cream, 9);
  arcDeg(G, O1[0], O1[1], 120, 0, AL, eio(seg(t, 32.6, 33.2)), C.mint, 7); tag(G, O1[0] + 150, O1[1] - 20, 'α', pop(t, 33.2), C.mint, 40, 'start');
  arcDeg(G, O1[0], O1[1], 170, AL, AL + BE, eio(seg(t, 33.2, 33.8)), C.coral, 7); tag(G, O1[0] + 130, O1[1] - 150, 'β', pop(t, 33.8), C.coral, 40);
  const kp = eio(seg(t, 35.2, 36.2));
  if (kp > 0.01) { el('line', { x1: O1[0], y1: O1[1], x2: r1(lerp(O1[0], pc(O1[0], O1[1], 900, AL)[0], kp)), y2: r1(lerp(O1[1], pc(O1[0], O1[1], 900, AL)[1], kp)), stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '10 10' }, G); }
  const kt = eio(seg(t, 38.4, 39.4));
  if (kt > 0.01) { segAB(G, O1, A, kt, C.mint, 10); segAB(G, A, P, kt, C.coral, 10); rightMark(G, A, O1, P, 30, kt, C.mist); sideLab(G, O1, A, 'cos β', -40, pop(t, 41.4), C.mint, 38); sideLab(G, A, P, 'sen β', -40, pop(t, 42.4), C.coral, 38); }
  dot(G, P[0], P[1], pop(t, 32.8), C.sun, 14);
  const k1 = eio(seg(t, 47.8, 48.6)), k2 = eio(seg(t, 50.8, 51.6)), X = 900;
  if (k1 > 0.01) { el('rect', { x: X - 14, y: r1(O1[1] - (O1[1] - A[1]) * k1), width: 28, height: r1((O1[1] - A[1]) * k1), rx: 8, fill: C.mint }, G); el('line', { x1: A[0], y1: A[1], x2: X, y2: A[1], stroke: C.mint, 'stroke-width': 3, 'stroke-dasharray': '8 10' }, G); }
  if (k2 > 0.01) { el('rect', { x: X - 14, y: r1(A[1] - (A[1] - P[1]) * k2), width: 28, height: r1((A[1] - P[1]) * k2), rx: 8, fill: C.coral }, G); el('line', { x1: P[0], y1: P[1], x2: X, y2: P[1], stroke: C.coral, 'stroke-width': 3, 'stroke-dasharray': '8 10' }, G); }
  riseFormula(G, t, 54.0, 56.6, 540, 520, 40, ['sen(α + β)', '=', 'sen α cos β', '+', 'cos α sen β'], { fill: C.sun });
  fchip(G, 480, 1440, ['sen 75°'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 50);
}
// ---------- nivel 2 · el valor exacto y el coseno ----------
function level2(G, t) {
  starField(G, 425, 90);
  fchip(G, 540, 700, ['sen 75°'], out(t, 61.0), ZERO, 50);
  const ko = 1 - eio(seg(t, 72.2, 72.6));
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 1000, ko);
    riseFormula(S, t, 61.4, 999, 540, 800, 50, ['sen 75°', '=', FR('1', '2'), '·', FR('√2', '2'), '+', FR('√3', '2'), '·', FR('√2', '2')]);
    riseFormula(S, t, 66.6, 999, 540, 1000, 56, ['=', FR('√6 + √2', '4'), '≈', '0.966'], { fill: C.sun });
  }
  const kc = pop(t, 72.6) * (1 - eio(seg(t, 84.4, 84.8)));
  if (kc > 0.01) {
    const S = scaleAt(G, 540, 1000, kc);
    riseFormula(S, t, 73.0, 999, 540, 560, 42, ['cos(α + β)', '=', 'cos α cos β', '−', 'sen α sen β'], { fill: C.mint });
    const T = robot(S, t, 75, 0, 1);
    if (T) { const kh = eio(seg(t, 79.0, 79.8)); segAB(S, OB, [lerp(OB[0], T[0], kh), OB[1]], 1, C.mint, 10); tag(S, (OB[0] + T[0]) / 2, OB[1] + 100, 'cos 75° ≈ 0.259', pop(t, 79.6), C.mint, 40); }
    riseFormula(S, t, 82.0, 999, 400, 1360, 36, ['sen(α − β)', ',', 'cos(α − β)', ':', 'cambian los signos']);
  }
  fchip(G, 480, 1440, ['tan(α + β)'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), MINT, 48);
}
// ---------- nivel 3 · la tangente y la respuesta ----------
function level3(G, t) {
  starField(G, 427, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['tan(α + β)'], out(t, 96.0), MINT, 48);
  const ko = 1 - eio(seg(t, 107.4, 107.8));
  if (ko > 0.01) {
    const S = scaleAt(E, 540, 1000, ko);
    riseFormula(S, t, 96.4, 999, 540, 860, 54, ['tan(α + β)', '=', FR('tan α + tan β', '1 − tan α tan β')]);
    riseFormula(S, t, 102.0, 999, 540, 1080, 46, ['tan 75°', '=', FR('√3/3 + 1', '1 − √3/3'), '=', '2 + √3']);
    riseFormula(S, t, 105.0, 999, 540, 1240, 46, ['≈', '3.73', '=', FR('0.966', '0.259')], { fill: C.sun });
  }
  const kr = pop(t, 107.8);
  if (kr > 0.01) {
    const T = robot(E, t, 75, 0, kr);
    if (T) { el('line', { x1: 100, y1: OB[1] - UL, x2: 1000, y2: OB[1] - UL, stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '12 12' }, E); segAB(E, [T[0], OB[1]], T, eio(seg(t, 108.4, 109.2)), C.sun, 8); tag(E, T[0] + 30, (OB[1] + T[1]) / 2, '0.966 m', pop(t, 110.8), C.sun, 46, 'start'); }
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Suma de', 'ángulos');
  label(p, t, 6.6, 12.4, 'EL BRAZO', 'gira 30° y luego 45°', '¿altura de la punta?');
  label(p, t, 12.8, 18.6, 'LA TENTACIÓN', 'sumar los senos', '≈ 1.207');
  label(p, t, 19.0, 24.4, 'IMPOSIBLE', 'más alto', 'que el brazo entero');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'el seno de una suma', 'no se reparte');
  label(p, t, 31.8, 37.8, 'DOS GIROS', 'el brazo apunta a α + β', 'proyecta sobre α');
  label(p, t, 38.2, 44.2, 'UN TRIÁNGULO', 'con el ángulo β', 'catetos cos β y sen β');
  label(p, t, 44.6, 50.2, 'PRIMER TRAMO', 'sube sen α · cos β');
  label(p, t, 50.6, 56.6, 'SEGUNDO TRAMO', 'sube cos α · sen β', 'juntos: sen(α + β)');
  label(p, t, 60.0, 66.0, 'sen 75°', 'con 30° y 45°', 'notables conocidos');
  label(p, t, 66.4, 72.2, 'EXACTO', '(√6 + √2) / 4', '≈ 0.966');
  label(p, t, 72.6, 78.4, 'COSENO DE LA SUMA', 'lleva un menos', 'cos·cos − sen·sen');
  label(p, t, 78.8, 84.4, 'cos 75°', 'alcance horizontal', '≈ 0.259');
  label(p, t, 84.8, 90.4, 'LA TANGENTE', 'también tiene', 'su fórmula');
  label(p, t, 95.4, 101.4, 'TANGENTE DE LA SUMA', 'suma arriba', '1 − producto abajo');
  label(p, t, 101.8, 107.4, 'tan 75°', '= 2 + √3', '≈ 3.73');
  label(p, t, 107.8, 114.0, 'EL BRAZO', 'altura ≈ 0.966 m', 'menos de 1 m');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SENO DE LA SUMA', 'sen α cos β + cos α sen β'],
  ['COSENO DE LA SUMA', 'cos α cos β − sen α sen β'],
  ['RESTA', 'cambian los signos'],
  ['TANGENTE', 'suma ÷ (1 − producto)'],
  ['NO SE REPARTE', ['sen(α + β)', '≠', 'sen α + sen β']],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.0, 'slide', 1.2], [5.6, 'slide', 1.2], [9.8, 'paint', .8], [13.0, 'rise'], [16.0, 'paint', 1.0], [17.0, 'pop', 1], [19.2, 'no'], [24.8, 'pop', 3],
  [32.0, 'paint', .8], [33.2, 'pop', 1], [33.8, 'pop', 2], [35.2, 'line', 1.0], [38.4, 'paint', 1.0], [41.4, 'pop', 1], [42.4, 'pop', 2], [47.8, 'paint', .8], [50.8, 'paint', .8], [54.0, 'rise'], [52.4, 'pop', 3],
  [61.4, 'rise'], [66.6, 'rise'], [67.0, 'yes'], [72.6, 'pop'], [73.0, 'rise'], [79.0, 'paint', .8], [79.6, 'pop', 1], [82.0, 'rise'], [88.0, 'pop', 1],
  [96.4, 'rise'], [102.0, 'rise'], [105.0, 'rise'], [105.4, 'yes'], [107.8, 'pop'], [108.4, 'paint', .8], [110.8, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Un brazo robótico mide un metro.'],
  [4.0, 6.6, 'Gira treinta grados… y luego cuarenta y cinco.'],
  [7.0, 9.6, '¿A qué altura queda su punta?'],
  [9.8, 12.4, 'Es el seno de setenta y cinco.'],
  [12.8, 15.6, 'Tentación: sumar los senos.'],
  [15.8, 18.6, 'Un medio más 0.707 da 1.207.'],
  [19.0, 21.8, '¡Más alto que el brazo entero!'],
  [22.0, 24.4, 'Imposible: el seno no pasa de uno.'],
  [24.8, 29.0, 'El seno de una suma tiene su propia fórmula.'],
  [31.8, 34.8, 'El brazo apunta a alfa más beta.'],
  [35.0, 37.8, 'Proyéctalo sobre la dirección alfa.'],
  [38.2, 41.0, 'Queda un triángulo con el ángulo beta.'],
  [41.2, 44.2, 'Catetos: coseno de beta y seno de beta.'],
  [44.6, 47.4, 'Cada cateto sube su parte.'],
  [47.6, 50.2, 'El primero: seno alfa por coseno beta.'],
  [50.6, 53.6, 'El segundo: coseno alfa por seno beta.'],
  [53.8, 56.6, 'Juntos dan el seno de la suma.'],
  [60.0, 63.0, 'Con treinta y cuarenta y cinco:'],
  [63.2, 66.0, 'un medio por raíz de dos sobre dos…'],
  [66.4, 69.2, 'más los otros dos productos.'],
  [69.4, 72.2, 'Total: unos cero punto nueve seis seis.'],
  [72.6, 75.4, 'El coseno de la suma lleva un menos.'],
  [75.6, 78.4, 'Coseno por coseno, menos seno por seno.'],
  [78.8, 81.6, 'Alcance horizontal: cero punto dos cinco nueve.'],
  [81.8, 84.4, 'Para restar ángulos, cambian los signos.'],
  [84.8, 87.6, '¿Y la tangente?'],
  [87.8, 90.4, 'También tiene su fórmula.'],
  [95.4, 98.4, 'Tangente de la suma: suma de tangentes…'],
  [98.6, 101.4, 'entre uno menos su producto.'],
  [101.8, 104.6, 'Tangente de 75: dos más raíz de tres.'],
  [104.8, 107.4, 'Coincide con seno entre coseno: 3.73.'],
  [107.8, 110.6, 'De vuelta al brazo robótico:'],
  [110.8, 114.0, 'su punta queda a 0.966 metros.'],
  [115.4, 119.6, 'La punta del brazo queda a cero punto nueve seis seis metros,'],
  [119.8, 124.4, 'no a 1.207: el seno de una suma no se reparte.'],
];
