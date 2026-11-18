# Contexto de la aplicación · Zuka

Documento para un agente (o una persona) que llega nuevo al proyecto. Explica qué es Zuka, cómo está armada y, sobre
todo, **cómo se construye con código todo el contenido**: lecciones, juegos y videos. Al final hay una lista de mejoras
posibles. Las reglas de trabajo del día a día y el inventario completo están en `CLAUDE.md`; los diseños de cada pieza,
en `docs/superpowers/specs/`. Si este documento y `CLAUDE.md` no coinciden, manda `CLAUDE.md`.

Fecha: 2026-11-18.

---

## 1. Qué es Zuka

- **App web progresiva (PWA) para aprender matemáticas en español**, pensada para celular (300–380 px de ancho) y
  usable en escritorio. Público: estudiantes de 17 años en adelante (primer año de universidad y aspirantes al examen
  de admisión de la UdeA). No debe verse infantil.
- **Una lección = un video corto + 7 u 8 ejercicios**, casi todos minijuegos gráficos en los que se arrastra o se
  ajusta algo y la escena reacciona en vivo.
- **Sin frameworks**: HTML, CSS y JavaScript a mano; p5.js para los juegos, KaTeX para las fórmulas, anime.js para
  pequeñas animaciones. No se usa React, ni three.js, ni un empaquetador. No hay paso de compilación.
- Repositorio `github.com/CarlosHurtado2024/zuka_app`, rama `main`. **Vercel publica cada push.**
- Servicios externos: **Supabase** (cuentas, planes, códigos de pago, progreso, catálogo de lecciones) y **Bunny**
  (alojamiento de los videos en HLS).
- Fuente del contenido: el *Manual de Álgebra y Trigonometría* de la UdeA (Zarrazola, 2024), los cronogramas 2026-2 y
  el temario `Contenidos_Preuniversitario_UdeA_Zuka.pdf`.

### Cursos

| Curso | Archivo | Estado |
|---|---|---|
| Álgebra (10 mundos, 43 lecciones) | `js/courses/algebra.js`, `mundos-altos.js` | el más completo: juegos, evaluaciones, resúmenes PDF; los diez mundos rehechos sin juegos repetidos ni jefes; evaluación completa por mundo |
| Trigonometría (3 mundos, 20 lecciones) | `js/courses/trig.js`, `trig-juegos.js` | juegos y jefes; faltan evaluaciones |
| Cálculo Diferencial (5 mundos, 15 lecciones) | `js/courses/calculo.js` | parcial |
| Preuniversitario UdeA (2 componentes, 28 mundos, 90 lecciones) | `js/courses/preuda*.js` | en borrador; en construcción mundo por mundo |
| Geometría (6 mundos, 23 lecciones), Física, Integral, Lineal | `js/data.js` | esqueleto |

---

## 2. Arquitectura

```
index.html            página única; carga todos los scripts con <script defer>
css/styles.css        estilos; variables de tema en :root y :root[data-theme="light"]
sw.js                 service worker: VERSION ('zuka-vNN') y lista SHELL de archivos
js/app.js             estado S, pestañas, mapa de mundos, startLesson, tema
js/content.js         ayudantes para escribir lecciones: sc, mc, num, play…, BUNNY_CDN
js/exercises.js       tipos de ejercicio y renderExercise; botón «Ver pista»
js/player.js          reproductor de clips (Bunny HLS o escenas animadas de respaldo)
js/courses/*.js       los cursos: puros datos
js/worlds.js          mundos del mapa: nombre y lámina SVG; lista de resúmenes PDF
js/games/kit.js       motor común de los juegos
js/games/*.js         un archivo por juego (unos 240)
js/guia.js            «Cómo se juega»
js/exam.js            evaluaciones de fin de mundo
js/acceso.js, cuenta.js   planes, candados, sesión y progreso en la nube
js/curiosidades.js    pestaña Clips (videos cortos de curiosidades)
js/tutorias.js        pestaña Tutorías
admin/                panel de administración (/admin)
supabase/             migraciones SQL y función que firma enlaces de video
tests/                pruebas con node --test (≈1450) y robots para el navegador
video/                un proyecto por video o serie de videos
tools/                generadores (marca, sincronizar lecciones)
docs/                 specs, resúmenes en LaTeX, guía de storytelling
```

