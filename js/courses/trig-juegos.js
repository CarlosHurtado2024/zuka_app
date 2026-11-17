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
      play('espejo-cuadrantes', 'Los espejos reflejan el punto: «↕» lo pasa al otro lado del eje x y «↔» al otro lado del eje y. Llévalo adonde se pide sin gastar espejos de más; cuando caiga en el cuadrante I, pon con − y + cuánto mide su ángulo de referencia y toca «Comprobar»', {
        rounds: [
          { title: 'Ángulo de referencia', items: [{ deg: 160, to: 1, max: 1 }, { deg: 250, to: 1 }] },
          { title: 'Más referencias', items: [{ deg: 320, to: 1, max: 1 }, { deg: 195, to: 1 }] },
          { title: 'Según los signos', items: [
            { deg: 40, to: 3, cond: 'el seno y el coseno sean negativos' },
            { deg: 70, to: 4, max: 1, cond: 'solo el coseno sea positivo' },
            { deg: 25, to: 2, max: 1, cond: 'solo el seno sea positivo' }] },
        ],
      }, 'El reflejo que cae en el cuadrante I muestra el ángulo de referencia: $160^\\circ \\to 20^\\circ$, $250^\\circ \\to 70^\\circ$, $320^\\circ \\to 40^\\circ$ y $195^\\circ \\to 15^\\circ$. Cada espejo cambia un signo: «↕» el del seno y «↔» el del coseno; la tangente cambia con cualquiera de los dos. Seno y coseno negativos: cuadrante III ($220^\\circ$); solo coseno positivo: IV ($290^\\circ$); solo seno positivo: II ($155^\\circ$).',
        { hint: 'Mira las tres etiquetas de signos: te dicen en qué cuadrante estás. El espejo «↕» cambia arriba por abajo (el seno) y el «↔» cambia derecha por izquierda (el coseno). El ángulo de referencia es lo que le falta o le sobra al ángulo para llegar a 180° o a 360°.' }),
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
      play('todo-en-senos', 'La estrategia para simplificar: todo a senos y cosenos. Toca una ficha amarilla y arma su fracción (qué va arriba y qué va abajo); luego toca una ficha de arriba y una igual de abajo para cancelarlas, y al final «Listo»', {
        rounds: [
          { title: 'Dos fichas', items: [{ f: ['cot', 'sen'] }, { f: ['sec', 'sen'] }] },
          { title: 'Tres fichas', items: [{ f: ['tan', 'csc', 'cos'] }, { f: ['sec', 'cot', 'cos'] }] },
          { title: 'Con una pitagórica', items: [{ f: ['ps', 'sec'] }, { f: ['pc', 'csc', 'cot'] }] },
        ],
      }, '$\\cot x \\operatorname{sen} x = \\tfrac{\\cos x}{\\operatorname{sen} x}\\operatorname{sen} x = \\cos x$; $\\sec x \\operatorname{sen} x = \\tfrac{\\operatorname{sen} x}{\\cos x} = \\tan x$; $\\tan x \\csc x \\cos x = 1$; $\\sec x \\cot x \\cos x = \\tfrac{\\cos x}{\\operatorname{sen} x} = \\cot x$. Con las pitagóricas: $1 - \\operatorname{sen}^2 x = \\cos^2 x$, y $\\cos^2 x \\sec x = \\cos x$; $1 - \\cos^2 x = \\operatorname{sen}^2 x$, y $\\operatorname{sen}^2 x \\csc x \\cot x = \\cos x$.',
        { hint: 'Cada función se escribe con senos y cosenos: tan = sen/cos, cot = cos/sen, sec = 1/cos y csc = 1/sen. Solo se cancela un factor de arriba con uno igual de abajo; si no queda pareja, ya terminaste.' }),
    ],
    'trig-48a': [
      play('rectangulo-suma', 'Un triángulo de hipotenusa 1 está inclinado dentro de un rectángulo, y sus catetos miden cos β y sen β. Toca cada tramo de color y luego la ficha con su medida: juntos dan el lado marcado con «?»', {
        rounds: [
          { title: 'Con letras', items: [{ ask: 'sen' }, { ask: 'cos' }] },
          { title: 'Con un ángulo que ya conoces: 30° + 30°', items: [
            { ask: 'sen', a: 30, b: 30, vals: ['\\tfrac34', '\\tfrac{\\sqrt3}{4}', '\\tfrac{\\sqrt3}{4}', '\\tfrac14'], res: '\\tfrac{\\sqrt3}{2}' },
            { ask: 'cos', a: 30, b: 30, vals: ['\\tfrac34', '\\tfrac{\\sqrt3}{4}', '\\tfrac{\\sqrt3}{4}', '\\tfrac14'], res: '\\tfrac12' }] },
        ],
      }, 'Los lados opuestos de un rectángulo miden lo mismo. El izquierdo es $\\operatorname{sen}(\\alpha + \\beta)$ y el derecho tiene dos tramos: $\\operatorname{sen}\\alpha\\cos\\beta + \\cos\\alpha\\operatorname{sen}\\beta$. Arriba, $\\cos(\\alpha + \\beta)$ es el lado de abajo menos un pedazo: $\\cos\\alpha\\cos\\beta - \\operatorname{sen}\\alpha\\operatorname{sen}\\beta$. Con $30^\\circ + 30^\\circ$ se comprueba: $\\tfrac{\\sqrt3}{4} + \\tfrac{\\sqrt3}{4} = \\tfrac{\\sqrt3}{2} = \\operatorname{sen} 60^\\circ$ y $\\tfrac34 - \\tfrac14 = \\tfrac12 = \\cos 60^\\circ$.',
        { hint: 'Cada tramo de color es cateto de un triángulo pequeño que tiene el ángulo α. Mira cuál es la hipotenusa de ese triángulo (cos β o sen β) y si el tramo queda frente a α (va con seno) o pegado a α (va con coseno).' }),
    ],
    'trig-48b': [
      play('tira-doble', 'Una tira de largo 1 se parte en dos: lo azul es cos²θ y lo rojo es sen²θ. Mueve el corte con − y + para que azul menos rojo dé lo pedido, y toca «Restar»', {
        rounds: [
          { title: 'Azul contra rojo', items: [{ t: 2 }, { t: 0 }] },
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
          { title: 'Otra pareja', items: [{ a: 8, b: 5, area: 17.32, atex: '10\\sqrt3' }, { a: 6, b: 6, area: 12.73, atex: '9\\sqrt2' }] },
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
      play('multiplicador-oculto', 'La bandera gris se multiplicó por un número w y quedó en color. Mira cuánto giró y cuánto se estiró, y toca w en la telaraña', {
        rounds: [
          { title: 'Girar y estirar', items: [{ r: 2, deg: 90 }, { r: 1, deg: 150 }] },
          { title: 'Achicar y girar hacia atrás', items: [{ r: 0.5, deg: 0 }, { r: 1.5, deg: 300 }] },
          { title: 'Dos veces el mismo w', items: [{ r: 1, deg: 30, k: 2 }, { r: 1, deg: 90, k: 2 }] },
        ],
      }, 'Multiplicar por $w = r\\,\\mathrm{cis}\\,\\theta$ gira la figura $\\theta$ y la estira $r$ veces: $2\\,\\mathrm{cis}\\,90^\\circ$ la gira un cuarto de vuelta y la duplica; $\\tfrac12\\,\\mathrm{cis}\\,0^\\circ$ solo la achica; $1.5\\,\\mathrm{cis}\\,300^\\circ$ la gira $60^\\circ$ hacia el reloj. Multiplicar dos veces gira el doble ($w^2 = r^2\\,\\mathrm{cis}\\,2\\theta$), así que hay dos respuestas a media vuelta: $\\mathrm{cis}\\,30^\\circ$ o $\\mathrm{cis}\\,210^\\circ$, y $\\mathrm{cis}\\,90^\\circ$ o $\\mathrm{cis}\\,270^\\circ$.',
        { hint: 'Compara las dos banderas: el ángulo que giró es el de w y las veces que creció es su módulo. Si se multiplicó dos veces, el giro total es el doble del de w: parte el giro a la mitad, y no olvides que media vuelta más también sirve.' }),
    ],
    'trig-153': [
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

// ====================== Jefes finales (spec 2026-11-23-trig-jefes-y-movimiento) ======================
// Un jefe por mundo, con el juego `jefe-rueda`: cada ataque se responde marcando nudos de la rueda de ángulos.
// Ataque = [rótulo, nudos [[grados, anillo?]], por qué, opciones?].
const TRIG_BOSS = {
  ondas: { id: 'jefe-trig-ondas', title: 'El Guardián de las Ondas', name: 'el Guardián de las Ondas', kind: 'kraken',
    intro: ['Al cierre del mundo espera el **Guardián de las Ondas**. Cada ataque es un reto de ángulos, triángulos y ondas.', 'Marca en la rueda los ángulos que responden cada reto y ataca. No hay reloj: gana el que piensa.'],
    phases: [
      ['Fase 1 · Ángulos y arcos', [
        ['Marca el ángulo $\\tfrac{5\\pi}{4}$', [[225]], '$\\tfrac{5\\pi}{4} = 5 \\cdot 45^\\circ = 225^\\circ$'],
        ['Marca el coterminal de $-420^\\circ$', [[300]], '$-420^\\circ + 2 \\cdot 360^\\circ = 300^\\circ$'],
        ['Arco $s = 4\\pi$ con radio 3: marca el ángulo', [[240]], '$\\theta = \\tfrac{s}{r} = \\tfrac{4\\pi}{3}$, que son 240°', { rad: true }]]],
      ['Fase 2 · Triángulos y circunferencia', [
        ['$\\operatorname{sen}\\theta = \\tfrac12$: marca los dos ángulos', [[30], [150]], 'El seno es la altura del punto: vale ½ en 30° y en 150°'],
        ['$\\cos\\theta = -\\tfrac{\\sqrt2}{2}$: marca los dos ángulos', [[135], [225]], 'Coseno negativo: a la izquierda, con referencia 45°'],
        ['$\\tan\\theta = \\sqrt3$ con $\\operatorname{sen}\\theta < 0$', [[240]], 'Referencia 60° y seno negativo: cuadrante III']]],
      ['Fase 3 · Signos y ondas', [
        ['Referencia $60^\\circ$ en el cuadrante IV', [[300]], '$360^\\circ - 60^\\circ = 300^\\circ$'],
        ['$y = 3\\operatorname{sen} x$: marca dónde está su cresta', [[90]], 'La cresta del seno está en 90°; el 3 solo la hace más alta'],
        ['$y = \\cos 2x$ vale 1: marca todos los $x$', [[0], [180]], 'Su periodo es $\\pi$: se repite cada 180°'],
        ['$\\tan x$ no existe: marca dónde', [[90], [270]], 'Donde el coseno vale 0 están las asíntotas']]],
    ] },
  inversas: { id: 'jefe-trig-inversas', title: 'El Vigía de los Ángulos', name: 'el Vigía de los Ángulos', kind: 'faro',
    intro: ['Al cierre del mundo vigila el **Vigía de los Ángulos** desde su torre. Su luz esconde inversas, identidades, ecuaciones y triángulos.', 'Marca en la rueda todos los ángulos que responden cada reto, y solo esos. Luego ataca.'],
    phases: [
      ['Fase 1 · Inversas e identidades', [
        ['Marca el lado terminal de $\\operatorname{sen}^{-1}\\left(-\\tfrac{\\sqrt3}{2}\\right)$', [[300]], 'Su valor es −60° (el rango va de −90° a 90°): ese lado es el de 300°'],
        ['Marca el valor de $\\cos^{-1}\\left(-\\tfrac12\\right)$', [[120]], 'El coseno inverso responde entre 0° y 180°: 120°'],
        ['$\\operatorname{sen}^2\\theta = \\tfrac34$: marca los cuatro ángulos', [[60], [120], [240], [300]], 'El seno vale más o menos $\\tfrac{\\sqrt3}{2}$: referencia 60° en los cuatro cuadrantes']]],
      ['Fase 2 · Suma, doble y ecuaciones', [
        ['$\\operatorname{sen} 2\\theta = -1$: marca los $\\theta$ de una vuelta', [[135], [315]], '$2\\theta$ es 270° o 630°: la mitad da 135° y 315°'],
        ['Resuelve $2\\cos^2\\theta - \\cos\\theta - 1 = 0$', [[0], [120], [240]], 'Se factoriza: $(2\\cos\\theta + 1)(\\cos\\theta - 1) = 0$'],
        ['Marca $\\theta$ si $\\operatorname{sen}(\\theta + 30^\\circ) = 1$', [[60]], 'El seno vale 1 en 90°: $\\theta + 30^\\circ = 90^\\circ$']]],
      ['Fase 3 · Triángulos sin ángulo recto', [
        ['En un triángulo, $\\operatorname{sen} B = \\tfrac{\\sqrt3}{2}$: marca los $B$ posibles', [[60], [120]], 'El caso ambiguo: un ángulo y su suplemento'],
        ['En un triángulo, $\\cos C = -\\tfrac12$: marca $C$', [[120]], 'Un ángulo de triángulo no pasa de 180°: solo 120°'],
        ['Área $\\tfrac12 \\cdot 4 \\cdot 6 \\operatorname{sen} C = 6$: marca los $C$', [[30], [150]], 'El seno de C vale ½: 30° y 150° dan la misma altura']]],
    ] },
  polar: { id: 'jefe-trig-polar', title: 'La Nebulosa Polar', name: 'la Nebulosa Polar', kind: 'nebulosa', rings: ['1', '2', '4', '8'],
    intro: ['Al cierre del mundo gira la **Nebulosa Polar**. Solo la detienen los complejos puestos en su lugar exacto del plano.', 'Cada anillo es un módulo (1, 2, 4 y 8) y cada radio, un ángulo. Marca los puntos pedidos y ataca.'],
    phases: [
      ['Fase 1 · Forma polar', [
        ['Marca $z = 2i$', [[90, 1]], 'Módulo 2 sobre el eje imaginario: ángulo de 90°'],
        ['Marca $z = -1 - \\sqrt3\\,i$', [[240, 1]], 'Módulo 2 y tercer cuadrante: 180° + 60°'],
        ['Marca el conjugado de $4\\,\\mathrm{cis}\\,330^\\circ$', [[30, 2]], 'El conjugado cambia el signo del ángulo: −330° es 30°']]],
      ['Fase 2 · Producto, cociente y potencia', [
        ['Marca el producto $(2\\,\\mathrm{cis}\\,60^\\circ)(4\\,\\mathrm{cis}\\,90^\\circ)$', [[150, 3]], 'Los módulos se multiplican (8) y los ángulos se suman (150°)'],
        ['Marca el cociente $\\tfrac{8\\,\\mathrm{cis}\\,30^\\circ}{2\\,\\mathrm{cis}\\,120^\\circ}$', [[270, 2]], 'Módulos: 8 ÷ 2 = 4. Ángulos: 30° − 120° = −90°, que es 270°'],
        ['Marca la potencia $(2\\,\\mathrm{cis}\\,150^\\circ)^3$', [[90, 3]], 'Módulo 2³ = 8 y ángulo 3 · 150° = 450°, que es 90°']]],
      ['Fase 3 · Raíces', [
        ['Raíces cuadradas de $4\\,\\mathrm{cis}\\,120^\\circ$', [[60, 1], [240, 1]], 'Módulo 2; ángulos 60° y media vuelta más'],
        ['Raíces cúbicas de $-8$', [[60, 1], [180, 1], [300, 1]], '−8 está en 180°: módulo 2 y una raíz cada 120°'],
        ['Raíces cuartas de $16$', [[0, 1], [90, 1], [180, 1], [270, 1]], 'Módulo 2 y una cada 90°: 2, 2i, −2 y −2i']]],
    ] },
};
for (const u of COURSE_TRIG.units) {
  const b = TRIG_BOSS[u.world];
  if (!b) continue;
  u.boss = { id: b.id, title: b.title,
    clip: { scenes: [sc(5, b.intro[0], { title: 'Jefe final' }), sc(5, b.intro[1], { steps: b.phases.map(f => f[0]) })] },
    ex: [play('jefe-rueda', `Vence ${('a ' + b.name).replace(/^a el /, 'al ')}: marca en la rueda los puntos que responden cada reto y toca «¡Atacar!»`,
      { name: b.name, kind: b.kind, rounds: b.phases.map(([title, attacks]) => ({ title, items: attacks.map(([say, targets, why, o]) => ({ say, targets, why, ...(b.rings ? { rings: b.rings } : {}), ...o })) })) },
      'Cada reto del jefe se responde con ángulos de la rueda. Algunos tienen una sola respuesta y otros varias: hay que marcarlas todas y solo esas.',
      { hint: 'Resuelve el reto antes de tocar: decide cuántas respuestas tiene y en qué cuadrantes caen. Los nudos van de 15° en 15° (o de 30° en 30° cuando hay anillos); una marca mal puesta se quita tocándola otra vez.' })] };
}
