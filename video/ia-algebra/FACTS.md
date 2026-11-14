# Datos de «La IA está hecha de álgebra»

Todas las cifras salen de `data.js` y las comprueba `tests/ia-algebra.test.js`.

| En pantalla | De dónde sale |
|---|---|
| x = (2, 3), w = (0.4, −0.2), b = 0.1 | La neurona de ejemplo del texto del usuario. En el clip es la última neurona de la red; sus dos datos son las salidas de la capa anterior (ReLU puede dar 2 y 3). |
| z = 2 · 0.4 + 3 · (−0.2) + 0.1 = 0.3 | z = w₁x₁ + w₂x₂ + b. |
| σ(0.3) = 0.574 → «gato, 57 %» | σ(z) = 1 / (1 + e⁻ᶻ) = 0.5744. Leer la salida como «57 % gato» es la interpretación sencilla que da el texto (qué tan compatible es con la clase). |
| L = (1 − 0.574)² = 0.181 | Pérdida cuadrática con la respuesta correcta y = 1. |
| w nuevo = w − η · ∂L/∂w, η = 0.25 | Descenso del gradiente. Derivada exacta: ∂L/∂wᵢ = −2(1 − ŷ) · ŷ(1 − ŷ) · xᵢ (la prueba la compara con diferencias finitas). |
| 12 pasos: L de 0.181 a 0.008, «gato» de 57 % a 91 % | Simulación real de 12 pasos. Solo se entrenan w₁ y w₂ (el sesgo y las capas de abajo quedan fijos); los pesos terminan en (0.71, 0.27). |
| La montaña | La superficie real L(w₁, w₂) de esa neurona para w₁ ∈ [0, 1.2], w₂ ∈ [−0.8, 0.6], altura proporcional a L. La bolita recorre los 12 puntos de la simulación. |
| Tabla 0 120 240 / 30 180 255 / 10 90 200 | La matriz de ejemplo del texto. Está de verdad en el dibujo de Mishi (16 × 16 píxeles, filas 9–11 y columnas 1–3, el borde de la mejilla); 0 = negro, 255 = blanco. |
| z = Wx + b | Una capa completa: matriz de pesos por vector de entrada más el vector de sesgos. |
| Palabras → vectores, atención = productos escalares | Ilustración del Transformer (ChatGPT): los vectores de las palabras son de juguete y no se muestran cifras; el grosor de cada arco es el softmax de sus productos escalares. |

Lo que quedó fuera: ReLU dibujada, retropropagación capa por capa, softmax con números, la tabla de qué estudiar.
Mishi y Sofía son personajes del clip; la red no es un clasificador de gatos entrenado (lo dice la nota final: «Red y neurona de ejemplo, no un clasificador real»).
