# Zuka · guía para sesiones nuevas

App web progresiva (PWA) de matemáticas en español, JavaScript sin frameworks. Lecciones = video corto
+ ejercicios (muchos son minijuegos de p5.js). Repositorio `github.com/CarlosHurtado2024/zuka_app`,
rama `main`; Vercel publica cada push. Contenido basado en el *Manual de Álgebra y Trigonometría* de la
UdeA (Zarrazola, 2024), `C:\Users\User Acer\Documents\LIBRO DE ALGEBRA Y TRIGONOMETRIA.pdf`.

## Cómo trabaja el usuario (respetar siempre)

- Responder en **español**.
- **No hacer preguntas**: decidir con criterio y avanzar. Subir los cambios **automáticamente** a `main`
  (`git push origin main`) sin pedir permiso. Commits con la línea final
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Ejercicios **creativos y originales**: juegos interactivos; evitar opción múltiple y tarjetas
  (verdadero/falso, clasificar). Puede quedar algún cálculo numérico (`num`).
- **Cada ejercicio con pista** (`hint`) que oriente sin dar la respuesta.
- Videos: explicar con **intuición primero y fórmula después**, ejemplos resueltos con detalle,
  **sin ejercicios ni preguntas al espectador**, sin voz ni subtítulos quemados. Los ejemplos del video
  **no se repiten** en los ejercicios.
- Todo lo visual debe verse bien en **tema claro y oscuro** y en celular (300–380 px de ancho).
- Proceso: diseñar → pruebas primero (TDD) → implementar → probar en el navegador → revisión fresca con un
  subagente (modelo opus) → corregir lo crítico/importante con prueba → subir. Diseños en
  `docs/superpowers/specs/`.

## Estructura

| Ruta | Qué hay |
|---|---|
| `index.html`, `css/styles.css` | página única; variables de tema en `:root` y `:root[data-theme="light"]` |
| `js/app.js` | estado `S`, pestañas, ruta de lecciones, `startLesson` (cola de videos y ejercicios, retroalimentación), tema (`applyTheme`) |
| `js/content.js` | ayudantes `sc, mc, num, ord, sld, play`, `clipsOf`, `buildQueue`, `BUNNY_CDN` |
| `js/exercises.js` | tipos de ejercicio (`mc`, `input`, `order`, `slider`, `play`), `renderExercise`, `hintBlock` (botón «Ver pista») |
| `js/courses/algebra.js`, `trig.js`, `calculo.js`, `js/data.js` | cursos: Álgebra (unidad 0 «Conjuntos» desde cero: lecciones `alg-0a`, `alg-0b`, `alg-0c`, sin números ni desigualdades, spec `2026-11-11-conjuntos-desde-cero`, luego «Sistemas numéricos y axiomas», el mundo «Razones, proporciones y porcentajes» (`alg-12`, `alg-12e`, `alg-12f`, `alg-13`, `alg-13c`, `alg-13d`; spec `2026-11-11-razones-desde-cero`) y el resto en el orden del cronograma 2026-2 de Álgebra y Trigonometría; el interés `alg-13b` va tras la función exponencial `alg-71`), Trigonometría (3), Cálculo Diferencial (5, cronograma 2026-2 de Cálculo; sus unidades 1–2 son lecciones `alg-*` movidas desde Álgebra, ids sin cambiar para no perder progreso); Física, etc. en `data.js`. Spec `2026-11-07-cronograma-algebra-calculo-design.md` |
| `js/games/kit.js` | `GAMES`, `PALETTES`/`PALETTE`/`setGameTheme`, `mountSketch`, `shuffledOrder`, `lineMap`, `nearest` |
| `js/games/*.js` | un archivo por juego (≈59) |
| `js/player.js` | reproductor de clips (Bunny HLS o escenas animadas) |
| `js/curiosidades.js`, `media/clips/` | pestaña Clips: videos cortos de datos curiosos (`CURIOS`, `CURIO_TOPICS`, `curioFeed`, `findCurio`); spec `2026-11-12-clips-curiosidades`, pruebas `tests/curiosidades.test.js` |
| `js/tutorias.js` | pestaña Tutorías: separar una asesoría virtual con un tutor (`TUTORIAS`, `TUTORS`, `tutorDays`, `bookTutoria`, `renderTutorias`, `openBooking`); reservas en `S.tutorias`, sin servidor. Hoy `TUTORIAS.demo` es `true`: **los tutores son de ejemplo**; para tutores reales poner `TUTORS`, su `link` de videollamada, `TUTORIAS.whatsapp` y `demo: false`. Spec `2026-11-12-tutorias`, pruebas `tests/tutorias.test.js` |
| `sw.js` | service worker: `VERSION` y lista `SHELL` |
| `tests/` | `node --test tests/` (≈352 pruebas); `tests/load.js` carga scripts en un `vm` |
| `video/` | videos con manimgl (ver abajo) |

