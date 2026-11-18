// «La tablilla del cuadrado» · escenas de la lección alg-4. Motor en kit.js y parabola.js; guion en cuadraticas.data.js.
// La parábola en ámbar, las raíces en verde, el discriminante en cian, lo complejo en rosa.
const PA = C.amber, RT = C.green, DS = C.cyan, CX_ = C.mag;
function grid2(ox, oy, u, xr, yr) {
  stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox + xr[0] * u, oy); X.lineTo(ox + xr[1] * u, oy); X.moveTo(ox, oy - yr[0] * u); X.lineTo(ox, oy - yr[1] * u); }, { g: 4 });
  for (let i = Math.ceil(xr[0]); i <= xr[1]; i++) if (i) stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(ox + i * u, oy - 5); X.lineTo(ox + i * u, oy + 5); }, { g: 0 });
  return (x, y) => [ox + x * u, oy - y * u];
}
const S = {
  // 1 · La tablilla: un cuadrado y una barra; área + lado = 3/4.
  tablilla(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { X.save(); X.fillStyle = 'rgba(200,160,110,.12)'; X.beginPath(); X.roundRect(200, 400, 680, 360, 40); X.fill(); X.restore(); stroke('#d8b07a', 3, () => X.roundRect(200, 400, 680, 360, 40), { g: 10 }); const R = rng(3); for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) if (R() > .3) stroke(hexA('#d8b07a', .6), 2, () => { const x = 240 + c * 44, y = 450 + r * 50; X.moveTo(x, y); X.lineTo(x + 14, y + 10); X.lineTo(x, y + 20); }, { g: 0 }); T('tablilla BM 13901 · hacia 1800 a. C.', CX, 800, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
    fade(A(t, 9.6, .6), () => { const s = 220; bar(300, 900, s, s, PA, 1, { fill: .25 }); T('x²', 300 + s / 2, 900 + s / 2 + 14, { k: 'i', s: 44, a: 'c', c: C.ink }); bar(300 + s + 20, 900, 60, s, DS, 1, { fill: .25 }); T('x', 300 + s + 50, 900 + s / 2 + 14, { k: 'i', s: 36, a: 'c', c: C.ink }); T('= 3/4', 700, 900 + s / 2 + 14, { k: 'r', s: 60, c: C.ink }); });
    fade(A(t, 18.6, .6), () => F([['x', 'i', RT], ['² + ', 'r'], ['x', 'i', RT], [' = 3/4', 'r']], CX, 1250, 72));
  },
  // 2 · Las raíces: tres parábolas, con dos, una y ninguna raíz.
  raices(t) {
    stars(t, .3);
    F([['a', 'i'], ['x', 'i'], ['² + ', 'r'], ['b', 'i'], ['x', 'i'], [' + ', 'r'], ['c', 'i'], [' = 0', 'r']], CX, 470, 64);
    const cs = [[-2, RT], [0, DS], [1.5, CX_]];
    cs.forEach(([k, col], i) => fade(A(t, i ? 19 + i * .8 : 10.2, .6), () => { const P = grid2(200 + i * 340, 1000, 50, [-2.8, 2.8], [-2.5, 5]); curve(u => P(u, u * u + k), -2.6, 2.6, col, 1); if (k < 0) [-1, 1].forEach(s => { const [x, y] = P(s * Math.sqrt(-k), 0); dot(x, y, 10, RT, 20); }); if (k === 0) { const [x, y] = P(0, 0); dot(x, y, 10, RT, 20); } T(['dos', 'una', 'ninguna real'][i], 200 + i * 340, 1100, { k: 'mono', s: 24, a: 'c', c: col }); }));
  },
  // 3 · Producto cero: (x − 3)(x + 2) = 0.
  cero(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['a', 'i'], [' · ', 'r'], ['b', 'i'], [' = 0', 'r']], 300, 560, 64); T('⟹', CX, 560, { k: 'r', s: 60, a: 'c' }); F([['a', 'i'], [' = 0', 'r'], ['  o  ', 'it'], ['b', 'i'], [' = 0', 'r']], 800, 560, 56); });
    fade(A(t, 10.2, .6), () => { F([['x', 'i'], ['² − ', 'r'], ['x', 'i'], [' − 6 = (', 'r'], ['x', 'i'], [' − 3)(', 'r', RT], ['x', 'i'], [' + 2)', 'r', RT]], CX, 740, 56); T('−3 · 2 = −6     −3 + 2 = −1', CX, 820, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 20.2, .6), () => { const P = grid2(CX, 1180, 60, [-4, 5], [-1, 3]); curve(u => P(u, (u * u - u - 6) / 4), -2.9, 3.9, PA, 1); [-2, 3].forEach(r => { const [x, y] = P(r, 0); dot(x, y, 12, RT, 24); T(String(r).replace('-', '−'), x, y + 46, { k: 'r', s: 34, a: 'c', c: RT }); }); });
  },
  // 4 · Completar el cuadrado: la barra se parte en dos mitades y falta 1/4.
  completar(t) {
    stars(t, .3);
    const s = 300, h = 75, x0 = 300, y0 = 460, m = eio(seg(t, 10.6, 13));
    bar(x0, y0, s, s, PA, 1, { fill: .25 }); T('x²', x0 + s / 2, y0 + s / 2 + 14, { k: 'i', s: 48, a: 'c', c: C.ink });
    bar(lerp(x0 + s + 20, x0 + s, m), y0, h, s, DS, 1, { fill: .25 }); T('x/2', lerp(x0 + s + 20, x0 + s, m) + h / 2, y0 + s / 2 + 12, { k: 'r', s: 28, a: 'c', c: C.ink });
    X.save(); X.translate(lerp(x0 + s + 120, x0 + s, m), lerp(y0, y0 + s, m)); X.rotate(Math.PI / 2 * m); bar(0, 0, h, s, DS, 1, { fill: .25 }); X.restore(); fade(A(t, 2, .5), () => T('sin escala', x0 + s + 260, y0 + 40, { k: 'mono', s: 20, c: C.mute }));
    fade(A(t, 13.4, .5), () => { stroke(RT, 3, () => X.rect(x0 + s, y0 + s, h, h), { g: 14, dash: [6, 6] }); T('1/4', x0 + s + h / 2, y0 + s + h / 2 + 10, { k: 'r', s: 26, a: 'c', c: RT }); });
    fade(A(t, 15, .6), () => F([['(', 'r'], ['x', 'i'], [' + 1/2)² = 3/4 + 1/4 = ', 'r'], ['1', 'r', RT]], CX, 1020, 52));
    fade(A(t, 20.2, .6), () => F([['x', 'i', RT], [' + 1/2 = 1  ⟹  ', 'r'], ['x', 'i', RT], [' = 1/2', 'r', RT]], CX, 1130, 60));
  },
  // 5 · La fórmula general.
  formula(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { ['a x² + b x + c = 0', 'x² + (b/a) x = −c/a', '(x + b/2a)² = (b² − 4ac) / 4a²'].forEach((s, i) => fade(A(t, 1 + i * 2.4, .5), () => T(s, CX, 560 + i * 110, { k: 'r', s: 48, a: 'c', c: i === 2 ? PA : C.ink }))); });
    fade(A(t, 10, .6), () => { F([['x', 'i', RT], [' = ', 'r'], ['(−', 'r'], ['b', 'i'], [' ± √(', 'r'], ['b', 'i', DS], ['² − 4', 'r', DS], ['ac', 'i', DS], [')) / 2', 'r'], ['a', 'i']], CX, 760, 72); });
    fade(A(t, 20.2, .6), () => T('para cualquier ecuación cuadrática', CX, 900, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }));
  },
  // 6 · El corral de 96 m²: dos raíces, 8 y 12.
  corral(t) {
    stars(t, .3);
    const P = grid2(220, 1260, 34, [0, 21], [0, 12]);
    curve(u => P(u, u * (20 - u) / 10), 0, 20, PA, seg(t, 1, 3));
    fade(A(t, 2, .5), () => { stroke(DS, 2.5, () => { const [a, b] = P(0, 9.6), [c] = P(20.5, 9.6); X.moveTo(a, b); X.lineTo(c, b); }, { g: 8, dash: [8, 6] }); T('96 m²', P(20.5, 9.6)[0], P(0, 9.6)[1] - 14, { k: 'mono', s: 22, a: 'r', c: DS }); });
    fade(A(t, 10.2, .6), () => F([['x', 'i'], ['² − 20', 'r'], ['x', 'i'], [' + 96 = 0     ', 'r'], ['Δ', 'r', DS], [' = 400 − 384 = 16', 'r', DS]], CX, 480, 44, { max: 960 }));
    fade(A(t, 20.2, .6), () => { [8, 12].forEach(r => { const [x, y] = P(r, 9.6); dot(x, y, 12, RT, 24); T(String(r), x, P(r, 0)[1] + 40, { k: 'r', s: 34, a: 'c', c: RT }); stroke(hexA(RT, .5), 2, () => { X.moveTo(x, y); X.lineTo(x, P(r, 0)[1]); }, { g: 0, dash: [6, 6] }); }); F([['x', 'i'], [' = (20 ± 4)/2 = ', 'r'], ['12', 'r', RT], [' u ', 'it'], ['8', 'r', RT]], CX, 580, 48); });
  },
  // 7 · El discriminante: Δ cambia y la parábola sube o baja.
  discriminante(t) {
    stars(t, .3);
    const c = t < 19 ? -2 : t < 23 ? lerp(-2, 0, eio(seg(t, 19.2, 20.6))) : lerp(0, 2, eio(seg(t, 23.2, 24.6))), D_ = -4 * c, L = Math.sqrt(6 - c);
    const P = grid2(CX, 1100, 90, [-4, 4], [-2.5, 6]);
    curve(u => P(u, u * u + c), -L, L, PA, 1);
    if (c < 0) [-1, 1].forEach(s => { const [x, y] = P(s * Math.sqrt(-c), 0); dot(x, y, 11, RT, 22); }); else if (Math.abs(c) < .01) { const [x, y] = P(0, 0); dot(x, y, 11, RT, 22); }
    F([['y', 'i'], [' = ', 'r'], ['x', 'i'], ['² ' + (c < 0 ? '− ' : '+ ') + Math.abs(c).toFixed(1), 'r']], CX, 460, 56);
    T('Δ = ' + (Math.abs(D_) < .01 ? '0' : D_.toFixed(1)), CX, 560, { k: 'r', s: 56, a: 'c', c: D_ > .01 ? RT : D_ < -.01 ? CX_ : DS, g: 12 });
    T(D_ > .01 ? 'dos raíces reales' : D_ < -.01 ? 'ninguna raíz real' : 'una raíz', CX, 1260, { k: 'mono', s: 30, a: 'c', c: C.mute });
  },
  // 8 · Raíces complejas: x² + 2x + 5 = 0 → −1 ± 2i, en el plano.
  complejas(t) {
    stars(t, .3);
    F([['x', 'i'], ['² + 2', 'r'], ['x', 'i'], [' + 5 = 0', 'r']], CX, 470, 64);
    fade(A(t, 1.6, .5), () => F([['Δ', 'r', DS], [' = 4 − 20 = ', 'r'], ['−16', 'r', CX_]], CX, 560, 52));
    fade(A(t, 10.2, .6), () => F([['x', 'i'], [' = (−2 ± ', 'r'], ['4', 'r'], ['i', 'i', CX_], [') / 2 = −1 ± 2', 'r'], ['i', 'i', CX_]], CX, 680, 56));
    fade(win(t, 10, 19.8), () => { const P = grid2(CX, 1240, 60, [-4, 3], [-.5, 8]); curve(u => P(u, u * u + 2 * u + 5), -3.6, 1.6, PA, 1); const [vx, vy] = P(-1, 4); dot(vx, vy, 10, PA, 18); T('nunca toca el eje', vx + 30, vy + 10, { k: 'mono', s: 22, c: C.mute }); });
    fade(A(t, 20.2, .6), () => { const P = grid2(CX, 1060, 80, [-3, 3], [-2.6, 2.6]); for (let j = -2; j <= 2; j++) if (j) stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(CX - 5, 1060 - j * 80); X.lineTo(CX + 5, 1060 - j * 80); }, { g: 0 }); T('real', CX + 230, 1100, { k: 'mono', s: 20, a: 'r', c: C.mute }); T('imaginario', CX + 14, 1060 - 200, { k: 'mono', s: 20, c: C.mute }); [[-1, 2], [-1, -2]].forEach(([a, b]) => { const [x, y] = P(a, b); dot(x, y, 12, CX_, 24); T((b > 0 ? '−1 + 2i' : '−1 − 2i'), x - 20, y + (b > 0 ? -16 : 40), { k: 'r', s: 32, a: 'r', c: CX_ }); }); });
  },
  // 9 · Suma y producto de las raíces.
  suma(t) {
    stars(t, .3);
    F([['x', 'i'], ['₁ + ', 'r'], ['x', 'i'], ['₂ = −', 'r'], ['b', 'i'], ['/', 'r'], ['a', 'i']], 300, 560, 56);
    fade(A(t, 10.2, .6), () => F([['x', 'i'], ['₁', 'r'], ['x', 'i'], ['₂ = ', 'r'], ['c', 'i'], ['/', 'r'], ['a', 'i']], 800, 560, 56));
    fade(A(t, 1.4, .6), () => F([['3 + (−2) = ', 'r'], ['1', 'r', RT]], 300, 680, 48));
    fade(A(t, 11, .6), () => F([['3 · (−2) = ', 'r'], ['−6', 'r', RT]], 800, 680, 48));
    fade(A(t, 19.2, .6), () => { F([['x', 'i'], ['² − ', 'r'], ['x', 'i'], [' − 6 = (', 'r'], ['x', 'i'], [' − 3)(', 'r'], ['x', 'i'], [' + 2)', 'r']], CX, 880, 56); T('raíces 3 y −2: en los factores, con el signo cambiado', CX, 960, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 10 · Cierre: la fórmula y la parábola del corral; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { F([['x', 'i', RT], [' = (−', 'r'], ['b', 'i'], [' ± √', 'r'], ['Δ', 'r', DS], [') / 2', 'r'], ['a', 'i']], CX, 760, 84); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], ['b', 'i'], [' = 0 ⟹ ', 'r'], ['a', 'i'], [' = 0 o ', 'r'], ['b', 'i'], [' = 0', 'r']], 'producto cero'], [[['(', 'r'], ['x', 'i'], [' + 1/2)² = 1', 'r']], 'completar el cuadrado'], [[['Δ', 'r', DS], [' = ', 'r'], ['b', 'i'], ['² − 4', 'r'], ['ac', 'i']], 'cuántas raíces'], [[['−1 ± 2', 'r', CX_], ['i', 'i', CX_]], 'Δ < 0: complejas']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [PA, RT, DS]);
    });
  },
};
