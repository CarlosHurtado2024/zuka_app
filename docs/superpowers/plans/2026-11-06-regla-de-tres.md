# Regla de tres (Parte 2 de la lección 1.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** La lección `alg-12` muestra un segundo video (regla de tres simple y compuesta) después de sus primeros siete ejercicios, seguido de cinco minijuegos nuevos; la lección `alg-13` queda solo con porcentajes e interés.

**Architecture:** El orden de tareas de una lección lo arma una función pura `buildQueue(l)` en `js/content.js` (probada en Node), que respeta `after: n` en los videos de `more`; `startLesson` en `js/app.js` la usa y calcula repaso y rótulos sobre la cola. Los juegos nuevos siguen el contrato `GAMES[name] = { grade, create }` de `js/games/kit.js`. El video se produce con la canalización manimgl de `video/clase_razones_proporciones/` copiada a `video/clase_regla_de_tres/`.

**Tech Stack:** Vanilla JS (sin build), p5.js 1.9.4 en modo instancia, KaTeX, `node --test tests/` con `tests/load.js`, manimgl 1.7.2 en `video/.venv-gl`, ffmpeg.

**Spec:** `docs/superpowers/specs/2026-11-06-regla-de-tres-design.md`

## Global Constraints

- Contrato de juego: `grade(state, params) → { ok, solution }` pura; `create(host, params, api) → { loaded, getState, lock, destroy }` con `api = { ready, sfx, palette, tex }`; solo manejadores de ratón (`mountSketch` enlaza los táctiles).
- Textos para el lienzo en `label`; TeX en `tex`/`explain` entre `$…$`; las cadenas de las lecciones se escriben con el editor (nunca con heredoc de Bash) y `tests/contenido.test.js` las vigila.
- Cada archivo nuevo de `js/games/` se agrega a `index.html` (script `defer`) y al `SHELL` de `sw.js`; `VERSION` del service worker sube una vez por entrega (`zuka-v14` → `zuka-v15`, en la Task 6).
- Paleta `PALETTE` de `kit.js`; lienzo al ancho del contenedor con `aspect`; `touch-action: none` lo pone `.play`.
- Video: 1080 × 1920, tema morado, sin voz ni subtítulos, duración entre 4:30 y 5:30; salidas ignoradas por git; entrega en `Descargas/Zuka_Clase2_Regla_de_tres/` (`Descargas` = `C:\Users\User Acer\Downloads`).
- Commits en español con la atribución `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; no se sube a GitHub sin pedir permiso.

## Review Focus

- Fallar un juego nuevo y verlo repetido al final de la cola, después de que el video 2 ya pasó: el video no se repite y el rótulo del repaso sigue correcto — test en Task 1 (`requeue` no toca los clips) y recorrido en Task 6.
- Deslizar atrás desde el ejercicio 8 (primero tras el video 2) muestra el video 2, y desde ahí otro deslizar atrás muestra el video 1; «siguiente» vuelve al ejercicio 8 — recorrido en Task 6.
- Lección sin video 2 todavía (el ID de Bunny llega después): la cola es `clip0, ex0…ex11` y todo funciona — test en Task 1 (`more` vacío) y recorrido en Task 6.
- `bascula` con la rueda en 0 o en el tope (40.000): Comprobar se habilita solo tras mover la rueda; el valor se muestra con separador de miles — verificación manual en Task 3.
- `la-obra` con 1 obrero (360 días) y 40 obreros (9 días): el calendario no se sale del lienzo — verificación manual en Task 4.

---

### Task 1: Cola de la lección con videos intercalados

**Files:** Modify `js/content.js` (añadir `buildQueue`), `js/app.js:284-404` (`startLesson`: cola, repaso, rótulos); Create `tests/cola.test.js`.

**Interfaces:**
- Produces: `buildQueue(l) → Array<{ k: 'clip', n: number } | { k: 'ex', i: number }>` en `js/content.js`, donde `n` indexa `clipsOf(l) = [l.clip, ...(l.more || [])]` (misma definición que en `app.js:100`, que pasa a `content.js` para que la prueba la vea) e `i` indexa `l.ex`. Un video de `more` con `after: n` va justo antes de `{ k: 'ex', i: n }` (o al final si `n ≥ l.ex.length`); los videos sin `after` van tras el clip principal en el orden de `more`.

- [ ] **Step 1: Escribir los tests** en `tests/cola.test.js` cargando `['js/content.js']` con `loadScripts` y leyendo `buildQueue` con `get`:
  - `sin after → todos los videos primero`: `l = { clip: {}, more: [{}], ex: [1, 2] }` → `[{k:'clip',n:0},{k:'clip',n:1},{k:'ex',i:0},{k:'ex',i:1}]`.
  - `after: 2 intercala el video`: `l = { clip: {}, more: [{ after: 2 }], ex: [1, 2, 3, 4] }` → `clip0, ex0, ex1, clip1, ex2, ex3`.
  - `after mayor que los ejercicios → al final`: `more: [{ after: 9 }]`, `ex: [1, 2]` → `clip0, ex0, ex1, clip1`.
  - `sin more → clip y ejercicios`: `l = { clip: {}, ex: [1] }` → `clip0, ex0`.
- [ ] **Step 2: Correr** `node --test tests/cola.test.js` → FAIL (`buildQueue is not defined`).
- [ ] **Step 3: Implementar** en `js/content.js`: mover `clipsOf` desde `app.js` (dejar `app.js` usándolo) y añadir `buildQueue(l)` según Interfaces. En `startLesson`: `const queue = buildQueue(l)`; `prev()` busca el último `{k:'clip'}` en `queue` con índice `< (review >= 0 ? reviewPos : pos)` (guardar `reviewPos`, la posición en la cola del video repasado); `next()` en repaso busca el siguiente clip entre `reviewPos + 1` y `pos - 1`, si no hay vuelve a `step()`; `showClip(n, …)` calcula el texto del botón con la siguiente tarea de la cola (`queue[qi + 1]?.k === 'clip'` → `Parte ${n + 2} →`; si no, `Ejercicios →` / `Al ejercicio →` como hoy) y «Parte k de N» con `clips.length`.
- [ ] **Step 4: Correr** `node --test tests/` → PASS (toda la suite).
- [ ] **Step 5: Navegador** (375 × 812): con `l.more = [{ bunny: 'ea51ca0e-db04-4742-b3e1-c97c0dbac9cf', duration: 440, after: 2 }]` puesto temporalmente en `alg-11` desde la consola: cola `video, ex, ex, video, ex…`; el botón del video 1 dice «Ejercicios →»; deslizar atrás desde el ejercicio 3 muestra el video 2 y luego el video 1; «siguiente» vuelve al ejercicio 3.
- [ ] **Step 6: Commit** `feat: videos intercalados con los ejercicios de una lección`.

### Task 2: Juego `arma-regla` (lección 1.2 · #8)

**Files:** Create `js/games/arma-regla.js`, `tests/arma-regla.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { problems: [{ text, kind: 'directa'|'inversa', chips: [{ label, mag: 0|1, row: 0|1 }] }] }` (cuatro fichas por problema; `mag` = columna de la magnitud, `row` = situación; la incógnita es la ficha `label: 'x'`); `state = { problems: [{ cells: [[number|null, number|null], [number|null, number|null]], arrow: 'directa'|'inversa'|null }] }` (`cells[r][c]` = índice de la ficha puesta en la fila `r`, columna `c`).

- [ ] **Step 1: Tests:** con el problema directo `chips: [{label:'150 km',mag:0,row:0},{label:'5 h',mag:1,row:0},{label:'x',mag:0,row:1},{label:'7 h',mag:1,row:1}]` y el inverso `[{label:'12 obreros',mag:0,row:0},{label:'30 días',mag:1,row:0},{label:'x',mag:0,row:1},{label:'24 días',mag:1,row:1}]`: colocación exacta + flechas correctas → ok; filas intercambiadas (`cells: [[2,3],[0,1]]`) → ok; una ficha en la columna equivocada → no ok; flecha `directa` en el inverso → no ok y `solution` contiene «cruzadas»; `arrow: null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** un problema a la vez (pestañas «1 · 2» arriba); texto del problema (hasta 3 líneas); tabla 2 × 2 con huecos; bandeja de fichas abajo; fichas arrastrables a los huecos (soltar fuera devuelve la ficha; soltar sobre un hueco ocupado intercambia); botón doble «⇉ paralelas · ⤧ cruzadas» que marca `arrow` y dibuja las flechas sobre la tabla; `ready` cuando los dos problemas tienen 4 fichas y flecha; al bloquear, bajo la tabla se escribe la proporción (`150/x = 5/7` o `12/x = 24/30`) en verde o rojo. `aspect` 1.3.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** resolver los dos con toques; soltar una ficha fuera; fallar la flecha.
- [ ] **Step 6: Commit** `feat: juego arma la regla`.

