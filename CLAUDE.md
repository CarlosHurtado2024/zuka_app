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
- **Entender, no mecanizar:** los juegos no deben exigir cálculos rápidos ni reflejos. Nada de responder antes de que
  algo llegue o se acabe; si algo avanza solo, se detiene y espera. El juego dibuja la idea del video (barras, áreas,
  vueltas) y el estudiante compara, construye o ajusta; las cuentas las hace y las muestra el juego. Spec
  `2026-11-14-juegos-conceptuales-valle`.
- Videos: explicar con **intuición primero y fórmula después**, ejemplos resueltos con detalle,
  **sin ejercicios ni preguntas al espectador**, sin voz ni subtítulos quemados. Los ejemplos del video
  **no se repiten** en los ejercicios. Narración de videos y clips según `docs/storytelling-videos.md` (personaje con
  un deseo y un problema, frase que atrape, una sorpresa anunciada, cerrar el círculo; sacada de los libros de storytelling
  que pasó el usuario).
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
| `js/tutorias.js` | pestaña Tutorías: el estudiante separa una asesoría virtual eligiendo materia, temas (lecciones de esa materia), día y hora; **sin nombres de tutores** (`TUTORIAS` con el horario `hours`, `tutoriaDays`, `bookTutoria`, `renderTutorias`, `openBooking`). Reservas en `S.tutorias`, sin servidor: solo quedan en el celular hasta poner `TUTORIAS.whatsapp`. Spec `2026-11-12-tutorias`, pruebas `tests/tutorias.test.js` |
| `docs/resumenes/`, `media/resumenes/` | resúmenes en PDF por mundo: fuente HTML A4 → `sh docs/resumenes/build.sh [nombre]` (Chrome sin ventana); la unidad lleva `summary` y `renderWorld` muestra «Resumen del mundo». Hecho: Pradera de Venn. Spec `2026-11-13-resumenes-pdf`, pruebas `tests/resumenes.test.js` |
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
- **Estilo de los videos** (spec `2026-11-13-juegos-estilo-video`, pruebas `tests/estilo-video.test.js`): el kit pone a
  todos los juegos la paleta de los videos zoom (azul noche / papel crema), fondo con estrellas al limpiar con
  `p.background(C.bg)`, letra Jost, pestañas como fichas, onda al tocar y confeti al acertar (`playFx`). Rellenos
  vivos: `C.sun, C.coral, C.mint, C.sky`; texto encima con `inkOn(color)`. Animar con `fxTween(obj, props, opts)`
  (anime.js 3.2.2 en `js/vendor/anime.min.js`; sin anime o con «reducir movimiento» pone el valor final).
  Piezas de dibujo de los videos, al final de `kit.js`: `drawTile` (ficha con relieve; negativos coral, cero sol),
  `drawSlot`, `drawKicker` (rótulo con barrita), `drawPill`, `drawDot`, `drawNumLine`, `shade`. Cambian alineación,
  estilo y relleno: volver a fijarlos después. **Álgebra U0 (Conjuntos), U1, Razones y porcentajes, y Progresiones y sumatoria ya están rediseñados con ellas**; faltan las demás unidades.
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
- **Juegos dinámicos** (de acción; spec `2026-11-13-juegos-dinamicos-pradera`, pruebas `tests/juegos-dinamicos-conjuntos.test.js`):
  cada lección lleva al menos uno, como último ejercicio, ligado a su video y **con mecánica distinta a los demás**
  (no repetir). Hechos: Pradera de Venn → `lluvia-elementos` (arrastrar una canasta: ∈ / ∉), `revienta-globos` (tocar a
  tiempo globos con conjuntos: subconjunto, iguales, disjuntos, unitario) y `luciernagas-venn` (tocar luciérnagas cuando
  están en la zona de la operación); Valle de los Números (spec `2026-11-13-juegos-dinamicos-valle`, pruebas
  `tests/juegos-dinamicos-valle.test.js`) → `buzo-enteros` (subir y bajar a la altura del resultado), `carrera-fracciones`
  (la fila de puertas espera; tocar una puerta la mide en una regla junto al número pedido y tocarla otra vez hace pasar) y
  `frena-aguja` (conserva el nombre, pero ya no hay aguja: se arrastra un punto y crece un cuadrado de área pedida, o rueda
  una rueda de diámetro 1 para π; ambos rehechos sin prisa en la spec `2026-11-14-juegos-conceptuales-valle`), `dispara-inverso` (apuntar a burbujas que pasan),
  `salta-signos` (saltar según el signo) y `serpiente-orden` (comer de menor a mayor). Razones, proporciones y porcentajes (spec `2026-11-13-juegos-dinamicos-razones`,
  pruebas `tests/juegos-dinamicos-razones.test.js`) → `sirve-la-razon` (mantener presionado para servir y soltar),
  `corta-proporciones` (cortar fichas al vuelo con el dedo), `resortera-tres` (estirar y soltar), `caja-veloz` (teclado
  numérico contra la paciencia del cliente), `vuela-precios` (volar a toques por el aro correcto) y `rompe-cambios`
  (paleta y pelota; la pelota sale al soltar el dedo). Progresiones y sumatoria (spec
  `2026-11-13-juegos-dinamicos-progresiones`, pruebas `tests/juegos-dinamicos-progresiones.test.js`) → `traza-progresion`
  (trazar un camino por los términos), `encesta-suma` (lanzar un balón deslizando el dedo),
  `dobla-fichas` (tablero tipo 2048 con razón 2; una sola vida), `rana-zenon` (saltos que se achican y banderas) y `maquina-sigma` (arrastrar de una bandeja el término de cada k); desde la spec
  `2026-11-15-escalera-de-sigma` ninguno apura (sin mecha, reloj, garza ni cinta que corre; pruebas `tests/escalera-de-sigma.test.js`). Los del Valle, los de Razones y los de Progresiones usan la base común
  `makeArcade` del kit (fases, vidas, cola de preguntas, aviso, parar al terminar). Reglas: «Toca para empezar», tres vidas (`drawHearts`), sin vidas la ronda se
  reintenta (no se pierde el ejercicio), `api.ready(true)` al terminar todas las rondas, movimiento con `p.deltaTime`
  (tope 50 ms), cartel con `drawBanner`, y `peek()` en lo que devuelve `create` para probarlos con un robot en el
  navegador. Si el panel del navegador está oculto todo corre en cámara lenta: los tiempos del robot no sirven.
  Torres de Potencias (spec `2026-11-15-torres-de-potencias`, pruebas `tests/torres-de-potencias.test.js`; ya sin reloj,
  cartel «Sin prisa») → `torre-pisos` (el piso n es aⁿ; se cuentan pisos con un ascensor y se entregan paquetes), `escala-leyes`
  (tarjetas «· xᵏ», «÷ xᵏ», «( )ᵏ» que hay que usar en el orden correcto), `siembra-raices` (elegir enteros y verlos crecer
  hasta xⁿ; ecuación frente a raíz) y `muro-radicales` (ladrillos de largo √n a escala, con costuras). Faltan los demás mundos.
