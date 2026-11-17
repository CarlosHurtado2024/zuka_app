// Lección alg-4 · Ecuaciones cuadráticas (mundo Parábolas y Complejos).
// Raíces = donde la parábola cruza el eje; producto cero (x² − 5x + 6); x² = 7 tiene dos raíces; la fórmula general (de completar
// el cuadrado) con 2x² − 3x − 2; el discriminante y las tres parábolas; raíces complejas (x² + 2x + 5); un rectángulo.
const R = String.raw;
const POSTER = 120;
const FILM = {
  lesson: 'alg-4', world: 'cuadraticas', key: 'E', n: [4, 4],
  title: 'Ecuaciones cuadráticas',
  next: 'División e igualdad de polinomios',
  intro: 'Una ecuación de grado dos pregunta dónde cruza una parábola el eje. Puede cruzarlo dos veces, una o ninguna.',
  examples: ['x² − 5x + 6', 'x² = 7', '2x² − 3x − 2', 'x² + 2x + 5', '−1 ± 2i', 'w + 2', '48'],
  scenes: [
    { id: 'raices', name: 'Las raíces', dur: 30,
      caps: [[0.5, 9.0, 'IGUALAR A CERO', '$ax^{2} + bx + c = 0$: dónde', 'la parábola toca el eje.'], [9.4, 19.0, 'RAÍCES', 'Los valores de $x$ que', 'hacen cero el polinomio.'],
        [19.4, 29.4, 'EN LA GRÁFICA', 'Los cortes con', 'el eje horizontal.']],
      narr: [[0.5, 9.0, 'Una ecuación cuadrática iguala un polinomio de grado dos a cero. En la gráfica, pregunta dónde la parábola toca el eje horizontal.'],
        [9.4, 19.0, 'Los valores de x que hacen cero el polinomio se llaman raíces o soluciones.'],
        [19.4, 29.4, 'Son los puntos donde la curva corta el eje: ahí la altura vale cero.']],
      ev: [[1.0, 'draw', 1.4], [9.8, 'pops', 2], [19.8, 'yes']],
      draw(t) {
        const Pl = plane({ ox: 360, oy: 980, sx: 110, sy: 90, x0: -1.6, x1: 5.2, y0: -2.2, y1: 4.4, k: A(t, .6, .8), grid: true, xt: [1, 2, 3, 4], yt: [2, 4] });
        plot(x => x * x - 5 * x + 6, -.2, 5.2, Pl, { k: draw(t, 1.0, 1.4), ymax: 4.4 });
        fade(A(t, 9.8), () => { [2, 3].forEach(x => dot(Pl.X(x), Pl.Y(0), { r: 14, c: P.ac, ping: ping(t, 9.8) })); });
        fade(A(t, 1.0), () => M(R`x^{2} − 5x + 6 = 0`, 540, 1340, 80, { id: 'e' }));
      } },
    { id: 'factor', name: 'Si un producto es cero', dur: 34,
      caps: [[0.5, 9.0, 'FACTORIZAR', '$x^{2} − 5x + 6 = (x − 2)(x − 3)$.', ''], [9.4, 19.0, 'PRODUCTO CERO', 'Si $AB = 0$, entonces', '$A = 0$ o $B = 0$.'],
        [19.4, 33.4, 'LAS RAÍCES', '$x − 2 = 0$ o $x − 3 = 0$:', '$x = 2$ o $x = 3$.']],
      narr: [[0.5, 9.0, 'Si el polinomio se deja factorizar, es fácil. Dos números que multipliquen seis y sumen menos cinco: menos dos y menos tres.'],
        [9.4, 19.0, 'Y aquí entra una propiedad clave: si un producto da cero, alguno de los factores es cero. Ningún producto de números distintos de cero da cero.'],
        [19.4, 33.4, 'Entonces x menos dos es cero, o x menos tres es cero. Las raíces son dos y tres, justo donde la parábola cortaba el eje.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{2} − 5x + 6 = (x − 2)(x − 3) = 0`, 540, 680, 66, { id: 'f' }));
        fade(A(t, 9.8), () => M(R`AB = 0 \;⇒\; A = 0 \;\t{ o }\; B = 0`, 540, 900, 70, { id: 'p' }));
        fade(A(t, 19.8), () => M(R`x = \hl{2} \qquad x = \hl{3}`, 540, 1120, 86, { id: 'r' }));
      } },
    { id: 'despejar', name: 'Dos raíces cuadradas', dur: 28,
      caps: [[0.5, 9.0, 'SIN TÉRMINO EN x', '$x^{2} = 7$: se saca', 'raíz cuadrada.'], [9.4, 18.0, '!SON DOS', R`$\sqrt{7}$ y $−\sqrt{7}$: los dos`, 'al cuadrado dan 7.'],
        [18.4, 27.4, 'SE ESCRIBE', R`$x = ±\sqrt{7}$.`, '']],
      narr: [[0.5, 9.0, 'Si no hay término con x, como x al cuadrado igual a siete, se despeja sacando raíz.'],
        [9.4, 18.0, 'Pero cuidado: tanto raíz de siete como menos raíz de siete, al cuadrado, dan siete. Son dos soluciones.'],
        [18.4, 27.4, 'Se escriben juntas con el símbolo más o menos.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 2], [18.8, 'card']],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1080, sx: 120, sy: 34, x0: -3.6, x1: 3.6, y0: -1, y1: 12, k: 1, xt: [-3, -2, -1, 1, 2, 3], yt: [7] });
        plot(x => x * x, -3.4, 3.4, Pl, { ymax: 12 }); stroke(P.mute, 3, () => { X.moveTo(Pl.X(-3.6), Pl.Y(7)); X.lineTo(Pl.X(3.6), Pl.Y(7)); }, { dash: [10, 10] });
        fade(A(t, 9.8), () => [Math.sqrt(7), -Math.sqrt(7)].forEach(x => { dot(Pl.X(x), Pl.Y(7), { r: 13, c: P.ac }); stroke(P.ac, 3, () => { X.moveTo(Pl.X(x), Pl.Y(7)); X.lineTo(Pl.X(x), Pl.Y(0)); }, { dash: [8, 8] }); }));
        fade(A(t, 1.0), () => M(R`x^{2} = 7`, 540, 1320, 86, { id: 'e' }));
        fade(A(t, 18.8), () => M(R`x = \hl{±\sqrt{7}}`, 540, 1460, 86, { id: 'r' }));
      } },
    { id: 'formula', name: 'La fórmula general', dur: 41,
      caps: [[0.5, 9.0, 'CUANDO NO SE FACTORIZA', 'Se completa el cuadrado', 'con letras.'], [9.4, 19.0, 'LA FÓRMULA', R`$x = \frac{−b ± \sqrt{b^{2} − 4ac}}{2a}$.`, ''],
        [19.4, 30.0, 'EJEMPLO', '$2x^{2} − 3x − 2 = 0$:', '$a = 2$, $b = −3$, $c = −2$.'], [30.4, 40.4, 'RESULTADO', R`$x = \frac{3 ± 5}{4}$: $x = 2$`, R`o $x = −\frac{1}{2}$.`]],
      narr: [[0.5, 9.0, 'Si no se encuentran los dos números, se usa una fórmula que sirve siempre. Sale de completar el cuadrado con letras en vez de números.'],
        [9.4, 19.0, 'x es menos b, más o menos raíz de b al cuadrado menos cuatro a c, todo sobre dos a. El más o menos da las dos raíces.'],
        [19.4, 30.0, 'Para dos x al cuadrado menos tres x menos dos: a es dos, b menos tres y c menos dos. Adentro de la raíz: nueve más dieciséis, veinticinco.'],
        [30.4, 40.4, 'Raíz de veinticinco es cinco: x es tres más o menos cinco, sobre cuatro. Dos, o menos un medio.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'tag'], [30.8, 'yes']],
      draw(t) {
        fade(A(t, 9.8), () => M(R`x = \frac{−b ± \sqrt{b^{2} − 4ac}}{2a}`, 540, 680, 90, { id: 'f' }));
        fade(A(t, 19.8), () => M(R`x = \frac{3 ± \sqrt{9 + 16}}{4} = \frac{3 ± 5}{4}`, 540, 940, 70, { id: 'e' }));
        fade(A(t, 30.8), () => M(R`x = \hl{2} \qquad x = \hl{−\frac{1}{2}}`, 540, 1160, 80, { id: 'r' }));
        fade(A(t, 1.0) * (1 - A(t, 9.6)), () => M(R`ax^{2} + bx + c = 0`, 540, 680, 80, { id: 'g' }));
      } },
    { id: 'discriminante', name: 'Cuántas raíces', dur: 36,
      caps: [[0.5, 9.0, 'EL DISCRIMINANTE', '$Δ = b^{2} − 4ac$: lo que', 'va dentro de la raíz.'], [9.4, 19.0, 'Δ > 0 Y Δ = 0', 'Positivo: dos raíces.', 'Cero: una, el vértice toca.'],
        [19.4, 27.0, 'Δ < 0', 'Negativo: ninguna raíz real.', 'La parábola no toca el eje.'], [27.4, 35.4, 'SIN RESOLVER', 'Se sabe cuántas raíces hay', 'antes de calcularlas.']],
      narr: [[0.5, 9.0, 'Lo que va dentro de la raíz, b al cuadrado menos cuatro a c, se llama discriminante, y se escribe con la letra griega delta.'],
        [9.4, 19.0, 'Si es positivo, hay dos raíces: la parábola cruza el eje dos veces. Si es cero, una sola: el vértice apenas toca.'],
        [19.4, 27.0, 'Si es negativo, no hay raíces reales: la parábola no toca el eje.'],
        [27.4, 35.4, 'Así se sabe cuántas soluciones hay sin terminar la cuenta.']],
      ev: [[1.0, 'rise'], [9.8, 'draw', 1.0], [12.0, 'draw', 1.0], [19.8, 'draw', 1.0]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1080, sx: 100, sy: 70, x0: -4.4, x1: 4.4, y0: -2.6, y1: 4.6, k: 1, grid: true, xt: [], yt: [] });
        plot(x => x * x - 2, -2.6, 2.6, Pl, { k: draw(t, 9.8, 1.0), ymax: 4.6 });
        plot(x => (x - 1.5) ** 2, -.6, 3.6, Pl, { k: draw(t, 12.0, 1.0), c: P.mute, ymax: 4.6 });
        plot(x => (x + 2) ** 2 + 1, -4.2, .2, Pl, { k: draw(t, 19.8, 1.0), c: P.no, ymax: 4.6 });
        fade(A(t, 10.8), () => label('Δ > 0', Pl.X(0), Pl.Y(-2) + 60, P.ac, { s: 36 })); fade(A(t, 13.0), () => label('Δ = 0', Pl.X(1.5), Pl.Y(0) + 60, P.ink, { s: 36 })); fade(A(t, 20.8), () => label('Δ < 0', Pl.X(-2), Pl.Y(1) + 60, P.no, { s: 36 }));
        fade(A(t, 1.0), () => M(R`Δ = b^{2} − 4ac`, 540, 1400, 86, { id: 'd' }));
      } },
    { id: 'complejas', name: 'Raíces complejas', dur: 33,
      caps: [[0.5, 9.0, 'Δ NEGATIVO', '$x^{2} + 2x + 5 = 0$:', '$Δ = 4 − 20 = −16$.'], [9.4, 19.0, 'CON NÚMEROS COMPLEJOS', R`$\sqrt{−16} = 4i$.`, ''],
        [19.4, 32.4, 'DOS RAÍCES COMPLEJAS', R`$x = \frac{−2 ± 4i}{2} = −1 ± 2i$:`, 'una conjugada de la otra.']],
      narr: [[0.5, 9.0, 'Cuando el discriminante es negativo, como en x al cuadrado más dos x más cinco, la parábola no toca el eje.'],
        [9.4, 19.0, 'Pero con los complejos de la primera lección, la raíz de menos dieciséis sí existe: cuatro i.'],
        [19.4, 32.4, 'Las raíces son menos uno más dos i y menos uno menos dos i. Siempre vienen en pareja: una es la conjugada de la otra.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{2} + 2x + 5 = 0`, 540, 660, 80, { id: 'e' }));
        fade(A(t, 2.4), () => M(R`Δ = 2^{2} − 4 · 1 · 5 = \no{−16}`, 540, 800, 66, { id: 'd' }));
        fade(A(t, 9.8), () => M(R`\sqrt{−16} = 4i`, 540, 960, 76, { id: 'i' }));
        fade(A(t, 19.8), () => M(R`x = \frac{−2 ± 4i}{2} = \hl{−1 ± 2i}`, 540, 1160, 76, { id: 'r' }));
      } },
    { id: 'problema', name: 'Un rectángulo', dur: 33,
      caps: [[0.5, 9.0, 'UN PROBLEMA', 'Un rectángulo de área 48, con', 'el largo 2 más que el ancho.'], [9.4, 19.0, 'LA ECUACIÓN', '$w(w + 2) = 48$, o sea', '$w^{2} + 2w − 48 = 0$.'],
        [19.4, 32.4, 'LAS RAÍCES', '$(w + 8)(w − 6) = 0$:', 'el ancho es 6, no −8.']],
      narr: [[0.5, 9.0, 'Un rectángulo tiene área cuarenta y ocho y su largo mide dos más que su ancho. Hay que encontrar sus lados.'],
        [9.4, 19.0, 'Si el ancho es w, el largo es w más dos, y w por w más dos es cuarenta y ocho. Es una ecuación cuadrática.'],
        [19.4, 32.4, 'Se factoriza: w más ocho por w menos seis. Las raíces son menos ocho y seis, pero un ancho no es negativo: el ancho es seis y el largo, ocho.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        rect(330, 520, 8 * 52, 6 * 52, { k: draw(t, 1.0, 1.0), w: 5, fill: .2 });
        fade(A(t, 1.6), () => { M('w', 300, 520 + 3 * 52 + 14, 44, { a: 'r', pass: true }); M('w + 2', 330 + 4 * 52, 500, 44, { pass: true }); M('48', 330 + 4 * 52, 520 + 3 * 52 + 18, 60, { pass: true }); });
        fade(A(t, 9.8), () => M(R`w(w + 2) = 48 \;⇒\; w^{2} + 2w − 48 = 0`, 540, 1000, 62, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`(w + 8)(w − 6) = 0 \;⇒\; w = \hl{6}`, 540, 1160, 66, { id: 'r' }));
      } },
  ],
  sum: [['Producto cero', R`AB = 0 \;⇒\; A = 0 \t{ o } B = 0`], ['Dos signos', R`x^{2} = 7 \;⇒\; x = ±\sqrt{7}`], ['Fórmula general', R`x = \frac{−b ± \sqrt{b^{2} − 4ac}}{2a}`], ['Discriminante', R`Δ > 0: 2 \qquad Δ = 0: 1 \qquad Δ < 0: 0`], ['Raíces complejas', R`x^{2} + 2x + 5 = 0 \;⇒\; x = −1 ± 2i`]],
  end: ['Resolver es buscar dónde', 'la parábola toca el eje.'],
  finNarr: [[0.8, 9.0, 'En resumen: si se factoriza, cada factor da una raíz; si no, la fórmula general sirve siempre.'],
    [9.2, 16.0, 'El discriminante dice cuántas raíces reales hay, y si es negativo, las raíces son complejas conjugadas.']],
};
