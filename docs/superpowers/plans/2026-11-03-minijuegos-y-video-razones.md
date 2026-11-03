# Minijuegos con p5.js y video de Razones — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un tipo de ejercicio `play` con minijuegos de p5.js (7 para la lección 1.1, 6 para la 1.2) y producir el video de la lección 1.2 con su guion.

**Architecture:** Cada minijuego vive en `js/games/<nombre>.js` y registra en `GAMES` una función pura `grade(state, params)` y un `create(host, params, api)` que monta un sketch de p5.js en modo instancia. `EX.play` en `js/exercises.js` adapta eso al contrato existente (`check`, `lock`, `destroy`, `ready`), así `js/app.js` no cambia salvo la exclusión del deslizar. El video se hace con manimgl reutilizando `mb_common.py` de la clase 1.

**Tech Stack:** JavaScript sin compilación (scripts `defer`), p5.js 1.9.4 (cdnjs), KaTeX, `node --test` para la lógica de calificación, manimgl en `video/.venv-gl`.

**Spec:** `docs/superpowers/specs/2026-11-03-minijuegos-y-video-razones-design.md`

## Global Constraints

- p5.js 1.9.4 desde `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js`, cargado solo cuando aparece el primer ejercicio `play`.
- Los minijuegos reemplazan los ejercicios actuales de `alg-11` (7 juegos) y `alg-12` (6 juegos); los videos de `alg-11` no cambian.
- Contrato de ejercicio intacto: corazones, XP, barra, retroalimentación con `explain` y repetición de fallados funcionan igual que con `mc`.
- Paleta: ℕ `#FFC53D`, ℤ `#4FA8FF`, ℚ `#34D399`, 𝕀 `#FF6B7A`, ℝ `#B9A6FF`, acento `#8B7BFF`, fondo `#0f1226`, texto `#EEF0FF`.
- Lienzo ≈ 4:5 al ancho de la tarjeta, escalado por `devicePixelRatio`, `touch-action: none`.
- Arrastrar dentro de un juego no dispara el deslizar entre videos y ejercicios.
- Textos en español; fórmulas en TeX entre `$…$`.
- Video: 1080 × 1920, tema morado, sin subtítulos ni voz, duración entre 5:00 y 6:00; entregables en `Descargas/Zuka_Clase2_Razones_proporciones/`.
- Cada archivo nuevo de `js/games/` se agrega a `index.html` (script `defer`) y al `SHELL` de `sw.js`; se sube la `VERSION` del service worker una vez por entrega.

## Review Focus

- Volver a un ejercicio `play` tras repasar un video (deslizar a la derecha y regresar): el juego se monta de nuevo en blanco, sin lienzos duplicados ni sketches huérfanos — test en Task 1 (montar y destruir dos veces deja 0 lienzos).
- Ejercicio `play` fallado que vuelve al final de la cola: se crea una instancia nueva con estado limpio — cubierto por el mismo test de Task 1.
- Primera carga sin conexión antes de haber descargado p5.js: el ejercicio muestra "Necesitas conexión para este ejercicio" y **Comprobar** queda deshabilitado en vez de colgarse — test en Task 1.
- Toques rápidos o soltar fuera del lienzo durante un arrastre: el elemento vuelve a un lugar válido, nunca queda fuera de pantalla — verificación manual en cada task de juego (paso "soltar fuera").
- Respuestas equivalentes no idénticas (`27/99` vs `3/11`, `b = 2` o `−8`, extremos del intervalo invertidos): se aceptan — tests en Tasks 5, 7 y 8.

---

### Task 1: Motor de minijuegos (`play`) y arnés de pruebas

**Files:**
- Create: `js/games/kit.js`, `tests/load.js`, `tests/engine.test.js`, `package.json`
- Modify: `js/content.js` (constructor `play`), `js/exercises.js` (`EX.play`, `EX_KIND.play`), `js/app.js` (exclusión `.play` en el `pointerdown` del deslizar), `css/styles.css` (`.play`), `index.html` (scripts), `sw.js` (`SHELL`, `VERSION`)

