// «El epitafio de Diofanto» · escenas de la lección alg-1. Motor en kit.js y parabola.js; guion en lineales.data.js.
// El lado izquierdo en ámbar, el derecho en cian, lo que se hace a los dos lados en rosa, la solución en verde.
const LI = C.amber, LD = C.cyan, OP = C.mag, SO = C.green;
// Una igualdad grande en dos mitades con el = en el centro; o.op muestra la operación debajo de cada lado.
function eq(left, right, y, s, o = {}) {
  F(left, CX - 50, y, s, { a: 'r', max: 440 }); T('=', CX, y, { k: 'r', s, a: 'c' }); F(right, CX + 50, y, s, { a: 'l', max: 440 });
  if (o.op) fade(o.k ?? 1, () => { T(o.op, CX - 260, y + s * .9, { k: 'r', s: s * .55, a: 'c', c: OP }); T(o.op, CX + 260, y + s * .9, { k: 'r', s: s * .55, a: 'c', c: OP }); });
}
const S = {
  // 1 · El papiro de Rhind: el problema 24.
  rhind(t) {
    stars(t, .5);
    fade(A(t, 1, .6), () => { stroke('#e8c88a', 3, () => X.roundRect(170, 420, 740, 300, 14), { g: 10 }); for (let i = 0; i < 6; i++) stroke(hexA('#e8c88a', .4), 2, () => { X.moveTo(210, 480 + i * 40); X.lineTo(210 + 660 * (i % 2 ? .8 : .95), 480 + i * 40); }, { g: 0 }); T('papiro de Rhind · escriba Ahmes', CX, 780, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 9.6, .6), () => T('«una cantidad y su séptimo suman 19»', CX, 900, { k: 'it', s: 44, a: 'c', c: '#ffd9a0' }));
    fade(A(t, 18.6, .6), () => F([['x', 'i', SO], [' + ', 'r'], ['x', 'i', SO], [' / 7 = 19', 'r']], CX, 1060, 88));
  },
  // 2 · Una ecuación: 3x + 4 = 25 y la solución 7.
  ecuacion(t) {
    stars(t, .3);
    eq([['3', 'r', LI], ['x', 'i', SO], [' + 4', 'r', LI]], [['25', 'r', LD]], 640, 100);
    fade(A(t, 10.2, .6), () => { const v = Math.min(9, 1 + Math.floor(seg(t, 10.4, 17) * 9)); T('x = ' + v + ':  3 · ' + v + ' + 4 = ' + (3 * v + 4), CX, 820, { k: 'mono', s: 34, a: 'c', c: 3 * v + 4 === 25 ? SO : C.mute, g: 3 * v + 4 === 25 ? 10 : 0 }); });
    fade(A(t, 19.2, .6), () => { F([['x', 'i', SO], [' = 7', 'r', SO]], CX, 980, 96); T('la solución', CX, 1060, { k: 'mono', s: 26, a: 'c', c: SO }); });
  },
  // 3 · A los dos lados: −4 y ÷3.
  lados(t) {
    stars(t, .3);
    eq([['3', 'r', LI], ['x', 'i', SO], [' + 4', 'r', LI]], [['25', 'r', LD]], 560, 90);
    fade(A(t, 1.6, .6), () => { stroke(hexA(C.ink, .6), 3, () => { X.moveTo(CX - 300, 700); X.lineTo(CX + 300, 700 + 40 * Math.sin(t * 2) * (1 - seg(t, 2, 4))); X.moveTo(CX, 700); X.lineTo(CX, 800); }, { g: 6 }); T('la igualdad se mantiene', CX, 850, { k: 'mono', s: 24, a: 'c', c: C.mute }); });
    fade(A(t, 10.2, .6), () => eq([['3', 'r', LI], ['x', 'i', SO]], [['21', 'r', LD]], 960, 80, { op: '− 4', k: A(t, 10.2, .5) }));
    fade(A(t, 20.2, .6), () => eq([['x', 'i', SO]], [['7', 'r', SO]], 1180, 80, { op: '÷ 3', k: A(t, 20.2, .5) }));
  },
  // 4 · En orden contrario: la ropa y las operaciones.
  orden(t) {
    stars(t, .3);
    const st = ['x', '× 3', '+ 4'], un = ['− 4', '÷ 3', 'x'];
    fade(A(t, .8, .6), () => { st.forEach((s, i) => fade(A(t, 1 + i * .8, .4), () => { chip(260 + i * 280, 600, 200, 90, i ? LI : SO, s, { s: 44, c: i ? LI : SO }); if (i) arrow(260 + (i - 1) * 280 + 110, 600, 260 + i * 280 - 110, 600, LI, 1, 3); })); T('se le hizo', 96, 520, { k: 'mono', s: 24, c: LI }); });
    fade(A(t, 10.2, .6), () => { ['camisa', 'chaqueta'].forEach((w, i) => T((i ? '2.º ' : '1.º ') + 'te pones la ' + w, 260, 760 + i * 50, { k: 'mono', s: 24, c: C.mute })); ['chaqueta', 'camisa'].forEach((w, i) => T((i ? '2.º ' : '1.º ') + 'te quitas la ' + w, 620, 760 + i * 50, { k: 'mono', s: 24, c: OP })); });
    fade(A(t, 19.2, .6), () => { un.forEach((s, i) => fade(A(t, 19.4 + i * .8, .4), () => { chip(260 + i * 280, 1020, 200, 90, i < 2 ? OP : SO, s, { s: 44, c: i < 2 ? OP : SO }); if (i) arrow(260 + (i - 1) * 280 + 110, 1020, 260 + i * 280 - 110, 1020, OP, 1, 3); })); T('para deshacerlo', 96, 940, { k: 'mono', s: 24, c: OP }); });
  },
  // 5 · x a los dos lados: 5x − 3 = 2x + 12.
  ambos(t) {
    stars(t, .3);
    eq([['5', 'r', LI], ['x', 'i', SO], [' − 3', 'r', LI]], [['2', 'r', LD], ['x', 'i', SO], [' + 12', 'r', LD]], 560, 84);
    fade(A(t, 10.2, .6), () => eq([['3', 'r', LI], ['x', 'i', SO], [' − 3', 'r', LI]], [['12', 'r', LD]], 800, 80, { op: '− 2x', k: A(t, 10.2, .5) }));
    fade(A(t, 19.2, .6), () => { eq([['3', 'r', LI], ['x', 'i', SO]], [['15', 'r', LD]], 1020, 72, { op: '+ 3', k: A(t, 19.2, .5) }); fade(A(t, 21.4, .5), () => eq([['x', 'i', SO]], [['5', 'r', SO]], 1220, 80, { op: '÷ 3', k: 1 })); });
  },
  // 6 · Paréntesis: 2(x + 3) = 18 por dos caminos.
  parentesis(t) {
    stars(t, .3);
    eq([['2(', 'r', LI], ['x', 'i', SO], [' + 3)', 'r', LI]], [['18', 'r', LD]], 540, 84);
    fade(A(t, 1.6, .6), () => { T('repartir', 280, 650, { k: 'mono', s: 24, a: 'c', c: OP }); F([['2', 'r'], ['x', 'i', SO], [' + 6 = 18', 'r']], 280, 740, 54); });
    fade(A(t, 10.2, .6), () => { F([['2', 'r'], ['x', 'i', SO], [' = 12', 'r']], 280, 840, 54); F([['x', 'i', SO], [' = 6', 'r', SO]], 280, 940, 60); });
    fade(A(t, 19.2, .6), () => { T('o dividir entre 2', 800, 650, { k: 'mono', s: 24, a: 'c', c: OP }); F([['x', 'i', SO], [' + 3 = 9', 'r']], 800, 740, 54); F([['x', 'i', SO], [' = 6', 'r', SO]], 800, 940, 60); stroke(hexA(C.ink, .3), 2, () => { X.moveTo(CX, 620); X.lineTo(CX, 980); }, { g: 0, dash: [6, 8] }); });
  },
  // 7 · El séptimo de Ahmes: todo por 7.
  septimo(t) {
    stars(t, .3);
    eq([['x', 'i', SO], [' + ', 'r'], ['x', 'i', SO], ['/7', 'r', LI]], [['19', 'r', LD]], 540, 84);
    fade(A(t, 10.2, .6), () => { eq([['7', 'r', LI], ['x', 'i', SO], [' + ', 'r'], ['x', 'i', SO]], [['133', 'r', LD]], 780, 76, { op: '× 7', k: A(t, 10.2, .5) }); fade(A(t, 14, .5), () => eq([['8', 'r', LI], ['x', 'i', SO]], [['133', 'r', LD]], 980, 76)); });
    fade(A(t, 20.2, .6), () => { eq([['x', 'i', SO]], [['133/8 = 16 5/8', 'r', SO]], 1180, 66); });
  },
  // 8 · El epitafio: la vida de Diofanto como barra de 84 años.
  diofanto(t) {
    stars(t, .3);
    const parts = [['niñez', 14, LI], ['juventud', 7, LD], ['soltería', 12, C.violet], ['', 5, C.mute], ['su hijo', 42, SO], ['', 4, C.mute]], x0 = 120, w = 840;
    let acc = 0;
    parts.forEach(([n, y, col], i) => { const a = acc; fade(A(t, 1 + i * .8, .4), () => { bar(x0 + a / 84 * w, 560, y / 84 * w - 3, 90, col, 1, { fill: .3 }); if (n) T(n, x0 + (a + y / 2) / 84 * w, 700, { k: 'mono', s: 20, a: 'c', c: col }); T(t > 20 ? String(y) : ['x/6', 'x/12', 'x/7', '5', 'x/2', '4'][i], x0 + (a + y / 2) / 84 * w, 620, { k: 'r', s: 28, a: 'c', c: C.ink }); }); acc += y; });
    fade(A(t, 10.2, .6), () => F([['x', 'i'], ['/6 + ', 'r'], ['x', 'i'], ['/12 + ', 'r'], ['x', 'i'], ['/7 + 5 + ', 'r'], ['x', 'i'], ['/2 + 4 = ', 'r'], ['x', 'i', SO]], CX, 860, 50, { max: 960 }));
    fade(A(t, 20.2, .6), () => { F([['75', 'r'], ['x', 'i'], [' + 756 = 84', 'r'], ['x', 'i'], ['  →  9', 'r'], ['x', 'i'], [' = 756', 'r']], CX, 980, 48, { max: 960 }); F([['x', 'i', SO], [' = 84', 'r', SO], [' años', 'it']], CX, 1120, 80); });
  },
  // 9 · Ninguna o todas: 1 = 3 y 0 = 0.
  casos(t) {
    stars(t, .3);
    fade(win(t, .5, 19.8), () => { eq([['x', 'i'], [' + 1', 'r', LI]], [['x', 'i'], [' + 3', 'r', LD]], 600, 84); fade(A(t, 2.4, .5), () => { eq([['1', 'r', LI]], [['3', 'r', LD]], 800, 84, { op: '− x', k: 1 }); check(CX + 300, 780, 28, false, A(t, 3.4, .5)); }); fade(A(t, 10.2, .6), () => T('ninguna solución', CX, 1000, { k: 'r', s: 56, a: 'c', c: OP, g: 12 })); });
    fade(A(t, 20, .6), () => { eq([['2', 'r'], ['x', 'i'], [' + 2', 'r', LI]], [['2(', 'r'], ['x', 'i'], [' + 1)', 'r', LD]], 600, 76); fade(A(t, 21.4, .5), () => eq([['0', 'r', LI]], [['0', 'r', LD]], 800, 84, { op: '− 2x − 2', k: 1 })); fade(A(t, 23, .5), () => T('todos los números sirven', CX, 1000, { k: 'r', s: 52, a: 'c', c: SO, g: 12 })); });
  },
  // 10 · Cierre: la balanza de la igualdad; resumen y tarjeta final.
  cierre(t) {
    stars(t, .8);
    fade(win(t, .5, 10.8), () => { F([['x', 'i', SO], [' = 84', 'r', SO]], CX, 700, 160); T('Diofanto', CX, 820, { k: 'it', s: 44, a: 'c', c: '#c3ccec' }); });
    fade(A(t, 11, .6), () => {
      summary(t, 11.4, [[[['lo mismo a los dos lados', 'it', OP]], 'la igualdad se mantiene'], [[['× 3, + 4', 'r'], [' → ', 'r'], ['− 4, ÷ 3', 'r', OP]], 'en orden contrario'], [[['× 7', 'r', OP]], 'quita la fracción /7'], [[['1 = 3', 'r', OP], ['    0 = 0', 'r', SO]], 'ninguna o todas']], 420, 170, 44);
      endCard(t, 19.6, D.TITLE, D.LINE, [LI, SO, LD]);
    });
  },
};
