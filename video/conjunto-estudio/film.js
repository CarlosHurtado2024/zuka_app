// «¿Qué es un conjunto?» · versión estudio. Canvas 2D, 1080×1920, todo función pura de t. Los tiempos y textos están en data.js.
// Escenario oscuro con retícula fina, un solo acento (ámbar = el conjunto), coral solo mientras dura el problema.
// Cuatro niveles unidos por un zoom continuo: biblioteca → la lista → dos maneras de escribirla → aleatorio, repetidos y cardinal.
const W = 1080, H = 1920, CX = 540, CY = 960;
let X;
const P = { ink: '#EEF1FF', mute: '#8C96C2', dim: '#566089', amber: '#FFC53D', coral: '#FF6A6A', line: 'rgba(255,255,255,.09)' };

// ---------- suavizados ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const back = (k, s = 1.3) => { k = clamp(k) - 1; return 1 + k * k * ((s + 1) * k + s); };
const A = (t, t0, d = .35) => eo(seg(t, t0, t0 + d));
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, eio((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1][1];
}
const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- texto ----------
const FJ = (s, w = 500, it = false) => `${it ? 'italic ' : ''}${w} ${s}px Jost, 'Cambria Math', sans-serif`;
const FM = (s, it = false) => `${it ? 'italic ' : ''}400 ${s}px Cambria, 'Cambria Math', serif`;
let REC = null, STEADY = true;
function recBox(id, text, x0, y0, x1, y1, pass) {
  if (!REC) return;
  if (pass ? X.globalAlpha < .3 : (X.globalAlpha < .8 || !STEADY)) return;
  const m = X.getTransform(), p = (x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f], a = p(x0, y0), b = p(x1, y1);
  REC.push({ id: id || text, text, x0: Math.min(a[0], b[0]), y0: Math.min(a[1], b[1]), x1: Math.max(a[0], b[0]), y1: Math.max(a[1], b[1]), pass: !!pass });
}
function T(str, x, y, o = {}) {
  const s = o.s || 40;
  X.font = o.f || FJ(s, o.w || 500, o.it); X.letterSpacing = (o.ls || 0) + 'px'; X.fillStyle = o.c || P.ink;
  const w = X.measureText(str).width, wf = o.txt ? X.measureText(o.txt).width : w, k = o.max && wf > o.max ? o.max / wf : 1;
  const x0 = o.a === 'c' ? x - wf * k / 2 : o.a === 'r' ? x - wf * k : x;
  X.save(); X.translate(x0, y); X.scale(k, k); X.fillText(str, 0, 0); X.restore();
  X.letterSpacing = '0px';
  if (!o.nr) recBox(o.id, o.txt || str, x0, y - s * .78 * k, x0 + wf * k, y + s * .22 * k, o.pass);
  return w * k;
}
// renglón con varias letras: 'j' Jost (nombres), 'i' cursiva de libro (variables), 'm' símbolos, 'b' número destacado
const fontOf = (k, s) => (k === 'J' ? FJ(s, 500) : k === 'S' ? FM(s * 1.16) : k === 'j' ? FJ(s * .88, 500) : k === 'b' ? FJ(s, 600) : k === 'i' ? FM(s, true) : FM(s));
function mlMeasure(parts, size) { let x = 0; const pos = []; for (const [s, k] of parts) { X.font = fontOf(k, size); const w = X.measureText(s).width; pos.push([x, w]); x += w; } return { w: x, pos }; }
function ML(parts, x, y, size, o = {}) {
  const L = mlMeasure(parts, size), x0 = o.a === 'l' ? x : x - L.w / 2, ga = X.globalAlpha;
  parts.forEach(([s, k, c], i) => {
    const a = o.alpha ? o.alpha(i) : 1; if (a <= 0) return;
    X.font = fontOf(k, size); X.fillStyle = c || P.ink; X.globalAlpha = ga * a; X.fillText(s, x0 + L.pos[i][0], y);
  });
  X.globalAlpha = ga;
  if (!o.nr) recBox(o.id, parts.map(p => p[0]).join(''), x0, y - size * .8, x0 + L.w, y + size * .25, o.pass);
  return { x0, w: L.w, pos: L.pos };
}
const notM = names => { const p = [['M', 'i'], [' = ', 'm'], ['{', 'm', P.amber]]; names.forEach((n, i) => { p.push([n, 'j']); if (i < names.length - 1) p.push([', ', 'm']); }); p.push(['}', 'm', P.amber]); return p; };
// renglón de texto con ∈ o ∉ dentro: el símbolo va en letra de libro y en color
function TS(str, x, y, s, o = {}) {
  if (!/[∈∉]/.test(str)) return T(str, x, y, { s, w: o.w || 500, c: o.c, max: 900 });
  return ML(str.split(/([∈∉])/).filter(Boolean).map(q => (/[∈∉]/.test(q) ? [q, 'S', q === '∈' ? P.amber : P.coral] : [q, 'J', o.c])), x, y, s, { a: 'l' });
}
function fade(a, fn, dy = 0) { if (a <= .003) return; X.save(); X.globalAlpha *= a; if (dy) X.translate(0, dy); fn(); X.restore(); }

