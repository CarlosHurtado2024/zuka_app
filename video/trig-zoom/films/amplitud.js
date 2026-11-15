// «Seno y coseno: amplitud» (lección trig-44a, Mar de las Ondas, video 8) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la marea y = 2 sen x + 3 (rango [1, 5]) y el barco que necesita 1.5 m;
// las amplitudes a = 3, a = 0.5 y a = −3.
// Hilo: un barco necesita metro y medio de agua; la marea sube y baja: ¿puede quedarse todo el día en el puerto?
// Sorpresa anunciada: la fórmula contesta sola. Cierre: en marea baja hay 1 m y el barco toca fondo.
const POSTER = 104;
const FILM = stdFilm({
  open: { Z0: 1.8, C: [540, 1000], t1: 3.8, t2: 6.0 },
  aims: ['la onda seno', 'la amplitud', 'la línea media'],
  stops: ['el puerto', 'la onda seno', 'la amplitud', 'la línea media'],
  wides: [[107.8, 109.4], [75.6, 77.2]],
  smiles: [[41.2, 43.0], [119.0, 135]],
});
// el puerto: regla de 0 a 6 m, agua a la altura h(t) (metros) y el barco
function harbor(p, t, k, hOf, o = {}) {
  if (k <= 0.01) return;
  const S = scaleAt(p, 540, 1250, k), Y0 = 1250, U = 90, h = hOf(t), wy = Y0 - h * U;
  el('rect', { x: -200, y: wy, width: 1480, height: Y0 - wy + 10, fill: C.n3 }, S);
  let d = ''; for (let x = -200; x <= 1280; x += 20) d += (d ? 'L' : 'M') + `${x},${r1(wy + 5 * Math.sin(x / 50 + t * 2))}`;
  el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 5 }, S);
  el('rect', { x: -200, y: Y0, width: 1480, height: 34, rx: 12, fill: C.sunD }, S);
  const bx = o.bx || 360, keel = Math.max(1.5, h), by = Y0 - keel * U + 20;
  boat(S, bx, by, 70, 1, h < 1.5 ? [C.coral, C.coralD] : [C.mint, C.mintD]);
  el('rect', { x: bx - 4, y: by + 14, width: 8, height: r1(1.5 * U - 34), fill: C.coral }, S);
  const px = o.px || 800;
  el('rect', { x: px - 12, y: Y0 - 6.2 * U, width: 24, height: 6.2 * U, rx: 6, fill: C.cream }, S);
  for (let m = 0; m <= 6; m++) { el('rect', { x: px - 12, y: Y0 - m * U - 3, width: 40, height: 6, fill: C.night }, S); text(S, px + 44, Y0 - m * U + 12, m + ' m', { 'font-size': 34, 'font-weight': 600, fill: C.cream, 'data-pass': 1 }); }
}
const TIDE = t => 3 + 2 * Math.sin((t - 4) * 0.9);
function level0(G, t) {
  starField(G, 371, 150);
  const k = pop(t, 0.3) * out(t, 28.8);
  harbor(G, t, k, t => t < 4 ? 3 : TIDE(t));
  const ks = eio(seg(t, 19.2, 21.0)) * k;
  if (ks > 0.01) { const pts = []; for (let j = 0; j <= 60; j++) { const tt = t - 6 + 6 * j / 60; pts.push([150 + j * 9, 1250 - TIDE(tt) * 90]); } polyline(G, pts, ks, C.sun, 6); }
  const kl = life(t, 4.2, 12.4); if (kl > 0.01) chip(G, 300, 600, 'necesita 1.5 m', kl, MINT, C.night, 42);
  fchip(G, 480, 1440, ['y = sen x'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · la onda seno ----------
const M8 = { ox: 390, oy: 1000, s: 82, sy: 125 };
function level1(G, t) {
  starField(G, 373, 90);
  fchip(G, 540, 700, ['y = sen x'], out(t, 32.4), ZERO, 50);
  const cx = 230, cy = 1000, R = 125, x = 2 * Math.PI * eio(seg(t, 34.0, 41.0)), P = pc(cx, cy, R, x / D2R);
  ucircle(G, t, 32.0, cx, cy, R, { col: C.blue, sw: 6 });
  axes(G, t, 32.4, M8, 0, 2 * Math.PI + .3, -1.3, 1.3, { ticks: false });
  piTicks(G, t, 33.0, M8, [[Math.PI / 2, FR('π', '2')], [Math.PI, 'π'], [1.5 * Math.PI, FR('3π', '2')], [2 * Math.PI, '2π']]);
  wave(G, M8, Math.sin, 0, 2 * Math.PI, x / (2 * Math.PI), C.sun, 8);
  wave(G, M8, Math.cos, 0, 2 * Math.PI, eio(seg(t, 45.0, 47.4)), C.mint, 7);
  if (t > 32.6 && t < 44.6) {
    ray(G, cx, cy, R, x / D2R, 1, C.cream, 5); dot(G, P[0], P[1], 1, C.sun, 12);
    const Q = [mx(M8, x), my(M8, Math.sin(x))];
    el('line', { x1: r1(P[0]), y1: r1(P[1]), x2: r1(Q[0]), y2: r1(Q[1]), stroke: C.sun, 'stroke-width': 3, 'stroke-dasharray': '8 10' }, G);
    dot(G, Q[0], Q[1], 1, C.sun, 12);
  }
  tag(G, mx(M8, Math.PI / 2), my(M8, 1) - 26, '1', pop(t, 37.0), C.sun, 40);
  tag(G, mx(M8, 1.5 * Math.PI), my(M8, -1) + 56, '−1', pop(t, 39.0), C.sun, 40);
  riseFormula(G, t, 41.4, 56.6, 540, 700, 54, ['y', '=', 'sen x'], { fill: C.sun });
  riseFormula(G, t, 45.4, 56.6, 540, 790, 54, ['y', '=', 'cos x'], { fill: C.mint });
  fchip(G, 480, 1440, ['y = a', '·', 'sen x'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 46);
}
// ---------- nivel 2 · la amplitud ----------
const M9 = { ox: 130, oy: 1040, s: 130, sy: 80 };
function level2(G, t) {
  starField(G, 375, 90);
  fchip(G, 540, 700, ['y = a', '·', 'sen x'], out(t, 61.0), ZERO, 46);
  const ko = 1 - eio(seg(t, 90.6, 91.0)); if (ko <= 0.01) return fchip(G, 480, 1440, ['+ d'], pop(t, 88.0), ZERO, 52);
  const S = scaleAt(G, 540, 1040, ko);
  axes(S, t, 60.2, M9, 0, 2 * Math.PI + .2, -3.4, 3.4, { ticks: false });
  for (const v of [-3, -1, 1, 3]) tag(S, M9.ox - 18, my(M9, v) + 12, minus(v), pop(t, 60.6), C.mist, 30, 'end');
  wave(S, M9, Math.sin, 0, 2 * Math.PI, 1, C.n3, 6);
  const a = kf(t, [[60.0, 1], [63.4, 1], [64.6, 3], [72.6, 3], [73.6, .5], [75.6, .5], [76.8, -3], [84.8, -3], [86.0, 3]]);
  wave(S, M9, x => a * Math.sin(x), 0, 2 * Math.PI, eio(seg(t, 60.4, 61.8)), a < 0 ? C.coral : C.sun, 8);
  const ka = eio(seg(t, 69.4, 70.2)) * (1 - eio(seg(t, 72.4, 72.6)));
  if (ka > 0.01) { segAB(S, [mx(M9, Math.PI / 2), M9.oy], [mx(M9, Math.PI / 2), my(M9, 3)], ka, C.mint, 8); tag(S, mx(M9, Math.PI / 2) + 22, my(M9, 1.5), 'amplitud 3', ka, C.mint, 36, 'start'); }
  if (t > 84.8) { hline(S, M9, 0, 0, 2 * Math.PI, eio(seg(t, 86.4, 87.6)), C.sun, 5); }
  riseFormula(G, t, 63.6, 72.2, 540, 690, 50, ['y', '=', '3', '·', 'sen x']);
  riseFormula(G, t, 73.0, 75.4, 540, 690, 50, ['y', '=', '0.5', '·', 'sen x']);
  riseFormula(G, t, 76.0, 84.4, 540, 690, 50, ['y', '=', '−3', '·', 'sen x'], { fill: C.coral });
  riseFormula(G, t, 79.0, 84.4, 540, 1400, 50, ['amplitud', '=', '|a|', '=', '3']);
  fchip(G, 480, 1440, ['+ d'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 52);
}
// ---------- nivel 3 · la línea media y la marea ----------
const MT = { ox: 120, oy: 1240, s: 120, sy: 90 };
function level3(G, t) {
  starField(G, 377, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['+ d'], out(t, 96.0), ZERO, 52);
  const ko = 1 - eio(seg(t, 107.4, 107.8));
  if (ko > 0.01) {
    const S = scaleAt(E, 540, 1000, ko), d = 3 * eio(seg(t, 96.6, 98.0));
    axes(S, t, 95.6, MT, 0, 2 * Math.PI + .2, 0, 6.2, { ticks: false });
    for (let v = 1; v <= 5; v++) tag(S, MT.ox - 18, my(MT, v) + 12, String(v), pop(t, 96.0 + v * .05), C.mist, 30, 'end');
    wave(S, MT, x => 2 * Math.sin(x), 0, 2 * Math.PI, 1, C.n3, 5, -9, 9);
    wave(S, MT, x => 2 * Math.sin(x) + d, 0, 2 * Math.PI, 1, C.sun, 8);
    hline(S, MT, d, 0, 2 * Math.PI, eio(seg(t, 98.8, 99.6)), C.mint, 5);
    tag(S, mx(MT, 2 * Math.PI) - 10, my(MT, d) - 16, 'línea media', pop(t, 99.4), C.mint, 32, 'end');
    const kr = eio(seg(t, 104.8, 105.6));
    if (kr > 0.01) { hline(S, MT, 5, 0, 2 * Math.PI, kr, C.cream, 3); hline(S, MT, 1, 0, 2 * Math.PI, kr, C.coral, 4); tag(S, mx(MT, 4.71), my(MT, 1) + 50, '1 m', kr, C.coral, 38); tag(S, mx(MT, 1.57), my(MT, 5) - 22, '5 m', kr, C.cream, 38); }
  }
  riseFormula(E, t, 102.0, 107.4, 540, 520, 50, ['y', '=', '2', '·', 'sen x', '+', '3']);
  riseFormula(E, t, 104.8, 107.4, 540, 610, 46, ['rango', '=', '[3 − 2, 3 + 2]', '=', '[1, 5]']);
  const kh = pop(t, 107.8);
  if (kh > 0.01) harbor(E, t, kh, () => lerp(3, 1, eio(seg(t, 108.2, 110.6))));
  const kb = pop(t, 110.8);
  if (kb > 0.01) chip(E, 540, 620, '1 m < 1.5 m: toca fondo', kb, NEG, C.night, 44);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Seno, coseno', 'y amplitud');
  label(p, t, 6.6, 12.4, 'EL PUERTO', 'la marea sube', 'y baja todo el día');
  label(p, t, 12.8, 18.6, 'LA REGLA DEL MUELLE', 'sube hasta 5 m', '¿y cuánto baja?');
  label(p, t, 19.0, 24.4, 'UN VAIVÉN', 'que se repite', 'con forma de onda');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la fórmula', 'contesta sola');
  label(p, t, 31.8, 37.8, 'DESENROLLAR', 'la altura del punto', 'mientras gira');
  label(p, t, 38.2, 44.2, 'LA ONDA SENO', 'de −1 a 1', 'cada 2π');
  label(p, t, 44.6, 50.2, 'LA ONDA COSENO', 'la misma onda', 'corrida π/2');
  label(p, t, 50.6, 56.6, 'ENTRE −1 Y 1', 'la marea', 'llega más alto');
  label(p, t, 60.0, 66.0, 'LA AMPLITUD', 'a estira la onda', 'hacia arriba y abajo');
  label(p, t, 66.4, 72.2, 'a = 3', 'de −3 a 3', 'amplitud 3');
  label(p, t, 72.6, 78.4, 'a = 0.5 · a = −3', 'se aplana', 'o se voltea');
  label(p, t, 78.8, 84.4, 'AMPLITUD', 'a sin su signo', 'siempre positiva');
  label(p, t, 84.8, 90.4, 'LA MAREA', 'no oscila en cero', 'su centro: 3 m');
  label(p, t, 95.4, 101.4, 'DESPLAZAR', 'sumar d sube la onda', 'línea media: y = d');
  label(p, t, 101.8, 107.4, 'LA MAREA', 'amplitud 2, centro 3', 'rango [1, 5]');
  label(p, t, 107.8, 114.0, 'MAREA BAJA', 'solo 1 m de agua', 'el barco toca fondo');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['ONDA SENO', 'la altura de un punto que gira'],
  ['COSENO', 'la misma onda, corrida π/2'],
  ['AMPLITUD', ['|a|', ': estira la onda']],
  ['LÍNEA MEDIA', ['y = d', ': la sube o la baja']],
  ['RANGO', ['[d − |a|, d + |a|]']],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.2, 'pop', 1], [19.2, 'paint', 1.8], [24.8, 'pop', 3],
  [32.0, 'paint', 1.3], [33.0, 'tile', 0], [34.0, 'slide', 7.0], [37.0, 'pop', 1], [39.0, 'pop', 2], [41.4, 'rise'], [45.0, 'paint', 2.4], [45.4, 'rise'], [52.4, 'pop', 3],
  [60.2, 'paint', 1.0], [63.4, 'slide', 1.2], [63.6, 'rise'], [69.4, 'paint', .8], [72.6, 'slide', 1.0], [73.0, 'rise'], [75.6, 'slide', 1.2], [76.0, 'rise'], [79.0, 'rise'], [84.8, 'slide', 1.2], [86.4, 'paint', 1.2], [88.0, 'pop', 1],
  [96.6, 'slide', 1.4], [98.8, 'paint', .8], [99.4, 'pop', 2], [102.0, 'rise'], [104.8, 'rise'], [104.8, 'paint', .8], [107.8, 'pop'], [108.2, 'slide', 2.4], [110.8, 'no'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Un barco descansa en el puerto.'],
  [4.0, 6.6, 'Necesita metro y medio de agua para flotar.'],
  [7.0, 9.6, 'Pero la marea sube y baja.'],
  [9.8, 12.4, 'Una regla en el muelle muestra el vaivén.'],
  [12.8, 15.6, 'Sube hasta cinco metros; baja… ¿hasta dónde?'],
  [15.8, 18.6, '¿Puede quedarse el barco en el puerto?'],
  [19.0, 21.8, 'Ese vaivén tiene forma de onda.'],
  [22.0, 24.4, 'Una onda que nace de un círculo.'],
  [24.8, 29.0, 'Y su fórmula contesta casi sola.'],
  [31.8, 34.8, 'Un punto gira en la circunferencia unitaria.'],
  [35.0, 37.8, 'Anota su altura mientras avanza.'],
  [38.2, 41.0, 'Sube a uno, baja a menos uno, vuelve.'],
  [41.2, 44.2, 'Esa es la onda seno.'],
  [44.6, 47.4, 'Su sombra horizontal da la onda coseno.'],
  [47.6, 50.2, 'La misma onda, corrida un cuarto de vuelta.'],
  [50.6, 53.6, 'Las dos viven entre menos uno y uno.'],
  [53.8, 56.6, 'La marea, en cambio, llega a cinco.'],
  [60.0, 63.0, 'Multiplica el seno por un número a.'],
  [63.2, 66.0, 'Con a igual a tres, se estira.'],
  [66.4, 69.2, 'Sube a tres y baja a menos tres.'],
  [69.4, 72.2, 'Esa altura es la amplitud.'],
  [72.6, 75.4, 'Con un medio, se aplana.'],
  [75.6, 78.4, 'Con a negativo, la onda se voltea.'],
  [78.8, 81.6, 'La amplitud es a sin su signo:'],
  [81.8, 84.4, 'el valor absoluto de a.'],
  [84.8, 87.6, 'Pero la marea no oscila alrededor de cero.'],
  [87.8, 90.4, 'Oscila alrededor de tres.'],
  [95.4, 98.4, 'Sumar d sube toda la onda.'],
  [98.6, 101.4, 'La línea media pasa a la altura d.'],
  [101.8, 104.6, 'La marea: dos seno de x, más tres.'],
  [104.8, 107.4, 'Rango: de uno a cinco metros.'],
  [107.8, 110.6, 'En marea baja queda solo un metro.'],
  [110.8, 114.0, 'Menos de metro y medio: el barco toca fondo.'],
  [115.4, 119.6, 'El barco no puede quedarse todo el día:'],
  [119.8, 124.4, 'en marea baja hay un metro, y necesita uno y medio.'],
];
