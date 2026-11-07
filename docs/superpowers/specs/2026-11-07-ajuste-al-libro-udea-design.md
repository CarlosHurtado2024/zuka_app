# Ajuste de los cursos de Álgebra y Trigonometría al «Manual de Álgebra y Trigonometría» (UdeA, 2024)

Fecha: 2026-11-07 · Estado: ejecución autónoma (el usuario pidió implementar sin preguntar)

## 1. Objetivo

Reorganizar los dos cursos para que sus unidades sigan las unidades del cuaderno de trabajo del
Instituto de Matemáticas (Edwin Zarrazola, UdeA): Parte I Aritmética (unidades 1–3), Parte II
Funciones (5–7) y Parte III Polinomios (9–11) para Álgebra; Parte IV Trigonometría (13–15) para
Trigonometría. Las autoevaluaciones (4, 8, 12, 16) no son unidades del curso.

Reglas: **no se borra ninguna lección**; las existentes se mueven (mismo `id`, así el progreso
guardado se conserva) y las secciones del libro que no tenían lección reciben una lección nueva
con escenas de texto (`sc`) y ejercicios tomados o inspirados en los «Problemas por resolver» y
«Problemas adicionales» del libro (opción múltiple, numéricos, tarjetas V/F o clasificar). Esas
lecciones nuevas quedan listas para recibir video y juegos p5 más adelante. Cuando un problema
del libro tiene la respuesta mal entre sus opciones (p. ej. 9.5, 9.8, 9.11, 10.4, 10.7, 15.3),
se usa una variante propia con los mismos conceptos.

## 2. Curso de Álgebra (Partes I–III)

| Unidad (libro) | Lecciones (en orden) |
|---|---|
| 1 Números reales, potenciación y radicación | alg-11 (existente) · **alg-12b Axiomas de campo y orden** · alg-21a · alg-21b · alg-22a · alg-22b |
| 2 Expresiones algebraicas y números complejos | alg-23a · alg-3 · alg-24b · alg-24c · alg-25a · alg-25b · **alg-23c Números complejos** · alg-1 · alg-4 |
| 3 Intervalos, inecuaciones, razones y proporciones | alg-26c · **alg-32 Intervalos e inecuaciones** · alg-12 · alg-13 · alg-13b |
| 5 Relaciones, funciones y operaciones | **alg-51 Gráficas de ecuaciones y rectas** · **alg-52 Funciones, dominio y rango** · **alg-53 Operaciones y composición** |
| 6 Funciones inversas | **alg-61 Transformaciones y tipos de funciones** · **alg-62 Función inversa** |
| 7 Funciones exponenciales y logarítmicas | **alg-71 Función exponencial** · **alg-72 Logaritmos y sus propiedades** |
| 9 Algoritmo de la división y ceros polinomiales | alg-23b · **alg-92 Residuo, factor y división sintética** · **alg-93 Ceros de un polinomio** |
| 10 Sistemas de ecuaciones y fracciones parciales | **alg-101 Sistemas de ecuaciones lineales** · **alg-102 Sistemas no lineales y fracciones parciales** |
| 11 Sucesiones, sumatoria y productoria | alg-14 · alg-15 |

## 3. Curso de Trigonometría (Parte IV)

| Unidad (libro) | Lecciones (en orden) |
|---|---|
| 13 Funciones trigonométricas, propiedades y gráficas | trig-41a · trig-41b · trig-1 · trig-2 · trig-42c · trig-3 · trig-43b · trig-44a · trig-44b |
| 14 Funciones trigonométricas inversas y aplicaciones | trig-45 · trig-4 · trig-47b · trig-48a · trig-48b · trig-49 · trig-46a · trig-46b |
| 15 Forma polar de números complejos | **trig-151 Forma trigonométrica de un complejo** · **trig-152 Producto, cociente y raíces: De Moivre** |

## 4. Motor y pruebas

Sin cambios de motor: `lessonsOf(c)` aplana las unidades y el desbloqueo sigue el orden plano.
Las pruebas que buscaban lecciones en `units[0]` pasan a buscar en todas las unidades. Se añade
`tests/estructura.test.js`: ids únicos, cada lección con `clip` y `ex`, y el orden de unidades
de cada curso igual al de esta spec. De ahora en adelante, los videos y juegos nuevos toman sus
ejemplos y ejercicios del libro (o se inspiran en él), sin repetir en los ejercicios los ejemplos
resueltos en el video.
