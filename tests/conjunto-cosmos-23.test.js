// Videos «Donar es ser subconjunto» (alg-0b, video/conjunto-cosmos-2) y «Tres luces, ocho colores» (alg-0c,
// video/conjunto-cosmos-3): estilo «showreel matemático» con el motor común kit.js. Entre 4 y 5 minutos, todos los
// conceptos de su lección, una historia real que abre y cierra, sin preguntas al espectador y con la matemática correcta.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('./load');
const root = path.join(__dirname, '..');
const read = (d, f) => fs.readFileSync(path.join(root, 'video', d, f), 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const LESSONS = get(loadScripts(files), 'COURSES')[0].units[0].lessons;
const word = (txt, w) => new RegExp(`(^|[^a-záéíóúñ])${w}([^a-záéíóúñ]|$)`).test(txt);

const VIDEOS = [
  { dir: 'conjunto-cosmos-2', lesson: 'alg-0b', D: require('../video/conjunto-cosmos-2/data.js'),
    concepts: ['conjunto vacío', 'unitario', 'subconjunto', 'iguales', 'disjuntos', 'conjunto de partes', 'dos a la n'],
    story: ['Landsteiner', '1901', 'Viena', 'Nobel', '1930', 'Rh', 'O negativo'], notInEx: ['sangre', 'glóbulo', 'donante', 'transfusión'],
    open: /lotería/, close: /lotería/, facts: ['Landsteiner', '1901', 'Decastello', 'Nobel', 'Modelo simplificado'] },
  { dir: 'conjunto-cosmos-3', lesson: 'alg-0c', D: require('../video/conjunto-cosmos-3/data.js'),
    concepts: ['universo', 'diagrama de Venn', 'unión', 'intersección', 'diferencia', 'complemento', 'diferencia simétrica', 'se resta la intersección'],
    story: ['Maxwell', '1861', 'Londres', 'píxel', 'amarillo', 'tres tipos'], notInEx: ['luz', 'píxel', 'pantalla', 'amarillo', 'cian', 'magenta'],
    open: /pantalla/, close: /pantalla/, facts: ['Maxwell', '1861', 'Sutton', 'tartán', 'conos'] },
];

for (const V of VIDEOS) {
  const { D } = V, film = read(V.dir, 'film.js'), all = [...D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]), D.LINE].join(' ');
  test(`${V.dir}: dura entre cuatro y cinco minutos, diez escenas seguidas, cada una dibujada`, () => {
    assert.ok(D.DUR >= 240 && D.DUR <= 300, String(D.DUR));
    assert.strictEqual(D.SCENES.length, 10);
    D.SC.forEach((s, i) => assert.strictEqual(s.t0, i ? D.SC[i - 1].t1 : 0));
    for (const s of D.SCENES) assert.ok(film.includes(`\n  ${s.id}(t) {`), `falta la escena ${s.id}`);
  });
  test(`${V.dir}: rótulos y narración caben, no se montan y se alcanzan a leer; sin preguntas`, () => {
    for (const s of D.SCENES) {
      assert.ok(s.name && s.formula.length && s.caps.length && s.narr.length, s.id);
      s.caps.forEach(([a, b, title, sub], i) => {
        assert.ok(a >= 0.5 && b <= s.dur - 0.4 && b - a >= 5, `${s.id}: «${title}»`);
        assert.ok(title.length <= 36 && sub.length <= 58, `${s.id}: ${title} / ${sub}`);
        if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3, `${s.id}: ${title}`);
      });
      for (const [a, b, txt] of s.narr) { assert.ok(txt.split(/\s+/).length / (b - a) <= 3.4, `${s.id}: ${txt.slice(0, 40)}`); assert.ok(b <= s.dur, s.id); }
    }
    assert.ok(!/[¿?]/.test(all), 'sin preguntas');
  });
  test(`${V.dir}: están los conceptos de ${V.lesson} y la historia real abre y cierra`, () => {
    for (const w of V.concepts) assert.ok(all.toLowerCase().includes(w.toLowerCase()), w);
    for (const w of V.story) assert.ok(all.includes(w), w);
    assert.match(D.SCENES[0].narr.map(n => n[2]).join(' '), V.open); assert.match(D.SCENES.at(-1).narr.map(n => n[2]).join(' '), V.close);
    const facts = read(V.dir, 'FACTS.md'); for (const w of V.facts) assert.ok(facts.includes(w), `FACTS.md: ${w}`);
  });
  test(`${V.dir}: la situación del video no sale en los ejercicios de ${V.lesson}`, () => {
    const ex = JSON.stringify(LESSONS.find(l => l.id === V.lesson).ex).toLowerCase();
    for (const w of V.notInEx) assert.ok(!word(ex, w), w);
  });
  test(`${V.dir}: usa el motor común, 1080×1920 a 60 fps, sonido sintetizado`, () => {
    assert.strictEqual(read(V.dir, 'kit.js').split('\n').slice(5).join('\n'), read('conjunto-cosmos-2', 'kit.js').split('\n').slice(5).join('\n'), 'kit.js igual en las dos carpetas');
    assert.match(read(V.dir, 'index.html'), /<script src="kit\.js"><\/script>\n<script src="film\.js"><\/script>/);
    assert.doesNotMatch(film + read(V.dir, 'kit.js'), /Date\.now|performance\.now|Math\.random\(/);
    assert.match(read(V.dir, 'build.sh'), /FPS=\$\{FPS:-60\}/); assert.match(read(V.dir, 'build.sh'), /SIZE=1080x1920/);
    assert.match(read(V.dir, 'build.sh'), new RegExp(`NAME=${V.dir}\n`)); assert.match(read(V.dir, 'mix.py'), new RegExp(`${V.dir}\.srt`));
  });
}

