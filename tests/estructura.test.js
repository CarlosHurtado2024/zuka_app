// Estructura de los cursos según el Manual de Álgebra y Trigonometría (UdeA): unidades en el orden
// del libro, ids únicos, cada lección con video (clip) y ejercicios, y ninguna lección perdida.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js']);
const alg = get(ctx, 'COURSE_ALGEBRA'), trig = get(ctx, 'COURSE_TRIG');
const ids = c => c.units.flatMap(u => u.lessons.map(l => l.id));

test('álgebra: nueve unidades en el orden de las partes I–III del libro', () => {
  assert.equal(alg.units.map(u => u.title).join(' | '), [
    'Números reales, potenciación y radicación',
    'Expresiones algebraicas y números complejos',
    'Intervalos, inecuaciones, razones y proporciones',
    'Relaciones, funciones y operaciones',
    'Funciones inversas',
    'Funciones exponenciales y logarítmicas',
    'Algoritmo de la división y ceros polinomiales',
    'Sistemas de ecuaciones y fracciones parciales',
    'Sucesiones, sumatoria y productoria',
  ].join(' | '));
});

test('trigonometría: tres unidades en el orden de la parte IV del libro', () => {
  assert.equal(trig.units.map(u => u.title).join(' | '), [
    'Funciones trigonométricas, propiedades y gráficas',
    'Funciones trigonométricas inversas y aplicaciones',
    'Forma polar de números complejos',
  ].join(' | '));
});

test('ninguna lección anterior se perdió al reorganizar', () => {
  const before = ['alg-11', 'alg-12', 'alg-13', 'alg-13b', 'alg-14', 'alg-15', 'alg-21a', 'alg-21b', 'alg-22a', 'alg-22b', 'alg-23a', 'alg-23b',
    'alg-3', 'alg-24b', 'alg-24c', 'alg-25a', 'alg-25b', 'alg-1', 'alg-4', 'alg-26c'];
  const beforeTrig = ['trig-41a', 'trig-41b', 'trig-1', 'trig-2', 'trig-42c', 'trig-3', 'trig-43b', 'trig-44a', 'trig-44b', 'trig-45', 'trig-46a', 'trig-46b', 'trig-4', 'trig-47b', 'trig-48a', 'trig-48b', 'trig-49'];
  for (const id of before) assert.ok(ids(alg).includes(id), id);
  for (const id of beforeTrig) assert.ok(ids(trig).includes(id), id);
});

test('las lecciones nuevas del libro existen, con video y ejercicios', () => {
  const nuevas = ['alg-12b', 'alg-23c', 'alg-32', 'alg-51', 'alg-52', 'alg-53', 'alg-61', 'alg-62', 'alg-71', 'alg-72', 'alg-92', 'alg-93', 'alg-101', 'alg-102', 'trig-151', 'trig-152'];
  const all = [...alg.units.flatMap(u => u.lessons), ...trig.units.flatMap(u => u.lessons)];
  for (const id of nuevas) {
    const l = all.find(l => l.id === id);
    assert.ok(l, id);
    assert.ok(l.clip.scenes.length >= 3, `${id} sin escenas`);
    assert.ok(l.ex.length >= 5, `${id} con pocos ejercicios`);
  }
});

test('ids únicos y cada lección con clip y ejercicios', () => {
  for (const c of [alg, trig]) {
    const list = ids(c);
    assert.equal(new Set(list).size, list.length, 'id repetido');
    for (const l of c.units.flatMap(u => u.lessons)) {
      assert.ok(l.clip && (l.clip.bunny || l.clip.scenes.length), `${l.id} sin video`);
      assert.ok(l.ex.length > 0, `${l.id} sin ejercicios`);
    }
  }
});

test('las respuestas de opción múltiple apuntan a una opción existente y los textos no usan coma decimal', () => {
  for (const c of [alg, trig]) for (const l of c.units.flatMap(u => u.lessons)) for (const e of l.ex) {
    if (e.type === 'mc') assert.ok(e.answer >= 0 && e.answer < e.options.length, `${l.id}: ${e.q}`);
    if (['alg-12b', 'alg-23c', 'alg-32', 'alg-51', 'alg-52', 'alg-53', 'alg-61', 'alg-62', 'alg-71', 'alg-72', 'alg-92', 'alg-93', 'alg-101', 'alg-102', 'trig-151', 'trig-152'].includes(l.id)) {
      const texts = [e.q, e.explain, ...(e.options || [])].filter(s => typeof s === 'string');
      for (const s of texts) assert.ok(!/\d,\d/.test(s), `${l.id}: coma decimal en «${s.slice(0, 40)}»`);
    }
  }
});
