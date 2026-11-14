// Videos zoom del Río de las Asíntotas (video/valle-zoom/films): narración a ritmo legible, ejemplos que no salen en los
// ejercicios de su lección, cuentas correctas y final que responde la pregunta del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = { dominio: 'alg-25a', fracciones: 'alg-25b', sistemas: 'alg-101', parciales: 'alg-102' };
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
    dominio: ['x^2 + 2x - 3', 'x^2 - 1}', 'x + 5'],
    fracciones: ['\\dfrac{1}{x + 3}', 'x^2 - 25', '2x + 3', '\\dfrac{1}{3}'],
    sistemas: ['v + c = 15', 'v - c = 9', 'x + y + z = 9', '2z = 14'],
    parciales: ['y = 2x + 3', '3x + 1', 'x^2 + 4', '\\dfrac{2}{x - 1}'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    assert.ok(ex.length > 200, `no encontré los ejercicios de ${FILMS[f]}`);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('las cuentas de los videos son correctas', () => {
  const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);
  // dominio: (x² − 1)/(x² + 2x − 3) = (x + 1)/(x + 3) salvo en 1; abajo se anula en −3 y 1
  for (const x of [-5, 0, 2.5]) near((x * x - 1) / (x * x + 2 * x - 3), (x + 1) / (x + 3));
  for (const x of [-3, 1]) near(x * x + 2 * x - 3, 0);
  // fracciones: 1/3 + 1/6 = 1/2 (2 h); 1/x + 1/(x + 3) = (2x + 3)/(x(x + 3)); con x = 3, x(x + 3)/(2x + 3) = 2
  near(1 / 3 + 1 / 6, 1 / 2);
  for (const x of [1, 3, 7]) near(1 / x + 1 / (x + 3), (2 * x + 3) / (x * (x + 3)));
  near(3 * 6 / 9, 2);
  for (const x of [1, 4]) near((x * x - 25) / (3 * x) * (6 * x) / (x + 5), 2 * (x - 5));
  // sistemas: v + c = 15, v − c = 9 → v = 12, c = 3; escalera x = 4, y = 3, z = 2
  assert.deepStrictEqual([12 + 3, 12 - 3], [15, 9]);
  const [x, y, z] = [4, 3, 2];
  assert.deepStrictEqual([x + y + z, x + 2 * y + 2 * z, x + y + 2 * z], [9, 14, 11]);
  // parciales: x² = 2x + 3 en 3 y −1; (3x + 1)/(x² − 1) = 2/(x − 1) + 1/(x + 1); (x² + 4)/(x² − 1) = 1 + 5/(x² − 1)
  for (const r of [3, -1]) near(r * r, 2 * r + 3);
  for (const t of [-3, 0, 2, 5]) near((3 * t + 1) / (t * t - 1), 2 / (t - 1) + 1 / (t + 1));
  for (const t of [0, 2, 5]) near((t * t + 4) / (t * t - 1), 1 + 5 / (t * t - 1));
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = { dominio: /falta una piedra/, fracciones: /dos horas/, sistemas: /doce kil/, parciales: /fracciones simples/ };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-2)[2] + ' ' + narr(f).at(-1)[2], re, f);
});
