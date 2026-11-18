// Motor común de los videos «showreel matemático» del mundo Teoría de Conjuntos (copia de video/conjunto-cosmos/film.js sin
// sus escenas: lo genera el paso «kit» de la sesión; si cambia allá, volver a copiar). Canvas 2D, 1080×1920, cada cuadro es
// función pura de t. Da: letras (T, F), trazos con brillo (stroke, dot, ring, check), estrellas, fondo, HUD, rótulos y film(t).
// Las escenas de cada película van en su film.js (objeto S) y sus datos en data.js (D).
const W = 1080, H = 1920, CX = 540, SY = 760;   // SY: centro del escenario
let X;
const C = { bg: '#04060e', ink: '#eef2ff', mute: '#7f8ab0', dim: '#3a4263', cyan: '#35e0ff', mag: '#ff4fb0', amber: '#ffc247', violet: '#a78bfa', green: '#5ef2a6', red: '#ff5a6a', blue: '#5b8cff' };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const A = (t, t0, d = .5) => eo(seg(t, t0, t0 + d));                        // aparece en t0
const win = (t, a, b, d = .45) => A(t, a, d) * (1 - seg(t, b - d, b));      // visible entre a y b
const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- texto ----------
const MONO = "Consolas, 'Courier New', monospace";
const font = (k, s) => (k === 'i' ? `italic ${s}px KMath, Georgia, 'Cambria Math', serif` : k === 'it' ? `italic ${s}px KMain, Georgia, serif` : k === 'r' ? `${s}px KMain, 'Cambria Math', Georgia, serif`
  : k === 'mono' ? `${s}px ${MONO}` : k === 'brand' ? `600 ${s}px Jost, sans-serif` : `300 ${s}px Jost, sans-serif`);
function fade(a, fn) { if (a <= .003) return; X.save(); X.globalAlpha *= a; fn(); X.restore(); }
function glow(col, blur, fn) { X.save(); X.shadowColor = col; X.shadowBlur = blur; fn(); X.restore(); }
// Texto suelto. o: k (tipo de letra), s, c, a ('l' | 'c' | 'r'), ls (espaciado), max (ancho máximo: se encoge), g (brillo).
function T(str, x, y, o = {}) {
  const s = o.s || 40; X.font = font(o.k || 'r', s); X.letterSpacing = (o.ls || 0) + 'px'; X.fillStyle = o.c || C.ink;
  const w = X.measureText(str).width, k = o.max && w > o.max ? o.max / w : 1, x0 = o.a === 'c' ? x - w * k / 2 : o.a === 'r' ? x - w * k : x;
  X.save(); if (o.g) { X.shadowColor = o.c || C.ink; X.shadowBlur = o.g; } X.translate(x0, y); X.scale(k, k); X.fillText(str, 0, 0); X.restore(); X.letterSpacing = '0px';
  return w * k;
}
// Renglón de fórmula: partes [texto, tipo ('i' cursiva matemática | 'r' redonda), color]. o.rev (0–1) lo va escribiendo
// parte por parte; o.a alineación; o.max ancho máximo. Devuelve { x0, w, mid(i) }.
function F(parts, x, y, size, o = {}) {
  let wsum = 0; const pos = [];
  for (const [s, k] of parts) { X.font = font(k, size); const w = X.measureText(s).width; pos.push([wsum, w]); wsum += w; }
  const sc = o.max && wsum > o.max ? o.max / wsum : 1, x0 = o.a === 'l' ? x : o.a === 'r' ? x - wsum * sc : x - wsum * sc / 2, rev = o.rev ?? 1, n = parts.length;
  X.save(); X.translate(x0, y); X.scale(sc, sc);
  parts.forEach(([s, k, c], i) => {
    const a = clamp(rev * n - i); if (a <= 0) return;
    X.font = font(k, size); X.fillStyle = c || o.c || C.ink; X.globalAlpha *= a;
    if (c && o.g !== 0) { X.shadowColor = c; X.shadowBlur = o.g ?? 14; } else X.shadowBlur = 0;
    X.fillText(s, pos[i][0], (1 - a) * 10); X.globalAlpha /= a || 1;
  });
  X.restore();
  return { x0, w: wsum * sc, mid: i => x0 + (pos[i][0] + pos[i][1] / 2) * sc };
}
const typed = (s, k) => s.slice(0, Math.ceil(s.length * clamp(k)));
const num = (v, d = 0) => v.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\./g, ' ');

// ---------- trazos ----------
function stroke(col, lw, draw, o = {}) { X.save(); X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; if (o.dash) X.setLineDash(o.dash); if (o.g !== 0) { X.shadowColor = col; X.shadowBlur = o.g ?? 16; } X.beginPath(); draw(); X.stroke(); X.restore(); }
function dot(x, y, r, col, g = 18) { X.save(); X.shadowColor = col; X.shadowBlur = g; X.fillStyle = col; X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); X.restore(); }
function ring(x, y, r, col, lw = 2.5, k = 1, o = {}) { if (k > 0) stroke(col, lw, () => X.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k), o); }
function check(x, y, r, ok, k) { if (k <= 0) return; const c = ok ? C.green : C.red; stroke(c, 4, () => { if (ok) { X.moveTo(x - r, y); X.lineTo(lerp(x - r, x - r * .25, seg(k, 0, .5)), lerp(y, y + r * .7, seg(k, 0, .5))); if (k > .5) X.lineTo(lerp(x - r * .25, x + r, seg(k, .5, 1)), lerp(y + r * .7, y - r * .7, seg(k, .5, 1))); } else { X.moveTo(x - r * .8, y - r * .8); X.lineTo(lerp(x - r * .8, x + r * .8, seg(k, 0, .5)), lerp(y - r * .8, y + r * .8, seg(k, 0, .5))); if (k > .5) { X.moveTo(x + r * .8, y - r * .8); X.lineTo(lerp(x + r * .8, x - r * .8, seg(k, .5, 1)), lerp(y - r * .8, y + r * .8, seg(k, .5, 1))); } } }); }

