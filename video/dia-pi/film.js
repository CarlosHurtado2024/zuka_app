// «¿Por qué el 14 de marzo?» · Caption News (lemo-opuscar), vertical 1080 × 1920, 30 fps, 77 s.
// Franja de video arriba (1080 × 1350), subtítulo grande debajo (bloques que golpean, una palabra clave en bloque miel) y
// un renglón pequeño (la narración y el .srt). Tiempos, textos y números: data.js. EV → mix.py; TEXTS → readcheck.
import * as D from './data.js';
const { W, H, FPS, DUR, SHOTS, CAPS, HOOK } = D;
const cv = document.getElementById('out'), ctx = cv.getContext('2d');

// ---------- ayudas ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const back = (t, s = 1.6) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const C = { bg: '#0E0E0C', panel: '#151512', ink: '#F7F5EF', honey: '#FFC21A', loss: '#FF4A3D', grey: '#8D8B83', rule: 'rgba(255,255,255,.045)', margin: 'rgba(255,74,61,.38)', dim: 'rgba(247,245,239,.78)' };
const F8 = "'IT8'", F5 = "'IT5'", FI = "'IT6I','IT5'";
const XL = 160, XR = 920, BAND = 1350;                 // franja segura de texto (14 %–86 %) y alto de la franja de video
const CAPY = [1402, 1494], SMALLY = 1584, CAPSZ = 84;  // subtítulo grande (dos renglones) y renglón pequeño (≤ 1632)
const GRADE = 'contrast(1.07) saturate(0.92) brightness(0.98)';

// ---------- carga (dibujo síncrono con marcadores; luego carga lo que faltó y dibuja otra vez) ----------
const LOADED = new Map(), NEED = new Set(), PH = { width: 1080, height: 1350, ph: true };
function getImg(src) { const im = LOADED.get(src); if (im) return im; NEED.add(src); return PH; }
function load(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => im.decode().then(() => res(im), () => res(im)); im.onerror = () => rej(new Error('falta ' + src)); im.src = src; })
    .then(im => { LOADED.set(src, im); if (src.startsWith('assets/fr') && LOADED.size > 120) for (const k of LOADED.keys()) if (k.startsWith('assets/fr')) { LOADED.delete(k); break; } });
}
const frameOf = (fr, t) => { const n = Math.round(D.CLIPS[fr].t * FPS) - 1; return getImg(`assets/fr/${fr}_${String(clamp(Math.floor(t * FPS + 1e-6) + 1, 1, n)).padStart(3, '0')}.jpg`); };
const di = (im, ...a) => { if (!im.ph) ctx.drawImage(im, ...a); };

