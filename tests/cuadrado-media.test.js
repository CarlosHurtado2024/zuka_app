const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cuadrado-media.js')['cuadrado-media'];
const params = { w: 4, h: 25, tol: 0.2 };

test('lado 10 → correcto', () => {
  assert.equal(grade({ side: 10 }, params).ok, true);
});

test('lado 9.9 → correcto (dentro de la tolerancia)', () => {
  assert.equal(grade({ side: 9.9 }, params).ok, true);
});

test('lado 9.5 → incorrecto', () => {
  assert.equal(grade({ side: 9.5 }, params).ok, false);
});
