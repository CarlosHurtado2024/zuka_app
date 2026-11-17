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
      [['Ordena: −3x⁵ + 7x² + x − 9', 'El primer término manda: 7x²'], ['El grado es el mayor exponente: 5', 'El grado es el mayor coeficiente: 7', 'El grado es el número de términos: 4'], ['grado 5', 'grado 7', 'grado 4']],
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
    P('bloques-area', 'Cada producto es un rectángulo. Di cuántas **barras** $x$ y cuántos **cuadritos** tiene', { rounds: [{ mode: 'expand', a: 2, b: 5 }, { mode: 'expand', a: 3, b: 3 }, { mode: 'expand', a: 1, b: 7 }] },
      '$(x + a)(x + b) = x^2 + (a + b)x + ab$: las barras son $a + b$ y los cuadritos de la esquina son $a \\cdot b$. Con $a = b = 3$ sale un cuadrado perfecto: $x^2 + 6x + 9$.',
      'Las barras se reparten a la derecha y abajo del cuadrado grande; los cuadritos llenan la esquina, que es un rectángulo pequeño de a por b.'),
    parejas('Une cada producto notable con su desarrollo',
      ['(x + 5)²', '(x − 5)²', '(x + 5)(x − 5)', '(2x + 3)²'],
      ['x² + 10x + 25', 'x² − 10x + 25', 'x² − 25', '4x² + 12x + 9', 'x² + 25', '4x² + 9'],
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
    escala('Construye la **fila 5** del triángulo de Pascal',
      [['Cada número: suma de los dos de arriba', 'Cada número: producto de los dos de arriba'], ['Fila 4: 1, 4, 6, 4, 1', 'Fila 4: 1, 4, 4, 4, 1'], ['Fila 5: 1, 5, 10, 10, 5, 1', 'Fila 5: 1, 5, 6, 6, 5, 1', 'Fila 5: 1, 5, 10, 5, 1']],
      'Los bordes son 1 y cada número de adentro es la suma de los dos que tiene encima: $1 + 4 = 5$, $4 + 6 = 10$, $6 + 4 = 10$, $4 + 1 = 5$.',
      'Empieza y termina con 1. Una fila n tiene n + 1 números; cada uno de adentro sale de sumar la pareja que tiene encima.'),
    parejas('Une cada potencia de un binomio con su desarrollo',
      ['(x + 1)³', '(x − 1)³', '(x + 2)³', '(x + 1)⁴'],
      ['x³ + 3x² + 3x + 1', 'x³ − 3x² + 3x − 1', 'x³ + 6x² + 12x + 8', 'x⁴ + 4x³ + 6x² + 4x + 1', 'x³ + 1', 'x³ + 2x² + 4x + 8'],
      'Los coeficientes salen de Pascal (1, 3, 3, 1 y 1, 4, 6, 4, 1). Con resta, los signos se alternan; con $+2$, cada término lleva además una potencia de 2: $3 \\cdot 2 = 6$, $3 \\cdot 4 = 12$, $8$.',
      'Cuenta los términos: una potencia n tiene n + 1. Luego mira los signos y el último término, que es el segundo número elevado a n.'),
    cuenta('Coeficiente de $x^2$ en $(x + 3)^4$', '6 * 3 ^ 2', ['4', '12'],
      'El término con $x^2$ es $\\binom{4}{2}x^2 \\cdot 3^2 = 6 \\cdot 9\\,x^2 = 54x^2$.',
      'El término con x² usa el número del centro de la fila 4 de Pascal (1, 4, 6, 4, 1); el 3 también va elevado a una potencia, y los dos exponentes suman 4.'),
    cuenta('¿Cuánto suman todos los coeficientes de $(a + b)^5$?', '2 ^ 5', ['10', '6'],
      'Con $a = b = 1$ el desarrollo es justo la suma de los coeficientes: $(1 + 1)^5 = 32$. Cada fila de Pascal suma el doble de la anterior.',
      'Prueba con las primeras filas: 1 + 1, luego 1 + 2 + 1, luego 1 + 3 + 3 + 1. ¿Qué patrón siguen esas sumas?'),
  ];
  EX['alg-24b'] = [
    P('bloques-area', 'Factorizar es encontrar los **lados** del rectángulo. Elige $a$ y $b$ para armar cada área', { rounds: [{ mode: 'factor', a: 1, b: 5 }, { mode: 'factor', a: 2, b: 4 }, { mode: 'factor', a: 3, b: 3 }, { mode: 'factor', a: 2, b: 7 }] },
      'Se buscan dos números que **sumen** el coeficiente de $x$ y **multipliquen** el término independiente: $x^2 + 6x + 5 = (x + 1)(x + 5)$, $x^2 + 6x + 8 = (x + 2)(x + 4)$ (los mismos 6 de barras, otros cuadritos), $x^2 + 6x + 9 = (x + 3)^2$ y $x^2 + 9x + 14 = (x + 2)(x + 7)$.',
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
    escala('Factoriza $3x^2 + 7x + 2$',
      [['Dos números: producto 6, suma 7', 'Dos números: producto 2, suma 7'], ['3x² + 6x + x + 2', '3x² + 6x + 2x + 2'], ['3x(x + 2) + (x + 2)', '3x(x + 2) + 2'], ['(3x + 1)(x + 2)', '(3x + 2)(x + 1)']],
      'Con coeficiente principal 3 se buscan dos números de producto $3 \\cdot 2 = 6$ y suma 7: son 6 y 1. Se parte el término del medio, se agrupa y sale el factor común $(x + 2)$.',
      'Cuando x² lleva un número, el producto que buscas es ese número por el término independiente. Comprueba al final multiplicando los dos factores.'),
    P('completa-cuadrado', 'Pasa cuadritos a la esquina hasta **completar el cuadrado** de cada polinomio', { rounds: [{ b: 6, c: 13 }, { b: 4, c: 1 }, { b: 8, c: 10 }] },
      'La esquina necesita $(b/2)^2$ cuadritos: $x^2 + 6x + 13 = (x + 3)^2 + 4$, $x^2 + 4x + 1 = (x + 2)^2 - 3$ y $x^2 + 8x + 10 = (x + 4)^2 - 6$.',
      'La mitad de las barras va a cada lado del cuadrado; el hueco de la esquina mide esa mitad por esa mitad. Lo que sobre o falte queda afuera.'),
  ];
  BOSS.polinomios = { id: 'jefe-alg-polinomios', name: 'el Maestro de los Polinomios', color: 'sky', title: 'El Maestro de los Polinomios',
    intro: ['Al cierre del mundo espera el **Maestro de los Polinomios**. Solo deja pasar a quien sepa armarlos y desarmarlos: productos notables, binomio y factorización.', 'No gana el más rápido: arma la ruta de pasos, de abajo hacia arriba, y ataca. Un paso falso te cuesta un corazón.'],
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
    cuenta('Calcula $(5 + 2i)(5 - 2i)$', '5 ^ 2 + 2 ^ 2', ['10', '21'],
      'Un complejo por su conjugado da la suma de los cuadrados: $25 - 4i^2 = 25 + 4 = 29$, porque $i^2 = -1$.',
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
      ['i²', 'i³', 'i⁴', 'i⁹', '√(−16)'], ['−1', '−i', '1', 'i', '4i', '−4', '16i'],
      'Las potencias de $i$ se repiten de cuatro en cuatro: $i, -1, -i, 1$. Como $9 = 8 + 1$, $i^9 = i$. Y $\\sqrt{-16} = \\sqrt{16}\\,\\sqrt{-1} = 4i$.',
      'Cada vez que juntas cuatro i obtienes 1. Divide el exponente entre 4 y mira lo que sobra.'),
  ];
  EX['alg-1'] = [
    escala('Resuelve $3x - 7 = 11$',
      [['3x = 11 + 7', '3x = 11 − 7'], ['x = 18 ÷ 3', 'x = 18 − 3', 'x = 4 ÷ 3'], ['x = 6', 'x = 15']],
      'Para dejar sola a $x$ se deshace cada operación con su contraria, en los dos lados: se suma 7 y luego se divide entre 3.',
      'Deshaz la resta sumando 7 en los dos lados. Después, el 3 no está restando: está multiplicando.'),
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
  BOSS.cuadraticas = { id: 'jefe-alg-cuadraticas', name: 'el Guardián de la Parábola', color: 'mint', title: 'El Guardián de la Parábola',
    intro: ['Al cierre del mundo espera el **Guardián de la Parábola**. Para pasar hay que dominar los complejos, las rectas y las ecuaciones cuadráticas.', 'Arma cada respuesta paso a paso y ataca cuando la ruta esté completa. Aquí se piensa, no se corre.'],
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
    P('division-sintetica', 'Elige el número $r$ que deja **residuo 0**: entonces $x - r$ es un factor', { rounds: [{ coef: [1, -1, -10, -8], goal: 'zero' }, { coef: [1, 0, -7, 6], goal: 'zero' }, { coef: [2, 1, -5, 2], goal: 'zero' }] },
      'El residuo de dividir entre $x - r$ es $P(r)$. Por eso las raíces dejan residuo 0: $x^3 - x^2 - 10x - 8 = (x + 1)(x + 2)(x - 4)$, $x^3 - 7x + 6 = (x - 1)(x - 2)(x + 3)$ y $2x^3 + x^2 - 5x + 2$ se anula en $x = 1$ y en $x = -2$.',
      'Solo tienes cuatro divisiones por ronda. Los candidatos enteros son los divisores del último número; y si dos residuos tienen signos contrarios, entre esos dos valores hay una raíz.'),
    P('division-sintetica', 'Ahora busca el $r$ que deja el residuo pedido', { rounds: [{ coef: [1, 1, -4, 2], goal: 'value', value: 26 }, { coef: [1, -3, 0, 5], goal: 'value', value: 1 }] },
      'El residuo es el valor del polinomio en $r$: $P(3) = 27 + 9 - 12 + 2 = 26$, y en el segundo $P(2) = 8 - 12 + 5 = 1$ (también $P(-1) = 1$).',
      'Tienes pocas divisiones: no las gastes a ciegas. Mira si el residuo que te salió se pasa o se queda corto y decide hacia dónde mover r.'),
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
      { roots: [-3, 1, 2], a: 1, xr: [-5, 4], yr: [-8, 14], mark: [0, 6] },
      { roots: [-1, -1, 2], a: 1, xr: [-4, 4], yr: [-6, 6], mark: [0, -2] },
    ] }, '1) $y = (x + 3)(x - 1)(x - 2)$, que en $x = 0$ vale 6. 2) $y = (x + 1)^2(x - 2)$: en $-1$ la curva rebota porque el cero es doble.',
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
  BOSS['grado-superior'] = { id: 'jefe-alg-grado-superior', name: 'el Guardián de las Raíces', color: 'coral', title: 'El Guardián de las Raíces',
    intro: ['Al cierre del mundo espera el **Guardián de las Raíces**. Sus retos son de división, residuos y ceros de polinomios.', 'Cada reto se responde con una ruta de pasos. Elige con calma: un paso que no se justifica cuesta un corazón.'],
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
      P('division-sintetica', 'Elige un $r$ que deje residuo 0', { rounds: [{ coef: [1, -4, 1, 6], goal: 'zero' }] }, '$x^3 - 4x^2 + x + 6 = (x + 1)(x - 2)(x - 3)$: sirven $-1$, $2$ y $3$.', 'Los candidatos son los divisores de 6, positivos y negativos; el signo de cada residuo te dice entre cuáles está la raíz.')],
    ['alg-92', 'El residuo de dividir $P(x)$ entre $x - r$ es $P(r)$.',
      cuenta('Sin dividir: residuo de $2x^3 - x + 5$ entre $x + 1$', '2 * ( -1 ) ^ 3 - -1 + 5', [], 'Teorema del residuo: $P(-1) = -2 + 1 + 5 = 4$.', 'x + 1 se anula en x = −1: evalúa ahí, con cuidado con los signos.')],
    ['alg-93', 'Cada cero $r$ aporta un factor $(x - r)$.',
      P('raices-imanes', 'Pon los imanes en los ceros y ajusta $a$', { rounds: [{ roots: [-3, 0, 2], a: 1, xr: [-5, 4], yr: [-8, 10], mark: [1, -4] }] }, '$y = x(x + 3)(x - 2)$, que en $x = 1$ vale $1 \\cdot 4 \\cdot (-1) = -4$.', 'Cada corte con el eje x es un cero.')],
    ['alg-93', 'Descartes: el número de raíces positivas es el de cambios de signo, o menor en un número par.',
      escala('¿Cuántas raíces **positivas** puede tener $x^3 + 2x^2 + x + 3$?', [['Signos: +, +, +, +', 'Signos: +, −, +, −'], ['0 cambios de signo', '3 cambios de signo'], ['Ninguna raíz positiva', '3 o 1 raíces positivas']], 'Todos los coeficientes son positivos: no hay cambios de signo y por eso no hay raíces positivas.', 'Cuenta los cambios de signo entre coeficientes seguidos.')],
  ] };

  // ====================== Río de Asíntotas ======================
  EX['alg-25a'] = [
    P('cancela-factores', '**Simplifica** cada fracción cancelando factores iguales. Cuidado: los términos que se suman no se cancelan', { rounds: [
      { top: ['x − 4', 'x + 1'], bottom: ['x + 1', 'x − 6'] }, { top: ['2', 'x + 2'], bottom: ['x + 2', 'x − 2'] }, { top: ['x', '3'], bottom: ['x'], sumTop: true }, { top: ['x', 'x − 1'], bottom: ['x − 1', 'x', 'x + 4'] },
    ] }, '$\\dfrac{(x - 4)(x + 1)}{(x + 1)(x - 6)} = \\dfrac{x - 4}{x - 6}$ y $\\dfrac{2(x + 2)}{(x + 2)(x - 2)} = \\dfrac{2}{x - 2}$. En $\\dfrac{x + 3}{x}$ la $x$ de arriba está sumando: no es un factor y no se cancela. En la última queda $\\dfrac{1}{x + 4}$.',
      'Solo se cancela lo que multiplica a TODO el piso. Si arriba hay una suma, sus pedazos no son factores.'),
    escala('¿Qué valores quedan fuera del **dominio** de $\\dfrac{x + 1}{x^2 - 4}$?',
      [['El denominador no puede ser 0', 'El numerador no puede ser 0'], ['x² − 4 = 0', 'x + 1 = 0'], ['x ≠ 2 y x ≠ −2', 'x ≠ −1', 'x ≠ 4']],
      'No se puede dividir entre cero: se excluyen los valores que anulan el denominador, $x^2 - 4 = (x - 2)(x + 2) = 0$.',
      'El numerador sí puede valer cero (la fracción da 0). Lo prohibido es el cero abajo.'),
    escala('Simplifica $\\dfrac{x^2 - 25}{x^2 + 5x}$ y di para qué $x$ vale',
      [['Factoriza arriba y abajo', 'Cancela x² arriba y abajo'], ['(x − 5) ÷ x', '−25 ÷ 5x', '(x − 5) ÷ (x + 5)'], ['Vale si x ≠ 0 y x ≠ −5', 'Vale si x ≠ 0', 'Vale para todo x']],
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
      [['Por el recíproco: x/3 · 6/x²', 'Arriba con arriba: x ÷ x²'], ['6x ÷ 3x²', 'x³ ÷ 18'], ['2 ÷ x', '2x', 'x ÷ 2']],
      'Dividir es multiplicar por el recíproco: $\\dfrac{x}{3} \\cdot \\dfrac{6}{x^2} = \\dfrac{6x}{3x^2} = \\dfrac{2}{x}$.',
      'Voltea la segunda fracción y multiplica. Luego simplifica números con números y x con x.'),
    escala('Simplifica la fracción compleja $\\dfrac{\\frac{1}{x} - \\frac{1}{2}}{x - 2}$',
      [['Arriba: (2 − x) ÷ 2x', 'Arriba: (x − 2) ÷ 2x', 'Arriba: 1 ÷ (x − 2)'], ['2 − x = −(x − 2)', '2 − x = x − 2'], ['−1 ÷ 2x', '1 ÷ 2x', '−1 ÷ (x − 2)']],
      'Arriba, con denominador común $2x$: $\\dfrac{2 - x}{2x}$. Como $2 - x = -(x - 2)$, se cancela con el $x - 2$ de abajo y queda $-\\dfrac{1}{2x}$.',
      'Resuelve primero la resta de arriba. Después fíjate en que 2 − x y x − 2 son opuestos, no iguales.'),
    escala('Mínimo común denominador de $\\dfrac{1}{x^2 - 9}$ y $\\dfrac{1}{x^2 + 3x}$',
      [['x² − 9 = (x − 3)(x + 3)', 'x² − 9 = (x − 3)²'], ['x² + 3x = x(x + 3)', 'x² + 3x = 3x(x + 1)'], ['x(x − 3)(x + 3)', 'x(x − 3)(x + 3)²', '(x − 3)(x + 3)']],
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
    P('combina-vectores', 'Ronda 1: $x + y = 5,\\; x - y = 1$. Ronda 2: $2x + y = 4,\\; x - 2y = -3$. ¿Cuántas veces va cada **columna** para llegar al lado derecho?', { rounds: [
      { u: [1, 1], v: [1, -1], target: [5, 1], names: ['c₁', 'c₂'] }, { u: [2, 1], v: [1, -2], target: [4, -3], names: ['c₁', 'c₂'] },
    ] }, 'El primero da $x = 3$, $y = 2$ y el segundo $x = 1$, $y = 2$: son las veces que entra cada columna de coeficientes.',
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
    escala('Halla los puntos donde se cortan $y = x^2$ y $y = x + 6$',
      [['x² = x + 6', 'x² + x + 6 = 0'], ['(x − 3)(x + 2) = 0', '(x + 3)(x − 2) = 0'], ['(3, 9) y (−2, 4)', '(−3, 9) y (2, 4)', '(3, 9) y (−2, −4)']],
      'En los cortes las dos $y$ son iguales: $x^2 - x - 6 = 0$, con raíces $3$ y $-2$. Cada $x$ se lleva a $y = x^2$: $9$ y $4$.',
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
  BOSS.racionales = { id: 'jefe-alg-racionales', name: 'el Guardián de las Fracciones', color: 'sky', title: 'El Guardián de las Fracciones',
    intro: ['Al cierre del mundo espera el **Guardián de las Fracciones**. No deja pasar a quien divida entre cero.', 'Arma la ruta de cada respuesta, de abajo hacia arriba, y ataca. Tienes todo el tiempo para pensar.'],
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
      P('combina-vectores', 'Resuelve $x + 2y = 4,\\; 2x - y = 3$ mirándolo por columnas', { rounds: [{ u: [1, 2], v: [2, -1], target: [4, 3], names: ['c₁', 'c₂'] }] }, '$x = 2$ y $y = 1$: $2 + 2 = 4$ y $4 - 1 = 3$.', 'La primera columna son los coeficientes de x; la segunda, los de y.')],
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
      { f: x => 2 ** x - 2, xr: [-5, 4], yr: [-4, 6], dom: [null, null, false, false], ran: [-2, null, false, false] },
      { f: x => 3 - 2 ** x, xr: [-5, 3], yr: [-5, 5], dom: [null, null, false, false], ran: [null, 3, false, false] },
    ] }, '$2^x - 2$ existe para todo $x$; restar 2 baja la asíntota: la curva se acerca a $-2$ sin tocarlo. Dominio $(-\\infty, \\infty)$, rango $(-2, \\infty)$. En $3 - 2^x$ la gráfica se voltea y sube 3: rango $(-\\infty, 3)$.',
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
      ['log₂ 8 = 3', 'log₅ 25 = 2', 'log₁₀ 0.01 = −2', 'log₃ 1 = 0'], ['2³ = 8', '5² = 25', '10⁻² = 0.01', '3⁰ = 1', '3² = 9', '2⁵ = 32'],
      '$\\log_b a = c$ quiere decir $b^c = a$: el logaritmo **es el exponente** al que hay que elevar la base.',
      'La base del logaritmo es la base de la potencia, y lo que el logaritmo vale es el exponente.'),
    P('espejo-diagonal', 'Refleja los puntos de $f(x) = 2^{x+1}$ en el espejo $y = x$ para dibujar su inversa', { rounds: [
      { f: x => 2 ** (x + 1), fTxt: '2ˣ⁺¹', pts: [[-1, 1], [0, 2], [1, 4]], t: [-5, 1.3], range: [-5, 5] },
    ] }, 'Se intercambian las coordenadas: $(1, -1)$, $(2, 0)$ y $(4, 1)$. La inversa de una exponencial es un logaritmo: aquí $y = \\log_2 x - 1$.',
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
  BOSS['exp-log'] = { id: 'jefe-alg-exp-log', name: 'el Guardián del Crecimiento', color: 'mint', title: 'El Guardián del Crecimiento',
    intro: ['Al cierre del mundo espera el **Guardián del Crecimiento**: todo lo que toca crece multiplicándose.', 'Responde cada reto con una ruta de pasos y ataca. El logaritmo es tu mejor arma: es el exponente que buscas.'],
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

  // ====================== Jefes de los mundos anteriores (spec 2026-11-20-jefes-valle-a-escalera) ======================
  BOSS.numeros = { id: 'jefe-alg-numeros', name: 'el Guardián de la Recta Real', color: 'mint', title: 'El Guardián de la Recta Real',
    intro: ['Al cierre del mundo espera el **Guardián de la Recta Real**. Conoce todas las familias: enteros, racionales, irracionales.', 'Arma la ruta de pasos de cada reto, de abajo hacia arriba, y ataca. No hay prisa: aquí gana el que piensa.'],
    phases: [
      ['Fase 1 · Enteros y racionales', [
        ['3 − 8 + (−2)', [['3 − 8 = −5', '3 − 8 = 5'], ['−5 + (−2) = −7', '−5 + (−2) = −3'], ['−7', '−3', '7']]],
        ['0.85 como fracción irreducible', [['0.85 = 85/100', '0.85 = 85/10', '0.85 = 8/5'], ['Simplifica: ÷ 5 arriba y abajo', 'Simplifica: − 5 arriba y abajo'], ['17/20', '20/17', '80/95']]],
      ]],
      ['Fase 2 · Reales y axiomas de campo', [
        ['¿√50 es racional o irracional?', [['7² = 49 y 8² = 64', '7² = 50', '√50 = 25'], ['No es cuadrado perfecto', 'Es cuadrado perfecto'], ['Irracional: no es una fracción', 'Racional: es una fracción', 'Racional: es un entero']]],
        ['Recíproco de −2/5', [['Producto con él: 1', 'Suma con él: 0'], ['−5/2', '2/5', '5/2']]],
      ]],
      ['Fase 3 · Signos, orden y valor absoluto', [
        ['(−6)(−2) − 18 ÷ (−3)', [['(−6)(−2) = 12', '(−6)(−2) = −12'], ['18 ÷ (−3) = −6', '18 ÷ (−3) = 6'], ['12 − (−6) = 18', '12 − (−6) = 6', '12 + (−6) = 18']]],
        ['Resuelve |x + 1| = 4', [['x está a 4 pasos del −1', 'x está a 4 pasos del 1', 'x está a 4 pasos del 0'], ['x = −1 + 4  o  x = −1 − 4', 'x = −1 + 4 solamente'], ['x = 3  o  x = −5', 'x = 3', 'x = 5  o  x = −3']]],
      ]],
    ] };
  BOSS.razones = { id: 'jefe-alg-razones', name: 'el Guardián de las Proporciones', color: 'sky', title: 'El Guardián de las Proporciones',
    intro: ['Al cierre del mundo espera el **Guardián de las Proporciones**. Nadie le hace trampa con una razón ni con un porcentaje.', 'Responde cada reto con una ruta de pasos y ataca. Un paso que no se justifica cuesta un corazón.'],
    phases: [
      ['Fase 1 · Razones y proporciones', [
        ['Hay 10 rojas y 4 azules: razón de rojas a azules', [['10 : 4', '4 : 10', '10 : 14'], ['Divide los dos entre 2', 'Resta 2 a los dos'], ['5 : 2', '2 : 5', '8 : 2']]],
        ['4/10 = x/25', [['10 · x = 4 · 25', '4 · x = 10 · 25', 'x = 25 − 10 + 4'], ['x = 100 ÷ 10', 'x = 250 ÷ 4'], ['x = 10', 'x = 62.5', 'x = 19']]],
      ]],
      ['Fase 2 · Regla de tres y porcentajes', [
        ['6 obreros tardan 10 días. ¿Cuánto tardan 4?', [['Menos obreros, más días: inversa', 'Menos obreros, menos días: directa'], ['6 · 10 = 4 · x', '6/10 = 4/x'], ['15 días', '6.7 días', '8 días']]],
        ['¿Qué porcentaje es 27 de 60?', [['27 ÷ 60', '60 ÷ 27', '60 − 27'], ['0.45', '≈ 2.22', '33'], ['45 %', '4.5 %', '33 %']]],
      ]],
      ['Fase 3 · Aumentos y cambios sucesivos', [
        ['Un precio de 120 sube 35 %', [['Factor 1.35', 'Factor 0.35', 'Factor 0.65'], ['120 · 1.35 = 162', '120 + 35 = 155', '120 · 1.35 = 120.35']]],
        ['Bajar 30 % y luego subir 30 %', [['Factores 0.7 y 1.3', 'Factores 0.3 y 1.3', 'Los cambios se cancelan'], ['0.7 · 1.3 = 0.91', '0.7 · 1.3 = 1', '0.7 · 1.3 = 1.09'], ['Queda 9 % por debajo', 'Queda igual', 'Queda 9 % por encima']]],
      ]],
    ] };
  BOSS.potencias = { id: 'jefe-alg-potencias', name: 'el Guardián de los Exponentes', color: 'coral', title: 'El Guardián de los Exponentes',
    intro: ['Al cierre del mundo espera el **Guardián de los Exponentes**: sube y baja exponentes sin equivocarse nunca.', 'Arma la ruta de cada reto y ataca. Lee con cuidado los paréntesis y los signos.'],
    phases: [
      ['Fase 1 · Potencias', [
        ['(−1)⁷ + (−2)²', [['(−1)⁷ = −1', '(−1)⁷ = 1', '(−1)⁷ = −7'], ['(−2)² = 4', '(−2)² = −4'], ['3', '5', '−5']]],
        ['Calcula 2⁻³', [['2⁻³ = 1 ÷ 2³', '2⁻³ = −2³', '2⁻³ = 2 · (−3)'], ['1/8', '−8', '−6']]],
      ]],
      ['Fase 2 · Leyes de los exponentes', [
        ['x⁶ · x³ ÷ x⁴', [['x⁶ · x³ = x⁹', 'x⁶ · x³ = x¹⁸'], ['x⁹ ÷ x⁴ = x⁵', 'x⁹ ÷ x⁴ = x¹³', 'x⁹ ÷ x⁴ = x³⁶']]],
        ['(2x³)²', [['Va al 2 y a x³', 'Solo va a x³'], ['2² · x⁶', '2 · x⁶', '2² · x⁵'], ['4x⁶', '2x⁶', '4x⁵']]],
      ]],
      ['Fase 3 · Raíces y radicales', [
        ['√50 + √8', [['√50 = 5√2', '√50 = 2√5', '√50 = 25√2'], ['√8 = 2√2', '√8 = 4√2'], ['7√2', '√58', '9√2']]],
        ['Racionaliza 6 ÷ √3', [['Por √3 arriba y abajo', 'Por √3 solo abajo', 'Eleva todo al cuadrado'], ['6√3 ÷ 3', '6 ÷ 3'], ['2√3', '2', '6√3']]],
      ]],
    ] };
  BOSS.progresiones = { id: 'jefe-alg-progresiones', name: 'el Guardián de las Series', color: 'mint', title: 'El Guardián de las Series',
    intro: ['Al cierre del mundo espera el **Guardián de las Series**. Cuenta saltos, no términos.', 'Cada reto se responde con una ruta de pasos. Elige con calma y ataca cuando la ruta esté completa.'],
    phases: [
      ['Fase 1 · Progresiones aritméticas', [
        ['Término 10 de 3, 7, 11, …', [['d = 4', 'd = 3'], ['Del 1 al 10: 9 saltos', 'Del 1 al 10: 10 saltos'], ['a₁₀ = 3 + 9 · 4 = 39', 'a₁₀ = 3 + 10 · 4 = 43', 'a₁₀ = 3 + 9 · 3 = 30']]],
        ['1 + 2 + 3 + … + 40', [['Parejas que suman 41', 'Parejas que suman 40'], ['Hay 20 parejas', 'Hay 40 parejas'], ['820', '1640', '800']]],
      ]],
      ['Fase 2 · Progresiones geométricas', [
        ['Término 4 de 2, 10, 50, …', [['r = 5', 'r = 8'], ['3 multiplicaciones por r', '4 multiplicaciones por r'], ['a₄ = 2 · 5³ = 250', 'a₄ = 2 · 5⁴ = 1250', 'a₄ = 2 · 8³ = 1024']]],
        ['Suma infinita 12 + 6 + 3 + …', [['r = ½', 'r = 2'], ['S = a₁ ÷ (1 − r)', 'S = a₁ ÷ (1 + r)', 'S = a₁ · r'], ['S = 12 ÷ (1 − ½) = 24', 'S = 12 ÷ (1 + ½) = 8', 'S = 12 · ½ = 6']]],
      ]],
      ['Fase 3 · Sumatoria', [
        ['Σ (2k + 1), con k de 1 a 4', [['3 + 5 + 7 + 9', '2 + 4 + 6 + 8 + 1', '1 + 3 + 5 + 7'], ['24', '21', '16']]],
        ['Σ 8, con k de 1 a 7', [['Un 8 por cada k', 'Un solo 8 en total'], ['8 · 7', '8 + 7', '8 · 1'], ['56', '15', '8']]],
      ]],
    ] };
  EXAM.progresiones = { id: 'exam-alg-progresiones', title: 'Progresiones y sumatoria', items: [
    ['alg-14', 'Del término 1 al término $n$ hay $n - 1$ saltos: $a_n = a_1 + (n - 1)d$.',
      cuenta('Término 12 de la progresión aritmética $5, 8, 11, \\dots$', '5 + 11 * 3', ['12'], 'La diferencia es 3 y del término 1 al 12 hay 11 saltos: $5 + 11 \\cdot 3 = 38$.', 'Cuenta los saltos, no los términos: para llegar al término 12 no se dan 12 saltos.')],
    ['alg-14b', 'Suma aritmética: $S_n = \\dfrac{n(a_1 + a_n)}{2}$, la mitad del rectángulo que forman dos escaleras.',
      escala('Suma de los primeros 10 términos de $2, 4, 6, \\dots$', [['a₁₀ = 2 + 9 · 2 = 20', 'a₁₀ = 2 + 10 · 2 = 22'], ['S = 10 · (2 + 20) ÷ 2', 'S = 10 · (2 + 20)'], ['110', '220', '100']], 'El décimo término es 20 y la suma es $\\dfrac{10 \\cdot 22}{2} = 110$.', 'Primero el último término (9 saltos de 2). Después, las parejas de extremos suman lo mismo y hay la mitad de parejas que de términos.')],
    ['alg-14c', 'En una progresión geométrica cada término es el anterior por la razón: es una multiplicación repetida.',
      cuenta('Una bacteria se parte en dos cada hora. Si empieza una sola, ¿cuántas hay a las 6 horas?', '2 ^ 6', ['12', '7'], 'Cada hora se duplica lo que había: de la hora 0 a la 6 hay seis multiplicaciones por 2, $2^6 = 64$.', 'No se suman 2 por hora: cada hora se duplica lo que ya había.', 'bacterias')],
    ['alg-14d', 'Para sumar una geométrica se multiplica la suma por la razón y se resta: casi todo se cancela.',
      P('resta-corrida', 'Tacha las parejas iguales para sumar $3 + 6 + 12 + 24 + 48$', { rounds: [{ a1: 3, r: 2, n: 5 }] }, '$2S - S = 96 - 3$, así que $S = 93$.', 'Al multiplicar por la razón, la lista se corre un lugar: busca los números que quedan repetidos arriba y abajo.')],
    ['alg-15', 'La sumatoria se reparte: $\\sum (ck + d) = c\\sum k + d \\cdot n$; la constante se suma una vez por cada $k$.',
      P('parte-sigma', 'Separa $\\sum (2k + 4)$, con $k$ de 1 a 6, en azules y amarillas', { rounds: [{ c: 2, d: 4, hi: 6 }] }, '$2\\sum k + 4 \\cdot 6 = 2 \\cdot 21 + 24 = 66$.', 'Las amarillas aparecen en todas las columnas: cuéntalas en total, no solo en una.')],
  ] };

  // ====================== Escenas de respaldo (spec 2026-11-21-dinamicos-mundos-altos) ======================
  // Lo que se ve si el video no carga: la misma historia y los mismos ejemplos del video zoom de cada lección
  // (`video/valle-zoom/films/<nombre>.js`, FILM.NARR). [segundos, texto, { title, steps }]
  const SC = {
    'alg-23a': [   // polinomios
      [5, 'Caro tiene una caja de bloques: **cuadrados** de lado $x$, **barras** de $x$ por 1 y **cuadritos** de 1 por 1. ¿Cómo anotarla sin dibujarla?', { title: 'La caja de Caro' }],
      [6, 'Dos cuadrados, tres barras y cuatro cuadritos se escriben $2x^2 + 3x + 4$. La $x$ es la variable y el número que la multiplica, el coeficiente.', { title: '$2x^2 + 3x + 4$' }],
      [6, 'El **grado** es el mayor exponente, aunque no esté de primero. Un cubo de lado $x$ es $x^3$; un número solo, distinto de cero, tiene grado 0.', { steps: ['Mayor exponente 3: grado 3', 'El término sin $x$ es el independiente'] }],
      [6, 'Para sumar se juntan piezas iguales: cuadrados con cuadrados, barras con barras. Una barra y una barra roja (negativa) se anulan. Un cuadrado y una barra no se juntan.', { title: 'Términos semejantes' }],
      [6, 'Multiplicar es armar un rectángulo: con lados $x + 1$ y $x + 4$ lo llenan un cuadrado, cinco barras y cuatro cuadritos. Los grados se suman.', { title: '$(x + 1)(x + 4) = x^2 + 5x + 4$' }],
      [5, 'Y la sorpresa: con $x = 10$, la caja de Caro se lee $234$. Sus cifras son los coeficientes.', { title: '$2 \\cdot 10^2 + 3 \\cdot 10 + 4 = 234$' }],
    ],
    'alg-3': [   // notables
      [5, 'Beto tiene una mesa cuadrada de lado $x$ y la agranda 4 por cada lado. Calcula $x^2 + 16$… pero al armarla le faltan dos tablas.', { title: 'La mesa de Beto' }],
      [6, 'Faltaban dos rectángulos de $4$ por $x$. Al elevar una suma al cuadrado aparece el **doble producto**.', { title: '$(x + 4)^2 = x^2 + 8x + 16$' }],
      [6, 'Con una resta, el doble producto resta: $99^2 = (100 - 1)^2 = 10\\,000 - 200 + 1 = 9801$.', { title: '$(a - b)^2 = a^2 - 2ab + b^2$' }],
      [6, 'A un cuadrado de lado $a$ se le quita una esquina $b$ y la tira se pasa abajo: queda un rectángulo. Así, $21 \\cdot 19 = 20^2 - 1 = 399$.', { title: '$(a + b)(a - b) = a^2 - b^2$' }],
      [6, 'Si los dos binomios comparten la $x$: un cuadrado, ocho barras y doce cuadritos. Ocho es $6 + 2$; doce, $6 \\cdot 2$.', { title: '$(x + 6)(x + 2) = x^2 + 8x + 12$' }],
    ],
    'alg-24c': [   // binomio
      [5, 'Ana debe desarrollar $(a + b)^4$. Son cuatro paréntesis y una letra de cada uno: **dieciséis productos**. ¿Hay un atajo?', { title: '$(a + b)^4$' }],
      [6, 'Los números de las potencias pequeñas forman un triángulo: el de **Pascal**. Cada número suma los dos de arriba.', { steps: ['$1 \\quad 2 \\quad 1$', '$1 \\quad 3 \\quad 3 \\quad 1$', '$1 \\quad 4 \\quad 6 \\quad 4 \\quad 1$'] }],
      [6, 'La fila $1, 4, 6, 4, 1$ suma 16: los dieciséis productos de Ana, agrupados en cinco términos.', { title: '$1 + 4 + 6 + 4 + 1 = 16$' }],
      [6, 'Los exponentes de $a$ bajan de 4 a 0 y los de $b$ suben de 0 a 4: en cada término suman 4.', { title: '$a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$' }],
      [6, '¿Por qué el del medio lleva un 6? Para $a^2b^2$, dos de los cuatro paréntesis dan $b$: hay 6 maneras de elegirlos. En $(x + 2)^4$ ese término es $6 \\cdot x^2 \\cdot 2^2$.', { title: '$\\binom{4}{2} = 6$' }],
    ],
    'alg-24b': [   // factorizacion
      [5, 'Caro tiene un montón de bloques: un cuadrado, cinco barras y seis cuadritos. ¿Puede armar con todos un **rectángulo**?', { title: '$x^2 + 5x + 6$' }],
      [6, 'Armar el rectángulo es hallar sus lados: eso es **factorizar**, convertir una suma en producto. Lo más fácil es el factor común: tres filas de $x + 2$.', { title: '$3x + 6 = 3(x + 2)$' }],
      [6, 'A un cuadrado de lado $x$ se le quita una esquina de 4 por 4 y la tira se pasa abajo: sale un rectángulo.', { title: '$x^2 - 16 = (x + 4)(x - 4)$' }],
      [6, 'El montón de Caro: tres barras a un lado, dos al otro, y los seis cuadritos llenan el hueco. $2 \\cdot 3 = 6$ y $2 + 3 = 5$.', { title: '$x^2 + 5x + 6 = (x + 2)(x + 3)$' }],
      [6, 'No todo montón se arma: con siete cuadritos, uno sobra. Entonces se **completa el cuadrado**: de $x^2 + 8x + 20$, las barras se reparten cuatro y cuatro y la esquina pide 16.', { title: '$x^2 + 8x + 20 = (x + 4)^2 + 4$' }],
    ],
    'alg-23c': [   // complejos
      [5, 'El acertijo de Beto: un número cuyo cuadrado sea $-1$. En la recta no hay ninguno: $3^2 = 9$ y $(-3)^2 = 9$. Ningún cuadrado cae del lado negativo.', { title: '$x^2 = -1$' }],
      [5, 'Inventemos uno: $i$, con $i^2 = -1$. Entonces $\\sqrt{-25} = 5i$. Pero ¿dónde vive $i$?', { title: '$i^2 = -1$' }],
      [6, 'Multiplicar por $-1$ es dar media vuelta. Multiplicar por $i$ es un **cuarto de vuelta**: dos cuartos hacen media vuelta, y por eso $i \\cdot i = -1$.', { title: 'Girar' }],
      [6, 'Los complejos forman un plano: $2 + 3i$ es 2 al ancho y 3 hacia arriba. Se suman real con real e imaginaria con imaginaria, y se multiplican como binomios.', { title: '$a + bi$' }],
      [6, 'El **conjugado** de $3 + 4i$ es su reflejo, $3 - 4i$. Su distancia al origen, el módulo, es 5, y su producto da 25: con eso se divide.', { title: '$(3 + 4i)(3 - 4i) = 25$' }],
    ],
    'alg-1': [   // lineales
      [5, 'Ana compra baldosas. Tres cajas cerradas iguales y cuatro sueltas pesan lo mismo que 25 baldosas. ¿Cuántas trae cada caja?', { title: '$3x + 4 = 25$' }],
      [6, 'La regla de la balanza: lo que se hace en un lado, se hace en el otro. Se quitan las 4 sueltas de los dos lados y se reparte entre las 3 cajas.', { steps: ['$3x = 21$', '$x = 7$'] }],
      [6, 'Con cajas en los dos lados, primero se quita una caja de cada lado y luego las sueltas.', { title: '$4x + 3 = x + 15$', steps: ['$3x + 3 = 15$', '$3x = 12$', '$x = 4$'] }],
      [5, 'Con paréntesis, primero se reparte. Una fracción se quita multiplicando todo por su denominador.', { title: 'Despejar es deshacer en orden inverso' }],
      [5, 'Hay balanzas que nunca se equilibran: si sale $1 = 3$, no hay solución. Si sale $0 = 0$, todas las $x$ sirven.', { steps: ['$1 = 3$: sin solución', '$0 = 0$: infinitas'] }],
    ],
    'alg-4a': [   // parabola
      [5, 'Caro diseña una fuente. ¿Qué tan alto subirá el chorro? La curva más sencilla es $y = x^2$: da la vuelta en un punto, el **vértice**, y es simétrica.', { title: '$y = x^2$' }],
      [6, 'Para moverla: $x - 4$ la corre 4 a la derecha y el $+1$ la sube 1. En la forma canónica el vértice se lee: $(h, k)$.', { title: '$y = (x - 4)^2 + 1$' }],
      [6, 'Si la fórmula viene sin armar, se **completa el cuadrado**: las 4 barras se reparten dos y dos, la esquina pide 4 y de los 7 sobran 3.', { title: '$x^2 + 4x + 7 = (x + 2)^2 + 3$' }],
      [5, 'El vértice es $(-2, 3)$, y como abre hacia arriba, 3 es el mínimo. Atajo: $h = -\\dfrac{b}{2a}$.', { title: '$h = -\\dfrac{b}{2a}$' }],
      [6, 'El chorro de Caro: $y = -x^2 + 4x + 1$. Con $a$ negativo abre hacia abajo. $h = 2$ y $k = 5$: sube 5 metros, a 2 metros de la boquilla.', { title: 'Vértice $(2, 5)$' }],
    ],
    'alg-4': [   // cuadraticas
      [5, 'El chorro de Caro sube 5 metros. ¿Dónde cae el agua? Donde la altura vale cero: en las **raíces**.', { title: '$y = 0$' }],
      [6, 'Si un producto da cero, algún factor es cero. Dos números de producto $-6$ y suma $-1$: $-3$ y $2$.', { title: '$x^2 - x - 6 = (x - 3)(x + 2) = 0$', steps: ['$x = 3$', '$x = -2$'] }],
      [6, 'Si no se deja factorizar, la **fórmula general** sirve para cualquiera. Sale de completar el cuadrado.', { title: '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$' }],
      [6, 'En la fuente, $-x^2 + 4x + 1 = 0$ da $x = 2 \\pm \\sqrt5$. El agua cae en $2 + \\sqrt5 \\approx 4.24$ m; la otra raíz queda detrás de la boquilla y no sirve.', { title: '$x = 2 \\pm \\sqrt5$' }],
      [6, 'Lo de adentro de la raíz cuenta las raíces: positivo, la parábola cruza dos veces; cero, toca una; negativo, ninguna (son complejas).', { title: '$b^2 - 4ac$' }],
    ],
    'alg-23b': [   // division
      [5, 'Ana dibuja el perfil de una cordillera: un polinomio de grado 3. La vía del tren va a altura cero y uno de sus cruces es $x = 1$.', { title: '$P(x) = x^3 - 2x^2 - 5x + 6$' }],
      [6, 'Se divide como con números: 47 caramelos en bolsas de 5 dan 9 bolsas y sobran 2. Lo que sobra es menor que una bolsa.', { title: '$47 = 5 \\cdot 9 + 2$' }],
      [6, 'Con polinomios igual: dividendo = divisor · cociente + residuo, y el residuo tiene grado menor que el divisor.', { title: '$P = D \\cdot Q + R$' }],
      [6, 'Al dividir la cordillera entre $x - 1$ por pasos, el residuo es 0: $x - 1$ cabe justo, es un **factor**.', { title: '$P(x) = (x - 1)(x^2 - x - 6)$' }],
      [6, 'Y un camino sin dividir: escribir $(x - 1)(x^2 + ax + b) + r$, multiplicar y comparar. Dos polinomios iguales tienen los mismos coeficientes.', { steps: ['$a = -1$', '$b = -6$', '$r = 0$'] }],
    ],
    'alg-92': [   // residuo
      [5, 'Beto ve la cordillera de Ana entre la niebla y apuesta: la vía también cruza en $x = 2$. Para saberlo habría que dividir entre $x - 2$…', { title: '¿Cruza en 2?' }],
      [6, 'Pero el residuo tiene un secreto. En $P(x) = (x - 2)\\,Q(x) + R$, al poner $x = 2$ el primer pedazo desaparece: **el residuo es $P(2)$**.', { title: 'Teorema del residuo' }],
      [6, '$P(2) = 8 - 8 - 10 + 6 = -4$: Beto pierde. En cambio $P(3) = 27 - 18 - 15 + 6 = 0$: ahí sí cruza.', { steps: ['$P(2) = -4$', '$P(3) = 0$'] }],
      [5, '**Teorema del factor**: si $P(c) = 0$, entonces $x - c$ es un factor de $P$. Y al revés.', { title: '$P(c) = 0 \\iff (x - c)$ es factor' }],
      [6, 'La **división sintética** divide sin escribir las $x$: los coeficientes en fila y el 3 al lado. Baja el 1; por 3 y se suma, hasta el final. La última casilla es el residuo.', { title: '$1 \\;\\; -2 \\;\\; -5 \\;\\; 6 \\;\\to\\; 1 \\;\\; 1 \\;\\; -2 \\;\\; 0$' }],
    ],
    'alg-93': [   // ceros
      [5, 'La cordillera de Caro también es de grado 3, pero cruza la vía una sola vez, en $x = 1$. Y un teorema dice: grado 3, **tres ceros**. ¿Dónde están los otros dos?', { title: 'Teorema fundamental del álgebra' }],
      [6, 'Una montaña con un factor repetido cruza en $-1$ y en $2$ toca la vía y se devuelve: es un cero **doble** y cuenta dos veces. Repetido impar cruza; par, rebota.', { title: '$(x + 1)(x - 2)^2$' }],
      [6, 'Con coeficientes enteros, un cero racional $\\tfrac{c}{d}$ tiene $c$ divisor del último coeficiente y $d$ divisor del primero. Quedan pocos candidatos.', { title: 'Ceros racionales' }],
      [6, 'Los signos de los coeficientes cambian tres veces: tres ceros positivos, o uno. Con $-x$ no cambian: ningún cero negativo.', { title: 'Regla de los signos de Descartes' }],
      [6, 'Al dividir entre $x - 1$ queda una parábola con discriminante negativo: sus ceros son $1 + i$ y $1 - i$. Con coeficientes reales, los complejos llegan en pareja.', { title: '$1,\\; 1 + i,\\; 1 - i$' }],
    ],
    'alg-25a': [   // dominio
      [5, 'Beto camina por un sendero junto al río. El sendero sigue una fracción de polinomios: una **expresión racional**. Pero en dos puntos la fórmula falla.', { title: '$\\dfrac{x^2 - 1}{x^2 + 2x - 3}$' }],
      [6, 'En $-3$ y en $1$ el denominador da cero, y dividir entre cero no se puede: 6 entre 0, ¿cuántos grupos de cero? Ninguna cantidad sirve.', { title: 'El denominador no puede ser 0' }],
      [6, 'Cerca de cero, $\\tfrac{1}{x}$ se dispara: 10, 100, 1000… Sube pegada a una recta que nunca toca: una **asíntota**.', { title: '$y = \\dfrac{1}{x}$' }],
      [6, 'Se factoriza arriba y abajo y aparece $x - 1$ en los dos: se cancela. Ojo: solo se cancelan **factores**; en $x + 5$, el 5 no es un factor.', { title: '$\\dfrac{(x - 1)(x + 1)}{(x - 1)(x + 3)} = \\dfrac{x + 1}{x + 3}$' }],
      [6, 'El dominio se mira en la fracción original: todos los reales menos $-3$ y $1$. En $-3$ hay un río (asíntota); en $1$, solo un hueco.', { steps: ['$x = -3$: asíntota', '$x = 1$: un hueco'] }],
    ],
    'alg-25b': [   // fracciones
      [5, 'Ana sola llena el estanque en 3 horas; Beto solo, en 6. ¿Cuánto tardan juntos? No es el promedio: con ayuda, Ana tardaría menos de 3.', { title: '¿Juntos?' }],
      [6, 'Hay que pensar en cuánto llenan **por hora**: un tercio y un sexto. Se pasan a sextos, el denominador común.', { title: '$\\dfrac13 + \\dfrac16 = \\dfrac26 + \\dfrac16 = \\dfrac12$' }],
      [5, 'Medio estanque por hora. Para llenar uno entero: 1 entre $\\tfrac12$. Se voltea: **2 horas**.', { title: '$1 \\div \\dfrac12 = 2$' }],
      [6, 'Con letras es igual: si Ana tarda $x$ horas y Beto 3 más, el denominador común es $x(x + 3)$ y cada fracción se completa con lo que le falta.', { title: '$\\dfrac1x + \\dfrac1{x + 3} = \\dfrac{2x + 3}{x(x + 3)}$' }],
      [6, 'El tiempo de los dos es 1 entre esa suma: una fracción dentro de otra. Se voltea. Con $x = 3$ da 2, como con números.', { title: '$\\dfrac{x(x + 3)}{2x + 3}$' }],
    ],
    'alg-101': [   // sistemas
      [5, 'Caro navega por el río. A favor de la corriente va a 15 km/h; en contra, solo a 9. ¿Cuánto pone el bote y cuánto el río?', { title: '$v + c = 15, \\quad v - c = 9$' }],
      [6, 'Con una sola pista no alcanza: $v + c = 15$ tiene muchas soluciones, y todas forman una recta. La segunda pista es otra recta; la solución es donde se **cortan**.', { title: '$v = 12, \\; c = 3$' }],
      [6, 'Tres caminos sin dibujar: **reducción** (se suman y $c$ desaparece: $2v = 24$), **sustitución** ($v = 15 - c$) e **igualación**.', { steps: ['Reducción', 'Sustitución', 'Igualación'] }],
      [5, 'Si las rectas son paralelas, no hay solución. Si son la misma recta, hay infinitas.', { title: '¿Cuántas soluciones?' }],
      [6, 'Con tres incógnitas se arma una escalera: abajo queda $z = 2$; un escalón arriba, $y = 3$; y arriba, $x = 4$.', { title: 'Escalonar' }],
    ],
    'alg-102': [   // parciales
      [5, 'Beto dibuja el mapa del río: una curva enredada entre dos ríos, en $x = 1$ y $x = -1$. Esa curva esconde un secreto.', { title: '$\\dfrac{3x + 1}{x^2 - 1}$' }],
      [6, 'Antes: ¿dónde se cortan una orilla curva, $y = x^2$, y un puente recto, $y = 2x + 3$? Donde las alturas son iguales.', { title: '$x^2 = 2x + 3$', steps: ['$(x - 3)(x + 1) = 0$', '$(3, 9)$ y $(-1, 1)$'] }],
      [6, 'Igualar también sirve para partir fracciones. Se factoriza el denominador y cada factor lineal pone una fracción con una letra.', { title: '$\\dfrac{3x + 1}{(x - 1)(x + 1)} = \\dfrac{A}{x - 1} + \\dfrac{B}{x + 1}$' }],
      [6, 'Un factor cuadrático pide $Bx + C$ arriba; uno repetido, una fracción por cada potencia. Y la fracción debe ser propia: si no, se divide antes.', { title: 'La forma de cada pedazo' }],
      [6, 'Se igualan los numeradores: $A + B = 3$ y $A - B = 1$, así que $A = 2$ y $B = 1$. La curva enredada es dos fracciones simples.', { title: '$\\dfrac{2}{x - 1} + \\dfrac{1}{x + 1}$' }],
    ],
    'alg-71': [   // lirios
      [5, 'En la laguna flota un lirio y cada día los lirios se **duplican**: 1, 2, 4, 8, 16… El día 10 cubren toda la laguna. ¿Qué día estaba medio llena?', { title: 'Los lirios de Caro' }],
      [6, 'La fórmula es $y = 2^x$: cada paso a la derecha, el doble; hacia atrás, la mitad. Se acerca a cero y nunca llega: el eje $x$ es una asíntota.', { title: '$y = 2^x$' }],
      [6, '$x$ puede ser cualquier real; $y$ siempre es positiva. Con base mayor que 1 la curva sube; con base $\\tfrac12$ es su espejo y decrece.', { steps: ['Dominio: todos los reales', 'Rango: $(0, \\infty)$'] }],
      [5, 'Hay una base muy especial: $e \\approx 2.72$, a la que se acerca $\\left(1 + \\tfrac1n\\right)^n$. $e^x$ es el crecimiento continuo.', { title: '$e \\approx 2.72$' }],
      [6, 'Para hallar un exponente se igualan las bases. Medio llena son 512 lirios, y $512 = 2^9$: fue el **día 9**, no el 5. Un día después, llena.', { title: '$2^x = 2^9 \\Rightarrow x = 9$' }],
    ],
    'alg-13b': [   // interes
      [5, 'Beto tiene 2 millones y quiere duplicarlos. Dos bancos le ofrecen el 6 % anual: uno con interés **simple** y otro **compuesto**. El primer año pagan igual: 120 000.', { title: '¿Da lo mismo?' }],
      [6, 'Interés simple: siempre sobre el capital inicial. Cada año, los mismos 120 000. El monto crece en línea recta y llega a 4 millones en el año 17.', { title: '$I = C \\cdot i \\cdot t$' }],
      [6, 'Interés compuesto: el interés se suma al capital. El segundo año paga sobre lo que ya creció: 7200 más. El interés también gana interés.', { title: '$M = C(1 + i)^n$' }],
      [5, 'Cada año se multiplica por 1.06: es una función exponencial del tiempo. La curva se despega de la recta y pasa los 4 millones en el año 12.', { title: '$\\times 1.06$ cada año' }],
      [6, 'Y al revés: para tener una meta, se divide entre el factor de todos los años. Si la tasa es mensual, $n$ cuenta meses.', { title: '$C = \\dfrac{M}{(1 + i)^n}$' }],
    ],
    'alg-72': [   // logaritmos
      [5, 'Caro recibe un pedido de mil lirios. ¿Qué día tendrá la laguna mil? $2^9 = 512$ es poco y $2^{10} = 1024$ se pasa: está entre 9 y 10.', { title: '$2^x = 1000$' }],
      [6, 'La pregunta va al revés, y para eso está el **logaritmo**: $\\log_2 32$ pregunta «¿2 a qué da 32?». A 5. El logaritmo es un exponente.', { title: '$\\log_2 32 = 5$' }],
      [6, 'Su gráfica es el espejo de la exponencial: solo acepta números positivos, y el logaritmo de 1 es 0.', { steps: ['Dominio: $(0, \\infty)$', '$\\log_b 1 = 0$'] }],
      [6, 'Como $4 \\cdot 16 = 64$ es $2 + 4 = 6$ en exponentes: el logaritmo de un producto es una suma; el de un cociente, una resta; y una potencia sale adelante. El de una suma no se parte.', { title: '$\\log(ab) = \\log a + \\log b$' }],
      [6, 'Para otra base se divide entre el logaritmo de la base: $\\log_2 1000 = \\dfrac{3}{0.301} \\approx 9.97$. El pedido está listo casi al final del día 9.', { title: 'Cambio de base' }],
    ],
    'alg-73': [   // ecuaciones
      [5, 'Beto ahora quiere **triplicar** sus 2 millones al 6 % anual compuesto. La incógnita queda arriba, en el exponente.', { title: '$1.06^{\\,t} = 3$' }],
      [6, 'El camino fácil: igualar bases. 8 y 4 son potencias de 2; con la misma base se igualan los exponentes.', { title: '$8^x = 4^{x + 1}$', steps: ['$2^{3x} = 2^{2x + 2}$', '$3x = 2x + 2$', '$x = 2$'] }],
      [6, 'Pero 1.06 y 3 no se dejan escribir con la misma base. Se toma logaritmo a los dos lados y el exponente baja como factor.', { title: '$t = \\dfrac{\\ln 3}{\\ln 1.06} \\approx 18.85$' }],
      [6, 'Las ecuaciones con logaritmos van al revés: se juntan y se pasa a potencia. $\\log_2 x + \\log_2(x - 2) = 3$ da $x(x - 2) = 8$.', { steps: ['$x = 4$', '$x = -2$'] }],
      [5, 'La trampa: $-2$ no tiene logaritmo. Hay que mirar el dominio; solo sirve $x = 4$.', { title: 'Cuidado con las soluciones extrañas' }],
    ],
  };

  // ====================== Juego dinámico de cada lección (spec 2026-11-21-dinamicos-mundos-altos) ======================
  // Va de último en la lección, ligado a la historia de su video y con una mecánica distinta en cada una. Sin reloj.
  const DYN = {
    'alg-23a': P('torre-grados', 'Apila los términos **de mayor a menor exponente**: el primero dice el grado', { rounds: [
      { title: 'Ordena y di el grado', items: [{ terms: [[3, 1], [-2, 4], [7, 0], [1, 2]] }, { terms: [[9, 0], [1, 3], [-5, 1]] }] },
      { title: 'Ojo con los coeficientes grandes', items: [{ terms: [[12, 1], [-1, 5], [8, 2], [-3, 0]] }, { terms: [[20, 0], [6, 2], [1, 6], [-4, 3], [2, 1]] }] },
    ] }, 'El grado es el mayor exponente de la variable, aunque ese término no esté de primero ni tenga el coeficiente más grande. El número solo es el término de grado 0.',
      'No mires el número que multiplica: mira el pequeño número de arriba de la x. Una x sola tiene exponente 1 y un número sin x, exponente 0.'),
    'alg-3': P('arma-la-mesa', 'Completa cada mesa: elige las piezas que le faltan y toca «Listo»', { rounds: [
      { title: 'La mesa crece por los dos lados', items: [{ a: 3, pieces: ['3x', '9', '3x', '6', 'x', '3'] }, { a: 7, pieces: ['49', '7x', '14', '7x', '7', '2x'] }] },
      { title: 'Más mesas', items: [{ a: 2, pieces: ['2x', '4', '2', '2x', 'x', '8'] }, { a: 6, pieces: ['36', '6x', '12', '6x', '6', '3x'] }] },
    ] }, 'Al crecer $a$ por lado, a la mesa $x^2$ le hacen falta **dos** tablas de $a$ por $x$ y la esquina de $a$ por $a$: $(x + a)^2 = x^2 + 2ax + a^2$.',
      'La esquina sola no alcanza: a la derecha y abajo quedan dos huecos largos, tan largos como el lado de la mesa.'),
    'alg-24c': P('camino-pascal', 'Traza **todos** los caminos desde la punta hasta la estrella, bajando casilla por casilla', { rounds: [
      { title: 'Pocos caminos', items: [{ row: 2, k: 1 }, { row: 3, k: 1 }] },
      { title: 'Cuenta con orden', items: [{ row: 3, k: 2 }, { row: 4, k: 1 }] },
    ] }, 'A cada casilla se llega desde las dos de arriba, así que sus caminos son la suma de los de esas dos: por eso cada número de Pascal suma los dos de encima, y por eso cuenta maneras de elegir.',
      'Para no repetir ni olvidar, decide en qué fila das el paso a la derecha: primero lo más arriba posible, luego una fila más abajo, y así.'),
    'alg-24b': P('reparte-barras', 'Reparte las barras a los dos lados para **armar el rectángulo**. Si ningún reparto sirve, dilo', { rounds: [
      { title: 'Montones que se arman', items: [{ s: 7, p: 10 }, { s: 8, p: 15 }] },
      { title: 'No todo montón se arma', items: [{ s: 6, p: 7 }, { s: 9, p: 20 }, { s: 5, p: 5 }] },
    ] }, '$x^2 + 7x + 10 = (x + 2)(x + 5)$ y $x^2 + 8x + 15 = (x + 3)(x + 5)$. Con 6 barras los huecos posibles piden 5, 8 o 9 cuadritos, nunca 7; con 5 barras piden 4 o 6, nunca 5. $x^2 + 9x + 20 = (x + 4)(x + 5)$.',
      'El hueco mide un lado por el otro. Ve pasando barras de una en una y mira cómo cambia lo que pide; si te pasas de largo sin dar justo, no se arma.'),
    'alg-23c': P('gira-complejos', 'Lleva el complejo a la **estrella** girando o reflejando, sin pasarte de movimientos', { rounds: [
      { title: 'Un solo movimiento', items: [{ z: [3, 1], w: [-1, 3], max: 1 }, { z: [2, -3], w: [2, 3], max: 1 }, { z: [1, 4], w: [-1, -4], max: 1 }] },
      { title: 'Combina movimientos', items: [{ z: [4, 2], w: [2, -4], max: 2 }, { z: [3, 2], w: [-2, -3], max: 2 }] },
    ] }, 'Multiplicar por $i$ gira un cuarto de vuelta: $(a + bi)\\,i = -b + ai$. Por $-1$, media vuelta. El conjugado refleja en el eje real: cambia el signo de la parte imaginaria.',
      'Mira en qué cuadrante está la estrella: un cuarto de vuelta, media vuelta o un reflejo hacia abajo. Dos cuartos de vuelta hacen media.'),
    'alg-1': P('balanza-cajas', 'Deja **una caja sola** para saber cuántas baldosas trae: quita lo mismo de los dos lados', { rounds: [
      { title: 'Cajas en un solo lado', items: [{ a: 2, b: 3, c: 0, d: 11 }, { a: 4, b: 1, c: 0, d: 13 }] },
      { title: 'Cajas en los dos lados', items: [{ a: 4, b: 1, c: 2, d: 7 }, { a: 5, b: 4, c: 2, d: 19 }, { a: 3, b: 6, c: 1, d: 10 }] },
    ] }, 'Quitar lo mismo de los dos platillos mantiene el equilibrio. Primero se van las sueltas del lado de las cajas, luego las cajas del otro lado, y al final se reparte: $2x + 3 = 11$ da $x = 4$; $4x + 1 = 2x + 7$ da $x = 3$.',
      'No puedes quitar de un lado lo que el otro no tiene. Busca dejar cajas solas en un platillo y sueltas solas en el otro antes de repartir.'),
    'alg-4a': P('apunta-chorro', 'Toca el punto donde el chorro **da la vuelta** (el vértice) y lánzalo', { rounds: [
      { title: 'Fórmula armada', items: [{ a: -1, h: -1, k: 6 }, { a: 1, h: 3, k: 2 }] },
      { title: 'Fórmula sin armar', items: [{ a: -1, h: 3, k: 7, std: true }, { a: 1, h: -2, k: 1, std: true }, { a: -2, h: 1, k: 8, std: true }] },
    ] }, 'En $y = a(x - h)^2 + k$ el vértice es $(h, k)$: ojo, $(x + 1)^2$ es $h = -1$. Sin armar, $h = -\\dfrac{b}{2a}$ y $k$ es el valor en $h$: $-x^2 + 6x - 2$ tiene $h = 3$ y $k = -9 + 18 - 2 = 7$.',
      'En la forma armada el signo de adentro del paréntesis va al revés. En la otra, calcula primero h con −b entre 2a y luego reemplázalo para hallar la altura.'),
    'alg-4': P('donde-cae', 'La altura del chorro vale cero donde **cae el agua**. Pon un balde ahí (solo cae adelante de la boquilla) y abre la llave', { rounds: [
      { title: 'Raíces a la vista', items: [{ eq: '-x^2 + 4x + 5 = 0', roots: [5, -1] }, { eq: '-x^2 + 2x + 8 = 0', roots: [4, -2] }] },
      { title: 'Una, ninguna o detrás', items: [{ eq: '-x^2 + 6x - 9 = 0', roots: [3, 3] }, { eq: '-x^2 + 2x - 3 = 0', roots: [] }, { eq: '-x^2 - 3x = 0', roots: [0, -3] }] },
    ] }, 'El agua toca el suelo en las raíces. $-x^2 + 4x + 5 = -(x - 5)(x + 1)$ da 5 y $-1$, pero $-1$ queda detrás. $-x^2 + 2x + 8 = -(x - 4)(x + 2)$ da 4 y $-2$. $-x^2 + 6x - 9 = -(x - 3)^2$ tiene una sola raíz, doble. $-x^2 + 2x - 3 = 0$ no tiene raíces reales: el discriminante es $4 - 12 < 0$. $-x^2 - 3x = -x(x + 3)$ da 0 y $-3$: ninguna adelante.',
      'Resuelve la ecuación y luego mira cada raíz: ¿está adelante de la boquilla? Si el discriminante es negativo, el agua nunca toca el suelo.'),
    'alg-23b': P('empaca-filas', 'Empaca los bloques en **filas del ancho del divisor**. Lo que no alcance para otra fila es el residuo', { rounds: [
      { title: 'Empaca y mira qué sobra', items: [{ a: 3, s: 5, p: 7 }, { a: 1, s: 4, p: 5 }] },
      { title: 'A veces no sobra nada', items: [{ a: 2, s: 6, p: 8 }, { a: 4, s: 6, p: 11 }] },
    ] }, '$(x^2 + 5x + 7) \\div (x + 3)$: una fila de alto $x$ y dos de alto 1, cociente $x + 2$, y sobra 1. $(x^2 + 6x + 8) \\div (x + 2)$ es exacta: cociente $x + 4$, residuo 0, así que $x + 2$ es un factor.',
      'Empieza por la pieza más grande. Cada fila de alto 1 se lleva una barra y tantos cuadritos como dice el divisor.'),
    'alg-92': P('sondea-niebla', 'Hay niebla. Alumbra pocos puntos y pon una **bandera en cada cruce** con la vía', { rounds: [
      { title: 'Dos cruces', items: [{ roots: [-1, 3], a: 1 }, { roots: [-3, 2], a: -1 }] },
      { title: 'Tres cruces', items: [{ roots: [-3, 0, 2], a: 1 }, { roots: [-2, 1, 4], a: -1 }, { roots: [-4, -1, 3], a: 1 }] },
    ] }, 'La altura en $x = c$ es $P(c)$, el residuo de dividir entre $x - c$. Si es 0, ahí hay un cruce y $x - c$ es un factor. Y si en un punto el terreno está arriba y en otro abajo, entre los dos tiene que cruzar.',
      'No gastes las linternas en puntos seguidos: alumbra salteado y fíjate dónde la altura cambia de arriba a abajo de la vía.'),
    'alg-93': P('cruza-o-rebota', 'Decide en cada cero si la montaña **cruza** la vía o **rebota**, y dibújala', { rounds: [
      { title: 'Mira los exponentes', items: [{ a: 1, factors: [[-2, 1], [1, 2]] }, { a: -1, factors: [[-3, 2], [0, 1], [2, 1]] }] },
      { title: 'Exponentes más altos', items: [{ a: 1, factors: [[-1, 3], [3, 2]] }, { a: 1, factors: [[-4, 1], [-1, 2], [2, 3]] }] },
    ] }, 'La multiplicidad de un cero es el exponente de su factor. Si es impar (1, 3…), la gráfica cruza el eje; si es par (2, 4…), lo toca y se devuelve.',
      'Busca el exponente de cada paréntesis; si no se ve ninguno, es 1. Impar cruza, par rebota.'),
    'alg-25a': P('rio-o-hueco', 'Guía a Beto por el sendero: en cada paso decide si **camina**, **salta un hueco** o hay un **río**', { rounds: [
      { title: 'Un hueco y un río', items: [{ top: [2, -1], bottom: [2, 4], from: 0, to: 5 }, { top: [1], bottom: [-1], from: -3, to: 1 }] },
      { title: 'Mira arriba y abajo', items: [{ top: [0, 3], bottom: [0, 3, 5], from: -1, to: 5 }, { top: [-2, 1], bottom: [1], from: -3, to: 3 }] },
    ] }, 'Donde solo se anula el denominador, la expresión se dispara: es una asíntota (el río). Donde se anulan los dos, el factor común se cancela y solo falta un punto (un hueco). Los dos quedan fuera del dominio.',
      'Reemplaza el siguiente x en el denominador. Si da cero, mira si arriba hay el mismo factor: si lo hay, es un hueco; si no, un río.'),
    'alg-25b': P('llena-estanque', 'Dos llaves llenan el estanque. Parte el estanque en partes que sirvan a las dos y deja pasar las horas', { rounds: [
      { title: 'Busca el denominador común', items: [{ p: 4, q: 12 }, { p: 6, q: 12 }] },
      { title: 'Denominadores más grandes', items: [{ p: 10, q: 15 }, { p: 12, q: 24 }] },
    ] }, 'Se suman los ritmos por hora: $\\tfrac14 + \\tfrac1{12} = \\tfrac{3}{12} + \\tfrac{1}{12} = \\tfrac{4}{12}$, un tercio por hora, así que juntas tardan 3 horas. Con 10 y 15: $\\tfrac{3}{30} + \\tfrac{2}{30} = \\tfrac{5}{30}$, 6 horas.',
      'El número de partes tiene que poder dividirse entre las horas de cada llave. El más pequeño que sirve a las dos es el denominador común.'),
    'alg-101': P('bote-corriente', 'Halla la **corriente** y la velocidad del **bote** con las dos pistas, y zarpa', { rounds: [
      { title: 'Dos pistas, dos incógnitas', items: [{ down: 14, up: 6 }, { down: 11, up: 5 }] },
      { title: 'Más ríos', items: [{ down: 20, up: 8 }, { down: 9, up: 9 }, { down: 17, up: 3 }] },
    ] }, 'Si $v + c = 14$ y $v - c = 6$, al restar queda $2c = 8$: la corriente es 4 y el bote va a 10. Si las dos velocidades son iguales, no hay corriente.',
      'La diferencia entre ir a favor y en contra es dos veces la corriente: una vez porque deja de ayudar y otra porque empieza a frenar.'),
    'alg-102': P('cruce-curvas', 'Hay niebla. Mueve la mira y **marca los puntos** donde la orilla y el puente tienen la misma altura', { rounds: [
      { title: 'Dos cruces', items: [{ m: -1, b: 2 }, { m: 0, b: 4 }] },
      { title: 'Uno, dos o ninguno', items: [{ m: 2, b: -1 }, { m: -1, b: 6 }, { m: 1, b: -3 }] },
    ] }, 'Las curvas se cortan donde $x^2 = mx + b$. Con $y = -x + 2$: $x^2 + x - 2 = 0$, en $x = 1$ y $x = -2$. Con $y = 2x - 1$: $(x - 1)^2 = 0$, un solo punto (el puente apenas toca). Con $y = x - 3$ no hay solución real: no se cortan.',
      'Iguala las dos fórmulas y resuelve la cuadrática; el discriminante te dice cuántos cruces buscar.'),
    'alg-71': P('lirios-laguna', 'Los lirios se duplican cada día. Retrocede en el calendario hasta el día que te piden', { rounds: [
      { title: 'Antes de llenarse', items: [{ full: 12, ask: 'half' }, { full: 8, ask: 'quarter' }] },
      { title: 'Cuenta lirios', items: [{ full: 6, ask: 8 }, { full: 7, ask: 'eighth' }, { full: 6, ask: 32 }] },
    ] }, 'Si cada día hay el doble, el día anterior había la mitad: medio llena un día antes, a la cuarta parte dos días antes. Y $2^x = 8$ pasa el día 3, porque $8 = 2^3$.',
      'No busques a mitad del calendario: piensa cuántas veces hay que partir por la mitad para llegar a lo que te piden.'),
    'alg-13b': P('dos-bancos', 'Apuesta en qué año el ahorro **llega a la meta** y corre los años para verlo', { rounds: [
      { title: 'Al 20 % anual', items: [{ kind: 'simple', rate: 20, goal: 2 }, { kind: 'comp', rate: 20, goal: 2 }] },
      { title: 'Otras tasas', items: [{ kind: 'simple', rate: 10, goal: 2 }, { kind: 'comp', rate: 10, goal: 2 }, { kind: 'comp', rate: 50, goal: 3 }] },
    ] }, 'Con interés simple del 20 % cada año suma 0.20: se duplica en el año 5. Con compuesto cada año multiplica por 1.2: $1.2^4 \\approx 2.07$, se duplica en el año 4. Al 10 %: año 10 con simple y año 8 con compuesto ($1.1^8 \\approx 2.14$).',
      'Con simple, divide lo que falta entre lo que suma cada año. Con compuesto, sigue multiplicando: cada año el salto es más grande que el anterior.'),
    'alg-72': P('regla-de-calculo', 'Multiplica y divide **sumando distancias** en la regla: corre la de arriba y toca el resultado abajo', { rounds: [
      { title: 'Multiplicar es sumar exponentes', items: [{ base: 2, a: 2, b: 16 }, { base: 2, a: 8, b: 8 }] },
      { title: 'Otra base, y dividir', items: [{ base: 3, a: 3, b: 81 }, { base: 2, a: 64, b: 8, div: true }, { base: 3, a: 81, b: 9, div: true }] },
    ] }, 'En la regla cada paso es un exponente más. $2 \\times 16$: exponentes $1 + 4 = 5$, y $2^5 = 32$. Eso es $\\log(ab) = \\log a + \\log b$. Al dividir se restan: $64 \\div 8$ es $6 - 3 = 3$, y $2^3 = 8$.',
      'Mira los exponentes de abajo: el del resultado es la suma (o la resta) de los exponentes de los dos números.'),
    'alg-73': P('piedras-selva', 'Cruza el río pisando **todas las soluciones que sí sirven** y ninguna de las falsas', { rounds: [
      { title: 'Candidatas tramposas', items: [
        { eq: '\\log_2 x + \\log_2(x - 6) = 4', stones: [{ x: '8', ok: true }, { x: '-2', ok: false, why: 'Un logaritmo no acepta números negativos' }, { x: '4', ok: false, why: 'Con 4, x − 6 es negativo' }] },
        { eq: '2^{x^2} = 16', stones: [{ x: '2', ok: true }, { x: '4', ok: false, why: '2 elevado a 16 no es 16' }, { x: '-2', ok: true }] },
      ] },
      { title: 'Revisa el dominio', items: [
        { eq: '\\log x + \\log(x - 3) = 1', stones: [{ x: '-2', ok: false, why: 'El logaritmo de −2 no existe' }, { x: '5', ok: true }, { x: '10', ok: false, why: 'Con 10 el producto es 70, no 10' }] },
        { eq: '\\log_3(x^2) = 2', stones: [{ x: '3', ok: true }, { x: '9', ok: false, why: 'Con 9, x² es 81 y el logaritmo da 4' }, { x: '-3', ok: true }] },
        { eq: '\\ln(x - 5) = 0', stones: [{ x: '5', ok: false, why: 'ln 0 no existe' }, { x: '6', ok: true }, { x: '0', ok: false, why: 'Con 0, x − 5 es negativo' }] },
      ] },
    ] }, '$\\log_2 x + \\log_2(x - 6) = 4$ da $x(x - 6) = 16$, con candidatas 8 y $-2$; $-2$ no tiene logaritmo. En cambio en $\\log_3(x^2) = 2$ sirven 3 y $-3$, porque lo que entra al logaritmo es $x^2 = 9$, positivo. Siempre se revisa lo de adentro del logaritmo.',
      'Resuelve la ecuación y luego prueba cada candidata en la ecuación ORIGINAL: lo que queda dentro de cada logaritmo tiene que ser positivo.'),
  };

  // ====================== Se montan en el curso ======================
  for (const u of COURSE_ALGEBRA.units) for (const l of u.lessons) if (SC[l.id]) l.clip = { ...l.clip, scenes: SC[l.id].map(([d, text, o]) => sc(d, text, o)) };
  for (const u of COURSE_ALGEBRA.units) for (const l of u.lessons) if (EX[l.id]) { l.ex = EX[l.id]; delete l.more; }
  // El juego dinámico va de último (también en las lecciones que conservan sus ejercicios de algebra.js).
  for (const u of COURSE_ALGEBRA.units) for (const l of u.lessons) if (DYN[l.id]) l.ex = [...l.ex, DYN[l.id]];
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
