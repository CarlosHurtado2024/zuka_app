// Videos del mundo «Sucesiones y Series» (video/sigma-cosmos: alg-14 a alg-15) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de los mundos anteriores: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'sigma-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  sucesiones: { concepts: ['sucesión', 'puesto', 'progresión aritmética', 'diferencia', 'n menos uno', 'término general', 'medios aritméticos'], story: ['Julio César', 'bisiesto', 'Gregorio', '1582'], notInEx: ['bisiesto', 'bisiestos', 'calendario', 'vela', 'dedos', 'césar'] },
  sumaarit: { concepts: ['emparejar', 'promedio', 'triangulares', 'impares', 'cuadrado', 'términos'], story: ['campanadas', 'reloj', 'bolos', 'troncos'], notInEx: ['campanadas', 'reloj', 'bolos', 'troncos', 'boliche'] },
  geometricas: { concepts: ['geométrica', 'razón', 'potencia', 'medios geométricos', 'media geométrica', 'negativa'], story: ['piano', 'Zhu Zaiyu', '1584', 'Stevin'], notInEx: ['piano', 'nota', 'notas', 'octava', 'semitono', 'zhu'] },
  sumageo: { concepts: ['multiplicar la suma', 'se cancela', 'suma infinita', 'diverge', 'entre menos uno y uno'], story: ['pastilla', 'miligramos', 'Arquímedes', 'parábola'], notInEx: ['pastilla', 'medicamento', 'miligramos', 'arquímedes', 'parábola'] },
  sumatoria: { concepts: ['índice', 'límites', 'término general', 'lineal', 'productoria', 'factorial', 'ordenar'], story: ['Euler', '1755', 'Kramp', 'baraja'], notInEx: ['euler', 'kramp', 'baraja', 'cartas'] },
};
const LESSON_OF = { sucesiones: 'alg-14', sumaarit: 'alg-14b', geometricas: 'alg-14c', sumageo: 'alg-14d', sumatoria: 'alg-15' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/sigma-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · SUCESIONES Y SERIES');
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

test('el motor: kit.js con el mundo en el HUD, sigma.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('sigma.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="sigma\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-sucesiones sumaarit geometricas sumageo sumatoria\}/);
  for (const w of ['Julio César', 'campanadas', 'Zhu Zaiyu', 'pastilla', 'Euler', 'Kramp']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e, fact = n => n ? n * fact(n - 1) : 1;
  // sucesiones
  assert.ok(2024 + 19 * 4 === 2100 && 2100 % 400 !== 0 && (43 - 19) / 6 === 4 && 19 - 3 * 4 === 7 && (20 - 2) / 6 === 3 && 30 - 2 * 15 === 0);
  // suma aritmética
  assert.ok(12 * 13 / 2 === 78 && 2 * 78 === 156 && 1 + 2 + 3 + 4 === 10 && 16 * 25 / 2 === 200 && 20 - 5 + 1 === 16);
  assert.ok(1000 * 1001 / 2 === 500500 && (52 - 7) / 3 + 1 === 16 && 16 * 59 / 2 === 472 && 1 + 3 + 5 + 7 === 16);
  // geométricas
  assert.ok(55 * 2 ** 6 === 3520 && 2 ** 20 === 1048576 && near(2 ** (1 / 12), 1.0595, 1e-4) && near(Math.sqrt(220 * 440), 311.1, .1) && near(220 * 2 ** .5, Math.sqrt(220 * 440)));
  // suma geométrica
  assert.ok(3 + 6 + 12 + 24 + 48 === 93 && 96 - 3 === 93 && near(100 / (1 - .5), 200) && near(.5 ** 10, 1 / 1024) && near((9 / 10) / (1 - 1 / 10), 1));
  assert.ok(near(1 / (1 - 1 / 4), 4 / 3) && 100 + 50 + 25 + 12.5 === 187.5);
  // sumatoria
  assert.ok(3 + 5 + 7 + 9 + 11 === 35 && 30 + 40 + 50 + 60 === 180 && 10 * 11 * 21 / 6 === 385 && 2 * 3 * 4 * 5 === 120 && fact(10) === 3628800 && fact(3) === 6);
  let d = 1; for (let k = 2; k <= 52; k++) d *= k; assert.ok(d > 8e67 && d < 8.1e67);
});
