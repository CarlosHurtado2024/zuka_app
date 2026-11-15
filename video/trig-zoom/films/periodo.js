// «Periodo, desfase y tangente» (lección trig-44b, Mar de las Ondas, video 9) en estilo Scale Zoom Explainer.
// Ejemplos propios (no salen en los ejercicios): sen 2x (periodo π), sen(2πx) (periodo 1), sen(x − π/3) y la trampa
// sen(2x − π/3) = sen 2(x − π/6); la mancha del faro sobre una costa recta a distancia 1: tan θ, asíntota en 90°.
// Hilo: de noche todos los faros se ven iguales; los barcos los distinguen por su ritmo. Además, el haz barre una costa
// recta: ¿hasta dónde llega la mancha? Sorpresa anunciada: más lejos de lo que imaginas (sin límite). Cierre: la tangente
// se dispara cerca de 90°.
const POSTER = 44;
const FILM = stdFilm({
  open: { Z0: 1.8, C: [540, 1000], t1: 3.8, t2: 6.0 },
  aims: ['el periodo', 'el desfase', 'la tangente'],
  stops: ['los faros', 'el periodo', 'el desfase', 'la tangente'],
  wides: [[72.6, 74.2], [104.8, 106.4]],
  smiles: [[47.6, 49.4], [119.0, 135]],
});
function beam(p, x, y, deg, L, k = 1, col = C.sun) {
  if (k <= 0.01) return;
  const a = pc(x, y, L, deg + 4), b = pc(x, y, L, deg - 4);
  el('path', { d: `M${r1(x)},${r1(y)}L${r1(a[0])},${r1(a[1])}L${r1(b[0])},${r1(b[1])}Z`, fill: col, opacity: 1 }, p);
}
function level0(G, t) {
  starField(G, 381, 150);
  const k1 = pop(t, 0.3) * (1 - eio(seg(t, 12.4, 12.8)));
  if (k1 > 0.01) {
    const S = scaleAt(G, 540, 1100, k1);
    sea(S, t, 1250, -200, W + 200, 1, 6);
    [[300, 6, C.sun], [780, 3, C.mint]].forEach(([x, T, col]) => {
      const top = lighthouse(S, x, 1250, 300, 1, 1), a = (t / T) * 360;
      beam(S, top[0], top[1], a, 420, 1, col); beam(S, top[0], top[1], a + 180, 420, 1, col);
      lighthouse(S, x, 1250, 300, 1, 1);
      tag(S, x, 1330, `cada ${T} s`, pop(t, 7.2 + (T === 3 ? .6 : 0)), col, 40);
    });
  }
  const k2 = pop(t, 12.8) * out(t, 28.8);
  if (k2 > 0.01) {
    const S = scaleAt(G, 540, 1100, k2), L = [540, 926], Dy = 760;
    el('rect', { x: -200, y: Dy - 30, width: 1480, height: 30, fill: C.mintD }, S);
    el('rect', { x: -200, y: Dy - 200, width: 1480, height: 170, fill: C.mint }, S);
    sea(S, t, 1250, -200, W + 200, 1, 6);
    const th = 75 * eio(seg(t, 15.8, 22.4)) * (1 - eio(seg(t, 24.0, 24.8))), d = L[1] - Dy, sx = 540 + d * Math.tan(th * D2R);
    const tip = [sx, Dy];
    el('path', { d: `M${L[0]},${L[1]}L${r1(sx - 30)},${Dy}L${r1(sx + 30)},${Dy}Z`, fill: C.sun }, S);
    lighthouse(S, 540, 1250, 300, 1, 1);
    el('ellipse', { cx: r1(Math.min(sx, 1300)), cy: Dy - 8, rx: 46, ry: 16, fill: C.cream }, S);
    if (t > 19.0 && t < 24.6) tag(S, 540, Dy - 230, '¿hasta dónde?', pop(t, 19.2), C.cream, 44);
    void tip;
  }
  fchip(G, 480, 1440, ['periodo'], pop(t, 24.8) * (1 + .1 * wob(t, 25.2, 14, 6)), ZERO, 50);
}
// ---------- nivel 1 · el periodo ----------
const MP = { ox: 140, oy: 1000, s: 125, sy: 150 };
function level1(G, t) {
  starField(G, 383, 90);
  fchip(G, 540, 700, ['periodo'], out(t, 32.4), ZERO, 50);
  axes(G, t, 32.0, MP, 0, 2 * Math.PI + .3, -1.3, 1.3, { ticks: false });
  piTicks(G, t, 32.6, MP, [[Math.PI / 2, FR('π', '2')], [Math.PI, 'π'], [1.5 * Math.PI, FR('3π', '2')], [2 * Math.PI, '2π']]);
  const b = kf(t, [[38.4, 1], [40.4, 2], [50.6, 2], [52.0, 2 * Math.PI]]);
  wave(G, MP, Math.sin, 0, 2 * Math.PI, 1, b > 1.05 ? C.n3 : C.sun, b > 1.05 ? 5 : 8);
  if (b > 1.05) wave(G, MP, x => Math.sin(b * x), 0, 2 * Math.PI, 1, C.mint, 7);
  const kp = eio(seg(t, 35.0, 35.8)) * (1 - eio(seg(t, 38.2, 38.6)));
  if (kp > 0.01) { el('rect', { x: MP.ox, y: MP.oy + 190, width: r1(2 * Math.PI * MP.s * kp), height: 8, rx: 4, fill: C.sun }, G); tag(G, MP.ox + Math.PI * MP.s, MP.oy + 250, 'un periodo: 2π', kp, C.sun, 40); }
  const kq = eio(seg(t, 44.8, 45.6)) * (1 - eio(seg(t, 50.4, 50.6)));
  if (kq > 0.01) { el('rect', { x: MP.ox, y: MP.oy + 190, width: r1(Math.PI * MP.s * kq), height: 8, rx: 4, fill: C.mint }, G); el('rect', { x: r1(MP.ox + Math.PI * MP.s + 6), y: MP.oy + 190, width: r1(Math.max(0, Math.PI * MP.s * kq - 6)), height: 8, rx: 4, fill: C.mintD }, G); tag(G, MP.ox + Math.PI * MP.s / 2, MP.oy + 250, 'π', kq, C.mint, 44); }
  riseFormula(G, t, 41.4, 50.2, 540, 680, 54, ['y', '=', 'sen 2x'], { fill: C.mint });
  riseFormula(G, t, 47.8, 56.6, 540, 790, 50, ['periodo', '=', FR('2π', 'b')]);
  riseFormula(G, t, 50.8, 56.6, 540, 680, 50, ['y', '=', 'sen(2πx)', ':', FR('2π', '2π'), '=', '1'], { fill: C.mint });
  fchip(G, 480, 1440, ['desfase'], pop(t, 52.4) * (1 + .1 * wob(t, 53.0, 14, 6)) * (t > 52 ? 1 : 0), ZERO, 48);
}
// ---------- nivel 2 · el desfase ----------
function level2(G, t) {
  starField(G, 385, 90);
  fchip(G, 540, 700, ['desfase'], out(t, 61.0), ZERO, 48);
  const ko = 1 - eio(seg(t, 84.4, 84.8));
  if (ko > 0.01) {
    const S = scaleAt(G, 540, 1000, ko);
    axes(S, t, 60.2, MP, 0, 2 * Math.PI + .3, -1.3, 1.3, { ticks: false });
    piTicks(S, t, 60.6, MP, [[Math.PI / 6, FR('π', '6')], [Math.PI / 3, FR('π', '3')], [Math.PI, 'π'], [2 * Math.PI, '2π']]);
    const two = t > 72.6, sh = two ? kf(t, [[73.0, Math.PI / 3], [78.8, Math.PI / 3], [80.4, Math.PI / 6]]) : (Math.PI / 3) * eio(seg(t, 66.6, 68.4));
    if (!two) { wave(S, MP, Math.sin, 0, 2 * Math.PI, 1, C.n3, 5); wave(S, MP, x => Math.sin(x - sh), 0, 2 * Math.PI, eio(seg(t, 60.6, 61.8)), C.sun, 8); }
    else { wave(S, MP, x => Math.sin(2 * x), 0, 2 * Math.PI, 1, C.n3, 5); wave(S, MP, x => Math.sin(2 * (x - sh)), 0, 2 * Math.PI, 1, t < 78.8 ? C.coral : C.mint, 8); }
    if (sh > 0.02) { el('rect', { x: MP.ox, y: MP.oy - 4, width: r1(sh * MP.s), height: 8, rx: 4, fill: two && t > 78.8 ? C.mint : C.sun }, S); }
    if (two && t < 78.8) badge(S, mx(MP, Math.PI / 3) + 60, MP.oy - 210, pop(t, 75.8), false);
  }
  riseFormula(G, t, 66.6, 72.2, 540, 680, 52, ['y', '=', 'sen', '(x', '−', FR('π', '3'), ')']);
  riseFormula(G, t, 72.8, 78.4, 540, 680, 46, ['sen', '2(x', '−', FR('π', '3'), ')', '≠', 'sen', '(2x', '−', FR('π', '3'), ')'], { fill: C.coral });
  riseFormula(G, t, 79.0, 84.4, 540, 680, 52, ['sen', '2(x', '−', FR('π', '6'), ')', ':', FR('c', 'b'), '=', FR('π', '6')], { fill: C.mint });
  const kc = pop(t, 85.0) * (1 - eio(seg(t, 90.6, 91.0)));
  if (kc > 0.01) { const S = scaleAt(G, 540, 1100, kc); el('rect', { x: -200, y: 730, width: 1480, height: 30, fill: C.mintD }, S); sea(S, t, 1250, -200, W + 200, 1, 6); lighthouse(S, 540, 1250, 300, 1, 1); }
  fchip(G, 480, 1440, ['tan θ'], pop(t, 88.0) * (1 + .1 * wob(t, 88.6, 14, 6)), ZERO, 50);
}
// ---------- nivel 3 · la tangente ----------
const MT9 = { ox: 330, oy: 1010, s: 120, sy: 70 };
function level3(G, t) {
  starField(G, 387, 90);
  const E = endFade(G, t); if (!E) return;
  fchip(E, 540, 700, ['tan θ'], out(t, 96.0), ZERO, 50);
  const k1 = pop(t, 95.4) * (1 - eio(seg(t, 107.4, 107.8)));
  if (k1 > 0.01) {
    const S = scaleAt(E, 540, 1000, k1), L = [240, 1200], cx = 560, d = cx - L[0];
    el('rect', { x: cx, y: 300, width: 600, height: 1200, fill: C.mint }, S);
    el('rect', { x: cx, y: 300, width: 24, height: 1200, fill: C.mintD }, S);
    const th = kf(t, [[96.0, 0], [97.6, 40], [101.8, 40], [104.6, 84]]), sy = L[1] - d * Math.tan(th * D2R);
    el('path', { d: `M${L[0]},${L[1]}L${cx},${r1(sy - 16)}L${cx},${r1(sy + 16)}Z`, fill: C.sun }, S);
    el('ellipse', { cx: cx + 10, cy: r1(Math.max(sy, -400)), rx: 18, ry: 40, fill: C.cream }, S);
    shaded(S, 'circle', { cx: L[0], cy: L[1], r: 34 }, C.coral, C.coralD, 3, 3);
    el('line', { x1: L[0], y1: L[1], x2: cx, y2: L[1], stroke: C.mist, 'stroke-width': 4, 'stroke-dasharray': '10 10' }, S);
    tag(S, (L[0] + cx) / 2, L[1] + 50, '1', 1, C.mist, 42);
    if (th > 5) { arcDeg(S, L[0], L[1], 90, 0, th, 1, C.cream, 6); text(S, L[0] + 120, L[1] - 20, Math.round(th) + '°', { 'font-size': 38, 'font-weight': 600, fill: C.cream, 'data-pass': 1 }); }
    if (sy > 480) { segAB(S, [cx - 30, L[1]], [cx - 30, sy], 1, C.coral, 8); tag(S, cx - 46, (L[1] + sy) / 2, 'tan θ', 1, C.coral, 38, 'end'); }
  }
  const k2 = pop(t, 107.8);
  if (k2 > 0.01) {
    const S = scaleAt(E, 540, 1000, k2);
    axes(S, t, 107.8, MT9, -1.6, 4.8, -4.5, 4.5, { ticks: false });
    for (const a of [-Math.PI / 2, Math.PI / 2, 1.5 * Math.PI]) vline(S, MT9, a, -4.5, 4.5, eio(seg(t, 108.0, 108.6)), C.coral, 4);
    for (const off of [0, Math.PI]) wave(S, MT9, x => Math.tan(x), -Math.PI / 2 + off + .02, Math.PI / 2 + off - .02, eio(seg(t, 108.4 + off * .4, 109.6 + off * .4)), C.sun, 7, -4.6, 4.6);
    piTicks(S, t, 108.2, MT9, [[Math.PI / 2, FR('π', '2')], [Math.PI, 'π'], [1.5 * Math.PI, FR('3π', '2')]], C.mist, 30);
  }
}
FILM.levels = [level0, level1, level2, level3];

