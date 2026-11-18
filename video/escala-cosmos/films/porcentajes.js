// «La centésima de Augusto» · escenas de la lección alg-13. Motor en kit.js y escala.js; guion en porcentajes.data.js.
// La parte en ámbar, el todo en cian, el porcentaje en rosa. Nitrógeno azul, oxígeno verde, lo demás ámbar.
const PA = C.amber, TO = C.cyan, PC = C.mag, N2 = C.blue, O2 = C.green;
const S = {
  // 1 · Roma: cien monedas; una va al tesoro. «centesima rerum venalium».
  augusto(t) {
    stars(t, .5);
    fade(A(t, .8, .6), () => T('centesima rerum venalium', CX, 440, { k: 'it', s: 50, a: 'c', c: '#ffd9a0', g: 14 }));
    const k = seg(t, 2, 8), go = eio(seg(t, 19, 22));
    for (let i = 0; i < 100; i++) {
      if (i / 100 > k) break;
      const x = 270 + (i % 10) * 60, y = 560 + Math.floor(i / 10) * 60, one = i === 99;
      const xx = one ? lerp(x, 540, go) : x, yy = one ? lerp(y, 1260, go) : y;
      ring(xx, yy, 22, one && t > 18.6 ? PC : '#ffd9a0', one && t > 18.6 ? 4 : 2, 1, { g: one && t > 18.6 ? 18 : 6 });
    }
    fade(A(t, 9.8, .6), () => T('monedas = ' + Math.round(100 * k), 96, 1196, { k: 'mono', s: 26, c: '#ffd9a0', g: 8 }));
    fade(A(t, 18.8, .6), () => { chip(540, 1260, 300, 110, PC, undefined); T('tesoro', 540, 1350, { k: 'mono', s: 24, a: 'c', c: PC }); T('1 de cada 100 = 1 %', 984, 1196, { k: 'mono', s: 26, a: 'r', c: PC, g: 8 }); });
  },
  // 2 · Por ciento: p % = p/100; «per cento» se abrevia hasta el %; 25 % = 1/4.
  porciento(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { T('%', CX, 800, { k: 'r', s: 380, a: 'c', c: PC, g: 34 }); F([['p', 'i', PC], [' % = ', 'r'], ['p', 'i', PC], [' / 100', 'r', TO]], CX, 1020, 84); T('de cada 100', CX, 1120, { k: 'it', s: 48, a: 'c', c: '#c3ccec' }); });
    fade(win(t, 10, 18.8), () => { ['per cento', 'p cento', 'p c°', '%'].forEach((s, i) => fade(A(t, 10.4 + i * 1.6, .5), () => { T(s, CX, 540 + i * 170, { k: i === 3 ? 'r' : 'it', s: i === 3 ? 140 : 76, a: 'c', c: i === 3 ? PC : '#ffd9a0', g: i === 3 ? 24 : 8 }); if (i < 3) arrow(CX, 570 + i * 170, CX, 620 + i * 170, hexA(C.ink, .5), 1, 2); })); T('libros de cuentas italianos', CX, 1260, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    fade(A(t, 19, .6), () => {
      const k = eo(seg(t, 19.4, 21.4));
      ring(CX, 700, 200, TO, 3); X.save(); X.beginPath(); X.moveTo(CX, 700); X.arc(CX, 700, 196, -Math.PI / 2, -Math.PI / 2 + Math.PI / 2 * k); X.closePath(); X.fillStyle = hexA(PC, .55); X.shadowColor = PC; X.shadowBlur = 16; X.fill(); X.restore();
      F([['25 %', 'r', PC], [' = ', 'r'], ['25/100', 'r'], [' = ', 'r'], ['1/4', 'r', PA]], CX, 1060, 76, { rev: seg(t, 20, 23) });
    });
  },
  // 3 · El aire: cien casillas; 78 de nitrógeno, 21 de oxígeno y 1 de lo demás.
  aire(t) {
    stars(t, .3);
    const k = t < 10 ? seg(t, 1, 8) * .99 : 1;
    grid100(CX, 760, 62, [[78, N2], [21, O2], [1, PA]], t < 20 ? Math.min(k, .995) : 1);
    fade(A(t, 1, .5), () => { dot(250, 1150, 10, N2); T('nitrógeno · 78 %', 276, 1160, { k: 'mono', s: 26, c: N2 }); });
    fade(A(t, 6.4, .5), () => { dot(620, 1150, 10, O2); T('oxígeno · 21 %', 646, 1160, { k: 'mono', s: 26, c: O2 }); });
    fade(A(t, 20.2, .5), () => { dot(250, 1210, 10, PA); T('argón, CO₂ y otros gases · 1 %', 276, 1220, { k: 'mono', s: 26, c: PA }); });
    T('casillas = ' + Math.round((t < 20 ? Math.min(k, .995) : 1) * 100), 96, 1300, { k: 'mono', s: 26, c: TO, g: 8 });
  },
  // 4 · Razón con el todo: 105 de 500 es como 21 de 100.
  razon(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['parte', 'it', PA], [' : ', 'r'], ['todo', 'it', TO]], CX, 480, 80); });
    fade(A(t, 10, .6), () => {
      const k = eo(seg(t, 10.4, 12));
      bar(140, 600, 800, 70, TO, 1, { fill: .08 }); bar(140, 600, 800 * .21, 70, PA, k, { fill: .45 }); T('105', 140 + 84, 720, { k: 'r', s: 40, a: 'c', c: PA }); T('500 litros', 940, 720, { k: 'r', s: 40, a: 'r', c: TO });
      fade(A(t, 13.4, .5), () => { bar(340, 820, 400, 70, TO, 1, { fill: .08 }); bar(340, 820, 400 * .21, 70, PA, 1, { fill: .45 }); T('21', 340 + 42, 940, { k: 'r', s: 40, a: 'c', c: PA }); T('100', 740, 940, { k: 'r', s: 40, a: 'r', c: TO }); T('la misma razón, con el todo en 100', CX, 1000, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
    });
    fade(A(t, 19.2, .6), () => { FR('parte', 'todo', 380, 1130, 56, PA, { k: 'it', g: 10 }); T('=', CX, 1150, { k: 'r', s: 64, a: 'c' }); FR('p', '100', 700, 1130, 56, PC, { g: 10 }); });
  },
  // 5 · Hallar la parte: el 21 % de los 20 000 litros de una habitación.
  parte(t) {
    stars(t, .3);
    const k = eo(seg(t, 1, 3));
    stroke(TO, 3, () => { X.rect(250, 520, 420 * k, 300); X.moveTo(250, 520); X.lineTo(390, 420); X.lineTo(390 + 420 * k, 420); X.lineTo(250 + 420 * k, 520); X.moveTo(390 + 420 * k, 420); X.lineTo(390 + 420 * k, 720); X.lineTo(250 + 420 * k, 820); }, { g: 14 });
    const f = eo(seg(t, 10.4, 13)); X.save(); X.fillStyle = hexA(O2, .3); X.fillRect(254, 820 - 300 * .21 * f, 412, 300 * .21 * f - 4); X.restore();
    T('20 000 litros de aire', 460, 880, { k: 'mono', s: 26, a: 'c', c: TO });
    fade(A(t, 3, .5), () => F([['21 %', 'r', PC], [' de ', 'it'], ['20 000', 'r', TO]], CX, 1000, 64));
    fade(A(t, 10.4, .6), () => F([['20 000 · ', 'r', TO], ['21/100', 'r', PC], [' = ', 'r'], ['4 200', 'r', O2], [' litros', 'r']], CX, 1110, 56, { rev: seg(t, 10.6, 13.6) }));
    fade(A(t, 19.2, .6), () => F([['20 000 · ', 'r', TO], ['0.21', 'r', PC], [' = ', 'r'], ['4 200', 'r', O2]], CX, 1220, 56));
    T('parte = ' + (t > 13 ? '4 200 L' : '…'), 96, 1320, { k: 'mono', s: 26, c: O2, g: 8 });
  },
  // 6 · Hallar el porcentaje: 390 de 500 → 78 %.
  porcentaje(t) {
    stars(t, .3);
    const k = eo(seg(t, 1.4, 3.4));
    bar(140, 520, 800, 90, TO, 1, { fill: .08 }); bar(140, 520, 800 * .78, 90, N2, k, { fill: .5 });
    T('390 litros de nitrógeno', 140, 480, { k: 'mono', s: 24, c: N2 }); T('500 litros', 940, 660, { k: 'r', s: 40, a: 'r', c: TO });
    fade(A(t, 10.2, .6), () => { F([['390', 'r', N2], [' / ', 'r'], ['500', 'r', TO], [' = ', 'r'], ['0.78', 'r']], CX, 800, 64, { rev: seg(t, 10.4, 12.6) }); fade(A(t, 13.4, .5), () => F([['0.78 · 100 = ', 'r'], ['78 %', 'r', PC]], CX, 910, 64)); });
    fade(A(t, 19.2, .6), () => { [[160, 60], [400, 100], [760, 170]].forEach(([x, w], i) => { bar(x, 1040, w, 40, TO, 1, { fill: .08 }); bar(x, 1040, w * .78, 40, N2, 1, { fill: .5 }); T('78 %', x + w / 2, 1130, { k: 'mono', s: 22, a: 'c', c: PC }); }); T('muestras de distinto tamaño', CX, 1190, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
    T('porcentaje = ' + (t > 14 ? '78 %' : '…'), 96, 1300, { k: 'mono', s: 26, c: PC, g: 8 });
  },
  // 7 · Hallar el todo: 42 kg de agua son el 60 % → 70 kg.
  todo(t) {
    stars(t, .3);
    const cx = 210, top = 460, h = 560, w = 150, lvl = eo(seg(t, 1.4, 4));
    stroke(TO, 3, () => X.roundRect(cx - w / 2, top, w, h, 60), { g: 14 }); ring(cx, top - 60, 46, TO, 3);
    X.save(); X.beginPath(); X.roundRect(cx - w / 2 + 4, top + 4, w - 8, h - 8, 56); X.clip(); X.fillStyle = hexA(C.blue, .45); X.fillRect(cx - w / 2, top + h - h * .6 * lvl, w, h * .6 * lvl); X.restore();
    fade(A(t, 4, .5), () => { stroke(PC, 2, () => { X.moveTo(cx + w / 2 + 10, top + h * .4); X.lineTo(cx + w / 2 + 60, top + h * .4); }, { g: 6 }); T('60 %', cx + w / 2 + 70, top + h * .4 + 14, { k: 'r', s: 44, c: PC, g: 10 }); T('agua', cx + w / 2 + 70, top + h * .4 + 60, { k: 'mono', s: 24, c: C.blue }); });
    fade(A(t, 10.2, .6), () => { F([['42 kg', 'r', PA], [' = 60 % del ', 'r'], ['todo', 'it', TO]], 730, 560, 46, { max: 480 }); F([['42 ÷ 0.6 = ', 'r'], ['70 kg', 'r', TO]], 730, 860, 60, { rev: seg(t, 11, 14) }); });
    fade(A(t, 19.2, .6), () => F([['70 · 0.6 = ', 'r'], ['42', 'r', PA]], 700, 990, 60));
    check(920, 970, 20, true, A(t, 21.4, .5));
    T('todo = ' + (t > 14 ? '70 kg' : '…'), 96, 1300, { k: 'mono', s: 26, c: TO, g: 8 });
  },
  // 8 · Más de 100 %: el árbol de 2 m que llega a 5 m; 250 %.
  mayor(t) {
    stars(t, .3);
    const ground = 1180, u = 130, g = t < 10 ? 0 : eio(seg(t, 11, 15)), hh = lerp(2, 5, g) * u;
    stroke('rgba(200,210,245,.5)', 2, () => { X.moveTo(140, ground); X.lineTo(940, ground); }, { g: 0 });
    bar(300, ground - 2 * u, 70, 2 * u, TO, 1, { fill: .12 }); T('antes: 2 m', 335, ground + 50, { k: 'mono', s: 24, a: 'c', c: TO }); T('100 %', 335, ground - 2 * u - 20, { k: 'r', s: 38, a: 'c', c: TO });
    bar(600, ground - hh, 70, hh, O2, 1, { fill: .3 }); dot(635, ground - hh - 46, 46, hexA(O2, .5), 26); T('hoy: ' + lerp(2, 5, g).toFixed(1).replace('.0', '') + ' m', 635, ground + 50, { k: 'mono', s: 24, a: 'c', c: O2 });
    stroke(hexA(TO, .6), 2, () => { X.moveTo(280, ground - 2 * u); X.lineTo(900, ground - 2 * u); }, { g: 0, dash: [8, 10] });
    T(Math.round(lerp(100, 250, g)) + ' %', 800, ground - hh + 20, { k: 'r', s: 64, a: 'c', c: PC, g: 14 });
    fade(A(t, 20.2, .6), () => F([['5 / 2 = 2.5 = ', 'r'], ['250 %', 'r', PC]], CX, 440, 60));
  },
  // 9 · Menos de 1 %: una casilla de las cien, partida en cien: 4 de cada 10 000.
  menor(t) {
    stars(t, .3);
    const z = eio(seg(t, 10.4, 13.4));
    fade(1 - z, () => { grid100(CX, 760, 62, [[0, PA]], 0); X.save(); X.strokeStyle = PC; X.lineWidth = 3; X.shadowColor = PC; X.shadowBlur = 14; X.strokeRect(CX - 310 + 3, 760 - 310 + 3, 56, 56); X.restore(); T('1 %', CX - 310 + 31, 760 - 330, { k: 'mono', s: 24, a: 'c', c: PC }); });
    fade(z, () => { grid100(CX, 760, 62, [[4, PA]], seg(t, 13.6, 15)); stroke(PC, 3, () => X.rect(CX - 316, 760 - 316, 632, 632), { g: 14 }); T('una casilla del 1 %, partida en 100', CX, 420, { k: 'mono', s: 24, a: 'c', c: PC }); });
    fade(A(t, 1.4, .5), () => F([['CO₂ ≈ ', 'r'], ['0.04 %', 'r', PA], [' del aire', 'r']], CX, 1160, 56));
    fade(win(t, 13.6, 18.8), () => F([['0.04 % = ', 'r'], ['4', 'r', PA], [' de cada ', 'it'], ['10 000', 'r', TO]], CX, 1250, 50));
    fade(A(t, 19.2, .6), () => F([['20 000 · 0.0004 = ', 'r'], ['8 litros', 'r', PA]], CX, 1250, 54));
  },
  // 10 · Cierre: la moneda de cien y el símbolo; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { for (let i = 0; i < 100; i++) ring(270 + (i % 10) * 60, 480 + Math.floor(i / 10) * 60, 22, i === 99 ? PC : hexA('#ffd9a0', .6), i === 99 ? 4 : 2, 1, { g: i === 99 ? 18 : 4 }); T('1 %', CX, 1180, { k: 'r', s: 110, a: 'c', c: PC, g: 24 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['p', 'i', PC], [' % = ', 'r'], ['p', 'i', PC], ['/100', 'r']], 'de cada 100'], [[['todo', 'it', TO], [' · ', 'r'], ['p', 'i', PC], ['/100', 'r']], 'hallar la parte'], [[['parte', 'it', PA], ['/', 'r'], ['todo', 'it', TO], [' · 100', 'r']], 'hallar el porcentaje'], [[['parte', 'it', PA], [' ÷ ', 'r'], ['p', 'i', PC], ['/100', 'r']], 'hallar el todo']], 420, 170, 46);
      endCard(t, 19.6, D.TITLE, D.LINE, [PA, PC, TO]);
    });
  },
};