// ---------- superficies e iconos ----------
function rr(x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, r); }
function panel(x, y, w, h, r = 28, o = {}) {
  X.save(); X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = o.blur ?? 36; X.shadowOffsetY = o.dy ?? 16;
  rr(x, y, w, h, r); const g = X.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, o.top || '#182040'); g.addColorStop(1, o.bot || '#10162E'); X.fillStyle = g; X.fill(); X.restore();
  rr(x + .75, y + .75, w - 1.5, h - 1.5, r); X.strokeStyle = o.stroke || P.line; X.lineWidth = o.lw || 1.5; X.stroke();
}
function glowStroke(col, lw, blur, draw) { X.save(); X.strokeStyle = col; X.lineWidth = lw; X.shadowColor = col; X.shadowBlur = blur; X.lineCap = 'round'; X.lineJoin = 'round'; draw(); X.stroke(); X.restore(); }
function cover(s, x, y, w, h, r) {
  X.save(); rr(x, y, w, h, r); X.clip();
  const g = X.createLinearGradient(x, y, x + w * .3, y + h); g.addColorStop(0, s.c[0]); g.addColorStop(1, s.c[1]); X.fillStyle = g; X.fillRect(x, y, w, h);
  const dx = x + s.d[0] * w, dy = y + s.d[1] * h, u = Math.min(w, h);
  if (s.k === 'marea') {
    const gl = X.createRadialGradient(dx, dy, 0, dx, dy, u * .6); gl.addColorStop(0, hexA(s.c[2], .6)); gl.addColorStop(1, hexA(s.c[2], 0)); X.fillStyle = gl; X.fillRect(x, y, w, h);
    X.fillStyle = s.c[2]; X.beginPath(); X.arc(dx, dy, u * .12, 0, 7); X.fill();
    X.fillStyle = hexA(s.c[1], .82); X.fillRect(x, y + h * .64, w, h * .36);
    X.strokeStyle = hexA(s.c[2], .45); X.lineWidth = Math.max(1, u * .012);
    for (let i = 0; i < 3; i++) { const yy = y + h * (.72 + i * .085); X.beginPath(); for (let k = 0; k <= 24; k++) { const xx = x + w * k / 24, v = yy + Math.sin(k * .9 + i * 1.7 + s.d[0] * 6) * u * .012; k ? X.lineTo(xx, v) : X.moveTo(xx, v); } X.stroke(); }
  } else if (s.k === 'insomnio') {
    X.lineWidth = Math.max(1, u * .014);
    for (let i = 1; i <= 7; i++) { X.strokeStyle = hexA(s.c[2], Math.max(.06, .6 - i * .08)); X.beginPath(); X.arc(dx, dy, u * .1 * i, 0, 7); X.stroke(); }
  } else {
    X.translate(x + w / 2, y + h / 2); X.rotate(-.62); X.fillStyle = hexA(s.c[2], .5);
    for (let i = -7; i <= 7; i++) X.fillRect(i * u * .17 + (s.n === 'Faro' ? u * .05 : 0), -u * 1.5, u * (s.n === 'Faro' ? .035 : .075), u * 3);
  }
  X.restore();
  rr(x + .5, y + .5, w - 1, h - 1, r); X.strokeStyle = 'rgba(255,255,255,.16)'; X.lineWidth = 1; X.stroke();
}
function magnifier(x, y, s, col) { X.save(); X.strokeStyle = col; X.lineWidth = s * .16; X.lineCap = 'round'; X.beginPath(); X.arc(x - s * .12, y - s * .12, s * .5, 0, 7); X.moveTo(x + s * .26, y + s * .26); X.lineTo(x + s * .62, y + s * .62); X.stroke(); X.restore(); }
function shuffleIcon(x, y, s, col, lw = 4) {
  X.save(); X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath();
  X.moveTo(x - s, y - s * .5); X.bezierCurveTo(x - s * .2, y - s * .5, x + s * .1, y + s * .5, x + s * .8, y + s * .5);
  X.moveTo(x - s, y + s * .5); X.bezierCurveTo(x - s * .2, y + s * .5, x + s * .1, y - s * .5, x + s * .8, y - s * .5);
  for (const yy of [y - s * .5, y + s * .5]) { X.moveTo(x + s * .52, yy - s * .28); X.lineTo(x + s * .86, yy); X.lineTo(x + s * .52, yy + s * .28); }
  X.stroke(); X.restore();
}
function badge(x, y, r, kind, col, k = 1) {
  if (k <= 0) return; const s = back(k); X.save(); X.translate(x, y); X.scale(s, s); X.globalAlpha *= clamp(k * 2);
  X.beginPath(); X.arc(0, 0, r, 0, 7); X.fillStyle = '#0B1024'; X.fill(); X.strokeStyle = col; X.lineWidth = 2.5; X.stroke();
  X.strokeStyle = col; X.fillStyle = col; X.lineWidth = r * .2; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath();
  if (kind === 'tick') { X.moveTo(-r * .42, 0); X.lineTo(-r * .1, r * .32); X.lineTo(r * .45, -r * .32); X.stroke(); }
  else if (kind === 'x') { X.moveTo(-r * .34, -r * .34); X.lineTo(r * .34, r * .34); X.moveTo(r * .34, -r * .34); X.lineTo(-r * .34, r * .34); X.stroke(); }
  else if (kind === 'heart') { const q = r * .5; X.moveTo(0, q * .9); X.bezierCurveTo(-q * 2, -q * .4, -q * .7, -q * 1.5, 0, -q * .45); X.bezierCurveTo(q * .7, -q * 1.5, q * 2, -q * .4, 0, q * .9); X.fill(); }
  else { X.font = FJ(r * 1.25, 600); X.textAlign = 'center'; X.fillText(kind, 0, r * .44); X.textAlign = 'left'; }
  X.restore();
}
function ring(x, y, r, k, t) {
  if (k <= 0) return; const rr_ = lerp(r * 1.8, r, eo(k));
  X.save(); X.globalAlpha *= clamp(k * 1.5); X.translate(x, y);
  glowStroke(P.amber, 3.5, 18, () => { X.beginPath(); X.arc(0, 0, rr_, 0, 7); });
  X.rotate(t * .5); X.strokeStyle = P.amber; X.lineWidth = 3.5; X.lineCap = 'round';
  for (let i = 0; i < 4; i++) { X.rotate(Math.PI / 2); X.beginPath(); X.moveTo(rr_ + 10, 0); X.lineTo(rr_ + 26, 0); X.stroke(); }
  X.restore();
}

