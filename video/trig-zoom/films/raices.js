// «Raíces n-ésimas de un complejo» (lección trig-153, Galaxia Polar, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): x³ = 1 (1 y −1/2 ± (√3/2) i, un triángulo equilátero), las raíces cúbicas
// de 8 cis 60° (2 cis 20°, 140°, 260°) y las raíces sextas de 64 (radio 2, cada 60°: un hexágono).
// Hilo: ¿qué número al cubo da 1? En la recta solo el 1, pero el álgebra promete tres. Sorpresa anunciada: las otras dos
// forman una figura perfecta fuera de la recta. Cierre: 1 y −1/2 ± (√3/2) i.
const POSTER = 76;
const FILM = stdFilm({
  open: { Z0: 1.7, C: [540, 980], t1: 3.8, t2: 6.0 },
  aims: ['al revés', 'x³ = 1', 'raíces sextas'],
  stops: ['la promesa', 'al revés', 'tres raíces', 'el copo'],
  wides: [[15.8, 17.4], [81.8, 83.4]],
  smiles: [[84.8, 86.6], [119.0, 135]],
});
const MC = { ox: 540, oy: 1060, s: 220, sy: 110 };
function level0(G, t) {
  starField(G, 491, 160);
  const k = pop(t, 0.3) * out(t, 28.8);
  if (k > 0.01) {
    const S = scaleAt(G, 540, 1000, k);
    axes(S, t, 0.4, MC, -2, 2, -3.5, 3.5, { ticks: true, nums: true });
    wave(S, MC, x => x ** 3, -1.55, 1.55, eio(seg(t, 1.0, 2.6)), C.sun, 7, -3.6, 3.6);
    hline(S, MC, 1, -2, 2, eio(seg(t, 4.0, 4.8)), C.coral, 5);
    dot(S, mx(MC, 1), my(MC, 1), pop(t, 4.8), C.mint, 15);
    tag(S, mx(MC, 1) + 24, my(MC, 1) - 20, 'x = 1', pop(t, 5.0), C.mint, 40, 'start');
    for (const [a, t0] of [[120, 15.8], [240, 16.4]]) { const q = pc(mx(MC, 0), MC.oy, 220, a); tag(S, q[0], q[1] + 20, '?', pop(t, t0), C.coral, 70); }
  }
  const kp = life(t, 12.8, 24.4); if (kp > 0.01) chip(G, 540, 560, 'grado 3: tres raíces', kp, POS, C.night, 44);
  fchip(G, 480, 1440, [RAD('z', 'n')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · De Moivre al revés ----------
function level1(G, t) {
  starField(G, 493, 90);
  fchip(G, 540, 700, [RAD('z', 'n')], out(t, 32.4), ZERO, 50);
  const O = [540, 1080], U = 50, Z = pc(O[0], O[1], 8 * U, 60);
  el('rect', { x: O[0] - 430, y: O[1] - 3, width: 860, height: 6, rx: 3, fill: C.mist }, G);
  el('rect', { x: O[0] - 3, y: O[1] - 430, width: 6, height: 860, rx: 3, fill: C.mist }, G);
  el('circle', { cx: O[0], cy: O[1], r: 2 * U, fill: 'none', stroke: C.n3, 'stroke-width': 4 }, G);
  segAB(G, O, Z, eio(seg(t, 32.0, 32.8)), C.coral, 7); dot(G, Z[0], Z[1], pop(t, 32.6), C.coral, 14);
  tag(G, Z[0] + 20, Z[1] - 10, '8 cis 60°', pop(t, 32.8), C.coral, 38, 'start');
  [[20, 38.4], [140, 44.8], [260, 47.8]].forEach(([a, t0], i) => {
    const k = pop(t, t0); if (k <= 0.01) return;
    const q = pc(O[0], O[1], 2 * U, a); segAB(G, O, q, k, C.sun, 6); dot(G, q[0], q[1], k, C.sun, 13);
    const l = pc(O[0], O[1], 2 * U + 60, a); tag(G, l[0], l[1] + 14, `${a}°`, k, C.sun, 36);
  });
  if (t > 44.6) { const d = 360 * eio(seg(t, 44.6, 46.0)); const qs = []; for (let j = 0; j <= 60; j++) qs.push(pc(O[0], O[1], 8 * U + 20, 60 + d * j / 60)); polyline(G, qs, 1, C.coral, 4, { dash: '8 10' }); }
  riseFormula(G, t, 35.0, 44.2, 540, 540, 46, ['módulo', '=', RAD('8', '3'), '=', '2']);
  riseFormula(G, t, 38.6, 44.2, 540, 640, 46, ['ángulo', '=', FR('60°', '3'), '=', '20°'], { fill: C.sun });
  riseFormula(G, t, 44.8, 56.6, 540, 560, 44, ['w', SB('k'), '=', RAD('r', 'n'), 'cis', FR('θ + 360° k', 'n')], { fill: C.sun });
  fchip(G, 480, 1440, ['x', SP('3'), '= 1'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), MINT, 50);
}
// ---------- nivel 2 · las tres raíces cúbicas de 1 ----------
function level2(G, t) {
  starField(G, 495, 90);
  fchip(G, 540, 700, ['x', SP('3'), '= 1'], out(t, 61.0), MINT, 50);
  const O = [540, 1060], R = 300, ko = 1 - eio(seg(t, 90.6, 91.0));
  if (ko > 0.01) {
    const S = scaleAt(G, O[0], O[1], ko);
    ucircle(S, t, 60.2, O[0], O[1], R, { col: C.blue, sw: 6 });
    const P = [0, 120, 240].map(a => pc(O[0], O[1], R, a));
    [[0, 66.6], [120, 67.2], [240, 67.8]].forEach(([a, t0], i) => { const k = pop(t, t0); if (k > 0.01) { segAB(S, O, P[i], k, C.n3, 4); dot(S, P[i][0], P[i][1], k, i ? C.sun : C.mint, 15); } });
    tag(S, P[0][0] + 26, P[0][1] + 14, '1', pop(t, 69.6), C.mint, 44, 'start');
    if (t > 72.6) { formula(S, P[1][0] - 20, P[1][1] - 34, 34, ['−', FR('1', '2'), '+', FR('√3', '2'), 'i'], { anchor: 'end', fill: C.sun }); }
    if (t > 75.6) { formula(S, P[2][0] - 20, P[2][1] + 60, 34, ['−', FR('1', '2'), '−', FR('√3', '2'), 'i'], { anchor: 'end', fill: C.sun }); }
    if (t > 78.8) { const a = 120 + 240 * eio(seg(t, 79.0, 81.4)); arcDeg(S, O[0], O[1], 90, 120, a, 1, C.coral, 7, true); }
    const kt = eio(seg(t, 85.0, 86.4)); if (kt > 0.01) polyline(S, [P[0], P[1], P[2], P[0]], kt, C.mint, 7);
  }
  riseFormula(G, t, 61.4, 72.2, 540, 560, 46, ['1', '=', '1 cis 0°', ':', 'ángulos', '0°, 120°, 240°']);
  riseFormula(G, t, 79.0, 84.4, 540, 560, 44, ['(cis 120°)', SP('3'), '=', 'cis 360°', '=', '1'], { fill: C.coral });
  fchip(G, 480, 1440, ['64'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 54);
}
// ---------- nivel 3 · raíces sextas de 64 ----------
function level3(G, t) {
  starField(G, 497, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['64'], out(t, 96.0), ZERO, 54);
  const O = [540, 1080], U = 140, ko = pop(t, 95.6);
  if (ko > 0.01) {
    const S = scaleAt(E, O[0], O[1], ko);
    el('rect', { x: O[0] - 420, y: O[1] - 3, width: 840, height: 6, rx: 3, fill: C.mist }, S);
    el('rect', { x: O[0] - 3, y: O[1] - 420, width: 6, height: 840, rx: 3, fill: C.mist }, S);
    el('circle', { cx: O[0], cy: O[1], r: 2 * U, fill: 'none', stroke: C.n3, 'stroke-width': 4 }, S);
    const P = [0, 1, 2, 3, 4, 5].map(j => pc(O[0], O[1], 2 * U, 60 * j));
    P.forEach((q, j) => { const k = pop(t, 101.8 + j * .4); if (k > 0.01) { segAB(S, O, q, k, C.cream, 5); dot(S, q[0], q[1], k, j % 3 === 0 ? C.mint : C.sun, 15); } });
    const kh = eio(seg(t, 104.8, 106.4)); if (kh > 0.01) polyline(S, [...P, P[0]], kh, C.sun, 7);
    if (kh > .9) for (let j = 0; j < 6; j++) { const a = pc(O[0], O[1], 2 * U + 30, 60 * j), b = pc(O[0], O[1], 2 * U + 80, 60 * j); capsule(S, a[0], a[1], b[0], b[1], 8, C.cream); }
    if (t > 107.8) { tag(S, P[0][0] + 26, P[0][1] + 60, '2', pop(t, 108.0), C.mint, 46, 'start'); tag(S, P[3][0] - 26, P[3][1] + 60, '−2', pop(t, 108.4), C.mint, 46, 'end'); }
  }
  riseFormula(E, t, 98.6, 113.8, 540, 560, 46, ['módulo', '=', RAD('64', '6'), '=', '2', ',', 'cada 60°']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Raíces de', 'complejos');
  label(p, t, 6.6, 12.4, 'x³ = 1', 'en la recta real', 'solo x = 1');
  label(p, t, 12.8, 18.6, 'LA PROMESA', 'grado 3', 'tres raíces');
  label(p, t, 19.0, 24.4, 'EL ESCONDITE', 'fuera de la recta', 'el plano complejo');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'forman una figura', 'perfecta');
  label(p, t, 31.8, 37.8, 'AL REVÉS', 'si wⁿ = z', 'módulo: raíz n de r');
  label(p, t, 38.2, 44.2, 'EL ÁNGULO', 'θ ÷ n', 'pero θ tiene disfraces');
  label(p, t, 44.6, 50.2, 'θ + 360° k', 'cada vuelta', 'otra raíz');
  label(p, t, 50.6, 56.6, 'n RAÍCES', 'separadas', '360° ÷ n');
  label(p, t, 60.0, 66.0, '1 = 1 cis 0°', 'raíces de módulo 1');
  label(p, t, 66.4, 72.2, 'TRES ÁNGULOS', '0°, 120°, 240°', 'la primera: 1');
  label(p, t, 72.6, 78.4, 'LAS OTRAS DOS', '−1/2 ± (√3/2) i', 'espejo una de otra');
  label(p, t, 78.8, 84.4, 'COMPRUEBA', '3 · 120° = 360°', 'cis 360° = 1');
  label(p, t, 84.8, 90.4, 'LA FIGURA', 'un triángulo', 'equilátero');
  label(p, t, 95.4, 101.4, 'RAÍCES SEXTAS', 'de 64', 'módulo 2');
  label(p, t, 101.8, 107.4, 'CADA 60°', 'seis puntos', 'un hexágono');
  label(p, t, 107.8, 114.0, 'REALES', '2 y −2', 'cuatro complejas');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['n RAÍCES', 'todo z ≠ 0 tiene n'],
  ['MÓDULO', [RAD('r', 'n')]],
  ['ÁNGULOS', [FR('θ + 360° k', 'n')]],
  ['LA FIGURA', 'un polígono regular'],
  ['x³ = 1', '1 y −1/2 ± (√3/2) i'],
]);
FILM.events = () => stdEvents([
  [0.4, 'paint', .8], [1.0, 'paint', 1.6], [4.0, 'paint', .8], [4.8, 'yes'], [12.8, 'card'], [15.8, 'pop', 1], [16.4, 'pop', 2], [24.8, 'pop', 3],
  [32.0, 'paint', .8], [32.6, 'pop', 1], [35.0, 'rise'], [38.4, 'pop', 2], [38.6, 'rise'], [44.6, 'paint', 1.4], [44.8, 'rise'], [44.8, 'pop', 3], [47.8, 'pop', 0], [52.4, 'pop', 3],
  [60.2, 'paint', 1.0], [61.4, 'rise'], [66.6, 'count', 0], [67.2, 'count', 1], [67.8, 'count', 2], [72.6, 'pop', 1], [75.6, 'pop', 2], [79.0, 'slide', 2.4], [79.0, 'rise'], [81.6, 'yes'], [85.0, 'paint', 1.4], [88.0, 'pop', 1],
  [95.6, 'pop'], [98.6, 'rise'], [101.8, 'count', 0], [102.2, 'count', 1], [102.6, 'count', 2], [103.0, 'count', 3], [103.4, 'count', 4], [103.8, 'count', 0], [104.8, 'paint', 1.6], [106.6, 'yes'], [108.0, 'pop', 1],
]);
FILM.NARR = [
  [0.8, 3.6, '¿Qué número, al cubo, da uno?'],
  [4.0, 6.6, 'Uno, claro. ¿Hay otro?'],
  [7.0, 9.6, 'En la recta, no: el cubo solo crece.'],
  [9.8, 12.4, 'Pero el álgebra promete tres raíces.'],
  [12.8, 15.6, 'Grado tres, tres soluciones.'],
  [15.8, 18.6, '¿Dónde se esconden las otras dos?'],
  [19.0, 21.8, 'Fuera de la recta: en el plano complejo.'],
  [22.0, 24.4, 'Y forman una figura perfecta.'],
  [24.8, 29.0, 'Para hallarlas, usamos las potencias al revés.'],
  [31.8, 34.8, 'Si w a la n es z…'],
  [35.0, 37.8, 'El módulo de w: raíz n de r.'],
  [38.2, 41.0, 'El ángulo de w: theta entre n.'],
  [41.2, 44.2, 'Pero z también vive en theta más 360.'],
  [44.6, 47.4, 'Y en theta más dos vueltas…'],
  [47.6, 50.2, 'Cada vuelta da otra raíz.'],
  [50.6, 53.6, 'Hay exactamente n raíces distintas,'],
  [53.8, 56.6, 'separadas trescientos sesenta entre n.'],
  [60.0, 63.0, 'Uno en polar: módulo uno, ángulo cero.'],
  [63.2, 66.0, 'Sus raíces cúbicas tienen módulo uno.'],
  [66.4, 69.2, 'Ángulos: cero, ciento veinte, doscientos cuarenta.'],
  [69.4, 72.2, 'La primera es el uno de siempre.'],
  [72.6, 75.4, 'Otra: menos un medio, más √3/2 i.'],
  [75.6, 78.4, 'Y su espejo, con menos.'],
  [78.8, 81.6, 'Al cubo: tres veces 120, una vuelta.'],
  [81.8, 84.4, 'Da uno. ¡Funciona!'],
  [84.8, 87.6, 'Las tres forman un triángulo equilátero.'],
  [87.8, 90.4, '¿Y con más raíces?'],
  [95.4, 98.4, 'Raíces sextas de sesenta y cuatro.'],
  [98.6, 101.4, 'Módulo: raíz sexta de 64, que es dos.'],
  [101.8, 104.6, 'Ángulos: cada sesenta grados.'],
  [104.8, 107.4, 'Seis puntos: un hexágono, como un copo.'],
  [107.8, 110.6, 'Dos y menos dos son las reales.'],
  [110.8, 114.0, 'Las otras cuatro viven fuera de la recta.'],
  [115.4, 119.6, 'x al cubo igual a uno tiene tres soluciones:'],
  [119.8, 124.4, 'uno, y menos un medio más o menos raíz de tres medios i.'],
];
