// «El factor escondido» · escenas de la lección alg-13c. Motor en kit.js y escala.js; guion en aumentos.data.js.
// Lo que sube en verde, lo que baja en rosa, el valor de antes (la referencia, el 100 %) en cian, el factor en ámbar.
const UP = C.green, DN = C.mag, REF = C.cyan, FA = C.amber;
// Recta de factores de 0 a 2 con el 1 en el centro; devuelve px(v).
function factorLine(y, k = 1) {
  const px = nline(140, 940, y, 0, 2, { step: .25, lab: v => Math.abs(v * 2 - Math.round(v * 2)) < 1e-9, k, s: 30 });
  if (k > .9) { T('baja', px(.5), y - 40, { k: 'mono', s: 22, a: 'c', c: DN }); T('sube', px(1.5), y - 40, { k: 'mono', s: 22, a: 'c', c: UP }); T('igual', px(1), y - 40, { k: 'mono', s: 22, a: 'c', c: C.ink }); }
  return px;
}
const S = {
  // 1 · La cuenta del restaurante: consumo, propina sugerida del 10 % y total.
  propina(t) {
    stars(t, .5);
    stroke('rgba(225,232,255,.75)', 2.5, () => X.roundRect(250, 420, 580, 620, 20), { g: 8 });
    T('CUENTA', CX, 500, { k: 'mono', s: 30, a: 'c', c: C.ink, ls: 8 });
    stroke('rgba(200,210,245,.4)', 1.5, () => { X.moveTo(290, 540); X.lineTo(790, 540); }, { g: 0, dash: [6, 8] });
    fade(A(t, 1.4, .5), () => { T('consumo', 290, 630, { k: 'mono', s: 28, c: C.ink }); T('100 000', 790, 630, { k: 'mono', s: 28, a: 'r', c: REF }); });
    fade(A(t, 9.8, .5), () => { T('propina sugerida 10 %', 290, 720, { k: 'mono', s: 28, c: FA }); T('10 000', 790, 720, { k: 'mono', s: 28, a: 'r', c: FA }); T('voluntaria', 290, 762, { k: 'mono', s: 20, c: C.mute }); });
    fade(A(t, 13, .5), () => { stroke('rgba(200,210,245,.4)', 1.5, () => { X.moveTo(290, 830); X.lineTo(790, 830); }, { g: 0 }); T('total', 290, 910, { k: 'mono', s: 34, c: C.ink }); T('110 000', 790, 910, { k: 'mono', s: 34, a: 'r', c: UP, g: 10 }); });
    fade(A(t, 2.4, .5), () => T('Ley 1935 de 2018 · Colombia', CX, 1100, { k: 'mono', s: 22, c: C.mute, a: 'c' }));
    fade(A(t, 18.8, .7), () => { chip(CX, 1230, 380, 120, FA, '× factor', { k: 'it', s: 60, c: FA, g: 22 }); });
  },
  // 2 · Un descuento del 25 %: se va un cuarto, quedan tres; P − 0.25P = 0.75P.
  descuento(t) {
    stars(t, .3);
    const cut = eio(seg(t, 3, 6)), x0 = 140, w = 800;
    for (let i = 0; i < 4; i++) { const off = i === 3; fade(off ? 1 - cut * .8 : 1, () => bar(x0 + i * w / 4 + 3, 520 + (off ? cut * 60 : 0), w / 4 - 6, 100, off ? DN : REF, 1, { fill: off ? .15 : .3 })); }
    T('precio P', x0, 480, { k: 'mono', s: 24, c: REF }); fade(cut, () => { T('−25 %', x0 + w * 7 / 8, 740, { k: 'r', s: 40, a: 'c', c: DN }); T('75 %', x0 + w * 3 / 8, 690, { k: 'r', s: 48, a: 'c', c: REF, g: 10 }); });
    fade(A(t, 10.2, .6), () => F([['P', 'i', REF], [' − 0.25', 'r', DN], ['P', 'i', REF], [' = (1 − 0.25)', 'r'], ['P', 'i', REF], [' = ', 'r'], ['0.75', 'r', FA], ['P', 'i', REF]], CX, 900, 58, { rev: seg(t, 10.4, 15), max: 940 }));
    fade(A(t, 19.2, .6), () => { F([['120 000 · ', 'r', REF], ['0.75', 'r', FA], [' = ', 'r'], ['90 000', 'r', DN]], CX, 1060, 64); T('factor', CX + 10, 1130, { k: 'mono', s: 24, c: FA, a: 'c' }); });
  },
  // 3 · El factor: 1 + r/100 y 1 − r/100 sobre la recta de factores.
  factor(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { T('aumentar', 300, 470, { k: 'it', s: 40, a: 'c', c: UP }); F([['× (1 + ', 'r'], ['r', 'i', UP], ['/100)', 'r']], 300, 560, 60); });
    fade(A(t, 10, .6), () => { T('descontar', 780, 470, { k: 'it', s: 40, a: 'c', c: DN }); F([['× (1 − ', 'r'], ['r', 'i', DN], ['/100)', 'r']], 780, 560, 60); });
    fade(A(t, 3, .6), () => {
      const px = factorLine(900, eo(seg(t, 3, 5)));
      const v = t < 10 ? 1 + .35 * eio(seg(t, 5, 8)) : t < 20 ? lerp(1.35, .8, eio(seg(t, 11, 15))) : 1 + .7 * Math.sin((t - 20) * .9), col = v > 1.005 ? UP : v < .995 ? DN : C.ink;
      dot(px(v), 900, 14, col, 28); T('× ' + v.toFixed(2), px(v), 840 - 44, { k: 'r', s: 44, a: 'c', c: col, g: 10 });
      const r = Math.round((v - 1) * 100); T((r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r) + ' %', CX, 1090, { k: 'r', s: 80, a: 'c', c: col, g: 16 });
      bar(CX - 200, 1150, 400 * v, 50, col, 1, { fill: .3 }); stroke(hexA(REF, .7), 2, () => { X.moveTo(CX + 200, 1140); X.lineTo(CX + 200, 1210); }, { g: 0, dash: [6, 6] }); T('100 %', CX + 200, 1250, { k: 'mono', s: 20, a: 'c', c: REF });
    });
  },
  // 4 · El factor de la propina: 100 000 · 1.10 = 110 000.
  propfactor(t) {
    stars(t, .3);
    const x0 = 160, u = 6.4, k = eo(seg(t, 10.4, 12.4));
    bar(x0, 560, 100 * u, 100, REF, 1, { fill: .25 }); T('consumo: 100 000', x0, 520, { k: 'mono', s: 24, c: REF });
    bar(x0 + 100 * u, 560, 10 * u, 100, UP, k, { fill: .5 }); fade(k, () => T('+10 %', x0 + 105 * u, 720, { k: 'mono', s: 24, a: 'c', c: UP }));
    fade(A(t, 1.4, .6), () => F([['1 + 0.10 = ', 'r'], ['1.10', 'r', FA]], CX, 860, 72));
    fade(A(t, 10.4, .6), () => F([['100 000 · ', 'r', REF], ['1.10', 'r', FA], [' = ', 'r'], ['110 000', 'r', UP]], CX, 990, 64, { rev: seg(t, 10.6, 13.6) }));
    fade(A(t, 19.2, .6), () => F([['110 000 − 100 000 = ', 'r'], ['10 000', 'r', UP]], CX, 1120, 56));
    T('factor = 1.10', 96, 1300, { k: 'mono', s: 26, c: FA, g: 8 });
  },
  // 5 · La trampa: quitarle el 10 % a 110 000 da 99 000, no 100 000.
  trampa(t) {
    stars(t, .3);
    const x0 = 160, u = 6.4, cut = eio(seg(t, 11, 14));
    bar(x0, 560, 99 * u, 100, REF, 1, { fill: .25 }); fade(1 - cut * .75, () => bar(x0 + 99 * u, 560 + cut * 70, 11 * u, 100, DN, 1, { fill: .35 }));
    T('cuenta con propina: 110 000', x0, 520, { k: 'mono', s: 24, c: C.ink });
    stroke(UP, 3, () => { X.moveTo(x0 + 100 * u, 530); X.lineTo(x0 + 100 * u, 700); }, { g: 12, dash: [8, 8] }); T('100 000', x0 + 100 * u, 500, { k: 'mono', s: 22, a: 'c', c: UP });
    fade(cut, () => { T('−10 % de 110 000 = −11 000', x0 + 99 * u, 800, { k: 'mono', s: 24, a: 'r', c: DN }); });
    fade(A(t, 10.4, .6), () => F([['110 000 · ', 'r'], ['0.90', 'r', FA], [' = ', 'r'], ['99 000', 'r', DN]], CX, 940, 64, { rev: seg(t, 10.6, 14) }));
    fade(A(t, 14.6, .5), () => { check(CX + 420, 920, 22, false, A(t, 14.6, .5)); T('faltan 1 000', x0 + 99.5 * u, 750, { k: 'mono', s: 22, a: 'c', c: C.red, g: 8 }); });
    fade(A(t, 20.2, .6), () => { F([['10 % de ', 'r'], ['100 000', 'r', UP], [' = 10 000', 'r']], CX, 1070, 50); F([['10 % de ', 'r'], ['110 000', 'r', DN], [' = 11 000', 'r']], CX, 1150, 50); });
  },
  // 6 · Dividir entre el factor: ida × 1.10 y vuelta ÷ 1.10.
  dividir(t) {
    stars(t, .3);
    chip(280, 760, 300, 130, REF, '100 000', { s: 56, c: REF }); chip(800, 760, 300, 130, UP, '110 000', { s: 56, c: UP });
    T('consumo', 280, 870, { k: 'mono', s: 22, a: 'c', c: C.mute }); T('con propina', 800, 870, { k: 'mono', s: 22, a: 'c', c: C.mute });
    const a = eo(seg(t, 1, 3)), b = eo(seg(t, 10.4, 12.4));
    stroke(FA, 4, () => { for (let i = 0; i <= 40 * a; i++) { const u = i / 40, x = lerp(300, 780, u), y = 680 - 110 * Math.sin(Math.PI * u); i ? X.lineTo(x, y) : X.moveTo(x, y); } }); if (a >= 1) arrow(770, 692, 782, 682, FA, 1, 4);
    fade(a, () => T('× 1.10', CX, 540, { k: 'r', s: 56, a: 'c', c: FA, g: 12 }));
    stroke(DN, 4, () => { for (let i = 0; i <= 40 * b; i++) { const u = i / 40, x = lerp(780, 300, u), y = 840 + 110 * Math.sin(Math.PI * u); i ? X.lineTo(x, y) : X.moveTo(x, y); } }); if (b >= 1) arrow(310, 852, 298, 842, DN, 1, 4);
    fade(b, () => T('÷ 1.10', CX, 1010, { k: 'r', s: 56, a: 'c', c: DN, g: 12 }));
    fade(A(t, 12.6, .6), () => F([['110 000 ÷ ', 'r', UP], ['1.10', 'r', FA], [' = ', 'r'], ['100 000', 'r', REF]], CX, 1150, 60));
    fade(A(t, 19.4, .6), () => F([['P', 'i', REF], [' · 1.10 ÷ 1.10 = ', 'r'], ['P', 'i', REF]], CX, 1250, 54));
  },
  // 7 · Cambio porcentual: la entrada de cine de 12 000 a 15 000; 3 000 / 12 000 = 25 %.
  cambio(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { FR('cambio', 'valor de antes', CX, 720, 64, C.ink, { k: 'it', g: 8 }); T('cambio porcentual', CX, 560, { k: 'mono', s: 26, c: C.mute, a: 'c' }); });
    fade(A(t, 10, .6), () => {
      const u = .045, g = eio(seg(t, 11, 13.5));
      bar(200, 1000 - 12000 * u, 160, 12000 * u, REF, 1, { fill: .25 }); T('12 000', 280, 1050, { k: 'r', s: 40, a: 'c', c: REF }); T('antes · 100 %', 280, 1094, { k: 'mono', s: 20, a: 'c', c: C.mute });
      bar(640, 1000 - lerp(12000, 15000, g) * u, 160, lerp(12000, 15000, g) * u, UP, 1, { fill: .25 }); T(pesos(lerp(12000, 15000, g)), 720, 1050, { k: 'r', s: 40, a: 'c', c: UP }); T('después', 720, 1094, { k: 'mono', s: 20, a: 'c', c: C.mute });
      stroke(hexA(REF, .6), 2, () => { X.moveTo(200, 1000 - 12000 * u); X.lineTo(820, 1000 - 12000 * u); }, { g: 0, dash: [8, 8] });
      fade(g, () => T('+3 000', 720, 1000 - 15000 * u - 20, { k: 'r', s: 36, a: 'c', c: UP }));
      fade(A(t, 14, .6), () => F([['3 000', 'r', UP], [' / ', 'r'], ['12 000', 'r', REF], [' = 0.25 = ', 'r'], ['+25 %', 'r', UP]], CX, 1200, 56, { rev: seg(t, 14.2, 17.2) }));
    });
  },
  // 8 · No es simétrico: de 15 000 a 12 000 baja 20 %, no 25 %.
  simetria(t) {
    stars(t, .3);
    const u = .045, g = eio(seg(t, 2, 4.5));
    bar(200, 1000 - 15000 * u, 160, 15000 * u, REF, 1, { fill: .25 }); T('15 000', 280, 1050, { k: 'r', s: 40, a: 'c', c: REF }); T('antes · 100 %', 280, 1094, { k: 'mono', s: 20, a: 'c', c: C.mute });
    bar(640, 1000 - lerp(15000, 12000, g) * u, 160, lerp(15000, 12000, g) * u, DN, 1, { fill: .25 }); T(pesos(lerp(15000, 12000, g)), 720, 1050, { k: 'r', s: 40, a: 'c', c: DN }); T('después', 720, 1094, { k: 'mono', s: 20, a: 'c', c: C.mute });
    stroke(hexA(REF, .6), 2, () => { X.moveTo(200, 1000 - 15000 * u); X.lineTo(820, 1000 - 15000 * u); }, { g: 0, dash: [8, 8] });
    fade(g, () => T('−3 000', 720, 1000 - 15000 * u - 20, { k: 'r', s: 36, a: 'c', c: DN }));
    fade(win(t, 10.2, 19.8), () => F([['3 000', 'r', DN], [' / ', 'r'], ['15 000', 'r', REF], [' = 0.2 = ', 'r'], ['−20 %', 'r', DN]], CX, 1200, 56, { rev: seg(t, 10.4, 13.4) }));
    fade(A(t, 20.2, .6), () => { F([['12 000 → 15 000: ', 'r'], ['+25 %', 'r', UP]], CX, 1180, 46); F([['15 000 → 12 000: ', 'r'], ['−20 %', 'r', DN]], CX, 1250, 46); });
  },
  // 9 · El signo: −20 % es × 0.8; duplicar es +100 %; −100 % es factor 0.
  signo(t) {
    stars(t, .3);
    const px = factorLine(820, 1);
    const v = t < 10 ? lerp(1, .8, eio(seg(t, 2, 5))) : t < 19 ? lerp(.8, 2, eio(seg(t, 10.6, 14))) : lerp(2, 0, eio(seg(t, 19.6, 23.4))), col = v > 1.005 ? UP : v < .995 ? DN : C.ink;
    dot(px(v), 820, 14, col, 28); T('× ' + v.toFixed(2), px(v), 716, { k: 'r', s: 44, a: 'c', c: col, g: 10 });
    const r = Math.round((v - 1) * 100); T((r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r) + ' %', CX, 560, { k: 'r', s: 110, a: 'c', c: col, g: 18 });
    bar(CX - 200, 1010, 200 * v, 60, col, 1, { fill: .3 }); stroke(hexA(REF, .7), 2, () => { X.moveTo(CX, 1000); X.lineTo(CX, 1080); }, { g: 0, dash: [6, 6] }); T('100 %', CX, 1120, { k: 'mono', s: 20, a: 'c', c: REF });
    fade(win(t, 14, 18.8), () => F([['2 = 1 + 1', 'r', UP], ['   duplicar = +100 %', 'it']], CX, 1230, 44));
    fade(A(t, 23.4, .5), () => F([['0 = 1 − 1', 'r', DN], ['   no queda nada', 'it']], CX, 1230, 44));
  },
  // 10 · Cierre: ida y vuelta; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { chip(280, 760, 300, 130, REF, '100 000', { s: 56, c: REF }); chip(800, 760, 300, 130, UP, '110 000', { s: 56, c: UP }); arrow(440, 720, 640, 720, FA, 1, 4); arrow(640, 800, 440, 800, DN, 1, 4); T('× 1.10', CX, 690, { k: 'r', s: 44, a: 'c', c: FA }); T('÷ 1.10', CX, 860, { k: 'r', s: 44, a: 'c', c: DN }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['× (1 + ', 'r'], ['r', 'i', UP], ['/100)', 'r']], 'aumentar r %'], [[['× (1 − ', 'r'], ['r', 'i', DN], ['/100)', 'r']], 'descontar r %'], [[['÷ ', 'r'], ['factor', 'it', FA]], 'volver al valor de antes'], [[['cambio', 'it'], [' / ', 'r'], ['antes', 'it', REF]], 'cambio porcentual']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [UP, FA, DN]);
    });
  },
};
