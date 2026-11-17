// Lección alg-23a · Grado y operaciones (mundo Álgebra de Polinomios).
// Fichas algebraicas; partes de un término; grado (y qué no es polinomio); valor numérico; sumar con fichas (y pares que se
// anulan); restar cambiando signos; multiplicar con un rectángulo (los grados se suman); la sorpresa de x = 10.
const R = String.raw;
const POSTER = 100;
// una fila de fichas: [['xx', n], ['x', n], ['1', n]] con negativas como ['x', -n]
function row(x, y, spec, o = {}) { let cx = x, i = 0; for (const [k, n] of spec) { for (let j = 0; j < Math.abs(n); j++) { const [w] = atile(k === 'x' ? 'xv' : k, cx, y + (k === 'xx' ? 0 : k === 'x' ? 0 : TX - TU), { neg: n < 0, a: o.k ? o.k(i) : 1 }); cx += w + 10; i++; } cx += 26; } return cx; }
const FILM = {
  lesson: 'alg-23a', world: 'polinomios', key: 'C', n: [1, 4],
  title: 'Grado y operaciones',
  next: 'Productos notables',
  intro: 'Un polinomio parece una fila de símbolos. En realidad es una caja de bloques: cuadrados, barras y cuadritos.',
  examples: ['3x² + 2x + 5', '4x − 7x³ + 2', 'x² − 3x + 5', '2x² + 3x − 1', '4x² + x', '(x + 2)(x + 3)', '325'],
  scenes: [
    { id: 'bloques', name: 'Una caja de bloques', dur: 31,
      caps: [[0.5, 9.0, 'TRES PIEZAS', 'Un cuadrado de lado $x$, una', 'barra de $x$ por 1 y un cuadrito.'], [9.4, 19.0, 'SUS ÁREAS', '$x^{2}$, $x$ y 1.', ''],
        [19.4, 30.4, 'UNA CAJA', '3 cuadrados, 2 barras', 'y 5 cuadritos: $3x^{2} + 2x + 5$.']],
      narr: [[0.5, 9.0, 'Hay tres clases de bloques: un cuadrado de lado x, una barra de x por uno y un cuadrito. La x es un largo que no conocemos.'],
        [9.4, 19.0, 'Sus áreas son x al cuadrado, x y uno.'],
        [19.4, 30.4, 'Una caja con tres cuadrados, dos barras y cinco cuadritos se anota tres x al cuadrado más dos x más cinco. Eso es un polinomio.']],
      ev: [[1.0, 'pop', 0], [2.2, 'pop', 1], [3.4, 'pop', 2], [19.8, 'pops', 10]],
      draw(t) {
        if (t < 19.4) { atile('xx', 200, 600, { a: A(t, 1.0) }); atile('xv', 460, 600, { a: A(t, 2.2) }); atile('1', 620, 600 + TX - TU, { a: A(t, 3.4) });
          fade(A(t, 9.8), () => { M('x^{2}', 275, 830, 54, { c: P.ac, pass: true }); M('x', 481, 830, 54, { c: P.ac, pass: true }); M('1', 641, 830, 54, { c: P.ac, pass: true }); }); }
        else row(150, 600, [['xx', 3], ['x', 2], ['1', 5]], { k: i => A(t, 19.8 + i * .12, .3) });
        fade(A(t, 20.4), () => M(R`3x^{2} + 2x + 5`, 540, 1300, 96, { id: 'p' }));
      } },
    { id: 'partes', name: 'Las partes', dur: 31,
      caps: [[0.5, 9.0, 'UN TÉRMINO', '$3x^{2}$: coeficiente 3,', 'variable $x$, exponente 2.'], [9.4, 19.0, 'INDEPENDIENTE', 'El término sin $x$:', 'aquí, el 5.'],
        [19.4, 30.4, 'ORDENADO', 'De mayor a menor exponente:', 'así se lee mejor.']],
      narr: [[0.5, 9.0, 'Cada sumando es un término. En tres x al cuadrado, el tres es el coeficiente, la x la variable y el dos el exponente.'],
        [9.4, 19.0, 'El término que no tiene x se llama término independiente. Aquí es el cinco.'],
        [19.4, 30.4, 'Lo usual es escribir los términos de mayor a menor exponente. Así el primero dice enseguida qué tan grande es el polinomio.']],
      ev: [[1.0, 'tag'], [2.0, 'tag'], [3.0, 'tag'], [9.8, 'tag'], [19.8, 'shuffle', 1.2]],
      draw(t) {
        const r = M(R`\id{c}{3}\id{v}{x}^{\id{e}{2}} + 2x + \id{i}{5}`, 540, 760, 120, { id: 'p' });
        fade(A(t, 1.0), () => label('coeficiente', r.box.c.cx, r.box.c.y1 + 70, P.ac, { s: 34 })); fade(A(t, 2.0), () => label('variable', r.box.v.cx + 40, r.box.v.y1 + 120, P.ac, { s: 34 })); fade(A(t, 3.0), () => label('exponente', r.box.e.cx, r.box.e.y0 - 30, P.ac, { s: 34 }));
        fade(A(t, 9.8), () => label('independiente', r.box.i.cx, r.box.i.y1 + 70, P.ac, { s: 34 }));
        fade(A(t, 19.8), () => { M(R`5 + 3x^{2} + 2x`, 540, 1200, 66, { id: 'd', c: P.mute }); M(R`→ \; 3x^{2} + 2x + 5`, 540, 1320, 66, { id: 'o' }); });
      } },
    { id: 'grado', name: 'El grado', dur: 38,
      caps: [[0.5, 9.0, 'EL GRADO', 'El mayor exponente,', 'esté donde esté.'], [9.4, 19.0, 'EJEMPLO', '$4x − 7x^{3} + 2$ tiene', 'grado 3.'],
        [19.4, 27.0, 'UN NÚMERO SOLO', '5 es $5x^{0}$:', 'grado 0.'], [27.4, 37.4, '!NO SON POLINOMIOS', R`$\frac{1}{x}$ o $\sqrt{x}$: los exponentes`, 'deben ser naturales o 0.']],
      narr: [[0.5, 9.0, 'El grado de un polinomio es el mayor exponente de la variable, aunque no esté escrito de primero.'],
        [9.4, 19.0, 'Cuatro x menos siete x al cubo más dos tiene grado tres. Ordenado, empieza por menos siete x al cubo.'],
        [19.4, 27.0, 'Un número solo, distinto de cero, es un polinomio de grado cero: es el número por x a la cero.'],
        [27.4, 37.4, 'No todo con x es polinomio. Uno sobre x es x a la menos uno, y raíz de x, x a la un medio. Los exponentes deben ser naturales o cero.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.2], [19.8, 'tag'], [27.8, 'no']],
      draw(t) {
        fade(A(t, 9.8), () => { const r = M(R`4x − 7x^{\id{e}{3}} + 2`, 540, 700, 100, { id: 'p' }); circ(r.box.e.cx, r.box.e.cy, 40, { c: P.ac, w: 5, k: draw(t, 11.0, .6) }); });
        fade(A(t, 12.4), () => M(R`= −7x^{3} + 4x + 2 \quad \t{grado } \hl{3}`, 540, 880, 62, { id: 'o' }));
        fade(A(t, 19.8), () => M(R`5 = 5x^{0} \quad \t{grado } 0`, 540, 1100, 66, { id: 'z' }));
        fade(A(t, 27.8), () => M(R`\frac{1}{x} = x^{\no{−1}} \qquad \sqrt{x} = x^{\no{\frac{1}{2}}}`, 540, 1320, 66, { id: 'n' }));
      } },
    { id: 'valor', name: 'Valor numérico', dur: 30,
      caps: [[0.5, 9.0, 'DARLE UN VALOR A x', '$P(x) = x^{2} − 3x + 5$', 'con $x = 2$.'], [9.4, 19.0, 'SE REEMPLAZA', '$P(2) = 2^{2} − 3 · 2 + 5$.', ''],
        [19.4, 29.4, 'RESULTADO', '$4 − 6 + 5 = 3$.', '']],
      narr: [[0.5, 9.0, 'Un polinomio se nombra con una letra: P de x. Si se le da un valor a x, se obtiene un número.'],
        [9.4, 19.0, 'Para P de dos, se reemplaza cada x por dos: dos al cuadrado, menos tres por dos, más cinco.'],
        [19.4, 29.4, 'Cuatro menos seis más cinco: tres. Ese es el valor numérico de P en dos.']],
      ev: [[1.0, 'rise'], [9.8, 'fly', 1.2], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`P(x) = x^{2} − 3x + 5`, 540, 680, 84, { id: 'p' }));
        fade(A(t, 9.8), () => M(R`P(\hl{2}) = \hl{2}^{2} − 3 · \hl{2} + 5`, 540, 880, 80, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`= 4 − 6 + 5 = \hl{3}`, 540, 1060, 80, { id: 'v' }));
      } },
    { id: 'sumar', name: 'Sumar', dur: 36,
      caps: [[0.5, 9.0, 'DOS CAJAS', '$(2x^{2} + 3x − 1) + (x^{2} − 5x + 4)$:', 'se juntan.'], [9.4, 19.0, 'PIEZAS IGUALES', 'Cuadrados con cuadrados,', 'barras con barras.'],
        [19.4, 28.0, 'SE ANULAN', 'Una barra y una barra', 'negativa suman cero.'], [28.4, 35.4, 'RESULTADO', '$3x^{2} − 2x + 3$.', '']],
      narr: [[0.5, 9.0, 'Sumar polinomios es juntar dos cajas. Las fichas coral son negativas: restan.'],
        [9.4, 19.0, 'Solo se juntan las piezas iguales, los términos semejantes: cuadrados con cuadrados, barras con barras, cuadritos con cuadritos.'],
        [19.4, 28.0, 'Una barra y una barra negativa se anulan: suman cero. Lo mismo un cuadrito y uno negativo.'],
        [28.4, 35.4, 'Quedan tres cuadrados, dos barras negativas y tres cuadritos: tres x al cuadrado menos dos x más tres.']],
      ev: [[1.0, 'pops', 6], [3.0, 'pops', 10], [9.8, 'shuffle', 1.2], [19.8, 'cut'], [28.8, 'card']],
      draw(t) {
        fade(1 - A(t, 9.6), () => { row(110, 560, [['xx', 2], ['x', 3], ['1', -1]], { k: i => A(t, 1.0 + i * .1) }); row(110, 800, [['xx', 1], ['x', -5], ['1', 4]], { k: i => A(t, 3.0 + i * .1) }); });
        if (t > 9.4) { const cut = A(t, 19.8, .6);
          fade(A(t, 9.8), () => { row(110, 600, [['xx', 3]]); let x = 110; for (let i = 0; i < 3; i++) atile('xv', 110 + 3 * 160 + 26 + i * 52, 600, { a: 1 - cut * .85 }); for (let i = 0; i < 5; i++) atile('xv', 110 + 3 * 160 + 26 + i * 52, 800, { neg: true, a: i < 3 ? 1 - cut * .85 : 1 }); for (let i = 0; i < 4; i++) atile('1', 800 + i * 52, 600 + TX - TU, { a: i < 1 ? 1 - cut * .85 : 1 }); atile('1', 800, 800 + TX - TU, { neg: true, a: 1 - cut * .85 }); void x; });
          if (t > 19.8) fade(1 - A(t, 26.0), () => { for (let i = 0; i < 3; i++) label('0', 110 + 3 * 160 + 26 + i * 52 + 21, 990, P.ac, { s: 30 }); label('0', 821, 990, P.ac, { s: 30 }); }); }
        fade(A(t, 1.0), () => M(R`(2x^{2} + 3x − 1) + (x^{2} − 5x + 4)`, 540, 1260, 58, { id: 'e' }));
        fade(A(t, 28.8), () => M(R`= \hl{3x^{2} − 2x + 3}`, 540, 1400, 76, { id: 'r' }));
      } },
    { id: 'restar', name: 'Restar', dur: 28,
      caps: [[0.5, 9.0, 'RESTAR', 'Es sumar el opuesto:', 'se cambian todos los signos.'], [9.4, 18.0, 'EJEMPLO', '$(4x^{2} + x) − (x^{2} − 2x + 3)$', ''],
        [18.4, 27.4, 'RESULTADO', '$4x^{2} + x − x^{2} + 2x − 3$', '$= 3x^{2} + 3x − 3$.']],
      narr: [[0.5, 9.0, 'Restar un polinomio es sumar su opuesto: se le cambia el signo a cada uno de sus términos, no solo al primero.'],
        [9.4, 18.0, 'Cuatro x al cuadrado más x, menos el paréntesis x al cuadrado menos dos x más tres.'],
        [18.4, 27.4, 'El menos entra al paréntesis y cambia los tres signos. Juntando semejantes: tres x al cuadrado más tres x menos tres.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [18.8, 'shuffle', 1.0], [21.0, 'card']],
      draw(t) {
        fade(A(t, 9.8), () => M(R`(4x^{2} + x) \hl{−} (x^{2} − 2x + 3)`, 540, 700, 70, { id: 'e' }));
        fade(A(t, 18.8), () => M(R`= 4x^{2} + x \hl{− x^{2} + 2x − 3}`, 540, 880, 70, { id: 's' }));
        fade(A(t, 21.0), () => M(R`= \hl{3x^{2} + 3x − 3}`, 540, 1060, 80, { id: 'r' }));
        fade(A(t, 1.0), () => M(R`P − Q = P + (−Q)`, 540, 1360, 70, { id: 'g' }));
      } },
    { id: 'multiplicar', name: 'Multiplicar', dur: 37,
      caps: [[0.5, 9.0, 'UN RECTÁNGULO', 'De lados $x + 2$ y $x + 3$:', 'su área es el producto.'], [9.4, 19.0, 'LO LLENAN', 'Un cuadrado, 5 barras', 'y 6 cuadritos.'],
        [19.4, 28.0, 'RESULTADO', '$(x + 2)(x + 3)$', '$= x^{2} + 5x + 6$.'], [28.4, 36.4, 'LOS GRADOS', 'Se suman: grado 1 por', 'grado 1 da grado 2.']],
      narr: [[0.5, 9.0, 'Multiplicar es armar un rectángulo. Si un lado mide x más dos y el otro x más tres, su área es el producto.'],
        [9.4, 19.0, 'Para llenarlo hacen falta un cuadrado, tres barras de pie, dos barras acostadas y seis cuadritos. Es la distributiva: cada parte de un lado por cada parte del otro.'],
        [19.4, 28.0, 'Juntando: x al cuadrado más cinco x más seis.'],
        [28.4, 36.4, 'Al multiplicar, los grados se suman: un polinomio de grado uno por otro de grado uno da grado dos.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'pops', 12], [19.8, 'card'], [28.8, 'tag']],
      draw(t) {
        areaModel(330, 560, 2, 3, { k: (i, n) => A(t, 9.8 + i * .2, .3), sa: A(t, 1.0) });
        fade(A(t, 1.0) * (1 - A(t, 9.8)), () => rect(330, 560, TX + 3 * TU, TX + 2 * TU, { w: 5, c: P.ac }));
        fade(A(t, 19.8), () => M(R`(x + 2)(x + 3) = \hl{x^{2} + 5x + 6}`, 540, 1100, 70, { id: 'r' }));
        fade(A(t, 28.8), () => M(R`\t{gr}(PQ) = \t{gr}\,P + \t{gr}\,Q`, 540, 1280, 66, { id: 'g' }));
      } },
    { id: 'diez', name: 'La sorpresa de x = 10', dur: 29,
      caps: [[0.5, 9.0, 'SI x VALE 10', '$3x^{2} + 2x + 5$ con $x = 10$:', '$300 + 20 + 5$.'], [9.4, 19.0, 'ES UN NÚMERO', '325: sus cifras son', 'los coeficientes.'],
        [19.4, 28.4, 'LA IDEA', 'Los números en base 10', 'son polinomios en el 10.']],
      narr: [[0.5, 9.0, 'Una sorpresa para cerrar. Si en tres x al cuadrado más dos x más cinco la x vale diez, sale trescientos más veinte más cinco.'],
        [9.4, 19.0, 'Trescientos veinticinco. Sus cifras son justo los coeficientes: tres, dos y cinco.'],
        [19.4, 28.4, 'Escribir números en base diez es escribir polinomios en el diez. Por eso sumar polinomios se parece tanto a sumar en columnas.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'tag']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`3 · 10^{2} + 2 · 10 + 5`, 540, 700, 84, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= \hl{3}\hl{2}\hl{5}`, 540, 900, 110, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`325 = 3 · 10^{2} + 2 · 10^{1} + 5 · 10^{0}`, 540, 1160, 58, { id: 'c' }));
      } },
  ],
  sum: [['Polinomio', R`3x^{2} + 2x + 5`], ['Grado', R`4x − 7x^{3} + 2 \;\;→\;\; \t{grado } 3`], ['Valor numérico', R`P(2) = 3`], ['Sumar', R`\t{se juntan los términos semejantes}`], ['Multiplicar', R`(x + 2)(x + 3) = x^{2} + 5x + 6`]],
  end: ['Un polinomio es una caja', 'de bloques bien contada.'],
  finNarr: [[0.8, 9.0, 'En resumen: un polinomio suma términos con exponentes naturales, y su grado es el mayor exponente.'],
    [9.2, 16.0, 'Se suman los semejantes, se resta cambiando signos y se multiplica armando un rectángulo.']],
};