**Interfaces:**
- Produces:
  - `play(game: string, q: string, params: object, explain: string) → { type: 'play', game, q, params, explain }` en `js/content.js`.
  - Registro global `const GAMES = {}` en `js/games/kit.js`; cada juego hace `GAMES[name] = { grade, create }`:
    - `grade(state, params) → { ok: boolean, solution: string }` (pura, sin DOM).
    - `create(host: HTMLElement, params, api) → { getState(): object, lock(ok: boolean): void, destroy(): void }`.
  - `api = { ready(ok: boolean), sfx: Sfx, palette: PALETTE, tex: (str) => string }` (`tex` es el de `js/ui.js`, para etiquetas con fórmulas en HTML superpuesto al lienzo).
  - En `kit.js`: `loadP5(): Promise<p5>`; `mountSketch(host, sketch: (p) => void) → { remove(): void }` (espera a `loadP5`, crea `new p5(sketch, host)`, tamaño 4:5 al ancho de `host`); `PALETTE` con los colores de Global Constraints; `lineMap(min, max, x0, x1) → { toPx(v), toVal(px) }`; `nearest(points, x, y, radius) → index | -1`.
  - `EX.play(area, ex, ready)` devuelve `{ check: () => GAMES[ex.game].grade(inst.getState(), ex.params), lock, destroy }`.
  - `tests/load.js`: `loadGame(file: string) → GAMES` (carga `js/games/kit.js` y el archivo dado en un `vm` con `window`/`document` mínimos).

- [ ] **Step 1: Escribir los tests del motor** en `tests/engine.test.js` con `node:test`:
  - `play() arma el objeto` → `assert.deepEqual(play('x', 'q', {a:1}, 'e'), {type:'play', game:'x', q:'q', params:{a:1}, explain:'e'})`.
  - `lineMap ida y vuelta` → con `lineMap(-3, 4, 0, 700)`: `toPx(-3) === 0`, `toPx(4) === 700`, `toVal(toPx(1.5)) ≈ 1.5`.
  - `nearest` → devuelve el índice del punto a menos de `radius` y `-1` si ninguno.
- [ ] **Step 2: Correr** `node --test tests/` → FAIL (`play`/`lineMap` no definidos).
- [ ] **Step 3: Implementar** `package.json` (`{"private": true, "type": "commonjs", "scripts": {"test": "node --test tests/"}}`), `tests/load.js`, `play` en `js/content.js`, y `GAMES`, `PALETTE`, `lineMap`, `nearest`, `loadP5`, `mountSketch` en `js/games/kit.js`. `loadP5` reutiliza la promesa (una sola carga) y rechaza si el script falla.
- [ ] **Step 4: Correr** `node --test tests/` → PASS.
- [ ] **Step 5: Implementar `EX.play`** en `js/exercises.js`: contenedor `<div class="play">`; si `GAMES[ex.game]` no existe, mostrar error claro; si `loadP5` falla, mostrar "Necesitas conexión para este ejercicio" y dejar `ready(false)`. `destroy` llama `inst.destroy()`, que hace `p.remove()`. Agregar `.play` (borde, radio 18 px, `touch-action: none`, fondo `#0f1226`) en `css/styles.css`, y `.play` a la lista de exclusión del `pointerdown` del deslizar en `js/app.js`.
- [ ] **Step 6: Verificación en navegador** con un juego temporal de prueba registrado desde la consola (un círculo que se toca y llama `api.ready(true)`): montar el ejercicio, comprobar, salir y volver dos veces → `document.querySelectorAll('.play canvas').length === 1`; con p5 bloqueado (URL inválida en `loadP5`) se ve el mensaje sin conexión. Sin errores en consola.
- [ ] **Step 7: Commit** `feat: motor de minijuegos play con p5.js`.

### Task 2: Juego `cajas-numericas` (1.1 · #1)

