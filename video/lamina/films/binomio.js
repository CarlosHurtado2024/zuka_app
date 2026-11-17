// Lección alg-24c · Binomio de Newton (mundo Álgebra de Polinomios).
// (a + b)⁴ tiene 16 productos; el triángulo de Pascal; los exponentes; la fila 4 da los coeficientes; el número combinatorio
// (por qué el 6: elegir dos paréntesis); (2x + 1)³; la suma de una fila es 2ⁿ.
const R = String.raw;
const POSTER = 80;
const ROWS = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]];
function pascal(cx, y0, n, kf, o = {}) {
  for (let r = 0; r <= n; r++) ROWS[r].forEach((v, i) => { const x = cx + (i - r / 2) * 120, y = y0 + r * 105; fade(kf(r, i), () => { circ(x, y, 42, { w: 4, fill: o.hl && o.hl(r, i) ? .55 : .15 }); M(String(v), x, y + 17, 44, { pass: true }); }); });
}
const FILM = {
  lesson: 'alg-24c', world: 'polinomios', key: 'C', n: [3, 4],
  title: 'Binomio de Newton',
  next: 'Factorización',
  intro: 'Elevar un binomio a la cuarta o a la quinta a mano es larguísimo. Un triángulo de números lo resuelve de un vistazo.',
  examples: ['(2x + 1)³', '8x³ + 12x² + 6x + 1', 'C(4, 2)', '16 productos'],
  scenes: [
    { id: 'problema', name: 'Dieciséis productos', dur: 31,
      caps: [[0.5, 9.0, 'UN DESARROLLO LARGO', '$(a + b)^{4}$: cuatro', 'paréntesis multiplicados.'], [9.4, 19.0, 'UNA LETRA DE CADA UNO', 'De cada paréntesis sale', '$a$ o $b$: 16 maneras.'],
        [19.4, 30.4, 'MUCHOS SE REPITEN', '$aabb$ y $abab$ dan', 'el mismo término: $a^{2}b^{2}$.']],
      narr: [[0.5, 9.0, 'Desarrollar a más b a la cuarta es multiplicar cuatro paréntesis iguales.'],
        [9.4, 19.0, 'Cada producto toma una letra de cada paréntesis: a o b, cuatro veces. Hay dos por dos por dos por dos maneras: dieciséis.'],
        [19.4, 30.4, 'Muchos productos dan lo mismo. Elegir a, a, b, b o a, b, a, b da a al cuadrado b al cuadrado. Hay que contar cuántas veces sale cada uno.']],
      ev: [[1.0, 'pops', 4], [9.8, 'pops', 8], [19.8, 'tag']],
      draw(t) {
        for (let i = 0; i < 4; i++) fade(A(t, 1.0 + i * .2), () => M(R`(a + b)`, 210 + i * 220, 640, 64, { pass: true }));
        if (t > 9.4) { const words = ['aaaa', 'aaab', 'aaba', 'aabb', 'abaa', 'abab', 'abba', 'abbb', 'baaa', 'baab', 'baba', 'babb', 'bbaa', 'bbab', 'bbba', 'bbbb'];
          words.forEach((w, i) => fade(A(t, 9.8 + i * .12, .2), () => { const x = 180 + (i % 4) * 240, y = 820 + Math.floor(i / 4) * 90, hi = t > 19.8 && (w.split('b').length - 1) === 2; M(w, x, y, 44, { c: hi ? P.ac : P.ink, pass: true }); })); }
        fade(A(t, 20.6), () => M(R`6 \t{ veces } a^{2}b^{2}`, 540, 1290, 70, { id: 'c' }));
      } },
    { id: 'pascal', name: 'El triángulo de Pascal', dur: 36,
      caps: [[0.5, 9.0, 'LOS COEFICIENTES', '$(a + b)^{1}$, $(a + b)^{2}$,', '$(a + b)^{3}$: 1 1, 1 2 1, 1 3 3 1.'], [9.4, 19.0, 'UN TRIÁNGULO', 'Cada número es la suma', 'de los dos de arriba.'],
        [19.4, 35.4, 'LA FILA 4', '1, 4, 6, 4, 1:', 'los de $(a + b)^{4}$.']],
      narr: [[0.5, 9.0, 'Miremos los coeficientes de las potencias pequeñas: uno uno; uno dos uno; uno tres tres uno.'],
        [9.4, 19.0, 'Puestos en triángulo, cada número es la suma de los dos que tiene encima, y los bordes son unos. Es el triángulo de Pascal.'],
        [19.4, 35.4, 'Así sale la fila cuatro sin multiplicar nada: uno, cuatro, seis, cuatro, uno. Son los coeficientes de a más b a la cuarta.']],
      ev: [[1.0, 'pops', 3], [3.0, 'pops', 3], [5.0, 'pops', 4], [9.8, 'tag'], [19.8, 'pops', 5]],
      draw(t) {
        pascal(540, 520, 4, (r, i) => (r < 4 ? A(t, 1.0 + r * 1.6 + i * .15, .3) : A(t, 19.8 + i * .4, .3)), { hl: (r, i) => r === 4 && t > 19.8 });
        if (t > 9.4 && t < 19.4) fade(A(t, 9.8), () => { const x = 540 + (1 - 1.5) * 120, y = 520 + 3 * 105; line(x - 60, y - 90, x - 8, y - 30, { c: P.ac, w: 4 }); line(x + 60, y - 90, x + 8, y - 30, { c: P.ac, w: 4 }); label('1 + 2 = 3', x - 200, y + 10, P.ac, { s: 34 }); });
        fade(A(t, 22.0), () => M(R`(a + b)^{4}: \;\; 1 \quad 4 \quad 6 \quad 4 \quad 1`, 540, 1180, 64, { id: 'f' }));
      } },
    { id: 'exponentes', name: 'Los exponentes', dur: 30,
      caps: [[0.5, 9.0, 'LA a BAJA', 'De 4 a 0:', '$a^{4}, a^{3}, a^{2}, a, 1$.'], [9.4, 19.0, 'LA b SUBE', 'De 0 a 4:', '$1, b, b^{2}, b^{3}, b^{4}$.'],
        [19.4, 29.4, 'SIEMPRE SUMAN 4', 'En cada término, los', 'exponentes suman 4.']],
      narr: [[0.5, 9.0, 'Los exponentes también siguen un patrón. Los de a bajan de cuatro a cero.'],
        [9.4, 19.0, 'Los de b suben de cero a cuatro.'],
        [19.4, 29.4, 'En cada término, los dos exponentes suman cuatro: cada término usa una letra de cada uno de los cuatro paréntesis.']],
      ev: [[1.0, 'pops', 5], [9.8, 'pops', 5], [19.8, 'card']],
      draw(t) {
        const ea = ['a^{4}', 'a^{3}', 'a^{2}', 'a', '1'], eb = ['1', 'b', 'b^{2}', 'b^{3}', 'b^{4}'];
        ea.forEach((s, i) => fade(A(t, 1.0 + i * .3), () => M(s, 170 + i * 185, 700, 60, { c: P.ac, pass: true })));
        eb.forEach((s, i) => fade(A(t, 9.8 + i * .3), () => M(s, 170 + i * 185, 820, 60, { pass: true })));
        fade(A(t, 19.8), () => ['4 + 0', '3 + 1', '2 + 2', '1 + 3', '0 + 4'].forEach((s, i) => M(s, 170 + i * 185, 940, 36, { c: P.mute, pass: true })));
      } },
    { id: 'desarrollo', name: 'El desarrollo', dur: 31,
      caps: [[0.5, 9.0, 'SE JUNTA TODO', 'Coeficientes de la fila 4', 'y exponentes que se cruzan.'], [9.4, 19.0, 'RESULTADO', '$a^{4} + 4a^{3}b + 6a^{2}b^{2}$', '$+ 4ab^{3} + b^{4}$.'],
        [19.4, 30.4, 'LOS 16 PRODUCTOS', '$1 + 4 + 6 + 4 + 1 = 16$:', 'cada uno contado una vez.']],
      narr: [[0.5, 9.0, 'Juntando las dos cosas: coeficientes de la fila cuatro, y exponentes que se cruzan.'],
        [9.4, 19.0, 'Sale a a la cuarta, más cuatro a al cubo b, más seis a al cuadrado b al cuadrado, más cuatro a b al cubo, más b a la cuarta.'],
        [19.4, 30.4, 'Y los coeficientes suman dieciséis: los dieciséis productos del principio, agrupados en cinco términos.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'yes']],
      draw(t) {
        pascal(540, 520, 4, (r, i) => (r === 4 ? 1 : .25), { hl: r => r === 4 });
        fade(A(t, 9.8), () => M(R`(a + b)^{4} = a^{4} + 4a^{3}b + 6a^{2}b^{2} + 4ab^{3} + b^{4}`, 540, 1140, 52, { id: 'd' }));
        fade(A(t, 19.8), () => M(R`1 + 4 + 6 + 4 + 1 = 16 = 2^{4}`, 540, 1320, 66, { id: 's' }));
      } },
    { id: 'combinatorio', name: 'Por qué el 6', dur: 37,
      caps: [[0.5, 9.0, 'ELEGIR', 'Para $a^{2}b^{2}$, dos de los cuatro', 'paréntesis dan $b$.'], [9.4, 19.0, 'LAS MANERAS', 'Hay 6 maneras de elegir', R`2 de 4: $C(4, 2) = 6$.`],
        [19.4, 28.0, 'LA FÓRMULA', R`$C(n, k) = \frac{n!}{k!\,(n − k)!}$.`, ''], [28.4, 36.4, 'COMPROBAR', R`$\frac{4!}{2!\,2!} = \frac{24}{4} = 6$.`, '']],
      narr: [[0.5, 9.0, 'Por qué el término del medio lleva un seis. Para formar a al cuadrado b al cuadrado, dos de los cuatro paréntesis tienen que dar b.'],
        [9.4, 19.0, 'Elegir dos de cuatro se puede hacer de seis maneras. Ese conteo se llama número combinatorio: cuatro sobre dos.'],
        [19.4, 28.0, 'En general se calcula con factoriales: n factorial sobre k factorial por n menos k factorial.'],
        [28.4, 36.4, 'Para cuatro y dos: veinticuatro sobre dos por dos, seis. Cada número del triángulo es un número combinatorio.']],
      ev: [[1.0, 'pops', 4], [9.8, 'pops', 6], [19.8, 'card'], [28.8, 'yes']],
      draw(t) {
        const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
        if (t < 9.4) for (let i = 0; i < 4; i++) fade(A(t, 1.0 + i * .2), () => { circ(240 + i * 200, 700, 60, { w: 4, fill: i < 2 ? .1 : .5 }); M(i < 2 ? 'a' : 'b', 240 + i * 200, 718, 50, { pass: true }); });
        else pairs.forEach((p, j) => fade(A(t, 9.8 + j * .4), () => { const y = 560 + j * 85; for (let i = 0; i < 4; i++) { const on = p.includes(i); circ(330 + i * 110, y, 30, { w: 3, fill: on ? .55 : .08 }); M(on ? 'b' : 'a', 330 + i * 110, y + 14, 34, { pass: true }); } T(String(j + 1), 820, y + 12, { s: 36, c: P.ac, a: 'c', pass: true }); }));
        fade(A(t, 19.8), () => M(R`C(n, k) = \frac{n!}{k!\,(n − k)!}`, 540, 1200, 76, { id: 'f' }));
        fade(A(t, 28.8), () => M(R`C(4, 2) = \frac{4!}{2!\,2!} = \frac{24}{4} = \hl{6}`, 540, 1380, 70, { id: 'e' }));
      } },
    { id: 'ejemplo', name: 'Un ejemplo', dur: 34,
      caps: [[0.5, 9.0, 'DESARROLLAR', '$(2x + 1)^{3}$: fila 3,', '1, 3, 3, 1.'], [9.4, 19.0, 'CON a = 2x, b = 1', 'Ojo: el 2 también', 'se eleva.'],
        [19.4, 33.4, 'RESULTADO', '$8x^{3} + 12x^{2} + 6x + 1$.', '']],
      narr: [[0.5, 9.0, 'Para desarrollar dos x más uno al cubo se usa la fila tres: uno, tres, tres, uno.'],
        [9.4, 19.0, 'Aquí a es dos x y b es uno. Cuidado: al elevar a, se eleva también el dos. Dos x al cubo es ocho x al cubo.'],
        [19.4, 33.4, 'Término a término: ocho x al cubo, más tres por cuatro x al cuadrado, más tres por dos x, más uno.']],
      ev: [[1.0, 'rise'], [9.8, 'doubt'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`(2x + 1)^{3}`, 540, 640, 90, { id: 'e' }));
        fade(A(t, 9.8), () => M(R`1(2x)^{3} + 3(2x)^{2}(1) + 3(2x)(1)^{2} + 1`, 540, 840, 56, { id: 's' }));
        fade(A(t, 11.4), () => M(R`(2x)^{3} = \hl{8}x^{3}`, 540, 980, 62, { id: 'o' }));
        fade(A(t, 19.8), () => M(R`= \hl{8x^{3} + 12x^{2} + 6x + 1}`, 540, 1160, 72, { id: 'r' }));
      } },
    { id: 'filas', name: 'La suma de cada fila', dur: 26,
      caps: [[0.5, 12.0, 'CADA FILA', 'Suma una potencia de 2:', '1, 2, 4, 8, 16.'], [12.4, 25.4, 'POR QUÉ', 'La fila $n$ cuenta los $2^{n}$', 'productos de $(a + b)^{n}$.']],
      narr: [[0.5, 12.0, 'Un detalle bonito: cada fila del triángulo suma una potencia de dos. Uno, dos, cuatro, ocho, dieciséis.'],
        [12.4, 25.4, 'Es lógico: la fila n reparte los dos a la n productos de a más b a la n entre sus términos.']],
      ev: [[1.0, 'pops', 5], [12.8, 'card']],
      draw(t) {
        pascal(470, 520, 4, (r, i) => A(t, 1.0 + r * .3, .3));
        [1, 2, 4, 8, 16].forEach((v, r) => fade(A(t, 2.0 + r * .5), () => M(`= ${v}`, 900, 520 + r * 105 + 17, 44, { a: 'l', c: P.ac, pass: true })));
        fade(A(t, 12.8), () => M(R`\t{fila } n: \;\; 2^{n}`, 540, 1180, 70, { id: 'f' }));
      } },
  ],
  sum: [['Pascal', R`\t{cada número suma los dos de arriba}`], ['Exponentes', R`a^{n−k}\,b^{k}`], ['Fila 4', R`(a + b)^{4} = a^{4} + 4a^{3}b + 6a^{2}b^{2} + 4ab^{3} + b^{4}`], ['Combinatorio', R`C(n, k) = \frac{n!}{k!\,(n − k)!}`], ['Ejemplo', R`(2x + 1)^{3} = 8x^{3} + 12x^{2} + 6x + 1`]],
  end: ['Un triángulo de números', 'evita multiplicar a ciegas.'],
  finNarr: [[0.8, 9.0, 'En resumen: los coeficientes de a más b a la n están en la fila n del triángulo de Pascal.'],
    [9.2, 16.0, 'Los exponentes de a bajan, los de b suben, y cada coeficiente cuenta de cuántas maneras se elige.']],
};
