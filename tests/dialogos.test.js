// Ventanas emergentes con el estilo de la app (sin confirm() del navegador) y botón «atrás» del celular:
// cierra lo que esté abierto y, en la pantalla principal, pregunta antes de salir (el segundo atrás sale).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const css = read('css/styles.css'), app = read('js/app.js'), exam = read('js/exam.js'), ui = read('js/ui.js');
const backStep = get(loadScripts(['js/back.js']), 'backStep');

test('ningún archivo de la app usa confirm() o alert() del navegador', () => {
  for (const f of fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js'))) {
    const src = read(`js/${f}`);
    assert.ok(!/\b(confirm|alert)\(/.test(src), `${f} usa un diálogo del navegador`);
  }
});

test('ask() arma un diálogo propio y las salidas de lección, evaluación y borrado lo usan', () => {
  assert.match(ui, /function ask\(/);
  assert.match(ui, /role', 'alertdialog'/);
  assert.match(app, /ask\(\{ title: '¿Salir de la lección\?'/);
  assert.match(app, /ask\(\{ title: '¿Borrar todo tu progreso\?'/);
  assert.match(exam, /ask\(\{ title: '¿Salir de la evaluación\?'/);
});

test('el diálogo usa los colores del tema y queda encima de hojas, lecciones y avisos', () => {
  const card = css.match(/\.dialog-card \{[^}]*\}/)?.[0] || '';
  assert.match(card, /background: var\(--bg2\)/);
  const z = sel => +(css.match(new RegExp(`${sel} \\{[^}]*z-index: (\\d+)`))?.[1] ?? 0);
  assert.ok(z('\\.dialog') > z('#sheet') && z('\\.dialog') > z('\\.toast'), 'z-index del diálogo');
});

test('el aviso flotante y el de versión nueva son tarjetas del tema (no colores invertidos)', () => {
  const toast = css.match(/\.toast \{[^}]*\}/)[0], bar = css.match(/\.update-bar \{[^}]*\}/)[0];
  for (const block of [toast, bar]) {
    assert.match(block, /background: var\(--bg2\)/);
    assert.match(block, /color: var\(--ink\)/);
  }
});

test('atrás: primero cierra lo abierto, en orden', () => {
  const base = { tab: 'learn' };
  assert.equal(backStep({ ...base, dialog: true, sheet: true, lesson: true }), 'dialog');
  assert.equal(backStep({ ...base, sheet: true, lesson: true }), 'sheet');
  assert.equal(backStep({ ...base, lesson: true, world: true }), 'lesson');
  assert.equal(backStep({ ...base, world: true }), 'world');
  assert.equal(backStep({ tab: 'clips' }), 'tab');
  assert.equal(backStep({ tab: 'profile' }), 'tab');
});

test('atrás en la pantalla principal pregunta; el segundo atrás sale', () => {
  assert.equal(backStep({ tab: 'learn' }), 'ask-exit');
  assert.equal(backStep({ tab: 'learn', exitAsk: true, dialog: true }), 'exit');
});

test('el diálogo no deja pasar toques ni teclas a la lección de atrás', () => {
  assert.match(ui, /'touchstart'/);
  assert.match(ui, /e\.stopPropagation\(\)\)\)/);
  assert.match(ui, /el\.inert = true/);
});

test('atrás: recargar no apila bases nuevas y la pregunta de salir deja la app en la base', () => {
  const back = read('js/back.js');
  assert.match(back, /if \(history\.state\?\.zuka !== 'top'\)/);
  const askBlock = back.slice(back.indexOf("if (step === 'ask-exit')"), back.indexOf('cover();\n    if (step') > 0 ? back.indexOf('cover();\n    if (step') : undefined);
  assert.ok(!/^\s*cover\(\);\s*$/m.test(askBlock.split('.then')[0]), 'no se pone la tapa antes de preguntar');
  assert.match(back, /ok: installed \? null : 'Salir'/, 'instalada: solo «Quedarme» (no se puede cerrar desde el código)');
  assert.match(exam, /dismissDialog\(\);\s+\/\/ si se acabó el tiempo/);
});

test('la app arma el manejo de atrás y carga back.js', () => {
  assert.match(app, /setupBack\(\)/);
  assert.ok(read('index.html').includes('src="js/back.js"'));
  assert.ok(read('sw.js').includes("'js/back.js'"));
});
