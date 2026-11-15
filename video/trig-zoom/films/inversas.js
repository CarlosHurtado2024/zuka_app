// «Seno, coseno y tangente inversos» (lección trig-45, Faro de los Ángulos, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la rampa 1:12 del mirador (θ = tan⁻¹(1/12) ≈ 4.76°) y la de 1:8 (≈ 7.1°),
// sen θ = 1/2 (30°, 150°, 390°…), cos⁻¹(−1/2) = 120°, tan⁻¹(√3) = 60° y la trampa sen⁻¹(sen 150°) = 30°.
// Hilo: la rampa sube un metro por cada doce: ¿qué ángulo forma con el suelo? Hay que ir del número al ángulo.
// Sorpresa anunciada: un número viene de infinitos ángulos (el tramo decide). Cierre: unos 4.8°.
const POSTER = 52;
const FILM = stdFilm({
  open: { Z0: 1.8, C: [540, 1100], t1: 3.8, t2: 6.0 },
  aims: ['infinitos ángulos', 'cada tramo', 'la rampa'],
  stops: ['la rampa', 'infinitos ángulos', 'cada tramo', 'el ángulo'],
  wides: [[24.8, 26.4], [38.2, 39.8], [78.8, 80.4]],
  smiles: [[53.8, 55.6], [104.8, 106.4], [119.0, 135]],
});
function ramp(p, k, run = 12, x0 = 160, y0 = 1180, u = 60) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x0 + run * u / 2, y0, k), x1 = x0 + run * u, y1 = y0 - u;
  el('rect', { x: x0 - 100, y: y0, width: run * u + 300, height: 20, rx: 8, fill: C.mintD }, S);
  el('path', { d: `M${x0},${y0}L${x1},${y1}L${x1},${y0}Z`, fill: C.n3 }, S);
  capsule(S, x0, y0, x1, y1, 10, C.cream);
  for (let j = 0; j <= 6; j++) { const x = lerp(x0, x1, j / 6), y = lerp(y0, y1, j / 6); capsule(S, x, y, x, y - 70, 5, C.mist); }
  capsule(S, x0, y0 - 70, x1, y1 - 70, 6, C.mist);
  el('rect', { x: x1, y: y1 - 4, width: 160, height: u + 4, fill: C.n3 }, S);
  lighthouse(S, x1 + 90, y1, 260, 1, 1);
  return [x0, y0, x1, y1];
}
function machine(p, t, x, y, k, rev) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k * .8);
  shaded(S, 'rect', { x: x - 130, y: y - 80, width: 260, height: 160, rx: 28 }, C.blue, C.blueD, 6, 6);
  text(S, x, y + 18, 'tan', { 'font-size': 56, 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle' });
  const a = rev ? [x + 330, y, x + 150, y] : [x - 330, y, x - 150, y], b = rev ? [x - 150, y, x - 330, y] : [x + 150, y, x + 330, y];
  arrowLine(S, [[a[0], a[1]], [a[2], a[3]]], 1, C.sun, 7); arrowLine(S, [[b[0], b[1]], [b[2], b[3]]], 1, C.sun, 7);
  text(S, rev ? x + 360 : x - 360, y + 16, rev ? '1/12' : 'θ', { 'font-size': 46, 'font-weight': 700, fill: C.cream, 'text-anchor': rev ? 'start' : 'end' });
  text(S, rev ? x - 360 : x + 360, y + 16, rev ? '¿θ?' : '1/12', { 'font-size': 46, 'font-weight': 700, fill: rev ? C.coral : C.cream, 'text-anchor': rev ? 'end' : 'start' });
}
function level0(G, t) {
  starField(G, 391, 150);
  const k = pop(t, 0.3) * out(t, 28.8);
  const R = ramp(G, k);
  if (R && t > 4.0) {
    const [x0, y0, x1, y1] = R;
    el('rect', { x: x0, y: y0 + 34, width: r1((x1 - x0) * eio(seg(t, 4.2, 5.0))), height: 6, rx: 3, fill: C.sun }, G);
    tag(G, (x0 + x1) / 2, y0 + 90, '12 m', pop(t, 5.0) * k, C.sun, 42);
    segAB(G, [x1 + 30, y0], [x1 + 30, y1], eio(seg(t, 5.2, 5.8)) * k, C.coral, 8);
    tag(G, x1 - 10, y0 - 80, '1 m', pop(t, 5.8) * k, C.coral, 40, 'end');
    angMark(G, [x0, y0], [x1, y0], [x1, y1], 260, eio(seg(t, 7.2, 7.8)) * k, C.cream, null);
    tag(G, x0 + 290, y0 - 20, 'θ = ?', pop(t, 7.8) * k, C.cream, 44, 'start');
  }
  machine(G, t, 540, 820, life(t, 19.2, 28.8) * (t < 22.0 ? 1 : 1), t > 21.0);
  fchip(G, 480, 1440, ['sen θ', '=', FR('1', '2')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 46);
}
// ---------- nivel 1 · infinitos ángulos ----------
const MI = { ox: 350, oy: 1020, s: 70, sy: 170 };
function level1(G, t) {
  starField(G, 393, 90);
  fchip(G, 540, 700, ['sen θ', '=', FR('1', '2')], out(t, 32.4), ZERO, 46);
  const ko = 1 - eio(seg(t, 56.8, 57.2));
  axes(G, t, 32.0, MI, -3.3, 9.6, -1.3, 1.3, { ticks: false });
  const kr = eio(seg(t, 44.8, 45.8));
  wave(G, MI, Math.sin, -3.14, 9.42, eio(seg(t, 32.4, 33.8)), kr > .5 ? C.n3 : C.sun, kr > .5 ? 5 : 7);
  if (kr > 0.01) wave(G, MI, Math.sin, -Math.PI / 2, Math.PI / 2, kr, C.sun, 9);
  hline(G, MI, .5, -3.3, 9.6, eio(seg(t, 34.6, 35.6)), C.coral, 5);
  const S = [[Math.PI / 6, '30°', 35.6], [5 * Math.PI / 6, '150°', 36.6], [Math.PI / 6 + 2 * Math.PI, '390°', 38.6], [5 * Math.PI / 6 + 2 * Math.PI, '510°', 39.2], [Math.PI / 6 - 2 * Math.PI, '−330°', 39.8]];
  S.forEach(([x, s, t0], i) => { const k = pop(t, t0) * (i && kr > .5 ? 1 - kr : 1); if (k > 0.01 && mx(MI, x) > 40) { dot(G, mx(MI, x), my(MI, .5), k, i ? C.coral : C.sun, 12); tag(G, mx(MI, x), my(MI, .5) - 36, s, k, i ? C.coral : C.sun, 34); } });
  if (kr > 0.01) { vline(G, MI, -Math.PI / 2, -1.3, 1.3, kr, C.mint, 4); vline(G, MI, Math.PI / 2, -1.3, 1.3, kr, C.mint, 4); tag(G, mx(MI, -Math.PI / 2), my(MI, -1.3) + 46, '−90°', kr, C.mint, 34); tag(G, mx(MI, Math.PI / 2), my(MI, -1.3) + 46, '90°', kr, C.mint, 34); }
  riseFormula(G, t, 51.0, 56.6, 540, 700, 54, ['sen', SP('−1'), '(', FR('1', '2'), ')', '=', '30°'], { fill: C.sun });
  void ko;
  fchip(G, 480, 1440, ['cos', SP('−1'), 'y', 'tan', SP('−1')], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 44);
}
// ---------- nivel 2 · el tramo de cada inversa ----------
function level2(G, t) {
  starField(G, 395, 90);
  fchip(G, 540, 700, ['cos', SP('−1'), 'y', 'tan', SP('−1')], out(t, 61.0), MINT, 44);
  const cx = 540, cy = 1040, R = 260, ko = 1 - eio(seg(t, 90.6, 91.0));
  if (ko <= 0.01) return fchip(G, 480, 1440, ['tan', SP('−1'), '(', FR('1', '12'), ')'], pop(t, 88.0), ZERO, 44);
  const S = scaleAt(G, cx, cy, ko);
  ucircle(S, t, 60.2, cx, cy, R, { col: C.n3, sw: 6 });
  const ph = t < 66.4 ? 0 : t < 72.6 ? 1 : t < 78.8 ? 2 : 3;
  const RG = [[-90, 90, C.sun], [0, 180, C.mint], [-89, 89, C.coral], [-90, 90, C.sun]][ph];
  const kr = eio(seg(t, [60.6, 66.6, 72.8, 79.0][ph], [61.6, 67.6, 73.8, 80.0][ph]));
  arcDeg(S, cx, cy, R, RG[0], RG[0] + (RG[1] - RG[0]) * kr, 1, RG[2], 16);
  if (ph === 2) { for (const a of [90, -90]) { const q = pc(cx, cy, R, a); el('circle', { cx: r1(q[0]), cy: r1(q[1]), r: 14, fill: C.night, stroke: C.coral, 'stroke-width': 5 }, S); } }
  const AN = [null, 120, 60, null][ph];
  if (AN) { const k = eio(seg(t, [0, 69.6, 75.8][ph], [0, 70.4, 76.6][ph])); ray(S, cx, cy, R, AN, k, C.cream, 8); const q = pc(cx, cy, R, AN); dot(S, q[0], q[1], k, C.cream, 12); arcDeg(S, cx, cy, 70, 0, AN * k, 1, C.cream, 6); }
  if (ph === 3) {
    const k1 = eio(seg(t, 79.4, 80.2)), k2 = eio(seg(t, 81.4, 82.4)), q1 = pc(cx, cy, R, 150), q2 = pc(cx, cy, R, 30);
    ray(S, cx, cy, R, 150, k1, C.mist, 6); dot(S, q1[0], q1[1], k1, C.mist, 12); tag(S, q1[0] - 20, q1[1] - 24, '150°', k1, C.mist, 36, 'end');
    el('line', { x1: r1(q1[0]), y1: r1(q1[1]), x2: r1(lerp(q1[0], q2[0], k2)), y2: r1(q1[1]), stroke: C.coral, 'stroke-width': 5, 'stroke-dasharray': '10 10' }, S);
    ray(S, cx, cy, R, 30, k2, C.sun, 8); dot(S, q2[0], q2[1], k2, C.sun, 12); tag(S, q2[0] + 20, q2[1] - 24, '30°', k2, C.sun, 36, 'start');
  }
  riseFormula(G, t, 69.8, 72.2, 540, 650, 48, ['cos', SP('−1'), '(', '−', FR('1', '2'), ')', '=', '120°'], { fill: C.mint });
  riseFormula(G, t, 76.0, 78.4, 540, 650, 48, ['tan', SP('−1'), '(√3)', '=', '60°'], { fill: C.coral });
  riseFormula(G, t, 82.0, 90.4, 540, 650, 48, ['sen', SP('−1'), '(sen 150°)', '=', '30°'], { fill: C.sun });
  fchip(G, 480, 1440, ['tan', SP('−1'), '(', FR('1', '12'), ')'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 44);
}
// ---------- nivel 3 · la rampa ----------
function level3(G, t) {
  starField(G, 397, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['tan', SP('−1'), '(', FR('1', '12'), ')'], out(t, 96.0), ZERO, 44);
  const k12 = pop(t, 95.6) * (1 - eio(seg(t, 107.4, 107.8)));
  const R = ramp(E, k12);
  if (R) { const [x0, y0, x1, y1] = R; angMark(E, [x0, y0], [x1, y0], [x1, y1], 300, k12, C.sun, null); tag(E, x0 + 320, y0 - 22, '4.76°', pop(t, 102.0) * k12, C.sun, 44, 'start'); }
  const k8 = pop(t, 107.8);
  if (k8 > 0.01) {
    const S = scaleAt(E, 540, 1180, k8), u = 60, x0 = 160, y0 = 1180, a = [x0 + 12 * u, y0 - u], b = [x0 + 8 * u, y0 - u];
    el('rect', { x: x0 - 60, y: y0, width: 900, height: 20, rx: 8, fill: C.mintD }, S);
    capsule(S, x0, y0, a[0], a[1], 8, C.mist); capsule(S, x0, y0, b[0], b[1], 10, C.coral);
    tag(S, a[0] - 40, a[1] - 30, '1 : 12', 1, C.mist, 38); tag(S, b[0] - 10, b[1] - 24, '1 : 8', 1, C.coral, 40);
  }
  riseFormula(E, t, 98.8, 107.4, 540, 680, 52, ['θ', '=', 'tan', SP('−1'), '(', FR('1', '12'), ')', '≈', '4.76°'], { fill: C.sun });
  riseFormula(E, t, 108.4, 113.8, 540, 680, 52, ['tan', SP('−1'), '(', FR('1', '8'), ')', '≈', '7.1°'], { fill: C.coral });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Funciones', 'inversas');
  label(p, t, 6.6, 12.4, 'LA RAMPA', 'sube 1 m cada 12 m', '¿qué ángulo forma?');
  label(p, t, 12.8, 18.6, 'AL REVÉS', 'del número', 'al ángulo');
  label(p, t, 19.0, 24.4, 'LA MÁQUINA', 'ángulo → tan → número', 'ahora, hacia atrás');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'un número', 'muchos ángulos');
  label(p, t, 31.8, 37.8, 'SENO UN MEDIO', '30°, 150°…');
  label(p, t, 38.2, 44.2, 'INFINITOS', 'la recta corta', 'la onda sin parar');
  label(p, t, 44.6, 50.2, 'RESTRINGIR', 'de −90° a 90°', 'un solo corte');
  label(p, t, 50.6, 56.6, 'SENO INVERSO', 'el ángulo del tramo', 'cuyo seno es x');
  label(p, t, 60.0, 66.0, 'CADA INVERSA', 'su propio tramo', 'sen⁻¹: de −90° a 90°');
  label(p, t, 66.4, 72.2, 'COSENO INVERSO', 'de 0° a 180°', 'la mitad de arriba');
  label(p, t, 72.6, 78.4, 'TANGENTE INVERSA', 'entre −90° y 90°', 'sin tocar los extremos');
  label(p, t, 78.8, 84.4, 'LA TRAMPA', 'deshacer no siempre', 'devuelve el ángulo');
  label(p, t, 84.8, 90.4, 'EL TRAMO MANDA', 'siempre', 'ahora, la rampa');
  label(p, t, 95.4, 101.4, 'LA RAMPA', 'tan θ = 1/12', 'θ = tan⁻¹(1/12)');
  label(p, t, 101.8, 107.4, 'EL ÁNGULO', '≈ 4.76°', 'dentro del tramo');
  label(p, t, 107.8, 114.0, 'COMPARA', '1 en 8: ≈ 7.1°', 'más empinada');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['INVERTIR', 'del número al ángulo'],
  ['SENO INVERSO', 'de −90° a 90°'],
  ['COSENO INVERSO', 'de 0° a 180°'],
  ['TANGENTE INVERSA', 'entre −90° y 90°'],
  ['EL TRAMO', 'decide la respuesta'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.2, 'paint', .8], [5.0, 'pop', 1], [5.2, 'paint', .6], [5.8, 'pop', 2], [7.2, 'paint', .6], [7.8, 'pop', 3], [19.2, 'pop'], [21.0, 'slide', .4], [24.8, 'pop', 3],
  [32.0, 'paint', 1.0], [32.4, 'paint', 1.4], [34.6, 'paint', 1.0], [35.6, 'count', 0], [36.6, 'count', 1], [38.6, 'count', 2], [39.2, 'count', 3], [39.8, 'count', 4], [44.8, 'paint', 1.0], [51.0, 'rise'], [51.4, 'yes'], [52.4, 'pop', 3],
  [60.2, 'paint', 1.0], [60.6, 'paint', 1.0], [66.6, 'paint', 1.0], [69.6, 'slide', .8], [69.8, 'rise'], [72.8, 'paint', 1.0], [75.8, 'slide', .8], [76.0, 'rise'], [79.4, 'slide', .8], [81.4, 'slide', 1.0], [82.0, 'rise'], [88.0, 'pop', 1],
  [95.6, 'pop'], [98.8, 'rise'], [102.0, 'yes'], [107.4, 'away', .4], [107.8, 'pop'], [108.4, 'rise'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una rampa sube al mirador del faro.'],
  [4.0, 6.6, 'Sube un metro por cada doce de avance.'],
  [7.0, 9.6, '¿Qué ángulo forma con el suelo?'],
  [9.8, 12.4, 'Sabemos la tangente: uno entre doce.'],
  [12.8, 15.6, 'Hasta ahora íbamos del ángulo al número.'],
  [15.8, 18.6, 'Aquí hay que ir al revés.'],
  [19.0, 21.8, 'Como una máquina que funciona hacia atrás.'],
  [22.0, 24.4, 'Pero al revés hay un problema.'],
  [24.8, 29.0, 'Un número puede venir de infinitos ángulos.'],
  [31.8, 34.8, '¿Qué ángulo tiene seno un medio?'],
  [35.0, 37.8, 'Treinta grados… y ciento cincuenta.'],
  [38.2, 41.0, 'Y trescientos noventa, y muchos más.'],
  [41.2, 44.2, 'La recta corta la onda infinitas veces.'],
  [44.6, 47.4, 'Para invertir, nos quedamos con un tramo.'],
  [47.6, 50.2, 'De menos noventa a noventa: un corte.'],
  [50.6, 53.6, 'Ahí vive el seno inverso.'],
  [53.8, 56.6, 'Seno inverso de un medio: treinta grados.'],
  [60.0, 63.0, 'Cada inversa tiene su propio tramo.'],
  [63.2, 66.0, 'El seno inverso devuelve ángulos del lado derecho.'],
  [66.4, 69.2, 'El coseno inverso, de cero a ciento ochenta.'],
  [69.4, 72.2, 'Coseno inverso de menos un medio: ciento veinte.'],
  [72.6, 75.4, 'La tangente inversa, entre menos noventa y noventa.'],
  [75.6, 78.4, 'Tangente inversa de raíz de tres: sesenta.'],
  [78.8, 81.6, 'Cuidado con deshacer y rehacer.'],
  [81.8, 84.4, 'Seno inverso del seno de 150: treinta.'],
  [84.8, 87.6, 'El tramo manda.'],
  [87.8, 90.4, 'Ahora sí, la rampa.'],
  [95.4, 98.4, 'La rampa: tangente uno entre doce.'],
  [98.6, 101.4, 'Theta es tangente inversa de un doceavo.'],
  [101.8, 104.6, 'Con calculadora: unos 4.76 grados.'],
  [104.8, 107.4, 'Está en el tramo: es la respuesta.'],
  [107.8, 110.6, 'Una rampa de uno en ocho sube más:'],
  [110.8, 114.0, 'unos 7.1 grados, más empinada.'],
  [115.4, 119.6, 'La rampa del mirador forma unos cuatro punto ocho grados:'],
  [119.8, 124.4, 'la tangente inversa llevó del número al ángulo.'],
];
