// «El testamento de Franklin» · escenas de la lección alg-13b. Motor en kit.js y expo.js; guion en interes.data.js.
// El capital en cian, el interés simple en verde, el compuesto en ámbar, lo que se gana de más en rosa.
const CAP = C.cyan, SIM = C.green, COM = C.amber, EXT = C.mag;
// Columnas de un fondo año a año: capital (abajo) y lo ganado (arriba). vals: montos; mx: escala; k: cuántas.
function cols(x0, y0, w, h, vals, mx, col, k = 1, cap = 1e6) {
  const n = Math.ceil(vals.length * clamp(k)), cw = w / vals.length;
  for (let i = 0; i < n; i++) { const hc = h * cap / mx, hv = h * vals[i] / mx; bar(x0 + i * cw + 3, y0 - hc, cw - 6, hc, CAP, 1, { fill: .25, g: 4 }); if (hv > hc) bar(x0 + i * cw + 3, y0 - hv, cw - 6, hv - hc, col, 1, { fill: .35, g: 6 }); }
}
const S = {
  // 1 · Franklin y su testamento.
  franklin(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('Benjamin Franklin · Filadelfia · 1790', CX, 460, { k: 'mono', s: 26, a: 'c', c: C.mute }));
    fade(A(t, 9.6, .6), () => { chip(330, 640, 340, 120, CAP, '£ 1 000', { s: 48 }); chip(750, 640, 340, 120, CAP, '£ 1 000', { s: 48 }); T('Boston', 330, 740, { k: 'mono', s: 24, a: 'c', c: C.mute }); T('Filadelfia', 750, 740, { k: 'mono', s: 24, a: 'c', c: C.mute }); T('al 5 % · 200 años', CX, 820, { k: 'mono', s: 28, a: 'c', c: COM }); });
    fade(A(t, 18.6, .6), () => { const v = 1000 * 1.05 ** (100 * eio(seg(t, 19, 25))); T('£ ' + pesos(v), CX, 1000, { k: 'r', s: 84, a: 'c', c: COM, g: 18 }); T('a los 100 años', CX, 1070, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 2 · Interés simple: 100 000 iguales cada año.
  simple(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['I', 'i'], [' = ', 'r'], ['C', 'i', CAP], [' · ', 'r'], ['r', 'i'], [' · ', 'r'], ['t', 'i']], CX, 470, 64));
    const vals = Array.from({ length: 10 }, (_, i) => 1e6 + 1e5 * (i + 1));
    fade(A(t, 10, .5), () => cols(140, 1150, 800, 520, vals, 2.6e6, SIM, seg(t, 10.2, 17)));
    fade(A(t, 10, .5), () => T('+ 100 000 cada año', CX, 1210, { k: 'mono', s: 26, a: 'c', c: SIM }));
    fade(A(t, 19, .6), () => { stroke(SIM, 3, () => { X.moveTo(140 + 40, 1150 - 520 * 1.1e6 / 2.6e6); X.lineTo(140 + 760, 1150 - 520 * 2e6 / 2.6e6); }, { g: 12 }); T('2 000 000', 900, 1150 - 520 * 2e6 / 2.6e6 - 30, { k: 'r', s: 36, a: 'r', c: SIM }); });
  },
  // 3 · Compuesto: el segundo año paga sobre 1 100 000.
  compuesto(t) {
    stars(t, .3);
    const yr = (x, lab, cap, gain, col, on) => fade(on, () => { bar(x, 1100 - cap / 4000, 220, cap / 4000, CAP, 1, { fill: .25 }); bar(x, 1100 - cap / 4000 - gain / 1000, 220, gain / 1000, col, 1, { fill: .4 }); T(lab, x + 110, 1150, { k: 'mono', s: 24, a: 'c', c: C.mute }); T('+ ' + pesos(gain), x + 110, 1100 - cap / 4000 - gain / 1000 - 20, { k: 'r', s: 34, a: 'c', c: col }); });
    yr(160, 'año 1', 1e6, 1e5, COM, A(t, .8, .5));
    fade(A(t, 4, .5), () => arrow(400, 800, 470, 800, CAP, 1, 3));
    yr(480, 'año 2', 1.1e6, 1.1e5, COM, A(t, 10, .5));
    fade(A(t, 12, .5), () => T('+ 10 000', 590, 650, { k: 'r', s: 32, a: 'c', c: EXT }));
    yr(800, 'año 3', 1.21e6, 1.21e5, COM, A(t, 20, .5));
    fade(A(t, 21, .5), () => T('el interés gana interés', CX, 1240, { k: 'mono', s: 26, a: 'c', c: COM }));
  },
  // 4 · El factor 1.1 que se repite.
  factor(t) {
    stars(t, .3);
    const n = Math.min(6, Math.floor(seg(t, 1, 9) * 7));
    for (let i = 0; i <= n; i++) { const x = 130 + i * 140; chip(x, 600, 110, 70, i ? COM : CAP, i ? '× 1.1' : 'C', { s: 30 }); }
    fade(A(t, 10, .6), () => F([['M', 'i', COM], [' = ', 'r'], ['C', 'i', CAP], [' · (1 + ', 'r'], ['r', 'i'], [')', 'r'], ['ⁿ', 'r', COM]], CX, 800, 72));
    fade(A(t, 19, .6), () => { const P = (x, y) => [180 + x * 70, 1250 - y * 120]; axes(180, 1250, 760, 330, 'n', 'M/C', 1); curve(x => P(x, 1.1 ** x), 0, 10, COM, seg(t, 19.4, 24)); });
  },
  // 5 · Recta y curva: simple frente a compuesto, hasta 30 años.
  comparar(t) {
    stars(t, .3);
    const P = (x, y) => [170 + x * 26, 1200 - y * 34]; axes(170, 1200, 800, 650, 'años', 'millones', 1);
    const n = seg(t, .8, 6) * 10 + seg(t, 20, 26) * 20;
    stroke(SIM, 3.5, () => { X.moveTo(...P(0, 1)); X.lineTo(...P(n, 1 + .1 * n)); }, { g: 12 });
    curve(x => P(x, 1.1 ** x), 0, Math.max(.01, n), COM, 1);
    fade(A(t, .8, .5), () => T('simple: ' + pesos(1e6 * (1 + .1 * n)), 200, 500, { k: 'mono', s: 28, c: SIM }));
    fade(A(t, 10, .5), () => T('compuesto: ' + pesos(1e6 * 1.1 ** n), 200, 550, { k: 'mono', s: 28, c: COM }));
    fade(A(t, 12, .5), () => { const [x, y1] = P(10, 2), y2 = P(10, 2.5937)[1]; stroke(EXT, 3, () => { X.moveTo(x, y1); X.lineTo(x, y2); }, { g: 10 }); });
  },
  // 6 · Cuánto tarda en duplicarse; la regla del 72.
  doble(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['1.1', 'r'], ['ⁿ', 'r', COM], [' = 2', 'r']], CX, 480, 70));
    [[7, 1.9487], [8, 2.1436]].forEach(([n, v], i) => fade(A(t, 10 + i * 2, .5), () => { const y = 620 + i * 100; T('1.1' + (n === 7 ? '⁷' : '⁸') + ' ≈ ' + v.toFixed(2), 300, y, { k: 'r', s: 44, c: v > 2 ? COM : C.ink }); bar(640, y - 36, 150 * v, 46, v > 2 ? COM : CAP, 1, { fill: .3 }); }));
    stroke(EXT, 2, () => { X.moveTo(940, 560); X.lineTo(940, 740); }, { g: 8 }); T('2', 940, 540, { k: 'r', s: 30, a: 'c', c: EXT });
    fade(A(t, 19, .6), () => { F([['72 ÷ 10 ≈ ', 'r'], ['7.2', 'r', COM], [' años', 'r']], CX, 900, 60); T('regla del 72', CX, 980, { k: 'mono', s: 26, a: 'c', c: C.mute }); T('con pago anual: al 8.º año ya es el doble', CX, 1040, { k: 'mono', s: 24, a: 'c', c: COM }); });
  },
  // 7 · Tasa mensual: doce pasos de × 1.015.
  mensual(t) {
    stars(t, .3);
    const k = Math.min(12, Math.floor(seg(t, 1, 9) * 13));
    for (let i = 0; i < 12; i++) { const x = 130 + (i % 6) * 165, y = 520 + Math.floor(i / 6) * 120; if (i < k) chip(x, y, 140, 76, COM, '× 1.015', { s: 26 }); else stroke('rgba(160,180,240,.3)', 1.5, () => X.roundRect(x - 70, y - 38, 140, 76, 14), { g: 0 }); T('mes ' + (i + 1), x, y + 66, { k: 'mono', s: 18, a: 'c', c: C.mute }); }
    fade(A(t, 10, .6), () => F([['1.015', 'r'], ['¹²', 'r', COM], [' = ', 'r'], [(1.015 ** k).toFixed(3), 'r', COM]], CX, 900, 64));
    fade(A(t, 20, .6), () => { T('19.6 %', 360, 1060, { k: 'r', s: 56, a: 'c', c: COM, g: 14 }); T('18 %', 720, 1060, { k: 'r', s: 56, a: 'c', c: C.mute }); stroke(EXT, 3, () => { X.moveTo(660, 1045); X.lineTo(780, 1030); }, { g: 8 }); });
  },
  // 8 · La cuenta de Franklin: cien años al 5 %.
  cien(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['1 000 · 1.05', 'r'], ['¹⁰⁰', 'r', COM]], CX, 470, 64));
    const P = (x, y) => [170 + x * 7.8, 1150 - y * .0042]; axes(170, 1150, 800, 600, 'años', '£', 1);
    curve(x => P(x, 1000 * 1.05 ** x), 0, 100, COM, seg(t, 1.5, 9));
    fade(A(t, 10, .6), () => { const [x, y] = P(100, 131501); dot(x, y, 12, COM, 26); T('≈ 131 501', x - 20, y - 14, { k: 'r', s: 40, a: 'r', c: COM }); });
    fade(A(t, 19, .6), () => { stroke(SIM, 3.5, () => { X.moveTo(...P(0, 1000)); X.lineTo(...P(100, 6000)); }, { g: 12 }); T('simple: 6 000', 960, P(100, 6000)[1] - 26, { k: 'r', s: 34, a: 'r', c: SIM }); });
  },
  // 9 · Valor presente: dividir la meta entre el factor.
  presente(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { chip(CX, 500, 520, 110, COM, '10 000 000 en 10 años', { s: 40 }); });
    fade(A(t, 10, .6), () => { arrow(CX, 580, CX, 700, CAP, eo(seg(t, 10.2, 11.4)), 3); T('÷ 1.1¹⁰ ≈ 2.5937', CX + 40, 660, { k: 'r', s: 36, a: 'l', c: CAP }); });
    fade(A(t, 20, .6), () => { chip(CX, 790, 520, 110, CAP, '≈ 3 855 433 hoy', { s: 44 }); F([['C', 'i', CAP], [' = ', 'r'], ['M', 'i', COM], [' / (1 + ', 'r'], ['r', 'i'], [')', 'r'], ['ⁿ', 'r']], CX, 960, 60); });
  },
  // 10 · Cierre: resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const v = 5e6 * eio(seg(t, .5, 8)); T('≈ US$ ' + pesos(v), CX, 760, { k: 'r', s: 84, a: 'c', c: COM, g: 18 }); T('Boston · 1990', CX, 840, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['I', 'i'], [' = ', 'r'], ['C', 'i'], ['rt', 'i']], 'simple: línea recta'], [[['C', 'i'], ['(1 + ', 'r'], ['r', 'i'], [')', 'r'], ['ⁿ', 'r']], 'compuesto: exponencial'], [[['72 / tasa', 'r']], 'años para duplicar'], [[['M', 'i'], [' / (1 + ', 'r'], ['r', 'i'], [')', 'r'], ['ⁿ', 'r']], 'valor presente']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [CAP, SIM, COM]);
    });
  },
};
