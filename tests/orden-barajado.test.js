// Los juegos que muestran opciones (parejas, fichas) las barajan de forma determinista: el orden
// en pantalla nunca es el de la respuesta, pero es el mismo cada vez que se abre el ejercicio.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const kit = loadScripts(['js/games/kit.js']);
const shuffledOrder = get(kit, 'shuffledOrder');

test('shuffledOrder: permutación de 0..n−1, igual con la misma semilla, nunca la identidad', () => {
  for (const seed of ['x⁸|x⁶|x³', 'a', 'otra semilla']) {
    const o = shuffledOrder(7, seed);
    assert.equal([...o].sort((a, b) => a - b).join(), '0,1,2,3,4,5,6');
    assert.equal(o.join(), shuffledOrder(7, seed).join());
    assert.notEqual(o.join(), '0,1,2,3,4,5,6');
  }
  assert.equal(shuffledOrder(2, 'z').join(), '1,0');
  assert.equal(shuffledOrder(1, 'z').join(), '0');
});

test('une-parejas muestra la columna derecha barajada', () => {
  const { displayOrder } = loadGame('js/games/une-parejas.js')['une-parejas'];
  const o = displayOrder({ left: ['a', 'b', 'c'], right: ['A', 'B', 'C', 'D', 'E'], pairs: [[0, 0], [1, 1], [2, 2]] });
  assert.equal([...o].sort().join(), '0,1,2,3,4');
  assert.notEqual(o.join(), '0,1,2,3,4');
});

test('ordena-terminos muestra la bandeja barajada', () => {
  const { trayOrder } = loadGame('js/games/ordena-terminos.js')['ordena-terminos'];
  const o = trayOrder({ chips: ['p', 'q', 'r', 's', 't'], order: [0, 1, 2] });
  assert.equal([...o].sort().join(), '0,1,2,3,4');
  assert.notEqual(o.join(), '0,1,2,3,4');
});
