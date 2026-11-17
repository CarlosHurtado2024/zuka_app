// «¿Qué es un conjunto?» · estilo neón del curso de Álgebra (pedido del usuario, 2026-11-27). Canvas 2D, 1080×1920,
// función pura de t. Escenas, rótulos y tiempos en data.js (los mismos de video/conjunto-lamina).
// Fondo negro, sin cuadrícula. Trazos finos que brillan. Blanco, el morado del curso (P.teal conserva el nombre: es
// el acento) y un rosa que combina con él para lo que NO pertenece o no es un conjunto (P.coral). Letra fina: Jost
// ligera para los rótulos y la letra de libro de KaTeX (Computer Modern) para las fórmulas. Animación mínima: se traza,
// aparece, se mueve una vez. Arriba el rótulo, en el centro el diagrama, abajo la escritura formal.
const W = 1080, H = 1920, CX = 540;
let X;
const P = { ink: '#F5F3FF', teal: '#B18CFF', coral: '#FF6FB5', mute: '#B9B2DE', bg: '#000000' };
const GLOW = 18;   // brillo de los trazos

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const A = (t, t0, d = .45) => eo(seg(t, t0, t0 + d));
const win = (t, a, b, d = .4) => A(t, a, d) * (1 - seg(t, b - d, b));           // visible entre a y b
const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- texto ----------
const thin = w => (w >= 600 ? 500 : w >= 500 ? 340 : 300);
const FJ = (s, w = 500, it = false) => `${it ? 'italic ' : ''}${thin(w)} ${s}px Jost, 'Cambria Math', sans-serif`;
const fontOf = (k, s) => (k === 'i' ? `italic ${s}px KMath, Georgia, 'Cambria Math', serif` : k === 'r' ? `${s}px KMain, Georgia, 'Cambria Math', serif` : k === 'm' ? `${s}px KMain, 'Cambria Math', Cambria, serif`
  : k === 'S' ? `${s * 1.12}px KMain, 'Cambria Math', Cambria, serif` : k === 'J' ? FJ(s, 500) : FJ(s * .8, 500));
let REC = null;
function recBox(id, text, x0, y0, x1, y1, pass) {
  if (!REC) return; if (pass ? X.globalAlpha < .3 : X.globalAlpha < .8) return;
  const m = X.getTransform(), q = (x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f], p0 = q(x0, y0), p1 = q(x1, y1);
  REC.push({ id: id || text, text, x0: p0[0], y0: p0[1], x1: p1[0], y1: p1[1], pass: !!pass });
}
function T(str, x, y, o = {}) {
  const s = o.s || 40; X.font = FJ(s, o.w || 500, o.it); X.letterSpacing = (o.ls || 0) + 'px'; X.fillStyle = o.c || P.ink;
  const w = X.measureText(str).width, k = o.max && w > o.max ? o.max / w : 1, x0 = o.a === 'c' ? x - w * k / 2 : o.a === 'r' ? x - w * k : x;
  X.save(); X.translate(x0, y); X.scale(k, k); X.fillText(str, 0, 0); X.restore(); X.letterSpacing = '0px';
  if (!o.nr) recBox(o.id, str, x0, y - s * .78 * k, x0 + w * k, y + s * .22 * k, o.pass);
  return w * k;
}
function mlMeasure(parts, size) { let x = 0; const pos = []; for (const [s, k] of parts) { X.font = fontOf(k, size); const w = X.measureText(s).width; pos.push([x, w]); x += w; } return { w: x, pos }; }
// renglón formal: 'i' cursiva (letras de conjuntos y elementos), 'r' redonda, 'm' símbolos. Con el borde de tinta de la lámina.
function ML(parts, x, y, size, o = {}) {
  const L = mlMeasure(parts, size), x0 = o.a === 'l' ? x : x - L.w / 2, ga = X.globalAlpha;
  for (const pass of [0, 1]) parts.forEach(([s, k, c], i) => {
    const a = o.alpha ? o.alpha(i) : 1; if (a <= 0) return;
    X.font = fontOf(k, size); X.globalAlpha = ga * a;
    if (!pass) { if (o.plain) return; X.strokeStyle = 'rgba(0,0,0,.9)'; X.lineWidth = size * .14; X.lineJoin = 'round'; X.strokeText(s, x0 + L.pos[i][0], y); }
    else { X.fillStyle = (o.col && o.col(i)) || c || P.ink; X.fillText(s, x0 + L.pos[i][0], y); }
  });
  X.globalAlpha = ga;
  if (!o.nr) recBox(o.id, parts.map(p => p[0]).join(''), x0, y - size * .8, x0 + L.w, y + size * .25, o.pass);
  return { x0, w: L.w, pos: L.pos, mid: i => x0 + L.pos[i][0] + L.pos[i][1] / 2 };
}
function TS(str, x, y, s) {
  if (!/[∈∉]/.test(str)) return T(str, x, y, { s, max: 900 });
  return ML(str.split(/([∈∉])/).filter(Boolean).map(q => (/[∈∉]/.test(q) ? [q, 'S', q === '∈' ? P.teal : P.coral] : [q, 'J'])), x, y, s, { a: 'l', plain: true });
}
const setLine = (name, items) => { const p = [[name, 'i'], [' = ', 'm'], ['{', 'm']]; items.forEach((n, i) => { p.push([n, 'i']); if (i < items.length - 1) p.push([', ', 'r']); }); p.push(['}', 'm']); return p; };
const COMP = [['V', 'i'], [' = ', 'm'], ['{', 'm'], ['x', 'i'], [' : ', 'm'], ['x', 'i'], [' es una vocal', 'r'], ['}', 'm']];
const stmt = (a, sym, b = 'V') => [[a, 'i'], [` ${sym} `, 'm', sym === '∈' ? P.teal : P.coral], [b, 'i']];
function fade(a, fn, dy = 0) { if (a <= .003) return; X.save(); X.globalAlpha *= a; if (dy) X.translate(0, dy); fn(); X.restore(); }
const tag = (s, x, y, c = P.mute, o = {}) => T(s, x, y, { s: Math.max(38, o.s || 40), w: 500, c, a: o.a || 'c', pass: o.pass, max: 940 });