// ---------- dibujo básico ----------
let TX = [];
function text(s, x, y, font, color, align = 'left') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y); }
function tw(s, font) { ctx.font = font; return ctx.measureText(s).width; }
function note(id, s, x0, y0, x1, y1, pass) { TX.push({ id, text: s, x0, y0, x1, y1, pass: pass || undefined }); }
function warm(x, y, w, h, a = .06) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = `rgba(255,170,70,${a})`; ctx.fillRect(x, y, w, h); ctx.restore(); }
// cuadro ya preparado a 1080 × 1350, con empuje z alrededor de (fx, fy)
function plate(im, x, y, w, h, z = 1, fx = .5, fy = .5, filt = GRADE) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const iw = im.width, ih = im.height, s = Math.max(w / iw, h / ih), dw = iw * s * z, dh = ih * s * z;
  const px = x + w * fx, py = y + h * fy, ox = x + (w - iw * s) / 2, oy = y + (h - ih * s) / 2;
  ctx.filter = filt; di(im, px + (ox - px) * z, py + (oy - py) * z, dw, dh); ctx.filter = 'none';
  warm(x, y, w, h); ctx.restore();
}
function bandShade() {                                 // la franja se funde con la tinta de abajo, donde va el subtítulo
  const g = ctx.createLinearGradient(0, 860, 0, BAND); g.addColorStop(0, 'rgba(14,14,12,0)'); g.addColorStop(1, 'rgba(14,14,12,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 860, W, BAND - 860);
  ctx.fillStyle = C.bg; ctx.fillRect(0, BAND, W, H - BAND);
  const t = ctx.createLinearGradient(0, 0, 0, 260); t.addColorStop(0, 'rgba(14,14,12,.6)'); t.addColorStop(1, 'rgba(14,14,12,0)'); ctx.fillStyle = t; ctx.fillRect(0, 0, W, 260);
}
function flash(t, t0, d = .12) { const k = seg(t, t0, t0 + d); if (k <= 0 || k >= 1) return; ctx.fillStyle = `rgba(255,255,255,${(1 - k) * .9})`; ctx.fillRect(0, 0, W, H); }
function ledger(t, a, slide = true) {                  // la hoja del libro de cuentas: fondo de las tarjetas de datos
  const k = slide ? eo(seg(t, a, a + .18)) : 1, ox = (1 - k) * 140;
  ctx.fillStyle = C.panel; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(ox, 0); ctx.strokeStyle = C.rule; ctx.lineWidth = 2;
  for (let y = 120; y < H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = C.margin; [78, 86].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); });
  ctx.restore();
  if (slide && k < 1) { ctx.fillStyle = `rgba(255,194,26,${(1 - k) * .5})`; for (let i = 0; i < 8; i++) ctx.fillRect(W - (1 - k) * 700 - i * 90, 240 + i * 150, 500 * (1 - k), 3); }
  const g = ctx.createLinearGradient(0, 1250, 0, BAND + 40); g.addColorStop(0, 'rgba(14,14,12,0)'); g.addColorStop(1, 'rgba(14,14,12,1)'); ctx.fillStyle = g; ctx.fillRect(0, 1250, W, BAND + 40 - 1250);
  ctx.fillStyle = C.bg; ctx.fillRect(0, BAND + 40, W, H);
}
function cardTitle(id, big, sub) {                     // título de tarjeta arriba a la izquierda (corto) + renglón gris
  text(big, XL, 330, `800 64px ${F8}`, C.ink); text(sub, XL + 2, 378, `500 26px ${F5}`, C.grey);
  note(id, big, XL, 270, XL + tw(big, `800 64px ${F8}`), 340);
}
// cifras de ancho fijo: un contador que rueda no tiembla
function num(s, x, y, size, color, align = 'left') {
  ctx.font = `800 ${size}px ${F8}`; const cw = ctx.measureText('0').width;
  const wOf = ch => /[0-9]/.test(ch) ? cw : ctx.measureText(ch).width;
  let total = 0; for (const ch of s) total += wOf(ch);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  ctx.fillStyle = color; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
  for (const ch of s) { const w = wOf(ch); ctx.fillText(ch, cx + w / 2, y); cx += w; }
  return total;
}
const roll = (s, k, seed = 0) => k >= 1 ? s : [...s].map((ch, i) => /[0-9]/.test(ch) && k < .3 + .7 * (s.length - i) / s.length ? String(Math.floor(hash(seed + i * 7 + Math.floor(k * 30)) * 10)) : ch).join('');
function block(s, x, y, size, pad = 22) {               // bloque miel con cifras
  const w = (() => { ctx.font = `800 ${size}px ${F8}`; const cw = ctx.measureText('0').width; return [...s].reduce((p, ch) => p + (/[0-9]/.test(ch) ? cw : ctx.measureText(ch).width), 0); })();
  ctx.fillStyle = C.honey; ctx.fillRect(x - pad, y - size * .82, w + pad * 2, size * 1.02);
  num(s, x, y, size, C.bg); return w + pad * 2;
}
function slam(t, t0, x, y, drawFn) { if (t < t0) return false; const k = seg(t, t0, t0 + .13); ctx.save(); ctx.translate(x, y); const s = lerp(1.3, 1, back(k)); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 3); drawFn(); ctx.restore(); return true; }