// ---------- fondo ----------
let NOISE = null;
function backdrop(t, u) {
  const g = X.createRadialGradient(CX, 620, 0, CX, 900, 1500); g.addColorStop(0, '#111837'); g.addColorStop(.55, '#0A0E22'); g.addColorStop(1, '#05070F'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  const blob = (x, y, r, col) => { const b = X.createRadialGradient(x, y, 0, x, y, r); b.addColorStop(0, col); b.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = b; X.fillRect(0, 0, W, H); };
  blob(260 + 70 * Math.sin(t * .11), 420 + 50 * Math.cos(t * .09), 760, 'rgba(61,123,255,.13)');
  blob(860 + 60 * Math.cos(t * .08), 1480 + 60 * Math.sin(t * .1), 700, 'rgba(126,92,255,.09)');
  // retícula sin fin: al ampliar aparecen líneas más finas y el dibujo vuelve a ser el mismo
  const L = u * Math.log2(D.K), f = L - Math.floor(L);
  const grid = (sp, a) => { if (a <= .004) return; X.strokeStyle = `rgba(150,172,255,${a})`; X.lineWidth = 1; X.beginPath(); for (let x = CX % sp; x < W; x += sp) { X.moveTo(Math.round(x) + .5, 0); X.lineTo(Math.round(x) + .5, H); } for (let y = CY % sp; y < H; y += sp) { X.moveTo(0, Math.round(y) + .5); X.lineTo(W, Math.round(y) + .5); } X.stroke(); };
  grid(60 * Math.pow(2, f), .06); grid(30 * Math.pow(2, f), .06 * f);
  const v = X.createRadialGradient(CX, CY, 500, CX, CY, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); X.fillStyle = v; X.fillRect(0, 0, W, H);
}
function noise() {
  if (!NOISE) { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), im = x.createImageData(256, 256), R = rng(7); for (let i = 0; i < im.data.length; i += 4) { const v = R() < .5 ? 0 : 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 9; } x.putImageData(im, 0, 0); NOISE = X.createPattern(c, 'repeat'); }
  X.fillStyle = NOISE; X.fillRect(0, 0, W, H);
}

