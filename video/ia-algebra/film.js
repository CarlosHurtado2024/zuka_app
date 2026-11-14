// «La IA está hecha de álgebra» · Sci-fi Hologram HUD (lemo-opuscar). Toda la película: modelos de alambre, cámara,
// HUD, subtítulos, eventos de sonido (EV → mix.py) y cajas de texto (TEXTS → readcheck). Números: data.js.
import { Holo, drawScanPlane, drawPad, makeCamera, prepModel } from './engine/holo.js';
import * as U from './engine/hud.js';
import * as D from './data.js';
const { clamp } = U;
U.FONT.ui = 'Rajdhani, RajMath';           // Rajdhani no trae σ, η, ², subíndices: los pone Noto Sans
const W = 1080, H = 1920, FPS = 24, TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const win = (t, a, b, fi = .25, fo = .25) => Math.min(seg(t, a, a + fi), 1 - seg(t, b - fo, b));
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const TH = U.theme(255, 80);               // violeta (el morado del álgebra de Zuka) y acento lima
const HUE = TH.hue, F = U.FONT, L = D.LABELS, TT = D.T;
const XL = 160, XR = 920;                  // franja segura para texto (14 %–86 % del ancho)

// ---------------- Modelos ----------------
function sphere(c, r, nLat = 5, nLon = 10) {
  const v = [], e = [], q = [];
  for (let i = 0; i <= nLat; i++) {
    const la = -Math.PI / 2 + Math.PI * i / nLat;
    for (let j = 0; j < nLon; j++) { const lo = TAU * j / nLon; v.push(c[0] + r * Math.cos(la) * Math.cos(lo), c[1] + r * Math.sin(la), c[2] + r * Math.cos(la) * Math.sin(lo)); }
  }
  const id = (i, j) => i * nLon + (j % nLon);
  for (let i = 0; i <= nLat; i++) for (let j = 0; j < nLon; j++) {
    if (i > 0 && i < nLat) e.push(id(i, j), id(i, j + 1));
    if (i < nLat) { e.push(id(i, j), id(i + 1, j)); q.push(id(i, j), id(i, j + 1), id(i + 1, j + 1), id(i + 1, j)); }
  }
  return { v, e, q };
}
function merge(list) {
  const v = [], e = [], q = [];
  for (const m of list) { const o = v.length / 3; v.push(...m.v); e.push(...m.e.map(i => i + o)); q.push(...(m.q || []).map(i => i + o)); }
  return { v, e, q };
}
function lines(pairs) { const v = [], e = []; for (const [a, b] of pairs) { e.push(v.length / 3, v.length / 3 + 1); v.push(...a, ...b); } return { v, e, q: [] }; }
function box(c, s) {
  const v = []; for (const dx of [-1, 1]) for (const dy of [-1, 1]) for (const dz of [-1, 1]) v.push(c[0] + dx * s[0] / 2, c[1] + dy * s[1] / 2, c[2] + dz * s[2] / 2);
  const e = [0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 2, 6, 3, 7];
  const q = [0, 1, 3, 2, 4, 5, 7, 6, 0, 1, 5, 4, 2, 3, 7, 6, 0, 2, 6, 4, 1, 3, 7, 5];
  return { v, e, q };
}
const piece = (id, m, o = {}) => ({ id, explode: o.explode || [0, 0, 0], ...m, ...o });

// la torre: placa de entrada (Mishi), capa 1 (8), capa 2 (2), salida (1)
const PY = 0.08, PS = 1.28, PX = PS / 16;      // altura, lado y píxel de la placa
const pix = (r, c) => [-PS / 2 + (c + .5) * PX, PY, -PS / 2 + (r + .5) * PX];
const Y1 = 0.78, Y2 = 1.32, YO = 1.82, R1 = 0.5, XH = 0.3;
const H1 = Array.from({ length: 8 }, (_, j) => { const a = TAU * j / 8 + Math.PI / 8; return [R1 * Math.cos(a), Y1, R1 * Math.sin(a)]; });
const H2 = [[-XH, Y2, 0], [XH, Y2, 0]], OUT = [0, YO, 0];
function plateModel() {
  const v = [], e = [], q = [], n = 17, i0 = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) v.push(-PS / 2 + c * PX, PY, -PS / 2 + r * PX);
  for (let r = 0; r < n; r++) for (let c = 0; c < n - 1; c++) e.push(i0 + r * n + c, i0 + r * n + c + 1);
  for (let c = 0; c < n; c++) for (let r = 0; r < n - 1; r++) e.push(i0 + r * n + c, i0 + (r + 1) * n + c);
  for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) q.push(r * n + c, r * n + c + 1, (r + 1) * n + c + 1, (r + 1) * n + c);
  const b = v.length / 3, h = PS / 2 + .03;                      // borde de abajo: la placa es una losa
  for (const [x, z] of [[-h, -h], [h, -h], [h, h], [-h, h]]) v.push(x, 0.02, z);
  e.push(b, b + 1, b + 1, b + 2, b + 2, b + 3, b + 3, b);
  for (const [k, ci] of [[0, 0], [1, n - 1], [2, n * n - 1], [3, n * (n - 1)]]) e.push(b + k, ci);
  return { v, e, q };
}
function towerModel() {
  const l1 = [];
  H1.forEach((p, j) => {                                           // cada neurona de la capa 1 mira un pedazo de la foto
    const a = Math.atan2(p[2], p[0]);
    for (const [dr, dc] of [[-2, -2], [2, 2], [-2, 2], [2, -2]]) {
      const cc = Math.round(7.5 + 5 * Math.cos(a) + dc), rr = Math.round(7.5 + 5 * Math.sin(a) + dr);
      l1.push([pix(clamp(rr, 0, 15), clamp(cc, 0, 15)), [p[0], p[1] - .05, p[2]]]);
    }
  });
  const l2 = []; for (const a of H1) for (const b of H2) l2.push([[a[0], a[1] + .05, a[2]], [b[0], b[1] - .05, b[2]]]);
  const wl = H2.map(b => [[b[0], b[1] + .05, b[2]], [OUT[0], OUT[1] - .08, OUT[2]]]);
  const core = merge([lines([[[-.035, YO, 0], [.035, YO, 0]], [[0, YO - .035, 0], [0, YO + .035, 0]], [[0, YO, -.035], [0, YO, .035]]]), sphere(OUT, .03, 3, 8)]);
  return prepModel({ name: 'red', parts: [
    { id: 'input', anchor: [0, PY, 0], pieces: [piece('plate', plateModel())] },
    { id: 'L1', anchor: [0, .4, 0], pieces: [piece('l1', lines(l1), { box: false })] },
    { id: 'h1', anchor: H1[1], pieces: H1.map((p, j) => piece('h1-' + j, sphere(p, .05))) },
    { id: 'L2', anchor: [0, 1.05, 0], pieces: [piece('l2', lines(l2), { box: false })] },
    { id: 'h2', anchor: H2[0], pieces: H2.map((p, j) => piece('h2-' + j, sphere(p, .055))) },
    { id: 'w', anchor: [0, 1.55, 0], pieces: [piece('wl', lines(wl), { box: false })] },
    { id: 'out', anchor: OUT, pieces: [piece('shell', sphere(OUT, .085, 6, 12), { explode: [0, .2, 0] }), piece('core', core, { internal: true, hot: true })] },
  ] });
}
// la montaña del error L(w₁, w₂) de la última neurona
const MS = 0.7, MY0 = 0.1, MH = 1.05;
const mx = w1 => -MS + 2 * MS * (w1 - D.WIN.w1[0]) / (D.WIN.w1[1] - D.WIN.w1[0]);
const mz = w2 => -MS + 2 * MS * (w2 - D.WIN.w2[0]) / (D.WIN.w2[1] - D.WIN.w2[0]);
const my = Lv => MY0 + MH * Lv / D.LMAX;
const mpt = w => [mx(w[0]), my(D.loss(w)), mz(w[1])];
function mountainModel() {
  const N = 28, v = [], e = [], q = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const w1 = lerp(D.WIN.w1[0], D.WIN.w1[1], j / N), w2 = lerp(D.WIN.w2[0], D.WIN.w2[1], i / N); v.push(...mpt([w1, w2]));
  }
  const id = (i, j) => i * (N + 1) + j;
  for (let i = 0; i <= N; i++) for (let j = 0; j < N; j++) { e.push(id(i, j), id(i, j + 1)); e.push(id(j, i), id(j + 1, i)); }
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) q.push(id(i, j), id(i, j + 1), id(i + 1, j + 1), id(i + 1, j));
  const ax = lines([[[-MS, MY0 - .06, MS + .08], [MS + .1, MY0 - .06, MS + .08]], [[-MS - .08, MY0 - .06, -MS - .1], [-MS - .08, MY0 - .06, MS + .08]], [[-MS - .08, MY0 - .06, MS + .08], [-MS - .08, MY0 + MH + .1, MS + .08]]]);
  return prepModel({ name: 'mtn', parts: [{ id: 'mtn', anchor: [0, .5, 0], pieces: [piece('surf', { v, e, q })] }, { id: 'axes', anchor: [-MS, MY0, MS], pieces: [piece('ax', ax, { box: false })] }] });
}
// palabras como fichas
const TOKX = [-.44, -.147, .147, .44], TOKZ = .25, TOKY = .07;
function tokenModel() {
  return prepModel({ name: 'tok', parts: L.tokens.map((w, i) => ({ id: 'tok' + i, anchor: [TOKX[i], TOKY, TOKZ], pieces: [piece('tk' + i, box([TOKX[i], TOKY, TOKZ], [.26, .1, .16]))] })) });
}
const TOWER = towerModel(), MTN = mountainModel(), TOK = tokenModel();
// vectores de juguete para la atención (ilustración: no se muestran cifras)
const VEC = L.tokens.map((_, i) => Array.from({ length: 6 }, (_, k) => hash(i * 7.3 + k * 1.9) * 2 - 1));
VEC[3] = VEC[0].map((x, k) => x * .8 + VEC[3][k] * .2);              // «gato» se parece a «Mishi»
const ATT = VEC.map(a => { const s = VEC.map(b => a.reduce((t, x, k) => t + x * b[k], 0) * 1.2); const m = Math.max(...s), ex = s.map(x => Math.exp(x - m)), z = ex.reduce((p, x) => p + x, 0); return ex.map(x => x / z); });

