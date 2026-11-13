// Clip «El arroz del rey» (video/arroz-ajedrez): cuentas exactas, unidades y subtítulos legibles.
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { pathToFileURL } = require('url');
const load = () => import(pathToFileURL(path.join(__dirname, '..', 'video', 'arroz-ajedrez', 'data.js')));

test('granos por casilla y total exactos', async () => {
  const D = await load();
  assert.strictEqual(D.fmt(D.grains(1)), '1');
  assert.strictEqual(D.fmt(D.grains(10)), '512');
  assert.strictEqual(D.fmt(D.grains(20)), '524 288');
  assert.strictEqual(D.fmt(D.grains(40)), '549 755 813 888');
  assert.strictEqual(D.fmt(D.grains(64)), '9 223 372 036 854 775 808');
  assert.strictEqual(D.fmt(D.total), '18 446 744 073 709 551 615');
  // la última casilla tiene un grano más que todas las anteriores juntas
  let rest = 0n; for (let n = 1; n <= 63; n++) rest += D.grains(n);
  assert.strictEqual(D.grains(64), rest + 1n);
});

test('torres en años de cosecha: 443 y 443, total cerca de 887', async () => {
  const D = await load();
  assert.strictEqual(D.PLATES64, 443);
  assert.strictEqual(D.PLATES_REST, 443);
  assert.strictEqual(D.YEARS_ALL, 887);
  assert.ok(Math.abs(D.PLATES64 + D.PLATES_REST - D.YEARS_ALL) <= 1);
});

test('las lecturas dicen las masas bien redondeadas', async () => {
  const D = await load();
  const kg20 = D.tonnes(D.grains(20)) * 1000, t30 = D.tonnes(D.grains(30)), t40 = D.tonnes(D.grains(40)), t50 = D.tonnes(D.grains(50));
  assert.strictEqual(Math.round(kg20), 13);
  assert.strictEqual(Math.round(t30), 13);
  assert.strictEqual(Math.round(t40 / 100) * 100, 13700);
  assert.strictEqual(Math.round(t50 / 1e6), 14);
  assert.strictEqual(Math.round(D.tonnes(D.grains(64)) / 1e10) * 1e4, 230000);   // millones de t
});

test('subtítulos: un renglón corto, sin encimarse y dentro del clip', async () => {
  const D = await load();
  for (const c of D.NARR) assert.ok(c.text.length <= 46, c.text);
  for (let i = 1; i < D.NARR.length; i++) assert.ok(D.NARR[i].t0 >= D.NARR[i - 1].t1, D.NARR[i].text);
  assert.ok(D.NARR.at(-1).t1 <= D.DUR);
  assert.ok(D.DUR <= 120);
  // decimales con punto
  for (const s of [...D.NARR.map(c => c.text), ...Object.values(D.LABELS).flat()]) assert.ok(!/\d,\d/.test(s), s);
});
