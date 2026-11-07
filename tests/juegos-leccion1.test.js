// Juegos nuevos de la lección 1.1: el ascensor (enteros), el pasaporte (pertenencia a ℕ, ℤ, ℚ),
// pon la rayita (período de un decimal) y acorrala la raíz (√n entre decimales cada vez más finos).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const ascensor = loadGame('js/games/ascensor.js')['ascensor'];
const pasaporte = loadGame('js/games/pasaporte-numeros.js')['pasaporte-numeros'];
const rayita = loadGame('js/games/pon-la-rayita.js')['pon-la-rayita'];
const acorrala = loadGame('js/games/acorrala-raiz.js')['acorrala-raiz'];

test('ascensor: cada viaje termina en inicio + movimiento', () => {
  const params = { min: -5, max: 6, rounds: [{ start: 2, move: -6, text: 'a' }, { start: -3, move: 3, text: 'b' }] };
  assert.equal(ascensor.grade({ floors: [-4, 0] }, params).ok, true);
  const r = ascensor.grade({ floors: [-3, 0] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('2 - 6 = -4') && r.solution.includes('-3 + 3 = 0'), r.solution);
  assert.equal(ascensor.grade({ floors: [-4, null] }, params).ok, false);
});

test('pasaporte: cada número con todos (y solo) los sellos de sus familias', () => {
  const params = { sets: ['N', 'Z', 'Q'], numbers: [{ label: '9', in: ['N', 'Z', 'Q'] }, { label: '−4', in: ['Z', 'Q'] }, { label: '3/5', in: ['Q'] }] };
  const T = true, F = false;
  assert.equal(pasaporte.grade({ stamps: [[T, T, T], [F, T, T], [F, F, T]] }, params).ok, true);
  const r = pasaporte.grade({ stamps: [[T, F, F], [F, T, T], [F, F, T]] }, params);
  assert.equal(r.ok, false, 'al 9 le faltan sellos');
  assert.ok(r.solution.includes('9: ℕ, ℤ y ℚ'), r.solution);
  assert.equal(pasaporte.grade({ stamps: [[T, T, T], [T, T, T], [F, F, T]] }, params).ok, false, '−4 no es natural');
});

test('pon la rayita: expand calcula cifras, parte fija y período', () => {
  const e = rayita.expand(5, 11, 8);
  assert.equal(`${e.int}|${e.digits.join('')}|${e.pre}|${e.period}`, '0|45454545|0|2');
  const f = rayita.expand(1, 6, 6);
  assert.equal(`${f.int}|${f.digits.join('')}|${f.pre}|${f.period}`, '0|166666|1|1');
  const g = rayita.expand(23, 12, 6);
  assert.equal(`${g.int}|${g.digits.join('')}|${g.pre}|${g.period}`, '1|916666|2|1');
  const h = rayita.expand(3, 7, 12);
  assert.equal(`${h.digits.join('')}|${h.pre}|${h.period}`, '428571428571|0|6');
  assert.equal(rayita.expand(3, 8, 5).period, 0, '3/8 termina');
});

test('pon la rayita: vale solo la rayita más corta, desde donde empieza a repetirse', () => {
  const params = { rounds: [{ num: 5, den: 11 }, { num: 1, den: 6 }] };
  assert.equal(rayita.grade({ marks: [{ start: 0, len: 2 }, { start: 1, len: 1 }] }, params).ok, true);
  assert.equal(rayita.grade({ marks: [{ start: 0, len: 4 }, { start: 1, len: 1 }] }, params).ok, false, '4545 no es el bloque más corto');
  assert.equal(rayita.grade({ marks: [{ start: 0, len: 2 }, { start: 0, len: 2 }] }, params).ok, false, 'en 1/6 el 1 no se repite');
  const r = rayita.grade({ marks: [null, { start: 1, len: 1 }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('0.\\overline{45}') && r.solution.includes('0.1\\overline{6}'), r.solution);
});

test('acorrala la raíz: las cifras elegidas son las de √n', () => {
  assert.equal(acorrala.digitsOf(5, 3).join(''), '236');
  assert.equal(acorrala.digitsOf(10, 3).join(''), '162');
  const params = { rounds: [{ n: 5 }, { n: 10 }], levels: 3 };
  assert.equal(acorrala.grade({ picks: [[2, 3, 6], [1, 6, 2]] }, params).ok, true);
  const r = acorrala.grade({ picks: [[2, 4, 0], [1, 6, 2]] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('2.236 < \\sqrt{5} < 2.237'), r.solution);
  assert.equal(acorrala.grade({ picks: [[2, 3], [1, 6, 2]] }, params).ok, false, 'faltan niveles');
});
