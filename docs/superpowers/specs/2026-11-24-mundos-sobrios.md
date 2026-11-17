# Mundos con nombres y láminas sobrias

Fecha: 2026-11-24. Pedido: que los nombres y el diseño de los mundos no se vean tan infantiles.

## Qué se veía infantil

Los nombres eran lugares de cuento («Pradera de Venn», «Mercado de las Razones», «Selva Exponencial», «Fábrica de
Funciones») y los dibujos, paisajes en tonos pastel con sol, nubes, colinas y banderitas. Funcionaban para un público
de primaria; Zuka es para estudiantes de universidad.

## Nombres

El nombre del mundo dice la idea central, como el título de un capítulo, y no repite el título de la unidad que va
debajo (ese sigue siendo el temario). Nada de lugares inventados.

| Mundo | Antes | Ahora |
|---|---|---|
| conjuntos | Pradera de Venn | Teoría de Conjuntos |
| numeros | Valle de los Números | La Recta Real |
| razones | Mercado de las Razones | Escalas y Proporciones |
| potencias | Torres de Potencias | Exponentes y Radicales |
| progresiones | Escalera de Sigma | Sucesiones y Series |
| polinomios | Taller de los Bloques | Álgebra de Polinomios |
| cuadraticas | Fuente de la Parábola | Parábolas y Complejos |
| grado-superior | Cordillera Cúbica | Raíces de Polinomios |
| racionales | Río de las Asíntotas | Fracciones Algebraicas |
| exp-log | Selva Exponencial | Crecimiento Exponencial |
| ondas | Mar de las Ondas | Funciones Periódicas |
| inversas | Faro de los Ángulos | Identidades y Triángulos |
| polar | Galaxia Polar | El Plano Complejo |
| intervalos | Sendero de los Intervalos | Intervalos y Distancias |
| funciones | Fábrica de Funciones | Lenguaje de Funciones |
| limites | Puente del Límite | Aproximación y Límite |
| derivada | Cumbre de la Tangente | Razón de Cambio |
| aplicaciones | Mirador del Máximo | Optimización |
| sistemas | Cruce de las Rectas | Álgebra Matricial |
| determinantes | Templo del Determinante | Inversión y Determinante |
| vectores | Archipiélago Vectorial | Geometría Vectorial |
| productos | Forja del Producto | Productos Vectoriales |
| mecanica | Puerto de las Fuerzas | Fuerza, Trabajo y Momento |
| conicas | Órbita de las Cónicas | Secciones Cónicas |
| cinematica | Pista de la Cinemática | Movimiento en el Plano |
| dinamica | Rampa de Newton | Leyes de Newton |
| integral | Campos del Área | Acumulación y Área |
| lineal | Plano Transformado | Transformaciones Lineales |

Los jefes finales dejan de nombrar lugares: «El Guardián de la Pradera» pasa a «El Guardián de los Conjuntos», y así
en todos (los de Trigonometría conservan su figura: el Kraken, el Vigía del Faro y la Nebulosa). Sus escenas de
presentación ya no hablan de praderas, fuentes ni selvas. Los resúmenes en PDF llevan el nombre nuevo en la portada.

## Láminas

Cada mundo es una **lámina técnica**: fondo de tinta oscura teñido con el color del mundo (degradado radial), una
retícula fina como papel milimetrado y, encima, el diagrama de la idea central dibujado a línea fina en tinta clara,
con un solo color de acento y letras en cursiva de libro (serif). Nada de sol, nubes, colinas ni banderas. Ejemplos:
tres círculos de Venn con la intersección resaltada; la recta real con √2 trazada con compás; triángulos semejantes;
cuadrados anidados de lados 1, 2, 4, 8; el cuadrado que se llena con ½ + ¼ + …; el cuadrado de (a + b)²; la parábola
con su eje; la cúbica con tres ceros; la hipérbola con sus asíntotas; eˣ y ln x reflejadas en y = x; el círculo
unitario que se desenrolla en una onda; el triángulo con θ; las raíces sextas de la unidad; las sumas de Riemann; la
cuadrícula transformada…

- La idea va en el centro (x entre 44 y 116): en el mapa la lámina se recorta en un círculo.
- Como la lámina trae su propio fondo oscuro, se ve igual en tema claro y oscuro (como una tarjeta oscura).
- `wPlate(id, color, cuerpo)` arma el SVG (`data-style="lamina"`); ayudas `L` (trazo), `D` (punto), `T` (letra
  cursiva), `A` (flecha).

## Pruebas

`tests/mundos-sobrios.test.js`: los 28 mundos tienen nombre nuevo, sin palabras de lugar de cuento; todas las láminas
son del estilo nuevo (fondo de tinta, sin sol, nubes ni banderas); los jefes y sus escenas no nombran los lugares
viejos; la portada de cada resumen lleva el nombre del mundo.
