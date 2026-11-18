// Curso Preuniversitario UdeA (spec 2026-11-18-curso-preuda): dos componentes (razonamiento lógico y comprensión lectora), un mundo por
// tema del temario del preuniversitario, lecciones con escenas y ejercicios de juego con pista, y el juego subraya-texto.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const html = read('index.html'), sw = read('sw.js'), app = read('js/app.js');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia|acceso/.test(f));
const ctx = loadScripts(all);
const COURSES = get(ctx, 'COURSES'), WORLDS = get(ctx, 'WORLDS'), GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES');
const C = COURSES.find(c => c.id === 'preuda');
const lessons = C ? C.units.flatMap(u => u.lessons) : [];
const exercises = lessons.flatMap(l => l.ex.map((e, i) => ({ l, e, i })));

const RAZ = ['Cálculo Mental', 'Geometría Plana y Sólida', 'Acertijos de Orden', 'Proporcionalidad', 'Conteo y Combinatoria',
  'Razonamiento Espacial', 'Secuencias y Patrones', 'Códigos y Claves', 'Tablas y Gráficas', 'Lógica Proposicional',
  'Operadores Definidos', 'Aritmética y Promedios', 'Ecuaciones con Contexto', 'Conjuntos y Encuestas', 'Teoría de Números',
  'Azar y Probabilidad'];
const LEC = ['Estrategias de Lectura', 'Tipos de Texto', 'Información Explícita', 'Inferencia', 'Vocabulario en Contexto',
  'Aplicación y Analogía', 'Voces y Citas', 'Conectores y Funciones', 'Argumentación y Tono', 'Lectura de Dos Textos',
  'Referencia y Cohesión', 'Lenguaje Figurado'];

test('el curso Preuniversitario UdeA existe, está registrado y nace en borrador', () => {
  assert.ok(C, 'falta el curso preuda');
  assert.equal(C.name, 'Preuniversitario UdeA');
  assert.ok(html.indexOf('src="js/courses/preuda.js"') > 0 && html.indexOf('src="js/courses/preuda.js"') < html.indexOf('src="js/data.js"'));
  for (const f of ['preuda-razonamiento.js', 'preuda-lectura.js', 'preuda.js']) {
    assert.ok(html.includes(`src="js/courses/${f}"`), `${f} en index.html`);
    assert.ok(sw.includes(`'js/courses/${f}'`), `${f} en el SHELL`);
  }
  assert.ok(!/CURSOS_LISTOS = \[[^\]]*'preuda'/.test(read('js/cuenta.js')), 'borrador hasta revisión docente');
});

test('dos componentes: 16 mundos de razonamiento y 12 de lectura, en el orden del temario', () => {
  assert.equal(C.blocks.map(b => b.id).join(), 'razonamiento,lectura');
  assert.equal(C.units.map(u => WORLDS[u.world].name).join('|'), [...RAZ, ...LEC].join('|'));
  assert.equal(C.units.map(u => u.block).join(), [...RAZ.map(() => 'razonamiento'), ...LEC.map(() => 'lectura')].join());
  for (const u of C.units) assert.ok(u.world.startsWith('pu-'), u.world);
});

test('90 lecciones: 57 de razonamiento y 33 de lectura, cada una con escenas y al menos dos ejercicios', () => {
  const n = b => C.units.filter(u => u.block === b).flatMap(u => u.lessons).length;
  assert.equal(n('razonamiento'), 57);
  assert.equal(n('lectura'), 33);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const l of lessons) {
    assert.ok(l.id.startsWith('pu-'), l.id);
    assert.ok(l.clip.scenes.length >= 3, `${l.id}: escenas`);
    for (const s of l.clip.scenes) assert.ok(!/[¿?]/.test(s.text), `${l.id}: pregunta al espectador en «${s.text.slice(0, 40)}»`);
    assert.ok(l.ex.length >= 2, `${l.id}: ejercicios`);
  }
});

