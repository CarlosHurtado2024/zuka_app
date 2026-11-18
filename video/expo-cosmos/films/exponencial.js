// «El reloj del carbono» · escenas de la lección alg-71. Motor en kit.js y expo.js; guion en exponencial.data.js.
// Lo que crece en ámbar, lo que decae en cian, la asíntota en rosa, e en verde.
const UP = C.amber, DN = C.cyan, AS = C.mag, EE = C.green;
// Plano con unidad u px y origen (ox, oy): P(x, y) → pantalla.
const plane = (ox, oy, ux, uy = ux) => (x, y) => [ox + x * ux, oy - y * uy];
function grid(ox, oy, x0, x1, y1, ux, uy = ux, k = 1) {
  stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(ox + x0 * ux, oy); X.lineTo(ox + lerp(x0, x1, k) * ux, oy); X.moveTo(ox, oy + 20); X.lineTo(ox, oy - y1 * uy * k); }, { g: 4 });
}
// Barra de carbono 14 que queda: fracción f, ancho w.
function c14(x, y, w, f, k = 1) { bar(x, y, w * f, 60, DN, k, { fill: .35 }); stroke('rgba(225,232,255,.45)', 2, () => X.rect(x, y, w, 60), { g: 0 }); }
const S = {
  // 1 · Libby y la muestra que se vacía.
  libby(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('Willard Libby · Chicago · 1949', CX, 460, { k: 'mono', s: 26, a: 'c', c: C.mute }));
    fade(A(t, 9.6, .6), () => { T('¹⁴C', CX, 640, { k: 'r', s: 120, a: 'c', c: DN, g: 20 }); T('carbono 14', CX, 720, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 18.6, .6), () => {
      const n = Math.min(4, Math.floor(seg(t, 19, 26) * 5));
      for (let i = 0; i <= n; i++) { c14(240, 820 + i * 90, 600, .5 ** i); T(i ? '1/' + 2 ** i : '1', 220, 862 + i * 90, { k: 'r', s: 34, a: 'r', c: C.ink }); T(num(5730 * i) + ' años', 860, 862 + i * 90, { k: 'mono', s: 24, a: 'l', c: C.mute }); }
    });
  },
  // 2 · y = 2^x: duplicar hacia la derecha, partir por la mitad hacia la izquierda.
  duplicar(t) {
    stars(t, .3);
    const xs = [-2, -1, 0, 1, 2, 3], lab = ['1/4', '1/2', '1', '2', '4', '8'];
    xs.forEach((x, i) => {
      const on = x >= 0 ? A(t, 1.5 + x * 1.5, .5) : A(t, 10.5 + (-x - 1) * 2.5, .5);
      fade(on, () => { const cx = 190 + i * 140; T(String(x).replace('-', '−'), cx, 380, { k: 'r', s: 40, a: 'c', c: C.mute }); bar(cx - 40, 900 - 60 * 2 ** x, 80, 60 * 2 ** x, x >= 0 ? UP : DN, 1, { fill: .3 }); T(lab[i], cx, 960, { k: 'r', s: 40, a: 'c', c: x >= 0 ? UP : DN }); });
    });
    T('x', 80, 380, { k: 'it', s: 40, a: 'c', c: C.mute }); T('2ˣ', 80, 960, { k: 'r', s: 40, a: 'c', c: C.mute });
    fade(A(t, 4, .5), () => arrow(560, 1040, 900, 1040, UP, 1, 3)); fade(A(t, 10.4, .5), () => arrow(520, 1040, 180, 1040, DN, 1, 3));
    fade(A(t, 4.4, .5), () => T('× 2', 730, 1100, { k: 'r', s: 36, a: 'c', c: UP })); fade(A(t, 10.8, .5), () => T('÷ 2', 350, 1100, { k: 'r', s: 36, a: 'c', c: DN }));
    fade(A(t, 19, .6), () => F([['y', 'i'], [' = 2', 'r'], ['x', 'i', UP]], CX, 1230, 72));
  },
  // 3 · La curva, la asíntota, dominio y rango.
  grafica(t) {
    stars(t, .3);
    const P = plane(CX, 1150, 110, 70); grid(CX, 1150, -4.4, 4.4, 9, 110, 70, eio(seg(t, .5, 2)));
    curve(x => P(x, 2 ** x), -4.3, 3.15, UP, seg(t, 1.5, 6));
    fade(A(t, 10, .6), () => { stroke(AS, 3, () => { X.setLineDash([14, 12]); X.moveTo(P(-4.4, 0)[0], 1150 - 6); X.lineTo(P(4.4, 0)[0], 1150 - 6); X.setLineDash([]); }, { g: 12 }); T('y = 0 · asíntota', P(-4.2, 0)[0], 1210, { k: 'mono', s: 24, a: 'l', c: AS }); });
    fade(A(t, 20, .6), () => { T('dominio: ℝ', 160, 520, { k: 'mono', s: 28, c: C.ink }); T('rango: (0, ∞)', 160, 570, { k: 'mono', s: 28, c: UP }); });
  },
  // 4 · La base: 3^x, 2^x, (1/2)^x y 1^x.
  base(t) {
    stars(t, .3);
    const P = plane(CX, 1150, 110, 70); grid(CX, 1150, -4.4, 4.4, 9, 110, 70);
    curve(x => P(x, 2 ** x), -4.3, 3.15, UP, seg(t, .5, 3)); fade(A(t, 3, .5), () => T('2ˣ', P(3.2, 8.5)[0] + 10, P(3, 8.5)[1], { k: 'r', s: 36, c: UP }));
    curve(x => P(x, 3 ** x), -4.3, 2, EE, seg(t, 3, 6)); fade(A(t, 6, .5), () => T('3ˣ', P(2, 9)[0] + 14, P(2, 9)[1] + 10, { k: 'r', s: 36, c: EE }));
    curve(x => P(x, .5 ** x), -3.15, 4.3, DN, seg(t, 10.5, 14)); fade(A(t, 14, .5), () => T('(1/2)ˣ', P(-3.2, 8.5)[0] - 10, P(-3, 8.5)[1], { k: 'r', s: 36, a: 'r', c: DN }));
    fade(A(t, 19.5, .6), () => { stroke(AS, 3, () => { X.moveTo(P(-4.3, 1)[0], P(0, 1)[1]); X.lineTo(P(4.3, 1)[0], P(0, 1)[1]); }, { g: 10 }); T('1ˣ = 1', P(4.3, 1)[0], P(0, 1)[1] - 16, { k: 'r', s: 34, a: 'r', c: AS }); });
  },
  // 5 · Vida media: la barra de carbono 14 se parte en dos cada 5 730 años.
  vidamedia(t) {
    stars(t, .3);
    const P = plane(170, 1100, 0.04, 500); grid(170, 1100, 0, 20000, 1.1, 0.04, 500);
    curve(x => P(x, .5 ** (x / 5730)), 0, 20000, DN, seg(t, 1, 6));
    fade(A(t, 10, .6), () => [1, 2, 3].forEach(i => { const [x, y] = P(5730 * i, .5 ** i); stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(x, 1100); X.lineTo(x, y); X.lineTo(170, y); }, { g: 0 }); dot(x, y, 10, DN, 20); T(num(5730 * i), x, 1150, { k: 'mono', s: 22, a: 'c', c: C.mute }); T('1/' + 2 ** i, 150, y + 10, { k: 'r', s: 30, a: 'r', c: DN }); }));
    T('años', 970, 1150, { k: 'mono', s: 22, a: 'r', c: C.mute }); T('1', 150, P(0, 1)[1] + 10, { k: 'r', s: 30, a: 'r', c: C.ink });
    fade(A(t, 20, .6), () => F([['N', 'i'], [' = ', 'r'], ['N', 'i'], ['₀ · (1/2)', 'r'], ['t/5730', 'spi', DN]], CX, 470, 60));
  },
  // 6 · Mitad de la mitad: casillas que se apagan.
  tabla(t) {
    stars(t, .3);
    const rows = [[0, 1], [5730, 1 / 2], [11460, 1 / 4], [17190, 1 / 8], [50000, .5 ** (50000 / 5730)]];
    rows.forEach(([y, f], i) => fade(A(t, [.8, 1.6, 5.5, 10, 19][i], .5), () => {
      const yy = 520 + i * 140; c14(330, yy, 600, f);
      T(num(y) + ' años', 300, yy + 42, { k: 'mono', s: 26, a: 'r', c: C.mute });
      T(i < 4 ? (i ? '1/' + 2 ** i : '1') : '≈ 0.002', 330 + 600 * f + 20, yy + 42, { k: 'r', s: 34, c: i === 3 ? UP : C.ink });
    }));
  },
  // 7 · Bernoulli: (1 + 1/n)^n con n cada vez más grande.
  bernoulli(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => T('Jacob Bernoulli · Basilea · 1683', CX, 460, { k: 'mono', s: 26, a: 'c', c: C.mute }));
    fade(A(t, 10, .6), () => F([['(1 + 1/', 'r'], ['n', 'i', EE], [')', 'r'], ['ⁿ', 'r', EE]], CX, 600, 80));
    const ns = [1, 2, 4, 12, 365, 10000];
    ns.forEach((n, i) => fade(A(t, 12 + i * 2.6, .5), () => { const v = (1 + 1 / n) ** n, y = 720 + i * 85; T('n = ' + num(n), 300, y, { k: 'mono', s: 28, a: 'r', c: C.mute }); bar(330, y - 34, 540 * (v - 1.9) / 0.9, 44, i > 3 ? EE : UP, 1, { fill: .3 }); T(v.toFixed(4), 1000, y, { k: 'r', s: 32, a: 'r', c: C.ink }); }));
    fade(A(t, 20, .6), () => { stroke(AS, 2, () => { X.setLineDash([10, 10]); X.moveTo(330 + 540 * (Math.E - 1.9) / .9, 690); X.lineTo(330 + 540 * (Math.E - 1.9) / .9, 1230); X.setLineDash([]); }, { g: 8 }); T('e', 330 + 540 * (Math.E - 1.9) / .9, 680, { k: 'it', s: 36, a: 'c', c: EE }); });
  },
  // 8 · El número e y la curva e^x entre 2^x y 3^x.
  e(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { T('e', CX - 230, 620, { k: 'it', s: 150, a: 'c', c: EE, g: 26 }); T('= 2.718281828459…', CX + 70, 600, { k: 'r', s: 52, a: 'c', c: C.ink }); });
    const P = plane(CX, 1250, 110, 55); fade(A(t, 10, .6), () => grid(CX, 1250, -4, 4, 10, 110, 55));
    curve(x => P(x, 2 ** x), -4, 3.3, UP, seg(t, 10.4, 12), 2.5); curve(x => P(x, 3 ** x), -4, 2.09, C.violet, seg(t, 10.4, 12), 2.5);
    curve(x => P(x, Math.exp(x)), -4, 2.3, EE, seg(t, 12, 15), 4.5);
    fade(A(t, 19, .6), () => { T('2ˣ', P(3.3, 9.8)[0] + 8, P(3.3, 9.8)[1] + 10, { k: 'r', s: 32, c: UP }); T('eˣ', P(2.3, 10)[0] + 10, P(2.3, 10)[1] + 20, { k: 'r', s: 36, c: EE }); T('3ˣ', P(2.09, 9.9)[0] - 50, P(2.09, 9.9)[1] + 10, { k: 'r', s: 32, c: C.violet }); });
  },
  // 9 · La edad de una muestra: 1/8 = (1/2)^3.
  igualar(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { c14(240, 480, 600, 1); c14(240, 570, 600, 1 / 8); T('en vida', 220, 522, { k: 'mono', s: 22, a: 'r', c: C.mute }); T('hoy', 220, 612, { k: 'mono', s: 22, a: 'r', c: C.mute }); T('1/8', 335, 612, { k: 'r', s: 32, c: UP }); });
    fade(A(t, 10, .6), () => F([['(1/2)', 'r'], ['t/5730', 'spi', UP], [' = 1/8 = (1/2)', 'r'], ['³', 'r', UP]], CX, 800, 54, { max: 980 }));
    fade(A(t, 20, .6), () => { F([['t', 'i', UP], ['/5730 = 3', 'r']], CX, 950, 60); F([['t', 'i', UP], [' = 17 190 años', 'r', UP]], CX, 1060, 64); check(CX + 330, 1040, 24, true, A(t, 21.5, .5)); });
  },
  // 10 · Cierre: resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { for (let i = 0; i < 4; i++) c14(240, 560 + i * 90, 600, .5 ** i); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['y', 'i'], [' = ', 'r'], ['b', 'i'], ['ˣ', 'r']], 'exponente variable'], [[['b', 'i'], [' > 1 · 0 < ', 'r'], ['b', 'i'], [' < 1', 'r']], 'crece · decrece'], [[['(1/2)', 'r'], ['t/5730', 'spi']], 'vida media'], [[['e', 'i'], [' ≈ 2.71828', 'r']], 'crecimiento continuo']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [UP, DN, EE]);
    });
  },
};