test('sangre: ocho tipos, donar es ser subconjunto, O− dona a todos y AB+ recibe de todos', () => {
  const D = VIDEOS[0].D, all = [0, 1, 2, 3, 4, 5, 6, 7];
  assert.strictEqual(all.map(D.typeName).join(), 'O−,A−,B−,AB−,O+,A+,B+,AB+');
  assert.strictEqual(D.setOf(5).join(), 'A,Rh'); assert.strictEqual(D.setOf(0).length, 0);
  assert.ok(all.every(r => D.canGive(0, r)), 'el vacío es subconjunto de todos');
  assert.ok(all.every(d => D.canGive(d, 7)), 'todo conjunto es subconjunto del total');
  assert.ok(D.canGive(1, 5) && !D.canGive(3, 1), 'los dos ejemplos de la escena');
  assert.ok(!D.canGive(1, 2) && !D.canGive(2, 1), '{A} y {B}: ninguno le dona al otro');
  for (const a of all) for (const b of all) assert.strictEqual(D.canGive(a, b) && D.canGive(b, a), a === b, 'subconjunto en los dos sentidos = iguales');
});

test('luces: las operaciones del video dan los conjuntos que el video muestra', () => {
  const D = VIDEOS[1].D, names = pred => [0, 1, 2, 3, 4, 5, 6, 7].filter(pred).map(m => D.COLORS[m][0]).sort().join();
  assert.strictEqual(D.COLORS.length, 8);
  assert.strictEqual(D.R.map(m => D.COLORS[m][0]).sort().join(), 'amarillo,blanco,magenta,rojo');
  assert.strictEqual(D.G.map(m => D.COLORS[m][0]).sort().join(), 'amarillo,blanco,cian,verde');
  assert.strictEqual(names(D.OPS.union), 'amarillo,blanco,cian,magenta,rojo,verde');
  assert.strictEqual(names(D.OPS.inter), 'amarillo,blanco');
  assert.strictEqual(names(D.OPS.dif), 'magenta,rojo'); assert.strictEqual(names(D.OPS.difGR), 'cian,verde');
  assert.strictEqual(names(D.OPS.comp), 'azul,cian,negro,verde');
  assert.strictEqual(names(D.OPS.sim), 'cian,magenta,rojo,verde');
  const n = pred => [0, 1, 2, 3, 4, 5, 6, 7].filter(pred).length;
  assert.strictEqual(n(D.OPS.union), D.R.length + D.G.length - n(D.OPS.inter));
  assert.strictEqual(D.COLORS[7][0], 'blanco'); assert.strictEqual(D.COLORS[3][0], 'amarillo');
});
