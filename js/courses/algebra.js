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
          ex: [
            mc('¿Cuál es el conjunto más pequeño al que pertenece $\\sqrt{49}$?', ['$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{Q}$', '$\\mathbb{I}$'], 0, '$\\sqrt{49} = 7$, un número natural.'),
            mc('$\\sqrt{12}$ es un número…', ['Irracional', 'Racional', 'Entero', 'Natural'], 0, '$\\sqrt{12} = 2\\sqrt3$: su decimal es infinito y no periódico.'),
            mc('Escribe $0.\\overline{27}$ como fracción irreducible', ['$\\tfrac{3}{11}$', '$\\tfrac{27}{100}$', '$\\tfrac{27}{90}$', '$\\tfrac{1}{4}$'], 0, '$0.\\overline{27} = \\tfrac{27}{99} = \\tfrac{3}{11}$.'),
            num('Calcula sin calculadora $|3 - \\pi| + |\\pi - 4|$', 1, '$3 - \\pi < 0$ y $\\pi - 4 < 0$: queda $(\\pi - 3) + (4 - \\pi) = 1$.'),
            mc('¿Qué propiedad justifica $a(b + c) = ab + ac$?', ['Distributiva', 'Conmutativa', 'Asociativa', 'Elemento neutro'], 0, 'El producto se distribuye sobre la suma.'),
          ],
        },
        {
          id: 'alg-12', title: 'Razones, proporciones y proporcionalidad',
          clip: { scenes: [
            sc(5, 'Una **razón** compara dos cantidades por cociente. Una **proporción** es la igualdad de dos razones.', { title: '$\\dfrac{a}{b} = \\dfrac{c}{d} \\iff ad = bc$', steps: ['$\\dfrac{3}{5} = \\dfrac{12}{20}$ porque $3 \\cdot 20 = 5 \\cdot 12$'] }),
            sc(5, '**Directamente proporcionales**: si una se duplica, la otra también. Su gráfica es una recta por el origen.', { title: '$y = kx$', viz: { type: 'graph', xr: [0, 6], yr: [0, 9], f: (x, k) => k * x, anim: [0.5, 1.5], label: k => `k = ${fmt(k)}` } }),
            sc(5, '**Inversamente proporcionales**: si una se duplica, la otra se reduce a la mitad. Su producto es constante.', { title: '$xy = k$', viz: { type: 'graph', xr: [0, 8], yr: [0, 8], f: x => 6 / x, draw: true, points: [[2, 3, '(2, 3)'], [3, 2, '(3, 2)']] } }),
            sc(5, '**Reparto proporcional**: suma las partes y reparte el total en esa razón.', { steps: ['Repartir $1\\,200\\,000$ en partes proporcionales a $2, 3, 5$', '$2 + 3 + 5 = 10$, cada parte vale $120\\,000$', '$240\\,000,\\ 360\\,000,\\ 600\\,000$'] }),
          ] },
          ex: [
            num('Si $\\dfrac{a}{b} = \\dfrac{3}{5}$ y $a + b = 64$, ¿cuánto vale $a$?', 24, '$a = 3k$, $b = 5k$, $8k = 64 \\Rightarrow k = 8$: $a = 24$, $b = 40$.', { prefix: '$a =$' }),
            sld('Ajusta $k$ para que $y = kx$ pase por el punto $(4, 6)$', {
              viz: { type: 'graph', xr: [0, 6], yr: [0, 9], f: (x, k) => k * x, points: [[4, 6, '(4, 6)']] },
              min: 0.5, max: 3, step: 0.25, init: 0.5, readout: v => `$k = ${v}$`,
              check: v => near(v, 1.5), answerText: '$k = 1.5$', explain: '$k = \\dfrac{y}{x} = \\dfrac{6}{4} = 1.5$.',
            }),
            num('$x$ e $y$ son inversamente proporcionales y $y = 12$ cuando $x = 5$. ¿Cuánto vale $y$ cuando $x = 15$?', 4, '$k = xy = 60$, así que $y = \\tfrac{60}{15} = 4$.', { prefix: '$y =$' }),
            num('Media proporcional entre 4 y 25', 10, '$x = \\sqrt{4 \\cdot 25} = \\sqrt{100} = 10$.'),
            num('Reparte 1 200 000 pesos en partes directamente proporcionales a 2, 3 y 5. ¿Cuánto recibe la parte proporcional a 5?', 600000, 'Cada parte vale $\\tfrac{1\\,200\\,000}{10} = 120\\,000$; por 5 da $600\\,000$.', { suffix: 'pesos' }),
          ],
        },
        {
          id: 'alg-13', title: 'Regla de tres, porcentajes e interés',
          clip: { scenes: [
            sc(5, '**Regla de tres**: primero decide si las magnitudes son directas o inversas.', { steps: ['8 obreros tardan 15 días', 'Más obreros → menos días (inversa)', '$x = \\dfrac{8 \\cdot 15}{12} = 10$ días'] }),
            sc(5, 'El **porcentaje** es una razón con denominador 100. Un aumento multiplica por $1 + r$; un descuento, por $1 - r$.', { steps: ['$p\\%$ de $B = \\dfrac{p}{100}B$', 'Aumento: $B(1 + r)$', 'Descuento: $B(1 - r)$'] }),
            sc(5, 'Dos descuentos sucesivos **no se suman**: se multiplican.', { steps: ['$30\\%$ y luego $20\\%$', '$(1 - 0.3)(1 - 0.2) = 0.56$', 'Descuento único: $44\\%$, no $50\\%$'] }),
            sc(6, 'Interés **simple**: siempre sobre el capital inicial. **Compuesto**: el interés también genera interés.', { steps: ['Simple: $M = C(1 + rt)$', 'Compuesto: $M = C(1 + r)^n$'], viz: { type: 'graph', xr: [0, 24], yr: [1, 1.5], fs: [{ f: t => 1 + 0.015 * t }, { f: t => 1.015 ** t }], draw: true, ax: ['meses', 'M / C'] } }),
          ] },
          ex: [
            num('Ocho obreros construyen un muro en 15 días. ¿Cuántos días tardarán 12 obreros al mismo ritmo?', 10, 'Proporción inversa: $\\tfrac{8 \\cdot 15}{12} = 10$.', { suffix: 'días' }),
            num('Seis máquinas producen 900 piezas en 5 horas. ¿Cuántas producirán 4 máquinas iguales en 8 horas?', 960, 'Regla de tres compuesta: $900 \\cdot \\tfrac{4}{6} \\cdot \\tfrac{8}{5} = 960$.', { suffix: 'piezas' }),
            num('Descuento único equivalente a dos descuentos sucesivos de $30\\%$ y $20\\%$', 44, '$1 - (0.7)(0.8) = 0.44$.', { suffix: '%' }),
            num('¿De qué número es 756 el $26\\%$ más?', 600, '$N \\cdot 1.26 = 756 \\Rightarrow N = 600$.'),
            mc('2 000 000 pesos al $1.5\\%$ mensual durante 12 meses: ¿qué modalidad da más dinero?', ['Interés compuesto (≈ 2 391 236 pesos)', 'Interés simple (≈ 2 360 000 pesos)', 'Dan lo mismo', 'Depende del capital'], 0, 'Simple: $2\\,000\\,000(1 + 0.18)$. Compuesto: $2\\,000\\,000(1.015)^{12}$.'),
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
