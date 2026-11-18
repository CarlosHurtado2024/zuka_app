// Cada curso tiene su figura (js/art.js), dibujada con la misma paleta y el mismo lienzo de 64 × 64.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/art.js', 'js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/trig-juegos.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/courses/preuda-razonamiento.js', 'js/courses/preuda-lectura.js', 'js/courses/preuda.js', 'js/data.js']);
const ART = get(ctx, 'COURSE_ART'), C = get(ctx, 'ART_C');

test('cada curso tiene su figura, distinta de las demás', () => {
  const courses = get(ctx, 'COURSES');
  for (const c of courses) assert.ok(/^<svg viewBox="0 0 64 64"/.test(ART[c.id] || ''), `${c.id} sin figura`);
  assert.equal(new Set(courses.map(c => ART[c.id])).size, courses.length);
});

test('cada figura usa solo la paleta de su curso: tonos de su color y un acento', () => {
  const PAL = get(ctx, 'ART_PAL'), courses = get(ctx, 'COURSES');
  const hue = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
    return (60 * (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) + 360) % 360; };
  for (const c of courses) {
    const pal = PAL[c.id];
    assert.ok(pal, `${c.id} sin paleta`);
    assert.equal(Object.keys(pal).join(), Object.keys(C).join(), `${c.id}: mismos tonos que la base`);
    const colors = ART[c.id].match(/#[0-9a-fA-F]{6}/g) || [];
    assert.ok(colors.length > 0);
    for (const col of colors) assert.ok(Object.values(pal).includes(col), `${c.id}: ${col}`);
    // El tono principal es el del curso (a menos de 20° en la rueda de color).
    const dh = Math.abs(hue(pal.blue) - hue(c.color));
    assert.ok(Math.min(dh, 360 - dh) < 20, `${c.id}: ${pal.blue} no es del color del curso ${c.color}`);
  }
  assert.equal(new Set(Object.values(PAL).map(p => p.blue)).size, Object.keys(PAL).length, 'cada curso con su color');
});
