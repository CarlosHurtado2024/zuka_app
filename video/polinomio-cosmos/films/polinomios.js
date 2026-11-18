// «La caja de cartón» · escenas de la lección alg-23a. Motor en kit.js y polinomio.js; guion en polinomios.data.js.
// Los términos en x² en ámbar, en x en cian, los números en verde; lo que cambia de signo en rosa.
const X2 = C.amber, X1 = C.cyan, X0 = C.green, SG = C.mag;
// La lámina de 30 × 20 con cortes de lado c (escala u px por cm), centrada en (cx, cy); f (0–1) dobla los bordes en perspectiva.
function sheet(cx, cy, u, c, f = 0) {
  const W2 = 30 * u, H2 = 20 * u, x0 = cx - W2 / 2, y0 = cy - H2 / 2, k = c * u;
  if (f < .02) {
    stroke(C.ink, 3, () => { X.moveTo(x0 + k, y0); X.lineTo(x0 + W2 - k, y0); X.lineTo(x0 + W2 - k, y0 + k); X.lineTo(x0 + W2, y0 + k); X.lineTo(x0 + W2, y0 + H2 - k); X.lineTo(x0 + W2 - k, y0 + H2 - k); X.lineTo(x0 + W2 - k, y0 + H2); X.lineTo(x0 + k, y0 + H2); X.lineTo(x0 + k, y0 + H2 - k); X.lineTo(x0, y0 + H2 - k); X.lineTo(x0, y0 + k); X.lineTo(x0 + k, y0 + k); X.closePath(); }, { g: 10 });
    stroke(hexA(X1, .6), 1.5, () => X.rect(x0 + k, y0 + k, W2 - 2 * k, H2 - 2 * k), { g: 0, dash: [8, 8] });
    [[x0, y0], [x0 + W2 - k, y0], [x0, y0 + H2 - k], [x0 + W2 - k, y0 + H2 - k]].forEach(([a, b]) => stroke(hexA(SG, .7), 2, () => X.rect(a, b, k, k), { g: 6, dash: [5, 5] }));
    return;
  }
  // caja en perspectiva: base (30 − 2c) × (20 − 2c), alto c
  const L = (30 - 2 * c) * u, Wd = (20 - 2 * c) * u * .45, Hh = c * u * f, bx = cx - L / 2 - Wd / 2, by = cy + 60;
  const P = (x, y, z) => [bx + x + y, by - y * .9 - z];
  const face = (pts, col, a) => { X.save(); X.beginPath(); pts.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.closePath(); X.fillStyle = hexA(col, a); X.fill(); X.restore(); stroke(col, 2.5, () => { pts.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.closePath(); }, { g: 10 }); };
  face([P(0, 0, 0), P(L, 0, 0), P(L, Wd, 0), P(0, Wd, 0)], X1, .12);
  face([P(0, Wd, 0), P(L, Wd, 0), P(L, Wd, Hh), P(0, Wd, Hh)], X1, .1);
  face([P(L, 0, 0), P(L, Wd, 0), P(L, Wd, Hh), P(L, 0, Hh)], X2, .14);
  face([P(0, 0, 0), P(0, Wd, 0), P(0, Wd, Hh), P(0, 0, Hh)], X2, .14);
  face([P(0, 0, 0), P(L, 0, 0), P(L, 0, Hh), P(0, 0, Hh)], X2, .18);
}
const S = {
  // 1 · Bagdad: el título del libro; cuadrados, raíces y números.
  bagdad(t) {
    stars(t, .5);
    fade(A(t, 1.2, .8), () => { T('الجبر', CX, 640, { k: 'r', s: 140, a: 'c', c: '#ffd9a0', g: 20 }); T('al-jabr · «restaurar»', CX, 730, { k: 'it', s: 40, a: 'c', c: '#c3ccec' }); });
    fade(A(t, 9.8, .6), () => { T('al-jabr → álgebra', CX, 860, { k: 'mono', s: 32, a: 'c', c: X1 }); T('al-Juarismi → algoritmo', CX, 920, { k: 'mono', s: 32, a: 'c', c: X1 }); });
    fade(A(t, 18.8, .6), () => [['cuadrados', 'x²', X2], ['raíces', 'x', X1], ['números', '7', X0]].forEach(([w, f, c], i) => fade(A(t, 19 + i * .7, .4), () => { chip(220 + i * 320, 1100, 280, 110, c, f, { s: 56, c, k: 'i' }); T(w, 220 + i * 320, 1200, { k: 'it', s: 34, a: 'c', c }); })));
  },
  // 2 · Las piezas: 2x² + 3x + 4 con flechas a coeficiente, variable, exponente y término independiente.
  terminos(t) {
    stars(t, .3);
    const r = F([['2', 'r', X2], ['x', 'i', X2], ['²', 'r', X2], [' + ', 'r'], ['3', 'r', X1], ['x', 'i', X1], [' + ', 'r'], ['4', 'r', X0]], CX, 720, 130, { rev: seg(t, .8, 3) });
    fade(A(t, 10.2, .6), () => { arrow(r.mid(0) - 40, 540, r.mid(0) - 4, 600, X2, 1, 2.5); T('coeficiente', r.mid(0) - 60, 520, { k: 'it', s: 32, a: 'c', c: X2 }); arrow(r.mid(1) + 20, 870, r.mid(1), 760, C.ink, 1, 2.5); T('variable', r.mid(1) + 30, 910, { k: 'it', s: 32, a: 'c', c: C.ink }); arrow(r.mid(2) + 60, 540, r.mid(2) + 10, 610, X2, 1, 2.5); T('exponente 0, 1, 2…', r.mid(2) + 120, 520, { k: 'it', s: 32, a: 'c', c: X2 }); });
    fade(A(t, 19.2, .6), () => { arrow(r.mid(7), 870, r.mid(7), 770, X0, 1, 2.5); T('término independiente', r.mid(7) - 40, 910, { k: 'it', s: 32, a: 'c', c: X0 }); });
    fade(A(t, 3.4, .5), () => T('términos = 3', 96, 1300, { k: 'mono', s: 26, c: X1, g: 8 }));
  },
  // 3 · El grado: 7x² − 3x⁵ + 1; el 5 brilla; un número solo es grado 0.
  grado(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { F([['x', 'i'], ['³', 'r', X2], [' + ', 'r'], ['x', 'i'], ['⁸', 'r', SG], [' − ', 'r'], ['x', 'i'], ['²', 'r', X2]], CX, 700, 110); T('grado 8', CX, 840, { k: 'r', s: 64, a: 'c', c: SG, g: 12 }); });
    fade(win(t, 10, 19.8), () => { const g = F([['7', 'r'], ['x', 'i'], ['²', 'r', X2], [' − 3', 'r'], ['x', 'i'], ['⁵', 'r', SG], [' + 1', 'r']], CX, 700, 110); ring(g.mid(5), 640, 40, SG, 3, seg(t, 11.4, 12.4)); T('grado 5 · no importa el orden ni el 7', CX, 840, { k: 'mono', s: 28, a: 'c', c: SG }); });
    fade(A(t, 20, .6), () => { F([['5', 'r', X0], [' = 5', 'r'], ['x', 'i'], ['⁰', 'r', X0]], CX, 720, 110); T('grado 0', CX, 840, { k: 'r', s: 64, a: 'c', c: X0, g: 12 }); });
  },
  // 4 · Semejantes: fichas x² se juntan; x² y x no.
  semejantes(t) {
    stars(t, .3);
    const m = eio(seg(t, 11, 13.5));
    for (let i = 0; i < 8; i++) { const from = i < 3 ? [180 + i * 90, 640] : [620 + (i - 3) * 90, 640], to = [180 + i * 92, 640]; chip(lerp(from[0], to[0], m), 640, 80, 80, i < 3 ? X2 : C.violet, 'x²', { s: 32, c: C.ink, k: 'i' }); }
    fade(A(t, 1, .5), () => { T('3x²', 270, 560, { k: 'r', s: 40, a: 'c', c: X2 }); fade(1 - m, () => T('5x²', 800, 560, { k: 'r', s: 40, a: 'c', c: C.violet })); });
    fade(A(t, 13.6, .5), () => F([['3', 'r', X2], ['x', 'i'], ['² + ', 'r'], ['5', 'r', C.violet], ['x', 'i'], ['² = ', 'r'], ['8', 'r', X0], ['x', 'i'], ['²', 'r']], CX, 820, 72));
    fade(A(t, 19.2, .6), () => { chip(400, 1040, 100, 100, X2, 'x²', { s: 40, k: 'i' }); T('+', CX, 1054, { k: 'r', s: 56, a: 'c' }); chip(680, 1040, 100, 60, X1, 'x', { s: 36, k: 'i' }); check(CX, 1170, 26, false, A(t, 20.4, .5)); T('no se juntan', CX, 1240, { k: 'mono', s: 26, a: 'c', c: SG }); });
  },
  // 5 · Sumar: dos polinomios en columnas.
  suma(t) {
    stars(t, .3);
    const cols = [X2, X1, X0], xs = [380, 620, 840], rows = [['4x²', '− x', '+ 3'], ['x²', '+ 5x', '− 7'], ['5x²', '+ 4x', '− 4']];
    rows.forEach((r, i) => fade(i < 2 ? A(t, 1 + i * 1.2, .5) : A(t, 20.2, .6), () => r.forEach((s, j) => T(s, xs[j], 600 + i * 120 + (i === 2 ? 40 : 0), { k: 'r', s: 56, a: 'c', c: cols[j], g: i === 2 ? 12 : 0 }))));
    fade(A(t, 10.2, .6), () => { xs.forEach((x, j) => stroke(hexA(cols[j], .5), 2, () => X.roundRect(x - 100, 530, 200, 300, 16), { g: 0, dash: [8, 8] })); stroke(C.ink, 2.5, () => { X.moveTo(240, 790); X.lineTo(960, 790); }, { g: 0 }); T('+', 200, 740, { k: 'r', s: 56, a: 'c' }); });
    fade(A(t, 22, .5), () => T('dos de grado 2 → grado 2 (o menos)', CX, 1060, { k: 'mono', s: 26, a: 'c', c: C.mute }));
  },
  // 6 · Restar: el signo cambia a todo el paréntesis.
  resta(t) {
    stars(t, .3);
    F([['−(', 'r', SG], ['x', 'i'], ['² + 5', 'r'], ['x', 'i'], [' − 7', 'r'], [')', 'r', SG]], CX, 620, 80);
    fade(A(t, 10.2, .6), () => { const r = F([['−', 'r', SG], ['x', 'i'], ['² ', 'r'], ['−', 'r', SG], [' 5', 'r'], ['x', 'i'], [' ', 'r'], ['+', 'r', SG], [' 7', 'r']], CX, 780, 80); [0, 3, 7].forEach(i => ring(r.mid(i), 760, 26, SG, 2.5, seg(t, 10.6, 11.6))); });
    fade(A(t, 19.2, .6), () => { F([['(4', 'r'], ['x', 'i'], ['² − ', 'r'], ['x', 'i'], [' + 3) − (', 'r'], ['x', 'i'], ['² + 5', 'r'], ['x', 'i'], [' − 7) = ', 'r']], CX, 960, 48); F([['3', 'r', X2], ['x', 'i'], ['² − 6', 'r', X1], ['x', 'i'], [' + 10', 'r', X0]], CX, 1060, 72); T('error común: −x² + 5x − 7', CX, 1150, { k: 'mono', s: 24, a: 'c', c: C.red }); });
  },
  // 7 · Multiplicar: el rectángulo (x + 3)(2x + 1).
  producto(t) {
    stars(t, .3);
    area(300, 470, 160, [1, 3], [2, 1], seg(t, 1.5, 6));
    fade(A(t, 10.2, .6), () => F([['2', 'r'], ['x', 'i'], ['² + ', 'r'], ['x', 'i', X1], [' + 6', 'r', X1], ['x', 'i', X1], [' + 3 = ', 'r'], ['2', 'r', X2], ['x', 'i', X2], ['² + 7', 'r'], ['x', 'i'], [' + 3', 'r', X0]], CX, 1110, 52));
    fade(A(t, 20.2, .6), () => F([['gr 1', 'r', X1], [' + ', 'r'], ['gr 1', 'r', X1], [' = ', 'r'], ['gr 2', 'r', X2], ['     x · 2x = 2x²', 'it', C.mute]], CX, 1220, 46));
  },
  // 8 · La caja: lámina con cortes, se dobla, volumen.
  caja(t) {
    stars(t, .3);
    const f = eio(seg(t, 11, 15)), c = 4;
    sheet(CX, 760, 28, c, f);
    fade(A(t, 2, .5) * (1 - f), () => { T('30 cm', CX, 760 - 280 - 20, { k: 'r', s: 34, a: 'c', c: C.ink }); T('20 cm', CX + 400, 770, { k: 'r', s: 34, a: 'r', c: C.ink }); T('x', CX - 420 + 56, 760 - 280 + 70, { k: 'i', s: 34, a: 'c', c: SG }); });
    fade(A(t, 15, .5), () => { T('alto x', 930, 700, { k: 'it', s: 30, a: 'r', c: X2 }); T('largo 30 − 2x', 400, 870, { k: 'it', s: 30, a: 'c', c: X1 }); T('ancho 20 − 2x', 860, 860, { k: 'it', s: 30, a: 'r', c: X1 }); });
    fade(A(t, 20.2, .6), () => { F([['V', 'i'], [' = ', 'r'], ['x', 'i', X2], ['(30 − 2', 'r', X1], ['x', 'i', X1], [')(20 − 2', 'r', X1], ['x', 'i', X1], [')', 'r', X1]], CX, 1180, 56); F([['= 4', 'r'], ['x', 'i'], ['³ − 100', 'r'], ['x', 'i'], ['² + 600', 'r'], ['x', 'i']], CX, 1260, 56); });
  },
  // 9 · Evaluar: V(4) y V(8), con su caja; la curva V(x) entre 0 y 10.
  evaluar(t) {
    stars(t, .3);
    const x0 = 180, y0 = 1180, sx = 76, sy = .5, V = x => x * (30 - 2 * x) * (20 - 2 * x);
    axes(x0, y0, 780, 600, 'x (cm)', 'V (cm³)', 1);
    curve(u => [x0 + u * sx, y0 - V(u) * sy], 0, 10, X1, seg(t, 1, 4));
    [[4, 10, X0], [8, 19, SG]].forEach(([x, t0, col]) => fade(A(t, t0, .5), () => { dot(x0 + x * sx, y0 - V(x) * sy, 12, col, 22); T('V(' + x + ') = ' + num(V(x)), x0 + x * sx + 20, y0 - V(x) * sy - 24, { k: 'r', s: 34, c: col }); }));
    fade(A(t, 10.6, .5), () => F([['4 · 22 · 12 = ', 'r'], ['1 056', 'r', X0]], CX, 470, 52));
    fade(A(t, 19.6, .5), () => F([['8 · 14 · 4 = ', 'r'], ['448', 'r', SG]], CX, 540, 52));
  },
  // 10 · Cierre: la caja terminada; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { sheet(CX, 720, 28, 4, 1); T('V(x) = 4x³ − 100x² + 600x', CX, 1060, { k: 'r', s: 48, a: 'c', c: X2, g: 10 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['3', 'r'], ['x', 'i'], ['² + 5', 'r'], ['x', 'i'], ['² = 8', 'r'], ['x', 'i'], ['²', 'r']], 'semejantes'], [[['−(', 'r'], ['a', 'i'], [' + ', 'r'], ['b', 'i'], [') = −', 'r'], ['a', 'i'], [' − ', 'r'], ['b', 'i']], 'restar: todo el paréntesis'], [[['gr', 'r'], ['(PQ)', 'i'], [' = gr ', 'r'], ['P', 'i'], [' + gr ', 'r'], ['Q', 'i']], 'multiplicar'], [[['V(4) = 1 056', 'r', X0]], 'evaluar']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [X2, X0, X1]);
    });
  },
};
