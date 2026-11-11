// Estructura de los cursos según el Manual de Álgebra y Trigonometría (UdeA): unidades en el orden
// del libro, ids únicos, cada lección con video (clip) y ejercicios, y ninguna lección perdida.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/data.js']);
const alg = get(ctx, 'COURSE_ALGEBRA'), trig = get(ctx, 'COURSE_TRIG'), calc = get(ctx, 'COURSE_CALC');
const ids = c => c.units.flatMap(u => u.lessons.map(l => l.id));
const plan = c => Array.from(c.units, u => `${u.title}: ${u.lessons.map(l => l.id).join(' ')}`);

// Spec 2026-11-07-cronograma-algebra-calculo: clases 1–19 del cronograma de Álgebra y Trigonometría.
test('álgebra: Conjuntos y luego las ocho unidades del cronograma 2026-2', () => {
  assert.deepEqual([...plan(alg)], [
    'Conjuntos: alg-0',
    'Sistemas numéricos, razones y proporciones: alg-11 alg-12b alg-12 alg-13 alg-13b',
    'Potenciación y radicación: alg-21a alg-21b alg-22a alg-22b',
    'Progresiones y sumatoria: alg-14 alg-15',
    'Polinomios: productos notables y factorización: alg-23a alg-3 alg-24c alg-24b',
    'Números complejos y ecuaciones cuadráticas: alg-23c alg-1 alg-4a alg-4',
    'Polinomios de grado superior: alg-23b alg-92 alg-93',
    'Expresiones racionales y fracciones parciales: alg-25a alg-25b alg-101 alg-102',
    'Funciones exponenciales y logarítmicas: alg-71 alg-72 alg-73',
  ]);
});

test('cálculo: recibe desigualdades, recta y funciones, y sigue su cronograma 2026-2', () => {
  assert.deepEqual([...plan(calc)], [
    'Desigualdades, valor absoluto y la recta: alg-32 alg-26c alg-51 calc-recta',
    'Funciones: alg-52 calc-tipos alg-53 calc-tramos alg-61 alg-62',
    'Límites y continuidad: calc-1 calc-2',
    'La derivada: calc-3 calc-4',
    'Aplicaciones de la derivada: calc-5',
  ]);
  const courses = get(ctx, 'COURSES');
  assert.equal(courses.filter(c => c.id === 'calc').length, 1);
  assert.equal(courses.find(c => c.id === 'calc'), calc, 'COURSES usa COURSE_CALC');
});

test('ningún id de lección está en dos cursos', () => {
  const all = get(ctx, 'COURSES').flatMap(ids);
  assert.equal(new Set(all).size, all.length);
});

test('trigonometría: tres unidades en el orden de la parte IV del libro', () => {
  assert.equal(trig.units.map(u => u.title).join(' | '), [
    'Funciones trigonométricas, propiedades y gráficas',
    'Funciones trigonométricas inversas y aplicaciones',
    'Forma polar de números complejos',
  ].join(' | '));
});

test('ninguna lección anterior se perdió al reorganizar', () => {
  const before = ['alg-32', 'alg-51', 'alg-52', 'alg-53', 'alg-61', 'alg-62', 'alg-11', 'alg-12', 'alg-13', 'alg-13b', 'alg-14', 'alg-15', 'alg-21a', 'alg-21b', 'alg-22a', 'alg-22b', 'alg-23a', 'alg-23b',
    'alg-3', 'alg-24b', 'alg-24c', 'alg-25a', 'alg-25b', 'alg-1', 'alg-4', 'alg-26c'];
  const beforeTrig = ['trig-41a', 'trig-41b', 'trig-1', 'trig-2', 'trig-42c', 'trig-3', 'trig-43b', 'trig-44a', 'trig-44b', 'trig-45', 'trig-46a', 'trig-46b', 'trig-4', 'trig-47b', 'trig-48a', 'trig-48b', 'trig-49'];
  for (const id of before) assert.ok([...ids(alg), ...ids(calc)].includes(id), id);
  for (const id of beforeTrig) assert.ok(ids(trig).includes(id), id);
});

test('las lecciones nuevas del libro existen, con video y ejercicios', () => {
  const nuevas = ['alg-12b', 'alg-23c', 'alg-32', 'alg-51', 'alg-52', 'alg-53', 'alg-61', 'alg-62', 'alg-71', 'alg-72', 'alg-92', 'alg-93', 'alg-101', 'alg-102', 'trig-151', 'trig-152'];
  const all = [alg, trig, calc].flatMap(c => c.units.flatMap(u => u.lessons));
  for (const id of nuevas) {
    const l = all.find(l => l.id === id);
    assert.ok(l, id);
    assert.ok(l.clip.scenes.length >= 3, `${id} sin escenas`);
    assert.ok(l.ex.length >= 5, `${id} con pocos ejercicios`);
  }
});

test('ids únicos y cada lección con clip y ejercicios', () => {
  for (const c of [alg, trig, calc]) {
    const list = ids(c);
    assert.equal(new Set(list).size, list.length, 'id repetido');
    for (const l of c.units.flatMap(u => u.lessons)) {
      assert.ok(l.clip && (l.clip.bunny || l.clip.scenes.length), `${l.id} sin video`);
      assert.ok(l.ex.length > 0, `${l.id} sin ejercicios`);
    }
  }
});

test('las respuestas de opción múltiple apuntan a una opción existente y los textos no usan coma decimal', () => {
  for (const c of [alg, trig, calc]) for (const l of c.units.flatMap(u => u.lessons)) for (const e of l.ex) {
    if (e.type === 'mc') assert.ok(e.answer >= 0 && e.answer < e.options.length, `${l.id}: ${e.q}`);
    if (['alg-12b', 'alg-23c', 'alg-32', 'alg-51', 'alg-52', 'alg-53', 'alg-61', 'alg-62', 'alg-71', 'alg-72', 'alg-92', 'alg-93', 'alg-101', 'alg-102', 'trig-151', 'trig-152'].includes(l.id)) {
      const texts = [e.q, e.explain, ...(e.options || [])].filter(s => typeof s === 'string');
      for (const s of texts) assert.ok(!/\d,\d/.test(s), `${l.id}: coma decimal en «${s.slice(0, 40)}»`);
    }
  }
});

test('js/courses/calculo.js se carga en index.html antes de data.js y está en el SHELL', () => {
  const fs = require('fs'), path = require('path'), { ROOT } = require('./load');
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const at = index.indexOf('src="js/courses/calculo.js"');
  assert.ok(at > 0 && at < index.indexOf('src="js/data.js"'));
  assert.ok(sw.includes("'js/courses/calculo.js'"));
});
