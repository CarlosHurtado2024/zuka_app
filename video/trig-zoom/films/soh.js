// «SOH · CAH · TOA» (lección trig-1, Mar de las Ondas, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): la cometa de 50 m de hilo con sen θ = 0.28 (triángulo 14-48-50, que es el
// 7-24-25 escalado) y el triángulo 8-15-17 para nombrar lados y razones.
// Hilo: una cometa vuela en la playa con 50 m de hilo; nadie puede subir a medir su altura.
// Sorpresa anunciada: la forma de un triángulo esconde un número (y los nombres de los catetos se intercambian según el
// ángulo). Cierre: vuela a 14 m.
const POSTER = 64;
const FILM = stdFilm({
  open: { Z0: 1.9, C: [700, 900], t1: 3.8, t2: 6.0 },
  aims: ['los lados', 'las razones', 'la altura'],
  stops: ['la cometa', 'los lados', 'las razones', 'la altura'],
  wides: [[44.6, 46.2], [9.8, 11.2]],
  smiles: [[98.6, 100.4], [110.8, 112.6], [119.0, 135]],
});
function kite(p, x, y, s, k = 1, t = 0) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  const tail = []; for (let j = 0; j <= 10; j++) tail.push([x + 10 + j * 10, y + s * 1.1 + j * 16 + 12 * Math.sin(j * .9 - t * 4)]);
  polyline(S, tail, 1, C.cream, 4);
  shaded(S, 'path', { d: `M${x},${y - s}L${x + s * .7},${y}L${x},${y + s * 1.2}L${x - s * .7},${y}Z` }, C.coral, C.coralD, 4, 4);
  capsule(S, x, y - s, x, y + s * 1.2, 4, C.cream); capsule(S, x - s * .7, y, x + s * .7, y, 4, C.cream);
}
// la playa y la cometa: hilo de 50 m, 16 px por metro (horizontal 48 m, altura 14 m)
const HAND = [170, 1180], KITE = [170 + 48 * 16, 1180 - 14 * 16];
function beach(G, t, k) {
  if (k <= 0.01) return;
  const S = scaleAt(G, 540, 1180, k);
  sea(S, t, 1290);
  el('rect', { x: -200, y: 1196, width: 1480, height: 100, rx: 30, fill: C.sunD }, S);
  el('rect', { x: -200, y: 1190, width: 1480, height: 24, rx: 12, fill: C.sun }, S);
  return S;
}
function level0(G, t) {
  starField(G, 321, 150);
  const kb = pop(t, 0.3) * (1 - eio(seg(t, 18.8, 19.2)));
  const S = beach(G, t, kb);
  if (S) {
    const sway = 6 * Math.sin(t * 1.3);
    segAB(S, HAND, [KITE[0], KITE[1] + sway], eio(seg(t, 0.6, 1.4)), C.cream, 4);
    kite(S, KITE[0], KITE[1] + sway - 30, 40, pop(t, 1.0), t);
    shaded(S, 'circle', { cx: HAND[0] - 20, cy: HAND[1] - 70, r: 26 }, C.cream, C.creamD, 3, 3);
    shaded(S, 'rect', { x: HAND[0] - 44, y: HAND[1] - 44, width: 48, height: 60, rx: 18 }, C.blue, C.blueD, 3, 3);
    const kh = eio(seg(t, 9.8, 10.6));
    if (kh > 0.01) { el('line', { x1: KITE[0], y1: HAND[1], x2: KITE[0], y2: r1(lerp(HAND[1], KITE[1], kh)), stroke: C.sun, 'stroke-width': 5, 'stroke-dasharray': '12 12' }, S); tag(S, KITE[0] + 30, (HAND[1] + KITE[1]) / 2 + 14, '?', pop(t, 10.6), C.sun, 60, 'start'); }
    tag(S, 470, 1040, '50 m', pop(t, 6.2), C.cream, 44);
    const ka = eio(seg(t, 13.0, 13.8));
    if (ka > 0.01) { arcDeg(S, HAND[0], HAND[1], 150, 0, 16.26, ka, C.sun, 7); tag(S, HAND[0] + 180, HAND[1] - 12, 'θ', ka, C.sun, 46, 'start'); }
  }
  // tres triángulos parecidos
  const kt = pop(t, 19.2) * out(t, 28.8);
  if (kt > 0.01) {
    const T = scaleAt(G, 200, 1220, kt), a = 30;
    [[780, C.n2, 21.0], [520, C.n3, 20.2], [260, C.blueD, 19.4]].forEach(([w, f, t0]) => {
      const k = pop(t, t0), h = w * Math.tan(a * D2R);
      if (k > 0.01) tri(T, [[200, 1220], [200 + w, 1220], [200 + w, 1220 - h]], k, f, [C.mint, C.coral, C.sun], 6);
    });
    arcDeg(T, 200, 1220, 110, 0, a, eio(seg(t, 21.8, 22.4)), C.cream, 7);
    tag(T, 330, 1200, 'θ', pop(t, 22.2), C.cream, 44);
  }
  fchip(G, 480, 1440, [FR('op', 'hip')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 46);
}
// ---------- nivel 1 · los lados ----------
const TA = [190, 1210], TB = [910, 1210], TC = [910, 826];        // 15-8-17 a 48 px por unidad
function level1(G, t) {
  starField(G, 323, 90);
  fchip(G, 540, 700, [FR('op', 'hip')], out(t, 32.4), ZERO, 46);
  const kt = pop(t, 31.6);
  const sw = eio(seg(t, 44.8, 45.8)) * (1 - eio(seg(t, 49.6, 50.4)));
  const sc = 1 - .3 * eio(seg(t, 51.0, 52.0));
  const T = scaleAt(G, TA[0], TA[1], sc);
  tri(T, [TA, TB, TC], kt, C.n2, [C.cream, C.cream, C.cream], 7);
  segAB(T, TC, TA, eio(seg(t, 32.6, 33.4)), C.sun, 10);
  segAB(T, TB, TC, eio(seg(t, 38.4, 39.2)) * (1 - sw) + sw * 0, C.coral, 10);
  segAB(T, TA, TB, eio(seg(t, 41.4, 42.2)) * (1 - sw), C.mint, 10);
  if (sw > 0.01) { segAB(T, TA, TB, sw, C.coral, 10); segAB(T, TB, TC, sw, C.mint, 10); }
  rightMark(T, TB, TA, TC, 40, kt, C.mist);
  const kA = eio(seg(t, 38.0, 38.6)) * (1 - sw);
  angMark(T, TA, TB, TC, 120, kA, C.cream, 'θ', 44);
  angMark(T, TC, TA, TB, 90, sw, C.cream, 'α', 44);
  sideLab(T, TC, TA, 'hipotenusa · 17', -46, pop(t, 33.2), C.sun, 40);
  if (sw < .5) { sideLab(T, TB, TC, 'opuesto · 8', -40, pop(t, 39.0) * (1 - 2 * sw), C.coral, 38); sideLab(T, TA, TB, 'adyacente · 15', -44, pop(t, 42.0) * (1 - 2 * sw), C.mint, 38); }
  else { sideLab(T, TB, TC, 'adyacente', -40, 2 * sw - 1, C.mint, 38); sideLab(T, TA, TB, 'opuesto', -44, 2 * sw - 1, C.coral, 38); }
  const kr = life(t, 52.4, 56.6);
  if (kr > 0.01) chip(G, 470, 1290, 'grande o pequeño: 8 ÷ 17 ≈ 0.47', kr, POS, C.night, 38);
  fchip(G, 480, 1440, ['SOH · CAH · TOA'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), ZERO, 40);
}
// ---------- nivel 2 · las tres razones ----------
function level2(G, t) {
  starField(G, 325, 90);
  fchip(G, 540, 700, ['SOH · CAH · TOA'], out(t, 61.0), ZERO, 40);
  const kt = pop(t, 60.0) * (1 - eio(seg(t, 84.4, 84.8)));
  if (kt > 0.01) {
    const T = scaleAt(G, 540, 1050, kt * .9);
    const which = t < 66.4 ? 0 : t < 72.6 ? 1 : t < 78.8 ? 2 : 3;
    const on = [[1, 0, 1], [0, 1, 1], [1, 1, 0], [1, 1, 1]][which];   // opuesto, adyacente, hipotenusa
    tri(T, [TA, TB, TC], 1, C.n2, [C.n3, C.n3, C.n3], 7);
    if (on[0]) segAB(T, TB, TC, 1, C.coral, 12);
    if (on[1]) segAB(T, TA, TB, 1, C.mint, 12);
    if (on[2]) segAB(T, TC, TA, 1, C.sun, 12);
    angMark(T, TA, TB, TC, 120, 1, C.cream, 'θ', 44);
    rightMark(T, TB, TA, TC, 40, 1, C.mist);
    sideLab(T, TB, TC, '8', -40, on[0], C.coral, 48); sideLab(T, TA, TB, '15', -44, on[1], C.mint, 48); sideLab(T, TC, TA, '17', -46, on[2], C.sun, 48);
  }
  const ROWS = [['sen θ', FR('op', 'hip'), FR('8', '17'), '0.47', 61.2], ['cos θ', FR('ady', 'hip'), FR('15', '17'), '0.88', 66.6], ['tan θ', FR('op', 'ady'), FR('8', '15'), '0.53', 72.8]];
  ROWS.forEach(([n, f, v, d, t0], i) => {
    riseFormula(G, t, t0, t0 + 5.6, 540, 740, 56, [n, '=', f, '=', v, '≈', d]);
  });
  if (t >= 78.8) ['SOH', 'CAH', 'TOA'].forEach((s, i) => { const k = life(t, 79.0 + i * .5, 84.4); if (k > 0.01) chip(G, 250 + i * 290, 760, s, k, [ZERO, MINT, NEG][i], C.night, 64); });
  if (t >= 78.8) ['sen', 'cos', 'tan'].forEach((s, i) => tag(G, 250 + i * 290, 870, s, life(t, 79.4 + i * .5, 84.4), C.mist, 44));
  const kp = life(t, 85.0, 92.6);
  if (kp > 0.01) { const S = beach(G, t, kp * .8); if (S) { segAB(S, HAND, KITE, 1, C.cream, 4); kite(S, KITE[0], KITE[1] - 30, 40, 1, t); } }
  fchip(G, 480, 1440, ['sen θ = 0.28'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 46);
}
// ---------- nivel 3 · la altura de la cometa ----------
function level3(G, t) {
  starField(G, 327, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['sen θ = 0.28'], out(t, 96.0), ZERO, 46);
  const S = beach(E, t, pop(t, 95.2));
  if (S) {
    segAB(S, HAND, KITE, 1, C.sun, 7);
    kite(S, KITE[0], KITE[1] - 30, 40, 1, t);
    segAB(S, [KITE[0], HAND[1]], KITE, eio(seg(t, 98.6, 99.4)), C.coral, 7);
    segAB(S, HAND, [KITE[0], HAND[1]], eio(seg(t, 102.0, 102.8)), C.mint, 7);
    arcDeg(S, HAND[0], HAND[1], 150, 0, 16.26, 1, C.cream, 6);
    tag(S, 460, 1050, '50', 1, C.sun, 44);
    tag(S, KITE[0] + 30, (HAND[1] + KITE[1]) / 2 + 14, '14', pop(t, 100.6), C.coral, 46, 'start');
    tag(S, 560, 1150, '48', pop(t, 104.6), C.mint, 44);
  }
  riseFormula(E, t, 96.6, 113.8, 540, 760, 54, ['sen θ', '=', FR('h', '50'), '=', '0.28']);
  riseFormula(E, t, 99.0, 113.8, 540, 880, 54, ['h', '=', '50', '·', '0.28', '=', '14 m'], { fill: C.coral });
  riseFormula(E, t, 102.2, 113.8, 540, 1010, 44, ['50', '·', 'cos θ', '=', '50', '·', '0.96', '=', '48 m'], { fill: C.mint });
  const kc = pop(t, 108.0);
  if (kc > 0.01) chip(E, 540, 640, '14² + 48² = 196 + 2 304 = 2 500 = 50²', kc, MINT, C.night, 36);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'SOH · CAH', '· TOA');
  label(p, t, 6.6, 12.4, 'LA COMETA', 'hilo de 50 m', '¿a qué altura vuela?');
  label(p, t, 12.8, 18.6, 'LA PISTA', 'el ángulo del hilo', 'y nada más');
  label(p, t, 19.0, 24.4, 'TRIÁNGULOS PARECIDOS', 'mismo ángulo', 'misma forma');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la forma esconde', 'un número');
  label(p, t, 31.8, 37.8, 'TRES LADOS', 'el más largo:', 'la hipotenusa');
  label(p, t, 38.2, 44.2, 'DESDE θ', 'opuesto: enfrente', 'adyacente: a su lado');
  label(p, t, 44.6, 50.2, 'SORPRESA', 'desde el otro ángulo', 'se intercambian');
  label(p, t, 50.6, 56.6, 'DIVIDE DOS LADOS', 'el tamaño desaparece', 'queda el ángulo');
  label(p, t, 60.0, 66.0, 'SOH', 'seno: opuesto', 'sobre hipotenusa');
  label(p, t, 66.4, 72.2, 'CAH', 'coseno: adyacente', 'sobre hipotenusa');
  label(p, t, 72.6, 78.4, 'TOA', 'tangente: opuesto', 'sobre adyacente');
  label(p, t, 78.8, 84.4, 'PARA RECORDAR', 'tres sílabas', 'tres razones');
  label(p, t, 84.8, 90.4, 'LA COMETA', 'su ángulo', 'tiene seno 0.28');
  label(p, t, 95.4, 101.4, 'LA ALTURA', 'seno = altura ÷ hilo', 'h = 14 m');
  label(p, t, 101.8, 107.4, 'EL SUELO', 'coseno = suelo ÷ hilo', '48 m');
  label(p, t, 107.8, 114.0, 'COMPRUEBA', 'Pitágoras', '¡cuadra!');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SENO', ['sen θ =', FR('op', 'hip')]],
  ['COSENO', ['cos θ =', FR('ady', 'hip')]],
  ['TANGENTE', ['tan θ =', FR('op', 'ady')]],
  ['EL TAMAÑO', 'no cambia las razones'],
  ['LOS NOMBRES', 'dependen del ángulo'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [0.6, 'slide', .8], [1.0, 'pop', 1], [4.0, 'pop', 2], [9.8, 'slide', .8], [10.6, 'pop', 3], [13.0, 'paint', .8],
  [19.2, 'pop'], [19.4, 'tile', 0], [20.2, 'tile', 1], [21.0, 'tile', 2], [21.8, 'paint', .6], [24.8, 'pop', 3],
  [31.6, 'pop'], [32.6, 'paint', .8], [33.2, 'pop', 1], [38.0, 'paint', .6], [38.4, 'paint', .8], [39.0, 'pop', 2], [41.4, 'paint', .8], [42.0, 'pop', 3],
  [44.8, 'merge', 1], [45.4, 'merge', 2], [51.0, 'slide', 1.0], [52.4, 'card'], [56.4, 'pop', 3],
  [60.0, 'pop'], [61.2, 'rise'], [66.6, 'rise'], [72.8, 'rise'], [79.0, 'tile', 0], [79.5, 'tile', 1], [80.0, 'tile', 2], [85.0, 'pop'], [88.0, 'pop', 1],
  [95.2, 'pop'], [96.0, 'rise'], [98.6, 'paint', .8], [99.0, 'rise'], [100.6, 'yes'], [102.0, 'paint', .8], [102.2, 'rise'], [104.6, 'pop', 2], [108.0, 'card'], [108.4, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'En la playa vuela una cometa.'],
  [4.0, 6.6, 'Su hilo mide cincuenta metros.'],
  [7.0, 9.6, '¿A qué altura vuela?'],
  [9.8, 12.4, 'Nadie puede subir a medirla.'],
  [12.8, 15.6, 'Solo sabemos el ángulo del hilo.'],
  [15.8, 18.6, 'Pista: triángulos con igual ángulo se parecen.'],
  [19.0, 21.8, 'Uno pequeño, uno mediano, uno enorme:'],
  [22.0, 24.4, 'cambian de tamaño, no de forma.'],
  [24.8, 29.0, 'Y en esa forma se esconde la respuesta.'],
  [31.8, 34.8, 'Todo triángulo rectángulo tiene tres lados.'],
  [35.0, 37.8, 'El más largo es la hipotenusa.'],
  [38.2, 41.0, 'Desde el ángulo theta, el opuesto queda enfrente.'],
  [41.2, 44.2, 'El adyacente lo toca, junto a la hipotenusa.'],
  [44.6, 47.4, 'Ojo: desde el otro ángulo, se intercambian.'],
  [47.6, 50.2, 'Los nombres dependen de dónde mires.'],
  [50.6, 53.6, 'Si divides dos lados, el tamaño desaparece.'],
  [53.8, 56.6, 'Queda un número que solo depende del ángulo.'],
  [60.0, 63.0, 'Seno: opuesto entre hipotenusa.'],
  [63.2, 66.0, 'Aquí, ocho diecisieteavos.'],
  [66.4, 69.2, 'Coseno: adyacente entre hipotenusa.'],
  [69.4, 72.2, 'Quince diecisieteavos.'],
  [72.6, 75.4, 'Tangente: opuesto entre adyacente.'],
  [75.6, 78.4, 'Ocho quinceavos.'],
  [78.8, 81.6, 'Para recordarlo: SOH, CAH, TOA.'],
  [81.8, 84.4, 'Seno, coseno y tangente, con sus lados.'],
  [84.8, 87.6, 'Volvamos a la cometa.'],
  [87.8, 90.4, 'Su ángulo tiene seno cero punto veintiocho.'],
  [95.4, 98.4, 'El seno es la altura entre el hilo.'],
  [98.6, 101.4, 'Altura: cincuenta por 0.28, catorce metros.'],
  [101.8, 104.6, 'Con el coseno, 0.96, sale el suelo:'],
  [104.8, 107.4, 'cuarenta y ocho metros.'],
  [107.8, 110.6, 'Pitágoras confirma: catorce y cuarenta y ocho…'],
  [110.8, 114.0, 'la hipotenusa da cincuenta. ¡Cuadra!'],
  [115.4, 119.6, 'La cometa vuela a catorce metros de altura,'],
  [119.8, 124.4, 'y lo supimos sin subir: con el seno de su ángulo.'],
];
