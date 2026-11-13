// «La cuerda del escriba» · clip de curiosidades de Zuka, estilo Watercolor Brush, 1080×1920 a 30 fps.
// Un solo rollo pintado (papel de 1080 × 8800) que la cámara recorre de arriba abajo: el Nilo crecido, los estiradores
// de cuerda (3-4-5), el campo, el granero (círculo de 9 ≈ cuadrado de 8), el pan (pefsu), la noche de Seshat, la
// pirámide hilada por hilada con su seked y la estatua del escriba. La cuerda roja es el único acento.
// Script clásico: usa el motor de trazos de engine.js (mk, drawS, drawList, sprite, withSeed…). Guion: TREATMENT.md.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const ACC = '#c8442a', NILE = '#6f97b0', NILE2 = '#9fb8c6', SILT = '#7a5a3c', GREEN = '#8ea860', GREEN2 = '#b3b874',
  STRAW = '#d9c58a', SAND = '#d8b77a', SAND2 = '#c99a5a', STONE = '#e2c48c', STONE2 = '#b98d58', SKIN = '#a5643a',
  LINEN = '#e6dbc3', NIGHT = '#2f3550', NIGHT2 = '#4a4f72', DAWN = '#f0c89a', GOLD = '#d9a53a', BLUE = '#3f5f8c';
const DUR = 109.5; window.DUR = DUR;

// ---------------- narración (subtítulos sobre el papel) ----------------
const SUBS = [
  [2.8, 8.4, 'Cada verano, el Nilo crecía', 'y borraba los linderos de los campos.'],
  [10.4, 15.2, 'Se cree que los «estiradores de cuerda»', 'medían con una cuerda de 12 nudos.'],
  [15.4, 20.8, 'Con lados de 3, 4 y 5 tramos,', 'la cuerda forma un ángulo recto.'],
  [21.2, 25.6, 'Así volvían a trazar cada campo', 'con sus medidas exactas.'],
  [25.8, 30.2, 'Más tierra, más grano…', '¡y más impuesto para el faraón!'],
  [32.4, 37.0, 'En los graneros redondos', 'había que calcular cuánto cabía.'],
  [37.2, 42.8, 'Un círculo de 9 valía como', 'un cuadrado de 8: π vale unos 3.16.'],
  [43.4, 47.8, 'Un saco de grano daba 20 panes', 'pequeños… o 4 grandes.'],
  [48.0, 52.2, 'Ese número, el pefsu, contaba', 'cuántos panes salían de cada saco.'],
  [54.6, 61.4, 'De noche, el faraón y la diosa Seshat', 'tensaban la cuerda mirando las estrellas.'],
  [62.8, 67.6, 'Luego, hilada tras hilada,', 'cada cara debía inclinarse igual.'],
  [67.8, 72.6, 'Usaban el seked: cuántos palmos', 'se entra por cada codo de subida.'],
  [72.8, 78.8, 'En la Gran Pirámide: 5½ palmos', 'por codo, una pendiente de casi 52°.'],
  [79.2, 83.8, 'Y al final, la punta dorada:', 'el piramidión.'],
  [86.4, 91.4, 'Quien sabía contar y medir era', 'de los más respetados de Egipto.'],
  [91.6, 96.6, 'Senenmut, arquitecto de la reina Hatshepsut,', 'se hizo esculpir con su cuerda de medir.'],
  [96.8, 101.2, 'Un papiro llama a las matemáticas', '«el conocimiento de todo lo que existe».'],
];

// ---------------- sonido (segundos de película) ----------------
const EV = []; window.EV = EV;
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, pan: 0, ...o });
ev(.3, 'brush', { d: 1.9 }); ev(2.6, 'water', { d: 2.8 }); ev(8.6, 'water', { d: 1.8, out: 1 });
[3.4, 3.9, 4.4, 4.9].forEach(t => ev(t, 'sistrum'));
ev(10.2, 'brush', { d: 1.4 }); ev(11.2, 'rope', { d: 2.2 }); [13.0, 13.25, 13.5].forEach((t, i) => ev(t, 'stake', { pan: [-.5, .5, -.5][i] }));
[14.0, 14.4, 14.8].forEach(t => ev(t, 'pencil')); ev(15.4, 'pencil'); ev(15.6, 'ding'); ev(17.0, 'pencil');
ev(21.0, 'brush', { d: 1.6 }); ev(23.0, 'pencil'); ev(24.0, 'pencil'); [26.4, 26.8, 27.2, 27.6, 28.0].forEach((t, i) => ev(t, 'grain', { pan: .1 * i }));
ev(30.0, 'swoosh', { d: 2 }); ev(31.5, 'brush', { d: 2.5 }); ev(35.0, 'brush', { d: 1.2 }); ev(36.4, 'pencil'); ev(38.0, 'rope', { d: 1.6 });
ev(39.8, 'pencil'); ev(40.4, 'pencil'); ev(41.2, 'ding');
ev(43.0, 'mist', { d: .8 }); ev(43.6, 'brush', { d: .8 }); ev(44.6, 'pencil');
for (let i = 0; i < 20; i++) ev(45.0 + i * .05, 'bread', { n: i, pan: -.4 }); for (let i = 0; i < 4; i++) ev(46.0 + i * .2, 'bread', { n: 30 + i, big: 1, pan: .4 });
ev(48.0, 'pencil'); ev(52.0, 'swoosh', { d: 2 }); ev(52.6, 'brush', { d: 1.8 });
ev(53.8, 'mute', { d: 8.2 }); ev(54.0, 'night', { d: 8.0 }); ev(54.0, 'brush', { d: 1.4 }); ev(55.6, 'rope', { d: 1.4, low: 1 }); ev(57.2, 'stake'); ev(57.4, 'stake', { pan: .4 });
ev(61.6, 'mist', { d: .8 }); ev(62.0, 'brush', { d: 1.6 });
for (let i = 0; i < 14; i++) { ev(63.6 + i * .6 + .5, 'stone', { n: i }); ev(63.6 + i * .6, 'drag', { d: .45 }); }
ev(73.0, 'rope', { d: .6 }); ev(73.8, 'pencil'); ev(74.2, 'pencil'); ev(74.8, 'pencil'); ev(75.4, 'pencil');
ev(79.2, 'shimmer'); ev(79.8, 'burst');
ev(84.0, 'swoosh', { d: 2.2 }); ev(85.6, 'brush', { d: 3.0 }); ev(89.5, 'pencil'); ev(90.2, 'pencil'); ev(90.9, 'pencil'); ev(92.0, 'papyrus');
ev(101.0, 'mist', { d: 2.5 }); ev(103.0, 'rope', { d: 2.0 }); ev(103.9, 'ding'); ev(104.5, 'pencil');
SUBS.forEach(([a, b, l1, l2]) => ev(a, 'narr', { d: b - a, text: l1 + ' ' + l2 }));
EV.sort((a, b) => a.t - b.t);

