const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/dos-etapas.js')['dos-etapas'];
const params = { changes: [30, -20], output: 8840, max: 20000, step: 20 };

test('entrada 8.500 → correcto', () => {
  assert.equal(grade({ input: 8500 }, params).ok, true);
});

test('entrada 8.520 → incorrecto y la solución da 8 500', () => {
  const r = grade({ input: 8520 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('8\\,500'));
});

test('sin entrada → incorrecto', () => {
  assert.equal(grade({ input: null }, params).ok, false);
});
