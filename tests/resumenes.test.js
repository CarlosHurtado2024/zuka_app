// Resúmenes en PDF de cada mundo (spec 2026-11-13-resumenes-pdf): la unidad lleva `summary` con la ruta del PDF,
// el archivo existe y la vista del mundo muestra un enlace para descargarlo.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ALG = get(loadScripts(['js/content.js', 'js/courses/algebra.js']), 'COURSE_ALGEBRA');

test('la Pradera de Venn (conjuntos) tiene su resumen en PDF', () => {
  const u = ALG.units.find(u => u.world === 'conjuntos');
  assert.equal(u.summary, 'media/resumenes/pradera-venn.pdf');
});

test('cada resumen declarado existe, es un PDF y tiene su fuente HTML', () => {
  for (const u of ALG.units.filter(u => u.summary)) {
    const file = path.join(ROOT, u.summary);
    assert.ok(fs.existsSync(file), `no existe ${u.summary}`);
    assert.equal(fs.readFileSync(file).subarray(0, 5).toString(), '%PDF-', `${u.summary} no es un PDF`);
    const src = path.join(ROOT, 'docs/resumenes', path.basename(u.summary, '.pdf') + '.html');
    assert.ok(fs.existsSync(src), `falta la fuente ${src}`);
  }
});

test('la vista del mundo enlaza el resumen para descargarlo', () => {
  const app = read('js/app.js');
  const world = app.slice(app.indexOf('function renderWorld'), app.indexOf('// ---- pestaña Clips'));
  assert.match(world, /u\.summary/);
  assert.match(world, /class="world-summary"[^>]*href="\$\{u\.summary\}"[^>]*download/);
  assert.match(read('css/styles.css'), /\.world-summary\s*\{/);
});
