// «Las campanadas» · escenas de la lección alg-14b. Motor en kit.js y sigma.js; guion en sumaarit.data.js.
// La fila al derecho en ámbar, al revés en cian, las parejas y los totales en verde, lo nuevo de cada paso en rosa.
const FW = C.amber, BW = C.cyan, PR = C.green, NW = C.mag;
// Una campana sencilla en (x, y) de tamaño s; si sw > 0 se balancea.
function bell(x, y, s, col = FW, sw = 0) { X.save(); X.translate(x, y); X.rotate(sw); stroke(col, 3, () => { X.moveTo(-s * .5, s * .5); X.quadraticCurveTo(-s * .45, -s * .5, 0, -s * .55); X.quadraticCurveTo(s * .45, -s * .5, s * .5, s * .5); X.closePath(); }, { g: 14 }); dot(0, s * .62, s * .1, col, 10); X.restore(); }
// Reloj de esfera en (x, y), radio r, marcando la hora h.
function clock(x, y, r, h) { ring(x, y, r, FW, 3, 1); for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; T(String(i), x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8 + 10, { k: 'r', s: r * .18, a: 'c', c: C.mute }); } const a = -Math.PI / 2 + h * Math.PI / 6; stroke(C.ink, 4, () => { X.moveTo(x, y); X.lineTo(x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55); }, { g: 8 }); stroke(C.ink, 2.5, () => { X.moveTo(x, y); X.lineTo(x, y - r * .75); }, { g: 6 }); }
// Fila de números 1..n como fichas en y; dir = −1 al revés.
function numrow(y, n, col, dir = 1, k = 1, w = 74) { const x0 = CX - (n * w) / 2; for (let i = 0; i < n; i++) fade(clamp(k * n - i), () => chip(x0 + i * w + w / 2, y, w - 8, 60, col, String(dir > 0 ? i + 1 : n - i), { s: 30, c: col })); return i => x0 + i * w + w / 2; }
const S = {
  // 1 · El reloj: a la hora h suenan h campanadas; contar todo medio día.
  reloj(t) {
    stars(t, .5);
    const h = 1 + Math.floor(seg(t, 1, 17) * 11.99), ring_ = t % 1 < .5;
    clock(330, 700, 190, h);
    for (let i = 0; i < h; i++) bell(620 + (i % 4) * 100, 560 + Math.floor(i / 4) * 130, 60, FW, ring_ && i === h - 1 ? .2 : 0);
    T('hora ' + h + ' · ' + h + (h > 1 ? ' campanadas' : ' campanada'), CX, 1000, { k: 'mono', s: 30, c: FW, a: 'c', g: 8 });
    fade(A(t, 9.8, .6), () => { const s = h * (h + 1) / 2; T('total = ' + s, 96, 1300, { k: 'mono', s: 26, c: PR, g: 8 }); F([['1 + 2 + 3 + … + ', 'r'], [String(h), 'r', FW]], CX, 1120, 56); });
  },
  // 2 · Parejas: 1 con 12, 2 con 11…; seis parejas de 13.
  parejas(t) {
    stars(t, .3);
    const px = numrow(640, 12, FW, 1, seg(t, .8, 3));
    for (let i = 0; i < 6; i++) fade(A(t, 3 + i * .9, .4), () => { const a = px(i), b = px(11 - i), hh = 250 - i * 38; stroke(PR, 2.5, () => { X.moveTo(a, 600); X.bezierCurveTo(a, 600 - hh, b, 600 - hh, b, 600); }, { g: 10 }); T('13', (a + b) / 2, 600 - hh * .75 - 6, { k: 'r', s: 22, a: 'c', c: PR }); });
    fade(A(t, 10.2, .6), () => { for (let i = 0; i < 6; i++) chip(200 + i * 136, 860, 116, 70, PR, '13', { s: 36, c: PR }); F([['6 · 13 = ', 'r'], ['78', 'r', PR]], CX, 1010, 72); });
    fade(A(t, 20.2, .6), () => F([['2 · 78 = ', 'r'], ['156', 'r', PR], [' en un día', 'it', C.mute]], CX, 1130, 64));
  },
  // 3 · Al derecho y al revés: dos filas; cada columna suma 13.
  derecho(t) {
    stars(t, .3);
    const p1 = numrow(600, 12, FW, 1, seg(t, .8, 3)); numrow(680, 12, BW, -1, seg(t, 3, 5.4));
    fade(A(t, 10.2, .6), () => { for (let i = 0; i < 12; i++) fade(A(t, 10.4 + i * .2, .3), () => { stroke(hexA(PR, .6), 2, () => { X.moveTo(p1(i), 720); X.lineTo(p1(i), 750); }, { g: 0 }); T('13', p1(i), 790, { k: 'r', s: 30, a: 'c', c: PR }); }); });
    fade(A(t, 13.4, .5), () => F([['2', 'r'], ['S', 'i'], [' = 12 · 13 = 156', 'r']], CX, 940, 64));
    fade(A(t, 20.2, .6), () => F([['S', 'i'], [' = 156 / 2 = ', 'r'], ['78', 'r', PR]], CX, 1060, 72));
  },
  // 4 · La fórmula: n veces el promedio; barras que se nivelan en el promedio.
  formula(t) {
    stars(t, .3);
    const vals = [3, 5, 7, 9, 11, 13], avg = 8, m = eio(seg(t, 10.6, 13.6)), u = 34;
    vals.forEach((v, i) => { const h = lerp(v, avg, m) * u; bar(250 + i * 100, 1000 - h, 70, h, i === 0 || i === 5 ? FW : BW, 1, { fill: .25 }); T(String(v), 285 + i * 100, 1050, { k: 'r', s: 30, a: 'c', c: C.ink }); });
    fade(A(t, 13.6, .5), () => { stroke(PR, 3, () => { X.moveTo(230, 1000 - avg * u); X.lineTo(870, 1000 - avg * u); }, { g: 12, dash: [10, 8] }); T('promedio = (3 + 13) / 2 = 8', CX, 1000 - avg * u - 24, { k: 'mono', s: 24, a: 'c', c: PR }); });
    F([['S', 'i'], ['ₙ = ', 'r'], ['n', 'i'], [' · ', 'r'], ['(', 'r'], ['a', 'i', FW], ['₁ + ', 'r', FW], ['a', 'i', FW], ['ₙ', 'r', FW], [') / 2', 'r']], CX, 480, 64);
    fade(A(t, 19.2, .6), () => F([['S', 'i'], ['ₙ = ', 'r'], ['n', 'i'], ['(2', 'r'], ['a', 'i'], ['₁ + (', 'r'], ['n', 'i'], [' − 1)', 'r'], ['d', 'i', BW], [') / 2', 'r']], CX, 1180, 54));
  },
  // 5 · Los bolos: triángulo de 1 + 2 + 3 + 4; números triangulares.
  bolos(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { for (let r = 0; r < 4; r++) for (let j = 0; j <= r; j++) fade(A(t, 1 + r * .6, .4), () => { const x = CX + (j - r / 2) * 110, y = 520 + r * 120; stroke(FW, 3, () => { X.ellipse(x, y, 22, 40, 0, 0, 7); }, { g: 12 }); }); T('1 + 2 + 3 + 4 = 10', CX, 1060, { k: 'r', s: 56, a: 'c', c: FW }); });
    fade(A(t, 10, .6), () => {
      [1, 2, 3, 4, 5].forEach((n, i) => fade(A(t, 10.2 + i * .6, .4), () => { const cx = 150 + i * 200 - (i ? 0 : 0); for (let r = 0; r < n; r++) for (let j = 0; j <= r; j++) dot(cx + (j - r / 2) * 26, 560 + r * 26, 8, i % 2 ? BW : FW, 12); T(String(n * (n + 1) / 2), cx, 760, { k: 'r', s: 44, a: 'c', c: PR }); }));
      fade(A(t, 19.2, .6), () => F([['T', 'i'], ['ₙ = ', 'r'], ['n', 'i'], ['(', 'r'], ['n', 'i'], [' + 1) / 2', 'r']], CX, 960, 72));
    });
  },
  // 6 · Una pila que baja: troncos de 20 a 5; 16 filas; 200.
  troncos(t) {
    stars(t, .3);
    const rows = Math.floor(16 * seg(t, 1, 7)), r = 14;
    for (let i = 0; i < rows; i++) { const n = 20 - i, y = 1120 - i * 2 * r * .87; for (let j = 0; j < n; j++) ring(CX + (j - (n - 1) / 2) * 2 * r, y, r - 1, FW, 2, 1, { g: 4 }); }
    T('filas = ' + rows, 96, 1300, { k: 'mono', s: 26, c: BW, g: 8 });
    fade(A(t, 10.2, .6), () => F([['20 − 5 = 15', 'r'], [' saltos  →  ', 'it', C.mute], ['16', 'r', BW], [' filas', 'r']], CX, 520, 48));
    fade(A(t, 20.2, .6), () => F([['16 · (20 + 5) / 2 = ', 'r'], ['200', 'r', PR]], CX, 440, 56));
  },
  // 7 · Los impares: escuadras que agrandan el cuadrado: 1, 4, 9, 16, 25.
  impares(t) {
    stars(t, .3);
    const n = Math.min(5, 1 + Math.floor(seg(t, 1, 16) * 5)), u = 80, x0 = CX - 2.5 * u, y0 = 440;
    for (let k = 0; k < n; k++) { const col = k % 2 ? BW : FW; for (let i = 0; i <= k; i++) { bar(x0 + i * u + 4, y0 + k * u + 4, u - 8, u - 8, col, 1, { fill: .3 }); if (i < k) bar(x0 + k * u + 4, y0 + i * u + 4, u - 8, u - 8, col, 1, { fill: .3 }); } }
    T(Array.from({ length: n }, (_, i) => 2 * i + 1).join(' + ') + ' = ' + n * n, CX, 1000, { k: 'r', s: 48, a: 'c', c: C.ink });
    fade(A(t, 10.2, .6), () => T('cada impar: una escuadra', CX, 1070, { k: 'mono', s: 26, a: 'c', c: NW }));
    fade(A(t, 20.2, .6), () => F([['n', 'i'], ['(1 + 2', 'r'], ['n', 'i'], [' − 1) / 2 = ', 'r'], ['n', 'i', PR], ['²', 'r', PR]], CX, 1180, 64));
  },
  // 8 · Del 1 al 1 000: 1 000 · 1 001 / 2 = 500 500.
  mil(t) {
    stars(t, .3);
    const k = seg(t, 1, 8), n = Math.floor(1000 * k);
    for (let i = 0; i < Math.min(n, 1000); i++) { X.fillStyle = hexA(i < 500 ? FW : BW, .6); X.fillRect(140 + (i % 40) * 20, 420 + Math.floor(i / 40) * 20, 14, 14); }
    T('términos = ' + n, 96, 1000, { k: 'mono', s: 26, c: FW, g: 8 });
    fade(A(t, 10.2, .6), () => F([['1 000 · 1 001 / 2 = ', 'r'], ['500 500', 'r', PR]], CX, 1100, 60));
    fade(A(t, 19.2, .6), () => T('primero, último y cuántos', CX, 1200, { k: 'mono', s: 28, a: 'c', c: C.mute }));
  },
  // 9 · Contar los términos: 7, 10, …, 52; 15 saltos y 16 términos.
  contar(t) {
    stars(t, .3);
    const px = nline(110, 990, 720, 4, 56, { step: 1, lab: v => v === 7 || v === 52 || v % 10 === 0, s: 24 });
    const k = seg(t, 1, 8), n = Math.floor(15 * k);
    for (let i = 0; i < n; i++) hop(px(7 + 3 * i), px(10 + 3 * i), 720, 34, BW, 1, 2);
    for (let i = 0; i <= n; i++) dot(px(7 + 3 * i), 720, 7, FW, 12);
    fade(A(t, 10.2, .6), () => { F([['(52 − 7) ÷ 3 = ', 'r'], ['15', 'r', BW], [' saltos', 'it']], CX, 900, 52); F([['15 + 1 = ', 'r'], ['16', 'r', FW], [' términos', 'it']], CX, 980, 52); });
    fade(A(t, 20.2, .6), () => F([['16 · (7 + 52) / 2 = ', 'r'], ['472', 'r', PR]], CX, 1120, 60));
  },
  // 10 · Cierre: el reloj y sus campanas; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { clock(CX, 700, 200, (t * .8) % 12); T('156 campanadas al día', CX, 1010, { k: 'r', s: 56, a: 'c', c: PR, g: 12 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['S', 'i'], ['ₙ = ', 'r'], ['n', 'i'], ['(', 'r'], ['a', 'i'], ['₁ + ', 'r'], ['a', 'i'], ['ₙ)/2', 'r']], 'n veces el promedio'], [[['1 + 2 + … + 12 = 78', 'r', FW]], 'parejas de 13'], [[['n', 'i'], ['(', 'r'], ['n', 'i'], [' + 1)/2', 'r']], 'triangulares'], [[['1 + 3 + … = ', 'r'], ['n', 'i'], ['²', 'r']], 'impares']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [FW, PR, BW]);
    });
  },
};