// ---------------- cámara: un rollo vertical ----------------
const camYk = monotone([[0, 960], [20.4, 960], [22.6, 1180], [30.0, 1180], [32.2, 2960], [52.0, 2960], [54.2, 5200], [61.6, 5200], [63.6, 5760],
  [72.0, 5480], [73.4, 5640], [78.8, 5640], [81.0, 5470], [84.0, 5470], [86.2, 7980], [90.0, 7900], [110, 7900]]);
const camSk = monotone([[0, 1], [20.4, 1], [22.6, 1.04], [30, 1.04], [32.2, 1], [61.6, 1], [63.6, 1.15], [72.0, 1.15], [73.4, 1], [78.8, 1], [81.0, 1.55],
  [84.0, 1.55], [86.2, 1.35], [90.0, 1], [110, 1]]);
let CAM = { y: 960, s: 1 };
const setCam = () => ctx.setTransform(CAM.s, 0, 0, CAM.s, 540 - 540 * CAM.s, 960 - CAM.y * CAM.s);

// ---------------- ayudas de dibujo ----------------
let PAPER_IMG = null, REC = null;
function rec(x0, y0, x1, y1, id, text) {
  if (!REC) return;
  const m = ctx.getTransform(), P = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  REC.push({ id, text, x0: Math.min(...P.map(p => p[0])), y0: Math.min(...P.map(p => p[1])), x1: Math.max(...P.map(p => p[0])), y1: Math.max(...P.map(p => p[1])) });
}
// Lavado: el mismo polígono en 3 pasadas con vértices movidos (bordes que se oscurecen donde no coinciden).
function wash(pts, col, a, seed = 1, jit = 5) {
  for (let p = 0; p < 3; p++) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => { const jx = (hash(seed * 31 + i * 7.1 + p * 131) - .5) * 2 * jit, jy = (hash(seed * 17 + i * 3.3 + p * 71) - .5) * 2 * jit; i ? ctx.lineTo(x + jx, y + jy) : ctx.moveTo(x + jx, y + jy); });
    ctx.closePath(); ctx.fillStyle = rgba(col, a / 3 * 1.6); ctx.fill();
  }
}
const rectP = (x0, y0, x1, y1, n = 6) => { const P = []; for (let i = 0; i <= n; i++) P.push([lerp(x0, x1, i / n), y0]); for (let i = 0; i <= n; i++) P.push([x1, lerp(y0, y1, i / n)]);
  for (let i = 0; i <= n; i++) P.push([lerp(x1, x0, i / n), y1]); for (let i = 0; i <= n; i++) P.push([x0, lerp(y1, y0, i / n)]); return P; };
// Niebla: el papel vuelve a cubrir (borra) lo que hay en una franja, con borde ondulado que sube.
function mist(y0, y1, k, seed = 3) {
  if (k <= 0) return;
  const top = lerp(y1, y0 - 60, k);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-200, y1 + 60);
  for (let x = -200; x <= 1280; x += 30) ctx.lineTo(x, top + 22 * Math.sin(x * .013 + seed) + 12 * Math.sin(x * .041 + seed * 2));
  ctx.lineTo(1280, y1 + 60); ctx.closePath(); ctx.clip();
  ctx.drawImage(PAPER_IMG, 0, 0); ctx.restore();
}
function hand(txt, x, y, p, o = {}, id = null) {
  if (p <= 0) return;
  const font = o.font || 'Caveat', size = o.size || 40;
  ctx.save(); ctx.font = `${o.w || 600} ${size}px "${font}"`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.letterSpacing = (o.track || 0) + 'px';
  const w = ctx.measureText(txt).width, x0 = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
  ctx.beginPath(); ctx.rect(x0 - 8, y - size, (w + 16) * eo(p), size * 2); ctx.clip();
  ctx.shadowColor = rgba(PAPER, .95); ctx.shadowBlur = 12; ctx.fillStyle = rgba(o.col || INK, o.a ?? .9); ctx.fillText(txt, x0, y); ctx.fillText(txt, x0, y);
  ctx.restore();
  if (p > .95 && id !== false && (o.a ?? .9) * ctx.globalAlpha > .5) rec(x0, y - size * .45, x0 + w, y + size * .45, id || txt, txt);
}
const mono = (txt, x, y, p, o = {}, id) => hand(txt, x, y, p, { font: 'IBM Plex Mono', w: 400, size: 34, track: 2, ...o }, id);
function leader(x0, y0, x1, y1, p, bend = 18, a = .75) {
  if (p <= 0) return;
  const pts = qcurve(x0, y0, x1, y1, bend, 16), m = Math.max(1, Math.round(16 * clamp(p)));
  ctx.beginPath(); for (let i = 0; i <= m; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = rgba(INK, a); ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.stroke();
  if (p >= 1) { ctx.beginPath(); ctx.arc(x1, y1, 3.2, 0, 7); ctx.fillStyle = rgba(INK, a); ctx.fill(); }
}
const fade2 = (t, a, b, fi = .5, fo = .5) => ss(seg(t, a, a + fi)) * (1 - ss(seg(t, b - fo, b)));
function note(t, t0, t1, ax, ay, lx, ly, txt, o = {}) {
  const f = 1 - ss(seg(t, t1 - .5, t1)); if (t < t0 || f <= 0) return;
  ctx.save(); ctx.globalAlpha *= f;
  leader(lx + (o.lead ?? 0), ly + (o.ly ?? 22), ax, ay, seg(t, t0, t0 + .6), o.bend ?? 18);
  hand(txt, lx, ly, seg(t, t0 + .3, t0 + 1.2), o);
  ctx.restore();
}
// La cuerda roja: polilínea con nudos, pintada dos veces con un leve corrimiento (pigmento transparente).
function cord(pts, p = 1, o = {}) {
  if (p <= 0 || pts.length < 2) return;
  let P = pts; if (p < 1) P = partOf(pts, p);
  for (const [dx, dy, w, a] of [[0, 0, o.w || 6, .85], [1.2, -.8, (o.w || 6) * .55, .55]]) {
    ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x + dx, y + dy) : ctx.moveTo(x + dx, y + dy));
    ctx.strokeStyle = rgba(ACC, a * (o.a ?? 1)); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  }
  if (o.knots) for (const [x, y] of o.knots) { ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 7); ctx.fillStyle = rgba('#7d2416', .85 * (o.a ?? 1)); ctx.fill(); }
}
function partOf(pts, f) {
  let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let want = L * f, out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (want <= d) { out.push([lerp(pts[i - 1][0], pts[i][0], want / d), lerp(pts[i - 1][1], pts[i][1], want / d)]); return out; } want -= d; out.push(pts[i]); }
  return out;
}
// Un objeto pintado: lista de trazos en coordenadas locales, se pinta de ta a tb y luego queda como sprite.
const OBJ = {};
function paint(o, t, x = o.x, y = o.y, a = 1) {
  if (!o || t < o.ta || a <= 0) return;
  const p = seg(t, o.ta, o.tb);
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a;
  if (p < 1) drawList(ctx, o.L, p); else ctx.drawImage(o.spr.cv, o.spr.x0, o.spr.y0);
  ctx.restore();
}
const mkObj = (L, ta, tb, x, y) => ({ L, ta, tb, x, y, spr: sprite(L) });

