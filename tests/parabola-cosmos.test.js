// Videos del mundo «Parábolas y Complejos» (video/parabola-cosmos: alg-23c, alg-1, alg-4a, alg-4) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de los mundos anteriores: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'parabola-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  complejos: { concepts: ['unidad imaginaria', 'cuarto de vuelta', 'plano', 'parte real', 'conjugado', 'módulo'], story: ['Cardano', '1545', 'Bombelli', '1572'], notInEx: ['cardano', 'bombelli', 'circuitos'] },
  lineales: { concepts: ['ecuación', 'solución', 'a los dos lados', 'inversa', 'paréntesis', 'fracción', 'no tiene solución', 'cualquier número'], story: ['Ahmes', 'papiro', 'Diofanto', 'ochenta y cuatro'], notInEx: ['papiro', 'ahmes', 'diofanto', 'epitafio', 'ropa'] },
  parabola: { concepts: ['vértice', 'simétrica', 'forma canónica', 'abre hacia abajo', 'completando el cuadrado', 'menos b sobre dos a'], story: ['Galileo', '1638', 'corral', 'antenas'], notInEx: ['galileo', 'corral', 'cerca', 'antena', 'faros'] },
  cuadraticas: { concepts: ['raíces', 'factores', 'completó el cuadrado', 'fórmula', 'discriminante', 'complejos conjugados'], story: ['tablilla', 'Babilonia', 'corral'], notInEx: ['tablilla', 'babilonia', 'corral', 'escriba'] },
};
const LESSON_OF = { complejos: 'alg-23c', lineales: 'alg-1', parabola: 'alg-4a', cuadraticas: 'alg-4' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/parabola-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · PARÁBOLAS Y COMPLEJOS');
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
    assert.ok(!/[¿?]/.test(all), 'sin preguntas al espectador');
    assert.ok(!(film.match(/'[^'\n]*'/g) || []).some(x => /[¿?]/.test(x)), 'tampoco en lo que se dibuja');
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

test('el motor: kit.js con el mundo en el HUD, parabola.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('parabola.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="parabola\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-complejos lineales parabola cuadraticas\}/);
  for (const w of ['Cardano', 'Bombelli', 'Rhind', 'Diofanto', 'Galileo', 'BM 13901']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e, mul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
  // complejos
  assert.ok(near(5 + 5, 10) && near(25 + 15, 40)); assert.deepStrictEqual(mul([0, 1], [3, 2]), [-2, 3]); assert.deepStrictEqual(mul([1, 1], [1, 1]), [0, 2]);
  const z = mul([5, Math.sqrt(15)], [5, -Math.sqrt(15)]); assert.ok(near(z[0], 40) && near(z[1], 0));
  // lineales
  assert.ok(3 * 7 + 4 === 25 && 5 * 5 - 3 === 2 * 5 + 12 && 2 * (6 + 3) === 18 && near(133 / 8 + 133 / 56, 19));
  assert.ok(near(84 / 6 + 84 / 12 + 84 / 7 + 5 + 84 / 2 + 4, 84));
  // parábola
  const A = x => x * (20 - x); assert.ok(A(10) === 100 && A(4) === 64 && A(16) === 64 && -20 / (2 * -1) === 10);
  for (const x of [-1, 0, 3.5, 12]) assert.ok(near(A(x), -((x - 10) ** 2) + 100));
  // cuadráticas
  assert.ok(near(.5 ** 2 + .5, .75) && near((-1.5) ** 2 - 1.5, .75) && 3 * 3 - 3 - 6 === 0 && 4 + 2 - 6 === 0);
  assert.ok(A(8) === 96 && A(12) === 96 && 400 - 384 === 16 && (20 + 4) / 2 === 12 && (20 - 4) / 2 === 8 && 4 - 20 === -16);
  const r = mul([-1, 2], [-1, 2]); assert.ok(near(r[0] + 2 * -1 + 5, 0) && near(r[1] + 2 * 2, 0));
});