// ---------------- Cámara ----------------
const cam = (target, yaw, pitch, dist, cy, cx = 540) => ({ target, yaw, pitch, dist, cy, cx, fov: .6 });
const KEYS = [
  [0, cam([0, .95, 0], .78, .3, 8.2, 1100)], [9.2, cam([0, .95, 0], .36, .36, 7.8, 1100)],
  [12.2, cam([0, PY, .02], 0, 1.25, 4.7, 1090)], [21.2, cam([0, PY, .02], 0, 1.27, 4.5, 1090)],
  [24.0, cam([0, .82, 0], .42, .26, 5.6, 1110)], [27.5, cam([0, .82, 0], .52, .26, 5.5, 1110)],
  [28.1, cam([0, 1.6, 0], .16, .12, 3.6, 1200)], [45.0, cam([0, 1.6, 0], .3, .14, 3.5, 1200)],
  [47.0, cam([0, .5, 0], .74, .5, 7.8, 1130)], [64.0, cam([0, .48, 0], 1.04, .46, 7.2, 1130)],
  [67.4, cam([0, .95, 0], .62, .14, 8.6, 1060)], [73.6, cam([0, .95, 0], .45, .2, 8.4, 1060)],
  [75.6, cam([0, .3, .1], 0, .42, 4.9, 1130)], [84.0, cam([0, .3, .1], .12, .38, 4.7, 1130)],
  [86.0, cam([0, PY, .02], 0, 1.2, 6.0, 1040)], [90.5, cam([0, PY, .02], 0, 1.2, 6.3, 1040)],
];
function camAt(t) {
  let i = 0; while (i < KEYS.length - 2 && t >= KEYS[i + 1][0]) i++;
  const [ta, A] = KEYS[i], [tb, B] = KEYS[i + 1], w = eio(seg(t, ta, tb));
  return { target: A.target.map((x, k) => lerp(x, B.target[k], w)), yaw: lerp(A.yaw, B.yaw, w), pitch: lerp(A.pitch, B.pitch, w),
    dist: Math.exp(lerp(Math.log(A.dist), Math.log(B.dist), w)), cy: lerp(A.cy, B.cy, w), cx: lerp(A.cx, B.cx, w), fov: .6 };
}

// ---------------- Texto (dibuja y anota la caja para readcheck) ----------------
let TXT = [];
const font = (w, s, fam = F.ui) => `${w} ${s}px ${fam}`;
function text(ctx, id, s, x, y, o = {}) {
  const a = o.a ?? 1; if (a <= 0.01) return 0;
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.font = font(o.w ?? 500, o.size ?? 30, o.mono ? F.mono : F.ui); ctx.letterSpacing = (o.ls ?? 0) + 'px';
  let size = o.size ?? 30;
  if (o.maxW) { while (ctx.measureText(s).width > o.maxW && size > 12) { size--; ctx.font = font(o.w ?? 500, size, o.mono ? F.mono : F.ui); } }
  const tw = ctx.measureText(s).width, al = o.align || 'left', x0 = al === 'center' ? x - tw / 2 : al === 'right' ? x - tw : x;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = typeof o.col === 'function' ? o.col(a) : (o.col || TH.hi(a));
  const shown = o.roll != null ? U.rollText(s, o.roll, o.frame || 0, o.seed || 0) : s;
  ctx.fillText(shown, x0, y);
  ctx.restore();
  if (a > .5) TXT.push({ id, text: s, x0, y0: y - size * .78, x1: x0 + tw, y1: y + size * .22, pass: o.pass || undefined });
  return tw;
}
function num(ctx, id, s, x, y, o = {}) {          // cifras de ancho fijo y punto cuadrado; o.align: left | right | center
  const a = o.a ?? 1; if (a <= .01) return 0;
  ctx.save(); ctx.font = font(o.w ?? 300, o.size ?? 90); const adv = ctx.measureText('0').width * 1.02;
  const wOf = str => [...str].reduce((p, ch) => p + ('.,: '.includes(ch) ? ctx.measureText(ch).width * 1.1 : adv), 0), tw = wOf(s);
  const x0 = o.align === 'right' ? x - tw : o.align === 'center' ? x - tw / 2 : x;
  ctx.fillStyle = o.col || TH.hi(a);
  U.monoText(ctx, o.roll != null ? U.rollText(s, o.roll, o.frame || 0, 11) : s, x0, y, adv);
  ctx.restore();
  if (a > .5) TXT.push({ id, text: s, x0, y0: y - (o.size ?? 90) * .72, x1: x0 + tw, y1: y + 4, pass: o.pass || undefined });
  return tw;
}
// fórmula con exponentes: 'e^(−z)'
function formula(ctx, id, s, x, y, o = {}) {
  const a = o.a ?? 1; if (a <= .01) return;
  const size = o.size ?? 40, parts = []; let rest = s;
  while (rest) { const m = rest.match(/\^\(([^)]*)\)/); if (!m) { parts.push([rest, 0]); break; } parts.push([rest.slice(0, m.index), 0], [m[1], 1]); rest = rest.slice(m.index + m[0].length); }
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = o.col || TH.hi(a);
  const wOf = ([p, sup]) => { ctx.font = font(o.w ?? 500, sup ? size * .62 : size); return ctx.measureText(p).width; };
  const tw = parts.reduce((p, q) => p + wOf(q), 0); let cx = o.align === 'center' ? x - tw / 2 : o.align === 'right' ? x - tw : x;
  const x0 = cx;
  for (const q of parts) { const w = wOf(q); ctx.fillText(q[0], cx, q[1] ? y - size * .42 : y); cx += w; }
  ctx.restore();
  if (a > .5) TXT.push({ id, text: s, x0, y0: y - size * .95, x1: x0 + tw, y1: y + size * .25 });
}
function plateBox(ctx, x0, y0, x1, y1, a) { U.plate(ctx, TH, x0, y0, x1 - x0, y1 - y0, a); }
// rótulo pegado a un punto del modelo: anillo + línea + placa
function callout(ctx, id, p, s, lx, ly, a, o = {}) {
  if (!p || a <= .01) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = TH.hi(.9 * a); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(p[0], p[1], 13, 0, TAU); ctx.stroke();
  if (o.pulse) { ctx.strokeStyle = TH.line(.8 * a * (1 - o.pulse)); ctx.beginPath(); ctx.arc(p[0], p[1], 13 + 30 * o.pulse, 0, TAU); ctx.stroke(); }
  ctx.font = font(600, o.size ?? 30); const tw = ctx.measureText(s).width;
  const bx = o.align === 'right' ? lx - tw - 14 : o.align === 'center' ? lx - tw / 2 - 14 : lx, by = ly - 22;
  const ex = o.align === 'right' ? bx + tw + 28 : o.align === 'center' ? lx : bx, ey = o.align === 'center' ? (ly < p[1] ? by + 44 : by) : ly;
  const ang = Math.atan2(ey - p[1], ex - p[0]); ctx.strokeStyle = TH.line(.85 * a); ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(ang) * 13, p[1] + Math.sin(ang) * 13); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.restore();
  plateBox(ctx, bx, by, bx + tw + 28, by + 44, a);
  text(ctx, id, s, bx + 14, by + 33, { size: o.size ?? 30, w: 600, a, col: o.col });
}

