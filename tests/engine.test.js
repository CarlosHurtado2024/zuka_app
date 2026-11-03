const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/games/kit.js']);

test('play() arma el objeto del ejercicio', () => {
  const play = get(ctx, 'play');
  assert.deepEqual(
    JSON.parse(JSON.stringify(play('x', 'q', { a: 1 }, 'e'))),
    { type: 'play', game: 'x', q: 'q', params: { a: 1 }, explain: 'e' },
  );
});

test('GAMES empieza vacío', () => {
  assert.equal(Object.keys(get(ctx, 'GAMES')).length, 0);
});

test('lineMap convierte valores a píxeles y de vuelta', () => {
  const m = get(ctx, 'lineMap')(-3, 4, 0, 700);
  assert.equal(m.toPx(-3), 0);
  assert.equal(m.toPx(4), 700);
  assert.ok(Math.abs(m.toVal(m.toPx(1.5)) - 1.5) < 1e-9);
});

test('nearest devuelve el punto más cercano dentro del radio, o -1', () => {
  const nearest = get(ctx, 'nearest');
  const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 103, y: 4 }];
  assert.equal(nearest(pts, 101, 1, 20), 1);
  assert.equal(nearest(pts, 50, 50, 20), -1);
});
