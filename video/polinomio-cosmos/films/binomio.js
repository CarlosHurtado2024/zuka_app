// «El tablero de Galton» · escenas de la lección alg-24c. Motor en kit.js y polinomio.js; guion en binomio.data.js.
// a en ámbar, b en cian, los coeficientes (caminos) en verde, lo que se elige en rosa.
const CA = C.amber, CB = C.cyan, CO = C.green, EL = C.mag;
const BIN = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - i + 1) / i; return Math.round(r); };
// Tablero de Galton de n filas con vértice en (cx, y0) y paso s; o.nums muestra los caminos en cada clavo; o.balls (0–1) cuántas bolitas cayeron.
function galton(t, cx, y0, s, n, o = {}) {
  for (let r = 0; r <= n; r++) for (let k = 0; k <= r; k++) {
    const x = cx + (k - r / 2) * s, y = y0 + r * s * .87;
    if (r < n) dot(x, y, 6, C.ink, 8);
    if (o.nums && r <= o.nums) T(String(BIN(r, k)), x, y - 16, { k: 'r', s: 26, a: 'c', c: CO });
  }
  const yb = y0 + n * s * .87, nb = n + 1;
  for (let k = 0; k <= nb; k++) { const x = cx + (k - nb / 2) * s; stroke('rgba(225,232,255,.5)', 2, () => { X.moveTo(x, yb + 10); X.lineTo(x, yb + 260); }, { g: 0 }); }
  if (o.balls) {
    const R = rng(7), N = Math.floor(140 * o.balls), cnt = Array(nb).fill(0);
    for (let i = 0; i < N; i++) { let k = 0; for (let r = 0; r < n; r++) if (R() < .5) k++; cnt[k]++; }
    cnt.forEach((c, k) => { const x = cx + (k - n / 2) * s; for (let j = 0; j < c; j++) dot(x + ((j % 3) - 1) * 14, yb + 250 - Math.floor(j / 3) * 14, 6, k === n / 2 ? CO : CB, 8); });
    // una bolita en camino
    const ph = (t * 1.3) % 1, R2 = rng(Math.floor(t * 1.3) + 99); let k = 0; const steps = Math.floor(ph * n);
    for (let r = 0; r < steps; r++) if (R2() < .5) k++;
    dot(cx + (k - steps / 2) * s, y0 + steps * s * .87 - 20, 9, CA, 20);
  }
}
// Triángulo de Pascal de n filas centrado en cx desde y0; hl: fila resaltada.
function pascal(cx, y0, n, s, k = 1, hl = -1) {
  for (let r = 0; r <= n; r++) fade(clamp(k * (n + 1) - r), () => { for (let j = 0; j <= r; j++) T(String(BIN(r, j)), cx + (j - r / 2) * s, y0 + r * s * .8, { k: 'r', s: Math.min(44, s * .5), a: 'c', c: r === hl ? CO : C.ink, g: r === hl ? 12 : 0 }); });
}
const S = {
  // 1 · Galton, 1889: el tablero y las bolitas que se apilan.
  galton(t) {
    stars(t, .4);
    galton(t, CX, 480, 120, 4, { balls: seg(t, 9.6, 26) });
    fade(A(t, 1, .6), () => T('Francis Galton · 1889', CX, 420, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 2 · Caminos: los números de caminos aparecen fila por fila.
  caminos(t) {
    stars(t, .3);
    galton(t, CX, 520, 130, 4, { nums: Math.min(4, Math.floor(seg(t, 1, 20) * 5)) });
    fade(A(t, 10.2, .5), () => { const x = CX, y = 520 + 2 * 130 * .87; arrow(x - 60, y - 100, x - 8, y - 20, CB, 1, 2); arrow(x + 60, y - 100, x + 8, y - 20, CB, 1, 2); T('1 + 1 = 2', CX + 160, y - 60, { k: 'r', s: 30, c: CB }); });
    fade(A(t, 20.2, .6), () => F([['1 + 4 + 6 + 4 + 1 = ', 'r'], ['16', 'r', CO]], CX, 1310, 56));
  },
  // 3 · El triángulo: 7 filas, con Yang Hui y Pascal.
  triangulo(t) {
    stars(t, .3);
    pascal(CX, 480, 6, 110, seg(t, 1, 8));
    fade(A(t, 4, .5), () => { const y = 480 + 4 * 88; ring(CX, y, 32, CO, 3); stroke(CB, 2, () => { X.moveTo(CX - 55, y - 88 + 10); X.lineTo(CX - 12, y - 24); X.moveTo(CX + 55, y - 88 + 10); X.lineTo(CX + 12, y - 24); }, { g: 8 }); T('3 + 3 = 6', CX + 160, y - 50, { k: 'r', s: 28, c: CB }); });
    fade(A(t, 10.2, .6), () => T('Jia Xian · s. XI      Yang Hui · 1261', CX, 1120, { k: 'mono', s: 26, a: 'c', c: CA }));
    fade(A(t, 19.2, .6), () => T('Blaise Pascal · 1654', CX, 1180, { k: 'mono', s: 26, a: 'c', c: CA }));
  },
  // 4 · Las potencias del binomio: cada fila es un desarrollo.
  potencias(t) {
    stars(t, .3);
    pascal(300, 480, 4, 90, seg(t, .8, 4), t < 10 ? 2 : t < 20 ? 3 : 4);
    fade(A(t, 1, .5), () => F([['(', 'r'], ['a', 'i', CA], [' + ', 'r'], ['b', 'i', CB], [')² = ', 'r'], ['1', 'r', CO], ['a', 'i', CA], ['² + ', 'r'], ['2', 'r', CO], ['ab', 'i'], [' + ', 'r'], ['1', 'r', CO], ['b', 'i', CB], ['²', 'r']], 720, 880, 44));
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['a', 'i', CA], [' + ', 'r'], ['b', 'i', CB], [')³ = ', 'r'], ['1', 'r', CO], ['a', 'i', CA], ['³ + ', 'r'], ['3', 'r', CO], ['a', 'i', CA], ['²', 'r'], ['b', 'i', CB], [' + ', 'r'], ['3', 'r', CO], ['a', 'i', CA], ['b', 'i', CB], ['² + ', 'r'], ['1', 'r', CO], ['b', 'i', CB], ['³', 'r']], CX, 980, 42, { max: 960 }));
    fade(A(t, 20.2, .6), () => T('fila n → coeficientes de (a + b)ⁿ', CX, 1100, { k: 'mono', s: 28, a: 'c', c: CO }));
  },
  // 5 · Los exponentes: a baja, b sube, siempre suman 4.
  exponentes(t) {
    stars(t, .3);
    const co = [1, 4, 6, 4, 1];
    for (let k = 0; k <= 4; k++) fade(A(t, 1 + k * .5, .4), () => {
      const x = 160 + k * 190;
      T(String(co[k]), x, 640, { k: 'r', s: 48, a: 'c', c: CO });
      T('a' + ['⁴', '³', '²', '¹', '⁰'][k], x - 24, 740, { k: 'i', s: 48, a: 'c', c: CA }); T('b' + ['⁰', '¹', '²', '³', '⁴'][k], x + 30, 740, { k: 'i', s: 48, a: 'c', c: CB });
      fade(A(t, 19.2 + k * .3, .3), () => T((4 - k) + ' + ' + k + ' = 4', x, 840, { k: 'mono', s: 22, a: 'c', c: C.mute }));
    });
    fade(A(t, 1.6, .5), () => arrow(140, 960, 940, 960, CA, eo(seg(t, 1.6, 3)), 3)); fade(A(t, 2, .5), () => T('a: 4 → 0', 140, 1010, { k: 'mono', s: 24, c: CA }));
    fade(A(t, 10.2, .5), () => { arrow(140, 1080, 940, 1080, CB, eo(seg(t, 10.2, 11.6)), 3); T('b: 0 → 4', 140, 1130, { k: 'mono', s: 24, c: CB }); });
  },
  // 6 · Elegir: cuatro paréntesis; seis maneras de tomar b de dos de ellos.
  elegir(t) {
    stars(t, .3);
    for (let i = 0; i < 4; i++) T('(a + b)', 180 + i * 240, 520, { k: 'r', s: 52, a: 'c', c: C.ink });
    const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    fade(A(t, 10.2, .6), () => {
      const cur = Math.min(5, Math.floor(seg(t, 10.4, 18) * 6));
      for (let i = 0; i < 4; i++) { const isB = pairs[cur].includes(i); ring(180 + i * 240 + (isB ? 50 : -40), 500, 30, isB ? CB : CA, 3); }
      pairs.forEach((p, j) => fade(j <= cur ? 1 : .15, () => T([0, 1, 2, 3].map(i => p.includes(i) ? 'b' : 'a').join(' · '), CX, 660 + j * 64, { k: 'i', s: 40, a: 'c', c: j === cur ? CB : C.ink })));
      T('maneras = ' + (cur + 1), 96, 1300, { k: 'mono', s: 26, c: EL, g: 8 });
    });
    fade(A(t, 20.2, .6), () => F([['C', 'i', EL], ['(4, 2) = 6', 'r', EL], ['   →   6', 'r'], ['a', 'i', CA], ['²', 'r'], ['b', 'i', CB], ['²', 'r']], CX, 1120, 56));
  },
  // 7 · Cuatro monedas: los 16 resultados agrupados por número de caras.
  monedas(t) {
    stars(t, .3);
    const all = []; for (let m = 0; m < 16; m++) all.push([0, 1, 2, 3].map(i => (m >> i) & 1));
    const groups = [0, 1, 2, 3, 4].map(h => all.filter(r => r.reduce((a, b) => a + b) === h));
    groups.forEach((g, h) => fade(A(t, 1 + h * .8, .4), () => { g.forEach((r, j) => r.forEach((c, i) => { const x = 110 + h * 200 + i * 34, y = 520 + j * 60; ring(x, y, 13, c ? CA : CB, 2.5); if (c) dot(x, y, 6, CA, 8); })); T(h + ' caras', 160 + h * 200, 940, { k: 'mono', s: 22, a: 'c', c: h === 2 ? EL : C.mute }); T(String(g.length), 160 + h * 200, 1000, { k: 'r', s: 52, a: 'c', c: h === 2 ? EL : CO, g: h === 2 ? 14 : 0 }); }));
    fade(A(t, 10.2, .6), () => F([['C', 'i', EL], ['(4, 2) = 6', 'r', EL]], CX, 1110, 56));
    fade(A(t, 19.2, .6), () => T('● cara    ○ sello', CX, 1190, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 8 · Cada fila suma 2ⁿ.
  sumafila(t) {
    stars(t, .3);
    pascal(380, 480, 5, 92, seg(t, .8, 4));
    for (let r = 0; r <= 5; r++) fade(A(t, 1.6 + r * .4, .3), () => T('= ' + 2 ** r, 820, 480 + r * 74, { k: 'r', s: 40, c: CO }));
    fade(A(t, 10.2, .6), () => F([['(1 + 1)', 'r'], ['ⁿ', 'r'], [' = ', 'r'], ['2', 'r', CO], ['ⁿ', 'r', CO]], CX, 1020, 72));
    fade(A(t, 20.2, .6), () => T('en el tablero: dos opciones en cada clavo', CX, 1120, { k: 'mono', s: 26, a: 'c', c: C.mute }));
  },
  // 9 · Un ejemplo: (x + 3)³ término por término.
  ejemplo(t) {
    stars(t, .3);
    F([['(', 'r'], ['x', 'i', CA], [' + ', 'r'], ['3', 'r', CB], [')³', 'r']], CX, 520, 88);
    fade(A(t, 1.6, .5), () => T('1   3   3   1', CX, 610, { k: 'r', s: 44, a: 'c', c: CO }));
    const rows = [[['1 · ', 'r', CO], ['x', 'i', CA], ['³', 'r']], [['3 · ', 'r', CO], ['x', 'i', CA], ['² · ', 'r'], ['3', 'r', CB]], [['3 · ', 'r', CO], ['x', 'i', CA], [' · ', 'r'], ['3', 'r', CB], ['²', 'r']], [['1 · ', 'r', CO], ['3', 'r', CB], ['³', 'r']]];
    rows.forEach((p, i) => fade(A(t, 10.4 + i * 1.6, .5), () => { F(p, 360, 740 + i * 90, 50, { a: 'l' }); T('= ' + ['x³', '9x²', '27x', '27'][i], 700, 740 + i * 90, { k: 'r', s: 50, c: C.ink }); }));
    fade(A(t, 20.2, .6), () => F([['x', 'i'], ['³ + 9', 'r'], ['x', 'i'], ['² + 27', 'r'], ['x', 'i'], [' + 27', 'r']], CX, 1200, 72));
  },
  // 10 · Cierre: el tablero lleno; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => galton(t, CX, 480, 120, 4, { balls: 1, nums: 4 }));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['1 4 6 4 1', 'r', CO]], 'fila 4 del triángulo'], [[['C', 'i'], ['(4, 2) = 6', 'r']], 'maneras de elegir'], [[['a', 'i'], ['ⁿ⁻ᵏ', 'r'], ['b', 'i'], ['ᵏ', 'r']], 'exponentes que suman n'], [[['Σ ', 'r'], ['C', 'i'], ['(', 'r'], ['n', 'i'], [', ', 'r'], ['k', 'i'], [') = 2', 'r'], ['ⁿ', 'r']], 'cada fila']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [CA, CO, CB]);
    });
  },
};
