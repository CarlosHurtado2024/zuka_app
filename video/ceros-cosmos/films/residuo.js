// «El atajo de Horner» · escenas de la lección alg-92. Motor en kit.js y ceros.js; guion en residuo.data.js.
// Los coeficientes en ámbar, c en cian, la fila de resultados en verde, el residuo en rosa.
const CF = C.amber, CC = C.cyan, RW = C.green, RZ = C.mag;
// Tabla de división sintética: coeficientes cs, número c; k (0–len) cuántas columnas van resueltas.
function synth(x0, y0, cs, c, k) {
  const w = 150, out = [], mid = [];
  let acc = 0; cs.forEach((a, i) => { const v = i ? a + acc * c : a; if (i) mid.push(acc * c); out.push(v); acc = v; });
  T(String(c), x0 - 60, y0, { k: 'r', s: 52, a: 'c', c: CC, g: 10 });
  stroke(C.ink, 2, () => { X.moveTo(x0 - 20, y0 - 60); X.lineTo(x0 - 20, y0 + 120); X.moveTo(x0 - 20, y0 + 130); X.lineTo(x0 + w * cs.length, y0 + 130); }, { g: 0 });
  cs.forEach((a, i) => T(neg(a), x0 + i * w + w / 2, y0, { k: 'r', s: 52, a: 'c', c: CF }));
  for (let i = 0; i < cs.length; i++) {
    const q = clamp(k - i); if (q <= 0) break;
    fade(q, () => { if (i) { T(neg(mid[i - 1]), x0 + i * w + w / 2, y0 + 90, { k: 'r', s: 40, a: 'c', c: CC }); arrow(x0 + (i - 1) * w + w / 2 + 30, y0 + 160, x0 + i * w + w / 2 - 40, y0 + 76, hexA(CC, .6), 1, 2); } const last = i === cs.length - 1; T(neg(out[i]), x0 + i * w + w / 2, y0 + 200, { k: 'r', s: 52, a: 'c', c: last ? RZ : RW, g: last ? 14 : 0 }); });
  }
  return out;
}
function axisPlot(t, ox, oy, u, k, hl = []) {
  const P = (x, y) => [ox + x * u, oy - y * u * .4], f = x => (x + 1) * (x - 2) * (x - 3);
  stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox - 2 * u, oy); X.lineTo(ox + 4.4 * u, oy); X.moveTo(ox, oy + 120); X.lineTo(ox, oy - 360); }, { g: 4 });
  for (let i = -2; i <= 4; i++) if (i) T(String(i).replace('-', '−'), ox + i * u, oy + 36, { k: 'r', s: 24, a: 'c', c: C.mute });
  curve(x => P(x, f(x)), -1.15, 3.6, CF, k);
  hl.forEach(([x, col]) => { const [a, b] = P(x, f(x)); dot(a, b, 11, col, 22); });
  return P;
}
const S = {
  // 1 · Horner, 1819: tres fechas en una línea de tiempo.
  horner(t) {
    stars(t, .5);
    const px = nline(110, 990, 760, 1200, 1900, { step: 100, lab: v => v % 200 === 0 && v !== 1800, s: 24 });
    [[1247, 'Qin Jiushao', 9.6], [1804, 'Ruffini', 9.6 + 1.6], [1819, 'Horner', 1]].forEach(([y, n, t0], i) => fade(A(t, t0, .5), () => { dot(px(y), 760, 12, i === 2 ? CF : CC, 22); T(n, px(y) + (i === 1 ? -40 : i === 2 ? 40 : 0), 700 - (i === 1 ? 50 : 0), { k: 'it', s: 32, a: 'c', c: i === 2 ? CF : CC }); T(String(y), px(y), 830 + (i === 1 ? 40 : 0), { k: 'mono', s: 22, a: 'c', c: C.mute }); }));
    fade(A(t, 18.6, .6), () => T('evaluar polinomios con pocas multiplicaciones', CX, 1000, { k: 'mono', s: 26, a: 'c', c: RW }));
  },
  // 2 · El secreto: (x − c) Q(x) se vuelve cero en x = c.
  secreto(t) {
    stars(t, .3);
    const r = F([['P', 'i'], ['(', 'r'], ['x', 'i'], [') = ', 'r'], ['(', 'r'], ['x', 'i'], [' − ', 'r'], ['c', 'i', CC], [')', 'r'], ['Q', 'i'], ['(', 'r'], ['x', 'i'], [')', 'r'], [' + ', 'r'], ['R', 'i', RZ]], CX, 640, 72);
    fade(A(t, 10.2, .6), () => { F([['P', 'i'], ['(', 'r'], ['c', 'i', CC], [') = ', 'r'], ['(', 'r'], ['c', 'i', CC], [' − ', 'r'], ['c', 'i', CC], [')', 'r'], ['Q', 'i'], ['(', 'r'], ['c', 'i', CC], [')', 'r'], [' + ', 'r'], ['R', 'i', RZ]], CX, 800, 72); const k = seg(t, 12, 14); fade(k, () => { stroke(RZ, 4, () => { X.moveTo(r.mid(4) - 10, 830); X.lineTo(r.mid(12) + 10, 740); }, { g: 12 }); T('0', (r.mid(4) + r.mid(12)) / 2, 900, { k: 'r', s: 52, a: 'c', c: RZ }); }); });
    fade(A(t, 20.2, .6), () => { F([['P', 'i'], ['(', 'r'], ['c', 'i', CC], [') = ', 'r'], ['R', 'i', RZ]], CX, 1060, 110); T('teorema del residuo', CX, 1150, { k: 'mono', s: 26, a: 'c', c: RZ }); });
  },
  // 3 · Sin dividir: P(1) = 4.
  ejemplo(t) {
    stars(t, .3);
    F([['P', 'i'], ['(', 'r'], ['x', 'i'], [') = ', 'r'], ['x', 'i'], ['³ − 4', 'r'], ['x', 'i'], ['² + ', 'r'], ['x', 'i'], [' + 6', 'r']], CX, 520, 64);
    fade(A(t, 10.2, .6), () => F([['P', 'i'], ['(1) = 1 − 4 + 1 + 6 = ', 'r'], ['4', 'r', RZ]], CX, 660, 60, { rev: seg(t, 10.4, 13) }));
    fade(A(t, 19.2, .6), () => { T('residuo 4 ≠ 0', CX, 780, { k: 'r', s: 48, a: 'c', c: RZ }); T('x − 1 no es factor', CX, 860, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 4, .5), () => axisPlot(t, 400, 1220, 110, 1, t > 19 ? [[1, RZ]] : []));
  },
  // 4 · Teorema del factor: P(2) = 0.
  teorema(t) {
    stars(t, .3);
    F([['P', 'i'], ['(2) = 8 − 16 + 2 + 6 = ', 'r'], ['0', 'r', RW]], CX, 520, 60, { rev: seg(t, 1, 4) });
    fade(A(t, 10.2, .6), () => { F([['P', 'i'], ['(', 'r'], ['c', 'i', CC], [') = 0', 'r']], 300, 680, 64); T('⟺', CX, 680, { k: 'r', s: 56, a: 'c' }); F([['(', 'r'], ['x', 'i'], [' − ', 'r'], ['c', 'i', CC], [')', 'r'], [' factor', 'it']], 790, 680, 56); });
    fade(A(t, 20.2, .6), () => axisPlot(t, 400, 1200, 110, 1, [[2, RW]]));
  },
  // 5 · División sintética: la tabla para c = 2.
  sintetica(t) {
    stars(t, .3);
    synth(270, 620, [1, -4, 1, 6], 2, t < 10 ? 0 : t < 20 ? 1 + seg(t, 10.4, 16) : 2 + seg(t, 20.4, 26) * 2);
    fade(A(t, 1, .5), () => ['x³', 'x²', 'x', '1'].forEach((s, i) => T(s, 270 + i * 150 + 75, 520, { k: 'mono', s: 26, a: 'c', c: C.mute })));
  },
  // 6 · El cociente: la última fila.
  cociente(t) {
    stars(t, .3);
    synth(270, 520, [1, -4, 1, 6], 2, 4);
    fade(A(t, 1, .5), () => { stroke(RW, 3, () => X.roundRect(270, 670, 450, 80, 14), { g: 12 }); F([['x', 'i', RW], ['² − 2', 'r', RW], ['x', 'i', RW], [' − 3', 'r', RW]], CX, 880, 64); });
    fade(A(t, 10.2, .6), () => F([['P', 'i'], [' = (', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], ['² − 2', 'r'], ['x', 'i'], [' − 3)', 'r']], CX, 1000, 56));
    fade(A(t, 19.2, .6), () => F([['= (', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], [' − 3)(', 'r'], ['x', 'i'], [' + 1)', 'r']], CX, 1100, 56));
  },
  // 7 · Evaluar rápido: la cuenta anidada.
  evaluar(t) {
    stars(t, .3);
    const steps = ['1', '1 · 2 − 4 = −2', '−2 · 2 + 1 = −3', '−3 · 2 + 6 = 0'];
    steps.forEach((s, i) => fade(A(t, 10.4 + i * 1.6, .5), () => T(s, CX, 560 + i * 80, { k: 'r', s: 44, a: 'c', c: i === 3 ? RZ : RW })));
    fade(A(t, 1, .6), () => F([['P', 'i'], ['(2)', 'r'], [' = residuo al dividir entre ', 'it'], ['x', 'i'], [' − 2', 'r']], CX, 460, 52));
    fade(A(t, 20.2, .6), () => { T('multiplicaciones: 3', 300, 1000, { k: 'mono', s: 30, a: 'c', c: RW }); T('por potencias: 6', 780, 1000, { k: 'mono', s: 30, a: 'c', c: C.mute }); T('1 · 2 · 2 · 2,  4 · 2 · 2,  1 · 2', CX, 1060, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
  },
  // 8 · Buscar ceros: tabla de valores y el cambio de signo.
  buscar(t) {
    stars(t, .3);
    const vals = [[-2, -20], [-1, 0], [0, 6], [1, 4], [2, 0], [3, 0], [4, 10]];
    vals.forEach(([x, v], i) => fade(A(t, i === 0 ? 10.2 : i === 1 ? 20.2 : 1 + (i - 2) * .6, .4), () => { T('P(' + String(x).replace('-', '−') + ') = ' + String(v).replace('-', '−'), 120 + (i % 4) * 230, 520 + Math.floor(i / 4) * 70, { k: 'r', s: 34, c: v === 0 ? RW : v < 0 ? RZ : CF }); }));
    fade(A(t, 10.2, .6), () => axisPlot(t, 420, 1260, 110, 1, t > 20 ? [[-1, RW], [2, RW], [3, RW]] : [[2, RW], [3, RW]]));
    fade(win(t, 10.4, 19.8), () => T('signos contrarios: la curva cruza en medio', CX, 760, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 9 · La curva: cruza en −1, 2 y 3; la altura en 1 es el residuo 4.
  curva(t) {
    stars(t, .3);
    const P = axisPlot(t, 400, 1150, 120, seg(t, .8, 3), [[-1, RW], [2, RW], [3, RW]]);
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['x', 'i'], [' + 1)(', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], [' − 3)', 'r']], CX, 480, 64));
    fade(A(t, 19.2, .6), () => { const [a, b] = P(1, 4); stroke(RZ, 3, () => { X.moveTo(a, 1150); X.lineTo(a, b); }, { g: 12 }); dot(a, b, 11, RZ, 22); T('P(1) = 4', a + 20, b - 10, { k: 'r', s: 34, c: RZ }); });
  },
  // 10 · Cierre: la tabla de Horner; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => synth(270, 620, [1, -4, 1, 6], 2, 4));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['P', 'i'], ['(', 'r'], ['c', 'i'], [') = ', 'r'], ['R', 'i']], 'teorema del residuo'], [[['P', 'i'], ['(', 'r'], ['c', 'i'], [') = 0 ⟺ ', 'r'], ['x', 'i'], [' − ', 'r'], ['c', 'i'], [' factor', 'it']], 'teorema del factor'], [[['1  −2  −3  0', 'r', RW]], 'división sintética'], [[['(', 'r'], ['x', 'i'], [' + 1)(', 'r'], ['x', 'i'], [' − 2)(', 'r'], ['x', 'i'], [' − 3)', 'r']], 'los tres factores']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [CF, RW, CC]);
    });
  },
};
