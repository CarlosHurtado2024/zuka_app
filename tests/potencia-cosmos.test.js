// Videos del mundo «Exponentes y Radicales» (video/potencia-cosmos: alg-21a a alg-22b) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de La Recta Real y Escalas y Proporciones: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'potencia-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  potencias: { concepts: ['potencia', 'base', 'exponente', 'par', 'impar', 'paréntesis', 'a la cero', 'negativo', 'denominador'], story: ['Arquímedes', 'Siracusa', 'E. coli'], notInEx: ['arena', 'arquímedes', 'bacteria', 'bacterias', 'virus', 'micrómetros'] },
  leyes: { concepts: ['se suman', 'se restan', 'se multiplican', 'misma base', 'producto', 'no se reparte', 'notación científica'], story: ['Sol', 'ocho minutos', 'kilómetro cuadrado'], notInEx: ['sol', 'luz', 'kilómetros', 'rectángulos'] },
  raices: { concepts: ['raíz cuadrada', 'raíz cúbica', 'índice', 'positiv', 'exponente fracción', 'denominador', 'valor absoluto', 'no se reparte'], story: ['Kepler', '1619', 'Marte', 'Júpiter'], notInEx: ['kepler', 'marte', 'júpiter', 'planeta', 'arista'] },
  radicales: { concepts: ['simplificar', 'cuadrado', 'semejantes', 'racionalizar', 'uno disfrazado', 'conjugado', 'suma por diferencia'], story: ['Teodoro', 'Platón', 'espiral'], notInEx: ['teodoro', 'espiral', 'calculadoras', 'hipotenusa'] },
};
const LESSON_OF = { potencias: 'alg-21a', leyes: 'alg-21b', raices: 'alg-22a', radicales: 'alg-22b' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/potencia-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · EXPONENTES Y RADICALES');
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

test('el motor: kit.js con el mundo en el HUD, potencia.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('potencia.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="potencia\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-potencias leyes raices radicales\}/);
  for (const w of ['Arquímedes', 'E. coli', 'Sol', 'Kepler', 'Teodoro']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
  // potencias
  assert.ok(2 ** 12 === 4096 && 2 ** 10 === 1024 && 2 * 10 === 20 && (-2) ** 4 === 16 && -(2 ** 4) === -16);
  assert.ok(10 ** 0 === 1 && near(10 ** -2, .01) && near(2 ** -3, 1 / 8) && near(2e-6 / 1e-7, 20) && 4 * 60 / 20 === 12);
  // leyes
  assert.ok(10 ** 2 * 10 ** 3 === 10 ** 5 && 2 ** 3 * 3 ** 2 === 72 && near(1e8 / 1e5, 1e3) && near(1e2 / 1e5, 1e-3));
  assert.ok((1e3) ** 2 === 1e6 && (2 * 5) ** 3 === 2 ** 3 * 5 ** 3 && 8 * 125 === 1000);
  assert.ok((3 + 4) ** 2 === 49 && 3 ** 2 + 4 ** 2 === 25 && 9 + 16 + 12 + 12 === 49);
  assert.ok(near(1.5e8 / 3e5, 500) && 500 === 8 * 60 + 20);
  // raíces
  assert.ok(7 ** 2 === 49 && near(Math.sqrt(50), 7.07, .01) && 7 ** 3 === 343 && (-7) ** 3 === -343 && (-10) ** 3 === -1000);
  assert.ok(near(16 ** .75, 8) && 16 ** 3 === 4096 && near(1.88 ** (2 / 3), 1.52, .01) && near(11.86 ** (2 / 3), 5.20, .01));
  assert.ok(Math.sqrt((-5) ** 2) === 5 && Math.sqrt(9 + 16) === 5 && Math.sqrt(9) + Math.sqrt(16) === 7);
  // radicales
  assert.ok(near(Math.sqrt(8), 2 * Math.SQRT2) && near(Math.sqrt(12), 2 * Math.sqrt(3)) && near(Math.sqrt(50), 5 * Math.SQRT2));
  assert.ok(near(Math.SQRT2 + Math.sqrt(3), 3.15, .01) && near(Math.sqrt(5), 2.24, .01) && near(Math.sqrt(8) + Math.sqrt(18), 5 * Math.SQRT2));
  assert.ok(near(1 / Math.SQRT2, Math.SQRT2 / 2) && near(6 / Math.sqrt(3), 2 * Math.sqrt(3)) && near(1 / (Math.sqrt(3) - 1), (Math.sqrt(3) + 1) / 2));
});
