// «Forma trigonométrica de un complejo» (lección trig-151, Galaxia Polar, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): z = 3 + 4i (r = 5, θ ≈ 53.13°), la trampa −3 − 4i (misma tangente,
// θ ≈ 233.13°), los puntos sobre los ejes 5i (90°) y −2 (180°), y la vuelta 2 cis 150° = −√3 + i.
// Hilo: una nave debe ir 3 al este y 4 al norte, pero su piloto automático solo entiende rumbo y distancia.
// Sorpresa anunciada: un rumbo engaña a la calculadora. Cierre: rumbo ≈ 53.13°, distancia 5.
const POSTER = 48;
const FILM = stdFilm({
  open: { Z0: 1.7, C: [460, 960], t1: 3.8, t2: 6.0 },
  aims: ['módulo y argumento', 'la trampa', 'de vuelta'],
  stops: ['el destino', 'forma polar', 'la trampa', 'de vuelta'],
  wides: [[66.4, 68.0], [69.4, 71.0]],
  smiles: [[53.8, 55.6], [110.8, 112.6], [119.0, 135]],
});
// plano complejo: origen O, U píxeles por unidad
function cplane(p, t, t0, O, U, x0, x1, y0, y1, k = 1) {
  const ka = eio(seg(t, t0, t0 + .7)) * k; if (ka <= 0.01) return;
  for (let x = x0; x <= x1; x++) el('rect', { x: r1(O[0] + x * U - 1), y: r1(O[1] - y1 * U), width: 2, height: r1((y1 - y0) * U * ka), fill: C.n2 }, p);
  for (let y = y0; y <= y1; y++) el('rect', { x: r1(O[0] + x0 * U), y: r1(O[1] - y * U - 1), width: r1((x1 - x0) * U * ka), height: 2, fill: C.n2 }, p);
  el('rect', { x: r1(O[0] + x0 * U), y: O[1] - 3, width: r1((x1 - x0) * U * ka), height: 6, rx: 3, fill: C.mist }, p);
  el('rect', { x: O[0] - 3, y: r1(O[1] - y1 * U), width: 6, height: r1((y1 - y0) * U * ka), rx: 3, fill: C.mist }, p);
  tag(p, O[0] + x1 * U - 10, O[1] - 18, 'real', ka, C.mist, 30, 'end');
  tag(p, O[0] + 16, O[1] - y1 * U + 30, 'imaginario', ka, C.mist, 30, 'start');
}
function station(p, x, y, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  el('rect', { x: x - 90, y: y - 16, width: 60, height: 32, rx: 6, fill: C.blue }, S); el('rect', { x: x + 30, y: y - 16, width: 60, height: 32, rx: 6, fill: C.blue }, S);
  shaded(S, 'circle', { cx: x, cy: y, r: 34 }, C.cream, C.creamD, 4, 4);
}
function ship(p, x, y, deg, k, col = NEG) {
  if (k <= 0.01) return;
  const a = pc(x, y, 40 * k, deg), b = pc(x, y, 26 * k, deg + 140), c = pc(x, y, 26 * k, deg - 140);
  shaded(p, 'path', { d: `M${r1(a[0])},${r1(a[1])}L${r1(b[0])},${r1(b[1])}L${r1(c[0])},${r1(c[1])}Z` }, col[0], col[1], 3, 3);
}
const O1 = [300, 1160], U1 = 110, Z1 = [O1[0] + 3 * U1, O1[1] - 4 * U1], TH = Math.atan2(4, 3) / D2R;
function level0(G, t) {
  starField(G, 471, 160);
  const k = pop(t, 0.3) * out(t, 28.8);
  if (k <= 0.01) return fchip(G, 480, 1440, ['r'], pop(t, 24.8), ZERO, 56);
  cplane(G, t, 6.6, O1, U1, -2, 6, -1, 4.5, k);
  station(G, O1[0], O1[1], k);
  const ke = eio(seg(t, 4.2, 5.0)) * k, kn = eio(seg(t, 5.2, 6.0)) * k;
  segAB(G, O1, [O1[0] + 3 * U1 * ke, O1[1]], 1, C.mint, 8); segAB(G, [Z1[0], O1[1]], [Z1[0], O1[1] - 4 * U1 * kn], ke > .99 ? 1 : 0, C.coral, 8);
  tag(G, O1[0] + 1.5 * U1, O1[1] + 56, '3 al este', pop(t, 4.6) * k, C.mint, 36);
  tag(G, Z1[0] + 24, O1[1] - 2 * U1, '4 al norte', pop(t, 5.6) * k, C.coral, 36, 'start');
  dot(G, Z1[0], Z1[1], pop(t, 6.0) * k, C.sun, 16);
  tag(G, Z1[0] + 26, Z1[1] - 26, '3 + 4i', pop(t, 7.2) * k, C.sun, 44, 'start');
  const kr = eio(seg(t, 13.2, 14.4)) * k;
  if (kr > 0.01) { segAB(G, O1, Z1, kr, C.sun, 6); arcDeg(G, O1[0], O1[1], 100, 0, TH * kr, 1, C.cream, 6); }
  ship(G, O1[0] + 46, O1[1] - 40, kr > .5 ? TH : 90, k);
  const kp = life(t, 13.0, 24.4); if (kp > 0.01) chip(G, 540, 560, 'rumbo = ? · distancia = ?', kp, POS, C.night, 40);
  fchip(G, 480, 1440, ['r'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 56);
}
// ---------- nivel 1 · módulo y argumento ----------
function level1(G, t) {
  starField(G, 473, 90);
  fchip(G, 540, 700, ['r'], out(t, 32.4), ZERO, 56);
  cplane(G, t, 31.8, O1, U1, -2, 6, -1, 4.5);
  dot(G, Z1[0], Z1[1], 1, C.sun, 16);
  segAB(G, O1, [Z1[0], O1[1]], 1, C.mint, 7); segAB(G, [Z1[0], O1[1]], Z1, 1, C.coral, 7);
  tag(G, O1[0] + 1.5 * U1, O1[1] + 50, '3', pop(t, 32.4), C.mint, 42); tag(G, Z1[0] + 24, O1[1] - 2 * U1 + 14, '4', pop(t, 32.6), C.coral, 42, 'start');
  segAB(G, O1, Z1, eio(seg(t, 32.6, 33.6)), C.sun, 10);
  sideLab(G, O1, Z1, 'r = 5', 46, pop(t, 38.4), C.sun, 46);
  arcDeg(G, O1[0], O1[1], 110, 0, TH * eio(seg(t, 41.4, 42.4)), 1, C.cream, 7, true);
  tag(G, O1[0] + 140, O1[1] - 46, 'θ', pop(t, 42.2), C.cream, 44, 'start');
  riseFormula(G, t, 35.0, 44.2, 540, 560, 50, ['r', '=', RAD('9 + 16'), '=', '5'], { fill: C.sun });
  riseFormula(G, t, 44.8, 50.2, 540, 560, 50, ['tan θ', '=', FR('4', '3'), ':', 'θ ≈ 53.13°']);
  riseFormula(G, t, 50.8, 56.6, 540, 560, 46, ['z', '=', '5', '(cos 53.13° + i sen 53.13°)'], { fill: C.sun });
  fchip(G, 480, 1440, ['−3 − 4i'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), NEG, 50);
}
// ---------- nivel 2 · la trampa del cuadrante ----------
const O2 = [540, 1000], U2 = 90;
function level2(G, t) {
  starField(G, 475, 90);
  fchip(G, 540, 700, ['−3 − 4i'], out(t, 61.0), NEG, 50);
  const ko = 1 - eio(seg(t, 84.4, 84.8));
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 1000, ko), P = [O2[0] - 3 * U2, O2[1] + 4 * U2], Q = [O2[0] + 3 * U2, O2[1] - 4 * U2];
    cplane(S, t, 60.2, O2, U2, -5, 5, -4.6, 4.6);
    dot(S, P[0], P[1], pop(t, 60.8), C.coral, 16); tag(S, P[0] - 20, P[1] + 50, '−3 − 4i', pop(t, 61.0), C.coral, 40, 'end');
    const kw = eio(seg(t, 66.6, 67.4)) * (1 - eio(seg(t, 75.6, 76.2)));
    if (kw > 0.01) { segAB(S, O2, Q, kw, C.mist, 7); arcDeg(S, O2[0], O2[1], 90, 0, TH, kw, C.mist, 6); dot(S, Q[0], Q[1], kw, C.mist, 12); tag(S, Q[0] + 20, Q[1], '53.13°', kw, C.mist, 36, 'start'); }
    if (t > 69.4 && t < 76) badge(S, Q[0] + 60, Q[1] + 70, pop(t, 69.6), false);
    const kr = eio(seg(t, 75.8, 77.2));
    if (kr > 0.01) { segAB(S, O2, P, kr, C.sun, 8); arcDeg(S, O2[0], O2[1], 110, 0, 180 + TH * kr, kr > .02 ? 1 : 0, C.sun, 7, true); tag(S, O2[0] + 60, O2[1] - 130, '233.13°', pop(t, 78.8), C.sun, 42, 'start'); }
    if (t > 72.6) tag(S, O2[0] - 2.5 * U2, O2[1] + 2.5 * U2, 'III', pop(t, 72.8), C.mist, 50);
  }
  riseFormula(G, t, 63.4, 72.2, 540, 540, 46, ['tan θ', '=', FR('−4', '−3'), '=', FR('4', '3')]);
  const ka = pop(t, 85.0) * (1 - eio(seg(t, 90.6, 91.0)));
  if (ka > 0.01) {
    const S = scaleAt(G, 540, 1000, ka);
    cplane(S, t, 85.0, O2, U2, -5, 5, -4.6, 5.4);
    [[0, 5, '5i', '90°'], [-2, 0, '−2', '180°']].forEach(([x, y, s, a], i) => { const k = pop(t, 85.6 + i * .8), q = [O2[0] + x * U2, O2[1] - y * U2]; dot(S, q[0], q[1], k, C.mint, 15); tag(S, q[0] + (x ? -10 : 26), q[1] + (x ? -30 : 10), `${s} · ${a}`, k, C.mint, 38, x ? 'middle' : 'start'); });
  }
  fchip(G, 480, 1440, ['2 cis 150°'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 48);
}
// ---------- nivel 3 · de vuelta y la nave ----------
function level3(G, t) {
  starField(G, 477, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['2 cis 150°'], out(t, 96.0), ZERO, 48);
  const ko = 1 - eio(seg(t, 107.4, 107.8));
  if (ko > 0.01) {
    const S = scaleAt(E, 540, 1050, ko), O = [620, 1150], U = 160, P = pc(O[0], O[1], 2 * U, 150);
    cplane(S, t, 95.6, O, U, -3, 2, -1, 2);
    segAB(S, O, P, eio(seg(t, 96.4, 97.2)), C.sun, 9); dot(S, P[0], P[1], pop(t, 97.0), C.sun, 15);
    arcDeg(S, O[0], O[1], 80, 0, 150 * eio(seg(t, 96.4, 97.4)), 1, C.cream, 6, true);
    const ka = eio(seg(t, 102.0, 102.8)), kb = eio(seg(t, 105.0, 105.8));
    if (ka > 0.01) { segAB(S, O, [lerp(O[0], P[0], ka), O[1]], 1, C.mint, 9); tag(S, (O[0] + P[0]) / 2, O[1] + 56, '−√3', ka, C.mint, 44); }
    if (kb > 0.01) { segAB(S, [P[0], O[1]], [P[0], lerp(O[1], P[1], kb)], 1, C.coral, 9); tag(S, P[0] - 24, (O[1] + P[1]) / 2 + 14, '1', kb, C.coral, 44, 'end'); }
  }
  riseFormula(E, t, 102.0, 107.4, 540, 560, 44, ['2 cis 150°', '=', '−√3 + i'], { fill: C.sun });
  const kn = pop(t, 107.8);
  if (kn > 0.01) {
    cplane(E, t, 107.8, O1, U1, -2, 6, -1, 4.5, kn);
    station(E, O1[0], O1[1], kn);
    const f = eio(seg(t, 108.6, 111.4)), pos = [lerp(O1[0], Z1[0], f), lerp(O1[1], Z1[1], f)];
    segAB(E, O1, pos, 1, C.sun, 5);
    dot(E, Z1[0], Z1[1], kn, C.sun, 16); ship(E, pos[0], pos[1], TH, kn);
    if (t > 111.4) chip(E, 540, 560, 'rumbo 53.13° · distancia 5', pop(t, 111.4), MINT, C.night, 40);
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'La forma', 'polar');
  label(p, t, 6.6, 12.4, 'EL DESTINO', '3 al este, 4 al norte', 'z = 3 + 4i');
  label(p, t, 12.8, 18.6, 'EL PILOTO', 'solo entiende', 'rumbo y distancia');
  label(p, t, 19.0, 24.4, 'OTRA FORMA', 'del mismo punto', 'la forma polar');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'un rumbo engaña', 'a la calculadora');
  label(p, t, 31.8, 37.8, 'EL MÓDULO', 'la distancia', 'por Pitágoras');
  label(p, t, 38.2, 44.2, 'r = 5', 'el argumento θ', 'desde el eje real');
  label(p, t, 44.6, 50.2, 'EL ARGUMENTO', 'tan θ = 4/3', 'θ ≈ 53.13°');
  label(p, t, 50.6, 56.6, 'FORMA POLAR', 'a = r cos θ, b = r sen θ', 'z = r(cos θ + i sen θ)');
  label(p, t, 60.0, 66.0, 'OTRO DESTINO', 'z = −3 − 4i', 'la misma tangente');
  label(p, t, 66.4, 72.2, 'LA TRAMPA', 'la calculadora: 53.13°', 'apunta al revés');
  label(p, t, 72.6, 78.4, 'CUADRANTE III', 'suma media vuelta', '180° + 53.13°');
  label(p, t, 78.8, 84.4, 'θ ≈ 233.13°', 'primero el cuadrante', 'luego el ángulo');
  label(p, t, 84.8, 90.4, 'SOBRE LOS EJES', 'ángulos', 'a simple vista');
  label(p, t, 95.4, 101.4, 'DE VUELTA', 'módulo 2', 'ángulo 150°');
  label(p, t, 101.8, 107.4, 'LAS PARTES', 'a = 2 cos 150° = −√3', 'b = 2 sen 150° = 1');
  label(p, t, 107.8, 114.0, 'LA NAVE', 'rumbo ≈ 53.13°', 'distancia 5');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['MÓDULO', ['r', '=', RAD('a² + b²')]],
  ['ARGUMENTO', 'el ángulo desde el eje real'],
  ['FORMA POLAR', ['z = r(cos θ + i sen θ)']],
  ['CUIDADO', 'el cuadrante decide θ'],
  ['DE VUELTA', 'a = r cos θ, b = r sen θ'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.2, 'paint', .8], [5.2, 'paint', .8], [6.0, 'pop', 1], [7.2, 'pop', 2], [13.0, 'card'], [13.2, 'line', 1.2], [24.8, 'pop', 3],
  [31.8, 'paint', .8], [32.6, 'paint', 1.0], [35.0, 'rise'], [38.4, 'yes'], [41.4, 'slide', 1.0], [44.8, 'rise'], [50.8, 'rise'], [52.4, 'pop', 3],
  [60.2, 'paint', .8], [60.8, 'pop', 1], [63.4, 'rise'], [66.6, 'line', .8], [69.6, 'no'], [72.8, 'pop', 2], [75.8, 'slide', 1.4], [78.8, 'yes'], [85.0, 'pop'], [85.6, 'pop', 1], [86.4, 'pop', 2], [88.0, 'pop', 1],
  [95.6, 'paint', .8], [96.4, 'slide', 1.0], [102.0, 'paint', .8], [102.0, 'rise'], [105.0, 'paint', .8], [107.8, 'pop'], [108.6, 'fly', 2.8], [111.4, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una nave sale de su estación espacial.'],
  [4.0, 6.6, 'Destino: tres al este, cuatro al norte.'],
  [7.0, 9.6, 'En el plano complejo: tres más cuatro i.'],
  [9.8, 12.4, 'Pero el piloto automático no entiende eso.'],
  [12.8, 15.6, 'Solo acepta un rumbo y una distancia.'],
  [15.8, 18.6, 'Cuánto girar desde el este, y cuánto avanzar.'],
  [19.0, 21.8, 'Es otra forma de escribir el mismo punto.'],
  [22.0, 24.4, 'La forma polar.'],
  [24.8, 29.0, 'Ojo: hay un rumbo que engaña a la calculadora.'],
  [31.8, 34.8, 'La distancia es el módulo, r.'],
  [35.0, 37.8, 'Por Pitágoras: raíz de nueve más dieciséis.'],
  [38.2, 41.0, 'r vale cinco.'],
  [41.2, 44.2, 'El rumbo es el argumento, theta.'],
  [44.6, 47.4, 'Su tangente: cuatro entre tres.'],
  [47.6, 50.2, 'Theta, unos cincuenta y tres grados.'],
  [50.6, 53.6, 'a es r coseno; b es r seno…'],
  [53.8, 56.6, 'z es r por coseno más i seno.'],
  [60.0, 63.0, 'Otro destino: menos tres menos cuatro i.'],
  [63.2, 66.0, 'La tangente vuelve a ser cuatro tercios.'],
  [66.4, 69.2, 'La calculadora dice: cincuenta y tres grados.'],
  [69.4, 72.2, '¡Pero eso apunta al lado contrario!'],
  [72.6, 75.4, 'El punto está en el tercer cuadrante.'],
  [75.6, 78.4, 'Hay que sumar media vuelta.'],
  [78.8, 81.6, 'Doscientos treinta y tres grados.'],
  [81.8, 84.4, 'Primero el cuadrante, luego el ángulo.'],
  [84.8, 87.6, 'Los puntos en los ejes son los fáciles.'],
  [87.8, 90.4, 'Su ángulo se ve a simple vista.'],
  [95.4, 98.4, 'También se puede volver.'],
  [98.6, 101.4, 'Módulo dos, ángulo ciento cincuenta.'],
  [101.8, 104.6, 'a: dos por menos raíz de tres medios.'],
  [104.8, 107.4, 'b: dos por un medio, uno.'],
  [107.8, 110.6, 'Volvamos a la nave.'],
  [110.8, 114.0, 'Rumbo 53.13 grados, cinco unidades: llegó.'],
  [115.4, 119.6, 'El piloto recibió rumbo cincuenta y tres grados'],
  [119.8, 124.4, 'y distancia cinco: la forma polar de tres más cuatro i.'],
];
