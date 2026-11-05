const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/distancia-justa.js')['distancia-justa'];
const params = { min: -10, max: 6, a: -3, d: 5 };

test('b = 2 → correcto', () => {
  assert.equal(grade({ b: 2 }, params).ok, true);
});

test('b = −8 (la otra solución) → correcto', () => {
  assert.equal(grade({ b: -8 }, params).ok, true);
});

test('b = 3 → incorrecto y la solución nombra ambas', () => {
  const r = grade({ b: 3 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('2') && r.solution.includes('-8'));
});

test('sin colocar → incorrecto', () => {
  assert.equal(grade({ b: null }, params).ok, false);
});
