// Videos «lámina» de las lecciones de Álgebra (video/lamina, spec en video/lamina/README.md): cada película corresponde a su
// lección y su mundo, dura cerca de cinco minutos, sus rótulos alcanzan a leerse, la narración va a ritmo de lectura, no hay
// preguntas al espectador y sus ejemplos no salen en los ejercicios de la lección.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const { timeline, plain } = require('../video/lamina/timeline.js');
const PLATES = require('../video/lamina/plates.js');

const DIR = path.join(__dirname, '..', 'video', 'lamina');
const FILMS = fs.readdirSync(path.join(DIR, 'films')).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));
const course = loadScripts(['js/games/kit.js', 'js/games/arma-la-cuenta.js', 'js/games/escala-solucion.js', 'js/content.js', 'js/courses/algebra.js', 'js/courses/mundos-altos.js']);
const ALG = get(course, 'COURSE_ALGEBRA');
const LESSONS = ALG.units.flatMap(u => u.lessons.map((l, i) => ({ l, u, i })));
const filmOf = name => get(loadScripts(['video/lamina/plates.js', 'video/lamina/timeline.js', 'video/lamina/kit.js', `video/lamina/films/${name}.js`]), 'FILM');
const need = s => Math.max(1.5, [...plain(s)].filter(c => !/\s/.test(c)).length / 15 + 1.5);
const words = s => plain(s).split(/\s+/).filter(Boolean).length;

test('hay películas', () => assert.ok(FILMS.length > 0));

test('toda lección de Álgebra tiene su película lámina (alg-0a la tiene en video/conjunto-lamina)', () => {
  const have = new Set(FILMS.map(n => filmOf(n).lesson));
  const faltan = LESSONS.map(x => x.l.id).filter(id => id !== 'alg-0a' && !have.has(id));
  assert.strictEqual(faltan.join(', '), '');
});

test('las fórmulas solo usan comandos que el motor sabe dibujar', () => {
  const ok = new Set(['frac', 'sqrt', 'hl', 'no', 'mu', 'ink', 's', 'id', 't', 'bar', 'op', 'quad', 'qquad', 'left', 'right', 'log', 'ln']);
  for (const name of FILMS) {
    const src = fs.readFileSync(path.join(DIR, 'films', name + '.js'), 'utf8');
    for (const m of src.matchAll(/R`([^`]*)`/g)) for (const c of m[1].matchAll(/\\([a-zA-Z]+)/g)) assert.ok(ok.has(c[1]), `${name}: \\${c[1]} no existe en el motor`);
  }
});

test('ninguna película tiene caracteres de control (una barra comida dentro de una cadena)', () => {
  for (const name of FILMS) { const src = fs.readFileSync(path.join(DIR, 'films', name + '.js'), 'utf8'); assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(src), name); }
});

for (const name of FILMS) {
  test(`${name}: lección, mundo, rótulos, narración y ejemplos`, () => {
    const F = filmOf(name), TL = timeline(F);
    const hit = LESSONS.find(x => x.l.id === F.lesson);
    assert.ok(hit, `lección ${F.lesson}`);
    assert.strictEqual(hit.u.world, F.world, 'mundo');
    assert.ok(PLATES[F.world], 'lámina del mundo');
    assert.strictEqual(F.title, hit.l.title, 'título');
    assert.deepStrictEqual([...F.n], [hit.i + 1, hit.u.lessons.length], 'número de lección');
    const nxt = LESSONS[LESSONS.indexOf(hit) + 1];
    assert.strictEqual(F.next, nxt ? nxt.l.title : null, 'siguiente lección');
    assert.ok(TL.DUR >= 240 && TL.DUR <= 400, `dura ${TL.DUR} s`);

    const ids = new Set();
    for (const s of F.scenes) {
      assert.ok(typeof s.draw === 'function' && s.name && !ids.has(s.id), `escena ${s.id}`); ids.add(s.id);
      assert.ok(s.caps.length > 0, `${s.id}: sin rótulos`);
      s.caps.forEach(([a, b, k, l1, l2], i) => {
        for (const x of [k, l1, l2].filter(Boolean)) assert.ok(b - a - 0.5 >= need(x), `${s.id}: «${x}» dura ${b - a}`);
        for (const x of [l1, l2].filter(Boolean)) assert.ok(plain(x).length <= 31, `${s.id}: renglón largo «${x}»`);
        assert.ok(a >= 0.4 && b <= s.dur - 0.4, `${s.id}: rótulo fuera de la escena «${l1}»`);
        if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3, `${s.id}: rótulos encimados «${l1}»`);
      });
      (s.narr || []).forEach(([a, b], i) => { assert.ok(a >= 0 && b <= s.dur, `${s.id}: narración fuera de la escena`); if (i) assert.ok(a >= s.narr[i - 1][1], `${s.id}: narración encimada`); });
    }
    TL.NARR.forEach(([a, b, s]) => assert.ok(b - a >= 1.8 && words(s) / (b - a) <= 3.25, `${name} ${a}: ${words(s)} palabras en ${(b - a).toFixed(1)} s`));
    assert.ok(TL.NARR.length >= F.scenes.length, 'cada escena tiene narración');
    const all = [...TL.CAPS.flatMap(c => [c.k, c.l1, c.l2]), ...TL.NARR.map(n => n[2]), ...F.sum.flat(), ...F.end, F.intro].filter(Boolean);
    for (const s of all) assert.ok(!/[¿?]/.test(s), `pregunta: ${s}`);
    assert.ok(F.sum.length >= 4 && F.sum.length <= 8, 'resumen de 4 a 8 renglones');
    assert.strictEqual(F.end.length, 2);
    // una barra en una cadena '…' se come la letra (\f, \t, \b): las fórmulas van en R`…`
    const walk = v => (typeof v === 'string' ? assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v), `carácter de control en «${v}»: usa R\`…\``) : Array.isArray(v) ? v.forEach(walk) : v && typeof v === 'object' ? Object.values(v).forEach(walk) : 0);
    walk({ ...F, scenes: F.scenes.map(s => ({ caps: s.caps, narr: s.narr })) });
    const ex = JSON.stringify(hit.l.ex);
    assert.ok(Array.isArray(F.examples) && F.examples.length >= 2, 'lista de ejemplos');
    for (const e of F.examples) assert.ok(!ex.includes(e), `el ejemplo «${e}» sale en los ejercicios`);
  });
}