// ---------- nivel 0: la biblioteca ----------
const S = D.SONGS, MS = D.M.map(i => S[i]);
const TX = i => 90 + (i % 3) * 310, TY = i => 660 + Math.floor(i / 3) * 350, TW_ = 280, TH = 220;
const CARD = { x: 230, y: 800, w: 620, h: 670 };
const MOS = j => [260 + (j % 2) * 290, 830 + Math.floor(j / 2) * 232, 270, 212];
const P0 = [540, 1052];
const SCAN = [20.8, 22.6], scanY = t => lerp(630, 1740, seg(t, SCAN[0], SCAN[1]));
const lockT = i => SCAN[0] + (TY(i) + 110 - 630) / 1110 * (SCAN[1] - SCAN[0]);
function field(t) {
  panel(90, 450, 900, 100, 50, { top: '#1A2244', bot: '#131A36' });
  magnifier(146, 500, 30, P.mute);
  const n1 = Math.floor(seg(t, .9, 2.6) * D.Q1.length + .001), cut = seg(t, 18.4, 18.62), gone = seg(t, 18.62, 18.85);
  let endX = 200;
  if (t >= .9 && gone < 1) {
    X.save(); X.translate(0, 500); X.scale(1, 1 - eio(gone)); X.translate(0, -500); X.globalAlpha *= 1 - gone;
    endX = 200 + T(D.Q1.slice(0, n1), 200, 515, { s: 42, w: 500, id: 'q1', txt: D.Q1, nr: t > 18.3 });
    X.restore();
    if (cut > 0) { X.fillStyle = P.coral; X.fillRect(196, 499, (endX - 192) * eo(cut), 3); }
  }
  if (t >= 18.9) { const n2 = Math.floor(seg(t, 18.9, 20.6) * D.Q2.length + .001); endX = 200 + T(D.Q2.slice(0, n2), 200, 515, { s: 42, w: 500, id: 'q2', txt: D.Q2 }); }
  else if (gone >= 1) endX = 200;
  if (t < 23 && (t < 2.7 || (t > 18.3 && t < 20.7) ? true : (t * 1.6) % 1 < .55)) { X.fillStyle = P.amber; X.fillRect(endX + 6, 478, 3, 46); }
}
function level0(t) {
  field(t);
  // quién opina
  const va = A(t, 6.3, .4) * (1 - seg(t, 18.0, 18.4));
  fade(va, () => {
    let x = 90;
    D.VOTERS.forEach(([name, tv], v) => {
      const on = t >= tv && t < 12.4, w = 86 + name.length * 15;
      rr(x, 578, w, 52, 26); X.fillStyle = on ? 'rgba(255,106,106,.14)' : 'rgba(255,255,255,.04)'; X.fill(); X.strokeStyle = on ? P.coral : P.line; X.lineWidth = 1.5; X.stroke();
      X.beginPath(); X.arc(x + 27, 604, 13, 0, 7); X.fillStyle = on ? P.coral : P.dim; X.fill();
      T(name, x + 50, 614, { s: 28, w: 500, c: on ? P.ink : P.mute, pass: true });
      x += w + 14;
    });
  });
  const cardA = A(t, 23.0, .6);
  // canciones que no son del álbum (quedan atrás) y luego la tarjeta y las cuatro del conjunto
  const drawTile = i => {
    const s = S[i], j = D.M.indexOf(i), isM = j >= 0, a = A(t, 2.7 + i * .08, .5), dec = t >= lockT(i) ? A(t, lockT(i), .3) : 0;
    const g = isM ? eio(seg(t, 23.0 + j * .08, 24.2 + j * .08)) : 0, m = isM ? MOS(j) : null;
    let x = TX(i), y = TY(i) + (1 - a) * 30, w = TW_, h = TH;
    if (t > 12.4 && t < 13.3) x += Math.sin(t * 46 + i * 2.1) * 2 * (1 - seg(t, 12.4, 13.3));
    if (g > 0) { x = lerp(x, m[0], g); y = lerp(y, m[1], g); w = lerp(w, m[2], g); h = lerp(h, m[3], g); }
    const al = a * (isM ? 1 : lerp(1, .38, dec) * (1 - cardA));
    fade(al, () => {
      if (g > 0 && g < 1) { X.save(); X.shadowColor = 'rgba(0,0,0,.6)'; X.shadowBlur = 30; X.shadowOffsetY = 14; rr(x, y, w, h, 20); X.fillStyle = '#000'; X.fill(); X.restore(); }
      cover(s, x, y, w, h, 20);
      if (isM && dec > 0) fade(dec * (1 - g * .6), () => glowStroke(P.amber, 3, 16, () => rr(x - 1, y - 1, w + 2, h + 2, 21)));
      fade(1 - clamp(g * 2.5), () => { T(s.n, x, y + h + 46, { s: 34, w: 500 }); T(s.al, x, y + h + 82, { s: 23, w: 400, c: P.mute, pass: true }); });
      if (isM && dec > 0 && g < 1) badge(x + w - 30, y + 30, 20, 'tick', P.amber, dec * (1 - g));
      // opiniones: corazones que cambian con cada persona y luego la duda
      D.VOTERS.forEach(([, tv, picks], v) => { if (picks.includes(i)) badge(x + w - 30 - v * 46, y + 30, 20, 'heart', P.coral, A(t, tv + picks.indexOf(i) * .08, .25) * (1 - seg(t, 12.1, 12.4))); });
      badge(x + w - 30, y + 30, 20, '?', P.coral, A(t, 12.4 + i * .05, .3) * (1 - seg(t, 18.0, 18.3)));
    });
  };
  S.forEach((s, i) => { if (!s.m) drawTile(i); });
  // línea que revisa la condición
  if (t > SCAN[0] && t < SCAN[1] + .3) fade(1 - seg(t, SCAN[1], SCAN[1] + .3), () => { const y = scanY(t), g = X.createLinearGradient(0, y - 90, 0, y); g.addColorStop(0, 'rgba(255,197,61,0)'); g.addColorStop(1, 'rgba(255,197,61,.16)'); X.fillStyle = g; X.fillRect(60, y - 90, 960, 90); glowStroke(P.amber, 3, 20, () => { X.beginPath(); X.moveTo(60, y); X.lineTo(1020, y); }); });
  fade(cardA, () => {
    panel(CARD.x, CARD.y, CARD.w, CARD.h, 36, { top: '#182040', bot: '#0F152C' });
    fade(A(t, 24.3, .4), () => { T('Marea baja', 270, 1368, { s: 52, w: 600 }); T('la playlist de Sofía', 270, 1416, { s: 28, w: 400, c: P.mute, pass: true }); });
    const gl = A(t, 25.6, .5) * (1 - seg(t, 26.4, 27.2));
    X.beginPath(); X.arc(782, 1384, 40, 0, 7); X.fillStyle = `rgba(255,197,61,${.1 + .2 * gl})`; X.fill(); X.strokeStyle = hexA(P.amber, .5 + .5 * gl); X.lineWidth = 2; X.stroke();
    shuffleIcon(781, 1384, 19, P.amber, 3.5);
  }, (1 - cardA) * 24);
  S.forEach((s, i) => { if (s.m) drawTile(i); });
  const bk = eio(seg(t, 24.2, 25.2));
  if (bk > 0) { const per = 2 * (CARD.w + 28 + CARD.h + 28); glowStroke(P.amber, 4, 22, () => { rr(CARD.x - 14, CARD.y - 14, CARD.w + 28, CARD.h + 28, 46); X.setLineDash([per * bk, per]); }); }
}

