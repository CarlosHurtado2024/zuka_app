// Lección alg-102 · Sistemas no lineales y fracciones parciales (mundo Fracciones Algebraicas).
// Una parábola y una recta (y = x², y = x + 2); suma y producto (9 y 20); cuántos cortes; la idea de partir una fracción;
// el método con (x + 7)/((x − 1)(x + 3)); las formas según los factores; fracción impropia: dividir antes.
const R = String.raw;
const POSTER = 140;
const FILM = {
  lesson: 'alg-102', world: 'racionales', key: 'Bb', n: [4, 4],
  title: 'Sistemas no lineales y fracciones parciales',
  next: 'Función exponencial',
  intro: 'Una curva y una recta se cortan donde sus alturas coinciden. La misma idea sirve para partir fracciones.',
  examples: ['y = x + 2', 'suman 9', '(x + 7)/((x − 1)(x + 3))', '2/(x − 1) − 1/(x + 3)'],
  scenes: [
    { id: 'cruce', name: 'Una curva y una recta', dur: 35,
      caps: [[0.5, 9.0, 'DOS CAMINOS', 'Una parábola $y = x^{2}$', 'y una recta $y = x + 2$.'], [9.4, 19.0, 'IGUALES ALTURAS', '$x^{2} = x + 2$, o sea', '$x^{2} − x − 2 = 0$.'],
        [19.4, 34.4, 'LOS CORTES', '$(x − 2)(x + 1) = 0$:', 'en $(2, 4)$ y $(−1, 1)$.']],
      narr: [[0.5, 9.0, 'Una parábola, y igual a x al cuadrado, y una recta, y igual a x más dos. Se quiere saber dónde se cruzan.'],
        [9.4, 19.0, 'Donde se cruzan tienen la misma altura: x al cuadrado igual a x más dos. Pasando todo a un lado, una ecuación cuadrática.'],
        [19.4, 34.4, 'Se factoriza: x menos dos por x más uno. Los cortes están en x igual a dos, a la altura cuatro, y en menos uno, a la altura uno.']],
      ev: [[1.0, 'draw', 1.2], [2.4, 'draw', 1.0], [9.8, 'rise'], [19.8, 'pops', 2]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1100, sx: 100, sy: 60, x0: -3.2, x1: 3.4, y0: -1, y1: 9.4, k: 1, grid: true, xt: [-2, -1, 1, 2, 3], yt: [1, 4] });
        plot(x => x * x, -3, 3, Pl, { k: draw(t, 1.0, 1.2), ymax: 9.4 }); plot(x => x + 2, -3, 3.3, Pl, { k: draw(t, 2.4, 1.0), c: P.mute });
        fade(A(t, 19.8), () => { [[2, 4], [-1, 1]].forEach(([x, y]) => { dot(Pl.X(x), Pl.Y(y), { r: 14, c: P.ac, ping: ping(t, 19.8) }); M(`(${x < 0 ? '−' + -x : x}, ${y})`, Pl.X(x) + 26, Pl.Y(y) + 50, 40, { a: 'l', c: P.ac, pass: true }); }); });
        fade(A(t, 9.8), () => M(R`x^{2} = x + 2 \;⇒\; x^{2} − x − 2 = 0`, 540, 1380, 62, { id: 'e' }));
      } },
    { id: 'sumaprod', name: 'Suma y producto', dur: 30,
      caps: [[0.5, 9.0, 'DOS NÚMEROS', 'Suman 9 y multiplicados', 'dan 20.'], [9.4, 19.0, 'SUSTITUIR', '$y = 9 − x$ en $xy = 20$:', '$x^{2} − 9x + 20 = 0$.'],
        [19.4, 29.4, 'RESULTADO', '$(x − 4)(x − 5) = 0$:', 'los números son 4 y 5.']],
      narr: [[0.5, 9.0, 'Otro sistema no lineal: dos números suman nueve y su producto es veinte.'],
        [9.4, 19.0, 'Se despeja y de la suma, nueve menos x, y se reemplaza en el producto. Queda una cuadrática.'],
        [19.4, 29.4, 'Se factoriza: x menos cuatro por x menos cinco. Los números son cuatro y cinco.']],
      ev: [[1.0, 'rise'], [9.8, 'fly', 1.0], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => { M(R`x + y = 9`, 540, 640, 72, { id: 'a' }); M(R`xy = 20`, 540, 760, 72, { id: 'b' }); });
        fade(A(t, 9.8), () => M(R`x(9 − x) = 20 \;⇒\; x^{2} − 9x + 20 = 0`, 540, 940, 60, { id: 'c' }));
        fade(A(t, 19.8), () => M(R`x = 4, \; y = 5 \quad \t{o} \quad x = 5, \; y = 4`, 540, 1120, 62, { id: 'd' }));
      } },
    { id: 'cortes', name: 'Cuántos cortes', dur: 28,
      caps: [[0.5, 9.0, 'DOS, UNO O NINGUNO', 'Una recta puede cortar', 'una parábola dos veces...'], [9.4, 18.0, 'TANGENTE', '...tocarla en un punto...', ''],
        [18.4, 27.4, 'O PASAR DE LARGO', '...o no tocarla: la cuadrática', 'no tiene raíces reales.']],
      narr: [[0.5, 9.0, 'Una recta puede cortar a una parábola en dos puntos, como acabamos de ver.'],
        [9.4, 18.0, 'Puede tocarla en uno solo, apenas rozándola: es tangente, y la cuadrática tiene una raíz doble.'],
        [18.4, 27.4, 'O puede pasar sin tocarla: la cuadrática tiene discriminante negativo y no hay cortes.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'draw', 1.0], [18.8, 'draw', 1.0]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1100, sx: 100, sy: 60, x0: -3.2, x1: 3.4, y0: -2, y1: 9.4, k: 1, grid: true, xt: [], yt: [] });
        plot(x => x * x, -3, 3, Pl, { ymax: 9.4 });
        plot(x => x + 2, -3, 3.3, Pl, { k: draw(t, 1.0, 1.0), c: P.ac }); plot(x => 2 * x - 1, -1, 3.3, Pl, { k: draw(t, 9.8, 1.0), c: P.mute }); plot(x => x - 2, -.2, 3.3, Pl, { k: draw(t, 18.8, 1.0), c: P.no });
        fade(A(t, 10.8), () => dot(Pl.X(1), Pl.Y(1), { r: 12, c: P.mute }));
      } },
    { id: 'idea', name: 'Partir una fracción', dur: 31,
      caps: [[0.5, 9.0, 'SUMAR', R`$\frac{2}{x − 1} − \frac{1}{x + 3}$`, 'da una sola fracción.'], [9.4, 19.0, 'EL RESULTADO', R`$\frac{x + 7}{(x − 1)(x + 3)}$.`, ''],
        [19.4, 30.4, 'EL CAMINO DE VUELTA', 'Partirla en fracciones simples:', 'fracciones parciales.']],
      narr: [[0.5, 9.0, 'Sumar fracciones algebraicas junta dos fracciones simples en una más complicada.'],
        [9.4, 19.0, 'Dos sobre x menos uno, menos uno sobre x más tres, da x más siete sobre el producto de los dos factores.'],
        [19.4, 30.4, 'Las fracciones parciales son el camino de vuelta: dada la fracción complicada, encontrar los pedazos simples.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'shuffle', 1.2]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{2}{x − 1} − \frac{1}{x + 3}`, 540, 680, 86, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= \frac{2(x + 3) − (x − 1)}{(x − 1)(x + 3)} = \frac{x + 7}{(x − 1)(x + 3)}`, 540, 900, 58, { id: 'b' }));
        fade(A(t, 19.8), () => { arrow(820, 1000, 820, 1100, { c: P.ac, w: 4 }); M(R`\frac{x + 7}{(x − 1)(x + 3)} = \frac{\hl{A}}{x − 1} + \frac{\hl{B}}{x + 3}`, 540, 1220, 62, { id: 'c' }); });
      } },
    { id: 'metodo', name: 'El método', dur: 42,
      caps: [[0.5, 9.0, 'DOS LETRAS', 'Una fracción con letra', 'por cada factor.'], [9.4, 19.0, 'IGUALAR NUMERADORES', '$x + 7 = A(x + 3) + B(x − 1)$,', 'para todo $x$.'],
        [19.4, 30.0, 'NÚMEROS CÓMODOS', 'Con $x = 1$: $8 = 4A$, $A = 2$.', 'Con $x = −3$: $4 = −4B$, $B = −1$.'], [30.4, 41.4, 'RESULTADO', R`$\frac{2}{x − 1} − \frac{1}{x + 3}$:`, 'los pedazos del principio.']],
      narr: [[0.5, 9.0, 'Se escribe una fracción por cada factor del denominador, con una letra arriba: A sobre x menos uno, más B sobre x más tres.'],
        [9.4, 19.0, 'Al sumar las de la derecha, el numerador debe ser x más siete para todo x. Eso da una igualdad entre polinomios.'],
        [19.4, 30.0, 'Se eligen x cómodos. Con x igual a uno se anula B y A es dos. Con x igual a menos tres se anula A y B es menos uno.'],
        [30.4, 41.4, 'La fracción se parte en dos sobre x menos uno, menos uno sobre x más tres. Justo los pedazos con los que empezamos.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'tag'], [23.0, 'tag'], [30.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{x + 7}{(x − 1)(x + 3)} = \frac{A}{x − 1} + \frac{B}{x + 3}`, 540, 640, 62, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`x + 7 = A(x + 3) + B(x − 1)`, 540, 840, 64, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`x = 1: \;\; 8 = 4A \;⇒\; A = \hl{2}`, 540, 1000, 60, { id: 'c' }));
        fade(A(t, 23.0), () => M(R`x = −3: \;\; 4 = −4B \;⇒\; B = \hl{−1}`, 540, 1120, 60, { id: 'd' }));
        fade(A(t, 30.8), () => M(R`= \frac{2}{x − 1} − \frac{1}{x + 3}`, 540, 1320, 76, { id: 'e' }));
      } },
    { id: 'formas', name: 'Las formas', dur: 31,
      caps: [[0.5, 9.0, 'FACTOR REPETIDO', '$(x − 1)^{2}$ pide una fracción', 'por cada potencia.'], [9.4, 19.0, 'FACTOR CUADRÁTICO', '$x^{2} + 1$, que no se parte,', 'pide $Bx + C$ arriba.'],
        [19.4, 30.4, 'CUÁNTAS LETRAS', 'Tantas como el grado', 'del denominador.']],
      narr: [[0.5, 9.0, 'La forma de los pedazos depende de los factores. Un factor repetido, como x menos uno al cuadrado, pide una fracción para cada potencia.'],
        [9.4, 19.0, 'Un factor cuadrático que no se puede partir, como x al cuadrado más uno, pide arriba un polinomio de grado uno.'],
        [19.4, 30.4, 'En total hay tantas letras por hallar como el grado del denominador.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'tag']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\frac{…}{(x − 1)^{2}} = \frac{A}{x − 1} + \frac{B}{(x − 1)^{2}}`, 540, 700, 64, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\frac{…}{(x − 2)(x^{2} + 1)} = \frac{A}{x − 2} + \frac{Bx + C}{x^{2} + 1}`, 540, 940, 56, { id: 'b' }));
      } },
    { id: 'propia', name: 'Primero dividir', dur: 26,
      caps: [[0.5, 12.0, 'FRACCIÓN IMPROPIA', 'Si arriba el grado es mayor', 'o igual, se divide antes.'], [12.4, 25.4, 'EJEMPLO', R`$\frac{x^{2} + 1}{x − 1} = x + 1 + \frac{2}{x − 1}$:`, 'cociente más fracción.']],
      narr: [[0.5, 12.0, 'Todo esto funciona si la fracción es propia: el grado de arriba menor que el de abajo. Si no, primero se divide.'],
        [12.4, 25.4, 'x al cuadrado más uno sobre x menos uno es x más uno, más dos sobre x menos uno. El cociente queda aparte y la fracción que sobra ya es propia.']],
      ev: [[1.0, 'rise'], [12.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\t{gr(arriba)} ≥ \t{gr(abajo)} \;⇒\; \t{dividir}`, 540, 700, 60, { id: 'a' }));
        fade(A(t, 12.8), () => M(R`\frac{x^{2} + 1}{x − 1} = x + 1 + \frac{2}{x − 1}`, 540, 920, 72, { id: 'b' }));
      } },
  ],
  sum: [['Curva y recta', R`x^{2} = x + 2 \;⇒\; (2, 4), \; (−1, 1)`], ['Suma y producto', R`x + y = 9, \;\; xy = 20`], ['Fracciones parciales', R`\frac{x + 7}{(x − 1)(x + 3)} = \frac{2}{x − 1} − \frac{1}{x + 3}`], ['Formas', R`(x − 1)^{2}: \; \frac{A}{x − 1} + \frac{B}{(x − 1)^{2}}`], ['Impropia', R`\t{primero dividir}`]],
  end: ['Igualar alturas cruza curvas;', 'igualar numeradores parte fracciones.'],
  finNarr: [[0.8, 9.0, 'En resumen: una curva y una recta se cortan donde sus alturas son iguales, y eso lleva a una cuadrática.'],
    [9.2, 16.0, 'Las fracciones parciales parten una fracción en pedazos simples, igualando los numeradores.']],
};
