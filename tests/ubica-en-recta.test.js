const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/ubica-en-recta.js')['ubica-en-recta'];
const params = {
  min: -3, max: 4, tol: 0.15,
  points: [
    { label: '−3/2', tex: '-\tfrac32', value: -1.5 },
    { label: '√2', tex: '\sqrt2', value: Math.SQRT2 },
    { label: 'π', tex: '\pi', value: Math.PI },
  ],
};

test('valores exactos → correcto', () => {
  assert.equal(grade({ values: [-1.5, Math.SQRT2, Math.PI] }, params).ok, true);
});

test('uno a 0.2 de su sitio → incorrecto', () => {
  assert.equal(grade({ values: [-1.5, Math.SQRT2 + 0.2, Math.PI] }, params).ok, false);
});

test('uno a 0.1 de su sitio → correcto', () => {
  assert.equal(grade({ values: [-1.4, Math.SQRT2, Math.PI] }, params).ok, true);
});

test('uno sin colocar → incorrecto', () => {
  assert.equal(grade({ values: [-1.5, null, Math.PI] }, params).ok, false);
});
