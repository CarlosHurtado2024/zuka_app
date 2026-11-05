const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/limonada.js')['limonada'];
const params = { base: [2, 3], minLemons: 4, maxEach: 12 };

test('4 limones y 6 vasos → correcto', () => {
  assert.equal(grade({ lemons: 4, water: 6 }, params).ok, true);
});

test('6 limones y 9 vasos → correcto', () => {
  assert.equal(grade({ lemons: 6, water: 9 }, params).ok, true);
});

test('2 : 3 exacto pero con menos de 4 limones → incorrecto', () => {
  assert.equal(grade({ lemons: 2, water: 3 }, params).ok, false);
});

test('4 : 5 → incorrecto', () => {
  assert.equal(grade({ lemons: 4, water: 5 }, params).ok, false);
});
