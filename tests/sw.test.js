// El service worker precachea p5.js al instalarse: sin eso, cada versión nueva borra la caché vieja
// y los minijuegos dejan de funcionar sin conexión hasta volver a abrir uno con red.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { ROOT } = require('./load');

const P5_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js';

function installSW() {
  const listeners = {};
  const cached = [];
  const cache = { addAll: async list => cached.push(...list), add: async url => cached.push(url) };
  const self = {
    addEventListener: (type, fn) => { listeners[type] = fn; },
    skipWaiting: async () => {},
    location: { origin: 'http://localhost' },
  };
  const ctx = vm.createContext({ self, caches: { open: async () => cache }, URL, console });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), ctx, { filename: 'sw.js' });
  return { listeners, cached };
}

test('install precachea p5.js junto con el shell', async () => {
  const { listeners, cached } = installSW();
  let pending;
  listeners.install({ waitUntil: p => { pending = p; } });
  await pending;
  assert.ok(cached.includes('js/games/kit.js'));
  assert.ok(cached.includes(P5_URL));
});
