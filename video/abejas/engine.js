// Motor del estilo «Tablet Sketch Explainer» de Lemo-Opuscar (github.com/lemomo-ai/lemo-opuscar, MIT), tomado de
// styles/ipad-sketch/demo/index.html y adaptado a una página vertical: lienzo, grano del papel, lápiz (PEN),
// bloques de color (BLOB), oclusión (OCC), letra trazo a trazo (TXT), cámara de dos dedos, lápiz óptico y composición.
const W = 1080, H = 1920, FPS = 24, FULL = 75.5;
const QS = new URLSearchParams(location.search);
const FROM = +(QS.get('from') ?? 0), TO = +(QS.get('to') ?? FULL), CLEAN = QS.get('clean') === '1';
const cv = document.getElementById('c'), ctx = cv.getContext('2d');

// ---------- canvas domain (world units) and buffer resolution ----------
const X0 = -100, Y0 = -100, DW = 1400, DH = 5520, S = 1.3;
const BW = Math.round(DW * S), BH = Math.round(DH * S);
const PX = x => (x - X0) * S, PY = y => (y - Y0) * S;

// ---------- palette ----------
const C = {
  paper: '#f3eadb', graphite: '#43362e', light: '#a8998a', coral: '#dc6a4c', mustard: '#f1c04f',
  red: '#d9463c', orange: '#ec8d3e', unripe: '#c3c75e', leaf: '#8fb47c', leafDk: '#5f8f5a', stem: '#a9875f',
  pulp: '#f3d9a4', seed: '#d3dba6', green: '#bfcd8c', sage: '#a9c79a', coffee: '#4a2a1c', crema: '#b9824f'
};
const hex = c => [parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255];

// ---------- seeded randomness and noise ----------
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = mulberry(20261031);
const rnd = (a = 0, b = 1) => a + (b - a) * R();
function h2(x, y) { let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; }
function vn(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
const n1 = (s, seed) => vn(s, seed * 13.7);
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const TAU = Math.PI * 2;

// ---------- paper grain (buffer resolution, fixed to the canvas) ----------
let GRAIN, GRAIN2;
function buildGrain() {
  const N = BW * BH, wn = new Float32Array(N), tmp = new Float32Array(N);
  GRAIN = new Float32Array(N); GRAIN2 = new Float32Array(N);
  const GK = 1.5 / S;   // grain is sized in canvas units (the same paper as the 10 s version at 1.5×)
  for (let i = 0; i < N; i++) wn[i] = h2(Math.floor(i % BW * GK) * 3 + 11, Math.floor((i / BW | 0) * GK) * 7 + 5);
  for (let y = 0; y < BH; y++) { const o = y * BW; for (let x = 0; x < BW; x++) tmp[o + x] = (wn[o + Math.max(0, x - 1)] + wn[o + x] + wn[o + Math.min(BW - 1, x + 1)]) / 3; }
  for (let y = 0; y < BH; y++) { const a = Math.max(0, y - 1) * BW, b = y * BW, c = Math.min(BH - 1, y + 1) * BW;
    for (let x = 0; x < BW; x++) {
      const fine = (tmp[a + x] + tmp[b + x] + tmp[c + x]) / 3;
      const gx = x * GK, gy = y * GK, g = 0.45 * fine * 1.6 - 0.22 + 0.35 * vn(gx / 2.3 + gy * 0.35 / 2.3, gy / 1.6) + 0.2 * vn(gx / 7, gy / 7);
      GRAIN[b + x] = g; GRAIN2[b + x] = vn(gx / 90, gy / 90) * 0.6 + vn(gx / 23, gy / 23) * 0.4;
    } }
  let m = 0, v = 0, n = 0; for (let i = 0; i < N; i += 7) { m += GRAIN[i]; n++; } m /= n; for (let i = 0; i < N; i += 7) v += (GRAIN[i] - m) ** 2; v = Math.sqrt(v / n);
  for (let i = 0; i < N; i++) GRAIN[i] = clamp(0.5 + (GRAIN[i] - m) / v * 0.2);
}

// ---------- drawing targets: pencil layers (coverage buffers) + colour canvas; a cache copy of each ----------
const LAYERS = { light: { col: hex(C.light), alpha: 0.55 }, graph: { col: hex(C.graphite), alpha: 0.95 }, coral: { col: hex(C.coral), alpha: 0.95 } };
const ORDER = ['light', 'graph', 'coral'];
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function mkTarget() { const fc = mkCanvas(BW, BH); return { L: { light: new Float32Array(BW * BH), graph: new Float32Array(BW * BH), coral: new Float32Array(BW * BH) }, fc, fx: fc.getContext('2d', { willReadFrequently: true }) }; }
let CACHE, WORK, TG, cacheK = 0;
const WC = mkCanvas(BW, BH), wx = WC.getContext('2d');                       // composited canvas
const TMP = mkCanvas(900, 900), tx = TMP.getContext('2d', { willReadFrequently: true });
const TMP2 = mkCanvas(900, 900), tx2 = TMP2.getContext('2d');
function tmpSize(c, w, h) { if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); } }