Ideas clave:

- **Todo el contenido es datos en JavaScript.** Un curso es un objeto con unidades (mundos) y lecciones. Añadir una
  lección es escribir un objeto; no hay base de datos de contenido ni editor.
- **Estado local** en `S` (se guarda en `localStorage`); con cuenta, el progreso se copia a Supabase.
- **Dos temas** (oscuro y claro) con variables CSS; los juegos leen su paleta al dibujar, así se repintan solos.
- **Sin conexión**: el service worker guarda la lista `SHELL`. Cada cambio de contenido o de juegos exige subir
  `VERSION` en `sw.js`.

---

## 3. Cómo se escribe una lección

```js
{
  id: 'alg-11', title: '…',
  clip: { bunny: '<id de Bunny>', duration: 462,
          scenes: [sc(5, 'texto con $\\KaTeX$', { title: '…' })] },   // escenas = respaldo si el video no carga
  ex: [
    play('nombre-juego', 'Enunciado', { /* parámetros del juego */ }, 'Explicación', { hint: 'Pista' }),
  ],
}
```

- `play(juego, enunciado, params, explicación, { hint })` es hoy el único tipo que se usa en lecciones nuevas. Existen
  `mc` (opción múltiple) y `num` (teclear), pero **el usuario no los quiere**: los `num` viejos se cambian solos al
  cargar (`js/courses/sin-escribir.js`).
- Fórmulas con KaTeX entre `$…$`; dentro de cadenas JS la barra va doble (`'$\\tfrac{1}{2}$'`).
- Cada ejercicio lleva **pista** (orienta sin dar la respuesta) y **explicación** (se muestra al comprobar).
- Los ejemplos del video **no se repiten** en los ejercicios.
- Estructuras alrededor de la lección: **evaluación** del mundo (`unit.exam`, con
  cronómetro e informe) y **resumen en PDF** (LaTeX en `docs/resumenes/tex/` → `media/resumenes/`).

### Estándar actual por lección (pedido del usuario)

1. 7 u 8 ejercicios, **todos con juegos distintos** (ninguno repetido dentro de la lección).
2. Juegos **gráficos y de manipulación directa**: se arrastra, se gira, se desliza. Nada de filas de botones − / + /
   Listo como mecánica principal, ni tarjetas, ni escoger entre opciones. Modelos: `limonada`, `balanza-proporcion`.
3. El último ejercicio es un **juego en movimiento** (algo vuela, rueda o rebota).
4. **Entender, no mecanizar**: sin prisa ni reflejos; si algo avanza solo, espera. Las cuentas las hace y las muestra
   el juego; el estudiante compara, construye o ajusta.
5. Las instrucciones van **sobre el juego**: una mano hace el gesto en el lugar real del lienzo.

---

## 4. Cómo se construyen los juegos

Todos están hechos con código sobre un `<canvas>` de p5.js. No hay imágenes ni sprites: cada figura se dibuja con
primitivas (líneas, arcos, rectángulos, texto).

### Contrato

```js
GAMES['nombre'] = {
  grade(state, params) → { ok, solution },          // función pura: se prueba en Node sin navegador
  create(host, params, api) → { loaded, getState, lock, destroy, peek, demo },
};
```

- `params` vienen de la lección (las rondas y sus datos); `state` es lo que el estudiante dejó.
- `api.palette` da los colores del tema y del curso; `api.ready(true)` habilita «Comprobar».
- `lock()` congela el juego y muestra la solución.

### Armazones (al final de `js/games/kit.js`)

Casi ningún juego escribe ese contrato a mano. Usa uno de tres armazones y solo aporta su lógica y su dibujo:

| Armazón | Para qué | El juego aporta |
|---|---|---|
| `roundsGame(def)` | juegos por rondas con pestañas, sin vidas | `init, ok, solution, prompt, foot, layout, draw, press, drag, release, demo, peek` |
| `questGame(def)` | juegos de acción sin prisa: rondas de retos, tres vidas, cartel, pausa al acertar | lo mismo más `answer`, y llama `G.good()` / `G.bad()` |
| `makeArcade` | juegos de movimiento más antiguos | fases, vidas, cola de preguntas |

Ejemplo mínimo (resumido de `js/games/escalera-pared.js`):

