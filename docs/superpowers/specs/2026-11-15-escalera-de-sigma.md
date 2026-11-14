# Escalera de Sigma: ejercicios y juegos dinámicos sin prisa

Fecha: 2026-11-15. Mundo «Escalera de Sigma» (unidad `progresiones` de Álgebra): `alg-14` sucesiones y progresiones
aritméticas, `alg-14b` suma aritmética, `alg-14c` progresiones geométricas, `alg-14d` suma geométrica e infinita y
`alg-15` sumatoria y productoria. Sigue la regla «entender, no mecanizar» (`2026-11-14-juegos-conceptuales-valle`).

El mundo ya tenía sus juegos rediseñados y un juego dinámico por lección (`2026-11-13-juegos-dinamicos-progresiones`),
pero quedaban tres cosas por arreglar: los dinámicos apuraban (una mecha, un reloj, una garza, una cinta que corre),
había seis cálculos sueltos y dos juegos de tarjetas, y siete ejercicios de `alg-15` no tenían pista.

## Juegos nuevos (con `roundsGame`)

| Juego | Lecciones | Idea |
|---|---|---|
| `cuenta-saltos` | `alg-14`, `alg-14b`, `alg-14c` | La trampa de contar términos en vez de saltos. Se eligen los saltos y el juego dibuja los postes, hace la cuenta y dice en qué término se cayó. Modo `value`: caer en el término n (n − 1 saltos; con `geo`, n − 1 multiplicaciones). Modo `count`: llegar al último número y decir cuántos términos son (saltos + 1). |
| `resta-corrida` | `alg-14d` | El truco de la suma geométrica: r·S es la misma lista corrida un lugar. Se tachan las columnas con dos números iguales y sobreviven el último de arriba y el primero de abajo; el juego termina la cuenta. |
| `parte-sigma` | `alg-15` | Σ (c·k + d) dibujada por columnas: c·k piezas azules y d amarillas. Se escribe como a·Σk + b: las amarillas se repiten una vez por cada k (la constante suma d·n, no d). |

## Juegos dinámicos, ya sin prisa

| Juego | Antes | Ahora |
|---|---|---|
| `traza-progresion` | Una mecha quemaba el camino y lo borraba. | Sin mecha: se puede levantar el dedo y pensar. |
| `encesta-suma` | Reloj de 20 s por tiro. | Sin reloj. |
| `rana-zenon` | Una garza alcanzaba a la rana y devolvía la pregunta. | Sin garza: se salta las veces que haga falta. |
| `maquina-sigma` | Las fichas pasaban por una cinta que corría. | Bandeja quieta de una o dos filas de cuatro fichas. |
| `dobla-fichas` | No tenía reloj. | Solo cambia el cartel. |

Todos dicen «Sin prisa» en el cartel de inicio. Se conservan las tres vidas por ronda y el reintento de la ronda.

## Contenido

- `alg-14`, `alg-14b`, `alg-14c`: el cálculo suelto de cada una pasa a ser `cuenta-saltos`.
- `alg-14d`: la suma de seis términos pasa a `resta-corrida`; se quita el cálculo del decimal periódico (el video ya
  trabaja 0.333…); queda un solo cálculo, el de la pelota que rebota.
- `alg-15`: `parte-sigma` reemplaza a las tarjetas de verdadero o falso, se quitan las tarjetas de Σ o Π (lo cubre
  `maquina-sigma`) y los cinco ejercicios que no tenían pista ya la tienen. Quedan siete ejercicios.
- El mundo queda con 27 ejercicios: 26 juegos y un cálculo, todos con pista.

## Pruebas

`tests/escalera-de-sigma.test.js`: sin opción múltiple ni tarjetas, pista y explicación en cada ejercicio, los cinco
dinámicos sin reloj ni mecha ni garza ni cinta, lógica pura de los tres juegos nuevos y validez de sus rondas (incluidas
las trampas: n saltos, tantos términos como saltos, la constante una sola vez). Se ajustaron
`tests/progresiones-desde-cero.test.js`, `tests/juegos-dinamicos-progresiones.test.js` y `tests/leccion-sumatoria.test.js`,
que describían lo que se quitó. En el navegador, `tests/robot-torres.js` también resuelve los juegos de este mundo.

## Ajustes tras la revisión

- Tres pistas seguían hablando de la mecha, la garza y la cinta: ya no.
- Ejemplos que salían en los videos: la ronda Σ (k + 4) de 1 a 6 (su parte constante era Σ 4 = 24) pasa a k + 5; la
  lista 2, 6, 18… (medios entre 2 y 162) pasa a 3, 12, 48… en `cuenta-saltos` y a 4, 12, 36, 108 en `resta-corrida`.
- `cuenta-saltos`: los postes no llevan número hasta comprobar y el texto no dice en qué término se cayó (antes bastaba
  subir hasta leer el número pedido); con razón dice «multiplicaciones»; caben los 15 postes; los dos controles ya no se
  enciman al cambiar el tamaño del lienzo.
- `maquina-sigma`: sin las rayitas de la cinta; las zonas de toque de las dos filas ya no se pisan.
- Texto sobre fondo claro: el amarillo de relleno no se usa para letras (`C.N`).
- Queda igual: en `traza-progresion` y `rana-zenon` quedó algo de código sin uso de la mecha y la garza (no dibuja ni
  cambia nada). Después de estos ajustes no se sacaron capturas nuevas: el robot volvió a resolver los juegos tocados.
