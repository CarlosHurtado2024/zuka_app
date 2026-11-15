// «Signos y ángulo de referencia» (lección trig-43b, Mar de las Ondas, video 7) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): el eco del radar en 240° (cos 240° = −1/2, sen 240° = −√3/2,
// tan 240° = √3), las referencias de 150°, 240° y 320° y la paridad con ±50°.
// Hilo: el radar de un barco marca un eco en 240° y hace falta su coseno, pero solo memorizaste hasta 90°.
// Sorpresa anunciada: «dos preguntas bastan» (referencia → valor, cuadrante → signo). Cierre: cos 240° = −1/2.
const POSTER = 52;
const FILM = stdFilm({
  open: { Z0: 1.8, C: [540, 960], t1: 3.8, t2: 6.0 },
  aims: ['los signos', 'la referencia', 'el eco'],
  stops: ['el radar', 'los signos', 'la referencia', 'el eco'],
  wides: [[12.8, 14.4], [98.6, 100.2]],
  smiles: [[53.8, 55.6], [119.0, 135]],
});
function radar(p, t, cx, cy, R, k, blip = 240) {
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k), sw = (t * 60) % 360;
  el('circle', { cx, cy, r: R + 24, fill: C.n3 }, S);
  el('circle', { cx, cy, r: R, fill: C.n2 }, S);
  for (let j = 1; j <= 3; j++) el('circle', { cx, cy, r: R * j / 3, fill: 'none', stroke: C.mintD, 'stroke-width': 3 }, S);
  capsule(S, cx - R, cy, cx + R, cy, 3, C.mintD); capsule(S, cx, cy - R, cx, cy + R, 3, C.mintD);
  for (let j = 0; j < 6; j++) sector(S, cx, cy, R, sw - 6 * (j + 1), sw - 6 * j, 1, j < 2 ? C.mint : j < 4 ? C.mintD : C.n3);
  ray(S, cx, cy, R, sw, 1, C.mint, 6);
  if (blip != null) { const q = pc(cx, cy, R * .72, blip); dot(S, q[0], q[1], pop(t, 3.2), C.coral, 16); }
}
function level0(G, t) {
  starField(G, 361, 150);
  const cx = 540, cy = 940, R = 320, k = pop(t, 0.3) * out(t, 28.8);
  radar(G, t, cx, cy, R, k * (1 - .25 * eio(seg(t, 12.8, 13.6))));
  const kq = eio(seg(t, 13.0, 13.8)) * k;
  if (kq > 0.01) [['I', 45], ['II', 135], ['III', 225], ['IV', 315]].forEach(([s, a], i) => { const q = pc(cx, cy, R * .5, a); chip(G, q[0], q[1], s, pop(t, 13.4 + i * .4) * k, i ? POS : ZERO, C.night, 50); });
  const km = eio(seg(t, 19.2, 20.4)) * k;
  if (km > 0.01) {
    const q = pc(cx, cy, R * .72, 60), m2 = pc(cx, cy, R * .72, 120), m3 = pc(cx, cy, R * .72, 240), m4 = pc(cx, cy, R * .72, 300);
    dot(G, q[0], q[1], km, C.sun, 14);
    [m2, m3, m4].forEach((m, i) => { segAB(G, q, m, eio(seg(t, 20.0 + i * .5, 20.8 + i * .5)), C.sun, 4); dot(G, m[0], m[1], pop(t, 20.6 + i * .5) * k, C.mist, 12); });
  }
  const kc = life(t, 7.0, 12.4);
  if (kc > 0.01) chip(G, 470, 1360, 'cos 240° = ¿?', kc, POS, C.night, 48);
  fchip(G, 480, 1440, ['+', '/', '−'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 52);
}
// ---------- nivel 1 · los signos ----------
const U7 = { cx: 540, cy: 980, R: 280 };
function level1(G, t) {
  starField(G, 363, 90);
  fchip(G, 540, 700, ['+', '/', '−'], out(t, 32.4), ZERO, 52);
  const { cx, cy, R } = U7;
  ucircle(G, t, 31.8, cx, cy, R, { col: C.blue, sw: 7 });
  const a = kf(t, [[32.4, 50], [38.2, 50], [41.0, 130], [44.6, 130], [45.6, 220], [50.6, 220], [51.6, 310], [53.8, 310]]);
  if (t < 54) {
    const P = pc(cx, cy, R, a), F = [P[0], cy];
    segAB(G, [cx, cy], F, 1, C.mint, 9); segAB(G, F, P, 1, C.coral, 9); ray(G, cx, cy, R, a, 1, C.sun, 7); dot(G, P[0], P[1], 1, C.sun, 13);
    const sx = Math.cos(a * D2R) > 0 ? '+' : '−', sy = Math.sin(a * D2R) > 0 ? '+' : '−';
    tag(G, (cx + F[0]) / 2, cy + (P[1] < cy ? 52 : -24), 'x ' + sx, pop(t, 33.0), C.mint, 42);
    tag(G, F[0] + (P[0] > cx ? 24 : -24), (cy + P[1]) / 2 + 14, 'y ' + sy, pop(t, 33.4), C.coral, 42, P[0] > cx ? 'start' : 'end');
  }
  [['todas', 45, 38.4, ZERO], ['sen', 135, 42.0, NEG], ['tan', 225, 48.0, SKY], ['cos', 315, 51.6, MINT]].forEach(([s, an, t0, col]) => {
    const q = pc(cx, cy, R + 120, an); chip(G, q[0], q[1], s, pop(t, t0), col, C.night, 44);
  });
  const km = life(t, 53.6, 57.2);
  if (km > 0.01) chip(G, 540, 610, 'Todas · Seno · Tangente · Coseno', km, POS, C.night, 38);
  fchip(G, 480, 1440, ['referencia'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), MINT, 46);
}
// ---------- nivel 2 · el ángulo de referencia ----------
function level2(G, t) {
  starField(G, 365, 90);
  fchip(G, 540, 700, ['referencia'], out(t, 61.0), MINT, 46);
  const { cx, cy, R } = U7, ko = 1 - eio(seg(t, 90.6, 91.0));
  if (ko <= 0.01) return fchip(G, 480, 1440, ['cos 240°'], pop(t, 88.0), NEG, 50);
  const S = scaleAt(G, cx, cy, ko);
  ucircle(S, t, 60.2, cx, cy, R, { col: C.blue, sw: 7 });
  const step = t < 66.4 ? 0 : t < 72.6 ? 1 : t < 78.8 ? 2 : 3;
  const DATA = [[50, 50, 0], [150, 30, 180], [240, 60, 180], [320, 40, 360]], [a, ref, axis] = DATA[step];
  const ka = eio(seg(t, [60.6, 66.6, 72.8, 79.0][step], [61.6, 67.6, 73.8, 80.0][step]));
  arcDeg(S, cx, cy, 70, 0, a * ka, 1, C.cream, 6, step > 0);
  ray(S, cx, cy, R, a * ka, 1, C.sun, 8);
  const kr = eio(seg(t, [62.0, 68.0, 74.2, 80.4][step], [62.8, 68.8, 75.0, 81.2][step]));
  if (kr > 0.01) {
    arcDeg(S, cx, cy, 150, axis, a, kr, C.coral, 12);
    const q = pc(cx, cy, 195, (a + axis) / 2); tag(S, q[0], q[1] + 14, ref + '°', kr, C.coral, 40);
    const mir = eio(seg(t, [63.4, 69.6, 75.8, 82.0][step], [64.4, 70.6, 76.8, 83.0][step]));
    if (step > 0 && mir > 0.01) { ray(S, cx, cy, R, ref, mir, C.mist, 6); arcDeg(S, cx, cy, 120, 0, ref, mir, C.mist, 8); const Q = pc(cx, cy, R, ref); dot(S, Q[0], Q[1], mir, C.mist, 11); }
  }
  const TXT = [null, ['180°', '−', '150°', '=', '30°'], ['240°', '−', '180°', '=', '60°'], ['360°', '−', '320°', '=', '40°']];
  TXT.forEach((f, i) => { if (f) riseFormula(G, t, [0, 68.2, 74.4, 80.6][i], [0, 72.2, 78.4, 84.4][i], 540, 620, 52, f); });
  const kv = life(t, 85.0, 90.4);
  if (kv > 0.01) { chip(G, 540, 590, 'referencia → valor', kv, MINT, C.night, 38); chip(G, 540, 670, 'cuadrante → signo', kv, NEG, C.night, 38); }
  fchip(G, 480, 1440, ['cos 240°'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 50);
}
// ---------- nivel 3 · el eco y la paridad ----------
function level3(G, t) {
  starField(G, 367, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['cos 240°'], out(t, 96.0), NEG, 50);
  const { cx, cy, R } = U7;
  ucircle(E, t, 95.4, cx, cy, R, { col: C.blue, sw: 7, quads: 95.8 });
  if (t < 101.6) {
    const P = pc(cx, cy, R, 240), F = [P[0], cy], k = eio(seg(t, 96.0, 96.8));
    ray(E, cx, cy, R, 240, k, C.sun, 8); segAB(E, [cx, cy], F, k, C.mint, 10); segAB(E, F, P, k, C.coral, 10);
    dot(E, P[0], P[1], k, C.coral, 14);
    tag(E, (cx + F[0]) / 2, cy - 26, '−1/2', pop(t, 98.8), C.mint, 42);
  } else {
    const a = 50 * eio(seg(t, 102.0, 102.8)), b = -50 * eio(seg(t, 103.6, 104.6));
    const P = pc(cx, cy, R, a), Q = pc(cx, cy, R, b);
    ray(E, cx, cy, R, a, 1, C.sun, 8); dot(E, P[0], P[1], 1, C.sun, 13); tag(E, P[0] + 24, P[1] - 12, 'θ', 1, C.sun, 40, 'start');
    if (t > 103.6) { ray(E, cx, cy, R, b, 1, C.coral, 8); dot(E, Q[0], Q[1], 1, C.coral, 13); tag(E, Q[0] + 24, Q[1] + 40, '−θ', 1, C.coral, 40, 'start'); arcDeg(E, cx, cy, 80, 0, b, 1, C.coral, 6, true); }
    const kx = eio(seg(t, 108.0, 108.8)), ky = eio(seg(t, 111.0, 111.8));
    if (kx > 0.01) segAB(E, [cx, cy], [P[0], cy], kx, C.mint, 12);
    if (ky > 0.01) { segAB(E, [P[0], cy], P, ky, C.sun, 10); segAB(E, [Q[0], cy], Q, ky, C.coral, 10); }
  }
  riseFormula(E, t, 98.8, 101.4, 540, 620, 50, ['cos 240°', '=', '−', 'cos 60°', '=', '−', FR('1', '2')], { fill: C.sun });
  riseFormula(E, t, 108.2, 114.0, 540, 590, 46, ['cos(−θ)', '=', 'cos θ']);
  riseFormula(E, t, 111.2, 114.0, 540, 680, 46, ['sen(−θ)', '=', '−', 'sen θ']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Signos y', 'referencia');
  label(p, t, 6.6, 12.4, 'EL RADAR', 'un eco en 240°', 'falta su coseno');
  label(p, t, 12.8, 18.6, 'CUATRO CUADRANTES', 'I, II, III y IV', '¿una tabla para cada uno?');
  label(p, t, 19.0, 24.4, 'ESPEJOS', 'del primer cuadrante', 'solo cambia el signo');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'dos preguntas', 'y listo');
  label(p, t, 31.8, 37.8, 'LOS SIGNOS', 'cos θ = x', 'sen θ = y');
  label(p, t, 38.2, 44.2, 'I Y II', 'I: todas positivas', 'II: solo el seno');
  label(p, t, 44.6, 50.2, 'III', 'x e y negativas', 'su cociente, positivo');
  label(p, t, 50.6, 56.6, 'IV', 'solo el coseno', 'T · S · T · C');
  label(p, t, 60.0, 66.0, 'ÁNGULO DE REFERENCIA', 'el agudo', 'hasta el eje x');
  label(p, t, 66.4, 72.2, '150° · CUADRANTE II', 'le faltan 30°', 'para 180°');
  label(p, t, 72.6, 78.4, '240° · CUADRANTE III', 'se pasa 60°', 'de 180°');
  label(p, t, 78.8, 84.4, '320° · CUADRANTE IV', 'le faltan 40°', 'para la vuelta');
  label(p, t, 84.8, 90.4, 'LA REGLA', 'dos preguntas');
  label(p, t, 95.4, 101.4, 'EL ECO', 'referencia 60°', 'cuadrante III: negativo');
  label(p, t, 101.8, 107.4, 'ÁNGULOS NEGATIVOS', 'giran hacia abajo', '−θ es el reflejo de θ');
  label(p, t, 107.8, 114.0, 'PARIDAD', 'coseno: par', 'seno: impar');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SIGNOS', 'Todas · Seno · Tangente · Coseno'],
  ['REFERENCIA', 'el agudo hasta el eje x'],
  ['EL VALOR', 'lo da la referencia'],
  ['EL SIGNO', 'lo da el cuadrante'],
  ['PARIDAD', ['cos(−θ)', '=', 'cos θ']],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [3.2, 'yes'], [7.0, 'card'], [13.4, 'tile', 0], [13.8, 'tile', 1], [14.2, 'tile', 2], [14.6, 'tile', 3], [19.2, 'pop', 1], [20.0, 'line', 1.6], [24.8, 'pop', 3],
  [31.8, 'paint', 1.3], [33.0, 'pop', 1], [38.4, 'pop', 0], [39.0, 'slide', 2.0], [42.0, 'pop', 1], [44.6, 'slide', 1.0], [48.0, 'pop', 2], [50.6, 'slide', 1.0], [51.6, 'pop', 3], [54.0, 'card'], [52.4, 'pop', 3],
  [60.2, 'paint', 1.3], [60.6, 'slide', 1.0], [62.0, 'paint', .8], [66.6, 'slide', 1.0], [68.0, 'paint', .8], [68.2, 'rise'], [69.6, 'merge', 1], [72.8, 'slide', 1.0], [74.2, 'paint', .8], [74.4, 'rise'], [75.8, 'merge', 2],
  [79.0, 'slide', 1.0], [80.4, 'paint', .8], [80.6, 'rise'], [82.0, 'merge', 3], [85.0, 'card'], [88.0, 'pop', 1],
  [95.4, 'paint', 1.3], [96.0, 'paint', .8], [98.8, 'rise'], [99.2, 'yes'], [102.0, 'slide', .8], [103.6, 'slide', 1.0], [108.0, 'paint', .8], [108.2, 'rise'], [111.0, 'paint', .8], [111.2, 'rise'],
]);
FILM.NARR = [
  [0.8, 3.6, 'El radar de un barco barre el círculo.'],
  [4.0, 6.6, 'Un eco aparece a doscientos cuarenta grados.'],
  [7.0, 9.6, 'Para ubicarlo hace falta su coseno.'],
  [9.8, 12.4, 'Pero solo memorizaste ángulos hasta noventa.'],
  [12.8, 15.6, '¿Hay que aprender una tabla para cada grado?'],
  [15.8, 18.6, 'No: el círculo tiene cuatro cuartos.'],
  [19.0, 21.8, 'Y los cuatro son espejos del primero.'],
  [22.0, 24.4, 'Solo cambia el signo.'],
  [24.8, 29.0, 'Con dos preguntas sabrás cualquier valor.'],
  [31.8, 34.8, 'El coseno es la x; el seno, la y.'],
  [35.0, 37.8, 'Sus signos dependen del cuadrante.'],
  [38.2, 41.0, 'En el primero, todo es positivo.'],
  [41.2, 44.2, 'En el segundo, x negativa: solo el seno positivo.'],
  [44.6, 47.4, 'En el tercero, ambas negativas.'],
  [47.6, 50.2, 'Su cociente, la tangente, es positivo.'],
  [50.6, 53.6, 'En el cuarto, solo el coseno.'],
  [53.8, 56.6, 'Todas, seno, tangente, coseno.'],
  [60.0, 63.0, 'Referencia: el ángulo agudo hasta el eje x.'],
  [63.2, 66.0, 'Como un espejo, cae en el primer cuadrante.'],
  [66.4, 69.2, 'A ciento cincuenta le faltan treinta grados.'],
  [69.4, 72.2, 'Su referencia es treinta.'],
  [72.6, 75.4, 'Doscientos cuarenta pasa sesenta de ciento ochenta.'],
  [75.6, 78.4, 'Su referencia es sesenta.'],
  [78.8, 81.6, 'A trescientos veinte le faltan cuarenta.'],
  [81.8, 84.4, 'Su referencia es cuarenta.'],
  [84.8, 87.6, 'La referencia da el valor.'],
  [87.8, 90.4, 'El cuadrante, el signo.'],
  [95.4, 98.4, 'El eco: referencia sesenta, cuadrante tres.'],
  [98.6, 101.4, 'Un medio, pero negativo: menos un medio.'],
  [101.8, 104.6, 'Los ángulos negativos giran hacia abajo.'],
  [104.8, 107.4, 'Menos theta es el reflejo de theta.'],
  [107.8, 110.6, 'La x no cambia: el coseno es par.'],
  [110.8, 114.0, 'La y se voltea: el seno es impar.'],
  [115.4, 119.6, 'El coseno de doscientos cuarenta es menos un medio:'],
  [119.8, 124.4, 'el valor de sesenta, con el signo del tercer cuadrante.'],
];
