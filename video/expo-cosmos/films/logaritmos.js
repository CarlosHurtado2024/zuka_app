// «Las tablas de Napier» · escenas de la lección alg-72. Motor en kit.js y expo.js; guion en logaritmos.data.js.
// Las potencias en ámbar, los exponentes (logaritmos) en cian, lo que no vale en rosa, el pH en verde.
const PW = C.amber, LG = C.cyan, NO = C.mag, PH = C.green;
// Dos reglas paralelas: arriba los números 2^k, abajo sus exponentes k (de 0 a 8).
function rulers(x0, y, w, k = 1, hi = []) {
  const step = w / 8;
  stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(x0, y); X.lineTo(x0 + w * k, y); }, { g: 4 });
  for (let i = 0; i <= 8; i++) {
    if (i / 8 > k + 1e-9) break; const x = x0 + i * step, on = hi.includes(i);
    stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(x, y - 12); X.lineTo(x, y + 12); }, { g: 0 });
    T(String(2 ** i), x, y - 30, { k: 'r', s: 34, a: 'c', c: on ? PW : C.ink }); T(String(i), x, y + 54, { k: 'r', s: 34, a: 'c', c: on ? LG : C.mute });
  }
}
const S = {
  // 1 · Napier: dos columnas, números y exponentes.
  napier(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => T('John Napier · Edimburgo · 1614', CX, 460, { k: 'mono', s: 26, a: 'c', c: C.mute }));
    fade(A(t, 9.6, .6), () => { T('4 832 × 7 159 = …', CX, 640, { k: 'r', s: 52, a: 'c', c: NO }); T('3.684 + 3.855 = 7.539', CX, 730, { k: 'r', s: 52, a: 'c', c: PH }); T('sus logaritmos', CX, 790, { k: 'mono', s: 24, a: 'c', c: PH }); });
    fade(A(t, 18.6, .6), () => { rulers(140, 950, 800, eio(seg(t, 18.8, 22))); T('número', 120, 920, { k: 'mono', s: 20, a: 'r', c: PW }); T('exponente', 120, 1004, { k: 'mono', s: 20, a: 'r', c: LG }); });
  },
  // 2 · Al revés de la potencia: 2 elevado a cuánto da 32.
  pregunta(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['2', 'r'], ['⁵', 'r', LG], [' = ', 'r'], ['32', 'r', PW]], CX, 520, 80));
    fade(A(t, 10, .6), () => { F([['2', 'r'], ['ˣ', 'r', LG], [' = ', 'r'], ['32', 'r', PW]], CX, 700, 80); const n = Math.min(5, Math.floor(seg(t, 10.5, 16) * 6)); for (let i = 1; i <= n; i++) T('× 2', 140 + i * 150, 840, { k: 'r', s: 36, a: 'c', c: LG }); if (n >= 5) T('5 veces', CX, 900, { k: 'mono', s: 24, a: 'c', c: LG }); });
    fade(A(t, 19, .6), () => F([['log', 'r'], ['₂', 'r'], [' 32', 'r', PW], [' = ', 'r'], ['5', 'r', LG]], CX, 1060, 84));
  },
  // 3 · La definición, en dos sentidos.
  definicion(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['log', 'r'], ['b', 'sb'], [' ', 'r'], ['a', 'i', PW], [' = ', 'r'], ['c', 'i', LG]], 300, 540, 64); F([['b', 'i'], ['ᶜ', 'r', LG], [' = ', 'r'], ['a', 'i', PW]], 790, 540, 64); hop(420, 680, 580, -60, C.violet, eo(seg(t, 2, 3.5))); hop(680, 420, 500, 60, C.violet, eo(seg(t, 3.5, 5))); });
    fade(A(t, 10, .6), () => { F([['log', 'r'], ['₁₀', 'r'], [' 1 000', 'r', PW], [' = ', 'r'], ['3', 'r', LG]], 300, 760, 54); F([['10', 'r'], ['³', 'r', LG], [' = ', 'r'], ['1 000', 'r', PW]], 790, 760, 54); });
    fade(A(t, 20, .6), () => { T('b > 0, b ≠ 1', CX, 940, { k: 'mono', s: 30, a: 'c', c: C.ink }); T('a > 0: bᶜ nunca es 0 ni negativo', CX, 1000, { k: 'mono', s: 28, a: 'c', c: NO }); });
  },
  // 4 · La gráfica: el espejo de 2^x en y = x.
  grafica(t) {
    stars(t, .3);
    const u = 80, ox = CX - 80, oy = 1080, P = (x, y) => [ox + x * u, oy - y * u];
    stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(ox - 4 * u, oy); X.lineTo(ox + 6 * u, oy); X.moveTo(ox, oy + 4 * u); X.lineTo(ox, oy - 6.5 * u); }, { g: 4 });
    stroke(C.violet, 2, () => { X.setLineDash([10, 10]); X.moveTo(...P(-3.5, -3.5)); X.lineTo(...P(6, 6)); X.setLineDash([]); }, { g: 8 });
    curve(x => P(x, 2 ** x), -3.5, 2.55, PW, seg(t, .8, 3)); curve(y => P(2 ** y, y), -3.5, 2.55, LG, seg(t, 3.5, 6));
    fade(A(t, 6, .5), () => { T('2ˣ', P(2.4, 5.6)[0] - 30, P(2.4, 5.6)[1], { k: 'r', s: 36, a: 'r', c: PW }); T('log₂ x', P(5.8, 2.6)[0], P(5.8, 2.6)[1] - 22, { k: 'r', s: 36, a: 'r', c: LG }); T('y = x', P(5.2, 5.2)[0] + 14, P(5.2, 5.2)[1], { k: 'mono', s: 22, c: C.violet }); });
    fade(A(t, 10, .5), () => { dot(...P(1, 0), 11, LG, 22); T('(1, 0)', P(1, 0)[0] + 16, P(1, 0)[1] + 44, { k: 'r', s: 32, c: LG }); dot(...P(0, 1), 9, PW, 18); });
  },
  // 5 · Producto en suma: 8 · 32 en la regla.
  producto(t) {
    stars(t, .3);
    rulers(140, 700, 800, 1, t > 10 ? [3, 5, 8] : [3, 5]);
    fade(A(t, .8, .6), () => F([['8 · 32 = ', 'r'], ['2', 'r'], ['³', 'r', LG], [' · ', 'r'], ['2', 'r'], ['⁵', 'r', LG], [' = ', 'r'], ['2', 'r'], ['⁸', 'r', LG], [' = 256', 'r', PW]], CX, 500, 52, { max: 980 }));
    fade(A(t, 10, .5), () => { const s = 100; hop(140, 140 + 3 * s, 840, -50, LG, eo(seg(t, 10.2, 11.5))); hop(140 + 3 * s, 140 + 8 * s, 840, -70, LG, eo(seg(t, 11.5, 13))); T('3 + 5 = 8', CX, 960, { k: 'r', s: 50, a: 'c', c: LG }); });
    fade(A(t, 20, .6), () => F([['log', 'r'], ['(', 'r'], ['ab', 'i', PW], [') = log ', 'r'], ['a', 'i'], [' + log ', 'r', LG], ['b', 'i']], CX, 1120, 60));
  },
  // 6 · Cociente, potencia y lo que no se parte.
  propiedades(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['log', 'r'], ['(', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], [') = log ', 'r'], ['a', 'i'], [' − log ', 'r', LG], ['b', 'i']], CX, 520, 56));
    fade(A(t, 10, .6), () => F([['log', 'r'], ['(', 'r'], ['a', 'i'], ['ⁿ', 'r', LG], [') = ', 'r'], ['n', 'i', LG], [' · log ', 'r'], ['a', 'i']], CX, 680, 56));
    fade(A(t, 19, .6), () => { F([['log', 'r'], ['₁₀', 'r'], ['(10 + 10)', 'r'], [' ≠ 1 + 1', 'r', NO]], CX, 860, 56); T('log 20 ≈ 1.30', CX, 940, { k: 'mono', s: 28, a: 'c', c: C.mute }); });
  },
  // 7 · Briggs: la base 10 cuenta los ceros.
  briggs(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => T('Henry Briggs · Londres · 1617', CX, 460, { k: 'mono', s: 26, a: 'c', c: C.mute }));
    const x0 = 160, w = 760, px = v => x0 + Math.log10(v) / 3 * w;
    fade(A(t, 10, .6), () => { stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(x0, 760); X.lineTo(x0 + w, 760); }, { g: 4 }); [1, 10, 100, 1000].forEach((v, i) => { stroke('rgba(225,232,255,.8)', 2, () => { X.moveTo(px(v), 748); X.lineTo(px(v), 772); }, { g: 0 }); T(num(v), px(v), 720, { k: 'r', s: 34, a: 'c', c: PW }); T(String(i), px(v), 820, { k: 'r', s: 34, a: 'c', c: LG }); }); });
    fade(A(t, 20, .6), () => { dot(px(500), 760, 10, PH, 20); T('500', px(500), 670, { k: 'r', s: 30, a: 'c', c: PH }); T('2.7', px(500), 870, { k: 'r', s: 34, a: 'c', c: PH }); });
  },
  // 8 · El pH: cada punto es un factor de 10.
  ph(t) {
    stars(t, .3);
    const x0 = 140, w = 800, px = v => x0 + v / 14 * w;
    for (let i = 0; i <= 14; i++) { X.save(); X.fillStyle = hexA(i < 7 ? PW : i > 7 ? C.violet : PH, .18 + .02 * Math.abs(7 - i)); X.fillRect(px(i) - w / 30, 600, w / 15, 60); X.restore(); T(String(i), px(i), 700, { k: 'r', s: 26, a: 'c', c: C.mute }); }
    fade(A(t, 10, .6), () => { dot(px(2), 630, 12, PW, 22); T('limón', px(2), 570, { k: 'mono', s: 24, a: 'c', c: PW }); dot(px(7), 630, 12, PH, 22); T('agua', px(7), 570, { k: 'mono', s: 24, a: 'c', c: PH }); });
    const k = Math.min(5, Math.floor(seg(t, 20.5, 26) * 6));
    fade(A(t, 20, .6), () => { for (let i = 0; i < k; i++) hop(px(7 - i), px(6 - i), 740, -40, LG, 1); T('10 · 10 · 10 · 10 · 10'.slice(0, Math.max(0, k * 5 - 3)), CX, 880, { k: 'r', s: 40, a: 'c', c: LG }); if (k >= 5) T('= 100 000', CX, 960, { k: 'r', s: 56, a: 'c', c: PW, g: 14 }); });
  },
  // 9 · Cambio de base: log₃ 50.
  cambio(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['log', 'r'], ['b', 'sb'], [' ', 'r'], ['a', 'i'], [' = log ', 'r'], ['a', 'i'], [' / log ', 'r', LG], ['b', 'i', LG]], CX, 520, 60));
    fade(A(t, 10, .6), () => { F([['log', 'r'], ['₃', 'r'], [' 50 = ', 'r'], ['1.699', 'r', PW], [' / ', 'r'], ['0.477', 'r', LG]], CX, 700, 54); F([['≈ 3.56', 'r', PH]], CX, 790, 64); });
    fade(A(t, 19, .6), () => { const v = 3 ** (3.56 * eio(seg(t, 19.2, 24))); F([['3', 'r'], ['3.56', 'sp', PH], [' ≈ ', 'r'], [v.toFixed(1), 'r', PW]], CX, 960, 60); if (t > 24) check(CX + 260, 940, 24, true, A(t, 24, .5)); });
  },
  // 10 · Cierre: resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => rulers(140, 760, 800, 1, [3, 5, 8]));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['log', 'r'], ['b', 'sb'], [' ', 'r'], ['a', 'i'], [' = ', 'r'], ['c', 'i']], 'es un exponente'], [[['log ', 'r'], ['ab', 'i'], [' = log ', 'r'], ['a', 'i'], [' + log ', 'r'], ['b', 'i']], 'producto → suma'], [[['log ', 'r'], ['a', 'i'], ['ⁿ', 'r'], [' = ', 'r'], ['n', 'i'], [' log ', 'r'], ['a', 'i']], 'potencia → producto'], [[['log ', 'r'], ['a', 'i'], [' / log ', 'r'], ['b', 'i']], 'cambio de base']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [PW, LG, PH]);
    });
  },
};
