// Motor de las películas «lámina» de Zuka (canvas 2D, 1080×1920, todo función pura de t).
// Estilo = la lámina del mundo (js/worlds.js): tinta teñida con el color del mundo, retícula fina, trazo blanco redondo,
// un solo acento y letras en cursiva de libro con borde de tinta. Pantalla en tres franjas: rótulo arriba (y < 400),
// diagrama en el centro y escritura formal abajo; avance de la lección al pie.
// Las películas (films/<nombre>.js) definen FILM y dibujan con las funciones globales de este archivo.
const W = 1080, H = 1920, CX = 540, CY = 1100;
let X, TL, PLATE_IMG = null;
// estilo «neón» (?s=neon): negro, trazos finos que brillan, marco de instrumento con reloj y cuadro; mismo contenido
let NEON = false;
const MONO = s => `${s}px Consolas, 'Courier New', monospace`;
function setNeon() { NEON = true; Object.assign(P, { ink: '#E9EEF8', mute: '#A9B3C9', dim: '#6B758C', bg: '#05070D' }); }
const P = { ink: '#E8ECFF', ac: '#5EE0C1', no: '#FF8A7A', mute: '#C2C9E6', dim: '#7F89B5', bg: '#0B0E24' };

// ---------- suavizados ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const back = (k, s = 1.2) => { k = clamp(k) - 1; return 1 + k * k * ((s + 1) * k + s); };
const A = (t, t0, d = .45) => eo(seg(t, t0, t0 + d));                        // aparece en t0
const win = (t, a, b, d = .4) => A(t, a, d) * (1 - seg(t, b - d, b));          // visible entre a y b
const ping = (t, t0, d = .9) => (t >= t0 && t < t0 + d ? (t - t0) / d : 0);
const draw = (t, t0, d = 1) => eio(seg(t, t0, t0 + d));                         // progreso de un trazo
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, eio((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1][1];
}
const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
const mixHex = (h, k, base = [11, 14, 36]) => '#' + [1, 3, 5].map((i, j) => Math.round(base[j] + (parseInt(h.slice(i, i + 2), 16) - base[j]) * k).toString(16).padStart(2, '0')).join('');
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function fade(a, fn, dy = 0) { if (a <= .003) return; X.save(); X.globalAlpha *= a; if (dy) X.translate(0, dy); fn(); X.restore(); }
function at(x, y, sc, fn) { X.save(); X.translate(x, y); X.scale(sc, sc); X.translate(-x, -y); fn(); X.restore(); }

// ---------- registro de textos para readcheck ----------
let REC = null;
function recBox(id, text, x0, y0, x1, y1, pass) {
  if (!REC) return; if (pass ? X.globalAlpha < .3 : X.globalAlpha < .8) return;
  const m = X.getTransform(), q = (x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f], p0 = q(x0, y0), p1 = q(x1, y1);
  REC.push({ id: id || text, text, x0: Math.min(p0[0], p1[0]), y0: Math.min(p0[1], p1[1]), x1: Math.max(p0[0], p1[0]), y1: Math.max(p0[1], p1[1]), pass: !!pass });
}

// ---------- texto en Jost ----------
const FJ = (s, w = 500) => `${w} ${s}px Jost, 'Cambria Math', sans-serif`;
function T(str, x, y, o = {}) {
  const s = o.s || 40; X.font = FJ(s, o.w || 500); X.letterSpacing = (o.ls || 0) + 'px';
  const w = X.measureText(str).width, k = o.max && w > o.max ? o.max / w : 1, x0 = o.a === 'c' ? x - w * k / 2 : o.a === 'r' ? x - w * k : x;
  X.save(); X.translate(x0, y); X.scale(k, k);
  if (o.halo !== false) { X.strokeStyle = hexA(P.bg, .8); X.lineWidth = s * .16; X.lineJoin = 'round'; X.strokeText(str, 0, 0); }
  X.fillStyle = o.c || P.ink; X.fillText(str, 0, 0); X.restore(); X.letterSpacing = '0px';
  if (!o.nr) recBox(o.id, str, x0, y - s * .78 * k, x0 + w * k, y + s * .22 * k, o.pass);
  return w * k;
}
function wrap(str, maxW, s, w = 500) { X.font = FJ(s, w); const out = []; let line = ''; for (const word of str.split(' ')) { const tr = line ? line + ' ' + word : word; if (X.measureText(tr).width > maxW && line) { out.push(line); line = word; } else line = tr; } if (line) out.push(line); return out; }
const label = (s, x, y, c = P.mute, o = {}) => T(s, x, y, { s: o.s || 38, c, a: o.a || 'c', pass: o.pass, max: o.max || 960, id: o.id });

// ---------- fórmulas: un TeX pequeño ----------
// \frac{a}{b}  \sqrt{x}  \sqrt[n]{x}  x^{2}  x_{1}  \bar{x}  \op{Σ}{arriba}{abajo}  \{ \}  \, \  \quad
// color: \hl{…} acento, \no{…} negación, \mu{…} apagado, \ink{…}   aparición: \s{n}{…} (sale cuando step pasa de n−1 a n)
// \id{nombre}{…} guarda su caja en r.box.nombre   \t{texto} en Jost
// Letras sueltas en cursiva (Georgia), palabras en redonda, números en Cambria, símbolos en Cambria Math.
const FONTS = { v: s => `italic ${s}px Georgia, 'Cambria Math', serif`, r: s => `${s}px Georgia, 'Cambria Math', serif`, n: s => `${s}px Cambria, 'Cambria Math', serif`,
  s: s => `${s}px 'Cambria Math', Cambria, serif`, t: s => `500 ${s * .8}px Jost, sans-serif` };
