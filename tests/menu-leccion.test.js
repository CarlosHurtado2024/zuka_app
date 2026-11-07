// Durante una lección (videos y ejercicios) el menú inferior se esconde y la lección ocupa toda la
// pantalla; al salir, vuelve. Se comprueba en el CSS y en app.js (la app no corre en Node).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const rule = sel => (css.match(new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`)) || [])[1] || '';

test('CSS: con body.in-lesson el menú no se ve y no reserva altura', () => {
  assert.match(rule('body.in-lesson #tabbar'), /display:\s*none/);
  assert.match(rule('body.in-lesson'), /--tabbar-h:\s*0px/);
});

test('app.js: la lección pone body.in-lesson al abrir y lo quita al cerrar', () => {
  const start = app.slice(app.indexOf('function startLesson'), app.indexOf('function close('));
  const close = app.slice(app.indexOf('function close('), app.indexOf('lessonClose = close;'));
  assert.match(start, /body\.classList\.add\('in-lesson'\)/);
  assert.match(close, /body\.classList\.remove\('in-lesson'\)/);
});

test('app.js: la altura del menú no se pisa con 0 mientras está escondido', () => {
  const line = app.slice(app.indexOf('const setTabbarHeight'), app.indexOf('setTabbarHeight();'));
  assert.match(line, /if \(h\)/);
});

// Pestaña Clips: el menú flota sobre el video (no le quita alto al feed), se esconde mientras un
// clip se reproduce y vuelve al pausar; en pausa, la barra de adelantar sube para no quedar tapada.
test('CSS: en Clips el menú flota sobre el feed', () => {
  assert.match(rule('body[data-tab=clips] #tabbar'), /position:\s*absolute/);
});

test('CSS: en Clips, con un clip reproduciéndose, el menú se esconde', () => {
  const hide = rule('body[data-tab=clips]:has(.clip.in-feed:not(.paused)) #tabbar');
  assert.match(hide, /transform:\s*translateY\(100%\)/);
  assert.match(hide, /pointer-events:\s*none/);
});

test('CSS: en Clips, en pausa, la barra de adelantar queda sobre el menú', () => {
  assert.match(rule('body[data-tab=clips] .clip.in-feed.paused .seek'), /bottom:\s*calc\(var\(--tabbar-h/);
});
