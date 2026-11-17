// Lección alg-93 · Ceros de un polinomio (mundo Raíces de Polinomios).
// Teorema fundamental (grado n, n ceros); multiplicidad: cruza o rebota ((x + 1)²(x − 3)); candidatos racionales
// (2x³ − 5x² − 4x + 3); regla de los signos de Descartes; ceros complejos en parejas (x³ − x² + x − 1); construir un polinomio;
// cómo terminan las ramas.
const R = String.raw;
const POSTER = 130;
const G = x => 2 * x ** 3 - 5 * x ** 2 - 4 * x + 3;
const FILM = {
  lesson: 'alg-93', world: 'grado-superior', key: 'A', n: [3, 3],
  title: 'Ceros de un polinomio',
  next: 'Dominio y simplificación',
  intro: 'Un polinomio de grado tres siempre tiene tres ceros, aunque la gráfica cruce el eje una sola vez. Vamos a buscarlos todos.',
  examples: ['(x + 1)²(x − 3)', '2x³ − 5x² − 4x + 3', 'x³ − x² + x − 1'],
  scenes: [
    { id: 'fundamental', name: 'Tantos ceros como el grado', dur: 32,
      caps: [[0.5, 9.0, 'EL TEOREMA FUNDAMENTAL', 'Un polinomio de grado $n$', 'tiene $n$ ceros.'], [9.4, 19.0, 'CONTANDO BIEN', 'Algunos complejos y algunos', 'repetidos.'],
        [19.4, 31.4, 'EN FACTORES', 'Se escribe como el primer', 'coeficiente por $n$ factores.']],
      narr: [[0.5, 9.0, 'El teorema fundamental del álgebra dice que un polinomio de grado n tiene exactamente n ceros.'],
        [9.4, 19.0, 'Hay que contarlos bien: algunos pueden ser números complejos, y algunos pueden repetirse.'],
        [19.4, 31.4, 'Por eso todo polinomio se escribe como su primer coeficiente por n factores de la forma x menos un cero.']],
      ev: [[1.0, 'card'], [9.8, 'tag'], [19.8, 'rise']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\t{grado } n \;⇒\; n \t{ ceros}`, 540, 700, 80, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`P(x) = a(x − r_{1})(x − r_{2}) · … · (x − r_{n})`, 540, 920, 56, { id: 'b' }));
      } },
    { id: 'multiplicidad', name: 'Cruza o rebota', dur: 37,
      caps: [[0.5, 9.0, 'UN FACTOR REPETIDO', '$(x + 1)^{2}(x − 3)$: el $−1$', 'es un cero doble.'], [9.4, 19.0, 'REBOTA', 'En un cero doble la curva', 'toca el eje y se devuelve.'],
        [19.4, 28.0, 'CRUZA', 'En un cero simple', 'pasa al otro lado.'], [28.4, 36.4, 'LA REGLA', 'Multiplicidad impar: cruza.', 'Par: rebota.']],
      narr: [[0.5, 9.0, 'En x más uno al cuadrado por x menos tres, el factor x más uno aparece dos veces. El cero menos uno es doble: cuenta dos veces.'],
        [9.4, 19.0, 'En la gráfica se nota: en menos uno la curva toca el eje y se devuelve, porque un cuadrado no cambia de signo.'],
        [19.4, 28.0, 'En tres, que es un cero simple, la curva pasa al otro lado del eje.'],
        [28.4, 36.4, 'La regla: si un cero se repite un número impar de veces, la curva cruza; si es par, rebota.']],
      ev: [[1.0, 'draw', 1.6], [9.8, 'pop'], [19.8, 'pop']],
      draw(t) {
        const Pl = plane({ ox: 480, oy: 960, sx: 110, sy: 28, x0: -2.8, x1: 4.2, y0: -12, y1: 9, k: A(t, .6, .8), grid: true, xt: [-2, -1, 1, 2, 3], yt: [] });
        plot(x => (x + 1) ** 2 * (x - 3), -2.6, 4.0, Pl, { k: draw(t, 1.0, 1.6), ymin: -12, ymax: 9 });
        fade(A(t, 9.8), () => { dot(Pl.X(-1), Pl.Y(0), { r: 14, c: P.ac }); label('rebota', Pl.X(-1), Pl.Y(0) + 70, P.ac, { s: 36 }); });
        fade(A(t, 19.8), () => { dot(Pl.X(3), Pl.Y(0), { r: 14, c: P.ac }); label('cruza', Pl.X(3) + 20, Pl.Y(0) - 30, P.ac, { s: 36, a: 'l' }); });
        fade(A(t, 1.0), () => M(R`P(x) = (x + 1)^{2}(x − 3)`, 540, 1440, 70, { id: 'p' }));
      } },
    { id: 'racionales', name: 'Candidatos racionales', dur: 40,
      caps: [[0.5, 9.0, 'COEFICIENTES ENTEROS', R`Un cero racional $\frac{c}{d}$ cumple:`, '$c$ divide al último...'], [9.4, 19.0, '...Y d AL PRIMERO', 'En $2x^{3} − 5x^{2} − 4x + 3$:', '$c$ divide a 3, $d$ a 2.'],
        [19.4, 29.0, 'LOS CANDIDATOS', R`$±1, ±3, ±\frac{1}{2}, ±\frac{3}{2}$.`, 'Se prueban.'], [29.4, 39.4, 'UNO SIRVE', '$P(3) = 54 − 45 − 12 + 3 = 0$:', '3 es un cero.']],
      narr: [[0.5, 9.0, 'Si los coeficientes son enteros, los ceros racionales tienen una pista. En un cero c sobre d, simplificado, c divide al término independiente.'],
        [9.4, 19.0, 'Y d divide al primer coeficiente. En dos x al cubo menos cinco x al cuadrado menos cuatro x más tres, c divide a tres y d a dos.'],
        [19.4, 29.0, 'Los únicos candidatos son más y menos uno, tres, un medio y tres medios. Pocos, y se pueden probar.'],
        [29.4, 39.4, 'P de tres da cincuenta y cuatro menos cuarenta y cinco menos doce más tres: cero. Tres es un cero.']],
      ev: [[1.0, 'rise'], [9.8, 'tag'], [19.8, 'pops', 8], [29.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`P(x) = \hl{2}x^{3} − 5x^{2} − 4x + \hl{3}`, 540, 660, 70, { id: 'p' }));
        fade(A(t, 9.8), () => M(R`\frac{c}{d}: \quad c \;|\; 3, \quad d \;|\; 2`, 540, 820, 66, { id: 'r' }));
        fade(A(t, 19.8), () => M(R`±1, \;\; ±3, \;\; ±\frac{1}{2}, \;\; ±\frac{3}{2}`, 540, 990, 70, { id: 'c' }));
        fade(A(t, 29.8), () => M(R`P(3) = 54 − 45 − 12 + 3 = \hl{0}`, 540, 1180, 66, { id: 'v' }));
      } },
    { id: 'terminar', name: 'Terminar la factorización', dur: 30,
      caps: [[0.5, 9.0, 'DIVIDIR ENTRE x − 3', 'Con división sintética:', '$2x^{2} + x − 1$.'], [9.4, 19.0, 'FACTORIZAR', '$2x^{2} + x − 1 = (2x − 1)(x + 1)$.', ''],
        [19.4, 29.4, 'LOS TRES CEROS', R`3, $\frac{1}{2}$ y $−1$.`, '']],
      narr: [[0.5, 9.0, 'Sabiendo que tres es un cero, se divide entre x menos tres con la división sintética. Queda dos x al cuadrado más x menos uno.'],
        [9.4, 19.0, 'Ese se factoriza: dos x menos uno por x más uno.'],
        [19.4, 29.4, 'Los tres ceros son tres, un medio y menos uno. Todos estaban en la lista de candidatos.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'pops', 3]],
      draw(t) {
        const Pl = plane({ ox: 480, oy: 980, sx: 110, sy: 24, x0: -2, x1: 4, y0: -14, y1: 10, k: 1, grid: true, xt: [-1, 1, 2, 3], yt: [] });
        plot(G, -1.6, 3.7, Pl, { ymin: -14, ymax: 10 });
        [[3, '3'], [.5, R`\frac{1}{2}`], [-1, '−1']].forEach(([c, s], i) => fade(A(t, 19.8 + i * .5), () => { dot(Pl.X(c), Pl.Y(0), { r: 13, c: P.ac }); M(s, Pl.X(c), Pl.Y(0) + 70, 40, { c: P.ac, pass: true }); }));
        fade(A(t, 1.0), () => M(R`P(x) = (x − 3)(2x^{2} + x − 1)`, 540, 1400, 62, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= (x − 3)(2x − 1)(x + 1)`, 540, 1520, 66, { id: 'b' }));
      } },
    { id: 'descartes', name: 'La regla de Descartes', dur: 36,
      caps: [[0.5, 9.0, 'CAMBIOS DE SIGNO', R`$+ \; − \; − \; +$: dos`, 'cambios de signo.'], [9.4, 19.0, 'CEROS POSITIVOS', 'Dos, o dos menos un número', 'par: 2 o 0.'],
        [19.4, 28.0, 'CON −x', R`$P(−x)$: $− \; − \; + \; +$, un`, 'cambio: un cero negativo.'], [28.4, 35.4, 'COINCIDE', R`Positivos: 3 y $\frac{1}{2}$.`, 'Negativo: $−1$.']],
      narr: [[0.5, 9.0, 'Otra pista viene de los signos. En el mismo polinomio, los signos de los coeficientes son más, menos, menos, más: cambian dos veces.'],
        [9.4, 19.0, 'La regla de Descartes dice que hay dos ceros positivos, o dos menos un número par: dos o ninguno.'],
        [19.4, 28.0, 'Para los negativos se mira P de menos x. Sus signos cambian una vez: hay exactamente un cero negativo.'],
        [28.4, 35.4, 'Y así es: tres y un medio son positivos, y menos uno es negativo.']],
      ev: [[1.0, 'pops', 4], [9.8, 'tag'], [19.8, 'pops', 4], [28.8, 'yes']],
      draw(t) {
        const signs = (y, ss, t0) => ss.forEach((s, i) => fade(A(t, t0 + i * .3), () => { circ(240 + i * 200, y, 48, { w: 4, fill: s === '+' ? .45 : .1 }); M(s === '+' ? '+' : '−', 240 + i * 200, y + 20, 60, { pass: true }); if (i && ss[i] !== ss[i - 1]) hop(240 + (i - 1) * 200, 240 + i * 200, y - 50, 1, { c: P.ac, h: 50 }); }));
        signs(700, ['+', '−', '−', '+'], 1.0);
        fade(A(t, 19.8), () => signs(1000, ['−', '−', '+', '+'], 19.8));
        fade(A(t, 1.2), () => M(R`2x^{3} − 5x^{2} − 4x + 3`, 540, 560, 56, { id: 'p' }));
        fade(A(t, 19.8), () => M(R`P(−x) = −2x^{3} − 5x^{2} + 4x + 3`, 540, 870, 56, { id: 'n' }));
      } },
    { id: 'complejos', name: 'Ceros complejos', dur: 32,
      caps: [[0.5, 9.0, 'UN SOLO CRUCE', '$x^{3} − x^{2} + x − 1$ cruza', 'el eje solo en 1.'], [9.4, 19.0, 'LOS OTROS DOS', '$(x − 1)(x^{2} + 1)$:', '$x^{2} + 1 = 0$ da $±i$.'],
        [19.4, 31.4, 'EN PAREJA', 'Con coeficientes reales,', 'los complejos van en pareja.']],
      narr: [[0.5, 9.0, 'Este polinomio de grado tres cruza el eje una sola vez, en uno. Pero debería tener tres ceros.'],
        [9.4, 19.0, 'Al dividir entre x menos uno queda x al cuadrado más uno, que no toca el eje. Sus ceros son i y menos i.'],
        [19.4, 31.4, 'Con coeficientes reales, los ceros complejos siempre aparecen en pareja: uno y su conjugado. Por eso un grado impar tiene al menos un cero real.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'card'], [19.8, 'tag']],
      draw(t) {
        const Pl = plane({ ox: 480, oy: 980, sx: 140, sy: 40, x0: -1.8, x1: 2.6, y0: -6, y1: 7, k: 1, grid: true, xt: [-1, 1, 2], yt: [] });
        plot(x => x ** 3 - x ** 2 + x - 1, -1.4, 2.4, Pl, { k: draw(t, 1.0, 1.4), ymin: -6, ymax: 7 });
        fade(A(t, 2.4), () => dot(Pl.X(1), Pl.Y(0), { r: 13, c: P.ac }));
        fade(A(t, 9.8), () => M(R`(x − 1)(x^{2} + 1) \;⇒\; 1, \; i, \; −i`, 540, 1420, 62, { id: 'f' }));
      } },
    { id: 'construir', name: 'Construir un polinomio', dur: 28,
      caps: [[0.5, 12.0, 'AL REVÉS', 'Ceros 2, $−1$ y 3:', 'un factor por cada uno.'], [12.4, 27.4, 'RESULTADO', '$(x − 2)(x + 1)(x − 3)$', '$= x^{3} − 4x^{2} + x + 6$.']],
      narr: [[0.5, 12.0, 'También se puede ir al revés: dados los ceros, construir el polinomio. Si deben ser dos, menos uno y tres, se pone un factor por cada uno.'],
        [12.4, 27.4, 'x menos dos, por x más uno, por x menos tres. Multiplicado: x al cubo menos cuatro x al cuadrado más x más seis.']],
      ev: [[1.0, 'pops', 3], [12.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`2, \;\; −1, \;\; 3`, 540, 700, 80, { id: 'c' }));
        fade(A(t, 3.0), () => M(R`(x − 2)(x + 1)(x − 3)`, 540, 880, 76, { id: 'f' }));
        fade(A(t, 12.8), () => M(R`= x^{3} − 4x^{2} + x + 6`, 540, 1040, 76, { id: 'r' }));
      } },
    { id: 'ramas', name: 'Cómo terminan las ramas', dur: 28,
      caps: [[0.5, 12.0, 'EL PRIMER TÉRMINO MANDA', 'Lejos del origen, $ax^{n}$', 'decide hacia dónde va.'], [12.4, 27.4, 'GRADO IMPAR Y PAR', 'Impar: ramas opuestas.', 'Par: las dos al mismo lado.']],
      narr: [[0.5, 12.0, 'Lejos del origen, el término de mayor grado domina a los demás y decide hacia dónde se van las ramas de la gráfica.'],
        [12.4, 27.4, 'Con grado impar, una rama sube y la otra baja: por eso siempre cruza el eje. Con grado par, las dos van hacia el mismo lado.']],
      ev: [[1.0, 'draw', 1.4], [12.8, 'draw', 1.4]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 980, sx: 120, sy: 40, x0: -3.2, x1: 3.2, y0: -7, y1: 7, k: 1, grid: true, xt: [], yt: [] });
        plot(x => .4 * x ** 3 - 1.2 * x, -3.1, 3.1, Pl, { k: draw(t, 1.0, 1.4), ymin: -7, ymax: 7 });
        plot(x => .3 * x ** 4 - 1.6 * x * x + 1, -2.9, 2.9, Pl, { k: draw(t, 12.8, 1.4), c: P.mute, ymin: -7, ymax: 7 });
        fade(A(t, 2.4), () => label('impar', Pl.X(2.6), Pl.Y(5.5), P.ac, { s: 36 })); fade(A(t, 14.2), () => label('par', Pl.X(-2.4), Pl.Y(5.5), P.ink, { s: 36 }));
      } },
  ],
  sum: [['Teorema fundamental', R`\t{grado } n \;⇒\; n \t{ ceros}`], ['Multiplicidad', R`\t{impar: cruza} \qquad \t{par: rebota}`], ['Candidatos racionales', R`\frac{c}{d}: \; c \,|\, a_{0}, \;\; d \,|\, a_{n}`], ['Descartes', R`\t{cambios de signo}`], ['Complejos', R`\t{en parejas conjugadas}`]],
  end: ['Cada cero es un factor,', 'y no se pierde ninguno.'],
  finNarr: [[0.8, 9.0, 'En resumen: un polinomio de grado n tiene n ceros, contando los complejos y los repetidos.'],
    [9.2, 16.0, 'Los candidatos racionales y la regla de los signos ayudan a encontrarlos.']],
};
