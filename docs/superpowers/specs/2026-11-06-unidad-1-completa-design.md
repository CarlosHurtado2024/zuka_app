# Unidad 1 completa: videos y ejercicios de las lecciones 1.3b, 1.4 y 1.5

Fecha: 2026-11-06 · Estado: ejecución autónoma (el usuario pidió implementar y subir sin preguntar)

## 1. Objetivo

Cerrar la unidad 1 «Fundamentos de aritmética y números reales» del curso de Álgebra con el mismo
formato de las lecciones 1.1–1.3: videos verticales de ~6 min hechos con manimgl (varios por lección
si hace falta) con ejemplos **resueltos en el video que no se repiten en los ejercicios**, y
ejercicios interactivos originales (`play` + `js/games/*.js`, TDD sobre `grade`).

Las lecciones 1.1, 1.2 y 1.3 ya están completas. Quedan:

| Lección | id | Videos | Ejercicios |
|---|---|---|---|
| 1.3b Interés simple y compuesto (nueva, va después de 1.3) | `alg-13b` | 1 (Clase 4) | 6 |
| 1.4 Progresiones aritméticas y geométricas | `alg-14` | 2 (Clase 5 · Partes 1 y 2) | 10 (5 + 5, video 2 con `after: 5`) |
| 1.5 Sumatoria y productoria | `alg-15` | 1 (Clase 6) | 7 |

Reglas fijas: UI en español, punto decimal en toda la app (coma solo en la narración de los videos),
`explain` con KaTeX escapado, cabeceras de los juegos con `p.text(str, 12, y, W - 24, h)`, juegos
registrados en `index.html` y en el SHELL de `sw.js` (una subida de `VERSION` por lección),
`tests/registro.test.js` lo exige. Cada lección se fusiona en `main` y se sube a GitHub al terminar.
Los videos quedan en `Descargas/Zuka_ClaseN_…/`; mientras no haya ID de Bunny la lección lleva
escenas de respaldo (`sc`) y al llegar el ID se enlaza con `bunny + duration` y `scenes: []`.

## 2. Juegos nuevos (contrato de `js/games/kit.js`)

| Juego | Mecánica | `params` | `state` | Correcto si |
|---|---|---|---|---|
| `clasifica-cartas` | Mazo deslizable como `verdadero-falso`, pero con dos categorías libres (izquierda/derecha) | `{ left, right, cards: [{ text, side: 'left'\|'right', why }] }` | `{ answers: [side\|null] }` | todas las cartas en su lado |
| `cobra-intereses` | Línea de 12 meses; tocar un mes «cobra» la moneda del interés simple (C·r) y el contador acumula; meta: cierto interés acumulado | `{ capital, rate, coin, target, months }` | `{ paid: n }` (meses cobrados, en orden) | `paid · capital · rate === target` |
| `ajusta-capital` | Pila de billetes cuya altura se arrastra (paso) para fijar el capital; el monto compuesto se calcula en vivo | `{ rate, periods, target, step, max, tol }` | `{ capital }` | `\|capital(1+rate)^periods − target\| ≤ tol` |
| `mejor-oferta` (generalizado) | igual, con `prefer: 'low'\|'high'` (por defecto low) y `noun` («Tienda»/«Banco») | + `prefer`, `noun` | igual | la opción preferida según `prefer` |
| `escalera-aritmetica` | Escalera de n peldaños; el primero mide `a1`; arrastrar el segundo fija `d` y toda la escalera se reacomoda; meta: que el peldaño `n` mida `target` | `{ a1, n, target, step, max }` | `{ d }` | `a1 + (n−1)d === target` |
| `parejas-gauss` | Fichas con los términos; se unen con cuerdas por parejas de extremos (misma suma); el del medio queda solo | `{ terms: [..] }` | `{ pairs: [[i, j]] }` | cada pareja suma `a1 + an`, todas distintas, se usan todos menos el central (si n impar) |
| `rellena-medios` | Recta con el primero y el último término fijos y k huecos; se arrastran fichas (con distractores) | `{ first, last, k, kind: 'aritmetica'\|'geometrica', chips: [números] }` | `{ slots: [índice\|null] }` | cada hueco tiene la ficha del medio correspondiente |
| `suma-filas` | Tocar «+ fila» añade una fila de puntos (`first`, luego `+d`); contador del total; meta: total exacto | `{ first, d, target, max, item }` | `{ rows }` | `rows/2 · (2·first + (rows−1)d) === target` |
| `limite-serie` | Botón «+ término» acumula las sumas parciales de una serie geométrica sobre una recta; un marcador se arrastra al valor límite | `{ a1, r, max, step, tol }` | `{ guess }` | `\|guess − a1/(1−r)\| ≤ tol` |
| `torre-producto` | Tocar «× siguiente» multiplica (por `r` fijo o por el siguiente entero, factorial); la torre crece; meta: alcanzar `target` exacto | `{ kind: 'ratio'\|'factorial', start, r, target, max, unit }` | `{ n }` | valor tras n pasos `=== target` |
| `arma-sigma` | Fichas que se arrastran a las tres casillas de Σ (índice inicial, límite superior, término general); rondas con pestañas | `{ rounds: [{ text, chips: [{ label, cell: 'lower'\|'upper'\|'term'\|null }] }] }` | `{ rounds: [{ cells }] }` | como `cruz-porcentaje` |
| `ordena-terminos` | Fichas (con distractores) que se arrastran en orden a las cajas de una expansión | `{ tex, chips: [label], order: [índices], boxes }` | `{ boxes: [índice\|null] }` | `boxes` igual a `order` |