// ---------- piezas de la lámina ----------
function stroke(col, lw, draw, dash) { X.save(); X.strokeStyle = col; X.lineWidth = Math.max(2, lw * .6); X.shadowColor = col; X.shadowBlur = GLOW; X.lineCap = 'round'; X.lineJoin = 'round'; if (dash) X.setLineDash(dash); X.beginPath(); draw(); X.stroke(); X.restore(); }
function oval(cx, cy, rx, ry, k, o = {}) {
  if (k <= 0) return;
  if (o.fill) { X.save(); X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, 7); X.fillStyle = hexA(o.fc || P.teal, o.fill * k); X.fill(); X.restore(); }
  stroke(o.col || P.ink, o.lw || 8, () => X.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k), o.dash);
}
function dot(x, y, o = {}) { X.save(); X.shadowColor = o.col || P.ink; X.shadowBlur = GLOW; X.beginPath(); X.arc(x, y, (o.r || 11) * .8, 0, 7); X.fillStyle = o.col || P.ink; X.fill(); X.restore(); if (o.ping > 0 && o.ping < 1) stroke(o.pc || o.col || P.teal, 5 * (1 - o.ping), () => X.arc(x, y, 11 + 70 * eo(o.ping), 0, 7)); }
function glyph(ch, x, y, s, c = P.ink, k = 'i', a = 'c') { X.font = fontOf(k, s); const w = X.measureText(ch).width, x0 = a === 'c' ? x - w / 2 : x; X.strokeStyle = 'rgba(0,0,0,.9)'; X.lineWidth = s * .14; X.lineJoin = 'round'; X.strokeText(ch, x0, y); X.fillStyle = c; X.fillText(ch, x0, y); }
function mark(x, y, r, ok, k = 1) { if (k <= 0) return; const c = ok ? P.teal : P.coral; fade(clamp(k * 2), () => { stroke(c, 5, () => X.arc(x, y, r, 0, 7)); stroke(c, 6, () => { if (ok) { X.moveTo(x - r * .45, y); X.lineTo(x - r * .1, y + r * .35); X.lineTo(x + r * .48, y - r * .34); } else { X.moveTo(x - r * .36, y - r * .36); X.lineTo(x + r * .36, y + r * .36); X.moveTo(x + r * .36, y - r * .36); X.lineTo(x - r * .36, y + r * .36); } }); }); }
function tick(x, y0, y1, c, k) { if (k > 0) stroke(c, 3, () => { X.moveTo(x, y0); X.lineTo(x, lerp(y0, y1, k)); }); }

