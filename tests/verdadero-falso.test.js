const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/verdadero-falso.js')['verdadero-falso'];
const params = {
  cards: [
    { text: 'Todo número natural es también entero', truth: true, why: 'ℕ está dentro de ℤ' },
    { text: 'Todo número entero es natural', truth: false, why: '−3 es entero pero no natural' },
    { text: '0.75 es un número racional', truth: true, why: '0.75 = 3/4' },
  ],
};

test('todas las respuestas correctas → correcto', () => {
  assert.equal(grade({ answers: [true, false, true] }, params).ok, true);
});

test('una respuesta mal → incorrecto y la solución da la razón', () => {
  const r = grade({ answers: [true, true, true] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('−3 es entero pero no natural'));
});

test('una tarjeta sin responder → incorrecto', () => {
  assert.equal(grade({ answers: [true, null, true] }, params).ok, false);
});
