// Videos del mundo «Raíces de Polinomios» (video/ceros-cosmos: alg-23b, alg-92, alg-93) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de los mundos anteriores: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'ceros-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  division: { concepts: ['dividendo', 'divisor', 'cociente', 'residuo', 'grado menor', 'factor', 'mismos coeficientes'], story: ['Tartaglia', '1535', 'semanas'], notInEx: ['tartaglia', 'venecia', 'semanas', 'duelo'] },
  residuo: { concepts: ['teorema del residuo', 'teorema del factor', 'división sintética', 'cociente', 'evaluar'], story: ['Horner', '1819', 'Ruffini', 'Qin Jiushao'], notInEx: ['horner', 'ruffini', 'computadores'] },
  ceros: { concepts: ['teorema fundamental', 'ceros', 'doble', 'rebota', 'cruza', 'candidatos', 'cambios de signo', 'conjugado'], story: ['Gauss', '1799', 'Descartes'], notInEx: ['gauss', 'tesis'] },
};
const LESSON_OF = { division: 'alg-23b', residuo: 'alg-92', ceros: 'alg-93' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/ceros-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · RAÍCES DE POLINOMIOS');
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

test('el motor: kit.js con el mundo en el HUD, ceros.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('ceros.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="ceros\.js"><\/script>/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-division residuo ceros\}/);
  for (const w of ['Tartaglia', 'Horner', 'Ruffini', 'Gauss', 'Descartes']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const P = (cs, x) => cs.reduce((a, c) => a * x + c, 0), near = (a, b, e = 1e-9) => Math.abs(a - b) <= e, eq = (a, b) => assert.ok(near(a, b), a + ' ≠ ' + b);
  assert.ok(7 * 14 + 2 === 100 && 98 / 7 === 14);
  for (const x of [-3, -1, 0, 1.5, 2, 4]) {
    eq((x + 1) * (x + 2) + 3, P([1, 3, 5], x));
    eq((x - 2) * (x * x + 4 * x + 3), P([1, 2, -5, -6], x)); eq((x - 2) * (x + 1) * (x + 3), P([1, 2, -5, -6], x));
    eq((x - 1) * (x * x - 5 * x + 6), P([1, -6, 11, -6], x));
    eq((x - 2) * (x * x - 2 * x - 3), P([1, -4, 1, 6], x)); eq((x + 1) * (x - 2) * (x - 3), P([1, -4, 1, 6], x));
    eq((x - 2) * (2 * x + 3) * (x + 1), P([2, 1, -7, -6], x)); eq((x - 1) ** 2 * (x + 2), P([1, 0, -3, 2], x));
    eq((x - 1) * (x * x + x + 1), P([1, 0, 0, -1], x));
  }
  assert.ok(P([1, -4, 1, 6], 1) === 4 && P([1, -4, 1, 6], 2) === 0 && P([1, -4, 1, 6], 3) === 0 && P([1, -4, 1, 6], -1) === 0 && P([1, -4, 1, 6], 0) === 6);
  assert.ok(((1 * 2 - 4) * 2 + 1) * 2 + 6 === 0 && P([2, 1, -7, -6], 2) === 0 && near(P([2, 1, -7, -6], -1.5), 0));
  const re = -.5, im = Math.sqrt(3) / 2; assert.ok(near(re * re - im * im + re + 1, 0) && near(2 * re * im + im, 0) && near(Math.hypot(re, im), 1));
});
