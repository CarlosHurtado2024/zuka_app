# Usuarios, planes, códigos de acceso, progreso y panel de administración

Fecha: 2026-11-17. Pruebas: `tests/acceso.test.js`.

## Para qué

Vender acceso a Zuka sin pasarela de pagos: el estudiante paga por Nequi, el dueño verifica y le envía un
código de un solo uso; al canjearlo en la app se activa su plan. La base solo guarda usuarios, planes,
progreso y códigos.

## Decisiones

- **Sin servidor propio.** La app sigue siendo estática en Vercel. Todo lo que exige confianza vive en
  Supabase (proyecto `zuka`, `bzzzufyjhzjqawwrduom`): Postgres con RLS, funciones y una Edge Function.
  Se descartó añadir funciones de Vercel: la app no tiene compilación ni variables de entorno, y Supabase
  ya valida la sesión.
- **Tablas viejas en inglés** (`profiles`, `lessons`, `lesson_progress`…, vacías, de un intento anterior):
  no se tocan. Lo nuevo va en español y no depende de ellas.
- **Planes**: Básico, Medio y Pro × mensual (30 días), semestral (180) y anual (365). Precios en la tabla
  `planes`, editables desde el panel.
- **Qué abre cada nivel** (`nivel_minimo` en la tabla `lecciones`; valores por defecto en `NIVEL_TIPO` de
  `js/acceso.js`): la primera lección de cada curso y los clips de curiosidades son gratis; videos, juegos y
  jefes, Básico; resúmenes en PDF y evaluaciones (guías y simulacros), Medio; tutorías (dudas), Pro.
- **Cambio de plan** (`canjear_codigo`): código del mismo nivel con plan vigente → los días se suman al
  final; otro nivel o plan vencido → el nivel nuevo reemplaza al anterior y cuenta desde hoy.
- **Administrador**: el rol se da al correo que esté en `admin_pendiente` cuando esa cuenta se registra y
  confirma el correo (o directamente con `update perfiles set rol = 'admin'`).

## Base de datos (`supabase/migrations/`)

| Tabla | Qué guarda | Quién la lee o cambia |
|---|---|---|
| `planes` | nivel, duración, días, precio | todos leen; admin edita días y precio |
| `perfiles` | nombre, teléfono, rol, nivel, duración, acceso_desde, acceso_hasta | cada quien el suyo (solo edita nombre y teléfono); admin lee todos |
| `codigos` | código, nivel, duración, días, nota, creado/usado por y cuándo | solo admin; los estudiantes, solo con `canjear_codigo` |
| `progreso` | usuario, lección, completada, segundos_vistos | cada quien el suyo; admin lee todo |
| `intentos_canje` | canjes fallidos (máximo 5 cada 15 minutos) | solo funciones; admin lee |
| `lecciones` | catálogo: id, tipo, curso, título, nivel_minimo, videos de Bunny | todos leen; admin cambia nivel_minimo |
| `admin_pendiente` | correos que serán admin al registrarse | solo funciones; admin lee |

Funciones que llama la app (en `public`, SECURITY INVOKER; la lógica con privilegios está en el esquema
`privado`, que la API no expone, con `search_path` vacío): `canjear_codigo`, `generar_codigos`,
`tiene_acceso`, `es_admin`, `acceso_video`, `guardar_progreso`, `admin_resumen`, `admin_usuarios`,
`admin_usuario`, `admin_codigos`, `admin_acceso` (extender, cambiar, revocar).

El perfil se crea solo al registrarse (`zuka_crear_perfil` sobre `auth.users`). Un estudiante no puede
cambiar su rol, nivel ni fechas: no tiene permiso de UPDATE sobre esas columnas.

## App (estudiante)

- `js/acceso.js`: lógica pura (estado del plan, motivo de bloqueo, catálogo, códigos, textos). También la
  usa el panel.
- `js/cuenta.js`: sesión con Supabase Auth, hojas de entrar / crear cuenta / recuperar contraseña / mis
  datos, canje, planes, tarjeta «Mi plan» del Perfil, avance en la nube y candados (`planMotivo`,
  `openBloqueo`). Sin conexión usa la última copia (`S.cuenta`).
- Candados: nodos del camino, hoja de la lección, `startLesson`, jefes, evaluaciones, resumen en PDF y
  tutorías. En `localhost` no hay candados (para revisar y correr los robots); con `?candados` sí.
- Progreso: al completar una lección y mientras se ve su video (`guardar_progreso`); al iniciar sesión se
  junta el avance del celular con el de la nube.
- Videos: `player.js` pide la dirección a la Edge Function `video-url`, que pregunta a la base
  (`acceso_video`) y firma la carpeta del video por 6 horas con la llave de Bunny (`BUNNY_TOKEN_KEY`, secreto
  de la función). Sin esa llave entrega la dirección sin firma.

## Panel (`/admin`)

Página aparte (`admin/index.html`, `admin.js`, `admin.css`). Entra con la misma cuenta; sin rol admin la
base no entrega datos. Vistas: Resumen, Usuarios (buscador, filtros, orden por vencimiento), detalle de
usuario (avance por curso, códigos canjeados, extender / cambiar / revocar), Códigos (generar, copiar,
filtrar) y Planes (precios).

## Límites conocidos

- Los ejercicios y los PDF son archivos estáticos: su candado es solo de interfaz. Lo que el servidor
  protege de verdad son los videos (cuando Bunny exija token) y los datos.
- Para que los videos queden protegidos hay que activar «Token Authentication» en Bunny y poner la llave
  como secreto `BUNNY_TOKEN_KEY` de la función.
- `tools/sync-lecciones.js` genera el SQL para poner al día la tabla `lecciones` cuando cambie el contenido
  (videos nuevos de Bunny incluidos): sin eso el servidor no entrega un video que no conoce.
