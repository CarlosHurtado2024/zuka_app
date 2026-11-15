// «Resolver ecuaciones trigonométricas» (lección trig-49, Faro de los Ángulos, video 6) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la noria de eje a 12 m y radio 10 m (12 + 10 sen θ = 17 → 30° y 150°,
// más 360° k), 2cos²x − 3cos x + 1 = 0 (0°, 60°, 300°) y 1 + sen x = cos x con el impostor de 180°.
// Hilo: desde la noria se ve el faro solo a 17 m: ¿en qué momentos del giro llegas ahí? Sorpresa anunciada: hay más de una
// respuesta, muchas más. Cierre: dos veces por vuelta, a 30° y a 150°.
const POSTER = 42;
const FILM = stdFilm({
  open: { Z0: 1.7, C: [540, 900], t1: 3.8, t2: 6.0 },
  aims: ['dos cortes', 'tipo cuadrático', 'los impostores'],
  stops: ['la noria', 'dos cortes', 'cuadráticas', 'impostores'],
  wides: [[24.8, 26.4], [107.8, 109.4]],
  smiles: [[53.8, 55.6], [119.0, 135]],
});
const NX = 540, NY = 880, NR = 320, MU = NR / 10;   // 1 m = 32 px; el suelo a 12 m bajo el eje
function bigWheel(p, t, a, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, NX, NY, k), gy = NY + 12 * MU;
  el('rect', { x: -200, y: gy, width: 1480, height: 30, fill: C.mintD }, S);
  capsule(S, NX, NY, NX - 220, gy, 20, C.n3); capsule(S, NX, NY, NX + 220, gy, 20, C.n3);
  el('circle', { cx: NX, cy: NY, r: NR, fill: 'none', stroke: C.mist, 'stroke-width': 8 }, S);
  for (let j = 0; j < 12; j++) { const q = pc(NX, NY, NR, a + j * 30); capsule(S, NX, NY, q[0], q[1], 4, C.mist); }
  for (let j = 0; j < 12; j++) { const q = pc(NX, NY, NR, a + j * 30), c = j === 0 ? NEG : SKY; shaded(S, 'rect', { x: r1(q[0] - 24), y: r1(q[1] - 4), width: 48, height: 38, rx: 12 }, c[0], c[1], 3, 3); }
  shaded(S, 'circle', { cx: NX, cy: NY, r: 26 }, C.sun, C.sunD, 3, 3);
}
function level0(G, t) {
  starField(G, 441, 150);
  const k = pop(t, 0.3) * out(t, 28.8), a = (t * 18) % 360;
  bigWheel(G, t, a, k);
  if (k > 0.01) {
    const y17 = NY - 5 * MU, kl = eio(seg(t, 7.0, 7.8)) * k;
    if (kl > 0.01) { el('line', { x1: 80, y1: y17, x2: r1(lerp(80, 1000, kl)), y2: y17, stroke: C.sun, 'stroke-width': 5, 'stroke-dasharray': '14 12' }, G); tag(G, 90, y17 - 18, '17 m', kl, C.sun, 40, 'start'); }
    lighthouse(G, 990, NY + 12 * MU, 220, pop(t, 7.4) * k, 1);
    const ks = eio(seg(t, 4.0, 4.6)) * k;
    if (ks > 0.01) { el('line', { x1: 160, y1: NY, x2: 160, y2: NY + 12 * MU, stroke: C.mint, 'stroke-width': 6 }, G); tag(G, 180, NY + 6 * MU, '12 m', ks, C.mint, 38, 'start'); }
  }
  riseFormula(G, t, 13.0, 24.4, 540, 1380, 48, ['12', '+', '10', '·', 'sen θ', '=', '17'], { fill: C.cream });
  fchip(G, 480, 1440, ['sen θ', '=', FR('1', '2')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)) * (t > 24.4 ? 1 : 0), ZERO, 46);
}
// ---------- nivel 1 · dos cortes por vuelta ----------
function level1(G, t) {
  starField(G, 443, 90);
  fchip(G, 540, 700, ['sen θ', '=', FR('1', '2')], out(t, 32.4), ZERO, 46);
  const cx = 540, cy = 1060, R = 250;
  ucircle(G, t, 32.0, cx, cy, R, { col: C.blue, sw: 7 });
  const kh = eio(seg(t, 38.4, 39.4)), y = cy - R / 2;
  if (kh > 0.01) el('line', { x1: r1(cx - 340 * kh), y1: y, x2: r1(cx + 340 * kh), y2: y, stroke: C.coral, 'stroke-width': 5, 'stroke-dasharray': '12 10' }, G);
  [[30, 41.2], [150, 42.6]].forEach(([a, t0]) => { const k = pop(t, t0); if (k > 0.01) { const q = pc(cx, cy, R, a); ray(G, cx, cy, R, a, k, C.sun, 7); dot(G, q[0], q[1], k, C.sun, 14); tag(G, q[0] + (a < 90 ? 26 : -26), q[1] - 24, a + '°', k, C.sun, 42, a < 90 ? 'start' : 'end'); } });
  if (t > 44.6) { const s = ((t - 44.6) / 3) * 360; const P = pc(cx, cy, R + 30, 30 + s); dot(G, P[0], P[1], 1, C.mint, 12); arcDeg(G, cx, cy, R + 30, 30, 30 + Math.min(s, 720), 1, C.mint, 5); }
  riseFormula(G, t, 35.2, 44.2, 540, 640, 52, ['10', '·', 'sen θ', '=', '5']);
  riseFormula(G, t, 47.8, 56.6, 540, 610, 44, ['θ', '=', '30°', '+', '360° k']);
  riseFormula(G, t, 50.8, 56.6, 540, 700, 44, ['θ', '=', '150°', '+', '360° k']);
  fchip(G, 480, 1440, ['cos', SP('2'), 'x'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), MINT, 50);
}
// ---------- nivel 2 · tipo cuadrático ----------
function level2(G, t) {
  starField(G, 445, 90);
  fchip(G, 540, 700, ['cos', SP('2'), 'x'], out(t, 61.0), MINT, 50);
  const ko = 1 - eio(seg(t, 84.4, 84.8)); if (ko <= 0.01) return fchip(G, 480, 1440, ['impostores'], pop(t, 88.0), NEG, 46);
  const S = scaleAt(G, 540, 1000, ko);
  riseFormula(S, t, 61.4, 999, 540, 640, 46, ['2', 'cos', SP('2'), 'x', '−', '3', 'cos x', '+', '1', '=', '0']);
  riseFormula(S, t, 66.6, 999, 540, 760, 46, ['2u', SP('2'), '−', '3u', '+', '1', '=', '0'], { fill: C.mint });
  riseFormula(S, t, 69.6, 999, 540, 870, 46, ['(2u − 1)(u − 1)', '=', '0'], { fill: C.mint });
  const cx = 540, cy = 1170, R = 180, kc = pop(t, 72.6);
  if (kc > 0.01) {
    const C2 = scaleAt(S, cx, cy, kc);
    ucircle(C2, t, 72.6, cx, cy, R, { col: C.blue, sw: 6 });
    const kv = eio(seg(t, 73.2, 74.0));
    if (kv > 0.01) el('line', { x1: cx + R / 2, y1: r1(cy - 230 * kv), x2: cx + R / 2, y2: r1(cy + 230 * kv), stroke: C.coral, 'stroke-width': 5, 'stroke-dasharray': '12 10' }, C2);
    [[60, 75.8, C.sun], [300, 76.6, C.sun], [0, 79.0, C.mint]].forEach(([a, t0, col]) => { const k = pop(t, t0); if (k > 0.01) { const q = pc(cx, cy, R, a); ray(C2, cx, cy, R, a, k, col, 6); dot(C2, q[0], q[1], k, col, 13); tag(C2, q[0] + 30, q[1] + (a === 300 ? 40 : a === 0 ? 14 : -14), a + '°', k, col, 38, 'start'); } });
  }
  fchip(G, 480, 1440, ['impostores'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 46);
}
// ---------- nivel 3 · soluciones extrañas ----------
function level3(G, t) {
  starField(G, 447, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['impostores'], out(t, 96.0), NEG, 46);
  riseFormula(E, t, 96.4, 113.8, 540, 620, 52, ['1', '+', 'sen x', '=', 'cos x']);
  riseFormula(E, t, 98.8, 113.8, 540, 730, 42, ['sen x', '(sen x + 1)', '=', '0'], { fill: C.mist });
  [['0°', '1 + 0 = 1', true, 102.0], ['180°', '1 + 0 ≠ −1', false, 102.6], ['270°', '1 − 1 = 0', true, 103.2]].forEach(([a, s, ok, t0], i) => {
    const k = pop(t, t0), y = 880 + i * 150; if (k <= 0.01) return;
    chip(E, 300, y, a, k, ok ? MINT : NEG, C.night, 48);
    const kk = pop(t, i === 1 ? 108.0 : 105.0 + i * .5); if (kk > 0.01) { text(E, 440, y + 16, s, { 'font-size': 44, 'font-weight': 600, fill: C.cream }); badge(E, 820, y, kk, ok); }
  });
  const kx = eio(seg(t, 110.8, 111.6));
  if (kx > 0.01) segAB(E, [200, 1030], [lerp(200, 880, kx), 1030], 1, C.coral, 8);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Ecuaciones', 'trigonométricas', 900);
  label(p, t, 6.6, 12.4, 'LA NORIA', 'eje a 12 m, radio 10 m', 'el faro se ve a 17 m');
  label(p, t, 12.8, 18.6, 'LA ALTURA', 'h = 12 + 10 sen θ', 'queremos 17');
  label(p, t, 19.0, 24.4, 'LA ECUACIÓN', 'trigonométrica', '¿cuántas respuestas?');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'más de una', 'muchas más');
  label(p, t, 31.8, 37.8, 'DESPEJA', '10 sen θ = 5', 'sen θ = 1/2');
  label(p, t, 38.2, 44.2, 'DOS CORTES', 'la altura 1/2', '30° y 150°');
  label(p, t, 44.6, 50.2, 'CADA VUELTA', 'se repiten', '+ 360° k');
  label(p, t, 50.6, 56.6, 'SOLUCIÓN GENERAL', 'dos familias', 'infinitas respuestas');
  label(p, t, 60.0, 66.0, 'TIPO CUADRÁTICO', 'parece de álgebra');
  label(p, t, 66.4, 72.2, 'u = cos x', 'una cuadrática', 'que se factoriza');
  label(p, t, 72.6, 78.4, 'u = 1/2', 'cos x = 1/2', 'x = 60° o 300°');
  label(p, t, 78.8, 84.4, 'u = 1', 'x = 0°', 'tres por vuelta');
  label(p, t, 84.8, 90.4, 'CUIDADO', 'al elevar al cuadrado', 'se cuelan impostores');
  label(p, t, 95.4, 101.4, 'OTRA ECUACIÓN', 'al elevar al cuadrado', 'sale sen x (sen x + 1) = 0');
  label(p, t, 101.8, 107.4, 'CANDIDATOS', '0°, 180°, 270°', 'pruébalos');
  label(p, t, 107.8, 114.0, 'EL IMPOSTOR', '180°: 1 ≠ −1', 'se descarta');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['DESPEJA', 'hasta sen x = número'],
  ['DOS POR VUELTA', 'casi siempre'],
  ['GENERAL', ['+', '360°', 'k']],
  ['CUADRÁTICAS', 'u = sen x o u = cos x'],
  ['AL CUADRADO', 'verifica en la original'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.0, 'paint', .6], [7.0, 'line', .8], [7.4, 'pop', 1], [13.0, 'rise'], [24.8, 'pop', 3],
  [32.0, 'paint', 1.0], [35.2, 'rise'], [38.4, 'paint', 1.0], [41.2, 'yes'], [42.6, 'yes'], [44.6, 'slide', 3.0], [47.8, 'rise'], [50.8, 'rise'], [52.4, 'pop', 3],
  [61.4, 'rise'], [66.6, 'rise'], [69.6, 'rise'], [72.6, 'pop'], [73.2, 'paint', .8], [75.8, 'pop', 1], [76.6, 'pop', 2], [79.0, 'pop', 3], [88.0, 'pop', 1],
  [96.4, 'rise'], [98.8, 'rise'], [102.0, 'tile', 0], [102.6, 'tile', 1], [103.2, 'tile', 2], [105.0, 'yes'], [106.0, 'yes'], [108.0, 'no'], [110.8, 'paint', .8],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una noria gigante gira junto al puerto.'],
  [4.0, 6.6, 'Eje a doce metros; radio de diez.'],
  [7.0, 9.6, 'A diecisiete metros se ve el faro.'],
  [9.8, 12.4, '¿En qué momentos del giro llegas ahí?'],
  [12.8, 15.6, 'Altura: doce más diez seno de theta.'],
  [15.8, 18.6, 'Queremos que valga diecisiete.'],
  [19.0, 21.8, 'Es una ecuación trigonométrica.'],
  [22.0, 24.4, 'Y esconde una sorpresa.'],
  [24.8, 29.0, 'Tiene más de una respuesta… muchas más.'],
  [31.8, 34.8, 'Despeja: diez seno de theta igual a cinco.'],
  [35.0, 37.8, 'Seno de theta, un medio.'],
  [38.2, 41.0, 'Esa altura corta el círculo dos veces.'],
  [41.2, 44.2, 'Treinta grados, y ciento cincuenta.'],
  [44.6, 47.4, 'Y en cada vuelta, otra vez.'],
  [47.6, 50.2, 'Más trescientos sesenta por k.'],
  [50.6, 53.6, 'Esa es la solución general.'],
  [53.8, 56.6, 'Infinitas respuestas, dos por vuelta.'],
  [60.0, 63.0, 'Algunas ecuaciones parecen de álgebra.'],
  [63.2, 66.0, 'Dos coseno cuadrado, menos tres coseno, más uno.'],
  [66.4, 69.2, 'Llama u al coseno.'],
  [69.4, 72.2, 'Queda una cuadrática: se factoriza.'],
  [72.6, 75.4, 'U vale un medio, o vale uno.'],
  [75.6, 78.4, 'Coseno un medio: sesenta y trescientos.'],
  [78.8, 81.6, 'Coseno uno: cero grados.'],
  [81.8, 84.4, 'Tres soluciones en cada vuelta.'],
  [84.8, 87.6, 'Pero cuidado al elevar al cuadrado.'],
  [87.8, 90.4, 'Pueden colarse impostores.'],
  [95.4, 98.4, 'Uno más seno de x, igual a coseno.'],
  [98.6, 101.4, 'Al elevar al cuadrado salen tres candidatos.'],
  [101.8, 104.6, 'Cero, ciento ochenta y doscientos setenta.'],
  [104.8, 107.4, 'Hay que probarlos en la original.'],
  [107.8, 110.6, 'En ciento ochenta: uno contra menos uno.'],
  [110.8, 114.0, 'Es un impostor: se descarta.'],
  [115.4, 119.6, 'Tu cabina llega a diecisiete metros dos veces por vuelta:'],
  [119.8, 124.4, 'a los treinta y a los ciento cincuenta grados.'],
];
