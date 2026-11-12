// «Tipos de conjuntos y relaciones» (lección alg-0b de Zuka) en estilo Scale Zoom Explainer. Motor: zoomkit.js.
// Cuatro niveles: 0 tres bolsas (vacío, unitario, {∅}) → 1 dentro de la bolsita de {∅}: L las letras y V las vocales
// (subconjunto) → 2 dentro de la «o»: AMOR y ROMA, frutas y herramientas (iguales, disjuntos, se cruzan)
// → 3 dentro de la manzana compartida: toppings (conjunto de partes).
const BAG = { x: [250, 540, 830], y: 780, r: 120 };
const LC = { x: 540, y: 800, r: 330 }, VC = { x: 560, y: 760, r: 150 };                  // nivel 1
const VOWT = [['a', 470, 710], ['e', 560, 680], ['i', 650, 710], ['o', 510, 820], ['u', 610, 820]];
const CONT = [['b', 300, 620], ['m', 790, 700], ['s', 290, 880], ['t', 780, 900], ['r', 430, 1030], ['d', 650, 1040]];
const AX = i => 540 + (i - 1.5) * 150, AY = 620, RY = 800;                                // nivel 2: AMOR y ROMA
const CUPS = [[[540, 570]], [[320, 750], [540, 750], [760, 750]], [[320, 930], [540, 930], [760, 930]], [[540, 1110]]];
const CUPSET = [[[]], [['f'], ['m'], ['c']], [['f', 'm'], ['f', 'c'], ['m', 'c']], [['f', 'm', 'c']]];
const TOP = { f: ['#FF6B5E', '#E14B45'], m: ['#4D7CFE', '#3A5FD9'], c: ['#FFF4E2', '#F0DCC0'] };

const FILM = {
  DUR: 118, endAt: 107.8,
  DT: [[27.6, 29.8], [57.2, 59.4], [81.6, 83.8]],
  dives: () => [
    { a: 27.6, b: 29.8, P: [BAG.x[1], BAG.y], r: 82, A: [LC.x, LC.y] },
    { a: 57.2, b: 59.4, P: [VOWT[3][1], VOWT[3][2]], r: 50, A: [AX(1), AY] },
    { a: 81.6, b: 83.8, P: [540, 780], r: 64, A: [540, 570] },
  ],
  open: { Z0: 2.4, C: [BAG.x[0], BAG.y], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 23.7, lock: 24.3, name: 'subconjuntos', L: [470, 1220] },
    { fire: 53.6, lock: 54.2, name: 'comparar', L: [460, 1330] },
    { fire: 77.6, lock: 78.2, name: 'combinaciones', L: [470, 1320] },
  ],
  stops: ['vacío y unitario', 'subconjunto', 'iguales y disjuntos', 'partes'],
  guide: {
    blinks: [7.4, 15.2, 22.0, 33.8, 45.0, 52.6, 62.0, 70.4, 76.8, 88.0, 99.6, 112.4],
    smiles: [[13.4, 15.0], [63.6, 65.4], [94.8, 96.2], [109.0, 130]],
    wides: [[19.6, 20.6], [97.0, 98.0]],
    looks: [[19.4, 21.0, [-0.1, -1]], [49.0, 51.0, [-0.9, -0.5]]],
  },
};

// ---------- nivel 0 · tres bolsas ----------
function bag(G, x, y, r, k) {
  if (k <= 0.01) return;
  const S = scaleAt(G, x, y, k);
  el('circle', { cx: x, cy: y, r, fill: C.n2 }, S);
  el('circle', { cx: x, cy: y, r, fill: 'none', stroke: C.cream, 'stroke-width': 8 }, S);
}
function level0(G, t) {
  starField(G, 5, 160);
  halo(G, BAG.x[0], BAG.y, 170, 240);
  bag(G, BAG.x[0], BAG.y, BAG.r, 1);
  bag(G, BAG.x[1], BAG.y, BAG.r, 1);
  bag(G, BAG.x[2], BAG.y, BAG.r, 1);
  chip(G, BAG.x[1], BAG.y, 'Bogotá', pop(t, 13.0), [C.coral, C.coralD], C.night, 34);
  bag(G, BAG.x[2], BAG.y, 46, pop(t, 19.4));
  riseText(G, t, 8.0, 999, BAG.x[0], 1000, '∅ = { }', { 'font-size': 60, 'font-weight': 600 });
  riseText(G, t, 13.6, 999, BAG.x[1], 1000, '{Bogotá}', { 'font-size': 56, 'font-weight': 600 });
  riseText(G, t, 20.0, 999, BAG.x[2], 1000, '{∅}', { 'font-size': 60, 'font-weight': 600, fill: C.sun });
  badge(G, BAG.x[2] + 92, BAG.y - 92, pop(t, 21.2), true);
}