- **Juegos por rondas con `roundsGame(def)`** (al final de `kit.js`; spec `2026-11-15-torres-de-potencias`): armazón con
  pestañas, enunciado, pie y estado `{ rounds: [...] }`; el juego solo da `init, ok, solution, prompt, draw, press` (y
  `answered`, `foot`, `layout`, `peek` si hacen falta). Con `sup(n)`, `drawStepper` y `stepHit`. Hechos con él, todos del
  mundo Torres de Potencias: `arbol-potencia`, `pares-negativos`, `cuenta-factores`, `cambia-de-piso`, `salta-la-coma`,
  `reparte-factores`, `parte-baldosa`, `tabla-conjugado`. Ese mundo ya no tiene opción múltiple ni tarjetas. Escalera de Sigma
  (spec `2026-11-15-escalera-de-sigma`): `cuenta-saltos` (saltos y no términos; modos `value` y `count`, `arit` y `geo`),
  `resta-corrida` (rS − S: se tachan las parejas iguales) y `parte-sigma` (Σ(ck + d) = c·Σk + d·n); tampoco le quedan tarjetas. El robot
  `tests/robot-torres.js` (se carga en la página con `fetch` + `eval`) resuelve con `peek()` los juegos de los dos mundos.
- **Jefe final de un mundo** (spec `2026-11-14-jefe-final-pradera`, pruebas `tests/jefe-venn.test.js`): `unit.boss = { id, title,
  clip: { scenes }, ex: [play(…)] }`, definido junto a las evaluaciones al final de `js/courses/algebra.js`. Es un nodo propio
  del camino (`.node.boss`, rojo con corona, entre la última lección y la evaluación; `bossUnlocked`, `openBossSheet` en
  `js/app.js`) y se lanza con `startLesson(c, unit.boss)`; **no es una lección** (no entra en `unit.lessons` ni en el avance).
  Hecho: Pradera de Venn → `jefe-venn` («El Guardián de la Pradera», `jefe-alg-0`): batalla por turnos sin reloj en tres
  fases, una por lección (tocar los elementos del conjunto pedido, arrastrar elementos entre zonas hasta que A y B cumplan
  una relación, operaciones; el vacío se ataca sin elegir nada). Faltan los demás mundos.
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
  Bunny solo responde con `Referer` de la app o de localhost. **`cur-arroz`** («El arroz del rey», estilo Data Physicalization, 72.5 s, `video/arroz-ajedrez`,
  `sh video/arroz-ajedrez/build.sh`, unos 25 min; escena 3D con three.js; `render.mjs` guarda cuadro a cuadro y reintenta si el GPU
  se cuelga, porque `video.mjs` aborta): ya está en Bunny (`f68c6ba7-…`, 72.5 s); el HD está en `Downloads/Zuka_Arroz_rey`.
  Granos reales en las casillas 1–10 y luego 1 placa = un año de cosecha mundial (443 + 443); datos en `FACTS.md`, pruebas `tests/arroz-ajedrez.test.js`. **`cur-razon-deco`** («La razón que no cambia», estilo Art Deco,
  90 s, `video/razon-deco`, `sh video/razon-deco/build.sh`, unos 10 min): ya está en Bunny (`688591e8-…`, 90 s); el HD está en
  `Downloads/Zuka_Razon_deco`. Una barra partida en razón áurea (el único elemento en coral) va de
  Euclides a Pacioli, el SI, el Modulor y la regla de tres de la gentamicina (80 mg / 2 mL → 20 mg = 0.5 mL); motor deco de
  lemo-opuscar copiado en `engine/` (MIT); rótulos = `CARDS` en `film.js` (también el `.srt`). Ideas del mismo texto que no cupieron: Grecia y
  la demostración, al-Juarismi y Fibonacci, quipus y yupana, binario y hexadecimal.