// ---------------- Piezas de HUD ----------------
function scanLine(t, a, b, y0, y1) { return t < a ? y0 : t > b ? y1 : lerp(y0, y1, eio(seg(t, a, b))); }
function pixels(ctx, P, alpha, hot = null) {      // la foto de Mishi: cada píxel brilla según su número
  if (alpha <= .01) return;
  const p = new Float32Array(3), c = [];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let r = 0; r < 16; r++) for (let k = 0; k < 16; k++) {
    const g = D.MISHI[r][k] / 255; if (g < .03) continue;
    const x0 = -PS / 2 + k * PX, z0 = -PS / 2 + r * PX, pts = [[x0, z0], [x0 + PX, z0], [x0 + PX, z0 + PX], [x0, z0 + PX]].map(([x, z]) => (P(x, PY, z, p), [p[0], p[1]]));
    ctx.fillStyle = `hsla(${HUE},70%,${30 + g * 55}%,${alpha * (.15 + .75 * g)})`;
    ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill();
  }
  if (hot) {                                       // el recuadro de 3 × 3 de la lupa
    const [r0, c0] = D.PATCH_AT, x0 = -PS / 2 + c0 * PX, z0 = -PS / 2 + r0 * PX, s = 3 * PX;
    ctx.strokeStyle = TH.hi(hot); ctx.lineWidth = 2.4; ctx.beginPath();
    [[x0, z0], [x0 + s, z0], [x0 + s, z0 + s], [x0, z0 + s]].forEach(([x, z], i) => { P(x, PY + .002, z, p); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
}
function chipRow(ctx, t, slots) {                  // fichas fijas arriba: z, σ, L (se quedan hasta el final)
  slots.forEach((c, i) => {
    const a = c.a; if (a <= .01) return;
    const x = XL + i * 260, y = 168, w = 240, dy = (1 - eo(c.k)) * 60;
    plateBox(ctx, x, y + dy, x + w, y + 62 + dy, a);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = TH.line(.9 * a); ctx.fillRect(x, y + dy - 2, 14, 4); ctx.restore();
    text(ctx, 'chipL' + i, c.label, x + 16, y + 42 + dy, { size: 24, w: 600, a, col: TH.line, ls: 2 });
    num(ctx, 'chipV' + i, c.value, x + w - 16, y + 46 + dy, { size: 44, w: 400, a, col: TH.acc(a), align: 'right' });
  });
}
function plot(ctx, x0, y0, w, h, a, t) {            // la sigmoide dentro de su tarjeta
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const X = z => x0 + (z + 6) / 12 * w, Y = s => y0 + h - s * h;
  ctx.strokeStyle = TH.dim(.5 * a); ctx.lineWidth = 1; ctx.setLineDash([5, 7]);
  ctx.beginPath(); ctx.moveTo(x0, Y(1)); ctx.lineTo(x0 + w, Y(1)); ctx.moveTo(X(0), y0 - 6); ctx.lineTo(X(0), y0 + h); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = TH.line(.7 * a); ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x0 + w, Y(0)); ctx.stroke();
  const k = eo(seg(t, TT.sig[0] + .3, TT.sig[0] + 1.6));
  ctx.strokeStyle = TH.hi(.95 * a); ctx.lineWidth = 2.4; ctx.beginPath();
  for (let i = 0; i <= 120 * k; i++) { const z = -6 + 12 * i / 120; i ? ctx.lineTo(X(z), Y(D.sigma(z))) : ctx.moveTo(X(z), Y(D.sigma(z))); }
  ctx.stroke();
  const pk = eo(seg(t, TT.sigRoll[0], TT.sigRoll[0] + .8)), zz = D.z(D.W0), s = D.sigma(zz);
  if (pk > 0) {
    ctx.strokeStyle = TH.acc(.9 * a); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(zz), Y(0)); ctx.lineTo(X(zz), lerp(Y(0), Y(s), pk));
    if (pk >= 1) { ctx.lineTo(x0, Y(s)); } ctx.stroke();
    ctx.fillStyle = TH.hi(a); ctx.beginPath(); ctx.arc(X(zz), lerp(Y(0), Y(s), pk), 6, 0, TAU); ctx.fill();
  }
  ctx.restore();
  text(ctx, 'p1', '1', x0 - 12, Y(1) + 9, { size: 24, w: 500, a, col: TH.line, align: 'right' });
  text(ctx, 'p0', '0', x0 - 12, Y(0) + 9, { size: 24, w: 500, a, col: TH.line, align: 'right' });
  text(ctx, 'pz', 'z', x0 + w + 8, Y(0) + 9, { size: 26, w: 500, a, col: TH.line });
}

