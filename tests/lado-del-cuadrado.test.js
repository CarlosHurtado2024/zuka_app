const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/lado-del-cuadrado.js')['lado-del-cuadrado'];
// La tolerancia es sobre el lado (en unidades), no sobre el área: así el margen es el mismo en todas las rondas.
const params = { rounds: [{ area: 36 }, { area: 12.25 }, { area: 3 }], max: 10, step: 0.05, tol: 0.05 };

test('lados 6, 3.5 y 1.75 → correcto (1.75 está a menos de 0.05 de √3)', () => {
  assert.equal(grade({ sides: [6, 3.5, 1.75] }, params).ok, true);
});

test('lado 1.65 para el área 3 → incorrecto (se pasa de la tolerancia del lado)', () => {
  assert.equal(grade({ sides: [6, 3.5, 1.65] }, params).ok, false);
});

test('lado 5.9 en la primera ronda → incorrecto y la solución da √36 = 6 y √3 ≈ 1.73', () => {
  const r = grade({ sides: [5.9, 3.5, 1.75] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('\\sqrt{36} = 6'), r.solution);
  assert.ok(r.solution.includes('\\sqrt{3} \\approx 1.73'), r.solution);
});

test('una ronda sin lado → incorrecto', () => {
  assert.equal(grade({ sides: [6, null, 1.75] }, params).ok, false);
});
