// «La predicción de Moore» · escenas de la lección alg-13d. Motor en kit.js y escala.js; guion en sucesivos.data.js.
// Primer cambio en ámbar, segundo en cian, resultado en verde; lo que se pierde en rosa.
const F1 = C.amber, F2 = C.cyan, RES = C.green, LOSS = C.mag;
// Un chip: cuadrado con patas; dentro, n puntos en cuadrícula (hasta 256).
function chipIC(cx, cy, s, n, col = C.violet) {
  stroke(col, 3, () => X.roundRect(cx - s / 2, cy - s / 2, s, s, 14), { g: 16 });
  for (let i = 0; i < 8; i++) { const p = -s / 2 + s * (i + .5) / 8; stroke(hexA(col, .7), 3, () => { X.moveTo(cx + p, cy - s / 2); X.lineTo(cx + p, cy - s / 2 - 22); X.moveTo(cx + p, cy + s / 2); X.lineTo(cx + p, cy + s / 2 + 22); X.moveTo(cx - s / 2, cy + p); X.lineTo(cx - s / 2 - 22, cy + p); X.moveTo(cx + s / 2, cy + p); X.lineTo(cx + s / 2 + 22, cy + p); }, { g: 0 }); }
  const m = Math.min(256, n), side = Math.ceil(Math.sqrt(m)), g = (s - 40) / side;
  for (let i = 0; i < m; i++) { X.fillStyle = hexA(C.green, .85); X.fillRect(cx - s / 2 + 20 + (i % side) * g + g * .15, cy - s / 2 + 20 + Math.floor(i / side) * g + g * .15, g * .7, g * .7); }
}
// Cadena de precios: nodos [texto, color] en xs, con flechas rotuladas entre ellos; k cuántos pasos van.
function chain(y, xs, nodes, labs, k, o = {}) {
  nodes.forEach(([s, c], i) => fade(clamp(k - i + 1), () => chip(xs[i], y, o.w || 230, 100, c, s, { s: o.s || 44, c })));
  labs.forEach(([s, c], i) => fade(clamp(k - i), () => { const a = xs[i] + (o.w || 230) / 2 + 8, b = xs[i + 1] - (o.w || 230) / 2 - 8; arrow(a, y, b, y, c, 1, 3.5); T(s, (a + b) / 2, y - 68, { k: 'r', s: 34, a: 'c', c }); }));
}
const S = {
  // 1 · Moore: el chip cuyos transistores se duplican: 1, 2, 4, 8, …
  moore(t) {
    stars(t, .5);
    const n = t < 9.6 ? 4 : Math.pow(2, 2 + Math.min(6, Math.floor((t - 9.6) / 1.3)));
    chipIC(CX, 760, 460, n);
    fade(A(t, 1.4, .5), () => T('Gordon Moore · 1965', CX, 1100, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    fade(A(t, 9.8, .5), () => T('transistores en el dibujo = ' + n, 96, 1196, { k: 'mono', s: 26, c: RES, g: 8 }));
    fade(A(t, 18.8, .6), () => F([['× 2', 'r', F1], [' = ', 'r'], ['+100 %', 'r', RES]], CX, 1290, 72));
  },
  // 2 · Dos descuentos: 100 % → × 0.60 → 60 % → × 0.75 → 45 %.
  dosdescuentos(t) {
    stars(t, .3);
    const a = eio(seg(t, 3, 5.5)), b = eio(seg(t, 6, 8.5)), x0 = 140, w = 800, f = lerp(1, .6, a) * lerp(1, .75, b);
    stroke(hexA(C.ink, .4), 2, () => X.rect(x0, 520, w, 100), { g: 0, dash: [8, 8] }); bar(x0, 520, w * f, 100, f < .59 ? F2 : f < .99 ? F1 : C.ink, 1, { fill: .3 });
    T(Math.round(f * 100) + ' %', x0 + w * f / 2, 590, { k: 'r', s: 48, a: 'c', c: C.ink });
    T('−40 %', x0 + w * .8, 690, { k: 'r', s: 40, a: 'c', c: F1 }); fade(b, () => T('−25 %', x0 + w * .525, 690, { k: 'r', s: 40, a: 'c', c: F2 }));
    fade(A(t, 10.2, .6), () => { chip(330, 880, 300, 110, F1, '× 0.60', { s: 56, c: F1 }); chip(750, 880, 300, 110, F2, '× 0.75', { s: 56, c: F2 }); T('1 − 0.40', 330, 980, { k: 'mono', s: 22, a: 'c', c: C.mute }); T('1 − 0.25', 750, 980, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
    fade(A(t, 19.2, .6), () => F([['0.60', 'r', F1], [' · ', 'r'], ['0.75', 'r', F2], [' = ', 'r'], ['0.45', 'r', RES]], CX, 1150, 84, { rev: seg(t, 19.4, 22) }));
    fade(win(t, 1, 9.6), () => { F([['40 % + 25 %', 'r'], [' ≠ ', 'r', C.red], ['65 %', 'r']], CX, 1150, 64); });
  },
  // 3 · No se suman: 200 000 → 120 000 → 90 000; descuento total 55 %.
  nosuman(t) {
    stars(t, .3);
    chain(620, [200, 540, 880], [['200 000', C.ink], ['120 000', F1], ['90 000', RES]], [['× 0.60', F1], ['× 0.75', F2]], t < 10 ? seg(t, 1, 3) : 1 + seg(t, 10.4, 12.4), { w: 250, s: 42 });
    fade(A(t, 10.4, .6), () => F([['25 % de ', 'r'], ['120 000', 'r', F1], [' = 30 000', 'r']], CX, 820, 50));
    fade(A(t, 13.4, .5), () => T('no el 25 % de 200 000', CX, 880, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    fade(A(t, 19.2, .6), () => {
      F([['90 000 / 200 000 = ', 'r'], ['0.45', 'r', RES]], CX, 1010, 56);
      F([['descuento total = ', 'it'], ['55 %', 'r', RES]], 360, 1160, 56, { max: 420 }); F([['65 %', 'r', C.red]], 800, 1160, 64); check(800, 1140, 46, false, A(t, 21.4, .5));
    });
  },
  // 4 · El orden no importa: las dos cadenas llegan a 90 000.
  orden(t) {
    stars(t, .3);
    chain(560, [200, 540, 880], [['200 000', C.ink], ['120 000', F1], ['90 000', RES]], [['× 0.60', F1], ['× 0.75', F2]], 2, { w: 250, s: 42 });
    chain(800, [200, 540, 880], [['200 000', C.ink], ['150 000', F2], ['90 000', RES]], [['× 0.75', F2], ['× 0.60', F1]], t < 10 ? seg(t, 1, 3) : 1 + seg(t, 10.4, 12.4), { w: 250, s: 42 });
    fade(A(t, 13, .5), () => { stroke(RES, 3, () => X.roundRect(740, 490, 280, 380, 20), { g: 16 }); T('el mismo final', 880, 920, { k: 'mono', s: 22, a: 'c', c: RES }); });
    fade(A(t, 19.2, .6), () => F([['0.60', 'r', F1], [' · ', 'r'], ['0.75', 'r', F2], [' = ', 'r'], ['0.75', 'r', F2], [' · ', 'r'], ['0.60', 'r', F1]], CX, 1100, 72));
    fade(A(t, 21, .5), () => T('el producto es conmutativo', CX, 1180, { k: 'mono', s: 26, c: C.mute, a: 'c' }));
  },
  // 5 · Subir y bajar: la acción de 100 cae a 50 y sube a 75; para volver hace falta +100 %.
  subebaja(t) {
    stars(t, .3);
    const x0 = 200, y0 = 1120, sy = 5.2, px = i => x0 + i * 300, py = v => y0 - v * sy;
    axes(x0, y0, 720, 640, 'año', 'precio', 1);
    const a = eio(seg(t, 2, 5)), b = eio(seg(t, 5.5, 8.5)), c = eio(seg(t, 21, 24));
    stroke(hexA(C.ink, .4), 2, () => { X.moveTo(x0, py(100)); X.lineTo(x0 + 700, py(100)); }, { g: 0, dash: [8, 8] }); T('100', x0 - 16, py(100) + 10, { k: 'r', s: 32, a: 'r', c: C.ink });
    stroke(LOSS, 4, () => { X.moveTo(px(0), py(100)); X.lineTo(lerp(px(0), px(1), a), lerp(py(100), py(50), a)); }); dot(px(0), py(100), 10, C.ink, 18);
    if (a >= 1) { dot(px(1), py(50), 10, LOSS, 18); T('50', px(1), py(50) + 56, { k: 'r', s: 40, a: 'c', c: LOSS }); T('× 0.5', (px(0) + px(1)) / 2 - 60, py(75) + 20, { k: 'mono', s: 26, a: 'c', c: LOSS }); }
    if (b > 0 && t < 20) stroke(RES, 4, () => { X.moveTo(px(1), py(50)); X.lineTo(lerp(px(1), px(2), b), lerp(py(50), py(75), b)); });
    if (b >= 1 && t < 20) { dot(px(2), py(75), 10, RES, 18); T('75', px(2) + 50, py(75) + 12, { k: 'r', s: 40, a: 'c', c: RES }); T('× 1.5', (px(1) + px(2)) / 2 + 70, py(62) + 40, { k: 'mono', s: 26, a: 'c', c: RES }); }
    if (t >= 20) { stroke(F1, 4, () => { X.moveTo(px(1), py(50)); X.lineTo(lerp(px(1), px(2), c), lerp(py(50), py(100), c)); }); if (c >= 1) { dot(px(2), py(100), 10, F1, 18); T('× 2 = +100 %', (px(1) + px(2)) / 2 + 130, py(75) + 40, { k: 'mono', s: 26, a: 'c', c: F1 }); } }
    fade(win(t, 10.2, 19.6), () => F([['0.5', 'r', LOSS], [' · ', 'r'], ['1.5', 'r', RES], [' = ', 'r'], ['0.75', 'r']], CX, 1260, 64));
    fade(A(t, 20.2, .5), () => F([['0.5', 'r', LOSS], [' · ', 'r'], ['2', 'r', F1], [' = 1', 'r']], CX, 1260, 64));
  },
  // 6 · Nunca queda igual: (1 + r)(1 − r) = 1 − r²; con r = 0.3 queda 0.91.
  nuncaigual(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['(1 + ', 'r'], ['r', 'i', RES], [')(1 − ', 'r'], ['r', 'i', LOSS], [') = 1 − ', 'r'], ['r', 'i', F1], ['²', 'r', F1]], CX, 520, 76, { rev: seg(t, 1, 5) }));
    const x0 = 240, w = 400, y = 700, a = t < 10 ? 0 : eio(seg(t, 10.6, 12.6)), b = t < 10 ? 0 : eio(seg(t, 13, 15)), v = lerp(1, 1.3, a) * lerp(1, .7, b);
    stroke(hexA(C.ink, .5), 2, () => { X.moveTo(x0 + w, y - 20); X.lineTo(x0 + w, y + 120); }, { g: 0, dash: [8, 8] }); T('1', x0 + w, y + 160, { k: 'r', s: 36, a: 'c', c: C.ink });
    bar(x0, y, w * v, 90, v > 1.001 ? RES : v < .999 ? LOSS : C.ink, 1, { fill: .3 }); T('× ' + v.toFixed(2), x0 + w * v / 2, y + 60, { k: 'r', s: 44, a: 'c', c: C.ink });
    fade(A(t, 15.2, .5), () => { F([['1.3', 'r', RES], [' · ', 'r'], ['0.7', 'r', LOSS], [' = ', 'r'], ['0.91', 'r']], CX, 960, 68); T('se pierde 0.09 = 0.3²', CX, 1030, { k: 'mono', s: 26, c: F1, a: 'c', g: 8 }); });
    fade(A(t, 19.2, .6), () => F([['r', 'i', F1], ['² > 0', 'r', F1], ['  ⟹  ', 'r'], ['1 − ', 'r'], ['r', 'i', F1], ['²', 'r', F1], [' < 1', 'r']], CX, 1180, 64));
  },
  // 7 · Una potencia: el árbol de duplicaciones; 2⁵ = 32; el exponente sube hasta 25.
  potencia(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { F([['f', 'i', F1], [' · ', 'r'], ['f', 'i', F1], [' · … · ', 'r'], ['f', 'i', F1], [' = ', 'r'], ['f', 'i', F1], ['ⁿ', 'r', RES]], CX, 760, 110, { rev: seg(t, 1, 5) }); T('n veces el mismo factor', CX, 860, { k: 'mono', s: 26, c: C.mute, a: 'c' }); });
    fade(win(t, 10, 19.8), () => {
      for (let r = 0; r <= 5; r++) fade(A(t, 10.4 + r * 1.1, .5), () => { const n = 2 ** r, y = 470 + r * 110; for (let i = 0; i < n; i++) dot(CX + (i - (n - 1) / 2) * Math.min(60, 760 / n), y, Math.max(5, 14 - r * 1.6), r === 5 ? RES : F1, 14); T(String(n), 980, y + 12, { k: 'mono', s: 26, a: 'r', c: r === 5 ? RES : C.mute }); T(r * 2 + ' años', 100, y + 10, { k: 'mono', s: 22, c: C.mute }); });
      fade(A(t, 16.4, .5), () => F([['2⁵ = ', 'r'], ['32', 'r', RES]], CX, 1190, 76));
    });
    fade(A(t, 20, .6), () => {
      const e = Math.round(lerp(5, 25, eio(seg(t, 20.6, 25.6))));
      T('2', CX - 180, 820, { k: 'r', s: 220, a: 'c', c: F1, g: 20 }); T(String(e), CX - 70, 690, { k: 'r', s: 90, c: RES, g: 14 });
      T('= ' + num(2 ** e), CX, 1010, { k: 'r', s: 84, a: 'c', c: C.ink, g: 8 });
      T('años = ' + e * 2, 96, 1196, { k: 'mono', s: 26, c: RES, g: 8 }); T('duplicaciones = ' + e, 984, 1196, { k: 'mono', s: 26, a: 'r', c: F1, g: 8 });
    });
  },
  // 8 · Del 4004 a hoy: 2 300 · 2²⁵ ≈ 77 000 millones.
  chips(t) {
    stars(t, .3);
    chipIC(300, 640, 260, 16, C.violet); T('Intel 4004 · 1971', 300, 850, { k: 'mono', s: 24, a: 'c', c: C.mute }); T('2 300', 300, 920, { k: 'r', s: 64, a: 'c', c: F1, g: 12 });
    fade(A(t, 10.2, .6), () => {
      const k = eio(seg(t, 10.6, 15)), v = 2300 * Math.pow(2, 25 * k);
      arrow(470, 640, 610, 640, RES, 1, 4); T('· 2²⁵', 540, 610, { k: 'r', s: 40, a: 'c', c: RES });
      chipIC(790, 640, 260, Math.min(256, Math.round(16 * Math.pow(2, 4 * k))), C.cyan);
      T(k < 1 ? num(v) : '≈ 77 000 000 000', CX, 1080, { k: 'r', s: 72, a: 'c', c: RES, g: 12, max: 960 });
      fade(A(t, 15, .5), () => T('setenta y siete mil millones', CX, 1150, { k: 'mono', s: 24, c: C.mute, a: 'c' }));
    });
    fade(A(t, 19.2, .6), () => { T('chips de hoy', 790, 850, { k: 'mono', s: 24, a: 'c', c: C.mute }); T('decenas de miles de millones', 790, 900, { k: 'mono', s: 22, a: 'c', c: C.cyan }); });
  },
  // 9 · Poco a poco: 7 % cada año durante 10 años; multiplicando 1.97, sumando 1.70.
  pocoapoco(t) {
    stars(t, .3);
    const x0 = 150, y0 = 1120, u = 300, bw = 56, n = Math.min(10, Math.floor(seg(t, 1, 12) * 11));
    stroke('rgba(200,210,245,.5)', 2, () => { X.moveTo(x0 - 20, y0); X.lineTo(940, y0); }, { g: 0 });
    for (let i = 0; i <= n; i++) { const v = Math.pow(1.07, i); bar(x0 + i * 70, y0 - v * u, bw, v * u, i === 10 ? RES : F1, 1, { fill: .3 }); T(String(i), x0 + i * 70 + bw / 2, y0 + 40, { k: 'mono', s: 20, a: 'c', c: C.mute }); }
    T('años', 940, y0 + 80, { k: 'mono', s: 20, a: 'r', c: C.mute });
    stroke(hexA(C.ink, .5), 2, () => { X.moveTo(x0, y0 - u); X.lineTo(900, y0 - u); }, { g: 0, dash: [8, 8] }); T('1', x0 - 30, y0 - u + 10, { k: 'r', s: 30, a: 'c' });
    T('× 1.07 cada año', CX, 440, { k: 'mono', s: 28, c: F1, a: 'c', g: 8 });
    T('factor = ' + Math.pow(1.07, n).toFixed(3), 96, 1300, { k: 'mono', s: 26, c: RES, g: 8 });
    fade(A(t, 12.4, .6), () => { T('× 1.97', x0 + 700 + bw / 2, y0 - 1.967 * u - 24, { k: 'r', s: 40, a: 'c', c: RES, g: 12 }); });
    fade(A(t, 20.2, .6), () => { stroke(LOSS, 3, () => { X.moveTo(x0 + bw / 2, y0 - u); X.lineTo(x0 + 700 + bw / 2, y0 - 1.7 * u); }, { g: 10, dash: [10, 8] }); T('sumando: × 1.70', 190, 660, { k: 'mono', s: 22, c: LOSS }); F([['1.07', 'r', F1], ['¹⁰', 'r', RES], [' ≈ 1.97', 'r']], 360, 560, 60); });
  },
  // 10 · Cierre: el chip lleno; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { chipIC(CX, 760, 420, 256); F([['2 · 2 · 2 · … = ', 'r'], ['2ⁿ', 'r', RES]], CX, 1130, 64); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['0.60', 'r', F1], [' · ', 'r'], ['0.75', 'r', F2], [' = 0.45', 'r']], 'se multiplican'], [[['f', 'i', F1], ['₁', 'r'], ['f', 'i', F2], ['₂', 'r'], [' = ', 'r'], ['f', 'i', F2], ['₂', 'r'], ['f', 'i', F1], ['₁', 'r']], 'en cualquier orden'], [[['(1 + ', 'r'], ['r', 'i'], [')(1 − ', 'r'], ['r', 'i'], [') < 1', 'r']], 'subir y bajar el mismo %'], [[['f', 'i', F1], ['ⁿ', 'r', RES]], 'n veces: una potencia']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [F1, RES, F2]);
    });
  },
};
