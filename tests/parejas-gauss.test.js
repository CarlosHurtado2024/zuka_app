const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/parejas-gauss.js')['parejas-gauss'];
const params = { terms: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43] };

test('cinco parejas de extremos (suma 46) y el 23 solo → correcto', () => {
  assert.equal(grade({ pairs: [[0, 10], [1, 9], [2, 8], [3, 7], [4, 6]] }, params).ok, true);
});

test('el orden de las parejas y dentro de la pareja no importa', () => {
  assert.equal(grade({ pairs: [[6, 4], [2, 8], [10, 0], [9, 1], [7, 3]] }, params).ok, true);
});

test('una pareja que no suma 46 → incorrecto y la solución da 46 y 253', () => {
  const r = grade({ pairs: [[0, 9], [1, 10], [2, 8], [3, 7], [4, 6]] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('46') && r.solution.includes('253'));
});

test('faltan parejas → incorrecto', () => {
  assert.equal(grade({ pairs: [[0, 10], [1, 9]] }, params).ok, false);
});

test('una ficha usada dos veces → incorrecto', () => {
  assert.equal(grade({ pairs: [[0, 10], [0, 10], [2, 8], [3, 7], [4, 6]] }, params).ok, false);
});

test('con un número par de términos no sobra ninguno', () => {
  const even = { terms: [2, 4, 6, 8] };
  assert.equal(grade({ pairs: [[0, 3], [1, 2]] }, even).ok, true);
  assert.equal(grade({ pairs: [[0, 3]] }, even).ok, false);
});
