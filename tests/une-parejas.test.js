const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/une-parejas.js')['une-parejas'];
const params = { left: ['x³ · x⁵', '(x²)³', 'x⁵ / x²'], right: ['x⁸', 'x⁶', 'x³', 'x¹⁵'], pairs: [[0, 0], [1, 1], [2, 2]] };

test('cada expresión con su pareja → correcto', () => {
  assert.equal(grade({ links: [0, 1, 2] }, params).ok, true);
});

test('x³·x⁵ unido a x¹⁵ → incorrecto y la solución muestra x⁸', () => {
  const r = grade({ links: [3, 1, 2] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('x⁸'));
});

test('una expresión sin unir → incorrecto', () => {
  assert.equal(grade({ links: [0, 1, null] }, params).ok, false);
});

test('las parejas pueden venir en cualquier orden', () => {
  const p = { left: ['a', 'b'], right: ['B', 'A'], pairs: [[1, 0], [0, 1]] };
  assert.equal(grade({ links: [1, 0] }, p).ok, true);
  assert.equal(grade({ links: [0, 1] }, p).ok, false);
});
