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
- **Juegos gráficos y de arrastrar, no de botones** (pedido del 2026-11-18, para todos los cursos): el modelo son `limonada` y
  `balanza-proporcion` (Razones y proporciones). Una escena con un objeto que reacciona en vivo (una jarra que cambia de color, una
  balanza que se inclina, un globo que sube) y que se manipula directamente arrastrando o deslizando; la cuenta se escribe sola.
  «Solo tocar botones es muy aburrido»: nada de filas de botones − / + / Listo como mecánica principal.
- **Estándar por lección** (pedido del 2026-11-18, spec `2026-11-18-preuda-mundo-1`, pruebas `tests/preuda-mundo-1.test.js`): 7 u 8
  ejercicios **distintos** (ningún juego repetido en la lección), todos gráficos e interactivos, y al final un **juego en
  movimiento**. Fuera `escala-solucion`, `arma-la-cuenta`, `une-parejas`, `clasifica-cartas` y `ordena-terminos` («aburridos»). Vale
  para razonamiento lógico, Álgebra y Trigonometría; se hace por mundos. Hecho: mundo 1 del Preuniversitario (Cálculo Mental) y las
  lecciones 1 y 2 del mundo 2, Geometría (spec `2026-11-18-preuda-geometria`, pruebas `tests/preuda-geometria.test.js`): kit de dibujo
  `GEO` en `js/games/geo-kit.js` (ángulos en grados: `at`, `angOf`, `wedge`, `line`, `knob`; va después de `kit.js`) y juegos
  `tijera-angulos`, `paralelas-gira`, `apice-triangulo` (modos `falta` y `tipo`), `suma-poligono`, `cuadrados-pitagoras`,
  `escalera-pared` y `billar-rebote` (el de movimiento: se arrastra la mira y al soltar sale la bola). **Todo el componente
  Razonamiento lógico está hecho** (16 mundos, cada uno con su evaluación; spec `2026-11-18-preuda-razonamiento-completo`, sección
  «Estado»): un archivo por mundo `js/courses/preuda-r-<mundo>.js` con `PU_JUEGOS.push(({ setLesson, setExam }) => …)`, y kits
  `ORD`, `CUBO`, `SUC` (término que sigue), `CODK` (casillas con fichas), `GRAF` (ejes y barras). Faltan la Comprensión lectora y
  Trigonometría. Al probar con arrastres simulados: si el panel del navegador
  está oculto el juego corre lento; montar el juego en un `div` propio, cargar `tests/robot-trig.js` (cambia `requestAnimationFrame`)
  y esperar con `peek()` en vez de tiempos fijos. **Comprensión lectora se rehace por mundos** (spec `2026-11-19-preuda-lectura-textos`,
  pruebas `tests/preuda-lectura.test.js`, estrategia general en `2026-11-19-preuda-estrategia-examen`): cada lección = un texto original
  de 330–560 palabras en 4–7 párrafos y 7 juegos distintos de arrastrar del kit HTML `LEC` (`js/games/lectura-kit.js`: `LEC.doc`,
  `LEC.drop`); la evaluación del mundo, otro texto con `pregunta-examen` (formato real A–D, solo en evaluaciones). Un archivo por mundo
  `js/courses/preuda-l-<mundo>.js` con `PU_LEC_JUEGOS.push(({ setLesson, setExam }) => …)`; hechos los mundos 1 y 2.
