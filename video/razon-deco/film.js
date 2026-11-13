// «La razón que no cambia» · clip de curiosidades de Zuka, estilo Art Deco, 1080×1920 a 30 fps.
// Una barra partida (el único elemento en coral) viaja de Euclides a una jeringa sin perder su proporción.
// Todo es función de t: SC (escenas), CARDS (rótulos = narración), DOORS (puertas), EV (sonido) y render(t).
// Guion: TREATMENT.md · datos: FACTS.md · motor deco (MIT, lemo-opuscar): engine/.
import { C, TAU, clamp, lerp, eo, ei, eio, back, ss, mix, rgba, goldGrad, gline, toPath, arcPts, airbrush,
  sunburst, archFrame, chevrons, sparkle, glow, vignette, fan, speedLines } from './engine/deco.js';
import { goldText, measure, yearBadge, decoDigits, titleBar } from './engine/type.js';
import { buildSign, drawSign, litSequence } from './engine/bulbs.js';

export const W = 1080, H = 1080 * 16 / 9;
const CX = W / 2, PHI = (1 + Math.sqrt(5)) / 2, CUT = 1 / PHI;
const CORAL = '#E2654C', JADE = C.emerald, INK = '#2a1d10';
const K = (u, a, d) => clamp((u - a) / d);
const win = (u, a, b, fi = .45, fo = .4) => Math.min(eo(K(u, a, fi)), 1 - ei(K(u, b - fo, fo)));

// ---------------- escenas, puertas y rótulos ----------------
export const SC = [
  { id: 'titulo', t0: 0, t1: 7 }, { id: 'euclides', t0: 7, t1: 21 }, { id: 'pacioli', t0: 21, t1: 33 },
  { id: 'si', t0: 33, t1: 45 }, { id: 'modulor', t0: 45, t1: 60 }, { id: 'hospital', t0: 60, t1: 74 },
  { id: 'jeringa', t0: 74, t1: 82 }, { id: 'cierre', t0: 82, t1: 90 },
];
export const FULL = 90;
const DOORS = [[7, 'I'], [21, 'II'], [33, 'III'], [45, 'IV'], [60, 'V'], [82, 'VI']];
const IRIS = 74;                                   // el medallón x se vuelve la jeringa
// Rótulos: [inicio, fin, renglón 1, renglón 2]. Son también la narración del .srt.
const CARDS = [
  [8.3, 12.6, 'Hacia el 300 a. C., Euclides', 'buscó el corte perfecto de una línea.'],
  [12.8, 16.8, 'El todo es a la parte mayor', 'como la mayor es a la menor.'],
  [16.95, 20.5, 'Su valor: casi 1.618.', 'Es la razón áurea.'],
  [22.2, 26.8, 'En 1509, Luca Pacioli la llamó', '«la divina proporción».'],
  [27.1, 32.5, 'Leonardo da Vinci dibujó', 'las figuras de su libro.'],
  [33.8, 38.4, 'En 1960 el mundo acordó', 'un solo sistema de medidas: el SI.'],
  [38.8, 44.5, 'Mil miligramos hacen un gramo;', 'mil mililitros, un litro.'],
  [45.8, 50.4, 'Le Corbusier creó el Modulor', 'con medidas del cuerpo (1948).'],
  [50.7, 55.3, 'Ombligo a 113 cm, cabeza a 183 cm:', '183 entre 113 da casi 1.62.'],
  [55.6, 59.6, 'La razón áurea, a la escala', 'de puertas, sillas y techos.'],
  [60.9, 65.2, 'Hoy, en un hospital: una ámpula', 'trae 80 mg en 2 mL.'],
  [65.5, 69.6, 'El médico pide 20 mg.', 'Hay que saber cuántos mL sacar.'],
  [69.9, 73.5, 'Misma razón: 80 es a 2', 'como 20 es a x.'],
  [75.0, 81.0, 'Se cargan 0.5 mL:', 'medio mililitro, la dosis justa.'],
  [82.8, 87.6, 'Cambia el tamaño.', 'La razón se queda.'],
];

// ---------------- sonido (segundos de película) ----------------
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, pan: 0, ...o });
ev(0.25, 'draw', { d: 1.3 }); ev(1.7, 'clang');
[2.6, 3.0, 3.4, 3.8, 4.2].forEach((t, i) => ev(t, 'bulb', { n: i })); ev(4.1, 'rise');
for (const [t] of DOORS) { ev(t - .47, 'swoosh'); ev(t - .02, 'chunk'); ev(t + .05, 'gliss', { d: .55 }); }
ev(IRIS - .6, 'swell', { d: .6 }); ev(IRIS, 'flash');
// Euclides: el punto C se desliza y se asienta
ev(9.0, 'slide', { d: 1.2 }); ev(10.2, 'click', { pan: .3 }); ev(10.2, 'slide', { d: 1.2 }); ev(11.4, 'click', { pan: -.1 }); ev(11.5, 'settle');
ev(12.6, 'tick', { pan: -.3 }); ev(12.9, 'tick', { pan: .3 }); ev(13.0, 'draw', { d: .9 }); ev(17.2, 'bell', { n: 4 });
// Pacioli
ev(21.6, 'page'); for (let i = 0; i < 7; i++) ev(22.0 + i * .5, 'pen', { n: i, pan: .3 }); ev(25.1, 'badge');
// SI
ev(33.6, 'badge'); ev(34.6, 'draw', { d: 1.0 }); ev(37.0, 'roll', { pan: -.5 }); ev(37.4, 'roll', { pan: .5 }); ev(38.9, 'roll', { pan: -.5 }); ev(39.3, 'roll', { pan: .5 });
ev(41.5, 'click');
// Modulor: un paso de mármol por marca
ev(48.0, 'step', { n: 0 }); ev(50.0, 'step', { n: 1 }); ev(51.5, 'step', { n: 2 }); ev(54.8, 'bell', { n: 5 });
// Hospital: silencio, reloj y una gota
ev(60.0, 'mute', { d: 4.6 }); for (let i = 0; i < 4; i++) ev(60.7 + i, 'tick', { pan: .15 }); ev(63.1, 'drop');
ev(66.6, 'click', { pan: -.4 }); ev(66.9, 'click', { pan: .4 }); ev(67.6, 'click', { pan: -.4 }); ev(67.9, 'clack', { pan: .4 });
ev(69.0, 'draw', { d: .6 }); ev(69.4, 'tick'); ev(71.0, 'bell', { n: 3 });
// Jeringa: el émbolo sube con el glissando y aterriza en 0.5 mL
ev(75.0, 'plunger', { d: 3.0 }); ev(78.0, 'hit'); [78.2, 78.45, 78.7, 79.0, 79.25].forEach((t, i) => ev(t, 'bulb', { n: 2 + i }));
// Cierre: las luces se apagan en reversa
ev(82.6, 'bell', { n: 0 }); for (let i = 0; i < 4; i++) ev(87.0 + i * .45, 'off', { n: 4 - i }); ev(89.0, 'last');
CARDS.forEach(([a, b, l1, l2]) => ev(a, 'narr', { d: b - a, text: l2 ? l1 + ' ' + l2 : l1 }));
EV.sort((a, b) => a.t - b.t);

