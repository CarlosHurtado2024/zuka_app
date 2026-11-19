// «Decimales y porcentajes» · escenas de la lección pu-cm-3 (Preuniversitario UdeA). Motor en kit.js y preu.js; guion
// en porcentajes.data.js. El total (100 %) en cian, la parte en ámbar, lo que se quita en rosa, lo que se agrega en
// violeta, el resultado en verde y lo que se hace ahora en lima.
const TOT = C.cyan, PART = C.amber, DOWN = C.mag, UP = C.violet, RES = C.green, NOW = C.lime;
const lab = (s, x, y, c = C.mute, o = {}) => T(s, x, y, { k: 'mono', s: o.s || 24, a: o.a || 'c', c, ls: 1, max: o.max });
const big = (s, x, y, c = C.ink, sz = 64, o = {}) => T(s, x, y, { k: 'r', s: sz, a: o.a || 'c', c, g: o.g ?? (c === C.ink ? 0 : 12), max: o.max });
// Etiqueta de precio (cuadro con agujero) centrada en (x, y).
function tag(x, y, txt, col, k = 1) {
  fade(k, () => {
    stroke(col, 3, () => { X.moveTo(x - 150, y - 50); X.lineTo(x + 120, y - 50); X.lineTo(x + 170, y); X.lineTo(x + 120, y + 50); X.lineTo(x - 150, y + 50); X.closePath(); }, { g: 14 });
    ring(x + 118, y, 8, col, 2.5);
    big(txt, x - 14, y + 18, C.ink, 50, { max: 250 });
  });
}
const S = {
  // 1 · El reto: los tenis de Carlos (UdeA 2025-2).
  reto(t) {
    stars(t, .6);
    examCard(t, { tag: 'RETO', y: 262, t0: 1, lines: ['Carlos compró unos tenis de $120.000 rebajados', 'un 10 %. Al pagar le cobraron un impuesto del', '10 % por ser importados. Lo que pagó finalmente', 'Carlos por sus zapatos fue:'], opts: ['$120 000', '$118 800', '$108 000', '$117 600'], ok: 1 });
    fade(A(t, 10.2, .6), () => {
      tag(230, 1000, '120 000', TOT);
      arrow(430, 1000, 560, 1000, DOWN, eo(seg(t, 11, 12)), 4); fade(A(t, 11.4, .4), () => lab('− 10 %', 495, 960, DOWN, { s: 28 }));
      fade(A(t, 13, .5), () => { arrow(590, 1000, 720, 1000, UP, eo(seg(t, 13, 14)), 4); lab('+ 10 %', 655, 960, UP, { s: 28 }); });
      fade(A(t, 15, .5), () => { big('120 000', 880, 1018, C.dim, 50); lab('lo que espera Carlos', 880, 1080, C.mute, { s: 20 }); });
    });
    fade(A(t, 20.2, .6), () => { lab('una sola es correcta', CX, 1260, NOW, { s: 30 }); lab('la respuesta, al final', CX, 1310, C.mute); });
  },
  // 2 · Tres caras: 1/4 = 0.25 = 25 %; el 100 % es el total.
  caras(t) {
    stars(t, .3);
    fade(win(t, .8, 18.8), () => {
      grid100(CX, 720, 56, [[25, PART]], eo(seg(t, 2, 6)));
      fade(A(t, 6, .5), () => big('25 %', CX, 1110, PART, 72));
      fade(A(t, 10, .6), () => {
        stroke(NOW, 4, () => X.rect(CX - 280, 440, 280, 280), { g: 16 });
        lab('un cuarto', CX - 140, 420, NOW, { s: 26 });
        F([['1/4', 'r', NOW], ['  =  ', 'r'], ['0.25', 'r', TOT], ['  =  ', 'r'], ['25 %', 'r', PART]], CX, 1200, 60);
      });
    });
    fade(A(t, 19.2, .6), () => {
      grid100(310, 720, 38, [[100, TOT]], eo(seg(t, 19.2, 20.6)));
      grid100(770, 720, 38, [[20, UP]], eo(seg(t, 21, 22)));
      big('100 %', 310, 1000, TOT, 56); big('+ 20 %', 770, 1000, UP, 56);
      fade(A(t, 22.4, .6), () => { F([['120 %', 'r', RES], [' = 1.2 veces el total', 'r']], CX, 1140, 52); });
    });
  },
  // 3 · De fracción a decimal y a porcentaje; un decimal que se repite.
  decimal(t) {
    stars(t, .3);
    fade(win(t, .8, 18.8), () => {
      F([['3/8 = 3 ÷ 8', 'r']], CX, 420, 76);
      const rows = [['30 ÷ 8 = 3', 'sobran 6'], ['60 ÷ 8 = 7', 'sobran 4'], ['40 ÷ 8 = 5', 'sobra 0']];
      rows.forEach(([a, b], i) => fade(A(t, 2.2 + i * 1.6, .5), () => { lab(a, 400, 560 + i * 70, C.ink, { s: 30, a: 'r' }); lab(b, 460, 560 + i * 70, C.mute, { s: 26, a: 'l' }); }));
      const k = eo(seg(t, 10.8, 13.2)), digits = '0375';
      fade(A(t, 6.6, .6), () => {
        // 0.375 → 37.5 %: el punto corre dos lugares.
        const y = 900, cw = 64, x0 = CX - 2.5 * cw;
        [...digits].forEach((d, i) => big(d, x0 + i * cw + (i ? cw * .3 : 0), y, i === 0 && k > .5 ? C.dim : C.ink, 96, { a: 'c' }));
        const px = lerp(x0 + cw * .65, x0 + cw * 2.8, k);
        dot(px, y - 6, 7, NOW, 14);
        fade(A(t, 13.4, .5), () => big('%', x0 + 4 * cw + 40, y, PART, 96));
        fade(A(t, 11, .5), () => { hop(x0 + cw * .65, x0 + cw * 1.8, y + 30, -40, NOW, eo(seg(t, 11, 12)), 3); hop(x0 + cw * 1.8, x0 + cw * 2.8, y + 30, -40, NOW, eo(seg(t, 12, 13)), 3); });
        fade(A(t, 13.6, .5), () => F([['0.375 = ', 'r'], ['37.5 %', 'r', RES]], CX, 1080, 56));
      });
    });
    fade(A(t, 19.2, .6), () => {
      F([['1/13 = 1 ÷ 13', 'r']], CX, 460, 70);
      const s = '076923076923076923', cw = 46, x0 = CX - (s.length + 2) * cw / 2;
      big('0.', x0 + cw * .4, 700, C.ink, 70);
      [...s].forEach((d, i) => fade(A(t, 20 + i * .12, .3), () => big(d, x0 + (i + 2.3) * cw, 700, Math.floor(i / 6) % 2 ? UP : TOT, 70)));
      fade(A(t, 22.4, .5), () => { for (let b = 0; b < 3; b++) brace(x0 + (b * 6 + 1.6) * cw, x0 + (b * 6 + 7.4) * cw, 740, b % 2 ? UP : TOT, eo(seg(t, 22.4 + b * .3, 23.2 + b * .3))); lab('el mismo bloque de 6 cifras, para siempre', CX, 870, NOW, { s: 26 }); });
    });
  },
  // 4 · Taller UdeA: la suma de las 2019 primeras cifras de 1/13.
  bloque(t) {
    stars(t, .3);
    examCard(t, { y: 262, t0: .8, lines: [[['1/13 = 0.076923076923…', 'r']], 'La suma de los primeros 2019 dígitos que', 'aparecen después del punto decimal es:'], opts: ['6085', '7085', '8085', '9085'], ok: 3, rv: 24 });
    fade(A(t, 10.2, .6), () => {
      const y = 920, w = 200;
      [0, 1, 2].forEach(b => fade(A(t, 10.4 + b * .5, .4), () => { chip(170 + b * 230, y, w, 80, b % 2 ? UP : TOT, '076923', { s: 40 }); lab('suma 27', 170 + b * 230, y + 80, b % 2 ? UP : TOT); }));
      fade(A(t, 12, .4), () => big('…', 830, y + 14, C.mute, 60));
      fade(A(t, 13.4, .5), () => F([['0 + 7 + 6 + 9 + 2 + 3 = ', 'r'], ['27', 'r', NOW]], CX, 1100, 44));
    });
    fade(A(t, 20.2, .6), () => {
      F([['2019 = 336 · 6 + ', 'r'], ['3', 'r', NOW]], CX, 1190, 50);
      fade(A(t, 21.8, .5), () => lab('336 bloques completos y sobran 0, 7, 6', CX, 1250, C.mute));
      fade(A(t, 23, .5), () => F([['336 · 27 + 13 = ', 'r'], ['9085', 'r', RES]], CX, 1350, 56));
    });
  },
  // 5 · Comparar: todo a decimal y a la recta.
  comparar(t) {
    stars(t, .3);
    const items = [['2/5', 0.40, PART], ['0.38', 0.38, TOT], ['41 %', 0.41, UP]];
    items.forEach(([s, v, c], i) => fade(A(t, 1 + i * .6, .5), () => {
      const x = 240 + i * 300;
      chip(x, 470, 220, 110, c, s, { s: 56 });
      fade(A(t, 10.2 + i * 1.2, .5), () => { arrow(x, 540, x, 610, c, 1, 2.5, { h: 10 }); big(v.toFixed(2), x, 680, c, 52); });
    }));
    fade(A(t, 14, .6), () => {
      const y = 960, px = nline(130, 950, y, .35, .43, { step: .01, s: 24, k: eio(seg(t, 14, 15.5)) });
      items.forEach(([s, v, c], i) => {
        const k = eo(seg(t, 15.6 + i * .8, 16.8 + i * .8)), x = lerp(240 + i * 300, px(v), k), y0 = lerp(700, y - 20, k);
        if (k > 0) { dot(x, k >= 1 ? y : y0, 13, c, 18); if (k >= 1) lab(s, x, y - 50, c, { s: 28 }); }
      });
    });
    fade(A(t, 19.6, .6), () => F([['0.38', 'r', TOT], ['  <  ', 'r'], ['2/5', 'r', PART], ['  <  ', 'r'], ['41 %', 'r', UP]], CX, 1190, 62));
  },
  // 6 · El porcentaje de una cantidad, armado con pedazos: 15 % de 80 000.
  cantidad(t) {
    stars(t, .3);
    const x = 140, w = 800, y = 560;
    fade(A(t, .8, .6), () => {
      big('80 000', CX, 420, C.ink, 70); lab('100 %', CX, 470, TOT);
      fbar(x, y, w, 110, 10, 1, PART, { line: hexA(TOT, .9), fill: eo(seg(t, 3, 4)) });
      fade(A(t, 4, .5), () => { lab('10 % = 8 000', x + 40, y + 160, PART, { s: 26, a: 'l' }); F([['80 000 → ', 'r'], ['8 000', 'r', PART]], CX, 860, 52); lab('el punto corre un lugar', CX, 920, C.mute); });
    });
    fade(A(t, 10, .6), () => {
      X.save(); X.fillStyle = hexA(NOW, .5); X.shadowColor = NOW; X.shadowBlur = 12; X.fillRect(x + 82, y + 2, 40 * eo(seg(t, 10.4, 11.4)) - 2, 106); X.restore();
      lab('5 % = 4 000', x + 120, y + 210, NOW, { s: 26, a: 'l' });
      fade(A(t, 12.6, .5), () => F([['15 % = 8 000 + 4 000 = ', 'r'], ['12 000', 'r', RES]], CX, 1040, 50, { max: 920 }));
    });
    fade(A(t, 19.4, .6), () => {
      [['50 %', 'la mitad'], ['25 %', 'la cuarta parte'], ['10 %', 'correr el punto'], ['1 %', 'dos lugares']].forEach(([a, b], i) => fade(A(t, 19.6 + i * .5, .4), () => {
        const xx = 170 + i * 247; chip(xx, 1190, 210, 74, i % 2 ? UP : PART, a, { s: 40 }); lab(b, xx, 1270, C.mute, { s: 20 });
      }));
    });
  },
  // 7 · Subir y bajar es multiplicar por un factor.
  factor(t) {
    stars(t, .3);
    const x = 140, ux = 600;   // 100 % = 600 px
    fade(A(t, .8, .6), () => { bar(x, 440, ux, 90, TOT, eo(seg(t, .8, 2))); lab('250 000 = 100 %', x, 420, TOT, { a: 'l' }); });
    fade(A(t, 2.4, .6), () => {
      bar(x, 600, ux * .8, 90, RES, eo(seg(t, 2.6, 4)));
      fade(A(t, 4, .5), () => { X.save(); X.setLineDash([8, 8]); X.strokeStyle = DOWN; X.lineWidth = 2.5; X.strokeRect(x + ux * .8, 600, ux * .2, 90); X.restore(); lab('− 20 %', x + ux * .9, 728, DOWN); });
      lab('80 %', x, 580, RES, { a: 'l' });
      fade(A(t, 5, .5), () => F([['250 000 · 0.8 = ', 'r'], ['200 000', 'r', RES]], CX, 820, 48));
    });
    fade(A(t, 10.2, .6), () => {
      bar(x, 920, ux * 1.2, 90, UP, eo(seg(t, 10.4, 12)));
      fade(A(t, 12, .5), () => { stroke(TOT, 2.5, () => { X.moveTo(x + ux, 905); X.lineTo(x + ux, 1025); }, { dash: [8, 8] }); lab('+ 20 %', x + ux * 1.1, 1060, UP); });
      lab('120 %', x, 900, UP, { a: 'l' });
      fade(A(t, 13, .5), () => F([['250 000 · 1.2 = ', 'r'], ['300 000', 'r', RES]], CX, 1150, 48));
    });
    fade(A(t, 20.2, .6), () => {
      chip(330, 1290, 300, 90, DOWN, 'baja → · 0.8', { s: 34 }); chip(750, 1290, 300, 90, UP, 'sube → · 1.2', { s: 34 });
      lab('un solo paso', CX, 1390, NOW, { s: 28 });
    });
  },
  // 8 · Pregunta real UdeA 2026-1: la barra de chocolate.
  examen(t) {
    stars(t, .3);
    examCard(t, { y: 262, t0: .8, lines: ['Humberto recibe el 40 % de una barra de chocolate,', 'Iván el 25 % y Javier el resto, que pesa 70 gramos.', 'El peso total de la barra, en gramos, es:'], opts: ['200', '240', '160', '280'], ok: 0, rv: 22 });
    const x = 140, w = 800, y = 880;
    fade(A(t, 3, .6), () => {
      const parts = [[.40, PART, 'Humberto 40 %'], [.25, UP, 'Iván 25 %'], [.35, NOW, 'Javier ']];
      let x0 = x;
      parts.forEach(([p, c, s], i) => {
        const k = i < 2 ? eo(seg(t, 3 + i * .8, 4 + i * .8)) : eo(seg(t, 10.6, 12));
        bar(x0, y, w * p, 100, c, k, { fill: .3 });
        if (k >= 1) lab(i < 2 ? s : t > 12.6 ? 'Javier 35 %' : 'Javier: el resto', x0 + w * p / 2, y + 150, c, { s: 22 });
        x0 += w * p;
      });
      fade(A(t, 6, .5), () => big('70 g', x + w * .825, y + 66, C.ink, 44));
    });
    fade(A(t, 12.6, .6), () => F([['100 − 40 − 25 = ', 'r'], ['35', 'r', NOW], [' %', 'r', NOW]], CX, 1130, 50));
    fade(A(t, 20.2, .6), () => stepsDown(t, 20.2, 1.6, [[[['35 % = 70 g', 'r']]], [[['1 % = 2 g', 'r', NOW]]], [[['100 % = ', 'r'], ['200 g', 'r', RES]]]], 1230, 100, 46));
  },
  // 9 · Los tenis resueltos: · 0.9 y luego · 1.1.
  resolver(t) {
    stars(t, .3);
    const x = 140, ux = 800 / 120000;
    fade(A(t, .8, .6), () => { bar(x, 420, 120000 * ux, 90, TOT); lab('120 000', x, 400, TOT, { a: 'l' }); });
    fade(A(t, 1.8, .6), () => {
      bar(x, 590, 108000 * ux, 90, DOWN, eo(seg(t, 2, 3.4)), { fill: .25 });
      lab('· 0.9 → 108 000', x, 570, DOWN, { a: 'l' });
      fade(A(t, 3.8, .5), () => lab('rebaja: 12 000', x + 760, 700 + 20, C.mute, { a: 'r', s: 22 }));
    });
    fade(A(t, 10.2, .6), () => {
      bar(x, 790, 108000 * ux, 90, DOWN, 1, { fill: .25 });
      bar(x + 108000 * ux, 790, 10800 * ux, 90, UP, eo(seg(t, 10.6, 12)), { fill: .4 });
      lab('· 1.1 → 118 800', x, 770, UP, { a: 'l' });
      fade(A(t, 12.4, .5), () => { lab('impuesto: 10 % de 108 000 = 10 800', CX, 930, UP, { s: 22 }); stroke(TOT, 2.5, () => { X.moveTo(x + 800, 400); X.lineTo(x + 800, 900); }, { dash: [8, 8] }); });
    });
    fade(A(t, 20.2, .6), () => {
      F([['0.9 · 1.1 = ', 'r'], ['0.99', 'r', RES]], CX, 1080, 64);
      lab('pagó el 99 %: 1 200 menos que el precio de lista', CX, 1150, NOW, { s: 24 });
      fade(A(t, 23, .5), () => { lab('el 10 % que se quita y el que se pone', CX, 1240, C.mute, { s: 22 }); lab('se calculan sobre bases distintas', CX, 1280, C.mute, { s: 22 }); });
    });
  },
  // 10 · Cierre: la opción B, resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => {
      ['120 000', '118 800', '108 000', '117 600'].forEach((r, i) => {
        const x = 300 + (i % 2) * 480, y = 620 + Math.floor(i / 2) * 200, ok = i === 1;
        stroke(ok ? RES : C.dim, 3, () => X.roundRect(x - 200, y - 70, 400, 140, 24), { g: ok ? 18 : 4 });
        T('ABCD'[i], x - 170, y + 10, { k: 'mono', s: 26, c: C.mute });
        big(r, x + 20, y + 20, ok ? RES : C.dim, 56);
        check(x + 160, y, 18, ok, A(t, 1.5 + i * .4, .6));
      });
      fade(A(t, 3.5, .6), () => F([['120 000 · 0.9 · 1.1 = 118 800', 'r']], CX, 1060, 44));
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['1/4 = 0.25 = 25 %', 'r']], 'tres caras'], [[['15 % = 10 % + 5 %', 'r']], 'pedazos fáciles'], [[['−20 % → · 0.8', 'r']], 'cada cambio, un factor'], [[['0.85 · 0.8 = 0.68', 'r']], '−15 % y −20 %: −32 %']], 420, 170, 42);
      endCard(t, 19.6, D.TITLE, D.LINE, [TOT, NOW, PART]);
    });
  },
};
// Llave horizontal (para los bloques que se repiten).
function brace(x0, x1, y, col, k = 1) {
  if (k <= 0) return; const m = (x0 + x1) / 2, h = 18;
  stroke(col, 2.5, () => { X.moveTo(x0, y); X.quadraticCurveTo(x0, y + h, x0 + 20, y + h); X.lineTo(lerp(m, x0 + 20, 1 - k) - 10, y + h); X.quadraticCurveTo(m, y + h, m, y + 2 * h); X.moveTo(m, y + 2 * h); X.quadraticCurveTo(m, y + h, m + 10, y + h); X.lineTo(lerp(m, x1 - 20, k), y + h); X.quadraticCurveTo(x1, y + h, x1, y); }, { g: 8 });
}
