// «Ocho minutos de luz» · escenas de la lección alg-21b. Motor en kit.js y potencia.js; guion en leyes.data.js.
// Los factores de arriba en ámbar, los de abajo en cian, lo que se cancela en rosa, el resultado en verde.
const UPF = C.amber, DNF = C.cyan, CAN = C.mag, OK = C.green;
// Fila de n fichas «label» centrada en (cx, y); tach (0–1) tacha las primeras m.
function row(cx, y, n, label, col, o = {}) {
  const w = o.w || 92, gap = o.gap || 12, x0 = cx - (n * w + (n - 1) * gap) / 2;
  for (let i = 0; i < n; i++) fade(o.k === undefined ? 1 : clamp(o.k * n - i), () => {
    const x = x0 + i * (w + gap) + w / 2, dead = o.m && i < o.m;
    fade(dead ? 1 - .7 * (o.tach || 0) : 1, () => chip(x, y, w, 70, dead && o.tach > .5 ? CAN : col, label, { s: 34, c: dead && o.tach > .5 ? CAN : col }));
    if (dead && o.tach > 0) stroke(CAN, 3, () => { X.moveTo(x - w / 2 + 6, y + 30); X.lineTo(lerp(x - w / 2 + 6, x + w / 2 - 6, o.tach), lerp(y + 30, y - 30, o.tach)); }, { g: 10 });
  });
  return x0;
}
// El Sol y la Tierra con un pulso de luz que viaja entre ellos (k de 0 a 1).
function sunEarth(k, y = 700) {
  dot(180, y, 70, '#ffc247', 60); ring(180, y, 90, hexA('#ffc247', .4), 2);
  dot(920, y, 22, C.blue, 20); T('Tierra', 920, y + 70, { k: 'mono', s: 22, a: 'c', c: C.blue }); T('Sol', 180, y + 130, { k: 'mono', s: 22, a: 'c', c: '#ffc247' });
  stroke(hexA('#ffe9a0', .3), 2, () => { X.moveTo(270, y); X.lineTo(895, y); }, { g: 0, dash: [6, 10] });
  if (k > 0 && k < 1) { const x = lerp(270, 895, k); stroke('#fff3c4', 5, () => { X.moveTo(Math.max(270, x - 80), y); X.lineTo(x, y); }, { g: 24 }); }
}
const S = {
  // 1 · La luz del Sol: el pulso tarda 8 minutos; 150 000 000 km a 300 000 km/s.
  sol(t) {
    stars(t, .5);
    const k = ((t - 1) % 9) / 9;
    sunEarth(t > 1 ? k : 0);
    const sec = Math.round(500 * k);
    fade(A(t, 1.4, .5), () => T('luz en camino: ' + Math.floor(sec / 60) + ' min ' + String(sec % 60).padStart(2, '0') + ' s', CX, 520, { k: 'mono', s: 30, a: 'c', c: '#fff3c4', g: 8 }));
    fade(A(t, 9.8, .6), () => { T('150 000 000 km', CX, 640, { k: 'r', s: 44, a: 'c', c: UPF }); T('300 000 km/s', CX, 960, { k: 'r', s: 44, a: 'c', c: DNF }); });
    fade(A(t, 18.8, .6), () => F([['150 000 000', 'r', UPF], [' ÷ ', 'r'], ['300 000', 'r', DNF], [' = ', 'r'], ['…', 'r', OK]], CX, 1160, 60));
  },
  // 2 · Multiplicar: dos dieces y tres dieces se juntan en cinco.
  producto(t) {
    stars(t, .3);
    const m = eio(seg(t, 10.4, 12.6));
    row(lerp(300, 380, m), lerp(560, 760, m), 2, '10', UPF, { k: seg(t, 1, 2.4) });
    row(lerp(780, 640, m), lerp(560, 760, m), 3, '10', DNF, { k: seg(t, 2.4, 4.2) });
    fade(1 - m, () => { pw('10', 2, 220, 470, 60, UPF, UPF); T('·', CX, 470, { k: 'r', s: 60, a: 'c' }); pw('10', 3, 700, 470, 60, DNF, DNF); });
    fade(A(t, 12.6, .5), () => { pw('10', 5, CX - 70, 960, 90, OK, OK, { g: 12 }); T('2 + 3 = 5 factores', CX, 1040, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 20.2, .6), () => F([['a', 'i'], ['ᵐ', 'r', UPF], [' · ', 'r'], ['a', 'i'], ['ⁿ', 'r', DNF], [' = ', 'r'], ['a', 'i'], ['ᵐ⁺ⁿ', 'r', OK]], CX, 1200, 80));
  },
  // 3 · La misma base: 2³ · 3² son factores distintos que no se juntan.
  base(t) {
    stars(t, .3);
    row(330, 620, 3, '2', UPF, { k: seg(t, 1, 2.4), w: 80 }); row(770, 620, 2, '3', DNF, { k: seg(t, 2.4, 3.6), w: 80 });
    fade(win(t, 1, 9.8), () => { F([['6⁵', 'r', C.red], ['   ', 'r'], ['2⁵', 'r', C.red]], CX, 800, 80); check(CX - 70, 780, 26, false, A(t, 4, .5)); check(CX + 90, 780, 26, false, A(t, 4.4, .5)); });
    fade(A(t, 10.2, .6), () => F([['2³', 'r', UPF], [' · ', 'r'], ['3²', 'r', DNF], [' = ', 'r'], ['8', 'r', UPF], [' · ', 'r'], ['9', 'r', DNF], [' = ', 'r'], ['72', 'r', OK]], CX, 840, 72));
    fade(A(t, 19.2, .6), () => T('la ley cuenta factores iguales', CX, 1000, { k: 'mono', s: 28, a: 'c', c: C.mute }));
  },
  // 4 · Dividir: ocho dieces arriba y cinco abajo; se tachan por parejas; quedan tres.
  cociente(t) {
    stars(t, .3);
    const tach = seg(t, 10.6, 13);
    const big = t < 20;
    if (big) {
      row(CX, 560, 8, '10', UPF, { k: seg(t, 1, 3), m: 5, tach, w: 100, gap: 10 });
      stroke('rgba(225,232,255,.8)', 3, () => { X.moveTo(100, 640); X.lineTo(980, 640); }, { g: 6 });
      row(CX, 720, 5, '10', DNF, { k: seg(t, 3, 4.6), m: 5, tach, w: 100, gap: 10 });
      fade(A(t, 13.4, .5), () => { pw('10', 3, CX - 80, 900, 90, OK, OK, { g: 12 }); T('8 − 5 = 3', CX, 990, { k: 'mono', s: 26, a: 'c', c: C.mute }); F([['a', 'i'], ['ᵐ', 'r', UPF], [' ÷ ', 'r'], ['a', 'i'], ['ⁿ', 'r', DNF], [' = ', 'r'], ['a', 'i'], ['ᵐ⁻ⁿ', 'r', OK], ['   (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']], CX, 1150, 64); });
    } else {
      const tb = seg(t, 21, 23);
      row(CX, 560, 2, '10', UPF, { m: 2, tach: tb, w: 100 });
      stroke('rgba(225,232,255,.8)', 3, () => { X.moveTo(100, 640); X.lineTo(980, 640); }, { g: 6 });
      row(CX, 720, 5, '10', DNF, { m: 2, tach: tb, w: 100, gap: 10 });
      fade(A(t, 23.4, .5), () => { F([['1 / ', 'r'], ['10³', 'r', DNF], [' = ', 'r'], ['10⁻³', 'r', OK]], CX, 920, 72); T('2 − 5 = −3: sobran abajo', CX, 1000, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    }
  },
  // 5 · Potencia de potencia: el kilómetro cuadrado; (10³)² = 10⁶.
  potpot(t) {
    stars(t, .3);
    const s = 440, x0 = CX - s / 2, y0 = 440, k = eo(seg(t, 1, 3));
    stroke(UPF, 3, () => X.rect(x0, y0, s * k, s * k), { g: 14 });
    fade(A(t, 2.6, .5), () => { T('10³ m', CX, y0 + s + 50, { k: 'r', s: 40, a: 'c', c: UPF }); X.save(); X.translate(x0 - 30, y0 + s / 2); X.rotate(-Math.PI / 2); T('10³ m', 0, 0, { k: 'r', s: 40, a: 'c', c: DNF }); X.restore(); });
    fade(A(t, 10.2, .6), () => { const g = Math.floor(10 * seg(t, 10.4, 13)); for (let i = 1; i < g; i++) stroke(hexA(OK, .4), 1.5, () => { X.moveTo(x0 + i * s / 10, y0); X.lineTo(x0 + i * s / 10, y0 + s); X.moveTo(x0, y0 + i * s / 10); X.lineTo(x0 + s, y0 + i * s / 10); }, { g: 0 }); F([['10³', 'r', UPF], [' · ', 'r'], ['10³', 'r', DNF], [' = ', 'r'], ['10⁶', 'r', OK], [' m²', 'r']], CX, 1060, 64); T('un millón de metros cuadrados · cada cuadrito: 100 m × 100 m', CX, 1130, { k: 'mono', s: 22, a: 'c', c: C.mute }); });
    fade(A(t, 19.2, .6), () => F([['(', 'r'], ['a', 'i'], ['ᵐ', 'r', UPF], [')', 'r'], ['ⁿ', 'r', DNF], [' = ', 'r'], ['a', 'i'], ['ᵐⁿ', 'r', OK], ['     3 · 2 = 6', 'it', C.mute]], CX, 1240, 64));
  },
  // 6 · Un producto: (2 · 5)³ se reordena en 2³ · 5³ = 8 · 125 = 1 000.
  reparte(t) {
    stars(t, .3);
    const m = eio(seg(t, 10.6, 13.6));
    for (let i = 0; i < 6; i++) { const two = i % 2 === 0, j = Math.floor(i / 2), xa = 170 + i * 148, xb = two ? 170 + j * 130 : 610 + j * 130; fade(A(t, 1 + i * .3, .4), () => chip(lerp(xa, xb, m), 620, 110, 80, two ? UPF : DNF, two ? '2' : '5', { s: 44, c: two ? UPF : DNF })); }
    fade(1 - m, () => { for (let j = 0; j < 3; j++) stroke(hexA(C.ink, .4), 2, () => X.roundRect(110 + j * 296, 560, 268, 120, 20), { g: 0, dash: [6, 8] }); T('(2 · 5) · (2 · 5) · (2 · 5)', CX, 760, { k: 'r', s: 40, a: 'c' }); });
    fade(m, () => { T('2³', 300, 760, { k: 'r', s: 56, a: 'c', c: UPF }); T('5³', 740, 760, { k: 'r', s: 56, a: 'c', c: DNF }); });
    fade(A(t, 19.2, .6), () => F([['8', 'r', UPF], [' · ', 'r'], ['125', 'r', DNF], [' = ', 'r'], ['1 000', 'r', OK], [' = 10³', 'r']], CX, 960, 72));
    fade(A(t, 1.6, .6), () => F([['(2 · 5)³', 'r'], [' = ', 'r'], ['2³', 'r', UPF], [' · ', 'r'], ['5³', 'r', DNF]], CX, 470, 64));
  },
  // 7 · No en una suma: el cuadrado de lado 3 + 4 tiene 9 + 16 + 12 + 12.
  suma(t) {
    stars(t, .3);
    const u = 64, x0 = CX - 3.5 * u, y0 = 440, k = eo(seg(t, 10.4, 13));
    stroke(C.ink, 3, () => X.rect(x0, y0, 7 * u, 7 * u), { g: 10 });
    T('3', x0 + 1.5 * u, y0 - 16, { k: 'r', s: 36, a: 'c', c: UPF }); T('4', x0 + 5 * u, y0 - 16, { k: 'r', s: 36, a: 'c', c: DNF });
    fade(k, () => {
      bar(x0, y0, 3 * u, 3 * u, UPF, 1, { fill: .3 }); T('9', x0 + 1.5 * u, y0 + 1.5 * u + 14, { k: 'r', s: 44, a: 'c', c: UPF });
      bar(x0 + 3 * u, y0 + 3 * u, 4 * u, 4 * u, DNF, 1, { fill: .3 }); T('16', x0 + 5 * u, y0 + 5 * u + 14, { k: 'r', s: 44, a: 'c', c: DNF });
    });
    fade(A(t, 15, .6), () => { const g = t > 20 ? 1 : 0; bar(x0 + 3 * u, y0, 4 * u, 3 * u, CAN, 1, { fill: .1 + .3 * g }); bar(x0, y0 + 3 * u, 3 * u, 4 * u, CAN, 1, { fill: .1 + .3 * g }); T('12', x0 + 5 * u, y0 + 1.5 * u + 14, { k: 'r', s: 44, a: 'c', c: CAN }); T('12', x0 + 1.5 * u, y0 + 5 * u + 14, { k: 'r', s: 44, a: 'c', c: CAN }); });
    fade(win(t, .8, 10), () => F([['(3 + 4)² = ', 'r'], ['49', 'r', OK], ['     3² + 4² = ', 'r'], ['25', 'r', C.red]], CX, 1060, 54, { max: 960 }));
    fade(A(t, 20.2, .6), () => F([['49', 'r', OK], [' = ', 'r'], ['9', 'r', UPF], [' + ', 'r'], ['16', 'r', DNF], [' + ', 'r'], ['12 + 12', 'r', CAN]], CX, 1060, 64));
  },
  // 8 · Notación científica: el punto salta 8 lugares en 150 000 000; 300 000 = 3 · 10⁵.
  cientifica(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { F([['a', 'i', OK], [' · 10', 'r'], ['ⁿ', 'r', DNF]], CX, 700, 120); T('1 ≤ a < 10', CX, 820, { k: 'mono', s: 34, a: 'c', c: OK }); });
    fade(win(t, 10, 19.8), () => {
      const digits = '150000000', n = Math.min(8, Math.floor(8 * seg(t, 11, 15))), y = 680, cw = 76, x0 = CX - 4.5 * cw;
      for (let i = 0; i < 9; i++) T(digits[i], x0 + i * cw + cw / 2, y, { k: 'r', s: 80, a: 'c', c: i < 2 ? UPF : C.ink });
      const px = x0 + (9 - n) * cw; dot(px, y + 6, 8, OK, 18);
      for (let j = 0; j < n; j++) hop(x0 + (9 - j) * cw, x0 + (8 - j) * cw, y + 30, 30, hexA(OK, .7), 1, 2);
      T('saltos = ' + n, 96, 1300, { k: 'mono', s: 26, c: OK, g: 8 });
      fade(A(t, 15.4, .5), () => F([['1.5', 'r', UPF], [' · 10', 'r'], ['⁸', 'r', DNF]], CX, 900, 90));
    });
    fade(A(t, 20.2, .6), () => { F([['300 000', 'r'], [' = ', 'r'], ['3', 'r', UPF], [' · 10', 'r'], ['⁵', 'r', DNF]], CX, 760, 80); T('km/s · la rapidez de la luz', CX, 850, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
  },
  // 9 · Ocho minutos: (1.5 · 10⁸) ÷ (3 · 10⁵) = 0.5 · 10³ = 500 s.
  minutos(t) {
    stars(t, .3);
    F([['(1.5 · 10⁸)', 'r', UPF], [' ÷ ', 'r'], ['(3 · 10⁵)', 'r', DNF]], CX, 520, 64);
    fade(A(t, 10.2, .6), () => { F([['1.5 ÷ 3', 'r'], [' = ', 'r'], ['0.5', 'r', OK]], 300, 700, 56); F([['10⁸ ÷ 10⁵', 'r'], [' = ', 'r'], ['10³', 'r', OK]], 780, 700, 56); });
    fade(A(t, 19.2, .6), () => {
      F([['0.5 · 10³', 'r', OK], [' = ', 'r'], ['500 s', 'r', OK]], CX, 880, 80);
      const k = seg(t, 20, 25); sunEarth(k, 1120); T(Math.floor(500 * k / 60) + ' min ' + String(Math.round(500 * k) % 60).padStart(2, '0') + ' s', CX, 1270, { k: 'mono', s: 30, a: 'c', c: '#fff3c4', g: 8 });
    });
  },
  // 10 · Cierre: el Sol con su luz; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { sunEarth(((t - .5) % 6) / 6, 760); T('8 min 20 s', CX, 600, { k: 'r', s: 64, a: 'c', c: '#fff3c4', g: 16 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], ['ᵐ', 'r', UPF], ['a', 'i'], ['ⁿ', 'r', DNF], [' = ', 'r'], ['a', 'i'], ['ᵐ⁺ⁿ', 'r', OK]], 'multiplicar: se suman'], [[['a', 'i'], ['ᵐ', 'r', UPF], [' ÷ ', 'r'], ['a', 'i'], ['ⁿ', 'r', DNF], [' = ', 'r'], ['a', 'i'], ['ᵐ⁻ⁿ', 'r', OK]], 'dividir: se restan'], [[['(', 'r'], ['a', 'i'], ['ᵐ', 'r', UPF], [')', 'r'], ['ⁿ', 'r', DNF], [' = ', 'r'], ['a', 'i'], ['ᵐⁿ', 'r', OK]], 'potencia: se multiplican'], [[['(a + b)² ≠ a² + b²', 'r', CAN]], 'no en una suma (en general)']], 420, 170, 48);
      endCard(t, 19.6, D.TITLE, D.LINE, [UPF, OK, DNF]);
    });
  },
};
