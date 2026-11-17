# Perfil, Ajustes y Actividad (2026-11-17)

Segunda tanda de referencias del usuario (pantallas de ajustes en lista, perfil con piñón, calendario de actividad).
Objetivo: que la app sea más fácil de manejar. El Perfil medía tres pantallas y mezclaba datos del estudiante con
interruptores; la hoja de racha solo mostraba la semana.

## Qué cambia

1. **Perfil** (`renderProfile`): queda lo del estudiante — nombre, cuenta/plan, cuatro datos, meta de hoy (barra, solo
   lectura), progreso por curso y clips guardados. Arriba a la derecha, un **piñón** (`[data-settings]`) abre Ajustes.
   Salen de aquí: apariencia, instalar, interruptores, recorrido y reiniciar.
2. **Ajustes** (`renderSettings`, subvista `profileSub === 'settings'` de la pestaña Perfil): encabezado con flecha
   (`[data-back]`) y filas en grupos separados por una línea, cada fila con icono:
   - Aprendizaje: meta diaria (10 / 20 / 30 / 50 XP).
   - Sonido: narración por voz, efectos de sonido (interruptores).
   - Apariencia: tema, con el nombre del actual y tres botones de icono (sistema, claro, oscuro).
   - Modo revisión (solo administrador o sin candados).
   - App: instalar Zuka, ver el recorrido otra vez.
   - Reiniciar progreso (en rojo, al final, pide confirmación).
   El botón atrás del celular vuelve de Ajustes al Perfil (misma vía que un mundo: `[data-back]`). Tocar la pestaña
   Perfil vuelve al Perfil.
3. **Actividad** (`openStreakSheet`): la hoja de la racha muestra el **mes** en una cuadrícula de lunes a domingo, con
   los días con actividad encendidos y hoy marcado, flechas para ver meses anteriores (no pasa del mes actual) y tres
   fichas: días de racha, XP de hoy y racha máxima. `S.days` (nuevo) guarda el XP de cada día (`addXP`), hasta 400 días;
   los días de la racha viva se encienden aunque sean anteriores a `S.days`. Funciones puras en `js/ui.js`:
   `streakDays(lastDay, streak, now)` y `monthGrid(year, month, active, now)`. Reemplazan a `streakWeek`.
4. **Mundo** (`renderWorld`): al abrir un mundo solo se desplaza hasta el nivel actual si queda fuera de la pantalla; antes
   siempre lo centraba y cortaba la tarjeta del mundo por arriba.

## Reglas

- Claro y oscuro; 320–380 px. Filas de al menos 48 px de alto. Sin reloj ni presión.
- `S.days` es local (no sube a la nube); «Reiniciar progreso» lo borra.
- Pruebas: `tests/perfil-ajustes.test.js`; se quitan las de `streakWeek` en `tests/interfaz.test.js`.