// ---------- estrellas de fondo ----------
let STARS = null;
function stars(t, a = 1) {
  if (!STARS) { const R = rng(11); STARS = Array.from({ length: 150 }, () => [R() * W, 130 + R() * 1560, .5 + R() * 1.4, R() * 7, .3 + R() * .7]); }
  fade(a, () => { for (const [x, y, r, ph, b] of STARS) { X.globalAlpha = b * (.55 + .45 * Math.sin(t * .9 + ph)) * a; X.fillStyle = '#cfe0ff'; X.beginPath(); X.arc(x, y, r, 0, 7); X.fill(); } X.globalAlpha = 1; });
}


// ---------- fondo, HUD y rótulos ----------
function backdrop() {
  X.fillStyle = C.bg; X.fillRect(0, 0, W, H);
  const g = X.createRadialGradient(CX, SY, 60, CX, SY, 1150); g.addColorStop(0, 'rgba(34,48,110,.34)'); g.addColorStop(.55, 'rgba(14,20,52,.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  const v = X.createRadialGradient(CX, 960, 600, CX, 960, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); X.fillStyle = v; X.fillRect(0, 0, W, H);
}
function corner(x, y, dx, dy) { stroke('rgba(160,180,240,.5)', 2, () => { X.moveTo(x + 26 * dx, y); X.lineTo(x, y); X.lineTo(x, y + 26 * dy); }, { g: 0 }); }
function hud(t, i) {
  const sc = D.SC[i];
  corner(44, 60, 1, 1); corner(1036, 60, -1, 1); corner(44, 1860, 1, -1); corner(1036, 1860, -1, -1);
  T('ZUKA', 70, 112, { k: 'brand', s: 34, ls: 10, c: C.ink });
  T('ÁLGEBRA · TEORÍA DE CONJUNTOS', 70, 146, { k: 'mono', s: 19, ls: 3, c: C.mute });
  T(String(i + 1).padStart(2, '0') + ' / ' + String(D.SC.length).padStart(2, '0'), 1010, 110, { k: 'mono', s: 26, a: 'r', c: C.ink });
  T(sc.name, 1010, 146, { k: 'mono', s: 19, a: 'r', ls: 3, c: C.mute });
  fade(.55 + .45 * Math.sin(t * 3.2), () => dot(838, 101, 6, C.red, 12));
  // la fórmula de la escena, abajo a la izquierda (se escribe al entrar)
  F(D.SCENES[i].formula, 70, 1762, 40, { a: 'l', rev: seg(t - sc.t0, .4, 2.2), max: 700, c: '#d6dcf5' });
  T('t = ' + t.toFixed(2).padStart(6, '0') + ' s', 1010, 1762, { k: 'mono', s: 24, a: 'r', c: C.ink });
  X.fillStyle = 'rgba(160,180,240,.2)'; X.fillRect(70, 1812, 940, 2);
  const gr = X.createLinearGradient(70, 0, 1010, 0); gr.addColorStop(0, C.cyan); gr.addColorStop(.5, C.violet); gr.addColorStop(1, C.mag);
  glow(C.cyan, 10, () => { X.fillStyle = gr; X.fillRect(70, 1811, 940 * t / D.DUR, 4); });
  D.SC.forEach(s => { X.fillStyle = s.t0 <= t ? 'rgba(220,230,255,.8)' : 'rgba(160,180,240,.35)'; X.fillRect(70 + 940 * s.t0 / D.DUR - 1, 1804, 2, 18); });
}
// Título y subtítulo de cada momento, debajo del escenario: serif grande y cursiva.
function caption(lt, sc) {
  for (const [a, b, title, sub] of sc.caps) {
    if (lt < a - .1 || lt > b + .1) continue;
    const out = 1 - seg(lt, b - .35, b);
    fade(A(lt, a, .5) * out, () => T(title, CX, 1590, { k: 'r', s: 62, a: 'c', max: 960 }));
    fade(A(lt, a + .25, .5) * out, () => T(typed(sub, seg(lt, a + .3, a + .3 + Math.min(2.2, sub.length * .035))), CX, 1654, { k: 'it', s: 36, a: 'c', c: '#c3ccec', max: 960 }));
  }
}
function film(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.setLineDash([]); X.shadowBlur = 0;
  backdrop();
  let i = D.SC.findIndex(s => t < s.t1); if (i < 0) i = D.SC.length - 1;
  const sc = D.SC[i], lt = t - sc.t0, k = i ? seg(lt, 0, .35) : 1;
  if (k < 1) fade(1 - k, () => { const p = D.SC[i - 1]; S[p.id](p.t1 - p.t0); });
  fade(k, () => S[sc.id](lt));
  X.setLineDash([]); X.shadowBlur = 0; X.globalAlpha = 1;
  caption(lt, D.SCENES[i]); hud(t, i);
  // corte: un destello breve al cambiar de escena
  if (i && lt < .25) { X.fillStyle = `rgba(190,210,255,${.10 * (1 - lt / .25)})`; X.fillRect(0, 0, W, H); }
}