const LET = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/, GRK = /[α-ωϑϕ]/, OPS = '=+−-·×÷<>≤≥≠≈∈∉⊂⊆⊄⊃∪∩⇒⇔→↦±∓:|∼≡⊊';
function mTokens(str) {
  const out = []; let j = 0;
  while (j < str.length) {
    const c = String.fromCodePoint(str.codePointAt(j));
    if (c.length > 1) { out.push({ k: 'a', s: c, f: 's' }); j += c.length; continue; }   // 𝕀 y otras letras fuera del plano básico
    if (c === ' ') { out.push({ k: 'sp', w: .26 }); j++; continue; }
    if (LET.test(c)) { let w = ''; while (j < str.length && LET.test(str[j])) w += str[j++]; out.push({ k: 'a', s: w, f: w.length === 1 ? 'v' : 'r' }); continue; }
    if (/[0-9]/.test(c)) { let w = ''; while (j < str.length && (/[0-9]/.test(str[j]) || (str[j] === '.' && /[0-9]/.test(str[j + 1] || '')))) w += str[j++]; out.push({ k: 'a', s: w, f: 'n' }); continue; }
    if (GRK.test(c)) { out.push({ k: 'a', s: c, f: 'v' }); j++; continue; }
    if (OPS.includes(c)) { out.push({ k: 'a', s: c === '-' ? '−' : c, f: 's', op: true }); j++; continue; }
    if (c === ',' || c === ';') { out.push({ k: 'a', s: c, f: 's', pr: .24 }); j++; continue; }
    out.push({ k: 'a', s: c, f: c === '%' ? 'n' : 's', open: '([{⟨'.includes(c) }); j++;
  }
  return out;
}
function mParse(src) {
  let i = 0;
  const raw = () => { while (src[i] === ' ') i++; if (src[i] !== '{') return src[i++]; let d = 0, s = ''; i++; while (i < src.length) { if (src[i] === '{') d++; if (src[i] === '}') { if (!d) break; d--; } s += src[i++]; } i++; return s; };
  const arg = () => { while (src[i] === ' ') i++; if (src[i] === '{') { i++; const r = seq('}'); i++; return r; } if (src[i] === '\\') { const r = seq(null, 1); return r; } return { k: 'row', items: mTokens(src[i++]) }; };
  function seq(end, one) {
    const items = []; let buf = '';
    const flush = () => { if (buf) { items.push(...mTokens(buf)); buf = ''; } };
    while (i < src.length && src[i] !== end) {
      if (one && items.length) break;
      const c = src[i];
      if (c === '\\') {
        flush(); i++; let name = ''; while (i < src.length && /[a-zA-Z]/.test(src[i])) name += src[i++];
        if (!name) { const ch = src[i++]; if (ch === ',') items.push({ k: 'sp', w: .17 }); else if (ch === ';') items.push({ k: 'sp', w: .28 }); else if (ch === ' ') items.push({ k: 'sp', w: .32 }); else items.push(...mTokens(ch)); continue; }
        if (name === 'frac') { const a = arg(), b = arg(); items.push({ k: 'frac', a, b }); }
        else if (name === 'sqrt') { let n = null; if (src[i] === '[') { i++; n = seq(']'); i++; } items.push({ k: 'sqrt', n, a: arg() }); }
        else if (['hl', 'no', 'mu', 'ink'].includes(name)) items.push({ k: 'col', c: name, a: arg() });
        else if (name === 's') { const n = +raw(); items.push({ k: 'step', n, a: arg() }); }
        else if (name === 'id') { const n = raw(); items.push({ k: 'id', n, a: arg() }); }
        else if (name === 't') items.push({ k: 'a', s: raw(), f: 't' });
        else if (name === 'bar') items.push({ k: 'bar', a: arg() });
        else if (name === 'op') { const o = raw(), hi = arg(), lo = arg(); items.push({ k: 'op', o, hi, lo }); }
        else if (name === 'log' || name === 'ln') items.push({ k: 'a', s: name, f: 'r', pr: .12 });
        else if (name === 'quad') items.push({ k: 'sp', w: 1 });
        else if (name === 'qquad') items.push({ k: 'sp', w: 2 });
        else if (name === 'left' || name === 'right') continue;
        else items.push(...mTokens(name));
      } else if (c === '^' || c === '_') {
        flush(); i++; const a = arg(); const prev = items.pop() || { k: 'sp', w: 0 };
        if (c === '^' && prev.k === 'sub') items.push({ k: 'ss', base: prev.base, sub: prev.a, sup: a });
        else items.push({ k: c === '^' ? 'sup' : 'sub', base: prev, a });
      } else if (c === '{') { flush(); i++; const r = seq('}'); i++; items.push(r); }
      else { buf += c; i++; }
    }
    flush(); return { k: 'row', items };
  }
  return seq(null);
}
const isOp = m => m && m.k === 'a' && m.op;
const shift = (p, dx, dy) => (p.t === 'g' ? { ...p, x: p.x + dx, y: p.y + dy } : p.t === 'l' ? { ...p, x1: p.x1 + dx, x2: p.x2 + dx, y1: p.y1 + dy, y2: p.y2 + dy } : { ...p, pts: p.pts.map(([x, y]) => [x + dx, y + dy]) });
function lay(n, s) {
  switch (n.k) {
    case 'row': {
      const it = n.items.filter((m, j, arr) => !(m.k === 'sp' && (isOp(arr[j - 1]) || isOp(arr[j + 1]))));
      let x = 0, a = .5 * s, d = .1 * s; const P_ = [];
      it.forEach((m, j) => {
        let pl = 0, pr = 0;
        if (isOp(m)) { const pv = it[j - 1]; const unary = '−+±'.includes(m.s) && (!pv || isOp(pv) || pv.open || (pv.k === 'a' && pv.pr)); if (!unary) pl = pr = (m.s === ':' || m.s === '|') ? .2 * s : .24 * s; }
        if (m.pr || m.base?.pr) pr = (m.pr || m.base.pr) * s;
        const L = lay(m, s); x += pl; for (const p of L.P) P_.push(shift(p, x, 0)); x += L.w + pr; a = Math.max(a, L.a); d = Math.max(d, L.d);
      });
      return { w: x, a, d, P: P_ };
    }
    case 'a': { const f = FONTS[n.f](s); X.font = f; const w = X.measureText(n.s).width; return { w, a: .74 * s, d: .24 * s, P: [{ t: 'g', s: n.s, f, x: 0, y: 0, sz: s, w }] }; }
    case 'sp': return { w: n.w * s, a: 0, d: 0, P: [] };
    case 'sup': case 'sub': {
      const B = lay(n.base, s), S_ = lay(n.a, s * .62), dy = n.k === 'sup' ? -.46 * s : .24 * s, gx = .04 * s;
      return { w: B.w + gx + S_.w, a: Math.max(B.a, S_.a - dy), d: Math.max(B.d, S_.d + dy), P: [...B.P, ...S_.P.map(p => shift(p, B.w + gx, dy))] };
    }
    case 'ss': {
      const B = lay(n.base, s), U = lay(n.sup, s * .62), D_ = lay(n.sub, s * .62), gx = .04 * s;
      return { w: B.w + gx + Math.max(U.w, D_.w), a: Math.max(B.a, U.a + .46 * s), d: Math.max(B.d, D_.d + .24 * s), P: [...B.P, ...U.P.map(p => shift(p, B.w + gx, -.46 * s)), ...D_.P.map(p => shift(p, B.w + gx, .24 * s))] };
    }
    case 'frac': {
      const s2 = s * .86, N = lay(n.a, s2), D_ = lay(n.b, s2), w = Math.max(N.w, D_.w) + .26 * s, ax = -.3 * s, ny = ax - .16 * s - N.d, dy = ax + .16 * s + D_.a;
      return { w: w + .1 * s, a: -ny + N.a, d: dy + D_.d, P: [...N.P.map(p => shift(p, .05 * s + (w - N.w) / 2, ny)), ...D_.P.map(p => shift(p, .05 * s + (w - D_.w) / 2, dy)), { t: 'l', x1: .1 * s, y1: ax, x2: w, y2: ax, lw: .05 * s }] };
    }
    case 'sqrt': {
      const C = lay(n.a, s), top = -C.a - .12 * s, bot = C.d + .04 * s; let ix = 0, IP = [];
      if (n.n) { const I = lay(n.n, s * .52); ix = Math.max(0, I.w - .2 * s); IP = I.P.map(p => shift(p, .02 * s, top + .42 * s)); }
      const x0 = ix + .04 * s, pts = [[x0, -.22 * s], [x0 + .13 * s, -.3 * s], [x0 + .3 * s, bot], [x0 + .54 * s, top], [x0 + .62 * s + C.w + .06 * s, top]];
      return { w: x0 + .62 * s + C.w + .14 * s, a: -top + .06 * s, d: bot, P: [...IP, { t: 'pl', pts, lw: .05 * s }, ...C.P.map(p => shift(p, x0 + .62 * s, 0))] };
    }
    case 'bar': { const C = lay(n.a, s), y = -C.a - .04 * s; return { w: C.w, a: C.a + .1 * s, d: C.d, P: [...C.P, { t: 'l', x1: .04 * s, y1: y, x2: C.w - .02 * s, y2: y, lw: .05 * s }] }; }
    case 'op': {
      const O = lay({ k: 'a', s: n.o, f: 's' }, s * 1.45), Hh = lay(n.hi, s * .52), Lo = lay(n.lo, s * .52), w = Math.max(O.w, Hh.w, Lo.w), oy = .2 * s;
      const hy = oy - .74 * 1.45 * s - .08 * s - Hh.d, ly = oy + .2 * 1.45 * s + .12 * s + Lo.a;
      return { w: w + .1 * s, a: -hy + Hh.a, d: ly + Lo.d, P: [...O.P.map(p => shift(p, (w - O.w) / 2, oy)), ...Hh.P.map(p => shift(p, (w - Hh.w) / 2, hy)), ...Lo.P.map(p => shift(p, (w - Lo.w) / 2, ly))] };
    }
    case 'col': { const L = lay(n.a, s); L.P = L.P.map(p => ({ ...p, col: p.col || n.c })); return L; }
    case 'step': { const L = lay(n.a, s); L.P = L.P.map(p => ({ ...p, step: Math.max(p.step ?? -1e9, n.n) })); return L; }
    case 'id': { const L = lay(n.a, s); L.P = L.P.map(p => ({ ...p, ids: [...(p.ids || []), n.n] })); return L; }
  }
  return { w: 0, a: 0, d: 0, P: [] };
}
const MCACHE = new Map();
function mLayout(src, s) { const key = src + '|' + s; let L = MCACHE.get(key); if (!L) { L = lay(mParse(src), s); MCACHE.set(key, L); } return L; }
// M(fuente, x, y, tamaño, { a: 'c'|'l'|'r', step, c, id, pass, nr }) → { x0, w, a, d, box }
function M(src, x, y, s, o = {}) {
  const L = mLayout(src, s), x0 = o.a === 'l' ? x : o.a === 'r' ? x - L.w : x - L.w / 2, step = o.step ?? 1e9, ga = X.globalAlpha;
  const CM = { hl: P.ac, no: P.no, mu: P.dim, ink: P.ink };
  const al = p => (p.step == null || p.step < -1e8 ? 1 : eo(clamp(step - p.step + 1)));
  for (const pass of [0, 1]) for (const p of L.P) {
    const a = al(p); if (a <= .003) continue; X.globalAlpha = ga * a;
    const col = (o.col && o.col(p)) || CM[p.col] || o.c || P.ink;
    if (p.t === 'g') { X.font = p.f; if (!pass) { X.strokeStyle = hexA(P.bg, .85); X.lineWidth = p.sz * .15; X.lineJoin = 'round'; X.strokeText(p.s, x0 + p.x, y + p.y); } else { X.fillStyle = col; if (NEON && col !== P.ink && col !== (o.c || P.ink)) { X.shadowColor = col; X.shadowBlur = p.sz * .35; } X.fillText(p.s, x0 + p.x, y + p.y); X.shadowBlur = 0; } }
    else { X.beginPath(); if (p.t === 'l') { X.moveTo(x0 + p.x1, y + p.y1); X.lineTo(x0 + p.x2, y + p.y2); } else p.pts.forEach(([px, py], j) => (j ? X.lineTo(x0 + px, y + py) : X.moveTo(x0 + px, y + py))); X.lineCap = 'round'; X.lineJoin = 'round'; X.strokeStyle = pass ? col : hexA(P.bg, .85); X.lineWidth = pass ? p.lw : p.lw + s * .12; X.stroke(); }
  }
  X.globalAlpha = ga;
  const box = {};
  for (const p of L.P) for (const id of p.ids || []) {
    const b = box[id] || (box[id] = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
    const [ax, ay, bx, by] = p.t === 'g' ? [p.x, p.y - .74 * p.sz, p.x + p.w, p.y + .24 * p.sz] : p.t === 'l' ? [p.x1, p.y1, p.x2, p.y2] : [Math.min(...p.pts.map(q => q[0])), Math.min(...p.pts.map(q => q[1])), Math.max(...p.pts.map(q => q[0])), Math.max(...p.pts.map(q => q[1]))];
    b.x0 = Math.min(b.x0, x0 + ax); b.y0 = Math.min(b.y0, y + ay); b.x1 = Math.max(b.x1, x0 + bx); b.y1 = Math.max(b.y1, y + by);
  }
  for (const k in box) { box[k].cx = (box[k].x0 + box[k].x1) / 2; box[k].cy = (box[k].y0 + box[k].y1) / 2; }
  if (!o.nr) recBox(o.id, plain(src), x0, y - L.a, x0 + L.w, y + L.d, o.pass);
  return { x0, w: L.w, a: L.a, d: L.d, box };
}
const mWidth = (src, s) => mLayout(src, s).w;

// ---------- trazos de la lámina ----------
function stroke(c, lw, path, o = {}) {
  if (NEON) { X.save(); X.strokeStyle = c; X.lineWidth = Math.max(2, lw * .62); X.lineCap = 'round'; X.lineJoin = 'round'; if (o.dash) X.setLineDash(o.dash); X.shadowColor = c; X.shadowBlur = o.glow || Math.max(10, lw * 2.6); X.beginPath(); path(); X.stroke(); X.shadowBlur = 0; X.globalAlpha *= .85; X.strokeStyle = mixHex(c, .45, [255, 255, 255]); X.lineWidth = Math.max(1, lw * .22); X.stroke(); X.restore(); return; }
  X.save(); X.strokeStyle = c; X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; if (o.dash) X.setLineDash(o.dash); if (o.glow) { X.shadowColor = c; X.shadowBlur = o.glow; } X.beginPath(); path(); X.stroke(); X.restore(); }
function fillP(c, a, path, rule) { X.save(); X.fillStyle = hexA(c, a); X.beginPath(); path(); X.fill(rule || 'nonzero'); X.restore(); }
function line(x1, y1, x2, y2, o = {}) { const k = o.k ?? 1; if (k <= 0) return; stroke(o.c || P.ink, o.w || 7, () => { X.moveTo(x1, y1); X.lineTo(lerp(x1, x2, k), lerp(y1, y2, k)); }, o); }
function arrow(x1, y1, x2, y2, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; const ex = lerp(x1, x2, k), ey = lerp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1), h = o.h || 26, c = o.c || P.ink, w = o.w || 6;
  stroke(c, w, () => { X.moveTo(x1, y1); X.lineTo(ex - Math.cos(a) * h * .6, ey - Math.sin(a) * h * .6); }, o);
  X.save(); X.fillStyle = c; X.beginPath(); X.moveTo(ex, ey); X.lineTo(ex - h * Math.cos(a) - h * .55 * Math.sin(a), ey - h * Math.sin(a) + h * .55 * Math.cos(a)); X.lineTo(ex - h * Math.cos(a) + h * .55 * Math.sin(a), ey - h * Math.sin(a) - h * .55 * Math.cos(a)); X.closePath(); X.fill(); X.restore();
}
function circ(cx, cy, r, o = {}) { const k = o.k ?? 1; if (k <= 0) return; if (o.fill) fillP(o.fc || P.ac, o.fill * Math.min(1, k * 1.5), () => X.arc(cx, cy, r, 0, 7)); stroke(o.c || P.ink, o.w || 7, () => X.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k), o); }
function ell(cx, cy, rx, ry, o = {}) { const k = o.k ?? 1; if (k <= 0) return; if (o.fill) fillP(o.fc || P.ac, o.fill * Math.min(1, k * 1.5), () => X.ellipse(cx, cy, rx, ry, 0, 0, 7)); stroke(o.c || P.ink, o.w || 7, () => X.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k), o); }
function rect(x, y, w, h, o = {}) { const k = o.k ?? 1; if (k <= 0) return; const r = o.r ?? 0; if (o.fill) fillP(o.fc || P.ac, o.fill * Math.min(1, k * 1.5), () => X.roundRect(x, y, w, h, r)); const per = 2 * (w + h); stroke(o.c || P.ink, o.w || 6, () => X.roundRect(x, y, w, h, r), { ...o, dash: k < 1 ? [per * k, per] : o.dash }); }
function poly(pts, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; const close = o.close !== false, path = () => { pts.forEach(([x, y], j) => (j ? X.lineTo(x, y) : X.moveTo(x, y))); if (close) X.closePath(); };
  if (o.fill) fillP(o.fc || P.ac, o.fill * Math.min(1, k * 1.5), path);
  let per = 0; const all = close ? [...pts, pts[0]] : pts; for (let j = 1; j < all.length; j++) per += Math.hypot(all[j][0] - all[j - 1][0], all[j][1] - all[j - 1][1]);
  stroke(o.c || P.ink, o.w || 6, path, { ...o, dash: k < 1 ? [per * k, per] : o.dash });
}
function dot(x, y, o = {}) {
  const r = o.r || 11; X.beginPath(); X.arc(x, y, r, 0, 7);
  if (o.hollow) { X.fillStyle = P.bg; X.fill(); X.strokeStyle = o.c || P.ink; X.lineWidth = 5; X.stroke(); } else { X.fillStyle = o.c || P.ink; X.fill(); }
  if (o.ping > 0 && o.ping < 1) stroke(o.pc || o.c || P.ac, 5 * (1 - o.ping), () => X.arc(x, y, r + 60 * eo(o.ping), 0, 7));
}
// pinta las zonas de un diagrama de Venn: circles = [[cx, cy, r], …], pred(dentro de cada círculo…) → pintar o no;
// bounds = rectángulo del universo; k = avance de la pintura (barrido de izquierda a derecha)
function vennFill(circles, pred, k = 1, o = {}) {
  if (k <= 0) return; const [bx, by, bw, bh] = o.bounds || [0, 0, W, H], n = circles.length;
  for (let m = 0; m < (1 << n); m++) {
    const ins = circles.map((_, j) => !!(m & (1 << j))); if (!pred(...ins)) continue;
    X.save(); X.beginPath(); X.rect(bx, by, bw * k, bh); X.clip();
    circles.forEach(([cx, cy, r], j) => { X.beginPath(); if (ins[j]) X.arc(cx, cy, r, 0, 7); else { X.rect(bx - 10, by - 10, bw + 20, bh + 20); X.arc(cx, cy, r, 0, 7); } X.clip(ins[j] ? 'nonzero' : 'evenodd'); });
    X.fillStyle = hexA(o.c || P.ac, o.a ?? .32); X.fillRect(bx, by, bw, bh); X.restore();
  }
  if (k < 1) stroke(o.c || P.ac, 4, () => { X.moveTo(bx + bw * k, by); X.lineTo(bx + bw * k, by + bh); }, { glow: 16 });
}
// barra de una magnitud: relleno suave del acento, borde de tinta y rótulo (fórmula) adentro o encima
function bar(x, y, w, h, o = {}) {
  const k = o.k ?? 1; if (k <= 0 || w <= 0) return; const ww = w * k;
  fillP(o.c || P.ac, o.a ?? .42, () => X.roundRect(x, y, ww, h, Math.min(10, h / 3))); rect(x, y, ww, h, { r: Math.min(10, h / 3), w: o.w || 4, c: o.line || P.ink });
  if (o.label && k > .6) fade(clamp((k - .6) * 3), () => M(o.label, o.out ? x + ww + 24 : x + ww / 2, o.out ? y + h / 2 + 16 : (o.top ? y - 18 : y + h / 2 + (o.s || 44) * .34), o.s || 44, { a: o.out ? 'l' : 'c', c: o.lc, pass: true }));
}
// cuadrícula cols × rows con las primeras n casillas pintadas (n puede crecer con t)
function cells(x, y, cols, rows, size, n, o = {}) {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c, on = i < n; fillP(on ? (o.c || P.ac) : P.ink, on ? (o.a ?? .7) : .06, () => X.roundRect(x + c * size + 2, y + r * size + 2, size - 4, size - 4, Math.min(6, size / 5))); }
  rect(x, y, cols * size, rows * size, { w: 3, c: hexA(P.ink, .6) });
}
// fichas algebraicas: 'xx' cuadrado de lado x, 'x' barra x por 1 acostada, 'xv' barra de pie, '1' cuadrito; neg = negativa
const TX = 150, TU = 42;
function atile(kind, x, y, o = {}) {
  const [w, h] = kind === 'xx' ? [TX, TX] : kind === 'x' ? [TX, TU] : kind === 'xv' ? [TU, TX] : [TU, TU];
  const c = o.neg ? P.no : (o.c || P.ac);
  fade(o.a ?? 1, () => { fillP(c, o.fill ?? (kind === 'xx' ? .3 : kind === '1' ? .72 : .5), () => X.roundRect(x + 2, y + 2, w - 4, h - 4, 6)); rect(x + 2, y + 2, w - 4, h - 4, { r: 6, w: 3, c: hexA(P.ink, .85) });
    if (o.label !== false && kind !== '1') M(kind === 'xx' ? 'x^{2}' : 'x', x + w / 2, y + h / 2 + (kind === 'xx' ? 16 : 11), kind === 'xx' ? 46 : 30, { pass: true }); });
  return [w, h];
}
// modelo de área de (x + a)(x + b): cuadrado, b barras de pie a la derecha, a barras acostadas abajo, a·b cuadritos.
// o.k(i, total) = opacidad de la pieza i (para que aparezcan una a una); o.sides = rótulos de los lados
function areaModel(x0, y0, a, b, o = {}) {
  const pcs = [['xx', x0, y0]]; for (let j = 0; j < b; j++) pcs.push(['xv', x0 + TX + j * TU, y0]); for (let i = 0; i < a; i++) pcs.push(['x', x0, y0 + TX + i * TU]);
  for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) pcs.push(['1', x0 + TX + j * TU, y0 + TX + i * TU]);
  pcs.forEach(([k, x, y], i) => atile(k, x, y, { a: o.k ? o.k(i, pcs.length) : 1, label: k !== 'xv' || TU > 30 }));
  if (o.sides !== false) fade(o.sa ?? 1, () => { M('x', x0 + TX / 2, y0 - 22, 40, { pass: true }); if (b) M(String(b), x0 + TX + b * TU / 2, y0 - 22, 40, { c: P.ac, pass: true }); M('x', x0 - 30, y0 + TX / 2 + 14, 40, { pass: true }); if (a) M(String(a), x0 - 30, y0 + TX + a * TU / 2 + 14, 40, { c: P.ac, pass: true }); });
  return { w: TX + b * TU, h: TX + a * TU, n: pcs.length };
}
// visto bueno o cruz en un círculo
function mark(x, y, r, ok, k = 1) {
  if (k <= 0) return; const c = ok ? P.ac : P.no;
  fade(clamp(k * 2), () => { stroke(c, 5, () => X.arc(x, y, r, 0, 7)); stroke(c, 6, () => { if (ok) { X.moveTo(x - r * .45, y); X.lineTo(x - r * .1, y + r * .35); X.lineTo(x + r * .48, y - r * .34); } else { X.moveTo(x - r * .36, y - r * .36); X.lineTo(x + r * .36, y + r * .36); X.moveTo(x + r * .36, y - r * .36); X.lineTo(x - r * .36, y + r * .36); } }); });
}
// elemento: punto con su nombre al lado (letra en cursiva, palabra en redonda)
function el(name, x, y, o = {}) { fade(o.a ?? 1, () => { dot(x, y, { c: o.c, ping: o.ping, pc: o.pc, r: o.r }); M(name, x + (o.dx ?? 36), y - (o.dy ?? 14), o.s || 58, { a: 'l', c: o.c, pass: true }); }); }
// llave horizontal bajo (o sobre) un tramo, con rótulo opcional
function brace(x1, x2, y, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; const up = o.up ? -1 : 1, h = (o.h || 26) * up, m = (x1 + x2) / 2, c = o.c || P.ac;
  fade(k, () => { stroke(c, o.w || 5, () => { X.moveTo(x1, y); X.quadraticCurveTo(x1, y + h, x1 + 30, y + h); X.lineTo(m - 22, y + h); X.quadraticCurveTo(m, y + h, m, y + h * 1.9); X.quadraticCurveTo(m, y + h, m + 22, y + h); X.lineTo(x2 - 30, y + h); X.quadraticCurveTo(x2, y + h, x2, y); }); if (o.label) (o.m ? M(o.label, m, y + h * 1.9 + (up > 0 ? 62 : -24), o.s || 50, { c, pass: o.pass }) : label(o.label, m, y + h * 1.9 + (up > 0 ? 54 : -20), c, { s: o.s || 38, pass: o.pass })); });
}
// salto en arco de x1 a x2 sobre (o bajo) una recta en y; k = avance; o.label rótulo en la cima
function hop(x1, x2, y, k, o = {}) {
  if (k <= 0) return; const dir = o.below ? 1 : -1, h = (o.h ?? Math.min(170, Math.abs(x2 - x1) * .5 + 20)) * dir, c = o.c || P.ac, n = 40;
  const pt = u => [lerp(x1, x2, u), y + h * 4 * u * (1 - u)];
  stroke(c, o.w || 5, () => { for (let i = 0; i <= n * k; i++) { const [px, py] = pt(i / n); i ? X.lineTo(px, py) : X.moveTo(px, py); } });
  if (k >= .98) { const [ax, ay] = pt(1), [bx, by] = pt(.9), a = Math.atan2(ay - by, ax - bx), hh = 20; X.save(); X.fillStyle = c; X.beginPath(); X.moveTo(ax, ay); X.lineTo(ax - hh * Math.cos(a) - hh * .55 * Math.sin(a), ay - hh * Math.sin(a) + hh * .55 * Math.cos(a)); X.lineTo(ax - hh * Math.cos(a) + hh * .55 * Math.sin(a), ay - hh * Math.sin(a) - hh * .55 * Math.cos(a)); X.closePath(); X.fill(); X.restore(); }
  if (o.label && k > .5) fade(clamp((k - .5) * 3), () => M(o.label, (x1 + x2) / 2, y + h + (dir < 0 ? -18 : 56), o.ls || 42, { c, pass: true }));
}
// recta numérica: devuelve v → x
function axis(o) {
  const { x0 = 90, x1 = 990, y, v0, v1, k = 1 } = o, X_ = v => lerp(x0, x1, (v - v0) / (v1 - v0)), c = o.c || P.ink;
  if (k <= 0) return X_;
  line(x0 - 20, y, lerp(x0 - 20, x1 + 40, k), y, { c, w: o.w || 6 });
  if (k > .96) arrow(x1 + 10, y, x1 + 46, y, { c, w: o.w || 6, h: 28 });
  for (const v of o.ticks || []) { const x = X_(v), kk = clamp((k - (x - x0) / (x1 - x0) * .9) * 6); if (kk <= 0) continue; fade(kk, () => { line(x, y - 16, x, y + 16, { c, w: 5 }); if (o.labels !== false) M(o.fmt ? o.fmt(v) : (v < 0 ? '−' + (-v) : String(v)), x, y + 70, o.ls || 46, { c: o.lc || P.ink, pass: true }); }); }
  return X_;
}
// plano cartesiano: devuelve { X, Y } con la escala sx, sy (px por unidad)
function plane(o) {
  const { ox, oy, sx, sy, x0, x1, y0, y1, k = 1 } = o, Xf = x => ox + x * sx, Yf = y => oy - y * sy;
  if (o.grid) fade(k * .5, () => { X.strokeStyle = hexA(P.ink, .1); X.lineWidth = 2; X.beginPath(); for (let v = Math.ceil(x0); v <= x1; v++) { X.moveTo(Xf(v), Yf(y0)); X.lineTo(Xf(v), Yf(y1)); } for (let v = Math.ceil(y0); v <= y1; v++) { X.moveTo(Xf(x0), Yf(v)); X.lineTo(Xf(x1), Yf(v)); } X.stroke(); });
  if (k > 0) { arrow(Xf(x0), oy, lerp(Xf(x0), Xf(x1), k), oy, { w: 5, h: 24, k: 1 }); arrow(ox, Yf(y0), ox, lerp(Yf(y0), Yf(y1), k), { w: 5, h: 24 }); }
  fade(A(k, .9, .1), () => { M('x', Xf(x1) - 10, oy + 56, 44, { pass: true }); M('y', ox - 40, Yf(y1) + 20, 44, { pass: true });
    for (const v of o.xt || []) { line(Xf(v), oy - 12, Xf(v), oy + 12, { w: 4 }); M(v < 0 ? '−' + (-v) : String(v), Xf(v), oy + 52, 36, { pass: true }); }
    for (const v of o.yt || []) { line(ox - 12, Yf(v), ox + 12, Yf(v), { w: 4 }); M(v < 0 ? '−' + (-v) : String(v), ox - 40, Yf(v) + 12, 36, { pass: true }); } });
  return { X: Xf, Y: Yf };
}
function plot(f, a, b, Pl, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; const n = o.n || 160, e = lerp(a, b, k), lo = o.ymin ?? -1e9, hi = o.ymax ?? 1e9;
  stroke(o.c || P.ac, o.w || 7, () => { let pen = false; for (let i = 0; i <= n; i++) { const x = lerp(a, e, i / n), y = f(x); if (!isFinite(y) || y < lo || y > hi) { pen = false; continue; } const px = Pl.X(x), py = Pl.Y(y); pen ? X.lineTo(px, py) : X.moveTo(px, py); pen = true; } }, o);
}
// foco: oscurece todo menos un círculo (o un rectángulo)
function spot(x, y, r, k, o = {}) { if (k <= 0) return; X.save(); X.fillStyle = hexA('#05070F', .62 * k); X.beginPath(); X.rect(0, 380, W, 1440); if (o.rect) X.roundRect(o.rect[0], o.rect[1], o.rect[2], o.rect[3], 24); else X.arc(x, y, r, 0, 7); X.fill('evenodd'); X.restore(); }
// tarjeta de nota (marco fino) con renglones de texto o fórmula
function note(x, y, w, h, k, fn, o = {}) { if (k <= 0) return; fade(k, () => { fillP(P.bg, .55, () => X.roundRect(x, y, w, h, 22)); rect(x, y, w, h, { r: 22, w: 3, c: hexA(o.c || P.ac, .7) }); fn(); }, (1 - k) * 16); }

