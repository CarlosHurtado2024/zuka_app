// Perfil, Ajustes y Actividad (spec 2026-11-17-perfil-ajustes-actividad).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const cuenta = read('js/cuenta.js');
const app = read('js/app.js'), css = read('css/styles.css'), back = read('js/back.js'), tour = read('js/tour.js');
const ui = loadScripts(['js/ui.js']);
const streakDays = get(ui, 'streakDays'), monthGrid = get(ui, 'monthGrid');
const part = (from, to) => {
  const i = app.indexOf(from), j = app.indexOf(to, i);
  assert.ok(i > 0 && j > i, `no encuentro el trozo ${from} … ${to}`);
  return app.slice(i, j);
};
const profile = part('function renderProfile(', 'function renderSettings(');
const settings = part('function renderSettings(', '// ---- arranque');

test('streakDays: los días de la racha viva, del más reciente al más viejo', () => {
  const fri = new Date(2026, 10, 13);
  assert.equal(streakDays('2026-11-13', 3, fri).join(), '2026-11-13,2026-11-12,2026-11-11');
  assert.equal(streakDays('2026-11-12', 2, fri).join(), '2026-11-12,2026-11-11', 'racha viva de ayer');
  assert.equal(streakDays('2026-11-10', 5, fri).length, 0, 'racha rota');
  assert.equal(streakDays(null, 0, fri).length, 0);
  assert.equal(streakDays('2026-11-02', 3, new Date(2026, 10, 2)).join(), '2026-11-02,2026-11-01,2026-10-31', 'cruza el mes');
});

test('monthGrid: semanas completas de lunes a domingo, con los días de otros meses marcados', () => {
  const g = monthGrid(2026, 10, new Set(), new Date(2026, 10, 13));   // noviembre de 2026 empieza en domingo
  assert.equal(g.length % 7, 0);
  assert.equal(g.length, 42);
  assert.equal(g.slice(0, 7).map(c => c.d).join(), '26,27,28,29,30,31,1');
  assert.equal(g.slice(0, 6).every(c => c.out), true);
  assert.equal(g[6].out, false);
  assert.equal(g.filter(c => !c.out).length, 30);
  assert.equal(g.find(c => c.today).key, '2026-11-13');
  assert.equal(g.filter(c => c.today).length, 1);
});

test('monthGrid: enciende solo los días activos de ese mes y no marca hoy en otro mes', () => {
  const act = new Set(['2026-11-12', '2026-11-13', '2026-10-31', '2026-10-05']);
  const nov = monthGrid(2026, 10, act, new Date(2026, 10, 13));
  assert.equal(nov.filter(c => c.lit).map(c => c.key).join(), '2026-11-12,2026-11-13', 'el 31 de octubre es de otro mes: no se enciende aquí');
  const oct = monthGrid(2026, 9, act, new Date(2026, 10, 13));
  assert.equal(oct.filter(c => c.lit).map(c => c.key).join(), '2026-10-05,2026-10-31');
  assert.equal(oct.some(c => c.today), false);
  assert.equal(monthGrid(2027, 1, new Set(), new Date(2026, 10, 13)).length, 28, 'febrero de 2027 cabe en cuatro semanas');
});

test('addXP anota el XP de cada día en S.days y no guarda más de 400 días', () => {
  assert.match(app, /days: \{\}/, 'S.days en DEFAULTS');
  const src = part('function addXP(', 'function markStreak(');
  const run = new Function('S', 'today', 'save', `${src}; addXP(10); addXP(5); return S;`);
  const S = run({ today: { day: null, xp: 0 }, xp: 0, days: { '2026-11-01': 20 } }, () => '2026-11-13', () => {});
  assert.equal(S.days['2026-11-13'], 15);
  assert.equal(S.days['2026-11-01'], 20);
  const many = {}; for (let i = 0; i < 450; i++) many[`d${String(i).padStart(4, '0')}`] = 1;
  const T = run({ today: { day: null, xp: 0 }, xp: 0, days: many }, () => 'z-hoy', () => {});
  assert.equal(Object.keys(T.days).length, 400);
  assert.equal(T.days['z-hoy'], 15, 'se conserva lo más reciente');
  assert.equal('d0000' in T.days, false);
  const U = run({ today: { day: null, xp: 0 }, xp: 0 }, () => '2026-11-13', () => {});
  assert.equal(U.days['2026-11-13'], 15, 'un estado viejo sin S.days no rompe');
});

