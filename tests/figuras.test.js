// Cada curso tiene su figura (js/art.js), dibujada con la misma paleta y el mismo lienzo de 64 × 64.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/art.js', 'js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/data.js']);
const ART = get(ctx, 'COURSE_ART'), C = get(ctx, 'ART_C');

test('cada curso tiene su figura, distinta de las demás', () => {
  const courses = get(ctx, 'COURSES');
  for (const c of courses) assert.ok(/^<svg viewBox="0 0 64 64"/.test(ART[c.id] || ''), `${c.id} sin figura`);
  assert.equal(new Set(courses.map(c => ART[c.id])).size, courses.length);
});

test('la figura de Geometría usa solo los colores de la paleta común', () => {
  const colors = ART.geo.match(/#[0-9a-fA-F]{3,6}/g) || [];
  const pal = Object.values(C);
  assert.ok(colors.length > 0);
  for (const col of colors) assert.ok(pal.includes(col), col);
});
