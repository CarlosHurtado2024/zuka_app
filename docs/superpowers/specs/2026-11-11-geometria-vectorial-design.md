# Geometría Vectorial y Analítica (curso nuevo)

Fuente: *Geometría Vectorial — Cronograma 2020-1* (UdeA, Facultad de Ingeniería), 17 semanas y 4 parciales.

## Decisión

- Curso nuevo `COURSE_GEO` en `js/courses/geometria.js` (id `geo`, «Semestre 1», ícono `↗`, color `#60a5fa`),
  justo después de Cálculo en `COURSES`. El curso viejo «Álgebra Lineal» (`lin`, de relleno) no se toca.
- Las unidades siguen los bloques del cronograma; se parte en dos los bloques largos para que ninguna unidad
  pase de cinco lecciones. Ids `geo-1` … `geo-23`, uno por tema del cronograma.
- Mientras no haya videos (manimgl, plantilla nueva por hacer), cada lección usa sus **escenas de respaldo**:
  intuición primero, fórmula después, y un ejemplo resuelto que no se repite en los ejercicios.
- Ejercicios: sin opción múltiple ni tarjetas; todos con pista; al menos un juego por lección. Lo que es
  inevitablemente 3D (producto vectorial, planos, rectas en el espacio) se practica con cálculos `num`
  y con los mismos juegos en su versión plana.

## Unidades y lecciones

| Unidad (semanas) | Lecciones |
|---|---|
| 1 Sistemas de ecuaciones y matrices (1–4) | geo-1 Sistemas 2×2 y 3×3 y su geometría · geo-2 Rⁿ y álgebra matricial · geo-3 Transpuesta, sistemas m×n y tipos de solución · geo-4 Matrices invertibles y elementales |
| 2 Inversa y determinantes (5–6) | geo-5 Gauss-Jordan para la inversa · geo-6 La función determinante · geo-7 Determinante con matrices elementales · geo-8 Determinante e inversa |
| 3 Vectores y lugares geométricos (7–9) | geo-9 Vectores libres y sus operaciones · geo-10 Vectores en la geometría euclidiana · geo-11 Vectores geométricos y coordenados · geo-12 La recta · geo-13 Lugares geométricos e intersecciones |
| 4 Producto escalar y producto vectorial (10–12) | geo-14 Producto escalar · geo-15 Proyección ortogonal · geo-16 Producto escalar y geometría analítica · geo-17 Producto vectorial · geo-18 Producto vectorial y geometría analítica |
| 5 Vectores en la mecánica (13–14) | geo-19 Fuerzas coplanarias y concurrentes · geo-20 Cinemática · geo-21 Trabajo y momento de una fuerza |
| 6 Las cónicas (15–16) | geo-22 Circunferencia y parábola · geo-23 Elipse e hipérbola |

## Juegos nuevos (reutilizables en todo el curso)

- `fila-a-fila`: matriz (aumentada o no) con operaciones elementales de fila — intercambiar, multiplicar por
  k y sumar k veces otra fila; k es una fracción con dos perillas; deshacer. Meta por ronda: `escalonada`
  o `reducida` (solo cuenta el bloque izquierdo, así sirve para sistemas sin solución y para `[A | I]`).
  Con `det: true` lleva la cuenta `det A = factor · det(actual)`. `grade` repite las operaciones desde la
  matriz inicial (aritmética exacta con fracciones).
- `afina-sistema`: dos rectas de un sistema 2×2 con uno o dos coeficientes ajustables; meta `ninguna`,
  `infinitas` o `punto` (que la solución sea un punto dado).
- `combina-vectores`: perillas a y b para que a·u + b·v llegue a la estrella (combinación lineal, vista por
  columnas de un sistema, coordenadas en otra base, punto de una recta).
- `flecha-vector`: se arrastra la punta (y si se permite, la cola) de una flecha sobre la cuadrícula.
  Califica con el vector esperado o con una condición (`check`) — suma, resta, múltiplos, proyecciones,
  ortogonalidad, área (producto vectorial plano), equilibrio de fuerzas, trabajo y momento. Lecturas en vivo
  opcionales: componentes, norma, producto escalar, producto cruz y suma.
- `conica-viva`: perillas de centro/vértice y de forma para que la cónica coincida con la ecuación o los
  datos (focos, directriz) de cada ronda: circunferencia, parábola (horizontal/vertical), elipse e hipérbola.

## Pruebas

- `tests/juegos-geometria.test.js`: calificación y funciones puras de los cinco juegos.
- `tests/contenido-geometria.test.js`: plan de unidades e ids, sin `mc`, todas con pista que no regala la
  respuesta, al menos un juego por lección y que cada ronda se pueda resolver con los controles.

## Pendiente

Videos de las 23 lecciones (plantilla `video/geo_common.py` por crear, fondo propio del curso).
