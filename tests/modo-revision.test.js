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
