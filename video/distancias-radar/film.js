// «¿Cómo se mide el universo?» · Radar Sweep Documentary (lemo-opuscar), vertical 1080 × 1920, 24 fps, 96 s.
// Todo es negro hasta que pasa un barrido: lo tocado se enciende y queda en ecos (anillos, rejilla, alambre) que se apagan
// despacio. Cada toma tiene su propio barrido (plano o ping radial) en coordenadas de pantalla; las lecturas las escribe una
// barra que avanza de izquierda a derecha. Un solo color cálido por cuadro: el pulso, la estrella buscada, la línea del
// hidrógeno. Canvas 2D: geometría → bloom (desenfoque reducido y sumado) → viñeta → textos nítidos.
import { W, H, DUR, T, TX, WIPES, WIPE, SILENCES, NARR, LASER, PARALLAX, REDSHIFT } from './data.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const GEO = mk(W, H), g0 = GEO.getContext('2d');
const GEO2 = mk(W, H), g1 = GEO2.getContext('2d');
const BL1 = mk(W / 4, H / 4), b1 = BL1.getContext('2d');
const BL2 = mk(W / 8, H / 8), b2 = BL2.getContext('2d');
const TXT = mk(W, H), o0 = TXT.getContext('2d');
const TXT2 = mk(W, H), o1 = TXT2.getContext('2d');
window.DUR = DUR;

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, k) => a + (b - a) * k;
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// el barrido avanza a empujones en cada pulso (80 ppm), con una deriva para que nunca se detenga
const BEAT = 60 / 80;
const surge = (t, a, b) => { const x = clamp((t - a) / (b - a)); const n = Math.max(1, Math.round((b - a) / BEAT)); const k = x * n, i = Math.floor(k); return clamp((i + eo(k - i)) / n * .8 + x * .2); };

