// Videos zoom de la Fuente de la Parábola (video/valle-zoom/films): narración a ritmo legible, ejemplos que no salen en los
// ejercicios de su lección y final que responde la pregunta del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = { complejos: 'alg-23c', lineales: 'alg-1', parabola: 'alg-4a', cuadraticas: 'alg-4' };
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
    complejos: ['\\sqrt{-25}', '3 + 4i', '(2 + i)(3 + 2i)', '2 + 3i'],
    lineales: ['3x + 4 = 25', '4x + 3', 'x + 11', '\\tfrac{x + 1}{3}'],
    parabola: ['x^2 + 4x + 7', '-x^2 + 4x + 1', '(x - 4)^2'],
    cuadraticas: ['x^2 - x - 6', '-x^2 + 4x + 1', 'x^2 - 4x + 5', '\\sqrt5'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    assert.ok(ex.length > 200, `no encontré los ejercicios de ${FILMS[f]}`);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = { complejos: /i, o menos i/, lineales: /siete baldosas/, parabola: /cinco metros/, cuadraticas: /cuatro punto veinticuatro/ };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-2)[2] + ' ' + narr(f).at(-1)[2], re, f);
});
