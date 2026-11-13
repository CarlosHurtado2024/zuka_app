// kit.js: lecciones en estilo Tablet Sketch Explainer sobre engine.js (Lemo-Opuscar, MIT).
// Una película = una lista de tiempos (beat). Cada tiempo trae una frase de narración y un dibujo; el kit
// reparte el tiempo (lo que dure leer la frase o lo que tarde el lápiz, lo que sea más), baja la cámara por la
// hoja, cambia de hoja cuando se llena (la hoja se va de lado y llega una limpia) y arma la narración (.srt).
// Los signos que Caveat no trae (ℕ ℤ ℚ ℝ ∈ ∉ ⊆ ∪ ∩ ∀ π √ ∞) se dibujan a lápiz.
let CURPAGE = 0;
const PAGE_T = [0];
const pageAt = t => { let i = 0; while (i + 1 < PAGE_T.length && t >= PAGE_T[i + 1]) i++; return i; };
const NARR = [];
const KIT = { t: 0, y: 150, cam: { x: 600, y: 920, z: 1, r: 0 } };
const COL = { mustard: '#f1c04f', coral: '#dc6a4c', blue: '#86aee0', blueDk: '#5f88c4', green: '#a9c79a', greenDk: '#7fa36f', honey: '#eeb24a',
  sand: '#f3d9a4', pink: '#f0b5a4', sky: '#c4dbe6', lilac: '#c9b8e0', gray: '#d8cfc2', red: '#e07a5f', leaf: '#8fb47c' };
const SPEECH = 2.5, ZDEF = 1.14, CX = 596;                                   // palabras por segundo de una voz tranquila
const sayDur = s => Math.max(1.9, s.split(/\s+/).filter(Boolean).length / SPEECH + 0.55);

function camKey(t, x, y, z, r, k) { CAM.push({ t: +t.toFixed(4), x, y, z, r, k }); }
// la cámara viaja a (x, y, z) entre t y t + d; antes queda quieta donde estaba
function camTo(t, x, y, z = 1, r = 0, d = 0.8, k = 'g') {
  const c = KIT.cam; if (Math.abs(c.x - x) < 1 && Math.abs(c.y - y) < 1 && Math.abs(c.z - z) < 0.005 && Math.abs(c.r - r) < 0.05) return;
  camKey(t, c.x, c.y, c.z, c.r, 'd'); camKey(t + d, x, y, z, r, k); KIT.cam = { x, y, z, r };
}
// hoja nueva: la hoja llena se va hacia la izquierda, se borra y llega una limpia desde la derecha
function newPage() {
  const t = KIT.t, c = KIT.cam;
  camKey(t, c.x, c.y, c.z, c.r, 'd');
  camKey(t + 0.55, c.x + 1900, c.y, c.z, c.r, 'i');
  OCC([[X0, Y0], [X0 + DW, Y0], [X0 + DW, Y0 + DH], [X0, Y0 + DH]], t + 0.56);
  CURPAGE++; PAGE_T.push(t + 0.56);
  const cy = H / 2 / ZDEF - 60;
  camKey(t + 0.57, CX - 1900, cy, ZDEF, 0, 'd');
  camKey(t + 1.25, CX, cy, ZDEF, 0, 'p');
  KIT.cam = { x: CX, y: cy, z: ZDEF, r: 0 };
  SFX.push({ t, type: 'gesture', d: 1.25, pan: 0 });
  KIT.t = t + 1.3; KIT.y = 150;
}

// ---------- un tiempo de la película ----------
// say: una frase (o varias, en orden); h: alto que ocupa en la hoja; draw(B) dibuja. o: {z, page, cy, idea, hold}
function beat(say, h, draw, o = {}) {
  const says = Array.isArray(say) ? say : say ? [say] : [];
  if (o.page || KIT.y + h > PAGE_H - 80) newPage();
  const t0 = KIT.t, y = KIT.y;
  // la cámara: el tiempo nuevo en el tercio de arriba del cuadro, sin mostrar arriba de la hoja
  const z = o.z || ZDEF, half = H / 2 / z;
  const cy = o.cy != null ? o.cy : Math.max(half - 60, Math.min(PAGE_H - half + 120, y + h / 2 - 200));
  camTo(t0, o.cx || CX, cy, z, o.r ?? (R() - 0.5) * 1.6, 0.85);
  // la narración: frases seguidas
  const cues = []; let tc = t0 + 0.35;
  for (const s of says) { const d = sayDur(s); cues.push([tc, tc + d, s]); tc += d + 0.25; }
  const B = mkB(y, t0 + 0.5, cues);
  draw(B);
  const end = Math.max(cues.length ? cues[cues.length - 1][1] + 0.3 : 0, B.t + 0.3, B.readUntil, t0 + (o.min || 1.6)) + (o.hold || 0);
  cues.forEach(q => NARR.push([+q[0].toFixed(2), +q[1].toFixed(2), q[2]]));
  if (o.idea) SFX.push({ t: t0 + 0.4, type: 'idea', d: 0, pan: 0 });
  KIT.t = end; KIT.y = y + h + (o.gap ?? 90);
  return B;
}

