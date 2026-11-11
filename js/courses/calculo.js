// Curso de Cálculo Diferencial — sigue el cronograma 2026-2 de Cálculo diferencial (UdeA).
// Las unidades 1 y 2 (clases 1 a 9) vienen del antiguo curso de Álgebra y conservan sus ids alg-*
// para no perder el progreso guardado. Spec: docs/superpowers/specs/2026-11-07-cronograma-algebra-calculo-design.md

const COURSE_CALC = {
  id: 'calc', level: 'Semestre 1', name: 'Cálculo Diferencial', icon: 'dx', color: '#f472b6',
  tagline: 'La matemática del cambio: qué tan rápido crece, cae o se mueve algo.',
  units: [
    {
      world: 'intervalos', title: 'Desigualdades, valor absoluto y la recta',
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
      world: 'funciones', title: 'Funciones',
      lessons: [
        {
          id: 'alg-52', title: 'Funciones: dominio, rango y simetría',
          // Clase 4 del cronograma (C5). Spec 2026-11-08-calculo-unidad-2.
          clip: { scenes: [
            sc(6, 'Una **función** es una máquina: a cada entrada le da **exactamente una** salida. Se escribe $y = f(x)$.', { steps: ['Una curva es función si ninguna recta vertical la corta dos veces'] }),
            sc(6, 'El **dominio natural** son las entradas que la máquina acepta: nada de dividir entre cero ni raíces pares de negativos.', { steps: ['$\\dfrac{1}{x - 2}$: dominio $\\mathbb{R} \\setminus \\{2\\}$', '$\\sqrt{x + 1}$: dominio $[-1, \\infty)$'] }),
            sc(6, 'El **rango** es la sombra de la gráfica sobre el eje $y$; el dominio, su sombra sobre el eje $x$.', { title: '$f(x) = x^2 - 1$', viz: { type: 'graph', xr: [-3, 3], yr: [-2, 8], f: x => x * x - 1 }, steps: ['Rango: $[-1, \\infty)$'] }),
            sc(6, '**Par**: $f(-x) = f(x)$, espejo en el eje $y$. **Impar**: $f(-x) = -f(x)$, media vuelta en el origen.', { steps: ['$x^2$ es par · $x^3$ es impar'] }),
            sc(5, 'Una función **crece** si al avanzar a la derecha sube y **decrece** si baja.', { steps: ['$x^2$ decrece en $(-\\infty, 0]$ y crece en $[0, \\infty)$'] }),
          ] },
          ex: [
            play('proyector-sombras', 'Proyecta las sombras: marca el **dominio** (eje $x$) y el **rango** (eje $y$) de cada gráfica', {
              rounds: [
                { f: x => Math.sqrt(x + 3), xr: [-5, 5], yr: [-2, 5], dom: [-3, null, true, false], ran: [0, null, true, false] },
                { f: x => 4 - x * x, xr: [-4, 4], yr: [-6, 5], dom: [-2, 3, true, false], ran: [-5, 4, false, true] },
                { f: x => 2 - Math.abs(x - 1), xr: [-5, 5], yr: [-5, 4], dom: [null, null, false, false], ran: [null, 2, false, true] },
              ],
            }, '1) $\\sqrt{x + 3}$ empieza en $x = -3$ con altura 0 y sigue sin fin: dominio $[-3, \\infty)$, rango $[0, \\infty)$. 2) El trozo de $4 - x^2$ va de $x = -2$ (lleno) a $x = 3$ (vacío); su punto más alto es 4 y el más bajo se acerca a $-5$ sin tocarlo: rango $(-5, 4]$. 3) $2 - |x - 1|$ existe para todo $x$ y su pico está en 2: rango $(-\\infty, 2]$.',
              { hint: 'La sombra sobre el eje x es lo que la gráfica cubre de izquierda a derecha; sobre el eje y, de abajo arriba. Un punto vacío no proyecta su extremo, y si la gráfica sigue sin fin el corchete va al borde (∞).' }),
            play('dibuja-intervalo', 'Dibuja el dominio de $h(x) = \\sqrt{5 - x} + \\sqrt{x + 2}$', { min: -5, max: 7, a: -2, b: 5, aClosed: true, bClosed: true, set: 'dominio de h' },
              'Las dos raíces deben existir a la vez: $5 - x \\ge 0$ da $x \\le 5$ y $x + 2 \\ge 0$ da $x \\ge -2$. Juntas: $[-2, 5]$ (los extremos entran porque $\\sqrt0 = 0$).',
              { hint: 'Cada raíz cuadrada pide que lo de adentro no sea negativo. Plantea las dos condiciones y quédate con los x que cumplen ambas.' }),
            play('completa-simetria', 'Completa la mitad izquierda para que cada gráfica tenga la simetría pedida', {
              rounds: [
                { mode: 'par', pts: [[1, 3], [2, 1], [3, 2]], y0: 2, yr: [-4, 4] },
                { mode: 'impar', pts: [[1, 2], [2, 3], [3, -1]], yr: [-4, 4] },
              ],
            }, 'Par: $f(-1) = 3$, $f(-2) = 1$, $f(-3) = 2$ (las mismas alturas). Impar: $f(-1) = -2$, $f(-2) = -3$, $f(-3) = 1$ (alturas con el signo cambiado).',
              { hint: 'Par: el punto en −x queda a la misma altura que el de x. Impar: queda a la misma distancia del eje x, pero del otro lado.' }),
            num('Si $f(x) = x^2 - 3x$, ¿cuánto vale $f(-2)$?', 10,
              '$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$.',
              { hint: 'Reemplaza cada x por (−2), con paréntesis: el cuadrado de un negativo es positivo y restar un negativo es sumar.' }),
            num('La función $f(x) = x^2 - 6x + 2$ decrece en $(-\\infty, a]$ y crece en $[a, \\infty)$. ¿Cuánto vale $a$?', 3,
              'Es una parábola que abre hacia arriba: baja hasta el vértice y luego sube. El vértice está en $x = -\\tfrac{-6}{2} = 3$.',
              { hint: 'Una parábola que abre hacia arriba baja hasta su vértice y desde ahí sube. El vértice está en x = −b/(2a).' }),
          ],
        },
        {
          id: 'calc-tipos', title: 'Tipos de funciones',
          // Clase 5 del cronograma (C6).
          clip: { scenes: [
            sc(5, '**Constante** $f(x) = c$: una recta horizontal. **Lineal** $f(x) = mx + b$: una recta inclinada.', { steps: ['$f(x) = 3$ · $f(x) = 2x - 1$'] }),
            sc(5, '**Cuadrática** $ax^2 + bx + c$: una parábola. **Polinómica**: suma de potencias enteras de $x$.', { steps: ['$f(x) = (x + 1)(x - 2)^2$: corta en $-1$ y rebota en $2$'] }),
            sc(5, 'Cada raíz $r$ aporta un factor $(x - r)$. Si la raíz va dos veces, la gráfica toca el eje y rebota.', { steps: ['El signo de $a$ decide hacia dónde se va la gráfica a la derecha'] }),
            sc(5, '**Potencia** $f(x) = x^n$: con $n$ par es simétrica en el eje $y$; con $n$ impar, en el origen.', { steps: ['$x^{1/2} = \\sqrt{x}$ también es una potencia'] }),
            sc(6, '**Racional**: cociente de polinomios. Donde el denominador se anula hay una asíntota vertical.', { steps: ['$\\dfrac{1}{x}$: asíntotas $x = 0$ y $y = 0$', '$\\dfrac{1}{x - 2} + 1$: asíntotas $x = 2$ y $y = 1$'] }),
          ] },
          ex: [
            play('raices-imanes', 'Pon los imanes en las raíces y ajusta $a$ para calcar cada polinomio', {
              rounds: [
                { roots: [-1, 3], a: -1, xr: [-4, 5], yr: [-5, 6], mark: [0, 3] },
                { roots: [-3, 0, 0], a: 1, xr: [-5, 3], yr: [-3, 7], mark: [-2, 4] },
                { roots: [-2, 1, 3], a: 0.5, xr: [-4, 5], yr: [-6, 6], mark: [0, 3] },
              ],
            }, '1) $y = -(x + 1)(x - 3)$. 2) $y = x^2(x + 3)$: en 0 la curva rebota (raíz doble). 3) $y = \\tfrac12(x + 2)(x - 1)(x - 3)$, que en $x = 0$ vale $\\tfrac12 \\cdot 6 = 3$.',
              { hint: 'Cada corte con el eje x es una raíz r y aporta el factor (x − r); si la curva solo toca el eje y rebota, esa raíz va dos veces. Luego cambia a hasta que la curva pase por el punto rotulado.' }),
            play('cruz-asintotas', 'Lleva la cruz de asíntotas a su lugar en cada función racional', {
              rounds: [
                { p: 1, q: 2, h: -1, xr: [-6, 6], yr: [-6, 6] },
                { p: -2, q: 5, h: 2, xr: [-6, 6], yr: [-6, 6] },
                { p: 3, q: -3, h: -2, xr: [-6, 6], yr: [-6, 6] },
              ],
            }, 'La asíntota vertical está donde el denominador vale cero y la horizontal es el cociente de los coeficientes de $x$: 1) $x = -1$, $y = 1$. 2) $x = 2$, $y = -2$. 3) $x = -2$, $y = 3$.',
              { hint: 'La vertical va donde el denominador se hace cero. Para la horizontal piensa en x enorme: los números sueltos ya no pesan y queda el cociente de los coeficientes de x.' }),
            play('une-parejas', 'Une cada función con su tipo', {
              left: ['f(x) = −7', 'f(x) = 4 − 3x', 'f(x) = 2x² + x', 'f(x) = x⁴ − x + 1', 'f(x) = ∛x', 'f(x) = (x + 1)/(x² − 4)'],
              right: ['constante', 'lineal', 'cuadrática', 'polinómica de grado 4', 'potencia', 'racional', 'exponencial'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
            }, 'Sin $x$: constante. Grado 1: lineal. Grado 2: cuadrática. Grado 4: polinómica. $\\sqrt[3]{x} = x^{1/3}$ es una potencia. Un polinomio entre otro es racional. Ninguna tiene la $x$ en el exponente: «exponencial» sobra.',
              { hint: 'Mira el mayor exponente de x y si x aparece en un denominador. Una potencia es x elevado a un número fijo, que puede ser una fracción.' }),
            num('Una función lineal cumple $f(1) = 5$ y $f(3) = 11$. ¿Cuánto vale $f(0)$?', 2,
              'Pendiente: $\\tfrac{11 - 5}{3 - 1} = 3$. Desde $f(1) = 5$, un paso a la izquierda baja 3: $f(0) = 2$.',
              { hint: 'Con los dos puntos sale la pendiente (subida entre avance); luego retrocede un paso desde x = 1.' }),
            num('La función potencia $f(x) = k\\,x^3$ cumple $f(2) = 24$. ¿Cuánto vale $k$?', 3,
              '$k \\cdot 2^3 = 24$, o sea $8k = 24$ y $k = 3$.',
              { hint: 'Reemplaza x = 2, calcula la potencia y despeja k de la igualdad con 24.' }),
          ],
        },
        {
          id: 'alg-53', title: 'Operaciones y composición de funciones',
          // Clase 6 del cronograma (C7).
          clip: { scenes: [
            sc(6, 'Las funciones se **suman, restan y multiplican punto a punto**: en cada $x$ se operan las alturas.', { steps: ['$(f + g)(x) = f(x) + g(x)$', 'Dominio: donde existen las dos (y $g \\ne 0$ si se divide)'] }),
            sc(6, 'La **composición** encadena máquinas: $(g \\circ f)(x) = g(f(x))$, primero $f$ y luego $g$.', { steps: ['$f(x) = x + 1$, $g(x) = x^2$', '$g(f(3)) = g(4) = 16$', '$f(g(3)) = f(9) = 10$'] }),
            sc(5, 'El orden importa: en general $g \\circ f \\ne f \\circ g$.', { steps: ['$(g \\circ f)(x) = (x + 1)^2$ · $(f \\circ g)(x) = x^2 + 1$'] }),
            sc(5, 'Para **desarmar** una compuesta se busca la operación de adentro y la de afuera.', { steps: ['$(2x + 1)^3$: adentro $2x + 1$, afuera $u^3$'] }),
          ] },
          ex: [
            play('apila-alturas', 'Lleva cada cuenta a la altura de la operación pedida', {
              rounds: [
                { mode: 'sum', f: x => x - 1, g: x => x * x / 2, fTxt: 'x − 1', gTxt: 'x²/2', xs: [-2, -1, 0, 1, 2], xr: [-3, 3], yr: [-4, 4] },
                { mode: 'diff', f: x => Math.abs(x), g: () => 1, fTxt: '|x|', gTxt: '1', xs: [-2, -1, 0, 1, 2], xr: [-3, 3], yr: [-3, 3] },
                { mode: 'prod', f: x => x, g: x => x - 1, fTxt: 'x', gTxt: 'x − 1', xs: [-1, 0, 1, 2], xr: [-3, 3], yr: [-3, 4] },
              ],
            }, '1) $f + g$: $-1, -1.5, -1, 0.5, 3$. 2) $|x| - 1$: $1, 0, -1, 0, 1$ (la V baja una unidad). 3) $x(x - 1)$: $2, 0, 0, 2$.',
              { hint: 'Trabaja una x a la vez: lee la altura de f y la de g en esa x (contando cuadritos) y opéralas. La cuenta va a ese resultado.' }),
            play('tuberia-maquinas', 'Arma cada función con las máquinas, en el orden correcto', {
              chips: [
                { tpl: '□ + 2', f: x => x + 2 }, { tpl: '(□)²', f: x => x * x }, { tpl: '3(□)', f: x => 3 * x },
                { tpl: '√(□)', f: Math.sqrt }, { tpl: '□ − 5', f: x => x - 5 }, { tpl: '1/(□)', f: x => 1 / x },
              ],
              rounds: [
                { n: 2, input: 1, goal: x => (x + 2) ** 2, goalTxt: 'h(x) = (x + 2)²', tests: [-3, -1, 0, 2, 4] },
                { n: 2, input: 2, goal: x => 3 * x * x, goalTxt: 'h(x) = 3x²', tests: [-2, -1, 1, 3] },
                { n: 3, input: 3, goal: x => Math.sqrt(3 * x - 5), goalTxt: 'h(x) = √(3x − 5)', tests: [2, 3, 7, 10] },
              ],
            }, '1) Primero $+2$ y luego el cuadrado. 2) Primero el cuadrado y luego $\\times 3$ (al revés daría $9x^2$). 3) $\\times 3$, luego $-5$ y al final la raíz.',
              { hint: 'La máquina que va primero es la que toca la x directamente (la de más adentro); la de afuera va al final. Sigue la bolita para ver qué le pasa al número.' }),
            play('tuberia-maquinas', 'Con $f(x) = 3x$, $g(x) = x + 2$ y $h(x) = \\tfrac1x$, arma cada composición', {
              chips: [
                { tpl: '□ + 2', f: x => x + 2 }, { tpl: '3(□)', f: x => 3 * x }, { tpl: '1/(□)', f: x => 1 / x }, { tpl: '□ − 5', f: x => x - 5 },
              ],
              rounds: [
                { n: 2, input: 1, goal: x => 3 * (x + 2), goalTxt: '(f ∘ g)(x)', tests: [-1, 0, 2] },
                { n: 2, input: 1, goal: x => 3 * x + 2, goalTxt: '(g ∘ f)(x)', tests: [-1, 0, 2] },
                { n: 2, input: 7, goal: x => 1 / (x - 5), goalTxt: '(h ∘ k)(x), k(x) = x − 5', tests: [3, 6, 9] },
              ],
            }, '$(f \\circ g)(x) = f(x + 2) = 3(x + 2)$: primero $g$. $(g \\circ f)(x) = g(3x) = 3x + 2$: primero $f$. $(h \\circ k)(x) = \\tfrac{1}{x - 5}$: primero $k$.',
              { hint: 'En (f ∘ g)(x) = f(g(x)) actúa primero la función de la derecha; la que está a la izquierda del círculo actúa de última.' }),
            num('Con $f(x) = x^2 + 1$ y $g(x) = 3x - 2$, calcula $(f \\circ g)(1)$.', 2,
              '$g(1) = 3 - 2 = 1$ y $f(1) = 1 + 1 = 2$.',
              { hint: 'Primero calcula g(1); ese resultado es la entrada de f.' }),
            num('Con las mismas funciones, calcula $(g \\circ f)(2)$.', 13,
              '$f(2) = 4 + 1 = 5$ y $g(5) = 15 - 2 = 13$.',
              { hint: 'Ahora el orden se invierte: primero actúa f y su salida entra a g.' }),
          ],
        },
        {
          id: 'calc-tramos', title: 'Funciones a tramos y valor absoluto',
          // Clase 7 del cronograma (C8).
          clip: { scenes: [
            sc(6, 'Una función **a tramos** usa una fórmula distinta en cada parte del dominio, como la tarifa de un parqueadero.', { steps: ['Primero se mira en qué tramo cae $x$', 'Punto lleno: el corte pertenece a ese tramo · vacío: no'] }),
            sc(6, 'El **valor absoluto** es una función a tramos: $|x| = x$ si $x \\ge 0$ y $|x| = -x$ si $x < 0$.', { steps: ['Su gráfica es una V con vértice en el origen'] }),
            sc(6, 'Para graficar $|g(x)|$ se dobla hacia arriba lo que $g$ tiene bajo el eje $x$.', { title: '$|x^2 - 4|$', viz: { type: 'graph', xr: [-3, 3], yr: [-1, 5], f: x => Math.abs(x * x - 4) } }),
            sc(5, 'Una función **algebraica** se arma con sumas, productos, cocientes y raíces de $x$.', { steps: ['$\\sqrt{x}$, $\\dfrac{x}{x + 1}$, $x\\sqrt{x + 3}$'] }),
          ] },
          ex: [
            play('arma-tramos', 'Arma la gráfica de cada función a tramos', {
              rounds: [
                { c: 0, xr: [-3, 4], yr: [-6, 5], left: { m: 2, b: 1 }, right: { m: -1, b: 3 }, leftIncl: false, txt: ['2x + 1   si x < 0', '3 − x   si x ≥ 0'] },
                { c: 2, xr: [-2, 5], yr: [-3, 4], left: { m: 0, b: 2 }, right: { m: 1, b: -3 }, leftIncl: true, txt: ['2   si x ≤ 2', 'x − 3   si x > 2'] },
              ],
            }, '1) El primer tramo va de $(-3, -5)$ a $(0, 1)$ vacío; el segundo, de $(0, 3)$ lleno a $(4, -1)$. 2) El primero es la recta horizontal $y = 2$ hasta $(2, 2)$ lleno; el segundo va de $(2, -1)$ vacío a $(5, 2)$.',
              { hint: 'En cada tramo solo vale su fórmula: evalúala en los dos bordes de ese tramo. En el corte, el punto lleno es del tramo cuya condición trae ≤ o ≥.' }),
            play('dobla-negativos', 'Dobla lo necesario para dibujar el valor absoluto de cada función', {
              rounds: [
                { f: x => x - 1, fTxt: 'x − 1', xr: [-3, 4], yr: [-4, 4], roots: [1] },
                { f: x => x * x - 2 * x - 3, fTxt: 'x² − 2x − 3', xr: [-3, 5], yr: [-5, 6], roots: [-1, 3] },
                { f: x => x ** 3 - 4 * x, fTxt: 'x³ − 4x', xr: [-3, 3], yr: [-4, 4], roots: [-2, 0, 2] },
              ],
            }, 'Se doblan solo los trozos bajo el eje: 1) $x < 1$. 2) Entre $-1$ y $3$. 3) $x < -2$ y $0 < x < 2$.',
              { hint: 'El valor absoluto nunca es negativo: lo que ya está arriba del eje x se queda igual y solo se reflejan los trozos que bajan del eje.' }),
            play('dibuja-intervalo', 'Dibuja el dominio de la función algebraica $f(x) = \\sqrt{9 - x^2}$', { min: -5, max: 5, a: -3, b: 3, aClosed: true, bClosed: true, set: 'dominio de f' },
              'Se necesita $9 - x^2 \\ge 0$, es decir $x^2 \\le 9$: $-3 \\le x \\le 3$.',
              { hint: 'Dentro de la raíz no puede quedar un negativo: busca los x cuyo cuadrado no supere al número que está al lado.' }),
            num('Una carrera de taxi cuesta $f(x) = 6$ si $0 < x \\le 2$ y $f(x) = 6 + 1.5(x - 2)$ si $x > 2$ ($x$ en km, $f$ en miles de pesos). ¿Cuánto cuesta, en miles de pesos, un viaje de 6 km?', 12,
              'Como $6 > 2$ se usa el segundo tramo: $6 + 1.5 \\cdot 4 = 12$, o sea 12 000 pesos.',
              { hint: 'Primero decide en qué tramo cae x = 6; luego usa solo la fórmula de ese tramo.', suffix: 'mil pesos' }),
            num('Si $f(x) = |2x - 7| - 3$, ¿cuánto vale $f(1)$?', 2,
              '$|2 - 7| - 3 = |-5| - 3 = 5 - 3 = 2$.',
              { hint: 'Calcula lo que está dentro de las barras; si sale negativo, el valor absoluto le quita el signo. Después resta.' }),
          ],
        },
        {
          id: 'alg-61', title: 'Transformaciones de funciones',
          // Clase 8 del cronograma (C9).
          clip: { scenes: [
            sc(6, '**Subir y bajar**: $f(x) + k$ sube la gráfica $k$ unidades (si $k < 0$, baja).', { steps: ['$y = x^2 + 2$: la parábola, 2 arriba'] }),
            sc(6, '**Correr**: $f(x - h)$ corre la gráfica $h$ a la **derecha**: va al revés de lo que parece el signo.', { steps: ['$y = (x - 3)^2$: vértice en $x = 3$'] }),
            sc(5, '**Estirar**: $a\\,f(x)$ multiplica las alturas por $a$. **Reflejar**: $-f(x)$ en el eje $x$, $f(-x)$ en el eje $y$.', { steps: ['$y = 2x^2$ es más empinada · $y = -x^2$ abre hacia abajo'] }),
            sc(6, 'El **orden importa**: estirar y luego subir no es lo mismo que subir y luego estirar.', { steps: ['$2\\sqrt{x} + 1 \\ne 2(\\sqrt{x} + 1) = 2\\sqrt{x} + 2$'] }),
          ] },
          ex: [
            play('sellos-graficas', 'Usa los sellos para llevar la gráfica base hasta la fantasma', {
              rounds: [
                { base: 'sq', target: { A: 1, B: 1, C: -2, D: -3 }, xr: [-3, 5], yr: [-4, 6] },
                { base: 'abs', target: { A: -1, B: 1, C: 1, D: 2 }, xr: [-5, 4], yr: [-4, 4] },
                { base: 'sqrt', target: { A: 2, B: 1, C: -1, D: -1 }, xr: [-1, 7], yr: [-3, 6] },
              ],
            }, '1) $(x - 2)^2 - 3$: dos → y tres ↓. 2) $-|x + 1| + 2$: ←, reflejo en $x$ y dos ↑. 3) $2\\sqrt{x - 1} - 1$: →, ×2 y después ↓ (si bajas antes de estirar, la bajada también se duplica).',
              { hint: 'Lo que va dentro con la x corre la gráfica de lado y al revés del signo; lo de afuera la sube, la baja o la estira. Estira antes de subir o bajar: un ×2 posterior también duplica la subida.' }),
            play('sellos-graficas', 'Ahora con reflejos y encogimientos', {
              rounds: [
                { base: 'sqrt', target: { A: 1, B: -1, C: 0, D: 0 }, xr: [-6, 3], yr: [-2, 4] },
                { base: 'cube', target: { A: -0.5, B: 1, C: 0, D: 0 }, xr: [-3, 3], yr: [-4, 4] },
                { base: 'recip', target: { A: 1, B: 1, C: 2, D: -1 }, xr: [-6, 3], yr: [-4, 3] },
              ],
            }, '1) $\\sqrt{-x}$: reflejo en el eje $y$. 2) $-\\tfrac12 x^3$: ×½ y reflejo en el eje $x$. 3) $\\tfrac{1}{x + 2} - 1$: dos ← y uno ↓.',
              { hint: 'Reflejar en el eje x cambia el signo de toda la función (afuera); reflejar en el eje y cambia el signo de la x (adentro).' }),
            play('une-parejas', 'Une cada fórmula con lo que le hace a la gráfica de $f$', {
              left: ['y = f(x) − 4', 'y = f(x + 4)', 'y = 4f(x)', 'y = f(4x)', 'y = −f(x)'],
              right: ['baja 4', 'corre 4 a la izquierda', 'estira ×4 en vertical', 'encoge en horizontal', 'refleja en el eje x', 'corre 4 a la derecha'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'Fuera de $f$ se actúa en vertical y tal como se lee; dentro, con la $x$, en horizontal y al revés: $f(x + 4)$ corre a la izquierda y $f(4x)$ encoge. Sobra «corre 4 a la derecha», que sería $f(x - 4)$.',
              { hint: 'Si el cambio está fuera de f actúa en vertical, tal como se lee; si está dentro, junto a la x, actúa en horizontal y al revés de lo que parece.' }),
            num('El punto $(2, 5)$ está en la gráfica de $f$. ¿Qué altura tiene el punto correspondiente de $y = 3f(x) - 4$?', 11,
              'La $x$ no cambia y la altura pasa a $3 \\cdot 5 - 4 = 11$.',
              { hint: 'La x se queda igual; a la altura de f primero se le aplica el estiramiento y luego la bajada.' }),
            num('El punto $(1, 6)$ está en la gráfica de $f$. ¿En qué $x$ queda ese punto en la gráfica de $y = f(x + 3)$?', -2,
              'Hace falta que $x + 3 = 1$, o sea $x = -2$: la gráfica se corrió 3 a la izquierda.',
              { hint: 'Necesitas que lo de adentro, x + 3, valga lo mismo que la entrada original del punto.' }),
          ],
        },
        {
          id: 'alg-62', title: 'Función biyectiva e inversa',
          // Clase 9 del cronograma (C10).
          clip: { scenes: [
            sc(6, '**Inyectiva**: ninguna recta horizontal corta la gráfica dos veces. **Biyectiva**: inyectiva y sobre.', { steps: ['$x^3$ es inyectiva; $x^2$ no: $f(2) = f(-2)$'] }),
            sc(6, 'La **inversa** deshace: si $f$ lleva $a$ a $b$, $f^{-1}$ lleva $b$ a $a$. Se deshace en orden contrario, como quitarse los zapatos antes que las medias.', { steps: ['$f^{-1}(f(x)) = x$'] }),
            sc(6, 'Para hallarla: escribe $y = f(x)$ y despeja $x$.', { steps: ['$y = 2x + 3 \\Rightarrow x = \\dfrac{y - 3}{2}$', '$f^{-1}(x) = \\dfrac{x - 3}{2}$'] }),
            sc(6, 'Las gráficas de $f$ y $f^{-1}$ son reflejos en la recta $y = x$: $(a, b)$ pasa a $(b, a)$.', { steps: ['$(1, 5)$ en $f$ ⟹ $(5, 1)$ en $f^{-1}$'] }),
            sc(5, 'Si no es inyectiva se **restringe** el dominio: $x^2$ con $x \\ge 0$ tiene inversa $\\sqrt{x}$.'),
          ] },
          ex: [
            play('espejo-diagonal', 'Refleja los puntos de $f$ en el espejo $y = x$ para dibujar $f^{-1}$', {
              rounds: [
                { f: x => 2 * x - 1, fTxt: '2x − 1', pts: [[-1, -3], [0, -1], [2, 3]], t: [-2, 3], range: [-5, 5] },
                { f: x => x ** 3 + 1, fTxt: 'x³ + 1', pts: [[-1, 0], [0, 1], [1, 2]], t: [-1.6, 1.5], range: [-5, 5] },
                { f: x => 2 ** x, fTxt: '2ˣ', pts: [[0, 1], [1, 2], [2, 4]], t: [-4, 2.3], range: [-5, 5] },
              ],
            }, 'Se intercambian las coordenadas: 1) $(-3, -1)$, $(-1, 0)$, $(3, 2)$. 2) $(0, -1)$, $(1, 0)$, $(2, 1)$. 3) $(1, 0)$, $(2, 1)$, $(4, 2)$: la inversa de $2^x$ es $\\log_2 x$.',
              { hint: 'Reflejar en la recta y = x es intercambiar las coordenadas: la entrada de f pasa a ser la salida de la inversa.' }),
            play('cofre-candados', 'Abre cada cofre: escoge las llaves en el orden correcto', {
              rounds: [
                { fTxt: '3x + 4', probe: 2,
                  locks: [{ txt: '× 3', f: x => 3 * x }, { txt: '+ 4', f: x => x + 4 }],
                  keys: [{ txt: '÷ 3', tpl: '(□)/3', f: x => x / 3 }, { txt: '− 4', tpl: '□ − 4', f: x => x - 4 }, { txt: '+ 4', tpl: '□ + 4', f: x => x + 4 }, { txt: '× 3', tpl: '3(□)', f: x => 3 * x }],
                  order: [1, 0] },
                { fTxt: '(x − 1)³', probe: 3,
                  locks: [{ txt: '− 1', f: x => x - 1 }, { txt: '³', f: x => x ** 3 }],
                  keys: [{ txt: '∛', tpl: '∛(□)', f: Math.cbrt }, { txt: '+ 1', tpl: '□ + 1', f: x => x + 1 }, { txt: '− 1', tpl: '□ − 1', f: x => x - 1 }, { txt: '³', tpl: '(□)³', f: x => x ** 3 }],
                  order: [0, 1] },
                { fTxt: '2√x − 5', probe: 9,
                  locks: [{ txt: '√', f: Math.sqrt }, { txt: '× 2', f: x => 2 * x }, { txt: '− 5', f: x => x - 5 }],
                  keys: [{ txt: '+ 5', tpl: '□ + 5', f: x => x + 5 }, { txt: '÷ 2', tpl: '(□)/2', f: x => x / 2 }, { txt: '²', tpl: '(□)²', f: x => x * x }, { txt: '− 5', tpl: '□ − 5', f: x => x - 5 }, { txt: '√', tpl: '√(□)', f: Math.sqrt }],
                  order: [0, 1, 2] },
              ],
            }, '1) $f^{-1}(x) = \\dfrac{x - 4}{3}$. 2) $f^{-1}(x) = \\sqrt[3]{x} + 1$. 3) $f^{-1}(x) = \\left(\\dfrac{x + 5}{2}\\right)^2$. Siempre se quita primero el último candado, con la operación contraria.',
              { hint: 'Para deshacer se quita primero el último candado que se cerró, con la operación contraria. Mira qué le hace f a la x, en orden, y recórrelo al revés.' }),
            play('dibuja-intervalo', '$f(x) = (x - 2)^2$ no es inyectiva en $[-3, 6]$. Dibuja el intervalo más grande dentro de $[-3, 6]$ que contiene a $x = 5$ y donde $f$ sí es inyectiva', { min: -3, max: 6, a: 2, b: 6, aClosed: true, bClosed: true, set: 'restricción' },
              'La parábola baja hasta su vértice en $x = 2$ y luego sube; del lado derecho no repite valores. Con el 5 adentro: $[2, 6]$.',
              { hint: 'Una parábola es inyectiva a cada lado de su vértice: busca el vértice, quédate con el lado donde está el 5 y llega hasta el borde.' }),
            num('Si $f(x) = 4x - 7$, ¿cuánto vale $f^{-1}(13)$?', 5,
              'Se busca la entrada que da 13: $4x - 7 = 13$, $4x = 20$, $x = 5$.',
              { hint: 'Busca la entrada que f convierte en 13: plantea la ecuación f(x) = 13 y despeja.' }),
            num('Si $f(x) = x^3 + 2$, ¿cuánto vale $f^{-1}(29)$?', 3,
              '$x^3 + 2 = 29 \\Rightarrow x^3 = 27 \\Rightarrow x = 3$.',
              { hint: 'Quita lo que f sumó y luego deshaz el cubo con la raíz cúbica.' }),
          ],
        },
      ],
    },
    {
      world: 'limites', title: 'Límites y continuidad',
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
      world: 'derivada', title: 'La derivada',
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
      world: 'aplicaciones', title: 'Aplicaciones de la derivada',
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
