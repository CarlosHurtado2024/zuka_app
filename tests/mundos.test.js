// Mapa de mundos (spec 2026-11-11-mapa-de-mundos): cada unidad es un mundo con nombre e ilustración.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js',
  'js/courses/geometria.js', 'js/data.js', 'js/worlds.js']);
const COURSES = get(ctx, 'COURSES'), WORLDS = get(ctx, 'WORLDS'), worldTrail = get(ctx, 'worldTrail');

test('cada unidad de cada curso tiene su propio mundo', () => {
  const seen = new Set();
  for (const c of COURSES) c.units.forEach((u, i) => {
    assert.ok(u.world, `${c.id} unidad ${i + 1} (${u.title}) sin world`);
    assert.ok(WORLDS[u.world], `${c.id}: el mundo '${u.world}' no existe en WORLDS`);
    assert.ok(!seen.has(u.world), `mundo '${u.world}' repetido`);
    seen.add(u.world);
  });
  assert.equal(Object.keys(WORLDS).length, seen.size, 'no sobran mundos sin unidad');
});

test('cada mundo tiene nombre de lugar e ilustración SVG', () => {
  for (const [k, w] of Object.entries(WORLDS)) {
    assert.ok(typeof w.name === 'string' && w.name.length > 3, `${k}: nombre`);
    assert.match(w.art, /^<svg[^>]*viewBox="0 0 160 80"/, `${k}: svg 160×80`);
    assert.ok(w.art.trim().endsWith('</svg>'), `${k}: svg cerrado`);
    assert.match(w.art, /^<svg[^>]*aria-hidden="true"/, `${k}: decorativa para lectores de pantalla`);
    assert.equal((w.art.match(/<g\b/g) || []).length, (w.art.match(/<\/g>/g) || []).length, `${k}: <g> balanceados`);
    assert.ok(!/undefined|NaN/.test(w.art), `${k}: sin valores rotos`);
  }
});

test('los ids de degradado de las ilustraciones no chocan entre mundos', () => {
  const ids = Object.values(WORLDS).flatMap(w => [...w.art.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  assert.equal(new Set(ids).size, ids.length);
});

test('worldTrail pasa por todos los niveles', () => {
  assert.equal(worldTrail([0], 120), '');
  const d = worldTrail([0, 52, -52], 120);
  assert.ok(d.startsWith('M0 34'), d);
  assert.ok(d.includes('52 154'), d);
  assert.ok(d.trim().endsWith('-52 274'), d);
  assert.equal((d.match(/C/g) || []).length, 2);
});

test('js/worlds.js está en index.html y en el SHELL del service worker', () => {
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.ok(index.includes('src="js/worlds.js"'));
  assert.ok(sw.includes("'js/worlds.js'"));
});
