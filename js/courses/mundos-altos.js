// Mundos altos de Álgebra (spec 2026-11-19-mundos-altos): Taller de los Bloques (`polinomios`), Fuente de la Parábola
// (`cuadraticas`), Cordillera Cúbica (`grado-superior`), Río de Asíntotas (`racionales`) y Selva Exponencial (`exp-log`).
// Este archivo va después de `algebra.js` y pone a esos mundos sus ejercicios nuevos (sin opción múltiple, sin teclear,
// todos con pista), su jefe final (`jefe-ruta`) y su evaluación. Las lecciones `alg-4a`, `alg-13b` y `alg-73` ya eran
// juegos y se quedan como están en `algebra.js`; las demás lecciones de estos mundos toman sus ejercicios de AQUÍ.

(() => {
  const P = (game, q, params, explain, hint) => play(game, q, params, explain, { hint });
  const cuenta = (q, sol, traps, explain, hint, unit) => {
    const s = sol.split(' '), v = GAMES['arma-la-cuenta'].evaluate(s);
    return P('arma-la-cuenta', q, { rounds: [{ sol: s, traps, answer: v, tol: 1e-9 * Math.max(1, Math.abs(v)), ...(unit ? { unit } : {}) }] }, explain, hint);
  };
  const escala = (q, levels, explain, hint) => P('escala-solucion', q, { rounds: [{ levels }] }, explain, hint);
  const parejas = (q, left, right, explain, hint) => P('une-parejas', q, { left, right, pairs: left.map((_, i) => [i, i]) }, explain, hint);
  const U = w => COURSE_ALGEBRA.units.find(u => u.world === w);
  const EX = {}, BOSS = {}, EXAM = {};

  // ====================== Taller de los Bloques ======================
  EX['alg-23a'] = [
    escala('Halla el **grado** de $P(x) = 7x^2 - 3x^5 + x - 9$',
      [['Ordena: −3x⁵ + 7x² + x − 9', 'El primer término manda: 7x²'], ['El mayor exponente es 5', 'El mayor coeficiente es 7', 'Hay 4 términos'], ['grado 5', 'grado 7', 'grado 4']],
      'El grado es el mayor exponente de la variable, sin importar en qué orden estén escritos los términos ni qué coeficientes tengan: aquí es 5.',
      'No mires los números que multiplican ni cuántos términos hay: busca la potencia más alta de x.'),
    parejas('Une cada operación con su resultado',
      ['(3x² + 2x) + (x² − 5x)', '(3x² + 2x) − (x² − 5x)', '2x · (x² − 5x)', '(x + 2)(x − 5)'],
      ['4x² − 3x', '2x² + 7x', '2x³ − 10x²', 'x² − 3x − 10', '2x² − 3x', 'x² − 7x − 10'],
      'Se suman y se restan términos semejantes (al restar, el signo cambia a **todo** el paréntesis). Al multiplicar, cada término multiplica a cada término y los exponentes se suman.',
      'En la resta, cambia el signo de los dos términos del segundo paréntesis antes de juntar. En los productos, reparte término por término.'),
    cuenta('Si $\\operatorname{gr}P = 4$ y $\\operatorname{gr}Q = 3$, ¿cuál es el grado del producto $P \\cdot Q$?', '4 + 3', ['12', '1'],
      'Al multiplicar, los términos de mayor grado se multiplican entre sí y sus exponentes se **suman**: $x^4 \\cdot x^3 = x^7$.',
      'Piensa en los términos más altos de cada uno, x⁴ y x³: ¿qué le pasa a los exponentes al multiplicar potencias de la misma base?'),
    cuenta('Valor numérico de $2x^2 - 5x + 1$ en $x = 3$', '2 * 3 ^ 2 - 5 * 3 + 1', [],
      'Se reemplaza $x$ por 3 en cada lugar: $2 \\cdot 9 - 15 + 1 = 4$.',
      'Cambia cada x por 3 y respeta el orden: primero la potencia, luego los productos y al final sumas y restas.'),
    escala('Con $P = 2x^3 - x + 4$ y $Q = x^2 + 3x - 1$, calcula $P - 2Q$',
      [['−2Q = −2x² − 6x + 2', '−2Q = −2x² + 6x − 2', '−2Q = −2x² − 6x − 2'], ['2x³ − 2x² − 7x + 6', '2x³ − 2x² − 5x + 6', '2x³ − 2x² − 7x + 2']],
      'El $-2$ multiplica a cada término de $Q$ y le cambia el signo: $-2x^2 - 6x + 2$. Luego se juntan semejantes con $P$: $-x - 6x = -7x$ y $4 + 2 = 6$.',
      'Reparte el −2 a los tres términos de Q, uno por uno, antes de juntar con P. El último término de Q es negativo: ¿qué signo le queda?'),
  ];
  EX['alg-3'] = [
    P('bloques-area', 'Cada producto es un rectángulo. Di cuántas **barras** $x$ y cuántos **cuadritos** tiene', { rounds: [{ mode: 'expand', a: 2, b: 5 }, { mode: 'expand', a: 4, b: 4 }, { mode: 'expand', a: 1, b: 7 }] },
      '$(x + a)(x + b) = x^2 + (a + b)x + ab$: las barras son $a + b$ y los cuadritos de la esquina son $a \\cdot b$. Con $a = b = 4$ sale un cuadrado perfecto: $x^2 + 8x + 16$.',
      'Las barras se reparten a la derecha y abajo del cuadrado grande; los cuadritos llenan la esquina, que es un rectángulo pequeño de a por b.'),
    parejas('Une cada producto notable con su desarrollo',
      ['(x + 4)²', '(x − 4)²', '(x + 4)(x − 4)', '(2x + 3)²'],
      ['x² + 8x + 16', 'x² − 8x + 16', 'x² − 16', '4x² + 12x + 9', 'x² + 16', '4x² + 9'],
      'Cuadrado de un binomio: los dos cuadrados **más el doble producto**. Suma por diferencia: diferencia de cuadrados, sin término del medio.',
      'El cuadrado de un binomio siempre tiene tres términos. Solo la suma por la diferencia deja dos.'),
    escala('Desarrolla $(x - 6)^2$',
      [['(a − b)² = a² − 2ab + b²', '(a − b)² = a² − b²', '(a − b)² = a² + 2ab + b²'], ['x² − 2·x·6 + 6²', 'x² − 6²'], ['x² − 12x + 36', 'x² − 36', 'x² − 6x + 36']],
      'El doble producto es $2 \\cdot x \\cdot 6 = 12x$ y lleva el signo del binomio; el último término es un cuadrado, así que es positivo.',
      'Elevar al cuadrado es multiplicar el binomio por sí mismo: salen dos productos cruzados iguales, no ninguno.'),
    cuenta('Si $(x + k)^2 = x^2 + 14x + 49$, ¿cuánto vale $k$?', '14 / 2', ['49'],
      'El término del medio es el doble producto $2kx = 14x$, así que $k = 7$ (y en efecto $7^2 = 49$).',
      'El 14 que acompaña a x no es k: es el doble de k.'),
    cuenta('Calcula $103 \\cdot 97$ **sin multiplicar directo**: es $(100 + 3)(100 - 3)$', '100 ^ 2 - 3 ^ 2', ['6'],
      'Suma por diferencia: $100^2 - 3^2 = 10\\,000 - 9 = 9991$.',
      'Una suma por una diferencia de los mismos números es una resta de cuadrados.'),
  ];
  EX['alg-24c'] = [
    cuenta('Calcula el número combinatorio $\\binom{6}{2}$', '6 * 5 / 2', ['3', '4'],
      '$\\binom{6}{2} = \\dfrac{6 \\cdot 5}{2 \\cdot 1} = 15$: es el tercer número de la fila 6 del triángulo de Pascal.',
      'Arriba van dos factores que bajan desde 6; abajo, los dos factores de 2 · 1.'),
    escala('Construye la **fila 4** del triángulo de Pascal',
      [['Cada número es la suma de los dos de arriba', 'Cada número es el producto de los dos de arriba'], ['Fila 3: 1, 3, 3, 1', 'Fila 3: 1, 2, 2, 1'], ['Fila 4: 1, 4, 6, 4, 1', 'Fila 4: 1, 4, 4, 4, 1', 'Fila 4: 1, 3, 6, 3, 1']],
      'Los bordes son 1 y cada número de adentro es la suma de los dos que tiene encima: $1 + 3 = 4$, $3 + 3 = 6$, $3 + 1 = 4$.',
      'Empieza y termina con 1. Para el del centro, suma los dos números del centro de la fila anterior.'),
    parejas('Une cada potencia de un binomio con su desarrollo',
      ['(x + 1)³', '(x − 1)³', '(x + 2)³', '(x + 1)⁴'],
      ['x³ + 3x² + 3x + 1', 'x³ − 3x² + 3x − 1', 'x³ + 6x² + 12x + 8', 'x⁴ + 4x³ + 6x² + 4x + 1', 'x³ + 1', 'x³ + 2x² + 4x + 8'],
      'Los coeficientes salen de Pascal (1, 3, 3, 1 y 1, 4, 6, 4, 1). Con resta, los signos se alternan; con $+2$, cada término lleva además una potencia de 2: $3 \\cdot 2 = 6$, $3 \\cdot 4 = 12$, $8$.',
      'Cuenta los términos: una potencia n tiene n + 1. Luego mira los signos y el último término, que es el segundo número elevado a n.'),
    cuenta('Coeficiente de $x^2$ en $(x + 3)^4$', '6 * 3 ^ 2', ['4', '12'],
      'El término con $x^2$ es $\\binom{4}{2}x^2 \\cdot 3^2 = 6 \\cdot 9\\,x^2 = 54x^2$.',
      'En la fila 4 de Pascal (1, 4, 6, 4, 1) el coeficiente del término con x² es el del centro. Los exponentes de x y de 3 suman 4.'),
    cuenta('¿Cuánto suman todos los coeficientes de $(a + b)^5$?', '2 ^ 5', ['10', '6'],
      'Con $a = b = 1$ el desarrollo es justo la suma de los coeficientes: $(1 + 1)^5 = 32$. Cada fila de Pascal suma el doble de la anterior.',
      'Prueba con las primeras filas: 1 + 1, luego 1 + 2 + 1, luego 1 + 3 + 3 + 1. ¿Qué patrón siguen esas sumas?'),
  ];
  EX['alg-24b'] = [
    P('bloques-area', 'Factorizar es encontrar los **lados** del rectángulo. Elige $a$ y $b$ para armar cada área', { rounds: [{ mode: 'factor', a: 2, b: 3 }, { mode: 'factor', a: 1, b: 6 }, { mode: 'factor', a: 3, b: 3 }, { mode: 'factor', a: 2, b: 7 }] },
      'Se buscan dos números que **sumen** el coeficiente de $x$ y **multipliquen** el término independiente: $x^2 + 5x + 6 = (x + 2)(x + 3)$, $x^2 + 7x + 6 = (x + 1)(x + 6)$, $x^2 + 6x + 9 = (x + 3)^2$ y $x^2 + 9x + 14 = (x + 2)(x + 7)$.',
      'Empieza por los cuadritos: ¿de qué maneras se puede armar ese número como un rectángulo de a por b? Quédate con la que además da las barras.'),
    escala('Factoriza **por completo** $x^4 - 16$',
      [['(x² − 4)(x² + 4)', '(x² − 4)²', '(x² − 8)(x² + 8)'], ['(x − 2)(x + 2)(x² + 4)', '(x − 2)(x + 2)(x − 2)(x + 2)'], ['x² + 4 ya no se parte en los reales', 'x² + 4 = (x + 2)²']],
      'Es una diferencia de cuadrados dos veces: $x^4 - 16 = (x^2 - 4)(x^2 + 4)$ y $x^2 - 4 = (x - 2)(x + 2)$. La suma de cuadrados $x^2 + 4$ no se factoriza con números reales.',
      'x⁴ es el cuadrado de x² y 16 es el cuadrado de 4. Después revisa si alguno de los factores todavía es una diferencia de cuadrados.'),
    parejas('Une cada polinomio con su factorización',
      ['x² − 49', 'x² − 14x + 49', 'x³ − 8', 'x² + 5x − 14', '3x² + 6x'],
      ['(x − 7)(x + 7)', '(x − 7)²', '(x − 2)(x² + 2x + 4)', '(x + 7)(x − 2)', '3x(x + 2)', '(x − 2)³', '(x − 7)(x + 2)'],
      'Diferencia de cuadrados, trinomio cuadrado perfecto, diferencia de cubos ($a^3 - b^3 = (a - b)(a^2 + ab + b^2)$), trinomio $x^2 + sx + p$ y factor común.',
      'Cuenta los términos y mira los signos: dos términos con resta de cuadrados o de cubos; tres términos, trinomio. Si todos comparten un factor, sácalo primero.'),
    escala('Factoriza $2x^2 + 7x + 3$',
      [['Busca dos números: producto 6, suma 7', 'Busca dos números: producto 3, suma 7'], ['2x² + 6x + x + 3', '2x² + 3x + 4x + 3'], ['2x(x + 3) + (x + 3)', 'x(2x + 3) + (4x + 3)'], ['(2x + 1)(x + 3)', '(2x + 3)(x + 1)']],
      'Con coeficiente principal 2 se buscan dos números de producto $2 \\cdot 3 = 6$ y suma 7: son 6 y 1. Se parte el término del medio, se agrupa y sale el factor común $(x + 3)$.',
      'Cuando x² lleva un número, el producto que buscas es ese número por el término independiente. Comprueba al final multiplicando los dos factores.'),
    P('completa-cuadrado', 'Pasa cuadritos a la esquina hasta **completar el cuadrado** de cada polinomio', { rounds: [{ b: 6, c: 13 }, { b: 4, c: 1 }, { b: 8, c: 10 }] },
      'La esquina necesita $(b/2)^2$ cuadritos: $x^2 + 6x + 13 = (x + 3)^2 + 4$, $x^2 + 4x + 1 = (x + 2)^2 - 3$ y $x^2 + 8x + 10 = (x + 4)^2 - 6$.',
      'La mitad de las barras va a cada lado del cuadrado; el hueco de la esquina mide esa mitad por esa mitad. Lo que sobre o falte queda afuera.'),
  ];
  BOSS.polinomios = { id: 'jefe-alg-polinomios', name: 'el Maestro del Taller', color: 'sky', title: 'El Maestro del Taller',
    intro: ['Al fondo del taller trabaja el **Maestro**. Solo deja salir a quien sepa armar y desarmar polinomios.', 'No gana el más rápido: arma la ruta de pasos, de abajo hacia arriba, y ataca. Un paso falso te cuesta un corazón.'],
    phases: [
      ['Fase 1 · Productos notables', [
        ['(x + 3)(x − 3) − x²', [['x² − 9 − x²', 'x² + 9 − x²', 'x² − 6x + 9 − x²'], ['−9', '9', '−6x + 9']]],
        ['(x + 2)² − (x − 2)²', [['x² + 4x + 4 − (x² − 4x + 4)', 'x² + 4 − (x² − 4)', 'x² + 4x + 4 − (x² + 4x + 4)'], ['8x', '8', '0']]],
      ]],
      ['Fase 2 · Binomio de Newton', [
        ['Coeficiente de x³ en (x + 2)⁵', [['El término es C(5, 2) · x³ · 2²', 'El término es C(5, 3) · x³ · 2³', 'El término es 5 · x³ · 2'], ['10 · 4', '10 · 8'], ['40', '80', '10']]],
        ['Desarrolla (x − 1)⁴', [['Coeficientes 1, 4, 6, 4, 1', 'Coeficientes 1, 4, 4, 4, 1'], ['Los signos se alternan: + − + − +', 'Todos los signos son −', 'Todos los signos son +'], ['x⁴ − 4x³ + 6x² − 4x + 1', 'x⁴ − 4x³ − 6x² − 4x − 1', 'x⁴ + 4x³ + 6x² + 4x + 1']]],
      ]],
      ['Fase 3 · Factorización', [
        ['Factoriza x² − 2x − 15', [['Dos números: producto −15, suma −2', 'Dos números: producto −15, suma 2', 'Dos números: producto 15, suma −2'], ['−5 y 3', '5 y −3'], ['(x − 5)(x + 3)', '(x + 5)(x − 3)']]],
        ['Factoriza 3x³ − 12x', [['Factor común: 3x(x² − 4)', 'Factor común: 3(x³ − 4)', 'Factor común: x(3x² − 12x)'], ['3x(x − 2)(x + 2)', '3x(x − 2)²']]],
      ]],
    ] };
  EXAM.polinomios = { id: 'exam-alg-polinomios', title: 'Polinomios: productos notables y factorización', items: [
    ['alg-23a', 'El valor numérico sale de reemplazar la variable; un número negativo se eleva con su paréntesis.',
      cuenta('Valor numérico de $x^2 - 4x + 7$ en $x = -2$', '( -2 ) ^ 2 - 4 * -2 + 7', [], '$(-2)^2 - 4(-2) + 7 = 4 + 8 + 7 = 19$.', 'Al reemplazar un negativo, ponlo entre paréntesis: su cuadrado es positivo y menos por menos da más.')],
    ['alg-3', 'El cuadrado de un binomio tiene tres términos: los dos cuadrados y el doble producto.',
      escala('Desarrolla $(3x - 2)^2$', [['(3x)² − 2·3x·2 + 2²', '(3x)² − 2²', '3x² − 2·3x·2 + 2²'], ['9x² − 12x + 4', '9x² − 4', '3x² − 12x + 4']], '$(3x)^2 = 9x^2$, el doble producto es $12x$ con signo menos y $2^2 = 4$.', 'El cuadrado alcanza también al 3 de 3x. Y no olvides el término del medio.')],
    ['alg-24c', 'Los coeficientes del binomio son los números combinatorios, que forman el triángulo de Pascal.',
      cuenta('Calcula $\\binom{7}{2}$', '7 * 6 / 2', ['5', '14'], '$\\binom{7}{2} = \\dfrac{7 \\cdot 6}{2} = 21$.', 'Dos factores que bajan desde 7, divididos entre 2 · 1.')],
    ['alg-24b', 'Para factorizar $x^2 + sx + p$ se buscan dos números de suma $s$ y producto $p$.',
      P('bloques-area', 'Elige $a$ y $b$ para armar el rectángulo del polinomio', { rounds: [{ mode: 'factor', a: 4, b: 5 }] }, '$x^2 + 9x + 20 = (x + 4)(x + 5)$: $4 + 5 = 9$ y $4 \\cdot 5 = 20$.', 'Piensa en las parejas de números que multiplicadas dan los cuadritos y elige la que suma las barras.')],
    ['alg-24b', 'Suma de cubos: $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$; el signo del medio es el contrario.',
      escala('Factoriza $x^3 + 27$', [['Suma de cubos con a = x y b = 3', 'Diferencia de cubos con a = x y b = 3', 'Cubo de una suma: (x + 3)³'], ['(x + 3)(x² − 3x + 9)', '(x + 3)(x² + 3x + 9)', '(x + 3)(x² + 9)']], '$27 = 3^3$, y $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$: $(x + 3)(x^2 - 3x + 9)$.', 'El primer factor lleva el mismo signo del polinomio; en el segundo, el término del medio lleva el contrario.')],
  ] };

  // ====================== Fuente de la Parábola ======================
  EX['alg-23c'] = [
    cuenta('Calcula $(3 + 4i)(3 - 4i)$', '3 ^ 2 + 4 ^ 2', ['7', '12'],
      'Un complejo por su conjugado da la suma de los cuadrados: $9 - 16i^2 = 9 + 16 = 25$, porque $i^2 = -1$.',
      'Es una suma por una diferencia: a² − (bi)². Recuerda qué vale i² y qué le hace al signo.'),
    escala('Multiplica $(2 + 3i)(1 - i)$',
      [['2 − 2i + 3i − 3i²', '2 − 2i + 3i + 3i²'], ['i² = −1', 'i² = 1'], ['5 + i', '−1 + i', '5 − i']],
      'Se reparte como con binomios: $2 - 2i + 3i - 3i^2$. Como $i^2 = -1$, el último término vale $+3$: queda $5 + i$.',
      'Reparte cada término y fíjate en el signo de 3i por −i. Luego cambia i² por su valor.'),
    cuenta('Módulo del complejo $z = 6 - 8i$', 'r ( 6 ^ 2 + ( -8 ) ^ 2 )', ['14'],
      '$|z| = \\sqrt{6^2 + (-8)^2} = \\sqrt{100} = 10$: es la distancia del punto $(6, -8)$ al origen.',
      'El complejo es un punto del plano: su módulo es la hipotenusa del triángulo que forman sus dos partes.'),
    escala('Escribe en forma estándar $\\dfrac{4 + 2i}{1 + i}$',
      [['Multiplica arriba y abajo por 1 − i', 'Multiplica arriba y abajo por 1 + i', 'Divide parte real e imaginaria por separado'], ['(6 − 2i) ÷ 2', '(2 + 6i) ÷ 2', '(6 − 2i) ÷ 0'], ['3 − i', '1 + 3i', '6 − 2i']],
      'Se multiplica por el conjugado del denominador: abajo queda $1 + 1 = 2$ y arriba $(4 + 2i)(1 - i) = 6 - 2i$. Al dividir entre 2: $3 - i$.',
      'Para quitar la i del denominador se usa su conjugado: el mismo número con el signo de la parte imaginaria cambiado.'),
    parejas('Une cada expresión con su valor',
      ['i²', 'i³', 'i⁴', 'i⁹', '√(−25)'], ['−1', '−i', '1', 'i', '5i', '−5', '25i'],
      'Las potencias de $i$ se repiten de cuatro en cuatro: $i, -1, -i, 1$. Como $9 = 8 + 1$, $i^9 = i$. Y $\\sqrt{-25} = \\sqrt{25}\\,\\sqrt{-1} = 5i$.',
      'Cada vez que juntas cuatro i obtienes 1. Divide el exponente entre 4 y mira lo que sobra.'),
  ];
  EX['alg-1'] = [
    escala('Resuelve $3x - 7 = 11$',
      [['3x = 11 + 7', '3x = 11 − 7'], ['x = 18 ÷ 3', 'x = 18 − 3', 'x = 4 ÷ 3'], ['x = 6', 'x = 15']],
      'Para dejar sola a $x$ se deshace cada operación con su contraria, en los dos lados: se suma 7 y luego se divide entre 3.',
      'Lo que resta pasa haciendo lo contrario en los dos lados. El 3 no está restando: está multiplicando.'),
    escala('Resuelve $4(x - 1) = 2x + 10$',
      [['4x − 4 = 2x + 10', '4x − 1 = 2x + 10'], ['2x = 14', '2x = 6', '6x = 14'], ['x = 7', 'x = 3']],
      'El 4 multiplica a los dos términos del paréntesis. Luego se juntan las $x$ a un lado ($4x - 2x$) y los números al otro ($10 + 4$).',
      'Primero quita el paréntesis repartiendo el 4 a todo. Después lleva las x a un lado restando 2x en los dos.'),
    P('balanza-exponencial', 'Mueve $x$ hasta que los dos lados de la ecuación **pesen lo mismo**', { rounds: [
      { tex: '2x + 3 = x + 8', txt: '2x + 3 = x + 8', L: x => 2 * x + 3, R: x => x + 8, x: 5 },
      { tex: '5 - x = 2x - 4', txt: '5 − x = 2x − 4', L: x => 5 - x, R: x => 2 * x - 4, x: 3 },
      { tex: '\\tfrac{x}{2} + 1 = 4', txt: 'x/2 + 1 = 4', L: x => x / 2 + 1, R: () => 4, x: 6 },
    ] }, 'Resolver una ecuación es hallar el valor que equilibra los dos lados: $x = 5$, $x = 3$ y $x = 6$.',
      'Mira hacia qué lado cae la balanza: si pesa más el lado que crece más rápido con x, baja x; si no, súbela. Luego comprueba despejando.'),
    escala('Un número, más su doble, más 6, da 30. ¿Qué número es?',
      [['x + 2x + 6 = 30', 'x + 2 + 6 = 30', '2x + 6 = 30'], ['3x = 24', '3x = 36'], ['x = 8', 'x = 12']],
      'El doble del número es $2x$: $x + 2x + 6 = 30$, luego $3x = 24$ y $x = 8$. Se comprueba: $8 + 16 + 6 = 30$.',
      'Llama x al número y traduce frase por frase: «su doble» es dos veces x, no el número 2.'),
    cuenta('Ana tiene 3 años más que Beto y entre los dos suman 21. ¿Cuántos años tiene **Beto**?', '( 21 - 3 ) / 2', ['12'],
      'Si Beto tiene $x$, Ana tiene $x + 3$: $2x + 3 = 21$, así que $x = 9$.',
      'Quita primero los 3 años de ventaja de Ana: lo que queda se reparte por igual entre los dos.', 'años'),
  ];
  EX['alg-4'] = [
    P('raices-imanes', 'Pon los imanes en las **raíces** de cada parábola y ajusta $a$ para calcarla', { rounds: [
      { roots: [1, 4], a: 1, xr: [-2, 7], yr: [-4, 6], mark: [0, 4] },
      { roots: [-3, 1], a: -1, xr: [-5, 3], yr: [-3, 6], mark: [0, 3] },
      { roots: [2, 2], a: 1, xr: [-1, 5], yr: [-2, 6], mark: [0, 4] },
    ] }, '1) $y = (x - 1)(x - 4)$. 2) $y = -(x + 3)(x - 1)$, que abre hacia abajo. 3) $y = (x - 2)^2$: toca el eje en un solo punto, una raíz doble.',
      'Las raíces son los cortes con el eje x; cada una da un factor (x − r). Si la curva solo toca el eje y se devuelve, la raíz va dos veces.'),
    cuenta('Discriminante $b^2 - 4ac$ de $x^2 + 4x + 7$', '4 ^ 2 - 4 * 1 * 7', ['2'],
      '$\\Delta = 16 - 28 = -12$. Como es negativo, la ecuación $x^2 + 4x + 7 = 0$ no tiene raíces reales.',
      'Identifica a, b y c en orden: el número de x², el de x y el que va solo.'),
    escala('¿Cuántas raíces reales tiene $2x^2 - 3x + 5 = 0$?',
      [['Δ = (−3)² − 4·2·5', 'Δ = −3² − 4·2·5', 'Δ = (−3)² + 4·2·5'], ['Δ = −31', 'Δ = 49', 'Δ = −49'], ['No hay raíces reales', 'Dos raíces reales distintas', 'Una raíz doble']],
      '$\\Delta = 9 - 40 = -31 < 0$: la parábola no toca el eje $x$, así que no hay raíces reales (son dos complejas conjugadas).',
      'El signo del discriminante decide: positivo, dos raíces; cero, una doble; negativo, ninguna real. Ojo con el cuadrado de −3.'),
    escala('Resuelve $x^2 - 6x + 4 = 0$ con la fórmula general',
      [['x = (6 ± √(36 − 16)) ÷ 2', 'x = (−6 ± √(36 − 16)) ÷ 2', 'x = (6 ± √(36 + 16)) ÷ 2'], ['x = (6 ± 2√5) ÷ 2', 'x = (6 ± √20) ÷ 4'], ['x = 3 ± √5', 'x = 3 ± 2√5', 'x = 6 ± √5']],
      'Con $a = 1$, $b = -6$, $c = 4$: $x = \\dfrac{6 \\pm \\sqrt{20}}{2}$. Como $\\sqrt{20} = 2\\sqrt5$, al dividir todo entre 2 queda $3 \\pm \\sqrt5$.',
      'En la fórmula va −b, y b ya es negativo. Al simplificar, el 2 de abajo divide a los dos términos de arriba.'),
    escala('Un rectángulo tiene área 40 y su largo mide 3 más que su ancho. ¿Cuánto miden?',
      [['x(x + 3) = 40', 'x + (x + 3) = 40', 'x · 3x = 40'], ['x² + 3x − 40 = 0', 'x² + 3x + 40 = 0'], ['(x + 8)(x − 5) = 0', '(x − 8)(x + 5) = 0'], ['ancho 5 y largo 8', 'ancho 8 y largo 11']],
      'Si el ancho es $x$, el largo es $x + 3$ y el área $x(x + 3) = 40$. La ecuación da $x = 5$ o $x = -8$; una medida no puede ser negativa.',
      'El área es ancho por largo, no la suma. Al final descarta la solución que no puede ser una medida.'),
  ];
  BOSS.cuadraticas = { id: 'jefe-alg-cuadraticas', name: 'el Guardián de la Fuente', color: 'mint', title: 'El Guardián de la Fuente',
    intro: ['En el centro de la fuente vive su **Guardián**. Para pasar hay que dominar los complejos, las rectas y las parábolas.', 'Arma cada respuesta paso a paso y ataca cuando la ruta esté completa. Aquí se piensa, no se corre.'],
    phases: [
      ['Fase 1 · Números complejos', [
        ['(1 + i)²', [['1 + 2i + i²', '1 + i²', '1 + 2i − i²'], ['2i', '0', '2 + 2i']]],
        ['Raíces de x² + 9 = 0', [['x² = −9', 'x² = 9'], ['x = ±3i', 'x = ±3', 'x = ±9i']]],
      ]],
      ['Fase 2 · Rectas y parábolas', [
        ['Vértice de y = x² − 6x + 5', [['h = −b ÷ 2a = 3', 'h = b ÷ 2a = −3', 'h = −b ÷ a = 6'], ['k = 9 − 18 + 5 = −4', 'k = 9 + 18 + 5 = 32'], ['V(3, −4)', 'V(−3, 32)', 'V(3, 4)']]],
        ['Resuelve 5 − 2(x + 1) = 9', [['5 − 2x − 2 = 9', '5 − 2x + 2 = 9', '3(x + 1) = 9'], ['−2x = 6', '−2x = 2', '2x = 6'], ['x = −3', 'x = 3', 'x = −1']]],
      ]],
      ['Fase 3 · Ecuaciones cuadráticas', [
        ['Resuelve x² − x − 12 = 0', [['(x − 4)(x + 3) = 0', '(x + 4)(x − 3) = 0', '(x − 6)(x + 2) = 0'], ['x = 4  o  x = −3', 'x = −4  o  x = 3']]],
        ['¿Cuántas raíces reales tiene x² + 2x + 1 = 0?', [['Δ = 4 − 4 = 0', 'Δ = 4 + 4 = 8', 'Δ = 2 − 4 = −2'], ['Una raíz doble: x = −1', 'Dos raíces distintas', 'Ninguna raíz real']]],
      ]],
    ] };
  EXAM.cuadraticas = { id: 'exam-alg-cuadraticas', title: 'Números complejos y ecuaciones cuadráticas', items: [
    ['alg-23c', 'Un complejo por su conjugado da $a^2 + b^2$, porque $i^2 = -1$.',
      cuenta('Calcula $(2 - i)(2 + i)$', '2 ^ 2 + 1 ^ 2', ['3'], 'Suma por diferencia: $4 - i^2 = 4 + 1 = 5$.', 'Suma por diferencia, y luego el valor de i² cambia el signo.')],
    ['alg-1', 'Para despejar se hace la misma operación en los dos lados; un número que multiplica a un paréntesis se reparte a todos sus términos.',
      escala('Resuelve $2(x + 3) = x - 4$', [['2x + 6 = x − 4', '2x + 3 = x − 4'], ['x = −10', 'x = −7', 'x = 2']], '$2x + 6 = x - 4$, así que $x = -10$.', 'Reparte el 2 a los dos términos del paréntesis antes de juntar las x.')],
    ['alg-4a', 'El vértice de $y = ax^2 + bx + c$ está en $h = -\\tfrac{b}{2a}$ y $k$ es el valor de la función en $h$.',
      P('mueve-parabola', 'Pon el vértice y la abertura para que tu parábola sea la de la ecuación', { rounds: [{ a: 1, b: -6, c: 8 }] }, '$x^2 - 6x + 8 = (x - 3)^2 - 1$: vértice $(3, -1)$ y abertura 1.', 'La primera coordenada del vértice es −b entre 2a; la segunda sale de evaluar ahí.')],
    ['alg-4', 'El discriminante $b^2 - 4ac$ dice cuántas raíces reales hay.',
      cuenta('Discriminante de $3x^2 - 2x - 1$', '( -2 ) ^ 2 - 4 * 3 * -1', [], '$4 + 12 = 16$: positivo, dos raíces reales.', 'Cuida los signos: b es negativo y c también.')],
    ['alg-4', 'Si un producto es cero, alguno de los factores es cero.',
      escala('Resuelve $x^2 + 2x - 8 = 0$', [['(x + 4)(x − 2) = 0', '(x − 4)(x + 2) = 0'], ['x = −4  o  x = 2', 'x = 4  o  x = −2']], 'Dos números de producto $-8$ y suma $2$: $4$ y $-2$. Cada factor igualado a cero da una raíz.', 'La raíz tiene el signo contrario al número del factor.')],
  ] };

  // ====================== Cordillera Cúbica ======================
  EX['alg-23b'] = [
    escala('Divide $(x^2 + 7x + 12) \\div (x + 3)$',
      [['x² + 7x + 12 = (x + 3)(x + 4)', 'x² + 7x + 12 = (x + 3)(x + 9)', 'x² + 7x + 12 = (x + 6)(x + 2)'], ['Cociente x + 4, residuo 0', 'Cociente x + 9, residuo 0', 'Cociente x + 4, residuo 3']],
      'Como $x^2 + 7x + 12 = (x + 3)(x + 4)$, la división es exacta: cociente $x + 4$ y residuo 0.',
      'Dividir es deshacer una multiplicación: ¿por qué hay que multiplicar a x + 3 para obtener el polinomio?'),
    parejas('Une cada división con su cociente y su residuo',
      ['(x² + 5x + 7) ÷ (x + 2)', '(x² − 1) ÷ (x − 1)', '(x² + 4x + 5) ÷ (x + 1)', '(2x² + 3x) ÷ x'],
      ['x + 3, residuo 1', 'x + 1, residuo 0', 'x + 3, residuo 2', '2x + 3, residuo 0', 'x + 3, residuo 0', 'x − 1, residuo 0'],
      'Siempre se cumple dividendo = divisor · cociente + residuo. Por ejemplo $(x + 2)(x + 3) = x^2 + 5x + 6$, y falta 1 para llegar a $x^2 + 5x + 7$.',
      'Multiplica el divisor por el cociente que creas y mira cuánto falta para llegar al dividendo: eso es el residuo.'),
    cuenta('Si $(a - 2)x^2 + 5x = 3x^2 + 5x$ para todo $x$, ¿cuánto vale $a$?', '3 + 2', ['1', '6'],
      'Dos polinomios son iguales cuando sus coeficientes coinciden uno a uno: $a - 2 = 3$, así que $a = 5$.',
      'Compara solo los números que acompañan a x² en los dos lados.'),
    escala('Halla $a$, $b$ y $c$ si $(a + 1)x^2 + (b - 3)x + c = 2x^2 + 4$ para todo $x$',
      [['Iguala coeficiente a coeficiente', 'Reemplaza x = 0 y nada más'], ['a + 1 = 2,  b − 3 = 0,  c = 4', 'a + 1 = 2,  b − 3 = 4,  c = 0'], ['a = 1, b = 3, c = 4', 'a = 1, b = 7, c = 0', 'a = 3, b = 3, c = 4']],
      'A la derecha no hay término en $x$: su coeficiente es 0. Entonces $a + 1 = 2$, $b - 3 = 0$ y $c = 4$.',
      'Un término que no aparece tiene coeficiente cero. Escribe la derecha como 2x² + 0x + 4 y compara.'),
    cuenta('Se divide un polinomio de grado 5 entre uno de grado 2. ¿Qué grado tiene el **cociente**?', '5 - 2', ['10', '7'],
      'Al dividir potencias se restan los exponentes: el término principal del cociente es $x^5 \\div x^2 = x^3$.',
      'Mira solo los términos más altos de cada polinomio y divídelos.'),
  ];
  EX['alg-92'] = [
    P('division-sintetica', 'Elige el número $r$ que deja **residuo 0**: entonces $x - r$ es un factor', { rounds: [{ coef: [1, -2, -5, 6], goal: 'zero' }, { coef: [1, 0, -7, 6], goal: 'zero' }, { coef: [2, 1, -5, 2], goal: 'zero' }] },
      'El residuo de dividir entre $x - r$ es $P(r)$. Por eso las raíces dejan residuo 0: $x^3 - 2x^2 - 5x + 6 = (x - 1)(x + 2)(x - 3)$, $x^3 - 7x + 6 = (x - 1)(x - 2)(x + 3)$ y $2x^3 + x^2 - 5x + 2$ se anula en $x = 1$.',
      'Los candidatos enteros son los divisores del último número (positivos y negativos). Un coeficiente que falta va como 0.'),
    P('division-sintetica', 'Ahora busca el $r$ que deja el residuo pedido', { rounds: [{ coef: [1, 1, -4, 2], goal: 'value', value: 26 }, { coef: [1, -3, 0, 5], goal: 'value', value: 1 }] },
      'El residuo es el valor del polinomio en $r$: $P(3) = 27 + 9 - 12 + 2 = 26$, y en el segundo $P(2) = 8 - 12 + 5 = 1$ (también $P(-1) = 1$).',
      'No hace falta dividir a ciegas: el residuo crece rápido con r en un polinomio cúbico. Prueba valores cercanos y mira hacia dónde va.'),
    cuenta('Sin dividir: residuo de $x^3 + 2x^2 - 5$ entre $x - 2$', '2 ^ 3 + 2 * 2 ^ 2 - 5', [],
      'Teorema del residuo: es $P(2) = 8 + 8 - 5 = 11$.',
      'El divisor x − 2 se anula en x = 2: evalúa el polinomio ahí.'),
    escala('¿Para qué $k$ es $x - 1$ un factor de $x^3 + kx - 4$?',
      [['P(1) = 0', 'P(−1) = 0', 'P(0) = 0'], ['1 + k − 4 = 0', '−1 − k − 4 = 0'], ['k = 3', 'k = −5', 'k = 4']],
      'Teorema del factor: $x - 1$ es factor justo cuando $P(1) = 0$. Entonces $1 + k - 4 = 0$ y $k = 3$.',
      'Ser factor quiere decir dejar residuo cero. ¿En qué valor de x se anula x − 1?'),
    escala('Lee la división sintética de $x^3 - 4x^2 + x + 6$ entre $x - 2$',
      [['Baja el 1; 1 · 2 = 2; −4 + 2 = −2', 'Baja el 1; 1 · 2 = 2; −4 − 2 = −6'], ['−2 · 2 = −4; 1 − 4 = −3', '−2 · 2 = −4; 1 + 4 = 5'], ['Cociente x² − 2x − 3, residuo 0', 'Cociente x² − 2x − 3, residuo 6', 'Cociente x³ − 2x² − 3x']],
      'La fila de abajo es $1, -2, -3, 0$: los tres primeros son los coeficientes del cociente, un grado menor, y el último es el residuo.',
      'En cada columna se SUMA lo de arriba con el producto. El cociente tiene un grado menos que el polinomio.'),
  ];
  EX['alg-93'] = [
    P('raices-imanes', 'Pon los imanes en los **ceros** de cada polinomio y ajusta $a$', { rounds: [
      { roots: [-2, 1, 3], a: 1, xr: [-4, 5], yr: [-8, 8], mark: [0, 6] },
      { roots: [-1, -1, 2], a: 1, xr: [-4, 4], yr: [-6, 6], mark: [0, -2] },
    ] }, '1) $y = (x + 2)(x - 1)(x - 3)$, que en $x = 0$ vale 6. 2) $y = (x + 1)^2(x - 2)$: en $-1$ la curva rebota porque el cero es doble.',
      'Cada corte con el eje es un cero. Donde la curva toca el eje y se devuelve, el cero cuenta dos veces: pon dos imanes ahí.'),
    escala('¿Qué número **no** puede ser cero racional de $2x^3 - 3x^2 + x - 6$?',
      [['p divide a 6 y q divide a 2', 'p divide a 2 y q divide a 6'], ['±1, ±2, ±3, ±6, ±½, ±3/2', '±1, ±2, ±½, ±⅓, ±⅙, ±⅔'], ['¼ no puede ser cero racional', '3/2 no puede ser cero racional']],
      'Un cero racional $\\tfrac{p}{q}$ tiene $p$ divisor del término independiente (6) y $q$ divisor del coeficiente principal (2). Un denominador 4 es imposible.',
      'El numerador sale del último número y el denominador del primero. Mira qué denominadores son posibles.'),
    escala('Regla de los signos de Descartes para $f(x) = x^3 - 2x^2 - x + 2$',
      [['Signos: +, −, −, +', 'Signos: +, −, +, +'], ['2 cambios de signo', '3 cambios de signo', '1 cambio de signo'], ['2 o 0 raíces positivas', 'Exactamente 3 raíces positivas', '1 raíz positiva']],
      'De $+$ a $-$ hay un cambio, de $-$ a $-$ ninguno y de $-$ a $+$ otro: 2 cambios. El número de raíces positivas es ese o baja de dos en dos.',
      'Recorre los coeficientes en orden y cuenta cada vez que el signo cambia respecto al anterior.'),
    cuenta('Un polinomio con coeficientes racionales tiene como ceros a $2$, $-1$ y $3 + \\sqrt2$. ¿Cuál es su **grado mínimo**?', '1 + 1 + 2', ['3'],
      'Con coeficientes racionales, los ceros con raíz vienen en parejas conjugadas: si $3 + \\sqrt2$ es cero, también $3 - \\sqrt2$. Son 4 ceros.',
      'El cero con raíz no puede venir solo: trae a su conjugado.'),
    escala('Multiplicidad de los ceros de $f(x) = x^2(x - 3)(x + 1)^3$',
      [['El exponente de cada factor es su multiplicidad', 'El número dentro del factor es su multiplicidad'], ['0 es doble, 3 es simple, −1 es triple', '0 es simple, 3 es triple, −1 es simple'], ['En 0 rebota; en 3 y en −1 cruza', 'En 0 cruza; en 3 rebota']],
      'La multiplicidad es cuántas veces aparece el factor. Con multiplicidad par la gráfica toca el eje y rebota; con impar, lo cruza.',
      'El cero sale de igualar el factor a cero; la multiplicidad es el exponente que lleva ese factor.'),
  ];
  BOSS['grado-superior'] = { id: 'jefe-alg-grado-superior', name: 'el Guardián de la Cordillera', color: 'coral', title: 'El Guardián de la Cordillera',
    intro: ['En la cima de la cordillera espera su **Guardián**. Sus retos son de división, residuos y ceros.', 'Cada reto se responde con una ruta de pasos. Elige con calma: un paso que no se justifica cuesta un corazón.'],
    phases: [
      ['Fase 1 · División', [
        ['Residuo de x³ − 3x + 1 entre x − 2', [['Es P(2)', 'Es P(−2)'], ['8 − 6 + 1', '−8 + 6 + 1', '8 + 6 + 1'], ['3', '−1', '15']]],
        ['(x² + x − 6) ÷ (x − 2)', [['x² + x − 6 = (x − 2)(x + 3)', 'x² + x − 6 = (x + 2)(x − 3)'], ['Cociente x + 3, residuo 0', 'Cociente x − 3, residuo 0', 'Cociente x + 3, residuo 6']]],
      ]],
      ['Fase 2 · Teorema del factor', [
        ['¿x + 1 es factor de x³ + x² − x − 1?', [['Evalúa P(−1)', 'Evalúa P(1)', 'Evalúa P(0)'], ['−1 + 1 + 1 − 1 = 0', '−1 − 1 − 1 − 1 = −4'], ['Sí: el residuo es 0', 'No: el residuo es −4']]],
        ['k para que x − 2 sea factor de x² + kx − 6', [['P(2) = 0', 'P(−2) = 0'], ['4 + 2k − 6 = 0', '4 − 2k − 6 = 0'], ['k = 1', 'k = −1', 'k = 5']]],
      ]],
      ['Fase 3 · Ceros', [
        ['Ceros de x³ − 4x', [['x(x² − 4)', 'x(x² + 4)', 'x²(x − 4)'], ['x(x − 2)(x + 2)', 'x(x − 2)²'], ['0, 2 y −2', '0 y 2', '0 y 4']]],
        ['Ceros de (x − 1)²(x + 5)', [['1 es doble y −5 es simple', '1 es simple y −5 es doble', '−1 es doble y 5 es simple'], ['La curva rebota en 1 y cruza en −5', 'La curva cruza en 1 y rebota en −5']]],
      ]],
    ] };
  EXAM['grado-superior'] = { id: 'exam-alg-grado-superior', title: 'Polinomios de grado superior', items: [
    ['alg-23b', 'Dividendo = divisor · cociente + residuo.',
      escala('Divide $(x^2 + 2x - 3) \\div (x - 1)$', [['x² + 2x − 3 = (x − 1)(x + 3)', 'x² + 2x − 3 = (x + 1)(x − 3)'], ['Cociente x + 3, residuo 0', 'Cociente x − 3, residuo 0', 'Cociente x + 3, residuo −3']], '$x^2 + 2x - 3 = (x - 1)(x + 3)$: cociente $x + 3$ y residuo 0.', 'Busca por qué hay que multiplicar a x − 1 para obtener el polinomio.')],
    ['alg-92', 'Si $P(r) = 0$, entonces $x - r$ es factor de $P$.',
      P('division-sintetica', 'Elige un $r$ que deje residuo 0', { rounds: [{ coef: [1, -4, 1, 6], goal: 'zero' }] }, '$x^3 - 4x^2 + x + 6 = (x + 1)(x - 2)(x - 3)$: sirven $-1$, $2$ y $3$.', 'Prueba los divisores de 6, positivos y negativos.')],
    ['alg-92', 'El residuo de dividir $P(x)$ entre $x - r$ es $P(r)$.',
      cuenta('Sin dividir: residuo de $2x^3 - x + 3$ entre $x + 1$', '2 * ( -1 ) ^ 3 - -1 + 3', [], '$P(-1) = -2 + 1 + 3 = 2$.', 'x + 1 se anula en x = −1: evalúa ahí, con cuidado con los signos.')],
    ['alg-93', 'Cada cero $r$ aporta un factor $(x - r)$.',
      P('raices-imanes', 'Pon los imanes en los ceros y ajusta $a$', { rounds: [{ roots: [-3, 0, 2], a: 1, xr: [-5, 4], yr: [-8, 10], mark: [1, -4] }] }, '$y = x(x + 3)(x - 2)$, que en $x = 1$ vale $1 \\cdot 4 \\cdot (-1) = -4$.', 'Cada corte con el eje x es un cero.')],
    ['alg-93', 'Descartes: el número de raíces positivas es el de cambios de signo, o menor en un número par.',
      escala('¿Cuántas raíces **positivas** puede tener $x^3 + 2x^2 + x + 3$?', [['Signos: +, +, +, +', 'Signos: +, −, +, −'], ['0 cambios de signo', '3 cambios de signo'], ['Ninguna raíz positiva', '3 o 1 raíces positivas']], 'Todos los coeficientes son positivos: no hay cambios de signo y por eso no hay raíces positivas.', 'Cuenta los cambios de signo entre coeficientes seguidos.')],
  ] };

  // ====================== Río de Asíntotas ======================
  EX['alg-25a'] = [
    P('cancela-factores', '**Simplifica** cada fracción cancelando factores iguales. Cuidado: los términos que se suman no se cancelan', { rounds: [
      { top: ['x − 3', 'x + 3'], bottom: ['x + 3', 'x − 2'] }, { top: ['2', 'x + 2'], bottom: ['x + 2', 'x − 2'] }, { top: ['x', '2'], bottom: ['x'], sumTop: true }, { top: ['x', 'x − 1'], bottom: ['x − 1', 'x', 'x + 4'] },
    ] }, '$\\dfrac{(x - 3)(x + 3)}{(x + 3)(x - 2)} = \\dfrac{x - 3}{x - 2}$ y $\\dfrac{2(x + 2)}{(x + 2)(x - 2)} = \\dfrac{2}{x - 2}$. En $\\dfrac{x + 2}{x}$ la $x$ de arriba está sumando: no es un factor y no se cancela. En la última queda $\\dfrac{1}{x + 4}$.',
      'Solo se cancela lo que multiplica a TODO el piso. Si arriba hay una suma, sus pedazos no son factores.'),
    escala('¿Qué valores quedan fuera del **dominio** de $\\dfrac{x + 1}{x^2 - 4}$?',
      [['El denominador no puede ser 0', 'El numerador no puede ser 0'], ['x² − 4 = 0', 'x + 1 = 0'], ['x ≠ 2 y x ≠ −2', 'x ≠ −1', 'x ≠ 4']],
      'No se puede dividir entre cero: se excluyen los valores que anulan el denominador, $x^2 - 4 = (x - 2)(x + 2) = 0$.',
      'El numerador sí puede valer cero (la fracción da 0). Lo prohibido es el cero abajo.'),
    escala('Simplifica $\\dfrac{x^2 - 25}{x^2 + 5x}$ y di para qué $x$ vale',
      [['Factoriza: (x − 5)(x + 5) sobre x(x + 5)', 'Cancela x² arriba y abajo'], ['(x − 5) ÷ x', '−25 ÷ 5x', '(x − 5) ÷ (x + 5)'], ['Vale si x ≠ 0 y x ≠ −5', 'Vale si x ≠ 0', 'Vale para todo x']],
      'Primero se factoriza y luego se cancela el factor común $(x + 5)$. El valor $x = -5$ sigue excluido aunque el factor ya no se vea.',
      'x² no es un factor del numerador: está restando con 25. Factoriza antes de cancelar, y no olvides lo que cancelaste al dar el dominio.'),
    P('cruz-asintotas', 'Lleva la **cruz de asíntotas** a su lugar en cada función racional', { rounds: [{ p: 2, q: 1, h: 3, xr: [-6, 8], yr: [-6, 8] }, { p: -1, q: 4, h: -2, xr: [-7, 5], yr: [-6, 6] }] },
      'La asíntota vertical está donde el denominador vale cero y la horizontal es el cociente de los coeficientes de $x$: 1) $x = 3$, $y = 2$. 2) $x = -2$, $y = -1$.',
      'La vertical va donde se anula el denominador. Para la horizontal piensa en x enorme: los números sueltos dejan de pesar.'),
    cuenta('Valor de $\\dfrac{x^2 - 9}{x - 3}$ en $x = 5$ (simplifica antes)', '5 + 3', ['9', '2'],
      '$\\dfrac{(x - 3)(x + 3)}{x - 3} = x + 3$ para $x \\ne 3$; en $x = 5$ vale 8.',
      'El numerador es una diferencia de cuadrados: uno de sus factores es igual al denominador.'),
  ];
  EX['alg-25b'] = [
    escala('Suma $\\dfrac{1}{x} + \\dfrac{1}{x + 1}$',
      [['Denominador común: x(x + 1)', 'Denominador común: 2x + 1', 'Denominador común: x + (x + 1)'], ['(x + 1 + x) sobre x(x + 1)', '(1 + 1) sobre x(x + 1)'], ['(2x + 1) ÷ (x² + x)', '2 ÷ (x² + x)', '2 ÷ (2x + 1)']],
      'El denominador común es el producto $x(x + 1)$. Cada fracción se amplifica por lo que le falta: $\\dfrac{x + 1}{x(x + 1)} + \\dfrac{x}{x(x + 1)} = \\dfrac{2x + 1}{x^2 + x}$.',
      'Igual que con números: el denominador común se arma multiplicando, y cada numerador se multiplica por el factor que le faltaba a su denominador.'),
    P('cancela-factores', 'Multiplica y **simplifica**: cancela los factores que estén arriba y abajo', { rounds: [
      { top: ['x', 'x + 1'], bottom: ['x + 1', 'x', 'x'] }, { top: ['x − 2', 'x + 5'], bottom: ['x + 5', 'x − 2', 'x + 1'] }, { top: ['x', '1'], bottom: ['x', '3'], sumTop: true, sumBottom: true },
    ] }, '$\\dfrac{x}{x + 1} \\cdot \\dfrac{x + 1}{x^2} = \\dfrac{1}{x}$ y $\\dfrac{(x - 2)(x + 5)}{(x + 5)(x - 2)(x + 1)} = \\dfrac{1}{x + 1}$. En $\\dfrac{x + 1}{x + 3}$ no hay factores: nada se cancela.',
      'Al multiplicar fracciones todo lo de arriba queda multiplicando y todo lo de abajo también: ahí sí se cancelan parejas iguales.'),
    escala('Divide $\\dfrac{x}{3} \\div \\dfrac{x^2}{6}$',
      [['Multiplica por el recíproco: x/3 · 6/x²', 'Divide arriba con arriba: x ÷ x²'], ['6x ÷ 3x²', 'x³ ÷ 18'], ['2 ÷ x', '2x', 'x ÷ 2']],
      'Dividir es multiplicar por el recíproco: $\\dfrac{x}{3} \\cdot \\dfrac{6}{x^2} = \\dfrac{6x}{3x^2} = \\dfrac{2}{x}$.',
      'Voltea la segunda fracción y multiplica. Luego simplifica números con números y x con x.'),
    escala('Simplifica la fracción compleja $\\dfrac{\\frac{1}{x} - \\frac{1}{2}}{x - 2}$',
      [['Arriba: (2 − x) ÷ 2x', 'Arriba: (x − 2) ÷ 2x', 'Arriba: 1 ÷ (x − 2)'], ['2 − x = −(x − 2)', '2 − x = x − 2'], ['−1 ÷ 2x', '1 ÷ 2x', '−1 ÷ (x − 2)']],
      'Arriba, con denominador común $2x$: $\\dfrac{2 - x}{2x}$. Como $2 - x = -(x - 2)$, se cancela con el $x - 2$ de abajo y queda $-\\dfrac{1}{2x}$.',
      'Resuelve primero la resta de arriba. Después fíjate en que 2 − x y x − 2 son opuestos, no iguales.'),
    escala('Mínimo común denominador de $\\dfrac{1}{x^2 - 9}$ y $\\dfrac{1}{x^2 + 3x}$',
      [['x² − 9 = (x − 3)(x + 3)  y  x² + 3x = x(x + 3)', 'x² − 9 = (x − 3)²  y  x² + 3x = x(x + 3)'], ['x(x − 3)(x + 3)', 'x(x − 3)(x + 3)²', '(x − 3)(x + 3)']],
      'Se factoriza cada denominador y se toma cada factor una vez con su mayor exponente: $x$, $(x - 3)$ y $(x + 3)$.',
      'El factor que comparten no se repite: basta una copia. Los que no comparten sí van todos.'),
  ];
  EX['alg-101'] = [
    P('afina-sistema', 'Mueve los coeficientes para cumplir la **meta** de cada ronda y mira qué les pasa a las rectas', { rounds: [
      { e1: [1, 1, 0], e2: [1, -1, 0], free: [[0, 2], [1, 2]], goal: 'punto', P: [3, 1] },
      { e1: [1, 2, 4], e2: [2, 1, 6], free: [[1, 1]], goal: 'ninguna' },
      { e1: [2, 1, 4], e2: [4, 1, 5], free: [[1, 1], [1, 2]], goal: 'infinitas' },
    ] }, 'Con solución $(3, 1)$: $x + y = 4$ y $x - y = 2$. Sin solución: $2x + 4y = 6$ es paralela a $x + 2y = 4$. Infinitas: $4x + 2y = 8$ es el doble de $2x + y = 4$, la misma recta.',
      'Resolver un sistema es buscar el punto donde se cruzan las rectas. Paralelas: mismos coeficientes de x y de y en proporción, pero otro número a la derecha.'),
    P('combina-vectores', 'Ronda 1: $x + y = 5,\\; x - y = 1$. Ronda 2: $2x + y = 7,\\; x + 3y = 11$. ¿Cuántas veces va cada **columna** para llegar al lado derecho?', { rounds: [
      { u: [1, 1], v: [1, -1], target: [5, 1], names: ['c₁', 'c₂'] }, { u: [2, 1], v: [1, 3], target: [7, 11], names: ['c₁', 'c₂'] },
    ] }, 'El primero da $x = 3$, $y = 2$ y el segundo $x = 2$, $y = 3$: son las veces que entra cada columna de coeficientes.',
      'La primera columna son los coeficientes de x y la segunda los de y. Acércate con una perilla y corrige con la otra.'),
    escala('Resuelve por sustitución: $y = 2x - 1$ y $3x + y = 9$',
      [['3x + (2x − 1) = 9', '3x + 2x = 9', '3(2x − 1) + y = 9'], ['5x = 10', '5x = 8'], ['x = 2, y = 3', 'x = 2, y = 5', 'x = 8/5, y = 11/5']],
      'Se cambia $y$ por $2x - 1$ en la segunda ecuación: $5x - 1 = 9$, $x = 2$. Luego $y = 2 \\cdot 2 - 1 = 3$.',
      'Sustituir es cambiar la y completa por lo que vale, con su −1 incluido. Al final vuelve a la primera ecuación para hallar y.'),
    escala('Resuelve de abajo hacia arriba: $x + y + z = 6$, $\\;y + z = 5$, $\\;z = 3$',
      [['z = 3', 'z = 5'], ['y = 5 − 3 = 2', 'y = 5 + 3 = 8'], ['x = 6 − 2 − 3 = 1', 'x = 6 − 8 − 3 = −5', 'x = 6 − 2 + 3 = 7']],
      'El sistema ya está escalonado: la última ecuación da $z$, con ella la segunda da $y$ y con las dos la primera da $x$.',
      'Empieza por la ecuación que tiene una sola incógnita y ve reemplazando hacia arriba.'),
    escala('Dos cuadernos y un lápiz cuestan 11 mil; un cuaderno y un lápiz, 7 mil. ¿Cuánto vale cada cosa?',
      [['Resta las ecuaciones: un cuaderno vale 4', 'Suma las ecuaciones: tres cuadernos valen 18', 'Resta las ecuaciones: un lápiz vale 4'], ['Lápiz: 7 − 4 = 3', 'Lápiz: 11 − 4 = 7'], ['Cuaderno 4 mil y lápiz 3 mil', 'Cuaderno 6 mil y lápiz 1 mil', 'Cuaderno 4 mil y lápiz 7 mil']],
      'Las dos compras solo se diferencian en un cuaderno, y la diferencia de precio es $11 - 7 = 4$. Con eso, el lápiz vale $7 - 4 = 3$.',
      'Compara las dos compras: ¿qué tiene de más la primera, y cuánto más cuesta?'),
  ];
  EX['alg-102'] = [
    escala('Halla los puntos donde se cortan $y = x^2$ y $y = 2x + 3$',
      [['x² = 2x + 3', 'x² + 2x + 3 = 0'], ['(x − 3)(x + 1) = 0', '(x + 3)(x − 1) = 0'], ['(3, 9) y (−1, 1)', '(−3, 9) y (1, 1)', '(3, 9) y (−1, −1)']],
      'En los cortes las dos $y$ son iguales: $x^2 - 2x - 3 = 0$, con raíces $3$ y $-1$. Cada $x$ se lleva a $y = x^2$: $9$ y $1$.',
      'Iguala las dos expresiones de y. Cuando tengas las x, calcula su y con cualquiera de las dos ecuaciones.'),
    escala('Descompón $\\dfrac{5x + 1}{(x - 1)(x + 2)}$ en fracciones parciales',
      [['A/(x − 1) + B/(x + 2)', 'A/(x − 1) + B/(x − 2)', '(Ax + B)/(x − 1)(x + 2)'], ['5x + 1 = A(x + 2) + B(x − 1)', '5x + 1 = A(x − 1) + B(x + 2)'], ['Con x = 1: A = 2. Con x = −2: B = 3', 'Con x = 1: A = 3. Con x = −2: B = 2']],
      'Cada factor lineal distinto da una fracción con una constante arriba. Al quitar denominadores: $5x + 1 = A(x + 2) + B(x - 1)$. Con $x = 1$, $6 = 3A$; con $x = -2$, $-9 = -3B$.',
      'A queda multiplicada por el factor del OTRO denominador. Para hallarlas, usa los valores de x que anulan cada factor.'),
    parejas('Une cada fracción con la **forma** de su descomposición',
      ['1/((x − 1)(x + 4))', '1/(x − 1)²', '1/((x − 1)(x² + 1))', '1/(x²(x + 2))'],
      ['A/(x − 1) + B/(x + 4)', 'A/(x − 1) + B/(x − 1)²', 'A/(x − 1) + (Bx + C)/(x² + 1)', 'A/x + B/x² + C/(x + 2)', 'A/(x − 1) + B/(x² + 1)', 'A/x² + B/(x + 2)'],
      'Un factor lineal da una constante; un factor repetido da una fracción por cada potencia; un factor cuadrático que no se parte lleva arriba $Bx + C$.',
      'Mira cada factor del denominador: ¿es lineal o cuadrático? ¿Está repetido? Un factor al cuadrado necesita dos fracciones.'),
    cuenta('¿Cuántas **constantes** hay que hallar al descomponer $\\dfrac{1}{(x - 1)^2(x^2 + 4)}$?', '2 + 2', ['3', '1'],
      'El factor $(x - 1)^2$ aporta dos fracciones con una constante cada una; el factor cuadrático $x^2 + 4$ aporta una fracción con dos ($Bx + C$). En total 4.',
      'Cuenta por factor: uno lineal repetido dos veces y uno cuadrático que no se puede factorizar.'),
    escala('Dos números suman 7 y su producto es 12. ¿Cuáles son?',
      [['y = 7 − x', 'y = 12 − x'], ['x(7 − x) = 12', 'x + (7 − x) = 12'], ['x² − 7x + 12 = 0', 'x² + 7x + 12 = 0'], ['3 y 4', '−3 y −4', '2 y 6']],
      'De $x + y = 7$ sale $y = 7 - x$; al sustituir en $xy = 12$ queda $x^2 - 7x + 12 = 0 = (x - 3)(x - 4)$.',
      'Despeja una incógnita de la ecuación más sencilla y reemplázala en la otra: queda una cuadrática.'),
  ];
  BOSS.racionales = { id: 'jefe-alg-racionales', name: 'el Guardián del Río', color: 'sky', title: 'El Guardián del Río',
    intro: ['El río de asíntotas tiene un **Guardián** que no deja cruzar a quien divida entre cero.', 'Arma la ruta de cada respuesta, de abajo hacia arriba, y ataca. Tienes todo el tiempo para pensar.'],
    phases: [
      ['Fase 1 · Simplificar y asíntotas', [
        ['(x² − 4) ÷ (x² − 2x)', [['(x − 2)(x + 2) sobre x(x − 2)', '(x − 2)² sobre x(x − 2)', 'Cancela x² arriba y abajo'], ['(x + 2) ÷ x', '(x − 2) ÷ x', '−4 ÷ (−2x)'], ['con x ≠ 0 y x ≠ 2', 'con x ≠ 0', 'con x ≠ 2']]],
        ['Asíntotas de y = (3x + 1) ÷ (x − 4)', [['Vertical: x = 4', 'Vertical: x = −4', 'Vertical: x = −⅓'], ['Horizontal: y = 3', 'Horizontal: y = 0', 'Horizontal: y = ¼']]],
      ]],
      ['Fase 2 · Operaciones', [
        ['2/x − 1/(x + 1)', [['Común: x(x + 1)', 'Común: x + 1'], ['(2(x + 1) − x) sobre x(x + 1)', '(2 − 1) sobre x(x + 1)', '(2x − (x + 1)) sobre x(x + 1)'], ['(x + 2) ÷ (x² + x)', '1 ÷ (x² + x)', '(x − 1) ÷ (x² + x)']]],
        ['(x/4) ÷ (x/2)', [['x/4 · 2/x', 'x/4 · x/2'], ['2x ÷ 4x', 'x² ÷ 8'], ['½', 'x²/8', '2']]],
      ]],
      ['Fase 3 · Sistemas y fracciones parciales', [
        ['x + y = 9  y  x − y = 3', [['Suma: 2x = 12', 'Suma: 2x = 6', 'Resta: 2x = 12'], ['x = 6', 'x = 3'], ['y = 3', 'y = 6', 'y = −3']]],
        ['4 ÷ ((x − 1)(x + 3)) en fracciones parciales', [['A/(x − 1) + B/(x + 3)', 'A/(x + 1) + B/(x − 3)'], ['4 = A(x + 3) + B(x − 1)', '4 = A(x − 1) + B(x + 3)'], ['A = 1 y B = −1', 'A = −1 y B = 1', 'A = 1 y B = 1']]],
      ]],
    ] };
  EXAM.racionales = { id: 'exam-alg-racionales', title: 'Expresiones racionales y fracciones parciales', items: [
    ['alg-25a', 'Solo se cancelan factores (lo que multiplica a todo), nunca términos que se suman.',
      P('cancela-factores', 'Simplifica cada fracción', { rounds: [{ top: ['x + 1', 'x − 4'], bottom: ['x − 4', 'x + 6'] }, { top: ['x', '5'], bottom: ['5'], sumTop: true }] }, '$\\dfrac{(x + 1)(x - 4)}{(x - 4)(x + 6)} = \\dfrac{x + 1}{x + 6}$. En $\\dfrac{x + 5}{5}$ el 5 de arriba está sumando: no se cancela.', 'Pregúntate si la ficha multiplica a todo su piso o solo es un sumando.')],
    ['alg-25a', 'La asíntota vertical está donde el denominador se anula; la horizontal, en el cociente de los coeficientes principales.',
      P('cruz-asintotas', 'Lleva la cruz de asíntotas a su lugar', { rounds: [{ p: 1, q: 3, h: 2, xr: [-6, 8], yr: [-6, 8] }] }, 'En $y = \\dfrac{x + 3}{x - 2}$: vertical $x = 2$ y horizontal $y = 1$.', 'La vertical va donde el denominador vale cero.')],
    ['alg-25b', 'Para sumar fracciones algebraicas se busca el mínimo común denominador.',
      escala('Suma $\\dfrac{3}{x} + \\dfrac{2}{x^2}$', [['Común: x²', 'Común: x³', 'Común: 2x'], ['(3x + 2) ÷ x²', '5 ÷ x²', '(3 + 2x) ÷ x²']], 'El común es $x^2$: la primera fracción se amplifica por $x$ y queda $\\dfrac{3x + 2}{x^2}$.', 'x² ya contiene a x: no hace falta multiplicar los dos denominadores.')],
    ['alg-101', 'La solución de un sistema dice cuántas veces entra cada columna de coeficientes.',
      P('combina-vectores', 'Resuelve $x + 2y = 8,\\; 2x - y = 1$ mirándolo por columnas', { rounds: [{ u: [1, 2], v: [2, -1], target: [8, 1], names: ['c₁', 'c₂'] }] }, '$x = 2$ y $y = 3$: $2 + 6 = 8$ y $4 - 3 = 1$.', 'La primera columna son los coeficientes de x; la segunda, los de y.')],
    ['alg-102', 'En los puntos de corte las dos expresiones de $y$ valen lo mismo.',
      escala('¿Dónde se cortan $y = x^2$ y $y = x + 2$?', [['x² − x − 2 = 0', 'x² + x + 2 = 0'], ['(x − 2)(x + 1) = 0', '(x + 2)(x − 1) = 0'], ['(2, 4) y (−1, 1)', '(−2, 4) y (1, 1)']], '$x^2 = x + 2$ da $x = 2$ y $x = -1$; sus alturas son $4$ y $1$.', 'Iguala las dos y, pasa todo a un lado y factoriza.')],
  ] };

  // ====================== Selva Exponencial ======================
  EX['alg-71'] = [
    P('balanza-exponencial', 'Mueve $x$ hasta que la balanza quede en **equilibrio**', { rounds: [
      { tex: '2^{x} = 32', txt: '2ˣ = 32', L: x => 2 ** x, R: () => 32, x: 5 },
      { tex: '3^{x+1} = 27', txt: '3ˣ⁺¹ = 27', L: x => 3 ** (x + 1), R: () => 27, x: 2 },
      { tex: '5^{2x} = 25^{3}', txt: '5²ˣ = 25³', L: x => 5 ** (2 * x), R: () => 25 ** 3, x: 3 },
    ] }, '$32 = 2^5$, así que $x = 5$. $27 = 3^3$: $x + 1 = 3$ y $x = 2$. $25^3 = 5^6$: $2x = 6$ y $x = 3$.',
      'Escribe el número de la derecha como potencia de la misma base de la izquierda e iguala los exponentes.'),
    P('proyector-sombras', 'Marca el **dominio** y el **rango** de cada función exponencial', { rounds: [
      { f: x => 2 ** x, xr: [-5, 4], yr: [-2, 6], dom: [null, null, false, false], ran: [0, null, false, false] },
      { f: x => 3 - 2 ** x, xr: [-5, 3], yr: [-5, 5], dom: [null, null, false, false], ran: [null, 3, false, false] },
    ] }, '$2^x$ existe para todo $x$ y siempre es positiva, sin llegar a 0: dominio $(-\\infty, \\infty)$, rango $(0, \\infty)$. En $3 - 2^x$ la gráfica se voltea y sube 3: rango $(-\\infty, 3)$.',
      'La exponencial se acerca a su asíntota sin tocarla: ese extremo del rango va abierto. A lo ancho no tiene fin por ningún lado.'),
    escala('Resuelve $9^x = 27$',
      [['3^(2x) = 3³', '3^(x²) = 3³', '9x = 27'], ['2x = 3', 'x² = 3'], ['x = 3/2', 'x = √3', 'x = 3']],
      '$9 = 3^2$ y $27 = 3^3$: $(3^2)^x = 3^{2x} = 3^3$, así que $2x = 3$.',
      '9 y 27 no son potencias una de la otra, pero las dos son potencias de 3. Potencia de potencia: los exponentes se multiplican.'),
    cuenta('Un cultivo de 500 bacterias se **duplica** cada hora. ¿Cuántas hay después de 4 horas?', '500 * 2 ^ 4', ['8'],
      'Cada hora se multiplica por 2: $500 \\cdot 2^4 = 8000$. Crecer exponencialmente es multiplicar siempre por lo mismo.',
      'No se suman 500 cada hora: se multiplica por 2 una vez por cada hora que pasa.', 'bacterias'),
    escala('Describe la gráfica de $f(x) = \\left(\\tfrac13\\right)^x$',
      [['La base ⅓ está entre 0 y 1', 'La base ⅓ es negativa'], ['La función decrece', 'La función crece'], ['Pasa por (0, 1) y se acerca a y = 0', 'Pasa por (0, 0) y se acerca a y = 1', 'Pasa por (1, 0)']],
      'Con base entre 0 y 1 cada paso a la derecha multiplica por un número menor que 1: la función decrece. Toda exponencial $b^x$ pasa por $(0, 1)$ y tiene asíntota $y = 0$.',
      'Calcula dos valores, f(0) y f(1), y mira si sube o baja.'),
  ];
  EX['alg-72'] = [
    parejas('Une cada logaritmo con la potencia que dice lo mismo',
      ['log₂ 8 = 3', 'log₅ 25 = 2', 'log₁₀ 0.01 = −2', 'log₃ 1 = 0'], ['2³ = 8', '5² = 25', '10⁻² = 0.01', '3⁰ = 1', '3² = 8', '2⁵ = 25'],
      '$\\log_b a = c$ quiere decir $b^c = a$: el logaritmo **es el exponente** al que hay que elevar la base.',
      'La base del logaritmo es la base de la potencia, y lo que el logaritmo vale es el exponente.'),
    P('espejo-diagonal', 'Refleja los puntos de $f(x) = 2^{x-1}$ en el espejo $y = x$ para dibujar su inversa', { rounds: [
      { f: x => 2 ** (x - 1), fTxt: '2ˣ⁻¹', pts: [[1, 1], [2, 2], [3, 4]], t: [-3, 3.3], range: [-5, 5] },
    ] }, 'Se intercambian las coordenadas: $(1, 1)$, $(2, 2)$ y $(4, 3)$. La inversa de una exponencial es un logaritmo: aquí $y = \\log_2 x + 1$.',
      'Reflejar en y = x es intercambiar las dos coordenadas de cada punto. Un punto que está sobre el espejo no se mueve.'),
    cuenta('Calcula $\\log_2 8 + \\log_2 4$', '3 + 2', ['6', '32'],
      '$\\log_2 8 = 3$ y $\\log_2 4 = 2$: suman 5, que es $\\log_2 32$. Sumar logaritmos es multiplicar los números: $8 \\cdot 4 = 32 = 2^5$.',
      'Cada logaritmo es un exponente: ¿a qué hay que elevar 2 para obtener 8, y para obtener 4?'),
    escala('Resuelve $\\log_3(x) + \\log_3(2) = 2$',
      [['log₃(2x) = 2', 'log₃(x + 2) = 2', 'log₃(x²) = 2'], ['2x = 3²', '2x = 2³'], ['x = 9/2', 'x = 4', 'x = 7']],
      'La suma de logaritmos es el logaritmo del producto: $\\log_3(2x) = 2$. En forma exponencial, $2x = 3^2 = 9$.',
      'Junta primero los dos logaritmos en uno solo y después pásalo a forma de potencia: la base es 3.'),
    escala('Si $\\log x = 3$ y $\\log y = 1$, halla $\\log(x^2 y)$',
      [['log(x²) + log(y)', 'log(x²) · log(y)'], ['2·log x + log y', '(log x)² + log y'], ['2 · 3 + 1 = 7', '3² + 1 = 10', '2 · 3 · 1 = 6']],
      'El logaritmo de un producto es la suma de los logaritmos, y el exponente baja multiplicando: $2\\log x + \\log y = 7$.',
      'Un producto dentro del logaritmo se vuelve suma afuera; una potencia adentro baja como factor.'),
  ];
  BOSS['exp-log'] = { id: 'jefe-alg-exp-log', name: 'el Guardián de la Selva', color: 'mint', title: 'El Guardián de la Selva',
    intro: ['En lo más espeso de la selva está su **Guardián**: todo ahí crece multiplicándose.', 'Responde cada reto con una ruta de pasos y ataca. El logaritmo es tu machete: es el exponente que buscas.'],
    phases: [
      ['Fase 1 · Exponenciales', [
        ['Resuelve 4^x = 32', [['2^(2x) = 2⁵', '4^x = 4⁸', '2^(x + 2) = 2⁵'], ['2x = 5', 'x = 8', 'x + 2 = 5'], ['x = 5/2', 'x = 8', 'x = 3']]],
        ['Una inversión se triplica cada 5 años. ¿Por cuánto se multiplica en 15?', [['Son 3 periodos de 5 años', 'Son 15 periodos'], ['3 · 3 · 3', '3 + 3 + 3', '3 · 15'], ['27', '9', '45']]],
      ]],
      ['Fase 2 · Logaritmos', [
        ['log₂(1/8)', [['¿2 elevado a qué da 1/8?', '¿8 elevado a qué da 2?'], ['2⁻³ = 1/8', '2³ = 1/8'], ['−3', '3', '1/3']]],
        ['log 50 + log 2', [['log(50 · 2)', 'log(50 + 2)', 'log 50 · log 2'], ['log 100', 'log 52'], ['2', '100', '10']]],
      ]],
      ['Fase 3 · Ecuaciones', [
        ['Resuelve 2^x = 10', [['x = log 10 ÷ log 2', 'x = log 2 ÷ log 10', 'x = 10 ÷ 2'], ['x ≈ 3.32', 'x ≈ 0.30', 'x = 5']]],
        ['Resuelve log₂(x − 1) = 3', [['x − 1 = 2³', 'x − 1 = 3²', 'x − 1 = 3 · 2'], ['x = 9', 'x = 10', 'x = 7'], ['Sirve: x − 1 = 8 es positivo', 'No sirve: da un logaritmo negativo']]],
      ]],
    ] };
  EXAM['exp-log'] = { id: 'exam-alg-exp-log', title: 'Funciones exponenciales y logarítmicas', items: [
    ['alg-71', 'Para resolver una ecuación exponencial se escriben los dos lados con la misma base y se igualan los exponentes.',
      P('balanza-exponencial', 'Equilibra la balanza', { rounds: [{ tex: '2^{x-1} = 16', txt: '2ˣ⁻¹ = 16', L: x => 2 ** (x - 1), R: () => 16, x: 5 }] }, '$16 = 2^4$: $x - 1 = 4$ y $x = 5$.', 'Escribe 16 como potencia de 2.')],
    ['alg-13b', 'Interés simple: cada periodo se gana lo mismo, capital por tasa.',
      cuenta('Se prestan 200 000 pesos al 2 % mensual de interés **simple**. ¿Cuánto interés se paga en 6 meses?', '200000 * 0.02 * 6', ['12'], 'Cada mes se pagan $200\\,000 \\cdot 0.02 = 4000$; en 6 meses, $24\\,000$.', 'El 2 % es 0.02. En interés simple, cada mes se cobra lo mismo.', 'pesos')],
    ['alg-72', 'El logaritmo es el exponente: $\\log_b a = c$ quiere decir $b^c = a$.',
      escala('Calcula $\\log_4 64$', [['¿4 elevado a qué da 64?', '¿64 elevado a qué da 4?'], ['4³ = 64', '4⁴ = 64'], ['3', '4', '16']], '$4^3 = 64$, así que $\\log_4 64 = 3$.', 'Multiplica 4 por sí mismo hasta llegar a 64 y cuenta las veces.')],
    ['alg-72', 'La suma de logaritmos de la misma base es el logaritmo del producto.',
      cuenta('Calcula $\\log_3 9 + \\log_3 27$', '2 + 3', ['6', '36'], '$\\log_3 9 = 2$ y $\\log_3 27 = 3$: suman 5, que es $\\log_3 243$.', 'Cada logaritmo es un exponente de 3.')],
    ['alg-73', 'Cuando las bases no coinciden, se toma logaritmo en los dos lados.',
      escala('Resuelve $5^x = 20$', [['x = log 20 ÷ log 5', 'x = log 5 ÷ log 20', 'x = 20 ÷ 5'], ['x ≈ 1.86', 'x ≈ 0.54', 'x = 4']], 'Tomando logaritmos, $x \\log 5 = \\log 20$, así que $x = \\dfrac{\\log 20}{\\log 5} \\approx 1.86$ (entre 1 y 2, porque $5^1 = 5$ y $5^2 = 25$).', 'El exponente baja multiplicando al tomar logaritmo. Comprueba con el sentido común: 20 está entre 5 y 25.')],
  ] };

  // ====================== Se montan en el curso ======================
  for (const u of COURSE_ALGEBRA.units) for (const l of u.lessons) if (EX[l.id]) { l.ex = EX[l.id]; delete l.more; }
  for (const [w, b] of Object.entries(BOSS)) {
    U(w).boss = { id: b.id, title: b.title,
      clip: { scenes: [sc(5, b.intro[0], { title: 'Jefe final' }), sc(5, b.intro[1], { steps: b.phases.map(f => f[0]) })] },
      ex: [P('jefe-ruta', `Vence ${("a " + b.name).replace(/^a el /, "al ")}: arma la **ruta de pasos** de cada reto y toca «¡Atacar!»`,
        { name: b.name, color: b.color, rounds: b.phases.map(([title, attacks]) => ({ title, attacks: attacks.map(([say, levels]) => ({ say, levels })) })) },
        'Cada reto se resuelve paso a paso; el Guardián cae cuando todos los pasos de la ruta se justifican.',
        'Lee el reto y sube nivel por nivel: en cada uno solo un paso es válido. Si fallas, el juego te dice en qué nivel repensar.')] };
  }
  for (const [w, e] of Object.entries(EXAM)) U(w).exam = { id: e.id, title: e.title, minutes: 12, items: e.items.map(([lesson, review, ex]) => ({ lesson, review, ex })) };
})();
