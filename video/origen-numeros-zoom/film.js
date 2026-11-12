// «El origen de los números» en estilo Scale Zoom Explainer (Lemo-Opuscar): un solo viaje hacia adentro.
// Cinco niveles encadenados por un zoom continuo; cada anillo amarillo es la puerta al siguiente:
//   0 hueso de Ishango → 1 Egipto → 2 Babilonia → 3 India (el cero) → 4 hoy (bits).
// Vertical 1080×1920, 24 fps. Todo es función pura de t. Sin voz grabada: los tiempos siguen la narración de NARR,
// que se entrega como .srt. Lo que se lee en pantalla es una etiqueta por parada.
const S0 = [W / 2, H / 2];
const DUR_FILM = 80;

// ---------- narración (se exporta a .srt; el ritmo de la imagen sale de aquí) ----------
const NARR = [
  [0.8, 4.4, 'Durante miles de años, contar fue hacer rayitas.'],
  [4.8, 10.2, 'Este hueso tiene unos veinte mil años. Cada muesca es una cosa contada.'],
  [12.8, 17.0, 'En Egipto, cada potencia de diez tenía su propio dibujo.'],
  [17.2, 21.2, 'Para escribir novecientos nueve hacían falta dieciocho signos.'],
  [23.6, 29.8, 'En Babilonia bastaban dos: una cuña para el uno y un gancho para el diez.'],
  [30.1, 35.1, 'Contaban de sesenta en sesenta. Por eso una hora tiene sesenta minutos.'],
  [35.4, 41.2, 'Pero si no había nada que contar, dejaban un hueco. Nadie sabía escribir «nada».'],
  [43.8, 49.6, 'En la India, ese hueco recibió un signo: primero un punto, luego un círculo.'],
  [49.9, 56.1, 'En el año seiscientos veintiocho, Brahmagupta le puso reglas. El cero ya era un número.'],
  [56.4, 61.0, 'Los mayas, al otro lado del océano, inventaron su propio cero.'],
  [61.3, 66.3, 'Con el cero, diez signos alcanzan para todo. Novecientos nueve: solo tres.'],
  [68.7, 73.3, 'Hoy, todo lo digital se escribe con dos signos: uno y cero.'],
  [73.8, 77.8, 'Una marca y un hueco. Igual que al principio.'],
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
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, eio((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1][1];
}
// piezas de orbi.js que vivían en heroes.js
function tear(G, cx, cy, r, tx, ty, fill, bend = 0) {
  const d = Math.hypot(tx - cx, ty - cy), a = Math.atan2(ty - cy, tx - cx), b = Math.acos(Math.min(0.999, r / d));
  const p1 = [cx + Math.cos(a + b) * r, cy + Math.sin(a + b) * r], p2 = [cx + Math.cos(a - b) * r, cy + Math.sin(a - b) * r];
  const nx = -Math.sin(a) * bend, ny = Math.cos(a) * bend;
  const m1 = [(p1[0] + tx) / 2 + nx, (p1[1] + ty) / 2 + ny], m2 = [(p2[0] + tx) / 2 + nx, (p2[1] + ty) / 2 + ny];
  const f = v => r1(v);
  return el('path', { d: `M${f(tx)},${f(ty)}Q${f(m2[0])},${f(m2[1])} ${f(p2[0])},${f(p2[1])}A${f(r)},${f(r)} 0 1 1 ${f(p1[0])},${f(p1[1])}Q${f(m1[0])},${f(m1[1])} ${f(tx)},${f(ty)}Z`, fill }, G);
}
const capsule = (G, x1, y1, x2, y2, w, col) => el('line', { x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2), stroke: col, 'stroke-width': r1(w), 'stroke-linecap': 'round' }, G);