**Files:** Create `js/games/cajas-numericas.js`, `tests/cajas-numericas.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Consumes: `GAMES`, `mountSketch`, `PALETTE`, `nearest` (Task 1).
- Produces: `params = { cards: [{ tex: string, set: 'N'|'Z'|'Q'|'I'|'R' }] }`; `state = { placed: Array<'N'|'Z'|'Q'|'I'|'R'|null> }` (mismo orden que `cards`).

- [ ] **Step 1: Tests** de `grade`: todas en su caja más pequeña → `ok: true`; `√49` en ℤ (no en ℕ) → `ok: false`; alguna `null` → `ok: false`; `solution` lista las fallidas, p. ej. contiene `"\\sqrt{49}"` cuando esa está mal.
- [ ] **Step 2:** `node --test tests/cajas-numericas.test.js` → FAIL.
- [ ] **Step 3: Implementar** `grade` y `create`: cajas anidadas ℕ⊂ℤ⊂ℚ⊂ℝ con 𝕀 aparte dentro de ℝ; tarjetas abajo que se arrastran; soltar fuera de toda caja devuelve la tarjeta a su lugar; `ready(true)` cuando todas están colocadas; `lock(false)` anima las mal ubicadas hacia su caja correcta.
- [ ] **Step 4:** `node --test tests/cajas-numericas.test.js` → PASS.
- [ ] **Step 5: Verificación en navegador** (375 × 812): resolver bien, resolver mal y ver la animación; soltar fuera del lienzo.
- [ ] **Step 6: Commit** `feat: juego cajas numéricas`.

### Task 3: Juego `ecuacion-familia` (1.1 · #2)

**Files:** Create `js/games/ecuacion-familia.js`, `tests/ecuacion-familia.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { pairs: [{ left: string, right: string }] }` (la respuesta correcta de `left[i]` es `right[i]`; la columna derecha se muestra barajada); `state = { links: Array<number|null> }` (`links[i]` = índice de `pairs` elegido para la ecuación `i`).

- [ ] **Step 1: Tests:** `links = [0,1,2,3]` → ok; dos ecuaciones al mismo destino → no ok; alguna `null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** trazar una línea arrastrando desde una ecuación hasta una familia; tocar una línea la borra; `ready` cuando las 4 están unidas; `lock(false)` dibuja en verde las correctas.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** resolver bien y mal; soltar la línea en el vacío no crea unión.
- [ ] **Step 6: Commit** `feat: juego ecuación–familia`.

### Task 4: Juego `ubica-en-recta` (1.1 · #3)

**Files:** Create `js/games/ubica-en-recta.js`, `tests/ubica-en-recta.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Consumes: `lineMap`.
- Produces: `params = { min: -3, max: 4, tol: 0.15, points: [{ tex, value }] }`; `state = { values: Array<number|null> }`.

- [ ] **Step 1: Tests:** valores exactos → ok; uno a 0.2 de su sitio → no ok; uno a 0.1 → ok; `null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** recta con marcas enteras; fichas arriba que se sueltan sobre la recta (fuera de la recta vuelven arriba); `lock` muestra una lupa con la posición exacta de cada una.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** resolver, fallar, soltar fuera.
- [ ] **Step 6: Commit** `feat: juego ubicar en la recta`.

### Task 5: Juego `maquina-fracciones` (1.1 · #4)

**Files:** Create `js/games/maquina-fracciones.js`, `tests/maquina-fracciones.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { decimal: '0.\\overline{27}', target: [3, 11], max: 999 }`; `state = { num: number, den: number }`.

- [ ] **Step 1: Tests:** `{27, 99}` → ok (equivalente); `{3, 11}` → ok; `{27, 100}` → no ok; `{5, 0}` → no ok (sin división por cero).
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** dos ruedas (arrastrar arriba/abajo o botones ±) de 0 a `max`; al cambiar, la máquina muestra la fracción simplificada y su decimal calculado; `ready` cuando `den > 0`.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** armar 27/99 y ver la simplificación a 3/11.
- [ ] **Step 6: Commit** `feat: juego máquina de fracciones`.

### Task 6: Juego `reglas-del-juego` (1.1 · #5)

**Files:** Create `js/games/reglas-del-juego.js`, `tests/reglas-del-juego.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { rules: string[], items: [{ tex, rule }] }`; `state = { assigned: Array<string|null> }`.