// ---------- el lápiz de un tiempo ----------
mctx.textBaseline = 'alphabetic';
const textW = (s, size, f = 'CM') => { mctx.font = `${size}px ${f}`; return mctx.measureText(s).width; };
function mkB(y, t, cues) {
  const B = { y, t, cues, readUntil: 0 };
  B.at = i => { if (cues[i]) B.t = Math.max(B.t, cues[i][0] + 0.1); return B; };       // dibujar cuando empieza la frase i
  B.wait = s => { B.t += s; return B; };
  B.Y = dy => y + dy;
  B.txt = (s, x, dy, size = 64, o = {}) => {
    if (size < 70) size = Math.round(size * 1.12);
    const f = o.f || 'CM', e = TXT(s, x, y + dy, size, { f, layer: o.col, cps: o.cps || 1500, jit: o.jit }, B.t);
    B.t = e.t0 + e.d + (o.gap ?? 0.08);
    B.readUntil = Math.max(B.readUntil, e.t0 + e.d + s.replace(/\s/g, '').length / 15 + 1.7);
    return { x, y: y + dy, w: textW(s, size, f), size, x1: x + textW(s, size, f) };
  };
  B.big = (s, x, dy, size = 96, o = {}) => B.txt(s, x, dy, size, { f: 'CB', ...o });
  B.mid = (s, cx, dy, size = 64, o = {}) => B.txt(s, cx - textW(s, size, o.f || 'CM') / 2, dy, size, o);
  B.pen = (pts, o = {}, d) => { B.t = PEN(pts, { w: 2.6, ...o }, B.t, d ?? Math.max(0.1, plen(pts) / 1100)) + 0.03; return B; };
  B.light = (pts, d) => B.pen(pts, { layer: 'light', w: 1.4, p: 0.55 }, d);
  B.coral = (pts, o = {}, d) => B.pen(pts, { layer: 'coral', w: 4, ...o }, d);
  B.arrow = (pts, o = {}, d) => { B.t = arrow(pts, { w: 4.4, ...o }, B.t, d ?? Math.max(0.25, plen(pts) / 900)) + 0.04; return B; };
  B.circ = (cx, cy, r, o = {}, d) => { B.t = circleStroke(cx, y + cy, r, { w: 2.6, ...o }, B.t, d ?? Math.max(0.15, r / 300)) + 0.03; return B; };
  B.rect = (x, dy, w, h, o = {}) => B.pen([[x, y + dy], [x + w, y + dy - 2], [x + w + 2, y + dy + h], [x - 1, y + dy + h + 1], [x, y + dy]], { smooth: false, ...o });
  B.fill = (poly, col, o = {}, d) => { B.t = BLOB(poly, col, { dx: 7, dy: 6, ...o }, B.t, d ?? 0.3) + 0.03; return B; };
  B.fillRect = (x, dy, w, h, col, o = {}) => B.fill([[x, y + dy], [x + w, y + dy], [x + w, y + dy + h], [x, y + dy + h]], col, o, o.d ?? Math.min(0.5, 0.12 + w * h / 400000));
  B.fillCirc = (cx, cy, r, col, o = {}) => B.fill(ell(cx, y + cy, r, o.ry ?? r, 0, 0, TAU, 28), col, { dx: 4, dy: 3, sp: 6, ...o }, o.d ?? Math.max(0.08, r / 400));
  B.hl = (b, col = COL.mustard) => B.fillRect(b.x - 12, b.y - b.size * 0.68 - y, b.w + 24, b.size * 0.88, col, { a: 0.8, sp: 12 });   // marcador detrás de un texto
  B.ul = b => B.coral([[b.x - 6, b.y + b.size * 0.16], [b.x + b.w / 2, b.y + b.size * 0.12], [b.x + b.w + 8, b.y + b.size * 0.18]], { wob: 1 });
  B.idea = () => { SFX.push({ t: B.t, type: 'idea', d: 0, pan: 0 }); return B; };
  // una fórmula: cadenas y signos a lápiz. Devuelve {x0, x1, at: centros de cada pieza}
  B.m = (toks, x, dy, size = 72, o = {}) => mathLine(B, toks, x, y + dy, size, o);
  B.mmid = (toks, cx, dy, size = 72, o = {}) => mathLine(B, toks, cx - mathW(toks, size) / 2, y + dy, size, o);
  // recta numérica: de x0 a x1 en dy; valores de v0 a v1; ticks cada paso; etiquetas
  B.axis = (x0, x1, dy, v0, v1, o = {}) => {
    const yy = y + dy, X = v => x0 + 30 + (v - v0) / (v1 - v0) * (x1 - x0 - 60);
    B.pen([[x0, yy], [x1, yy]], { w: 2.8, ta: 0.04, tb: 0.04 }, o.d ?? 0.5);
    for (const sg of [-1, 1]) { const ex = sg > 0 ? x1 : x0; B.pen([[ex - sg * 22, yy - 13], [ex, yy], [ex - sg * 22, yy + 13]], { w: 2.4, smooth: false }, 0.06); }
    const st = o.step ?? 1, sz = o.size ?? 44;
    if (o.ticks !== false) for (let v = v0; v <= v1 + 1e-9; v += st) B.pen([[X(v), yy - 14], [X(v), yy + 14]], { w: 2.3, ta: 0.3, tb: 0.3 }, 0.035);
    for (const v of (o.labels ?? [])) { const s = String(v).replace('-', '−'); B.mid(s, X(v), dy + 62, sz, { cps: 900, gap: 0.02 }); }
    return X;
  };
  B.dot = (x, dy, col = COL.coral, r = 13) => { B.fillCirc(x, dy, r, col, { a: 1, d: 0.08 }); return B.circ(x, dy, r, { w: 2.2 }, 0.08); };
  return B;
}

