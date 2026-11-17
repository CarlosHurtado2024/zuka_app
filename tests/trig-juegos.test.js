// Trigonometría: un juego nuevo por lección y sin tarjetas (spec 2026-11-22-trigonometria-juegos).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const DYN = {
  'trig-41a': 'quita-vueltas', 'trig-41b': 'rueda-rodante', 'trig-1': 'toca-lados', 'trig-2': 'figuras-notables',
  'trig-42c': 'multiplica-razon', 'trig-3': 'proyecta-punto', 'trig-43b': 'espejo-cuadrantes', 'trig-44a': 'ola-entre-lineas',
  'trig-44b': 'crestas-faroles', 'trig-45': 'ventana-inversa', 'trig-4': 'escala-triangulo', 'trig-47b': 'todo-en-senos',
  'trig-48a': 'rectangulo-suma', 'trig-48b': 'tira-doble', 'trig-49': 'red-periodica', 'trig-46a': 'pareja-opuesta',
  'trig-46b': 'bisagra-area', 'trig-151': 'parientes-polares', 'trig-152': 'multiplicador-oculto', 'trig-153': 'hermanas-raiz',
};
const NEW = Object.values(DYN), FILES = NEW.map(g => `js/games/${g}.js`);
const ctx = loadScripts(['js/content.js', 'js/games/kit.js', ...FILES, 'js/courses/trig.js', 'js/courses/trig-juegos.js']);

const GAMES = get(ctx, 'GAMES'), course = get(ctx, 'COURSE_TRIG');
const lessons = course.units.flatMap(u => u.lessons);

test('cada lección de Trigonometría termina con su juego nuevo, todos distintos', () => {
  assert.equal(lessons.length, 20);
  assert.equal(new Set(NEW).size, 20);
  for (const l of lessons) {
    const last = l.ex[l.ex.length - 1];
    assert.equal(last.type, 'play', l.id); assert.equal(last.game, DYN[l.id], l.id);
    assert.ok(l.ex.length >= 3, `${l.id} tiene al menos tres ejercicios`);
  }
});

test('no quedan tarjetas de unir parejas y todo ejercicio dice qué hacer y trae pista', () => {
  for (const l of lessons) for (const [i, ex] of l.ex.entries()) {
    assert.notEqual(ex.game, 'une-parejas', `${l.id}#${i}`);
    assert.ok(ex.q && ex.q.length >= 20, `${l.id}#${i} enunciado`);
    assert.ok(ex.hint && ex.hint.length >= 30, `${l.id}#${i} pista`);
    assert.ok(ex.explain && ex.explain.length >= 30, `${l.id}#${i} explicación`);
    assert.equal((ex.q.match(/\$/g) || []).length % 2, 0, `${l.id}#${i} TeX parejo`);
    assert.equal((ex.explain.match(/\$/g) || []).length % 2, 0, `${l.id}#${i} TeX parejo en la explicación`);
  }
});

test('los juegos nuevos: dos rondas o más, cada reto con solución y sin resolver al empezar', () => {
  const uses = lessons.flatMap(l => l.ex.filter(e => NEW.includes(e.game)).map(e => ({ id: l.id, ex: e })));
  assert.ok(uses.length >= 21, 'los 19 de cierre y los que se prestan a la lección vecina');
  for (const { id, ex } of uses) {
    const g = GAMES[ex.game], R = ex.params.rounds;
    assert.ok(g && g.ok && g.answer && g.init, ex.game);
    assert.ok(R.length >= 2, `${id} ${ex.game} rondas`);
    for (const r of R) {
      assert.ok(r.title && r.items.length >= 1 && r.items.length <= 3, `${id} ${ex.game} ronda`);
      for (const it of r.items) {
        assert.equal(g.ok(g.answer(it, r), it, r), true, `${id} ${ex.game} tiene solución: ${JSON.stringify(it)}`);
        assert.equal(g.ok(g.init(it, r), it, r), false, `${id} ${ex.game} no empieza resuelto: ${JSON.stringify(it)}`);
      }
    }
    const full = { done: R.map(r => r.items.length) }, short = { done: R.map((r, i) => (i ? r.items.length : 0)) };
    assert.equal(g.grade(full, ex.params).ok, true); assert.equal(g.grade(short, ex.params).ok, false);
    assert.ok(g.grade(full, ex.params).solution.length > 5);
  }
});

