// zoomkit.js: motor común de los videos zoom de Zuka (Pradera de Venn, Valle de los Números) en estilo Scale Zoom Explainer (Lemo-Opuscar).
// Viene de video/conjunto-zoom/film.js (lección 1). Cada película define un objeto global FILM en su film.js:
//   DUR, dives() → [{a, b, P, r, A}], DT (los mismos tiempos, sin medir texto), open {Z0, C, t1, t2}, tweak(i, t, cam),
//   levels [fn(G, t)], aim [{fire, lock, name, L}], stops [nombres], labels(p, t), summary(p, t),
//   guide {blinks, smiles, wides, looks}, events() y NARR [[a, b, texto]].
// Todo es función pura de t. Pantalla = (p − C)·z + S0.
const S0 = [W / 2, H / 2];

// ---------- suavizados ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const ei = k => Math.pow(clamp(k), 3);
const backE = (k, s = 1.4) => { k = clamp(k) - 1; return 1 + k * k * ((s + 1) * k + s); };
const spr = (t, t0, w = 16, d = 8) => { const x = t - t0; return x <= 0 ? 0 : 1 - Math.exp(-d * x) * (Math.cos(w * x) + (d / w) * Math.sin(w * x)); };
const wob = (t, t0, w = 12, d = 5) => { const x = t - t0; return x <= 0 ? 0 : Math.exp(-d * x) * Math.sin(w * x); };
const blink = (t, t0) => eio(seg(t, t0, t0 + 0.07)) * (1 - eio(seg(t, t0 + 0.11, t0 + 0.22)));
const pop = (t, t0) => spr(t, t0, 18, 9);
const out = (t, t1, d = .3) => 1 - ei(seg(t, t1, t1 + d));
const life = (t, t0, t1) => pop(t, t0) * out(t, t1);                       // entra con rebote y sale encogiéndose
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, eio((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1][1];
}
function tear(G, cx, cy, r, tx, ty, fill) {
  const d = Math.hypot(tx - cx, ty - cy), a = Math.atan2(ty - cy, tx - cx), b = Math.acos(Math.min(0.999, r / d));
  const p1 = [cx + Math.cos(a + b) * r, cy + Math.sin(a + b) * r], p2 = [cx + Math.cos(a - b) * r, cy + Math.sin(a - b) * r];
  const m1 = [(p1[0] + tx) / 2, (p1[1] + ty) / 2], m2 = [(p2[0] + tx) / 2, (p2[1] + ty) / 2];
  return el('path', { d: `M${r1(tx)},${r1(ty)}Q${r1(m2[0])},${r1(m2[1])} ${r1(p2[0])},${r1(p2[1])}A${r1(r)},${r1(r)} 0 1 1 ${r1(p1[0])},${r1(p1[1])}Q${r1(m1[0])},${r1(m1[1])} ${r1(tx)},${r1(ty)}Z`, fill }, G);
}
const capsule = (G, x1, y1, x2, y2, w, col) => el('line', { x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2), stroke: col, 'stroke-width': r1(w), 'stroke-linecap': 'round' }, G);
const scaleAt = (p, x, y, k) => g(p, { transform: `translate(${r1(x)},${r1(y)}) scale(${Math.max(0, k).toFixed(4)}) translate(${r1(-x)},${r1(-y)})` });

// ---------- medir texto (Jost ya cargada antes del primer cuadro) ----------
const TW = {};
function tw(s, size, weight = 600, ls = 0) {
  const key = s + '|' + size + '|' + weight + '|' + ls;
  if (TW[key] != null) return TW[key];
  const e = el('text', { x: 0, y: -2000, 'font-size': size, 'font-weight': weight, 'letter-spacing': ls }, svg);
  e.textContent = s; const w = e.getComputedTextLength(); e.remove();
  return (TW[key] = w);
}
const measure = (str, a) => tw(str.replace(/<[^>]+>/g, ''), a['font-size'] || 30, a['font-weight'] || 400, a['letter-spacing'] || 0);

