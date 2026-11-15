// Trigonometría: los juegos nuevos de cada lección (spec 2026-11-22-trigonometria-juegos). Va después de trig.js y
// añade al final de cada lección lo de TRIG_EXTRA: el último es siempre el juego propio de la lección.

const TRIG_EXTRA = (() => {
  const F3 = ['sen', 'cos', 'tan'];
  return {
    'trig-41a': [
      play('quita-vueltas', 'Un ángulo muy grande o negativo termina en el mismo lado que otro más sencillo. Toca «− 1 vuelta» o «+ 1 vuelta» hasta dejarlo en el intervalo pedido y luego «Listo»', {
        rounds: [
          { title: 'Más de una vuelta', items: [{ deg: 765 }, { deg: -300 }] },
          { title: 'Muy lejos y en otro intervalo', items: [{ deg: -1000 }, { deg: 500, lo: -180 }] },
          { title: 'En radianes: una vuelta son 2π', items: [{ deg: 495, rad: true }, { deg: -510, rad: true }] },
        ],
      }, '$765^\\circ - 2 \\cdot 360^\\circ = 45^\\circ$; $-300^\\circ + 360^\\circ = 60^\\circ$; $-1000^\\circ + 3 \\cdot 360^\\circ = 80^\\circ$; $500^\\circ - 360^\\circ = 140^\\circ$, que ya está entre $-180^\\circ$ y $180^\\circ$. En radianes la vuelta es $2\\pi$: $\\tfrac{11\\pi}{4} - 2\\pi = \\tfrac{3\\pi}{4}$ y $-\\tfrac{17\\pi}{6} + 4\\pi = \\tfrac{7\\pi}{6}$.',
        { hint: 'Sumar o restar una vuelta completa (360° o 2π) no mueve el lado terminal. Mira si el ángulo se pasa por arriba o se queda por debajo del intervalo: eso te dice si hay que quitar vueltas o ponerlas.' }),
    ],
    'trig-41b': [
      play('rueda-rodante', 'La rueda debe parar justo en la bandera. Elige con − y + el ángulo que tiene que girar y toca «Rodar»', {
        rounds: [
          { title: 'Del arco al ángulo', items: [{ r: 2, n: 9 }, { r: 3, n: 4 }] },
          { title: 'Otros radios', items: [{ r: 1, n: 15 }, { r: 4, n: 3 }] },
          { title: 'Rueda grande y rueda pequeña', items: [{ r: 3, n: 10 }, { r: 0.5, n: 12 }] },
        ],
      }, 'La rueda avanza lo que mide el arco que apoya: $s = r\\theta$, así que $\\theta = \\tfrac{s}{r}$. $\\tfrac{3\\pi}{2}$, $\\tfrac{2\\pi}{3}$, $\\tfrac{5\\pi}{2}$ (una vuelta y cuarto), $\\tfrac{\\pi}{2}$, $\\tfrac{5\\pi}{3}$ y, con el radio de medio metro, $\\tfrac{\\pi}{0.5} = 2\\pi$: una vuelta entera para avanzar apenas $\\pi$ metros.',
        { hint: 'La distancia que rueda es igual al arco, y el arco es radio por ángulo (en radianes). Despeja el ángulo: divide la distancia entre el radio. Una rueda pequeña tiene que girar más para avanzar lo mismo.' }),
    ],
    'trig-1': [
      play('multiplica-razon', 'En cada situación conoces un lado (azul) y buscas otro (rojo). Toca la razón que convierte el lado conocido en el buscado: el juego hace la cuenta', {
        rounds: [
          { title: 'Rampas y escaleras', items: [
            { q: 'Rampa de 8 m inclinada 20°. ¿Qué razón da la altura que sube?', known: 'hip', want: 'op', val: 8, deg: 20, unit: 'm', fns: F3 },
            { q: 'Escalera de 5 m a 70° del piso. ¿Qué razón da la distancia del pie a la pared?', known: 'hip', want: 'ady', val: 5, deg: 70, unit: 'm', fns: F3 }] },
          { title: 'Sombras y cables', items: [
            { q: 'Sombra de 6 m con el sol a 50°. ¿Qué razón da la altura del poste?', known: 'ady', want: 'op', val: 6, deg: 50, unit: 'm', fns: F3 },
            { q: 'Cable de 12 m a 35° del suelo. ¿Qué razón da la altura del amarre?', known: 'hip', want: 'op', val: 12, deg: 35, unit: 'm', fns: F3 }] },
        ],
      }, 'La rampa y el cable son hipotenusas y la altura es el lado opuesto: seno ($8 \\operatorname{sen} 20^\\circ \\approx 2.7$ m y $12 \\operatorname{sen} 35^\\circ \\approx 6.9$ m). La distancia del pie de la escalera es el adyacente: coseno ($5\\cos 70^\\circ \\approx 1.7$ m). La sombra es el adyacente y el poste el opuesto: tangente ($6\\tan 50^\\circ \\approx 7.2$ m).',
        { hint: 'Nombra los dos lados mirando desde el ángulo: ¿el conocido es la hipotenusa, el opuesto o el adyacente? ¿Y el buscado? Con esos dos nombres, SOH CAH TOA te dice la razón.' }),
      play('toca-lados', 'El triángulo sale girado o volteado. Mira desde θ y toca dos lados: primero el que va arriba de la fracción y luego el que va abajo', {
        rounds: [
          { title: 'Triángulo de pie', items: [{ fn: 'sen', t: 0, len: [3, 4, 5] }, { fn: 'cos', t: 1, len: [12, 5, 13] }] },
          { title: 'Volteado', items: [{ fn: 'tan', t: 2, len: [8, 15, 17] }, { fn: 'sen', t: 5, len: [24, 7, 25] }] },
          { title: 'De cabeza', items: [{ fn: 'cos', t: 6, len: [20, 21, 29] }, { fn: 'tan', t: 7, len: [35, 12, 37] }] },
        ],
      }, 'No importa cómo esté puesto el triángulo: el opuesto es el lado que no toca a θ, la hipotenusa está frente al ángulo recto y el adyacente es el otro lado que sale de θ. $\\operatorname{sen}\\theta = \\tfrac{\\text{op}}{\\text{hip}}$, $\\cos\\theta = \\tfrac{\\text{ady}}{\\text{hip}}$ y $\\tan\\theta = \\tfrac{\\text{op}}{\\text{ady}}$.',
        { hint: 'Primero ubica la hipotenusa: es el lado frente al cuadradito del ángulo recto. De los otros dos, el que no toca a θ es el opuesto. Luego recuerda SOH CAH TOA.' }),
    ],
    'trig-2': [
      play('proyecta-punto', 'Cada punto de la circunferencia de radio 1 guarda un coseno (de lado) y un seno (hacia arriba). Elígelos con − y + y toca «Proyectar»', {
        rounds: [
          { title: 'Cerca del eje x', items: [{ deg: 30 }, { deg: 45 }] },
          { title: 'Más arriba', items: [{ deg: 60 }, { deg: 90 }] },
        ],
      }, 'En el primer cuadrante todo es positivo: $30^\\circ \\to \\left(\\tfrac{\\sqrt3}{2}, \\tfrac12\\right)$, $45^\\circ \\to \\left(\\tfrac{\\sqrt2}{2}, \\tfrac{\\sqrt2}{2}\\right)$, $60^\\circ \\to \\left(\\tfrac12, \\tfrac{\\sqrt3}{2}\\right)$ y $90^\\circ \\to (0, 1)$. Al subir el ángulo, el seno crece y el coseno baja.',
        { hint: 'Mira el punto: si está más acostado que parado, el coseno es el número grande y el seno el pequeño. Los valores posibles van en orden: 1/2 es el menor, luego √2/2 y luego √3/2.' }),
      play('figuras-notables', 'Las razones de 30°, 45° y 60° salen de dos figuras partidas por la mitad. Busca el ángulo y toca dos lados: el de arriba de la fracción y luego el de abajo', {
        rounds: [
          { title: 'Del medio equilátero', items: [{ fn: 'sen', deg: 30 }, { fn: 'cos', deg: 30 }] },
          { title: 'Del medio cuadrado', items: [{ fn: 'tan', deg: 45 }, { fn: 'sen', deg: 45 }] },
          { title: 'El otro ángulo del equilátero', items: [{ fn: 'tan', deg: 60 }, { fn: 'cos', deg: 60 }] },
        ],
      }, 'Medio equilátero de lado 2: catetos $1$ y $\\sqrt3$, hipotenusa $2$. Frente a $30^\\circ$ está el $1$: $\\operatorname{sen} 30^\\circ = \\tfrac12$ y $\\cos 30^\\circ = \\tfrac{\\sqrt3}{2}$; frente a $60^\\circ$ está $\\sqrt3$: $\\tan 60^\\circ = \\sqrt3$ y $\\cos 60^\\circ = \\tfrac12$. Medio cuadrado de lado 1: hipotenusa $\\sqrt2$, así que $\\tan 45^\\circ = 1$ y $\\operatorname{sen} 45^\\circ = \\tfrac{1}{\\sqrt2} = \\tfrac{\\sqrt2}{2}$.',
        { hint: 'Primero decide en cuál figura vive el ángulo. Párate en ese ángulo: el lado que no lo toca es el opuesto. El lado más largo de cada triángulo es la hipotenusa.' }),
    ],
    'trig-42c': [
      play('toca-lados', 'Ahora con las razones recíprocas: son las mismas fracciones dadas vuelta. Toca primero el lado de arriba de la fracción y luego el de abajo', {
        rounds: [
          { title: 'Cosecante y secante', items: [{ fn: 'csc', t: 3, len: [9, 40, 41] }, { fn: 'sec', t: 4, len: [60, 11, 61] }] },
          { title: 'Cotangente y otra más', items: [{ fn: 'cot', t: 1, len: [28, 45, 53] }, { fn: 'csc', t: 6, len: [56, 33, 65] }] },
        ],
      }, 'La cosecante es el seno al revés: $\\csc\\theta = \\tfrac{\\text{hip}}{\\text{op}}$. La secante es el coseno al revés: $\\sec\\theta = \\tfrac{\\text{hip}}{\\text{ady}}$. La cotangente es la tangente al revés: $\\cot\\theta = \\tfrac{\\text{ady}}{\\text{op}}$. En la cosecante y la secante la hipotenusa va arriba, así que siempre valen más que 1.',
        { hint: 'Piensa primero en la razón conocida (seno, coseno o tangente) y después dale la vuelta: lo que iba abajo pasa arriba. Cosecante va con seno; secante, con coseno.' }),
      play('multiplica-razon', 'Medir sin alcanzar: en cada situación conoces un lado (azul) y buscas otro (rojo). Toca, entre las seis razones, la que multiplica al lado conocido para dar el buscado', {
        rounds: [
          { title: 'Alturas y distancias', items: [
            { q: 'A 30 m de una torre, la cima se ve a 40°. ¿Qué razón da la altura?', known: 'ady', want: 'op', val: 30, deg: 40, unit: 'm' },
            { q: 'Un árbol de 9 m se ve a 35° desde el suelo. ¿Qué razón da la distancia al árbol?', known: 'op', want: 'ady', val: 9, deg: 35, unit: 'm' }] },
          { title: 'Cables y miradas', items: [
            { q: 'Un globo a 150 m de altura se ve a 48°. ¿Qué razón da la distancia en línea recta?', known: 'op', want: 'hip', val: 150, deg: 48, unit: 'm' },
            { q: 'Un cable sale del suelo a 65° hacia un poste que está a 7 m. ¿Qué razón da su largo?', known: 'ady', want: 'hip', val: 7, deg: 65, unit: 'm' }] },
          { title: 'Desde arriba', items: [
            { q: 'Desde un faro de 25 m se ve un bote con 15° de depresión. ¿Qué razón da la distancia al bote?', known: 'op', want: 'ady', val: 25, deg: 15, unit: 'm' },
            { q: 'Un dron baja 80 m en línea recta con 30° de inclinación. ¿Qué razón da la altura que pierde?', known: 'hip', want: 'op', val: 80, deg: 30, unit: 'm' }] },
        ],
      }, 'Cada razón es «buscado entre conocido». Altura con la distancia: $30\\tan 40^\\circ \\approx 25.2$ m. Distancia con la altura: $9\\cot 35^\\circ \\approx 12.9$ m. Línea recta con la altura: $150\\csc 48^\\circ \\approx 201.8$ m. Cable con la distancia: $7\\sec 65^\\circ \\approx 16.6$ m. El ángulo de depresión es igual al de elevación desde el bote: $25\\cot 15^\\circ \\approx 93.3$ m. Y el dron: $80\\operatorname{sen} 30^\\circ = 40$ m.',
        { hint: 'Nombra los dos lados desde el ángulo (opuesto, adyacente o hipotenusa) y forma la fracción «buscado sobre conocido». Si la hipotenusa queda arriba, es una recíproca: cosecante o secante.' }),
    ],
    'trig-3': [
      play('quita-vueltas', 'En la circunferencia unitaria, después de una vuelta todo se repite. Quita o pon vueltas de $2\\pi$ hasta dejar el número entre $0$ y $2\\pi$, y toca «Listo»', {
        rounds: [
          { title: 'Se pasó de la vuelta', items: [{ deg: 390, rad: true }, { deg: 840, rad: true }] },
          { title: 'Giros hacia atrás', items: [{ deg: -45, rad: true }, { deg: -780, rad: true }] },
        ],
      }, '$\\tfrac{13\\pi}{6} - 2\\pi = \\tfrac{\\pi}{6}$; $\\tfrac{14\\pi}{3} - 4\\pi = \\tfrac{2\\pi}{3}$; $-\\tfrac{\\pi}{4} + 2\\pi = \\tfrac{7\\pi}{4}$ y $-\\tfrac{13\\pi}{3} + 6\\pi = \\tfrac{5\\pi}{3}$. Como el punto terminal es el mismo, el seno y el coseno también: por eso son funciones periódicas, con periodo $2\\pi$.',
        { hint: 'Escribe 2π con el mismo denominador del ángulo (por ejemplo, 2π = 12π/6) y resta o suma hasta caer entre 0 y 2π.' }),
      play('proyecta-punto', 'Ahora en toda la circunferencia: el coseno puede ser negativo (a la izquierda) y el seno también (abajo). Elige los dos valores con su signo y toca «Proyectar»', {
        rounds: [
          { title: 'A la izquierda', items: [{ deg: 150 }, { deg: 225 }] },
          { title: 'Abajo y sobre un eje', items: [{ deg: 300 }, { deg: 180 }] },
          { title: 'En radianes', items: [{ deg: 240, rad: true }, { deg: 330, rad: true }] },
        ],
      }, '$150^\\circ \\to \\left(-\\tfrac{\\sqrt3}{2}, \\tfrac12\\right)$; $225^\\circ \\to \\left(-\\tfrac{\\sqrt2}{2}, -\\tfrac{\\sqrt2}{2}\\right)$; $300^\\circ \\to \\left(\\tfrac12, -\\tfrac{\\sqrt3}{2}\\right)$; $180^\\circ \\to (-1, 0)$; $\\tfrac{4\\pi}{3} \\to \\left(-\\tfrac12, -\\tfrac{\\sqrt3}{2}\\right)$ y $\\tfrac{11\\pi}{6} \\to \\left(\\tfrac{\\sqrt3}{2}, -\\tfrac12\\right)$. El tamaño sale del ángulo con el eje x; el signo, del lado donde está el punto.',
        { hint: 'Decide primero los signos: ¿el punto está a la derecha o a la izquierda?, ¿arriba o abajo? Después mira qué tan lejos está de cada eje para elegir entre 1/2, √2/2 y √3/2.' }),
    ],
    'trig-43b': [
      play('espejo-cuadrantes', 'Los espejos reflejan el punto: «↕» lo pasa al otro lado del eje x y «↔» al otro lado del eje y. Llévalo adonde se pide sin gastar espejos de más', {
        rounds: [
          { title: 'Ángulo de referencia', items: [{ deg: 160, to: 1, max: 1 }, { deg: 250, to: 1 }] },
          { title: 'Más referencias', items: [{ deg: 320, to: 1, max: 1 }, { deg: 195, to: 1 }] },
          { title: 'Según los signos', items: [
            { deg: 40, to: 3, cond: 'el seno y el coseno sean negativos' },
            { deg: 70, to: 4, max: 1, cond: 'solo el coseno sea positivo' },
            { deg: 25, to: 2, max: 1, cond: 'solo el seno sea positivo' }] },
        ],
      }, 'El reflejo que cae en el cuadrante I muestra el ángulo de referencia: $160^\\circ \\to 20^\\circ$, $250^\\circ \\to 70^\\circ$, $320^\\circ \\to 40^\\circ$ y $195^\\circ \\to 15^\\circ$. Cada espejo cambia un signo: «↕» el del seno y «↔» el del coseno; la tangente cambia con cualquiera de los dos. Seno y coseno negativos: cuadrante III ($220^\\circ$); solo coseno positivo: IV ($290^\\circ$); solo seno positivo: II ($155^\\circ$).',
        { hint: 'Mira las tres etiquetas de signos: te dicen en qué cuadrante estás. El espejo «↕» cambia arriba por abajo (el seno) y el «↔» cambia derecha por izquierda (el coseno).' }),
    ],
    'trig-44a': [
      play('ola-entre-lineas', 'La ola debe tocar justo el techo y el piso, sin pasarse. Elige la amplitud y la línea media con − y +, y toca «Lanzar ola» para verla', {
        rounds: [
          { title: 'Centrada en cero', items: [{ hi: 3, lo: -3 }, { hi: 1.5, lo: -1.5 }] },
          { title: 'Subida o bajada', items: [{ hi: 3, lo: 1 }, { hi: 1, lo: -3 }] },
          { title: 'Con medios', items: [{ hi: 4, lo: -1 }, { hi: -0.5, lo: -2.5 }] },
        ],
      }, 'La línea media queda en la mitad del techo y el piso, $d = \\tfrac{\\text{techo} + \\text{piso}}{2}$, y la amplitud es la mitad de la separación, $a = \\tfrac{\\text{techo} - \\text{piso}}{2}$. Por ejemplo, entre $1$ y $3$: $d = 2$ y $a = 1$; entre $-1$ y $4$: $d = 1.5$ y $a = 2.5$. El rango de $y = a\\operatorname{sen} x + d$ es $[d - a,\\, d + a]$.',
        { hint: 'La línea media está justo en la mitad entre el techo y el piso. La amplitud es lo que hay de esa línea al techo, no del piso al techo.' }),
    ],
    'trig-44b': [
      play('crestas-faroles', 'Cada cresta de la ola debe caer en un farol. Elige cuántas ondas caben en $2\\pi$ y cuánto se corre la ola, y toca «Soltar la ola»', {
        rounds: [
          { title: 'Solo el periodo', items: [{ b: 2, h: 0 }, { b: 3, h: 0 }, { b: 0, h: 0 }] },
          { title: 'Solo la corrida', items: [{ b: 1, h: 2 }, { b: 1, h: 5 }] },
          { title: 'Las dos cosas', items: [{ b: 2, h: 1 }, { b: 3, h: 1 }] },
        ],
      }, 'La distancia entre dos faroles es el periodo, $\\tfrac{2\\pi}{b}$: faroles cada $\\pi$ piden $b = 2$; cada $\\tfrac{\\pi}{2}$, $b = 4$; cada $4\\pi$, $b = \\tfrac12$. La ola $y = \\cos(b(x - h))$ tiene una cresta en $x = h$: se corre hasta el primer farol. Con $h = \\tfrac{\\pi}{2}$ y $b = 1$ sale $\\cos\\left(x - \\tfrac{\\pi}{2}\\right)$, que es el seno.',
        { hint: 'Mide primero la distancia entre dos faroles vecinos: ese es el periodo. Abajo el juego te dice el periodo de tu ola. Después mira dónde está el primer farol: hasta ahí hay que correr la cresta.' }),
    ],
    'trig-45': [
      play('ventana-inversa', 'Para poder «devolver» un ángulo, la función no puede repetir alturas. Mueve la ventana (dónde empieza y qué tan ancha es) y toca «Probar»', {
        rounds: [
          { title: 'Una ventana que sirva', items: [{ fn: 'sen' }, { fn: 'cos' }] },
          { title: 'La ventana oficial', items: [{ fn: 'sen', std: true }, { fn: 'cos', std: true }] },
          { title: 'La tangente', items: [{ fn: 'tan' }, { fn: 'tan', std: true }] },
        ],
      }, 'Un tramo sirve si recorre todas las alturas una sola vez: para el seno y el coseno, de un extremo (cresta o valle) al siguiente, con ancho $\\pi$; para la tangente, de una asíntota a la otra. Las oficiales contienen los ángulos agudos: $\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]$ para $\\operatorname{sen}^{-1}$ y $\\tan^{-1}$ (abierto en la tangente), y $[0, \\pi]$ para $\\cos^{-1}$. Por eso cada inversa devuelve un solo ángulo.',
        { hint: 'Si la ventana es muy ancha, la curva sube y vuelve a bajar: repite alturas. Si es muy angosta, no alcanza todas. Busca un tramo donde la curva solo suba o solo baje, de extremo a extremo.' }),
    ],
    'trig-4': [
      play('escala-triangulo', 'El triángulo tiene lados cos θ, sen θ y 1. Divídelo entero entre cos θ o entre sen θ y toca el lado que queda valiendo lo que se pide', {
        rounds: [
          { title: 'Una de cada triángulo', items: [{ want: 'tan' }, { want: 'csc' }] },
          { title: 'Las otras dos', items: [{ want: 'sec' }, { want: 'cot' }] },
        ],
      }, 'Al dividir los tres lados entre $\\cos\\theta$ quedan $1$, $\\tan\\theta$ y $\\sec\\theta$ (la hipotenusa): por Pitágoras, $1 + \\tan^2\\theta = \\sec^2\\theta$. Al dividir entre $\\operatorname{sen}\\theta$ quedan $\\cot\\theta$, $1$ y $\\csc\\theta$: $\\cot^2\\theta + 1 = \\csc^2\\theta$. Las tres identidades pitagóricas son el mismo triángulo en tres tamaños.',
        { hint: 'Divide mentalmente cada lado: sen θ entre cos θ es la tangente; 1 entre cos θ es la secante. La hipotenusa era 1, así que la nueva hipotenusa es 1 dividido entre lo que elegiste.' }),
    ],
    'trig-47b': [
      play('todo-en-senos', 'La estrategia para simplificar: todo a senos y cosenos. Toca cada ficha de color para abrirla; luego toca una ficha de arriba y una igual de abajo para cancelarlas, y al final «Listo»', {
        rounds: [
          { title: 'Dos fichas', items: [{ f: ['cot', 'sen'] }, { f: ['sec', 'sen'] }] },
          { title: 'Tres fichas', items: [{ f: ['tan', 'csc', 'cos'] }, { f: ['sec', 'cot', 'cos'] }] },
          { title: 'Con una pitagórica', items: [{ f: ['ps', 'sec'] }, { f: ['pc', 'csc', 'cot'] }] },
        ],
      }, '$\\cot x \\operatorname{sen} x = \\tfrac{\\cos x}{\\operatorname{sen} x}\\operatorname{sen} x = \\cos x$; $\\sec x \\operatorname{sen} x = \\tfrac{\\operatorname{sen} x}{\\cos x} = \\tan x$; $\\tan x \\csc x \\cos x = 1$; $\\sec x \\cot x \\cos x = \\tfrac{\\cos x}{\\operatorname{sen} x} = \\cot x$. Con las pitagóricas: $1 - \\operatorname{sen}^2 x = \\cos^2 x$, y $\\cos^2 x \\sec x = \\cos x$; $1 - \\cos^2 x = \\operatorname{sen}^2 x$, y $\\operatorname{sen}^2 x \\csc x \\cot x = \\cos x$.',
        { hint: 'Cada función se escribe con senos y cosenos: tan = sen/cos, cot = cos/sen, sec = 1/cos y csc = 1/sen. Solo se cancela un factor de arriba con uno igual de abajo; si no queda pareja, ya terminaste.' }),
    ],
    'trig-48a': [
      play('rectangulo-suma', 'Un triángulo de hipotenusa 1 está inclinado dentro de un rectángulo, y cada tramo del borde tiene su medida. Toca los tramos que forman el lado marcado con «?»', {
        rounds: [
          { title: 'Con letras', items: [{ ask: 'sen' }, { ask: 'cos' }] },
          { title: 'Con un ángulo que ya conoces: 30° + 30°', items: [
            { ask: 'sen', a: 30, b: 30, vals: ['\\tfrac34', '\\tfrac{\\sqrt3}{4}', '\\tfrac{\\sqrt3}{4}', '\\tfrac14'], res: '\\tfrac{\\sqrt3}{2}' },
            { ask: 'cos', a: 30, b: 30, vals: ['\\tfrac34', '\\tfrac{\\sqrt3}{4}', '\\tfrac{\\sqrt3}{4}', '\\tfrac14'], res: '\\tfrac12' }] },
        ],
      }, 'Los lados opuestos de un rectángulo miden lo mismo. El izquierdo es $\\operatorname{sen}(\\alpha + \\beta)$ y el derecho tiene dos tramos: $\\operatorname{sen}\\alpha\\cos\\beta + \\cos\\alpha\\operatorname{sen}\\beta$. Arriba, $\\cos(\\alpha + \\beta)$ es el lado de abajo menos un pedazo: $\\cos\\alpha\\cos\\beta - \\operatorname{sen}\\alpha\\operatorname{sen}\\beta$. Con $30^\\circ + 30^\\circ$ se comprueba: $\\tfrac{\\sqrt3}{4} + \\tfrac{\\sqrt3}{4} = \\tfrac{\\sqrt3}{2} = \\operatorname{sen} 60^\\circ$ y $\\tfrac34 - \\tfrac14 = \\tfrac12 = \\cos 60^\\circ$.',
        { hint: 'Compara el lado marcado con el lado del frente del rectángulo: miden lo mismo. Fíjate si el del frente está hecho de dos tramos que se suman, o si es más largo y le sobra un pedazo.' }),
    ],
    'trig-48b': [
      play('tira-doble', 'Una tira de largo 1 se parte en dos: lo azul es cos²θ y lo rojo es sen²θ. Mueve el corte con − y + para que azul menos rojo dé lo pedido, y toca «Restar»', {
        rounds: [
          { title: 'Más azul que rojo', items: [{ t: 2 }, { t: 0 }] },
          { title: 'Más rojo que azul', items: [{ t: -2 }, { t: -4 }] },
          { title: 'Cortes finos', items: [{ t: 1 }, { t: -3 }] },
        ],
      }, 'Como las dos partes suman 1, $\\cos 2\\theta = \\cos^2\\theta - \\operatorname{sen}^2\\theta = 2\\cos^2\\theta - 1$. Despejando, $\\cos^2\\theta = \\tfrac{1 + \\cos 2\\theta}{2}$: para $\\cos 2\\theta = \\tfrac12$ el corte va en $\\tfrac34$ ($\\theta = 30^\\circ$); para $0$, en $\\tfrac12$ ($45^\\circ$); para $-\\tfrac12$, en $\\tfrac14$ ($60^\\circ$); para $-1$, en $0$ ($90^\\circ$); para $\\tfrac14$, en $\\tfrac58$ y para $-\\tfrac34$, en $\\tfrac18$.',
        { hint: 'Las dos partes siempre suman 1. Si quieres que la resta dé un número positivo, lo azul debe ser más de la mitad. Prueba a pensar: ¿qué dos números suman 1 y se diferencian en lo pedido?' }),
    ],
    'trig-49': [
      play('red-periodica', 'Las soluciones se repiten sin fin: cada red atrapa una familia. Resuelve la ecuación, pon con − y + la primera solución y el salto de cada red, y toca «Lanzar»: ahí se ven los peces', {
        rounds: [
          { title: 'Una sola red', items: [{ eq: '\\tan x = 1', fams: [[3, 12]] }, { eq: '\\cos x = 0', fams: [[6, 12]] }] },
          { title: 'Dos redes', items: [{ eq: '\\operatorname{sen} x = -\\tfrac12', fams: [[14, 24], [22, 24]] }, { eq: '2\\cos x = -\\sqrt3', fams: [[10, 24], [14, 24]] }] },
          { title: 'Ángulos múltiples', items: [{ eq: '\\tan 2x = \\sqrt3', fams: [[2, 6]] }, { eq: '\\operatorname{sen} 3x = 1', fams: [[2, 8]] }] },
        ],
      }, 'La tangente se repite cada $\\pi$: $x = \\tfrac{\\pi}{4} + k\\pi$. Los ceros del coseno también van cada $\\pi$: $x = \\tfrac{\\pi}{2} + k\\pi$. El seno y el coseno dan dos soluciones por vuelta, cada una con salto $2\\pi$: $\\tfrac{7\\pi}{6}$ y $\\tfrac{11\\pi}{6}$; $\\tfrac{5\\pi}{6}$ y $\\tfrac{7\\pi}{6}$. Con ángulo múltiple el salto se divide: $2x = \\tfrac{\\pi}{3} + k\\pi$ da $x = \\tfrac{\\pi}{6} + \\tfrac{k\\pi}{2}$, y $3x = \\tfrac{\\pi}{2} + 2k\\pi$ da $x = \\tfrac{\\pi}{6} + \\tfrac{2k\\pi}{3}$.',
        { hint: 'Despeja primero la función y busca los ángulos entre 0 y 2π que la cumplen. El salto es el periodo: 2π para seno y coseno, π para la tangente; si adentro va 2x o 3x, ese periodo se divide entre 2 o entre 3.' }),
    ],
    'trig-46a': [
      play('pareja-opuesta', 'Lo azul ya se conoce. Toca, en orden, lo que ya se puede calcular hasta llegar a lo que se pide (en rojo): un ángulo sale de los otros dos, y la ley de senos necesita una pareja completa de lado y ángulo opuesto', {
        rounds: [
          { title: 'Con la pareja lista', items: [
            { ang: [30, 105, 45], base: [0, 10], know: ['A', 'C', 'a'], want: 'c' },
            { ang: [40, 60, 80], base: [1, 12], know: ['A', 'B', 'b'], want: 'a' }] },
          { title: 'Primero falta algo', items: [
            { ang: [50, 70, 60], base: [0, 9], know: ['A', 'B', 'a'], want: 'c' },
            { ang: [35, 100, 45], base: [2, 20], know: ['A', 'B', 'c'], want: 'b' }] },
          { title: 'Dos lados y un ángulo opuesto', items: [
            { ang: [50, 37.8, 92.2], base: [0, 10], know: ['A', 'a', 'b'], want: 'B' },
            { ang: [60, 40, 80], base: [0, 13], know: ['A', 'a', 'b'], want: 'c' }] },
        ],
      }, 'La ley de senos, $\\tfrac{a}{\\operatorname{sen} A} = \\tfrac{b}{\\operatorname{sen} B} = \\tfrac{c}{\\operatorname{sen} C}$, solo arranca con una pareja completa. Si el lado buscado no tiene su ángulo, primero se saca con $A + B + C = 180^\\circ$. Con dos lados y un ángulo opuesto (LLA) se despeja primero el seno del otro ángulo: $\\operatorname{sen} B = \\tfrac{b\\operatorname{sen} A}{a}$. En estos dos retos el lado $a$ es mayor que $b$, así que $B$ es agudo y solo hay un triángulo; si $a$ fuera menor, habría que revisar el caso ambiguo.',
        { hint: 'Busca una pareja completa: un lado y el ángulo que tiene al frente, los dos en azul. Si a lo que buscas le falta su compañero del frente, calcula primero ese compañero.' }),
    ],
    'trig-46b': [
      play('bisagra-area', 'El lado azul gira como una bisagra. El área solo depende de qué tan alto queda su punta: llévala hasta la línea punteada, toca «Marcar» y busca si hay otro ángulo que sirva. Al final, «Listo»', {
        rounds: [
          { title: 'Dos ángulos o uno', items: [{ a: 6, b: 10, area: 15 }, { a: 8, b: 8, area: 32 }] },
          { title: 'Con raíces', items: [{ a: 4, b: 6, area: 8.49, atex: '6\\sqrt2' }, { a: 10, b: 6, area: 25.98, atex: '15\\sqrt3' }] },
          { title: 'Otra pareja', items: [{ a: 5, b: 8, area: 10 }, { a: 7, b: 4, area: 14 }] },
        ],
      }, 'Área $= \\tfrac12 ab\\operatorname{sen} C$, y $\\operatorname{sen} C = \\operatorname{sen}(180^\\circ - C)$: un ángulo agudo y su suplemento dejan la punta a la misma altura. $\\operatorname{sen} C = \\tfrac12$: $30^\\circ$ y $150^\\circ$; $\\operatorname{sen} C = \\tfrac{\\sqrt2}{2}$: $45^\\circ$ y $135^\\circ$; $\\operatorname{sen} C = \\tfrac{\\sqrt3}{2}$: $60^\\circ$ y $120^\\circ$. Cuando el área es la mayor posible, $\\tfrac12 ab$, solo sirve $90^\\circ$.',
        { hint: 'La punta sube mientras abres el ángulo hasta 90° y después vuelve a bajar: pasa dos veces por casi todas las alturas. Si ya encontraste un ángulo, busca su reflejo al otro lado de la vertical.' }),
    ],
    'trig-151': [
      play('parientes-polares', 'El punto azul es z. Mueve el punto rojo w con las perillas de módulo y ángulo hasta el pariente de z que se pide, y toca «Fijar»', {
        rounds: [
          { title: 'Conjugado y opuesto', items: [{ r: 2, deg: 45, rel: 'conj' }, { r: 3, deg: 120, rel: 'op' }] },
          { title: 'Girar con i', items: [{ r: 2, deg: 150, rel: 'i' }, { r: 4, deg: 300, rel: 'i' }] },
          { title: 'El inverso y un repaso', items: [{ r: 2, deg: 60, rel: 'inv' }, { r: 0, deg: 210, rel: 'inv' }, { r: 1, deg: 135, rel: 'conj' }] },
        ],
      }, 'En forma polar todo se lee en el módulo y el ángulo. Conjugado: mismo módulo y ángulo opuesto ($45^\\circ \\to 315^\\circ$, $135^\\circ \\to 225^\\circ$). Opuesto: media vuelta ($120^\\circ \\to 300^\\circ$). Multiplicar por $i$: un cuarto de vuelta ($150^\\circ \\to 240^\\circ$, $300^\\circ \\to 30^\\circ$). Inverso: el módulo se invierte y el ángulo cambia de signo ($2\\,\\mathrm{cis}\\,60^\\circ \\to \\tfrac12\\,\\mathrm{cis}\\,300^\\circ$ y $\\tfrac12\\,\\mathrm{cis}\\,210^\\circ \\to 2\\,\\mathrm{cis}\\,150^\\circ$).',
        { hint: 'Pregúntate dos cosas: ¿cambia la distancia al origen? ¿Y el ángulo: se refleja en el eje real, gira un cuarto de vuelta o media vuelta? Un ángulo negativo se escribe sumándole 360°.' }),
    ],
    'trig-152': [
      play('hermanas-raiz', 'Ya tienes una raíz (el punto amarillo). Las demás tienen el mismo módulo y reparten la vuelta en partes iguales: toca sobre la circunferencia dónde están', {
        rounds: [
          { title: 'Tres y cuatro raíces', items: [{ n: 3, deg0: 45, step: 15 }, { n: 4, deg0: 15, step: 15 }] },
          { title: 'Seis y cinco raíces', items: [{ n: 6, deg0: 30, step: 15 }, { n: 5, deg0: 12, step: 12 }] },
          { title: 'Dos y ocho raíces', items: [{ n: 2, deg0: 255, step: 15 }, { n: 8, deg0: 15, step: 15 }] },
        ],
      }, 'Las $n$ raíces $n$-ésimas están separadas $\\tfrac{360^\\circ}{n}$: cúbicas cada $120^\\circ$ ($45^\\circ, 165^\\circ, 285^\\circ$), cuartas cada $90^\\circ$, sextas cada $60^\\circ$, quintas cada $72^\\circ$ ($12^\\circ, 84^\\circ, 156^\\circ, 228^\\circ, 300^\\circ$), cuadradas a media vuelta ($255^\\circ$ y $75^\\circ$) y octavas cada $45^\\circ$. Forman un polígono regular.',
        { hint: 'Divide la vuelta completa, 360°, entre el número de raíces: ese es el salto de una raíz a la siguiente. Súmalo una y otra vez al ángulo de la raíz que ya tienes; si te pasas de 360°, resta una vuelta.' }),
    ],
  };
})();

for (const u of COURSE_TRIG.units) for (const l of u.lessons) l.ex.push(...(TRIG_EXTRA[l.id] || []));
