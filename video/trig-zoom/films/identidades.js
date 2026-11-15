// «Identidades fundamentales» (lección trig-4, Faro de los Ángulos, video 2) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la caja fuerte de seis cerraduras con la llave cos θ = 8/17 en el
// cuadrante IV (sen θ = −15/17, tan θ = −15/8, csc −17/15, sec 17/8, cot −8/15); los cuadrados sobre los catetos del
// triángulo de la circunferencia unitaria.
// Hilo: una caja fuerte con seis cerraduras (las seis razones) y una sola llave. Sorpresa anunciada: una sola figura las
// amarra todas. Cierre: sen θ = −15/17 y se abren las seis.
const POSTER = 46;
const FILM = stdFilm({
  open: { Z0: 1.35, C: [540, 920], t1: 3.8, t2: 6.0 },
  aims: ['la figura', 'dos más', 'la caja'],
  stops: ['la caja', 'la figura', 'dos más', 'abrir'],
  wides: [[15.8, 17.4], [47.6, 49.2]],
  smiles: [[110.8, 112.6], [119.0, 135]],
});
const LOCKS = [['sen θ', '−15/17'], ['cos θ', '8/17'], ['tan θ', '−15/8'], ['csc θ', '−17/15'], ['sec θ', '17/8'], ['cot θ', '−8/15']];
function safe(p, t, cx, cy, k, open = []) {
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k);
  shaded(S, 'rect', { x: cx - 360, y: cy - 330, width: 720, height: 660, rx: 40 }, C.blue, C.blueD, 10, 10);
  el('rect', { x: cx - 320, y: cy - 290, width: 640, height: 580, rx: 26, fill: C.n3 }, S);
  LOCKS.forEach(([n, v], i) => {
    const x = cx - 200 + (i % 2) * 400 - 0, y = cy - 190 + Math.floor(i / 2) * 190, o = open[i] || 0;
    const col = o > .5 ? [C.mint, C.mintD] : [C.cream, C.creamD];
    shaded(S, 'circle', { cx: x - 90, cy: y, r: 46 }, col[0], col[1], 4, 4);
    el('rect', { x: x - 98, y: y - 10 - 20 * eo(o), width: 16, height: 34, rx: 6, fill: C.night }, S);
    text(S, x - 20, y - 6, n, { 'font-size': 40, 'font-weight': 700, fill: C.cream });
    if (o > 0.01) text(S, x - 20, y + 42, v, { 'font-size': r1(38 * Math.min(1, o)), 'font-weight': 700, fill: o > .5 ? C.mint : C.cream });
  });
}
function level0(G, t) {
  starField(G, 401, 150);
  const k = pop(t, 0.3) * out(t, 28.8), sh = 6 * wob(t, 13.0, 30, 6);
  safe(G, t, 540 + sh, 920, k, [0, eio(seg(t, 7.2, 7.8)), 0, 0, 0, 0]);
  const kp = life(t, 9.8, 24.4); if (kp > 0.01) chip(G, 470, 1350, 'pista: cuadrante IV', kp, ZERO, C.night, 44);
  const ka = eio(seg(t, 19.2, 21.0)) * k;
  if (ka > 0.01) for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { const P = [340 + (i % 2) * 400 - 90 + sh, 730 + Math.floor(i / 2) * 190], Q = [340 + (j % 2) * 400 - 90 + sh, 730 + Math.floor(j / 2) * 190]; el('line', { x1: P[0], y1: P[1], x2: r1(lerp(P[0], Q[0], ka)), y2: r1(lerp(P[1], Q[1], ka)), stroke: C.sun, 'stroke-width': 3 }, G); }
  fchip(G, 480, 1440, ['sen', SP('2'), 'θ', '+', 'cos', SP('2'), 'θ', '=', '1'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 40);
}
// ---------- nivel 1 · la identidad pitagórica ----------
function level1(G, t) {
  starField(G, 403, 90);
  fchip(G, 540, 700, ['sen', SP('2'), 'θ', '+', 'cos', SP('2'), 'θ', '=', '1'], out(t, 32.4), ZERO, 40);
  const cx = 420, cy = 980, R = 250;
  ucircle(G, t, 31.8, cx, cy, R, { col: C.n3, sw: 6, ext: 1.1 });
  const a = kf(t, [[32.4, 35], [44.8, 35], [46.4, 62], [48.4, 62], [50.0, 22], [56.6, 22]]), P = pc(cx, cy, R, a), F = [P[0], cy];
  const kq = eio(seg(t, 38.4, 39.4));
  if (kq > 0.01) {
    const c = P[0] - cx, s = cy - P[1];
    el('rect', { x: cx, y: cy + 6, width: r1(c), height: r1(c * kq), rx: 6, fill: C.mint }, G);
    el('rect', { x: r1(P[0] + 6), y: r1(P[1]), width: r1(s * kq), height: r1(s), rx: 6, fill: C.coral }, G);
    tag(G, cx + c / 2, cy + 6 + c / 2 + 14, 'cos²', kq, C.night, 36);
    tag(G, P[0] + 6 + s / 2, P[1] + s / 2 + 14, 'sen²', kq, C.night, 36);
  }
  segAB(G, [cx, cy], F, 1, C.mint, 10); segAB(G, F, P, 1, C.coral, 10); ray(G, cx, cy, R, a, 1, C.sun, 8); dot(G, P[0], P[1], 1, C.sun, 12);
  tag(G, (cx + P[0]) / 2 - 24, (cy + P[1]) / 2 - 12, '1', pop(t, 35.0), C.sun, 46, 'end');
  arcDeg(G, cx, cy, 60, 0, a, 1, C.cream, 6);
  const c = Math.cos(a * D2R) ** 2, s = Math.sin(a * D2R) ** 2;
  if (t > 44.6) { const k = pop(t, 44.8); text(G, 540, 700, `${s.toFixed(2)} + ${c.toFixed(2)} = 1.00`, { 'font-size': r1(48 * Math.min(1, k)), 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle', 'data-pass': 1 }); }
  riseFormula(G, t, 41.4, 56.6, 540, 600, 52, ['sen', SP('2'), 'θ', '+', 'cos', SP('2'), 'θ', '=', '1'], { fill: C.sun });
  fchip(G, 480, 1440, ['÷', 'cos', SP('2'), 'θ'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), MINT, 46);
}
// ---------- nivel 2 · dos identidades más y las cofunciones ----------
function level2(G, t) {
  starField(G, 405, 90);
  fchip(G, 540, 700, ['÷', 'cos', SP('2'), 'θ'], out(t, 61.0), MINT, 46);
  riseFormula(G, t, 61.4, 72.2, 540, 820, 50, [FR('sen²θ', 'cos²θ'), '+', FR('cos²θ', 'cos²θ'), '=', FR('1', 'cos²θ')]);
  riseFormula(G, t, 63.4, 72.2, 540, 980, 56, ['tan', SP('2'), 'θ', '+', '1', '=', 'sec', SP('2'), 'θ'], { fill: C.mint });
  riseFormula(G, t, 67.0, 72.2, 540, 1140, 50, [FR('sen²θ', 'sen²θ'), '+', FR('cos²θ', 'sen²θ'), '=', FR('1', 'sen²θ')]);
  riseFormula(G, t, 69.4, 72.2, 540, 1300, 56, ['1', '+', 'cot', SP('2'), 'θ', '=', 'csc', SP('2'), 'θ'], { fill: C.coral });
  const kt = pop(t, 72.6) * (1 - eio(seg(t, 84.4, 84.8)));
  if (kt > 0.01) {
    const S = scaleAt(G, 540, 1020, kt), A = [180, 1180], B = [880, 1180], Cc = [880, 780], sw = eio(seg(t, 79.0, 80.0));
    tri(S, [A, B, Cc], 1, C.n2, [C.cream, C.cream, C.sun], 8);
    rightMark(S, B, A, Cc, 36, 1, C.mist);
    angMark(S, A, B, Cc, 130, 1, C.cream, 'θ', 42);
    angMark(S, Cc, A, B, 90, eio(seg(t, 75.8, 76.6)), C.cream, ['90° − θ'], 36);
    segAB(S, B, Cc, 1, sw > .5 ? C.mint : C.coral, 10); segAB(S, A, B, 1, sw > .5 ? C.coral : C.mint, 10);
    sideLab(S, B, Cc, sw > .5 ? 'ady' : 'op', -46, 1, sw > .5 ? C.mint : C.coral, 40);
    sideLab(S, A, B, sw > .5 ? 'op' : 'ady', -44, 1, sw > .5 ? C.coral : C.mint, 40);
  }
  riseFormula(G, t, 81.8, 84.4, 540, 680, 50, ['sen(90° − θ)', '=', 'cos θ']);
  fchip(G, 480, 1440, ['cos θ', '=', FR('8', '17')], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 46);
}
// ---------- nivel 3 · abrir la caja ----------
function level3(G, t) {
  starField(G, 407, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['cos θ', '=', FR('8', '17')], out(t, 96.0), ZERO, 46);
  riseFormula(E, t, 96.4, 101.4, 540, 640, 46, ['sen', SP('2'), 'θ', '=', '1', '−', FR('64', '289'), '=', FR('225', '289')]);
  riseFormula(E, t, 101.8, 110.6, 540, 640, 50, ['sen θ', '=', '−', FR('15', '17')], { fill: C.coral });
  const o = [eio(seg(t, 102.4, 103.0)), 1, eio(seg(t, 105.0, 105.6)), eio(seg(t, 108.0, 108.6)), eio(seg(t, 108.6, 109.2)), eio(seg(t, 109.2, 109.8))];
  safe(E, t, 540, 1050, pop(t, 95.6) * .95, o);
  if (t > 110.6) { const k = pop(t, 110.8); if (k > 0.01) chip(E, 540, 640, '¡abierta!', k, MINT, C.night, 50); }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Identidades', 'fundamentales', 900);
  label(p, t, 6.6, 12.4, 'LA CAJA FUERTE', 'seis cerraduras', 'una llave: cos θ = 8/17');
  label(p, t, 12.8, 18.6, 'LA PISTA', 'cuadrante IV', '¿alcanza?');
  label(p, t, 19.0, 24.4, 'AMARRADAS', 'las seis razones', 'dependen unas de otras');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'una sola figura', 'las amarra todas');
  label(p, t, 31.8, 37.8, 'EL TRIÁNGULO', 'catetos: cos θ y sen θ', 'hipotenusa: 1');
  label(p, t, 38.2, 44.2, 'PITÁGORAS', 'los cuadrados', 'de los catetos suman 1');
  label(p, t, 44.6, 50.2, 'GIRA θ', 'los cuadrados cambian', 'la suma no');
  label(p, t, 50.6, 56.6, 'IDENTIDAD', 'vale para todo θ', 'no solo para uno');
  label(p, t, 60.0, 66.0, '÷ cos²θ', 'tan² θ + 1', '= sec² θ');
  label(p, t, 66.4, 72.2, '÷ sen²θ', '1 + cot² θ', '= csc² θ');
  label(p, t, 72.6, 78.4, 'COMPLEMENTARIOS', 'θ y 90° − θ', 'suman 90°');
  label(p, t, 78.8, 84.4, 'COFUNCIONES', 'opuesto y adyacente', 'se intercambian');
  label(p, t, 84.8, 90.4, 'LAS AMARRAS', 'listas', 'abramos la caja');
  label(p, t, 95.4, 101.4, 'DESPEJA', 'sen² θ = 1 − cos² θ', 'sen θ = ± 15/17');
  label(p, t, 101.8, 107.4, 'EL SIGNO', 'cuadrante IV', 'seno negativo');
  label(p, t, 107.8, 114.0, 'LAS SEIS', 'las recíprocas', 'salen volteando');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['PITAGÓRICA', ['sen', SP('2'), 'θ', '+', 'cos', SP('2'), 'θ', '=', '1']],
  ['ENTRE cos²', ['tan', SP('2'), 'θ', '+', '1', '=', 'sec', SP('2'), 'θ']],
  ['ENTRE sen²', ['1', '+', 'cot', SP('2'), 'θ', '=', 'csc', SP('2'), 'θ']],
  ['COFUNCIONES', ['sen(90° − θ)', '=', 'cos θ']],
  ['EL SIGNO', 'lo decide el cuadrante'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [7.2, 'yes'], [9.8, 'card'], [13.0, 'hit'], [19.2, 'line', 1.8], [24.8, 'pop', 3],
  [31.8, 'paint', 1.0], [35.0, 'pop', 1], [38.4, 'paint', 1.0], [41.4, 'rise'], [44.8, 'slide', 1.6], [48.4, 'slide', 1.6], [52.4, 'pop', 3],
  [61.4, 'rise'], [63.4, 'rise'], [63.8, 'yes'], [67.0, 'rise'], [69.4, 'rise'], [69.8, 'yes'], [72.6, 'pop'], [75.8, 'paint', .8], [79.0, 'merge', 1], [79.5, 'merge', 2], [81.8, 'rise'], [88.0, 'pop', 1],
  [95.6, 'pop'], [96.4, 'rise'], [101.8, 'rise'], [102.4, 'yes'], [105.0, 'yes'], [108.0, 'count', 0], [108.6, 'count', 1], [109.2, 'count', 2], [110.8, 'card'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Una caja fuerte tiene seis cerraduras.'],
  [4.0, 6.6, 'Seno, coseno, tangente, y sus tres parejas.'],
  [7.0, 9.6, 'Solo hay una llave: coseno, ocho diecisieteavos.'],
  [9.8, 12.4, 'Y una pista: cuadrante cuatro.'],
  [12.8, 15.6, '¿Se pueden abrir las otras cinco?'],
  [15.8, 18.6, 'Parece imposible: falta información.'],
  [19.0, 21.8, 'Pero las seis razones están amarradas.'],
  [22.0, 24.4, 'Las une una sola figura.'],
  [24.8, 29.0, 'Una figura que conoces muy bien.'],
  [31.8, 34.8, 'En la circunferencia unitaria, mira el triángulo.'],
  [35.0, 37.8, 'Catetos: coseno y seno. Hipotenusa: uno.'],
  [38.2, 41.0, 'Por Pitágoras, sus cuadrados suman uno.'],
  [41.2, 44.2, 'Seno cuadrado más coseno cuadrado, igual a uno.'],
  [44.6, 47.4, 'Gira el ángulo: los cuadrados cambian…'],
  [47.6, 50.2, 'pero su suma sigue siendo uno.'],
  [50.6, 53.6, 'Vale para cualquier ángulo: es una identidad.'],
  [53.8, 56.6, 'Divídela y nacen dos más.'],
  [60.0, 63.0, 'Divide todo entre coseno cuadrado.'],
  [63.2, 66.0, 'Tangente cuadrado más uno: secante cuadrado.'],
  [66.4, 69.2, 'Divide entre seno cuadrado:'],
  [69.4, 72.2, 'uno más cotangente cuadrado: cosecante cuadrado.'],
  [72.6, 75.4, 'Y un regalo del triángulo rectángulo:'],
  [75.6, 78.4, 'sus dos ángulos agudos suman noventa.'],
  [78.8, 81.6, 'El opuesto de uno es adyacente del otro.'],
  [81.8, 84.4, 'Seno de noventa menos theta: coseno de theta.'],
  [84.8, 87.6, 'Ya tenemos todas las amarras.'],
  [87.8, 90.4, 'Abramos la caja.'],
  [95.4, 98.4, 'Seno cuadrado: uno menos 64 sobre 289.'],
  [98.6, 101.4, 'Raíz: más o menos quince diecisieteavos.'],
  [101.8, 104.6, 'En el cuarto cuadrante, el seno es negativo.'],
  [104.8, 107.4, 'Tangente: menos quince octavos.'],
  [107.8, 110.6, 'Las recíprocas salen volteando.'],
  [110.8, 114.0, 'Seis cerraduras, una sola llave.'],
  [115.4, 119.6, 'Con coseno ocho diecisieteavos en el cuarto cuadrante,'],
  [119.8, 124.4, 'el seno es menos quince diecisieteavos: se abren las seis.'],
];
