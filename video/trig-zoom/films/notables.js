// «Ángulos notables» (lección trig-2, Mar de las Ondas, video 4) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): las dos escuadras de la cartuchera, el cuadrado de lado 1 (diagonal √2),
// el equilátero de lado 2 (altura √3), la tabla √n/2 y el tejado de 6 m inclinado 30° (altura 3 m).
// Hilo: la calculadora dice que sen 60° ≈ 0.866…; ¿hay un valor exacto? Sorpresa anunciada: cabe en una fracción y sale de
// figuras que ya conoces. Cierre: sen 60° = √3/2, guardado en las escuadras.
const POSTER = 76;
const FILM = stdFilm({
  open: { Z0: 1.8, C: [540, 960], t1: 3.8, t2: 6.0 },
  aims: ['el cuadrado', 'el equilátero', 'la tabla'],
  stops: ['las escuadras', 'el cuadrado', 'el equilátero', 'la tabla'],
  wides: [[19.0, 20.6], [84.8, 86.4]],
  smiles: [[47.6, 49.4], [110.8, 112.6], [119.0, 135]],
});
// una escuadra: triángulo de plástico con un hueco
function setSquare(p, V, k, col) {
  if (k <= 0.01) return;
  poly(p, V, k, col[0], col[1], 6);
  const c = [(V[0][0] + V[1][0] + V[2][0]) / 3, (V[0][1] + V[1][1] + V[2][1]) / 3];
  poly(p, V.map(q => [lerp(c[0], q[0], .45), lerp(c[1], q[1], .45)]), k, C.night, col[1], 4);
  const S = scaleAt(p, c[0], c[1], k);
  for (let j = 1; j < 10; j++) { const q = [lerp(V[0][0], V[1][0], j / 10), lerp(V[0][1], V[1][1], j / 10)]; el('rect', { x: r1(q[0] - 2), y: r1(q[1] - 18), width: 4, height: 16, fill: col[1] }, S); }
}
function level0(G, t) {
  starField(G, 331, 150);
  const k = 1 - eio(seg(t, 28.6, 29.0));
  const ka = pop(t, 0.4) * k, kb = pop(t, 1.0) * k;
  const sh = 14 * Math.sin(t * 1.1);
  setSquare(G, [[150, 1150 + sh], [530, 1150 + sh], [150, 770 + sh]], ka, [C.mint, C.mintD]);
  setSquare(G, [[580, 1150 - sh], [960, 1150 - sh], [580, 1150 - 380 / Math.sqrt(3) * 3 - sh]], kb, [C.blue, C.blueD]);
  const kk = eio(seg(t, 9.8, 10.6)) * k;
  if (kk > 0.01) { angMark(G, [530, 1150 + sh], [150, 1150 + sh], [150, 770 + sh], 90, kk, C.sun, '45°', 38); }
  const kt = eio(seg(t, 12.8, 13.6)) * k;
  if (kt > 0.01) { angMark(G, [960, 1150 - sh], [580, 1150 - sh], [580, 492 - sh], 100, kt, C.sun, '60°', 38); angMark(G, [580, 492 - sh], [580, 1150 - sh], [960, 1150 - sh], 80, kt, C.sun, '30°', 38); }
  const kc = life(t, 19.2, 24.4);
  if (kc > 0.01) chip(G, 470, 1300, 'sen 60° ≈ 0.8660254…', kc, POS, C.night, 44);
  const kx = life(t, 22.2, 24.4);
  if (kx > 0.01) chip(G, 470, 1390, '¿valor exacto?', kx, ZERO, C.night, 44);
  fchip(G, 480, 1440, ['45°'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), MINT, 52);
}
// ---------- nivel 1 · el cuadrado ----------
const Q0 = [320, 1200], QS = 420;
function level1(G, t) {
  starField(G, 333, 90);
  fchip(G, 540, 700, ['45°'], out(t, 32.4), MINT, 52);
  const A = Q0, B = [Q0[0] + QS, Q0[1]], Cq = [Q0[0] + QS, Q0[1] - QS], D = [Q0[0], Q0[1] - QS];
  const ks = pop(t, 32.0), cut = eio(seg(t, 35.2, 36.2)), sep = 40 * eio(seg(t, 38.2, 39.0));
  if (ks > 0.01) {
    poly(G, [[D[0] - sep, D[1] - sep], [A[0] - sep, A[1] - sep], [Cq[0] - sep, Cq[1] - sep]], ks, C.n3, C.mist, 5);
    poly(G, [A, B, Cq], ks, C.n2, C.cream, 6);
    segAB(G, A, Cq, cut, C.sun, 10);
    tag(G, (A[0] + B[0]) / 2, A[1] + 60, '1', pop(t, 33.0), C.mint, 48);
    tag(G, B[0] + 40, (B[1] + Cq[1]) / 2 + 16, '1', pop(t, 33.4), C.coral, 48, 'start');
    rightMark(G, B, A, Cq, 36, ks, C.mist);
    angMark(G, A, B, Cq, 110, eio(seg(t, 38.6, 39.2)), C.cream, '45°', 36);
    angMark(G, Cq, A, B, 80, eio(seg(t, 39.0, 39.6)), C.cream, '45°', 34);
    sideLab(G, A, Cq, [RAD('2')], 50, pop(t, 42.6), C.sun, 50);
    segAB(G, B, Cq, eio(seg(t, 44.8, 45.4)), C.coral, 10);
    segAB(G, A, B, eio(seg(t, 50.8, 51.4)), C.mint, 10);
  }
  riseFormula(G, t, 41.4, 44.2, 540, 680, 56, ['1', SP('2'), '+', '1', SP('2'), '=', '2']);
  riseFormula(G, t, 45.0, 50.2, 540, 680, 54, ['sen 45°', '=', FR('1', '√2'), '=', FR('√2', '2'), '≈', '0.707']);
  riseFormula(G, t, 51.0, 56.6, 540, 680, 54, ['cos 45°', '=', FR('√2', '2'), ',', 'tan 45°', '=', '1']);
  fchip(G, 480, 1440, ['60°'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 52);
}
// ---------- nivel 2 · el equilátero ----------
const EB = [300, 1240], EC = [780, 1240], EA = [540, 1240 - 240 * Math.sqrt(3)], EH = [540, 1240];
function level2(G, t) {
  starField(G, 335, 90);
  fchip(G, 540, 700, ['60°'], out(t, 61.0), SKY, 52);
  const ke = pop(t, 60.6) * (1 - eio(seg(t, 90.6, 91.0)));
  if (ke <= 0.01) return fchip(G, 480, 1440, ['√1 · √2 · √3'], pop(t, 88.0), ZERO, 44);
  const S = scaleAt(G, 540, 1050, ke), half = eio(seg(t, 66.8, 67.8)), slide = 60 * eio(seg(t, 69.2, 70.0));
  poly(S, [EB, EA, EH], 1, C.n3, C.mist, 5);
  const T = g(S, { transform: `translate(${r1(slide)},0)` });
  poly(T, [EH, EA, EC], 1, C.n2, C.cream, 6);
  if (half < 1) poly(S, [EB, EA, EH], 1 - half, C.n2, C.cream, 6);
  ['2', '2', '2'].forEach((s, i) => { const k = pop(t, 61.4 + i * .3) * (1 - half); if (k > 0.01) { const P = [[EB, EA], [EA, EC], [EC, EB]][i]; sideLab(S, P[0], P[1], s, 44, k, C.cream, 46); } });
  for (const [V, P1, P2] of [[EB, EC, EA], [EC, EA, EB], [EA, EB, EC]]) angMark(S, V, P1, P2, 70, eio(seg(t, 63.4, 64.0)) * (1 - half), C.sun, null);
  const k2 = eio(seg(t, 69.4, 70.0));
  if (k2 > 0.01) {
    const a = [EA[0] + slide, EA[1]], h = [EH[0] + slide, EH[1]], c = [EC[0] + slide, EC[1]];
    rightMark(S, h, c, a, 34, k2, C.mist);
    angMark(S, a, h, c, 90, k2, C.cream, '30°', 34);
    angMark(S, c, a, h, 80, k2, C.cream, '60°', 34);
    sideLab(S, a, c, '2', 44, k2, C.sun, 48);
    sideLab(S, h, c, '1', -44, k2, C.mint, 48);
    sideLab(S, h, a, [RAD('3')], 50, pop(t, 73.0), C.coral, 48);
    segAB(S, h, a, eio(seg(t, 72.8, 73.4)), C.coral, 9);
  }
  riseFormula(G, t, 75.6, 78.4, 540, 680, 54, ['2', SP('2'), '−', '1', SP('2'), '=', '3']);
  riseFormula(G, t, 79.0, 84.4, 540, 620, 50, ['sen 60°', '=', FR('√3', '2'), '≈', '0.866']);
  riseFormula(G, t, 81.8, 84.4, 540, 740, 50, ['sen 30°', '=', FR('1', '2')]);
  fchip(G, 480, 1440, ['√1 · √2 · √3'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 44);
}
// ---------- nivel 3 · la tabla y el tejado ----------
function level3(G, t) {
  starField(G, 337, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['√1 · √2 · √3'], out(t, 96.0), ZERO, 44);
  const kt = pop(t, 96.4) * (1 - eio(seg(t, 104.4, 104.8)));
  if (kt > 0.01) {
    const S = scaleAt(E, 540, 940, kt), X = [270, 405, 540, 675, 810];
    ['0°', '30°', '45°', '60°', '90°'].forEach((s, i) => tag(S, X[i], 800, s, pop(t, 96.6 + i * .12), C.mist, 40));
    tag(S, 110, 900, 'sen', pop(t, 96.6), C.sun, 40, 'start'); tag(S, 110, 1040, 'cos', pop(t, 101.8), C.mint, 40, 'start');
    ['0', '1', '2', '3', '4'].forEach((n, i) => { const k = pop(t, 98.6 + i * .3); if (k > 0.01) fracAt(S, X[i], 878, 50 * k, '√' + n, '2', C.sun); });
    ['4', '3', '2', '1', '0'].forEach((n, i) => { const k = pop(t, 102.0 + i * .2); if (k > 0.01) fracAt(S, X[i], 1018, 50 * k, '√' + n, '2', C.mint); });
  }
  const kr = pop(t, 104.8);
  if (kr > 0.01) {
    const S = scaleAt(E, 540, 1100, kr), L = 560, x0 = 260, y0 = 1180, top = [x0 + L * Math.cos(30 * D2R), y0 - L * Math.sin(30 * D2R)];
    el('rect', { x: x0 - 20, y: y0, width: 640, height: 160, rx: 10, fill: C.n3 }, S);
    for (let j = 0; j < 7; j++) el('rect', { x: x0 + 20 + j * 86, y: y0 + 40, width: 50, height: 60, rx: 6, fill: C.night }, S);
    segAB(S, [x0, y0], top, 1, C.coral, 16);
    segAB(S, [top[0], y0], top, eio(seg(t, 108.0, 108.6)), C.sun, 8);
    angMark(S, [x0, y0], [top[0], y0], top, 120, 1, C.cream, '30°', 36);
    sideLab(S, [x0, y0], top, '6 m', 44, 1, C.coral, 44);
    tag(S, top[0] + 30, y0 - 120, '3 m', pop(t, 109.4), C.sun, 46, 'start');
  }
  riseFormula(E, t, 108.0, 113.8, 540, 800, 54, ['h', '=', '6', '·', FR('1', '2'), '=', '3 m']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Ángulos', 'notables');
  label(p, t, 6.6, 12.4, 'LAS ESCUADRAS', 'dos triángulos', 'en cada cartuchera');
  label(p, t, 12.8, 18.6, 'LOS NOTABLES', '45°, 30° y 60°', '¿cuánto vale su seno?');
  label(p, t, 19.0, 24.4, 'LA CALCULADORA', 'decimales sin fin', '¿y el valor exacto?');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'cabe en una fracción', 'y ya la conoces');
  label(p, t, 31.8, 37.8, 'EL CUADRADO', 'lado 1', 'cortado por la diagonal');
  label(p, t, 38.2, 44.2, 'LA DIAGONAL', 'por Pitágoras', 'mide √2');
  label(p, t, 44.6, 50.2, 'SENO DE 45°', 'opuesto ÷ hipotenusa', '1/√2 = √2/2');
  label(p, t, 50.6, 56.6, 'COSENO Y TANGENTE', 'catetos iguales', 'tan 45° = 1');
  label(p, t, 60.0, 66.0, 'EL EQUILÁTERO', 'lados de 2', 'ángulos de 60°');
  label(p, t, 66.4, 72.2, 'LA ALTURA', 'lo parte en dos', '30° arriba, base 1');
  label(p, t, 72.6, 78.4, 'PITÁGORAS', 'la altura', 'mide √3');
  label(p, t, 78.8, 84.4, 'LAS RAZONES', 'sen 60° = √3/2', 'sen 30° = 1/2');
  label(p, t, 84.8, 90.4, 'UN PATRÓN', 'escondido', 'en los números');
  label(p, t, 95.4, 101.4, 'LA TABLA', 'senos: √0 a √4', 'todos sobre 2');
  label(p, t, 101.8, 107.4, 'COSENOS', 'la misma fila', 'al revés');
  label(p, t, 107.8, 114.0, 'UN TEJADO', '6 m inclinado 30°', 'altura: 3 m');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['45°', ['sen', '=', 'cos', '=', FR('√2', '2')]],
  ['30°', ['sen', '=', FR('1', '2'), ',', 'cos', '=', FR('√3', '2')]],
  ['60°', ['sen', '=', FR('√3', '2'), ',', 'cos', '=', FR('1', '2')]],
  ['EL PATRÓN', ['sen', '=', FR('√n', '2'), ',', 'n = 0 … 4']],
  ['TANGENTE', 'seno ÷ coseno'],
]);
FILM.events = () => stdEvents([
  [0.4, 'pop'], [1.0, 'pop', 1], [9.8, 'paint', .8], [12.8, 'paint', .8], [19.2, 'card'], [22.2, 'pop', 2], [24.8, 'pop', 3],
  [32.0, 'pop'], [33.0, 'pop', 1], [33.4, 'pop', 2], [35.2, 'paint', 1.0], [38.2, 'slide', .8], [41.4, 'rise'], [42.6, 'yes'], [44.8, 'paint', .6], [45.0, 'rise'], [51.0, 'rise'], [52.4, 'pop', 3],
  [60.6, 'pop'], [61.4, 'tile', 0], [61.7, 'tile', 1], [62.0, 'tile', 2], [63.4, 'paint', .6], [66.8, 'paint', 1.0], [69.2, 'slide', .8], [72.8, 'paint', .6], [73.0, 'yes'],
  [75.6, 'rise'], [79.0, 'rise'], [81.8, 'rise'], [88.0, 'pop', 1],
  [96.4, 'pop'], [98.6, 'count', 0], [98.9, 'count', 1], [99.2, 'count', 2], [99.5, 'count', 3], [99.8, 'count', 4], [102.0, 'tile', 0], [102.4, 'tile', 1], [102.8, 'tile', 2],
  [104.8, 'pop'], [108.0, 'paint', .6], [108.0, 'rise'], [109.4, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Dos escuadras viajan en cada cartuchera.'],
  [4.0, 6.6, 'Parecen simples reglas de plástico.'],
  [7.0, 9.6, 'Pero esconden los ángulos más famosos.'],
  [9.8, 12.4, 'Una tiene cuarenta y cinco grados.'],
  [12.8, 15.6, 'La otra, treinta y sesenta.'],
  [15.8, 18.6, 'Sin calculadora, ¿cuánto vale el seno de sesenta?'],
  [19.0, 21.8, 'La calculadora dice cero punto ocho seis seis…'],
  [22.0, 24.4, 'Pero hay un valor exacto.'],
  [24.8, 29.0, 'Y sale de dos figuras que ya conoces.'],
  [31.8, 34.8, 'Toma un cuadrado de lado uno.'],
  [35.0, 37.8, 'Córtalo por la diagonal.'],
  [38.2, 41.0, 'Cada mitad tiene dos ángulos de 45.'],
  [41.2, 44.2, 'Por Pitágoras, la diagonal mide raíz de dos.'],
  [44.6, 47.4, 'Seno de 45: uno sobre raíz de dos.'],
  [47.6, 50.2, 'Es decir, raíz de dos sobre dos.'],
  [50.6, 53.6, 'El coseno vale lo mismo: los catetos son iguales.'],
  [53.8, 56.6, 'Y la tangente, uno entre uno, vale uno.'],
  [60.0, 63.0, 'Ahora, un triángulo equilátero de lado dos.'],
  [63.2, 66.0, 'Sus tres ángulos miden sesenta.'],
  [66.4, 69.2, 'Pártelo por la mitad con su altura.'],
  [69.4, 72.2, 'La base queda en uno; arriba, treinta grados.'],
  [72.6, 75.4, 'La altura mide raíz de tres.'],
  [75.6, 78.4, 'Sale de Pitágoras: cuatro menos uno.'],
  [78.8, 81.6, 'Seno de sesenta: raíz de tres sobre dos.'],
  [81.8, 84.4, 'Seno de treinta: un medio.'],
  [84.8, 87.6, 'Y aparece un patrón precioso.'],
  [87.8, 90.4, 'Míralo en una tabla.'],
  [95.4, 98.4, 'Mira los senos de los cinco ángulos:'],
  [98.6, 101.4, 'raíces de cero a cuatro, sobre dos.'],
  [101.8, 104.6, 'El coseno es la misma fila, al revés.'],
  [104.8, 107.4, 'Un tejado de seis metros sube treinta grados.'],
  [107.8, 110.6, 'Su altura: seis por un medio, tres metros.'],
  [110.8, 114.0, 'Exacto, sin calculadora.'],
  [115.4, 119.6, 'El seno de sesenta es raíz de tres sobre dos:'],
  [119.8, 124.4, 'lo guardan las escuadras de tu cartuchera.'],
];