test('solo juegos (nada de opción múltiple ni de teclear), que existen, con pista y explicación', () => {
  for (const { l, e, i } of exercises) {
    const at = `${l.id}#${i}`;
    assert.equal(e.type, 'play', at);
    assert.ok(GAMES[e.game], `${at}: ${e.game}`);
    assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${at}: pista`);
    assert.ok(typeof e.explain === 'string' && e.explain.length > 20, `${at}: explicación`);
  }
});

test('escala-solucion: cada nivel con su paso válido primero, opciones distintas y que la pista no lo regale', () => {
  for (const { l, e, i } of exercises.filter(x => x.e.game === 'escala-solucion')) {
    for (const r of e.params.rounds) {
      assert.ok(r.levels.length >= 1, `${l.id}#${i}`);
      for (const lv of r.levels) {
        assert.ok(lv.length >= 2 && lv.length <= 3, `${l.id}#${i}: ${lv}`);
        assert.equal(new Set(lv).size, lv.length, `${l.id}#${i}: opciones repetidas ${lv}`);
        for (const o of lv) assert.ok(o.length <= 40, `${l.id}#${i}: «${o}» muy largo`);
      }
      assert.ok(!e.hint.includes(r.levels[r.levels.length - 1][0]), `${l.id}#${i}: la pista dice la respuesta`);
    }
  }
});

test('arma-la-cuenta: la cuenta de la solución da la respuesta', () => {
  const val = t => (t === 'π' ? Math.PI : /^-?\d+(\.\d+)?\/\d+$/.test(t) ? eval(t) : +t);
  for (const { l, e, i } of exercises.filter(x => x.e.game === 'arma-la-cuenta')) {
    for (const r of e.params.rounds) {
      const js = r.sol.map(t => (t === '^' ? '**' : t === 'r' ? 'Math.sqrt' : ['+', '-', '*', '/', '(', ')'].includes(t) ? t : `(${val(t)})`)).join(' ');
      const v = eval(js);
      assert.ok(Math.abs(v - r.answer) <= 1e-6 * Math.max(1, Math.abs(r.answer)), `${l.id}#${i}: ${r.sol.join(' ')} = ${v}, no ${r.answer}`);
      assert.ok(!e.hint.includes(String(r.answer)), `${l.id}#${i}: la pista dice la respuesta`);
    }
  }
});

test('ordena-terminos y encuesta-venn: datos válidos', () => {
  for (const { l, e, i } of exercises.filter(x => x.e.game === 'ordena-terminos')) {
    const { chips, order } = e.params;
    assert.equal(new Set(chips).size, chips.length, `${l.id}#${i}`);
    assert.ok(order.every(k => k >= 0 && k < chips.length) && new Set(order).size === order.length, `${l.id}#${i}`);
  }
  for (const { l, e, i } of exercises.filter(x => x.e.game === 'encuesta-venn')) {
    for (const r of e.params.rounds) assert.ok(r.both <= Math.min(r.a, r.b) && r.a + r.b - r.both <= r.total, `${l.id}#${i}`);
  }
});

test('subraya-texto: cada ronda con texto en trozos, consigna y trozos correctos que existen', () => {
  const sub = exercises.filter(x => x.e.game === 'subraya-texto');
  assert.ok(sub.length >= 40, `${sub.length} ejercicios de subrayar`);
  for (const { l, e, i } of sub) {
    for (const r of e.params.rounds) {
      const n = r.text.split('|').length;
      assert.ok(n >= 2, `${l.id}#${i}: texto sin trozos`);
      assert.ok(r.ask && r.ask.length >= 10, `${l.id}#${i}: consigna`);
      assert.ok(r.answer.length >= 1 && r.answer.length < n, `${l.id}#${i}: respuesta`);
      assert.ok(r.answer.every(k => Number.isInteger(k) && k >= 0 && k < n), `${l.id}#${i}: índice fuera del texto`);
      assert.equal(new Set(r.answer).size, r.answer.length);
    }
  }
});

test('subraya-texto: grade acierta solo con el subrayado exacto en cada ronda y cita los trozos', () => {
  const g = GAMES['subraya-texto'];
  const p = { rounds: [{ text: 'uno|dos|tres', ask: 'Toca el segundo trozo', answer: [1] }, { text: 'a|b|c|d', ask: 'Toca los extremos', answer: [0, 3] }] };
  assert.equal(g.grade({ rounds: [{ sel: [1] }, { sel: [3, 0] }] }, p).ok, true);
  assert.equal(g.grade({ rounds: [{ sel: [1, 2] }, { sel: [0, 3] }] }, p).ok, false, 'sobra un trozo');
  assert.equal(g.grade({ rounds: [{ sel: [1] }, { sel: [0] }] }, p).ok, false, 'falta un trozo');
  assert.equal(g.grade({ rounds: [{ sel: [1] }] }, p).ok, false, 'falta una ronda');
  assert.equal(g.grade({}, p).ok, false);
  const s = g.grade({ rounds: [] }, p).solution;
  assert.ok(s.includes('«dos»') && s.includes('«a»') && s.includes('«d»'), s);
});

