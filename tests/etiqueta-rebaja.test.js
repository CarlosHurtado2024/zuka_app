const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/etiqueta-rebaja.js')['etiqueta-rebaja'];
const params = {
  items: [{ name: 'Tenis', price: 45000, change: -20 }, { name: 'Audífonos', price: 80000, change: -15 }, { name: 'Bicicleta', price: 60000, change: 30 }],
  stickers: [36000, 9000, 68000, 12000, 78000, 42000],
};

test('los tres precios finales bien pegados → correcto', () => {
  assert.equal(grade({ placed: [0, 2, 4] }, params).ok, true);
});

test('pegar el descuento (9.000) en vez del precio final → incorrecto y la solución da 36.000', () => {
  const r = grade({ placed: [1, 2, 4] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('36.000'));
});

test('restar en vez de aumentar (42.000 en la bicicleta) → incorrecto', () => {
  assert.equal(grade({ placed: [0, 2, 5] }, params).ok, false);
});

test('una etiqueta vacía → incorrecto', () => {
  assert.equal(grade({ placed: [0, 2, null] }, params).ok, false);
});

test('la solución muestra el factor con punto decimal', () => {
  const s = grade({ placed: [null, null, null] }, params).solution;
  assert.ok(s.includes('0.8') && s.includes('1.3') && !/\d,\d/.test(s));
});