// ---------------- dibujo base ----------------
let g = null, REC = null;
function rec(x0, y0, x1, y1, id, text) {
  if (!REC) return;
  const m = g.getTransform(), P = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  REC.push({ id, text, x0: Math.min(...P.map(p => p[0])), y0: Math.min(...P.map(p => p[1])), x1: Math.max(...P.map(p => p[0])), y1: Math.max(...P.map(p => p[1])) });
}
// Texto dorado (o de un color) que se registra para la comprobación de lectura cuando ya se ve.
function gt(str, x, y, o = {}, id = null) {
  const { size = 60, font = 'Poiret', align = 'center', sy = 1, track = 0, alpha = 1 } = o;
  if (alpha <= .01) return 0;
  const w = goldText(g, str, x, y, { size, font, align, sy, track, ...o });
  if (id !== false && alpha > .6) { const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x; rec(x0, y - size * sy * .78, x0 + w, y + size * .22, id || str, str); }
  return w;
}
function plain(str, x, y, { size = 40, font = 'Josefin', weight = 600, col = C.ivory, align = 'center', track = 0, alpha = 1 } = {}, id = null) {
  if (alpha <= .01) return;
  g.save(); g.globalAlpha *= alpha; g.font = `${weight} ${size}px ${font}`; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'alphabetic';
  g.letterSpacing = `${track}px`; const w = g.measureText(str).width; g.fillText(str, x, y); g.restore();
  if (id !== false && alpha > .6) { const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x; rec(x0, y - size * .78, x0 + w, y + size * .22, id || str, str); }
}
function bg(cx = CX, cy = H * .55, a = .55, rot = 0) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#16110b'); gr.addColorStop(1, '#0b0806'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  sunburst(g, cx, cy, { rays: 56, r1: 2400, mode: 'wedges', rot, colorA: `rgba(201,162,75,${.07 * a})` });
  sunburst(g, cx, cy, { rays: 56, r0: 160, r1: 2400, mode: 'lines', w: 1.2, rot, alpha: .16 * a });
}
// Placa con extremos escalonados (como la barra de título).
function plaque(cx, cy, w, h, s = .16) {
  const hw = w / 2, hh = h / 2, k = h * s;
  return [[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy - hh + k], [cx + hw + k, cy - hh + k], [cx + hw + k, cy - hh + 2 * k], [cx + hw + 2 * k, cy - hh + 2 * k],
    [cx + hw + 2 * k, cy + hh - 2 * k], [cx + hw + k, cy + hh - 2 * k], [cx + hw + k, cy + hh - k], [cx + hw, cy + hh - k], [cx + hw, cy + hh],
    [cx - hw, cy + hh], [cx - hw, cy + hh - k], [cx - hw - k, cy + hh - k], [cx - hw - k, cy + hh - 2 * k], [cx - hw - 2 * k, cy + hh - 2 * k],
    [cx - hw - 2 * k, cy - hh + 2 * k], [cx - hw - k, cy - hh + 2 * k], [cx - hw - k, cy - hh + k], [cx - hw, cy - hh + k], [cx - hw, cy - hh]];
}
// Rótulo de lectura: se despliega desde el centro (filete → placa → letras) y se cierra igual.
function card(t, [a, b, l1, l2], cy = 1545) {
  const kin = K(t, a, .55), kout = K(t, b - .4, .4), k = eio(kin) * (1 - eio(kout));
  if (k <= 0) return;
  let size = 40; const fitw = s => Math.max(measure(g, l1, s, 'Josefin', 1, 600), l2 ? measure(g, l2, s, 'Josefin', 1, 600) : 0);
  while (fitw(size) > 690 && size > 30) size -= 1;
  const tw = fitw(size), Wd = Math.min(740, tw + 60), Hd = l2 ? size * 3.3 : size * 2;
  const w = Wd * ss(K(k, 0, .7)), hh = Hd / 2 * ss(K(k, .15, .6));
  gline(g, [[CX - w / 2 - 24, cy], [CX + w / 2 + 24, cy]], { w: 1.4, alpha: 1 - ss(K(k, .3, .5)) });
  if (hh > 1) {
    const pts = plaque(CX, cy, w, hh * 2, .1);
    g.fillStyle = 'rgba(6,5,4,.9)'; g.fill(toPath(pts, true));
    gline(g, pts, { w: 2, closed: true, bb: [CX - Wd / 2, cy - Hd, CX + Wd / 2, cy + Hd], sheen: .35 });
    if (hh > 14) gline(g, plaque(CX, cy, w - 16, hh * 2 - 16, .1), { w: .9, closed: true, sheen: .6 });
  }
  const ta = ss(K(k, .6, .4));
  if (ta > 0) {
    const d = size * .62;
    if (l2) { plain(l1, CX, cy - d + size * .35, { size, alpha: ta, track: 1 }, 'c' + a + 'a'); plain(l2, CX, cy + d + size * .3, { size, alpha: ta, track: 1 }, 'c' + a + 'b'); }
    else plain(l1, CX, cy + size * .34, { size, alpha: ta, track: 1 }, 'c' + a);
  }
}

