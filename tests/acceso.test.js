// Planes, candados y códigos: lógica pura de js/acceso.js y su conexión con la app.
// Spec: docs/superpowers/specs/2026-11-17-usuarios-planes-admin.md
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const ctx = loadScripts(['js/ui.js', 'js/worlds.js', 'js/content.js', 'js/curiosidades.js', 'js/acceso.js',
  'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/trig-juegos.js', 'js/courses/calculo.js',
  'js/courses/geometria.js', 'js/courses/preuda-razonamiento.js', 'js/courses/preuda-lectura.js', 'js/courses/preuda.js', 'js/data.js']);
const f = name => get(ctx, name);
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const NOW = Date.parse('2026-11-17T12:00:00Z');
const dias = n => new Date(NOW + n * 86400000).toISOString();
const perfil = (nivel, hasta, rol = 'estudiante') => ({ rol, nivel, duracion: 'mensual', acceso_desde: dias(-1), acceso_hasta: hasta });

test('estadoPlan: activo con días restantes, vencido y sin plan', () => {
  const estadoPlan = f('estadoPlan');
  assert.strictEqual(estadoPlan(null, NOW).estado, 'sin_plan');
  assert.strictEqual(estadoPlan({ rol: 'estudiante', nivel: null, acceso_hasta: null }, NOW).estado, 'sin_plan');
  assert.strictEqual(estadoPlan(perfil('basico', dias(-0.01)), NOW).estado, 'vencido');
  const a = estadoPlan(perfil('basico', dias(29.2)), NOW);
  assert.strictEqual(a.estado, 'activo');
  assert.strictEqual(a.dias, 30);   // lo que falta, redondeado hacia arriba: nunca «0 días» con plan vigente
  assert.strictEqual(estadoPlan(perfil('pro', dias(0.01)), NOW).dias, 1);
});

test('motivoBloqueo: gratis abre a todos; lo demás pide sesión, plan vigente y nivel suficiente', () => {
  const m = f('motivoBloqueo');
  assert.strictEqual(m(null, 'gratis', NOW), null);
  assert.strictEqual(m(null, 'basico', NOW), 'sesion');
  assert.strictEqual(m({ rol: 'estudiante', nivel: null, acceso_hasta: null }, 'basico', NOW), 'sin_plan');
  assert.strictEqual(m(perfil('pro', dias(-1)), 'basico', NOW), 'vencido');
  assert.strictEqual(m(perfil('basico', dias(5)), 'basico', NOW), null);
  assert.strictEqual(m(perfil('basico', dias(5)), 'medio', NOW), 'nivel');
  assert.strictEqual(m(perfil('medio', dias(5)), 'pro', NOW), 'nivel');
  assert.strictEqual(m(perfil('pro', dias(5)), 'medio', NOW), null);
  assert.strictEqual(m({ rol: 'admin', nivel: null, acceso_hasta: null }, 'pro', NOW), null, 'el admin abre todo');
});

test('cada motivo de bloqueo tiene su texto, con el nombre del plan que hace falta', () => {
  const t = f('textoBloqueo');
  for (const motivo of ['sesion', 'sin_plan', 'vencido', 'nivel']) {
    const x = t(motivo, 'medio');
    assert.ok(x && x.title && x.text, motivo);
    assert.match(x.title + x.text, /Medio|venció/);
  }
  assert.strictEqual(t(null, 'medio'), null);
});

test('códigos: se limpian espacios, guiones y minúsculas; sin I, O, 0 ni 1', () => {
  const limpia = f('limpiaCodigo'), valido = f('codigoValido');
  assert.strictEqual(limpia(' abcde-fgh23 '), 'ABCDEFGH23');
  assert.ok(valido('ABCDEFGH23'));
  for (const malo of ['ABCDEFGH2', 'ABCDEFGH234', 'ABCDEFGHI2', 'ABCDEFGHO2', 'ABCDEFGH20', 'ABCDEFGH21']) assert.ok(!valido(malo), malo);
  assert.strictEqual(f('muestraCodigo')('ABCDEFGH23'), 'ABCDE-FGH23');
});

test('cada error del canje tiene un mensaje claro', () => {
  const e = f('canjeError'), E = f('CANJE_ERRORES');
  for (const k of ['formato', 'no_existe', 'ya_usado', 'demasiados_intentos', 'sin_sesion', 'red']) assert.ok(E[k].length > 20, k);
  assert.match(e('ya_usado'), /una sola vez/);
  assert.match(e('demasiados_intentos'), /15 minutos/);
  assert.ok(e('otra_cosa').length > 10);
});