const EL = { a: [450, 730], e: [625, 705], i: [545, 835], o: [445, 915], u: [640, 930], m: [225, 610], t: [820, 610], s: [215, 1040], r: [825, 1045] };
const VC = [540, 825, 265], ALL = [...D.VOWELS, ...D.OUT];
function el(ch, o = {}) { const [x, y] = EL[ch]; fade(o.a ?? 1, () => { dot(x, y, { col: o.col, ping: o.ping, pc: o.pc }); glyph(ch, x + 40, y - 14, 62, o.col || P.ink); }); }
// el diagrama de siempre: V con sus cinco vocales adentro y cuatro consonantes afuera. st[ch] = { col, ping, pc, a }
function base(o = {}) {
  const st = o.st || {};
  oval(VC[0], VC[1], VC[2], VC[2], 1, { fill: o.fill ?? .1, col: o.vc || P.ink, fc: P.teal });
  fade(o.va ?? 1, () => glyph('V', 790, 590, 76, o.vl || P.ink));
  for (const ch of ALL) el(ch, st[ch] || {});
}
const ping = (t, t0, d = .9) => (t >= t0 && t < t0 + d ? (t - t0) / d : 0);

// ---------- escenas (t = tiempo dentro de la escena) ----------
const FY = 1450;                                  // renglón de la escritura formal
const S = {
  idea(t) {
    const k = eio(seg(t, 6.8, 8.6));
    oval(VC[0], VC[1], VC[2], VC[2], k, { fill: .1 });
    fade(A(t, 9.0), () => glyph('V', 790, 590, 76));
    ALL.forEach((ch, i) => { const j = [4, 0, 6, 2, 8, 1, 5, 3, 7].indexOf(i); el(ch, { a: A(t, .4 + j * .14, .4), ping: ping(t, .4 + j * .14, .7), pc: P.ink }); });
    fade(A(t, 9.8), () => T('V, el conjunto de las vocales', CX, FY, { s: 50, a: 'c' }), (1 - A(t, 9.8)) * 16);
  },
  def(t) {
    const st = {}; D.VOWELS.forEach((ch, k) => { const p = ping(t, 8.8 + k * .9); if (t > 8.4 && t < 15.8) st[ch] = { ping: p, col: t >= 8.8 + k * .9 ? P.teal : P.ink }; });
    if (t > 16.2) st.a = { col: P.teal };
    base({ st, vl: t > 16.2 ? P.teal : P.ink });
    fade(1 - seg(t, 8.0, 8.4), () => T('V, el conjunto de las vocales', CX, FY, { s: 50, a: 'c' }));
    fade(win(t, 8.6, 15.9), () => ML([['a, e, i, o, u', 'i', P.teal], ['  son los elementos de ', 'J'], ['V', 'i']], CX, FY, 54, { id: 'elems' }));
    const k1 = A(t, 16.4), k2 = A(t, 18.4);
    fade(k1, () => { glyph('V', 300, 1560, 240, P.teal); tag('conjunto: mayúscula', 300, 1660, P.mute, { s: 36 }); });
    fade(k2, () => { glyph('a', 780, 1560, 240, P.teal); tag('elemento: minúscula', 780, 1660, P.mute, { s: 36 }); });
  },
  bien(t) {
    const x = A(t, 16.8, .6) * (1 - seg(t, 26.9, 27.5)), st = {}, rows = (1 - seg(t, 16.4, 16.9));
    if (t < 16.8) { st.e = { col: t > 2.0 ? P.teal : P.ink, ping: ping(t, 2.0) }; st.t = { col: t > 4.6 ? P.coral : P.ink, ping: ping(t, 4.6), pc: P.coral }; }
    const OP = [['a', 'm', 's'], ['e', 't', 'i', 'r'], ['o', 'u', 'm']], oi = Math.min(2, Math.floor((t - 17.2) / 2.4)), ot = 17.2 + oi * 2.4;
    if (x > 0 && t >= 17.2 && t < 26.6) for (const ch of OP[oi]) st[ch] = { col: P.coral, ping: ping(t, ot), pc: P.coral };
    base({ st, fill: lerp(t > 9 ? .1 + .12 * A(t, 9.0) : .1, .04, x), vc: t > 9 && x < .5 ? P.teal : P.ink, va: lerp(1, .3, x), vc: undefined });
    if (x > 0) fade(x, () => {                    // una frontera que no logra cerrarse
      if (t >= 17.2 && t < 26.6) for (const ch of OP[oi]) { const [ex, ey] = EL[ch], a0 = t * 1.1 + ex; stroke(P.coral, 5, () => X.arc(ex + 16, ey - 14, 70 + 5 * Math.sin(t * 3 + ex), a0, a0 + 4.9), [14, 12]); }
      ['persona 1', 'persona 2', 'persona 3'].forEach((s, i) => { const on = i === oi && t >= 17.2 && t < 26.6, bx = 150 + i * 270; if (on) { X.fillStyle = P.coral; X.fillRect(bx + 30, 1456, 180, 4); } fade(on ? 1 : .45, () => T(s, bx + 120, 1437, { s: 40, a: 'c', pass: true })); });
      T('no se puede decidir quién está', CX, 1560, { s: 44, a: 'c', c: P.coral });
    });
    fade(rows * A(t, 1.4), () => { ML([['e', 'i', P.teal], [' es una vocal', 'r']], 150, 1420, 64, { a: 'l', id: 'r1' }); fade(A(t, 2.0), () => { mark(760, 1400, 26, true); T('está', 810, 1418, { s: 44, c: P.teal }); }); });
    fade(rows * A(t, 4.0), () => { ML([['t', 'i', P.coral], [' no es una vocal', 'r']], 150, 1550, 64, { a: 'l', id: 'r2' }); fade(A(t, 4.6), () => { mark(760, 1530, 26, false); T('no está', 810, 1548, { s: 44, c: P.coral }); }); });
    fade(rows * A(t, 9.4), () => tag('siempre la misma respuesta', CX, 1680, P.mute, { s: 38 }));
  },
  venn(t) {
    const st = {}, out = A(t, 8.4);
    D.OUT.forEach((ch, k) => { if (t > 8.4) st[ch] = { ping: ping(t, 8.8 + k * .5), pc: P.ink }; });
    base({ st, fill: .1 + .2 * win(t, .8, 8.2) });
    const tr = seg(t, 1.0, 2.6); if (tr > 0 && tr < 1) stroke(P.teal, 10, () => X.arc(VC[0], VC[1], VC[2], -Math.PI / 2 + tr * 6.283 - .9, -Math.PI / 2 + tr * 6.283));
    fade(A(t, 2.4), () => tag('adentro', VC[0], 1040, P.teal, { s: 36, pass: true }));
    fade(out, () => tag('afuera', VC[0], 1190, P.mute, { s: 36, pass: true }));
    fade(A(t, 2.6), () => ML([['adentro:  ', 'J', P.teal], ['a, e, i, o, u', 'i']], CX, 1430, 60, { id: 'in' }));
    fade(A(t, 9.4), () => ML([['afuera:  ', 'J', P.mute], ['m, t, s, r', 'i']], CX, 1550, 60, { id: 'out' }));
  },
  pert(t) {
    const no = A(t, 24.8, .4), st = { a: { col: no < .5 ? P.teal : P.ink, ping: ping(t, 1.0) } }; if (t > 24.8) st.m = { col: P.coral, ping: ping(t, 25.2), pc: P.coral };
    base({ st });
    const gl = A(t, 8.4, .4) * (1 - no);
    fade(A(t, 2.0) * (1 - no), () => {
      const r = ML(stmt('a', '∈'), CX, FY + 20, 160, { id: 'ain' });
      if (gl > 0) fade(gl, () => { X.save(); X.shadowColor = P.teal; X.shadowBlur = 40; X.font = fontOf('m', 160); X.fillStyle = P.teal; X.fillText(' ∈ ', r.x0 + r.pos[1][0], FY + 20); X.restore(); });
    }, (1 - A(t, 2.0)) * 20);
    fade(win(t, 3.0, 12.2), () => T('«a pertenece a V»', CX, 1570, { s: 44, a: 'c', c: P.mute }));
    fade(win(t, 12.4, 24.6), () => T('«a es elemento de V»', CX, 1570, { s: 44, a: 'c', c: P.mute }));
    fade(win(t, 17.2, 24.6), () => { glyph('ε', 380, 1740, 120, P.ink, 'r'); stroke(P.mute, 4, () => { X.moveTo(470, 1705); X.lineTo(590, 1705); X.moveTo(570, 1688); X.lineTo(592, 1705); X.lineTo(570, 1722); }); glyph('∈', 690, 1740, 120, P.teal, 'm'); tag('épsilon', 380, 1790, P.mute, { s: 28, pass: true }); tag('pertenece', 690, 1790, P.mute, { s: 28, pass: true }); });
    fade(A(t, 25.2), () => ML(stmt('m', '∉'), CX, FY + 20, 160, { id: 'mout' }), (1 - A(t, 25.2)) * 20);
    fade(A(t, 25.8), () => T('«m no pertenece a V»', CX, 1570, { s: 44, a: 'c', c: P.mute }));
  },
  ext(t) {
    const parts = setLine('V', D.VOWELS), size = 108, L = mlMeasure(parts, size), x0 = CX - L.w / 2, fl = k => eio(seg(t, 2.0 + k * .3, 3.3 + k * .3));
    const an = win(t, 9.6, 18.2), hi = i => (an > 0 && ((i === 0 && t > 9.8) || (i === 1 && t > 10.4) || ((i === 2 || i === parts.length - 1) && t > 11.0) || (i >= 4 && i % 2 === 0 && i < parts.length - 1 && t > 12.2)) ? P.teal : null);
    const st = {}; D.VOWELS.forEach((ch, k) => { if (t > 2 + k * .3 && t < 9) st[ch] = { col: P.teal }; });
    base({ st });
    ML(parts, CX, FY, size, { id: 'ext', nr: t < 5.4, col: hi, alpha: i => (i >= 3 && i % 2 === 1 && i < parts.length - 1 ? (fl((i - 3) / 2) >= 1 ? 1 : 0) : parts[i][0] === '{' || parts[i][0] === '}' ? A(t, 4.4, .3) : i < 2 ? A(t, 5.0, .4) : A(t, 4.2, .3)) });
    D.VOWELS.forEach((ch, k) => { const p = fl(k); if (p <= 0 || p >= 1) return; fade(clamp(p * 4), () => glyph(ch, lerp(EL[ch][0] + 40, x0 + L.pos[3 + 2 * k][0], p), lerp(EL[ch][1] - 14, FY, p) - Math.sin(Math.PI * p) * 40, lerp(62, size, p), P.teal, 'i', 'l')); });
    const mid = i => x0 + L.pos[i][0] + L.pos[i][1] / 2, lab = (s, i, t0, low) => { const k = A(t, t0); fade(k * an, () => { tick(mid(i), FY + 30, FY + (low ? 122 : 66), P.teal, k); tag(s, mid(i), FY + (low ? 166 : 108), P.teal); }); };
    lab('nombre', 0, 9.8); lab('signo igual', 1, 10.4, true); lab('llaves', 2, 11.0); fade(A(t, 11.0) * an, () => tick(mid(parts.length - 1), FY + 30, FY + 66, P.teal, 1)); lab('comas', 8, 12.2, true);
    fade(A(t, 12.2) * an, () => { for (const i of [4, 6, 10]) tick(mid(i), FY + 30, FY + 56, P.teal, 1); });
    [['(', ')', 1610, 19.0], ['[', ']', 1730, 20.4]].forEach(([o, c, y, ts]) => fade(A(t, 18.6), () => {
      const p2 = [[o, 'm'], ...setLine('V', D.VOWELS).slice(3, -1), [c, 'm']], r = ML(p2, CX, y, 72, { id: 'bad' + o, col: () => P.mute });
      const k = eo(seg(t, ts, ts + .4)); if (k > 0) stroke(P.coral, 6, () => { X.moveTo(r.x0 - 16, y - 24); X.lineTo(r.x0 - 16 + (r.w + 32) * k, y - 24); });
    }));
  },
  comp(t) {
    const st = {}; if (t > 34.6) st.a = { col: P.teal, ping: ping(t, 34.6) }; if (t > 38.2) st.m = { col: P.coral, ping: ping(t, 38.2), pc: P.coral };
    base({ st });
    const rd = t > 9.0 && t < 16.4 ? Math.min(7, Math.floor((t - 9.0) / 7.4 * 8)) : -1;
    const hi = i => (i === rd ? P.teal : t > 17.8 && t < 24.9 && (i === 3 || i === 5) ? P.teal : t > 25.2 && t < 33.1 && i === 4 ? P.teal : t > 33.4 && i === 6 ? P.teal : null);
    const r = ML(COMP, CX, FY, 88, { id: 'comp', col: hi, alpha: i => A(t, 1.5 + i * .12, .35) });
    const under = (s, i, a, b) => fade(win(t, a, b), () => { tick(r.mid(i), FY + 28, FY + 62, P.teal, 1); tag(s, r.mid(i), FY + 104, P.teal, { s: 36 }); });
    if (t > 18.6 && t < 24.6) { const seq = ['a', 'm', 'e', 't', 'u'], q = (t - 18.6) / 1.2, j = Math.min(4, Math.floor(q)), f = eio(clamp((q - j) * 2.2)), A0 = EL[seq[Math.max(0, j - 1)]], A1 = EL[seq[j]], ok = D.VOWELS.includes(seq[j]);
      const px = lerp(A0[0], A1[0], j ? f : 1), py = lerp(A0[1], A1[1], j ? f : 1); fade(win(t, 18.6, 24.6, .3), () => { stroke(f >= 1 ? (ok ? P.teal : P.mute) : P.ink, 5, () => X.arc(px, py, 34, 0, 7)); glyph('x', px - 52, py + 62, 62, f >= 1 && ok ? P.teal : P.ink); }); }
    under('un elemento cualquiera', 3, 18.2, 24.8); under('«tal que»', 4, 25.6, 33.0); under('la condición', 6, 33.8, 42.8);
    fade(win(t, 28.5, 33.0), () => ML([['{', 'm'], ['x', 'i'], [' | ', 'm', P.teal], ['x', 'i'], [' es una vocal', 'r'], ['}', 'm']], CX, 1700, 64, { id: 'bar' }));
    fade(A(t, 34.6), () => ML([['a', 'i'], [' es una vocal, así que  ', 'r'], ...stmt('a', '∈')], CX, 1660, 54, { id: 'ev1' }));
    fade(A(t, 38.2), () => ML([['m', 'i'], [' no es una vocal, así que  ', 'r'], ...stmt('m', '∉')], CX, 1760, 54, { id: 'ev2' }));
  },
  dos(t) {
    const x = A(t, 8.5, .6);
    base({ va: 1 });
    oval(CX, 825, 470, 420, eio(seg(t, 9.0, 10.6)), { lw: 6, dash: [16, 14], col: P.teal });
    fade(A(t, 10.4), () => glyph('L', 105, 470, 76, P.teal));
    fade((1 - x) * A(t, 1.0), () => { ML(setLine('V', D.VOWELS), CX, 1420, 84, { id: 'd1' }); fade(A(t, 2.2), () => ML(COMP, CX, 1570, 76, { id: 'd2' })); fade(A(t, 3.4), () => tag('el mismo conjunto', CX, 1670, P.teal, { s: 38 })); });
    fade(A(t, 10.6), () => ML([['L', 'i'], [' = ', 'm'], ['{', 'm'], ['a, b, c, d, e, f, …, z', 'i'], ['}', 'm']], CX, 1420, 70, { id: 'l1', col: () => P.mute }));
    fade(A(t, 12.4), () => { ML([['L', 'i'], [' = ', 'm'], ['{', 'm'], ['x', 'i'], [' : ', 'm'], ['x', 'i'], [' es una letra', 'r'], ['}', 'm']], CX, 1570, 76, { id: 'l2' }); tag('más corta', CX, 1670, P.teal, { s: 38 }); });
  },
  orden(t) {
    base({});
    const size = 88, cell = 78, gap = 44, n = 5, w0 = n * cell + (n - 1) * gap, xs = k => CX + 70 - w0 / 2 + k * (cell + gap) + cell / 2;
    const line = (y, order, a, nm) => fade(a, () => {
      X.save(); glyph(nm, xs(0) - cell / 2 - 190, y, size); glyph('=', xs(0) - cell / 2 - 110, y, size, P.ink, 'm'); glyph('{', xs(0) - cell / 2 - 38, y, size, P.ink, 'm'); glyph('}', xs(4) + cell / 2 + 34, y, size, P.ink, 'm');
      for (let k = 0; k < 4; k++) glyph(',', xs(k) + cell / 2 + 10, y, size, P.ink, 'r');
      order(y); X.restore();
      recBox('ord' + y, 'V = {…}', xs(0) - 260, y - 70, xs(4) + 80, y + 22, true);
    });
    line(1400, y => D.VOWELS.forEach((ch, k) => glyph(ch, xs(k), y, size)), A(t, 1.0), 'V');
    line(1540, y => D.VOWELS.forEach((ch, k) => { const p = eio(seg(t, 10.5 + k * .1, 12.3 + k * .1)); glyph(ch, lerp(xs(k), xs(4 - k), p), y - Math.sin(Math.PI * p) * 56 * (k % 2 ? 1 : -1), size, P.teal); }), A(t, 2.2), 'W');
    fade(A(t, 3.6), () => ML([['V', 'i'], [' = ', 'm'], ['W', 'i']], CX, 1680, 96, { id: 'VW', col: () => P.teal }));
    fade(win(t, 4.4, 8.7), () => tag('los mismos elementos', CX, 1770, P.mute));
    fade(A(t, 12.8), () => tag('otro orden, los mismos elementos', CX, 1770, P.mute));
  },
  rep(t) {
    const W5 = [...D.WORD], tx = k => CX + (k - 2) * 150;
    W5.forEach((ch, k) => fade(A(t, .8 + k * .12, .4), () => { stroke(P.ink, 5, () => X.roundRect(tx(k) - 62, 520, 124, 124, 16)); glyph(ch, tx(k), 612, 96); }));
    const drop = eio(seg(t, 2.0, 2.9)), tw = [0, 1, 2, 0, 1];
    W5.forEach((ch, k) => {
      if (drop <= 0) return; const m = k >= 3 ? eio(seg(t, k === 3 ? 3.0 : 4.4, k === 3 ? 4.2 : 5.6)) : 0; if (m >= 1) return;
      const x = lerp(tx(k), tx(tw[k]), m), y = lerp(612, 930, drop) - Math.sin(Math.PI * m) * 90;
      fade(drop * (k >= 3 ? 1 - m * .4 : 1), () => { dot(x, y - 30 + 78, { r: 9, col: k >= 3 ? P.coral : P.ink }); glyph(ch, x, y, 96, k >= 3 ? P.coral : P.ink); });
    });
    [[0, 4.2], [1, 5.6]].forEach(([k, ts]) => { const p = ping(t, ts, .8); if (p > 0) stroke(P.teal, 5 * (1 - p), () => X.arc(tx(k), 900, 40 + 60 * eo(p), 0, 7)); });
    oval(tx(1), 915, 300, 150, eio(seg(t, 5.6, 6.6)), { fill: .14 });
    fade(A(t, 6.4), () => glyph('T', 880, 800, 76));
    fade(A(t, 6.2), () => ML(setLine('T', ['s', 'a', 'l']), CX, FY, 108, { id: 'T' }), (1 - A(t, 6.2)) * 18);
    fade(A(t, 9.8), () => { tag('la palabra: 5 letras', CX, 716, P.mute, { s: 38 }); });
    fade(A(t, 11.6), () => { tag('el conjunto: 3 elementos', CX, 1150, P.teal, { s: 38 }); });
    fade(A(t, 13.2), () => tag('un elemento está o no está: no puede estar dos veces', CX, 1590, P.mute, { s: 34 }));
  },
  card(t) {
    const st = {}; D.VOWELS.forEach((ch, k) => { if (t > 2.0 + k * .6) st[ch] = { col: P.teal, ping: ping(t, 2.0 + k * .6) }; });
    base({ st });
    D.VOWELS.forEach((ch, k) => fade(A(t, 2.0 + k * .6, .3), () => T(String(k + 1), EL[ch][0] - 44, EL[ch][1] + 15, { s: 42, w: 600, c: P.teal, a: 'c', pass: true })));
    fade(A(t, 5.6), () => ML([['n', 'i'], ['(', 'm'], ['V', 'i'], [')', 'm'], [' = ', 'm'], ['5', 'r', P.teal]], CX, FY + 20, 160, { id: 'nV' }), (1 - A(t, 5.6)) * 20);
    fade(A(t, 9.8), () => T('«el cardinal de V es 5»', CX, 1570, { s: 44, a: 'c', c: P.mute }));
    fade(A(t, 11.4), () => ML([...setLine('T', ['s', 'a', 'l']), ['        ', 'r'], ['n', 'i'], ['(', 'm'], ['T', 'i'], [')', 'm'], [' = ', 'm'], ['3', 'r', P.teal]], CX, 1720, 68, { id: 'nT' }));
  },
  ojo(t) {
    X.save(); X.translate(0, -150);
    fade(A(t, 1.2), () => { dot(300, 760, { col: P.teal, ping: ping(t, 1.2) }); glyph('a', 340, 746, 62, P.teal); });
    oval(760, 760, 130, 130, eio(seg(t, 2.4, 3.4)), { fill: .14 });
    fade(A(t, 1.8), () => { dot(745, 770, {}); glyph('a', 785, 756, 62); });
    fade(A(t, 3.6), () => { tag('un elemento', 300, 960, P.mute, { s: 36 }); tag('un conjunto', 760, 960, P.mute, { pass: true }); });
    fade(A(t, 4.4), () => { glyph('a', 300, 1180, 170, P.teal); ML([['{', 'm'], ['a', 'i'], ['}', 'm']], 760, 1180, 170, { id: 'seta' }); glyph('≠', 530, 1170, 120, P.coral, 'm'); });
    X.restore();
    const y = 1340;
    fade(A(t, 9.8), () => { ML(stmt('a', '∈'), 300, y, 100, { id: 'o1' }); });
    fade(A(t, 10.2), () => tag('a es una vocal', 300, y + 100, P.teal));
    fade(A(t, 12.6), () => { ML([['{', 'm'], ['a', 'i'], ['}', 'm'], [' ∉ ', 'm', P.coral], ['V', 'i']], 760, y, 100, { id: 'o2' }); });
    fade(A(t, 13.0), () => tag('{a} no es una vocal', 760, y + 100, P.coral));
    fade(A(t, 13.8), () => ML([['{a}', 'i'], [' es un conjunto, no una letra', 'J', P.mute]], CX, 1640, 50, { id: 'why' }));
  },
  fin(t) {
    fade(A(t, .4), () => { X.fillStyle = P.teal; X.fillRect(90, 180, 40, 4); T('EN RESUMEN', 146, 196, { s: 28, w: 600, ls: 5, c: P.teal }); });
    const rows = [() => T(D.SUM[0], 90, 0, { s: 52, max: 900 }), () => ML([...stmt('a', '∈'), ['      ', 'r'], ...stmt('m', '∉')], 90, 0, 70, { a: 'l', id: 's1' }), () => ML(setLine('V', D.VOWELS), 90, 0, 70, { a: 'l', id: 's2' }),
      () => ML(COMP, 90, 0, 66, { a: 'l', id: 's3' }), () => T(D.SUM[4], 90, 0, { s: 52 }), () => ML([['n', 'i'], ['(', 'm'], ['V', 'i'], [')', 'm'], [' = ', 'm'], ['5', 'r', P.teal]], 90, 0, 70, { a: 'l', id: 's5' })];
    rows.forEach((fn, i) => { const ts = .8 + i * 1.6, k = A(t, ts, .5), y = 340 + i * 168; fade(k, () => { T('0' + (i + 1), 90, y - 76, { s: 26, w: 600, ls: 3, c: P.teal, pass: true }); X.save(); X.translate(0, y); fn(); X.restore(); X.fillStyle = 'rgba(232,236,255,.16)'; X.fillRect(90, y + 36, 900 * eo(seg(t, ts, ts + .8)), 1.5); }, (1 - k) * 20); });
    const [te, e1, e2] = D.END;
    [e1, e2].forEach((s, i) => { const k = A(t, te + i * .3, .6); fade(k, () => T(s, 90, 1470 + i * 86, { s: 68, w: 600, c: i ? P.teal : P.ink, max: 900 }), (1 - k) * 22); });
    fade(A(t, te + 1.0), () => T('ZUKA · ÁLGEBRA · TEORÍA DE CONJUNTOS', CX, 1760, { s: 24, w: 600, ls: 5, c: P.mute, a: 'c', pass: true }));
  },
};

