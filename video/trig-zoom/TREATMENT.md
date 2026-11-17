# Trigonometría en zoom · tratamiento

Videos de las 20 lecciones del curso de Trigonometría en el estilo **Scale Zoom Explainer** de Lemo-Opuscar: dibujo plano
sobre azul noche, un solo zoom continuo que entra por un objeto de cada parada a la siguiente y la guía con lente (Orbi) que
señala la «próxima parada». Spec: `docs/superpowers/specs/2026-11-15-trig-zoom.md`.

- **Formato:** vertical 1080×1920, 24 fps, 130 s, sin voz. La narración va en `<nombre>.srt` y `<nombre>_narracion.txt`.
- **Motor:** el de `video/valle-zoom` (`zoomkit.js`, `flat.js`, `orbi.js`, `valle.js`, `mix.py`) más `trig.js`: circunferencia
  y plano (`ucircle`), arcos y sectores en grados (`arcDeg`, `sector`), rayos, triángulos con rótulos (`tri`, `angMark`,
  `rightMark`, `sideLab`), ondas, faros, barcos, mar y la plantilla común (`stdFilm`, `titleCard`, `stdEvents`).
  Las letras griegas (θ, α, β, ω) y los superíndices ⁶ ⁸ ⁿ ⁻¹ vienen de Noto Sans (Jost no los trae): `@font-face Griega`
  con `unicode-range` en `index.html`.
- **Sin nombres de personas:** cada video empieza con un objeto o un fenómeno (una rueda, un reloj, una cometa, un faro, una
  noria, una nave), nunca «Ana tiene…». La estructura sigue `docs/storytelling-videos.md`: pregunta que atrapa, sorpresa
  anunciada en la parada 1 («UN AVISO»), cuatro paradas y cierre que responde la pregunta.
- **Construir:** `sh video/trig-zoom/build.sh [nombre …]` (unos 3 min por video con 2 trabajadores; no correr otras capturas
  de navegador a la vez: la captura se cuelga). `sh video/trig-zoom/check.sh nombre` revisa ritmo y lectura sin renderizar;
  `sh video/trig-zoom/sheet.sh nombre` deja una hoja de contacto en `out/<nombre>/hoja.png`.

## Mar de las Ondas

| Video | Lección | La pregunta → la sorpresa → la respuesta |
|---|---|---|
| `grados` | `trig-41a` | una rueda avanza tres radios: ¿cuánto giró? → hay una medida que habla «como la rueda» → 3 rad ≈ 171.9°, casi media vuelta |
| `arco` | `trig-41b` | ¿cuánto camina la punta del minutero de 3 m en 20 min? → punta y medio giran igual pero no van igual de rápido → 2π ≈ 6.28 m |
| `soh` | `trig-1` | una cometa con 50 m de hilo: ¿a qué altura vuela? → la forma del triángulo esconde un número → sen θ = 0.28: 14 m |
| `notables` | `trig-2` | las dos escuadras de la cartuchera: ¿sen 60° exacto? → cabe en una fracción → √3/2 (cuadrado y equilátero) |
| `seis` | `trig-42c` | ¿qué tan alta es la montaña vista desde el mar? → la salida es moverse → dos ángulos: ≈ 1 366 m |
| `unitaria` | `trig-3` | la noria gira 150°: ¿a qué altura quedas? → te sonará conocida → sen 150° = sen 30° = ½ |
| `signos` | `trig-43b` | el radar marca un eco en 240° → dos preguntas bastan → cos 240° = −½ |
| `amplitud` | `trig-44a` | el barco necesita 1.5 m de agua y la marea sube y baja → la fórmula contesta sola → y = 2 sen x + 3: en marea baja hay 1 m |
| `periodo` | `trig-44b` | los faros se reconocen por su ritmo; la mancha del haz en la costa → llega más lejos de lo que imaginas → tan θ sin límite |

## Faro de los Ángulos

| Video | Lección | La pregunta → la sorpresa → la respuesta |
|---|---|---|
| `inversas` | `trig-45` | la rampa sube 1 m cada 12 m: ¿qué ángulo? → un número viene de infinitos ángulos → tan⁻¹(1/12) ≈ 4.8° |
| `identidades` | `trig-4` | una caja fuerte de seis cerraduras y una llave (cos θ = 8/17, cuadrante IV) → una figura las amarra → sen θ = −15/17 |
| `demostrar` | `trig-47b` | dos calculadoras dan fórmulas distintas → un dibujo no es prueba → tan x + cot x = sec x csc x |
| `suma` | `trig-48a` | el brazo robótico gira 30° y 45° → sumar senos da más que el brazo → sen 75° ≈ 0.966 |
| `doble` | `trig-48b` | ¿con qué ángulo llega más lejos el chorro del barco bombero? → 30° y 60° llegan igual → 45° |
| `ecuaciones` | `trig-49` | ¿cuándo está la cabina de la noria a 17 m? → hay muchas respuestas → 30° y 150° (+ 360° k) |
| `senos` | `trig-46a` | dos faros ven una bengala con 75° y 60° → la ley nace de partir el triángulo → 12.25 y 13.66 km |
| `cosenos` | `trig-46b` | ¿qué tan largo será el túnel? → un Pitágoras con corrección → 7 km exactos; área ≈ 17.32 km² |

## Galaxia Polar

| Video | Lección | La pregunta → la sorpresa → la respuesta |
|---|---|---|
| `polar` | `trig-151` | la nave solo entiende rumbo y distancia: 3 + 4i → un rumbo engaña a la calculadora (−3 − 4i) → 53.13°, distancia 5 |
| `demoivre` | `trig-152` | la sonda se multiplica por 1 + i en cada pulso → la forma polar lo vuelve un juego → (1 + i)⁸ = 16 |
| `raices` | `trig-153` | x³ = 1 solo tiene el 1 en la recta → las otras forman una figura perfecta → 1 y −½ ± (√3/2) i |

## Entrega

Cada video espera su ID de Bunny. Al recibirlo: `clip.bunny` + la `duration` que reporte Bunny en la lección (`raices` es el
video de `trig-153`, la lección de raíces). Las escenas de respaldo de cada lección se cambian entonces por los
ejemplos del video. `tests/trig-zoom.test.js` comprueba ritmo, nombres, ejemplos fuera de los ejercicios, cuentas y cierre.
