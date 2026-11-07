// Curso de Cálculo Diferencial — sigue el cronograma 2026-2 de Cálculo diferencial (UdeA).
// Las unidades 1 y 2 (clases 1 a 9) vienen del antiguo curso de Álgebra y conservan sus ids alg-*
// para no perder el progreso guardado. Spec: docs/superpowers/specs/2026-11-07-cronograma-algebra-calculo-design.md

const COURSE_CALC = {
  id: 'calc', level: 'Semestre 1', name: 'Cálculo Diferencial', icon: 'dx', color: '#f472b6',
  tagline: 'La matemática del cambio: qué tan rápido crece, cae o se mueve algo.',
  units: [
    {
      title: 'Desigualdades, valor absoluto y la recta',
      lessons: [
        {
          id: 'alg-32', title: 'Intervalos e inecuaciones',
          // Libro UdeA §3.1–3.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Un **intervalo** es un trozo de la recta. Los paréntesis excluyen el extremo y los corchetes lo incluyen.', { steps: ['$(a, b) = \\{x : a < x < b\\}$', '$[a, b] = \\{x : a \\le x \\le b\\}$', '$(-\\infty, a] = \\{x : x \\le a\\}$'] }),
            sc(6, 'Una **inecuación** se resuelve como una ecuación, pero si multiplicas o divides por un negativo, **cambias el sentido**.', { steps: ['$5 - 2x \\ge 3x + 7 \\Rightarrow -5x \\ge 2 \\Rightarrow x \\le -\\tfrac25$', 'Solución: $(-\\infty, -\\tfrac25]$'] }),
            sc(7, 'Con productos o cocientes se estudian los **signos** por tramos: los puntos críticos son donde cada factor vale cero (o el denominador se anula).', { steps: ['$(x - 1)(x + 2) \\le 0$: críticos $-2$ y $1$', 'Signos: $+\\;|\\;-\\;|\\;+$ \\Rightarrow solución $[-2, 1]$'] }),
            sc(6, 'Con **valor absoluto**: $|x| < b$ es $-b < x < b$, y $|x| > b$ es $x < -b$ o $x > b$.', { steps: ['$|x - 4| \\le 3 \\Rightarrow 1 \\le x \\le 7$', '$|2x + 3| > 9 \\Rightarrow x < -6$ o $x > 3$'] }),
          ] },
          ex: [
            mc('Resuelve la inecuación $5 - 2x \\ge 3x + 7$', ['$x \\le -\\tfrac25$', '$x \\ge 5$', '$x > -2$', '$x < 1$'], 0, '$5 - 7 \\ge 3x + 2x$, es decir $-2 \\ge 5x$: al dividir entre 5 (positivo) no cambia el sentido: $x \\le -\\tfrac25$.'),
            mc('¿Cuál es la solución de $(x - 1)(x + 2) \\le 0$?', ['$-2 \\le x \\le 1$', '$x \\ge 1$', '$x \\le -2$', '$x > 1$'], 0, 'Los críticos son $-2$ y $1$. Entre ellos un factor es negativo y el otro positivo: el producto es $\\le 0$ justo en $[-2, 1]$.'),
            mc('Halla el conjunto solución de $\\dfrac{(x - 1)(2 - x)}{x + 1} < 0$', ['$x \\in (-1, 1) \\cup (2, +\\infty)$', '$x \\in (-1, 0) \\cup (1, \\infty)$', '$x \\in (-1, 1) \\cup (2, 3)$', '$x \\in (-\\infty, -1) \\cup (1, 2)$'], 0, 'Críticos: $-1$ (denominador), $1$ y $2$. Probando un valor en cada tramo, el cociente es negativo en $(-1, 1)$ y en $(2, \\infty)$; el $-1$ nunca entra.'),
            mc('Hallar el conjunto solución de $|x + 3| \\le 2$', ['$x \\in [-5, -1]$', '$x \\in (-5, -1]$', '$x \\in [-5, -1)$', '$x \\in [1, 5]$'], 0, '$|x + 3| \\le 2$ equivale a $-2 \\le x + 3 \\le 2$; restando 3: $-5 \\le x \\le -1$, con extremos incluidos.'),
            mc('Halle el conjunto solución de $\\left|3 + \\dfrac{5}{x}\\right| < 5$', ['$x \\in (-\\infty, -5/8) \\cup (5/2, +\\infty)$', '$x \\in (-\\infty, -5/8] \\cup (5/2, +\\infty)$', '$x \\in (-5/8, 5/2)$', '$x \\in (-\\infty, 5/8) \\cup (5/2, +\\infty)$'], 0, '$-5 < 3 + \\tfrac5x < 5$ da $-8 < \\tfrac5x < 2$. Si $x > 0$: $\\tfrac5x < 2 \\Rightarrow x > \\tfrac52$. Si $x < 0$: $\\tfrac5x > -8 \\Rightarrow 5 < -8x \\Rightarrow x < -\\tfrac58$. Como la desigualdad es estricta, los extremos no entran.'),
            play('clasifica-cartas', 'Desliza cada conjunto: ¿se escribe con **paréntesis** (abierto) o con **corchete** (cerrado) en ese extremo?', {
              left: 'Abierto', right: 'Cerrado',
              cards: [
                { text: 'x > 3, en el extremo 3', side: 'left', why: 'El 3 no cumple 3 > 3: (3, ∞).' },
                { text: 'x ≤ −1, en el extremo −1', side: 'right', why: 'El −1 cumple −1 ≤ −1: (−∞, −1].' },
                { text: 'Solución de |x| < 2, en el extremo 2', side: 'left', why: '|2| = 2 no es menor que 2: (−2, 2).' },
                { text: 'Solución de (x − 1)(x + 2) ≤ 0, en el extremo 1', side: 'right', why: 'En x = 1 el producto vale 0 y 0 ≤ 0: [−2, 1].' },
                { text: 'Solución de 1/(x − 4) > 0, en el extremo 4', side: 'left', why: 'En x = 4 la expresión no existe: (4, ∞).' },
              ],
            }, 'El extremo entra (corchete) cuando cumple la desigualdad; queda fuera (paréntesis) cuando la desigualdad es estricta o la expresión no existe allí (denominador cero). El infinito siempre va con paréntesis.'),
          ],
        },
        {
          id: 'alg-26c', title: 'Valor absoluto y desigualdades',
          clip: { scenes: [
            sc(5, '$|x|$ es la distancia de $x$ al cero. Por eso $|x| < 3$ son los puntos a menos de 3 del origen.', { title: '$|x| < 3 \\iff -3 < x < 3$', viz: { type: 'numberline', range: [-5, 5], sets: [[-3, 3, false, false]], label: '(−3, 3)' } }),
            sc(5, 'Y $|x| > 3$ son los que están más lejos: dos semirrectas.', { title: '$|X| > a \\iff X < -a \\;\\text{ o }\\; X > a$', viz: { type: 'numberline', range: [-5, 5], sets: [[-Infinity, -3, false, false], [3, Infinity, false, false]], label: '(−∞, −3) ∪ (3, ∞)' } }),
            sc(5, 'Si multiplicas o divides una desigualdad por un **negativo**, el sentido se invierte.', { steps: ['$-2x < 6$', '$x > -3$'] }),
            sc(6, 'Para desigualdades cuadráticas, factoriza y estudia los signos:', { title: '$x^2 - x - 6 < 0$', steps: ['$(x - 3)(x + 2) < 0$', 'negativo entre las raíces'], viz: { type: 'numberline', range: [-5, 5], sets: [[-2, 3, false, false]], label: '(−2, 3)' } }),
          ] },
          ex: [
            mc('Resuelve $|2x - 5| = 7$', ['$x = 6$ o $x = -1$', '$x = 6$', '$x = 1$ o $x = -6$', '$x = -1$'], 0, '$2x - 5 = 7$ o $2x - 5 = -7$.'),
            mc('Solución de $x^2 - x - 6 < 0$', ['$(-2, 3)$', '$(-\\infty, -2) \\cup (3, \\infty)$', '$(-3, 2)$', '$[-2, 3]$'], 0, 'La parábola es negativa entre sus raíces $-2$ y $3$ (sin incluirlas).'),
            mc('Si $-3x \\geq 12$, entonces…', ['$x \\leq -4$', '$x \\geq -4$', '$x \\geq 4$', '$x \\leq 4$'], 0, 'Al dividir entre $-3$ se invierte el sentido.'),
            mc('Solución de $|3x + 1| \\geq 5$', ['$x \\leq -2$ o $x \\geq \\tfrac{4}{3}$', '$-2 \\leq x \\leq \\tfrac43$', '$x \\geq \\tfrac43$', '$x \\leq -2$'], 0, '$3x + 1 \\leq -5$ o $3x + 1 \\geq 5$.'),
          ],
        },
        {
          id: 'alg-51', title: 'Gráficas de ecuaciones y rectas',
          // Libro UdeA §5.1–5.2. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'El **plano cartesiano**: dos ejes perpendiculares que lo dividen en cuatro cuadrantes. Cada punto es un par ordenado $(x, y)$.', { steps: ['I: $x > 0, y > 0$ · II: $x < 0, y > 0$', 'III: $x < 0, y < 0$ · IV: $x > 0, y < 0$'] }),
            sc(6, 'La **gráfica de una ecuación** son todos los puntos $(x, y)$ que la cumplen. Se arma con una tabla de valores.', { title: '$y = x^2 - 1$', viz: { type: 'graph', xr: [-3, 3], yr: [-2, 8], f: x => x * x - 1, points: [[0, -1, '(0, −1)'], [2, 3, '(2, 3)'], [-1, 0, '(−1, 0)']] } }),
            sc(6, 'La **pendiente** mide cuánto sube la recta por cada unidad que avanza.', { title: '$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$', steps: ['Por $(1, 2)$ y $(4, 11)$: $m = \\dfrac{11 - 2}{4 - 1} = 3$'] }),
            sc(6, 'Ecuación de la recta: **pendiente-intercepto** $y = mx + b$ o **punto-pendiente** $y - y_1 = m(x - x_1)$.', { steps: ['Pendiente 2 por $(3, -1)$: $y + 1 = 2(x - 3)$', '$y = 2x - 7$'] }),
          ] },
          ex: [
            mc('El punto $(-3, 2)$ está en el cuadrante', ['II', 'I', 'III', 'IV'], 0, 'Abscisa negativa y ordenada positiva: arriba a la izquierda, cuadrante II.'),
            mc('¿Cuál punto está sobre la gráfica de $y = x^2 - 1$?', ['$(2, 3)$', '$(1, 1)$', '$(-1, -2)$', '$(0, 1)$'], 0, 'Con $x = 2$: $y = 4 - 1 = 3$. Los otros no cumplen: $1^2 - 1 = 0$, $(-1)^2 - 1 = 0$ y $0 - 1 = -1$.'),
            mc('La pendiente de la recta que pasa por $(1, 2)$ y $(4, 11)$ es', ['$3$', '$\\tfrac13$', '$-3$', '$9$'], 0, '$m = \\dfrac{11 - 2}{4 - 1} = \\dfrac{9}{3} = 3$.'),
            num('¿En qué valor corta al eje $y$ la recta $y = -2x + 7$?', 7, 'En el eje $y$ la abscisa es $0$: $y = -2(0) + 7 = 7$. En $y = mx + b$, el corte es $b$.'),
            mc('La ecuación de la recta de pendiente $2$ que pasa por $(3, -1)$ es', ['$y = 2x - 7$', '$y = 2x + 5$', '$y = -2x + 5$', '$y = 2x - 1$'], 0, 'Punto-pendiente: $y - (-1) = 2(x - 3)$, es decir $y + 1 = 2x - 6$ y $y = 2x - 7$.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Toda recta es la gráfica de una ecuación lineal ax + by = c', truth: true, why: 'Y recíprocamente: toda ecuación lineal en x, y es una recta.' },
                { text: 'Una recta vertical tiene pendiente 0', truth: false, why: 'La pendiente no está definida (división entre x₂ − x₁ = 0); la horizontal es la de pendiente 0.' },
                { text: 'Dos rectas con la misma pendiente son paralelas', truth: true, why: 'Suben al mismo ritmo: nunca se cortan (o coinciden).' },
                { text: 'El punto (0, b) está sobre la recta y = mx + b', truth: true, why: 'Con x = 0 queda y = b.' },
                { text: 'La gráfica de x = y² pasa por (4, −2)', truth: true, why: '(−2)² = 4; la parábola acostada tiene dos puntos por cada x > 0.' },
              ],
            }, 'La pendiente de una recta por $(x_1, y_1)$ y $(x_2, y_2)$ es $\\dfrac{y_2 - y_1}{x_2 - x_1}$: cero si es horizontal, indefinida si es vertical. Rectas paralelas comparten pendiente.'),
          ],
        },
      ],
    },
    {
      title: 'Funciones',
      lessons: [
        {
          id: 'alg-52', title: 'Funciones, dominio y rango',
          // Libro UdeA §5.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Una **función** asigna a cada elemento del dominio **exactamente un** valor. Se escribe $y = f(x)$: $x$ es el argumento y $f(x)$ su imagen.', { steps: ['$f(x) = 2x + 3 \\Rightarrow f(2) = 7$', 'Dominio: las entradas permitidas · Rango: las salidas que ocurren'] }),
            sc(6, 'El **dominio natural** excluye lo que no se puede calcular: denominadores cero y raíces pares de negativos.', { steps: ['$f(x) = \\dfrac{1}{x^2 - x}$: dominio $\\mathbb{R} \\setminus \\{0, 1\\}$', '$g(x) = \\sqrt{x - 2}$: dominio $[2, \\infty)$'] }),
            sc(6, 'El **rango** se lee en la gráfica como la sombra sobre el eje $y$.', { title: '$f(x) = x^2$', viz: { type: 'graph', xr: [-3, 3], yr: [0, 9], f: x => x * x }, steps: ['Rango de $x^2$: $[0, \\infty)$'] }),
            sc(5, '**Criterio de la recta vertical**: una curva es función si ninguna recta vertical la corta dos veces.', { steps: ['$y = x^2$ sí es función de $x$', '$x = y^2$ no lo es: en $x = 4$ hay $y = 2$ y $y = -2$'] }),
          ] },
          ex: [
            mc('¿Qué es una función en matemáticas?', ['Una relación que asigna un único valor de salida a cada valor de entrada', 'Una relación que asigna varios valores de salida a un valor de entrada', 'Una operación que siempre da el mismo resultado', 'Una fórmula que describe una línea recta'], 0, 'Lo esencial es la unicidad: cada entrada tiene una sola salida; no hace falta que sea una recta.'),
            mc('¿Cuál de las siguientes NO es una función?', ['$h(x) = \\pm\\sqrt{x}$', '$f(x) = x + 2$', '$g(x) = x^2 - 4$', '$k(x) = 3x - 7$'], 0, '$\\pm\\sqrt{x}$ da dos salidas para cada $x > 0$ (por ejemplo $\\pm 2$ para $x = 4$): viola la unicidad.'),
            num('Si $f(x) = 2x + 3$, ¿cuál es el valor de $f(2)$?', 7, 'Se sustituye: $f(2) = 2(2) + 3 = 7$.'),
            mc('¿Cuál es el dominio de $f(x) = \\sqrt{x - 2}$?', ['$[2, \\infty)$', '$(2, \\infty)$', '$(-\\infty, 2]$', '$(-\\infty, 2)$'], 0, 'La raíz cuadrada necesita $x - 2 \\ge 0$, es decir $x \\ge 2$; el 2 sí entra porque $\\sqrt0 = 0$.'),
            mc('El dominio de $f(x) = \\dfrac{x + 1}{x^2 - 4}$ es', ['$\\mathbb{R} \\setminus \\{-2, 2\\}$', '$\\mathbb{R} \\setminus \\{2\\}$', '$(-\\infty, 0)$', '$[2, \\infty)$'], 0, 'El denominador $x^2 - 4 = (x - 2)(x + 2)$ se anula en $2$ y en $-2$: se excluyen los dos.'),
            mc('¿Cuál es el rango de $f(x) = |x|$?', ['$[0, \\infty)$', '$(-\\infty, \\infty)$', '$(-\\infty, 0]$', '$(-1, 1)$'], 0, 'El valor absoluto nunca es negativo y toma todos los valores $\\ge 0$ (por ejemplo $|5| = 5$ y $|0| = 0$).'),
            num('Si $f(x) = x^3$, ¿cuál es el valor de $f(-2)$?', -8, '$(-2)^3 = (-2)(-2)(-2) = -8$: el cubo conserva el signo.'),
          ],
        },
        {
          id: 'alg-61', title: 'Transformaciones y tipos de funciones',
          // Libro UdeA §6.1–6.2. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, '**Traslaciones**: $f(x) + k$ sube la gráfica $k$ unidades; $f(x - h)$ la corre $h$ a la derecha.', { steps: ['$y = x^2 + 2$: la parábola, 2 arriba', '$y = (x - 3)^2$: la parábola, 3 a la derecha'] }),
            sc(5, '**Alargamientos**: $a \\cdot f(x)$ estira verticalmente si $a > 1$ y encoge si $0 < a < 1$; $f(cx)$ encoge horizontalmente si $c > 1$.', { steps: ['$y = 3x^2$ es más «flaca» que $y = x^2$'] }),
            sc(6, 'Función **par**: $f(-x) = f(x)$, simétrica respecto al eje $y$. **Impar**: $f(-x) = -f(x)$, simétrica respecto al origen.', { steps: ['$x^2$, $|x|$, $x^4 + 1$ son pares', '$x$, $x^3$, $\\tfrac1x$ son impares'] }),
            sc(6, 'Una función **por tramos** usa una fórmula distinta en cada intervalo: hay que mirar en cuál cae el $x$.', { steps: ['$f(x) = x + 2$ si $x < 0$; $3x - 1$ si $x \\ge 0$', '$f(-3) = -1 \\qquad f(0) = -1 \\qquad f(2) = 5$'] }),
            sc(6, '**Inyectiva** (uno a uno): entradas distintas dan salidas distintas. **Sobreyectiva** (sobre): todo el codominio se alcanza. **Biyectiva**: las dos cosas.', { steps: ['$f(x) = 2x + 1$ es biyectiva en $\\mathbb{R}$', '$f(x) = x^2$ no es inyectiva: $f(2) = f(-2)$'] }),
          ] },
          ex: [
            mc('La gráfica de $y = f(x) + 2$ es la de $y = f(x)$', ['trasladada 2 unidades hacia arriba', 'trasladada 2 unidades a la derecha', 'alargada verticalmente al doble', 'reflejada respecto al eje $x$'], 0, 'Sumar una constante por fuera de $f$ mueve cada punto verticalmente: $(x, f(x)) \\to (x, f(x) + 2)$.'),
            mc('La gráfica de $y = f(x - 3)$ es la de $y = f(x)$', ['trasladada 3 unidades a la derecha', 'trasladada 3 unidades a la izquierda', 'trasladada 3 unidades hacia abajo', 'encogida horizontalmente'], 0, 'Para obtener el mismo valor que $f$ daba en $x$ ahora hay que entrar con $x + 3$: la gráfica se corre a la derecha.'),
            mc('Si $f(x) = x + 2$ para $x < 0$ y $f(x) = 3x - 1$ para $x \\ge 0$, ¿cuánto vale $f(-3)$?', ['$-1$', '$0$', '$-10$', '$5$'], 0, 'Como $-3 < 0$ se usa el primer tramo: $f(-3) = -3 + 2 = -1$.'),
            mc('Si $f(x) = 2x - 1$ para $x < 0$, $f(0) = 0$ y $f(x) = x + 2$ para $x > 0$, ¿cuánto vale $f(0)$?', ['$0$', '$1$', '$2$', '$-1$'], 0, 'El tramo del medio dice explícitamente que $f(0) = 0$; los otros tramos no incluyen al cero.'),
            mc('¿Cuál de las siguientes funciones es inyectiva?', ['$f(x) = 2x + 3$', '$f(x) = x^2$', '$f(x) = 1 - x^2$', '$f(x) = |x|$'], 0, 'Las otras tres repiten valores ($f(1) = f(-1)$). En $2x + 3$, si $2x_1 + 3 = 2x_2 + 3$ entonces $x_1 = x_2$.'),
            mc('Si una función $f$ es biyectiva, entonces', ['es inyectiva y sobreyectiva a la vez', 'es inyectiva pero no sobreyectiva', 'tiene más de una preimagen para cada valor', 'no tiene inversa'], 0, 'Biyectiva = uno a uno y sobre. Justamente por eso tiene función inversa.'),
            play('clasifica-cartas', 'Desliza cada función: ¿es **par** o **impar**?', {
              left: 'Par', right: 'Impar',
              cards: [
                { text: 'f(x) = x²', side: 'left', why: '(−x)² = x²: simétrica respecto al eje y.' },
                { text: 'f(x) = x³', side: 'right', why: '(−x)³ = −x³: simétrica respecto al origen.' },
                { text: 'f(x) = |x|', side: 'left', why: '|−x| = |x|.' },
                { text: 'f(x) = 1/x', side: 'right', why: '1/(−x) = −1/x.' },
                { text: 'f(x) = x⁴ + 1', side: 'left', why: '(−x)⁴ + 1 = x⁴ + 1.' },
                { text: 'f(x) = 5x', side: 'right', why: '5(−x) = −5x.' },
              ],
            }, 'Par: $f(-x) = f(x)$ (potencias pares, $|x|$). Impar: $f(-x) = -f(x)$ (potencias impares, $\\tfrac1x$). Sumar una constante a una función impar la vuelve ni par ni impar.'),
          ],
        },
        {
          id: 'alg-53', title: 'Operaciones y composición de funciones',
          // Libro UdeA §5.4–5.5. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Dos funciones se **suman, restan, multiplican y dividen** punto a punto. El dominio es la intersección de los dominios (y $g(x) \\ne 0$ en el cociente).', { steps: ['$(f + g)(x) = f(x) + g(x) \\qquad (fg)(x) = f(x)\\,g(x)$', '$\\left(\\tfrac{f}{g}\\right)(x) = \\dfrac{f(x)}{g(x)},\\ g(x) \\ne 0$'] }),
            sc(6, 'La **composición** $g \\circ f$ aplica primero $f$ y luego $g$: $(g \\circ f)(x) = g(f(x))$.', { steps: ['$f(x) = \\dfrac{x - 3}{2},\\ g(x) = \\sqrt{x}$', '$g(f(x)) = \\sqrt{\\tfrac{x - 3}{2}} \\qquad f(g(x)) = \\dfrac{\\sqrt{x} - 3}{2}$'] }),
            sc(5, 'En general $f \\circ g \\ne g \\circ f$: el orden importa. Para «desarmar» una función compuesta, busca la operación de afuera y la de adentro.', { steps: ['$h(x) = \\sqrt{x^2 + 1} = (f \\circ g)(x)$ con $f(x) = \\sqrt{x}$ y $g(x) = x^2 + 1$'] }),
          ] },
          ex: [
            mc('Dados $f(x) = 2x + 3$ y $g(x) = x^2$, ¿cuál es $(f + g)(x)$?', ['$x^2 + 2x + 3$', '$x^2 + 3x$', '$2x^2 + 3x + 3$', '$2x^2 + 3x + 2$'], 0, 'Se suman las expresiones: $2x + 3 + x^2 = x^2 + 2x + 3$.'),
            mc('Si $f(x) = x^2 - 1$ y $g(x) = 2x + 3$, ¿cuál es $(f - g)(x)$?', ['$x^2 - 2x - 4$', '$x^2 + 2x + 4$', '$x^2 + 2x - 4$', '$2x^2 + 3x + 1$'], 0, '$x^2 - 1 - (2x + 3) = x^2 - 2x - 4$: el signo menos cambia los dos términos de $g$.'),
            mc('Si $f(x) = 5x$ y $g(x) = x^2 - 4$, ¿cuál es $(fg)(x)$?', ['$5x^3 - 20x$', '$5x^2 - 4x$', '$5x^2 + 4x$', '$5x^2 - x + 4$'], 0, '$5x(x^2 - 4) = 5x^3 - 20x$.'),
            mc('Si $f(x) = 2x + 1$ y $g(x) = x^2$, ¿cuál es $f(g(x))$?', ['$2x^2 + 1$', '$2x + 1$', '$4x + 1$', '$2x^2 + x$'], 0, 'Se mete $g$ dentro de $f$: $f(x^2) = 2(x^2) + 1 = 2x^2 + 1$.'),
            mc('Si $f(x) = 2x - 3$ y $g(x) = \\dfrac1x$, ¿cuál es $g(f(x))$?', ['$\\dfrac{1}{2x - 3}$', '$\\dfrac{2}{x} - 3$', '$\\dfrac{2}{x - 3}$', '$2 - \\dfrac1x$'], 0, '$g(f(x)) = \\dfrac{1}{f(x)} = \\dfrac{1}{2x - 3}$. (La otra opción, $\\tfrac2x - 3$, sería $f(g(x))$.)'),
            mc('Dados $f(x) = x + 3$ y $g(x) = x^2 + 1$, ¿cuál es $\\left(\\dfrac{f}{g}\\right)(x)$?', ['$\\dfrac{x + 3}{x^2 + 1}$', '$\\dfrac{x + 3}{x + 1}$', '$x^2 + 1$', '$\\dfrac{x}{x^2 + 1}$'], 0, 'Es el cociente de las expresiones; como $x^2 + 1$ nunca es cero, el dominio es todo $\\mathbb{R}$.'),
            mc('Las funciones $f$ y $g$ tales que $(f \\circ g)(x) = |4x^3 + 7|$ son', ['$f(x) = |x|,\\ g(x) = 4x^3 + 7$', '$f(x) = x^3 + 7,\\ g(x) = |4x|$', '$f(x) = 4x^3 + 7,\\ g(x) = |x|$', '$f(x) = |4x|,\\ g(x) = x^3 + 7$'], 0, 'La operación de afuera es el valor absoluto ($f$) y lo de adentro, $4x^3 + 7$ ($g$): $f(g(x)) = |4x^3 + 7|$.'),
          ],
        },
        {
          id: 'alg-62', title: 'Función inversa',
          // Libro UdeA §6.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Si $f$ es biyectiva, su **inversa** $f^{-1}$ deshace lo que $f$ hace: $f^{-1}(y) = x$ si y solo si $y = f(x)$.', { steps: ['$f^{-1}(f(x)) = x \\qquad f(f^{-1}(y)) = y$'] }),
            sc(6, 'Para hallarla: escribe $y = f(x)$, **despeja** $x$ y luego intercambia los nombres.', { steps: ['$y = 2x + 3 \\Rightarrow x = \\dfrac{y - 3}{2}$', '$f^{-1}(x) = \\dfrac{x - 3}{2}$'] }),
            sc(6, 'Las gráficas de $f$ y $f^{-1}$ son **simétricas respecto a la recta $y = x$**: el punto $(a, b)$ de una es el $(b, a)$ de la otra.', { title: '$f(x) = x^3$ y $f^{-1}(x) = \\sqrt[3]{x}$', viz: { type: 'graph', xr: [-2, 2], yr: [-2, 2], f: x => x * x * x, points: [[1, 1, '(1, 1)'], [-1, -1, '(−1, −1)']] } }),
            sc(5, 'Si $f$ no es inyectiva se **restringe** el dominio: $f(x) = x^2$ con $x \\ge 0$ tiene inversa $\\sqrt{x}$.', { steps: ['Sin restringir, $\\pm\\sqrt{y}$ no sería función'] }),
          ] },
          ex: [
            mc('Si $f(x) = 2x + 3$, ¿cuál es la inversa $f^{-1}(x)$?', ['$f^{-1}(x) = \\dfrac{x - 3}{2}$', '$f^{-1}(x) = \\dfrac{x + 3}{2}$', '$f^{-1}(x) = 2x - 3$', '$f^{-1}(x) = \\dfrac{x + 2}{3}$'], 0, 'De $y = 2x + 3$: $x = \\dfrac{y - 3}{2}$. Comprueba: $f^{-1}(f(1)) = f^{-1}(5) = 1$.'),
            mc('¿Cuál de las siguientes funciones tiene inversa (en todo $\\mathbb{R}$)?', ['$f(x) = 2x + 1$', '$f(x) = x^2$', '$f(x) = 2 - x^2$', '$f(x) = |x|$'], 0, 'Solo la recta es inyectiva; las otras tres toman el mismo valor en $x$ y en $-x$.'),
            mc('¿Qué relación hay entre las gráficas de $f(x)$ y de $f^{-1}(x)$?', ['Son simétricas respecto a la recta $y = x$', 'Son paralelas', 'Son perpendiculares', 'Son simétricas respecto al eje $y$'], 0, 'Intercambiar $x$ con $y$ refleja cada punto $(a, b)$ en $(b, a)$: eso es reflejar sobre la diagonal $y = x$.'),
            mc('La inversa de $f(x) = x^3$ es', ['$f^{-1}(x) = \\sqrt[3]{x}$', '$f^{-1}(x) = \\dfrac{1}{x^3}$', '$f^{-1}(x) = 3x$', '$f^{-1}(x) = x^{-3}$'], 0, 'Despejando $x$ de $y = x^3$: $x = \\sqrt[3]{y}$. La raíz cúbica está definida para todo real.'),
            num('Si $f(x) = 5x - 10$, ¿cuánto vale $f^{-1}(20)$?', 6, 'Se busca el $x$ con $f(x) = 20$: $5x - 10 = 20$, $x = 6$. Equivale a $f^{-1}(x) = \\dfrac{x + 10}{5}$ en $x = 20$.'),
            mc('Si $f(x) = x^2$ con $x \\ge 0$, entonces $f^{-1}(x)$ es', ['$\\sqrt{x}$', '$\\pm\\sqrt{x}$', '$x^{-2}$', '$-\\sqrt{x}$'], 0, 'Con el dominio restringido a $x \\ge 0$ la función es biyectiva sobre $[0, \\infty)$ y la inversa es la raíz principal $\\sqrt{x}$.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Toda función tiene inversa', truth: false, why: 'Solo las biyectivas; x² en R no la tiene.' },
                { text: 'f⁻¹(f(x)) = x para todo x del dominio de f', truth: true, why: 'La inversa deshace lo que hace f.' },
                { text: 'La inversa de una recta de pendiente m ≠ 0 es una recta de pendiente 1/m', truth: true, why: 'De y = mx + b sale x = (y − b)/m.' },
                { text: '(a, b) está en f si y solo si (b, a) está en f⁻¹', truth: true, why: 'Es la definición: se intercambian entrada y salida.' },
                { text: 'f(x) = x² es inyectiva en todo R', truth: false, why: 'f(2) = f(−2) = 4.' },
              ],
            }, 'Una función tiene inversa solo si es biyectiva; entonces $f^{-1}(f(x)) = x$, los pares $(a, b)$ se voltean y las gráficas se reflejan en $y = x$.'),
          ],
        },
      ],
    },
    {
      title: 'Límites y continuidad',
      lessons: [
        {
          id: 'calc-1', title: '¿Qué es un límite?',
          clip: { scenes: [
            sc(5, '¿Cuánto vale $f(x) = \\dfrac{x^2 - 1}{x - 1}$ en $x = 1$? ¡División entre cero!', { viz: { type: 'graph', xr: [-1, 3], yr: [-1, 4], f: x => (x * x - 1) / (x - 1), holes: [[1, 2]], draw: true } }),
            sc(6, 'Pero podemos acercarnos tanto como queramos, por la izquierda y por la derecha.', { viz: { type: 'approach', f: x => (x * x - 1) / (x - 1), x0: 1, L: 2, xr: [-1, 3], yr: [-1, 4] } }),
            sc(5, 'Factoriza y simplifica:', { title: '$\\lim_{x \\to 1} \\dfrac{x^2 - 1}{x - 1} = 2$', steps: ['$\\dfrac{x^2 - 1}{x - 1} = \\dfrac{(x - 1)(x + 1)}{x - 1}$', '$= x + 1 \\;\\to\\; 2$'] }),
          ] },
          ex: [
            num('$\\lim_{x \\to 2} (3x + 1) = \\;?$', 7, 'Es continua: sustituye, $3(2) + 1 = 7$.'),
            num('$\\lim_{x \\to 1} \\dfrac{x^2 - 1}{x - 1} = \\;?$', 2, 'Simplifica a $x + 1$ y evalúa en $x = 1$.'),
            mc('$\\lim_{x \\to \\infty} \\dfrac{1}{x} = \\;?$', ['$0$', '$1$', '$\\infty$', 'No existe'], 0, 'Al crecer $x$, $1/x$ se hace tan pequeño como quieras.'),
            mc('El límite describe…', ['A qué valor se acerca $f(x)$ cuando $x$ se acerca a un punto', 'El valor de $f$ exactamente en ese punto', 'La pendiente de una recta', 'El área bajo la curva'], 0, 'El límite no necesita que $f$ esté definida en el punto.'),
          ],
        },
        {
          id: 'calc-2', title: 'Límites al infinito',
          clip: { scenes: [
            sc(5, '¿Qué pasa con $f(x) = \\dfrac{2x + 1}{x}$ cuando $x$ crece sin parar?', { viz: { type: 'graph', xr: [0, 20], yr: [0, 6], fs: [{ f: x => (2 * x + 1) / x }, { f: () => 2, color: 'rgba(255,255,255,.4)', dash: true }], draw: true } }),
            sc(5, 'Divide entre la mayor potencia de $x$:', { steps: ['$\\dfrac{2x + 1}{x} = 2 + \\dfrac{1}{x}$', '$\\dfrac{1}{x} \\to 0$', '$\\Rightarrow \\lim = 2$'] }),
            sc(5, 'La recta $y = 2$ es una **asíntota horizontal**.', { title: '$y = 2$', viz: { type: 'graph', xr: [0, 20], yr: [0, 6], fs: [{ f: x => (2 * x + 1) / x }, { f: () => 2, color: '#facc15', dash: true }] } }),
          ] },
          ex: [
            num('$\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{x^2} = \\;?$', 3, '$3 + \\tfrac{1}{x^2} \\to 3$.'),
            mc('$\\lim_{x \\to \\infty} \\dfrac{5x}{x^2 + 1} = \\;?$', ['$0$', '$5$', '$\\infty$', '$1$'], 0, 'El denominador crece más rápido (grado 2 > grado 1).'),
            mc('Una asíntota horizontal $y = L$ significa que…', ['$f(x) \\to L$ cuando $x \\to \\pm\\infty$', '$f(L)$ no existe', '$f$ corta a $y = L$ exactamente una vez', '$f$ es constante'], 0, 'Describe el comportamiento de $f$ lejos del origen.'),
          ],
        },
      ],
    },
    {
      title: 'La derivada',
      lessons: [
        {
          id: 'calc-3', title: 'La derivada como pendiente',
          clip: { scenes: [
            sc(5, '¿Cuál es la pendiente de una curva en un punto? Empezamos con una **secante**.', { viz: { type: 'tangent', f: sq, x0: 1, xr: [-1, 3], yr: [-1, 6], h0: 1.5, h1: 1.5 } }),
            sc(6, 'Acerca el segundo punto: la secante se convierte en **tangente**.', { viz: { type: 'tangent', f: sq, x0: 1, xr: [-1, 3], yr: [-1, 6], h0: 1.5 } }),
            sc(6, 'Esa pendiente límite es la derivada. Para $x^2$:', { title: "$f'(x) = \\lim_{h \\to 0} \\dfrac{f(x + h) - f(x)}{h}$", steps: ['$\\dfrac{(x + h)^2 - x^2}{h} = \\dfrac{2xh + h^2}{h}$', '$= 2x + h \\;\\to\\; 2x$'] }),
          ] },
          ex: [
            sld('Mueve el punto hasta donde la tangente a $y = x^2$ tenga pendiente $4$', {
              viz: { type: 'tangent', f: sq, xr: [-3, 3], yr: [-2, 9] }, min: -2.5, max: 2.5, step: 0.5, init: -1,
              readout: v => `$x_0 = ${v}$`, check: v => near(v, 2), answerText: '$x_0 = 2$', explain: "$f'(x) = 2x = 4 \\Rightarrow x = 2$.",
            }),
            num('Pendiente de la tangente a $y = x^2$ en $x = 3$', 6, "$f'(x) = 2x$, así que $f'(3) = 6$."),
            mc("La derivada $f'(a)$ representa…", ['La pendiente de la tangente en $x = a$', 'El área bajo $f$', 'El valor de $f$ en $a$', 'La pendiente de la secante entre 0 y $a$'], 0, 'Es la razón de cambio instantánea en $x = a$.'),
          ],
        },
        {
          id: 'calc-4', title: 'Reglas de derivación',
          clip: { scenes: [
            sc(5, 'No necesitas el límite cada vez. **Regla de la potencia**:', { title: '$\\dfrac{d}{dx} x^n = n\\,x^{n-1}$', steps: ['$\\dfrac{d}{dx} x^3 = 3x^2$', '$\\dfrac{d}{dx} x^5 = 5x^4$'] }),
            sc(5, 'Las constantes salen y las sumas se derivan término a término.', { steps: ['$\\dfrac{d}{dx}(3x^2 + 2x) = 6x + 2$'] }),
            sc(4, 'Seno y coseno:', { steps: ["$(\\sin x)' = \\cos x$", "$(\\cos x)' = -\\sin x$"] }),
            sc(6, '**Regla de la cadena**: deriva por fuera y multiplica por la derivada de adentro.', { steps: ['$\\dfrac{d}{dx}(2x + 1)^3$', '$= 3(2x + 1)^2 \\cdot 2$', '$= 6(2x + 1)^2$'] }),
          ] },
          ex: [
            mc('$\\dfrac{d}{dx} x^5$', ['$5x^4$', '$x^4$', '$5x^5$', '$4x^5$'], 0, 'Regla de la potencia: baja el exponente y réstale 1.'),
            num("Si $f(x) = 3x^2 + 2x$, ¿cuánto vale $f'(1)$?", 8, "$f'(x) = 6x + 2 \\Rightarrow f'(1) = 8$."),
            mc('$\\dfrac{d}{dx} \\sin x$', ['$\\cos x$', '$-\\cos x$', '$-\\sin x$', '$\\tan x$'], 0, 'La derivada del seno es el coseno.'),
            mc('$\\dfrac{d}{dx}(2x + 1)^3$', ['$6(2x + 1)^2$', '$3(2x + 1)^2$', '$(2x + 1)^2$', '$6(2x + 1)^3$'], 0, 'Regla de la cadena: $3(2x + 1)^2 \\cdot 2$.'),
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de la derivada',
      lessons: [
        {
          id: 'calc-5', title: 'Máximos y mínimos',
          clip: { scenes: [
            sc(6, 'En la cima de una montaña, la tangente es **horizontal**.', { viz: { type: 'tangent', f: x => -x * x + 4 * x, x0anim: [0.2, 3.8], xr: [-1, 5], yr: [-2, 6] } }),
            sc(5, 'Busca dónde la derivada vale cero:', { steps: ['$f(x) = -x^2 + 4x$', "$f'(x) = -2x + 4 = 0$", '$x = 2$'] }),
            sc(5, 'Así se optimiza en ingeniería: máxima área, mínimo costo, máxima eficiencia.', { viz: { type: 'graph', f: x => -x * x + 4 * x, xr: [-1, 5], yr: [-2, 6], points: [[2, 4, 'máx (2, 4)']] } }),
          ] },
          ex: [
            sld('Mueve el punto hasta donde la tangente sea horizontal (el máximo de $f(x) = -x^2 + 4x$)', {
              viz: { type: 'tangent', f: x => -x * x + 4 * x, xr: [-1, 5], yr: [-2, 6] }, min: -0.5, max: 4.5, step: 0.5, init: 0.5,
              readout: v => `$x_0 = ${v}$`, check: v => near(v, 2), answerText: '$x = 2$', explain: "$f'(x) = -2x + 4 = 0 \\Rightarrow x = 2$.",
            }),
            num('¿En qué $x$ tiene su mínimo $f(x) = x^2 - 6x + 1$?', 3, "$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$.", { prefix: '$x =$' }),
            mc("Si $f'(a) = 0$ y $f''(a) < 0$, en $x = a$ hay…", ['Un máximo', 'Un mínimo', 'Siempre un punto de inflexión', 'Una discontinuidad'], 0, 'Concavidad hacia abajo con tangente horizontal → máximo.'),
          ],
        },
      ],
    },
  ],
};
