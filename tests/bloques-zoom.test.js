// Videos zoom del Taller de los Bloques (video/valle-zoom/films): narración a ritmo legible, ejemplos que no salen en los
// ejercicios de su lección y final que responde la pregunta del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = { polinomios: 'alg-23a', notables: 'alg-3', binomio: 'alg-24c', factorizacion: 'alg-24b' };
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
    polinomios: ['2x^2 + 3x + 4', 'x^3 - 4x^2', '(x + 1)(x + 4)', '234'],
    notables: ['(x + 4)^2', '99', '21', '(x + 2)(x + 6)'],
    binomio: ['(x + 2)^4', '24x', '\\binom{4}{2}'],
    factorizacion: ['3x + 6', 'x^2 - 16', 'x^2 + 5x + 6', 'x^3 - 8', '2x^2 + 7x + 3', 'x^2 + 8x + 20'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    assert.ok(ex.length > 200, `no encontré los ejercicios de ${FILMS[f]}`);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = { polinomios: /doscientos treinta y cuatro/, notables: /ocho x más dieciséis/, binomio: /dieciséis productos/, factorizacion: /x más dos por x más tres/ };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-2)[2] + ' ' + narr(f).at(-1)[2], re, f);
});
