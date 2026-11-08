# Cálculo diferencial · Unidad 2: funciones

Cronograma 2026-2 de Cálculo diferencial, clases 4–9: definición de función, recta vertical, dominio y
rango, par/impar, creciente/decreciente (4); tipos de funciones (5); operaciones y composición (6);
funciones a tramos, valor absoluto, función algebraica (7); transformaciones (8); biyectiva e inversa (9).
Material guía: Jesús del Valle, módulos de funciones; Stewart, cap. 1; talleres de la UNAL (funciones).

## Decisiones

- Seis lecciones, una por clase y un video cada una (C5–C10, ~3–4 min). Se conservan `alg-52`, `alg-53`,
  `alg-61`, `alg-62` (progreso guardado) y se agregan `calc-tipos` y `calc-tramos` (llenan el hueco
  «funciones a tramos» del spec del cronograma). Orden: alg-52, calc-tipos, alg-53, calc-tramos, alg-61,
  alg-62.
- Videos con la plantilla de Cálculo (`mk_calc_class.py`: fondo rosa de Cálculo `fondo_calculo.png`, el de
  la app, y `zoom_to` / `zoom_reset` de la cámara de manimgl). Intuición primero, sin voz ni preguntas.
- Ejercicios: sin opción múltiple, mayoría juegos, todos con pista, sin repetir los ejemplos del video.
  Once juegos nuevos, cada uno con una mecánica distinta; se reutilizan `dibuja-intervalo` y `une-parejas`.
- Todos los juegos leen `api.palette` al dibujar y caben en 300–380 px.

## Juegos nuevos

| Juego | Lección | Mecánica | Estado |
|---|---|---|---|
| `proyector-sombras` | alg-52 | dos pares de corchetes (eje x y eje y) que se arrastran; tocar alterna lleno/vacío; arrastrar al borde = ∞. Al comprobar se encienden las linternas y aparecen las sombras reales | `{ rounds: [{ dom: [a, b, ac, bc], ran: [...] }] }` |
| `completa-simetria` | alg-52 | la mitad derecha está dada; se arrastran los puntos de la izquierda para que la gráfica sea par o impar | `{ ys: [[y(−1), y(−2), …]] }` |
| `raices-imanes` | calc-tipos | imanes que se pegan al eje x (raíces) y un botón que cambia el coeficiente principal; la curva y la fórmula factorizada se arman en vivo sobre la gráfica fantasma | `{ rounds: [{ roots, a }] }` |
| `cruz-asintotas` | calc-tipos | se arrastra la cruz de asíntotas; la hipérbola la sigue | `{ cross: [[h, v]] }` |
| `apila-alturas` | alg-53 | sobre cada x se arrastra una cuenta hasta f(x) + g(x) (o f·g); al comprobar se apilan las barras | `{ ys: [[…]] }` |
| `tuberia-maquinas` | alg-53 | fichas-máquina que se meten en una tubería; una bolita muestra el número pasando por cada máquina | `{ slots: [[i, j, …]] }` |
| `arma-tramos` | calc-tramos | cuatro asas verticales (extremos de cada tramo) y los puntos del corte, que se tocan para llenarlos o vaciarlos | `{ rounds: [{ ys: [4], dots: [2] }] }` |
| `dobla-negativos` | calc-tramos | se tocan los trozos de la gráfica bajo el eje para doblarlos hacia arriba (|g|) | `{ folds: [[bool]] }` |
| `sellos-graficas` | alg-61 | sellos (→ ← ↑ ↓ ×2 ×½ reflejos) que se apilan en orden y transforman la gráfica base hasta la fantasma | `{ stamps: [[código]] }` |
| `espejo-diagonal` | alg-62 | se arrastran los puntos de f hasta su reflejo en y = x; aparece la curva de f⁻¹ | `{ pts: [[[x, y]]] }` |
| `cofre-candados` | alg-62 | el cofre trae candados apilados (las operaciones de f); se cuelgan llaves en orden para abrirlo | `{ keys: [[i]] }` |

## Lecciones

1. **C5 `alg-52` Funciones: dominio, rango y simetría.** Video: la máquina de jugos (una salida por
   entrada), recta vertical con zoom, dominio natural de $\tfrac{1}{x - 2}$ y $\sqrt{x + 1}$, rango como
   sombra de $x^2 - 1$, par/impar como espejos, creciente/decreciente como subir/bajar una colina.
   Ejercicios: `proyector-sombras`, `dibuja-intervalo` (dominio de $\sqrt{5 - x} + \sqrt{x + 2}$),
   `completa-simetria`, dos `num`.
2. **C6 `calc-tipos` Tipos de funciones.** Video: galería (constante, lineal, cuadrática, polinómica con
   raíz doble que rebota — zoom —, potencia par/impar, racional $\tfrac{1}{x}$ con asíntotas).
   Ejercicios: `raices-imanes`, `cruz-asintotas`, `une-parejas` (fórmula ↔ tipo), dos `num`.
3. **C7 `alg-53` Operaciones y composición.** Video: alturas que se suman, cadena de máquinas
   $f(x) = x + 1$, $g(x) = x^2$: $g(f(3)) = 16 \ne f(g(3)) = 10$, desarmar una compuesta, dominio de la
   compuesta. Ejercicios: `apila-alturas`, dos `tuberia-maquinas` (armar y desarmar), dos `num`.
4. **C8 `calc-tramos` Funciones a tramos y valor absoluto.** Video: tarifa de parqueadero, dibujar a
   trozos con puntos llenos y vacíos, $|x|$ como dos tramos, $|x^2 - 4|$ doblando lo negativo (zoom),
   función algebraica. Ejercicios: `arma-tramos`, `dobla-negativos`, `dibuja-intervalo`, dos `num`.
5. **C9 `alg-61` Transformaciones.** Video: subir/bajar, correr (al revés de lo que dice el signo, con
   zoom), estirar, reflejar, el orden importa. Ejercicios: dos `sellos-graficas`, `une-parejas`, dos `num`.
6. **C10 `alg-62` Biyectiva e inversa.** Video: recta horizontal, «medias y zapatos» (deshacer en orden
   inverso), despejar, espejo $y = x$ con zoom, restringir $x^2$. Ejercicios: `espejo-diagonal`,
   `cofre-candados`, `dibuja-intervalo` (restringir), dos `num`.

## Pruebas

`tests/juegos-calculo-u2.test.js` (grade y funciones puras de los once juegos) y
`tests/contenido-calculo-u2.test.js` (orden y títulos, sin opción múltiple, mayoría juegos, pistas que no
regalan, rondas alcanzables con los controles, respuestas, sin ejemplos del video). `estructura.test.js`
pasa a la unidad de seis lecciones.