// La protagonista: una barra partida en razón áurea. La parte mayor es coral; la menor, oro.
// part = cuánto se ha trazado desde el inicio; split = cuánto se ha abierto el corte (antes es una sola barra de oro).
function bar(x0, y0, x1, y1, th, { cut = CUT, part = 1, split = 1, alpha = 1 } = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1 || part <= 0) return;
  const ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy * th / 2, ny = ux * th / 2;
  const seg = (s0, s1) => { const a = [x0 + ux * s0, y0 + uy * s0], b = [x0 + ux * s1, y0 + uy * s1];
    return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny], [a[0] + nx, a[1] + ny]]; };
  const end = L * part, c = L * cut, gap = 7 * split;
  g.save(); g.globalAlpha *= alpha;
  if (split > 0) glow(g, x0 + ux * c, y0 + uy * c, th * 3, CORAL, .25 * split);
  const A = Math.min(end, c - gap), B0 = c + gap;
  if (A > 0) {
    const p = seg(0, A);
    if (split > 0) { airbrush(g, p, { base: mix(C.gold1, CORAL, split), dir: -2.3, rim: 1.5 }); gline(g, p, { w: 1.6, closed: true, color: split > .5 ? mix(CORAL, '#ffffff', .1) : null }); }
    else { g.fillStyle = goldGrad(g, x0, y0 - th, x1, y1 + th, { sheen: .4 }); g.fill(toPath(p, true)); gline(g, p, { w: 1.6, closed: true }); }
  }
  if (end > B0) { const p = seg(B0, end); g.fillStyle = goldGrad(g, x0, y0 - th, x1, y1 + th, { sheen: .55 }); g.fill(toPath(p, true)); gline(g, p, { w: 1.6, closed: true }); }
  else if (split <= 0 && end > A) { const p = seg(Math.max(0, A), end); g.fillStyle = goldGrad(g, x0, y0 - th, x1, y1 + th, { sheen: .4 }); g.fill(toPath(p, true)); }
  g.restore();
}
// Medallón: disco lacado con rayos, número grande y unidad pequeña.
function medal(cx, cy, r, num, unit, { p = 1, color = null, rot = 0, id = null } = {}) {
  if (p <= 0) return;
  const k = back(p, 1.3);
  g.save(); g.translate(cx, cy); g.rotate(rot * (1 - eo(p))); g.scale(k, k);
  sunburst(g, 0, 0, { rays: 24, r0: r * 1.06, r1: r * 1.38, mode: 'lines', w: 1.3, alpha: .8 });
  g.beginPath(); g.arc(0, 0, r, 0, TAU);
  const gr = g.createRadialGradient(-r * .3, -r * .3, 0, 0, 0, r);
  gr.addColorStop(0, color ? mix(color, '#ffffff', .15) : '#231a10'); gr.addColorStop(1, color ? mix(color, '#000000', .55) : '#050403');
  g.fillStyle = gr; g.fill();
  gline(g, arcPts(0, 0, r, 0, TAU, 64), { w: 2.4 }); gline(g, arcPts(0, 0, r * .87, 0, TAU, 64), { w: 1 });
  const big = r * (num.length > 3 ? .5 : num.length > 2 ? .62 : .8);
  const a = p > .7 ? 1 : 0;
  gt(num, 0, unit ? r * .14 : r * .3, { size: big, sy: 1.15, alpha: 1, fill: color ? C.ivory : null }, a && id ? id : false);
  if (unit) plain(unit, 0, r * .55, { size: r * .26, col: C.gold2, track: 2 }, a && id ? id + 'u' : false);
  g.restore();
}
function arrow(x0, y, x1, part = 1, label = null, la = 1) {
  if (part <= 0) return;
  const xe = lerp(x0, x1, eio(part)), dir = Math.sign(x1 - x0);
  gline(g, [[x0, y], [xe, y]], { w: 2.4 });
  if (part > .9) gline(g, [[xe - dir * 18, y - 12], [xe, y], [xe - dir * 18, y + 12]], { w: 2.4 });
  if (label && la > 0) gt(label, (x0 + x1) / 2, y - 22, { size: 34, alpha: la }, label + x0);
}
function cam(s, fx, fy, fn) { g.save(); g.translate(CX, H / 2); g.scale(s, s); g.translate(-fx, -fy); fn(); g.restore(); }

// Puertas: dos hojas lacadas que se cierran por el eje y se vuelven a abrir.
function leaf() {           // en coordenadas de la hoja izquierda: 0..W/2, la costura en x = W/2
  const gr = g.createLinearGradient(0, 0, W / 2, 0); gr.addColorStop(0, '#0a0806'); gr.addColorStop(.85, '#1c150d'); gr.addColorStop(1, '#2a1f12');
  g.fillStyle = gr; g.fillRect(0, 0, W / 2, H);
  sunburst(g, W / 2, H / 2, { rays: 22, r0: 120, r1: 900, a0: Math.PI / 2, a1: Math.PI * 1.5, mode: 'lines', w: 1.4, alpha: .55 });
  gline(g, [[40, 40], [W / 2 - 14, 40], [W / 2 - 14, H - 40], [40, H - 40], [40, 40]], { w: 2.6 });
  gline(g, [[64, 64], [W / 2 - 34, 64], [W / 2 - 34, H - 64], [64, H - 64], [64, 64]], { w: 1 });
  chevrons(g, 90, W / 2 - 60, 120, { n: 6, h: 22, rows: 3, gap: 10, w: 1.4 });
  g.save(); g.translate(0, H); g.scale(1, -1); chevrons(g, 90, W / 2 - 60, 120, { n: 6, h: 22, rows: 3, gap: 10, w: 1.4 }); g.restore();
  gline(g, [[W / 2 - 1, 0], [W / 2 - 1, H]], { w: 3 });
}
function doors(k, numeral) {
  if (k <= 0) return;
  const w = W / 2 * eio(k);
  for (const side of [-1, 1]) {
    g.save();
    if (side < 0) { g.beginPath(); g.rect(0, 0, w, H); g.clip(); g.translate(w - W / 2, 0); }
    else { g.beginPath(); g.rect(W - w, 0, w, H); g.clip(); g.translate(W - w + W / 2, 0); g.scale(-1, 1); }
    leaf(); g.restore();
  }
  if (k > .85) {
    const a = ss(K(k, .85, .15)), r = 92;
    g.save(); g.globalAlpha *= a;
    glow(g, CX, H / 2, 260, '#ffcf7a', .3);
    g.beginPath(); g.arc(CX, H / 2, r, 0, TAU); g.fillStyle = '#0a0806'; g.fill();
    gline(g, arcPts(CX, H / 2, r, 0, TAU, 64), { w: 3, glow: .5 }); gline(g, arcPts(CX, H / 2, r * .86, 0, TAU, 64), { w: 1 });
    goldText(g, numeral, CX, H / 2 + 26, { size: 74, font: 'Limelight' });
    g.restore();
  }
}
function doorK(t) {
  for (const [d, n] of DOORS) { if (t >= d - .48 && t < d) return [eio(K(t, d - .48, .46)), n]; if (t >= d && t < d + .6) return [1 - eio(K(t, d + .05, .55)), n]; }
  return [0, ''];
}

