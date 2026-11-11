// Juegos de Geometría Vectorial y Analítica: fila a fila (operaciones elementales), afina el sistema,
// combina vectores, flecha vector y cónica viva. Se prueba la calificación y las funciones puras.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const G = name => loadGame(`js/games/${name}.js`)[name];
const fila = G('fila-a-fila'), afina = G('afina-sistema'), combina = G('combina-vectores'), flecha = G('flecha-vector'), conica = G('conica-viva');
const txt = M => JSON.stringify(M.map(r => r.map(fila.F.txt)));

test('fila: fracciones exactas', () => {
  const { F } = fila;
  assert.equal(F.txt(F.add(F.of(1, 2), F.of(1, 3))), '5/6');
  assert.equal(F.txt(F.mul(F.of(-2, 3), F.of(3, 4))), '−1/2');
  assert.equal(F.txt(F.of(4, -2)), '−2');
  assert.equal(F.txt(F.of(0, 5)), '0');
});

test('fila: las tres operaciones elementales', () => {
  const M = [[1, 2, 3], [2, 5, 4]];
  assert.equal(txt(fila.apply(M, [{ t: 'swap', i: 0, j: 1 }])), txt(fila.apply([[2, 5, 4], [1, 2, 3]], [])));
  assert.equal(txt(fila.apply(M, [{ t: 'add', i: 1, j: 0, k: [-2, 1] }])), '[["1","2","3"],["0","1","−2"]]');
  assert.equal(txt(fila.apply(M, [{ t: 'scale', i: 0, k: [1, 2] }])), '[["1/2","1","3/2"],["2","5","4"]]');
  assert.equal(txt(M.map(r => r.map(v => fila.F.of(v)))), '[["1","2","3"],["2","5","4"]]', 'no cambia la matriz original');
});

test('fila: escalonada y reducida miran solo el bloque izquierdo', () => {
  const of = M => M.map(r => r.map(v => fila.F.of(v)));
  assert.equal(fila.isEchelon(of([[2, 1, 5], [0, 3, 1]]), 2), true);
  assert.equal(fila.isEchelon(of([[0, 3, 1], [2, 1, 5]]), 2), false);
  assert.equal(fila.isReduced(of([[2, 1, 5], [0, 3, 1]]), 2), false);
  assert.equal(fila.isReduced(of([[1, 0, 5], [0, 1, 1]]), 2), true);
  assert.equal(fila.isReduced(of([[1, 2, 5], [0, 0, 3]]), 2), true, 'sistema sin solución: la fila 0 0 | 3 vale');
  assert.equal(fila.isEchelon(of([[0, 0, 3], [1, 2, 5]]), 2), false, 'las filas nulas van abajo');
  assert.equal(fila.isReduced(of([[1, 0, 0, 1, -1, 0], [0, 1, 0, 0, 1, 0], [0, 0, 1, 0, 0, 1]]), 3), true);
});

test('fila: califica repitiendo las operaciones', () => {
  const params = { rounds: [{ M: [[1, 2, 5], [3, 4, 6]], aug: 1, goal: 'reducida' }, { M: [[2, 4], [1, 3]], goal: 'escalonada', det: true }] };
  const ops1 = [{ t: 'add', i: 1, j: 0, k: [-3, 1] }, { t: 'scale', i: 1, k: [-1, 2] }, { t: 'add', i: 0, j: 1, k: [-2, 1] }];
  const ops2 = [{ t: 'add', i: 1, j: 0, k: [-1, 2] }];
  assert.equal(fila.grade({ ops: [ops1, ops2] }, params).ok, true);
  const bad = fila.grade({ ops: [ops1.slice(0, 2), ops2] }, params);
  assert.equal(bad.ok, false);
  assert.ok(bad.solution.includes('−4') && bad.solution.includes('9/2'), bad.solution);
  assert.equal(fila.grade({ ops: [ops1, [{ t: 'scale', i: 0, k: [0, 1] }]] }, params).ok, false, 'multiplicar por 0 no es elemental');
  assert.equal(fila.grade({ ops: [ops1, [...ops2, { t: 'add', i: 0, j: 1, k: [0, 1] }]] }, params).ok, false, 'sumar 0 veces otra fila no cuenta');
});

test('fila: el determinante se lleva con el factor', () => {
  assert.equal(fila.F.txt(fila.detFactor([{ t: 'swap', i: 0, j: 1 }, { t: 'scale', i: 0, k: [1, 3] }, { t: 'add', i: 1, j: 0, k: [5, 1] }])), '−3');
  assert.equal(fila.F.txt(fila.det([[2, 4], [1, 3]])), '2');
  assert.equal(fila.F.txt(fila.det([[1, 2, 3], [0, 1, 4], [5, 6, 0]])), '1');
});

