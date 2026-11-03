const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/maquina-fracciones.js')['maquina-fracciones'];
const params = { decimal: '0.\overline{27}', target: [3, 11], max: 999 };

test('27/99 (equivalente) → correcto', () => {
  assert.equal(grade({ num: 27, den: 99 }, params).ok, true);
});

test('3/11 → correcto', () => {
  assert.equal(grade({ num: 3, den: 11 }, params).ok, true);
});

test('27/100 → incorrecto', () => {
  assert.equal(grade({ num: 27, den: 100 }, params).ok, false);
});

test('denominador 0 → incorrecto', () => {
  assert.equal(grade({ num: 5, den: 0 }, params).ok, false);
});