// ---------------- escenas ----------------
let SIGN = null, SIGN05 = null;
const signs = () => { if (!SIGN) { SIGN = buildSign('RAZÓN', { size: 260, spacing: 20 }); SIGN05 = buildSign('0.5 mL', { size: 260, spacing: 20 }); } };

function sTitulo(u) {
  const y = 1080, x0 = 190, x1 = 890;
  bg(CX, y, eo(K(u, 1.7, 1.2)));
  // la línea nace de un punto en el centro y crece hacia los dos lados
  const d = eio(K(u, .25, 1.3)), split = eo(K(u, 1.7, .35));
  if (u < 1.75) {
    glow(g, CX, y, 60 + 220 * d, '#ffcf7a', .3);
    gline(g, [[CX - (CX - x0) * d, y], [CX + (x1 - CX) * d, y]], { w: 3, glow: .8 });
    if (d < .05) sparkle(g, CX, y, 26, { alpha: 1 });
  }
  if (u >= 1.7) bar(x0, y, x1, y, 26 * (.3 + .7 * split), { split });
  const sp = 1 - Math.abs(K(u, 1.7, .7) - .5) * 2;
  if (u > 1.7 && u < 2.4) sparkle(g, x0 + (x1 - x0) * CUT, y, 60 * sp, { alpha: 1 });
  // «LA» + letrero de bombillas «RAZÓN» que se enciende letra por letra
  signs();
  const s = 780 / SIGN.w, sx = CX - SIGN.w * s / 2, sy = 640;
  gt('LA', CX, 600, { size: 74, font: 'Limelight', track: 10, alpha: ss(K(u, 2.1, .5)) });
  if (u > 2.2) {
    drawSign(g, SIGN, sx, sy, s, { lit: litSequence(u, [2.6, 3.0, 3.4, 3.8, 4.2], { chaseFrom: 5.0 }), channel: true });
    if (u > 4.3) rec(sx, sy + SIGN.h * s * .15, sx + SIGN.w * s, sy + SIGN.h * s * .95, 'RAZON', 'RAZÓN');
  }
  plain('QUE NO CAMBIA', CX, 1230, { size: 46, track: 14, col: C.gold2, alpha: ss(K(u, 4.1, .5)) });
}

function sEuclides(u) {
  bg(CX, 1700, .7);
  archFrame(g, CX, 1720, 900, 1560, { part: eio(K(u, 0, 1.6)), rings: 3, gap: 16, burst: true });
  titleBar(g, 'EUCLIDES', CX, 330, { p: K(u, .5, 1.4), size: 78, sub: 'HACIA EL 300 a. C.', wings: false });
  if (u > 1.9) rec(CX - 220, 280, CX + 220, 380, 'EUCLIDES', 'EUCLIDES · HACIA EL 300 a. C.');
  // la barra entera; el punto C prueba la mitad, se pasa y se asienta en el corte áureo
  const y = 880, x0 = 190, x1 = 890;
  let c = .5;
  if (u > 2) c = lerp(.5, .8, eio(K(u, 2.0, 1.2)));
  if (u > 3.2) c = lerp(.8, CUT, back(K(u, 3.2, 1.2), 1.2));
  const cutOpen = u > 2 ? 1 : eo(K(u, .8, .6));
  bar(x0, y, x1, y, 24, { cut: c, split: cutOpen });
  const xc = lerp(x0, x1, c), la = ss(K(u, 1.2, .5));
  gt('A', x0, y + 78, { size: 52, font: 'Italiana', alpha: la }, false); gt('B', x1, y + 78, { size: 52, font: 'Italiana', alpha: la }, false);
  gt('C', xc, y + 78, { size: 52, font: 'Italiana', alpha: la, fill: mix(CORAL, '#ffffff', .25) }, false);
  // corchetes a y b
  const bk = eio(K(u, 4.7, .8));
  if (bk > 0) {
    const brk = (xa, xb, lab) => { const yy = y - 46; gline(g, [[xa + 4, yy + 12], [xa + 4, yy], [lerp(xa, xb, .5) - 10, yy], [lerp(xa, xb, .5), yy - 12], [lerp(xa, xb, .5) + 10, yy], [xb - 4, yy], [xb - 4, yy + 12]], { w: 2, part: bk });
      gt(lab, (xa + xb) / 2, yy - 26, { size: 56, font: 'Italiana', alpha: ss(K(u, 5.3, .4)) }, false); };
    brk(x0, xc, 'a'); brk(xc, x1, 'b');
  }
  // la proporción escrita y su valor
  const fa = ss(K(u, 6.0, .7));
  gt('(a + b) : a  =  a : b', CX, 1130, { size: 70, alpha: fa, sheen: lerp(-.2, 1.2, K(u, 6.0, 1.4)) }, 'prop');
  const da = ss(K(u, 10.4, .6));
  if (da > 0) { decoDigits(g, '1.618…', CX, 1350, 96, { alpha: da }); if (da > .6) rec(CX - 200, 1240, CX + 200, 1370, 'phi', '1.618…'); }
  plain('LA RAZÓN ÁUREA', CX, 1430, { size: 32, track: 9, col: C.gold2, alpha: ss(K(u, 10.9, .5)) });
}

