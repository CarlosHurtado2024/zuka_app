# Fórmulas con TeX en los juegos, las guías y las respuestas

Fecha: 2026-11-18. Pedido: que en los juegos, las tarjetas y las interfaces las ecuaciones y expresiones se escriban
con LaTeX/TeX y se vean más bonitas y legibles.

Los enunciados, pistas y explicaciones ya usaban KaTeX (`tex()` en `js/ui.js`). Lo que se veía mal era lo que se dibuja
en el lienzo de los juegos (p5.js): texto corrido con símbolos (`x²`, `3/4`, `√12`, `2^(x − 1)`), sin fracciones
apiladas ni raíces con barra. Tampoco usaban KaTeX las respuestas que devuelven los juegos ni las guías.

## Motor de fórmulas para el lienzo (`js/games/formula.js`)

- Dibuja en el propio lienzo, no con HTML encima: respeta el orden de las capas (carteles, fichas que se mueven),
  funciona igual en todos los navegadores y se encoge para caber en el ancho (y alto) que se le dé.
- Entiende un subconjunto de TeX: llaves, `^` y `_`, `\frac` / `\tfrac` / `\dfrac`, `\sqrt[n]{}`, `\text`,
  `\operatorname`, `\left` / `\right`, `\mathbb`, espacios (`\,` `\;` `\quad`), griegas y los símbolos de `TEX_SYM`.
  Lo que no entiende se dibuja como texto, sin romper nada.
- Tipografía de KaTeX (`KaTeX_Main`, `KaTeX_Math` en cursiva para las variables) cuando ya cargó; si no, la letra del
  juego y una cursiva del sistema. Reglas de espacio: aire en operaciones y relaciones, signo pegado si el menos va al
  principio o tras otro operador.
- Un texto de juego puede mezclar palabras y TeX entre signos de pesos: `'El lado mide $2\\sqrt{3}$ m'`.
- `plainToTex(str)` convierte los textos viejos escritos con símbolos, y `formulaWanted(str)` decide cuándo vale la
  pena (potencias, subíndices, raíces, fracciones sencillas); nombres, unidades (`km/h`) y controles (`− / +`) quedan
  como texto.

## Dónde se usa

| Lugar | Cómo |
|---|---|
| Todos los juegos | `fitText` (fichas con `drawTile`, pies, enunciados) y `p.text` de un renglón centrado en vertical pasan solos por el motor cuando el texto trae matemática. No hubo que tocar cada juego. |
| `arma-la-cuenta` | La cuenta se arma en TeX (`exprTex`): potencias arriba, raíces con barra, fracciones apiladas, negativos entre paréntesis. Las fichas también (`tileTex`). |
| `escala-solucion` | Cada paso se dibuja como fórmula. |
| Guías «Cómo se juega» | Las fichas de las escenas (`gText`) y el texto del paso (`tex(texify(…))`). |
| Respuestas | «La respuesta correcta es…» (lecciones y evaluaciones) pasa por `texify`: las soluciones de los juegos salen con KaTeX. |

**Para juegos nuevos:** escribir la matemática en TeX entre `$…$` en los textos que se dibujan (`fitText`, `drawTile`,
`p.text`) y en `solution`. Dentro de cadenas JS la barra va doble.

## Pruebas

`tests/formula.test.js`: el analizador (fracciones, potencias, subíndices, raíces, funciones, símbolos, entradas mal
escritas); la conversión de textos con símbolos y lo que no debe convertirse; las cajas (la fracción se apila, el
exponente sube y se achica, variables en cursiva, signo frente a resta, encoger para caber, texto mezclado);
`arma-la-cuenta` en TeX; conexiones; y que lo que `texify` entrega para las respuestas de todos los juegos tenga
llaves parejas y solo órdenes que KaTeX conoce.

En el navegador, un robot montó todos los juegos en los dos temas para buscar errores y listar los textos convertidos.

## Queda para después

- Los textos en caja (varios renglones) y los que no van centrados en vertical siguen como texto corrido.
- Los juegos que escriben fórmulas largas con símbolos podrían pasar a TeX escrito a mano para afinar el resultado.

## Ajustes tras la revisión

- **Safari viejo**: el archivo no usa «lookbehind» en las expresiones regulares (iOS anterior a 16.4 no lo entiende y
  el archivo entero dejaba de cargar, tumbando el panel de «Incorrecto»). La app también sigue andando si el motor o
  KaTeX no cargan: `app.js`, `exam.js`, `guia.js` y `arma-la-cuenta` comprueban antes de usarlos.
- **Espacios**: KaTeX no cuenta los espacios dentro de `$…$`; junto a una palabra se escriben como `\ `. Antes las
  respuestas con palabras salían pegadas.
- Las palabras (`\text`) van con la letra del juego; «y», «o», «a» sueltas entre dos datos, las unidades tras un número
  y los números romanos de cuadrante son texto, no variables.
- También son fracciones `5π/6`, `√3/2`, `x²/2`, `1/√3`, `2⁸/2²`; `27^⅓` y `a^-b` ya suben como potencia.
- Los pasos de `escala-solucion` que son ecuaciones se dibujan como fórmula aunque no tengan potencias (`mathStep`).
- Cerca de un borde la fórmula se corre hacia adentro en vez de encogerse; la caché se rehace al cargar las letras; las
  fichas limitan el alto de la fórmula.
- `arma-la-cuenta`: una raíz o «sen 30°» elevados van entre paréntesis, para que se lea lo que se calcula.
- Sin hacer: `∛` y `∜` sueltos no se convierten; un contador escrito «2/5» se apilaría como fracción (hoy no hay
  ninguno); los rótulos en mayúsculas (`drawKicker`) con matemática.