```js
GAMES['escalera-pared'] = roundsGame({
  aspect: 1.4,
  init: r => ({ d: 1 }),                                   // estado de una ronda
  ok: (s, r) => s.d === Math.sqrt(r.L * r.L - r.h * r.h),  // ¿está bien?
  prompt: r => `La escalera mide ${r.L} m. Llévala hasta la ventana, a ${r.h} m`,
  draw(G) { /* dibuja con G.p (p5), colores G.C, estado G.s, ronda G.r */ },
  press(G, x, y) { /* devuelve true si agarró algo */ },
  drag(G, x, y) { /* cambia G.s y llama G.touch() */ },
  demo: G => ({ from: {x, y}, to: {x, y}, text: 'Arrastra el pie de la escalera' }),
});
```

### Piezas de dibujo

- En `kit.js`: `drawTile` (ficha), `drawPill`, `drawDot`, `drawNumLine`, `drawBanner`, `drawHearts`, `shade`,
  `inkOn(color)` (tinta legible sobre un relleno), `fxTween` (animar), `TK` (rótulos, `glide` para movimiento suave).
- **Un kit de dibujo por mundo**, con el motivo de su lámina: `conjuntos-kit.js` (`SK`: membranas, píldoras, zonas de
  Venn) y `geo-kit.js` (`GEO`: sectores de ángulos, rectas, manijas).
- `js/games/formula.js` dibuja TeX dentro del lienzo (fracciones apiladas, exponentes, raíces).

### Reglas que todo juego debe cumplir

- Colores siempre de la paleta (`C.ink, C.mute, C.line, C.card, C.sky, C.coral, C.mint, C.sun, C.ok, C.bad…`),
  leídos al dibujar. Nada de colores fijos. El amarillo `C.sun` nunca como color de letra.
- Verse bien en tema claro y oscuro y a 300 px de ancho; el ejercicio completo cabe en una pantalla.
- `mousePressed` devuelve `false`/`true` correctamente: sobre el lienzo también se puede desplazar la página.
- Saltos del arrastre «redondos» (5°, 1 unidad, medios) para que toda ronda tenga solución alcanzable con el dedo.
- Registrarlo en `index.html` y en `SHELL` de `sw.js`, darle entrada en `GUIDES` (`js/guia.js`) y `demo`.

### Proceso para un juego nuevo

Diseñar (spec en `docs/superpowers/specs/`) → **pruebas primero** (`tests/*.test.js`: lógica pura y datos de la
lección) → programar → probar en el navegador con arrastres simulados → robots de calidad → revisión fresca por otro
agente → corregir → subir.

Robots (se cargan en la página con `fetch` + `eval`): `tests/robot-colores.js` (textos sin contraste),
`tests/robot-encimados.js` (textos que se pisan o se salen), `tests/robot-trig.js` y `robot-torres.js` (juegan solos con
`peek()`).

---

## 5. Cómo se construyen los videos

**Ningún video se graba ni se edita a mano: todos se generan con código.** Formato vertical 1080×1920. No llevan voz
(se deja sitio en la mezcla); el texto en pantalla y un `.srt` cuentan la historia. El usuario sube los mp4 a Bunny y
entrega el ID; **las claves de Bunny nunca están en el repositorio ni en la sesión**.

### Motor actual: «showreel» en canvas 2D (el que prefiere el usuario)

Carpeta modelo: `video/conjunto-cosmos`, y un proyecto por mundo (`recta-cosmos`, `escala-cosmos`, `potencia-cosmos`,
`sigma-cosmos`, `polinomio-cosmos`, `parabola-cosmos`, `ceros-cosmos`, `fraccion-cosmos`, `expo-cosmos`,
`preuda-cosmos`).

- **Cada cuadro es una función pura del tiempo `t`.** Una página HTML dibuja en un `<canvas>`; no hay estado
  acumulado, así cualquier cuadro se puede renderizar solo.
- Archivos de un proyecto:
  - `kit.js`: motor (letras `T` y fórmulas `F` con tipografía de KaTeX, trazos que se dibujan, HUD, `film`).
  - `<mundo>.js`: piezas de dibujo del mundo (barras, ejes, curvas, cuadrículas…).
  - `films/<nombre>.json` → `.data.js`: el guion (escenas, duraciones, rótulos, narración).
  - `films/<nombre>.js`: una función de dibujo por escena.
  - `FACTS.md`: cada dato histórico con su respaldo. `build.sh`: construye.
