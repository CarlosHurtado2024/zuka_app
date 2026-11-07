// Curso de Álgebra — sigue las Unidades 1 «Fundamentos de aritmética y números reales»
// (módulos 1.1 a 1.5, como una sola unidad) y 2 «Álgebra fundamental» (módulos 2.1 a 2.6)
// del programa Fundamentos de Matemáticas.

const COURSE_ALGEBRA = {
  id: 'algebra', level: 'Fundamentos', name: 'Álgebra', icon: 'x²', color: '#8b7bff',
  tagline: 'Números reales, proporciones, exponentes, polinomios, factorización y ecuaciones.',
  units: [
    {
      title: 'Fundamentos de aritmética y números reales',
      lessons: [
        {
          id: 'alg-11', title: 'Sistemas numéricos y números reales',
          // Clase 1 en Bunny Stream (video/clase_sistemas_numericos): Parte 1 aquí y Parte 2 en `more`.
          // Las escenas de abajo quedan como guion.
          more: [{ bunny: 'ea51ca0e-db04-4742-b3e1-c97c0dbac9cf', duration: 440, scenes: [] }],
          clip: { bunny: 'ef92b6fe-c9b9-41b1-aede-587ea693199e', duration: 404, scenes: [
            sc(6, 'Los números se fueron ampliando para resolver nuevos problemas: contar, restar, repartir, medir.', { title: '$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$', steps: ['$\\mathbb{N} = \\{1, 2, 3, \\dots\\}$: contar', '$\\mathbb{Z}$: los enteros, con negativos', '$\\mathbb{Q} = \\left\\{\\tfrac{m}{n} : n \\neq 0\\right\\}$: fracciones', '$\\mathbb{I}$: irracionales como $\\sqrt2,\\ \\pi,\\ e$'] }),
            sc(5, 'Todo decimal **periódico** es racional: se puede escribir como fracción.', { steps: ['$0.\\overline{36} = \\dfrac{36}{99} = \\dfrac{4}{11}$', '$0.1\\overline{6} = \\dfrac{16 - 1}{90} = \\dfrac{1}{6}$'] }),
            sc(5, 'Los reales llenan la **recta numérica**. Un conjunto de reales se escribe como intervalo.', { title: '$\\{x : -2 \\leq x < 5\\} = [-2, 5)$', viz: { type: 'numberline', range: [-4, 6], sets: [[-2, 5, true, false]], label: '[−2, 5)' } }),
            sc(5, 'El **valor absoluto** mide distancia: la distancia entre $a$ y $b$ es $|b - a|$.', { steps: ['$|a| = a$ si $a \\geq 0$, y $|a| = -a$ si $a < 0$', '$|3 - \\pi| + |\\pi - 4| = (\\pi - 3) + (4 - \\pi) = 1$'] }),
          ] },
          // Siete minijuegos de p5.js (js/games/*.js): cada uno evalúa una idea de la clase.
          ex: [
            play('cajas-numericas', 'Arrastra cada número a la caja **más pequeña** donde vive', {
              cards: [
                { label: '7', tex: '7', set: 'N' }, { label: '−3', tex: '-3', set: 'Z' }, { label: '0', tex: '0', set: 'Z' },
                { label: '3/4', tex: '\\tfrac34', set: 'Q' }, { label: '0.333…', tex: '0.\\overline{3}', set: 'Q' }, { label: '√49', tex: '\\sqrt{49}', set: 'N' },
                { label: '√2', tex: '\\sqrt2', set: 'I' }, { label: 'π', tex: '\\pi', set: 'I' }, { label: '−8/2', tex: '-\\tfrac82', set: 'Z' },
              ],
            }, 'Cada familia vive dentro de la siguiente: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$. $\\sqrt{49} = 7$ y $-\\tfrac82 = -4$ se simplifican antes de decidir; $\\sqrt2$ y $\\pi$ no son fracciones.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Todo número natural es también entero', truth: true, why: 'ℕ está dentro de ℤ: 7 es natural y también entero.' },
                { text: 'Todo número entero es natural', truth: false, why: '−3 es entero, pero los naturales empiezan en 1.' },
                { text: '0.75 es un número racional', truth: true, why: '0.75 = 3/4, un cociente de enteros.' },
                { text: '√2 se puede escribir como una fracción', truth: false, why: '√2 es irracional: su decimal no termina ni se repite.' },
                { text: 'Todo decimal periódico es racional', truth: true, why: '0.333… = 1/3; siempre hay una fracción detrás.' },
                { text: 'Un número puede ser racional e irracional a la vez', truth: false, why: 'ℚ e 𝕀 no se cruzan: juntos forman ℝ.' },
              ],
            }, 'Las familias están anidadas: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$, así que lo natural también es entero y lo entero también es racional, pero no al revés. Los irracionales ($\\sqrt2$, $\\pi$) no son fracciones, y junto con los racionales llenan la recta real.'),
            play('ubica-en-recta', 'Suelta cada número en su lugar de la recta', {
              min: -3, max: 4, tol: 0.15,
              points: [
                { label: '−3/2', tex: '-\\tfrac32', value: -1.5 }, { label: '3/4', tex: '\\tfrac34', value: 0.75 },
                { label: '√2', tex: '\\sqrt2', value: 1.4142 }, { label: 'π', tex: '\\pi', value: 3.1416 }, { label: '−√4', tex: '-\\sqrt4', value: -2 },
              ],
            }, 'Los reales llenan la recta: $-\\tfrac32 = -1.5$, $\\tfrac34 = 0.75$, $\\sqrt2 \\approx 1.41$, $\\pi \\approx 3.14$ y $-\\sqrt4 = -2$.'),
            play('pizzeria', 'Sirve cada pedido: corta la pizza y marca las porciones que pide', {
              maxSlices: 12,
              orders: [
                { label: '0.75', num: 3, den: 4 },
                { label: '0.333…', num: 1, den: 3 },
                { label: '40 %', num: 2, den: 5 },
                { label: 'la mitad', num: 1, den: 2 },
              ],
            }, 'La misma cantidad se puede escribir como fracción, decimal, porcentaje o con palabras: $0.75 = \\tfrac34 = \\tfrac68$, $0.\\overline{3} = \\tfrac13 = \\tfrac{4}{12}$, $40\\,\\% = \\tfrac25$ y la mitad es $\\tfrac12$. Cortar en más porciones no cambia cuánto es: son fracciones **equivalentes**.'),
            play('reglas-del-juego', 'Pon a cada igualdad el nombre de la propiedad que usa', {
              rules: ['Conmutativa', 'Asociativa', 'Distributiva', 'Neutro', 'Inverso'],
              items: [
                { label: 'a + b = b + a', tex: 'a + b = b + a', rule: 'Conmutativa' }, { label: '(ab)c = a(bc)', tex: '(ab)c = a(bc)', rule: 'Asociativa' },
                { label: 'a(b + c) = ab + ac', tex: 'a(b + c) = ab + ac', rule: 'Distributiva' }, { label: 'a + 0 = a', tex: 'a + 0 = a', rule: 'Neutro' },
                { label: 'a + (−a) = 0', tex: 'a + (-a) = 0', rule: 'Inverso' },
              ],
            }, 'Son las reglas del juego de los reales: el orden no importa (conmutativa), la agrupación no importa (asociativa), el producto se reparte sobre la suma (distributiva), el 0 no cambia nada (neutro) y cada número tiene su opuesto (inverso).'),
            play('dibuja-intervalo', 'Dibuja en la recta el conjunto indicado', { min: -5, max: 7, a: -2, b: 5, aClosed: true, bClosed: false, set: '{x : −2 ≤ x < 5}' },
              '$\\{x : -2 \\leq x < 5\\} = [-2, 5)$: el $-2$ entra (punto lleno, corchete) y el $5$ no (punto vacío, paréntesis).'),
            play('distancia-justa', 'Coloca $b$ a la distancia justa de $a$', { min: -10, max: 6, a: -3, d: 5 },
              '$|b - a|$ es la distancia entre $a$ y $b$. Desde $-3$, a 5 unidades hay dos puntos: $-3 + 5 = 2$ y $-3 - 5 = -8$.'),
          ],
        },
        {
          id: 'alg-12', title: 'Razones, proporciones y regla de tres',
          // Clase 2 en Bunny Stream (video/clase_razones_proporciones); las escenas quedan como guion.
          // Parte 2 (video/clase_regla_de_tres): se muestra tras los primeros siete ejercicios.
          more: [{ bunny: '1cda8e9b-5fff-4633-a543-de4105860b3d', duration: 263, after: 7, scenes: [] }],
          clip: { bunny: '4c098c45-1ab3-4f66-942a-3764b2da832a', duration: 289, scenes: [
            sc(5, 'Una **razón** compara dos cantidades por cociente. Una **proporción** es la igualdad de dos razones.', { title: '$\\dfrac{a}{b} = \\dfrac{c}{d} \\iff ad = bc$', steps: ['$\\dfrac{3}{5} = \\dfrac{12}{20}$ porque $3 \\cdot 20 = 5 \\cdot 12$'] }),
            sc(5, '**Directamente proporcionales**: si una se duplica, la otra también. Su gráfica es una recta por el origen.', { title: '$y = kx$', viz: { type: 'graph', xr: [0, 6], yr: [0, 9], f: (x, k) => k * x, anim: [0.5, 1.5], label: k => `k = ${fmt(k)}` } }),
            sc(5, '**Inversamente proporcionales**: si una se duplica, la otra se reduce a la mitad. Su producto es constante.', { title: '$xy = k$', viz: { type: 'graph', xr: [0, 8], yr: [0, 8], f: x => 6 / x, draw: true, points: [[2, 3, '(2, 3)'], [3, 2, '(3, 2)']] } }),
            sc(5, '**Reparto proporcional**: suma las partes y reparte el total en esa razón.', { steps: ['Repartir $1\\,200\\,000$ en partes proporcionales a $2, 3, 5$', '$2 + 3 + 5 = 10$, cada parte vale $120\\,000$', '$240\\,000,\\ 360\\,000,\\ 600\\,000$'] }),
          ] },
          // Siete minijuegos de p5.js (js/games/*.js) basados en el texto guía §1.1 (razón, proporción,
          // magnitudes directa e inversamente proporcionales, reparto y media proporcional).
          ex: [
            play('limonada', 'Prepara una jarra grande que sepa **igual** que el modelo', { base: [2, 3], minLemons: 4, maxEach: 12 },
              'Una **razón** compara dos cantidades por cociente: $2 : 3$ limones por vasos. Toda mezcla con la misma razón ($4 : 6$, $6 : 9$, …) sabe igual: son razones **equivalentes**.'),
            play('balanza-proporcion', 'Encuentra $x$ para que la balanza quede en equilibrio', { a: 3, b: 5, d: 20, min: 0, max: 30 },
              'Una **proporción** es la igualdad de dos razones: $\\dfrac{a}{b} = \\dfrac{c}{d}$ si y solo si $ad = bc$. Aquí $3 \\cdot 20 = 5x$, así que $x = 12$.'),
            play('directa-inversa', 'Clasifica cada situación: ¿directa, inversa o ninguna?', {
              items: [
                { text: 'Distancia y tiempo a velocidad fija', kind: 'directa' },
                { text: 'Obreros y días para una obra', kind: 'inversa' },
                { text: 'Velocidad y tiempo de un trayecto', kind: 'inversa' },
                { text: 'Precio y cantidad del mismo producto', kind: 'directa' },
                { text: 'Salario y horas a tarifa fija', kind: 'directa' },
                { text: 'Lado y área de un cuadrado', kind: 'ninguna' },
              ],
            }, '**Directa**: el cociente $y/x$ es constante (al duplicar una, se duplica la otra). **Inversa**: el producto $xy$ es constante (al duplicar una, la otra se reduce a la mitad). El área de un cuadrado es $l^2$: al duplicar el lado el área se cuadruplica, así que no es ninguna de las dos.'),
            play('grafica-relacion', 'Mueve los puntos para que la relación sea **directa**', { kind: 'directa', k: 1.5, given: [[2, 3]], xs: [4, 6, 8], tol: 0.25, xmax: 10, ymax: 14 },
              'En una relación directa $y = kx$: con $(2, 3)$ la constante es $k = \\tfrac32 = 1.5$, y los puntos quedan sobre la recta que pasa por el origen: $(4, 6)$, $(6, 9)$, $(8, 12)$.'),
            play('grafica-relacion', 'Mueve los puntos para que la relación sea **inversa**', { kind: 'inversa', k: 12, given: [[2, 6]], xs: [3, 4, 6], tol: 0.25, xmax: 8, ymax: 8 },
              'En una relación inversa $xy = k$: con $(2, 6)$ la constante es $k = 12$, y los puntos quedan sobre la curva $y = \\tfrac{12}{x}$: $(3, 4)$, $(4, 3)$, $(6, 2)$.'),
            play('reparto', 'Reparte 1.200.000 en partes proporcionales a 2, 3 y 5', { total: 1200000, parts: [2, 3, 5], tol: 0.02 },
              '**Reparto proporcional**: $2 + 3 + 5 = 10$ partes, cada una vale $1\\,200\\,000 \\div 10 = 120\\,000$. Las partes son $240\\,000$, $360\\,000$ y $600\\,000$.'),
            play('cuadrado-media', 'Encuentra el lado del cuadrado con la misma área que el rectángulo $4 \\times 25$', { w: 4, h: 25, tol: 0.2 },
              'La **media proporcional** entre 4 y 25 es el $x$ con $\\dfrac{4}{x} = \\dfrac{x}{25}$: $x^2 = 100$, $x = 10$. Geométricamente, es el lado del cuadrado con la misma área que el rectángulo $4 \\times 25$.'),
            // --- Parte 2: regla de tres (el video 2 de `more` se muestra antes de estos cinco).
            play('arma-regla', 'Arma la regla de tres de cada problema', {
              problems: [
                { text: 'Un ciclista recorre 150 km en 5 horas. ¿Cuántos km recorre en 7 horas?', kind: 'directa',
                  chips: [{ label: '150 km', mag: 0, row: 0 }, { label: '5 h', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '7 h', mag: 1, row: 1 }] },
                { text: '12 obreros terminan una obra en 30 días. ¿Cuántos obreros la terminan en 24 días?', kind: 'inversa',
                  chips: [{ label: '12 obreros', mag: 0, row: 0 }, { label: '30 días', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '24 días', mag: 1, row: 1 }] },
              ],
            }, 'La **regla de tres** busca el cuarto término de una proporción. Cada columna lleva una magnitud y cada fila una situación. Si al crecer una magnitud la otra también crece, es **directa** (flechas paralelas): $\\dfrac{150}{x} = \\dfrac{5}{7}$. Si una crece y la otra baja, es **inversa** (flechas cruzadas): $\\dfrac{12}{x} = \\dfrac{24}{30}$.'),
            play('bascula', 'Fija el precio de 5 kg de manzanas', { knownKg: 3, knownPrice: 12000, askKg: 5, max: 40000, step: 500, tol: 200 },
              'Kilos y precio son directamente proporcionales: $\\dfrac{3}{5} = \\dfrac{12\\,000}{x}$, así que $x = \\dfrac{12\\,000 \\cdot 5}{3} = 20\\,000$. Cada kilo cuesta 4.000.'),
            play('la-obra', 'Deja en la obra los obreros justos para terminar en 24 días', { workers: 12, days: 30, askDays: 24, max: 40 },
              'Obreros y días son inversamente proporcionales: el producto se conserva. $12 \\cdot 30 = 360 = x \\cdot 24$, así que $x = 15$. Más obreros, menos días.'),
            play('directa-inversa', 'Regla de tres: ¿directa, inversa o ninguna?', {
              items: [
                { text: 'Máquinas y horas para un pedido', kind: 'inversa' },
                { text: 'Grifos iguales y tiempo de llenado', kind: 'inversa' },
                { text: 'Kilos y precio del mismo producto', kind: 'directa' },
                { text: 'Velocidad y tiempo del mismo trayecto', kind: 'inversa' },
                { text: 'Fotocopias y costo', kind: 'directa' },
                { text: 'Lado y perímetro de un cuadrado', kind: 'directa' },
              ],
            }, 'Antes de armar la regla, pregunta: si esta magnitud sube, ¿la otra sube o baja? Sube con ella → **directa** (kilos–precio, fotocopias–costo, lado–perímetro: $P = 4l$). Baja → **inversa** (más máquinas o grifos, menos tiempo; más velocidad, menos tiempo).'),
            play('cadena-razones', 'Voltea las razones que haga falta para que la cadena dé los días', { base: 28, unit: 'días', factors: [{ label: 'hombres', a: 9, b: 7, inverse: true }, { label: 'horas/día', a: 6, b: 8, inverse: true }], answer: 27 },
              'En la **regla de tres compuesta** cada magnitud aporta una razón: si es inversa, la razón va al revés del cambio. Menos hombres (de 9 a 7) → más días: $\\tfrac{9}{7}$. Más horas por día (de 6 a 8) → menos días: $\\tfrac{6}{8}$. $x = 28 \\cdot \\tfrac{9}{7} \\cdot \\tfrac{6}{8} = 27$ días.'),
          ],
        },
        {
          id: 'alg-13', title: 'Porcentajes y descuentos',
          // Parte 1 «Porcentajes» (Bunny, 3:44).
          clip: { bunny: '59348bd7-b5b5-4c29-bf79-31a54b439a1b', duration: 224, scenes: [] },
          // Parte 2 «Aumentos y descuentos» (Bunny, 2:11), después del sexto ejercicio.
          more: [{ bunny: '3b666757-462f-4ccf-8f95-a8c816e33141', duration: 131, after: 6, scenes: [] }],
          ex: [
            // --- Parte 1: porcentajes ---
            play('cuadricula-cien', 'Pinta en la cuadrícula el porcentaje que pide cada ronda', { rounds: [{ ask: '35 %', count: 35 }, { ask: '3/4', count: 75 }, { ask: '0.08', count: 8 }] },
              'Por ciento es «de cada 100»: $35\\%$ son 35 casillas de 100. Las fracciones y los decimales se pasan a centésimas: $\\tfrac34 = \\tfrac{75}{100} = 75\\%$ y $0.08 = \\tfrac{8}{100} = 8\\%$.'),
            play('cruz-porcentaje', 'Arma la cruz del porcentaje de cada problema', {
              problems: [
                { text: 'Halla el 12 % de 8.000 pesos', chips: [{ label: '12', cell: 'p' }, { label: '8.000', cell: 'C' }, { label: '?', cell: 'B' }] },
                { text: '¿De qué número es 48 el 8 %?', chips: [{ label: '8', cell: 'p' }, { label: '48', cell: 'B' }, { label: '?', cell: 'C' }] },
                { text: '¿De qué número es 408 el 70 % más?', chips: [{ label: '170', cell: 'p' }, { label: '408', cell: 'B' }, { label: '?', cell: 'C' }, { label: '70', cell: null }] },
              ],
            }, 'La cruz es la regla de tres $\\dfrac{100}{C} = \\dfrac{p}{B}$: $p$ es el porcentaje, $C$ el total y $B$ la parte. «El 70 % más» de un número es su $170\\%$, así que $p = 170$ y $C = \\dfrac{100 \\cdot 408}{170} = 240$.'),
            play('mezcla', 'Añade agua hasta que el alcohol sea el 20 % de la mezcla', { solute: 40, target: 20, step: 10, max: 400 },
              'Los 40 g de alcohol son el $20\\%$ de la mezcla, así que la mezcla pesa $C = \\dfrac{100 \\cdot 40}{20} = 200$ g; el agua es lo que falta: $200 - 40 = 160$ g.'),
            play('rueda-porcentaje', 'Gira la aguja hasta cubrir la parte pedida y lee el porcentaje', { rounds: [{ part: 51, whole: 170 }, { part: 63, whole: 180 }, { part: 26.4, whole: 240 }], tol: 1 },
              'Qué porcentaje es $B$ de $C$: $p = \\dfrac{100 \\cdot B}{C}$. Así, $\\dfrac{100 \\cdot 51}{170} = 30\\%$, $\\dfrac{100 \\cdot 63}{180} = 35\\%$ y $\\dfrac{100 \\cdot 26.4}{240} = 11\\%$.'),
            play('bodegas', 'Reparte los 2.000 sacos para que, tras el viaje del 20 %, queden iguales', { total: 2000, move: 20, step: 50 },
              'Si en A hay $x$ sacos, en B hay $2\\,000 - x$. Tras llevar el $20\\%$ de A: $0.8x = 2\\,000 - x + 0.2x$, es decir $1.6x = 2\\,000$ y $x = 1\\,250$. Había 1.250 sacos en A y 750 en B.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'El 70 % más de un número es el 170 % de ese número', truth: true, why: '100 % + 70 % = 170 %: 408 es el 170 % de 240.' },
                { text: 'El 9 % menos de un número es el 9 % de ese número', truth: false, why: 'Es el 91 %: 100 % − 9 %.' },
                { text: 'El 12 % de 8.000 es 96', truth: false, why: '12 · 8.000 / 100 = 960.' },
                { text: 'El 25 % de una cantidad es su cuarta parte', truth: true, why: '25/100 = 1/4.' },
                { text: '51 de 170 es el 30 %', truth: true, why: '100 · 51 / 170 = 30.' },
              ],
            }, 'Porcentaje es una razón con denominador 100: $25\\% = \\tfrac14$ y $12\\%$ de 8.000 es $\\dfrac{12 \\cdot 8\\,000}{100} = 960$. «El $p\\%$ más» es el $(100 + p)\\%$ y «el $p\\%$ menos» es el $(100 - p)\\%$.'),
            // --- Parte 2: aumentos y descuentos ---
            play('une-factor', 'Une cada cambio con el factor por el que multiplica', { changes: [25, -25, 100, -5, 0.5], factors: [1.25, 0.75, 2, 0.95, 1.005, 1.5] },
              'Aumentar un $r\\%$ es multiplicar por $1 + \\tfrac{r}{100}$ y descontar, por $1 - \\tfrac{r}{100}$: $+25\\% \\Rightarrow \\times 1.25$, $-25\\% \\Rightarrow \\times 0.75$, $+100\\% \\Rightarrow \\times 2$ (el doble), $-5\\% \\Rightarrow \\times 0.95$ y $+0.5\\% \\Rightarrow \\times 1.005$, no $1.5$.'),
            play('etiqueta-rebaja', 'Pega en cada etiqueta el sticker del precio final', {
              items: [{ name: 'Tenis', price: 45000, change: -20 }, { name: 'Audífonos', price: 80000, change: -15 }, { name: 'Bicicleta', price: 60000, change: 30 }],
              stickers: [36000, 9000, 68000, 12000, 78000, 42000],
            }, 'El precio final es el precio de lista por el factor: $45\\,000 \\cdot 0.8 = 36\\,000$ (9.000 es el descuento, no el precio), $80\\,000 \\cdot 0.85 = 68\\,000$ y, como la bicicleta **sube** $30\\%$, $60\\,000 \\cdot 1.3 = 78\\,000$.'),
            play('cascada', 'Pega los dos descuentos y fija el descuento único equivalente', { price: 100000, changes: [-30, -20], step: 1 },
              'Cada descuento multiplica el precio: $100\\,000 \\cdot 0.7 = 70\\,000$ y $70\\,000 \\cdot 0.8 = 56\\,000$. El factor total es $0.7 \\cdot 0.8 = 0.56$, así que el descuento único es $1 - 0.56 = 44\\%$, no $50\\%$. El orden no importa.'),
            play('mejor-oferta', 'Lleva el carrito a la tienda donde el producto sale más barato', {
              rounds: [
                { price: 100000, a: { label: '30 % y luego 20 % de descuento', changes: [-30, -20] }, b: { label: '45 % de descuento de una vez', changes: [-45] } },
                { price: 80000, a: { label: 'Sube 20 % y luego baja 20 %', changes: [20, -20] }, b: { label: 'Precio de lista', changes: [] } },
                { price: 50000, a: { label: '10 % de descuento', changes: [-10] }, b: { label: '6.000 de rebaja', off: 6000 } },
              ],
            }, 'Se comparan los precios finales. Ronda 1: $0.7 \\cdot 0.8 = 0.56$ ($56\\,000$) contra $0.55$ ($55\\,000$): gana el 45 %. Ronda 2: $1.2 \\cdot 0.8 = 0.96$: subir y bajar el mismo porcentaje deja el precio en $76\\,800$, más barato que la lista. Ronda 3: el $10\\%$ de $50\\,000$ son $5\\,000$, menos que la rebaja fija de $6\\,000$.'),
            play('rebote', 'Sube el precio rebajado hasta volver exactamente al original', { base: 100, drop: 10, max: 30, step: 0.1, tol: 0.06 },
              'Tras rebajar $10\\%$ el precio queda en 90. Para volver a 100 hay que subir 10 sobre 90: $\\dfrac{10}{90} = 11.1\\%$. La subida se calcula sobre el precio rebajado, por eso no basta con $10\\%$.'),
            play('dos-etapas', 'Gira la perilla hasta que la máquina produzca 8.840', { changes: [30, -20], output: 8840, max: 20000, step: 20 },
              'Subir $30\\%$ es $\\times 1.3$ y bajar $20\\%$ es $\\times 0.8$: en total $\\times 1.04$. Entonces $1.04x = 8\\,840$ y $x = 8\\,500$.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Dos aumentos sucesivos del 10 % equivalen a un aumento del 20 %', truth: false, why: '1.1 · 1.1 = 1.21: es un 21 %.' },
                { text: 'Un descuento del 25 % es lo mismo que multiplicar el precio por 0.75', truth: true, why: '100 % − 25 % = 75 % = 0.75.' },
                { text: 'Dos descuentos del 50 % dejan el producto gratis', truth: false, why: '0.5 · 0.5 = 0.25: queda el 25 % del precio.' },
                { text: 'Subir un precio 50 % y luego bajarlo 50 % lo deja en el 75 % del original', truth: true, why: '1.5 · 0.5 = 0.75.' },
                { text: 'Rebajar 10 % y luego subir 10 % devuelve el precio original', truth: false, why: '0.9 · 1.1 = 0.99: queda en el 99 %.' },
              ],
            }, 'Los cambios sucesivos se multiplican: $1.1 \\cdot 1.1 = 1.21$, $0.9 \\cdot 1.1 = 0.99$ y $1.5 \\cdot 0.5 = 0.75$. Descontar el $p\\%$ es multiplicar por $1 - \\tfrac{p}{100}$, nunca restar $p$.'),
          ],
        },
        {
          id: 'alg-14', title: 'Progresiones aritméticas y geométricas',
          clip: { scenes: [
            sc(5, 'En una progresión **aritmética** se suma siempre la misma diferencia $d$.', { title: '$a_n = a_1 + (n - 1)d$', viz: { type: 'graph', xr: [0, 7], yr: [0, 32], f: () => NaN, points: [[1, 7, '7'], [2, 11, '11'], [3, 15, '15'], [4, 19, '19'], [5, 23, '23'], [6, 27, '27']] } }),
            sc(6, 'Gauss sumó del 1 al 100 emparejando extremos: cada pareja suma lo mismo.', { title: '$S_n = \\dfrac{n}{2}(a_1 + a_n)$', steps: ['$1 + 100 = 2 + 99 = \\dots = 101$', '$S_{100} = 50 \\cdot 101 = 5050$'] }),
            sc(5, 'En una progresión **geométrica** se multiplica siempre por la misma razón $r$.', { title: '$a_n = a_1 r^{n-1}$', viz: { type: 'graph', xr: [0, 6], yr: [0, 50], f: () => NaN, points: [[1, 3, '3'], [2, 6, '6'], [3, 12, '12'], [4, 24, '24'], [5, 48, '48']] } }),
            sc(5, 'Si $|r| < 1$, la suma infinita converge:', { title: '$S_\\infty = \\dfrac{a_1}{1 - r}$', steps: ['$6 + 2 + \\tfrac23 + \\tfrac29 + \\cdots = \\dfrac{6}{1 - \\frac13} = 9$'] }),
          ] },
          ex: [
            num('Término 20 de la progresión aritmética $7, 11, 15, \\dots$', 83, '$a_{20} = 7 + 19 \\cdot 4 = 83$.'),
            num('Suma de los primeros 20 términos de esa progresión', 900, '$S_{20} = \\tfrac{20}{2}(7 + 83) = 900$.'),
            num('En una progresión aritmética $a_4 = 10$ y $a_{11} = 31$. ¿Cuánto vale $d$?', 3, '$7d = 31 - 10 = 21 \\Rightarrow d = 3$ (y $a_1 = 1$).', { prefix: '$d =$' }),
            mc('Tres medios geométricos entre 3 y 48', ['$6, 12, 24$', '$9, 18, 36$', '$14.25, 25.5, 36.75$', '$6, 18, 36$'], 0, '$3r^4 = 48 \\Rightarrow r = 2$.'),
            num('Una pelota cae desde 8 m y en cada rebote sube $\\tfrac34$ de la altura anterior. ¿Qué distancia total recorre?', 56, 'Baja 8 m y luego sube y baja $2 \\cdot \\dfrac{6}{1 - \\frac34} = 48$ m: total 56 m.', { suffix: 'm' }),
          ],
        },
        {
          id: 'alg-15', title: 'Sumatoria y productoria',
          clip: { scenes: [
            sc(5, 'La letra griega $\\Sigma$ abrevia sumas largas: índice, límites y término general.', { title: '$\\displaystyle\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$', steps: ['$\\displaystyle\\sum_{k=1}^{4} k^2 = 1 + 4 + 9 + 16 = 30$'] }),
            sc(5, 'Es **lineal**: las constantes salen y las sumas se separan.', { steps: ['$\\displaystyle\\sum (c\\,a_k + b_k) = c\\sum a_k + \\sum b_k$', '$\\displaystyle\\sum_{k=1}^{n} c = nc$'] }),
            sc(5, 'Sumas notables que vas a usar mucho:', { steps: ['$\\displaystyle\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2}$', '$\\displaystyle\\sum_{k=1}^{n} k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}$'] }),
            sc(5, '$\\Pi$ abrevia productos. El más famoso es el **factorial**.', { title: '$\\displaystyle\\prod_{k=1}^{n} k = n!$', steps: ['$5! = 1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5 = 120$'] }),
          ] },
          ex: [
            num('Calcula $\\displaystyle\\sum_{k=1}^{20} (3k - 2)$', 590, '$3 \\cdot \\tfrac{20 \\cdot 21}{2} - 2 \\cdot 20 = 630 - 40 = 590$.'),
            num('Calcula $\\displaystyle\\sum_{k=1}^{10} k(k + 1)$', 440, '$\\sum k^2 + \\sum k = 385 + 55 = 440$.'),
            mc('Escribe en notación sigma: $\\tfrac12 + \\tfrac23 + \\tfrac34 + \\cdots + \\tfrac{15}{16}$', ['$\\displaystyle\\sum_{k=1}^{15} \\dfrac{k}{k + 1}$', '$\\displaystyle\\sum_{k=1}^{16} \\dfrac{k}{k + 1}$', '$\\displaystyle\\sum_{k=2}^{16} \\dfrac{1}{k}$', '$\\displaystyle\\sum_{k=1}^{15} \\dfrac{k + 1}{k}$'], 0, 'El numerador va de 1 a 15 y el denominador es uno más.'),
            mc('Evalúa $\\displaystyle\\prod_{k=2}^{n} \\left(1 - \\dfrac{1}{k}\\right)$', ['$\\dfrac{1}{n}$', '$\\dfrac{n - 1}{n}$', '$n!$', '$0$'], 0, 'Es telescópico: $\\tfrac12 \\cdot \\tfrac23 \\cdot \\tfrac34 \\cdots \\tfrac{n - 1}{n} = \\tfrac1n$.'),
            num('$5! = \\;?$', 120, '$1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5 = 120$.'),
          ],
        },
      ],
    },
    {
      title: 'Potenciación y leyes de los exponentes',
      lessons: [
        {
          id: 'alg-21a', title: 'Potencias y exponentes',
          clip: { scenes: [
            sc(4, 'Una potencia es una multiplicación repetida: la **base** se multiplica tantas veces como dice el **exponente**.', { title: '$a^n = \\underbrace{a \\cdot a \\cdots a}_{n \\text{ veces}}$', steps: ['$2^3 = 2 \\cdot 2 \\cdot 2 = 8$'] }),
            sc(5, 'Cada vez que el exponente sube en 1, el resultado se multiplica por la base.', { title: '$y = 2^x$', viz: { type: 'graph', xr: [-3, 4.5], yr: [-1, 17], f: x => 2 ** x, draw: true, points: [[0, 1, '2⁰ = 1'], [3, 8, '2³ = 8']] } }),
            sc(5, '¡Cuidado con el signo! El exponente solo afecta a lo que toca.', { steps: ['$-2^4 = -(2^4) = -16$', '$(-2)^4 = 16$', '$(-2)^3 = -8$'] }),
            sc(5, 'El exponente cero y los negativos siguen el mismo patrón: dividir entre la base.', { steps: ['$a^0 = 1 \\quad (a \\neq 0)$', '$a^{-n} = \\dfrac{1}{a^n}$', '$2^{-3} = \\dfrac{1}{8}$'] }),
          ] },
          ex: [
            num('Calcula $-2^4$', -16, 'El exponente solo afecta al 2: $-(2^4) = -16$.'),
            num('Calcula $(-2)^3$', -8, 'Base negativa con exponente impar: el resultado es negativo.'),
            mc('$5^0 = \\;?$', ['$1$', '$0$', '$5$', 'No está definido'], 0, 'Toda base distinta de cero elevada a la 0 vale 1.'),
            num('Calcula $2^{-3}$ (puedes escribir una fracción)', 0.125, '$2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$.', { answerText: '$\\tfrac{1}{8}$' }),
            mc('$-(-2)^3 = \\;?$', ['$8$', '$-8$', '$6$', '$-6$'], 0, '$(-2)^3 = -8$, y su opuesto es $8$.'),
          ],
        },
        {
          id: 'alg-21b', title: 'Leyes de los exponentes',
          clip: { scenes: [
            sc(5, 'Al multiplicar potencias de igual base, **se suman** los exponentes; al dividir, **se restan**.', { steps: ['$a^m \\cdot a^n = a^{m+n}$', '$\\dfrac{a^m}{a^n} = a^{m-n}$'] }),
            sc(5, 'Potencia de una potencia: **se multiplican** los exponentes.', { steps: ['$(a^m)^n = a^{mn}$', '$(ab)^n = a^n b^n$', '$\\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^{n}$'] }),
            sc(5, 'Con estas leyes simplificas expresiones con exponentes literales:', { steps: ['$\\dfrac{3^{n+2} - 3^n}{8 \\cdot 3^n}$', '$= \\dfrac{3^n (3^2 - 1)}{8 \\cdot 3^n}$', '$= \\dfrac{8}{8} = 1$'] }),
            sc(4, 'La **notación científica** usa potencias de 10 para números muy grandes o muy pequeños.', { steps: ['$300\\,000\\,000 = 3 \\times 10^8$', '$0.00042 = 4.2 \\times 10^{-4}$'] }),
          ] },
          ex: [
            mc('$x^3 \\cdot x^5 = \\;?$', ['$x^8$', '$x^{15}$', '$x^2$', '$2x^8$'], 0, 'Misma base: se suman los exponentes, $3 + 5 = 8$.'),
            mc('$(x^2)^3 = \\;?$', ['$x^6$', '$x^5$', '$x^8$', '$x^9$'], 0, 'Potencia de potencia: $2 \\cdot 3 = 6$.'),
            mc('Escribe sin exponentes negativos: $(2x^3y^{-2})^{-2}$', ['$\\dfrac{y^4}{4x^6}$', '$\\dfrac{4x^6}{y^4}$', '$-4x^6y^4$', '$\\dfrac{y^4}{2x^6}$'], 0, '$2^{-2}x^{-6}y^{4} = \\dfrac{y^4}{4x^6}$.'),
            mc('Simplifica $\\dfrac{2^x \\cdot 4^{x+1}}{8^x}$', ['$4$', '$2^x$', '$8$', '$4^x$'], 0, '$\\dfrac{2^x \\cdot 2^{2x+2}}{2^{3x}} = 2^{x + 2x + 2 - 3x} = 2^2 = 4$.'),
            num('¿Cuánto es $3.2 \\times 10^4$?', 32000, 'Mueve la coma 4 lugares a la derecha.'),
            ord('Ordena de menor a mayor', ['$2^{-2}$', '$2^{0}$', '$2^{1}$', '$2^{3}$'], '$\\tfrac14 < 1 < 2 < 8$.'),
          ],
        },
      ],
    },
    {
      title: 'Radicación y exponentes racionales',
      lessons: [
        {
          id: 'alg-22a', title: 'Raíces y exponentes racionales',
          clip: { scenes: [
            sc(5, 'La raíz $n$-ésima deshace la potencia: $\\sqrt[n]{a} = b$ significa $b^n = a$.', { steps: ['$\\sqrt{49} = 7$', '$\\sqrt[3]{-8} = -2$', '$\\sqrt{-4}$ no es un número real'] }),
            sc(5, 'Un exponente fraccionario es una raíz: el denominador es el índice.', { title: '$a^{m/n} = \\sqrt[n]{a^m} = \\left(\\sqrt[n]{a}\\right)^m$', steps: ['$8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2 = 4$'] }),
            sc(5, 'Ojo: la raíz cuadrada de un cuadrado es el **valor absoluto**.', { title: '$\\sqrt{x^2} = |x|$', viz: { type: 'graph', xr: [-4, 4], yr: [-1, 4.5], f: x => Math.abs(x), draw: true } }),
            sc(4, 'Y la raíz **no** se reparte en una suma:', { steps: ['$\\sqrt{9 + 16} = \\sqrt{25} = 5$', '$\\sqrt{9} + \\sqrt{16} = 7$', '$\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}$'] }),
          ] },
          ex: [
            num('Calcula $8^{2/3}$', 4, '$\\left(\\sqrt[3]{8}\\right)^2 = 2^2 = 4$.'),
            num('Calcula $\\left(\\dfrac{27}{125}\\right)^{-1/3}$ (puedes escribir una fracción)', 5 / 3, 'Invierte y saca raíz cúbica: $\\left(\\tfrac{125}{27}\\right)^{1/3} = \\tfrac{5}{3}$.', { tol: 0.01, answerText: '$\\tfrac{5}{3}$' }),
            mc('$\\sqrt{x^2} = \\;?$', ['$|x|$', '$x$', '$-x$', '$\\pm x$'], 0, 'Si $x = -3$: $\\sqrt{9} = 3 = |-3|$.'),
            mc('¿Es cierto que $\\sqrt{a + b} = \\sqrt{a} + \\sqrt{b}$?', ['No, en general es falso', 'Sí, siempre', 'Solo si $a$ y $b$ son negativos', 'Solo para raíces cúbicas'], 0, 'Contraejemplo: $\\sqrt{9 + 16} = 5$ pero $3 + 4 = 7$.'),
          ],
        },
        {
          id: 'alg-22b', title: 'Simplificar y racionalizar',
          clip: { scenes: [
            sc(5, 'Para simplificar un radical, extrae los factores que son potencias exactas.', { steps: ['$\\sqrt{72} = \\sqrt{36 \\cdot 2}$', '$= 6\\sqrt{2}$'] }),
            sc(5, 'Solo se suman radicales **semejantes** (mismo índice y mismo radicando).', { steps: ['$\\sqrt{72} + 3\\sqrt{50} - \\sqrt{18}$', '$= 6\\sqrt2 + 15\\sqrt2 - 3\\sqrt2$', '$= 18\\sqrt2$'] }),
            sc(6, '**Racionalizar** es quitar la raíz del denominador. Con un binomio, multiplica por el **conjugado**.', { steps: ['$\\dfrac{6}{\\sqrt5 - \\sqrt2} \\cdot \\dfrac{\\sqrt5 + \\sqrt2}{\\sqrt5 + \\sqrt2}$', '$= \\dfrac{6(\\sqrt5 + \\sqrt2)}{5 - 2}$', '$= 2(\\sqrt5 + \\sqrt2)$'] }),
          ] },
          ex: [
            num('Si $\\sqrt{50} = k\\sqrt{2}$, ¿cuánto vale $k$?', 5, '$\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt2$.', { prefix: '$k =$' }),
            mc('Simplifica $\\sqrt{72} + 3\\sqrt{50} - \\sqrt{18}$', ['$18\\sqrt2$', '$12\\sqrt2$', '$\\sqrt{104}$', '$20\\sqrt2$'], 0, '$6\\sqrt2 + 15\\sqrt2 - 3\\sqrt2 = 18\\sqrt2$.'),
            mc('Racionaliza $\\dfrac{6}{\\sqrt5 - \\sqrt2}$', ['$2(\\sqrt5 + \\sqrt2)$', '$6(\\sqrt5 + \\sqrt2)$', '$2(\\sqrt5 - \\sqrt2)$', '$\\dfrac{6}{3}$'], 0, 'Multiplica por el conjugado: el denominador queda $5 - 2 = 3$.'),
            ord('Ordena los pasos para racionalizar $\\dfrac{1}{\\sqrt3}$', ['$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{1}{\\sqrt3} \\cdot \\dfrac{\\sqrt3}{\\sqrt3}$', '$\\dfrac{\\sqrt3}{3}$'], 'Multiplica arriba y abajo por $\\sqrt3$: abajo queda $3$.'),
          ],
        },
      ],
    },
    {
      title: 'Expresiones algebraicas y polinomios',
      lessons: [
        {
          id: 'alg-23a', title: 'Grado y operaciones',
          clip: { scenes: [
            sc(5, 'Un **polinomio** es una suma de términos $a_k x^k$. El **grado** es el mayor exponente.', { title: '$P(x) = 3x^3 - 2x + 5$', steps: ['grado 3', 'coeficiente principal 3', 'término independiente 5'] }),
            sc(5, 'Para sumar o restar, agrupa los términos semejantes.', { steps: ['$(3x^3 - 2x + 5) - 2(x^2 - 4x + 1)$', '$= 3x^3 - 2x^2 - 2x + 8x + 5 - 2$', '$= 3x^3 - 2x^2 + 6x + 3$'] }),
            sc(5, 'Al multiplicar, los grados **se suman**.', { title: '$\\operatorname{gr}(PQ) = \\operatorname{gr}P + \\operatorname{gr}Q$', steps: ['$(x + 2)(x^2 - 1) = x^3 + 2x^2 - x - 2$'] }),
          ] },
          ex: [
            num('Grado de $P(x) = 4x^5 - 2x^3 + 7$', 5, 'El mayor exponente es 5.'),
            mc('Si $P = 3x^3 - 2x + 5$ y $Q = x^2 - 4x + 1$, ¿cuánto es $P - 2Q$?', ['$3x^3 - 2x^2 + 6x + 3$', '$3x^3 - 2x^2 - 10x + 7$', '$3x^3 + 2x^2 + 6x + 3$', '$x^3 - 2x^2 + 6x + 3$'], 0, '$-2Q = -2x^2 + 8x - 2$; suma término a término.'),
            num('Si $\\operatorname{gr}P = 3$ y $\\operatorname{gr}Q = 2$, ¿cuál es el grado de $PQ$?', 5, 'Los grados se suman: $3 + 2 = 5$.'),
            num('Valor numérico de $x^2 - 3x + 2$ en $x = 4$', 6, '$16 - 12 + 2 = 6$.'),
          ],
        },
        {
          id: 'alg-23b', title: 'División e igualdad de polinomios',
          clip: { scenes: [
            sc(5, 'Dividir polinomios es como dividir números: hay cociente y residuo.', { title: '$P(x) = D(x)\\,Q(x) + R(x)$', steps: ['$\\operatorname{gr}R < \\operatorname{gr}D$ o $R = 0$'] }),
            sc(6, 'Ejemplo: $(x^2 + 3x + 5) \\div (x + 1)$', { steps: ['$x^2 + 3x + 5 = (x + 1)(x + 2) + 3$', 'cociente $x + 2$', 'residuo $3$'] }),
            sc(5, 'Dos polinomios son **iguales** si tienen los mismos coeficientes.', { steps: ['$(a + 1)x^2 + (b - 2)x + 3 = 4x^2 + 3$', '$a + 1 = 4 \\Rightarrow a = 3$', '$b - 2 = 0 \\Rightarrow b = 2$'] }),
          ] },
          ex: [
            mc('Cociente de $(x^2 + 5x + 6) \\div (x + 2)$', ['$x + 3$', '$x + 2$', '$x - 3$', '$x + 6$'], 0, '$(x + 2)(x + 3) = x^2 + 5x + 6$, residuo 0.'),
            num('Residuo de $(x^2 + 3x + 5) \\div (x + 1)$', 3, '$(x + 1)(x + 2) = x^2 + 3x + 2$; faltan 3.'),
            num('Si $(a + 1)x^2 + (b - 2)x + 3 = 4x^2 + 3$ para todo $x$, ¿cuánto vale $a$?', 3, 'Compara los coeficientes de $x^2$: $a + 1 = 4$.', { prefix: '$a =$' }),
            num('…¿y cuánto vale $b$?', 2, 'No hay término en $x$ a la derecha: $b - 2 = 0$.', { prefix: '$b =$' }),
          ],
        },
      ],
    },
    {
      title: 'Productos notables y factorización',
      lessons: [
        {
          id: 'alg-3', title: 'Productos notables',
          clip: { scenes: [
            sc(4, '¿Cuánto es $(a + b)^2$? Dibujémoslo como un área.', { title: '$(a + b)^2 = \\;?$', viz: { type: 'areaSquare' } }),
            sc(5, 'Un cuadrado de lado $a + b$ se parte en 4 piezas.', { viz: { type: 'areaSquare' } }),
            sc(5, 'Suma las áreas: hay dos rectángulos iguales $ab$.', { title: '$(a + b)^2 = a^2 + 2ab + b^2$', viz: { type: 'areaSquare', full: true } }),
            sc(5, 'Otros productos que conviene reconocer a simple vista:', { steps: ['$(a + b)(a - b) = a^2 - b^2$', '$(x + a)(x + b) = x^2 + (a + b)x + ab$', '$(a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3$'] }),
          ] },
          ex: [
            mc('Expande $(x + 3)^2$', ['$x^2 + 6x + 9$', '$x^2 + 9$', '$x^2 + 3x + 9$', '$2x + 6$'], 0, '$(x + 3)^2 = x^2 + 2 \\cdot 3x + 3^2$.'),
            mc('Expande $(x - 5)(x + 5)$', ['$x^2 - 25$', '$x^2 + 25$', '$x^2 - 10x - 25$', '$x^2 - 10$'], 0, 'Diferencia de cuadrados: $a^2 - b^2$.'),
            num('Si $(x + k)^2 = x^2 + 10x + 25$, ¿cuánto vale $k$?', 5, '$2k = 10 \\Rightarrow k = 5$ (y $k^2 = 25$ ✓).', { prefix: '$k =$' }),
            mc('Expande $(x + 2)(x + 5)$', ['$x^2 + 7x + 10$', '$x^2 + 10x + 7$', '$x^2 + 7x + 7$', '$x^2 + 10$'], 0, 'Término común: $x^2 + (2 + 5)x + 2 \\cdot 5$.'),
          ],
        },
        {
          id: 'alg-24b', title: 'Factorización',
          clip: { scenes: [
            sc(5, 'Factorizar es lo contrario de expandir: escribir como **producto**. Empieza siempre por el factor común.', { steps: ['$6x^3 - 9x^2 = 3x^2(2x - 3)$'] }),
            sc(5, 'Diferencia de cuadrados y suma o diferencia de cubos:', { steps: ['$x^4 - 81 = (x^2 + 9)(x^2 - 9)$', '$= (x^2 + 9)(x - 3)(x + 3)$', '$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$'] }),
            sc(5, 'Trinomio $ax^2 + bx + c$: busca dos números que multipliquen $ac$ y sumen $b$.', { steps: ['$6x^2 + 7x - 20$', '$= 6x^2 + 15x - 8x - 20$', '$= (2x + 5)(3x - 4)$'] }),
            sc(5, '**Completar el cuadrado** convierte un trinomio en un cuadrado más una constante.', { title: '$x^2 + bx + c = \\left(x + \\tfrac{b}{2}\\right)^2 + c - \\tfrac{b^2}{4}$', steps: ['$x^2 + 6x + 13 = (x + 3)^2 + 4$'] }),
          ] },
          ex: [
            mc('Factoriza completamente $x^4 - 81$', ['$(x^2 + 9)(x - 3)(x + 3)$', '$(x^2 - 9)^2$', '$(x - 3)^4$', '$(x^2 + 9)^2$'], 0, 'Dos veces diferencia de cuadrados; $x^2 + 9$ no se factoriza en $\\mathbb{R}$.'),
            mc('Factoriza $6x^2 + 7x - 20$', ['$(2x + 5)(3x - 4)$', '$(2x - 5)(3x + 4)$', '$(6x - 5)(x + 4)$', '$(3x + 5)(2x - 4)$'], 0, 'Comprueba: $6x^2 - 8x + 15x - 20$.'),
            mc('Factoriza $a^3 + 27b^3$', ['$(a + 3b)(a^2 - 3ab + 9b^2)$', '$(a + 3b)^3$', '$(a + 3b)(a^2 + 3ab + 9b^2)$', '$(a - 3b)(a^2 + 3ab + 9b^2)$'], 0, 'Suma de cubos con $b \\to 3b$.'),
            ord('Ordena los pasos para completar el cuadrado de $x^2 + 6x + 13$', ['$x^2 + 6x + 13$', '$x^2 + 6x + 9 + 4$', '$(x + 3)^2 + 4$'], 'La mitad de 6 es 3 y $3^2 = 9$; lo que sobra es $13 - 9 = 4$.'),
          ],
        },
        {
          id: 'alg-24c', title: 'Binomio de Newton',
          clip: { scenes: [
            sc(5, 'Los coeficientes de $(a + b)^n$ forman el **triángulo de Pascal**: cada número es la suma de los dos de arriba.', { steps: ['$1$', '$1 \\quad 1$', '$1 \\quad 2 \\quad 1$', '$1 \\quad 3 \\quad 3 \\quad 1$', '$1 \\quad 4 \\quad 6 \\quad 4 \\quad 1$'] }),
            sc(5, 'Por eso:', { steps: ['$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$', '$(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$'] }),
            sc(6, 'En general, el término $k$ usa el número combinatorio $\\binom{n}{k}$.', { title: '$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$', steps: ['En $(2x - 1)^6$, el término con $x^4$:', '$\\binom{6}{2}(2x)^4(-1)^2 = 15 \\cdot 16\\,x^4 = 240x^4$'] }),
          ] },
          ex: [
            mc('Fila 5 del triángulo de Pascal (coeficientes de $(a + b)^5$)', ['$1, 5, 10, 10, 5, 1$', '$1, 4, 6, 4, 1$', '$1, 5, 5, 5, 5, 1$', '$1, 5, 10, 5, 1$'], 0, 'Suma los vecinos de la fila $1, 4, 6, 4, 1$.'),
            mc('Expande $(x + 1)^3$', ['$x^3 + 3x^2 + 3x + 1$', '$x^3 + 1$', '$x^3 + 3x + 1$', '$x^3 + x^2 + x + 1$'], 0, 'Coeficientes $1, 3, 3, 1$.'),
            num('Coeficiente del término en $x^4$ en $(2x - 1)^6$', 240, '$\\binom{6}{2} \\cdot 2^4 \\cdot (-1)^2 = 15 \\cdot 16 = 240$.'),
            num('$\\binom{5}{2} = \\;?$', 10, '$\\dfrac{5 \\cdot 4}{2 \\cdot 1} = 10$.'),
          ],
        },
      ],
    },
    {
      title: 'Expresiones racionales',
      lessons: [
        {
          id: 'alg-25a', title: 'Dominio y simplificación',
          clip: { scenes: [
            sc(5, 'Una expresión racional es un cociente de polinomios. Su dominio excluye los valores que anulan el denominador.', { title: '$\\dfrac{x^2 - 9}{x^2 + x - 6}$', steps: ['$x^2 + x - 6 = (x + 3)(x - 2)$', '$x \\neq -3, \\; x \\neq 2$'] }),
            sc(5, 'Para simplificar, factoriza y cancela **factores** comunes.', { steps: ['$\\dfrac{(x - 3)(x + 3)}{(x + 3)(x - 2)}$', '$= \\dfrac{x - 3}{x - 2}, \\quad x \\neq -3$'] }),
            sc(5, 'En la gráfica, el factor cancelado deja un **hueco** en $x = -3$.', { viz: { type: 'graph', xr: [-6, 6], yr: [-4, 6], f: x => (x - 3) / (x - 2), holes: [[-3, 1.2]], draw: true } }),
            sc(4, 'Error típico: cancelar **términos** en lugar de factores.', { steps: ['$\\dfrac{x + 2}{x} \\neq 2$', '$\\dfrac{x + 2}{x} = 1 + \\dfrac{2}{x}$'] }),
          ] },
          ex: [
            mc('Simplifica $\\dfrac{x^2 - 9}{x^2 + x - 6}$', ['$\\dfrac{x - 3}{x - 2}$', '$\\dfrac{x + 3}{x - 2}$', '$\\dfrac{-9}{x - 6}$', '$\\dfrac{3}{2}$'], 0, 'Factoriza arriba y abajo y cancela $x + 3$.'),
            mc('¿Qué valores quedan excluidos del dominio de esa expresión?', ['$x = -3$ y $x = 2$', 'Solo $x = 3$', 'Solo $x = 2$', 'Ninguno'], 0, 'Los que anulan el denominador original $(x + 3)(x - 2)$.'),
            mc('¿Es correcto que $\\dfrac{x + 2}{x} = 2$?', ['No: solo se cancelan factores, no términos', 'Sí, siempre', 'Sí, si $x \\neq 0$', 'Solo si $x = 2$'], 0, 'Con $x = 1$: $\\tfrac{3}{1} = 3 \\neq 2$.'),
            mc('Simplifica $\\dfrac{2x + 4}{x^2 - 4}$', ['$\\dfrac{2}{x - 2}$', '$\\dfrac{2}{x + 2}$', '$\\dfrac{2x}{x^2}$', '$\\dfrac{1}{x - 2}$'], 0, '$\\dfrac{2(x + 2)}{(x + 2)(x - 2)}$.'),
          ],
        },
        {
          id: 'alg-25b', title: 'Operaciones con fracciones algebraicas',
          clip: { scenes: [
            sc(5, 'Multiplicar y dividir: factoriza todo y cancela.', { steps: ['$\\dfrac{P}{Q} \\cdot \\dfrac{R}{S} = \\dfrac{PR}{QS}$', '$\\dfrac{P/Q}{R/S} = \\dfrac{PS}{QR}$'] }),
            sc(6, 'Sumar y restar: usa el **mínimo común denominador**.', { steps: ['$\\dfrac{2}{x - 1} - \\dfrac{3}{x + 1} + \\dfrac{6}{x^2 - 1}$', '$= \\dfrac{2(x + 1) - 3(x - 1) + 6}{x^2 - 1}$', '$= \\dfrac{11 - x}{x^2 - 1}$'] }),
            sc(5, '**Fracción compleja**: multiplica arriba y abajo por el MCD de las fracciones pequeñas.', { steps: ['$\\dfrac{\\frac{1}{x} - \\frac{1}{a}}{x - a} = \\dfrac{a - x}{ax(x - a)}$', '$= -\\dfrac{1}{ax}$'] }),
          ] },
          ex: [
            mc('Efectúa $\\dfrac{2}{x - 1} - \\dfrac{3}{x + 1} + \\dfrac{6}{x^2 - 1}$', ['$\\dfrac{11 - x}{x^2 - 1}$', '$\\dfrac{5}{x^2 - 1}$', '$\\dfrac{x + 11}{x^2 - 1}$', '$\\dfrac{5}{x - 1}$'], 0, 'Numerador: $2x + 2 - 3x + 3 + 6 = 11 - x$.'),
            mc('$\\dfrac{x}{x + 1} \\cdot \\dfrac{x + 1}{x^2} = \\;?$', ['$\\dfrac{1}{x}$', '$x$', '$\\dfrac{x + 1}{x}$', '$1$'], 0, 'Se cancelan $x + 1$ y una $x$.'),
            mc('Simplifica $\\dfrac{\\frac{1}{x} - \\frac{1}{a}}{x - a}$', ['$-\\dfrac{1}{ax}$', '$\\dfrac{1}{ax}$', '$\\dfrac{a - x}{x - a}$', '$ax$'], 0, '$\\dfrac{a - x}{ax} \\cdot \\dfrac{1}{x - a} = -\\dfrac{1}{ax}$.'),
            mc('MCD de $\\dfrac{1}{x^2 - 4}$ y $\\dfrac{1}{x + 2}$', ['$(x - 2)(x + 2)$', '$(x + 2)^2$', '$(x^2 - 4)(x + 2)$', '$x - 2$'], 0, '$x^2 - 4 = (x - 2)(x + 2)$ ya contiene a $x + 2$.'),
          ],
        },
      ],
    },
    {
      title: 'Ecuaciones y desigualdades',
      lessons: [
        {
          id: 'alg-1', title: 'Ecuaciones lineales',
          clip: { scenes: [
            sc(4, 'Una ecuación es una **balanza**: ambos lados pesan lo mismo.', { title: '$2x + 3 = 11$', viz: { type: 'balance', l: '2x + 3', r: '11' } }),
            sc(5, 'Lo que hagas a un lado, hazlo también al otro. Resta 3:', { steps: ['$2x + 3 = 11$', '$2x + 3 - 3 = 11 - 3$', '$2x = 8$'] }),
            sc(4, 'Ahora divide ambos lados entre 2:', { steps: ['$2x = 8$', '$\\dfrac{2x}{2} = \\dfrac{8}{2}$', '$x = 4$'] }),
            sc(4, 'Comprueba siempre: sustituye y verifica.', { title: '$2(4) + 3 = 11$ ✓', viz: { type: 'balance', l: '2·4 + 3', r: '11' } }),
          ] },
          ex: [
            mc('Resuelve $x + 5 = 12$', ['$x = 7$', '$x = 17$', '$x = 5$', '$x = -7$'], 0, 'Resta 5 en ambos lados: $x = 12 - 5 = 7$.'),
            num('Resuelve $2x - 4 = 10$', 7, 'Suma 4: $2x = 14$. Divide entre 2: $x = 7$.', { prefix: '$x =$' }),
            ord('Ordena los pasos para resolver $5x + 2 = 17$', ['$5x + 2 = 17$', '$5x = 15$', '$x = 3$'], 'Primero quitas el término independiente y luego el coeficiente.'),
            num('Resuelve $3(x - 2) - \\dfrac{2x + 1}{4} = 5$', 4.5, 'Multiplica todo por 4: $12x - 24 - 2x - 1 = 20 \\Rightarrow 10x = 45 \\Rightarrow x = 4.5$.', { prefix: '$x =$' }),
          ],
        },
        {
          id: 'alg-4', title: 'Ecuaciones cuadráticas',
          clip: { scenes: [
            sc(4, 'Las cuadráticas $ax^2 + bx + c = 0$ se relacionan con **parábolas**.', { title: '$y = ax^2$', viz: { type: 'graph', xr: [-4, 4], yr: [-2, 8], f: sq, draw: true } }),
            sc(5, 'El signo de $a$ decide si abre hacia arriba o hacia abajo.', { viz: { type: 'graph', xr: [-4, 4], yr: [-6, 6], f: (x, a) => a * x * x, anim: [2, -2], label: a => `a = ${fmt(a)}` } }),
            sc(5, 'Las **raíces** son donde la parábola toca el eje $x$. Factorizar es el camino más rápido.', { title: '$x^2 - 5x + 6 = (x - 2)(x - 3) = 0$', viz: { type: 'graph', xr: [-1, 6], yr: [-2, 6], f: x => x * x - 5 * x + 6, points: [[2, 0, 'x = 2'], [3, 0, 'x = 3']] } }),
            sc(6, 'Si no factoriza fácil, usa la fórmula general. El discriminante te dice cuántas raíces hay:', { title: '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', steps: ['$b^2 - 4ac > 0$: dos raíces', '$b^2 - 4ac = 0$: una raíz', '$b^2 - 4ac < 0$: ninguna real'] }),
          ] },
          ex: [
            sld('Ajusta $a$ para que $y = ax^2$ pase por el punto $(2, 2)$', {
              viz: { type: 'graph', xr: [-3, 3], yr: [-4, 5], f: (x, a) => a * x * x, points: [[2, 2, '(2, 2)']] },
              min: -2, max: 2, step: 0.25, init: 1, readout: v => `$a = ${v}$`,
              check: v => near(v, 0.5), answerText: '$a = 0.5$', explain: '$2 = a \\cdot 2^2 \\Rightarrow a = \\tfrac{1}{2}$.',
            }),
            num('¿Cuál es la raíz **mayor** de $x^2 - 5x + 6 = 0$?', 3, 'Factoriza: $(x - 2)(x - 3) = 0$. Raíces 2 y 3.', { prefix: '$x =$' }),
            mc('Discriminante $b^2 - 4ac$ de $x^2 + 2x + 5$', ['$-16$', '$24$', '$16$', '$-4$'], 0, '$2^2 - 4(1)(5) = 4 - 20 = -16$: no tiene raíces reales.'),
            num('El producto de dos números impares consecutivos es 143. ¿Cuál es el menor (positivo)?', 11, '$n(n + 2) = 143 \\Rightarrow n^2 + 2n - 143 = 0 \\Rightarrow (n - 11)(n + 13) = 0$.'),
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
      ],
    },
  ],
};
