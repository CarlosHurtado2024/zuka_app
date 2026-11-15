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
// ficha con una fórmula adentro (tokens de formula); col = [relleno, sombra]
function fchip(p, x, y, toks, k, col = ZERO, size = 50, ink = C.night) {
  if (k <= 0.01) return;
  const { w } = fparts(toks, size), S = scaleAt(p, x, y, k), h = size * 1.7;
  shaded(S, 'rect', { x: r1(x - w / 2 - 26), y: r1(y - h / 2), width: r1(w + 52), height: r1(h), rx: r1(h / 2) }, col[0], col[1], 4, 4);
  formula(S, x, r1(y + size * .34), size, toks, { fill: ink });
}
// ---------- bloques algebraicos (Taller de los Bloques) ----------
// blk: un bloque con esquina (x, y), ancho w y alto h; lab = tokens de formula para el rótulo
function blk(p, x, y, w, h, k, col = SKY, lab = null, size = 40) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x + w / 2, y + h / 2, k);
  shaded(S, 'rect', { x: x + 2, y: y + 2, width: w - 4, height: h - 4, rx: Math.min(12, w / 4, h / 4) }, col[0], col[1], 4, 4);
  if (lab) formula(S, x + w / 2, y + h / 2 + size * .34, size, lab, { fill: C.night });
}
// cubo en perspectiva (x³): centro (x, y), lado s
function cube(p, x, y, s, k, col = SKY, lab = null) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), d = s * .42, x0 = x - (s + d) / 2, y0 = y - (s - d) / 2;
  el('path', { d: `M${x0},${y0}L${x0 + d},${y0 - d}L${x0 + s + d},${y0 - d}L${x0 + s},${y0}Z`, fill: col[0] }, S);
  el('path', { d: `M${x0 + s},${y0}L${x0 + s + d},${y0 - d}L${x0 + s + d},${y0 + s - d}L${x0 + s},${y0 + s}Z`, fill: col[1] }, S);
  el('rect', { x: x0, y: y0, width: s, height: s, rx: 6, fill: col[0], stroke: col[1], 'stroke-width': 4 }, S);
  if (lab) formula(S, x0 + s / 2, y0 + s / 2 + 20, 56, lab, { fill: C.night });
}
// ---------- ejes y curvas (Fuente de la Parábola) ----------
// M = { ox, oy, s }: el punto (0, 0) va en (ox, oy) y una unidad mide s píxeles
const mx = (M, v) => M.ox + v * M.s, my = (M, v) => M.oy - v * (M.sy || M.s);
function axes(p, t, t0, M, x0, x1, y0, y1, o = {}) {
  const k = eio(seg(t, t0, t0 + .6)); if (k <= 0.01) return;
  const col = o.col || C.mist;
  el('rect', { x: r1(mx(M, x0)), y: r1(M.oy - 2.5), width: r1((x1 - x0) * M.s * k), height: 5, rx: 2.5, fill: col }, p);
  el('rect', { x: r1(M.ox - 2.5), y: r1(my(M, y1)), width: 5, height: r1((my(M, y0) - my(M, y1)) * k), rx: 2.5, fill: col }, p);
  if (o.ticks !== false) for (let v = Math.ceil(x0); v <= x1; v++) if (v) {
    const kk = pop(t, t0 + .3 + Math.abs(v) * .03); if (kk <= 0.01) continue;
    el('rect', { x: r1(mx(M, v) - 2), y: r1(M.oy - 10 * kk), width: 4, height: r1(20 * kk), rx: 2, fill: col }, p);
    if (o.nums) text(p, r1(mx(M, v)), r1(M.oy + 42), minus(v), { 'font-size': r1(28 * kk), 'font-weight': 600, fill: col, 'text-anchor': 'middle' });
  }
  if (o.yl) text(p, r1(M.ox + 16), r1(my(M, y1) + 30), o.yl, { 'font-size': 34, 'font-weight': 600, fill: col });
  if (o.xl) text(p, r1(mx(M, x1) - 6), r1(M.oy - 18), o.xl, { 'font-size': 34, 'font-weight': 600, fill: col, 'text-anchor': 'end' });
}
// curva y = f(x) de a a b, dibujada hasta la fracción k; se recorta a [ylo, yhi]
function curve(p, M, f, a, b, k, col = C.sun, sw = 7, ylo = -1e9, yhi = 1e9) {
  if (k <= 0.01) return;
  const n = 90, end = a + (b - a) * clamp(k); let d = '', pen = false;
  for (let i = 0; i <= n; i++) {
    const x = a + (end - a) * i / n, y = f(x);
    if (y < ylo || y > yhi) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + r1(mx(M, x)) + ',' + r1(my(M, y)); pen = true;
  }
  if (d) el('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}
// ---------- cordillera (Cordillera Cúbica) ----------
// la montaña y = f(x) de a a b: roca sobre la vía (y > 0) y hondonada bajo ella, dibujada hasta la fracción k
function ridge(p, M, f, a, b, k, ylo = -1e9, yhi = 1e9) {
  if (k <= 0.01) return;
  const n = 120, end = a + (b - a) * clamp(k); let d = `M${r1(mx(M, a))},${r1(M.oy)}`;
  for (let i = 0; i <= n; i++) { const x = a + (end - a) * i / n; d += `L${r1(mx(M, x))},${r1(my(M, clamp(f(x), ylo, yhi)))}`; }
  d += `L${r1(mx(M, end))},${r1(M.oy)}Z`;
  el('path', { d, fill: C.blueD }, g(p, { 'clip-path': clipOf('rect', { x: -W, y: -H, width: 3 * W, height: r1(M.oy + H) }) }));
  el('path', { d, fill: C.n3 }, g(p, { 'clip-path': clipOf('rect', { x: -W, y: r1(M.oy), width: 3 * W, height: 2 * H }) }));
  curve(p, M, f, a, b, k, C.blue, 7, ylo, yhi);
}
// la vía del tren sobre y = 0, de x0 a x1 (valores), con traviesas
function rail(p, t, t0, M, x0, x1) {
  const k = eio(seg(t, t0, t0 + .7)); if (k <= 0.01) return;
  const a = mx(M, x0), b = lerp(a, mx(M, x1), k);
  for (let x = a + 14; x < b; x += 34) el('rect', { x: r1(x - 4), y: r1(M.oy - 12), width: 8, height: 24, rx: 3, fill: C.sunD }, p);
  el('rect', { x: r1(a), y: r1(M.oy - 4), width: r1(b - a), height: 8, rx: 4, fill: C.cream }, p);
}
// ---------- río y hueco (Río de las Asíntotas) ----------
// un río vertical en x (asíntota): banda azul con ondas, de y = y0 a y = y1 (valores), que baja desde arriba
function river(p, t, t0, M, x, y0, y1) {
  const k = eio(seg(t, t0, t0 + .8)); if (k <= 0.01) return;
  const cx = mx(M, x), top = my(M, y1), h = (my(M, y0) - top) * k;
  el('rect', { x: r1(cx - 20), y: r1(top), width: 40, height: r1(h), rx: 14, fill: C.blueD, opacity: .55 }, p);
  let d = ''; for (let j = 0; j <= 40; j++) { const yy = top + h * j / 40; d += (j ? 'L' : 'M') + r1(cx + 7 * Math.sin(yy / 22 - t * 2.4)) + ',' + r1(yy); }
  el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, p);
}
// un hueco: punto que falta en una curva
function hole(p, x, y, k, col = C.sun) {
  if (k <= 0.01) return;
  el('circle', { cx: r1(x), cy: r1(y), r: r1(15 * k), fill: C.night, stroke: col, 'stroke-width': 5 }, p);
}
// ---------- laguna y lirios (Selva Exponencial) ----------
// un lirio: hoja redonda con una muesca
function pad(p, x, y, r, k, col = MINT) {
  if (k <= 0.01) return;
  const R = r * k, a = 0.35;
  el('path', { d: `M${r1(x)},${r1(y)}L${r1(x + R * Math.cos(-a))},${r1(y + R * Math.sin(-a))}A${r1(R)},${r1(R)} 0 1,0 ${r1(x + R * Math.cos(a))},${r1(y + R * Math.sin(a))}Z`, fill: col[0], stroke: col[1], 'stroke-width': 3 }, p);
}
// la laguna (elipse) cubierta de lirios hasta la fracción f, de izquierda a derecha
function lagoon(p, cx, cy, rx, ry, k, f = 0) {
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k);
  el('ellipse', { cx, cy, rx, ry, fill: C.blueD }, S);
  if (f > 0.001) {
    const G = g(S, { 'clip-path': clipOf('ellipse', { cx, cy, rx: rx - 6, ry: ry - 6 }) });
    el('rect', { x: cx - rx, y: cy - ry, width: r1(2 * rx * clamp(f)), height: 2 * ry, fill: C.mint }, G);
    for (let i = 0; i < 40; i++) { const x = cx - rx + ((i * 97) % 100) / 100 * 2 * rx, y = cy - ry + ((i * 61) % 100) / 100 * 2 * ry; if (x < cx - rx + 2 * rx * f) pad(G, x, y, 34, 1, [C.mint, C.mintD]); }
  }
  el('ellipse', { cx, cy, rx, ry, fill: 'none', stroke: C.mint, 'stroke-width': 6 }, S);
}
