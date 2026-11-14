// Clip «¿Por qué el 14 de marzo?» (video/dia-pi, estilo Caption News): números, fechas, cortes y subtítulos.
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const DIR = path.join(__dirname, '..', 'video', 'dia-pi');
const load = () => import(pathToFileURL(path.join(DIR, 'data.js')));

test('pi y la taza: 26.1 ÷ 8.3 ≈ 3.14, y los dígitos son los de π', async () => {
  const D = await load();
  assert.strictEqual(D.ratio.toFixed(2), '3.14');
  assert.ok(Math.abs(D.ratio - Math.PI) < 0.01);
  assert.strictEqual(D.PI, Math.PI.toFixed(8));
  // 3/14 en formato mes/día son los primeros dígitos
  assert.strictEqual('3.14', '3/14'.replace('/', '.'));
  assert.ok(D.PI.startsWith('3.14159'));
});

test('fechas de la historia, con sus fuentes en FACTS.md', async () => {
  const D = await load();
  assert.deepStrictEqual([D.DATES.shaw, D.DATES.house], [1988, 2009]);
  assert.strictEqual(D.DATES.unesco, '26 nov 2019');
  assert.strictEqual(D.DATES.first, '14 mar 2020');
  const facts = fs.readFileSync(path.join(DIR, 'FACTS.md'), 'utf8');
  for (const s of ['idm314.org', 'exploratorium.edu', 'BILLS-111hres224', '26 de noviembre de 2019', '1988']) assert.ok(facts.includes(s), s);
  const caps = D.CAPS.map(c => c.big + ' ' + (c.small || '')).join(' ');
  for (const s of ['1988', '2009', '2019', '14/3/2020', '26.1', '8.3']) assert.ok(caps.includes(s), s);
});

test('cortes seguidos, en la rejilla de 0.5 s, y que cubren el clip', async () => {
  const D = await load();
  assert.strictEqual(D.SHOTS[0].a, 0);
  for (let i = 0; i < D.SHOTS.length; i++) {
    const s = D.SHOTS[i];
    assert.ok(Number.isInteger(s.a * 2) && Number.isInteger(s.b * 2), 'rejilla ' + s.a);
    if (i) assert.strictEqual(s.a, D.SHOTS[i - 1].b);
    if (s.fr) { const c = D.CLIPS[s.fr]; assert.ok(c, s.fr); assert.ok((s.o || 0) + (s.b - s.a) <= c.t + 1e-9 || s.k === 'freeze', 'la secuencia alcanza: ' + s.fr); }
  }
  assert.strictEqual(D.SHOTS.at(-1).b, D.DUR);
});

test('subtítulos: no se enciman, una palabra clave como mucho, tiempo para leer', async () => {
  const D = await load();
  let prev = D.HOOK.t1;
  for (const c of D.CAPS) {
    assert.ok(c.t0 >= prev - 1e-9, c.big);
    assert.ok((c.big.match(/\{/g) || []).length <= 1, c.big);
    const chars = (D.plain(c.big) + (c.small || '')).replace(/\s/g, '').length;
    assert.ok(c.t1 - c.t0 >= Math.max(1.8, chars / 15 * .55 + 1.2), 'tiempo: ' + c.big);   // el grande se lee de un vistazo
    assert.ok(!/\d,\d/.test(c.big + (c.small || '')), 'decimales con punto');
    prev = c.t1;
  }
  assert.ok(prev <= D.DUR);
  assert.strictEqual(D.CUES.length, D.CAPS.length + 1);
});
