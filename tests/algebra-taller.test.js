const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadScripts, get, ROOT } = require('./load');

const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const scripts = [...read('index.html').matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1])
  .filter(f => /content|games\/|courses\/|data\.js|guia/.test(f));
const ctx = loadScripts(scripts);
const { units } = get(ctx, 'COURSE_ALGEBRA');
const games = get(ctx, 'GAMES');
const legacy = new Set(['escala-solucion', 'arma-la-cuenta', 'une-parejas', 'clasifica-cartas', 'ordena-terminos',
  'caja-veloz', 'salta-signos', 'vuela-precios', 'dispara-inverso', 'corta-proporciones']);

test('Álgebra tiene 43 lecciones de siete u ocho juegos distintos, con pista y ayuda dentro del juego', () => {
  assert.equal(units.length, 10);
  const lessons = units.flatMap(u => u.lessons);
  assert.equal(lessons.length, 43);
  assert.equal(new Set(lessons.map(l => l.ex.at(-1).game)).size, lessons.length);
  for (const l of lessons) {
    assert.ok([7, 8].includes(l.ex.length), l.id);
    assert.equal(new Set(l.ex.map(e => e.game)).size, l.ex.length, l.id);
    for (const e of l.ex) {
      assert.equal(e.type, 'play', l.id);
      assert.ok(games[e.game] && !legacy.has(e.game), `${l.id}: ${e.game}`);
      assert.ok(e.hint && e.explain, `${l.id}: ${e.game} sin pista o explicación`);
      assert.ok(games[e.game].demo || e.canvasGuide, `${l.id}: ${e.game} sin ayuda sobre el lienzo`);
    }
    assert.ok(l.ex.at(-1).motion, `${l.id}: falta el cierre en movimiento`);
  }
});

// Sin jefes (spec 2026-11-18-algebra-revision): sus retos pasaron a la evaluación del mundo.
test('las evaluaciones practican los objetivos de su mundo, y ya no hay jefes', () => {
  for (const u of units) {
    assert.equal(u.boss, undefined, u.world);
    assert.ok(u.exam.items.length >= 5, u.world);
    for (const item of u.exam.items) assert.ok(u.lessons.some(l => l.id === item.lesson), item.lesson);
    for (const e of u.exam.items.map(it => it.ex)) {
      assert.ok(games[e.game] && !legacy.has(e.game), `${u.world}: ${e.game}`);
      assert.ok(e.hint && e.explain, e.game);
    }
  }
});

test('las escenas nuevas aceptan la construcción correcta y rechazan una escena intacta', () => {
  const puzzles = units.flatMap(u => [...u.lessons.flatMap(l => l.ex), ...u.exam.items.map(it => it.ex)])
    .filter(e => games[e.game]?.algebraScene);
  // La revisión (spec 2026-11-18-algebra-revision) va quitando estas escenas de las lecciones; las que quedan deben funcionar.
  for (const e of puzzles) {
    const g = games[e.game];
    assert.equal(g.grade({ rounds: e.params.rounds.map(g.answer) }, e.params).ok, true, e.q);
    assert.equal(g.grade({}, e.params).ok, false, e.q);
  }
});
