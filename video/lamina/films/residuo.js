// Lección alg-92 · Residuo, factor y división sintética (mundo Raíces de Polinomios).
// La pregunta (¿x − 2 es factor?); el teorema del residuo P(c) = R y por qué; P(1) = −8 y P(2) = 0; teorema del factor
// (cero ↔ factor, en la gráfica); la división sintética paso a paso; la factorización completa; hallar k.
const R = String.raw;
const POSTER = 140;
const Pf = x => x ** 3 + 2 * x ** 2 - 5 * x - 6;
const FILM = {
  lesson: 'alg-92', world: 'grado-superior', key: 'A', n: [2, 3],
  title: 'Residuo, factor y división sintética',
  next: 'Ceros de un polinomio',
  intro: 'Para saber qué sobra al dividir basta con reemplazar un número. Y se puede dividir sin escribir las x.',
  examples: ['P(1) = −8', 'x³ + kx² + x + 6', 'k = −4', '1 4 3 0'],
  scenes: [
    { id: 'pregunta', name: 'La pregunta', dur: 29,
      caps: [[0.5, 9.0, 'UN POLINOMIO', '$P(x) = x^{3} + 2x^{2} − 5x − 6$.', ''], [9.4, 19.0, 'LA PREGUNTA', 'Si $x − 2$ es un factor:', 'si el residuo es 0.'],
        [19.4, 28.4, 'UN ATAJO', 'Hay una manera de saberlo', 'sin dividir.']],
      narr: [[0.5, 9.0, 'Tomemos el polinomio x al cubo más dos x al cuadrado menos cinco x menos seis.'],
        [9.4, 19.0, 'Queremos saber si x menos dos es uno de sus factores, es decir, si al dividir el residuo da cero.'],
        [19.4, 28.4, 'Se podría hacer la división larga. Pero hay un atajo mucho más corto.']],
      ev: [[1.0, 'rise'], [9.8, 'doubt']],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1000, sx: 110, sy: 34, x0: -4, x1: 3.2, y0: -10, y1: 10, k: A(t, .8, .8), grid: true, xt: [-3, -2, -1, 1, 2], yt: [-8, 8] });
        plot(Pf, -3.8, 2.75, Pl, { k: draw(t, 1.6, 1.6), ymin: -10, ymax: 10 });
        fade(A(t, 1.0), () => M(R`P(x) = x^{3} + 2x^{2} − 5x − 6`, 540, 1440, 66, { id: 'p' }));
        fade(A(t, 9.8), () => M(R`(x − 2) \;\t{¿es factor?}`, 540, 1560, 60, { id: 'q' }));
      } },
    { id: 'teorema', name: 'El teorema del residuo', dur: 35,
      caps: [[0.5, 9.0, 'LA DIVISIÓN', R`$P(x) = (x − c)\,Q(x) + R$,`, 'para todo $x$.'], [9.4, 19.0, 'SE REEMPLAZA x = c', 'El primer sumando', 'se vuelve 0.'],
        [19.4, 34.4, 'EL TEOREMA', '$P(c) = R$: el residuo es', 'el valor del polinomio en $c$.']],
      narr: [[0.5, 9.0, 'Al dividir P entre x menos c, P de x es x menos c por el cociente, más el residuo. Vale para cualquier x.'],
        [9.4, 19.0, 'En particular para x igual a c. Pero ahí c menos c es cero, y el primer sumando desaparece.'],
        [19.4, 34.4, 'Queda P de c igual al residuo. Ese es el teorema del residuo: para saber qué sobra, basta reemplazar c.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`P(x) = (x − c)\,Q(x) + R`, 540, 680, 80, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`P(c) = \no{(c − c)}\,Q(c) + R`, 540, 860, 76, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`P(c) = \hl{R}`, 540, 1060, 100, { id: 'c' }));
      } },
    { id: 'probar', name: 'Probar números', dur: 31,
      caps: [[0.5, 9.0, 'CON x − 1', '$P(1) = 1 + 2 − 5 − 6 = −8$:', 'sobran $−8$.'], [9.4, 19.0, 'CON x − 2', '$P(2) = 8 + 8 − 10 − 6 = 0$:', 'no sobra nada.'],
        [19.4, 30.4, 'ENTONCES', '$x − 2$ es factor;', '$x − 1$ no.']],
      narr: [[0.5, 9.0, 'Probemos. Para x menos uno se calcula P de uno: uno más dos menos cinco menos seis, menos ocho. El residuo es menos ocho.'],
        [9.4, 19.0, 'Para x menos dos, P de dos: ocho más ocho menos diez menos seis, cero. No sobra nada.'],
        [19.4, 30.4, 'Así que x menos dos es un factor de P, y x menos uno no lo es. Sin hacer ninguna división.']],
      ev: [[1.0, 'no'], [9.8, 'yes'], [19.8, 'card']],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1000, sx: 110, sy: 34, x0: -4, x1: 3.2, y0: -10, y1: 10, k: 1, grid: true, xt: [-3, -2, -1, 1, 2], yt: [-8, 8] });
        plot(Pf, -3.8, 2.75, Pl, { ymin: -10, ymax: 10 });
        fade(A(t, 1.0), () => { dot(Pl.X(1), Pl.Y(-8), { r: 13, c: P.no }); stroke(P.no, 3, () => { X.moveTo(Pl.X(1), Pl.Y(0)); X.lineTo(Pl.X(1), Pl.Y(-8)); }, { dash: [8, 8] }); M('−8', Pl.X(1) + 30, Pl.Y(-8) + 14, 40, { a: 'l', c: P.no, pass: true }); });
        fade(A(t, 9.8), () => dot(Pl.X(2), Pl.Y(0), { r: 14, c: P.ac, ping: ping(t, 9.8) }));
        fade(A(t, 1.6), () => M(R`P(1) = \no{−8}`, 320, 1440, 66, { id: 'a' }));
        fade(A(t, 10.4), () => M(R`P(2) = \hl{0}`, 760, 1440, 66, { id: 'b' }));
      } },
    { id: 'factor', name: 'El teorema del factor', dur: 30,
      caps: [[0.5, 9.0, 'EL TEOREMA DEL FACTOR', 'Si $P(c) = 0$, entonces', '$x − c$ es factor de $P$.'], [9.4, 19.0, 'Y AL REVÉS', 'Si $x − c$ es factor,', 'entonces $P(c) = 0$.'],
        [19.4, 29.4, 'EN LA GRÁFICA', 'Cada cero, donde la curva', 'cruza el eje, da un factor.']],
      narr: [[0.5, 9.0, 'Con residuo cero, el teorema del residuo da otro: si P de c es cero, entonces x menos c es factor de P.'],
        [9.4, 19.0, 'Y al revés: si x menos c es factor, al reemplazar c ese factor se anula y todo el producto vale cero.'],
        [19.4, 29.4, 'En la gráfica, cada punto donde la curva cruza el eje es un cero, y cada cero es un factor.']],
      ev: [[1.0, 'card'], [9.8, 'rise'], [19.8, 'pops', 3]],
      draw(t) {
        const Pl = plane({ ox: 540, oy: 1000, sx: 110, sy: 34, x0: -4, x1: 3.2, y0: -10, y1: 10, k: 1, grid: true, xt: [-3, -2, -1, 1, 2], yt: [] });
        plot(Pf, -3.8, 2.75, Pl, { ymin: -10, ymax: 10 });
        [[-3, 'x + 3'], [-1, 'x + 1'], [2, 'x − 2']].forEach(([c, s], i) => fade(A(t, 19.8 + i * .5), () => { dot(Pl.X(c), Pl.Y(0), { r: 13, c: P.ac }); M(s, Pl.X(c), Pl.Y(0) + (i % 2 ? -40 : 70), 38, { c: P.ac, pass: true }); }));
        fade(A(t, 1.0), () => M(R`P(c) = 0 \;⇔\; (x − c) \t{ es factor}`, 540, 1440, 62, { id: 't' }));
      } },
    { id: 'sintetica', name: 'División sintética', dur: 45,
      caps: [[0.5, 9.0, 'SIN LAS x', 'Se escriben solo los', 'coeficientes: 1, 2, −5, −6.'], [9.4, 19.0, 'EL MÉTODO', 'Baja el primero; se multiplica', 'por 2 y se suma al siguiente.'],
        [19.4, 30.0, 'HASTA EL FINAL', '1, 4, 3 y al final 0:', 'el último es el residuo.'], [30.4, 44.4, 'EL COCIENTE', 'Los demás son sus coeficientes:', '$x^{2} + 4x + 3$.']],
      narr: [[0.5, 9.0, 'La división entre x menos c tiene una versión rapidísima. Se escriben solo los coeficientes en fila, y el c, que aquí es dos, a un lado.'],
        [9.4, 19.0, 'Se baja el primer coeficiente. Se multiplica por dos y se suma al siguiente. Se repite: multiplicar por dos y sumar.'],
        [19.4, 30.0, 'Uno; dos más dos, cuatro; menos cinco más ocho, tres; menos seis más seis, cero. El último número es el residuo.'],
        [30.4, 44.4, 'Los anteriores son los coeficientes del cociente, un grado menos: x al cuadrado más cuatro x más tres.']],
      ev: [[1.0, 'pops', 4], [9.8, 'tag'], [11.0, 'tag'], [13.0, 'tag'], [15.0, 'tag'], [19.8, 'card'], [30.8, 'yes']],
      draw(t) {
        const cs = [1, 2, -5, -6], mid = [null, 2, 8, 6], bot = [1, 4, 3, 0], x0 = 330, cw = 160, y0 = 680;
        fade(A(t, 1.0), () => { M('2', x0 - 120, y0, 60, { c: P.ac, pass: true }); line(x0 - 70, y0 - 60, x0 - 70, y0 + 140, { w: 4 }); line(x0 - 70, y0 + 140, x0 + 4 * cw - 40, y0 + 140, { w: 4 }); });
        cs.forEach((c, i) => fade(A(t, 1.0 + i * .2), () => M(c < 0 ? '−' + -c : String(c), x0 + i * cw, y0, 60, { pass: true })));
        bot.forEach((b, i) => { const tb = 9.8 + i * 2.0; fade(A(t, tb), () => M(String(b), x0 + i * cw, y0 + 220, 60, { c: i === 3 ? P.ac : P.ink, pass: true })); if (i < 3) fade(A(t, tb + 1.0), () => { M(String(mid[i + 1]), x0 + (i + 1) * cw, y0 + 110, 50, { c: P.mute, pass: true }); arrow(x0 + i * cw + 30, y0 + 190, x0 + (i + 1) * cw - 30, y0 + 130, { c: P.ac, w: 3, h: 14 }); }); });
        fade(A(t, 19.8), () => { circ(x0 + 3 * cw, y0 + 200, 54, { c: P.ac, w: 4 }); label('residuo', x0 + 3 * cw, y0 + 320, P.ac, { s: 34 }); });
        fade(A(t, 30.8), () => M(R`Q(x) = x^{2} + 4x + 3`, 540, 1300, 76, { id: 'q' }));
      } },
    { id: 'completa', name: 'Factorizar del todo', dur: 30,
      caps: [[0.5, 9.0, 'EL COCIENTE', '$x^{2} + 4x + 3 = (x + 1)(x + 3)$.', ''], [9.4, 19.0, 'TODO JUNTO', '$P(x) = (x − 2)(x + 1)(x + 3)$.', ''],
        [19.4, 29.4, 'SUS CEROS', '2, $−1$ y $−3$: los tres', 'cruces de la gráfica.']],
      narr: [[0.5, 9.0, 'El cociente es de grado dos y se factoriza con lo que ya sabemos: x más uno por x más tres.'],
        [9.4, 19.0, 'Así el polinomio queda totalmente factorizado: x menos dos, por x más uno, por x más tres.'],
        [19.4, 29.4, 'Y sus ceros son dos, menos uno y menos tres: los tres puntos donde la curva cruza el eje.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'pops', 3]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{2} + 4x + 3 = (x + 1)(x + 3)`, 540, 680, 70, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`P(x) = \hl{(x − 2)(x + 1)(x + 3)}`, 540, 860, 70, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`x = 2, \quad x = −1, \quad x = −3`, 540, 1040, 70, { id: 'c' }));
      } },
    { id: 'hallar', name: 'Hallar un coeficiente', dur: 29,
      caps: [[0.5, 9.0, 'UN DATO QUE FALTA', '$x^{3} + kx^{2} + x + 6$ tiene', 'el factor $x − 2$.'], [9.4, 19.0, 'ENTONCES $P(2) = 0$', '$8 + 4k + 2 + 6 = 0$.', ''],
        [19.4, 28.4, 'RESULTADO', '$4k = −16$, así que', '$k = −4$.']],
      narr: [[0.5, 9.0, 'El teorema también sirve al revés. Si se sabe que x menos dos es factor de este polinomio, se puede hallar k.'],
        [9.4, 19.0, 'Como x menos dos es factor, P de dos es cero: ocho más cuatro k más dos más seis igual a cero.'],
        [19.4, 28.4, 'Cuatro k es menos dieciséis, así que k es menos cuatro.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`P(x) = x^{3} + kx^{2} + x + 6`, 540, 680, 70, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`P(2) = 8 + 4k + 2 + 6 = 0`, 540, 860, 70, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`4k = −16 \;⇒\; k = \hl{−4}`, 540, 1040, 76, { id: 'c' }));
      } },
  ],
  sum: [['Teorema del residuo', R`P(c) = R`], ['Teorema del factor', R`P(c) = 0 \;⇔\; (x − c) \t{ es factor}`], ['División sintética', R`1, \; 2, \; −5, \; −6 \;→\; 1, \; 4, \; 3, \; \hl{0}`], ['Factorización', R`P(x) = (x − 2)(x + 1)(x + 3)`]],
  end: ['Reemplazar un número dice', 'si una división es exacta.'],
  finNarr: [[0.8, 7.0, 'En resumen: el residuo de dividir entre x menos c es P de c.'],
    [7.2, 14.2, 'Si es cero, x menos c es factor, y la división sintética da el cociente en un momento.']],
};
