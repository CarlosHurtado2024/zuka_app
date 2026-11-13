// Motor del estilo «Tablet Sketch Explainer» de Lemo-Opuscar (github.com/lemomo-ai/lemo-opuscar, MIT), tomado de
// styles/ipad-sketch/demo/index.html y adaptado a una página vertical: lienzo, grano del papel, lápiz (PEN),
// bloques de color (BLOB), oclusión (OCC), letra trazo a trazo (TXT), cámara de dos dedos, lápiz óptico y composición.
// ---------- camera ----------
const gease = u => 0.45 * eio(u) + 0.55 * eo(u);
const sstep = x => { x = clamp(x); return x * x * (3 - 2 * x); };
function cam(t) {
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1], span = b.t - a.t, u0 = span > 1e-6 ? clamp((t - a.t) / span) : 1;
  const u = b.k === 'g' ? gease(u0) : b.k === 'i' ? Math.pow(u0, 2.4) : b.k === 'p' ? eo(u0) : eio(u0);
  let x = lerp(a.x, b.x, u), y = lerp(a.y, b.y, u);
  if (b.k === 'f') { const p = b.fn(t), w = sstep(u0 / 0.25) * (1 - sstep((u0 - 0.8) / 0.2)); x = lerp(x, p[0], w); y = lerp(y, p[1], w); }
  return { x, y, z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), u)), r: lerp(a.r, b.r, u) * Math.PI / 180 };
}
function toScreen(c, x, y) { const dx = (x - c.x) * c.z, dy = (y - c.y) * c.z, cs = Math.cos(c.r), sn = Math.sin(c.r); return [W / 2 + dx * cs - dy * sn, H / 2 + dx * sn + dy * cs]; }
function toWorld(c, X, Y) { const dx = X - W / 2, dy = Y - H / 2, cs = Math.cos(-c.r), sn = Math.sin(-c.r); return [c.x + (dx * cs - dy * sn) / c.z, c.y + (dx * sn + dy * cs) / c.z]; }

