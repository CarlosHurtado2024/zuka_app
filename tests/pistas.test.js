// Pistas: cada ejercicio puede llevar `hint`, un empujón que el estudiante abre si se atasca.
// La lección 1.1 (alg-11) tiene el video de conceptos, el de ejemplos y luego sus ejercicios, todos con pista.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
const [mc, num, ord, play, buildQueue] = ['mc', 'num', 'ord', 'play', 'buildQueue'].map(n => get(ctx, n));
const l = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).find(l => l.id === 'alg-11');

test('mc, num, ord y play aceptan { hint } al final', () => {
  assert.equal(mc('q', ['a', 'b'], 0, 'e', { hint: 'h1' }).hint, 'h1');
  assert.equal(num('q', 3, 'e', { hint: 'h2' }).hint, 'h2');
  assert.equal(ord('q', ['a', 'b'], 'e', { hint: 'h3' }).hint, 'h3');
  assert.equal(play('juego', 'q', {}, 'e', { hint: 'h4' }).hint, 'h4');
  assert.equal(mc('q', ['a'], 0, 'e').hint, undefined);
});

test('alg-11: video de conceptos y video de ejemplos de Bunny con su duración', () => {
  assert.equal(l.clip.bunny, '3a8d04bc-5ae8-43e7-af64-d8af25eb2078');
  assert.equal(l.clip.duration, 259);
  assert.equal(l.more.length, 1);
  assert.equal(l.more[0].bunny, '3848a920-6d9b-433b-9e8d-8d5dc3bd843f');
  assert.equal(l.more[0].duration, 238);
  assert.equal(l.more[0].after, undefined, 'los ejemplos van justo tras los conceptos');
});

test('alg-11: conceptos, ejemplos y luego todos los ejercicios', () => {
  const q = JSON.parse(JSON.stringify(buildQueue(l)));
  assert.deepEqual(q.slice(0, 2), [{ k: 'clip', n: 0 }, { k: 'clip', n: 1 }]);
  assert.equal(q.length, l.ex.length + 2);
});

test('alg-11: todos sus ejercicios son juegos interactivos', () => {
  l.ex.forEach((e, i) => assert.equal(e.type, 'play', `ejercicio ${i} es ${e.type}`));
});

test('unidad 1: cada ejercicio de cada lección trae una pista que no regala la respuesta', () => {
  const ids = ['alg-11', 'alg-12b', 'alg-21a', 'alg-21b', 'alg-22a', 'alg-22b'];
  const lessons = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).filter(l => ids.includes(l.id));
  assert.equal(lessons.length, ids.length);
  for (const lesson of lessons) lesson.ex.forEach((e, i) => {
    const where = `${lesson.id} ejercicio ${i}`;
    assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${where} sin pista`);
    if (e.type === 'mc') assert.ok(!e.hint.includes(e.options[e.answer]), `la pista de ${where} dice la respuesta`);
    if (e.type === 'input') assert.ok(!new RegExp(`(^|[^\\d.])${String(e.answer).replace('-', '−?-?')}([^\\d.]|$)`).test(e.hint), `la pista de ${where} dice la respuesta`);
  });
});

test('hintBlock: sin pista no dibuja nada; con pista, botón «Ver pista» y el texto oculto', () => {
  const ex = loadScripts(['js/exercises.js']);
  ex.tex = s => `<tex>${s}</tex>`; ex.ICON = { bulb: '<svg/>' };
  const hintBlock = get(ex, 'hintBlock');
  assert.equal(hintBlock({ q: 'x' }), '');
  const h = hintBlock({ hint: 'Cuenta los pisos' });
  assert.ok(h.includes('Ver pista') && h.includes('class="hint-btn"'), h);
  assert.ok(/<p class="hint-text" hidden>.*<tex>Cuenta los pisos<\/tex>/.test(h), h);
});
