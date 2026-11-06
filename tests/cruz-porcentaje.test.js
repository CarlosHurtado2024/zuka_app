const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/cruz-porcentaje.js')['cruz-porcentaje'];
const params = {
  problems: [
    { text: 'Halla el 12 % de 8.000', chips: [{ label: '12', cell: 'p' }, { label: '8.000', cell: 'C' }, { label: '?', cell: 'B' }] },
    { text: '¿De qué número es 48 el 8 %?', chips: [{ label: '8', cell: 'p' }, { label: '48', cell: 'B' }, { label: '?', cell: 'C' }] },
    { text: '¿De qué número es 408 el 70 % más?', chips: [{ label: '170', cell: 'p' }, { label: '408', cell: 'B' }, { label: '?', cell: 'C' }, { label: '70', cell: null }] },
  ],
};
const exact = [{ cells: { p: 0, C: 1, B: 2 } }, { cells: { p: 0, C: 2, B: 1 } }, { cells: { p: 0, C: 2, B: 1 } }];
const state = (...ps) => ({ problems: ps });

test('colocación exacta en los tres problemas → correcto', () => {
  assert.equal(grade(state(...exact), params).ok, true);
});

test('el 70 en lugar del 170 → incorrecto y la solución da 170', () => {
  const r = grade(state(exact[0], exact[1], { cells: { p: 3, C: 2, B: 1 } }), params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('170'));
});

test('una casilla vacía → incorrecto', () => {
  assert.equal(grade(state({ cells: { p: 0, C: 1, B: null } }, exact[1], exact[2]), params).ok, false);
});

test('todo vacío → incorrecto', () => {
  const empty = { cells: { p: null, C: null, B: null } };
  assert.equal(grade(state(empty, empty, empty), params).ok, false);
});