- **Las instrucciones van sobre el juego, no en una ventana** (pedido del 2026-11-18, spec `2026-11-18-demo-en-juego`, pruebas
  `tests/demo-en-juego.test.js`): una mano hace el gesto en el lugar real del lienzo (`def.demo(G)` en `roundsGame` / `questGame`,
  `drawDemo` en `kit.js`) hasta el primer toque, y «Cómo se juega» la repite. Juego nuevo = con `demo`; los viejos conservan su
  tarjeta emergente hasta que se les escriba.
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
| `index.html`, `css/styles.css` | página única; variables de tema en `:root` y `:root[data-theme="light"]`. **Interfaz «red»** (spec `2026-11-27-interfaz-red`, pruebas `tests/interfaz-red.test.js`): negro azulado `#07080f`, acento hielo `--brand: #6fd3ff` (tinta encima: `--on-brand`, nunca blanco fijo), bordes de 1 px, **sin sombras duras** (`0 Npx 0 color`), sin peso 800, títulos en Jost (`--display`); el brillo es `color-mix(in srgb, <color> var(--halo), transparent)` y solo va en lo que toca ahora (botón principal, nodo actual, opción elegida). El camino es una red: nodo = aro fino, hecho = encendido, cerrado = apagado, aristas finas. `.btn` toma su tinta de `--c-on` y lleva un degradado suave de su propio color |
| `tools/marca.js`, `js/marca.js`, `brand/`, `icons/` | **marca: cerebro en malla** (ya no hay mascota). **Animación de entrada** (eslogan «Potencia tu mente»): vive en la portada `#boot` de `index.html` (bloque `.intro` entre marcas, lo escribe `node tools/marca.js`; estilos `.intro` en `css/styles.css`), así se ve desde el primer cuadro mientras la app carga. El cerebro de malla está **quieto y centrado** como el icono con que Android abre la app; solo se anima la opacidad de capas enteras (6 franjas de caras, 4 letras, eslogan): nada de mover, escalar ni dibujar trazos. El script del `<head>` pone `data-intro` la primera vez de cada sesión (no con «reducir movimiento»); mientras dura, documento, portada y `theme-color` son oscuros en los dos temas (si no, en tema claro quedan bordes blancos en las barras del celular). `introWait` en `js/app.js` espera `INTRO_MS`; un toque la salta. `node tools/marca.js [--png]` genera `js/marca.js` (`brainSVG('simple' \| 'full' \| 'lit')`, `brainTile`, `logoHTML`), `brand/logo-*.svg`, `brand/cerebro.svg` y, con `--png`, los iconos (usa playwright-core de `~/lemo-opuscar`). No editar `js/marca.js` a mano. `'lit'` (caras encendidas) sale al terminar una lección |
| `js/art.js` | iconos de los cursos (`COURSE_ART`, 64×64): se dibujan con la paleta base `ART_C` y se pintan con la del curso, `ART_PAL[id]` (cuatro tonos de su color y un acento que combina). Curso nuevo = su figura y su paleta (lo exige `tests/figuras.test.js`) |
| `js/app.js` | estado `S`, pestañas, ruta de lecciones, `startLesson` (cola de videos y ejercicios, retroalimentación), tema (`applyTheme`) |
| `js/content.js` | ayudantes `sc, mc, num, ord, sld, play`, `clipsOf`, `buildQueue`, `BUNNY_CDN` |
| `js/exercises.js` | tipos de ejercicio (`mc`, `input`, `order`, `slider`, `play`), `renderExercise`, `hintBlock` (botón «Ver pista») |
| `js/courses/algebra.js`, `trig.js`, `calculo.js`, `js/data.js` | cursos: Álgebra (unidad 0 «Conjuntos» desde cero: lecciones `alg-0a`, `alg-0b`, `alg-0c`, sin números ni desigualdades, spec `2026-11-11-conjuntos-desde-cero`, luego «Sistemas numéricos y axiomas», el mundo «Razones, proporciones y porcentajes» (`alg-12`, `alg-12e`, `alg-12f`, `alg-13`, `alg-13c`, `alg-13d`; spec `2026-11-11-razones-desde-cero`) y el resto en el orden del cronograma 2026-2 de Álgebra y Trigonometría; el interés `alg-13b` va tras la función exponencial `alg-71`), Trigonometría (3), Cálculo Diferencial (5, cronograma 2026-2 de Cálculo; sus unidades 1–2 son lecciones `alg-*` movidas desde Álgebra, ids sin cambiar para no perder progreso); Física, etc. en `data.js`. Spec `2026-11-07-cronograma-algebra-calculo-design.md` |
| `js/courses/preuda-razonamiento.js`, `preuda-lectura.js`, `preuda.js` | curso **Preuniversitario UdeA** (id `preuda`, color lima, spec `2026-11-18-curso-preuda`, pruebas `tests/preuda.test.js`; el usuario lo pidió como «preUDA» pero se llama Preuniversitario UdeA). Sale del temario `Contenidos_Preuniversitario_UdeA_Zuka.pdf`: dos componentes (`blocks`: Razonamiento lógico, 16 mundos y 57 lecciones; Comprensión lectora, 12 mundos y 33 lecciones), un mundo por tema en orden de prioridad, ids `pu-…`. Cada unidad lleva `block`. **Al entrar al curso se elige primero el componente** (`renderComponents`, tarjetas `.comp-card`); al tocar uno se ven solo sus mundos, numerados desde 1 (`openBlock`, `worldNo`), con «Componentes» para volver. «Sigue aquí» se queda en el componente y la primera lección de cada uno se abre sola y es gratis (`blockStart`, `catalogo`). Ejercicios con juegos genéricos (`escala-solucion`, `arma-la-cuenta`, `ordena-terminos`, `encuesta-venn`) y, en lectura, el juego nuevo **`subraya-texto`** (HTML: se tocan los trozos del texto que responden; `text` en trozos con «|»). Textos de lectura originales. **Lección `pu-cm-1` completa** (spec `2026-11-18-preuda-enteros`, pruebas `tests/preuda-enteros.test.js`): juegos `globo-lastre` (globos +1 y sacos −1; soltar sacos sube), `voltea-flecha` (deslizador que repite y refleja la flecha) y `capas-operacion` (arrastrar un número sobre su vecino para operarlos por capas), y video `video/preuda-cosmos` película `enteros` (`sh video/preuda-cosmos/build.sh`; HUD propio con franja lima y **sin reloj ni barra abajo**, pedido del usuario; entregado en `Downloads/Zuka_Preuniversitario`, espera ID de Bunny). **Modelo para las demás lecciones del curso.** Nace en **borrador** (fila en `supabase/migrations/20261118000001_curso_preuda.sql`, sin publicar) hasta la revisión docente; faltan videos y juegos propios por mundo |
| `js/worlds.js` | mundos del mapa (`WORLDS`): nombre de capítulo y lámina técnica SVG 160×80 (estilo neón desde el 2026-11-27: el mismo degradado negro azulado para todos, **sin cuadrícula ni color propio del mundo**, diagrama a línea fina que brilla; sus cuatro colores son variables `--plate-bg0/bg1/ink/ac` que `css/styles.css` llena en `.world-art` y `.wnode-art`: el acento es **el color del curso** (`--c`) y en tema claro la lámina pasa a papel claro con tinta oscura; idea en el centro x 44–116 porque el mapa la recorta en círculo). Spec `2026-11-24-mundos-sobrios`, pruebas `tests/mundos-sobrios.test.js`. Los nombres viejos (Pradera de Venn, Valle de los Números, Mercado de las Razones, Torres de Potencias, Escalera de Sigma, Taller de los Bloques, Fuente de la Parábola, Cordillera Cúbica, Río de las Asíntotas, Selva Exponencial, Mar de las Ondas, Faro de los Ángulos, Galaxia Polar) siguen en specs, pruebas y videos: son los mundos que hoy se llaman Teoría de Conjuntos, La Recta Real, Escalas y Proporciones, Exponentes y Radicales, Sucesiones y Series, Álgebra de Polinomios, Parábolas y Complejos, Raíces de Polinomios, Fracciones Algebraicas, Crecimiento Exponencial, Funciones Periódicas, Identidades y Triángulos y El Plano Complejo. Al nombrar un mundo nuevo: nada de lugares de cuento |
| `js/games/kit.js` | `GAMES`, `PALETTES`/`PALETTE`/`setGameTheme`, **`COURSE_PALETTES`/`setGameCourse(id)`** (paleta del curso sobre la del tema; la llaman `startLesson` y `startExam`, y pone `--play-bg`. Los siete cursos tienen la suya (Álgebra morado, Trigonometría cian, Cálculo rosa, Geometría azul, Física ámbar, Integral verde, Lineal naranja); `ok`/`bad` no cambian. El Preuniversitario usa fondo neutro y plano, sin brillo de su color (`FLAT_COURSES`; el verde teñido tapaba los juegos). Curso nuevo = su entrada ahí, la prueba `tests/tema-juegos.test.js` comprueba contraste), `mountSketch`, `shuffledOrder`, `lineMap`, `nearest` |
| `js/games/*.js` | un archivo por juego (≈59) |
| `js/player.js` | reproductor de clips (Bunny HLS o escenas animadas) |
| `js/curiosidades.js`, `media/clips/` | pestaña Clips: videos cortos de datos curiosos (`CURIOS`, `CURIO_TOPICS`, `curioFeed`, `findCurio`); spec `2026-11-12-clips-curiosidades`, pruebas `tests/curiosidades.test.js` |
| `js/tutorias.js` | pestaña Tutorías: el estudiante separa una asesoría virtual eligiendo materia, temas (lecciones de esa materia), día y hora; **sin nombres de tutores** (`TUTORIAS` con el horario `hours`, `tutoriaDays`, `bookTutoria`, `renderTutorias`, `openBooking`). Reservas en `S.tutorias`, sin servidor: solo quedan en el celular hasta poner `TUTORIAS.whatsapp`. Spec `2026-11-12-tutorias`, pruebas `tests/tutorias.test.js` |
| `docs/resumenes/tex/`, `media/resumenes/` | resúmenes en PDF de los mundos de **Álgebra y Trigonometría** (lista `RESUMENES` en worlds.js; los demás cursos aún no), en LaTeX (fondo blanco, TikZ/pgfplots, taller de 10 ejercicios con respuestas): plantilla `zuka-resumen.sty`, fuente `<mundo>.tex` (id del mundo) → `sh docs/resumenes/build.sh [mundo]` deja `media/resumenes/<mundo>.pdf`; `summaryOf(u)` (worlds.js) y `renderWorld` muestran «Resumen del mundo» al final del camino. Mundo nuevo de esos cursos = su `.tex` y su PDF (la prueba lo exige). Hay borradores sin terminar de Cálculo, Geometría, Física, Integral y Lineal en `docs/resumenes/tex/` (sin commit). Spec `2026-11-13-resumenes-pdf`, pruebas `tests/resumenes.test.js` |
| `js/acceso.js`, `js/cuenta.js`, `admin/`, `supabase/` | **cuentas y planes** (spec `2026-11-17-usuarios-planes-admin`, pruebas `tests/acceso.test.js`): Supabase (proyecto `zuka`) guarda usuarios, planes, códigos de un solo uso y progreso; el estudiante paga por Nequi y canjea un código. `acceso.js` es la lógica pura (`estadoPlan`, `motivoBloqueo`, `catalogo`, `NIVEL_TIPO`: primera lección de cada curso y clips gratis, videos Básico, resúmenes y evaluaciones Medio, tutorías Pro); `cuenta.js` la sesión, «Mi plan», canje, candados (`planMotivo(id)`, `openBloqueo(id)`) y avance en la nube; `admin/` el panel (`/admin`, solo rol admin); `supabase/migrations` las tablas en español (`perfiles`, `planes`, `codigos`, `progreso`, `lecciones`…; las tablas viejas en inglés no se usan ni se tocan) y `supabase/functions/video-url` firma los enlaces de Bunny. **En `localhost` no hay candados** (con `?candados` sí). Al añadir lecciones o IDs de Bunny: `node tools/sync-lecciones.js` y correr ese SQL en Supabase (el servidor solo entrega videos que están en la tabla `lecciones`) |
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
- **Dos bibliotecas de Bunny** (desde el 2026-11-17): los videos nuevos se suben a la biblioteca **811556**
  (`BUNNY_CDN = vz-1a76d229-c83.b-cdn.net`, sin token; pide `Referer`). Los que ya estaban en la vieja
  (`vz-2449e89f-b51`, con token que firma la función `video-url`) están listados en `BUNNY_VIEJOS` de `js/content.js` y
  `bunnyHost(id)` elige el servidor. **Un ID nuevo no se añade a esa lista.** Duración de un video nuevo: sumar los
  `#EXTINF` de `https://vz-1a76d229-c83.b-cdn.net/<id>/720p/video.m3u8` con `Referer: http://localhost:5173/`. La llave
  de la API de Bunny nunca va al repositorio. Al poner un ID: actualizar su fila en la tabla `lecciones` de Supabase.

## Juegos (p5.js)

