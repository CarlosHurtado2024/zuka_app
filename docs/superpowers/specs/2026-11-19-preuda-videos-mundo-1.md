# Preuniversitario UdeA · Razonamiento lógico · Mundo 1: videos de las lecciones 2 a 4

Pedido del usuario (2026-11-19): crear los videos del curso preuniversitario, componente de razonamiento lógico, empezando
por el mundo 1 (Cálculo mental), usando como anexo los simulacros del curso virtual de la UdeA y los exámenes reales de
admisión (2023-2 a 2026-1, en `Documents/PreU`). Videos de unos 5 minutos, solo en 1080 con su `.srt`, visualmente
atractivos y con lenguaje sencillo.

La lección 1 (`pu-cm-1`, «Enteros») ya tenía su video (`enteros`). Se hacen las otras tres en el mismo proyecto
`video/preuda-cosmos` (mismo HUD lima, sin reloj ni barra abajo, 1080×1920 a 60 fps, sin voz):

| Película | Lección | Reto (pregunta real que se resuelve al final) | Otras preguntas reales |
|---|---|---|---|
| `fracciones` (292 s) | `pu-cm-2` | UdeA 2024-2: las tortas de Luis (1 torta = 60 % del resto → 2) | UdeA 2023-2: niñas y niños (1/7 y 1/5 → 22, probando opciones) |
| `porcentajes` (292 s) | `pu-cm-3` | UdeA 2025-2: los tenis de Carlos (−10 % y +10 % → 118 800) | UdeA 2026-1: la barra de chocolate (35 % = 70 g → 200 g); taller UdeA: 2019 cifras de 1/13 (9085); simulacro: −15 % y −20 % = −32 % |
| `potencias` (294 s) | `pu-cm-4` | UdeA 2024-2: María y 10¹⁰ − 51 (suma de cifras 85) | UdeA 2025-2: cartas 1 a 32 (Ana tomó 3); UdeA 2026-1: circunferencia +20 % → área +44 %; taller UdeA: 2²⁰¹⁹ ÷ 7 deja 1 |

Estructura de cada una (diez escenas): el reto con la tarjeta del examen (opciones A–D) → conceptos con intuición primero
(barras, tortas, cuadrícula de 100, cubitos, áreas) → una o dos preguntas reales resueltas en pantalla → el reto resuelto →
cierre con la opción correcta, resumen y tarjeta final. De la comprensión lectora se toma la nota «lo que dice → lo que
significa» (decir el enunciado con otras palabras), que aparece al leer las preguntas del examen. Los enunciados se
parafrasean.

Piezas nuevas en `preu.js`: `examCard` (pregunta real con etiqueta del año, opciones que se tachan y la correcta que se
enciende), `readNote`, `fbar` (barra en partes), `cake` (torta en porciones), `dots`, `stepsDown`. `tools_stills.sh
<película>` saca tres cuadros por escena y una hoja de contacto en `out/<película>/hoja.jpg`.

Las escenas de respaldo de `pu-cm-2`, `pu-cm-3` y `pu-cm-4` cuentan ahora lo mismo que sus videos. Pruebas:
`tests/preuda-videos-mundo-1.test.js` (duración, ritmo de lectura ≤ 3.4 palabras/s, sin preguntas al espectador, dos
tarjetas de examen por película, matemática de cada pregunta y que los ejemplos no se repitan en los ejercicios).
Entrega: `Downloads/Zuka_Preuniversitario` (mp4 1080 y `.srt`); esperan su ID de Bunny.

## Enteros en el mismo formato (pedido del usuario, 2026-11-19)

`enteros` (`pu-cm-1`) se rehízo con el mismo formato (294 s): reto real UdeA 2023-2 (Luisa, Juliana y Ana obtienen 33, 37
y 49 y fallaron por 5, 7 y 9 en algún orden; el correcto es 42 y la verdadera es «Juliana falló por 5», opción D) → la recta
→ la distancia `|a − b|` (escena nueva) → sumar → restar → pregunta real UdeA 2024-1 (los días como posiciones: ayer −1,
pasado mañana 2, el siguiente 3; el domingo queda en el día 0 o en el 6, y el 0 no es opción: hoy es lunes) → el menos da
la vuelta, con la regla de los signos (cantidad par o impar de menos) → las capas → el reto resuelto → cierre. Salen las
escenas «multiplicar» y «signos» (su idea queda en «vuelta»); `films/enteros.json` se borró (el guion es
`enteros.data.js`). Las escenas de respaldo de `pu-cm-1` cuentan el video nuevo.

## Sin mencionar el examen ni el taller (pedido del usuario, 2026-11-19)

Los problemas siguen saliendo de exámenes y talleres reales, pero **en los videos solo aparece el enunciado**: se quitó toda
mención al examen de admisión, al año, a la UdeA y al taller del preuniversitario (narración, rótulos, nombres de escena
del HUD, la etiqueta de la tarjeta, que ahora dice «RETO» en el problema del inicio y «PROBLEMA» en los demás, y «la opción
B del examen» del cierre). Las escenas de respaldo de `pu-cm-1` a `pu-cm-4` tampoco lo mencionan. Se volvieron a
renderizar los cuatro videos.