### Task 3: Juego `bascula` (lección 1.2 · #9)

**Files:** Create `js/games/bascula.js`, `tests/bascula.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { knownKg: 3, knownPrice: 12000, askKg: 5, max: 40000, step: 500, tol: 200 }`; `state = { price: number|null }`.

- [ ] **Step 1: Tests:** `20000` → ok; `19900` → ok; `19000` → no ok y `solution` contiene `20\\,000`; `null` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** tarjeta del dato («3 kg → 12.000»), báscula con `askKg` manzanas (plato que baja según los kilos) y etiqueta de precio grande; rueda de precio (arrastrar vertical como en la antigua máquina de fracciones, pasos de `step`, de 0 a `max`) y botones ± 500; separador de miles con `toLocaleString('es-CO')`; `ready` tras el primer cambio; al bloquear la etiqueta se pone verde/roja y muestra el precio correcto. `aspect` 1.1.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** fijar 20.000; probar 0 y 40.000 (texto dentro del lienzo).
- [ ] **Step 6: Commit** `feat: juego la báscula del mercado`.

### Task 4: Juego `la-obra` (lección 1.2 · #10)

**Files:** Create `js/games/la-obra.js`, `tests/la-obra.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { workers: 12, days: 30, askDays: 24, max: 40 }`; `state = { workers: number }`.

