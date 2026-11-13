// Videos zoom de la Escalera de Sigma (video/valle-zoom/films): narración a ritmo legible y ejemplos que no salen en los
// ejercicios de su lección.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = { sucesiones: 'alg-14', sumaarit: 'alg-14b', geometricas: 'alg-14c', sumageo: 'alg-14d', sumatoria: 'alg-15' };
const src = f => fs.readFileSync(path.join(__dirname, '..', 'video', 'valle-zoom', 'films', f + '.js'), 'utf8');
const narr = f => eval(src(f).match(/FILM\.NARR = (\[[\s\S]*?\n\]);/)[1]);
const alg = fs.readFileSync(path.join(__dirname, '..', 'js', 'courses', 'algebra.js'), 'utf8');
function exOf(id) {   // texto de los ejercicios (ex: [...]) de la lección
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
    sucesiones: ['7, 11, 15', '20, 25, 30', '30, 28, 26', '= 83'],
    sumaarit: ['5050', '5\\,050', '6 + 10', '3 + 5 + 7 + 9 + 11'],
    geometricas: ['3, 6, 12', '= 192', '800, 400', '162'],
    sumageo: ['1023', '1 + 2 + 4', '0.333'],
    sumatoria: ['338', '3\\,628\\,800', '= 384', '1^2 + 2^2 + 3^2'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = { sucesiones: /ochenta y tres/, sumaarit: /cinco mil cincuenta/, geometricas: /Luna/, sumageo: /una/, sumatoria: /trescientos treinta y ocho mil/ };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-1)[2] + narr(f).at(-2)[2], re, f);
});