Reutilizados: `carrera-interes`, `verdadero-falso`.

## 3. Lección 1.3b · Interés simple y compuesto (`alg-13b`)

Video «Clase 4 · Interés simple y compuesto» (`video/clase_interes_sc/`, ~6 min):
`S00_Portada` · `S01_QueEs` (capital, tasa, tiempo; 500.000 al 2 % mensual 3 meses → 30.000) ·
`S02_Simple` (M = C(1 + rt); préstamo 1.200.000 al 1,5 % × 8 → 1.344.000) · `S03_Compuesto`
(el interés gana interés; 500.000 al 2 % × 3 → 530.604 vs 530.000) · `S04_Comparar` (1.000.000
al 10 % anual 10 años: recta 2.000.000 vs curva 2.593.742; gráfica) · `S05_Despejar` (¿qué
capital da 200.000 de interés simple al 1 % en 10 meses? → 2.000.000; regla del 72 para duplicar)
· `S06_Cierre` (ponte a prueba: 300.000 al 5 % anual compuesto 2 años → 330.750).

Ejercicios (números distintos a los del video):
1. `cobra-intereses` 1.500.000 al 1 % mensual → moneda 15.000; meta 180.000 → 12 meses.
2. `clasifica-cartas` Simple / Compuesto con tablas de montos (100, 110, 120, 130 → simple; 100, 110,
   121, 133.1 → compuesto; 200, 206, 212.18 → compuesto; 400, 420, 440 → simple; 50, 55, 60.5 → compuesto).
3. `carrera-interes` 3.000.000 al 2 % mensual, 24 meses, brecha 120.000 → mes 15 (mes 14 ≈ 118.400, mes 15 ≈ 137.600).
4. `ajusta-capital` 3 % mensual, 4 meses, meta 1.125.509 → capital 1.000.000 (paso 50.000, tol 1).
5. `mejor-oferta` (prefer high, Banco): A «1.2 % mensual simple, 10 meses» [12] vs B «1 % mensual
   compuesto, 10 meses» [1 × 10] → A (1.120.000 vs 1.104.622 sobre 1.000.000); A «8 % anual simple,
   5 años» [40] vs B «7 % anual compuesto, 5 años» [7 × 5] → B (1.400.000 vs 1.402.552); A «2 % mensual
   compuesto, 6 meses» [2 × 6] vs B «12.5 % semestral simple» [12.5] → B (1.126.162 vs 1.125.000).
6. `verdadero-falso`: «Al 2 % mensual simple, en 12 meses se gana el 24 % del capital» (V); «A largo
   plazo el compuesto siempre supera al simple» (V); «En el primer periodo simple y compuesto ganan lo
   mismo» (V); «Duplicar la tasa duplica el monto compuesto» (F); «M = C(1 + r)^n sirve para el simple» (F).

## 4. Lección 1.4 · Progresiones (`alg-14`)

Video 1 «Clase 5 · Parte 1 · Progresiones aritméticas» (`video/clase_progresiones/`, parte1, ~6 min):
`S00_Portada` · `S01_Sucesion` (patrón, término general) · `S02_Aritmetica` (4, 9, 14, … → a_15 = 74)
· `S03_Gauss` (1 + … + 100 = 5050; S_n; 2 + 5 + … + 59 → n = 20, S = 610) · `S04_Medios` (4 medios
entre 3 y 18 → d = 3) · `S05_Teatro` (12 sillas, +3 por fila, 15 filas → 495) · `S06_Cierre` (a_1 = 5,
d = 4 → a_30 = 121).

Video 2 «Parte 2 · Progresiones geométricas» (parte2, ~6 min): `S10_Portada` · `S11_Geometrica`
(2, 6, 18 → a_8 = 4374) · `S12_Suma` (3 + 6 + … + 384 → n = 8, S = 765) · `S13_Infinita` (8 + 4 + 2 +
… = 16, cuadrado que se parte) · `S14_Medios` (2 medios entre 5 y 135 → 15, 45) · `S15_Rumor` (un
rumor que se triplica cada hora: 2 → 4374 en 7 horas) · `S16_Cierre` (a_1 = 7, r = 2 → S_6 = 441).

