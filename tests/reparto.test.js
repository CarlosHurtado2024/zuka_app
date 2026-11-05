const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/reparto.js')['reparto'];
const params = { total: 1200000, parts: [2, 3, 5], tol: 0.02 };

test('cortes en 0.2 y 0.5 → correcto', () => {
  assert.equal(grade({ cuts: [0.2, 0.5] }, params).ok, true);
});

test('cortes invertidos (0.5, 0.2) → correcto', () => {
  assert.equal(grade({ cuts: [0.5, 0.2] }, params).ok, true);
});

test('cortes en 0.25 y 0.5 → incorrecto', () => {
  assert.equal(grade({ cuts: [0.25, 0.5] }, params).ok, false);
});
