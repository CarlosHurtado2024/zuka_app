# Razones, proporciones y regla de tres desde cero (Álgebra, mundo nuevo)

Pedido: un video mejor sobre razones, proporciones y regla de tres, conectado con lo visto antes (N1–N3 sistemas
numéricos, F1–F3 axiomas), muy explicativo desde lo básico, partido en varias partes, con ejercicios creativos tras
cada video. Sin zoom ni 3D. Cuidar que ningún texto se encime con la animación ni se salga de su recuadro (la
fracción del encabezado de N2 se salía del óvalo). Además: razones y porcentajes pasan a un **mundo propio** después
de «Sistemas numéricos y axiomas», y el interés simple y compuesto pasa después de la función exponencial.

## Reorganización

| Mundo | Lecciones |
|---|---|
| `numeros` «Sistemas numéricos y axiomas» | alg-11 alg-11b alg-11c alg-12b alg-12c alg-12d |
| `razones` «Razones, proporciones y porcentajes» (nuevo, «Mercado de las Razones») | alg-12 alg-12e alg-12f alg-13 |
| `exp-log` | alg-71 **alg-13b** alg-72 alg-73 |

`alg-12` conserva su id (progreso). Los videos viejos de Bunny de alg-12 (Clase 2 y regla de tres) y los pendientes A3/E3
quedan reemplazados por R1–R3. alg-13 (porcentajes) no cambia de contenido.

## Videos (plantilla `mk_alg_class.py`, fondo morado vivo, sin zoom ni 3D)

| Lección | Video | Carpeta | Contenido |
|---|---|---|---|
| `alg-12` Razones: comparar dividiendo | R1 | `video/clase_alg_u2_r1_razones` | comparar restando o dividiendo (12 y 4 cromos; dos árboles que crecen 2 m: de 2 a 4 se duplica, de 10 a 12 apenas); notación a : b = a/b, antecedente y consecuente, b ≠ 0 (F2) y el orden importa (F1: la división no conmuta); 18 niñas y 12 niños; simplificar 18 : 12 = 3 : 2 como en N2; sumar lo mismo cambia la razón (foto 3 × 2 → 6 × 4 bien, 6 × 5 estirada); parte-parte y parte-todo (3 : 2 → 3/5 = 0.6); razones con unidades (180 km en 3 h, jugos 6 por 7 200 y 8 por 9 200); escala 1 : 100 000 (4.5 cm → 4.5 km) |
| `alg-12e` Proporciones y magnitudes proporcionales | R2 | `video/clase_alg_u2_r2_proporciones` | proporción 4/6 = 10/15, «a es a b como c es a d», extremos y medios; productos cruzados y por qué (multiplicar los dos lados por bd, F1); 2/3 y 5/7 no; término desconocido x/8 = 9/12; media proporcional 4/x = x/9 y 2/x = x/3 → √6 (N3); directa con cuadernos (k = y/x, recta por el origen); inversa con 24 caramelos repartidos (xy = 24, curva); ninguna: el taxi con tarifa fija (crece pero no es proporcional); reparto de 45 000 en 2 : 3 : 4 |
| `alg-12f` Regla de tres simple y compuesta | R3 | `video/clase_alg_u2_r3_regla_tres` | tabla con columnas por magnitud y filas por situación; directa: 4 kg de arroz por 10 000 → 7 kg (reducción a la unidad y proporción); inversa: comida para 8 personas 15 días → 12 personas (8 · 15 = 12x; el error de hacerla directa); receta en cuatro pasos; compuesta: 3 impresoras, 900 hojas, 5 min → 5 impresoras, 1 800 hojas (una magnitud a la vez) |

## Ejercicios (todos juegos o cálculos con pista; ninguno repite los ejemplos del video)

- `alg-12`: `limonada` (2 : 3), `bolsa-razon` (nuevo), `estira-foto` (nuevo), `num` escala 1 : 200 000 con 7 cm,
  `num` precio por kilo (5 kg por 13 500 contra 2 kg por 5 600).
- `alg-12e`: `balanza-proporcion`, `sombra-arbol` (nuevo), `cuadrado-media`, `duplica-magnitud`, `grafica-relacion` ×2,
  `reparto`.
- `alg-12f`: `arma-regla`, `bascula`, `la-obra`, `engranajes`, `cadena-razones`.

### Juegos nuevos

- **bolsa-razon**: una bolsa transparente con bolas rojas y azules. Botones − / + por color (0–20). Cada ronda pide una
  bolsa con una condición de razón (parte-parte, parte-todo, con total o con un dato fijo). Se ve en vivo cuántas hay
  de cada color, sin simplificar. `params = { rounds: [{ text, red, blue }], max }`, `state = { counts: [[r, b] | null] }`.
- **estira-foto**: una foto (un zorrito dibujado) de w0 × h0 debe ampliarse a un ancho dado sin deformarse. Se arrastra
  el borde inferior (o − / +, paso 0.5) para fijar el alto. El dibujo se estira con el marco: si la razón no es la
  misma, la cara sale deformada. `params = { rounds: [{ w0, h0, w, h }], step, max }`, `state = { hs: [alto | null] }`.
- **sombra-arbol**: a la misma hora los rayos del sol son paralelos: un palo de altura conocida y su sombra, y un árbol
  con la sombra medida. Se ajusta la altura del árbol (arrastre o − / +, paso 0.5) hasta que el rayo que pasa por su
  copa caiga justo en el final de su sombra. `params = { rounds: [{ stick, shadow, treeShadow, tree }], step, max }`,
  `state = { hs: [altura | null] }`.

## Videos sin solapamientos

- `get_header` limita la altura de la fórmula del encabezado y el óvalo crece si hace falta (en `mk_alg_class.py`, así
  lo heredan las clases nuevas; también se corrige y se vuelve a renderizar N2, donde `\frac{m}{n}` se salía).
- `MBScene` revisa tras cada animación que nada se salga del cuadro útil ni toque el encabezado y lo anota en
  `videos/layout_warnings.txt`; las escenas se corrigen hasta que no queden avisos.
- Toda tarjeta con texto se arma con `get_card`/`boxed` alrededor del texto ya escalado.
- Revisión con hojas de contacto a mayor tamaño.

## Pruebas

`tests/razones-desde-cero.test.js`: grade de los tres juegos; orden de los mundos (numeros, razones, … exp-log con
alg-13b tras alg-71); cada lección con escenas, pistas, sin opción múltiple; reparto de juegos; ejemplos de los videos
ausentes en los ejercicios; rondas alcanzables con los controles (pasos y máximos). Se ajustan `tests/estructura.test.js`.
