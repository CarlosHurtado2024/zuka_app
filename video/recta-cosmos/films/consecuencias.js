// «El barco que dividió entre cero» · escenas de la lección alg-12c. Motor en kit.js y recta.js; guion en consecuencias.data.js.
// El cero peligroso va en rojo; opuestos en magenta, recíprocos en violeta.
// Silueta de un buque visto de lado, con la proa a la derecha, en (x, y) (línea de flotación) y escala s.
function ship(x, y, s, col = C.cyan) {
  stroke(col, 3, () => { X.moveTo(x - 200 * s, y - 10 * s); X.lineTo(x + 230 * s, y - 10 * s); X.lineTo(x + 180 * s, y + 40 * s); X.lineTo(x - 180 * s, y + 40 * s); X.closePath();
    X.moveTo(x - 110 * s, y - 10 * s); X.lineTo(x - 110 * s, y - 70 * s); X.lineTo(x + 20 * s, y - 70 * s); X.lineTo(x + 20 * s, y - 10 * s);
    X.moveTo(x - 60 * s, y - 70 * s); X.lineTo(x - 60 * s, y - 120 * s); X.lineTo(x - 20 * s, y - 120 * s); X.lineTo(x - 20 * s, y - 70 * s);
    X.moveTo(x - 40 * s, y - 120 * s); X.lineTo(x - 40 * s, y - 170 * s); }, { g: 14 });
}
function sea(t, y, amp = 10, col = C.blue) { for (let w = 0; w < 3; w++) stroke(hexA(col, .7 - w * .2), 2.5, () => { for (let i = 0; i <= 80; i++) { const u = i / 80, xx = 60 + u * 960, yy = y + w * 30 + amp * Math.sin(u * 16 + t * 1.4 + w); i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } }, { g: 8 }); }
// Una persona esquemática que camina (paso animado por la fase p) mirando a la derecha (dir 1) o a la izquierda (dir −1).
function walker(x, y, p, dir, col) {
  const l = Math.sin(p) * 22, a = Math.sin(p) * 18;
  dot(x, y - 120, 16, col, 16);
  stroke(col, 4, () => { X.moveTo(x, y - 100); X.lineTo(x, y - 40); X.moveTo(x, y - 40); X.lineTo(x + l, y); X.moveTo(x, y - 40); X.lineTo(x - l, y); X.moveTo(x, y - 86); X.lineTo(x + a * dir + 14 * dir, y - 60); X.moveTo(x, y - 86); X.lineTo(x - a * dir, y - 60); }, { g: 10 });
  stroke(col, 3, () => { X.moveTo(x + 10 * dir, y - 124); X.lineTo(x + 22 * dir, y - 120); }, { g: 6 });   // la nariz dice hacia dónde mira
}
// Un fotograma de película: un marco con perforaciones; dentro, quien camina.
function filmstrip(cx, cy, w, h, col, k = 1) {
  stroke(col, 2.5, () => X.rect(cx - w / 2, cy - h / 2, w * k, h), { g: 8 });
  for (let i = 0; i < 10 * k; i++) { X.fillStyle = hexA(col, .6); X.fillRect(cx - w / 2 + 14 + i * (w - 28) / 9, cy - h / 2 + 8, 14, 10); X.fillRect(cx - w / 2 + 14 + i * (w - 28) / 9, cy + h / 2 - 18, 14, 10); }
}
const S = {
  // 1 · El Yorktown: el barco avanza; una casilla recibe un 0; la pantalla muestra el error y el barco se detiene.
  yorktown(t) {
    stars(t, .4);
    const stop = seg(t, 19, 22), v = 1 - stop, x = CX - 140 + 130 * Math.sin(Math.min(t, 19) * .25);
    sea(t, 880, 10 * (1 - stop * .6));
    ship(x, 860, 1.4, stop > .5 ? C.red : C.cyan);
    if (v > .1) for (let i = 0; i < 4; i++) { const r = ((t * 60 + i * 30) % 120); fade(v * (1 - r / 120), () => stroke(hexA(C.cyan, .6), 2, () => { X.moveTo(x - 280 - r, 900); X.lineTo(x - 250 - r, 900); }, { g: 0 })); }
    T('velocidad = ' + Math.round(14 * v) + ' nudos', 96, 1196, { k: 'mono', s: 26, c: v > .5 ? C.cyan : C.red, g: 8 });
    // la casilla y el error
    fade(A(t, 10, .6), () => {
      stroke('rgba(200,210,245,.6)', 2, () => X.roundRect(180, 380, 720, 200, 18), { g: 0 });
      T('base de datos · campo numérico', 220, 430, { k: 'mono', s: 22, c: C.mute });
      stroke(C.amber, 2.5, () => X.roundRect(220, 460, 300, 80, 10), { g: 8 });
      T(typed('0', seg(t, 11.4, 11.6)), 240, 516, { k: 'mono', s: 44, c: C.red, g: 10 });
      if (t > 11.6 && Math.sin(t * 8) > 0 && t < 13) stroke(C.amber, 2, () => { X.moveTo(270, 474); X.lineTo(270, 528); }, { g: 0 });
      fade(A(t, 18.8, .4), () => { T('ERROR: división entre cero', 560, 516, { k: 'mono', s: 26, c: C.red, g: 12 }); });
    });
    fade(A(t, 22.6, .6), () => T('detenido ≈ 2 h 45 min', 984, 1196, { k: 'mono', s: 26, c: C.red, a: 'r', g: 8 }));
  },
  // 2 · Teoremas: un tronco de axiomas y cinco ramas con los teoremas de hoy.
  teoremas(t) {
    stars(t, .3);
    stroke(C.amber, 4, () => { X.moveTo(CX, 1100); X.lineTo(CX, lerp(1100, 820, eio(seg(t, .6, 2.4)))); }, { g: 14 });
    fade(A(t, 1, .5), () => { stroke(C.amber, 2.5, () => X.roundRect(CX - 170, 1100, 340, 90, 16), { g: 10 }); T('axiomas de campo', CX, 1156, { k: 'it', s: 38, a: 'c', c: C.amber }); });
    const th = [['restar', C.mag], ['dividir', C.violet], ['a · 0 = 0', C.red], ['signos', C.green], ['cancelar', C.cyan]];
    th.forEach(([s, col], i) => { const a = -Math.PI / 2 + (i - 2) * .55, x = CX + 380 * Math.cos(a), y = 820 + 380 * Math.sin(a), k = eio(seg(t, 10.4 + i * 1.4, 11.6 + i * 1.4)); if (k > 0) { stroke(col, 3, () => { X.moveTo(CX, 820); X.lineTo(lerp(CX, x, k), lerp(820, y, k)); }, { g: 10 }); } fade(A(t, 11.4 + i * 1.4, .4), () => { dot(x, y, 12, col, 24); T(s, x, y - 26, { k: 'it', s: 38, a: 'c', c: col }); }); });
    T('consecuencias = ' + clamp(Math.floor((t - 10.4) / 1.4) + 1, 0, 5), 96, 1300, { k: 'mono', s: 26, c: C.green, g: 8 });
  },
  // 3 · Restar es sumar el opuesto: 11 − 4 y 11 + (−4) dan el mismo salto.
  restar(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -2, 13, {});
    dot(px(11), 760, 13, C.cyan, 24);
    hop(px(11), px(7), 760, 110, C.mag, seg(t, 1.6, 3.6));
    fade(A(t, 3.4, .5), () => { F([['11 − 4', 'r'], [' = ', 'r'], ['7', 'r', C.green]], CX, 960, 72); });
    fade(A(t, 5, .6), () => { F([['11 + (', 'r'], ['−4', 'r', C.mag], [')', 'r'], [' = ', 'r'], ['7', 'r', C.green]], CX, 1060, 72); T('el mismo salto', 96, 1340, { k: 'mono', s: 26, c: C.mag, g: 8 }); });
    fade(A(t, 10.4, .6), () => { F([['11 + (', 'r'], ['−4', 'r', C.mag], [') = (', 'r'], ['−4', 'r', C.mag], [') + 11', 'r']], CX, 1200, 64); T('como suma, se puede reordenar', CX, 1270, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
  },
  // 4 · Dividir es multiplicar por el recíproco: 12 ÷ 3 = 12 · 1/3; el 0 se queda sin pareja.
  dividir(t) {
    stars(t, .3);
    // doce puntos repartidos en tres grupos
    for (let i = 0; i < 12; i++) { const g = Math.floor(i / 4), k = eio(seg(t, 2, 4)), x0 = 220 + i * 58, x1 = 260 + g * 280 + (i % 4) * 50; dot(lerp(x0, x1, k), 600, 12, C.cyan, 16); }
    fade(A(t, 4, .5), () => [0, 1, 2].forEach(g => stroke(C.violet, 2.5, () => X.roundRect(230 + g * 280, 560, 210, 80, 18), { g: 8 })));
    fade(A(t, 4.4, .5), () => { F([['12 ÷ 3', 'r'], [' = 12 · ', 'r'], ['1/3', 'r', C.violet], [' = ', 'r'], ['4', 'r', C.green]], CX, 800, 72); });
    fade(A(t, 10.4, .6), () => {
      F([['12 ÷ ', 'r'], ['0', 'r', C.red], [' = 12 · ', 'r'], ['1/0', 'r', C.red]], CX, 1000, 72);
      stroke(C.red, 5, () => { X.moveTo(CX + 120, 940); X.lineTo(CX + 300, 1030); }, { g: 14 });
      T('el 0 no tiene recíproco', CX, 1100, { k: 'mono', s: 26, c: C.red, a: 'c', g: 8 });
    });
  },
  // 5 · Por qué no se puede: 0 · ? = 12 no tiene respuesta; 0 · ? = 0 la tiene toda; la curva 12/x se dispara.
  porcero(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      F([['0 · ', 'r'], ['?', 'r', C.red], [' = 12', 'r']], CX, 520, 84);
      const tries = [1, 5, 100, 0.3, 1000000], i = clamp(Math.floor((t - 1.6) / 1.4), 0, 4);
      if (t < 10) T('0 · ' + num(tries[i]) + ' = 0 ≠ 12', CX, 620, { k: 'mono', s: 30, c: C.red, a: 'c', g: 8 });
      fade(A(t, 10, .6), () => { F([['0 · ', 'r'], ['?', 'r', C.amber], [' = 0', 'r']], CX, 820, 84); [0, 1, 2, 3, 4].forEach(j => fade(A(t, 10.6 + j * .6, .4), () => T('0 · ' + ['3', '−7', '0.5', '1000', '0'][j] + ' = 0  ✓', 260 + (j % 3) * 280, 920 + Math.floor(j / 3) * 50, { k: 'mono', s: 26, c: C.green, a: 'c' }))); fade(A(t, 14, .5), () => T('todos sirven: no hay una sola respuesta', CX, 1080, { k: 'mono', s: 25, c: C.amber, a: 'c', g: 8 })); });
    });
    fade(A(t, 20, .6), () => {
      const gx = v => 140 + v / 4 * 800, gy = v => 1100 - v * 6, k = eio(seg(t, 20.4, 24));
      stroke('rgba(200,210,245,.7)', 2, () => { X.moveTo(140, 1100); X.lineTo(960, 1100); X.moveTo(140, 1100); X.lineTo(140, 420); }, { g: 0 });
      stroke(C.violet, 3, () => { let first = true; for (let i = 0; i <= 300 * k; i++) { const v = 4 - i / 300 * 3.88, y = gy(12 / v); if (y < 420) break; first ? X.moveTo(gx(v), y) : X.lineTo(gx(v), y); first = false; } }, { g: 14 });
      const v = lerp(4, .12, k); T('12 ÷ ' + v.toFixed(2) + ' = ' + (12 / v).toFixed(1), 96, 1196, { k: 'mono', s: 26, c: C.violet, g: 8 });
      T('x', 960, 1140, { k: 'i', s: 36, c: C.ink }); T('12/x', 160, 450, { k: 'i', s: 36, c: C.violet });
      fade(A(t, 25, .5), () => T('en x = 0: nada', 984, 1196, { k: 'mono', s: 26, c: C.red, a: 'r', g: 8 }));
    });
  },
  // 6 · a · 0 = 0: la demostración paso a paso, con cada regla usada a la derecha.
  porcero2(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => { F([['a', 'i'], [' · ', 'r'], ['0', 'r', C.red], [' = ', 'r'], ['0', 'r', C.green]], CX, 520, 110); T('no está en el reglamento: es un teorema', CX, 600, { k: 'mono', s: 24, c: C.amber, a: 'c' }); });
    const steps = [
      [10.2, [['a', 'i'], [' · 0 = ', 'r'], ['a', 'i'], [' · (0 + 0)', 'r']], 'porque 0 + 0 = 0'],
      [13.4, [['a', 'i'], [' · 0 = ', 'r'], ['a', 'i'], [' · 0 + ', 'r'], ['a', 'i'], [' · 0', 'r']], 'distributiva'],
      [20.2, [['a', 'i'], [' · 0 − ', 'r', C.mag], ['a', 'i', C.mag], [' · 0 = ', 'r'], ['a', 'i'], [' · 0 + ', 'r'], ['a', 'i'], [' · 0 − ', 'r', C.mag], ['a', 'i', C.mag], [' · 0', 'r', C.mag]], 'se resta a · 0'],
      [23.4, [['0', 'r', C.green], [' = ', 'r'], ['a', 'i'], [' · 0 + 0 = ', 'r'], ['a', 'i'], [' · 0', 'r']], 'opuestos y neutro'],
    ];
    steps.forEach(([t0, p, why], i) => fade(A(t, t0, .6), () => { F(p, 110, 760 + i * 130, 60, { a: 'l', rev: seg(t, t0, t0 + 1.4), max: 640 }); T(why, 984, 752 + i * 130, { k: 'mono', s: 22, c: C.mute, a: 'r' }); }));
    fade(A(t, 25.6, .5), () => T('∎', 984, 1300, { k: 'r', s: 56, a: 'r', c: C.green, g: 12 }));
  },
  // 7 · La ley de los signos con una película: la persona camina adelante/atrás; la película va normal/al revés.
  signos(t) {
    stars(t, .3);
    const cases = [[1, -1, 'adelante · al revés', '(+)(−) = −'], [-1, 1, 'atrás · normal', '(−)(+) = −'], [-1, -1, 'atrás · rebobinada', '(−)(−) = +']];
    const c = t < 10 ? 0 : t < 20 ? 1 : 2, lt = t - c * 10, [walk, play, lab, rule] = cases[c];
    filmstrip(CX, 760, 820, 420, C.violet, eio(seg(lt, .2, 1.4)));
    const screen = walk * play, x = CX + 240 * screen * (((lt * .2) % 1) * 2 - 1);
    walker(x, 900, lt * 6 * play, walk, screen > 0 ? C.green : C.mag);
    stroke('rgba(200,210,245,.4)', 2, () => { X.moveTo(CX - 380, 900); X.lineTo(CX + 380, 900); }, { g: 0 });
    T('camina: ' + (walk > 0 ? 'adelante (+)' : 'atrás (−)'), 96, 1196, { k: 'mono', s: 26, c: walk > 0 ? C.green : C.mag });
    T('película: ' + (play > 0 ? 'normal (+)' : 'al revés (−)'), 96, 1236, { k: 'mono', s: 26, c: play > 0 ? C.green : C.mag });
    fade(A(lt, 2, .5), () => { arrow(CX - 100 * screen, 1050, CX + 100 * screen, 1050, screen > 0 ? C.green : C.mag, 1, 4); F([[rule, 'r', screen > 0 ? C.green : C.mag]], CX, 1140, 72); });
    T('en pantalla: ' + (screen > 0 ? 'avanza' : 'retrocede'), 984, 1236, { k: 'mono', s: 26, c: screen > 0 ? C.green : C.mag, a: 'r', g: 8 });
  },
  // 8 · La demostración de (−a)(−b) = ab, línea a línea.
  signos2(t) {
    stars(t, .3);
    const steps = [
      [.8, [['(', 'r'], ['−a', 'i', C.mag], [')(', 'r'], ['−b', 'i', C.mag], [') + (', 'r'], ['−a', 'i', C.mag], [')', 'r'], ['b', 'i']]],
      [4.6, [['= (', 'r'], ['−a', 'i', C.mag], [')(', 'r'], ['−b', 'i', C.mag], [' + ', 'r'], ['b', 'i'], [')', 'r'], ['     distributiva', 'it', C.mute]]],
      [7.4, [['= (', 'r'], ['−a', 'i', C.mag], [') · 0 = 0', 'r'], ['     opuestos y a · 0 = 0', 'it', C.mute]]],
      [11.2, [['(', 'r'], ['−a', 'i', C.mag], [')(', 'r'], ['−b', 'i', C.mag], [')', 'r'], [' = opuesto de (', 'it'], ['−a', 'i', C.mag], [')', 'r'], ['b', 'i']]],
      [15.6, [['(', 'r'], ['−a', 'i', C.mag], [')', 'r'], ['b', 'i'], [' = ', 'r'], ['−ab', 'i', C.mag], ['   pues (−a)b + ab = (−a + a)b = 0', 'it', C.mute]]],
      [21.2, [['(', 'r'], ['−a', 'i', C.mag], [')(', 'r'], ['−b', 'i', C.mag], [') = −(', 'r'], ['−ab', 'i', C.mag], [') = ', 'r'], ['ab', 'i', C.green]]],
    ];
    steps.forEach(([t0, p], i) => fade(A(t, t0, .6), () => F(p, 110, 480 + i * 128, 54, { a: 'l', rev: seg(t, t0, t0 + 1.6), max: 880 })));
    fade(A(t, 23.6, .5), () => T('∎', 984, 1260, { k: 'r', s: 56, a: 'r', c: C.green, g: 12 }));
  },
  // 9 · Cancelativa: dos recibos con el mismo domicilio; 0 · 3 = 0 · 7 es la trampa.
  cancelativa(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => {
      [['recibo 1', 'pedido', 'b'], ['recibo 2', 'pedido', 'c']].forEach(([n, p, v], i) => { const x = 160 + i * 400; stroke('rgba(200,210,245,.6)', 2, () => X.roundRect(x, 420, 360, 300, 18), { g: 0 }); T(n, x + 30, 470, { k: 'mono', s: 22, c: C.mute }); T('domicilio', x + 30, 540, { k: 'mono', s: 26, c: C.ink }); T('a', x + 330, 540, { k: 'i', s: 36, c: C.cyan, a: 'r' }); T(p, x + 30, 600, { k: 'mono', s: 26, c: C.ink }); T(v, x + 330, 600, { k: 'i', s: 36, c: C.amber, a: 'r' }); T('total igual', x + 30, 680, { k: 'mono', s: 24, c: C.green }); });
      fade(A(t, 4, .5), () => { F([['a', 'i', C.cyan], [' + ', 'r'], ['b', 'i', C.amber], [' = ', 'r'], ['a', 'i', C.cyan], [' + ', 'r'], ['c', 'i', C.amber], ['  ⟹  ', 'r'], ['b', 'i', C.amber], [' = ', 'r'], ['c', 'i', C.amber]], CX, 900, 60); stroke(C.cyan, 3, () => { X.moveTo(160, 890); X.lineTo(230, 870); X.moveTo(450, 890); X.lineTo(520, 870); }, { g: 8 }); });
    });
    fade(win(t, 10, 19.8), () => {
      F([['0', 'r', C.red], [' · 3 = ', 'r'], ['0', 'r', C.red], [' · 7', 'r']], CX, 640, 96);
      fade(A(t, 12.4, .5), () => { F([['3', 'r'], [' ≠ ', 'r', C.red], ['7', 'r']], CX, 820, 96); T('cancelar el 0: prohibido', CX, 920, { k: 'mono', s: 26, c: C.red, a: 'c', g: 8 }); });
    });
    fade(A(t, 20, .6), () => { F([['a', 'i', C.cyan], ['b', 'i', C.amber], [' = ', 'r'], ['a', 'i', C.cyan], ['c', 'i', C.amber], ['  y  ', 'r'], ['a', 'i', C.cyan], [' ≠ 0', 'r', C.red], ['  ⟹  ', 'r'], ['b', 'i', C.amber], [' = ', 'r'], ['c', 'i', C.amber]], CX, 800, 60, { max: 960 }); ship(CX, 1080, .8, C.red); });
  },
  // 10 · Cierre: el programa pregunta antes de dividir; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => {
      stroke('rgba(200,210,245,.6)', 2, () => X.roundRect(160, 520, 760, 300, 18), { g: 0 });
      ['si divisor = 0:', '    avisar y no dividir', 'si no:', '    dividir'].forEach((s, i) => fade(A(t, 1 + i * .8, .4), () => T(s, 200, 590 + i * 60, { k: 'mono', s: 32, c: i % 2 ? C.green : C.amber })));
      sea(t, 980, 8); ship(CX + 160 * Math.sin(t * .4), 960, 1, C.cyan);
    });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], [' − ', 'r'], ['b', 'i'], [' = ', 'r'], ['a', 'i'], [' + (', 'r'], ['−b', 'i', C.mag], [')', 'r']], 'restar'], [[['a', 'i'], [' ÷ ', 'r'], ['b', 'i'], [' = ', 'r'], ['a', 'i'], [' · ', 'r'], ['1/b', 'i', C.violet]], 'dividir (b ≠ 0)'], [[['a', 'i'], [' · 0 = 0', 'r']], 'por cero'], [[['(', 'r'], ['−a', 'i', C.mag], [')(', 'r'], ['−b', 'i', C.mag], [') = ', 'r'], ['ab', 'i', C.green]], 'signos']], 420, 170, 50);
      endCard(t, 19.6, D.TITLE, D.LINE, [C.mag, C.violet, C.green]);
    });
  },
};