Contrato: `GAMES['nombre'] = { grade(state, params) → { ok, solution }, create(host, params, api) →
{ loaded, getState, lock, destroy } }`. `grade` es pura (se prueba en Node). En `create`:

- `const C = api.palette` y **leer los colores al dibujar** (`C.bg, C.card, C.line, C.ink, C.mute, C.brand,
  C.ok, C.bad`, familias `C.N, C.Z, C.Q, C.I, C.R`). Así se repintan solos al cambiar de tema. Nada de
  colores fijos para texto o fondo.
- **Estilo «estudio»** (spec `2026-11-25-juegos-sobrios`, pruebas `tests/juegos-sobrios.test.js`): tinta azul profunda o papel azul muy claro con papel milimetrado quieto (`backdropGrid`), fichas con radio 8 y labio de 2 px, carteles con borde fino y barra de color, corazones pequeños, confeti fino, sin caras de caricatura ni emojis (los elementos de los conjuntos son letras, números o griegas). Los botones de la app ya no llevan sombra dura (spec `2026-11-27-interfaz-red`). Reemplaza lo que sigue sobre el fondo con estrellas y la paleta «azul noche».
- **Teoría de Conjuntos en «lámina»** (spec `2026-11-26-conjuntos-lamina`, pruebas `tests/conjuntos-lamina.test.js`, galería `tests/robot-conjuntos.js`: `await __conj.gallery(juegos | null, tema, ancho)` y `__conj.play(i)`): los juegos del mundo 1 usan el lenguaje de su lámina con las piezas `SK` de `js/games/conjuntos-kit.js` (va después de `formula.js`): `panel` (el universo), `membrane` (la curva de un conjunto, con brillo), `tag`, `chip` (píldora de un elemento: idle, on, ok, bad, ghost), `serif` (cursiva de libro), `formal` (franja de escritura formal con TeX), `zones` (zonas de un Venn con recorte exacto, rellenas o rayadas; pinta con el contexto del lienzo, no con `p.fill`), `ease`, `sets(C)` (A verde azulado, B coral, C azul). Pantalla en tres franjas: rótulo, diagrama, escritura formal en vivo. Juegos nuevos con `questGame`, sin reloj: `lazo-conjunto` (rodear elementos con el dedo; final de `alg-0a`), `cubo-partes` (retículo de las partes: armar con interruptores cada uno de los 2ⁿ subconjuntos y encenderlo, sin repetir), `orbita-conjuntos` (marcar los que cumplen ⊆, =, disjunto o unitario; final de `alg-0b`) y `descifra-zona` (armar con tres ruedas la operación que pinta la zona rayada; nada avisa que coincide hasta tocar «Listo»; final de `alg-0c`). `lluvia-elementos`, `revienta-globos`, `luciernagas-venn` y `fabrica-subconjuntos` siguen en el repositorio pero ya no están en las lecciones. **Modelo para rediseñar los demás mundos**: un kit de dibujo por mundo con el motivo de su lámina.
- **Estilo de los videos** (spec `2026-11-13-juegos-estilo-video`, pruebas `tests/estilo-video.test.js`): el kit pone a
  todos los juegos la paleta de los videos zoom (azul noche en tema oscuro; en tema claro un papel azul muy claro, no crema:
  sobre crema las piezas amarillas se perdían), fondo con estrellas al limpiar con
  `p.background(C.bg)`, letra Jost, pestañas como fichas, onda al tocar y confeti al acertar (`playFx`). Rellenos
  vivos: `C.sun, C.coral, C.mint, C.sky`; texto encima con `inkOn(color)`. Animar con `fxTween(obj, props, opts)`
  (anime.js 3.2.2 en `js/vendor/anime.min.js`; sin anime o con «reducir movimiento» pone el valor final).
  Piezas de dibujo de los videos, al final de `kit.js`: `drawTile` (ficha con relieve; negativos coral, cero sol),
  `drawSlot`, `drawKicker` (rótulo con barrita), `drawPill`, `drawDot`, `drawNumLine`, `shade`. Cambian alineación,
  estilo y relleno: volver a fijarlos después. **Álgebra U0 (Conjuntos), U1, Razones y porcentajes, y Progresiones y sumatoria ya están rediseñados con ellas**; faltan las demás unidades.
- `mountSketch(host, (p, size) => {...}, aspecto)`; solo escribir `mousePressed/Dragged/Released`
  (los toques se enlazan solos). `p.onResize` para reacomodar.
- **Guía «Cómo se juega»** (`js/guia.js`, spec `2026-11-16-guia-y-colores`, pruebas `tests/guia.test.js`): la primera vez que se ve
  un juego o un tipo de ejercicio sale una tarjeta con un ejemplo animado (una mano hace el gesto); luego queda el botón
  «Cómo se juega» junto a la pista. **Cada juego nuevo necesita su entrada en `GUIDES`** (`[escena, texto, opciones]`, uno o
  dos pasos; escenas en `GUIDE_SCENES`: tap, drag, step, slide, turn, hold, fling, swipe, trace, keys, paint, touch) y, si usa
  vidas, su nombre en `GUIDE_ARCADE`; el cartel, las vidas, las rondas y «Comprobar» se añaden solos. No sale sola en las
  evaluaciones. Se recuerda en `S.guides`.
- **Mundos altos de Álgebra** (spec `2026-11-19-mundos-altos`, pruebas `tests/mundos-altos.test.js`): los ejercicios de Taller de los
  Bloques, Fuente de la Parábola, Cordillera Cúbica, Río de Asíntotas y Selva Exponencial, su jefe final y su evaluación están en
  `js/courses/mundos-altos.js` (va después de `algebra.js` y reemplaza los `ex` de 16 lecciones; los viejos de `algebra.js` ya no se
  usan). Juegos: `bloques-area`, `division-sintetica`, `cancela-factores` y `jefe-ruta`, un **jefe genérico** por rutas de pasos
  (`{ name, color, rounds: [{ title, attacks: [{ say, levels }] }] }`, el paso válido primero) que sirve para cualquier mundo. Los diez
  mundos de Álgebra tenían jefe y evaluación (spec `2026-11-20-jefes-valle-a-escalera`); desde el 2026-11-18 ya no tienen jefe.
- **Juegos dinámicos por retos con `questGame(def)`** (al final de `kit.js`; spec `2026-11-21-dinamicos-mundos-altos`): armazón de un juego
  de acción sin prisa (rondas de dos o tres retos, tres vidas, cartel, pausa tras acertar, resumen). El juego da `init`, `ok` y
  `answer` (puras), `solution`, `prompt`, `draw`, `press` y `peek` con `solve` (cajas por tocar, para el robot). Hechos con él, uno
  por lección de los cinco mundos altos (`DYN` en `mundos-altos.js`): `torre-grados`, `arma-la-mesa`, `camino-pascal`,
  `reparte-barras`, `gira-complejos`, `balanza-cajas`, `apunta-chorro`, `donde-cae`, `empaca-filas`, `sondea-niebla`,
  `cruza-o-rebota`, `rio-o-hueco`, `llena-estanque`, `bote-corriente`, `cruce-curvas`, `lirios-laguna`, `dos-bancos`,
  `regla-de-calculo`, `piedras-selva`. Las escenas de respaldo de esas 19 lecciones (`SC`, mismo archivo) cuentan su video zoom.
- **Fórmulas con TeX en el lienzo** (`js/games/formula.js`, spec `2026-11-18-formulas-tex`, pruebas `tests/formula.test.js`): los
  textos que dibuja un juego (`fitText`, `drawTile`, `p.text` de un renglón centrado en vertical) pueden llevar TeX entre `$…$`
  (`rac`, `^`, `_`, `sqrt`, `	ext`…; barra doble en cadenas JS) y se dibujan con fracciones apiladas, exponentes y raíces, con la
  tipografía de KaTeX. Los textos viejos con símbolos (x², 3/4, √12) se convierten solos (`plainToTex`, `formulaWanted`). Las
  `solution` de los juegos pasan por `texify` antes de `tex()`. **En juegos nuevos, escribir la matemática en TeX.** Sabe también lógica y operadores (¬ ∨ ∧ ↔ ⋆ ⊕ ⊙ ⊗ ⋄) y `\overline`; `tests/tex-lienzo.test.js` avisa si un juego del Preuniversitario usa un comando que el lienzo no dibuja (saldría escrito con letras).