// ---------- nivel 1: elementos, notación, ∈ y ∉ ----------
const RY = i => 500 + i * 170, NOT1 = { y: 1272, s: 56 };
const names = MS.map(s => s.n);
function row(s, x, y, w, h, o = {}) {
  panel(x, y, w, h, 24, { blur: 22, dy: 10, stroke: o.stroke });
  const c = h - 32; cover(s, x + 16, y + 16, c, c, 14);
  T(s.n, x + c + 44, y + h / 2 + (o.ts || 46) * .34, { s: o.ts || 46, w: 500, id: o.id, nr: o.nr, pass: o.pass });
}
function chip(s, x, y, kind, col, k) { fade(k, () => { panel(x, y, 350, 110, 24, { blur: 20, dy: 8, stroke: hexA(col, .55) }); cover(s, x + 16, y + 16, 78, 78, 12); T(s.n, x + 114, y + 68, { s: 38, w: 500, pass: true }); badge(x + 306, y + 55, 20, kind, col, k); }, (1 - k) * 16); }
function p1() { const L = mlMeasure(notM(names), NOT1.s); return [CX - L.w / 2 + L.pos[2][0] + L.pos[2][1] / 2, NOT1.y - 18]; }
function level1(t) {
  T('M · MAREA BAJA', 90, 462, { s: 24, w: 600, ls: 4, c: P.mute, pass: true });
  MS.forEach((s, i) => {
    const a = A(t, 30.9 + i * .1, .5), hi = i === 2 ? A(t, 45.4, .3) : 0;
    fade(a, () => { row(s, 90, RY(i), 900, 146, { ts: 52 }); if (hi > 0) fade(hi, () => glowStroke(P.amber, 3, 16, () => rr(89, RY(i) - 1, 902, 148, 25))); }, (1 - a) * 26);
  });
  // los títulos bajan a escribirse entre llaves
  const parts = notM(names), L = mlMeasure(parts, NOT1.s), x0 = CX - L.w / 2, fl = i => eio(seg(t, 38.4 + i * .12, 39.5 + i * .12));
  if (t >= 38.4) {
    ML(parts, CX, NOT1.y, NOT1.s, { id: 'not1', nr: t < 40.6, alpha: i => (i >= 3 && i % 2 === 1 && i < parts.length - 1 ? (fl((i - 3) / 2) >= 1 ? 1 : 0) : parts[i][0] === '{' || parts[i][0] === '}' ? A(t, 39.8, .3) : i < 2 ? A(t, 40.2, .35) : A(t, 39.9, .3)) });
    names.forEach((n, i) => { const k = fl(i); if (k <= 0 || k >= 1) return; const sz = lerp(52, NOT1.s * .88, k); fade(clamp(k * 4), () => T(n, lerp(248, x0 + L.pos[3 + 2 * i][0], k), lerp(RY(i) + 91, NOT1.y, k) - Math.sin(Math.PI * k) * 30, { s: sz, w: 500, c: P.amber, nr: true })); });
    const fb = A(t, 39.8, .2) * (1 - seg(t, 40.0, 40.7)); if (fb > 0) fade(fb, () => { for (const i of [2, parts.length - 1]) { X.save(); X.shadowColor = P.amber; X.shadowBlur = 30; X.font = fontOf('m', NOT1.s); X.fillStyle = P.amber; X.fillText(parts[i][0], x0 + L.pos[i][0], NOT1.y); X.restore(); } });
  }
  // pertenece
  const a1 = A(t, 45.8, .45);
  fade(a1, () => { ML([['Neón', 'j'], [' ∈ ', 'm', P.amber], ['M', 'i']], 90, 1450, 88, { a: 'l', id: 'in' }); T('«Neón pertenece a M»', 92, 1508, { s: 34, w: 400, c: P.mute }); }, (1 - a1) * 20);
  chip(MS[2], 640, 1380, 'tick', P.amber, A(t, 46.2, .4));
  // Eco quiere entrar y la llave no lo deja
  const eco = S[8], bx = x0 + L.w + 8, hit = 52.8;
  if (t >= 51.8 && t < 53.6) {
    const k = t < hit ? eio(seg(t, 51.8, hit)) : 0, r = eo(seg(t, hit, 53.5));
    const ex = t < hit ? lerp(1120, bx, k) : lerp(bx, 656, r) + Math.sin(Math.PI * r) * 60, ey = t < hit ? lerp(1080, NOT1.y - 66, k) : lerp(NOT1.y - 66, 1596, r);
    cover(eco, ex, ey, 78, 78, 12); glowStroke(P.coral, 3, 16, () => rr(ex - 1, ey - 1, 80, 80, 13));
    fade(1 - r, () => T('Eco', ex + 39, ey + 108, { s: 26, w: 600, a: 'c', pass: true }));
    const fl2 = 1 - seg(t, hit, hit + .5); if (t >= hit && fl2 > 0) fade(fl2, () => { X.save(); X.shadowColor = P.coral; X.shadowBlur = 34; X.font = fontOf('m', NOT1.s); X.fillStyle = P.coral; X.fillText('}', x0 + L.pos[parts.length - 1][0] + Math.sin((t - hit) * 60) * 7 * fl2, NOT1.y); X.restore(); });
  }
  chip(eco, 640, 1580, 'x', P.coral, A(t, 53.5, .35));
  const a2 = A(t, 53.3, .45);
  fade(a2, () => { ML([['Eco', 'j'], [' ∉ ', 'm', P.coral], ['M', 'i']], 90, 1650, 88, { a: 'l', id: 'notin' }); T('«Eco no pertenece a M»', 92, 1708, { s: 34, w: 400, c: P.mute }); }, (1 - a2) * 20);
  const q = p1(); ring(q[0], q[1], 46, A(t, 58.4, .6), t);
}