// ---------- las zambullidas: [inicio, fin] y dónde cae cada una ----------
// P: punto del nivel de afuera que se abre; r: radio del anillo; A: punto del nivel de adentro que nace ahí.
const BONE = { x: 540, y: 880, rot: -22, k: 1.25 };
const boneP = (x, y) => { const a = BONE.rot * Math.PI / 180; return [BONE.x + (x * Math.cos(a) - y * Math.sin(a)) * BONE.k, BONE.y + (x * Math.sin(a) + y * Math.cos(a)) * BONE.k]; };
const NOTCH = (() => { const out = []; let y = -230; for (const n of [3, 6, 4, 8]) { for (let i = 0; i < n; i++) { out.push(y); y += 21; } y += 34; } return out; })();
const EG = { bar: [540, 980] };                       // la barra «1» de la leyenda egipcia
const EG9 = i => [650 + (i % 3) * 92, 800 + Math.floor(i / 3) * 150];   // los nueve trazos del 909
const EGC = i => [250 + (i % 3) * 112, 800 + Math.floor(i / 3) * 150];  // las nueve cuerdas
const TAB = { x: 540, y: 900, w: 700, h: 880 };
const GAPB = [540, 1190];                             // el hueco entre dos cuñas, en la tablilla
const ZERO = { x: 540, y: 760 };                      // donde aparece el punto en la India
const Z909 = [540, 990];                              // el cero del 909 final
const DIVE = [
  { a: 10.6, b: 12.7, P: boneP(-22, NOTCH[11] + 4), r: 46, A: EG.bar },
  { a: 21.4, b: 23.5, P: EG9(8), r: 62, A: [330, 560] },
  { a: 41.5, b: 43.7, P: GAPB, r: 74, A: [ZERO.x, ZERO.y] },
  { a: 66.5, b: 68.6, P: Z909, r: 118, A: [540, 900] },
];
DIVE.forEach(d => { d.s = 2 * d.r / W; d.K = 1 / d.s; });
const levelAt = t => { let i = 0; while (i < DIVE.length && t >= DIVE[i].b) i++; return i; };

// ---------- cámara: pantalla = (p − C)·z + S0 ----------
const camTf = c => `translate(${S0[0]},${S0[1]}) scale(${c.z.toFixed(5)}) translate(${(-c.C[0]).toFixed(3)},${(-c.C[1]).toFixed(3)})`;
const mapC = (c, p) => [(p[0] - c.C[0]) * c.z + S0[0], (p[1] - c.C[1]) * c.z + S0[1]];
const N0 = boneP(-22, -60);                           // centro de las muescas: la apertura está cerrada sobre ellas
function restCam(i, t) {                              // la cámara de cada nivel mientras se lee: empuja apenas
  if (i === 0) {
    if (t < 3.3) return { z: 3.1 * (1 + 0.05 * eio(t / 3.3)), C: [N0[0] - 120 + 8 * eio(t / 3.3), N0[1] - 190 + 30 * eio(t / 3.3)] };
    const p = seg(t, 3.3, 5.2), q = eio(p) + 0.06 * Math.sin(Math.PI * p) * p * p, z0 = 3.1 * 1.05;
    const z = Math.exp(Math.log(z0) * (1 - q)) * (1 + 0.035 * eio(seg(t, 5.2, 10.6)));
    const k = eio(p); return { z, C: [lerp(N0[0] - 112, S0[0], k), lerp(N0[1] - 160, S0[1], k)] };
  }
  const a = DIVE[i - 1].b, b = i < DIVE.length ? DIVE[i].a : DUR_FILM;
  let z = 1 + 0.04 * eio(seg(t, a, b)), C = [S0[0], S0[1]];
  if (i === 2) { const k = kf(t, [[35.2, 0], [36.6, 1]]); z *= 1 + 0.1 * k; C = [S0[0], lerp(S0[1], S0[1] + 70, k)]; }
  if (i === 3) { const k = kf(t, [[43.7, 1], [46.2, 1], [47.6, 0]]); z *= 1 + 0.5 * k; C = [lerp(S0[0], ZERO.x, k), lerp(S0[1], ZERO.y, k)]; }
  if (i === 4) { const k = kf(t, [[73.2, 0], [75.0, 1]]); z *= 1 - 0.1 * k; C = [S0[0], S0[1] - 110 * k]; }
  return { z, C };
}
// durante una zambullida: el nivel de afuera sigue al punto P hasta que el de adentro llena el cuadro
function diveState(i, t) {
  const d = DIVE[i], u = seg(t, d.a, d.b), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  const c0 = restCam(i, d.a), Q0 = mapC(c0, d.P);
  const z = Math.exp(lerp(Math.log(c0.z), Math.log(d.K), e));
  const Q = [lerp(Q0[0], d.A[0], eio(u)), lerp(Q0[1], d.A[1], eio(u))];
  return { u, e, outer: { z, C: [d.P[0] - (Q[0] - S0[0]) / z, d.P[1] - (Q[1] - S0[1]) / z] }, Q, k: z * d.s, R: d.r * z * lerp(1, 2.3, e * e) };
}

