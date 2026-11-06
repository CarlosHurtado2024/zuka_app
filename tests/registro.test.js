// Cada juego de js/games/ tiene que estar cargado en index.html y precacheado en el SHELL de sw.js:
// un juego sin registrar no existe en la app (o deja de funcionar sin conexión).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const games = fs.readdirSync(path.join(ROOT, 'js/games')).filter(f => f.endsWith('.js'));

for (const f of games) {
  test(`${f} está en index.html y en el SHELL del service worker`, () => {
    assert.ok(index.includes(`src="js/games/${f}"`), `falta <script src="js/games/${f}"> en index.html`);
    assert.ok(sw.includes(`'js/games/${f}'`), `falta 'js/games/${f}' en el SHELL de sw.js`);
  });
}
