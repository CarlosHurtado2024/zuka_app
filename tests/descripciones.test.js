// La descripción de cada curso (tagline, bajo el nombre en la portada) cuenta de qué trata con
// palabras de estudiante: corta, sin mencionar el libro ni la universidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/data.js']);
const courses = get(ctx, 'COURSES');

test('cada curso tiene una descripción corta, sin el libro ni la UdeA', () => {
  assert.ok(courses.length >= 6);
  for (const c of courses) {
    assert.ok(typeof c.tagline === 'string' && c.tagline.length >= 30 && c.tagline.length <= 90, `${c.name}: ${c.tagline.length} caracteres`);
    assert.ok(!/UdeA|Manual|parte[s]? I/i.test(c.tagline), `${c.name} menciona el libro`);
  }
});

test('Álgebra se presenta como el lenguaje de las matemáticas', () => {
  assert.match(courses.find(c => c.id === 'algebra').tagline, /lenguaje de las matemáticas/i);
});