## Lecciones (datos)

```js
{
  id: 'alg-11', title: '…',
  clip: { bunny: '<id de Bunny>', duration: 462, scenes: [sc(5, 'texto', { steps: [...] })] },
  more: [{ after: 7, bunny: '<id parte 2>', duration: 379, scenes: [] }],   // parte 2 justo antes del ejercicio 7
  ex: [
    mc(q, opciones, índiceCorrecto, explicación, { hint }),
    num(q, respuesta, explicación, { tol, prefix, suffix, answerText, hint }),
    play('nombre-juego', enunciado, params, explicación, { hint }),
  ],
}
```

- Textos con KaTeX: dentro de cadenas JS la barra va doble (`'$\\tfrac{\\pi}{2}$'`); el seno se escribe
  `\\operatorname{sen}`. Decimales con punto.
- `scenes` son el respaldo si el video no carga. Al recibir un ID de Bunny: poner `bunny` y la
  `duration` **que reporta Bunny** (medir con `video.duration` en el navegador; puede diferir de la local).
- Al cambiar contenido o juegos: subir `VERSION` en `sw.js` (`zuka-vNN`).

## Juegos (p5.js)

Contrato: `GAMES['nombre'] = { grade(state, params) → { ok, solution }, create(host, params, api) →
{ loaded, getState, lock, destroy } }`. `grade` es pura (se prueba en Node). En `create`:

- `const C = api.palette` y **leer los colores al dibujar** (`C.bg, C.card, C.line, C.ink, C.mute, C.brand,
  C.ok, C.bad`, familias `C.N, C.Z, C.Q, C.I, C.R`). Así se repintan solos al cambiar de tema. Nada de
  colores fijos para texto o fondo.
- `mountSketch(host, (p, size) => {...}, aspecto)`; solo escribir `mousePressed/Dragged/Released`
  (los toques se enlazan solos). `p.onResize` para reacomodar.
- **Celular angosto** (spec `2026-11-12-juegos-algebra-u1-u3-calidad`, pruebas `tests/juegos-celular.test.js`): el lienzo
  conserva el alto de diseño (`heightFor`: `max(ancho, 328) × aspecto`) y todo `p.text` pasa por `safeText` (encoge o
  corre lo que se sale; el texto en caja se dibuja renglón a renglón y nunca se corta). Sobre el lienzo se puede
  desplazar la lección (`touch-action: pan-y`): **`mousePressed` debe devolver `false` siempre que agarre o toque
  algo**; si no, ese toque se toma como desplazamiento y el juego no recibe el arrastre ni el final.
- `api.ready(true)` cuando se puede comprobar; `lock()` congela y muestra la solución en verde.
- Patrón común: pestañas de rondas (44×30 px arriba), texto que se encoge con `textWidth` para caber,
  botones − / + cuando un arrastre necesita precisión.
- Registrar cada juego en `index.html` (`<script defer src="js/games/x.js">`) y en `SHELL` de `sw.js`
  (lo exige `tests/registro.test.js`).
- Pruebas: `const { loadGame } = require('./load'); loadGame('js/games/x.js')['x']`. Los arreglos que
  vienen del `vm` no son `deepEqual` con los de la prueba: comparar con `.join()` o `JSON.stringify`.
- Pruebas de contenido por unidad (`tests/contenido-*.test.js`): índices válidos, pistas presentes, que la
  pista no regale la respuesta y que cada ronda tenga solución alcanzable con los controles.

