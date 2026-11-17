# Cursos habilitados por el administrador y estadísticas de uso

Fecha: 2026-11-17. Sigue a `2026-11-17-usuarios-planes-admin.md`. Pruebas: `tests/acceso.test.js`.
Migración: `supabase/migrations/20261117000004_cursos_y_uso.sql`.

## Para qué

Los cursos se construyen de a poco. El administrador los va viendo en la app mientras se arman, y
decide cuándo cada uno aparece para los estudiantes. Además quiere saber cómo usa la app cada
estudiante y ver las métricas generales.

## Cursos

- Tabla `cursos (id, nombre, orden, publicado)`. Todos la leen; solo el admin cambia `publicado`.
  Arranca con Álgebra y Trigonometría habilitados y los demás en borrador.
- App (`js/cuenta.js`): `cursoVisible(c)` = admin, o computador de desarrollo, o curso publicado.
  `cursosVisibles()` reemplaza a `COURSES` en el selector de cursos, el curso actual (`courseById`), el
  progreso del Perfil y las Tutorías. El admin ve todos, con «Borrador» en los que no ha habilitado.
  Sin datos del servidor vale `CURSOS_LISTOS`; la última respuesta queda en `localStorage`.
- Servidor: `acceso_video` no entrega videos de un curso sin publicar (salvo al admin). Los ejercicios
  son archivos estáticos: ocultarlos es solo de interfaz.
- Panel → **Cursos**: estado, lecciones, estudiantes y botón «Habilitar para estudiantes» / «Ocultar a
  estudiantes» (ocultar pide un segundo toque).
- Curso nuevo en la app: añadir su fila a `cursos` (la prueba compara los ids de `COURSES` con la
  migración) y correr `tools/sync-lecciones.js`.

## Uso diario

- Tabla `uso_diario (usuario, dia, segundos, lecciones, ejercicios, aciertos)`, una fila por usuario y
  día en hora de Colombia. Solo la escribe `registrar_uso` (cada envío cuenta a lo sumo 5 minutos; un día,
  24 horas). La misma función anota `ultima_vez`, `xp` y `racha` en `perfiles`.
- App: `usoTick` suma tiempo cada 15 s solo con sesión y con la app a la vista; `usoEnvia` manda cada
  minuto y al esconder la app. Es tiempo con la app abierta, no tiempo de atención.
- XP, racha, ejercicios y aciertos los informa el celular: sirven para estadísticas, no para decidir
  acceso ni premios.

## Panel

- **Resumen**: estudiantes (registrados, nuevos, con plan, vencidos, sin plan), uso (entraron hoy / 7 /
  30 días, minutos por estudiante al día, minutos y lecciones de la semana, aciertos), barras de
  minutos por día (14 días), ventas (códigos canjeados en 30 días y su valor al precio actual), planes
  por nivel, cursos, lecciones más completadas y planes por vencer. Cuenta solo estudiantes.
- **Usuarios**: columnas «Último ingreso» y «Min en 7 días».
- **Detalle**: tarjeta «Uso de la app» (último ingreso, minutos hoy, promedio diario de la semana, días
  que entró en la semana y en el mes, tiempo total, lecciones, ejercicios, aciertos, video visto, XP,
  racha, barras de 14 días) y «Cursos que estudia» (los que tienen alguna lección con avance; no hay
  inscripción formal a cursos).
- Las clases del panel empiezan por `pn-`: con `ad-` los bloqueadores de anuncios las escondían.
