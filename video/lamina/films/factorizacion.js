// Lección alg-24b · Factorización (mundo Álgebra de Polinomios).
// Factorizar = armar un rectángulo con las fichas (suma → producto); factor común; diferencia de cuadrados; trinomio x² + bx + c
// (producto y suma); con signos; trinomio cuadrado perfecto; cuando no se arma: completar el cuadrado; diferencia de cubos.
const R = String.raw;
const POSTER = 150;
const FILM = {
  lesson: 'alg-24b', world: 'polinomios', key: 'C', n: [4, 4],
  title: 'Factorización',
  next: 'Números complejos',
  intro: 'Factorizar es el camino de vuelta: dado el montón de fichas, encontrar el rectángulo y sus lados.',
  examples: ['4x² + 6x', 'x² − 9', 'x² + 7x + 12', 'x² − x − 12', 'x² + 10x + 25', 'x² + 2x + 5', 'x³ − 27'],
  scenes: [
    { id: 'idea', name: 'El camino de vuelta', dur: 30,
      caps: [[0.5, 9.0, 'MULTIPLICAR', 'De los lados al área:', '$(x + 3)(x + 4) → x^{2} + 7x + 12$.'], [9.4, 19.0, 'FACTORIZAR', 'Del área a los lados:', 'una suma se vuelve producto.'],
        [19.4, 29.4, 'LA PREGUNTA', 'Con estas fichas, qué', 'rectángulo se arma.']],
      narr: [[0.5, 9.0, 'Multiplicar dos binomios es ir de los lados de un rectángulo a su área.'],
        [9.4, 19.0, 'Factorizar es el camino de vuelta: se tiene el área, una suma, y se buscan los lados, un producto.'],
        [19.4, 29.4, 'Con fichas la pregunta es concreta: con este montón, qué rectángulo se puede armar.']],
      ev: [[1.0, 'pops', 12], [9.8, 'shuffle', 1.2], [19.8, 'tag']],
      draw(t) {
        const s = .78; X.save(); X.translate(330, 520); X.scale(s, s); areaModel(0, 40, 3, 4, { k: i => A(t, 1.0 + i * .08, .25), sa: A(t, 9.8) }); X.restore();
        fade(A(t, 1.0) * (1 - A(t, 9.4)), () => M(R`(x + 3)(x + 4) \;→\; x^{2} + 7x + 12`, 540, 1180, 62, { id: 'm' }));
        fade(A(t, 9.8), () => M(R`x^{2} + 7x + 12 \;→\; (x + 3)(x + 4)`, 540, 1180, 62, { id: 'f' }));
      } },
    { id: 'comun', name: 'Factor común', dur: 30,
      caps: [[0.5, 9.0, 'LO QUE SE REPITE', 'En $4x^{2} + 6x$, los dos', 'términos tienen $2x$.'], [9.4, 19.0, 'SE SACA', '$4x^{2} + 6x = 2x(2x + 3)$:', 'la distributiva al revés.'],
        [19.4, 29.4, 'SIEMPRE PRIMERO', 'Antes de cualquier otro', 'método, buscar factor común.']],
      narr: [[0.5, 9.0, 'El caso más sencillo es el factor común. En cuatro x al cuadrado más seis x, los dos términos tienen dos x.'],
        [9.4, 19.0, 'Se saca afuera: dos x por dos x más tres. Es la distributiva leída al revés. Se comprueba multiplicando.'],
        [19.4, 29.4, 'Es lo primero que se busca, siempre: deja un polinomio más pequeño para seguir.']],
      ev: [[1.0, 'rise'], [9.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\hl{2x} · 2x + \hl{2x} · 3`, 540, 700, 80, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`4x^{2} + 6x = \hl{2x}(2x + 3)`, 540, 900, 84, { id: 'b' }));
      } },
    { id: 'diferencia', name: 'Diferencia de cuadrados', dur: 31,
      caps: [[0.5, 9.0, 'UN CUADRADO MENOS OTRO', '$x^{2} − 9$: a un cuadrado', 'se le quita una esquina de 3.'], [9.4, 19.0, 'SE MUEVE LA TIRA', 'Queda un rectángulo:', '$(x + 3)(x − 3)$.'],
        [19.4, 30.4, 'LA REGLA', '$a^{2} − b^{2} = (a + b)(a − b)$.', '']],
      narr: [[0.5, 9.0, 'Equis al cuadrado menos nueve es un cuadrado de lado x al que se le quita una esquina de tres por tres.'],
        [9.4, 19.0, 'Como en los productos notables, la tira sobrante se pasa al lado y sale un rectángulo de x más tres por x menos tres.'],
        [19.4, 30.4, 'Siempre que se vea un cuadrado menos otro cuadrado, se factoriza como suma por diferencia.']],
      ev: [[1.0, 'draw', 1.0], [9.8, 'shuffle', 1.4], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{2} − 9`, 540, 720, 96, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`= (x + 3)(x − 3)`, 540, 900, 86, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`a^{2} − b^{2} = (a + b)(a − b)`, 540, 1120, 76, { id: 'g' }));
      } },
    { id: 'trinomio', name: 'Un trinomio', dur: 40,
      caps: [[0.5, 9.0, 'UN MONTÓN', '$x^{2} + 7x + 12$: 1 cuadrado,', '7 barras y 12 cuadritos.'], [9.4, 19.0, 'REPARTIR LAS BARRAS', 'Unas a la derecha, otras', 'abajo; el hueco, su producto.'],
        [19.4, 28.0, 'DOS NÚMEROS', 'Que sumen 7 y', 'multipliquen 12: 3 y 4.'], [28.4, 39.4, 'RESULTADO', '$x^{2} + 7x + 12$', '$= (x + 3)(x + 4)$.']],
      narr: [[0.5, 9.0, 'Ahora un trinomio: x al cuadrado más siete x más doce. Un cuadrado, siete barras y doce cuadritos.'],
        [9.4, 19.0, 'Para armar el rectángulo, las siete barras se reparten a la derecha y abajo. El hueco de la esquina pide tantos cuadritos como el producto de los dos grupos.'],
        [19.4, 28.0, 'Se necesitan dos números que sumen siete y multipliquen doce. Tres y cuatro.'],
        [28.4, 39.4, 'Entonces el rectángulo mide x más tres por x más cuatro.']],
      ev: [[1.0, 'pops', 20], [9.8, 'shuffle', 1.6], [19.8, 'tag'], [28.8, 'card']],
      draw(t) {
        const s = .72; X.save(); X.translate(320, 500); X.scale(s, s); areaModel(0, 60, 3, 4, { k: i => (t < 9.4 ? A(t, 1.0 + i * .06, .25) : A(t, 9.8 + i * .08, .25)), sa: A(t, 19.8) }); X.restore();
        if (t > 19.4) fade(A(t, 19.8), () => { [[1, 12], [2, 6], [3, 4]].forEach(([a, b], i) => { const ok = a + b === 7; M(`${a} · ${b} = 12, \\; ${a} + ${b} = ${a + b}`, 540, 1080 + i * 70, 44, { c: ok ? P.ac : P.mute, pass: true }); }); });
        fade(A(t, 28.8), () => M(R`x^{2} + 7x + 12 = \hl{(x + 3)(x + 4)}`, 540, 1380, 66, { id: 'r' }));
      } },
    { id: 'signos', name: 'Con signos', dur: 31,
      caps: [[0.5, 9.0, 'UN NEGATIVO', '$x^{2} − x − 12$: dos números', 'que multipliquen $−12$...'], [9.4, 19.0, '...Y SUMEN −1', '$−4$ y 3: $(−4)(3) = −12$', 'y $−4 + 3 = −1$.'],
        [19.4, 30.4, 'RESULTADO', '$(x − 4)(x + 3)$.', '']],
      narr: [[0.5, 9.0, 'Con signos negativos funciona igual. En x al cuadrado menos x menos doce, se buscan dos números que multipliquen menos doce.'],
        [9.4, 19.0, 'Y que sumen menos uno. Como el producto es negativo, uno es positivo y otro negativo: menos cuatro y tres.'],
        [19.4, 30.4, 'Queda x menos cuatro por x más tres. Al multiplicarlo se comprueba.']],
      ev: [[1.0, 'rise'], [9.8, 'tag'], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x^{2} − x − 12`, 540, 660, 90, { id: 'a' }));
        fade(A(t, 9.8), () => { M(R`(−4) · 3 = −12`, 540, 840, 64, { id: 'b' }); M(R`−4 + 3 = −1`, 540, 940, 64, { id: 'c' }); });
        fade(A(t, 19.8), () => M(R`= \hl{(x − 4)(x + 3)}`, 540, 1140, 84, { id: 'r' }));
      } },
    { id: 'perfecto', name: 'Trinomio cuadrado perfecto', dur: 29,
      caps: [[0.5, 9.0, 'SE ARMA UN CUADRADO', '$x^{2} + 10x + 25$: 5 barras', 'a cada lado y $5^{2}$ en la esquina.'], [9.4, 19.0, 'SE RECONOCE', 'Primero y último cuadrados;', 'el medio, el doble producto.'],
        [19.4, 28.4, 'RESULTADO', '$x^{2} + 10x + 25 = (x + 5)^{2}$.', '']],
      narr: [[0.5, 9.0, 'A veces el rectángulo es un cuadrado. En x al cuadrado más diez x más veinticinco, las barras se reparten cinco y cinco.'],
        [9.4, 19.0, 'Se reconoce porque el primero y el último son cuadrados, x al cuadrado y cinco al cuadrado, y el del medio es el doble de x por cinco.'],
        [19.4, 28.4, 'Es un trinomio cuadrado perfecto: x más cinco al cuadrado.']],
      ev: [[1.0, 'pops', 12], [9.8, 'tag'], [19.8, 'card']],
      draw(t) {
        const s = .55; X.save(); X.translate(360, 500); X.scale(s, s); areaModel(0, 60, 5, 5, { k: i => A(t, 1.0 + i * .05, .25) }); X.restore();
        fade(A(t, 9.8), () => M(R`\hl{x^{2}} + 2 · x · 5 + \hl{5^{2}}`, 540, 1080, 66, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`= (x + 5)^{2}`, 540, 1220, 80, { id: 'r' }));
      } },
    { id: 'completar', name: 'Cuando no se arma', dur: 37,
      caps: [[0.5, 9.0, '!NO SE ARMA', '$x^{2} + 2x + 5$: ningún par', 'suma 2 y multiplica 5.'], [9.4, 19.0, 'COMPLETAR EL CUADRADO', 'Las barras se reparten 1 y 1;', 'la esquina pide 1 cuadrito.'],
        [19.4, 28.0, 'SOBRAN 4', '$x^{2} + 2x + 5 = (x + 1)^{2} + 4$.', ''], [28.4, 36.4, 'PARA QUÉ', 'Esta forma servirá', 'para las parábolas.']],
      narr: [[0.5, 9.0, 'No todo montón se arma. En x al cuadrado más dos x más cinco, ningún par de enteros suma dos y multiplica cinco.'],
        [9.4, 19.0, 'Entonces se completa un cuadrado: las dos barras se reparten una y una, y la esquina necesita un solo cuadrito.'],
        [19.4, 28.0, 'De los cinco cuadritos se usa uno y sobran cuatro: x más uno al cuadrado más cuatro.'],
        [28.4, 36.4, 'Esa forma, un cuadrado más un número, será la llave de las parábolas en el próximo mundo.']],
      ev: [[1.0, 'no'], [9.8, 'draw', 1.2], [19.8, 'card'], [28.8, 'tag']],
      draw(t) {
        X.save(); X.translate(330, 520); X.scale(.9, .9); areaModel(0, 30, 1, 1, { k: i => A(t, 9.8 + i * .3, .3) }); X.restore();
        for (let i = 0; i < 4; i++) fade(A(t, 20.0 + i * .2), () => atile('1', 650 + i * 52, 710, { neg: false, fill: .3 }));
        fade(A(t, 21.0), () => label('sobran 4', 750, 800, P.ac, { s: 36 }));
        fade(A(t, 1.0), () => M(R`x^{2} + 2x + 5`, 540, 1100, 80, { id: 'a' }));
        fade(A(t, 19.8), () => M(R`= (x + 1)^{2} + 4`, 540, 1240, 80, { id: 'b' }));
      } },
    { id: 'cubos', name: 'Diferencia de cubos', dur: 29,
      caps: [[0.5, 9.0, 'CON CUBOS', '$a^{3} − b^{3} = (a − b)$', '$(a^{2} + ab + b^{2})$.'], [9.4, 19.0, 'EJEMPLO', '$x^{3} − 27 = (x − 3)$', '$(x^{2} + 3x + 9)$.'],
        [19.4, 28.4, 'COMPROBAR', 'Al multiplicar, los términos', 'del medio se cancelan.']],
      narr: [[0.5, 9.0, 'Una fórmula más: la diferencia de dos cubos se factoriza como la resta de las bases por un trinomio de tres términos.'],
        [9.4, 19.0, 'Equis al cubo menos veintisiete es x al cubo menos tres al cubo: x menos tres por x al cuadrado más tres x más nueve.'],
        [19.4, 28.4, 'Al multiplicar, los términos del medio se cancelan de a dos y quedan solo x al cubo y menos veintisiete.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'cut']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`a^{3} − b^{3} = (a − b)(a^{2} + ab + b^{2})`, 540, 680, 64, { id: 'g' }));
        fade(A(t, 9.8), () => M(R`x^{3} − 27 = (x − 3)(x^{2} + 3x + 9)`, 540, 860, 64, { id: 'e' }));
        fade(A(t, 19.8), () => M(R`x^{3} \no{+ 3x^{2}} \no{+ 9x} \no{− 3x^{2}} \no{− 9x} − 27`, 540, 1060, 58, { id: 'c' }));
      } },
  ],
  sum: [['Factor común', R`4x^{2} + 6x = 2x(2x + 3)`], ['Diferencia de cuadrados', R`a^{2} − b^{2} = (a + b)(a − b)`], ['Trinomio', R`x^{2} + 7x + 12 = (x + 3)(x + 4)`], ['Cuadrado perfecto', R`x^{2} + 10x + 25 = (x + 5)^{2}`],
    ['Completar el cuadrado', R`x^{2} + 2x + 5 = (x + 1)^{2} + 4`], ['Diferencia de cubos', R`a^{3} − b^{3} = (a − b)(a^{2} + ab + b^{2})`]],
  end: ['Factorizar es encontrar', 'los lados del rectángulo.'],
  finNarr: [[0.8, 10.4, 'En resumen: factorizar convierte una suma en un producto. Primero se busca factor común, luego las fórmulas.'],
    [10.6, 17.6, 'En un trinomio se buscan dos números que sumen y multipliquen lo pedido, y si no hay, se completa el cuadrado.']],
};