Juegos recientes: Álgebra unidad 0 (conjuntos) `arma-notacion`, `cumple-notacion`, `tacha-repetidos`, `arma-conjunto`,
`atrapa-elementos` (con `given`/`expr` sirve para escribir el resultado de una operación), `mueve-circulos`, `fabrica-subconjuntos`,
`reparte-venn`, `pinta-venn` (operación como `f(a, b, c)` en params; zonas por máscara de bits), `encuesta-venn`;
Álgebra unidad 1 (spec `2026-11-09-algebra-unidad-1-videos-y-juegos`, reemplazan las
tarjetas) `fuga-de-familia` (fichas `r + k√2`), `candado-fraccion`, `compas-raiz`, `lupa-densidad`,
`duplica-magnitud`, `engranajes`, `estira-barra`, `tragamonedas`, `cadena-cambios`, `crece-planta`,
`alcancias-gemelas`; Álgebra 1.1 `recta-espejo` (opuestos en la recta de enteros), `pasaporte-numeros`, `ascensor`, `pon-la-rayita`, `acorrala-raiz`;
Álgebra 1.2 `inversos-gemelos` (opuesto y recíproco), `corta-rectangulo` (distributiva), `cancela-balanza` (cancelativa), `tren-ordenado` (orden), `atajo-axiomas`, `arma-producto`, `dobla-la-recta`; Álgebra razones `bolsa-razon` (parte a parte y parte al todo), `estira-foto` (escalar sin deformar), `sombra-arbol` (cuarto proporcional con sombras), `pinta-personas` (porcentaje de un grupo), `porcentaje-cambio` (cambio sobre el valor de antes); Álgebra progresiones `pisa-huellas` (a₁ y d con dos términos), `dos-escaleras` (suma de Gauss con bloques), `rebota-pelota` (razón geométrica); Trigonometría U1 `rueda-angulo`,
`corta-pizza`, `arma-triangulo`, `mide-altura`, `atrapa-punto`, `noria`, `sintoniza-onda`; Trigonometría U2
`canon-inverso`, `tanque-pitagorico`, `detector-identidades` (funciones `f`, `g` en params), `encadena-angulos`,
`corredores-dobles`, `pesca-raices`, `compas-ambiguo`, `brazo-robot`; Trigonometría U3 `mapa-tesoro`,
`telarana-polar`, `espiral-potencias`, `flor-de-raices`; Álgebra
`completa-cuadrado`, `mueve-parabola`, `balanza-exponencial` (ecuaciones con la incógnita en x: sirve para
cualquier `L(x) = R(x)`). Reutilizables:
`une-parejas`, `ordena-terminos` (`sep`), `clasifica-cartas`, `ubica-en-recta`, `cajas-numericas`…

## Evaluaciones de fin de unidad

- `unit.exam = { id, title, minutes, items: [{ lesson, review, ex }] }` (Álgebra U0 Conjuntos y U1–U3, al final de
  `js/courses/algebra.js`; spec `2026-11-12-evaluaciones-algebra-u1-u3`). Nodo de trofeo al final del camino del
  mundo (`renderWorld`); no cuenta como lección. Motor en `js/exam.js` (`startExam`, `openExamSheet`, `examReport`):
  cronómetro, sin decir si acierta hasta el final, saltar / dejar en blanco, pista = media pregunta, informe con
  «Lo que dominas», «Para repasar» (nota `review` + botón a la lección) y detalle; mejor resultado en `S.exams`.
- Juegos propios de las evaluaciones (no usarlos en lecciones; cada uno tiene `solve(params)`): `laberinto-valor`,
  `domino-equivalencias`, `piramide-numerica`, `detective-pasos`. Pruebas: `tests/evaluaciones.test.js`.

## Interfaz de la lección

- Al fallar: «Incorrecto» + «La respuesta correcta es:»; la lección deja espacio abajo para ver el juego.
- **Modo revisión** (`S.unlockAll`, activo por defecto en `DEFAULTS` de `js/app.js`): todas las lecciones
  abiertas y sin perder vidas; interruptor en Perfil → Ajustes. Apagarlo (o poner `false`) antes de abrir
  la app a estudiantes.
