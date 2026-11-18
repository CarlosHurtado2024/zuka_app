// «La pastilla de cada día» · escenas de la lección alg-14d. Motor en kit.js y sigma.js; guion en sumageo.data.js.
// Los términos en ámbar, la fila corrida en cian, lo que se cancela en rosa, la suma y el límite en verde.
const TR = C.amber, SH = C.cyan, CN = C.mag, LM = C.green;
// Cantidad de medicamento justo después de la toma número d (100 mg, la mitad se va cada día).
const dose = d => 200 * (1 - Math.pow(.5, d));
// Gráfica de la cantidad en el cuerpo día a día (diente de sierra) hasta el día k (fraccionario).
function saw(x0, y0, w, h, days, k) {
  stroke('rgba(225,232,255,.7)', 2, () => { X.moveTo(x0, y0); X.lineTo(x0 + w, y0); X.moveTo(x0, y0); X.lineTo(x0, y0 - h); }, { g: 0 });
  const sx = w / days, sy = h / 220;
  stroke(LM, 2, () => { X.moveTo(x0, y0 - 200 * sy); X.lineTo(x0 + w, y0 - 200 * sy); }, { g: 8, dash: [10, 8] });
  T('200 mg', x0 + w, y0 - 200 * sy - 14, { k: 'mono', s: 22, a: 'r', c: LM });
  stroke(TR, 3, () => {
    X.moveTo(x0, y0);
    for (let d = 1; d <= days && d <= k + 1; d++) {
      const top = dose(d), x = x0 + (d - 1) * sx; X.lineTo(x, y0 - top * sy);
      const f = clamp(k - (d - 1)), n = 20;
      for (let i = 1; i <= n * f; i++) { const u = i / n; X.lineTo(x + u * sx, y0 - top * Math.pow(.5, u) * sy); }
    }
  }, { g: 12 });
}
const S = {
  // 1 · La pastilla: 100, 150, 175, 187.5, … se acerca a 200.
  pastilla(t) {
    stars(t, .5);
    const k = seg(t, 1.4, 26) * 9;
    saw(140, 1100, 820, 560, 10, k);
    const d = Math.min(10, Math.floor(k) + 1);
    T('día ' + d + ' · después de la toma: ' + (+dose(d).toFixed(2)) + ' mg', CX, 1180, { k: 'mono', s: 26, a: 'c', c: TR, g: 8 });
  },
  // 2 · Sumar n términos: S y 2S corridos; se cancelan; 2S − S = 96 − 3.
  suma(t) {
    stars(t, .3);
    const a = [3, 6, 12, 24, 48], w = 150, x0 = 150, sh = eio(seg(t, 10.6, 12.6));
    T('S', 70, 612, { k: 'i', s: 44, c: TR }); a.forEach((v, i) => chip(x0 + i * w + w / 2, 600, 120, 70, TR, String(v), { s: 34, c: TR }));
    fade(A(t, 10.2, .6), () => { T('2S', 60, 742, { k: 'i', s: 44, c: SH }); a.forEach((v, i) => { const x = lerp(x0 + i * w + w / 2, x0 + (i + 1) * w + w / 2, sh); chip(x, 730, 120, 70, SH, String(2 * v), { s: 34, c: SH }); }); });
    fade(A(t, 20.2, .6), () => { const c = seg(t, 20.4, 22); for (let i = 1; i < 5; i++) { const x = x0 + i * w + w / 2; stroke(CN, 3, () => { X.moveTo(x - 50, 580); X.lineTo(lerp(x - 50, x + 50, c), lerp(580, 750, c)); }, { g: 12 }); } F([['2', 'r'], ['S', 'i'], [' − ', 'r'], ['S', 'i'], [' = ', 'r'], ['96', 'r', SH], [' − ', 'r'], ['3', 'r', TR], ['  ⟹  ', 'r'], ['S', 'i'], [' = ', 'r'], ['93', 'r', LM]], CX, 920, 56); });
  },
  // 3 · La fórmula: Sₙ = a₁(rⁿ − 1)/(r − 1), si r ≠ 1.
  formula(t) {
    stars(t, .3);
    F([['r', 'i'], ['S', 'i'], [' − ', 'r'], ['S', 'i'], [' = ', 'r'], ['a', 'i', SH], ['₁', 'r', SH], ['r', 'i', SH], ['ⁿ', 'r', SH], [' − ', 'r'], ['a', 'i', TR], ['₁', 'r', TR]], CX, 600, 72, { rev: seg(t, 1, 4) });
    fade(A(t, 10.2, .6), () => { F([['S', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁', 'r'], [' (', 'r'], ['r', 'i'], ['ⁿ − 1) / (', 'r'], ['r', 'i'], [' − 1)', 'r']], CX, 780, 72); T('si r ≠ 1', CX, 850, { k: 'mono', s: 26, a: 'c', c: CN }); });
    fade(A(t, 19.2, .6), () => { F([['r', 'i'], [' = 1:  ', 'r'], ['a', 'i'], ['₁ + ', 'r'], ['a', 'i'], ['₁ + … + ', 'r'], ['a', 'i'], ['₁ = ', 'r'], ['n', 'i', LM], ['a', 'i', LM], ['₁', 'r', LM]], CX, 1000, 56); });
  },
  // 4 · Si se achican: el cuadrado de área 1 se llena con 1/2, 1/4, 1/8, …
  achica(t) {
    stars(t, .3);
    const s = 560, x0 = CX - s / 2, y0 = 440, n = Math.min(12, Math.floor(seg(t, 1, 20) * 12));
    stroke('rgba(225,232,255,.8)', 3, () => X.rect(x0, y0, s, s), { g: 6 });
    let x = x0, y = y0, w = s, h = s, sum = 0;
    for (let i = 0; i < n; i++) { const hor = i % 2 === 0; const pw2 = hor ? w / 2 : w, ph = hor ? h : h / 2; bar(x, y, pw2, ph, i % 2 ? SH : TR, 1, { fill: .3 }); if (i < 4) T('1/' + 2 ** (i + 1), x + pw2 / 2, y + ph / 2 + 12, { k: 'r', s: 36 - i * 4, a: 'c', c: C.ink }); if (hor) { x += pw2; w -= pw2; } else { y += ph; h -= ph; } sum += 1 / 2 ** (i + 1); }
    T('suma = ' + sum.toFixed(6), CX, 1090, { k: 'mono', s: 32, a: 'c', c: LM, g: 8 });
    T('área total = 1', CX, 420, { k: 'mono', s: 24, a: 'c', c: C.mute });
  },
  // 5 · La suma infinita: rⁿ → 0; S = a₁/(1 − r).
  infinita(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { for (let n = 1; n <= 10; n++) fade(A(t, 1 + n * .3, .3), () => { const v = .5 ** n; bar(140, 420 + n * 56, 800 * v, 40, TR, 1, { fill: .35 }); T('(1/2)' + ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰'][n - 1] + ' = ' + +v.toFixed(4), 160 + 800 * v, 450 + n * 56, { k: 'mono', s: 22, c: C.mute }); }); });
    fade(A(t, 10.2, .6), () => { F([['S', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁', 'r'], [' (1 − ', 'r'], ['r', 'i'], ['ⁿ', 'r', CN], [') / (1 − ', 'r'], ['r', 'i'], [')', 'r']], CX, 640, 60); const rr = F([['S', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁', 'r'], [' (1 − ', 'r'], ['r', 'i'], ['ⁿ', 'r', CN], [') / (1 − ', 'r'], ['r', 'i'], [')', 'r']], CX, 640, 60, { rev: 0 }); stroke(CN, 4, () => { X.moveTo(rr.mid(5) - 30, 650); X.lineTo(rr.mid(6) + 20, 590); }, { g: 12 }); T('→ 0', rr.mid(6) + 30, 560, { k: 'r', s: 34, c: CN }); F([['S', 'i', LM], [' = ', 'r'], ['a', 'i'], ['₁ / (1 − ', 'r'], ['r', 'i'], [')', 'r']], CX, 800, 84); });
    fade(A(t, 19.2, .6), () => F([['(1/2) / (1 − 1/2) = ', 'r'], ['1', 'r', LM]], CX, 1000, 64));
  },
  // 6 · Los 200 mg: la pastilla como suma geométrica.
  dosis(t) {
    stars(t, .3);
    const terms = [100, 50, 25, 12.5, 6.25, 3.125];
    terms.forEach((v, i) => fade(A(t, 1 + i * .8, .4), () => { bar(140, 440 + i * 70, v * 4, 50, i ? SH : TR, 1, { fill: .35 }); T((i ? ['ayer', 'anteayer', 'hace 3 días', 'hace 4 días', 'hace 5 días'][i - 1] : 'hoy') + ': ' + v + ' mg', 160 + v * 4, 474 + i * 70, { k: 'mono', s: 22, c: C.mute }); }));
    fade(A(t, 10.2, .6), () => F([['a', 'i'], ['₁ = 100,  ', 'r', TR], ['r', 'i', SH], [' = 1/2', 'r', SH], ['   ⟹   ', 'r'], ['100 / (1 − 1/2) = ', 'r'], ['200', 'r', LM]], CX, 960, 48, { max: 960 }));
    fade(A(t, 20.2, .6), () => saw(220, 1260, 640, 200, 10, 9));
  },
  // 7 · La parábola: triángulos de Arquímedes, cada tanda 1/4 de la anterior.
  parabola(t) {
    stars(t, .3);
    const cx = CX, top = 460, w = 400, h = 600, f = x => top + h * (x / w) ** 2;
    stroke(TR, 3, () => { for (let x = -w; x <= w; x += 8) x === -w ? X.moveTo(cx + x, f(x)) : X.lineTo(cx + x, f(x)); }, { g: 12 });
    stroke(hexA(C.ink, .5), 2, () => { X.moveTo(cx - w, f(w)); X.lineTo(cx + w, f(w)); }, { g: 0 });
    const tri = (a, b, col, k) => { const m = (a + b) / 2; fade(k, () => { X.save(); X.beginPath(); X.moveTo(cx + a, f(a)); X.lineTo(cx + m, f(m)); X.lineTo(cx + b, f(b)); X.closePath(); X.fillStyle = hexA(col, .3); X.fill(); X.restore(); stroke(col, 2, () => { X.moveTo(cx + a, f(a)); X.lineTo(cx + m, f(m)); X.lineTo(cx + b, f(b)); X.closePath(); }, { g: 8 }); }); };
    tri(-w, w, TR, A(t, 1.2, .6));
    tri(-w, 0, SH, A(t, 10.4, .5)); tri(0, w, SH, A(t, 10.4, .5));
    [-w, -w / 2, 0, w / 2].forEach(a => tri(a, a + w / 2, LM, A(t, 12.4, .5)));
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => tri(-w + i * w / 4, -w + (i + 1) * w / 4, CN, A(t, 14.4, .5)));
    fade(A(t, 10.2, .6), () => T('cada tanda: 1/4 del área de la anterior', CX, 1140, { k: 'mono', s: 24, a: 'c', c: C.mute }));
    fade(A(t, 19.2, .6), () => F([['1 + 1/4 + 1/16 + … = ', 'r'], ['4/3', 'r', LM]], CX, 1240, 60));
    fade(A(t, .8, .6), () => T('Arquímedes · siglo III a. C.', CX, 420, { k: 'mono', s: 24, a: 'c', c: C.mute }));
  },
  // 8 · Diverge: 1 + 2 + 4 + … sin límite; 1 − 1 + 1 − … salta.
  diverge(t) {
    stars(t, .3);
    const x0 = 160, y0 = 1060, sx = 70;
    axes(x0, y0, 780, 560, 'n', 'Sₙ', 1);
    if (t < 20) { for (let n = 1; n <= 10; n++) fade(A(t, 1 + n * .8, .3), () => { const s = 2 ** n - 1, y = Math.max(480, y0 - s * .6); dot(x0 + n * sx, y, 9, s * .6 > 580 ? CN : TR, 18); if (s * .6 > 580) T(num(s), x0 + n * sx, 470, { k: 'mono', s: 18, a: 'c', c: CN }); }); fade(A(t, 10.2, .6), () => T('1 + 2 + 4 + 8 + … → sin límite', CX, 1150, { k: 'mono', s: 28, a: 'c', c: CN })); }
    else { for (let n = 1; n <= 10; n++) fade(A(t, 20.2 + n * .3, .2), () => dot(x0 + n * sx, y0 - (n % 2) * 250, 10, SH, 18)); T('1 − 1 + 1 − 1 + …: 1, 0, 1, 0, …', CX, 1150, { k: 'mono', s: 28, a: 'c', c: SH }); }
  },
  // 9 · 0.999… = 1: 9/10 + 9/100 + … llena la barra.
  nueves(t) {
    stars(t, .3);
    const n = Math.min(8, Math.floor(seg(t, 1, 9) * 8)), x0 = 140, w = 800;
    stroke('rgba(225,232,255,.8)', 2, () => X.rect(x0, 600, w, 80), { g: 4 });
    let acc = 0; for (let i = 1; i <= n; i++) { const v = 9 / 10 ** i; bar(x0 + acc * w, 600, v * w, 80, i % 2 ? TR : SH, 1, { fill: .4 }); acc += v; }
    T('0.' + '9'.repeat(Math.max(1, n)) + '…', CX, 790, { k: 'r', s: 72, a: 'c', c: TR });
    fade(A(t, 10.2, .6), () => F([['a', 'i'], ['₁ = 9/10,  ', 'r'], ['r', 'i', SH], [' = 1/10', 'r', SH], ['   ⟹   ', 'r'], ['(9/10) / (9/10) = ', 'r'], ['1', 'r', LM]], CX, 950, 46, { max: 960 }));
    fade(A(t, 19.2, .6), () => F([['0.999… = ', 'r'], ['1', 'r', LM]], CX, 1100, 96));
  },
  // 10 · Cierre: el diente de sierra de la pastilla; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => saw(140, 1060, 820, 520, 10, 9));
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['S', 'i'], ['ₙ = ', 'r'], ['a', 'i'], ['₁(', 'r'], ['r', 'i'], ['ⁿ − 1)/(', 'r'], ['r', 'i'], [' − 1)', 'r']], 'r ≠ 1'], [[['S', 'i'], [' = ', 'r'], ['a', 'i'], ['₁/(1 − ', 'r'], ['r', 'i'], [')', 'r']], '|r| < 1'], [[['100/(1 − ½) = 200', 'r', LM]], 'la pastilla'], [[['|r| ≥ 1', 'r', CN]], 'diverge']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [TR, LM, SH]);
    });
  },
};
