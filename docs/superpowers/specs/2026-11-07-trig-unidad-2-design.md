# Trigonometría, unidad 2: videos y juegos

Unidad «Funciones trigonométricas inversas y aplicaciones» (Manual de la UdeA, §13.6–13.9 y 14), 8
lecciones. Pedido: un video muy entretenido por lección con el fondo azul degradado de trigonometría y
zoom de cámara donde ayude, y ejercicios que sean juegos originales, sin repetir mecánica, que respeten
el tema claro u oscuro de la app.

## Videos (manimgl, 9:16, sin voz ni subtítulos quemados, ~3–4 min)

Plantilla `trig_common.py` (fondo `fondo_trig.png`, encabezado y fondo fijos, `zoom_to` / `zoom_reset`).
Cada clase abre con una pregunta-gancho visual (una historia) y luego intuición → fórmula → ejemplo
resuelto. Los ejemplos del video no se repiten en los ejercicios.

| Clase | Lección | Contenido (zoom ★) |
|---|---|---|
| T10 | trig-45 Inversas | el seno no se deja invertir (recta horizontal que corta muchas veces) · recortar a [−π/2, π/2] y reflejar en y = x · sen⁻¹(√3/2), cos⁻¹(−1/2) (★ zoom al punto en el círculo) · tan⁻¹ y sus asíntotas · tobogán de 4 m de alto y 8 m de largo |
| T11 | trig-4 Identidades fundamentales | Pitágoras en el círculo: los cuadrados sen² y cos² llenan 1 (★ zoom al triángulo) · dividir entre cos² y sen² · cos θ = −12/13 en III → las otras cinco · cofunciones con el triángulo volteado |
| T12 | trig-47b Simplificar y demostrar | identidad vs. ecuación (gráficas que coinciden o no) · demostrar (1 + tan²x) cos²x = 1 · sec x − cos x = sen x tan x paso a paso (★ zoom a cada paso) · contraejemplo de cos 2x = 2 cos x |
| T13 | trig-48a Suma y resta | por qué no se reparte (sen(30°+60°) ≠ sen30 + sen60) · la fórmula con dos giros encadenados · sen 105° = sen(60° + 45°) (★ zoom a la cuenta) · cos 15° · tan(45° + 30°) |
| T14 | trig-48b Ángulo doble y medio | dos corredores, uno al doble · sen 2x y las tres formas de cos 2x · cos θ = 4/5 → sen 2θ, cos 2θ · reducir potencias · cos 15° como ángulo medio (★ zoom al signo) |
| T15 | trig-49 Ecuaciones | ecuación = buscar dónde la gráfica cruza una recta · cos x = −√2/2 (dos soluciones por vuelta, solución general) · 2sen²x − 3sen x + 1 = 0 · tan²x = 3 en [0, 2π) · solución extraña (★ zoom a la verificación) |
| T16 | trig-46a Ley de senos | triángulo oblicuo, alturas → la ley · AAL: A = 35°, B = 80°, a = 9 · el compás del caso ambiguo: 0, 1 o 2 triángulos (★ zoom al corte) |
| T17 | trig-46b Ley de cosenos y área | Pitágoras corregido (el término −2ab cos C crece y decrece al abrir el ángulo) · LAL: a = 5, b = 8, C = 60° → c = 7 · LLL para un ángulo · área ½ab sen C y Herón con 5-6-7 (★ zoom a la raíz) |

## Juegos nuevos (p5.js, colores de `api.palette`: claro y oscuro)

Cada uno tiene una mecánica distinta a los demás y a los de la unidad 1.

| Juego | Mecánica | Lección |
|---|---|---|
| `canon-inverso` | un cañón que solo gira dentro del **rango** de la inversa (media vuelta derecha para sen⁻¹ y tan⁻¹, media de arriba para cos⁻¹) apunta y dispara a globos: hay dos globos con el mismo seno/coseno, pero solo uno está a su alcance | 45 |
| `tanque-pitagorico` | un tanque de 1 litro: el líquido rosa (sen²) ya está; se ajusta el valor de la otra razón para llenar el cian hasta la marca exacta, y se elige el signo por el cuadrante (también con 1 + tan² = sec²) | 4 |
| `detector-identidades` | dos gráficas superpuestas: si alguna vez se separan, se arrastra la lupa a un $x$ donde difieren (contraejemplo); si coinciden siempre, se sella «Es identidad» | 47b |
| `encadena-angulos` | dos brazos encadenados en la circunferencia: el primero gira a un ángulo notable y el segundo suma o resta otro notable desde su punta hasta caer en el ángulo «raro» | 48a |
| `corredores-dobles` | carrera: mientras se mantiene presionado «Correr», el corredor lento avanza θ y el rápido 2θ; hay que frenar justo cuando se cumple la condición (con − / + para ajustar) | 48b |
| `pesca-raices` | pesca: la gráfica del lado izquierdo y el nivel del agua; se lanzan anzuelos en los $x$ (paso π/12) para atrapar **todas** las soluciones en [0, 2π) sin anzuelos de más | 49 |
| `compas-ambiguo` | compás: el lado $a$ gira desde el vértice $C$ y se marcan en la base los puntos donde la toca; si no la toca, «No hay triángulo» (caso ambiguo LLA) | 46a |
| `brazo-robot` | brazo robótico de dos tramos $a$ y $b$: se dobla el codo (ángulo $C$) para que la pinza agarre una pieza a distancia $c$ | 46b |

Cada lección queda con 3–5 ejercicios, mayoría juegos y sin opción múltiple, todos con pista (se
reutilizan `une-parejas` y `ordena-terminos` donde encajan; pueden quedar cálculos `num`). Cada juego
tiene pruebas de `grade` y de sus funciones puras; las rondas se prueban alcanzables con los controles.
