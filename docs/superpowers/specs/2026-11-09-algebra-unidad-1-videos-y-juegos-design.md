# Álgebra, unidad 1: un video por lección y juegos nuevos (2026-11-09)

Unidad 1 de Álgebra: «Sistemas numéricos, razones y proporciones» (`alg-11`, `alg-12b`, `alg-12`,
`alg-13`, `alg-13b`).

## Pedido

- Un video por lección (sin partes; la duración no importa, menos de 10 min), muy entretenido, con el fondo
  morado degradado de Álgebra (como los clips de la app), **zoom de cámara** de manimgl y escenas en **3D**
  cuando aporten.
- Juegos originales y distintos entre sí, en lugar de las tarjetas (verdadero/falso, clasificar, unir).
- Todo en tema claro y oscuro, y en celular.

## Videos (manimgl 1.7.2, 9:16)

Carpetas `video/clase_alg_u1_*`, una por lección, con la plantilla de Cálculo/Trigonometría (`mb_common.py`
con `zoom_to` / `zoom_reset`, encabezado y fondo fijos en el encuadre) y un fondo nuevo
`fondo_algebra_vivo.png` (`make_background.py "#8b7bff" … 0.36 0.24`, el mismo degradado de la app pero más
vivo). Colores de acento a juego con el morado: lavanda `#B9A6FF`, miel, cielo, menta y coral (los de las
familias de números) y un rosa `#F472B6` para resaltar.

Intuición primero y fórmula después, sin preguntas al espectador, sin voz ni subtítulos quemados (guion
`.md` y `.srt`). Los ejemplos no se repiten en los ejercicios.

| Lección | Video | 3D | Zoom |
|---|---|---|---|
| alg-11 Sistemas numéricos | Las familias como muñecas que se abren (ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ), por qué cada una nace (restar, repartir, medir), decimales que terminan o se repiten, periódico → fracción, la diagonal del cuadrado (√2) y la del cubo (√3) | cubo girando con su diagonal; anillos apilados de las familias | la lupa sobre la recta: entre dos números siempre hay otro |
| alg-12b Axiomas de campo y orden | Conmutativa como rectángulo que gira, asociativa del producto como caja (a·b)·c = a·(b·c), distributiva con áreas, ley de signos, orden y el espejo del negativo, valor absoluto como distancia | caja de volumen que se rearma | sobre la recta al voltear la desigualdad |
| alg-12 Razones, proporciones y regla de tres | Receta de pintura (razón), proporción y producto cruzado, directa (recta por el origen), inversa (rectángulos de área fija), «ninguna» con cubos que duplican el lado, reparto, regla de tres simple y compuesta | cubo que duplica su lado: volumen ×8 | sobre la hipérbola y la tabla |
| alg-13 Porcentajes y descuentos | La cuadrícula de 100 que se vuelve torre, porcentaje como razón con 100, la cruz, aumentos y descuentos como factores, descuentos sucesivos | cuadrícula 10×10 de cubitos que suben | sobre la barra del factor |
| alg-13b Interés simple y compuesto | Pilas de monedas: simple suma la misma pila, compuesto la pila crece; fórmulas, la carrera, regla de duplicar | pilas de monedas 3D | sobre la brecha entre las curvas |

Mientras el usuario sube los videos a Bunny, cada lección conserva sus videos actuales; al recibir los ID
se pone `clip.bunny` + `duration` y se quita `more`.

## Juegos nuevos (reemplazan tarjetas)

