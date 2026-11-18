// «El secreto de la hoja A4» · escenas de la lección alg-11c. Motor en kit.js y recta.js; guion en reales.data.js.
// La hoja es la imagen que se repite: un rectángulo de razón √2 que se dobla.
const SQ2 = Math.SQRT2;
// Hoja de lado corto s, de pie, con su esquina inferior izquierda en (x, y). k: trazado; o.col; o.label (nombre).
function sheet(x, y, s, o = {}) {
  const w = s, h = s * SQ2, col = o.col || C.cyan, k = o.k ?? 1;
  fade(o.fill ?? .07, () => { X.fillStyle = col; X.fillRect(x, y - h, w, h); });
  stroke(col, 3, () => { const per = 2 * (w + h), L = per * k; let left = L; const pts = [[x, y], [x, y - h], [x + w, y - h], [x + w, y], [x, y]]; X.moveTo(x, y); for (let i = 1; i < pts.length && left > 0; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), u = Math.min(1, left / d); X.lineTo(lerp(ax, bx, u), lerp(ay, by, u)); left -= d; } }, { g: 14 });
  if (o.label) fade(k, () => T(o.label, x + w / 2, y - h / 2 + 14, { k: 'r', s: Math.max(26, s * .16), a: 'c', c: col }));
}
const S = {
  // 1 · La hoja: A4 de pie; se dobla y la mitad (A5), acostada, es igual; A6, A7 anidadas.
  hoja(t) {
    stars(t, .4);
    const s0 = 360, x0 = CX - s0 * SQ2 / 2, y0 = 1180;
    // la A4 acostada (largo horizontal) y sus mitades sucesivas anidadas
    const levels = [['A4', C.cyan], ['A5', C.green], ['A6', C.amber], ['A7', C.mag], ['A8', C.violet]];
    let x = x0, y = y0, w = s0 * SQ2, h = s0;
    levels.forEach(([lab, col], i) => {
      const k = i === 0 ? eio(seg(t, .6, 2.4)) : eio(seg(t, 3 + i * 1.6, 4.4 + i * 1.6));
      if (k > 0) { fade(.08, () => { X.fillStyle = col; X.fillRect(x, y - h, w, h); }); stroke(col, 3, () => X.rect(x, y - h, w * (i ? 1 : k), h), { g: 14 }); fade(k, () => { const lx = w > h ? x + w * .75 : x + w / 2, ly = w > h ? y - h / 2 : y - h * .25; T(lab, lx, ly + 12, { k: 'r', s: Math.max(22, Math.min(w, h) * .2), a: 'c', c: col }); }); }
      // la siguiente es la mitad: se parte el lado largo
      if (w > h) { w = w / 2; } else { h = h / 2; y = y - h; }
    });
    const n = clamp(Math.floor((t - 3) / 1.6), 0, 4);
    T('dobleces = ' + n, 96, 1300, { k: 'mono', s: 26, c: C.amber, g: 8 });
    fade(A(t, 18.8, .6), () => T('largo ÷ corto = ?', 984, 1300, { k: 'mono', s: 26, c: C.mag, a: 'r', g: 8 }));
  },
  // 2 · La razón: la hoja y su mitad lado a lado; las dos ecuaciones; r² = 2; la A4 medida.
  razon(t) {
    stars(t, .4);
    fade(win(t, .5, 19.8), () => {
      const s = 260; sheet(160, 820, s, { col: C.cyan, label: 'hoja', k: eio(seg(t, .6, 2)) });
      sheet(600, 820, s / SQ2, { col: C.green, label: 'mitad', k: eio(seg(t, 1.6, 3)) });
      fade(A(t, 3, .5), () => { T('1', 160 + s / 2, 860, { k: 'r', s: 36, a: 'c', c: C.cyan }); T('r', 135, 820 - s * SQ2 / 2, { k: 'i', s: 40, a: 'r', c: C.cyan }); T('r/2', 600 + s / SQ2 / 2, 860, { k: 'r', s: 32, a: 'c', c: C.green }); T('1', 580, 820 - s / 2, { k: 'r', s: 36, a: 'r', c: C.green }); });
      fade(A(t, 5, .6), () => { F([['r', 'i', C.cyan], [' / 1', 'r']], 300, 960, 56); F([['1 / (', 'r'], ['r', 'i', C.green], ['/2)', 'r']], 760, 960, 56); });
      fade(A(t, 10.4, .6), () => { F([['r', 'i'], [' = 2/', 'r'], ['r', 'i']], CX, 1080, 72, { rev: seg(t, 10.6, 12) }); F([['r', 'i'], ['² = 2', 'r', C.amber]], CX, 1180, 96, { rev: seg(t, 13.4, 15) }); });
      fade(A(t, 16, .6), () => F([['r', 'i'], [' = √2', 'r', C.mag]], CX, 1290, 96));
    });
    fade(A(t, 20, .6), () => {
      const s = 300, x = CX - s / 2; sheet(x, 1060, s, { col: C.cyan });
      T('210 mm', CX, 1110, { k: 'mono', s: 26, a: 'c', c: C.ink }); T('297 mm', x - 24, 1060 - s * SQ2 / 2, { k: 'mono', s: 26, a: 'r', c: C.ink });
      const v = 297 / 210 * eio(seg(t, 20.6, 23.4));
      T('297 ÷ 210 = ' + v.toFixed(3), 96, 1300, { k: 'mono', s: 28, c: C.amber, g: 8 });
      fade(A(t, 23.6, .5), () => T('√2 = 1.414…', 984, 1300, { k: 'mono', s: 28, c: C.mag, a: 'r', g: 8 }));
    });
  },
  // 3 · Hipaso: el cuadrado de lado 1 y su diagonal; las olas.
  hipaso(t) {
    stars(t, .4);
    const s = 360, x = CX - s / 2, y = 900;
    fade(win(t, .5, 9.8), () => { ['1/2', '2/3', '3/4', '5/8', '7/10'].forEach((f, i) => fade(A(t, 1 + i * .6, .5), () => { const [n, d] = f.split('/'); FR(n, d, 200 + i * 170, 700, 64, [C.amber, C.green, C.violet, C.cyan, C.mag][i]); })); T('«toda medida es una fracción»', CX, 1000, { k: 'it', s: 46, a: 'c', c: '#ffd9a0' }); });
    fade(A(t, 10, .6), () => {
      stroke(C.cyan, 3, () => X.rect(x, y - s, s, s), { g: 14 });
      T('1', CX, y + 46, { k: 'r', s: 40, a: 'c', c: C.cyan }); T('1', x - 26, y - s / 2 + 14, { k: 'r', s: 40, a: 'r', c: C.cyan });
      const k = eio(seg(t, 11, 13)); stroke(C.mag, 4, () => { X.moveTo(x, y); X.lineTo(lerp(x, x + s, k), lerp(y, y - s, k)); }, { g: 20 });
      fade(A(t, 13, .5), () => T('√2', CX + 40, y - s / 2 - 10, { k: 'r', s: 56, c: C.mag, g: 14 }));
      fade(A(t, 14, .5), () => T('1² + 1² = 2', 96, 1300, { k: 'mono', s: 26, c: C.amber, g: 8 }));
    });
    // el mar
    fade(A(t, 19, .8), () => { for (let w = 0; w < 4; w++) stroke(hexA(C.blue, .7 - w * .14), 2.5, () => { for (let i = 0; i <= 80; i++) { const u = i / 80, xx = 80 + u * 920, yy = 1130 + w * 34 + 12 * Math.sin(u * 14 + t * 1.6 + w); i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } }, { g: 8 }); T('Metaponto · siglo V a. C.', 984, 1300, { k: 'mono', s: 24, c: C.mute, a: 'r' }); });
  },
  // 4 · La prueba: cada paso aparece; a y b se marcan pares; contradicción.
  prueba(t) {
    stars(t, .3);
    const steps = [
      [.8, [['√2', 'r'], [' = ', 'r'], ['a', 'i', C.amber], ['/', 'r'], ['b', 'i', C.cyan], ['   simplificada', 'it', C.mute]]],
      [3.4, [['2', 'r'], [' = ', 'r'], ['a', 'i', C.amber], ['²', 'r'], ['/', 'r'], ['b', 'i', C.cyan], ['²', 'r']]],
      [5.6, [['a', 'i', C.amber], ['²', 'r'], [' = 2', 'r'], ['b', 'i', C.cyan], ['²', 'r'], ['   ⟹   ', 'r'], ['a', 'i', C.amber], [' es par', 'it', C.amber]]],
      [11.2, [['a', 'i', C.amber], [' = 2', 'r'], ['c', 'i'], ['   ⟹   ', 'r'], ['4', 'r'], ['c', 'i'], ['²', 'r'], [' = 2', 'r'], ['b', 'i', C.cyan], ['²', 'r']]],
      [14.4, [['b', 'i', C.cyan], ['²', 'r'], [' = 2', 'r'], ['c', 'i'], ['²', 'r'], ['   ⟹   ', 'r'], ['b', 'i', C.cyan], [' es par', 'it', C.cyan]]],
    ];
    steps.forEach(([t0, p], i) => fade(A(t, t0, .6), () => F(p, 110, 460 + i * 130, 58, { a: 'l', rev: seg(t, t0, t0 + 1.6), max: 880 })));
    fade(A(t, 17.6, .6), () => F([['a', 'i', C.amber], [' y ', 'r'], ['b', 'i', C.cyan], [' pares: ', 'r'], ['a', 'i', C.amber], ['/', 'r'], ['b', 'i', C.cyan], [' se podía simplificar', 'it', C.red]], 110, 1110, 52, { a: 'l', max: 880 }));
    fade(A(t, 22.2, .6), () => { T('↯', CX, 1260, { k: 'r', s: 110, a: 'c', c: C.red, g: 20 }); T('√2 ∉ ℚ', CX, 1360, { k: 'r', s: 64, a: 'c', c: C.mag, g: 12 }); });
  },
  // 5 · El decimal: acorralar √2 en una recta que se acerca; cada paso, una cifra.
  decimal(t) {
    stars(t, .3);
    const levels = [[1, 2, 1], [1.4, 1.5, 2], [1.41, 1.42, 3], [1.414, 1.415, 4], [1.4142, 1.4143, 5]];
    const L = clamp(Math.floor((t - 1) / 3.6), 0, 4), [lo, hi, dg] = levels[L], z = eio(seg(t - 1 - L * 3.6, 0, 1));
    const plo = L ? levels[L - 1][0] : 1, phi = L ? levels[L - 1][1] : 2, a = lerp(plo, lo, z), b = lerp(phi, hi, z);
    const px = v => 140 + (v - a) / (b - a) * 800;
    stroke('rgba(225,232,255,.9)', 3, () => { X.moveTo(110, 760); X.lineTo(970, 760); }, { g: 6 });
    for (let i = 0; i <= 10; i++) { const v = a + (b - a) * i / 10, x = px(v); stroke('rgba(225,232,255,.9)', i % 10 ? 1.5 : 2.5, () => { X.moveTo(x, 748); X.lineTo(x, 772); }, { g: 0 }); }
    T(a.toFixed(dg), 140, 820, { k: 'r', s: 34, a: 'c', c: C.green }); T(b.toFixed(dg), 940, 820, { k: 'r', s: 34, a: 'c', c: C.red });
    const xs = px(SQ2); if (xs > 100 && xs < 980) { dot(xs, 760, 13, C.mag, 30); T('√2', xs, 700, { k: 'r', s: 44, a: 'c', c: C.mag }); }
    F([[lo.toFixed(dg - 1) + '²', 'r', C.green], [' = ' + (lo * lo).toFixed(Math.min(8, 2 * (dg - 1))), 'r'], ['  < 2 <  ', 'r'], [(hi * hi).toFixed(Math.min(8, 2 * (dg - 1))), 'r'], [' = ', 'r'], [hi.toFixed(dg - 1) + '²', 'r', C.red]], CX, 1000, 44, { max: 960 });
    T('√2 = ' + SQ2.toFixed(dg) + '…', 96, 1196, { k: 'mono', s: 28, c: C.amber, g: 8 });
    T('cifras = ' + dg, 984, 1196, { k: 'mono', s: 28, c: C.mute, a: 'r' });
    fade(A(t, 19, .6), () => T('1.41421356237309504880168872…', CX, 1110, { k: 'r', s: 44, a: 'c', c: C.mag, max: 960 }));
  },
  // 6 · Irracionales: √3, π y φ; luego un girasol que se arma con el ángulo de oro.
  irracionales(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => {
      T('𝕀', CX, 640, { k: 'r', s: 200, a: 'c', c: C.mag, g: 30 });
      [['√3', '1.7320508075…', C.cyan], ['π', '3.1415926535…', C.amber], ['φ', '1.6180339887…', C.green]].forEach(([s, v, col], i) => fade(A(t, 10 + i * 1.6, .5), () => { T(s, 300, 860 + i * 110, { k: 'r', s: 64, a: 'c', c: col, g: 12 }); T('= ' + v, 400, 860 + i * 110, { k: 'r', s: 50, c: C.ink }); }));
    });
    fade(A(t, 19, .6), () => {
      const n = Math.floor(lerp(0, 700, eio(seg(t, 19.2, 27)))), cx = CX, cy = 760, ga = D.GOLDEN * Math.PI / 180;
      for (let i = 0; i < n; i++) { const r = 12 * Math.sqrt(i), a = i * ga, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); X.fillStyle = i < n - 6 ? (i % 3 ? '#ffc247' : '#ff9a3c') : C.ink; X.beginPath(); X.arc(x, y, 4.2, 0, 7); X.fill(); }
      T('semillas = ' + n, 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 }); T('giro = 137.5°', 984, 1196, { k: 'mono', s: 26, c: C.green, a: 'r', g: 8 });
    });
  },
  // 7 · ℝ = ℚ ∪ 𝕀: dos mitades de un rectángulo que se juntan; la intersección vacía.
  reales(t) {
    stars(t, .3);
    const j = eio(seg(t, 1, 3.4)), gap = lerp(140, 0, j);
    X.save(); X.fillStyle = hexA(C.green, .1); X.fillRect(120 - gap, 480, 420, 520); X.fillStyle = hexA(C.mag, .1); X.fillRect(540 + gap, 480, 420, 520); X.restore();
    stroke(C.green, 3, () => X.rect(120 - gap, 480, 420, 520), { g: 12 }); stroke(C.mag, 3, () => X.rect(540 + gap, 480, 420, 520), { g: 12 });
    T('ℚ', 330 - gap, 560, { k: 'r', s: 72, a: 'c', c: C.green, g: 14 }); T('𝕀', 750 + gap, 560, { k: 'r', s: 72, a: 'c', c: C.mag, g: 14 });
    ['2', '−5', '7/10', '0.75', '1/7'].forEach((s, i) => T(s, 330 - gap + (i % 2 ? 80 : -80), 680 + i * 60, { k: 'r', s: 40, a: 'c', c: C.ink }));
    ['√2', 'π', 'φ', '√3', '−√5'].forEach((s, i) => T(s, 750 + gap + (i % 2 ? 80 : -80), 680 + i * 60, { k: 'r', s: 40, a: 'c', c: C.ink }));
    fade(A(t, 3.6, .6), () => { stroke(C.violet, 3, () => X.rect(100, 460, 880, 560), { g: 16 }); T('ℝ', 940, 520, { k: 'r', s: 64, a: 'r', c: C.violet, g: 14 }); });
    fade(A(t, 5, .6), () => F([['ℝ', 'r', C.violet], [' = ', 'r'], ['ℚ', 'r', C.green], [' ∪ ', 'r'], ['𝕀', 'r', C.mag]], CX, 1130, 96));
    fade(A(t, 10.4, .6), () => { stroke(C.amber, 3, () => { X.moveTo(540, 450); X.lineTo(540, 1030); }, { dash: [10, 8], g: 12 }); F([['ℚ', 'r', C.green], [' ∩ ', 'r'], ['𝕀', 'r', C.mag], [' = ∅', 'r', C.amber]], CX, 1270, 80); });
  },
  // 8 · Las familias anidadas: ℕ dentro de ℤ dentro de ℚ, y 𝕀 al lado, todo dentro de ℝ.
  cadena(t) {
    stars(t, .3);
    const fam = [[CX, 760, 470, 380, 'ℝ', C.violet, .4, CX + 400, 430], [CX - 120, 790, 300, 290, 'ℚ', C.green, 1.4, CX + 70, 560], [CX - 160, 820, 210, 210, 'ℤ', C.cyan, 2.4, CX - 20, 660], [CX - 190, 850, 120, 130, 'ℕ', C.amber, 3.4, CX - 120, 760]];
    fam.forEach(([x, y, rx, ry, l, col, t0, lx, ly]) => family(x, y, rx, ry, l, col, eio(seg(t, t0, t0 + 1.4)), { lx, ly, ls: 56 }));
    fade(A(t, 10.2, .8), () => { family(CX + 300, 780, 130, 300, '𝕀', C.mag, eio(seg(t, 10.2, 12)), { lx: CX + 300, ly: 520, ls: 56 }); ['√2', 'π', 'φ'].forEach((s, i) => T(s, CX + 300, 680 + i * 100, { k: 'r', s: 44, a: 'c', c: C.ink })); });
    [['3', CX - 190, 900], ['−4', CX - 280, 760], ['5/8', CX - 30, 960], ['0.4', CX + 30, 650]].forEach(([s, x, y], i) => fade(A(t, 5 + i * .4, .4), () => T(s, x, y, { k: 'r', s: 40, a: 'c', c: C.ink })));
    fade(A(t, 6, .6), () => F([['ℕ', 'r', C.amber], [' ⊆ ', 'r'], ['ℤ', 'r', C.cyan], [' ⊆ ', 'r'], ['ℚ', 'r', C.green], [' ⊆ ', 'r'], ['ℝ', 'r', C.violet]], CX, 1260, 84));
  },
  // 9 · La recta real: llena; la hoja acostada lleva √2 a su punto; los puntos medios no se acaban.
  recta(t) {
    stars(t, .3);
    const px = nline(110, 990, 900, -1, 3, { k: eio(seg(t, .6, 2.4)), step: .25, lab: v => Math.abs(v - Math.round(v)) < 1e-9, s: 34 });
    fade(A(t, 2.4, .5), () => { const n = Math.floor(lerp(0, 400, eio(seg(t, 2.6, 8)))), R = rng(9); for (let i = 0; i < n; i++) { const v = -1 + R() * 4; X.fillStyle = hexA([C.green, C.mag, C.cyan, C.amber][i % 4], .8); X.fillRect(px(v) - 1, 893, 2, 14); } });
    if (t > 9.8 && t < 20) {
      // la hoja de corto 1 (de 0 a 1) con su largo que se acuesta sobre la recta
      const u = px(1) - px(0), a = -Math.PI / 2 * (1 - eio(seg(t, 12, 15.4)));
      stroke(C.cyan, 3, () => X.rect(px(0), 900 - u * SQ2, u, u * SQ2), { g: 12 });
      stroke(C.mag, 4, () => { X.moveTo(px(0), 900); X.lineTo(px(0) + u * SQ2 * Math.cos(a), 900 + u * SQ2 * Math.sin(a)); }, { g: 18 });
      stroke(hexA(C.mag, .5), 2, () => X.arc(px(0), 900, u * SQ2, -Math.PI / 2, a), { dash: [6, 8], g: 0 });
      fade(A(t, 15.4, .5), () => { dot(px(SQ2), 900, 13, C.mag, 30); T('√2', px(SQ2), 1010, { k: 'r', s: 52, a: 'c', c: C.mag, g: 12 }); });
    }
    if (t >= 20) {
      let a = 1, b = 2; const n = clamp(Math.floor((t - 20.4) / 1.4) + 1, 0, 6);
      for (let i = 0; i < n; i++) { const m = (a + b) / 2; dot(px(m), 900, 10 - i, C.amber, 24); stroke(hexA(C.amber, .5), 2, () => { X.moveTo(px(m), 860); X.lineTo(px(m), 940); }, { g: 0 }); b = m; }
      dot(px(1), 900, 11, C.green, 20); dot(px(2), 900, 11, C.green, 20);
      T('puntos medios = ' + n, 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
      fade(A(t, 22, .5), () => T('entre 1 y ' + (1 + 1 / Math.pow(2, Math.max(1, n))).toFixed(Math.min(6, n + 1)) + ' todavía caben infinitos', CX, 1100, { k: 'mono', s: 25, c: C.mute, a: 'c' }));
    }
  },
  // 10 · Cierre: la hoja se dobla una vez más; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { const s = 280; fade(.05, () => { X.fillStyle = C.cyan; X.fillRect(CX - s * SQ2 / 2, 900 - s, s * SQ2, s); }); stroke(C.cyan, 3, () => X.rect(CX - s * SQ2 / 2, 900 - s, s * SQ2, s), { g: 14 }); stroke(C.mag, 3, () => { X.moveTo(CX, 900 - s); X.lineTo(CX, 900); }, { dash: [10, 8], g: 14 }); T('largo ÷ corto = √2', CX, 1020, { k: 'mono', s: 28, c: C.mag, a: 'c', g: 10 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['√2', 'r', C.mag], [' ∉ ', 'r'], ['ℚ', 'r', C.green]], 'irracional'], [[['ℝ', 'r', C.violet], [' = ', 'r'], ['ℚ', 'r', C.green], [' ∪ ', 'r'], ['𝕀', 'r', C.mag]], 'los reales'], [[['ℚ', 'r', C.green], [' ∩ ', 'r'], ['𝕀', 'r', C.mag], [' = ∅', 'r']], 'sin números en común'], [[['ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ', 'r']], 'las familias']], 420, 170, 54);
      endCard(t, 19.6, D.TITLE, D.LINE, [C.cyan, C.mag, C.violet]);
    });
  },
};
