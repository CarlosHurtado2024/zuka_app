# Porcentajes e interés: dos videos y once minijuegos para la lección 1.3

Fecha: 2026-11-06 · Estado: aprobado en conversación

## 1. Objetivo

La lección `alg-13` («Porcentajes e interés») pasa de tres ejercicios de texto a **dos videos y
once ejercicios interactivos**, con la misma estructura que la 1.2: el video 1 abre la lección, le
siguen seis juegos, el video 2 entra **después del sexto ejercicio** (`after: 6`) y cierran cinco
juegos más.

Fuente del contenido: texto guía Ude@ «Elementos de aritmética», §1.1 *Cálculo porcentual*
(ejercicios resueltos 1.7–1.14 y propuestos 1.6, 1.10, 1.12, 1.13, 1.16, 1.19). El interés simple y
compuesto no está en la guía: se toma del programa (fórmulas `M = C(1 + rt)` y `M = C(1 + r)^n` y el
ejemplo de 2 000 000 pesos al 1,5 % mensual durante 12 meses) tal como lo enuncia hoy la lección.

## 2. Motor y lección

No hay cambios de motor: `buildQueue` ya intercala un video de `more` con `after: n` antes del
ejercicio `n`, y el reproductor ya acepta `bunny` o `scenes`.

```js
{
  id: 'alg-13', title: 'Porcentajes e interés',
  clip: { scenes: [ /* 3 escenas de respaldo, Parte 1 */ ] },           // → bunny + duration al llegar el ID
  more: [{ after: 6, scenes: [ /* 3 escenas de respaldo, Parte 2 */ ] }], // → bunny + duration al llegar el ID
  ex: [ /* 6 juegos de la Parte 1, 5 juegos de la Parte 2 */ ],
}
```

- Mientras no haya IDs de Bunny, cada parte lleva **tres escenas de texto** (`sc(...)`) que resumen
  su contenido, para que la lección funcione desde el primer despliegue. Cuando el usuario entregue
  un ID se añade `bunny: '<id>', duration: <s>` a esa parte y las escenas quedan como `[]`.
- Los textos de ejercicio y `explain` siguen las reglas de `tests/contenido.test.js` (sin
  caracteres de control ni comandos TeX sin barra).
- Los nueve archivos nuevos de `js/games/` se registran en `index.html` y en el `SHELL` de `sw.js`;
  `VERSION` sube a `zuka-v16` una sola vez en esta entrega.

## 3. Video 1 · «Clase 3 · Parte 1: Porcentajes»