// ---------- marca, fuente, crédito, rótulo bajo ----------
function bug(t) {
  const k = eo(seg(t, 8.15, 8.4)); if (k <= 0 || t >= 72) return;
  ctx.save(); ctx.globalAlpha = k; const x = XL, y = 96, f1 = `800 26px ${F8}`, f2 = `800 22px ${F8}`, w1 = tw(D.BUG.ch, f1) + 28, w2 = tw(D.BUG.topic, f2) + 28;
  ctx.fillStyle = C.honey; ctx.fillRect(x, y, w1, 46); text(D.BUG.ch, x + 14, y + 33, f1, C.bg);
  ctx.fillStyle = 'rgba(14,14,12,.66)'; ctx.fillRect(x + w1, y, w2, 46); text(D.BUG.topic, x + w1 + 14, y + 32, f2, C.honey);
  ctx.restore(); note('bug', D.BUG.ch + ' ' + D.BUG.topic, x, y, x + w1 + w2, y + 46, true);
}
function sourceTag(t, t0, label) {
  const k = eo(seg(t, t0, t0 + .2)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; const x = XL - (1 - k) * 40, y = 156;
  const f1 = `800 20px ${F8}`, f2 = `500 21px ${F5}`, w1 = tw('FUENTE', f1) + 20, w2 = tw(label, f2) + 22;
  ctx.fillStyle = C.ink; ctx.fillRect(x, y, w1, 36); text('FUENTE', x + 10, y + 25, f1, C.bg);
  ctx.fillStyle = 'rgba(14,14,12,.85)'; ctx.fillRect(x + w1, y, w2, 36); text(label, x + w1 + 11, y + 25, f2, C.ink); ctx.restore();
  if (k > .9) note('src' + t0, label, XL, y, XL + w1 + w2, y + 36);
}
function credit(s) {
  if (!s) return; const f = `500 19px ${F5}`, w = tw(s, f), y = 210;
  ctx.fillStyle = 'rgba(14,14,12,.55)'; ctx.fillRect(XR - w - 16, y, w + 16, 30); text(s, XR - 8, y + 21, f, 'rgba(247,245,239,.88)', 'right');
  note('cr' + s, s, XR - w - 16, y, XR, y + 30, true);
}
function lowerThird(t, t0, a, b, y = 1110) {
  const k = eo(seg(t, t0, t0 + .22)); if (k <= 0) return;
  const fa = `800 40px ${F8}`, fb = `500 24px ${F5}`, w = Math.max(tw(a, fa), tw(b, fb)) + 48;
  ctx.save(); ctx.beginPath(); ctx.rect(XL, y - 4, w * k + 10, 110); ctx.clip();
  ctx.fillStyle = C.honey; ctx.fillRect(XL, y, 8, 96); ctx.fillStyle = 'rgba(14,14,12,.8)'; ctx.fillRect(XL + 8, y, w, 96);
  text(a, XL + 30, y + 48, fa, C.ink); text(b, XL + 30, y + 82, fb, C.dim); ctx.restore();
  if (k > .9) note('lt' + t0, a + ' · ' + b, XL, y, XL + w + 8, y + 96);
}

// ---------- subtítulo grande: un bloque por renglón, golpean uno tras otro; palabra clave en bloque miel ----------
const parts = s => s.split(/(\{[^}]+\})/).filter(Boolean).map(q => q[0] === '{' ? [q.slice(1, -1), true] : [q, false]);
function lineW(line, size) { return parts(line).reduce((p, [s, hot]) => p + tw(s, `800 ${size}px ${F8}`) + (hot ? 24 : 0), 0); }
function capCard(c, t) {
  if (t < c.t0 || t >= c.t1) return;
  const lines = c.big.split('|'); let size = CAPSZ * (c.big2 ? 1.2 : 1);
  while (lines.some(l => lineW(l, size) > XR - XL - 30) && size > 40) size -= 2;
  const ys = c.big2 ? [1390, 1500] : CAPY;
  lines.forEach((ln, i) => {
    const t0 = c.t0 + .04 + i * .12, k = seg(t, t0, t0 + .13); if (t < t0) return;
    const sc = lerp(1.3, 1, back(k)); ctx.save(); ctx.translate(XL, ys[i]); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3);
    let x = 0;
    for (const [s, hot] of parts(ln)) {
      const f = `800 ${size}px ${F8}`, w = tw(s, f);
      if (hot) { const wk = eo(seg(t, t0 + .05, t0 + .17)); ctx.fillStyle = C.honey; ctx.fillRect(x - 12, -size * .86, (w + 24) * wk, size * 1.08); x += 12; }
      else { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 4; }
      text(s, x, 0, f, hot ? C.bg : C.ink); ctx.shadowColor = 'transparent'; x += w + (hot ? 12 : 0);
    }
    ctx.restore();
  });
  const wmax = Math.max(...lines.map(l => lineW(l, size)));
  note('cap' + c.t0, D.plain(c.big), XL - 12, ys[0] - size * .9, XL + wmax + 12, ys[lines.length - 1] + size * .25);
  if (c.small) {
    const ke = eo(seg(t, c.t0 + .1, c.t0 + .28)); ctx.save(); ctx.globalAlpha = ke;
    let fs = 32; while (tw(c.small, `500 ${fs}px ${F5}`) > XR - XL && fs > 20) fs--;
    text(c.small, XL, SMALLY + (1 - ke) * 10, `500 ${fs}px ${F5}`, C.dim); ctx.restore();
    note('sm' + c.t0, c.small, XL, SMALLY - fs, XL + tw(c.small, `500 ${fs}px ${F5}`), SMALLY + 8);
  }
}