- Álgebra unidad 0: los tres videos (alg-0a, alg-0b, alg-0c) ya están en Bunny. **Nuevo video de `alg-0a` en estilo Scale Zoom Explainer** (lemo-opuscar; `video/conjunto-zoom`, 116.5 s, sin voz, `sh video/conjunto-zoom/build.sh`, 1 trabajador si otro render corre a la vez): entregado en `Downloads/Zuka_Conjuntos_zoom`, espera su ID de Bunny. Al recibirlo, cambiar `clip.bunny` + `duration` de `alg-0a`; sus escenas de respaldo ya usan los mismos ejemplos (semáforo, azul, vocales, PAPAYA; el conjunto de PAPAYA se llama L y su cardinal es n(L) = 3). **Videos zoom de `alg-0b` y `alg-0c`** (`video/conjunto-zoom-2` y `-3`, 118 y 120 s, mismo estilo; el motor común es `zoomkit.js`, copiado en cada carpeta; `mix.py` escribe además `<nombre>.srt` y `narracion.txt` desde `FILM.NARR`): entregados en `Downloads/Zuka_Conjuntos_zoom`, **ya están en Bunny y puestos en las lecciones** (2026-11-13: `de65d162-…`, 118 s y `099c6af5-…`, 120 s), con las `scenes` de respaldo al día (alg-0b: meses de 32 días, {Bogotá}, {∅}, letras y vocales, AMOR/ROMA, frutas y herramientas, toppings; alg-0c: siete amigos, fútbol y música). **Nuevo video de `alg-0b` en estilo Bauhaus Shapes** (lemo-opuscar; `video/tipos-conjuntos-bauhaus`, 237.5 s, `sh video/tipos-conjuntos-bauhaus/build.sh`, unos 25 min con 2 trabajadores: con 3 la captura se cuelga): entregado, espera su ID de Bunny. Al recibirlo, cambiar `clip.bunny` + `duration` de `alg-0b` y poner sus `scenes` de respaldo al día con los ejemplos nuevos ({s, a} frente a las letras de SOL, redondas y cuadradas, las formas {●, ■, ▲}). `film.js` trae escenas en pulsos de 0.625 s (`BEATS`), una función por escena, `EV` (sonido) y `NARR` (narración → `.srt`). Los videos viejos C0 y EC0
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
- **Nuevo video de `alg-11` en estilo Scale Zoom Explainer** (`video/naturales-zoom`, 118 s, mismo motor `zoomkit.js` que
  la Pradera, con ℕ y ℤ de doble trazo; `sh video/naturales-zoom/build.sh`, unos 5 min). Un solo zoom por cuatro niveles:
  manzanas → fila de naturales → hueco a la izquierda del 1 (termómetro 2 − 5 = −3, nacen los enteros) → el cero como
  espejo (4 y −4, mar y deuda) → ℕ ⊆ ℤ. Entregado en `Downloads/Zuka_Valle_zoom` con `.srt` y narración; espera su ID
  de Bunny (es alternativa a la versión en lápiz: el usuario elige cuál sube).
