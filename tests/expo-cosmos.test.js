// Videos del mundo «Crecimiento Exponencial» (video/expo-cosmos: alg-71, alg-13b, alg-72, alg-73) en estilo «showreel matemático»,
// pedidos por el usuario el 2026-11-17 con el enfoque de los de los mundos anteriores: historia real o analogía en cada uno, entre
// 4 y 5 minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'expo-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  exponencial: { concepts: ['exponente', 'asíntota', 'dominio', 'rango', 'base', 'decrece', 'vida media', 'número e', 'misma base'], story: ['Libby', '1949', 'carbono 14', 'Bernoulli', '1683'], notInEx: ['libby', 'carbono', 'hueso', 'bernoulli'] },
  interes: { concepts: ['interés simple', 'interés compuesto', 'capital', 'línea recta', 'factor', 'mensual', 'valor presente', 'regla del 72'], story: ['Franklin', '1790', 'Boston', 'Filadelfia'], notInEx: ['franklin', 'testamento', 'libras', 'boston', '1.015'] },
  logaritmos: { concepts: ['logaritmo', 'exponente', 'reflejo', 'producto', 'cociente', 'potencia', 'suma no se parte', 'cambio de base'], story: ['Napier', '1614', 'Briggs', '1617', 'pH'], notInEx: ['napier', 'briggs', 'ph', 'limón'] },
  ecuaciones: { concepts: ['misma base', 'exponentes', 'logaritmo a los dos lados', 'logaritmo natural', 'dominio', 'comprobar'], story: ['Ötzi', '1991', 'carbono catorce'], notInEx: ['ötzi', 'hielo', 'población', 'triplicar'] },
};
const LESSON_OF = { exponencial: 'alg-71', interes: 'alg-13b', logaritmos: 'alg-72', ecuaciones: 'alg-73' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/expo-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · CRECIMIENTO EXPONENCIAL');
    assert.ok(D.DUR >= 240 && D.DUR <= 300, String(D.DUR));
    assert.strictEqual(D.SCENES.length, 10);
    D.SC.forEach((s, i) => assert.strictEqual(s.t0, i ? D.SC[i - 1].t1 : 0));
    for (const s of D.SCENES) assert.ok(film.includes(`\n  ${s.id}(t) {`), `falta la escena ${s.id}`);
    assert.doesNotMatch(film, /Date\.now|performance\.now|Math\.random\(/);
    assert.doesNotThrow(() => new (require('vm').Script)(film), 'la película compila');
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

test('el motor: kit.js con el mundo en el HUD, expo.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('expo.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="expo\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-exponencial interes logaritmos ecuaciones\}/);
  for (const w of ['Libby', 'Bernoulli', 'Franklin', 'Napier', 'Briggs', 'Ötzi']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
  // exponencial
  assert.ok(near(5730 * 3, 17190) && near(0.5 ** (17190 / 5730), 1 / 8));
  assert.ok(near((1 + 1 / 12) ** 12, 2.613, .001) && near((1 + 1 / 365) ** 365, 2.7146, .0001) && near(Math.E, 2.71828, 1e-5));
  // interés
  assert.ok(near(1e6 * 1.1 ** 10, 2593742, 1) && near(1e6 * 1.1, 1.1e6, 1e-6) && near(1.1e6 * 0.1, 110000, 1e-6));
  assert.ok(1e6 + 30 * 1e5 === 4e6 && 1e6 * 1.1 ** 30 > 17e6);
  assert.ok(near(Math.log(2) / Math.log(1.1), 7.27, .01) && near(1.1 ** 7, 1.95, .01) && near(1.1 ** 8, 2.14, .01));
  assert.ok(near(1.015 ** 12, 1.196, .001) && near(1000 * 1.05 ** 100, 131501, 1) && near(1e7 / 1.1 ** 10, 3855433, 1));
  // logaritmos
  assert.ok(near(Math.log2(32), 5) && near(Math.log10(1000), 3) && 8 * 32 === 256 && near(Math.log2(256), 3 + 5));
  assert.ok(!near(Math.log10(10 + 10), 2) && near(Math.log10(500), 2.7, .01) && near(Math.log(50) / Math.log(3), 3.56, .005));
  assert.ok(near(10 ** (7 - 2), 100000) && near(3 ** 3.56, 50, .1));
  // ecuaciones
  assert.ok(8 ** 2 === 4 ** 3 && near(Math.log(20) / Math.log(3), 2.727, .001));
  assert.ok(near(5730 * Math.log(0.53) / Math.log(0.5), 5250, 5) && near(Math.log(3) / Math.log(1.1), 11.53, .01));
  assert.ok(2 * (2 + 2) === 8 && -4 * (-4 + 2) === 8 && near(Math.log2(2) + Math.log2(4), 3));
  assert.ok(near(Math.log(2) / 0.05, 13.86, .01));
});
