# ¿Qué es un conjunto? · versión estudio (público de 17 años en adelante)

Video de la lección 1 del mundo **Teoría de Conjuntos** (`alg-0a`, «¿Qué es un conjunto? Notación y pertenencia»).
Reemplaza al video zoom de la pradera (`video/conjunto-zoom`), que se veía infantil: mascota, semáforo, colores de
cartilla. Se conserva lo que funcionaba (una idea por parada, un solo zoom continuo, rótulos cortos) y cambia el
resto.

- **Formato:** vertical 1080 × 1920, 30 fps, 126 s, sin voz ni subtítulos quemados. La narración va aparte
  (`conjunto-estudio.srt`, `narracion.txt`).
- **Contenido:** *Manual de Álgebra y Trigonometría* (UdeA) §1.1: colección bien definida, elementos, llaves, ∈ y ∉,
  extensión y comprensión, sin orden ni repetidos, cardinal. Sin números dentro de los conjuntos ni desigualdades.
- **Ejemplos:** canciones y una playlist. No salen en los ejercicios de la lección (lo comprueba la prueba).

## Qué lo hace adulto

| Antes | Ahora |
|---|---|
| mascota Orbi que señala | sin personajes dibujados: Sofía es solo un nombre y una búsqueda |
| pradera, semáforo, letras de colores | una app de música: algo que el público usa todos los días |
| relleno plano de cartilla, cinco colores vivos | escenario de tinta azul, retícula fina, superficies con luz suave |
| varios acentos a la vez | un solo acento: el ámbar es «el conjunto» (borde, llaves, ∈); el coral solo existe mientras hay un problema |
| notación en la misma letra del texto | fórmulas en letra de libro (cursiva para M, x, n), nombres en Jost |
| rebotes y resortes | entradas rápidas con una sola frenada; nada flota ni rebota |

Referencias (solo la gramática): presentaciones de producto sobre fondo negro y carteles suizos con retícula. Del
estilo «Dark Tech Keynote» de Lemo-Opuscar salen la retícula, las superficies, el acento único y el color de problema;
del «Scale Zoom Explainer», el zoom continuo que une los niveles.

## Idea y arco (docs/storytelling-videos.md)

*Un conjunto es una lista en la que siempre se puede decidir quién está; el orden y las repeticiones no cuentan.*

- **Deseo y problema:** Sofía quiere una playlist para el viaje y busca «las mejores canciones». Sofía, Leo y Dani
  marcan canciones distintas: nadie puede decidir qué entra. No es un conjunto.
- **Salida:** cambia la búsqueda por «canciones del álbum Marea baja». Una línea revisa la biblioteca y cada canción
  queda adentro o afuera, sin discusión. Eso sí es un conjunto.
- **Presagio:** el botón de aleatorio brilla en la tarjeta: «guarda una sorpresa».
- **Sorpresa:** en aleatorio las canciones cambian de lugar y el conjunto es el mismo; agregar Costa otra vez no
  alarga la lista.
- **Cierre del círculo:** la cámara retrocede de un tirón por los cuatro niveles hasta la búsqueda. «La playlist de
  Sofía es un conjunto.»

## Planos (un solo zoom, cuatro niveles; tiempos en `data.js`)

| t (s) | Nivel | Qué pasa |
|---|---|---|
| 0–30 | Biblioteca | se escribe la búsqueda; tres opiniones distintas; la duda; nueva búsqueda; la línea revisa; las cuatro del álbum vuelan a una tarjeta con borde ámbar |
| 30–32 | — | zambullida por la tarjeta |
| 32–59 | La lista | cuatro filas = cuatro elementos; los títulos bajan y las llaves los encierran: M = {…}; Neón ∈ M; Eco rebota en la llave: Eco ∉ M |
| 59–62 | — | zambullida por la llave |
| 62–85 | Dos maneras | por extensión; por comprensión; la condición como una puerta que deja pasar a las que la cumplen; «:» se lee «tal que» |
| 85–87 | — | zambullida por el botón de aleatorio |
| 87–111 | Aleatorio | las filas cambian de lugar y los dos renglones dicen lo mismo; Costa entra otra vez y se funde; se cuentan: n(M) = 4 |
| 111–114 | — | retroceso por los cuatro niveles |
| 114–126 | Resumen | cinco renglones y la frase final |

## Lo que se lee

Arriba a la izquierda, siempre en el mismo sitio: un rótulo en versalitas (ámbar; coral si nombra el problema) y dos
renglones de 30 letras como mucho. Cada rótulo dura al menos lo que se tarda en leerlo (letras ÷ 15 + 1.5 s), y
ninguno cae en una zambullida. `core/render/readcheck.mjs` lo mide sobre la imagen y `build.sh` falla si algo no
alcanza a leerse. Abajo, cuatro rayas marcan la parada.

## Archivos

- `data.js`: tiempos, textos, canciones, narración y sonidos (puro; lo carga la prueba `tests/conjunto-estudio.test.js`).
- `film.js`: el dibujo en canvas 2D. `index.html`: la página que renderiza Lemo-Opuscar (`window.render(t)`).
- `mix.py`: música y efectos; escribe también el `.srt`. `build.sh`: todo de una vez (unos 10 min).
