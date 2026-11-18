// «Resistencias en paralelo» · escenas de la lección alg-25b. Motor en kit.js y fraccion.js; guion en operaciones.data.js.
// R₁ en ámbar, R₂ en cian, el resultado en verde, lo que se voltea o se cancela en rosa.
const R1 = C.amber, R2 = C.cyan, RT = C.green, VO = C.mag;
// Una resistencia en zigzag entre (x1, y) y (x2, y).
function resistor(x1, x2, y, col, lab) {
  const n = 8, w = (x2 - x1) * .6, a = x1 + (x2 - x1) * .2;
  stroke(col, 3, () => { X.moveTo(x1, y); X.lineTo(a, y); for (let i = 1; i <= n; i++) X.lineTo(a + i * w / n, y + (i === n ? 0 : (i % 2 ? -18 : 18))); X.lineTo(x2, y); }, { g: 12 });
  if (lab) T(lab, (x1 + x2) / 2, y - 34, { k: 'r', s: 34, a: 'c', c: col });
}
// Circuito con dos ramas en paralelo entre x1 y x2; flujo animado t.
function parallel(t, x1, x2, ya, yb, l1, l2, flow = true) {
  stroke('rgba(225,232,255,.7)', 3, () => { X.moveTo(x1 - 120, (ya + yb) / 2); X.lineTo(x1, (ya + yb) / 2); X.moveTo(x1, ya); X.lineTo(x1, yb); X.moveTo(x2, ya); X.lineTo(x2, yb); X.moveTo(x2, (ya + yb) / 2); X.lineTo(x2 + 120, (ya + yb) / 2); }, { g: 4 });
  resistor(x1, x2, ya, R1, l1); resistor(x1, x2, yb, R2, l2);
  if (flow) for (let i = 0; i < 6; i++) { const f = ((t * .4 + i / 6) % 1); dot(lerp(x1, x2, f), ya, 5, '#fff3c4', 12); dot(lerp(x1, x2, (f * 3) % 1), yb, 5, '#fff3c4', 12); }
}
const S = {
  // 1 · Ohm, 1827: V = I · R y un circuito.
  ohm(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { F([['V', 'i'], [' = ', 'r'], ['I', 'i'], [' · ', 'r'], ['R', 'i', R1]], CX, 520, 96); T('Georg Simon Ohm · 1827', CX, 600, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 9.6, .6), () => { resistor(240, 840, 760, R1, 'R'); T('ohmios · Ω', CX, 840, { k: 'mono', s: 24, a: 'c', c: R1 }); });
    fade(A(t, 18.6, .6), () => parallel(t, 340, 740, 980, 1180, '', ''));
  },
  // 2 · En paralelo: dos puertas; 1/R = 1/R₁ + 1/R₂.
  paralelo(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { stroke('rgba(225,232,255,.7)', 3, () => X.rect(240, 480, 600, 360), { g: 4 }); [[240, 560, R1], [240, 760, R2]].forEach(([x, y, c]) => { X.save(); X.fillStyle = C.bg; X.fillRect(x - 4, y - 40, 8, 80); X.restore(); stroke(c, 4, () => { X.moveTo(x, y - 40); X.lineTo(x, y + 40); }, { g: 14 }); }); for (let i = 0; i < 10; i++) { const f = ((t * .5 + i / 10) % 1); dot(lerp(600, 120, f), i % 2 ? 560 : 760, 7, '#fff3c4', 12); } T('dos puertas: sale más rápido', CX, 900, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
    fade(A(t, 10, .6), () => { parallel(t, 340, 740, 560, 760, 'R₁', 'R₂'); F([['1/', 'r'], ['R', 'i', RT], [' = 1/', 'r'], ['R', 'i', R1], ['₁', 'r', R1], [' + 1/', 'r'], ['R', 'i', R2], ['₂', 'r', R2]], CX, 960, 64); });
    fade(A(t, 20.2, .6), () => F([['1/', 'r'], ['R', 'i', RT], [' = 1/4 + 1/12', 'r']], CX, 1080, 60));
  },
  // 3 · Denominador común: cuartos a doceavos.
  comun(t) {
    stars(t, .3);
    const x0 = 140, w = 800;
    fade(A(t, .8, .6), () => { bar(x0, 520, w / 4, 70, R1, 1, { fill: .35 }); stroke('rgba(225,232,255,.4)', 1.5, () => X.rect(x0, 520, w, 70), { g: 0 }); T('1/4', x0 + w / 8, 570, { k: 'r', s: 32, a: 'c', c: C.ink }); bar(x0, 620, w / 12, 70, R2, 1, { fill: .35 }); stroke('rgba(225,232,255,.4)', 1.5, () => X.rect(x0, 620, w, 70), { g: 0 }); T('1/12', x0 + w / 24 + 40, 670, { k: 'r', s: 28, c: C.ink }); });
    fade(A(t, 3, .5), () => { for (let i = 1; i < 12; i++) stroke('rgba(225,232,255,.3)', 1, () => { X.moveTo(x0 + i * w / 12, 520); X.lineTo(x0 + i * w / 12, 690); }, { g: 0 }); });
    fade(A(t, 10.2, .6), () => { bar(x0, 740, w / 4, 70, R1, 1, { fill: .35 }); bar(x0 + w / 4, 740, w / 12, 70, R2, 1, { fill: .35 }); stroke('rgba(225,232,255,.4)', 1.5, () => X.rect(x0, 740, w, 70), { g: 0 }); F([['3/12 + 1/12 = 4/12 = ', 'r'], ['1/3', 'r', RT]], CX, 900, 60); });
    fade(A(t, 19.2, .6), () => { F([['R', 'i', RT], [' = 3 Ω', 'r', RT]], CX, 1040, 84); T('menos que 4 y menos que 12', CX, 1120, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
  },
  // 4 · Con letras: 1/x + 1/(x + 2).
  letras(t) {
    stars(t, .3);
    F([['1/', 'r'], ['x', 'i', R1], [' + 1/(', 'r'], ['x', 'i', R2], [' + 2', 'r', R2], [')', 'r']], CX, 540, 72);
    fade(A(t, 10.2, .6), () => { F([['(', 'r'], ['x', 'i', R2], [' + 2', 'r', R2], [') / (', 'r'], ['x', 'i', R1], ['(', 'r'], ['x', 'i', R2], [' + 2', 'r', R2], ['))', 'r'], [' + ', 'r'], ['x', 'i', R1], [' / (', 'r'], ['x', 'i', R1], ['(', 'r'], ['x', 'i', R2], [' + 2', 'r', R2], ['))', 'r']], CX, 700, 46, { max: 960 }); T('a cada fracción, lo que le falta', CX, 770, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 20.2, .6), () => F([['(2', 'r', RT], ['x', 'i', RT], [' + 2', 'r', RT], [') / (', 'r'], ['x', 'i'], ['(', 'r'], ['x', 'i'], [' + 2))', 'r']], CX, 900, 64));
  },
  // 5 · Voltear: R es la inversa.
  voltear(t) {
    stars(t, .3);
    F([['1/', 'r'], ['R', 'i', RT], [' = (2', 'r'], ['x', 'i'], [' + 2) / (', 'r'], ['x', 'i'], ['(', 'r'], ['x', 'i'], [' + 2))', 'r']], CX, 560, 60);
    fade(A(t, 10.2, .6), () => { const g = eio(seg(t, 10.4, 12.4)); X.save(); X.translate(CX, 740); X.rotate(Math.PI * g); X.globalAlpha *= 1 - Math.abs(Math.sin(Math.PI * g)) * .5; X.restore(); F([['R', 'i', RT], [' = ', 'r'], ['x', 'i'], ['(', 'r'], ['x', 'i'], [' + 2) / (2', 'r'], ['x', 'i'], [' + 2)', 'r']], CX, 740, 64); T('se voltea', CX, 820, { k: 'mono', s: 24, a: 'c', c: VO }); });
    fade(A(t, 19.2, .6), () => F([['x', 'i'], [' = 4:  4 · 6 / 10 = ', 'r'], ['2.4 Ω', 'r', RT]], CX, 960, 60));
  },
  // 6 · Multiplicar: cancelar antes.
  multiplicar(t) {
    stars(t, .3);
    F([['a', 'i'], ['/', 'r'], ['b', 'i'], [' · ', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], [' = ', 'r'], ['ac', 'i'], ['/', 'r'], ['bd', 'i']], CX, 520, 64);
    fade(A(t, 10.2, .6), () => { const r = F([['x', 'i', VO], [' / (', 'r'], ['x', 'i', R2], [' + 3', 'r', R2], [')  ·  (', 'r'], ['x', 'i', R2], [' + 3', 'r', R2], [') / ', 'r'], ['x', 'i', VO], ['²', 'r']], CX, 700, 60); const k = seg(t, 12.6, 14.6); if (k > 0) [[2, 3], [5, 6]].forEach(([a, b]) => stroke(VO, 3, () => { X.moveTo(r.mid(a) - 20, 712); X.lineTo(lerp(r.mid(a) - 20, r.mid(b) + 20, k), lerp(712, 660, k)); }, { g: 10 })); });
    fade(A(t, 20.2, .6), () => { F([['= 1 / ', 'r'], ['x', 'i', RT]], CX, 860, 72); T('x ≠ 0, x ≠ −3', CX, 940, { k: 'mono', s: 26, a: 'c', c: VO }); });
  },
  // 7 · Dividir: voltear la segunda.
  dividir(t) {
    stars(t, .3);
    F([['(', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], [') ÷ (', 'r'], ['c', 'i', VO], ['/', 'r', VO], ['d', 'i', VO], [') = (', 'r'], ['a', 'i'], ['/', 'r'], ['b', 'i'], [')(', 'r'], ['d', 'i', VO], ['/', 'r', VO], ['c', 'i', VO], [')', 'r']], CX, 540, 56);
    fade(A(t, 10.2, .6), () => F([['(2', 'r'], ['x', 'i'], ['/5) ÷ (', 'r'], ['x', 'i', VO], ['/10', 'r', VO], [') = (2', 'r'], ['x', 'i'], ['/5) · (10/', 'r', VO], ['x', 'i', VO], [') = ', 'r'], ['4', 'r', RT]], CX, 720, 50, { max: 960 }));
    fade(A(t, 19.2, .6), () => T('x ≠ 0: al voltear, x queda abajo', CX, 860, { k: 'mono', s: 26, a: 'c', c: VO }));
  },
  // 8 · Fracción dentro de fracción: producto sobre suma.
  compleja(t) {
    stars(t, .3);
    F([['R', 'i', RT], [' = 1 / (1/', 'r'], ['R', 'i', R1], ['₁', 'r', R1], [' + 1/', 'r'], ['R', 'i', R2], ['₂', 'r', R2], [')', 'r']], CX, 540, 60);
    fade(A(t, 10.2, .6), () => { T('× R₁R₂ / R₁R₂', CX, 640, { k: 'mono', s: 26, a: 'c', c: VO }); F([['R', 'i', RT], [' = ', 'r'], ['R', 'i', R1], ['₁', 'r', R1], ['R', 'i', R2], ['₂', 'r', R2], [' / (', 'r'], ['R', 'i', R2], ['₂', 'r', R2], [' + ', 'r'], ['R', 'i', R1], ['₁', 'r', R1], [')', 'r']], CX, 760, 64); });
    fade(A(t, 20.2, .6), () => F([['4 · 12 / (12 + 4) = 48/16 = ', 'r'], ['3 Ω', 'r', RT]], CX, 900, 56));
  },
  // 9 · Agregar una: tres ramas; 2 Ω.
  mas(t) {
    stars(t, .3);
    parallel(t, 340, 740, 520, 680, '4 Ω', '12 Ω');
    fade(A(t, .8, .6), () => { stroke('rgba(225,232,255,.7)', 3, () => { X.moveTo(340, 680); X.lineTo(340, 840); X.moveTo(740, 680); X.lineTo(740, 840); }, { g: 4 }); resistor(340, 740, 840, C.violet, '6 Ω'); });
    fade(A(t, 10.2, .6), () => F([['3/12 + 1/12 + 2/12 = 6/12 = ', 'r'], ['1/2', 'r', RT]], CX, 990, 54));
    fade(A(t, 20.2, .6), () => { F([['R', 'i', RT], [' = 2 Ω', 'r', RT]], CX, 1110, 80); T('más caminos, menos resistencia', CX, 1190, { k: 'mono', s: 26, a: 'c', c: C.mute }); });
  },
  // 10 · Cierre: el circuito; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { parallel(t, 340, 740, 600, 820, '4 Ω', '12 Ω'); T('= 3 Ω', CX, 1000, { k: 'r', s: 72, a: 'c', c: RT, g: 14 }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['1/4 + 1/12 = 4/12', 'r']], 'denominador común'], [[['a', 'i'], ['/', 'r'], ['b', 'i'], [' · ', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], [' = ', 'r'], ['ac', 'i'], ['/', 'r'], ['bd', 'i']], 'multiplicar'], [[['÷ ', 'r'], ['c', 'i'], ['/', 'r'], ['d', 'i'], [' = · ', 'r'], ['d', 'i'], ['/', 'r'], ['c', 'i']], 'dividir: voltear'], [[['R', 'i'], ['₁', 'r'], ['R', 'i'], ['₂', 'r'], ['/(', 'r'], ['R', 'i'], ['₁', 'r'], [' + ', 'r'], ['R', 'i'], ['₂', 'r'], [')', 'r']], 'producto sobre suma']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [R1, RT, R2]);
    });
  },
};
