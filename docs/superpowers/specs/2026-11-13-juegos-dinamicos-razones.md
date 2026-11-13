# Juegos dinámicos de Razones, proporciones y porcentajes

Fecha: 2026-11-13. Sigue a `2026-11-13-juegos-dinamicos-valle.md` (misma base `makeArcade` y mismas reglas comunes).

## Decisión

Un juego de acción como **último ejercicio** de cada lección del mundo. Seis mecánicas que no se habían usado (ya
están: canasta, globos, luciérnagas, buzo, carriles, aguja, cañón, salto y serpiente):

| Lección | Juego | Mecánica | Qué practica |
|---|---|---|---|
| `alg-12` Razones | `sirve-la-razon` | **Mantener presionado** para servir en un vaso con marcas y soltar en la cantidad justa | mantener una razón («por cada 2 de jugo, 3 de agua») |
| `alg-12e` Proporciones | `corta-proporciones` | **Cortar** con el dedo fichas que saltan (como frutas): solo las que forman proporción con la de arriba | fracciones equivalentes / razones iguales |
| `alg-12f` Regla de tres | `resortera-tres` | **Estirar y soltar** una resortera: el estirón decide hasta dónde llega | regla de tres directa: «con 2 de estirón llega a 6 m; ¿cuánto para 15 m?» |
| `alg-13` Porcentajes | `caja-veloz` | **Teclado numérico** contra la paciencia del cliente | calcular un porcentaje y qué porcentaje es |
| `alg-13c` Aumentos y descuentos | `vuela-precios` | **Volar a toques** (cada toque es un aleteo) para pasar por el aro del precio correcto | precio con descuento, con aumento y el factor |
| `alg-13d` Cambios sucesivos | `rompe-cambios` | **Paleta y pelota**: rebotar la pelota hacia el ladrillo del resultado | dos cambios seguidos se multiplican, no se suman |

Estado de los seis: `{ done: [n por ronda] }`; correcto si cada ronda resolvió todas sus preguntas. Tres vidas por
ronda; sin vidas la ronda se reintenta. Dejar pasar (fichas que caen sin cortar, aros que se van, la pelota que se
cae, el cliente que se cansa) no quita vida: la pregunta vuelve.

## Contenido

No repite los ejemplos de los videos (listas de `tests/razones-desde-cero.test.js` y `tests/porcentajes-desde-cero.test.js`).

## Pruebas

`tests/juegos-dinamicos-razones.test.js`: lógica pura de cada juego, estado inicial no ganador, contenido válido (la
cantidad a servir cabe en el vaso, las fichas buenas forman proporción y las trampas no, el estirón es alcanzable, las
respuestas del teclado son enteros, una sola opción correcta) y que las seis lecciones terminen con su juego. En el
navegador, un robot los juega completos con `peek()`.

## Ajustes tras jugarlos con el robot y la revisión

- `rompe-cambios`: la pelota ya no sale sola; se pone la paleta y sale al soltar el dedo (antes, quien no movía la
  paleta a tiempo perdía una vida). El aviso del error dice «aplica un cambio y luego el otro».
- `resortera-tres`: el estirón cuenta arrastrando hacia atrás o hacia abajo y la resortera está más adentro: antes no
  había espacio para los estirones grandes.
- `sirve-la-razon`: se sirve a velocidad fija (2.2 unidades por segundo) con margen de media unidad; en los vasos
  grandes la ventana para soltar era de una décima de segundo.
- `vuela-precios`: el piso y el techo quedan justo después de los aros de los extremos, así que dejarse caer pasa por
  el aro de abajo. Las píldoras de precio aparecen con su aro, no antes.
- `corta-proporciones`: apoyar el dedo no corta; solo deslizarlo.
- `caja-veloz`: la pantalla es una tarjeta con borde (en el tema oscuro no se distinguía del fondo).
- Con el robot a velocidad real, un jugador perfecto tardó entre 20 y 84 segundos por juego, sin perder vidas por
  accidente. Tras el cambio de lanzamiento de `rompe-cambios` solo se comprobó el lanzamiento y el rebote, no la
  partida completa (el panel del navegador quedó en segundo plano).