// ---------------- Render ----------------
const holo = new Holo(W, H), holo2 = new Holo(W, H);
let glitchSeed = 0;
function frameAt(ctx, t, fT = t) {
  TXT = [];
  const fr = Math.round(fT * FPS), C = camAt(t), P = makeCamera(C, W, H).project, p3 = new Float32Array(3);
  const prj = (x, y, z) => { P(x, y, z, p3); return [p3[0], p3[1], p3[2]]; };
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  U.background(ctx, W, H, TH, { cx: W / 2, cy: C.cy - 80, px: -C.yaw * 160, py: C.pitch * 120 });
  const padA = t < TT.end[1] - 1.5 ? 1 : lerp(1, .55, seg(t, TT.end[1] - 1.5, TT.end[1]));
  drawPad(ctx, C, W, H, { hue: HUE, rot: t * .06, alpha: .9 * padA });

  // --- la torre ---
  const towerOn = t < TT.erase[1] || (t >= TT.back[0] && t < TT.off2[1]) || t >= TT.end[0];
  let info = null;
  if (towerOn) {
    const o = { hue: HUE, explode: {}, flash: {} };
    if (t < TT.scanIn[1] + .2) o.scan = { y: scanLine(t, -.3, TT.scanIn[1], 0, 2.05), band: .08 };
    if (t >= TT.back[0] && t < TT.back[1] + .2) o.scan = { y: scanLine(t, TT.back[0], TT.back[1], 0, 2.05), band: .08 };
    if (t >= TT.end[0]) o.scan = { y: scanLine(t, TT.end[0], TT.end[0] + 1.4, 0, .2), band: .08 }, o.only = ['input'];
    if (t >= TT.erase[0] && t < TT.erase[1]) o.scanDown = { y: scanLine(t, TT.erase[0], TT.erase[1], 2.05, -.02) };
    if (t >= TT.off2[0] && t < TT.off2[1]) o.scanDown = { y: scanLine(t, TT.off2[0], TT.off2[1], 2.05, -.02) };
    // la última neurona se abre (28.2) y se cierra antes de la montaña
    o.explode.out = eo(seg(t, TT.open[0], TT.open[1])) * (1 - eio(seg(t, 44.2, 45)));
    o.flash.w = (t > TT.ws && t < TT.ws + .14) || (t > TT.ws + .5 && t < TT.ws + .64) ? 1 : 0;
    o.flash.out = (t > TT.outRoll[1] && t < TT.outRoll[1] + .125) || (t > TT.outRoll2[1] && t < TT.outRoll2[1] + .125) ? 1 : 0;
    o.flash.h1 = t > 24 && t < 24.125 ? 1 : 0;
    const solidK = t >= TT.solid[0] && t < TT.off2[0] ? eo(seg(t, TT.solid[0], TT.solid[1])) * .75 : 0;
    o.solid = solidK; o.scanOffset = fr;
    if (solidK > 0 && t < TT.solid[1] + .3) o.wave = { y: lerp(-.1, 2.1, seg(t, TT.solid[0], TT.solid[1])), w: .12 };
    if (t >= TT.solid[0] && t < TT.off2[0]) o.lineWidth = 1.35 + .5 * solidK;
    const close = t >= TT.whip[0] && t < TT.erase[0];
    if (close) {                                   // de cerca: lo de abajo se apaga, la neurona y sus dos entradas no
      holo2.draw(ctx, TOWER, C, { ...o, only: ['input', 'L1', 'h1', 'L2'], gain: .32, glow: .6 });
      info = holo.draw(ctx, TOWER, C, { ...o, only: ['h2', 'w', 'out'] });
    } else {
      const lp = t >= TT.down[0] + 1 && t < TT.up[0] + .6;          // en la lupa la foto manda: el resto se apaga
      if (lp) { const k = 1 - .82 * win(t, TT.down[0] + 1, TT.up[0] + .6, .8, .8); holo2.draw(ctx, TOWER, C, { ...o, only: ['L1', 'h1', 'L2', 'h2', 'w', 'out'], gain: k, glow: k }); info = holo.draw(ctx, TOWER, C, { ...o, only: ['input'] }); }
      else info = holo.draw(ctx, TOWER, C, o);
    }
    if (o.scan) drawScanPlane(ctx, C, W, H, o.scan.y, { hue: HUE, r: 1, rot: t * .3, alpha: .8 * (1 - seg(o.scan.y, 1.9, 2.05)) });
    if (o.scanDown) drawScanPlane(ctx, C, W, H, Math.max(0, o.scanDown.y), { hue: HUE, r: 1, rot: t * .3, alpha: .8 });
    const sy = o.scan ? o.scan.y : o.scanDown ? o.scanDown.y : 9;
    if (sy > PY) {
      let pa = t < TT.down[0] ? .55 : t < TT.up[1] ? 1 : t >= TT.end[0] ? 1 : .45;
      if (t >= TT.off2[0] && t < TT.end[0]) pa *= 1 - seg(t, TT.off2[0], TT.off2[1] - .2);
      pixels(ctx, P, pa, t > TT.loupe[0] + .6 && t < TT.up[0] + .4 ? win(t, TT.loupe[0] + .6, TT.up[0] + .4, .3, .4) : null);
    }
  }
  // --- la montaña ---
  if (t >= TT.mtn[0] && t < TT.back[0]) {
    const o = { hue: HUE, scan: t < TT.mtn[1] + .2 ? { y: scanLine(t, TT.mtn[0], TT.mtn[1], 0, 1.3), band: .08 } : null };
    if (t >= TT.mtnOff[0]) o.scanDown = { y: scanLine(t, TT.mtnOff[0], TT.mtnOff[1], 1.3, -.02) };
    info = holo.draw(ctx, MTN, C, o);
    if (o.scan) drawScanPlane(ctx, C, W, H, o.scan.y, { hue: HUE, r: 1.05, rot: t * .3, alpha: .8 * (1 - seg(o.scan.y, 1.15, 1.3)) });
    if (o.scanDown) drawScanPlane(ctx, C, W, H, Math.max(0, o.scanDown.y), { hue: HUE, r: 1.05, rot: t * .3, alpha: .8 });
    mountainHud(ctx, t, prj, fr, o.scanDown ? 1 - seg(t, TT.mtnOff[0], TT.mtnOff[0] + .5) : 1);
  }
  // --- las palabras ---
  if (t >= TT.tokens[0] && t < TT.tokOff[1]) {
    const o = { hue: HUE };
    if (t < TT.tokens[1] + .2) o.scan = { y: scanLine(t, TT.tokens[0], TT.tokens[1], 0, .2), band: .05 };
    if (t >= TT.tokOff[0]) o.scanDown = { y: scanLine(t, TT.tokOff[0], TT.tokOff[1], .2, -.02) };
    holo.draw(ctx, TOK, C, o);
    tokenHud(ctx, t, prj, fr, o.scanDown ? 1 - seg(t, TT.tokOff[0], TT.tokOff[0] + .6) : 1);
  }

  U.vignette(ctx, W, H, .62);
  hud(ctx, t, fr, info, prj);
  chrome(ctx, t);
  subtitle(ctx, t);
  if (t >= TT.mtn[0] && t < TT.mtn[0] + 3 / FPS) U.glitch(ctx, W, H, 1, 7 + fr);
}