// ---------- geometry ----------
function spline(P, step = 2) {
  if (P.length < 2) return P.slice();
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const n = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); }
  }
  out.push(P[P.length - 1]); return out;
}
function resample(P, step) {
  const out = [P[0].slice()]; let acc = 0;
  for (let i = 1; i < P.length; i++) { let [x0, y0] = P[i - 1]; const [x1, y1] = P[i]; let d = Math.hypot(x1 - x0, y1 - y0);
    while (acc + d >= step) { const t = (step - acc) / d; x0 += (x1 - x0) * t; y0 += (y1 - y0) * t; out.push([x0, y0]); d = Math.hypot(x1 - x0, y1 - y0); acc = 0; }
    acc += d; }
  return out;
}
function ell(cx, cy, rx, ry, rot = 0, a0 = 0, a1 = TAU, n = 64, wob = 0) { const P = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, k = 1 + wob * Math.sin(2 * a), x = rx * Math.cos(a) * k, y = ry * Math.sin(a) * k; P.push([cx + x * c - y * s, cy + x * s + y * c]); } return P; }
function bez(p0, p1, p2, p3, n = 24) { const P = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; P.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return P; }
function rotP(P, cx, cy, a) { const c = Math.cos(a), s = Math.sin(a); return P.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); }
function bbox(P) { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of P) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > d) d = y; } return [a, b, c, d]; }
function centroid(P) { let x = 0, y = 0; for (const p of P) { x += p[0]; y += p[1]; } return [x / P.length, y / P.length]; }
function roughen(P, amp = 1.6) {   // closed polygon, displaced along its normal by noise: a slightly ragged edge
  const seed = rnd(0, 999), D = resample(P.concat([P[0]]), 3), N = D.length, out = [];
  for (let i = 0; i < N; i++) { const a = D[(i - 1 + N) % N], b = D[(i + 1) % N]; let tx_ = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx_, ty) || 1; tx_ /= l; ty /= l;
    const s = i * 3, off = amp * ((n1(s / 30, seed) - 0.5) * 1.6 + (n1(s / 4, seed + 5) - 0.5) * 0.9 + (h2(i, seed | 0) - 0.5) * 0.5);
    out.push([D[i][0] - ty * off, D[i][1] + tx_ * off]); }
  return out;
}
function plen(P) { let s = 0; for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; }
function along(P, d) {   // point at arc length d on polyline P
  for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (d <= l) { const u = l ? d / l : 0; return [lerp(P[i - 1][0], P[i][0], u), lerp(P[i - 1][1], P[i][1], u)]; } d -= l; }
  return P[P.length - 1].slice();
}
function polyPath(c, P, k = 1, ox = 0, oy = 0) { c.moveTo(P[0][0] * k + ox, P[0][1] * k + oy); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0] * k + ox, P[i][1] * k + oy); c.closePath(); }

