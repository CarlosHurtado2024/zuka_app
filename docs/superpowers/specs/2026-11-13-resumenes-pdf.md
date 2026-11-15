# Resúmenes en PDF por mundo

**Fecha:** 2026-11-13 · **Versión 2 (2026-11-15):** todos los mundos, en LaTeX, fondo blanco y con taller.

## Qué es

Un PDF descargable por cada mundo de cada curso (31 hoy) con lo visto en sus niveles, para guardarlo o imprimirlo.
Aspecto de apuntes universitarios: fondo blanco, Palatino (newpx), fórmulas en LaTeX, diagramas y gráficas con
TikZ / pgfplots, y el color del curso solo como acento (portada, fichas de nivel, títulos y cajas).

## Estructura de cada resumen

1. **Portada:** franja con el curso, el número y el nombre del mundo; párrafo de entrada; lista de niveles; caja con las
   ideas que sostienen el mundo.
2. **Un apartado por nivel** (`\nivel{X-Y}{…}`), en el orden de la app: definiciones y propiedades con notación precisa,
   intuición breve, ejemplos resueltos (preferiblemente los del video), errores frecuentes y figuras.
3. **Repaso:** tabla de fórmulas o símbolos y errores frecuentes.
4. **Taller de práctica:** exactamente 10 ejercicios nuevos (no repiten los de la app, la evaluación ni el jefe), de fácil a
   difícil, con aplicaciones y al menos uno de gráficas; **respuestas** cortas al final.

## Cómo se hace

- Plantilla común `docs/resumenes/tex/zuka-resumen.sty` (cajas `definicion`, `propiedad`, `ejemplo`, `ojo`, `clavebox`,
  `\portada`, `\nivel`, `\repaso`, `\taller`, `ejercicios`, `\respuestas`, estilos TikZ y pgfplots, color por curso con
  `\zukacurso{…}`). Modelo: `conjuntos.tex`.
- Fuente: `docs/resumenes/tex/<mundo>.tex` (el nombre es el id del mundo, `u.world`).
- PDF: `sh docs/resumenes/build.sh [mundo …]` → `media/resumenes/<mundo>.pdf` (pdflatex dos pasadas; intermedios en
  `docs/resumenes/tex/salida/`, fuera de git).
- En la app: `summaryOf(u)` (en `js/worlds.js`) da la ruta y `renderWorld` muestra la tarjeta «Resumen del mundo» al final
  del camino, después de la evaluación (enlace con `download`). Los PDF no van en `SHELL` (se bajan con conexión).
- Pruebas: `tests/resumenes.test.js` (todos los mundos con fuente y PDF, plantilla, número de mundo, un `\nivel` por
  lección, 10 ejercicios en el taller, respuestas, y el enlace en la vista del mundo).