- **Sin escribir** (spec `2026-11-17-sin-escribir`, pruebas `tests/sin-escribir.test.js`): la app no muestra ningún ejercicio de
  teclear. Los `num(...)` que quedan en los cursos se cambian al cargar (`js/courses/sin-escribir.js`, tabla `SIN_ESCRIBIR` con clave
  `lección#posición`) por `arma-la-cuenta` (se plantea la operación con fichas y el juego la calcula) o `escala-solucion` (se elige
  el paso válido en cada nivel). **No añadir `num` nuevos**; si se mueve un ejercicio de una lección que tiene alguno, ajustar su
  clave en la tabla (la prueba avisa).
- **Colores que no se pisan**: el amarillo de relleno (`C.sun`) nunca va como color de letra (para letras, `C.N`); el texto
  sobre un relleno usa `inkOn(color)`. `tests/robot-colores.js` (se carga en la página con `fetch` + `eval`;
  `await __colores.run()`) monta todos los juegos en los dos temas y avisa de textos sin contraste y de figuras del mismo
  color que su fondo.
- **Fondo liso, una pantalla y sin encimados** (2026-11-27, pedido del usuario): el fondo de los juegos ya no lleva papel milimetrado (`drawBackdrop`: color del tema y del curso con un brillo suave; `backdropGrid` se quitó). **El ejercicio cabe en una pantalla**: `mountSketch` achica el lienzo con su ancho y alto de CSS (`fitScale`, hasta `FIT_MIN` = 0.66; nunca con `transform`, que p5 no corrige) cuando enunciado + juego no caben en `.lesson-body`; el juego sigue dibujando en su tamaño de diseño. Una fórmula de un renglón bajo las pestañas se encoge para no meterse en ellas (`formulaRoom`). Robot `tests/robot-encimados.js` (fetch + eval; `await __encima.run(juegos | null, porJuego, ancho)`): avisa de textos que se pisan, que cruzan el borde de una ficha o que se salen del lienzo; los avisos «tapado» en fase «inicio» son el cartel «Toca para empezar» (normal). Pendientes vistos por el robot a 300 px: fichas de `cajas-numericas` al mostrar la solución y etiquetas de `lazo-conjunto`.
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
- **Trigonometría** (spec `2026-11-22-trigonometria-juegos`, pruebas `tests/trig-juegos.test.js`, robot `tests/robot-trig.js`: `await __trig.run()` juega con `peek().solve` cualquier juego `questGame`): las 20 lecciones ya no tienen `une-parejas` y cada una termina en un juego `questGame` propio (`TRIG_EXTRA` en `js/courses/trig-juegos.js`, que va después de `trig.js`): `quita-vueltas`, `rueda-rodante`, `toca-lados`, `figuras-notables`, `multiplica-razon`, `proyecta-punto`, `espejo-cuadrantes`, `ola-entre-lineas`, `crestas-faroles`, `ventana-inversa`, `escala-triangulo`, `todo-en-senos`, `rectangulo-suma`, `tira-doble`, `red-periodica`, `pareja-opuesta`, `bisagra-area`, `parientes-polares`, `multiplicador-oculto` (se ve una figura y su imagen al multiplicar por w una o dos veces; se toca w: girar y estirar, y con w² las dos raíces cuadradas), `hermanas-raiz`. **Galaxia Polar tiene tres lecciones**: `trig-151` forma polar, `trig-152` producto, cociente y potencias (De Moivre) y `trig-153` raíces n-ésimas (antes era la parte 2 de `trig-152`). Ayudas comunes `TK` al final de `kit.js` (`piTex`, valores notables, `ring`, `row`, `steps`, `hitSeg`, `sideLabel`). El rótulo (`prompt`) de un `questGame` debe ser corto (unas 60 letras): si no, sale diminuto. **Jefes finales de Trigonometría** (spec `2026-11-23-trig-jefes-y-movimiento`, pruebas `tests/jefes-trig.test.js`): juego `jefe-rueda` (un `questGame`: se marcan como runas los nudos de una rueda de ángulos que responden cada reto y se toca «¡Atacar!»; con `rings` la rueda tiene anillos de módulos, para complejos y raíces), datos en `TRIG_BOSS` al final de `trig-juegos.js`: El Kraken de las Olas, El Guardián del Faro y La Nebulosa Polar. Movimiento en los juegos `questGame`: `TK.glide(G, clave, destino)` (valor dibujado que se acerca suave) y `TK.fire(G)` / `TK.prog(G, dur)` (animación al lanzar); solo para dibujar, la lógica usa el valor real. Todo `questGame` suelta chispas al acertar. Faltan las evaluaciones de Trigonometría.
- **Juegos por rondas con `roundsGame(def)`** (al final de `kit.js`; spec `2026-11-15-torres-de-potencias`): armazón con
  pestañas, enunciado, pie y estado `{ rounds: [...] }`; el juego solo da `init, ok, solution, prompt, draw, press` (y
  `answered`, `foot`, `layout`, `peek` si hacen falta). Con `sup(n)`, `drawStepper` y `stepHit`. Hechos con él, todos del
  mundo Torres de Potencias: `arbol-potencia`, `pares-negativos`, `cuenta-factores`, `cambia-de-piso`, `salta-la-coma`,
  `reparte-factores`, `parte-baldosa`, `tabla-conjugado`. Ese mundo ya no tiene opción múltiple ni tarjetas. Escalera de Sigma
  (spec `2026-11-15-escalera-de-sigma`): `cuenta-saltos` (saltos y no términos; modos `value` y `count`, `arit` y `geo`),
  `resta-corrida` (rS − S: se tachan las parejas iguales) y `parte-sigma` (Σ(ck + d) = c·Σk + d·n); tampoco le quedan tarjetas. El robot
  `tests/robot-torres.js` (se carga en la página con `fetch` + `eval`) resuelve con `peek()` los juegos de los dos mundos.
- **Revisión a fondo de Álgebra** (pedido del 2026-11-18, spec `2026-11-18-algebra-revision`, pruebas `tests/algebra-revision.test.js`):
  otro agente (commits `74352a0` y `587631a`, archivos `js/courses/algebra-taller.js`, `js/games/algebra-taller.js` y
  `algebra-escenas.js`) había llenado cada lección con nueve motores genéricos `taller-*` (membrana, mosaico, plano, barra, sonda,
  área, balanza, trazo, giro), que se repetían hasta 26 veces y a veces sin sentido (un plano cartesiano para la recta, una balanza
  sin ecuación). El usuario pidió: **ningún juego repetido**, una escena propia por idea, **sin jefes finales** y una **evaluación
  completa** por mundo. Ya no hay jefes en Álgebra (`assess` borra `u.boss` y pasa sus retos a la evaluación). Los mundos se rehacen
  en `js/courses/algebra-revision.js` (va después del taller): `setLesson` y `setExam`; `ALG_REVISADOS` lista los terminados y la
  prueba les exige 7 u 8 juegos distintos, ninguno `taller-*`, ningún juego usado en dos lecciones del curso, último en movimiento
  y al menos dos preguntas por lección en la evaluación. **Los diez mundos están rehechos** (mundo 1 primero; los mundos 2 a 10
  juntos, con unos 185 juegos nuevos; la lista de cada lección está en la spec). Los juegos nuevos de los mundos 2 a 10 se dibujan
  con el kit `RK` de `js/games/recta-kit.js` (`chip`, `strip`, `track` + `pick` para deslizadores por pasos, `tile`, `plane` + `curve`
  para el plano cartesiano). Con ellos se pueden armar los de Trigonometría y Cálculo si se pide la misma revisión.