// ---------- the timeline of marks ----------
// Each element: t0, d, kind (sound), apply(prog) into the current target TG, nib(prog) → world point the stylus is on.
const EL = [];
function addEl(e) { e.d = Math.max(e.d, 1 / FPS); if (e.ghost) { e.kind = 'none'; delete e.nib; } EL.push(e); return e.t0 + e.d; }

// pencil stroke: stamps precomputed once (geometry never depends on progress → no flicker)
function PEN(pts, o, t0, d) {
  const lay = o.layer || 'graph';
  const w = (o.w ?? 2.4) * 1.18, wob = o.wob ?? 0.8, press = o.p ?? 1, ta = o.ta ?? 0.18, tb = o.tb ?? 0.22, seed = rnd(0, 999);
  let P = o.smooth === false ? pts : spline(pts, 2); P = resample(P, 0.55); if (P.length < 2) return t0;
  const N = P.length, tot = (N - 1) * 0.55, st = new Float32Array(N * 4), nib = [];
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i < N; i++) {
    const a = P[Math.max(0, i - 2)], b = P[Math.min(N - 1, i + 2)]; let tx_ = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx_, ty) || 1; tx_ /= l; ty /= l;
    const s = i * 0.55, off = wob * ((n1(s / 38, seed) - 0.5) * 2 + (n1(s / 9, seed + 3) - 0.5) * 0.5);
    const qx = P[i][0] - ty * off, qy = P[i][1] + tx_ * off;
    let p = Math.pow(clamp(s / (tot * ta + 1e-3)), 0.55) * Math.pow(clamp((tot - s) / (tot * tb + 1e-3)), 0.55);
    p = press * (0.12 + 0.88 * p) * (0.82 + 0.18 * n1(s / 22, seed + 7));
    const r = w * 0.5 * (0.5 + 0.5 * p) * S, cx = PX(qx), cy = PY(qy);
    st[i * 4] = cx; st[i * 4 + 1] = cy; st[i * 4 + 2] = r; st[i * 4 + 3] = 0.3 + 0.7 * p;
    x0 = Math.min(x0, cx - r); y0 = Math.min(y0, cy - r); x1 = Math.max(x1, cx + r); y1 = Math.max(y1, cy + r);
    if (i % 8 === 0 || i === N - 1) nib.push([qx, qy]);
  }
  const bx0 = Math.max(0, Math.floor(x0 - 2)), by0 = Math.max(0, Math.floor(y0 - 2)), bx1 = Math.min(BW - 1, Math.ceil(x1 + 2)), by1 = Math.min(BH - 1, Math.ceil(y1 + 2));
  const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
  return addEl({ t0, d, ghost: o.ghost, kind: lay === 'light' ? 'light' : (o.kind || 'pencil'), wx: centroid(nib),
    nib: p => nib[Math.min(nib.length - 1, Math.floor(clamp(p) * (nib.length - 1)))],
    apply(prog) {
      const n = prog >= 1 ? N : Math.floor(prog * N); if (n < 2) return;
      const B = new Float32Array(bw * bh);
      for (let i = 0; i < n; i++) {
        const cx = st[i * 4] - bx0, cy = st[i * 4 + 1] - by0, r = st[i * 4 + 2], val = st[i * 4 + 3];
        const ix0 = Math.max(0, Math.floor(cx - r - 1)), ix1 = Math.min(bw - 1, Math.ceil(cx + r + 1)), iy0 = Math.max(0, Math.floor(cy - r - 1)), iy1 = Math.min(bh - 1, Math.ceil(cy + r + 1));
        for (let y = iy0; y <= iy1; y++) { const dy = y + 0.5 - cy, row = y * bw; for (let x = ix0; x <= ix1; x++) { const dx = x + 0.5 - cx, cov = r - Math.sqrt(dx * dx + dy * dy) + 0.5; if (cov <= 0) continue; const v = (cov > 1 ? 1 : cov) * val; if (v > B[row + x]) B[row + x] = v; } }
      }
      const buf = TG.L[lay];
      for (let y = 0; y < bh; y++) { const row = y * bw, o = (y + by0) * BW + bx0; for (let x = 0; x < bw; x++) { const v = B[row + x]; if (v) { const k = o + x; buf[k] = buf[k] + v - buf[k] * v; } } }
    } });
}
// occlusion: an object in front clears the lines (and colour) already drawn inside its outline
function OCC(poly, t0, names = ['light', 'graph', 'coral'], fills = true) {
  const P = poly.map(([x, y]) => [PX(x), PY(y)]), [a, b, c, d] = bbox(P);
  const x0 = Math.max(0, Math.floor(a) - 1), y0 = Math.max(0, Math.floor(b) - 1), x1 = Math.min(BW, Math.ceil(c) + 1), y1 = Math.min(BH, Math.ceil(d) + 1), w = x1 - x0, h = y1 - y0;
  tmpSize(TMP, w, h); tx.clearRect(0, 0, w, h); tx.fillStyle = '#fff'; tx.beginPath(); polyPath(tx, P, 1, -x0, -y0); tx.fill();
  const id = tx.getImageData(0, 0, w, h).data, M = new Float32Array(w * h); for (let i = 0; i < w * h; i++) M[i] = id[i * 4 + 3] / 255;
  return addEl({ t0, d: 0, kind: 'occ', apply() {
    for (const nm of names) { const buf = TG.L[nm]; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const m = M[y * w + x]; if (m) buf[(y + y0) * BW + x + x0] *= 1 - m; } }
    if (fills) { TG.fx.save(); TG.fx.globalCompositeOperation = 'destination-out'; TG.fx.beginPath(); polyPath(TG.fx, P); TG.fx.fill(); TG.fx.restore(); }
  } });
}
// colour block: shifted off the line (dx, dy), ragged edge, multiply; holes are erased (highlights, the paper showing through),
// cuts are the outlines of objects in front. Revealed by a back-and-forth colouring path; `stop` < 1 leaves it half done.
function BLOB(poly, col, o, t0, d) {
  const dx = o.dx ?? 7, dy = o.dy ?? 5, Q = roughen(poly.map(([x, y]) => [x + dx, y + dy]), o.amp ?? 1.5);
  const holes = (o.holes || []).map(h => h.map(([x, y]) => [x + dx, y + dy])), cuts = o.cuts || [];
  const [a, b, c, e] = bbox(Q);
  // colouring path: rows across the shape at angle ang, boustrophedon
  const ang = o.ang ?? -0.5, sp = o.sp ?? 9, ca = Math.cos(ang), sa = Math.sin(ang);
  const RQ = Q.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca]), [, rb, , re] = bbox(RQ);
  const path = []; let dir = 1, rows = 0;
  for (let v = rb + sp * 0.5; v < re; v += sp) {
    let lo = 1e9, hi = -1e9;
    for (let i = 0; i < RQ.length; i++) { const p = RQ[i], q = RQ[(i + 1) % RQ.length]; if ((p[1] - v) * (q[1] - v) <= 0 && p[1] !== q[1]) { const u = (v - p[1]) / (q[1] - p[1]), x = p[0] + (q[0] - p[0]) * u; lo = Math.min(lo, x); hi = Math.max(hi, x); } }
    if (lo > hi) continue;
    const ends = dir > 0 ? [lo - 2 + rnd(-3, 2), hi + 2 + rnd(-2, 3)] : [hi + 2 + rnd(-2, 3), lo - 2 + rnd(-3, 2)];
    for (const u of ends) path.push([u * ca - v * sa, u * sa + v * ca]);
    dir = -dir; rows++;
  }
  const L = plen(path), stop = o.stop ?? 1, alpha = o.a ?? 0.92;
  const x0 = Math.max(0, Math.floor(PX(a) - 4)), y0 = Math.max(0, Math.floor(PY(b) - 4)), x1 = Math.min(BW, Math.ceil(PX(c) + 4)), y1 = Math.min(BH, Math.ceil(PY(e) + 4)), w = x1 - x0, h = y1 - y0;
  const toT = P => P.map(([x, y]) => [PX(x) - x0, PY(y) - y0]);
  const QT = toT(Q), HT = holes.map(toT), CT = cuts.map(toT), PT = toT(path);
  return addEl({ t0, d, ghost: o.ghost, kind: 'color', rate: rows / Math.max(d, 0.05), wx: [(a + c) / 2, (b + e) / 2], stop,
    nib: p => path.length ? along(path, clamp(p) * stop * L) : [(a + c) / 2, (b + e) / 2],
    apply(prog) {
      const pr = clamp(prog) * stop; if (pr <= 0) return;
      tmpSize(TMP, w, h); tx.clearRect(0, 0, w, h);
      tx.save(); tx.globalCompositeOperation = 'source-over'; tx.fillStyle = col; tx.beginPath(); polyPath(tx, QT); tx.fill();
      tx.globalCompositeOperation = 'destination-out'; tx.fillStyle = '#000';
      for (const P of HT.concat(CT)) { tx.beginPath(); polyPath(tx, P); tx.fill(); }
      if (pr < 1 && PT.length) {   // only what the colouring stroke has covered so far
        tx.globalCompositeOperation = 'destination-in'; tx.lineCap = 'round'; tx.lineJoin = 'round'; tx.lineWidth = sp * 1.9 * S; tx.strokeStyle = '#000';
        tx.beginPath(); let left = pr * L; tx.moveTo(PT[0][0], PT[0][1]);
        for (let i = 1; i < PT.length && left > 0; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); const u = Math.min(1, left / l); tx.lineTo(lerp(PT[i - 1][0], PT[i][0], u), lerp(PT[i - 1][1], PT[i][1], u)); left -= l; }
        tx.stroke();
      }
      tx.restore();
      if (o.replace) {   // re-register: what this block covers loses its old colour first (a little wider, so no old fringe peeks out)
        tmpSize(TMP2, w, h); tx2.setTransform(1, 0, 0, 1, 0, 0); tx2.clearRect(0, 0, w, h); tx2.save();
        tx2.fillStyle = '#000'; tx2.strokeStyle = '#000'; tx2.lineWidth = 7 * S; tx2.lineJoin = 'round'; tx2.beginPath(); polyPath(tx2, QT); tx2.fill(); tx2.stroke();
        tx2.globalCompositeOperation = 'destination-out'; for (const P of CT) { tx2.beginPath(); polyPath(tx2, P); tx2.fill(); }
        if (pr < 1 && PT.length) { tx2.globalCompositeOperation = 'destination-in'; tx2.lineCap = 'round'; tx2.lineJoin = 'round'; tx2.lineWidth = sp * 1.9 * S;
          tx2.beginPath(); let left = pr * L; tx2.moveTo(PT[0][0], PT[0][1]);
          for (let i = 1; i < PT.length && left > 0; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); const u = Math.min(1, left / l); tx2.lineTo(lerp(PT[i - 1][0], PT[i][0], u), lerp(PT[i - 1][1], PT[i][1], u)); left -= l; }
          tx2.stroke(); }
        tx2.restore();
        const f0 = TG.fx; f0.save(); f0.globalCompositeOperation = 'destination-out'; f0.drawImage(TMP2, 0, 0, w, h, x0, y0, w, h); f0.restore();
      }
      const f = TG.fx; f.save(); f.globalCompositeOperation = 'multiply'; f.globalAlpha = alpha; f.drawImage(TMP, 0, 0, w, h, x0, y0, w, h); f.restore();
    } });
}

