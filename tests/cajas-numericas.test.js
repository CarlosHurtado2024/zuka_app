const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, verdict } = loadGame('js/games/cajas-numericas.js')['cajas-numericas'];
const params = {
  cards: [
    { label: '12', tex: '12', set: 'N' },
    { label: '√49', tex: '\\sqrt{49}', set: 'N' },
    { label: '−8/2', tex: '-\\tfrac82', set: 'Z' },
    { label: 'π', tex: '\\pi', set: 'I' },
  ],
};

test('todas en su caja más pequeña → correcto', () => {
  assert.equal(grade({ placed: ['N', 'N', 'Z', 'I'] }, params).ok, true);
});

test('√49 en ℤ (no en la más pequeña) → incorrecto y la solución explica que ℤ también lo contiene', () => {
  const r = grade({ placed: ['N', 'Z', 'Z', 'I'] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('\\sqrt{49}') && r.solution.includes('ℤ también'), r.solution);
});

test('π en ℚ → la solución dice que está equivocada (no solo «más grande»)', () => {
  const r = grade({ placed: ['N', 'N', 'Z', 'Q'] }, params);
  assert.ok(r.solution.includes('\\pi') && !r.solution.includes('ℚ también'), r.solution);
});

test('verdict: ok en la caja mínima, bigger en una que lo contiene, wrong en otra', () => {
  assert.equal(verdict('N', 'N'), 'ok');
  assert.equal(verdict('N', 'Z'), 'bigger');
  assert.equal(verdict('N', 'R'), 'bigger');
  assert.equal(verdict('I', 'R'), 'bigger');
  assert.equal(verdict('Q', 'Z'), 'wrong');
  assert.equal(verdict('I', 'Q'), 'wrong');
  assert.equal(verdict('N', null), 'wrong');
});

test('una tarjeta sin colocar → incorrecto', () => {
  assert.equal(grade({ placed: ['N', 'N', null, 'I'] }, params).ok, false);
});
