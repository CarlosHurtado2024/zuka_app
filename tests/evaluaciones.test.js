// Evaluaciones de las unidades 1, 2 y 3 de Álgebra (spec 2026-11-12-evaluaciones-algebra-u1-u3):
// datos de cada examen, informe final (examReport) y su lugar en la app.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const NEW = ['laberinto-valor', 'domino-equivalencias', 'piramide-numerica', 'detective-pasos'];
const ctx = loadScripts(['js/content.js', 'js/games/kit.js', ...NEW.map(g => `js/games/${g}.js`),
  'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/exam.js']);
const GAMES = get(ctx, 'GAMES'), ALG = get(ctx, 'COURSE_ALGEBRA');
const examReport = get(ctx, 'examReport'), fmtClock = get(ctx, 'fmtClock');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const UNITS = [1, 2, 3].map(i => ALG.units[i]);

test('las unidades 1, 2 y 3 de Álgebra tienen evaluación; las demás todavía no', () => {
  assert.deepEqual(UNITS.map(u => u.title), ['Sistemas numéricos y axiomas', 'Razones, proporciones y porcentajes', 'Potenciación y radicación']);
  UNITS.forEach(u => assert.ok(u.exam, `${u.title} sin evaluación`));
  const ids = UNITS.map(u => u.exam.id);
  assert.equal(new Set(ids).size, 3);
  assert.equal(JSON.stringify(UNITS.map(u => u.exam.minutes)), '[15,12,12]');
});

for (const u of UNITS) {
  const ex = u.exam, ids = u.lessons.map(l => l.id);
  test(`${ex.id}: 6 a 8 preguntas que cubren todas las lecciones de la unidad`, () => {
    assert.ok(ex.items.length >= 6 && ex.items.length <= 8, `${ex.items.length} preguntas`);
    ex.items.forEach(it => assert.ok(ids.includes(it.lesson), `${it.lesson} no es de la unidad`));
    ids.forEach(id => assert.ok(ex.items.some(it => it.lesson === id), `nadie evalúa ${id}`));
  });

  test(`${ex.id}: cada pregunta tiene pista que no regala la respuesta, explicación y nota de repaso`, () => {
    ex.items.forEach((it, k) => {
      const e = it.ex;
      assert.ok(e.hint && e.hint.length > 20, `pregunta ${k + 1} sin pista`);
      assert.ok(e.explain, `pregunta ${k + 1} sin explicación`);
      assert.ok(it.review && it.review.length > 20, `pregunta ${k + 1} sin nota de repaso`);
      if (e.type === 'input') assert.ok(!e.hint.includes(String(e.answer)), `la pista ${k + 1} dice ${e.answer}`);
    });
  });

  test(`${ex.id}: estilo nuevo (juegos de evaluación) y una pregunta numérica`, () => {
    const types = ex.items.map(it => (it.ex.type === 'play' ? it.ex.game : it.ex.type));
    assert.ok(types.every(t => NEW.includes(t) || t === 'input'), types.join());
    assert.equal(types.filter(t => t === 'input').length, 1);
    assert.ok(new Set(types.filter(t => t !== 'input')).size >= 3, 'mezcla al menos tres mecánicas');
  });

  test(`${ex.id}: cada juego tiene solución y la respuesta pensada es correcta`, () => {
    ex.items.filter(it => it.ex.type === 'play').forEach((it, k) => {
      const g = GAMES[it.ex.game], st = g.solve(it.ex.params);
      assert.ok(st, `${it.ex.game} (${k + 1}) sin solución`);
      assert.equal(g.grade(st, it.ex.params).ok, true, `${it.ex.game} (${k + 1})`);
      assert.equal(g.grade({}, it.ex.params).ok, false);
    });
  });
}

