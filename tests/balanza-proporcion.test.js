const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/balanza-proporcion.js')['balanza-proporcion'];
const params = { a: 3, b: 5, d: 20, min: 0, max: 30 };

test('x = 12 equilibra 3/5 = x/20 → correcto', () => {
  assert.equal(grade({ x: 12 }, params).ok, true);
});

test('x = 11 → incorrecto y la solución dice 12', () => {
  const r = grade({ x: 11 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('12'));
});