| Lección | Reemplaza | Juego | Mecánica |
|---|---|---|---|
| alg-11 | verdadero-falso (familias) | `fuga-de-familia` | Elegir dos fichas de una familia para que la operación «se escape» de ella (resta de naturales, cociente de enteros, suma de irracionales con valor `r + k√2`) |
| alg-11 | une-parejas | `candado-fraccion` | Girar las ruedas de numerador y denominador hasta que el decimal del visor sea el pedido; el candado se abre |
| alg-11 | clasifica-cartas | `compas-raiz` | Elegir los catetos de un rectángulo en la cuadrícula y girar el compás desde 0: la diagonal cae en √n |
| alg-11 | verdadero-falso (reales) | `lupa-densidad` | Acercar la lupa entre dos números muy cercanos (22/7 y π) y soltar un punto estrictamente entre ellos |
| alg-12 | directa-inversa | `duplica-magnitud` | Cuando una magnitud se duplica (o triplica), subir la barra de la otra a su valor: el resultado revela directa, inversa o ninguna |
| alg-12 | directa-inversa | `engranajes` | Dos engranajes engranados: dientes y vueltas son inversamente proporcionales; fijar vueltas o dientes con − / + y verlos girar |
| alg-13 | verdadero-falso | `estira-barra` | Estirar o encoger la barra del 100 % hasta «70 % más», «9 % menos», «el 25 %» |
| alg-13 | une-factor | `tragamonedas` | Girar los rodillos ×d.ddd hasta formar el factor de cada cambio |
| alg-13 | verdadero-falso | `cadena-cambios` | Elegir dos sellos de cambio cuyo efecto total sea el pedido (+21 %, queda en 75 %…) |
| alg-13b | clasifica-cartas | `crece-planta` | Hacer crecer la planta de los meses 2 y 3 sabiendo si el interés es simple o compuesto |
| alg-13b | verdadero-falso | `alcancias-gemelas` | Ajustar la tasa simple que llena la alcancía igual que el compuesto |

Cada juego: `grade` pura con pruebas, colores leídos de `api.palette` al dibujar, rondas con pestañas,
texto que se encoge, botones − / + donde el arrastre necesite precisión, pista sin regalar la respuesta.
Las lecciones `alg-12`, `alg-13` y `alg-13b` reciben pista en todos sus ejercicios.

## Videos complementarios: ejemplos resueltos (E1–E5)

Un segundo video por lección, para ver justo después del de conceptos (en la lección: `more: [{ bunny, duration }]`
**sin `after`**, así `buildQueue` lo pone inmediatamente después del primero). Carpetas `video/clase_alg_u1_ej_*`.

Formato: escena `ExScene` (en `alg_u1_fx.py`): tarjeta con el enunciado arriba y pasos que bajan, cada uno con
una etiqueta del concepto que lo justifica («producto cruzado», «÷ negativo voltea el signo»…); cuando no caben,
los pasos suben y los más viejos se desvanecen. Zoom al paso clave, una comprobación al final y un ejemplo en 3D
por video. Los ejemplos no repiten los del video de conceptos ni los de los ejercicios.

| Video | Lección | Ejemplos |
|---|---|---|
| E1 | alg-11 | clasificar −√25, 14/7, 1.2727…, √8; 0.4666… = 7/15; 2.1515… = 71/33; ¿termina? 7/40, 5/12, 21/75; ordenar 2.6, √7, 8/3; diagonal de cajas 2×3×6 (= 7) y 1×1×2 (√6) en 3D |
| E2 | alg-12b | 3x + 7 = 22 con el axioma de cada paso; (−2)(5)(−3)(−1) y (−1)^2027; −3x + 4 ≤ 13; \|x + 1\| = 4; \|x − 3\| > 1; \|2 − √7\| |
| E3 | alg-12 | harina para arepas (directa); 60 → 75 km/h (inversa); reparto de 600.000 por edades 4, 6, 10; impresoras (compuesta); maqueta 1 : 50 en 3D |
| E4 | alg-13 | IVA 19 % de ida y de vuelta; variación 40.000 → 46.000 y 80.000 → 68.000; 25 % y luego 20 %; 25 % del 60 % con cubitos 3D |
| E5 | alg-13b | 18 % anual simple por 10 meses; 4 % trimestral compuesto un año; hallar la tasa; bancos simple vs compuesto a 12 y 24 meses en 3D |
