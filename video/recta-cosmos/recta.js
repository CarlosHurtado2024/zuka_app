// Piezas comunes de los videos del mundo «La Recta Real» (van después de kit.js): colores de cada familia de números,
// flechas, la recta numérica, fracciones apiladas, el resumen y la tarjeta final.
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
    fade(A(t, t0 + 2.8, .8), () => T('ZUKA · ÁLGEBRA · LA RECTA REAL', CX, 1300, { k: 'mono', s: 22, a: 'c', c: C.mute, ls: 4 }));
  });
}
// Óvalo de una familia de números con su letra de doble trazo.
function family(cx, cy, rx, ry, letter, col, k = 1, o = {}) {
  if (k <= 0) return;
  fade(o.fill ?? .08, () => { X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, 7); X.fillStyle = col; X.fill(); X.restore(); });
  stroke(col, 3, () => X.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k));
  if (letter) fade(k, () => T(letter, o.lx ?? cx + rx * .62, o.ly ?? cy - ry * .72, { k: 'r', s: o.ls || 64, a: 'c', c: col, g: 16 }));
}
