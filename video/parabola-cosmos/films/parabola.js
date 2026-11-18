// «La curva de Galileo» · escenas de la lección alg-4a. Motor en kit.js y parabola.js; guion en parabola.data.js.
// La plantilla y = x² en cian, la curva movida en ámbar, el vértice en verde, lo que se voltea en rosa.
const PL = C.cyan, MV = C.amber, VX = C.green, FL = C.mag;
// Ejes de una gráfica con origen (ox, oy), u px por unidad, rangos [x0, x1] × [y0, y1]; devuelve P(x, y).
function grid(ox, oy, u, xr, yr, k = 1) {
  stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox + xr[0] * u, oy); X.lineTo(ox + (xr[0] + (xr[1] - xr[0]) * k) * u, oy); X.moveTo(ox, oy - yr[0] * u); X.lineTo(ox, oy - (yr[0] + (yr[1] - yr[0]) * k) * u); }, { g: 4 });
  for (let i = Math.ceil(xr[0]); i <= xr[1]; i++) if (i) stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(ox + i * u, oy - 5); X.lineTo(ox + i * u, oy + 5); }, { g: 0 });
  for (let j = Math.ceil(yr[0]); j <= yr[1]; j++) if (j) stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(ox - 5, oy - j * u); X.lineTo(ox + 5, oy - j * u); }, { g: 0 });
  return (x, y) => [ox + x * u, oy - y * u];
}
function graph(P, f, x0, x1, col, k = 1, lw = 3.5) { curve(u => P(u, f(u)), x0, x1, col, k, lw); }
const S = {
  // 1 · Galileo, 1638: una trayectoria que avanza parejo y cae cada vez más.
  galileo(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('Galileo Galilei · Dos nuevas ciencias, 1638', CX, 450, { k: 'mono', s: 24, a: 'c', c: C.mute }));
    const n = Math.floor(seg(t, 9.6, 17) * 9);
    for (let i = 0; i <= n; i++) { const x = 160 + i * 90, y = 620 + 6 * i * i; dot(x, y, 9, MV, 16); stroke(hexA(PL, .4), 1.5, () => { X.moveTo(x, 600); X.lineTo(x, y); }, { g: 0, dash: [4, 8] }); }
    fade(A(t, 11, .5), () => T('mismo avance cada paso; caída 1, 4, 9, 16…', CX, 1180, { k: 'mono', s: 24, a: 'c', c: C.mute }));
    fade(A(t, 18.6, .6), () => curve(u => [160 + u * 90, 620 + 6 * u * u], 0, 9, VX, seg(t, 18.8, 21)));
  },
  // 2 · La plantilla y = x²: vértice y simetría.
  base(t) {
    stars(t, .3);
    const P = grid(CX, 1100, 80, [-5, 5], [-1, 8]);
    graph(P, x => x * x, -2.9, 2.9, PL, seg(t, 1, 4));
    [0, 1, 2].forEach((x, i) => fade(A(t, 2 + i * .8, .4), () => { const [px, py] = P(x, x * x); dot(px, py, 9, PL, 16); T(String(x * x), px + 20, py - 6, { k: 'r', s: 28, c: PL }); }));
    fade(A(t, 10.2, .6), () => { const [px, py] = P(0, 0); dot(px, py, 13, VX, 28); T('vértice', px + 24, py + 48, { k: 'it', s: 36, c: VX }); });
    fade(A(t, 19.2, .6), () => { stroke(hexA(VX, .5), 2, () => { X.moveTo(CX, 1100); X.lineTo(CX, 420); }, { g: 0, dash: [8, 8] }); [-2, 2].forEach(x => { const [px, py] = P(x, 4); dot(px, py, 10, MV, 18); }); stroke(hexA(MV, .6), 2, () => { const [a, b] = P(-2, 4), [c] = P(2, 4); X.moveTo(a, b); X.lineTo(c, b); }, { g: 0, dash: [6, 6] }); T('(−2)² = 2² = 4', CX, 760, { k: 'r', s: 34, a: 'c', c: MV }); });
  },
  // 3 · Moverla: la plantilla viaja a (4, 1).
  mover(t) {
    stars(t, .3);
    const P = grid(300, 1120, 80, [-2, 8], [-1, 8]);
    graph(P, x => x * x, -2.6, 2.6, hexA(PL, .4), 1, 2);
    const h = 4 * eio(seg(t, 2, 6)), k = t < 10 ? 0 : 1 * eio(seg(t, 10.6, 13));
    graph(P, x => (x - h) ** 2 + k, h - 2.6, h + 2.6, MV, 1);
    const [vx, vy] = P(h, k); dot(vx, vy, 12, VX, 26); T('(' + h.toFixed(1).replace('.0', '') + ', ' + k.toFixed(1).replace('.0', '') + ')', vx + 18, vy + 40, { k: 'r', s: 32, c: VX });
    F([['y', 'i'], [' = (', 'r'], ['x', 'i'], [' − ' + h.toFixed(1).replace('.0', '') + ')² + ' + k.toFixed(1).replace('.0', ''), 'r', MV]], CX, 460, 60);
    fade(A(t, 20.2, .6), () => F([['y', 'i'], [' = ', 'r'], ['a', 'i', FL], ['(', 'r'], ['x', 'i'], [' − ', 'r'], ['h', 'i', VX], [')² + ', 'r'], ['k', 'i', VX]], CX, 1290, 56));
  },
  // 4 · La abertura: a = 3, 1, 1/3 y negativo.
  abrir(t) {
    stars(t, .3);
    const P = grid(CX, 840, 70, [-6, 6], [-5, 6]);
    const a = t < 10 ? lerp(1, 3, (Math.sin(t * .8) + 1) / 2) * (t < 5 ? 1 : 1) : t < 19 ? (seg(t, 10.6, 13) < .5 ? lerp(1, .15, eio(seg(t, 10.6, 11.8))) : lerp(-.15, -1, eio(seg(t, 11.8, 13)))) : (Math.sin(t * .9) > 0 ? 1 : -1);
    const av = t < 10 ? (t < 3 ? 1 : t < 6 ? 3 : 1 / 3) : a;
    const lim = Math.min(5.5, Math.sqrt(5.5 / Math.max(.05, Math.abs(av))));
    graph(P, x => av * x * x, -lim, lim, av < 0 ? FL : MV, 1);
    T('a = ' + (Math.abs(av - 1 / 3) < 1e-6 ? '1/3' : av.toFixed(2).replace('.00', '')), 96, 1300, { k: 'mono', s: 28, c: av < 0 ? FL : MV, g: 8 });
    const [vx, vy] = P(0, 0); dot(vx, vy, 11, VX, 22);
    fade(A(t, 19.2, .6), () => T(av < 0 ? 'vértice = máximo' : 'vértice = mínimo', CX, 1270, { k: 'r', s: 44, a: 'c', c: VX }));
  },
  // 5 · El corral: rectángulos de ancho x y largo 20 − x; la curva del área.
  corral(t) {
    stars(t, .3);
    const x = 10 + 8 * Math.sin(t * .5), sc = 18;
    fade(A(t, .8, .6), () => { stroke(MV, 3, () => X.rect(CX - (20 - x) * sc / 2, 440, (20 - x) * sc, x * sc), { g: 12 }); T('x = ' + x.toFixed(1), CX - (20 - x) * sc / 2 - 14, 440 + x * sc / 2, { k: 'mono', s: 22, a: 'r', c: PL }); T('20 − x', CX, 430, { k: 'mono', s: 22, a: 'c', c: PL }); T('área = ' + (x * (20 - x)).toFixed(0) + ' m²', CX, 820, { k: 'mono', s: 30, a: 'c', c: MV, g: 8 }); });
    fade(A(t, 10.2, .6), () => { const P = grid(220, 1300, 30, [0, 21], [0, 14]); graph(P, u => u * (20 - u) / 10, 0, 20, MV, seg(t, 10.4, 13)); const [px, py] = P(x, x * (20 - x) / 10); dot(px, py, 10, VX, 20); T('A (÷10)', 230, 870, { k: 'mono', s: 20, c: C.mute }); });
  },
  // 6 · Completar el cuadrado: −(x − 10)² + 100.
  completar(t) {
    stars(t, .3);
    F([['A', 'i'], [' = −', 'r'], ['x', 'i'], ['² + 20', 'r'], ['x', 'i']], CX, 520, 64);
    fade(A(t, 10.2, .6), () => { F([['= −(', 'r'], ['x', 'i'], ['² − 20', 'r'], ['x', 'i'], [')', 'r']], CX, 640, 60); F([['x', 'i'], ['² − 20', 'r'], ['x', 'i'], [' = (', 'r'], ['x', 'i'], [' − 10)² − 100', 'r', MV]], CX, 760, 52); });
    fade(A(t, 20.2, .6), () => { F([['A', 'i'], [' = −(', 'r'], ['x', 'i'], [' − 10)² + 100', 'r', VX]], CX, 920, 68); T('vértice (10, 100)', CX, 1010, { k: 'r', s: 44, a: 'c', c: VX, g: 10 }); });
  },
  // 7 · El atajo: −b/2a.
  atajo(t) {
    stars(t, .3);
    F([['h', 'i', VX], [' = −', 'r'], ['b', 'i'], [' / 2', 'r'], ['a', 'i']], CX, 600, 110);
    fade(A(t, 10.2, .6), () => { F([['−20 / (2 · (−1)) = ', 'r'], ['10', 'r', VX]], CX, 800, 60); F([['A', 'i'], ['(10) = 10 · 10 = ', 'r'], ['100', 'r', VX]], CX, 900, 60); });
    fade(A(t, 19.2, .6), () => { const P = grid(CX - 300, 1280, 30, [0, 21], [0, 8]); graph(P, u => u * (20 - u) / 14, 0, 20, MV, 1); [4, 16].forEach(x => { const [a, b] = P(x, x * (20 - x) / 14); dot(a, b, 9, PL, 16); }); const [vx, vy] = P(10, 100 / 14); dot(vx, vy, 12, VX, 24); stroke(hexA(VX, .5), 2, () => { X.moveTo(vx, vy); X.lineTo(vx, 1280); }, { g: 0, dash: [6, 6] }); });
  },
  // 8 · Simetría: A(4) = A(16); el mejor es el cuadrado de 10 × 10.
  simetria(t) {
    stars(t, .3);
    const sc = 22;
    fade(A(t, .8, .6), () => { stroke(PL, 3, () => X.rect(160, 460, 16 * sc, 4 * sc), { g: 10 }); T('4 × 16 = 64', 160 + 8 * sc, 600, { k: 'r', s: 34, a: 'c', c: PL }); stroke(PL, 3, () => X.rect(720, 460, 4 * sc, 16 * sc), { g: 10 }); T('16 × 4 = 64', 762, 880, { k: 'r', s: 34, a: 'c', c: PL }); });
    fade(A(t, 10.2, .6), () => F([['(4 + 16) / 2 = ', 'r'], ['10', 'r', VX]], 360, 760, 52));
    fade(A(t, 20.2, .6), () => { stroke(VX, 4, () => X.rect(CX - 5 * sc, 960, 10 * sc, 10 * sc), { g: 16 }); T('10 × 10 = 100 m²', CX, 1230, { k: 'r', s: 44, a: 'c', c: VX }); });
  },
  // 9 · La antena: rayos paralelos que rebotan al foco.
  antena(t) {
    stars(t, .3);
    const P = grid(CX, 1100, 70, [-6, 6], [0, 9], 1), f = 2;
    graph(P, x => x * x / (4 * f), -5.5, 5.5, MV, 1, 4);
    const [fx, fy] = P(0, f); dot(fx, fy, 12, VX, 30); T('foco', fx + 18, fy - 14, { k: 'it', s: 32, c: VX });
    const back = t > 19;
    for (let i = -4; i <= 4; i++) { if (!i) continue; const x = i * 1.2, y = x * x / (4 * f), [px, py] = P(x, y), k = seg(t, 10 + Math.abs(i) * .2, 12 + Math.abs(i) * .2); const top = P(x, 9)[1];
      if (!back) { stroke(hexA(PL, .8), 2, () => { X.moveTo(px, top); X.lineTo(px, lerp(top, py, clamp(k * 2))); if (k > .5) X.lineTo(lerp(px, fx, (k - .5) * 2), lerp(py, fy, (k - .5) * 2)); }, { g: 8 }); }
      else { const k2 = seg(t, 19.4, 21.4); stroke(hexA(C.amber, .8), 2, () => { X.moveTo(fx, fy); X.lineTo(lerp(fx, px, clamp(k2 * 2)), lerp(fy, py, clamp(k2 * 2))); if (k2 > .5) X.lineTo(px, lerp(py, top, (k2 - .5) * 2)); }, { g: 8 }); } }
  },
  // 10 · Cierre: la plantilla movida y volteada; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const P = grid(CX, 900, 70, [-6, 6], [-5, 6]); graph(P, x => x * x, -2.4, 2.4, PL, 1); graph(P, x => -((x - 2) ** 2) + 4, -.4, 4.4, MV, 1); graph(P, x => .3 * (x + 3) ** 2 - 3, -6, 0, FL, 1); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], ['(', 'r'], ['x', 'i'], [' − ', 'r'], ['h', 'i'], [')² + ', 'r'], ['k', 'i']], 'vértice (h, k)'], [[['h', 'i'], [' = −', 'r'], ['b', 'i'], ['/2', 'r'], ['a', 'i']], 'atajo'], [[['a', 'i'], [' < 0', 'r']], 'abre hacia abajo: máximo'], [[['10 × 10', 'r', VX]], 'el corral de mayor área']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [PL, VX, MV]);
    });
  },
};