test('precios en pesos y fechas cortas', () => {
  assert.strictEqual(f('cop')(20000), '$ 20.000');
  assert.strictEqual(f('cop')(299000), '$ 299.000');
  assert.strictEqual(f('fechaCorta')('2026-12-17T15:00:00Z'), '17 dic 2026');
  assert.strictEqual(f('fechaCorta')(null), '—');
  assert.strictEqual(f('diasTexto')(1), '1 día');
});

test('catálogo: cada lección una vez, la primera de cada curso gratis, y cada tipo con su nivel', () => {
  const rows = f('catalogo(COURSES, CURIOS, summaryOf)');
  const ids = rows.map(r => r.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'ids repetidos');
  const COURSES = f('COURSES');
  for (const c of COURSES) {
    const ls = rows.filter(r => r.curso === c.id && r.tipo === 'leccion');
    assert.strictEqual(ls.length, c.units.flatMap(u => u.lessons).length, c.id);
    // Una gratis por curso; con componentes (c.blocks), una por componente: cada uno se abre por su cuenta.
    assert.strictEqual(ls.filter(r => r.nivel_minimo === 'gratis').length, c.blocks ? c.blocks.length : 1, `${c.id}: una gratis por componente`);
    assert.strictEqual(ls[0].nivel_minimo, 'gratis');
  }
  const nivel = tipo => [...new Set(rows.filter(r => r.tipo === tipo).map(r => r.nivel_minimo))].join();
  assert.strictEqual(nivel('jefe'), 'basico');
  assert.strictEqual(nivel('evaluacion'), 'medio');
  assert.strictEqual(nivel('resumen'), 'medio');
  assert.strictEqual(nivel('clip'), 'gratis');
  assert.strictEqual(rows.find(r => r.id === 'tutorias').nivel_minimo, 'pro');
  // Los videos de Bunny de las lecciones quedan en el catálogo: el servidor solo firma los que conoce.
  const alg0b = rows.find(r => r.id === 'alg-0b');
  assert.ok(alg0b.videos.length && alg0b.videos.every(v => /^[0-9a-f-]{36}$/.test(v)));
});

test('la app carga acceso.js y cuenta.js antes de app.js, y el service worker los guarda', () => {
  const html = read('index.html'), sw = read('sw.js');
  const at = s => html.indexOf(s);
  assert.ok(at('js/acceso.js') > 0 && at('js/acceso.js') < at('js/cuenta.js') && at('js/cuenta.js') < at('js/app.js'));
  assert.ok(at('js/data.js') < at('js/cuenta.js'), 'cuenta.js necesita los cursos ya cargados');
  assert.ok(sw.includes("'js/acceso.js'") && sw.includes("'js/cuenta.js'"));
  assert.match(sw, /supabase\\\.co/, 'las respuestas de Supabase no se guardan en la caché');
});

