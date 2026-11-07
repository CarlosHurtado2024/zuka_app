const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/lado-del-cuadrado.js')['lado-del-cuadrado'];
const params = { rounds: [{ area: 49 }, { area: 20.25 }, { area: 2 }], max: 10, step: 0.01, tol: 0.4 };

test('lados 7, 4.5 y 1.41 → correcto (la tolerancia es sobre el área)', () => {
  assert.equal(grade({ sides: [7, 4.5, 1.41] }, params).ok, true);
});

test('lado 7.2 en la primera ronda (área 51.84) → incorrecto y la solución da √49 = 7', () => {
  const r = grade({ sides: [7.2, 4.5, 1.41] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('7') && r.solution.includes('1.41'));
});

test('una ronda sin lado → incorrecto', () => {
  assert.equal(grade({ sides: [7, null, 1.41] }, params).ok, false);
});