// Rectángulo áureo que se subdivide en cuadrados con su espiral.
function goldenRect(x, y, w, h, n, u0, u) {
  let r = { x, y, w, h };
  gline(g, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], { w: 2.4, part: eio(K(u, u0 - .8, .8)) });
  for (let i = 0; i < n; i++) {
    const k = eio(K(u, u0 + i * .5, .5)); if (k <= 0) break;
    const d = i % 4; let sq, cx, cy, a0;
    if (d === 0) { const s = r.h; sq = [r.x + s, r.y, r.x + s, r.y + s]; cx = r.x + s; cy = r.y + s; a0 = Math.PI; r = { x: r.x + s, y: r.y, w: r.w - s, h: r.h }; }
    else if (d === 1) { const s = r.w; sq = [r.x, r.y + s, r.x + s, r.y + s]; cx = r.x; cy = r.y + s; a0 = Math.PI * 1.5; r = { x: r.x, y: r.y + s, w: r.w, h: r.h - s }; }
    else if (d === 2) { const s = r.h; sq = [r.x + r.w - s, r.y, r.x + r.w - s, r.y + s]; cx = r.x + r.w - s; cy = r.y; a0 = 0; r = { x: r.x, y: r.y, w: r.w - s, h: r.h }; }
    else { const s = r.w; sq = [r.x, r.y + r.h - s, r.x + s, r.y + r.h - s]; cx = r.x + s; cy = r.y + r.h - s; a0 = Math.PI * .5; r = { x: r.x, y: r.y, w: r.w, h: r.h - s }; }
    gline(g, [[sq[0], sq[1]], [sq[2], sq[3]]], { w: 1.4, part: k });
    const rad = Math.max(Math.abs(sq[2] - sq[0]), Math.abs(sq[3] - sq[1]));
    gline(g, arcPts(cx, cy, rad, a0, a0 + Math.PI / 2, 24), { w: 2.6, part: k, glow: .4 });
  }
}
function cubocta(cx, cy, R, rot, part) {
  const V = []; for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { V.push([a, b, 0]); V.push([a, 0, b]); V.push([0, a, b]); }
  const ry = rot, rx = .5;
  const P = V.map(([x, y, z]) => { const x1 = x * Math.cos(ry) + z * Math.sin(ry), z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    const y1 = y * Math.cos(rx) - z1 * Math.sin(rx); return [cx + x1 * R, cy + y1 * R]; });
  let e = 0;
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
    const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
    if (Math.abs(d - Math.SQRT2) < .01) { gline(g, [P[i], P[j]], { w: 1.8, part: clamp(part * 24 - e * .7) }); e++; }
  }
}
function sPacioli(u) {
  bg(CX, 900, .6, u * .01);
  const s = lerp(1.6, 1, eio(K(u, .6, 3.6))), fx = lerp(735, CX, eio(K(u, .6, 3.6))), fy = lerp(890, 930, eio(K(u, .6, 3.6)));
  cam(s, fx, fy, () => {
    // libro abierto: dos páginas marfil aerografiadas
    const top = 640, bot = 1220, gut = CX;
    const L = [[gut, top + 20], [150, top], [140, bot], [gut, bot + 26]], R = [[gut, top + 20], [930, top], [940, bot], [gut, bot + 26]];
    g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 40; g.fillStyle = '#000'; g.fill(toPath([...L, L[0]], true)); g.fill(toPath([...R, R[0]], true)); g.restore();
    airbrush(g, L, { base: '#e6d6b4', dir: -.4, rim: 0 }); airbrush(g, R, { base: '#e6d6b4', dir: Math.PI + .4, rim: 0 });
    gline(g, [...L, L[0]], { w: 2 }); gline(g, [...R, R[0]], { w: 2 }); gline(g, [[gut, top + 20], [gut, bot + 26]], { w: 2.4 });
    for (let i = 0; i < 6; i++) { const yy = 1060 + i * 22; gline(g, [[190, yy], [500, yy + 2]], { w: .8, alpha: .35 }); gline(g, [[580, yy + 2], [890, yy]], { w: .8, alpha: .35 }); }
    // izquierda: el sólido que dibujaría Leonardo; derecha: rectángulo áureo con espiral
    g.save(); g.fillStyle = 'rgba(40,28,14,.08)'; g.beginPath(); g.arc(345, 860, 150, 0, TAU); g.fill(); g.restore();
    cubocta(345, 860, 118, .6 + u * .35, K(u, 4.4, 2.2));
    const rw = 320, rh = rw / PHI, rx = 575, ry = 790;
    goldenRect(rx, ry, rw, rh, 7, 1.2, u);
    bar(rx, ry - 26, rx + rw, ry - 26, 14, { part: eio(K(u, .4, .9)) });
  });
  if (u > 3.9) yearBadge(g, '1509', CX, 330, 120, { p: K(u, 3.9, 1.0) });
  if (u > 4.8) rec(CX - 60, 250, CX + 60, 410, '1509', '1509');
}

function sSI(u) {
  bg(CX, 330, .6);
  yearBadge(g, '1960', CX, 330, 120, { p: K(u, .4, 1.0) });
  if (u > 1.3) rec(CX - 60, 250, CX + 60, 410, '1960', '1960');
  // la barra patrón: la misma razón, ahora con graduación
  const y = 620, x0 = 190, x1 = 890, pb = eio(K(u, 1.6, 1.0));
  bar(x0, y, x1, y, 30, { part: pb });
  if (pb > .9) for (let i = 0; i <= 10; i++) { const xx = lerp(x0, x1, i / 10); gline(g, [[xx, y + 22], [xx, y + (i % 5 ? 36 : 48)]], { w: 1.4, alpha: ss(K(u, 2.4 + i * .04, .2)) }); }
  plain('UN SOLO SISTEMA PARA TODOS', CX, 730, { size: 30, track: 6, col: C.gold2, alpha: ss(K(u, 2.8, .5)) });
  // medallones que ruedan: 1 g = 1000 mg · 1 L = 1000 mL
  const row = (yy, a, la, ua, lb, ub) => {
    const pa = K(u, a, .8), pb2 = K(u, a + .4, .8);
    medal(lerp(-150, 285, eo(pa)), yy, 108, la, ua, { p: pa, rot: -4, id: la + ua });
    medal(lerp(W + 150, 795, eo(pb2)), yy, 108, lb, ub, { p: pb2, rot: 4, id: lb + ub });
    arrow(410, yy, 670, K(u, a + 1.1, .6), '× 1000', ss(K(u, a + 1.5, .4)));
  };
  row(930, 3.6, '1', 'g', '1000', 'mg');
  row(1210, 5.5, '1', 'L', '1000', 'mL');
  const ga = ss(K(u, 8.3, .6));
  if (ga > 0) { const pts = plaque(CX, 1405, 390, 66, .14); g.save(); g.globalAlpha *= ga; g.fillStyle = 'rgba(6,5,4,.85)'; g.fill(toPath(pts, true)); gline(g, pts, { w: 1.6, closed: true }); g.restore();
    plain('20 gotas ≈ 1 mL', CX, 1418, { size: 36, col: C.ivory, alpha: ga }); }
}

