// Videos del mundo «La Recta Real» (video/recta-cosmos: alg-11 a alg-12d) en estilo «showreel matemático», pedidos por el
// usuario el 2026-11-27: historia real o analogía en cada uno, entre 4 y 5 minutos, conceptos de la lección, sin preguntas
// al espectador, ritmo que se alcanza a leer, la matemática correcta y ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'recta-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  naturales: { concepts: ['naturales', 'enteros', 'opuesto', 'subconjunto', 'cero'], story: ['Ishango', 'Brahmagupta', '628', 'calendario'], notInEx: ['banco', 'hueso', 'deuda', 'calendario', 'saldo'] },
  racionales: { concepts: ['racionales', 'cociente', 'fracción', 'período', 'termina', 'se repite'], story: ['Pitágoras', 'Rhind', 'octava', 'quinta'], notInEx: ['cuerda', 'papiro', 'octava', 'panes', 'nota'] },
  reales: { concepts: ['irracional', 'reales', 'unión', 'intersección', 'recta real', 'punto medio'], story: ['A4', 'Hipaso', 'girasol', 'ángulo de oro'], notInEx: ['hoja', 'girasol', 'a4', 'papel'] },
  campo: { concepts: ['axioma', 'conmutativa', 'asociativa', 'neutro', 'opuesto', 'recíproco', 'distributiva', 'cerradura'], story: ['Euclides', 'Dedekind', 'zoom', 'mercado'], notInEx: ['zoom', 'foto', 'combo', 'mercado', 'euclides'] },
  consecuencias: { concepts: ['sumar el opuesto', 'recíproco', 'no está definido', 'teorema', 'signos', 'cancelativa'], story: ['Yorktown', '1997', 'película'], notInEx: ['barco', 'yorktown', 'película', 'recibo'] },
  orden: { concepts: ['tricotomía', 'menor o igual', 'conserva', 'voltea', 'valor absoluto', 'distancia'], story: ['Harriot', '1631', 'Weierstrass', '1841'], notInEx: ['temperatura', 'termómetro', 'fábrica', 'pieza', 'velocidad'] },
};
const LESSON_OF = { naturales: 'alg-11', racionales: 'alg-11b', reales: 'alg-11c', campo: 'alg-12b', consecuencias: 'alg-12c', orden: 'alg-12d' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/recta-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · LA RECTA REAL');
    assert.ok(D.DUR >= 240 && D.DUR <= 300, String(D.DUR));
    assert.strictEqual(D.SCENES.length, 10);
    D.SC.forEach((s, i) => assert.strictEqual(s.t0, i ? D.SC[i - 1].t1 : 0));
    for (const s of D.SCENES) assert.ok(film.includes(`\n  ${s.id}(t) {`), `falta la escena ${s.id}`);
    assert.doesNotMatch(film, /Date\.now|performance\.now|Math\.random\(/);
  });
  test(`${name}: rótulos y narración caben, no se montan y se alcanzan a leer; sin preguntas`, () => {
    for (const s of D.SCENES) {
      assert.ok(s.name && s.formula.length && s.caps.length && s.narr.length, s.id);
      s.caps.forEach(([a, b, title, sub], i) => {
        assert.ok(a >= 0.5 && b <= s.dur - 0.4 && b - a >= 5, `${s.id}: «${title}»`);
        assert.ok(title.length <= 36 && sub.length <= 58, `${s.id}: ${title} / ${sub}`);
        if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3, `${s.id}: ${title}`);
      });
      for (const [a, b, txt] of s.narr) { assert.ok(txt.split(/\s+/).length / (b - a) <= 3.4, `${s.id}: ${txt.slice(0, 40)}`); assert.ok(b <= s.dur, s.id); }
    }
    assert.ok(!/[¿?]/.test(all.replace(/= \?/g, '')), 'sin preguntas al espectador (el «= ?» de una cuenta sin respuesta no cuenta)');
  });
  test(`${name}: conceptos de la lección y una historia o analogía real`, () => {
    for (const w of V.concepts) assert.ok(all.toLowerCase().includes(w.toLowerCase()), w);
    for (const w of V.story) assert.ok(all.includes(w), w);
  });
  test(`${name}: la situación del video no sale en los ejercicios`, () => {
    const ex = JSON.stringify(LESSONS.find(l => l.id === LESSON_OF[name]).ex).toLowerCase();
    for (const w of V.notInEx) assert.ok(!word(ex, w), w);
  });
}

test('el motor: kit.js con el mundo en el HUD, recta.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\| 'ÁLGEBRA · TEORÍA DE CONJUNTOS'/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="recta\.js"><\/script>/);
  assert.match(read('index.html'), /load\('films\/' \+ FILM \+ '\.data\.js'\)\.then\(\(\) => load\('films\/' \+ FILM \+ '\.js'\)\)/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-naturales racionales reales campo consecuencias orden\}/);
  assert.match(read('mix.py'), /FILM = sys\.argv\[1\]/);
  for (const w of ['Ishango', 'Brahmagupta', 'Rhind', 'ISO 216', 'Hipaso', 'Dedekind', 'Yorktown', 'Harriot', 'Weierstrass']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const R = require('../video/recta-cosmos/films/racionales.data.js');
  assert.strictEqual(R.longDiv(1, 7, 12).digits.join(''), '142857142857');
  assert.strictEqual(R.longDiv(1, 7, 7).rests.join(), '1,3,2,6,4,5,1', 'los residuos recorren 1 a 6 y vuelven');
  assert.strictEqual(R.longDiv(5, 16, 4).digits.join(''), '3125');
  assert.strictEqual(R.longDiv(7, 10, 1).digits.join(''), '7');
  assert.ok(Math.abs(81 / 99 - 9 / 11) < 1e-12 && Math.abs(81 / 99 - 0.818181818) < 1e-8);
  assert.ok(Math.abs(440 * 3 / 2 - 660) < 1e-9);
  const Re = require('../video/recta-cosmos/films/reales.data.js');
  assert.ok(Math.abs(Re.A4[1] / Re.A4[0] - Math.SQRT2) < .002, 'A4: 297/210 ≈ √2');
  assert.ok(Math.abs(Re.GOLDEN - 360 * (1 - 2 / (1 + Math.sqrt(5)))) < 1e-9, 'ángulo de oro');
  assert.ok(1.4 ** 2 < 2 && 2 < 1.5 ** 2 && 1.4142 ** 2 < 2 && 2 < 1.4143 ** 2);
  assert.strictEqual(3 - 8, -5); assert.strictEqual(-5 + 5, 0); assert.strictEqual(-(-8), 8);
  assert.strictEqual(17 + (25 + 75), 117); assert.strictEqual(3 * (12 + 4), 3 * 12 + 3 * 4);
  assert.ok(3 < 7 && -3 > -7 && -12 < -3 && -12 + 5 < -3 + 5);
  for (const v of [50.05, 49.9, 50.15, 50.0]) assert.ok(Math.abs(v - 50) <= .2 + 1e-9);
  for (const v of [50.3, 49.7]) assert.ok(Math.abs(v - 50) > .2);
});
