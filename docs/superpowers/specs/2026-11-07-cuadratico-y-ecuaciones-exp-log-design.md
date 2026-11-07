# Lecciones nuevas: polinomio cuadrático (clase 10) y ecuaciones exponenciales y logarítmicas (clase 19)

Cierra los dos huecos de Álgebra que dejó `2026-11-07-cronograma-algebra-calculo-design.md`.

## alg-4a · Polinomio cuadrático y parábola (unidad 5, entre `alg-1` y `alg-4`)

Escenas de respaldo, de la intuición a la fórmula: la parábola $y = x^2$ y sus movimientos;
completar el cuadrado con fichas ($x^2 + 4x$ pide 4 cuadritos: $(x + 2)^2 - 4$); forma canónica
$a(x - h)^2 + k$ con vértice $(h, k)$ y eje $x = h$; $h = -\tfrac{b}{2a}$, máximo o mínimo según el signo
de $a$. Ejemplos del video: $x^2 + 4x$, $y = x^2 - 6x + 5$, $y = -2x^2 + 4x + 1$ (no se repiten en los
ejercicios). Video manimgl pendiente.

Ejercicios (todos con pista):
1. **`completa-cuadrado`** (juego nuevo). Fichas de álgebra: el cuadrado $x^2$, las tiras de $bx$ partidas
   a la derecha y abajo, y en la esquina un hueco de $(b/2)^2$ celdas. Las $c$ unidades de la expresión
   esperan en una bandeja; con − / + se pasan unidades a la esquina (si la bandeja se vacía, se piden
   prestadas y se ven en rojo). Cuando la esquina está llena aparece $(x + b/2)^2 \pm$ resto.
   Rondas $x^2 + 6x + 5$, $x^2 + 8x + 20$, $x^2 + 2x + 1$… `state = { placed: [n] }`, correcto si
   `placed[i] = (b/2)^2`.
2. **`mueve-parabola`** (juego nuevo). Una parábola en una cuadrícula; se arrastra el vértice (salta a
   puntos enteros) y con − / + se cambia $a$ (pasos de 0.5, sin el 0) hasta que coincida con la de la
   ecuación en forma estándar que se muestra. `state = { vals: [{ a, h, k }] }`.
3. `une-parejas`: forma estándar ↔ forma canónica.
4. `num`: altura máxima de un lanzamiento.
5. `num`: dos números que suman 30 con producto máximo.

## alg-73 · Ecuaciones exponenciales y logarítmicas (unidad 8, después de `alg-72`)

Escenas: igualar bases; tomar logaritmos cuando no se puede; juntar logaritmos y pasar a forma
exponencial; comprobar el dominio (soluciones extrañas). Ejemplos del video: $2^{x+3} = 4^{x}$,
$5^x = 12$, $\log_6 x + \log_6(x + 5) = 2$. Video manimgl pendiente.

Ejercicios:
1. **`balanza-exponencial`** (juego nuevo). Una balanza con un lado de la ecuación en cada platillo; con
   − / + (o arrastrando el cursor) se cambia $x$ y cada platillo muestra su valor. El brazo se inclina hacia
   el lado mayor y se nivela cuando son iguales. Si un logaritmo no existe para ese $x$, el platillo dice
   «no existe» y el brazo se pone rojo: así se ve por qué una solución extraña no sirve.
   `params = { rounds: [{ tex, L, R, x, min, max, step }] }` (`L`, `R` funciones), `state = { xs: [x] }`.
   Una ronda de exponenciales y otra de logaritmos (dos ejercicios).
2. `ordena-terminos` (`sep: '⇒'`): pasos para resolver $3 \cdot 2^{x} - 5 = 43$.
3. `num`: $4^x = 30$ con logaritmos.
4. `num`: tiempo para duplicar un capital con interés continuo.

## Pruebas

- `tests/juegos-cuadratico-exp.test.js`: `grade` de los tres juegos (aciertos, fallos, solución) y sus
  funciones puras (`texOf`, `same`, `tilt`).
- `tests/contenido-cuadratico-exp.test.js`: ubicación de las lecciones, sin opción múltiple, mayoría juegos,
  pistas que no regalan la respuesta, rondas alcanzables con los controles, respuestas `num` correctas y
  que los ejercicios no repitan los ejemplos del video.
