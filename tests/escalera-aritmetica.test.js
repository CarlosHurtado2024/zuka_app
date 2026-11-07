const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/escalera-aritmetica.js')['escalera-aritmetica'];
const params = { a1: 6, n: 10, target: 42, step: 1, max: 10 };

test('d = 4 → el peldaño 10 mide 42 → correcto', () => {
  assert.equal(grade({ d: 4 }, params).ok, true);
});

test('d = 5 → incorrecto y la solución da d = 4', () => {
  const r = grade({ d: 5 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('d = 4'));
});

test('sin d → incorrecto', () => {
  assert.equal(grade({ d: null }, params).ok, false);
});