// ---------- fondo, rótulos, transiciones ----------
let NOISE = null, BGC = null;
function backdrop(t, sweep) {
  if (NEON) return neonBackdrop(t, sweep);
  if (!BGC) { BGC = document.createElement('canvas'); BGC.width = W; BGC.height = H; const c = BGC.getContext('2d');
    const g = c.createRadialGradient(CX, 900, 0, CX, 900, 1450); g.addColorStop(0, mixHex(P.ac, .3)); g.addColorStop(.72, mixHex(P.ac, .07)); g.addColorStop(1, P.bg); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.strokeStyle = hexA(P.ink, .085); c.lineWidth = 1.5; c.beginPath(); for (let x = 0; x <= W; x += 54) { c.moveTo(x + .5, 0); c.lineTo(x + .5, H); } for (let y = 30; y <= H; y += 54) { c.moveTo(0, y + .5); c.lineTo(W, y + .5); } c.stroke();
    const v = c.createRadialGradient(CX, 960, 520, CX, 960, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); c.fillStyle = v; c.fillRect(0, 0, W, H); }
  X.drawImage(BGC, 0, 0);
  if (sweep > 0 && sweep < 1) {                          // barrido de luz: una línea de acento baja y enciende la retícula a su paso
    const y = lerp(380, 1840, eio(sweep)), a = Math.sin(Math.PI * sweep);
    X.save(); const g = X.createLinearGradient(0, y - 220, 0, y + 20); g.addColorStop(0, hexA(P.ac, 0)); g.addColorStop(1, hexA(P.ac, .1 * a)); X.fillStyle = g; X.fillRect(0, y - 220, W, 240);
    X.strokeStyle = hexA(P.ac, .35 * a); X.lineWidth = 2; X.beginPath(); for (let gy = 30; gy <= H; gy += 54) { const d = Math.abs(gy - y); if (d < 200 && gy < y + 10) { X.globalAlpha = (1 - d / 200); X.moveTo(0, gy + .5); X.lineTo(W, gy + .5); } } X.stroke(); X.globalAlpha = 1;
    stroke(P.ac, 3, () => { X.moveTo(0, y); X.lineTo(W, y); }, { glow: 24 }); X.restore();
  }
}
function neonBackdrop(t, sweep) {
  if (!BGC) { BGC = document.createElement('canvas'); BGC.width = W; BGC.height = H; const c = BGC.getContext('2d');
    c.fillStyle = P.bg; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(CX, 1000, 0, CX, 1000, 1100); g.addColorStop(0, hexA(P.ac, .07)); g.addColorStop(1, hexA(P.ac, 0)); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = hexA(P.ink, .07); for (let x = 54; x < W; x += 108) for (let y = 84; y < H; y += 108) c.fillRect(x - 1, y - 1, 2, 2);
    const v = c.createRadialGradient(CX, 960, 500, CX, 960, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); c.fillStyle = v; c.fillRect(0, 0, W, H); }
  X.drawImage(BGC, 0, 0);
  if (sweep > 0 && sweep < 1) { const y = lerp(380, 1840, eio(sweep)), a = Math.sin(Math.PI * sweep); X.save(); X.globalAlpha = a * .6; X.strokeStyle = P.ac; X.lineWidth = 1.5; X.shadowColor = P.ac; X.shadowBlur = 18; X.beginPath(); X.moveTo(40, y); X.lineTo(W - 40, y); X.stroke(); X.restore(); }
}
// marco de instrumento: escuadras, nombre, escena, reloj y número de cuadro (no cuenta para la lectura)
function hud(t, i) {
  const pl = PLATES[FILM.world], m = 36, L = 46;
  X.save(); X.strokeStyle = hexA(P.ink, .4); X.lineWidth = 2; X.beginPath();
  for (const [x, y, dx, dy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { X.moveTo(x, y + dy * L); X.lineTo(x, y); X.lineTo(x + dx * L, y); }
  X.stroke(); X.restore();
  T('ZUKA', 90, 100, { s: 26, w: 600, ls: 9, c: P.ink, halo: false, nr: true });
  X.font = MONO(17); X.fillStyle = P.dim; X.letterSpacing = '3px'; X.fillText(('ÁLGEBRA · MUNDO ' + pl.n + ' · ' + pl.name).toUpperCase(), 90, 130); X.letterSpacing = '0px';
  const n = TL.SC.length - 1, k = i <= 0 ? 0 : Math.min(i, n);
  X.font = MONO(26); X.textAlign = 'right'; X.fillStyle = P.ink; X.fillText(String(k).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), 990, 100);
  X.font = MONO(17); X.fillStyle = P.dim; X.letterSpacing = '3px'; X.fillText(i > 0 ? TL.SC[i].name.toUpperCase() : 'PORTADA', 990, 130); X.letterSpacing = '0px';
  const pulse = .55 + .45 * Math.sin(t * 4); X.fillStyle = hexA(P.ac, pulse); X.shadowColor = P.ac; X.shadowBlur = 14; X.beginPath(); X.arc(990 - X.measureText('00 / 00').width - 150, 92, 8, 0, 7); X.fill(); X.shadowBlur = 0;
  if (i > 0 && TL.scenes[i].id !== '_fin') { const sc = TL.SC[i], lt = t - sc.t0, cap = TL.CAPS.filter(c => c.a <= t).length, nc = TL.CAPS.length;
    X.textAlign = 'left'; X.font = MONO(17); X.fillStyle = P.dim; X.letterSpacing = '2px';
    X.fillText('ESCENA  ' + String(i).padStart(2, '0') + '   ' + (lt / (sc.t1 - sc.t0) * 100).toFixed(1).padStart(5, ' ') + ' %', 90, 1752);
    X.fillText('IDEA    ' + String(cap).padStart(2, '0') + ' / ' + nc, 90, 1776); X.letterSpacing = '0px'; X.textAlign = 'right'; }
  X.font = MONO(30); X.fillStyle = P.ink; X.fillText('t = ' + t.toFixed(2).padStart(5, '0') + ' s', 990, 1800);
  X.font = MONO(15); X.fillStyle = P.dim; X.fillText('CUADRO ' + String(Math.round(t * 30)).padStart(4, '0') + ' · 1080×1920 · 30 FPS', 990, 1826);
  X.textAlign = 'left';
}
function noise() {
  if (!NOISE) { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), im = x.createImageData(256, 256), R = rng(7); for (let i = 0; i < im.data.length; i += 4) { const v = R() < .5 ? 0 : 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 8; } x.putImageData(im, 0, 0); NOISE = X.createPattern(c, 'repeat'); }
  X.fillStyle = NOISE; X.fillRect(0, 0, W, H);
}
// renglón de rótulo: texto en Jost con trozos de fórmula entre $…$
function capLine(str, x, y, s) {
  if (!str.includes('$')) return T(str, x, y, { s, max: 900 });
  const parts = str.split('$'); let cx = x; const ws = parts.map((q, i) => (i % 2 ? mWidth(q, s * 1.02) : (X.font = FJ(s), X.measureText(q).width)));
  const tot = ws.reduce((a, b) => a + b, 0), k = tot > 900 ? 900 / tot : 1;
  X.save(); X.translate(x, y); X.scale(k, k); X.translate(-x, -y);
  parts.forEach((q, i) => { if (i % 2) M(q, cx, y, s * 1.02, { a: 'l', nr: true }); else if (q) T(q, cx, y, { s, nr: true }); cx += ws[i]; });
  X.restore(); recBox(null, plain(str), x, y - s * .8, x + tot * k, y + s * .25);
}
// alto de un renglón de rótulo: lo que sube (a) y lo que baja (d) de la línea base, con fracciones o raíces
function capH(str, s) { let a = .8 * s, d = .25 * s; if (str) str.split('$').forEach((q, i) => { if (i % 2 && q) { const L = mLayout(q, s * 1.02); a = Math.max(a, L.a); d = Math.max(d, L.d); } }); return { a, d }; }
function caption(t) {
  for (const c of TL.CAPS) {
    if (t < c.a || t > c.b) continue;
    const out = 1 - seg(t, c.b - .25, c.b), neg = c.k.startsWith('!'), kc = neg ? P.no : P.ac, kt = neg ? c.k.slice(1) : c.k;
    fade(A(t, c.a, .4) * out, () => { X.fillStyle = kc; X.fillRect(90, 180, 40 * eo(seg(t, c.a, c.a + .5)), 4); T(kt, 146, 196, { s: 28, w: 600, ls: 5, c: kc, halo: false }); });
    const h1 = capH(c.l1, 60), h2 = capH(c.l2, 60), y1 = 286 + Math.max(0, h1.a - 62), ys = [y1, y1 + Math.max(78, h1.d + h2.a + 14)];
    [c.l1, c.l2].forEach((l, i) => { if (!l) return; const k2 = A(t, c.a + .1 + i * .12, .45); fade(k2 * out, () => capLine(l, 90, ys[i], 60), (1 - k2) * 20); });
  }
}
function progress(t, i) {
  if (NEON) {
    X.fillStyle = hexA(P.ink, .16); X.fillRect(90, 1856, 900, 2); X.save(); X.shadowColor = P.ac; X.shadowBlur = 12; X.fillStyle = P.ac; X.fillRect(90, 1856, 900 * t / TL.DUR, 2); X.restore();
    TL.SC.forEach(s => { if (!s.i) return; X.fillStyle = s.t0 <= t ? P.ac : hexA(P.ink, .3); X.fillRect(90 + 900 * s.t0 / TL.DUR - 1, 1846, 2, 22); });
    X.font = MONO(20); X.fillStyle = P.mute; X.letterSpacing = '3px'; X.fillText(String(i).padStart(2, '0') + ' · ' + TL.SC[i].name.toUpperCase(), 90, 1826); X.letterSpacing = '0px';
    return;
  }
  X.fillStyle = hexA(P.ink, .14); X.fillRect(90, 1856, 900, 3); X.fillStyle = hexA(P.ac, .8); X.fillRect(90, 1856, 900 * t / TL.DUR, 3);
  TL.SC.forEach(s => { if (!s.i) return; X.fillStyle = s.t0 <= t ? P.ac : hexA(P.ink, .3); X.fillRect(90 + 900 * s.t0 / TL.DUR - 1, 1850, 2, 15); });
  T(String(i).padStart(2, '0') + ' · ' + TL.SC[i].name.toUpperCase(), 90, 1832, { s: 22, w: 600, ls: 3, c: P.mute, pass: true, halo: false });
  const pl = PLATES[FILM.world]; T('MUNDO ' + pl.n + ' · ' + pl.name.toUpperCase(), 990, 1832, { s: 22, w: 600, ls: 3, c: P.dim, a: 'r', pass: true, halo: false });
}
// la lámina del mundo como una tarjeta
function plateCard(x, y, w, a = 1) {
  if (!PLATE_IMG) return; const h = w / 2;
  fade(a, () => { X.save(); X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 50; X.shadowOffsetY = 18; X.beginPath(); X.roundRect(x, y, w, h, w * .035); X.fillStyle = P.bg; X.fill(); X.restore();
    X.save(); X.beginPath(); X.roundRect(x, y, w, h, w * .035); X.clip(); X.drawImage(PLATE_IMG, x, y, w, h); X.restore(); rect(x, y, w, h, { r: w * .035, w: 2, c: NEON ? P.ac : hexA(P.ink, .25) }); });
}
function neonMark(t, D_) {
  const cx = CX, cy = 1080, r = 250, k1 = draw(t, .5, 1.2), k2 = draw(t, 1.4, 2.2), ang = -Math.PI / 2 + 2 * Math.PI * k2;
  line(cx - 420 * k1, cy, cx + 420 * k1, cy, { c: hexA(P.ink, .35), w: 3 }); line(cx, cy - 420 * k1, cx, cy + 420 * k1, { c: hexA(P.ink, .35), w: 3 });
  if (k2 > 0) stroke(P.ac, 7, () => X.arc(cx, cy, r, -Math.PI / 2, ang));
  fade(A(t, .3), () => dot(cx, cy, { r: 8, c: P.ink }));
  if (k2 > 0 && k2 < 1) { const px = cx + r * Math.cos(ang), py = cy + r * Math.sin(ang); stroke(hexA(P.ink, .7), 3, () => { X.moveTo(cx, cy); X.lineTo(px, py); }); dot(px, py, { r: 9, c: '#FFFFFF' }); }
  fade(A(t, 1.4) * (1 - seg(t, D_ - 1.6, D_ - 1.2)), () => { X.font = MONO(22); X.fillStyle = P.mute; X.fillText('θ = ' + (2 * Math.PI * k2).toFixed(3) + ' rad', cx - 330, cy + 360); X.fillText('lección ' + FILM.n[0] + ' / ' + FILM.n[1], cx - 330, cy + 392); });
}
function intro(t) {
  const pl = PLATES[FILM.world], D_ = TL.INTRO, z = 1 + 2.6 * ei3(seg(t, D_ - 1.6, D_)), out = 1 - seg(t, D_ - 1.0, D_ - .1);
  const ka = A(t, .3, .6);
  fade(out, () => {
    at(CX, 1060, z, () => (NEON ? neonMark(t, D_) : plateCard(80, 850, 920, A(t, .2, .8))));
    fade(ka * (1 - seg(t, D_ - 1.7, D_ - 1.2)), () => {
      X.fillStyle = P.ac; X.fillRect(90, 380, 40, 4); T('MUNDO ' + pl.n + ' · ' + pl.name.toUpperCase(), 146, 396, { s: 30, w: 600, ls: 5, c: P.ac, halo: false });
      const lines = wrap(FILM.title, 900, 78, 600); lines.forEach((l, i) => T(l, 90, 520 + i * 92, { s: 78, w: 600, max: 900 }));
      if (!NEON) T('Lección ' + FILM.n[0] + ' de ' + FILM.n[1], 90, 1380, { s: 38, c: P.mute });
    });
  });
}
const ei3 = k => Math.pow(clamp(k), 3);
function finScene(t) {
  const F = TL.fin;
  fade(A(t, .4), () => { X.fillStyle = P.ac; X.fillRect(90, 180, 40, 4); T('EN RESUMEN', 146, 196, { s: 28, w: 600, ls: 5, c: P.ac, halo: false }); });
  const gap = Math.min(170, 1020 / FILM.sum.length);
  FILM.sum.forEach(([lab, src], i) => {
    const ts = 1.4 + i * 1.5, k = A(t, ts, .5), y = 330 + i * gap;
    fade(k, () => { T(lab, 90, y, { s: 30, w: 600, c: P.ac, max: 900 }); if (src) M(src, 90, y + 76, src.length > 40 ? 52 : 62, { a: 'l', id: 'sum' + i }); X.fillStyle = hexA(P.ink, .16); X.fillRect(90, y + 112, 900 * eo(seg(t, ts, ts + .8)), 1.5); }, (1 - k) * 20);
  });
  const ye = 330 + FILM.sum.length * gap + 40;
  FILM.end.forEach((s, i) => { const k = A(t, F.te + i * .3, .6); fade(k, () => T(s, 90, ye + 60 + i * 84, { s: 66, w: 600, c: i ? P.ac : P.ink, max: 900 }), (1 - k) * 22); });
  const kn = A(t, F.te + 3, .6);
  fade(kn, () => { plateCard(90, 1560, 300, 1); if (FILM.next) { T('SIGUE', 430, 1610, { s: 26, w: 600, ls: 4, c: P.ac, halo: false }); wrap(FILM.next, 540, 40).forEach((l, i) => T(l, 430, 1664 + i * 50, { s: 40, w: 500 })); } });
}

