const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cascada.js')['cascada'];
const params = { price: 100000, changes: [-30, -20], step: 1 };

test('dos stickers y 44 % → correcto', () => {
  assert.equal(grade({ applied: [0, 1], single: 44 }, params).ok, true);
});

test('stickers en el otro orden → correcto', () => {
  assert.equal(grade({ applied: [1, 0], single: 44 }, params).ok, true);
});

test('50 % → incorrecto y la solución da 44', () => {
  const r = grade({ applied: [0, 1], single: 50 }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('44'));
});

test('un solo sticker → incorrecto', () => {
  assert.equal(grade({ applied: [0], single: 44 }, params).ok, false);
});

test('sticker repetido → incorrecto', () => {
  assert.equal(grade({ applied: [0, 0, 1], single: 44 }, params).ok, false);
});

test('la solución usa punto decimal', () => {
  const s = grade({ applied: [0, 1], single: 50 }, params).solution;
  assert.ok(s.includes('0.7') && s.includes('0.56') && !s.includes('{,}'));
});
