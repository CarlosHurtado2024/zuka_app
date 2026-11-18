// Videos del mundo «Fracciones Algebraicas» (video/fraccion-cosmos: alg-25a, alg-25b, alg-101, alg-102) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de los mundos anteriores: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'fraccion-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  dominio: { concepts: ['expresión racional', 'dominio', 'denominador', 'asíntota', 'factoriza', 'solo se cancelan factores', 'hueco'], story: ['Bhaskara', '1150', 'alquiler'], notInEx: ['bhaskara', 'alquiler'] },
  operaciones: { concepts: ['denominador común', 'inversa', 'voltea', 'numerador por numerador', 'fracción dentro de otra'], story: ['Ohm', '1827', 'resistencia'], notInEx: ['ohm', 'ohmios', 'resistencia', 'resistencias', 'circuito'] },
  sistemas: { concepts: ['sistema', 'cruce', 'sustitución', 'reducción', 'igualación', 'paralelas', 'infinitas', 'escalera'], story: ['Los nueve capítulos', 'grano', 'monedas', 'Gauss'], notInEx: ['grano', 'monedas', 'chinos', 'capítulos'] },
  parciales: { concepts: ['sistema', 'fracciones parciales', 'factor lineal', 'numerador', 'propia', 'cuadrático', 'se repite'], story: ['Leibniz', 'Bernoulli', '1702'], notInEx: ['leibniz', 'bernoulli', 'derrumba'] },
};
const LESSON_OF = { dominio: 'alg-25a', operaciones: 'alg-25b', sistemas: 'alg-101', parciales: 'alg-102' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/fraccion-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · FRACCIONES ALGEBRAICAS');
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

test('el motor: kit.js con el mundo en el HUD, fraccion.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('fraccion.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="fraccion\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-dominio operaciones sistemas parciales\}/);
  for (const w of ['Bhaskara', 'Ohm', 'nueve capítulos', 'Leibniz', 'Bernoulli']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
  for (const x of [-2.5, 0.5, 3, 7]) {
    assert.ok(near((x * x - 4) / (x * x - x - 2), (x + 2) / (x + 1)));
    assert.ok(near(1 / x + 1 / (x + 2), (2 * x + 2) / (x * (x + 2))));
    assert.ok(near((x + 7) / ((x - 1) * (x + 3)), 2 / (x - 1) - 1 / (x + 3)));
  }
  assert.ok(near(4 / 3, (2 + 2) / (2 + 1)) && near((1.99 + 2) / (1.99 + 1), 1.334, .001) && near((2.01 + 2) / (2.01 + 1), 1.332, .001));
  assert.ok(near(1 / (1 / 4 + 1 / 12), 3) && near(4 * 12 / 16, 3) && near(4 * 6 / 10, 2.4) && near(1 / (1 / 4 + 1 / 12 + 1 / 6), 2) && near((2 * 3 / 5) / (3 / 10), 4));
  assert.ok(7 + 5 === 12 && 200 * 7 + 500 * 5 === 3900);
  const [x, y, z] = [9.25, 4.25, 2.75]; assert.ok(near(3 * x + 2 * y + z, 39) && near(2 * x + 3 * y + z, 34) && near(x + 2 * y + 3 * z, 26));
  assert.ok(2 * 2 === 2 + 2 && (-1) ** 2 === -1 + 2);
  let s = 0; for (let k = 1; k <= 99; k++) s += 1 / (k * (k + 1)); assert.ok(near(s, 99 / 100));
});