// ---------- HUD por escena ----------
function hud(ctx, t, fr, info, prj) {
  // título (rueda como un valor)
  const ta = win(t, TT.title[0], TT.title[1], .3, .5);
  if (ta > 0) {
    plateBox(ctx, XL - 20, 236, XR + 20, 448, ta);
    text(ctx, 'code', L.code, XL, 278, { size: 22, w: 400, mono: true, col: TH.line, a: ta, roll: seg(t, TT.title[0], TT.title[0] + .8), frame: fr });
    text(ctx, 'title', L.title, 540, 372, { size: 92, w: 300, ls: 6, a: ta, align: 'center', maxW: XR - XL, roll: seg(t, TT.title[0] + .3, TT.title[0] + 1.6), frame: fr });
    text(ctx, 'tag', L.tag, 540, 425, { size: 32, w: 600, ls: 5, a: ta, col: TH.line, align: 'center', roll: seg(t, TT.title[0] + 1.2, TT.title[0] + 2.2), frame: fr, seed: 5 });
  }
  // salida: 57 % (S1) y 91 % (S6)
  const outCard = (k0, val, old, a, tLock) => {
    const bb = info?.bbox?.out; if (!bb) return;
    U.targetBox(ctx, TH, bb, eo(seg(t, k0, k0 + .2)), { tag: 'SALIDA', flash: t > tLock && t < tLock + .125, alpha: a, pad: 22 });
    const an = info.anchor.out, x = 560, y = 490;
    U.leader(ctx, TH, [an[0], an[1]], [an[0] + 40, y + 200], [x, y + 200], seg(t, k0 + .1, k0 + .6), { alpha: a });
    plateBox(ctx, x, y, XR, y + 200, a * seg(t, k0 + .3, k0 + .6));
    const ca = a * seg(t, k0 + .4, k0 + .7);
    text(ctx, 'outL', L.out, x + 22, y + 44, { size: 28, w: 600, ls: 2, a: ca, col: TH.line });
    const rk = seg(t, tLock - 1, tLock), locked = t >= tLock;
    if (old) text(ctx, 'outOld', old + ' %', XR - 22, y + 44, { size: 28, w: 500, a: ca * .55, col: TH.dim, align: 'right' });
    const vw = num(ctx, 'outV', val, x + 22, y + 160, { size: 116, w: 300, a: ca, roll: rk, frame: fr, col: locked ? (t < tLock + .125 ? TH.hi(ca) : TH.acc(ca)) : TH.line(.85 * ca) });
    text(ctx, 'outU', '%', x + 32 + vw, y + 158, { size: 44, w: 500, a: ca, col: locked ? TH.acc : TH.line });
  };
  if (t >= TT.outBox && t < TT.down[0] + .4) outCard(TT.outBox, L.out0, null, 1 - seg(t, TT.down[0], TT.down[0] + .4), TT.outRoll[1]);
  if (t >= TT.solid[0] && t < TT.off2[0] + .3) outCard(TT.solid[0], L.out1, L.out0, 1 - seg(t, TT.off2[0], TT.off2[0] + .3), TT.outRoll2[1]);

  // entrada y lupa
  if (t >= TT.down[1] && t < TT.up[0] + .5) {
    const a = win(t, TT.down[1], TT.up[0] + .5, .3, .5), bb = info?.bbox?.input;
    if (bb) U.targetBox(ctx, TH, [bb[0], bb[1] + 40, bb[2], bb[3]], eo(seg(t, TT.down[1], TT.down[1] + .2)), { tag: L.input, alpha: a, pad: 8, flash: t > TT.down[1] + .2 && t < TT.down[1] + .325 });
    const la = a * seg(t, TT.loupe[0] + .6, TT.loupe[0] + 1.2), x0 = XL + 30, y0 = 268, cs = 112;
    if (la > 0) {
      const [r0, c0] = D.PATCH_AT, pc = prj(-PS / 2 + (c0 + 1.5) * PX, PY, -PS / 2 + (r0 + 3) * PX);
      U.leader(ctx, TH, [pc[0], pc[1]], [x0 + cs * 1.5, pc[1] - 60], [x0 + cs * 1.5, y0 + 3 * cs + 8], seg(t, TT.loupe[0] + .6, TT.loupe[0] + 1.3), { alpha: la });
      plateBox(ctx, x0 - 14, y0 - 56, x0 + 3 * cs + 14, y0 + 3 * cs + 14, la);
      text(ctx, 'matL', L.matrix, x0, y0 - 18, { size: 26, w: 600, ls: 2, a: la, col: TH.line });
      const rk = seg(t, TT.matRoll[0], TT.matRoll[1]), locked = t >= TT.matRoll[1];
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      D.PATCH.forEach((row, i) => row.forEach((v, j) => {
        const g = v / 255, x = x0 + j * cs, y = y0 + i * cs;
        ctx.fillStyle = `hsla(${HUE},70%,${30 + g * 55}%,${la * (.12 + .7 * g)})`; ctx.fillRect(x + 3, y + 3, cs - 6, cs - 6);
        ctx.strokeStyle = TH.line(.6 * la); ctx.lineWidth = 1; ctx.strokeRect(x + 3.5, y + 3.5, cs - 7, cs - 7);
      }));
      ctx.restore();
      D.PATCH.forEach((row, i) => row.forEach((v, j) => {
        const g = v / 255, x = x0 + j * cs + cs / 2, y = y0 + i * cs + cs / 2 + 15;
        const bg = `rgba(1,8,12,${.7 * la})`; ctx.save(); ctx.fillStyle = bg; ctx.fillRect(x - 40, y - 34, 80, 44); ctx.restore();
        num(ctx, 'm' + i + j, String(v), x, y, { size: 42, w: 500, align: 'center', a: la, roll: clamp(rk * 1.3 - (2 - j) * .12), frame: fr + i * 3, col: locked ? (t < TT.matRoll[1] + .125 ? TH.hi(la) : TH.acc(la)) : TH.line(.85 * la) });
      }));
      const ka = la * seg(t, TT.matRoll[1] + .3, TT.matRoll[1] + .7), kx = x0 + 3 * cs + 50;
      plateBox(ctx, kx - 14, 300, XR, 360, ka); text(ctx, 'black', L.black, kx, 341, { size: 30, w: 600, a: ka });
      const kb = la * seg(t, TT.matRoll[1] + 1.2, TT.matRoll[1] + 1.6);
      plateBox(ctx, kx - 14, 390, XR, 450, kb); text(ctx, 'white', L.white, kx, 431, { size: 30, w: 600, a: kb });
    }
  }
  // capa 1
  if (t >= TT.h1 - .2 && t < TT.whip[0] + .2) {
    const a = win(t, TT.h1 - .2, TT.whip[0] + .2, .1, .3), bb = info?.bbox?.h1;
    if (bb) U.targetBox(ctx, TH, bb, eo(seg(t, TT.h1 - .2, TT.h1)), { tag: L.h1, alpha: a, flash: t > TT.h1 && t < TT.h1 + .125 });
    const fa = a * seg(t, TT.formula[0], TT.formula[0] + .4);
    plateBox(ctx, XL - 20, 270, XR + 20, 470, fa);
    text(ctx, 'fml', L.formula, 540, 390, { size: 104, w: 300, ls: 4, a: fa, align: 'center', roll: seg(t, TT.formula[0], TT.formula[0] + .8), frame: fr });
    text(ctx, 'fmlS', L.formulaSub, 540, 445, { size: 32, w: 500, a: fa, col: TH.line, align: 'center' });
  }
  // la última neurona abierta
  if (t >= TT.whip[1] && t < TT.erase[0] + .3) {
    const a = 1 - seg(t, TT.erase[0] - .3, TT.erase[0] + .3), bb = info?.bbox?.out;
    if (bb) U.targetBox(ctx, TH, bb, eo(seg(t, TT.whip[1], TT.whip[1] + .2)), { tag: L.last, alpha: a * (1 - seg(t, TT.zRoll[0], TT.zRoll[0] + .3)), flash: t > TT.whip[1] + .2 && t < TT.whip[1] + .325 });
    const h2a = prj(...H2[0]), h2b = prj(...H2[1]), o = prj(...OUT);
    const xa = a * seg(t, TT.xs, TT.xs + .3), xb = a * seg(t, TT.xs + .6, TT.xs + .9);
    callout(ctx, 'x1', h2a, L.x[0], h2a[0] + 46, h2a[1] + 4, xa, { pulse: seg(t, TT.xs, TT.xs + .6) });
    callout(ctx, 'x2', h2b, L.x[1], h2b[0] - 46, h2b[1] + 4, xb, { align: 'right', pulse: seg(t, TT.xs + .6, TT.xs + 1.2) });
    const ma = [(h2a[0] + o[0]) / 2, (h2a[1] + o[1]) / 2], mb = [(h2b[0] + o[0]) / 2, (h2b[1] + o[1]) / 2];
    callout(ctx, 'w1', ma, L.w[0], ma[0] - 70, ma[1] + 6, a * seg(t, TT.ws, TT.ws + .3), { align: 'right', col: TH.hi });
    callout(ctx, 'w2', mb, L.w[1], mb[0] + 70, mb[1] + 6, a * seg(t, TT.ws + .5, TT.ws + .8), {});
    callout(ctx, 'b', [o[0], o[1] - 4], L.b, o[0] + 120, o[1] - 120, a * seg(t, TT.bias, TT.bias + .3), {});
    // z = 2 · 0.4 + 3 · (−0.2) + 0.1 = 0.3
    const za = a * seg(t, TT.zRoll[0] - .4, TT.zRoll[0]) * (1 - seg(t, 35.6, 36.0));
    if (za > 0) {
      plateBox(ctx, XL - 20, 264, XR + 20, 520, za);
      text(ctx, 'zc', L.zCalc, 540, 324, { size: 44, w: 500, a: za, align: 'center', col: TH.line });
      const locked = t >= TT.zRoll[1], col = locked ? (t < TT.zRoll[1] + .125 ? TH.hi(za) : TH.acc(za)) : TH.line(.85 * za);
      text(ctx, 'zn', 'z =', 420, 470, { size: 88, w: 300, a: za, align: 'right' });
      num(ctx, 'zv', L.zVal, 450, 470, { size: 120, w: 300, a: za, roll: seg(t, TT.zRoll[0], TT.zRoll[1]), frame: fr, col });
    }
    // sigmoide y error
    const sa = a * seg(t, TT.sig[0], TT.sig[0] + .4);
    if (sa > 0) {
      plateBox(ctx, XL - 20, 264, XR + 20, 760, sa);
      text(ctx, 'sgN', L.sigName, XL, 306, { size: 28, w: 600, ls: 3, a: sa, col: TH.line });
      formula(ctx, 'sgF', 'σ(z) = 1 / (1 + e^(−z))', XR, 306, { size: 34, a: sa, align: 'right' });
      // a la derecha
      ctx.save(); ctx.font = font(500, 34); const fw = ctx.measureText('σ(z) = 1 / (1 + e').width; ctx.restore();
      plot(ctx, XL + 40, 350, XR - XL - 80, 190, sa, t);
      const s1 = seg(t, TT.sigRoll[0], TT.sigRoll[1]), l1 = t >= TT.sigRoll[1];
      text(ctx, 'sgE', 'σ(0.3) =', 620, 626, { size: 44, w: 500, a: sa * clamp(s1 * 3), align: 'right' });
      num(ctx, 'sgV', L.sigVal, 640, 630, { size: 66, w: 300, a: sa * clamp(s1 * 3), roll: s1, frame: fr, col: l1 ? (t < TT.sigRoll[1] + .125 ? TH.hi(sa) : TH.acc(sa)) : TH.line(.85 * sa) });
      const s2 = seg(t, TT.lossRoll[0], TT.lossRoll[1]), l2 = t >= TT.lossRoll[1], la = sa * clamp(s2 * 3);
      text(ctx, 'lsN', L.lossName, XL, 726, { size: 28, w: 600, ls: 3, a: la, col: TH.line });
      text(ctx, 'lsF', 'L = (1 − 0.574)² =', 620, 722, { size: 44, w: 500, a: la, align: 'right' });
      num(ctx, 'lsV', L.lossVal, 640, 726, { size: 66, w: 300, a: la, roll: s2, frame: fr, col: l2 ? (t < TT.lossRoll[1] + .125 ? TH.hi(la) : TH.acc(la)) : TH.line(.85 * la) });
    }
  }
  // fichas
  const off = 1 - seg(t, TT.end[0] + 1.6, TT.end[0] + 2.4);
  chipRow(ctx, t, [
    { label: 'z', value: t >= TT.outRoll2[1] ? L.zNew : L.zVal, k: seg(t, 36, 36.4), a: seg(t, 36, 36.2) * off },
    { label: 'σ(z)', value: t >= TT.outRoll2[1] ? L.sigNew : L.sigVal, k: seg(t, 45, 45.4), a: seg(t, 45, 45.2) * off },
    { label: 'ERROR', value: t >= TT.outRoll2[1] ? L.lossNow : L.lossVal, k: seg(t, 45.3, 45.7), a: seg(t, 45.3, 45.5) * off },
  ]);
  // final
  if (t >= TT.end[0] + .8) {
    const a = seg(t, TT.end[0] + .8, TT.end[0] + 1.3);
    plateBox(ctx, XL - 20, 250, XR + 20, 520, a);
    text(ctx, 'eT', L.endTitle, 540, 352, { size: 92, w: 300, ls: 6, a, align: 'center', maxW: XR - XL, roll: seg(t, TT.end[0] + 1.2, TT.end[0] + 2.2), frame: fr });
    text(ctx, 'eS', L.endSub, 540, 410, { size: 34, w: 500, a, align: 'center', col: TH.line });
    text(ctx, 'eN', L.endNote, 540, 466, { size: 26, w: 500, a, align: 'center', col: TH.line });
    const bb = info?.bbox?.input;
    if (bb) {
      const k = seg(t, TT.end[0] + 2.4, TT.end[0] + 2.6);
      U.targetBox(ctx, TH, [bb[0], bb[1] + 30, bb[2], bb[3]], eo(k), { tag: 'MISHI · GATO ' + L.out1 + ' %', alpha: k, pad: 8, flash: t > TT.end[0] + 2.6 && t < TT.end[0] + 2.725 });
    }
  }
}
function axTag(ctx, id, s, x, y, a) {          // rótulo de eje con placa, siempre dentro de la franja segura
  const cx = clamp(x, XL + 30, XR - 30), cy = clamp(y, 260, 1590);
  plateBox(ctx, cx - 30, cy - 30, cx + 30, cy + 22, a);
  text(ctx, id, s, cx, cy + 10, { size: 36, w: 600, a, col: TH.line, align: 'center' });
}
function mountainHud(ctx, t, prj, fr, A) {
  const a0 = A * seg(t, TT.mtn[0] + .8, TT.mtn[0] + 1.4);
  if (a0 > 0) {
    text(ctx, 'mtnT', L.mtn, 540, 300, { size: 40, w: 600, ls: 6, a: a0, align: 'center', col: TH.line, roll: seg(t, TT.mtn[0] + .8, TT.mtn[0] + 1.8), frame: fr });
    const aw1 = prj(MS + .1, MY0 - .06, MS + .08), aw2 = prj(-MS - .08, MY0 - .06, -MS - .1), al = prj(-MS - .08, MY0 + MH + .1, MS + .08);
    const axa = A * seg(t, TT.mtn[1], TT.mtn[1] + .4);
    axTag(ctx, 'aw1', L.axW1, aw1[0] + 30, aw1[1], axa);
    axTag(ctx, 'aw2', L.axW2, aw2[0] - 30, aw2[1], axa);
    axTag(ctx, 'aL', L.axL, al[0] - 30, al[1], axa);
  }
  // la bolita y su camino
  const steps = D.PATH; let k = 0;
  for (let i = 1; i <= D.STEPS; i++) if (t >= D.stepT(i)) k = i;
  const kNext = Math.min(D.STEPS, k + 1), u = k < D.STEPS ? eio(seg(t, D.stepT(kNext) - .32, D.stepT(kNext))) : 0;
  const wNow = k < D.STEPS && t >= D.stepT(1) - .32 ? [lerp(steps[k].w[0], steps[kNext].w[0], u), lerp(steps[k].w[1], steps[kNext].w[1], u)] : steps[k].w;
  const ba = A * seg(t, TT.ball - .4, TT.ball);
  if (ba > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // camino ya recorrido
    ctx.strokeStyle = TH.hi(.8 * ba); ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= k; i++) { const q = prj(...mpt(steps[i].w)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
    const qn = prj(...mpt(wNow)); ctx.lineTo(qn[0], qn[1]); ctx.stroke();
    for (let i = 0; i <= k; i++) { const q = prj(...mpt(steps[i].w)); ctx.fillStyle = TH.line(.9 * ba); ctx.fillRect(q[0] - 3, q[1] - 3, 6, 6); }
    // la flecha: hacia donde baja (−∂L/∂w)
    const aa = ba * seg(t, TT.arrow, TT.arrow + .4) * (1 - seg(t, D.stepT(D.STEPS) - .3, D.stepT(D.STEPS)));
    if (aa > 0) {
      const g = D.grad(wNow), n = Math.hypot(...g), len = .16, w2 = [wNow[0] - g[0] / n * len, wNow[1] - g[1] / n * len];
      const pts = Array.from({ length: 9 }, (_, i) => prj(...mpt([lerp(wNow[0], w2[0], i / 8), lerp(wNow[1], w2[1], i / 8)])));
      ctx.strokeStyle = TH.hi(aa); ctx.lineWidth = 3.2; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
      const e = pts[8], d = pts[6], an = Math.atan2(e[1] - d[1], e[0] - d[0]);
      ctx.fillStyle = TH.hi(aa); ctx.beginPath(); ctx.moveTo(e[0] + Math.cos(an) * 12, e[1] + Math.sin(an) * 12);
      ctx.lineTo(e[0] + Math.cos(an + 2.5) * 16, e[1] + Math.sin(an + 2.5) * 16); ctx.lineTo(e[0] + Math.cos(an - 2.5) * 16, e[1] + Math.sin(an - 2.5) * 16); ctx.closePath(); ctx.fill();
    }
    const q = prj(...mpt(wNow)), pulse = k > 0 ? 1 - seg(t, D.stepT(k), D.stepT(k) + .4) : 0;
    const gr = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 30); gr.addColorStop(0, TH.hi(.9 * ba)); gr.addColorStop(1, TH.hi(0));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(q[0], q[1], 30, 0, TAU); ctx.fill();
    ctx.fillStyle = TH.hi(ba); ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, TAU); ctx.fill();
    if (pulse > 0) { ctx.strokeStyle = TH.line(.8 * ba * pulse); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(q[0], q[1], 14 + 30 * (1 - pulse), 0, TAU); ctx.stroke(); }
    ctx.restore();
    const q0 = prj(...mpt(steps[0].w));
    const lk = seg(t, TT.ball - .2, TT.ball);
    if (t < D.stepT(1) - .4) U.targetBox(ctx, TH, [q0[0] - 16, q0[1] - 16, q0[0] + 16, q0[1] + 16], eo(lk), { tag: L.ball, alpha: ba * (1 - seg(t, D.stepT(1) - .8, D.stepT(1) - .4)), pad: 14, flash: t > TT.ball && t < TT.ball + .125 });
  }
  // la regla del paso y el contador
  const ra = A * seg(t, TT.rule[0], TT.rule[0] + .4);
  if (ra > 0) {
    plateBox(ctx, XL - 20, 340, XR + 20, 500, ra);
    formula(ctx, 'rule', L.rule, 540, 400, { size: 46, a: ra, align: 'center' });
    const ek = seg(t, TT.etaRoll[0], TT.etaRoll[1]), el = t >= TT.etaRoll[1];
    text(ctx, 'etaN', 'η =', 530, 470, { size: 46, w: 500, a: ra, align: 'right', col: TH.line });
    num(ctx, 'etaV', String(D.ETA), 550, 472, { size: 56, w: 400, a: ra, roll: ek, frame: fr, col: el ? (t < TT.etaRoll[1] + .125 ? TH.hi(ra) : TH.acc(ra)) : TH.line(.85 * ra) });
  }
  const ca = A * seg(t, TT.steps[0] - .3, TT.steps[0]);
  if (ca > 0) {
    plateBox(ctx, XL - 20, 520, XR + 20, 640, ca);
    const kk = String(k).padStart(2, '0');
    text(ctx, 'stepN', L.step + ' ' + kk + ' / ' + D.STEPS, XL, 596, { size: 40, w: 600, ls: 3, a: ca, col: TH.line, pass: true });
    const done = t >= TT.final, Ls = steps[k].L.toFixed(3);
    text(ctx, 'stepLn', 'L =', 700, 600, { size: 46, w: 500, a: ca, align: 'right' });
    num(ctx, done ? 'stepLf' : 'stepL', Ls, 720, 604, { size: 66, w: 300, a: ca, roll: k ? seg(t, D.stepT(k) - .05, D.stepT(k) + .15) : 1, frame: fr, pass: !done, col: done ? (t < TT.final + .125 ? TH.hi(ca) : TH.acc(ca)) : TH.line(.9 * ca) });
  }
}
function tokenHud(ctx, t, prj, fr, A) {
  const va = A * seg(t, TT.vecs[0], TT.vecs[0] + .4);
  plateBox(ctx, XL - 20, 300, XR + 20, 380, va);
  text(ctx, 'vec', L.vec, 540, 354, { size: 38, w: 600, ls: 3, a: va, align: 'center', roll: seg(t, TT.vecs[0], TT.vecs[0] + .8), frame: fr });
  const aa = A * seg(t, TT.attn[0], TT.attn[0] + .4);
  plateBox(ctx, XL - 20, 410, XR + 20, 490, aa);
  text(ctx, 'attn', L.attn, 540, 464, { size: 36, w: 600, ls: 2, a: aa, align: 'center', maxW: XR - XL - 20, roll: seg(t, TT.attn[0], TT.attn[0] + .8), frame: fr, col: TH.line });
  const tops = [];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  L.tokens.forEach((w, i) => {
    const g = seg(t, TT.vecs[0] + i * .25, TT.vecs[0] + i * .25 + .8);
    for (let k = 0; k < 6; k++) {
      const kk = clamp(g * 6 - k); if (kk <= 0) continue;
      const y = TOKY + .1 + k * .085, c = prj(TOKX[i], y, TOKZ), c2 = prj(TOKX[i], y + .07, TOKZ), s = Math.abs(c[1] - c2[1]) / 2 + 2;
      const v = VEC[i][k];
      ctx.strokeStyle = TH.line(.8 * A * kk); ctx.lineWidth = 1.3; ctx.strokeRect(c[0] - s * 1.6, (c[1] + c2[1]) / 2 - s, s * 3.2, s * 2);
      ctx.fillStyle = `hsla(${HUE},80%,${50 + 30 * Math.abs(v)}%,${A * kk * (.15 + .6 * Math.abs(v))})`;
      const bw = s * 1.5 * v; ctx.fillRect(c[0] + Math.min(0, bw), (c[1] + c2[1]) / 2 - s + 3, Math.abs(bw), s * 2 - 6);
    }
    tops.push(prj(TOKX[i], TOKY + .1 + 6 * .085 + .02, TOKZ));
  });
  // atención: arcos entre las palabras, más brillantes cuanto mayor el producto escalar
  if (aa > 0) {
    const k = seg(t, TT.attn[0], TT.attn[0] + 2.2);
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const wgt = (ATT[i][j] + ATT[j][i]) / 2, h = .18 + .12 * (j - i);
      const P3 = s => [lerp(TOKX[i], TOKX[j], s), TOKY + .1 + 6 * .085 + .02 + Math.sin(Math.PI * s) * h, TOKZ];
      ctx.strokeStyle = TH.line(aa * (.15 + 1.4 * wgt)); ctx.lineWidth = 1 + 5 * wgt; ctx.beginPath();
      const n = Math.round(40 * k); for (let s = 0; s <= n; s++) { const q = prj(...P3(s / 40)); s ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
      if (k >= 1) { const s = ((t * .5 + i * .3 + j * .17) % 1), q = prj(...P3(s)); ctx.fillStyle = TH.hi(aa * .9); ctx.fillRect(q[0] - 2, q[1] - 2, 4, 4); }
    }
  }
  ctx.restore();
  L.tokens.forEach((w, i) => {
    const b = prj(TOKX[i], TOKY - .05, TOKZ + .08), a = A * seg(t, TT.tokens[0] + .6 + i * .15, TT.tokens[0] + 1 + i * .15);
    ctx.save(); ctx.font = font(600, 34); const tw = ctx.measureText(w).width; ctx.restore();
    plateBox(ctx, b[0] - tw / 2 - 12, b[1] + 22, b[0] + tw / 2 + 12, b[1] + 70, a);
    text(ctx, 'tok' + i, w, b[0], b[1] + 58, { size: 34, w: 600, ls: 1, a, align: 'center' });
  });
}
const STATUS = [[0, 'ESCANEO'], [9.2, 'ENTRADA'], [21.2, 'CAPA 1'], [27.5, 'NEURONA'], [36.2, 'ACTIVACIÓN'], [45, 'ERROR'], [56, 'DESCENSO'], [64, 'PESOS NUEVOS'], [73.6, 'PALABRAS'], [84.2, 'FIN']];
function chrome(ctx, t) {
  const a = t > D.DUR - 1.2 ? 1 - seg(t, D.DUR - 1.2, D.DUR - .2) : seg(t, 0, .6);
  U.chrome(ctx, W, H, TH, { alpha: a * .8 });
  let st = STATUS[0][1]; for (const [s, n] of STATUS) if (t >= s) st = n;
  text(ctx, 'tl', 'ZK-25 // IA', XL, 112, { size: 22, w: 400, mono: true, a: a * .9, col: TH.line, pass: true });
  text(ctx, 'tr', st + ' · ' + String(Math.floor(t * FPS)).padStart(4, '0'), XR, 112, { size: 22, w: 400, mono: true, a: a * .9, col: TH.line, align: 'right', pass: true });
}
const SUB_Y = 1600;
function subtitle(ctx, t) {
  for (const n of D.NARR) if (t >= n.t0 - .15 && t < n.t1 + .15) {
    const a = Math.min(seg(t, n.t0 - .15, n.t0), 1 - seg(t, n.t1, n.t1 + .15));
    U.subtitle(ctx, W, H, TH, n.text, a, { y: SUB_Y, maxW: 700, x: 540, t });
  }
}

