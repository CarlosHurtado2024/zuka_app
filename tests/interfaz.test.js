// Retoques de interfaz tomados de las referencias (spec 2026-11-15-interfaz-referencias).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const app = read('js/app.js'), css = read('css/styles.css');
const rule = sel => (css.match(new RegExp(sel.replace(/[.#[\]=]/g, '\\$&') + '\\s*\\{([^}]*)\\}')) || [])[1] || '';

test('la racha de arriba es un botón que abre la hoja de racha', () => {
  assert.match(app, /<button class="tb-stat streak[^>]*data-streak/);
  assert.match(app, /function openStreakSheet\(/);
  assert.match(app, /\[data-streak\][^\n]*openStreakSheet/);
  assert.match(app, /maxStreak: 0/, 'la racha máxima se guarda en el estado');
  assert.match(app, /S\.maxStreak = Math\.max\(/, 'y se actualiza al marcar la racha');
});

test('el inicio trae la tarjeta «Sigue aquí» que abre la lección de un toque', () => {
  const learn = app.slice(app.indexOf('function renderLearn('), app.indexOf('function renderWorld('));
  assert.match(learn, /class="next-card"/);
  assert.match(learn, /data-continue/);
  assert.match(learn, /\[data-continue\][^\n]*startLesson\(c, cur\)/);
  assert.match(learn, /cur \? /, 'con el curso completo no hay tarjeta');
});

test('las píldoras de arriba y la pestaña activa tienen su estilo', () => {
  assert.match(rule('.tb-stat'), /border:\s*1px solid var\(--line\)/);   // borde fino (spec 2026-11-27-interfaz-red)
  assert.match(rule('.tb-stat'), /border-radius:\s*999px/);
  assert.match(css, /#tabbar button\.on \.i\s*\{[^}]*background:/, 'píldora detrás del icono activo');
});

test('los botones ya no van en mayúsculas espaciadas', () => {
  assert.doesNotMatch(rule('.btn'), /text-transform:\s*uppercase/);
  assert.doesNotMatch(rule('.btn'), /letter-spacing/);
});

test('la retroalimentación es una hoja redondeada con icono', () => {
  assert.match(rule('.feedback'), /border-radius:\s*24px 24px 0 0/);
  assert.match(app, /class="fb-head"/);
});

test('la tarjeta del mundo dice cuántas lecciones y ejercicios tiene', () => {
  const world = app.slice(app.indexOf('function renderWorld('), app.indexOf('// ---- pestaña Clips'));
  assert.match(world, /class="world-stats"/);
});

test('el inicio abre arriba (con «Sigue aquí» a la vista) y en celulares muy angostos la barra suelta el XP', () => {
  const learn = app.slice(app.indexOf('function renderLearn('), app.indexOf('function renderWorld('));
  assert.doesNotMatch(learn, /\.wnode\.current'\)\?\.scrollIntoView/);
  assert.match(css, /@media \(max-width: 359px\) \{ #topbar \.tb-stat\.xp \{ display: none; \} \}/);
});

test('markStreak conserva la mejor racha anterior aunque maxStreak llegue en 0', () => {
  const src = app.slice(app.indexOf('function markStreak()'), app.indexOf('function syncHearts()'));
  const run = new Function('S', 'today', 'yesterday', 'save', `${src}; markStreak(); return S;`);
  const S = run({ streak: 12, maxStreak: 0, lastDay: '2026-11-10' }, () => '2026-11-13', () => '2026-11-12', () => {});
  assert.equal(S.streak, 1);
  assert.equal(S.maxStreak, 12);
  const T = run({ streak: 4, maxStreak: 4, lastDay: '2026-11-12' }, () => '2026-11-13', () => '2026-11-12', () => {});
  assert.equal(T.maxStreak, 5);
});

test('la barra de arriba: número en tinta, XP largo abreviado y «1 día» en singular', () => {
  assert.match(css, /\.tb-stat b \{ color: var\(--ink\); \}/);
  const shortNum = new Function(`${app.match(/const shortNum = [^\n]*/)[0]}; return shortNum;`)();
  assert.equal(shortNum(950), '950');
  assert.equal(shortNum(12450), '12.4 k');
  assert.match(app, /streakNow\(\) === 1 \? 'día' : 'días'/);
});