- **Valle de los Números en zoom, lecciones 2 a 6** (mismo estilo y motor que `naturales-zoom`; un solo proyecto
  `video/valle-zoom`, `index.html?f=<nombre>` carga `films/<nombre>.js`; `zoomkit.js` ampliado con fracciones `{fr: [n, d]}`,
  rayita de período `{ov}` y ℚ ℝ 𝕀 ∀ ⇒; piezas comunes en `valle.js`; `sh video/valle-zoom/build.sh [nombre …]`, unos 5 min
  cada uno, deja `out/<nombre>/`): `racionales` (`alg-11b`, 128 s), `reales` (`alg-11c`, 138 s), `campo` (`alg-12b`, 129 s),
  `consecuencias` (`alg-12c`, 141 s), `orden` (`alg-12d`, 124 s). Mismos ejemplos que los videos actuales (las escenas de
  respaldo siguen valiendo). Entregados en `Downloads/Zuka_Valle_zoom_2a6`; esperan su ID de Bunny: al recibirlo, cambiar
  `clip.bunny` + `duration` de esa lección.
- **Mercado de las razones en zoom, lecciones 1 a 6** (mismo proyecto `video/valle-zoom`; hilo: Ana, Beto y Caro en el
  mercado, según `docs/storytelling-videos.md`): `razones` (`alg-12`), `proporciones` (`alg-12e`), `reglatres` (`alg-12f`),
  `porcentajes` (`alg-13`), `aumentos` (`alg-13c`), `sucesivos` (`alg-13d`), 123–135 s. Mismos ejemplos que los videos actuales.
  Entregados en `Downloads/Zuka_Mercado_zoom`; esperan su ID de Bunny: al recibirlo, poner `clip.bunny` + `duration`.