// ---------------- generadores (coordenadas locales: pies en 0,0; y hacia arriba es negativa) ----------------
// Figura egipcia de perfil, como en las tumbas: hombros de frente, cara de perfil, falda de lino.
function egy(dir = 1, o = {}) {
  const S = [], d = dir, sk = o.skin || SKIN;
  const st = (pts, w, col, oo = {}) => S.push(mk(pts, w, col, { prof: 'even', ...oo }));
  st(qcurve(-4 * d, -140, -26 * d, -4, 4 * d, 8), 17, mixc(sk, '#000000', .12));               // pierna de atrás
  st(qcurve(6 * d, -140, 30 * d, -4, -4 * d, 8), 18, sk);                                       // pierna de adelante
  st([[-26 * d, -4], [-6 * d, -2]], 9, mixc(sk, '#000000', .15)); st([[30 * d, -4], [52 * d, -2]], 9, sk);   // pies
  st(qcurve(-30 * d, -150, 34 * d, -110, -6, 8), 46, LINEN, { a: .85 });                         // falda
  st(qcurve(-20 * d, -152, 36 * d, -120, 4, 6), 22, LINEN, { a: .7 });
  st([[0, -150], [2 * d, -226]], 40, sk, { prof: 'even' });                                     // torso
  st([[-28, -224], [28, -224]], 20, sk);                                                        // hombros de frente
  const arm = o.arm || 'forward';
  if (arm === 'forward') { st(qcurve(20 * d, -222, 74 * d, -178, 8 * d, 8), 12, sk); st(qcurve(-22 * d, -222, 58 * d, -186, -14 * d, 8), 11, mixc(sk, '#000000', .12)); }
  else if (arm === 'up') { st(qcurve(20 * d, -222, 66 * d, -282, -6 * d, 8), 12, sk); st(qcurve(-22 * d, -222, 40 * d, -276, 10 * d, 8), 11, mixc(sk, '#000000', .12)); }
  else { st(qcurve(22 * d, -222, 30 * d, -150, 4 * d, 8), 12, sk); st(qcurve(-22 * d, -222, -24 * d, -152, -4 * d, 8), 11, mixc(sk, '#000000', .12)); }
  st([[2 * d, -230], [4 * d, -246]], 14, sk);                                                    // cuello
  S.push(mk(qcurve(-6 * d, -264, 20 * d, -262, -4, 6), 34, sk, { prof: 'leaf', nb: 3 }));        // cabeza
  st([[22 * d, -262], [28 * d, -258]], 7, sk);                                                   // nariz
  if (o.crown === 'nemes') {
    S.push(mk(qcurve(-18 * d, -292, 18 * d, -290, -6, 6), 30, GOLD, { prof: 'leaf', nb: 4 }));
    st(qcurve(-16 * d, -286, -22 * d, -222, 6 * d, 8), 24, GOLD); st([[-20 * d, -270], [-22 * d, -232]], 6, BLUE, { a: .8 });
    st([[-10 * d, -292], [-12 * d, -228]], 5, BLUE, { a: .7 });
  } else if (o.crown === 'seshat') {
    st(qcurve(-14 * d, -286, -18 * d, -222, 4 * d, 8), 26, INK2, { a: .85 });                    // peluca
    st([[0, -290], [0, -350]], 4, INK, { a: .85 });                                              // vara con la estrella
    for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / 7; st([[0, -370], [Math.cos(a) * 20, -370 + Math.sin(a) * 20]], 4, INK, { a: .85 }); }
    st(qcurve(-30 * d, -228, 30 * d, -150, 0, 6), 46, SAND2, { a: .55 });                      // piel de leopardo
    for (let k = 0; k < 9; k++) S.push(mk([[(-20 + (k % 3) * 18) * d, -210 + Math.floor(k / 3) * 22], [(-16 + (k % 3) * 18) * d, -206 + Math.floor(k / 3) * 22]], 7, INK2, { prof: 'leaf', a: .7 }));
  } else st(qcurve(-14 * d, -288, -20 * d, -238, 6 * d, 8), 24, INK2, { a: .9 });               // peluca corta
  S.push(mk([[12 * d, -268], [17 * d, -268]], 4, INK, { prof: 'even', a: .9 }));                // ojo
  return S;
}
function palm(h = 200) {
  const S = [];
  S.push(mk(qcurve(0, 0, 12, -h, -18, 14), 12, '#8a6a46', { prof: 'trunk' }));
  for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .5; S.push(mk(qcurve(12, -h, 12 + Math.cos(a) * 90, -h + Math.sin(a) * 60 + 40, 18 * Math.sign(k - 3 || 1), 8), 16, k % 2 ? '#6f8a4e' : '#8ea860', { prof: 'leaf', nb: 3 })); }
  return S;
}
function silo(w = 200, h = 300) {
  const S = [];
  for (let k = 0; k < 5; k++) { const x = -w / 2 + 10 + k * (w - 20) / 4; S.push(mk(qcurve(x, 0, x * .92, -h * .62, 0, 8), w / 4.2, k < 2 ? '#d7a66a' : '#bf8a52', { prof: 'even', nb: 4, a: .8 })); }
  for (let k = 0; k < 4; k++) { const r = w / 2 - k * w / 9; S.push(mk(qcurve(-r, -h * .62 - k * h * .08, r, -h * .62 - k * h * .08, -h * .22 + k * 8, 14), 26 - k * 3, k % 2 ? '#c99358' : '#dcae74', { prof: 'leaf', nb: 4, a: .82 })); }
  S.push(mk([[-14, -h * .3], [14, -h * .3]], 22, INK2, { prof: 'even', a: .7 }));                 // ventanilla
  S.push(mk([[-w / 2, -2], [w / 2, -2]], 3, INK2, { prof: 'even', a: .7 }));
  return S;
}
function sack(sc = 1) {
  const S = [];
  S.push(mk(qcurve(-40 * sc, 0, 40 * sc, 0, 30 * sc, 10), 60 * sc, '#c8a26a', { prof: 'leaf', nb: 5 }));
  S.push(mk(qcurve(0, -6 * sc, 0, -86 * sc, 6 * sc, 10), 66 * sc, '#d3b07a', { prof: 'leaf', nb: 5, a: .85 }));
  S.push(mk([[-14 * sc, -88 * sc], [14 * sc, -88 * sc]], 8 * sc, INK2, { prof: 'even' }));
  return S;
}
function loaf(sc = 1) {
  return [mk(qcurve(-30 * sc, 0, 30 * sc, 0, -22 * sc, 10), 30 * sc, '#c6884a', { prof: 'leaf', nb: sc > .8 ? 4 : 0, a: .9 }),
    mk(qcurve(-18 * sc, -10 * sc, 14 * sc, -12 * sc, -6 * sc, 6), 8 * sc, '#e2b277', { prof: 'leaf', a: .7 })];
}
function scribe() {     // escriba sentado, de frente, en piedra arenisca pintada
  const S = [], st = (pts, w, col, oo = {}) => S.push(mk(pts, w, col, { prof: 'even', ...oo }));
  st([[-200, 0], [200, 0]], 46, '#9c7a55', { nb: 6, a: .8 });                                        // basa
  st(qcurve(-190, -46, 190, -46, -26, 14), 74, '#c48a56', { prof: 'leaf', nb: 7 });                // piernas cruzadas
  st(qcurve(-160, -82, 160, -82, -18, 12), 44, LINEN, { a: .9 });                                  // falda
  st([[-110, -96], [110, -96]], 34, '#efe4c9', { nb: 4, a: .95 });                                  // papiro sobre las piernas
  for (let k = 0; k < 3; k++) st([[-90, -104 + k * 8], [70 - k * 20, -104 + k * 8]], 1.6, INK, { a: .6 });
  st([[0, -110], [0, -300]], 178, '#c98f5a', { prof: 'even', nb: 9 });                             // torso
  st(qcurve(-84, -292, -120, -150, -16, 10), 34, '#b97f4c');                                        // brazos
  st(qcurve(-118, -150, -40, -104, 10, 8), 30, '#b97f4c');
  st(qcurve(84, -292, 120, -150, 16, 10), 34, '#c48a56');
  st(qcurve(118, -150, 60, -110, -10, 8), 30, '#c48a56');
  st([[0, -300], [0, -330]], 36, '#c48a56');                                                          // cuello
  S.push(mk(qcurve(0, -330, 0, -420, 0, 8), 92, '#cc945f', { prof: 'leaf', nb: 6 }));              // cabeza
  st(qcurve(-48, -420, -54, -320, -8, 10), 28, INK2, { a: .92 }); st(qcurve(48, -420, 54, -320, 8, 10), 28, INK2, { a: .92 });
  st(qcurve(-44, -428, 44, -428, -18, 10), 26, INK2, { a: .92 });                                   // peluca
  st([[-26, -384], [-12, -384]], 5, INK); st([[12, -384], [26, -384]], 5, INK);                      // ojos
  st([[0, -378], [2, -360]], 4, '#8a5532'); st([[-12, -346], [12, -346]], 4, '#7a3e2a', { a: .8 }); // nariz y boca
  S.push(edgeOf(S[6], 1, 2.4, INK2, .55)); S.push(edgeOf(S[6], -1, 2.4, INK2, .55));
  return S;
}

