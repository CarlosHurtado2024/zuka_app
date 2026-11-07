const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade, finalPrice } = loadGame('js/games/mejor-oferta.js')['mejor-oferta'];
const params = {
  rounds: [
    { price: 100000, a: { label: '30 % y luego 20 %', changes: [-30, -20] }, b: { label: '45 % de una vez', changes: [-45] } },
    { price: 80000, a: { label: 'Sube 20 % y luego baja 20 %', changes: [20, -20] }, b: { label: 'Precio de lista', changes: [] } },
    { price: 50000, a: { label: '10 % de descuento', changes: [-10] }, b: { label: '6.000 de rebaja', off: 6000 } },
  ],
};

test('finalPrice aplica los cambios en cadena y la rebaja fija', () => {
  assert.equal(finalPrice(100000, { changes: [-30, -20] }), 56000);
  assert.equal(finalPrice(80000, { changes: [20, -20] }), 76800);
  assert.equal(finalPrice(50000, { off: 6000 }), 44000);
});

test('la tienda más barata en cada ronda (b, a, b) → correcto', () => {
  assert.equal(grade({ picks: ['b', 'a', 'b'] }, params).ok, true);
});

test('creer que 30 % + 20 % es 50 % (elegir a en la ronda 1) → incorrecto y la solución da 56.000 y 55.000', () => {
  const r = grade({ picks: ['a', 'a', 'b'] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('56.000') && r.solution.includes('55.000'));
});

test('una ronda sin elegir → incorrecto', () => {
  assert.equal(grade({ picks: ['b', 'a', null] }, params).ok, false);
});

test('la solución no usa coma decimal', () => {
  assert.ok(!/\d,\d/.test(grade({ picks: [null, null, null] }, params).solution));
});

test('la solución nombra la tienda que gana en cada ronda', () => {
  const s = grade({ picks: [null, null, null] }, params).solution;
  assert.ok(s.includes('A 56.000') && s.includes('B 55.000') && s.includes('→ B'));
});

test('empate → cualquier tienda vale, pero hay que elegir', () => {
  const tie = { rounds: [{ price: 100, a: { changes: [-50] }, b: { off: 50 } }] };
  assert.equal(grade({ picks: ['a'] }, tie).ok, true);
  assert.equal(grade({ picks: ['b'] }, tie).ok, true);
  assert.equal(grade({ picks: [null] }, tie).ok, false);
});

// Con prefer: 'high' gana la opción de mayor valor (bancos: el monto más alto).
test('prefer high: gana el banco que deja más dinero', () => {
  const banks = { prefer: 'high', noun: 'Banco', rounds: [
    { price: 1000000, a: { label: '1.2 % mensual simple, 10 meses', changes: [12] }, b: { label: '1 % mensual compuesto, 10 meses', changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] } },
    { price: 1000000, a: { label: '8 % anual simple, 5 años', changes: [40] }, b: { label: '7 % anual compuesto, 5 años', changes: [7, 7, 7, 7, 7] } },
  ] };
  assert.equal(grade({ picks: ['a', 'b'] }, banks).ok, true);
  assert.equal(grade({ picks: ['b', 'b'] }, banks).ok, false);
  assert.ok(grade({ picks: [null, null] }, banks).solution.includes('1.104.622'));
});