// ---------- la película ----------
function renderFilm(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.setLineDash([]); X.filter = 'none';
  let i = TL.SC.findIndex(s => t < s.t1); if (i < 0) i = TL.SC.length - 1;
  const sc = TL.SC[i], lt = t - sc.t0, k = i ? seg(lt, 0, TL.TR) : 1;
  backdrop(t, i ? seg(lt, 0, TL.TR + .5) : 0);
  const drawScene = (j, tt, e, incoming) => {
    const S = TL.scenes[j]; if (S.id === '_intro') return intro(tt); if (S.id === '_fin') return finScene(tt);
    const cam = S.cam ? { x: kf(tt, S.cam.map(c => [c[0], c[1]])), y: kf(tt, S.cam.map(c => [c[0], c[2]])), z: kf(tt, S.cam.map(c => [c[0], c[3]])) } : null;
    X.save();
    if (e < 1) { const sc_ = incoming ? lerp(.965, 1, eo(e)) : lerp(1, 1.05, e); X.translate(CX, CY); X.scale(sc_, sc_); X.translate(-CX, -CY); if (!incoming) X.filter = `blur(${(e * 10).toFixed(1)}px)`; }
    if (cam) { X.translate(CX, CY); X.scale(cam.z, cam.z); X.translate(-cam.x, -cam.y); }
    S.draw(tt);
    X.restore(); X.filter = 'none';
  };
  if (k < 1 && i > 0) { const prev = TL.scenes[i - 1]; fade(1 - eo(k), () => { const r = REC; REC = null; drawScene(i - 1, prev.dur, k, false); REC = r; }); }
  fade(eo(k), () => drawScene(i, lt, k, true));
  X.setLineDash([]); X.filter = 'none';
  caption(t);
  if (i > 0 && TL.scenes[i].id !== '_fin') progress(t, i);
  if (NEON) hud(t, i);
  noise();
}