// ---------- pencil lettering, written stroke by stroke along glyph skeletons ----------
let GLY = null;
const mctx = mkCanvas(10, 10).getContext('2d');
function textLayout(s, x, y, size, o = {}) {
  const f = o.f || 'CM', jit = o.jit ?? 0.6, rot = o.rot || 0, sp = o.sp ?? 1;
  mctx.font = `${size}px ${f}`;
  const ch = [...s], G = GLY[f], chars = []; let cx = 0, L = 0;
  const c0 = Math.cos(rot), s0 = Math.sin(rot);
  ch.forEach(c => {
    const adv = mctx.measureText(c).width * sp, dy = rnd(-1, 1) * jit * size * 0.025, r = rnd(-1, 1) * jit * 0.035;
    const cr = Math.cos(r), sr = Math.sin(r);
    const toW = (u, v) => { const lx = cx + u * cr - v * sr, ly = dy + u * sr + v * cr; return [x + lx * c0 - ly * s0, y + lx * s0 + ly * c0]; };
    const sk = (G.g[c] || []).map(a => { const P = []; for (let j = 0; j < a.length; j += 2) P.push([a[j] * size, a[j + 1] * size]); return P; });
    const lens = sk.map(plen), len = lens.reduce((p, q) => p + q, 0) + sk.length * size * 0.12;
    const wsk = sk.map(P => P.map(([u, v]) => toW(u, v)));
    chars.push({ c, ox: cx, dy, r, sk, wsk, len: c === ' ' ? 0 : len, L0: L, adv }); L += c === ' ' ? size * 0.25 : len; cx += adv;
  });
  return { s, x, y, size, f, rot, chars, L, hw: G.hw * size, tot: cx };
}
function textNib(T, prog) {
  let target = clamp(prog) * T.L, last = [T.x, T.y];
  for (const C of T.chars) {
    if (!C.wsk.length) { target -= (C.c === ' ' ? T.size * 0.25 : 0); continue; }
    if (target <= C.len) {
      let left = target;
      for (let k = 0; k < C.wsk.length; k++) { const P = C.wsk[k], l = plen(P); if (left <= l) return along(P, left); left -= l; if (left <= T.size * 0.12) { const n = C.wsk[k + 1]; return n ? along([P[P.length - 1], n[0]], left / (T.size * 0.12) * Math.hypot(n[0][0] - P[P.length - 1][0], n[0][1] - P[P.length - 1][1])) : P[P.length - 1]; } left -= T.size * 0.12; }
      return last;
    }
    target -= C.len; const P = C.wsk[C.wsk.length - 1]; last = P[P.length - 1];
  }
  return last;
}
function TXT(s, x, y, size, o, t0, d) {
  const T = textLayout(s, x, y, size, o), lay = o.layer || 'graph', k = o.k ?? 0.74;
  const x0 = Math.max(0, Math.floor(PX(x - size * 0.4))), y0 = Math.max(0, Math.floor(PY(y - size * 1.25 - Math.abs(T.rot) * T.tot))),
    x1 = Math.min(BW, Math.ceil(PX(x + T.tot + size * 0.5))), y1 = Math.min(BH, Math.ceil(PY(y + size * 0.6 + Math.abs(T.rot) * T.tot))), w = x1 - x0, h = y1 - y0;
  T.box = [x - size * 0.1, y - size * 0.85, x + T.tot, y + size * 0.3];
  const e = { t0, d: d ?? T.L / (o.cps || 900), kind: 'write', T, wx: [x + T.tot / 2, y], nib: p => textNib(T, p),
    apply(prog) {
      const target = clamp(prog) * T.L; if (target <= 0) return;
      tmpSize(TMP, w, h); tx.setTransform(1, 0, 0, 1, 0, 0); tx.clearRect(0, 0, w, h);
      const base = () => { tx.setTransform(S, 0, 0, S, -X0 * S - x0, -Y0 * S - y0); tx.translate(T.x, T.y); tx.rotate(T.rot); };
      tx.font = `${T.size}px ${T.f}`; tx.fillStyle = '#000'; tx.textBaseline = 'alphabetic';
      for (const Cc of T.chars) {
        if (Cc.L0 >= target) break;
        const part = target - Cc.L0;
        base(); tx.translate(Cc.ox, Cc.dy); tx.rotate(Cc.r);
        if (part >= Cc.len || !Cc.sk.length) { tx.fillText(Cc.c, 0, 0); continue; }
        // partial glyph: draw it on the side canvas, keep only what the pencil has covered
        tmpSize(TMP2, w, h); tx2.setTransform(1, 0, 0, 1, 0, 0); tx2.clearRect(0, 0, w, h); tx2.setTransform(tx.getTransform());
        tx2.font = tx.font; tx2.fillStyle = '#000'; tx2.textBaseline = 'alphabetic'; tx2.fillText(Cc.c, 0, 0);
        tx2.globalCompositeOperation = 'destination-in'; tx2.lineCap = 'round'; tx2.lineJoin = 'round'; tx2.lineWidth = T.hw * 2.9 + 1.2; tx2.strokeStyle = '#000';
        let left = part; tx2.beginPath();
        for (let q = 0; q < Cc.sk.length && left > 0; q++) {
          const P = Cc.sk[q]; tx2.moveTo(P[0][0], P[0][1]); if (P.length === 1) tx2.lineTo(P[0][0] + 0.1, P[0][1]);
          for (let j = 1; j < P.length && left > 0; j++) { const dd = Math.hypot(P[j][0] - P[j - 1][0], P[j][1] - P[j - 1][1]);
            if (dd <= left) { tx2.lineTo(P[j][0], P[j][1]); left -= dd; } else { const u = left / dd; tx2.lineTo(lerp(P[j - 1][0], P[j][0], u), lerp(P[j - 1][1], P[j][1], u)); left = 0; } }
          left -= T.size * 0.12;
        }
        tx2.stroke(); tx2.globalCompositeOperation = 'source-over';
        tx.setTransform(1, 0, 0, 1, 0, 0); tx.drawImage(TMP2, 0, 0, w, h, 0, 0, w, h);
      }
      tx.setTransform(1, 0, 0, 1, 0, 0);
      const id = tx.getImageData(0, 0, w, h).data, buf = TG.L[lay];
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const a = id[(yy * w + xx) * 4 + 3]; if (a) { const v = a / 255 * k, q = (yy + y0) * BW + xx + x0; buf[q] = buf[q] + v - buf[q] * v; } }
    } };
  addEl(e); return e;
}

