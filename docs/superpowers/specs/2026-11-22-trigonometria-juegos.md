# Trigonometría: ejercicios y juegos de todas las lecciones

Fecha: 2026-11-22. Las 19 lecciones del curso de Trigonometría (tres mundos) quedan sin tarjetas de unir parejas y
sin nada que escribir. Cada lección tiene: sus juegos propios de antes (ruedas, cañón, tanque, telaraña…), los cálculos
ya convertidos a «Arma la cuenta» o «Escala la solución», y **un juego nuevo por lección, de último**, hecho con
`questGame` (rondas de dos retos, tres vidas, sin reloj, cartel «Toca para empezar», guía «Cómo se juega»).

## Reglas de diseño

- Cada juego dibuja la idea de la lección y el estudiante construye, compara o decide; las cuentas las hace el juego.
- Nada de teclear ni de opción múltiple escrita: se tocan lados, se mueven perillas − / +, se lanzan cosas.
- El enunciado del ejercicio y el rótulo del juego dicen qué hay que hacer; la pista orienta sin dar la respuesta.
- Los retos no repiten los ejemplos de las escenas de respaldo ni los de los otros ejercicios de la lección.
- Colores del kit (`C.sky`, `C.coral`, `C.mint`, `C.N` para letras; nunca `C.sun` como letra), TeX en los textos.

## Los 19 juegos (un archivo por juego en `js/games/`; ayudas comunes `TK` al final de `kit.js`)

| Lección | Juego | Qué se hace y qué idea evalúa |
|---|---|---|
| `trig-41a` | `quita-vueltas` | Quitar o poner vueltas completas hasta dejar el ángulo en el intervalo pedido: coterminales. |
| `trig-41b` | `rueda-rodante` | Elegir el ángulo que debe girar una rueda para llegar a la bandera: $s = r\theta$. |
| `trig-1` | `toca-lados` | Tocar el lado de arriba y el de abajo de la razón pedida, con el triángulo en cualquier posición. |
| `trig-2` | `figuras-notables` | Sacar cada razón notable tocando lados del medio equilátero (1, √3, 2) o del medio cuadrado (1, 1, √2). |
| `trig-42c` | `multiplica-razon` | Elegir, entre las seis razones, la que convierte el lado conocido en el buscado; el juego calcula. |
| `trig-3` | `proyecta-punto` | Poner el coseno y el seno (con signo) de un punto de la circunferencia y proyectarlo. |
| `trig-43b` | `espejo-cuadrantes` | Reflejar un punto en los ejes hasta el cuadrante pedido y decir cuánto mide su ángulo de referencia (el juego no lo escribe). |
| `trig-44a` | `ola-entre-lineas` | Elegir amplitud y línea media para que la ola toque justo el techo y el piso: rango. |
| `trig-44b` | `crestas-faroles` | Elegir cuántas ondas caben y cuánto se corre la ola para que las crestas caigan en los faroles. |
| `trig-45` | `ventana-inversa` | Recortar un tramo de la gráfica que no repita alturas y las tenga todas: por qué se restringe el dominio. |
| `trig-4` | `escala-triangulo` | Dividir el triángulo (cos, sen, 1) entre cos o entre sen y tocar el lado que quedó valiendo tan, sec, cot o csc. |
| `trig-47b` | `todo-en-senos` | Armar la fracción de cada función (qué va arriba y qué va abajo) y cancelar lo igual de arriba con lo de abajo. |
| `trig-48a` | `rectangulo-suma` | Ponerle su medida a los dos tramos que forman sen(α + β) o cos(α + β), razonando con los triángulos pequeños. |
| `trig-48b` | `tira-doble` | Partir una tira de largo 1 en cos² y sen² para que su diferencia sea el cos 2θ pedido. |
| `trig-49` | `red-periodica` | Atrapar todas las soluciones con redes: primera solución y salto (la solución general); los peces solo se ven al lanzar. |
| `trig-46a` | `pareja-opuesta` | Resolver un triángulo tocando lo que ya se puede calcular: tercer ángulo o lado con una pareja completa. |
| `trig-46b` | `bisagra-area` | Girar un lado hasta la altura que da el área pedida: suelen servir dos ángulos (C y 180° − C). |
| `trig-151` | `parientes-polares` | Llevar un punto al conjugado, al opuesto, a i·z o al inverso de z moviendo módulo y ángulo. |
| `trig-152` | `multiplicador-oculto` | Una figura y su imagen al multiplicarla por w (una o dos veces): tocar w. Girar y estirar; con w² salen las dos raíces cuadradas. |
| `trig-153` | `hermanas-raiz` | Con una raíz n-ésima dada, tocar las demás: reparten la vuelta en n partes iguales. |

Además, algunos de estos juegos se usan con otros retos en una lección vecina para que ninguna quede corta:
`multiplica-razon` (solo sen, cos, tan) en `trig-1`, `proyecta-punto` (primer cuadrante) en `trig-2`, `quita-vueltas`
(en radianes) en `trig-3` y `toca-lados` (csc, sec, cot) en `trig-42c`.

## Datos

`js/courses/trig-juegos.js` (después de `trig.js`): `TRIG_EXTRA[lección]` se añade al final de `ex`. Las 15 tarjetas
`une-parejas` se borraron de `trig.js` y las claves de `SIN_ESCRIBIR` bajaron una posición.

## Pruebas

`tests/trig-juegos.test.js`: cada lección termina en su juego (todos distintos, registrados, con guía), dos rondas o
más, cada reto con solución (`ok(answer(reto))`) y sin resolver al empezar; no quedan `une-parejas`; todo ejercicio
tiene enunciado y pista. En el navegador el robot de `questGame` juega los 19 con `peek().solve`.