- **Render**: un navegador sin ventana (Playwright, herramientas de la biblioteca `lemo-opuscar`) abre la página, fija
  `t` cuadro a cuadro a 60 fps, guarda las imágenes y `ffmpeg` las une. Unos 10–13 min por video.
- **Sonido**: `mix.py` sintetiza la música con numpy (base grave, pulso, una textura por escena) y escribe el `.srt`.
- **Estilo**: fondo azul casi negro con viñeta, trazos neón de varios colores, fórmulas en letra de libro, etiquetas
  monoespaciadas con valores en vivo. 4 a 5 minutos.
- **Estructura narrativa** (`docs/storytelling-videos.md`): una historia real al inicio, una sorpresa anunciada,
  intuición primero y fórmula después, ejemplos resueltos con detalle, sin preguntas al espectador, y un cierre que
  vuelve al principio. Para el Preuniversitario: sin dato histórico obligatorio, **sin reloj ni barra abajo**, franja
  lima propia.
- Revisión: hoja de contacto con `ffmpeg` (`fps=1/4,scale=150:-1,tile=8x5`), comprobación de ritmo de lectura y
  pruebas (`tests/<proyecto>.test.js`) que verifican guion, duración y la matemática de los ejemplos.

### Otros motores que siguen en el repositorio

| Motor | Dónde | Qué es |
|---|---|---|
| manimgl 1.7.2 (Python) | `video/clase_*`, `.venv-gl` | los primeros videos: escenas en Python con plantilla `MBScene` |
| Zoom continuo (SVG) | `video/valle-zoom`, `trig-zoom`, `conjunto-zoom*` | un solo zoom por niveles; 130 s por lección |
| Lámina | `video/lamina`, `conjunto-lamina` | tres franjas: rótulo, diagrama, escritura formal; mini-TeX propio |
| Lápiz | `video/valle-sketch` | trazo a lápiz sobre papel |
| Remotion (React, fuera del PWA) | `video/bienvenida` | video promocional con capturas reales de la app |
| three.js / estilos de lemo-opuscar | `video/arroz-ajedrez`, `curva-corta`, `razon-deco`, `ia-algebra`… | clips de curiosidades, cada uno con su estilo |

### Del video a la app

1. `sh video/<proyecto>/build.sh <nombre>` → mp4 + `.srt` en `out/`.
2. Se copia a `Downloads/Zuka_<mundo>` y el usuario lo sube a Bunny (biblioteca 811556).
3. Con el ID: poner `clip.bunny` y `duration` en la lección, actualizar las `scenes` de respaldo con los ejemplos del
   video, correr `node tools/sync-lecciones.js` y aplicar el SQL en Supabase.

---

## 6. Cuentas, planes y servidor

- Supabase guarda `perfiles`, `planes`, `codigos`, `progreso`, `lecciones`. El estudiante paga por Nequi y canjea un
  código de un solo uso.
- `js/acceso.js` es la lógica pura de candados: primera lección de cada curso y clips gratis; videos en plan Básico;
  resúmenes y evaluaciones en Medio; tutorías en Pro. En `localhost` no hay candados (con `?candados` sí).
- La función `supabase/functions/video-url` firma los enlaces de los videos de la biblioteca vieja de Bunny.
- Un curso nuevo nace **sin publicar** hasta su revisión docente.

---

## 7. Pruebas y calidad

- `node --test tests/` (≈1450 pruebas). `tests/load.js` carga los scripts del navegador en un `vm` de Node.
- Tipos de prueba: lógica pura de cada juego; contenido por unidad (cada ronda con solución alcanzable, pista que no
  regala la respuesta, ejemplos del video no repetidos); registro (todo juego en `index.html` y `sw.js`); interfaz y
  tema; guiones de video.
- Navegador: servidor de vista previa `python -m http.server 5173`; se abre un ejercicio suelto con `startLesson` y se
  simulan toques y arrastres.

---

## 8. Cómo trabaja el usuario (respetar)

