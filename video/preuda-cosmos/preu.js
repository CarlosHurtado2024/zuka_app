// Piezas comunes de los videos del Preuniversitario UdeA (copia de video/expo-cosmos/expo.js) (van después de kit.js): flechas, recta numérica,
// fracciones apiladas, barras, cuadrícula de 100, el resumen y la tarjeta final (con el mundo de D.WORLD).
const FAM = { N: C.amber, Z: C.cyan, Q: C.green, I: C.mag, R: C.violet };
const neg = v => (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', '.');
function arrow(x1, y1, x2, y2, col, k = 1, lw = 3, o = {}) {
  if (k <= 0) return; const x = lerp(x1, x2, k), y = lerp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1), h = o.h || 16;
  stroke(col, lw, () => { X.moveTo(x1, y1); X.lineTo(x, y); }, o);
  if (k > .9) stroke(col, lw, () => { X.moveTo(x - h * Math.cos(a - .45), y - h * Math.sin(a - .45)); X.lineTo(x, y); X.lineTo(x - h * Math.cos(a + .45), y - h * Math.sin(a + .45)); }, o);
}
// Arco que salta de x1 a x2 sobre la recta (alto h): se dibuja hasta k.
function hop(x1, x2, y, h, col, k = 1, lw = 3) {
  if (k <= 0) return; const n = 40, m = Math.ceil(n * k);
  stroke(col, lw, () => { for (let i = 0; i <= m; i++) { const u = i / n, x = lerp(x1, x2, u), yy = y - h * 4 * u * (1 - u); i ? X.lineTo(x, yy) : X.moveTo(x, yy); } });
  if (k >= 1) { const a = Math.atan2(h * 4 * (1 - 2) / n * -1, (x2 - x1) / n); arrow(x2 - (x2 - x1) * .02, y - h * .08, x2, y, col, 1, lw, { h: 12 }); }
}
// Recta numérica de x0 a x1 a la altura y, con valores de lo a hi. o: k (cuánto se ha trazado), step (cada cuántas
// unidades una marca), lab (qué marcas llevan número: función v → bool), col, s (tamaño de los números), dy.
// Devuelve px(v): la posición en pantalla del valor v.
function nline(x0, x1, y, lo, hi, o = {}) {
  const px = v => x0 + (v - lo) / (hi - lo) * (x1 - x0), k = o.k ?? 1, end = lerp(x0, x1, k), step = o.step || 1, col = o.col || 'rgba(225,232,255,.9)';
  stroke(col, 3, () => { X.moveTo(x0, y); X.lineTo(end, y); }, { g: 6 });
  if (k > .97) stroke(col, 3, () => { X.moveTo(x1 - 14, y - 9); X.lineTo(x1 + 2, y); X.lineTo(x1 - 14, y + 9); }, { g: 6 });
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) {
    const x = px(v); if (x > end + .5 || x > x1 - 18) continue;
    const big = Math.abs(v - Math.round(v)) < 1e-9;
    stroke(col, big ? 2.5 : 1.5, () => { X.moveTo(x, y - (big ? 12 : 7)); X.lineTo(x, y + (big ? 12 : 7)); }, { g: 0 });
    if (!o.lab || o.lab(v)) T(neg(+v.toFixed(3)), x, y + (o.dy ?? 52), { k: 'r', s: o.s || 32, a: 'c', c: v === 0 ? C.ink : '#b9c3e6' });
  }
  return px;
}
// Fracción apilada centrada en x; y es la línea de la raya. Devuelve su ancho.
function FR(n, d, x, y, s, col = C.ink, o = {}) {
  X.font = font(o.k || 'r', s); const w = Math.max(X.measureText(String(n)).width, X.measureText(String(d)).width) + s * .2;
  T(String(n), x, y - s * .2, { k: o.k || 'r', s, a: 'c', c: col, g: o.g });
  T(String(d), x, y + s * .82, { k: o.k || 'r', s, a: 'c', c: col, g: o.g });
  stroke(col, Math.max(2, s * .06), () => { X.moveTo(x - w / 2, y); X.lineTo(x + w / 2, y); }, { g: o.g ?? 8 });
  return w;
}
// Resumen: filas [partes de fórmula, rótulo] en dos columnas que aparecen una a una desde t0.
function summary(t, t0, rows, y0 = 400, gap = 160, size = 56) {
  rows.forEach(([p, lab], i) => fade(A(t, t0 + i * 1.1, .5), () => {
    const x = rows.length % 2 && i === rows.length - 1 ? CX : 300 + (i % 2) * 480, y = y0 + Math.floor(i / 2) * gap;
    F(p, x, y, size, { max: 440 }); T(lab, x, y + 48, { k: 'mono', s: 21, c: C.mute, a: 'c' });
  }));
}
// Tarjeta final: título, una raya de colores, la frase y la marca.
function endCard(t, t0, title, line, cols = [C.cyan, C.violet, C.mag]) {
  fade(A(t, t0, 1.2), () => {
    T(title, CX, 1060, { k: 'brand', s: 84, a: 'c', ls: 14, c: C.ink, g: 24, max: 960 });
    const w = 44 * eo(seg(t, t0 + .4, t0 + 1.6));
    cols.forEach((c, i) => { X.fillStyle = c; X.shadowColor = c; X.shadowBlur = 14; X.fillRect(CX - cols.length * 22 + i * 44, 1102, w, 3); X.shadowBlur = 0; });
    fade(A(t, t0 + 1.4, .8), () => T(line, CX, 1190, { k: 'it', s: 46, a: 'c', c: C.ink, max: 960 }));
    fade(A(t, t0 + 2.8, .8), () => T('ZUKA · PREUNIVERSITARIO UdeA', CX, 1300, { k: 'mono', s: 22, a: 'c', c: C.mute, ls: 4 }));
  });
}
// Óvalo de una familia de números con su letra de doble trazo.
function family(cx, cy, rx, ry, letter, col, k = 1, o = {}) {
  if (k <= 0) return;
  fade(o.fill ?? .08, () => { X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, 7); X.fillStyle = col; X.fill(); X.restore(); });
  stroke(col, 3, () => X.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k));
  if (letter) fade(k, () => T(letter, o.lx ?? cx + rx * .62, o.ly ?? cy - ry * .72, { k: 'r', s: o.ls || 64, a: 'c', c: col, g: 16 }));
}
// Barra horizontal (x, y arriba a la izquierda) de largo w·k con relleno suave y borde que brilla.
function bar(x, y, w, h, col, k = 1, o = {}) {
  if (k <= 0) return; const ww = w * clamp(k, 0, 9);
  X.save(); X.fillStyle = hexA(col, o.fill ?? .22); X.fillRect(x, y, ww, h); X.restore();
  stroke(col, o.lw || 2.5, () => X.rect(x, y, ww, h), { g: o.g ?? 12 });
}
// Cuadrícula de 10 × 10 centrada en (cx, cy): cuenta [[n, color], …] pinta casillas en orden; k (0–1) cuántas van pintadas.
function grid100(cx, cy, cell, counts, k = 1) {
  const x0 = cx - cell * 5, y0 = cy - cell * 5, tot = counts.reduce((a, b) => a + b[0], 0), lit = Math.round(tot * clamp(k));
  let idx = 0, ci = 0, left = counts.length ? counts[0][0] : 0;
  for (let i = 0; i < 100; i++) {
    while (ci < counts.length && left <= 0) { ci++; left = ci < counts.length ? counts[ci][0] : 0; }
    const r = Math.floor(i / 10), c = i % 10, x = x0 + c * cell + 3, y = y0 + r * cell + 3, s = cell - 6;
    if (ci < counts.length && idx < lit) { const col = counts[ci][1]; X.save(); X.fillStyle = hexA(col, .55); X.shadowColor = col; X.shadowBlur = 8; X.fillRect(x, y, s, s); X.restore(); left--; idx++; }
    else { X.save(); X.strokeStyle = 'rgba(160,180,240,.28)'; X.lineWidth = 1.5; X.strokeRect(x, y, s, s); X.restore(); }
  }
}
// Caja con borde redondeado y texto centrado (fichas, etiquetas de precio).
function chip(cx, cy, w, h, col, label, o = {}) {
  stroke(col, o.lw || 2.5, () => X.roundRect(cx - w / 2, cy - h / 2, w, h, o.r ?? 14), { g: o.g ?? 12 });
  if (label !== undefined) T(String(label), cx, cy + (o.s || 36) * .35, { k: o.k || 'r', s: o.s || 36, a: 'c', c: o.c || C.ink, max: w - 16 });
}
// Contador de dinero o cantidad con separador de miles (12 000).
const pesos = v => num(Math.round(v));
// Ejes de una gráfica: origen (x0, y0), ancho w, alto h, con rótulos.
function axes(x0, y0, w, h, lx, ly, k = 1) {
  stroke('rgba(225,232,255,.8)', 2.5, () => { X.moveTo(x0, y0); X.lineTo(x0 + w * k, y0); X.moveTo(x0, y0); X.lineTo(x0, y0 - h * k); }, { g: 4 });
  if (k > .95) { T(lx, x0 + w, y0 + 44, { k: 'it', s: 32, a: 'r', c: '#b9c3e6' }); T(ly, x0 - 16, y0 - h + 10, { k: 'it', s: 32, a: 'r', c: '#b9c3e6' }); }
}
function curve(fn, x0, x1, col, k = 1, lw = 3.5) { const n = 120, m = Math.ceil(n * clamp(k)); if (m < 1) return; stroke(col, lw, () => { for (let i = 0; i <= m; i++) { const [x, y] = fn(lerp(x0, x1, i / n)); i ? X.lineTo(x, y) : X.moveTo(x, y); } }, { g: 14 }); }
// Radical √ dibujado a mano sobre el texto inner (en letra 'r'), con su raya encima; o.idx índice pequeño, o.a 'c' centra.
function rad(x, y, s, inner, col = C.ink, o = {}) {
  X.font = font(o.k || 'r', s); const w = X.measureText(inner).width, tw = w + s * .78, x0 = o.a === 'c' ? x - tw / 2 : x;
  stroke(col, Math.max(2, s * .05), () => { X.moveTo(x0, y - s * .32); X.lineTo(x0 + s * .14, y - s * .4); X.lineTo(x0 + s * .3, y + s * .08); X.lineTo(x0 + s * .52, y - s * .86); X.lineTo(x0 + tw, y - s * .86); }, { g: o.g ?? 10 });
  T(inner, x0 + s * .62, y, { k: o.k || 'r', s, c: o.ic || col, g: o.g ?? 0 });
  if (o.idx) T(String(o.idx), x0 + s * .12, y - s * .52, { k: 'r', s: s * .42, c: col });
  return tw;
}
// Potencia con exponente arriba: base en tamaño s y exponente pequeño. Devuelve el ancho.
function pw(base, ex, x, y, s, col = C.ink, ecol, o = {}) {
  X.font = font(o.k || 'r', s); const wb = X.measureText(base).width; X.font = font('r', s * .58); const we = X.measureText(String(ex)).width;
  const x0 = o.a === 'c' ? x - (wb + we + 4) / 2 : x;
  T(base, x0, y, { k: o.k || 'r', s, c: col, g: o.g }); T(String(ex), x0 + wb + 4, y - s * .45, { k: 'r', s: s * .58, c: ecol || col, g: o.g });
  return wb + we + 4;
}
// Modelo de área de (a1 x + a0)(b1 x + b0): rectángulo partido en cuatro, con etiquetas; x vale ux px.
function area(x0, y0, ux, a, b, k = 1) {
  const wa = [a[0] * ux, a[1] * 40], hb = [b[0] * ux, b[1] * 40], lab = [[a[0] + 'x', a[1]], [b[0] + 'x', b[1]]].map(p => p.map(s => String(s).replace(/^1x$/, 'x')));
  const cells = [[0, 0, C.amber, (a[0] * b[0]) + 'x²'], [1, 0, C.cyan, (a[1] * b[0]) + 'x'], [0, 1, C.cyan, (a[0] * b[1]) + 'x'], [1, 1, C.green, String(a[1] * b[1])]];
  cells.forEach(([i, j, col, s], n) => fade(clamp(k * 4 - n), () => { const x = x0 + (i ? wa[0] : 0), y = y0 + (j ? hb[0] : 0); bar(x, y, wa[i], hb[j], col, 1, { fill: .22 }); T(s.replace(/^1x/, 'x'), x + wa[i] / 2, y + hb[j] / 2 + 14, { k: 'r', s: 38, a: 'c', c: C.ink }); }));
  T(lab[0][0], x0 + wa[0] / 2, y0 - 18, { k: 'r', s: 34, a: 'c', c: C.cyan }); T(String(lab[0][1]), x0 + wa[0] + wa[1] / 2, y0 - 18, { k: 'r', s: 34, a: 'c', c: C.green });
  T(lab[1][0], x0 - 18, y0 + hb[0] / 2 + 12, { k: 'r', s: 34, a: 'r', c: C.cyan }); T(String(lab[1][1]), x0 - 18, y0 + hb[0] + hb[1] / 2 + 12, { k: 'r', s: 34, a: 'r', c: C.green });
}

