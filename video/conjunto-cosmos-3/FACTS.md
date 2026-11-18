# Datos del video «Tres luces, ocho colores»

Cada dato que aparece en pantalla o en la narración, con su respaldo. Los dibujos (píxeles, proyectores, curvas de los
conos) son esquemas: no están a escala.

| Dato | Respaldo |
|---|---|
| Una pantalla forma los colores con luces rojas, verdes y azules; cada punto (píxel) es un grupo de esas luces | Síntesis aditiva del color en pantallas RGB |
| No hay luz amarilla: el amarillo se ve cuando están prendidas la roja y la verde | Síntesis aditiva: rojo + verde = amarillo |
| Londres, mayo de 1861: James Clerk Maxwell proyecta la primera fotografía en color | Conferencia en la Royal Institution, 17 de mayo de 1861; las placas las tomó Thomas Sutton |
| Eran tres fotos en blanco y negro tomadas y proyectadas con filtros rojo, verde y azul; el objeto era una cinta de tartán | Maxwell, «On the theory of three primary colours» (1861) |
| El ojo humano tiene tres tipos de conos | Teoría tricromática (Young, 1802; Helmholtz); conos S, M y L con máximos cerca de 420–440, 530–535 y 560–565 nm |
| Con cada luz prendida o apagada, un píxel hace ocho colores: negro, rojo, verde, azul, amarillo, cian, magenta y blanco | 2 · 2 · 2 = 8 combinaciones; rojo + azul = magenta, verde + azul = cian, las tres = blanco |
| R ∪ G tiene 6 elementos, R ∩ G = {amarillo, blanco}, R − G = {rojo, magenta}, Rᶜ = {verde, cian, azul, negro}, R △ G = {rojo, magenta, verde, cian} | Se calcula con los conjuntos R = {rojo, magenta, amarillo, blanco} y G = {verde, cian, amarillo, blanco} (prueba `tests/conjunto-cosmos-23.test.js`) |
| n(R ∪ G) = n(R) + n(G) − n(R ∩ G) = 4 + 4 − 2 = 6 | Principio de inclusión y exclusión para dos conjuntos |

Lo que es recurso del video: el número de «zoom» de la primera escena, la altura de las curvas de los conos (todas
iguales, para comparar solo dónde está el máximo) y el dibujo del tartán. Una pantalla real gradúa cada luz en muchos
niveles: aquí cada luz solo está prendida o apagada, que es lo que hace falta para hablar de conjuntos.

Los ejercicios de la lección usan nombres de colores como elementos sueltos de un conjunto (rojo, azul, verde…), pero
no la situación del video: luces, píxeles, mezcla de colores, amarillo, cian o magenta no aparecen en ellos.
