// Curso de Álgebra — sigue las Partes I «Aritmética» (unidades 1–3), II «Funciones» (5–7) y
// III «Polinomios» (9–11) del Manual de Álgebra y Trigonometría (Instituto de Matemáticas, UdeA, 2024).
// del programa Fundamentos de Matemáticas.

const COURSE_ALGEBRA = {
  id: 'algebra', level: 'Fundamentos', name: 'Álgebra', icon: 'x²', color: '#8b7bff',
  tagline: 'El lenguaje de las matemáticas: números, ecuaciones y funciones para describir el mundo.',
  units: [
    {
      title: 'Números reales, potenciación y radicación',
      lessons: [
        {
          id: 'alg-11', title: 'Sistemas numéricos y números reales',
          // Clase 1 en Bunny Stream (video/clase_sistemas_numericos): la parte 1 abre la lección y la parte 2
          // llega tras los ejercicios de la parte 1 (`after`); cada parte con sus ejercicios. Libro UdeA §1.1.
          // Las escenas quedan de respaldo si el video no carga. Cada ejercicio trae una pista (`hint`).
          clip: { bunny: '86d9fad5-e354-40a1-8f0a-3e324b642b60', duration: 462, scenes: [
            sc(6, 'Los números se fueron ampliando para resolver nuevos problemas: contar, restar, repartir, medir.', { title: '$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$', steps: ['$\\mathbb{N} = \\{1, 2, 3, \\dots\\}$: contar', '$\\mathbb{Z}$: los enteros, con negativos', '$\\mathbb{Q} = \\left\\{\\tfrac{m}{n} : n \\neq 0\\right\\}$: fracciones', '$\\mathbb{I}$: irracionales como $\\sqrt2,\\ \\pi,\\ e$'] }),
            sc(5, 'Todo decimal que **termina o se repite** es racional: viene de una fracción.', { steps: ['$\\tfrac94 = 2.25$', '$\\tfrac{177}{55} = 3.2\\overline{18}$'] }),
          ] },
          more: [{ after: 6, bunny: 'd5ddb99a-428e-4b8f-9f5f-496c8987ae3d', duration: 379, scenes: [
            sc(5, 'Los reales llenan la **recta numérica**: cada punto tiene su número y cada número su punto.', { steps: ['$-2.7 < \\sqrt2 < e < \\pi < \\tfrac{24}{5}$', '$\\sqrt2 \\approx 1.41,\\; e \\approx 2.72,\\; \\pi \\approx 3.14$'] }),
            sc(5, 'Un decimal periódico se vuelve fracción: multiplica por 10, 100… según el período, y resta.', { steps: ['$x = 0.\\overline{36}$', '$100x - x = 36$', '$x = \\tfrac{36}{99} = \\tfrac{4}{11}$'] }),
          ] }],
          ex: [
            // --- Parte 1: naturales, enteros y racionales (todo con juegos) ---
            play('pasaporte-numeros', 'Sella el pasaporte de cada número con **todas** las familias donde puede entrar', {
              sets: ['N', 'Z', 'Q'],
              numbers: [
                { label: '9', in: ['N', 'Z', 'Q'] }, { label: '−4', in: ['Z', 'Q'] }, { label: '0', in: ['Z', 'Q'] },
                { label: '3/5', in: ['Q'] }, { label: '−1.5', in: ['Q'] }, { label: '12/4', in: ['N', 'Z', 'Q'] },
              ],
            }, 'Las familias están anidadas, $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}$: quien entra a ℕ entra también a ℤ y a ℚ. $9$ y $\\tfrac{12}{4} = 3$ llevan los tres sellos; $-4$ y $0$ son enteros (y racionales), pero no naturales; $\\tfrac35$ y $-1.5 = -\\tfrac32$ solo son racionales.',
              { hint: 'Un número puede llevar varios sellos. Pregunta en orden: ¿sirve para contar (ℕ)? ¿es un número sin partes, aunque sea negativo o el 0 (ℤ)? ¿se puede escribir como fracción (ℚ)? Simplifica primero las fracciones que parecen raras.' }),
            play('ascensor', 'Lleva el ascensor al piso donde termina cada viaje', {
              min: -5, max: 6,
              rounds: [
                { start: 2, move: -6, text: 'Estás en el piso 2 y bajas 6 pisos' },
                { start: -3, move: 3, text: 'Estás en el sótano 3 y subes 3 pisos' },
                { start: -1, move: -4, text: 'Estás en el sótano 1 y bajas 4 pisos más' },
              ],
            }, 'Subir es sumar y bajar es restar: $2 - 6 = -4$ (pasas por la calle y llegas al sótano 4), $-3 + 3 = 0$ (un número y su opuesto suman cero: vuelves a la calle) y $-1 - 4 = -5$.',
              { hint: 'Cuenta piso por piso desde la banderita. La calle es el 0: al bajar de ella entras a los sótanos, que llevan signo menos. Subir desde un sótano te acerca a la calle.' }),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Todo número natural es también racional', truth: true, why: 'ℕ ⊂ ℤ ⊂ ℚ: 12 es natural, entero y racional (12/1).' },
                { text: 'El 0 es un número natural', truth: false, why: 'En este curso ℕ = {1, 2, 3, …}; el 0 es entero.' },
                { text: 'Todo número entero es natural', truth: false, why: '−3 es entero, pero los naturales empiezan en 1.' },
                { text: '0.125 es un número racional', truth: true, why: '0.125 = 1/8: su decimal termina.' },
                { text: 'Una fracción puede tener 0 en el denominador', truth: false, why: 'n ≠ 0: repartir entre cero personas no tiene sentido.' },
              ],
            }, 'Las familias están anidadas: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}$, así que lo natural también es entero y racional, pero no al revés. Un racional es una fracción $\\tfrac{m}{n}$ de enteros con $n \\ne 0$.',
              { hint: 'Piensa en las cajas: ℕ está dentro de ℤ, y ℤ dentro de ℚ. Lo que está en una caja de adentro también está en las de afuera, pero no al revés.' }),
            play('pizzeria', 'Sirve cada pedido: corta la pizza y marca las porciones que pide', {
              maxSlices: 12,
              orders: [
                { label: '0.6', num: 3, den: 5 },
                { label: '0.666…', num: 2, den: 3 },
                { label: '25 %', num: 1, den: 4 },
                { label: 'tres octavos', num: 3, den: 8 },
              ],
            }, 'La misma cantidad se puede escribir como fracción, decimal, porcentaje o con palabras: $0.6 = \\tfrac35 = \\tfrac{6}{10}$, $0.\\overline{6} = \\tfrac23 = \\tfrac{4}{6}$, $25\\,\\% = \\tfrac14 = \\tfrac{3}{12}$ y tres octavos es $\\tfrac38$. Cortar en más porciones no cambia cuánto es: son fracciones **equivalentes**.',
              { hint: 'Pasa cada pedido a fracción: 0.6 son seis décimas, un porcentaje es «de cada 100» y las palabras ya dicen la fracción. Corta la pizza en tantas porciones como diga el denominador (o en un múltiplo) y marca las del numerador.' }),
            play('une-parejas', 'Une cada fracción con su decimal', {
              left: ['1/8', '2/3', '11/4', '5/9', '7/20'],
              right: ['0.125', '0.666…', '2.75', '0.555…', '0.35', '0.8', '2.5'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'Dividir numerador entre denominador: $\\tfrac18 = 0.125$ y $\\tfrac{7}{20} = 0.35$ terminan; $\\tfrac23 = 0.\\overline{6}$ y $\\tfrac59 = 0.\\overline{5}$ se repiten; $\\tfrac{11}{4} = 2.75$. Las fichas $0.8$ y $2.5$ sobran.',
              { hint: 'Divide el numerador entre el denominador. Si la división no termina, fíjate qué cifra se repite. Un denominador 9 suele dar un decimal que se repite.' }),
            play('pon-la-rayita', 'Pon la rayita sobre el bloque que se repite para siempre', {
              rounds: [{ num: 5, den: 11 }, { num: 1, den: 6 }, { num: 23, den: 12 }, { num: 3, den: 7 }],
            }, 'La rayita cubre solo el bloque que se repite, desde donde empieza a repetirse: $\\tfrac{5}{11} = 0.\\overline{45}$, $\\tfrac16 = 0.1\\overline{6}$, $\\tfrac{23}{12} = 1.91\\overline{6}$ y $\\tfrac37 = 0.\\overline{428571}$. Los residuos lo delatan: cuando un residuo vuelve a salir, las cifras vuelven a salir en el mismo orden.',
              { hint: 'Toca una cifra y mira su residuo debajo: las cifras con el mismo residuo se iluminan. Donde un residuo aparece por segunda vez, ahí empieza a repetirse todo. Las cifras de antes quedan sin rayita.' }),
            // --- Parte 2: irracionales, reales y decimales periódicos ---
            play('acorrala-raiz', 'Acorrala la raíz: cada vez en un tramo más pequeño', {
              rounds: [{ n: 5 }, { n: 10 }], levels: 3,
            }, 'Como $2.2^2 = 4.84 < 5 < 5.29 = 2.3^2$, la raíz de 5 está entre $2.2$ y $2.3$; acercándose más, $2.236 < \\sqrt5 < 2.237$, y lo mismo $3.162 < \\sqrt{10} < 3.163$. Puedes seguir para siempre: las cifras de una raíz no exacta nunca terminan ni se repiten. Por eso es **irracional**.',
              { hint: 'Fíjate en los colores: azul si el número al cuadrado da menos que el de adentro de la raíz, coral si da más. La raíz está justo donde el azul se vuelve coral: toca ese tramo y la lupa lo abre en la siguiente línea.' }),
            play('clasifica-cartas', 'Desliza cada número según su decimal: ¿**racional** o **irracional**?', {
              left: 'Irracional', right: 'Racional',
              cards: [
                { text: '0.125', side: 'right', why: 'Termina: es 1/8.' },
                { text: '0.777…', side: 'right', why: 'Se repite el 7: es 7/9.' },
                { text: '1.7320508…', side: 'left', why: 'Es √3: sus cifras no se repiten nunca.' },
                { text: '−4', side: 'right', why: 'Todo entero es racional: −4 = −4/1.' },
                { text: '0.1010010001…', side: 'left', why: 'Hay un patrón, pero no se repite igual: cada vez hay un 0 más. No es periódico.' },
                { text: '22/7', side: 'right', why: 'Es una fracción de enteros: racional, aunque se parezca a π.' },
              ],
            }, 'Racional: el decimal termina o repite un bloque fijo (período). Irracional: no termina y no repite ningún bloque fijo, como $\\sqrt3$ o $0.1010010001\\ldots$',
              { hint: 'Mira las cifras después del punto: ¿se acaban, o repiten un bloque siempre igual? Entonces viene de una fracción. Un patrón que va cambiando no es un período.' }),
            play('cajas-numericas', 'Arrastra cada número a la caja **más pequeña** donde vive', {
              cards: [
                { label: '12', tex: '12', set: 'N' }, { label: '−3', tex: '-3', set: 'Z' }, { label: '0', tex: '0', set: 'Z' },
                { label: '2/5', tex: '\\tfrac25', set: 'Q' }, { label: '0.444…', tex: '0.\\overline{4}', set: 'Q' }, { label: '√49', tex: '\\sqrt{49}', set: 'N' },
                { label: '√5', tex: '\\sqrt5', set: 'I' }, { label: 'π', tex: '\\pi', set: 'I' }, { label: '−8/2', tex: '-\\tfrac82', set: 'Z' },
              ],
            }, 'Cada familia vive dentro de la siguiente: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$, y la caja más pequeña es la que mejor describe al número. $\\sqrt{49} = 7$ y $-\\tfrac82 = -4$ se simplifican antes de decidir; $0.\\overline{4} = \\tfrac49$ es una fracción disfrazada; $\\sqrt5$ y $\\pi$ no son fracciones. Una caja más grande (naranja) no está mal, pero no es la más pequeña.',
              { hint: 'Primero simplifica lo que se pueda: raíces exactas y fracciones que dan un entero. Luego prueba de la caja más pequeña a la más grande: ℕ, ℤ, ℚ. Si no se puede escribir como fracción, va en 𝕀.' }),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: '22/7 es igual a π', truth: false, why: '22/7 = 3.142857… es racional (periódico); π no tiene período. Solo se parecen.' },
                { text: 'Un decimal que no termina siempre es irracional', truth: false, why: '0.444… no termina, pero se repite: es 4/9, racional.' },
                { text: 'π es un número real', truth: true, why: 'π es irracional, y los irracionales están dentro de ℝ.' },
                { text: 'ℝ = ℚ ∪ 𝕀', truth: true, why: 'Los reales son la unión de racionales e irracionales.' },
                { text: 'Entre dos reales distintos siempre hay otro real', truth: true, why: 'Entre a y b está su promedio (a + b)/2: la recta no tiene huecos.' },
              ],
            }, 'Un decimal es racional si termina o se repite; si nunca se repite, es irracional. Juntos, racionales e irracionales forman $\\mathbb{R}$ y llenan la recta sin dejar huecos.',
              { hint: 'Un decimal es racional si termina o si repite un bloque fijo; es irracional si nunca lo repite. Y todos, racionales e irracionales, viven en la recta real.' }),
            play('ubica-en-recta', 'Suelta cada número en su lugar de la recta', {
              min: -3, max: 4, tol: 0.15,
              points: [
                { label: '−5/2', tex: '-\\tfrac52', value: -2.5 }, { label: '1/3', tex: '\\tfrac13', value: 0.3333 },
                { label: '√3', tex: '\\sqrt3', value: 1.7321 }, { label: '7/2', tex: '\\tfrac72', value: 3.5 }, { label: '−0.5', tex: '-0.5', value: -0.5 },
              ],
            }, 'Primero conviértelos: $-\\tfrac52 = -2.5$, $\\tfrac13 \\approx 0.33$, $\\sqrt3 \\approx 1.73$ (porque $1.73^2 \\approx 3$), $\\tfrac72 = 3.5$ y $-0.5$ está a medio paso del cero, a la izquierda.',
              { hint: 'Pasa cada número a decimal antes de soltarlo; mientras arrastras, la ficha te dice el valor donde caería. Para una raíz, busca qué decimal multiplicado por sí mismo se acerca al número de adentro.' }),
            play('ordena-terminos', 'Ordena los pasos para escribir $0.\\overline{45}$ como fracción', { tex: 'x = 0.\\overline{45}', chips: ['100x = 45.4545…', '100x − x = 45', '99x = 45', 'x = 45/99 = 5/11', '10x = 4.5454…', 'x = 45/100'], order: [0, 1, 2, 3], sep: '⇒' },
              'El período tiene dos cifras, así que se multiplica por $100$: $100x = 45.\\overline{45}$. Al restar $x$ desaparece la cola: $99x = 45$ y $x = \\tfrac{45}{99} = \\tfrac{5}{11}$. Multiplicar por $10$ no alinea el período, y $\\tfrac{45}{100}$ sería $0.45$ sin la rayita.',
              { hint: 'Cuenta cuántas cifras tiene el bloque que se repite: si es una, multiplica por 10; si son dos, por 100. Luego resta $x$ para que la cola infinita desaparezca y despeja.' }),
          ],
        },
        {
          id: 'alg-12b', title: 'Axiomas de campo y orden',
          // Clase 7 en Bunny Stream (video/clase_axiomas). Las escenas quedan de respaldo si el video no carga. Libro UdeA §1.2–1.3.
          clip: { bunny: '1992ff97-e3e7-438e-b9c4-8d79b91865a8', duration: 383, scenes: [
            sc(6, 'Los **axiomas de campo** son las reglas de la suma y el producto en $\\mathbb{R}$: conmutativa, asociativa, neutros, inversos y distributiva.', { steps: ['$a + b = b + a \\qquad ab = ba$', '$a + 0 = a \\qquad a \\cdot 1 = a$', '$a(b + c) = ab + ac$'] }),
            sc(6, 'De ellos salen las propiedades que usas sin pensar: la **ley cancelativa**, $0 \\cdot a = 0$ y la regla de los signos.', { steps: ['$a + b = a + c \\Rightarrow b = c$', '$(-a)(-b) = ab \\qquad (-a)b = -(ab)$'] }),
            sc(6, 'Los **axiomas de orden**: $a < b$ significa que $b - a$ es positivo. Multiplicar por un negativo **invierte** la desigualdad.', { steps: ['Tricotomía: $a > b$, $a = b$ o $a < b$', '$a < b,\\ c > 0 \\Rightarrow ac < bc$', '$a < b,\\ c < 0 \\Rightarrow ac > bc$'] }),
            sc(5, 'El **valor absoluto** es la distancia al cero: nunca es negativo.', { title: '$|a| = a$ si $a \\ge 0$, $\\;|a| = -a$ si $a < 0$', steps: ['$|-3| = 3 \\qquad |2 - \\sqrt2| = 2 - \\sqrt2$', '$|\\sqrt2 - 2| = 2 - \\sqrt2$'] }),
          ] },
          ex: [
            // Solo juegos: axiomas de campo, ley de signos, orden y valor absoluto (sin tarjetas ni opción múltiple).
            play('atajo-axiomas', 'Llega a la meta reescribiendo con axiomas: toca la regla que quieres usar', {
              rounds: [
                { start: '(4 + a) + (−4)', target: 'a', states: {
                  '(4 + a) + (−4)': { Conmutativa: '(a + 4) + (−4)', Asociativa: '4 + (a + (−4))' },
                  '(a + 4) + (−4)': { Asociativa: 'a + (4 + (−4))', Conmutativa: '(−4) + (a + 4)' },
                  '(−4) + (a + 4)': { Conmutativa: '(a + 4) + (−4)' },
                  'a + (4 + (−4))': { Inverso: 'a + 0' },
                  'a + 0': { Neutro: 'a' },
                  '4 + (a + (−4))': { Conmutativa: '4 + ((−4) + a)' },
                  '4 + ((−4) + a)': { Asociativa: '(4 + (−4)) + a' },
                  '(4 + (−4)) + a': { Inverso: '0 + a' },
                  '0 + a': { Neutro: 'a' },
                } },
                { start: '(1/3) · (3 · b)', target: 'b', states: {
                  '(1/3) · (3 · b)': { Asociativa: '((1/3) · 3) · b', Conmutativa: '(3 · b) · (1/3)' },
                  '(3 · b) · (1/3)': { Conmutativa: '(1/3) · (3 · b)' },
                  '((1/3) · 3) · b': { Inverso: '1 · b' },
                  '1 · b': { Neutro: 'b' },
                } },
                { start: '2(x + 5) + (−10)', target: '2x', states: {
                  '2(x + 5) + (−10)': { Distributiva: '(2x + 10) + (−10)' },
                  '(2x + 10) + (−10)': { Asociativa: '2x + (10 + (−10))', Conmutativa: '(10 + 2x) + (−10)' },
                  '(10 + 2x) + (−10)': { Conmutativa: '(2x + 10) + (−10)' },
                  '2x + (10 + (−10))': { Inverso: '2x + 0' },
                  '2x + 0': { Neutro: '2x' },
                } },
              ],
            }, 'Cada paso del álgebra es un axioma: la **conmutativa** cambia el orden, la **asociativa** mueve los paréntesis, la **distributiva** reparte el factor, el **inverso** convierte $4 + (-4)$ en $0$ y $\\tfrac13 \\cdot 3$ en $1$, y el **neutro** borra el $+\\,0$ y el $1 \\cdot$. Por ejemplo: $(4 + a) + (-4) = (a + 4) + (-4) = a + (4 + (-4)) = a + 0 = a$.',
              { hint: 'Busca juntar cada número con su opuesto (o con su recíproco): primero cambia el orden o los paréntesis hasta que queden vecinos, después usa el inverso para volverlos 0 (o 1) y al final el neutro para borrarlo. Si hay un número por un paréntesis, empieza repartiéndolo.' }),
            play('arma-producto', 'Mete fichas a la máquina hasta que el producto dé la meta', {
              tiles: [-3, 2, -1, 4, -2, 0],
              rounds: [{ target: 12 }, { target: -24 }, { target: 6 }],
            }, 'El signo de un producto depende de cuántos factores negativos tiene: una cantidad par da positivo y una impar, negativo. Por ejemplo $(-3) \\cdot (-1) \\cdot 4 = 12$ (dos negativos), $(-3) \\cdot 2 \\cdot 4 = -24$ (uno) y $(-3) \\cdot (-2) = 6$. Y el $0$ anula todo: $0 \\cdot a = 0$.',
              { hint: 'Primero decide el signo: para un resultado positivo necesitas una cantidad par de fichas negativas; para uno negativo, impar. Después ajusta el tamaño con los valores. Ojo con el 0: si entra a la máquina, todo da 0.' }),
            play('voltea-desigualdad', 'Sigue los puntos en la recta y elige el signo correcto tras cada operación', { a: -1, b: 2, steps: [{ op: '+', k: 3 }, { op: '×', k: 2 }, { op: '×', k: -1 }, { op: '+', k: -4 }] },
              'Sumar o restar lo mismo a los dos lados **conserva** el orden; multiplicar por un positivo también. Multiplicar por un negativo **refleja** la recta y voltea el signo: de $4 < 10$ se pasa a $-4 > -10$.', { hint: 'Sumar o restar el mismo número a los dos lados no cambia el signo, y multiplicar por un positivo tampoco. Solo multiplicar por un negativo voltea la desigualdad.' }),
            play('dobla-la-recta', 'Dobla la recta por el cero: ¿dónde cae el valor absoluto?', {
              min: -3, max: 3, tol: 0.1,
              points: [
                { label: '|−2.5|', insideLabel: '−2.5', inside: -2.5, tex: '|-2.5|', sol: '2.5' },
                { label: '|3 − √5|', insideLabel: '3 − √5', inside: 0.7639, tex: '|3 - \\sqrt5|', sol: '3 - \\sqrt5 \\approx 0.76' },
                { label: '|√3 − 2|', insideLabel: '√3 − 2', inside: -0.2679, tex: '|\\sqrt3 - 2|', sol: '2 - \\sqrt3 \\approx 0.27' },
                { label: '|1 − π|', insideLabel: '1 − π', inside: -2.1416, tex: '|1 - \\pi|', sol: '\\pi - 1 \\approx 2.14' },
              ],
            }, 'El valor absoluto es la distancia al cero: si lo de adentro es positivo se queda donde está ($|3 - \\sqrt5| = 3 - \\sqrt5$, porque $\\sqrt5 \\approx 2.24 < 3$); si es negativo, pasa al otro lado del cero como en un espejo ($|\\sqrt3 - 2| = 2 - \\sqrt3$ y $|1 - \\pi| = \\pi - 1$). Nunca da un número negativo.',
              { hint: 'Mira de qué lado del cero está el punto de adentro. Si está a la derecha, el valor absoluto es el mismo número; si está a la izquierda, dobla la recta por el cero y pon la marca al otro lado, a la misma distancia.' }),
            play('distancia-justa', 'Coloca $b$ a la distancia justa de $a$', { min: -10, max: 6, a: -3, d: 5 },
              '$|b - a|$ es la distancia entre $a$ y $b$. Desde $-3$, a 5 unidades hay dos puntos: $-3 + 5 = 2$ y $-3 - 5 = -8$.', { hint: '$|b - a|$ es cuántos pasos hay entre $a$ y $b$. Desde $a$ puedes caminar hacia la derecha o hacia la izquierda: hay dos lugares posibles.' }),
            play('dibuja-intervalo', 'Dibuja en la recta los números que cumplen $|x - 2| \\le 3$', { min: -4, max: 8, a: -1, b: 5, aClosed: true, bClosed: true, set: '|x − 2| ≤ 3' },
              '$|x - 2| \\le 3$ son los números a distancia **a lo sumo 3** del 2: desde $2 - 3 = -1$ hasta $2 + 3 = 5$, con los extremos incluidos: $[-1, 5]$.', { hint: 'Lee $|x - 2|$ como la distancia de $x$ al número 2. ¿Hasta dónde puedes alejarte del 2 hacia cada lado? El signo ≤ te dice si los extremos entran.' }),
          ],
        },
        {
          id: 'alg-21a', title: 'Potencias y exponentes',
          // Clase 8 (video/clase_potencias): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration). Libro UdeA §1.4.
          clip: { scenes: [
            sc(4, 'Una potencia es una multiplicación repetida: la **base** se multiplica tantas veces como dice el **exponente**.', { title: '$a^n = \\underbrace{a \\cdot a \\cdots a}_{n \\text{ veces}}$', steps: ['$2^3 = 2 \\cdot 2 \\cdot 2 = 8$'] }),
            sc(5, 'Cada vez que el exponente sube en 1, el resultado se multiplica por la base.', { title: '$y = 2^x$', viz: { type: 'graph', xr: [-3, 4.5], yr: [-1, 17], f: x => 2 ** x, draw: true, points: [[0, 1, '2⁰ = 1'], [3, 8, '2³ = 8']] } }),
            sc(5, '¡Cuidado con el signo! El exponente solo afecta a lo que toca.', { steps: ['$-2^4 = -(2^4) = -16$', '$(-2)^4 = 16$', '$(-2)^3 = -8$'] }),
            sc(5, 'El exponente cero y los negativos siguen el mismo patrón: dividir entre la base.', { steps: ['$a^0 = 1 \\quad (a \\neq 0)$', '$a^{-n} = \\dfrac{1}{a^n}$', '$2^{-3} = \\dfrac{1}{8}$'] }),
          ] },
          ex: [
            num('Calcula $-2^4$', -16, 'El exponente solo afecta al 2: $-(2^4) = -16$.', { hint: 'Ojo con el paréntesis: sin él, el exponente solo toca al 2. Calcula primero la potencia de 2 y después pon el signo menos delante.' }),
            num('Calcula $(-2)^3$', -8, 'Base negativa con exponente impar: el resultado es negativo.', { hint: 'Aquí el paréntesis hace que el −2 completo se multiplique por sí mismo tres veces. Cuenta los factores negativos: ¿son una cantidad par o impar?' }),
            mc('$5^0 = \\;?$', ['$1$', '$0$', '$5$', 'No está definido'], 0, 'Toda base distinta de cero elevada a la 0 vale 1.', { hint: 'Piensa en la escalera de potencias: $5^2$, $5^1$… cada peldaño hacia abajo divide entre 5. ¿Qué queda al bajar un peldaño más desde $5^1$?' }),
            num('Calcula $2^{-3}$ (puedes escribir una fracción)', 0.125, '$2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$.', { hint: 'Un exponente negativo no hace negativo el número: lo manda al denominador. Escribe $\\tfrac{1}{2^3}$ y calcula; puedes responder con una fracción.', answerText: '$\\tfrac{1}{8}$' }),
            mc('$-(-2)^3 = \\;?$', ['$8$', '$-8$', '$6$', '$-6$'], 0, '$(-2)^3 = -8$, y su opuesto es $8$.', { hint: 'Hazlo por partes: primero $(-2)^3$ con su signo, y después aplica el signo menos de afuera, que le cambia el signo al resultado.' }),
            play('torre-producto', 'Dobla la hoja hasta tener exactamente 512 capas', { kind: 'ratio', start: 1, r: 2, target: 512, max: 12, unit: 'capas', period: 'doblez' },
              'Cada doblez duplica las capas: tras $n$ dobleces hay $2^n$. Como $512 = 2^9$, son 9 dobleces. Con 10 ya serían 1024: lo exponencial se dispara.', { hint: 'Cada doblez duplica las capas: 1, 2, 4, 8… ¿Cuántas veces hay que duplicar para llegar a 512? Cuenta los dobleces.' }),
            play('clasifica-cartas', 'Desliza cada potencia según el **signo** de su valor', {
              left: 'Negativo', right: 'Positivo',
              cards: [
                { text: '(−3)⁴', side: 'right', why: 'Cuatro factores −3: exponente par, positivo (81).' },
                { text: '−3⁴', side: 'left', why: 'El exponente solo toca al 3: −(81) = −81.' },
                { text: '(−3)³', side: 'left', why: 'Tres factores −3: exponente impar, negativo (−27).' },
                { text: '−(−3)³', side: 'right', why: '(−3)³ = −27 y su opuesto es 27.' },
                { text: '(−1)¹⁰⁰', side: 'right', why: 'Exponente par: 1.' },
                { text: '−(−2)²', side: 'left', why: '(−2)² = 4 y el menos de afuera lo vuelve −4.' },
                { text: '(−2)⁻³', side: 'left', why: '1/(−2)³ = 1/(−8) = −1/8: el exponente negativo no cambia el signo.' },
              ],
            }, 'Con paréntesis, el signo entra en la potencia: exponente par da positivo e impar da negativo. Sin paréntesis, $-a^n = -(a^n)$. El exponente negativo solo manda la potencia al denominador.', { hint: 'Fíjate si el signo está dentro del paréntesis. Si está, cuenta los factores negativos: par da positivo, impar da negativo. Sin paréntesis, el exponente solo toca al número y el menos queda afuera.' }),
            play('rellena-medios', 'Completa la escalera de potencias de 2: cada peldaño hacia abajo divide entre 2', { first: 16, last: 0.25, k: 5, kind: 'geometrica', chips: [8, 4, 2, 1, 0.5, 0, -2, -1] },
              'De $2^4 = 16$ hacia abajo cada peldaño divide entre 2: $8, 4, 2$, luego $2^0 = 1$, $2^{-1} = 0.5$ y $2^{-2} = 0.25$. Ningún peldaño es 0 ni negativo: las potencias de 2 siempre son positivas.', { hint: 'Cada peldaño se divide entre 2. Después del 1 viene la mitad de 1, y así sigue: los exponentes negativos dan fracciones, nunca números negativos.' }),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: '2⁻³ = −8', truth: false, why: '2⁻³ = 1/2³ = 1/8: el exponente negativo pone una fracción, no un signo.' },
                { text: '0⁵ = 0', truth: true, why: '0 · 0 · 0 · 0 · 0 = 0.' },
                { text: '7⁰ = 0', truth: false, why: 'Toda base no nula a la cero vale 1.' },
                { text: '(2/3)⁻² = 9/4', truth: true, why: 'El exponente negativo voltea la fracción: (3/2)² = 9/4.' },
                { text: '(−5)² = −5²', truth: false, why: '(−5)² = 25 pero −5² = −25.' },
              ],
            }, 'Las trampas de siempre: $a^{-n} = \\dfrac{1}{a^n}$ (no un negativo), $a^0 = 1$ para $a \\ne 0$, $0^n = 0$ para $n > 0$, y el paréntesis decide si el signo entra en la potencia.', { hint: 'Tres reglas para revisar las tarjetas: toda base no nula a la 0 vale 1, un exponente negativo da una fracción (no un signo) y en $-5^2$ el exponente no toca al menos.' }),
          ],
        },
        {
          id: 'alg-21b', title: 'Leyes de los exponentes',
          // Clase 9 (video/clase_leyes_exponentes): parte 1 aquí y parte 2 en `more` (tras el sexto ejercicio); escenas de respaldo hasta enlazar Bunny. Libro UdeA §1.4.
          more: [{ after: 6, scenes: [
            sc(6, 'Un exponente **negativo** es un cambio de piso: la potencia baja al denominador (o sube) y se vuelve positiva.', { steps: ['$a^{-n} = \\dfrac{1}{a^n} \\qquad \\dfrac{x^{-2}}{y^{-3}} = \\dfrac{y^3}{x^2}$', '$\\left(\\tfrac25\\right)^{-3} = \\left(\\tfrac52\\right)^3 = \\tfrac{125}{8}$'] }),
            sc(6, 'Para simplificar: primero los paréntesis (multiplicar exponentes), luego sumar o restar.', { steps: ['$(3x^{-2}y)^{-2} = \\dfrac{x^4}{9y^2}$', '$\\dfrac{(x^{-3}y^2)^{-4}}{(y^6x^{-4})^{-2}} = x^4y^4$'] }),
            sc(5, 'La **notación científica** usa potencias de 10: $a \\times 10^n$ con $1 \\le a < 10$.', { steps: ['$300\\,000\\,000 = 3 \\times 10^8 \\qquad 0.00000012 = 1.2 \\times 10^{-7}$'] }),
          ] }],
          clip: { scenes: [
            sc(5, 'Al multiplicar potencias de igual base, **se suman** los exponentes; al dividir, **se restan**.', { steps: ['$a^m \\cdot a^n = a^{m+n}$', '$\\dfrac{a^m}{a^n} = a^{m-n}$'] }),
            sc(5, 'Potencia de una potencia: **se multiplican** los exponentes.', { steps: ['$(a^m)^n = a^{mn}$', '$(ab)^n = a^n b^n$', '$\\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^{n}$'] }),
            sc(5, 'Con estas leyes simplificas expresiones con exponentes literales:', { steps: ['$\\dfrac{3^{n+2} - 3^n}{8 \\cdot 3^n}$', '$= \\dfrac{3^n (3^2 - 1)}{8 \\cdot 3^n}$', '$= \\dfrac{8}{8} = 1$'] }),
            sc(4, 'La **notación científica** usa potencias de 10 para números muy grandes o muy pequeños.', { steps: ['$300\\,000\\,000 = 3 \\times 10^8$', '$0.00042 = 4.2 \\times 10^{-4}$'] }),
          ] },
          ex: [
            mc('$x^3 \\cdot x^5 = \\;?$', ['$x^8$', '$x^{15}$', '$x^2$', '$2x^8$'], 0, 'Misma base: se suman los exponentes, $3 + 5 = 8$.', { hint: 'Escribe los factores: $x^3$ son tres $x$ multiplicadas y $x^5$ son cinco. ¿Cuántas $x$ hay en total?' }),
            mc('$(x^5)^2 = \\;?$', ['$x^{10}$', '$x^7$', '$x^{25}$', '$x^3$'], 0, 'Potencia de potencia: $5 \\cdot 2 = 10$.', { hint: 'Elevar al cuadrado es multiplicar por sí mismo: $x^5 \\cdot x^5$. ¿Cuántas $x$ quedan multiplicadas?' }),
            mc('Escribe sin exponentes negativos: $(2x^3y^{-2})^{-2}$', ['$\\dfrac{y^4}{4x^6}$', '$\\dfrac{4x^6}{y^4}$', '$-4x^6y^4$', '$\\dfrac{y^4}{2x^6}$'], 0, '$2^{-2}x^{-6}y^{4} = \\dfrac{y^4}{4x^6}$.', { hint: 'Primero el exponente de afuera va a cada factor: multiplica cada exponente por $-2$, también el del 2. Luego pasa los exponentes negativos al otro piso de la fracción.' }),
            mc('Simplifica $\\dfrac{2^x \\cdot 4^{x+1}}{8^x}$', ['$4$', '$2^x$', '$8$', '$4^x$'], 0, '$\\dfrac{2^x \\cdot 2^{2x+2}}{2^{3x}} = 2^{x + 2x + 2 - 3x} = 2^2 = 4$.', { hint: 'Escribe todo en base 2: $4 = 2^2$ y $8 = 2^3$. Después suma los exponentes de arriba y resta el de abajo; las $x$ se cancelan.' }),
            num('¿Cuánto es $3.2 \\times 10^4$?', 32000, 'Mueve la coma 4 lugares a la derecha.', { hint: 'Multiplicar por $10^4$ corre la coma cuatro lugares a la derecha; rellena con ceros los lugares vacíos.' }),
            ord('Ordena de menor a mayor', ['$2^{-2}$', '$2^{0}$', '$2^{1}$', '$2^{3}$'], '$\\tfrac14 < 1 < 2 < 8$.', { hint: 'Calcula cada potencia: un exponente negativo da una fracción menor que 1, y cualquier base no nula a la 0 vale 1.' }),
            // --- Parte 2: negativos y simplificación ---
            play('une-parejas', 'Une cada expresión con su forma simplificada', {
              left: ['x⁴ · x⁶', '(x³)⁴', 'x⁷ / x²', '(3x)²', 'x⁻³'],
              right: ['x¹⁰', 'x¹²', 'x⁵', '9x²', '1/x³', 'x²⁴', '3x²'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'Multiplicar suma exponentes ($x^{10}$), potencia de potencia los multiplica ($x^{12}$), dividir los resta ($x^5$), el exponente de un producto va a cada factor ($9x^2$) y el negativo cambia de piso ($\\tfrac{1}{x^3}$). $x^{24}$ y $3x^2$ son las trampas.', { hint: 'Misma base al multiplicar: se suman exponentes; potencia de potencia: se multiplican; al dividir: se restan. En $(3x)^2$ el exponente va al 3 y a la $x$, y un exponente negativo cambia de piso.' }),
            play('ordena-terminos', 'Ordena los pasos para simplificar $(3x^{-2}y^3)^{-2}$', { tex: '(3x^{-2}y^3)^{-2}', chips: ['3⁻²x⁴y⁻⁶', 'x⁴ / (3²y⁶)', 'x⁴ / (9y⁶)', '3⁻²x⁻⁴y⁻⁶', '9x⁴ / y⁶'], order: [0, 1, 2], sep: '=' },
              'Primero el paréntesis: cada exponente se multiplica por $-2$ ($3^{-2}x^{4}y^{-6}$). Luego los negativos cambian de piso: $\\dfrac{x^4}{3^2y^6}$, y $3^2 = 9$. Las fichas $3^{-2}x^{-4}y^{-6}$ (signo mal) y $\\dfrac{9x^4}{y^6}$ (pisos al revés) sobran.', { hint: 'Primero reparte el exponente de afuera: multiplica cada exponente por $-2$, sin olvidar el del 3. Después manda los exponentes negativos al otro piso y calcula la potencia del 3.' }),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿la ley es **verdadera** o **falsa**?', {
              cards: [
                { text: '(a + b)² = a² + b²', truth: false, why: 'El exponente no se reparte en sumas: (1 + 1)² = 4 pero 1 + 1 = 2.' },
                { text: '(ab)ⁿ = aⁿ · bⁿ', truth: true, why: 'El exponente de un producto va a cada factor.' },
                { text: 'aᵐ · bⁿ = (ab)ᵐ⁺ⁿ', truth: false, why: 'Solo se suman exponentes con la misma base.' },
                { text: '(aᵐ)ⁿ = aᵐⁿ', truth: true, why: 'Potencia de potencia: se multiplican.' },
                { text: '2ˣ · 2ˣ = 4ˣ', truth: true, why: '2ˣ · 2ˣ = 2²ˣ = (2²)ˣ = 4ˣ.' },
                { text: 'a⁻ⁿ = −aⁿ', truth: false, why: 'a⁻ⁿ = 1/aⁿ: una fracción, no un negativo.' },
              ],
            }, 'Las leyes valen para productos, cocientes y potencias, nunca para sumas: $(a + b)^n \\ne a^n + b^n$. Y solo se suman exponentes cuando la base es la misma.', { hint: 'Las leyes valen para productos, cocientes y potencias, nunca para sumas. Si dudas, prueba la igualdad con números pequeños, como $a = 1$, $b = 1$ o $x = 2$.' }),
            mc('Simplifica $\\dfrac{(x^{-2}y^3)^{-3}}{(y^4x^{-5})^{-2}}$', ['$\\dfrac{1}{x^4y}$', '$x^4y$', '$x^{16}y^{-17}$', '$\\dfrac{y}{x^4}$'], 0, 'Arriba: $x^{6}y^{-9}$; abajo: $y^{-8}x^{10}$. Dividiendo: $x^{6 - 10}\\,y^{-9 + 8} = x^{-4}y^{-1} = \\dfrac{1}{x^4y}$.', { hint: 'Primero los paréntesis: multiplica los exponentes de adentro por el de afuera, arriba y abajo. Luego, para cada letra, resta el exponente de abajo al de arriba.' }),
            mc('Simplifica $\\dfrac{2^{n+1}}{(2^{n-1})^{n}} \\div \\dfrac{4^{n+1}}{(2^{n-1})^{n+1}}$', ['$\\tfrac14$', '$\\tfrac12$', '$1$', '$2$'], 0, 'Dividir es multiplicar por el recíproco: $\\dfrac{2^{n+1}}{2^{n(n-1)}} \\cdot \\dfrac{2^{(n-1)(n+1)}}{2^{2n+2}}$. Los exponentes: $(n + 1) - n(n - 1) + (n - 1)(n + 1) - (2n + 2) = n + 1 - n^2 + n + n^2 - 1 - 2n - 2 = -2$. Queda $2^{-2} = \\tfrac14$. Compruébalo con $n = 1$: $\\tfrac{4}{1} \\div \\tfrac{16}{1} = \\tfrac14$.', { hint: 'Pasa todo a base 2 ($4 = 2^2$) y cambia la división por una multiplicación por el recíproco. Al sumar y restar exponentes, los términos con $n^2$ se cancelan. Si te enredas, prueba con $n = 1$.' }),
            mc('Simplifica $\\dfrac{3^{p+1}}{(3^{p})^{p-1}} \\div \\dfrac{9^{p+1}}{(3^{p-1})^{p+1}}$', ['$\\tfrac19$', '$\\tfrac13$', '$1$', '$3$'], 0, 'Con $9 = 3^2$ todo queda en base 3: exponentes $(p + 1) - p(p - 1) + (p - 1)(p + 1) - 2(p + 1) = p + 1 - p^2 + p + p^2 - 1 - 2p - 2 = -2$. Resultado $3^{-2} = \\tfrac19$.', { hint: 'Igual que con base 2: escribe $9 = 3^2$, divide multiplicando por el recíproco y suma los exponentes. También puedes probar con $p = 1$ y comparar con las opciones.' }),
          ],
        },
        {
          id: 'alg-22a', title: 'Raíces y exponentes racionales',
          // Clase 10 (video/clase_raices): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration). Libro UdeA §1.5.
          clip: { scenes: [
            sc(5, 'La raíz $n$-ésima deshace la potencia: $\\sqrt[n]{a} = b$ significa $b^n = a$.', { steps: ['$\\sqrt{49} = 7$', '$\\sqrt[3]{-8} = -2$', '$\\sqrt{-4}$ no es un número real'] }),
            sc(5, 'Un exponente fraccionario es una raíz: el denominador es el índice.', { title: '$a^{m/n} = \\sqrt[n]{a^m} = \\left(\\sqrt[n]{a}\\right)^m$', steps: ['$8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2 = 4$'] }),
            sc(5, 'Ojo: la raíz cuadrada de un cuadrado es el **valor absoluto**.', { title: '$\\sqrt{x^2} = |x|$', viz: { type: 'graph', xr: [-4, 4], yr: [-1, 4.5], f: x => Math.abs(x), draw: true } }),
            sc(4, 'Y la raíz **no** se reparte en una suma:', { steps: ['$\\sqrt{9 + 16} = \\sqrt{25} = 5$', '$\\sqrt{9} + \\sqrt{16} = 7$', '$\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}$'] }),
          ] },
          ex: [
            num('Calcula $27^{2/3}$', 9, '$\\left(\\sqrt[3]{27}\\right)^2 = 3^2 = 9$.', { hint: 'El denominador del exponente es el índice de la raíz y el numerador es la potencia: primero saca la raíz cúbica de 27 y después eleva al cuadrado.' }),
            num('Calcula $\\left(\\dfrac{27}{125}\\right)^{-1/3}$ (puedes escribir una fracción)', 5 / 3, 'Invierte y saca raíz cúbica: $\\left(\\tfrac{125}{27}\\right)^{1/3} = \\tfrac{5}{3}$.', { hint: 'El exponente negativo voltea la fracción y el $\\tfrac13$ pide raíz cúbica. Busca qué número al cubo da 27 y cuál da 125; puedes responder con una fracción.', tol: 0.01, answerText: '$\\tfrac{5}{3}$' }),
            mc('$\\sqrt{x^2} = \\;?$', ['$|x|$', '$x$', '$-x$', '$\\pm x$'], 0, 'Si $x = -3$: $\\sqrt{9} = 3 = |-3|$.', { hint: 'Prueba con un número negativo, por ejemplo $x = -3$: calcula $(-3)^2$ y luego su raíz. ¿Volviste al −3?' }),
            mc('¿Es cierto que $\\sqrt{a + b} = \\sqrt{a} + \\sqrt{b}$?', ['No, en general es falso', 'Sí, siempre', 'Solo si $a$ y $b$ son negativos', 'Solo para raíces cúbicas'], 0, 'Contraejemplo: $\\sqrt{9 + 16} = 5$ pero $3 + 4 = 7$.', { hint: 'Prueba con números que tengan raíz exacta, como $a = 36$ y $b = 64$, y compara los dos lados.' }),
            play('lado-del-cuadrado', 'Estira el cuadrado hasta que su área sea la pedida: su lado es la raíz cuadrada', { rounds: [{ area: 36 }, { area: 12.25 }, { area: 3 }], max: 10, step: 0.05, tol: 0.05 },
              'La raíz cuadrada es el lado del cuadrado con esa área: $\\sqrt{36} = 6$, $\\sqrt{12.25} = 3.5$ y $\\sqrt{3} \\approx 1.73$, un número que no termina ni se repite pero es un lado perfectamente real.', { hint: 'El área de un cuadrado es lado por lado. Busca un número que multiplicado por sí mismo dé el área pedida; si no es exacto, ajusta fino con − y +.' }),
            play('une-parejas', 'Une cada potencia de exponente fraccionario con su valor', {
              left: ['27^(1/3)', '32^(3/5)', '49^(−1/2)', '(−8)^(1/3)', '9^(3/2)'],
              right: ['3', '8', '1/7', '−2', '27', '1/49', '6'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'El denominador es el índice y el numerador la potencia: $\\sqrt[3]{27} = 3$, $(\\sqrt[5]{32})^3 = 2^3 = 8$, $49^{-1/2} = \\tfrac{1}{\\sqrt{49}} = \\tfrac17$, $\\sqrt[3]{-8} = -2$ y $(\\sqrt9)^3 = 27$.', { hint: 'En $a^{m/n}$ el denominador $n$ es el índice de la raíz y el numerador $m$ la potencia: saca primero la raíz y después eleva. Un exponente negativo pone el resultado en el denominador.' }),
            play('clasifica-cartas', 'Desliza cada raíz: ¿es un **número real** o **no**?', {
              left: 'No es real', right: 'Es real',
              cards: [
                { text: '√(−4)', side: 'left', why: 'Índice par con radicando negativo: ningún real al cuadrado da −4.' },
                { text: '∛(−8)', side: 'right', why: 'Índice impar: (−2)³ = −8, así que vale −2.' },
                { text: '√0', side: 'right', why: '0² = 0: vale 0.' },
                { text: '(−16)^(1/4)', side: 'left', why: 'Es la raíz cuarta de −16: índice par, radicando negativo.' },
                { text: '(−32)^(1/5)', side: 'right', why: 'Raíz quinta de −32: (−2)⁵ = −32, vale −2.' },
                { text: '√((−3)²)', side: 'right', why: '(−3)² = 9 y √9 = 3: el radicando ya es positivo.' },
              ],
            }, 'Con índice impar siempre hay raíz real, aun de negativos. Con índice par el radicando debe ser $\\ge 0$; ojo que $(-3)^2 = 9$ es positivo, así que $\\sqrt{(-3)^2} = 3 = |-3|$.', { hint: 'Mira el índice: si es impar, siempre hay raíz real, aun de un negativo. Si es par, lo de adentro no puede ser negativo. Calcula primero lo que haya dentro del radical.' }),
            mc('¿Qué valor de $x$ satisface $\\sqrt{x} = 4$?', ['$x = 16$', '$x = 2$', '$x = 8$', '$x = 64$'], 0, 'La raíz deshace el cuadrado: $x = 4^2 = 16$. Comprueba: $\\sqrt{16} = 4$.', { hint: 'La raíz deshace el cuadrado, y el cuadrado deshace la raíz: eleva los dos lados al cuadrado.' }),
            mc('¿Cuál es el valor de $\\sqrt[3]{-64}$?', ['$-4$', '$4$', '$-8$', 'No es real'], 0, 'Índice impar: $(-4)^3 = -64$. Las raíces cúbicas de negativos sí existen.', { hint: '¿Qué número multiplicado por sí mismo tres veces da 64? Con índice impar, el signo negativo se conserva.' }),
            num('Si $x = \\sqrt{36}$, ¿cuánto vale $x^2$?', 36, '$x = 6$ y $6^2 = 36$: elevar al cuadrado deshace la raíz.', { hint: 'No hace falta calcular la raíz: elevar al cuadrado deshace la raíz cuadrada.' }),
            mc('$\\sqrt{a^2}$ con $a = -7$ vale', ['$7$', '$-7$', '$49$', '$-49$'], 0, '$(-7)^2 = 49$ y $\\sqrt{49} = 7 = |-7|$: la raíz cuadrada nunca es negativa.', { hint: 'Primero eleva al cuadrado (el resultado es positivo) y después saca la raíz. La raíz cuadrada nunca da un resultado negativo.' }),
          ],
        },
        {
          id: 'alg-22b', title: 'Simplificar y racionalizar',
          // Clase 11 (video/clase_radicales): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration). Libro UdeA §1.5.
          clip: { scenes: [
            sc(5, 'Para simplificar un radical, extrae los factores que son potencias exactas.', { steps: ['$\\sqrt{50} = \\sqrt{25 \\cdot 2}$', '$= 5\\sqrt{2}$'] }),
            sc(5, 'Solo se suman radicales **semejantes** (mismo índice y mismo radicando).', { steps: ['$3\\sqrt2 + 5\\sqrt2 = 8\\sqrt2$', '$\\sqrt2 + \\sqrt3$ no se simplifica'] }),
            sc(6, '**Racionalizar** es quitar la raíz del denominador. Con un binomio, multiplica por el **conjugado**.', { steps: ['$\\dfrac{9}{4 + \\sqrt5} \\cdot \\dfrac{4 - \\sqrt5}{4 - \\sqrt5}$', '$= \\dfrac{9(4 - \\sqrt5)}{16 - 5}$', '$= \\dfrac{9(4 - \\sqrt5)}{11}$'] }),
          ] },
          ex: [
            num('Si $\\sqrt{32} = k\\sqrt{2}$, ¿cuánto vale $k$?', 4, '$\\sqrt{32} = \\sqrt{16 \\cdot 2} = 4\\sqrt2$.', { hint: 'Busca el cuadrado perfecto más grande que divide a 32 y sepáralo: $\\sqrt{32} = \\sqrt{\\square \\cdot 2}$. Su raíz sale afuera.', prefix: '$k =$' }),
            mc('Simplifica $\\sqrt{48} + 2\\sqrt{27} - \\sqrt{12}$', ['$8\\sqrt3$', '$10\\sqrt3$', '$\\sqrt{63}$', '$12\\sqrt3$'], 0, '$4\\sqrt3 + 6\\sqrt3 - 2\\sqrt3 = 8\\sqrt3$.', { hint: 'Simplifica cada radical por separado sacando el cuadrado perfecto que tiene adentro (todos esconden un $\\sqrt3$). Luego suma los coeficientes, como si $\\sqrt3$ fuera una $x$.' }),
            mc('Racionaliza $\\dfrac{6}{\\sqrt5 - \\sqrt2}$', ['$2(\\sqrt5 + \\sqrt2)$', '$6(\\sqrt5 + \\sqrt2)$', '$2(\\sqrt5 - \\sqrt2)$', '$\\dfrac{6}{3}$'], 0, 'Multiplica por el conjugado: el denominador queda $5 - 2 = 3$.', { hint: 'Multiplica arriba y abajo por el conjugado: la misma resta con el signo cambiado. Abajo, suma por diferencia borra las raíces.' }),
            ord('Ordena los pasos para racionalizar $\\dfrac{1}{\\sqrt7}$', ['$\\dfrac{1}{\\sqrt7}$', '$\\dfrac{1}{\\sqrt7} \\cdot \\dfrac{\\sqrt7}{\\sqrt7}$', '$\\dfrac{\\sqrt7}{7}$'], 'Multiplica arriba y abajo por $\\sqrt7$: abajo queda $7$.', { hint: 'Para quitar una raíz sola del denominador, multiplica arriba y abajo por esa misma raíz: $\\sqrt7 \\cdot \\sqrt7$ da un número sin raíz.' }),
            play('saca-del-radical', 'Saca del radical las parejas (o tríos) de primos iguales', { rounds: [{ index: 2, n: 98 }, { index: 2, n: 75 }, { index: 3, n: 250 }] },
              'Cada pareja de primos iguales sale de la raíz cuadrada como un solo factor: $\\sqrt{98} = \\sqrt{2 \\cdot 7 \\cdot 7} = 7\\sqrt2$ y $\\sqrt{75} = \\sqrt{3 \\cdot 5 \\cdot 5} = 5\\sqrt3$. En la raíz cúbica salen los tríos: $\\sqrt[3]{250} = \\sqrt[3]{2 \\cdot 5^3} = 5\\sqrt[3]{2}$.', { hint: 'Las fichas ya son los factores primos. En raíz cuadrada sale un factor por cada pareja igual; en raíz cúbica, uno por cada trío.' }),
            play('une-parejas', 'Une cada fracción con su forma racionalizada', {
              left: ['1/√3', '4/√2', '5/(1 + √2)', '2/(3 − √5)'],
              right: ['√3 / 3', '2√2', '5(√2 − 1)', '(3 + √5) / 2', '5(√2 + 1)', '(3 − √5) / 2'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'Con un radical solo se multiplica por él: $\\tfrac{1}{\\sqrt3} = \\tfrac{\\sqrt3}{3}$ y $\\tfrac{4}{\\sqrt2} = \\tfrac{4\\sqrt2}{2} = 2\\sqrt2$. Con un binomio, por el conjugado: $\\tfrac{5(\\sqrt2 - 1)}{2 - 1} = 5(\\sqrt2 - 1)$ y $\\tfrac{2(3 + \\sqrt5)}{9 - 5} = \\tfrac{3 + \\sqrt5}{2}$. Las dos fichas sobrantes tienen el conjugado al revés.', { hint: 'Si abajo hay una raíz sola, multiplica por ella. Si hay una suma o resta con raíz, multiplica por el conjugado (signo cambiado) y usa $(a + b)(a - b) = a^2 - b^2$.' }),
            play('ordena-terminos', 'Ordena los pasos para racionalizar $\\dfrac{6}{3 + \\sqrt7}$', { tex: '\\dfrac{6}{3 + \\sqrt7}', chips: ['6(3−√7)/(3²−(√7)²)', '6(3−√7)/2', '3(3−√7)', '6(3+√7)/(3²+(√7)²)', '6(3+√7)/2'], order: [0, 1, 2], sep: '=' },
              'Se multiplica arriba y abajo por el conjugado $3 - \\sqrt7$; abajo, suma por diferencia: $3^2 - (\\sqrt7)^2 = 9 - 7 = 2$, y $\\tfrac{6}{2} = 3$. Las fichas con $3 + \\sqrt7$ arriba o con $+$ abajo son las trampas.', { hint: 'El conjugado de $3 + \\sqrt7$ tiene el signo del medio cambiado. Abajo queda $3^2 - (\\sqrt7)^2$; después simplifica el 6 de arriba con lo que dé abajo.' }),
            mc('¿Cuál es el resultado de racionalizar el denominador de $\\dfrac{3}{\\sqrt5}$?', ['$\\dfrac{3\\sqrt5}{5}$', '$\\dfrac{5\\sqrt3}{5}$', '$\\dfrac{\\sqrt{15}}{5}$', '$\\dfrac{3}{5\\sqrt5}$'], 0, 'Se multiplica por $\\tfrac{\\sqrt5}{\\sqrt5}$: $\\dfrac{3\\sqrt5}{5}$.', { hint: 'Multiplica arriba y abajo por $\\sqrt5$: abajo queda $\\sqrt5 \\cdot \\sqrt5$, un número sin raíz.' }),
            mc('Racionaliza el denominador de $\\dfrac{5}{2\\sqrt3}$', ['$\\dfrac{5\\sqrt3}{6}$', '$\\dfrac{2\\sqrt3}{5}$', '$\\dfrac{10\\sqrt3}{3}$', '$\\dfrac{\\sqrt{15}}{6}$'], 0, '$\\dfrac{5}{2\\sqrt3} \\cdot \\dfrac{\\sqrt3}{\\sqrt3} = \\dfrac{5\\sqrt3}{2 \\cdot 3} = \\dfrac{5\\sqrt3}{6}$.', { hint: 'Solo hay que quitar la raíz: multiplica arriba y abajo por $\\sqrt3$ (no por todo el denominador). El 2 de abajo se queda y se multiplica por lo que salga.' }),
            mc('Al simplificar y racionalizar $\\dfrac{5}{\\sqrt{x + 5} - \\sqrt{x}}$ se obtiene', ['$\\sqrt{x + 5} + \\sqrt{x}$', '$5$', '$x$', '$\\dfrac{\\sqrt{x + 5} + \\sqrt{x}}{5}$'], 0, 'Por el conjugado: abajo queda $(x + 5) - x = 5$, que se cancela con el 5 de arriba.', { hint: 'Multiplica por el conjugado. Abajo, $(\\sqrt{x + 5})^2 - (\\sqrt{x})^2$ deja solo un número: compáralo con el 5 de arriba.' }),
            mc('¿Cuál es el resultado de racionalizar $\\dfrac{1}{\\sqrt[3]{3} - \\sqrt[3]{2}}$?', ['$\\sqrt[3]{9} + \\sqrt[3]{6} + \\sqrt[3]{4}$', '$\\sqrt[3]{19}$', '$19$', '$\\sqrt[3]{9} - \\sqrt[3]{6} + \\sqrt[3]{4}$'], 0, 'Diferencia de cubos: se multiplica por $\\sqrt[3]{9} + \\sqrt[3]{6} + \\sqrt[3]{4}$ y abajo queda $3 - 2 = 1$.', { hint: 'Con raíces cúbicas el conjugado no basta: usa la diferencia de cubos $(a - b)(a^2 + ab + b^2) = a^3 - b^3$ con $a = \\sqrt[3]{3}$ y $b = \\sqrt[3]{2}$.' }),
            mc('¿Cuál es el valor de $\\sqrt{63}$ simplificado?', ['$3\\sqrt7$', '$9\\sqrt7$', '$7\\sqrt3$', '$21\\sqrt3$'], 0, '$63 = 9 \\cdot 7$ y $\\sqrt{9} = 3$.', { hint: 'Busca un cuadrado perfecto que divida a 63 (prueba con 4, 9, 16…) y saca su raíz afuera del radical.' }),
          ],
        },
      ],
    },
    {
      title: 'Expresiones algebraicas y números complejos',
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
        {
          id: 'alg-23c', title: 'Números complejos',
          // Libro UdeA §2.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'La **unidad imaginaria** $i$ es el número cuyo cuadrado es $-1$. Un **complejo** es $z = a + bi$: parte real $a$ y parte imaginaria $b$.', { title: '$i^2 = -1$', steps: ['$\\sqrt{-r} = \\sqrt{r}\\,i$ para $r > 0$', '$\\sqrt{-9} = 3i \\qquad i^3 = -i \\qquad i^4 = 1$'] }),
            sc(6, 'Se suman y restan por partes; se multiplican como binomios recordando que $i^2 = -1$.', { steps: ['$(a + bi) + (c + di) = (a + c) + (b + d)i$', '$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$'] }),
            sc(6, 'El **conjugado** $\\bar z = a - bi$ y el **módulo** $|z| = \\sqrt{a^2 + b^2}$. Para dividir se multiplica arriba y abajo por el conjugado del divisor.', { steps: ['$z \\bar z = a^2 + b^2 = |z|^2$', '$\\dfrac{1 + 4i}{5 - 12i} = \\dfrac{(1 + 4i)(5 + 12i)}{169} = -\\dfrac{43}{169} + \\dfrac{32}{169}i$'] }),
            sc(5, 'En el **plano complejo** la parte real va en el eje horizontal y la imaginaria en el vertical: $2 + 3i$ es el punto $(2, 3)$.', { steps: ['Los reales viven en el eje horizontal', '$i$ es el punto $(0, 1)$'] }),
          ] },
          ex: [
            mc('Sean $z = x + 3i$ y $w = -1 + yi$. Si $z - w = 5 + 6i$, entonces', ['$x = 4,\\ y = -3$', '$x = -4,\\ y = -3$', '$x = 3,\\ y = -4$', '$x = 3,\\ y = 4$'], 0, '$z - w = (x + 1) + (3 - y)i$. Igualando partes: $x + 1 = 5$ y $3 - y = 6$, así que $x = 4$ y $y = -3$.'),
            mc('El módulo del complejo $z = \\sqrt2 - \\sqrt3\\,i$ es', ['$\\sqrt5$', '$5$', '$13$', '$\\sqrt{13}$'], 0, '$|z| = \\sqrt{(\\sqrt2)^2 + (\\sqrt3)^2} = \\sqrt{2 + 3} = \\sqrt5$.'),
            mc('La forma estándar de $z = \\dfrac{1 + 3i}{1 - i}$ es', ['$-1 + 2i$', '$1 - 2i$', '$2 - i$', '$-2 + i$'], 0, 'Se multiplica por el conjugado $1 + i$: $\\dfrac{(1 + 3i)(1 + i)}{1 + 1} = \\dfrac{1 + i + 3i + 3i^2}{2} = \\dfrac{-2 + 4i}{2} = -1 + 2i$.'),
            num('$(2 + 5i)(2 - 5i) = \\;?$', 29, 'Un complejo por su conjugado da el módulo al cuadrado: $2^2 + 5^2 = 29$. También: $4 - 25i^2 = 4 + 25$.'),
            mc('Si $z = -\\sqrt3 + i$, el valor de $z^2$ es', ['$2 - 2\\sqrt3\\,i$', '$4 - 2\\sqrt3\\,i$', '$2 + 2\\sqrt3\\,i$', '$4 + 2\\sqrt3\\,i$'], 0, '$(-\\sqrt3 + i)^2 = 3 - 2\\sqrt3\\,i + i^2 = 3 - 1 - 2\\sqrt3\\,i = 2 - 2\\sqrt3\\,i$.'),
            mc('La forma estándar de $\\left(\\dfrac{\\sqrt{-16}\\,\\sqrt{-9}}{\\sqrt{-36}}\\right)^3$ es', ['$-8i$', '$8i$', '$-8$', '$8$'], 0, '$\\sqrt{-16}\\sqrt{-9} = (4i)(3i) = -12$ y $\\sqrt{-36} = 6i$: el cociente es $\\dfrac{-12}{6i} = \\dfrac{-2}{i} = 2i$. Entonces $(2i)^3 = 8i^3 = -8i$.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'i⁴ = 1', truth: true, why: 'i⁴ = (i²)² = (−1)² = 1.' },
                { text: 'El conjugado de 3 − 2i es −3 + 2i', truth: false, why: 'Solo cambia el signo de la parte imaginaria: 3 + 2i.' },
                { text: '|z| es siempre un número real no negativo', truth: true, why: 'Es la raíz cuadrada de a² + b².' },
                { text: '√(−9) = 3i', truth: true, why: '(3i)² = 9i² = −9.' },
                { text: '(a + bi)(a − bi) = a² − b²', truth: false, why: 'Da a² + b²: el −b²i² se vuelve +b².' },
              ],
            }, 'Las potencias de $i$ se repiten cada cuatro: $i, -1, -i, 1$. El conjugado cambia el signo de la parte imaginaria y $z \\bar z = a^2 + b^2 = |z|^2 \\ge 0$.'),
          ],
        },
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
      ],
    },
    {
      title: 'Intervalos, inecuaciones, razones y proporciones',
      lessons: [
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
          id: 'alg-13b', title: 'Interés simple y compuesto',
          // Clase 4 (video/clase_interes_sc): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(6, 'El **interés** es lo que gana el dinero prestado; el **monto** es capital más interés.', { title: '$M = C + I$', steps: ['$C$ capital · $r$ tasa por periodo · $t$ periodos', '500.000 al 2 % mensual: $I_{\\text{mes}} = 500\\,000 \\cdot 0.02 = 10\\,000$'] }),
            sc(6, 'Interés **simple**: siempre sobre el capital inicial, cada periodo paga lo mismo. Crece en línea recta.', { title: '$I = C\\,r\\,t \\qquad M = C\\,(1 + r\\,t)$', steps: ['1.200.000 al 1.5 % mensual, 8 meses: $I = 144\\,000$', '$M = 1\\,200\\,000 \\cdot 1.12 = 1\\,344\\,000$'] }),
            sc(7, 'Interés **compuesto**: el interés se suma al capital y también gana interés. Crece en curva.', { title: '$M = C\\,(1 + r)^n$', steps: ['500.000 al 2 % mensual, 3 meses: $500\\,000 \\cdot 1.02^3 = 530\\,604$', '1.000.000 al 10 % anual, 10 años: simple 2.000.000 · compuesto 2.593.742'], viz: { type: 'graph', xr: [0, 10], yr: [0, 1.8], f: t => 1.1 ** t - 1, points: [[10, 1.59, 'compuesto 1.59']] } }),
          ] },
          ex: [
            play('cobra-intereses', 'Cobra mes a mes hasta juntar 180.000 pesos de interés', { capital: 1500000, rate: 0.01, target: 180000, months: 18 },
              'Con interés simple cada mes paga lo mismo: $1\\,500\\,000 \\cdot 0.01 = 15\\,000$. Para juntar $180\\,000$ hacen falta $180\\,000 / 15\\,000 = 12$ meses: $I = C\\,r\\,t$.'),
            play('clasifica-cartas', 'Desliza cada tabla de montos: ¿crece con interés **simple** o **compuesto**?', {
              left: 'Simple', right: 'Compuesto',
              cards: [
                { text: '100 → 110 → 120 → 130', side: 'left', why: 'Suma siempre 10: crece en recta.' },
                { text: '100 → 110 → 121 → 133.1', side: 'right', why: 'Multiplica siempre por 1.1: el interés gana interés.' },
                { text: '200 → 206 → 212.18 → 218.55', side: 'right', why: 'Multiplica por 1.03 cada periodo (206 · 1.03 = 212.18).' },
                { text: '400 → 420 → 440 → 460', side: 'left', why: 'Suma siempre 20: el 5 % del capital inicial.' },
                { text: '50 → 55 → 60.5 → 66.55', side: 'right', why: 'Multiplica por 1.1: 55 · 1.1 = 60.5.' },
              ],
            }, 'Con interés simple el monto sube siempre la misma cantidad (una recta); con compuesto se multiplica siempre por el mismo factor $1 + r$ (una curva): $110 \\cdot 1.1 = 121$, pero $110 + 10 = 120$.'),
            play('carrera-interes', 'Encuentra el primer mes en que el compuesto le saca más de 120.000 al simple', { capital: 3000000, rate: 0.02, months: 24, gap: 120000 },
              'Simple: $M = 3\\,000\\,000(1 + 0.02n)$. Compuesto: $M = 3\\,000\\,000(1.02)^n$. La ventaja crece cada mes: en el 14 es $\\approx 118\\,400$ y en el 15 ya es $\\approx 137\\,600$.'),
            play('ajusta-capital', 'Fija el capital que, al 3 % mensual compuesto, deja 1.125.509 en 4 meses', { rate: 0.03, periods: 4, target: 1125509, step: 50000, max: 2000000, tol: 1 },
              'Se despeja el capital de $M = C(1 + r)^n$: $C = \\dfrac{1\\,125\\,509}{1.03^4} = \\dfrac{1\\,125\\,509}{1.12551} \\approx 1\\,000\\,000$.'),
            play('mejor-oferta', 'Lleva el carrito al banco donde el millón queda convertido en más dinero', {
              prefer: 'high', noun: 'Banco',
              rounds: [
                { price: 1000000, a: { label: '1.2 % mensual simple, 10 meses', changes: [12] }, b: { label: '1 % mensual compuesto, 10 meses', changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] } },
                { price: 1000000, a: { label: '8 % anual simple, 5 años', changes: [40] }, b: { label: '7 % anual compuesto, 5 años', changes: [7, 7, 7, 7, 7] } },
                { price: 1000000, a: { label: '2 % mensual compuesto, 6 meses', changes: [2, 2, 2, 2, 2, 2] }, b: { label: '12.5 % semestral simple', changes: [12.5] } },
              ],
            }, 'Se comparan los montos. Ronda 1: simple $1.12 \\Rightarrow 1\\,120\\,000$ contra $1.01^{10} = 1.1046 \\Rightarrow 1\\,104\\,622$: gana el simple. Ronda 2: $1.40 \\Rightarrow 1\\,400\\,000$ contra $1.07^5 = 1.4026 \\Rightarrow 1\\,402\\,552$: gana el compuesto. Ronda 3: $1.02^6 = 1.1262 \\Rightarrow 1\\,126\\,162$ contra $1\\,125\\,000$: gana el compuesto por poco. La tasa y el plazo pesan más que el tipo de interés.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Al 2 % mensual simple, en 12 meses se gana el 24 % del capital', truth: true, why: 'Interés simple: 2 % · 12 = 24 %.' },
                { text: 'A largo plazo el interés compuesto siempre supera al simple', truth: true, why: '(1 + r)ⁿ crece más rápido que 1 + rn.' },
                { text: 'En el primer periodo, simple y compuesto ganan lo mismo', truth: true, why: 'Los dos pagan C · r la primera vez; la diferencia empieza en el segundo.' },
                { text: 'Con interés compuesto, duplicar la tasa duplica el monto', truth: false, why: '(1 + 2r)ⁿ no es el doble de (1 + r)ⁿ: al 10 % y 20 % en 2 años, 1.21 y 1.44.' },
                { text: 'M = C(1 + r)ⁿ es la fórmula del interés simple', truth: false, why: 'Esa es la del compuesto; el simple es M = C(1 + rt).' },
              ],
            }, 'Simple: $M = C(1 + rt)$, el interés es siempre $Cr$. Compuesto: $M = C(1 + r)^n$, cada periodo multiplica. Coinciden en el primer periodo y después el compuesto gana cada vez más.'),
          ],
        },
      ],
    },
    {
      title: 'Relaciones, funciones y operaciones',
      lessons: [
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
      ],
    },
    {
      title: 'Funciones inversas',
      lessons: [
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
      title: 'Funciones exponenciales y logarítmicas',
      lessons: [
        {
          id: 'alg-71', title: 'Función exponencial',
          // Libro UdeA §7.1–7.2. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'La **función exponencial** $f(x) = a^x$ ($a > 0$, $a \\ne 1$) tiene dominio $\\mathbb{R}$ y rango $(0, \\infty)$: nunca toca el eje $x$.', { title: '$f(x) = 2^x$', viz: { type: 'graph', xr: [-3, 3], yr: [0, 8], f: x => 2 ** x, points: [[0, 1, '(0, 1)'], [2, 4, '(2, 4)'], [-1, 0.5, '(−1, 0.5)']] } }),
            sc(6, 'Si $a > 1$ **crece**; si $0 < a < 1$ **decrece**. El eje $x$ es una **asíntota horizontal**.', { steps: ['$2^x$: $\\tfrac18, \\tfrac14, \\tfrac12, 1, 2, 4, 8$', '$(\\tfrac12)^x$: la misma lista al revés'] }),
            sc(6, 'El número $e \\approx 2.71828$ es el límite de $(1 + \\tfrac1n)^n$. $f(x) = e^x$ es la exponencial **natural**, la de los crecimientos continuos.', { steps: ['$P(t) = P_0\\,e^{kt}$ modela poblaciones y desintegración'] }),
            sc(6, 'Como la exponencial es biunívoca, para resolver $a^p = a^q$ basta igualar exponentes.', { steps: ['$3^{2x} = 81 = 3^4 \\Rightarrow 2x = 4 \\Rightarrow x = 2$', '$4^{x + 1} = 64 = 4^3 \\Rightarrow x = 2$'] }),
          ] },
          ex: [
            num('Si $f(x) = 3^x$, ¿cuál es el valor de $f(2)$?', 9, '$3^2 = 9$.'),
            mc('¿Cuál es el dominio de la función exponencial $f(x) = e^x$?', ['$(-\\infty, \\infty)$', '$(0, \\infty)$', '$(-\\infty, 0)$', '$[0, \\infty)$'], 0, 'Se puede elevar $e$ a cualquier real, positivo, negativo o cero.'),
            mc('¿Cuál es el rango de la función $f(x) = 2^x$?', ['$(0, \\infty)$', '$(-\\infty, \\infty)$', '$[0, 1]$', '$[-1, 1]$'], 0, 'Una potencia de base positiva siempre es positiva y puede ser tan grande o tan cercana a 0 como se quiera, pero nunca 0.'),
            mc('Resuelve la ecuación exponencial $3^{2x} = 81$', ['$x = 2$', '$x = 1$', '$x = 4$', '$x = 3$'], 0, '$81 = 3^4$, así que $2x = 4$ y $x = 2$.'),
            num('Resuelve $2^{x - 1} = 8$', 4, '$8 = 2^3$, entonces $x - 1 = 3$ y $x = 4$.'),
            mc('Resuelve la ecuación $4^{x + 1} = 64$', ['$x = 2$', '$x = 1$', '$x = 3$', '$x = 4$'], 0, '$64 = 4^3$: $x + 1 = 3$, $x = 2$.'),
            mc('Una población de hormigas era de 3000 en el año 2000 y crece de forma continua al 6 % anual, $P(t) = 3000\\,e^{0.06t}$. ¿Cuántas había en 2018?', ['$\\approx 8834$', '$\\approx 1833$', '$\\approx 32400$', '$\\approx 18834$'], 0, 'Con $t = 18$: $e^{0.06 \\cdot 18} = e^{1.08} \\approx 2.945$ y $3000 \\cdot 2.945 \\approx 8834$.'),
          ],
        },
        {
          id: 'alg-72', title: 'Logaritmos y sus propiedades',
          // Libro UdeA §7.3–7.4. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'El **logaritmo** es la inversa de la exponencial: $y = \\log_a x$ si y solo si $x = a^y$. Pregunta «¿a qué exponente elevo $a$ para obtener $x$?».', { steps: ['$\\log_2 8 = 3$ porque $2^3 = 8$', 'Dominio $(0, \\infty)$ · rango $\\mathbb{R}$'] }),
            sc(6, '**Propiedades**: el logaritmo convierte productos en sumas, cocientes en restas y potencias en productos.', { steps: ['$\\log_a(xy) = \\log_a x + \\log_a y \\qquad \\log_a \\tfrac{x}{y} = \\log_a x - \\log_a y$', '$\\log_a x^b = b \\log_a x \\qquad \\log_a 1 = 0 \\qquad \\log_a a = 1$'] }),
            sc(5, 'Dos bases famosas: $\\ln x = \\log_e x$ (natural) y $\\log x = \\log_{10} x$ (común). Cambio de base: $\\log_a x = \\dfrac{\\log_c x}{\\log_c a}$.', { steps: ['$\\log_3 x + \\log_4 x = 4 \\Rightarrow \\ln x\\left(\\tfrac{1}{\\ln 3} + \\tfrac{1}{\\ln 4}\\right) = 4$'] }),
            sc(6, 'Para resolver ecuaciones: junta los logaritmos en uno solo y pasa a forma exponencial. **Comprueba** que las soluciones estén en el dominio.', { steps: ['$\\log x + \\log(x + 15) = 2 \\Rightarrow x(x + 15) = 100 \\Rightarrow x = 5$ (el $-20$ no sirve)'] }),
          ] },
          ex: [
            mc('¿Cuál es el dominio de la función $f(x) = \\log(x)$?', ['$(0, \\infty)$', '$(-\\infty, 0)$', '$[0, \\infty)$', '$(-\\infty, \\infty)$'], 0, 'Solo los positivos tienen logaritmo: ninguna potencia de 10 da 0 ni un negativo.'),
            num('Si $f(x) = \\log_2(x)$, ¿cuál es el valor de $f(8)$?', 3, '$2^3 = 8$, así que $\\log_2 8 = 3$.'),
            mc('Si $\\log_a(b) = c$, ¿cómo se expresa en forma exponencial?', ['$a^c = b$', '$a = b^c$', '$b^a = c$', '$c = a^b$'], 0, 'El logaritmo es el exponente: la base $a$ elevada al resultado $c$ da el argumento $b$.'),
            num('Resuelve $\\log_2(x) = 3$', 8, 'En forma exponencial: $x = 2^3 = 8$.'),
            mc('Resuelve $\\log_3(x) + \\log_3(4) = 2$', ['$x = \\tfrac94$', '$x = 5$', '$x = 8$', '$x = 3$'], 0, 'Se juntan: $\\log_3(4x) = 2$, luego $4x = 9$ y $x = \\tfrac94$.'),
            num('Si $\\log_5(a) = 2$, ¿cuál es el valor de $\\log_5(a^3)$?', 6, 'La potencia sale como factor: $\\log_5 a^3 = 3 \\log_5 a = 3 \\cdot 2 = 6$.'),
            mc('Si $\\log_b(x) = p$, ¿cuál es $\\log_b\\!\\left(\\dfrac1x\\right)$?', ['$-p$', '$p$', '$\\tfrac1p$', '$p + 1$'], 0, '$\\log_b x^{-1} = -\\log_b x = -p$.'),
            mc('Una sustancia radiactiva tiene vida media de 40 minutos. Si hay 30 mg al inicio, a los 50 minutos quedan', ['$\\approx 12.613$ mg', '$\\approx 17.65$ mg', '$\\approx 10.56$ mg', '$\\approx 22.021$ mg'], 0, 'Cada 40 min se reduce a la mitad: $30 \\cdot (\\tfrac12)^{50/40} = 30 \\cdot 2^{-1.25} \\approx 30 \\cdot 0.4204 \\approx 12.613$ mg.'),
          ],
        },
      ],
    },
    {
      title: 'Algoritmo de la división y ceros polinomiales',
      lessons: [
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
        {
          id: 'alg-92', title: 'Residuo, factor y división sintética',
          // Libro UdeA §9.2–9.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, '**Algoritmo de la división**: $f(x) = g(x)\\,q(x) + r(x)$, con $r = 0$ o grado de $r$ menor que el de $g$.', { steps: ['$3x^4 + 2x^3 - x^2 - x - 6 = (x^2 + 1)(3x^2 + 2x - 4) - 3x - 2$'] }),
            sc(6, '**Teorema del residuo**: al dividir $f(x)$ entre $x - c$, el residuo es $f(c)$. No hace falta dividir.', { steps: ['$f(x) = x^4 + 5x^3 + 5x^2 - 4x - 7$ entre $x + 3$: $r = f(-3) = -4$'] }),
            sc(6, '**Teorema del factor**: $x - c$ es factor de $f(x)$ si y solo si $f(c) = 0$.', { steps: ['$f(x) = x^3 - 8x^2 + 19x - 20$: $f(5) = 0 \\Rightarrow x - 5$ es factor'] }),
            sc(7, '**División sintética** entre $x - c$: se bajan los coeficientes, se multiplica por $c$ y se suma; la última casilla es el residuo.', { steps: ['$3x^3 - 4x^2 - 2x - 7$ entre $x - 2$: $3 \\;\\; 2 \\;\\; 2 \\;\\; | -3$', 'cociente $3x^2 + 2x + 2$, residuo $-3$'] }),
          ] },
          ex: [
            mc('¿Cuál es el residuo de dividir $P(x) = x^3 - 2x + 4$ entre $x - 1$?', ['$3$', '$2$', '$4$', '$-1$'], 0, 'Teorema del residuo: $P(1) = 1 - 2 + 4 = 3$.'),
            num('¿Cuál es el residuo de dividir $P(x) = 2x^3 - x + 5$ entre $x - 1$?', 6, '$P(1) = 2 - 1 + 5 = 6$.'),
            mc('Si el residuo de dividir $P(x)$ entre $x - 4$ es 0, ¿qué podemos concluir?', ['$P(x)$ tiene una raíz en $x = 4$', '$P(x)$ tiene una raíz en $x = 0$', '$P(x)$ no tiene raíces', 'No se puede concluir nada'], 0, 'Residuo cero significa $P(4) = 0$: $x - 4$ es factor y $4$ es raíz.'),
            mc('¿Cuál es el cociente de dividir $x^3 + 3x^2 + 3x + 1$ entre $x + 1$ por división sintética?', ['$x^2 + 2x + 1$', '$x^2 + 3x$', '$x^2 + 3x + 3$', '$x + 1$'], 0, 'Con $c = -1$: coeficientes $1, 3, 3, 1 \\to 1, 2, 1, 0$. Cociente $x^2 + 2x + 1$ y residuo $0$: es $(x + 1)^3$.'),
            mc('Al dividir $2x^3 - 3x^2 + x - 4$ entre $x - 2$, el cociente y el residuo son', ['$2x^2 + x + 3$ y $2$', '$2x^2 - x + 3$ y $-2$', '$2x^2 + x - 3$ y $2$', '$2x^2 + 7x + 15$ y $26$'], 0, 'Sintética con $c = 2$: $2 \\to 2$; $-3 + 4 = 1$; $1 + 2 = 3$; $-4 + 6 = 2$. Cociente $2x^2 + x + 3$, residuo $2$.'),
            mc('El valor de $k$ para el cual $x + 1$ es factor de $P(x) = 2x^3 + (2 - k)x^2 - (k - 2)$ es', ['$k = 1$', '$k = -1$', '$k = 0$', '$k = 2$'], 0, 'Debe ser $P(-1) = 0$: $-2 + (2 - k) - (k - 2) = 2 - 2k = 0$, luego $k = 1$.'),
            num('Sin dividir, halla el residuo de $x^4 + 5x^3 + 5x^2 - 4x - 7$ entre $x + 3$', -4, '$f(-3) = 81 - 135 + 45 + 12 - 7 = -4$.'),
          ],
        },
        {
          id: 'alg-93', title: 'Ceros de un polinomio',
          // Libro UdeA §9.4–9.5. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, '**Teorema fundamental del álgebra**: todo polinomio de grado $n \\ge 1$ tiene exactamente $n$ ceros complejos, contando **multiplicidades**.', { steps: ['$f(x) = x(x - 1)^2(x - 4)^3$: ceros $0$, $1$ (doble), $4$ (triple)'] }),
            sc(6, '**Ceros racionales**: si $\\tfrac{c}{d}$ es cero de un polinomio con coeficientes enteros, $c$ divide al término independiente y $d$ al coeficiente principal.', { steps: ['$x^3 + 2x^2 - 9x - 4$: candidatos $\\pm1, \\pm2, \\pm4$', '$f(-4) = 0 \\Rightarrow (x + 4)(x^2 - 2x - 1)$'] }),
            sc(6, '**Regla de los signos de Descartes**: los ceros reales positivos son tantos como los cambios de signo de $f(x)$, o ese número menos un par.', { steps: ['$3x^5 - 2x^4 + 5x^2 + 3x - 1$: 3 cambios $\\Rightarrow$ 3 o 1 positivos'] }),
            sc(6, 'Los ceros **irracionales** $s \\pm t\\sqrt{u}$ y los **complejos** $a \\pm bi$ vienen en parejas conjugadas cuando los coeficientes son reales (o enteros).', { steps: ['Si $3 + i$ es cero, $3 - i$ también', '$x^3 - x^2 + 4x - 4 = (x - 1)(x - \\sqrt2 i)(x + \\sqrt2 i)$'] }),
          ] },
          ex: [
            mc('Las raíces del polinomio $f(x) = x^3 - x^2 - 10x - 8$ son', ['$-2, -1, 4$', '$-1, 5, 8$', '$-4, -2, -1$', '$-2, -i, i$'], 0, '$f(-1) = -1 - 1 + 10 - 8 = 0$; dividiendo: $(x + 1)(x^2 - 2x - 8) = (x + 1)(x - 4)(x + 2)$.'),
            mc('Según la regla de los signos de Descartes, ¿cuál es el número máximo de raíces positivas de $f(x) = x^4 - 3x^3 + 2x^2 - 5x + 1$?', ['$4$', '$1$', '$3$', '$2$'], 0, 'Los signos son $+\\,-\\,+\\,-\\,+$: cuatro cambios, así que hay 4, 2 o 0 raíces positivas; el máximo es 4.'),
            mc('¿Cuál de estos valores NO puede ser cero racional de $f(x) = 2x^3 - 3x^2 + x - 6$?', ['$\\tfrac14$', '$\\tfrac12$', '$3$', '$-6$'], 0, 'Los candidatos son $\\tfrac{c}{d}$ con $c \\mid 6$ y $d \\mid 2$: $\\pm1, \\pm2, \\pm3, \\pm6, \\pm\\tfrac12, \\pm\\tfrac32$. El denominador 4 no divide al coeficiente principal 2.'),
            mc('El grado mínimo de un polinomio con coeficientes enteros que tiene como ceros a $1$, $-3$, $2 - \\sqrt7$ y $3 + i$ es', ['$6$', '$3$', '$4$', '$5$'], 0, 'Con coeficientes enteros, $2 + \\sqrt7$ y $3 - i$ también son ceros: en total seis ceros, grado mínimo 6.'),
            mc('Si el polinomio $f(x) = x^3 - x$ tiene un cero en $x = 0$, ¿qué otros ceros tiene?', ['$\\pm1$', '$\\pm i$', '$\\pm 2i$', '$\\pm\\sqrt2$'], 0, '$x^3 - x = x(x^2 - 1) = x(x - 1)(x + 1)$.'),
            mc('En $f(x) = x(x - 1)^2(x - 4)^3$, la multiplicidad del cero $4$ es', ['$3$', '$1$', '$2$', '$6$'], 0, 'El factor $(x - 4)$ aparece tres veces: multiplicidad 3. En total hay $1 + 2 + 3 = 6$ ceros, el grado.'),
            mc('Para $f(x) = x^2 - 4$ se sabe que $f(-3) = 5$ y $f(3) = 5$. ¿Garantiza el teorema del valor intermedio una raíz en $(-3, 3)$?', ['No, porque $f(-3)$ y $f(3)$ no tienen signos opuestos', 'Sí, porque el polinomio es continuo', 'Sí, porque el polinomio tiene grado 2', 'No, porque el valor intermedio debe ser cero'], 0, 'El teorema asegura una raíz solo cuando hay cambio de signo. Aquí las raíces $\\pm2$ existen, pero el teorema no es quien lo garantiza.'),
          ],
        },
      ],
    },
    {
      title: 'Sistemas de ecuaciones y fracciones parciales',
      lessons: [
        {
          id: 'alg-101', title: 'Sistemas de ecuaciones lineales',
          // Libro UdeA §10.1–10.2. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Un **sistema lineal** son varias ecuaciones de primer grado con las mismas incógnitas. Resolverlo es hallar los valores que cumplen **todas** a la vez.', { steps: ['$x + y = 4,\\quad 3x - 2y = 7$'] }),
            sc(7, 'Tres métodos para $2 \\times 2$: **sustitución** (despeja una incógnita y reemplaza), **igualación** (despeja la misma en ambas) y **reducción** (suma múltiplos para eliminar una).', { steps: ['Sustitución: $x = 4 - y \\Rightarrow 3(4 - y) - 2y = 7 \\Rightarrow y = 1,\\ x = 3$', 'Reducción: $5x + 6y = 20$ y $8x - 6y = -46$ se suman $\\Rightarrow 13x = -26$'] }),
            sc(6, 'Dos rectas pueden cortarse en **un punto** (solución única), ser **paralelas** (sin solución) o ser **la misma** (infinitas soluciones).', { steps: ['Sistemas equivalentes: intercambiar, multiplicar por $k \\ne 0$, sumar un múltiplo de otra'] }),
          ] },
          ex: [
            mc('La solución del sistema $x + y = 5$, $2x - y = 1$ es', ['$x = 2,\\ y = 3$', '$x = 1,\\ y = 4$', '$x = 3,\\ y = 2$', '$x = 4,\\ y = 1$'], 0, 'Sumando las ecuaciones se elimina $y$: $3x = 6$, $x = 2$, y entonces $y = 3$.'),
            mc('¿Cuál es el valor de $x$ en el sistema $5x + 4y = 10$, $2x - 2y = 4$?', ['$x = 2$', '$x = 1$', '$x = 0$', '$x = 3$'], 0, 'De la segunda, $x = y + 2$. Sustituyendo: $5(y + 2) + 4y = 10 \\Rightarrow 9y = 0$, así que $y = 0$ y $x = 2$.'),
            mc('¿Cuál sistema tiene como solución $x = 2$ y $y = 3$?', ['$x + y = 5,\\ 2x - y = 1$', '$x + y = 5,\\ 2x - y = 4$', '$x + y = 4,\\ 2x - y = 1$', '$x + y = 6,\\ 2x - y = 2$'], 0, 'Se reemplaza: $2 + 3 = 5$ y $2(2) - 3 = 1$. Las otras fallan en al menos una ecuación.'),
            num('Si $x + y = 10$ y $x - y = 4$, ¿cuánto vale $x$?', 7, 'Sumando: $2x = 14$, $x = 7$ (y $y = 3$).'),
            mc('La solución del sistema $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$ es', ['$x = 1,\\ y = 2,\\ z = 3$', '$x = 2,\\ y = 0,\\ z = 4$', '$x = 3,\\ y = 1,\\ z = 2$', '$x = 1,\\ y = 3,\\ z = 2$'], 0, 'Sumando la segunda y la tercera: $3x + y = 5$; de la primera, $z = 6 - x - y$, que en la segunda da $x - 2y = -3$. Resolviendo: $x = 1$, $y = 2$, $z = 3$.'),
            mc('Al resolver el sistema $x + 2y = 8$, $3x - 4y = 4$, su solución representa', ['Un punto', 'La misma recta', 'Dos rectas paralelas', 'Ninguna de las otras opciones'], 0, 'Las pendientes son distintas ($-\\tfrac12$ y $\\tfrac34$): las rectas se cortan en un único punto, $(4, 2)$.'),
            mc('Del sistema $x - y + 2z = 3$, $x + 2y - z = -3$, $2y - 2z = 1$ podemos afirmar que', ['no tiene soluciones', 'tiene solución única $x = 2, y = 3, z = 1$', 'tiene infinitas soluciones', 'tiene solución única $x = 0, y = -1, z = 1$'], 0, 'De la tercera, $y = z + \\tfrac12$; con la primera, $x = \\tfrac72 - z$. Al sustituir en la segunda queda $\\tfrac92 = -3$, imposible: el sistema es inconsistente.'),
          ],
        },
        {
          id: 'alg-102', title: 'Sistemas no lineales y fracciones parciales',
          // Libro UdeA §10.3–10.4. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Un sistema **no lineal** $y = f(x)$, $y = g(x)$ se resuelve igualando: las soluciones son los **puntos de corte** de las dos gráficas.', { title: '$y = x^2$ y $y = 3x + 4$', viz: { type: 'graph', xr: [-3, 6], yr: [0, 20], f: x => x * x, points: [[4, 16, '(4, 16)'], [-1, 1, '(−1, 1)']] }, steps: ['$x^2 = 3x + 4 \\Rightarrow (x - 4)(x + 1) = 0$'] }),
            sc(6, 'Una fracción racional es **propia** si el grado del numerador es menor que el del denominador; si no, primero se divide.', { steps: ['$\\dfrac{x + 7}{x^2 - x - 6}$ es propia · $\\dfrac{x^3 - 6x^2 + 5x - 3}{x^2 - 1}$ no'] }),
            sc(7, '**Fracciones parciales**: se factoriza el denominador y se pone una constante por cada factor lineal (y $Bx + C$ por cada cuadrático irreducible); los factores repetidos llevan una fracción por cada potencia.', { steps: ['$\\dfrac{5x - 1}{(x + 1)(x - 2)} = \\dfrac{A}{x + 1} + \\dfrac{B}{x - 2}$', '$5x - 1 = A(x - 2) + B(x + 1) \\Rightarrow A = 2,\\ B = 3$'] }),
            sc(6, 'Con un factor cuadrático: $\\dfrac{x^2 + 1}{(x + 1)(x^2 + x + 1)} = \\dfrac{A}{x + 1} + \\dfrac{Bx + C}{x^2 + x + 1}$ y se iguala coeficiente a coeficiente.', { steps: ['$A + B = 1,\\ A + B + C = 0,\\ A + C = 1 \\Rightarrow A = 2,\\ B = -1,\\ C = -1$'] }),
          ] },
          ex: [
            mc('Las soluciones del sistema $y = x^2$, $y = x + 6$ son', ['$\\{(3, 9), (-2, 4)\\}$', '$\\{(3, 9)\\}$', '$\\{(2, 4), (-3, 9)\\}$', '$\\{(6, 36), (0, 0)\\}$'], 0, 'Igualando: $x^2 - x - 6 = 0 = (x - 3)(x + 2)$. Con $x = 3$, $y = 9$; con $x = -2$, $y = 4$.'),
            mc('¿Cuál es la descomposición en fracciones parciales de $\\dfrac{1}{(x - 1)(x + 2)}$?', ['$\\dfrac{A}{x - 1} + \\dfrac{B}{x + 2}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x + 2}$', '$\\dfrac{A}{x - 1} + \\dfrac{B}{x - 2}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x - 1}$'], 0, 'Cada factor lineal distinto del denominador aporta una fracción con constante arriba.'),
            mc('La descomposición de $\\dfrac{5}{(x - 2)(x + 3)}$ es', ['$\\dfrac{1}{x - 2} - \\dfrac{1}{x + 3}$', '$\\dfrac{1}{x - 2} + \\dfrac{1}{x + 3}$', '$\\dfrac{2}{x - 2} - \\dfrac{1}{x + 3}$', '$\\dfrac{5}{x - 2} - \\dfrac{5}{x + 3}$'], 0, '$5 = A(x + 3) + B(x - 2)$. Con $x = 2$: $5 = 5A$, $A = 1$; con $x = -3$: $5 = -5B$, $B = -1$.'),
            mc('¿Cómo se descompone $\\dfrac{5x^2 + 7x + 2}{(x + 1)(x^2 + 1)}$ en fracciones parciales?', ['$\\dfrac{A}{x + 1} + \\dfrac{Bx + C}{x^2 + 1}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x^2 + 1}$', '$\\dfrac{A}{x + 1} + \\dfrac{B}{x + 1} + \\dfrac{C}{x^2 + 1}$', '$\\dfrac{A}{x^2 + 1} + \\dfrac{Bx}{x + 1}$'], 0, 'El factor $x^2 + 1$ es cuadrático irreducible: su numerador es de la forma $Bx + C$, no una constante.'),
            mc('Al descomponer en fracciones parciales $\\dfrac{x^2 - 11x + 6}{(x^3 - 2x^2 - 4x)^2}$, el número de constantes a determinar es', ['$6$', '$3$', '$4$', '$5$'], 0, 'El denominador es $x^2 (x^2 - 2x - 4)^2$: $x^2$ aporta 2 constantes y el cuadrático al cuadrado aporta $2 + 2 = 4$. Total 6.'),
            mc('Si el área y el perímetro de un triángulo rectángulo miden 30 cada una, sus lados son', ['$5, 12$ y $13$', '$3, 20$ y $7$', '$10, 6$ y $14$', '$9, 10$ y $11$'], 0, 'Los únicos que cumplen las dos: $\\tfrac{5 \\cdot 12}{2} = 30$ y $5 + 12 + 13 = 30$, con $5^2 + 12^2 = 13^2$.'),
            mc('Al descomponer $\\dfrac{1}{(x + k)(x - 1)} = \\dfrac{A}{x + k} + \\dfrac{B}{x - 1}$, los valores de $A$ y $B$ en función de $k$ son', ['$A = \\dfrac{-1}{k + 1},\\ B = \\dfrac{1}{k + 1}$', '$A = \\dfrac{1}{k + 1},\\ B = \\dfrac{1}{k + 1}$', '$A = \\dfrac{-1}{1 - k},\\ B = \\dfrac{1}{1 - k}$', '$A = 1 - k,\\ B = \\dfrac{1 - k}{k}$'], 0, '$1 = A(x - 1) + B(x + k)$. Con $x = 1$: $B = \\tfrac{1}{1 + k}$; con $x = -k$: $A = \\tfrac{1}{-k - 1} = \\tfrac{-1}{k + 1}$.'),
          ],
        },
      ],
    },
    {
      title: 'Sucesiones, sumatoria y productoria',
      lessons: [
        {
          id: 'alg-14', title: 'Progresiones aritméticas y geométricas',
          // Clase 5 (video/clase_progresiones): Parte 1 aritméticas, Parte 2 geométricas tras el quinto ejercicio.
          // Escenas de respaldo hasta enlazar los videos de Bunny (bunny + duration).
          clip: { scenes: [
            sc(6, 'Una **sucesión** es una lista ordenada; si hay patrón, el **término general** da el término del puesto $n$.', { title: '$a_n = 3n - 1$', steps: ['$2, 5, 8, 11, \\dots$', '$a_{50} = 3 \\cdot 50 - 1 = 149$'] }),
            sc(6, 'En una progresión **aritmética** se suma siempre la misma diferencia $d$.', { title: '$a_n = a_1 + (n - 1)d$', viz: { type: 'graph', xr: [0, 7], yr: [0, 32], f: () => NaN, points: [[1, 4, '4'], [2, 9, '9'], [3, 14, '14'], [4, 19, '19'], [5, 24, '24'], [6, 29, '29']] } }),
            sc(6, 'Gauss sumó del 1 al 100 emparejando extremos: cada pareja suma lo mismo.', { title: '$S_n = \\dfrac{n}{2}(a_1 + a_n)$', steps: ['$1 + 100 = 2 + 99 = \\dots = 101$', '$S_{100} = 50 \\cdot 101 = 5050$', '$2 + 5 + \\dots + 59$: $n = 20$, $S = 610$'] }),
          ] },
          more: [{ after: 5, scenes: [
            sc(6, 'En una progresión **geométrica** se multiplica siempre por la misma razón $r$.', { title: '$a_n = a_1 r^{n-1}$', viz: { type: 'graph', xr: [0, 6], yr: [0, 170], f: () => NaN, points: [[1, 2, '2'], [2, 6, '6'], [3, 18, '18'], [4, 54, '54'], [5, 162, '162']] } }),
            sc(6, 'La suma de los primeros $n$ términos tiene fórmula.', { title: '$S_n = a_1 \\dfrac{r^n - 1}{r - 1}$', steps: ['$3 + 6 + 12 + \\dots + 384$: $n = 8$', '$S_8 = 3 \\cdot 255 = 765$'] }),
            sc(6, 'Si $|r| < 1$, la suma infinita converge:', { title: '$S_\\infty = \\dfrac{a_1}{1 - r}$', steps: ['$8 + 4 + 2 + 1 + \\cdots = \\dfrac{8}{1 - \\frac12} = 16$'] }),
          ] }],
          ex: [
            // --- Parte 1: aritméticas ---
            play('clasifica-cartas', 'Desliza cada sucesión: ¿**aritmética** o **geométrica**?', {
              left: 'Aritmética', right: 'Geométrica',
              cards: [
                { text: '7, 10, 13, 16, …', side: 'left', why: 'Suma siempre 3.' },
                { text: '5, 10, 20, 40, …', side: 'right', why: 'Multiplica siempre por 2.' },
                { text: '100, 90, 80, 70, …', side: 'left', why: 'Suma siempre −10.' },
                { text: '81, 27, 9, 3, …', side: 'right', why: 'Multiplica siempre por 1/3.' },
                { text: '1.5, 3, 4.5, 6, …', side: 'left', why: 'Suma siempre 1.5 (aunque 1.5 → 3 parezca doblar, 3 → 4.5 no).' },
                { text: '1, −2, 4, −8, …', side: 'right', why: 'Multiplica siempre por −2: los signos se alternan.' },
              ],
            }, 'Aritmética: la **diferencia** entre términos consecutivos es constante ($10 - 7 = 13 - 10 = 3$). Geométrica: el **cociente** es constante ($10 / 5 = 20 / 10 = 2$). Mira siempre dos saltos, no uno.'),
            play('escalera-aritmetica', 'Ajusta la escalera para que el décimo peldaño mida 42', { a1: 6, n: 10, target: 42, step: 1, max: 10 },
              'El peldaño $n$ mide $a_n = a_1 + (n - 1)d$. Con $a_1 = 6$ y $n = 10$: $6 + 9d = 42$, así que $9d = 36$ y $d = 4$.'),
            play('parejas-gauss', 'Une las parejas de Gauss y descubre cuánto suma la progresión', { terms: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43] },
              'Extremos emparejados: $3 + 43 = 7 + 39 = \\dots = 46$. Son 5 parejas de 46 más el 23 del centro: $5 \\cdot 46 + 23 = 253$, igual que $S_{11} = \\dfrac{11 (3 + 43)}{2} = 253$.'),
            play('rellena-medios', 'Rellena los tres medios aritméticos entre 10 y 26', { first: 10, last: 26, k: 3, kind: 'aritmetica', chips: [13, 14, 18, 20, 22, 24] },
              'Con 3 medios hay 5 términos: $26 = 10 + 4d$, así que $d = 4$ y los medios son $14, 18, 22$.'),
            play('suma-filas', 'Añade filas al teatro hasta tener exactamente 170 sillas', { first: 8, d: 2, target: 170, max: 14, item: 'sillas' },
              'Las sillas por fila son $8, 10, 12, \\dots$ y el total es $S_n = \\dfrac{n(2 \\cdot 8 + (n - 1) 2)}{2} = n(n + 7)$. Con $n = 10$: $10 \\cdot 17 = 170$.'),
            // --- Parte 2: geométricas ---
            play('rellena-medios', 'Rellena los tres medios geométricos entre 5 y 405', { first: 5, last: 405, k: 3, kind: 'geometrica', chips: [15, 25, 45, 90, 135, 225] },
              'Con 3 medios hay 5 términos: $405 = 5 r^4$, así que $r^4 = 81$ y $r = 3$: los medios son $15, 45, 135$.'),
            play('limite-serie', 'Suma términos y lleva el marcador al valor al que se acerca 9 + 3 + 1 + …', { a1: 9, r: 1 / 3, rTex: '\\tfrac13', max: 20, step: 0.5, tol: 0.26 },
              'La razón es $\\tfrac13$, menor que 1, así que la suma converge: $S_\\infty = \\dfrac{a_1}{1 - r} = \\dfrac{9}{1 - \\frac13} = \\dfrac{9}{2/3} = 13.5$. Las sumas parciales $9, 12, 13, 13.33, \\dots$ se acercan sin pasarse.'),
            play('clasifica-cartas', 'Desliza cada serie: ¿la suma infinita **converge** o **diverge**?', {
              left: 'Converge', right: 'Diverge',
              cards: [
                { text: '1 + 1/2 + 1/4 + 1/8 + …', side: 'left', why: 'r = 1/2: suma 2.' },
                { text: '2 + 4 + 8 + 16 + …', side: 'right', why: 'r = 2: los términos crecen sin parar.' },
                { text: '10 − 5 + 2.5 − 1.25 + …', side: 'left', why: 'r = −1/2, |r| < 1: suma 10 / 1.5 = 6.67.' },
                { text: '0.9 + 0.81 + 0.729 + …', side: 'left', why: 'r = 0.9: suma 0.9 / 0.1 = 9.' },
                { text: '1 − 1 + 1 − 1 + …', side: 'right', why: 'r = −1: la suma salta entre 1 y 0, no se estabiliza.' },
                { text: '100 + 100 + 100 + …', side: 'right', why: 'r = 1: la suma crece sin límite.' },
              ],
            }, 'Una serie geométrica converge solo si $|r| < 1$: entonces $S_\\infty = \\dfrac{a_1}{1 - r}$. Con $|r| \\ge 1$ los términos no se hacen pequeños y la suma no se estabiliza.'),
            play('torre-producto', 'Duplica las bacterias hora a hora hasta llegar exactamente a 6.400', { kind: 'ratio', start: 50, r: 2, target: 6400, max: 10, unit: 'bacterias', period: 'hora' },
              'Es una progresión geométrica con $a_1 = 50$ y $r = 2$: tras $n$ horas hay $50 \\cdot 2^n$. Como $6\\,400 / 50 = 128 = 2^7$, son 7 horas.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'En una progresión aritmética la diferencia entre términos consecutivos es constante', truth: true, why: 'Esa es la definición: d fija.' },
                { text: 'En una progresión geométrica se suma siempre lo mismo', truth: false, why: 'Se multiplica siempre por lo mismo (la razón r).' },
                { text: 'Si |r| < 1, la suma infinita de una geométrica existe', truth: true, why: 'Converge a a₁ / (1 − r).' },
                { text: 'La sucesión 3, 6, 12, 24 tiene razón 3', truth: false, why: '6 / 3 = 2: la razón es 2 (3 es la diferencia del primer salto, no la razón).' },
                { text: 'La suma de los primeros n impares es n²', truth: true, why: '1 + 3 + 5 + … + (2n − 1) = n(1 + 2n − 1)/2 = n².' },
              ],
            }, 'Aritmética: $a_n = a_1 + (n - 1)d$ y $S_n = \\dfrac{n(a_1 + a_n)}{2}$. Geométrica: $a_n = a_1 r^{n-1}$, $S_n = a_1 \\dfrac{r^n - 1}{r - 1}$ y, si $|r| < 1$, $S_\\infty = \\dfrac{a_1}{1 - r}$.'),
          ],
        },
        {
          id: 'alg-15', title: 'Sumatoria y productoria',
          // Clase 6 (video/clase_sumatoria): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(6, 'La letra griega $\\Sigma$ abrevia sumas largas: índice, límites y término general.', { title: '$\\displaystyle\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$', steps: ['$\\displaystyle\\sum_{k=1}^{5} 2k = 2 + 4 + 6 + 8 + 10 = 30$'] }),
            sc(6, 'Es **lineal**: las constantes salen y las sumas se separan. Y hay sumas notables.', { steps: ['$\\displaystyle\\sum (c\\,a_k + b_k) = c\\sum a_k + \\sum b_k \\qquad \\sum_{k=1}^{n} c = nc$', '$\\displaystyle\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2} \\qquad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n + 1)(2n + 1)}{6}$'] }),
            sc(6, '$\\Pi$ abrevia productos. El más famoso es el **factorial**.', { title: '$\\displaystyle\\prod_{k=1}^{n} k = n!$', steps: ['$\\displaystyle\\prod_{k=1}^{4} 2k = 2 \\cdot 4 \\cdot 6 \\cdot 8 = 384$', '$4! = 24 \\quad 5! = 120 \\quad 6! = 720$'] }),
          ] },
          ex: [
            play('arma-sigma', 'Arma la sigma de cada suma con las fichas', {
              rounds: [
                { text: '3 + 6 + 9 + … + 30', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '10', cell: 'upper' }, { label: '3k', cell: 'term' }, { label: 'k = 0', cell: null }, { label: '30', cell: null }, { label: 'k + 3', cell: null }] },
                { text: '5 + 7 + 9 + … + 21', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '9', cell: 'upper' }, { label: '2k + 3', cell: 'term' }, { label: '21', cell: null }, { label: '2k + 1', cell: null }] },
                { text: '1 + 4 + 9 + … + 64', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '8', cell: 'upper' }, { label: 'k²', cell: 'term' }, { label: '64', cell: null }, { label: '2k', cell: null }] },
              ],
            }, 'El límite superior es el **número de términos**, no el último valor: $3 + 6 + \\cdots + 30$ tiene 10 términos, $\\sum_{k=1}^{10} 3k$ (desde $k = 0$ se colaría un término $0$ y serían 11). En $5 + 7 + \\cdots + 21$ el término es $2k + 3$ (con $k = 1$ da 5) y hay 9 términos. Los cuadrados $1, 4, \\dots, 64 = 8^2$ son $\\sum_{k=1}^{8} k^2$.'),
            play('ordena-terminos', 'Despliega la sigma: pon los términos en orden', { tex: '\\sum_{k=2}^{5} (k^2 - 1)', chips: ['3', '8', '15', '24', '0', '35'], order: [0, 1, 2, 3], result: '50' },
              'El índice empieza en $k = 2$, no en 1: los términos son $2^2 - 1 = 3$, $3^2 - 1 = 8$, $4^2 - 1 = 15$ y $5^2 - 1 = 24$. La suma es $3 + 8 + 15 + 24 = 50$; el 0 ($k = 1$) y el 35 ($k = 6$) quedan fuera.'),
            play('verdadero-falso', 'Desliza cada tarjeta: ¿**verdadero** o **falso**?', {
              cards: [
                { text: 'Σ (aₖ + bₖ) = Σ aₖ + Σ bₖ', truth: true, why: 'La suma de sumas se separa: la sigma es lineal.' },
                { text: 'Σ (aₖ · bₖ) = Σ aₖ · Σ bₖ', truth: false, why: 'Un producto no se separa: (1·1 + 2·2) = 5, pero (1 + 2)(1 + 2) = 9.' },
                { text: 'Σ desde k = 1 hasta n de una constante c vale n · c', truth: true, why: 'Se suma c n veces.' },
                { text: 'Σ c · aₖ = c · Σ aₖ', truth: true, why: 'La constante sale de la suma.' },
                { text: 'Σ desde k = 1 hasta n de k vale n(n + 1)', truth: false, why: 'Falta dividir entre 2: n(n + 1)/2 (con n = 3: 6, no 12).' },
              ],
            }, 'La sigma es lineal: $\\sum (c\\,a_k + b_k) = c \\sum a_k + \\sum b_k$ y $\\sum_{k=1}^{n} c = nc$, pero $\\sum a_k b_k \\ne \\sum a_k \\sum b_k$. La suma de Gauss es $\\sum_{k=1}^{n} k = \\dfrac{n(n + 1)}{2}$.'),
            play('suma-filas', 'Apila filas de puntos (1, 2, 3, …) hasta tener exactamente 78', { first: 1, d: 1, target: 78, max: 15, item: 'puntos' },
              'Las filas suman $1 + 2 + \\cdots + n = \\dfrac{n(n + 1)}{2}$. Con $n = 12$: $\\dfrac{12 \\cdot 13}{2} = 78$. Es la suma de Gauss hecha pirámide.'),
            play('ordena-terminos', 'Arma la cadena telescópica en orden y mira qué se cancela', { tex: '\\sum_{k=1}^{5} \\left(\\dfrac{1}{k} - \\dfrac{1}{k + 1}\\right)', chips: ['1 − 1/2', '1/2 − 1/3', '1/3 − 1/4', '1/4 − 1/5', '1/5 − 1/6', '1/2 − 1/4', '1/6 − 1/7'], order: [0, 1, 2, 3, 4], result: '5/6' },
              'Al poner las restas en fila, cada $-\\tfrac1{k+1}$ se cancela con el $+\\tfrac1{k+1}$ del siguiente término: solo quedan el primero y el último, $1 - \\tfrac16 = \\tfrac56$. Las fichas $\\tfrac12 - \\tfrac14$ y $\\tfrac16 - \\tfrac17$ no pertenecen a la cadena.'),
            play('torre-producto', 'Multiplica 1 · 2 · 3 · … hasta llegar exactamente a 5.040', { kind: 'factorial', target: 5040, max: 9, unit: '', period: 'paso' },
              'El factorial multiplica los enteros desde 1: $7! = 1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5 \\cdot 6 \\cdot 7 = 5\\,040$. Cada paso es el anterior por el siguiente número: $6! = 720$ y $7 \\cdot 720 = 5\\,040$.'),
            play('clasifica-cartas', 'Desliza cada expresión: ¿la abrevia una **suma** (Σ) o un **producto** (Π)?', {
              left: 'Suma Σ', right: 'Producto Π',
              cards: [
                { text: '1 + 1/2 + 1/3 + … + 1/10', side: 'left', why: 'Se suman los términos 1/k.' },
                { text: '1 · 3 · 5 · 7 · 9', side: 'right', why: 'Se multiplican los impares: Π (2k − 1).' },
                { text: '5!', side: 'right', why: '5! = 1 · 2 · 3 · 4 · 5 es un producto.' },
                { text: '3 + 3 + 3 + 3 + 3', side: 'left', why: 'Una constante sumada 5 veces: Σ 3 = 15.' },
                { text: '2 · 2 · 2 · 2', side: 'right', why: 'Una constante multiplicada 4 veces: Π 2 = 2⁴.' },
                { text: '1 + 2 + 3 + … + n', side: 'left', why: 'Es la suma de Gauss: Σ k = n(n + 1)/2.' },
              ],
            }, '$\\Sigma$ abrevia una suma de términos y $\\Pi$ un producto: $\\sum_{k=1}^{5} 3 = 15$ pero $\\prod_{k=1}^{4} 2 = 2^4$; $5! = \\prod_{k=1}^{5} k$; y $\\dfrac{n(n + 1)}{2}$ es el valor de la suma $\\sum_{k=1}^{n} k$.'),
          ],
        },
      ],
    },
  ],
};
