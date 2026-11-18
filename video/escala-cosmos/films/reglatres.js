// «La regla de oro» · escenas de la lección alg-12f. Motor en kit.js y escala.js; guion en reglatres.data.js.
// Cada magnitud tiene su color de columna; la incógnita va en verde; lo directo en verde, lo inverso en rosa.
const K1 = C.amber, K2 = C.cyan, K3 = C.violet, XX = C.green;
// Tabla de la regla de tres centrada en cx: cabeceras y dos filas. o.a (0–1) aparición de la fila 2; o.x texto de la incógnita.
function tabla(cx, y, heads, r1, r2, o = {}) {
  const n = heads.length, cw = o.cw || (n === 2 ? 330 : 280), rh = 110, x0 = cx - cw * n / 2, cols = o.cols || [K1, K2, K3];
  stroke('rgba(200,210,245,.55)', 2, () => { X.roundRect(x0, y, cw * n, rh * 3, 18); X.moveTo(x0, y + rh); X.lineTo(x0 + cw * n, y + rh); X.moveTo(x0, y + rh * 2); X.lineTo(x0 + cw * n, y + rh * 2); for (let i = 1; i < n; i++) { X.moveTo(x0 + cw * i, y); X.lineTo(x0 + cw * i, y + rh * 3); } }, { g: 0 });
  heads.forEach((h, i) => T(h, x0 + cw * (i + .5), y + 68, { k: 'it', s: 38, a: 'c', c: cols[i], max: cw - 20 }));
  r1.forEach((v, i) => fade(o.a1 ?? 1, () => T(String(v), x0 + cw * (i + .5), y + rh + 74, { k: 'r', s: 56, a: 'c', c: C.ink })));
  r2.forEach((v, i) => fade(o.a2 ?? 1, () => { const isx = v === 'x' || (o.x !== undefined && i === n - 1 && o.xi === undefined) || i === o.xi; T(String(isx && o.x !== undefined ? o.x : v), x0 + cw * (i + .5), y + rh * 2 + 74, { k: isx && o.x === undefined ? 'i' : 'r', s: 56, a: 'c', c: isx ? XX : C.ink, g: isx ? 14 : 0 }); }));
  return { x: i => x0 + cw * (i + .5), y1: y + rh * 1.5, y2: y + rh * 2.5, left: x0, right: x0 + cw * n };
}
// Flecha vertical al lado de una columna: dir 1 baja (crece), −1 sube.
function varrow(x, ya, yb, col, k) { arrow(x, ya, x, yb, col, k, 4); }

