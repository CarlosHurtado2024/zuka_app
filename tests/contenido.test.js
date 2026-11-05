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
const lessons = get(ctx, 'COURSE_ALGEBRA').units[0].lessons.filter(l => ['alg-11', 'alg-12'].includes(l.id));

for (const l of lessons) {
  test(`${l.id}: ningún texto de ejercicio tiene caracteres de control ni comandos TeX sin barra`, () => {
    const bad = strings(l.ex).filter(s => /[\x00-\x1f]/.test(s) || TEX_CMD.test(s));
    assert.deepEqual(bad, []);
  });
}
