// «Las seis razones y la medición indirecta» (lección trig-42c, Mar de las Ondas, video 5) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): el triángulo 20-21-29 y sus recíprocas (csc 29/20, sec 29/21, cot 21/20),
// la antena vista a 40° desde 25 m (≈ 21 m), la boya vista con depresión de 20° desde un acantilado de 80 m (≈ 220 m) y la
// montaña vista a 30° y, mil metros más cerca, a 45° (h ≈ 1 366 m).
// Hilo: desde el mar se ve una montaña: ¿qué tan alta es? No se puede subir ni llegar a su pie.
// Sorpresa anunciada: la salida es moverse (dos ángulos, sin saber la distancia). Cierre: unos 1 366 m.
const POSTER = 100;
const FILM = stdFilm({
  open: { Z0: 1.9, C: [400, 900], t1: 3.8, t2: 6.0 },
  aims: ['seis razones', 'medir alturas', 'dos ángulos'],
  stops: ['la montaña', 'seis razones', 'medir alturas', 'dos ángulos'],
  wides: [[24.8, 26.4], [107.8, 109.4]],
  smiles: [[110.8, 112.6], [119.0, 135]],
});
const SEA = 1150, MS = 0.3, PK = [200, SEA - 1366 * MS];
const B2 = PK[0] + 1366 * MS, B1 = PK[0] + 2366 * MS;
function mountain(p, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, PK[0], SEA, k);
  el('path', { d: `M-200,${SEA}L-60,${SEA - 220}L${PK[0] - 80},${PK[1] + 90}L${PK[0]},${PK[1]}L${PK[0] + 120},${PK[1] + 150}L${PK[0] + 260},${SEA - 60}L${PK[0] + 330},${SEA}Z`, fill: C.blueD }, S);
  el('path', { d: `M${PK[0] - 50},${PK[1] + 60}L${PK[0]},${PK[1]}L${PK[0] + 60},${PK[1] + 70}L${PK[0] + 20},${PK[1] + 56}L${PK[0] - 10},${PK[1] + 80}Z`, fill: C.cream }, S);
}
function scene(G, t, k, bx) {
  if (k <= 0.01) return null;
  const S = scaleAt(G, 540, SEA, k);
  mountain(S, 1);
  sea(S, t, SEA + 10, -200, W + 200, 1, 6);
  boat(S, bx, SEA, 46, 1, NEG);
  return S;
}
function level0(G, t) {
  starField(G, 341, 150);
  const S = scene(G, t, pop(t, 0.3) * out(t, 28.8), B1);
  if (S) {
    const ka = eio(seg(t, 13.0, 13.8));
    if (ka > 0.01) { segAB(S, [B1, SEA], [lerp(B1, PK[0], ka), lerp(SEA, PK[1], ka)], 1, C.sun, 5); el('rect', { x: PK[0], y: SEA - 2, width: r1((B1 - PK[0]) * ka), height: 4, fill: C.mist }, S); angMark(S, [B1, SEA], [PK[0], SEA], PK, 130, ka, C.sun, '30°', 40); }
    const kh = eio(seg(t, 4.0, 4.8));
    if (kh > 0.01) { el('line', { x1: PK[0], y1: SEA, x2: PK[0], y2: r1(lerp(SEA, PK[1], kh)), stroke: C.coral, 'stroke-width': 5, 'stroke-dasharray': '12 12' }, S); tag(S, PK[0] + 30, (SEA + PK[1]) / 2, 'h = ?', pop(t, 4.8), C.coral, 46, 'start'); }
    const kd = eio(seg(t, 19.2, 20.0));
    if (kd > 0.01) tag(S, (PK[0] + B1) / 2, SEA + 80, 'distancia = ?', kd, C.cream, 42);
  }
  fchip(G, 480, 1440, ['csc θ', '=', FR('1', 'sen θ')], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 42);
}
// ---------- nivel 1 · las seis razones ----------
const RA = [250, 1010], RB = [796, 1010], RC = [796, 490];
function level1(G, t) {
  starField(G, 343, 90);
  fchip(G, 540, 700, ['csc θ', '=', FR('1', 'sen θ')], out(t, 32.4), ZERO, 42);
  const kt = pop(t, 32.6);
  tri(G, [RA, RB, RC], kt, C.n2, [C.mint, C.coral, C.sun], 9);
  rightMark(G, RB, RA, RC, 36, kt, C.mist);
  angMark(G, RA, RB, RC, 110, kt, C.cream, 'θ', 44);
  sideLab(G, RA, RB, '21', -44, pop(t, 33.0), C.mint, 46);
  sideLab(G, RB, RC, '20', -44, pop(t, 33.3), C.coral, 46);
  sideLab(G, RC, RA, '29', -46, pop(t, 33.6), C.sun, 46);
  const ROWS = [['sen θ', '20', '29', 'csc θ', 38.4], ['cos θ', '21', '29', 'sec θ', 44.8], ['tan θ', '20', '21', 'cot θ', 47.8]];
  ROWS.forEach(([a, n, d, b, t0], i) => {
    const y = 1110 + i * 82, k1 = pop(t, t0 - 2.4 + (i ? 2.2 : 0)), k2 = pop(t, t0), flip = eio(seg(t, t0, t0 + .6));
    if (k1 > 0.01) { tag(G, 150, y + 14, a, k1, C.cream, 44, 'start'); fracAt(G, 330, y, 40 * k1, n, d, C.cream); }
    if (k2 > 0.01) {
      tag(G, 450, y + 14, '↔', 0, C.mist, 40);
      el('rect', { x: 410, y: y - 4, width: r1(60 * k2), height: 6, rx: 3, fill: C.mist }, G);
      tag(G, 500, y + 14, b, k2, C.sun, 44, 'start'); fracAt(G, 690, y, 40 * k2, flip > .5 ? d : n, flip > .5 ? n : d, C.sun);
    }
  });
  fchip(G, 480, 1440, ['h', '=', 'd', '·', 'tan θ'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), ZERO, 46);
}
// ---------- nivel 2 · elevación y depresión ----------
function level2(G, t) {
  starField(G, 345, 90);
  fchip(G, 540, 700, ['h', '=', 'd', '·', 'tan θ'], out(t, 61.0), ZERO, 46);
  const GR = 1180;
  const ka = pop(t, 61.0) * (1 - eio(seg(t, 72.2, 72.6)));
  if (ka > 0.01) {
    const S = scaleAt(G, 540, GR, ka), x0 = 200, x1 = 200 + 25 * 24, top = [x1, GR - 21 * 24];
    el('rect', { x: 80, y: GR, width: 920, height: 10, rx: 5, fill: C.mintD }, S);
    capsule(S, x1, GR, top[0], top[1], 14, C.mist);
    for (let j = 1; j < 6; j++) capsule(S, x1 - 30 + j * 3, GR - j * 84, x1 + 30 - j * 3, GR - j * 84, 5, C.mist);
    dot(S, top[0], top[1], 1, C.coral, 12);
    shaded(S, 'circle', { cx: x0 - 10, cy: GR - 110, r: 24 }, C.cream, C.creamD, 3, 3);
    shaded(S, 'rect', { x: x0 - 32, y: GR - 84, width: 44, height: 84, rx: 16 }, C.blue, C.blueD, 3, 3);
    const kl = eio(seg(t, 66.8, 67.6));
    segAB(S, [x0, GR], [lerp(x0, top[0], kl), lerp(GR, top[1], kl)], 1, C.sun, 5);
    if (kl > 0.01) { el('rect', { x: x0, y: GR - 2, width: r1((x1 - x0) * kl), height: 4, fill: C.mist }, S); angMark(S, [x0, GR], [x1, GR], top, 130, kl, C.sun, '40°', 38); }
    tag(S, (x0 + x1) / 2, GR + 60, '25 m', pop(t, 66.6), C.cream, 42);
  }
  riseFormula(G, t, 61.4, 72.2, 540, 740, 54, ['h', '=', '25', '·', 'tan 40°', '≈', '21 m']);
  const kd = pop(t, 72.6) * (1 - eio(seg(t, 84.4, 84.8)));
  if (kd > 0.01) {
    const S = scaleAt(G, 540, 1100, kd), cl = [220, 980], bu = [220 + 220 * 2.5, 1180];
    el('path', { d: `M-100,1180L-100,${cl[1]}L${cl[0]},${cl[1]}L${cl[0] + 30},1180Z`, fill: C.blueD }, S);
    sea(S, t, 1180, -100, 1180, 1, 6);
    lighthouse(S, cl[0] - 60, cl[1], 120, 1, 1);
    dot(S, bu[0], bu[1] - 10, 1, C.coral, 16);
    el('rect', { x: cl[0] - 40, y: cl[1] - 2, width: r1((bu[0] - cl[0] + 60) * eio(seg(t, 73.4, 74.2))), height: 4, fill: C.mist }, S);
    const kl = eio(seg(t, 74.4, 75.2));
    segAB(S, cl, [lerp(cl[0], bu[0], kl), lerp(cl[1], bu[1] - 10, kl)], 1, C.sun, 5);
    angMark(S, cl, [bu[0], cl[1]], bu, 170, kl, C.sun, '20°', 38);
    const ke = eio(seg(t, 79.0, 79.8));
    if (ke > 0.01) { el('rect', { x: cl[0] - 10, y: bu[1] - 12, width: r1(bu[0] - cl[0]), height: 4, fill: C.mint }, S); angMark(S, [bu[0], bu[1] - 10], [cl[0], bu[1] - 10], cl, 150, ke, C.mint, '20°', 38); }
    tag(S, 40, (cl[1] + 1180) / 2, '80 m', pop(t, 73.0), C.cream, 40, 'start');
  }
  riseFormula(G, t, 76.0, 84.4, 540, 640, 50, ['d', '=', FR('80', 'tan 20°'), '≈', '220 m']);
  fchip(G, 480, 1440, ['30°', 'y', '45°'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 48);
}
// ---------- nivel 3 · dos ángulos ----------
function level3(G, t) {
  starField(G, 347, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['30°', 'y', '45°'], out(t, 96.0), ZERO, 48);
  const bx = lerp(B1, B2, eio(seg(t, 98.8, 100.8)));
  const S = scene(E, t, pop(t, 95.4), bx);
  if (S) {
    el('line', { x1: PK[0], y1: SEA, x2: PK[0], y2: PK[1], stroke: C.coral, 'stroke-width': 5, 'stroke-dasharray': '12 12' }, S);
    const k1 = eio(seg(t, 96.4, 97.2));
    if (k1 > 0.01) { segAB(S, [B1, SEA], PK, k1, C.sun, 5); angMark(S, [B1, SEA], [PK[0], SEA], PK, 120, k1, C.sun, '30°', 36); }
    const k2 = eio(seg(t, 101.0, 101.8));
    if (k2 > 0.01) { segAB(S, [B2, SEA], PK, k2, C.mint, 5); angMark(S, [B2, SEA], [PK[0], SEA], PK, 100, k2, C.mint, '45°', 36); }
    if (t > 100.8) { el('rect', { x: B2, y: SEA + 60, width: B1 - B2, height: 6, rx: 3, fill: C.cream }, S); tag(S, (B1 + B2) / 2, SEA + 120, '1 000 m', pop(t, 100.8), C.cream, 40); }
    tag(S, PK[0] + 30, (SEA + PK[1]) / 2, 'h', pop(t, 96.0), C.coral, 48, 'start');
  }
  riseFormula(E, t, 102.0, 113.8, 540, 520, 46, ['h', '=', 'x', '·', 'tan 45°', '=', 'x']);
  riseFormula(E, t, 104.8, 113.8, 540, 620, 46, ['h', '=', '(x + 1 000)', '·', 'tan 30°']);
  const kr = pop(t, 108.0);
  if (kr > 0.01) chip(E, 540, 1380 - 0, 'h ≈ 1 366 m', kr, ZERO, C.night, 56);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Las seis', 'razones');
  label(p, t, 6.6, 12.4, 'LA MONTAÑA', '¿qué tan alta es?', 'nadie puede subir');
  label(p, t, 12.8, 18.6, 'ELEVACIÓN', 'desde la horizontal', 'hacia arriba: 30°');
  label(p, t, 19.0, 24.4, 'EL PROBLEMA', 'falta la distancia', 'al pie de la montaña');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'la salida', 'es moverse');
  label(p, t, 31.8, 37.8, 'LAS RECÍPROCAS', 'cada razón', 'tiene su pareja');
  label(p, t, 38.2, 44.2, 'COSECANTE', 'hipotenusa ÷ opuesto', '1 ÷ seno');
  label(p, t, 44.6, 50.2, 'SECANTE Y COTANGENTE', '1 ÷ coseno', '1 ÷ tangente');
  label(p, t, 50.6, 56.6, 'SEIS RAZONES', 'tres parejas', 'voltea la fracción');
  label(p, t, 60.0, 66.0, 'MEDIR ALTURAS', 'altura = distancia', 'por tangente');
  label(p, t, 66.4, 72.2, 'UNA ANTENA', 'a 25 m se ve a 40°', 'mide unos 21 m');
  label(p, t, 72.6, 78.4, 'DEPRESIÓN', 'desde arriba', 'mirando hacia abajo');
  label(p, t, 78.8, 84.4, 'MISMO ÁNGULO', 'depresión = elevación', 'alternos entre paralelas');
  label(p, t, 84.8, 90.4, 'LA MONTAÑA', 'falta la distancia', 'usemos dos ángulos');
  label(p, t, 95.4, 101.4, 'DOS MEDIDAS', '30° desde lejos', '45° mil metros después');
  label(p, t, 101.8, 107.4, 'MISMA ALTURA', 'dos triángulos', 'una sola h');
  label(p, t, 107.8, 114.0, 'DESPEJANDO', 'x = 0.577 (x + 1 000)', 'h ≈ 1 366 m');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['RECÍPROCAS', 'csc, sec y cot: voltea'],
  ['ELEVACIÓN', 'hacia arriba desde la horizontal'],
  ['DEPRESIÓN', 'hacia abajo, misma medida'],
  ['ALTURA', ['h', '=', 'd', '·', 'tan θ']],
  ['DOS ÁNGULOS', 'sin saber la distancia'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.0, 'paint', .8], [4.8, 'pop', 1], [13.0, 'paint', .8], [19.2, 'pop', 2], [24.8, 'pop', 3],
  [32.6, 'pop'], [33.0, 'tile', 0], [33.3, 'tile', 1], [33.6, 'tile', 2], [36.0, 'pop', 0], [38.4, 'merge', 1], [44.8, 'merge', 2], [47.8, 'merge', 3], [52.4, 'pop', 3],
  [61.0, 'pop'], [61.4, 'rise'], [66.8, 'line', .8], [72.6, 'pop'], [73.4, 'slide', .8], [74.4, 'line', .8], [76.0, 'rise'], [79.0, 'paint', .8], [88.0, 'pop', 1],
  [95.4, 'pop'], [96.4, 'line', .8], [98.8, 'slide', 2.0], [100.8, 'pop', 2], [101.0, 'line', .8], [102.0, 'rise'], [104.8, 'rise'], [108.0, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Desde el mar se ve una montaña.'],
  [4.0, 6.6, '¿Qué tan alta es?'],
  [7.0, 9.6, 'No se puede subir ni llegar al pie.'],
  [9.8, 12.4, 'Solo se puede medir un ángulo.'],
  [12.8, 15.6, 'La cima se ve a treinta grados.'],
  [15.8, 18.6, 'Ese es el ángulo de elevación.'],
  [19.0, 21.8, 'Pero no sabemos a qué distancia está.'],
  [22.0, 24.4, 'Con un solo ángulo no alcanza.'],
  [24.8, 29.0, 'La salida es sorprendente: mover el barco.'],
  [31.8, 34.8, 'Seno, coseno y tangente tienen pareja.'],
  [35.0, 37.8, 'Basta voltear la fracción.'],
  [38.2, 41.0, 'Cosecante: hipotenusa entre opuesto.'],
  [41.2, 44.2, 'Es uno sobre el seno.'],
  [44.6, 47.4, 'Secante: uno sobre el coseno.'],
  [47.6, 50.2, 'Cotangente: uno sobre la tangente.'],
  [50.6, 53.6, 'Seis razones, tres parejas.'],
  [53.8, 56.6, 'Ahora, a medir lo que no se alcanza.'],
  [60.0, 63.0, 'La tangente une la altura con la distancia.'],
  [63.2, 66.0, 'Altura igual a distancia por tangente.'],
  [66.4, 69.2, 'Una antena, a 25 metros: 40°.'],
  [69.4, 72.2, 'Mide unos veintiún metros.'],
  [72.6, 75.4, 'Desde arriba se mira hacia abajo:'],
  [75.6, 78.4, 'es el ángulo de depresión.'],
  [78.8, 81.6, 'Mide lo mismo que la elevación desde abajo.'],
  [81.8, 84.4, 'Son ángulos alternos entre paralelas.'],
  [84.8, 87.6, 'Pero con la montaña falta la distancia.'],
  [87.8, 90.4, 'Usemos dos ángulos.'],
  [95.4, 98.4, 'Primer ángulo, desde lejos: treinta grados.'],
  [98.6, 101.4, 'Tras mil metros más: cuarenta y cinco.'],
  [101.8, 104.6, 'Dos triángulos con la misma altura.'],
  [104.8, 107.4, 'Igualamos las dos alturas y despejamos.'],
  [107.8, 110.6, 'La montaña mide unos 1 366 metros.'],
  [110.8, 114.0, 'Y la distancia nunca hizo falta.'],
  [115.4, 119.6, 'La montaña mide unos mil trescientos sesenta y seis metros,'],
  [119.8, 124.4, 'medida con dos ángulos y mil metros de mar.'],
];
