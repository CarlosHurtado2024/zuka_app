# Porcentajes e interés — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** La lección `alg-13` pasa a tener dos videos (Parte 1 «Porcentajes», Parte 2 «Aumentos, descuentos e interés» tras el sexto ejercicio) y once ejercicios interactivos, nueve de ellos juegos nuevos de p5.js.

**Architecture:** Cada juego es un archivo `js/games/<game>.js` que registra `GAMES['<game>'] = { grade, create }` sobre el kit existente (`mountSketch`, `lineMap`, `nearest`, `PALETTE`); `grade(state, params)` es pura y se prueba en Node con `tests/load.js`. La lección usa `clip` + `more: [{ after: 6 }]`, que el motor ya soporta. Los videos son dos carpetas manimgl copiadas de `video/clase_regla_de_tres/`.

**Tech Stack:** Vanilla JS, p5.js 1.9.4 (vía kit), KaTeX, `node --test`, manimgl 1.7.2 en `video/.venv-gl`, ffmpeg.

**Spec:** `docs/superpowers/specs/2026-11-06-porcentajes-e-interes-design.md`

## Global Constraints

- Nombres de archivo y de `game` iguales: `js/games/cascada.js` → `GAMES['cascada']`.
- Encabezado de cada juego: comentario de 2–4 líneas con la mecánica y la línea `// params = {...}   state = {...}` (como `js/games/la-obra.js`).
- `create(host, params, api)` devuelve `{ loaded: m.ready, getState, lock, destroy: () => m.remove() }`; `api.ready(bool)` habilita «Comprobar»; `api.palette` es `PALETTE`; `api.sfx?.tap?.()` en cada toque útil. Solo manejadores de ratón (`mousePressed/mouseDragged/mouseReleased`, devolviendo `false` cuando consumen el toque): el kit enlaza los táctiles.
- Ningún juego nace resuelto: `api.ready(false)` hasta que el estado cambia; el estado inicial nunca pasa `grade`.
- Texto en el lienzo con `p.textFont('system-ui')`, tamaños ≥ 11 px; pie de ayuda de una línea en `H - 12`; tras `lock()` el lienzo muestra la respuesta en `C.ok`/`C.bad`.
- Cadenas JS con barras (`\\dfrac`) se escriben con Write/Edit o un script Python desde el scratchpad, **nunca** con heredoc de Bash. `tests/contenido.test.js` lo vigila para `alg-13`.
- Registro de cada archivo nuevo en `index.html` (tras `cadena-razones.js`) y en el `SHELL` de `sw.js`; `VERSION = 'zuka-v16'` se cambia una sola vez (Tarea 10).
- Suite: `node --test tests/` debe quedar verde al cerrar cada tarea (la tarea en curso puede excluir su propio test rojo con `bash -c 'ls tests/*.test.js | grep -v X | xargs node --test'`).
- Commits: mensaje en español, terminado en `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Sin push.
- Videos: 1080 × 1920, sin voz ni subtítulos, `say()` con pausa de lectura; duración 4:30–5:30; entregables copiados a `C:\Users\User Acer\Downloads\Zuka_Clase3_<Tema>\`. Salidas de render ignoradas por git.

## Review Focus

1. `cuadricula-cien`: arrastre que sale del lienzo y vuelve — no debe pintar casillas fuera de la cuadrícula ni dejar `drag` colgado (test de `grade` con `counts` nulos; verificación manual).
2. `cruz-porcentaje`: soltar una ficha sobre una casilla ocupada devuelve la ficha anterior a la bandeja (no se pierden fichas) — verificación manual.
3. `cascada`: pegar el mismo sticker dos veces es imposible y el orden de los stickers no cambia el resultado (`grade` acepta `[1, 0]`).
4. `carrera-interes`: `grade` rechaza un mes posterior al primero que cumple (16) aunque también supere la brecha.
5. `rebote`: `up` justo en los bordes de la tolerancia (11,0 y 11,2 → incorrecto).

---

### Task 1: `cuadricula-cien` y guardia de registro

**Files:**
- Create: `js/games/cuadricula-cien.js`, `tests/cuadricula-cien.test.js`, `tests/registro.test.js`
- Modify: `index.html` (scripts tras `cadena-razones.js`), `sw.js` (`SHELL`)

**Interfaces:**
- Produces: `GAMES['cuadricula-cien'].grade(state, params)` con `params = { rounds: [{ ask, count }] }`, `state = { counts: (number|null)[] }` → `{ ok, solution }`; `solution` = «35 %, 3/4 y 0,08 son 35, 75 y 8 casillas de 100».

- [ ] **Step 1: Escribir `tests/registro.test.js`** — por cada `js/games/*.js` (`fs.readdirSync`), aserta que `index.html` contiene `src="js/games/<f>"` y que `sw.js` contiene `'js/games/<f>'`.
- [ ] **Step 2: Escribir `tests/cuadricula-cien.test.js`** con `params = { rounds: [{ ask: '35 %', count: 35 }, { ask: '3/4', count: 75 }, { ask: '0,08', count: 8 }] }`:
  - `{ counts: [35, 75, 8] }` → ok
  - `{ counts: [35, 75, 9] }` → no ok y `solution` incluye `'8'`
  - `{ counts: [null, null, null] }` → no ok
- [ ] **Step 3: Crear `js/games/cuadricula-cien.js` vacío con solo el encabezado y correr ambos tests** — Run: `node --test tests/registro.test.js tests/cuadricula-cien.test.js` · Expected: FAIL (registro: falta en index/sw; grade no definido).
- [ ] **Step 4: Implementar `grade` y `create`.** Cuadrícula de 10 × 10 centrada (celda = `min(W, H*0.62)/10`), pestañas de ronda arriba («Ronda k · pinta 35 %»), contador «n de 100» a la derecha; `mousePressed` dentro de la cuadrícula fija `paint = !cells[idx]` y pinta esa celda; `mouseDragged` pinta las celdas bajo el dedo con el mismo `paint`; `mouseReleased` cierra el arrastre. Botón «Siguiente ronda» (congela la ronda y abre la siguiente; en la última, desaparece). `counts[k]` se actualiza en vivo; `api.ready(true)` cuando las tres rondas tienen número. Miniaturas de las rondas cerradas (3 × 3 px por celda) en la fila de pestañas. Aspecto 1.15.
- [ ] **Step 5: Registrar en `index.html` y `sw.js`; correr** — Run: `node --test tests/registro.test.js tests/cuadricula-cien.test.js` · Expected: PASS.
- [ ] **Step 6: Commit** — `git add js/games/cuadricula-cien.js tests/cuadricula-cien.test.js tests/registro.test.js index.html sw.js && git commit -m "feat: juego pinta el porcentaje y guardia de registro de juegos"`.

### Task 2: `cruz-porcentaje`

**Files:** Create `js/games/cruz-porcentaje.js`, `tests/cruz-porcentaje.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `grade(state, params)` con `params = { problems: [{ text, chips: [{ label, cell }] }] }` (`cell ∈ 'p'|'C'|'B'|null`), `state = { problems: [{ cells: { p, C, B } }] }` (índice de ficha o `null`). `solution` lista por problema «p = 12, C = 8.000, B = ?».

- [ ] **Step 1: Test** con los tres problemas de la spec (fichas: P1 `12→p`, `8.000→C`, `?→B`; P2 `8→p`, `48→B`, `?→C`; P3 `170→p`, `408→B`, `?→C`, `70→null`):
  - colocación exacta en los tres → ok
  - P3 con `70` en `p` → no ok y `solution` incluye `'170'`
  - P1 con `B` vacío → no ok
  - `{ problems: [{ cells: { p: null, C: null, B: null } }, …] }` → no ok
- [ ] **Step 2: Run** `node --test tests/cruz-porcentaje.test.js` · Expected: FAIL (grade no definido).
- [ ] **Step 3: Implementar.** Pestañas «1 · 2 · 3» arriba; enunciado en dos líneas (`text`, 13 px); cruz 2 × 2 (celda `100` fija en `C.mute`, las otras tres con borde punteado y su letra `p`, `C`, `B` en gris claro); bandeja de fichas abajo (pastillas 64 × 34). Arrastrar una ficha a una casilla la coloca (si la casilla estaba ocupada, la ficha anterior vuelve a la bandeja); arrastrarla fuera la devuelve. `api.ready` cuando los tres problemas tienen sus tres casillas llenas. Tras `lock()`, cada casilla se colorea `C.ok`/`C.bad` según su ficha. Aspecto 1.2.
- [ ] **Step 4: Registrar; Run** `node --test tests/cruz-porcentaje.test.js tests/registro.test.js` · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego la cruz del porcentaje`.

### Task 3: `mezcla`

**Files:** Create `js/games/mezcla.js`, `tests/mezcla.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { solute: 40, target: 20, step: 10, max: 400 }`, `state = { water }` → ok si `solute / (solute + water) * 100 === target` (comparar con `Math.abs(... - target) < 1e-9`); `solution` = «$\\dfrac{100 \\cdot 40}{20} = 200$ g de mezcla → 160 g de agua».

- [ ] **Step 1: Test**: `{ water: 160 }` → ok; `{ water: 150 }` → no ok y `solution` incluye `'160'`; `{ water: 0 }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Vaso (rect redondeado) con capa de alcohol `C.R` fija y capa de agua `C.Z` encima cuya altura es proporcional a `water` (escala `max`); a la derecha un medidor vertical «% de alcohol» con aguja y valor (`toFixed(1)`), y la meta «20 %» como línea `C.ok`. Botones «+ 10 g» y «− 10 g» bajo el vaso; mantener pulsado repite cada 140 ms (`setInterval` en `mousePressed`, limpiado en `mouseReleased` y `destroy`). Etiqueta «agua: 160 g» en vivo. `api.ready(water > 0)`. Aspecto 1.15.
- [ ] **Step 4: Registrar; Run** `node --test tests/mezcla.test.js tests/registro.test.js` · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego el químico (mezclas y porcentaje)`.

### Task 4: `rueda-porcentaje`

**Files:** Create `js/games/rueda-porcentaje.js`, `tests/rueda-porcentaje.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { rounds: [{ part, whole }], tol: 1 }`, `state = { pct: (number|null)[] }` → ok si en cada ronda `|pct[i] − 100·part/whole| ≤ tol`; `solution` = «51 de 170 = 30 %, 63 de 180 = 35 %, 26,4 de 240 = 11 %».

- [ ] **Step 1: Test**: `{ pct: [30, 35, 11] }` → ok; `{ pct: [30.9, 35, 11] }` → ok; `{ pct: [32, 35, 11] }` → no ok y `solution` incluye `'30'`; `{ pct: [null, null, null] }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Pestañas de ronda; pastel de radio `min(W, H)*0.3` con marcas cada `whole/10` unidades etiquetadas (0, 17, 34… para 170); aguja desde el centro que se arrastra (ángulo = `atan2`, desde las 12 en sentido horario, `pct = round(ang/TWO_PI*1000)/10`); sector sombreado `C.brand` con el rótulo «k de C» donde `k = pct/100·whole` con un decimal. Anillo exterior con 20 marcas sin números; tras `lock()` se muestran los % de cada ronda y el rótulo «30 %» en `C.ok`/`C.bad`. `api.ready` cuando las tres rondas tienen `pct`. Aspecto 1.2.
- [ ] **Step 4: Registrar; Run** · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego la rueda del porcentaje`.

### Task 5: `bodegas`

**Files:** Create `js/games/bodegas.js`, `tests/bodegas.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { total: 2000, move: 20, step: 50 }`, `state = { a }` → ok si `a·(1 − move/100) === total − a + a·move/100` (equivalente a `a === total / (2 − 2·move/100)` → 1.250); `solution` = «$x - 0{,}2x = 2\\,000 - x + 0{,}2x \\Rightarrow x = 1\\,250$».

- [ ] **Step 1: Test**: `{ a: 1250 }` → ok; `{ a: 1000 }` → no ok y `solution` incluye `'1\\,250'`; `{ a: 1300 }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Dos bodegas (A izquierda `C.N`, B derecha `C.Z`) con pilas de sacos (1 saco dibujado por cada 100, parcial para el resto); barra divisoria horizontal arriba con manija arrastrable (`a` en pasos de 50, de 0 a `total`), rótulos «A: 1.250 sacos · B: 750 sacos». Al soltar la manija, animación de 0,6 s de `move %` de A hacia B (sacos pequeños viajando) y debajo los totales «después: A 1.000 · B 1.000» con un «=» que se pone `C.ok` cuando coinciden. `api.ready(a !== total/2)`. Aspecto 1.15.
- [ ] **Step 4: Registrar; Run** · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego las bodegas de azúcar`.

### Task 6: `cascada`

**Files:** Create `js/games/cascada.js`, `tests/cascada.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { price: 100000, changes: [-30, -20], step: 1 }`, `state = { applied: number[], single: number|null }` → ok si `applied` contiene cada índice exactamente una vez (en cualquier orden) y `single === Math.round(100·(1 − Π(1 + c/100)))` (44); `solution` = «$0{,}7 \\cdot 0{,}8 = 0{,}56 \\Rightarrow 44\\%$ (no 50 %)».

- [ ] **Step 1: Test**: `{ applied: [0, 1], single: 44 }` → ok; `{ applied: [1, 0], single: 44 }` → ok; `{ applied: [0, 1], single: 50 }` → no ok y `solution` incluye `'44'`; `{ applied: [0], single: 44 }` → no ok; `{ applied: [0, 0, 1], single: 44 }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Etiqueta de precio grande arriba (precio actual con `toLocaleString('es-CO')`, tachados de los precios anteriores en pequeño); stickers redondos «−30 %» `C.I` y «−20 %» `C.N` en una bandeja; arrastrar uno sobre la etiqueta lo pega (se dibuja en la esquina y el precio baja con animación de 0,5 s: conteo descendente); un sticker pegado no se puede volver a arrastrar. Deslizador horizontal «descuento único» (0–100, paso 1, manija `C.brand`) con valor «44 %» y, al lado, el precio que daría (`price·(1 − single/100)`). `api.ready` cuando los dos stickers están pegados y `single !== null`. Aspecto 1.2.
- [ ] **Step 4: Registrar; Run** · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego descuentos en cascada`.

### Task 7: `rebote`

**Files:** Create `js/games/rebote.js`, `tests/rebote.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { base: 100, drop: 10, max: 30, step: 0.1, tol: 0.06 }`, `state = { up: number|null }` → ok si `|up − 100·drop/(100 − drop)| ≤ tol`; `solution` = «$\\dfrac{10}{90} = 11{,}1\\%$: se sube sobre 90, no sobre 100».

- [ ] **Step 1: Test**: `{ up: 11.1 }` → ok; `{ up: 11.0 }` → no ok; `{ up: 11.2 }` → no ok; `{ up: 10 }` → no ok y `solution` incluye `'11{,}1'`; `{ up: null }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Tres barras verticales: «original» (100, `C.mute`), «rebajado» (90, `C.I`) y «nuevo» (`90·(1 + up/100)`, `C.brand`, `C.ok` si coincide con 100 ± tol) con una línea punteada en 100 cruzando las tres; manija vertical a la derecha «% de subida» (0–30, paso 0,1, valor `toFixed(1)`), arrastrable. `api.ready(up !== null)`. Aspecto 1.15.
- [ ] **Step 4: Registrar; Run** · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego sube y baja (volver al precio)`.

### Task 8: `dos-etapas`

**Files:** Create `js/games/dos-etapas.js`, `tests/dos-etapas.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { changes: [30, -20], output: 8840, max: 20000, step: 20 }`, `state = { input: number|null }` → ok si `Math.round(input · Π(1 + c/100)) === output`; `solution` = «$1{,}3 \\cdot 0{,}8 = 1{,}04 \\Rightarrow x = \\dfrac{8\\,840}{1{,}04} = 8\\,500$».

- [ ] **Step 1: Test**: `{ input: 8500 }` → ok; `{ input: 8520 }` → no ok y `solution` incluye `'8\\,500'`; `{ input: null }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Perilla circular a la izquierda (radio `W*0.17`): arrastrar alrededor del centro cambia `input` según el ángulo acumulado (una vuelta = 2.000; pasos de 20; de 0 a `max`); al lado, la máquina: tres cajas en columna «entrada → +30 % → −20 % → salida» con los valores intermedios (`toLocaleString('es-CO')`) y la salida fija «8.840» con un semáforo (`C.ok` si la salida calculada coincide, `C.bad` si no). Botones «−20 / +20» bajo la perilla para afinar. `api.ready(input !== null)`. Aspecto 1.15.
- [ ] **Step 4: Registrar; Run** · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego la máquina de dos etapas`.

### Task 9: `carrera-interes`

**Files:** Create `js/games/carrera-interes.js`, `tests/carrera-interes.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:** `params = { capital: 2000000, rate: 0.015, months: 24, gap: 50000 }`, `state = { month: number|null }`; `firstMonth(params)` = primer `n ≥ 1` con `capital·((1 + rate)^n − 1 − rate·n) > gap` (15) → ok si `month === firstMonth`; `solution` = «En el mes 15 la ventaja es $\\approx 50\\,400$ (en el 14, $\\approx 43\\,400$)».

- [ ] **Step 1: Test**: `{ month: 15 }` → ok; `{ month: 16 }` → no ok; `{ month: 14 }` → no ok y `solution` incluye `'15'`; `{ month: null }` → no ok.
- [ ] **Step 2: Run** · Expected: FAIL.
- [ ] **Step 3: Implementar.** Pista horizontal con dos carriles (simple `C.N`, compuesto `C.Q`): la posición de cada corredor es `lineMap(capital, capital·(1+rate)^months, …)` de su monto en el mes actual; rótulo con el monto de cada uno; medidor «ventaja del compuesto» (barra + «$ 50.400») que se pone `C.ok` cuando supera `gap`. Deslizador de meses (0–24, paso 1) abajo, arrastrable; «mes 15». `api.ready(month !== null && month > 0)`. Aspecto 1.15.
- [ ] **Step 4: Registrar; Run** · Expected: PASS.
- [ ] **Step 5: Commit** `feat: juego la carrera del interés`.

### Task 10: Lección 1.3 en `algebra.js`, SW v16 y cola

**Files:** Modify `js/courses/algebra.js` (`alg-13`), `sw.js` (`VERSION`), `tests/cola.test.js`; `tests/contenido.test.js` ya cubre `alg-13`.

- [ ] **Step 1: Test en `tests/cola.test.js`**: «la lección 1.3 real: video 2 tras el sexto ejercicio» — carga `js/content.js` + `js/courses/algebra.js`, toma `alg-13` y aserta `buildQueue(l).map(t => t.k + (t.n ?? t.i))` igual a `['clip0', 'ex0'…'ex5', 'clip1', 'ex6'…'ex10']`.
- [ ] **Step 2: Run** `node --test tests/cola.test.js` · Expected: FAIL (hoy `alg-13` no tiene `more` y tiene 3 ejercicios).
- [ ] **Step 3: Reescribir `alg-13`** con un script Python en el scratchpad (nunca heredoc): `clip: { scenes: [3 escenas sc(...) de la Parte 1] }`, `more: [{ after: 6, scenes: [3 escenas de la Parte 2] }]` y `ex` con los 11 `play(...)` de la spec (§4 y §6), cada uno con enunciado y `explain` basados en el texto guía; las tarjetas de los dos `verdadero-falso` con sus `why`. Escenas de respaldo: P1 — «por ciento = de cada 100», «la cruz 100/C = p/B» (steps 1.7, 1.8, 1.9), «más y menos (170 %, 91 %)»; P2 — «factor 1 ± r», «sucesivos se multiplican: 0,7·0,8 = 0,56 → 44 %», «interés simple vs compuesto» (reutilizar la escena de gráfica actual).
- [ ] **Step 4: `VERSION = 'zuka-v16'` en `sw.js`; Run** `node --test tests/` · Expected: PASS (cola, contenido, registro, sw y todos los juegos).
- [ ] **Step 5: Commit** `feat: lección 1.3 con dos videos y once juegos de porcentajes e interés`.

### Task 11: Verificación en el navegador

**Files:** ninguno (solo correcciones que surjan, con su test).

- [ ] **Step 1:** `preview_start` «zuka»; en la pestaña: polyfill de rAF, `window.confirm = () => true`, `S.hearts = 5`; refrescar caché (`caches.delete` + `fetch(f, {cache:'reload'})` de `sw.js`, `index.html`, `js/courses/algebra.js` y los nueve juegos). Viewport 375 × 812.
- [ ] **Step 2:** Abrir la lección `alg-13` desde la unidad; comprobar que la cola muestra el clip 1 (escenas de respaldo), el botón «Ejercicios →», y que tras el sexto ejercicio aparece «Parte 2».
- [ ] **Step 3:** Para cada uno de los nueve juegos nuevos (con el helper `__open(ex)` usado en la 1.2): captura inicial, toques sintéticos que resuelvan el juego, `Comprobar` → «correcto»; y una vez un estado incorrecto → la solución se ve. Expected: ningún error en consola; los 9 juegos caben en 375 px sin desbordar.
- [ ] **Step 4:** Cualquier defecto se corrige con test RED→GREEN y commit `fix: …`.

### Task 12: Video 1 «Porcentajes»

**Files:** Create `video/clase_porcentajes/{porcentajes.py, build.py, README.md, custom_config.yml, mb_common.py, assets/}` (copias de `video/clase_regla_de_tres/`, con `TOPIC = "porcentajes"`, `TOPIC_TITLE = "Porcentajes"`, `TOPIC_TAG = "Clase 3 · Parte 1"`, `PARTS = [("parte1", "Clase 3 · Parte 1 · Porcentajes", [S00…S07])]`).

- [ ] **Step 1:** Copiar la carpeta base (sin `dist/`, `videos/`, `build_log.txt`); escribir `porcentajes.py` con las ocho escenas de la spec §3 (`S00_Portada`, `S01_QueEs`, `S02_LaCruz`, `S03_HallarBase`, `S04_QuePorcentaje`, `S05_MasYMenos`, `S06_Mezcla`, `S07_Cierre`), reutilizando `get_card_text` y `get_rule_table` (kind `directa`, filas `100 → C`, `p → B`); nueva pieza `get_grid100(filled, size)` (cuadrícula 10 × 10 de cuadrados `Square` con `filled` pintados en `C_N`) y `get_beaker(water, alcohol)` (vaso con dos capas).
- [ ] **Step 2:** Borrador rápido `python build.py --quality=-l` (PATH con `../.venv-gl/Scripts`, `PYTHONPATH=.`) · Expected: `dist/porcentajes_parte1.mp4` entre 4:30 y 5:30; si queda corto, ampliar narración (frases de verificación, ejemplo extra) hasta cumplir.
- [ ] **Step 3:** Hoja de contactos (`ffmpeg -vf fps=1/4,scale=200:-1,tile=6x4`) en el scratchpad y revisarla: textos dentro del cuadro, sin solapes.
- [ ] **Step 4:** Render HD `python build.py` (fondo, ≥ 10 min) y copiar `dist/*` a `C:\Users\User Acer\Downloads\Zuka_Clase3_Porcentajes\`.
- [ ] **Step 5:** Commit `feat: video de porcentajes (Clase 3 · Parte 1)` con la carpeta (sin salidas).

### Task 13: Video 2 «Aumentos, descuentos e interés»

**Files:** Create `video/clase_interes/{interes.py, build.py, README.md, custom_config.yml, mb_common.py, assets/}` (`TOPIC = "interes"`, `TOPIC_TAG = "Clase 3 · Parte 2"`, `PARTS = [("parte2", "Clase 3 · Parte 2 · Aumentos, descuentos e interés", [S00…S06])]`).

- [ ] **Step 1:** Escenas de la spec §5 (`S00_Portada`, `S01_Factor`, `S02_Sucesivos`, `S03_Volver`, `S04_Simple`, `S05_Compuesto`, `S06_Cierre`); piezas: `get_price_tag(text)` (etiqueta con precio tachado/nuevo), línea de tiempo de 12 monedas (`Circle` con «30 000»), y `Axes` 0–24 meses con recta `1 + 0.015t` y curva `1.015**t` (como en el viz actual de la lección).
- [ ] **Step 2:** Borrador `--quality=-l` · Expected: 4:30–5:30.
- [ ] **Step 3:** Hoja de contactos y revisión.
- [ ] **Step 4:** Render HD y copia a `C:\Users\User Acer\Downloads\Zuka_Clase3_Interes\`.
- [ ] **Step 5:** Commit `feat: video de aumentos, descuentos e interés (Clase 3 · Parte 2)`.

### Task 14: Revisión final y entrega

- [ ] Paquete de revisión (`review-package`) desde `git merge-base main HEAD`; revisor fresco; fix pass con TDD; `node --test tests/` verde; `superpowers:finishing-a-development-branch` (fusión en `main` y push **solo** con el «Sí, súbelo» del usuario).