const S = {
  // 1 · Aryabhata: la regla viaja de la India al mundo árabe y a Europa; «regla de oro».
  aryabhata(t) {
    stars(t, .5);
    const P = [[820, 900, 'India', C.amber], [540, 700, 'mundo árabe', C.cyan], [260, 520, 'Europa', C.violet]];
    fade(A(t, .8, .6), () => { T('Āryabhaṭīya · año 499', CX, 1080, { k: 'mono', s: 26, c: C.mute, a: 'c' }); F([['a', 'i', K1], [' → ', 'r'], ['b', 'i', K2], ['      ', 'r'], ['c', 'i', K1], [' → ', 'r'], ['x', 'i', XX]], CX, 1200, 80, { rev: seg(t, 1.4, 4) }); });
    const k = seg(t, 9.8, 16);
    P.forEach(([x, y, n, c], i) => fade(A(t, i === 0 ? .8 : 9.8 + i * 2.6, .5), () => { ring(x, y, 34, c, 3); dot(x, y, 8, c, 18); T(n, x, y + 80, { k: 'it', s: 36, a: 'c', c }); }));
    if (k > 0) { stroke(hexA(C.ink, .5), 2, () => { for (let i = 0; i <= 60 * k; i++) { const u = i / 60, a = u < .5 ? 0 : 1, v = u < .5 ? u * 2 : u * 2 - 1, x = lerp(P[a][0], P[a + 1][0], v), y = lerp(P[a][1], P[a + 1][1], v) - 60 * Math.sin(Math.PI * v); i ? X.lineTo(x, y) : X.moveTo(x, y); } }, { g: 0, dash: [4, 12] }); }
    fade(A(t, 18.8, .8), () => T('regla de oro', CX, 400, { k: 'it', s: 96, a: 'c', c: '#ffd76a', g: 30 }));
  },
  // 2 · La tabla: columnas = magnitudes, filas = situaciones; tres datos y una x; directa o inversa.
  tabla(t) {
    stars(t, .3);
    const tb = tabla(CX, 520, ['tazas', 'cucharadas'], [2, 3], [8, 'x'], { a1: A(t, 10.2, .5), a2: A(t, 12.6, .5) });
    fade(win(t, 1, 9.6), () => { T('magnitud', tb.x(0), 480, { k: 'mono', s: 24, a: 'c', c: K1 }); T('magnitud', tb.x(1), 480, { k: 'mono', s: 24, a: 'c', c: K2 }); T('situación 1', tb.left - 16, tb.y1 + 8, { k: 'mono', s: 20, a: 'r', c: C.mute }); T('situación 2', tb.left - 16, tb.y2 + 8, { k: 'mono', s: 20, a: 'r', c: C.mute }); });
    fade(A(t, 19, .6), () => { chip(330, 1020, 320, 100, XX, 'directa', { k: 'it', s: 44 }); chip(750, 1020, 320, 100, C.mag, 'inversa', { k: 'it', s: 44 }); T('doble → doble', 330, 1110, { k: 'mono', s: 22, a: 'c', c: C.mute }); T('doble → mitad', 750, 1110, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
    T('datos = ' + (t < 10.2 ? 0 : t < 12.6 ? 2 : 3), 96, 1300, { k: 'mono', s: 26, c: K1, g: 8 });
  },
  // 3 · Directa: reducir a la unidad. 3 ÷ 2 = 1.5 por taza; 8 · 1.5 = 12.
  directa(t) {
    stars(t, .3);
    tabla(CX, 420, ['tazas', 'cucharadas'], [2, 3], [8, 'x'], t > 22 ? { x: 12 } : {});
    fade(A(t, 1.4, .5), () => { varrow(140, 560, 720, XX, eo(seg(t, 1.4, 2.6))); varrow(940, 560, 720, XX, eo(seg(t, 2, 3.2))); });
    fade(A(t, 10.2, .6), () => {
      F([['1 taza  →  ', 'r'], ['3 ÷ 2 = 1.5', 'r', K2], [' cucharadas', 'r']], CX, 900, 50, { rev: seg(t, 10.4, 13) });
      for (let i = 0; i < 8; i++) fade(A(t, 20.2 + i * .15, .3), () => { stroke(K1, 2.5, () => { X.moveTo(160 + i * 96, 990); X.lineTo(166 + i * 96, 1050); X.lineTo(214 + i * 96, 1050); X.lineTo(220 + i * 96, 990); }, { g: 10 }); T('1.5', 190 + i * 96, 1100, { k: 'mono', s: 22, a: 'c', c: K2 }); });
      fade(A(t, 22, .6), () => F([['8 · 1.5 = ', 'r'], ['12', 'r', XX], [' cucharadas', 'r']], CX, 1210, 56));
    });
  },
  // 4 · Igualar cocientes: 3/2 = x/8; 2x = 24; flechas en el mismo sentido.
  cocientes(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => {
      FR(3, 2, 380, 640, 100, K2, { g: 12 }); T('=', CX, 676, { k: 'r', s: 100, a: 'c' }); FR('x', 8, 700, 640, 100, XX, { k: 'i', g: 12 });
      fade(A(t, 10.2, .5), () => { stroke(hexA(C.mag, .7), 3, () => { X.moveTo(410, 570); X.lineTo(670, 730); X.moveTo(410, 730); X.lineTo(670, 570); }, { g: 10, dash: [10, 10] }); F([['2 · ', 'r'], ['x', 'i', XX], [' = 3 · 8 = 24', 'r']], CX, 940, 64, { rev: seg(t, 10.6, 13) }); });
      fade(A(t, 14, .5), () => F([['x', 'i', XX], [' = 24 ÷ 2 = ', 'r'], ['12', 'r', XX]], CX, 1060, 64));
    });
    fade(A(t, 19, .6), () => {
      tabla(CX, 520, ['tazas', 'cucharadas'], [2, 3], [8, 'x'], { x: 12 });
      varrow(140, 660, 820, XX, eo(seg(t, 19.6, 21))); varrow(940, 660, 820, XX, eo(seg(t, 20.2, 21.6)));
      T('× 4', 100, 760, { k: 'mono', s: 26, a: 'c', c: XX }); T('× 4', 990, 760, { k: 'mono', s: 26, a: 'c', c: XX });
      T('directa: el cociente se conserva', CX, 960, { k: 'mono', s: 26, c: XX, a: 'c', g: 8 });
    });
  },
  // 5 · Inversa: 12 personas, 30 días; con 18 personas dura menos. 12 · 30 = 360 raciones.
  inversa(t) {
    stars(t, .3);
    tabla(CX, 400, ['personas', 'días'], [12, 30], [18, 'x'], { a2: A(t, 10.2, .5) });
    fade(A(t, 11.4, .5), () => { varrow(140, 540, 700, C.mag, eo(seg(t, 11.4, 12.6))); varrow(940, 700, 540, C.mag, eo(seg(t, 13, 14.2))); T('crece', 140, 760, { k: 'mono', s: 22, a: 'c', c: C.mag }); T('decrece', 940, 520, { k: 'mono', s: 22, a: 'c', c: C.mag }); });
    fade(A(t, 20.2, .6), () => {
      const k = seg(t, 20.4, 24); for (let r = 0; r < 12; r++) for (let c = 0; c < 30; c++) { if ((r * 30 + c) / 360 > k) continue; X.fillStyle = hexA(K2, .7); X.fillRect(165 + c * 25, 830 + r * 25, 17, 17); }
      T('12 · 30 = ' + Math.round(360 * k), CX, 1190, { k: 'r', s: 56, a: 'c', c: K2, g: 10 }); T('raciones: una por persona y día', CX, 1240, { k: 'mono', s: 22, a: 'c', c: C.mute });
    });
  },
  // 6 · El producto se conserva: las 360 raciones en 18 filas de 20; flechas cruzadas; la trampa de los 45 días.
  inversa2(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => {
      const k = eio(seg(t, 1.5, 4.5)); for (let i = 0; i < 360; i++) { const xa = 165 + (i % 30) * 25, ya = 560 + Math.floor(i / 30) * 25, xb = 290 + (i % 20) * 25, yb = 500 + Math.floor(i / 20) * 25; X.fillStyle = hexA(K2, .7); X.fillRect(lerp(xa, xb, k), lerp(ya, yb, k), 17, 17); }
      T(k < .5 ? '12 filas de 30' : '18 filas de 20', CX, 1010, { k: 'mono', s: 28, c: K2, a: 'c', g: 8 });
      fade(A(t, 5, .5), () => F([['x', 'i', XX], [' = 360 ÷ 18 = ', 'r'], ['20', 'r', XX], [' días', 'r']], CX, 1130, 64));
    });
    fade(A(t, 10, .6), () => {
      tabla(CX, 420, ['personas', 'días'], [12, 30], [18, 'x'], { x: t > 19 && t < 24 ? 45 : 20 });
      varrow(140, 560, 720, C.mag, 1); varrow(940, 720, 560, C.mag, 1);
      fade(win(t, 10.4, 18.8), () => { F([['12 · 30', 'r', K2], [' = ', 'r'], ['18 · 20', 'r', XX]], CX, 900, 64); T('inversa: el producto se conserva', CX, 980, { k: 'mono', s: 26, c: C.mag, a: 'c', g: 8 }); });
      fade(win(t, 19, 24), () => { F([['30 · 18/12 = ', 'r'], ['45', 'r', C.red]], CX, 900, 64); check(CX + 260, 880, 22, false, A(t, 21, .5)); T('más gente y más días: imposible', CX, 980, { k: 'mono', s: 26, c: C.red, a: 'c', g: 8 }); });
      fade(A(t, 24, .5), () => F([['x', 'i', XX], [' = 20 días', 'r']], CX, 900, 64));
    });
  },
  // 7 · Compuesta: tres columnas; se cambia una magnitud a la vez.
  compuesta(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { T('3', CX, 800, { k: 'r', s: 300, a: 'c', c: K3, g: 30 }); T('magnitudes', CX, 900, { k: 'it', s: 56, a: 'c', c: '#c3ccec' }); });
    fade(A(t, 10, .6), () => {
      const tb = tabla(CX, 480, ['impresoras', 'minutos', 'páginas'], [4, 5, '1 200'], [6, 3, 'x'], { a2: A(t, 13.4, .5) });
      fade(A(t, 20.2, .5), () => { const i = t < 24 ? 0 : 1, x = tb.x(i); stroke(XX, 4, () => X.roundRect(x - 130, 480 + 116, 260, 208, 14), { g: 18 }); T(i ? 'ahora, los minutos' : 'primero, las impresoras', CX, 940, { k: 'mono', s: 28, c: XX, a: 'c', g: 8 }); });
    });
  },
  // 8 · Una a la vez: 1 200 → · 6/4 → 1 800 → · 3/5 → 1 080.
  cadena(t) {
    stars(t, .3);
    tabla(CX, 380, ['impresoras', 'minutos', 'páginas'], [4, 5, '1 200'], [6, 3, 'x'], t > 22 ? { x: '1 080' } : {});
    const ys = 900, nodes = [[200, '1 200', C.ink], [540, '1 800', K1], [880, '1 080', XX]];
    fade(A(t, 1, .5), () => chip(nodes[0][0], ys, 220, 110, C.ink, nodes[0][1], { s: 50 }));
    fade(A(t, 2, .6), () => { arrow(320, ys, 420, ys, K1, eo(seg(t, 2, 3.4)), 4); FR(6, 4, 370, ys - 110, 44, K1); T('·', 330, ys - 96, { k: 'r', s: 44, a: 'c', c: K1 }); T('4 → 6 impresoras: más páginas', CX, 1060, { k: 'mono', s: 24, c: K1, a: 'c' }); });
    fade(A(t, 5, .5), () => chip(nodes[1][0], ys, 220, 110, K1, nodes[1][1], { s: 50 }));
    fade(A(t, 10.4, .6), () => { arrow(660, ys, 760, ys, K2, eo(seg(t, 10.4, 11.8)), 4); FR(3, 5, 710, ys - 110, 44, K2); T('·', 670, ys - 96, { k: 'r', s: 44, a: 'c', c: K2 }); T('5 → 3 minutos: menos páginas', CX, 1110, { k: 'mono', s: 24, c: K2, a: 'c' }); });
    fade(A(t, 14, .5), () => chip(nodes[2][0], ys, 220, 110, XX, nodes[2][1], { s: 50, c: XX }));
    fade(A(t, 20.2, .6), () => F([['1 200 · ', 'r'], ['6/4', 'r', K1], [' · ', 'r'], ['3/5', 'r', K2], [' = ', 'r'], ['1 080', 'r', XX]], CX, 1230, 60));
  },
  // 9 · Si es inversa, se voltea: 12 personas y 3 raciones → 18 personas y 2 raciones; 30 · 12/18 · 3/2 = 30.
  volteada(t) {
    stars(t, .3);
    tabla(CX, 400, ['personas', 'comidas', 'días'], [12, 3, 30], [18, 2, 'x'], Object.assign({ a2: t < 10 ? .25 : 1 }, t > 22 ? { x: 30 } : {}));
    fade(win(t, 1, 9.6), () => { F([['a', 'i', K1], [' → ', 'r'], ['b', 'i', K1], ['    inversa:  ', 'it', C.mag], ['a/b', 'i', C.mag]], CX, 880, 60); T('la razón entra al revés del cambio', CX, 960, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
    fade(A(t, 10.2, .6), () => {
      T('12 → 18 personas: menos días', 330, 860, { k: 'mono', s: 22, c: K1, a: 'c' }); FR(12, 18, 330, 960, 56, K1, { g: 10 });
      fade(A(t, 13, .5), () => { T('3 → 2 comidas: más días', 750, 860, { k: 'mono', s: 22, c: K2, a: 'c' }); FR(3, 2, 750, 960, 56, K2, { g: 10 }); });
    });
    fade(A(t, 19.2, .6), () => F([['30 · ', 'r'], ['12/18', 'r', K1], [' · ', 'r'], ['3/2', 'r', K2], [' = ', 'r'], ['30', 'r', XX], [' días', 'r']], CX, 1180, 60, { rev: seg(t, 19.4, 22.4) }));
  },
  // 10 · Cierre: la tabla pequeña y la regla de oro; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { tabla(CX, 520, ['a', 'b'], ['a', 'b'], ['c', 'x'], { cols: [K1, K2] }); T('regla de oro', CX, 1020, { k: 'it', s: 72, a: 'c', c: '#ffd76a', g: 24 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], ['/', 'r'], ['b', 'i'], [' = ', 'r'], ['c', 'i'], ['/', 'r'], ['x', 'i', XX]], 'directa: cociente'], [[['a', 'i'], ['b', 'i'], [' = ', 'r'], ['c', 'i'], ['x', 'i', XX]], 'inversa: producto'], [[['1 200 · 6/4 · 3/5', 'r']], 'compuesta: en cadena'], [[['30 · 12/18 · 3/2', 'r']], 'inversa: razón volteada']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [K1, XX, K2]);
    });
  },
};