- **Jefe final de un mundo** (ya no se usa en Álgebra: ver la revisión de arriba) (spec `2026-11-14-jefe-final-pradera`, pruebas `tests/jefe-venn.test.js`): `unit.boss = { id, title,
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
- **Inicio y barra de arriba** (spec `2026-11-15-interfaz-referencias`, pruebas `tests/interfaz.test.js`): racha, XP y vidas son
  píldoras (`.tb-stat`); la racha abre `openStreakSheet` (`S.maxStreak`). El inicio abre
  arriba con la tarjeta «Sigue aquí» (`.next-card`), que lanza la lección que toca de un toque. Botones `.btn` sin mayúsculas.
- **Perfil, Ajustes y Actividad** (spec `2026-11-17-perfil-ajustes-actividad`, pruebas `tests/perfil-ajustes.test.js`): el Perfil solo
  tiene lo del estudiante (cuenta, datos, meta de hoy, progreso, guardados); el piñón abre **Ajustes** (`renderSettings`, subvista
  `profileSub`; filas `.set-row` con icono: meta diaria, sonido, tema, modo revisión del administrador, instalar, recorrido, reiniciar).
  Un ajuste nuevo va ahí, no en el Perfil. La racha abre **Actividad**: calendario del mes (`monthGrid`, `streakDays` en `js/ui.js`)
  con `S.days` (XP por día, local, 400 días).
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
- **Preuniversitario UdeA, razonamiento, mundo 1 completo en video** (spec `2026-11-19-preuda-videos-mundo-1`, pruebas
  `tests/preuda-videos-mundo-1.test.js`): `video/preuda-cosmos` películas `enteros` (`pu-cm-1`, rehecho el 2026-11-19 con el mismo formato), `fracciones`, `porcentajes` y
  `potencias` (`pu-cm-2` a `pu-cm-4`, ≈ 4 min 52 s). Cada una abre con una **pregunta real del examen de admisión UdeA** como reto
  (tarjeta `examCard` de `preu.js`, opciones A–D) y la resuelve al final, con otra pregunta real o de los talleres del
  preuniversitario en medio (material en `Documents/PreU`). `sh video/preuda-cosmos/tools_stills.sh <película>` deja una hoja de
  contacto. Entregados en `Downloads/Zuka_Preuniversitario` (mp4 1080 + `.srt`); las escenas de respaldo ya cuentan el video.
  **Modelo para los mundos siguientes del preuniversitario**: reto real del examen, conceptos con intuición y cierre en la opción.
  **En el video solo va el enunciado** (pedido del usuario, 2026-11-19): nada de «pregunta del examen de admisión», «UdeA
  2024-2», «taller del preuniversitario» ni «la opción B del examen», ni en narración, rótulos, nombre de escena ni tarjeta (la
  tarjeta dice «RETO» o «PROBLEMA»); tampoco en las escenas de respaldo. La prueba lo comprueba.
- Clips: `cur-origen-numeros` ya está en Bunny (versión zoom, 80 s). `cur-abejas` también (75.5 s). Un clip nuevo puede vivir como mp4 en `media/clips/`
  mientras llega su ID; al recibirlo, cambiar `clip.video` por `clip.bunny`, poner la `duration` de Bunny y borrar el mp4.
  Bunny solo responde con `Referer` de la app o de localhost. **`cur-arroz`** («El arroz del rey», estilo Data Physicalization, 72.5 s, `video/arroz-ajedrez`,
  `sh video/arroz-ajedrez/build.sh`, unos 25 min; escena 3D con three.js; `render.mjs` guarda cuadro a cuadro y reintenta si el GPU
  se cuelga, porque `video.mjs` aborta): ya está en Bunny (`f68c6ba7-…`, 72.5 s); el HD está en `Downloads/Zuka_Arroz_rey`.
  Granos reales en las casillas 1–10 y luego 1 placa = un año de cosecha mundial (443 + 443); datos en `FACTS.md`, pruebas `tests/arroz-ajedrez.test.js`. **`cur-curva`** («La curva más corta», estilo 3D Map Explainer, 82.5 s, `video/curva-corta`,
  `sh video/curva-corta/build.sh`, unos 15 min): Nueva York–Tokio, el mapa Mercator se enrolla en el globo, corte por el centro
  (d = R·θ = 10 829 km frente a 12 745 km de la recta del mapa), vuelo bajo sobre Alaska y placas de 1 000 km. Imagen Sentinel-2
  cloudless 2016 de EOX (CC BY 4.0) y AWS Terrain Tiles (se bajan solos a `raw/`). Ya está en Bunny (`b0f02e88-…`, 82.5 s); el HD está en
  `Downloads/Zuka_Curva_corta`; pruebas `tests/curva-corta.test.js`. **`cur-razon-deco`** («La razón que no cambia», estilo Art Deco,
  90 s, `video/razon-deco`, `sh video/razon-deco/build.sh`, unos 10 min): ya está en Bunny (`688591e8-…`, 90 s); el HD está en
  `Downloads/Zuka_Razon_deco`. Una barra partida en razón áurea (el único elemento en coral) va de
  Euclides a Pacioli, el SI, el Modulor y la regla de tres de la gentamicina (80 mg / 2 mL → 20 mg = 0.5 mL); motor deco de
  lemo-opuscar copiado en `engine/` (MIT); rótulos = `CARDS` en `film.js` (también el `.srt`). Ideas del mismo texto que no cupieron: Grecia y
  la demostración, al-Juarismi y Fibonacci, quipus y yupana, binario y hexadecimal.
- **`cur-ia`** («La IA está hecha de álgebra», estilo Sci-fi Hologram HUD de lemo-opuscar, 90 s, `video/ia-algebra`,
  `sh video/ia-algebra/build.sh`, unos 15 min; motor `engine/holo.js` + `engine/hud.js`, todo en canvas 2D). Sofía, su gato Mishi
  en 16 × 16 píxeles (con la tabla 0 120 240 / 30 180 255 / 10 90 200 adentro), la última neurona x = (2, 3), w = (0.4, −0.2),
  b = 0.1 → z = 0.3 → σ = 0.574 → L = 0.181, la montaña L(w₁, w₂) y 12 pasos con η = 0.25 (91 %, L = 0.008), y palabras como
  vectores. Números en `data.js`, pruebas `tests/ia-algebra.test.js`. Ya está en Bunny (`cf9e8c95-…`, 90 s); el HD está en
  `Downloads/Zuka_IA_algebra`.
- **`cur-pi`** («¿Por qué el 14 de marzo?», estilo Caption News de lemo-opuscar, vertical, 77 s, `video/dia-pi`,
  `sh video/dia-pi/build.sh`, unos 10 min): 14/3 en Colombia frente a 3/14 en EE. UU. → 3.14 → π; la taza de Terra X
  (26.1 ÷ 8.3 ≈ 3.14), el círculo que se desenrolla, 1988 (Larry Shaw, Exploratorium), la resolución H. Res. 224 de 2009
  subrayada, UNESCO 26 nov 2019 y primera fiesta 14 mar 2020. Material real con licencia libre (Commons: Terra X CC BY 4.0,
  Lycée Georges Baptiste CC BY 3.0, Mythomen CC0, fotos CC BY; `tools/fetch.sh` baja solo los tramos usados a `raw/`;
  `SOURCES.md`, `CREDITS`, `FACTS.md`). Pruebas `tests/dia-pi.test.js`. Ya está en Bunny (`62d296c8-…`, 77 s); el HD está en
  `Downloads/Zuka_Dia_Pi`.
- **`cur-distancias`** («¿Cómo se mide el universo?», tema Ciencia, estilo Radar Sweep Documentary de lemo-opuscar, 97 s,
  `video/distancias-radar`, `sh video/distancias-radar/build.sh`, unos 6 min; canvas 2D: barrido plano o ping radial en
  coordenadas de pantalla, ecos, bloom por desenfoque; textos escritos por una barra). Mateo busca la estrella más cercana al
  Sol; escalones: láser a la Luna (2.56 s → 384 000 km), paralaje de Próxima Centauri (p = mitad del corrimiento, 0.768″ →
  1.30 pc → 4.2 años luz; moneda a 5 km), velas estándar (2 × lejos → ¼; cefeidas, Leavitt 1912, Andrómeda), corrimiento al
  rojo (656.3 → 669.4 nm, z ≈ 0.02, 86 Mpc ≈ 280 millones de años luz) y la escalera. Cifras en `data.js`, respaldo en
  `FACTS.md`, pruebas `tests/distancias-radar.test.js`. Vive como mp4 en `media/clips/`; el HD está en
  `Downloads/Zuka_Distancias_universo` y espera su ID de Bunny.
- Álgebra unidad 0: los tres videos (alg-0a, alg-0b, alg-0c) ya están en Bunny; desde el 2026-11-17 las tres lecciones usan los videos «showreel» (`conjunto-cosmos`, `-2`, `-3`). **Nuevo video de `alg-0a` en estilo Scale Zoom Explainer** (lemo-opuscar; `video/conjunto-zoom`, 116.5 s, sin voz, `sh video/conjunto-zoom/build.sh`, 1 trabajador si otro render corre a la vez): entregado en `Downloads/Zuka_Conjuntos_zoom`, espera su ID de Bunny. Al recibirlo, cambiar `clip.bunny` + `duration` de `alg-0a`; sus escenas de respaldo ya usan los mismos ejemplos (semáforo, azul, vocales, PAPAYA; el conjunto de PAPAYA se llama L y su cardinal es n(L) = 3). **Videos zoom de `alg-0b` y `alg-0c`** (`video/conjunto-zoom-2` y `-3`, 118 y 120 s, mismo estilo; el motor común es `zoomkit.js`, copiado en cada carpeta; `mix.py` escribe además `<nombre>.srt` y `narracion.txt` desde `FILM.NARR`): entregados en `Downloads/Zuka_Conjuntos_zoom`, **ya están en Bunny y puestos en las lecciones** (2026-11-13: `de65d162-…`, 118 s y `099c6af5-…`, 120 s), con las `scenes` de respaldo al día (alg-0b: meses de 32 días, {Bogotá}, {∅}, letras y vocales, AMOR/ROMA, frutas y herramientas, toppings; alg-0c: siete amigos, fútbol y música). **Nuevo video de `alg-0b` en estilo Bauhaus Shapes** (lemo-opuscar; `video/tipos-conjuntos-bauhaus`, 237.5 s, `sh video/tipos-conjuntos-bauhaus/build.sh`, unos 25 min con 2 trabajadores: con 3 la captura se cuelga): entregado, espera su ID de Bunny. Al recibirlo, cambiar `clip.bunny` + `duration` de `alg-0b` y poner sus `scenes` de respaldo al día con los ejemplos nuevos ({s, a} frente a las letras de SOL, redondas y cuadradas, las formas {●, ■, ▲}). `film.js` trae escenas en pulsos de 0.625 s (`BEATS`), una función por escena, `EV` (sonido) y `NARR` (narración → `.srt`). Los videos viejos C0 y EC0
  (`clase_alg_u0_conjuntos`, `clase_alg_u0_ej_conjuntos`) quedaron reemplazados.
- **Video de `alg-0a` en versión «estudio», para público de 17 años en adelante** (`video/conjunto-estudio`, 126 s, 30 fps, sin voz;
  `sh video/conjunto-estudio/build.sh`, unos 10 min; pruebas `tests/conjunto-estudio.test.js`). El usuario pidió que los videos **no se
  vean infantiles**: sin mascota ni cartilla. Dirección de arte nueva y **modelo para los próximos videos de lección**: escenario de tinta
  azul con retícula fina, superficies con luz suave, un solo acento (ámbar = el conjunto; coral solo mientras dura el problema), fórmulas
  en letra de libro (Cambria) y texto en Jost, entradas rápidas sin rebotes, y el zoom continuo de la serie entre cuatro niveles. Historia:
  Sofía arma una playlist («las mejores canciones» no está bien definida; «canciones del álbum Marea baja» sí; el aleatorio no cambia el
  conjunto; Costa repetida no alarga la lista; n(M) = 4). Canvas 2D propio (`film.js`) sobre las herramientas de render y sonido de
  lemo-opuscar; tiempos y textos en `data.js`; rótulos fijos arriba a la izquierda. Entregado en `Downloads/Zuka_Conjuntos_estudio`;
  espera su ID de Bunny: al recibirlo, cambiar `clip.bunny` + `duration` de `alg-0a` y sus `scenes` de respaldo a los ejemplos de la playlist.
- **Videos de `alg-0b` y `alg-0c` en el mismo estilo «showreel» (2026-11-27)**, con un ejemplo real cada uno, como pidió el usuario («continúa con ese enfoque en los demás videos»): `video/conjunto-cosmos-2` «Donar es ser subconjunto» (292 s: Viena 1901, Landsteiner; la sangre de cada persona es el conjunto de sus marcas A, B y Rh; donar = ser subconjunto, O− = ∅ donante universal, los 8 tipos = conjunto de partes, mapa en cubo) y `video/conjunto-cosmos-3` «Tres luces, ocho colores» (282 s: la pantalla y Maxwell 1861; U = los 8 colores de un píxel, R y G = colores con luz roja y verde; unión, intersección = amarillo y blanco, diferencia, complemento, diferencia simétrica y n(A ∪ B)). Motor común **`kit.js`** (copia de `conjunto-cosmos/film.js` sin escenas: letras `T`/`F`, trazos, HUD, `film`); cada película = `data.js` + `film.js` (objeto `S`) + `FACTS.md`; `sh video/conjunto-cosmos-N/build.sh` (1080×1920, 60 fps, unos 10 min). Pruebas `tests/conjunto-cosmos-23.test.js` (también comprueban la matemática de los ejemplos). Entregados en `Downloads/Zuka_Conjuntos_videos_2_y_3`. **Ya están en Bunny y en las lecciones** (2026-11-17, cortes con audio que subió el usuario: `alg-0b` `e4d2c680-…`, 218.5 s; `alg-0c` `fa037ef4-…`, 191.4 s; respaldo con la sangre y las luces; filas de Supabase al día; reemplazan a los zoom `de65d162-…` y `099c6af5-…`). **Video nuevo de una lección = este formato**: historia real al inicio, la sorpresa anunciada, cierre que vuelve al principio.
- **Escalas y Proporciones (mundo 3 de Álgebra) en estilo «showreel» (2026-11-17)**: proyecto `video/escala-cosmos` (copia del de La Recta Real: `kit.js` + `escala.js`, que añade `bar`, `grid100`, `chip`, `axes`, `curve` y toma el mundo de `D.WORLD`; `sh video/escala-cosmos/build.sh [nombres…]`; `FACTS.md`; pruebas `tests/escala-cosmos.test.js`). Seis películas de 286–294 s: `razones` (`alg-12`, «La medida de Leonardo»: Hombre de Vitruvio, pantalla 16 : 9, concreto 1 : 2 : 4, Bolt, tren 1 : 87), `proporciones` (`alg-12e`, «El pozo de Eratóstenes»: 7.2 / 360 = 5 000 / C, el trueno, Boyle 1662, reparto 2 : 3 : 5), `reglatres` (`alg-12f`, «La regla de oro»: Aryabhata 499, café, víveres de una expedición, impresoras), `porcentajes` (`alg-13`, «La centésima de Augusto»: el aire en 100 casillas, 60 % de agua, 250 % y 0.04 %), `aumentos` (`alg-13c`, «El factor escondido»: propina del 10 %, Ley 1935 de 2018, × 1.10 y ÷ 1.10, entrada de cine; **no usa el IVA porque ya sale en un ejercicio**) y `sucesivos` (`alg-13d`, «La predicción de Moore»: 40 % y 25 %, la acción que cae 50 %, 2²⁵, 1.07¹⁰). Entregados en `Downloads/Zuka_Escalas_Proporciones` (mp4 1080 + `.srt`); esperan su ID de Bunny: al recibirlo, poner `clip.bunny` + `duration` y las `scenes` de respaldo con los ejemplos del video. **Mundo nuevo en este formato = copiar la carpeta, cambiar `D.WORLD` y escribir `films/`.**
- **Mundos 4 a 10 de Álgebra en estilo «showreel» (2026-11-17/18)**, un proyecto por mundo con el mismo motor (`kit.js` + un archivo de piezas que se copia y amplía del mundo anterior; guiones en `films/<nombre>.json` → `.data.js`, escenas en `films/<nombre>.js`, `FACTS.md`, pruebas `tests/<proyecto>.test.js`; `sh video/<proyecto>/build.sh [nombres…]`, unos 13 min por video): `potencia-cosmos` (Exponentes y Radicales: `potencias`, `leyes`, `raices`, `radicales`), `sigma-cosmos` (Sucesiones y Series: `sucesiones`, `sumaarit`, `geometricas`, `sumageo`, `sumatoria`), `polinomio-cosmos` (`polinomios`, `notables`, `binomio`, `factorizacion`), `parabola-cosmos` (`complejos`, `lineales`, `parabola`, `cuadraticas`), `ceros-cosmos` (`division`, `residuo`, `ceros`), `fraccion-cosmos` (`dominio` `alg-25a`, `operaciones` `alg-25b`, `sistemas` `alg-101`, `parciales` `alg-102`) y `expo-cosmos` (`exponencial` `alg-71` «El reloj del carbono», `interes` `alg-13b` «El testamento de Franklin», `logaritmos` `alg-72` «Las tablas de Napier», `ecuaciones` `alg-73` «El hombre del hielo»; su `kit.js` añade en `F` los tipos `sb` subíndice y `sp`/`spi` exponente). Cada uno de 4 a 5 min con historia real, ejemplos que no salen en los ejercicios y cierre que vuelve al principio. Entregas (mp4 1080 + `.srt`) en `Downloads/Zuka_Exponentes_Radicales`, `Zuka_Sucesiones_Series`, `Zuka_Polinomios`, `Zuka_Parabolas_Complejos`, `Zuka_Raices_Polinomios`, `Zuka_Fracciones_Algebraicas` y `Zuka_Crecimiento_Exponencial`; esperan su ID de Bunny: al recibirlo, poner `clip.bunny` + `duration` y las `scenes` de respaldo con los ejemplos del video.
- **La Recta Real (mundo 2 de Álgebra) en estilo «showreel» (2026-11-17)**: proyecto `video/recta-cosmos` (motor `kit.js` de conjunto-cosmos + `recta.js`; `index.html?f=<nombre>` carga `films/<nombre>.data.js` y `films/<nombre>.js`; `sh video/recta-cosmos/build.sh [nombres…]`, 60 fps, unos 10 min cada uno; `FACTS.md`; pruebas `tests/recta-cosmos.test.js`). Seis películas de 282–290 s, cada una con historia real y analogías: `naturales` (`alg-11`, «La deuda de Brahmagupta»: Ishango, 628, cuenta de banco, sin año cero), `racionales` (`alg-11b`, «La cuerda de Pitágoras»: monocordio, papiro Rhind, 1/7), `reales` (`alg-11c`, «El secreto de la hoja A4»: √2, Hipaso, girasol), `campo` (`alg-12b`, «Las reglas del juego»: Euclides, zoom de una foto, el 0 sin recíproco), `consecuencias` (`alg-12c`, «El barco que dividió entre cero»: USS Yorktown 1997, a·0 = 0 y signos demostrados) y `orden` (`alg-12d`, «Los signos de Harriot»: termómetros, deudas, tolerancia 50 ± 0.2 mm). Entregados en `Downloads/Zuka_Recta_Real` (mp4 1080 + `.srt`); esperan su ID de Bunny: al recibirlo, poner `clip.bunny` + `duration` y las `scenes` de respaldo con los ejemplos del video.
- **Video de `alg-0a` en estilo «showreel matemático»: «El día que Plutón cambió de conjunto»** (`video/conjunto-cosmos`, 298 s, 1080×1920 a **60 fps**, sin voz; `sh video/conjunto-cosmos/build.sh`, unos 10 min; pruebas `tests/conjunto-cosmos.test.js`, datos en `FACTS.md`). Lo pidió el usuario el 2026-11-27 con un video suyo de referencia y es **el modelo que prefiere ahora**: cada cuadro es función pura de `t` (canvas 2D), fondo azul casi negro con viñeta, trazos neón de **varios colores**, fórmulas y títulos en letra de KaTeX, etiquetas monoespaciadas con valores en vivo, HUD fijo (ZUKA, contador «01 / 10», reloj `t = …`, barra de avance y la fórmula de la escena) y música sintetizada con numpy (`mix.py`: base grave, pulso cada 0.25 s, otra textura en cada corte, notas que suben al cierre). Pide **no repetir la estructura de los videos anteriores**: historia al inicio, ejemplos de la naturaleza y un cierre que vuelve al principio (aquí: Praga 2006 y Plutón, Eris, Peano 1889, la Vía Láctea, el ADN). Entregado en `Downloads/Zuka_Conjuntos_Pluton` (solo 1080 y `.srt`). **Ya está en Bunny y es el video de `alg-0a`** (`70757aa9-…`, corte con audio de 212.5 s que subió el usuario; respaldo con los planetas, Plutón y el ADN; fila de Supabase al día).
- **Video de `alg-0a` en estilo neón** (`video/conjunto-neon`, 297 s, 1080×1920, sin voz; `sh video/conjunto-neon/build.sh`, unos 6 min; pruebas `tests/conjunto-neon.test.js`). Pedido del usuario el 2026-11-27 como **modelo de los videos del curso de Álgebra**: fondo negro, **sin cuadrícula**, trazos finos que brillan, solo blanco + el morado del curso (`#B18CFF`) + un rosa que combina (`#FF6FB5`, para lo que no pertenece), **letra fina** (Jost 300–340 en rótulos, fuentes de KaTeX en fórmulas, como su video de referencia), 4 a 5 minutos, cada concepto y notación explicados. Usa el guion (`data.js`) de `video/conjunto-lamina` y corre un 3.5 % más rápido (`K` en `index.html`) para no pasar de 5 min. **Solo se entrega el mp4 en 1080 y el `.srt`** (nada en 720). Entregado en `Downloads/Zuka_Conjuntos_neon`; espera su ID de Bunny (al recibirlo: `clip.bunny` + `duration` de `alg-0a`).
- **Video de `alg-0a` en «modelo lámina»** (`video/conjunto-lamina`, 308 s, 30 fps, sin voz; `sh video/conjunto-lamina/build.sh`, unos
  12 min; pruebas `tests/conjunto-lamina.test.js`; diseño en su `TREATMENT.md`). Lo pidió el usuario después de la versión estudio: videos
  **consecuentes con la lámina del mundo** (`plate` de `js/worlds.js`: tinta teñida con el color del mundo, retícula, trazo blanco, un
  solo acento, cursiva de libro con borde), **rigor matemático**, animación sencilla, lenguaje llano con intuición, y **cada concepto y
  cada notación explicados aunque dure 4 o 5 minutos**. Pantalla en tres franjas: rótulo arriba, diagrama en el centro (el mismo V de las
  vocales casi todo el video), escritura formal abajo. 13 escenas con tiempos relativos en `data.js`. Entregado en
  `Downloads/Zuka_Conjuntos_lamina`. Está en Bunny (`2c656c56-…`, corte corto con audio de 249.4 s) y fue el video de `alg-0a` hasta que lo reemplazó el de Plutón. **El usuario eligió este modelo para los videos de sus cursos** (2026-11-17; descartó la
  versión estudio). Aún no ha pedido rehacer las demás lecciones: esperar a que lo diga. Al hacerlas: otro mundo = su color de acento y su diagrama; al recibir el ID de Bunny, cambiar `clip.bunny` +
  `duration` de `alg-0a` y sus `scenes` de respaldo (vocales, «salsa»).
