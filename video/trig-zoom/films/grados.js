// «Grados y radianes» (lección trig-41a de Zuka, Mar de las Ondas, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios): la rueda que avanza tres radios (3 rad ≈ 171.9°), 72° = 2π/5,
// 4π/3 = 240°, 2 rad ≈ 114.6°, 420° y −300° coterminales con 60°.
// Hilo (docs/storytelling-videos.md): una rueda avanza sobre el suelo exactamente tres veces su radio: ¿cuánto giró?
// Sorpresa anunciada: hay una medida que habla «el idioma de la rueda». Cierre: tres radianes, casi media vuelta.
// Niveles: 0 la rueda y los grados → 1 por «1 rad»: el radián y π → 2 por «180° = π rad»: convertir → 3 por 420°:
// coterminales y la respuesta.
const POSTER = 34.6;
const FILM = stdFilm({
  open: { Z0: 2.0, C: [380, 980], t1: 3.8, t2: 6.0 },
  aims: ['el radián', 'convertir', 'más vueltas'],
  stops: ['la rueda', 'el radián', 'convertir', 'la respuesta'],
  wides: [[9.8, 11.2], [107.8, 109.4]],
  smiles: [[52.0, 53.6], [119.0, 135]],
});

// ---------- nivel 0 · la rueda y los grados ----------
const R0 = 150, X0 = 300, GY = 1110;
function rollingWheel(G, t, t0, t1, k, o = {}) {
  const cx0 = o.x0 || X0, R = o.R || R0, gy = o.gy || GY, cy = gy - R;
  const dist = 3 * R * eio(seg(t, t0, t1)), cx = cx0 + dist, d = dist / R / D2R;
  el('rect', { x: r1(cx0 - 220), y: gy, width: r1(3 * R + 440), height: 8, rx: 4, fill: C.mist, opacity: k }, G);
  if (dist > 1) el('rect', { x: r1(cx0), y: gy - 3, width: r1(dist), height: 14, rx: 7, fill: C.sun }, G);
  for (let j = 1; j <= 3; j++) if (dist >= j * R - 1) el('rect', { x: r1(cx0 + j * R - 3), y: gy - 18, width: 6, height: 44, rx: 3, fill: C.sunD }, G);
  wheel(G, cx, cy, R, -d, k, SKY, 6);
  arcDeg(G, cx, cy, R, -90 - d, -90, k, C.sun, 14);
  const ka = eio(seg(t, t1 + .2, t1 + .9)) * k;
  if (ka > 0.01) { ray(G, cx, cy, R, -90 - d, ka, C.sun, 6); ray(G, cx, cy, R, -90, ka, C.sun, 6); arcDeg(G, cx, cy, R * .4, -90 - d, -90, ka, C.cream, 6); }
  return { cx, cy, d };
}
function level0(G, t) {
  starField(G, 301, 150);
  const kw = 1 - eio(seg(t, 12.6, 13.2));
  if (kw > 0.01) {
    const S = scaleAt(G, 540, 960, kw);
    const w = rollingWheel(S, t, 7.0, 11.0, pop(t, 0.5));
    for (let j = 1; j <= 3; j++) { const k = pop(t, 7.0 + j * 1.3); if (k > 0.01) tag(S, X0 + (j - .5) * R0, GY + 64, 'r', k, C.sun, 44); }
    if (t > 11.2) tag(S, w.cx, w.cy - R0 * .4 - 26, '?', pop(t, 11.4), C.cream, 60);
  }
  // los grados: 36 marcas y los giros de 90°, 180° y 360°
  const cx = 540, cy = 900, R = 240, kc = pop(t, 12.9) * (1 - eio(seg(t, 18.8, 19.2)));
  if (kc > 0.01) {
    const S = scaleAt(G, cx, cy, kc);
    el('circle', { cx, cy, r: R, fill: C.n2 }, S);
    const a = kf(t, [[13.2, 0], [14.0, 90], [15.0, 90], [15.6, 180], [16.2, 180], [17.0, 360]]);
    sector(S, cx, cy, R, 0, a, 1, a > 180 ? C.blue : a > 90 ? C.mint : C.sun);
    for (let j = 0; j < 36; j++) { const k = pop(t, 13.0 + j * .02); const q1 = pc(cx, cy, R - 18 * k, j * 10), q2 = pc(cx, cy, R, j * 10); capsule(S, q1[0], q1[1], q2[0], q2[1], 4, C.cream); }
    el('circle', { cx, cy, r: R, fill: 'none', stroke: C.cream, 'stroke-width': 6 }, S);
    [['90°', 14.0, 280, ZERO], ['180°', 15.6, 480, MINT], ['360°', 17.0, 680, SKY]].forEach(([s, t0, x, col]) => { const k = pop(t, t0); if (k > 0.01) chip(S, x, 1240, s, k, col, C.night, 44); });
  }
  // posición estándar: el lado terminal gira
  const ks = pop(t, 19.2) * out(t, 28.8);
  if (ks > 0.01) {
    const S = scaleAt(G, cx, cy, ks);
    el('rect', { x: cx - 300, y: cy - 2.5, width: 600, height: 5, rx: 2.5, fill: C.n3 }, S);
    el('rect', { x: cx - 2.5, y: cy - 300, width: 5, height: 600, rx: 2.5, fill: C.n3 }, S);
    const a = t < 22.5 ? 135 * eio(seg(t, 19.6, 20.8)) : -60 * eio(seg(t, 22.6, 23.6));
    ray(S, cx, cy, 280, 0, 1, C.mist, 7);
    if (Math.abs(a) > .5) arcDeg(S, cx, cy, 110, 0, a, 1, a > 0 ? C.sun : C.coral, 8, true);
    ray(S, cx, cy, 280, a, 1, a >= 0 ? C.sun : C.coral, 9);
    dot(S, cx, cy, 1, C.cream, 10);
    if (t > 20.6 && t < 22.5) tag(S, cx - 30, cy - 140, '+135°', pop(t, 20.6), C.sun, 48);
    if (t > 23.4) tag(S, cx + 150, cy + 130, '−60°', pop(t, 23.4), C.coral, 48);
  }
  fchip(G, 480, 1440, ['1 rad'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 52);
}
// ---------- nivel 1 · el radián ----------
const L1 = { cx: 540, cy: 960, R: 250 }, RAD1 = 180 / Math.PI;
function level1(G, t) {
  starField(G, 303, 90);
  fchip(G, 540, 700, ['1 rad'], out(t, 32.4), ZERO, 52);
  const { cx, cy, R } = L1;
  const S = G;
  ucircle(S, t, 31.6, cx, cy, R, { col: C.n3, sw: 6 });
  ray(S, cx, cy, R, 0, eio(seg(t, 32.0, 32.5)), C.sun, 8);
  // el radio se levanta y se dobla sobre el borde
  const kb = eio(seg(t, 32.6, 33.2)), kw = eio(seg(t, 33.4, 34.8));
  if (kb > 0.01 && t < 38.6) {
    const pts = []; for (let j = 0; j <= 24; j++) { const s = R * j / 24 * kb; const a = [cx + R, cy - s], b = pc(cx, cy, R, s / R / D2R); pts.push([lerp(a[0], b[0], kw), lerp(a[1], b[1], kw)]); }
    polyline(S, pts, 1, C.sun, 14);
  }
  const COLS = [C.sun, C.mint, C.coral, C.sun, C.mint, C.coral], TS = [38.4, 38.6, 39.4, 44.8, 45.4, 46.0];
  for (let i = 0; i < 6; i++) {
    const k = i === 0 ? (t >= 38.4 ? 1 : 0) : eio(seg(t, TS[i], TS[i] + .5));
    arcDeg(S, cx, cy, R, i * RAD1, (i + 1) * RAD1, k, COLS[i], 14);
    const q = pc(cx, cy, R + 52, (i + .5) * RAD1), kk = pop(t, TS[i] + .4);
    if (t > 38.2 && kk > 0.01) tag(S, q[0], q[1] + 16, String(i + 1), kk, COLS[i], 44);
  }
  arcDeg(S, cx, cy, R, 3 * RAD1, 180, eio(seg(t, 41.2, 41.6)), C.cream, 14);
  arcDeg(S, cx, cy, R, 6 * RAD1, 360, eio(seg(t, 46.6, 47.0)), C.cream, 14);
  // el ángulo de un radián
  const ka = eio(seg(t, 34.9, 35.5)) * (1 - eio(seg(t, 38.0, 38.4)));
  if (ka > 0.01) { ray(S, cx, cy, R, RAD1, ka, C.sun, 8); arcDeg(S, cx, cy, 90, 0, RAD1, ka, C.cream, 7); tag(S, cx + 150, cy - 50, '1 rad', ka, C.cream, 40, 'start'); }
  const kc = life(t, 36.0, 38.0);
  if (kc > 0.01) chip(G, 470, 1340, '1 rad ≈ 57.3°', kc, ZERO, C.night, 46);
  const kp = life(t, 41.2, 44.4);
  if (kp > 0.01) { arcDeg(S, cx, cy, R + 24, 0, 180, kp, C.cream, 4); chip(G, 470, 1340, 'media vuelta = π ≈ 3.14 radios', kp, POS, C.night, 40); }
  const kv = life(t, 47.0, 50.2);
  if (kv > 0.01) chip(G, 470, 1340, 'una vuelta = 2π ≈ 6.28 radios', kv, MINT, C.night, 40);
  fchip(G, 480, 1440, ['180°', '=', 'π rad'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 48);
}
// ---------- nivel 2 · convertir ----------
function level2(G, t) {
  starField(G, 305, 90);
  fchip(G, 540, 700, ['180°', '=', 'π rad'], out(t, 61.0), ZERO, 48);
  riseFormula(G, t, 61.4, 72.2, 540, 820, 58, ['grados', '·', FR('π', '180'), '=', 'radianes']);
  riseFormula(G, t, 72.6, 84.4, 540, 820, 58, ['radianes', '·', FR('180', 'π'), '=', 'grados']);
  const cx = 540, cy = 1090, R = 170, kc = pop(t, 66.4) * (1 - eio(seg(t, 90.6, 91.0)));
  if (kc > 0.01) {
    const S = scaleAt(G, cx, cy, kc);
    el('circle', { cx, cy, r: R, fill: C.n2 }, S);
    const a = kf(t, [[66.6, 0], [67.6, 72], [72.6, 72], [73.6, 240], [78.8, 240], [79.6, 114.6], [84.8, 114.6], [85.4, 0]]);
    const col = t < 72.6 ? C.mint : t < 78.8 ? C.coral : C.sun;
    sector(S, cx, cy, R, 0, a, 1, col);
    if (t < 72.6) for (let j = 1; j < 5; j++) ray(S, cx, cy, R, 72 * j, pop(t, 67.8 + j * .2), C.n3, 5);
    el('circle', { cx, cy, r: R, fill: 'none', stroke: C.cream, 'stroke-width': 6 }, S);
    if (t > 85.2) { const pts = [], e = 420 * eio(seg(t, 85.6, 87.4)); for (let j = 0; j <= 84; j++) { const an = e * j / 84; pts.push(pc(cx, cy, 60 + 90 * an / 420, an)); } polyline(S, pts, 1, C.sun, 8); if (e > 10) ray(S, cx, cy, R, e, 1, C.sun, 7); }
  }
  riseFormula(G, t, 67.8, 72.2, 470, 1380, 46, ['72', '·', FR('π', '180'), '=', FR('72π', '180'), '=', FR('2π', '5')]);
  riseFormula(G, t, 74.0, 78.4, 470, 1380, 46, [FR('4π', '3'), '·', FR('180', 'π'), '=', '240°']);
  riseFormula(G, t, 79.8, 84.4, 470, 1380, 46, ['2', '·', FR('180', 'π'), '≈', '114.6°']);
  fchip(G, 480, 1440, ['420°'], pop(t, 88.2) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 52);
}
// ---------- nivel 3 · coterminales y la respuesta ----------
function level3(G, t) {
  starField(G, 307, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['420°'], out(t, 96.0), ZERO, 52);
  const cx = 540, cy = 1000, kc = pop(t, 95.2) * (1 - eio(seg(t, 101.4, 101.8)));
  if (kc > 0.01) {
    const S = scaleAt(E, cx, cy, kc);
    ucircle(S, t, 95.2, cx, cy, 220, { col: C.n3, sw: 5 });
    const e = 420 * eio(seg(t, 95.8, 97.8)), pts = [];
    for (let j = 0; j <= 84; j++) { const an = e * j / 84; pts.push(pc(cx, cy, 70 + 80 * an / 420, an)); }
    polyline(S, pts, 1, C.sun, 9);
    const f = -300 * eio(seg(t, 98.8, 100.6)), qs = [];
    for (let j = 0; j <= 60; j++) { const an = f * j / 60; qs.push(pc(cx, cy, 175 + 20 * j / 60, an)); }
    if (t > 98.8) polyline(S, qs, 1, C.coral, 9);
    ray(S, cx, cy, 250, t > 97.8 ? 60 : e, eio(seg(t, 95.6, 96.0)), C.sun, 9);
    dot(S, cx, cy, 1, C.cream, 10);
  }
  riseFormula(E, t, 97.2, 101.4, 470, 1330, 46, ['420°', '=', '360°', '+', '60°']);
  riseFormula(E, t, 99.6, 101.4, 470, 1420, 46, ['−300°', '=', '60°', '−', '360°'], { fill: C.coral });
  // la rueda otra vez
  const kw = pop(t, 101.8);
  if (kw > 0.01) {
    const w = rollingWheel(E, t, 102.4, 104.6, kw, { x0: 300, R: 140, gy: 1190 });
    tag(E, w.cx, w.cy - 170, '3 rad', pop(t, 105.0), C.cream, 40);
    const kh = eio(seg(t, 108.0, 108.8));
    if (kh > 0.01) { arcDeg(E, w.cx, w.cy, 140, -90 - w.d, -270, kh, C.coral, 18); tag(E, w.cx - 150, w.cy - 150, 'π − 3 ≈ 0.14', pop(t, 108.6), C.coral, 40, 'end'); }
  }
  riseFormula(E, t, 105.2, 113.8, 540, 840, 54, ['3', '·', FR('180', 'π'), '≈', '171.9°']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Grados y', 'radianes');
  label(p, t, 6.6, 12.4, 'LA RUEDA', 'avanza tres radios', '¿cuánto giró?');
  label(p, t, 12.8, 18.6, 'GRADOS', 'una vuelta: 360 tajadas', 'cuarto: 90°, media: 180°');
  label(p, t, 19.0, 24.4, 'POSICIÓN ESTÁNDAR', 'empieza en el eje x', 'antihorario: positivo');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'hay una medida', 'que habla como la rueda');
  label(p, t, 31.8, 37.8, 'EL RADIÁN', 'el arco mide', 'lo mismo que el radio');
  label(p, t, 38.2, 44.2, '¿CUÁNTOS CABEN?', 'en media vuelta', 'caben π radios');
  label(p, t, 44.6, 50.2, 'UNA VUELTA', '2π radianes', 'en cualquier rueda');
  label(p, t, 50.6, 56.6, 'LA LLAVE', '180° = π rad', 'el puente entre los dos');
  label(p, t, 60.0, 66.0, 'DE GRADOS A RADIANES', 'multiplica por π/180', 'y simplifica');
  label(p, t, 66.4, 72.2, 'UNA ESTRELLA', 'reparte la vuelta en 5', 'cada pico: 72°');
  label(p, t, 72.6, 78.4, 'DE RADIANES A GRADOS', 'multiplica por 180/π', 'π se cancela');
  label(p, t, 78.8, 84.4, 'SIN π', 'también vale', '2 rad ≈ 114.6°');
  label(p, t, 84.8, 90.4, 'MÁS DE UNA VUELTA', 'los giros', 'se acumulan');
  label(p, t, 95.4, 101.4, 'COTERMINALES', 'terminan en el mismo lado', 'difieren en vueltas');
  label(p, t, 101.8, 107.4, 'LA RUEDA', 'avanzó tres radios', 'giró 3 radianes');
  label(p, t, 107.8, 114.0, 'LA SORPRESA', 'casi media vuelta', 'le faltan 0.14 rad');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['GRADOS', '360° en una vuelta'],
  ['RADIÁN', 'el arco mide un radio'],
  ['LA LLAVE', ['180°', '=', 'π rad']],
  ['CONVERTIR', ['·', FR('π', '180'), 'o', '·', FR('180', 'π')]],
  ['COTERMINALES', 'difieren en vueltas'],
]);
FILM.events = () => stdEvents([
  [0.5, 'pop'], [7.0, 'slide', 4.0], [8.3, 'tile', 0], [9.6, 'tile', 1], [10.9, 'tile', 2], [11.4, 'pop', 2],
  [12.9, 'pop'], [13.4, 'paint', 1.0], [14.4, 'pop', 0], [15.8, 'paint', .8], [16.6, 'pop', 1], [17.2, 'paint', 1.0], [18.2, 'pop', 2],
  [19.2, 'pop'], [19.6, 'slide', 1.8], [22.2, 'slide', 1.4], [24.8, 'pop', 3],
  [32.0, 'slide', .5], [32.6, 'slide', .6], [33.4, 'paint', 1.4], [34.9, 'yes'], [36.0, 'card'],
  [38.6, 'count', 1], [39.4, 'count', 2], [41.2, 'count', 3], [41.6, 'card'], [44.8, 'count', 3], [45.4, 'count', 4], [46.0, 'count', 0], [46.6, 'count', 1], [47.0, 'yes'], [52.4, 'pop', 3],
  [61.4, 'rise'], [66.4, 'pop'], [66.6, 'paint', 1.0], [67.8, 'rise'], [72.6, 'rise'], [72.6, 'paint', 1.0], [74.0, 'rise'],
  [78.8, 'paint', .8], [79.8, 'rise'], [85.6, 'paint', 1.8], [88.2, 'pop', 1],
  [95.2, 'pop'], [95.8, 'paint', 2.0], [97.2, 'rise'], [98.8, 'paint', 1.8], [99.6, 'rise'], [101.4, 'away', .4],
  [101.8, 'pop'], [102.4, 'slide', 2.2], [105.0, 'yes'], [105.2, 'rise'], [108.0, 'paint', .8], [108.6, 'card'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una rueda descansa sobre el suelo.'],
  [4.0, 6.6, 'Va a rodar en línea recta.'],
  [7.0, 9.6, 'Avanza exactamente tres veces su radio.'],
  [9.8, 12.4, 'Pregunta: ¿cuánto giró la rueda?'],
  [12.8, 15.6, 'Los grados parten la vuelta en 360 tajadas.'],
  [15.8, 18.6, 'Un cuarto de vuelta: noventa. Media: ciento ochenta.'],
  [19.0, 21.8, 'Todo ángulo empieza en el eje x positivo.'],
  [22.0, 24.4, 'Antihorario, positivo; horario, negativo.'],
  [24.8, 29.0, 'Pero hay una medida que habla el idioma de la rueda.'],
  [31.8, 34.8, 'Toma el radio y dóblalo sobre el borde.'],
  [35.0, 37.8, 'El ángulo que abarca mide un radián.'],
  [38.2, 41.0, 'Pon más radios por el borde: dos, tres…'],
  [41.2, 44.2, 'y un pedacito: media vuelta son pi radios.'],
  [44.6, 47.4, 'Una vuelta: dos pi, seis radios y pico.'],
  [47.6, 50.2, 'Vale para cualquier rueda, grande o pequeña.'],
  [50.6, 53.6, 'Esa es la llave: ciento ochenta grados son pi.'],
  [53.8, 56.6, 'Con ella pasamos de un idioma al otro.'],
  [60.0, 62.8, 'De grados a radianes:'],
  [63.0, 66.0, 'multiplica por pi sobre ciento ochenta.'],
  [66.4, 69.2, 'Una estrella reparte la vuelta en cinco.'],
  [69.4, 72.2, 'Setenta y dos grados son dos pi quintos.'],
  [72.6, 75.4, 'Al revés, multiplica por ciento ochenta sobre pi.'],
  [75.6, 78.4, 'Cuatro pi tercios son doscientos cuarenta grados.'],
  [78.8, 81.6, 'Un ángulo sin pi también vale: dos radianes.'],
  [81.8, 84.4, 'Son unos ciento catorce punto seis grados.'],
  [84.8, 87.6, '¿Y si el giro sigue y sigue?'],
  [87.8, 90.4, 'Los ángulos pueden pasar de una vuelta.'],
  [95.4, 98.4, 'Cuatrocientos veinte es una vuelta y sesenta más.'],
  [98.6, 101.4, 'Menos trescientos termina en el mismo lado.'],
  [101.8, 104.6, 'Volvamos a la rueda: avanzó tres radios.'],
  [104.8, 107.4, 'Tres radianes: casi ciento setenta y dos grados.'],
  [107.8, 110.6, '¡Casi media vuelta!'],
  [110.8, 114.0, 'Para media vuelta le faltaban pi menos tres.'],
  [115.4, 119.6, 'La rueda avanzó tres radios y giró tres radianes:'],
  [119.8, 124.4, 'unos ciento setenta y dos grados, casi media vuelta.'],
];