Carpeta `video/clase_porcentajes/` con la estructura de `video/clase_regla_de_tres/`
(`mb_common.py` copiado, `build.py` de una parte con `TOPIC = "porcentajes"`, `custom_config.yml`,
`assets/`, README). Vertical 1080 × 1920, tema morado, mascota, sin voz ni subtítulos; cada frase
de `say()` deja una pausa de su propio largo. Duración objetivo **4:30–5:30**.

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_Portada` | «Clase 3 · Parte 1 · Porcentajes» |
| 0:06 | `S01_QueEs` | «por ciento» = de cada 100; cuadrícula 10 × 10 que se pinta hasta 35 casillas; `35 % = 35/100 = 0,35`; equivalencias rápidas (`50 % = 1/2`, `25 % = 1/4`, `10 % = 0,1`) |
| 0:55 | `S02_LaCruz` | tabla `100 → C`, `p → B` como regla de tres directa: `100/C = p/B`; ejercicio 1.7: 12 % de 8.000 → `B = 12 · 8.000 / 100 = 960` |
| 1:50 | `S03_HallarBase` | ejercicio 1.8: ¿de qué número es 48 el 8 %? → `C = 100 · 48 / 8 = 600` |
| 2:25 | `S04_QuePorcentaje` | ejercicio 1.9: ¿qué porcentaje es 51 de 170? → `p = 100 · 51 / 170 = 30 %` |
| 3:00 | `S05_MasYMenos` | «el 70 % más» es el 170 % (ej. 1.10: 408 → 240); «el 9 % menos» es el 91 % (ej. 1.11: 546 → 600) |
| 3:50 | `S06_Mezcla` | ejercicio 1.12: 40 g de alcohol son el 20 % de la mezcla → 200 g de mezcla → 160 g de agua (vaso que se llena) |
| 4:30 | `S07_Cierre` | repaso de los tres casos (¿cuánto es?, ¿de qué número?, ¿qué porcentaje?) y «ponte a prueba»: ¿qué porcentaje es 63 de 180? → 35 % |

Entregables en `Descargas/Zuka_Clase3_Porcentajes/`: `porcentajes_parte1.mp4`, `_guion.srt`,
`_guion.md`.

## 4. Minijuegos de la Parte 1 (ejercicios 1 a 6)

Todos usan el motor `play` existente (`js/games/kit.js`): `grade(state, params)` pura con test en
Node, `create(host, params, api)` con p5.js montado por `mountSketch` (toques incluidos), `label`
para el lienzo y `tex` para KaTeX. Ninguno nace resuelto: el estado inicial nunca es la respuesta.

| # | Juego (`game`) | Mecánica | `params` | `state` | Correcto si |
|---|---|---|---|---|---|
| 1 | `cuadricula-cien` «Pinta el porcentaje» | Cuadrícula 10 × 10; arrastrar el dedo pinta (o despinta, si la primera casilla tocada ya estaba pintada). Tres rondas con botón «Siguiente ronda» y contador «n de 100» en vivo; las rondas terminadas se muestran en miniatura | `{ rounds: [{ ask: '35 %', count: 35 }, { ask: '3/4', count: 75 }, { ask: '0,08', count: 8 }] }` | `{ counts: [n, n, n] }` (null hasta pintar) | `counts[i] === rounds[i].count` en las tres |
| 2 | `cruz-porcentaje` «La cruz» | Tabla 2 × 2 con `100` fijo arriba a la izquierda y tres casillas (`C` debajo de 100, `p` a la derecha de 100, `B` en diagonal); se arrastran fichas a las casillas; una ficha `?` marca la incógnita. Tres problemas con pestañas | `{ problems: [{ text, chips: [{ label, cell }] }] }` donde `cell ∈ 'p' \| 'C' \| 'B' \| null` (null = distractor). Problemas: «Halla el 12 % de 8.000» (`12→p`, `8.000→C`, `?→B`); «¿De qué número es 48 el 8 %?» (`8→p`, `48→B`, `?→C`); «¿De qué número es 408 el 70 % más?» (`170→p`, `408→B`, `?→C`, distractor `70`) | `{ problems: [{ cells: { p: i, C: i, B: i } }] }` (índice de ficha o null) | en cada problema, cada casilla tiene la ficha cuyo `cell` es esa casilla |
| 3 | `mezcla` «El químico» | Vaso con 40 g de alcohol (capa morada); un botón-grifo añade agua de 10 en 10 g (mantener pulsado repite) y otro la quita; medidor «% de alcohol» en vivo = `40 / (40 + agua)`. Meta: mezcla al 20 % | `{ solute: 40, target: 20, step: 10, max: 400 }` | `{ water: g }` (0 al inicio) | `solute / (solute + water) * 100 === target` → agua = 160 |
| 4 | `rueda-porcentaje` «La rueda» | Pastel con una aguja que se gira arrastrando; el sector sombreado muestra «k de C» en unidades (el `C` de la ronda); la escala exterior en % se dibuja sin números hasta bloquear. Tres rondas (pestañas) | `{ rounds: [{ part: 51, whole: 170 }, { part: 63, whole: 180 }, { part: 26.4, whole: 240 }], tol: 1 }` | `{ pct: [x, x, x] }` (null hasta girar; valor en % con un decimal) | `\|pct[i] − 100·part/whole\| ≤ tol` en las tres (30, 35, 11) |
| 5 | `bodegas` «Las bodegas de azúcar» (ej. 1.14) | 2.000 sacos; un divisor se arrastra para repartir entre A y B (paso 50); al soltar, el 20 % de A viaja animado a B y se muestran los totales resultantes. Meta: que queden iguales | `{ total: 2000, move: 20, step: 50 }` | `{ a: sacos en A }` (1.000 al inicio) | `a·(1 − move/100) === total − a + a·move/100` → a = 1.250 |
| 6 | `verdadero-falso` (reutilizado) | Tarjetas deslizables | `cards`: «El 70 % más de un número es el 170 % de él» (V); «El 9 % menos de un número es el 9 % de él» (F: es el 91 %); «El 12 % de 8.000 es 96» (F: 960); «El 25 % de algo es su cuarta parte» (V); «51 de 170 es el 30 %» (V) | `{ answers }` | todas bien |

## 5. Video 2 · «Clase 3 · Parte 2: Aumentos, descuentos e interés»

Carpeta `video/clase_interes/`, misma estructura; `TOPIC = "interes"`. Duración objetivo
**4:30–5:30**.

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00 | `S00_Portada` | «Clase 3 · Parte 2 · Aumentos, descuentos e interés» |
| 0:06 | `S01_Factor` | aumentar r % es multiplicar por `1 + r`; descontar es multiplicar por `1 − r`; ejemplos 120 → ×1,2 y −15 % → ×0,85 |
| 0:50 | `S02_Sucesivos` | dos descuentos de 30 % y 20 % sobre 100.000: 70.000 → 56.000; `0,7 · 0,8 = 0,56` → único 44 %, **no** 50 % (ej. 1.10); dos incrementos de 20 % y 25 %: `1,2 · 1,25 = 1,5` → 50 % (ej. 1.12) |
| 1:55 | `S03_Volver` | ej. 1.6: rebaja del 10 % (100 → 90); para volver hace falta subir `10/90 = 11,1 %`, no 10 % |
| 2:40 | `S04_Simple` | interés simple: siempre sobre el capital; `M = C(1 + rt)`; 2 000 000 al 1,5 % mensual, 12 meses → `2 000 000 · 1,18 = 2 360 000` (línea de tiempo con 12 monedas iguales de 30 000) |
| 3:30 | `S05_Compuesto` | el interés también gana interés: `M = C(1 + r)^n` → `2 000 000 · 1,015^12 ≈ 2 391 236`; gráfica recta (simple) vs curva (compuesto), 0–24 meses |
| 4:30 | `S06_Cierre` | repaso (factor, sucesivos se multiplican, simple vs compuesto) y «ponte a prueba»: ¿descuento único de 40 % y 25 %? → 55 % |

Entregables en `Descargas/Zuka_Clase3_Interes/`: `interes_parte2.mp4`, `_guion.srt`, `_guion.md`.

## 6. Minijuegos de la Parte 2 (ejercicios 7 a 11)

| # | Juego (`game`) | Mecánica | `params` | `state` | Correcto si |
|---|---|---|---|---|---|
| 7 | `cascada` «Descuentos en cascada» | Etiqueta de precio 100.000; dos stickers (−30 %, −20 %) se arrastran y pegan sobre la etiqueta en cualquier orden; cada uno hace caer el precio con animación (70.000 → 56.000). Debajo, un deslizador «descuento único» de 0 a 100 % (paso 1) | `{ price: 100000, changes: [-30, -20], step: 1 }` | `{ applied: [idx…], single: % \| null }` | ambos stickers pegados y `single === 44` (= `100·(1 − Π(1 + c/100))`, redondeado) |
| 8 | `rebote` «Sube y baja» (ej. 1.6) | Barra «precio» a 100 que baja un 10 % (90) con una marca fija en 100; se arrastra una manija «% de subida» (0 a 30, paso 0,1) y la barra responde en vivo. Meta: volver exactamente a 100 | `{ base: 100, drop: 10, max: 30, step: 0.1, tol: 0.06 }` | `{ up: % \| null }` | `\|up − 100·drop/(100 − drop)\| ≤ tol` → 11,1 |
| 9 | `dos-etapas` «La máquina» (ej. 1.19) | Máquina con dos etapas (+30 %, −20 %) y salida fija 8.840; una perilla circular fija la entrada (0 a 20.000, paso 20) y los valores intermedios y la salida se recalculan en vivo; la salida calculada se compara con 8.840 con un indicador | `{ changes: [30, -20], output: 8840, max: 20000, step: 20 }` | `{ input: n \| null }` | `input · Π(1 + c/100) === output` → 8.500 (`1,3 · 0,8 = 1,04`) |
| 10 | `carrera-interes` «La carrera del interés» | Dos corredores (simple y compuesto) con 2 000 000 al 1,5 % mensual; un deslizador de tiempo (0 a 24 meses, paso 1) mueve a ambos y un medidor muestra la ventaja del compuesto en pesos. Pregunta: ¿desde qué mes la ventaja supera 50.000? Se bloquea con el mes elegido | `{ capital: 2000000, rate: 0.015, months: 24, gap: 50000 }` | `{ month: n \| null }` | `month` es el **primer** mes con `C((1 + r)^n − 1 − rn) > gap` → 15 |
| 11 | `verdadero-falso` (reutilizado) | Tarjetas | «Dos aumentos del 10 % equivalen a un 20 %» (F: 21 %); «Al 2 % mensual simple, en 12 meses se gana el 24 %» (V); «Dos descuentos del 50 % dejan el producto gratis» (F: queda el 25 %); «A largo plazo el interés compuesto siempre supera al simple» (V); «Rebajar 10 % y luego subir 10 % devuelve el precio original» (F: queda en 99 %) | `{ answers }` | todas bien |

Cada juego lleva su `explain` basado en el texto guía. Los nombres de archivo y de `game`
coinciden (`js/games/cascada.js` → `GAMES['cascada']`).

## 7. Pruebas

- Un test de Node por juego nuevo (`tests/<game>.test.js`): caso correcto, caso incorrecto con
  solución legible, estado inicial o vacío incorrecto, y los casos límite de la tabla (tolerancias,
  orden de stickers, primer mes).
- `tests/cola.test.js` gana un caso con la forma real de la lección (`after: 6`, 11 ejercicios).
- `tests/contenido.test.js` ya cubre `alg-13`; `tests/sw.test.js` verifica que cada
  `js/games/*.js` esté en el `SHELL`.
- Prueba manual en el navegador integrado (375 × 812) de cada juego con toques sintéticos, y
  recorrido completo de la lección (video 1 → 6 juegos → video 2 → 5 juegos).

## 8. Entrega

Rama de trabajo, commits por tarea, revisión final, fusión en `main` y push **solo con la
aprobación del usuario**. Los videos se entregan en `Descargas/`; el usuario los sube a Bunny y
entrega los dos IDs, que se enlazan en un commit aparte (como en la 1.2).
