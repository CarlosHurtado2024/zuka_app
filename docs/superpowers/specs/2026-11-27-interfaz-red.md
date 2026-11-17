# Interfaz «red»: neón sobrio y logo de cerebro en malla

Pedido del usuario (2026-11-17), con un pantallazo y un video de referencia (`Downloads/video cerebro.mp4`): un cerebro
de malla (nodos y aristas finas, casi blancas) sobre negro azulado, con un tallo azul hielo; en el video las caras de la
malla se van llenando de color (blanco, hielo, coral, amarillo, ciruela).

> «Que no se vea tan infantil… más relacionado con este tema, como neón, más profesional, más seria, más acorde con los
> videos que van a quedar con fondo oscuro. Mantén el nombre Zuka y quiero que el logo sea más parecido a ese cerebro.»

## Qué se busca

- La app deja de parecer un juguete: fuera la mascota con ojos, los botones con «labio» (sombra dura hacia abajo), los
  bordes de 2 px, los nodos de caramelo y las letras de peso 800.
- Un solo motivo, el del logo: **una red de nodos unidos por aristas finas que se enciende a medida que se aprende.**
  El camino de lecciones es esa red: nodo por hacer = aro fino que brilla; nodo hecho = encendido (lleno); nodo cerrado =
  aro apagado; las aristas son líneas finas, no puntos gordos.
- Negro azulado como los videos neón (`?s=neon` de la serie lámina) y un acento azul hielo, el del tallo del cerebro.
- El nombre sigue siendo Zuka.

No se busca: cambiar textos de contenido, la lógica, los juegos por dentro (su paleta «estudio» se queda) ni las láminas
de los mundos (ya son sobrias).

## Alternativas

1. **Capa de retoques al final del CSS** (reglas que pisan las viejas). Rápida, pero deja dos estilos en el mismo archivo y
   el viejo sigue ahí. Descartada.
2. **Cambiar solo las variables de color.** No quita el relieve, los bordes gordos ni la mascota, que son lo que se ve
   infantil. Descartada.
3. **Reescribir en su sitio las reglas de `css/styles.css`** (colores, bordes, sombras, pesos, nodos) y cambiar la marca
   por un SVG generado. Sin tocar la lógica ni el HTML que arman los módulos, salvo donde salía la mascota o el logo.
   **Elegida.**

## Sistema visual

### Color (variables de `:root`)

| | Oscuro (por defecto) | Claro |
|---|---|---|
| `--bg` | `#07080f` | `#f4f6fb` |
| `--bg2` | `#0c0e19` | `#ffffff` |
| `--card` | `#10131f` | `#ffffff` |
| `--card2` | `#191d2e` | `#e9edf6` |
| `--line` | `#262b44` | `#d9deec` |
| `--ink` | `#edf1ff` | `#0a1230` |
| `--mute` | `#8b93b8` | `#58618a` |
| `--brand` | `#6fd3ff` (hielo) | `#0b5ed7` |
| `--on-brand` | `#04121d` | `#ffffff` |
| `--gold` | `#f2cf73` | `#c98a00` |
| `--halo` | `55%` | `22%` |
| `--ink-mix` | `72%` | `48%` |

- `--on-brand` es la tinta que va **sobre** el color de marca (antes era blanco fijo: sobre hielo no se leería).
- `--halo` es la fuerza del brillo: `color-mix(in srgb, <color> var(--halo), transparent)`. En tema claro el brillo es
  una sombra suave de color.
- `--ink-mix` es cuánto color del curso lleva la tinta `--c-ink`; en claro lleva menos para que el amarillo de Física se lea.
- `--play-bg` no cambia (es el fondo de los juegos, `PALETTES` de `kit.js`).
- El fondo del documento, la portada `#boot`, `theme-color` y el manifiesto usan el `--bg` de cada tema. La pantalla de
  inicio de Android pasa de blanca a `#07080f`, que es el fondo del icono nuevo; en la app instalada la portada usa ese
  mismo color en los dos temas.

### Forma

- Bordes de 1 px (`var(--line)`); nada de `2px solid var(--line)`.
- **Ninguna sombra dura** (`0 Npx 0 color`). El relieve se cambia por: nada (tarjetas), un brillo suave del color del
  elemento (botón principal, nodo actual, opción elegida) o una sombra difusa (hojas, avisos, diálogos).
- Radios más contenidos: tarjetas 16, botones 12, hojas 20.
- Al tocar, los botones se encogen un poco (`scale(.985)`); ya no «bajan».

### Letra

- Texto: Plus Jakarta Sans, pesos 400–700 (el 800 desaparece de la interfaz).
- Títulos y números de nodo: **Jost** (`--display`), la letra de los videos y los juegos, peso 600.

### Marca

- Geometría en `tools/marca.js` (puntos tomados del pantallazo, triangulación de Delaunay recortada a la silueta). Un
  solo origen; `node tools/marca.js` escribe:
  - `js/marca.js`: `brainSVG(kind)` (`'full'`, `'simple'` para tamaños chicos, `'lit'` con las caras encendidas),
    `brainTile(kind)` (el cerebro en su ficha oscura, como el icono) y `logoHTML()` (cerebro + ZUKA).
  - `brand/logo-dark.svg`, `brand/logo-light.svg` (para el panel de administración y fuera de la app), `brand/cerebro.svg`.
  - con `--png`: `icons/*.png` (fondo `#07080f`, cerebro de malla con brillo y tallo hielo; el enmascarable deja el
    margen de seguridad del 20 %). Usa `playwright-core` de `~/lemo-opuscar`.
- La palabra ZUKA va dibujada con trazos (misma línea que la malla), en mayúsculas espaciadas.
- La mascota sale de: diálogo, recorrido, aviso de versión y fin de lección. En su lugar va la ficha del cerebro; al
  terminar una lección va el cerebro **encendido** (las caras llenas, como al final del video).
- El recorrido ya no dice «¡Hola! Soy Zuka»: «Te damos la bienvenida».

## Qué se toca

`css/styles.css` (casi todo), `index.html` (fondo en línea, fuentes, `js/marca.js`), `manifest.json`, `sw.js` (`SHELL`,
versión), `js/app.js` (theme-color, pesos de fuente, aviso de versión, fin de lección), `js/ui.js` (diálogo), `js/tour.js`,
`js/cuenta.js` (logo), `admin/` (logo, pesos), `icons/`, `brand/`, pruebas.

## Pruebas (`tests/interfaz-red.test.js`)

- variables nuevas en los dos temas y `--bg` igual en documento, portada, theme-color y manifiesto;
- ninguna sombra dura ni `2px solid var(--line)` ni `font-weight: 800` en `css/styles.css`;
- ninguna tinta blanca fija sobre `--brand`;
- la marca: `js/marca.js` registrado, generado por la herramienta (el archivo coincide con lo que genera), cada arista
  une dos nodos, la malla queda dentro del cuadro, nadie pide ya `mascota.png` ni `logo-*.png`;
- el camino: nodo con aro, hecho encendido, cerrado apagado, arista fina.

Se actualizan las pruebas que fijaban el estilo viejo (`interfaz`, `juegos-sobrios`, `arranque`).
