# Axiomas de campo y orden desde cero (Álgebra, unidad 1)

Pedido: un video mejor sobre axiomas de campo y de orden y su notación, conectado con las lecciones de sistemas
numéricos (alg-11 naturales y enteros, alg-11b racionales, alg-11c irracionales y reales). Debe ser muy explicativo,
desde lo básico, con ejemplos ilustrativos, partido en varias partes si es largo y con ejercicios creativos tras
cada video. Sin zoom ni 3D.

## Partes

La lección `alg-12b` (id sin cambiar para no perder progreso) se parte en tres, en este orden dentro de la unidad
«Sistemas numéricos, razones y proporciones», justo después de `alg-11c`:

| Lección | Video | Carpeta | Contenido |
|---|---|---|---|
| `alg-12b` Axiomas de campo: las reglas de la suma y el producto | F1 | `video/clase_alg_u1_f1_campo` | qué es un axioma; notación ∀ a, b ∈ ℝ; cerradura (en ℝ no hay «fuga», a diferencia de ℕ, ℤ y 𝕀); conmutativa (puntos en filas, la resta no conmuta: 5 − 2 ≠ 2 − 5); asociativa (38 + 19 + 1, (7·5)·2); neutros 0 y 1; inversos: opuesto (espejo de N1) y recíproco (voltear la fracción de N2; el 0 no tiene); distributiva con rectángulo (3(4 + 2), 6·102); tabla final |
| `alg-12c` Consecuencias: restar, dividir y los signos | F2 | `video/clase_alg_u1_f2_consecuencias` | restar = sumar el opuesto (9 − 4, 3 − (−6)); dividir = multiplicar por el recíproco (12 ÷ 3, (2/5) ÷ (3/4)); por qué no se divide entre 0; a·0 = 0 (cajas vacías y la prueba con la distributiva); ley de signos con el patrón de la tabla del 3 y el espejo; cancelativa con balanza (7 + x = 7 + 2, 4x = 4·9; el 0 no se cancela: 0·2 = 0·5); producto cero |
| `alg-12d` Axiomas de orden y valor absoluto | F3 | `video/clase_alg_u1_f3_orden` | positivos ℝ⁺ y tricotomía; a < b si b − a es positivo (−5 < −2; √2 > 1.4 de N3); notación <, >, ≤, ≥; transitiva; sumar conserva, multiplicar por positivo conserva y por negativo voltea (espejo: 2 < 5 → −2 > −5); valor absoluto como distancia al 0 (|−6|, |√2 − 1.5|); distancia |b − a| (entre −4 y 3); intervalo de |x − 1| ≤ 2 = [−1, 3] |

Cada video ≈ 4–6 min, plantilla `mk_alg_class.py` (fondo morado vivo, mascota), escenas `MBScene` y `ExScene`,
intuición primero y fórmula después, sin preguntas al espectador.

## Ejercicios (todos juegos con pista; ninguno repite los ejemplos del video)

- `alg-12b`: `inversos-gemelos` opuestos (nuevo), `inversos-gemelos` recíprocos con el 0 «sin recíproco», `corta-rectangulo`
  (nuevo, distributiva), `atajo-axiomas` (rondas actuales), `num` 4·19·25 de cabeza.
- `alg-12c`: `arma-producto` (fichas nuevas), `cancela-balanza` (nuevo, ley cancelativa), `ordena-terminos` (pasos de
  la prueba de (−1)·a = −a), `num` (5/6) ÷ (10/9).
- `alg-12d`: `tren-ordenado` (nuevo, ordenar reales de N1–N3), `voltea-desigualdad`, `dobla-la-recta`, `distancia-justa`,
  `dibuja-intervalo` (los cuatro ya existían en la antigua `alg-12b`).

### Juegos nuevos

- **inversos-gemelos**: un número y una operación (+ o ×). El estudiante arma su «gemelo» con un botón de signo,
  ruedas de numerador y denominador y un interruptor √. La máquina muestra el resultado de la operación en vivo; la
  meta es el neutro (0 o 1). Si el número es 0 y la operación es ×, la respuesta es el botón «no tiene».
  `params = { op, rounds: [{ label, v }] }`, `state = { ans: [{ s, n, d, r, none }] }`.
- **corta-rectangulo**: un rectángulo h × w con cuadrícula; se arrastra un corte vertical (enteros) para que una pieza
  tenga el área pedida; se ven h·k + h·(w − k) = h·w. `params = { rounds: [{ h, w, piece }] }`, `state = { cuts }`.
- **cancela-balanza**: dos platillos con fichas sumadas (o multiplicadas). Tocar una ficha que también está al otro
  lado quita las dos (cancelativa); el 0 en un producto no se deja cancelar. Gana cuando a la izquierda queda solo x.
  `params = { rounds: [{ op, left, right }] }`, `state = { pairs: [[[i, j], …] por ronda] }`.
- **tren-ordenado**: vagones con números (enteros, fracciones, decimales, raíces, π); se arrastran para ordenarlos de
  menor a mayor. `params = { rounds: [{ items: [{ label, v }] }] }`, `state = { orders }`.

## Pruebas

`tests/axiomas-desde-cero.test.js`: grade de los cuatro juegos; orden de la unidad; cada lección con escenas,
pistas y sin opción múltiple; reparto de juegos por lección; ejemplos de los videos ausentes en los ejercicios;
rondas alcanzables con los controles (inversos dentro de los rangos de las ruedas, cortes enteros, balanzas que
terminan con x sola). Se ajustan `tests/juegos-axiomas.test.js`, `tests/estructura.test.js`, `tests/pistas.test.js` y
`tests/contenido-unidad1.test.js`.