- [ ] **Step 1: Tests:** `15` → ok; `16` → no ok y `solution` contiene `15`; `12` (sin cambios) → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** banca con obreros (iconos de `get_worker` estilo p5) a la izquierda y la obra a la derecha; arrastrar un obrero de la banca a la obra suma uno, de la obra a la banca resta (también botones ±); calendario arriba con `Math.round(workers*days/state.workers)` días en grande y una barra que se acorta; texto «12 obreros × 30 días = 360 obreros·día» fijo; `ready` cuando `state.workers !== params.workers`; al bloquear, el calendario marca `askDays` en verde y el número correcto de obreros. `aspect` 1.2.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** llegar a 15 con toques; probar 1 y 40 obreros (calendario dentro del lienzo).
- [ ] **Step 6: Commit** `feat: juego la obra`.

### Task 5: Juego `cadena-razones` (lección 1.2 · #12)

**Files:** Create `js/games/cadena-razones.js`, `tests/cadena-razones.test.js`; Modify `index.html`, `sw.js`.

**Interfaces:**
- Produces: `params = { base: 28, unit: 'días', factors: [{ label: 'hombres', a: 9, b: 7, inverse: true }, { label: 'horas/día', a: 6, b: 8, inverse: true }], answer: 27 }` (cada tarjeta muestra `a/b` o volteada `b/a`; `inverse: true` significa que la fracción correcta es `a/b`, es decir, la magnitud es inversa y la razón va «al revés» del cambio); `state = { flipped: boolean[] }` (`false` = muestra `a/b`).

- [ ] **Step 1: Tests:** `[false, false]` → ok; `[true, false]` → no ok y `solution` contiene `27`; `[true, true]` → no ok.
- [ ] **Step 2:** correr → FAIL.
- [ ] **Step 3: Implementar:** enunciado corto arriba («9 hombres, 28 días, 6 h/día → 7 hombres a 8 h/día: ¿días?»); fila `x = 28 × [9/7] × [6/8]` con tarjetas que giran (animación de volteo) al tocarlas; resultado en vivo `= 27` con un medidor «sube/baja» (flecha verde ↑ si `x > base`, roja ↓ si `x < base`); pista bajo cada tarjeta («menos hombres → más días», «más horas → menos días») que aparece al bloquear; las tarjetas arrancan en la orientación ingenua (`flipped = inverse`, es decir `7/9` y `8/6`), nunca en la respuesta; `ready(true)` desde el inicio (las tarjetas ya forman una respuesta, aunque equivocada). `aspect` 1.15.
- [ ] **Step 4:** correr → PASS.
- [ ] **Step 5: Navegador:** voltear y comprobar bien y mal.
- [ ] **Step 6: Commit** `feat: juego cadena de razones`.

### Task 6: Lecciones 1.2 y 1.3

**Files:** Modify `js/courses/algebra.js` (`alg-12`: cinco `play` nuevos al final de `ex`; `alg-13`: título, clip y `ex`), `sw.js` (`VERSION`), `tests/contenido.test.js` (incluir `alg-13`).

**Interfaces:** Consumes los `params` de Tasks 2–5 y `directa-inversa` existente.