// ---------- parts ----------
function circleStroke(cx, cy, r, o, t0, d) {   // sketched circle: start anywhere, overlap a little
  const a0 = o.a0 ?? rnd(0, TAU), turn = o.turn ?? 1.07, ry = o.ry ?? r;
  return PEN(ell(cx, cy, r, ry, o.rot || 0, a0, a0 + TAU * turn, Math.max(16, r * 0.7 | 0)), { w: o.w ?? 2.2, layer: o.layer, ta: 0.1, tb: 0.12, wob: o.wob ?? 0.5, p: o.p, kind: o.kind }, t0, d);
}
function arrow(P, o, t0, d) {
  const lay = o.layer || 'coral', w = o.w ?? 4.6;
  const Sp = spline(P, 2); let t = PEN(P, { w, layer: lay, ta: 0.08, tb: 0.06, wob: 0.7 }, t0, d * 0.78);
  const e = Sp[Sp.length - 1], f = Sp[Math.max(0, Sp.length - 9)], a = Math.atan2(e[1] - f[1], e[0] - f[0]), L = o.head ?? 22;
  const sides = [1, -1].map(sg => { const b = a + Math.PI + sg * 0.5; return [[e[0] + Math.cos(b) * L, e[1] + Math.sin(b) * L], [e[0] + Math.cos(b) * L * 0.5 + rnd(-1, 1), e[1] + Math.sin(b) * L * 0.5], [e[0], e[1]]]; });
  t = PEN(sides[0], { w: w * 0.9, layer: lay, ta: 0.4, tb: 0.05, wob: 0.3 }, t, d * 0.11);
  return PEN(sides[1], { w: w * 0.9, layer: lay, ta: 0.4, tb: 0.05, wob: 0.3 }, t, d * 0.11);
}
const CUE = {}, T_ = {}; let VOC = null, CAM = [], DYN = [], SFX = [];