// ---------- texto ----------
function wipeText(p, x, y, str, a, k, h = 60) {
  if (k <= 0) return;
  const w = measure(str, a), x0 = a['text-anchor'] === 'end' ? x - w : a['text-anchor'] === 'middle' ? x - w / 2 : x;
  const G = g(p, { 'clip-path': clipOf('rect', { x: r1(x0 - 10), y: r1(y - h), width: r1((w + 40) * clamp(k)), height: r1(h * 1.5) }) });
  return text(G, x, y, str, a);
}
function riseG(p, t, t0, tOut, y, size) {
  if (t < t0 || t > tOut + .4) return null;
  const k = spr(t, t0, 13, 7) * (1 - ei(seg(t, tOut, tOut + .3)));
  const G = g(p, { 'clip-path': clipOf('rect', { x: -W, y: r1(y - size * 1.1), width: 3 * W, height: r1(size * 1.45) }) });
  return g(G, { transform: `translate(0,${r1(size * 1.3 * (1 - k))})` });
}
function riseText(p, t, t0, tOut, x, y, str, a) {
  const G = riseG(p, t, t0, tOut, y, a['font-size']); if (!G) return;
  return text(G, x, y, str, { 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle', 'letter-spacing': -1, ...a });
}

// ---------- signos que Jost no trae: ∈ ∉ ⊆ ∪ ∩ △ (x = borde izquierdo, y = renglón) ----------
const SYMW = s => 0.6 * s;
function sym(p, kind, x, y, s, col = C.cream) {
  const w = SYMW(s), sw = r1(0.078 * s), A = { fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const f = r1;
  if (kind === 'in' || kind === 'notin') {
    const h = 0.6 * s, r = h / 2, b = y - 0.04 * s, ww = 0.52 * s, x0 = x + (w - ww) / 2;
    el('path', { ...A, d: `M${f(x0 + ww)},${f(b - h)}L${f(x0 + r)},${f(b - h)}A${f(r)},${f(r)} 0 0 0 ${f(x0 + r)},${f(b)}L${f(x0 + ww)},${f(b)}M${f(x0)},${f(b - h / 2)}L${f(x0 + ww * .92)},${f(b - h / 2)}` }, p);
    if (kind === 'notin') el('path', { ...A, d: `M${f(x0 + ww * .86)},${f(b - h - .16 * s)}L${f(x0 + ww * .1)},${f(b + .16 * s)}` }, p);
  } else if (kind === 'sube') {
    const h = 0.48 * s, r = h / 2, b = y - 0.2 * s, ww = 0.52 * s, x0 = x + (w - ww) / 2;
    el('path', { ...A, d: `M${f(x0 + ww)},${f(b - h)}L${f(x0 + r)},${f(b - h)}A${f(r)},${f(r)} 0 0 0 ${f(x0 + r)},${f(b)}L${f(x0 + ww)},${f(b)}M${f(x0)},${f(y)}L${f(x0 + ww)},${f(y)}` }, p);
  } else if (kind === 'cup' || kind === 'cap') {
    const r = w * 0.4, x0 = x + w / 2 - r, top = y - 0.62 * s;
    el('path', { ...A, d: kind === 'cup' ? `M${f(x0)},${f(top)}L${f(x0)},${f(y - r)}A${f(r)},${f(r)} 0 0 0 ${f(x0 + 2 * r)},${f(y - r)}L${f(x0 + 2 * r)},${f(top)}`
      : `M${f(x0)},${f(y)}L${f(x0)},${f(top + r)}A${f(r)},${f(r)} 0 0 1 ${f(x0 + 2 * r)},${f(top + r)}L${f(x0 + 2 * r)},${f(y)}` }, p);
  } else if (kind === 'dN' || kind === 'dZ') {                         // ℕ y ℤ de doble trazo
    const h = 0.7 * s, ww = 0.46 * s, x0 = x + (w - ww) / 2, x1 = x0 + ww, d = 0.13 * s, top = y - h;
    if (kind === 'dN') el('path', { ...A, d: `M${f(x0)},${f(y)}L${f(x0)},${f(top)}L${f(x1)},${f(y)}L${f(x1)},${f(top)}M${f(x0 + d)},${f(top + d * 1.6)}L${f(x0 + d)},${f(y)}` }, p);
    else el('path', { ...A, d: `M${f(x0)},${f(top)}L${f(x1)},${f(top)}L${f(x0)},${f(y)}L${f(x1)},${f(y)}M${f(x1 - d * 1.3)},${f(top)}L${f(lerp(x1 - d * 1.3, x0 - d * 1.3, .82))},${f(lerp(top, y, .82))}` }, p);
  } else if (kind === 'dQ' || kind === 'dR' || kind === 'dI') {       // ℚ, ℝ e 𝕀 de doble trazo
    const h = 0.7 * s, ww = 0.46 * s, x0 = x + (w - ww) / 2, x1 = x0 + ww, d = 0.13 * s, top = y - h;
    if (kind === 'dQ') {
      const cx = (x0 + x1) / 2, cy = y - h / 2, rx = ww / 2, ry = h / 2;
      el('ellipse', { ...A, cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry) }, p);
      el('path', { ...A, d: `M${f(x0 + d)},${f(cy - ry * .72)}L${f(x0 + d)},${f(cy + ry * .72)}M${f(cx + rx * .15)},${f(cy + ry * .55)}L${f(x1 + .1 * s)},${f(y + .12 * s)}` }, p);
    } else if (kind === 'dR') {
      const m = top + h * .52, bx = x0 + ww * .62;
      el('path', { ...A, d: `M${f(x0)},${f(y)}L${f(x0)},${f(top)}L${f(bx)},${f(top)}A${f(h * .26)},${f(h * .26)} 0 0 1 ${f(bx)},${f(m)}L${f(x0)},${f(m)}M${f(bx - .04 * s)},${f(m)}L${f(x1)},${f(y)}M${f(x0 + d)},${f(top)}L${f(x0 + d)},${f(y)}` }, p);
    } else {
      const cx = (x0 + x1) / 2;
      el('path', { ...A, d: `M${f(cx - .16 * s)},${f(top)}L${f(cx + .16 * s)},${f(top)}M${f(cx - .16 * s)},${f(y)}L${f(cx + .16 * s)},${f(y)}M${f(cx - d / 2)},${f(top)}L${f(cx - d / 2)},${f(y)}M${f(cx + d / 2)},${f(top)}L${f(cx + d / 2)},${f(y)}` }, p);
    }
  } else if (kind === 'forall') {                                       // ∀
    const h = 0.7 * s, ww = 0.5 * s, x0 = x + (w - ww) / 2, top = y - h;
    el('path', { ...A, d: `M${f(x0)},${f(top)}L${f(x0 + ww / 2)},${f(y)}L${f(x0 + ww)},${f(top)}M${f(x0 + ww * .2)},${f(top + h * .45)}L${f(x0 + ww * .8)},${f(top + h * .45)}` }, p);
  } else if (kind === 'arrow') {                                        // ⇒
    const cy = y - .3 * s, x0 = x + .04 * s, x1 = x + w - .04 * s;
    el('path', { ...A, d: `M${f(x0)},${f(cy - .09 * s)}L${f(x1 - .12 * s)},${f(cy - .09 * s)}M${f(x0)},${f(cy + .09 * s)}L${f(x1 - .12 * s)},${f(cy + .09 * s)}M${f(x1 - .2 * s)},${f(cy - .22 * s)}L${f(x1)},${f(cy)}L${f(x1 - .2 * s)},${f(cy + .22 * s)}` }, p);
  } else if (kind === 'tri') {
    const a = w * 0.88, x0 = x + (w - a) / 2;
    el('path', { ...A, d: `M${f(x0)},${f(y)}L${f(x0 + a)},${f(y)}L${f(x0 + a / 2)},${f(y - 0.66 * s)}Z` }, p);
  }
}
// una fórmula: cadenas de texto y signos {s: 'cup'}; {sup: 'c'} es un índice volado. Devuelve los centros de cada pieza.
function fparts(toks, size) {
  const gap = size * 0.4; let x = 0; const parts = [];
  toks.forEach((tk, i) => {
    let w;
    if (typeof tk === 'string') w = tw(tk, size, 600);
    else if (tk.sup) w = tw(tk.sup, size * .62, 600);
    else if (tk.fr) w = Math.max(tw(tk.fr[0], size * .8, 600), tw(tk.fr[1], size * .8, 600)) + size * .26;
    else if (tk.ov) w = tw(tk.ov, size, 600);
    else w = SYMW(size);
    const tight = (typeof tk === 'object' && (tk.sup || tk.ov || tk.tight)) || (typeof tk === 'string' && /^[),.}:]/.test(tk)) || (i > 0 && typeof toks[i - 1] === 'string' && /[({]$/.test(toks[i - 1]));
    if (i > 0 && !tight) x += gap;
    parts.push({ tk, x, w }); x += w;
  });
  return { parts, w: x };
}
function formula(p, x, y, size, toks, o = {}) {
  const { parts, w } = fparts(toks, size), x0 = o.anchor === 'start' ? x : o.anchor === 'end' ? x - w : x - w / 2;
  const col = o.fill || C.cream, at = [];
  parts.forEach(({ tk, x: dx, w: ww }) => {
    const xx = x0 + dx;
    if (typeof tk === 'string') text(p, r1(xx), y, tk, { 'font-size': size, 'font-weight': 600, fill: (o.colors && o.colors[tk]) || col });
    else if (tk.sup) text(p, r1(xx), r1(y - size * .42), tk.sup, { 'font-size': r1(size * .62), 'font-weight': 600, fill: col });
    else if (tk.fr) fracAt(p, xx + ww / 2, y - .3 * size, size * .8, tk.fr[0], tk.fr[1], tk.col || col);
    else if (tk.ov) {
      text(p, r1(xx), y, tk.ov, { 'font-size': size, 'font-weight': 600, fill: tk.col || col });
      el('rect', { x: r1(xx + size * .04), y: r1(y - size * .86), width: r1(ww - size * .08), height: r1(size * .07), rx: r1(size * .035), fill: tk.col || col }, p);
    }
    else sym(p, tk.s, xx, y, size, col);
    at.push([xx + ww / 2, y - 0.34 * size]);
  });
  return { at, x0, w };
}
// una fracción vertical centrada en (cx, axis): s = tamaño de las cifras
function fracAt(p, cx, axis, s, n, d, col = C.cream) {
  const w = Math.max(tw(n, s, 600), tw(d, s, 600)) + s * .3;
  text(p, r1(cx), r1(axis - s * .16), n, { 'font-size': r1(s), 'font-weight': 600, fill: col, 'text-anchor': 'middle' });
  el('rect', { x: r1(cx - w / 2), y: r1(axis - s * .05), width: r1(w), height: r1(s * .1), rx: r1(s * .05), fill: col }, p);
  text(p, r1(cx), r1(axis + s * .78), d, { 'font-size': r1(s), 'font-weight': 600, fill: col, 'text-anchor': 'middle' });
}
function riseFormula(p, t, t0, tOut, x, y, size, toks, o = {}) {
  const G = riseG(p, t, t0, tOut, y, size); if (!G) return null;
  return formula(G, x, y, size, toks, o);
}

// ---------- etiqueta: versalitas, un renglón crema y una nota lila ----------
function label(p, t, t0, tOut, tag, line, sub, y = 300) {
  if (t < t0 || t > tOut + .35) return;
  const o = 1 - eio(seg(t, tOut, tOut + .3));
  const kb = eo(seg(t, t0, t0 + .25)) * o, hh = sub ? 232 : 170, bh = sub ? 186 : 124;
  const A1 = { 'font-size': 42, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 }, A2 = { 'font-size': 58, 'font-weight': 600, fill: C.cream }, A3 = { 'font-size': 46, 'font-weight': 500, fill: C.mist };
  const pw = Math.max(measure(tag, A1), measure(line, A2), sub ? measure(sub, A3) : 0) + 100, kp = eo(seg(t, t0, t0 + .5)) * o;
  if (kp > 0.01) el('rect', { x: 100, y: y - 98, width: r1(pw * kp), height: hh, rx: 22, fill: C.night }, p);
  el('rect', { x: 130, y: r1(y - 76 + bh * (1 - kb) / 2), width: 8, height: r1(bh * kb), rx: 4, fill: C.sun }, p);
  wipeText(p, 162, y - 30, tag, A1, eo(seg(t, t0 + .1, t0 + .45)) * o, 46);
  wipeText(p, 162, y + 40, line, A2, eo(seg(t, t0 + .25, t0 + .75)) * o, 64);
  if (sub) wipeText(p, 162, y + 104, sub, A3, eo(seg(t, t0 + .45, t0 + .95)) * o, 52);
}
// llave dibujada: dir 1 = «{», −1 = «}»
function brace(p, x, cy, h, dir, k, col = C.cream, sw = 11) {
  if (k <= 0.01) return;
  const hh = h * k / 2, w = h * 0.11 * dir, top = cy - hh, bot = cy + hh, c = Math.min(Math.abs(w), hh / 2);
  const d = `M${r1(x + w)},${r1(top)}Q${r1(x)},${r1(top)} ${r1(x)},${r1(top + c)}L${r1(x)},${r1(cy - c)}Q${r1(x)},${r1(cy)} ${r1(x - w)},${r1(cy)}Q${r1(x)},${r1(cy)} ${r1(x)},${r1(cy + c)}L${r1(x)},${r1(bot - c)}Q${r1(x)},${r1(bot)} ${r1(x + w)},${r1(bot)}`;
  el('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}
function lasso(p, cx, cy, rx, ry, k, col, sw = 8) {
  if (k <= 0.005) return;
  el('path', { d: `M${r1(cx)},${r1(cy - ry)}A${r1(rx)},${r1(ry)} 0 1,1 ${r1(cx)},${r1(cy + ry)}A${r1(rx)},${r1(ry)} 0 1,1 ${r1(cx)},${r1(cy - ry)}`, pathLength: 1, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-dasharray': `${clamp(k).toFixed(4)} 2` }, p);
}
function badge(p, x, y, k, ok) {
  if (k <= 0.01) return;
  const G = g(p, { transform: `translate(${r1(x)},${r1(y)}) scale(${k.toFixed(3)})` });
  shaded(G, 'circle', { cx: 0, cy: 0, r: 34 }, ok ? C.mint : C.coral, ok ? C.mintD : C.coralD, 5, 5);
  el('path', { d: ok ? 'M-15,1L-4,12L16,-11' : 'M-12,-12L12,12M12,-12L-12,12', fill: 'none', stroke: C.night, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
}
function tile(p, x, y, s, ch, k, col = [C.cream, C.creamD], ink = C.night) {
  if (k <= 0.01) return;
  const S = s * k;
  shaded(p, 'rect', { x: r1(x - S / 2), y: r1(y - S / 2), width: r1(S), height: r1(S), rx: r1(S * .2) }, col[0], col[1], r1(S * .06), r1(S * .06));
  text(p, r1(x), r1(y + S * .24), ch, { 'font-size': r1(S * .66), 'font-weight': 700, fill: ink, 'text-anchor': 'middle' });
}
// ficha con un nombre (personas, palabras)
function chip(p, x, y, name, k, col = [C.cream, C.creamD], ink = C.night, size = 40) {
  if (k <= 0.01) return;
  const w = (tw(name, size, 700) + 40) * k, h = size * 1.6 * k;
  shaded(p, 'rect', { x: r1(x - w / 2), y: r1(y - h / 2), width: r1(w), height: r1(h), rx: r1(h / 2) }, col[0], col[1], 4, 4);
  if (k > 0.3) text(p, r1(x), r1(y + size * .35 * k), name, { 'font-size': r1(size * k), 'font-weight': 700, fill: ink, 'text-anchor': 'middle' });
}
function starField(p, seed, n, ymax = 2 * H) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = -W + R() * 3 * W, y = -H * .5 + R() * 2 * H, k = R(), r = k < 0.7 ? 2 + R() * 2 : 3.6 + R() * 2.6;
    if (y > ymax) continue;
    el('circle', { cx: r1(x), cy: r1(y), r: r1(r), fill: k < 0.55 ? C.mist : k < 0.85 ? C.cream : C.sun }, p);
  }
}

// ---------- anillo de «próxima parada» y línea de mira ----------
function ringAt(p, t, t0, tOut, x, y, r, labelTxt, lx, ly) {
  if (t < t0 || t >= tOut) return;
  const rr = r + (r * 2.6) * (1 - spr(t, t0, 15, 8.5));
  el('circle', { cx: r1(x), cy: r1(y), r: r1(rr), fill: 'none', stroke: C.sun, 'stroke-width': 6 }, p);
  const ko = eo(seg(t, t0 + 0.08, t0 + 0.32));
  if (ko > 0) el('circle', { cx: r1(x), cy: r1(y), r: r1(rr + 18 * ko), fill: 'none', stroke: C.sun, 'stroke-width': 3.5, 'stroke-dasharray': '4 12', 'stroke-dashoffset': r1(-(t - t0) * 12), 'stroke-linecap': 'round' }, p);
  const a = Math.atan2(ly - y, lx - x), x1 = x + Math.cos(a) * (r + 30), y1 = y + Math.sin(a) * (r + 30), ey = ly > y ? ly - 76 : ly + 60;
  const kl = eio(seg(t, t0 + 0.32, t0 + 0.62));
  if (kl > 0) el('path', { d: `M${r1(x1)},${r1(y1)}L${r1(lerp(x1, lx, kl))},${r1(lerp(y1, ey, kl))}`, stroke: C.sun, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, p);
  const kp = eo(seg(t, t0 + 0.45, t0 + 0.7));
  if (kp > 0.01) { const w = Math.max(tw(labelTxt, 52), tw('PRÓXIMA PARADA', 36, 600, 3)) + 56; el('rect', { x: r1(lx - w / 2), y: r1(ly - 72), width: r1(w), height: r1(128 * kp), rx: 18, fill: C.night }, p); }
  wipeText(p, lx, ly - 24, 'PRÓXIMA PARADA', { 'font-size': 36, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3, 'text-anchor': 'middle' }, eo(seg(t, t0 + 0.5, t0 + 0.75)), 42);
  wipeText(p, lx, ly + 34, labelTxt, { 'font-size': 52, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, eo(seg(t, t0 + 0.6, t0 + 0.9)), 58);
}
function dotsAB(p, t, t0, t1, tOut, A, B, gap) {
  if (t < t0 || t >= tOut) return;
  const len = Math.hypot(B[0] - A[0], B[1] - A[1]), d0 = 70, d1 = len - gap, sp = 26, rr = 5;
  if (d1 <= d0) return;
  const front = lerp(d0, d1, eio(seg(t, t0, t1)) * 0.85 + seg(t, t0, t1) * 0.15);
  const m = t > t1 ? 18 * (t - t1) - 18 * 0.35 * (1 - Math.exp(-(t - t1) / 0.35)) : 0, off = m % sp;
  for (let d = d0 + off - sp; d <= Math.min(front, d1) + 0.01; d += sp) {
    if (d < d0) continue;
    const k = Math.min(backE(clamp((front - d) / 70), 2.2), clamp((d - d0) / sp + (off === 0 ? 1 : 0)), clamp((d1 - d) / sp + 0.02));
    if (k <= 0.02) continue;
    el('circle', { cx: r1(A[0] + (B[0] - A[0]) * d / len), cy: r1(A[1] + (B[1] - A[1]) * d / len), r: r1(rr * k), fill: C.sun }, p);
  }
}

// ---------- cámara y zambullidas ----------
let DIVE = null;
const dives = () => DIVE || (DIVE = FILM.dives().map(d => ({ ...d, s: 2 * d.r / W, K: W / (2 * d.r) })));
const levelAt = t => { let i = 0; while (i < FILM.DT.length && t >= FILM.DT[i][1]) i++; return i; };
const camTf = c => `translate(${S0[0]},${S0[1]}) scale(${c.z.toFixed(5)}) translate(${(-c.C[0]).toFixed(3)},${(-c.C[1]).toFixed(3)})`;
const mapC = (c, p) => [(p[0] - c.C[0]) * c.z + S0[0], (p[1] - c.C[1]) * c.z + S0[1]];
function restCam(i, t) {
  const D = FILM.DT; let c;
  if (i === 0) {
    const O = FILM.open, Z0 = O.Z0;
    if (t < O.t1) c = { z: Z0 * (1 + 0.04 * eio(t / O.t1)), C: [O.C[0], O.C[1] + 30 * eio(t / O.t1)] };
    else {
      const p = seg(t, O.t1, O.t2), q = eio(p) + 0.07 * Math.sin(Math.PI * p) * p * p, z0 = Z0 * 1.04, k = eio(p);
      c = { z: Math.exp(Math.log(z0) * (1 - q)) * (1 + 0.04 * eio(seg(t, O.t2, D[0][0]))), C: [lerp(O.C[0] , S0[0], k), lerp(O.C[1] + 30, S0[1], k)] };
    }
  } else {
    const a = D[i - 1][1], b = i < D.length ? D[i][0] : FILM.DUR;
    c = { z: 1 + 0.04 * eio(seg(t, a, b)), C: [S0[0], S0[1]] };
  }
  return FILM.tweak ? FILM.tweak(i, t, c) : c;
}
function diveState(i, t) {
  const d = dives()[i], u = seg(t, d.a, d.b), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  const c0 = restCam(i, d.a), Q0 = mapC(c0, d.P);
  const z = Math.exp(lerp(Math.log(c0.z), Math.log(d.K), e));
  const Q = [lerp(Q0[0], d.A[0], eio(u)), lerp(Q0[1], d.A[1], eio(u))];
  return { u, e, outer: { z, C: [d.P[0] - (Q[0] - S0[0]) / z, d.P[1] - (Q[1] - S0[1]) / z] }, Q, k: z * d.s, R: d.r * z * lerp(1, 2.3, e * e) };
}

// ---------- la guía ----------
const GUIDE = { x: 860, y: 1450, s: 240 };
function aimPoint(i, t) { const d = dives()[i]; return mapC(restCam(i, Math.min(t, d.a)), d.P); }
function guidePose(t) {
  const Gd = FILM.guide, enter = eo(seg(t, 4.5, 5.9));
  const x = lerp(1360, GUIDE.x, enter), y = GUIDE.y + 16 * Math.sin(t * 1.7) + 80 * (1 - enter) - 26 * wob(t, 5.9, 10, 4);
  let zoom = 0, look = [-0.35, -0.6], sq = 0.05 * wob(t, 5.9, 12, 5), tilt = 6 * Math.sin(t * 1.3);
  FILM.aim.forEach((a, i) => {
    const d = dives()[i], on = seg(t, a.fire - .5, a.fire) * (1 - seg(t, d.b, d.b + .6));
    const Q = aimPoint(i, Math.min(t, d.a)), dx = Q[0] - x, dy = Q[1] - y, L = Math.hypot(dx, dy) || 1;
    look = [lerp(look[0], dx / L, on), lerp(look[1], dy / L, on)];
    zoom = Math.max(zoom, eio(seg(t, a.fire - .35, a.fire)) * (1 - eio(seg(t, d.b - .3, d.b + .4))) * .7 + eio(seg(t, d.a, d.a + .6)) * (1 - eio(seg(t, d.b - .4, d.b + .3))) * .3);
    sq += -0.06 * wob(t, a.fire, 16, 7) + 0.05 * wob(t, a.lock, 14, 6);
    tilt += 14 * wob(t, a.lock, 11, 5);
  });
  (Gd.looks || []).forEach(([a, b, L]) => { const k = seg(t, a, a + .4) * (1 - seg(t, b, b + .5)); look = [lerp(look[0], L[0], k), lerp(look[1], L[1], k)]; });
  const bump = ([a, b]) => eio(seg(t, a, a + .5)) * (1 - eio(seg(t, b, b + .6)));
  const wide = Math.max(0, ...(Gd.wides || []).map(bump));
  const smile = Math.max(0, ...(Gd.smiles || []).map(bump));
  tilt += 18 * wob(t, FILM.DUR - 8, 9, 3);
  const lid = Math.max(0, ...(Gd.blinks || []).map(b => blink(t, b)));
  return { x, y, P: { rot: -5 + 3 * Math.sin(t * 0.9), look, zoom, sq, smile, wide, lid, tilt, ant: 8 * Math.sin(t * 2.1) - 20 * wob(t, 5.9, 9, 4), flame: .75 + .25 * Math.sin(t * 3.1), flick: t * 11 } };
}

// ---------- la cinta de paradas ----------
function ribbon(p, t) {
  const tEnd = FILM.endAt, kin = eo(seg(t, 5.8, 6.4)) * (1 - eio(seg(t, tEnd, tEnd + .4))); if (kin <= 0) return;
  const ST = FILM.stops, n = ST.length - 1, x0 = 110, x1 = 470, y = 1706, i = levelAt(t), D = FILM.DT;
  let pos = i;
  if (i < D.length && t > D[i][0]) pos = i + eio(seg(t, D[i][0], D[i][1]));
  const k = Math.min(n, Math.round(pos)), str = `${k + 1} de ${n + 1} · ${ST[k]}`, pw = Math.max(440, tw(str, 36) + 60);
  const G = scaleAt(p, x0, y, kin);
  el('rect', { x: x0 - 30, y: y - 104, width: r1(pw), height: 140, rx: 22, fill: C.night }, G);
  el('rect', { x: x0, y: y - 3, width: x1 - x0, height: 6, rx: 3, fill: C.n3 }, G);
  el('rect', { x: x0, y: y - 3, width: r1((x1 - x0) * pos / n), height: 6, rx: 3, fill: C.sun }, G);
  ST.forEach((s, j) => {
    const lit = pos >= j - 0.001, kx = x0 + (x1 - x0) * j / n, kk = 1 + .5 * wob(t, j === 0 ? 6.0 : D[j - 1][1], 16, 7);
    el('circle', { cx: r1(kx), cy: y, r: r1((lit ? 11 : 8) * kk), fill: lit ? C.sun : C.n3 }, G);
  });
  text(G, x0, y - 40, str, { 'font-size': 36, 'font-weight': 600, fill: C.cream, 'data-pass': 1 });
}
// el resumen del final: una cinta de pie con una idea por parada
function summaryList(p, t, t0, title, items) {
  if (t < t0 - .2) return;
  riseText(p, t, t0, 999, 540, 410, title, { 'font-size': 112, fill: C.sun });
  const x = 160, y0 = 560, dy = items.length > 4 ? 168 : 200, kl = eio(seg(t, t0 + .4, t0 + .4 + .6 * items.length));
  el('rect', { x: x - 3, y: y0, width: 6, height: r1(dy * (items.length - 1) * kl), rx: 3, fill: C.sun }, p);
  items.forEach(([tag, line], k) => {
    const tk = t0 + .6 + k * .55, y = y0 + k * dy, kk = pop(t, tk);
    if (kk > 0.01) { el('circle', { cx: x, cy: y, r: r1(22 * kk), fill: C.n3 }, p); el('circle', { cx: x, cy: y, r: r1(13 * kk), fill: C.sun }, p); }
    wipeText(p, x + 54, y - 18, tag, { 'font-size': 38, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 }, eo(seg(t, tk + .1, tk + .45)), 44);
    if (Array.isArray(line)) { const G = g(p, { 'clip-path': clipOf('rect', { x: x + 40, y: y - 6, width: r1(900 * eo(seg(t, tk + .2, tk + .7))), height: 100 }) }); formula(G, x + 54, y + 46, 52, line, { anchor: 'start' }); }
    else wipeText(p, x + 54, y + 46, line, { 'font-size': 52, 'font-weight': 600, fill: C.cream }, eo(seg(t, tk + .2, tk + .7)), 58);
  });
}

// ---------- un cuadro ----------
function film(t) {
  const D = dives(), i = levelAt(t), diving = i < D.length && t > D[i].a;
  const root = g(svg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, root);
  if (!diving) FILM.levels[i](g(root, { transform: camTf(restCam(i, t)) }), t);
  else {
    const d = diveState(i, t);
    FILM.levels[i](g(root, { transform: camTf(d.outer) }), t);
    const hole = g(root, { 'clip-path': clipOf('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R) }) });
    el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, hole);
    FILM.levels[i + 1](g(hole, { transform: `translate(${d.Q[0].toFixed(3)},${d.Q[1].toFixed(3)}) scale(${d.k.toFixed(5)}) translate(${-D[i].A[0]},${-D[i].A[1]})` }), t);
    if (d.R < 1500) {
      el('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R), fill: 'none', stroke: C.sun, 'stroke-width': r1(6 + 8 * d.e) }, root);
      el('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R + 18 + 30 * d.e), fill: 'none', stroke: C.sun, 'stroke-width': 3.5, 'stroke-dasharray': '4 12', 'stroke-dashoffset': r1(-t * 12), 'stroke-linecap': 'round' }, root);
    }
  }
  const ui = g(root), gp = guidePose(t);
  FILM.aim.forEach((a, k) => {
    const d = D[k]; if (t < a.fire || t >= d.a) return;
    const Q = aimPoint(k, t), A = orbiLens(gp.x, gp.y, GUIDE.s, gp.P);
    dotsAB(ui, t, a.fire, a.lock, d.a, A, Q, d.r * restCam(k, t).z + 26);
    ringAt(ui, t, a.lock, d.a, Q[0], Q[1], d.r * restCam(k, t).z, a.name, a.L[0], a.L[1]);
  });
  FILM.labels(ui, t);
  ribbon(ui, t);
  FILM.summary(ui, t);
  if (t > 4.4) orbi(ui, gp.x, gp.y, GUIDE.s, gp.P);
}

// ---------- sucesos para el sonido ----------
function filmEvents() {
  const ev = [{ t: 3.6, type: 'pull', d: 2.2 }, { t: 4.5, type: 'enter', d: 1.4 }];
  FILM.aim.forEach((a, i) => { const [da, db] = FILM.DT[i]; ev.push({ t: a.fire, type: 'line', d: a.lock - a.fire }, { t: a.lock, type: 'lock', i }, { t: da, type: 'dive', d: db - da, i }, { t: db, type: 'arrive', i }); });
  ev.push(...FILM.events(), { t: 0, type: 'narr', lines: FILM.NARR });
  return ev.sort((a, b) => a.t - b.t);
}
