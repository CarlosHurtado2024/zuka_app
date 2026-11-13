# Los números naturales y enteros · tratamiento

Video de la lección `alg-11`, la primera del mundo **Valle de los Números**. Está hecho en el estilo **Scale Zoom
Explainer** de Lemo-Opuscar: dibujo plano sobre azul noche, un solo zoom continuo y una guía con lente que señala la
próxima parada.

- **Formato:** vertical 1080×1920, 24 fps, 118 s.
- **Sin voz.** La narración va en `naturales-zoom.srt` y en `narracion.txt`.

## La mejora frente a los videos anteriores

Antes cada idea vivía en su tarjeta. Aquí se baja por una sola cuerda, y cada parada sale de un hueco de la anterior:

| Nivel | Qué se ve | Cómo se entra al siguiente |
|---|---|---|
| 0 · contar | Tres manzanas y sus fichas 1, 2, 3, que forman la fila de los naturales. Luego 3 + 4 y 3 × 4: el resultado sigue en la fila. | Por la casilla vacía a la izquierda del 1, que es donde caería 2 − 5. |
| 1 · la resta | El termómetro baja de 2 °C a −3 °C. −3 ∉ ℕ. Nacen los enteros: la fila crece a la izquierda. | Por el 0 de esa fila. |
| 2 · el espejo | El 0 es un espejo en la recta: 4 y −4, a cuatro pasos cada uno. 4 + (−4) = 0 y −0 = 0. Para qué sirven: el mar y la deuda. | Por el 2, a la familia de los positivos. |
| 3 · familias | ℕ es un círculo dentro de ℤ. ℕ ⊆ ℤ, y ℤ − ℕ = {0, −1, −2, …}. | Termina en el resumen. |

## Ejemplos

Son los mismos del video actual de la lección: tres manzanas, 2 − 5 en el termómetro, el opuesto de 4, el mar (−10 m) y
la deuda. `tests/sistemas-numericos.test.js` comprueba que no salgan en los ejercicios.

## Motor

`zoomkit.js` viene de `video/conjunto-zoom-3`. Lo único nuevo es que dibuja ℕ y ℤ de doble trazo, porque Jost no las
trae.
