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
          id: 'alg-32', title: 'Orden, intervalos e inecuaciones',
          // Cronograma de Cálculo 2026-2, clase 1 (Del Valle, módulo 1). Video: video/clase_calc_c1 (Cálculo · Clase C1).
          // Spec: docs/superpowers/specs/2026-11-07-calculo-unidad-1-design.md
          clip: { scenes: [
            sc(6, 'Los reales están **ordenados**: entre dos números distintos siempre uno es mayor (tricotomía). Sumar lo mismo a los dos lados **conserva** la desigualdad; multiplicar por un **negativo la voltea**.', { steps: ['$2 < 5 \\Rightarrow 2 + 3 < 5 + 3$', '$2 < 5 \\Rightarrow -2 > -5$'] }),
            sc(6, 'Un **intervalo** es un trozo de la recta: el paréntesis deja fuera el extremo y el corchete lo incluye. El infinito siempre va con paréntesis.', { steps: ['$(a, b] = \\{x : a < x \\le b\\}$', '$[a, \\infty) = \\{x : x \\ge a\\}$'] }),
            sc(6, 'Una **inecuación lineal** se despeja como una ecuación, volteando el signo si se multiplica o divide por un negativo.', { steps: ['$3 - 2x \\le x + 9 \\Rightarrow -3x \\le 6$', '$x \\ge -2$: el intervalo $[-2, \\infty)$'] }),
            sc(7, 'Con **productos o cocientes**: los ceros de cada factor parten la recta en tramos; en cada tramo el signo no cambia. Se arma una **tabla de signos**.', { steps: ['$(x - 2)(x + 1) \\ge 0$: tramos $+\\;|\\;-\\;|\\;+$', 'Solución $(-\\infty, -1] \\cup [2, \\infty)$'] }),
            sc(6, 'En un **cociente**, el cero del denominador nunca entra en la solución: ahí la expresión no existe.', { steps: ['$\\dfrac{x + 3}{x - 1} < 0 \\Rightarrow (-3, 1)$'] }),
          ] },
          ex: [
            play('sombra-equivalente', 'Despeja $x$ con las fichas. Vigila las **dos sombras**: tienen que coincidir', {
              rounds: [
                { start: { a: -3, b: 4, rel: '<', c: 2, d: -6 }, chips: [{ op: '+', k: -2, x: true }, { op: '+', k: -4 }, { op: '/', k: -5 }, { op: '+', k: 3, x: true }, { op: '/', k: 5 }] },
                { start: { a: 2, b: 7, rel: '>=', c: 5, d: -2 }, chips: [{ op: '+', k: -5, x: true }, { op: '+', k: -7 }, { op: '/', k: -3 }, { op: '+', k: -2, x: true }, { op: '+', k: 2 }] },
                { start: { a: -1, b: 6, rel: '<=', c: 3, d: -10 }, chips: [{ op: '+', k: -3, x: true }, { op: '+', k: -6 }, { op: '/', k: -4 }, { op: '+', k: 1, x: true }, { op: '*', k: -1 }] },
              ],
            }, '$4 - 3x < 2x - 6 \\Rightarrow -5x < -10 \\Rightarrow x > 2$. $2x + 7 \\ge 5x - 2 \\Rightarrow -3x \\ge -9 \\Rightarrow x \\le 3$. $6 - x \\le 3x - 10 \\Rightarrow -4x \\le -16 \\Rightarrow x \\ge 4$. En los tres, dividir entre un negativo voltea el signo.',
            { hint: 'Primero junta las x en un lado y los números en el otro. Si al final divides entre un número negativo, toca el signo para voltearlo: la sombra de abajo te avisa si cambiaste la solución.' }),
            play('semaforo-signos', 'Llena la **tabla de signos** y enciende los tramos de la solución', {
              rounds: [
                { txt: '(x − 4)(x + 2) < 0', factors: [{ txt: 'x − 4', root: 4, s: 1 }, { txt: 'x + 2', root: -2, s: 1 }], rel: '<' },
                { txt: 'x(x − 3)(x + 1) ≥ 0', factors: [{ txt: 'x', root: 0, s: 1 }, { txt: 'x − 3', root: 3, s: 1 }, { txt: 'x + 1', root: -1, s: 1 }], rel: '>=' },
              ],
            }, 'En $(x - 4)(x + 2) < 0$ el producto es negativo solo entre los ceros: $(-2, 4)$, sin los extremos porque la desigualdad es estricta. En $x(x - 3)(x + 1) \\ge 0$ los signos son $-\\,|\\,+\\,|\\,-\\,|\\,+$: $[-1, 0] \\cup [3, \\infty)$.',
            { hint: 'Para saber el signo de un factor en un tramo, prueba un número cualquiera de ese tramo. Un factor como x − a es negativo a la izquierda de a y positivo a la derecha.' }),
            play('semaforo-signos', 'Ahora con un **cociente**. Ojo con el cero del denominador', {
              rounds: [
                { txt: '(x − 5)/(x + 1) ≤ 0', factors: [{ txt: 'x − 5', root: 5, s: 1 }, { txt: 'x + 1', root: -1, s: 1, den: true }], rel: '<=' },
                { txt: '(3 − x)/(x + 2) ≥ 0', factors: [{ txt: '3 − x', root: 3, s: -1 }, { txt: 'x + 2', root: -2, s: 1, den: true }], rel: '>=' },
              ],
            }, 'Los signos del cociente siguen la misma regla que los del producto. $\\dfrac{x - 5}{x + 1} \\le 0$ da $(-1, 5]$ y $\\dfrac{3 - x}{x + 2} \\ge 0$ da $(-2, 3]$: el cero del numerador entra (el cociente vale 0) y el del denominador nunca.',
            { hint: 'Un factor con −x va al revés que uno con +x: pruébalo con un número de cada tramo. El punto donde el denominador vale cero queda siempre vacío.' }),
            play('dibuja-intervalo', 'Dibuja los números que cumplen $-5 < 3x + 1 \\le 10$', { min: -6, max: 6, a: -2, b: 3, aClosed: false, bClosed: true, set: '−5 < 3x + 1 ≤ 10' },
              'Se hace lo mismo en las tres partes: restar 1 da $-6 < 3x \\le 9$ y dividir entre 3 (positivo) da $-2 < x \\le 3$, es decir $(-2, 3]$.',
              { hint: 'Despeja x en las tres partes a la vez: lo que restes o dividas en el medio, hazlo también en los extremos. El signo estricto deja el extremo vacío.' }),
            num('¿Cuál es el **mayor entero** que cumple $7 - 2x > 3x - 8$?', 2,
              '$7 + 8 > 3x + 2x \\Rightarrow 15 > 5x \\Rightarrow x < 3$. El 3 no cumple (la desigualdad es estricta), así que el mayor entero es $2$.',
              { hint: 'Despeja x juntando las x en un lado. Ten en cuenta que con un signo estricto el extremo no cuenta.' }),
          ],
        },
        {
          id: 'alg-26c', title: 'Desigualdades con valor absoluto',
          // Cronograma de Cálculo 2026-2, clase 2 (Del Valle, módulo 1). Video: video/clase_calc_c2 (Cálculo · Clase C2).
          clip: { scenes: [
            sc(6, '$|x|$ es la **distancia** de $x$ al cero, y $|x - a|$ la distancia de $x$ a $a$. Por eso nunca es negativo.', { steps: ['$|-7| = 7 \\qquad |5 - 2| = |2 - 5| = 3$'] }),
            sc(6, 'Un perro amarrado a un poste en $a$ con una correa de largo $r$ llega a los puntos con $|x - a| \\le r$: un intervalo centrado en el poste.', { title: '$|x - 2| \\le 3 \\iff -1 \\le x \\le 5$', viz: { type: 'numberline', range: [-4, 7], sets: [[-1, 5, true, true]], label: '[−1, 5]' } }),
            sc(6, 'El gato está a salvo **fuera** del alcance: $|x - a| > r$ son dos semirrectas.', { title: '$|x - 2| > 3 \\iff x < -1 \\;\\text{ o }\\; x > 5$', viz: { type: 'numberline', range: [-4, 7], sets: [[-Infinity, -1, false, false], [5, Infinity, false, false]], label: '(−∞, −1) ∪ (5, ∞)' } }),
            sc(6, 'Si hay un coeficiente, primero se saca: el centro y el radio aparecen solos.', { steps: ['$|2x - 6| \\le 4 \\iff 2|x - 3| \\le 4 \\iff |x - 3| \\le 2$', 'Solución $[1, 5]$'] }),
            sc(5, '**Desigualdad triangular**: $|a + b| \\le |a| + |b|$. Juntar dos números nunca los aleja más que sumar sus tamaños.', { steps: ['$|3 + (-5)| = 2 \\le 3 + 5 = 8$'] }),
          ] },
          ex: [
            play('correa-del-perro', 'Pon el **poste**, la **correa** y la **zona** de cada desigualdad', {
              min: -8, max: 8,
              rounds: [
                { txt: '|x + 4| < 2', c: -4, r: 2, out: false, closed: false },
                { txt: '|x − 1| ≥ 3', c: 1, r: 3, out: true, closed: true },
                { txt: '|2x + 2| ≤ 6', c: -1, r: 3, out: false, closed: true },
                { txt: '|5 − x| > 2', c: 5, r: 2, out: true, closed: false },
              ],
            }, '$|x + 4| < 2$: poste en $-4$, correa 2, adentro: $(-6, -2)$. $|x - 1| \\ge 3$: afuera con puntas: $(-\\infty, -2] \\cup [4, \\infty)$. $|2x + 2| \\le 6$ es $|x + 1| \\le 3$: $[-4, 2]$. $|5 - x| = |x - 5|$, así que $|5 - x| > 2$ es $(-\\infty, 3) \\cup (7, \\infty)$.',
            { hint: 'En |x − c| el poste está en c; un + dentro de las barras deja el poste en un número negativo. «Menor que» es donde el perro alcanza; «mayor que», donde el gato está a salvo. Con ≤ o ≥ las puntas cuentan.' }),
            play('candado-absoluto', 'Gira las ruedas para escribir la desigualdad del conjunto y **abre el candado**', {
              min: -8, max: 8,
              rounds: [{ c: 3, rel: '<', r: 4 }, { c: -1, rel: '>=', r: 2.5 }, { c: 0, rel: '<=', r: 3 }],
            }, 'El centro es el punto medio de los extremos y el radio, la mitad de la distancia entre ellos. $(-1, 7)$ es $|x - 3| < 4$; $(-\\infty, -3.5] \\cup [1.5, \\infty)$ es $|x + 1| \\ge 2.5$; $[-3, 3]$ es $|x| \\le 3$.',
            { hint: 'El centro está justo en la mitad entre los dos extremos dibujados y el radio es la distancia del centro a un extremo. Un trozo en el medio es «menor»; dos semirrectas, «mayor». Puntos llenos: con igual.' }),
            play('distancia-justa', 'Coloca $x$ de modo que $|x + 2| = 6$', { min: -10, max: 6, a: -2, d: 6 },
              '$|x + 2| = |x - (-2)|$ es la distancia de $x$ a $-2$. A 6 pasos de $-2$ hay dos puntos: $4$ y $-8$.',
              { hint: 'Lee |x + 2| como la distancia de x al número −2 (no al 2). Desde ahí se puede caminar a la derecha o a la izquierda.' }),
            num('Una pieza debe medir 75 mm con una tolerancia de 0.4 mm: se acepta si $|L - 75| \\le 0.4$. ¿Cuál es la longitud **mínima** aceptada?', 74.6,
              '$|L - 75| \\le 0.4 \\iff 75 - 0.4 \\le L \\le 75 + 0.4$, es decir $74.6 \\le L \\le 75.4$. La mínima es $74.6$ mm.',
              { suffix: 'mm', tol: 0.001, hint: 'La pieza puede alejarse de la medida ideal a lo sumo la tolerancia, hacia arriba o hacia abajo. La mínima está en el extremo de abajo.' }),
            num('La ecuación $|2x - 5| = 9$ tiene dos soluciones. ¿Cuál es su **producto**?', -14,
              '$2x - 5 = 9 \\Rightarrow x = 7$ y $2x - 5 = -9 \\Rightarrow x = -2$. El producto es $7 \\cdot (-2) = -14$.',
              { hint: 'Lo de adentro de las barras puede valer el número de la derecha o su opuesto: resuelve las dos ecuaciones y multiplica las soluciones.' }),
          ],
        },
        {
          id: 'alg-51', title: 'Plano cartesiano, distancia y punto medio',
          // Cronograma de Cálculo 2026-2, clase 3 (Del Valle, módulo 2). Video: video/clase_calc_c3 (Cálculo · Clase C3).
          clip: { scenes: [
            sc(6, 'El **plano cartesiano** es un mapa: dos ejes perpendiculares y cada punto es un par $(x, y)$. Los ejes lo parten en cuatro cuadrantes.', { steps: ['I: $(+, +)$ · II: $(-, +)$ · III: $(-, -)$ · IV: $(+, -)$'] }),
            sc(7, 'La **distancia** entre dos puntos sale de Pitágoras: el segmento es la hipotenusa de un triángulo con catetos $\\Delta x$ y $\\Delta y$.', { title: '$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$', steps: ['$A(-1, 2),\\ B(5, 10)$: $d = \\sqrt{36 + 64} = 10$'] }),
            sc(6, 'El **punto medio** es el promedio de las coordenadas.', { title: '$M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)$', steps: ['Entre $A(-1, 2)$ y $B(5, 10)$: $M = (2, 6)$'] }),
            sc(6, 'Con pesos distintos en las puntas, el balancín se equilibra más cerca del pesado: el punto que divide el segmento en una razón es un **promedio ponderado**.', { steps: ['$G = \\dfrac{2A + B}{3}$ con $A(1, 1),\\ B(7, 4)$: $G = (3, 2)$'] }),
          ] },
          ex: [
            play('tirolesa', 'Suelta el cable justo para unir las dos torres de la **tirolesa**', {
              rounds: [{ A: [1, 2], B: [4, 6] }, { A: [-3, 4], B: [2, -8] }, { A: [-1, -2], B: [3, 5] }, { A: [0, 3], B: [6, 1] }],
            }, 'Con $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$: $\\sqrt{9 + 16} = 5$, $\\sqrt{25 + 144} = 13$, $\\sqrt{16 + 49} = \\sqrt{65} \\approx 8.1$ y $\\sqrt{36 + 4} = \\sqrt{40} \\approx 6.3$.',
            { hint: 'Cuenta en la cuadrícula cuánto hay que avanzar en horizontal y cuánto en vertical de una torre a la otra: son los catetos de un triángulo rectángulo y el cable es la hipotenusa.' }),
            play('balancin', 'Mueve el **apoyo** hasta que el balancín quede en equilibrio', {
              rounds: [{ A: [-3, 2], B: [5, -4], mA: 1, mB: 1 }, { A: [-2, 1], B: [4, 7], mA: 2, mB: 1 }, { A: [0, -3], B: [8, 1], mA: 1, mB: 3 }],
            }, 'Con pesos iguales, el punto medio: $(1, -1)$. Con pesos 2 y 1, el apoyo va a un tercio del camino desde el pesado: $(0, 3)$. Con 1 y 3, a tres cuartos desde A: $(6, 0)$. En general $G = \\dfrac{m_A A + m_B B}{m_A + m_B}$.',
            { hint: 'Con pesos iguales el apoyo va en la mitad. Si un lado pesa el doble, el apoyo se acerca a él: queda al doble de distancia del liviano que del pesado.' }),
            play('cuerdas-iguales', 'Desliza el anillo por el riel hasta que las **dos cuerdas midan lo mismo**', {
              rounds: [{ A: [2, 1], B: [4, 5], rail: 'y' }, { A: [-4, 1], B: [2, 5], rail: 'x' }, { A: [1, -3], B: [5, 1], rail: 'x' }],
            }, 'Se igualan los cuadrados de las distancias. En el eje $y$, $P(0, y)$: $4 + (y - 1)^2 = 16 + (y - 5)^2 \\Rightarrow y = 4.5$. En el eje $x$: $(p + 4)^2 + 1 = (p - 2)^2 + 25 \\Rightarrow p = 1$ y $(p - 1)^2 + 9 = (p - 5)^2 + 1 \\Rightarrow p = 2$.',
            { hint: 'Escribe las dos distancias desde un punto del riel (una coordenada es 0) y elévalas al cuadrado: al igualarlas, los cuadrados de la incógnita se cancelan y queda una ecuación lineal.' }),
            num('¿Cuál es el **perímetro** del triángulo con vértices $(0, 0)$, $(6, 0)$ y $(6, 8)$?', 24,
              'Los lados miden $6$, $8$ y $\\sqrt{36 + 64} = 10$: perímetro $6 + 8 + 10 = 24$.',
              { hint: 'Dos lados son horizontales o verticales y se cuentan directo; el tercero se calcula con la fórmula de la distancia.' }),
            num('El punto medio del segmento $AB$ es $M(3, -1)$ y $A = (-1, 4)$. ¿Cuál es la coordenada $y$ de $B$?', -6,
              'Si $\\tfrac{4 + y_B}{2} = -1$, entonces $4 + y_B = -2$ y $y_B = -6$. (También: de $A$ a $M$ la $y$ baja 5, y de $M$ a $B$ baja otros 5.)',
              { prefix: '$y_B =$', hint: 'El punto medio es el promedio: plantea la ecuación con las coordenadas y. O piensa que de A al punto medio hay el mismo salto que del punto medio a B.' }),
          ],
        },
        {
          id: 'calc-recta', title: 'La recta: pendiente, paralelas y perpendiculares',
          // Cronograma de Cálculo 2026-2, clase 3 (Del Valle §2.3–2.5). Video: video/clase_calc_c4 (Cálculo · Clase C4).
          clip: { scenes: [
            sc(6, 'La **pendiente** dice cuánto sube una recta por cada paso que avanza, como una rampa: $m = \\dfrac{\\text{subida}}{\\text{avance}}$.', { title: '$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$', steps: ['Por $(-1, 3)$ y $(2, -3)$: $m = \\dfrac{-6}{3} = -2$'] }),
            sc(6, 'Formas de la ecuación: **pendiente-intercepto** $y = mx + b$, **punto-pendiente** $y - y_1 = m(x - x_1)$ y **general** $Ax + By + C = 0$.', { steps: ['$y - 3 = -2(x + 1) \\Rightarrow y = -2x + 1$', '$2x + y - 1 = 0$'] }),
            sc(6, 'Rectas **paralelas**: la misma pendiente. **Perpendiculares**: pendientes de producto $-1$ (una es la recíproca opuesta de la otra).', { steps: ['Paralela a $y = -2x + 1$ por $(0, 4)$: $y = -2x + 4$', 'Perpendicular por $(0, 4)$: $y = \\tfrac12 x + 4$'] }),
            sc(5, 'Una recta **horizontal** tiene pendiente 0; una **vertical** no tiene pendiente ($x = $ constante). Son perpendiculares entre sí.', { steps: ['$y = 2$ y $x = -1$ se cortan en ángulo recto'] }),
          ] },
          ex: [
            play('laser-recta', 'Ajusta el láser para que atraviese **los dos cristales**', {
              rounds: [{ P: [-3, -1], Q: [3, 3] }, { P: [1, 2], Q: [3, 6] }, { P: [-2, 4], Q: [4, 1] }],
            }, 'La pendiente es $\\tfrac{\\Delta y}{\\Delta x}$ y el corte sale de despejar $b = y - mx$: $y = \\tfrac23 x + 1$, $y = 2x$ y $y = -\\tfrac12 x + 3$.',
            { hint: 'Cuenta cuánto sube y cuánto avanza el rayo de un cristal al otro: esa es la pendiente. Después sube o baja el rayo con el corte b hasta que toque los cristales.' }),
            play('rieles-paralelos', 'Gira el riel nuevo desde la estación', {
              rounds: [
                { base: { m: 2 / 3, b: -2 }, baseTxt: '2x − 3y = 6', through: [-1, 2], mode: 'par' },
                { base: { m: -4, b: 1 }, baseTxt: 'y = −4x + 1', through: [2, 1], mode: 'perp' },
                { base: { m: 0, b: 1 }, baseTxt: 'y = 1', through: [2, -1], mode: 'perp' },
                { base: { m: -3 / 4, b: 2 }, baseTxt: '3x + 4y = 8', through: [0, -2], mode: 'perp' },
              ],
            }, '$2x - 3y = 6$ es $y = \\tfrac23 x - 2$: la paralela tiene pendiente $\\tfrac23$. La perpendicular a pendiente $-4$ tiene $\\tfrac14$; la perpendicular a una horizontal es vertical; y $3x + 4y = 8$ tiene pendiente $-\\tfrac34$, así que su perpendicular tiene $\\tfrac43$.',
            { hint: 'Si la vía está en forma general, despeja y para ver su pendiente. Paralelo: la misma pendiente. Perpendicular: voltea la fracción y cámbiale el signo.' }),
            play('ordena-terminos', 'Ordena los pasos para hallar la recta que pasa por $(2, -1)$ y $(5, 8)$', { tex: '(2, -1),\\ (5, 8)', chips: ['m = (8 − (−1))/(5 − 2) = 3', 'y − (−1) = 3(x − 2)', 'y + 1 = 3x − 6', 'y = 3x − 7', 'm = (5 − 2)/(8 + 1) = 1/3', 'y = 3x − 5'], order: [0, 1, 2, 3], sep: '⇒' },
              'Primero la pendiente, con las $y$ arriba: $m = \\tfrac{9}{3} = 3$. Luego punto-pendiente con $(2, -1)$ y se despeja: $y = 3x - 7$. Comprobación: $3 \\cdot 5 - 7 = 8$. Poner las $x$ arriba da la recíproca, un error común.',
              { hint: 'La pendiente es la diferencia de las y sobre la diferencia de las x (en el mismo orden). Luego usa la forma punto-pendiente con uno de los puntos y despeja y.' }),
            num('¿En qué valor de $x$ corta la recta $3x - 2y = 12$ al eje $x$?', 4,
              'En el eje $x$ se cumple $y = 0$: $3x = 12$ y $x = 4$.',
              { prefix: '$x =$', hint: 'Sobre el eje horizontal la coordenada y vale cero: reemplaza y despeja x.' }),
            num('Las rectas $y = (k - 1)x + 2$ y $y = -\\tfrac14 x + 3$ son perpendiculares. ¿Cuánto vale $k$?', 5,
              'Perpendiculares: $(k - 1)\\left(-\\tfrac14\\right) = -1$, así que $k - 1 = 4$ y $k = 5$.',
              { prefix: '$k =$', hint: 'El producto de las pendientes de dos rectas perpendiculares es −1. La pendiente de la primera es lo que multiplica a x.' }),
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