- [ ] **Step 1: Tests:** todas correctas → ok; una cambiada → no ok; `null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** etiquetas de propiedad que se arrastran sobre cada igualdad (una etiqueta puede usarse varias veces); si la distributiva queda bien al bloquear, se anima el modelo de área `a(b+c)`.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** resolver y fallar.
- [ ] **Step 6: Commit** `feat: juego reglas del juego`.

### Task 7: Juego `dibuja-intervalo` (1.1 · #6)

**Files:** Create `js/games/dibuja-intervalo.js`, `tests/dibuja-intervalo.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { min: -5, max: 7, a: -2, b: 5, aClosed: true, bClosed: false }`; `state = { left: number, right: number, leftClosed: boolean, rightClosed: boolean }` (enteros por ajuste a la marca más cercana).

- [ ] **Step 1: Tests:** `{-2, 5, true, false}` → ok; extremos invertidos `{5, -2, false, true}` → ok (se normaliza); `-2` vacío → no ok; extremo en 4 → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** dos asas que se arrastran y se ajustan a enteros; tocar un asa alterna lleno/vacío; segmento sombreado entre ellas; `ready(true)` desde el inicio.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** dibujar el intervalo y cruzar las asas.
- [ ] **Step 6: Commit** `feat: juego dibujar intervalo`.

### Task 8: Juego `distancia-justa` (1.1 · #7)

**Files:** Create `js/games/distancia-justa.js`, `tests/distancia-justa.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { min: -10, max: 6, a: -3, d: 5 }`; `state = { b: number|null }` (entero).

- [ ] **Step 1: Tests:** `b = 2` → ok; `b = -8` → ok; `b = 1` → no ok; `null` → no ok; `solution` menciona ambas soluciones `2` y `-8`.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** `a` fijo, `b` arrastrable con ajuste a enteros; una "cuerda" entre ambos muestra `|b − a|` en vivo; `lock` revela las dos posiciones válidas.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** probar 2, −8 y 1.
- [ ] **Step 6: Commit** `feat: juego distancia justa`.

### Task 9: Lección 1.1 con sus 7 minijuegos

**Files:** Modify `js/courses/algebra.js` (array `ex` de `alg-11`), `sw.js` (`VERSION`).

**Interfaces:** Consumes los `params` de Tasks 2–8.

- [ ] **Step 1: Reemplazar los 5 ejercicios de `alg-11`** por 7 `play(...)` en el orden de la spec, con estos `params` y un `explain` por juego:
  - `cajas-numericas`: `7→N, -3→Z, 0→Z, \tfrac34→Q, 0.\overline{3}→Q, \sqrt{49}→N, \sqrt2→I, \pi→I, -\tfrac82→Z`.
  - `ecuacion-familia`: `x+5=2 → ℤ`, `3x=2 → ℚ`, `x^2=2 → 𝕀`, `x^2+1=0 → fuera de ℝ (ℂ)`.
  - `ubica-en-recta`: `-\tfrac32=-1.5, \tfrac34=0.75, \sqrt2=1.4142, \pi=3.1416, -\sqrt4=-2`.
  - `maquina-fracciones`: `0.\overline{27}`, `[3, 11]`.
  - `reglas-del-juego`: `a+b=b+a` conmutativa, `(ab)c=a(bc)` asociativa, `a(b+c)=ab+ac` distributiva, `a+0=a` neutro, `a+(-a)=0` inverso.
  - `dibuja-intervalo`: `{x : -2 ≤ x < 5}`.
  - `distancia-justa`: `a=-3, d=5`.
- [ ] **Step 2: Verificación de contenido:** en la consola del navegador, todas las cadenas de `alg-11` pasan por `tex()` sin `katex-error` (mismo chequeo usado antes).
- [ ] **Step 3: Recorrido completo en navegador** (375 × 812): abrir la lección 1.1, ver los videos, resolver los 7 juegos (fallar uno), terminar la lección con XP y racha; deslizar entre videos y juegos.
- [ ] **Step 4: Commit** `feat: lección 1.1 con minijuegos`.

### Task 10: Juego `limonada` (1.2 · #1)

**Files:** Create `js/games/limonada.js`, `tests/limonada.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { base: [2, 3], minLemons: 4, maxEach: 12 }`; `state = { lemons: number, water: number }`.

- [ ] **Step 1: Tests:** `{4, 6}` ok; `{6, 9}` ok; `{2, 3}` no ok (menos de 4 limones); `{4, 5}` no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** jarra modelo 2 : 3 y jarra grande; botones/toques para agregar o quitar limón y vaso de agua (0 a `maxEach`); el color de la mezcla interpola según `lemons/(lemons+water)` y coincide con el modelo cuando la razón es igual; `ready` cuando hay al menos un limón y un vaso.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** 4 : 6 y 4 : 5.
- [ ] **Step 6: Commit** `feat: juego limonada`.

### Task 11: Juego `balanza-proporcion` (1.2 · #2)

**Files:** Create `js/games/balanza-proporcion.js`, `tests/balanza-proporcion.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { a: 3, b: 5, d: 20, min: 0, max: 30 }` (proporción `a/b = x/d`); `state = { x: number }` (entero).

- [ ] **Step 1: Tests:** `x = 12` ok; `x = 11` no ok; `solution` contiene `12`.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** balanza cuyos platos muestran `a·d` y `b·x`; deslizar `x` inclina la balanza según `a·d − b·x` en vivo; `ready(true)` tras el primer movimiento.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** equilibrar en 12.
- [ ] **Step 6: Commit** `feat: juego balanza de la proporción`.

### Task 12: Juego `directa-inversa` (1.2 · #3)

**Files:** Create `js/games/directa-inversa.js`, `tests/directa-inversa.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { items: [{ text, kind: 'directa'|'inversa'|'ninguna' }] }`; `state = { assigned: Array<string|null> }`.

- [ ] **Step 1: Tests:** todas correctas ok; "lado y área de un cuadrado" en directa → no ok; `null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** tarjetas de situación que se arrastran a tres cajas; `lock(false)` mueve las mal clasificadas a su caja.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** resolver y fallar.
- [ ] **Step 6: Commit** `feat: juego directa, inversa o ninguna`.