test('los candados por plan están en la hoja de lección, al empezarla, en jefes, evaluaciones, resúmenes y tutorías', () => {
  const app = read('js/app.js');
  assert.match(app, /function openLessonSheet\(c, l\) \{\s+if \(planMotivo\(l\.id\)\) return openBloqueo\(l\.id\)/);
  assert.match(app, /function startLesson\(c, l\) \{\s+if \(planMotivo\(l\.id\)\) return openBloqueo\(l\.id\)/);
  assert.match(app, /function openBossSheet\(c, u\) \{\s+if \(planMotivo\(u\.boss\.id\)\)/);
  assert.match(app, /planMotivo\(u\.exam\.id\) \? openBloqueo\(u\.exam\.id\)/);
  assert.match(app, /data-summary-lock/);
  assert.match(read('js/tutorias.js'), /planMotivo\('tutorias'\)/);
  assert.match(app, /cuentaProgreso\(l\.id, \{ completada: true \}\)/, 'al terminar una lección se guarda el avance');
});

test('solo el administrador ve todo abierto; a los demás se les abre de a una lección', () => {
  const cuenta = read('js/cuenta.js'), app = read('js/app.js');
  assert.match(cuenta, /function cuentaRol\(\) \{\s+if \(SIN_CANDADOS\) return;\s+S\.unlockAll = cuentaEsAdmin\(\);/, 'el admin siempre todo abierto; nadie más');
  assert.match(app, /cuentaInit\(\);[^\n]*\ngo\(tabFromURL/, 'el rol se aplica antes de pintar la primera pantalla');
  assert.match(app, /\$\{SIN_CANDADOS \? `<section class="set-group">\s*<h3 class="eyebrow">Administración<\/h3>\s*<button class="set-row" data-set="unlockAll"/, 'el interruptor solo existe en el computador de desarrollo');
  assert.match(app, /: cuentaEsAdmin\(\) \? `<section class="set-group">[\s\S]{0,200}Acceso total/, 'el admin ve que tiene acceso total, sin interruptor para apagarlo');
  // Sin modo revisión, una lección se abre al completar la anterior, también entre un mundo y el siguiente.
  assert.match(app, /return i <= 0 \|\| blockStart\(c, l\) \|\| isDone\(l\) \|\| isDone\(ls\[i - 1\]\);/);
});

test('sin sesión la app abre en la pantalla de entrada, que deja seguir sin cuenta', () => {
  const cuenta = read('js/cuenta.js'), app = read('js/app.js');
  assert.match(app, /if \(!cuentaPideEntrar\(\) && tourShouldStart\(S\)\) startTour\(\);/, 'el recorrido espera a la pantalla de entrada');
  assert.match(cuenta, /if \(!Cuenta\.sb \|\| Cuenta\.user \|\| S\.guest\) return false;/, 'sin conexión, con sesión o como invitado no estorba');
  for (const s of ['data-guest', 'data-olvide', 'signInWithPassword', 'signUp(']) assert.ok(cuenta.includes(s), s);
  assert.match(read('css/styles.css'), /#auth \{[^}]*z-index: 35/, 'encima de la app y debajo de las hojas');
});

test('el panel no usa clases «ad-…»: los bloqueadores de anuncios las esconden', () => {
  for (const f of ['admin/admin.js', 'admin/admin.css', 'admin/index.html']) {
    assert.ok(!/(^|[^A-Za-z0-9])ad-[a-z]/.test(read(f)), f);
  }
});

test('los estudiantes solo ven los cursos que el administrador habilita', () => {
  const cuenta = read('js/cuenta.js'), app = read('js/app.js');
  assert.match(cuenta, /const cursoVisible = c => SIN_CANDADOS \|\| cuentaEsAdmin\(\) \|\| !cursoBorrador\(c\);/);
  assert.match(cuenta, /from\('cursos'\)\.select\('id,publicado'\)/);
  assert.match(app, /const courseById = id => cursosVisibles\(\)\.find/, 'un curso oculto no queda como curso actual');
  assert.match(app, /<div class="course-list">\$\{cursosVisibles\(\)\.map/, 'el selector de cursos');
  assert.match(app, /const all = cursosVisibles\(\)\.flatMap\(lessonsOf\)/, 'el progreso del perfil');
  const sql = read('supabase/migrations/20261117000004_cursos_y_uso.sql');
  assert.match(sql, /grant update \(publicado\) on public\.cursos to authenticated/);
  assert.match(sql, /create policy cursos_editar[^;]*es_admin/);
  assert.match(sql, /not exists \(select 1 from public\.cursos c where c\.id = l\.curso and not c\.publicado\)/, 'el servidor tampoco entrega videos de un curso oculto');
  // Los cursos de la app y los de la tabla son los mismos.
  const all = fs.readdirSync(path.join(ROOT, 'supabase/migrations')).map(m => read(`supabase/migrations/${m}`)).join(' ');
  for (const c of f('COURSES')) assert.ok(all.includes(`('${c.id}', `), c.id);
});

test('el uso diario se envía solo con sesión y lo escribe únicamente registrar_uso', () => {
  const cuenta = read('js/cuenta.js'), sql = read('supabase/migrations/20261117000004_cursos_y_uso.sql');
  assert.match(cuenta, /rpc\('registrar_uso'/);
  assert.match(cuenta, /if \(visible && dt > 0 && dt < 40 && Cuenta\.user && !Cuenta\.user\.offline\) uso\.seg \+= dt;/, 'solo cuenta con la app a la vista');
  assert.ok(!/grant[^;]*(insert|update)[^;]*on public\.uso_diario/.test(sql), 'un estudiante no puede escribir su uso a mano');
  assert.match(cuenta, /if \(document\.hidden\) \{ usoTick\(true\); usoEnvia\(\); \} else uso\.t = Date\.now\(\);/, 'al esconder la app se envía lo que iba');
  assert.match(read('supabase/migrations/20261117000005_ajustes_uso.sql'), /least\(u\.ejercicios \+ excluded\.ejercicios, 5000\)/, 'topes diarios');
  assert.match(sql, /least\(greatest\(coalesce\(p_segundos, 0\), 0\), 300\)/, 'cada envío cuenta a lo sumo 5 minutos');
  const admin = read('admin/admin.js');
  for (const s of ['vCursos', 'Cursos que estudia', 'Uso de la app', 'Minutos por día', "rpc('admin_resumen')"]) assert.ok(admin.includes(s), s);
});

test('el video de Bunny se pide al servidor (enlace firmado) y no se arma en el navegador', () => {
  const player = read('js/player.js');
  assert.match(player, /cuentaVideoBase\(clip\.bunny\)/);
  assert.match(player, /if \(this\.pending\) return;/, 'play() no toca un video sin fuente (arrancaría en silencio)');
  assert.ok(!/poster="\$\{esc\(base\)\}/.test(player), 'la miniatura también sale del enlace firmado');
  const fn = read('supabase/functions/video-url/index.ts');
  assert.match(fn, /rpc\("acceso_video"/, 'el servidor pregunta a la base si la cuenta puede ver el video');
  assert.match(fn, /BUNNY_TOKEN_KEY/);
  assert.ok(!/BUNNY_TOKEN_KEY\s*=\s*["']/.test(fn), 'la llave de Bunny no va en el código');
});

test('seguridad de la base: RLS en todas las tablas, columnas del plan sin permiso de edición y funciones con search_path', () => {
  const sql = read('supabase/migrations/20261117000001_usuarios_planes.sql') + read('supabase/migrations/20261117000002_funciones_privadas.sql');
  for (const t of ['planes', 'perfiles', 'codigos', 'progreso', 'intentos_canje', 'lecciones', 'admin_pendiente']) {
    assert.match(sql, new RegExp(`alter table public\\.${t} enable row level security`), t);
  }
  assert.match(sql, /grant update \(nombre, telefono\) on public\.perfiles to authenticated/);
  assert.ok(!/grant (all|update) on public\.perfiles/.test(sql), 'nadie recibe permiso de editar rol, nivel ni fechas');
  assert.ok(!/grant[^;]*on public\.codigos to anon/.test(sql));
  const canje = read('supabase/migrations/20261117000003_canje_confirmar.sql');
  assert.match(canje, /'error', 'reemplaza'/, 'un código de otro nivel no reemplaza un plan vigente sin confirmar');
  assert.match(read('js/cuenta.js'), /p_confirmar: confirmado === c/);
  assert.match(read('js/cuenta.js'), /\(S\.cuenta \|\| \{\}\)\.uid !== Cuenta\.user\.id\) return;/, 'el avance de otra cuenta no sube a esta');
  const fns = (sql + canje + read('supabase/migrations/20261117000004_cursos_y_uso.sql')).match(/create function[\s\S]*?as \$\$/g);
  assert.ok(fns.length >= 20);
  for (const fn of fns) assert.match(fn, /set search_path = ''/, fn.slice(0, 60));
  assert.ok(!/sb_secret|service_role key|eyJhbGciOi/.test(read('js/acceso.js')), 'en el navegador solo va la llave pública');
});

test('Bunny: lo nuevo sale de la biblioteca nueva y lo de la vieja sigue con su servidor y su firma', () => {
  const { loadScripts, get } = require('./load');
  const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/curiosidades.js']);
  const host = get(ctx, 'bunnyHost'), viejos = get(ctx, 'BUNNY_VIEJOS');
  assert.equal(host('2c656c56-44bc-4925-97f2-df27f61c74da'), 'vz-1a76d229-c83.b-cdn.net');
  assert.equal(host('a05c46b4-a0b6-4ee8-8103-b775378e43c4'), 'vz-2449e89f-b51.b-cdn.net');
  // Los clips ya viven en la biblioteca nueva.
  for (const c of get(ctx, 'CURIOS')) if (c.clip.bunny) assert.ok(!viejos.has(c.clip.bunny), `${c.id} sigue en la vieja`);
  const fs = require('fs');
  assert.match(fs.readFileSync('js/player.js', 'utf8'), /bunnyHost\(clip\.bunny\)/);
  assert.match(fs.readFileSync('js/cuenta.js', 'utf8'), /bunnyHost\(id\)/);
});
