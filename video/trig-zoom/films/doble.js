// «Ángulo doble y ángulo medio» (lección trig-48b, Faro de los Ángulos, video 5) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): el chorro del barco bombero con alcance R = 40 · sen 2θ (30° y 60° llegan
// a ≈ 34.6 m, 45° a 40 m), sen 60° = 2 · ½ · √3/2, la gráfica de sen²x = (1 − cos 2x)/2 y sen 15° ≈ 0.259.
// Hilo: el cañón puede inclinarse a cualquier ángulo: ¿con cuál llega más lejos? Sorpresa anunciada: 30° y 60° llegan
// igual (no es casualidad). Cierre: 45°, donde el ángulo doble es 90° y el seno vale 1.
const POSTER = 106;
const FILM = stdFilm({
  open: { Z0: 1.7, C: [300, 1150], t1: 3.8, t2: 6.0 },
  aims: ['el ángulo doble', 'reducir potencias', 'el más lejos'],
  stops: ['el chorro', 'el ángulo doble', 'el ángulo medio', 'el más lejos'],
  wides: [[15.8, 17.4]],
  smiles: [[104.8, 106.4], [119.0, 135]],
});
const NZ = [150, 1090], PXM = 20;
const range = th => 40 * Math.sin(2 * th * D2R);
function jet(p, t, th, k, col = C.blue) {
  if (k <= 0.01) return;
  const R = range(th), n = 34, tn = Math.tan(th * D2R);
  for (let j = 0; j <= n * clamp(k); j++) {
    const x = R * j / n, y = x * tn - x * x * tn / R, ph = ((j / n) * 6 - t * 3) % 1;
    el('circle', { cx: r1(NZ[0] + x * PXM), cy: r1(NZ[1] - y * PXM), r: r1(9 + 3 * Math.sin(ph * 6.28)), fill: col }, p);
  }
}
function fireboat(p, t, th, k) {
  if (k <= 0.01) return;
  const S = scaleAt(p, NZ[0], NZ[1], k);
  sea(S, t, NZ[1] + 70, -200, W + 200, 1, 6);
  shaded(S, 'path', { d: `M${NZ[0] - 120},${NZ[1] + 20}L${NZ[0] + 120},${NZ[1] + 20}L${NZ[0] + 90},${NZ[1] + 80}L${NZ[0] - 100},${NZ[1] + 80}Z` }, C.coral, C.coralD, 4, 4);
  el('rect', { x: NZ[0] - 90, y: NZ[1] - 30, width: 90, height: 50, rx: 10, fill: C.cream }, S);
  const e = pc(NZ[0], NZ[1], 70, th); capsule(S, NZ[0], NZ[1], e[0], e[1], 22, C.mist);
}
function level0(G, t) {
  starField(G, 431, 150);
  const k = pop(t, 0.3) * out(t, 28.8);
  const th = kf(t, [[4.0, 20], [5.6, 45], [12.6, 45], [13.2, 30], [15.6, 30], [16.2, 60]]);
  fireboat(G, t, th, k);
  if (k > 0.01) {
    if (t > 13.4) jet(G, t, 30, eio(seg(t, 13.4, 14.6)), t > 16 ? C.blueD : C.blue);
    if (t > 16.4) jet(G, t, 60, eio(seg(t, 16.4, 17.6)), C.mint);
    if (t < 12.6) jet(G, t, th, eio(seg(t, 1.0, 2.6)), C.blue);
    const R30 = NZ[0] + range(30) * PXM;
    if (t > 14.6) { dot(G, R30, NZ[1] + 30, pop(t, 14.6), C.sun, 14); tag(G, R30, NZ[1] + 130, '≈ 34.6 m', pop(t, 14.8), C.sun, 40); }
    angMark(G, NZ, [NZ[0] + 300, NZ[1]], pc(NZ[0], NZ[1], 300, th), 160, eio(seg(t, 4.2, 4.8)), C.cream, Math.abs(th - Math.round(th / 15) * 15) < .01 ? Math.round(th) + '°' : null, 38);
  }
  riseFormula(G, t, 9.8, 24.4, 540, 640, 54, ['R', '=', '40', '·', 'sen 2θ']);
  fchip(G, 480, 1440, ['sen 2θ'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 52);
}
// ---------- nivel 1 · el ángulo doble ----------
function level1(G, t) {
  starField(G, 433, 90);
  fchip(G, 540, 700, ['sen 2θ'], out(t, 32.4), ZERO, 52);
  riseFormula(G, t, 32.8, 56.6, 540, 640, 38, ['sen(α + β)', '=', 'sen α cos β + cos α sen β'], { fill: C.mist });
  riseFormula(G, t, 35.2, 56.6, 540, 780, 58, ['sen 2θ', '=', '2', 'sen θ', 'cos θ'], { fill: C.sun });
  riseFormula(G, t, 41.4, 50.2, 540, 940, 48, ['sen 60°', '=', '2', '·', FR('1', '2'), '·', FR('√3', '2'), '=', FR('√3', '2')]);
  if (t > 46.4 && t < 50.2) badge(G, 900, 1060, pop(t, 46.6), true);
  riseFormula(G, t, 50.8, 56.6, 540, 1000, 50, ['cos 2θ', '=', 'cos', SP('2'), 'θ', '−', 'sen', SP('2'), 'θ'], { fill: C.mint });
  riseFormula(G, t, 52.4, 56.6, 540, 1120, 50, ['=', '1', '−', '2', 'sen', SP('2'), 'θ'], { fill: C.mint });
  riseFormula(G, t, 54.0, 56.6, 540, 1240, 50, ['=', '2', 'cos', SP('2'), 'θ', '−', '1'], { fill: C.mint });
  fchip(G, 480, 1440, ['sen', SP('2'), 'x'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), MINT, 52);
}
// ---------- nivel 2 · reducir potencias y ángulo medio ----------
const MR = { ox: 140, oy: 1150, s: 125, sy: 240 };
function level2(G, t) {
  starField(G, 435, 90);
  fchip(G, 540, 700, ['sen', SP('2'), 'x'], out(t, 61.0), MINT, 52);
  riseFormula(G, t, 61.4, 72.2, 540, 680, 54, ['sen', SP('2'), 'x', '=', FR('1 − cos 2x', '2')], { fill: C.sun });
  const kg = pop(t, 66.4) * (1 - eio(seg(t, 72.2, 72.6)));
  if (kg > 0.01) {
    const S = scaleAt(G, 540, 1000, kg);
    axes(S, t, 66.4, MR, 0, 2 * Math.PI + .2, -1.1, 1.2, { ticks: false });
    wave(S, MR, x => Math.cos(2 * x), 0, 2 * Math.PI, eio(seg(t, 66.8, 68.0)), C.n3, 5);
    wave(S, MR, x => Math.sin(x) ** 2, 0, 2 * Math.PI, eio(seg(t, 68.0, 69.6)), C.sun, 8);
    hline(S, MR, 1, 0, 2 * Math.PI, eio(seg(t, 69.6, 70.2)), C.mist, 3); hline(S, MR, .5, 0, 2 * Math.PI, eio(seg(t, 70.2, 70.8)), C.mint, 4);
    tag(S, MR.ox - 16, my(MR, 1) + 12, '1', pop(t, 69.8), C.mist, 34, 'end'); tag(S, MR.ox - 16, my(MR, .5) + 12, '½', pop(t, 70.4), C.mint, 34, 'end');
  }
  riseFormula(G, t, 73.0, 90.4, 540, 820, 52, ['sen', FR('θ', '2'), '=', '±', RAD('(1 − cos θ) / 2')]);
  riseFormula(G, t, 79.0, 90.4, 540, 1000, 46, ['sen 15°', '=', RAD('(1 − cos 30°) / 2'), '≈', '0.259'], { fill: C.sun });
  const kq = pop(t, 85.0);
  if (kq > 0.01) chip(G, 540, 1160, 'el signo: cuadrante de θ/2', kq, POS, C.night, 40);
  fchip(G, 480, 1440, ['45°'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 52);
}
// ---------- nivel 3 · el más lejos ----------
function level3(G, t) {
  starField(G, 437, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['45°'], out(t, 96.0), ZERO, 52);
  riseFormula(E, t, 96.4, 107.4, 540, 640, 50, ['R', '=', '40', '·', 'sen 2θ', '≤', '40']);
  const k = pop(t, 95.6);
  fireboat(E, t, t < 107.8 ? 45 : 60, k);
  if (k > 0.01) {
    jet(E, t, 45, eio(seg(t, 102.0, 103.4)), C.sun);
    const R45 = NZ[0] + 40 * PXM; if (t > 103.4) { dot(E, R45, NZ[1] + 30, pop(t, 103.4), C.sun, 14); tag(E, R45, NZ[1] + 130, '40 m', pop(t, 104.8), C.sun, 44); }
    if (t > 107.8) { jet(E, t, 30, eio(seg(t, 108.0, 109.0)), C.blue); jet(E, t, 60, eio(seg(t, 108.6, 109.6)), C.mint); const R30 = NZ[0] + range(30) * PXM; dot(E, R30, NZ[1] + 30, pop(t, 109.6), C.mint, 14); }
  }
  riseFormula(E, t, 108.2, 113.8, 540, 640, 46, ['sen 60°', '=', 'sen 120°', '≈', '0.866']);
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Ángulo doble', 'y ángulo medio', 900);
  label(p, t, 6.6, 12.4, 'EL CAÑÓN', '¿con qué ángulo', 'llega más lejos?');
  label(p, t, 12.8, 18.6, 'A 30°', 'unos 34.6 m', '¿y a 60°?');
  label(p, t, 19.0, 24.4, 'A 60°', 'también 34.6 m', 'el mismo alcance');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'no es casualidad', 'es el ángulo doble');
  label(p, t, 31.8, 37.8, 'β = α', 'en la fórmula', 'de la suma');
  label(p, t, 38.2, 44.2, 'SENO DOBLE', 'dos veces', 'seno por coseno');
  label(p, t, 44.6, 50.2, 'COMPRUEBA', 'con 30°', 'da sen 60°');
  label(p, t, 50.6, 56.6, 'COSENO DOBLE', 'tres formas', 'todas iguales');
  label(p, t, 60.0, 66.0, 'REDUCIR POTENCIAS', 'del coseno doble', 'despeja sen² x');
  label(p, t, 66.4, 72.2, 'LA GRÁFICA', 'de 0 a 1', 'el doble de rápida');
  label(p, t, 72.6, 78.4, 'ÁNGULO MEDIO', 'cambia x', 'por θ/2');
  label(p, t, 78.8, 84.4, 'sen 15°', 'sale de cos 30°', '≈ 0.259');
  label(p, t, 84.8, 90.4, 'EL SIGNO', 'según el cuadrante', 'de la mitad');
  label(p, t, 95.4, 101.4, 'ALCANCE MÁXIMO', 'el seno', 'vale a lo sumo 1');
  label(p, t, 101.8, 107.4, '2θ = 90°', 'θ = 45°', 'R = 40 m');
  label(p, t, 107.8, 114.0, '30° Y 60°', 'dobles: 60° y 120°', 'mismo seno');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['SENO DOBLE', ['sen 2θ', '=', '2', 'sen θ', 'cos θ']],
  ['COSENO DOBLE', ['cos', SP('2'), 'θ', '−', 'sen', SP('2'), 'θ']],
  ['REDUCIR', ['sen', SP('2'), 'x', '=', FR('1 − cos 2x', '2')]],
  ['ÁNGULO MEDIO', 'el signo, según el cuadrante'],
  ['ALCANCE', 'máximo a 45°'],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [1.0, 'paint', 1.6], [4.0, 'slide', 1.6], [9.8, 'rise'], [13.4, 'paint', 1.2], [14.6, 'pop', 1], [16.4, 'paint', 1.2], [17.6, 'yes'], [24.8, 'pop', 3],
  [32.8, 'rise'], [35.2, 'rise'], [41.4, 'rise'], [46.6, 'yes'], [50.8, 'rise'], [52.4, 'rise'], [54.0, 'rise'], [52.4, 'pop', 3],
  [61.4, 'rise'], [66.4, 'pop'], [66.8, 'paint', 1.2], [68.0, 'paint', 1.6], [73.0, 'rise'], [79.0, 'rise'], [85.0, 'card'], [88.0, 'pop', 1],
  [95.6, 'pop'], [96.4, 'rise'], [102.0, 'paint', 1.4], [103.4, 'yes'], [108.0, 'paint', 1.6], [108.2, 'rise'], [109.6, 'yes'],
]);
FILM.NARR = [
  [0.8, 3.6, 'Un barco bombero lanza un chorro de agua.'],
  [4.0, 6.6, 'Puede inclinar el cañón a cualquier ángulo.'],
  [7.0, 9.6, '¿Con qué ángulo llega más lejos?'],
  [9.8, 12.4, 'El alcance usa el seno del ángulo doble.'],
  [12.8, 15.6, 'Con treinta grados: unos treinta y cinco metros.'],
  [15.8, 18.6, 'Con sesenta… ¡también treinta y cinco!'],
  [19.0, 21.8, 'Dos ángulos distintos, el mismo alcance.'],
  [22.0, 24.4, '¿Casualidad?'],
  [24.8, 29.0, 'No: es el ángulo doble, y tiene sus fórmulas.'],
  [31.8, 34.8, 'En la suma, pon beta igual a alfa.'],
  [35.0, 37.8, 'Seno de dos theta: dos seno por coseno.'],
  [38.2, 41.0, 'Compruébalo con treinta grados:'],
  [41.2, 44.2, 'dos por un medio por raíz de tres medios.'],
  [44.6, 47.4, 'Raíz de tres sobre dos: seno de sesenta.'],
  [47.6, 50.2, 'El coseno doble tiene tres caras:'],
  [50.6, 53.6, 'coseno cuadrado menos seno cuadrado;'],
  [53.8, 56.6, 'o con un solo cuadrado, de dos formas.'],
  [60.0, 63.0, 'Despeja seno cuadrado del coseno doble.'],
  [63.2, 66.0, 'Uno menos coseno de dos x, entre dos.'],
  [66.4, 69.2, 'Su gráfica: una onda entre cero y uno.'],
  [69.4, 72.2, 'El coseno doble, volteado y a media altura.'],
  [72.6, 75.4, 'Cambia x por la mitad de un ángulo:'],
  [75.6, 78.4, 'nace la fórmula del ángulo medio.'],
  [78.8, 81.6, 'Seno de quince sale del coseno de treinta.'],
  [81.8, 84.4, 'Unos cero punto dos cinco nueve.'],
  [84.8, 87.6, 'El signo depende del cuadrante de la mitad.'],
  [87.8, 90.4, 'Volvamos al chorro.'],
  [95.4, 98.4, 'El alcance es cuarenta por seno de dos theta.'],
  [98.6, 101.4, 'El seno vale como mucho uno.'],
  [101.8, 104.6, 'Eso pasa cuando dos theta es noventa.'],
  [104.8, 107.4, 'Theta, cuarenta y cinco grados: cuarenta metros.'],
  [107.8, 110.6, 'Duplicados, treinta y sesenta dan 60 y 120.'],
  [110.8, 114.0, 'Ángulos suplementarios: mismo seno, mismo alcance.'],
  [115.4, 119.6, 'El chorro llega más lejos a cuarenta y cinco grados:'],
  [119.8, 124.4, 'ahí el ángulo doble es noventa, y el seno vale uno.'],
];
