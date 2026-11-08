# Cálculo diferencial · Unidad 1: desigualdades, valor absoluto y la recta

Cronograma 2026-2 de Cálculo diferencial, clases 1–3. Material guía: *Elementos básicos de cálculo
diferencial* (Jesús del Valle Sierra, U de A), módulos 1 (números reales, orden, intervalos, valor absoluto,
inecuaciones) y 2 (distancia, punto que divide un segmento, pendiente, formas de la recta, paralelas y
perpendiculares); Stewart, *Cálculo, conceptos y contextos*, apéndices de desigualdades y geometría
analítica. Los talleres de la UNAL empiezan en funciones (unidad 2).

## Decisiones

- Cuatro lecciones, una por video. La clase 3 (plano y recta) se parte en dos videos para que ninguno pase
  de ~5 minutos. Se conservan los ids `alg-32`, `alg-26c`, `alg-51` (progreso guardado) y se agrega
  `calc-recta`.
- Videos con la plantilla de Trigonometría (fondo azul degradado `fondo_trig.png`, `zoom_to` /
  `zoom_reset` de la cámara de manimgl), etiqueta «Cálculo · Clase C1…C4». Intuición primero, fórmula
  después, sin voz ni preguntas al espectador. Cada video abre con una situación (la montaña rusa con
  estatura mínima, el perro con correa, la tirolesa, la rampa).
- Ejercicios: sin opción múltiple, mayoría juegos, todos con pista. Nueve juegos nuevos, cada uno con una
  mecánica distinta (tabla que se pinta, sombras que se comparan, correa que se estira, candado de
  ruedas, cable que cuelga, balancín con pesos, cuerdas en un riel, láser con perillas, riel que gira). Se
  reutilizan `dibuja-intervalo`, `distancia-justa` y `ordena-terminos`.
- Todos los juegos leen `api.palette` al dibujar (tema claro y oscuro) y caben en 300–380 px.

## Lecciones

### C1 · `alg-32` «Orden, intervalos e inecuaciones»
Video: tricotomía y reglas de orden (sumar conserva, multiplicar por negativo voltea: zoom a la recta que
se refleja), intervalos y su dibujo, inecuación lineal $3 - 2x \le x + 9$, tabla de signos de
$(x - 2)(x + 1) \ge 0$ y de $\tfrac{x + 3}{x - 1} < 0$ (zoom a la fila del producto).
1. **`sombra-equivalente`**: fichas de operación (sumar, restar, multiplicar o dividir los dos lados) y el
   signo de desigualdad, que se voltea tocándolo. Sobre la recta, la sombra de la desigualdad original y la
   de la actual: si se olvida voltear, la sombra se va al otro lado y se pinta de rojo. Meta: dejar
   «x ⟂ número» equivalente a la original.
2. **`semaforo-signos`** (producto): tabla con una fila por factor y una columna por tramo; se toca cada
   casilla para poner + o −; la fila del producto se calcula sola; luego se encienden los tramos que forman
   la solución y se tocan los puntos críticos para incluirlos (lleno) o no (vacío).
3. **`semaforo-signos`** (cociente): igual, con un factor en el denominador (su punto nunca entra).
4. `dibuja-intervalo`: desigualdad doble $-5 < 3x + 1 \le 10$.
5. `num`: el mayor entero que cumple una inecuación.

### C2 · `alg-26c` «Desigualdades con valor absoluto»
Video: $|x|$ como distancia; $|x - a| < r$ como el perro amarrado a un poste en $a$ con correa $r$; el
gato a salvo, $|x - a| > r$; normalizar $|2x - 6| \le 4$; tolerancias de fábrica; desigualdad triangular.
1. **`correa-del-perro`**: se arrastra el poste (centro), se estira la correa (radio), se elige si la
   zona es donde el perro alcanza (adentro) o donde el gato está a salvo (afuera) y se tocan las puntas para
   incluirlas o no.
2. **`candado-absoluto`**: en la recta está dibujado un conjunto; se giran tres ruedas (centro, símbolo,
   radio) para escribir la desigualdad $|x - c| \;\square\; r$ que lo describe; el candado se abre.
3. `distancia-justa`: ecuación $|x - a| = d$ (dos soluciones).
4. `num`: tolerancia de una pieza.
5. `num`: producto de las soluciones de una ecuación con valor absoluto.

### C3 · `alg-51` «Plano cartesiano, distancia y punto medio»
Video: el plano como mapa (cuadrantes), distancia con Pitágoras (zoom al triángulo), punto medio como
promedio, punto que divide en una razón (balancín), equidistancia.
1. **`tirolesa`**: dos torres en el plano; se suelta cable con − / + o arrastrando el carrete. Si el cable
   es corto no llega, si sobra cuelga; con la medida justa queda tenso.
2. **`balancin`**: una tabla entre dos niños de pesos distintos; se mueve el apoyo por la tabla hasta que
   se equilibre (promedio ponderado: punto medio o punto que divide en una razón).
3. **`cuerdas-iguales`**: un punto se desliza por un eje (riel) con dos cuerdas a A y B; meta: cuerdas de
   igual largo.
4. `num`: perímetro de un triángulo. 5. `num`: un extremo conocido el punto medio.

### C4 · `calc-recta` «La recta: pendiente, ecuaciones, paralelas y perpendiculares»
Video: pendiente como inclinación de una rampa (subida/avance), las formas de la ecuación
(pendiente-intercepto, punto-pendiente, dos puntos, general), paralelas (misma pendiente) y
perpendiculares (producto −1, zoom al giro de 90°).
1. **`laser-recta`**: un láser $y = \tfrac{\text{sube}}{\text{avanza}}x + b$ con tres perillas; debe
   atravesar los dos cristales.
2. **`rieles-paralelos`**: una vía dada y una estación; se gira el riel nuevo alrededor de la estación
   (pendientes «bonitas» y la vertical) hasta que sea paralelo o perpendicular, según la ronda.
3. `ordena-terminos`: pasos para la recta por dos puntos.
4. `num`: intercepto con el eje $x$. 5. `num`: el valor de $k$ que hace perpendiculares dos rectas.

## Pruebas
- `tests/juegos-calculo-u1.test.js`: `grade` y funciones puras de los nueve juegos.
- `tests/contenido-calculo-u1.test.js`: orden de la unidad, sin opción múltiple, mayoría juegos, pistas
  que no regalan la respuesta, rondas alcanzables con los controles, respuestas `num` correctas, y que los
  ejercicios no repitan los ejemplos de los videos.
