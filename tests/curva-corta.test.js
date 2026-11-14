// Clip «La curva más corta» (video/curva-corta): geometría de la esfera, rótulos y subtítulos.
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { pathToFileURL } = require('url');
const load = () => import(pathToFileURL(path.join(__dirname, '..', 'video', 'curva-corta', 'data.js')));

test('distancias de Nueva York (JFK) a Tokio (Narita)', async () => {
  const D = await load();
  const th = D.centralAngle(D.NYC, D.TYO);
  assert.ok(Math.abs(th - 1.6998) < 1e-3, th);
  assert.ok(Math.abs(th * 180 / Math.PI - 97.39) < .02);
  assert.strictEqual(Math.round(D.R * th), 10829);
  assert.strictEqual(Math.round(D.rhumb(D.NYC, D.TYO)), 12745);
  assert.strictEqual(Math.round(D.chord(D.NYC, D.TYO)), 9572);
  // la cuerda < el arco < la recta del mapa
  assert.ok(D.chord(D.NYC, D.TYO) < D.R * th && D.R * th < D.rhumb(D.NYC, D.TYO));
});

test('el arco pasa por el norte de Alaska (punto más al norte ≈ 69.6° N)', async () => {
  const D = await load();
  let best = { lat: -90 };
  for (let i = 0; i <= 400; i++) { const p = D.gcPoint(D.NYC, D.TYO, i / 400); if (p.lat > best.lat) best = p; }
  assert.ok(Math.abs(best.lat - 69.59) < .05, best.lat);
  assert.ok(best.lon < -140 && best.lon > -160, best.lon);   // longitud de Alaska
  const a = D.gcPoint(D.NYC, D.TYO, 0), b = D.gcPoint(D.NYC, D.TYO, 1);
  assert.ok(Math.abs(a.lat - D.NYC.lat) < 1e-9 && Math.abs(b.lon - D.TYO.lon) < 1e-9);
});

test('la recta del mapa es recta en Mercator y el arco no', async () => {
  const D = await load();
  const dev = pts => { const [p, q] = [pts[0], pts.at(-1)]; let m = 0;
    for (const r of pts) m = Math.max(m, Math.abs((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)) / Math.hypot(q.x - p.x, q.y - p.y)); return m; };
  const merc = f => [...Array(41)].map((_, i) => f(i / 40)).map(p => ({ x: D.wrapLon(p.lon - D.LON0) * Math.PI / 180, y: D.mercY(p.lat) }));
  assert.ok(dev(merc(f => D.rhumbPoint(D.NYC, D.TYO, f))) < 1e-9);
  assert.ok(dev(merc(f => D.gcPoint(D.NYC, D.TYO, f))) > .3);
});

test('cuentas en pantalla: d = R·θ, diferencia y horas de vuelo', async () => {
  const D = await load();
  const L = D.LABELS;
  assert.ok(L.angle.includes('97.4°') && L.angle.includes('1.70 rad'));
  assert.ok(L.calc.includes('10 829 km'));
  assert.ok(L.gcKm.includes('10 829') && L.rhKm.includes('12 745'));
  assert.ok(L.diff.includes('1 916'));
  assert.ok(Math.abs(D.SLAB_GC - 10.829) < .001 && Math.abs(D.SLAB_RH - 12.745) < .001);
});

test('subtítulos: un renglón, sin encimarse, dentro del clip; decimales con punto', async () => {
  const D = await load();
  for (const c of D.NARR) assert.ok(c.text.length <= 46, c.text);
  for (let i = 1; i < D.NARR.length; i++) assert.ok(D.NARR[i].t0 >= D.NARR[i - 1].t1, D.NARR[i].text);
  assert.ok(D.NARR.at(-1).t1 <= D.DUR && D.DUR <= 120);
  const all = [...D.NARR.map(c => c.text), ...Object.values(D.LABELS).flat()];
  for (const s of all) assert.ok(!/\d,\d/.test(s), s);
});
