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
