// Videos zoom de la Cordillera Cúbica (video/valle-zoom/films): narración a ritmo legible, ejemplos que no salen en los
// ejercicios de su lección y final que responde la pregunta del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = { division: 'alg-23b', residuo: 'alg-92', ceros: 'alg-93' };
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
    division: ['x^3 - 2x^2 - 5x + 6', 'x^2 + 6x + 10', 'x^2 - x - 6', 'x^2 + ax + b', '47'],
    residuo: ['x^3 - 2x^2 - 5x + 6', '(x - 3)', 'x^2 + x - 2', 'P(2)', 'P(3)'],
    ceros: ['x^3 - 3x^2 + 4x - 2', '(x - 2)^2(x + 1)', 'x^2 - 2x + 2', '1 + i', '1 \\pm i'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    assert.ok(ex.length > 200, `no encontré los ejercicios de ${FILMS[f]}`);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('las cuentas del video son correctas', () => {
  const P = x => x ** 3 - 2 * x ** 2 - 5 * x + 6, Q = x => x ** 3 - 3 * x ** 2 + 4 * x - 2, R = x => (x - 2) ** 2 * (x + 1);
  for (const r of [-2, 1, 3]) assert.strictEqual(P(r), 0);
  assert.strictEqual(P(2), -4);
  for (const x of [-3, 0, 5]) assert.strictEqual(P(x), (x - 1) * (x * x - x - 6));
  for (const x of [-3, 0, 5]) assert.strictEqual(Q(x), (x - 1) * (x * x - 2 * x + 2));
  for (const x of [-3, 0, 5]) assert.strictEqual(R(x), x ** 3 - 3 * x * x + 4);
  assert.strictEqual(Q(1), 0); assert.strictEqual(Q(2), 2);
  assert.strictEqual(47, 5 * 9 + 2);
  for (const x of [-1, 0, 3]) assert.strictEqual(x * x + 6 * x + 10, (x + 2) * (x + 4) + 2);
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = { division: /x al cuadrado menos x menos seis/, residuo: /menos cuatro/, ceros: /uno más i/ };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-2)[2] + ' ' + narr(f).at(-1)[2], re, f);
});
