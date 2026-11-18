const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const files = [...read('index.html').matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1])
  .filter(f => /content|games\/|courses\/|data\.js|guia/.test(f));
const ctx = loadScripts(files), games = get(ctx, 'GAMES');

test('los ocho cursos tienen instrucciones para la práctica sobre la escena', () => {
  const lines = get(ctx, 'practiceGuideLines'), courses = get(ctx, 'COURSES');
  assert.equal(courses.length, 8);
  for (const c of courses) for (const u of c.units) for (const l of [...u.lessons, u.boss].filter(Boolean)) {
    for (const e of l.ex) {
      const text = lines(e);
      assert.ok(text.length >= 1 && text.length <= 2, e.game || e.type);
      assert.ok(text.every(s => s.length >= 16), e.game || e.type);
    }
  }
});

test('armar la cuenta, trazar pasos y ajustar el vuelo muestran su gesto sobre el control', () => {
  for (const id of ['arma-la-cuenta', 'escala-solucion', 'vuela-precios', 'flecha-vector', 'sintoniza-onda', 'afina-sistema', 'combina-vectores']) assert.equal(games[id].demo, true, id);
});

test('las manijas conservan pasos exactos y límites en las dos direcciones', () => {
  const rail = get(ctx, 'practiceTrack')(50, 250, 30, -3, 5, .5);
  for (const v of [-3, -1.5, 0, 2.5, 5]) assert.equal(rail.value(rail.x(v)), v);
  assert.equal(rail.value(10), -3);
  assert.equal(rail.value(290), 5);
  assert.equal(rail.hit(rail.x(0), 30), true);
  assert.equal(rail.hit(rail.x(0), 70), false);
});

test('las rutas se añaden por niveles y se pueden corregir antes de comprobar', () => {
  const game = games['escala-solucion'], pick = [-1, -1, -1];
  assert.equal(game.traceStep(pick, 2, 0), false, 'el trazo no se salta niveles');
  assert.equal(game.traceStep(pick, 0, 1), true);
  assert.equal(game.traceStep(pick, 1, 0), true);
  assert.equal(game.traceStep(pick, 0, 0), true);
  assert.deepEqual(pick, [0, -1, -1], 'al cambiar un paso, se rehace lo que dependía de él');
  assert.equal(game.traceStep(pick, 1, 0), true);
  assert.equal(game.traceStep(pick, 2, 0), true);
  assert.deepEqual(pick, [0, 0, 0]);
});
