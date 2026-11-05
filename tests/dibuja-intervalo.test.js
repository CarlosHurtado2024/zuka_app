const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/dibuja-intervalo.js')['dibuja-intervalo'];
const params = { min: -5, max: 7, a: -2, b: 5, aClosed: true, bClosed: false };

test('−2 lleno y 5 vacío → correcto', () => {
  assert.equal(grade({ left: -2, right: 5, leftClosed: true, rightClosed: false }, params).ok, true);
});

test('asas cruzadas (5 y −2) → se normaliza y es correcto', () => {
  assert.equal(grade({ left: 5, right: -2, leftClosed: false, rightClosed: true }, params).ok, true);
});

test('−2 vacío → incorrecto', () => {
  assert.equal(grade({ left: -2, right: 5, leftClosed: false, rightClosed: false }, params).ok, false);
});

test('extremo derecho en 4 → incorrecto', () => {
  assert.equal(grade({ left: -2, right: 4, leftClosed: true, rightClosed: false }, params).ok, false);
});
