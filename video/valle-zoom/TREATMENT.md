# Valle de los Números en zoom · tratamiento

Videos de las lecciones 2 a 6 del mundo **Valle de los Números** en el estilo **Scale Zoom Explainer** de Lemo-Opuscar, el
mismo del video de la lección 1 (`video/naturales-zoom`, ya en Bunny): dibujo plano sobre azul noche, un solo zoom continuo
que entra por un objeto de cada parada a la siguiente, y la guía con lente (Orbi) que señala la «próxima parada».

- **Formato:** vertical 1080×1920, 24 fps, sin voz. La narración va en `<nombre>.srt` y `<nombre>_narracion.txt`.
- **Un solo proyecto:** `index.html?f=<nombre>` carga `films/<nombre>.js`. El motor es `zoomkit.js` (el de la lección 1,
  ampliado con fracciones verticales `{fr: [n, d]}`, decimales con rayita `{ov: '18'}` y los signos ℚ, ℝ, 𝕀, ∀ y ⇒ dibujados
  en código, porque Jost no los trae) y `valle.js` (recta numérica, saltos, panes, personas, fichas con fracción).
- **Construir:** `sh video/valle-zoom/build.sh [nombre …]` (unos 5 min por video con 2 trabajadores). Cada uno queda en
  `out/<nombre>/` con el mp4, el `.srt`, la narración, `readcheck.txt` (cada texto alcanza a leerse) y `poster.jpg`.

| Video | Lección | Paradas (cada una sale de un objeto de la anterior) |
|---|---|---|
| `racionales` (128 s) | `alg-11b` | repartir 3 panes entre 4 → dentro de 3/4: numerador, denominador, ℚ, b ≠ 0 → dentro de 1/2: equivalentes y bolsas ℕ ⊆ ℤ ⊆ ℚ → dentro de 3/4: 0.75 termina, 0.1818… se repite, 0.777… = 7/9 |
| `reales` (138 s) | `alg-11c` | dos cuadritos que se cortan y forman uno de área 2 → por su lado: acorralar √2 → por π: la rueda de un metro → dentro de la rueda: el mapa ℝ = ℚ ∪ 𝕀 → por √3: la recta real y la cámara que se acerca entre 1 y 2 |
| `campo` (129 s) | `alg-12b` | el alfil y las reglas del juego, ∀, cerradura → por el «+»: conmutativa (dulces, cuadrícula que gira), asociativa → por el 0: neutros, opuestos y recíprocos que se funden → por el jardín: distributiva |
| `consecuencias` (141 s) | `alg-12c` | 9 − 4 en la recta y el ascensor 3 − (−6) → por el ÷: 12 ÷ 3, voltear la fracción, cero dulces → por (−)(−): la tabla del 3 y el espejo → por la balanza: cancelar y producto cero |
| `orden` (124 s) | `alg-12d` | positivos y tricotomía → por el «<»: comparar, los cuatro signos, Ana, Beto y Caro → por «· (−1)»: sumar y multiplicar conservan, el negativo voltea → por \|−6\|: valor absoluto, distancia, \|x − 1\| ≤ 2 |

## La mejora frente a las versiones anteriores

- Cada idea nace de un objeto de la parada anterior (la fracción del reparto, el lado del cuadrado, la rueda, la balanza),
  así se ve que todo es un mismo camino y no tarjetas sueltas.
- Más movimiento con sentido: los cuartos de pan vuelan a cada amigo, los triángulos se recolocan, la rueda rueda y deja
  la huella de π, las fichas opuestas se funden en 0, la balanza suelta los sietes, los puntos saltan al reflejo.
- Cierre con un resumen de una idea por parada y la cinta de paradas siempre visible.

## Ejemplos

Son los mismos de los videos actuales de cada lección (y de las versiones en lápiz de `video/valle-sketch`), así las
escenas de respaldo siguen valiendo. `tests/sistemas-numericos.test.js` y `tests/axiomas-desde-cero.test.js` comprueban que
no salgan en los ejercicios.

## Entrega

Cada video espera su ID de Bunny. Al recibirlo: `clip.bunny` + la `duration` que reporte Bunny en la lección
(`alg-11b`, `alg-11c`, `alg-12b`, `alg-12c`, `alg-12d`).

# Mercado de las razones en zoom · lecciones 1 a 6

Mismo proyecto y motor. El mundo «Razones, proporciones y porcentajes» se cuenta como un mercado: Ana, Beto y Caro
atienden puestos y compran, y cada video empieza con un problema de uno de ellos y termina respondiéndolo (guía de
narración en `docs/storytelling-videos.md`, sacada de los libros de storytelling que pasó el usuario).

