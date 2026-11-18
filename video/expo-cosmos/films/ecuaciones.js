// «El hombre del hielo» · escenas de la lección alg-73. Motor en kit.js y expo.js; guion en ecuaciones.data.js.
// La incógnita en ámbar, el logaritmo que la baja en cian, lo descartado en rosa, lo que sí sirve en verde.
const XU = C.amber, LG = C.cyan, NO = C.mag, OK = C.green;
// Escalón de un despeje: renglón de fórmula que aparece en t0, con una flecha desde el anterior.
function stepRow(t, t0, parts, y, size = 54, prevY) {
  fade(A(t, t0, .6), () => { if (prevY) arrow(CX, prevY + 22, CX, y - size * .9, LG, eo(seg(t, t0, t0 + .8)), 2.5, { h: 10 }); F(parts, CX, y, size, { max: 980 }); });
}
// Montaña con hielo y una silueta tendida (esquema).
function glacier(t, k = 1) {
  stroke('rgba(225,232,255,.7)', 3, () => { X.moveTo(80, 1100); X.lineTo(330, 700); X.lineTo(470, 840); X.lineTo(640, 560); X.lineTo(1000, 1100); }, { g: 6 });
  fade(.25 * k, () => { X.save(); X.beginPath(); X.moveTo(240, 1100); X.lineTo(330, 960); X.lineTo(470, 1000); X.lineTo(640, 900); X.lineTo(840, 1100); X.fillStyle = LG; X.fill(); X.restore(); });
  fade(k, () => stroke(XU, 3, () => { X.moveTo(460, 1040); X.lineTo(600, 1030); X.moveTo(470, 1040); X.arc(450, 1040, 18, 0, 7); }, { g: 12 }));
}
const S = {
  // 1 · Ötzi en el hielo.
  otzi(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('Alpes de Ötztal · 1991', CX, 460, { k: 'mono', s: 26, a: 'c', c: C.mute }));
    glacier(t, A(t, 1.5, 1));
    fade(A(t, 9.6, .6), () => T('≈ 5 300 años', 600, 980, { k: 'r', s: 44, a: 'l', c: XU, g: 12 }));
    fade(A(t, 18.6, .6), () => F([['(1/2)', 'r'], ['t/5730', 'spi', XU], [' = 0.53', 'r']], CX, 1240, 60));
  },
  // 2 · Igualar bases: 8^x = 4^(x+1).
  bases(t) {
    stars(t, .3);
    stepRow(t, .8, [['8', 'r'], ['ˣ', 'r', XU], [' = 4', 'r'], ['ˣ⁺¹', 'r', XU]], 520, 64);
    stepRow(t, 10, [['(2³)', 'r', LG], ['ˣ', 'r', XU], [' = (2²)', 'r', LG], ['ˣ⁺¹', 'r', XU]], 680, 58, 520);
    stepRow(t, 13.5, [['2', 'r'], ['³ˣ', 'r', XU], [' = 2', 'r'], ['²ˣ⁺²', 'r', XU]], 820, 58, 680);
    stepRow(t, 20, [['3', 'r'], ['x', 'i', XU], [' = 2', 'r'], ['x', 'i', XU], [' + 2', 'r']], 960, 58, 820);
    stepRow(t, 23.5, [['x', 'i', XU], [' = 2', 'r', OK]], 1100, 70, 960);
    check(CX + 170, 1080, 24, true, A(t, 25, .5));
  },
  // 3 · Bajar el exponente: 3^x = 20.
  logaritmo(t) {
    stars(t, .3);
    stepRow(t, .8, [['3', 'r'], ['ˣ', 'r', XU], [' = 20', 'r']], 500, 66);
    fade(A(t, 3, .6), () => { [1, 3, 9, 27].forEach((v, i) => { const x = 220 + i * 210; chip(x, 640, 150, 70, v === 9 || v === 27 ? XU : C.violet, '3' + '⁰¹²³'[i] + ' = ' + v, { s: 28 }); }); T('20', 640 + 105, 720, { k: 'r', s: 34, a: 'c', c: NO }); });
    stepRow(t, 10, [['x', 'i', XU], [' · log 3', 'r', LG], [' = log 20', 'r', LG]], 860, 56, 740);
    stepRow(t, 19, [['x', 'i', XU], [' = log 20 / log 3 ≈ ', 'r'], ['2.727', 'r', OK]], 1010, 54, 860);
  },
  // 4 · La edad de Ötzi: 53 % de carbono 14.
  edad(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { bar(240, 470, 600, 56, LG, 1, { fill: .15 }); bar(240, 470, 600 * .53, 56, LG, 1, { fill: .4 }); T('53 %', 240 + 318 + 20, 512, { k: 'r', s: 34, c: LG }); });
    stepRow(t, .8, [['(1/2)', 'r'], ['t/5730', 'spi', XU], [' = 0.53', 'r']], 640, 56);
    stepRow(t, 10, [['(', 'r'], ['t', 'i', XU], ['/5730) · ', 'r'], ['log 0.5', 'r', LG], [' = ', 'r'], ['log 0.53', 'r', LG]], 790, 50, 640);
    stepRow(t, 20, [['t', 'i', XU], [' ≈ 5730 · 0.916 ≈ ', 'r'], ['5 250 años', 'r', OK]], 940, 50, 790);
    fade(A(t, 22, .6), () => { const P = (x, y) => [180 + x * .06, 1260 - y * 160]; stroke('rgba(225,232,255,.6)', 2, () => { X.moveTo(180, 1260); X.lineTo(900, 1260); }, { g: 0 }); curve(x => P(x, .5 ** (x / 5730)), 0, 12000, LG, 1, 3); const [x, y] = P(5250, .53); dot(x, y, 10, XU, 20); T('5 250', x, 1300, { k: 'mono', s: 22, a: 'c', c: XU }); T('5 730', P(5730, 0)[0], 1300, { k: 'mono', s: 22, a: 'c', c: C.mute }); stroke('rgba(225,232,255,.6)', 2, () => { X.moveTo(P(5730, 0)[0], 1252); X.lineTo(P(5730, 0)[0], 1268); }, { g: 0 }); });
  },
  // 5 · Triplicar el dinero: 1.1^n = 3.
  triplicar(t) {
    stars(t, .3);
    stepRow(t, .8, [['1.1', 'r'], ['ⁿ', 'r', XU], [' = 3', 'r']], 500, 66);
    stepRow(t, 10, [['n', 'i', XU], [' · log 1.1', 'r', LG], [' = log 3', 'r', LG]], 650, 56, 500);
    stepRow(t, 19, [['n', 'i', XU], [' ≈ ', 'r'], ['11.53', 'r', OK]], 790, 60, 650);
    fade(A(t, 20, .6), () => { for (let i = 1; i <= 12; i++) { const v = 1.1 ** i, h = v * 80; bar(150 + (i - 1) * 66, 1220 - h, 52, h, v >= 3 ? OK : C.violet, 1, { fill: .3, g: 6 }); } stroke(NO, 2, () => { X.setLineDash([10, 8]); X.moveTo(140, 980); X.lineTo(950, 980); X.setLineDash([]); }, { g: 6 }); T('× 3', 960, 990, { k: 'r', s: 30, c: NO }); });
  },
  // 6 · Ecuación con logaritmos: juntar y pasar a potencia.
  logs(t) {
    stars(t, .3);
    stepRow(t, .8, [['log', 'r'], ['2', 'sb'], [' ', 'r'], ['x', 'i', XU], [' + log', 'r'], ['2', 'sb'], ['(', 'r'], ['x', 'i', XU], [' + 2) = 3', 'r']], 500, 54);
    stepRow(t, 10, [['log', 'r'], ['2', 'sb'], ['(', 'r'], ['x', 'i', XU], ['(', 'r'], ['x', 'i', XU], [' + 2)) = 3', 'r']], 640, 54, 500);
    stepRow(t, 13.5, [['x', 'i', XU], ['(', 'r'], ['x', 'i', XU], [' + 2) = 2³ = 8', 'r', LG]], 780, 54, 640);
    stepRow(t, 20, [['x', 'i', XU], ['² + 2', 'r'], ['x', 'i', XU], [' − 8 = 0', 'r']], 920, 54, 780);
    stepRow(t, 23.5, [['x', 'i', XU], [' = 2', 'r', OK], ['   o   ', 'r'], ['x', 'i', XU], [' = −4', 'r', NO]], 1060, 58, 920);
  },
  // 7 · La trampa: el dominio descarta −4.
  dominio(t) {
    stars(t, .3);
    const x0 = 140, w = 800, px = v => x0 + (v + 6) / 10 * w;
    stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(x0, 760); X.lineTo(x0 + w, 760); }, { g: 4 });
    for (let v = -6; v <= 4; v++) { stroke('rgba(225,232,255,.8)', 1.5, () => { X.moveTo(px(v), 750); X.lineTo(px(v), 770); }, { g: 0 }); T(String(v).replace('-', '−'), px(v), 810, { k: 'r', s: 26, a: 'c', c: C.mute }); }
    fade(A(t, 10, .6), () => { X.save(); X.fillStyle = hexA(OK, .18); X.fillRect(px(0), 730, px(4) - px(0), 60); X.restore(); T('x > 0', px(2), 700, { k: 'mono', s: 28, a: 'c', c: OK }); });
    fade(A(t, .8, .6), () => { dot(px(-4), 760, 12, NO, 22); T('log₂(−4)', px(-4), 680, { k: 'r', s: 36, a: 'c', c: NO }); });
    fade(A(t, 3, .5), () => stroke(NO, 4, () => { X.moveTo(px(-4) - 26, 734); X.lineTo(px(-4) + 26, 786); X.moveTo(px(-4) + 26, 734); X.lineTo(px(-4) - 26, 786); }, { g: 12 }));
    fade(A(t, 19, .6), () => { dot(px(2), 760, 12, OK, 22); F([['log', 'r'], ['2', 'sb'], [' 2 + log', 'r'], ['2', 'sb'], [' 4 = 1 + 2 = 3', 'r', OK]], CX, 960, 54); check(CX, 1060, 26, true, A(t, 20.5, .5)); });
  },
  // 8 · Con e: el logaritmo natural.
  natural(t) {
    stars(t, .3);
    stepRow(t, .8, [['e', 'i', XU], ['0.05', 'sp'], ['t', 'spi', XU], [' = 2', 'r']], 500, 64);
    fade(A(t, 10, .6), () => T('ln = logaritmo en base e · ln e = 1', CX, 620, { k: 'mono', s: 26, a: 'c', c: LG }));
    stepRow(t, 12, [['0.05', 'r'], ['t', 'i', XU], [' = ', 'r'], ['ln 2', 'r', LG]], 760, 60, 640);
    stepRow(t, 20, [['t', 'i', XU], [' = 0.693 / 0.05 ≈ ', 'r'], ['13.86', 'r', OK]], 900, 56, 760);
    fade(A(t, 21, .6), () => { const P = (x, y) => [180 + x * 36, 1260 - y * 110]; stroke('rgba(225,232,255,.6)', 2, () => { X.moveTo(180, 1260); X.lineTo(940, 1260); }, { g: 0 }); curve(x => P(x, Math.exp(.05 * x)), 0, 20, XU, seg(t, 21, 24), 3); const [x, y] = P(13.86, 2); stroke(OK, 2, () => { X.moveTo(x, 1260); X.lineTo(x, y); X.lineTo(180, y); }, { g: 6 }); T('× 2', 170, y + 10, { k: 'r', s: 28, a: 'r', c: OK }); });
  },
  // 9 · Comprobar, mirar el dominio, redondear al final.
  comprobar(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { const v = 3 ** (2.727 * eio(seg(t, 1, 6))); F([['3', 'r'], ['2.727', 'sp', XU], [' = ', 'r'], [v.toFixed(2), 'r', OK]], CX, 540, 64); if (t > 6) check(CX + 280, 520, 24, true, A(t, 6, .5)); });
    fade(A(t, 10, .6), () => F([['log(', 'r'], ['…', 'r', XU], [')  ⟹  ', 'r'], ['… > 0', 'r', OK]], CX, 720, 56));
    fade(A(t, 19, .6), () => { T('1.3 / 0.5 = 2.6 → 3^2.6 ≈ 17.4', CX, 880, { k: 'mono', s: 30, a: 'c', c: NO }); T('1.30103 / 0.47712 = 2.7268 → ≈ 20.00', CX, 940, { k: 'mono', s: 30, a: 'c', c: OK }); });
  },
  // 10 · Cierre: resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => glacier(t, 1));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['2', 'r'], ['³ˣ', 'r'], [' = 2', 'r'], ['²ˣ⁺²', 'r']], 'igualar bases'], [[['x', 'i'], [' log ', 'r'], ['b', 'i'], [' = log ', 'r'], ['a', 'i']], 'bajar el exponente'], [[['x', 'i'], [' > 0', 'r']], 'el dominio decide'], [[['ln ', 'r'], ['e', 'i'], [' = 1', 'r']], 'logaritmo natural']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [XU, LG, OK]);
    });
  },
};
