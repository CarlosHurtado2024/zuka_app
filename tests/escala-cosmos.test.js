// Videos del mundo «Escalas y Proporciones» (video/escala-cosmos: alg-12 a alg-13d) en estilo «showreel matemático», pedidos
// por el usuario el 2026-11-17 con el enfoque de los de La Recta Real: historia real o analogía en cada uno, entre 4 y 5
// minutos, conceptos de la lección, sin preguntas al espectador, ritmo que se alcanza a leer, la matemática correcta y
// ejemplos que no salen en los ejercicios.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..'), dir = path.join(root, 'video', 'escala-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons));
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const FILMS = {
  razones: { concepts: ['razón', 'restando', 'dividiendo', 'a es a b', 'equivalentes', 'parte a parte', 'parte al todo', 'escala', 'rapidez'], story: ['Leonardo', 'Vitruvio', '1490', 'Bolt'], notInEx: ['concreto', 'cemento', 'pantalla', 'tren', 'vagón', 'leonardo', 'bolt', 'plántula'] },
  proporciones: { concepts: ['proporción', 'extremos', 'medios', 'propiedad fundamental', 'directamente proporcionales', 'inversamente proporcionales', 'recta', 'origen', 'reparto proporcional'], story: ['Eratóstenes', 'Siena', 'estadios', 'Boyle', '1662'], notInEx: ['eratóstenes', 'pozo', 'estadios', 'trueno', 'boleta', 'boyle', 'mercurio'] },
  reglatres: { concepts: ['regla de tres', 'directa', 'inversa', 'compuesta', 'reducir a la unidad', 'producto', 'cociente', 'magnitud', 'volteada'], story: ['Aryabhata', '499', 'regla de oro', 'expedición'], notInEx: ['café', 'cucharadas', 'expedición', 'víveres', 'impresoras', 'raciones', 'aryabhata'] },
  porcentajes: { concepts: ['por ciento', 'de cada cien', 'denominador cien', 'parte', 'todo', 'porcentaje', 'pasar de cien', 'menores que uno'], story: ['Augusto', 'centésima', 'per cento', 'nitrógeno'], notInEx: ['augusto', 'impuesto', 'aire', 'oxígeno', 'nitrógeno', 'habitación'] },
  aumentos: { concepts: ['factor', 'aumentar', 'descontar', 'distributiva', 'divid', 'valor de antes', 'cambio'], story: ['propina', '2018', '10 %', 'cine'], notInEx: ['propina', 'restaurante', 'cena', 'cine', 'entrada'] },
  sucesivos: { concepts: ['se multiplican', 'no se suman', 'orden', 'subir y bajar', 'potencia', 'factor'], story: ['Moore', '1965', '4004', '1971'], notInEx: ['abrigo', 'acción', 'bolsa', 'transistores', 'chip', 'moore'] },
};
const LESSON_OF = { razones: 'alg-12', proporciones: 'alg-12e', reglatres: 'alg-12f', porcentajes: 'alg-13', aumentos: 'alg-13c', sucesivos: 'alg-13d' };

for (const [name, V] of Object.entries(FILMS)) {
  const D = require(`../video/escala-cosmos/films/${name}.data.js`), film = read(`films/${name}.js`);
  const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${name}: lección ${LESSON_OF[name]}, entre 4 y 5 minutos, diez escenas seguidas y dibujadas`, () => {
    assert.strictEqual(D.LESSON, LESSON_OF[name]);
    assert.strictEqual(D.WORLD, 'ÁLGEBRA · ESCALAS Y PROPORCIONES');
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

test('el motor: kit.js con el mundo en el HUD, escala.js, carga por película, 1080×1920 a 60 fps', () => {
  assert.match(read('kit.js'), /T\(D\.WORLD \|\|/);
  assert.match(read('escala.js'), /T\('ZUKA · ' \+ D\.WORLD/);
  assert.match(read('index.html'), /<script src="kit\.js"><\/script>\n<script src="escala\.js"><\/script>/);
  assert.match(read('index.html'), /load\('films\/' \+ FILM \+ '\.data\.js'\)\.then\(\(\) => load\('films\/' \+ FILM \+ '\.js'\)\)/);
  const b = read('build.sh');
  assert.match(b, /FPS=\$\{FPS:-60\}/); assert.match(b, /SIZE=1080x1920/);
  assert.match(b, /FILMS=\$\{\*:-razones proporciones reglatres porcentajes aumentos sucesivos\}/);
  assert.match(read('mix.py'), /FILM = sys\.argv\[1\]/);
  for (const w of ['Vitruvio', 'Bolt', 'Eratóstenes', 'Boyle', 'Aryabhata', 'regla de oro', 'Augusto', 'per cento', 'propina', 'Moore', '4004']) assert.ok(read('FACTS.md').includes(w), `FACTS.md: ${w}`);
});

test('la matemática de los ejemplos', () => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
  // razones
  assert.ok(near(1920 / 1080, 16 / 9) && 16 * 120 === 1920 && 9 * 120 === 1080);
  assert.ok(near(20 / 13, 1.538, 1e-3) && near(16 / 9, 1.778, 1e-3) && near(32 / 18, 16 / 9));
  assert.ok(4 / 2 === 2 && near(202 / 200, 1.01));
  assert.ok(1 + 2 + 4 === 7 && 21 / 7 === 3 && 21 * 2 / 7 === 6 && 21 * 4 / 7 === 12);
  assert.ok(near(100 / 9.58, 10.44, .01) && near(23 * 87, 2001));
  // proporciones
  assert.ok(near(7.2 / 360, 1 / 50) && near(360 * 5000 / 7.2, 250000) && near(250000 * .157, 39250));
  assert.ok(near(3 / 4, 6 / 8) && near(3 / 4, .75));
  assert.ok(near(3 * 343, 1029));
  assert.ok(1e6 / 10 * 2 === 2e5 && 1e6 / 10 * 3 === 3e5 && 1e6 / 10 * 5 === 5e5);
  // regla de tres
  assert.ok(near(3 / 2 * 8, 12) && 12 * 30 === 360 && 360 / 18 === 20 && near(30 * 18 / 12, 45));
  assert.ok(near(1200 * 6 / 4 * 3 / 5, 1080) && near(30 * 12 / 18 * 3 / 2, 30) && 12 * 3 * 30 === 18 * 2 * 30);
  // porcentajes
  assert.ok(78 + 21 + 1 === 100 && near(500 * .21, 105) && near(20000 * .21, 4200) && near(390 / 500 * 100, 78));
  assert.ok(near(42 / .6, 70) && near(5 / 2, 2.5) && near(20000 * .0004, 8));
  // aumentos
  assert.ok(near(120000 * .75, 90000) && near(1e5 * 1.1, 110000) && near(110000 * .9, 99000) && near(110000 / 1.1, 1e5));
  assert.ok(near(3000 / 12000, .25) && near(3000 / 15000, .2));
  // sucesivos
  assert.ok(near(.6 * .75, .45) && near(200000 * .6, 120000) && near(120000 * .75, 90000) && near(200000 * .75 * .6, 90000));
  assert.ok(near(.5 * 1.5, .75) && near(1.3 * .7, .91) && 2 ** 5 === 32 && near(2 ** 25 / 1e6, 33.55, .01));
  assert.ok(near(2300 * 2 ** 25 / 1e9, 77.2, .1) && near(1.07 ** 10, 1.967, .001));
});
