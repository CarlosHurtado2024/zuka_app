const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cadena-razones.js')['cadena-razones'];
const params = {
  base: 28, unit: 'días',
  factors: [{ label: 'hombres', a: 9, b: 7, inverse: true }, { label: 'horas/día', a: 6, b: 8, inverse: true }],
  answer: 27,
};

test('ninguna tarjeta volteada (9/7 y 6/8) → correcto', () => {
  assert.equal(grade({ flipped: [false, false] }, params).ok, true);
});

test('una tarjeta volteada → incorrecto y la solución da 27', () => {
  const r = grade({ flipped: [true, false] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('27'));
});

test('las dos volteadas → incorrecto', () => {
  assert.equal(grade({ flipped: [true, true] }, params).ok, false);
});
