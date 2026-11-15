// Resúmenes en PDF de cada mundo (spec 2026-11-13-resumenes-pdf): fuente LaTeX en docs/resumenes/tex/<mundo>.tex,
// PDF en media/resumenes/<mundo>.pdf, y la vista del mundo enlaza el suyo al final del camino.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const idx = read('index.html');
const files = ['js/games/kit.js', 'js/games/arma-la-cuenta.js', 'js/games/escala-solucion.js',
  ...[...idx.matchAll(/src="(js\/(?:content|worlds|courses\/[^"]+|data)\.js)"/g)].map(m => m[1])];
const ctx = loadScripts(files);
const COURSES = get(ctx, 'COURSES'), summaryOf = get(ctx, 'summaryOf');
// Por ahora tienen resumen los cursos de Álgebra y Trigonometría (todos sus mundos).
const CON = ['algebra', 'trig'];
const units = COURSES.filter(c => CON.includes(c.id)).flatMap(c => (c.units || []).map((u, i) => ({ c, u, i })));

test('cada mundo de Álgebra y Trigonometría tiene su resumen, y los demás no muestran enlace', () => {
  assert.equal(units.length, 13);
  for (const c of COURSES.filter(c => !CON.includes(c.id))) for (const u of c.units || []) assert.equal(summaryOf(u), null, u.world);
  for (const { c, u } of units) assert.equal(summaryOf(u), `media/resumenes/${u.world}.pdf`, `${c.id}/${u.world}`);
});

test('cada resumen tiene su fuente LaTeX con la plantilla, su taller de 10 ejercicios y respuestas', () => {
  for (const { c, u, i } of units) {
    const f = `docs/resumenes/tex/${u.world}.tex`;
    assert.ok(fs.existsSync(path.join(ROOT, f)), `falta ${f}`);
    const s = read(f);
    assert.match(s, /\\usepackage\{zuka-resumen\}/, f);
    assert.match(s, new RegExp(`\\\\zukamundo\\{${i + 1}\\}`), `${f}: número de mundo`);
    const taller = s.slice(s.indexOf('\\taller'), s.indexOf('\\respuestas'));
    assert.ok(s.includes('\\taller') && s.includes('\\respuestas'), `${f}: taller y respuestas`);
    // Ejercicios de primer nivel: los \item que no están dentro de un ejercicios anidado.
    let depth = 0, n = 0;
    for (const m of taller.matchAll(/\\begin\{ejercicios\}|\\end\{ejercicios\}|\\item\b/g)) {
      if (m[0].startsWith('\\begin')) depth++; else if (m[0].startsWith('\\end')) depth--; else if (depth === 1) n++;
    }
    assert.equal(n, 10, `${f}: el taller debe tener 10 ejercicios`);
    u.lessons.forEach((_, k) => assert.ok(s.includes(`\\nivel{${i + 1}-${k + 1}}`), `${f}: falta el nivel ${i + 1}-${k + 1}`));
  }
});

test('cada PDF existe y es un PDF', () => {
  for (const { u } of units) {
    const f = path.join(ROOT, `media/resumenes/${u.world}.pdf`);
    assert.ok(fs.existsSync(f), `falta media/resumenes/${u.world}.pdf`);
    assert.equal(fs.readFileSync(f).subarray(0, 5).toString(), '%PDF-');
  }
});

test('la vista del mundo enlaza el resumen para descargarlo, al final del camino', () => {
  const app = read('js/app.js');
  const world = app.slice(app.indexOf('function renderWorld'), app.indexOf('// ---- pestaña Clips'));
  assert.match(world, /summaryOf\(u\)/);
  assert.match(world, /class="world-summary"/);
  assert.match(world, /download=/);
  assert.ok(world.indexOf('world-summary') > world.indexOf('data-exam'), 'después de la evaluación');
  assert.match(read('css/styles.css'), /\.world-summary\s*\{/);
});