test('la hoja de racha es un calendario del mes con flechas y tres fichas', () => {
  const sheet = part('function openStreakSheet(', 'function openLessonSheet(');
  assert.match(sheet, /monthGrid\(/);
  assert.match(sheet, /streakDays\(/);
  assert.match(sheet, /data-month="-1"/);
  assert.match(sheet, /data-month="1"/);
  assert.match(sheet, /class="act-tiles"/);
  assert.doesNotMatch(app, /streakWeek/);
});

test('el Perfil tiene un piñón que abre Ajustes y ya no carga interruptores ni apariencia', () => {
  assert.match(profile, /data-settings/);
  assert.match(profile, /aria-label="Ajustes"/);
  assert.match(profile, /profileSub = 'settings'/);
  assert.doesNotMatch(profile, /data-theme-opt|data-set=|data-reset|install-card/);
  assert.match(profile, /if \(profileSub === 'settings'\) return renderSettings\(\)/, 'al repintar (p. ej. tras iniciar sesión) sigue en Ajustes');
});

test('Ajustes: filas con icono para meta, sonido, tema, instalar, recorrido y reiniciar', () => {
  for (const k of ['data-goal', 'data-set="voice"', 'data-set="sfx"', 'data-theme-opt', 'data-tour', 'data-reset', 'data-back'])
    assert.ok(settings.includes(k), `falta ${k}`);
  assert.match(settings, /Ver el recorrido otra vez/);
  assert.ok(settings.indexOf('data-reset') > settings.indexOf('data-tour'), 'reiniciar va al final');
  assert.match(settings, /ask\(\{ title: '¿Borrar todo tu progreso\?'/, 'reiniciar sigue pidiendo confirmación');
  assert.match(settings, /aria-pressed/, 'los botones de tema dicen cuál está activo');
  const rule = (css.match(/\.set-row\s*\{([^}]*)\}/) || [])[1] || '';
  assert.match(rule, /min-height:\s*(4[8-9]|5\d)px/, 'filas cómodas para el dedo');
});

test('volver de Ajustes: flecha, botón atrás del celular y tocar la pestaña Perfil', () => {
  assert.match(settings, /\[data-back\][^\n]*profileSub = null/);
  assert.match(back, /world: \(tab === 'learn' && \(!!openWorld \|\| !!openBlock\)\) \|\| \(tab === 'profile' && !!profileSub\)/);
  const boot = app.slice(app.indexOf('// ---- arranque'));
  assert.match(boot, /profileSub = null/);
});

test('el recorrido guiado ya habla del piñón de Ajustes', () => {
  assert.match(tour, /id: 'perfil'[^\n]*\n[^\n]*piñón/);
});

test('al abrir un mundo no se corta su tarjeta: solo se desplaza si el nivel actual queda fuera', () => {
  const world = part('function renderWorld(', '// ---- pestaña Clips');
  assert.doesNotMatch(world, /\.node\.current'\)\?\.scrollIntoView\(\{ block: 'center' \}\);\n\}/);
  assert.match(world, /getBoundingClientRect\(\)/);
});

test('reiniciar el progreso conserva las preferencias y con cuenta no promete borrar lo de la nube', () => {
  const keep = new Function(`${app.match(/const RESET_KEEP = [^\n]*/)[0]}; return RESET_KEEP;`)();
  for (const k of ['theme', 'name', 'goal', 'voice', 'sfx', 'guides', 'cuenta', 'tutorias', 'tourDone']) assert.ok(keep.includes(k), k);
  for (const k of ['xp', 'done', 'streak', 'maxStreak', 'days', 'lastDay', 'exams']) assert.ok(!keep.includes(k), `${k} sí se reinicia`);
  assert.match(settings, /Object\.assign\(DEFAULTS\(\), keep\)/);
  assert.match(settings, /conCuenta \? 'Borra tu XP y tu racha en este celular/);
});

test('otra cuenta en el mismo celular no hereda el calendario de la anterior', () => {
  assert.match(cuenta, /if \(otro\) \{.*S\.days = \{\};/);
});

test('en Ajustes el foco vuelve al control que se tocó y el día se escribe igual en toda la app', () => {
  assert.match(settings, /renderSettings\(\); view\.scrollTop = y; \$\(sel, view\)\?\.focus\(/);
  assert.match(app, /const dayStr = d => dayKey\(d\);/);
  assert.match(back, /else if \(tab === 'profile'\) \{ profileSub = null; renderProfile\(\); \}/);
  assert.doesNotMatch(css, /\.toggle-row|\.seg-3|\.install-card|\.tour-again/);
});
