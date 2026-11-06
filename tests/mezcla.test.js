const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/mezcla.js')['mezcla'];
const params = { solute: 40, target: 20, step: 10, max: 400 };

test('160 g de agua → correcto', () => {
  assert.equal(grade({ water: 160 }, params).ok, true);
});

test('150 g de agua → incorrecto y la solución da 160', () => {
  const r = grade({ water: 150 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('160'));
});

test('sin agua → incorrecto', () => {
  assert.equal(grade({ water: 0 }, params).ok, false);
});