test('subraya-texto está registrado, tiene guía y estilos para los dos temas', () => {
  assert.ok(html.includes('src="js/games/subraya-texto.js"') && sw.includes("'js/games/subraya-texto.js'"));
  assert.ok(GUIDES['subraya-texto']?.length >= 1);
  // La app pone data-tab en <body>: el juego busca sus botones por clase, o un toque abriría «la pestaña» body.
  assert.doesNotMatch(read('js/games/subraya-texto.js'), /closest\('\[data-/);
  assert.match(read('js/games/subraya-texto.js'), /role="button" tabindex=/, 'trozos en línea y con teclado');
  const css = read('css/styles.css');
  assert.match(css, /\.subraya\b/);
  assert.ok(!/\.subraya[^{]*\{[^}]*#[0-9a-f]{3,6}/i.test(css), 'sin colores fijos: usa las variables del tema');
});

test('al entrar al curso se elige primero el componente y luego se ven solo sus mundos', () => {
  // Pedido del usuario: «al ingresar al curso me muestre los dos componentes; si selecciono uno, me desglose sus mundos».
  assert.match(app, /let openBlock = null;/);
  assert.match(app, /if \(c\.blocks && openBlock\?\.course !== c\.id\) return renderComponents\(c\);/);
  assert.match(app, /function renderComponents\(c\) \{[\s\S]{0,2500}class="comp-card[\s\S]{0,1500}openBlock = \{ course: c\.id, id: b\.dataset\.block \}/);
  // En el componente: botón para volver a los componentes y solo los mundos de ese componente, numerados desde 1.
  assert.match(app, /<span>Componentes<\/span>/);
  assert.match(app, /const worldNo = \(c, ui\) =>/);
  assert.doesNotMatch(app, /Mundo \$\{ui \+ 1\}|Mundo \$\{ui \+ 2\}|Nivel \$\{ui \+ 1\}/, 'la numeración pasa por worldNo');
  assert.match(app, /c\.units\[ui \+ 1\]\.block === u\.block/, '«Siguiente mundo» no salta al otro componente');
  // Cambiar de curso, volver a tocar Aprender o el botón atrás del celular regresan a los componentes.
  assert.ok((app.match(/openWorld = null; openBlock = null;/g) || []).length >= 3);
  // El mundo abierto marca la lección que toca en su propio componente, y el recorrido guiado abre un componente.
  assert.match(app, /cur = currentLesson\(c, u\.block\)/);
  assert.match(read('js/tour.js'), /if \(needBlock\) openBlock = \{ course: c\.id/);
  assert.match(read('js/back.js'), /openBlock/);
  const css = read('css/styles.css');
  for (const k of ['.comp-list', '.comp-card']) assert.ok(css.includes(k), k);
  // worldNo cuenta dentro del componente: el primer mundo de Lectura es el 1.
  const worldNo = (c, ui) => (c.blocks ? c.units.slice(0, ui + 1).filter(u => u.block === c.units[ui].block).length : ui + 1);
  assert.equal(worldNo(C, 0), 1); assert.equal(worldNo(C, 15), 16); assert.equal(worldNo(C, 16), 1); assert.equal(worldNo(C, 27), 12);
  assert.ok(app.includes(`const worldNo = ${worldNo.toString()};`), 'la app usa esta misma worldNo');
});

test('cada componente se abre por su cuenta, gratis, y «Sigue aquí» no salta de componente', () => {
  assert.match(app, /function isUnlocked\(c, l\) \{[\s\S]{0,400}blockStart/);
  // «Sigue aquí» se queda en el componente que se estudia y no salta al otro.
  assert.match(app, /function currentLesson\(c, block\) \{[\s\S]{0,300}S\.lastLesson/);
  assert.match(app, /S\.lastLesson = l\.id; save\(\);/);
  assert.match(app, /nxt = n1 && blockOf\(c, n1\) === blockOf\(c, cur\) \? n1 : null/);
  // La primera lección de cada componente es gratis.
  const rows = get(ctx, 'catalogo')([C]).filter(r => r.tipo === 'leccion' && r.nivel_minimo === 'gratis').map(r => r.id);
  assert.equal(rows.join(), 'pu-cm-1,pu-el-1');
  const css = read('css/styles.css');
});

test('figura, paleta de juegos y láminas del curso', () => {
  assert.match(read('js/art.js'), /preuda: artSvg\(/);
  assert.match(read('js/games/kit.js'), /\n  preuda: \{/);
  for (const u of C.units) assert.match(WORLDS[u.world].art, /data-style="neon"/, u.world);
});
