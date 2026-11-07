const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, partial } = loadGame('js/games/limite-serie.js')['limite-serie'];
const params = { a1: 9, r: 1 / 3, max: 20, step: 0.5, tol: 0.26 };

test('partial da las sumas parciales', () => {
  assert.equal(partial(1, params), 9);
  assert.equal(partial(2, params), 12);
  assert.equal(partial(3, params), 13);
});

test('13.5 → correcto (y 13.5 ± 0.25 también)', () => {
  assert.equal(grade({ guess: 13.5 }, params).ok, true);
  assert.equal(grade({ guess: 13.25 }, params).ok, true);
});

test('13 (la tercera suma parcial) → incorrecto y la solución da 13.5', () => {
  const r = grade({ guess: 13 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('13.5'));
});

test('sin marcador → incorrecto', () => {
  assert.equal(grade({ guess: null }, params).ok, false);
});