// ---------- nivel 2: por extensión y por comprensión ----------
const GATE = [0, 1, 2, 5, 4, 7], P2 = [404, 1678];
function token(s, x, y, a, lit) { fade(a, () => { cover(s, x - 42, y - 42, 84, 84, 14); if (lit > 0) fade(lit, () => glowStroke(P.amber, 2.5, 12, () => rr(x - 43, y - 43, 86, 86, 15))); T(s.n, x, y + 74, { s: 22, w: 500, a: 'c', c: lit > 0 ? P.ink : P.mute, pass: true }); }); }
function level2(t) {
  const a = A(t, 60.2, .5);
  fade(a * .45 * (1 - A(t, 67.6, .5)), () => { panel(90, 810, 900, 400, 30); T('COMPRENSIÓN', 130, 868, { s: 24, w: 600, ls: 4, c: P.mute, pass: true }); });
  fade(a, () => {
    panel(90, 470, 900, 300, 30); T('EXTENSIÓN', 130, 528, { s: 24, w: 600, ls: 4, c: P.mute, pass: true });
    ML(notM(names), CX, 644, 50, { id: 'ext' }); T('todos los elementos, uno por uno', CX, 722, { s: 32, w: 400, c: P.mute, a: 'c' });
  }, (1 - a) * 24);
  const b = A(t, 67.6, .5), col = A(t, 74.0, .3);
  let cx = 0;
  fade(b, () => {
    panel(90, 810, 900, 400, 30); T('COMPRENSIÓN', 130, 868, { s: 24, w: 600, ls: 4, c: P.mute, pass: true });
    const parts = [['M', 'i'], [' = ', 'm'], ['{', 'm', P.amber], ['x', 'i'], [' : ', 'm', col > .5 ? P.amber : P.ink], ['x', 'i'], [' es canción de Marea baja', 'j'], ['}', 'm', P.amber]];
    const r = ML(parts, CX, 1010, 50, { id: 'comp', alpha: i => A(t, 67.9 + i * .1, .3) }); cx = r.x0 + r.pos[4][0] + r.pos[4][1] / 2;
    if (col > 0) fade(col, () => { X.save(); X.shadowColor = P.amber; X.shadowBlur = 26; X.font = fontOf('m', 50); X.fillStyle = P.amber; X.fillText(' : ', r.x0 + r.pos[4][0], 1010); X.restore(); });
  }, (1 - b) * 24);
  const c2 = A(t, 74.3, .4);
  fade(c2, () => {
    rr(cx - 100, 892, 200, 62, 31); X.fillStyle = 'rgba(255,197,61,.12)'; X.fill(); X.strokeStyle = hexA(P.amber, .7); X.lineWidth = 1.5; X.stroke();
    X.beginPath(); X.moveTo(cx, 954); X.lineTo(cx, 972); X.stroke();
    T('«tal que»', cx, 935, { s: 34, w: 500, c: P.amber, a: 'c', pass: true });
  }, (1 - c2) * 12);
  const c3 = A(t, 75.0, .5);
  fade(c3, () => T('las x tal que x es canción de Marea baja', CX, 1136, { s: 34, w: 400, it: true, c: '#C9D0F2', a: 'c', max: 840 }), (1 - c3) * 14);
  // la condición como una puerta: pasan las que la cumplen
  const g = A(t, 68.8, .5);
  fade(g, () => { glowStroke(P.amber, 3, 16, () => { X.beginPath(); X.moveTo(540, 1310); X.lineTo(540, 1310 + 250 * g); }); T('ES DE MAREA BAJA', 540, 1290, { s: 22, w: 600, ls: 4, c: P.amber, a: 'c', pass: true }); });
  let nm = 0, nn = 0;
  GATE.forEach((si, i) => {
    const s = S[si], t0 = 69.0 + i * .9; if (t < t0) { s.m ? nm++ : nn++; return; }
    const k = eio(seg(t, t0, t0 + .9)); let x = lerp(70, 474, k), y = 1420, al = clamp((t - t0) * 4), lit = 0;
    if (s.m) { const k2 = eio(seg(t, t0 + .9, t0 + 1.5)); x = lerp(x, 624 + nm * 110, k2); lit = k2; nm++; }
    else { const k2 = eio(seg(t, t0 + 1.15, t0 + 1.8)); x = lerp(x, 140 + nn * 110, k2) + (t > t0 + .9 && t < t0 + 1.15 ? Math.sin((t - t0 - .9) * 50) * 5 : 0); al *= lerp(1, .6, k2); nn++; }
    token(s, x, y, al, lit);
  });
  const lb = A(t, 75.2, .4); fade(lb, () => { T('no cumplen', 195, 1560, { s: 24, w: 500, c: P.dim, a: 'c', pass: true }); T('cumplen', 789, 1560, { s: 24, w: 500, c: P.amber, a: 'c', pass: true }); });
  const sh = A(t, 80.4, .45);
  fade(sh, () => { panel(320, 1630, 460, 96, 48, { stroke: hexA(P.amber, .5) }); shuffleIcon(P2[0], P2[1], 22, P.amber, 4); T('aleatorio', 492, 1692, { s: 38, w: 500, pass: true }); }, (1 - sh) * 18);
  ring(P2[0], P2[1], 54, A(t, 80.9, .6), t);
}