// ---------- piezas del mundo 1 (fracciones, porcentajes, potencias) y de las preguntas reales del examen ----------
// Tarjeta de un problema: etiqueta (o.tag, «PROBLEMA» si no se da; nunca el examen ni el año), enunciado en renglones (texto o
// partes de F) y las opciones A–D en dos filas. o: year, lines, opts, ok (índice correcto), t0, rv (cuándo se revela la
// correcta), y (borde de arriba), lh (alto de renglón), s (tamaño del enunciado), out ({ índice: segundo en que se tacha }).
function examCard(t, o) {
  const y0 = o.y ?? 290, t0 = o.t0 ?? .6, lh = o.lh || 54, s = o.s || 38, n = o.lines.length;
  const hOpt = o.opts ? 2 * 104 + 20 : 0, h = 96 + n * lh + hOpt;
  fade(A(t, t0, .6), () => {
    X.save(); X.fillStyle = 'rgba(14,20,46,.55)'; X.beginPath(); X.roundRect(70, y0, 940, h, 30); X.fill(); X.restore();
    stroke(hexA(C.lime, .75), 2.5, () => X.roundRect(70, y0, 940, h, 30), { g: 10 });
    const tw = T(o.tag || 'PROBLEMA', 120, y0 + 52, { k: 'mono', s: 22, ls: 2, c: C.lime });
    stroke(hexA(C.lime, .5), 1.5, () => X.roundRect(100, y0 + 22, tw + 40, 44, 22), { g: 0 });
    o.lines.forEach((ln, i) => fade(A(t, t0 + .35 + i * .3, .5), () => {
      const y = y0 + 118 + i * lh;
      if (Array.isArray(ln)) F(ln, 120, y, s, { a: 'l', max: 840 }); else T(ln, 120, y, { k: 'j', s, c: '#dfe5fb', max: 840 });
    }));
    if (o.opts) o.opts.forEach((op, i) => {
      const x = 310 + (i % 2) * 460, y = y0 + 96 + n * lh + 60 + Math.floor(i / 2) * 104, rv = A(t, o.rv ?? 1e9, .6);
      const good = i === o.ok, gone = !!o.out && o.out[i] != null && t > o.out[i];
      const col = rv > 0 && good ? C.green : gone || (rv > 0 && !good) ? C.dim : hexA(C.violet, .9);
      fade(A(t, t0 + .8 + n * .3 + i * .15, .4), () => {
        stroke(col, good && rv > 0 ? 4 : 2.5, () => X.roundRect(x - 200, y - 42, 400, 84, 20), { g: good && rv > 0 ? 22 : 6 });
        T('ABCD'[i], x - 170, y + 10, { k: 'mono', s: 28, c: good && rv > 0 ? C.green : C.mute });
        if (Array.isArray(op)) F(op, x + 10, y + 14, 42, { max: 300, c: gone ? C.dim : C.ink }); else T(String(op), x + 10, y + 14, { k: 'r', s: o.os || 42, a: 'c', c: gone ? C.dim : C.ink, max: 300 });
        if (gone) stroke(C.red, 3, () => { X.moveTo(x - 120, y); X.lineTo(x + 160, y); }, { g: 8 });
        if (good) check(x + 160, y, 16, true, rv);
      });
    });
  });
  return y0 + h;
}
// «Lo que dice» → «lo que significa»: leer el enunciado y decirlo con otras palabras (la lectura del examen).
function readNote(t, t0, y, said, means, col = C.lime) {
  fade(A(t, t0, .5), () => {
    T('LO QUE DICE', 120, y, { k: 'mono', s: 20, ls: 3, c: C.mute });
    T(said, 120, y + 50, { k: 'j', s: 42, c: C.ink, max: 840 });
  });
  fade(A(t, t0 + 1.2, .5), () => {
    arrow(140, y + 74, 140, y + 128, col, 1, 3, { h: 12 });
    T('LO QUE SIGNIFICA', 180, y + 112, { k: 'mono', s: 20, ls: 3, c: col });
    T(means, 120, y + 170, { k: 'r', s: 44, c: col, g: 10, max: 840 });
  });
}
// Barra partida en den trozos iguales (x, y arriba a la izquierda): los primeros num van llenos. o.k (0–1) dibuja los
// cortes; o.fill (0–1) llena los trozos; o.from llena desde ese trozo; o.lab rótulo encima.
function fbar(x, y, w, h, den, num, col, o = {}) {
  const k = o.k ?? 1, f = o.fill ?? 1, from = o.from || 0, pw = w / den;
  for (let i = 0; i < den; i++) {
    const on = i >= from && i < from + num, kk = clamp(f * num - (i - from));
    if (on && kk > 0) { X.save(); X.fillStyle = hexA(o.cols ? o.cols[i] : col, .45 * kk); X.shadowColor = col; X.shadowBlur = 10 * kk; X.fillRect(x + i * pw + 2, y + 2, pw - 4, h - 4); X.restore(); }
  }
  stroke(o.line || 'rgba(225,232,255,.85)', 2.5, () => X.rect(x, y, w, h), { g: 6 });
  for (let i = 1; i < den; i++) { const kk = clamp(k * den - i + 1); if (kk > 0) stroke('rgba(225,232,255,.6)', 1.5, () => { X.moveTo(x + i * pw, y); X.lineTo(x + i * pw, y + h * kk); }, { g: 0 }); }
}
// Torta vista desde arriba (centro, radio) cortada en den porciones; take porciones encendidas (desde arriba, en el
// sentido del reloj). o.eaten: porciones que ya no están (solo el borde punteado; o.ghost las pinta de otro color con
// fuerza o.ghostK). o.k dibuja el borde.
function cake(cx, cy, r, den, take, col, o = {}) {
  const k = o.k ?? 1, a0 = -Math.PI / 2, da = Math.PI * 2 / Math.max(1, den), eaten = o.eaten || 0;
  for (let i = 0; i < den; i++) {
    const a = a0 + i * da, gone = i >= den - eaten, on = !gone && i < take;
    X.save(); X.beginPath(); X.moveTo(cx, cy); X.arc(cx, cy, r, a, a + da); X.closePath();
    if (on) { X.fillStyle = hexA(col, o.alpha ?? .42); X.shadowColor = col; X.shadowBlur = 14; X.fill(); }
    X.restore();
    if (gone && o.ghost) { X.save(); X.beginPath(); X.moveTo(cx, cy); X.arc(cx, cy, r, a, a + da); X.closePath(); X.fillStyle = hexA(o.ghost, .4 * (o.ghostK ?? 1)); X.shadowColor = o.ghost; X.shadowBlur = 14; X.fill(); X.restore(); }
    if (gone) stroke(hexA(C.mute, .6), 2, () => { X.moveTo(cx, cy); X.arc(cx, cy, r, a, a + da); X.closePath(); }, { g: 0, dash: [8, 8] });
  }
  if (den > 1) for (let i = 0; i < den; i++) { const a = a0 + i * da; stroke('rgba(225,232,255,.7)', 2, () => { X.moveTo(cx, cy); X.lineTo(cx + r * Math.cos(a) * k, cy + r * Math.sin(a) * k); }, { g: 0 }); }
  stroke(o.ring || 'rgba(225,232,255,.9)', 3, () => X.arc(cx, cy, r, a0, a0 + Math.PI * 2 * (1 - eaten / Math.max(1, den)) * k), { g: 10 });
}
// n puntos en filas de cols (centrados en cx, desde y0): colFn(i) da el color de cada uno (o null = apagado).
function dots(cx, y0, n, cols, gap, colFn, r = 12, kk = 1) {
  const rows = Math.ceil(n / cols), x0 = cx - (cols - 1) * gap / 2;
  for (let i = 0; i < Math.ceil(n * clamp(kk)); i++) {
    const c = colFn(i), x = x0 + (i % cols) * gap, y = y0 + Math.floor(i / cols) * gap;
    if (c) dot(x, y, r, c, 14); else { X.save(); X.strokeStyle = 'rgba(160,180,240,.45)'; X.lineWidth = 2; X.beginPath(); X.arc(x, y, r, 0, 7); X.stroke(); X.restore(); }
  }
  return { x: i => x0 + (i % cols) * gap, y: i => y0 + Math.floor(i / cols) * gap, rows };
}
// Fila de pasos con flechas: [[partes de F, rótulo], …] de arriba abajo desde y0; aparecen desde t0 cada dt segundos.
function stepsDown(t, t0, dt, rows, y0 = 440, gap = 150, size = 64) {
  rows.forEach(([p, lab], i) => fade(A(t, t0 + i * dt, .5), () => {
    const y = y0 + i * gap; F(p, CX, y, size, { max: 900 });
    if (lab) T(lab, CX, y + 46, { k: 'mono', s: 22, a: 'c', c: C.mute, max: 900 });
    if (i) arrow(CX, y - gap + 62, CX, y - size * .9, hexA(C.lime, .7), 1, 2.5, { h: 10, g: 4 });
  }));
}
