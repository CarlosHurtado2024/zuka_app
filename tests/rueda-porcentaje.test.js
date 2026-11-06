const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/rueda-porcentaje.js')['rueda-porcentaje'];
const params = { rounds: [{ part: 51, whole: 170 }, { part: 63, whole: 180 }, { part: 26.4, whole: 240 }], tol: 1 };

test('30, 35 y 11 → correcto', () => {
  assert.equal(grade({ pct: [30, 35, 11] }, params).ok, true);
});

test('30,9 (dentro de la tolerancia) → correcto', () => {
  assert.equal(grade({ pct: [30.9, 35, 11] }, params).ok, true);
});

test('32 en la primera ronda → incorrecto y la solución da 30', () => {
  const r = grade({ pct: [32, 35, 11] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('30'));
});

test('sin girar → incorrecto', () => {
  assert.equal(grade({ pct: [null, null, null] }, params).ok, false);
});