// ---------- nivel 3: sin orden, sin repetidos, cardinal ----------
const R3 = s => 470 + s * 170, RH = 146, slotOf = j => D.SHUFFLED.indexOf(j);
function level3(t) {
  const on = A(t, 85.7, .4);
  fade(on, () => { rr(760, 392, 230, 56, 28); X.fillStyle = 'rgba(255,197,61,.12)'; X.fill(); X.strokeStyle = hexA(P.amber, .6); X.lineWidth = 1.5; X.stroke(); shuffleIcon(798, 420, 13, P.amber, 3); T('aleatorio', 826, 430, { s: 28, w: 500, c: P.amber, pass: true }); });
  const mg = seg(t, 100.3, 101.0), dupIn = eio(seg(t, 99.0, 99.9));
  const order = [0, 1, 2, 3].sort((a, b) => Math.abs(.5 - seg(t, 88.4 + a * .1, 89.5 + a * .1)) - Math.abs(.5 - seg(t, 88.4 + b * .1, 89.5 + b * .1))).reverse();
  order.forEach(j => {
    const s = MS[j], a = A(t, 85.6 + j * .1, .5), k = eio(seg(t, 88.4 + j * .1, 89.5 + j * .1));
    const y = lerp(R3(j), R3(slotOf(j)), k), x = 90 + Math.sin(Math.PI * k) * (j % 2 ? 64 : -64), sc = 1 + .04 * Math.sin(Math.PI * k);
    const tw = j === 1 ? A(t, 99.9, .3) * (1 - seg(t, 101.4, 102.0)) : 0;
    fade(a, () => {
      X.save(); X.translate(x + 450, y + RH / 2); X.scale(sc, sc); X.translate(-(x + 450), -(y + RH / 2));
      row(s, x, y, 900, RH, { ts: 52, id: 'r3' + s.n });
      if (tw > 0) fade(tw, () => glowStroke(P.amber, 3, 18, () => rr(x - 1, y - 1, 902, RH + 2, 25)));
      const cs = slotOf(j), ck = A(t, 105.2 + cs * .4, .3);
      if (ck > 0) fade(ck * (1 - seg(t, 111.0, 111.3) * 0), () => { X.beginPath(); X.arc(x + 836, y + RH / 2, 34, 0, 7); X.fillStyle = 'rgba(255,197,61,.14)'; X.fill(); X.strokeStyle = P.amber; X.lineWidth = 2; X.stroke(); T(String(cs + 1), x + 836, y + RH / 2 + 16, { s: 44, w: 600, c: P.amber, a: 'c', pass: true }); });
      X.restore();
    }, (1 - a) * 26);
  });
  // Costa otra vez: entra como quinta fila y se funde con la que ya estaba
  if (t >= 99.0 && mg < 1) {
    const ys = R3(slotOf(1)), y = lerp(R3(4), ys, eio(mg)), x = lerp(1100, 90, dupIn);
    fade(1 - eio(mg), () => { row(MS[1], x, y, 900, RH, { ts: 52, nr: true, stroke: hexA(P.amber, .7) }); });
  }
  const fl = A(t, 100.9, .15) * (1 - seg(t, 101.0, 101.7)); if (fl > 0) fade(fl * .5, () => { rr(90, R3(slotOf(1)), 900, RH, 24); X.fillStyle = P.amber; X.fill(); });
  const na = A(t, 86.0, .45) * (1 - seg(t, 98.6, 98.95));
  fade(na, () => { ML(notM(names), CX, 1290, 52, { id: 'ord1' }); fade(A(t, 93.7, .4), () => { ML(notM(D.SHUFFLED.map(j => names[j])), CX, 1400, 52, { id: 'ord2' }); T('el mismo conjunto M', CX, 1486, { s: 32, w: 400, c: P.mute, a: 'c' }); }); }, (1 - A(t, 86.0, .45)) * 18);
  const to = A(t, 100.0, .3) * (1 - seg(t, 103.9, 104.3));
  fade(to, () => { panel(260, 1396, 560, 92, 46, { top: '#222B52', bot: '#1A2244', stroke: 'rgba(255,255,255,.16)' }); X.beginPath(); X.arc(312, 1442, 9, 0, 7); X.fillStyle = P.amber; X.fill(); T('Ya está en la lista', 340, 1455, { s: 38, w: 500 }); }, (1 - A(t, 100.0, .3)) * 20);
  const ca = A(t, 106.8, .5);
  fade(ca, () => {
    const sc = lerp(.9, 1, back(seg(t, 106.8, 107.3)));
    X.save(); X.translate(CX, 1420); X.scale(sc, sc); X.translate(-CX, -1420);
    ML([['n', 'i'], ['(', 'm'], ['M', 'i'], [')', 'm'], [' = ', 'm'], ['4', 'b', P.amber]], CX, 1470, 160, { id: 'card' });
    X.restore();
    T('cardinal de M', CX, 1566, { s: 36, w: 400, c: P.mute, a: 'c' });
  });
}
const LEVELS = [level0, level1, level2, level3], PORTAL = [() => P0, p1, () => P2];

