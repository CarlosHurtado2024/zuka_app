// Escribe el SQL que pone al día la tabla `lecciones` de Supabase con el contenido de la app.
// Uso: node tools/sync-lecciones.js > lecciones.sql   (y se corre en Supabase)
// Añade lo nuevo y actualiza tipo, curso, título, orden y videos. No toca nivel_minimo de lo que ya
// existe (se cambia en el panel /admin o en la tabla) ni borra filas.
const { loadScripts, get } = require('../tests/load');

const ctx = loadScripts(['js/ui.js', 'js/worlds.js', 'js/content.js', 'js/curiosidades.js', 'js/acceso.js',
  'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/trig-juegos.js',
  'js/courses/calculo.js', 'js/courses/geometria.js', 'js/courses/preuda-razonamiento.js',
  'js/courses/preuda-lectura.js', 'js/courses/preuda.js', 'js/data.js']);
const rows = get(ctx, 'catalogo(COURSES, CURIOS, summaryOf)');

const q = s => `'${String(s).replace(/'/g, "''")}'`;
const values = rows.map(r =>
  `(${q(r.id)}, ${q(r.tipo)}, ${q(r.curso)}, ${q(r.titulo)}, ${r.orden}, ${q(r.nivel_minimo)}, array[${r.videos.map(q).join(', ')}]::text[])`);

process.stdout.write(`insert into public.lecciones (id, tipo, curso, titulo, orden, nivel_minimo, videos) values
${values.join(',\n')}
on conflict (id) do update set tipo = excluded.tipo, curso = excluded.curso, titulo = excluded.titulo,
  orden = excluded.orden, videos = excluded.videos;
`);
if (process.argv.includes('--resumen')) console.error(`${rows.length} filas`);
