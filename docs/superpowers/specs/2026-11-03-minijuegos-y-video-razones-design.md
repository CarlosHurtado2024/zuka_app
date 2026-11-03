# Minijuegos interactivos (p5.js) y video de Razones y proporciones

Fecha: 2026-11-03 · Estado: aprobado en conversación, pendiente de revisión escrita

## 1. Objetivo y alcance

Hacer las lecciones más entretenidas y que evalúen **comprensión**, no memoria, con
minijuegos interactivos basados en el texto guía *Elementos de aritmética* (cap. 1, Ude@)
y en Stewart, *Precálculo* §1.1.

| Lección (curso de Álgebra, Unidad 1) | Video | Ejercicios |
|---|---|---|
| 1.1 Sistemas numéricos y números reales (`alg-11`) | **Sin cambios**: se mantienen las Partes 1 y 2 en Bunny | **7 minijuegos nuevos** que reemplazan los 5 ejercicios actuales |
| 1.2 Razones, proporciones y proporcionalidad (`alg-12`) | **Video nuevo** (~5:30) con guion | **6 minijuegos nuevos** que reemplazan los 5 ejercicios actuales |

Fuera de alcance: otras lecciones, cambios a los videos de la 1.1, voz o subtítulos
quemados en el video nuevo (los agrega el usuario en su editor).

## 2. Arquitectura de los minijuegos

### 2.1 Tipo de ejercicio `play`
- Nuevo constructor de contenido en `js/content.js`:
  `play(game, q, params, explain)` → `{ type: 'play', game, q, params, explain }`.
- `js/exercises.js` agrega `EX.play`, que cumple el mismo contrato que los demás tipos:
  `{ check() → { ok, solution }, lock(ok), destroy() }` y avisa con `ready(bool)` cuándo
  se puede pulsar **Comprobar**. Así corazones, XP, barra de progreso, retroalimentación
  y repetición de ejercicios fallados funcionan sin cambios en `js/app.js`.
- Una lección puede mezclar `play` con `mc`, `num`, `ord` y `sld`.

### 2.2 Un archivo por minijuego
- Carpeta `js/games/`, un archivo por juego (p. ej. `js/games/cajas-numericas.js`).
  Cada archivo registra `GAMES['<nombre>'] = (host, params, api) => ({ check, lock, destroy })`.
- Cada juego crea un sketch de **p5.js en modo instancia** (`new p5(sketch, host)`), para que
  varios juegos convivan y se destruyan limpiamente (`p.remove()`).
- `api` ofrece: `ready(bool)`, `palette` (colores de la app), `sfx` (sonidos de toque) y
  `tex(str)` para etiquetas con fórmulas en HTML superpuesto cuando el canvas no basta.
- Utilidades comunes de dibujo e interacción (arrastrar y soltar, recta numérica, tarjetas,
  texto con sombra) en `js/games/kit.js`, para que cada juego quede pequeño y legible.

### 2.3 Carga, tamaño e interacción
- p5.js (1.9.4, cdnjs) se carga **la primera vez** que aparece un ejercicio `play`; el service
  worker lo guarda (caché de recursos externos) para usarlo sin conexión. Los archivos de
  `js/games/` se agregan al `SHELL` del service worker.
- El lienzo ocupa el ancho de la tarjeta del ejercicio, en formato vertical (≈ 4:5), y escala
  con `devicePixelRatio`. Toques y arrastres con eventos de puntero; `touch-action: none`
  dentro del lienzo.
- El gesto de **deslizar entre videos y ejercicios** ignora los toques que empiezan dentro
  de un minijuego (`.play` se agrega a la lista de exclusión de `js/app.js`).
- Estilo: paleta oscura de la app y colores por familia (ℕ miel, ℤ cielo, ℚ menta,
  𝕀 coral, ℝ lavanda, acento morado del curso).

### 2.4 Calificación y retroalimentación
- `check()` evalúa el estado final; `lock(ok)` congela el juego y **anima la respuesta
  correcta** (p. ej. las tarjetas mal ubicadas vuelan a su sitio).
- `solution` es un texto corto con TeX para la tarjeta de retroalimentación; `explain`
  (en el contenido) da el porqué.
- Tolerancias explícitas en los juegos de posición (recta, gráfica, barra).

## 3. Minijuegos de la lección 1.1 · Sistemas numéricos

Base: texto guía §1.2 (cada familia nace de una ecuación que la anterior no resuelve;
ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ; ℚ ∪ 𝕀 = ℝ) y Stewart §1.1 (propiedades, recta, intervalos, valor absoluto).

| # | Juego (`game`) | Mecánica | Correcto si |
|---|---|---|---|
| 1 | `cajas-numericas` | Arrastrar tarjetas `7, −3, 0, 3/4, 0.3̅, √49, √2, π, −8/2` a cajas anidadas ℕ⊂ℤ⊂ℚ⊂ℝ y 𝕀 | Cada tarjeta está en la **caja más pequeña** que la contiene (√49 → ℕ, −8/2 → ℤ) |
| 2 | `ecuacion-familia` | Unir con el dedo ecuaciones (`x+5=2`, `3x=2`, `x²=2`, `x²+1=0`) con familias (ℤ, ℚ, 𝕀, fuera de ℝ) | Las 4 uniones son correctas |
| 3 | `ubica-en-recta` | Soltar `−3/2, 3/4, √2, π, −√4` sobre la recta de −3 a 4 | Cada punto a menos de 0.15 de su valor; al bloquear, lupa con la posición exacta |
| 4 | `maquina-fracciones` | Con ruedas, armar numerador/denominador para `0.2727…`; la máquina simplifica y divide | Fracción equivalente a 3/11 |
| 5 | `reglas-del-juego` | Arrastrar nombres de propiedad (conmutativa, asociativa, distributiva, neutro, inverso) sobre igualdades | Todas bien; si acierta la distributiva se anima el modelo de área |
| 6 | `dibuja-intervalo` | Mover dos extremos sobre la recta y tocar cada uno para alternar lleno/vacío, para `{x : −2 ≤ x < 5}` | Extremos en −2 y 5; −2 lleno, 5 vacío |
| 7 | `distancia-justa` | Con `a = −3` fijo, colocar `b` con `|b − a| = 5` | `b = 2` o `b = −8`; al bloquear se muestran ambas soluciones |