| Video | Lección | El problema → la sorpresa → la respuesta |
|---|---|---|
| `razones` | `alg-12` | Ana presume que tiene «más» cromos → sumar 3 a la foto del puesto la estira → no tiene 8 más: tiene el triple |
| `proporciones` | `alg-12e` | Ana quiere más pan sin que cambie el sabor → el taxi no es ni directo ni inverso → sus razones son iguales: proporción |
| `reglatres` | `alg-12f` | Beto vende 7 kg de arroz → hacer directa la inversa da 22.5 días → tabla, decide, resuelve, revisa |
| `porcentajes` | `alg-13` | todos los letreros dicen «%» → hay porcentajes de más de 100 y de menos de 1 → «de cada 100» |
| `aumentos` | `alg-13c` | Caro compra con descuento e IVA → quitar el 19 % al precio con IVA está mal → todo porcentaje es un factor |
| `sucesivos` | `alg-13d` | Beto cree que ahorró el 30 % → +50 % y −50 % no vuelve a 100 → ahorró el 28 %: los cambios se multiplican |

# Torres de Potencias en zoom · lecciones 1 a 4

Mismo proyecto y motor; `zoomkit.js` suma el token `{rad: '72', idx: '3'}` (raíz dibujada con su índice) y `valle.js` la
ficha `fchip` con una fórmula adentro. Estas lecciones no tenían video en Bunny, así que los ejemplos son nuevos y no salen en
los ejercicios.

| Video | Lección | El problema → la sorpresa → la respuesta |
|---|---|---|
| `potencias` | `alg-21a` | Caro cuenta un secreto en la torre: ¿cuántos lo saben en 4 días? → 3⁰ = 1, no 0 → 81 = 3⁴, y el día cero solo Caro: 3⁰ = 1 |
| `leyes` | `alg-21b` | Beto se cansa de escribir doses → (1 + 2)² no es 1² + 2² → cada ley es un atajo; 1.5 × 10⁸ en un renglón |
| `raices` | `alg-22a` | Ana quiere cercar un terreno de 25 m² → por la diagonal 10, rodeando 14 → compra 20 m de cerca |
| `radicales` | `alg-22b` | Beto construye sin calculadora: dividir entre 1.414… a mano → multiplicar por un uno disfrazado → 6√2 y divide sin sufrir |

# Escalera de Sigma en zoom · lecciones 1 a 5

Mismo proyecto y motor; `zoomkit.js` suma los tokens `{big: 'sum' | 'prod', hi, lo}` (Σ y Π dibujadas con sus límites,
porque Jost no trae esas letras) y `{sub: 'n'}` (subíndice). Los ejemplos son los de las escenas de respaldo de cada lección
más algunos nuevos; `tests/sigma-zoom.test.js` comprueba que no salgan en los ejercicios y que la narración vaya a un ritmo
legible.

| Video | Lección | El problema → la sorpresa → la respuesta |
|---|---|---|
| `sucesiones` | `alg-14` | Caro echa 4 monedas por semana a una alcancía que empezó con 7: ¿cuántas en la semana 20? → 20 semanas son 19 saltos → 7 + 19 · 4 = 83 |
| `sumaarit` | `alg-14b` | el maestro manda sumar del 1 al 100 → cada columna suma 101, pero hay que sacar la mitad → dos escaleras forman un rectángulo: 5 050 |
| `geometricas` | `alg-14c` | Ana dobla una hoja de 0.1 mm: ¿cuántos dobleces hasta la Luna? → 7 términos son 6 multiplicaciones → 42 dobleces, 0.1 mm · 2⁴² ≈ 440 000 km |
| `sumageo` | `alg-14d` | Caro come cada día la mitad de lo que queda de su chocolate: ¿se lo acaba? → infinitos pedazos suman algo finito → nunca, pero en total come una barra |
| `sumatoria` | `alg-15` | Beto quiere escribir la suma de los cien primeros cuadrados y la pizarra no alcanza → Σ 4 de 1 a 6 da 24, no 4 → un renglón, Σ k² = 338 350 |

# Taller de los Bloques en zoom · lecciones 1 a 4

Mismo proyecto y motor; `valle.js` suma los bloques algebraicos `blk` (cuadrado x², barra x, cubito 1; coral = negativo) y
`cube` (x³ en perspectiva). Las escenas de respaldo de estas lecciones repiten ejemplos de sus ejercicios, así que los videos
usan ejemplos nuevos; `tests/bloques-zoom.test.js` comprueba que no salgan en los ejercicios, el ritmo de la narración y el
cierre.

| Video | Lección | El problema → la sorpresa → la respuesta |
|---|---|---|
| `polinomios` | `alg-23a` | Caro quiere anotar su caja de bloques sin dibujarla → con x = 10 la caja es un número conocido → 2x² + 3x + 4 se lee 234 |
| `notables` | `alg-3` | Beto agranda 4 por lado su mesa de lado x y cree que el área crece 16 → le faltan dos tablas de 4x → crece 8x + 16 |
| `binomio` | `alg-24c` | Ana debe desarrollar (a + b)⁴: 16 productos → la fila 1, 4, 6, 4, 1 suma 16 → cinco términos contados por el triángulo |
| `factorizacion` | `alg-24b` | Caro quiere armar un rectángulo con su montón x² + 5x + 6 → con 7 cubitos sobra uno → (x + 2)(x + 3) |