// ---------- rótulos, avance y resumen ----------
function caption(t) {
  for (const [a, b, k, l1, l2] of D.CAPS) {
    if (t < a || t > b) continue;
    const out = 1 - seg(t, b - .25, b), kc = /PROBLEMA|^NO /.test(k) ? P.coral : P.amber;
    fade(A(t, a, .4) * out, () => { X.fillStyle = kc; X.fillRect(90, 180, 40 * eo(seg(t, a, a + .5)), 4); T(k, 146, 196, { s: 28, w: 600, ls: 5, c: kc }); });
    [l1, l2].forEach((l, i) => { const k2 = A(t, a + .1 + i * .12, .45); fade(k2 * out, () => TS(l, 90, 286 + i * 76, 62), (1 - k2) * 22); });
  }
}
const LNAME = ['01 · COLECCIÓN', '02 · NOTACIÓN', '03 · DOS MANERAS', '04 · ORDEN Y CARDINAL'];
function progress(t, u) {
  const lv = Math.min(3, Math.round(u)), a = (1 - seg(t, 111.4, 112.0)) * clamp(1 - Math.sin(Math.PI * (u - Math.floor(u))) * 3);
  fade(a, () => { for (let i = 0; i < 4; i++) { X.fillStyle = i === lv ? P.amber : i < lv ? hexA(P.amber, .4) : 'rgba(255,255,255,.14)'; X.fillRect(90 + i * 110, 1834, 92, 4); } T(LNAME[lv], 990, 1844, { s: 22, w: 600, ls: 3, c: P.mute, a: 'r', pass: true }); });
}
function summary(t) {
  const a = A(t, 114.3, .7); if (a <= 0) return;
  X.fillStyle = `rgba(6,8,20,${.99 * a})`; X.fillRect(0, 0, W, H);
  fade(A(t, 114.8, .4), () => { X.fillStyle = P.amber; X.fillRect(90, 180, 40, 4); T('EN RESUMEN', 146, 196, { s: 28, w: 600, ls: 5, c: P.amber }); });
  D.SUM.forEach(([ts, s], i) => {
    const k = A(t, ts, .5), y = 330 + i * 190;
    fade(k, () => { T('0' + (i + 1), 90, y, { s: 28, w: 600, ls: 3, c: P.amber, pass: true }); TS(s, 90, y + 76, 60); X.fillStyle = 'rgba(255,255,255,.14)'; X.fillRect(90, y + 112, 900 * eo(seg(t, ts, ts + .8)), 1.5); }, (1 - k) * 22);
  });
  const [te, e1, e2] = D.END;
  [e1, e2].forEach((s, i) => { const k = A(t, te + i * .25, .6); fade(k, () => T(s, 90, 1420 + i * 84, { s: 70, w: 600, c: i ? P.amber : P.ink, max: 900 }), (1 - k) * 24); });
  fade(A(t, te + .8, .6), () => T('ZUKA · ÁLGEBRA · CONJUNTOS', CX, 1790, { s: 24, w: 600, ls: 5, c: P.mute, a: 'c', pass: true }));
}

// ---------- película ----------
function film(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.textAlign = 'left'; X.textBaseline = 'alphabetic'; X.setLineDash([]);
  const u = kf(t, D.U), i = Math.min(3, Math.floor(u + 1e-6)), e = u - i;
  backdrop(t, u);
  STEADY = e < 1e-4;
  if (STEADY) LEVELS[i](t);
  else {
    const z = Math.pow(D.K, e), Pp = PORTAL[i](), sx = lerp(Pp[0], CX, e), sy = lerp(Pp[1], CY, e);
    // rayas de velocidad
    X.save(); X.translate(sx, sy); const R = rng(31 + i), sa = Math.sin(Math.PI * e) * .35;
    for (let k = 0; k < 46; k++) { const an = R() * 6.283, r0 = 180 + R() * 700, len = (120 + R() * 380) * Math.sin(Math.PI * e); X.strokeStyle = `rgba(170,190,255,${sa * (.3 + R() * .7)})`; X.lineWidth = 1 + R() * 2; X.beginPath(); X.moveTo(Math.cos(an) * r0, Math.sin(an) * r0); X.lineTo(Math.cos(an) * (r0 + len), Math.sin(an) * (r0 + len)); X.stroke(); }
    X.restore();
    const a0 = 1 - seg(e, .3, .72), a1 = seg(e, .34, .78);
    if (a0 > 0) { X.save(); X.globalAlpha = a0; X.translate(sx, sy); X.scale(z, z); X.translate(-Pp[0], -Pp[1]); LEVELS[i](t); X.restore(); }
    if (a1 > 0) { X.save(); X.globalAlpha = a1; X.translate(sx, sy); X.scale(z / D.K, z / D.K); X.translate(-CX, -CY); LEVELS[i + 1](t); X.restore(); }
  }
  X.setLineDash([]);
  caption(t); progress(t, u); summary(t);
  noise();
}
