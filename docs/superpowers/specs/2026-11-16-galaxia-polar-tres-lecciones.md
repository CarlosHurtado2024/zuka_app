# Galaxia Polar en tres lecciones

## Pedido

«Acomoda la estructura del mundo Galaxia Polar de Trigonometría, porque le hace falta una lección; organiza bien este mundo.»

## Antes

Dos lecciones: `trig-151` (forma polar) y `trig-152` «Producto, cociente y raíces: De Moivre», que mezclaba potencias y raíces
y metía el video de raíces como parte 2 (`more` con `after: 3`). Era la única lección del curso con dos temas y dos videos, y
la de raíces no tenía nodo propio en el camino.

## Ahora (el orden del libro UdeA §15.1–15.2)

| Lección | Ejercicios (el último es el juego propio) | Video zoom |
|---|---|---|
| `trig-151` Forma trigonométrica de un complejo | sin cambios | `polar` |
| `trig-152` Producto, cociente y potencias: De Moivre | telaraña del producto (3 rondas), telaraña del cociente (3), espiral de potencias, (−1 + i)⁴ (escala de pasos), **`multiplicador-oculto`** | `demoivre` |
| `trig-153` Raíces n-ésimas de un complejo (nueva) | flor de raíces (cuartas, cúbicas), flor (cuadradas, quintas, sextas), espiral «comprueba la raíz», raíces cúbicas de 8i (arma la cuenta), **`hermanas-raiz`** | `raices` |

- `trig-152` ya no tiene `more`; las escenas de respaldo de raíces pasan a `trig-153` (x³ = 1, De Moivre al revés y el
  polígono regular).
- Juego nuevo `multiplicador-oculto` (questGame): una banderita y su imagen después de multiplicarla por w (una o dos veces);
  se toca w en una telaraña de módulos ½, 1, 1.5, 2 y ángulos cada 30°. Enseña que multiplicar es girar y estirar, y con
  w² aparecen las dos raíces cuadradas (a media vuelta): el puente hacia la lección de raíces.
- `sin-escribir`: `trig-152#2` → `trig-152#3` y `trig-152#4` → `trig-153#3`.
- El resumen en PDF (`docs/resumenes/tex/polar.tex`) tiene ahora el nivel 3-3; el progreso guardado no se pierde (los ids
  viejos siguen).

## Pruebas

`tests/trig-juegos.test.js` (20 lecciones, 20 juegos propios distintos, w² con dos respuestas),
`tests/contenido-trig-unidad3.test.js` (las tres lecciones, sin `more`), `tests/estructura.test.js` (trig-153 con escenas y
cinco ejercicios), `tests/trig-zoom.test.js` (`raices` es el video de `trig-153`) y `tests/resumenes.test.js` (nivel 3-3).
Robot `tests/robot-trig.js`: los 24 juegos questGame de Trigonometría se resuelven.