// Figura deco del Modulor, en centímetros (x desde el eje, y desde el piso).
const FIG = {
  torso: [[-22, 152], [22, 152], [18, 128], [13, 106], [17, 92], [-17, 92], [-13, 106], [-18, 128]],
  neck: [[-4.5, 155], [4.5, 155], [4, 162], [-4, 162]],
  armR: [[17, 151], [24, 148], [27, 120], [25, 95], [23, 80], [18, 80], [19, 95], [18, 120], [16, 140]],
  armL: [[-22, 152], [-16, 147], [-19, 186], [-13, 219], [-20, 221], [-27, 187]],
  legL: [[-17, 92], [-1.5, 92], [-3, 50], [-4, 8], [-11, 8], [-14, 50]],
  legR: [[17, 92], [1.5, 92], [3, 50], [4, 8], [11, 8], [14, 50]],
  footL: [[-4, 8], [-11, 8], [-15, 0], [-2, 0]], footR: [[4, 8], [11, 8], [15, 0], [2, 0]],
};
const MS = 1400 / 226, MX = 470, MY = 1700;
const mp = ([x, y]) => [MX + x * MS, MY - y * MS];
function figure(u) {
  const part = (pts, base, dir = -2.3) => { const P = pts.map(mp); airbrush(g, P, { base, dir, rim: 2.2 }); gline(g, [...P, P[0]], { w: 2 }); };
  const iv = '#e3d3b1', sh = '#c9b48c';
  part(FIG.legL, sh); part(FIG.legR, iv); part(FIG.footL, sh); part(FIG.footR, iv);
  part(FIG.armR, iv); part(FIG.armL, sh); part(FIG.torso, iv); part(FIG.neck, sh);
  const [hx, hy] = mp([0, 171]);
  g.beginPath(); g.ellipse(hx, hy, 9.5 * MS, 12.5 * MS, 0, 0, TAU); const pth = new Path2D(); pth.ellipse(hx, hy, 9.5 * MS, 12.5 * MS, 0, 0, TAU);
  airbrush(g, pth, { base: iv, bbox: [hx - 60, hy - 80, hx + 60, hy + 80], rim: 2.2 }); gline(g, arcPts(hx, hy, 9.5 * MS, 0, TAU, 48, 12.5 * MS), { w: 2 });
  // cabello en escalones y facetas (Lempicka), un ojo en arco y la nariz de un trazo
  gline(g, arcPts(hx, hy - 10, 9.6 * MS, Math.PI * 1.05, Math.PI * 1.95, 20, 11 * MS), { w: 3 });
  gline(g, [[hx + 8, hy - 6], [hx + 2, hy + 14], [hx + 10, hy + 16]], { w: 1.6 });
  gline(g, [mp([-6, 150]), mp([0, 120]), mp([6, 150])], { w: 1.2, alpha: .7 });
  gline(g, [mp([-12, 104]), mp([12, 104])], { w: 1, alpha: .6 });
  const [nx, ny] = mp([0, 113]); g.beginPath(); g.arc(nx, ny, 5, 0, TAU); g.fillStyle = CORAL; g.fill();
}
function sModulor(u) {
  // contrapicado: arranca en los pies y sube marca por marca; luego se abre a la figura entera
  const k1 = eio(K(u, .5, 2.6)), k2 = eio(K(u, 3.6, 1.6)), k3 = eio(K(u, 5.5, 1.2)), k4 = eio(K(u, 8.0, 1.8));
  let fy = lerp(1520, 1000, k1); fy = lerp(fy, 566, k2); fy = lerp(fy, 330, k3); fy = lerp(fy, 1060, k4);
  const s = lerp(1.5, .78, k4), fx = lerp(640, CX, k4);
  bg(CX, 1700, .6);
  cam(s, fx, fy, () => {
    sunburst(g, MX, MY, { rays: 40, r0: 40, r1: 1900, a0: Math.PI, a1: TAU, mode: 'lines', w: 1.6, alpha: .35 });
    gline(g, [[60, MY], [1020, MY]], { w: 3 }); gline(g, [[60, MY + 12], [1020, MY + 12]], { w: 1 });
    figure(u);
    // la barra protagonista se vuelve una regla vertical: piso → cabeza, cortada en el ombligo
    const gx = 740, yt = mp([0, 183])[1], grow = clamp(lerp(0, 1, (1520 - Math.min(fy, 1520)) / (1520 - 566) * 1.08) + (u > 5 ? 1 : 0));
    bar(gx, MY, gx, yt, 22, { cut: 113 / 183, part: Math.max(.05, grow) });
    const yh = mp([0, 226])[1];
    if (u > 5.5) gline(g, [[gx, yt - 10], [gx, lerp(yt - 10, yh, eio(K(u, 5.5, .9)))]], { w: 2.4, glow: .4 });
    const marks = [[113, 3.0], [183, 5.0], [226, 6.5]];
    marks.forEach(([cm, at]) => {
      const a = ss(K(u, at, .5)), yy = mp([0, cm])[1];
      if (a <= 0) return;
      for (let i = 0; i < 14; i++) { const xa = lerp(530, gx - 20, i / 14); gline(g, [[xa, yy], [xa + 7, yy]], { w: 1.6, alpha: a }); }
      g.save(); g.globalAlpha *= a; sparkle(g, gx, yy, 22 * (1 - K(u, at + .3, .6)), {}); g.restore();
      const wn = gt(String(cm), gx + 34, yy + 18, { size: 50, align: 'left', alpha: a, sy: 1.15 }, 'm' + cm);
      plain('cm', gx + 40 + wn, yy + 16, { size: 22, col: C.gold2, align: 'left', alpha: a }, false);
    });
  });
  const ra = ss(K(u, 9.6, .7));
  gt('183 ÷ 113 ≈ 1.62', CX, 250, { size: 70, alpha: ra, sheen: lerp(-.2, 1.2, K(u, 9.6, 1.5)) }, 'mod');
}

