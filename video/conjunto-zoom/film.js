// «¿Qué es un conjunto?» en estilo Scale Zoom Explainer (Lemo-Opuscar): video de la lección alg-0a de Zuka.
// Cuatro niveles encadenados por un zoom continuo; cada anillo amarillo es la puerta al siguiente:
//   0 la pradera (colección bien definida) → 1 dentro del semáforo (elementos, llaves, ∈ y ∉)
//   → 2 dentro de la «S» (extensión y comprensión) → 3 dentro de la «a» (PAPAYA: sin repetidos, sin orden, cardinal).
// Vertical 1080×1920, 24 fps. Todo es función pura de t. Sin voz ni subtítulos: lo que se explica se lee en pantalla.
const S0 = [W / 2, H / 2];
const DUR_FILM = 116.5;

// ---------- narración (el video no la lleva; mix.py la escribe como conjunto-zoom.srt con los tiempos de la imagen) ----------
const NARR = [
  [0.8, 3.4, 'Antes de las fórmulas, una idea muy sencilla.'],
  [3.8, 5.8, 'Mira este semáforo en la pradera.'],
  [6.0, 8.4, 'Un conjunto es una colección de objetos.'],
  [8.6, 10.9, 'Aquí juntamos los colores del semáforo.'],
  [11.2, 16.2, 'Debe estar bien definida: cualquiera decide, sin dudar, si algo está o no está.'],
  [16.6, 20.9, '«Los colores bonitos» no: cada quien opina distinto. No es un conjunto.'],
  [21.2, 24.2, 'Entremos en el semáforo.'],
  [27.0, 30.0, 'Los objetos de un conjunto se llaman elementos.'],
  [30.2, 33.0, 'Este tiene tres: rojo, amarillo y verde.'],
  [33.4, 35.6, 'Ahora, a escribirlo.'],
  [35.8, 41.2, 'El conjunto lleva un nombre en mayúscula, S, y sus elementos van entre llaves, separados por comas.'],
  [41.6, 43.6, 'Llega el azul… y rebota.'],
  [44.0, 47.8, 'Rojo pertenece a S. Este símbolo se lee «pertenece a».'],
  [48.2, 51.6, 'Azul no está: se lee «no pertenece a».'],
  [52.0, 55.0, 'Sigamos por la letra S.'],
  [57.8, 60.6, 'Hay dos maneras de escribir un conjunto.'],
  [60.8, 64.2, 'Por extensión, se escriben todos sus elementos: las cinco vocales.'],
  [64.6, 67.0, 'Por comprensión, se escribe la condición.'],
  [67.2, 70.8, 'Las consonantes no la cumplen, así que se quedan afuera.'],
  [71.2, 76.0, 'Los dos puntos se leen «tal que»: las x tal que x es una vocal.'],
  [76.6, 79.8, 'Y dentro de una vocal, una palabra.'],
  [82.8, 85.6, 'PAPAYA tiene seis letras.'],
  [85.8, 88.2, 'Pero solo tres son distintas.'],
  [88.6, 91.4, 'Cada elemento se escribe una sola vez.'],
  [91.6, 94.8, 'Las letras de PAPAYA forman el conjunto L.'],
  [95.2, 98.2, 'Si cambiamos el orden, el conjunto no cambia.'],
  [98.4, 100.8, 'Sigue siendo el mismo conjunto L.'],
  [101.2, 104.0, 'Ahora contamos: uno, dos, tres.'],
  [104.2, 107.2, 'El cardinal de L es tres: n de L.'],
  [108.0, 111.6, 'Un conjunto: una colección bien definida, escrita entre llaves.'],
  [111.8, 115.8, 'Sin orden, sin repetidos, y su cardinal cuenta cuántos elementos tiene.'],
];

// ---------- suavizados (funciones puras de t) ----------
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

// ---------- dónde está cada cosa (coordenadas de cada nivel, en su propia escala) ----------
const TL = { x: 540, y: 820, w: 170, h: 430, ly: [700, 820, 940], r: 52 };          // nivel 0: el semáforo de la pradera
const LCOL = [['#FF6B5E', '#E14B45'], ['#FFC84A', '#F2A12F'], ['#3FD8AE', '#22B38C']];
const LNAME = ['rojo', 'amarillo', 'verde'];
const HS = { x: 540, y: 830, w: 300, h: 760, ly: [590, 830, 1070], r: 100 };         // nivel 1: el semáforo por dentro
const ROW1 = { y: 770, x: [230, 450, 670], r: 62, br: [110, 790], cy: 815, h: 330, ny: 895 };
const LINE_S = { y: 1110, size: 64 };                                                // S = {rojo, amarillo, verde}
const lineS0 = () => 540 - tw('S = {rojo, amarillo, verde}', LINE_S.size) / 2;
const S_AT = () => [lineS0() + tw('S', LINE_S.size) / 2, LINE_S.y - 0.36 * LINE_S.size];
const VOW = ['a', 'e', 'i', 'o', 'u'], VX = i => 290 + i * 125, VY = 640;             // nivel 2
const L1V = { y: 900, size: 76, s: 'V = {a, e, i, o, u}' }, L2V = { y: 1065, size: 64, s: 'V = {x : x es una vocal}' };
const lineX0 = L => 540 - tw(L.s, L.size) / 2;
const V_AT = () => [lineX0(L1V) + tw('V', L1V.size) / 2, L1V.y - 0.36 * L1V.size];
const COLON_AT = () => [lineX0(L2V) + tw('V = {x :', L2V.size) - tw(':', L2V.size) / 2, L2V.y - 0.3 * L2V.size];
const CONS = [['m', 140, 560], ['t', 940, 560], ['s', 140, 740], ['r', 940, 740]];
const WORD = 'PAPAYA', PX = i => 540 + (i - 2.5) * 145, PY = 700;                      // nivel 3
const PCOL = { P: ['#FF6B5E', '#E14B45'], A: ['#FFC84A', '#F2A12F'], Y: ['#3FD8AE', '#22B38C'] };