- **Serie lámina de Álgebra (en curso, pedida por el usuario el 2026-11-17): un video por lección de todos los mundos, ~5 min,**
  en el modelo lámina que el usuario eligió. Motor común `video/lamina/` (`kit.js` dibujo y mini-TeX propio: `\frac`, `\sqrt`, `^{}`,
  `_{}`, `\bar`, `\op{Σ}{…}{…}`, `\hl` acento, `\no` negación, `\s{n}` aparición, `\id{…}` cajas; `timeline.js` pone portada desde la
  lámina del mundo y resumen; `plates.js` copia las láminas con `node video/lamina/tools/plates.js`; `films/<nombre>.js` = `FILM` con
  escenas `{ id, name, dur, caps, narr, ev, draw(t) }`). Fórmulas y rótulos con barras SIEMPRE en `R\`…\`` (una barra en '…' se
  come la letra: `python video/lamina/tools/rawify.py` lo arregla). Antes de renderizar: `node video/lamina/tools/check.js <película>`
  (ritmo ≤ 3.25 palabras/s, rótulos ≤ 31 letras y legibles) y `node --test tests/lamina.test.js` (lección, mundo, número, siguiente,
  ejemplos que no salen en los ejercicios: `node video/lamina/tools/lesson.js <id>` los muestra). Render: `sh video/lamina/build.sh
  <películas…>` (copia congelada, 3 reintentos, ~11 min por video; deja `out/<nombre>/`); no correr capturas pesadas a la vez.
  **Escritas las 42 películas** (todas las lecciones de Álgebra menos `alg-0a`, que tiene `video/conjunto-lamina`; la prueba lo
  exige): de `tipos` a `ecuaciones`, un archivo por lección en `films/`. `\log` y `\ln` van en letra de libro; los rótulos miden su
  alto (una fracción en el primer renglón baja el segundo). Cola de render: `out/cola.txt` (un `build_<nombre>.txt` por video).
  Entrega en `Downloads/Zuka_Lamina_<mundo>`; al recibir los ID de Bunny, poner
  `clip.bunny` + `duration` y cambiar las `scenes` de respaldo a los ejemplos del video.
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
  no salen en los ejercicios. **Ya están en Bunny y puestos en las lecciones** (130–131 s), con las escenas de respaldo
  al día y sin la parte 2 vieja de `alg-21b`.