### Task 13: Juego `grafica-relacion` (1.2 · #4)

**Files:** Create `js/games/grafica-relacion.js`, `tests/grafica-relacion.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { kind: 'directa'|'inversa', k: number, given: [[x, y]], xs: number[], tol: 0.25, xmax, ymax }`; `state = { ys: Array<number|null> }` (alturas de los puntos en `xs`). La lección usa este juego dos veces: `directa` con `k = 1.5, given [[2,3]], xs [4,6,8]` e `inversa` con `k = 12, given [[2,6]], xs [3,4,6]`.

- [ ] **Step 1: Tests:** directa con `ys = [6, 9, 12]` ok; inversa con `ys = [4, 3, 2]` ok; un valor a 0.3 → no ok; `null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** cuadrícula con el punto dado fijo y puntos arrastrables en vertical sobre cada `x` de `xs`; al bloquear dibuja la recta `y = kx` o la curva `y = k/x`.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** ambas variantes.
- [ ] **Step 6: Commit** `feat: juego graficar la relación`.

### Task 14: Juegos `reparto` y `cuadrado-media` (1.2 · #5 y #6)

**Files:** Create `js/games/reparto.js`, `js/games/cuadrado-media.js`, `tests/reparto.test.js`, `tests/cuadrado-media.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- `reparto`: `params = { total: 1200000, parts: [2, 3, 5], tol: 0.02 }`; `state = { cuts: [number, number] }` (fracciones 0–1).
- `cuadrado-media`: `params = { w: 4, h: 25, tol: 0.2 }`; `state = { side: number }`.

- [ ] **Step 1: Tests:** `reparto` con `cuts [0.2, 0.5]` ok, `[0.25, 0.5]` no ok, cortes invertidos `[0.5, 0.2]` ok; `cuadrado-media` con `side 10` ok, `9.9` ok, `9.5` no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** `reparto` — barra de dinero con dos separadores arrastrables y montos en vivo con separador de miles; `cuadrado-media` — rectángulo 4 × 25 a escala y un cuadrado que crece al arrastrar su esquina, mostrando ambas áreas.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** ambos.
- [ ] **Step 6: Commit** `feat: juegos reparto y cuadrado de la media`.