// ---------------- datos de la escena ----------------
// Estiradores de cuerda: un ángulo recto con 3-4-5 (tramo = 120 px).
const A = [270, 1120], B = [750, 1120], Cc = [270, 760];
const KN = []; for (let k = 0; k < 12; k++) {
  let p; if (k <= 4) p = [lerp(A[0], B[0], k / 4), A[1]]; else if (k <= 9) p = [lerp(B[0], Cc[0], (k - 4) / 5), lerp(B[1], Cc[1], (k - 4) / 5)]; else p = [Cc[0], lerp(Cc[1], A[1], (k - 9) / 3)];
  const a = k / 12 * Math.PI * 2 + 2.2; KN.push({ fin: p, loose: [510 + Math.cos(a) * 250, 1010 + Math.sin(a) * 120 + 30 * Math.sin(a * 2)] });
}
// Pirámide: base 800, inclinación de seked 5½ palmos (tan = 7 / 5.5): altura = 400 · 14/11 ≈ 509.
const PB = 5900, PX0 = 140, PX1 = 940, PH = 400 * 14 / 11, PAPEX = PB - PH, NC = 14;
const pyrHalf = y => 400 * (y - PAPEX) / PH;

// ---------------- construcción (una vez, con semilla fija) ----------------
function build() {
  withSeed(11, () => {
    // P0: el río, palmeras, los campos y sus linderos
    OBJ.nile = mkObj(Array.from({ length: 7 }, (_, k) => mk(qcurve(-40, 190 + k * 34, 1120, 196 + k * 34, (k % 2 ? 8 : -8), 30), 46, k % 3 ? NILE2 : NILE, { prof: 'even', nb: 8, a: .75 })), .2, 1.6, 0, 0);
    OBJ.palms = mkObj([...palm(170).map(s => s), ...palm(140).map(s => ({ ...s, pts: s.pts.map(([x, y]) => [x + 150, y + 6]) }))], .8, 2.0, 70, 176);
    OBJ.palms2 = mkObj([...palm(160), ...palm(130).map(s => ({ ...s, pts: s.pts.map(([x, y]) => [x - 120, y + 8]) }))], 1.0, 2.2, 930, 176);
    const fl = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const x0 = 130 + c * 274, y0 = 480 + r * 240; for (let k = 0; k < 4; k++) fl.push(mk(qcurve(x0 + 12, y0 + 30 + k * 56, x0 + 262, y0 + 32 + k * 56, (k % 2 ? 6 : -6), 12), 60, [GREEN, GREEN2, STRAW][(r + c) % 3], { prof: 'even', nb: 6, a: .6 })); }
    OBJ.fields = mkObj(fl, .4, 1.8, 0, 0);
    const ln = [];
    for (let c = 0; c <= 3; c++) ln.push(mk(qcurve(130 + c * 274, 470, 130 + c * 274, 1440, (c % 2 ? 6 : -6), 30), 3.2, INK2, { prof: 'even', nb: 0, a: .8 }));
    for (let r = 0; r <= 4; r++) ln.push(mk(qcurve(120, 480 + r * 240, 960, 480 + r * 240, (r % 2 ? 5 : -5), 30), 3.2, INK2, { prof: 'even', nb: 0, a: .8 }));
    OBJ.lines = mkObj(ln, 1.2, 2.4, 0, 0);
    OBJ.silt = mkObj(Array.from({ length: 18 }, (_, k) => mk(qcurve(110 + rnd(0, 40), 500 + k * 54, 970 - rnd(0, 40), 504 + k * 54, rnd(-10, 10), 24), 62, k % 3 ? SILT : '#8b6a48', { prof: 'even', nb: 7, a: .42 })), 0, .01, 0, 0);
    OBJ.man1 = mkObj(egy(1), 10.2, 11.6, 150, 1230); OBJ.man2 = mkObj(egy(-1), 10.4, 11.8, 900, 1230);
    OBJ.stakes = [A, B, Cc].map(([x, y], i) => mkObj([mk([[x, y + 14], [x + 2, y - 36]], 9, '#6b4a2e', { prof: 'tip', nb: 0 })], 13.0 + i * .25, 13.2 + i * .25, 0, 0));
    OBJ.strip = mkObj(Array.from({ length: 3 }, (_, k) => mk(qcurve(206, 1312 + k * 46, 874, 1314 + k * 46, k % 2 ? 4 : -4, 24), 52, k % 2 ? GREEN2 : GREEN, { prof: 'even', nb: 7, a: .7 })), 21.0, 22.6, 0, 0);
    OBJ.sacks = Array.from({ length: 5 }, (_, i) => mkObj(sack(.45), 26.4 + i * .4, 26.7 + i * .4, 650 + i * 46, 1282));
    // P1: granero y panadería
    OBJ.silo1 = mkObj(silo(210, 320), 31.5, 33.0, 250, 3300); OBJ.silo2 = mkObj(silo(180, 280), 31.9, 33.4, 500, 3300);
    OBJ.ground1 = mkObj([mk(qcurve(60, 3302, 1020, 3304, 4, 30), 22, SAND, { prof: 'even', nb: 7, a: .6 })], 31.4, 32.4, 0, 0);
    OBJ.scribe1 = mkObj(egy(-1, { arm: 'forward' }), 32.2, 33.6, 820, 3300);
    OBJ.circle = mkObj([mk(Array.from({ length: 49 }, (_, i) => [540 + Math.cos(i / 48 * 6.283) * 225, 2650 + Math.sin(i / 48 * 6.283) * 225]), 34, STRAW, { prof: 'even', nb: 6, a: .55 }),
      mk(Array.from({ length: 49 }, (_, i) => [540 + Math.cos(i / 48 * 6.283) * 225, 2650 + Math.sin(i / 48 * 6.283) * 225]), 3, INK2, { prof: 'even', nb: 0, a: .85 })], 35.0, 36.2, 0, 0);
    OBJ.sack = mkObj(sack(1.15), 43.6, 44.4, 540, 2560);
    OBJ.small = Array.from({ length: 20 }, (_, i) => mkObj(loaf(.55), 45.0 + i * .05, 45.3 + i * .05, 200 + (i % 5) * 52, 2690 + Math.floor(i / 5) * 46));
    OBJ.big = Array.from({ length: 4 }, (_, i) => mkObj(loaf(1.5), 46.0 + i * .2, 46.4 + i * .2, 690 + (i % 2) * 150, 2720 + Math.floor(i / 2) * 110));
    // P2: noche y pirámide
    OBJ.pharaoh = mkObj(egy(1, { crown: 'nemes' }), 54.0, 55.4, 250, 5440); OBJ.seshat = mkObj(egy(-1, { crown: 'seshat' }), 54.2, 55.6, 830, 5440);
    OBJ.nstakes = [430, 650].map((x, i) => mkObj([mk([[x, 5452], [x + 2, 5396]], 9, '#4a3a2c', { prof: 'tip', nb: 0 })], 57.2 + i * .2, 57.4 + i * .2, 0, 0));
    OBJ.sand = mkObj(Array.from({ length: 4 }, (_, k) => mk(qcurve(-40, 5904 + k * 40, 1120, 5906 + k * 40, k % 2 ? 6 : -6, 30), 50, k % 2 ? SAND : SAND2, { prof: 'even', nb: 8, a: .6 })), 62.8, 63.8, 0, 0);
    OBJ.courses = [];
    for (let i = 0; i < NC; i++) {
      const yb = PB - i * PH / NC, yt = PB - (i + 1) * PH / NC, hb = pyrHalf(yb), ht = pyrHalf(yt), ym = (yb + yt) / 2, hm = (hb + ht) / 2, L = [];
      const gold = i >= NC - 1, cL = gold ? '#e8c060' : STONE, cR = gold ? GOLD : STONE2;
      L.push(mk(qcurve(540 - hm + 4, ym, 540, ym, (i % 2 ? 2 : -2), 10), Math.max(8, yb - yt + 4), cL, { prof: 'even', nb: 5, a: .8, rough: .12 }));
      L.push(mk(qcurve(540, ym, 540 + hm - 4, ym, (i % 2 ? -2 : 2), 10), Math.max(8, yb - yt + 4), cR, { prof: 'even', nb: 5, a: .85, rough: .12 }));
      L.push(mk([[540 - hb, yb], [540 - ht, yt]], 2.4, INK2, { prof: 'even', nb: 0, a: .75 })); L.push(mk([[540 + hb, yb], [540 + ht, yt]], 2.4, INK2, { prof: 'even', nb: 0, a: .75 }));
      if (i % 3 === 0) L.push(mk([[540 - hb + 6, yb - 1], [540 + hb - 6, yb - 1]], 1.4, INK2, { prof: 'even', nb: 0, a: .35 }));
      OBJ.courses.push(mkObj(L, 63.6 + i * .6, 64.2 + i * .6, 0, 0));
    }
    OBJ.worker = mkObj([...egy(1, { arm: 'forward' }), ...egy(1, { arm: 'forward' }).map(s => ({ ...s, pts: s.pts.map(([x, y]) => [x - 60, y]) }))], 0, .01, 0, 0);
    OBJ.block = mkObj([mk([[-30, -18], [30, -18]], 36, STONE2, { prof: 'even', nb: 4 }), mk([[-40, 2], [40, 2]], 5, '#6b4a2e', { prof: 'even', nb: 0 })], 0, .01, 0, 0);
    // P3: el escriba
    OBJ.scribe = mkObj(scribe(), 85.6, 89.0, 540, 8160);
  });
}

