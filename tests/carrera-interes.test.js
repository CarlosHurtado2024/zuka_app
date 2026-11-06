const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/carrera-interes.js')['carrera-interes'];
const params = { capital: 2000000, rate: 0.015, months: 24, gap: 50000 };

test('mes 15 → correcto', () => {
  assert.equal(grade({ month: 15 }, params).ok, true);
});

test('mes 16 (también supera la brecha, pero no es el primero) → incorrecto', () => {
  assert.equal(grade({ month: 16 }, params).ok, false);
});

test('mes 14 → incorrecto y la solución da 15', () => {
  const r = grade({ month: 14 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('15'));
});

test('sin mes → incorrecto', () => {
  assert.equal(grade({ month: null }, params).ok, false);
});