- **Recorrido guiado de bienvenida** (`js/tour.js`, spec `2026-11-12-recorrido-guiado`, pruebas `tests/recorrido.test.js`):
  sale solo la primera vez (`S.tourDone` falso y sin progreso) y se repite en Perfil → Ajustes. Pasos en `TOUR_STEPS`
  (hueco iluminado sobre el elemento real + tarjeta); si cambia la interfaz que describen, actualizar sus textos y selectores.
- **Pestaña Clips = curiosidades**, nunca videos de lecciones. Cada clip es `{ id: 'cur-…', topic, title, fact, clip }`
  en `js/curiosidades.js`; `clip.video` apunta a un mp4 de `media/clips/` (720×1280, unos 5 MB; el service worker no
  lo guarda) o `clip.bunny` a su id. Riel: «Me gusta» y «Guardar»; sonido y velocidad en esa misma columna; el pie
  (tema, título, dato) solo se ve en pausa. Si el video falla, el feed cambia a `clip.scenes`. En el video, lo que se
  lee debe quedar entre el 14 % y el 86 % del ancho y por encima del 85 % del alto.
- Durante una lección el menú inferior se esconde (`body.in-lesson`); en la pestaña Clips se esconde
  mientras el video se reproduce y vuelve al pausar.

## Videos (manimgl, 9:16, 1080×1920)

- Motor: **manimgl 1.7.2** (3b1b/manim) en `video/.venv-gl`. Cada clase es una carpeta
  `video/clase_*` con: escenas `<tema>.py`, `mb_common.py` (plantilla), `build.py`, `custom_config.yml`,
  `assets/` (fondo y mascota).
- Plantillas: álgebra usa `mb_common.py` (fondo morado `fondo_algebra.png`); trigonometría usa
  `video/trig_common.py` (generado por `make_trig_common.py`: fondo azul `fondo_trig.png`, colores
  `C_SEN` rosa, `C_COS` cian, `C_TAN` lima, `C_ANG` amarillo, fondo y encabezado fijos y **zoom de
  cámara** `self.zoom_to(obj, scale)` / `self.zoom_reset()` sobre `self.frame`). Portada y cierre
  compartidos en `trig_scenes_common.py` (`TrigPortada`, `TrigCierre`).
- Nueva clase de trigonometría: `python mk_trig_class.py clase_trig_tN tema "Título" TN S00_Portada S01_… S0k_Cierre`.
- Fondo de otro curso: `python make_background.py "#color" salida.png [intensidad brillo]`
  (trig: `"#22d3ee" … 0.36 0.24`).
- Escena base `MBScene`: `mark(título)`, `say(texto)` (reserva el tiempo de lectura y va al guion),
  `hold()`, `set_header(tex, nombre, color, relleno)`, `clear_scene()`, `end_section()`. Ayudas `T`, `TB`
  (texto) y `M` (fórmula).
- Renderizar (Git Bash, desde la carpeta de la clase):
  `export PATH="../.venv-gl/Scripts:$PATH"`; borrador `python build.py --quality=-l`; HD `python build.py`;
  una escena suelta: `export PYTHONPATH="$(pwd -W)"; manimgl tema.py S02_X -w -l`.
  Salen `dist/<tema>_<parte>.mp4`, `_guion.md` y `_guion.srt`. Correrlos en segundo plano y de uno en uno.
- Revisar con hoja de contacto: `ffmpeg -i dist/x.mp4 -vf "fps=1/4,scale=150:-1,tile=8x5" -frames:v 1 -update 1 hoja.png`.
- Entrega: copiar `dist/` a `C:\Users\User Acer\Downloads\Zuka_…` y enviar los mp4. **El usuario los sube a
  Bunny** y pasa los ID; nunca hay claves de Bunny en la sesión.
- Trampas de manimgl: no existe `BraceBetweenPoints` (usar `Brace(Line(a, b), DOWN)`);
  `SurroundingRectangle` no acepta `corner_radius`; en `Tex` solo ASCII (`\'u` en vez de «ú», `\times`
  en vez de «×»); `Tex` dentro de `always_redraw` compila en cada cuadro (lento): redondear el valor;
  lo que deba quedarse quieto durante un zoom va con `.fix_in_frame()`; dibujar con la misma escala en x
  y en y si se muestra un ángulo; recortar gráficas (tangente) al rango de los ejes.

