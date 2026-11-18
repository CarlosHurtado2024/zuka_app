// «El día que sobra» · escenas de la lección alg-14. Motor en kit.js y sigma.js; guion en sucesiones.data.js.
// Los términos en ámbar, la diferencia (los saltos) en cian, lo que se encuentra en verde, lo que baja en rosa.
const TM = C.amber, DF = C.cyan, GO = C.green, DOWN = C.mag;
// Fila de años de y0 a y1 como fichas; los bisiestos (desde 2024, de 4 en 4) se encienden con k.
function years(cx, y, y0, y1, k = 1, o = {}) {
  const n = y1 - y0 + 1, w = o.w || 100, gap = 8, x0 = cx - (n * (w + gap) - gap) / 2;
  for (let i = 0; i < n; i++) {
    const yr = y0 + i, leap = yr % 4 === 0 && (yr % 100 !== 0 || yr % 400 === 0), on = leap && k > 0;
    const x = x0 + i * (w + gap) + w / 2;
    chip(x, y, w, 64, on ? (yr === 2100 ? DOWN : GO) : 'rgba(160,180,240,.45)', String(yr), { s: 28, c: on ? C.ink : C.mute, g: on ? 14 : 0 });
  }
  return i => x0 + i * (w + gap) + w / 2;
}
// Vela de alto h (en píxeles) con base en (x, y).
function candle(x, y, h, col = TM) { bar(x - 30, y - h, 60, h, col, 1, { fill: .2 }); stroke(C.ink, 2, () => { X.moveTo(x, y - h); X.lineTo(x, y - h - 18); }, { g: 0 }); dot(x, y - h - 30, 9, '#ffd76a', 30); }
const S = {
  // 1 · Julio César: el año de 365 días y cuarto; cada cuatro años sobra un día; los bisiestos de 4 en 4.
  cesar(t) {
    stars(t, .5);
    fade(win(t, .8, 9.6), () => { T('Roma · calendario juliano', CX, 520, { k: 'mono', s: 26, c: C.mute, a: 'c' }); F([['365', 'r', TM], [' días y ', 'it'], ['¼', 'r', DF]], CX, 760, 110); });
    fade(A(t, 9.6, .6), () => {
      const k = seg(t, 10, 17);
      for (let i = 0; i < 4; i++) { const q = clamp(k * 4 - i); ring(260 + i * 186, 700, 70, hexA(TM, .7), 3, 1); X.save(); X.beginPath(); X.moveTo(260 + i * 186, 700); X.arc(260 + i * 186, 700, 66, -Math.PI / 2, -Math.PI / 2 + Math.PI / 2 * q); X.closePath(); X.fillStyle = hexA(DF, .6); X.fill(); X.restore(); T('año ' + (i + 1), 260 + i * 186, 810, { k: 'mono', s: 22, a: 'c', c: C.mute }); }
      fade(A(t, 17, .5), () => T('4 cuartos = 1 día entero', CX, 900, { k: 'r', s: 48, a: 'c', c: DF, g: 10 }));
    });
    fade(A(t, 18.6, .6), () => { const px = years(CX, 1080, 2023, 2033, 1, { w: 82 }); [1, 5, 9].forEach((i, j) => { if (j) fade(A(t, 19.6 + j * .7, .4), () => { hop(px(i - 4), px(i), 1030, 60, DF, 1, 2.5); T('+4', (px(i - 4) + px(i)) / 2, 950, { k: 'r', s: 30, a: 'c', c: DF }); }); }); });
  },
  // 2 · Sucesión: los bisiestos como lista con puestos a₁, a₂, a₃, …
  sucesion(t) {
    stars(t, .3);
    const vals = [2024, 2028, 2032, 2036, 2040];
    vals.forEach((v, i) => fade(A(t, 1 + i * .6, .4), () => { const x = 160 + i * 190; chip(x, 700, 170, 90, TM, String(v), { s: 40, c: TM }); fade(A(t, 10.2 + i * .4, .4), () => T('a' + '₁₂₃₄₅'[i], x, 800, { k: 'i', s: 44, a: 'c', c: DF })); fade(A(t, 10.2 + i * .4, .4), () => T('puesto ' + (i + 1), x, 850, { k: 'mono', s: 20, a: 'c', c: C.mute })); }));
    fade(A(t, 6, .5), () => T('…', 1045, 712, { k: 'r', s: 50, a: 'c' }));
    fade(A(t, 19.2, .6), () => { ring(160 + 2 * 190, 700, 80, GO, 3, seg(t, 19.4, 20.4)); F([['a', 'i', DF], ['₃', 'r', DF], [' = ', 'r'], ['2032', 'r', GO]], CX, 1040, 72); T('n = 1, 2, 3, …: números naturales', CX, 1120, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 3 · Progresión aritmética: saltos de +4 en la recta; la diferencia; la vela que baja (d = −2).
  aritmetica(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      const px = nline(110, 990, 700, 2022, 2042, { step: 1, lab: v => v % 4 === 0, s: 26 });
      const n = Math.min(4, Math.floor(seg(t, 1, 8) * 5));
      for (let i = 0; i < n; i++) hop(px(2024 + 4 * i), px(2028 + 4 * i), 700, 70, DF, 1, 2.5);
      for (let i = 0; i <= n; i++) dot(px(2024 + 4 * i), 700, 10, TM, 18);
      fade(A(t, 10.2, .6), () => { F([['d', 'i', DF], [' = 2028 − 2024 = ', 'r'], ['4', 'r', DF]], CX, 900, 60); F([['a', 'i'], ['ₙ₊₁ = ', 'r'], ['a', 'i'], ['ₙ + ', 'r'], ['d', 'i', DF]], CX, 1020, 64); });
    });
    fade(A(t, 20, .6), () => {
      const h = Math.max(0, 6 - Math.floor(seg(t, 20.4, 27) * 4)) ;
      for (let i = 0; i < 4; i++) { candle(250 + i * 190, 1050, (30 - 2 * i) * 14, i ? DOWN : TM); T((30 - 2 * i) + ' cm', 250 + i * 190, 1110, { k: 'r', s: 32, a: 'c', c: C.ink }); if (i) T('−2', 155 + i * 190, 600, { k: 'r', s: 32, a: 'c', c: DOWN }); }
      F([['d', 'i', DOWN], [' = −2', 'r', DOWN], ['      ', 'r'], ['d', 'i'], [' = 0: no cambia', 'it', C.mute]], CX, 1220, 48);
      void h;
    });
  },
  // 4 · Saltos: cinco dedos, cuatro espacios; de a₁ a aₙ hay n − 1 saltos.
  saltos(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => {
      const xs = [330, 440, 540, 640, 750], tops = [760, 600, 560, 600, 680];
      stroke(TM, 4, () => { X.moveTo(300, 1060); X.quadraticCurveTo(300, 860, 330, 860); X.moveTo(780, 1060); X.quadraticCurveTo(800, 900, 760, 860); X.moveTo(300, 1060); X.lineTo(780, 1060); }, { g: 12 });
      xs.forEach((x, i) => fade(A(t, 1 + i * .3, .3), () => { stroke(TM, 4, () => X.roundRect(x - 34, tops[i], 68, 880 - tops[i], 34), { g: 12 }); T(String(i + 1), x, tops[i] - 20, { k: 'r', s: 36, a: 'c', c: TM }); }));
      fade(A(t, 10.2, .6), () => xs.slice(1).forEach((x, i) => fade(A(t, 10.4 + i * .5, .3), () => { stroke(DF, 4, () => { X.moveTo(xs[i] + 36, 830); X.lineTo(x - 36, 830); }, { g: 14 }); T(String(i + 1), (xs[i] + x) / 2, 900, { k: 'r', s: 32, a: 'c', c: DF }); })));
      fade(A(t, 12.6, .5), () => T('5 dedos, 4 espacios', CX, 1140, { k: 'mono', s: 28, a: 'c', c: DF }));
    });
    fade(A(t, 19, .6), () => {
      for (let i = 0; i < 6; i++) { const x = 170 + i * 148; dot(x, 700, 12, TM, 20); T(i === 5 ? '… aₙ' : 'a' + '₁₂₃₄₅'[i], x, 770, { k: 'i', s: 36, a: 'c', c: TM }); if (i) hop(x - 148, x, 700, 60, DF, seg(t, 19.4 + i * .4, 20 + i * .4), 2.5); }
      T('n − 1 saltos de d', CX, 590, { k: 'mono', s: 28, a: 'c', c: DF });
      F([['a', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁ + (', 'r'], ['n', 'i'], [' − 1)', 'r'], ['d', 'i', DF]], CX, 960, 72);
    });
  },
  // 5 · El bisiesto 20: 2024 + 19 · 4 = 2100… que no será bisiesto.
  bisiesto(t) {
    stars(t, .3);
    const n = Math.min(19, Math.floor(19 * seg(t, 1, 8)));
    const px = nline(110, 990, 640, 2020, 2104, { step: 4, lab: v => v % 20 === 0 || v === 2100, s: 24 });
    for (let i = 0; i < n; i++) hop(px(2024 + 4 * i), px(2028 + 4 * i), 640, 40, DF, 1, 2);
    dot(px(2024 + 4 * n), 640, 12, n === 19 && t > 10 ? DOWN : TM, 22);
    T('saltos = ' + n, 96, 1300, { k: 'mono', s: 26, c: DF, g: 8 });
    fade(A(t, 4, .6), () => F([['a', 'i'], ['₂₀ = 2024 + ', 'r'], ['19', 'r', DF], [' · 4 = ', 'r'], ['2100', 'r', t > 10 ? DOWN : GO]], CX, 820, 60));
    fade(A(t, 10.2, .6), () => { T('2100', CX, 1000, { k: 'r', s: 110, a: 'c', c: DOWN, g: 20 }); check(CX + 200, 970, 30, false, A(t, 11.4, .5)); T('no será bisiesto', CX, 1070, { k: 'mono', s: 26, a: 'c', c: DOWN }); });
    fade(A(t, 20.2, .6), () => { T('Gregorio XIII · 1582', CX, 1170, { k: 'mono', s: 24, a: 'c', c: C.mute }); T('1600 ✓   1700 ✗   1800 ✗   1900 ✗   2000 ✓   2100 ✗', CX, 1230, { k: 'mono', s: 26, a: 'c', c: C.ink, max: 960 }); });
  },
  // 6 · Con dos términos: a₄ = 19 y a₁₀ = 43; seis saltos de 4; tres hacia atrás hasta a₁ = 7.
  dos(t) {
    stars(t, .3);
    const xs = i => 130 + (i - 1) * 91;
    for (let i = 1; i <= 10; i++) { T(String(i), xs(i), 860, { k: 'mono', s: 22, a: 'c', c: C.mute }); stroke('rgba(225,232,255,.4)', 1.5, () => { X.moveTo(xs(i), 780); X.lineTo(xs(i), 820); }, { g: 0 }); }
    T('puesto', 96, 900, { k: 'mono', s: 20, c: C.mute });
    fade(A(t, 1, .5), () => { chip(xs(4), 720, 84, 64, TM, '19', { s: 34, c: TM }); chip(xs(10), 720, 84, 64, TM, '43', { s: 34, c: TM }); });
    fade(A(t, 10.2, .6), () => { for (let i = 4; i < 10; i++) hop(xs(i), xs(i + 1), 660, 50, DF, seg(t, 10.4 + (i - 4) * .5, 11 + (i - 4) * .5), 2.5); fade(A(t, 13.6, .5), () => F([['43 − 19 = 24 = 6', 'r'], ['d', 'i', DF], ['  ⟹  ', 'r'], ['d', 'i', DF], [' = 4', 'r', DF]], CX, 520, 52)); });
    fade(A(t, 19.2, .6), () => { for (let i = 4; i > 1; i--) hop(xs(i), xs(i - 1), 660, 50, DOWN, seg(t, 19.4 + (4 - i) * .5, 20 + (4 - i) * .5), 2.5); fade(A(t, 21.4, .5), () => { chip(xs(1), 720, 84, 64, GO, '7', { s: 34, c: GO }); F([['a', 'i'], ['₁ = 19 − 3 · 4 = ', 'r'], ['7', 'r', GO]], CX, 1060, 60); }); });
  },
  // 7 · Medios aritméticos: cinco medios entre 2 y 20, a distancia 3.
  medios(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, 0, 22, { step: 1, lab: v => v % 2 === 0, s: 24 });
    fade(A(t, 1, .5), () => { dot(px(2), 760, 14, TM, 26); dot(px(20), 760, 14, TM, 26); T('2', px(2), 700, { k: 'r', s: 40, a: 'c', c: TM }); T('20', px(20), 700, { k: 'r', s: 40, a: 'c', c: TM }); });
    fade(A(t, 10.2, .6), () => { for (let i = 0; i < 6; i++) hop(px(2 + 3 * i), px(5 + 3 * i), 760, 60, DF, seg(t, 10.6 + i * .5, 11.2 + i * .5), 2.5); F([['18 ÷ 6 = ', 'r'], ['3', 'r', DF]], CX, 960, 64); T('7 términos, 6 saltos', CX, 1030, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 20.2, .6), () => [5, 8, 11, 14, 17].forEach((v, i) => fade(A(t, 20.4 + i * .4, .3), () => { dot(px(v), 760, 12, GO, 24); T(String(v), px(v), 700, { k: 'r', s: 36, a: 'c', c: GO }); })));
  },
  // 8 · En la gráfica: puntos (n, aₙ) en línea recta; d sube, baja o se queda; puntos sueltos.
  recta(t) {
    stars(t, .3);
    const x0 = 180, y0 = 1180, sx = 90, sy = 22;
    axes(x0, y0, 760, 700, 'n', 'aₙ', eo(seg(t, .8, 2)));
    const lines = [[3, 4, GO, .8], [26, -2, DOWN, 10], [14, 0, DF, 10.6]];
    lines.forEach(([a1, d, col, t0]) => fade(A(t, t0, .5), () => { for (let n = 1; n <= 8; n++) fade(A(t, t0 + n * .15, .2), () => dot(x0 + n * sx, y0 - (a1 + (n - 1) * d) * sy, 9, col, 18)); if (t > 19) stroke(hexA(col, .3), 1.5, () => { X.moveTo(x0 + sx, y0 - a1 * sy); X.lineTo(x0 + 8 * sx, y0 - (a1 + 7 * d) * sy); }, { g: 0, dash: [6, 10] }); }));
    fade(A(t, 10.4, .5), () => { T('d = 4: sube', 980, y0 - 31 * sy - 22, { k: 'mono', s: 22, a: 'r', c: GO }); T('d = −2: baja', 980, y0 - 12 * sy + 40, { k: 'mono', s: 22, a: 'r', c: DOWN }); T('d = 0: plana', 980, y0 - 14 * sy - 18, { k: 'mono', s: 22, a: 'r', c: DF }); });
    fade(A(t, 19.6, .5), () => { ring(x0 + 2.5 * sx, y0 - (3 + 1.5 * 4) * sy, 16, C.red, 2.5); T('n = 2.5 no existe', x0 + 2.5 * sx + 30, y0 - 9 * sy + 60, { k: 'mono', s: 22, c: C.red }); });
  },
  // 9 · Bajando: la vela de 30 cm pierde 2 cm por hora; a₁₆ = 0.
  vela(t) {
    stars(t, .3);
    const hrs = t < 20 ? Math.floor(seg(t, 2, 18) * 8) : Math.min(15, 8 + Math.floor(seg(t, 20, 25) * 8)), h = 30 - 2 * hrs;
    if (h > 0) candle(300, 1080, h * 18, DOWN); else T('se terminó', 300, 1060, { k: 'mono', s: 26, a: 'c', c: DOWN });
    stroke('rgba(200,210,245,.5)', 2, () => { X.moveTo(200, 1080); X.lineTo(400, 1080); }, { g: 0 });
    T('hora ' + (hrs + 1), 640, 640, { k: 'mono', s: 34, c: DF, g: 8 }); T(h + ' cm', 640, 720, { k: 'r', s: 64, c: DOWN, g: 10 });
    fade(A(t, 10.2, .6), () => F([['a', 'i'], ['ₙ = 30 − 2(', 'r'], ['n', 'i'], [' − 1)', 'r']], 660, 880, 52));
    fade(A(t, 20.2, .6), () => F([['a', 'i'], ['₁₆ = 30 − 2 · 15 = ', 'r'], ['0', 'r', GO]], 660, 980, 48, { max: 520 }));
  },
  // 10 · Cierre: los años bisiestos; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { years(CX, 700, 2024, 2032, 1, { w: 100 }); T('+1 día cada 4 años', CX, 860, { k: 'r', s: 52, a: 'c', c: GO, g: 12 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], ['ₙ₊₁ = ', 'r'], ['a', 'i'], ['ₙ + ', 'r'], ['d', 'i', DF]], 'diferencia fija'], [[['a', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁ + (', 'r'], ['n', 'i'], [' − 1)', 'r'], ['d', 'i', DF]], 'término general'], [[['n − 1', 'r', DF]], 'saltos, no n'], [[['5, 8, 11, 14, 17', 'r', GO]], 'medios entre 2 y 20']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [TM, GO, DF]);
    });
  },
};
