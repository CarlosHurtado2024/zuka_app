// «Simplificar y demostrar» (lección trig-47b, Faro de los Ángulos, video 3) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): tan x + cot x = sec x · csc x paso a paso, sen²x + cos²x frente a la recta
// y = 1, sen x = 1/2 como ecuación, y el contraejemplo cos(x + y) ≠ cos x + cos y con x = y = 0.
// Hilo: dos calculadoras simplifican lo mismo y dan fórmulas distintas: ¿cuál se equivocó? Sorpresa anunciada: un dibujo
// no es prueba; hace falta demostrar. Cierre: las dos tenían razón.
const POSTER = 74;
const FILM = stdFilm({
  open: { Z0: 1.15, C: [540, 900], t1: 3.8, t2: 6.0 },
  aims: ['identidad o ecuación', 'la demostración', 'el contraejemplo'],
  stops: ['dos respuestas', 'identidad', 'demostrar', 'refutar'],
  wides: [[15.8, 17.4], [72.6, 74.2], [107.8, 109.4]],
  smiles: [[81.8, 83.6], [119.0, 135]],
});
function calc(p, x, y, lines, k, col) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'rect', { x: x - 200, y: y - 150, width: 400, height: 300, rx: 34 }, col[0], col[1], 6, 6);
  el('rect', { x: x - 165, y: y - 120, width: 330, height: 120, rx: 16, fill: C.night }, S);
  formula(S, x, y - 44, 40, lines, { fill: C.cream });
  for (let i = 0; i < 6; i++) el('rect', { x: x - 150 + (i % 3) * 110, y: y + 30 + Math.floor(i / 3) * 56, width: 80, height: 40, rx: 12, fill: col[1] }, S);
}
const F1 = x => Math.tan(x) + 1 / Math.tan(x), F2 = x => 1 / (Math.cos(x) * Math.sin(x));
const MD = { ox: 150, oy: 1080, s: 245, sy: 52 };
function level0(G, t) {
  starField(G, 411, 150);
  const kc = pop(t, 0.3) * (1 - eio(seg(t, 12.4, 12.8)));
  calc(G, 290, 900, ['tan x + cot x'], kc * pop(t, 4.0), SKY);
  calc(G, 790, 900, ['sec x · csc x'], kc * pop(t, 7.0), NEG);
  if (t > 9.8 && t < 12.6) tag(G, 540, 1180, '¿?', pop(t, 10.0), C.sun, 90);
  const kg = pop(t, 12.8) * out(t, 28.8);
  if (kg > 0.01) {
    const S = scaleAt(G, 540, 1080, kg);
    axes(S, t, 13.0, MD, 0, Math.PI + .1, -6.5, 6.5, { ticks: false });
    vline(S, MD, Math.PI / 2, -6.5, 6.5, eio(seg(t, 13.4, 14.0)), C.n3, 4);
    for (const [a, b] of [[.03, Math.PI / 2 - .03], [Math.PI / 2 + .03, Math.PI - .03]]) {
      wave(S, MD, F1, a, b, eio(seg(t, 13.6, 15.2)), C.blue, 16, -6.5, 6.5);
      wave(S, MD, F2, a, b, eio(seg(t, 15.8, 17.4)), C.coral, 6, -6.5, 6.5);
    }
    piTicks(S, t, 13.4, MD, [[Math.PI / 2, FR('π', '2')], [Math.PI, 'π']]);
  }
  fchip(G, 480, 1440, ['identidad'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · identidad o ecuación ----------
const ME = { ox: 140, oy: 1060, s: 125, sy: 180 };
function level1(G, t) {
  starField(G, 413, 90);
  fchip(G, 540, 700, ['identidad'], out(t, 32.4), ZERO, 50);
  const ko = 1 - eio(seg(t, 44.4, 44.8));
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 1000, ko), two = t > 38.2;
    axes(S, t, 32.0, ME, 0, 2 * Math.PI + .2, -1.3, 1.5, { ticks: false });
    if (!two) { wave(S, ME, () => 1, 0, 2 * Math.PI, eio(seg(t, 32.6, 34.0)), C.blue, 16); wave(S, ME, x => Math.sin(x) ** 2 + Math.cos(x) ** 2, 0, 2 * Math.PI, eio(seg(t, 35.0, 36.6)), C.coral, 6); }
    else {
      wave(S, ME, Math.sin, 0, 2 * Math.PI, eio(seg(t, 38.4, 39.6)), C.blue, 8);
      hline(S, ME, .5, 0, 2 * Math.PI, eio(seg(t, 39.0, 39.8)), C.coral, 6);
      [Math.PI / 6, 5 * Math.PI / 6].forEach((x, i) => dot(S, mx(ME, x), my(ME, .5), pop(t, 41.4 + i * .4), C.sun, 14));
    }
  }
  riseFormula(G, t, 33.0, 37.8, 540, 680, 50, ['sen', SP('2'), 'x', '+', 'cos', SP('2'), 'x', '=', '1']);
  riseFormula(G, t, 38.6, 44.2, 540, 680, 50, ['sen x', '=', FR('1', '2')]);
  ['1 · empieza por el lado complicado', '2 · todo en senos y cosenos', '3 · llega al otro lado'].forEach((s, i) => {
    const k = pop(t, [47.8, 50.8, 54.0][i]); if (k > 0.01) chip(G, 540, 820 + i * 130, s, k, [POS, ZERO, MINT][i], C.night, 40);
  });
  fchip(G, 480, 1440, ['tan x + cot x'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)), SKY, 44);
}
// ---------- nivel 2 · la demostración ----------
function level2(G, t) {
  starField(G, 415, 90);
  fchip(G, 540, 700, ['tan x + cot x'], out(t, 61.0), SKY, 44);
  const ko = 1 - eio(seg(t, 84.4, 84.8)); if (ko <= 0.01) return fchip(G, 480, 1440, ['x = y = 0'], pop(t, 88.0), ZERO, 48);
  const S = scaleAt(G, 540, 1000, ko);
  const ST = [
    [61.4, ['tan x + cot x']],
    [62.0, ['=', FR('sen x', 'cos x'), '+', FR('cos x', 'sen x')]],
    [66.8, ['=', FR('sen²x + cos²x', 'sen x · cos x')]],
    [75.8, ['=', FR('1', 'sen x · cos x')]],
    [79.0, ['=', FR('1', 'cos x'), '·', FR('1', 'sen x'), '=', 'sec x · csc x']],
  ];
  ST.forEach(([t0, f], i) => riseFormula(S, t, t0, 999, 540, 640 + i * 150, i ? 58 : 56, f, { fill: i === 4 ? C.mint : C.cream }));
  const kh = eio(seg(t, 72.8, 73.6));
  if (kh > 0.01) { lasso(S, 560, 922, 260, 56, kh, C.sun, 6); const k = pop(t, 73.6); if (k > 0.01) chip(S, 920, 920, '= 1', k, ZERO, C.night, 44); }
  if (t > 81.8) badge(S, 940, 1240, pop(t, 82.0), true);
  fchip(G, 480, 1440, ['x = y = 0'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 48);
}
// ---------- nivel 3 · el contraejemplo ----------
function level3(G, t) {
  starField(G, 417, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['x = y = 0'], out(t, 96.0), ZERO, 48);
  riseFormula(E, t, 96.4, 113.8, 540, 680, 52, ['cos(x + y)', '=', 'cos x + cos y', '?']);
  const kL = pop(t, 104.8), kR = pop(t, 107.8);
  if (kL > 0.01) { const S = scaleAt(E, 300, 980, kL); shaded(S, 'rect', { x: 140, y: 860, width: 320, height: 240, rx: 30 }, C.blue, C.blueD, 5, 5); formula(S, 300, 950, 40, ['cos(0 + 0)']); formula(S, 300, 1050, 64, ['1'], { fill: C.sun }); }
  if (kR > 0.01) { const S = scaleAt(E, 780, 980, kR); shaded(S, 'rect', { x: 620, y: 860, width: 320, height: 240, rx: 30 }, C.coral, C.coralD, 5, 5); formula(S, 780, 950, 40, ['cos 0 + cos 0']); formula(S, 780, 1050, 64, ['2'], { fill: C.sun }); }
  const kn = pop(t, 110.8);
  if (kn > 0.01) { chip(E, 540, 1240, '1 ≠ 2: es falsa', kn, NEG, C.night, 50); badge(E, 540, 980, kn, false); }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Simplificar', 'y demostrar');
  label(p, t, 6.6, 12.4, 'DOS RESPUESTAS', 'tan x + cot x', 'sec x · csc x');
  label(p, t, 12.8, 18.6, 'LAS GRÁFICAS', 'caen una', 'sobre la otra');
  label(p, t, 19.0, 24.4, 'CUIDADO', 'un dibujo', 'no es una prueba');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'hay que demostrar', 'paso a paso');
  label(p, t, 31.8, 37.8, 'IDENTIDAD', 'cierta para todo x', 'curvas iguales');
  label(p, t, 38.2, 44.2, 'ECUACIÓN', 'solo en algunos x', 'curvas que se cruzan');
  label(p, t, 44.6, 50.2, 'LA ESTRATEGIA', 'empieza por', 'el lado complicado');
  label(p, t, 50.6, 56.6, 'SIN TRAMPAS', 'senos y cosenos', 'hasta el otro lado');
  label(p, t, 60.0, 66.0, 'PASO 1', 'todo en senos', 'y cosenos');
  label(p, t, 66.4, 72.2, 'PASO 2', 'denominador común');
  label(p, t, 72.6, 78.4, 'PASO 3', 'sen² x + cos² x', '¡vale 1!');
  label(p, t, 78.8, 84.4, 'PASO 4', 'separa las fracciones', 'sec x · csc x');
  label(p, t, 84.8, 90.4, '¿Y SI ES FALSA?', 'basta un ejemplo', 'que falle');
  label(p, t, 95.4, 101.4, '¿IDENTIDAD?', 'coseno de una suma', '¿suma de cosenos?');
  label(p, t, 101.8, 107.4, 'PRUEBA x = y = 0', 'izquierda: cos 0', 'vale 1');
  label(p, t, 107.8, 114.0, 'CONTRAEJEMPLO', 'derecha: 1 + 1 = 2', '1 ≠ 2: falsa');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['IDENTIDAD', 'cierta para todo x'],
  ['ESTRATEGIA', 'del lado complicado al simple'],
  ['HERRAMIENTA', 'todo en senos y cosenos'],
  ['LA CLAVE', ['sen', SP('2'), 'x', '+', 'cos', SP('2'), 'x', '=', '1']],
  ['SI ES FALSA', 'basta un contraejemplo'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [4.0, 'pop', 1], [7.0, 'pop', 2], [10.0, 'pop', 3], [12.8, 'pop'], [13.6, 'paint', 1.6], [15.8, 'paint', 1.6], [24.8, 'pop', 3],
  [32.6, 'paint', 1.4], [33.0, 'rise'], [35.0, 'paint', 1.6], [38.4, 'paint', 1.2], [38.6, 'rise'], [41.4, 'pop', 1], [41.8, 'pop', 2], [47.8, 'tile', 0], [50.8, 'tile', 1], [54.0, 'tile', 2], [52.4, 'pop', 3],
  [61.4, 'rise'], [62.0, 'rise'], [66.8, 'rise'], [72.8, 'lasso', .8], [73.6, 'yes'], [75.8, 'rise'], [79.0, 'rise'], [82.0, 'yes'], [88.0, 'pop', 1],
  [96.4, 'rise'], [104.8, 'pop', 1], [107.8, 'pop', 2], [110.8, 'no'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Dos calculadoras simplifican la misma expresión.'],
  [4.0, 6.6, 'Una dice: tangente más cotangente.'],
  [7.0, 9.6, 'La otra: secante por cosecante.'],
  [9.8, 12.4, '¿Cuál de las dos se equivocó?'],
  [12.8, 15.6, 'Grafiquemos ambas.'],
  [15.8, 18.6, 'Las curvas caen una sobre otra.'],
  [19.0, 21.8, '¿Coinciden siempre, o solo en el dibujo?'],
  [22.0, 24.4, 'Un dibujo no es una prueba.'],
  [24.8, 29.0, 'Hace falta una demostración, paso a paso.'],
  [31.8, 34.8, 'Una identidad se cumple para todo x.'],
  [35.0, 37.8, 'Sus dos lados dibujan la misma curva.'],
  [38.2, 41.0, 'Una ecuación solo se cumple en algunos puntos.'],
  [41.2, 44.2, 'Sus curvas apenas se cruzan.'],
  [44.6, 47.4, 'Para demostrar una identidad, hay reglas.'],
  [47.6, 50.2, 'Trabaja el lado más complicado.'],
  [50.6, 53.6, 'Escríbelo todo en senos y cosenos.'],
  [53.8, 56.6, 'Y llega al otro lado sin trampas.'],
  [60.0, 63.0, 'Tangente es seno sobre coseno.'],
  [63.2, 66.0, 'Cotangente, coseno sobre seno.'],
  [66.4, 69.2, 'Suma con un denominador común.'],
  [69.4, 72.2, 'Arriba aparece seno cuadrado más coseno cuadrado.'],
  [72.6, 75.4, '¡Eso vale uno!'],
  [75.6, 78.4, 'Queda uno sobre seno por coseno.'],
  [78.8, 81.6, 'Es secante por cosecante.'],
  [81.8, 84.4, 'Las dos calculadoras tenían razón.'],
  [84.8, 87.6, '¿Y si una fórmula es falsa?'],
  [87.8, 90.4, 'Basta un contraejemplo.'],
  [95.4, 98.4, 'Una fórmula dice: coseno de una suma…'],
  [98.6, 101.4, '¿es la suma de los cosenos?'],
  [101.8, 104.6, 'Prueba con x y y iguales a cero.'],
  [104.8, 107.4, 'Izquierda: coseno de cero, uno.'],
  [107.8, 110.6, 'Derecha: uno más uno, dos.'],
  [110.8, 114.0, 'Uno no es dos: la fórmula es falsa.'],
  [115.4, 119.6, 'Tangente más cotangente es secante por cosecante:'],
  [119.8, 124.4, 'las dos calculadoras tenían razón, y ya lo demostramos.'],
];
