# Zuka · Matemáticas en clips

App web móvil para aprender materias de fundamentación de ingeniería con **clips verticales 9:16** y **ejercicios interactivos**.

- **Aprender**: ruta de lecciones por curso (Álgebra, Trigonometría, Cálculo Diferencial, Física Mecánica, Cálculo Integral, Álgebra Lineal). Cada lección = 1 clip + ejercicios.
- **Clips**: feed vertical tipo TikTok con filtros por curso, me gusta, guardar, narración por voz y botón para practicar.
- **Perfil**: racha, XP, precisión, meta diaria, progreso por curso y ajustes.
- **App instalable (PWA)** en celular y computador, con funcionamiento sin conexión (`sw.js`). El icono de instalación es la mascota sobre fondo blanco (`icons/`).
- **Tema claro, oscuro o del sistema**, configurable en Perfil → Apariencia.
- Gamificación: vidas (se recupera una cada 20 min), XP, racha diaria y preguntas falladas que se repiten al final.

## Ejecutar

No necesita instalación ni compilación. Sirve la carpeta con cualquier servidor estático:

```bash
python -m http.server 5173
```

y abre http://localhost:5173. El progreso se guarda en `localStorage` del navegador.

Para poder instalarla desde otros dispositivos, publícala con HTTPS (por ejemplo GitHub Pages). En Chrome o Edge aparece el botón **Instalar**; en iPhone se instala desde Safari con **Compartir → Añadir a pantalla de inicio**. Al cambiar archivos, sube el número de `VERSION` en `sw.js`.

## Agregar contenido

Todo el contenido está en `js/data.js`:

- **Escenas de clip**: `sc(segundos, subtítulo, { title, steps, viz })`. Las animaciones disponibles (`viz.type`) están en `js/viz.js`: `graph`, `approach`, `circle`, `triangle`, `tangent`, `projectile`, `push`, `incline`, `energy`, `balance`, `areaSquare`, `riemann`, `vectors`, `matrix`.
- **Video real**: en lugar de escenas animadas usa `clip: { video: 'videos/mi-clip.mp4', scenes: [] }`.
- **Ejercicios**: `mc` (opción múltiple), `num` (respuesta numérica), `ord` (ordenar pasos) y `sld` (deslizador sobre una animación).
- Las fórmulas se escriben en TeX entre `$...$` (se renderizan con KaTeX).

## Videos con Manim

Los videos de las lecciones se hacen con [Manim Community](https://github.com/ManimCommunity/manim) en la carpeta `video/` (necesita LaTeX, por ejemplo MiKTeX). Formato vertical 1080 × 1920, sin portada, con el fondo degradado del curso y subtítulos en pantalla.

```bash
cd video
python make_background.py "#8b7bff" fondo_algebra.png                  # fondo del curso (una vez)
python -m manim -r 540,960 sistemas_numericos.py SistemasNumericos     # borrador rápido
python -m manim sistemas_numericos.py SistemasNumericos                # versión final
```

El video queda en `video/media/videos/…` y los subtítulos en `video/subtitulos/`. Copia ambos a `videos/` y enlázalos en la lección con `clip: { video: 'videos/<id>.mp4', duration: <segundos>, … }`. Para revisar un render: `python tools_sheet.py <video.mp4> <subtitulos.srt> hoja.png`.

## Estructura

```
index.html        estructura y carga de scripts
css/styles.css    estilos
js/ui.js          utilidades (TeX, íconos, sonido, confeti)
js/viz.js         animaciones en canvas
js/data.js        cursos, lecciones y ejercicios
js/player.js      reproductor de clips 9:16
js/exercises.js   tipos de ejercicio
js/app.js         estado, navegación, lecciones y perfil
```