## Probar en el navegador

- Servidor de vista previa «zuka» (`python -m http.server 5173`), pestaña del panel.
- Tras cambiar archivos: `fetch(archivo, {cache:'reload'})`, desregistrar service workers, borrar
  `caches` y navegar a una URL nueva (`?v=NN`).
- Abrir un ejercicio suelto: `startLesson(curso, { ...lección, clip: { scenes: lección.clip.scenes }, ex: [lección.ex[i]], more: [] })`
  y tocar `.clip-skip`; simular toques con `TouchEvent` sobre `.play canvas`.
- Probar a 340–375 px y en los dos temas (`S.theme = 'light'; applyTheme()`); volver a escritorio al terminar.

## Trampas del entorno (Windows)

- Los *heredoc* de Bash a veces comen las barras invertidas: escribir JS/Python con barras usando las
  herramientas de edición o archivos de script, no `cat <<EOF` ni `python - <<EOF`.
- Python con acentos en la salida: `python -X utf8`. `ffmpeg` está en `video/.venv-gl/Scripts`.
- Cambiar de rama mientras se renderiza puede fallar por archivos bloqueados.

## Herramientas de contenido (instaladas en el equipo, fuera del repositorio)

Sirven para este y otros proyectos. Los videos de las lecciones siguen saliendo con manimgl; esto es para
material extra (promos, cortos, efectos, 3D, audio).

- Skills globales en `~/.claude/skills/`: `video-shotcraft` (promos con Remotion a partir de páginas reales),
  `lemo-opuscar` (cortos hechos en código en 99 estilos; biblioteca en `~/lemo-opuscar`, paquetes base ya
  instalados; voz y música con `sh ~/.claude/skills/lemo-opuscar/scripts/setup.sh deps voice music`) y `pixelfx`
  (244 efectos de pixel art; copia en `~/pixelfx`, `node tools/render.mjs fire/torch` deja la hoja en `records/`).
  Los tres necesitan `ffmpeg` y `ffprobe` en el PATH: están instalados con winget (`Gyan.FFmpeg`; las sesiones nuevas
  los ven solos; en una vieja, anteponer `%LOCALAPPDATA%/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin`).
- MCP de Blender: servidor `blender` (`uvx mcp-for-blender`) en `~/.claude.json`. Blender 5.3 y su complemento
  (`blender_mcp`) ya están instalados y activados. Para usarlo: abrir Blender y revisar el panel lateral
  (tecla `N` → «MCP for Blender»; «Start MCP Server» si no está corriendo).
- Audio: `video/.venv-audio` (Python 3.12 de uv) con `librosa` y `soundfile`, para sacar tempo y golpes de una
  pista y sincronizar animaciones. No instalar librosa en `.venv-gl`: su Python de miniconda no tiene `lzma`.
- 3D: `C:\Users\User Acer\Documents\estudio_3d` (Vite + React) con `three`, `@react-three/fiber`, `drei`,
  `@react-three/rapier` (física) y `@react-three/postprocessing`; `npm run dev` (puerto 5183, vista previa
  «estudio-3d»). La app Zuka no usa React ni three: no añadirlos al PWA.

## Cortos de curiosidades (lemo-opuscar)

- Un corto por carpeta `video/<nombre>/` (el primero: `video/origen-numeros`, estilo pizarra con tiza, 1080×1920, 30 fps,
  sin voz): `TREATMENT.md`, `FACTS.md` (cada dato con su respaldo), `CREDITS`, `js/film.js` (toda la película como datos:
  columnas de 900 de ancho en una pizarra de 6400×1700, cámara por claves, textos con `lat()`), `audio.py` y `build.sh`.
- Construir: `sh video/origen-numeros/build.sh` (unos 6 min; baja letra y grabaciones de tiza la primera vez). Deja
  `origen-numeros.mp4` y `poster.jpg`; `out/readcheck.txt` comprueba que cada texto alcanza a leerse.
- Para la app: `ffmpeg -i origen-numeros.mp4 -vf scale=720:1280 -c:v libx264 -preset slow -crf 26 -movflags +faststart
  -c:a aac -b:a 112k media/clips/<nombre>.mp4` y una entrada en `CURIOS`. El HD se entrega en Descargas para Bunny.
