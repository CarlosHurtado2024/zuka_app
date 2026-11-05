const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/pizzeria.js')['pizzeria'];
const params = {
  maxSlices: 12,
  orders: [
    { label: '0.75', num: 3, den: 4 },
    { label: '0.333…', num: 1, den: 3 },
    { label: '40 %', num: 2, den: 5 },
    { label: 'la mitad', num: 1, den: 2 },
  ],
};
const state = orders => ({ orders });

test('fracciones exactas → correcto', () => {
  assert.equal(grade(state([{ slices: 4, shaded: 3 }, { slices: 3, shaded: 1 }, { slices: 5, shaded: 2 }, { slices: 2, shaded: 1 }]), params).ok, true);
});

test('fracciones equivalentes (6/8, 4/12, 4/10, 3/6) → correcto', () => {
  assert.equal(grade(state([{ slices: 8, shaded: 6 }, { slices: 12, shaded: 4 }, { slices: 10, shaded: 4 }, { slices: 6, shaded: 3 }]), params).ok, true);
});

test('2 de 4 para 0.333… → incorrecto y la solución da la fracción', () => {
  const r = grade(state([{ slices: 4, shaded: 3 }, { slices: 4, shaded: 2 }, { slices: 5, shaded: 2 }, { slices: 2, shaded: 1 }]), params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('0.333…') && r.solution.includes('1/3'));
});

test('un pedido sin porciones → incorrecto', () => {
  assert.equal(grade(state([{ slices: 4, shaded: 3 }, { slices: 3, shaded: 0 }, { slices: 5, shaded: 2 }, { slices: 2, shaded: 1 }]), params).ok, false);
});
