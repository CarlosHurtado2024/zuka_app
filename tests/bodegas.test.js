const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/bodegas.js')['bodegas'];
const params = { total: 2000, move: 20, step: 50 };

test('1.250 sacos en A → correcto', () => {
  assert.equal(grade({ a: 1250 }, params).ok, true);
});

test('1.000 sacos en A (sin mover) → incorrecto y la solución da 1 250', () => {
  const r = grade({ a: 1000 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('1\\,250'));
});

test('1.300 sacos en A → incorrecto', () => {
  assert.equal(grade({ a: 1300 }, params).ok, false);
});
