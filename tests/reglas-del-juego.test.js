const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/reglas-del-juego.js')['reglas-del-juego'];
const params = {
  rules: ['Conmutativa', 'Distributiva', 'Neutro'],
  items: [
    { label: 'a + b = b + a', tex: 'a+b=b+a', rule: 'Conmutativa' },
    { label: 'a(b + c) = ab + ac', tex: 'a(b+c)=ab+ac', rule: 'Distributiva' },
    { label: 'a + 0 = a', tex: 'a+0=a', rule: 'Neutro' },
  ],
};

test('todas las etiquetas correctas → correcto', () => {
  assert.equal(grade({ assigned: ['Conmutativa', 'Distributiva', 'Neutro'] }, params).ok, true);
});

test('una etiqueta cambiada → incorrecto y la solución la nombra', () => {
  const r = grade({ assigned: ['Neutro', 'Distributiva', 'Neutro'] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('Conmutativa'));
});

test('una igualdad sin etiqueta → incorrecto', () => {
  assert.equal(grade({ assigned: ['Conmutativa', null, 'Neutro'] }, params).ok, false);
});