// ---------- stylus: on the mark being made; lifts between marks; leaves the frame in long pauses ----------
let NIBS = [];
const OFF = [W + 160, H + 260];
function stylusAt(t) {
  const c = cam(t); let act = null;
  for (const e of NIBS) if (t >= e.t0 && t < e.t0 + e.d) act = e;
  if (act) { const p = act.nib((t - act.t0) / act.d); return { P: toScreen(c, p[0], p[1]), lift: 0 }; }
  let prev = null, next = null;
  for (const e of NIBS) { if (e.t0 + e.d <= t && (!prev || e.t0 + e.d >= prev.t0 + prev.d)) prev = e; if (e.t0 > t && (!next || e.t0 < next.t0)) next = e; }
  const ta = prev ? prev.t0 + prev.d : -9, tb = next ? next.t0 : 1e9, gap = tb - ta;
  const pa = prev ? toScreen(c, ...prev.nib(1)) : OFF, pb = next ? toScreen(c, ...next.nib(0)) : OFF;
  if (gap > 1.1 || !prev || !next) {   // away from the glass
    if (prev && t - ta < 0.45) { const u = eio((t - ta) / 0.45); return { P: [lerp(pa[0], OFF[0], u), lerp(pa[1], OFF[1], u)], lift: Math.min(1, u * 2) }; }
    if (next && tb - t < 0.45) { const u = eio(1 - (tb - t) / 0.45); return { P: [lerp(OFF[0], pb[0], u), lerp(OFF[1], pb[1], u)], lift: Math.min(1, (1 - u) * 2) }; }
    return null;
  }
  const u = (t - ta) / gap;
  return { P: [lerp(pa[0], pb[0], eio(u)), lerp(pa[1], pb[1], eio(u))], lift: Math.sin(Math.PI * u) * clamp(gap / 0.3, 0.25, 1) };
}
function drawStylus(t) {
  const n = stylusAt(t); if (!n) return;
  const [X, Y] = n.P, n2 = stylusAt(t + 1 / 48), lean = n2 ? clamp((n2.P[0] - X) * 0.004, -0.06, 0.06) : 0;
  const ang = 0.98 + lean, d = [Math.cos(ang), Math.sin(ang)], nn = [-d[1], d[0]], h0 = 4 + n.lift * 26;
  const P = (s, o) => [X + d[0] * s + nn[0] * o, Y + d[1] * s + nn[1] * o];
  const body = (k = 0) => { const L = 600, rw = 12.5, sh = s => [k * (h0 + s * 0.05) * 0.9, k * (h0 + s * 0.05) * 0.35];
    return [[0, 0], [12, -2.6], [46, -rw], [L, -rw], [L + 8, -rw * 0.6], [L + 8, rw * 0.6], [L, rw], [46, rw], [12, 2.6]].map(([s, o]) => { const q = P(s, o), e = sh(s); return [q[0] + e[0], q[1] + e[1]]; }); };
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(120,98,76,0.16)'; ctx.beginPath(); polyPath(ctx, body(1)); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#fbf8f2'; ctx.beginPath(); polyPath(ctx, body(0)); ctx.fill();
  ctx.fillStyle = '#ebe5da'; ctx.beginPath(); polyPath(ctx, [P(46, 4), P(600, 4), P(600, 12.5), P(46, 12.5)]); ctx.fill();
  ctx.fillStyle = '#ddd6cb'; ctx.beginPath(); polyPath(ctx, [P(12, -2.6), P(46, -12.5), P(46, 12.5), P(12, 2.6)]); ctx.fill();
  ctx.fillStyle = '#4a3f37'; ctx.beginPath(); polyPath(ctx, [P(0, 0), P(12, -2.6), P(12, 2.6)]); ctx.fill();
  ctx.strokeStyle = '#c9bdab'; ctx.lineWidth = 1.3; ctx.lineJoin = 'round'; ctx.beginPath(); polyPath(ctx, body(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(...P(46, -12.5)); ctx.lineTo(...P(46, 12.5)); ctx.stroke();
  ctx.restore();
}

// ---------- subtitles: a paper chip, Chinese over English, wiped in like a colour block ----------
const SUB_RIGHT = { v03a: 1, v03b: 1, v04: 1 };
function drawSubs(t) {
  if (!VOC) return;
  const q = VOC.cues.find(c => t >= c.t0 && t < c.t1); if (!q) return;
  const fin = clamp((t - q.t0) / 0.2), fout = clamp((q.t1 - t) / 0.18);
  ctx.save();
  ctx.font = '40px WK'; const wz = ctx.measureText(q.zh).width; ctx.font = '40px CM'; const we = ctx.measureText(q.en).width;
  const w = Math.max(wz, we) + 64, h = 118, x = SUB_RIGHT[q.id] ? W - 96 - w : 96, y = H - 60 - h;
  ctx.globalAlpha = fout;
  ctx.beginPath(); ctx.rect(x - 20, y - 20, (w + 40) * eo(fin), h + 40); ctx.clip();
  ctx.fillStyle = '#e4d6bd'; ctx.globalAlpha = fout * 0.75; ctx.beginPath(); ctx.roundRect(x + 9, y + 8, w, h, 10); ctx.fill();
  ctx.fillStyle = '#fbf7ee'; ctx.globalAlpha = fout * 0.95; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  const ta = fout * clamp((t - q.t0 - 0.08) / 0.18);
  ctx.globalAlpha = ta; ctx.fillStyle = '#43362e'; ctx.font = '40px WK'; ctx.textBaseline = 'alphabetic'; ctx.fillText(q.zh, x + 32, y + 52);
  ctx.fillStyle = '#6a5a4e'; ctx.font = '40px CM'; ctx.fillText(q.en, x + 32, y + 98);
  ctx.restore();
}

// ---------- composite: paper × colour × pencil layers with the grain threshold ----------
const IMGS = {};
function composite(c) {
  const cs = [[0, 0], [W, 0], [0, H], [W, H]].map(([X, Y]) => toWorld(c, X, Y));
  const [a, b, cc, d] = bbox(cs);
  const x0 = Math.max(0, Math.floor(PX(a)) - 2), y0 = Math.max(0, Math.floor(PY(b)) - 2), x1 = Math.min(BW, Math.ceil(PX(cc)) + 2), y1 = Math.min(BH, Math.ceil(PY(d)) + 2);
  const w = x1 - x0, h = y1 - y0, key = w + 'x' + h;
  if (w < 2 || h < 2) return [0, 0, 1, 1];                 // la cámara está fuera de la hoja (cambio de hoja)
  const img = IMGS[key] || (IMGS[key] = new ImageData(w, h)), o = img.data;
  const fd = TG.fx.getImageData(x0, y0, w, h).data, pp = hex(C.paper), Ls = ORDER.map(n => [TG.L[n], LAYERS[n].col, LAYERS[n].alpha]);
  for (let y = 0; y < h; y++) {
    const row = (y + y0) * BW + x0;
    for (let x = 0; x < w; x++) {
      const i = row + x, j = (y * w + x) * 4, g = GRAIN[i], g2 = GRAIN2[i];
      const pk = (0.985 + 0.03 * g2) * (0.99 + 0.02 * g);
      let r = pp[0] * pk, gg = pp[1] * pk, bb = pp[2] * (0.985 + 0.03 * g2) * (0.985 + 0.025 * g);
      const fa = fd[j + 3] / 255;
      if (fa) { const al = fa * (0.86 + 0.14 * (1 - g * 0.8)); r *= 1 - al + al * fd[j] / 255; gg *= 1 - al + al * fd[j + 1] / 255; bb *= 1 - al + al * fd[j + 2] / 255; }
      for (let q = 0; q < 3; q++) { const v = Ls[q][0][i]; if (!v) continue;
        const al = clamp((v * 0.9 - g * 0.85 + 0.32) * 2.1) * Ls[q][2]; if (al <= 0) continue; const col = Ls[q][1];
        r *= 1 - al + al * col[0]; gg *= 1 - al + al * col[1]; bb *= 1 - al + al * col[2]; }
      o[j] = r * 255; o[j + 1] = gg * 255; o[j + 2] = bb * 255; o[j + 3] = 255;
    }
  }
  wx.putImageData(img, x0, y0);
  return [x0, y0, w, h];
}

// ---------- cache of finished marks ----------
function clearTarget(T) { for (const n of ORDER) T.L[n].fill(0); T.fx.clearRect(0, 0, BW, BH); }
function renderMarks(t) {
  let k = 0; while (k < EL.length && t >= EL[k].t0 + EL[k].d) k++;
  if (cacheK > k) { clearTarget(CACHE); cacheK = 0; }
  if (cacheK < k) { TG = CACHE; for (let i = cacheK; i < k; i++) EL[i].apply(1); cacheK = k; }
  let partial = false; for (let i = k; i < EL.length; i++) if (t >= EL[i].t0) { partial = true; break; }
  if (!partial) { TG = CACHE; return; }
  for (const n of ORDER) WORK.L[n].set(CACHE.L[n]);
  WORK.fx.clearRect(0, 0, BW, BH); WORK.fx.drawImage(CACHE.fc, 0, 0);
  TG = WORK;
  for (let i = k; i < EL.length; i++) { const e = EL[i]; if (t >= e.t0) e.apply(clamp((t - e.t0) / e.d)); }
}

// ---------- render ----------
function renderFull(t) {
  const c = cam(t);
  renderMarks(t);
  const [x0, y0, w, h] = composite(c);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, W / 2, H / 2); ctx.rotate(c.r); ctx.scale(c.z / S, c.z / S); ctx.translate(-(c.x - X0) * S, -(c.y - Y0) * S);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(WC, x0, y0, w, h, x0, y0, w, h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const d of DYN) if (t >= d.t0 && t < d.t1) d.draw(t, c);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.15);
  g.addColorStop(0, 'rgba(120,100,80,0)'); g.addColorStop(1, 'rgba(120,100,80,0.10)');
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
  if (CLEAN) return;
  drawStylus(t);
  drawSubs(t);
}
window.render = t => renderFull(FROM + t);
window.CAMAT = cam;

// every on-canvas text with its screen box, for readcheck (subtitles are checked from the .srt)
window.TEXTS = t => {
  t += FROM; const c = cam(t), out = [];
  const pg = pageAt(t);
  EL.forEach((e, i) => { if (e.kind !== 'write' || t < e.t0 || e.page !== pg) return; const [a, b, cc, d] = e.T.box;
    const cs = [[a, b], [cc, b], [a, d], [cc, d]].map(([x, y]) => toScreen(c, x, y)), bb = bbox(cs);
    out.push({ id: 'txt' + i, text: e.T.s, x0: bb[0], y0: bb[1], x1: bb[2], y1: bb[3] }); });
  return out;
};