## 4. Lección 1.2 · Razones, proporciones y proporcionalidad

Base: texto guía §1.1 (definiciones 1.1 Razón, 1.2 Razones inversas, 1.3 Proporción;
magnitudes directa e inversamente proporcionales; ejercicios 1.1, 1.2 y 1.5).

### 4.1 Video
- Un solo video vertical 1080 × 1920, ~5:30, hecho con **manimgl** en el entorno
  `video/.venv-gl`, con las utilidades de `video/clase_sistemas_numericos/mb_common.py`
  (tema morado, mascota de Zuka, `say`/`hold` sin subtítulos).
- Carpeta nueva `video/clase_razones_proporciones/` con `razones_proporciones.py`, `build.py`
  (una sola parte), `custom_config.yml`, `assets/` y README.
- Entregables en `Descargas/Zuka_Clase2_Razones_proporciones/`: `.mp4`, `_guion.srt` y
  `_guion.md`. El usuario lo edita (voz/subtítulos), lo sube a Bunny y entrega el ID; luego
  se enlaza con `clip: { bunny: '<id>', duration: <s>, … }`.

| Tramo | Escena | Contenido |
|---|---|---|
| 0:00–0:06 | Portada | "Clase 2 · Razones y proporciones" (estilo de la clase 1) |
| 0:06–1:05 | Razón | `15 a 5 = 3`, `4 a 20 = 1/4`; antecedente y consecuente; receta 2 : 3 que se agranda; π y φ (Hombre de Vitruvio); razones inversas `5/4` y `4/5` |
| 1:05–2:15 | Proporción | `15/3 = 20/4`; "a es a b como c es a d"; extremos y medios; `ad = bc` en cruz; ¿forman proporción? |
| 2:15–2:55 | Cuarta y media proporcional | `3/5 = 12/x → 20`; cuadrado con área igual a rectángulo 4 × 25 → lado 10 |
| 2:55–3:55 | Proporcionalidad directa | Ciclista 150 km en 5 h; tabla; constante `k`; recta `y = kx` por el origen |
| 3:55–4:45 | Proporcionalidad inversa | 12 obreros en 30 días → ¿cuántos en 24? (15); `xy = k`; curva |
| 4:45–5:30 | Reparto y cierre | 1.200.000 en 2 : 3 : 5 → 240.000 / 360.000 / 600.000; repaso y "¡a practicar!" |

La duración final depende del tiempo de lectura de cada frase (≈ 15 caracteres/s); el guion
se ajusta para quedar entre 5:00 y 6:00.

### 4.2 Minijuegos

| # | Juego (`game`) | Mecánica | Correcto si |
|---|---|---|---|
| 1 | `limonada` | Jarra modelo 2 limones : 3 vasos de agua; tocar para agregar limones/agua a la jarra grande; el color indica la mezcla | Razón igual a 2 : 3 con al menos 4 limones |
| 2 | `balanza-proporcion` | Platos con `a·d` y `b·c`; arrastrar el valor de `x` en `3/5 = x/20`; la balanza se inclina en vivo | `x = 12` (balanza equilibrada) |
| 3 | `directa-inversa` | Clasificar 6 situaciones en Directa / Inversa / Ninguna | Todas bien (lado–área del cuadrado → Ninguna) |
| 4 | `grafica-relacion` | Ronda 1: arrastrar 3 puntos para que la relación sea directa; ronda 2: inversa | Puntos sobre `y = kx` (ronda 1) y con `xy` constante (ronda 2), con tolerancia |
| 5 | `reparto` | Mover dos separadores en una barra de 1.200.000 para repartir en 2 : 3 : 5 | Partes 240.000 / 360.000 / 600.000 (±2 %) |
| 6 | `cuadrado-media` | Agrandar un cuadrado hasta igualar el área de un rectángulo 4 × 25 | Lado 10 (±0.2) |

## 5. Archivos que cambian

- Nuevos: `js/games/kit.js`, un archivo por juego en `js/games/`, `video/clase_razones_proporciones/*`.
- Modificados: `js/content.js` (`play`), `js/exercises.js` (`EX.play`, carga de p5.js),
  `js/courses/algebra.js` (ejercicios de `alg-11` y `alg-12`), `js/app.js` (exclusión del
  deslizar), `css/styles.css` (contenedor del lienzo), `index.html` (scripts de juegos),
  `sw.js` (`SHELL` y versión).

## 6. Pruebas

- Cada minijuego se prueba en el navegador a tamaño de celular (375 × 812): resolverlo
  bien, resolverlo mal, ver la animación de la respuesta correcta y que corazones, XP y
  barra avancen como en los demás ejercicios.
- Toques: arrastrar dentro del juego no cambia de pantalla; deslizar fuera sí.
- Sin errores en consola; p5.js carga una sola vez y funciona sin conexión tras la primera carga.
- Video: render completo, hoja de fotogramas revisada, duración entre 5:00 y 6:00.