test('laberintos: la salida no se alcanza pisando todo, hay trampas de verdad', () => {
  const lab = GAMES['laberinto-valor'];
  UNITS.flatMap(u => u.exam.items).filter(it => it.ex.game === 'laberinto-valor').forEach(it => it.ex.params.rounds.forEach(r => {
    const bad = r.cells.filter(c => !c.ok).length;
    assert.ok(bad >= r.cells.length * 0.3, `${it.lesson}: pocas trampas (${bad})`);
    assert.ok(r.cells[r.start].ok && r.cells[r.end].ok);
    assert.ok(lab.solve({ rounds: [r] }));
  }));
});

test('dominós y pirámides traen fichas trampa', () => {
  UNITS.flatMap(u => u.exam.items).forEach(it => {
    if (it.ex.game === 'domino-equivalencias') it.ex.params.rounds.forEach(r => assert.ok(r.tiles.length >= r.need + 2));
    if (it.ex.game === 'piramide-numerica') {
      const blanks = it.ex.params.rows.flat().filter(c => c === null).length;
      assert.ok(it.ex.params.tokens.length >= blanks + 3);
    }
  });
});

test('los juegos de evaluación no aparecen en ninguna lección (estilo nuevo)', () => {
  const all = ['COURSE_ALGEBRA', 'COURSE_TRIG', 'COURSE_CALC', 'COURSE_GEO']
    .flatMap(n => get(ctx, n).units.flatMap(u => u.lessons));
  all.forEach(l => l.ex.forEach(e => assert.ok(!NEW.includes(e.game), `${l.id} usa ${e.game}`)));
});

// ---------- informe ----------
const EX = { id: 'x', items: [
  { lesson: 'a', review: 'nota a1' }, { lesson: 'a', review: 'nota a2' },
  { lesson: 'b', review: 'nota b1' }, { lesson: 'c', review: 'nota c1' }] };

test('examReport: puntaje con media pregunta por pista y lecciones dominadas o por repasar', () => {
  const r = examReport(EX, [{ ok: true }, { ok: true }, { ok: true, hint: true }, { ok: false, blank: true }]);
  assert.equal(r.correct, 3);
  assert.equal(r.pct, 63);   // (1 + 1 + ½ + 0) / 4
  assert.deepEqual([...r.mastered], ['a']);
  assert.deepEqual(r.review.map(x => x.lesson).join(), 'b,c');
  assert.match(r.review[0].notes.join(), /pista/);
  assert.deepEqual([...r.review[1].notes], ['nota c1']);
  assert.equal(r.items[3].state, 'blank');
  assert.equal(r.items[2].state, 'hint');
});

test('examReport: el mensaje cambia con el nivel', () => {
  const lv = oks => examReport(EX, oks.map(ok => ({ ok }))).level.key;
  assert.equal(lv([1, 1, 1, 1]), 'top');
  assert.equal(lv([1, 1, 1, 0]), 'good');
  assert.equal(lv([1, 1, 0, 0]), 'mid');
  assert.equal(lv([1, 0, 0, 0]), 'low');
});

test('en el informe, Enter no cierra la evaluación (abre las preguntas del detalle)', () => {
  const exam = read('js/exam.js');
  assert.match(exam, /e\.key === 'Enter' && !finished/);
  assert.match(exam, /closest\?\.\('button, summary, a, details'\)/);
});

test('el dominó une la cara derecha de una ficha con la izquierda de la siguiente', () => {
  const dom = read('js/games/domino-equivalencias.js');
  assert.match(dom, /p\.line\(x0 \+ 3 \* hw \/ 2, y1, x0 \+ hw \/ 2, y2\)/);
});

test('fmtClock escribe minutos y segundos', () => {
  assert.equal(fmtClock(900), '15:00');
  assert.equal(fmtClock(61.2), '1:02');
  assert.equal(fmtClock(-3), '0:00');
});

test('la app carga exam.js y pone la evaluación al final del camino del mundo', () => {
  const index = read('index.html'), sw = read('sw.js'), app = read('js/app.js');
  assert.ok(index.includes('src="js/exam.js"'));
  assert.ok(sw.includes("'js/exam.js'"));
  assert.match(app, /u\.exam/);
  assert.match(app, /openExamSheet\(/);
  assert.match(app, /exams: \{\}/, 'S.exams en DEFAULTS');
});