// ---------- fondo, rótulos y avance ----------
let NOISE = null;
// Fondo negro, sin cuadrícula: solo un resplandor morado muy tenue detrás del diagrama.
function backdrop() {
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  const g = X.createRadialGradient(CX, 864, 0, CX, 864, 900); g.addColorStop(0, 'rgba(124,92,255,.10)'); g.addColorStop(1, 'rgba(124,92,255,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
}
function noise() {
  if (!NOISE) { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), im = x.createImageData(256, 256), R = rng(7); for (let i = 0; i < im.data.length; i += 4) { const v = R() < .5 ? 0 : 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 8; } x.putImageData(im, 0, 0); NOISE = X.createPattern(c, 'repeat'); }
  X.fillStyle = NOISE; X.fillRect(0, 0, W, H);
}
function caption(t) {
  for (const [a, b, k, l1, l2] of D.CAPS) {
    if (t < a || t > b) continue;
    const out = 1 - seg(t, b - .25, b), kc = /^NO |CUIDADO/.test(k) ? P.coral : P.teal;
    fade(A(t, a, .4) * out, () => { X.fillStyle = kc; X.fillRect(90, 180, 40 * eo(seg(t, a, a + .5)), 4); /[∈∉]/.test(k) ? TS(k, 146, 196, 28) : T(k, 146, 196, { s: 28, w: 600, ls: 5, c: kc }); });
    [l1, l2].forEach((l, i) => { const k2 = A(t, a + .1 + i * .12, .45); fade(k2 * out, () => TS(l, 90, 286 + i * 76, 60), (1 - k2) * 20); });
  }
}
function progress(t, i) {
  X.fillStyle = 'rgba(232,236,255,.14)'; X.fillRect(90, 1856, 900, 3); X.fillStyle = hexA(P.teal, .8); X.fillRect(90, 1856, 900 * t / D.DUR, 3);
  D.SC.forEach(s => { X.fillStyle = s.t0 <= t ? P.teal : 'rgba(232,236,255,.3)'; X.fillRect(90 + 900 * s.t0 / D.DUR - 1, 1850, 2, 15); });
  T(String(i + 1).padStart(2, '0') + ' · ' + D.SC[i].name.toUpperCase(), 90, 1832, { s: 22, w: 600, ls: 3, c: P.mute, pass: true });
}
function film(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.setLineDash([]);
  backdrop();
  let i = D.SC.findIndex(s => t < s.t1); if (i < 0) i = D.SC.length - 1;
  const sc = D.SC[i], lt = t - sc.t0, k = i ? seg(lt, 0, .5) : 1;
  if (k < 1) fade(1 - k * k, () => S[D.SC[i - 1].id](D.SC[i - 1].t1 - D.SC[i - 1].t0));
  fade(k, () => S[sc.id](lt));
  X.setLineDash([]);
  caption(t); progress(t, i);
}
