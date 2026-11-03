const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/ecuacion-familia.js')['ecuacion-familia'];
const params = {
  pairs: [
    { left: 'x + 5 = 2', right: 'ℤ' },
    { left: '3x = 2', right: 'ℚ' },
    { left: 'x² = 2', right: '𝕀' },
    { left: 'x² + 1 = 0', right: 'fuera de ℝ' },
  ],
};

test('las 4 uniones correctas → correcto', () => {
  assert.equal(grade({ links: [0, 1, 2, 3] }, params).ok, true);
});

test('dos ecuaciones a la misma familia → incorrecto', () => {
  assert.equal(grade({ links: [0, 0, 2, 3] }, params).ok, false);
});

test('una ecuación sin unir → incorrecto', () => {
  assert.equal(grade({ links: [0, 1, null, 3] }, params).ok, false);
});
