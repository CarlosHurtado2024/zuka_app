// Clip «¿Cómo se mide el universo?» (video/distancias-radar): los cuatro escalones de la escalera de distancias.
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { pathToFileURL } = require('url');
const load = () => import(pathToFileURL(path.join(__dirname, '..', 'video', 'distancias-radar', 'data.js')));

test('láser a la Luna: 2.56 s de ida y vuelta dan unos 384 000 km', async () => {
  const D = await load();
  assert.strictEqual(D.C_KMS, 299792);
  assert.strictEqual(D.LASER.t, 2.56);
  const d = D.C_KMS * D.LASER.t / 2;
  assert.strictEqual(Math.round(d / 1000) * 1000, 384000);
  assert.strictEqual(D.LASER.d, 384000);
});

test('paralaje de Próxima Centauri: 0.768″ → 1.30 pc → 4.2 años luz → 40 billones de km', async () => {
  const D = await load();
  const pc = 1 / D.PARALLAX.p;
  assert.strictEqual(pc.toFixed(2), '1.30');
  const ly = pc * D.LY_PER_PC;
  assert.strictEqual(ly.toFixed(1), '4.2');
  assert.strictEqual(Math.round(ly * D.KM_PER_LY / 1e12), 40);
  assert.strictEqual(D.PARALLAX.pc, '1.30');
  // una moneda de 2.3 cm vista a 5 km subtiende cerca de 1″: más que 0.768″
  const arcsec = Math.atan(0.023 / 5000) * 180 / Math.PI * 3600;
  assert.ok(arcsec > 0.9 && arcsec < 1.0);
  assert.ok(D.PARALLAX.p < arcsec);
});

test('velas estándar: al doble de distancia, la luz se reparte en 4 cuadros', async () => {
  const D = await load();
  const F = d => D.CANDLE.L / (4 * Math.PI * d * d);
  assert.ok(Math.abs(F(2) / F(1) - 0.25) < 1e-12);
  assert.strictEqual(D.CANDLE.cells.join(), '1,4');
  assert.strictEqual(D.CEPHEID.period, 5.37);
});

test('corrimiento al rojo: 656.3 → 669.4 nm da z ≈ 0.02, 6 000 km/s, 86 Mpc y 280 millones de años luz', async () => {
  const D = await load();
  const { lab, obs, H0 } = D.REDSHIFT;
  const z = (obs - lab) / lab;
  assert.strictEqual(z.toFixed(2), '0.02');
  const v = D.C_KMS * z;
  assert.strictEqual(Math.round(v / 1000) * 1000, 6000);
  const mpc = 6000 / H0;
  assert.strictEqual(Math.round(mpc), 86);
  assert.strictEqual(Math.round(mpc * D.LY_PER_PC / 10) * 10, 280);
});

test('la narración va en orden, sin encimarse, dentro del clip y sin preguntas', async () => {
  const D = await load();
  let prev = 0;
  for (const n of D.NARR) {
    assert.ok(n.t0 >= prev, n.id);
    assert.ok(n.t1 > n.t0 && n.t1 <= D.DUR, n.id);
    assert.ok(!/[¿?]/.test(n.text), 'la narración no le pregunta al espectador: ' + n.id);
    prev = n.t1;
  }
  assert.ok(D.NARR.length >= 12);
});

test('los textos en pantalla usan punto decimal (nada de 0,768 ni 2,56)', async () => {
  const D = await load();
  for (const s of D.ALL_TEXT) assert.ok(!/\d,\d/.test(s), s);
});
