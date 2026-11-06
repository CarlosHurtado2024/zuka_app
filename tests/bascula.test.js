const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/bascula.js')['bascula'];
const params = { knownKg: 3, knownPrice: 12000, askKg: 5, max: 40000, step: 500, tol: 200 };

test('20.000 → correcto', () => {
  assert.equal(grade({ price: 20000 }, params).ok, true);
});

test('19.900 (dentro de la tolerancia) → correcto', () => {
  assert.equal(grade({ price: 19900 }, params).ok, true);
});

test('19.000 → incorrecto y la solución da 20 000', () => {
  const r = grade({ price: 19000 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('20\\,000'));
});

test('sin precio → incorrecto', () => {
  assert.equal(grade({ price: null }, params).ok, false);
});