- Revisar con hoja de contacto (`fps=1/3,scale=200:-1,tile=10x3`): que no se asome texto de la columna vecina.
- `video/origen-numeros-zoom` es la versión que usa la app: estilo «Scale Zoom Explainer» (SVG plano, 24 fps, 80 s), un
  solo zoom continuo por cinco niveles (`DIVE` en `film.js`: punto de afuera, radio del anillo y punto de adentro),
  guía con lente (`orbi.js`), cinta «hace … años» y etiquetas con placa opaca. `NARR` en `film.js` es la narración;
  `mix.py` la escribe como `origen-numeros-zoom.srt`. El video no lleva voz: la mezcla deja sitio para ponerla.
- `video/abejas` («Matemáticas de abeja», tema Ciencia): estilo «Tablet Sketch Explainer» (lienzo crema, lápiz y luego
  color, 24 fps, 75.5 s). Una página alta de 1200 × 5320 unidades que se recorre de arriba abajo; `film.js` la dibuja con
  `PEN` (lápiz), `BLOB` (bloque de color corrido), `TXT` (letra Caveat trazo a trazo) y `arrow`; `CAM` son los gestos de
  dos dedos; `NARR` es la narración (`mix.py` escribe `abejas.srt`). `engine.js`/`engine2.js` son el motor de la demo en
  vertical. Renderiza con 2 trabajadores (cada página usa cerca de 1 GB). Datos y lo que quedó fuera: `FACTS.md`.

## Pendiente (a la fecha)

Videos hechos y entregados que esperan su ID de Bunny (`clip.bunny` + `duration`):
- Clips: `cur-origen-numeros` ya está en Bunny (versión zoom, 80 s). `cur-abejas` también (75.5 s). Un clip nuevo puede vivir como mp4 en `media/clips/`
  mientras llega su ID; al recibirlo, cambiar `clip.video` por `clip.bunny`, poner la `duration` de Bunny y borrar el mp4.
  Bunny solo responde con `Referer` de la app o de localhost. Ideas del mismo texto que no cupieron: Grecia y
  la demostración, al-Juarismi y Fibonacci, quipus y yupana, binario y hexadecimal.
- Álgebra unidad 0: los tres videos (alg-0a, alg-0b, alg-0c) ya están en Bunny. Los videos viejos C0 y EC0
  (`clase_alg_u0_conjuntos`, `clase_alg_u0_ej_conjuntos`) quedaron reemplazados.
- Álgebra unidad 1, **un video por lección** (nuevos, fondo `fondo_algebra_vivo.png`, zoom y 3D; carpetas
  `video/clase_alg_u1_*`, plantilla `video/mk_alg_class.py` + `video/alg_u1_fx.py`; borrador escena por escena con
  `bash video/render_each.sh carpeta archivo.py Escenas…`): A5 `alg-13b` (A3 y A4 quedaron reemplazados por R1–R3 y C1–C3) (A3 quedó reemplazado por R1–R3). Mientras llegan los ID, las lecciones siguen con sus videos viejos; al recibirlos, poner
  `clip.bunny` + `duration` y **quitar `more`** (y ajustar `tests/pistas.test.js` y `tests/contenido.test.js`,
  que hoy comprueban los ID viejos y la parte 2).
- Álgebra, **razones desde cero** (spec `2026-11-11-razones-desde-cero`, sin zoom ni 3D, mundo `razones`): la antigua `alg-12`
  se partió en `alg-12` (R1 razones, `video/clase_alg_u2_r1_razones`), `alg-12e` (R2 proporciones y magnitudes,
  `…_r2_proporciones`) y `alg-12f` (R3 regla de tres, `…_r3_regla_tres`). Hoy solo tienen escenas; al recibir cada ID
  poner `clip.bunny` + `duration`. Reemplazan a la Clase 2, la regla de tres vieja, A3 y E3. Los videos se revisan
  solos al renderizar: `alg_u1_fx.py` anota en `videos/layout_warnings.txt` textos que se salen, se enciman, quedan
  cortados por un recuadro o tapados por una figura o una línea (corregir hasta que no quede ninguno).
