// valle.js: piezas de dibujo comunes a las películas zoom del Valle de los Números (lecciones alg-11b … alg-12d).
// Necesita flat.js y zoomkit.js. Todo es función pura de t, como el motor.
const NEG = [C.coral, C.coralD], ZERO = [C.sun, C.sunD], POS = [C.cream, C.creamD], MINT = [C.mint, C.mintD], SKY = [C.blue, C.blueD];
const tcol = v => v < 0 ? NEG : v === 0 ? ZERO : POS;
const minus = v => String(v).replace('-', '−');
function arrowLine(p, pts, k, col = C.sun, sw = 7) {
  if (k <= 0.01) return;
  const n = pts.length - 1, m = n * clamp(k), i = Math.min(n - 1, Math.floor(m)), f = m - i;
  const tip = [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
  const d = 'M' + pts.slice(0, i + 1).map(q => `${r1(q[0])},${r1(q[1])}`).join('L') + `L${r1(tip[0])},${r1(tip[1])}`;
  el('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  const a = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]), L = 26;
  el('path', { d: `M${r1(tip[0] - L * Math.cos(a - .5))},${r1(tip[1] - L * Math.sin(a - .5))}L${r1(tip[0])},${r1(tip[1])}L${r1(tip[0] - L * Math.cos(a + .5))},${r1(tip[1] - L * Math.sin(a + .5))}`, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}
// arco de salto sobre una recta (de x0 a x1, altura h), con punta
function hop(p, x0, x1, y, h, k, col = C.sun, sw = 6) {
  if (k <= 0.01) return;
  const pts = []; for (let j = 0; j <= 20; j++) { const q = j / 20; pts.push([lerp(x0, x1, q), y - h * Math.sin(Math.PI * q)]); }
  arrowLine(p, pts, k, col, sw);
}
const dots = (p, x, y, k, col = C.mist) => { if (k > 0.01) text(p, x, y + 20, '…', { 'font-size': r1(70 * k), 'font-weight': 700, fill: col, 'text-anchor': 'middle' }); };
// recta numérica: X(v) da la x de cada valor; marcas enteras de a a b con números
function numLine(p, t, t0, X, y, a, b, o = {}) {
  const kx = eio(seg(t, t0, t0 + .7)); if (kx <= 0.01) return;
  const xa = X(a) - 50, xb = X(b) + 50, xm = (xa + xb) / 2;
  el('rect', { x: r1(lerp(xm, xa, kx)), y: y - 3, width: r1((xb - xa) * kx), height: 6, rx: 3, fill: o.col || C.mist }, p);
  const step = o.step || 1;
  for (let v = a; v <= b + 1e-9; v += step) {
    const k = pop(t, t0 + .2 + Math.abs(v - (a + b) / 2) * .04 / step); if (k <= 0.01) continue;
    const z = Math.abs(v) < 1e-9, c = z && !o.plain ? C.sun : (o.col || C.mist);
    el('rect', { x: r1(X(v) - 3), y: r1(y - 16 * k), width: 6, height: r1(32 * k), rx: 3, fill: c }, p);
    if (o.labels !== false) text(p, r1(X(v)), y + 58, minus(+v.toFixed(2)), { 'font-size': r1((o.size || 38) * k), 'font-weight': 600, fill: c, 'text-anchor': 'middle' });
  }
}
// punto con etiqueta sobre una recta
function mark(p, x, y, s, k, col = C.cream, up = true, size = 52) {
  if (k <= 0.01) return;
  el('circle', { cx: r1(x), cy: y, r: r1(16 * k), fill: col }, p);
  if (s) text(p, r1(x), r1(up ? y - 40 : y + 112), s, { 'font-size': r1(size * k), 'font-weight': 700, fill: col, 'text-anchor': 'middle' });
}
// ficha con una fracción adentro
function fracTile(p, x, y, s, n, d, k, col = POS, ink = C.night) {
  if (k <= 0.01) return;
  const S = s * k;
  shaded(p, 'rect', { x: r1(x - S * .5), y: r1(y - S * .62), width: r1(S), height: r1(S * 1.24), rx: r1(S * .2) }, col[0], col[1], r1(S * .06), r1(S * .06));
  fracAt(p, x, y, S * .42, n, d, ink);
}
// barra partida en n partes con las primeras m pintadas (k = cuánto se ha pintado)
function partBar(p, x, y, w, h, n, m, kIn, kPaint, col = C.sun, empty = C.n3) {
  if (kIn <= 0.01) return;
  const S = scaleAt(p, x + w / 2, y + h / 2, kIn);
  el('rect', { x, y, width: w, height: h, rx: 14, fill: empty }, S);
  const pw = w / n, fill = m * pw * clamp(kPaint);
  if (fill > 0.5) el('rect', { x, y, width: r1(fill), height: h, rx: 14, fill: col }, S);
  for (let i = 1; i < n; i++) el('rect', { x: r1(x + i * pw - 3), y, width: 6, height: h, fill: C.night }, S);
}
// un pan visto de lado (pieza del reparto)
function bread(p, x, y, w, k, cuts = 0, kc = 0) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), h = w * .46;
  shaded(S, 'rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: h * .48 }, C.sun, C.sunD, 6, 6);
  for (let i = -1; i <= 1; i++) el('path', { d: `M${r1(x + i * w * .24 - 14)},${r1(y - h * .28)}Q${r1(x + i * w * .24)},${r1(y - h * .1)} ${r1(x + i * w * .24 + 16)},${r1(y - h * .26)}`, fill: 'none', stroke: C.sunD, 'stroke-width': 7, 'stroke-linecap': 'round' }, S);
  for (let i = 1; i < cuts; i++) {
    const kk = clamp(kc * cuts - (i - 1)); if (kk <= 0) continue;
    const xx = x - w / 2 + w * i / cuts;
    el('rect', { x: r1(xx - 4), y: r1(y - h * .62), width: 8, height: r1(h * 1.24 * kk), rx: 4, fill: C.night }, S);
  }
}
// una persona sencilla (círculo + cuerpo)
function buddy(p, x, y, s, k, col = C.blue, colD = C.blueD) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'path', { d: `M${x - s * .55},${y + s * .9}Q${x - s * .55},${y + s * .1} ${x},${y + s * .1}Q${x + s * .55},${y + s * .1} ${x + s * .55},${y + s * .9}Z` }, col, colD, 5, 5);
  shaded(S, 'circle', { cx: x, cy: y - s * .32, r: s * .34 }, C.cream, C.creamD, 4, 4);
  el('circle', { cx: r1(x - s * .11), cy: r1(y - s * .34), r: r1(s * .045), fill: C.night }, S);
  el('circle', { cx: r1(x + s * .11), cy: r1(y - s * .34), r: r1(s * .045), fill: C.night }, S);
}
// rótulo pequeño centrado
const tag = (p, x, y, s, k, col = C.mist, size = 40, a = 'middle') => { if (k > 0.01) text(p, r1(x), r1(y), s, { 'font-size': r1(size * Math.min(1, k)), 'font-weight': 600, fill: col, 'text-anchor': a }); };
// tarjeta con fondo noche para una fórmula que se superpone a un dibujo
function plate(p, x, y, w, h, k, fill = C.night) {
  if (k <= 0.01) return;
  el('rect', { x: r1(x - w * k / 2), y: r1(y - h / 2), width: r1(w * k), height: h, rx: 24, fill }, p);
}