// ---------- nivel 1 · las letras y las vocales ----------
function level1(G, t) {
  starField(G, 21, 90);
  el('circle', { cx: LC.x, cy: LC.y, r: LC.r, fill: C.n2 }, G);
  el('circle', { cx: LC.x, cy: LC.y, r: LC.r, fill: 'none', stroke: C.cream, 'stroke-width': 8 }, G);
  wipeText(G, LC.x, LC.y + LC.r + 60, 'L: las letras', { 'font-size': 40, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, eo(seg(t, 30.6, 31.0)), 46);
  const kv = eio(seg(t, 33.0, 34.0));
  const kf2 = eo(seg(t, 33.8, 34.3)); if (kf2 > 0.01) el('circle', { cx: VC.x, cy: VC.y, r: r1(VC.r * kf2), fill: C.n3 }, G);
  lasso(G, VC.x, VC.y, VC.r, VC.r, kv, C.sun, 7);
  wipeText(G, VC.x, VC.y + VC.r + 46, 'V: las vocales', { 'font-size': 36, 'font-weight': 600, fill: C.sun, 'text-anchor': 'middle' }, eo(seg(t, 34.0, 34.4)), 42);
  CONT.forEach(([ch, x, y], i) => tile(G, x, y, 80, ch, pop(t, 30.0 + i * .08)));
  VOWT.forEach(([ch, x, y], i) => tile(G, x, y, 80, ch, pop(t, 30.3 + i * .08)));
  // el vacío entra en L
  if (t > 42.2) { const m = eio(seg(t, 42.2, 43.2)), x = lerp(120, 430, m), y = lerp(320, 980, m) - 120 * Math.sin(Math.PI * m), k = out(t, 47.6); if (k > 0.01) { const S = scaleAt(G, x, y, k); el('circle', { cx: r1(x), cy: r1(y), r: 34, fill: C.night }, S); el('circle', { cx: r1(x), cy: r1(y), r: 34, fill: 'none', stroke: C.sun, 'stroke-width': 6 }, S); } }
  riseFormula(G, t, 36.6, 41.8, 540, 1300, 110, ['V', { s: 'sube' }, 'L'], { fill: C.cream });
  riseFormula(G, t, 42.4, 47.6, 540, 1300, 110, ['∅', { s: 'sube' }, 'L'], { fill: C.cream });
  // {a, 7}: el 7 queda afuera de L
  const kk = life(t, 48.2, 54.0);
  if (kk > 0.01) {
    const S = scaleAt(G, 250, 1170, kk);
    el('ellipse', { cx: 250, cy: 1170, rx: 120, ry: 66, fill: 'none', stroke: C.mist, 'stroke-width': 6 }, S);
    tile(S, 205, 1170, 64, 'a', 1);
    tile(S, 295, 1170, 64, '7', 1, [C.coral, C.coralD]);
    badge(S, 360, 1110, pop(t, 49.4), false);
  }
}

// ---------- nivel 2 · iguales, disjuntos y los que se cruzan ----------
function level2(G, t) {
  starField(G, 33, 80);
  const ko = out(t, 66.4);
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 710, ko);
    'AMOR'.split('').forEach((ch, i) => tile(S, AX(i), AY, 120, ch, 1 + .15 * wob(t, 62.9 + 'ROMA'.indexOf(ch) * .12, 16, 6)));
    'ROMA'.split('').forEach((ch, i) => {
      const j = 'AMOR'.indexOf(ch), m = eio(seg(t, 62.0 + i * .12, 62.9 + i * .12));
      const k = pop(t, 60.0 + i * .1) * (1 - ei(seg(t, 62.7 + i * .12, 62.95 + i * .12)));
      tile(S, lerp(AX(i), AX(j), m), lerp(RY, AY, m) - 0 * m, 120, ch, k, [C.sun, C.sunD]);
    });
    riseFormula(S, t, 63.6, 66.2, 540, 1000, 60, ['{A, M, O, R}', '=', '{R, O, M, A}']);
  }
  // dos círculos: primero apartados, después se cruzan
  const m = eio(seg(t, 73.0, 74.2)), r = lerp(175, 220, m);
  const fx = lerp(300, 420, m), gx = lerp(780, 660, m), cy = 780;
  const kc = eio(seg(t, 66.8, 67.6));
  if (kc > 0.01) {
    const S = G;
    lasso(S, fx, cy, r, r, kc, C.mint, 7); lasso(S, gx, cy, r, r, kc, C.coral, 7);
    const kt = life(t, 67.4, 72.8);
    chip(S, lerp(300, 330, m), lerp(730, 690, m), 'guayaba', pop(t, 67.2), [C.mint, C.mintD]);
    chip(S, lerp(300, 540, m), lerp(840, 780, m), 'manzana', pop(t, 67.3), [C.mint, C.mintD]);
    chip(S, 780, 730, 'martillo', kt, [C.coral, C.coralD]);
    chip(S, 780, 840, 'serrucho', kt, [C.coral, C.coralD]);
    chip(S, 790, 780, 'lulo', pop(t, 74.2), [C.coral, C.coralD]);
    const kcap = eo(seg(t, 67.8, 68.2)) * (1 - eio(seg(t, 72.8, 73.1)));
    wipeText(S, 300, 1010, 'frutas', { 'font-size': 38, 'font-weight': 600, fill: C.mint, 'text-anchor': 'middle' }, kcap, 44);
    wipeText(S, 780, 1010, 'herramientas', { 'font-size': 38, 'font-weight': 600, fill: C.coral, 'text-anchor': 'middle' }, kcap, 44);
    riseFormula(S, t, 74.6, 78.8, 540, 1100, 50, ['F = {guayaba, manzana}'], { fill: C.mint });
    riseFormula(S, t, 75.0, 78.8, 540, 1180, 50, ['G = {manzana, lulo}'], { fill: C.coral });
  }
}

