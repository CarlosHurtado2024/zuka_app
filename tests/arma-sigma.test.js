const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/arma-sigma.js')['arma-sigma'];
const params = {
  rounds: [
    { text: '3 + 6 + 9 + … + 30', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '10', cell: 'upper' }, { label: '3k', cell: 'term' }, { label: 'k = 0', cell: null }, { label: '30', cell: null }, { label: 'k + 3', cell: null }] },
    { text: '1 + 4 + 9 + … + 64', chips: [{ label: 'k = 1', cell: 'lower' }, { label: '8', cell: 'upper' }, { label: 'k²', cell: 'term' }, { label: '64', cell: null }, { label: '2k', cell: null }] },
  ],
};
const exact = [{ cells: { lower: 0, upper: 1, term: 2 } }, { cells: { lower: 0, upper: 1, term: 2 } }];

test('las tres casillas bien en las dos rondas → correcto', () => {
  assert.equal(grade({ rounds: exact }, params).ok, true);
});

test('el 30 como límite superior → incorrecto y la solución muestra la sigma correcta', () => {
  const r = grade({ rounds: [{ cells: { lower: 0, upper: 4, term: 2 } }, exact[1]] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('k=1') && r.solution.includes('10') && r.solution.includes('3k'));
});

test('una casilla vacía → incorrecto', () => {
  assert.equal(grade({ rounds: [exact[0], { cells: { lower: 0, upper: 1, term: null } }] }, params).ok, false);
});
