# Preuniversitario UdeA · mundo 2 «Geometría» (lecciones 1 y 2)

Pedido del usuario (2026-11-18): seguir con Geometría el estándar del mundo 1 (spec `2026-11-18-preuda-mundo-1`): 7 u 8
ejercicios **distintos** por lección, todos gráficos y de arrastrar (nada de filas de botones ni de escoger entre opciones),
con pista, y al final un **juego en movimiento**. Las instrucciones van sobre el juego (`demo`, spec `2026-11-18-demo-en-juego`).

Esta tanda cubre `pu-ge-1` y `pu-ge-2`. Quedan `pu-ge-3` a `pu-ge-6` (semejanza y escala, perímetros y áreas, áreas
sombreadas, volúmenes).

## Piezas comunes: `js/games/geo-kit.js`

`GEO` (va después de `kit.js`): ángulos en grados, antihorario desde la derecha. `rad`, `at` (punto a distancia r en la
dirección d), `angOf` (dirección de un punto visto desde otro), `snap`, `wedge` (sector con su medida), `line` (recta por un
punto) y `knob` (manija de arrastre). Es el kit de dibujo del mundo: los juegos de las lecciones 3 a 6 lo reutilizan.

## Juegos nuevos

| Juego | Armazón | Qué se manipula | Idea |
|---|---|---|---|
| `tijera-angulos` | `roundsGame` | la punta de una recta que gira sobre otra | opuestos por el vértice iguales, vecinos suman 180°, complementarios 90°; el ángulo preguntado dice «?» hasta comprobar |
| `paralelas-gira` | `roundsGame` | la punta de la recta de abajo | con paralelas, correspondientes y alternos internos iguales y conjugados suman 180°; si no, una flecha marca dónde se cruzan |
| `apice-triangulo` | `roundsGame` | el vértice de arriba de un triángulo | `falta`: los tres suman 180° (el de arriba dice «?»); `tipo`: isósceles, rectángulo, equilátero (rayitas en lados iguales) |
| `suma-poligono` | `roundsGame` | diagonales desde un vértice | n − 2 triángulos de 180°: (n − 2)·180° |
| `cuadrados-pitagoras` | `roundsGame` | las puntas de los dos catetos | cada cateto lleva su cuadrado entero con casillas; una tira las suma frente a las de la hipotenusa pedida |
| `escalera-pared` | `roundsGame` | el pie de una escalera de largo fijo | pie² + altura² = largo²; la punta sube sola hasta la ventana |
| `billar-rebote` | `questGame` (en movimiento) | la mira sobre la banda; al soltar sale la bola | ángulo de llegada = ángulo de salida; al fallar queda dibujado el tiro y una equis donde cayó |

Reglas: los ángulos saltan de 5° en 5° y las longitudes de 1 en 1, así toda ronda tiene solución alcanzable con el dedo; el
vértice de `apice-triangulo` nunca tiene que salirse del lienzo (alto ≤ 0.87 de la base, lo comprueba la prueba); la
cuadrícula de `cuadrados-pitagoras` se ajusta a la ronda (`size`); el billar no apura: la bola solo se mueve cuando el
estudiante suelta la mira.

## Lecciones

- **`pu-ge-1` Ángulos y paralelas**: `rueda-angulo` (en grados), `tijera-angulos`, `paralelas-gira`, `apice-triangulo`
  (`falta`), `suma-poligono`, `rieles-paralelos`, y al final `billar-rebote`.
- **`pu-ge-2` Triángulos y Pitágoras**: `apice-triangulo` (`tipo`), `cuadrados-pitagoras`, `escalera-pared`, `compas-raiz`,
  `cuerdas-iguales`, `acorrala-raiz`, y al final `vuela-precios` (ternas).

Los ejemplos de las escenas (hexágono de 720°, escalera de 13 m a 5 m de la pared) no se repiten en los ejercicios.

## Pruebas

`tests/preuda-geometria.test.js`: el estándar de las dos lecciones, registro y guía de los juegos nuevos, la lógica pura de
cada uno con los datos reales de la lección (se gana con la respuesta y no con una vecina), y los datos de los juegos de la
biblioteca. En el navegador: cada juego jugado con arrastres simulados, `tests/robot-colores.js` y `tests/robot-encimados.js`
a 300 px en los dos temas.
