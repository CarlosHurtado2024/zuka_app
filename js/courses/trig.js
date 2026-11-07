// Curso de Trigonometría — sigue la Parte IV «Trigonometría» (unidades 13–15) del Manual de
// Álgebra y Trigonometría (Instituto de Matemáticas, UdeA, 2024).

const PI = Math.PI;

const COURSE_TRIG = {
  id: 'trig', level: 'Fundamentos', name: 'Trigonometría', icon: 'θ', color: '#22d3ee',
  tagline: 'Ángulos, triángulos y ondas: medir lo que no se puede alcanzar con una regla.',
  units: [
    {
      title: 'Funciones trigonométricas, propiedades y gráficas',
      lessons: [
        {
          id: 'trig-41a', title: 'Grados y radianes',
          // Clase T1 (video/clase_trig_t1): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'Un ángulo en **posición estándar** empieza en el eje $x$ positivo. Girar en sentido antihorario es positivo.', { viz: { type: 'circle', from: 0, to: 135 } }),
            sc(5, 'Un **radián** es el ángulo cuyo arco mide lo mismo que el radio. Media vuelta son $\\pi$ radianes.', { title: '$180^\\circ = \\pi \\text{ rad}$', viz: { type: 'circle', from: 0, to: 180 } }),
            sc(5, 'Para convertir, multiplica por $\\tfrac{\\pi}{180}$ o por $\\tfrac{180}{\\pi}$.', { steps: ['$135^\\circ \\cdot \\dfrac{\\pi}{180} = \\dfrac{3\\pi}{4}$', '$\\dfrac{7\\pi}{6} \\cdot \\dfrac{180}{\\pi} = 210^\\circ$'] }),
            sc(5, 'Ángulos **coterminales** terminan en el mismo lado: difieren en vueltas completas.', { title: '$\\theta + 360^\\circ k$', steps: ['$400^\\circ - 360^\\circ = 40^\\circ$', '$40^\\circ - 360^\\circ = -320^\\circ$'] }),
          ] },
          ex: [
            play('rueda-angulo', 'Gira el lado terminal hasta cada ángulo en radianes', {
              snap: 15,
              rounds: [{ target: 150, label: '5π/6', tex: '\\tfrac{5\\pi}{6}' }, { target: -135, label: '−3π/4', tex: '-\\tfrac{3\\pi}{4}' }, { target: 300, label: '5π/3', tex: '\\tfrac{5\\pi}{3}' }],
            }, 'Cada $\\tfrac{\\pi}{6}$ son $30^\\circ$ y cada $\\tfrac{\\pi}{4}$ son $45^\\circ$: $\\tfrac{5\\pi}{6} = 5 \\cdot 30^\\circ = 150^\\circ$, $-\\tfrac{3\\pi}{4} = -135^\\circ$ (hacia el reloj) y $\\tfrac{5\\pi}{3} = 5 \\cdot 60^\\circ = 300^\\circ$.',
              { hint: 'Convierte primero la fracción de π: π son 180°, así que π/6 son 30°, π/4 son 45° y π/3 son 60°. Multiplica por el número de arriba. Si hay un menos, gira como las manecillas del reloj.' }),
            play('rueda-angulo', 'Gira con vueltas completas, hacia atrás o hasta el suplemento', {
              snap: 5,
              rounds: [{ target: 405, label: '405°', tex: '405^\\circ' }, { target: -210, label: '−210°', tex: '-210^\\circ' }, { target: 145, label: 'el suplemento de 35°', tex: '180^\\circ - 35^\\circ' }],
            }, '$405^\\circ$ es una vuelta completa y $45^\\circ$ más (coterminal con $45^\\circ$); $-210^\\circ$ gira hacia el reloj y queda donde $150^\\circ$; el suplemento de $35^\\circ$ completa media vuelta: $180^\\circ - 35^\\circ = 145^\\circ$.',
              { hint: 'Puedes dar más de una vuelta: la espiral cuenta las vueltas. Para un ángulo negativo, gira como las manecillas del reloj. Dos ángulos suplementarios suman 180°.' }),
            play('une-parejas', 'Une cada ángulo en grados con su medida en radianes', {
              left: ['30°', '135°', '210°', '270°', '330°'],
              right: ['π/6', '3π/4', '7π/6', '3π/2', '11π/6', 'π/3', '5π/4'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'Multiplica por $\\tfrac{\\pi}{180}$ y simplifica: $30^\\circ = \\tfrac{\\pi}{6}$, $135^\\circ = \\tfrac{3\\pi}{4}$, $210^\\circ = \\tfrac{7\\pi}{6}$, $270^\\circ = \\tfrac{3\\pi}{2}$ y $330^\\circ = \\tfrac{11\\pi}{6}$.',
              { hint: 'Piensa en cuántos «pedazos» de 30° o de 45° tiene el ángulo: 30° es π/6, así que 210° son siete de esos pedazos. Para 135°, cuenta pedazos de 45°, que es π/4.' }),
            num('¿Cuántos grados mide, aproximadamente, un radián? (redondea a una décima)', 180 / PI, '$1 \\text{ rad} = \\tfrac{180^\\circ}{\\pi} \\approx 57.3^\\circ$: el ángulo cuyo arco mide lo mismo que el radio.',
              { tol: 0.06, suffix: '°', answerText: '$\\approx 57.3^\\circ$', hint: 'Media vuelta son 180 grados y también π radianes: ¿cuántos grados le tocan a cada uno de esos radianes?' }),
          ],
        },
        {
          id: 'trig-41b', title: 'Arco, sector y movimiento circular',
          // Clase T2 (video/clase_trig_t2): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'Con el ángulo en **radianes**, la longitud del arco es radio por ángulo.', { title: '$s = r\\theta$', viz: { type: 'sector', r: 12, anim: [30, 150], unit: 'cm' } }),
            sc(5, 'El área del sector es una fracción del círculo:', { title: '$A = \\tfrac12 r^2 \\theta$', viz: { type: 'sector', r: 12, ang: 150, unit: 'cm' } }),
            sc(6, 'En una rueda que gira, la **rapidez angular** $\\omega$ y la **lineal** $v$ se relacionan con el radio.', { steps: ['$\\omega = \\dfrac{\\theta}{t}$', '$v = \\dfrac{s}{t} = r\\,\\omega$', '300 rpm $= 300 \\cdot 2\\pi = 600\\pi$ rad/min'] }),
          ] },
          ex: [
            play('corta-pizza', 'Corta la porción con el arco o el área que se pide', {
              rounds: [
                { goal: 'arc', value: 4 * PI, r: 6, label: 'arco s = 4π ≈ 12.57 con r = 6' },
                { goal: 'area', value: 2 * PI, r: 4, label: 'área A = 2π ≈ 6.28 con r = 4' },
                { goal: 'arc', value: 2 * PI, deg: 60, rMin: 2, rMax: 10, label: 'arco 2π ≈ 6.28 con un ángulo de 60°' },
              ],
            }, 'Con $s = r\\theta$: $\\theta = \\tfrac{4\\pi}{6} = \\tfrac{2\\pi}{3} = 120^\\circ$. Con $A = \\tfrac12 r^2 \\theta$: $\\theta = \\tfrac{2 \\cdot 2\\pi}{16} = \\tfrac{\\pi}{4} = 45^\\circ$. Y con $60^\\circ = \\tfrac{\\pi}{3}$: $r = \\tfrac{2\\pi}{\\pi/3} = 6$.',
              { hint: 'Despeja antes de cortar: del arco, θ = s / r; del área, θ = 2A / r². El ángulo sale en radianes: pásalo a grados multiplicando por 180/π. En la última ronda el ángulo está fijo y lo que cambias es el radio.' }),
            play('ordena-terminos', 'Una rueda de bicicleta de 0.3 m de radio da 3 vueltas por segundo. Ordena los pasos para hallar su rapidez con $v = r\\omega$', { tex: 'v = r\\omega', chips: ['ω = 3 · 2π = 6π rad/s', 'v = 0.3 · 6π', 'v = 1.8π ≈ 5.65 m/s', 'ω = 3 rad/s', 'v = 0.3 · 3'], order: [0, 1, 2], sep: '→' },
              'Cada vuelta son $2\\pi$ radianes: $\\omega = 3 \\cdot 2\\pi = 6\\pi$ rad/s. Luego $v = r\\,\\omega = 0.3 \\cdot 6\\pi = 1.8\\pi \\approx 5.65$ m/s. «3 rad/s» olvida pasar las vueltas a radianes.',
              { hint: 'Primero pasa las vueltas por segundo a radianes por segundo: una vuelta son 2π radianes. Después multiplica por el radio.' }),
            num('Un punto del borde de una rueda de 50 cm de radio gira $120^\\circ$. ¿Cuántos centímetros recorre? (usa $\\pi \\approx 3.1416$)', 100 * PI / 3, '$120^\\circ = \\tfrac{2\\pi}{3}$ y $s = 50 \\cdot \\tfrac{2\\pi}{3} = \\tfrac{100\\pi}{3} \\approx 104.7$ cm.',
              { tol: 0.5, suffix: 'cm', answerText: '$\\tfrac{100\\pi}{3} \\approx 104.7$ cm', hint: 'Pasa el ángulo a radianes (120° es dos tercios de π) y usa s = r θ.' }),
          ],
        },
        {
          id: 'trig-1', title: 'SOH · CAH · TOA',
          // Clase T3 (video/clase_trig_t3): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(4, 'En un triángulo rectángulo nombramos los lados respecto al ángulo $\\theta$.', { viz: { type: 'triangle', from: 35 } }),
            sc(5, '**SOH**: seno = opuesto ÷ hipotenusa.', { title: '$\\sen\\theta = \\dfrac{\\text{op}}{\\text{hip}}$', viz: { type: 'triangle', from: 20, to: 60, show: 'sin' } }),
            sc(5, '**CAH**: coseno = adyacente ÷ hipotenusa.', { title: '$\\cos\\theta = \\dfrac{\\text{ady}}{\\text{hip}}$', viz: { type: 'triangle', from: 60, to: 20, show: 'cos' } }),
            sc(5, '**TOA**: tangente = opuesto ÷ adyacente.', { title: '$\\tan\\theta = \\dfrac{\\text{op}}{\\text{ady}}$', viz: { type: 'triangle', from: 20, to: 70, show: 'tan' } }),
          ] },
          ex: [
            play('arma-triangulo', 'Arma un triángulo rectángulo cuya razón valga lo pedido', {
              max: 12,
              rounds: [{ fn: 'sen', num: 4, den: 5 }, { fn: 'cos', num: 12, den: 13 }, { fn: 'tan', num: 5, den: 2 }],
            }, 'Con catetos $3$ (adyacente) y $4$ (opuesto) la hipotenusa es $5$: $\\operatorname{sen}\\theta = \\tfrac45$. Con $12$ y $5$ la hipotenusa es $13$: $\\cos\\theta = \\tfrac{12}{13}$. Y $\\tan\\theta = \\tfrac{\\text{op}}{\\text{ady}} = \\tfrac52$ con opuesto $5$ y adyacente $2$ (o $10$ y $4$).',
              { hint: 'SOH CAH TOA: el seno usa opuesto e hipotenusa, el coseno adyacente e hipotenusa, la tangente opuesto y adyacente. Mueve los catetos hasta que, con Pitágoras, la hipotenusa salga entera y la fracción coincida.' }),
            play('une-parejas', 'Un triángulo rectángulo tiene lados 9, 40 y 41; θ está frente al lado 9. Une cada razón con su valor', {
              left: ['sen θ', 'cos θ', 'tan θ'],
              right: ['9/41', '40/41', '9/40', '41/9', '40/9'],
              pairs: [[0, 0], [1, 1], [2, 2]],
            }, 'El opuesto es $9$, el adyacente $40$ y la hipotenusa $41$: $\\operatorname{sen}\\theta = \\tfrac{9}{41}$, $\\cos\\theta = \\tfrac{40}{41}$ y $\\tan\\theta = \\tfrac{9}{40}$. Las fichas $\\tfrac{41}{9}$ y $\\tfrac{40}{9}$ están dadas vuelta.',
              { hint: 'La hipotenusa es el lado más largo (41). El lado frente a θ es el opuesto; el otro cateto es el adyacente. Seno y coseno siempre tienen la hipotenusa abajo.' }),
            num('Un triángulo rectángulo tiene catetos 6 y 8. ¿Cuánto mide la hipotenusa?', 10, 'Pitágoras: $\\sqrt{36 + 64} = \\sqrt{100} = 10$.',
              { hint: 'Eleva cada cateto al cuadrado, súmalos y saca la raíz cuadrada del resultado.' }),
          ],
        },
        {
          id: 'trig-2', title: 'Ángulos notables',
          // Clase T4 (video/clase_trig_t4): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'Hay ángulos que aparecen en todas partes: 30°, 45° y 60°. Salen del triángulo equilátero y del cuadrado.', { viz: { type: 'triangle', from: 30, to: 60 } }),
            sc(5, 'Truco: el seno sube como $\\sqrt{1}, \\sqrt{2}, \\sqrt{3}$ sobre 2.', { steps: ['$\\sen 30^\\circ = \\tfrac{1}{2}$', '$\\sen 45^\\circ = \\tfrac{\\sqrt{2}}{2}$', '$\\sen 60^\\circ = \\tfrac{\\sqrt{3}}{2}$'] }),
            sc(5, 'El coseno va al revés:', { steps: ['$\\cos 30^\\circ = \\tfrac{\\sqrt{3}}{2}$', '$\\cos 45^\\circ = \\tfrac{\\sqrt{2}}{2}$', '$\\cos 60^\\circ = \\tfrac{1}{2}$'] }),
            sc(4, 'Con esto calculas alturas y distancias sin calculadora.', { title: '$h = 10 \\tan 45^\\circ = 10$', viz: { type: 'triangle', from: 45, labels: { adj: '10 m', op: 'h' } } }),
          ] },
          ex: [
            play('atrapa-punto', 'Atrapa en la circunferencia unitaria el punto que cumple cada pista', {
              rounds: [
                { prompt: 'sen θ = √3/2, con θ agudo', angles: [60] },
                { prompt: 'cos θ = √2/2, con θ agudo', angles: [45] },
                { prompt: 'tan θ = √3/3, con θ agudo', angles: [30] },
                { prompt: 'cos θ = 0 y sen θ = 1', angles: [90] },
              ],
            }, 'En la circunferencia unitaria el punto es $(\\cos\\theta, \\operatorname{sen}\\theta)$: $\\operatorname{sen} 60^\\circ = \\tfrac{\\sqrt3}{2}$, $\\cos 45^\\circ = \\tfrac{\\sqrt2}{2}$, $\\tan 30^\\circ = \\tfrac{1}{\\sqrt3} = \\tfrac{\\sqrt3}{3}$ y en $90^\\circ$ el punto es $(0, 1)$.',
              { hint: 'Usa el truco de la tabla: el seno de 0°, 30°, 45°, 60° y 90° es √0/2, √1/2, √2/2, √3/2 y √4/2. El coseno es la misma fila al revés. La tangente es seno entre coseno.' }),
            play('une-parejas', 'Une cada razón de un ángulo notable con su valor exacto', {
              left: ['sen 30°', 'cos 30°', 'tan 60°', 'cos 45°', 'tan 45°'],
              right: ['1/2', '√3/2', '√3', '√2/2', '1', '√3/3', '2'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, 'Del triángulo $1, \\sqrt3, 2$: $\\operatorname{sen} 30^\\circ = \\tfrac12$, $\\cos 30^\\circ = \\tfrac{\\sqrt3}{2}$, $\\tan 60^\\circ = \\sqrt3$. Del cuadrado: $\\cos 45^\\circ = \\tfrac{\\sqrt2}{2}$ y $\\tan 45^\\circ = 1$. Sobran $\\tfrac{\\sqrt3}{3}$ (que es $\\tan 30^\\circ$) y $2$.',
              { hint: 'Dibuja el equilátero partido (lados 1, √3 y 2) y el cuadrado partido (lados 1, 1 y √2) y lee cada razón como opuesto, adyacente e hipotenusa.' }),
            num('Una escalera de 10 m se apoya en una pared formando $60^\\circ$ con el suelo. ¿A qué altura toca la pared? (en metros, con dos decimales)', 5 * Math.sqrt(3), '$h = 10 \\operatorname{sen} 60^\\circ = 10 \\cdot \\tfrac{\\sqrt3}{2} = 5\\sqrt3 \\approx 8.66$ m.',
              { tol: 0.02, suffix: 'm', answerText: '$5\\sqrt3 \\approx 8.66$ m', hint: 'La escalera es la hipotenusa y la altura es el lado opuesto al ángulo de 60°. ¿Qué razón une opuesto e hipotenusa?' }),
          ],
        },
        {
          id: 'trig-42c', title: 'Las seis razones y la medición indirecta',
          // Clase T5 (video/clase_trig_t5): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'Además de seno, coseno y tangente, están sus **recíprocas**:', { steps: ['$\\csc\\theta = \\dfrac{1}{\\sen\\theta}$', '$\\sec\\theta = \\dfrac{1}{\\cos\\theta}$', '$\\cot\\theta = \\dfrac{1}{\\tan\\theta}$'] }),
            sc(5, 'Ángulo de **elevación**: se mide hacia arriba desde la horizontal. Con él calculas alturas sin subirte al edificio.', { title: '$h = d \\tan\\theta$', viz: { type: 'triangle', from: 25, to: 52, labels: { adj: '40 m', op: 'h' }, show: 'tan' } }),
            sc(5, 'Ejemplo: a 40 m del edificio, el ángulo de elevación es $52^\\circ$.', { steps: ['$h = 40 \\tan 52^\\circ$', '$h \\approx 40 \\cdot 1.28 \\approx 51.2$ m'] }),
          ] },
          ex: [
            play('arma-triangulo', 'Arma triángulos con las razones recíprocas', {
              max: 12,
              rounds: [{ fn: 'csc', num: 5, den: 3 }, { fn: 'sec', num: 13, den: 12 }, { fn: 'cot', num: 3, den: 4 }],
            }, 'La cosecante es hipotenusa sobre opuesto: con catetos $4$ y $3$ (opuesto), $\\csc\\theta = \\tfrac53$. La secante es hipotenusa sobre adyacente: con adyacente $12$ y opuesto $5$, $\\sec\\theta = \\tfrac{13}{12}$. La cotangente es adyacente sobre opuesto: $\\cot\\theta = \\tfrac34$.',
              { hint: 'Da vuelta la fracción: csc es el seno al revés (hip/op), sec es el coseno al revés (hip/ady) y cot es la tangente al revés (ady/op).' }),
            play('mide-altura', 'Muévete hasta ver cada cima con el ángulo pedido', {
              rounds: [
                { kind: 'edificio', h: 30, angle: 45, maxD: 60 },
                { kind: 'arbol', h: 12, angle: 60, maxD: 30 },
                { kind: 'faro', h: 40, angle: 25, mode: 'dep', maxD: 120 },
              ],
            }, 'La tangente une la altura (opuesto) con la distancia (adyacente): $d = \\tfrac{h}{\\tan\\theta}$. Edificio: $\\tfrac{30}{\\tan 45^\\circ} = 30$ m; árbol: $\\tfrac{12}{\\tan 60^\\circ} \\approx 6.93$ m; barco: $\\tfrac{40}{\\tan 25^\\circ} \\approx 85.8$ m. El ángulo de depresión desde arriba es igual al de elevación desde abajo.',
              { hint: 'Si te alejas, el ángulo se hace más pequeño; si te acercas, más grande. Puedes calcularlo antes: distancia = altura / tan(ángulo).' }),
            play('une-parejas', 'Une cada razón con su recíproca', {
              left: ['sen θ = 2/7', 'cos θ = 3/5', 'tan θ = 4'],
              right: ['csc θ = 7/2', 'sec θ = 5/3', 'cot θ = 1/4', 'csc θ = 2/7', 'sec θ = 3/5'],
              pairs: [[0, 0], [1, 1], [2, 2]],
            }, 'Cada recíproca da vuelta la fracción: $\\csc\\theta = \\tfrac72$, $\\sec\\theta = \\tfrac53$ y $\\cot\\theta = \\tfrac14$ (porque $4 = \\tfrac41$).',
              { hint: 'Sen va con csc, cos con sec y tan con cot. La recíproca es la misma fracción con numerador y denominador intercambiados.' }),
            num('Un avión vuela a 2000 m de altura y ve una luz del aeropuerto con un ángulo de depresión de $30^\\circ$. ¿Qué distancia hay en línea recta del avión a la luz? (en metros)', 4000, 'La altura es el opuesto y la distancia buscada la hipotenusa: $d = \\tfrac{2000}{\\operatorname{sen} 30^\\circ} = \\tfrac{2000}{1/2} = 4000$ m.',
              { suffix: 'm', hint: 'Dibuja el triángulo: la altura del avión es el cateto opuesto al ángulo y la línea recta a la luz es la hipotenusa. ¿Qué razón une el opuesto con la hipotenusa?' }),
          ],
        },
        {
          id: 'trig-3', title: 'La circunferencia unitaria',
          // Clase T6 (video/clase_trig_t6): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(4, 'Una circunferencia de radio 1 centrada en el origen.', { viz: { type: 'circle', from: 0, to: 30 } }),
            sc(6, 'Gira un ángulo $t$: el punto terminal tiene coordenadas $(\\cos t, \\sen t)$.', { title: '$P(t) = (\\cos t, \\sen t)$', viz: { type: 'circle', from: 30, to: 360 } }),
            sc(5, 'Así el seno y el coseno funcionan para **cualquier** número real, no solo ángulos agudos.', { viz: { type: 'circle', from: 90, to: 270 } }),
            sc(4, 'Después de una vuelta completa, todo se repite: son funciones **periódicas**.', { steps: ['$\\sen(t + 2\\pi) = \\sen t$', '$\\cos(t + 2\\pi) = \\cos t$'] }),
          ] },
          ex: [
            play('atrapa-punto', 'Atrapa el punto de la circunferencia unitaria', {
              rounds: [
                { prompt: '(−1/2, √3/2)', angles: [120] },
                { prompt: '(0, −1)', angles: [270] },
                { prompt: 't = 7π/6', angles: [210] },
                { prompt: '(√2/2, −√2/2)', angles: [315] },
              ],
            }, 'El punto es $(\\cos t, \\operatorname{sen} t)$: $\\left(-\\tfrac12, \\tfrac{\\sqrt3}{2}\\right)$ está en $120^\\circ$ (referencia $60^\\circ$, cuadrante II), $(0, -1)$ abajo en $270^\\circ$, $\\tfrac{7\\pi}{6} = 210^\\circ$ y $\\left(\\tfrac{\\sqrt2}{2}, -\\tfrac{\\sqrt2}{2}\\right)$ en $315^\\circ$.',
              { hint: 'La primera coordenada es el coseno (izquierda o derecha) y la segunda el seno (arriba o abajo). Los signos te dicen el cuadrante; el valor, el ángulo de referencia.' }),
            play('une-parejas', 'Une cada ángulo con su punto en la circunferencia unitaria', {
              left: ['0', 'π/2', 'π', '5π/4'],
              right: ['(1, 0)', '(0, 1)', '(−1, 0)', '(−√2/2, −√2/2)', '(0, −1)', '(√2/2, √2/2)'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'En $0$ el punto está a la derecha, en $\\tfrac{\\pi}{2}$ arriba y en $\\pi$ a la izquierda. $\\tfrac{5\\pi}{4} = 225^\\circ$ está en el cuadrante III, con las dos coordenadas negativas.',
              { hint: 'Ubica cada ángulo girando desde el eje x positivo: π/2 es un cuarto de vuelta y π es media vuelta. 5π/4 es media vuelta más 45°.' }),
            num('El lado terminal de un ángulo $t$ pasa por el punto $(5, -12)$. ¿Cuánto vale $\\operatorname{sen} t$? (en decimal)', -12 / 13, '$r = \\sqrt{25 + 144} = 13$ y $\\operatorname{sen} t = \\tfrac{y}{r} = -\\tfrac{12}{13} \\approx -0.923$.',
              { tol: 0.005, answerText: '$-\\tfrac{12}{13} \\approx -0.923$', hint: 'Primero halla r, la distancia del punto al origen, con Pitágoras. El seno es y sobre r, con el signo de y.' }),
          ],
        },
        {
          id: 'trig-43b', title: 'Signos y ángulo de referencia',
          // Clase T7 (video/clase_trig_t7): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'El signo depende del cuadrante. Regla: **I** todas, **II** seno, **III** tangente, **IV** coseno.', { viz: { type: 'circle', from: 45, to: 315 } }),
            sc(5, 'El **ángulo de referencia** es el ángulo agudo con el eje $x$. Da el valor; el cuadrante da el signo.', { steps: ['$225^\\circ$: referencia $45^\\circ$, cuadrante III', '$\\sen 225^\\circ = -\\tfrac{\\sqrt2}{2}$'] }),
            sc(5, '**Paridad**: el coseno es par y el seno es impar.', { steps: ['$\\cos(-t) = \\cos t$', '$\\sen(-t) = -\\sen t$', '$\\tan(-t) = -\\tan t$'] }),
          ] },
          ex: [
            play('noria', 'Gira la noria hasta un ángulo que cumpla cada condición', {
              rounds: [
                { prompt: 'sen θ < 0 y tan θ > 0', sen: '-', tan: '+' },
                { prompt: 'Referencia 75°, en el cuadrante II', ref: 75, sen: '+', cos: '-' },
                { prompt: 'El mismo coseno que 60°, pero con seno negativo', ref: 60, cos: '+', sen: '-' },
                { prompt: 'cos θ < 0 y tan θ < 0', cos: '-', tan: '-' },
              ],
            }, 'Seno negativo y tangente positiva: cuadrante III (por ejemplo $210^\\circ$). Referencia $75^\\circ$ en el II: $180^\\circ - 75^\\circ = 105^\\circ$. Mismo coseno que $60^\\circ$ con seno negativo: $360^\\circ - 60^\\circ = 300^\\circ$. Coseno y tangente negativos: cuadrante II.',
              { hint: 'Recuerda: I todas positivas, II solo el seno, III solo la tangente, IV solo el coseno. El ángulo de referencia es la distancia al eje x más cercano.' }),
            play('atrapa-punto', 'Atrapa el punto que cumple el valor y el signo', {
              rounds: [
                { prompt: 'sen θ = −√2/2 y cos θ < 0', angles: [225] },
                { prompt: 'cos θ = √3/2 y sen θ < 0', angles: [330] },
                { prompt: 'tan θ = −1 en el cuadrante II', angles: [135] },
              ],
            }, 'El valor da el ángulo de referencia y el signo, el cuadrante: $225^\\circ$ (referencia $45^\\circ$, III), $330^\\circ$ (referencia $30^\\circ$, IV) y $135^\\circ$ (referencia $45^\\circ$, II).',
              { hint: 'Primero busca el ángulo agudo que da ese valor (sin el signo). Luego decide el cuadrante con los signos y refleja el ángulo allí.' }),
            play('une-parejas', 'Une cada ángulo con su ángulo de referencia', {
              left: ['200°', '135°', '300°', '165°'],
              right: ['20°', '45°', '60°', '15°', '30°', '75°'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, '$200^\\circ - 180^\\circ = 20^\\circ$, $180^\\circ - 135^\\circ = 45^\\circ$, $360^\\circ - 300^\\circ = 60^\\circ$ y $180^\\circ - 165^\\circ = 15^\\circ$.',
              { hint: 'Mide cuánto le falta o le sobra al ángulo para llegar al eje x más cercano: 180° o 360°.' }),
            num('Ángulo de referencia de $\\tfrac{7\\pi}{4}$, en grados', 45, '$\\tfrac{7\\pi}{4} = 315^\\circ$, en el cuadrante IV: $360^\\circ - 315^\\circ = 45^\\circ$.',
              { suffix: '°', hint: 'Pasa a grados (π son 180°), mira en qué cuadrante queda y mide la distancia al eje x más cercano.' }),
          ],
        },
        {
          id: 'trig-44a', title: 'Seno y coseno: amplitud',
          // Clase T8 (video/clase_trig_t8): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'Al "desenrollar" la circunferencia, la altura del punto dibuja la onda **seno**.', { title: '$y = \\sen x$', viz: { type: 'graph', xr: [0, 7], yr: [-3.5, 3.5], f: Math.sin, draw: true, ax: ['x', 'y'] } }),
            sc(5, 'La **amplitud** $|a|$ estira la onda verticalmente.', { title: '$y = a \\sen x$', viz: { type: 'graph', xr: [0, 7], yr: [-3.5, 3.5], f: (x, a) => a * Math.sin(x), anim: [1, 3], label: a => `a = ${fmt(a, 1)}` } }),
            sc(5, '$d$ desplaza la onda hacia arriba o abajo. El rango es $[d - |a|,\\, d + |a|]$.', { title: '$y = a \\sen x + d$', viz: { type: 'graph', xr: [0, 7], yr: [-3.5, 4.5], f: (x, d) => Math.sin(x) + d, anim: [0, 2], label: d => `d = ${fmt(d, 1)}` } }),
          ] },
          ex: [
            play('sintoniza-onda', 'Sintoniza tu onda con la onda fantasma', {
              rounds: [
                { fn: 'sen', target: { a: 2, b: 1, cq: 0, d: 0 }, knobs: ['a'] },
                { fn: 'cos', target: { a: -1.5, b: 1, cq: 0, d: 0 }, knobs: ['a'] },
                { fn: 'sen', target: { a: 1.5, b: 1, cq: 0, d: -1 }, knobs: ['a', 'd'] },
                { fn: 'cos', target: { a: 2, b: 1, cq: 0, d: 1 }, knobs: ['a', 'd'] },
              ],
            }, 'La amplitud $|a|$ es la distancia de la línea media a la cresta; si la onda empieza al revés, $a$ es negativo. $d$ es la altura de la línea media: $y = 2\\operatorname{sen} x$, $y = -1.5\\cos x$, $y = 1.5\\operatorname{sen} x - 1$ y $y = 2\\cos x + 1$.',
              { hint: 'Mira primero la línea media de la onda fantasma: esa altura es d. Luego mide desde ahí hasta la cresta: es la amplitud. Si la onda fantasma va al revés que la tuya, cambia el signo de a.' }),
            play('une-parejas', 'Une cada función con su rango', {
              left: ['y = 3 cos x', 'y = sen x + 2', 'y = −2 sen x − 1', 'y = 0.5 cos x + 1'],
              right: ['[−3, 3]', '[1, 3]', '[−3, 1]', '[0.5, 1.5]', '[−1, 3]', '[2, 3]'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'El rango es $[d - |a|,\\, d + |a|]$: $[-3, 3]$, $[2 - 1, 2 + 1] = [1, 3]$, $[-1 - 2, -1 + 2] = [-3, 1]$ y $[1 - 0.5, 1 + 0.5] = [0.5, 1.5]$.',
              { hint: 'Encuentra la línea media (el número que se suma, d) y la amplitud (el número que multiplica, sin signo). El rango va de d menos la amplitud a d más la amplitud.' }),
            num('Amplitud de $y = -4\\cos x$', 4, 'La amplitud es $|a| = |-4| = 4$: el signo solo voltea la onda.',
              { hint: 'La amplitud es el número que multiplica al coseno, pero siempre positivo: el signo menos solo voltea la onda.' }),
          ],
        },
        {
          id: 'trig-44b', title: 'Periodo, desfase y tangente',
          // Clase T9 (video/clase_trig_t9): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, '$b$ comprime la onda: el **periodo** pasa a ser $\\tfrac{2\\pi}{b}$.', { title: '$y = \\sen(bx)$', viz: { type: 'graph', xr: [0, 7], yr: [-2, 2], f: (x, b) => Math.sin(b * x), anim: [1, 3], label: b => `b = ${fmt(b, 1)}  ·  periodo = ${fmt(2 * PI / b, 2)}` } }),
            sc(5, 'El **desfase** $\\tfrac{c}{b}$ corre la onda a la derecha.', { title: '$y = a \\sen(bx - c) + d$', viz: { type: 'graph', xr: [0, 7], yr: [-2, 2], f: (x, c) => Math.sin(x - c), anim: [0, 1.5], label: c => `desfase = ${fmt(c, 2)}` } }),
            sc(5, 'La tangente tiene periodo $\\pi$ y **asíntotas verticales** donde el coseno vale cero.', { title: '$x = \\tfrac{\\pi}{2} + k\\pi$', viz: { type: 'graph', xr: [-0.5, 7], yr: [-4, 4], f: Math.tan, draw: true } }),
          ] },
          ex: [
            play('sintoniza-onda', 'Sintoniza la frecuencia y el desfase de tu onda', {
              rounds: [
                { fn: 'sen', target: { a: 1, b: 3, cq: 0, d: 0 }, knobs: ['b'] },
                { fn: 'sen', target: { a: 1, b: 1, cq: 1, d: 0 }, knobs: ['c'] },
                { fn: 'cos', target: { a: 1, b: 2, cq: 2, d: 0 }, knobs: ['b', 'c'] },
                { fn: 'sen', target: { a: 2, b: 0.5, cq: 0, d: 1 }, knobs: ['a', 'b', 'd'] },
              ],
            }, 'Cuenta ondas completas en $[0, 2\\pi]$: $b$ ondas. El desfase es $\\tfrac{c}{b}$: $\\operatorname{sen}\\left(x - \\tfrac{\\pi}{4}\\right)$ se corre $\\tfrac{\\pi}{4}$; $\\cos\\left(2x - \\tfrac{\\pi}{2}\\right)$ se corre $\\tfrac{\\pi}{4}$ con periodo $\\pi$; y $y = 2\\operatorname{sen}\\tfrac{x}{2} + 1$ tiene periodo $4\\pi$.',
              { hint: 'b es cuántas ondas completas caben entre 0 y 2π (el periodo es 2π/b). Para el desfase, mira cuánto se corrió la onda fantasma a la derecha y multiplícalo por b para obtener c.' }),
            play('une-parejas', 'Une cada función con su periodo', {
              left: ['sen 4x', 'cos(x/3)', 'tan x', 'sen(πx)'],
              right: ['π/2', '6π', 'π', '2', '4π', '2π'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'Para seno y coseno el periodo es $\\tfrac{2\\pi}{b}$: $\\tfrac{2\\pi}{4} = \\tfrac{\\pi}{2}$, $\\tfrac{2\\pi}{1/3} = 6\\pi$ y $\\tfrac{2\\pi}{\\pi} = 2$. La tangente se repite cada $\\pi$.',
              { hint: 'Divide 2π entre el número que multiplica a x. Ojo: dividir entre 1/3 es multiplicar por 3, y la tangente tiene periodo π, no 2π.' }),
            num('Periodo de $y = 5\\operatorname{sen}\\left(\\tfrac{\\pi}{2}x\\right)$', 4, '$\\tfrac{2\\pi}{\\pi/2} = 4$: la amplitud 5 no cambia el periodo.',
              { hint: 'El periodo solo depende del número que multiplica a x: una vuelta completa, 2π, dividida entre ese número.' }),
          ],
        },
      ],
    },
    {
      title: 'Funciones trigonométricas inversas y aplicaciones',
      lessons: [
        {
          id: 'trig-45', title: 'Seno, coseno y tangente inversos',
          // Clase T10 (video/clase_trig_t10): escenas de respaldo hasta enlazar el video de Bunny (bunny + duration).
          clip: { scenes: [
            sc(5, 'El seno no es inyectivo: muchos ángulos dan el mismo valor. Para invertirlo, **restringimos** el dominio a $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$.', { viz: { type: 'graph', xr: [-4, 4], yr: [-2, 2], fs: [{ f: Math.sin, color: 'rgba(255,255,255,.3)' }, { f: x => (Math.abs(x) <= PI / 2 ? Math.sin(x) : NaN) }] } }),
            sc(5, '$\\sen^{-1} x$ responde: ¿qué ángulo de ese intervalo tiene seno $x$?', { title: '$y = \\sen^{-1}x \\iff \\sen y = x$', viz: { type: 'graph', xr: [-1.5, 1.5], yr: [-2, 2], f: Math.asin, draw: true } }),
            sc(5, 'Cada inversa tiene su rango:', { steps: ['$\\sen^{-1}: \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$', '$\\cos^{-1}: [0, \\pi]$', '$\\tan^{-1}: \\left(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right)$'] }),
          ] },
          ex: [
            play('canon-inverso', 'Dos globos tienen el mismo valor, pero solo uno está en el rango de la inversa. Apunta el cañón al del valor principal', {
              rounds: [
                { fn: 'asin', x: -Math.SQRT1_2, label: '−√2/2' },
                { fn: 'acos', x: -Math.sqrt(3) / 2, label: '−√3/2' },
                { fn: 'atan', x: -Math.sqrt(3), label: '−√3' },
                { fn: 'atan', x: 1, label: '1', guide: false },
              ],
            }, '$\\sen^{-1}\\left(-\\tfrac{\\sqrt2}{2}\\right) = -45^\\circ$ (no $225^\\circ$: el rango del seno inverso es $[-90^\\circ, 90^\\circ]$); $\\cos^{-1}\\left(-\\tfrac{\\sqrt3}{2}\\right) = 150^\\circ$, en $[0^\\circ, 180^\\circ]$; $\\tan^{-1}(-\\sqrt3) = -60^\\circ$ y $\\tan^{-1} 1 = 45^\\circ$.',
              { hint: 'Primero busca el ángulo agudo que da ese valor sin signo. Luego ubícalo dentro del rango: para seno y tangente inversos, negativo significa por debajo del eje x; para coseno inverso, negativo significa pasar al lado izquierdo.' }),
            play('canon-inverso', 'Ahora sin ángulos notables: apunta con precisión de 1°', {
              rounds: [
                { fn: 'atan', x: 5 / 12, label: '5/12', snap: 1 },
                { fn: 'acos', x: 0.8, label: '0.8', snap: 1 },
                { fn: 'asin', x: -0.6, label: '−0.6', snap: 1 },
              ],
            }, '$\\tan^{-1}\\tfrac{5}{12} \\approx 22.6^\\circ$, $\\cos^{-1} 0.8 \\approx 36.9^\\circ$ y $\\sen^{-1}(-0.6) \\approx -36.9^\\circ$: el seno negativo apunta hacia abajo, dentro de $[-90^\\circ, 90^\\circ]$.',
              { hint: 'Fíjate en la lectura de abajo: mientras giras, el juego muestra el valor de la función en tu ángulo. Acércalo al número pedido y afina con − y +.' }),
            play('une-parejas', 'Une cada inversa con su valor principal', {
              left: ['sen⁻¹(1/2)', 'cos⁻¹(0)', 'tan⁻¹(−1)', 'cos⁻¹(−1)'],
              right: ['π/6', 'π/2', '−π/4', 'π', '5π/6', '3π/4'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, '$\\sen^{-1}\\tfrac12 = \\tfrac{\\pi}{6}$ (no $\\tfrac{5\\pi}{6}$), $\\cos^{-1} 0 = \\tfrac{\\pi}{2}$, $\\tan^{-1}(-1) = -\\tfrac{\\pi}{4}$ (no $\\tfrac{3\\pi}{4}$) y $\\cos^{-1}(-1) = \\pi$.',
              { hint: 'Cada inversa devuelve un solo ángulo, el de su rango: seno y tangente inversos entre −π/2 y π/2; coseno inverso entre 0 y π.' }),
            num('Calcula $\\cos^{-1}\\left(\\cos \\tfrac{7\\pi}{6}\\right)$, en grados', 150, '$\\cos\\tfrac{7\\pi}{6} = \\cos 210^\\circ = -\\tfrac{\\sqrt3}{2}$, y el ángulo de $[0^\\circ, 180^\\circ]$ con ese coseno es $150^\\circ$. No se cancela porque $210^\\circ$ está fuera del rango.',
              { suffix: '°', hint: 'Calcula primero el coseno de adentro. Después busca el ángulo entre 0° y 180° que tenga ese mismo coseno: no siempre es el ángulo con el que empezaste.' }),
            num('Una escalera de 6 m alcanza 5 m de altura en un muro. Ángulo con el piso, en grados', Math.asin(5 / 6) * 180 / PI, '$\\operatorname{sen}\\theta = \\tfrac56$, así que $\\theta = \\operatorname{sen}^{-1}\\tfrac56 \\approx 56.4^\\circ$.',
              { tol: 0.3, suffix: '°', answerText: '$\\approx 56.4^\\circ$', hint: 'Dibuja el triángulo: la escalera es la hipotenusa y la altura es el lado opuesto al ángulo con el piso. ¿Qué razón usa esos dos lados? Despeja el ángulo con su inversa.' }),
          ],
        },
        {
          id: 'trig-4', title: 'Identidades fundamentales',
          // Clase T11 (video/clase_trig_t11).
          clip: { scenes: [
            sc(5, 'En la circunferencia unitaria, coseno y seno forman un triángulo con hipotenusa 1.', { viz: { type: 'circle', from: 20, to: 70 } }),
            sc(5, 'Por Pitágoras, siempre se cumple:', { title: '$\\sen^2\\theta + \\cos^2\\theta = 1$', viz: { type: 'circle', from: 70, to: 160 } }),
            sc(6, 'Dividiendo entre $\\cos^2\\theta$ o entre $\\sen^2\\theta$ salen las otras dos:', { steps: ['$1 + \\tan^2\\theta = \\sec^2\\theta$', '$1 + \\cot^2\\theta = \\csc^2\\theta$'] }),
            sc(5, '**Cofunciones**: el seno de un ángulo es el coseno de su complemento.', { steps: ['$\\sen\\left(\\tfrac{\\pi}{2} - x\\right) = \\cos x$', '$\\tan\\left(\\tfrac{\\pi}{2} - x\\right) = \\cot x$'] }),
          ] },
          ex: [
            play('tanque-pitagorico', 'Llena el tanque justo hasta la marca y elige el signo según el cuadrante', {
              rounds: [
                { id: 'sc', given: 'sen', value: 0.6, ask: 'cos', q: 2 },
                { id: 'sc', given: 'cos', value: 0.28, ask: 'sen', q: 4 },
                { id: 'ts', given: 'tan', value: 0.75, ask: 'sec', q: 3 },
                { id: 'ts', given: 'sec', value: -1.25, ask: 'tan', q: 2 },
              ],
            }, '$\\cos\\theta = -\\sqrt{1 - 0.36} = -0.8$ (II); $\\operatorname{sen}\\theta = -\\sqrt{1 - 0.0784} = -0.96$ (IV); $\\sec\\theta = -\\sqrt{1 + 0.5625} = -1.25$ (III, como el coseno); $\\tan\\theta = -\\sqrt{1.5625 - 1} = -0.75$ (II).',
              { hint: 'El tanque llena cuando los cuadrados suman lo que pide la identidad: resta para hallar el cuadrado que falta y saca raíz. El signo lo decide el cuadrante: I todas positivas, II solo el seno, III solo la tangente, IV solo el coseno (la secante lleva el signo del coseno).' }),
            play('une-parejas', 'Une cada expresión con su cofunción', {
              left: ['sen(90° − x)', 'tan(90° − x)', 'sec(90° − x)', 'cos(π/2 − x)'],
              right: ['cos x', 'cot x', 'csc x', 'sen x', 'tan x', 'sec x'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'En un triángulo rectángulo, lo que es opuesto para un ángulo agudo es adyacente para el otro: cada razón del complemento es su «co-razón». $\\operatorname{sen} \\leftrightarrow \\cos$, $\\tan \\leftrightarrow \\cot$, $\\sec \\leftrightarrow \\csc$.',
              { hint: 'Al cambiar un ángulo por su complemento, el lado opuesto y el adyacente se intercambian. Cada razón pasa a su pareja con «co»: seno con coseno, tangente con cotangente, secante con cosecante.' }),
            num('Si $\\tan\\theta = 2$ y $\\theta$ está en el cuadrante III, ¿cuánto vale $\\sec\\theta$?', -Math.sqrt(5), '$\\sec^2\\theta = 1 + \\tan^2\\theta = 5$, y en el III el coseno (y la secante) es negativo: $\\sec\\theta = -\\sqrt5 \\approx -2.24$.',
              { tol: 0.01, answerText: '$-\\sqrt5 \\approx -2.24$', hint: 'Usa la identidad que une la tangente con la secante y despeja el cuadrado. Para el signo, piensa en el signo del coseno en ese cuadrante.' }),
          ],
        },
        {
          id: 'trig-47b', title: 'Simplificar y demostrar',
          // Clase T12 (video/clase_trig_t12).
          clip: { scenes: [
            sc(5, 'Una **identidad** es cierta para todo $x$ del dominio; una **ecuación** solo para algunos valores.', { steps: ['$\\sen^2x + \\cos^2x = 1$: identidad', '$\\sen x = \\tfrac12$: ecuación'] }),
            sc(6, 'Estrategia: trabaja con el lado más complejo y escribe todo en senos y cosenos.', { steps: ['$\\tan x + \\cot x = \\dfrac{\\sen x}{\\cos x} + \\dfrac{\\cos x}{\\sen x}$', '$= \\dfrac{\\sen^2 x + \\cos^2 x}{\\sen x \\cos x}$', '$= \\dfrac{1}{\\sen x \\cos x} = \\sec x \\csc x$'] }),
            sc(5, 'Para refutar una falsa identidad basta **un contraejemplo**.', { steps: ['¿$\\sen(x + y) = \\sen x + \\sen y$?', '$x = y = \\tfrac{\\pi}{2}$: $\\sen \\pi = 0 \\neq 2$'] }),
          ] },
          ex: [
            play('detector-identidades', 'Detective de identidades: si las gráficas se separan, marca un contraejemplo; si no, sella «Es identidad»', {
              rounds: [
                { lhs: 'sen 2x', rhs: '2 sen x', f: x => Math.sin(2 * x), g: x => 2 * Math.sin(x), identity: false },
                { lhs: 'tan x · cos x', rhs: 'sen x', f: x => Math.tan(x) * Math.cos(x), g: x => Math.sin(x), identity: true },
                { lhs: '(sen x + cos x)²', rhs: '1', f: x => (Math.sin(x) + Math.cos(x)) ** 2, g: () => 1, identity: false },
                { lhs: 'sec²x − tan²x', rhs: '1', f: x => 1 / Math.cos(x) ** 2 - Math.tan(x) ** 2, g: () => 1, identity: true },
              ],
            }, '$\\operatorname{sen} 2x \\ne 2\\operatorname{sen} x$ (en $x = \\tfrac{\\pi}{2}$: $0 \\ne 2$). $\\tan x \\cos x = \\tfrac{\\operatorname{sen} x}{\\cos x}\\cos x = \\operatorname{sen} x$: identidad. $(\\operatorname{sen} x + \\cos x)^2 = 1 + 2\\operatorname{sen} x\\cos x$, que no es 1 en $x = \\tfrac{\\pi}{4}$. $\\sec^2 x - \\tan^2 x = 1$ sale de $1 + \\tan^2 x = \\sec^2 x$.',
              { hint: 'Mueve la lupa y mira los dos valores de abajo. Si en algún x son distintos, ese x ya es un contraejemplo. Si coinciden en todas partes (salvo donde no existen), escribe ambos lados en senos y cosenos para confirmarlo.' }),
            play('ordena-terminos', 'Ordena la demostración de $\\cos x\\,(\\sec x - \\cos x) = \\operatorname{sen}^2 x$', {
              tex: '\\cos x\\,(\\sec x - \\cos x)',
              chips: ['cos x · sec x − cos²x', '1 − cos²x', 'sen²x', '1 + cos²x', 'cos²x − 1'],
              order: [0, 1, 2], sep: '=',
            }, 'Se reparte: $\\cos x\\sec x - \\cos^2 x$. Como $\\cos x \\sec x = 1$, queda $1 - \\cos^2 x$, que por la identidad pitagórica es $\\operatorname{sen}^2 x$.',
              { hint: 'Primero reparte el cos x del paréntesis. Luego recuerda que la secante es el recíproco del coseno, así que su producto vale 1. Al final usa sen² + cos² = 1.' }),
            play('une-parejas', 'Une cada expresión con su forma más simple', {
              left: ['sen x · csc x', 'cos x · tan x', 'sec x · cot x', '(1 − sen²x) / cos x'],
              right: ['1', 'sen x', 'csc x', 'cos x', 'tan x', 'sec x'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, '$\\operatorname{sen} x \\cdot \\tfrac{1}{\\operatorname{sen} x} = 1$; $\\cos x \\cdot \\tfrac{\\operatorname{sen} x}{\\cos x} = \\operatorname{sen} x$; $\\tfrac{1}{\\cos x} \\cdot \\tfrac{\\cos x}{\\operatorname{sen} x} = \\csc x$; $\\tfrac{\\cos^2 x}{\\cos x} = \\cos x$.',
              { hint: 'Escribe todo en senos y cosenos (csc = 1/sen, sec = 1/cos, tan = sen/cos, cot = cos/sen) y cancela lo que se repite arriba y abajo.' }),
            num('Simplifica $(1 - \\cos^2 x)(1 + \\cot^2 x)$', 1, '$1 - \\cos^2 x = \\operatorname{sen}^2 x$ y $1 + \\cot^2 x = \\csc^2 x$: su producto es $\\operatorname{sen}^2 x \\cdot \\tfrac{1}{\\operatorname{sen}^2 x} = 1$.',
              { hint: 'Cada paréntesis es una identidad pitagórica disfrazada. Cámbialos por su forma corta y mira qué pasa al multiplicar.' }),
          ],
        },
        {
          id: 'trig-48a', title: 'Suma y resta de ángulos',
          // Clase T13 (video/clase_trig_t13).
          clip: { scenes: [
            sc(6, 'El seno y el coseno de una suma **no** se reparten: tienen su propia fórmula.', { steps: ['$\\sen(x \\pm y) = \\sen x \\cos y \\pm \\cos x \\sen y$', '$\\cos(x \\pm y) = \\cos x \\cos y \\mp \\sen x \\sen y$'] }),
            sc(6, 'Así obtienes valores exactos de ángulos "raros":', { steps: ['$\\cos 75^\\circ = \\cos(45^\\circ + 30^\\circ)$', '$= \\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2} - \\tfrac{\\sqrt2}{2}\\cdot\\tfrac12$', '$= \\dfrac{\\sqrt6 - \\sqrt2}{4}$'] }),
            sc(5, 'Y para la tangente:', { title: '$\\tan(x \\pm y) = \\dfrac{\\tan x \\pm \\tan y}{1 \\mp \\tan x \\tan y}$' }),
          ] },
          ex: [
            play('encadena-angulos', 'Encadena dos ángulos notables para llegar al ángulo «raro»', {
              rounds: [{ target: 165 }, { target: 195 }, { target: 285 }],
            }, 'Por ejemplo $165^\\circ = 120^\\circ + 45^\\circ$, $195^\\circ = 150^\\circ + 45^\\circ$ y $285^\\circ = 240^\\circ + 45^\\circ$ (también valen restas como $165^\\circ = 210^\\circ - 45^\\circ$).',
              { hint: 'Los notables son los múltiplos de 30° y de 45°. Busca uno cerca del ángulo pedido y mira cuánto falta o sobra: si esa diferencia también es notable, ya lo tienes.' }),
            play('une-parejas', 'Une cada valor con su forma exacta', {
              left: ['cos 165°', 'cos 105°', 'sen 15°', 'tan 15°'],
              right: ['−(√6 + √2)/4', '(√2 − √6)/4', '(√6 − √2)/4', '2 − √3', '(√6 + √2)/4', '2 + √3'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, '$\\cos(120^\\circ + 45^\\circ) = -\\tfrac12\\cdot\\tfrac{\\sqrt2}{2} - \\tfrac{\\sqrt3}{2}\\cdot\\tfrac{\\sqrt2}{2} = -\\tfrac{\\sqrt6 + \\sqrt2}{4}$; $\\cos(60^\\circ + 45^\\circ) = \\tfrac{\\sqrt2 - \\sqrt6}{4}$; $\\operatorname{sen}(45^\\circ - 30^\\circ) = \\tfrac{\\sqrt6 - \\sqrt2}{4}$; $\\tan(45^\\circ - 30^\\circ) = \\tfrac{1 - \\sqrt3/3}{1 + \\sqrt3/3} = 2 - \\sqrt3$.',
              { hint: 'Escribe cada ángulo como suma o resta de dos notables y aplica la fórmula. Antes de calcular, decide el signo: un coseno en el cuadrante II es negativo, y un seno o tangente de un ángulo agudo pequeño es positivo y pequeño.' }),
            num('Si $\\operatorname{sen}\\alpha = \\tfrac35$ ($\\alpha$ en I) y $\\cos\\beta = -\\tfrac{5}{13}$ ($\\beta$ en II), calcula $\\operatorname{sen}(\\alpha + \\beta)$', 33 / 65, '$\\cos\\alpha = \\tfrac45$, $\\operatorname{sen}\\beta = \\tfrac{12}{13}$: $\\tfrac35\\left(-\\tfrac{5}{13}\\right) + \\tfrac45 \\cdot \\tfrac{12}{13} = \\tfrac{33}{65}$.',
              { tol: 0.005, answerText: '$\\tfrac{33}{65} \\approx 0.508$', hint: 'Te faltan cos α y sen β: sácalos con sen² + cos² = 1 y el signo de cada cuadrante. Luego usa sen(α + β) = sen α cos β + cos α sen β.' }),
          ],
        },
        {
          id: 'trig-48b', title: 'Ángulo doble y ángulo medio',
          // Clase T14 (video/clase_trig_t14).
          clip: { scenes: [
            sc(5, 'Si en la fórmula de suma haces $y = x$, obtienes el **ángulo doble**:', { steps: ['$\\sen 2x = 2 \\sen x \\cos x$', '$\\cos 2x = \\cos^2 x - \\sen^2 x$', '$= 1 - 2\\sen^2 x = 2\\cos^2 x - 1$'] }),
            sc(5, 'Despejando, reduces potencias (muy útil en cálculo):', { steps: ['$\\sen^2 x = \\dfrac{1 - \\cos 2x}{2}$', '$\\cos^2 x = \\dfrac{1 + \\cos 2x}{2}$'] }),
            sc(5, '**Ángulo medio**: el signo depende del cuadrante de $\\tfrac{u}{2}$.', { title: '$\\sen\\dfrac{u}{2} = \\pm\\sqrt{\\dfrac{1 - \\cos u}{2}}$' }),
          ] },
          ex: [
            play('corredores-dobles', 'El corredor rosa va siempre al doble. Mantén «Correr» y frena justo cuando se cumpla cada condición', {
              rounds: [
                { prompt: 'El rápido llega a (0, −1) y el lento está en el cuadrante II', fast: 270, q: 2 },
                { prompt: 'cos 2θ = −1/2 con el lento en el cuadrante III', cos2: -0.5, q: 3 },
                { prompt: 'El rápido está en 60° y el lento tiene sen θ < 0', fast: 60, slowSen: '-' },
                { prompt: 'sen 2θ = 1 con cos θ < 0', sen2: 1, slowCos: '-' },
              ],
            }, '$2\\theta = 270^\\circ$ da $\\theta = 135^\\circ$ o $315^\\circ$: en el II, $135^\\circ$. $\\cos 2\\theta = -\\tfrac12$ con $\\theta$ en III: $\\theta = 240^\\circ$ ($2\\theta = 480^\\circ$, coterminal con $120^\\circ$). Ángulo medio de $60^\\circ$: $30^\\circ$ o $210^\\circ$; con seno negativo, $210^\\circ$. $\\operatorname{sen} 2\\theta = 1$: $2\\theta = 90^\\circ$ o $450^\\circ$, y con coseno negativo $\\theta = 225^\\circ$.',
              { hint: 'Piensa al revés: primero dónde debe estar el rápido (2θ), luego divide entre 2. Ojo, como el rápido da dos vueltas, hay dos lentos posibles separados por 180°: la condición sobre θ decide cuál.' }),
            play('detector-identidades', '¿Cuáles fórmulas de ángulo doble son de verdad?', {
              rounds: [
                { lhs: 'cos 2x', rhs: '1 − 2 sen²x', f: x => Math.cos(2 * x), g: x => 1 - 2 * Math.sin(x) ** 2, identity: true },
                { lhs: 'cos²x', rhs: '(1 − cos 2x) / 2', f: x => Math.cos(x) ** 2, g: x => (1 - Math.cos(2 * x)) / 2, identity: false },
                { lhs: 'sen 2x', rhs: '2 sen x cos x', f: x => Math.sin(2 * x), g: x => 2 * Math.sin(x) * Math.cos(x), identity: true },
                { lhs: 'cos 2x', rhs: '2 cos²x + 1', f: x => Math.cos(2 * x), g: x => 2 * Math.cos(x) ** 2 + 1, identity: false },
              ],
            }, '$\\cos 2x = 1 - 2\\operatorname{sen}^2 x$ y $\\operatorname{sen} 2x = 2\\operatorname{sen} x\\cos x$ son identidades. $\\cos^2 x = \\tfrac{1 + \\cos 2x}{2}$ (con más, no con menos) y $\\cos 2x = 2\\cos^2 x - 1$ (con menos).',
              { hint: 'Prueba con x = 0, donde cos x = 1 y sen x = 0: si los dos lados ya no coinciden ahí, tienes el contraejemplo. Si coinciden, mueve la lupa a otros valores antes de sellar.' }),
            num('Si $\\operatorname{sen} x = \\tfrac{5}{13}$ y $x$ está en el cuadrante II, calcula $\\operatorname{sen} 2x$', -120 / 169, '$\\cos x = -\\tfrac{12}{13}$ (II), así que $\\operatorname{sen} 2x = 2 \\cdot \\tfrac{5}{13} \\cdot \\left(-\\tfrac{12}{13}\\right) = -\\tfrac{120}{169} \\approx -0.710$.',
              { tol: 0.005, answerText: '$-\\tfrac{120}{169} \\approx -0.710$', hint: 'Necesitas el coseno: sácalo con la identidad pitagórica y el signo del cuadrante II. Luego multiplica 2 · sen x · cos x.' }),
          ],
        },
        {
          id: 'trig-49', title: 'Resolver ecuaciones trigonométricas',
          // Clase T15 (video/clase_trig_t15).
          clip: { scenes: [
            sc(5, 'Al resolver $\\sen x = \\tfrac12$ hay **dos** soluciones en cada vuelta.', { title: '$2\\sen x - 1 = 0$', viz: { type: 'graph', xr: [0, 6.6], yr: [-1.5, 1.5], fs: [{ f: Math.sin }, { f: () => 0.5, color: '#facc15', dash: true }], points: [[PI / 6, 0.5, 'π/6'], [5 * PI / 6, 0.5, '5π/6']] } }),
            sc(5, 'Solución general: suma vueltas completas.', { steps: ['$x = \\tfrac{\\pi}{6} + 2n\\pi$', '$x = \\tfrac{5\\pi}{6} + 2n\\pi$'] }),
            sc(6, 'Las de tipo cuadrático se factorizan como en álgebra:', { steps: ['$2\\cos^2 x + \\cos x - 1 = 0$', '$(2\\cos x - 1)(\\cos x + 1) = 0$', '$x = \\tfrac{\\pi}{3}, \\; \\pi, \\; \\tfrac{5\\pi}{3}$'] }),
            sc(5, 'Si elevas al cuadrado, verifica: pueden aparecer **soluciones extrañas**.', { steps: ['$\\sen x + \\cos x = 1$', 'Al elevar al cuadrado: $\\sen 2x = 0$', 'Verifica cada candidato en la original'] }),
          ] },
          ex: [
            play('pesca-raices', 'Los peces están donde la ola cruza o toca el agua. Atrápalos todos en $[0, 2\\pi)$ sin anzuelos de más', {
              rounds: [
                { label: '2 cos x = −1', g: x => 2 * Math.cos(x), k: -1, yr: 3 },
                { label: '2 sen²x − sen x − 1 = 0', g: x => 2 * Math.sin(x) ** 2 - Math.sin(x) - 1, k: 0, yr: 3 },
                { label: 'sen 2x − cos x = 0', g: x => Math.sin(2 * x) - Math.cos(x), k: 0, yr: 2.5 },
                { label: 'tan x = −1', g: Math.tan, k: -1, yr: 4 },
              ],
            }, '$\\cos x = -\\tfrac12$: $\\tfrac{2\\pi}{3}, \\tfrac{4\\pi}{3}$. $(2\\operatorname{sen} x + 1)(\\operatorname{sen} x - 1) = 0$: $\\tfrac{\\pi}{2}, \\tfrac{7\\pi}{6}, \\tfrac{11\\pi}{6}$. $\\cos x\\,(2\\operatorname{sen} x - 1) = 0$: $\\tfrac{\\pi}{6}, \\tfrac{\\pi}{2}, \\tfrac{5\\pi}{6}, \\tfrac{3\\pi}{2}$. $\\tan x = -1$: $\\tfrac{3\\pi}{4}, \\tfrac{7\\pi}{4}$.',
              { hint: 'Despeja la función (o factoriza como en álgebra) hasta llegar a «sen x = número», «cos x = número»… Cada una suele dar dos ángulos por vuelta; revisa también los puntos donde la ola apenas toca el agua.' }),
            play('atrapa-punto', 'Atrapa en la circunferencia la solución que cumple cada pista', {
              rounds: [
                { prompt: '2 sen θ + √3 = 0, en el cuadrante IV', angles: [300] },
                { prompt: '√2 cos θ = 1, con sen θ < 0', angles: [315] },
                { prompt: 'tan θ = √3, en el cuadrante III', angles: [240] },
              ],
            }, '$\\operatorname{sen}\\theta = -\\tfrac{\\sqrt3}{2}$ en el IV: $300^\\circ$. $\\cos\\theta = \\tfrac{\\sqrt2}{2}$ con seno negativo: $315^\\circ$. $\\tan\\theta = \\sqrt3$ en el III: $180^\\circ + 60^\\circ = 240^\\circ$.',
              { hint: 'Despeja la razón y busca su ángulo de referencia entre los notables. Después llévalo al cuadrante que pide la pista.' }),
            num('¿Cuántas soluciones tiene $\\tan 3x = 1$ en $[0, \\pi)$?', 3, '$3x = \\tfrac{\\pi}{4} + n\\pi \\Rightarrow x = \\tfrac{\\pi}{12} + \\tfrac{n\\pi}{3}$: $\\tfrac{\\pi}{12}, \\tfrac{5\\pi}{12}, \\tfrac{9\\pi}{12}$.',
              { hint: 'Resuelve primero para 3x con la solución general (la tangente se repite cada π) y luego divide entre 3. Cuenta cuántos valores caen antes de π.' }),
          ],
        },
        {
          id: 'trig-46a', title: 'Ley de senos',
          // Clase T16 (video/clase_trig_t16).
          clip: { scenes: [
            sc(5, 'Un triángulo **oblicuo** no tiene ángulo recto. Igual podemos resolverlo.', { viz: { type: 'oblique', a: 8, b: 10, C: 70 } }),
            sc(6, 'Cada lado es proporcional al seno de su ángulo opuesto.', { title: '$\\dfrac{\\sen A}{a} = \\dfrac{\\sen B}{b} = \\dfrac{\\sen C}{c}$', viz: { type: 'oblique', a: 8, b: 10, anim: [50, 100], show: 'senos' } }),
            sc(5, 'Úsala cuando conozcas dos ángulos y un lado (ALA, AAL). Con LLA puede haber 0, 1 o 2 triángulos: el **caso ambiguo**.', { steps: ['$A + B + C = 180^\\circ$', '$b = \\dfrac{a \\sen B}{\\sen A}$'] }),
          ] },
          ex: [
            play('compas-ambiguo', 'El lado $a$ es el brazo de un compás clavado en $C$. Marca cada lugar donde toca la base, o di que no hay triángulo', {
              rounds: [{ A: 30, b: 10, a: 6 }, { A: 30, b: 10, a: 4 }, { A: 30, b: 10, a: 5 }, { A: 50, b: 8, a: 10 }],
            }, 'La altura desde $C$ es $h = b\\operatorname{sen} A = 5$ en las tres primeras. Con $a = 6 > h$ (y menor que $b$) hay dos triángulos; con $a = 4 < h$, ninguno; con $a = h = 5$, uno rectángulo. Con $a = 10 > b = 8$ solo un corte cae a la derecha de $A$: un triángulo.',
              { hint: 'Calcula la altura h = b · sen A desde C hasta la base. Si a es menor que h, el brazo no llega; si es igual, toca en un punto; si es mayor, puede cortar dos veces, pero solo valen los cortes del lado derecho de A.' }),
            play('une-parejas', 'Une cada caso con la herramienta que lo resuelve', {
              left: ['AAL: dos ángulos y un lado', 'LAL: dos lados y el ángulo entre ellos', 'LLL: los tres lados', 'LLA: dos lados y un ángulo opuesto'],
              right: ['Ley de senos (un triángulo)', 'Ley de cosenos para el lado', 'Ley de cosenos para un ángulo', 'Ley de senos (caso ambiguo)', 'Teorema de Pitágoras', 'Suma de ángulos sola'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
            }, 'Con dos ángulos y un lado, la ley de senos da todo. LAL y LLL necesitan la ley de cosenos (para el lado o para un ángulo). LLA usa la ley de senos, pero puede dar 0, 1 o 2 triángulos.',
              { hint: 'La ley de senos necesita una pareja completa: un lado y su ángulo opuesto. Si no tienes ninguna pareja así, toca la ley de cosenos.' }),
            num('Si $a = 10$, $A = 30^\\circ$ y $B = 90^\\circ$, ¿cuánto mide $b$?', 20, '$b = \\dfrac{10 \\operatorname{sen} 90^\\circ}{\\operatorname{sen} 30^\\circ} = \\dfrac{10}{0.5} = 20$.',
              { hint: 'Tienes la pareja a y A completa. Plantea a / sen A = b / sen B y despeja b.' }),
          ],
        },
        {
          id: 'trig-46b', title: 'Ley de cosenos y área',
          // Clase T17 (video/clase_trig_t17).
          clip: { scenes: [
            sc(6, 'Con dos lados y el ángulo entre ellos (LAL), la **ley de cosenos** da el tercer lado. Es un Pitágoras generalizado.', { title: '$c^2 = a^2 + b^2 - 2ab\\cos C$', viz: { type: 'oblique', a: 7, b: 9, anim: [40, 120], show: 'cosenos' } }),
            sc(5, 'Si $C = 90^\\circ$, $\\cos C = 0$ y vuelve a ser Pitágoras.', { viz: { type: 'oblique', a: 7, b: 9, C: 90, show: 'cosenos' } }),
            sc(6, 'Área: con dos lados y el ángulo comprendido, o con los tres lados (**Herón**).', { steps: ['$\\text{Área} = \\tfrac12 ab \\sen C$', '$\\text{Área} = \\sqrt{s(s - a)(s - b)(s - c)}$', '$s = \\tfrac{a + b + c}{2}$'] }),
          ] },
          ex: [
            play('brazo-robot', 'Dobla el codo del robot para que la pinza agarre la gema', {
              rounds: [{ a: 8, b: 15, c: 13, ring: true }, { a: 3, b: 5, c: 7 }, { a: 5, b: 7, c: 6 }, { a: 6, b: 9, c: 10 }],
            }, 'Despejando la ley de cosenos, $\\cos C = \\dfrac{a^2 + b^2 - c^2}{2ab}$: $\\tfrac{64 + 225 - 169}{240} = \\tfrac12$ da $60^\\circ$; $\\tfrac{9 + 25 - 49}{30} = -\\tfrac12$ da $120^\\circ$; $\\tfrac{25 + 49 - 36}{70} \\approx 0.543$ da $\\approx 57.1^\\circ$; $\\tfrac{36 + 81 - 100}{108} \\approx 0.157$ da $\\approx 81^\\circ$.',
              { hint: 'Despeja cos C de c² = a² + b² − 2ab cos C y usa la inversa del coseno. Si cos C sale negativo, el codo queda abierto: más de 90°.' }),
            play('une-parejas', 'Une cada triángulo con su área', {
              left: ['a = 6, b = 10, C = 30°', 'lados 3, 4 y 5', 'a = 8, b = 8, C = 90°', 'a = 4, b = 5, C = 150°', 'lados 13, 14 y 15'],
              right: ['15', '6', '32', '5', '84', '30', '12', '42'],
              pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
            }, '$\\tfrac12 \\cdot 6 \\cdot 10 \\cdot \\tfrac12 = 15$; el 3-4-5 es rectángulo: $\\tfrac12 \\cdot 3 \\cdot 4 = 6$; $\\tfrac12 \\cdot 8 \\cdot 8 = 32$; $\\tfrac12 \\cdot 4 \\cdot 5 \\cdot \\operatorname{sen} 150^\\circ = 5$; Herón con $s = 21$: $\\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$.',
              { hint: 'Con dos lados y el ángulo entre ellos usa ½ · a · b · sen C (sen 150° = sen 30°). Con los tres lados usa Herón: primero el semiperímetro s.' }),
            num('Halla $c$ si $a = 7$, $b = 9$ y $C = 60^\\circ$', Math.sqrt(67), '$c^2 = 49 + 81 - 2(7)(9)(0.5) = 67 \\Rightarrow c = \\sqrt{67} \\approx 8.19$.',
              { tol: 0.02, answerText: '$\\sqrt{67} \\approx 8.19$', hint: 'Es el caso LAL: aplica c² = a² + b² − 2ab cos C con cos 60° = 0.5 y saca la raíz al final.' }),
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
