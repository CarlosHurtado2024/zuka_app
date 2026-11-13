// «Raíces y exponentes racionales» (lección alg-22a de Zuka, Torres de Potencias, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios del video (no salen en los ejercicios): el terreno de 25 m² (√25 = 5), la caja de 216 cm³ (∛216 = 6),
// ∛(−1 000) = −10, √(−16) no es real, 16^(1/2) = 4 y 16^(3/4) = 8, √((−5)²) = 5 = |−5|, √(36 + 64) = 10 ≠ 6 + 8.
// Hilo (docs/storytelling-videos.md): Ana tiene un terreno cuadrado y quiere cercarlo; ¿cuánto mide el lado? Cierre: compra 20 m
// de cerca. Sorpresa: el atajo por la diagonal (10) frente a rodear (14).
// Niveles: 0 deshacer (el cuadrado) → 1 por la caja: el índice → 2 por 16^(3/4): exponente fracción → 3 por √(x²): trampas.
const POSTER = 40.6;
const SQ = { x: 290, y: 600, c: 100 };

const FILM = {
  DUR: 131, endAt: 115.0,
  DT: [[29.2, 31.4], [57.4, 59.6], [92.6, 94.8]],
  dives: () => [
    { a: 29.2, b: 31.4, P: [540, 1370], r: 100, A: [540, 760] },
    { a: 57.4, b: 59.6, P: [540, 1395], r: 95, A: [540, 690] },
    { a: 92.6, b: 94.8, P: [540, 1370], r: 95, A: [540, 690] },
  ],
  open: { Z0: 2.2, C: [540, 850], t1: 3.8, t2: 6.0 },
  aim: [
    { fire: 25.2, lock: 25.8, name: 'la caja', L: [330, 1560] },
    { fire: 53.0, lock: 53.6, name: 'exponente fracción', L: [380, 1560] },
    { fire: 88.6, lock: 89.2, name: 'dos trampas', L: [330, 1560] },
  ],
  stops: ['el terreno', 'el índice', 'fracciones', 'trampas'],
  guide: {
    blinks: [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
    smiles: [[15.0, 16.6], [72.0, 73.6], [111.0, 112.6], [120.0, 135]],
    wides: [[103.4, 104.8], [44.6, 46.0]],
    looks: [],
  },
};

// ---------- piezas ----------
function cube(p, x, y, s, k, lbl) {                                     // cubo en perspectiva
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), d = s * .42;
  el('path', { d: `M${x - s / 2},${y - s / 2 + d / 2}L${x - s / 2 + d},${y - s / 2 - d / 2}L${x + s / 2 + d},${y - s / 2 - d / 2}L${x + s / 2},${y - s / 2 + d / 2}Z`, fill: C.sun }, S);
  el('path', { d: `M${x + s / 2},${y - s / 2 + d / 2}L${x + s / 2 + d},${y - s / 2 - d / 2}L${x + s / 2 + d},${y + s / 2 - d / 2}L${x + s / 2},${y + s / 2 + d / 2}Z`, fill: C.sunD }, S);
  el('rect', { x: x - s / 2, y: y - s / 2 + d / 2, width: s, height: s, fill: C.blue }, S);
  if (lbl) tag(S, x, y + d / 2 + 16, lbl, 1, C.cream, s * .22);
}

