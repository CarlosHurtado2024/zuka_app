// Videos zoom de la Selva Exponencial (video/valle-zoom/films): narración a ritmo legible, ejemplos que no salen en los
// ejercicios de su lección, cuentas correctas y final que responde la pregunta del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = { lirios: 'alg-71', interes: 'alg-13b', logaritmos: 'alg-72', ecuaciones: 'alg-73' };
const src = f => fs.readFileSync(path.join(__dirname, '..', 'video', 'valle-zoom', 'films', f + '.js'), 'utf8');
const narr = f => eval(src(f).match(/FILM\.NARR = (\[[\s\S]*?\n\]);/)[1]);
const alg = fs.readFileSync(path.join(__dirname, '..', 'js', 'courses', 'algebra.js'), 'utf8');
function exOf(id) {
  const i = alg.indexOf(`id: '${id}',`), j = alg.indexOf('ex: [', i), k = alg.indexOf("\n          id: '", j);
  return alg.slice(j, k < 0 ? undefined : k);
}

test('cada película tiene narración a menos de 3.2 palabras por segundo', () => {
  for (const f of Object.keys(FILMS)) for (const [a, b, s] of narr(f)) {
    const w = s.split(/\s+/).length;
    assert.ok(b - a >= 1.8 && w / (b - a) <= 3.25, `${f} ${a}: ${s}`);
  }
});

test('los ejemplos de cada video no salen en los ejercicios de su lección', () => {
  const EXAMPLES = {
    lirios: ['2^x = 512', '25^x', '1024', '(1 + 1/n)'],
    interes: ['2\\,000\\,000', '1.06', '6 %'],
    logaritmos: ['\\log_2 32', '\\log_2 1000', '\\log_2(4', '1000'],
    ecuaciones: ['8^x', '1.06', '\\log_2 x + \\log_2(x - 2)', 'x - 2) = 3'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    assert.ok(ex.length > 200, `no encontré los ejercicios de ${FILMS[f]}`);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('las cuentas de los videos son correctas', () => {
  const near = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) < e, `${a} ≠ ${b}`);
  // lirios: 2^10 = 1024 llena; la mitad 512 = 2^9; 25^x = 125 → x = 3/2; (1 + 1/n)^n → e
  assert.strictEqual(2 ** 10, 1024); assert.strictEqual(2 ** 9, 512);
  near(25 ** 1.5, 125);
  near((1 + 1 / 2) ** 2, 2.25); near((1 + 1 / 10) ** 10, 2.5937, 1e-4); near((1 + 1 / 1000) ** 1000, 2.7169, 1e-4);
  // interés: 2 000 000 al 6 %: simple duplica en 16.67 años; compuesto en 11.9; año 2 y 3; continuo a 12 años
  near(2e6 * 0.06, 120000); near(1e6 / 60000, 16.6667, 1e-3);
  near(2e6 * 1.06 ** 2, 2247200, 1e-6); near(2e6 * 1.06 ** 3, 2382032, 1e-6);
  near(Math.log(2) / Math.log(1.06), 11.896, 1e-3); assert.ok(2e6 * 1.06 ** 12 > 4e6);
  near(2e6 * Math.exp(0.06 * 12), 4108866, 1);
  // logaritmos: log2 32 = 5, log2 64 = 6 = 2 + 4, log2(32^3) = 15, log2 1000 ≈ 9.97
  near(Math.log2(32), 5); near(Math.log2(4 * 16), 2 + 4); near(Math.log2(64 / 4), 4); near(Math.log2(32 ** 3), 15);
  near(3 / Math.log10(2), 9.966, 1e-3);
  // ecuaciones: 8^x = 4^(x + 1) → x = 2; 1.06^t = 3 → t ≈ 18.85; log2 x + log2(x − 2) = 3 → x = 4 (−2 no sirve)
  assert.strictEqual(8 ** 2, 4 ** 3);
  near(Math.log(3) / Math.log(1.06), 18.854, 1e-3);
  near(Math.log2(4) + Math.log2(4 - 2), 3);
  for (const r of [4, -2]) assert.strictEqual(r * (r - 2), 8);
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = { lirios: /día nueve/, interes: /cinco años antes/, logaritmos: /nueve punto nueve siete/, ecuaciones: /año diecinueve/ };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-2)[2] + ' ' + narr(f).at(-1)[2], re, f);
});
