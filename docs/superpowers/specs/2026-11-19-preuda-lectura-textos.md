# Comprensión lectora: una lección, un texto de verdad

Fecha: 2026-11-19. Primera entrega de la estrategia `2026-11-19-preuda-estrategia-examen` (sección 8, paso 1).
Pruebas: `tests/preuda-lectura.test.js`.

## Problema

Lectura vale la mitad del examen y hoy tiene 66 ejercicios (2 por lección), casi todos `subraya-texto` sobre fragmentos de
tres o cuatro oraciones, más `escala-solucion` y `ordena-terminos`, que el estándar ya descartó. El examen pide sostener la
atención en textos de 600 a 800 palabras y volver al párrafo veinte veces.

## Diseño

### La lección
- Cada lección trabaja **un texto original de 330 a 560 palabras, de 4 a 7 párrafos numerados**, el mismo en sus 7 ejercicios.
- Los 7 ejercicios son **juegos distintos**, de arrastrar, sin reloj, con pista y explicación. Los primeros entrenan la destreza
  de la lección; los demás repasan, sobre el mismo texto, los otros tipos de pregunta del examen (práctica intercalada).
- En lectura no se exige juego en movimiento al final (la regla vale para razonamiento, Álgebra y Trigonometría): nada debe
  apurar la lectura.
- El texto se ve arriba de cada ejercicio en un panel con los párrafos numerados (`.lec-doc`), plegable y con desplazamiento
  propio, para no perder el juego en un celular de 320 px.

### La evaluación del mundo (formato real)
- Un texto nuevo y preguntas en el **formato del examen**: enunciado, cuatro opciones A–D, con «EXCEPTO», «alude a», «la palabra
  subrayada significa», «el párrafo cumple la función de». Juego `pregunta-examen` (tocar una opción; es el único de opción
  múltiple y solo va en evaluaciones y entrenamiento, nunca en lecciones). Al menos dos preguntas por lección del mundo.

### Kit `LEC` (`js/games/lectura-kit.js`, HTML, va después de `kit.js`)
- `LEC.doc(doc)`: panel del texto. `doc = { id, title, ficha?: { autor, fuente, fecha }, paras: [...] }`.
- `LEC.drop(name, def)`: fábrica de juegos de **fichas que se arrastran a zonas**. Arrastre con el dedo o el ratón; también tocar
  la ficha y luego la zona, y con teclado (Enter). Una zona de cupo 1 que ya tiene ficha la devuelve a la bandeja.
  `def.norm(params)` convierte los datos de la lección en rondas `{ ask, chips, zones, key }`, donde `key[c]` es la zona (o
  lista de zonas) válida para la ficha `c`, o `null` si la ficha sobra. `def.scene` dibuja la reacción en vivo (la balanza que
  se inclina, el esqueleto del texto que se arma, la oración con la palabra puesta), sin decir si va bien.
- Estado: `{ rounds: [{ place: [zona o -1 por ficha] }] }`. `grade` es pura.

### Juegos (16)
| Juego | Destreza | Datos |
|---|---|---|
| `anticipa-texto` | Prelectura: tema, propósito y tipo desde la ficha, antes de abrir el texto | `slots: [[rótulo, [opciones], correcta]]` |
| `mapa-del-texto` | Función de cada párrafo | `labels, key[párrafo]` |
| `resume-parrafo` | Idea central de cada párrafo | `paras, options, key` |
| `donde-buscar` | Ubicar: a qué párrafo se vuelve para responder | `cards: [[pregunta, [párrafos]]]` |
| `lupa-evidencia` | Lo dice, se deduce, no lo dice | `cards: [[afirmación, 0/1/2]]` |
| `intruso-excepto` | Preguntas EXCEPTO | `ask, cards: [[opción, [párrafos] o null]]` |
| `palabra-a-la-medida` | Vocabulario en contexto | `rounds: [{ p, before, after, options, answer }]` |
| `hilo-referente` | Referentes | `rounds: [{ p, text: 'a\|b\|c', from, answer }]` (los trozos unidos están en el párrafo) |
| `conector-bisagra` | Conectores | `rounds: [{ a, b, options, answer }]` |
| `signos-que-hablan` | Función de comillas, rayas, dos puntos | `rounds: [{ text: 'antes\|signo\|después', options, answer }]` |
| `quien-lo-dice` | Voces | `voices, cards: [[cita, voz]]` |
| `balanza-argumento` | Tesis, apoyo y objeción | `thesis, cards: [[oración, 0 apoya / 1 debilita / null]]` |
| `termometro-tono` | Tono e intención | `rounds: [{ frag, scale, answer }]` (aguja sobre un dial) |
| `caso-nuevo` | Aplicación a un caso nuevo | `principle, cards: [[situación, sí/no]]` |
| `puente-dos-textos` | Comparar dos textos | `docs: [A, B], cards: [[idea, 0 Uno / 1 ambos / 2 Dos]]` |
| `pregunta-examen` | Formato real (solo evaluaciones) | `doc, q, options, answer` |

### Archivos
- `js/courses/preuda-l-<mundo>.js`: textos y ejercicios de un mundo con `PU_LEC_JUEGOS.push(({ setLesson, setExam }) => …)`.
- `js/courses/preuda-lectura-juegos.js`: aplica los mundos y lista `PU_LEC_HECHOS`; va después de los `preuda-l-*` y antes de
  `preuda.js`.

## Estado
- Hecho: kit, 16 juegos, mundo 1 «Estrategias de lectura» (`preuda-l-estrategias.js`: ruido urbano, tienda de barrio,
  volcanes; evaluación con bibliotecas móviles) y mundo 2 «Tipos de texto y géneros» (`preuda-l-tipos.js`: crónica del río,
  entrevista a un lutier, testimonio de alfabetización; evaluación con una columna sobre las chivas).
- Siguen los otros 10 mundos, uno por uno, con el mismo estándar (la prueba se lo exige a todo mundo de `PU_LEC_HECHOS`).
  Cuando bajen los ejercicios de `subraya-texto`, ajustar el mínimo de `tests/preuda.test.js`.