// ---------- las zambullidas ----------
// P: punto del nivel de afuera que se abre; r: radio del anillo; A: punto del nivel de adentro que nace ahí.
let DIVE = null;
function dives() {
  if (DIVE) return DIVE;
  DIVE = [
    { a: 24.4, b: 26.6, P: [TL.x, TL.ly[1]], r: TL.r, A: [HS.x, HS.ly[1]] },
    { a: 55.2, b: 57.4, P: S_AT(), r: 44, A: V_AT() },
    { a: 80.2, b: 82.4, P: [VX(0), VY], r: 66, A: [PX(1), PY] },
  ];
  DIVE.forEach(d => { d.s = 2 * d.r / W; d.K = 1 / d.s; });
  return DIVE;
}
const DIVE_T = [[24.4, 26.6], [55.2, 57.4], [80.2, 82.4]];                          // los mismos tiempos, sin medir texto
const levelAt = t => { let i = 0; while (i < DIVE_T.length && t >= DIVE_T[i][1]) i++; return i; };

// ---------- cámara: pantalla = (p − C)·z + S0 ----------
const camTf = c => `translate(${S0[0]},${S0[1]}) scale(${c.z.toFixed(5)}) translate(${(-c.C[0]).toFixed(3)},${(-c.C[1]).toFixed(3)})`;
const mapC = (c, p) => [(p[0] - c.C[0]) * c.z + S0[0], (p[1] - c.C[1]) * c.z + S0[1]];
function restCam(i, t) {
  const D = dives();
  if (i === 0) {
    const Z0 = 2.6;
    if (t < 3.6) return { z: Z0 * (1 + 0.04 * eio(t / 3.6)), C: [TL.x, TL.ly[1] + 30 * eio(t / 3.6)] };
    const p = seg(t, 3.6, 5.8), q = eio(p) + 0.07 * Math.sin(Math.PI * p) * p * p, z0 = Z0 * 1.04;
    const z = Math.exp(Math.log(z0) * (1 - q)) * (1 + 0.04 * eio(seg(t, 5.8, D[0].a)));
    const k = eio(p); return { z, C: [TL.x, lerp(TL.ly[1] + 30, S0[1], k)] };
  }
  const a = D[i - 1].b, b = i < D.length ? D[i].a : DUR_FILM;
  let z = 1 + 0.04 * eio(seg(t, a, b)), C = [S0[0], S0[1]];
  if (i === 2) { const k = kf(t, [[64.6, 0], [65.8, 1]]); C = [S0[0], S0[1] + 50 * k]; }
  if (i === 3) { z = 1 + 0.03 * eio(seg(t, a, 101)); z *= 1 - 0.08 * kf(t, [[101.0, 0], [103.0, 1]]); }
  return { z, C };
}
function diveState(i, t) {
  const d = dives()[i], u = seg(t, d.a, d.b), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  const c0 = restCam(i, d.a), Q0 = mapC(c0, d.P);
  const z = Math.exp(lerp(Math.log(c0.z), Math.log(d.K), e));
  const Q = [lerp(Q0[0], d.A[0], eio(u)), lerp(Q0[1], d.A[1], eio(u))];
  return { u, e, outer: { z, C: [d.P[0] - (Q[0] - S0[0]) / z, d.P[1] - (Q[1] - S0[1]) / z] }, Q, k: z * d.s, R: d.r * z * lerp(1, 2.3, e * e) };
}