// ---------- nivel 3 · los toppings: todos los subconjuntos ----------
function cup(G, x, y, items, k) {
  if (k <= 0.01) return;
  const S = scaleAt(G, x, y, k);
  shaded(S, 'path', { d: `M${x - 70},${y - 6}L${x + 70},${y - 6}Q${x + 64},${y + 58} ${x},${y + 60}Q${x - 64},${y + 58} ${x - 70},${y - 6}Z` }, C.blue, C.blueD, 8, 8);
  el('rect', { x: x - 76, y: y - 14, width: 152, height: 14, rx: 7, fill: C.cream }, S);
  items.forEach((it, j) => { const cx = x + (j - (items.length - 1) / 2) * 40; shaded(S, 'circle', { cx: r1(cx), cy: y - 34, r: 18 }, TOP[it][0], TOP[it][1], 3, 3); });
}
function level3(G, t) {
  starField(G, 47, 90);
  const ko = 1 - eio(seg(t, 107.8, 108.4)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  const rowT = [90.0, 91.0, 92.6, 94.2];
  CUPS.forEach((row, r) => row.forEach(([x, y], j) => cup(S, x, y, CUPSET[r][j], r === 0 ? 1 : pop(t, rowT[r] + j * .2))));
  const CAP = ['ninguno', 'uno', 'dos', 'los tres'], CNT = ['1', '3', '3', '1'];
  CUPS.forEach((row, r) => {
    const y = row[0][1];
    wipeText(S, 120, y + 12, CAP[r], { 'font-size': 32, 'font-weight': 600, fill: C.mist }, eo(seg(t, rowT[r] + .2, rowT[r] + .6)), 38);
    const kc = pop(t, rowT[r] + .5); if (kc > 0.01) text(S, 950, r1(y + 20), CNT[r], { 'font-size': r1(64 * kc), 'font-weight': 700, fill: C.sun, 'text-anchor': 'middle' });
  });
  // la leyenda de toppings
  const kl = life(t, 84.4, 96.2);
  if (kl > 0.01) [['f', 'fresa'], ['m', 'mora'], ['c', 'coco']].forEach(([k, n], j) => { const x = 150 + j * 190; const L = scaleAt(S, x, 1260, kl); shaded(L, 'circle', { cx: x, cy: 1260, r: 20 }, TOP[k][0], TOP[k][1], 3, 3); text(L, x + 34, 1272, n, { 'font-size': 36, 'font-weight': 600, fill: C.cream }); });
  riseText(S, t, 96.8, 102.0, 520, 1270, '1 + 3 + 3 + 1 = 8', { 'font-size': 84, fill: C.sun });
  riseText(S, t, 102.6, 999, 520, 1270, '2 · 2 · 2 = 8', { 'font-size': 84, fill: C.sun });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(800 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Tipos de', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'conjuntos', { 'font-size': 104, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.2, 'CONJUNTO VACÍO', 'no tiene elementos', 'los meses de 32 días: ∅');
  label(p, t, 12.6, 18.4, 'CONJUNTO UNITARIO', 'tiene un solo elemento', 'la capital de Colombia');
  label(p, t, 18.8, 24.8, 'CUIDADO', '{∅} no es vacío', 'tiene un elemento: ∅');
  label(p, t, 30.4, 35.8, 'DOS CONJUNTOS', 'L: letras · V: vocales', 'V queda dentro de L');
  label(p, t, 36.2, 41.6, 'SUBCONJUNTO', 'cada vocal está en L', 'V es subconjunto de L');
  label(p, t, 42.0, 47.6, 'EL VACÍO', 'es subconjunto de todos', 'no tiene nada que falte');
  label(p, t, 48.0, 54.0, 'NO ES SUBCONJUNTO', '{a, 7}: el 7 no es letra', 'basta uno que no esté');
  label(p, t, 59.8, 66.4, 'CONJUNTOS IGUALES', 'los mismos elementos', 'letras de AMOR = de ROMA');
  label(p, t, 66.8, 72.6, 'CONJUNTOS DISJUNTOS', 'no comparten elementos', 'frutas y herramientas');
  label(p, t, 72.8, 78.8, 'SI COMPARTEN ALGUNOS', 'los círculos se cruzan', 'ni iguales ni disjuntos');
  label(p, t, 84.0, 89.6, 'TRES TOPPINGS', 'fresa, mora y coco', 'T = {f, m, c}');
  label(p, t, 89.8, 96.0, 'TODOS LOS SUBCONJUNTOS', 'por tamaños', 'de ninguno hasta los tres');
  label(p, t, 96.4, 102.0, 'CONJUNTO DE PARTES', 'P(T): 8 subconjuntos', 'el vacío y T también cuentan');
  label(p, t, 102.2, 107.6, 'OTRA FORMA DE CONTAR', 'cada topping entra o no', 'dos opciones por topping');
};
FILM.summary = (p, t) => summaryList(p, t, 108.4, 'En resumen', [
  ['VACÍO · UNITARIO', 'ningún elemento · uno solo'],
  ['SUBCONJUNTO', ['B', { s: 'sube' }, 'A', ': todo B está en A']],
  ['IGUALES', 'los mismos elementos'],
  ['DISJUNTOS', 'ningún elemento en común'],
  ['PARTES', 'P(T): todos los subconjuntos'],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  ev.push({ t: 8.0, type: 'rise' }, { t: 13.0, type: 'pop', i: 1 }, { t: 13.6, type: 'rise' }, { t: 19.4, type: 'pop', i: 2 }, { t: 20.0, type: 'rise' }, { t: 21.2, type: 'yes' });
  for (let i = 0; i < 11; i++) ev.push({ t: 30.0 + i * .08, type: 'tile', i: i % 6 });
  ev.push({ t: 33.0, type: 'lasso', d: 1.0 }, { t: 36.6, type: 'rise' }, { t: 42.2, type: 'fly', d: 1.0 }, { t: 43.2, type: 'hit' }, { t: 42.4, type: 'rise' }, { t: 48.2, type: 'pop', i: 0 }, { t: 49.4, type: 'no' });
  for (let i = 0; i < 4; i++) ev.push({ t: 60.0 + i * .1, type: 'tile', i }, { t: 62.9 + i * .12, type: 'merge', i, d: .1 });
  ev.push({ t: 62.0, type: 'fly', d: 1.0 }, { t: 63.6, type: 'rise' }, { t: 66.4, type: 'away', d: .4 }, { t: 66.8, type: 'lasso', d: .8 });
  ev.push({ t: 67.2, type: 'pop', i: 0 }, { t: 67.3, type: 'pop', i: 1 }, { t: 67.4, type: 'pop', i: 2 }, { t: 67.5, type: 'pop', i: 3 }, { t: 72.8, type: 'away', d: .4 }, { t: 73.0, type: 'slide', d: 1.2 }, { t: 74.2, type: 'pop', i: 2 }, { t: 74.6, type: 'rise' }, { t: 75.0, type: 'rise' });
  ev.push({ t: 84.4, type: 'pop', i: 0 });
  [90.0, 91.0, 91.2, 91.4, 92.6, 92.8, 93.0, 94.2].forEach((t, i) => ev.push({ t, type: 'tile', i: i % 6 }));
  [90.5, 91.5, 93.1, 94.7].forEach((t, i) => ev.push({ t, type: 'count', i }));
  ev.push({ t: 96.8, type: 'card' }, { t: 102.6, type: 'rise' }, { t: 107.8, type: 'away', d: .6 }, { t: 108.4, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 109.0 + k * .55, type: 'stop', i: k });
  ev.push({ t: 111.4, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Hay conjuntos de muchos tipos.'],
  [4.0, 6.4, 'Aquí hay tres bolsas.'],
  [6.8, 9.5, 'La primera está vacía: es el conjunto vacío.'],
  [9.7, 12.6, 'Como los meses de treinta y dos días.'],
  [12.8, 15.8, 'La segunda tiene uno solo: es un conjunto unitario.'],
  [16.0, 18.4, 'La capital de Colombia: solo Bogotá.'],
  [19.0, 21.8, 'Y la tercera guarda una bolsa vacía.'],
  [22.0, 24.8, 'Por eso no está vacía: tiene un elemento.'],
  [25.0, 27.4, 'Ahora, conjuntos dentro de otros.'],
  [30.4, 33.0, 'Este círculo es L: las letras.'],
  [33.2, 35.8, 'Dentro está V, el de las vocales.'],
  [36.2, 39.0, 'Cada vocal también es una letra.'],
  [39.2, 41.6, 'Por eso V es subconjunto de L.'],
  [42.0, 44.8, 'El vacío es subconjunto de cualquier conjunto.'],
  [45.0, 47.6, 'No tiene ningún elemento que pueda faltar.'],
  [48.0, 51.0, 'Pero a y siete juntos no caben en L.'],
  [51.2, 54.0, 'El siete no es letra, y basta uno.'],
  [54.4, 57.0, 'Ahora comparemos conjuntos.'],
  [59.8, 62.4, 'Las letras de AMOR y las de ROMA…'],
  [62.6, 66.2, 'son las mismas: son conjuntos iguales.'],
  [66.8, 69.6, 'Frutas y herramientas no comparten nada.'],
  [69.8, 72.6, 'Son conjuntos disjuntos.'],
  [73.0, 75.8, 'Si comparten algunos, los círculos se cruzan.'],
  [76.0, 78.8, 'Comparten la manzana: ni iguales ni disjuntos.'],
  [78.8, 81.4, 'Sigamos por la manzana.'],
  [84.2, 87.0, 'En la heladería hay tres toppings:'],
  [87.2, 89.6, 'fresa, mora y coco.'],
  [90.0, 93.0, 'Contemos todas las combinaciones, por tamaños.'],
  [93.2, 96.0, 'Ninguno, uno, dos o los tres.'],
  [96.6, 99.4, 'Uno, más tres, más tres, más uno: ocho.'],
  [99.6, 102.0, 'Es el conjunto de partes de T.'],
  [102.4, 105.2, 'Otra forma: cada topping entra o no.'],
  [105.4, 107.6, 'Dos por dos por dos: ocho.'],
  [108.6, 112.8, 'Vacío, unitario, subconjunto, iguales y disjuntos.'],
  [113.0, 117.0, 'Y el conjunto de partes, que reúne todos los subconjuntos.'],
];
