// Orden de las tareas de una lección: el video principal, los videos de `more` (los que tienen
// `after: n` van justo antes del ejercicio n) y los ejercicios.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

// Los objetos nacen en el contexto vm (otro prototipo): se normalizan con JSON para compararlos.
const raw = get(loadScripts(['js/content.js']), 'buildQueue');
const buildQueue = l => JSON.parse(JSON.stringify(raw(l)));
const clip = n => ({ k: 'clip', n }), ex = i => ({ k: 'ex', i });

test('sin after → todos los videos primero', () => {
  assert.deepEqual(buildQueue({ clip: {}, more: [{}], ex: [1, 2] }), [clip(0), clip(1), ex(0), ex(1)]);
});

test('after: 2 intercala el video antes del tercer ejercicio', () => {
  assert.deepEqual(buildQueue({ clip: {}, more: [{ after: 2 }], ex: [1, 2, 3, 4] }), [clip(0), ex(0), ex(1), clip(1), ex(2), ex(3)]);
});

test('after mayor que los ejercicios → el video va al final', () => {
  assert.deepEqual(buildQueue({ clip: {}, more: [{ after: 9 }], ex: [1, 2] }), [clip(0), ex(0), ex(1), clip(1)]);
});

test('sin more → clip y ejercicios', () => {
  assert.deepEqual(buildQueue({ clip: {}, ex: [1] }), [clip(0), ex(0)]);
});

test('la lección 1.3 real: video 2 tras el sexto ejercicio y trece ejercicios', () => {
  const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
  const l = get(ctx, 'COURSE_ALGEBRA').units[0].lessons.find(l => l.id === 'alg-13');
  const q = buildQueue(l).map(t => t.k + (t.n ?? t.i));
  assert.deepEqual(q, ['clip0', 'ex0', 'ex1', 'ex2', 'ex3', 'ex4', 'ex5', 'clip1', 'ex6', 'ex7', 'ex8', 'ex9', 'ex10', 'ex11', 'ex12']);
});
