# Álgebra y Cálculo según los cronogramas 2026-2

Fuentes: *Álgebra y Trigonometría — Cronograma 2026-2* y *Cálculo diferencial — Cronograma 2026-2* (UdeA).

## Decisión

- El curso **Álgebra** sigue el orden de las clases 1–19 del cronograma de Álgebra y Trigonometría
  (las clases 20–31 son Trigonometría, que ya es un curso aparte y no se toca aquí).
- Los temas que el cronograma de **Cálculo diferencial** da en sus semanas 1–5 (desigualdades, valor
  absoluto, recta, funciones, transformaciones, composición, inversa) **se mudan** de Álgebra a Cálculo.
- Los ids de lección **no cambian** (`alg-32` sigue llamándose así dentro de Cálculo): así se conserva el
  progreso guardado (`S.done`, `S.saved` usan el id) y los videos pendientes de Bunny siguen apuntando bien.
- Cálculo sale de `js/data.js` a su propio archivo `js/courses/calculo.js` (`COURSE_CALC`), como Álgebra y
  Trigonometría.
- Lecciones de Álgebra que no salen en el cronograma pero son base de una clase que sí sale se quedan junto a
  ella: porcentajes e interés tras razones, sumatoria tras progresiones, binomio de Newton tras productos
  notables, ecuaciones lineales antes de las cuadráticas, sistemas de ecuaciones antes de fracciones parciales.

## Álgebra (8 unidades)

| Unidad | Clases | Lecciones |
|---|---|---|
| 1 Sistemas numéricos, razones y proporciones | 1–2 | alg-11, alg-12b, alg-12, alg-13, alg-13b |
| 2 Potenciación y radicación | 3–4 | alg-21a, alg-21b, alg-22a, alg-22b |
| 3 Progresiones y sumatoria | 5 | alg-14, alg-15 |
| 4 Polinomios: productos notables y factorización | 6–7 | alg-23a, alg-3, alg-24c, alg-24b |
| 5 Números complejos y ecuaciones cuadráticas | 9–11 | alg-23c, alg-1, alg-4 |
| 6 Polinomios de grado superior | 12–13 | alg-23b, alg-92, alg-93 |
| 7 Expresiones racionales y fracciones parciales | 14–15 | alg-25a, alg-25b, alg-101, alg-102 |
| 8 Funciones exponenciales y logarítmicas | 17–19 | alg-71, alg-72 |

## Cálculo diferencial (5 unidades)

| Unidad | Clases | Lecciones |
|---|---|---|
| 1 Desigualdades, valor absoluto y la recta | 1–3 | alg-32, alg-26c, alg-51 |
| 2 Funciones | 4–9 | alg-52, alg-61, alg-53, alg-62 |
| 3 Límites y continuidad | 12–16 | calc-1, calc-2 |
| 4 La derivada | 17–23 | calc-3, calc-4 |
| 5 Aplicaciones de la derivada | 27–30 | calc-5 |

## Huecos (quedan para después; aquí solo se reordena)

- Álgebra: clase 10 *Polinomio cuadrático* (función cuadrática, vértice) y clase 19 *Ecuaciones
  exponenciales y logarítmicas* no tienen lección propia.
- Cálculo: funciones a tramos, límites trigonométricos y encaje, continuidad, regla de la cadena, derivada
  implícita, derivada logarítmica, variables relacionadas, L'Hôpital, trazado de curvas y optimización.

## Pruebas

`tests/estructura.test.js`: títulos y orden de unidades de Álgebra y Cálculo, ids exactos por unidad, que
ninguna lección se pierda y que ningún id esté en dos cursos. Las pruebas que buscaban lecciones por
«unidad 1» pasan a buscarlas por id.
