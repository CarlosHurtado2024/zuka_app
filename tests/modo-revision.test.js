// Modo revisión: todas las lecciones abiertas y sin perder vidas, para revisar el contenido mientras se
// construye. Activo por defecto y con un interruptor en Perfil (se comprueba en el código de app.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const body = name => app.slice(app.indexOf(`function ${name}`), app.indexOf('\n}', app.indexOf(`function ${name}`)));

test('por defecto el modo revisión está activo', () => {
  assert.match(app.slice(app.indexOf('const DEFAULTS'), app.indexOf('});', app.indexOf('const DEFAULTS'))), /unlockAll: true/);
});

test('con el modo revisión toda lección está abierta', () => {
  assert.match(body('isUnlocked'), /if \(S\.unlockAll\) return true;/);
});

test('con el modo revisión no se pierden vidas ni se bloquea la lección por falta de vidas', () => {
  assert.match(body('loseHeart'), /if \(S\.unlockAll\) return;/);
  assert.match(body('startLesson'), /S\.hearts <= 0 && !S\.unlockAll/);
});

test('Perfil tiene el interruptor del modo revisión', () => {
  assert.match(app, /data-set="unlockAll"/);
});

test('la ruta dibuja como abiertas (no con candado) las lecciones desbloqueadas', () => {
  const learn = body('renderLearn');
  assert.match(learn, /isUnlocked\(c, l\) \? 'open' : 'locked'/);
});

test('con el modo revisión la lección tiene botones para saltar entre ejercicios sin responder', () => {
  const sl = body('startLesson');
  assert.match(sl, /S\.unlockAll \? `<div class="rev-nav"/, 'la barra ‹ › solo existe en modo revisión');
  assert.match(sl, /data-jump="-1"/);
  assert.match(sl, /data-jump="1"/);
  // jump mueve la posición sin contar el ejercicio como resuelto y cierra la retroalimentación abierta
  const jump = sl.slice(sl.indexOf('function jump'), sl.indexOf('\n  }', sl.indexOf('function jump')));
  assert.match(jump, /pos = Math\.max\(0, Math\.min\(queue\.length - 1, pos \+ d\)\)/);
  assert.match(jump, /fb\.classList\.remove\('show'\)/);
  assert.doesNotMatch(jump, /solved\+\+/);
});
