# Trigonometría, unidad 1: videos y juegos

Unidad 13 del Manual de la UdeA («Funciones trigonométricas, propiedades y gráficas»), 9 lecciones.
Pedido: un video entretenido por lección con el fondo azul de trigonometría y zoom de cámara donde
ayude, y ejercicios que sean juegos originales (no opción múltiple ni tarjetas) que respeten el tema
claro u oscuro de la app.

## Videos (manimgl, 9:16, sin voz ni subtítulos quemados, ~4–5 min)

* Fondo `fondo_trig.png`: el mismo degradado que usan los clips de trigonometría en la app
  (`make_background.py "#22d3ee"`), azul verdoso arriba y azul noche abajo.
* Plantilla: `mb_common.py` de las clases de álgebra con el fondo de trig, y el fondo, el encabezado
  y el cierre fijos en pantalla (`fix_in_frame`) para que el **zoom de cámara** (`self.frame`) solo
  mueva el contenido. Ayudante `zoom_to(mob, scale)` / `zoom_reset()`.
* Los ejemplos del video no se repiten en los ejercicios.

| Clase | Lección | Contenido (zoom ★) |
|---|---|---|
| T1 | trig-41a Grados y radianes | posición estándar y signo del giro · el grado (★ zoom a 1° y sus minutos) · el radián con la cuerda del radio (★ el sobrante de 6.28) · 120° ↔ 2π/3, 5π/4 ↔ 225° · coterminales 765° y −90° · complementos y suplementos |
| T2 | trig-41b Arco, sector y movimiento circular | s = rθ (r = 5, θ = 2.4) · sector como fracción de pizza, r = 6, θ = π/3 · noria r = 10 m a 2 rpm (★ zoom a una cabina) |
| T3 | trig-1 SOH · CAH · TOA | nombrar lados (cambiar θ cambia op/ady) · semejanza (★ zoom out a un triángulo gigante) · 8-15-17 · Pitágoras 7-24-25 |
| T4 | trig-2 Ángulos notables | cuadrado → 45° y √2 · equilátero → 30°/60° y √3 (★ zoom al corte) · patrón √n/2 · rampa de 30° y 8 m |
| T5 | trig-42c Seis razones y medición indirecta | recíprocas con 20-21-29 · elevación: sombra de 15 m a 40° (★ zoom al ángulo) · depresión desde un faro de 50 m a 20° |
| T6 | trig-3 La circunferencia unitaria | del triángulo al círculo · P(t) = (cos t, sen t) (★ zoom al punto) · P(−4, −3) del libro · vueltas y periodo 2π |
| T7 | trig-43b Signos y ángulo de referencia | signos por cuadrante · los tres casos del ángulo de referencia (★) · 150°, 240°, 315° · paridad: espejo en el eje x |
| T8 | trig-44a Seno y coseno: amplitud | desenrollar la circunferencia (★ cámara que sigue el punto) · coseno = seno corrido · amplitud y reflejo · desplazamiento vertical y rango |
| T9 | trig-44b Periodo, desfase y tangente | b comprime (periodo 2π/b) · desfase c/b · armar y = 2 sen(3x − π) + 1 · tangente y asíntotas (★ zoom a la asíntota) |

## Juegos nuevos (p5.js, colores de `api.palette`: claro y oscuro)

| Juego | Idea | Lecciones |
|---|---|---|
| `rueda-angulo` | girar un brazo (varias vueltas, también negativo) hasta un ángulo dado en grados o radianes; deja una espiral y cuenta vueltas | 41a |
| `corta-pizza` | ajustar el ángulo de la porción y el radio hasta un arco o un área pedidos; s y A en vivo | 41b |
| `arma-triangulo` | arrastrar los catetos (en una cuadrícula) hasta que una razón (sen, cos, tan, csc, sec, cot) valga lo pedido | trig-1, 42c |
| `mide-altura` | caminar con el topógrafo hasta ver la cima con el ángulo de elevación (o depresión) pedido | 42c |
| `atrapa-punto` | tocar en la circunferencia unitaria el punto notable que cumple la pista (coordenadas exactas, ángulo en radianes, signo) | trig-2, trig-3, 43b |
| `noria` | llevar la cabina de una noria a un ángulo que cumpla condiciones de signo o de ángulo de referencia (hay varias respuestas) | 43b |
| `sintoniza-onda` | sintonizar una onda con los botones de a, b, c, d hasta que coincida con la onda fantasma | 44a, 44b |

Cada lección queda con 3–5 ejercicios, casi todos juegos (puede quedar un cálculo numérico), con pista.
Se reutilizan `une-parejas` y `ordena-terminos` donde encajan. Cada juego tiene pruebas de `grade`.
