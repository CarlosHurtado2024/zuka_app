const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/clasifica-cartas.js')['clasifica-cartas'];
const params = {
  left: 'Simple', right: 'Compuesto',
  cards: [
    { text: '100, 110, 120, 130', side: 'left', why: 'Suma 10 cada vez.' },
    { text: '100, 110, 121, 133.1', side: 'right', why: 'Multiplica por 1.1.' },
    { text: '400, 420, 440', side: 'left', why: 'Suma 20 cada vez.' },
  ],
};

test('todas las cartas en su lado → correcto', () => {
  assert.equal(grade({ answers: ['left', 'right', 'left'] }, params).ok, true);
});

test('una carta al lado contrario → incorrecto y la solución nombra la categoría', () => {
  const r = grade({ answers: ['left', 'left', 'left'] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('Compuesto') && r.solution.includes('Multiplica por 1.1.'));
});

test('una carta sin clasificar → incorrecto', () => {
  assert.equal(grade({ answers: ['left', 'right', null] }, params).ok, false);
});
