// Contenido de Zuka: cursos → unidades → lecciones. Cada lección = 1 clip vertical + ejercicios.
// Los textos aceptan TeX entre $...$ y **negritas**.
//
// Escena de clip:  sc(segundos, subtítulo, { title, steps, viz, say })
//   title: fórmula grande arriba · steps: líneas que aparecen una a una · viz: animación (ver js/viz.js)
//   Para usar un video real en lugar de la animación: clip: { video: 'videos/archivo.mp4', scenes: [] }
// Ejercicios: mc (opción múltiple), num (respuesta numérica), ord (ordenar), sld (deslizador interactivo).

const sc = (d, text, extra = {}) => ({ d, text, ...extra });
const mc = (q, options, answer, explain) => ({ type: 'mc', q, options, answer, explain });
const num = (q, answer, explain, extra = {}) => ({ type: 'input', q, answer, explain, ...extra });
const ord = (q, items, explain) => ({ type: 'order', q, items, explain });
const sld = (q, o) => ({ type: 'slider', q, ...o });
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;

const sq = x => x * x;

const COURSES = [
  {
    id: 'algebra', level: 'Fundamentos', name: 'Álgebra', icon: 'x²', color: '#8b7bff',
    tagline: 'Ecuaciones, rectas y parábolas: el idioma de la ingeniería.',
    units: [
      {
        title: 'Ecuaciones lineales',
        lessons: [
          {
            id: 'alg-1', title: 'Despejar la incógnita',
            clip: { scenes: [
              sc(4, 'Una ecuación es una **balanza**: ambos lados pesan lo mismo.', { title: '$2x + 3 = 11$', viz: { type: 'balance', l: '2x + 3', r: '11' } }),
              sc(5, 'Lo que hagas a un lado, hazlo también al otro. Resta 3:', { steps: ['$2x + 3 = 11$', '$2x + 3 - 3 = 11 - 3$', '$2x = 8$'] }),
              sc(4, 'Ahora divide ambos lados entre 2:', { steps: ['$2x = 8$', '$\\dfrac{2x}{2} = \\dfrac{8}{2}$', '$x = 4$'] }),
              sc(4, 'Comprueba siempre: sustituye y verifica.', { title: '$2(4) + 3 = 11$ ✓', viz: { type: 'balance', l: '2·4 + 3', r: '11' } }),
            ] },
            ex: [
              mc('Resuelve $x + 5 = 12$', ['$x = 7$', '$x = 17$', '$x = 5$', '$x = -7$'], 0, 'Resta 5 en ambos lados: $x = 12 - 5 = 7$.'),
              num('Resuelve $3x = 18$', 6, 'Divide entre 3: $x = 18 / 3 = 6$.', { prefix: '$x =$' }),
              num('Resuelve $2x - 4 = 10$', 7, 'Suma 4: $2x = 14$. Divide entre 2: $x = 7$.', { prefix: '$x =$' }),
              ord('Ordena los pasos para resolver $5x + 2 = 17$', ['$5x + 2 = 17$', '$5x = 15$', '$x = 3$'], 'Primero quitas el término independiente y luego el coeficiente.'),
              mc('¿Qué haces primero en $4x - 7 = 9$?', ['Sumar 7 a ambos lados', 'Dividir solo el lado izquierdo entre 4', 'Restar 9 a la izquierda', 'Multiplicar por 7'], 0, 'Deshaz primero la resta: $4x = 16$, luego divide: $x = 4$.'),
            ],
          },
          {
            id: 'alg-2', title: 'Rectas y pendiente',
            clip: { scenes: [
              sc(4, 'Toda recta no vertical se escribe como $y = mx + b$.', { title: '$y = mx + b$', viz: { type: 'graph', xr: [-5, 5], yr: [-5, 5], f: x => 0.5 * x + 1, draw: true } }),
              sc(5, '$m$ es la **pendiente**: qué tan inclinada está.', { viz: { type: 'graph', xr: [-5, 5], yr: [-5, 5], f: (x, m) => m * x + 1, anim: [-2, 2], label: m => `m = ${fmt(m)}` } }),
              sc(5, '$b$ es donde la recta corta el eje $y$.', { viz: { type: 'graph', xr: [-5, 5], yr: [-5, 5], f: (x, b) => 0.5 * x + b, anim: [-3, 3], label: b => `b = ${fmt(b)}` } }),
              sc(5, 'Pendiente = lo que sube ÷ lo que avanza.', { title: '$m = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{5-2}{3-1} = 1.5$', viz: { type: 'graph', xr: [-1, 6], yr: [-1, 8], f: x => 1.5 * x + 0.5, points: [[1, 2, '(1, 2)'], [3, 5, '(3, 5)']] } }),
            ] },
            ex: [
              sld('Ajusta la pendiente $m$ para que $y = mx + 1$ pase por el punto $(2, 5)$', {
                viz: { type: 'graph', xr: [-1, 5], yr: [-1, 8], f: (x, m) => m * x + 1, points: [[2, 5, '(2, 5)']] },
                min: -3, max: 4, step: 0.5, init: 0, readout: v => `$m = ${v}$`,
                check: v => near(v, 2), answerText: '$m = 2$', explain: '$5 = m \\cdot 2 + 1 \\Rightarrow m = 2$.',
              }),
              mc('Pendiente de la recta que pasa por $(1, 2)$ y $(3, 8)$', ['$3$', '$2$', '$6$', '$\\tfrac{1}{3}$'], 0, '$m = \\dfrac{8 - 2}{3 - 1} = \\dfrac{6}{2} = 3$.'),
              num('¿En qué valor de $y$ corta $y = -2x + 5$ al eje $y$?', 5, 'Con $x = 0$: $y = b = 5$.', { prefix: '$y =$' }),
              mc('Si $m < 0$, la recta…', ['Baja de izquierda a derecha', 'Sube de izquierda a derecha', 'Es horizontal', 'Es vertical'], 0, 'Pendiente negativa: al avanzar en $x$, $y$ disminuye.'),
            ],
          },
        ],
      },
      {
        title: 'Polinomios y cuadráticas',
        lessons: [
          {
            id: 'alg-3', title: 'Productos notables',
            clip: { scenes: [
              sc(4, '¿Cuánto es $(a + b)^2$? Dibujémoslo como un área.', { title: '$(a + b)^2 = \\;?$', viz: { type: 'areaSquare' } }),
              sc(5, 'Un cuadrado de lado $a + b$ se parte en 4 piezas.', { viz: { type: 'areaSquare' } }),
              sc(5, 'Suma las áreas: hay dos rectángulos iguales $ab$.', { title: '$(a + b)^2 = a^2 + 2ab + b^2$', viz: { type: 'areaSquare', full: true } }),
              sc(5, 'Y la diferencia de cuadrados:', { steps: ['$(a + b)(a - b)$', '$= a^2 - ab + ab - b^2$', '$= a^2 - b^2$'] }),
            ] },
            ex: [
              mc('Expande $(x + 3)^2$', ['$x^2 + 6x + 9$', '$x^2 + 9$', '$x^2 + 3x + 9$', '$2x + 6$'], 0, '$(x + 3)^2 = x^2 + 2 \\cdot 3x + 3^2$.'),
              mc('Expande $(x - 5)(x + 5)$', ['$x^2 - 25$', '$x^2 + 25$', '$x^2 - 10x - 25$', '$x^2 - 10$'], 0, 'Diferencia de cuadrados: $a^2 - b^2$.'),
              num('Si $(x + k)^2 = x^2 + 10x + 25$, ¿cuánto vale $k$?', 5, '$2k = 10 \\Rightarrow k = 5$ (y $k^2 = 25$ ✓).', { prefix: '$k =$' }),
              mc('Factoriza $x^2 - 9$', ['$(x - 3)(x + 3)$', '$(x - 9)(x + 1)$', '$(x - 3)^2$', '$(x + 9)(x - 1)$'], 0, '$x^2 - 3^2 = (x - 3)(x + 3)$.'),
            ],
          },
          {
            id: 'alg-4', title: 'La parábola',
            clip: { scenes: [
              sc(4, 'Las cuadráticas $y = ax^2 + bx + c$ dibujan **parábolas**.', { title: '$y = ax^2$', viz: { type: 'graph', xr: [-4, 4], yr: [-2, 8], f: sq, draw: true } }),
              sc(5, 'El signo de $a$ decide si abre hacia arriba o hacia abajo.', { viz: { type: 'graph', xr: [-4, 4], yr: [-6, 6], f: (x, a) => a * x * x, anim: [2, -2], label: a => `a = ${fmt(a)}` } }),
              sc(5, 'Las **raíces** son donde la parábola toca el eje $x$.', { title: '$x^2 - 5x + 6 = 0$', viz: { type: 'graph', xr: [-1, 6], yr: [-2, 6], f: x => x * x - 5 * x + 6, points: [[2, 0, 'x = 2'], [3, 0, 'x = 3']] } }),
              sc(6, 'Para hallarlas usa la fórmula general. El discriminante te dice cuántas hay:', { title: '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', steps: ['$b^2 - 4ac > 0$: dos raíces', '$b^2 - 4ac = 0$: una raíz', '$b^2 - 4ac < 0$: ninguna real'] }),
            ] },
            ex: [
              sld('Ajusta $a$ para que $y = ax^2$ pase por el punto $(2, 2)$', {
                viz: { type: 'graph', xr: [-3, 3], yr: [-4, 5], f: (x, a) => a * x * x, points: [[2, 2, '(2, 2)']] },
                min: -2, max: 2, step: 0.25, init: 1, readout: v => `$a = ${v}$`,
                check: v => near(v, 0.5), answerText: '$a = 0.5$', explain: '$2 = a \\cdot 2^2 \\Rightarrow a = \\tfrac{1}{2}$.',
              }),
              num('¿Cuál es la raíz **mayor** de $x^2 - 5x + 6 = 0$?', 3, 'Factoriza: $(x - 2)(x - 3) = 0$. Raíces 2 y 3.', { prefix: '$x =$' }),
              mc('Discriminante $b^2 - 4ac$ de $x^2 + 2x + 5$', ['$-16$', '$24$', '$16$', '$-4$'], 0, '$2^2 - 4(1)(5) = 4 - 20 = -16$: no tiene raíces reales.'),
              mc('Si $a < 0$, la parábola abre hacia…', ['Abajo', 'Arriba', 'La derecha', 'La izquierda'], 0, 'Con $a$ negativo, $ax^2$ toma valores negativos al alejarse del vértice.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'trig', level: 'Fundamentos', name: 'Trigonometría', icon: 'θ', color: '#22d3ee',
    tagline: 'Ángulos, triángulos y el círculo unitario.',
    units: [
      {
        title: 'Triángulos rectángulos',
        lessons: [
          {
            id: 'trig-1', title: 'SOH · CAH · TOA',
            clip: { scenes: [
              sc(4, 'En un triángulo rectángulo nombramos los lados respecto al ángulo $\\theta$.', { viz: { type: 'triangle', from: 35 } }),
              sc(5, '**SOH**: seno = opuesto ÷ hipotenusa.', { title: '$\\sin\\theta = \\dfrac{\\text{op}}{\\text{hip}}$', viz: { type: 'triangle', from: 20, to: 60, show: 'sin' } }),
              sc(5, '**CAH**: coseno = adyacente ÷ hipotenusa.', { title: '$\\cos\\theta = \\dfrac{\\text{ady}}{\\text{hip}}$', viz: { type: 'triangle', from: 60, to: 20, show: 'cos' } }),
              sc(5, '**TOA**: tangente = opuesto ÷ adyacente.', { title: '$\\tan\\theta = \\dfrac{\\text{op}}{\\text{ady}}$', viz: { type: 'triangle', from: 20, to: 70, show: 'tan' } }),
            ] },
            ex: [
              mc('$\\sin\\theta$ es igual a…', ['$\\dfrac{\\text{opuesto}}{\\text{hipotenusa}}$', '$\\dfrac{\\text{adyacente}}{\\text{hipotenusa}}$', '$\\dfrac{\\text{opuesto}}{\\text{adyacente}}$', '$\\dfrac{\\text{hipotenusa}}{\\text{opuesto}}$'], 0, 'SOH: **S**eno = **O**puesto / **H**ipotenusa.'),
              num('Un triángulo rectángulo tiene catetos 3 y 4. ¿Cuánto mide la hipotenusa?', 5, 'Pitágoras: $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.'),
              num('En ese triángulo (3, 4, 5), si $\\theta$ es opuesto al lado 3, ¿cuánto vale $\\sin\\theta$?', 0.6, '$\\sin\\theta = 3 / 5 = 0.6$.'),
              sld('Ajusta $\\theta$ para que $\\tan\\theta = 1$ (opuesto = adyacente)', {
                viz: { type: 'triangle', show: 'tan' }, min: 5, max: 85, step: 5, init: 20,
                readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 45, answerText: '$\\theta = 45^\\circ$',
                explain: 'Si los catetos son iguales el triángulo es isósceles: $\\theta = 45^\\circ$.',
              }),
            ],
          },
          {
            id: 'trig-2', title: 'Ángulos notables',
            clip: { scenes: [
              sc(5, 'Hay ángulos que aparecen en todas partes: 30°, 45° y 60°.', { viz: { type: 'triangle', from: 30, to: 60 } }),
              sc(5, 'Truco: el seno sube como $\\sqrt{1}, \\sqrt{2}, \\sqrt{3}$ sobre 2.', { steps: ['$\\sin 30^\\circ = \\tfrac{1}{2}$', '$\\sin 45^\\circ = \\tfrac{\\sqrt{2}}{2}$', '$\\sin 60^\\circ = \\tfrac{\\sqrt{3}}{2}$'] }),
              sc(5, 'El coseno va al revés:', { steps: ['$\\cos 30^\\circ = \\tfrac{\\sqrt{3}}{2}$', '$\\cos 45^\\circ = \\tfrac{\\sqrt{2}}{2}$', '$\\cos 60^\\circ = \\tfrac{1}{2}$'] }),
              sc(4, 'Con esto calculas alturas y distancias sin calculadora.', { title: '$h = 10 \\tan 45^\\circ = 10$', viz: { type: 'triangle', from: 45, labels: { adj: '10 m', op: 'h' } } }),
            ] },
            ex: [
              mc('$\\sin 30^\\circ = \\;?$', ['$\\tfrac{1}{2}$', '$\\tfrac{\\sqrt{3}}{2}$', '$1$', '$\\tfrac{\\sqrt{2}}{2}$'], 0, 'Es el primero de la tabla: $\\tfrac{\\sqrt{1}}{2} = \\tfrac{1}{2}$.'),
              num('$\\cos 60^\\circ = \\;?$ (en decimal)', 0.5, '$\\cos 60^\\circ = \\tfrac{1}{2} = 0.5$.'),
              mc('$\\tan 45^\\circ = \\;?$', ['$1$', '$0$', '$\\sqrt{3}$', '$\\tfrac{1}{2}$'], 0, '$\\tan 45^\\circ = \\dfrac{\\sin 45^\\circ}{\\cos 45^\\circ} = 1$.'),
              num('Un árbol proyecta una sombra de 10 m cuando el sol está a 45° de elevación. ¿Altura del árbol?', 10, '$h = 10 \\tan 45^\\circ = 10$ m.', { suffix: 'm' }),
            ],
          },
        ],
      },
      {
        title: 'Círculo unitario',
        lessons: [
          {
            id: 'trig-3', title: 'El círculo unitario',
            clip: { scenes: [
              sc(4, 'Un círculo de radio 1 centrado en el origen.', { viz: { type: 'circle', from: 0, to: 30 } }),
              sc(6, 'Gira un ángulo $\\theta$: el punto tiene coordenadas $(\\cos\\theta, \\sin\\theta)$.', { viz: { type: 'circle', from: 30, to: 360 } }),
              sc(5, 'Así el seno y el coseno funcionan para **cualquier** ángulo, no solo agudos.', { viz: { type: 'circle', from: 90, to: 270 } }),
              sc(4, 'Media vuelta son $\\pi$ radianes; una vuelta completa, $2\\pi$.', { title: '$180^\\circ = \\pi \\text{ rad}$', viz: { type: 'circle', from: 0, to: 180 } }),
            ] },
            ex: [
              sld('Gira $\\theta$ hasta que $\\cos\\theta = 0$ y $\\sin\\theta = 1$', {
                viz: { type: 'circle' }, min: 0, max: 360, step: 15, init: 30,
                readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 90, answerText: '$\\theta = 90^\\circ$',
                explain: 'En $90^\\circ$ el punto está arriba: $(0, 1)$.',
              }),
              mc('¿En qué cuadrante $\\sin\\theta > 0$ y $\\cos\\theta < 0$?', ['II', 'I', 'III', 'IV'], 0, 'Arriba ($y > 0$) y a la izquierda ($x < 0$): cuadrante II.'),
              mc('$180^\\circ$ en radianes es…', ['$\\pi$', '$2\\pi$', '$\\tfrac{\\pi}{2}$', '$90$'], 0, '$360^\\circ = 2\\pi$, así que $180^\\circ = \\pi$.'),
              num('$\\sin 270^\\circ = \\;?$', -1, 'En $270^\\circ$ el punto está abajo: $(0, -1)$.'),
            ],
          },
          {
            id: 'trig-4', title: 'Identidad pitagórica',
            clip: { scenes: [
              sc(5, 'En el círculo unitario, coseno y seno forman un triángulo con hipotenusa 1.', { viz: { type: 'circle', from: 20, to: 70 } }),
              sc(5, 'Por Pitágoras, siempre se cumple:', { title: '$\\sin^2\\theta + \\cos^2\\theta = 1$', viz: { type: 'circle', from: 70, to: 160 } }),
              sc(6, 'Si divides todo entre $\\cos^2\\theta$ obtienes otra identidad:', { steps: ['$\\dfrac{\\sin^2\\theta}{\\cos^2\\theta} + 1 = \\dfrac{1}{\\cos^2\\theta}$', '$\\tan^2\\theta + 1 = \\sec^2\\theta$'] }),
            ] },
            ex: [
              mc('$\\sin^2\\theta + \\cos^2\\theta = \\;?$', ['$1$', '$0$', '$\\tan\\theta$', '$2$'], 0, 'Es la identidad pitagórica.'),
              num('Si $\\sin\\theta = 0.6$ y $\\theta$ está en el cuadrante I, ¿cuánto vale $\\cos\\theta$?', 0.8, '$\\cos\\theta = \\sqrt{1 - 0.36} = \\sqrt{0.64} = 0.8$.'),
              mc('$\\tan\\theta$ es igual a…', ['$\\dfrac{\\sin\\theta}{\\cos\\theta}$', '$\\dfrac{\\cos\\theta}{\\sin\\theta}$', '$\\sin\\theta\\cos\\theta$', '$\\dfrac{1}{\\sin\\theta}$'], 0, 'Opuesto/adyacente = (op/hip) ÷ (ady/hip).'),
              ord('Ordena de menor a mayor', ['$\\sin 0^\\circ$', '$\\sin 30^\\circ$', '$\\sin 60^\\circ$', '$\\sin 90^\\circ$'], '$0 < 0.5 < 0.87 < 1$: el seno crece de 0° a 90°.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'calc', level: 'Semestre 1', name: 'Cálculo Diferencial', icon: 'dx', color: '#f472b6',
    tagline: 'Límites y derivadas: cómo cambian las cosas.',
    units: [
      {
        title: 'Límites',
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
        title: 'Derivadas',
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
  },
  {
    id: 'fis', level: 'Semestre 1', name: 'Física Mecánica', icon: 'F', color: '#facc15',
    tagline: 'Movimiento, fuerzas y energía.',
    units: [
      {
        title: 'Cinemática',
        lessons: [
          {
            id: 'fis-1', title: 'MRU y MRUA',
            clip: { scenes: [
              sc(5, '**MRU**: velocidad constante. La posición crece en línea recta.', { title: '$x = x_0 + v\\,t$', viz: { type: 'graph', xr: [0, 5], yr: [0, 22], f: t => 4 * t, draw: true, ax: ['t (s)', 'x (m)'] } }),
              sc(5, '**MRUA**: la velocidad cambia de forma constante. La gráfica es una parábola.', { title: '$x = x_0 + v_0 t + \\tfrac{1}{2} a t^2$', viz: { type: 'graph', xr: [0, 5], yr: [0, 26], f: t => t * t, draw: true, ax: ['t (s)', 'x (m)'] } }),
              sc(5, 'Y la velocidad crece linealmente con el tiempo.', { title: '$v = v_0 + a\\,t$', viz: { type: 'graph', xr: [0, 5], yr: [0, 12], f: t => 2 * t, draw: true, ax: ['t (s)', 'v (m/s)'] } }),
            ] },
            ex: [
              num('Un auto va a 20 m/s constantes. ¿Qué distancia recorre en 5 s?', 100, '$x = v\\,t = 20 \\cdot 5 = 100$ m.', { suffix: 'm' }),
              num('Parte del reposo con $a = 2$ m/s². ¿Velocidad a los 6 s?', 12, '$v = 0 + 2 \\cdot 6 = 12$ m/s.', { suffix: 'm/s' }),
              num('¿Y qué distancia recorrió en esos 6 s?', 36, '$x = \\tfrac{1}{2} \\cdot 2 \\cdot 6^2 = 36$ m.', { suffix: 'm' }),
              mc('En el MRU la aceleración es…', ['Cero', 'Constante y positiva', 'Igual a la velocidad', 'Igual a $g$'], 0, 'Velocidad constante ⇒ no hay aceleración.'),
            ],
          },
          {
            id: 'fis-2', title: 'Tiro parabólico',
            clip: { scenes: [
              sc(6, 'Un proyectil combina **dos movimientos**: MRU en $x$ y caída libre en $y$.', { viz: { type: 'projectile', v0: 20, ang: 50 } }),
              sc(5, 'Cambia el ángulo y cambia el alcance.', { viz: { type: 'projectile', v0: 20, anim: [15, 75] } }),
              sc(5, 'Sin resistencia del aire, el alcance máximo se logra a 45°.', { title: '$R = \\dfrac{v_0^2 \\sin 2\\theta}{g}$', viz: { type: 'projectile', v0: 20, ang: 45 } }),
            ] },
            ex: [
              sld('Ajusta el ángulo de lanzamiento para lograr el **máximo alcance**', {
                viz: { type: 'projectile', v0: 20 }, min: 10, max: 80, step: 5, init: 20,
                readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 45, answerText: '$\\theta = 45^\\circ$',
                explain: '$\\sin 2\\theta$ es máximo cuando $2\\theta = 90^\\circ$.',
              }),
              mc('En el punto más alto de la trayectoria, la velocidad vertical es…', ['Cero', 'Máxima', 'Igual a $v_0$', 'Igual a $g$'], 0, 'Deja de subir y empieza a bajar: $v_y = 0$.'),
              num('Caída libre desde 20 m con $g = 10$ m/s². ¿Tiempo en llegar al suelo?', 2, '$20 = \\tfrac{1}{2} \\cdot 10\\,t^2 \\Rightarrow t = 2$ s.', { suffix: 's' }),
            ],
          },
        ],
      },
      {
        title: 'Dinámica',
        lessons: [
          {
            id: 'fis-3', title: 'Leyes de Newton',
            clip: { scenes: [
              sc(5, '**1ª ley**: sin fuerza neta, un cuerpo mantiene su velocidad.', { title: '$\\sum \\vec F = 0 \\Rightarrow \\vec v = \\text{cte}$', viz: { type: 'push', F: 0 } }),
              sc(5, '**2ª ley**: la fuerza neta produce aceleración.', { title: '$\\sum \\vec F = m\\,\\vec a$', viz: { type: 'push', F: 10, m: 2 } }),
              sc(5, '**3ª ley**: a toda acción corresponde una reacción igual y opuesta.', { viz: { type: 'push', pair: true } }),
            ] },
            ex: [
              num('Una masa de 5 kg acelera a 3 m/s². ¿Fuerza neta?', 15, '$F = m\\,a = 5 \\cdot 3 = 15$ N.', { suffix: 'N' }),
              sld('Ajusta la fuerza para que el bloque de 4 kg acelere a $2$ m/s²', {
                viz: { type: 'push', m: 4 }, min: 0, max: 20, step: 1, init: 2,
                readout: v => `$F = ${v}$ N`, check: v => v === 8, answerText: '$F = 8$ N', explain: '$F = m\\,a = 4 \\cdot 2 = 8$ N.',
              }),
              num('¿Cuánto pesa un objeto de 10 kg? ($g = 9.8$ m/s²)', 98, '$W = m\\,g = 98$ N.', { suffix: 'N' }),
              mc('Si empujas una pared con 50 N, la pared te empuja con…', ['50 N en sentido contrario', '0 N', 'Más de 50 N', 'Menos de 50 N'], 0, 'Tercera ley de Newton.'),
            ],
          },
          {
            id: 'fis-4', title: 'Plano inclinado',
            clip: { scenes: [
              sc(5, 'Un bloque sobre un plano inclinado. ¿Qué fuerzas actúan?', { viz: { type: 'incline', ang: 30 } }),
              sc(6, 'Descompón el peso en una parte paralela y otra perpendicular al plano.', { title: '$mg\\sin\\theta \\quad mg\\cos\\theta$', viz: { type: 'incline', ang: 30, comps: true } }),
              sc(5, 'Más inclinación → más componente que lo hace deslizar.', { viz: { type: 'incline', anim: [15, 55], comps: true } }),
            ] },
            ex: [
              sld('Ajusta $\\theta$ para que la componente paralela sea **la mitad** del peso', {
                viz: { type: 'incline', comps: true }, min: 5, max: 60, step: 5, init: 15,
                readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 30, answerText: '$\\theta = 30^\\circ$',
                explain: '$mg\\sin\\theta = \\tfrac{1}{2} mg \\Rightarrow \\sin\\theta = \\tfrac{1}{2} \\Rightarrow \\theta = 30^\\circ$.',
              }),
              num('Un bloque sin fricción baja por un plano de 30°. ¿Su aceleración? ($g = 10$)', 5, '$a = g \\sin 30^\\circ = 5$ m/s².', { suffix: 'm/s²' }),
              mc('La fuerza normal sobre el bloque vale…', ['$mg\\cos\\theta$', '$mg\\sin\\theta$', '$mg$', '$mg\\tan\\theta$'], 0, 'Equilibra la componente perpendicular del peso.'),
            ],
          },
          {
            id: 'fis-5', title: 'Trabajo y energía',
            clip: { scenes: [
              sc(5, 'La energía del movimiento es la **energía cinética**.', { title: '$E_c = \\tfrac{1}{2} m v^2$', viz: { type: 'graph', xr: [0, 5], yr: [0, 26], f: sq, draw: true, ax: ['v', 'Ec'] } }),
              sc(5, 'La energía por estar a cierta altura es la **potencial gravitatoria**.', { title: '$E_p = m\\,g\\,h$', viz: { type: 'energy' } }),
              sc(6, 'Sin fricción, al caer la potencial se convierte en cinética: la total se conserva.', { title: '$E_c + E_p = \\text{cte}$', viz: { type: 'energy' } }),
            ] },
            ex: [
              num('Energía cinética de una masa de 2 kg a 3 m/s', 9, '$\\tfrac{1}{2} \\cdot 2 \\cdot 3^2 = 9$ J.', { suffix: 'J' }),
              num('Energía potencial de 1 kg a 5 m de altura ($g = 10$)', 50, '$m\\,g\\,h = 1 \\cdot 10 \\cdot 5 = 50$ J.', { suffix: 'J' }),
              num('Un objeto cae desde 5 m ($g = 10$). ¿Con qué velocidad llega al suelo?', 10, '$m g h = \\tfrac{1}{2} m v^2 \\Rightarrow v = \\sqrt{2gh} = 10$ m/s.', { suffix: 'm/s' }),
              mc('Si no hay fricción, al caer la energía potencial…', ['Se convierte en cinética', 'Desaparece', 'Se duplica', 'Permanece igual'], 0, 'Conservación de la energía mecánica.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'int', level: 'Semestre 2', name: 'Cálculo Integral', icon: '∫', color: '#34d399',
    tagline: 'Acumular cambios: áreas e integrales.',
    units: [
      {
        title: 'La integral',
        lessons: [
          {
            id: 'int-1', title: 'Área bajo la curva',
            clip: { scenes: [
              sc(5, '¿Cuál es el área bajo $y = x^2$ entre 0 y 2? Usemos rectángulos.', { viz: { type: 'riemann', f: sq, a: 0, b: 2, n: [4, 4], xr: [-0.3, 2.4], yr: [-0.5, 4.5] } }),
              sc(6, 'Más rectángulos → mejor aproximación.', { viz: { type: 'riemann', f: sq, a: 0, b: 2, n: [4, 80], xr: [-0.3, 2.4], yr: [-0.5, 4.5], exact: '8/3 ≈ 2.667' } }),
              sc(5, 'En el límite, la suma se vuelve una **integral**.', { title: '$\\displaystyle\\int_0^2 x^2\\,dx = \\dfrac{8}{3}$', viz: { type: 'riemann', f: sq, a: 0, b: 2, n: [300, 300], xr: [-0.3, 2.4], yr: [-0.5, 4.5] } }),
            ] },
            ex: [
              num('$\\displaystyle\\int_0^2 2x\\,dx = \\;?$ (pista: es un triángulo)', 4, 'Triángulo de base 2 y altura 4: área $= \\tfrac{1}{2} \\cdot 2 \\cdot 4 = 4$.'),
              mc('Si $n \\to \\infty$, la suma de Riemann…', ['Tiende al área exacta', 'Tiende a cero', 'Siempre diverge', 'No cambia'], 0, 'Esa es justamente la definición de la integral definida.'),
              sld('El área exacta es $\\tfrac{8}{3} \\approx 2.667$. Elige $n$ para que el error sea menor que $0.1$', {
                viz: { type: 'riemann', f: sq, a: 0, b: 2, xr: [-0.3, 2.4], yr: [-0.5, 4.5], exact: '2.667' }, min: 2, max: 60, step: 1, init: 4,
                readout: v => `$n = ${v}$`, check: v => v >= 40, answerText: '$n \\geq 40$',
                explain: 'Con rectángulos izquierdos el error es $\\tfrac{4}{3}\\cdot\\tfrac{3n - 1}{n^2} \\approx \\tfrac{4}{n}$: necesitas $n \\geq 40$.',
              }),
            ],
          },
          {
            id: 'int-2', title: 'Antiderivadas',
            clip: { scenes: [
              sc(5, 'Integrar es el proceso **inverso** de derivar.', { steps: ['$\\dfrac{d}{dx}\\left(\\tfrac{x^3}{3}\\right) = x^2$', '$\\Rightarrow \\displaystyle\\int x^2\\,dx = \\tfrac{x^3}{3} + C$'] }),
              sc(5, 'Regla de la potencia para integrales:', { title: '$\\displaystyle\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C$', steps: ['$\\displaystyle\\int x^4\\,dx = \\tfrac{x^5}{5} + C$'] }),
              sc(6, '**Teorema fundamental**: evalúa la antiderivada en los extremos.', { title: '$\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a)$', steps: ['$\\displaystyle\\int_0^3 x^2\\,dx = \\tfrac{27}{3} - 0 = 9$'] }),
            ] },
            ex: [
              mc('$\\displaystyle\\int x^2\\,dx$', ['$\\tfrac{x^3}{3} + C$', '$2x + C$', '$x^3 + C$', '$\\tfrac{x^2}{2} + C$'], 0, 'Sube el exponente y divide entre el nuevo exponente.'),
              num('$\\displaystyle\\int_0^3 x^2\\,dx = \\;?$', 9, '$\\left[\\tfrac{x^3}{3}\\right]_0^3 = 9$.'),
              mc('$\\displaystyle\\int \\cos x\\,dx$', ['$\\sin x + C$', '$-\\sin x + C$', '$\\cos x + C$', '$-\\cos x + C$'], 0, "Porque $(\\sin x)' = \\cos x$."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'lin', level: 'Semestre 2', name: 'Álgebra Lineal', icon: 'M', color: '#fb923c',
    tagline: 'Vectores y matrices que transforman el espacio.',
    units: [
      {
        title: 'Vectores y matrices',
        lessons: [
          {
            id: 'lin-1', title: 'Vectores',
            clip: { scenes: [
              sc(5, 'Un vector tiene **magnitud** y **dirección**.', { viz: { type: 'vectors', A: [3, 1], only: 'A' } }),
              sc(6, 'Para sumar, pon la cola de uno en la punta del otro.', { title: '$\\vec a + \\vec b$', viz: { type: 'vectors', A: [3, 1], B: [1, 2] } }),
              sc(5, 'La magnitud sale de Pitágoras:', { title: '$|\\vec v| = \\sqrt{v_x^2 + v_y^2}$', viz: { type: 'vectors', A: [3, 4], only: 'A', xr: [-1, 5], yr: [-1, 5] } }),
            ] },
            ex: [
              mc('$(1, 2) + (3, 1) = \\;?$', ['$(4, 3)$', '$(3, 2)$', '$(4, 2)$', '$(2, 3)$'], 0, 'Se suma componente a componente.'),
              num('Magnitud de $\\vec v = (3, 4)$', 5, '$\\sqrt{9 + 16} = 5$.'),
              num('Producto punto $(1, 2) \\cdot (3, 4)$', 11, '$1 \\cdot 3 + 2 \\cdot 4 = 11$.'),
            ],
          },
          {
            id: 'lin-2', title: 'Matrices como transformaciones',
            clip: { scenes: [
              sc(4, 'Una matriz $2 \\times 2$ **transforma** el plano entero.', { viz: { type: 'matrix', M: [[1, 0], [0, 1]] } }),
              sc(5, 'Esta estira el eje $x$ al doble.', { title: '$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$', viz: { type: 'matrix', M: [[2, 0], [0, 1]] } }),
              sc(5, 'Esta gira el plano 90°.', { title: '$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$', viz: { type: 'matrix', M: [[0, -1], [1, 0]] } }),
              sc(5, 'El **determinante** mide cuánto escala las áreas.', { title: '$\\det = ad - bc$', viz: { type: 'matrix', M: [[1, 1], [0, 2]] } }),
            ] },
            ex: [
              mc('¿Qué matriz gira el plano $90^\\circ$ en sentido antihorario?', ['$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$', '$\\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$'], 0, 'Envía $\\hat\\imath \\to (0, 1)$ y $\\hat\\jmath \\to (-1, 0)$.'),
              num('$\\det\\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix} = \\;?$', 5, '$2 \\cdot 3 - 1 \\cdot 1 = 5$.'),
              mc('Si $\\det A = 0$, la transformación…', ['Aplasta el plano a una recta o un punto', 'Rota el plano', 'No cambia nada', 'Duplica las áreas'], 0, 'Las áreas se multiplican por 0: se pierde una dimensión.'),
            ],
          },
        ],
      },
    ],
  },
];
