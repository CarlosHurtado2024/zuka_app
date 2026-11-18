// Videos del mundo «Álgebra de Polinomios» (video/polinomio-cosmos: alg-23a, alg-3, alg-24c, alg-24b) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de los mundos anteriores: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'polinomio-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  polinomios: { concepts: ['polinomio', 'coeficiente', 'variable', 'grado', 'término independiente', 'semejantes', 'opuesto', 'los grados se suman', 'evaluar'], story: ['al-Juarismi', 'Bagdad', 'caja', 'cartón'], notInEx: ['cartón', 'caja', 'juarismi', 'bagdad', 'lámina'] },
  notables: { concepts: ['doble producto', 'al cuadrado', 'suma por diferencia', 'diferencia de cuadrados', 'término del medio'], story: ['Euclides', 'Elementos', 'proposición cuatro'], notInEx: ['euclides', 'elementos', 'sueño'] },
  binomio: { concepts: ['triángulo de pascal', 'coeficientes', 'exponentes', 'elegir', 'potencia de dos'], story: ['Galton', '1889', 'Yang Hui', 'Pascal', 'monedas'], notInEx: ['galton', 'clavos', 'monedas', 'bolitas', 'tablero'] },
  factorizacion: { concepts: ['factorizar', 'producto', 'factor común', 'diferencia de cuadrados', 'trinomio', 'cuadrado perfecto', 'completar el cuadrado', 'reales'], story: ['1977', 'RSA', 'Rivest', '2020'], notInEx: ['rsa', 'primos', 'cifrar', 'mensajes'] },
};
const LESSON_OF = { polinomios: 'alg-23a', notables: 'alg-3', binomio: 'alg-24c', factorizacion: 'alg-24b' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/polinomio-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · ÁLGEBRA DE POLINOMIOS');
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

test('el motor: kit.js con el mundo en el HUD, polinomio.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('polinomio.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="polinomio\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-polinomios notables binomio factorizacion\}/);
  for (const w of ['al-Juarismi', 'Euclides', 'Galton', 'Yang Hui', 'RSA']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const P = (cs, x) => cs.reduce((a, c) => a * x + c, 0), C = (n, k) => k ? C(n, k - 1) * (n - k + 1) / k : 1;
  for (const x of [-2, 0, 1, 3.5]) {
    assert.strictEqual(P([4, -1, 3], x) + P([1, 5, -7], x), P([5, 4, -4], x));
    assert.strictEqual(P([4, -1, 3], x) - P([1, 5, -7], x), P([3, -6, 10], x));
    assert.strictEqual((x + 3) * (2 * x + 1), P([2, 7, 3], x));
    assert.ok(Math.abs(x * (30 - 2 * x) * (20 - 2 * x) - P([4, -100, 600, 0], x)) < 1e-9);
    assert.strictEqual((x + 3) * (x + 7), P([1, 10, 21], x)); assert.strictEqual((x + 4) * (x - 9), P([1, -5, -36], x));
    assert.ok(Math.abs((x + 3) ** 3 - P([1, 9, 27, 27], x)) < 1e-9);
    assert.strictEqual(3 * x * (2 * x + 3), P([6, 9, 0], x)); assert.strictEqual((2 * x - 5) * (2 * x + 5), P([4, 0, -25], x));
    assert.strictEqual((x + 4) * (x - 3), P([1, 1, -12], x)); assert.strictEqual((x + 5) ** 2, P([1, 10, 25], x)); assert.strictEqual((x + 3) ** 2 + 4, P([1, 6, 13], x));
  }
  assert.ok(4 * 22 * 12 === 1056 && 8 * 14 * 4 === 448);
  assert.ok(51 ** 2 === 2601 && 49 ** 2 === 2401 && 31 * 29 === 899 && 102 ** 2 === 10404 && 98 * 102 === 9996 && (1 + 1) ** 2 === 4);
  assert.ok([0, 1, 2, 3, 4].map(k => C(4, k)).join() === '1,4,6,4,1' && C(4, 2) === 6 && [0, 1, 2, 3, 4, 5].map(k => C(5, k)).reduce((a, b) => a + b) === 32);
  assert.ok(61 * 53 === 3233);
});