// ---------- nivel 0 · el terreno ----------
function level0(G, t) {
  starField(G, 7, 150);
  for (let i = 0; i < 25; i++) {
    const r = Math.floor(i / 5), c = i % 5, k = 1 + .12 * wob(t, 6.8 + (r + c) * .1, 14, 6);
    if (k <= 0.01) continue;
    const x = SQ.x + c * SQ.c + SQ.c / 2, y = SQ.y + r * SQ.c + SQ.c / 2, w = (SQ.c - 10) * k;
    el('rect', { x: r1(x - w / 2), y: r1(y - w / 2), width: r1(w), height: r1(w), rx: 10, fill: (r + c) % 2 ? C.mint : C.mintD }, G);
  }
  tag(G, 540, 870, '25 m²', pop(t, 8.6) * out(t, 12.6), C.night, 64);
  const kf_ = eio(seg(t, 13.0, 14.6));
  if (kf_ > 0.01) {
    el('rect', { x: SQ.x - 8, y: SQ.y - 8, width: 516, height: 516, rx: 12, fill: 'none', stroke: C.sun, 'stroke-width': 8, pathLength: 1, 'stroke-dasharray': `${kf_.toFixed(3)} 2` }, G);
    tag(G, 540, SQ.y - 30, '? m', pop(t, 13.4) * out(t, 15.8), C.sun, 46);
    tag(G, 540, SQ.y - 30, '5 m', pop(t, 16.0), C.sun, 46);
  }
  riseFormula(G, t, 16.4, 18.6, 540, 1240, 70, ['5 · 5', '=', '25']);
  riseFormula(G, t, 19.0, 24.4, 540, 1240, 76, [{ rad: '25' }, '=', '5'], { colors: { '5': C.sun } });
  riseFormula(G, t, 21.4, 24.4, 540, 1330, 46, ['porque 5', { sup: '2' }, '= 25'], { fill: C.mist });
  riseFormula(G, t, 24.8, 999, 540, 1240, 60, ['(−5)', { sup: '2' }, '= 25', ',', 'pero', { rad: '25' }, '= 5'], { colors: {} });
  cube(G, 520, 1380, 90, pop(t, 25.0) * (1 + .1 * wob(t, 25.4, 14, 6)));
}
// ---------- nivel 1 · el índice ----------
function level1(G, t) {
  starField(G, 17, 90);
  cube(G, 520, 760, 230, 1, '216 cm³');
  riseFormula(G, t, 38.2, 999, 540, 960, 62, ['6 · 6 · 6', '=', '216']);
  riseFormula(G, t, 41.2, 999, 540, 1050, 70, [{ rad: '216', idx: '3' }, '=', '6'], { colors: { '6': C.sun } });
  riseFormula(G, t, 44.6, 999, 540, 1140, 58, [{ rad: '−1 000', idx: '3' }, '=', '−10'], { colors: { '−10': C.mint } });
  riseFormula(G, t, 50.6, 999, 540, 1225, 54, [{ rad: '−16' }, ':', 'no es real'], { fill: C.coral });
  fchip(G, 540, 1395, ['16', { sup: '3/4' }], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 46);
}
// ---------- nivel 2 · exponente fracción ----------
function level2(G, t) {
  starField(G, 29, 90);
  fchip(G, 540, 690, ['16', { sup: '3/4' }], out(t, 61.0), SKY, 46);
  riseFormula(G, t, 60.6, 999, 540, 860, 62, ['16', { sup: '1/2' }, '·', '16', { sup: '1/2' }, '=', '16', { sup: '1' }]);
  riseFormula(G, t, 63.4, 999, 540, 970, 66, ['16', { sup: '1/2' }, '=', { rad: '16' }, '=', '4'], { colors: { '4': C.sun } });
  riseFormula(G, t, 66.8, 999, 540, 1100, 64, ['a', { sup: 'm/n' }, '=', '(', { rad: 'a', idx: 'n' }, ')', { sup: 'm' }], { fill: C.sun });
  riseFormula(G, t, 72.8, 999, 540, 1230, 62, ['16', { sup: '3/4' }, '=', '(', { rad: '16', idx: '4' }, ')', { sup: '3' }, '=', '2', { sup: '3' }, '=', '8'], { colors: { '8': C.mint } });
  tag(G, 300, 1110, 'índice', life(t, 67.6, 78.4), C.mint, 34); tag(G, 800, 1110, 'potencia', life(t, 67.8, 78.4), C.coral, 34);
  fchip(G, 540, 1370, [{ rad: 'x²' }], pop(t, 87.6) * (1 + .1 * wob(t, 88.6, 14, 6)), NEG, 48);
}
// ---------- nivel 3 · dos trampas ----------
function level3(G, t) {
  starField(G, 43, 90);
  const ko = 1 - eio(seg(t, 115.0, 115.6)); if (ko <= 0.01) return;
  const S = scaleAt(G, 540, 900, ko);
  fchip(S, 540, 690, [{ rad: 'x²' }], out(t, 96.0), NEG, 48);
  riseFormula(S, t, 95.8, 106.6, 540, 840, 60, ['x = −5', ':', { rad: '(−5)²' }, '=', { rad: '25' }, '=', '5'], { colors: { '5': C.mint } });
  riseFormula(S, t, 98.8, 106.6, 540, 960, 70, [{ rad: 'x²' }, '=', '|x|'], { fill: C.sun });
  // el triángulo 6 – 8 – 10
  const kt = pop(t, 107.0);
  if (kt > 0.01) {
    const T = scaleAt(S, 540, 900, kt), A = [260, 1080], B = [740, 1080], Cc = [740, 720];
    el('path', { d: `M${A}L${B}L${Cc}Z`, fill: C.n3 }, T);
    el('path', { d: `M${A}L${B}L${Cc}`, fill: 'none', stroke: C.coral, 'stroke-width': 8, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': `${eio(seg(t, 108.0, 109.2)).toFixed(3)} 2` }, T);
    const kd = eio(seg(t, 109.6, 110.6));
    if (kd > 0.01) el('path', { d: `M${A[0]},${A[1]}L${r1(lerp(A[0], Cc[0], kd))},${r1(lerp(A[1], Cc[1], kd))}`, stroke: C.mint, 'stroke-width': 10, 'stroke-linecap': 'round' }, T);
    tag(T, 500, 1130, '√144 = 12', 1, C.coral, 36); tag(T, 770, 910, '√81 = 9', 1, C.coral, 36, 'start');
    tag(T, 440, 870, '15', kd, C.mint, 52);
  }
  riseFormula(S, t, 111.0, 999, 540, 1250, 54, [{ rad: '81 + 144' }, '=', '15', '≠', '9 + 12'], { colors: { '15': C.mint, '9 + 12': C.coral } });
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(860 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, 'Raíces', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'deshacer potencias', { 'font-size': 80, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.6, 12.6, 'EL TERRENO DE ANA', 'un cuadrado de 25 m²', 'quiere ponerle cerca');
  label(p, t, 13.0, 18.8, '¿CUÁNTO MIDE EL LADO?', 'un número que por sí mismo', 'dé 25: el 5');
  label(p, t, 19.2, 24.6, 'LA RAÍZ CUADRADA', 'deshace el cuadrado', 'raíz de 25 es 5');
  label(p, t, 25.0, 29.0, 'SOLO LA POSITIVA', '(−5) al cuadrado también da 25', 'pero la raíz da 5');
  label(p, t, 31.8, 37.6, 'UNA CAJA CÚBICA', 'le caben 216 cm³', '¿cuánto mide la arista?');
  label(p, t, 38.0, 44.2, 'RAÍZ CÚBICA', '6 · 6 · 6 = 216', 'el 3 pequeño es el índice');
  label(p, t, 44.6, 50.2, 'ÍNDICE IMPAR', 'acepta negativos', '(−10) al cubo es −1 000');
  label(p, t, 50.6, 56.6, 'ÍNDICE PAR', 'raíz de −16 no es real', 'nada al cuadrado da negativo');
  label(p, t, 60.0, 66.4, '¿EXPONENTE FRACCIÓN?', '16 a la 1/2, por sí mismo', 'da 16: es la raíz de 16');
  label(p, t, 66.8, 72.4, 'LA REGLA', 'el denominador es el índice', 'el numerador, la potencia');
  label(p, t, 72.8, 78.6, 'PASO A PASO', 'raíz cuarta de 16: 2', 'y 2 al cubo: 8');
  label(p, t, 79.0, 84.8, 'PRIMERO LA RAÍZ', 'así los números quedan chicos', 'el resultado es el mismo');
  label(p, t, 85.2, 90.4, 'OJO CON LAS TRAMPAS', 'la raíz tiene dos', 'que engañan a todos');
  label(p, t, 95.4, 101.2, 'PRIMERA TRAMPA', 'raíz de x² no siempre es x', 'con x = −5 da 5');
  label(p, t, 101.6, 106.6, 'VALOR ABSOLUTO', 'raíz de x² es |x|', 'siempre positiva o cero');
  label(p, t, 107.0, 111.4, 'SEGUNDA TRAMPA', 'la raíz no se reparte en sumas', 'raíz de 81 + 144 es 15');
  label(p, t, 111.8, 114.9, 'POR LA DIAGONAL', 'cruzar: 15; rodear: 21');
};
FILM.summary = (p, t) => summaryList(p, t, 115.6, 'En resumen', [
  ['LA RAÍZ DESHACE', [{ rad: '25' }, '= 5', ',', { rad: '216', idx: '3' }, '= 6']],
  ['ÍNDICE PAR', 'sin negativos adentro'],
  ['EXPONENTE FRACCIÓN', ['a', { sup: 'm/n' }, '=', '(', { rad: 'a', idx: 'n' }, ')', { sup: 'm' }]],
  ['TRAMPAS', [{ rad: 'x²' }, '= |x|', ',', { rad: 'a + b' }, '≠', { rad: 'a' }, '+', { rad: 'b' }]],
]);
FILM.events = () => {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  for (let i = 0; i < 9; i++) ev.push({ t: 6.8 + i * .1, type: 'tile', i });
  ev.push({ t: 8.6, type: 'pop', i: 0 }, { t: 13.0, type: 'lasso', d: 1.6 }, { t: 16.0, type: 'pop', i: 1 }, { t: 16.4, type: 'rise' }, { t: 19.0, type: 'rise' }, { t: 19.6, type: 'yes' }, { t: 21.4, type: 'rise' }, { t: 24.8, type: 'rise' }, { t: 25.0, type: 'pop', i: 2 });
  ev.push({ t: 38.2, type: 'rise' }, { t: 41.2, type: 'rise' }, { t: 41.8, type: 'yes' }, { t: 44.6, type: 'rise' }, { t: 50.6, type: 'rise' }, { t: 51.2, type: 'no' }, { t: 52.4, type: 'pop', i: 3 });
  ev.push({ t: 60.6, type: 'rise' }, { t: 63.4, type: 'rise' }, { t: 64.0, type: 'yes' }, { t: 66.8, type: 'rise' }, { t: 72.8, type: 'rise' }, { t: 73.6, type: 'yes' }, { t: 87.6, type: 'pop', i: 0 });
  ev.push({ t: 95.8, type: 'rise' }, { t: 98.8, type: 'rise' }, { t: 107.0, type: 'pop', i: 1 }, { t: 108.0, type: 'slide', d: 1.2 }, { t: 109.6, type: 'slide', d: 1.0 }, { t: 110.6, type: 'yes' }, { t: 111.0, type: 'rise' });
  ev.push({ t: 115.0, type: 'away', d: .6 }, { t: 115.6, type: 'rise' });
  for (let k = 0; k < 4; k++) ev.push({ t: 116.2 + k * .55, type: 'stop', i: k });
  ev.push({ t: 118.8, type: 'end' });
  return ev;
};
FILM.NARR = [
  [0.8, 3.6, 'Ana compró un terreno cuadrado.'],
  [4.0, 6.4, 'Quiere cercarlo. ¿Cuánta cerca necesita?'],
  [6.8, 9.6, 'El terreno tiene veinticinco metros cuadrados.'],
  [9.8, 12.6, 'Pero la cerca va por los lados.'],
  [13.0, 15.8, '¿Qué número por sí mismo da veinticinco?'],
  [16.0, 18.8, 'Cinco: cinco por cinco.'],
  [19.2, 21.8, 'La raíz cuadrada deshace el cuadrado.'],
  [22.0, 24.6, 'Raíz de veinticinco es cinco.'],
  [25.0, 29.0, 'Menos cinco al cuadrado también da veinticinco, pero la raíz da la positiva.'],
  [31.8, 34.8, 'Ana guarda semillas en una caja cúbica de 216 cm³.'],
  [35.0, 37.6, '¿Cuánto mide cada arista?'],
  [38.0, 41.0, 'Seis por seis por seis: doscientos dieciséis.'],
  [41.2, 44.2, 'Es la raíz cúbica; el tres pequeño es el índice.'],
  [44.6, 47.4, 'Con índice impar, la raíz acepta negativos:'],
  [47.6, 50.2, 'raíz cúbica de menos mil, menos diez.'],
  [50.6, 53.6, 'Con índice par, no: ningún número al cuadrado'],
  [53.8, 56.6, 'da negativo. Raíz de menos dieciséis no es real.'],
  [60.0, 63.2, '¿Y un exponente fracción? Dieciséis a la un medio, por sí mismo,'],
  [63.4, 66.4, 'da dieciséis: es la raíz de dieciséis, cuatro.'],
  [66.8, 69.6, 'El denominador de la fracción es el índice;'],
  [69.8, 72.4, 'el numerador, la potencia.'],
  [72.8, 75.6, 'Dieciséis a la tres cuartos: raíz cuarta de dieciséis,'],
  [75.8, 78.6, 'dos; y dos al cubo, ocho.'],
  [79.0, 81.8, 'Conviene sacar la raíz primero:'],
  [82.0, 84.8, 'los números quedan pequeños.'],
  [85.2, 87.8, 'Ahora, dos trampas de las raíces'],
  [88.0, 90.4, 'que engañan a casi todos.'],
  [95.4, 98.4, 'Primera: raíz de x al cuadrado no siempre es x.'],
  [98.6, 101.4, 'Si x es menos cinco, da cinco.'],
  [101.6, 104.4, 'Es el valor absoluto de x:'],
  [104.6, 106.6, 'nunca negativo.'],
  [107.0, 109.6, 'Segunda: la raíz no se reparte en una suma.'],
  [109.8, 112.0, 'Raíz de 81 más 144 es 15.'],
  [112.4, 114.8, 'Cruzar por la diagonal: quince. Rodear: veintiuno.'],
  [116.2, 120.6, 'Y el terreno de Ana mide cinco por lado.'],
  [120.8, 125.6, 'Compra veinte metros de cerca: cuatro lados de cinco.'],
];
