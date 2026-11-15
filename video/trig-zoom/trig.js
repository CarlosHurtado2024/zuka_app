// trig.js: piezas de dibujo de los videos zoom de Trigonometría (Mar de las Ondas, Faro de los Ángulos, Galaxia Polar).
// Necesita flat.js, zoomkit.js y valle.js. Todo es función pura de t. Ángulos en grados, antihorario positivo
// (en pantalla la y crece hacia abajo, así que el seno se resta).
const D2R = Math.PI / 180;
const pc = (cx, cy, R, deg) => [cx + R * Math.cos(deg * D2R), cy - R * Math.sin(deg * D2R)];
const SP = s => ({ sup: s }), SB = s => ({ sub: s }), FR = (n, d) => ({ fr: [n, d] }), RAD = (r, i) => ({ rad: r, idx: i });

// trazo por puntos [x, y] hasta la fracción k (sin punta)
function polyline(p, pts, k = 1, col = C.sun, sw = 6, o = {}) {
  if (k <= 0.01 || pts.length < 2) return;
  const n = pts.length - 1, m = n * clamp(k), i = Math.min(n - 1, Math.floor(m)), f = m - i;
  const tip = [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
  const d = 'M' + pts.slice(0, i + 1).map(q => `${r1(q[0])},${r1(q[1])}`).join('L') + `L${r1(tip[0])},${r1(tip[1])}`;
  el('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(o.dash ? { 'stroke-dasharray': o.dash } : {}) }, p);
}
// arco de a0 a a1 grados (puede pasar de una vuelta), hasta la fracción k; arrow = punta al final
function arcDeg(p, cx, cy, R, a0, a1, k = 1, col = C.sun, sw = 6, arrow = false) {
  if (k <= 0.01 || Math.abs(a1 - a0) < 0.2) return;
  const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 3)), pts = [];
  for (let j = 0; j <= n; j++) pts.push(pc(cx, cy, R, lerp(a0, a1, j / n)));
  if (arrow) arrowLine(p, pts, k, col, sw); else polyline(p, pts, k, col, sw);
}
// sector (porción) relleno de a0 a a1 grados, abierto hasta la fracción k
function sector(p, cx, cy, R, a0, a1, k = 1, col = C.sun) {
  if (k <= 0.01) return;
  const e = lerp(a0, a1, clamp(k)), n = Math.max(6, Math.ceil(Math.abs(e - a0) / 3));
  let d = `M${r1(cx)},${r1(cy)}`;
  for (let j = 0; j <= n; j++) { const q = pc(cx, cy, R, lerp(a0, e, j / n)); d += `L${r1(q[0])},${r1(q[1])}`; }
  el('path', { d: d + 'Z', fill: col }, p);
}
// rayo desde el centro con ángulo deg, de largo R, crecido hasta k
function ray(p, cx, cy, R, deg, k = 1, col = C.cream, sw = 7) {
  if (k <= 0.01) return;
  const q = pc(cx, cy, R * clamp(k), deg);
  capsule(p, cx, cy, q[0], q[1], sw, col);
}
// segmento de A a B crecido hasta k
const segAB = (p, A, B, k = 1, col = C.cream, sw = 7) => { if (k > 0.01) capsule(p, A[0], A[1], lerp(A[0], B[0], clamp(k)), lerp(A[1], B[1], clamp(k)), sw, col); };
// punto con anillo
function dot(p, x, y, k, col = C.sun, r = 14) {
  if (k <= 0.01) return;
  el('circle', { cx: r1(x), cy: r1(y), r: r1(r * 1.9 * k), fill: C.n3 }, p);
  el('circle', { cx: r1(x), cy: r1(y), r: r1(r * k), fill: col }, p);
}
// plano con circunferencia: ejes, círculo de radio R (trazado hasta k) y marcas en los ejes
function ucircle(p, t, t0, cx, cy, R, o = {}) {
  const ka = eio(seg(t, t0, t0 + .6)), kc = eio(seg(t, t0 + .3, t0 + 1.3)), ext = o.ext || 1.25;
  if (ka <= 0.01) return;
  const col = o.axis || C.n3;
  el('rect', { x: r1(cx - R * ext * ka), y: r1(cy - 2.5), width: r1(2 * R * ext * ka), height: 5, rx: 2.5, fill: col }, p);
  el('rect', { x: r1(cx - 2.5), y: r1(cy - R * ext * ka), width: 5, height: r1(2 * R * ext * ka), rx: 2.5, fill: col }, p);
  if (o.fill) el('circle', { cx, cy, r: R, fill: o.fill, opacity: kc }, p);
  if (kc > 0.01) el('circle', { cx, cy, r: R, pathLength: 1, fill: 'none', stroke: o.col || C.blue, 'stroke-width': o.sw || 7, 'stroke-dasharray': `${kc.toFixed(4)} 2`, transform: `rotate(0 ${cx} ${cy})` }, p);
  if (o.nums) [[1, 0, '1'], [0, 1, '1'], [-1, 0, '−1'], [0, -1, '−1']].forEach(([x, y, s], i) => {
    const kk = pop(t, t0 + 1.0 + i * .12); if (kk <= .01) return;
    tag(p, cx + x * R + (x ? 30 * x : 30), cy - y * R + (y ? -18 * y + (y < 0 ? 30 : 0) : 44), s, kk, C.mist, 34);
  });
  if (o.quads) [['I', 45], ['II', 135], ['III', 225], ['IV', 315]].forEach(([s, a], i) => {
    const kk = pop(t, o.quads + i * .25); if (kk <= .01) return;
    const q = pc(cx, cy, R * .62, a); tag(p, q[0], q[1] + 16, s, kk, C.mist, 46);
  });
}
// polígono relleno (crece desde su centro)
function poly(p, pts, k = 1, fill = C.n3, stroke = null, sw = 6) {
  if (k <= 0.01) return;
  const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
  const S = scaleAt(p, cx, cy, k);
  el('path', { d: 'M' + pts.map(q => `${r1(q[0])},${r1(q[1])}`).join('L') + 'Z', fill, ...(stroke ? { stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' } : {}) }, S);
}
// arco que marca el ángulo en el vértice V entre las direcciones a P1 y a P2 (el más corto)
function angMark(p, V, P1, P2, r, k = 1, col = C.sun, lab = null, size = 38, sw = 6) {
  if (k <= 0.01) return;
  let a1 = Math.atan2(-(P1[1] - V[1]), P1[0] - V[0]) / D2R, a2 = Math.atan2(-(P2[1] - V[1]), P2[0] - V[0]) / D2R;
  let d = a2 - a1; while (d > 180) d -= 360; while (d < -180) d += 360;
  arcDeg(p, V[0], V[1], r, a1, a1 + d, k, col, sw);
  if (lab) { const q = pc(V[0], V[1], r + size * .9, a1 + d / 2); const A = Array.isArray(lab) ? lab : [lab]; if (k > .5) formula(p, q[0], q[1] + size * .34, size, A, { fill: col }); }
}
// marca de ángulo recto en V (cuadrito)
function rightMark(p, V, P1, P2, s = 30, k = 1, col = C.mist) {
  if (k <= 0.01) return;
  const u = [P1[0] - V[0], P1[1] - V[1]], w = [P2[0] - V[0], P2[1] - V[1]], lu = Math.hypot(...u), lw = Math.hypot(...w);
  const a = [V[0] + u[0] / lu * s * k, V[1] + u[1] / lu * s * k], b = [V[0] + w[0] / lw * s * k, V[1] + w[1] / lw * s * k];
  polyline(p, [a, [a[0] + b[0] - V[0], a[1] + b[1] - V[1]], b], 1, col, 4);
}
// rótulo de un lado: en el punto medio, corrido hacia afuera (off > 0 a la izquierda de A→B)
function sideLab(p, A, B, lab, off, k = 1, col = C.cream, size = 40) {
  if (k <= 0.01) return;
  const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(...d) || 1, n = [d[1] / L, -d[0] / L];
  const x = m[0] + n[0] * off, y = m[1] + n[1] * off;
  const S = scaleAt(p, x, y, k);
  formula(S, x, y + size * .34, size, Array.isArray(lab) ? lab : [lab], { fill: col });
}
// triángulo con lados de colores: V = [A, B, Cc]; cols = colores de AB, BC, CA
function tri(p, V, k = 1, fill = C.n2, cols = [C.cream, C.cream, C.cream], sw = 7) {
  if (k <= 0.01) return;
  poly(p, V, k, fill);
  const kk = eio(clamp(k * 1.2 - .2));
  if (kk > 0.01) { segAB(p, V[0], V[1], kk, cols[0], sw); segAB(p, V[1], V[2], kk, cols[1], sw); segAB(p, V[2], V[0], kk, cols[2], sw); }
}
// onda y = f(x) sobre ejes M (de valle.js), con la línea media opcional
const wave = (p, M, f, a, b, k, col = C.sun, sw = 7, lo = -1e9, hi = 1e9) => curve(p, M, f, a, b, k, col, sw, lo, hi);
// línea punteada horizontal en y (valor) de x0 a x1 (valores)
function hline(p, M, y, x0, x1, k = 1, col = C.mist, sw = 4) {
  if (k <= 0.01) return;
  el('line', { x1: r1(mx(M, x0)), y1: r1(my(M, y)), x2: r1(lerp(mx(M, x0), mx(M, x1), clamp(k))), y2: r1(my(M, y)), stroke: col, 'stroke-width': sw, 'stroke-dasharray': '10 12', 'stroke-linecap': 'round' }, p);
}
function vline(p, M, x, y0, y1, k = 1, col = C.mist, sw = 4) {
  if (k <= 0.01) return;
  el('line', { x1: r1(mx(M, x)), y1: r1(my(M, y0)), x2: r1(mx(M, x)), y2: r1(lerp(my(M, y0), my(M, y1), clamp(k))), stroke: col, 'stroke-width': sw, 'stroke-dasharray': '10 12', 'stroke-linecap': 'round' }, p);
}
// marcas de π en el eje x de M: lista de [valor, texto]
function piTicks(p, t, t0, M, list, col = C.mist, size = 30) {
  list.forEach(([v, s], i) => {
    const k = pop(t, t0 + i * .1); if (k <= 0.01) return;
    el('rect', { x: r1(mx(M, v) - 2), y: r1(M.oy - 10 * k), width: 4, height: r1(20 * k), rx: 2, fill: col }, p);
    formula(p, mx(M, v), M.oy + 48, size * k, Array.isArray(s) ? s : [s], { fill: col });
  });
}
// una rueda con rayos que gira deg grados (para ruedas, norias y timones)
function wheel(p, cx, cy, R, deg, k = 1, col = SKY, spokes = 8) {
  if (k <= 0.01) return;
  const S = scaleAt(p, cx, cy, k);
  el('circle', { cx, cy, r: R, fill: 'none', stroke: col[1], 'stroke-width': 18 }, S);
  el('circle', { cx: cx - 3, cy: cy - 3, r: R, fill: 'none', stroke: col[0], 'stroke-width': 12 }, S);
  for (let j = 0; j < spokes; j++) { const q = pc(cx, cy, R - 6, deg + j * 360 / spokes); capsule(S, cx, cy, q[0], q[1], 6, col[1]); }
  shaded(S, 'circle', { cx, cy, r: R * .12 }, C.cream, C.creamD, 3, 3);
}
// un faro (torre a rayas con lámpara); x, y = base al centro; h = alto
function lighthouse(p, x, y, h, k = 1, lit = 0) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k), wb = h * .32, wt = h * .2, top = y - h;
  el('path', { d: `M${r1(x - wb / 2)},${r1(y)}L${r1(x - wt / 2)},${r1(top)}L${r1(x + wt / 2)},${r1(top)}L${r1(x + wb / 2)},${r1(y)}Z`, fill: C.cream }, S);
  for (let j = 1; j < 4; j += 2) {
    const y0 = y - h * j / 4, y1 = y - h * (j + 1) / 4, w0 = lerp(wb, wt, j / 4), w1 = lerp(wb, wt, (j + 1) / 4);
    el('path', { d: `M${r1(x - w0 / 2)},${r1(y0)}L${r1(x - w1 / 2)},${r1(y1)}L${r1(x + w1 / 2)},${r1(y1)}L${r1(x + w0 / 2)},${r1(y0)}Z`, fill: C.coral }, S);
  }
  el('rect', { x: r1(x - wt * .7), y: r1(top - h * .16), width: r1(wt * 1.4), height: r1(h * .16), rx: 8, fill: lit > 0 ? C.sun : C.mist }, S);
  el('path', { d: `M${r1(x - wt * .8)},${r1(top - h * .16)}L${r1(x)},${r1(top - h * .3)}L${r1(x + wt * .8)},${r1(top - h * .16)}Z`, fill: C.coral }, S);
  return [x, top - h * .08];
}
// un barquito (casco y vela); x, y = línea de agua
function boat(p, x, y, s, k = 1, col = NEG) {
  if (k <= 0.01) return;
  const S = scaleAt(p, x, y, k);
  shaded(S, 'path', { d: `M${r1(x - s)},${r1(y - s * .3)}L${r1(x + s)},${r1(y - s * .3)}L${r1(x + s * .7)},${r1(y + s * .2)}L${r1(x - s * .7)},${r1(y + s * .2)}Z` }, col[0], col[1], 4, 4);
  el('rect', { x: r1(x - 3), y: r1(y - s * 1.5), width: 6, height: r1(s * 1.2), fill: C.creamD }, S);
  el('path', { d: `M${r1(x + 4)},${r1(y - s * 1.45)}L${r1(x + s * .75)},${r1(y - s * .42)}L${r1(x + 4)},${r1(y - s * .42)}Z`, fill: C.cream }, S);
}
// mar: bandas de olas bajo y (pantalla), de x0 a x1
function sea(p, t, y, x0 = -200, x1 = W + 200, k = 1, amp = 10) {
  if (k <= 0.01) return;
  const yy = y + (1 - k) * 300;
  let d = `M${x0},${H + 600}L${x0},${r1(yy)}`;
  for (let x = x0; x <= x1; x += 20) d += `L${x},${r1(yy + amp * Math.sin(x / 60 + t * 1.6))}`;
  el('path', { d: d + `L${x1},${H + 600}Z`, fill: C.n3 }, p);
  for (let r = 1; r < 4; r++) {
    let e = ''; for (let x = x0; x <= x1; x += 20) e += (e ? 'L' : 'M') + `${x},${r1(yy + r * 60 + 6 * Math.sin(x / 45 - t * 1.3 + r))}`;
    el('path', { d: e, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: .7, 'stroke-linecap': 'round' }, p);
  }
}

// ---------- la plantilla común: tiempos de las tres zambullidas, guía y eventos ----------
function stdFilm(o) {
  const T = o.T || [29.2, 57.4, 92.6];
  return {
    DUR: 130, endAt: 114.2,
    DT: T.map(a => [a, a + 2.2]),
    dives: () => T.map((a, i) => ({ a, b: a + 2.2, P: (o.P && o.P[i]) || [480, 1440], r: (o.r && o.r[i]) || 130, A: [540, 700] })),
    open: o.open || { Z0: 2.2, C: [540, 980], t1: 3.8, t2: 6.0 },
    aim: T.map((a, i) => ({ fire: a - 4, lock: a - 3.4, name: o.aims[i], L: [330, 1560] })),
    stops: o.stops,
    guide: {
      blinks: o.blinks || [7.6, 13.4, 20.2, 27.0, 35.2, 41.6, 47.8, 62.4, 68.6, 74.8, 81.0, 86.4, 98.6, 104.8, 110.6, 122.0],
      smiles: o.smiles || [[119.0, 135]], wides: o.wides || [], looks: o.looks || [],
    },
  };
}
// el título del principio (dos renglones)
function titleCard(p, t, l1, l2, w = 860) {
  const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75)));
  if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(w * kp), height: 270, rx: 30, fill: C.night }, p);
  riseText(p, t, 0.35, 4.3, 150, 258, l1, { 'font-size': 92, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, l2, { 'font-size': 88, fill: C.sun, 'text-anchor': 'start' });
}
// sucesos: [t, tipo, extra] → eventos de sonido, más los del título y el resumen
function stdEvents(list, nSum = 5) {
  const ev = [{ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }];
  list.forEach(([t, type, x], j) => {
    const e = { t, type };
    if (type === 'pop' || type === 'tile' || type === 'count' || type === 'merge') e.i = x != null ? x : j % 4;
    if (['paint', 'slide', 'away', 'fly', 'lasso', 'hush', 'line'].includes(type)) e.d = x != null ? x : .6;
    ev.push(e);
  });
  ev.push({ t: 114.2, type: 'away', d: .6 }, { t: 114.8, type: 'rise' });
  for (let k = 0; k < nSum; k++) ev.push({ t: 115.4 + k * .55, type: 'stop', i: k % 4 });
  ev.push({ t: 118.0, type: 'end' });
  return ev;
}
// lo que se muestra de un nivel se encoge al final de la película (antes del resumen)
const endFade = (G, t, cy = 960) => { const k = 1 - eio(seg(t, 114.2, 114.8)); return k > 0.01 ? scaleAt(G, 540, cy, k) : null; };