// ---------- planos ----------
function shotVid(s, t) {
  const im = frameOf(s.fr, (s.o || 0) + t - s.a), z = lerp(s.z[0], s.z[1], eio(seg(t, s.a, s.b)));
  plate(im, 0, 0, W, BAND, z); bandShade();
  if (s.lt) lowerThird(t, s.a + .2, ...s.lt);
}
function shotPhoto(s, t) {
  const im = getImg(`assets/img/${s.im}.jpg`), z = lerp(s.z[0], s.z[1], eio(seg(t, s.a, s.b)));
  plate(im, 0, 0, W, BAND, z, .5, .45); bandShade();
  if (s.lt) lowerThird(t, s.a + .25, ...s.lt);
  if (s.im === 'unesco') sourceTag(t, s.a + .3, 'idm314.org · UNESCO');
}
// 0–5 s: el gancho: 14/3 cae en el cuadro 4 y rueda
function hook(t) {
  if (t < .06 || t >= 5.0) return;
  const out = eo(seg(t, 4.62, 4.9)); ctx.save(); ctx.translate(-out * 1200, 0);
  slam(t, .06, XL, 560, () => { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 20; text('DÍA INTERNACIONAL', 0, -52, `800 50px ${F8}`, C.ink); text('DE LAS MATEMÁTICAS', 0, 0, `800 50px ${F8}`, C.ink); });
  slam(t, .13, XL + 14, 900, () => { block(roll(HOOK.num, seg(t, .13, .6), 3), 0, 0, 300, 26); });
  slam(t, .4, XL, 1040, () => { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 20; text(HOOK.unit, 0, 0, `800 96px ${F8}`, C.ink); });
  ctx.restore();
  if (out === 0 && t > .4) { note('hk1', 'DÍA INTERNACIONAL DE LAS MATEMÁTICAS', XL, 460, XL + 600, 570); note('hk2', HOOK.num + ' ' + HOOK.unit, XL - 12, 640, XL + 700, 1060); }
  const ke = eo(seg(t, .3, .5)); ctx.save(); ctx.globalAlpha = ke * (1 - out); text(HOOK.small, XL, SMALLY, `500 32px ${F5}`, C.dim); ctx.restore();
  if (t > .5 && out === 0) note('hks', HOOK.small, XL, SMALLY - 32, XL + tw(HOOK.small, `500 32px ${F5}`), SMALLY + 8);
}
// 5–7.5 s: título: una página miel rayada baja sobre la tarta; al irse, el título queda como la marca
function shotSting(s, t) {
  const off = eio(seg(t, 8.18, 8.5));
  const im = frameOf(s.fr, s.o + t - s.a); plate(im, 0, 0, W, BAND, 1.0); bandShade();
  const kin = eo(seg(t, 4.94, 5.14)), PH_ = 1180;
  ctx.save(); ctx.translate(-off * W, 0); ctx.beginPath(); ctx.rect(0, 0, W, PH_ * kin); ctx.clip();
  ctx.fillStyle = C.honey; ctx.fillRect(0, 0, W, PH_);
  ctx.strokeStyle = 'rgba(14,14,12,.13)'; ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) { const y = 120 + i * 54, kl = eo(seg(t, 5.1 + i * .02, 5.4 + i * .02)); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W * kl, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(200,40,30,.5)'; [78, 86].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, PH_ * eo(seg(t, 5.15, 5.55))); ctx.stroke(); });
  const L = D.TITLE.main.split('|');
  slam(t, 5.18, XL, 560, () => text(L[0], 0, 0, `800 120px ${F8}`, C.bg));
  slam(t, 5.3, XL, 690, () => text(L[1], 0, 0, `800 120px ${F8}`, C.bg));
  const k2 = eo(seg(t, 5.45, 5.65)); ctx.globalAlpha = k2; text(D.TITLE.sub, XL + 4 + (1 - k2) * 30, 790, `800 58px ${F8}`, C.bg);
  const k3 = eo(seg(t, 5.6, 5.8)); ctx.globalAlpha = k3; const wl = tw(D.TITLE.chip, `800 30px ${F8}`);
  ctx.fillStyle = C.bg; ctx.fillRect(XL, 850, wl + 70, 54); ctx.fillStyle = C.loss; ctx.beginPath(); ctx.arc(XL + 24, 877, 8, 0, 7); ctx.fill();
  text(D.TITLE.chip, XL + 44, 888, `800 30px ${F8}`, C.honey);
  ctx.restore();
  if (t > 5.4 && off === 0) { note('ttl', D.plain(D.TITLE.main), XL, 460, XL + 760, 710); note('ttl2', D.TITLE.sub, XL, 740, XL + 500, 800, true); }
}
// congelado con pregunta
function shotFreeze(s, t) {
  const tf = s.tf, im = frameOf(s.fr, Math.min(t, tf) - s.a);
  const kp = eo(seg(t, tf, tf + .25)), z = t < tf ? 1 : lerp(1, 1.12, kp) + .04 * seg(t, tf + .25, s.b), sat = t < tf ? 1 : lerp(1, .45, kp);
  plate(im, 0, 0, W, BAND, z, .5, .5, `${GRADE} saturate(${sat})`); bandShade();
  if (t >= tf) {
    const kb = eo(seg(t, tf + .1, tf + .3)), cx = 540, cy = 690, bw = lerp(760, 600, kb), bh = lerp(760, 600, kb), L = 60;
    ctx.save(); ctx.globalAlpha = kb; ctx.strokeStyle = C.honey; ctx.lineWidth = 7;
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const x = cx + sx * bw / 2, y = cy + sy * bh / 2; ctx.beginPath(); ctx.moveTo(x, y - sy * L); ctx.lineTo(x, y); ctx.lineTo(x - sx * L, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(14,14,12,.75)'; ctx.fillRect(XR - 230, 252, 230, 46); ctx.fillStyle = C.loss; ctx.fillRect(XR - 214, 264, 8, 22); ctx.fillRect(XR - 200, 264, 8, 22);
    num('00:11:00', XR - 14, 285, 28, C.ink, 'right'); ctx.restore();
  }
  flash(t, tf, .14);
}
// pantalla partida: el giro
function shotSplit(s, t) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  const ko = eo(seg(t, s.a - .14, s.a + .2)), hw = 538 * ko;
  plate(frameOf('ta', 2 + t - s.a), 540 - hw, 0, hw, BAND, 1.0, .5, .5, 'grayscale(.92) brightness(.45) contrast(1.15)');
  ctx.fillStyle = 'rgba(255,74,61,.14)'; ctx.fillRect(540 - hw, 0, hw, BAND);
  plate(frameOf('tb', 8 + t - s.a), 542, 0, hw, BAND, 1.0, .5, .5, `${GRADE} brightness(.75)`);
  bandShade();
  const kd = eo(seg(t, s.a - .1, s.a + .15)); ctx.fillStyle = C.honey; ctx.fillRect(538, 0, 4, BAND * kd);
  const side = (x, t0, a, b, n, col) => {
    const k = eo(seg(t, t0, t0 + .2)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k;
    const fa = `800 40px ${F8}`, fb = `500 26px ${F5}`; ctx.fillStyle = 'rgba(14,14,12,.82)'; ctx.fillRect(x - 10, 330, tw(a, fa) + 40, 96);
    ctx.fillStyle = col; ctx.fillRect(x - 10, 330, 8, 96); text(a, x + 14, 376, fa, C.ink); text(b, x + 14, 412, fb, C.dim); ctx.restore();
    slam(t, t0 + .25, x, 760, () => { if (col === C.honey) block(n, 10, 0, 150, 14); else { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 16; num(n, 10, 0, 150, C.ink); } });
    if (t > t0 + .3) { note('sp' + a, a + ' ' + b, x - 10, 330, x + 300, 426); note('spn' + a, n, x - 10, 640, x + 340, 790); }
  };
  side(XL + 6, s.a + .25, 'COLOMBIA', 'día / mes', '14/3', C.loss);
  side(580, s.a + 1.1, 'EE. UU.', 'mes / día', '3/14', C.honey);
  flash(t, s.a, .1);
}
// 3/14 → 3.14 → π = 3.14159265…
function shotDigits(s, t) {
  ledger(t, s.a); cardTitle('dgT', 'De fecha a número', 'Mes/día → los dígitos de pi');
  const k1 = eo(seg(t, s.a + .7, s.a + 1.0));        // la barra se vuelve punto
  ctx.save(); ctx.translate(540, 700);
  const str = k1 < .5 ? '3/14' : '3.14';
  if (t < s.a + 1.9) { const sc = lerp(1, .5, eo(seg(t, s.a + 1.5, s.a + 1.9))); ctx.scale(sc, sc); block(str, -num(str, 0, -9999, 230, 'transparent') / 2, 80, 230, 24); }
  ctx.restore();
  if (t >= s.a + 1.6) {
    slam(t, s.a + 1.6, 540, 640, () => text('π', 0, 0, `800 260px ${F8}`, C.honey, 'center'));
    const digs = D.PI + '…', n = Math.round(lerp(4, digs.length, eo(seg(t, s.a + 1.8, s.a + 2.3))));
    num(digs.slice(0, n), 540 - num(digs, 0, -9999, 104, 'transparent') / 2, 860, 104, C.ink);
    if (t > s.a + 2.3) note('dgN', 'π = ' + digs, 160, 760, 920, 880);
  }
  if (t > s.a + .4) note('dgS', t < s.a + 1.6 ? '3/14' : 'π', 300, 480, 780, 760, true);
}
// la taza en un recuadro (el video se recortó sin el papel, el logo ni la marca de agua: escala 1.5)
function shotInset(s, t) {
  ledger(t, s.a, false); const im = frameOf(s.fr, (s.o || 0) + t - s.a), z = lerp(s.z[0], s.z[1], eio(seg(t, s.a, s.b)));
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.fillStyle = '#000'; ctx.fillRect(90, 250, 900, 900); ctx.restore();
  plate(im, 90, 250, 900, 900, z);
  ctx.strokeStyle = C.honey; ctx.lineWidth = 4; ctx.strokeRect(90, 250, 900, 900);
}
// las medidas de la taza en una tarjeta: 26.1 ÷ 8.3 ≈ 3.14
function shotMug(s, t) {
  ledger(t, s.a); cardTitle('mgT', 'La taza', 'Medidas del video de Terra X, en cm');
  const row = (t0, lab, v, y, id) => {
    const k = eo(seg(t, t0, t0 + .2)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k;
    text(lab, XL, y, `800 52px ${F8}`, C.ink); num(roll(v, seg(t, t0, t0 + .45), y), XR, y, 96, C.ink, 'right'); ctx.restore();
    if (t > t0 + .2) note(id, lab + ' ' + v, XL, y - 80, XR, y + 10);
  };
  row(s.a + .2, 'Contorno', '26.1', 560, 'mgC'); row(s.a + .35, 'Diámetro', '8.3', 700, 'mgD');
  const kl = eo(seg(t, s.a + .45, s.a + .6)); ctx.fillStyle = C.grey; ctx.fillRect(XL, 760, (XR - XL) * kl, 3);
  slam(t, s.a + .6, XL, 900, () => { text('26.1 ÷ 8.3 ≈', 0, 0, `800 74px ${F8}`, C.ink); block('3.14', tw('26.1 ÷ 8.3 ≈', `800 74px ${F8}`) + 30, 0, 74, 14); });
  if (t > s.a + .7) note('mgN', '26.1 ÷ 8.3 ≈ 3.14', XL, 820, XR, 920);
}
// el círculo rueda y deja su contorno en el suelo: 3 diámetros y un poco más
function shotUnroll(s, t) {
  ledger(t, s.a); cardTitle('unT', 'Desenrollar', 'Contorno de un círculo medido en diámetros');
  const R = 112, d = 2 * R, x0 = 170, yb = 900, u = eio(seg(t, s.a + .4, s.a + 2.2)), th = u * 2 * Math.PI, cx = x0 + R * th;
  // marcas de diámetro en el suelo
  ctx.strokeStyle = C.grey; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 30, yb); ctx.lineTo(x0 + Math.PI * d + 40, yb); ctx.stroke();
  for (let i = 0; i <= 3; i++) { const x = x0 + i * d; ctx.beginPath(); ctx.moveTo(x, yb + 8); ctx.lineTo(x, yb + 30); ctx.stroke(); if (i) { const k = seg(t, s.a + 2.2 + i * .1, s.a + 2.4 + i * .1); ctx.globalAlpha = k; text(i + ' d', x - d / 2, yb + 74, `800 38px ${F8}`, C.ink, 'center'); ctx.globalAlpha = 1; } }
  // el contorno ya desenrollado
  ctx.strokeStyle = C.honey; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(cx, yb); ctx.stroke();
  // el círculo: la parte que aún no toca el suelo
  ctx.beginPath(); ctx.arc(cx, yb - R, R, Math.PI / 2 + th, Math.PI / 2 + 2 * Math.PI, false); ctx.stroke();
  if (u < .97) { ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - R * Math.cos(th), yb - R - R * Math.sin(th)); ctx.lineTo(cx + R * Math.cos(th), yb - R + R * Math.sin(th)); ctx.stroke(); }
  if (t < s.a + .9) { const k = seg(t, s.a + .2, s.a + .5); ctx.globalAlpha = k; text('d', cx, yb - R - 18, `800 40px ${F8}`, C.ink, 'center'); ctx.globalAlpha = 1; }
  // lo que sobra: 0.14 d
  const ks = eo(seg(t, s.a + 2.4, s.a + 2.6));
  if (ks > 0) { const x3 = x0 + 3 * d, xe = x0 + Math.PI * d; ctx.fillStyle = `rgba(255,74,61,${.9 * ks})`; ctx.fillRect(x3, yb - 16, xe - x3, 32); ctx.globalAlpha = ks; text('+0.14 d', (x3 + xe) / 2, yb - 40, `800 34px ${F8}`, C.loss, 'center'); ctx.globalAlpha = 1; }
  slam(t, s.a + 2.5, XL, 1160, () => { text('C ÷ d =', 0, 0, `800 96px ${F8}`, C.ink); block('3.14…', tw('C ÷ d =', `800 96px ${F8}`) + 40, 0, 96, 18); });
  if (t > s.a + 2.6) note('unN', 'C ÷ d = 3.14…', XL, 1070, XR, 1180);
  if (t > s.a + 2.6) note('unS', '+0.14 d', 700, 830, 880, 870);
  if (t > s.a + 2.6) for (let i = 1; i <= 3; i++) note('und' + i, i + ' d', x0 + (i - .5) * d - 40, yb + 40, x0 + (i - .5) * d + 40, yb + 80, true);
}
// rejilla de tres círculos, se encienden uno por uno
function shotGrid(s, t) {
  ledger(t, s.a, false); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, BAND + 40);
  const P = [[.32, 'Pequeño'], [.62, 'Mediano'], [1, 'Grande']], pw = 240, gap = 20, x0 = (W - 3 * pw - 2 * gap) / 2;
  P.forEach(([r, lab], i) => {
    const x = x0 + i * (pw + gap), kr = eo(seg(t, s.a - .15 + i * .1, s.a + .2 + i * .1)), y = lerp(BAND, 260, kr), on = t > s.a + .35 + i * .5;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, pw, BAND - 300); ctx.clip(); ctx.fillStyle = C.panel; ctx.fillRect(x, y, pw, BAND - 300);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 2; for (let yy = y + 60; yy < BAND; yy += 54) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + pw, yy); ctx.stroke(); }
    const R = 108 * r, cy = y + 420;
    ctx.strokeStyle = on ? C.honey : C.grey; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + pw / 2, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + pw / 2 - R, cy); ctx.lineTo(x + pw / 2 + R, cy); ctx.stroke();
    text(String(i + 1), x + 24, y + 56, `800 40px ${F8}`, on ? C.honey : C.grey);
    text(lab, x + pw / 2, y + 700, `800 40px ${F8}`, on ? C.honey : C.ink, 'center');
    if (on) { text('C ÷ d', x + pw / 2, y + 790, `500 30px ${F5}`, C.dim, 'center'); num('3.14…', x + pw / 2, y + 880, 66, C.ink, 'center'); }
    ctx.restore();
    if (on) { ctx.strokeStyle = C.honey; ctx.lineWidth = 4; ctx.strokeRect(x + 2, y + 2, pw - 4, BAND - 304); }
    if (t > s.a + .4 + i * .5) note('gr' + i, lab + ' 3.14…', x + 20, y + 650, x + pw - 20, y + 890);
  });
  const g = ctx.createLinearGradient(0, 1180, 0, BAND + 40); g.addColorStop(0, 'rgba(14,14,12,0)'); g.addColorStop(1, 'rgba(14,14,12,1)'); ctx.fillStyle = g; ctx.fillRect(0, 1180, W, BAND + 40 - 1180);
}
// 1988
function shotYear(s, t) {
  ledger(t, s.a); sourceTag(t, s.a + .3, 'exploratorium.edu');
  slam(t, s.a + .2, XL + 14, 560, () => block(roll('1988', seg(t, s.a + .2, s.a + .7), 5), 0, 0, 220, 24));
  const k = eo(seg(t, s.a + .5, s.a + .7));
  ctx.save(); ctx.globalAlpha = k; text('San Francisco', XL, 700, `800 64px ${F8}`, C.ink); text('Exploratorium (museo)', XL + 2, 750, `500 30px ${F5}`, C.grey); ctx.restore();
  const k2 = eo(seg(t, s.a + .8, s.a + 1.0));
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha = k2; text('Pastel a la', XL, 900, `800 54px ${F8}`, C.ink); block('1:59', XL + tw('Pastel a la', `800 54px ${F8}`) + 34, 900, 54, 12);
    text('3.14159 → la 1:59', XL + 2, 966, `500 34px ${F5}`, C.dim); ctx.restore();
  }
  if (t > s.a + .8) note('yr', '1988', XL, 380, XL + 560, 580);
  if (t > s.a + .7) { note('yrSF', 'San Francisco', XL, 640, XR, 710); note('yrEx', 'Exploratorium (museo)', XL, 720, XR, 760); }
  if (t > s.a + 1.0) { note('yr159', 'Pastel a la 1:59', XL, 850, XR, 910); note('yr314', '3.14159 → la 1:59', XL, 930, XR, 976); }
}
// el documento lo dice (H. Res. 224, página 2), subrayado; luego 2009 en bloque
const PT = 220 / 72;
function shotDoc(s, t) {
  const im = getImg('assets/img/doc2.jpg'), u = eio(seg(t, s.a, s.b)), z = lerp(.74, .8, u), fx = 300, fy = 456;
  ctx.fillStyle = '#23221E'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 640); ctx.rotate(-.015); ctx.scale(z, z); ctx.translate(-fx * PT, -fy * PT);
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1870, 2420); ctx.shadowColor = 'transparent';
  ctx.filter = 'contrast(1.06) sepia(0.06)'; di(im, 0, 0); ctx.filter = 'none';
  for (const m of [[s.a + .4, 126, 439.7, 486, 451.9], [s.a + .8, 150, 459.7, 486, 471.9], [s.a + 1.4, 182, 531.7, 486, 543.9]]) {
    const k = eo(seg(t, m[0], m[0] + .4)); if (k <= 0) continue;
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,200,30,.88)';
    ctx.fillRect(m[1] * PT - 8, m[2] * PT - 5, (m[3] - m[1]) * PT * k + 16, (m[4] - m[2]) * PT + 10); ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore(); warm(0, 0, W, H, .04);
  const v = ctx.createRadialGradient(540, 640, 300, 540, 640, 1100); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  bandShade();
  slam(t, s.a + 2.2, XL + 14, 1150, () => { ctx.rotate(-.03); block('2009', 0, 0, 150, 20); });
  if (t > s.a + 2.3) note('dc', '2009', XL, 1020, XL + 420, 1170);
  sourceTag(t, s.a + .3, 'H. Res. 224 · Cámara de EE. UU. · 12 mar 2009');
}
// París y la primera celebración
function shotFirst(s, t) { shotVid(s, t); sourceTag(t, s.a + .3, 'idm314.org'); }
// tarjeta final
function shotEnd(s, t) {
  const im = frameOf(s.fr, s.o + t - s.a), kd = eo(seg(t, s.a, s.a + .4));
  plate(im, 0, 0, W, H, lerp(1.0, 1.04, seg(t, s.a, s.b)), .5, .4, `${GRADE} blur(${10 * kd}px) brightness(${1 - .6 * kd})`);
  ctx.fillStyle = 'rgba(14,14,12,.45)'; ctx.fillRect(0, 0, W, H);
  slam(t, s.a + .15, XL, 640, () => text(D.END.title, 0, 0, `800 128px ${F8}`, C.ink));
  const k2 = eo(seg(t, s.a + .35, s.a + .55)); ctx.save(); ctx.globalAlpha = k2;
  text(D.END.line, XL + 4, 730, `800 54px ${F8}`, C.honey);
  ctx.fillStyle = 'rgba(247,245,239,.5)'; ctx.fillRect(XL + 4, 780, 740 * eo(seg(t, s.a + .45, s.a + .85)), 2);
  text(D.END.style, XL + 4, 840, `800 30px ${F8}`, C.ink); ctx.restore();
  const k3 = eo(seg(t, s.a + .7, s.a + 1.0)); ctx.save(); ctx.globalAlpha = k3 * .92;
  const lines = []; for (const l of D.END.credits) { ctx.font = `500 21px ${F5}`; let cur = ''; for (const w of l.split(' ')) { const tr = cur ? cur + ' ' + w : w; if (ctx.measureText(tr).width > XR - XL && cur) { lines.push(cur); cur = w; } else cur = tr; } lines.push(cur); }
  lines.forEach((l, i) => text(l, XL + 4, 1010 + i * 32, `500 21px ${F5}`, C.dim));
  ctx.restore();
  if (t > s.a + .5) { note('eT', D.END.title, XL, 520, XR, 660); note('eL', D.END.line, XL, 680, XR, 745); note('eS', D.END.style, XL, 810, XR, 850); }
  if (t > s.a + 1.0) lines.forEach((l, i) => note('ec' + i, l, XL, 990 + i * 32, XR, 1016 + i * 32, true));
}

