const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const { grade } = loadGame('js/games/arma-regla.js')['arma-regla'];
const params = {
  problems: [
    { text: 'Un ciclista recorre 150 km en 5 horas. ¿Cuántos km recorre en 7 horas?', kind: 'directa',
      chips: [{ label: '150 km', mag: 0, row: 0 }, { label: '5 h', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '7 h', mag: 1, row: 1 }] },
    { text: '12 obreros terminan una obra en 30 días. ¿Cuántos obreros la terminan en 24 días?', kind: 'inversa',
      chips: [{ label: '12 obreros', mag: 0, row: 0 }, { label: '30 días', mag: 1, row: 0 }, { label: 'x', mag: 0, row: 1 }, { label: '24 días', mag: 1, row: 1 }] },
  ],
};
const exact = arrow => ({ cells: [[0, 1], [2, 3]], arrow });
const state = (p0, p1) => ({ problems: [p0, p1] });

test('colocación exacta y flechas correctas → correcto', () => {
  assert.equal(grade(state(exact('directa'), exact('inversa')), params).ok, true);
});

test('filas intercambiadas → correcto', () => {
  assert.equal(grade(state({ cells: [[2, 3], [0, 1]], arrow: 'directa' }, exact('inversa')), params).ok, true);
});

test('columnas intercambiadas (horas a la izquierda) → correcto', () => {
  assert.equal(grade(state({ cells: [[1, 0], [3, 2]], arrow: 'directa' }, exact('inversa')), params).ok, true);
});

test('una ficha en la columna equivocada → incorrecto', () => {
  assert.equal(grade(state({ cells: [[1, 0], [2, 3]], arrow: 'directa' }, exact('inversa')), params).ok, false);
});

test('flecha directa en el problema inverso → incorrecto y la solución habla de cruzadas', () => {
  const r = grade(state(exact('directa'), exact('directa')), params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('cruzadas'));
});

test('sin flecha → incorrecto', () => {
  assert.equal(grade(state(exact('directa'), exact(null)), params).ok, false);
});