FILM.labels = (p, t) => {
  titleCard(p, t, 'Periodo, desfase', 'y tangente', 900);
  label(p, t, 6.6, 12.4, 'EL RITMO', 'cada faro', 'gira a su paso');
  label(p, t, 12.8, 18.6, 'LA COSTA', 'el haz barre', 'una orilla recta');
  label(p, t, 19.0, 24.4, 'LA MANCHA', 'corre por la orilla', '¿hasta dónde llega?');
  label(p, t, 24.8, 29.0, 'UN AVISO', 'más lejos', 'de lo que imaginas');
  label(p, t, 31.8, 37.8, 'EL PERIODO', 'lo que tarda', 'en repetirse');
  label(p, t, 38.2, 44.2, 'EL DOBLE DE RÁPIDO', 'y = sen 2x', 'caben dos ondas');
  label(p, t, 44.6, 50.2, 'PERIODO', '2π ÷ b', 'aquí: π');
  label(p, t, 50.6, 56.6, 'b COMPRIME', 'de lado', 'sen(2πx): periodo 1');
  label(p, t, 60.0, 66.0, 'EL DESFASE', 'misma onda', 'empieza después');
  label(p, t, 66.4, 72.2, 'CORRIDA π/3', 'a la derecha');
  label(p, t, 72.6, 78.4, 'LA TRAMPA', 'sen(2x − π/3)', 'no se corre π/3');
  label(p, t, 78.8, 84.4, 'SACA EL b', 'desfase = c ÷ b', 'aquí: π/6');
  label(p, t, 84.8, 90.4, 'LA COSTA', 'la mancha de luz', 'otra función');
  label(p, t, 95.4, 101.4, 'LA TANGENTE', 'a distancia 1', 'la mancha = tan θ');
  label(p, t, 101.8, 107.4, 'CERCA DE 90°', 'el haz va paralelo', 'la mancha huye');
  label(p, t, 107.8, 114.0, 'PERIODO π', 'asíntotas', 'en π/2 + kπ');
};
FILM.summary = (p, t) => summaryList(p, t, 114.8, 'En resumen', [
  ['PERIODO', ['2π', '÷', 'b']],
  ['b', 'comprime la onda de lado'],
  ['DESFASE', ['c', '÷', 'b', ', no c']],
  ['TANGENTE', 'se repite cada π'],
  ['ASÍNTOTAS', ['x', '=', FR('π', '2'), '+', 'kπ']],
]);
FILM.events = () => stdEvents([
  [0.3, 'pop'], [7.2, 'pop', 1], [7.8, 'pop', 2], [12.8, 'pop'], [15.8, 'slide', 6.6], [19.2, 'card'], [24.8, 'pop', 3],
  [32.0, 'paint', 1.0], [35.0, 'paint', .8], [38.4, 'slide', 2.0], [41.4, 'rise'], [44.8, 'paint', .8], [47.8, 'rise'], [50.6, 'slide', 1.4], [50.8, 'rise'], [52.4, 'pop', 3],
  [60.2, 'paint', 1.0], [66.6, 'slide', 1.8], [66.6, 'rise'], [72.8, 'rise'], [75.8, 'no'], [78.8, 'slide', 1.6], [79.0, 'rise'], [80.4, 'yes'], [85.0, 'pop'], [88.0, 'pop', 1],
  [95.4, 'pop'], [96.0, 'slide', 1.6], [101.8, 'slide', 2.8], [104.8, 'away', .4], [107.8, 'paint', 1.0], [108.4, 'paint', 2.4],
]);
FILM.NARR = [
  [0.8, 3.6, 'De noche, todos los faros se ven iguales.'],
  [4.0, 6.6, '¿Cómo sabe un barco cuál es cuál?'],
  [7.0, 9.6, 'Por su ritmo: cada faro gira distinto.'],
  [9.8, 12.4, 'Uno gira cada seis segundos; otro, cada tres.'],
  [12.8, 15.6, 'Además, su haz barre una costa recta.'],
  [15.8, 18.6, 'La mancha de luz corre por la orilla.'],
  [19.0, 21.8, 'Cuanto más gira, más lejos llega.'],
  [22.0, 24.4, '¿Hasta dónde puede llegar?'],
  [24.8, 29.0, 'La respuesta: más lejos de lo que imaginas.'],
  [31.8, 34.8, 'La onda seno se repite cada dos pi.'],
  [35.0, 37.8, 'Ese tramo se llama periodo.'],
  [38.2, 41.0, 'Si el faro gira el doble de rápido…'],
  [41.2, 44.2, 'la onda es seno de dos x.'],
  [44.6, 47.4, 'Caben dos ondas: el periodo es pi.'],
  [47.6, 50.2, 'En general: dos pi entre b.'],
  [50.6, 53.6, 'Seno de dos pi x se repite cada unidad.'],
  [53.8, 56.6, 'b no estira hacia arriba: comprime de lado.'],
  [60.0, 63.0, 'Dos faros con el mismo ritmo.'],
  [63.2, 66.0, 'Uno empieza un poco más tarde.'],
  [66.4, 69.2, 'Seno de x menos pi tercios:'],
  [69.4, 72.2, 'la onda se corre pi tercios.'],
  [72.6, 75.4, 'Ojo: seno de dos x menos pi tercios.'],
  [75.6, 78.4, 'No se corre pi tercios.'],
  [78.8, 81.6, 'Saca el dos: x menos pi sextos.'],
  [81.8, 84.4, 'El desfase es c entre b: pi sextos.'],
  [84.8, 87.6, 'Y ahora, la mancha en la costa.'],
  [87.8, 90.4, 'Ahí aparece otra función.'],
  [95.4, 98.4, 'La mancha está a tangente de theta.'],
  [98.6, 101.4, 'Opuesto entre adyacente, con distancia uno.'],
  [101.8, 104.6, 'Cerca de noventa grados, el haz va paralelo.'],
  [104.8, 107.4, 'La mancha huye sin fin: una asíntota.'],
  [107.8, 110.6, 'Tras media vuelta, el otro haz repite todo.'],
  [110.8, 114.0, 'La tangente tiene periodo pi.'],
  [115.4, 119.6, 'La mancha de luz no tiene límite:'],
  [119.8, 124.4, 'cerca de noventa grados, la tangente se dispara al infinito.'],
];