// ---------- render ----------
const shotAt = t => SHOTS.find(s => t >= s.a && t < s.b) || SHOTS.at(-1);
function draw(t) {
  TX = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  const s = shotAt(t);
  if (s.k === 'vid') (s.fr === 'ef' ? shotFirst : shotVid)(s, t);
  else if (s.k === 'photo') shotPhoto(s, t);
  else if (s.k === 'sting') shotSting(s, t);
  else if (s.k === 'freeze') shotFreeze(s, t);
  else if (s.k === 'split') shotSplit(s, t);
  else if (s.k === 'digits') shotDigits(s, t);
  else if (s.k === 'mug') shotMug(s, t);
  else if (s.k === 'inset') shotInset(s, t);
  else if (s.k === 'unroll') shotUnroll(s, t);
  else if (s.k === 'grid') shotGrid(s, t);
  else if (s.k === 'year') shotYear(s, t);
  else if (s.k === 'doc') shotDoc(s, t);
  else if (s.k === 'end') shotEnd(s, t);
  if (s.k !== 'end') credit(s.cr);
  hook(t);
  for (const c of CAPS) capCard(c, t);
  bug(t);
}
async function render(t) { NEED.clear(); draw(t); if (NEED.size) { await Promise.all([...NEED].map(load)); NEED.clear(); draw(t); } }

