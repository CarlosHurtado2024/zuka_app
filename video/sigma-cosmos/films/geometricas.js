// «La raíz doce de dos» · escenas de la lección alg-14c. Motor en kit.js y sigma.js; guion en geometricas.data.js.
// Las notas La y los términos en ámbar, la razón en cian, los medios en verde, los negativos en rosa.
const LA = C.amber, RZ = C.cyan, MD = C.green, NG = C.mag;
// Teclado de n teclas blancas desde x0, y0; lit: índices de teclas blancas encendidas (con su color).
function keyboard(x0, y0, n, w, h, lit = {}) {
  for (let i = 0; i < n; i++) { const c = lit[i]; if (c) { X.save(); X.fillStyle = hexA(c, .35); X.fillRect(x0 + i * w, y0, w, h); X.restore(); } stroke(c || 'rgba(225,232,255,.7)', c ? 3 : 1.5, () => X.rect(x0 + i * w, y0, w, h), { g: c ? 12 : 0 }); }
  for (let i = 0; i < n - 1; i++) { const m = i % 7; if (m === 2 || m === 6) continue; X.save(); X.fillStyle = '#0a0d1c'; X.fillRect(x0 + (i + 1) * w - w * .3, y0, w * .6, h * .6); X.restore(); stroke('rgba(225,232,255,.6)', 1.5, () => X.rect(x0 + (i + 1) * w - w * .3, y0, w * .6, h * .6), { g: 0 }); }
}
// Onda de frecuencia relativa f, centrada en y, entre x0 y x1.
function wave(x0, x1, y, amp, f, col, ph = 0) { stroke(col, 2.5, () => { for (let x = x0; x <= x1; x += 3) { const yy = y + amp * Math.sin((x - x0) / (x1 - x0) * Math.PI * 2 * f + ph); x === x0 ? X.moveTo(x, yy) : X.lineTo(x, yy); } }, { g: 10 }); }
const S = {
  // 1 · El piano: las notas La a 55, 110, 220, 440 y 880 Hz; cada una vibra el doble.
  piano(t) {
    stars(t, .5);
    const lit = {}; [0, 7, 14, 21, 28].forEach((k, i) => { if (t > 1 + i * .6) lit[k + 5] = LA; });
    keyboard(80, 920, 35, 26, 200, lit);
    const fs = [55, 110, 220, 440, 880];
    fs.forEach((f, i) => fade(A(t, 1 + i * .6, .4), () => { T(f + ' Hz', 80 + (i * 7 + 5.5) * 26, 880, { k: 'r', s: 26, a: 'c', c: LA }); wave(140, 940, 440 + i * 85, 28, Math.pow(2, i) * 1.5, hexA(LA, .4 + i * .12), t * 4); }));
    fade(A(t, 9.8, .6), () => { for (let i = 0; i < 4; i++) T('× 2', 80 + (i * 7 + 9) * 26, 1180, { k: 'r', s: 30, a: 'c', c: RZ }); });
  },
  // 2 · La razón: 880 ÷ 440 = 2; con r = 1/3 los términos se achican.
  razon(t) {
    stars(t, .3);
    fade(win(t, .5, 18.8), () => { [55, 110, 220, 440, 880].forEach((v, i) => fade(A(t, 1 + i * .4, .3), () => { chip(150 + i * 195, 640, 170, 90, LA, String(v), { s: 40, c: LA }); if (i) T('× 2', 55 + i * 195, 580, { k: 'r', s: 30, a: 'c', c: RZ }); })); fade(A(t, 10.2, .6), () => F([['r', 'i', RZ], [' = 880 ÷ 440 = ', 'r'], ['2', 'r', RZ]], CX, 860, 72)); });
    fade(A(t, 19, .6), () => { [81, 27, 9, 3, 1].forEach((v, i) => { const s = 30 + v * 1.4; chip(150 + i * 195, 700, Math.min(170, s * 1.5), Math.max(60, Math.min(140, s)), MD, String(v), { s: 36, c: MD }); if (i) T('× ⅓', 55 + i * 195, 600, { k: 'r', s: 30, a: 'c', c: RZ }); }); F([['r', 'i', RZ], [' = 27 ÷ 81 = ', 'r'], ['1/3', 'r', RZ]], CX, 900, 64); });
  },
  // 3 · El término general: n − 1 multiplicaciones; 55 · 2⁶ = 3 520 Hz, el La más agudo.
  general(t) {
    stars(t, .3);
    for (let i = 0; i < 7; i++) fade(A(t, 1 + i * .4, .3), () => { const x = 140 + i * 133; dot(x, 640, 12, LA, 20); T(i === 6 ? 'a₇' : 'a' + '₁₂₃₄₅₆'[i], x, 700, { k: 'i', s: 30, a: 'c', c: LA }); if (i) { hop(x - 133, x, 640, 50, RZ, 1, 2.5); T('× r', x - 66, 570, { k: 'r', s: 24, a: 'c', c: RZ }); } });
    fade(A(t, 10.2, .6), () => F([['a', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁ · ', 'r'], ['r', 'i', RZ], ['ⁿ⁻¹', 'r', RZ]], CX, 860, 84));
    fade(A(t, 20.2, .6), () => { F([['55 · ', 'r', LA], ['2', 'r', RZ], ['⁶', 'r', RZ], [' = ', 'r'], ['3 520 Hz', 'r', MD]], CX, 1020, 64); T('el La más agudo del piano', CX, 1090, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
  },
  // 4 · Sumar o multiplicar: barras de 2n contra 2ⁿ.
  crecer(t) {
    stars(t, .3);
    const n = Math.min(8, 1 + Math.floor(seg(t, 1, 16) * 8)), base = 1150, sc = 600 / 256;
    for (let i = 1; i <= n; i++) { const x = 160 + (i - 1) * 100; bar(x, base - 2 * i * sc, 30, 2 * i * sc, RZ, 1, { fill: .3 }); bar(x + 34, base - 2 ** i * sc, 30, 2 ** i * sc, LA, 1, { fill: .3 }); T(String(i), x + 32, base + 36, { k: 'mono', s: 20, a: 'c', c: C.mute }); }
    T('+ 2: ' + 2 * n, 140, 480, { k: 'mono', s: 30, c: RZ, g: 8 }); T('× 2: ' + num(2 ** n), 940, 480, { k: 'mono', s: 30, a: 'r', c: LA, g: 8 });
    fade(A(t, 19.2, .6), () => F([['término 20:  ', 'it', C.mute], ['40', 'r', RZ], ['  contra  ', 'it', C.mute], ['1 048 576', 'r', LA]], CX, 1290, 48));
  },
  // 5 · Medios geométricos: las 12 teclas entre los dos La; r¹² = 2.
  medios(t) {
    stars(t, .3);
    const n = Math.min(13, Math.floor(seg(t, 1, 8) * 13) + 1), x0 = 120, w = 70;
    for (let i = 0; i < 13; i++) { const f = 220 * Math.pow(2, i / 12), on = i < n, end = i === 0 || i === 12; const h = f * .8; fade(on ? 1 : .2, () => { bar(x0 + i * w, 1000 - h, w - 10, h, end ? LA : MD, 1, { fill: .25 }); T(String(Math.round(f)), x0 + i * w + (w - 10) / 2, 1040, { k: 'r', s: 22, a: 'c', c: end ? LA : MD }); }); if (i && on && t > 10) T('× r', x0 + i * w - 6, 1000 - h - 20, { k: 'r', s: 18, a: 'c', c: RZ }); }
    T('11 medios', CX, 520, { k: 'mono', s: 30, a: 'c', c: MD });
    fade(A(t, 10.2, .6), () => F([['220 · ', 'r', LA], ['r', 'i', RZ], ['¹²', 'r', RZ], [' = 440', 'r', LA], ['   ⟹   ', 'r'], ['r', 'i', RZ], ['¹² = 2', 'r']], CX, 1160, 52));
    fade(A(t, 20.2, .6), () => F([['r', 'i', RZ], [' = ¹²√2 ≈ ', 'r'], ['1.0595', 'r', RZ]], CX, 1250, 56));
  },
  // 6 · China, 1584: Zhu Zaiyu; Stevin; el temperamento igual.
  zhu(t) {
    stars(t, .4);
    const digits = '1.059463094359295', n = Math.floor(digits.length * seg(t, 1.4, 8));
    T(digits.slice(0, n), CX, 700, { k: 'r', s: 80, a: 'c', c: RZ, g: 14 });
    fade(A(t, 1, .6), () => T('Zhu Zaiyu · 1584', CX, 560, { k: 'mono', s: 28, a: 'c', c: LA }));
    fade(A(t, 10.2, .6), () => T('Simon Stevin · hacia 1605', CX, 820, { k: 'mono', s: 28, a: 'c', c: LA }));
    fade(A(t, 19.2, .6), () => { keyboard(140, 920, 15, 54, 200, {}); for (let i = 0; i < 12; i++) T('× ¹²√2', 160 + i * 66, 1180, { k: 'r', s: 16, a: 'c', c: RZ }); });
  },
  // 7 · La nota del medio: √(220 · 440) ≈ 311, no 330.
  media(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, 200, 460, { step: 20, lab: v => v % 40 === 0, s: 22 });
    dot(px(220), 760, 12, LA, 20); dot(px(440), 760, 12, LA, 20); T('220', px(220), 700, { k: 'r', s: 34, a: 'c', c: LA }); T('440', px(440), 700, { k: 'r', s: 34, a: 'c', c: LA });
    fade(A(t, 2, .5), () => { for (let i = 1; i < 12; i++) { const f = 220 * Math.pow(2, i / 12); stroke(hexA(MD, i === 6 ? 1 : .4), i === 6 ? 3 : 1.5, () => { X.moveTo(px(f), 740); X.lineTo(px(f), 780); }, { g: i === 6 ? 12 : 0 }); } });
    fade(A(t, 10.2, .6), () => { dot(px(311.13), 760, 13, MD, 26); T('311', px(311.13), 840, { k: 'r', s: 36, a: 'c', c: MD }); F([['√(220 · 440) ≈ ', 'r'], ['311', 'r', MD]], CX, 980, 60); });
    fade(A(t, 19.2, .6), () => { dot(px(330), 760, 10, NG, 18); T('330', px(330), 900, { k: 'r', s: 32, a: 'c', c: NG }); F([['(220 + 440)/2 = ', 'r'], ['330', 'r', NG], ['  promedio', 'it', C.mute]], CX, 1080, 48); });
  },
  // 8 · Razón negativa: 3, −6, 12, −24, 48 saltan de un lado al otro.
  alterna(t) {
    stars(t, .3);
    const px = nline(80, 1000, 760, -52, 52, { step: 4, lab: v => v === 0, s: 20 });
    const vals = [3, -6, 12, -24, 48], k = seg(t, 1, 9) * 4, i = Math.min(3, Math.floor(k));
    for (let j = 0; j < Math.min(4, Math.floor(k)); j++) hop(px(vals[j]), px(vals[j + 1]), 760, 70 + j * 40, j % 2 ? LA : NG, 1, 2.5);
    if (k < 4) hop(px(vals[i]), px(vals[i + 1]), 760, 70 + i * 40, i % 2 ? LA : NG, k - i, 3);
    vals.slice(0, Math.min(5, Math.floor(k) + 1)).forEach((v, j) => { dot(px(v), 760, 10, v > 0 ? LA : NG, 18); T(String(v).replace('-', '−'), px(v), 840, { k: 'r', s: 28, a: 'c', c: v > 0 ? LA : NG }); });
    fade(A(t, 10.2, .6), () => F([['r', 'i', RZ], [' = −2', 'r', RZ]], CX, 1000, 72));
    fade(A(t, 19.2, .6), () => T('mismo tamaño que con r = 2; el signo se alterna', CX, 1100, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 9 · La curva: puntos (n, 55 · 2ⁿ⁻¹) que se empinan; con r = 1/2 bajan hacia 0.
  curva(t) {
    stars(t, .3);
    const x0 = 180, y0 = 1180, sx = 120;
    axes(x0, y0, 760, 700, 'n', 'aₙ', 1);
    if (t < 20) { for (let n = 1; n <= 6; n++) fade(A(t, 1 + n * .5, .3), () => { const v = 55 * 2 ** (n - 1), y = y0 - v * 640 / 1760; dot(x0 + n * sx, y, 10, LA, 18); T(String(v), x0 + n * sx, y - 24, { k: 'r', s: 24, a: 'c', c: LA }); if (n > 1) stroke(hexA(LA, .35), 1.5, () => { const pv = 55 * 2 ** (n - 2); X.moveTo(x0 + (n - 1) * sx, y0 - pv * 640 / 1760); X.lineTo(x0 + n * sx, y); }, { g: 0, dash: [6, 8] }); }); }
    else { for (let n = 1; n <= 6; n++) fade(A(t, 20.2 + n * .4, .3), () => { const v = 600 * .5 ** (n - 1); dot(x0 + n * sx, y0 - v, 10, MD, 18); T(String(+(64 * .5 ** (n - 1)).toFixed(1)), x0 + n * sx, y0 - v - 24, { k: 'r', s: 24, a: 'c', c: MD }); }); T('r = 1/2', 900, 560, { k: 'r', s: 40, a: 'r', c: RZ }); }
  },
  // 10 · Cierre: el teclado con los La encendidos; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { keyboard(80, 760, 35, 26, 200, { 5: LA, 12: LA, 19: LA, 26: LA, 33: LA }); T('× ¹²√2 en cada semitono', CX, 1040, { k: 'r', s: 52, a: 'c', c: RZ, g: 12 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['r', 'i', RZ], [' = ', 'r'], ['a', 'i'], ['ₙ₊₁/', 'r'], ['a', 'i'], ['ₙ', 'r']], 'la razón'], [[['a', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁', 'r'], ['r', 'i', RZ], ['ⁿ⁻¹', 'r', RZ]], 'término general'], [[['220 · ', 'r'], ['r', 'i', RZ], ['¹² = 440', 'r']], '11 medios geométricos'], [[['√(', 'r'], ['ab', 'i'], [')', 'r']], 'media geométrica']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [LA, MD, RZ]);
    });
  },
};