// ---------- texto ----------
function wipeText(p, x, y, str, a, k, h = 60) {
  if (k <= 0) return;
  const w = measure(str, a), x0 = a['text-anchor'] === 'end' ? x - w : a['text-anchor'] === 'middle' ? x - w / 2 : x;
  const G = g(p, { 'clip-path': clipOf('rect', { x: r1(x0 - 10), y: r1(y - h), width: r1((w + 40) * clamp(k)), height: r1(h * 1.5) }) });
  return text(G, x, y, str, a);
}
// palabra grande que sube desde debajo de su renglón, con un rebote; sale igual, al revés
function riseG(p, t, t0, tOut, y, size) {
  if (t < t0 || t > tOut + .4) return null;
  const k = spr(t, t0, 13, 7) * (1 - ei(seg(t, tOut, tOut + .3)));
  const G = g(p, { 'clip-path': clipOf('rect', { x: -W, y: r1(y - size * 1.05), width: 3 * W, height: r1(size * 1.35) }) });
  return g(G, { transform: `translate(0,${r1(size * 1.25 * (1 - k))})` });
}
function riseText(p, t, t0, tOut, x, y, str, a) {
  const G = riseG(p, t, t0, tOut, y, a['font-size']); if (!G) return;
  return text(G, x, y, str, { 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle', 'letter-spacing': -1, ...a });
}
// ∈ y ∉ dibujados (Jost no los trae): x = borde izquierdo, y = renglón
function elemSym(p, x, y, s, not, col = C.cream) {
  const h = 0.6 * s, w = 0.52 * s, r = h / 2, b = y - 0.04 * s, sw = r1(0.075 * s);
  el('path', { d: `M${r1(x + w)},${r1(b - h)}L${r1(x + r)},${r1(b - h)}A${r1(r)},${r1(r)} 0 0 0 ${r1(x + r)},${r1(b)}L${r1(x + w)},${r1(b)}M${r1(x)},${r1(b - h / 2)}L${r1(x + w * .92)},${r1(b - h / 2)}`, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  if (not) el('path', { d: `M${r1(x + w * .86)},${r1(b - h - .16 * s)}L${r1(x + w * .1)},${r1(b + .16 * s)}`, stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round' }, p);
}
const SYMW = s => 0.52 * s;
// «rojo ∈ S»: devuelve el centro del símbolo (para el anillo que lo señala)
function elemLine(p, t, t0, tOut, cx, y, left, not, right, size, colL = C.cream) {
  const gap = size * 0.42, wl = tw(left, size, 700), wr = tw(right, size, 700), wt = wl + gap + SYMW(size) + gap + wr;
  const x0 = cx - wt / 2, xs = x0 + wl + gap, at = [xs + SYMW(size) / 2, y - 0.34 * size];
  const G = riseG(p, t, t0, tOut, y, size); if (!G) return at;
  text(G, x0, y, left, { 'font-size': size, 'font-weight': 700, fill: colL });
  elemSym(G, xs, y, size, not);
  text(G, xs + SYMW(size) + gap, y, right, { 'font-size': size, 'font-weight': 700, fill: C.cream });
  return at;
}
// etiqueta de la idea: versalitas arriba, un renglón crema y, si hace falta, una nota lila; barra amarilla a la izquierda
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
// llave dibujada: dir 1 = «{», −1 = «}»; k la abre desde el centro
function brace(p, x, cy, h, dir, k, col = C.cream, sw = 11) {
  if (k <= 0.01) return;
  const hh = h * k / 2, w = h * 0.11 * dir, top = cy - hh, bot = cy + hh, c = Math.min(Math.abs(w), hh / 2) * Math.sign(w);
  const d = `M${r1(x + w)},${r1(top)}Q${r1(x)},${r1(top)} ${r1(x)},${r1(top + Math.abs(c))}L${r1(x)},${r1(cy - Math.abs(c))}Q${r1(x)},${r1(cy)} ${r1(x - w)},${r1(cy)}Q${r1(x)},${r1(cy)} ${r1(x)},${r1(cy + Math.abs(c))}L${r1(x)},${r1(bot - Math.abs(c))}Q${r1(x)},${r1(bot)} ${r1(x + w)},${r1(bot)}`;
  el('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}

// ---------- anillo de «próxima parada» y línea de mira ----------
function ringAt(p, t, t0, tOut, x, y, r, labelTxt, lx, ly) {
  if (t < t0 || t >= tOut) return;
  const rr = r + (r * 2.6) * (1 - spr(t, t0, 15, 8.5));
  el('circle', { cx: r1(x), cy: r1(y), r: r1(rr), fill: 'none', stroke: C.sun, 'stroke-width': 6 }, p);
  const ko = eo(seg(t, t0 + 0.08, t0 + 0.32));
  if (ko > 0) el('circle', { cx: r1(x), cy: r1(y), r: r1(rr + 18 * ko), fill: 'none', stroke: C.sun, 'stroke-width': 3.5, 'stroke-dasharray': '4 12', 'stroke-dashoffset': r1(-(t - t0) * 12), 'stroke-linecap': 'round' }, p);
  const a = Math.atan2(ly - y, lx - x), x1 = x + Math.cos(a) * (r + 30), y1 = y + Math.sin(a) * (r + 30), ey = ly > y ? ly - 66 : ly + 48;
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
const AIM = [
  { fire: 21.0, lock: 21.6, name: 'el semáforo', L: [290, 1170] },
  { fire: 51.7, lock: 52.3, name: 'las letras', L: [470, 1400] },
  { fire: 76.6, lock: 77.2, name: 'una palabra', L: [640, 330] },
];

// ---------- fondo ----------
function starField(p, seed, n, ymax = 2 * H) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = -W + R() * 3 * W, y = -H * .5 + R() * 2 * H, k = R(), r = k < 0.7 ? 2 + R() * 2 : 3.6 + R() * 2.6;
    if (y > ymax) continue;
    el('circle', { cx: r1(x), cy: r1(y), r: r1(r), fill: k < 0.55 ? C.mist : k < 0.85 ? C.cream : C.sun }, p);
  }
}
function badge(p, x, y, k, ok) {
  if (k <= 0.01) return;
  const G = g(p, { transform: `translate(${r1(x)},${r1(y)}) scale(${k.toFixed(3)})` });
  shaded(G, 'circle', { cx: 0, cy: 0, r: 34 }, ok ? C.mint : C.coral, ok ? C.mintD : C.coralD, 5, 5);
  el('path', { d: ok ? 'M-15,1L-4,12L16,-11' : 'M-12,-12L12,12M12,-12L-12,12', fill: 'none', stroke: C.night, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
}
// un lazo dibujado: k = cuánto del contorno ya está trazado
function lasso(p, cx, cy, rx, ry, k, col, sw = 8) {
  if (k <= 0.005) return;
  el('path', { d: `M${cx},${cy - ry}A${rx},${ry} 0 1,1 ${cx},${cy + ry}A${rx},${ry} 0 1,1 ${cx},${cy - ry}`, pathLength: 1, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-dasharray': `${clamp(k).toFixed(4)} 2` }, p);
}
function tile(p, x, y, s, ch, k, col = [C.cream, C.creamD], ink = C.night) {
  if (k <= 0.01) return;
  const S = s * k;
  shaded(p, 'rect', { x: r1(x - S / 2), y: r1(y - S / 2), width: r1(S), height: r1(S), rx: r1(S * .2) }, col[0], col[1], r1(S * .06), r1(S * .06));
  text(p, r1(x), r1(y + S * .24), ch, { 'font-size': r1(S * .66), 'font-weight': 700, fill: ink, 'text-anchor': 'middle' });
}

// ---------- nivel 0 · la pradera ----------
function hills(G) {
  shaded(G, 'path', { d: blobPath([[-700, 1265], [-250, 1222], [250, 1262], [760, 1214], [1250, 1250], [1800, 1228], [1900, 2700], [-800, 2700]]) }, C.mint, C.mintD, 34, 26);
}
function level0(G, t) {
  starField(G, 7, 170, 1300);
  hills(G);
  // la pradera: una papaya, una pelota y una flor
  const pap = g(G, { transform: 'translate(190,1336) rotate(-14)' });
  shaded(pap, 'ellipse', { cx: 0, cy: 0, rx: 84, ry: 48 }, C.sun, C.sunD, 9, 8);
  el('path', { d: 'M76,-6Q104,-30 118,-12Q100,0 76,-6Z', fill: C.mintD }, pap);
  shaded(G, 'circle', { cx: 360, cy: 1440, r: 44 }, C.blue, C.blueD, 7, 7);
  capsule(G, 930, 1300, 930, 1236, 8, C.mintD);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; el('circle', { cx: r1(930 + Math.cos(a) * 26), cy: r1(1214 + Math.sin(a) * 26), r: 19, fill: C.coral }, G); }
  el('circle', { cx: 930, cy: 1214, r: 16, fill: C.sun }, G);
  // el semáforo, con el halo de la luz amarilla
  halo(G, TL.x, TL.ly[1], 160, 232);
  el('rect', { x: TL.x - 13, y: TL.y + TL.h / 2 - 10, width: 26, height: 290, rx: 13, fill: C.blueD }, G);
  shaded(G, 'rect', { x: TL.x - TL.w / 2, y: TL.y - TL.h / 2, width: TL.w, height: TL.h, rx: 40 }, C.blue, C.blueD, 10, 9);
  TL.ly.forEach((y, i) => {
    const on = i === 1 ? 1 : seg(t, i === 0 ? 6.6 : 6.9, (i === 0 ? 6.6 : 6.9) + .01), bump = 1 + .14 * wob(t, i === 0 ? 6.6 : 6.9, 16, 6);
    const col = on > 0 ? LCOL[i] : [C.n3, C.n2];
    shaded(G, 'circle', { cx: TL.x, cy: y, r: r1(TL.r * bump) }, col[0], col[1], 6, 6);
  });
  // el lazo de los colores del semáforo, y la marca de «sí»
  lasso(G, TL.x, TL.y, 150, 272, eio(seg(t, 7.6, 8.9)) + .012 * Math.sin(t * 2), C.sun);
  badge(G, 690, 575, pop(t, 11.6), true);
  // la nube de los «colores bonitos»: el lazo no logra cerrar
  const kc = pop(t, 16.5) * out(t, 20.9, .35);
  if (kc > 0.01) {
    const N = g(G, { transform: `translate(850,560) scale(${kc.toFixed(3)})` });
    shaded(N, 'path', { d: blobPath(polar(0, 0, 14, a => 104 + 16 * Math.sin(3 * a) + 9 * Math.cos(5 * a))) }, C.cream, C.creamD, 10, 9);
    [[-46, -22, C.coral], [0, -40, C.blue], [44, -18, C.mint]].forEach(([x, y, c]) => el('circle', { cx: x, cy: y, r: 17, fill: c }, N));
    text(N, 0, 44, 'bonitos', { 'font-size': 40, 'font-weight': 700, fill: C.night, 'text-anchor': 'middle' });
    lasso(N, 0, 0, 150, 150, kf(t, [[17.0, 0], [18.0, .74], [18.5, .52], [19.2, .82], [20.2, .3]]), C.mist, 7);
  }
  badge(G, 960, 455, pop(t, 19.6) * out(t, 20.9), false);
}

// ---------- nivel 1 · dentro del semáforo ----------
function level1(G, t) {
  starField(G, 23, 90);
  const hk = 1 - eio(seg(t, 33.4, 34.0));
  if (hk > 0.01) shaded(G, 'rect', { x: r1(HS.x - HS.w / 2 * hk), y: r1(HS.y - HS.h / 2 * hk), width: r1(HS.w * hk), height: r1(HS.h * hk), rx: r1(70 * hk) }, C.blue, C.blueD, 14, 12);
  // los nombres al lado de cada luz
  LNAME.forEach((n, i) => wipeText(G, 720, HS.ly[i] + 20, n, { 'font-size': 60, 'font-weight': 600, fill: LCOL[i][0] }, eo(seg(t, 27.2 + i * .2, 27.6 + i * .2)) * (1 - eio(seg(t, 33.0, 33.3))), 64));
  // las luces vuelan a la fila y las llaves las encierran
  LNAME.forEach((n, i) => {
    const m = eio(seg(t, 33.5 + i * .1, 34.6 + i * .1));
    const x = lerp(HS.x, ROW1.x[i], m), y = lerp(HS.ly[i], ROW1.y, m) - 90 * Math.sin(Math.PI * m) * (i === 1 ? 0 : 1), r = lerp(HS.r, ROW1.r, m);
    shaded(G, 'circle', { cx: r1(x), cy: r1(y), r: r1(r) }, LCOL[i][0], LCOL[i][1], 7, 7);
    wipeText(G, ROW1.x[i], ROW1.ny, n, { 'font-size': 46, 'font-weight': 600, fill: LCOL[i][0], 'text-anchor': 'middle' }, eo(seg(t, 34.8 + i * .12, 35.2 + i * .12)), 52);
  });
  const kb = spr(t, 34.8, 14, 7), hit = wob(t, 42.8, 22, 6);
  brace(G, ROW1.br[0], ROW1.cy, ROW1.h, 1, kb);
  brace(G, ROW1.br[1] + 14 * hit, ROW1.cy, ROW1.h, -1, kb);
  // S = {rojo, amarillo, verde}
  riseText(G, t, 35.4, 999, lineS0(), LINE_S.y, `S = {<tspan fill="${C.coral}">rojo</tspan>, <tspan fill="${C.sun}">amarillo</tspan>, <tspan fill="${C.mint}">verde</tspan>}`, { 'font-size': LINE_S.size, 'font-weight': 600, 'text-anchor': 'start', 'letter-spacing': 0 });
  // azul llega, choca con la llave y se queda afuera
  if (t > 41.8) {
    const xa = t < 42.8 ? lerp(1260, ROW1.br[1] + 70, ei(seg(t, 41.8, 42.8))) : ROW1.br[1] + 70 + 55 * spr(t, 42.8, 12, 6);
    const sq = 0.18 * wob(t, 42.8, 20, 7);
    shaded(G, 'ellipse', { cx: r1(xa), cy: ROW1.y, rx: r1(55 * (1 - sq)), ry: r1(55 * (1 + sq)) }, C.blue, C.blueD, 7, 7);
    wipeText(G, ROW1.br[1] + 125, ROW1.ny, 'azul', { 'font-size': 46, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, eo(seg(t, 43.2, 43.6)), 52);
  }
  // rojo ∈ S, azul ∉ S, con un anillo en el símbolo mientras se lee
  const a1 = elemLine(G, t, 43.8, 51.4, 290, 1250, 'rojo', false, 'S', 76, C.coral);
  const a2 = elemLine(G, t, 48.2, 51.4, 770, 1250, 'azul', true, 'S', 76, C.cream);
  const ring = (at, t0, t1) => { const k = spr(t, t0, 15, 8) * (1 - ei(seg(t, t1, t1 + .25))); if (k > 0.01 && t < t1 + .3) el('circle', { cx: r1(at[0]), cy: r1(at[1]), r: r1(36 * k), fill: 'none', stroke: C.sun, 'stroke-width': 5 }, G); };
  ring(a1, 44.4, 48.0); ring(a2, 48.8, 51.4);
}

// ---------- nivel 2 · dentro de la «S»: extensión y comprensión ----------
function level2(G, t) {
  starField(G, 37, 80);
  CONS.forEach(([ch, x, y], i) => {
    const k = pop(t, 57.6 + i * .05) * out(t, 66.0 + i * .08, .3), r = 16 * wob(t, 65.4, 20, 5) * (i % 2 ? 1 : -1);
    if (k > 0.01) tile(g(G, { transform: `rotate(${r1(r)} ${x} ${y})` }), x, y, 96, ch, k, [C.n3, C.n2], C.mist);
  });
  VOW.forEach((v, i) => {
    const jump = 26 * Math.max(0, wob(t, 65.6 + i * .06, 14, 6));
    tile(G, VX(i), VY - jump, 110, v, i === 0 && t < 58 ? 1 : pop(t, 57.6 + i * .12));
  });
  riseText(G, t, 58.2, 999, lineX0(L1V), L1V.y, L1V.s, { 'font-size': L1V.size, 'font-weight': 600, 'text-anchor': 'start', 'letter-spacing': 0 });
  riseText(G, t, 64.6, 999, lineX0(L2V), L2V.y, 'V = {x <tspan fill="' + C.sun + '">:</tspan> x es una vocal}', { 'font-size': L2V.size, 'font-weight': 600, 'text-anchor': 'start', 'letter-spacing': 0 });
  const ca = COLON_AT(), kr = spr(t, 71.2, 15, 8) * out(t, 76.8, .25);
  // una flecha amarilla señala los dos puntos desde abajo (un anillo taparía las x vecinas)
  if (kr > 0.01 && t < 77.1) { const ay = L2V.y + 34 + 8 * Math.sin(t * 5); el('path', { d: `M${r1(ca[0] - 16 * kr)},${r1(ay + 26 * kr)}L${r1(ca[0] + 16 * kr)},${r1(ay + 26 * kr)}L${r1(ca[0])},${r1(ay)}Z`, fill: C.sun, 'stroke-linejoin': 'round' }, G); }
  // etiquetas encima de cada renglón
  wipeText(G, lineX0(L1V), L1V.y - 92, 'POR EXTENSIÓN', { 'font-size': 36, 'font-weight': 600, fill: C.mist, 'letter-spacing': 3 }, eo(seg(t, 58.8, 59.2)), 42);
  wipeText(G, lineX0(L2V), L2V.y - 78, 'POR COMPRENSIÓN', { 'font-size': 36, 'font-weight': 600, fill: C.mist, 'letter-spacing': 3 }, eo(seg(t, 65.2, 65.6)), 42);
}

// ---------- nivel 3 · dentro de la «a»: PAPAYA ----------
// cada letra: dónde va y qué tan grande se ve
function papTile(i, t) {
  let x = PX(i), y = PY, k = 1;
  const twin = { 2: 0, 3: 1, 5: 1 }[i];
  if (twin != null) {                                          // vuela a su gemela y se funde en ella
    const t0 = { 2: 88.4, 3: 88.7, 5: 89.0 }[i], m = eio(seg(t, t0, t0 + .9));
    x = lerp(PX(i), PX(twin), m); y = PY - 150 * Math.sin(Math.PI * m); k = 1 - ei(seg(t, t0 + .7, t0 + .95));
    return { x, y, k };
  }
  const slot = { 0: 0, 1: 1, 4: 2 }[i], X3 = [330, 540, 750];
  const m = eio(seg(t, 90.2 + slot * .08, 91.0 + slot * .08));
  x = lerp(PX(i), X3[slot], m);
  const sh = eio(seg(t, 95.2, 96.6)), to = { 0: 2, 1: 1, 4: 0 }[i];  // se barajan: P y Y cambian de lugar
  x = lerp(x, X3[to], sh); y = PY + (i === 0 ? -1 : i === 4 ? 1 : 0) * 130 * Math.sin(Math.PI * sh);
  return { x, y, k };
}
function level3(G, t) {
  starField(G, 51, 90);
  const ko = 1 - eio(seg(t, 107.2, 107.8));
  if (ko <= 0.01) return;
  const H3 = g(G, { transform: `translate(540,900) scale(${ko.toFixed(4)}) translate(-540,-900)` });
  const order = [2, 3, 5, 0, 1, 4];                            // las que se funden van debajo
  order.forEach(i => { const q = papTile(i, t), merge = { 0: 88.4 + .9, 1: 88.7 + .9 }[i], b = merge ? 1 + .16 * wob(t, merge, 16, 6) + .1 * wob(t, 89.9, 16, 6) * (i === 1) : 1; tile(H3, q.x, q.y, 124 * b, WORD[i], q.k, PCOL[WORD[i]]); });
  const kb = spr(t, 91.0, 14, 7);
  brace(H3, 200, PY, 230, 1, kb); brace(H3, 880, PY, 230, -1, kb);
  riseText(H3, t, 96.8, 999, 540, 1010, 'L = {P, A, Y} = {Y, A, P}', { 'font-size': 70, 'font-weight': 600, 'letter-spacing': 0 });
  [330, 540, 750].forEach((x, k) => { const kk = pop(t, 101.4 + k * .4); if (kk > 0.01) text(H3, x, r1(560 - 10 * kk), String(k + 1), { 'font-size': r1(64 * kk), 'font-weight': 700, fill: C.sun, 'text-anchor': 'middle' }); });
  riseText(H3, t, 102.6, 999, 540, 1215, 'n(L) = 3', { 'font-size': 120, fill: C.sun });
}
const LEVELS = [level0, level1, level2, level3];

// ---------- la guía (lente por ojo) ----------
const GUIDE = { x: 860, y: 1450, s: 240 };
function aimPoint(i, t) { const d = dives()[i]; return mapC(restCam(i, Math.min(t, d.a)), d.P); }
function guidePose(t) {
  const enter = eo(seg(t, 4.5, 5.9));
  const x = lerp(1360, GUIDE.x, enter), y = GUIDE.y + 16 * Math.sin(t * 1.7) + 80 * (1 - enter) - 26 * wob(t, 5.9, 10, 4);
  let zoom = 0, look = [-0.35, -0.6], sq = 0.05 * wob(t, 5.9, 12, 5), smile = 0, wide = 0, tilt = 6 * Math.sin(t * 1.3);
  AIM.forEach((a, i) => {
    const d = dives()[i], on = seg(t, a.fire - .5, a.fire) * (1 - seg(t, d.b, d.b + .6));
    const Q = aimPoint(i, Math.min(t, d.a)), dx = Q[0] - x, dy = Q[1] - y, L = Math.hypot(dx, dy) || 1;
    look = [lerp(look[0], dx / L, on), lerp(look[1], dy / L, on)];
    zoom = Math.max(zoom, eio(seg(t, a.fire - .35, a.fire)) * (1 - eio(seg(t, d.b - .3, d.b + .4))) * .7 + eio(seg(t, d.a, d.a + .6)) * (1 - eio(seg(t, d.b - .4, d.b + .3))) * .3);
    sq += -0.06 * wob(t, a.fire, 16, 7) + 0.05 * wob(t, a.lock, 14, 6);
    tilt += 14 * wob(t, a.lock, 11, 5);
  });
  // mira hacia «azul» cuando choca
  const la = seg(t, 42.2, 42.6) * (1 - seg(t, 46.0, 46.6));
  look = [lerp(look[0], 0.2, la), lerp(look[1], -1, la)];
  wide = Math.max(eio(seg(t, 42.8, 43.1)) * (1 - eio(seg(t, 44.0, 44.6))), eio(seg(t, 102.6, 102.9)) * (1 - eio(seg(t, 104.0, 104.6))));
  smile = Math.max(eio(seg(t, 11.7, 12.3)) * (1 - eio(seg(t, 14.0, 14.6))), eio(seg(t, 91.0, 91.6)) * (1 - eio(seg(t, 93.4, 94.0))), eio(seg(t, 108.4, 109.2)));
  tilt += 18 * wob(t, 108.6, 9, 3);
  const lid = Math.max(...[7.2, 15.4, 29.6, 38.2, 46.2, 61.0, 69.6, 86.2, 98.4, 112.0].map(b => blink(t, b)));
  return { x, y, P: { rot: -5 + 3 * Math.sin(t * 0.9), look, zoom, sq, smile, wide, lid, tilt, ant: 8 * Math.sin(t * 2.1) - 20 * wob(t, 5.9, 9, 4), flame: .75 + .25 * Math.sin(t * 3.1), flick: t * 11 } };
}

// ---------- la cinta de paradas (esquina inferior izquierda) ----------
const STOPS = ['colección', 'notación', 'comprensión', 'cardinal'];
function ribbon(p, t) {
  const kin = eo(seg(t, 5.8, 6.4)) * (1 - eio(seg(t, 107.2, 107.6))); if (kin <= 0) return;
  const x0 = 110, x1 = 470, y = 1706, i = levelAt(t);
  let pos = i;
  if (i < DIVE_T.length && t > DIVE_T[i][0]) pos = i + eio(seg(t, DIVE_T[i][0], DIVE_T[i][1]));
  const G = g(p, { transform: `translate(${x0},${y}) scale(${kin.toFixed(3)}) translate(${-x0},${-y})` });
  el('rect', { x: x0 - 30, y: y - 104, width: 440, height: 140, rx: 22, fill: C.night }, G);
  el('rect', { x: x0, y: y - 3, width: x1 - x0, height: 6, rx: 3, fill: C.n3 }, G);
  el('rect', { x: x0, y: y - 3, width: r1((x1 - x0) * pos / 3), height: 6, rx: 3, fill: C.sun }, G);
  STOPS.forEach((s, k) => {
    const lit = pos >= k - 0.001, kx = x0 + (x1 - x0) * k / 3, kk = 1 + .5 * wob(t, k === 0 ? 6.0 : DIVE_T[k - 1][1], 16, 7);
    el('circle', { cx: r1(kx), cy: y, r: r1((lit ? 11 : 8) * kk), fill: lit ? C.sun : C.n3 }, G);
  });
  const n = Math.min(3, Math.round(pos));
  text(G, x0, y - 40, `${n + 1} de 4 · ${STOPS[n]}`, { 'font-size': 36, 'font-weight': 600, fill: C.cream, 'data-pass': 1 });
}

// ---------- el resumen del final: la cinta, de pie, en el centro ----------
const SUM = [['COLECCIÓN', 'bien definida'], ['NOTACIÓN', 'llaves; pertenece o no'], ['EXTENSIÓN · COMPRENSIÓN', 'todos o la condición'], ['SIN ORDEN NI REPETIDOS', '{P, A, Y} = {Y, A, P}'], ['CARDINAL', 'cuántos elementos: n(L)']];
function summary(p, t) {
  if (t < 107.6) return;
  riseText(p, t, 107.8, 999, 540, 410, 'Un conjunto', { 'font-size': 112, fill: C.sun });
  const x = 160, y0 = 560, dy = 168, kl = eio(seg(t, 108.2, 110.6));
  el('rect', { x: x - 3, y: y0, width: 6, height: r1(dy * 4 * kl), rx: 3, fill: C.sun }, p);
  SUM.forEach(([tag, line], k) => {
    const t0 = 108.4 + k * .55, y = y0 + k * dy, kk = pop(t, t0);
    if (kk > 0.01) { el('circle', { cx: x, cy: y, r: r1(22 * kk), fill: C.n3 }, p); el('circle', { cx: x, cy: y, r: r1(13 * kk), fill: C.sun }, p); }
    wipeText(p, x + 54, y - 18, tag, { 'font-size': 38, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 }, eo(seg(t, t0 + .1, t0 + .45)), 44);
    wipeText(p, x + 54, y + 46, line, { 'font-size': 52, 'font-weight': 600, fill: C.cream }, eo(seg(t, t0 + .2, t0 + .7)), 58);
  });
}

// ---------- lo que se lee en cada parada ----------
function labels(p, t) {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 150, width: r1(800 * kp), height: 270, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 258, '¿Qué es un', { 'font-size': 104, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 372, 'conjunto?', { 'font-size': 104, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 6.0, 11.0, 'CONJUNTO', 'una colección de objetos', 'aquí: los colores del semáforo');
  label(p, t, 11.2, 16.2, 'BIEN DEFINIDA', 'se sabe quién está', 'sin dudar, para cualquiera');
  label(p, t, 16.6, 21.2, 'NO ES CONJUNTO', '«los colores bonitos»', 'cada quien opina distinto');
  label(p, t, 27.8, 33.0, 'ELEMENTOS', 'los objetos del conjunto', 'rojo, amarillo y verde');
  label(p, t, 35.8, 41.4, 'NOTACIÓN', 'llaves y comas', 'el nombre va en mayúscula: S');
  label(p, t, 44.2, 48.0, 'SE LEE «PERTENECE A»', 'rojo está en S');
  label(p, t, 48.6, 52.0, 'SE LEE «NO PERTENECE A»', 'azul se queda afuera');
  label(p, t, 58.6, 64.2, 'POR EXTENSIÓN', 'se escriben todos', 'cada elemento, uno por uno');
  label(p, t, 65.0, 70.8, 'POR COMPRENSIÓN', 'se escribe la condición', 'la regla que todos cumplen');
  label(p, t, 71.4, 76.1, 'LOS DOS PUNTOS SE LEEN', '«tal que»', 'V: las x tal que x es vocal');
  label(p, t, 82.8, 88.0, 'UNA PALABRA', 'PAPAYA: seis letras', 'pero solo tres distintas');
  label(p, t, 88.6, 94.8, 'SIN REPETIDOS', 'cada elemento, una vez', 'PAPAYA da L = {P, A, Y}');
  label(p, t, 95.4, 100.8, 'EL ORDEN NO IMPORTA', 'es el mismo conjunto');
  label(p, t, 101.2, 107.0, 'CARDINAL', 'cuántos elementos tiene', 'se escribe n(L); aquí, 3');
}

// ---------- un cuadro ----------
function film(t) {
  const D = dives(), i = levelAt(t), diving = i < D.length && t > D[i].a;
  const root = g(svg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, root);
  if (!diving) { LEVELS[i](g(root, { transform: camTf(restCam(i, t)) }), t); }
  else {
    const d = diveState(i, t);
    LEVELS[i](g(root, { transform: camTf(d.outer) }), t);
    const hole = g(root, { 'clip-path': clipOf('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R) }) });
    el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, hole);
    LEVELS[i + 1](g(hole, { transform: `translate(${d.Q[0].toFixed(3)},${d.Q[1].toFixed(3)}) scale(${d.k.toFixed(5)}) translate(${-D[i].A[0]},${-D[i].A[1]})` }), t);
    if (d.R < 1500) {
      el('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R), fill: 'none', stroke: C.sun, 'stroke-width': r1(6 + 8 * d.e) }, root);
      el('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R + 18 + 30 * d.e), fill: 'none', stroke: C.sun, 'stroke-width': 3.5, 'stroke-dasharray': '4 12', 'stroke-dashoffset': r1(-t * 12), 'stroke-linecap': 'round' }, root);
    }
  }
  const ui = g(root), gp = guidePose(t);
  AIM.forEach((a, k) => {
    const d = D[k]; if (t < a.fire || t >= d.a) return;
    const Q = aimPoint(k, t), A = orbiLens(gp.x, gp.y, GUIDE.s, gp.P);
    dotsAB(ui, t, a.fire, a.lock, d.a, A, Q, d.r * restCam(k, t).z + 26);
    ringAt(ui, t, a.lock, d.a, Q[0], Q[1], d.r * restCam(k, t).z, a.name, a.L[0], a.L[1]);
  });
  labels(ui, t);
  ribbon(ui, t);
  summary(ui, t);
  if (t > 4.4) orbi(ui, gp.x, gp.y, GUIDE.s, gp.P);
}

// ---------- sucesos para el sonido ----------
function filmEvents() {
  const ev = [];
  ev.push({ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 3.6, type: 'pull', d: 2.2 }, { t: 4.5, type: 'enter', d: 1.4 });
  ev.push({ t: 6.6, type: 'light', i: 0 }, { t: 6.9, type: 'light', i: 2 }, { t: 7.6, type: 'lasso', d: 1.3 }, { t: 11.6, type: 'yes' });
  ev.push({ t: 16.5, type: 'cloud' }, { t: 17.0, type: 'try', d: 3.2 }, { t: 19.6, type: 'no' }, { t: 20.9, type: 'puff' });
  AIM.forEach((a, i) => { const [da, db] = DIVE_T[i]; ev.push({ t: a.fire, type: 'line', d: a.lock - a.fire }, { t: a.lock, type: 'lock', i }, { t: da, type: 'dive', d: db - da, i }, { t: db, type: 'arrive', i }); });
  [27.2, 27.4, 27.6].forEach((t, i) => ev.push({ t, type: 'pop', i }));
  ev.push({ t: 33.5, type: 'fly', d: 1.2 }, { t: 34.8, type: 'brace' }, { t: 35.4, type: 'rise' });
  ev.push({ t: 41.8, type: 'roll', d: 1.0 }, { t: 42.8, type: 'hit' }, { t: 43.8, type: 'rise' }, { t: 44.4, type: 'ring', i: 0 }, { t: 48.2, type: 'rise' }, { t: 48.8, type: 'ring', i: 1 });
  for (let i = 0; i < 5; i++) ev.push({ t: 57.6 + i * .12, type: 'tile', i });
  ev.push({ t: 58.2, type: 'rise' }, { t: 64.6, type: 'rise' }, { t: 65.4, type: 'shake' }, { t: 66.0, type: 'away', d: .6 }, { t: 71.2, type: 'ring', i: 2 });
  for (let i = 0; i < 5; i++) ev.push({ t: 65.6 + i * .06, type: 'hop', i });
  [88.4, 88.7, 89.0].forEach((t, i) => ev.push({ t, type: 'merge', i, d: .9 }));
  ev.push({ t: 90.2, type: 'slide', d: .9 }, { t: 91.0, type: 'brace' }, { t: 95.2, type: 'shuffle', d: 1.4 }, { t: 96.8, type: 'rise' });
  [101.4, 101.8, 102.2].forEach((t, i) => ev.push({ t, type: 'count', i }));
  ev.push({ t: 102.6, type: 'card' }, { t: 107.2, type: 'away', d: .6 }, { t: 107.8, type: 'rise' });
  for (let k = 0; k < 5; k++) ev.push({ t: 108.4 + k * .55, type: 'stop', i: k });
  ev.push({ t: 110.6, type: 'end' });
  ev.push({ t: 0, type: 'narr', lines: NARR });
  return ev.sort((a, b) => a.t - b.t);
}
