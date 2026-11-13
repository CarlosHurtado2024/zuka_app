# Juegos dinámicos del Valle de los Números

Fecha: 2026-11-13. Sigue a `2026-11-13-juegos-dinamicos-pradera.md` (mismas reglas comunes).

## Decisión

Un juego de acción como **último ejercicio** de cada lección del mundo (Álgebra unidad 1). Seis mecánicas distintas
entre sí y distintas de las tres de Pradera (canasta, globos, luciérnagas):

| Lección | Juego | Mecánica | Qué practica |
|---|---|---|---|
| `alg-11` Naturales y enteros | `buzo-enteros` | Un buzo sube y baja (arrastrar en vertical) por una recta de enteros con el nivel del mar en 0; vienen tres perlas a distintas alturas y hay que estar en la del resultado | subir/bajar en la recta, opuestos, restas que dan negativo |
| `alg-11b` Racionales | `carrera-fracciones` | Corredor en tres carriles; se toca un carril para pasar por la puerta que vale lo mismo | fracción ↔ decimal, fracciones equivalentes, enteros disfrazados |
| `alg-11c` Irracionales y reales | `frena-aguja` | Una aguja recorre la recta numérica de lado a lado; se toca para frenarla en el número pedido | ubicar √n y π entre enteros |
| `alg-12b` Axiomas de campo | `dispara-inverso` | Cañón que apunta: se dispara una ficha hacia burbujas que se mueven | opuesto (suma 0), recíproco (producto 1), neutros |
| `alg-12c` Consecuencias | `salta-signos` | Corredor de un solo botón: saltar las fichas cuyo resultado tiene el signo de la misión y atrapar las demás | ley de signos, opuesto del opuesto, restar = sumar el opuesto |
| `alg-12d` Orden y valor absoluto | `serpiente-orden` | Serpiente en una cuadrícula que gira hacia donde se toca; come los números de menor a mayor | orden en enteros, fracciones y decimales, valor absoluto |

## Base común (kit)

`makeArcade(n, vidas, api, on)` lleva la fase (`idle`, `play`, `won`, `lost`, `all`), la ronda, las vidas, el aviso y
la cámara lenta de «reducir movimiento»; `drawArcadeHead`, `drawArcadeBanner`, `arcadeToast` y `arcadeStop` dibujan lo
común y paran el dibujo al terminar. Cada ronda tiene una cola de preguntas: la que se falla o se deja pasar vuelve al
final; la ronda se gana al resolverlas todas.

Estado de los seis: `{ done: [n por ronda] }`. Correcto si cada ronda resolvió todas sus preguntas.

## Contenido

No repite los ejemplos de los videos (listas de `tests/sistemas-numericos.test.js` y `tests/axiomas-desde-cero.test.js`):
`alg-11` sin fracciones; `alg-11c` solo raíces no exactas y π, y las pistas usan cuadrados de enteros; `alg-12b` sin ley
de signos ni orden.

## Pruebas

`tests/juegos-dinamicos-valle.test.js`: lógica pura de cada juego, estado inicial no ganador, contenido válido (índices,
trampas distintas de la respuesta y dentro del rango, tolerancias) y que las seis lecciones terminen con su juego, con
pista. En el navegador, un robot los juega completos con `peek()`.

## Ajustes tras jugarlos con el robot y la revisión

- `buzo-enteros` y `carrera-fracciones`: lo ya resuelto sale rápido de la pantalla (antes cada pregunta tardaba el doble).
- `dispara-inverso`: las cuatro burbujas van en una sola fila que pasa como una cinta; en dos filas, las de adelante
  tapaban a las de atrás y un tiro bien apuntado costaba una vida. Tras un error la pregunta vuelve al final.
- `salta-signos`: la ventana para saltar era de 0.2 s; ahora es de medio segundo (salto más largo, ficha más rápida y
  más baja) y la operación se anuncia en la casilla «VIENE» antes de que entre. Solo cuenta como saltada si de verdad
  se ve por encima de la ficha.
- `frena-aguja`: la aguja tarda lo mismo por unidad en todas las rondas (la recta de −4 a 4 iba al doble de rápido), y
  la franja de dónde iba el número solo se muestra al acertar.
- `serpiente-orden`: el perdón tras un mordisco equivocado vale solo para esa ficha.
- Tiempos de un jugador perfecto (robot, a velocidad real): entre 19 y 69 segundos por juego.