const C = { echo: [179, 219, 255], white: [240, 248, 255], warm: [242, 196, 141], red: [255, 140, 120], hi: [238, 242, 246], mid: [196, 206, 216], lo: [150, 162, 176] };
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${clamp(a).toFixed(3)})`;
const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const SANS = 'Plex', MONO = 'JBM';

// ---------- barrido ----------
// plano: d = f − (x·dx + y·dy) ; ping: d = R − |p − c| ; d < 0: aún no visto
let SCAN = null, DIM = 1;
const planeScan = (dx, dy, f) => ({ d: (x, y) => f - (x * dx + y * dy) });
const pingScan = (cx, cy, R) => ({ d: (x, y) => R - Math.hypot(x - cx, y - cy) });
const both = (a, b) => ({ d: (x, y) => Math.max(a.d(x, y), b.d(x, y)) });
// brillo de un punto: frente blanco, resplandor corto, eco que queda
function lit(x, y, floor = .34) {
  if (!SCAN) return { a: floor, f: 0 };
  const d = SCAN.d(x, y); if (d < 0) return { a: 0, f: 0 };
  const f = Math.exp(-(d * d) / (26 * 26)), gl = Math.exp(-d / 90), tr = Math.exp(-d / 700);
  return { a: (floor + (1 - floor) * .45 * tr + gl * .5 + f * 1.1) * DIM, f };
}

// ---------- dibujo de geometría (ecos) ----------
let g = g0;
function line(pts, { col = C.echo, w = 2.4, a = 1, floor, step = 14 } = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 0; k < n; k++) {
      const xa = lerp(x0, x1, k / n), ya = lerp(y0, y1, k / n), xb = lerp(x0, x1, (k + 1) / n), yb = lerp(y0, y1, (k + 1) / n);
      const L = lit((xa + xb) / 2, (ya + yb) / 2, floor); if (L.a <= .005) continue;
      g.strokeStyle = rgba(mix(col, C.white, Math.min(1, L.f)), L.a * a); g.lineWidth = w;
      g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.stroke();
    }
  }
}
const circlePts = (cx, cy, rx, ry = rx, a0 = 0, a1 = Math.PI * 2, n = 96) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
function dot(x, y, r, col, a) { g.fillStyle = rgba(col, a); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
function glowDot(x, y, r, col, a) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r * 5); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(.25, rgba(col, a * .35)); gr.addColorStop(1, rgba(col, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 5, 0, Math.PI * 2); g.fill(); dot(x, y, r, mix(col, C.white, .5), a);
}
// esfera en alambre: paralelos y meridianos de la cara visible, borde frío, disco negro que tapa lo de atrás
function sphere(cx, cy, r, rot, { lat = 9, lon = 12, tilt = .32, col = C.echo, a = 1, craters = null } = {}) {
  const L = lit(cx, cy - r * .2);
  g.fillStyle = '#000'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
  const P = (la, lo) => { const x = Math.cos(la) * Math.sin(lo + rot), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo + rot);
    const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt); return [cx + r * x, cy - r * y2, z2]; };
  const strokeVis = pts => { let run = []; for (const p of pts) { if (p[2] > 0) run.push(p); else { if (run.length > 1) line(run, { col, w: 2, a: a * .75 }); run = []; } } if (run.length > 1) line(run, { col, w: 2, a: a * .75 }); };
  for (let i = 1; i < lat; i++) { const la = -Math.PI / 2 + Math.PI * i / lat; strokeVis(Array.from({ length: 73 }, (_, k) => P(la, k / 72 * Math.PI * 2))); }
  for (let j = 0; j < lon; j++) { const lo = j / lon * Math.PI * 2; strokeVis(Array.from({ length: 49 }, (_, k) => P(-Math.PI / 2 + Math.PI * k / 48, lo))); }
  if (craters) for (const [la, lo, s] of craters) { const pts = Array.from({ length: 25 }, (_, k) => { const an = k / 24 * Math.PI * 2; return P(la + s * Math.sin(an), lo + s * Math.cos(an) / Math.max(.3, Math.cos(la))); }); strokeVis(pts); }
  // borde frío: la silueta nunca se hunde en el negro
  if (L.a > 0) { g.strokeStyle = rgba(C.echo, Math.min(1, .55 * a * (L.a > 0 ? 1 : 0) + .5 * L.f)); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke(); }
}
// anillos de distancia alrededor de algo (ping radial que se apaga)
function rings(cx, cy, t, t0, col = C.echo, maxR = 260, n = 3, a = 1) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) {
    const k = (t - t0 - i * .18) / 1.6; if (k <= 0 || k >= 1) continue;
    g.strokeStyle = rgba(col, (1 - k) * .8 * a); g.lineWidth = 2.4 * (1 - k) + .6; g.beginPath(); g.arc(cx, cy, 20 + maxR * eo(k), 0, Math.PI * 2); g.stroke();
  }
}

// ---------- estrellas fijas (nunca titilan; aparecen detrás del barrido) ----------
const STARS = (() => { const r = rng(11), s = []; for (let i = 0; i < 520; i++) s.push([r() * W, r() * (H + 400) - 200, 1.3 + r() * 1.6, .25 + r() * .6]); return s; })();
function stars(dy = 0, a = 1, region = null) {
  for (const [x, y0, rr, b] of STARS) {
    const y = y0 + dy; if (y < -10 || y > H + 10) continue;
    if (region && (y < region[0] || y > region[1])) continue;
    const L = lit(x, y, .55); if (L.a <= 0) continue;
    dot(x, y, rr + L.f * 1.5, mix(C.echo, C.white, .6), Math.min(1, L.a * b * a));
  }
}

// ---------- textos (escritos por una barra de barrido) ----------
let o = o0, TEXTS = [], CLIP = [0, H];
const pushText = (id, text, x0, y0, x1, y1) => { if (y0 >= CLIP[0] && y1 <= CLIP[1]) TEXTS.push({ id, text, x0, y0, x1, y1 }); };
function spacedW(s, sp) { let w = 0; for (const ch of s) w += o.measureText(ch).width + sp; return w - sp; }
function spaced(s, x, y, sp) { for (const ch of s) { o.fillText(ch, x, y); x += o.measureText(ch).width + sp; } }
function plate(x, y, w, h, a, k = .72) { o.fillStyle = `rgba(0,3,8,${(k * a).toFixed(3)})`; o.beginPath(); o.roundRect(x, y, w, h, 10); o.fill(); }
// say: escribe un texto que entra con la barra en t0 y se va en t1 (barrido que lo borra)
function say(id, t, t0, x, y, s, { size = 32, font = MONO, wt = 400, sp, col = C.mid, t1 = 1e9, dur = .5, maxW, align = 'left', pl = false, plA = .72, a = 1 } = {}) {
  maxW ??= align === 'right' ? x - LX : 925 - x;
  if (t < t0 || t > t1 + .3) return;
  if (font === MONO) size *= 1.1;            // en el celular la letra fina se achica: un poco más grande
  sp ??= font === MONO ? size * .07 : size * .01;
  let fs = size; o.font = `${wt} ${fs}px ${font}`; let w = spacedW(s, sp);
  if (w > maxW) { fs = size * maxW / w; sp *= fs / size; o.font = `${wt} ${fs}px ${font}`; w = spacedW(s, sp); }
  const x0 = align === 'right' ? x - w : x;
  const k = seg(t, t0, t0 + dur), out = seg(t, t1, t1 + .3);
  const al = a * (1 - out);
  if (pl) plate(x0 - 14, y - fs * .95, w + 28, fs * 1.35, al * Math.min(1, k * 3), plA);
  const xe = x0 - 4 + (w + 8) * eo(k);
  o.save(); o.beginPath(); o.rect(x0 - 6, y - fs * 1.1, xe - x0 + 6, fs * 1.6); o.clip();
  o.fillStyle = rgba(col, al); spaced(s, x0, y, sp); o.restore();
  if (k < 1) { o.fillStyle = rgba(C.white, Math.sin(Math.PI * k) * .95 * al); o.fillRect(xe, y - fs * 1.0, 2, fs * 1.35); }
  if (k >= 1 && out <= 0) pushText(id, s, x0, y - fs * .8, x0 + w, y + fs * .25);
  return w;
}
// línea guía fina entre una lectura y su objeto
function leader(t, t0, pts, a = .6, col = C.lo) {
  if (t < t0) return; const k = eo(seg(t, t0, t0 + .35));
  o.strokeStyle = rgba(col, a); o.lineWidth = 1.5; o.beginPath(); o.moveTo(...pts[0]);
  for (let i = 1; i < pts.length; i++) { const [xa, ya] = pts[i - 1], [xb, yb] = pts[i]; const kk = clamp(k * (pts.length - 1) - (i - 1)); if (kk <= 0) break; o.lineTo(lerp(xa, xb, kk), lerp(ya, yb, kk)); }
  o.stroke();
}
const LX = 160;                          // margen izquierdo de todas las lecturas (app: 14 %–86 % del ancho)
const stepLabel = (t, t0, s, t1) => say('step' + t0, t, t0, LX, 232, s, { size: 30, col: C.hi, wt: 500, t1 });

// ================= TOMAS =================
// 1 · la Tierra en el negro: un ping nace en ella y enciende el cielo
function shot1(t) {
  const R = (t - T.ping) * 520 + 60 * eo(seg(t, T.ping, T.ping + .6));
  SCAN = pingScan(540, 1180, R);
  const dy = -t * 6;                       // la cámara solo se traslada: el cielo viaja con ella
  stars(dy);
  const sx = 760, sy = 560 + dy;
  const Ls = lit(sx, sy);
  if (Ls.a > 0) { glowDot(sx, sy, 4.5, C.warm, Math.min(1, Ls.a * 1.4)); rings(sx, sy, t, T.target, C.warm, 120, 2, .8); }
  sphere(540, 1180, 220, t * .12, { lat: 10, lon: 14 });
  rings(540, 1180, t, T.ping, C.echo, 700, 3);
  say('title', t, T.title, LX, 340, TX.title, { font: SANS, wt: 250, size: 64, col: C.hi, dur: .7 });
  say('mateo', t, T.mateo, LX, 1500, TX.mateo, { size: 30 });
  say('target', t, T.target, LX, 660, TX.target, { size: 30, col: C.warm, pl: true });
  leader(t, T.target + .3, [[LX + 420, 668], [sx - 12, sy + 10]], .5);
  say('noRuler', t, T.noRuler, LX, 1550, TX.noRuler, { size: 30, col: C.lo });
}

// 2 · la Luna: un pulso de luz va al reflector y vuelve
const ST = [800, 1452], RF = [818, 476];
function shot2(t) {
  const f = lerp(-1960, 140, surge(t, T.c2, T.c2 + 2.2));
  SCAN = both(planeScan(0, -1, f), pingScan(...RF, (t - T.hit) * 600));
  stars(0, .6);
  sphere(540, 1900, 520, .2 + t * .02, { lat: 12, lon: 18 });
  sphere(830, 380, 100, -.4 + t * .015, { lat: 7, lon: 10, craters: [[.3, .2, .12], [-.2, -.5, .09], [.5, -.9, .07], [-.45, .6, .1]] });
  dot(...RF, 4, C.echo, .9);
  // el pulso: sube, toca el reflector y baja; queda una estela cálida
  const up = seg(t, T.fire, T.hit), dn = seg(t, T.hit, T.back);
  if (t >= T.fire) {
    const head = t < T.hit ? up : 1 - dn, hx = lerp(ST[0], RF[0], head), hy = lerp(ST[1], RF[1], head);
    const fade = 1 - seg(t, T.back + .3, T.back + 2.5) * .7;
    g.strokeStyle = rgba(C.warm, .5 * fade); g.lineWidth = 2;
    g.beginPath(); g.moveTo(...ST); g.lineTo(t < T.hit ? hx : RF[0], t < T.hit ? hy : RF[1]); g.stroke();
    if (t >= T.hit) { g.strokeStyle = rgba(C.warm, .8 * fade); g.lineWidth = 2.5; g.beginPath(); g.moveTo(...RF); g.lineTo(hx, hy); g.stroke(); }
    if (t < T.back + .1) glowDot(hx, hy, 5, C.warm, 1);
  }
  rings(...RF, t, T.hit, C.echo, 160, 2); rings(...ST, t, T.back, C.echo, 200, 2);
  stepLabel(t, T.l2, TX.l2);
  say('scale', t, T.l2 + .5, LX, 280, TX.scale, { size: 24, col: C.lo });
  say('refl', t, T.l2 + 1.0, LX, 470, TX.refl, { size: 28, maxW: 560 });
  leader(t, T.l2 + 1.4, [[LX + 570, 478], [RF[0] - 10, RF[1]]]);
  say('earth', t, T.l2 + 1.4, LX, 1360, TX.earth, { size: 28, t1: T.omen1 - .4 });
  if (t < T.omen1 - .3) leader(t, T.l2 + 1.8, [[LX + 330, 1368], [ST[0] - 10, ST[1] - 6]]);
  // cronómetro: cuenta en tiempo real mientras la luz viaja
  if (t >= T.fire - .4) {
    const v = clamp(t - T.fire, 0, LASER.t);
    o.font = `300 128px ${SANS}`; const s = v.toFixed(2);
    o.fillStyle = rgba(t >= T.back ? C.hi : C.mid, eo(seg(t, T.fire - .4, T.fire))); o.fillText(s, LX, 690);
    if (t >= T.back + .1) pushText('timer', s, LX, 600, LX + 260, 700);
    say('tu', t, T.fire - .2, LX, 740, TX.timerUnit, { size: 26, col: C.lo });
  }
  say('cR', t, T.cR, LX, 870, TX.cR, { size: 32, maxW: 580 });
  say('cF', t, T.cF, LX, 950, TX.cF, { font: SANS, wt: 300, size: 50, col: C.hi, maxW: 580 });
  say('cN', t, T.cN, LX, 1030, TX.cN, { font: SANS, wt: 300, size: 44, maxW: 580 });
  say('cD', t, T.cD, LX, 1150, TX.cD, { font: SANS, wt: 300, size: 92, col: C.hi, maxW: 590, dur: .6 });
  say('cHalf', t, T.cHalf, LX, 1215, TX.cHalf, { size: 28, col: C.lo, maxW: 590 });
  say('omen1', t, T.omen1, LX, 1300, TX.omen1, { size: 28, col: C.mid, maxW: 590 });
  say('omen2', t, T.omen2, LX, 1345, TX.omen2, { size: 28, col: C.hi, maxW: 590 });
}

// 3 · paralaje: la Tierra en enero y en julio, la estrella cercana se corre frente a las lejanas
const SUN = [540, 1350], ORX = 300, ORY = 110, STAR = [540, 700], BAND = [330, 470];
const earthAt = th => [SUN[0] + ORX * Math.cos(th), SUN[1] + ORY * Math.sin(th)];
const toBand = (E) => { const k = (E[1] - 400) / (E[1] - STAR[1]); return [E[0] + (STAR[0] - E[0]) * k, 400]; };
function shot3(t) {
  const f = lerp(-1960, 160, surge(t, T.c3, T.c3 + 2.4));
  SCAN = both(planeScan(0, -1, f), pingScan(...STAR, (t - T.f4) * 700));
  const dimF = lerp(1, .35, seg(t, T.f1 - .3, T.f1 + .3));
  const coin = seg(t, T.coin, T.coin + .3) * (1 - seg(t, T.coinEnd - .3, T.coinEnd));
  DIM = dimF * (1 - .75 * coin);
  stars(0, 1, BAND);
  // estrellas lejanas de la franja: una rejilla de referencia
  line([[LX, BAND[0] - 10], [929, BAND[0] - 10]], { a: .35, w: 1 }); line([[LX, BAND[1] + 10], [929, BAND[1] + 10]], { a: .35, w: 1 });
  line(circlePts(SUN[0], SUN[1], ORX, ORY), { w: 2 });
  for (const k of [1.5, 2.2]) line(circlePts(SUN[0], SUN[1], ORX * k, ORY * k), { w: 1, a: .25 });
  const Lsun = lit(...SUN); if (Lsun.a > 0) glowDot(...SUN, 9, C.white, Math.min(1, Lsun.a));
  const LS = lit(...STAR); if (LS.a > 0) { glowDot(...STAR, 5, C.warm, Math.min(1, LS.a * 1.5)); rings(...STAR, t, T.f4, C.warm, 260, 3); }
  // la Tierra: enero a la izquierda, viaja por delante del Sol hasta julio
  const k = eio(seg(t, T.move0, T.move1)), th = lerp(Math.PI, 0, k) * -1 + Math.PI * 2 * 0;
  const thAt = kk => Math.PI - Math.PI * kk;       // por la mitad de adelante (abajo en pantalla)
  const E = earthAt(thAt(k)).map((v, i) => i === 1 ? SUN[1] + ORY * Math.sin(thAt(k)) : v);
  const Ej = earthAt(Math.PI), El = earthAt(0);
  if (t > T.jan - .2 && t < T.move0) sphereSmall(Ej, t);
  if (t >= T.move0) {
    for (let i = 5; i >= 1; i--) { const kk = eio(seg(t - i * .12, T.move0, T.move1)); if (kk <= 0 || kk >= 1) continue; const P = [SUN[0] + ORX * Math.cos(thAt(kk)), SUN[1] + ORY * Math.sin(thAt(kk))]; g.strokeStyle = rgba(C.echo, .5 - i * .08); g.lineWidth = 1.5; g.beginPath(); g.arc(P[0], P[1], 22, 0, Math.PI * 2); g.stroke(); }
    sphereSmall(E, t);
  }
  // visuales: de la Tierra, por la estrella, hasta la franja lejana
  const sightA = (1 - seg(t, T.tri, T.tri + .6) * .7);
  const bJ = toBand(Ej), bL = toBand(El);
  if (t >= T.sightJ) { const kk = eo(seg(t, T.sightJ, T.sightJ + .5)); line([Ej, [lerp(Ej[0], bJ[0], kk), lerp(Ej[1], bJ[1], kk)]], { col: C.echo, w: 1.6, a: .8 * sightA }); }
  if (t >= T.sightL) { const kk = eo(seg(t, T.sightL, T.sightL + .5)); line([El, [lerp(El[0], bL[0], kk), lerp(El[1], bL[1], kk)]], { col: C.echo, w: 1.6, a: .8 * sightA }); }
  // dónde se ve la estrella sobre el fondo, en enero y en julio
  for (const [b, t0] of [[bJ, T.sightJ + .5], [bL, T.sightL + .5]]) if (t > t0) { g.strokeStyle = rgba(C.warm, .7 * sightA * DIM); g.lineWidth = 2; g.beginPath(); g.arc(b[0], b[1], 11, 0, Math.PI * 2); g.stroke(); }
  if (t > T.shift) { const kk = eo(seg(t, T.shift, T.shift + .6)); g.strokeStyle = rgba(C.white, .7 * sightA * DIM); g.lineWidth = 2; g.beginPath(); g.moveTo(bJ[0] - 16, 400); g.lineTo(lerp(bJ[0] - 16, bL[0] + 16, kk), 400); g.stroke(); }
  // triángulo Sol–Tierra–estrella y el ángulo p
  if (t >= T.tri) {
    const kk = eo(seg(t, T.tri, T.tri + .7));
    line([SUN, El], { w: 3, a: kk }); line([El, [lerp(El[0], STAR[0], kk), lerp(El[1], STAR[1], kk)]], { w: 2, a: kk }); line([SUN, [SUN[0], lerp(SUN[1], STAR[1], kk)]], { w: 2, a: kk });
    if (t >= T.ang) { const a0 = Math.atan2(El[1] - STAR[1], El[0] - STAR[0]), a1 = Math.PI / 2; const ka = eo(seg(t, T.ang, T.ang + .5)); line(circlePts(...STAR, 90, 90, a0, lerp(a0, a1, ka), 24), { col: C.hi, w: 2.5, a: 1 }); }
  }
  // textos
  const coinOff = T.coin - .05, coinOn = T.coinEnd;
  stepLabel(t, T.l3, TX.l3);
  say('far', t, T.l3 + .8, LX, 312, TX.far, { size: 24, col: C.lo });
  say('sun', t, T.jan - .4, 580, 1312, TX.sun, { size: 26, col: C.lo, t1: T.f1 - .3 });
  say('jan', t, T.jan, LX, 1510, TX.jan, { size: 28, t1: T.move0 + .9 });
  say('jul', t, T.sightL - .2, 925, 1510, TX.jul, { size: 28, align: 'right' });
  say('star', t, T.jan + .4, 590, 655, TX.star, { size: 28, col: C.warm, maxW: 330, pl: true });
  say('shift', t, T.shift, LX, 545, TX.shift, { size: 28, pl: true, t1: T.ang + .4 });
  say('base', t, T.base, LX, 1572, TX.base, { size: 26, maxW: 600 });
  say('radar', t, T.base + .4, LX, 1614, TX.radar, { size: 24, col: C.lo, maxW: 600 });
  leader(t, T.base + .3, [[LX + 300, 1548], [690, 1360]], .5);
  say('ang', t, T.ang, LX, 880, TX.ang, { font: SANS, wt: 300, size: 96, col: C.hi, maxW: 330, pl: true });
  say('exag', t, T.exag, LX, 924, TX.exag, { size: 22, col: C.lo, maxW: 330 });
  say('half', t, T.exag + .5, LX, 962, TX.half, { size: 22, col: C.mid, maxW: 330, pl: true });
  // comparación quieta: la moneda a 5 km
  if (coin > 0) {
    o.fillStyle = `rgba(0,0,0,${(.0 * coin).toFixed(3)})`;
    const y = 1180, kk = eo(seg(t, T.coin + .2, T.coin + 1.2));
    const ex = 200, cx = 870, cr = 16;   // las rectas salen del ojo y se abren hacia la moneda, vista de frente
    g.strokeStyle = rgba(C.echo, .9 * coin); g.lineWidth = 2; g.beginPath(); g.moveTo(ex, y); g.lineTo(lerp(ex, cx, kk), y - cr * kk); g.moveTo(ex, y); g.lineTo(lerp(ex, cx, kk), y + cr * kk); g.stroke();
    if (kk >= 1) { g.strokeStyle = rgba(C.white, coin); g.lineWidth = 2.5; g.beginPath(); g.arc(cx, y, cr, 0, Math.PI * 2); g.stroke(); }
    g.strokeStyle = rgba(C.hi, coin); g.lineWidth = 2; g.beginPath(); g.ellipse(ex - 12, y, 12, 7, 0, 0, Math.PI * 2); g.stroke(); dot(ex - 12, y, 3, C.hi, coin);
    say('coin1', t, T.coin + .4, LX, 1020, TX.coin1, { font: SANS, wt: 300, size: 60, col: C.hi, t1: coinOn - .3 });
    say('coin2', t, T.coin + .9, LX, 1095, TX.coin2, { font: SANS, wt: 300, size: 60, col: C.hi, t1: coinOn - .3 });
    say('km5', t, T.coin + 1.3, 470, 1240, '5 KM', { size: 28, col: C.mid, t1: coinOn - .3 });
    say('eye', t, T.coin + .6, LX, 1150, TX.eye, { size: 24, col: C.lo, t1: coinOn - .3 });
    say('coinL', t, T.coin + .8, 925, 1150, TX.coinL, { size: 24, col: C.lo, align: 'right', t1: coinOn - .3 });
  }
  // la cuenta
  say('f1', t, T.f1, LX, 1045, TX.f1, { font: SANS, wt: 300, size: 64, col: C.hi, pl: true, plA: .92 });
  say('pcU', t, T.f1 + .5, LX, 1092, TX.pcU, { size: 24, col: C.lo, pl: true, plA: .92 });
  say('f2', t, T.f2, LX, 1140, TX.f2, { size: 30, pl: true, plA: .92 });
  say('f3', t, T.f3, LX, 1188, TX.f3, { size: 30, col: C.lo, pl: true, plA: .92 });
  say('f4', t, T.f4, LX, 1280, TX.f4, { font: SANS, wt: 300, size: 88, col: C.hi, pl: true, plA: .94, dur: .6 });
  say('f5', t, T.f5, LX, 1335, TX.f5, { size: 30, col: C.warm, pl: true, plA: .94 });
  void th; void coinOff;
}
function sphereSmall(P, t) { sphere(P[0], P[1], 22, t * .3, { lat: 4, lon: 6, tilt: .2 }); }

// 4 · velas estándar: la misma luz repartida en más área; la cefeida que late
const APEX = [540, 400], F1 = { y: 760, h: 100 }, F2 = { y: 1140, h: 200 };
function frameQuad(F, n, fill, t, t0) {
  // un cuadro visto un poco de lado: rombo achatado; n × n celdas
  const c = [540, F.y], hx = F.h, hy = F.h * .32;
  const P = (u, v) => [c[0] + (u - .5) * 2 * hx + (v - .5) * hx * .5, c[1] + (v - .5) * 2 * hy];
  if (t >= t0 && fill > 0) {
    const k = eo(seg(t, t0, t0 + .5));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const q = [P(i / n, j / n), P((i + 1) / n, j / n), P((i + 1) / n, (j + 1) / n), P(i / n, (j + 1) / n)];
      g.fillStyle = rgba(C.white, fill * k * DIM); g.beginPath(); g.moveTo(...q[0]); for (const p of q.slice(1)) g.lineTo(...p); g.closePath(); g.fill();
    }
  }
  for (let i = 0; i <= n; i++) { line([P(i / n, 0), P(i / n, 1)], { w: 1.8 }); line([P(0, i / n), P(1, i / n)], { w: 1.8 }); }
  return [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
}
function shot4(t) {
  if (t < T.cCep) {
    SCAN = pingScan(...APEX, (t - T.cone) * 560);
    stars(0, .5);
    const q2 = [[540 - 200 - 50, F2.y - 64], [540 + 200 - 50, F2.y - 64], [540 + 200 + 50, F2.y + 64], [540 - 200 + 50, F2.y + 64]];
    for (const q of q2) line([APEX, q], { w: 1.6, a: .8 });
    // partículas de luz que salen de la fuente por el cono
    if (t > T.cone + .6) for (let i = 0; i < 46; i++) {
      const r = rng(i + 3), q = q2[i % 4], u = r(), ph = (t * .45 + r()) % 1;
      const tgt = [lerp(q2[0][0], q2[2][0], u), lerp(q2[0][1], q2[2][1], r())];
      const x = lerp(APEX[0], tgt[0], ph), y = lerp(APEX[1], tgt[1], ph); void q;
      dot(x, y, 1.6, C.white, .5 * (1 - ph) * lit(x, y).a);
    }
    frameQuad(F1, 1, .34, t, T.frame1);
    frameQuad(F2, 2, .085, t, T.frame2);
    glowDot(...APEX, 8, C.white, Math.min(1, .3 + lit(...APEX).a));
    rings(...APEX, t, T.cone, C.echo, 300, 3);
    stepLabel(t, T.l4, TX.l4, T.cCep - .35);
    say('src', t, T.cone + .6, 600, 380, TX.src, { size: 28, t1: T.cCep - .35 });
    say('f1a', t, T.frame1, 680, 760, TX.frame1a, { size: 28, t1: T.cCep - .35 });
    say('f1b', t, T.frame1 + .3, 680, 800, TX.frame1b, { size: 28, col: C.hi, t1: T.cCep - .35 });
    say('f2a', t, T.frame2, LX, 1290, TX.frame2a, { size: 28, t1: T.cCep - .35 });
    say('f2b', t, T.frame2 + .3, LX, 1330, TX.frame2b, { size: 28, col: C.hi, t1: T.cCep - .35 });
    say('quarter', t, T.quarter, LX, 1440, TX.quarter, { font: SANS, wt: 300, size: 54, col: C.hi, t1: T.cCep - .35 });
    say('inv', t, T.inv, LX, 1530, TX.inv, { font: SANS, wt: 300, size: 64, col: C.hi, t1: T.cCep - .35 });
    say('fl', t, T.fl, LX, 1595, TX.fl, { size: 26, col: C.lo, t1: T.cCep - .35 });
    return;
  }
  // la cefeida: late, y su brillo se escribe en un trazo
  SCAN = both(planeScan(1, 0, lerp(-200, 1400, surge(t, T.cCep, T.cCep + 1.6))), pingScan(540, 620, (t - T.cCep) * 900));
  stars(0, .5);
  const P = 1.6, ph = ((t - T.cCep) / P) % 1;
  const lc = x => x < .18 ? x / .18 : 1 - (x - .18) / .82;            // sube rápido, baja despacio
  const b = lc(ph), r = 92 + 12 * b;
  const gr = g.createRadialGradient(540, 620, 0, 540, 620, r * 2.4); gr.addColorStop(0, rgba(C.white, (.25 + .45 * b) * lit(540, 620).a)); gr.addColorStop(1, rgba(C.white, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(540, 620, r * 2.4, 0, Math.PI * 2); g.fill();
  sphere(540, 620, r, t * .1, { lat: 7, lon: 10 });
  // el trazo: tres latidos (sin escala vertical: solo el periodo es un dato)
  const X0 = LX, X1 = 920, Y0 = 1000, Y1 = 1170, kk = seg(t, T.trace, T.trace + 2.4);
  line([[X0, Y1 + 10], [X1, Y1 + 10]], { w: 1, a: .4 });
  const pts = []; for (let i = 0; i <= 240 * kk; i++) { const x = i / 240; pts.push([lerp(X0, X1, x), lerp(Y1, Y0, lc((x * 3.2 + .7) % 1))]); }
  if (pts.length > 1) line(pts, { col: C.echo, w: 2.4, a: 1, floor: .6 });
  if (t > T.period) { const xa = lerp(X0, X1, (1 - .7 + .18) / 3.2 % 1), xb = xa + (X1 - X0) / 3.2, kp = eo(seg(t, T.period, T.period + .4));
    g.strokeStyle = rgba(C.hi, .8); g.lineWidth = 1.5; g.beginPath(); g.moveTo(xa, Y0 - 24); g.lineTo(lerp(xa, xb, kp), Y0 - 24); g.moveTo(xa, Y0 - 34); g.lineTo(xa, Y0 - 14); if (kp >= 1) { g.moveTo(xb, Y0 - 34); g.lineTo(xb, Y0 - 14); } g.stroke(); }
  say('cepName', t, T.cepName, LX, 300, TX.cepName, { size: 28, col: C.hi });
  say('traceLab', t, T.trace, LX, 975, TX.traceLab, { size: 22, col: C.lo });
  say('period', t, T.period, LX, 1235, TX.period, { size: 32, col: C.hi });
  say('leav1', t, T.leavitt, LX, 1310, TX.leavitt1, { size: 30 });
  say('leav2', t, T.leavitt + .4, LX, 1355, TX.leavitt2, { size: 30, col: C.hi });
  say('calibCep', t, T.calibCep, LX, 1400, TX.calibCep, { size: 28, col: C.lo });
  say('compare', t, T.compare, LX, 1480, TX.compare, { size: 30 });
  say('andro', t, T.andro, LX, 1560, TX.andro, { size: 32, col: C.hi });
}

// 5 · corrimiento al rojo: la galaxia, la onda que se estira, el espectro
const GAL = [540, 470], SX = l => LX + (l - 645) / 35 * 760, SY = 1400;
const GALPTS = (() => { const r = rng(5), p = []; for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 220; i++) { const s = i / 220, a = arm * Math.PI + s * 4.2 + (r() - .5) * .5, rr = 12 + s * 150 + (r() - .5) * 18; p.push([Math.cos(a) * rr, Math.sin(a) * rr * .45, .6 + r() * 1.2]); } for (let i = 0; i < 160; i++) { const a = r() * 6.28, rr = Math.pow(r(), 2) * 40; p.push([Math.cos(a) * rr, Math.sin(a) * rr * .5, 1 + r()]); } return p; })();
function shot5(t) {
  SCAN = pingScan(...GAL, (t - T.c5) * 640 + 40);
  const fz = seg(t, T.z - .3, T.z + .3); DIM = 1;
  stars(0, .5);
  for (const [x, y, s] of GALPTS) { const X = GAL[0] + x * Math.cos(.35) - y * Math.sin(.35), Y = GAL[1] + x * Math.sin(.35) + y * Math.cos(.35); const L = lit(X, Y, .5); if (L.a > 0) dot(X, Y, s, mix(C.echo, C.white, .5), Math.min(1, L.a)); }
  // rejilla del espacio que se estira (el espaciado crece con el tiempo)
  const ex = 1 + .35 * seg(t, T.wave0, T.wave1), gA = 1 - fz * .7;
  for (let i = 0; i < 12; i++) { const y = 640 + i * 52 * ex; if (y > 1290) break; line([[LX, y], [929, y]], { w: 1, a: .3 * gA }); }
  // la onda cálida baja de la galaxia al espectro y se estira en el camino
  if (t >= T.wave0) {
    const head = lerp(620, 1300, eio(seg(t, T.wave0, T.wave1)));
    const pts = []; let ph = 0;
    for (let y = 620; y <= head; y += 3) { const lam = 44 * (1 + .45 * (y - 620) / 680); ph += 3 / lam; pts.push([540 + 34 * Math.sin(ph * Math.PI * 2), y]); }
    g.strokeStyle = rgba(C.warm, .85 * (1 - fz * .6)); g.lineWidth = 2.6; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke();
  }
  // el espectro: barra con marcas cada 5 nm, la línea de laboratorio y la que llega
  if (t >= T.spec) {
    const k = eo(seg(t, T.spec, T.spec + .5));
    line([[LX, SY - 30], [lerp(LX, 920, k), SY - 30]], { w: 1.5, floor: .7 }); line([[LX, SY + 30], [lerp(LX, 920, k), SY + 30]], { w: 1.5, floor: .7 });
    for (let l = 645; l <= 680; l += 5) if (SX(l) < lerp(LX, 920, k)) line([[SX(l), SY + 30], [SX(l), SY + 44]], { w: 1.5, floor: .7 });
    if (t >= T.labLine) { g.setLineDash([8, 8]); g.strokeStyle = rgba(C.echo, .8); g.lineWidth = 3; g.beginPath(); g.moveTo(SX(REDSHIFT.lab), SY - 30); g.lineTo(SX(REDSHIFT.lab), SY + 30); g.stroke(); g.setLineDash([]); }
    if (t >= T.obsLine) { const x = lerp(SX(REDSHIFT.lab), SX(REDSHIFT.obs), eio(seg(t, T.obsLine, T.obsLine + .8))); glowDot(x, SY, 3, C.warm, 1); g.strokeStyle = rgba(C.warm, 1); g.lineWidth = 4; g.beginPath(); g.moveTo(x, SY - 30); g.lineTo(x, SY + 30); g.stroke(); }
  }
  stepLabel(t, T.l5, TX.l5);
  say('gal', t, T.l5 + .6, 720, 340, TX.gal, { size: 26, col: C.lo });
  say('stretch', t, T.stretch, LX, 1000, TX.stretch, { size: 28, pl: true, t1: T.z - .3 });
  say('exag2', t, T.stretch + .6, LX, 1045, TX.exag2, { size: 22, col: C.lo, pl: true, t1: T.z - .3 });
  say('labLine', t, T.labLine, LX, 1340, TX.labLine, { size: 26, maxW: 560 });
  say('obsLine', t, T.obsLine + .5, 925, 1490, TX.obsLine, { size: 28, col: C.warm, align: 'right', maxW: 400 });
  say('red', t, T.obsLine + 1.0, LX, 1490, TX.red, { size: 26, col: C.lo, maxW: 300 });
  say('z', t, T.z, LX, 760, TX.z, { size: 32, pl: true });
  say('v', t, T.v, LX, 840, TX.v, { size: 32, pl: true });
  say('hub', t, T.hub, LX, 920, TX.hub, { size: 30, pl: true });
  say('d', t, T.d, LX, 1000, TX.d, { size: 32, pl: true });
  say('dly', t, T.dly, LX, 1110, TX.dly, { font: SANS, wt: 300, size: 64, col: C.hi, pl: true, dur: .6 });
  say('note', t, T.note, LX, 1170, TX.note, { size: 26, col: C.lo, pl: true });
  say('mpc', t, T.mpc, LX, 1215, TX.mpc, { size: 26, col: C.lo, pl: true });
}

// 6 · la escalera: cuatro escalones, cada uno calibra el siguiente; se aleja y sube
const RUNGS = [[1460, 'r1'], [1190, 'r2'], [920, 'r3'], [650, 'r4']];
function shot6(t) {
  SCAN = planeScan(0, -1, lerp(-1700, 200, surge(t, T.c6, T.c6 + 2.6)));
  const out = seg(t, T.out - .2, T.out + .4); DIM = 1 - .7 * out;
  stars(-(t - T.c6) * 8, .7);
  const s = lerp(1.12, 1, eo(seg(t, T.c6, T.out))), ty = lerp(-90, 0, eo(seg(t, T.c6, T.out)));
  g.save(); g.translate(540, 1000 + ty); g.scale(s, s); g.translate(-540, -1000);
  line([[200, 1600], [200, 560]], { w: 2.5 }); line([[270, 1600], [270, 560]], { w: 2.5 });
  RUNGS.forEach(([y, id], i) => { const t0 = T[id]; if (t < t0) return; const k = eo(seg(t, t0, t0 + .4)); line([[200, y], [lerp(200, 270, k), y]], { w: 4, col: i === 1 ? C.warm : C.echo, floor: .8 }); rings(235, y, t, t0, C.echo, 90, 1); });
  g.restore();
  RUNGS.forEach(([y, id], i) => { say(id + 'a', t, T[id], 300, y - 10, TX[id + 'a'], { font: SANS, wt: 300, size: 42, col: i === 1 ? C.warm : C.hi, t1: T.out }); say(id + 'b', t, T[id] + .25, 300, y + 34, TX[id + 'b'], { size: 26, t1: T.out }); });
  say('calib', t, T.calib, LX, 300, TX.calib, { size: 30, col: C.hi, t1: T.out });
  say('me1', t, T.mateoEnd, LX, 400, TX.mateoEnd1, { size: 30, t1: T.out });
  say('me2', t, T.mateoEnd + .3, LX, 445, TX.mateoEnd2, { size: 30, col: C.warm, t1: T.out });
  // tarjeta final: queda sobre el negro
  say('cardT', t, T.card, LX, 1420, TX.cardT, { font: SANS, wt: 250, size: 58, col: C.hi, dur: .7 });
  say('cardS', t, T.card + .5, LX, 1480, TX.cardS, { size: 26, col: C.mid });
  say('cardD', t, T.card + .8, LX, 1530, TX.cardD, { size: 22, col: C.lo });
}

const SHOTS = [[0, shot1], [T.c2, shot2], [T.c3, shot3], [T.c4, shot4], [T.c5, shot5], [T.c6, shot6]];
const shotAt = t => { let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++; return i; };
function drawShot(i, t, gc, oc) {
  g = gc; o = oc; SCAN = null; DIM = 1;
  gc.globalCompositeOperation = 'source-over'; gc.fillStyle = '#000'; gc.fillRect(0, 0, W, H);
  oc.clearRect(0, 0, W, H);
  SHOTS[i][1](t);
}

// ================= cuadro =================
const DITHER = (() => { const c = mk(256, 256), x = c.getContext('2d'), im = x.createImageData(256, 256), r = rng(3); for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } x.putImageData(im, 0, 0); return c; })();
window.render = t => {
  TEXTS = []; CLIP = [0, H];
  const i = shotAt(t), ws = SHOTS[i][0], wipe = i > 0 && t < ws + WIPE;
  if (wipe) {
    // barrido de cambio: una línea blanca baja; arriba la toma nueva, abajo la vieja
    const yW = H * eo((t - ws) / WIPE);
    CLIP = [yW, H]; drawShot(i - 1, t, g1, o1);
    CLIP = [0, yW]; drawShot(i, t, g0, o0);
    g0.save(); g0.beginPath(); g0.rect(0, yW, W, H - yW); g0.clip(); g0.drawImage(GEO2, 0, 0); g0.restore();
    o0.save(); o0.beginPath(); o0.rect(0, yW, W, H - yW); o0.clip(); o0.clearRect(0, yW, W, H - yW); o0.drawImage(TXT2, 0, 0); o0.restore();
    g0.fillStyle = 'rgba(240,248,255,.95)'; g0.fillRect(0, yW - 1, W, 2.5);
    const gr = g0.createLinearGradient(0, yW - 80, 0, yW); gr.addColorStop(0, 'rgba(179,219,255,0)'); gr.addColorStop(1, 'rgba(179,219,255,.18)'); g0.fillStyle = gr; g0.fillRect(0, yW - 80, W, 80);
  } else drawShot(i, t, g0, o0);
  // bloom: dos desenfoques reducidos, sumados
  b1.clearRect(0, 0, BL1.width, BL1.height); b1.filter = 'blur(3px)'; b1.drawImage(GEO, 0, 0, BL1.width, BL1.height); b1.filter = 'none';
  b2.clearRect(0, 0, BL2.width, BL2.height); b2.filter = 'blur(4px)'; b2.drawImage(GEO, 0, 0, BL2.width, BL2.height); b2.filter = 'none';
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.drawImage(GEO, 0, 0);
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55; ctx.drawImage(BL1, 0, 0, W, H); ctx.globalAlpha = .45; ctx.drawImage(BL2, 0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // al final la imagen se hunde en el negro; la tarjeta queda
  const sink = seg(t, T.fade, DUR - .3); if (sink > 0) { ctx.fillStyle = `rgba(0,0,0,${(sink * .9).toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
  ctx.drawImage(TXT, 0, 0);
  const fin = seg(t, DUR - .6, DUR); if (fin > 0) { ctx.fillStyle = `rgba(0,0,0,${fin.toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
  ctx.globalAlpha = .012; ctx.fillStyle = ctx.createPattern(DITHER, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
};
window.TEXTS = () => TEXTS.map(x => ({ ...x }));

// ================= sonido: eventos para mix.py =================
const EV = [];
for (const n of NARR) EV.push({ t: n.t0, type: 'narr', d: +(n.t1 - n.t0).toFixed(2), text: n.text });
for (const [a, b] of SILENCES) EV.push({ t: a, type: 'silence', d: +(b - a).toFixed(2) });
for (const w of WIPES) EV.push({ t: w, type: 'wipe', d: WIPE });
EV.push({ t: T.ping, type: 'ping', k: 'earth' }, { t: T.target, type: 'ping', k: 'star' });
for (let k = 0; k < 6; k++) EV.push({ t: 1.4 + k * BEAT * 1.5, type: 'glock', n: k });
for (const [a, b] of [[T.c2, T.c2 + 2.2], [T.c3, T.c3 + 2.4], [T.c6, T.c6 + 2.6]]) for (let x = a; x < b; x += BEAT) EV.push({ t: +x.toFixed(3), type: 'surge' });
EV.push({ t: T.fire, type: 'laser' }, { t: T.hit, type: 'ping', k: 'moon' }, { t: T.back, type: 'ping', k: 'back' }, { t: T.cD, type: 'lock' });
EV.push({ t: T.move0, type: 'orbit', d: T.move1 - T.move0 }, { t: T.sightJ, type: 'tick' }, { t: T.sightL, type: 'tick' }, { t: T.shift, type: 'lock' }, { t: T.ang, type: 'lock' });
EV.push({ t: T.coinEnd, type: 'lock' }, { t: T.f4, type: 'turn' }, { t: T.f4, type: 'ping', k: 'star' });
EV.push({ t: T.cone, type: 'ping', k: 'src' }, { t: T.frame1, type: 'tick' }, { t: T.frame2, type: 'tick' }, { t: T.quarter, type: 'lock' }, { t: T.cCep, type: 'cut' });
for (let x = T.cCep + .2; x < T.c5 - .3; x += 1.6) EV.push({ t: +x.toFixed(3), type: 'beat' });
EV.push({ t: T.c5, type: 'ping', k: 'gal' }, { t: T.wave0, type: 'carrier', d: T.wave1 - T.wave0 }, { t: T.obsLine, type: 'arrive' }, { t: T.dly, type: 'lock' });
for (const id of ['r1', 'r2', 'r3', 'r4']) EV.push({ t: T[id], type: 'rung', n: ['r1', 'r2', 'r3', 'r4'].indexOf(id) });
EV.push({ t: T.calib, type: 'end' });
window.EV = EV.sort((a, b) => a.t - b.t);

await document.fonts.load(`300 40px ${SANS}`, 'Az09≈÷'); await document.fonts.load(`250 40px ${SANS}`, 'Az');
await document.fonts.load(`400 30px ${MONO}`, 'AZ09·″₀'); await document.fonts.load(`500 30px ${MONO}`, 'AZ');
window.render(0);
window.READY = true;
