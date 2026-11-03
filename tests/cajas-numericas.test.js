const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cajas-numericas.js')['cajas-numericas'];
const params = {
  cards: [
    { label: '7', tex: '7', set: 'N' },
    { label: '√49', tex: '\\sqrt{49}', set: 'N' },
    { label: '−8/2', tex: '-\\tfrac82', set: 'Z' },
    { label: 'π', tex: '\\pi', set: 'I' },
  ],
};

test('todas en su caja más pequeña → correcto', () => {
  assert.equal(grade({ placed: ['N', 'N', 'Z', 'I'] }, params).ok, true);
});

test('√49 en ℤ (no en la más pequeña) → incorrecto y la solución la nombra', () => {
  const r = grade({ placed: ['N', 'Z', 'Z', 'I'] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('\\sqrt{49}'));
});

test('una tarjeta sin colocar → incorrecto', () => {
  assert.equal(grade({ placed: ['N', 'N', null, 'I'] }, params).ok, false);
});
