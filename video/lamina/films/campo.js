// Lección alg-12b · Axiomas de campo: las reglas de la suma y el producto (mundo La Recta Real).
// Qué es un axioma y qué dice ∀; cerradura; conmutativa (barras y rectángulo girado); asociativa; neutros; opuesto y
// recíproco (el 0 no tiene); distributiva con un rectángulo partido (7 · 13); usarlas para calcular de cabeza.
const R = String.raw;
const POSTER = 200;
const U = 62;                                               // píxeles por unidad en las barras
function seg1(x, y, n, o = {}) { const w = n * U; fillP(o.c || P.ac, o.a ?? .45, () => X.roundRect(x, y, w, 70, 10)); rect(x, y, w, 70, { r: 10, w: 4, c: o.line || P.ink }); if (o.label) M(o.label, x + w / 2, y + 50, 46, { c: P.ink, pass: true }); }
function grid(x, y, cols, rows, cell, o = {}) { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const k = o.k ?? 1; if ((r * cols + c) / (rows * cols) > k) continue; fillP(o.c || P.ac, .35, () => X.roundRect(x + c * cell + 3, y + r * cell + 3, cell - 6, cell - 6, 6)); } rect(x, y, cols * cell, rows * cell, { w: 4 }); }
const FILM = {
  lesson: 'alg-12b', world: 'numeros', key: 'A', n: [4, 6],
  title: 'Axiomas de campo: las reglas de la suma y el producto',
  next: 'Consecuencias de los axiomas: restar, dividir y los signos',
  intro: 'Sumar y multiplicar siguen unas pocas reglas. Con ellas se justifica todo el álgebra. Son los axiomas de campo.',
  examples: ['7 · 13', '13 + 48 + 7', '2 · (5 · 13)', '3 · 5', '5 − 2'],
  scenes: [
    { id: 'axioma', name: 'Qué es un axioma', dur: 28,
      caps: [[0.5, 9.0, 'AXIOMA', 'Una regla que se acepta', 'sin demostrarla.'], [9.4, 18.0, 'COMO EN UN JUEGO', 'Las reglas no se discuten:', 'se usan para jugar.'],
        [18.4, 27.4, 'EL SÍMBOLO ∀', 'Se lee «para todo»: la regla', 'vale con cualquier real.']],
      narr: [[0.5, 9.0, 'Un axioma es una regla que se acepta sin demostrar. Es el punto de partida: con los axiomas se demuestra todo lo demás.'],
        [9.4, 18.0, 'Es como el reglamento de un juego. Nadie demuestra cómo se mueve el caballo en el ajedrez: es la regla, y con ella se juega.'],
        [18.4, 27.4, 'Los axiomas se escriben con letras, porque valen para cualquier número. Esta A al revés se lee para todo.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 3], [18.8, 'card']],
      draw(t) {
        const items = ['a + b = b + a', 'a + 0 = a', 'a · 1 = a', 'a(b + c) = ab + ac'];
        note(150, 480, 780, 560, A(t, .8), () => { T('REGLAS DE LOS NÚMEROS', 200, 550, { s: 28, w: 600, ls: 4, c: P.ac, halo: false, pass: true }); items.forEach((s, i) => fade(A(t, 1.6 + i * .5), () => M(s, 200, 660 + i * 110, 58, { a: 'l', pass: true }))); });
        fade(A(t, 19.0), () => M(R`∀\, a, b ∈ ℝ`, 540, 1340, 96, { id: 'pt' }));
        fade(A(t, 20.0), () => label('«para todo a y b que pertenecen a los reales»', 540, 1460, P.mute, { s: 38 }));
      } },
    { id: 'cerradura', name: 'Cerradura', dur: 23,
      caps: [[0.5, 11.0, 'CERRADURA', 'Sumar o multiplicar reales', 'da otro real.'], [11.4, 22.4, 'SE ESCRIBE', '$a + b ∈ ℝ$ y $ab ∈ ℝ$', 'para todo $a, b ∈ ℝ$.']],
      narr: [[0.5, 11.0, 'La primera regla: si se suman o se multiplican dos números reales, el resultado es otro número real. Nunca se sale del conjunto.'],
        [11.4, 22.4, 'Se dice que los reales son cerrados para la suma y el producto. Es la regla que los naturales no cumplían con la resta.']],
      ev: [[1.0, 'fly', 1.0], [3.0, 'fly', 1.0], [11.8, 'rise']],
      draw(t) {
        rect(110, 480, 860, 640, { r: 26, w: 6 }); M('ℝ', 150, 555, 70, { a: 'l', pass: true });
        [['a', 330, 700], ['b', 480, 900]].forEach(([s, x, y]) => el(s, x, y));
        const k1 = draw(t, 1.0, 1.0), k2 = draw(t, 3.0, 1.0);
        if (k1 > 0) { arrow(400, 760, lerp(400, 720, k1), lerp(760, 720, k1), { c: P.ac, w: 4, h: 18 }); if (k1 >= 1) el('a + b', 740, 700, { c: P.ac, s: 52 }); }
        if (k2 > 0) { arrow(550, 920, lerp(550, 720, k2), lerp(920, 960, k2), { c: P.ac, w: 4, h: 18 }); if (k2 >= 1) el('ab', 740, 980, { c: P.ac, s: 52 }); }
        fade(A(t, 11.8), () => M(R`a + b ∈ ℝ \qquad ab ∈ ℝ`, 540, 1340, 80, { id: 'cer' }));
      } },
    { id: 'conmutativa', name: 'Conmutativa', dur: 34,
      caps: [[0.5, 9.0, 'CONMUTATIVA', 'El orden de los sumandos', 'no cambia la suma.'], [9.4, 20.0, 'TAMBIÉN EL PRODUCTO', '$3 · 5 = 5 · 3$: el mismo', 'rectángulo, girado.'],
        [20.4, 33.4, '!LA RESTA NO', '$5 − 2 = 3$, pero', '$2 − 5 = −3$.']],
      narr: [[0.5, 9.0, 'Poner una barra de tres y luego una de cinco da lo mismo que ponerlas al revés: el largo total es ocho. Es la propiedad conmutativa.'],
        [9.4, 20.0, 'Con el producto pasa igual. Tres filas de cinco son quince cuadritos; si se gira el rectángulo, quedan cinco filas de tres: los mismos quince.'],
        [20.4, 33.4, 'Ojo: la resta no es conmutativa. Cinco menos dos es tres, pero dos menos cinco es menos tres. No siempre se puede cambiar el orden.']],
      ev: [[1.0, 'rise'], [3.4, 'shuffle', 1.2], [9.8, 'draw', 1.0], [13.4, 'shuffle', 1.4], [21.0, 'no']],
      draw(t) {
        if (t < 9.4) { const k = eio(seg(t, 3.4, 4.6)), x0 = 230;
          fade(A(t, 1.0), () => { seg1(x0, 620, 3, { label: '3' }); seg1(x0 + 3 * U, 620, 5, { label: '5', a: .25 }); });
          fade(A(t, 3.2), () => { seg1(lerp(x0, x0 + 5 * U, k), 800 - Math.sin(Math.PI * k) * 40, 3, { label: '3' }); seg1(lerp(x0 + 3 * U, x0, k), 800 + Math.sin(Math.PI * k) * 40, 5, { label: '5', a: .25 }); });
          fade(A(t, 4.8), () => brace(x0, x0 + 8 * U, 900, { label: '8', m: true, k: 1, s: 50 })); }
        else if (t < 20.4) { const r = eio(seg(t, 13.4, 14.8)), cell = 70; at(540, 800, 1, () => { X.save(); X.translate(540, 800); X.rotate(r * Math.PI / 2); X.translate(-540, -800); grid(540 - 2.5 * cell, 800 - 1.5 * cell, 5, 3, cell, { k: draw(t, 9.8, 1.0) }); X.restore(); });
          fade(A(t, 15.0), () => label('15 cuadritos', 540, 1080, P.mute, { s: 40 })); }
        else { const X_ = axis({ x0: 110, x1: 960, y: 820, v0: -5, v1: 6, ticks: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6], k: 1, ls: 38 }); for (let i = 0; i < 2; i++) hop(X_(5 - i), X_(4 - i), 820, draw(t, 21.0 + i * .4, .35), { c: P.ac, h: 50 }); for (let i = 0; i < 5; i++) hop(X_(2 - i), X_(1 - i), 820, draw(t, 23.0 + i * .4, .35), { c: P.no, h: 50, below: true });
          fade(A(t, 22.0), () => dot(X_(3), 820, { r: 12, c: P.ac })); fade(A(t, 25.0), () => dot(X_(-3), 820, { r: 12, c: P.no })); }
        fade(A(t, 1.2) * (1 - A(t, 9.2)), () => { M(R`3 + 5 = 5 + 3`, 540, 1340, 86, { id: 'n' }); M(R`a + b = b + a`, 540, 1480, 70, { id: 'g', c: P.ac }); });
        fade(A(t, 9.8) * (1 - A(t, 20.2)), () => { M(R`3 · 5 = 5 · 3`, 540, 1340, 86, { id: 'np' }); M(R`ab = ba`, 540, 1480, 70, { id: 'gp', c: P.ac }); });
        fade(A(t, 21.0), () => M(R`5 − 2 = 3 \quad \no{≠} \quad 2 − 5 = −3`, 540, 1340, 68, { id: 'res' }));
      } },
    { id: 'asociativa', name: 'Asociativa', dur: 31,
      caps: [[0.5, 9.0, 'ASOCIATIVA', 'Para sumar tres números,', 'da igual cuáles van primero.'], [9.4, 18.0, 'LOS PARÉNTESIS', 'Dicen qué se hace primero;', 'aquí no cambian el total.'],
        [18.4, 30.4, 'CON EL PRODUCTO', '$(2 · 5) · 13 = 2 · (5 · 13)$:', '130 por los dos caminos.']],
      narr: [[0.5, 9.0, 'Para sumar tres barras se pueden juntar primero las dos de la izquierda o las dos de la derecha. El largo total es el mismo.'],
        [9.4, 18.0, 'Los paréntesis dicen qué se hace primero. En una suma, moverlos no cambia nada. Es la propiedad asociativa.'],
        [18.4, 30.4, 'Con el producto también. Dos por cinco, y luego por trece, da ciento treinta. Cinco por trece, y luego por dos, da lo mismo.']],
      ev: [[1.0, 'rise'], [3.0, 'brace'], [6.0, 'brace'], [18.8, 'rise'], [22.0, 'card']],
      draw(t) {
        const x0 = 200; fade(A(t, 1.0) * (1 - A(t, 18.2)), () => { seg1(x0, 620, 2, { label: 'a' }); seg1(x0 + 2 * U, 620, 4, { label: 'b', a: .25 }); seg1(x0 + 6 * U, 620, 5, { label: 'c', a: .6 });
          fade(A(t, 3.0), () => brace(x0, x0 + 6 * U, 600, { up: true, label: '(a + b)', m: true, k: 1, s: 46 })); fade(A(t, 6.0), () => brace(x0 + 2 * U, x0 + 11 * U, 710, { label: '(b + c)', m: true, k: 1, s: 46 })); });
        fade(A(t, 18.6), () => { M(R`\hl{(2 · 5)} · 13 = 10 · 13 = 130`, 540, 720, 66, { id: 'p1' }); fade(A(t, 21.0), () => M(R`2 · \hl{(5 · 13)} = 2 · 65 = 130`, 540, 860, 66, { id: 'p2' })); });
        fade(A(t, 1.6) * (1 - A(t, 18.2)), () => M(R`(a + b) + c = a + (b + c)`, 540, 1340, 70, { id: 's' }));
        fade(A(t, 22.0), () => M(R`(ab)c = a(bc)`, 540, 1340, 80, { id: 'p', c: P.ac }));
      } },
    { id: 'neutros', name: 'Los neutros', dur: 27,
      caps: [[0.5, 9.0, 'NEUTRO DE LA SUMA', 'Sumar 0 no cambia nada:', '$a + 0 = a$.'], [9.4, 18.0, 'NEUTRO DEL PRODUCTO', 'Multiplicar por 1 no cambia', 'nada: $a · 1 = a$.'],
        [18.4, 26.4, 'POR ESO SE LLAMAN', 'Neutros: dejan cada', 'número como estaba.']],
      narr: [[0.5, 9.0, 'Sumar cero es no moverse en la recta. Cualquier número más cero sigue siendo el mismo número.'],
        [9.4, 18.0, 'Multiplicar por uno es tomar una sola vez el número. Tampoco cambia nada.'],
        [18.4, 26.4, 'Por eso el cero y el uno se llaman neutros: el cero para la suma y el uno para el producto.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'draw', 1.0], [18.8, 'yes']],
      draw(t) {
        const X_ = axis({ x0: 110, x1: 960, y: 760, v0: -2, v1: 5, ticks: [-2, -1, 0, 1, 2, 3, 4, 5], k: draw(t, 1.0, 1.0), ls: 38 });
        dot(X_(2.5), 760, { r: 13, c: P.ac, ping: ping(t, 2.0) }); M('a', X_(2.5), 700, 52, { c: P.ac, pass: true }); fade(A(t, 2.0), () => { circ(X_(2.5), 760, 34, { c: P.ac, w: 4 }); label('sumar 0: no se mueve', X_(2.5), 860, P.mute, { s: 36 }); });
        fade(A(t, 9.8), () => { seg1(250, 1000, 5, { label: 'a' }); label('× 1: una sola vez', 250 + 2.5 * U, 1130, P.mute, { s: 36 }); });
        fade(A(t, 1.4), () => M(R`a + \hl{0} = a`, 540, 1360, 86, { id: 'n0' }));
        fade(A(t, 10.0), () => M(R`a · \hl{1} = a`, 540, 1500, 86, { id: 'n1' }));
      } },
    { id: 'inversos', name: 'Los inversos', dur: 38,
      caps: [[0.5, 9.0, 'INVERSO ADITIVO', 'El opuesto $−a$ lleva', 'al neutro: $a + (−a) = 0$.'], [9.4, 20.0, 'INVERSO MULTIPLICATIVO', R`El recíproco $\frac{1}{a}$ lleva`, R`al uno: $a · \frac{1}{a} = 1$.`],
        [20.4, 29.0, 'EJEMPLO', 'Cuatro cuartos', 'hacen una unidad.'], [29.4, 37.4, '!EL CERO NO', '$0 · x = 0$ para todo $x$:', 'nunca da 1.']],
      narr: [[0.5, 9.0, 'Cada número tiene un opuesto que, sumado con él, da el neutro cero. Es el inverso de la suma.'],
        [9.4, 20.0, 'Y cada número distinto de cero tiene un recíproco, uno sobre a, que multiplicado con él da el neutro uno. Es el inverso del producto.'],
        [20.4, 29.0, 'Por ejemplo, cuatro por un cuarto: cuatro pedazos de un cuarto completan una unidad.'],
        [29.4, 37.4, 'El cero no tiene recíproco: cero por cualquier número da cero, nunca uno. Por eso la regla dice a distinto de cero.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'rise'], [20.8, 'pops', 4], [23.4, 'card'], [29.8, 'no']],
      draw(t) {
        if (t < 9.4) { const X_ = axis({ x0: 110, x1: 960, y: 760, v0: -5, v1: 5, ticks: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], k: 1, ls: 38 }); hop(X_(0), X_(3), 760, draw(t, 1.0, .7), { c: P.ac, label: 'a', h: 120 }); hop(X_(3), X_(0), 760, draw(t, 2.0, .7), { c: P.mute, label: '−a', below: true, h: 120 }); fade(A(t, 2.8), () => dot(X_(0), 760, { r: 13, c: P.ac, ping: ping(t, 2.8) })); }
        else { const cw = 170; for (let i = 0; i < 4; i++) { const k = A(t, 20.8 + i * .5, .4); fade(k, () => { fillP(P.ac, .4, () => X.roundRect(200 + i * cw + 4, 660, cw - 8, 120, 10)); rect(200 + i * cw + 4, 660, cw - 8, 120, { r: 10, w: 4 }); M(R`\frac{1}{4}`, 200 + i * cw + cw / 2, 740, 46, { pass: true }); }, (1 - k) * -60); } fade(A(t, 23.4), () => { rect(196, 650, 4 * cw + 8, 140, { r: 14, c: P.ac, w: 5 }); label('una unidad', 540, 860, P.ac, { s: 40 }); }); }
        fade(A(t, 1.4) * (1 - A(t, 9.2)), () => M(R`a + (−a) = 0`, 540, 1360, 86, { id: 'op' }));
        fade(A(t, 9.8), () => M(R`a · \frac{1}{a} = 1 \quad (a ≠ 0)`, 540, 1340, 80, { id: 'rec' }));
        fade(A(t, 23.4), () => M(R`4 · \frac{1}{4} = 1`, 540, 1520, 76, { id: 'ej' }));
        fade(A(t, 29.8), () => M(R`0 · x = 0 \no{≠ 1}`, 540, 1680, 76, { id: 'cero' }));
      } },
    { id: 'distributiva', name: 'Distributiva', dur: 37,
      caps: [[0.5, 9.0, 'UN RECTÁNGULO', 'De 7 por 13: su área', 'es el producto $7 · 13$.'], [9.4, 19.0, 'SE PARTE', '$13 = 10 + 3$: dos', 'rectángulos más fáciles.'],
        [19.4, 28.0, 'DISTRIBUTIVA', 'El 7 se reparte sobre', 'cada sumando.'], [28.4, 36.4, 'EN GENERAL', '$a(b + c) = ab + ac$:', 'une la suma y el producto.']],
      narr: [[0.5, 9.0, 'Un rectángulo de siete por trece tiene un área de siete por trece. Multiplicar de cabeza no es tan fácil.'],
        [9.4, 19.0, 'Pero trece es diez más tres. Si se corta el rectángulo ahí, quedan dos: uno de siete por diez y otro de siete por tres.'],
        [19.4, 28.0, 'Setenta más veintiuno da noventa y uno. El siete se repartió sobre cada sumando. Es la propiedad distributiva.'],
        [28.4, 36.4, 'En general, a por b más c es a por b más a por c. Es el único axioma que mezcla la suma con el producto.']],
      ev: [[0.8, 'draw', 1.2], [9.8, 'cut'], [12.0, 'fly', 1.0], [19.8, 'card']],
      draw(t) {
        const s = 52, x0 = 200, y0 = 560, sp = 40 * eio(seg(t, 12.0, 13.0));
        rect(x0, y0, 10 * s, 7 * s, { k: draw(t, .8, 1.2), w: 6, fill: .25 }); rect(x0 + 10 * s + sp, y0, 3 * s, 7 * s, { k: draw(t, .8, 1.2), w: 6, fill: t > 12 ? .45 : .25 });
        line(x0 + 10 * s, y0 - 30, x0 + 10 * s, y0 + 7 * s + 30, { k: draw(t, 9.8, .6), c: P.ac, w: 4, dash: [10, 8] });
        fade(A(t, 1.6), () => { M('7', x0 - 40, y0 + 3.5 * s + 18, 52, { pass: true }); brace(x0, x0 + 13 * s + sp, y0 + 7 * s + 20, { label: '13', m: true, k: 1, s: 50, c: P.ink }); });
        fade(A(t, 12.8), () => { M('10', x0 + 5 * s, y0 - 30, 46, { pass: true }); M('3', x0 + 11.5 * s + sp, y0 - 30, 46, { pass: true }); M('70', x0 + 5 * s, y0 + 3.5 * s + 20, 60, { pass: true }); M('21', x0 + 11.5 * s + sp, y0 + 3.5 * s + 20, 56, { pass: true }); });
        fade(A(t, 1.2), () => M(R`7 · 13 = 7 · (10 + 3)`, 540, 1340, 70, { id: 'd1' }));
        fade(A(t, 19.8), () => M(R`= 7 · 10 + 7 · 3 = 70 + 21 = \hl{91}`, 540, 1460, 62, { id: 'd2' }));
        fade(A(t, 28.8), () => M(R`a(b + c) = ab + ac`, 540, 1640, 86, { id: 'g', c: P.ac }));
      } },
    { id: 'usar', name: 'Usarlas', dur: 31,
      caps: [[0.5, 10.0, 'CALCULAR DE CABEZA', '$13 + 48 + 7$: conviene', 'juntar $13 + 7$ primero.'], [10.4, 20.0, 'QUÉ SE USÓ', 'Conmutativa para cambiar', 'el orden, y asociativa.'],
        [20.4, 30.4, 'ESTRUCTURA DE CAMPO', 'Los reales con $+$ y $·$', 'cumplen todos: un campo.']],
      narr: [[0.5, 10.0, 'Estas reglas sirven para calcular. Trece más cuarenta y ocho más siete: es más fácil juntar primero trece y siete, que dan veinte.'],
        [10.4, 20.0, 'Para hacerlo se usó la conmutativa, para cambiar el orden, y la asociativa, para cambiar los paréntesis. El resultado es sesenta y ocho.'],
        [20.4, 30.4, 'Un conjunto con una suma y un producto que cumplen todos estos axiomas se llama un campo. Los reales son un campo.']],
      ev: [[1.0, 'rise'], [4.0, 'shuffle', 1.2], [10.8, 'tag'], [12.6, 'tag'], [21.0, 'card']],
      draw(t) {
        const sw = eio(seg(t, 4.0, 5.2));
        fade(A(t, 1.0), () => { const xs = [[300, 430], [540, 650], [780, 540]]; const vals = ['13', '48', '7']; vals.forEach((v, i) => { const x = lerp(xs[i][0], [300, 650, 470][i], sw), y = 720 + (i === 2 ? -Math.sin(Math.PI * sw) * 120 : 0); circ(x, y, 74, { w: 5, fill: i === 1 ? .1 : .3 }); M(v, x, y + 20, 58, { pass: true }); }); if (sw >= 1) fade(A(t, 5.4), () => { stroke(P.ac, 5, () => X.ellipse(385, 720, 200, 110, 0, 0, 7)); label('20', 385, 880, P.ac, { s: 48 }); }); });
        fade(A(t, 1.6), () => M(R`13 + 48 + 7`, 540, 1300, 70, { id: 'e' }));
        fade(A(t, 6.0), () => M(R`= (13 + 7) + 48 = 20 + 48 = \hl{68}`, 540, 1420, 62, { id: 'r' }));
        fade(A(t, 21.0), () => note(150, 1500, 780, 230, 1, () => { T('CAMPO', 200, 1560, { s: 28, w: 600, ls: 4, c: P.ac, halo: false }); label('cerradura · conmutativa · asociativa', 540, 1630, P.ink, { s: 36 }); label('neutros · inversos · distributiva', 540, 1690, P.ink, { s: 36 }); }));
      } },
  ],
  sum: [['Conmutativa', R`a + b = b + a \qquad ab = ba`], ['Asociativa', R`(a + b) + c = a + (b + c) \quad (ab)c = a(bc)`], ['Neutros', R`a + 0 = a \qquad a · 1 = a`],
    ['Inversos', R`a + (−a) = 0 \qquad a · \frac{1}{a} = 1 \;\; (a ≠ 0)`], ['Distributiva', R`a(b + c) = ab + ac`]],
  end: ['Pocas reglas, y con ellas', 'se justifica todo el álgebra.'],
  finNarr: [[0.8, 9.0, 'En resumen: conmutativa, asociativa, neutros, inversos y distributiva, para todo real.'],
    [9.2, 16.0, 'El cero no tiene recíproco, y la resta no es conmutativa. Los reales con estas reglas forman un campo.']],
};
