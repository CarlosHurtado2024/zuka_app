const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/directa-inversa.js')['directa-inversa'];
const params = {
  items: [
    { text: 'Kilómetros recorridos y litros gastados', kind: 'directa' },
    { text: 'Obreros y días para terminar la obra', kind: 'inversa' },
    { text: 'Lado y área de un cuadrado', kind: 'ninguna' },
  ],
};

test('todas bien clasificadas → correcto', () => {
  assert.equal(grade({ assigned: ['directa', 'inversa', 'ninguna'] }, params).ok, true);
});

test('lado y área del cuadrado en directa → incorrecto', () => {
  assert.equal(grade({ assigned: ['directa', 'inversa', 'directa'] }, params).ok, false);
});

test('una sin clasificar → incorrecto', () => {
  assert.equal(grade({ assigned: ['directa', null, 'ninguna'] }, params).ok, false);
});
