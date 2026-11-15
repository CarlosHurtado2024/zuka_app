// «Ley de cosenos y área» (lección trig-46b, Faro de los Ángulos, video 8) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): el túnel bajo la montaña visto desde un punto a 5 km y 8 km con 60° entre
// las visuales (c² = 89 − 40 = 49, c = 7 km), el ángulo frente al lado 5 (cos B = 88/112, B ≈ 38.2°) y el área del
// triángulo 5-7-8 (½ · 5 · 8 · sen 60° = 10√3 ≈ 17.32 km², y con semiperímetro 10: √300).
// Hilo: ¿qué tan largo será el túnel? No se puede medir a través de la roca. Sorpresa anunciada: un Pitágoras con
// corrección (y el túnel mide 7 km exactos). Cierre: siete kilómetros sin atravesar la roca.
const POSTER = 70;
const FILM = stdFilm({
  open: { Z0: 1.6, C: [460, 1000], t1: 3.8, t2: 6.0 },
  aims: ['la corrección', 'el túnel', 'el área'],
  stops: ['el túnel', 'la ley', 'al revés', 'el área'],
  wides: [[69.4, 71.0], [110.8, 112.4]],
  smiles: [[69.4, 71.6], [119.0, 135]],
});
const PX = 75, OO = [420, 1290], AA = pc(OO[0], OO[1], 5 * PX, 120), BB = pc(OO[0], OO[1], 8 * PX, 60);
function tunnelScene(p, t, k, dig = 0) {
  if (k <= 0.01) return;
  const S = scaleAt(p, 540, 1000, k), m = [(AA[0] + BB[0]) / 2, (AA[1] + BB[1]) / 2];
  el('path', { d: `M-200,${AA[1] + 80}L${AA[0] - 40},${AA[1] + 20}L${m[0] - 120},${m[1] - 190}L${m[0] + 40},${m[1] - 260}L${m[0] + 200},${m[1] - 160}L${BB[0] + 60},${BB[1] + 10}L1280,${BB[1] + 120}L1280,1500L-200,1500Z`, fill: C.blueD }, S);
  el('path', { d: `M${m[0] - 20},${m[1] - 220}L${m[0] + 40},${m[1] - 260}L${m[0] + 90},${m[1] - 200}Z`, fill: C.cream }, S);
  el('rect', { x: -200, y: 1200, width: 1480, height: 400, fill: C.mintD }, S);
  for (const q of [AA, BB]) el('path', { d: `M${q[0] - 30},${q[1] + 20}A30,30 0 0 1 ${q[0] + 30},${q[1] + 20}Z`, fill: C.night }, S);
  if (dig > 0.01) { el('line', { x1: AA[0], y1: AA[1], x2: r1(lerp(AA[0], BB[0], dig)), y2: r1(lerp(AA[1], BB[1], dig)), stroke: C.sun, 'stroke-width': 10, 'stroke-dasharray': '18 10', 'stroke-linecap': 'round' }, S); }
  shaded(S, 'circle', { cx: OO[0], cy: OO[1] - 40, r: 22 }, C.cream, C.creamD, 3, 3);
  shaded(S, 'rect', { x: OO[0] - 22, y: OO[1] - 20, width: 44, height: 60, rx: 14 }, C.coral, C.coralD, 3, 3);
}
function level0(G, t) {
  starField(G, 461, 150);
  const k = pop(t, 0.3) * out(t, 28.8);
  tunnelScene(G, t, k, eio(seg(t, 4.0, 5.6)) * (1 - eio(seg(t, 7.0, 7.4))));
  if (k > 0.01) {
    if (t > 7.0 && t < 9.6) badge(G, (AA[0] + BB[0]) / 2, (AA[1] + BB[1]) / 2, pop(t, 7.2), false);
    const k1 = eio(seg(t, 10.0, 10.8)) * k;
    segAB(G, OO, AA, k1, C.coral, 6); segAB(G, OO, BB, k1, C.mint, 6);
    sideLab(G, OO, AA, '5 km', 46, pop(t, 12.8) * k, C.coral, 42); sideLab(G, OO, BB, '8 km', -46, pop(t, 13.6) * k, C.mint, 42);
    angMark(G, OO, AA, BB, 110, eio(seg(t, 15.8, 16.4)) * k, C.sun, '60°', 40);
    if (t > 19.0) { el('line', { x1: AA[0], y1: AA[1], x2: BB[0], y2: BB[1], stroke: C.cream, 'stroke-width': 4, 'stroke-dasharray': '10 12' }, G); sideLab(G, AA, BB, 'c = ?', 40, pop(t, 19.4) * k, C.cream, 46); }
  }
  fchip(G, 480, 1440, ['c', SP('2')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 56);
}
// ---------- nivel 1 · la ley de cosenos ----------
function level1(G, t) {
  starField(G, 463, 90);
  fchip(G, 540, 700, ['c', SP('2')], out(t, 32.4), ZERO, 56);
  const V = [240, 1180], a = 330, b = 470, Cang = kf(t, [[32.0, 90], [38.2, 90], [39.4, 130], [41.6, 130], [42.8, 50], [45.0, 50], [46.2, 90], [56.6, 90]]);
  const P1 = [V[0] + b, V[1]], P2 = pc(V[0], V[1], a, Cang), c = Math.hypot(P1[0] - P2[0], P1[1] - P2[1]);
  tri(G, [V, P1, P2], pop(t, 31.8), C.n2, [C.mint, C.sun, C.coral], 8);
  if (Math.abs(Cang - 90) < .5) rightMark(G, V, P1, P2, 34, 1, C.mist); else angMark(G, V, P1, P2, 70, 1, C.cream, [90, 130, 50].includes(Math.round(Cang * 100) / 100) ? Math.round(Cang) + '°' : null, 34);
  sideLab(G, V, P1, 'b', -44, pop(t, 32.2), C.mint, 46); sideLab(G, V, P2, 'a', 44, pop(t, 32.4), C.coral, 46); sideLab(G, P1, P2, 'c', -44, pop(t, 32.6), C.sun, 46);
  // barras: c² frente a a² + b²
  const sc = 1 / 900, X = 120, Y = 1320, ka = pop(t, 35.0);
  if (ka > 0.01) {
    el('rect', { x: X, y: Y, width: r1(a * a * sc * ka), height: 34, rx: 8, fill: C.coral }, G);
    el('rect', { x: r1(X + a * a * sc * ka), y: Y, width: r1(b * b * sc * ka), height: 34, rx: 8, fill: C.mint }, G);
    el('rect', { x: X, y: Y + 50, width: r1(c * c * sc * ka), height: 34, rx: 8, fill: C.sun }, G);
    text(G, X, Y - 14, 'a² + b²', { 'font-size': 32, 'font-weight': 600, fill: C.mist });
    text(G, X, Y + 124, 'c²', { 'font-size': 32, 'font-weight': 600, fill: C.sun });
  }
  riseFormula(G, t, 35.0, 37.8, 540, 600, 54, ['c', SP('2'), '=', 'a', SP('2'), '+', 'b', SP('2')]);
  riseFormula(G, t, 45.0, 56.6, 540, 600, 50, ['c', SP('2'), '=', 'a', SP('2'), '+', 'b', SP('2'), '−', '2ab', '·', 'cos C'], { fill: C.sun });
  fchip(G, 480, 1440, ['5, 8, 60°'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), MINT, 46);
}
// ---------- nivel 2 · el túnel y al revés ----------
function level2(G, t) {
  starField(G, 465, 90);
  fchip(G, 540, 700, ['5, 8, 60°'], out(t, 61.0), MINT, 46);
  const ko = 1 - eio(seg(t, 90.6, 91.0)); if (ko <= 0.01) return fchip(G, 480, 1440, ['área'], pop(t, 88.0), ZERO, 52);
  const S = scaleAt(G, 540, 1000, ko);
  tunnelScene(S, t, pop(t, 60.2) * .9, eio(seg(t, 69.4, 71.0)));
  tri(S, [OO, AA, BB], 1, 'none', [C.coral, C.sun, C.mint], 5);
  if (t > 71.0) sideLab(S, AA, BB, '7 km', 44, pop(t, 71.0), C.sun, 50);
  if (t > 78.8) angMark(S, BB, OO, AA, 90, eio(seg(t, 79.0, 79.8)), C.cream, '38.2°', 34);
  riseFormula(G, t, 61.0, 72.2, 540, 510, 42, ['c', SP('2'), '=', '25 + 64', '−', '2 · 5 · 8 · ½']);
  riseFormula(G, t, 66.6, 72.2, 540, 600, 50, ['c', SP('2'), '=', '89 − 40', '=', '49'], { fill: C.sun });
  riseFormula(G, t, 75.8, 90.4, 540, 510, 42, ['cos B', '=', FR('8² + 7² − 5²', '2 · 8 · 7')]);
  riseFormula(G, t, 79.0, 90.4, 540, 610, 42, ['=', FR('88', '112'), '≈', '0.786', ':', 'B ≈ 38.2°'], { fill: C.mint });
  fchip(G, 480, 1440, ['área'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 52);
}
// ---------- nivel 3 · el área ----------
function level3(G, t) {
  starField(G, 467, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['área'], out(t, 96.0), ZERO, 52);
  const k = pop(t, 95.6);
  if (k > 0.01) {
    const S = scaleAt(E, 540, 1060, k);
    poly(S, [OO, AA, BB], eio(seg(t, 96.0, 96.8)), C.mintD);
    tri(S, [OO, AA, BB], 1, 'none', [C.coral, C.sun, C.mint], 6);
    sideLab(S, OO, AA, '5', 40, 1, C.coral, 44); sideLab(S, OO, BB, '8', -40, 1, C.mint, 44); sideLab(S, AA, BB, '7', 40, 1, C.sun, 44);
    angMark(S, OO, AA, BB, 90, 1, C.cream, '60°', 34);
  }
  riseFormula(E, t, 96.4, 113.8, 540, 520, 44, ['A', '=', FR('1', '2'), '·', '5', '·', '8', '·', 'sen 60°', '≈', '17.32']);
  riseFormula(E, t, 107.8, 113.8, 540, 640, 42, ['s', '=', '10', ':', RAD('10 · 5 · 3 · 2'), '=', RAD('300'), '≈', '17.32'], { fill: C.mint });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Ley de cosenos', 'y área', 900);
  label(p, t, 6.6, 12.4, 'EL TÚNEL', '¿qué tan largo?', 'la roca no deja medir');
  label(p, t, 12.8, 18.6, 'DESDE UN PUNTO', '5 km y 8 km', '60° entre las visuales');
  label(p, t, 19.0, 24.4, 'LAL', 'dos lados y el ángulo', 'sin pareja opuesta');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'un Pitágoras', 'con corrección');
  label(p, t, 31.8, 37.8, 'ÁNGULO RECTO', 'c² = a² + b²', 'Pitágoras');
  label(p, t, 38.2, 44.2, 'ÁBRELO Y CIÉRRALO', 'más de 90°: c crece', 'menos de 90°: se acorta');
  label(p, t, 44.6, 50.2, 'LA CORRECCIÓN', '− 2ab · cos C', 'con 90°, vale 0');
  label(p, t, 50.6, 56.6, 'LEY DE COSENOS', 'Pitágoras', 'para cualquier ángulo');
  label(p, t, 60.0, 66.0, 'EL TÚNEL', '5² + 8² = 89', 'corrección: 40');
  label(p, t, 66.4, 72.2, 'c² = 49', 'el túnel mide', '7 km exactos');
  label(p, t, 72.6, 78.4, 'AL REVÉS', 'con tres lados', 'despeja el coseno');
  label(p, t, 78.8, 84.4, 'FRENTE AL LADO 5', 'cos = 88/112', '≈ 38.2°');
  label(p, t, 84.8, 90.4, 'ALGO MÁS', 'el área', 'del terreno');
  label(p, t, 95.4, 101.4, 'EL ÁREA', '½ · a · b · sen C', 'dos lados y su ángulo');
  label(p, t, 101.8, 107.4, 'EL TERRENO', '≈ 17.32 km²');
  label(p, t, 107.8, 114.0, 'CON TRES LADOS', 'semiperímetro s = 10', 'la misma área');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['LAL', 'ley de cosenos para el lado'],
  ['LEY DE COSENOS', ['c', SP('2'), '=', 'a', SP('2'), '+', 'b', SP('2'), '−', '2ab cos C']],
  ['LLL', 'despeja el coseno del ángulo'],
  ['ÁREA', [FR('1', '2'), 'ab', '·', 'sen C']],
  ['TRES LADOS', [RAD('s(s − a)(s − b)(s − c)')]],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.0, 'paint', 1.6], [7.2, 'no'], [10.0, 'line', .8], [12.8, 'pop', 1], [13.6, 'pop', 2], [15.8, 'paint', .6], [19.4, 'pop', 3], [24.8, 'pop', 3],
  [31.8, 'pop'], [35.0, 'rise'], [35.0, 'paint', .6], [38.2, 'slide', 1.4], [41.2, 'slide', 1.4], [44.6, 'slide', 1.4], [45.0, 'rise'], [52.4, 'pop', 3],
  [60.2, 'pop'], [61.0, 'rise'], [66.6, 'rise'], [69.4, 'paint', 1.6], [71.0, 'yes'], [75.8, 'rise'], [79.0, 'rise'], [79.0, 'paint', .8], [88.0, 'pop', 1],
  [95.6, 'pop'], [96.0, 'paint', .8], [96.4, 'rise'], [101.8, 'yes'], [107.8, 'rise'], [110.8, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Van a abrir un túnel bajo una montaña.'],
  [4.0, 6.6, '¿Qué tan largo será?'],
  [7.0, 9.6, 'La roca no deja medirlo.'],
  [9.8, 12.4, 'Desde un punto se ven las dos bocas.'],
  [12.8, 15.6, 'Una a cinco kilómetros, otra a ocho.'],
  [15.8, 18.6, 'Entre las dos visuales, sesenta grados.'],
  [19.0, 21.8, 'Dos lados y el ángulo entre ellos.'],
  [22.0, 24.4, 'La ley de senos no sirve aquí.'],
  [24.8, 29.0, 'Hace falta un Pitágoras con corrección.'],
  [31.8, 34.8, 'Si el ángulo fuera recto, sería Pitágoras.'],
  [35.0, 37.8, 'c cuadrado: a cuadrado más b cuadrado.'],
  [38.2, 41.0, 'Abre el ángulo: c crece más.'],
  [41.2, 44.2, 'Ciérralo: c se acorta.'],
  [44.6, 47.4, 'Corrección: menos dos a b coseno de C.'],
  [47.6, 50.2, 'Con noventa grados, el coseno es cero.'],
  [50.6, 53.6, 'Y vuelve a ser Pitágoras.'],
  [53.8, 56.6, 'Es la ley de cosenos.'],
  [60.0, 63.0, 'Cinco al cuadrado más ocho al cuadrado: 89.'],
  [63.2, 66.0, 'La corrección resta cuarenta.'],
  [66.4, 69.2, 'c cuadrado vale 49.'],
  [69.4, 72.2, '¡El túnel mide siete kilómetros exactos!'],
  [72.6, 75.4, 'La ley también funciona al revés.'],
  [75.6, 78.4, 'Con tres lados, despeja el coseno.'],
  [78.8, 81.6, 'El ángulo frente al lado de cinco:'],
  [81.8, 84.4, 'unos treinta y ocho grados.'],
  [84.8, 87.6, 'Y hay algo más que medir:'],
  [87.8, 90.4, 'el área del terreno.'],
  [95.4, 98.4, 'Área: un medio por dos lados por el seno.'],
  [98.6, 101.4, 'Con cinco, ocho y seno de sesenta.'],
  [101.8, 104.6, 'Unos 17.32 kilómetros cuadrados.'],
  [104.8, 107.4, 'Con los tres lados también se puede.'],
  [107.8, 110.6, 'Semiperímetro diez: raíz de trescientos.'],
  [110.8, 114.0, 'La misma área: ¡cuadra!'],
  [115.4, 119.6, 'El túnel medirá siete kilómetros,'],
  [119.8, 124.4, 'medidos sin atravesar la roca: con la ley de cosenos.'],
];
