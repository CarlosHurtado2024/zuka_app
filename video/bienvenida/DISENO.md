# Bienvenida a Álgebra · diseño (video-shotcraft, creación autónoma)

## Brief

- **Producto:** Zuka, app de matemáticas en español (PWA para celular). Curso de Álgebra: 10 mundos, cada uno con lecciones
  (video corto + ejercicios que son juegos), jefe final, evaluación y resumen en PDF; pestaña Clips con curiosidades;
  recorrido guiado la primera vez.
- **Uso:** video de bienvenida al abrir el curso de Álgebra. **Público:** estudiante que empieza (primer semestre).
- **Pedido del usuario:** mostrar los mundos, los ejercicios, los clips, los juegos, el recorrido y los PDF descargables;
  dar la bienvenida, motivar y ser muy ilustrativo. Hecho con video-shotcraft (no con el motor de lemo-opuscar).
- **Formato:** vertical 1080 × 1920, 30 fps, ~54 s, sin voz. Música de fondo; versión sin música desde la misma línea de tiempo.

## Decisiones (pedido → ejecución)

| Pedido | Decisión |
|---|---|
| ilustrativo | solo capturas reales de la app (Playwright, celular 390 × 844 a 3x, `tools/capture.mjs`), nada de UI dibujada a mano |
| motivar | gancho de máquina de escribir que se corrige: «El álgebra / es memorizar» → «es un viaje.»; cierre con invitación al Mundo 1 |
| datos | estudiante nuevo sin progreso (datos de ejemplo, la app no tiene cuentas); ningún dato personal |
| sonido | música «House Vibez» (Mixkit, licencia libre). Freesound no estuvo disponible (sin red en la sesión): sin efectos por ahora |
| letra | Jost (letra de los juegos y videos de Zuka; la de la interfaz, Plus Jakarta Sans, no se pudo descargar sin red); Consolas para la máquina de escribir |

## Lenguaje visual (tokens de la app, `css/styles.css :root`)

`LOOKS.zuka` en `src/fx/Look.tsx`: fondo `#0c0f1f` / `#070913`, tarjeta `#171c36`, texto `#eef0ff`, apagado `#a3abd6`,
azul marca `#3d7bff`, oro `#ffc53d` (racha, acentos), verde `#2fd68f`, coral `#ff5a74`. Ritmo «calma y cuidado» (educación):
entradas suaves, sostener lo leído ≥ 1 s, un solo protagonista por toma.

## Función → toma (fichas de video-shotcraft)

| # | Función | Ficha | Demo de referencia | Archivo |
|---|---|---|---|---|
| 1 | gancho / bienvenida | typewriter-moves (A error-retype) | demos/typography/typewriter-moves/TypewriterErrorRetype.tsx | src/shots/S1Gancho.tsx |
| 2 | recorrido guiado | spotlight-hero-card | demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx | src/shots/S2Recorrido.tsx |
| 3 | los 10 mundos | carousel-3d | demos/ui-entrance/carousel-3d/Carousel3D.tsx | src/shots/S3Mundos.tsx |
| 4 | un mundo (camino, jefe, evaluación, PDF) | crane-rise-reveal | demos/opening/crane-rise-reveal/CraneRiseReveal.tsx | src/shots/S4Mundo.tsx |
| 5 | resumen en PDF | scan-bracket-sweep | demos/effects/scan-bracket-sweep/ScanBracketSweep.tsx | src/shots/S5Pdf.tsx |
| 6 | lección: video + juegos | card-stack | demos/ui-entrance/card-stack/CardStack.tsx | src/shots/S6Leccion.tsx |
| 7 | un ejercicio y su pista | scanline-annotate-focus | demos/effects/scanline-annotate-focus/ScanlineAnnotateFocus.tsx | src/shots/S7Pista.tsx |
| 8 | Clips | radial-ripple-phone-chips | demos/effects/radial-ripple-phone-chips/RadialRipplePhoneChips.tsx | src/shots/S8Clips.tsx |
| 9 | cierre: foto de grupo + Mundo 1 | outro-group-photo-launch | demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx | src/shots/S9Cierre.tsx |