### Task 15: Lección 1.2 con sus minijuegos

**Files:** Modify `js/courses/algebra.js` (array `ex` de `alg-12`), `sw.js` (`VERSION`).

- [ ] **Step 1: Reemplazar los 5 ejercicios de `alg-12`** por 7 `play(...)` (6 juegos; `grafica-relacion` se usa dos veces, una directa y otra inversa, como en la mecánica de la spec): `limonada`, `balanza-proporcion`, `directa-inversa` (situaciones: distancia–tiempo a velocidad fija → directa; obreros–días para una obra → inversa; velocidad–tiempo para un trayecto → inversa; precio–cantidad del mismo producto → directa; salario–horas a tarifa fija → directa; lado–área de un cuadrado → ninguna), `grafica-relacion` directa, `grafica-relacion` inversa, `reparto`, `cuadrado-media`; cada uno con `explain` basado en el texto guía §1.1.
- [ ] **Step 2: Verificación de contenido** con `tex()` sin `katex-error`.
- [ ] **Step 3: Recorrido completo** de la lección 1.2 en navegador (con el clip animado actual mientras llega el video de Bunny).
- [ ] **Step 4: Commit** `feat: lección 1.2 con minijuegos`.

### Task 16: Escenas del video de Razones y proporciones

**Files:** Create `video/clase_razones_proporciones/` con `razones_proporciones.py`, `build.py`, `custom_config.yml`, `README.md`, `assets/` (copias de `fondo_algebra.png` y `zuka_mascota.png`), y `mb_common.py` copiado de `video/clase_sistemas_numericos/`. Modify `.gitignore` (`video/clase_razones_proporciones/videos/`, `video/clase_razones_proporciones/dist/`, `video/clase_razones_proporciones/build_log.txt`) antes del primer commit.

**Interfaces:** Consumes `MBScene`, `say`, `hold`, `mark`, `set_header`, `get_notation`, `get_number_line`, `get_card` de `mb_common.py`.

- [ ] **Step 1: Escribir las escenas** `S00_Portada` (part_tag "Clase 2", título "Razones y proporciones"), `S01_Razon`, `S02_Proporcion`, `S03_CuartaMedia`, `S04_Directa`, `S05_Inversa`, `S06_RepartoCierre`, con el contenido y los valores de la tabla de la spec §4.1 (15/5, 4/20, receta 2 : 3, π y φ, 5/4 y 4/5; 15/3 = 20/4, `ad = bc`; 3/5 = 12/x → 20, media de 4 y 25 → 10; ciclista 150 km/5 h; 12 obreros/30 días → 15 obreros/24 días; 1.200.000 en 2 : 3 : 5).
- [ ] **Step 2: `build.py`** con una sola parte `("parte1", "Clase 2 · Razones y proporciones", [S00…S06])`, salida `dist/razones_proporciones_parte1.mp4`, `.srt` y `.md`.
- [ ] **Step 3: Borrador** — renderizar cada escena con `-l` (PATH y PYTHONPATH como en la clase 1) y sumar `duration` de `videos/meta/*.json` → entre 300 y 360 s; ajustar el texto de `say` si no.
- [ ] **Step 4: Hoja de fotogramas** del borrador y corrección de solapamientos o textos fuera del lienzo.
- [ ] **Step 5: Commit** `feat: escenas del video de razones y proporciones` (los videos generados quedan en `.gitignore`).

### Task 17: Render final y entrega del video

**Files:** ninguno nuevo en el repositorio (las salidas están ignoradas desde Task 16).

- [ ] **Step 1: Render HD** con `python build.py` en segundo plano → `Listo: parte1: X min` con X entre 5.0 y 6.0.
- [ ] **Step 2: Hoja de fotogramas** de `dist/razones_proporciones_parte1.mp4` (un cuadro por subtítulo) y revisión visual.
- [ ] **Step 3: Copiar** `.mp4`, `_guion.srt` y `_guion.md` a `Descargas/Zuka_Clase2_Razones_proporciones/`.
- [ ] **Step 4: Commit** solo si el README o las escenas cambiaron por la revisión: `fix: ajustes del video de razones`.
