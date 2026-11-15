// «La circunferencia unitaria» (lección trig-3, Mar de las Ondas, video 6) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la noria que gira 150° (P = (−√3/2, 1/2), espejo de 30°), el punto en 40°
// para leer coseno y seno, el paso por 100° (x negativa) y la recta numérica enrollada (t = 1 … 6).
// Hilo: una cabina empieza a la altura del eje y la noria gira 150°: ¿a qué altura queda? Con SOH CAH TOA no se puede.
// Sorpresa anunciada: la respuesta «te sonará conocida» (sen 150° = sen 30°). Cierre: medio radio sobre el eje.
const POSTER = 76;
const FILM = stdFilm({
  open: { Z0: 1.9, C: [540, 920], t1: 3.8, t2: 6.0 },
  aims: ['radio 1', 'más de 90°', 'cualquier número'],
  stops: ['la noria', 'radio 1', 'más de 90°', 'cualquier número'],
  wides: [[12.8, 14.4], [72.6, 74.2]],
  smiles: [[81.8, 83.6], [110.8, 112.6], [119.0, 135]],
});
function noria(p, t, cx, cy, R, a, k, hi = true) {
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k);
  capsule(S, cx, cy, cx - R * .55, cy + R * 1.25, 18, C.n3); capsule(S, cx, cy, cx + R * .55, cy + R * 1.25, 18, C.n3);
  el('circle', { cx, cy, r: R, fill: 'none', stroke: C.mist, 'stroke-width': 8 }, S);
  for (let j = 0; j < 8; j++) { const q = pc(cx, cy, R, a + j * 45); capsule(S, cx, cy, q[0], q[1], 5, C.mist); }
  for (let j = 0; j < 8; j++) {
    const q = pc(cx, cy, R, a + j * 45), col = j === 0 && hi ? NEG : [C.blue, C.blueD];
    capsule(S, q[0], q[1], q[0], q[1] + 24, 4, C.cream);
    shaded(S, 'rect', { x: r1(q[0] - 30), y: r1(q[1] + 20), width: 60, height: 46, rx: 14 }, col[0], col[1], 3, 3);
  }
  shaded(S, 'circle', { cx, cy, r: 28 }, C.sun, C.sunD, 3, 3);
}
function level0(G, t) {
  starField(G, 351, 150);
  const cx = 540, cy = 900, R = 300, a = 150 * eio(seg(t, 7.0, 10.0)), k = pop(t, 0.3) * out(t, 28.8);
  sea(G, t, 1420, -200, W + 200, k, 6);
  noria(G, t, cx, cy, R, a, k);
  const kh = eio(seg(t, 10.2, 11.0)) * k;
  if (kh > 0.01) {
    el('line', { x1: cx - R - 40, y1: cy, x2: cx + R + 40, y2: cy, stroke: C.sun, 'stroke-width': 4, 'stroke-dasharray': '12 12' }, G);
    const q = pc(cx, cy, R, 150);
    el('line', { x1: r1(q[0] - 70), y1: cy, x2: r1(q[0] - 70), y2: r1(lerp(cy, q[1] + 40, kh)), stroke: C.coral, 'stroke-width': 6 }, G);
    tag(G, q[0] - 96, (cy + q[1]) / 2 + 30, '?', pop(t, 11.0) * k, C.coral, 56, 'end');
    arcDeg(G, cx, cy, 90, 0, 150, kh, C.sun, 7, true);
    tag(G, cx + 40, cy - 110, '150°', kh, C.sun, 44, 'start');
  }
  const kt = life(t, 13.4, 18.6);
  if (kt > 0.01) chip(G, 470, 1330, 'agudos: siempre menos de 90°', kt, NEG, C.night, 40);
  const ks = life(t, 19.2, 24.4);
  if (ks > 0.01) chip(G, 470, 1330, 'sen 150° = ¿?', ks, POS, C.night, 48);
  fchip(G, 480, 1440, ['r = 1'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 52);
}
// ---------- nivel 1 · radio 1 ----------
const U = { cx: 540, cy: 1000, R: 280 };
function unitTri(p, a, k, labs = true) {
  const { cx, cy, R } = U, P = pc(cx, cy, R, a), F = [P[0], cy];
  if (k <= 0.01) return P;
  segAB(p, [cx, cy], F, k, C.mint, 10);
  segAB(p, F, P, k, C.coral, 10);
  ray(p, cx, cy, R, a, 1, C.sun, 8);
  dot(p, P[0], P[1], 1, C.sun, 14);
  if (labs) {
    tag(p, (cx + F[0]) / 2, cy + (P[1] < cy ? 56 : -26), 'x = cos θ', k, C.mint, 36);
    tag(p, F[0] + (P[0] >= cx ? 22 : -22), (cy + P[1]) / 2 + 12, 'y = sen θ', k, C.coral, 36, P[0] >= cx ? 'start' : 'end');
  }
  return P;
}
function level1(G, t) {
  starField(G, 353, 90);
  fchip(G, 540, 700, ['r = 1'], out(t, 32.4), ZERO, 52);
  const { cx, cy, R } = U;
  ucircle(G, t, 32.0, cx, cy, R, { col: C.blue, sw: 7, nums: true });
  const a = 40 * eio(seg(t, 38.6, 40.0));
  if (t > 38.4) {
    arcDeg(G, cx, cy, 70, 0, a, 1, C.cream, 6);
    if (a > 20) tag(G, cx + 92, cy - 22, 'θ', 1, C.cream, 40, 'start');
    unitTri(G, a, eio(seg(t, 41.4, 42.2)), t > 47.4);
    const P = pc(cx, cy, R, a);
    if (t > 44.6) tag(G, (cx + P[0]) / 2 - 30, (cy + P[1]) / 2 - 10, '1', pop(t, 44.8), C.sun, 48, 'end');
    tag(G, P[0] + 26, P[1] - 30, 'P', pop(t, 40.0) * (t < 53.6 ? 1 : 0), C.sun, 44, 'start');
  }
  riseFormula(G, t, 45.0, 50.2, 540, 640, 50, ['sen θ', '=', FR('y', '1'), '=', 'y']);
  riseFormula(G, t, 54.0, 56.6, 540, 640, 50, ['P', '=', '(cos θ, sen θ)'], { fill: C.sun });
  fchip(G, 480, 1440, ['P(150°)'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), NEG, 50);
}
// ---------- nivel 2 · más allá de 90° ----------
function level2(G, t) {
  starField(G, 355, 90);
  fchip(G, 540, 700, ['P(150°)'], out(t, 61.0), NEG, 50);
  const { cx, cy, R } = U, ko = 1 - eio(seg(t, 90.6, 91.0));
  if (ko > 0.01) {
    const S = scaleAt(G, cx, cy, ko);
    ucircle(S, t, 60.0, cx, cy, R, { col: C.blue, sw: 7 });
    const a = kf(t, [[60.6, 40], [63.4, 100], [69.4, 100], [70.6, 150]]);
    arcDeg(S, cx, cy, 70, 0, a, 1, C.cream, 6);
    const mir = eio(seg(t, 72.8, 73.8));
    if (mir > 0.01) { el('line', { x1: cx, y1: cy - R - 40, x2: cx, y2: cy + R + 40, stroke: C.sun, 'stroke-width': 4, 'stroke-dasharray': '12 12', opacity: 1 }, S); const Q = pc(cx, cy, R, 30); ray(S, cx, cy, R, 30, mir, C.mist, 6); dot(S, Q[0], Q[1], mir, C.mist, 12); tag(S, Q[0] + 26, Q[1] - 20, '30°', mir, C.mist, 38, 'start'); segAB(S, [Q[0], cy], Q, mir, C.coral, 6); }
    unitTri(S, a, 1, false);
    const P = pc(cx, cy, R, a);
    if (t > 63.6 && t < 72.6) chip(S, P[0] < cx ? P[0] - 10 : P[0] + 80, P[1] - 60, 'x < 0', life(t, 64.2, 72.2), MINT, C.night, 36);
    if (t > 75.6) { tag(S, P[0] - 24, (P[1] + cy) / 2 + 12, '1/2', pop(t, 75.8), C.coral, 40, 'end'); tag(S, (P[0] + cx) / 2, cy + 56, '−√3/2', pop(t, 78.8), C.mint, 40); }
  }
  riseFormula(G, t, 79.0, 90.4, 540, 640, 46, ['P(150°)', '=', '(', '−', FR('√3', '2'), ',', FR('1', '2'), ')']);
  fchip(G, 480, 1440, ['+ 2π'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 52);
}
// ---------- nivel 3 · cualquier número real ----------
function level3(G, t) {
  starField(G, 357, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['+ 2π'], out(t, 96.0), ZERO, 52);
  const cx = 540, cy = 1040, R = 210, kc = pop(t, 95.4) * (1 - eio(seg(t, 107.4, 107.8)));
  if (kc > 0.01) {
    const S = scaleAt(E, cx, cy, kc);
    ucircle(S, t, 95.4, cx, cy, R, { col: C.blue, sw: 6 });
    const kb = eio(seg(t, 96.6, 99.4)), TOP = 2 * Math.PI * R;
    const pts = []; for (let j = 0; j <= 80; j++) { const s = TOP * j / 80; const a = [cx + R, cy - s], b = pc(cx, cy, R, s / R / D2R); pts.push([lerp(a[0], b[0], kb), lerp(a[1], b[1], kb)]); }
    polyline(S, pts, eio(seg(t, 95.8, 96.6)), C.sun, 8);
    for (let n = 0; n <= 6; n++) {
      const s = n * R, a = [cx + R, cy - s], b = pc(cx, cy, R, n / D2R), q = [lerp(a[0], b[0], kb), lerp(a[1], b[1], kb)], o = pc(0, 0, 44, n / D2R);
      dot(S, q[0], q[1], pop(t, 96.0 + n * .1), C.cream, 9);
      tag(S, q[0] + (kb > .5 ? o[0] : 30), q[1] + (kb > .5 ? o[1] : 0) + 12, String(n), pop(t, 96.0 + n * .1), C.cream, 34);
    }
    const sp = t > 101.8 ? ((t - 101.8) / 2.6) * 360 : 0;
    if (t > 101.8) { const P = pc(cx, cy, R, 60 + sp); ray(S, cx, cy, R, 60 + sp, 1, C.coral, 7); dot(S, P[0], P[1], 1, C.coral, 14); }
  }
  riseFormula(E, t, 102.0, 107.4, 540, 640, 46, ['sen(t + 2π)', '=', 'sen t']);
  riseFormula(E, t, 104.8, 107.4, 540, 740, 46, ['cos(t + 2π)', '=', 'cos t']);
  const kn = pop(t, 107.8);
  if (kn > 0.01) {
    noria(E, t, 540, 1000, 280, 150, kn);
    el('line', { x1: 220, y1: 1000, x2: 860, y2: 1000, stroke: C.sun, 'stroke-width': 4, 'stroke-dasharray': '12 12' }, E);
    const q = pc(540, 1000, 280, 150);
    el('rect', { x: r1(q[0] - 74), y: r1(q[1]), width: 8, height: r1(1000 - q[1]), rx: 4, fill: C.coral }, E);
    tag(E, q[0] - 90, (1000 + q[1]) / 2 + 14, '½ radio', pop(t, 110.8), C.coral, 40, 'end');
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'La circunferencia', 'unitaria', 920);
  label(p, t, 6.6, 12.4, 'LA NORIA', 'gira 150°', '¿a qué altura quedas?');
  label(p, t, 12.8, 18.6, 'EL PROBLEMA', 'SOH CAH TOA', 'solo hasta 90°');
  label(p, t, 19.0, 24.4, 'LA PREGUNTA', '¿qué es sen 150°?', 'hay que ampliar la idea');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la respuesta', 'te sonará conocida');
  label(p, t, 31.8, 37.8, 'LA CIRCUNFERENCIA UNITARIA', 'radio 1', 'centro en el origen');
  label(p, t, 38.2, 44.2, 'UN ÁNGULO θ', 'su lado toca el círculo', 'en un punto P');
  label(p, t, 44.6, 50.2, 'HIPOTENUSA = 1', 'el seno es la altura', 'sen θ = y');
  label(p, t, 50.6, 56.6, 'EL COSENO', 'es la sombra x', 'P = (cos θ, sen θ)');
  label(p, t, 60.0, 66.0, 'MÁS ALLÁ DE 90°', 'el punto', 'sigue girando');
  label(p, t, 66.4, 72.2, 'A LA IZQUIERDA', 'x negativa', 'coseno negativo');
  label(p, t, 72.6, 78.4, 'EL ESPEJO', '150° refleja a 30°', 'misma altura');
  label(p, t, 78.8, 84.4, 'P(150°)', 'cos 150° = −√3/2', 'sen 150° = 1/2');
  label(p, t, 84.8, 90.4, 'UNA VUELTA', 'y después', '¿qué pasa?');
  label(p, t, 95.4, 101.4, 'CUALQUIER NÚMERO', 'enrolla la recta', 'sobre el círculo');
  label(p, t, 101.8, 107.4, 'PERIÓDICAS', 'cada 2π', 'todo se repite');
  label(p, t, 107.8, 114.0, 'LA NORIA', 'sen 150° = 1/2', 'medio radio sobre el eje');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['RADIO 1', 'la hipotenusa vale 1'],
  ['EL PUNTO', ['P', '=', '(cos θ, sen θ)']],
  ['MÁS DE 90°', 'el seno sigue siendo la altura'],
  ['EL ESPEJO', ['sen 150°', '=', 'sen 30°']],
  ['PERIÓDICAS', 'se repiten cada 2π'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [7.0, 'slide', 3.0], [10.2, 'paint', .8], [11.0, 'pop', 1], [13.4, 'no'], [19.2, 'card'], [24.8, 'pop', 3],
  [32.0, 'paint', 1.3], [33.0, 'pop', 0], [38.6, 'slide', 1.4], [40.0, 'pop', 1], [41.4, 'paint', .8], [44.8, 'pop', 2], [45.0, 'rise'], [54.0, 'rise'], [52.4, 'pop', 3],
  [60.0, 'paint', 1.0], [60.6, 'slide', 2.8], [64.2, 'pop', 1], [69.4, 'slide', 1.2], [72.8, 'paint', 1.0], [75.8, 'pop', 2], [78.8, 'pop', 3], [79.0, 'rise'], [88.0, 'pop', 1],
  [95.4, 'pop'], [95.8, 'paint', .8], [96.6, 'slide', 2.8], [101.8, 'slide', 2.6], [102.0, 'rise'], [104.8, 'rise'], [107.8, 'pop'], [110.8, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una noria gira junto al mar.'],
  [4.0, 6.6, 'Tu cabina empieza a la altura del eje.'],
  [7.0, 9.6, 'La rueda gira ciento cincuenta grados.'],
  [9.8, 12.4, '¿A qué altura sobre el eje quedas?'],
  [12.8, 15.6, 'Con un triángulo rectángulo no se puede:'],
  [15.8, 18.6, 'sus ángulos agudos no pasan de noventa.'],
  [19.0, 21.8, '¿Qué será el seno de ciento cincuenta?'],
  [22.0, 24.4, 'Hay que ampliar la idea de seno.'],
  [24.8, 29.0, 'Y la respuesta te va a sonar conocida.'],
  [31.8, 34.8, 'Dibuja un círculo de radio uno.'],
  [35.0, 37.8, 'Su centro, en el origen del plano.'],
  [38.2, 41.0, 'Gira un ángulo theta desde el eje x.'],
  [41.2, 44.2, 'Baja una línea: aparece un triángulo.'],
  [44.6, 47.4, 'Su hipotenusa es el radio: mide uno.'],
  [47.6, 50.2, 'Entonces el seno es la altura y.'],
  [50.6, 53.6, 'Y el coseno es la sombra x.'],
  [53.8, 56.6, 'El punto es coseno coma seno.'],
  [60.0, 63.0, 'Ahora el ángulo puede seguir girando.'],
  [63.2, 66.0, 'Pasado noventa, la x se vuelve negativa.'],
  [66.4, 69.2, 'El punto cruza al lado izquierdo.'],
  [69.4, 72.2, '¿Y en ciento cincuenta?'],
  [72.6, 75.4, 'Es el espejo de treinta grados.'],
  [75.6, 78.4, 'Misma altura: un medio. La x, negativa.'],
  [78.8, 81.6, 'Coseno: menos raíz de tres sobre dos.'],
  [81.8, 84.4, 'Seno: un medio.'],
  [84.8, 87.6, 'Y si damos una vuelta completa…'],
  [87.8, 90.4, '¿qué pasa con el punto?'],
  [95.4, 98.4, 'Enrolla la recta numérica sobre el círculo.'],
  [98.6, 101.4, 'Cada número real cae en un punto.'],
  [101.8, 104.6, 'Tras dos pi, todo vuelve a empezar.'],
  [104.8, 107.4, 'Seno y coseno son periódicos.'],
  [107.8, 110.6, 'La noria gira ciento cincuenta grados:'],
  [110.8, 114.0, 'tu cabina queda a medio radio del eje.'],
  [115.4, 119.6, 'El seno de ciento cincuenta es un medio,'],
  [119.8, 124.4, 'igual que el de treinta: medio radio sobre el eje.'],
];
