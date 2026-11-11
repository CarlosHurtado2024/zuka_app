// Los cuatro juegos nuevos de las evaluaciones: laberinto, dominó, pirámide y detective.
// Cada uno expone solve(params) → un estado que resuelve el ejercicio (lo usan las pruebas de contenido).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('./load');

const lab = loadGame('js/games/laberinto-valor.js')['laberinto-valor'];
const dom = loadGame('js/games/domino-equivalencias.js')['domino-equivalencias'];
const pir = loadGame('js/games/piramide-numerica.js')['piramide-numerica'];
const det = loadGame('js/games/detective-pasos.js')['detective-pasos'];

// ---------- laberinto ----------
// 3 × 3:  A b C      ok: A C D E F G (minúsculas = trampa)
//         D E F      camino A → D → E → F → C? no: C está arriba a la derecha; salida = I (abajo der.)
//         G h I
const L = { rule: 'Pisa las mayúsculas', rounds: [{ cols: 3, start: 0, end: 8, cells: [
  { t: 'A', ok: true }, { t: 'b', ok: false }, { t: 'C', ok: true },
  { t: 'D', ok: true }, { t: 'E', ok: true }, { t: 'F', ok: true },
  { t: 'G', ok: true }, { t: 'h', ok: false }, { t: 'I', ok: true }] }] };

test('laberinto: un camino de casillas vecinas y válidas de la entrada a la salida es correcto', () => {
  assert.equal(lab.grade({ paths: [[0, 3, 4, 5, 8]] }, L).ok, true);
  assert.equal(lab.grade({ paths: [[0, 3, 4, 5, 2, 5, 8]] }, L).ok, false, 'no se repiten casillas');
});

test('laberinto: pisar una trampa, saltar casillas o no llegar es incorrecto', () => {
  assert.equal(lab.grade({ paths: [[0, 1, 2, 5, 8]] }, L).ok, false, 'pisa b');
  assert.equal(lab.grade({ paths: [[0, 4, 8]] }, L).ok, false, 'en diagonal');
  assert.equal(lab.grade({ paths: [[0, 3, 4]] }, L).ok, false, 'no llega');
  assert.equal(lab.grade({ paths: [[3, 4, 5, 8]] }, L).ok, false, 'no sale de la entrada');
  assert.equal(lab.grade({}, L).ok, false);
});

test('laberinto: solve encuentra un camino y la solución lo escribe', () => {
  const s = lab.solve(L);
  assert.equal(lab.grade(s, L).ok, true);
  assert.match(lab.grade({}, L).solution, /A → D → E → F → I/);
});

// ---------- dominó ----------
const D = { rounds: [{ start: { t: '0.5', v: 0.5 }, end: { t: '3/4', v: 0.75 }, need: 2, tiles: [
  { a: '1/2', av: 0.5, b: '0.2', bv: 0.2 },
  { a: '1/5', av: 0.2, b: '0.75', bv: 0.75 },
  { a: '2/4', av: 0.5, b: '0.3', bv: 0.3 }] }] };

test('dominó: la cadena une caras de igual valor desde la salida hasta la llegada', () => {
  assert.equal(dom.grade({ chains: [[0, 1]] }, D).ok, true);
  assert.equal(dom.grade({ chains: [[2, 1]] }, D).ok, false, '0.3 no se une con 1/5');
  assert.equal(dom.grade({ chains: [[1, 0]] }, D).ok, false);
  assert.equal(dom.grade({ chains: [[0]] }, D).ok, false, 'falta llegar');
  assert.equal(dom.grade({ chains: [[0, 0]] }, D).ok, false, 'sin repetir fichas');
});

test('dominó: solve y texto de la solución', () => {
  assert.equal(dom.grade(dom.solve(D), D).ok, true);
  assert.match(dom.grade({}, D).solution, /1\/2 \| 0\.2/);
});

// ---------- pirámide ----------
// suma: abajo 1, ?, 4  → arriba 3, ? → cima 9
const P = { op: 'sum', rows: [[{ t: '1', v: 1 }, null, { t: '4', v: 4 }], [{ t: '3', v: 3 }, null], [{ t: '9', v: 9 }]],
  tokens: [{ t: '2', v: 2 }, { t: '6', v: 6 }, { t: '7', v: 7 }, { t: '5', v: 5 }] };

test('pirámide: cada bloque es la suma de los dos de abajo', () => {
  // vacíos en orden: fila 0 casilla 1 → 2; fila 1 casilla 1 → 6 (2 + 4)
  assert.equal(pir.grade({ fill: [[null, 0, null], [null, 1], [null]] }, P).ok, true);
  assert.equal(pir.grade({ fill: [[null, 2, null], [null, 1], [null]] }, P).ok, false);
  assert.equal(pir.grade({ fill: [[null, 0, null], [null, null], [null]] }, P).ok, false, 'vacío');
  assert.equal(pir.grade({ fill: [[null, 0, null], [null, 0], [null]] }, P).ok, false, 'misma ficha dos veces');
});

test('pirámide de producto y solve', () => {
  const Q = { op: 'prod', rows: [[{ t: '−1', v: -1 }, null], [{ t: '−3', v: -3 }]], tokens: [{ t: '3', v: 3 }, { t: '−3', v: -3 }] };
  assert.equal(pir.grade({ fill: [[null, 0], [null]] }, Q).ok, true);
  assert.equal(pir.grade(pir.solve(P), P).ok, true);
  assert.match(pir.grade({}, P).solution, /2/);
});

// ---------- detective ----------
const T = { rounds: [{ steps: ['a', 'b', 'c'], wrong: 1, fixes: ['x', 'y'], fix: 1 }] };
test('detective: hay que señalar la línea con el error y elegir cómo debía quedar', () => {
  assert.equal(det.grade({ picks: [{ line: 1, fix: 1 }] }, T).ok, true);
  assert.equal(det.grade({ picks: [{ line: 1, fix: 0 }] }, T).ok, false);
  assert.equal(det.grade({ picks: [{ line: 2, fix: 1 }] }, T).ok, false);
  assert.equal(det.grade({}, T).ok, false);
  assert.equal(det.grade(det.solve(T), T).ok, true);
  assert.match(det.grade({}, T).solution, /paso 2.*y/);
});
