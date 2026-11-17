// Video «¿Qué es un conjunto?» en versión estudio (video/conjunto-estudio, lección alg-0a): rótulos que alcanzan a leerse,
// sin preguntas al espectador, ejemplos que no salen en los ejercicios y un cierre que responde al principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const D = require('../video/conjunto-estudio/data.js');

const need = s => Math.max(1.5, [...s].filter(c => !/\s/.test(c)).length / 15 + 1.5);
const diveAt = t => { for (let i = 1; i < D.U.length; i++) if (D.U[i][1] !== D.U[i - 1][1] && t > D.U[i - 1][0] - 1e-9 && t < D.U[i][0] + 1e-9) return true; return false; };

test('cada rótulo dura lo que se tarda en leerlo y cabe en un renglón', () => {
  for (const [a, b, k, l1, l2] of D.CAPS) {
    for (const s of [k, l1, l2]) assert.ok(b - a - 0.5 >= need(s), `${a}: ${s}`);
    for (const s of [l1, l2]) assert.ok(s.length <= 30, s);
  }
});

test('los rótulos no se pisan ni caen en una zambullida', () => {
  D.CAPS.forEach((c, i) => {
    if (i) assert.ok(c[0] >= D.CAPS[i - 1][1] + 0.3, `${c[0]}`);
    for (let t = c[0]; t <= c[1]; t += 0.1) assert.ok(!diveAt(t), `${c[2]} a los ${t.toFixed(1)} s`);
  });
});

test('no hay preguntas al espectador', () => {
  const all = [...D.CAPS.flatMap(c => c.slice(2)), ...D.SUM.map(s => s[1]), ...D.END.slice(1), ...D.NARR.map(n => n[2])];
  for (const s of all) assert.ok(!/[¿?]/.test(s), s);
});

test('la narración va a menos de 3.25 palabras por segundo y en orden', () => {
  D.NARR.forEach(([a, b, s], i) => {
    assert.ok(b - a >= 1.8 && s.split(/\s+/).length / (b - a) <= 3.25, `${a}: ${s}`);
    if (i) assert.ok(a >= D.NARR[i - 1][1], `${a}`);
  });
  assert.ok(D.NARR.at(-1)[1] <= D.DUR);
});

test('el conjunto M son las cuatro canciones del álbum y el aleatorio solo las reordena', () => {
  assert.strictEqual(D.M.join(), D.SONGS.map((s, i) => (s.m ? i : -1)).filter(i => i >= 0).join());
  for (const i of D.M) assert.strictEqual(D.SONGS[i].al, 'Marea baja');
  assert.strictEqual(D.SONGS.filter(s => s.al === 'Marea baja').length, 4);
  assert.strictEqual([...D.SHUFFLED].sort().join(), '0,1,2,3');
  assert.notStrictEqual(D.SHUFFLED.join(), '0,1,2,3');
});

test('cada persona elige canciones distintas: «las mejores» no está bien definida', () => {
  const sets = D.VOTERS.map(v => v[2].join());
  assert.strictEqual(new Set(sets).size, 3);
});

test('los ejemplos del video no salen en los ejercicios de la lección', () => {
  const alg = fs.readFileSync(path.join(__dirname, '..', 'js', 'courses', 'algebra.js'), 'utf8');
  const a = alg.indexOf("id: 'alg-0a'"), b = alg.indexOf("id: 'alg-0b'");
  const ex = alg.slice(alg.indexOf('ex: [', a), b);
  for (const s of D.SONGS) assert.ok(!ex.includes(s.n), s.n);
  assert.ok(!/playlist|canci[oó]n/i.test(ex));
});

test('cubre las ideas de la lección y el final responde al principio', () => {
  const caps = D.CAPS.map(c => c.slice(2).join(' ')).join(' ');
  for (const w of ['Bien definida', 'elemento', 'llaves', '∈', '∉', 'EXTENSIÓN', 'COMPRENSIÓN', 'tal que', 'SIN ORDEN', 'SIN REPETIDOS', 'CARDINAL']) assert.ok(caps.includes(w), w);
  assert.match(D.CAPS[0][3], /playlist/);
  assert.match(D.END[1] + ' ' + D.END[2], /playlist[\s\S]*conjunto/);
  assert.strictEqual(D.SUM.length, 5);
});

test('el zoom vuelve al principio y los sonidos caben en la duración', () => {
  assert.strictEqual(D.U[0][1], 0); assert.strictEqual(D.U.at(-1)[1], 0); assert.strictEqual(D.U.at(-1)[0], D.DUR);
  assert.ok(Math.max(...D.U.map(u => u[1])) === 3);
  for (const e of D.EV) assert.ok(e.t >= 0 && e.t + (e.d || 0) < D.DUR, e.type);
});
