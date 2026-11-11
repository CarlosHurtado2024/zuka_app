# Mapa de mundos (pestaña Aprender)

## Qué
Dentro de cada curso, las unidades se muestran como **mundos** de un videojuego y sus lecciones como
**niveles** de ese mundo, unidos por un sendero que serpentea.

## Datos
- Cada unidad de cada curso (`js/courses/*.js`, `js/data.js`) lleva `world: '<clave>'`.
- `js/worlds.js` define `WORLDS[clave] = { name, art }`: un nombre de lugar («Pradera de Venn») y una
  ilustración SVG (viewBox 160×80) con cielo, suelo y un motivo coherente con el contenido de la unidad
  (círculos de Venn para conjuntos, ola senoidal para funciones trigonométricas, tangente en una cumbre
  para la derivada…). Las ilustraciones traen su propio fondo, así que se ven igual en tema claro y oscuro.
- `worldTrail(xs, step)` (pura, probada en Node) da el trazo SVG del sendero que pasa por los niveles.

## Interfaz
- Tarjeta de mundo: ilustración arriba con la etiqueta «Mundo N» y el avance `hechos/total`
  (o estrella cuando el mundo está completo); debajo, el nombre del lugar y el título de la unidad.
  Si todas sus lecciones están bloqueadas, la ilustración se ve apagada y con candado.
- Niveles: botones redondos como antes; los abiertos muestran su número; debajo «Nivel N-k» y el título
  (máximo dos líneas, alto fijo por fila para que el sendero pase por el centro de cada botón).
- El sendero es una línea punteada del color del curso, detrás de los botones.

## Pruebas
`tests/mundos.test.js`: toda unidad tiene `world` existente en `WORLDS`, sin repetir; cada mundo tiene
nombre y SVG válido; `worldTrail` pasa por todos los puntos; `js/worlds.js` registrado en `index.html` y `sw.js`.
