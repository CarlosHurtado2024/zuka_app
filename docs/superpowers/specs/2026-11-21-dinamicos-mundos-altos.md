# Mundos altos: un juego dinámico por lección, escenas de respaldo y división sintética

Fecha: 2026-11-21. Tres pendientes de `2026-11-19-mundos-altos`:

1. Un juego dinámico propio por lección en los cinco mundos (Taller de los Bloques, Fuente de la Parábola, Cordillera
   Cúbica, Río de Asíntotas, Selva Exponencial), como pide la regla del proyecto.
2. En la división sintética se llegaba al residuo probando valores (resuelto en `2026-11-20-jefes-valle-a-escalera`:
   solo cuatro divisiones por ronda y los residuos quedan anotados para razonar con su signo).
3. Las escenas de respaldo seguían con ejemplos viejos.

## Escenas de respaldo

`SC` en `js/courses/mundos-altos.js`: las 19 lecciones muestran, si el video no carga, la misma historia y los mismos
ejemplos de su video zoom (`video/valle-zoom/films/<nombre>.js`, `FILM.NARR`): la caja de Caro, la mesa de Beto, el
binomio de Ana, el montón de bloques, el acertijo de i, la balanza de baldosas, el chorro de la fuente, la cordillera,
la apuesta en la niebla, los ceros perdidos, el sendero junto al río, el estanque, el bote, el mapa del río, los
lirios, los dos bancos, el pedido de mil lirios y triplicar el ahorro. Los ejercicios que coincidían con esos ejemplos
se cambiaron.

## Armazón `questGame(def)` (al final de `kit.js`)

Juego de acción **sin prisa** por retos: rondas con dos o tres retos, tres vidas por ronda, cartel «Toca para
empezar», pausa corta tras cada acierto (el reto resuelto se queda en pantalla), resumen al terminar. Usa `makeArcade`.
El juego solo da `init`, `ok` y `answer` (puras, se prueban en Node), `solution`, `prompt`, `draw`, `press` y `peek`
(con `solve`: las cajas que hay que tocar, para el robot). Estado: `{ done: [retos resueltos por ronda] }`.

## Los 19 juegos (uno por lección, mecánica distinta, ligados al video)

| Lección | Juego | Qué se hace |
|---|---|---|
| `alg-23a` | `torre-grados` | Apilar los términos de mayor a menor exponente; el primero dice el grado. |
| `alg-3` | `arma-la-mesa` | Elegir las piezas que completan la mesa que creció: dos tablas a·x y la esquina a². |
| `alg-24c` | `camino-pascal` | Trazar todos los caminos hasta una casilla del triángulo: su número es el coeficiente. |
| `alg-24b` | `reparte-barras` | Pasar barras de un lado al otro hasta que el hueco se llene justo, o decir «No se arma». |
| `alg-23c` | `gira-complejos` | Llevar un complejo a la estrella con × i (cuarto de vuelta), × (−1) y conjugado, en pocos movimientos. |
| `alg-1` | `balanza-cajas` | Quitar lo mismo de los dos platillos y repartir hasta dejar una caja sola. |
| `alg-4a` | `apunta-chorro` | Tocar el vértice del chorro en la cuadrícula y lanzarlo. |
| `alg-4` | `donde-cae` | Poner baldes donde cae el agua: una raíz puede no servir, ser doble o no existir. |
| `alg-23b` | `empaca-filas` | Empacar bloques en filas del ancho del divisor; lo que no alcanza es el residuo. |
| `alg-92` | `sondea-niebla` | Alumbrar pocas columnas del terreno y poner banderas en los cruces, razonando con los signos. |
| `alg-93` | `cruza-o-rebota` | Decidir en cada cero si la montaña cruza o rebota, y dibujarla. |
| `alg-25a` | `rio-o-hueco` | Guiar a Beto paso a paso: caminar, saltar un hueco o parar en un río. |
| `alg-25b` | `llena-estanque` | Partir el estanque en un denominador común y dejar pasar las horas de las dos llaves. |
| `alg-101` | `bote-corriente` | Elegir la corriente; el bote sale por sustitución; zarpar para ver si cumple la otra pista. |
| `alg-102` | `cruce-curvas` | Mover una mira en la niebla y marcar donde las dos alturas son iguales (dos, uno o ningún cruce). |
| `alg-71` | `lirios-laguna` | Retroceder el calendario de una laguna que se duplica hasta el día pedido. |
| `alg-13b` | `dos-bancos` | Apostar en qué año un ahorro llega a su meta, con interés simple o compuesto. |
| `alg-72` | `regla-de-calculo` | Multiplicar y dividir corriendo una regla de potencias: sumar distancias es sumar logaritmos. |
| `alg-73` | `piedras-selva` | Cruzar pisando solo las soluciones que sirven: las extrañas quitan una vida. |

Todos van de últimos en su lección (`DYN` en `mundos-altos.js`), con pista, explicación y guía «Cómo se juega».
Ninguno tiene reloj: nada se mueve solo y todo espera al estudiante.

## Pruebas

`tests/mundos-altos.test.js`: cada lección de los cinco mundos termina con un juego `questGame` distinto, sin reloj,
registrado, con dos rondas o más y retos con solución (`ok(answer(reto))`); la calificación cuenta retos resueltos por
ronda; hay casos para pensar (lo que no se arma, lo que no cae, lo que no se corta, soluciones extrañas, sendero sin
río); las escenas de respaldo tienen de 5 a 6 escenas, KaTeX parejo y los personajes del video. En el navegador un robot
juega cada uno con `peek().solve` y comprueba que un error quita una vida.

## Ajustes tras la revisión fresca

- **Armazón**: al pasar de ronda (o perderla) el reto nuevo empieza limpio; antes se dibujaba resuelto con el estado
  del reto anterior, debajo del cartel. Un toque en zona vacía del lienzo ya deja desplazar la lección.
- `cruce-curvas`: el puente se recorta al cuadro (la recta tangente se veía torcida y cortaba dos veces).
- `dos-bancos`: una apuesta fallida también corre los años hasta el año apostado (las cuentas las hace el juego).
- `arma-la-mesa`: la mesa muestra cualquier pieza elegida, encaje o no; ya no delata cuál es la buena.
- `llena-estanque`: lo que llena cada llave en partes del estanque solo se ve tras dejar pasar una hora, y las partes
  empiezan en el menor de los dos tiempos (menos toques).
- `donde-cae`: las ecuaciones son chorros de verdad (abren hacia abajo).
- Retos que repetían un ejercicio de su lección: cambiados en `arma-la-mesa`, `regla-de-calculo` y `piedras-selva`.
- `cruza-o-rebota`: las fichas de dos ceros cercanos ya no se enciman. `balanza-cajas`: el enunciado no repite la
  ecuación y cinco cajas caben. `gira-complejos`: el signo menos es «−».
- Se dejó como está, por ser «comparar» y no adivinar: `cruce-curvas` muestra las dos alturas en números y
  `reparte-barras` dice si sobran o faltan cuadritos.