test('ningún reto se repite dentro de una lección', () => {
  for (const l of lessons) {
    const seen = new Set();
    for (const ex of l.ex.filter(e => NEW.includes(e.game))) for (const r of ex.params.rounds) for (const it of r.items) {
      const k = ex.game + JSON.stringify(it);
      assert.ok(!seen.has(k), `${l.id} repite ${k}`); seen.add(k);
    }
  }
});

test('casos para pensar: lo que no es lo primero que se ocurre', () => {
  const items = g => lessons.flatMap(l => l.ex.filter(e => e.game === g).flatMap(e => e.params.rounds.flatMap(r => r.items)));
  assert.ok(items('quita-vueltas').some(it => it.deg < 0), 'un ángulo negativo');
  assert.ok(items('bisagra-area').some(it => GAMES['bisagra-area'].answer(it).marks.length === 1), 'un área con un solo ángulo');
  assert.ok(items('bisagra-area').some(it => GAMES['bisagra-area'].answer(it).marks.length === 2), 'un área con dos ángulos');
  assert.ok(items('red-periodica').some(it => it.fams.length === 2) && items('red-periodica').some(it => it.fams.length === 1));
  assert.ok(items('pareja-opuesta').some(it => GAMES['pareja-opuesta'].answer(it).taps.length >= 2), 'primero el tercer ángulo');
  assert.ok(items('proyecta-punto').some(it => it.deg > 180), 'un punto con seno negativo');
  assert.ok(items('ventana-inversa').some(it => it.std) && items('ventana-inversa').some(it => !it.std));
  for (const it of items('multiplicador-oculto')) assert.equal(GAMES['multiplicador-oculto'].answer(it).found.length, it.k === 2 ? 2 : 1, 'w² tiene dos raíces cuadradas: ' + JSON.stringify(it));
  assert.ok(items('multiplicador-oculto').some(it => it.r < 1) && items('multiplicador-oculto').some(it => it.deg > 180), 'achicar y girar hacia atrás');
});

test('los juegos nuevos están registrados, con guía y como juegos de vidas', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const guia = fs.readFileSync(path.join(ROOT, 'js/guia.js'), 'utf8');
  for (const f of [...FILES, 'js/courses/trig-juegos.js']) { assert.ok(html.includes(`src="${f}"`), f); assert.ok(sw.includes(`'${f}'`), f); }
  assert.ok(html.indexOf('js/courses/trig-juegos.js') > html.indexOf('js/courses/trig.js') && html.indexOf('js/courses/trig-juegos.js') < html.indexOf('js/courses/sin-escribir.js'));
  const arcade = guia.slice(guia.indexOf('GUIDE_ARCADE'), guia.indexOf('const GUIDES'));
  for (const g of NEW) { assert.ok(GAMES[g], g); assert.ok(guia.includes(`'${g}': [[`), `guía de ${g}`); assert.ok(arcade.includes(`'${g}'`), `vidas de ${g}`); }
});

test('tras la revisión: LLA sin caso ambiguo, θ no siempre el ángulo menor, la bisagra no empieza resuelta, peces ocultos', () => {
  const items = g => lessons.flatMap(l => l.ex.filter(e => e.game === g).flatMap(e => e.params.rounds.flatMap(r => r.items)));
  for (const it of items('pareja-opuesta').filter(q => q.know.join() === 'A,a,b')) {
    const sinB = Math.sin(it.ang[1] * Math.PI / 180), sinA = Math.sin(it.ang[0] * Math.PI / 180);
    assert.ok(sinB <= sinA + 1e-9, `con a ≥ b solo hay un triángulo: ${JSON.stringify(it)}`);
    assert.ok(Math.abs(it.ang[0] + it.ang[1] + it.ang[2] - 180) < 0.05);
  }
  const tl = items('toca-lados');
  assert.ok(tl.filter(it => it.len[0] > it.len[1]).length >= 4 && tl.filter(it => it.len[0] < it.len[1]).length >= 4);
  for (const it of tl) assert.equal(it.len[0] ** 2 + it.len[1] ** 2, it.len[2] ** 2);
  const bis = GAMES['bisagra-area'];
  for (const it of items('bisagra-area')) assert.ok(!bis.answer(it).marks.includes(15 * bis.init(it).c), 'no empieza en una respuesta');
  assert.equal(GAMES['red-periodica'].init(items('red-periodica')[0]).seen, false);
  for (const it of items('hermanas-raiz')) assert.ok(it.step >= 12, 'puntos separados para el dedo');
});
