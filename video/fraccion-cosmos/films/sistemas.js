// «Los nueve capítulos» · escenas de la lección alg-101. Motor en kit.js y fraccion.js; guion en sistemas.data.js.
// La primera ecuación en ámbar, la segunda en cian, la solución en verde, lo que se elimina en rosa.
const E1 = C.amber, E2 = C.cyan, SO = C.green, EL = C.mag;
// Plano de x ∈ [0, 14], y ∈ [0, 10] con origen (ox, oy) y escala u.
function plane(ox, oy, u) {
  stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox, oy); X.lineTo(ox + 14 * u, oy); X.moveTo(ox, oy); X.lineTo(ox, oy - 10 * u); }, { g: 4 });
  for (let i = 2; i <= 14; i += 2) T(String(i), ox + i * u, oy + 32, { k: 'r', s: 20, a: 'c', c: C.mute });
  for (let j = 2; j <= 10; j += 2) T(String(j), ox - 14, oy - j * u + 8, { k: 'r', s: 20, a: 'r', c: C.mute });
  T('x', ox + 14 * u + 10, oy + 10, { k: 'i', s: 28, c: C.mute }); T('y', ox - 10, oy - 10 * u - 14, { k: 'i', s: 28, c: C.mute });
  return (x, y) => [ox + x * u, oy - y * u];
}
function line(P, f, x0, x1, col, k = 1) { const [a, b] = P(x0, f(x0)), [c, d] = P(x1, f(x1)); stroke(col, 3, () => { X.moveTo(a, b); X.lineTo(lerp(a, c, k), lerp(b, d, k)); }, { g: 12 }); }
const G = [[3, 2, 1, 39], [2, 3, 1, 34], [1, 2, 3, 26]];
// Tabla de números (filas de coeficientes | término).
function table(x0, y0, rows, hl = -1) {
  rows.forEach((r, i) => r.forEach((v, j) => T(String(+v.toFixed(2)), x0 + j * 120 + (j === 3 ? 60 : 0), y0 + i * 80, { k: 'r', s: 44, a: 'c', c: i === hl ? EL : j === 3 ? SO : C.ink })));
  stroke('rgba(225,232,255,.5)', 2, () => { X.moveTo(x0 + 3 * 120 - 30, y0 - 50); X.lineTo(x0 + 3 * 120 - 30, y0 + rows.length * 80 - 40); }, { g: 0 });
}
const S = {
  // 1 · China: tres fajos de grano y la tabla.
  china(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('九章算術 · Los nueve capítulos', CX, 460, { k: 'r', s: 40, a: 'c', c: '#ffd9a0' }));
    fade(A(t, 9.6, .6), () => { [['buena', E1], ['media', E2], ['mala', C.violet]].forEach(([n, c], i) => { for (let k = 0; k < 3 - i; k++) bar(200 + i * 260 + k * 30, 600 - k * 10, 24, 160, c, 1, { fill: .3 }); T('cosecha ' + n, 260 + i * 260, 820, { k: 'mono', s: 22, a: 'c', c }); }); });
    fade(A(t, 18.6, .6), () => table(330, 960, G));
  },
  // 2 · Dos pistas: las monedas y la primera recta.
  monedas(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { for (let i = 0; i < 12; i++) { ring(200 + (i % 6) * 136, 600 + Math.floor(i / 6) * 150, 50, C.violet, 3); T('$', 200 + (i % 6) * 136, 614 + Math.floor(i / 6) * 150, { k: 'r', s: 36, a: 'c', c: C.violet }); } T('12 monedas · 3 900 pesos', CX, 930, { k: 'mono', s: 28, a: 'c', c: C.mute }); });
    fade(A(t, 10, .6), () => { const P = plane(160, 1220, 52); for (let x = 0; x <= 12; x++) fade(A(t, 10.4 + x * .2, .2), () => { const [a, b] = P(x, 12 - x); dot(a, b, 6, E1, 10); }); line(P, x => 12 - x, 0, 12, E1, seg(t, 13.4, 15)); fade(A(t, 20.2, .5), () => line(P, x => (3900 - 200 * x) / 500, 0, 14, E2, seg(t, 20.4, 22))); });
  },
  // 3 · El cruce en (7, 5).
  cruce(t) {
    stars(t, .3);
    const P = plane(160, 1220, 52);
    line(P, x => 12 - x, 0, 12, E1); line(P, x => (3900 - 200 * x) / 500, 0, 14, E2);
    fade(A(t, 1.2, .5), () => { const [a, b] = P(7, 5); dot(a, b, 13, SO, 30); ring(a, b, 26, SO, 2.5, seg(t, 1.2, 2.4)); });
    fade(A(t, 10.2, .6), () => { const [a, b] = P(7, 5); T('(7, 5)', a + 30, b - 20, { k: 'r', s: 44, c: SO, g: 10 }); });
    fade(A(t, 19.2, .6), () => { T('7 + 5 = 12', 620, 520, { k: 'mono', s: 28, c: E1 }); T('1 400 + 2 500 = 3 900', 620, 570, { k: 'mono', s: 28, c: E2 }); });
  },
  // 4 · Sustitución.
  sustitucion(t) {
    stars(t, .3);
    F([['x', 'i'], [' + ', 'r'], ['y', 'i', E1], [' = 12', 'r']], 300, 500, 52); F([['200', 'r'], ['x', 'i'], [' + 500', 'r'], ['y', 'i', E2], [' = 3 900', 'r']], 760, 500, 46);
    fade(A(t, 1.6, .5), () => F([['y', 'i', E1], [' = 12 − ', 'r'], ['x', 'i']], CX, 640, 64));
    fade(A(t, 10.2, .6), () => F([['200', 'r'], ['x', 'i'], [' + 500', 'r'], ['(12 − ', 'r', E1], ['x', 'i', E1], [')', 'r', E1], [' = 3 900', 'r']], CX, 780, 56));
    fade(A(t, 20.2, .6), () => { F([['−300', 'r'], ['x', 'i'], [' = −2 100  ⟹  ', 'r'], ['x', 'i', SO], [' = 7', 'r', SO]], CX, 900, 52); F([['y', 'i', SO], [' = 12 − 7 = 5', 'r', SO]], CX, 1000, 56); });
  },
  // 5 · Reducción: x desaparece al restar.
  reduccion(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['200', 'r', EL], ['x', 'i', EL], [' + 500', 'r'], ['y', 'i'], [' = 3 900', 'r']], CX, 540, 54); F([['200', 'r', EL], ['x', 'i', EL], [' + 200', 'r'], ['y', 'i'], [' = 2 400', 'r']], CX, 630, 54); T('× 200', 140, 630, { k: 'mono', s: 22, c: E1 }); });
    fade(A(t, 10.2, .6), () => { stroke(C.ink, 2, () => { X.moveTo(260, 670); X.lineTo(820, 670); }, { g: 0 }); T('−', 230, 640, { k: 'r', s: 48, a: 'c' }); F([['300', 'r'], ['y', 'i'], [' = 1 500', 'r']], CX, 740, 60); const k = seg(t, 10.6, 12); stroke(EL, 3, () => { X.moveTo(380, 510); X.lineTo(lerp(380, 460, k), lerp(510, 650, k)); }, { g: 10 }); });
    fade(A(t, 19.2, .6), () => F([['y', 'i', SO], [' = 5,  ', 'r', SO], ['x', 'i', SO], [' = 7', 'r', SO]], CX, 880, 64));
  },
  // 6 · Igualación: las dos y.
  igualacion(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['y', 'i', E1], [' = 12 − ', 'r'], ['x', 'i']], 300, 560, 52); F([['y', 'i', E2], [' = (3 900 − 200', 'r'], ['x', 'i'], [')/500', 'r']], 760, 560, 44); });
    fade(A(t, 10.2, .6), () => F([['12 − ', 'r', E1], ['x', 'i', E1], [' = (3 900 − 200', 'r', E2], ['x', 'i', E2], [')/500', 'r', E2]], CX, 720, 54));
    fade(A(t, 19.2, .6), () => { ['sustitución', 'reducción', 'igualación'].forEach((s, i) => chip(220 + i * 320, 900, 280, 80, [E1, E2, C.violet][i], s, { k: 'it', s: 36 })); T('→ (7, 5)', CX, 1040, { k: 'r', s: 52, a: 'c', c: SO }); });
  },
  // 7 · Paralelas y la misma recta.
  casos(t) {
    stars(t, .3);
    const P = plane(160, 1200, 52);
    line(P, x => 12 - x, 0, 12, E1, seg(t, .8, 2));
    fade(A(t, 1.6, .5), () => { line(P, x => 15 - x, 0, 14, E2, 1); });
    fade(A(t, 10.2, .6), () => T('nunca se cruzan: sin solución', 620, 520, { k: 'mono', s: 24, c: EL }));
    fade(A(t, 20.2, .6), () => { stroke(C.green, 7, () => { const [a, b] = P(0, 12), [c, d] = P(12, 0); X.moveTo(a, b); X.lineTo(c, d); }, { g: 20 }); T('2x + 2y = 24: la misma recta', CX, 470, { k: 'mono', s: 22, a: 'c', c: SO }); });
  },
  // 8 · La tabla china: restar filas.
  tabla(t) {
    stars(t, .3);
    const r1 = G[0], r2 = G[1].map((v, j) => 3 * v - 2 * r1[j]), r3 = G[2].map((v, j) => 3 * v - r1[j]);
    if (t < 10) table(330, 560, G);
    else if (t < 20) { table(330, 560, [r1, r2, G[2]], 1); T('3 · fila 2 − 2 · fila 1', CX, 870, { k: 'mono', s: 26, a: 'c', c: EL }); }
    else { const r3b = r3.map((v, j) => 5 * v - 4 * r2[j]); table(330, 560, [r1, r2, r3b], 2); T('se borran incógnitas hasta una escalera', CX, 870, { k: 'mono', s: 26, a: 'c', c: EL }); }
    fade(A(t, .8, .5), () => ['x', 'y', 'z'].forEach((v, j) => T(v, 330 + j * 120, 490, { k: 'i', s: 36, a: 'c', c: C.mute })));
  },
  // 9 · La escalera: z, y, x.
  escalera(t) {
    stars(t, .3);
    const st = [['36z = 99', 'z = 2.75', 0.8], ['5y + z = 24', 'y = 4.25', 10.2], ['3x + 2y + z = 39', 'x = 9.25', 19.2]];
    st.forEach(([e, r, t0], i) => fade(A(t, t0, .6), () => { const y = 1100 - i * 200, x = 200 + i * 120; stroke(hexA(SO, .6), 3, () => { X.moveTo(x - 40, y + 30); X.lineTo(x + 560, y + 30); X.lineTo(x + 560, y - 170); }, { g: 8 }); T(e, x, y - 20, { k: 'r', s: 40, c: C.ink }); T(r, x + 380, y - 20, { k: 'r', s: 40, c: SO, g: 10 }); }));
  },
  // 10 · Cierre: la tabla resuelta; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { table(330, 640, G); F([['9 ¼,  4 ¼,  2 ¾', 'r', SO]], CX, 1020, 64); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['(7, 5)', 'r', SO]], 'el cruce de dos rectas'], [[['y', 'i'], [' = 12 − ', 'r'], ['x', 'i']], 'sustitución'], [[['300', 'r'], ['y', 'i'], [' = 1 500', 'r']], 'reducción'], [[['paralelas', 'it', EL]], 'sin solución']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [E1, SO, E2]);
    });
  },
};