- Álgebra, **porcentajes desde cero** (spec `2026-11-11-porcentajes-desde-cero`, sin zoom ni 3D, mundo `razones`): la
  antigua `alg-13` se partió en `alg-13` (C1 qué son, `video/clase_alg_u2_c1_porcentajes`), `alg-13c` (C2 aumentos y
  descuentos, `…_c2_aumentos`) y `alg-13d` (C3 cambios sucesivos, `…_c3_sucesivos`). Hoy solo tienen escenas; al recibir
  cada ID poner `clip.bunny` + `duration`. Reemplazan a los dos videos viejos de porcentajes.
- Álgebra, **progresiones desde cero** (spec `2026-11-11-progresiones-desde-cero`, sin zoom ni 3D): la antigua `alg-14` se partió
  en `alg-14` (P1 sucesiones y aritméticas, `video/clase_alg_u3_p1_aritmeticas`), `alg-14b` (P2 suma aritmética,
  `…_p2_suma_aritmetica`), `alg-14c` (P3 geométricas, `…_p3_geometricas`, ya en Bunny) y `alg-14d` (P4 suma geométrica e infinita,
  `…_p4_suma_geometrica`). Hoy solo tienen escenas; al recibir cada ID poner `clip.bunny` + `duration`. Reemplazan a la
  Clase 5 (`video/clase_progresiones`).
- Álgebra unidad 1, **ejemplos resueltos** E4–E5 (`video/clase_alg_u1_ej_*`, escena `ExScene`): un video por
  lección para justo después del de conceptos; al recibir su ID va en `more: [{ bunny, duration }]` **sin `after`**.
- Álgebra unidad 1, **sistemas numéricos desde cero** (spec `2026-11-11-sistemas-numericos-desde-cero`, sin zoom ni
  3D): la antigua `alg-11` se partió en `alg-11` (N1 naturales y enteros, `video/clase_alg_u1_n1_naturales`),
  `alg-11b` (N2 racionales, `…_n2_racionales`) y `alg-11c` (N3 irracionales y reales, `…_n3_reales`). Los tres
  ya están en Bunny. Reemplazan a A1 y E1 (`alg-11`).
- Álgebra unidad 1, **axiomas desde cero** (spec `2026-11-11-axiomas-desde-cero`, sin zoom ni 3D): la antigua `alg-12b`
  se partió en `alg-12b` (F1 campo, `video/clase_alg_u1_f1_campo`), `alg-12c` (F2 consecuencias: resta, división,
  signos, cancelativa, `…_f2_consecuencias`) y `alg-12d` (F3 orden y valor absoluto, `…_f3_orden`). Los tres ya están
  en Bunny. Reemplazan al video viejo de la Clase 7 y a A2/E2.
- Álgebra: (la Clase 4 de interés quedó reemplazada por A5), Clase 6 sumatoria
  (`alg-15`), Clase 8 potencias (`alg-21a`), Clase 9 leyes de exponentes (`alg-21b`, parte 2 en `more`
  con `after: 6`), Clase 10 raíces (`alg-22a`), Clase 11 radicales (`alg-22b`), Clase 12 polinomio cuadrático
  (`alg-4a`, `video/clase_cuadratico`), Clase 13 ecuaciones exp./log. (`alg-73`, `video/clase_ecuaciones_exp_log`).
- Trigonometría unidad 1: T1–T9 (`trig-41a`, `trig-41b`, `trig-1`, `trig-2`, `trig-42c`, `trig-3`,
  `trig-43b`, `trig-44a`, `trig-44b`).
- Trigonometría unidad 2: T10–T17 (`trig-45`, `trig-4`, `trig-47b`, `trig-48a`, `trig-48b`, `trig-49`,
  `trig-46a`, `trig-46b`). En estas clases `zoom_to` (en su `mb_common.py`) no deja que el objetivo se salga
  por los lados y desvanece el encabezado mientras dura el zoom.
- Trigonometría unidad 3: T18 (`trig-151`), T19 (`trig-152`) y T20 (raíces, `trig-152` en `more` con
  `after: 3`, hoy solo con escenas).
- Cálculo: faltan lecciones de su cronograma (ver spec `2026-11-07-cronograma-algebra-calculo`).
- El resto de Álgebra aún tiene ejercicios de opción múltiple y
  sin pistas.
