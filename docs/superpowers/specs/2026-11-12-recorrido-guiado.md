# Recorrido guiado de bienvenida

## Objetivo

La primera vez que alguien abre Zuka (recién instalada o en el navegador) la app lo lleva de la mano por
lo esencial: elegir curso, entrar a un mundo, abrir una lección, ver el video, resolver los ejercicios, y
dónde están Clips y Perfil. Dura menos de un minuto, se puede saltar en cualquier paso y se puede repetir.

## Cuándo aparece

- Al arrancar, si `S.tourDone` es falso **y** no hay progreso (`xp === 0`, ninguna lección hecha). Quien ya
  usaba la app no lo ve solo.
- Termina (último paso) o se salta (✕, Esc, botón atrás del celular) → `S.tourDone = true`. Si se cierra la
  app a medias, vuelve a salir la próxima vez.
- Perfil → Ajustes → «Ver el recorrido otra vez» lo repite. «Reiniciar progreso» no lo vuelve a mostrar.

## Cómo se ve

Una capa (`.tour`, encima de hojas y avisos, debajo de los diálogos) oscurece la app y deja un **hueco
iluminado** sobre el elemento real del que se habla; al lado, una tarjeta con título, texto corto, puntos de
avance y botones «Atrás» / «Siguiente». Tocar el hueco también avanza. Los pasos sin elemento (bienvenida,
video, ejercicios, cierre) son una tarjeta centrada con la mascota o una ilustración pequeña.

| # | id | Señala | Vista |
|---|---|---|---|
| 1 | `hola` | (centrada, mascota) | mapa |
| 2 | `curso` | `.tb-course` | mapa |
| 3 | `mundos` | mundo actual (`.wnode`) | mapa |
| 4 | `niveles` | nivel actual (`.node`) | dentro del mundo |
| 5 | `video` | (centrada, ilustración de video) | mundo |
| 6 | `ejercicios` | (centrada, ilustración de ejercicio) | mundo |
| 7 | `progreso` | `.tb-stats` | mundo |
| 8 | `clips` | pestaña Clips | mundo |
| 9 | `perfil` | pestaña Perfil | mundo |
| 10 | `fin` | (centrada, mascota) | mundo, listo para tocar el nivel 1 |

No se abre una lección real durante el recorrido (cargaría un video): el video y los ejercicios se explican
con ilustraciones hechas con HTML y los colores del tema.

## Piezas

- `js/tour.js`: `TOUR_STEPS`, funciones puras `tourShouldStart(S)`, `tourHole(rect, vw, vh)`,
  `tourTipPos(hole, tipW, tipH, vw, vh, bounds)` (probadas en Node) y `startTour()` (DOM).
- `js/app.js`: `tourDone` en `DEFAULTS`, arranque, botón en Perfil.
- `js/back.js`: el botón atrás cierra el recorrido (`backStep` → `'tour'`).
- Accesible: `role="dialog"`, foco en «Siguiente», flechas / Enter / Esc, el resto de la app queda `inert`,
  sin animaciones con `prefers-reduced-motion`. Se recoloca al girar o cambiar el tamaño.