// ---------------- escenas ----------------
function sceneNile(t) {
  // los campos, el río y los linderos; la crecida los cubre y al bajar deja limo
  const fa = 1 - ss(seg(t, 3.4, 5.2));
  paint(OBJ.nile, t);
  if (fa > 0) { paint(OBJ.fields, t, 0, 0, fa); paint(OBJ.lines, t, 0, 0, fa); }
  if (t > 4.6) paint(OBJ.silt, 99, 0, 0, .8 * ss(seg(t, 4.6, 6.0)));
  paint(OBJ.palms, t); paint(OBJ.palms2, t);
  const fy = t < 8.6 ? lerp(420, 1470, eio(seg(t, 2.6, 5.4))) : lerp(1470, 420, eio(seg(t, 8.6, 10.6)));
  if (t > 2.6 && fy > 425) {
    const P = [[-60, 400]]; for (let x = -60; x <= 1140; x += 30) P.push([x, fy + 16 * Math.sin(x * .017 + t * 1.4) + 8 * Math.sin(x * .049 - t)]);
    P.push([1140, 400]); wash(P, NILE, .62, 9, 4); wash(P, NILE2, .25, 10, 7);
  }
  // título sobre el agua
  const ta = fade2(t, 3.8, 9.4, .8, .6);
  if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; hand('La cuerda del escriba', 540, 840, seg(t, 3.8, 4.9), { font: 'Cormorant Garamond', w: 500, size: 84, align: 'center' }, 'tit');
    hand('matemáticas del antiguo Egipto', 540, 930, seg(t, 4.5, 5.3), { size: 48, align: 'center', col: INK2 }, 'sub'); ctx.restore(); }
  if (t < 9.6) return;
  // estiradores de cuerda
  paint(OBJ.man1, t); paint(OBJ.man2, t);
  const k = eio(seg(t, 11.2, 13.4)), kp = KN.map(n => [lerp(n.loose[0], n.fin[0], k), lerp(n.loose[1], n.fin[1], k)]);
  const ra = 1 - ss(seg(t, 29.6, 30.6));
  if (t > 10.6) { ctx.save(); ctx.globalAlpha = ra * ss(seg(t, 10.6, 11.2)); cord([...kp, kp[0]], 1, { knots: kp }); ctx.restore();
    // las manos sostienen la cuerda
    ctx.save(); ctx.globalAlpha = ra * ss(seg(t, 10.6, 11.2)) * (1 - ss(seg(t, 13.4, 14))); cord([[224, 1052], kp[10]], 1, { w: 4 }); cord([[826, 1052], kp[4]], 1, { w: 4 }); ctx.restore(); }
  OBJ.stakes.forEach(o => paint(o, t));
  const la = 1 - ss(seg(t, 20.6, 21.4));
  if (la > 0) { ctx.save(); ctx.globalAlpha = la;
    mono('3', 222, 940, seg(t, 14.0, 14.3), { size: 46, align: 'center' }, 'l3'); mono('4', 510, 1170, seg(t, 14.4, 14.7), { size: 46, align: 'center' }, 'l4');
    mono('5', 545, 905, seg(t, 14.8, 15.1), { size: 46, align: 'center' }, 'l5');
    if (t > 15.4) { const p = seg(t, 15.4, 15.8); ctx.beginPath(); ctx.moveTo(270, 1086); ctx.lineTo(270 + 34 * p, 1086); ctx.lineTo(304, 1086 + 34 * seg(p, .5, 1)); ctx.strokeStyle = rgba(INK, .85); ctx.lineWidth = 2.4; ctx.stroke(); }
    note(t, 15.6, 21.0, 296, 1100, 380, 1040, '¡ángulo recto!', { size: 44 });
    mono('9 + 16 = 25', 640, 700, seg(t, 17.0, 17.8), { size: 34, align: 'center' }, 'pit'); ctx.restore(); }
  if (t < 20.8) return;
  // el campo: 10 × 2 khet y su impuesto
  paint(OBJ.strip, t);
  mono('10 × 2 khet', 540, 1478, seg(t, 23.0, 23.6), { size: 36, align: 'center' }, 'dims');
  hand('= 20 khet²  ≈ 5.5 hectáreas', 540, 1540, seg(t, 24.0, 25.0), { size: 46, align: 'center' }, 'area');
  OBJ.sacks.forEach(o => paint(o, t));
}
function sceneGranary(t) {
  if (t < 30.6) return;
  paint(OBJ.ground1, t); paint(OBJ.silo1, t); paint(OBJ.silo2, t); paint(OBJ.scribe1, t);
  note(t, 33.6, 42.6, 850, 3060, 690, 3000, 'escriba', { size: 40, align: 'right', lead: -10 });
  // círculo de 9 y cuadrado de 8 (la cuerda)
  if (t < 44) {
    paint(OBJ.circle, t);
    const ga = ss(seg(t, 36.6, 37.4));
    if (ga > 0) { ctx.save(); ctx.globalAlpha = ga * .35; ctx.strokeStyle = INK2; ctx.lineWidth = 1;
      for (let i = 0; i <= 9; i++) { ctx.beginPath(); ctx.moveTo(315 + i * 50, 2425); ctx.lineTo(315 + i * 50, 2875); ctx.stroke(); ctx.beginPath(); ctx.moveTo(315, 2425 + i * 50); ctx.lineTo(765, 2425 + i * 50); ctx.stroke(); }
      ctx.restore(); }
    if (t > 36.0) { const p = seg(t, 36.0, 36.5); ctx.beginPath(); ctx.moveTo(315, 2650); ctx.lineTo(lerp(315, 765, p), 2650); ctx.strokeStyle = rgba(INK, .8); ctx.lineWidth = 2.4; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]); }
    mono('diámetro 9', 540, 2630, seg(t, 36.4, 36.9), { size: 32, align: 'center' }, 'd9');
    const sq = [[340, 2450], [740, 2450], [740, 2850], [340, 2850], [340, 2450]];
    cord(sq, seg(t, 38.0, 39.6), { w: 7 });
    mono('lado 8', 540, 2430, seg(t, 39.8, 40.3), { size: 32, align: 'center', col: '#7d2416' }, 's8');
    hand('8 × 8 = 64', 540, 2930, seg(t, 40.4, 41.0), { size: 50, align: 'center' }, '64');
    hand('π ≈ 3.16', 540, 2370, seg(t, 41.2, 41.9), { font: 'Cormorant Garamond', w: 600, size: 66, align: 'center' }, 'pi');
  }
  mist(2300, 2980, ss(seg(t, 43.0, 43.8)), 4);
  if (t < 43.6) return;
  // pan: un saco → 20 panes pequeños o 4 grandes
  paint(OBJ.sack, t); hand('1 hekat de grano', 540, 2380, seg(t, 44.2, 44.9), { size: 44, align: 'center' }, 'hek');
  const ar = seg(t, 44.6, 45.0);
  if (ar > 0) { leader(480, 2580, 330, 2650, ar, -20, .7); leader(600, 2580, 760, 2660, ar, 20, .7); }
  OBJ.small.forEach(o => paint(o, t)); OBJ.big.forEach(o => paint(o, t));
  mono('pefsu 20', 310, 2930, seg(t, 46.2, 46.7), { size: 34, align: 'center' }, 'p20'); mono('pefsu 4', 765, 2930, seg(t, 46.9, 47.4), { size: 34, align: 'center' }, 'p4');
  hand('pefsu = panes ÷ hekat', 540, 2985, seg(t, 48.2, 49.2), { size: 44, align: 'center', col: '#7d2416' }, 'pf');
}
function sceneNight(t) {
  if (t < 52.4 || t > 64) return;
  const off = ss(seg(t, 62.0, 63.4));     // el amanecer cubre la noche
  const wp = eio(seg(t, 52.6, 54.4));
  if (wp > 0 && off < 1) {
    ctx.save(); ctx.beginPath(); ctx.rect(-100, 4200, 1300 * wp, 1350); ctx.clip();
    wash(rectP(-60, 4250, 1140, 5470, 8), NIGHT, .85, 21, 10); wash(rectP(-60, 4700, 1140, 5470, 8), NIGHT2, .3, 22, 10);
    for (let i = 0; i < 46; i++) { const x = hash(i * 3.1) * 1080, y = 4320 + hash(i * 7.7) * 900, tw = .6 + .4 * Math.sin(t * 2.3 + i); ctx.beginPath(); ctx.arc(x, y, 2 + hash(i) * 3, 0, 7); ctx.fillStyle = rgba('#f6ecd0', .8 * tw); ctx.fill(); }
    // la Osa Mayor, las estrellas del norte que guiaban el ritual
    for (const [x, y] of [[420, 4560], [480, 4580], [540, 4600], [600, 4596], [620, 4650], [690, 4660], [700, 4604]]) { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fillStyle = rgba('#fff7e0', .95); ctx.fill(); }
    ctx.restore();
    wash(rectP(-60, 5440, 1140, 5560, 8), '#4a3a2c', .5 * wp, 23, 6);
  }
  const fa = 1 - ss(seg(t, 61.4, 62.2));
  if (fa > 0) {
    paint(OBJ.pharaoh, t, undefined, undefined, fa); paint(OBJ.seshat, t, undefined, undefined, fa);
    const k = eio(seg(t, 55.6, 57.0)), sag = lerp(60, 0, k), L = [];
    for (let i = 0; i <= 20; i++) { const x = lerp(320, 760, i / 20); L.push([x, 5262 + sag * Math.sin(Math.PI * i / 20)]); }
    if (t > 55.4) { ctx.save(); ctx.globalAlpha = fa * ss(seg(t, 55.4, 55.8)); cord(L); cord([[430, 5262], [430, 5400]], seg(t, 57.0, 57.3), { w: 4 }); cord([[650, 5262], [650, 5400]], seg(t, 57.2, 57.5), { w: 4 }); ctx.restore(); }
    OBJ.nstakes.forEach(o => paint(o, t, undefined, undefined, fa));
    note(t, 56.0, 61.4, 600, 4610, 640, 4500, 'Osa Mayor', { size: 40, col: '#f6ecd0', a: .95, lead: -4 });
  }
  mist(4900, 5600, ss(seg(t, 61.6, 62.4)), 6);
  if (off > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-100, lerp(5600, 4150, off), 1300, 1600); ctx.clip(); ctx.drawImage(PAPER_IMG, 0, 0);
    wash(rectP(-60, 4250, 1140, 5900, 8), DAWN, .42, 31, 10); wash(rectP(-60, 5200, 1140, 5900, 8), '#f3d7b0', .3, 32, 8); ctx.restore(); }
}
function scenePyramid(t) {
  if (t < 62) return;
  if (t > 63.4) { wash(rectP(-60, 4250, 1140, 5900, 8), DAWN, .42, 31, 10); wash(rectP(-60, 5200, 1140, 5900, 8), '#f3d7b0', .3, 32, 8); }
  paint(OBJ.sand, t);
  // rampa de adobe que sube con la obra, y se retira al final
  const built = clamp((t - 63.6) / (NC * .6)), ra = 1 - ss(seg(t, 72.4, 73.4));
  if (t > 63.4 && ra > 0) {
    const yt = PB - built * PH * .93, xt = 540 - pyrHalf(yt) - 6;
    ctx.save(); ctx.globalAlpha = ra; wash([[20, PB + 6], [xt, yt], [xt + 26, yt], [xt + 40, PB + 6]], '#a9875c', .55, 41, 4); ctx.restore();
    // un bloque sobre su trineo sube por la rampa, arrastrado por dos obreros
    if (t < 72.2) { const f = ((t - 63.6) / .6) % 1, bx = lerp(60, xt - 30, f), by = lerp(PB, yt, f), ang = Math.atan2(yt - PB, xt - 60);
      ctx.save(); ctx.translate(bx, by); ctx.rotate(ang); ctx.drawImage(OBJ.block.spr.cv, OBJ.block.spr.x0, OBJ.block.spr.y0);
      ctx.translate(130, 0); ctx.rotate(-ang); ctx.scale(.3, .3); ctx.drawImage(OBJ.worker.spr.cv, OBJ.worker.spr.x0, OBJ.worker.spr.y0); ctx.restore();
      ctx.save(); ctx.translate(bx, by); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(30, -10); ctx.lineTo(118, -10); ctx.strokeStyle = rgba(ACC, .7); ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore(); }
  }
  OBJ.courses.forEach(o => paint(o, t));
  // seked: 1 codo de subida, 5½ palmos hacia dentro
  const sa = 1 - ss(seg(t, 78.6, 79.2));
  if (t > 72.6 && sa > 0) {
    ctx.save(); ctx.globalAlpha = sa;
    const F = [740, PB - 280 * 0 - 0], top = PB - 280, xf = 540 + pyrHalf(top);
    cord([[xf, top], [xf, PB]], seg(t, 73.0, 73.6), { w: 5 });
    if (t > 73.6) { ctx.beginPath(); ctx.arc(xf, PB - 8, 9, 0, 7); ctx.fillStyle = rgba('#7d2416', .9); ctx.fill(); }
    const p2 = seg(t, 73.8, 74.2); ctx.beginPath(); ctx.moveTo(xf, PB); ctx.lineTo(lerp(xf, PX1, p2), PB); ctx.strokeStyle = rgba(INK, .9); ctx.lineWidth = 3; ctx.stroke();
    const p3 = seg(t, 74.2, 74.6); ctx.beginPath(); ctx.moveTo(PX1, PB); ctx.lineTo(lerp(PX1, xf, p3), lerp(PB, top, p3)); ctx.stroke();
    if (t > 74.8) { ctx.beginPath(); ctx.arc(PX1, PB, 64, Math.PI, Math.PI + Math.atan2(14, 11) * seg(t, 74.8, 75.2), false); ctx.lineWidth = 2; ctx.stroke(); }
    mono('1 codo = 7 palmos', xf - 18, PB - 140, seg(t, 73.8, 74.4), { size: 30, align: 'right' }, 'codo');
    mono('5½ palmos', (xf + PX1) / 2, PB + 46, seg(t, 74.2, 74.8), { size: 30, align: 'center' }, 'palm');
    hand('≈ 51.8°', (xf + PX1) / 2, PB + 100, seg(t, 75.4, 76.0), { size: 46, align: 'center' }, 'ang');
    ctx.restore();
  }
  // piramidión: destello dorado en la punta
  if (t > 79.6 && t < 81.6) {
    const k = seg(t, 79.6, 81.6);
    for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283 + hash(i) * .3, r = 30 + k * (140 + 80 * hash(i * 3)); ctx.beginPath(); ctx.arc(540 + Math.cos(a) * r, PAPEX + 20 + Math.sin(a) * r, 5 * (1 - k) + 2, 0, 7); ctx.fillStyle = rgba(GOLD, .9 * (1 - k)); ctx.fill(); }
  }
  if (t > 79.6) { ctx.save(); ctx.globalAlpha = .5 * fade2(t, 79.6, 84, .3, 1.5); const g = ctx.createRadialGradient(540, PAPEX + 16, 0, 540, PAPEX + 16, 120); g.addColorStop(0, rgba('#ffe6a0', .9)); g.addColorStop(1, rgba('#ffe6a0', 0)); ctx.fillStyle = g; ctx.fillRect(420, PAPEX - 104, 240, 240); ctx.restore(); }
  note(t, 79.9, 83.9, 548, PAPEX + 14, 620, PAPEX - 70, 'piramidión', { size: 40, lead: -6 });
}
function sceneScribe(t) {
  if (t < 85) return;
  const ma = ss(seg(t, 101.0, 103.4));
  paint(OBJ.scribe, t);
  note(t, 89.5, 100.6, 540, 7820, 700, 7700, 'escriba', { size: 44 });
  note(t, 90.2, 100.6, 470, 8066, 210, 8240, 'papiro', { size: 44, lead: 30, ly: -22 });
  note(t, 90.9, 100.6, 640, 8044, 650, 8250, 'cuerda de medir', { size: 44, ly: -22 });
  mist(7400, 8300, ma, 8);
  // la cuerda enrollada en las manos se desenrolla en una línea: el Nilo en calma
  const u = eio(seg(t, 103.0, 105.0)), P = [];
  for (let i = 0; i <= 80; i++) { const s = i / 80, a = s * 6.283 * 2.4, r = 6 + s * 34;
    const coil = [628 + Math.cos(a) * r, 8044 + Math.sin(a) * r * .6], line = [lerp(220, 860, s), 7960]; P.push([lerp(coil[0], line[0], u), lerp(coil[1], line[1], u)]); }
  if (t > 87.6) { ctx.save(); ctx.globalAlpha = ss(seg(t, 87.6, 88.4)); cord(P, 1, { w: 5 }); ctx.restore(); }
  hand("Ma'at", 540, 7820, seg(t, 103.8, 104.8), { font: 'Cormorant Garamond', w: 500, size: 110, align: 'center' }, 'maat');
  hand('el orden hecho con números', 540, 8060, seg(t, 104.5, 105.4), { size: 50, align: 'center', col: INK2 }, 'orden');
}
function subtitles(t) {
  const s = SUBS.find(c => t >= c[0] && t < c[1]); if (!s) return;
  const [a, b, l1, l2] = s, k = fade2(t, a, b, .45, .4);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = k;
  let size = 44; ctx.font = `italic 500 ${size}px "Cormorant Garamond"`;
  while (Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) > 740 && size > 32) { size -= 1; ctx.font = `italic 500 ${size}px "Cormorant Garamond"`; }
  { const g = ctx.createRadialGradient(540, 1528, 40, 540, 1528, 470); g.addColorStop(0, rgba(PAPER, .92)); g.addColorStop(.7, rgba(PAPER, .8)); g.addColorStop(1, rgba(PAPER, 0));
    ctx.save(); ctx.translate(540, 1528); ctx.scale(1, .2); ctx.translate(-540, -1528); ctx.fillStyle = g; ctx.fillRect(40, 1058, 1000, 940); ctx.restore(); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = rgba(PAPER, 1); ctx.shadowBlur = 16; ctx.fillStyle = rgba(INK, .82);
  [[l1, 1500], [l2, 1556]].forEach(([l, y], i) => { ctx.fillText(l, 540, y); ctx.fillText(l, 540, y);
    if (k > .6) { const w = ctx.measureText(l).width; rec(540 - w / 2, y - size * .45, 540 + w / 2, y + size * .45, 's' + a + i, l); } });
  ctx.restore();
}

function renderFrame(t, R = null) {
  REC = R;
  CAM = { y: camYk(t), s: camSk(t) };
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  setCam(); ctx.drawImage(PAPER_IMG, 0, 0);
  if (t < 33) sceneNile(t);
  if (t > 29 && t < 56) sceneGranary(t);
  sceneNight(t); if (t > 61) scenePyramid(t);
  sceneScribe(t);
  subtitles(t);
  REC = null;
}
window.render = t => renderFrame(t);
window.TEXTS = t => { const R = []; renderFrame(t, R); return R; };
(async () => {
  PAPER_IMG = new Image(); PAPER_IMG.src = 'paper.jpg'; await PAPER_IMG.decode();
  await Promise.all(['500 80px "Cormorant Garamond"', '600 80px "Cormorant Garamond"', 'italic 500 44px "Cormorant Garamond"', '600 40px Caveat', '400 34px "IBM Plex Mono"'].map(f => document.fonts.load(f)));
  build();
  window.READY = true;
})();
