const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/ordena-terminos.js')['ordena-terminos'];
const params = { tex: '\\sum_{k=2}^{5} (k^2 - 1)', chips: ['3', '8', '15', '24', '1', '35'], order: [0, 1, 2, 3], result: '50' };

test('las fichas en orden → correcto', () => {
  assert.equal(grade({ boxes: [0, 1, 2, 3] }, params).ok, true);
});

test('empezar en k = 1 (el 1 en la primera caja) → incorrecto y la solución lista los términos', () => {
  const r = grade({ boxes: [4, 0, 1, 2] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('3 + 8 + 15 + 24') && r.solution.includes('50'));
});

test('las fichas correctas pero desordenadas → incorrecto', () => {
  assert.equal(grade({ boxes: [1, 0, 2, 3] }, params).ok, false);
});

test('una caja vacía → incorrecto', () => {
  assert.equal(grade({ boxes: [0, 1, 2, null] }, params).ok, false);
});

test('con sep "=" la solución encadena los pasos y no añade el resultado', () => {
  const steps = { tex: 'x', chips: ['a', 'b', 'c', 'd'], order: [0, 1, 2], sep: '=' };
  assert.equal(grade({ boxes: [0, 1, 2] }, steps).ok, true);
  assert.equal(grade({ boxes: [0, 1, 2] }, steps).solution, 'a = b = c');
});
