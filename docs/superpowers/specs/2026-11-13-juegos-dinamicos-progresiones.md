# Juegos dinámicos de Progresiones y sumatoria

Fecha: 2026-11-13. Sigue a `2026-11-13-juegos-dinamicos-razones.md` (misma base `makeArcade` y mismas reglas comunes).

## Decisión

Un juego como **último ejercicio** de cada lección del mundo. Cinco mecánicas que no se habían usado en los quince
juegos anteriores:

| Lección | Juego | Mecánica | Qué practica |
|---|---|---|---|
| `alg-14` Progresiones aritméticas | `traza-progresion` | **Trazar** un camino sin levantar el dedo por los números de la progresión, en orden, rodeando los que no son; una mecha quema el camino por detrás | hallar la diferencia y seguir la progresión (también con d negativo) |
| `alg-14b` Suma aritmética | `encesta-suma` | **Lanzar** un balón con un deslizón hacia la canasta que tiene la suma | suma de una progresión aritmética, de corrido y con la fórmula |
| `alg-14c` Progresiones geométricas | `dobla-fichas` | **Deslizar todo el tablero** y fundir fichas iguales (como 2048): cada ficha es un término de razón 2 | términos de una progresión geométrica: a₁, 2a₁, 4a₁… |
| `alg-14d` Suma geométrica e infinita | `rana-zenon` | **Tocar para saltar** (cada salto es el término siguiente) y luego **elegir la bandera** donde cae o a la que se acerca; una garza apura | sumas parciales y suma infinita |
| `alg-15` Sumatoria y productoria | `maquina-sigma` | **Arrastrar** fichas que pasan en una cinta hasta la máquina, en el orden de k | leer Σ y Π: qué términos se suman o multiplican y en qué orden |

Estado: `{ done: [n por ronda] }`. En `dobla-fichas` cada ronda vale 1 (llegar a la ficha meta) y solo hay una vida:
tablero lleno sin jugadas = la ronda empieza otra vez. En los demás: tres vidas por ronda, y dejar pasar no quita vida
(la mecha que alcanza el camino lo borra; la garza que alcanza a la rana devuelve la pregunta a la cola).

## Contenido

No repite los ejemplos de los videos (lista de `tests/progresiones-desde-cero.test.js`) ni usa coma decimal. `alg-15`
pasa de siete a ocho ejercicios (se ajusta `tests/leccion-sumatoria.test.js`).

## Pruebas

`tests/juegos-dinamicos-progresiones.test.js`: lógica pura de cada juego, estado inicial no ganador, contenido válido
(trampas que no son términos, sumas correctas, banderas con una sola correcta, términos de Σ calculados con su fórmula)
y que las cinco lecciones terminen con su juego. En el navegador, un robot los juega con `peek()`.