- Responder en **español**. **No hacer preguntas**: decidir con criterio y avanzar.
- Subir a `main` automáticamente, salvo lo que él diga expresamente que se queda en local.
- Juegos creativos y originales, muy gráficos; videos que no se vean infantiles.
- Todo en tema claro y oscuro y en celular.
- Proceso: spec → pruebas → implementar → navegador → revisión fresca → corregir → subir.

---

## 9. Estado y pendientes

- **Preuniversitario UdeA**: hechos el mundo 1 (Cálculo Mental) y las lecciones 1 y 2 de Geometría con el estándar
  nuevo. Faltan el resto de Geometría, los mundos 3 a 16 de razonamiento lógico y Comprensión lectora; y los videos
  (solo existe `enteros`).
- **Álgebra y Trigonometría**: hay que llevar todas las lecciones al estándar de 7–8 juegos distintos con uno en
  movimiento al final, y quitar `escala-solucion`, `arma-la-cuenta`, `une-parejas`, `clasifica-cartas` y
  `ordena-terminos`.
- **Videos**: muchos están entregados y esperan su ID de Bunny (lista en `CLAUDE.md`, sección «Pendiente»).
- **Instrucciones sobre el juego**: solo los juegos nuevos tienen `demo`; los viejos conservan su tarjeta emergente.
- Faltan evaluaciones de Trigonometría y evaluaciones y resúmenes de los demás cursos.
- **Álgebra sin jefes** (2026-11-18): los retos del jefe pasaron a la evaluación. La práctica se revisa mundo por mundo para
  quitar los motores genéricos `taller-*` y los juegos repetidos (spec `2026-11-18-algebra-revision`); hecho el mundo 1.
- Hay cambios de accesibilidad (foco y teclado) hechos **solo en local**, sin subir, hasta que el usuario lo diga.

---

## 10. Dónde se puede mejorar

Ideas para quien llegue con ojos frescos. Ninguna está decidida; conviene proponerlas antes de hacerlas.

**Juegos**
- Unificar los tres armazones (`roundsGame`, `questGame`, `makeArcade`) en uno, y migrar los juegos escritos a mano.
- `kit.js` es un archivo muy grande: partirlo en módulos (paleta, dibujo, armazones, efectos).
- Dar `demo` (mano sobre el lienzo) a los juegos antiguos y retirar las tarjetas de `GUIDES`.
- Un robot único que juegue **todos** los juegos con `peek()` en cada commit (hoy hay varios, uno por mundo, y se
  corren a mano en el navegador). Podría correr con Playwright en integración continua.
- Accesibilidad: los juegos son solo táctiles; no tienen alternativa de teclado ni descripción para lector de pantalla.
- Sonido y vibración: hay efectos mínimos; faltan en la mayoría de los juegos nuevos.

**Contenido**
- Las lecciones son objetos largos en una sola línea: difíciles de revisar. Un formato por lección (un archivo o JSON
  validado con esquema) facilitaría la revisión docente.
- Dificultad adaptable: hoy todas las rondas son fijas; se podrían generar rondas con semilla y graduar según aciertos.
- Repaso espaciado con los ejercicios fallados.

**Videos**
- Cada proyecto de mundo lleva su copia de `kit.js`: un arreglo hay que repetirlo en diez carpetas. Convendría un
  motor compartido con versión.
- El render es secuencial y lento (10–13 min por video); se puede repartir por tramos en paralelo y unir con `ffmpeg`.
- No hay voz: una narración sintetizada o grabada, sincronizada con el `.srt`, es el siguiente paso natural.
- Varias generaciones de videos conviven (manimgl, zoom, lámina, showreel): falta decidir cuáles se archivan.
- La subida a Bunny y la actualización de `clip.bunny`, `duration` y Supabase son manuales: se pueden automatizar con
  un script que lea una lista de ID.

**Aplicación**
- Todos los scripts se cargan al inicio (unos 270 archivos): cargar los juegos y cursos a demanda aceleraría el
  arranque en celulares modestos.
- No hay comprobación de tipos ni linter; `// @ts-check` con JSDoc daría ayuda sin añadir paso de compilación.
- El progreso es local primero: revisar conflictos cuando un estudiante usa dos dispositivos.
- Tutorías sin servidor (quedan en el celular): conectar con Supabase o WhatsApp.
- Medición: no hay analítica de qué ejercicios se fallan más ni dónde se abandona una lección.