// ---------- eventos de sonido ----------
const SH = k => SHOTS.find(s => s.k === k).a;
const EV = [
  ...SHOTS.slice(1).map(s => ({ t: s.a, type: 'cut', k: s.k })),
  ...CAPS.flatMap(c => c.big.split('|').map((_, i) => ({ t: +(c.t0 + .04 + i * .12).toFixed(3), type: 'slam', big: c.big2 ? 1.25 : 1 }))),
  { t: .06, type: 'slam' }, { t: .13, type: 'hook' }, { t: .13, type: 'rattle', d: .47 }, { t: .4, type: 'slam' }, { t: 4.62, type: 'whoosh' },
  { t: 5.0, type: 'sting' }, { t: 5.18, type: 'slam', big: 1.5 }, { t: 5.3, type: 'slam', big: 1.5 }, { t: 5.6, type: 'tick' }, { t: 8.18, type: 'whoosh' },
  { t: SHOTS.find(s => s.k === 'freeze').tf, type: 'shutter' },
  { t: SH('split'), type: 'hit' }, { t: SH('split') + .5, type: 'slam' }, { t: SH('split') + 1.35, type: 'slam' }, { t: SH('split') + 1.35, type: 'ding' },
  { t: SH('digits'), type: 'whoosh' }, { t: SH('digits') + .7, type: 'pop' }, { t: SH('digits') + 1.6, type: 'stamp' }, { t: SH('digits') + 1.8, type: 'rattle', d: .5 },
  { t: SH('mug'), type: 'whoosh' }, { t: SH('mug') + .2, type: 'rattle', d: .45 }, { t: SH('mug') + .35, type: 'rattle', d: .45 }, { t: SH('mug') + .6, type: 'stamp' },
  { t: SH('unroll'), type: 'whoosh' }, { t: SH('unroll') + .4, type: 'draw', d: 1.8 }, { t: SH('unroll') + 2.4, type: 'pop' }, { t: SH('unroll') + 2.5, type: 'stamp' },
  { t: SH('grid'), type: 'whoosh' }, ...[0, 1, 2].map(i => ({ t: SH('grid') + .35 + i * .5, type: 'pop' })),
  { t: SH('year'), type: 'whoosh' }, { t: SH('year') + .2, type: 'rattle', d: .5 }, { t: SH('year') + .7, type: 'ding' }, { t: SH('year') + .8, type: 'pop' },
  { t: SH('doc'), type: 'paper' }, { t: SH('doc') + .4, type: 'marker', d: .4 }, { t: SH('doc') + .8, type: 'marker', d: .4 }, { t: SH('doc') + 1.4, type: 'marker', d: .4 }, { t: SH('doc') + 2.2, type: 'stamp' },
  { t: 52.25, type: 'swipe', d: .22 }, { t: 56.7, type: 'swipe', d: .22 }, { t: 57.0, type: 'ding' },
  ...D.CUES.map(c => ({ t: c.t0, type: 'narr', d: +(c.t1 - c.t0).toFixed(3), text: c.text })),
  ...D.SILENCES.map(([a, b]) => ({ t: a, type: 'silence', d: +(b - a).toFixed(3) })), { t: 65.5, type: 'hit', major: 1 }, { t: SH('end'), type: 'end' },
].sort((a, b) => a.t - b.t);

window.DUR = DUR;
window.render = render;
window.TEXTS = () => TX;
window.EV = EV;
(async () => {
  await Promise.all([['800', 'IT8'], ['500', 'IT5']].map(([w, f]) => document.fonts.load(`${w} 40px ${f}`, 'AÁáéíóúñπ÷≈→0123456789')));
  await Promise.all(['pie', 'unesco', 'doc2'].map(n => load(`assets/img/${n}.jpg`)));
  await render(0); window.READY = true;
})();