- [ ] **Step 1: Ampliar `tests/contenido.test.js`** a `['alg-11', 'alg-12', 'alg-13']` y correr → PASS (línea base).
- [ ] **Step 2: Añadir a `alg-12.ex`** (después de `cuadrado-media`), en este orden y con `explain` basado en §1.1:
  - `arma-regla` con los dos problemas de la Task 2 (`text`: «Un ciclista recorre 150 km en 5 horas. ¿Cuántos km recorre en 7 horas?» y «12 obreros terminan una obra en 30 días. ¿Cuántos obreros la terminan en 24 días?»).
  - `bascula` con `{ knownKg: 3, knownPrice: 12000, askKg: 5, max: 40000, step: 500, tol: 200 }`.
  - `la-obra` con `{ workers: 12, days: 30, askDays: 24, max: 40 }`.
  - `directa-inversa` con `items`: «Máquinas y horas para un pedido» (inversa), «Grifos iguales y tiempo de llenado» (inversa), «Kilos y precio del mismo producto» (directa), «Velocidad y tiempo del mismo trayecto» (inversa), «Fotocopias y costo» (directa), «Lado y perímetro de un cuadrado» (directa).
  - `cadena-razones` con los `params` de la Task 5.
  - Nota en comentario: el video 2 se enlaza cuando llegue el ID (`more: [{ bunny, duration, after: 7 }]`).
- [ ] **Step 3: `alg-13`:** título «Porcentajes e interés»; quitar la escena `sc(5, '**Regla de tres**…')` y los `num(...)` de obreros/muro y máquinas/piezas.
- [ ] **Step 4:** `sw.js` `VERSION = 'zuka-v15'`; correr `node --test tests/` → PASS.
- [ ] **Step 5: Navegador:** lección 1.2 completa con toques (video 1 → 7 juegos → 5 juegos nuevos; con `more` temporal con `after: 7` para probar video 2, deslizar atrás desde el juego 8 y la repetición de un fallo); lección 1.3 abre y termina; Clips no cambia.
- [ ] **Step 6: Commit** `feat: regla de tres en la lección 1.2 y 1.3 solo con porcentajes`.

### Task 7: Escenas del video «Clase 2 · Parte 2: Regla de tres»

**Files:** Create `video/clase_regla_de_tres/` con `regla_de_tres.py`, `build.py`, `custom_config.yml`, `README.md`, `assets/` y `mb_common.py` (copias de `video/clase_razones_proporciones/`). Modify `.gitignore` (`video/clase_regla_de_tres/videos/`, `dist/`, `build_log.txt`).

**Interfaces:** Consumes `MBScene`, `say`, `hold`, `mark`, `set_header`, `end_section`, `get_table`-style helpers (copiar `get_table`, `get_worker`, `get_axes` de `razones_proporciones.py`).

- [ ] **Step 1: Escribir las escenas** `S00_PortadaParte2` (tag «Clase 2 · Parte 2», título «Regla de tres»), `S01_QueEs`, `S02_Directa`, `S03_Inversa`, `S04_SubeOBaja`, `S05_Compuesta`, `S06_Cierre` con los valores de la spec §3 (150 km/5 h → 210; 12/30 → 15; kilos–precio y velocidad–tiempo; 9·28·6 → 7·8 = 27 con las dos flechas cruzadas y la cadena `28 · 9/7 · 6/8`). Las flechas de la tabla: paralelas (`Arrow` hacia la derecha en cada fila) o cruzadas (dos `Arrow` diagonales en rojo).
- [ ] **Step 2: `build.py`** con `TOPIC = "regla_de_tres"`, `TOPIC_TAG = "Clase 2 · Parte 2"`, una sola parte `("parte2", "Clase 2 · Parte 2 · Regla de tres", [S00…S06])` → `dist/regla_de_tres_parte2.mp4`, `.srt`, `.md`.
- [ ] **Step 3: Borrador** con `-l` (PATH con `../.venv-gl/Scripts`, PYTHONPATH = carpeta) y suma de `videos/meta/*.json` → entre 270 y 330 s; ajustar `say` si no.
- [ ] **Step 4: Hoja de fotogramas** por escena; corregir solapamientos o textos fuera del lienzo.
- [ ] **Step 5: Commit** `feat: escenas del video de regla de tres`.

### Task 8: Render final y entrega del video

**Files:** ninguno nuevo en el repositorio.

- [ ] **Step 1: Render HD** con `python build.py` en segundo plano → `Listo: parte2: X min` con X entre 4.5 y 5.5.
- [ ] **Step 2: Hoja de fotogramas** de `dist/regla_de_tres_parte2.mp4` y revisión visual.
- [ ] **Step 3: Copiar** `.mp4`, `_guion.srt` y `_guion.md` a `C:\Users\User Acer\Downloads\Zuka_Clase2_Regla_de_tres\` y enviarlos al usuario.
- [ ] **Step 4: Commit** solo si las escenas cambiaron: `fix: ajustes del video de regla de tres`.