// ---------- signos dibujados ----------
const SYMW = { to: 0.62, iff: 0.8, empty: 0.5, in: 0.52, nin: 0.52, sub: 0.52, cup: 0.5, cap: 0.5, all: 0.56, pi: 0.6, inf: 0.8, ex: 0.32 };
function tokW(tk, size) {
  if (typeof tk === 'string') return textW(tk, size, 'CB');
  if (tk.dbl) return 0.56 * size;
  if (tk.sqrt != null) return 0.42 * size + textW(tk.sqrt, size, 'CB') + 0.08 * size;
  if (tk.frac) return Math.max(textW(tk.frac[0], size * 0.78, 'CB'), textW(tk.frac[1], size * 0.78, 'CB')) + 0.2 * size;
  if (tk.sup != null) return textW(tk.sup, size * 0.6, 'CB');
  if (tk.bar != null) return textW(tk.bar, size, 'CB');
  return (SYMW[tk.s] ?? 0.5) * size;
}
const tight = tk => tk && typeof tk === 'object' && (tk.sup != null || tk.tight);
const mathW = (toks, size) => toks.reduce((a, tk, i) => a + tokW(tk, size) + (i && !tight(tk) ? size * 0.26 : 0), 0);
function mathLine(B, toks, x, y, size, o = {}) {
  const cps = o.cps || 1200, lay = o.col, at = []; let cx = x;
  const sw = 0.07 * size;
  const P = (pts, w = sw, smooth) => { B.t = PEN(pts, { w: w / 1.18, layer: lay, ta: 0.15, tb: 0.15, wob: 0.3, smooth }, B.t, Math.max(0.06, plen(pts) / 900)) + 0.02; };
  const T = (s, xx, yy, sz) => { const e = TXT(s, xx, yy, sz, { f: 'CB', layer: lay, cps, jit: 0.3 }, B.t); B.t = e.t0 + e.d + 0.04; B.readUntil = Math.max(B.readUntil, e.t0 + e.d + s.length / 15 + 1.7); };
  toks.forEach((tk, i) => {
    if (i && !tight(tk)) cx += size * 0.26;
    const w = tokW(tk, size), s = size;
    if (typeof tk === 'string') T(tk, cx, y, s);
    else if (tk.dbl) {                        // letra de doble trazo, a lápiz: la letra y un trazo paralelo pegado
      const L = tk.dbl, a = cx + 0.04 * s, b = cx + 0.5 * s, top = y - 0.66 * s, d2 = 0.1 * s, q = sw * 0.85;
      if (L === 'N') { P([[a, y], [a, top], [b, y], [b, top]], sw, false); P([[a + d2, top + 0.08 * s], [a + d2, y]], q, false); }
      else if (L === 'Z') { P([[a, top], [b, top], [a, y], [b, y]], sw, false); P([[b - d2 * 1.2, top + 0.02 * s], [a + d2 * 0.2, y - 0.04 * s]], q, false); }
      else if (L === 'R') { P([[a, y], [a, top], [a + 0.3 * s, top], ...ell(a + 0.3 * s, top + 0.17 * s, 0.17 * s, 0.17 * s, 0, -Math.PI / 2, Math.PI / 2, 10).slice(1), [a, top + 0.34 * s], [b, y]], sw, false); P([[a + d2, top + 0.02 * s], [a + d2, y]], q, false); }
      else if (L === 'I') { P([[a + 0.06 * s, top], [a + 0.36 * s, top]], sw, false); P([[a + 0.06 * s, y], [a + 0.36 * s, y]], sw, false); P([[a + 0.16 * s, top], [a + 0.16 * s, y]], sw, false); P([[a + 0.26 * s, top], [a + 0.26 * s, y]], q, false); }
      else if (L === 'Q') { P(ell(cx + 0.27 * s, y - 0.33 * s, 0.23 * s, 0.33 * s, 0, -1.2, -1.2 + TAU * 1.02, 26), sw); P([[cx + 0.3 * s, y - 0.1 * s], [cx + 0.54 * s, y + 0.08 * s]], sw, false); P(ell(cx + 0.27 * s, y - 0.33 * s, 0.13 * s, 0.3 * s, 0, 1.9, 4.4, 12), q); }
    } else if (tk.sqrt != null) {
      const ww = textW(tk.sqrt, s, 'CB');
      P([[cx, y - s * 0.3], [cx + s * 0.1, y - s * 0.36], [cx + s * 0.22, y + s * 0.02], [cx + s * 0.36, y - s * 0.78], [cx + s * 0.44 + ww + s * 0.06, y - s * 0.8]], sw, false);
      T(tk.sqrt, cx + s * 0.44, y, s);
    } else if (tk.frac) {
      const fs = s * 0.78, w0 = textW(tk.frac[0], fs, 'CB'), w1 = textW(tk.frac[1], fs, 'CB');
      T(tk.frac[0], cx + (w - w0) / 2, y - s * 0.5, fs);
      P([[cx, y - s * 0.34], [cx + w, y - s * 0.35]], sw);
      T(tk.frac[1], cx + (w - w1) / 2, y + s * 0.38, fs);
    } else if (tk.sup != null) T(tk.sup, cx, y - s * 0.42, s * 0.6);
    else if (tk.bar != null) { T(tk.bar, cx, y, s); P([[cx, y - s * 0.78], [cx + w, y - s * 0.79]], sw * 0.8); }
    else {
      const k = tk.s, h = 0.56 * s, r = h / 2, b = y - 0.04 * s, ww = 0.46 * s;
      if (k === 'in' || k === 'nin') { P([[cx + ww, b - h], [cx + r, b - h], ...ell(cx + r, b - r, r, r, 0, -Math.PI / 2, -Math.PI * 1.5, 12).slice(1), [cx + ww, b]]); P([[cx + 0.04 * s, b - r], [cx + ww * 0.9, b - r]]); if (k === 'nin') P([[cx + ww * 0.85, b - h - 0.14 * s], [cx + ww * 0.1, b + 0.14 * s]]); }
      else if (k === 'sub') { const hb = y - 0.2 * s; P([[cx + ww, hb - h * 0.85], [cx + r * 0.85, hb - h * 0.85], ...ell(cx + r * 0.85, hb - r * 0.85, r * 0.85, r * 0.85, 0, -Math.PI / 2, -Math.PI * 1.5, 12).slice(1), [cx + ww, hb]]); P([[cx + 0.02 * s, y], [cx + ww, y]]); }
      else if (k === 'cup') P([[cx + 0.04 * s, y - 0.6 * s], [cx + 0.04 * s, y - 0.22 * s], ...ell(cx + 0.25 * s, y - 0.22 * s, 0.21 * s, 0.21 * s, 0, Math.PI, 0, 12).slice(1), [cx + 0.46 * s, y - 0.6 * s]]);
      else if (k === 'cap') P([[cx + 0.04 * s, y], [cx + 0.04 * s, y - 0.38 * s], ...ell(cx + 0.25 * s, y - 0.38 * s, 0.21 * s, 0.21 * s, 0, Math.PI, TAU, 12).slice(1), [cx + 0.46 * s, y]]);
      else if (k === 'all') { P([[cx, y - 0.66 * s], [cx + 0.27 * s, y], [cx + 0.54 * s, y - 0.66 * s]], sw, false); P([[cx + 0.12 * s, y - 0.36 * s], [cx + 0.42 * s, y - 0.36 * s]]); }
      else if (k === 'pi') { P([[cx, y - 0.42 * s], [cx + 0.1 * s, y - 0.5 * s], [cx + 0.6 * s, y - 0.5 * s]]); P([[cx + 0.2 * s, y - 0.48 * s], [cx + 0.17 * s, y]]); P([[cx + 0.44 * s, y - 0.48 * s], [cx + 0.44 * s, y - 0.06 * s], [cx + 0.55 * s, y]]); }
      else if (k === 'inf') { const c = [cx + 0.4 * s, y - 0.3 * s]; P(Array.from({ length: 33 }, (_, j) => { const a = j / 32 * TAU; return [c[0] + 0.36 * s * Math.cos(a), c[1] + 0.2 * s * Math.sin(2 * a)]; })); }
      else if (k === 'ex') T('!', cx, y, s);
      else if (k === 'to') { P([[cx, y - 0.3 * s], [cx + 0.6 * s, y - 0.3 * s]]); P([[cx + 0.44 * s, y - 0.44 * s], [cx + 0.6 * s, y - 0.3 * s], [cx + 0.44 * s, y - 0.16 * s]], sw, false); }
      else if (k === 'iff') { P([[cx + 0.12 * s, y - 0.38 * s], [cx + 0.68 * s, y - 0.38 * s]]); P([[cx + 0.12 * s, y - 0.22 * s], [cx + 0.68 * s, y - 0.22 * s]]); P([[cx + 0.2 * s, y - 0.48 * s], [cx, y - 0.3 * s], [cx + 0.2 * s, y - 0.12 * s]], sw, false); P([[cx + 0.6 * s, y - 0.48 * s], [cx + 0.8 * s, y - 0.3 * s], [cx + 0.6 * s, y - 0.12 * s]], sw, false); }
      else if (k === 'empty') { P(ell(cx + 0.25 * s, y - 0.3 * s, 0.2 * s, 0.26 * s, 0, -1, -1 + TAU * 1.03, 20)); P([[cx + 0.46 * s, y - 0.66 * s], [cx + 0.04 * s, y + 0.06 * s]], sw, false); }
    }
    at.push([cx + w / 2, y - 0.3 * size]); cx += w;
  });
  return { x0: x, x1: cx, at, y, size };
}

// ---------- armar la película ----------
function buildPage() {
  R = mulberry(20261113);
  const cy0 = H / 2 / 1.26 - 40; camKey(0, 600, cy0, 1.26, -0.8, 'd'); KIT.cam = { x: 600, y: cy0, z: 1.26, r: -0.8 };
  KIT.t = 0.3;
  FILM();
  KIT.t += 0.4;
  T_.done = KIT.t;
  SFX.push({ t: KIT.t, type: 'end', d: 0, pan: 0 });
  camKey(KIT.t + 2.2, KIT.cam.x, KIT.cam.y, KIT.cam.z * 1.015, KIT.cam.r, 'd');
  FULL = +(KIT.t + 2.2).toFixed(2);
  if (!TO) TO = FULL;
  CAM.sort((a, b) => a.t - b.t);
  CAM.forEach((b, i) => { if (i && b.k === 'g' && b.t > CAM[i - 1].t) SFX.push({ t: CAM[i - 1].t, type: 'gesture', d: b.t - CAM[i - 1].t, pan: 0 }); });
  SFX.push({ t: 0, type: 'narr', d: 0, pan: 0, lines: NARR });
}
