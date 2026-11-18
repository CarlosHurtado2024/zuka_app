// «La ley de Kepler» · escenas de la lección alg-22a. Motor en kit.js y potencia.js; guion en raices.data.js.
// La potencia en ámbar, la raíz (lo que la deshace) en cian, el resultado en verde, la trampa en rosa.
const POT = C.amber, RAD = C.cyan, RES = C.green, TRP = C.mag;
// Órbitas circulares a escala (UA) alrededor del Sol en (cx, cy); s píxeles por UA; t mueve los planetas con T² = a³.
const PLANETS = [['Mercurio', .387, '#c9c3b8'], ['Venus', .723, '#ffd9a0'], ['Tierra', 1, C.blue], ['Marte', 1.524, C.red], ['Júpiter', 5.203, C.amber]];
function orbits(t, cx, cy, s, o = {}) {
  dot(cx, cy, 14, '#ffc247', 40);
  PLANETS.forEach(([n, a, col], i) => {
    if (o.only && !o.only.includes(n)) return;
    const r = a * s; if (r > 520) return;
    ring(cx, cy, r, hexA(col, .35), 1.5, 1, { g: 0 });
    const T_ = Math.pow(a, 1.5), ang = -t * 1.2 / T_ + i;
    dot(cx + r * Math.cos(ang), cy + r * Math.sin(ang), n === 'Júpiter' ? 12 : 8, col, 16);
    if (o.names) { const xx = cx + r * Math.cos(ang); T(n, xx > 900 ? xx - 16 : xx + 16, cy + r * Math.sin(ang) - 12, { k: 'mono', s: 20, c: col, a: xx > 900 ? 'r' : 'l' }); }
  });
}
const S = {
  // 1 · Kepler: las órbitas interiores girando; T² = a³.
  kepler(t) {
    stars(t, .5);
    orbits(t, CX, 760, 220, { names: true, only: ['Mercurio', 'Venus', 'Tierra', 'Marte'] });
    fade(A(t, 1.4, .6), () => T('Johannes Kepler · Harmonices Mundi, 1619', CX, 1160, { k: 'mono', s: 23, c: C.mute, a: 'c' }));
    fade(A(t, 9.8, .6), () => { F([['T', 'i', POT], ['²', 'r', POT], [' = ', 'r'], ['a', 'i', RAD], ['³', 'r', RAD]], CX, 360, 100); T('T: años    a: unidades astronómicas', CX, 410, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
    fade(A(t, 18.8, .6), () => T('a = …', 96, 1300, { k: 'mono', s: 26, c: RAD, g: 8 }));
  },
  // 2 · Raíz cuadrada: el terreno de 49 m² y su lado 7; √50 ≈ 7.07.
  cuadrada(t) {
    stars(t, .3);
    const area = t < 20 ? 49 : lerp(49, 50, eio(seg(t, 20.4, 22))), side = Math.sqrt(area), u = 60, x0 = CX - side * u / 2, y0 = 460;
    X.save(); X.fillStyle = hexA(POT, .14); X.fillRect(x0, y0, side * u, side * u); X.restore();
    stroke(POT, 3, () => X.rect(x0, y0, side * u, side * u), { g: 14 });
    if (t < 20) for (let i = 1; i < 7; i++) stroke(hexA(POT, .35), 1.5, () => { X.moveTo(x0 + i * u, y0); X.lineTo(x0 + i * u, y0 + 7 * u); X.moveTo(x0, y0 + i * u); X.lineTo(x0 + 7 * u, y0 + i * u); }, { g: 0 });
    T(area.toFixed(area % 1 ? 2 : 0) + ' m²', CX, y0 + side * u / 2 + 18, { k: 'r', s: 52, a: 'c', c: POT, g: 10 });
    fade(A(t, 3, .5), () => { arrow(x0, y0 + side * u + 40, x0 + side * u, y0 + side * u + 40, RAD, 1, 3); T('lado = ' + side.toFixed(t < 20 ? 0 : 2), CX, y0 + side * u + 96, { k: 'r', s: 44, a: 'c', c: RAD }); });
    fade(A(t, 10.2, .6), () => { rad(CX - 220, 1060, 72, '49', RAD); T('= 7', CX - 20, 1060, { k: 'r', s: 72, c: RES, g: 12 }); T('porque 7² = 49', CX + 220, 1060, { k: 'mono', s: 26, c: C.mute }); });
    fade(A(t, 22, .5), () => { rad(CX - 220, 1170, 64, '50', RAD); T('≈ 7.07', CX, 1170, { k: 'r', s: 64, c: RES }); });
  },
  // 3 · La positiva: x² = 49 tiene ±7 en la recta; √49 es solo el 7.
  positiva(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -11, 11, { step: 1, lab: v => v % 5 === 0 || Math.abs(v) === 7, s: 28 });
    fade(A(t, 1.6, .5), () => { dot(px(7), 760, 13, RES, 26); T('7', px(7), 700, { k: 'r', s: 44, a: 'c', c: RES }); });
    fade(A(t, 3, .5), () => { dot(px(-7), 760, 13, t > 10 ? hexA(TRP, .5) : TRP, 26); T('−7', px(-7), 700, { k: 'r', s: 44, a: 'c', c: TRP }); });
    F([['x', 'i'], ['² = 49', 'r']], CX, 560, 72);
    fade(A(t, 10.2, .6), () => { rad(CX - 160, 960, 72, '49', RAD); T('= 7', CX + 50, 960, { k: 'r', s: 72, c: RES, g: 12 }); ring(px(7), 760, 30, RAD, 3, seg(t, 10.4, 11.4)); T('un solo número: el positivo', CX, 1040, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 19.2, .6), () => { T('±', CX - 230, 1180, { k: 'r', s: 72, a: 'c', c: TRP }); rad(CX - 190, 1180, 72, '49', RAD); T('= ±7', CX + 30, 1180, { k: 'r', s: 72, c: C.ink }); });
  },
  // 4 · Raíz cúbica: un cubo de 343 cm³ con arista 7; ∛(−343) = −7.
  cubica(t) {
    stars(t, .3);
    const s = 260, cx = CX, cy = 700, d = s * .45, k = eo(seg(t, 1, 3));
    fade(win(t, .5, 19.8), () => {
      stroke(POT, 3, () => { X.rect(cx - s / 2, cy - s / 2 + d / 2, s, s); X.moveTo(cx - s / 2, cy - s / 2 + d / 2); X.lineTo(cx - s / 2 + d, cy - s / 2 - d / 2); X.lineTo(cx + s / 2 + d, cy - s / 2 - d / 2); X.lineTo(cx + s / 2, cy - s / 2 + d / 2); X.moveTo(cx + s / 2 + d, cy - s / 2 - d / 2); X.lineTo(cx + s / 2 + d, cy + s / 2 - d / 2); X.lineTo(cx + s / 2, cy + s / 2 + d / 2); }, { g: 14 });
      T('343 cm³', cx + d / 2, cy + 20, { k: 'r', s: 48, a: 'c', c: POT, g: 10 });
      fade(A(t, 3, .5), () => { arrow(cx - s / 2, cy + s / 2 + d / 2 + 40, cx + s / 2, cy + s / 2 + d / 2 + 40, RAD, 1, 3); T('arista', cx, cy + s / 2 + d / 2 + 90, { k: 'it', s: 36, a: 'c', c: RAD }); });
      fade(A(t, 10.2, .6), () => { rad(CX - 220, 1140, 80, '343', RAD, { idx: 3 }); T('= 7', CX + 90, 1140, { k: 'r', s: 80, c: RES, g: 12 }); T('7 · 7 · 7 = 343', CX, 1220, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    });
    fade(A(t, 20, .6), () => {
      F([['(−7)³', 'r', TRP], [' = (−7)(−7)(−7) = ', 'r'], ['−343', 'r', TRP]], CX, 640, 54, { max: 960 });
      rad(CX - 300, 820, 76, '(−343)', RAD, { idx: 3 }); T('= −7', CX + 120, 820, { k: 'r', s: 76, c: RES, g: 12 });
      T('índice impar: acepta negativos', CX, 920, { k: 'mono', s: 26, a: 'c', c: C.mute });
    });
  },
  // 5 · El índice: ⁿ√a = b ⟺ bⁿ = a; impar sirve siempre; par pide a ≥ 0.
  indice(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { rad(CX - 380, 600, 96, 'a', RAD, { idx: 'n', k: 'i' }); F([[' = ', 'r'], ['b', 'i', RES], ['   ⟺   ', 'r'], ['b', 'i', RES], ['ⁿ', 'r', POT], [' = ', 'r'], ['a', 'i']], CX - 200, 600, 80, { a: 'l' }); });
    fade(A(t, 2.4, .5), () => { arrow(CX - 420, 470, CX - 360, 530, POT, 1, 2.5); T('índice', CX - 420, 450, { k: 'it', s: 36, a: 'c', c: POT }); });
    fade(A(t, 10.2, .6), () => { rad(220, 860, 60, '(−1 000)', RAD, { idx: 3 }); T('= −10', 640, 860, { k: 'r', s: 60, c: RES }); check(920, 840, 24, true, A(t, 11.4, .5)); T('impar', 96, 940, { k: 'mono', s: 24, c: RES }); });
    fade(A(t, 19.2, .6), () => { rad(220, 1080, 60, '(−49)', RAD); T('no es real', 560, 1080, { k: 'r', s: 52, c: TRP }); check(920, 1060, 24, false, A(t, 20.4, .5)); T('par: a ≥ 0', 96, 1160, { k: 'mono', s: 24, c: TRP }); });
  },
  // 6 · Exponente fracción: (a¹⁄²)² = a; el denominador es el índice.
  fraccion(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { pw('a', '1/2', CX - 260, 600, 110, C.ink, POT, { k: 'i' }); T('=', CX, 600, { k: 'r', s: 100, a: 'c' }); rad(CX + 80, 600, 110, 'a', RAD, { k: 'i' }); });
    fade(A(t, 10.2, .6), () => F([['(', 'r'], ['a', 'i'], ['¹⁄²', 'r', POT], [')²', 'r', POT], [' = ', 'r'], ['a', 'i'], ['¹⁄² · ²', 'r', POT], [' = ', 'r'], ['a', 'i'], ['¹', 'r', RES], [' = ', 'r'], ['a', 'i', RES]], CX, 820, 52, { rev: seg(t, 10.4, 15), max: 960 }));
    fade(A(t, 20.2, .6), () => { pw('a', '1/n', CX - 260, 1060, 100, C.ink, POT, { k: 'i' }); T('=', CX, 1060, { k: 'r', s: 90, a: 'c' }); rad(CX + 80, 1060, 100, 'a', RAD, { idx: 'n', k: 'i' }); arrow(CX - 120, 960, CX + 120, 980, hexA(POT, .8), eo(seg(t, 21.4, 22.6)), 2.5); T('denominador = índice', CX, 1160, { k: 'mono', s: 26, a: 'c', c: POT }); });
  },
  // 7 · m sobre n: 16³⁄⁴: la raíz cuarta de 16 es 2 y 2³ = 8; al revés, 16³ = 4 096.
  mn(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { pw('a', 'm/n', CX - 300, 560, 96, C.ink, POT, { k: 'i' }); T('= (', CX - 60, 560, { k: 'r', s: 86, c: C.ink }); rad(CX + 50, 560, 86, 'a', RAD, { idx: 'n', k: 'i' }); T(')ᵐ', CX + 230, 560, { k: 'r', s: 86, c: POT }); });
    fade(A(t, 10.2, .6), () => {
      pw('16', '3/4', 150, 800, 72, C.ink, POT); arrow(390, 780, 470, 780, RAD, eo(seg(t, 10.6, 11.6)), 3);
      fade(A(t, 11.6, .5), () => { rad(490, 800, 64, '16', RAD, { idx: 4 }); T('= 2', 640, 800, { k: 'r', s: 64, c: RAD }); });
      fade(A(t, 13.4, .5), () => { arrow(760, 780, 830, 780, POT, 1, 3); pw('2', 3, 850, 800, 64, RES, POT); T('= 8', 950, 800, { k: 'r', s: 64, c: RES, g: 12 }); });
    });
    fade(A(t, 19.2, .6), () => { F([['16³ = ', 'r'], ['4 096', 'r', TRP], ['  y luego  ', 'it', C.mute], ['⁴√4 096 = 8', 'r']], CX, 1020, 50, { max: 960 }); T('raíz primero: números pequeños', CX, 1100, { k: 'mono', s: 26, a: 'c', c: RES }); });
  },
  // 8 · La distancia a Marte: a = T²⁄³; 1.88 → 1.52 UA; 11.86 → 5.20 UA.
  marte(t) {
    stars(t, .3);
    orbits(t * 3, CX, 960, t < 20 ? 200 : 80, { names: true, only: t < 20 ? ['Tierra', 'Marte'] : ['Tierra', 'Marte', 'Júpiter'] });
    fade(A(t, .8, .6), () => F([['a', 'i', RAD], ['³', 'r', RAD], [' = ', 'r'], ['T', 'i', POT], ['²', 'r', POT], ['  ⟹  ', 'r'], ['a', 'i', RAD], [' = ', 'r'], ['T', 'i', POT], ['²⁄³', 'r', POT]], CX, 420, 64, { rev: seg(t, 1, 5) }));
    fade(win(t, 10.2, 19.8), () => F([['1.88', 'r', POT], ['²⁄³', 'r', POT], [' ≈ ', 'r'], ['1.52 UA', 'r', RES]], CX, 520, 60));
    fade(A(t, 20.2, .6), () => F([['11.86', 'r', POT], ['²⁄³', 'r', POT], [' ≈ ', 'r'], ['5.20 UA', 'r', RES]], CX, 520, 60));
    T('1 UA = distancia Tierra–Sol', CX, 1400, { k: 'mono', s: 22, a: 'c', c: C.mute });
  },
  // 9 · Dos trampas: √((−5)²) = 5 = |−5|; √(9 + 16) = 5 y no 7 (el triángulo 3-4-5).
  trampas(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      F([['√((−5)²)', 'r', RAD], [' = ', 'r'], ['√25', 'r', RAD], [' = ', 'r'], ['5', 'r', RES]], CX, 600, 76);
      fade(A(t, 3, .5), () => { T('−5', CX + 300, 700, { k: 'r', s: 50, a: 'c', c: TRP }); check(CX + 370, 690, 22, false, 1); });
      fade(A(t, 10.2, .6), () => { F([['√(', 'r', RAD], ['x', 'i'], ['²) = |', 'r', RAD], ['x', 'i'], ['|', 'r', RAD]], CX, 860, 96); T('valor absoluto: la distancia al cero', CX, 950, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    });
    fade(A(t, 20, .6), () => {
      const u = 70, x0 = 260, y0 = 900, k = eo(seg(t, 20.4, 23));
      stroke(POT, 4, () => { X.moveTo(x0, y0); X.lineTo(x0 + 4 * u * k, y0); }, { g: 12 }); stroke(RAD, 4, () => { X.moveTo(x0, y0); X.lineTo(x0, y0 - 3 * u * k); }, { g: 12 });
      if (k > .99) stroke(RES, 4, () => { X.moveTo(x0, y0 - 3 * u); X.lineTo(x0 + 4 * u, y0); }, { g: 14 });
      T('4', x0 + 2 * u, y0 + 46, { k: 'r', s: 40, a: 'c', c: POT }); T('3', x0 - 30, y0 - 1.5 * u + 14, { k: 'r', s: 40, a: 'c', c: RAD }); fade(k, () => T('5', x0 + 2 * u + 30, y0 - 1.5 * u - 6, { k: 'r', s: 40, a: 'c', c: RES }));
      F([['√(9 + 16) = ', 'r'], ['5', 'r', RES]], 760, 760, 54); F([['√9 + √16 = ', 'r'], ['7', 'r', TRP]], 760, 860, 54);
    });
  },
  // 10 · Cierre: las cinco órbitas; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { orbits(t * 2, CX, 780, 90, { names: true }); F([['T', 'i', POT], ['² = ', 'r', POT], ['a', 'i', RAD], ['³', 'r', RAD]], CX, 1330, 72); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['√49 = 7', 'r', RAD]], 'deshace el cuadrado'], [[['∛(−343) = −7', 'r', RAD]], 'índice impar'], [[['a', 'i'], ['ᵐ⁄ⁿ = (ⁿ√a)ᵐ', 'r', POT]], 'exponente fracción'], [[['√(x²) = |x|', 'r', TRP]], 'valor absoluto']], 420, 170, 48);
      endCard(t, 19.6, D.TITLE, D.LINE, [POT, RES, RAD]);
    });
  },
};
