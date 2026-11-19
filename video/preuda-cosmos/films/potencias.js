// «Potencias, raíces y estimación» · escenas de la lección pu-cm-4 (Preuniversitario UdeA). Motor en kit.js y preu.js;
// guion en potencias.data.js. La base en cian, el exponente en ámbar, lo que sobra o se agrega en violeta, lo que está
// mal en rosa, el resultado en verde y lo que se hace ahora en lima.
const BASE = C.cyan, EXP = C.amber, MORE = C.violet, BAD = C.mag, RES = C.green, NOW = C.lime;
const lab = (s, x, y, c = C.mute, o = {}) => T(s, x, y, { k: 'mono', s: o.s || 24, a: o.a || 'c', c, ls: 1, max: o.max });
const big = (s, x, y, c = C.ink, sz = 64, o = {}) => T(s, x, y, { k: 'r', s: sz, a: o.a || 'c', c, g: o.g ?? (c === C.ink ? 0 : 12), max: o.max });
const sp = (s, c) => [String(s), 'sp', c];
// Fila de cifras centrada en cx (una por casilla de ancho cw): col(i) da el color de cada una.
function digitsRow(str, cx, y, cw, size, col) { const x0 = cx - (str.length - 1) * cw / 2; [...str].forEach((d, i) => { if (d !== ' ') big(d, x0 + i * cw, y, col(i, d), size); }); return i => x0 + i * cw; }
// Cubo de n × n × n cubitos en perspectiva isométrica, lleno hasta la altura h (en capas, puede ser fraccionaria).
function isoCube(cx, cy, n, u, h, col) {
  const P = (i, j, k) => [cx + (i - j) * u * .866, cy + (i + j) * u * .5 - k * u];
  const face = (pts, a) => { X.save(); X.beginPath(); pts.forEach((p, i) => (i ? X.lineTo(...p) : X.moveTo(...p))); X.closePath(); X.fillStyle = hexA(col, a); X.fill(); X.restore(); };
  const line = (a, b, c = 'rgba(225,232,255,.55)', w = 1.5) => stroke(c, w, () => { X.moveTo(...a); X.lineTo(...b); }, { g: 0 });
  // contorno del cubo completo, punteado
  stroke(hexA(col, .35), 1.5, () => { [[P(0, n, n), P(n, n, n), P(n, 0, n), P(0, 0, n)], [P(0, n, 0), P(n, n, 0), P(n, 0, 0)]].forEach(q => q.forEach((p, i) => (i ? X.lineTo(...p) : X.moveTo(...p)))); [[0, n], [n, n], [n, 0]].forEach(([i, j]) => { X.moveTo(...P(i, j, 0)); X.lineTo(...P(i, j, n)); }); }, { dash: [6, 8], g: 0 });
  if (h <= 0) return;
  face([P(0, n, 0), P(n, n, 0), P(n, n, h), P(0, n, h)], .28); face([P(n, n, 0), P(n, 0, 0), P(n, 0, h), P(n, n, h)], .18); face([P(0, 0, h), P(n, 0, h), P(n, n, h), P(0, n, h)], .42);
  for (let a = 0; a <= n; a++) { line(P(a, n, 0), P(a, n, h)); line(P(n, a, 0), P(n, a, h)); line(P(a, 0, h), P(a, n, h)); line(P(0, a, h), P(n, a, h)); }
  for (let k = 0; k <= Math.floor(h); k++) { line(P(0, n, k), P(n, n, k)); line(P(n, n, k), P(n, 0, k)); }
  stroke(col, 3, () => { [P(0, n, h), P(n, n, h), P(n, 0, h), P(0, 0, h), P(0, n, h)].forEach((p, i) => (i ? X.lineTo(...p) : X.moveTo(...p))); X.moveTo(...P(0, n, 0)); X.lineTo(...P(n, n, 0)); X.lineTo(...P(n, 0, 0)); X.moveTo(...P(n, n, 0)); X.lineTo(...P(n, n, h)); }, { g: 14 });
}
// Carta con un número.
function card(x, y, v, col, k = 1) { fade(k, () => { X.save(); X.fillStyle = 'rgba(14,20,46,.7)'; X.beginPath(); X.roundRect(x - 58, y - 82, 116, 164, 16); X.fill(); X.restore(); stroke(col, 3, () => X.roundRect(x - 58, y - 82, 116, 164, 16), { g: 12 }); big(String(v), x, y + 20, C.ink, 56); }); }
function brace(x0, x1, y, col, k = 1, dir = 1) {
  if (k <= 0) return; const m = (x0 + x1) / 2, h = 18 * dir;
  stroke(col, 2.5, () => { X.moveTo(x0, y); X.quadraticCurveTo(x0, y + h, x0 + 20, y + h); X.lineTo(lerp(m, x0 + 20, 1 - k) - 10, y + h); X.quadraticCurveTo(m, y + h, m, y + 2 * h); X.moveTo(m, y + 2 * h); X.quadraticCurveTo(m, y + h, m + 10, y + h); X.lineTo(lerp(m, x1 - 20, k), y + h); X.quadraticCurveTo(x1, y + h, x1, y); }, { g: 8 });
}
const S = {
  // 1 · El reto: las cuentas de María (UdeA 2024-2).
  reto(t) {
    stars(t, .6);
    examCard(t, { tag: 'RETO', y: 262, t0: 1, lines: ['María calcula mentalmente números de la forma', [['10', 'r'], ['n', 'spi'], [' − 51', 'r'], ['  y escribe la suma de las cifras del', 'j']], [['resultado. Para ', 'j'], ['10', 'r'], ['5', 'sp'], [' − 51', 'r'], ['  escribe 40. Para ', 'j'], ['10', 'r'], ['10', 'sp'], [' − 51', 'r'], ['  escribirá:', 'j']]], opts: ['75', '90', '85', '80'], ok: 2 });
    fade(A(t, 10.2, .6), () => {
      F([['10', 'r'], sp(5), [' − 51 = ', 'r']], 330, 960, 56);
      digitsRow('99949', 720, 960, 52, 64, i => (i === 3 ? EXP : NOW));
      fade(A(t, 12.4, .6), () => F([['9 + 9 + 9 + 4 + 9 = ', 'r'], ['40', 'r', RES]], CX, 1100, 52));
    });
    fade(A(t, 20.2, .6), () => { F([['10', 'r'], sp(10, NOW), [' − 51', 'r']], CX, 1260, 64); lab('la respuesta, al final', CX, 1330, C.mute); });
  },
  // 2 · Multiplicar repetido: 5³ en cubitos.
  potencia(t) {
    stars(t, .3);
    fade(win(t, .8, 9.6), () => {
      F([['5', 'r', BASE], sp(3, EXP)], 300, 450, 120);
      fade(A(t, 2.6, .5), () => F([[' = ', 'r'], ['5', 'r', BASE], [' · ', 'r'], ['5', 'r', BASE], [' · ', 'r'], ['5', 'r', BASE]], 650, 450, 80));
      fade(A(t, 3.6, .5), () => { lab('base: lo que se repite', 300, 520, BASE, { s: 22 }); lab('exponente: cuántas veces', 650, 520, EXP, { s: 22 }); });
    });
    fade(A(t, 9.8, .6), () => {
      const h = 5 * eio(seg(t, 10.4, 15.4));
      isoCube(CX, 700, 5, 62, h, BASE);
      lab(`${Math.floor(h + 1e-6)} capas de 25`, CX, 1240, NOW, { s: 28 });
      fade(A(t, 15.6, .5), () => F([['25 · 5 = ', 'r'], ['125', 'r', RES]], CX, 1330, 56));
    });
    fade(A(t, 19.4, .6), () => { F([['5', 'r'], sp(3), [' ≠ 5 · 3 = 15', 'r', BAD]], 300, 1430, 44); F([['5', 'r'], sp(3), [' = 125', 'r', RES]], 780, 1430, 44); });
  },
  // 3 · Las potencias de 10.
  diez(t) {
    stars(t, .3);
    fade(win(t, .8, 9.2), () => {
      [[3, '1000'], [6, '1000000']].forEach(([e, v], r) => fade(A(t, 1 + r * 2.2, .5), () => {
        const y = 520 + r * 200; F([['10', 'r'], sp(e, EXP), [' =', 'r']], 260, y, 70);
        digitsRow(v, 640, y, 50, 70, i => (i ? NOW : C.ink));
        lab(`${e} ceros`, 640, y + 60, NOW, { s: 22 });
      }));
    });
    fade(win(t, 9.8, 18.8), () => {
      F([['1 000 − 1', 'r']], CX, 480, 70);
      const k = eio(seg(t, 11.4, 13));
      fade(1 - k, () => digitsRow('1000', CX, 680, 80, 110, i => (i ? NOW : C.ink)));
      fade(k, () => digitsRow(' 999', CX, 680, 80, 110, () => RES));
      fade(A(t, 13.4, .5), () => { lab('cada cero se vuelve 9', CX, 790, NOW, { s: 26 }); F([['10', 'r'], ['n', 'spi', EXP], [' − 1 = 99…9  (n nueves)', 'r']], CX, 920, 48); });
    });
    fade(A(t, 19.2, .6), () => {
      F([['10 000 − 37', 'r']], CX, 480, 70);
      fade(A(t, 20.6, .5), () => { F([['= ', 'r'], ['9 999', 'r', NOW], [' − 36', 'r']], CX, 620, 64); lab('se le quita 1 a cada número', CX, 690, C.mute); });
      fade(A(t, 22.6, .5), () => { F([['= ', 'r'], ['9 963', 'r', RES]], CX, 820, 72); lab('sin llevar: cada cifra se resta de 9', CX, 890, NOW); });
    });
  },
  // 4 · Al cuadrado: el área; el lado crece 20 % y el área 44 % (UdeA 2026-1).
  cuadrado(t) {
    stars(t, .3);
    fade(win(t, .8, 9.8), () => {
      const x = 300, y = 360, u = 34, a = 10 * u, b = 3 * u, k = eo(seg(t, 1.2, 3));
      [[x, y, a, a, BASE, '100'], [x + a, y, b, a, EXP, '30'], [x, y + a, a, b, EXP, '30'], [x + a, y + a, b, b, RES, '9']].forEach(([xx, yy, w, h, c, s], i) => fade(clamp(k * 4 - i), () => {
        bar(xx, yy, w, h, c, 1, { fill: .2 }); big(s, xx + w / 2, yy + h / 2 + 16, C.ink, i === 3 ? 34 : 44);
      }));
      lab('10', x + a / 2, y - 20, BASE); lab('3', x + a + b / 2, y - 20, EXP); lab('10', x - 24, y + a / 2, BASE, { a: 'r' }); lab('3', x - 24, y + a + b / 2 + 8, EXP, { a: 'r' });
      fade(A(t, 4, .5), () => F([['13', 'r'], sp(2), [' = 100 + 30 + 30 + 9 = ', 'r'], ['169', 'r', RES]], CX, 960, 50, { max: 940 }));
    });
    fade(win(t, 10.2, 19.8), () => {
      const x = 220, y = 380, s0 = 400, s1 = 480, k = eo(seg(t, 11, 12.6)), s = lerp(s0, s1, k);
      bar(x, y, s, s, MORE, 1, { fill: .22 }); bar(x, y, s0, s0, BASE, 1, { fill: .25 });
      big('100', x + s0 / 2, y + s0 / 2 + 18, C.ink, 56);
      fade(A(t, 12.8, .5), () => { big('+ 44', x + s1 - 40, y + s1 - 20, MORE, 34); lab('lado 10 → 12', 800, 520, NOW, { s: 26 }); lab('área 100 → 144', 800, 580, NOW, { s: 26 }); });
      fade(A(t, 13.8, .5), () => F([['1.2', 'r'], sp(2), [' = 1.2 · 1.2 = ', 'r'], ['1.44', 'r', RES]], CX, 1000, 52));
    });
    fade(A(t, 20.2, .6), () => {
      const k = eo(seg(t, 21, 22.4));
      fade(.9, () => { X.save(); X.beginPath(); X.arc(CX, 640, lerp(180, 216, k), 0, 7); X.fillStyle = hexA(MORE, .18); X.fill(); X.beginPath(); X.arc(CX, 640, 180, 0, 7); X.fillStyle = hexA(BASE, .22); X.fill(); X.restore(); });
      ring(CX, 640, 180, BASE, 3); ring(CX, 640, lerp(180, 216, k), MORE, 3);
      lab('circunferencia + 20 %', CX, 900, MORE, { s: 24 });
      ['36 %', '40 %', '44 %', '20 %'].forEach((s, i) => fade(A(t, 22.6 + i * .2, .4), () => { const x = 195 + i * 230, ok = i === 2; chip(x, 1010, 190, 80, ok && t > 24 ? RES : C.dim, s, { s: 40, c: ok && t > 24 ? RES : C.mute }); T('ABCD'[i], x - 80, 990, { k: 'mono', s: 18, c: C.mute }); }));
      fade(A(t, 24.4, .5), () => F([['área · 1.44 → ', 'r'], ['+ 44 %', 'r', RES]], CX, 1170, 50));
    });
  },
  // 5 · Leyes contando factores: 2³ · 2⁴ = 2⁷ y (2³)² = 2⁶.
  leyes(t) {
    stars(t, .3);
    fade(win(t, .8, 9.2), () => {
      F([['2', 'r'], sp(3, BASE), [' · ', 'r'], ['2', 'r'], sp(4, EXP), [' = ', 'r'], ['2', 'r', RES], sp(7, RES)], CX, 440, 90);
      for (let i = 0; i < 7; i++) fade(A(t, 2 + i * .35, .3), () => chip(CX + (i - 3) * 118, 650, 96, 96, i < 3 ? BASE : EXP, '2', { s: 52 }));
      fade(A(t, 5, .5), () => { brace(CX - 3 * 118 - 48, CX - 1 * 118 + 48, 720, BASE); brace(CX + 0 * 118 - 48, CX + 3 * 118 + 48, 720, EXP); lab('3', CX - 2 * 118, 800, BASE, { s: 28 }); lab('4', CX + 1.5 * 118, 800, EXP, { s: 28 }); });
      fade(A(t, 6.4, .5), () => F([['7 doses: 2', 'r'], sp(7), [' = ', 'r'], ['128', 'r', RES]], CX, 930, 52));
    });
    fade(A(t, 9.8, .6), () => {
      F([['(2', 'r'], sp(3, BASE), [')', 'r'], sp(2, EXP), [' = ', 'r'], ['2', 'r', RES], sp(6, RES)], CX, 440, 90);
      [0, 1].forEach(g => fade(A(t, 10.6 + g * 1, .5), () => {
        const x0 = 170 + g * 400; stroke(EXP, 2.5, () => X.roundRect(x0 - 50, 590, 3 * 110 + 0, 120, 26), { g: 10 });
        for (let i = 0; i < 3; i++) chip(x0 + 5 + i * 105, 650, 88, 88, BASE, '2', { s: 48 });
        lab('grupo ' + (g + 1), x0 + 115, 760, EXP);
      }));
      fade(A(t, 13, .5), () => F([['3 · 2 = 6 doses: ', 'r'], ['64', 'r', RES]], CX, 900, 52));
    });
    fade(A(t, 19.2, .6), () => { lab('se cuenta cuántas veces se repite la base', CX, 1080, NOW, { s: 28 }); lab('no hace falta memorizar', CX, 1130, C.mute); });
  },
  // 6 · Pregunta real UdeA 2025-2: las cartas 1, 2, 4, 8, 16 y 32.
  examen(t) {
    stars(t, .3);
    examCard(t, { y: 262, t0: .8, lines: ['Seis cartas tienen los números 1, 2, 4, 8, 16 y 32.', 'Ana toma algunas y Eliza las demás. La suma de', 'Ana supera a la de Eliza en 7. Ana tomó:'], opts: ['4 cartas', '5 cartas', '3 cartas', '2 cartas'], ok: 2, rv: 22.4 });
    const vals = [1, 2, 4, 8, 16, 32], ana = [1, 2, 32], k = eio(seg(t, 20.4, 22));
    const home = i => CX + (i - 2.5) * 150, dest = i => { const a = ana.indexOf(vals[i]); return a >= 0 ? 190 + a * 132 : 650 + [4, 8, 16].indexOf(vals[i]) * 132; };
    vals.forEach((v, i) => card(lerp(home(i), dest(i), k), 920, v, k > .5 ? (ana.includes(v) ? EXP : BASE) : MORE, A(t, 3 + i * .3, .4)));
    fade(win(t, 10.2, 19.8), () => {
      F([['1 + 2 + 4 + 8 + 16 + 32 = ', 'r'], ['63', 'r', NOW]], CX, 1110, 46);
      fade(A(t, 13, .5), () => F([['Ana ', 'r', EXP], ['35', 'r'], ['   Eliza ', 'r', BASE], ['28', 'r']], CX, 1200, 50));
      fade(A(t, 15, .5), () => lab('35 + 28 = 63   y   35 − 28 = 7', CX, 1270, C.mute, { s: 24 }));
    });
    fade(A(t, 22, .6), () => {
      lab('Ana: 32 + 2 + 1 = 35', 322, 1080, EXP, { s: 24 }); lab('Eliza: 16 + 8 + 4 = 28', 782, 1080, BASE, { s: 24 });
      fade(A(t, 24, .5), () => { F([['32 > 1 + 2 + 4 + 8 + 16 = 31', 'r', NOW]], CX, 1210, 44); lab('cada potencia de 2 supera a todas las anteriores juntas', CX, 1270, C.mute, { s: 21 }); });
    });
  },
  // 7 · Las potencias dan vueltas: residuo de 2²⁰¹⁹ entre 7 (taller UdeA).
  ciclos(t) {
    stars(t, .3);
    examCard(t, { y: 262, t0: .8, lines: [[['Al dividir ', 'j'], ['2', 'r'], ['2019', 'sp'], [' entre 7, el residuo es:', 'j']]] });
    const rows = [[1, 2, 2], [2, 4, 4], [3, 8, 1], [4, 16, 2], [5, 32, 4], [6, 64, 1]];
    const n = t < 10.4 ? 0 : Math.min(6, Math.floor((t - 10.4) / 1.3) + 1), wx = 800, wy = 720, wr = 140;
    fade(win(t, 3, 9.8), () => lab('2²⁰¹⁹ tiene 608 cifras', CX, 560, BAD, { s: 30 }));
    fade(A(t, 10.2, .6), () => {
      rows.forEach(([e, v, r], i) => fade(A(t, 10.4 + i * 1.3, .4), () => {
        const y = 520 + i * 74; F([['2', 'r'], sp(e), [' = ' + v, 'r']], 230, y, 42, { a: 'l', max: 230 });
        F([['→ residuo ', 'r', C.mute], [String(r), 'r', [BASE, EXP, RES][[2, 4, 1].indexOf(r)]]], 440, y, 34, { a: 'l', g: 0 });
      }));
      [2, 4, 1].forEach((r, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 3, x = wx + wr * Math.cos(a), y = wy + wr * Math.sin(a), c = [BASE, EXP, RES][i]; ring(x, y, 40, c, 3); big(String(r), x, y + 16, C.ink, 44); });
      stroke('rgba(160,180,240,.4)', 2, () => X.arc(wx, wy, wr, 0, 7), { dash: [6, 10], g: 0 });
      const step = t >= 20 ? 2 : (n + 2) % 3, a = -Math.PI / 2 + step * Math.PI * 2 / 3;
      if (n > 0 || t >= 20) arrow(wx, wy, wx + (wr - 52) * Math.cos(a), wy + (wr - 52) * Math.sin(a), NOW, 1, 4);
    });
    fade(A(t, 20.2, .6), () => {
      F([['2019 = 3 · 673', 'r']], CX, 1030, 56);
      fade(A(t, 21.6, .5), () => lab('cada 3 pasos vuelve al 1, como 2³ = 8 = 7 + 1', CX, 1100, NOW, { s: 24 }));
      fade(A(t, 23.4, .5), () => F([['residuo ', 'r'], ['1', 'r', RES]], CX, 1200, 64));
    });
  },
  // 8 · Raíces y estimación.
  raices(t) {
    stars(t, .3);
    fade(win(t, .8, 19.8), () => {
      const w1 = rad(150, 440, 72, '72', C.ink); T('=', 150 + w1 + 40, 440, { k: 'r', s: 72, a: 'c' });
      fade(A(t, 2.4, .5), () => rad(150 + w1 + 80, 440, 72, '36 · 2', C.ink, { ic: C.ink }));
      fade(A(t, 4.4, .5), () => { const x = 360; T('=', x - 60, 580, { k: 'r', s: 72, a: 'c' }); big('6', x, 580, RES, 72, { a: 'l' }); rad(x + 44, 580, 72, '2', RES); lab('36 = 6 · 6 sale de la raíz', CX + 120, 660, NOW, { s: 22 }); });
    });
    fade(win(t, 10.2, 19.8), () => {
      const x = 260, yb = 1230, u = 50, k = eo(seg(t, 10.4, 12.6));
      [[9, MORE, '81'], [Math.sqrt(72), NOW, '72'], [8, BASE, '64']].forEach(([s, c, l], i) => fade(clamp(k * 3 - i), () => { const L = s * u; stroke(c, i === 1 ? 4 : 2.5, () => X.rect(x, yb - L, L, L), { g: i === 1 ? 16 : 8 }); lab(l, x + L + 14, yb - L + 30, c, { a: 'l', s: 26 }); }));
      fade(A(t, 13.6, .5), () => { lab('√72 entre 8 y 9', 870, 1060, NOW, { s: 26 }); big('≈ 8.5', 870, 1140, RES, 56); });
    });
    fade(A(t, 20.2, .6), () => {
      F([['49.7 · 20.3', 'r']], CX, 460, 72);
      fade(A(t, 21.2, .5), () => F([['≈ 50 · 20 = ', 'r'], ['1 000', 'r', NOW]], CX, 580, 60));
      [['100.891', false], ['1 008.91', true], ['10 089.1', false]].forEach(([s, ok], i) => fade(A(t, 22.6 + i * .3, .4), () => {
        const x = 220 + i * 320, y = 760; chip(x, y, 280, 90, ok ? RES : C.dim, s, { s: 40, c: ok ? RES : C.mute });
        if (!ok) fade(A(t, 24.4, .4), () => stroke(BAD, 3, () => { X.moveTo(x - 110, y); X.lineTo(x + 110, y); }, { g: 8 }));
      }));
      fade(A(t, 24.6, .5), () => lab('las opciones lejanas se descartan', CX, 900, NOW, { s: 26 }));
    });
  },
  // 9 · Las cuentas de María, resueltas.
  resolver(t) {
    stars(t, .3);
    const cw = 76, xs = digitsRow('10000000000', CX, 470, cw, 76, i => (i ? EXP : C.ink));
    lab('10¹⁰: un 1 y diez ceros', CX, 380, EXP, { s: 24 });
    fade(A(t, 2.6, .5), () => { big('− 51', xs(10) + 30, 580, BAD, 70, { a: 'r' }); stroke('rgba(225,232,255,.8)', 3, () => { X.moveTo(xs(0) - 40, 620); X.lineTo(xs(10) + 40, 620); }, { g: 4 }); });
    fade(A(t, 4.4, .6), () => digitsRow(' 9999999949', CX, 720, cw, 76, i => (i < 9 ? NOW : i === 9 ? EXP : C.violet)));
    fade(A(t, 10.2, .6), () => {
      brace(xs(1) - 30, xs(8) + 30, 760, NOW, eo(seg(t, 10.2, 11.2)));
      lab('8 nueves: 8 · 9 = 72', (xs(1) + xs(8)) / 2, 850, NOW, { s: 26 });
      fade(A(t, 12.4, .5), () => F([['72 + 4 + 9 = ', 'r'], ['85', 'r', RES]], CX, 980, 64));
    });
    fade(A(t, 20.2, .6), () => {
      F([['10', 'r'], sp(5), [' − 51 = 99 949', 'r']], CX, 1130, 48);
      fade(A(t, 21.6, .5), () => F([['3 · 9 + 4 + 9 = 27 + 13 = ', 'r'], ['40', 'r', RES]], CX, 1220, 44, { max: 940 }));
      check(CX, 1300, 22, true, A(t, 23, .6));
    });
  },
  // 10 · Cierre: la opción C, resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => {
      ['75', '90', '85', '80'].forEach((r, i) => {
        const x = 195 + i * 230, ok = i === 2;
        stroke(ok ? RES : C.dim, 3, () => X.roundRect(x - 95, 600, 190, 180, 24), { g: ok ? 18 : 4 });
        T('ABCD'[i], x, 650, { k: 'mono', s: 26, a: 'c', c: C.mute });
        big(r, x, 740, ok ? RES : C.dim, 76);
        check(x, 830, 20, ok, A(t, 1.5 + i * .4, .6));
      });
      fade(A(t, 3.5, .6), () => F([['10', 'r'], sp(10), [' − 51 = 9 999 999 949 → 85', 'r']], CX, 990, 44, { max: 940 }));
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['5', 'r'], sp(3), [' = 125', 'r']], 'la base se repite'], [[['2', 'r'], sp(3), [' · 2', 'r'], sp(4), [' = 2', 'r'], sp(7)], 'se suman'], [[['1.2', 'r'], sp(2), [' = 1.44', 'r']], 'el área: + 44 %'], [[['2, 4, 1, 2, 4, 1…', 'r']], 'dan vueltas']], 420, 170, 42);
      endCard(t, 19.6, D.TITLE, D.LINE, [BASE, NOW, EXP]);
    });
  },
};
