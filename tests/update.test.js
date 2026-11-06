// Aviso de versión nueva (js/update.js): watchUpdates(reg, sw, show) avisa cuando hay un service
// worker en espera y, al aceptar, le manda SKIP_WAITING y recarga una sola vez.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const watchUpdates = get(loadScripts(['js/update.js']), 'watchUpdates');

function fakeWorker(state = 'installing') {
  const w = { state, posted: [], listeners: {}, postMessage: m => w.posted.push(m), addEventListener: (t, fn) => { w.listeners[t] = fn; } };
  return w;
}
function fakeReg({ waiting = null } = {}) {
  const r = { waiting, installing: null, listeners: {}, addEventListener: (t, fn) => { r.listeners[t] = fn; } };
  return r;
}
function fakeSw({ controller = {} } = {}) {
  const s = { controller, listeners: {}, addEventListener: (t, fn) => { s.listeners[t] = fn; } };
  return s;
}
function harness(regOpts, swOpts) {
  const reg = fakeReg(regOpts), sw = fakeSw(swOpts), shown = [];
  let reloads = 0;
  watchUpdates(reg, sw, (apply, dismiss) => shown.push({ apply, dismiss }), () => reloads++);
  return { reg, sw, shown, reloads: () => reloads };
}

test('un SW ya en espera al abrir la app → avisa', () => {
  const waiting = fakeWorker('installed');
  const h = harness({ waiting });
  assert.equal(h.shown.length, 1);
});

test('updatefound → installed con un controlador activo → avisa', () => {
  const h = harness();
  const w = fakeWorker();
  h.reg.installing = w;
  h.reg.listeners.updatefound();
  w.state = 'installed'; h.reg.waiting = w;
  w.listeners.statechange();
  assert.equal(h.shown.length, 1);
});

test('primera instalación (sin controlador) → no avisa', () => {
  const h = harness({}, { controller: null });
  const w = fakeWorker();
  h.reg.installing = w;
  h.reg.listeners.updatefound();
  w.state = 'installed'; h.reg.waiting = w;
  w.listeners.statechange();
  assert.equal(h.shown.length, 0);
});

test('aceptar manda SKIP_WAITING y recarga una sola vez al cambiar de controlador', () => {
  const waiting = fakeWorker('installed');
  const h = harness({ waiting });
  h.shown[0].apply();
  assert.deepEqual(waiting.posted, ['SKIP_WAITING']);
  assert.equal(h.reloads(), 0);
  h.sw.listeners.controllerchange();
  h.sw.listeners.controllerchange();
  assert.equal(h.reloads(), 1);
});

test('sin aceptar, un cambio de controlador no recarga', () => {
  const h = harness({ waiting: fakeWorker('installed') });
  h.sw.listeners.controllerchange();
  assert.equal(h.reloads(), 0);
});
