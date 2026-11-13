# Minijuegos con el estilo de los videos

Fecha: 2026-11-13

## Qué se pidió

Que los minijuegos de los ejercicios sigan el estilo de los videos de las lecciones (los «Scale Zoom Explainer»:
azul noche, formas planas, crema, sol, coral, menta y azul, rótulo con barra), que sean coloridos en tema claro y
oscuro, llamativos, con animaciones (anime.js) y que se entiendan bien.

## Decisión

Los 137 juegos leen sus colores de `api.palette` y montan el lienzo con `mountSketch`. El estilo se pone en el kit
(`js/games/kit.js`) y llega a todos sin tocar cada juego.

| Pieza | Cómo |
|---|---|
| Colores | `PALETTES` usa los de `video/*-zoom/flat.js`. Oscuro: fondo `#1D2052`, tinta crema. Claro: papel crema `#FFF6E6`, tinta azul noche y los mismos tonos más oscuros (contraste ≥ 3 sobre el fondo, lo exige `tests/tema-juegos.test.js`). Claves nuevas de adorno: `sun, coral, mint, sky, cream, night, star, halo`. |
| Fondo | Cuando un juego limpia con `p.background(C.bg)`, el kit dibuja encima dos halos de círculos en las esquinas y estrellas que titilan (`drawBackdrop`, `backdropDots`). |
| Letra | Jost, la de los videos: `p.textFont('system-ui')` se cambia por Jost si ya cargó; si no, sigue la del sistema y se cambia al llegar. |
| Rondas | `drawTabs` dibuja fichas: apagada la que falta, rellena la respondida, y la actual con aro color sol que rebota al cambiar. El número usa `inkOn(color)`. |
| Toque | Onda color sol donde el juego agarra o toca algo (cuando su `mousePressed` devuelve `false`). |
| Acierto | `playFx(box, ok)`: aro y confeti de círculos, cuadrados y triángulos sobre el recuadro. |
| Entrada | El lienzo entra subiendo (solo traslación; escalarlo descuadra la lectura del dedo). |
| Enunciado | `.ex-head`: barra color sol a la izquierda del tipo de ejercicio y del enunciado, como el rótulo de los videos. |

Animaciones con anime.js 3.2.2 (`js/vendor/anime.min.js`, MIT, del repositorio `juliangarnier/anime`), dentro de la
app para que funcione sin conexión. `fxTween(obj, props, opts)` anima valores de un objeto; sin anime (pruebas en
Node) o con «reducir movimiento» deja el valor final de una vez. Con «reducir movimiento» no hay titileo, ondas,
confeti ni entrada.

## Para juegos nuevos

- Seguir leyendo los colores de `C` al dibujar; para rellenos vivos usar `C.sun, C.coral, C.mint, C.sky` y para el
  texto encima `inkOn(color)`.
- Para animar algo propio: `fxTween(estado, { x: 10 }, { duration: 400, easing: 'easeOutElastic(1, .6)' })`.

## Piezas de los videos (segunda parte: Álgebra U1 rediseñada a mano)

Al final de `kit.js` hay piezas de dibujo que copian las de los videos. Los 24 juegos de la unidad 1 de Álgebra
(«Sistemas numéricos y axiomas») ya las usan; solo cambió su dibujo, no la lógica ni las zonas de toque.

| Pieza | Para qué |
|---|---|
| `drawTile(p, C, caja, texto, { fill, ink, r, lift, size, ring, k })` | ficha rellena con labio más oscuro abajo. Crema por defecto; color sol la elegida; **coral los negativos y sol el cero** (como en los videos); azul los botones − / +. |
| `drawSlot(p, C, caja, r, col)` | casilla vacía punteada (donde va una ficha). |
| `drawKicker(p, C, texto, x, y, { center })` | rótulo con barrita y versalitas para la instrucción corta del juego. |
| `drawPill(p, C, texto, cx, cy, col, tamaño)` | píldora rellena para el dato que importa (la respuesta en vivo, «meta», «espejo», √n). No se sale del lienzo. |
| `drawDot(p, C, x, y, d, col)` | punto con halo (el punto elegido). Sin halo si taparía números de la recta. |
| `drawNumLine(p, C, { x0, x1, y, min, max }, { step, every, label })` | recta gruesa con números por signo: negativos coral, el cero sol, positivos tinta. Devuelve `X(v)`. |
| `shade(hex, k)` | oscurece o aclara un color (labios, cuerpos con relieve). |

Estas piezas cambian `textAlign`, `textStyle`, `textSize`, relleno y trazo: después de llamarlas, volver a fijar lo
que el siguiente texto necesite.

## Lo que no cubre

Fuera de Álgebra U1, el dibujo propio de cada juego (sus piezas y su distribución) sigue igual: cambia de colores,
letra y fondo, pero no se ha rediseñado juego por juego. El mundo «Razones, proporciones y porcentajes» (29 juegos) se
rediseñó después con las mismas piezas: botones − / + en fichas azules, objetos rellenos (engranajes, tragamonedas
coral, perilla color sol), sellos menta si suben y coral si bajan. Luego Conjuntos (9 juegos): fichas crema que pasan a
color sol al entrar al conjunto, círculos de Venn azul y coral con su letra en una píldora, zonas pintadas color sol.
Siguiente: Progresiones.

## Pruebas

`tests/estilo-video.test.js` (paleta, `inkOn`, estrellas, `fxTween`, confeti, fichas, registro de anime.js) y
`tests/tema-juegos.test.js` (contraste y `--play-bg`).
