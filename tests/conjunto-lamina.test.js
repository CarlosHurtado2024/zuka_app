// Video «¿Qué es un conjunto?» en modelo lámina (video/conjunto-lamina, lección alg-0a): mismo estilo que la lámina del mundo,
// rótulos que alcanzan a leerse, sin preguntas al espectador, cada concepto y cada notación de la lección, y ejemplos que no
// salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const D = require('../video/conjunto-lamina/data.js');

const need = s => Math.max(1.5, [...s].filter(c => !/\s/.test(c)).length / 15 + 1.5);

test('dura entre cuatro y seis minutos y las escenas van seguidas', () => {
  assert.ok(D.DUR >= 240 && D.DUR <= 360, String(D.DUR));
  D.SC.forEach((s, i) => assert.strictEqual(s.t0, i ? D.SC[i - 1].t1 : 0));
  assert.strictEqual(D.SC.at(-1).t1, D.DUR);
});

test('cada rótulo dura lo que se tarda en leerlo, cabe en un renglón y no se sale de su escena', () => {
  D.SCENES.forEach(s => s.caps.forEach(([a, b, k, l1, l2], i) => {
    for (const x of [k, l1, l2]) assert.ok(b - a - 0.5 >= need(x), `${s.id}: ${x}`);
    for (const x of [l1, l2]) assert.ok(x.length <= 30, x);
    assert.ok(a >= 0.4 && b <= s.dur - 0.5, `${s.id}: ${l1}`);
    if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3, `${s.id}: ${l1}`);
  }));
});

test('no hay preguntas al espectador', () => {
  for (const s of [...D.CAPS.flatMap(c => c.slice(2)), ...D.SUM, ...D.END.slice(1), ...D.NARR.map(n => n[2])]) assert.ok(!/[¿?]/.test(s), s);
});

test('la narración va a menos de 3.25 palabras por segundo, en orden y con lenguaje sencillo', () => {
  D.NARR.forEach(([a, b, s], i) => {
    assert.ok(b - a >= 1.8 && s.split(/\s+/).length / (b - a) <= 3.25, `${a}: ${s}`);
    if (i) assert.ok(a >= D.NARR[i - 1][1], String(a));
  });
  assert.ok(D.NARR.at(-1)[1] <= D.DUR);
});

test('explica cada concepto y cada notación de la lección', () => {
  const caps = D.CAPS.map(c => c.slice(2).join(' ')).join(' ');
  for (const w of ['colección', 'bien definida', 'elemento', 'mayúscula', 'minúscula', 'DIAGRAMA DE VENN', '∈', '«pertenece a»', '∉', '«no pertenece a»',
    'EXTENSIÓN', 'llaves', 'comas', 'COMPRENSIÓN', '«tal que»', 'x representa', 'iguales', 'ORDEN', 'REPETIDOS', 'CARDINAL', 'n(V)']) assert.ok(caps.includes(w), w);
  assert.strictEqual(D.SUM.length, 6);
  for (const w of ['∈', '∉', '{a, e, i, o, u}', '{x : x es una vocal}', 'n(V) = 5']) assert.ok(D.SUM.join(' ').includes(w), w);
});

test('los ejemplos del video no salen en los ejercicios de la lección', () => {
  const alg = fs.readFileSync(path.join(__dirname, '..', 'js', 'courses', 'algebra.js'), 'utf8');
  const a = alg.indexOf("id: 'alg-0a'"), ex = alg.slice(alg.indexOf('ex: [', a), alg.indexOf("id: 'alg-0b'"));
  assert.ok(!/salsa/i.test(ex));
  assert.ok(!/\\\{a, e, i, o, u\\\}|letras bonitas/.test(ex));
});

test('la palabra del ejemplo tiene cinco letras y tres distintas; el final cierra la idea del principio', () => {
  assert.strictEqual(D.WORD.length, 5); assert.strictEqual(new Set(D.WORD).size, 3);
  assert.match(D.CAPS[0][3] + ' ' + D.CAPS[0][4], /una idea/);
  assert.match(D.END[1], /esta idea/);
});

test('los sonidos caben en la duración', () => { for (const e of D.EV) assert.ok(e.t >= 0 && e.t < D.DUR - 0.5, e.type); });

// Desde el 2026-11-17 la lección alg-0a usa el video de Plutón (tests/conjunto-cosmos.test.js); este quedó como
// alternativa en Bunny (2c656c56-…, 249.4 s).
