# «La IA está hecha de álgebra» (historia: Mishi en números) · estilo Sci-fi Hologram HUD

Clip de la pestaña Clips de Zuka (tema Matemáticas). Vertical 1080×1920, 24 fps, 90 s, sin voz: la narración va en
subtítulos HUD (placa oscura con corchetes y barras de «voz») y como `.srt`.

## 1. Tres estructuras candidatas

1. **Recorrido de especificaciones** de una red neuronal: nombre, capas, pesos, salida. Claro, pero no hay historia ni
   aprendizaje: la red nunca cambia.
2. **Mejora (upgrade)**: la misma red con pesos viejos y nuevos, número que rueda de 57 % a 91 %. Tiene el cambio, pero se
   salta el porqué (la montaña del error).
3. **Desarmado (teardown) que baja y sube**: la red es una torre de luz sobre el proyector. Se baja a la capa de entrada
   (la foto en píxeles, con lupa sobre una tabla de 3 × 3), se sube capa por capa hasta la última neurona, que se abre: dos
   datos, dos pesos, un sesgo, z, sigmoide, error. Luego la torre se borra y en el mismo proyector se escanea la **montaña
   del error** de esa neurona (la superficie real L(w₁, w₂)); una bolita baja 12 pasos. La torre vuelve, se enciende como
   holograma sólido (una vez) y la salida rueda a 91 %. Cierra con palabras convertidas en vectores (ChatGPT).

**Elegida: 3.** Es la frase semilla hecha imagen: *una IA no es magia: multiplica, suma y baja una montaña.*

## 2. Logline y arco (docs/storytelling-videos.md)

Sofía le enseña a una IA la foto de su gato, Mishi, y la IA duda: «gato, 57 %». Para que aprenda, la red ajusta sus pesos
bajando la montaña de su propio error hasta decir «gato, 91 %».

- **Personaje, deseo y problema**: Sofía quiere que la IA reconozca a Mishi; la IA duda.
- **Frase que atrapa**: «Sofía le enseña a una IA la foto de su gato, Mishi.» La torre se escanea y la salida dice 57 %.
- **Sorpresa anunciada**: «Lo sorprendente: aprenderá bajando una montaña.» Se cumple con la superficie del error.
- **Cerrar el círculo**: la misma foto, pesos nuevos: 91 %. «Mishi es un gato. Y la IA, álgebra.»

## 3. Honestidad

- La neurona de juguete es la del texto del usuario: x = (2, 3), w = (0.4, −0.2), b = 0.1 → z = 0.3 → σ(z) = 0.574.
  En el clip es la última neurona de la torre y sus dos datos vienen de la capa anterior (salidas de ReLU, que pueden ser 2
  y 3). Solo se entrenan sus dos pesos (el sesgo y las capas de abajo quedan fijos): así la montaña es una superficie
  de dos variables que se puede dibujar.
- Error L = (1 − ŷ)², derivada exacta, tasa η = 0.25, 12 pasos reales: ŷ pasa de 0.574 a 0.91 y L de 0.181 a 0.008.
  Todo se calcula en `data.js` y lo comprueba `tests/ia-algebra.test.js`.
- La tabla 3 × 3 es la del texto (0, 120, 240 / 30, 180, 255 / 10, 90, 200) y está de verdad dentro del dibujo de Mishi.
- ChatGPT se menciona sin cifras: tokens como vectores, productos escalares (atención), derivadas.

## 4. Lista de planos (120 ppm, compás 2 s)

| # | Tiempo | Plano | Cámara | Movimiento propio |
|---|---|---|---|---|
| 1 | 0–10 | la torre se escanea sobre el proyector; título que rueda; la salida se fija: GATO 57 % | 3/4 alto, órbita lenta que baja | escaneo; fijar blanco |
| 2 | 10–22 | la capa de entrada: Mishi en 16 × 16 píxeles; lupa sobre 3 × 3 y la tabla rueda | picada hacia la placa | lupa |
| 3 | 22–36 | subir: capa oculta (z = Wx + b); la última neurona se abre: x, w, b; z = 0.3 | grúa hacia arriba, empuje | desarmado local; dígitos que ruedan; fichas al riel |
| 4 | 36–44 | la sigmoide en una tarjeta; σ(0.3) = 0.574; el error 0.18 | casi quieta | dígitos |
| 5 | 44–66 | la torre se borra; la montaña L(w₁, w₂) se escanea; flecha de la derivada; 12 pasos | 3/4, órbita sobre la superficie | escaneo; bolita; caída |
| 6 | 66–76 | la torre vuelve y se enciende sólida; la salida rueda a 91 % | grúa a la altura de los ojos | holograma sólido + haz |
| 7 | 76–88 | palabras como vectores sobre el proyector, líneas de atención; cierre | alejamiento | apagado del HUD |

## 5. Color y letra

Un tono frío: violeta claro #B9A6FF (el morado del álgebra de Zuka); acento cálido lima #C8FF4A, solo para los valores
que se fijan. Rajdhani (títulos y valores) y Share Tech Mono (micro datos), las dos OFL.

## 6. Sonido

120 ppm, la menor. Arpegio de sierra con eco, bajo en corcheas, palmas y platillos sintéticos, colchón de sierras. Un
golpe + clac + doble pitido en cada fijación, tic por cuadro al rodar números, medio tiempo en la sigmoide, un compás de
silencio digital justo antes de la caída a la montaña, una nota grave que baja un semitono en cada paso y un tono sostenido bajo el
91 %. Máster a −14 LUFS.
