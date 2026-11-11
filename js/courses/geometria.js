// Curso de Geometría Vectorial y Analítica — sigue el cronograma de Geometría Vectorial (UdeA, Facultad
// de Ingeniería): sistemas y matrices, inversa y determinantes, vectores y lugares geométricos, productos
// escalar y vectorial, aplicaciones a la mecánica y cónicas. Mientras llegan los videos, cada lección usa
// sus escenas. Spec: docs/superpowers/specs/2026-11-11-geometria-vectorial-design.md

const COURSE_GEO = {
  id: 'geo', level: 'Semestre 1', name: 'Geometría Vectorial y Analítica', icon: '↗', color: '#60a5fa',
  tagline: 'Flechas, matrices y curvas: la geometría hecha con álgebra.',
  units: [
    // ---------------------------------------------------------------- Parcial 1 (semanas 1–4)
    {
      world: 'sistemas', title: 'Sistemas de ecuaciones y matrices',
      lessons: [
        {
          id: 'geo-1', title: 'Sistemas 2×2 y 3×3 y su geometría',
          clip: { scenes: [
            sc(6, 'Cada ecuación $ax + by = c$ dibuja una **recta**. Resolver el sistema es buscar el punto que está en las dos rectas a la vez.', { title: '$x + y = 3 \\qquad x - y = 1$', viz: { type: 'graph', xr: [-1, 5], yr: [-2, 4], fs: [{ f: x => 3 - x }, { f: x => x - 1 }], points: [[2, 1, '(2, 1)']] } }),
            sc(7, 'Dos rectas del plano solo pueden hacer tres cosas: **cortarse** en un punto (una solución), ser **paralelas** (ninguna) o ser **la misma recta** (infinitas).', { steps: ['$x + y = 3,\\; x - y = 1$: se cortan en un punto', '$x + y = 3,\\; x + y = 5$: paralelas, sin solución', '$x + y = 3,\\; 2x + 2y = 6$: la misma recta'] }),
            sc(7, 'Para resolver se **elimina** una incógnita. En el ejemplo, al sumar las dos ecuaciones desaparece la $y$.', { steps: ['$(x + y) + (x - y) = 3 + 1$', '$2x = 4 \\Rightarrow x = 2$', '$2 + y = 3 \\Rightarrow y = 1$'] }),
            sc(7, 'Con tres incógnitas, cada ecuación $ax + by + cz = d$ es un **plano** del espacio. Tres planos pueden tener un punto en común, una recta entera o ningún punto.', { steps: ['un punto: solución única', 'una recta: infinitas soluciones', 'nada en común: sin solución'] }),
            sc(7, 'El método es el mismo: eliminar hasta que una ecuación tenga una sola incógnita y luego **sustituir hacia atrás**.', { steps: ['$x + y + z = 6,\\;\\; y + z = 5,\\;\\; z = 3$', '$z = 3 \\Rightarrow y = 2 \\Rightarrow x = 1$'] }),
          ] },
          ex: [
            play('afina-sistema', 'Mueve los coeficientes para cumplir la **meta** de cada ronda. Mira qué les pasa a las rectas', {
              rounds: [
                { e1: [2, -1, 3], e2: [4, 1, 1], free: [[1, 1]], goal: 'ninguna' },
                { e1: [1, 3, 4], e2: [2, 5, -1], free: [[1, 1], [1, 2]], goal: 'infinitas' },
                { e1: [1, 2, 3], e2: [3, -1, 2], free: [[0, 2], [1, 2]], goal: 'punto', P: [2, -1] },
              ],
            }, 'Sin solución: la segunda recta debe ser paralela, $4x - 2y = 1$ ($b_2 = -2$). Infinitas: la segunda ecuación es el doble de la primera, $2x + 6y = 8$. Con solución $(2, -1)$: $c_1 = 2 - 2 = 0$ y $c_2 = 6 + 1 = 7$.',
            { hint: 'Paralelas quiere decir que los coeficientes de x y de y son proporcionales pero el término independiente no. La misma recta: toda la ecuación es un múltiplo de la otra. Para que pasen por un punto, reemplaza el punto en cada ecuación.' }),
            num('Resuelve $3x + 2y = 12$, $x - 2y = -4$. ¿Cuánto vale $x$?', 2,
              'Al sumar, $4x = 8$, así que $x = 2$ (y luego $y = 3$).',
              { hint: 'Suma las dos ecuaciones: los términos con y se cancelan.' }),
            play('combina-vectores', 'Ronda 1: $x + 3y = 5,\\; 2x - y = 3$. Ronda 2: $2x - y = 1,\\; x + y = 5$. Míralos **por columnas**: ¿cuántas veces cada columna para llegar al lado derecho?', {
              rounds: [
                { u: [1, 2], v: [3, -1], target: [5, 3], names: ['c₁', 'c₂'] },
                { u: [2, 1], v: [-1, 1], target: [1, 5], names: ['c₁', 'c₂'] },
              ],
            }, 'El sistema $x + 3y = 5,\\; 2x - y = 3$ es lo mismo que $x\\,(1, 2) + y\\,(3, -1) = (5, 3)$: la solución $x = 2, y = 1$ dice cuánto de cada columna. El segundo, $2x - y = 1,\\; x + y = 5$, da $x = 2, y = 3$.',
            { hint: 'La columna c₁ son los coeficientes de x y la c₂ los de y. Ajusta primero una perilla para acercarte y corrige con la otra.' }),
            num('Resuelve $x + y + z = 2$, $2y - z = 5$, $3z = -3$. ¿Cuánto vale $x$?', 1,
              'De abajo hacia arriba: $z = -1$, luego $2y = 4 \\Rightarrow y = 2$, y $x = 2 - 2 + 1 = 1$.',
              { hint: 'El sistema ya está escalonado: empieza por la última ecuación y sustituye hacia arriba.' }),
          ],
        },
        {
          id: 'geo-2', title: 'El conjunto Rⁿ y el álgebra matricial',
          clip: { scenes: [
            sc(6, '$\\mathbb{R}^n$ son las listas de $n$ números reales. En $\\mathbb{R}^2$ son puntos (o flechas) del plano; en $\\mathbb{R}^3$, del espacio.', { viz: { type: 'vectors', A: [3, 1], only: 'A' } }),
            sc(6, 'Se suman **componente a componente** y un escalar multiplica cada componente.', { steps: ['$(1, 4, -2) + (3, 0, 5) = (4, 4, 3)$', '$3\\,(2, -1, 0) = (6, -3, 0)$'], viz: { type: 'vectors', A: [3, 1], B: [1, 2] } }),
            sc(7, 'Una matriz por un vector **combina sus columnas**: cada componente del vector dice cuánto tomar de cada columna.', { steps: ['$\\begin{pmatrix} 1 & 3 \\\\ 2 & -1 \\end{pmatrix}\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} = 2\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} + 1\\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 3 \\end{pmatrix}$'] }),
            sc(7, 'El producto $AB$ se hace **fila por columna**: la entrada $(i, j)$ es la fila $i$ de $A$ por la columna $j$ de $B$. Solo existe si las dimensiones de adentro coinciden.', { steps: ['$(m \\times n)(n \\times p) = m \\times p$', '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 0 \\end{pmatrix}\\begin{pmatrix} 4 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 14 \\\\ 12 \\end{pmatrix}$'] }),
            sc(6, 'Así un sistema entero cabe en una ecuación: $A\\vec x = \\vec b$, con $A$ la matriz de coeficientes. Ojo: en general $AB \\neq BA$.', { title: '$A\\vec x = \\vec b$' }),
          ] },
          ex: [
            play('combina-vectores', 'Encuentra $a$ y $b$ para que $a\\,\\vec u + b\\,\\vec v$ llegue a la estrella', {
              rounds: [
                { u: [1, 1], v: [1, -1], target: [4, 2] },
                { u: [2, 1], v: [0, 2], target: [-2, 3] },
                { u: [1, 2], v: [2, 1], target: [1, -1] },
              ],
            }, '$3(1, 1) + 1(1, -1) = (4, 2)$; $-1(2, 1) + 2(0, 2) = (-2, 3)$; $-1(1, 2) + 1(2, 1) = (1, -1)$. Cada ronda es un sistema 2×2 escrito por columnas.',
            { hint: 'Escribe las dos componentes por separado: te queda un sistema de dos ecuaciones con a y b.' }),
            play('flecha-vector', 'Arrastra la punta para dibujar el vector pedido', {
              rounds: [
                { ask: 'Dibuja 2u − v', given: [{ v: [1, 2], name: 'u' }, { v: [3, 1], name: 'v' }], ans: [-1, 3], show: ['comp'] },
                { ask: 'Dibuja −u + ½·w', given: [{ v: [2, -1], name: 'u' }, { v: [4, 2], name: 'w' }], ans: [0, 2], show: ['comp'] },
              ],
            }, '$2(1, 2) - (3, 1) = (-1, 3)$ y $-(2, -1) + \\tfrac12(4, 2) = (-2, 1) + (2, 1) = (0, 2)$.',
            { hint: 'Calcula componente a componente: primero multiplica cada vector por su número y después suma.' }),
            num('$A = \\begin{pmatrix} 1 & 2 \\\\ 0 & -1 \\end{pmatrix}$, $B = \\begin{pmatrix} 3 & 1 \\\\ 2 & 4 \\end{pmatrix}$. ¿Cuál es la entrada $(1, 2)$ de $AB$?', 9,
              'Fila 1 de $A$ por columna 2 de $B$: $1 \\cdot 1 + 2 \\cdot 4 = 9$.',
              { hint: 'La entrada (1, 2) usa la fila 1 de A y la columna 2 de B: multiplica entrada por entrada y suma.' }),
            num('Si $A$ es $2 \\times 3$ y $B$ es $3 \\times 4$, ¿cuántas entradas tiene $AB$?', 8,
              '$AB$ es $2 \\times 4$: tiene $8$ entradas.',
              { hint: 'Las dimensiones de adentro deben coincidir; las de afuera dan el tamaño del producto.' }),
            num('$A = \\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$ y $\\vec x = (4, 1)$. ¿Cuál es la segunda componente de $A\\vec x$?', 7,
              'Fila 2 por el vector: $1 \\cdot 4 + 3 \\cdot 1 = 7$.',
              { hint: 'Cada componente de A x es una fila de A multiplicada por el vector x.' }),
          ],
        },
        {
          id: 'geo-3', title: 'Transpuesta, sistemas m×n y tipos de solución',
          clip: { scenes: [
            sc(6, 'La **transpuesta** $A^T$ cambia filas por columnas: la fila $i$ de $A$ es la columna $i$ de $A^T$.', { steps: ['$\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$'] }),
            sc(6, 'Sus propiedades: transponer dos veces devuelve la matriz y la de un producto **invierte el orden**. Si $A^T = A$, la matriz es **simétrica**.', { steps: ['$(A^T)^T = A \\qquad (A + B)^T = A^T + B^T$', '$(AB)^T = B^T A^T$'] }),
            sc(7, 'Un sistema de $m$ ecuaciones y $n$ incógnitas se guarda en su **matriz aumentada** y se simplifica con operaciones de fila hasta la forma **escalonada**.', { steps: ['$\\left(\\begin{array}{cc|c} 1 & 1 & 3 \\\\ 1 & -1 & 1 \\end{array}\\right) \\xrightarrow{R_2 - R_1} \\left(\\begin{array}{cc|c} 1 & 1 & 3 \\\\ 0 & -2 & -2 \\end{array}\\right)$'] }),
            sc(7, 'La escalonada dice el **tipo de solución**: una fila $0 \\; 0 \\mid c$ con $c \\neq 0$ es imposible (sin solución); si hay columnas sin pivote, esas variables son **libres** (infinitas); si todo tiene pivote, solución única.', { steps: ['$0 = 5$: inconsistente', 'menos pivotes que incógnitas: infinitas', 'un pivote por incógnita: única'] }),
            sc(6, 'En la **reducida** cada pivote vale 1 y es lo único no nulo de su columna: la solución se lee directo.', { steps: ['$\\left(\\begin{array}{cc|c} 1 & 0 & 2 \\\\ 0 & 1 & 1 \\end{array}\\right) \\Rightarrow x = 2,\\; y = 1$'] }),
          ] },
          ex: [
            play('fila-a-fila', 'Lleva cada matriz aumentada a forma **escalonada**', {
              rounds: [
                { M: [[1, 2, -1, 3], [2, 5, 1, 8], [-1, -1, 3, 1]], aug: 1, goal: 'escalonada' },
                { M: [[2, 4, 6], [1, 3, 5]], aug: 1, goal: 'escalonada' },
              ],
            }, 'Primera: $R_2 - 2R_1$, $R_3 + R_1$ y luego $R_3 - R_2$ dejan pivotes en escalera. Segunda: $R_2 - \\tfrac12 R_1$ basta.',
            { hint: 'Usa el primer pivote para hacer ceros debajo de él con «Ri ← Ri + k·Rj»; k es el número que cancela la entrada. Luego repite con la siguiente columna.' }),
            play('fila-a-fila', 'Ahora a la forma **reducida**. Después mira qué tipo de solución tiene cada sistema', {
              rounds: [
                { M: [[1, 1, 2, 4], [2, 3, 5, 9], [1, 2, 3, 6]], aug: 1, goal: 'reducida' },
                { M: [[1, -1, 2, 1], [2, -2, 5, 4]], aug: 1, goal: 'reducida' },
              ],
            }, 'La primera termina con la fila $0 \\; 0 \\; 0 \\mid 1$: no tiene solución. La segunda queda $x - y = -3,\\; z = 2$: la $y$ es libre y hay infinitas soluciones.',
            { hint: 'Después de escalonar, haz 1 cada pivote (multiplica su fila) y haz ceros también encima de él. Una fila con solo ceros a la izquierda de la barra puede quedarse así.' }),
            num('Un sistema reducido quedó $x_1 - x_2 = -3$, $x_3 = 2$. Si tomas $x_2 = 5$, ¿cuánto vale $x_1$?', 2,
              '$x_1 = -3 + x_2 = -3 + 5 = 2$: cada valor de la variable libre da una solución distinta.',
              { hint: 'x₂ es la variable libre: reemplázala y despeja x₁.' }),
            num('Si $A$ es $3 \\times 2$, $A^T A$ es cuadrada. ¿Cuántas filas tiene?', 2,
              '$A^T$ es $2 \\times 3$, así que $A^T A$ es $(2 \\times 3)(3 \\times 2) = 2 \\times 2$.',
              { hint: 'A^T tiene las dimensiones de A al revés; luego usa la regla del tamaño de un producto.' }),
            num('$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$. ¿Cuál es la entrada $(2, 1)$ de $(AB)^T$?', 1,
              '$AB = \\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix}$ y la entrada $(2, 1)$ de su transpuesta es la $(1, 2)$ de $AB$: $1$.',
              { hint: 'La entrada (2, 1) de una transpuesta es la (1, 2) de la matriz original.' }),
          ],
        },
        {
          id: 'geo-4', title: 'Matrices invertibles y matrices elementales',
          clip: { scenes: [
            sc(6, '$A$ es **invertible** si existe $A^{-1}$ con $AA^{-1} = A^{-1}A = I$. Como dividir entre un número: deshace lo que hace $A$.', { title: '$A A^{-1} = I$' }),
            sc(7, 'Para $2 \\times 2$ hay fórmula: se intercambia la diagonal, se cambia el signo de la otra y se divide entre $ad - bc$.', { steps: ['$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\dfrac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$', '$\\begin{pmatrix} 3 & 1 \\\\ 5 & 2 \\end{pmatrix}^{-1} = \\begin{pmatrix} 2 & -1 \\\\ -5 & 3 \\end{pmatrix}$'] }),
            sc(7, 'Una **matriz elemental** es la identidad con una sola operación de fila. Multiplicar $E A$ hace esa misma operación sobre $A$.', { steps: ['$E = \\begin{pmatrix} 1 & 0 \\\\ -2 & 1 \\end{pmatrix}$ hace $R_2 \\leftarrow R_2 - 2R_1$'] }),
            sc(7, 'Toda elemental es invertible y su inversa es la operación que la **deshace**: intercambiar otra vez, dividir entre $k$, o restar lo que se sumó.', { steps: ['$R_2 - 2R_1$ se deshace con $R_2 + 2R_1$', '$\\begin{pmatrix} 1 & 0 \\\\ -2 & 1 \\end{pmatrix}^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 2 & 1 \\end{pmatrix}$'] }),
            sc(6, 'Por eso: $A$ es invertible justo cuando se puede llevar a $I$ con operaciones de fila, es decir, cuando es un producto de elementales. Y $(AB)^{-1} = B^{-1}A^{-1}$.', { title: '$(AB)^{-1} = B^{-1}A^{-1}$' }),
          ] },
          ex: [
            play('fila-a-fila', 'Cada operación es una matriz elemental. Lleva $A$ hasta la **identidad**', {
              rounds: [
                { M: [[2, 1], [4, 3]], goal: 'reducida' },
                { M: [[0, 1, 0], [1, 0, 2], [0, 0, 1]], goal: 'reducida' },
              ],
            }, 'Primera: $R_2 - 2R_1$, $R_1 - R_2$ y $\\tfrac12 R_1$. Segunda: $R_1 \\leftrightarrow R_2$ y luego $R_1 - 2R_3$. Como se llega a $I$, las dos son invertibles.',
            { hint: 'Si el primer pivote es cero, intercambia filas. Luego haz ceros debajo y encima de cada pivote y conviértelo en 1.' }),
            num('La elemental de $R_2 \\leftarrow R_2 - 3R_1$ tiene $-3$ en la entrada $(2, 1)$. ¿Qué número va en esa entrada en $E^{-1}$?', 3,
              'La inversa deshace la operación: $R_2 \\leftarrow R_2 + 3R_1$, así que lleva $3$.',
              { hint: 'La inversa de una elemental es la operación que deshace la original.' }),
            num('$A = \\begin{pmatrix} 5 & 3 \\\\ 3 & 2 \\end{pmatrix}$. ¿Cuál es la entrada $(1, 2)$ de $A^{-1}$?', -3,
              '$ad - bc = 10 - 9 = 1$, así que $A^{-1} = \\begin{pmatrix} 2 & -3 \\\\ -3 & 5 \\end{pmatrix}$.',
              { hint: 'Para 2×2: intercambia la diagonal, cambia el signo de la otra diagonal y divide entre ad − bc.' }),
            num('$A^{-1} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$ y $B^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 3 & 1 \\end{pmatrix}$. ¿Cuál es la entrada $(2, 2)$ de $(AB)^{-1}$?', 7,
              '$(AB)^{-1} = B^{-1}A^{-1} = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}$: la entrada es $7$ (en el orden equivocado saldría 1).',
              { hint: 'La inversa de un producto va en el orden contrario.' }),
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- Parcial 2 (semanas 5–8)
    {
      world: 'determinantes', title: 'Inversa y determinantes',
      lessons: [
        {
          id: 'geo-5', title: 'Gauss-Jordan para la inversa',
          clip: { scenes: [
            sc(6, 'Si unas operaciones de fila llevan $A$ hasta $I$, esas mismas operaciones llevan $I$ hasta $A^{-1}$.', { title: '$[\\,A \\mid I\\,] \\longrightarrow [\\,I \\mid A^{-1}\\,]$' }),
            sc(7, 'Por eso se escribe $A$ con la identidad al lado y se hace Gauss-Jordan a toda la fila.', { steps: ['$\\left(\\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 3 & 7 & 0 & 1 \\end{array}\\right)$', '$R_2 - 3R_1:\\; \\left(\\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right)$'] }),
            sc(7, 'Se hace cero encima del pivote y queda la inversa a la derecha.', { steps: ['$R_1 - 2R_2:\\; \\left(\\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right)$', '$A^{-1} = \\begin{pmatrix} 7 & -2 \\\\ -3 & 1 \\end{pmatrix}$'] }),
            sc(6, 'Si a la izquierda aparece una **fila de ceros**, ya no se puede llegar a $I$: la matriz no tiene inversa.', { steps: ['$\\begin{pmatrix} 2 & 6 \\\\ 1 & 3 \\end{pmatrix} \\to \\begin{pmatrix} 2 & 6 \\\\ 0 & 0 \\end{pmatrix}$'] }),
            sc(6, 'Con la inversa, el sistema $A\\vec x = \\vec b$ se resuelve multiplicando: $\\vec x = A^{-1}\\vec b$.', { title: '$\\vec x = A^{-1}\\vec b$' }),
          ] },
          ex: [
            play('fila-a-fila', 'Convierte $[A \\mid I]$ en $[I \\mid A^{-1}]$', {
              rounds: [
                { M: [[2, 5, 1, 0], [1, 3, 0, 1]], aug: 2, goal: 'reducida' },
                { M: [[1, 0, 2, 1, 0, 0], [0, 1, 1, 0, 1, 0], [1, 1, 4, 0, 0, 1]], aug: 3, goal: 'reducida' },
              ],
            }, 'Las mismas operaciones que llevan $A$ a $I$ llevan $I$ a $A^{-1}$: lo que queda a la derecha de la barra es la inversa. Se comprueba multiplicando $AA^{-1} = I$.',
            { hint: 'Trabaja solo mirando el bloque de la izquierda: primero ceros debajo de los pivotes, luego pivotes en 1 y por último ceros encima. La derecha se acomoda sola.' }),
            num('Para $A = \\begin{pmatrix} 2 & 5 \\\\ 1 & 3 \\end{pmatrix}$, ¿cuál es la entrada $(1, 2)$ de $A^{-1}$?', -5,
              'A la derecha de la barra quedó $\\begin{pmatrix} 3 & -5 \\\\ -1 & 2 \\end{pmatrix}$.',
              { hint: 'Es lo que quedó a la derecha de la barra en la fila 1, columna 2, en la ronda 1 del juego anterior.' }),
            play('fila-a-fila', 'Esta matriz **no** tiene inversa. Llévala a la forma reducida y mira qué aparece', {
              rounds: [{ M: [[1, 2, 1, 0], [2, 4, 0, 1]], aug: 2, goal: 'reducida' }],
            }, '$R_2 - 2R_1$ deja $0 \\; 0$ a la izquierda: nunca se llegará a $I$, así que $A$ no es invertible.',
            { hint: 'Haz cero debajo del primer pivote y observa la segunda fila del bloque izquierdo.' }),
            num('Si $A^{-1} = \\begin{pmatrix} 3 & -5 \\\\ -1 & 2 \\end{pmatrix}$, resuelve $A\\vec x = (1, 1)$. ¿Cuánto vale la primera componente?', -2,
              '$\\vec x = A^{-1}(1, 1) = (3 - 5,\\; -1 + 2) = (-2, 1)$.',
              { hint: 'x = A⁻¹ b: multiplica la fila 1 de la inversa por el vector (1, 1).' }),
          ],
        },
        {
          id: 'geo-6', title: 'La función determinante',
          clip: { scenes: [
            sc(6, 'El **determinante** de una matriz $2 \\times 2$ mide cuánto multiplica las áreas la transformación: es el área (con signo) del paralelogramo de sus columnas.', { title: '$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$', viz: { type: 'matrix', M: [[2, 1], [0, 1.5]] } }),
            sc(6, 'El signo dice si el plano se **voltea**; si vale cero, el plano se aplasta en una recta.', { viz: { type: 'matrix', M: [[1, 2], [0.5, 1]] } }),
            sc(7, 'Para $3 \\times 3$ se desarrolla por **cofactores**: cada entrada de una fila por el determinante que queda al tapar su fila y su columna, con signos alternados $+\\,-\\,+$.', { steps: ['$\\det\\begin{pmatrix} 1 & 2 & 0 \\\\ 3 & 1 & 1 \\\\ 0 & 2 & 1 \\end{pmatrix} = 1(1 - 2) - 2(3 - 0) + 0$', '$= -1 - 6 = -7$'] }),
            sc(6, 'Si la matriz es **triangular**, el determinante es el producto de la diagonal.', { steps: ['$\\det\\begin{pmatrix} 2 & 5 & 1 \\\\ 0 & 3 & 4 \\\\ 0 & 0 & -1 \\end{pmatrix} = 2 \\cdot 3 \\cdot (-1) = -6$'] }),
            sc(6, 'Propiedades: $\\det A^T = \\det A$, $\\det(AB) = \\det A \\det B$ y multiplicar **una fila** por $k$ multiplica el determinante por $k$.', { steps: ['$\\det(kA) = k^n \\det A$ si $A$ es $n \\times n$'] }),
          ] },
          ex: [
            play('flecha-vector', 'El determinante de las columnas $\\vec u, \\vec w$ es el área con signo del paralelogramo. Dibuja $\\vec w$', {
              rounds: [
                { ask: 'det(u, w) = 6', given: [{ v: [3, 0], name: 'u' }], check: w => 3 * w[1] === 6, sol: 'cualquier w con segunda componente 2, como (0, 2)', show: ['det'] },
                { ask: 'det(u, w) = −4', given: [{ v: [2, 1], name: 'u' }], check: w => 2 * w[1] - w[0] === -4, sol: 'por ejemplo (4, 0) o (2, −1)', show: ['det'] },
                { ask: 'det(u, w) = 0 sin que w sea cero', given: [{ v: [2, 3], name: 'u' }], check: w => 2 * w[1] - 3 * w[0] === 0 && (w[0] !== 0 || w[1] !== 0), sol: 'un múltiplo de (2, 3), como (−2, −3)', show: ['det'] },
              ],
            }, 'Con $\\vec u = (3, 0)$ el área es base 3 por altura $w_2$. Con $(2, 1)$: $2w_2 - w_1 = -4$, por ejemplo $(4, 0)$. Determinante cero es paralelogramo aplastado: $\\vec w$ paralelo a $\\vec u$.',
            { hint: 'det(u, w) = u₁w₂ − u₂w₁. El signo es positivo si w queda girando a la izquierda de u.' }),
            num('$\\det\\begin{pmatrix} 2 & 0 & 1 \\\\ 1 & 3 & 2 \\\\ 0 & 1 & 1 \\end{pmatrix} = \\;?$', 3,
              'Por la primera fila: $2(3 - 2) - 0 + 1(1 - 0) = 3$.',
              { hint: 'Desarrolla por la primera fila: el 0 te ahorra un cofactor. Ojo con los signos + − +.' }),
            num('$\\det\\begin{pmatrix} 3 & 7 & -2 \\\\ 0 & -1 & 5 \\\\ 0 & 0 & 4 \\end{pmatrix} = \\;?$', -12,
              'Es triangular: $3 \\cdot (-1) \\cdot 4 = -12$.',
              { hint: 'En una matriz triangular no hace falta desarrollar por cofactores.' }),
            num('Si $\\det A = 5$ y $A$ es $3 \\times 3$, ¿cuánto vale $\\det(2A)$?', 40,
              '$2A$ multiplica las tres filas por 2: $2^3 \\cdot 5 = 40$.',
              { hint: 'Multiplicar la matriz por 2 multiplica cada una de sus tres filas por 2.' }),
          ],
        },
        {
          id: 'geo-7', title: 'El determinante con matrices elementales',
          clip: { scenes: [
            sc(6, 'Cada operación de fila cambia el determinante de una forma conocida.', { steps: ['$R_i \\leftrightarrow R_j$: cambia el signo', '$R_i \\leftarrow k R_i$: lo multiplica por $k$', '$R_i \\leftarrow R_i + k R_j$: no lo cambia'] }),
            sc(6, 'Es lo mismo que decir $\\det(EA) = \\det E \\cdot \\det A$, con $\\det E = -1$, $k$ o $1$.', { title: '$\\det(EA) = \\det E\\,\\det A$' }),
            sc(7, '**Método**: triangular con operaciones de fila llevando la cuenta, y al final multiplicar la diagonal.', { steps: ['$\\begin{pmatrix} 0 & 1 & 2 \\\\ 1 & 1 & 1 \\\\ 2 & 2 & 6 \\end{pmatrix} \\xrightarrow{R_1 \\leftrightarrow R_2} \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 2 \\\\ 2 & 2 & 6 \\end{pmatrix}$ (signo $-$)', '$R_3 - 2R_1:\\; \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 2 \\\\ 0 & 0 & 4 \\end{pmatrix}$', '$\\det = -(1 \\cdot 1 \\cdot 4) = -4$'] }),
            sc(6, 'Es mucho más rápido que los cofactores cuando la matriz es grande: con $n = 10$, los cofactores piden millones de productos.', { title: '$\\det A = (\\text{factor}) \\cdot \\prod \\text{diagonal}$' }),
          ] },
          ex: [
            play('fila-a-fila', 'Triangula cada matriz (forma escalonada) y mira cómo cambia la cuenta del determinante', {
              rounds: [
                { M: [[0, 2, 4], [1, 1, 1], [2, 3, 5]], goal: 'escalonada', det: true },
                { M: [[2, 4], [3, 1]], goal: 'escalonada', det: true },
              ],
            }, 'Primera: $R_1 \\leftrightarrow R_2$ (signo $-$), $R_3 - 2R_1$, $R_3 - \\tfrac12 R_2$ dejan una triangular. Segunda: $R_2 - \\tfrac32 R_1$ deja $2, -5$: $\\det = -10$.',
            { hint: 'Sumar un múltiplo de otra fila no cambia la cuenta; intercambiar y multiplicar sí. Al terminar, el determinante es el factor de la cuenta por el producto de la diagonal.' }),
            num('¿Cuánto vale $\\det\\begin{pmatrix} 0 & 2 & 4 \\\\ 1 & 1 & 1 \\\\ 2 & 3 & 5 \\end{pmatrix}$?', -2,
              'Tras $R_1 \\leftrightarrow R_2$, $R_3 - 2R_1$ y $R_3 - \\tfrac12R_2$ la diagonal es $1 \\cdot 2 \\cdot 1 = 2$, y el intercambio cambia el signo: $-2$.',
              { hint: 'Usa la primera ronda del juego: multiplica la diagonal de la triangular por el factor de la cuenta.' }),
            num('Intercambias dos filas de $A$ y luego multiplicas una fila por 3; la matriz que resulta tiene determinante 12. ¿Cuánto vale $\\det A$?', -4,
              '$12 = (-1)(3)\\det A$, así que $\\det A = -4$.',
              { hint: 'Cada intercambio cambia el signo y multiplicar una fila por 3 multiplica el determinante por 3. Plantea la ecuación y despeja.' }),
            num('¿Cuánto vale el determinante de la elemental $3 \\times 3$ que hace $R_3 \\leftarrow R_3 + 7R_1$?', 1,
              'Es triangular con unos en la diagonal: $\\det E = 1$. Por eso esa operación no cambia determinantes.',
              { hint: 'Escribe la matriz: es la identidad con un número fuera de la diagonal. ¿Es triangular?' }),
          ],
        },
        {
          id: 'geo-8', title: 'Determinante e inversa',
          clip: { scenes: [
            sc(6, 'La gran relación: $A$ es invertible **si y solo si** $\\det A \\neq 0$. Si el determinante es cero, el plano se aplasta y no hay forma de deshacerlo.', { title: '$A^{-1} \\text{ existe} \\iff \\det A \\neq 0$', viz: { type: 'matrix', M: [[1, 2], [0.5, 1]] } }),
            sc(6, 'Como $\\det(AA^{-1}) = \\det I = 1$, el determinante de la inversa es el recíproco.', { title: '$\\det A^{-1} = \\dfrac{1}{\\det A}$' }),
            sc(7, 'La **adjunta** (transpuesta de los cofactores) da una fórmula para la inversa.', { steps: ['$A^{-1} = \\dfrac{1}{\\det A}\\,\\operatorname{adj} A$', '$\\begin{pmatrix} 4 & 1 \\\\ 2 & 1 \\end{pmatrix}^{-1} = \\dfrac12\\begin{pmatrix} 1 & -1 \\\\ -2 & 4 \\end{pmatrix}$'] }),
            sc(7, '**Regla de Cramer**: cada incógnita es un cociente de determinantes; arriba, la columna de esa incógnita se cambia por los términos independientes.', { steps: ['$x + y = 5,\\; x - y = 1$: $\\det A = -2$', '$x = \\dfrac{\\det\\begin{pmatrix} 5 & 1 \\\\ 1 & -1 \\end{pmatrix}}{-2} = \\dfrac{-6}{-2} = 3$'] }),
          ] },
          ex: [
            play('afina-sistema', 'El sistema tiene solución única justo cuando $\\det \\neq 0$ (el juego lo muestra arriba). Ajusta para que sea cero y cumple la meta', {
              rounds: [
                { e1: [3, 6, 2], e2: [1, 1, 4], free: [[1, 1]], goal: 'ninguna' },
                { e1: [2, -3, 1], e2: [1, 1, 2], free: [[1, 0], [1, 1]], goal: 'infinitas' },
              ],
            }, 'Primera: $\\det = 3b_2 - 6 = 0$ pide $b_2 = 2$, y $x + 2y = 4$ es paralela a $3x + 6y = 2$. Segunda: con $c_2 = 2$ la ecuación debe ser el doble de la primera, $4x - 6y = 2$.',
            { hint: 'Con dos ecuaciones el determinante es a₁b₂ − a₂b₁. Cuando es cero las rectas son paralelas o la misma: mira los términos independientes para saber cuál.' }),
            num('Con Cramer en $2x + y = 7$, $x - 3y = 0$: ¿cuánto vale $\\det A$?', -7,
              '$\\det\\begin{pmatrix} 2 & 1 \\\\ 1 & -3 \\end{pmatrix} = -6 - 1 = -7$.',
              { hint: 'det A usa solo los coeficientes de x y de y, sin los términos independientes.' }),
            num('Por Cramer, en $2x + y = 7$, $x - 3y = 0$: ¿cuánto vale $x$?', 3,
              '$x = \\dfrac{\\det\\begin{pmatrix} 7 & 1 \\\\ 0 & -3 \\end{pmatrix}}{-7} = \\dfrac{-21}{-7} = 3$.',
              { hint: 'Cambia la columna de x por los términos independientes, calcula ese determinante y divide entre det A.' }),
            num('$A$ y $B$ son $3 \\times 3$ con $\\det A = 4$ y $\\det B = -3$. ¿Cuánto vale $\\det(A^{-1}B^T)$?', -0.75,
              '$\\det A^{-1} \\cdot \\det B^T = \\tfrac14 \\cdot (-3) = -0.75$.',
              { tol: 0.001, hint: 'La transpuesta no cambia el determinante, el de la inversa es el recíproco y el de un producto es el producto.' }),
            num('¿Para qué valor de $k$ la matriz $\\begin{pmatrix} k & 4 \\\\ 2 & 3 \\end{pmatrix}$ **no** es invertible?', 8 / 3,
              '$3k - 8 = 0 \\Rightarrow k = \\tfrac83 \\approx 2.667$.',
              { tol: 0.01, answerText: '$k = \\tfrac{8}{3}$', hint: 'Una matriz no es invertible cuando su determinante vale cero: plantea esa ecuación en k.' }),
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- Parcial 2–3 (semanas 7–9)
    {
      world: 'vectores', title: 'Vectores y lugares geométricos',
      lessons: [
        {
          id: 'geo-9', title: 'Vectores libres y sus operaciones',
          clip: { scenes: [
            sc(6, 'Una flecha de $A$ a $B$ es un **segmento dirigido**. Todas las flechas con la misma longitud, dirección y sentido representan el mismo **vector libre**: se puede trasladar a donde convenga.', { viz: { type: 'vectors', A: [3, 1], only: 'A' } }),
            sc(6, 'Para **sumar**, se pone la cola del segundo en la punta del primero: la suma va de la cola del primero a la punta del segundo (o es la diagonal del paralelogramo).', { title: '$\\vec a + \\vec b$', viz: { type: 'vectors', A: [3, 1], B: [1, 2] } }),
            sc(6, 'Un **escalar** estira, encoge o voltea: $2\\vec a$ es el doble de largo y $-\\vec a$ apunta al revés. Restar es sumar el opuesto.', { steps: ['$\\vec a - \\vec b = \\vec a + (-\\vec b)$', '$\\overrightarrow{AB} = -\\overrightarrow{BA}$'] }),
            sc(6, 'Las propiedades son las de siempre: conmutativa, asociativa, el vector cero y el opuesto; y $r(\\vec a + \\vec b) = r\\vec a + r\\vec b$.', { steps: ['$\\vec a + \\vec b = \\vec b + \\vec a$', '$\\vec a + (-\\vec a) = \\vec 0$'] }),
            sc(6, 'La **norma** $\\|\\vec a\\|$ es su longitud. En el plano sale de Pitágoras con sus componentes.', { title: '$\\|(a_1, a_2)\\| = \\sqrt{a_1^2 + a_2^2}$', viz: { type: 'vectors', A: [3, 4], only: 'A', xr: [-1, 5], yr: [-1, 5] } }),
          ] },
          ex: [
            play('flecha-vector', 'Un vector libre puede empezar en cualquier parte. Dibújalo desde la cola marcada', {
              rounds: [
                { ask: 'u + v desde (−2, −1)', given: [{ v: [3, 1], name: 'u' }, { v: [-1, 3], name: 'v' }], tail: [-2, -1], ans: [2, 4], show: ['comp'] },
                { ask: 'u − v desde (1, 2)', given: [{ v: [2, -1], name: 'u' }, { v: [-2, 2], name: 'v' }], tail: [1, 2], ans: [4, -3], show: ['comp'] },
                { ask: '−2u desde el origen', given: [{ v: [1, -2], name: 'u' }], ans: [-2, 4], show: ['comp'] },
              ],
            }, '$u + v = (2, 4)$, $u - v = (4, -3)$ y $-2u = (-2, 4)$: lo que importa es la flecha, no dónde empieza.',
            { hint: 'Calcula primero las componentes del resultado y luego cuenta esos pasos desde la cola: tantos a la derecha y tantos hacia arriba.' }),
            play('flecha-vector', 'Dibuja un vector **igual** a $\\overrightarrow{AB}$, pero que no empiece en $A$ (mueve la cola y la punta)', {
              rounds: [{ ask: 'Igual a AB, en otro lugar', points: [{ p: [-3, -2], name: 'A' }, { p: [2, 1], name: 'B' }], freeTail: true, check: (w, t) => w[0] === 5 && w[1] === 3 && !(t[0] === -3 && t[1] === -2), sol: 'cualquier flecha de componentes (5, 3) que no salga de A', show: ['comp'] }],
            }, '$\\overrightarrow{AB} = B - A = (5, 3)$; cualquier flecha con 5 pasos a la derecha y 3 hacia arriba es el mismo vector libre.',
            { hint: 'Cuenta cuánto se avanza en x y en y para ir de A a B. Después pon la cola en otro punto y avanza lo mismo.' }),
            num('¿Cuánto vale $\\|\\vec u\\|$ si $\\vec u = (-5, 12)$?', 13,
              '$\\sqrt{25 + 144} = \\sqrt{169} = 13$.',
              { hint: 'Pitágoras con las dos componentes; el signo no importa al elevar al cuadrado.' }),
            num('¿Para qué $t$ el vector $t\\,(2, -1) + (1, 4)$ queda sobre el eje $x$?', 4,
              'Su segunda componente es $-t + 4$, que vale cero si $t = 4$.',
              { hint: 'Un vector sobre el eje x tiene segunda componente cero.' }),
          ],
        },
        {
          id: 'geo-10', title: 'Vectores en la geometría euclidiana',
          clip: { scenes: [
            sc(6, 'Con vectores, los problemas de geometría se vuelven cuentas. Por ejemplo, el **punto medio** de $AB$ es el promedio de los extremos.', { title: '$M = \\tfrac12(A + B)$' }),
            sc(6, 'El **baricentro** (donde se cruzan las medianas) es el promedio de los tres vértices.', { title: '$G = \\tfrac13(A + B + C)$' }),
            sc(7, 'Un punto que parte $AB$ en la razón $r$ (contada desde $A$) es $A$ más esa fracción de $\\overrightarrow{AB}$.', { steps: ['$P = A + r\\,\\overrightarrow{AB}$', '$A(0, 0),\\; B(6, 3),\\; r = \\tfrac13 \\Rightarrow P = (2, 1)$'] }),
            sc(7, '**Demostración** en una línea: los puntos medios de dos lados forman un segmento paralelo al tercero y de la mitad de largo.', { steps: ['$\\overrightarrow{MN} = \\tfrac12\\overrightarrow{AC} - \\tfrac12\\overrightarrow{AB}$', '$= \\tfrac12(\\overrightarrow{AC} - \\overrightarrow{AB}) = \\tfrac12\\overrightarrow{BC}$'] }),
            sc(6, 'Y en un paralelogramo $ABCD$ las diagonales se cortan en su punto medio, porque $A + C = B + D$.', { title: '$\\tfrac12(A + C) = \\tfrac12(B + D)$' }),
          ] },
          ex: [
            play('flecha-vector', 'La flecha sale del origen: pon su **punta** en el punto pedido', {
              rounds: [
                { ask: 'Punto medio de A y B', points: [{ p: [-4, 1], name: 'A' }, { p: [2, 5], name: 'B' }], at: 'tip', ans: [-1, 3], show: ['tip'] },
                { ask: 'Baricentro del triángulo ABC', points: [{ p: [-3, -2], name: 'A' }, { p: [4, 1], name: 'B' }, { p: [2, 4], name: 'C' }], at: 'tip', ans: [1, 1], show: ['tip'] },
                { ask: 'P en AB con AP = ⅔ de AB', points: [{ p: [-3, 4], name: 'A' }, { p: [3, -5], name: 'B' }], at: 'tip', ans: [1, -2], show: ['tip'] },
                { ask: 'Cuarto vértice D del paralelogramo ABCD', points: [{ p: [-2, -1], name: 'A' }, { p: [3, 0], name: 'B' }, { p: [4, 3], name: 'C' }], at: 'tip', ans: [-1, 2], show: ['tip'] },
              ],
            }, 'Medio: $\\tfrac12(-2, 6) = (-1, 3)$. Baricentro: $\\tfrac13(3, 3) = (1, 1)$. $P = A + \\tfrac23(6, -9) = (1, -2)$. $D = A + C - B = (-1, 2)$.',
            { hint: 'Promedia coordenadas para el punto medio y el baricentro. Para P avanza desde A una fracción de AB. En el paralelogramo, AD es igual a BC.' }),
            play('combina-vectores', 'Pon $A$ en el origen. Escribe el punto con los vectores de los lados $\\overrightarrow{AB}$ y $\\overrightarrow{AC}$', {
              rounds: [
                { u: [4, 0], v: [1, 3], target: [2.5, 1.5], step: 0.5, names: ['AB', 'AC'] },
                { u: [4, 0], v: [1, 3], target: [5, 3], names: ['AB', 'AC'] },
              ],
            }, 'El punto medio de $BC$ es $\\tfrac12\\overrightarrow{AB} + \\tfrac12\\overrightarrow{AC}$. La punta $(5, 3)$ es $\\overrightarrow{AB} + \\overrightarrow{AC}$: el cuarto vértice del paralelogramo.',
            { hint: 'El punto medio de BC es el promedio de B y C. Una diagonal del paralelogramo es la suma de los dos lados.' }),
            num('Los vértices de un triángulo son $A(1, 2)$, $B(7, 4)$ y $C(4, 9)$. ¿Cuál es la coordenada $y$ del baricentro?', 5,
              '$\\tfrac13(2 + 4 + 9) = 5$.',
              { hint: 'El baricentro es el promedio de los tres vértices.' }),
            num('En el triángulo $ABC$, $M$ y $N$ son los puntos medios de $AB$ y $AC$. Si $\\|\\overrightarrow{BC}\\| = 14$, ¿cuánto mide $MN$?', 7,
              '$\\overrightarrow{MN} = \\tfrac12\\overrightarrow{BC}$, así que mide $7$.',
              { hint: 'Escribe MN como AN − AM, usando mitades de AC y de AB, y compáralo con BC.' }),
          ],
        },
        {
          id: 'geo-11', title: 'Vectores geométricos y vectores coordenados',
          clip: { scenes: [
            sc(6, 'Se eligen dos flechas unitarias perpendiculares, $\\hat\\imath$ y $\\hat\\jmath$. Toda flecha del plano se arma con ellas: $\\vec v = x\\,\\hat\\imath + y\\,\\hat\\jmath$.', { title: '$\\vec v = x\\,\\hat\\imath + y\\,\\hat\\jmath \\;\\leftrightarrow\\; (x, y)$', viz: { type: 'matrix', M: [[1, 0], [0, 1]] } }),
            sc(6, 'Así cada vector geométrico corresponde a un vector coordenado, y las operaciones se hacen con números. En el espacio se agrega $\\hat k$.', { steps: ['$\\vec v = 2\\hat\\imath - \\hat\\jmath + 3\\hat k \\leftrightarrow (2, -1, 3)$'] }),
            sc(6, 'El vector de $A$ a $B$ es **punta menos cola**.', { steps: ['$A(1, 4),\\; B(5, 1)$', '$\\overrightarrow{AB} = B - A = (4, -3)$'] }),
            sc(6, 'Su norma es la **distancia** entre los puntos, y dividir un vector entre su norma da el **unitario** en su dirección.', { steps: ['$\\|(4, -3)\\| = 5$', '$\\hat u = \\tfrac15(4, -3) = (0.8, -0.6)$'] }),
            sc(6, 'Otras dos flechas no paralelas también sirven de base: las coordenadas cambian, el vector no.', { title: '$\\vec v = a\\,\\vec e_1 + b\\,\\vec e_2$' }),
          ] },
          ex: [
            play('flecha-vector', 'Coloca la flecha según los datos de cada ronda', {
              rounds: [
                { ask: 'AB = (4, −3) y A = (−2, 2): ¿dónde está B?', points: [{ p: [-2, 2], name: 'A' }], tail: [-2, 2], at: 'tip', ans: [2, -1], show: ['tip'] },
                { ask: 'AB = (−5, 1). La punta ya está en B: arrastra la cola hasta A', points: [{ p: [1, 3], name: 'B' }], freeTail: true, tip: [1, 3], check: (w, t, tip) => tip[0] === 1 && tip[1] === 3 && w[0] === -5 && w[1] === 1, sol: 'A = (6, 2)', show: ['comp'] },
                { ask: 'Norma 5 y dirección opuesta a (−3, 4)', given: [{ v: [-3, 4], name: 'v' }], ans: [3, -4], show: ['comp', 'norm'] },
              ],
            }, '$B = A + (4, -3) = (2, -1)$. $A = B - (-5, 1) = (6, 2)$. El opuesto de $(-3, 4)$ es $(3, -4)$, que ya tiene norma 5.',
            { hint: 'Punta = cola + vector y cola = punta − vector. El opuesto de un vector cambia el signo de sus dos componentes.' }),
            play('combina-vectores', 'Encuentra las **coordenadas** del punto en cada base', {
              rounds: [
                { u: [1, 0], v: [0, 1], target: [-3, 4], names: ['î', 'ĵ'] },
                { u: [1, 1], v: [-1, 1], target: [2, 4], names: ['e₁', 'e₂'] },
              ],
            }, 'En la base usual las coordenadas son las componentes: $(-3, 4)$. En la otra, $3\\vec e_1 + 1\\vec e_2 = (3 - 1, 3 + 1) = (2, 4)$.',
            { hint: 'Con î y ĵ es inmediato. Con e₁ y e₂ escribe a(1, 1) + b(−1, 1) e iguala cada componente.' }),
            num('Distancia entre $P(1, -2, 3)$ y $Q(3, 1, 9)$', 7,
              '$\\overrightarrow{PQ} = (2, 3, 6)$ y $\\sqrt{4 + 9 + 36} = 7$.',
              { hint: 'Resta coordenada a coordenada y usa Pitágoras con tres componentes.' }),
            num('El vector unitario en la dirección de $(2, -1, 2)$: ¿cuál es su tercera componente?', 2 / 3,
              'La norma es $\\sqrt{4 + 1 + 4} = 3$, así que $\\hat u = (\\tfrac23, -\\tfrac13, \\tfrac23)$.',
              { tol: 0.01, answerText: '$\\tfrac{2}{3}$', hint: 'Divide el vector entre su norma.' }),
          ],
        },
        {
          id: 'geo-12', title: 'La recta',
          clip: { scenes: [
            sc(6, 'Una recta queda fija con **un punto** $P_0$ y **una dirección** $\\vec d$. Sus puntos son los que se alcanzan caminando desde $P_0$ cualquier múltiplo de $\\vec d$.', { title: '$P = P_0 + t\\,\\vec d,\\quad t \\in \\mathbb{R}$' }),
            sc(7, 'Separando componentes salen las **ecuaciones paramétricas**; despejando $t$ e igualando, las **simétricas**.', { steps: ['$P_0(1, 2, 0),\\; \\vec d = (2, -1, 3)$', '$x = 1 + 2t,\\; y = 2 - t,\\; z = 3t$', '$\\dfrac{x - 1}{2} = \\dfrac{y - 2}{-1} = \\dfrac{z}{3}$'] }),
            sc(6, 'Dos puntos $A$ y $B$ también la determinan: se usa $\\vec d = \\overrightarrow{AB}$.', { steps: ['$A(0, 1),\\; B(2, 5) \\Rightarrow \\vec d = (2, 4)$', '$(x, y) = (0, 1) + t\\,(2, 4)$'] }),
            sc(6, 'En el plano, $\\vec d = (d_1, d_2)$ tiene pendiente $m = d_2/d_1$, y la recta se escribe también $y = mx + b$.', { title: '$\\vec d = (1, m)$', viz: { type: 'graph', xr: [-1, 4], yr: [-1, 7], f: x => 2 * x + 1, points: [[0, 1, 'A'], [2, 5, 'B']] } }),
            sc(6, 'El parámetro $t$ es como un reloj: en $t = 0$ estamos en $P_0$, en $t = 1$ avanzamos un $\\vec d$ y los negativos van hacia atrás.', { steps: ['$t = 0 \\to (0, 1),\\; t = 1 \\to (2, 5),\\; t = -1 \\to (-2, -3)$'] }),
          ] },
          ex: [
            play('flecha-vector', 'La recta gris es $\\ell$. Pon la **cola** en un punto de $\\ell$ y la **punta** de modo que la flecha sea un vector director', {
              rounds: [
                { ask: 'Cola sobre ℓ y flecha a lo largo de ℓ', lines: [[1, -2, -1]], freeTail: true, check: (w, t) => (w[0] !== 0 || w[1] !== 0) && w[0] - 2 * w[1] === 0 && t[0] - 2 * t[1] === -1, sol: 'cola en un punto de x − 2y = −1, como (1, 1), y dirección paralela a (2, 1)', show: ['comp'] },
                { ask: 'Cola sobre ℓ y flecha a lo largo de ℓ', lines: [[2, 1, 0]], freeTail: true, check: (w, t) => (w[0] !== 0 || w[1] !== 0) && 2 * w[0] + w[1] === 0 && 2 * t[0] + t[1] === 0, sol: 'cola en un punto de 2x + y = 0, como (1, −2), y dirección paralela a (1, −2)', show: ['comp'] },
              ],
            }, 'La primera recta, $x - 2y = -1$, pasa por $(1, 1)$ y avanza 2 en $x$ por cada 1 en $y$: $\\vec d = (2, 1)$. La segunda, $2x + y = 0$, pasa por el origen con $\\vec d = (1, -2)$ o cualquier múltiplo.',
            { hint: 'Busca dos puntos de la cuadrícula por donde pase la recta: la flecha de uno al otro es un vector director.' }),
            num('La recta $\\vec r = (1, -2, 4) + t\\,(3, 1, -2)$ corta el plano $z = 0$. ¿Para qué valor de $t$?', 2,
              '$4 - 2t = 0 \\Rightarrow t = 2$.',
              { hint: 'Escribe la tercera componente de la recta en función de t e iguálala a cero.' }),
            num('La recta $\\vec r = (1, -2, 4) + t\\,(3, 1, -2)$ corta el plano $z = 0$ en un punto. ¿Cuánto vale su coordenada $x$?', 7,
              '$x = 1 + 3 \\cdot 2 = 7$ (el punto es $(7, 0, 0)$).',
              { hint: 'Primero halla el t en que la tercera componente vale cero; luego reemplázalo en la primera.' }),
            num('La recta que pasa por $(2, 5)$ con dirección $(3, -6)$ tiene pendiente…', -2,
              '$m = \\dfrac{-6}{3} = -2$.',
              { hint: 'La pendiente es la segunda componente del vector director dividida entre la primera.' }),
          ],
        },
        {
          id: 'geo-13', title: 'Lugares geométricos e intersecciones',
          clip: { scenes: [
            sc(6, 'Un **lugar geométrico** es el conjunto de puntos que cumplen una condición. La circunferencia: los puntos a distancia $r$ de un centro.', { title: '$\\|P - C\\| = r$' }),
            sc(7, 'La **mediatriz** de $AB$: los puntos a igual distancia de $A$ y de $B$. Al elevar al cuadrado, los términos $x^2$ y $y^2$ se cancelan y queda una recta.', { steps: ['$A(0, 0),\\; B(4, 2)$', '$x^2 + y^2 = (x - 4)^2 + (y - 2)^2$', '$8x + 4y = 20 \\Rightarrow 2x + y = 5$'] }),
            sc(6, 'En el espacio, los puntos $P$ con $\\overrightarrow{P_0P}$ perpendicular a un vector $\\vec n$ forman un **plano**.', { title: '$\\vec n \\cdot (P - P_0) = 0$' }),
            sc(7, '**Intersecciones**: se igualan las ecuaciones. Dos rectas del espacio pueden cortarse, ser paralelas o **cruzarse** sin tocarse.', { steps: ['$(1, 0, 0) + t(1, 1, 0)$ y $(0, 1, 0) + s(1, -1, 0)$', '$1 + t = s,\\; t = 1 - s \\Rightarrow t = 0$: se cortan en $(1, 0, 0)$'] }),
            sc(6, 'Recta y plano: se reemplaza la recta en la ecuación del plano y se despeja $t$.', { steps: ['$(t, t, 2t)$ en $x + y + z = 8$', '$4t = 8 \\Rightarrow t = 2$: el punto $(2, 2, 4)$'] }),
          ] },
          ex: [
            play('flecha-vector', 'La flecha sale del origen. Pon la **punta** en un punto del lugar geométrico', {
              rounds: [
                { ask: 'A la misma distancia de A y de B', points: [{ p: [-2, 0], name: 'A' }, { p: [4, 2], name: 'B' }], at: 'tip', check: (w, t, tip) => 3 * tip[0] + tip[1] === 4, sol: 'cualquier punto de 3x + y = 4, como (1, 1)', show: ['tip'] },
                { ask: 'Igual distancia a A y B, y sobre el eje y', points: [{ p: [-2, 0], name: 'A' }, { p: [4, 2], name: 'B' }], at: 'tip', ans: [0, 4], show: ['tip'] },
                { ask: 'A distancia 5 de C', points: [{ p: [1, 1], name: 'C' }], at: 'tip', check: (w, t, tip) => (tip[0] - 1) ** 2 + (tip[1] - 1) ** 2 === 25, sol: 'por ejemplo (4, 5), (1, 6) o (−4, 1)', show: ['tip'] },
              ],
            }, 'La mediatriz de $A(-2, 0)$ y $B(4, 2)$ es $3x + y = 4$; sobre el eje $y$ toca en $(0, 4)$. A distancia 5 de $C(1, 1)$ están, por ejemplo, $(4, 5)$ y $(-4, 1)$.',
            { hint: 'Escribe la condición con distancias al cuadrado. Para la mediatriz, al desarrollar se cancelan x² y y². Para la distancia 5 piensa en triángulos 3-4-5.' }),
            play('afina-sistema', 'Dos rectas, dos lugares geométricos: ajusta los términos independientes para que se corten en el punto marcado', {
              rounds: [{ e1: [2, 1, 0], e2: [1, -1, 0], free: [[0, 2], [1, 2]], goal: 'punto', P: [-1, 3] }],
            }, 'Al reemplazar $(-1, 3)$: $c_1 = -2 + 3 = 1$ y $c_2 = -1 - 3 = -4$.',
            { hint: 'Si el punto está en una recta, cumple su ecuación: reemplázalo en cada una.' }),
            num('Las rectas $(1, 2) + t\\,(2, 1)$ y $(3, 6) + s\\,(1, -1)$ se cortan. ¿En qué valor de $x$?', 5,
              '$1 + 2t = 3 + s$ y $2 + t = 6 - s$. Sumando: $3 + 3t = 9$, $t = 2$, y el punto es $(5, 4)$.',
              { hint: 'Iguala las dos coordenadas: te queda un sistema 2×2 en t y s. Luego reemplaza en una de las rectas.' }),
            num('La recta $(2, 0, 1) + t\\,(1, 1, 2)$ corta al plano $x + y + z = 9$. ¿Para qué valor de $t$?', 1.5,
              '$(2 + t) + t + (1 + 2t) = 3 + 4t = 9 \\Rightarrow t = 1.5$.',
              { tol: 0.001, hint: 'Sustituye las tres coordenadas de la recta en la ecuación del plano y despeja t.' }),
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- Parcial 3 (semanas 10–12)
    {
      world: 'productos', title: 'Producto escalar y producto vectorial',
      lessons: [
        {
          id: 'geo-14', title: 'Producto escalar',
          clip: { scenes: [
            sc(6, 'El **producto escalar** mide cuánto se acompañan dos vectores: sus longitudes por el coseno del ángulo entre ellos.', { title: '$\\vec u \\cdot \\vec v = \\|\\vec u\\|\\,\\|\\vec v\\|\\cos\\theta$' }),
            sc(6, 'Su signo dice cómo es el ángulo: positivo si es agudo, negativo si es obtuso y **cero si son perpendiculares**.', { steps: ['$\\theta < 90^\\circ \\Rightarrow \\vec u \\cdot \\vec v > 0$', '$\\theta = 90^\\circ \\iff \\vec u \\cdot \\vec v = 0$'] }),
            sc(6, 'Con componentes es una cuenta sencilla, en $\\mathbb{R}^2$ o en $\\mathbb{R}^3$.', { steps: ['$(a_1, a_2, a_3) \\cdot (b_1, b_2, b_3) = a_1b_1 + a_2b_2 + a_3b_3$', '$(1, 2, 2) \\cdot (2, 0, -1) = 2 + 0 - 2 = 0$'] }),
            sc(7, 'Juntando las dos formas se despeja el **ángulo**.', { steps: ['$\\cos\\theta = \\dfrac{\\vec u \\cdot \\vec v}{\\|\\vec u\\|\\,\\|\\vec v\\|}$', '$(1, 0) \\text{ y } (1, 1):\\; \\cos\\theta = \\tfrac{1}{\\sqrt2} \\Rightarrow \\theta = 45^\\circ$'] }),
            sc(6, 'Propiedades: es conmutativo, se distribuye sobre la suma y $\\vec u \\cdot \\vec u = \\|\\vec u\\|^2$.', { title: '$\\vec u \\cdot \\vec u = \\|\\vec u\\|^2$' }),
          ] },
          ex: [
            play('flecha-vector', 'Dibuja $\\vec w$ para que el producto escalar cumpla lo pedido', {
              rounds: [
                { ask: 'u·w = 0 con w ≠ 0', given: [{ v: [2, 3], name: 'u' }], check: w => 2 * w[0] + 3 * w[1] === 0 && (w[0] !== 0 || w[1] !== 0), sol: 'un múltiplo de (3, −2)', show: ['dot'] },
                { ask: 'u·w = 10 con w sobre el eje x', given: [{ v: [5, 1], name: 'u' }], ans: [2, 0], show: ['dot'] },
                { ask: 'u·w negativo y |w| = 5', given: [{ v: [1, 1], name: 'u' }], check: w => w[0] + w[1] < 0 && w[0] ** 2 + w[1] ** 2 === 25, sol: 'por ejemplo (−3, −4) o (0, −5)', show: ['dot', 'norm'] },
              ],
            }, 'Perpendicular a $(2, 3)$: $(3, -2)$. Sobre el eje $x$: $5w_1 = 10$, $\\vec w = (2, 0)$. Producto negativo quiere decir ángulo obtuso, y $(-3, -4)$ tiene norma 5.',
            { hint: 'u·w = u₁w₁ + u₂w₂. Mira la lectura de arriba mientras mueves la punta: perpendicular quiere decir que esa suma da cero.' }),
            num('¿Qué ángulo (en grados) forman $(1, 1, 0)$ y $(0, 1, 1)$?', 60,
              '$\\cos\\theta = \\dfrac{1}{\\sqrt2\\,\\sqrt2} = \\tfrac12$, así que $\\theta = 60^\\circ$.',
              { hint: 'Divide el producto escalar entre el producto de las normas y busca qué ángulo tiene ese coseno.' }),
            num('¿Para qué $k$ son perpendiculares $(k, 2, -1)$ y $(3, k, 4)$?', 0.8,
              '$3k + 2k - 4 = 0 \\Rightarrow k = 0.8$.',
              { tol: 0.001, hint: 'Perpendiculares quiere decir producto escalar cero: plantea la ecuación en k.' }),
            num('Si $\\|\\vec u\\| = 3$, $\\|\\vec v\\| = 4$ y $\\vec u \\cdot \\vec v = 6$, ¿cuánto vale $\\|\\vec u + \\vec v\\|^2$?', 37,
              '$(\\vec u + \\vec v)\\cdot(\\vec u + \\vec v) = 9 + 2 \\cdot 6 + 16 = 37$.',
              { hint: 'Desarrolla (u + v)·(u + v) como un binomio al cuadrado.' }),
          ],
        },
        {
          id: 'geo-15', title: 'Proyección ortogonal',
          clip: { scenes: [
            sc(6, 'Si el sol cae perpendicular a $\\vec v$, la **sombra** de $\\vec u$ sobre la recta de $\\vec v$ es su proyección ortogonal.', { title: '$\\operatorname{proy}_{\\vec v}\\vec u$' }),
            sc(6, 'La **componente escalar** es el largo (con signo) de esa sombra.', { title: '$\\operatorname{comp}_{\\vec v}\\vec u = \\dfrac{\\vec u \\cdot \\vec v}{\\|\\vec v\\|}$' }),
            sc(6, 'La **proyección** es ese largo en la dirección de $\\vec v$.', { title: '$\\operatorname{proy}_{\\vec v}\\vec u = \\dfrac{\\vec u \\cdot \\vec v}{\\|\\vec v\\|^2}\\,\\vec v$' }),
            sc(7, 'Ejemplo: proyectar $(2, 4)$ sobre $(3, 1)$.', { steps: ['$\\vec u \\cdot \\vec v = 6 + 4 = 10,\\; \\|\\vec v\\|^2 = 10$', '$\\operatorname{proy} = 1 \\cdot (3, 1) = (3, 1)$'] }),
            sc(6, 'Lo que sobra, $\\vec u - \\operatorname{proy}_{\\vec v}\\vec u$, es perpendicular a $\\vec v$: todo vector se parte en una parte paralela y otra perpendicular.', { steps: ['$(2, 4) - (3, 1) = (-1, 3)$', '$(-1, 3) \\cdot (3, 1) = 0$'] }),
          ] },
          ex: [
            play('flecha-vector', 'Dibuja la **proyección** de $\\vec u$ sobre $\\vec v$', {
              rounds: [
                { ask: 'proy de u sobre v', given: [{ v: [3, 4], name: 'u' }, { v: [2, 0], name: 'v' }], ans: [3, 0], show: ['comp'] },
                { ask: 'proy de u sobre v', given: [{ v: [4, 2], name: 'u' }, { v: [1, 1], name: 'v' }], ans: [3, 3], show: ['comp'] },
                { ask: 'proy de u sobre v', given: [{ v: [-1, 3], name: 'u' }, { v: [2, -1], name: 'v' }], ans: [-2, 1], show: ['comp'] },
              ],
            }, 'Sobre el eje $x$ la sombra de $(3, 4)$ es $(3, 0)$. $\\tfrac{6}{2}(1, 1) = (3, 3)$. $\\tfrac{-5}{5}(2, -1) = (-2, 1)$: el coeficiente negativo voltea la sombra.',
            { hint: 'Calcula el número (u·v)/(v·v) y multiplica v por él. La proyección siempre queda sobre la recta de v.' }),
            play('flecha-vector', 'Ahora la parte de $\\vec u$ **perpendicular** a $\\vec v$', {
              rounds: [
                { ask: 'u − proy de u sobre v', given: [{ v: [4, 2], name: 'u' }, { v: [1, 1], name: 'v' }], ans: [1, -1], show: ['comp'] },
                { ask: 'u − proy de u sobre v', given: [{ v: [-1, 3], name: 'u' }, { v: [2, -1], name: 'v' }], ans: [1, 2], show: ['comp'] },
              ],
            }, '$(4, 2) - (3, 3) = (1, -1)$ y $(-1, 3) - (-2, 1) = (1, 2)$. Las dos son perpendiculares a su $\\vec v$.',
            { hint: 'Usa la proyección del juego anterior y réstasela a u. Comprueba que lo que dibujas forma ángulo recto con v.' }),
            num('Componente escalar de $(2, -1, 3)$ sobre $(0, 3, 4)$', 1.8,
              '$\\dfrac{0 - 3 + 12}{5} = \\dfrac95 = 1.8$.',
              { tol: 0.001, hint: 'Producto escalar dividido entre la norma del vector sobre el que se proyecta.' }),
            num('Si $\\operatorname{proy}_{\\vec v}\\vec u = \\vec 0$ y ninguno es el vector cero, ¿qué ángulo forman (en grados)?', 90,
              'La proyección es cero cuando $\\vec u \\cdot \\vec v = 0$: son perpendiculares.',
              { hint: 'Mira el número que multiplica a v en la fórmula de la proyección: ¿cuándo vale cero?' }),
          ],
        },
        {
          id: 'geo-16', title: 'Producto escalar y geometría analítica',
          clip: { scenes: [
            sc(6, 'En el plano, $ax + by = c$ es la recta **perpendicular** al vector $\\vec n = (a, b)$: el **vector normal** se lee en los coeficientes.', { title: '$\\vec n \\cdot (P - P_0) = 0$' }),
            sc(6, 'En el espacio, la misma idea da la ecuación del **plano**.', { steps: ['$P_0(1, 0, 2),\\; \\vec n = (3, -1, 2)$', '$3(x - 1) - y + 2(z - 2) = 0$', '$3x - y + 2z = 7$'] }),
            sc(7, 'La **distancia** de un punto a una recta o a un plano es la proyección sobre la normal.', { title: '$\\text{dist} = \\dfrac{|a x_0 + b y_0 + c z_0 - D|}{\\|\\vec n\\|}$', steps: ['$(1, 2, 3)$ al plano $2x - y + 2z = 1$', '$\\text{dist} = \\dfrac{|2 - 2 + 6 - 1|}{3} = \\dfrac53$'] }),
            sc(6, 'El **ángulo entre dos planos** es el ángulo entre sus normales; son paralelos si las normales lo son y perpendiculares si $\\vec n_1 \\cdot \\vec n_2 = 0$.', { title: '$\\cos\\theta = \\dfrac{|\\vec n_1 \\cdot \\vec n_2|}{\\|\\vec n_1\\|\\,\\|\\vec n_2\\|}$' }),
          ] },
          ex: [
            play('flecha-vector', 'Usa la recta gris. Dibuja lo que pide cada ronda', {
              rounds: [
                { ask: 'Un vector normal a 2x − y = 1', lines: [[2, -1, 1]], check: w => (w[0] !== 0 || w[1] !== 0) && -w[0] - 2 * w[1] === 0, sol: 'un múltiplo de (2, −1)', show: ['comp'] },
                { ask: 'Un vector director de 3x + 2y = 6', lines: [[3, 2, 6]], check: w => (w[0] !== 0 || w[1] !== 0) && 3 * w[0] + 2 * w[1] === 0, sol: 'un múltiplo de (2, −3)', show: ['comp'] },
                { ask: 'El pie de la perpendicular desde el origen a x + y = 4', lines: [[1, 1, 4]], at: 'tip', ans: [2, 2], show: ['tip'] },
              ],
            }, 'La normal de $2x - y = 1$ es $(2, -1)$. Un director de $3x + 2y = 6$ es perpendicular a $(3, 2)$: $(2, -3)$. Desde el origen se camina por la normal $(1, 1)$ hasta la recta: $(2, 2)$.',
            { hint: 'Recuerda qué vector se lee en los coeficientes de la ecuación y qué ángulo forma con la recta. Un director va a lo largo de la recta.' }),
            num('Distancia del punto $(3, -1)$ a la recta $4x + 3y = 4$', 1,
              '$\\dfrac{|12 - 3 - 4|}{5} = 1$.',
              { hint: 'Reemplaza el punto en ax + by − c, toma valor absoluto y divide entre la norma de la normal.' }),
            num('Plano por $(1, 2, -1)$ con normal $(2, -1, 3)$: $2x - y + 3z = d$. ¿Cuánto vale $d$?', -3,
              '$d = 2 - 2 - 3 = -3$.',
              { hint: 'El punto dado tiene que cumplir la ecuación del plano.' }),
            num('Distancia del punto $(1, 1, 1)$ al plano $2x + 2y + z = 14$', 3,
              '$\\dfrac{|2 + 2 + 1 - 14|}{\\sqrt{9}} = \\dfrac93 = 3$.',
              { hint: 'Misma fórmula que en el plano, ahora con tres coordenadas y la norma de (2, 2, 1).' }),
            num('¿Qué ángulo (en grados) forman los planos $x + y + z = 1$ y $x - y = 0$?', 90,
              'Las normales $(1, 1, 1)$ y $(1, -1, 0)$ tienen producto escalar $0$: los planos son perpendiculares.',
              { hint: 'El ángulo entre planos es el ángulo entre sus vectores normales.' }),
          ],
        },
        {
          id: 'geo-17', title: 'Producto vectorial',
          clip: { scenes: [
            sc(6, 'El **producto vectorial** $\\vec u \\times \\vec v$ es un vector **perpendicular a los dos**, con el sentido de la regla de la mano derecha.', { title: '$\\vec u \\times \\vec v \\perp \\vec u,\\; \\vec v$' }),
            sc(6, 'Su longitud es el **área del paralelogramo** que forman.', { title: '$\\|\\vec u \\times \\vec v\\| = \\|\\vec u\\|\\,\\|\\vec v\\|\\sin\\theta$' }),
            sc(7, 'Se calcula con un determinante «simbólico», tapando una columna por vez.', { steps: ['$\\vec u \\times \\vec v = \\begin{vmatrix} \\hat\\imath & \\hat\\jmath & \\hat k \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}$', '$(1, 0, 2) \\times (0, 1, 1) = (0 - 2,\\; -(1 - 0),\\; 1 - 0) = (-2, -1, 1)$'] }),
            sc(6, 'No es conmutativo: cambiar el orden cambia el sentido. Y el producto de un vector por sí mismo (o por uno paralelo) es cero.', { steps: ['$\\vec v \\times \\vec u = -\\,\\vec u \\times \\vec v$', '$\\hat\\imath \\times \\hat\\jmath = \\hat k,\\; \\hat\\jmath \\times \\hat k = \\hat\\imath,\\; \\hat k \\times \\hat\\imath = \\hat\\jmath$'] }),
            sc(6, 'En el plano solo sobrevive la componente $\\hat k$: $u_1v_2 - u_2v_1$, positiva si $\\vec v$ gira a la izquierda de $\\vec u$.', { title: '$(u_1, u_2, 0) \\times (v_1, v_2, 0) = (0, 0, u_1v_2 - u_2v_1)$' }),
          ] },
          ex: [
            play('flecha-vector', 'En el plano, $\\vec u \\times \\vec w$ sale de la pantalla (+) o entra (−) y su tamaño es el área del paralelogramo. Dibuja $\\vec w$', {
              rounds: [
                { ask: 'u×w = 8 (área 8, saliendo)', given: [{ v: [4, 0], name: 'u' }], check: w => 4 * w[1] === 8, sol: 'w con segunda componente 2, como (0, 2)', show: ['cross'] },
                { ask: 'u×w = −6', given: [{ v: [2, 2], name: 'u' }], check: w => 2 * w[1] - 2 * w[0] === -6, sol: 'por ejemplo (3, 0) o (0, −3)', show: ['cross'] },
                { ask: 'u×w = 0, w ≠ 0 y opuesto a u', given: [{ v: [1, -2], name: 'u' }], check: w => -2 * w[0] - w[1] === 0 && w[0] - 2 * w[1] < 0, sol: 'un múltiplo negativo de u, como (−1, 2)', show: ['cross', 'dot'] },
              ],
            }, 'Con base 4 sobre el eje $x$ la altura debe ser 2. Con $(2, 2)$: $2w_2 - 2w_1 = -6$, por ejemplo $(3, 0)$. Producto cruz cero es paralelo; opuesto quiere decir producto escalar negativo: $(-1, 2)$.',
            { hint: 'u×w = u₁w₂ − u₂w₁. Positivo si w queda a la izquierda de u (sentido antihorario).' }),
            num('$(1, 2, 0) \\times (3, -1, 2)$: ¿cuál es la primera componente?', 4,
              '$2 \\cdot 2 - 0 \\cdot (-1) = 4$.',
              { hint: 'Primera componente: tapa la columna de x y calcula el determinante 2×2 que queda.' }),
            num('$(1, 2, 0) \\times (3, -1, 2)$: ¿cuál es la tercera componente?', -7,
              '$1 \\cdot (-1) - 2 \\cdot 3 = -7$.',
              { hint: 'Tercera componente: tapa la columna de z.' }),
            num('Área del triángulo de vértices $(0, 0, 0)$, $(2, 0, 0)$ y $(0, 3, 4)$', 5,
              '$(2, 0, 0) \\times (0, 3, 4) = (0, -8, 6)$, de norma 10; el triángulo es la mitad: $5$.',
              { hint: 'El triángulo es la mitad del paralelogramo de dos de sus lados.' }),
            num('$\\hat\\jmath \\times \\hat\\imath = c\\,\\hat k$. ¿Cuánto vale $c$?', -1,
              '$\\hat\\imath \\times \\hat\\jmath = \\hat k$, y al cambiar el orden cambia el signo.',
              { hint: 'Usa que î × ĵ = k̂ y que el producto vectorial no es conmutativo.' }),
          ],
        },
        {
          id: 'geo-18', title: 'Producto vectorial y geometría analítica',
          clip: { scenes: [
            sc(6, '**Plano por tres puntos**: $\\overrightarrow{AB} \\times \\overrightarrow{AC}$ es perpendicular a los dos, así que es una normal del plano.', { steps: ['$A(1, 0, 0),\\; B(0, 1, 0),\\; C(0, 0, 1)$', '$\\vec n = (-1, 1, 0) \\times (-1, 0, 1) = (1, 1, 1)$', '$x + y + z = 1$'] }),
            sc(6, '**Recta de corte de dos planos**: su dirección es perpendicular a las dos normales.', { title: '$\\vec d = \\vec n_1 \\times \\vec n_2$' }),
            sc(6, '**Distancia de un punto a una recta** del espacio: el área del paralelogramo dividida entre la base.', { title: '$d = \\dfrac{\\|\\overrightarrow{AP} \\times \\vec d\\|}{\\|\\vec d\\|}$' }),
            sc(7, 'El **triple producto** $\\vec u \\cdot (\\vec v \\times \\vec w)$ es el determinante de los tres vectores; su valor absoluto es el **volumen del paralelepípedo**. Si vale cero, los tres son coplanares.', { steps: ['$\\det\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix} = 6$: una caja $1 \\times 2 \\times 3$'] }),
          ] },
          ex: [
            play('flecha-vector', 'La flecha azul es $\\overrightarrow{AB}$. Arrastra la punta hasta un punto $C$ para que el triángulo $ABC$ tenga el área pedida', {
              rounds: [
                { ask: 'Área del triángulo ABC = 6', given: [{ v: [4, 0], at: [-2, -1], name: 'AB' }], points: [{ p: [-2, -1], name: 'A' }], tail: [-2, -1], check: w => Math.abs(4 * w[1]) === 12, sol: 'cualquier C a 3 unidades de la recta AB', show: ['cross'] },
                { ask: 'Área del triángulo ABC = 3', given: [{ v: [3, 3], at: [-3, -2], name: 'AB' }], points: [{ p: [-3, -2], name: 'A' }], tail: [-3, -2], check: w => Math.abs(3 * w[1] - 3 * w[0]) === 6, sol: 'por ejemplo C = A + (2, 0)', show: ['cross'] },
              ],
            }, 'El área del triángulo es la mitad de $|\\overrightarrow{AB} \\times \\overrightarrow{AC}|$. En la primera, $|4\\,w_2| = 12$: $C$ tres unidades arriba o abajo de $AB$. En la segunda, $|3w_2 - 3w_1| = 6$.',
            { hint: 'El producto cruz de AB con la flecha es el área del paralelogramo; el triángulo es la mitad.' }),
            num('Plano por $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$: su normal $\\overrightarrow{AB} \\times \\overrightarrow{AC}$ es $(6, 3, c)$. ¿Cuánto vale $c$?', 2,
              '$\\overrightarrow{AB} = (-1, 2, 0)$, $\\overrightarrow{AC} = (-1, 0, 3)$; tercera componente $(-1)(0) - 2(-1) = 2$. El plano es $6x + 3y + 2z = 6$.',
              { hint: 'Calcula los dos vectores desde A y luego la tercera componente del producto vectorial: tapa la columna de z.' }),
            num('Volumen del paralelepípedo determinado por $(1, 0, 0)$, $(1, 2, 0)$ y $(3, 1, 4)$', 8,
              '$\\det\\begin{pmatrix} 1 & 0 & 0 \\\\ 1 & 2 & 0 \\\\ 3 & 1 & 4 \\end{pmatrix} = 1 \\cdot 2 \\cdot 4 = 8$.',
              { hint: 'Es el valor absoluto del determinante con los tres vectores como filas; mira si la matriz es triangular.' }),
            num('Distancia del punto $P(1, 3, 4)$ a la recta $t\\,(1, 0, 0)$', 5,
              '$\\overrightarrow{AP} \\times \\vec d = (1, 3, 4) \\times (1, 0, 0) = (0, 4, -3)$, de norma 5, y $\\|\\vec d\\| = 1$.',
              { hint: 'Toma A en el origen: calcula |AP × d| / |d|.' }),
            num('La recta de corte de $x + y + z = 1$ y $x - y = 0$ tiene dirección $\\vec n_1 \\times \\vec n_2 = (1, 1, c)$. ¿Cuánto vale $c$?', -2,
              '$(1, 1, 1) \\times (1, -1, 0)$: tercera componente $1 \\cdot (-1) - 1 \\cdot 1 = -2$.',
              { hint: 'Las normales son los coeficientes de cada plano; calcula la tercera componente de su producto vectorial.' }),
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- Parcial 4 (semanas 13–14)
    {
      world: 'mecanica', title: 'Vectores en la mecánica',
      lessons: [
        {
          id: 'geo-19', title: 'Fuerzas coplanarias y concurrentes',
          clip: { scenes: [
            sc(6, 'Una **fuerza** es un vector: tiene magnitud (en newtons), dirección y sentido. Si todas actúan sobre el mismo punto son **concurrentes**; si están en un mismo plano, **coplanarias**.', { viz: { type: 'vectors', A: [3, 1], B: [-1, 2] } }),
            sc(6, 'Su efecto conjunto es la **resultante**: la suma vectorial.', { title: '$\\vec R = \\vec F_1 + \\vec F_2 + \\cdots$' }),
            sc(6, 'Con magnitud y ángulo, cada fuerza se descompone en sus componentes.', { steps: ['$\\vec F = F(\\cos\\theta, \\sin\\theta)$', '$10 \\text{ N a } 30^\\circ = (8.66,\\; 5)$'] }),
            sc(7, 'Un cuerpo está en **equilibrio** cuando la resultante es cero: la suma de componentes en $x$ y en $y$ se anula.', { title: '$\\sum F_x = 0,\\quad \\sum F_y = 0$' }),
            sc(7, 'Ejemplo: una lámpara de 60 N cuelga de dos cables a $45^\\circ$. Por simetría las tensiones son iguales y sus partes verticales sostienen el peso.', { steps: ['$2T\\sin 45^\\circ = 60$', '$T = \\dfrac{60}{\\sqrt2} \\approx 42.4$ N'] }),
          ] },
          ex: [
            play('flecha-vector', 'Dibuja la fuerza que **equilibra** a las demás: la suma tiene que dar cero', {
              rounds: [
                { ask: 'Equilibra F₁ y F₂', given: [{ v: [3, 1], name: 'F₁' }, { v: [-1, 2], name: 'F₂' }], ans: [-2, -3], show: ['sum'], name: 'F' },
                { ask: 'Equilibra F₁, F₂ y F₃', given: [{ v: [4, -2], name: 'F₁' }, { v: [-1, -3], name: 'F₂' }, { v: [-2, 1], name: 'F₃' }], ans: [-1, 4], show: ['sum'], name: 'F' },
              ],
            }, 'La equilibrante es la opuesta de la resultante: $-(2, 3) = (-2, -3)$ y $-(1, -4) = (-1, 4)$.',
            { hint: 'Suma las fuerzas dadas: la que buscas tiene las mismas componentes con el signo cambiado.' }),
            play('flecha-vector', 'Ahora dibuja la **resultante**', {
              rounds: [{ ask: 'R = F₁ + F₂ + F₃', given: [{ v: [-3, 2], name: 'F₁' }, { v: [1, 2], name: 'F₂' }, { v: [4, -1], name: 'F₃' }], ans: [2, 3], show: ['comp'], name: 'R' }],
            }, '$(-3 + 1 + 4,\\; 2 + 2 - 1) = (2, 3)$.',
            { hint: 'Suma por separado las componentes x y las componentes y.' }),
            num('Dos cables simétricos sostienen un peso de 100 N; cada uno forma $30^\\circ$ con la horizontal. ¿Tensión de cada cable (N)?', 100,
              '$2T\\sin 30^\\circ = 100 \\Rightarrow T = 100$ N: con cables tan horizontales, cada uno soporta tanto como el peso entero.',
              { hint: 'En equilibrio, las componentes verticales de las dos tensiones suman el peso.' }),
            num('Resultante de 30 N hacia el este y 40 N hacia el norte (magnitud, en N)', 50,
              '$\\sqrt{30^2 + 40^2} = 50$ N.',
              { hint: 'Las dos fuerzas son perpendiculares: usa Pitágoras.' }),
            num('Una fuerza de 20 N forma $60^\\circ$ con el eje $x$. ¿Cuánto vale su componente en $x$ (N)?', 10,
              '$20\\cos 60^\\circ = 10$ N.',
              { hint: 'La componente en x es la magnitud por el coseno del ángulo con el eje x.' }),
          ],
        },
        {
          id: 'geo-20', title: 'Cinemática',
          clip: { scenes: [
            sc(6, 'La **posición** de un móvil es un vector $\\vec r(t)$ que cambia con el tiempo. El **desplazamiento** es la flecha de una posición a otra.', { title: '$\\Delta\\vec r = \\vec r(t_2) - \\vec r(t_1)$' }),
            sc(6, 'La **velocidad media** es el desplazamiento entre el tiempo; la **rapidez** es su norma.', { title: '$\\vec v_m = \\dfrac{\\Delta\\vec r}{\\Delta t}$' }),
            sc(7, 'Con velocidad constante, el móvil recorre una **recta paramétrica**: el tiempo hace de parámetro.', { steps: ['$\\vec r(t) = \\vec r_0 + t\\,\\vec v$', '$\\vec r_0 = (0, 2),\\; \\vec v = (3, 1) \\Rightarrow \\vec r(2) = (6, 4)$'] }),
            sc(7, '**Velocidades relativas**: lo que ve alguien en tierra es la suma de la velocidad propia y la del medio (agua, viento).', { steps: ['$\\vec v_{\\text{tierra}} = \\vec v_{\\text{propia}} + \\vec v_{\\text{medio}}$', 'nadador $(0, 1.5)$ en río $(2, 0)$: $(2, 1.5)$, rapidez $2.5$'] }),
          ] },
          ex: [
            play('flecha-vector', 'Dibuja la velocidad pedida', {
              rounds: [
                { ask: 'Lancha (0, 4) m/s en un río a (3, 0): velocidad respecto a tierra', given: [{ v: [0, 4], name: 'lancha' }, { v: [3, 0], name: 'río' }], ans: [3, 4], show: ['comp', 'norm'], name: 'v' },
                { ask: 'Rapidez propia 5 y río a (3, 0): ¿hacia dónde apuntar para cruzar derecho (hacia arriba)?', given: [{ v: [3, 0], name: 'río' }], check: w => w[0] === -3 && w[1] > 0 && w[0] ** 2 + w[1] ** 2 === 25, sol: '(−3, 4)', show: ['comp', 'norm', 'sum'], name: 'v' },
              ],
            }, 'Primera: $(0, 4) + (3, 0) = (3, 4)$, rapidez 5. Segunda: para que la suma no tenga componente $x$, la lancha debe compensar el río: $(-3, 4)$, y cruza a $(0, 4)$.',
            { hint: 'Lo que se ve desde tierra es la suma de las velocidades. Para cruzar derecho, la suma no debe tener componente en x.' }),
            play('flecha-vector', 'Un móvil parte de $(-4, -2)$ con velocidad constante $(2, 1)$ por segundo. Pon la **punta** donde estará a los 3 s', {
              rounds: [{ ask: 'Posición en t = 3 s', points: [{ p: [-4, -2], name: 'r₀' }], at: 'tip', ans: [2, 1], show: ['tip'] }],
            }, '$\\vec r(3) = (-4, -2) + 3(2, 1) = (2, 1)$.',
            { hint: 'Usa r(t) = r₀ + t·v con t = 3.' }),
            num('Un móvil pasa por $(1, 2)$ en $t = 0$ s y por $(9, 8)$ en $t = 2$ s. ¿Cuál es su rapidez media (m/s)?', 5,
              '$\\Delta\\vec r = (8, 6)$, $\\vec v_m = (4, 3)$ y su norma es $5$.',
              { hint: 'Divide el desplazamiento entre el tiempo y luego calcula la norma de ese vector.' }),
            num('Un avión vuela a $(200, 0)$ km/h respecto al aire con viento $(0, -50)$ km/h. ¿Rapidez respecto a tierra (km/h)?', Math.hypot(200, 50),
              '$\\|(200, -50)\\| = \\sqrt{42500} \\approx 206.2$ km/h.',
              { tol: 0.1, answerText: '$\\approx 206.2$ km/h', hint: 'Suma las dos velocidades y calcula la norma del resultado.' }),
          ],
        },
        {
          id: 'geo-21', title: 'Trabajo y momento de una fuerza',
          clip: { scenes: [
            sc(6, 'Al arrastrar una caja, solo la parte de la fuerza **a lo largo del camino** la mueve. Por eso el **trabajo** es un producto escalar.', { title: '$W = \\vec F \\cdot \\vec d = \\|\\vec F\\|\\,\\|\\vec d\\|\\cos\\theta$' }),
            sc(6, 'Si la fuerza es perpendicular al desplazamiento no hace trabajo; si va en contra, el trabajo es negativo.', { steps: ['$\\vec F = (3, 4),\\; \\vec d = (5, 0) \\Rightarrow W = 15$ J', '$\\theta = 90^\\circ \\Rightarrow W = 0$'] }),
            sc(7, 'El **momento** de una fuerza respecto a un punto mide su tendencia a hacer **girar**. Es un producto vectorial: brazo por fuerza.', { title: '$\\vec M = \\vec r \\times \\vec F$' }),
            sc(6, 'Su tamaño es $\\|\\vec r\\|\\,\\|\\vec F\\|\\sin\\theta$: por eso una llave larga ayuda y empujar a lo largo del brazo no sirve.', { steps: ['$\\vec r = (0.3, 0),\\; \\vec F = (0, 50)$', '$M = 0.3 \\cdot 50 = 15$ N·m, antihorario'] }),
          ] },
          ex: [
            play('flecha-vector', '**Trabajo**: elige la fuerza $\\vec F$ para el desplazamiento $\\vec d$', {
              rounds: [
                { ask: 'W = 12 J con una fuerza inclinada (no horizontal)', given: [{ v: [4, 0], name: 'd' }], check: w => 4 * w[0] === 12 && w[1] !== 0, sol: 'cualquier F con componente x igual a 3, como (3, 2)', show: ['dot'], name: 'F' },
                { ask: 'W = 0 J con F ≠ 0', given: [{ v: [3, 3], name: 'd' }], check: w => 3 * w[0] + 3 * w[1] === 0 && (w[0] !== 0 || w[1] !== 0), sol: 'un múltiplo de (1, −1)', show: ['dot'], name: 'F' },
              ],
            }, 'Solo la componente a lo largo de $\\vec d$ trabaja: con $\\vec d = (4, 0)$ hace falta $F_x = 3$, sea cual sea $F_y$. Trabajo cero es fuerza perpendicular al camino.',
            { hint: 'W = F·d. La parte de F perpendicular al desplazamiento no aporta nada al trabajo.' }),
            play('flecha-vector', '**Momento**: la fuerza se aplica en la punta del brazo $\\vec r$ (el giro es alrededor del origen). Dibuja $\\vec F$', {
              rounds: [
                { ask: 'Momento +6 (antihorario)', given: [{ v: [3, 0], name: 'r' }], tail: [3, 0], check: w => 3 * w[1] === 6, sol: 'F con componente y igual a 2, como (0, 2)', show: ['cross'], name: 'F' },
                { ask: 'Momento cero con F ≠ 0', given: [{ v: [2, 2], name: 'r' }], tail: [2, 2], check: w => 2 * w[1] - 2 * w[0] === 0 && (w[0] !== 0 || w[1] !== 0), sol: 'una fuerza a lo largo del brazo, como (1, 1)', show: ['cross'], name: 'F' },
                { ask: 'Momento −9 (horario)', given: [{ v: [0, 3], name: 'r' }], tail: [0, 3], check: w => -3 * w[0] === -9, sol: 'F con componente x igual a 3, como (3, 0)', show: ['cross'], name: 'F' },
              ],
            }, '$M = r_1F_2 - r_2F_1$. Con $\\vec r = (3, 0)$: $3F_2 = 6$. A lo largo del brazo no hay giro. Con $\\vec r = (0, 3)$: $-3F_1 = -9$, $F_1 = 3$.',
            { hint: 'El momento es r × F = r₁F₂ − r₂F₁. Positivo hace girar en sentido antihorario.' }),
            num('Una fuerza de 50 N forma $60^\\circ$ con un desplazamiento de 10 m. ¿Trabajo (J)?', 250,
              '$W = 50 \\cdot 10 \\cdot \\cos 60^\\circ = 250$ J.',
              { hint: 'Solo cuenta la parte de la fuerza en la dirección del desplazamiento: usa el coseno.' }),
            num('Se aplican 40 N perpendiculares a una llave de 0.25 m. ¿Magnitud del momento (N·m)?', 10,
              '$M = 0.25 \\cdot 40 \\cdot \\sin 90^\\circ = 10$ N·m.',
              { hint: 'Momento = brazo × fuerza × seno del ángulo entre ellos.' }),
            num('$\\vec F = (2, 1, 0)$ N se aplica en $\\vec r = (0, 0, 3)$ m. ¿Primera componente de $\\vec r \\times \\vec F$?', -3,
              '$\\vec r \\times \\vec F = (0 \\cdot 0 - 3 \\cdot 1,\\; -(0 \\cdot 0 - 3 \\cdot 2),\\; 0) = (-3, 6, 0)$.',
              { hint: 'Tapa la columna de x en el determinante con r en la segunda fila y F en la tercera.' }),
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- Parcial 4 (semanas 15–16)
    {
      world: 'conicas', title: 'Las cónicas',
      lessons: [
        {
          id: 'geo-22', title: 'La circunferencia y la parábola',
          clip: { scenes: [
            sc(6, 'La **circunferencia** es el lugar geométrico de los puntos a distancia $r$ de un centro $(h, k)$. Elevar la distancia al cuadrado da su ecuación.', { title: '$(x - h)^2 + (y - k)^2 = r^2$', viz: { type: 'graph', xr: [-2, 6], yr: [-3, 5], fs: [{ f: x => 1 + Math.sqrt(9 - (x - 2) ** 2) }, { f: x => 1 - Math.sqrt(9 - (x - 2) ** 2), color: '#8b7bff' }], points: [[2, 1, 'centro']] } }),
            sc(7, 'Si viene **desarrollada**, se completa el cuadrado en $x$ y en $y$ para ver centro y radio.', { steps: ['$x^2 + y^2 - 4x - 2y - 4 = 0$', '$(x - 2)^2 + (y - 1)^2 = 4 + 4 + 1 = 9$', 'centro $(2, 1)$, radio $3$'] }),
            sc(7, 'La **parábola** es el lugar de los puntos que están a la misma distancia de un punto (el **foco**) y de una recta (la **directriz**). El vértice queda en la mitad.', { title: '$\\text{dist}(P, F) = \\text{dist}(P, \\ell)$' }),
            sc(7, 'Con vértice $(h, k)$ y $p$ la distancia (con signo) del vértice al foco, se abre hacia el foco.', { steps: ['$(x - h)^2 = 4p\\,(y - k)$: abre arriba ($p > 0$) o abajo', '$(y - k)^2 = 4p\\,(x - h)$: abre a la derecha ($p > 0$) o a la izquierda'] }),
            sc(6, 'Ejemplo: $x^2 = 8y$ tiene $4p = 8$, $p = 2$: foco $(0, 2)$ y directriz $y = -2$.', { viz: { type: 'graph', xr: [-5, 5], yr: [-3, 4], f: x => x * x / 8, points: [[0, 2, 'F']] } }),
          ] },
          ex: [
            play('conica-viva', 'Ajusta el centro y el radio hasta que la circunferencia sea la pedida', {
              rounds: [
                { type: 'circ', eq: 'x² + y² + 6x − 2y − 6 = 0', ans: { h: -3, k: 1, r: 4 } },
                { type: 'circ', eq: 'Centro (2, −1) y pasa por (5, 3)', ans: { h: 2, k: -1, r: 5 } },
                { type: 'circ', eq: 'x² + y² − 8y = 9', ans: { h: 0, k: 4, r: 5 } },
              ],
            }, '$(x + 3)^2 + (y - 1)^2 = 6 + 9 + 1 = 16$. El radio es la distancia de $(2, -1)$ a $(5, 3)$: $5$. $x^2 + (y - 4)^2 = 9 + 16 = 25$.',
            { hint: 'Completa el cuadrado: el número que acompaña a x, dividido entre 2 y con el signo cambiado, es la coordenada del centro. Lo que sumes a la izquierda súmalo también a la derecha.' }),
            play('conica-viva', 'Ahora parábolas: mueve el vértice, $p$ y el eje', {
              rounds: [
                { type: 'par', eq: '(x − 1)² = 8(y + 2)', ans: { h: 1, k: -2, p: 2, dir: 'y' } },
                { type: 'par', eq: 'Foco (−1, 0) y directriz x = 3', ans: { h: 1, k: 0, p: -2, dir: 'x' } },
                { type: 'par', eq: 'y² − 4y − 4x = 0', ans: { h: -1, k: 2, p: 1, dir: 'x' } },
              ],
            }, 'Primera: vértice $(1, -2)$, $4p = 8$. Segunda: el vértice está entre foco y directriz, en $(1, 0)$, y el foco queda 2 a la izquierda: $p = -2$. Tercera: $(y - 2)^2 = 4(x + 1)$.',
            { hint: 'Si la variable al cuadrado es x, la parábola abre en y, y al revés. El vértice está justo en la mitad entre el foco y la directriz.' }),
            num('¿Cuál es la coordenada $y$ del foco de $x^2 = -12y$?', -3,
              '$4p = -12 \\Rightarrow p = -3$: el foco es $(0, -3)$ y la parábola abre hacia abajo.',
              { hint: 'Compara con x² = 4py y despeja p; el foco está a p del vértice.' }),
            num('Una antena parabólica mide 2 m de ancho y 0.25 m de profundidad. ¿A qué distancia del vértice está el foco (m)?', 1,
              'Con el vértice en el origen, el borde $(1, 0.25)$ cumple $x^2 = 4py$: $1 = 4p \\cdot 0.25$, así que $p = 1$ m.',
              { hint: 'Pon el vértice en el origen: el borde de la antena es un punto de x² = 4py.' }),
          ],
        },
        {
          id: 'geo-23', title: 'La elipse y la hipérbola',
          clip: { scenes: [
            sc(7, 'La **elipse** es el lugar de los puntos cuya **suma** de distancias a dos focos es constante. Se dibuja con un hilo amarrado a dos clavos.', { title: '$d(P, F_1) + d(P, F_2) = 2a$' }),
            sc(7, 'Con centro $(h, k)$ y semiejes $a$ (horizontal) y $b$ (vertical). Los focos están sobre el eje mayor, a distancia $c$ del centro.', { title: '$\\dfrac{(x - h)^2}{a^2} + \\dfrac{(y - k)^2}{b^2} = 1$', steps: ['$c^2 = (\\text{mayor})^2 - (\\text{menor})^2$', '$\\tfrac{x^2}{25} + \\tfrac{y^2}{9} = 1:\\; c = 4$, focos $(\\pm4, 0)$'] }),
            sc(7, 'La **hipérbola**: la **diferencia** de distancias a los focos es constante. Tiene dos ramas y dos **asíntotas**.', { title: '$|d(P, F_1) - d(P, F_2)| = \\text{cte}$' }),
            sc(7, 'Si abre en $x$, el término positivo es el de $x$. Aquí los focos están más lejos: $c^2 = a^2 + b^2$, y las asíntotas tienen pendiente $\\pm b/a$.', { title: '$\\dfrac{(x - h)^2}{a^2} - \\dfrac{(y - k)^2}{b^2} = 1$', steps: ['$\\tfrac{x^2}{4} - \\tfrac{y^2}{5} = 1:\\; c = 3$, asíntotas $y = \\pm\\tfrac{\\sqrt5}{2}x$'] }),
            sc(6, 'La **excentricidad** ($c$ entre el semieje que va hacia los focos) mide qué tan alargada es: $0 < e < 1$ en la elipse, $e > 1$ en la hipérbola.', { title: '$e = \\dfrac{c}{\\text{semieje de los focos}}$' }),
          ] },
          ex: [
            play('conica-viva', 'Ajusta el centro y los semiejes $a$ (horizontal) y $b$ (vertical) de la elipse', {
              rounds: [
                { type: 'eli', eq: '(x − 1)²/25 + (y + 2)²/9 = 1', ans: { h: 1, k: -2, a: 5, b: 3 } },
                { type: 'eli', eq: 'Focos (0, −3) y (0, 5); eje menor de largo 6', ans: { h: 0, k: 1, a: 3, b: 5 } },
                { type: 'eli', eq: '4x² + y² − 16x = 0', ans: { h: 2, k: 0, a: 2, b: 4 } },
              ],
            }, 'Primera: centro $(1, -2)$, $a = 5$, $b = 3$. Segunda: centro en el punto medio de los focos, $(0, 1)$, $c = 4$, semieje menor 3 (horizontal) y mayor $\\sqrt{9 + 16} = 5$ (vertical). Tercera: $4(x - 2)^2 + y^2 = 16$, o sea $\\tfrac{(x - 2)^2}{4} + \\tfrac{y^2}{16} = 1$.',
            { hint: 'El centro está en la mitad de los focos. Mayor² = menor² + c². Si la ecuación no está igualada a 1, completa el cuadrado y divide.' }),
            play('conica-viva', 'Ahora hipérbolas: centro, semiejes $a$ (horizontal) y $b$ (vertical) y hacia dónde abre', {
              rounds: [
                { type: 'hip', eq: 'x²/9 − y²/16 = 1', ans: { h: 0, k: 0, a: 3, b: 4, dir: 'x' } },
                { type: 'hip', eq: 'Vértices (−2, 0) y (−2, 4); asíntotas de pendiente ±⅔', ans: { h: -2, k: 2, a: 3, b: 2, dir: 'y' } },
              ],
            }, 'Primera: abre en $x$ con $a = 3$, $b = 4$ (focos en $\\pm5$). Segunda: centro $(-2, 2)$, abre en $y$ con semieje vertical 2; la pendiente $\\tfrac{2}{a} = \\tfrac23$ da $a = 3$.',
            { hint: 'Abre hacia el eje del término positivo. Las asíntotas tienen pendiente semieje vertical sobre semieje horizontal.' }),
            num('Los focos de $\\dfrac{x^2}{169} + \\dfrac{y^2}{144} = 1$, ¿a qué distancia del centro están?', 5,
              '$c = \\sqrt{169 - 144} = 5$.',
              { hint: 'En la elipse c² es la diferencia de los cuadrados de los semiejes.' }),
            num('Excentricidad de la hipérbola $\\dfrac{x^2}{16} - \\dfrac{y^2}{9} = 1$', 1.25,
              '$c = \\sqrt{16 + 9} = 5$ y $e = \\tfrac54 = 1.25$.',
              { tol: 0.001, hint: 'Primero c con c² = a² + b²; la excentricidad es c dividido entre el semieje de los focos.' }),
            num('Un arco semielíptico mide 10 m de ancho y 3 m de alto. ¿Qué altura tiene a 4 m del centro (m)?', 1.8,
              '$\\tfrac{16}{25} + \\tfrac{y^2}{9} = 1 \\Rightarrow y^2 = 9 \\cdot \\tfrac{9}{25} \\Rightarrow y = 1.8$ m.',
              { tol: 0.01, hint: 'Usa x²/25 + y²/9 = 1 y reemplaza x = 4.' }),
          ],
        },
      ],
    },
  ],
};
