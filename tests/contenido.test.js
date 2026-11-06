// Las cadenas de las lecciones con minijuegos llegan a KaTeX tal cual: una barra sin escapar en el
// JS ('\sqrt2' → 'sqrt2', '\tfrac' → TAB + 'frac') no da error de KaTeX pero se ve rota en pantalla.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const TEX_CMD = /(?<![\\A-Za-z])(sqrt|frac|dfrac|tfrac|overline|mathbb|cdot|approx|leq|geq|times|pi|subset|div|Rightarrow|neq)\b/;

function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
  return out;
}

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const lessons = get(ctx, 'COURSE_ALGEBRA').units[0].lessons.filter(l => ['alg-11', 'alg-12', 'alg-13'].includes(l.id));

for (const l of lessons) {
  test(`${l.id}: ningún texto de ejercicio tiene caracteres de control ni comandos TeX sin barra`, () => {
    const bad = strings(l.ex).filter(s => /[\x00-\x1f]/.test(s) || TEX_CMD.test(s));
    assert.deepEqual(bad, []);
  });
}

// La lección 1.3 es «Porcentajes y descuentos»: el interés simple y compuesto queda para otra
// lección, los dos videos vienen de Bunny y todo el texto usa punto decimal.
const alg13 = lessons.find(l => l.id === 'alg-13');

test('alg-13: se llama «Porcentajes y descuentos» y no tiene ejercicios de interés', () => {
  assert.equal(alg13.title, 'Porcentajes y descuentos');
  assert.ok(!alg13.ex.some(e => e.game === 'carrera-interes'));
  assert.deepEqual(strings(alg13.ex).filter(s => /inter[eé]s/i.test(s)), []);
});

test('alg-13: los dos videos vienen de Bunny y el segundo va tras el sexto ejercicio', () => {
  assert.equal(alg13.clip.bunny, '59348bd7-b5b5-4c29-bf79-31a54b439a1b');
  assert.equal(alg13.clip.duration, 224);
  assert.equal(alg13.clip.scenes.length, 0);
  assert.equal(alg13.more.length, 1);
  assert.equal(alg13.more[0].bunny, '35f01df0-beb0-42c1-89bd-c0a6e82d2727');
  assert.equal(alg13.more[0].duration, 131);
  assert.equal(alg13.more[0].after, 6);
  assert.equal(alg13.more[0].scenes.length, 0);
});

test('alg-13: ningún texto usa coma decimal', () => {
  const bad = strings([alg13.ex, alg13.clip, alg13.more]).filter(s => /\d,\d/.test(s));
  assert.deepEqual(bad, []);
});
