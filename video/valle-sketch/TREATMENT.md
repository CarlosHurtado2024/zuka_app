# Valle de los Números en lápiz · tratamiento

Este es el material de las seis lecciones del mundo **Valle de los Números** en estilo **Tablet Sketch Explainer**
(Lemo-Opuscar, `ipad-sketch`): un lienzo crema en una tableta, lápiz primero y color después, y el lienzo que se mueve
con dos dedos.

- **Formato:** vertical 1080×1920, 24 fps, en español.
- **Sin voz grabada.** Cada video trae su narración en `.srt` y en texto corrido. En la hoja quedan las fórmulas y
  notas cortas a lápiz, así que se entiende sin sonido.

| Video | Lección | Contenido | Duración |
|---|---|---|---|
| v1 | `alg-11` | naturales y enteros | 177 s |
| v2 | `alg-11b` | racionales: fracciones y decimales | 227 s |
| v3 | `alg-11c` | irracionales y reales | 223 s |
| v4 | `alg-12b` | axiomas de campo | 246 s |
| v5 | `alg-12c` | consecuencias: restar, dividir y los signos | 210 s |
| v6 | `alg-12d` | orden y valor absoluto | 228 s |

**Contenido.** Sale del *Manual de Álgebra y Trigonometría* (UdeA), §1.1–1.2, y de los guiones de los videos
anteriores (`video/clase_alg_u1_*`), con sus mismos ejemplos. Esos ejemplos ya están probados para que no salgan en
los ejercicios: `tests/sistemas-numericos.test.js` y `tests/axiomas-desde-cero.test.js`.

## 1. Tres estructuras posibles

1. **Una tarjeta por idea**, cada una en una pantalla. Es claro, pero se pierde lo propio del estilo: la hoja que
   crece y que se puede mirar entera.
2. **Una sola hoja por lección**, sin cortes. Para tres o cuatro minutos queda una hoja demasiado alta, con zooms
   lejanos y letra diminuta.
3. **Un cuaderno**: varias hojas por lección. Cada hoja guarda un tramo de la idea (contar y la resta, el opuesto,
   ℕ dentro de ℤ…). La cámara baja por la hoja a medida que se escribe. Cuando la hoja se llena, se va de lado y llega
   una limpia.

**Elegida: la 3.** Con la hoja nueva, el cambio de tema se ve sin texto que lo anuncie. La última hoja de cada
lección es el repaso.

## 2. Cómo está hecho

- **Motor.** `engine.js` y `engine2.js` vienen del corto «Matemáticas de abeja» (`video/abejas`), con estos cambios:
  - la hoja mide 1200 × 2700;
  - la duración la fija la película;
  - el texto borrado con la hoja no cuenta para `readcheck`.
- **`kit.js`.** Convierte cada lección en una lista de tiempos:
  - Cada tiempo es una frase (o varias) de narración y su dibujo.
  - Cada tiempo dura lo que tarde una voz tranquila en decir la frase (2.5 palabras por segundo) o lo que tarde el
    lápiz en dibujar, lo que sea más.
  - La cámara pone lo nuevo un poco abajo del centro, para que lo anterior siga a la vista.
  - Los signos que Caveat no trae se dibujan a lápiz: ℕ, ℤ, ℚ, ℝ, 𝕀, ∈, ∉, ⊆, ∪, ∩, ∀, π, √, ∞, →, ⟺ y ∅.
- **Películas.** `films/v1.js` … `v6.js`, una por lección. `index.html?film=vN` elige cuál se dibuja.
- **Sonido.** `mix.py` hace el lápiz y la música (arpa, contrabajo, vibráfono) y escribe la narración en
  `out/vN/vN.srt` y `out/vN/vN_narracion.txt`.

## 3. Referencia

- **Qué aprender:** de las grabaciones aceleradas de dibujo en tableta, el orden (construcción, línea y color) y el
  lienzo que se mueve con dos dedos.
- **Qué no tomar:** dibujos, composiciones ni rotulación de esas obras.