- **Escalera de Sigma en zoom, lecciones 1 a 5** (mismo proyecto `video/valle-zoom`; tokens `{big: 'sum'|'prod', hi, lo}` para Σ y Π
  y `{sub}` para subíndices): `sucesiones` (`alg-14`), `sumaarit` (`alg-14b`), `geometricas` (`alg-14c`, ya tiene video en Bunny:
  el usuario elige), `sumageo` (`alg-14d`), `sumatoria` (`alg-15`), 130 s. Usan los ejemplos de las escenas de respaldo más
  algunos nuevos; `tests/sigma-zoom.test.js`. **Ya están en Bunny y puestos en las lecciones** (130 s cada uno; el de `alg-14c` reemplazó al video viejo P3).
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
- **Cordillera Cúbica en zoom, lecciones 1 a 3** (mismo proyecto `video/valle-zoom`; cordillera `ridge`, vía `rail` y escala
  vertical `M.sy` en `valle.js`): `division` (`alg-23b`), `residuo` (`alg-92`), `ceros` (`alg-93`), 130 s. Hilo: la
  cordillera de Ana P(x) = x³ − 2x² − 5x + 6 con la vía a altura 0 (Beto apuesta por un cruce en 2; la de Caro,
  x³ − 3x² + 4x − 2, esconde 1 ± i). Ejemplos nuevos; `tests/cubica-zoom.test.js`. Entregados en
  `Downloads/Zuka_Cordillera_zoom`; esperan su ID de Bunny (al recibirlos, poner las escenas de respaldo con los ejemplos
  del video). `alg-92` y `alg-93` aún tienen ejercicios de opción múltiple y sin pistas.