Los demos se copiaron a `src/ref/` y se adaptaron a vertical conservando sus tiempos y curvas (resortes, sobrepasos,
velocidades del escaneo, tres velocidades de la máquina de escribir). `PageCam2D` se amplió con `pageW`, `vw`, `vh`.

## Guion (cada toma, sin transiciones de efecto: corte sobre movimiento)

| # | Duración | Qué se ve |
|---|---|---|
| 1 | 177f | mascota + «Bienvenido a Zuka · Curso de Álgebra»; «El álgebra / es memorizar» → duda → borra → «es un viaje.» con marcador dorado; «Aquí se juega, se explora y se entiende.» |
| 2 | 172f | la app a oscuras; un foco busca y se fija en la tarjeta «¡Hola! Soy Zuka» del recorrido; la tarjeta se eleva, dos vueltas de luz dorada; nota en 3D «Un recorrido guiado / te muestra todo.» |
| 3 | 300f | «TU RUTA · 10 mundos, un camino.»; anillo 3D con el arte real de los 10 mundos, uno al frente por paso, con su nombre abajo |
| 4 | 195f | grúa desde el nivel 1 («EMPIEZA») de la Pradera hasta la página entera; rótulos: Mundo 1 · un camino de niveles; Jefe final · se vence pensando; Evaluación · te dice qué repasar (el PDF lo cuenta la toma 5) |
| 5 | 165f | «RESUMEN EN PDF · Uno por cada mundo»; página real del PDF con escuadras y escaneo; fichas teoría · ejemplos · taller de 10 ejercicios |
| 6 | 175f | «CADA NIVEL»; nueve pantallas reales (el video y ocho juegos) caen en pila y se abren en abanico; sale el video; «Un video corto y juegos.» «Primero la idea; luego la juegas, sin prisa.» |
| 7 | 215f | «CADA EJERCICIO con su pista»; escaneo del juego de Venn con rótulos fuera del celular (RETO · pinta B − A, PISTA · te orienta, JUEGO · tocas zonas, LISTO · y compruebas); luego un toque pinta B − A, otro toca «Comprobar» y sale el «¡Correcto!» real con confeti |
| 8 | 180f | «PESTAÑA CLIPS · Datos curiosos»; celular con el feed real (cuatro curiosidades) entre anillos; barra de chips fija y los videos pegados uno tras otro; fichas «Mate y ciencia» (arriba) y «Me gusta» (abajo); «Una idea, un clip.» |
| 9 | 165f | piezas reales vuelan alrededor de la marca «Zuka» (mascota); «Tu viaje empieza en la Pradera de Venn», con destello dorado y un leve empuje de la marca |

## Revisión final independiente (etapa 7) y cambios

Un subagente sin contexto revisó el corte 1 (`out/qa/final/`). Se corrigió: rótulos de la toma 7 que tapaban la app (ahora en
una columna a la derecha con línea guía), juegos sin acción (capturas reales del juego pintado y del acierto, `tools/capture-juego.mjs`),
feed de Clips con barras repetidas, marca del cierre encimada con las piezas y sin pico de energía, mundos que pasaban a 0.55 s
(ahora 1 s por paso), duda de «memorizar» corta, marcador largo, parche de la tarjeta del recorrido que parecía duplicado,
rótulos de la grúa pequeños, PDF repetido, «gráficas» sin gráficas y «Un minuto, una idea» (los clips duran más).

Render: `node tools/render.mjs` (API de Remotion por tramos de 270 cuadros con reintento; el CLI se trababa cargando la letra)
→ `out/bienvenida.mp4` y `out/bienvenida-sin-musica.mp4`. Cuadros de control: `node tools/stills.mjs S-pista:60,160 …`.