Ejercicios parte 1 (1–5) y parte 2 (6–10, el video 2 entra con `after: 5`):
1. `clasifica-cartas` Aritmética / Geométrica: 7, 10, 13, 16 (A); 5, 10, 20, 40 (G); 100, 90, 80, 70 (A);
   81, 27, 9, 3 (G); 1.5, 3, 4.5, 6 (A); 1, −2, 4, −8 (G).
2. `escalera-aritmetica` a1 = 6, n = 10, meta 42 → d = 4 (paso 1, máx 10).
3. `parejas-gauss` 3, 7, 11, …, 43 (11 términos, pareja = 46, S = 253).
4. `rellena-medios` 3 medios aritméticos entre 10 y 26 → 14, 18, 22 (fichas 13, 14, 18, 20, 22, 24).
5. `suma-filas` teatro: 8 sillas, +2 por fila, meta 170 → 10 filas.
6. `rellena-medios` 3 medios geométricos entre 5 y 405 → 15, 45, 135 (fichas 15, 25, 45, 90, 135, 225).
7. `limite-serie` 9 + 3 + 1 + … → 13.5 (máx 20, paso 0.5, tol 0.26).
8. `clasifica-cartas` Converge / Diverge: 1 + 1/2 + 1/4 + … (C); 2 + 4 + 8 + … (D); 10 − 5 + 2.5 − …
   (C); 0.9 + 0.81 + 0.729 + … (C); 1 − 1 + 1 − 1 + … (D); 100 + 100 + 100 + … (D).
9. `torre-producto` bacterias: 50 que se duplican cada hora, meta 6400 → 7 horas.
10. `verdadero-falso`: «En una aritmética la diferencia entre términos consecutivos es constante» (V);
    «En una geométrica se suma siempre lo mismo» (F); «Si |r| < 1 la suma infinita existe» (V); «3, 6, 12
    tiene razón 3» (F); «La suma de los primeros n impares es n²» (V).

## 5. Lección 1.5 · Sumatoria y productoria (`alg-15`)

Video «Clase 6 · Sumatoria y productoria» (`video/clase_sumatoria/`, ~6 min): `S00_Portada` ·
`S01_Sigma` (índice, límites, término; Σ_{k=1}^{5} 2k = 30) · `S02_Propiedades` (lineal; Σ_{k=1}^{4}
(3k + 1) = 34) · `S03_Notables` (Σk, Σk²; Σ_{k=1}^{10} k² = 385) · `S04_Telescopica` (Σ 1/(k(k+1)) =
1 − 1/(n+1); n = 4 → 4/5) · `S05_Productoria` (Π y factorial; Π_{k=1}^{4} 2k = 384) · `S06_Cierre`
(Σ_{k=1}^{6} (k² − k) = 70).

Ejercicios:
1. `arma-sigma`: «3 + 6 + 9 + … + 30» → k=1, 10, 3k (distractores k=0, 30, k+3); «5 + 7 + 9 + … + 21»
   → k=1, 9, 2k+3 (distractores 21, 2k+1); «1 + 4 + 9 + … + 64» → k=1, 8, k² (distractores 64, 2k).
2. `ordena-terminos` Σ_{k=2}^{5} (k² − 1) → 3, 8, 15, 24 (distractores 1, 35).
3. `verdadero-falso` propiedades: Σ(a+b) = Σa + Σb (V); Σ(a·b) = Σa·Σb (F); Σ_{k=1}^{n} c = nc (V);
   Σ c·a_k = c·Σ a_k (V); Σ_{k=1}^{n} k = n(n + 1) (F).
4. `suma-filas` pirámide: 1 punto, +1 por fila, meta 78 → 12 filas.
5. `ordena-terminos` telescópica n = 5: (1 − 1/2), (1/2 − 1/3), (1/3 − 1/4), (1/4 − 1/5), (1/5 − 1/6)
   en orden (distractores (1/2 − 1/4), (1/6 − 1/7)); solución 5/6.
6. `torre-producto` factorial: meta 5040 → n = 7.
7. `clasifica-cartas` Suma (Σ) / Producto (Π): «1 + 1/2 + … + 1/10» (Σ); «1 · 3 · 5 · 7 · 9» (Π); «5!» (Π);
   «3 + 3 + 3 + 3 + 3» (Σ); «2 · 2 · 2 · 2» (Π); «n(n + 1)/2» (Σ).

## 6. Orden de trabajo

Por lección: escenas del video y render en segundo plano → juegos (test `grade` en rojo → verde) →
contenido y tests de `contenido`/`cola` → registro + SW → revisión rápida en el navegador → commit,
fusión en `main` y push → al terminar el render, `dist/` a `Descargas/` y aviso al usuario con la
ruta para que lo suba a Bunny y pase el ID.
