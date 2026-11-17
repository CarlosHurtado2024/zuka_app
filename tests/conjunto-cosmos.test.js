// Video «El día que Plutón cambió de conjunto» (video/conjunto-cosmos, lección alg-0a; estilo «showreel matemático»,
// pedido del usuario el 2026-11-27): entre 4 y 5 minutos, cada concepto de la lección, una historia que abre y cierra,
// ejemplos de la naturaleza que no salen en los ejercicios, sin preguntas al espectador y con ritmo que se alcanza a leer.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const dir = path.join(__dirname, '..', 'video', 'conjunto-cosmos');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const D = require('../video/conjunto-cosmos/data.js'), film = read('film.js');
const all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');

test('dura entre cuatro y cinco minutos y las escenas van seguidas', () => {
  assert.ok(D.DUR >= 240 && D.DUR <= 300, String(D.DUR));
  D.SC.forEach((s, i) => assert.strictEqual(s.t0, i ? D.SC[i - 1].t1 : 0));
  assert.strictEqual(D.SCENES.length, 10);
});

test('cada escena tiene nombre, fórmula para el HUD, rótulos y narración, y film.js la dibuja', () => {
  for (const s of D.SCENES) {
    assert.ok(s.name && s.formula.length && s.caps.length && s.narr.length, s.id);
    assert.ok(film.replace(/\r\n/g, '\n').includes(`\n  ${s.id}(t) {`), `falta la escena ${s.id}`);
    s.caps.forEach(([a, b, title, sub], i) => {
      assert.ok(a >= 0.5 && b <= s.dur - 0.4 && b - a >= 5, `${s.id}: «${title}» dura ${(b - a).toFixed(1)} s`);
      assert.ok(title.length <= 36 && sub.length <= 58, `${s.id}: ${title} / ${sub}`);
      if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3, `${s.id}: ${title} se monta con el anterior`);
    });
  }
});

test('la narración se alcanza a leer (hasta 3.4 palabras por segundo) y no hay preguntas al espectador', () => {
  for (const s of D.SCENES) for (const [a, b, txt] of s.narr) {
    assert.ok(txt.split(/\s+/).length / (b - a) <= 3.4, `${s.id}: ${txt.slice(0, 40)}`);
    assert.ok(b <= s.dur, s.id);
  }
  assert.ok(!/[¿?]/.test(all), 'sin preguntas');
});

test('están todos los conceptos de la lección', () => {
  for (const w of ['colección bien definida', 'elemento', 'mayúscula', 'pertenece', 'no pertenece', 'Por extensión', 'Por comprensión', 'tal que', 'repetidos', 'orden', 'cardinal', 'llaves'])
    assert.ok(all.toLowerCase().includes(w.toLowerCase()), w);
  assert.match(film, /∈/); assert.match(film, /∉/); assert.match(film, /≠/);
});

test('la historia abre y cierra con Plutón, y trae naturaleza e historia', () => {
  assert.match(D.SCENES[0].narr[0][2], /Praga, 24 de agosto de 2006/);
  assert.match(D.SCENES.at(-1).narr[0][2], /Plutón no desapareció/);
  for (const w of ['Eris', 'Peano', '1889', 'Vía Láctea', 'ADN']) assert.ok(all.includes(w), w);
  assert.strictEqual(D.PLANETS.length, 9); assert.strictEqual(D.DWARFS.length, 5);
  const facts = read('FACTS.md');
  for (const w of ['Resolución B5', '424', 'Peano', 'Eris', 'Vía Láctea']) assert.ok(facts.includes(w), `FACTS.md: ${w}`);
});

test('los ejemplos del video no salen en los ejercicios de la lección', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
  const L = get(loadScripts(files), 'COURSES')[0].units[0].lessons.find(l => l.id === 'alg-0a'), ex = JSON.stringify(L.ex).toLowerCase();
  for (const w of ['plutón', 'planeta', 'marte', 'adn', 'estrella', 'eris']) assert.ok(!new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(ex), w);
});

test('la lección alg-0a usa este video desde Bunny (corte con audio) y su respaldo trae los ejemplos del video', () => {
  const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js']);
  const l = get(ctx, 'COURSE_ALGEBRA').units.flatMap(u => u.lessons).find(x => x.id === 'alg-0a');
  assert.strictEqual(l.clip.bunny, '70757aa9-4d65-4414-963e-12045eb3675f');
  assert.strictEqual(l.clip.duration, 212.5);
  assert.ok(!l.more || !l.more.length, 'un solo video');
  assert.strictEqual(get(ctx, "bunnyHost('70757aa9-4d65-4414-963e-12045eb3675f')"), 'vz-1a76d229-c83.b-cdn.net');
  const s = JSON.stringify(l.clip.scenes);
  for (const w of ['planeta', 'Plutón', 'Marte', 'Tierra', 'n(P) = 8', '\\\\in', '\\\\notin', 'extensión', 'comprensión', 'cardinal'])
    assert.ok(s.includes(w), `respaldo sin ${w}`);
  assert.ok(!/salsa|vocal/.test(s), 'ya no quedan los ejemplos del video anterior');
  assert.ok(!/[¿?]/.test(l.clip.scenes.map(x => x.text).join(' ')), 'sin preguntas al espectador');
});

test('estilo: cada cuadro es función de t, varios colores neón, letra de libro y HUD con reloj y avance', () => {
  assert.doesNotMatch(film, /Date\.now|performance\.now|Math\.random\(/, 'nada depende del reloj ni del azar sin semilla');
  for (const c of ['cyan', 'mag', 'amber', 'violet', 'green']) assert.match(film, new RegExp(`${c}: '#[0-9a-f]{6}'`));
  assert.match(film, /KMath/); assert.match(film, /Consolas/);
  assert.match(film, /'t = ' \+ t\.toFixed\(2\)/); assert.match(film, /' \/ ' \+ String\(D\.SC\.length\)/);
  assert.match(read('build.sh'), /FPS=\$\{FPS:-60\}/); assert.match(read('build.sh'), /SIZE=1080x1920/);
  assert.doesNotMatch(read('mix.py'), /sampler|\.wav'\)\s*#\s*muestra/, 'el sonido se sintetiza, sin muestras');
});
