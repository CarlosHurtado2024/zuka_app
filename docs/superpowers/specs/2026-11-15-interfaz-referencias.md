# Interfaz: retoques tomados de las referencias (2026-11-15)

El usuario pasó capturas de una app de referencia (inicio con tarjeta «Start», píldoras arriba, hoja de racha con la
semana, panel de «Correct!», menú con píldora en la pestaña activa) para que Zuka se vea más profesional y sea más
fácil de usar. No se copia su diseño: se toman las ideas que mejoran la usabilidad y se conservan la paleta, los botones
«físicos» y el mapa de mundos de Zuka.

## Qué cambia

1. **Barra de arriba** (`renderTop`): racha, XP y vidas son píldoras con borde (`.tb-stat`). La racha es un botón que
   abre la **hoja de racha** (`openStreakSheet`): número grande, los 7 días de la semana (lunes a domingo) con los días
   de la racha encendidos y hoy marcado, y dos datos: racha máxima (`S.maxStreak`, nuevo) y lecciones completadas.
   `streakWeek(lastDay, streak, now)` (pura, en `js/ui.js`) calcula los 7 días.
2. **Inicio** (`renderLearn`): tarjeta **«Sigue aquí»** (`.next-card`) debajo del curso: mundo y nivel de la lección que
   toca, su título, la que viene después (atenuada) y un botón grande que la abre de un toque (`startLesson`), sin pasar
   por mundo → nivel → hoja. Con el curso completo no aparece.
3. **Menú inferior**: la pestaña activa lleva una píldora detrás del icono y la etiqueta en tinta.
4. **Botones** (`.btn`): texto en minúsculas normales, 16 px, sin espaciado de letras.
5. **Retroalimentación** (`.feedback`): esquinas de arriba redondeadas y un icono redondo junto al título.
6. **Tarjeta del mundo** (`renderWorld`): renglón con cuántas lecciones y ejercicios tiene.

## Reglas

- Tema claro y oscuro; 320–380 px de ancho sin que la barra de arriba se parta en dos renglones.
- Nada de reloj ni presión: la hoja de racha solo informa.
- Pruebas: `tests/interfaz.test.js`.
