// Clip «La IA está hecha de álgebra» (video/ia-algebra): la neurona de juguete, la montaña del error y los textos.
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { pathToFileURL } = require('url');
const load = () => import(pathToFileURL(path.join(__dirname, '..', 'video', 'ia-algebra', 'data.js')));

test('la neurona del texto: z = 0.3 y σ(z) = 0.574', async () => {
  const D = await load();
  assert.deepStrictEqual([D.X.join(), D.W0.join(), D.B], ['2,3', '0.4,-0.2', 0.1]);
  assert.ok(Math.abs(D.z(D.W0) - 0.3) < 1e-12);
  assert.strictEqual(D.sigma(D.z(D.W0)).toFixed(3), '0.574');
  assert.strictEqual(D.sigma(0), 0.5);
  assert.strictEqual(D.loss(D.W0).toFixed(3), '0.181');
});

test('la derivada es la exacta (comparada con diferencias finitas)', async () => {
  const D = await load();
  for (const w of [D.W0, [0.7, 0.1], [-0.3, 0.9]]) {
    const g = D.grad(w), h = 1e-6;
    for (let i = 0; i < 2; i++) {
      const a = w.slice(), b = w.slice(); a[i] += h; b[i] -= h;
      assert.ok(Math.abs((D.loss(a) - D.loss(b)) / (2 * h) - g[i]) < 1e-6);
    }
  }
});

test('12 pasos con η = 0.25: de 57 % a 91 %, el error de 0.181 a 0.008', async () => {
  const D = await load();
  assert.strictEqual(D.ETA, 0.25);
  assert.strictEqual(D.PATH.length, 13);
  const first = D.PATH[0], last = D.PATH[12];
  assert.strictEqual(Math.round(first.y * 100), 57);
  assert.strictEqual(Math.round(last.y * 100), 91);
  assert.strictEqual(last.L.toFixed(3), '0.008');
  for (let k = 1; k < 13; k++) assert.ok(D.PATH[k].L < D.PATH[k - 1].L, 'el error baja en cada paso');
  // cada paso es w − η·∇L
  const g = D.grad(D.PATH[3].w);
  assert.ok(Math.abs(D.PATH[4].w[0] - (D.PATH[3].w[0] - 0.25 * g[0])) < 1e-12);
  // la montaña contiene todo el camino
  for (const p of D.PATH) assert.ok(p.w[0] > D.WIN.w1[0] && p.w[0] < D.WIN.w1[1] && p.w[1] > D.WIN.w2[0] && p.w[1] < D.WIN.w2[1]);
});

test('la tabla de 3 × 3 del texto está dentro del dibujo de Mishi', async () => {
  const D = await load();
  assert.strictEqual(D.MISHI.length, 16);
  for (const row of D.MISHI) { assert.strictEqual(row.length, 16); for (const v of row) assert.ok(Number.isInteger(v) && v >= 0 && v <= 255); }
  const [r, c] = D.PATCH_AT;
  const got = [0, 1, 2].map(i => [0, 1, 2].map(j => D.MISHI[r + i][c + j]));
  assert.strictEqual(JSON.stringify(got), JSON.stringify([[0, 120, 240], [30, 180, 255], [10, 90, 200]]));
});

test('los rótulos llevan los números calculados', async () => {
  const D = await load();
  const all = JSON.stringify(D.LABELS) + D.NARR.map(n => n.text).join(' ');
  for (const s of ['0.3', '0.574', '0.181', '0.008', '57', '91', '0.25']) assert.ok(all.includes(s), s);
  assert.ok(!/\d,\d/.test(all), 'decimales con punto');
});

test('subtítulos: en orden, sin encimarse, con tiempo de lectura y dentro del clip', async () => {
  const D = await load();
  let prev = 0;
  for (const n of D.NARR) {
    assert.ok(n.t0 >= prev, n.text);
    assert.ok(n.t1 - n.t0 >= Math.max(1.8, n.text.replace(/\s/g, '').length / 15 + 1.5) - 1e-9, n.text);
    prev = n.t1;
  }
  assert.ok(prev <= D.DUR - 0.3, 'el último subtítulo cabe');
});