// Ámpula de vidrio (esmeralda) en coordenadas locales; centro del cuerpo en (0, 0).
function ampule(x, y, s, u) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const P = new Path2D();
  P.moveTo(-100, -40); P.lineTo(-100, 200); P.quadraticCurveTo(-100, 260, -40, 260); P.lineTo(40, 260); P.quadraticCurveTo(100, 260, 100, 200); P.lineTo(100, -40);
  P.quadraticCurveTo(100, -100, 36, -130); P.lineTo(26, -175); P.quadraticCurveTo(20, -182, 26, -190); P.quadraticCurveTo(46, -230, 30, -262);
  P.quadraticCurveTo(0, -290, -30, -262); P.quadraticCurveTo(-46, -230, -26, -190); P.quadraticCurveTo(-20, -182, -26, -175); P.lineTo(-36, -130);
  P.quadraticCurveTo(-100, -100, -100, -40); P.closePath();
  glow(g, 0, 40, 380, '#3f9a7f', .22);
  airbrush(g, P, { base: JADE, bbox: [-100, -290, 100, 260], rim: 2.5, alpha: .92 });
  // líquido y destellos del vidrio
  g.save(); g.clip(P); g.fillStyle = 'rgba(12,58,47,.55)'; g.fillRect(-110, -20 + Math.sin(u * 2) * 2, 220, 290);
  g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(-78, -90, 16, 330); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(60, -40, 9, 270); g.restore();
  g.lineWidth = 0; gline(g, P, { w: 2.6 }); gline(g, [[-30, -183], [30, -183]], { w: 2.2 });
  // etiqueta
  const L = plaque(0, 110, 170, 150, .1); g.fillStyle = '#efe3c7'; g.fill(toPath(L, true)); gline(g, L, { w: 1.6, closed: true });
  plain('GENTAMICINA', 0, 84, { size: 21, col: INK, track: 3, weight: 700 }, 'gent');
  gt('80 mg', 0, 128, { size: 50, fill: INK, shadow: false }, 'g80');
  gline(g, [[-60, 142], [60, 142]], { w: 1.2 });
  gt('2 mL', 0, 182, { size: 44, fill: INK, shadow: false }, 'g2');
  g.restore();
}
function sHospital(u) {
  bg(CX, 900, .35 + .35 * K(u, 5, 1));
  const mv = eio(K(u, 5.6, 1.1)), push = lerp(1, 1.12, eio(K(u, .4, 5)));
  ampule(CX, lerp(820, 470, mv), lerp(push, .58, mv), u);
  // la gota en el silencio
  if (u > 2.6 && u < 3.3) { const k = K(u, 2.6, .5); g.save(); g.fillStyle = mix(JADE, '#ffffff', .3); g.beginPath(); g.ellipse(CX, lerp(1090, 1380, k * k), 9, 13, 0, 0, TAU); g.fill(); g.restore(); }
  if (u > 3.05 && u < 3.8) { const k = K(u, 3.05, .7); gline(g, arcPts(CX, 1392, 30 + 120 * k, Math.PI, TAU, 30, 6 + 14 * k), { w: 1.6, alpha: 1 - k }); }
  // regla de tres
  const r = 84, xl = 300, xr = 780, y1 = 900, y2 = 1110;
  medal(xl, y1, r, '80', 'mg', { p: K(u, 6.6, .7), id: 'm80' });
  medal(xr, y1, r, '2', 'mL', { p: K(u, 6.9, .7), id: 'm2' });
  arrow(xl + 115, y1, xr - 115, K(u, 7.2, .5));
  medal(xl, y2, r, '20', 'mg', { p: K(u, 7.6, .7), id: 'm20' });
  medal(xr, y2, r, 'x', null, { p: K(u, 7.9, .7), color: CORAL, id: 'mx' });
  arrow(xl + 115, y2, xr - 115, K(u, 8.2, .5));
  // multiplicación en cruz: 20 con 2, y se divide entre 80
  const kc = eio(K(u, 9.0, .6));
  if (kc > 0) gline(g, [[xl + 60, y2 - 60], [lerp(xl + 60, xr - 60, kc), lerp(y2 - 60, y1 + 60, kc)]], { w: 2.4, glow: .5 });
  gt('x = 20 × 2 ÷ 80', CX, 1330, { size: 66, alpha: ss(K(u, 9.4, .6)) }, 'f1');
  const ea = ss(K(u, 11.0, .5));
  if (ea > 0) { const w1 = measure(g, '=  ', 66, 'Poiret'), w2 = measure(g, '0.5 mL', 66, 'Poiret'), x0 = CX - (w1 + w2) / 2;
    gt('=  ', x0, 1420, { size: 66, align: 'left', alpha: ea }, false); gt('0.5 mL', x0 + w1, 1420, { size: 66, align: 'left', alpha: ea, fill: mix(CORAL, '#ffffff', .15) }, false);
    if (ea > .6) rec(x0, 1370, x0 + w1 + w2, 1435, 'f2', '= 0.5 mL'); }
  // el medallón x se abre y se vuelve la jeringa
  const ki = K(u, 13.4, .6);
  if (ki > 0) { g.save(); g.beginPath(); g.arc(xr, y2, r + eio(ki) * 2300, 0, TAU); g.fillStyle = CORAL; g.fill(); g.restore(); }
}

