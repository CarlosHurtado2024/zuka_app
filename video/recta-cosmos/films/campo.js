// «Las reglas del juego» · escenas de la lección alg-12b. Motor en kit.js y recta.js; guion en campo.data.js.
// Suma en cian, producto en ámbar, la distributiva (que une las dos) en verde.
const SUM = C.cyan, PROD = C.amber;
// Una foto esquemática (montañas y sol) centrada en (cx, cy) con escala z.
function photo(cx, cy, z, col = C.violet) {
  if (z < .01) { dot(cx, cy, 6, col, 24); return; }
  const w = 220 * z, h = 150 * z;
  stroke(col, 3, () => X.rect(cx - w / 2, cy - h / 2, w, h), { g: 14 });
  stroke(C.green, 2.5, () => { X.moveTo(cx - w / 2, cy + h / 2); X.lineTo(cx - w * .15, cy - h * .1); X.lineTo(cx + w * .05, cy + h * .15); X.lineTo(cx + w * .25, cy - h * .2); X.lineTo(cx + w / 2, cy + h / 2); }, { g: 10 });
  ring(cx + w * .28, cy - h * .25, Math.max(2, 14 * z), C.amber, 2.5);
}
// Un tablero de ajedrez pequeño (las reglas del juego).
function board(cx, cy, s, k) {
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { if ((i + j) % 2) continue; if ((i * 8 + j) / 64 > k) continue; X.fillStyle = hexA(C.violet, .35); X.fillRect(cx - 4 * s + i * s, cy - 4 * s + j * s, s, s); }
  stroke(C.violet, 2.5, () => X.rect(cx - 4 * s, cy - 4 * s, 8 * s, 8 * s), { g: 12 });
}
const S = {
  // 1 · Euclides: un rollo con «axiomas» y de ellos un árbol de consecuencias que se ramifica.
  euclides(t) {
    stars(t, .4);
    fade(A(t, .8, .6), () => { stroke('#ffd9a0', 3, () => X.roundRect(330, 380, 420, 150, 20), { g: 12 }); T('ΣΤΟΙΧΕΙΑ', CX, 470, { k: 'r', s: 56, a: 'c', c: '#ffd9a0', ls: 6 }); T('«Elementos» · Euclides', CX, 580, { k: 'mono', s: 23, c: C.mute, a: 'c' }); });
    // axiomas: cinco puntos arriba; consecuencias: un árbol que crece hacia abajo
    const ax = [0, 1, 2, 3, 4].map(i => [220 + i * 160, 700]);
    fade(A(t, 9.8, .6), () => ax.forEach(([x, y], i) => { dot(x, y, 12, C.amber, 24); T('axioma ' + (i + 1), x, y - 28, { k: 'mono', s: 20, c: C.amber, a: 'c' }); }));
    const R = rng(4); let lev = ax.slice(), n = 0;
    for (let d = 1; d <= 4; d++) {
      const k = seg(t, 18.6 + (d - 1) * 1.6, 20 + (d - 1) * 1.6), next = [];
      for (let i = 0; i < lev.length * 1.6 && next.length < 34; i++) { const a = lev[Math.floor(R() * lev.length)], b = lev[Math.floor(R() * lev.length)], x = (a[0] + b[0]) / 2 + (R() - .5) * 160, y = 700 + d * 130; next.push([x, y]); if (k > 0) { stroke(hexA(C.cyan, .5), 1.5, () => { X.moveTo(a[0], a[1]); X.lineTo(lerp(a[0], x, k), lerp(a[1], y, k)); X.moveTo(b[0], b[1]); X.lineTo(lerp(b[0], x, k), lerp(b[1], y, k)); }, { g: 0 }); if (k > .95) { dot(x, y, 6, C.cyan, 12); n++; } } }
      lev = next;
    }
    fade(A(t, 18.6, .5), () => T('consecuencias = ' + n, 96, 1360, { k: 'mono', s: 26, c: C.cyan, g: 8 }));
  },
  // 2 · El reglamento: un tablero se dibuja; ∀ grande; «campo» y Dedekind.
  reglamento(t) {
    stars(t, .4);
    fade(win(t, .5, 9.8), () => { board(CX, 700, 48, seg(t, .6, 4)); T('reglas del juego · reglas de los números', CX, 1000, { k: 'mono', s: 24, c: C.mute, a: 'c' }); });
    fade(win(t, 10, 18.8), () => { T('∀', CX, 760, { k: 'r', s: 300, a: 'c', c: C.violet, g: 30 }); T('«para todo»', CX, 860, { k: 'it', s: 48, a: 'c', c: '#c3ccec' }); F([['∀', 'r', C.violet], [' ', 'r'], ['a', 'i', SUM], [', ', 'r'], ['b', 'i', PROD], [' ∈ ', 'r'], ['ℝ', 'r', C.violet]], CX, 1040, 72); });
    fade(A(t, 19, .6), () => {
      [['cerradura', SUM], ['conmutativa', PROD], ['asociativa', C.green], ['neutros', C.cyan], ['inversos', C.mag], ['distributiva', C.green]].forEach(([s, c], i) => fade(A(t, 19.4 + i * .5, .4), () => { stroke(c, 2.5, () => X.roundRect(170 + (i % 2) * 380, 480 + Math.floor(i / 2) * 140, 360, 100, 16), { g: 10 }); T(s, 350 + (i % 2) * 380, 545 + Math.floor(i / 2) * 140, { k: 'it', s: 42, a: 'c', c: C.ink }); }));
      T('Körper · Richard Dedekind, 1871', CX, 1000, { k: 'mono', s: 24, c: C.mute, a: 'c' });
    });
  },
  // 3 · Conmutativa: el ticket del mercado en dos órdenes; la cuadrícula 3×5 que gira; la resta que no.
  conmutativa(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => {
      const items = [['pan', 3500], ['leche', 4200], ['huevos', 9800], ['café', 12500]];
      const orderB = [2, 0, 3, 1], sw = eio(seg(t, 11, 13.4));
      stroke('rgba(200,210,245,.6)', 2, () => X.roundRect(140, 380, 360, 360, 18), { g: 0 }); stroke('rgba(200,210,245,.6)', 2, () => X.roundRect(580, 380, 360, 360, 18), { g: 0 });
      T('caja 1', 320, 420, { k: 'mono', s: 22, c: C.mute, a: 'c' }); T('caja 2', 760, 420, { k: 'mono', s: 22, c: C.mute, a: 'c' });
      items.forEach(([s, v], i) => fade(A(t, 1 + i * .5, .4), () => { T(s, 170, 480 + i * 50, { k: 'mono', s: 24, c: C.ink }); T(num(v), 470, 480 + i * 50, { k: 'mono', s: 24, c: SUM, a: 'r' }); }));
      orderB.forEach((j, i) => fade(A(t, 10.4 + i * .5, .4), () => { T(items[j][0], 610, 480 + i * 50, { k: 'mono', s: 24, c: C.ink }); T(num(items[j][1]), 910, 480 + i * 50, { k: 'mono', s: 24, c: SUM, a: 'r' }); }));
      const tot = items.reduce((a, b) => a + b[1], 0);
      fade(A(t, 3.4, .5), () => T('total ' + num(tot), 470, 710, { k: 'mono', s: 26, c: C.amber, a: 'r', g: 8 }));
      fade(A(t, 12.6, .5), () => T('total ' + num(tot), 910, 710, { k: 'mono', s: 26, c: C.amber, a: 'r', g: 8 }));
      // 3 filas de 5 y 5 filas de 3
      fade(A(t, 14, .6), () => { const a = Math.PI / 2 * eio(seg(t, 15, 17)); X.save(); X.translate(CX, 1000); X.rotate(a); for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) dot(-100 + i * 50, -50 + j * 50, 9, PROD, 14); X.restore(); T(a > .78 ? '5 · 3 = 15' : '3 · 5 = 15', CX, 1190, { k: 'r', s: 48, a: 'c', c: PROD }); });
      fade(A(t, 3.6, .6), () => F([['a', 'i', SUM], [' + ', 'r'], ['b', 'i', PROD], [' = ', 'r'], ['b', 'i', PROD], [' + ', 'r'], ['a', 'i', SUM]], CX, 830, 64));
    });
    fade(A(t, 20, .6), () => {
      const px = nline(130, 950, 760, -6, 10, {});
      hop(px(9), px(5), 760, 90, C.green, seg(t, 20.6, 22.2)); fade(A(t, 22, .4), () => F([['9 − 4 = ', 'r'], ['5', 'r', C.green]], 300, 980, 64));
      hop(px(4), px(-5), 760, 140, C.mag, seg(t, 23, 25)); fade(A(t, 25, .4), () => F([['4 − 9 = ', 'r'], ['−5', 'r', C.mag]], 780, 980, 64));
      fade(A(t, 25.6, .5), () => F([['9 − 4', 'r'], [' ≠ ', 'r', C.red], ['4 − 9', 'r']], CX, 1130, 72));
    });
  },
  // 4 · Asociativa: tres bloques que se agrupan de dos maneras; 17 + (25 + 75).
  asociativa(t) {
    stars(t, .3);
    const g = t < 5 ? 0 : eio(seg(t, 5, 7.4));
    const blocks = [[17, C.cyan], [25, C.amber], [75, C.green]], y = 620, unit = 6;
    let x = 140;
    blocks.forEach(([v, col], i) => { const off = i === 0 ? -40 * g : i === 1 ? 40 * g - 40 * (1 - g) : 40 * (1 - g) * 0; const xx = x + (i === 0 ? 0 : i === 1 ? lerp(-40, 40, g) + 40 : 80); X.save(); X.fillStyle = hexA(col, .2); X.fillRect(xx, y - 40, v * unit, 80); X.restore(); stroke(col, 3, () => X.rect(xx, y - 40, v * unit, 80), { g: 12 }); T(String(v), xx + v * unit / 2, y + 14, { k: 'r', s: 44, a: 'c', c: C.ink }); x += v * unit; });
    F(g < .5 ? [['(17 + 25)', 'r', C.violet], [' + 75', 'r']] : [['17 + ', 'r'], ['(25 + 75)', 'r', C.violet]], CX, 820, 72);
    fade(A(t, 10, .6), () => { F([['17 + ', 'r'], ['(25 + 75)', 'r', C.violet], [' = 17 + ', 'r'], ['100', 'r', C.green], [' = ', 'r'], ['117', 'r', C.amber]], CX, 960, 56, { rev: seg(t, 10.2, 14), max: 940 }); });
    fade(A(t, 20, .6), () => F([['(', 'r'], ['a', 'i'], ['b', 'i'], [')', 'r'], ['c', 'i'], [' = ', 'r'], ['a', 'i'], ['(', 'r'], ['b', 'i'], ['c', 'i'], [')', 'r']], CX, 1120, 84));
    T('paréntesis movidos = ' + (t > 5 ? 1 : 0), 96, 1300, { k: 'mono', s: 26, c: C.violet, g: 8 });
  },
  // 5 · Neutros: + 0 deja el punto quieto; × 1 deja la foto igual (zoom al 100 %).
  neutros(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { const px = nline(130, 950, 700, -2, 8, {}); dot(px(5), 700, 13, SUM, 26); hop(px(5), px(5) + .01, 700, 80, SUM, seg(t, 2, 3)); F([['5 + 0 = ', 'r'], ['5', 'r', SUM]], CX, 900, 80); F([['5 · 1 = ', 'r'], ['5', 'r', PROD]], CX, 1020, 80); });
    fade(A(t, 10, .6), () => { photo(CX, 700, 1.6); T('zoom × 1 = 100 %', CX, 900, { k: 'mono', s: 30, c: PROD, a: 'c', g: 8 }); F([['a', 'i'], [' · 1 = ', 'r'], ['a', 'i']], CX, 1060, 84); });
  },
  // 6 · Opuesto: 30 pasos adelante y 30 atrás; −0 = 0.
  opuesto(t) {
    stars(t, .3);
    const px = nline(110, 990, 760, -10, 40, { step: 10 });
    const f = eio(seg(t, 10.6, 13)), b = eio(seg(t, 13.4, 15.8)), x = t < 13.4 ? lerp(px(0), px(30), f) : lerp(px(30), px(0), b);
    if (t > 10) { arrow(px(0), 700, lerp(px(0), px(30), f), 700, SUM, f, 3); if (t > 13.4) arrow(px(30), 820, lerp(px(30), px(0), b), 820, C.mag, b, 3); dot(x, 760, 14, C.amber, 30); }
    fade(A(t, 1, .6), () => F([['a', 'i', SUM], [' + (', 'r'], ['−a', 'i', C.mag], [') = ', 'r'], ['0', 'r', C.amber]], CX, 560, 84));
    fade(A(t, 10.4, .5), () => T('pasos = ' + Math.round(t < 13.4 ? 30 * f : 30 - 30 * b), 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 }));
    fade(A(t, 16, .5), () => F([['30', 'r', SUM], [' + (', 'r'], ['−30', 'r', C.mag], [') = 0', 'r']], CX, 1000, 72));
    fade(A(t, 20.2, .5), () => F([['−0 = 0', 'r', C.amber]], CX, 1120, 72));
  },
  // 7 · Recíproco: zoom × 4 y × 1/4; zoom × 0 aplasta la foto en un punto sin vuelta.
  reciproco(t) {
    stars(t, .3);
    fade(A(t, .8, .6), () => F([['a', 'i', PROD], [' · ', 'r'], ['1/a', 'i', C.mag], [' = ', 'r'], ['1', 'r', C.amber], ['     (', 'r'], ['a', 'i'], [' ≠ 0)', 'r', C.red]], CX, 470, 64));
    let z = 1, lab = '× 1';
    if (t > 10 && t < 21) { const a = eio(seg(t, 11, 13.6)), b = eio(seg(t, 14.6, 17.2)); z = t < 14.6 ? lerp(1, 2.2, a) : lerp(2.2, 1, b); lab = t < 14.6 ? '× 4' : '× 4 · 1/4 = × 1'; }
    if (t >= 21) { const c = eio(seg(t, 21.6, 24)); z = lerp(1, 0, c); lab = '× 0'; }
    photo(CX, 760, z * 1.1);
    T('zoom ' + lab, 96, 1196, { k: 'mono', s: 28, c: t >= 21 ? C.red : PROD, g: 8 });
    if (t >= 25) { fade(A(t, 25, .5), () => { T('× ? = foto de vuelta', 984, 1196, { k: 'mono', s: 26, c: C.red, a: 'r' }); F([['0 · ', 'r'], ['?', 'r', C.red], [' = 1', 'r']], CX, 1020, 96); T('ningún número sirve', CX, 1100, { k: 'mono', s: 25, c: C.red, a: 'c', g: 8 }); }); }
    else if (t > 17.4) fade(A(t, 17.4, .5), () => F([['4 · ', 'r', PROD], ['1/4', 'r', C.mag], [' = 1', 'r', C.amber]], CX, 1020, 84));
  },
  // 8 · Distributiva: tres combos (hamburguesa + jugo) que se separan en dos filas.
  distributiva(t) {
    stars(t, .3);
    const sp = eio(seg(t, 12.6, 15));
    for (let i = 0; i < 3; i++) {
      const y0 = 520 + i * 130, hx = lerp(200 + i * 0, 160 + i * 140, sp), hy = lerp(y0, 560, sp), jx = lerp(380, 600 + i * 140, sp), jy = lerp(y0, 560, sp);
      fade(A(t, 1 + i * .5, .5), () => {
        if (sp < .2) fade(1 - sp * 5, () => stroke(C.green, 2, () => X.roundRect(140, y0 - 50, 330, 100, 16), { g: 6 }));
        stroke(PROD, 3, () => X.roundRect(hx - 40, hy - 30, 120, 60, 22), { g: 12 }); T('12', hx + 20, hy + 12, { k: 'r', s: 34, a: 'c', c: PROD });
        stroke(SUM, 3, () => X.roundRect(jx - 20, jy - 34, 60, 68, 10), { g: 12 }); T('4', jx + 10, jy + 12, { k: 'r', s: 34, a: 'c', c: SUM });
      });
    }
    fade(win(t, 2.4, 12.4), () => F([['3 · (', 'r'], ['12', 'r', PROD], [' + ', 'r'], ['4', 'r', SUM], [')', 'r'], [' = 3 · 16 = 48', 'r']], CX, 1000, 64));
    fade(A(t, 15, .6), () => { F([['3 · ', 'r'], ['12', 'r', PROD], [' + 3 · ', 'r'], ['4', 'r', SUM], [' = 36 + 12 = 48', 'r']], CX, 1000, 60); T('en miles de pesos', CX, 1070, { k: 'mono', s: 22, c: C.mute, a: 'c' }); });
    fade(A(t, 20, .6), () => F([['a', 'i', C.green], ['(', 'r'], ['b', 'i', PROD], [' + ', 'r', SUM], ['c', 'i', SUM], [') = ', 'r'], ['a', 'i', C.green], ['b', 'i', PROD], [' + ', 'r', SUM], ['a', 'i', C.green], ['c', 'i', SUM]], CX, 1180, 84, { rev: seg(t, 20.2, 22.4) }));
    T('combos = 3', 96, 1300, { k: 'mono', s: 26, c: C.green, g: 8 });
  },
  // 9 · El reglamento completo: cerradura y la tabla de las reglas, suma y producto.
  completo(t) {
    stars(t, .3);
    fade(win(t, .5, 9.8), () => { family(CX, 740, 400, 260, 'ℝ', C.violet, eio(seg(t, .6, 2.2)), { lx: CX + 320, ly: 520 }); const k = seg(t, 2.4, 5); dot(CX - 160, 740, 11, SUM, 18); dot(CX - 40, 740, 11, SUM, 18); if (k > 0) { arrow(CX - 100, 700, CX + 120, 690, SUM, eio(k), 2.5); } fade(A(t, 5, .4), () => { dot(CX + 160, 700, 13, C.green, 30); T('a + b', CX + 160, 660, { k: 'it', s: 36, a: 'c', c: C.green }); T('sigue dentro de ℝ', CX, 1060, { k: 'mono', s: 25, c: C.green, a: 'c' }); }); });
    fade(A(t, 10, .6), () => {
      T('suma', 560, 440, { k: 'mono', s: 26, c: SUM, a: 'c' }); T('producto', 850, 440, { k: 'mono', s: 26, c: PROD, a: 'c' });
      const rows = [['cerradura', [['a', 'i'], [' + ', 'r'], ['b', 'i'], [' ∈ ℝ', 'r']], [['ab', 'i'], [' ∈ ℝ', 'r']]], ['conmutativa', [['a', 'i'], ['+', 'r'], ['b', 'i'], ['=', 'r'], ['b', 'i'], ['+', 'r'], ['a', 'i']], [['ab', 'i'], [' = ', 'r'], ['ba', 'i']]], ['asociativa', [['(', 'r'], ['a', 'i'], ['+', 'r'], ['b', 'i'], [')+', 'r'], ['c', 'i'], ['=…', 'r']], [['(', 'r'], ['ab', 'i'], [')', 'r'], ['c', 'i'], ['=…', 'r']]], ['neutro', [['a', 'i'], [' + 0 = ', 'r'], ['a', 'i']], [['a', 'i'], [' · 1 = ', 'r'], ['a', 'i'], [', 1 ≠ 0', 'r']]], ['inverso', [['a', 'i'], [' + (', 'r'], ['−a', 'i'], [') = 0', 'r']], [['a', 'i'], [' · 1/', 'r'], ['a', 'i'], [' = 1 (', 'r'], ['a', 'i'], [' ≠ 0)', 'r']]]];
      rows.forEach(([n, a, b], i) => fade(A(t, 10.4 + i * .9, .5), () => { const y = 520 + i * 100; T(n, 110, y + 12, { k: 'it', s: 34, c: C.ink }); F(a, 560, y + 12, 36, { max: 260, c: '#cfe9ff' }); F(b, 850, y + 12, 36, { max: 250, c: '#ffe9c2' }); }));
      fade(A(t, 15.4, .5), () => { T('distributiva', 110, 1032, { k: 'it', s: 34, c: C.green }); F([['a', 'i'], ['(', 'r'], ['b', 'i'], [' + ', 'r'], ['c', 'i'], [') = ', 'r'], ['ab', 'i'], [' + ', 'r'], ['ac', 'i']], 700, 1032, 40, { c: '#d6ffe8' }); });
      T('reglas = 11', 96, 1196, { k: 'mono', s: 26, c: C.amber, g: 8 });
    });
  },
  // 10 · Cierre: el árbol de Euclides en pequeño; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { board(CX, 700, 40, 1); T('pocas reglas → toda el álgebra', CX, 1000, { k: 'it', s: 44, a: 'c', c: '#ffd9a0' }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['a', 'i'], [' + ', 'r'], ['b', 'i'], [' = ', 'r'], ['b', 'i'], [' + ', 'r'], ['a', 'i']], 'conmutativa'], [[['(', 'r'], ['a', 'i'], ['b', 'i'], [')', 'r'], ['c', 'i'], [' = ', 'r'], ['a', 'i'], ['(', 'r'], ['b', 'i'], ['c', 'i'], [')', 'r']], 'asociativa'], [[['a', 'i'], [' + (', 'r'], ['−a', 'i', C.mag], [') = 0', 'r']], 'opuesto'], [[['a', 'i'], [' · ', 'r'], ['1/a', 'i', C.mag], [' = 1', 'r']], 'recíproco (a ≠ 0)']], 420, 170, 50);
      endCard(t, 19.6, D.TITLE, D.LINE, [SUM, C.green, PROD]);
    });
  },
};
