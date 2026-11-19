// «Fracciones» · escenas de la lección pu-cm-2 (Preuniversitario UdeA). Motor en kit.js y preu.js; guion en
// fracciones.data.js. Los cortes (denominador) en cian, lo que se toma (numerador) en ámbar, lo que se quita en rosa,
// el resultado en verde y lo que se hace ahora en lima.
const CUT = C.cyan, TAKE = C.amber, GONE = C.mag, RES = C.green, NOW = C.lime;
// Fracción apilada con el numerador y el denominador de distinto color.
function FR2(n, d, x, y, s, cn = TAKE, cd = CUT, k = 1) {
  fade(k, () => {
    X.font = font('r', s); const w = Math.max(X.measureText(String(n)).width, X.measureText(String(d)).width) + s * .25;
    T(String(n), x, y - s * .2, { k: 'r', s, a: 'c', c: cn, g: 10 }); T(String(d), x, y + s * .82, { k: 'r', s, a: 'c', c: cd, g: 10 });
    stroke(C.ink, Math.max(2, s * .06), () => { X.moveTo(x - w / 2, y); X.lineTo(x + w / 2, y); }, { g: 6 });
  });
}
const lab = (s, x, y, c = C.mute, o = {}) => T(s, x, y, { k: 'mono', s: o.s || 24, a: o.a || 'c', c, ls: 1, max: o.max });
// Llave horizontal bajo (o sobre, dir = −1) el tramo x0–x1 a la altura y.
function brace(x0, x1, y, col, k = 1, dir = 1) {
  if (k <= 0) return; const m = (x0 + x1) / 2, h = 18 * dir;
  stroke(col, 2.5, () => { X.moveTo(x0, y); X.quadraticCurveTo(x0, y + h, x0 + 20, y + h); X.lineTo(lerp(m, x0 + 20, 1 - k) - 10, y + h); X.quadraticCurveTo(m, y + h, m, y + 2 * h); X.moveTo(m, y + 2 * h); X.quadraticCurveTo(m, y + h, m + 10, y + h); X.lineTo(lerp(m, x1 - 20, k), y + h); X.quadraticCurveTo(x1, y + h, x1, y); }, { g: 8 });
}
const S = {
  // 1 · El reto: la pregunta de las tortas (UdeA 2024-2).
  reto(t) {
    stars(t, .6);
    examCard(t, { tag: 'RETO', y: 262, t0: 1, lines: ['Luis recibió varias tortas idénticas. Se comió', 'un tercio de una y notó que una torta completa', 'era el 60 % de las tortas que le quedaron.', 'La cantidad de tortas que recibió fue:'], opts: ['3', '2', '5', '4'], ok: 1 });
    fade(A(t, 10.2, .6), () => {
      cake(260, 1060, 118, 3, 2, TAKE, { eaten: 1, k: eo(seg(t, 10.2, 11.4)) });
      lab('se comió 1/3', 260, 1236, GONE);
      fade(A(t, 12.4, .6), () => {
        cake(820, 1060, 118, 1, 1, TAKE);
        lab('1 torta entera', 820, 1236, TAKE);
        T('=', 540, 1080, { k: 'r', s: 70, a: 'c', c: C.mute });
        F([['60 % = ', 'r'], ['3/5', 'r', NOW]], 540, 1000, 44);
        lab('de lo que le quedó', 540, 1160, NOW);
      });
    });
    fade(A(t, 20.2, .6), () => { lab('una sola es correcta', CX, 1330, NOW, { s: 30 }); lab('la respuesta, al final', CX, 1380, C.mute); });
  },
  // 2 · Qué es una fracción: abajo se corta, arriba se cuenta.
  partes(t) {
    stars(t, .3);
    const x = 140, y = 640, w = 800, h = 120;
    fade(A(t, .8, .5), () => {
      FR2(t >= 9.6 ? '3' : '', '8', CX, 420, 96, TAKE, CUT);
      fbar(x, y, w, h, 8, 3, TAKE, { k: eio(seg(t, 1.8, 4.2)), fill: eo(seg(t, 10.4, 13)) });
      fade(A(t, 4, .6), () => { arrow(CX + 70, 470, x + w - 40, y - 10, hexA(CUT, .8), 1, 2.5, { h: 12 }); lab('8 partes iguales', x + w, y + h + 50, CUT, { a: 'r' }); });
      fade(A(t, 12.8, .6), () => { arrow(CX - 70, 360, x + 140, y - 10, hexA(TAKE, .8), 1, 2.5, { h: 12 }); lab('se toman 3', x, y + h + 50, TAKE, { a: 'l' }); });
    });
    fade(A(t, 19.2, .6), () => {
      const y2 = 940, cuts = [0, .18, .62, 1];
      X.save(); X.fillStyle = hexA(GONE, .35); X.fillRect(x + 2, y2 + 2, w * .18 - 4, 96); X.restore();
      stroke('rgba(225,232,255,.85)', 2.5, () => { X.rect(x, y2, w, 100); cuts.slice(1, 3).forEach(c => { X.moveTo(x + w * c, y2); X.lineTo(x + w * c, y2 + 100); }); }, { g: 6 });
      check(x + w + 50, y2 + 50, 24, false, A(t, 20.4, .6)); lab('3 pedazos, pero no son tercios', x, y2 + 150, GONE, { a: 'l' });
      fade(A(t, 22, .6), () => {
        const y3 = 1180; fbar(x, y3, w, 100, 3, 1, TAKE);
        check(x + w + 50, y3 + 50, 24, true, A(t, 22.6, .6)); lab('1/3: una de tres partes iguales', x, y3 + 150, RES, { a: 'l' });
      });
    });
  },
  // 3 · Equivalentes y simplificar.
  equivalentes(t) {
    stars(t, .3);
    fade(win(t, .8, 9.4), () => {
      [[5, 3, .8], [10, 6, 3.2], [20, 12, 5.6]].forEach(([d, n, t0], i) => fade(A(t, t0, .6), () => {
        const y = 420 + i * 190; FR2(n, d, 190, y + 30, 50);
        fbar(310, y, 640, 90, d, n, TAKE, { k: eo(seg(t, t0, t0 + 1.2)), fill: eo(seg(t, t0 + .6, t0 + 1.8)) });
      }));
      fade(A(t, 7, .5), () => stroke(NOW, 3, () => { X.moveTo(310 + 640 * .6, 390); X.lineTo(310 + 640 * .6, 920); }, { dash: [10, 10], g: 12 }));
      fade(A(t, 7.4, .5), () => lab('mismo largo', 310 + 640 * .6, 980, NOW));
    });
    fade(A(t, 9.8, .6), () => {
      fbar(140, 420, 800, 100, 24, 18, TAKE, { fill: eo(seg(t, 10, 11.5)) });
      fade(A(t, 12.6, .6), () => fbar(140, 600, 800, 100, 4, 3, TAKE, { fill: eo(seg(t, 12.8, 14)) }));
      FR2(18, 24, 300, 900, 84);
      fade(A(t, 11.8, .6), () => { arrow(400, 915, 660, 915, NOW, eo(seg(t, 11.8, 12.8)), 3); lab('÷ 6', 530, 880, NOW, { s: 30 }); lab('÷ 6', 530, 975, NOW, { s: 30 }); });
      fade(A(t, 12.8, .6), () => FR2(3, 4, 760, 900, 84, RES, RES));
      fade(A(t, 19.2, .6), () => {
        stroke(NOW, 3, () => { X.moveTo(140 + 600, 390); X.lineTo(140 + 600, 730); }, { dash: [10, 10], g: 12 });
        lab('el valor no cambia: el mismo largo', CX, 1120, NOW, { s: 28 });
        lab('24 pedazos chicos o 4 grandes', CX, 1170, C.mute);
      });
    });
  },
  // 4 · Comparar con el producto cruzado.
  comparar(t) {
    stars(t, .3);
    const y = 470;
    fade(A(t, .8, .6), () => { FR2(4, 7, 330, y, 90); FR2(5, 9, 750, y, 90); T(t > 21 ? '>' : 'vs', 540, y + 30, { k: t > 21 ? 'r' : 'mono', s: t > 21 ? 90 : 34, a: 'c', c: t > 21 ? RES : C.mute }); });
    // Barras: en sétimos y novenos; luego las dos en 63 pedazos.
    const re = seg(t, 19.6, 20.6);
    fade(A(t, 2, .6), () => {
      fade(1 - re, () => { fbar(140, 680, 800, 80, 7, 4, TAKE, { fill: eo(seg(t, 2.4, 4)) }); fbar(140, 800, 800, 80, 9, 5, TAKE, { fill: eo(seg(t, 3.2, 4.8)) }); });
      fade(re, () => { fbar(140, 680, 800, 80, 63, 36, TAKE); fbar(140, 800, 800, 80, 63, 35, TAKE); lab('36/63', 940, 664, RES, { a: 'r' }); lab('35/63', 940, 904, C.mute, { a: 'r' }); });
      lab('4/7', 120, 732, C.mute, { a: 'r' }); lab('5/9', 120, 852, C.mute, { a: 'r' });
    });
    fade(A(t, 10, .5), () => {
      const k1 = eo(seg(t, 10.2, 11.2)), k2 = eo(seg(t, 13, 14));
      stroke(NOW, 3, () => { X.moveTo(370, y - 40); X.lineTo(lerp(370, 710, k1), lerp(y - 40, y + 70, k1)); }, { g: 12 });
      fade(A(t, 11.2, .5), () => F([['4 · 9 = ', 'r'], ['36', 'r', NOW]], 330, 320, 52));
      fade(A(t, 13, .5), () => { stroke(C.violet, 3, () => { X.moveTo(710, y - 40); X.lineTo(lerp(710, 370, k2), lerp(y - 40, y + 70, k2)); }, { g: 12 }); });
      fade(A(t, 14, .5), () => F([['5 · 7 = ', 'r'], ['35', 'r', C.violet]], 750, 320, 52));
    });
    fade(A(t, 21, .6), () => { F([['4/7 > 5/9', 'r', RES]], CX, 1060, 72); lab('36 sesenta y tresavos contra 35', CX, 1130, C.mute); });
  },
  // 5 · La fracción de una cantidad: 2/7 de 35.
  cantidad(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { FR2(2, 7, 430, 400, 80); T('de 35', 500, 430, { k: 'r', s: 80, c: C.ink }); });
    const R = rng(5), home = Array.from({ length: 35 }, () => [150 + R() * 780, 560 + R() * 380]);
    const k = eio(seg(t, 3.4, 6.4)), g = 112, x0 = CX - 3 * g, y0 = 600;
    fade(A(t, 9.8, .6), () => { for (let c = 0; c < 7; c++) stroke(c < 2 && t > 13 ? TAKE : 'rgba(160,180,240,.5)', 2, () => X.roundRect(x0 + c * g - 44, y0 - 40, 88, 4 * 76 + 80, 22), { g: c < 2 && t > 13 ? 14 : 0 }); });
    fade(A(t, 1.6, .6), () => {
      for (let i = 0; i < 35; i++) {
        const c = Math.floor(i / 5), r = i % 5, x = lerp(home[i][0], x0 + c * g, k), yy = lerp(home[i][1], y0 + r * 76, k);
        dot(x, yy, 14, c < 2 && t > 13 ? TAKE : CUT, 14);
      }
    });
    fade(A(t, 10.6, .5), () => lab('7 grupos de 5', CX, 1050, CUT, { s: 28 }));
    fade(A(t, 11.4, .5), () => F([['35 ÷ 7 = 5', 'r']], CX, 1140, 56));
    fade(A(t, 14, .5), () => F([['2 · 5 = ', 'r'], ['10', 'r', RES]], CX, 1230, 56));
    fade(A(t, 19.4, .6), () => { lab('dividir primero, multiplicar después', CX, 1320, NOW, { s: 28 }); F([['2 · 35 = 70,  70 ÷ 7 = 10', 'r', C.dim]], CX, 1390, 34); });
  },
  // 6 · Sumar pedazos iguales: 1/4 + 1/6.
  sumar(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { FR2(1, 4, 400, 390, 72); T('+', 540, 420, { k: 'r', s: 72, a: 'c' }); FR2(1, 6, 680, 390, 72); });
    const re = seg(t, 10.4, 11.6);
    fade(A(t, 1.6, .6), () => {
      fade(1 - re, () => { fbar(140, 560, 800, 90, 4, 1, TAKE); fbar(140, 690, 800, 90, 6, 1, C.violet); });
      fade(re, () => { fbar(140, 560, 800, 90, 12, 3, TAKE); fbar(140, 690, 800, 90, 12, 2, C.violet); lab('3/12', 940, 546, TAKE, { a: 'r' }); lab('2/12', 940, 676, C.violet, { a: 'r' }); });
    });
    fade(win(t, 4.4, 9.8), () => { F([['≠ 2/10', 'r', GONE]], CX, 900, 60); lab('no se suman arriba con arriba y abajo con abajo', CX, 970, GONE, { s: 22 }); });
    fade(A(t, 12.6, .6), () => lab('12 = 4 · 3 = 6 · 2', CX, 880, NOW, { s: 30 }));
    fade(A(t, 20.2, .6), () => {
      fbar(140, 960, 800, 90, 12, 5, TAKE, { cols: [TAKE, TAKE, TAKE, C.violet, C.violet], fill: eo(seg(t, 20.4, 22)) });
      fade(A(t, 22, .6), () => F([['1/4 + 1/6 = 3/12 + 2/12 = ', 'r'], ['5/12', 'r', RES]], CX, 1200, 50, { max: 920 }));
    });
  },
  // 7 · La fracción del resto: 1/3 y luego 1/4 de lo que queda.
  resto(t) {
    stars(t, .3);
    const x = 140, w = 800;
    fade(A(t, .8, .6), () => { T('120 000', CX, 380, { k: 'r', s: 70, a: 'c' }); lab('pesos de Sara', CX, 420 + 10, C.mute); });
    fade(A(t, 1.6, .6), () => {
      fbar(x, 480, w, 100, 3, 1, GONE, { fill: eo(seg(t, 3, 4)) });
      fade(A(t, 4, .5), () => { lab('libro: 40 000', x + w / 6, 630, GONE); lab('quedan 80 000', x + w * 2 / 3, 630, CUT); });
      fade(A(t, 4.6, .5), () => { X.save(); X.fillStyle = hexA(CUT, .18); X.fillRect(x + w / 3 + 2, 482, w * 2 / 3 - 4, 96); X.restore(); });
    });
    fade(A(t, 10.2, .6), () => {
      const xr = x + w / 3, wr = w * 2 / 3;
      fbar(xr, 720, wr, 100, 4, 1, GONE, { k: eo(seg(t, 10.4, 11.6)), fill: eo(seg(t, 12, 13)) });
      lab('el resto', xr - 20, 780, CUT, { a: 'r' });
      fade(A(t, 13, .5), () => lab('20 000', xr + wr / 8, 870, GONE));
      fade(win(t, 14, 19.8), () => { F([['1/4 de 120 000 = 30 000', 'r', C.dim]], CX, 1010, 44); stroke(GONE, 3, () => { X.moveTo(300, 996); X.lineTo(780, 996); }, { g: 8 }); lab('no: el cuarto es del resto', CX, 1070, GONE); });
    });
    fade(A(t, 20.2, .6), () => {
      fbar(x, 960, w, 100, 2, 1, RES, { fill: eo(seg(t, 20.4, 21.6)) });
      lab('le quedan 60 000: la mitad', x + w / 4, 1110, RES);
      fade(A(t, 22.6, .6), () => F([['2/3 · 3/4 = ', 'r'], ['1/2', 'r', RES]], CX, 1250, 60));
    });
  },
  // 8 · Pregunta real UdeA 2023-2: el grupo de niñas y niños; se prueban las opciones.
  examen(t) {
    stars(t, .3);
    examCard(t, { y: 262, t0: .8, lines: ['En un grupo hay niñas y niños. Si sale una niña,', '1/7 del resto del grupo son niñas. Si en vez de', 'eso salen dos niños, 1/5 del resto son niñas.', 'El tamaño del grupo original es:'], opts: ['57', '36', '71', '22'], ok: 3, rv: 21, out: { 1: 15, 2: 16.6, 0: 18.2 } });
    fade(win(t, 10.2, 19.8), () => {
      readNote(t, 10.2, 880, '«1/5 del resto son niñas»', 'el resto se reparte en 5 grupos iguales');
      [['36: sin dos niños quedan 34, y 34 no se reparte en 5', 15], ['71: quedan 69, y tampoco', 16.6], ['57: daría 9 niñas en un caso y 11 en el otro', 18.2]]
        .forEach(([s, t0], i) => fade(A(t, t0 - .4, .5), () => lab(s, 120, 1150 + i * 56, C.mute, { a: 'l', s: 25, max: 860 })));
    });
    fade(A(t, 20.2, .6), () => {
      const d = dots(CX, 920, 22, 11, 76, i => (i < 4 ? TAKE : CUT), 15, eo(seg(t, 20.2, 21.6)));
      lab('4 niñas', d.x(1) + 38, 1050, TAKE); lab('18 niños', d.x(7) + 38, 1050, CUT);
      fade(A(t, 22.4, .5), () => lab('22 − 1 niña = 21:  1/7 son 3 niñas', CX, 1150, RES, { s: 26 }));
      fade(A(t, 24.4, .5), () => lab('22 − 2 niños = 20:  1/5 son 4 niñas', CX, 1210, RES, { s: 26 }));
    });
  },
  // 9 · Las tortas resueltas.
  resolver(t) {
    stars(t, .3);
    const x = 140, w = 800, pw = w / 5;
    fade(win(t, .8, 19.8), () => {
      lab('lo que le quedó', CX, 400, C.mute, { s: 26 });
      fbar(x, 440, w, 110, 5, 3, TAKE, { k: eo(seg(t, 1, 2.2)), fill: eo(seg(t, 2.4, 3.6)) });
      fade(A(t, 3.6, .6), () => { brace(x + 4, x + 3 * pw - 4, 570, TAKE, eo(seg(t, 3.6, 4.6))); lab('= 1 torta = 3 tercios', x + 1.5 * pw, 650, TAKE); });
      fade(A(t, 6, .6), () => { for (let i = 0; i < 5; i++) T('1/3', x + (i + .5) * pw, 510, { k: 'r', s: 36, a: 'c', c: i < 3 ? C.ink : NOW }); });
    });
    fade(A(t, 10.2, .6), () => {
      const y = t < 20 ? 900 : lerp(900, 820, eo(seg(t, 20, 21)));
      cake(320, y, 140, 3, 3, TAKE, { k: eo(seg(t, 10.2, 11.4)) });
      cake(760, y, 140, 3, 2, TAKE, { eaten: 1, k: eo(seg(t, 10.6, 11.8)), ghost: GONE, ghostK: A(t, 20.4, .6) });
      fade(A(t, 12, .5), () => F([['5/3 = 1 torta + 2/3', 'r']], CX, y + 230, 48));
      fade(A(t, 20.6, .6), () => lab('el tercio que se comió', 760, y - 172, GONE));
    });
    fade(A(t, 22, .6), () => F([['5/3 + 1/3 = 6/3 = ', 'r'], ['2', 'r', RES]], CX, 1180, 64));
    fade(A(t, 24, .6), () => lab('Luis recibió 2 tortas', CX, 1260, NOW, { s: 30 }));
  },
  // 10 · Cierre: la opción B, resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => {
      ['3', '2', '5', '4'].forEach((r, i) => {
        const x = 195 + i * 230, ok = i === 1;
        stroke(ok ? RES : C.dim, 3, () => X.roundRect(x - 95, 600, 190, 180, 24), { g: ok ? 18 : 4 });
        T('ABCD'[i], x, 650, { k: 'mono', s: 26, a: 'c', c: C.mute });
        T(r, x, 740, { k: 'r', s: 76, a: 'c', c: ok ? RES : C.dim });
        check(x, 830, 20, ok, A(t, 1.5 + i * .4, .6));
      });
      fade(A(t, 3.5, .6), () => { F([['1 torta = 3/5 del resto', 'r']], CX, 990, 46); lab('lo que quedó: 5/3; recibió 5/3 + 1/3 = 2', CX, 1060, C.mute); });
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['3/5 = 6/10', 'r']], 'misma cantidad'], [[['4 · 9 > 5 · 7', 'r']], 'producto cruzado'], [[['1/4 + 1/6 = 5/12', 'r']], 'pedazos iguales'], [[['2/3 · 3/4 = 1/2', 'r']], 'fracción del resto']], 420, 170, 42);
      endCard(t, 19.6, D.TITLE, D.LINE, [CUT, NOW, TAKE]);
    });
  },
};
