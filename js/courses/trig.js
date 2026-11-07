// Curso de Trigonometría — sigue la Parte IV «Trigonometría» (unidades 13–15) del Manual de
// Álgebra y Trigonometría (Instituto de Matemáticas, UdeA, 2024).

const PI = Math.PI;

const COURSE_TRIG = {
  id: 'trig', level: 'Fundamentos', name: 'Trigonometría', icon: 'θ', color: '#22d3ee',
  tagline: 'Funciones trigonométricas, inversas, leyes de senos y cosenos y forma polar: la parte IV del Manual de la UdeA.',
  units: [
    {
      title: 'Funciones trigonométricas, propiedades y gráficas',
      lessons: [
        {
          id: 'trig-41a', title: 'Grados y radianes',
          clip: { scenes: [
            sc(5, 'Un ángulo en **posición estándar** empieza en el eje $x$ positivo. Girar en sentido antihorario es positivo.', { viz: { type: 'circle', from: 0, to: 135 } }),
            sc(5, 'Un **radián** es el ángulo cuyo arco mide lo mismo que el radio. Media vuelta son $\\pi$ radianes.', { title: '$180^\\circ = \\pi \\text{ rad}$', viz: { type: 'circle', from: 0, to: 180 } }),
            sc(5, 'Para convertir, multiplica por $\\tfrac{\\pi}{180}$ o por $\\tfrac{180}{\\pi}$.', { steps: ['$135^\\circ \\cdot \\dfrac{\\pi}{180} = \\dfrac{3\\pi}{4}$', '$\\dfrac{7\\pi}{6} \\cdot \\dfrac{180}{\\pi} = 210^\\circ$'] }),
            sc(5, 'Ángulos **coterminales** terminan en el mismo lado: difieren en vueltas completas.', { title: '$\\theta + 360^\\circ k$', steps: ['$400^\\circ - 360^\\circ = 40^\\circ$', '$40^\\circ - 360^\\circ = -320^\\circ$'] }),
          ] },
          ex: [
            mc('$135^\\circ$ en radianes es…', ['$\\tfrac{3\\pi}{4}$', '$\\tfrac{2\\pi}{3}$', '$\\tfrac{5\\pi}{6}$', '$\\tfrac{3\\pi}{2}$'], 0, '$135 \\cdot \\tfrac{\\pi}{180} = \\tfrac{3\\pi}{4}$.'),
            num('$\\tfrac{7\\pi}{6}$ rad en grados', 210, '$\\tfrac{7\\pi}{6} \\cdot \\tfrac{180}{\\pi} = 210^\\circ$.', { suffix: '°' }),
            num('Ángulo entre $0^\\circ$ y $360^\\circ$ coterminal con $400^\\circ$', 40, '$400^\\circ - 360^\\circ = 40^\\circ$.', { suffix: '°' }),
            sld('Gira $\\theta$ hasta $\\tfrac{3}{8}$ de vuelta completa', {
              viz: { type: 'circle' }, min: 0, max: 360, step: 15, init: 30,
              readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 135, answerText: '$135^\\circ = \\tfrac{3\\pi}{4}$',
              explain: '$\\tfrac{3}{8} \\cdot 360^\\circ = 135^\\circ$.',
            }),
            mc('El complemento de $35^\\circ$ es…', ['$55^\\circ$', '$145^\\circ$', '$325^\\circ$', '$65^\\circ$'], 0, 'Complementarios suman $90^\\circ$; suplementarios, $180^\\circ$.'),
          ],
        },
        {
          id: 'trig-41b', title: 'Arco, sector y movimiento circular',
          clip: { scenes: [
            sc(5, 'Con el ángulo en **radianes**, la longitud del arco es radio por ángulo.', { title: '$s = r\\theta$', viz: { type: 'sector', r: 12, anim: [30, 150], unit: 'cm' } }),
            sc(5, 'El área del sector es una fracción del círculo:', { title: '$A = \\tfrac12 r^2 \\theta$', viz: { type: 'sector', r: 12, ang: 150, unit: 'cm' } }),
            sc(6, 'En una rueda que gira, la **rapidez angular** $\\omega$ y la **lineal** $v$ se relacionan con el radio.', { steps: ['$\\omega = \\dfrac{\\theta}{t}$', '$v = \\dfrac{s}{t} = r\\,\\omega$', '300 rpm $= 300 \\cdot 2\\pi = 600\\pi$ rad/min'] }),
          ] },
          ex: [
            num('Sector de radio 12 cm y ángulo central $150^\\circ$. Longitud del arco (usa $\\pi \\approx 3.1416$)', 10 * PI, '$\\theta = \\tfrac{5\\pi}{6}$, $s = 12 \\cdot \\tfrac{5\\pi}{6} = 10\\pi \\approx 31.42$ cm.', { tol: 0.05, suffix: 'cm', answerText: '$10\\pi \\approx 31.42$ cm' }),
            num('…y el área del sector', 60 * PI, '$\\tfrac12 \\cdot 144 \\cdot \\tfrac{5\\pi}{6} = 60\\pi \\approx 188.5$ cm².', { tol: 0.2, suffix: 'cm²', answerText: '$60\\pi \\approx 188.5$ cm²' }),
            mc('En $s = r\\theta$, el ángulo debe estar en…', ['Radianes', 'Grados', 'Vueltas', 'Cualquier unidad'], 0, 'La fórmula sale de la definición de radián.'),
            num('Una rueda de 60 cm de diámetro gira a 300 rpm. Rapidez lineal de un punto del borde, en cm/min (usa $\\pi \\approx 3.1416$)', 18000 * PI, '$\\omega = 600\\pi$ rad/min y $r = 30$: $v = 30 \\cdot 600\\pi = 18000\\pi \\approx 56\\,549$ cm/min.', { tol: 10, suffix: 'cm/min', answerText: '$18000\\pi \\approx 56\\,549$ cm/min' }),
          ],
        },
        {
          id: 'trig-1', title: 'SOH · CAH · TOA',
          clip: { scenes: [
            sc(4, 'En un triángulo rectángulo nombramos los lados respecto al ángulo $\\theta$.', { viz: { type: 'triangle', from: 35 } }),
            sc(5, '**SOH**: seno = opuesto ÷ hipotenusa.', { title: '$\\sen\\theta = \\dfrac{\\text{op}}{\\text{hip}}$', viz: { type: 'triangle', from: 20, to: 60, show: 'sin' } }),
            sc(5, '**CAH**: coseno = adyacente ÷ hipotenusa.', { title: '$\\cos\\theta = \\dfrac{\\text{ady}}{\\text{hip}}$', viz: { type: 'triangle', from: 60, to: 20, show: 'cos' } }),
            sc(5, '**TOA**: tangente = opuesto ÷ adyacente.', { title: '$\\tan\\theta = \\dfrac{\\text{op}}{\\text{ady}}$', viz: { type: 'triangle', from: 20, to: 70, show: 'tan' } }),
          ] },
          ex: [
            mc('$\\sen\\theta$ es igual a…', ['$\\dfrac{\\text{opuesto}}{\\text{hipotenusa}}$', '$\\dfrac{\\text{adyacente}}{\\text{hipotenusa}}$', '$\\dfrac{\\text{opuesto}}{\\text{adyacente}}$', '$\\dfrac{\\text{hipotenusa}}{\\text{opuesto}}$'], 0, 'SOH: **S**eno = **O**puesto / **H**ipotenusa.'),
            num('Un triángulo rectángulo tiene catetos 3 y 4. ¿Cuánto mide la hipotenusa?', 5, 'Pitágoras: $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.'),
            num('En ese triángulo (3, 4, 5), si $\\theta$ es opuesto al lado 3, ¿cuánto vale $\\sen\\theta$?', 0.6, '$\\sen\\theta = 3 / 5 = 0.6$.'),
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
            sc(5, 'Hay ángulos que aparecen en todas partes: 30°, 45° y 60°. Salen del triángulo equilátero y del cuadrado.', { viz: { type: 'triangle', from: 30, to: 60 } }),
            sc(5, 'Truco: el seno sube como $\\sqrt{1}, \\sqrt{2}, \\sqrt{3}$ sobre 2.', { steps: ['$\\sen 30^\\circ = \\tfrac{1}{2}$', '$\\sen 45^\\circ = \\tfrac{\\sqrt{2}}{2}$', '$\\sen 60^\\circ = \\tfrac{\\sqrt{3}}{2}$'] }),
            sc(5, 'El coseno va al revés:', { steps: ['$\\cos 30^\\circ = \\tfrac{\\sqrt{3}}{2}$', '$\\cos 45^\\circ = \\tfrac{\\sqrt{2}}{2}$', '$\\cos 60^\\circ = \\tfrac{1}{2}$'] }),
            sc(4, 'Con esto calculas alturas y distancias sin calculadora.', { title: '$h = 10 \\tan 45^\\circ = 10$', viz: { type: 'triangle', from: 45, labels: { adj: '10 m', op: 'h' } } }),
          ] },
          ex: [
            mc('$\\sen 30^\\circ = \\;?$', ['$\\tfrac{1}{2}$', '$\\tfrac{\\sqrt{3}}{2}$', '$1$', '$\\tfrac{\\sqrt{2}}{2}$'], 0, 'Es el primero de la tabla: $\\tfrac{\\sqrt{1}}{2} = \\tfrac{1}{2}$.'),
            num('$\\cos 60^\\circ = \\;?$ (en decimal)', 0.5, '$\\cos 60^\\circ = \\tfrac{1}{2} = 0.5$.'),
            mc('$\\tan 45^\\circ = \\;?$', ['$1$', '$0$', '$\\sqrt{3}$', '$\\tfrac{1}{2}$'], 0, '$\\tan 45^\\circ = \\dfrac{\\sen 45^\\circ}{\\cos 45^\\circ} = 1$.'),
            num('En un triángulo rectángulo la hipotenusa mide 25 y un ángulo agudo $30^\\circ$. ¿Cuánto mide el cateto opuesto a ese ángulo?', 12.5, '$25 \\sen 30^\\circ = 12.5$.'),
          ],
        },
        {
          id: 'trig-42c', title: 'Las seis razones y la medición indirecta',
          clip: { scenes: [
            sc(5, 'Además de seno, coseno y tangente, están sus **recíprocas**:', { steps: ['$\\csc\\theta = \\dfrac{1}{\\sen\\theta}$', '$\\sec\\theta = \\dfrac{1}{\\cos\\theta}$', '$\\cot\\theta = \\dfrac{1}{\\tan\\theta}$'] }),
            sc(5, 'Ángulo de **elevación**: se mide hacia arriba desde la horizontal. Con él calculas alturas sin subirte al edificio.', { title: '$h = d \\tan\\theta$', viz: { type: 'triangle', from: 25, to: 52, labels: { adj: '40 m', op: 'h' }, show: 'tan' } }),
            sc(5, 'Ejemplo: a 40 m del edificio, el ángulo de elevación es $52^\\circ$.', { steps: ['$h = 40 \\tan 52^\\circ$', '$h \\approx 40 \\cdot 1.28 \\approx 51.2$ m'] }),
          ] },
          ex: [
            num('En un triángulo rectángulo los catetos miden 5 y 12. ¿Cuánto mide la hipotenusa?', 13, '$\\sqrt{25 + 144} = 13$.'),
            mc('En ese triángulo, si $\\theta$ es opuesto al cateto 5, ¿cuánto vale $\\csc\\theta$?', ['$\\tfrac{13}{5}$', '$\\tfrac{5}{13}$', '$\\tfrac{12}{5}$', '$\\tfrac{13}{12}$'], 0, '$\\csc\\theta = \\tfrac{\\text{hip}}{\\text{op}} = \\tfrac{13}{5}$.'),
            mc('Si $\\theta$ es agudo y $\\sec\\theta = \\tfrac{7}{2}$, entonces $\\cos\\theta = \\;?$', ['$\\tfrac{2}{7}$', '$\\tfrac{7}{2}$', '$\\tfrac{\\sqrt{45}}{7}$', '$\\tfrac{5}{7}$'], 0, 'La secante es la recíproca del coseno.'),
            num('A 40 m de un edificio, el ángulo de elevación a la azotea es $52^\\circ$. Altura del edificio (usa $\\tan 52^\\circ \\approx 1.28$)', 51.2, '$h = 40 \\cdot 1.28 = 51.2$ m.', { tol: 0.3, suffix: 'm' }),
          ],
        },
        {
          id: 'trig-3', title: 'La circunferencia unitaria',
          clip: { scenes: [
            sc(4, 'Una circunferencia de radio 1 centrada en el origen.', { viz: { type: 'circle', from: 0, to: 30 } }),
            sc(6, 'Gira un ángulo $t$: el punto terminal tiene coordenadas $(\\cos t, \\sen t)$.', { title: '$P(t) = (\\cos t, \\sen t)$', viz: { type: 'circle', from: 30, to: 360 } }),
            sc(5, 'Así el seno y el coseno funcionan para **cualquier** número real, no solo ángulos agudos.', { viz: { type: 'circle', from: 90, to: 270 } }),
            sc(4, 'Después de una vuelta completa, todo se repite: son funciones **periódicas**.', { steps: ['$\\sen(t + 2\\pi) = \\sen t$', '$\\cos(t + 2\\pi) = \\cos t$'] }),
          ] },
          ex: [
            sld('Gira $\\theta$ hasta que $\\cos\\theta = 0$ y $\\sen\\theta = 1$', {
              viz: { type: 'circle' }, min: 0, max: 360, step: 15, init: 30,
              readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 90, answerText: '$\\theta = 90^\\circ$',
              explain: 'En $90^\\circ$ el punto está arriba: $(0, 1)$.',
            }),
            num('$\\sen 270^\\circ = \\;?$', -1, 'En $270^\\circ$ el punto está abajo: $(0, -1)$.'),
            mc('¿El punto $\\left(-\\tfrac45, \\tfrac35\\right)$ está en la circunferencia unitaria?', ['Sí, porque $\\tfrac{16}{25} + \\tfrac{9}{25} = 1$', 'No, porque tiene una coordenada negativa', 'No, porque $\\tfrac45 + \\tfrac35 \\neq 1$', 'Solo si $t = \\pi$'], 0, 'Un punto está en ella si $x^2 + y^2 = 1$.'),
            mc('Para ese punto, $\\tan t = \\;?$', ['$-\\tfrac34$', '$\\tfrac34$', '$-\\tfrac43$', '$\\tfrac35$'], 0, '$\\tan t = \\tfrac{y}{x} = \\tfrac{3/5}{-4/5}$.'),
          ],
        },
        {
          id: 'trig-43b', title: 'Signos y ángulo de referencia',
          clip: { scenes: [
            sc(5, 'El signo depende del cuadrante. Regla: **I** todas, **II** seno, **III** tangente, **IV** coseno.', { viz: { type: 'circle', from: 45, to: 315 } }),
            sc(5, 'El **ángulo de referencia** es el ángulo agudo con el eje $x$. Da el valor; el cuadrante da el signo.', { steps: ['$225^\\circ$: referencia $45^\\circ$, cuadrante III', '$\\sen 225^\\circ = -\\tfrac{\\sqrt2}{2}$'] }),
            sc(5, '**Paridad**: el coseno es par y el seno es impar.', { steps: ['$\\cos(-t) = \\cos t$', '$\\sen(-t) = -\\sen t$', '$\\tan(-t) = -\\tan t$'] }),
          ] },
          ex: [
            mc('$\\sen 225^\\circ = \\;?$', ['$-\\tfrac{\\sqrt2}{2}$', '$\\tfrac{\\sqrt2}{2}$', '$-\\tfrac12$', '$-1$'], 0, 'Referencia $45^\\circ$, y en III el seno es negativo.'),
            mc('$\\cos \\tfrac{5\\pi}{3} = \\;?$', ['$\\tfrac12$', '$-\\tfrac12$', '$\\tfrac{\\sqrt3}{2}$', '$-\\tfrac{\\sqrt3}{2}$'], 0, '$\\tfrac{5\\pi}{3} = 300^\\circ$: referencia $60^\\circ$, cuadrante IV (coseno positivo).'),
            num('Ángulo de referencia de $210^\\circ$', 30, '$210^\\circ - 180^\\circ = 30^\\circ$.', { suffix: '°' }),
            mc('Si $\\sen\\theta = -\\tfrac35$ y $\\tan\\theta > 0$, $\\theta$ está en el cuadrante…', ['III', 'II', 'IV', 'I'], 0, 'Seno negativo y tangente positiva: III.'),
          ],
        },
        {
          id: 'trig-44a', title: 'Seno y coseno: amplitud',
          clip: { scenes: [
            sc(5, 'Al "desenrollar" la circunferencia, la altura del punto dibuja la onda **seno**.', { title: '$y = \\sen x$', viz: { type: 'graph', xr: [0, 7], yr: [-3.5, 3.5], f: Math.sin, draw: true, ax: ['x', 'y'] } }),
            sc(5, 'La **amplitud** $|a|$ estira la onda verticalmente.', { title: '$y = a \\sen x$', viz: { type: 'graph', xr: [0, 7], yr: [-3.5, 3.5], f: (x, a) => a * Math.sin(x), anim: [1, 3], label: a => `a = ${fmt(a, 1)}` } }),
            sc(5, '$d$ desplaza la onda hacia arriba o abajo. El rango es $[d - |a|,\\, d + |a|]$.', { title: '$y = a \\sen x + d$', viz: { type: 'graph', xr: [0, 7], yr: [-3.5, 4.5], f: (x, d) => Math.sin(x) + d, anim: [0, 2], label: d => `d = ${fmt(d, 1)}` } }),
          ] },
          ex: [
            sld('Ajusta $a$ para que $y = a \\sen x$ tenga valor máximo $3$', {
              viz: { type: 'graph', xr: [0, 7], yr: [-4, 4], f: (x, a) => a * Math.sin(x), fs: [{ f: (x, a) => a * Math.sin(x) }, { f: () => 3, color: 'rgba(250,204,21,.6)', dash: true }] },
              min: 0, max: 4, step: 0.5, init: 1, readout: v => `$a = ${v}$`,
              check: v => near(v, 3), answerText: '$a = 3$', explain: 'El máximo de $a\\sen x$ es $|a|$.',
            }),
            num('Amplitud de $y = -2\\cos x$', 2, 'La amplitud es $|a| = |-2| = 2$.'),
            mc('Rango de $y = 3 \\sen x + 1$', ['$[-2, 4]$', '$[-3, 3]$', '$[1, 4]$', '$[-1, 3]$'], 0, '$[d - |a|, d + |a|] = [1 - 3, 1 + 3]$.'),
            mc('¿Qué hace el signo negativo en $y = -2\\cos x$?', ['Refleja la gráfica respecto al eje $x$', 'Mueve la gráfica a la izquierda', 'Cambia el periodo', 'La baja dos unidades'], 0, 'Multiplicar por un negativo voltea la gráfica.'),
          ],
        },
        {
          id: 'trig-44b', title: 'Periodo, desfase y tangente',
          clip: { scenes: [
            sc(5, '$b$ comprime la onda: el **periodo** pasa a ser $\\tfrac{2\\pi}{b}$.', { title: '$y = \\sen(bx)$', viz: { type: 'graph', xr: [0, 7], yr: [-2, 2], f: (x, b) => Math.sin(b * x), anim: [1, 3], label: b => `b = ${fmt(b, 1)}  ·  periodo = ${fmt(2 * PI / b, 2)}` } }),
            sc(5, 'El **desfase** $\\tfrac{c}{b}$ corre la onda a la derecha.', { title: '$y = a \\sen(bx - c) + d$', viz: { type: 'graph', xr: [0, 7], yr: [-2, 2], f: (x, c) => Math.sin(x - c), anim: [0, 1.5], label: c => `desfase = ${fmt(c, 2)}` } }),
            sc(5, 'La tangente tiene periodo $\\pi$ y **asíntotas verticales** donde el coseno vale cero.', { title: '$x = \\tfrac{\\pi}{2} + k\\pi$', viz: { type: 'graph', xr: [-0.5, 7], yr: [-4, 4], f: Math.tan, draw: true } }),
          ] },
          ex: [
            sld('Ajusta $b$ para que $y = \\sen(bx)$ tenga periodo $\\pi$', {
              viz: { type: 'graph', xr: [0, 7], yr: [-1.6, 1.6], f: (x, b) => Math.sin(b * x), points: [[PI, 0, 'π']] },
              min: 0.5, max: 4, step: 0.5, init: 1, readout: v => `$b = ${v}$`,
              check: v => near(v, 2), answerText: '$b = 2$', explain: '$\\tfrac{2\\pi}{b} = \\pi \\Rightarrow b = 2$.',
            }),
            mc('Periodo de $y = 3\\sen\\left(2x - \\tfrac{\\pi}{3}\\right) + 1$', ['$\\pi$', '$2\\pi$', '$\\tfrac{\\pi}{3}$', '$\\tfrac{\\pi}{6}$'], 0, '$\\tfrac{2\\pi}{2} = \\pi$.'),
            mc('Desfase de esa misma función', ['$\\tfrac{\\pi}{6}$ a la derecha', '$\\tfrac{\\pi}{3}$ a la derecha', '$\\tfrac{\\pi}{6}$ a la izquierda', '$1$ hacia arriba'], 0, '$\\tfrac{c}{b} = \\tfrac{\\pi/3}{2} = \\tfrac{\\pi}{6}$.'),
            mc('Función $y = a\\sen(bx) + d$ con máximo 5, mínimo $-1$ y periodo 8', ['$y = 3\\sen\\left(\\tfrac{\\pi}{4}x\\right) + 2$', '$y = 5\\sen(8x) - 1$', '$y = 3\\sen(8x) + 2$', '$y = 6\\sen\\left(\\tfrac{\\pi}{4}x\\right)$'], 0, '$a = \\tfrac{5 - (-1)}{2} = 3$, $d = \\tfrac{5 + (-1)}{2} = 2$, $b = \\tfrac{2\\pi}{8} = \\tfrac{\\pi}{4}$.'),
          ],
        },
      ],
    },
    {
      title: 'Funciones trigonométricas inversas y aplicaciones',
      lessons: [
        {
          id: 'trig-45', title: 'Seno, coseno y tangente inversos',
          clip: { scenes: [
            sc(5, 'El seno no es inyectivo: muchos ángulos dan el mismo valor. Para invertirlo, **restringimos** el dominio a $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$.', { viz: { type: 'graph', xr: [-4, 4], yr: [-2, 2], fs: [{ f: Math.sin, color: 'rgba(255,255,255,.3)' }, { f: x => (Math.abs(x) <= PI / 2 ? Math.sin(x) : NaN) }] } }),
            sc(5, '$\\sen^{-1} x$ responde: ¿qué ángulo de ese intervalo tiene seno $x$?', { title: '$y = \\sen^{-1}x \\iff \\sen y = x$', viz: { type: 'graph', xr: [-1.5, 1.5], yr: [-2, 2], f: Math.asin, draw: true } }),
            sc(5, 'Cada inversa tiene su rango:', { steps: ['$\\sen^{-1}: \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$', '$\\cos^{-1}: [0, \\pi]$', '$\\tan^{-1}: \\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)$'] }),
          ] },
          ex: [
            mc('$\\sen^{-1}\\left(-\\tfrac12\\right) = \\;?$', ['$-\\tfrac{\\pi}{6}$', '$\\tfrac{7\\pi}{6}$', '$\\tfrac{11\\pi}{6}$', '$-\\tfrac{\\pi}{3}$'], 0, 'Debe estar en $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$.'),
            mc('$\\cos^{-1}\\left(-\\tfrac{\\sqrt2}{2}\\right) = \\;?$', ['$\\tfrac{3\\pi}{4}$', '$-\\tfrac{\\pi}{4}$', '$\\tfrac{5\\pi}{4}$', '$\\tfrac{\\pi}{4}$'], 0, 'El rango de $\\cos^{-1}$ es $[0, \\pi]$.'),
            mc('$\\tan^{-1}\\sqrt3 = \\;?$', ['$\\tfrac{\\pi}{3}$', '$\\tfrac{\\pi}{6}$', '$\\tfrac{\\pi}{4}$', '$\\tfrac{4\\pi}{3}$'], 0, '$\\tan \\tfrac{\\pi}{3} = \\sqrt3$.'),
            mc('$\\sen^{-1}\\left(\\sen \\tfrac{5\\pi}{6}\\right) = \\;?$', ['$\\tfrac{\\pi}{6}$', '$\\tfrac{5\\pi}{6}$', '$-\\tfrac{\\pi}{6}$', '$\\tfrac12$'], 0, '$\\sen\\tfrac{5\\pi}{6} = \\tfrac12$ y $\\sen^{-1}\\tfrac12 = \\tfrac{\\pi}{6}$: la cancelación solo vale en el intervalo restringido.'),
            num('Una escalera de 6 m alcanza 5 m de altura en un muro. Ángulo con el piso, en grados', Math.asin(5 / 6) * 180 / PI, '$\\theta = \\sen^{-1}\\tfrac56 \\approx 56.4^\\circ$.', { tol: 0.3, suffix: '°', answerText: '$\\approx 56.4^\\circ$' }),
          ],
        },
        {
          id: 'trig-4', title: 'Identidades fundamentales',
          clip: { scenes: [
            sc(5, 'En la circunferencia unitaria, coseno y seno forman un triángulo con hipotenusa 1.', { viz: { type: 'circle', from: 20, to: 70 } }),
            sc(5, 'Por Pitágoras, siempre se cumple:', { title: '$\\sen^2\\theta + \\cos^2\\theta = 1$', viz: { type: 'circle', from: 70, to: 160 } }),
            sc(6, 'Dividiendo entre $\\cos^2\\theta$ o entre $\\sen^2\\theta$ salen las otras dos:', { steps: ['$1 + \\tan^2\\theta = \\sec^2\\theta$', '$1 + \\cot^2\\theta = \\csc^2\\theta$'] }),
            sc(5, '**Cofunciones**: el seno de un ángulo es el coseno de su complemento.', { steps: ['$\\sen\\left(\\tfrac{\\pi}{2} - x\\right) = \\cos x$', '$\\tan\\left(\\tfrac{\\pi}{2} - x\\right) = \\cot x$'] }),
          ] },
          ex: [
            mc('$\\sen^2\\theta + \\cos^2\\theta = \\;?$', ['$1$', '$0$', '$\\tan\\theta$', '$2$'], 0, 'Es la identidad pitagórica.'),
            num('Si $\\sen\\theta = 0.6$ y $\\theta$ está en el cuadrante I, ¿cuánto vale $\\cos\\theta$?', 0.8, '$\\cos\\theta = \\sqrt{1 - 0.36} = \\sqrt{0.64} = 0.8$.'),
            mc('$\\tan\\theta$ es igual a…', ['$\\dfrac{\\sen\\theta}{\\cos\\theta}$', '$\\dfrac{\\cos\\theta}{\\sen\\theta}$', '$\\sen\\theta\\cos\\theta$', '$\\dfrac{1}{\\sen\\theta}$'], 0, 'Opuesto/adyacente = (op/hip) ÷ (ady/hip).'),
            ord('Ordena de menor a mayor', ['$\\sen 0^\\circ$', '$\\sen 30^\\circ$', '$\\sen 60^\\circ$', '$\\sen 90^\\circ$'], '$0 < 0.5 < 0.87 < 1$: el seno crece de 0° a 90°.'),
          ],
        },
        {
          id: 'trig-47b', title: 'Simplificar y demostrar',
          clip: { scenes: [
            sc(5, 'Una **identidad** es cierta para todo $x$ del dominio; una **ecuación** solo para algunos valores.', { steps: ['$\\sen^2x + \\cos^2x = 1$: identidad', '$\\sen x = \\tfrac12$: ecuación'] }),
            sc(6, 'Estrategia: trabaja con el lado más complejo y escribe todo en senos y cosenos.', { steps: ['$\\tan x + \\cot x = \\dfrac{\\sen x}{\\cos x} + \\dfrac{\\cos x}{\\sen x}$', '$= \\dfrac{\\sen^2 x + \\cos^2 x}{\\sen x \\cos x}$', '$= \\dfrac{1}{\\sen x \\cos x} = \\sec x \\csc x$'] }),
            sc(5, 'Para refutar una falsa identidad basta **un contraejemplo**.', { steps: ['¿$\\sen(x + y) = \\sen x + \\sen y$?', '$x = y = \\tfrac{\\pi}{2}$: $\\sen \\pi = 0 \\neq 2$'] }),
          ] },
          ex: [
            mc('Simplifica $(1 - \\sen^2 x)(1 + \\tan^2 x)$', ['$1$', '$\\cos^2 x$', '$\\sec^2 x$', '$\\sen^2 x$'], 0, '$\\cos^2 x \\cdot \\sec^2 x = 1$.'),
            ord('Ordena la demostración de $\\tan x + \\cot x = \\sec x \\csc x$', ['$\\dfrac{\\sen x}{\\cos x} + \\dfrac{\\cos x}{\\sen x}$', '$\\dfrac{\\sen^2 x + \\cos^2 x}{\\sen x \\cos x}$', '$\\dfrac{1}{\\sen x \\cos x}$', '$\\sec x \\csc x$'], 'Escribe en senos y cosenos, suma las fracciones y usa la identidad pitagórica.'),
            mc('Un contraejemplo para $\\sen(x + y) = \\sen x + \\sen y$ es…', ['$x = y = \\tfrac{\\pi}{2}$', '$x = y = 0$', '$x = 0, y = \\pi$', '$x = \\pi, y = 0$'], 0, 'Con $x = y = \\tfrac{\\pi}{2}$: $0 \\neq 2$. En los otros casos la igualdad sí se cumple.'),
            mc('Simplifica $\\dfrac{\\sec x - \\cos x}{\\tan x}$', ['$\\sen x$', '$\\cos x$', '$\\tan x$', '$1$'], 0, '$\\dfrac{\\frac{1 - \\cos^2 x}{\\cos x}}{\\frac{\\sen x}{\\cos x}} = \\dfrac{\\sen^2 x}{\\sen x} = \\sen x$.'),
          ],
        },
        {
          id: 'trig-48a', title: 'Suma y resta de ángulos',
          clip: { scenes: [
            sc(6, 'El seno y el coseno de una suma **no** se reparten: tienen su propia fórmula.', { steps: ['$\\sen(x \\pm y) = \\sen x \\cos y \\pm \\cos x \\sen y$', '$\\cos(x \\pm y) = \\cos x \\cos y \\mp \\sen x \\sen y$'] }),
            sc(6, 'Así obtienes valores exactos de ángulos "raros":', { steps: ['$\\cos 75^\\circ = \\cos(45^\\circ + 30^\\circ)$', '$= \\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2} - \\tfrac{\\sqrt2}{2}\\cdot\\tfrac12$', '$= \\dfrac{\\sqrt6 - \\sqrt2}{4}$'] }),
            sc(5, 'Y para la tangente:', { title: '$\\tan(x \\pm y) = \\dfrac{\\tan x \\pm \\tan y}{1 \\mp \\tan x \\tan y}$' }),
          ] },
          ex: [
            mc('$\\cos 75^\\circ = \\;?$', ['$\\dfrac{\\sqrt6 - \\sqrt2}{4}$', '$\\dfrac{\\sqrt6 + \\sqrt2}{4}$', '$\\dfrac{\\sqrt3 - 1}{2}$', '$\\dfrac{\\sqrt2}{4}$'], 0, '$\\cos(45^\\circ + 30^\\circ)$ con la fórmula de suma.'),
            mc('$\\sen 15^\\circ = \\;?$', ['$\\dfrac{\\sqrt6 - \\sqrt2}{4}$', '$\\dfrac{\\sqrt6 + \\sqrt2}{4}$', '$\\tfrac14$', '$\\dfrac{\\sqrt3}{4}$'], 0, '$\\sen(45^\\circ - 30^\\circ) = \\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2} - \\tfrac{\\sqrt2}{2}\\cdot\\tfrac12$.'),
            num('Si $\\sen\\alpha = \\tfrac35$ ($\\alpha$ en I) y $\\cos\\beta = -\\tfrac{5}{13}$ ($\\beta$ en II), calcula $\\sen(\\alpha + \\beta)$', 33 / 65, '$\\cos\\alpha = \\tfrac45$, $\\sen\\beta = \\tfrac{12}{13}$: $\\tfrac35\\left(-\\tfrac{5}{13}\\right) + \\tfrac45 \\cdot \\tfrac{12}{13} = \\tfrac{33}{65}$.', { tol: 0.005, answerText: '$\\tfrac{33}{65} \\approx 0.508$' }),
            mc('¿Es cierto que $\\cos(x + y) = \\cos x + \\cos y$?', ['No, se usa $\\cos x\\cos y - \\sen x \\sen y$', 'Sí, siempre', 'Solo en grados', 'Solo si $x = y$'], 0, 'Con $x = y = 0$: $\\cos 0 = 1 \\neq 2$.'),
          ],
        },
        {
          id: 'trig-48b', title: 'Ángulo doble y ángulo medio',
          clip: { scenes: [
            sc(5, 'Si en la fórmula de suma haces $y = x$, obtienes el **ángulo doble**:', { steps: ['$\\sen 2x = 2 \\sen x \\cos x$', '$\\cos 2x = \\cos^2 x - \\sen^2 x$', '$= 1 - 2\\sen^2 x = 2\\cos^2 x - 1$'] }),
            sc(5, 'Despejando, reduces potencias (muy útil en cálculo):', { steps: ['$\\sen^2 x = \\dfrac{1 - \\cos 2x}{2}$', '$\\cos^2 x = \\dfrac{1 + \\cos 2x}{2}$'] }),
            sc(5, '**Ángulo medio**: el signo depende del cuadrante de $\\tfrac{u}{2}$.', { title: '$\\sen\\dfrac{u}{2} = \\pm\\sqrt{\\dfrac{1 - \\cos u}{2}}$' }),
          ] },
          ex: [
            num('Si $\\sen x = \\tfrac35$ y $x$ está en el cuadrante I, calcula $\\sen 2x$', 0.96, '$2 \\cdot \\tfrac35 \\cdot \\tfrac45 = \\tfrac{24}{25} = 0.96$.'),
            mc('$\\cos 2x$ también se puede escribir como…', ['$1 - 2\\sen^2 x$', '$2\\sen x\\cos x$', '$1 + 2\\sen^2 x$', '$\\cos^2 x + \\sen^2 x$'], 0, 'Sustituye $\\cos^2 x = 1 - \\sen^2 x$.'),
            mc('$\\sen^2 x$ en términos del coseno del ángulo doble', ['$\\dfrac{1 - \\cos 2x}{2}$', '$\\dfrac{1 + \\cos 2x}{2}$', '$1 - \\cos 2x$', '$\\dfrac{\\cos 2x}{2}$'], 0, 'Despeja de $\\cos 2x = 1 - 2\\sen^2 x$.'),
            mc('$\\cos 3x = \\;?$', ['$4\\cos^3 x - 3\\cos x$', '$3\\cos x - 4\\cos^3 x$', '$3\\cos x$', '$\\cos^3 x$'], 0, 'Escribe $\\cos(2x + x)$ y usa las fórmulas de ángulo doble.'),
          ],
        },
        {
          id: 'trig-49', title: 'Resolver ecuaciones trigonométricas',
          clip: { scenes: [
            sc(5, 'Al resolver $\\sen x = \\tfrac12$ hay **dos** soluciones en cada vuelta.', { title: '$2\\sen x - 1 = 0$', viz: { type: 'graph', xr: [0, 6.6], yr: [-1.5, 1.5], fs: [{ f: Math.sin }, { f: () => 0.5, color: '#facc15', dash: true }], points: [[PI / 6, 0.5, 'π/6'], [5 * PI / 6, 0.5, '5π/6']] } }),
            sc(5, 'Solución general: suma vueltas completas.', { steps: ['$x = \\tfrac{\\pi}{6} + 2n\\pi$', '$x = \\tfrac{5\\pi}{6} + 2n\\pi$'] }),
            sc(6, 'Las de tipo cuadrático se factorizan como en álgebra:', { steps: ['$2\\cos^2 x + \\cos x - 1 = 0$', '$(2\\cos x - 1)(\\cos x + 1) = 0$', '$x = \\tfrac{\\pi}{3}, \\; \\pi, \\; \\tfrac{5\\pi}{3}$'] }),
            sc(5, 'Si elevas al cuadrado, verifica: pueden aparecer **soluciones extrañas**.', { steps: ['$\\sen x + \\cos x = 1$', 'Al elevar al cuadrado: $\\sen 2x = 0$', 'Verifica cada candidato en la original'] }),
          ] },
          ex: [
            sld('Gira $\\theta$ hasta otro ángulo (distinto de $30^\\circ$) con $\\sen\\theta = \\tfrac12$', {
              viz: { type: 'circle' }, min: 0, max: 360, step: 15, init: 30,
              readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 150, answerText: '$\\theta = 150^\\circ = \\tfrac{5\\pi}{6}$',
              explain: 'El seno es positivo en I y II: $180^\\circ - 30^\\circ = 150^\\circ$.',
            }),
            mc('Soluciones de $2\\cos^2 x + \\cos x - 1 = 0$ en $[0, 2\\pi)$', ['$\\tfrac{\\pi}{3}, \\pi, \\tfrac{5\\pi}{3}$', '$\\tfrac{\\pi}{3}, \\tfrac{5\\pi}{3}$', '$\\tfrac{\\pi}{6}, \\pi$', '$0, \\tfrac{\\pi}{3}$'], 0, '$\\cos x = \\tfrac12$ o $\\cos x = -1$.'),
            mc('Soluciones de $\\sen 2x = \\cos x$ en $[0, 2\\pi)$', ['$\\tfrac{\\pi}{6}, \\tfrac{\\pi}{2}, \\tfrac{5\\pi}{6}, \\tfrac{3\\pi}{2}$', '$\\tfrac{\\pi}{6}, \\tfrac{5\\pi}{6}$', '$\\tfrac{\\pi}{2}, \\tfrac{3\\pi}{2}$', '$\\tfrac{\\pi}{4}, \\tfrac{5\\pi}{4}$'], 0, '$2\\sen x\\cos x - \\cos x = \\cos x(2\\sen x - 1) = 0$. ¡No dividas entre $\\cos x$!'),
            num('¿Cuántas soluciones tiene $\\tan 3x = 1$ en $[0, \\pi)$?', 3, '$3x = \\tfrac{\\pi}{4} + n\\pi \\Rightarrow x = \\tfrac{\\pi}{12}, \\tfrac{5\\pi}{12}, \\tfrac{9\\pi}{12}$.'),
          ],
        },
        {
          id: 'trig-46a', title: 'Ley de senos',
          clip: { scenes: [
            sc(5, 'Un triángulo **oblicuo** no tiene ángulo recto. Igual podemos resolverlo.', { viz: { type: 'oblique', a: 8, b: 10, C: 70 } }),
            sc(6, 'Cada lado es proporcional al seno de su ángulo opuesto.', { title: '$\\dfrac{\\sen A}{a} = \\dfrac{\\sen B}{b} = \\dfrac{\\sen C}{c}$', viz: { type: 'oblique', a: 8, b: 10, anim: [50, 100], show: 'senos' } }),
            sc(5, 'Úsala cuando conozcas dos ángulos y un lado (ALA, AAL). Con LLA puede haber 0, 1 o 2 triángulos: el **caso ambiguo**.', { steps: ['$A + B + C = 180^\\circ$', '$b = \\dfrac{a \\sen B}{\\sen A}$'] }),
          ] },
          ex: [
            num('En un triángulo, $A = 40^\\circ$ y $B = 65^\\circ$. ¿Cuánto mide $C$?', 75, '$180^\\circ - 40^\\circ - 65^\\circ = 75^\\circ$.', { suffix: '°' }),
            num('Si $a = 10$, $A = 30^\\circ$ y $B = 90^\\circ$, ¿cuánto mide $b$?', 20, '$b = \\dfrac{10 \\sen 90^\\circ}{\\sen 30^\\circ} = \\dfrac{10}{0.5} = 20$.'),
            mc('¿Qué datos llevan al caso ambiguo?', ['Dos lados y el ángulo opuesto a uno de ellos (LLA)', 'Tres lados (LLL)', 'Dos ángulos y un lado (AAL)', 'Dos lados y el ángulo comprendido (LAL)'], 0, 'Con LLA el lado puede "caer" en dos posiciones.'),
            mc('Para resolver con $A = 40^\\circ$, $B = 65^\\circ$ y $a = 12$, conviene usar…', ['La ley de senos', 'La ley de cosenos', 'El teorema de Pitágoras', 'La fórmula de Herón'], 0, 'Son dos ángulos y un lado (AAL).'),
          ],
        },
        {
          id: 'trig-46b', title: 'Ley de cosenos y área',
          clip: { scenes: [
            sc(6, 'Con dos lados y el ángulo entre ellos (LAL), la **ley de cosenos** da el tercer lado. Es un Pitágoras generalizado.', { title: '$c^2 = a^2 + b^2 - 2ab\\cos C$', viz: { type: 'oblique', a: 7, b: 9, anim: [40, 120], show: 'cosenos' } }),
            sc(5, 'Si $C = 90^\\circ$, $\\cos C = 0$ y vuelve a ser Pitágoras.', { viz: { type: 'oblique', a: 7, b: 9, C: 90, show: 'cosenos' } }),
            sc(6, 'Área: con dos lados y el ángulo comprendido, o con los tres lados (**Herón**).', { steps: ['$\\text{Área} = \\tfrac12 ab \\sen C$', '$\\text{Área} = \\sqrt{s(s - a)(s - b)(s - c)}$', '$s = \\tfrac{a + b + c}{2}$'] }),
          ] },
          ex: [
            num('Halla $c$ si $a = 7$, $b = 9$ y $C = 60^\\circ$', Math.sqrt(67), '$c^2 = 49 + 81 - 2(7)(9)(0.5) = 67 \\Rightarrow c = \\sqrt{67} \\approx 8.19$.', { tol: 0.02, answerText: '$\\sqrt{67} \\approx 8.19$' }),
            sld('Ajusta el ángulo $C$ para que el lado $c$ mida exactamente $\\sqrt{a^2 + b^2}$', {
              viz: { type: 'oblique', a: 7, b: 9, show: 'cosenos' }, min: 30, max: 150, step: 10, init: 50,
              readout: v => `$C = ${v}^\\circ$`, check: v => v === 90, answerText: '$C = 90^\\circ$',
              explain: 'Solo con $\\cos C = 0$ desaparece el término $-2ab\\cos C$.',
            }),
            num('Área del triángulo de lados 13, 14 y 15', 84, '$s = 21$, $\\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = \\sqrt{7056} = 84$.'),
            num('Dos barcos salen del mismo puerto con rumbos que forman $110^\\circ$, a 20 y 28 km/h. Distancia entre ellos tras 2 horas (km)', Math.sqrt(40 ** 2 + 56 ** 2 - 2 * 40 * 56 * Math.cos(110 * PI / 180)), 'Recorren 40 y 56 km: $d^2 = 40^2 + 56^2 - 2(40)(56)\\cos 110^\\circ \\Rightarrow d \\approx 79.2$ km.', { tol: 0.3, suffix: 'km', answerText: '$\\approx 79.2$ km' }),
          ],
        },
      ],
    },
    {
      title: 'Forma polar de números complejos',
      lessons: [
        {
          id: 'trig-151', title: 'Forma trigonométrica de un complejo',
          // Libro UdeA §15.1. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'Un complejo $z = a + bi$ es un punto del plano; también se describe por su **módulo** $r$ y su **argumento** $\\theta$.', { title: '$z = r(\\cos\\theta + i\\,\\sen\\theta)$', steps: ['$a = r\\cos\\theta,\\quad b = r\\,\\sen\\theta$', '$r = \\sqrt{a^2 + b^2},\\quad \\tan\\theta = \\tfrac{b}{a}$'] }),
            sc(6, 'El argumento se elige mirando el **cuadrante** del punto $(a, b)$, no solo la tangente.', { steps: ['$z = -2 - 2\\sqrt3\\,i$: $r = 4$, tercer cuadrante', '$\\tan\\theta = \\sqrt3 \\Rightarrow \\theta = \\tfrac{\\pi}{3} + \\pi = \\tfrac{4\\pi}{3}$'] }),
            sc(5, 'Los puntos sobre los ejes son los fáciles: reales positivos $\\theta = 0$, imaginarios positivos $\\theta = \\tfrac{\\pi}{2}$, reales negativos $\\theta = \\pi$, imaginarios negativos $\\theta = \\tfrac{3\\pi}{2}$.', { steps: ['$3i = 3(\\cos\\tfrac{\\pi}{2} + i\\,\\sen\\tfrac{\\pi}{2})$'] }),
          ] },
          ex: [
            mc('¿Cuál es la forma polar del número complejo $z = 1 + i$?', ['$\\sqrt2\\,(\\cos\\tfrac{\\pi}{4} + i\\,\\sen\\tfrac{\\pi}{4})$', '$2\\,(\\cos\\tfrac{\\pi}{4} + i\\,\\sen\\tfrac{\\pi}{4})$', '$\\sqrt2\\,(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$', '$2\\,(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$'], 0, '$r = \\sqrt{1 + 1} = \\sqrt2$ y, en el primer cuadrante, $\\tan\\theta = 1$ da $\\theta = \\tfrac{\\pi}{4}$.'),
            mc('¿Cuál es el argumento de $z = -1 + i\\sqrt3$?', ['$\\tfrac{2\\pi}{3}$', '$\\tfrac{\\pi}{3}$', '$\\tfrac{\\pi}{6}$', '$\\tfrac{5\\pi}{6}$'], 0, 'El punto $(-1, \\sqrt3)$ está en el segundo cuadrante; el ángulo de referencia es $\\tfrac{\\pi}{3}$, así que $\\theta = \\pi - \\tfrac{\\pi}{3} = \\tfrac{2\\pi}{3}$.'),
            mc('¿Cuál es la forma polar de $z = -4i$?', ['$4\\,(\\cos 270^\\circ + i\\,\\sen 270^\\circ)$', '$4\\,(\\cos 90^\\circ + i\\,\\sen 90^\\circ)$', '$4\\,(\\cos 180^\\circ + i\\,\\sen 180^\\circ)$', '$4\\,(\\cos 0^\\circ + i\\,\\sen 0^\\circ)$'], 0, 'El punto $(0, -4)$ está sobre el eje imaginario negativo: $r = 4$ y $\\theta = 270^\\circ$.'),
            mc('¿Cuál es el argumento de $z = 3i$?', ['$\\tfrac{\\pi}{2}$', '$0$', '$\\pi$', '$\\tfrac{3\\pi}{2}$'], 0, 'Está sobre el eje imaginario positivo: un cuarto de vuelta.'),
            mc('¿Cuál es la forma polar de $z = 2 + 2i$?', ['$2\\sqrt2\\,(\\cos 45^\\circ + i\\,\\sen 45^\\circ)$', '$4\\,(\\cos 45^\\circ + i\\,\\sen 45^\\circ)$', '$2\\,(\\cos 45^\\circ + i\\,\\sen 45^\\circ)$', '$2\\sqrt2\\,(\\cos 90^\\circ + i\\,\\sen 90^\\circ)$'], 0, '$r = \\sqrt{4 + 4} = 2\\sqrt2$ y $\\tan\\theta = 1$ en el primer cuadrante: $45^\\circ$.'),
            mc('¿Cuál es la forma polar de $z = -1 - i$?', ['$\\sqrt2\\,(\\cos\\tfrac{5\\pi}{4} + i\\,\\sen\\tfrac{5\\pi}{4})$', '$\\sqrt2\\,(\\cos\\tfrac{3\\pi}{4} + i\\,\\sen\\tfrac{3\\pi}{4})$', '$2\\,(\\cos\\tfrac{3\\pi}{4} + i\\,\\sen\\tfrac{3\\pi}{4})$', '$2\\,(\\cos\\tfrac{5\\pi}{4} + i\\,\\sen\\tfrac{5\\pi}{4})$'], 0, 'Tercer cuadrante con $r = \\sqrt2$: la referencia es $\\tfrac{\\pi}{4}$ y $\\theta = \\pi + \\tfrac{\\pi}{4} = \\tfrac{5\\pi}{4}$.'),
            num('¿Cuál es el módulo de $z = 3 + 4i$?', 5, '$r = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.'),
          ],
        },
        {
          id: 'trig-152', title: 'Producto, cociente y raíces: De Moivre',
          // Libro UdeA §15.2–15.3. Pendiente: video y juegos p5.
          clip: { scenes: [
            sc(6, 'En forma polar, **multiplicar** es multiplicar módulos y **sumar** argumentos; **dividir** es dividir módulos y **restar** argumentos.', { steps: ['$z_1 z_2 = r_1 r_2\\,[\\cos(\\theta_1 + \\theta_2) + i\\,\\sen(\\theta_1 + \\theta_2)]$', '$\\tfrac{z_1}{z_2} = \\tfrac{r_1}{r_2}\\,[\\cos(\\theta_1 - \\theta_2) + i\\,\\sen(\\theta_1 - \\theta_2)]$'] }),
            sc(6, '**Teorema de De Moivre**: elevar a $n$ es elevar el módulo a $n$ y multiplicar el argumento por $n$.', { title: '$z^n = r^n(\\cos n\\theta + i\\,\\sen n\\theta)$', steps: ['$(-1 + \\sqrt3\\,i)^{12} = 2^{12}(\\cos 8\\pi + i\\,\\sen 8\\pi) = 2^{12}$'] }),
            sc(7, 'Todo complejo $z \\ne 0$ tiene exactamente $n$ **raíces $n$-ésimas**, repartidas en un círculo de radio $\\sqrt[n]{r}$ cada $\\tfrac{360^\\circ}{n}$.', { title: '$w_k = \\sqrt[n]{r}\\left[\\cos\\tfrac{\\theta + 360^\\circ k}{n} + i\\,\\sen\\tfrac{\\theta + 360^\\circ k}{n}\\right]$', steps: ['Raíces cuartas de $-8 - 8\\sqrt3\\,i$ ($r = 16$, $\\theta = 240^\\circ$): $2\\,\\mathrm{cis}\\,60^\\circ, 150^\\circ, 240^\\circ, 330^\\circ$'] }),
          ] },
          ex: [
            mc('Si $z_1 = 2(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$ y $z_2 = 3(\\cos\\tfrac{\\pi}{6} + i\\,\\sen\\tfrac{\\pi}{6})$, entonces $z_1 z_2$ es', ['$6\\,(\\cos\\tfrac{\\pi}{2} + i\\,\\sen\\tfrac{\\pi}{2})$', '$5\\,(\\cos\\tfrac{\\pi}{2} + i\\,\\sen\\tfrac{\\pi}{2})$', '$6\\,(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$', '$5\\,(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$'], 0, 'Módulos: $2 \\cdot 3 = 6$. Argumentos: $\\tfrac{\\pi}{3} + \\tfrac{\\pi}{6} = \\tfrac{\\pi}{2}$.'),
            mc('¿Cómo se divide $z_1 = 4(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$ entre $z_2 = 2(\\cos\\tfrac{\\pi}{6} + i\\,\\sen\\tfrac{\\pi}{6})$?', ['$2\\,(\\cos\\tfrac{\\pi}{6} + i\\,\\sen\\tfrac{\\pi}{6})$', '$2\\,(\\cos\\tfrac{\\pi}{2} + i\\,\\sen\\tfrac{\\pi}{2})$', '$4\\,(\\cos\\tfrac{\\pi}{2} + i\\,\\sen\\tfrac{\\pi}{2})$', '$2\\,(\\cos\\tfrac{\\pi}{3} + i\\,\\sen\\tfrac{\\pi}{3})$'], 0, 'Módulos: $4 / 2 = 2$. Argumentos: $\\tfrac{\\pi}{3} - \\tfrac{\\pi}{6} = \\tfrac{\\pi}{6}$.'),
            mc('Sea $z = 4(\\cos 60^\\circ + i\\,\\sen 60^\\circ)$. ¿Cuál es $z^3$?', ['$64\\,(\\cos 180^\\circ + i\\,\\sen 180^\\circ)$', '$64\\,(\\cos 120^\\circ + i\\,\\sen 120^\\circ)$', '$12\\,(\\cos 180^\\circ + i\\,\\sen 180^\\circ)$', '$12\\,(\\cos 120^\\circ + i\\,\\sen 120^\\circ)$'], 0, 'De Moivre: $4^3 = 64$ y $3 \\cdot 60^\\circ = 180^\\circ$. Es el real $-64$.'),
            mc('Según el teorema de De Moivre, $(\\cos 45^\\circ + i\\,\\sen 45^\\circ)^6$ es', ['$\\cos 270^\\circ + i\\,\\sen 270^\\circ$', '$\\cos 180^\\circ + i\\,\\sen 180^\\circ$', '$\\cos 360^\\circ + i\\,\\sen 360^\\circ$', '$\\cos 135^\\circ + i\\,\\sen 135^\\circ$'], 0, '$6 \\cdot 45^\\circ = 270^\\circ$ y el módulo $1^6 = 1$: el resultado es $-i$.'),
            mc('El menor entero positivo $n$ tal que $\\left(\\tfrac{\\sqrt2}{2} + \\tfrac{\\sqrt2}{2}i\\right)^n = 1$ es', ['$8$', '$2$', '$4$', '$6$'], 0, 'Ese número es $\\cos 45^\\circ + i\\,\\sen 45^\\circ$; su potencia $n$ tiene argumento $45^\\circ n$, que debe ser múltiplo de $360^\\circ$: $n = 8$.'),
            mc('Si $z = 1 + i$, entonces $z^6$ es igual a', ['$8\\,(\\cos 270^\\circ + i\\,\\sen 270^\\circ)$', '$8\\,(\\cos 225^\\circ + i\\,\\sen 225^\\circ)$', '$8\\,(\\cos 315^\\circ + i\\,\\sen 315^\\circ)$', '$8\\,(\\cos 210^\\circ + i\\,\\sen 210^\\circ)$'], 0, '$1 + i = \\sqrt2\\,\\mathrm{cis}\\,45^\\circ$, así que $z^6 = (\\sqrt2)^6\\,\\mathrm{cis}\\,270^\\circ = 8\\,\\mathrm{cis}\\,270^\\circ = -8i$.'),
            mc('Una de las tres raíces cúbicas de $z = -1 + \\sqrt3\\,i$ es', ['$\\sqrt[3]{2}\\,(\\cos 280^\\circ + i\\,\\sen 280^\\circ)$', '$\\sqrt[3]{2}\\,(\\cos 60^\\circ + i\\,\\sen 60^\\circ)$', '$\\sqrt[3]{2}\\,(\\cos 150^\\circ + i\\,\\sen 150^\\circ)$', '$\\sqrt[3]{2}\\,(\\cos 120^\\circ + i\\,\\sen 120^\\circ)$'], 0, '$r = 2$ y $\\theta = 120^\\circ$. Las raíces son $\\sqrt[3]{2}\\,\\mathrm{cis}\\,\\tfrac{120^\\circ + 360^\\circ k}{3}$: $40^\\circ$, $160^\\circ$ y $280^\\circ$.'),
          ],
        },
      ],
    },
  ],
};