// ---------------- Página ----------------
const cv = document.getElementById('c'), g = cv.getContext('2d');
const acc = Object.assign(document.createElement('canvas'), { width: W, height: H }), sub = Object.assign(document.createElement('canvas'), { width: W, height: H });
function render(t) {                                // barrido con desenfoque de movimiento solo en el látigo de cámara
  const whip = t > TT.whip[0] && t < TT.whip[1] ? Math.sin(Math.PI * seg(t, TT.whip[0], TT.whip[1])) : 0;
  if (whip < .05) return frameAt(g, t);
  const N = 5, a = acc.getContext('2d'), s = sub.getContext('2d');
  for (let k = 0; k < N; k++) { frameAt(s, t + (k / (N - 1) - .5) / 48, t); a.globalAlpha = 1 / (k + 1); a.drawImage(sub, 0, 0); }
  frameAt(s, t); const keep = TXT; g.globalAlpha = 1; g.drawImage(acc, 0, 0); TXT = keep;
}
const EV = [];
const ev = (type, t, o = {}) => EV.push({ type, t: +t.toFixed(3), ...o });
[[0, 3.6, 0], [TT.erase[0], 1.5, 1], [TT.mtn[0], 3, 0], [TT.mtnOff[0], 1.4, 1], [TT.back[0], 2, 0], [TT.off2[0], 1.4, 1], [TT.tokens[0], 2, 0], [TT.tokOff[0], 1.4, 1], [TT.end[0], 1.4, 0]].forEach(([t, d, down]) => ev('scan', t, { d, down }));
[[TT.outBox + .2, 1], [TT.outRoll[1], 2], [TT.down[1] + .2, 1], [TT.matRoll[1], 2], [TT.h1, 1], [TT.whip[1] + .2, 1], [TT.zRoll[1], 2], [TT.sigRoll[1], 2], [TT.lossRoll[1], 2], [TT.ball, 1], [TT.etaRoll[1], 2], [TT.final, 3], [TT.solid[0] + .2, 1], [TT.outRoll2[1], 3], [TT.end[0] + 2.6, 1]].forEach(([t, k]) => ev('lock', t, { k }));
[TT.outRoll, [TT.title[0] + .3, TT.title[0] + 1.6], TT.matRoll, [TT.formula[0], TT.formula[0] + .8], TT.zRoll, TT.sigRoll, TT.lossRoll, TT.etaRoll, TT.outRoll2, [TT.end[0] + 1.2, TT.end[0] + 2.2]].forEach(([a, b]) => ev('roll', a, { d: +(b - a).toFixed(3) }));
ev('whip', TT.whip[0], { d: TT.whip[1] - TT.whip[0] }); ev('open', TT.open[0], { d: 1 }); ev('open', 44.2, { d: .8, close: 1 });
[[TT.xs, 0], [TT.xs + .6, 1], [TT.ws, 2], [TT.ws + .5, 3], [TT.bias, 4]].forEach(([t, n]) => ev('ping', t, { n }));
for (let k = 1; k <= D.STEPS; k++) ev('step', D.stepT(k), { k, L: +D.PATH[k].L.toFixed(4) });
ev('silence', TT.silence[0], { d: TT.silence[1] - TT.silence[0] }); ev('drop', TT.mtn[0]);
ev('ignite', TT.solid[0], { d: TT.solid[1] - TT.solid[0] });
L.tokens.forEach((_, i) => ev('ping', TT.tokens[0] + .6 + i * .15, { n: 5 + i })); ev('attn', TT.attn[0], { d: TT.attn[1] - TT.attn[0] });
[[36, 0], [45, 1], [45.3, 2]].forEach(([t, i]) => ev('dock', t, { i }));
ev('end', TT.end[0]); ev('outro', D.DUR - 3.2);
for (const n of D.NARR) ev('narr', n.t0, { d: +(n.t1 - n.t0).toFixed(3), text: n.text });
EV.sort((a, b) => a.t - b.t);

await Promise.all(['300', '400', '500', '600'].flatMap(w => [document.fonts.load(`${w} 40px Rajdhani`, 'AzÁ09'), document.fonts.load(`${w} 40px RajMath`, 'σηθ²₁₂ᶻ')]).concat([document.fonts.load('20px ShareTechMono', 'A0')]));
window.DUR = D.DUR;
window.EV = EV;
window.render = t => render(t);
window.TEXTS = t => { render(t); return TXT; };
render(0);
window.READY = true;
