// «Números complejos» (lección alg-23c de Zuka, Fuente de la Parábola, video 1) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios de la lección): 3² = (−3)² = 9, x² = −1, √−25 = 5i, el 2 que gira
// media vuelta con · (−1) y un cuarto de vuelta con · i, el ciclo 1 → i → −1 → −i, el punto 2 + 3i, (2 + 3i) + (2 − 4i) = 4 − i,
// (2 + i)(3 + 2i) = 4 + 7i, z = 3 + 4i con su conjugado 3 − 4i, |z| = 5, z · z̄ = 25 y 25 ÷ (3 + 4i) = 3 − 4i.
// Hilo (docs/storytelling-videos.md): Beto busca un número que al cuadrado dé −1 y en la recta no hay ninguno. La sorpresa
// anunciada: la respuesta no está en la recta, sino girando. Cierre: x = i o x = −i, un cuarto de vuelta.
// Niveles: 0 la recta no alcanza → 1 por · (−1): girar → 2 por 2 + 3i: el plano complejo → 3 por 3 + 4i: conjugado y módulo.
const POSTER = 44.0;
const SP = s => ({ sup: s });

const FILM = {
  DUR: 130, endAt: 114.2,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1385], r: 100, A: [540, 700] },
    { a: 57.4, b: 59.6, P: [540, 1460], r: 100, A: [540, 700] },
    { a: 92.6, b: 94.8, P: [540, 1480], r: 100, A: [540, 700] },
  ],
  open: { Z0: 2.3, C: [540, 900], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'girar', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'el plano', L: [330, 1560] },
    { fire: 88.6, lock: 89.2, name: 'el espejo', L: [330, 1560] },
  ],
  stops: ['la recta', 'girar', 'el plano', 'el espejo'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[22.0, 23.6], [47.6, 49.2], [119.0, 135]],
    wides: [[15.8, 17.2], [44.6, 46.0]],
    looks: [],
  },
};
// arco de circunferencia de a0 a a1 (radianes, sentido de la pantalla: y hacia abajo), dibujado hasta k, con punta
function arc(p, cx, cy, r, a0, a1, k, col = C.sun, sw = 6) {
  if (k <= 0.01) return;
  const pts = []; for (let j = 0; j <= 30; j++) { const a = lerp(a0, a1, j / 30); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  arrowLine(p, pts, k, col, sw);
}

// ---------- nivel 0 · la recta no alcanza ----------
const LX = v => 540 + v * 100;
function level0(G, t) {
  starField(G, 101, 150);
  numLine(G, t, 1.0, LX, 1000, -4, 4);
  riseFormula(G, t, 6.8, 999, 540, 700, 60, ['3', SP('2'), '=', '9'], { colors: { '9': C.mint } });
  riseFormula(G, t, 8.4, 999, 540, 790, 60, ['(−3)', SP('2'), '=', '9'], { colors: { '9': C.mint } });
  riseFormula(G, t, 10.0, 999, 540, 880, 60, ['0', SP('2'), '=', '0'], { colors: {} });
  const kn = eio(seg(t, 12.8, 13.6));
  if (kn > 0.01) el('rect', { x: LX(-4) - 50, y: 985, width: r1((LX(0) - LX(-4) + 50) * kn), height: 30, rx: 15, fill: C.coral, opacity: (.45 * kn).toFixed(2) }, G);
  tag(G, LX(-2), 1090, 'ningún cuadrado cae aquí', pop(t, 13.6), C.coral, 34);
  riseFormula(G, t, 15.8, 999, 540, 1200, 64, ['x', SP('2'), '=', '−1', '?'], { colors: { '?': C.coral, '−1': C.coral } });
  badge(G, 780, 1180, pop(t, 17.2), false);
  const ki = pop(t, 19.4);
  if (ki > 0.01) fchip(G, 540, 1290, ['i', SP('2'), '=', '−1'], ki, SKY, 50);
  tag(G, 150, 1300, '√−25 = 5i', pop(t, 22.4), C.blue, 40, 'start');
  fchip(G, 540, 1385, ['· (−1)'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), NEG, 44);
}
// ---------- nivel 1 · girar ----------
const OX = 540, OY = 1050, R = 260;
function level1(G, t) {
  starField(G, 103, 90);
  fchip(G, 540, 700, ['· (−1)'], out(t, 32.4), NEG, 44);
  const kx = eio(seg(t, 32.0, 32.6));
  if (kx > 0.01) el('rect', { x: r1(OX - 380 * kx), y: OY - 3, width: r1(760 * kx), height: 6, rx: 3, fill: C.mist }, G);
  const ky = eio(seg(t, 44.6, 45.2));
  if (ky > 0.01) el('rect', { x: OX - 3, y: r1(OY - 380 * ky), width: 6, height: r1(760 * ky), rx: 3, fill: C.mist }, G);
  el('circle', { cx: OX, cy: OY, r: r1(9 * pop(t, 32.2)), fill: C.sun }, G);
  mark(G, OX + R, OY, '2', pop(t, 32.6), C.mint, false, 44);
  // media vuelta: · (−1)
  arc(G, OX, OY, R, 0, -Math.PI, eio(seg(t, 35.2, 36.6)) * out(t, 44.2), C.coral, 6);
  mark(G, OX - R, OY, '−2', pop(t, 36.6), C.coral, false, 44);
  tag(G, OX, OY - R - 30, '· (−1): media vuelta', pop(t, 36.0) * out(t, 44.2), C.coral, 36);
  tag(G, OX, 1300, '(−1)(−1) = 1: una vuelta entera', pop(t, 40.4) * out(t, 44.2), C.cream, 36);
  // un cuarto de vuelta: · i
  arc(G, OX, OY, R, 0, -Math.PI / 2, eio(seg(t, 46.0, 46.8)), C.blue, 7);
  arc(G, OX, OY, R, -Math.PI / 2, -Math.PI, eio(seg(t, 47.6, 48.4)), C.blue, 7);
  mark(G, OX, OY - R, '', pop(t, 46.8), C.blue);
  tag(G, OX + 24, OY - R - 20, '2i', pop(t, 46.8), C.blue, 44, 'start');
  tag(G, OX + R * .78, OY - R * .78, '· i', pop(t, 46.4), C.blue, 40, 'start');
  tag(G, OX - R * .78, OY - R * .78, '· i', pop(t, 48.0), C.blue, 40, 'end');
  arc(G, OX, OY, R, -Math.PI, -1.5 * Math.PI, eio(seg(t, 53.8, 54.4)), C.blue, 7);
  arc(G, OX, OY, R, -1.5 * Math.PI, -2 * Math.PI, eio(seg(t, 54.6, 55.2)), C.blue, 7);
  tag(G, OX - 24, OY + R + 14, '−2i', pop(t, 54.4), C.blue, 40, 'end');
  tag(G, 860, 760, 'i³ = −i, i⁴ = 1', pop(t, 55.2), C.blue, 38);
  riseFormula(G, t, 50.6, 999, 540, 1360, 54, ['i · i', '=', 'i', SP('2'), '=', '−1'], { colors: { '−1': C.coral } });
  fchip(G, 540, 1460, ['2 + 3i'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 46);
}
// ---------- nivel 2 · el plano complejo ----------
const M2 = { ox: 380, oy: 1080, s: 80 };
function level2(G, t) {
  starField(G, 105, 90);
  fchip(G, 540, 700, ['2 + 3i'], out(t, 61.0), SKY, 46);
  axes(G, t, 60.2, M2, -2, 6.5, -3, 4, { nums: true, xl: 'real' });
  tag(G, M2.ox - 16, my(M2, 4) + 30, 'imaginario', pop(t, 60.8), C.mist, 30, 'end');
  const P = [mx(M2, 2), my(M2, 3)], kp = pop(t, 61.4);
  if (kp > 0.01) {
    el('rect', { x: M2.ox, y: r1(M2.oy - 2), width: r1(160 * eio(seg(t, 62.0, 62.6))), height: 6, rx: 3, fill: C.mint }, G);
    el('rect', { x: r1(P[0] - 3), y: r1(P[1]), width: 6, height: r1(240 * eio(seg(t, 62.8, 63.4))), rx: 3, fill: C.blue }, G);
    mark(G, P[0], P[1], '2 + 3i', kp, C.sun, true, 44);
  }
  // suma: (2 + 3i) + (2 − 4i)
  arrowLine(G, [[M2.ox, M2.oy], P], eio(seg(t, 72.6, 73.2)) * out(t, 78.4), C.sun, 6);
  arrowLine(G, [P, [mx(M2, 4), my(M2, -1)]], eio(seg(t, 73.6, 74.4)) * out(t, 78.4), C.coral, 6);
  mark(G, mx(M2, 4), my(M2, -1), '4 − i', pop(t, 74.6) * out(t, 78.4), C.mint, false, 42);
  riseFormula(G, t, 66.6, 75.2, 470, 1395, 46, ['2 + 2', '=', '4', ',', '3i − 4i', '=', '−i'], { colors: {} });
  riseFormula(G, t, 75.6, 78.4, 470, 1395, 44, ['(2 + 3i) + (2 − 4i)', '=', '4 − i'], { colors: { '4 − i': C.mint } });
  riseFormula(G, t, 78.8, 81.4, 470, 1395, 44, ['(2 + i)(3 + 2i)', '=', '6 + 7i + 2i', SP('2')], { colors: {} });
  riseFormula(G, t, 81.8, 999, 470, 1395, 46, ['6 + 7i − 2', '=', '4 + 7i'], { colors: { '4 + 7i': C.sun } });
  fchip(G, 540, 1480, ['3 + 4i'], pop(t, 87.8) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 46);
}
// ---------- nivel 3 · conjugado y módulo ----------
const M3 = { ox: 330, oy: 1000, s: 62 };
function level3(G, t) {
  starField(G, 107, 90);
  const ko = 1 - eio(seg(t, 114.2, 114.8)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 700, ['3 + 4i'], out(t, 96.0), ZERO, 46);
  const k1 = 1 - eio(seg(t, 107.4, 107.8));
  if (k1 > 0.01) {
    const Q = scaleAt(S, 540, 1000, k1);
    axes(Q, t, 95.6, M3, -1, 5, -5, 5, { ticks: true });
    const A = [mx(M3, 3), my(M3, 4)], B = [mx(M3, 3), my(M3, -4)];
    mark(Q, A[0], A[1], 'z = 3 + 4i', pop(t, 96.4), C.sun, true, 40);
    if (t > 102.6) { el('line', { x1: M3.ox, y1: M3.oy, x2: A[0], y2: M3.oy, stroke: C.mint, 'stroke-width': 4 }, Q); tag(Q, mx(M3, 1.5), M3.oy + 44, '3', pop(t, 102.8), C.mint, 34); tag(Q, A[0] + 16, my(M3, 2), '4', pop(t, 102.8), C.mint, 34, 'start'); }
    const kc = pop(t, 97.6);
    if (kc > 0.01) el('line', { x1: A[0], y1: A[1], x2: B[0], y2: r1(lerp(A[1], B[1], eio(seg(t, 97.6, 98.4)))), stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, Q);
    mark(Q, B[0], B[1], '3 − 4i', pop(t, 98.4), C.coral, false, 40);
    arrowLine(Q, [[M3.ox, M3.oy], A], eio(seg(t, 101.8, 102.6)), C.mint, 6);
    tag(Q, mx(M3, 1.2), my(M3, 2.6), '5', pop(t, 102.6), C.mint, 48, 'end');
    riseFormula(Q, t, 102.6, 999, 790, 880, 44, ['|z|', '=', '√(9 + 16)', '=', '5'], { colors: { '5': C.mint } });
    riseFormula(Q, t, 104.4, 999, 790, 990, 44, ['z · z̄', '=', '9 + 16', '=', '25'], { colors: {} });
    riseFormula(Q, t, 105.4, 999, 790, 1100, 40, ['25 ÷ (3 + 4i)', '=', '3 − 4i'], { colors: { '3 − 4i': C.coral } });
  }
  // vuelta a Beto
  riseFormula(S, t, 108.0, 999, 540, 900, 62, ['x', SP('2'), '=', '−1'], { colors: {} });
  riseFormula(S, t, 109.0, 999, 540, 1020, 62, ['x', '=', 'i', 'o', 'x', '=', '−i'], { colors: { i: C.blue, '−i': C.blue } });
  tag(S, 540, 1110, 'un cuarto de vuelta, hacia un lado o hacia el otro', pop(t, 110.0), C.mist, 34);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Números', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'complejos', { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.4, 'EL ACERTIJO DE BETO', 'un número que al cuadrado', 'dé −1');
  label(p, t, 12.8, 18.6, 'LA RECTA NO ALCANZA', 'todo cuadrado es positivo o 0', 'ningún número sirve');
  label(p, t, 19.0, 24.4, 'UN NÚMERO NUEVO', 'se llama i', 'i² = −1, y √−25 = 5i');
  label(p, t, 24.8, 29.0, 'UNA PISTA', 'la respuesta no está en la recta', 'está girando');
  label(p, t, 31.8, 37.8, 'POR −1', 'el 2 da media vuelta', 'y llega a −2');
  label(p, t, 38.2, 44.2, 'DOS MEDIAS VUELTAS', 'son una vuelta entera', 'por eso (−1)(−1) = 1');
  label(p, t, 44.6, 50.2, 'POR i', 'un cuarto de vuelta', 'dos cuartos: media vuelta');
  label(p, t, 50.6, 56.6, 'i · i = −1', 'cuatro cuartos: la vuelta entera', 'i³ = −i e i⁴ = 1');
  label(p, t, 60.0, 66.0, 'EL PLANO COMPLEJO', 'real a lo ancho', 'imaginario a lo alto');
  label(p, t, 66.4, 72.2, 'SUMAR Y RESTAR', 'parte real con real', 'imaginaria con imaginaria');
  label(p, t, 72.6, 78.4, 'COMO FLECHAS', 'una flecha tras otra', '(2 + 3i) + (2 − 4i) = 4 − i');
  label(p, t, 78.8, 84.4, 'MULTIPLICAR', 'como binomios', 'y cada i² se vuelve −1');
  label(p, t, 84.8, 90.4, 'UN ESPEJO', '¿qué pasa si reflejamos', 'un complejo en el eje real?');
  label(p, t, 95.4, 101.4, 'EL CONJUGADO', 'de 3 + 4i es 3 − 4i', 'cambia el signo de la i');
  label(p, t, 101.8, 107.4, 'EL MÓDULO', 'la distancia al origen: 5', 'para dividir, por el conjugado');
  label(p, t, 107.8, 114.0, 'EL ACERTIJO', 'x² = −1', 'x = i o x = −i');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['UNIDAD IMAGINARIA', ['i', SP('2'), '=', '−1']],
  ['COMPLEJO', ['a + bi', ':', 'un punto del plano']],
  ['OPERAR', 'como binomios, con i² = −1'],
  ['CONJUGADO Y MÓDULO', ['z · z̄', '=', 'a', SP('2'), '+', 'b', SP('2'), '=', '|z|', SP('2')]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 1.0, type: 'slide', d: .7 }];
  ev.push({ t: 6.8, type: 'rise' }, { t: 8.4, type: 'rise' }, { t: 10.0, type: 'rise' }, { t: 12.8, type: 'paint', d: .8 }, { t: 15.8, type: 'rise' }, { t: 17.2, type: 'no' });
  ev.push({ t: 19.4, type: 'hit' }, { t: 20.0, type: 'yes' }, { t: 22.4, type: 'pop', i: 0 }, { t: 24.8, type: 'pop', i: 1 });
  ev.push({ t: 32.6, type: 'pop', i: 0 }, { t: 35.2, type: 'fly', d: 1.4 }, { t: 36.6, type: 'pop', i: 1 }, { t: 40.4, type: 'card' });
  ev.push({ t: 44.6, type: 'slide', d: .6 }, { t: 46.0, type: 'fly', d: .8 }, { t: 46.8, type: 'pop', i: 2 }, { t: 47.6, type: 'fly', d: .8 }, { t: 48.4, type: 'yes' }, { t: 50.6, type: 'rise' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.2, type: 'slide', d: .6 }, { t: 61.4, type: 'pop', i: 0 }, { t: 62.0, type: 'count', i: 0 }, { t: 62.8, type: 'count', i: 2 });
  ev.push({ t: 66.6, type: 'rise' }, { t: 72.6, type: 'slide', d: .6 }, { t: 73.6, type: 'slide', d: .8 }, { t: 74.6, type: 'pop', i: 1 }, { t: 75.6, type: 'rise' }, { t: 53.8, type: 'fly', d: 1.4 }, { t: 81.8, type: 'rise' }, { t: 78.8, type: 'rise' }, { t: 79.4, type: 'yes' }, { t: 87.8, type: 'pop', i: 2 });
  ev.push({ t: 95.6, type: 'slide', d: .6 }, { t: 96.4, type: 'pop', i: 0 }, { t: 97.6, type: 'slide', d: .8 }, { t: 98.4, type: 'pop', i: 1 }, { t: 101.8, type: 'lasso', d: .8 });
  ev.push({ t: 102.6, type: 'rise' }, { t: 104.4, type: 'rise' }, { t: 105.4, type: 'rise' }, { t: 106.0, type: 'yes' });
  ev.push({ t: 107.4, type: 'away', d: .4 }, { t: 108.0, type: 'rise' }, { t: 109.0, type: 'rise' }, { t: 109.6, type: 'yes' });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Beto tiene un acertijo:'],
  [4.0, 6.4, 'un número cuyo cuadrado sea menos uno.'],
  [6.8, 9.6, 'Tres al cuadrado, nueve. Menos tres, también nueve.'],
  [9.8, 12.4, 'Y cero al cuadrado, cero.'],
  [12.8, 15.6, 'Ningún cuadrado cae del lado negativo.'],
  [15.8, 18.6, 'En la recta no hay respuesta.'],
  [19.0, 21.8, 'Inventemos uno: i, cuyo cuadrado es menos uno.'],
  [22.0, 24.4, 'Raíz de menos veinticinco es cinco i.'],
  [24.8, 29.0, 'Pero ¿dónde vive i? Una pista: hay que girar.'],
  [31.8, 34.8, 'Multiplicar por menos uno es girar.'],
  [35.0, 37.8, 'El dos da media vuelta: menos dos.'],
  [38.2, 41.0, 'Dos medias vueltas son una vuelta entera:'],
  [41.2, 44.2, 'por eso menos por menos da más.'],
  [44.6, 47.4, 'Multiplicar por i es un cuarto de vuelta.'],
  [47.6, 50.2, 'Dos cuartos: media vuelta.'],
  [50.6, 53.6, 'Así, i por i es menos uno.'],
  [53.8, 56.6, 'Cuatro cuartos dan la vuelta entera.'],
  [60.0, 63.0, 'Los complejos forman un plano:'],
  [63.2, 66.0, 'Dos más tres i: dos al ancho, tres arriba.'],
  [66.4, 69.2, 'Para sumar, real con real,'],
  [69.4, 72.2, 'e imaginaria con imaginaria.'],
  [72.6, 75.4, 'Es poner una flecha tras otra:'],
  [75.6, 78.4, 'llegamos a cuatro menos i.'],
  [78.8, 81.6, 'Se multiplican como binomios,'],
  [81.8, 84.4, 'y cada i cuadrado vale menos uno.'],
  [84.8, 87.6, '¿Y si reflejamos un complejo'],
  [87.8, 90.4, 'en el eje real, como en un espejo?'],
  [95.4, 98.4, 'Tres más cuatro i, reflejado,'],
  [98.6, 101.4, 'es tres menos cuatro i: su conjugado.'],
  [101.8, 104.6, 'Su distancia al origen, el módulo, es cinco.'],
  [104.8, 107.4, 'Por su conjugado da veinticinco: así se divide.'],
  [107.8, 110.6, 'El acertijo de Beto tiene respuesta:'],
  [110.8, 114.0, 'i, o menos i: los dos dan menos uno.'],
  [115.4, 119.6, 'En la recta no había ningún número así.'],
  [119.8, 124.4, 'Beto lo encontró girando: x es i, o menos i.'],
];
