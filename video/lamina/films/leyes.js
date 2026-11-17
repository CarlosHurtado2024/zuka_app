// Lección alg-21b · Leyes de los exponentes (mundo Exponentes y Radicales).
// Contando factores: producto (se suman), cociente (se restan, y de ahí a⁰ y a⁻ⁿ), potencia de potencia (se multiplican),
// producto y cociente elevados; la trampa (a + b)² con el cuadrado partido; notación científica y cómo se multiplica en ella.
const R = String.raw;
const POSTER = 110;
// fila de fichas con una letra: n fichas desde x, con color
function tiles(x, y, n, s, o = {}) { for (let i = 0; i < n; i++) { const k = o.k ? A(o.k, i * .08, .25) : 1; fade(k * (o.a ?? 1), () => { rect(x + i * (s + 10), y, s, s, { r: 10, w: 4, fill: o.fill ?? .3, fc: o.c }); M(o.ch || 'a', x + i * (s + 10) + s / 2, y + s * .68, s * .55, { pass: true, c: o.lc }); }); } }
const FILM = {
  lesson: 'alg-21b', world: 'potencias', key: 'Bb', n: [2, 4],
  title: 'Leyes de los exponentes',
  next: 'Raíces y exponentes racionales',
  intro: 'Las leyes de los exponentes no hay que memorizarlas: salen de contar cuántas veces se repite cada factor.',
  examples: ['3² · 3³', '7⁵ / 7²', '(5²)³', '(2x)³', '(3 + 4)²', '8 × 10⁹', '1.2 × 10⁻⁷'],
  scenes: [
    { id: 'producto', name: 'Producto de potencias', dur: 33,
      caps: [[0.5, 9.0, 'MULTIPLICAR', '$3^{2} · 3^{3}$: dos treses', 'por tres treses.'], [9.4, 19.0, 'CONTAR', 'Quedan cinco treses:', '$3^{5}$.'],
        [19.4, 32.4, 'LA LEY', 'Misma base: los exponentes', 'se suman.']],
      narr: [[0.5, 9.0, 'Tres al cuadrado por tres al cubo. El primero son dos treses multiplicados; el segundo, tres treses.'],
        [9.4, 19.0, 'Al juntarlos queda una sola fila de treses multiplicados. Se cuentan: cinco. Es tres a la cinco.'],
        [19.4, 32.4, 'Con la misma base, al multiplicar, los exponentes se suman. Solo hay que contar.']],
      ev: [[1.0, 'pops', 2], [2.0, 'pops', 3], [9.8, 'fly', 1.0], [19.8, 'card']],
      draw(t) {
        const m = eio(seg(t, 9.8, 10.8));
        tiles(lerp(140, 230, m), 620, 2, 110, { ch: '3', k: t - 1.0 }); tiles(lerp(520, 230 + 240, m), 620, 3, 110, { ch: '3', k: t - 2.0, fill: .55 });
        fade(1 - m, () => { M(R`3^{2}`, 260, 800, 54, { pass: true }); M(R`3^{3}`, 700, 800, 54, { pass: true }); });
        fade(A(t, 10.6), () => brace(230, 230 + 5 * 120 - 10, 760, { label: '5', m: true, k: 1, s: 50 }));
        fade(A(t, 1.0), () => M(R`3^{2} · 3^{3} = 3^{2 + 3} = 3^{5}`, 540, 1340, 76, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`a^{m} · a^{n} = a^{\hl{m + n}}`, 540, 1500, 84, { id: 'l' }));
      } },
    { id: 'cociente', name: 'Cociente de potencias', dur: 37,
      caps: [[0.5, 9.0, 'DIVIDIR', R`$\frac{7^{5}}{7^{2}}$: se cancelan`, 'los sietes por parejas.'], [9.4, 18.0, 'LA LEY', 'Misma base: los exponentes', 'se restan.'],
        [18.4, 27.0, 'SI ABAJO HAY MÁS', R`$\frac{7^{2}}{7^{5}} = 7^{−3}$: quedan`, 'tres sietes abajo.'], [27.4, 36.4, 'TODO ENCAJA', R`$\frac{7^{3}}{7^{3}} = 7^{0} = 1$: por eso`, '$a^{0}$ tenía que ser 1.']],
      narr: [[0.5, 9.0, 'Siete a la cinco entre siete a la dos. Cada siete de abajo se cancela con uno de arriba, por parejas.'],
        [9.4, 18.0, 'Arriba quedan tres sietes: siete a la tres. Al dividir con la misma base, los exponentes se restan.'],
        [18.4, 27.0, 'Si abajo hay más, sobran abajo: siete a la dos entre siete a la cinco deja tres sietes en el denominador. Es siete a la menos tres.'],
        [27.4, 36.4, 'Y si son iguales, se cancela todo y queda uno, que es siete a la cero. Las definiciones de la lección anterior encajan con esta ley.']],
      ev: [[1.0, 'pops', 5], [3.0, 'cut'], [9.8, 'card'], [18.8, 'cut'], [27.8, 'yes']],
      draw(t) {
        const ph = t < 18.4 ? 0 : t < 27.4 ? 1 : 2, top = [5, 2, 3][ph], bot = [2, 5, 3][ph], cut = Math.min(top, bot);
        for (let i = 0; i < top; i++) fade(A(t, 1.0 + i * .1), () => { const x = 240 + i * 120, c = i < cut && t > [3.0, 18.8, 27.8][ph]; rect(x, 600, 100, 100, { r: 10, w: 4, fill: .3 }); M('7', x + 50, 670, 56, { c: c ? P.dim : P.ink, pass: true }); if (c) line(x + 10, 690, x + 90, 610, { c: P.no, w: 5 }); });
        line(220, 740, 860, 740, { w: 5 });
        for (let i = 0; i < bot; i++) fade(A(t, 1.6 + i * .1), () => { const x = 240 + i * 120, c = i < cut && t > [3.0, 18.8, 27.8][ph]; rect(x, 780, 100, 100, { r: 10, w: 4, fill: .3 }); M('7', x + 50, 850, 56, { c: c ? P.dim : P.ink, pass: true }); if (c) line(x + 10, 870, x + 90, 790, { c: P.no, w: 5 }); });
        fade(A(t, 1.2) * (1 - A(t, 18.2)), () => M(R`\frac{7^{5}}{7^{2}} = 7^{5 − 2} = 7^{3}`, 540, 1300, 76, { id: 'e1' }));
        fade(A(t, 9.8), () => M(R`\frac{a^{m}}{a^{n}} = a^{\hl{m − n}}`, 540, 1500, 84, { id: 'l' }));
        fade(A(t, 18.8) * (1 - A(t, 27.2)), () => M(R`\frac{7^{2}}{7^{5}} = 7^{−3} = \frac{1}{7^{3}}`, 540, 1300, 76, { id: 'e2' }));
        fade(A(t, 27.8), () => M(R`\frac{7^{3}}{7^{3}} = 7^{0} = \hl{1}`, 540, 1300, 76, { id: 'e3' }));
      } },
    { id: 'potpot', name: 'Potencia de una potencia', dur: 30,
      caps: [[0.5, 9.0, 'ELEVAR UNA POTENCIA', '$(5^{2})^{3}$: tres veces', 'el bloque $5^{2}$.'], [9.4, 18.0, 'CONTAR', 'Tres bloques de dos:', 'seis cincos, $5^{6}$.'],
        [18.4, 29.4, 'LA LEY', 'Los exponentes se', 'multiplican.']],
      narr: [[0.5, 9.0, 'Cinco al cuadrado, elevado al cubo. Es multiplicar tres veces el bloque cinco al cuadrado.'],
        [9.4, 18.0, 'Cada bloque tiene dos cincos, y hay tres bloques: seis cincos en total. Cinco a la seis.'],
        [18.4, 29.4, 'Al elevar una potencia a otra, los exponentes se multiplican: dos por tres, seis.']],
      ev: [[1.0, 'pops', 3], [9.8, 'brace'], [18.8, 'card']],
      draw(t) {
        for (let b = 0; b < 3; b++) fade(A(t, 1.0 + b * .4), () => { rect(150 + b * 270, 590, 250, 140, { r: 18, w: 3, c: P.ac }); tiles(170 + b * 270, 610, 2, 100, { ch: '5' }); });
        fade(A(t, 9.8), () => brace(150, 940, 760, { label: '6 cincos', k: 1, s: 42 }));
        fade(A(t, 1.2), () => M(R`(5^{2})^{3} = 5^{2} · 5^{2} · 5^{2} = 5^{6}`, 540, 1300, 70, { id: 'e' }));
        fade(A(t, 18.8), () => M(R`(a^{m})^{n} = a^{\hl{m · n}}`, 540, 1480, 84, { id: 'l' }));
      } },
    { id: 'prodbase', name: 'Producto y cociente elevados', dur: 31,
      caps: [[0.5, 9.0, 'UN PRODUCTO ELEVADO', '$(2x)^{3} = 2x · 2x · 2x$:', 'se reordenan los factores.'], [9.4, 19.0, 'EL EXPONENTE VA A CADA UNO', '$(2x)^{3} = 2^{3}x^{3} = 8x^{3}$.', ''],
        [19.4, 30.4, 'CON UN COCIENTE', R`Igual: $\left(\frac{a}{b}\right)^{n} = \frac{a^{n}}{b^{n}}$.`, '']],
      narr: [[0.5, 9.0, 'Dos equis al cubo es dos equis por dos equis por dos equis. Como el producto es conmutativo, se juntan los doses y las equis.'],
        [9.4, 19.0, 'Quedan dos al cubo por equis al cubo: ocho equis al cubo. El exponente llega a cada factor del producto.'],
        [19.4, 30.4, 'Con un cociente pasa igual: el exponente va al numerador y al denominador.']],
      ev: [[1.0, 'pops', 6], [9.8, 'shuffle', 1.2], [19.8, 'rise']],
      draw(t) {
        const m = eio(seg(t, 9.8, 11.0)), items = ['2', 'x', '2', 'x', '2', 'x'];
        items.forEach((c, i) => { const g = c === '2' ? 0 : 1, j = Math.floor(i / 2), x0 = 150 + i * 130, x1 = 150 + g * 420 + j * 130; fade(A(t, 1.0 + i * .1), () => { const x = lerp(x0, x1, m); rect(x, 620, 110, 110, { r: 10, w: 4, fill: g ? .2 : .5 }); M(c, x + 55, 695, 60, { pass: true }); }); });
        fade(A(t, 11.4), () => { M(R`2^{3} = 8`, 345, 830, 50, { pass: true }); M(R`x^{3}`, 765, 830, 50, { pass: true }); });
        fade(A(t, 1.2), () => M(R`(2x)^{3} = 2^{3}x^{3} = \hl{8x^{3}}`, 540, 1300, 76, { id: 'e' }));
        fade(A(t, 10.0), () => M(R`(ab)^{n} = a^{n}b^{n}`, 540, 1460, 76, { id: 'l1' }));
        fade(A(t, 19.8), () => M(R`\left(\frac{a}{b}\right)^{n} = \frac{a^{n}}{b^{n}}`, 540, 1620, 76, { id: 'l2' }));
      } },
    { id: 'trampa', name: 'La trampa de la suma', dur: 36,
      caps: [[0.5, 9.0, '!CON UNA SUMA NO', '$(3 + 4)^{2} = 49$, pero', '$3^{2} + 4^{2} = 25$.'], [9.4, 20.0, 'EL CUADRADO', 'Un cuadrado de lado $3 + 4$', 'tiene cuatro partes.'],
        [20.4, 35.4, 'LO QUE FALTA', 'Los dos rectángulos:', '$(a + b)^{2} = a^{2} + 2ab + b^{2}$.']],
      narr: [[0.5, 9.0, 'El exponente no se reparte en una suma. Tres más cuatro, al cuadrado, es cuarenta y nueve; tres al cuadrado más cuatro al cuadrado, veinticinco.'],
        [9.4, 20.0, 'El dibujo lo explica. Un cuadrado de lado tres más cuatro se parte en cuatro piezas: un cuadrado de tres, otro de cuatro y dos rectángulos.'],
        [20.4, 35.4, 'Sumar solo los cuadrados olvida los dos rectángulos de tres por cuatro, veinticuatro en total. Veinticinco más veinticuatro, cuarenta y nueve.']],
      ev: [[1.0, 'no'], [9.8, 'draw', 1.2], [12.0, 'pops', 4], [20.8, 'card']],
      draw(t) {
        const u = 70, x0 = 290, y0 = 520; rect(x0, y0, 7 * u, 7 * u, { k: draw(t, 9.8, 1.2), w: 5 });
        fade(A(t, 12.0), () => { rect(x0, y0, 3 * u, 3 * u, { w: 4, fill: .5 }); M('9', x0 + 1.5 * u, y0 + 1.5 * u + 18, 50, { pass: true }); });
        fade(A(t, 12.4), () => { rect(x0 + 3 * u, y0 + 3 * u, 4 * u, 4 * u, { w: 4, fill: .5 }); M('16', x0 + 5 * u, y0 + 5 * u + 18, 50, { pass: true }); });
        fade(A(t, 12.8), () => { const hot = t > 20.4 ? .55 : .15; rect(x0 + 3 * u, y0, 4 * u, 3 * u, { w: 4, fill: hot, fc: P.ac }); rect(x0, y0 + 3 * u, 3 * u, 4 * u, { w: 4, fill: hot, fc: P.ac }); M('12', x0 + 5 * u, y0 + 1.5 * u + 18, 50, { pass: true }); M('12', x0 + 1.5 * u, y0 + 5 * u + 18, 50, { pass: true }); });
        fade(A(t, 10.4), () => { M('3', x0 + 1.5 * u, y0 - 20, 40, { pass: true }); M('4', x0 + 5 * u, y0 - 20, 40, { pass: true }); M('3', x0 - 30, y0 + 1.5 * u + 14, 40, { pass: true }); M('4', x0 - 30, y0 + 5 * u + 14, 40, { pass: true }); });
        fade(A(t, 1.0), () => M(R`(3 + 4)^{2} = 49 \;\no{≠}\; 3^{2} + 4^{2} = 25`, 540, 1180, 62, { id: 'no' }));
        fade(A(t, 20.8), () => M(R`(a + b)^{2} = a^{2} + \hl{2ab} + b^{2}`, 540, 1340, 76, { id: 'ok' }));
      } },
    { id: 'cientifica', name: 'Notación científica', dur: 39,
      caps: [[0.5, 9.0, 'NÚMEROS ENORMES', '8 000 000 000 personas:', '$8 × 10^{9}$.'], [9.4, 19.0, 'LA FORMA', 'Un número entre 1 y 10', 'por una potencia de 10.'],
        [19.4, 28.0, 'NÚMEROS DIMINUTOS', 'Un virus de 0.00000012 m:', '$1.2 × 10^{−7}$ m.'], [28.4, 38.4, 'EL EXPONENTE', 'Cuenta los saltos', 'de la coma.']],
      narr: [[0.5, 9.0, 'En el mundo viven cerca de ocho mil millones de personas: un ocho con nueve ceros. Es más claro escribirlo ocho por diez a la nueve.'],
        [9.4, 19.0, 'Esa es la notación científica: un número entre uno y diez, multiplicado por una potencia de diez.'],
        [19.4, 28.0, 'Sirve para lo diminuto. Un virus mide cerca de doce diezmillonésimas de metro: uno coma dos por diez a la menos siete.'],
        [28.4, 38.4, 'El exponente cuenta cuántos lugares saltó la coma: positivo si el número es grande, negativo si es pequeño.']],
      ev: [[1.0, 'rise'], [3.0, 'pops', 9], [19.8, 'rise'], [21.0, 'pops', 7], [28.8, 'tag']],
      draw(t) {
        fade(A(t, 1.0) * (1 - A(t, 19.2)), () => { M(R`8\,000\,000\,000`, 540, 680, 80, { id: 'g' }); for (let i = 0; i < 9; i++) hop(820 - i * 54, 820 - (i + 1) * 54 + 14, 720, draw(t, 3.0 + i * .3, .25), { c: P.ac, h: 40, below: true }); M(R`= 8 × 10^{9}`, 540, 900, 86, { id: 'g2', c: P.ac }); });
        fade(A(t, 19.6), () => { M(R`0.000\,000\,12`, 540, 680, 80, { id: 's' }); for (let i = 0; i < 7; i++) hop(330 + i * 60, 330 + (i + 1) * 60, 720, draw(t, 21.0 + i * .3, .25), { c: P.ac, h: 40, below: true }); M(R`= 1.2 × 10^{−7}`, 540, 900, 86, { id: 's2', c: P.ac }); });
        fade(A(t, 9.8), () => M(R`a × 10^{n}, \quad 1 ≤ a < 10`, 540, 1340, 76, { id: 'f' }));
      } },
    { id: 'calcular', name: 'Calcular con potencias de 10', dur: 29,
      caps: [[0.5, 9.0, 'MULTIPLICAR', 'Se multiplican los números', 'y se suman los exponentes.'], [9.4, 18.0, 'EJEMPLO', '$(3 × 10^{4})(2 × 10^{5})$', '$= 6 × 10^{9}$.'],
        [18.4, 28.4, 'DIVIDIR', R`$\frac{6 × 10^{9}}{3 × 10^{4}} = 2 × 10^{5}$:`, 'se restan.']],
      narr: [[0.5, 9.0, 'Las leyes hacen fácil operar en notación científica. Para multiplicar, se multiplican los números y se suman los exponentes.'],
        [9.4, 18.0, 'Tres por diez a la cuatro, por dos por diez a la cinco: tres por dos es seis, y cuatro más cinco es nueve.'],
        [18.4, 28.4, 'Para dividir, se dividen los números y se restan los exponentes. Las leyes trabajan solas.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [18.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`(\hl{3} × 10^{\hl{4}})(\hl{2} × 10^{\hl{5}})`, 540, 680, 72, { id: 'p' }));
        fade(A(t, 9.8), () => M(R`= (3 · 2) × 10^{4 + 5} = 6 × 10^{9}`, 540, 840, 64, { id: 'r' }));
        fade(A(t, 18.8), () => M(R`\frac{6 × 10^{9}}{3 × 10^{4}} = 2 × 10^{9 − 4} = 2 × 10^{5}`, 540, 1100, 62, { id: 'd' }));
      } },
  ],
  sum: [['Producto', R`a^{m} · a^{n} = a^{m + n}`], ['Cociente', R`\frac{a^{m}}{a^{n}} = a^{m − n}`], ['Potencia de potencia', R`(a^{m})^{n} = a^{mn}`], ['Producto elevado', R`(ab)^{n} = a^{n}b^{n}`],
    ['Con una suma, no', R`(a + b)^{2} ≠ a^{2} + b^{2}`], ['Notación científica', R`a × 10^{n}, \;\; 1 ≤ a < 10`]],
  end: ['Las leyes no se memorizan:', 'se cuentan.'],
  finNarr: [[0.8, 10.4, 'En resumen: con la misma base, al multiplicar se suman los exponentes, al dividir se restan y al elevar se multiplican.'],
    [10.6, 17.6, 'El exponente se reparte en un producto, pero nunca en una suma. Y la notación científica usa todo esto.']],
};