- **Torres de Potencias en zoom, lecciones 1 a 4** (mismo proyecto `video/valle-zoom`; token `{rad, idx}` para raíces):
  `potencias` (`alg-21a`), `leyes` (`alg-21b`), `raices` (`alg-22a`), `radicales` (`alg-22b`), unos 130 s. Ejemplos nuevos, que
  no salen en los ejercicios. Entregados en `Downloads/Zuka_Potencias_zoom`; esperan su ID de Bunny: al recibirlo, poner
  `clip.bunny` + `duration` (las escenas de respaldo de esas lecciones usan otros ejemplos: actualizarlas a los del video).
- **Escalera de Sigma en zoom, lecciones 1 a 5** (mismo proyecto `video/valle-zoom`; tokens `{big: 'sum'|'prod', hi, lo}` para Σ y Π
  y `{sub}` para subíndices): `sucesiones` (`alg-14`), `sumaarit` (`alg-14b`), `geometricas` (`alg-14c`, ya tiene video en Bunny:
  el usuario elige), `sumageo` (`alg-14d`), `sumatoria` (`alg-15`), 130 s. Usan los ejemplos de las escenas de respaldo más
  algunos nuevos; `tests/sigma-zoom.test.js`. Entregados en `Downloads/Zuka_Sigma_zoom`; esperan su ID de Bunny: al recibirlo,
  poner `clip.bunny` + `duration`.
- **Taller de los Bloques en zoom, lecciones 1 a 4** (mismo proyecto `video/valle-zoom`; bloques algebraicos `blk` y `cube` en
  `valle.js`): `polinomios` (`alg-23a`), `notables` (`alg-3`), `binomio` (`alg-24c`), `factorizacion` (`alg-24b`), 130 s.
  Ejemplos nuevos (las escenas de respaldo de estas lecciones repiten los de sus ejercicios: al recibir los ID, cambiarlas a
  los del video); `tests/bloques-zoom.test.js`. Entregados en `Downloads/Zuka_Bloques_zoom`; esperan su ID de Bunny. Estas
  lecciones aún tienen ejercicios de opción múltiple y sin pistas.
- **Fuente de la Parábola en zoom, lecciones 1 a 4** (mismo proyecto `video/valle-zoom`; ejes y curvas `axes`, `curve` en
  `valle.js`): `complejos` (`alg-23c`), `lineales` (`alg-1`), `parabola` (`alg-4a`, su video viejo `video/clase_cuadratico`
  sigue sin ID: el usuario elige), `cuadraticas` (`alg-4`), 130 s. Hilo: el chorro de la fuente de Caro y = −x² + 4x + 1.
  Ejemplos nuevos; `tests/fuente-zoom.test.js`. Entregados en `Downloads/Zuka_Fuente_zoom`; esperan su ID de Bunny (al
  recibirlos, poner las escenas de respaldo con los ejemplos del video).
- **Valle de los Números en lápiz** (estilo Tablet Sketch Explainer, lemo-opuscar; `video/valle-sketch`, un solo motor
  `kit.js` + `films/v1.js … v6.js` para `alg-11`, `alg-11b`, `alg-11c`, `alg-12b`, `alg-12c`, `alg-12d`; 177–246 s, sin voz;
  `sh video/valle-sketch/build.sh [vN …]`, unos 40 min por video con 2 trabajadores; deja `out/vN/vN.mp4`, `vN.srt` y
  `vN_narracion.txt`). Entregados en `Downloads/Zuka_Valle_lapiz`, esperan su ID de Bunny: al recibir cada uno, cambiar
  `clip.bunny` + `duration` de esa lección (usan los mismos ejemplos que los videos actuales). El cuadro con zoom muestra
  x ≈ 125–1070 de la hoja: no dibujar texto fuera de ese rango.
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
