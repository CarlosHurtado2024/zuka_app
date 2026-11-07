const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, amount } = loadGame('js/games/ajusta-capital.js')['ajusta-capital'];
const params = { rate: 0.03, periods: 4, target: 1125509, step: 50000, max: 2000000, tol: 1 };

test('amount capitaliza periodo a periodo', () => {
  assert.ok(Math.abs(amount(1000000, params) - 1125508.81) < 0.01);
});

test('capital 1.000.000 → monto 1.125.509 → correcto', () => {
  assert.equal(grade({ capital: 1000000 }, params).ok, true);
});

test('capital 1.050.000 → incorrecto y la solución da 1.000.000', () => {
  const r = grade({ capital: 1050000 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('1\\,000\\,000'));
});

test('sin capital → incorrecto', () => {
  assert.equal(grade({ capital: null }, params).ok, false);
});