- **Río de las Asíntotas en zoom, lecciones 1 a 4** (mismo proyecto `video/valle-zoom`; río vertical `river` y hueco `hole`
  en `valle.js`): `dominio` (`alg-25a`), `fracciones` (`alg-25b`), `sistemas` (`alg-101`), `parciales` (`alg-102`), 130 s.
  Hilo: el río (asíntota): el sendero de Beto, el estanque de Ana y Beto, el bote de Caro y la curva de dos ríos.
  Ejemplos nuevos; `tests/asintotas-zoom.test.js`. Entregados en `Downloads/Zuka_Rio_zoom`; esperan su ID de Bunny. Al
  recibirlos, cambiar las escenas de respaldo (las de `alg-25a` y `alg-25b` repiten hoy los ejercicios) por los ejemplos
  del video. Estas lecciones aún tienen ejercicios de opción múltiple y sin pistas.
- **Selva Exponencial en zoom, lecciones 1 a 4** (mismo proyecto `video/valle-zoom`; laguna `lagoon` y lirios `pad` en
  `valle.js`): `lirios` (`alg-71`), `interes` (`alg-13b`), `logaritmos` (`alg-72`), `ecuaciones` (`alg-73`), 130 s. Hilos:
  la laguna de Caro (lirios que se duplican) y los ahorros de Beto (2 000 000 al 6 % anual). Ejemplos nuevos;
  `tests/exponencial-zoom.test.js`. Entregados en `Downloads/Zuka_Selva_zoom`; esperan su ID de Bunny (al recibirlos, poner
  las escenas de respaldo con los ejemplos del video). `alg-13b` y `alg-73` ya tienen otros videos sin ID (A5 y Clase 13):
  el usuario elige. `alg-71` y `alg-72` aún tienen ejercicios de opción múltiple y sin pistas.
- **Video de bienvenida al curso de Álgebra** (`video/valle-zoom/films/intro.js`, 108 s, mismo motor zoom con capturas
  reales de la app en un celular; capturas con `node video/valle-zoom/tools/capture-intro.mjs` y la app servida en el puerto
  5191; `FILM.preload` en `index.html`; `tests/intro-algebra.test.js`): recorrido, diez mundos, un mundo con PDF, jefe y
  evaluación, video y juegos de una lección, pista, Clips y progreso. Entregado en `Downloads/Zuka_Bienvenida_algebra`;
  aún no está en la app (espera su ID de Bunny y un lugar donde mostrarlo, p. ej. al abrir el curso por primera vez).
  Si cambia la interfaz, volver a capturar. **Versión video-shotcraft** (la que pidió el usuario, más creativa; Remotion en
  `video/bienvenida`, `npm install` una vez, diseño en `video/bienvenida/DISENO.md`): nueve tomas de las fichas de shotcraft
  adaptadas a vertical (máquina de escribir, foco sobre el recorrido, carrusel 3D de los 10 mundos, grúa por la Pradera,
  escaneo del PDF, pila de pantallas, escaneo del ejercicio con el acierto real, celular de Clips, foto de grupo), 60 s, música
  «House Vibez» (Mixkit). Capturas: `node video/bienvenida/tools/capture.mjs` y `capture-juego.mjs` (app en el puerto 5191);
  render: `node video/bienvenida/tools/render.mjs` (por tramos; el CLI de Remotion se traba cargando la letra). Sin efectos
  de sonido: Freesound no estuvo disponible sin red. Entregado en `Downloads/Zuka_Bienvenida_algebra` (`…_shotcraft.mp4`).
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
- **Trigonometría completa en zoom** (estilo Scale Zoom Explainer, proyecto `video/trig-zoom`, motor de `valle-zoom` + `trig.js`;
  Noto Sans solo para θ α β ω y superíndices; spec `2026-11-15-trig-zoom`, tratamiento `video/trig-zoom/TREATMENT.md`,
  pruebas `tests/trig-zoom.test.js`). Un video por lección (130 s, sin nombres de personas: rueda, reloj, cometa, faros,
  noria, nave…): `grados` `arco` `soh` `notables` `seis` `unitaria` `signos` `amplitud` `periodo` (Mar de las Ondas),
  `inversas` `identidades` `demostrar` `suma` `doble` `ecuaciones` `senos` `cosenos` (Faro de los Ángulos), `polar`
  `demoivre` `raices` (Galaxia Polar; `raices` es el video de la lección `trig-153`). `sh video/trig-zoom/build.sh
  [nombre …]` (unos 3 min cada uno; **no correr capturas de navegador a la vez**: se cuelga), `check.sh` (ritmo y lectura)
  y `sheet.sh` (hoja de contacto). Entregados en `Downloads/Zuka_Trig_zoom`; esperan su ID de Bunny: al recibirlo, poner
  `clip.bunny` + `duration` y cambiar las escenas de respaldo por los ejemplos del video. Reemplazan a T1–T20 (manimgl).
- Trigonometría unidad 1: T1–T9 (`trig-41a`, `trig-41b`, `trig-1`, `trig-2`, `trig-42c`, `trig-3`,
  `trig-43b`, `trig-44a`, `trig-44b`).
- Trigonometría unidad 2: T10–T17 (`trig-45`, `trig-4`, `trig-47b`, `trig-48a`, `trig-48b`, `trig-49`,
  `trig-46a`, `trig-46b`). En estas clases `zoom_to` (en su `mb_common.py`) no deja que el objetivo se salga
  por los lados y desvanece el encabezado mientras dura el zoom.
- Trigonometría unidad 3: T18 (`trig-151`), T19 (`trig-152`) y T20 (raíces, hoy lección `trig-153`, solo con escenas).
- Cálculo: faltan lecciones de su cronograma (ver spec `2026-11-07-cronograma-algebra-calculo`).
- El resto de Álgebra aún tiene ejercicios de opción múltiple y
  sin pistas.
