# Demostración sobre el juego (en vez de la ventana «Cómo se juega»)

Pedido del usuario (2026-11-18): las instrucciones de un juego deben aparecer **directamente sobre el juego**, no en una
ventana emergente, con una mano (o el cursor) que haga un ejemplo del gesto para que quede clarísimo qué hacer.

- `js/games/kit.js`: `demoPose(u, a, b)` (pura: la mano entra, presiona en `a`, viaja a `b`, suelta y sale), `drawHand`
  (mano que señala; presionada deja un aro) y `drawDemo(p, C, t, d)` (camino punteado, lo que la mano lleva, la mano y un
  rótulo corto). Bucle de 2.6 s; con «reducir movimiento» queda quieta en el destino.
- Un juego la pide con `def.demo(G) → { from, to?, text, ty?, carry?(x, y) }`, en coordenadas del lienzo y con sus
  posiciones reales (de dónde se agarra y a dónde se lleva). `roundsGame` la dibuja en cada pestaña hasta que se toca;
  `questGame`, hasta el primer movimiento. No se dibuja mientras el dedo está abajo.
- El juego queda marcado con `GAMES[x].demo === true`: `guideWanted` ya no abre la tarjeta emergente la primera vez y
  el botón «Cómo se juega» repite la demostración sobre el lienzo (dos vueltas) con `inst.demo()`.
- Hechos con demostración: `globo-lastre`, `voltea-flecha`, `capas-operacion`. Los demás juegos siguen con su tarjeta
  hasta que se les escriba su `demo`. **Juego nuevo = con `demo`.**

Pruebas: `tests/demo-en-juego.test.js`.