function sJeringa(u) {
  bg(CX, 820, .7);
  const y = 820, xa = 220, xn = 820, ht = 120;
  // la jeringa: barril de vidrio, graduación de 0 a 2 mL (0 junto a la aguja)
  const pl = eio(K(u, 1.0, 3.0)), xp = lerp(xn, xn - 150, pl);
  g.save(); g.fillStyle = 'rgba(242,232,213,.07)'; g.fillRect(xa, y - ht / 2, xn - xa, ht); g.restore();
  if (xp < xn) { const p = [[xp, y - ht / 2 + 6], [xn, y - ht / 2 + 6], [xn, y + ht / 2 - 6], [xp, y + ht / 2 - 6], [xp, y - ht / 2 + 6]];
    airbrush(g, p, { base: CORAL, dir: -1.8, rim: 1.5 }); glow(g, (xp + xn) / 2, y, 200, CORAL, .18 + .2 * K(u, 4, .3)); }
  // émbolo: sello oscuro con borde de oro y la varilla hasta el apoyo del pulgar
  const seal = [[xp - 26, y - ht / 2 + 4], [xp, y - ht / 2 + 4], [xp, y + ht / 2 - 4], [xp - 26, y + ht / 2 - 4], [xp - 26, y - ht / 2 + 4]];
  g.fillStyle = '#1b1410'; g.fill(toPath(seal, true)); gline(g, seal, { w: 1.6, closed: true });
  const rod = [[xp - 26 - 600, y - 12], [xp - 26, y - 12], [xp - 26, y + 12], [xp - 26 - 600, y + 12], [xp - 26 - 600, y - 12]];
  g.fillStyle = goldGrad(g, 0, y - 20, W, y + 20, { sheen: .4 }); g.fill(toPath(rod, true)); gline(g, rod, { w: 1.2, closed: true });
  const th = [[xp - 640, y - 70], [xp - 620, y - 70], [xp - 620, y + 70], [xp - 640, y + 70], [xp - 640, y - 70]];
  g.fillStyle = goldGrad(g, 0, y - 80, W, y + 80, { sheen: .3 }); g.fill(toPath(th, true)); gline(g, th, { w: 1.4, closed: true });
  // barril, aletas, cono y aguja
  gline(g, [[xa, y - ht / 2], [xn, y - ht / 2]], { w: 2.6 }); gline(g, [[xa, y + ht / 2], [xn, y + ht / 2]], { w: 2.6 });
  gline(g, [[xa - 6, y - ht / 2 - 70], [xa - 6, y + ht / 2 + 70]], { w: 4 });
  gline(g, [[xn, y - ht / 2], [xn, y + ht / 2], [xn + 50, y + 14], [xn + 50, y - 14], [xn, y - ht / 2]], { w: 2.4 });
  gline(g, [[xn + 50, y], [960, y]], { w: 2 });
  for (let i = 0; i <= 20; i++) { const xx = lerp(xn, xn - 600, i / 20); gline(g, [[xx, y + ht / 2 - 2], [xx, y + ht / 2 - (i % 5 ? 16 : 30)]], { w: i % 5 ? 1 : 1.8 }); }
  ['0', '0.5', '1', '1.5', '2'].forEach((lab, i) => gt(lab, xn - i * 150, y + ht / 2 + 56, { size: 40, alpha: 1 }, false));
  plain('mL', xa - 6, y - ht / 2 - 92, { size: 30, col: C.gold2 }, false);
  // la marca de 0.5 se ilumina y el letrero «0.5 mL» se enciende letra por letra
  const hit = K(u, 4.0, .6);
  if (hit > 0 && hit < 1) sparkle(g, xn - 150, y, 90 * (1 - Math.abs(hit - .3) * 1.4), { alpha: 1 });
  signs();
  if (u > 3.9) { const s = 700 / SIGN05.w, sx = CX - SIGN05.w * s / 2, sy = 1040;
    const lit05 = litSequence(u, [4.2, 4.45, 4.7, 5.0, 5.25], { chaseFrom: 6.2 });
    drawSign(g, SIGN05, sx, sy, s, { lit: lit05, color: '#ffb59e' });
    const dot = SIGN05.letters.find(l => l.ch === '.'), v = lit05(1, 0, 0);       // el punto no deja bombillas en el esqueleto: va a mano
    if (dot) { const X = sx + (dot.x + dot.w / 2) * s, Y = sy + (SIGN05.base - 14) * s;
      g.beginPath(); g.arc(X, Y, 9, 0, TAU); g.fillStyle = '#2a1d0c'; g.fill(); g.strokeStyle = C.gold2; g.lineWidth = 2; g.stroke();
      if (v > 0) { glow(g, X, Y, 40, '#ffb59e', .6 * Math.min(1, v)); g.beginPath(); g.arc(X, Y, 7, 0, TAU); g.fillStyle = mix('#ffb59e', '#ffffff', .6); g.fill(); } }
    if (u > 5.4) rec(sx, sy + SIGN05.h * s * .15, sx + SIGN05.w * s, sy + SIGN05.h * s * .95, 'sign05', '0.5 mL'); }
  // la jeringa nace del disco coral que la trajo
  const ki = K(u, 0, .6);
  if (ki < 1) { g.save(); g.beginPath(); g.rect(0, 0, W, H); g.arc(CX, y, eio(ki) * 1400, 0, TAU, true); g.fillStyle = CORAL; g.fill('evenodd'); g.restore(); }
}

function sCierre(u) {
  bg(CX, 960, lerp(.8, .25, K(u, 5.5, 2.5)));
  archFrame(g, CX, 1500, 860, 1300, { part: 1, rings: 3, gap: 16, burst: true, sheen: lerp(-.2, 1.2, K(u, .6, 2)) });
  bar(190, 960, 890, 960, 26, {});
  const la = ss(K(u, .5, .7)), xc = 190 + 700 * CUT;
  gt('a', (190 + xc) / 2, 900, { size: 64, font: 'Italiana', alpha: la }, false); gt('b', (xc + 890) / 2, 900, { size: 64, font: 'Italiana', alpha: la }, false);
  gt('a : b  =  c : d', CX, 760, { size: 84, alpha: ss(K(u, 1.0, .7)), sheen: lerp(-.2, 1.2, K(u, 1.0, 1.6)) }, 'abcd');
  signs();
  const s = 700 / SIGN.w, sx = CX - SIGN.w * s / 2, sy = 1080;
  const off = [7.0, 6.55, 6.1, 5.65].map(x => x - .6);      // letras 4, 3, 2, 1 se apagan; la primera bombilla queda
  drawSign(g, SIGN, sx, sy, s, { lit: (li, bi) => {
    if (u < .3) return 0;
    if (li === 0) return u > 7.6 && bi > 0 ? Math.max(0, 1 - (u - 7.6) * 8) : 1;
    const t0 = off[4 - li]; if (u < t0) return 1; return Math.max(0, 1 - (u - t0) * 6) * (1 + .4 * (u - t0 < .08));
  } });
  if (u < 5.0) rec(sx, sy + SIGN.h * s * .15, sx + SIGN.w * s, sy + SIGN.h * s * .95, 'RAZON2', 'RAZÓN');
}

const DRAW = { titulo: sTitulo, euclides: sEuclides, pacioli: sPacioli, si: sSI, modulor: sModulor, hospital: sHospital, jeringa: sJeringa, cierre: sCierre };

export function setup(ctx) { g = ctx; }
export function render(t, rec = null) {
  REC = rec;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.letterSpacing = '0px';
  const sc = SC.find(s => t >= s.t0 && t < s.t1) || SC[SC.length - 1];
  DRAW[sc.id](t - sc.t0);
  vignette(g, W, H, .5);
  const card0 = CARDS.find(c => t >= c[0] && t < c[1]);
  if (card0) card(t, card0);
  const [dk, dn] = doorK(t); doors(dk, dn);
  REC = null;
}