test('afina: tipo de sistema 2×2 y su solución', () => {
  assert.equal(afina.kind([1, 1, 3], [1, -1, 1]), 'unica');
  assert.equal(afina.solve([1, 1, 3], [1, -1, 1]).join(), '2,1');
  assert.equal(afina.kind([1, 2, 3], [2, 4, 5]), 'ninguna');
  assert.equal(afina.kind([1, 2, 3], [2, 4, 6]), 'infinitas');
  const params = { rounds: [{ e1: [1, 2, 3], e2: [2, 4, 1], free: [[1, 2]], goal: 'infinitas' }, { e1: [1, 1, 0], e2: [1, -1, 0], free: [[0, 2], [1, 2]], goal: 'punto', P: [2, 1] }] };
  assert.equal(afina.grade({ eqs: [[[1, 2, 3], [2, 4, 6]], [[1, 1, 3], [1, -1, 1]]] }, params).ok, true);
  const r = afina.grade({ eqs: [[[1, 2, 3], [2, 4, 5]], [[1, 1, 3], [1, -1, 1]]] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('6'), r.solution);
});

test('combina: a·u + b·v llega a la estrella', () => {
  const params = { rounds: [{ u: [1, 2], v: [3, -1], target: [5, 3] }, { u: [2, 0], v: [1, 1], target: [1, 2], step: 0.5 }] };
  assert.equal(combina.coefs(params.rounds[0]).join(), '2,1');
  assert.equal(combina.grade({ ab: [[2, 1], [-0.5, 2]] }, params).ok, true);
  const r = combina.grade({ ab: [[1, 1], [-0.5, 2]] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('a = 2') && r.solution.includes('b = 1'), r.solution);
});

test('flecha: vector esperado o condición', () => {
  const params = { rounds: [
    { given: [{ v: [2, 1], name: 'u' }, { v: [1, 3], name: 'v' }], ans: [3, 4] },
    { given: [{ v: [3, 1], name: 'u' }], check: (w) => w[0] * 3 + w[1] * 1 === 0 && (w[0] || w[1]), sol: 'cualquier múltiplo de (−1, 3)', tail: [1, 1] },
  ] };
  assert.equal(flecha.grade({ vecs: [{ tail: [0, 0], tip: [3, 4] }, { tail: [1, 1], tip: [0, 4] }] }, params).ok, true);
  assert.equal(flecha.grade({ vecs: [{ tail: [1, 1], tip: [4, 5] }, { tail: [1, 1], tip: [2, -2] }] }, params).ok, true, 'el vector libre no depende de dónde empieza');
  const r = flecha.grade({ vecs: [{ tail: [0, 0], tip: [3, 4] }, { tail: [1, 1], tip: [1, 1] }] }, params);
  assert.equal(r.ok, false, 'el vector cero no cuenta como perpendicular');
  assert.ok(r.solution.includes('(3, 4)') && r.solution.includes('(−1, 3)'), r.solution);
  assert.equal(flecha.grade({ vecs: [null, { tail: [1, 1], tip: [0, 4] }] }, params).ok, false);
  assert.equal(flecha.cross([2, 1], [1, 3]), 5);
  assert.equal(flecha.dot([2, 1], [1, 3]), 5);
});

test('flecha: con punto fijo se califica la punta', () => {
  const params = { rounds: [{ points: [{ p: [-2, 1], name: 'A' }, { p: [4, 3], name: 'B' }], at: 'tip', ans: [1, 2] }] };
  assert.equal(flecha.grade({ vecs: [{ tail: [0, 0], tip: [1, 2] }] }, params).ok, true);
  assert.equal(flecha.grade({ vecs: [{ tail: [-1, -1], tip: [0, 1] }] }, params).ok, false);
});

test('cónica: parámetros, focos y calificación', () => {
  assert.equal(conica.keysOf('circ').join(), 'h,k,r');
  assert.equal(conica.keysOf('par').join(), 'h,k,p,dir');
  assert.equal(conica.foci('eli', { h: 1, k: 2, a: 5, b: 3 }).map(p => p.join()).join(' '), '-3,2 5,2');
  assert.equal(conica.foci('hip', { h: 0, k: 0, a: 3, b: 4, dir: 'x' }).map(p => p.join()).join(' '), '-5,0 5,0');
  assert.equal(conica.foci('par', { h: 1, k: -1, p: 2, dir: 'y' }).map(p => p.join()).join(' '), '1,1');
  const params = { rounds: [{ type: 'circ', eq: 'x² + y² − 4x + 6y − 3 = 0', ans: { h: 2, k: -3, r: 4 } }, { type: 'par', eq: '(y − 1)² = −8(x + 2)', ans: { h: -2, k: 1, p: -2, dir: 'x' } }] };
  assert.equal(conica.grade({ vals: [{ h: 2, k: -3, r: 4, a: 9 }, { h: -2, k: 1, p: -2, dir: 'x' }] }, params).ok, true, 'las perillas que no usa la cónica no cuentan');
  const r = conica.grade({ vals: [{ h: 2, k: -3, r: 4 }, { h: -2, k: 1, p: -2, dir: 'y' }] }, params);
  assert.equal(r.ok, false);
  assert.ok(r.solution.includes('(x − 2)² + (y + 3)² = 16'), r.solution);
  assert.equal(conica.eqText('eli', { h: 0, k: -1, a: 2, b: 3 }), 'x²/4 + (y + 1)²/9 = 1');
  assert.equal(conica.eqText('hip', { h: 1, k: 0, a: 2, b: 1, dir: 'y' }), 'y²/1 − (x − 1)²/4 = 1');
});