// ---------- texto ----------
const measure = (str, a) => str.length * (a['font-size'] || 30) * 0.54 + (a['letter-spacing'] || 0) * str.length;
function wipeText(p, x, y, str, a, k, h = 60) {
  if (k <= 0) return;
  const w = measure(str, a), x0 = a['text-anchor'] === 'end' ? x - w : a['text-anchor'] === 'middle' ? x - w / 2 : x;
  const G = g(p, { 'clip-path': clipOf('rect', { x: r1(x0 - 10), y: r1(y - h), width: r1((w + 40) * clamp(k)), height: r1(h * 1.5) }) });
  return text(G, x, y, str, a);
}
// palabra grande que sube desde debajo de su renglón, con un rebote
function riseText(p, t, t0, tOut, x, y, str, a) {
  if (t < t0 || t > tOut + .4) return;
  const size = a['font-size'], k = spr(t, t0, 13, 7) * (1 - ei(seg(t, tOut, tOut + .3)));
  const G = g(p, { 'clip-path': clipOf('rect', { x: 0, y: r1(y - size * 1.05), width: W, height: r1(size * 1.32) }) });
  return text(G, x, r1(y + size * 1.25 * (1 - k)), str, { 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle', 'letter-spacing': -1, ...a });
}
// etiqueta de la parada: versalitas arriba, un renglón crema abajo, barra amarilla a la izquierda
function label(p, t, t0, tOut, tag, line, y = 300) {
  if (t < t0 || t > tOut + .35) return;
  const out = 1 - eio(seg(t, tOut, tOut + .3));
  const kb = eo(seg(t, t0, t0 + .25)) * out;
  const A1 = { 'font-size': 32, 'font-weight': 600, fill: C.sun, 'letter-spacing': 4 }, A2 = { 'font-size': 58, 'font-weight': 600, fill: C.cream };
  const pw = Math.max(measure(tag, A1), measure(line, A2)) + 78, kp = eo(seg(t, t0, t0 + .5)) * out;
  if (kp > 0.01) el('rect', { x: 120, y: y - 84, width: r1(pw * kp), height: 156, rx: 22, fill: C.night }, p);
  el('rect', { x: 150, y: r1(y - 62 + 110 * (1 - kb) / 2), width: 8, height: r1(110 * kb), rx: 4, fill: C.sun }, p);
  wipeText(p, 182, y - 26, tag, A1, eo(seg(t, t0 + .1, t0 + .45)) * out, 36);
  wipeText(p, 182, y + 40, line, A2, eo(seg(t, t0 + .25, t0 + .75)) * out, 64);
}

// ---------- anillo de «próxima parada» y línea de mira ----------
function ringAt(p, t, t0, tOut, x, y, r, labelTxt, lx, ly) {
  if (t < t0 || t >= tOut) return;
  const rr = r + (r * 2.6) * (1 - spr(t, t0, 15, 8.5));
  el('circle', { cx: r1(x), cy: r1(y), r: r1(rr), fill: 'none', stroke: C.sun, 'stroke-width': 6 }, p);
  const ko = eo(seg(t, t0 + 0.08, t0 + 0.32));
  if (ko > 0) el('circle', { cx: r1(x), cy: r1(y), r: r1(rr + 18 * ko), fill: 'none', stroke: C.sun, 'stroke-width': 3.5, 'stroke-dasharray': '4 12', 'stroke-dashoffset': r1(-(t - t0) * 12), 'stroke-linecap': 'round' }, p);
  const a = Math.atan2(ly - y, lx - x), x1 = x + Math.cos(a) * (r + 30), y1 = y + Math.sin(a) * (r + 30), ey = ly > y ? ly - 62 : ly + 44;
  const kl = eio(seg(t, t0 + 0.32, t0 + 0.62));
  if (kl > 0) el('path', { d: `M${r1(x1)},${r1(y1)}L${r1(lerp(x1, lx, kl))},${r1(lerp(y1, ey, kl))}`, stroke: C.sun, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, p);
  wipeText(p, lx, ly - 26, 'PRÓXIMA PARADA', { 'font-size': 28, 'font-weight': 600, fill: C.sun, 'letter-spacing': 4, 'text-anchor': 'middle' }, eo(seg(t, t0 + 0.5, t0 + 0.75)), 34);
  wipeText(p, lx, ly + 30, labelTxt, { 'font-size': 52, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle' }, eo(seg(t, t0 + 0.6, t0 + 0.9)), 58);
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
// cada parada dispara su mira y cierra su anillo: [mira, cierre, etiqueta, dónde va la etiqueta (pantalla)]
const AIM = [
  { fire: 7.2, lock: 7.9, name: 'Egipto', L: [760, 1500] },
  { fire: 17.9, lock: 18.5, name: 'Babilonia', L: [680, 1440] },
  { fire: 37.6, lock: 38.5, name: 'el hueco', L: [700, 1560] },
  { fire: 63.2, lock: 64.0, name: 'hoy', L: [760, 1400] },
];

// ---------- fondo: estrellas más allá del cuadro (para los rebotes del zoom) ----------
function starField(p, seed, n) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = -W + R() * 3 * W, y = -H * .5 + R() * 2 * H, k = R(), r = k < 0.7 ? 2 + R() * 2 : 3.6 + R() * 2.6;
    el('circle', { cx: r1(x), cy: r1(y), r: r1(r), fill: k < 0.55 ? C.mist : k < 0.85 ? C.cream : C.sun }, p);
  }
}
const pop = (t, t0) => spr(t, t0, 18, 9);

// ---------- nivel 0 · el hueso de Ishango ----------
const NOTCH_T = i => 0.45 + i * 0.105 + Math.floor(i / 1) * 0 + (i >= 3 ? .18 : 0) + (i >= 9 ? .18 : 0) + (i >= 13 ? .18 : 0);
function level0(G, t) {
  starField(G, 11, 150);
  halo(G, BONE.x, BONE.y, 520, 640);
  const B = g(G, { transform: `translate(${BONE.x},${BONE.y}) rotate(${BONE.rot}) scale(${BONE.k})` });
  const pts = [[-50, -250], [-46, 0], [-50, 250], [-98, 290], [-88, 352], [-34, 350], [0, 322], [34, 350], [88, 352], [98, 290], [50, 250], [46, 0], [50, -250],
    [98, -290], [88, -352], [34, -350], [0, -322], [-34, -350], [-88, -352], [-98, -290]];
  shaded(B, 'path', { d: blobPath(pts) }, C.cream, C.creamD, 9, 8);
  NOTCH.forEach((y, i) => { const k = pop(t, NOTCH_T(i)); if (k > 0.01) el('rect', { x: r1(-44), y: r1(y), width: r1(46 * k), height: 8, rx: 4, fill: C.n3 }, B); });
}

// ---------- nivel 1 · Egipto ----------
function coil(p, x, y, k, col) {
  if (k <= 0.01) return;
  let d = ''; for (let i = 0; i <= 30; i++) { const a = i / 30 * 8.6, r = (4 + i * 1.15) * k; d += (i ? 'L' : 'M') + r1(x + Math.cos(a) * r) + ',' + r1(y + Math.sin(a) * r); }
  const a = 8.6, r = 38.5 * k; d += `L${r1(x + Math.cos(a) * r + 6 * k)},${r1(y + Math.sin(a) * r + 44 * k)}`;
  el('path', { d, fill: 'none', stroke: col, 'stroke-width': r1(11 * k), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}
const bar = (p, x, y, k, w = 26, h = 118, col = C.cream, colD = C.creamD) => { if (k > 0.01) shaded(p, 'rect', { x: r1(x - w * k / 2), y: r1(y - h * k / 2), width: r1(w * k), height: r1(h * k), rx: r1(w * k / 2) }, col, colD, 5, 4); };
function level1(G, t) {
  starField(G, 23, 90);
  // leyenda: 1, 10, 100
  const out = 1 - ei(seg(t, 16.7, 17.1));
  const kb = (t < 12.7 ? 1 : 1) * out;                                    // la barra central ya está: es la muesca por la que se entró
  bar(G, kf(t, [[12.9, EG.bar[0]], [13.6, 250]]), EG.bar[1], kb, 34, 170);
  const k10 = pop(t, 13.9) * out, k100 = pop(t, 14.9) * out;
  if (k10 > 0.01) el('path', { d: `M${r1(540 - 62 * k10)},${r1(1066)}V${r1(980)}A${r1(62 * k10)},${r1(72 * k10)} 0 0 1 ${r1(540 + 62 * k10)},${r1(980)}V${r1(1066)}`, fill: 'none', stroke: C.coral, 'stroke-width': r1(30 * k10), 'stroke-linecap': 'round' }, G);
  coil(G, 830, 975, 1.9 * k100, C.mint);
  const num = (x, s, t0) => riseText(G, t, t0, 16.6, x, 1240, s, { 'font-size': 84 });
  num(250, '1', 13.5); num(540, '10', 14.1); num(830, '100', 15.1);
  // 909: nueve cuerdas y nueve trazos
  for (let i = 0; i < 9; i++) coil(G, EGC(i)[0], EGC(i)[1], pop(t, 17.2 + i * .06), C.mint);
  for (let i = 0; i < 9; i++) bar(G, EG9(i)[0], EG9(i)[1], pop(t, 17.75 + i * .08), 24, 104);
}

// ---------- nivel 2 · Babilonia ----------
function wedge(p, x, y, k, col = C.night) {
  if (k <= 0.01) return;
  el('path', { d: `M${r1(x - 36 * k)},${r1(y)}L${r1(x + 36 * k)},${r1(y)}L${r1(x + 9 * k)},${r1(y + 50 * k)}L${r1(x + 5 * k)},${r1(y + 190 * k)}L${r1(x - 5 * k)},${r1(y + 190 * k)}L${r1(x - 9 * k)},${r1(y + 50 * k)}Z`, fill: col, 'stroke-linejoin': 'round' }, p);
}
function hook(p, x, y, k, col = C.night) {
  if (k <= 0.01) return;
  el('path', { d: `M${r1(x + 70 * k)},${r1(y)}L${r1(x)},${r1(y + 95 * k)}L${r1(x + 70 * k)},${r1(y + 190 * k)}L${r1(x + 44 * k)},${r1(y + 95 * k)}Z`, fill: col }, p);
}
function level2(G, t) {
  starField(G, 37, 80);
  shaded(G, 'rect', { x: TAB.x - TAB.w / 2, y: TAB.y - TAB.h / 2, width: TAB.w, height: TAB.h, rx: 70 }, C.coral, C.coralD, 14, 12);
  // arriba: la leyenda. La primera cuña ya está: es el trazo egipcio por el que se entró
  wedge(G, 330, 560, 1);
  const eq = (x, s, t0) => { const k = pop(t, t0); if (k > 0.01) text(G, x, 700, s, { 'font-size': r1(96 * k), 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle' }); };
  eq(455, '= 1', 24.6);
  hook(G, 590, 560, pop(t, 26.6));
  eq(770, '= 10', 27.4);
  // sesenta puntos alrededor: de 60 en 60
  const ko = 1 - ei(seg(t, 34.9, 35.3));
  for (let i = 0; i < 60; i++) {
    const k = pop(t, 30.2 + i * .045) * ko; if (k <= 0.01) continue;
    const a = i / 60 * 6.2832 - 1.5708, big = i % 5 === 0;
    el('circle', { cx: r1(TAB.x + Math.cos(a) * 492), cy: r1(TAB.y + Math.sin(a) * 590), r: r1((big ? 9 : 5) * k), fill: big ? C.cream : C.mist }, G);
  }
  // abajo: una cuña, un hueco, una cuña
  wedge(G, GAPB[0] - 190, GAPB[1] - 95, pop(t, 35.6));
  wedge(G, GAPB[0] + 190, GAPB[1] - 95, pop(t, 36.2));
}

// ---------- nivel 3 · la India: del punto al círculo, el cero entra en las cuentas ----------
function zeroShape(p, x, y, ro, hole, sq = .76, col = C.cream, colD = C.creamD) {
  shaded(p, 'ellipse', { cx: r1(x), cy: r1(y), rx: r1(ro * sq), ry: r1(ro) }, col, colD, r1(ro * .07), r1(ro * .06));
  if (hole > 0.5) el('ellipse', { cx: r1(x), cy: r1(y), rx: r1(hole * sq * .86), ry: r1(hole), fill: C.night }, p);
}
function level3(G, t) {
  const kz = kf(t, [[46.6, 0], [47.5, 1]]);                                 // punto → círculo
  // el cero viaja: nace en ZERO, baja a la cuenta y termina en medio del 909
  const cx = kf(t, [[49.6, ZERO.x], [50.6, 790], [60.8, 790], [61.8, Z909[0]]]);
  const cy = kf(t, [[49.6, ZERO.y], [50.6, 808], [60.8, 808], [61.8, Z909[1]]]);
  const ro = kf(t, [[43.7, 30], [46.6, 30], [47.5, 190], [49.6, 190], [50.6, 92], [60.8, 92], [61.8, 108]]) * (1 + .06 * wob(t, 47.5, 14, 6));
  halo(G, ZERO.x, ZERO.y, 150 + 260 * kz, 230 + 330 * kz);
  // 5 − 5 =
  riseText(G, t, 50.3, 60.6, 400, 860, '5 − 5 =', { 'font-size': 150 });
  // los mayas: una lupa con su concha
  const km = pop(t, 56.5) * (1 - ei(seg(t, 60.6, 61.0)));
  if (km > 0.01) {
    const mx = 690, my = 1330, R = 185 * km;
    el('circle', { cx: mx, cy: my, r: r1(R + 12), fill: C.cream }, G); el('circle', { cx: mx, cy: my, r: r1(R), fill: C.n2 }, G);
    const I = g(G, { 'clip-path': clipOf('circle', { cx: mx, cy: my, r: r1(R) }) });
    const S = g(I, { transform: `translate(${mx},${my}) scale(${km.toFixed(3)})` });
    shaded(S, 'ellipse', { cx: 0, cy: 0, rx: 128, ry: 70 }, C.mint, C.mintD, 10, 9);
    for (const q of [-1, 0, 1]) el('path', { d: `M-112,4Q-30,${q * 46} 108,${q * 14}`, fill: 'none', stroke: C.night, 'stroke-width': 7, 'stroke-linecap': 'round' }, S);
  }
  // 909 con tres signos
  riseText(G, t, 61.6, 99, Z909[0] - 215, Z909[1] + 100, '9', { 'font-size': 300 });
  riseText(G, t, 61.9, 99, Z909[0] + 215, Z909[1] + 100, '9', { 'font-size': 300 });
  zeroShape(G, cx, cy, ro, ro * .62 * kz);
}

// ---------- nivel 4 · hoy: unos y ceros ----------
const BITS = (() => { const R = rng(909), out = []; for (let i = 0; i < 40; i++) out.push(R() < .5 ? 1 : 0); out[0] = 1; out[1] = 0; return out; })();
function level4(G, t) {
  starField(G, 51, 90);
  const ph = { x: 540, y: 900, w: 560, h: 1010 };
  // el teléfono crece alrededor del hueco por el que se entró
  const kp = eo(seg(t, 67.4, 68.9));
  if (kp > 0.01) {
    shaded(G, 'rect', { x: r1(ph.x - ph.w / 2 * kp), y: r1(ph.y - ph.h / 2 * kp), width: r1(ph.w * kp), height: r1(ph.h * kp), rx: r1(64 * kp) }, C.blue, C.blueD, 12, 10);
    el('rect', { x: r1(ph.x - (ph.w / 2 - 30) * kp), y: r1(ph.y - (ph.h / 2 - 60) * kp), width: r1((ph.w - 60) * kp), height: r1((ph.h - 120) * kp), rx: r1(34 * kp), fill: C.night }, G);
  }
  const fall = kf(t, [[73.4, 0], [74.6, 1]]);                               // al final quedan solo dos: una marca y un hueco
  BITS.forEach((b, i) => {
    const c = i % 5, r = Math.floor(i / 5), x = 540 + (c - 2) * 88, y = 560 + r * 98, k = pop(t, 68.9 + r * .28 + c * .05);
    const keep = i === 11 || i === 13, kk = keep ? 1 : 1 - eio(clamp(fall * 1.6 - (i % 7) * .08));
    if (k * kk <= 0.01) return;
    const tx = keep ? lerp(x, i === 11 ? 430 : 650, eio(fall)) : x, ty = keep ? lerp(y, 900, eio(fall)) : y, s = k * kk * (keep ? 1 + 1.5 * eio(fall) : 1);
    if (keep ? i === 11 : b) bar(G, tx, ty, s, 18, 62);
    else { el('ellipse', { cx: r1(tx), cy: r1(ty), rx: r1(22 * s), ry: r1(30 * s), fill: C.blue }, G); el('ellipse', { cx: r1(tx), cy: r1(ty), rx: r1(11 * s), ry: r1(18 * s), fill: C.night }, G); }
  });
  const kw = eo(seg(t, 74.9, 75.4));
  if (kw > 0.01) for (const [x, s] of [[430, 'marca'], [650, 'hueco']]) wipeText(G, x, 1090, s, { 'font-size': 46, 'font-weight': 600, fill: C.mist, 'text-anchor': 'middle' }, kw, 50);
}
const LEVELS = [level0, level1, level2, level3, level4];

// ---------- la guía (lente por ojo) ----------
const GUIDE = { x: 232, y: 1370, s: 250 };
function guidePose(t) {
  const enter = eo(seg(t, 4.3, 5.6));
  const x = lerp(-260, GUIDE.x, enter), y = GUIDE.y + 16 * Math.sin(t * 1.7) + 90 * (1 - enter) - 26 * wob(t, 5.6, 10, 4);
  let zoom = 0, look = [0.25, -0.5], sq = 0.05 * wob(t, 5.6, 12, 5), smile = 0, wide = 0, tilt = 6 * Math.sin(t * 1.3);
  AIM.forEach((a, i) => {
    const d = DIVE[i], on = seg(t, a.fire - .5, a.fire) * (1 - seg(t, d.b, d.b + .6));
    const Q = aimPoint(i, Math.min(t, d.a)), dx = Q[0] - x, dy = Q[1] - y, L = Math.hypot(dx, dy) || 1;
    look = [lerp(look[0], dx / L, on), lerp(look[1], dy / L, on)];
    zoom = Math.max(zoom, eio(seg(t, a.fire - .35, a.fire)) * (1 - eio(seg(t, d.b - .3, d.b + .4))) * .7 + eio(seg(t, d.a, d.a + .6)) * (1 - eio(seg(t, d.b - .4, d.b + .3))) * .3);
    sq += -0.06 * wob(t, a.fire, 16, 7) + 0.05 * wob(t, a.lock, 14, 6);
    tilt += 14 * wob(t, a.lock, 11, 5);
  });
  wide = eio(seg(t, 46.6, 47.2)) * (1 - eio(seg(t, 48.6, 49.4)));          // el círculo: sorpresa
  smile = Math.max(eio(seg(t, 47.6, 48.3)) * (1 - eio(seg(t, 49.6, 50.3))), eio(seg(t, 74.8, 75.6)));
  const lid = Math.max(blink(t, 6.4), blink(t, 15.5), blink(t, 28.2), blink(t, 33.0), blink(t, 52.4), blink(t, 58.8), blink(t, 71.2), blink(t, 77.2));
  return { x, y, P: { rot: -5 + 3 * Math.sin(t * 0.9), look, zoom, sq, smile, wide, lid, tilt, ant: 8 * Math.sin(t * 2.1) - 20 * wob(t, 5.6, 9, 4), flame: .75 + .25 * Math.sin(t * 3.1), flick: t * 11 } };
}
// el punto de la pantalla al que apunta la parada i
function aimPoint(i, t) { return mapC(restCam(i, Math.min(t, DIVE[i].a)), DIVE[i].P); }

// ---------- la cinta del tiempo (esquina inferior izquierda) ----------
const STOPS = [['hace 20 000 años', 20000], ['hace 5 000 años', 5000], ['hace 3 800 años', 3800], ['hace 1 400 años', 1400], ['hoy', 0]];
const fmtY = y => y < 75 ? 'hoy' : 'hace ' + String(Math.round(y / (y > 6000 ? 500 : 100)) * (y > 6000 ? 500 : 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' años';
function ribbon(p, t) {
  const kin = eo(seg(t, 5.4, 6.0)); if (kin <= 0) return;
  const x0 = 150, x1 = 640, y = 1612, i = levelAt(t);
  let pos = i, yrs = STOPS[i][1];
  if (i < DIVE.length && t > DIVE[i].a) { const u = eio(seg(t, DIVE[i].a, DIVE[i].b)); pos = i + u; yrs = Math.exp(lerp(Math.log(STOPS[i][1] + 20), Math.log(STOPS[i + 1][1] + 20), u)) - 20; }
  el('rect', { x: x0, y: y - 3, width: r1((x1 - x0) * kin), height: 6, rx: 3, fill: C.n3 }, p);
  el('rect', { x: x0, y: y - 3, width: r1((x1 - x0) * pos / 4 * kin), height: 6, rx: 3, fill: C.sun }, p);
  STOPS.forEach((s, k) => {
    const lit = pos >= k - 0.001, kx = x0 + (x1 - x0) * k / 4, kk = pop(t, 5.6 + k * .08) * (1 + .5 * wob(t, k === 0 ? 5.6 : DIVE[k - 1].b, 16, 7));
    if (kk > 0.01) el('circle', { cx: r1(kx), cy: y, r: r1((lit ? 11 : 8) * kk), fill: lit ? C.sun : C.n3 }, p);
  });
  wipeText(p, x0, y - 34, fmtY(yrs), { 'font-size': 40, 'font-weight': 600, fill: C.cream }, kin, 46);
}

// ---------- lo que se lee en cada parada ----------
function labels(p, t) {
  { const kp = eo(seg(t, 0.2, 0.6)) * (1 - eio(seg(t, 4.4, 4.75))); if (kp > 0.01) el('rect', { x: 104, y: 196, width: r1(690 * kp), height: 262, rx: 30, fill: C.night }, p); }
  riseText(p, t, 0.35, 4.3, 150, 300, 'El origen de', { 'font-size': 100, 'text-anchor': 'start' });
  riseText(p, t, 0.6, 4.4, 150, 415, 'los números', { 'font-size': 100, fill: C.sun, 'text-anchor': 'start' });
  label(p, t, 5.6, 10.2, 'ÁFRICA · ISHANGO', 'muescas en un hueso');
  label(p, t, 12.9, 16.9, 'EGIPTO', 'un dibujo por cada 10');
  label(p, t, 17.3, 21.2, 'EGIPTO', '909 = 18 signos');
  label(p, t, 23.8, 29.8, 'BABILONIA', 'dos signos bastan');
  label(p, t, 30.2, 35.1, 'DE 60 EN 60', '1 hora = 60 minutos');
  label(p, t, 35.6, 41.3, 'BABILONIA', 'el hueco no se escribe');
  label(p, t, 44.2, 49.5, 'INDIA', 'el hueco recibe un signo');
  label(p, t, 50.0, 56.1, 'INDIA · AÑO 628', 'el cero ya es un número');
  label(p, t, 56.5, 61.0, 'MAYAS · AMÉRICA', 'otro cero, inventado aparte');
  label(p, t, 61.4, 66.3, 'CON EL CERO', '909 = 3 signos');
  label(p, t, 69.0, 73.4, 'HOY', 'todo se escribe con 1 y 0');
  label(p, t, 74.0, 99, 'IGUAL QUE AL PRINCIPIO', 'una marca y un hueco');
}

// ---------- un cuadro ----------
function film(t) {
  const i = levelAt(t), diving = i < DIVE.length && t > DIVE[i].a;
  const root = g(svg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, root);
  if (!diving) { LEVELS[i](g(root, { transform: camTf(restCam(i, t)) }), t); }
  else {
    const d = diveState(i, t);
    LEVELS[i](g(root, { transform: camTf(d.outer) }), t);
    const hole = g(root, { 'clip-path': clipOf('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R) }) });
    el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, hole);
    LEVELS[i + 1](g(hole, { transform: `translate(${d.Q[0].toFixed(3)},${d.Q[1].toFixed(3)}) scale(${d.k.toFixed(5)}) translate(${-DIVE[i].A[0]},${-DIVE[i].A[1]})` }), t);
    if (d.R < 1500) {
      el('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R), fill: 'none', stroke: C.sun, 'stroke-width': r1(6 + 8 * d.e) }, root);
      el('circle', { cx: r1(d.Q[0]), cy: r1(d.Q[1]), r: r1(d.R + 18 + 30 * d.e), fill: 'none', stroke: C.sun, 'stroke-width': 3.5, 'stroke-dasharray': '4 12', 'stroke-dashoffset': r1(-t * 12), 'stroke-linecap': 'round' }, root);
    }
  }
  // capa de pantalla: mira, anillo, etiquetas, cinta, guía
  const ui = g(root), gp = guidePose(t);
  AIM.forEach((a, k) => {
    const d = DIVE[k]; if (t < a.fire || t >= d.a) return;
    const Q = aimPoint(k, t), A = orbiLens(gp.x, gp.y, GUIDE.s, gp.P);
    dotsAB(ui, t, a.fire, a.lock, d.a, A, Q, d.r * restCam(k, t).z + 26);
    ringAt(ui, t, a.lock, d.a, Q[0], Q[1], d.r * restCam(k, t).z, a.name, a.L[0], a.L[1]);
  });
  labels(ui, t);
  ribbon(ui, t);
  if (t > 4.2) orbi(ui, gp.x, gp.y, GUIDE.s, gp.P);
}

// ---------- sucesos para el sonido ----------
function filmEvents() {
  const ev = [], pan = x => +clamp((x - 540) / 700, -.7, .7).toFixed(2);
  NOTCH.forEach((y, i) => ev.push({ t: NOTCH_T(i), type: 'tick', i, pan: 0 }));
  ev.push({ t: 0.35, type: 'rise' }, { t: 0.6, type: 'rise' }, { t: 3.3, type: 'pull', d: 1.9 }, { t: 4.3, type: 'enter', d: 1.3 });
  AIM.forEach((a, i) => { ev.push({ t: a.fire, type: 'line', d: a.lock - a.fire }, { t: a.lock, type: 'lock', i }, { t: DIVE[i].a, type: 'dive', d: DIVE[i].b - DIVE[i].a, i }, { t: DIVE[i].b, type: 'arrive', i }); });
  [13.5, 14.1, 15.1].forEach((t, i) => ev.push({ t, type: 'pop', i }));
  for (let i = 0; i < 9; i++) ev.push({ t: 17.2 + i * .06, type: 'count', i }, { t: 17.75 + i * .08, type: 'count', i: 9 + i });
  [24.6, 26.6, 27.4, 35.6, 36.2].forEach((t, i) => ev.push({ t, type: 'press', i }));
  for (let i = 0; i < 60; i += 5) ev.push({ t: 30.2 + i * .045, type: 'clock', i: i / 5 });
  ev.push({ t: 43.75, type: 'dot' }, { t: 46.6, type: 'zero', d: .9 }, { t: 50.3, type: 'rise' }, { t: 56.5, type: 'pop', i: 3 }, { t: 61.6, type: 'rise' }, { t: 61.9, type: 'rise' });
  for (let r = 0; r < 8; r++) ev.push({ t: 68.9 + r * .28, type: 'bitrow', i: r });
  ev.push({ t: 73.4, type: 'fall', d: 1.2 }, { t: 74.9, type: 'end' });
  ev.push({ t: 0, type: 'narr', lines: NARR });
  return ev.sort((a, b) => a.t - b.t);
}
