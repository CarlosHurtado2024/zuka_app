// Preuniversitario · Comprensión lectora con textos de verdad (spec 2026-11-19-preuda-lectura-textos): en los mundos terminados
// (PU_LEC_HECHOS) cada lección trabaja un solo texto original de 330 a 560 palabras en 7 juegos distintos de arrastrar, con
// pista y explicación; las referencias a párrafos existen y las citas están en el texto; la evaluación del mundo va en formato
// real (pregunta-examen), con dos o más preguntas por lección. Los 16 juegos del kit LEC califican bien.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const html = read('index.html'), sw = read('sw.js'), css = read('css/styles.css');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES'), DONE = get(ctx, 'PU_LEC_HECHOS'), LEC = get(ctx, 'LEC');
const units = get(ctx, 'COURSES').find(c => c.id === 'preuda').units.filter(u => u.block === 'lectura');
const NEW = ['anticipa-texto', 'mapa-del-texto', 'resume-parrafo', 'donde-buscar', 'lupa-evidencia', 'intruso-excepto',
  'palabra-a-la-medida', 'hilo-referente', 'conector-bisagra', 'signos-que-hablan', 'quien-lo-dice', 'balanza-argumento',
  'termometro-tono', 'caso-nuevo', 'puente-dos-textos', 'pregunta-examen'];
const LESSON_GAMES = NEW.filter(g => g !== 'pregunta-examen');
const words = d => d.paras.join(' ').split(/\s+/).filter(Boolean).length;
const docsOf = p => p.docs || (p.doc ? [p.doc] : []);

test('kit y juegos registrados en orden: kit después de kit.js; mundos de lectura antes de su archivo de juegos', () => {
  const at = f => html.indexOf(`src="${f}"`);
  assert.ok(at('js/games/kit.js') >= 0 && at('js/games/kit.js') < at('js/games/lectura-kit.js'));
  for (const g of NEW) {
    assert.ok(at(`js/games/${g}.js`) > at('js/games/lectura-kit.js'), g);
    assert.ok(sw.includes(`'js/games/${g}.js'`), `${g} en SHELL`);
  }
  assert.ok(sw.includes("'js/games/lectura-kit.js'"));
  assert.ok(at('js/courses/preuda-lectura.js') < at('js/courses/preuda-lectura-juegos.js'));
  assert.ok(at('js/courses/preuda-lectura-juegos.js') < at('js/courses/preuda.js'));
  for (const f of [...html.matchAll(/src="(js\/courses\/preuda-l-[^"]+)"/g)].map(m => m[1])) {
    assert.ok(at(f) > at('js/courses/preuda-lectura.js') && at(f) < at('js/courses/preuda-lectura-juegos.js'), f);
    assert.ok(sw.includes(`'${f}'`), f);
  }
});

test('cada juego nuevo tiene guía, estilos y no busca [data-…] con closest (la app pone data-tab en <body>)', () => {
  for (const g of NEW) {
    assert.ok(GAMES[g], g);
    assert.ok(GUIDES[g]?.length >= 1, `${g} sin guía`);
    assert.doesNotMatch(read(`js/games/${g}.js`), /closest\('\[data-/, g);
  }
  assert.doesNotMatch(read('js/games/lectura-kit.js'), /closest\('\[data-/);
  for (const cls of ['.lec-doc', '.lec-chip', '.lec-zone', '.lec-pool', '.lec-opt']) assert.ok(css.includes(cls), cls);
});

// Estado que pone cada ficha en su primera zona válida (o la deja en la bandeja si sobra).
const solved = (name, params) => ({ rounds: LEC.rounds(name, params).map(r => ({ place: r.key.map(k => k == null ? -1 : [].concat(k)[0]) })) });
const empty = (name, params) => ({ rounds: LEC.rounds(name, params).map(r => ({ place: r.chips.map(() => -1) })) });

test('los juegos de fichas: aciertan con la clave, fallan vacíos o con una ficha cambiada, y dan la solución', () => {
  const seen = new Set();
  for (const u of units) for (const l of u.lessons) for (const e of l.ex) {
    if (!LESSON_GAMES.includes(e.game) || e.game === 'hilo-referente' || e.game === 'termometro-tono') continue;
    seen.add(e.game);
    const g = GAMES[e.game];
    assert.equal(g.grade(solved(e.game, e.params), e.params).ok, true, `${l.id} ${e.game}`);
    assert.equal(g.grade(empty(e.game, e.params), e.params).ok, false, `${l.id} ${e.game} vacío`);
    const s = solved(e.game, e.params), r = LEC.rounds(e.game, e.params)[0], c = r.key.findIndex(k => k != null);
    s.rounds[0].place[c] = -1;
    assert.equal(g.grade(s, e.params).ok, false, `${l.id} ${e.game} sin una ficha`);
    assert.ok(g.grade(solved(e.game, e.params), e.params).solution.length > 5, `${e.game} sin solución`);
    for (const rr of LEC.rounds(e.game, e.params)) {
      assert.ok(rr.chips.length >= 2 && rr.zones.length >= 1, `${l.id} ${e.game}`);
      for (const k of rr.key) for (const z of [].concat(k ?? [])) assert.ok(z >= 0 && z < rr.zones.length, `${l.id} ${e.game}: zona ${z}`);
      assert.ok(rr.key.some(k => k != null), `${l.id} ${e.game}: ninguna ficha va a una zona`);
    }
  }
  assert.ok(seen.size >= 10, `solo se probaron ${[...seen]}`);
});

test('hilo-referente, termometro-tono y pregunta-examen califican su respuesta exacta', () => {
  const h = GAMES['hilo-referente'], p = { rounds: [{ p: 1, text: 'Ana vio a Luis|. |Él|sonrió.', from: 2, answer: 0, ask: '¿A quién?' }] };
  assert.equal(h.grade({ rounds: [{ to: 0 }] }, p).ok, true);
  assert.equal(h.grade({ rounds: [{ to: 3 }] }, p).ok, false);
  assert.equal(h.grade({ rounds: [{ to: -1 }] }, p).ok, false);
  const t = GAMES['termometro-tono'], q = { rounds: [{ frag: 'x', scale: ['irónico', 'neutral', 'entusiasta'], answer: 0 }] };
  assert.equal(t.grade({ rounds: [{ at: 0 }] }, q).ok, true);
  assert.equal(t.grade({ rounds: [{ at: 2 }] }, q).ok, false);
  const x = GAMES['pregunta-examen'], r = { doc: { id: 'd', title: 't', paras: ['a'] }, q: '¿?', options: ['a', 'b', 'c', 'd'], answer: 2 };
  assert.equal(x.grade({ pick: 2 }, r).ok, true);
  assert.equal(x.grade({ pick: 1 }, r).ok, false);
  assert.equal(x.grade({ pick: -1 }, r).ok, false);
  assert.match(x.grade({ pick: 1 }, r).solution, /^C\./);
});

test('hay mundos de lectura terminados y siguen el orden del curso', () => {
  assert.ok(DONE.length >= 1);
  const order = units.map(u => u.world);
  for (const w of DONE) assert.ok(order.includes(w), w);
});

test('mundos terminados: un texto por lección, 330–560 palabras y 4–7 párrafos, en sus 7 juegos distintos con pista', () => {
  const docIds = new Set();
  for (const u of units.filter(u => DONE.includes(u.world))) for (const l of u.lessons) {
    const games = l.ex.map(e => e.game);
    assert.equal(l.ex.length, 7, `${l.id}: ${l.ex.length}`);
    assert.equal(new Set(games).size, 7, `${l.id}: repetido (${games})`);
    const ids = new Set();
    for (const e of l.ex) {
      assert.equal(e.type, 'play', l.id);
      assert.ok(LESSON_GAMES.includes(e.game), `${l.id}: ${e.game} no es un juego de lectura de lección`);
      assert.ok(e.hint?.length > 20 && e.explain?.length > 20, `${l.id}: ${e.game} sin pista o explicación`);
      for (const d of docsOf(e.params)) ids.add(d.id);
    }
    const main = l.ex.map(e => e.params.doc).find(Boolean);
    assert.ok(main, `${l.id}: sin texto`);
    assert.ok(l.ex.filter(e => e.params.doc?.id === main.id).length >= 6, `${l.id}: el texto no acompaña la lección`);
    assert.ok(!docIds.has(main.id), `${main.id} repetido en otra lección`);
    docIds.add(main.id);
    const n = words(main);
    assert.ok(n >= 330 && n <= 560, `${l.id}: ${n} palabras`);
    assert.ok(main.paras.length >= 4 && main.paras.length <= 7, `${l.id}: ${main.paras.length} párrafos`);
  }
});

test('las referencias a párrafos existen y las citas están literalmente en su párrafo', () => {
  for (const u of units.filter(u => DONE.includes(u.world))) for (const l of u.lessons) for (const e of l.ex) {
    const p = e.params, d = p.doc, P = n => d.paras[n - 1];
    const inRange = n => assert.ok(Number.isInteger(n) && n >= 1 && n <= d.paras.length, `${l.id} ${e.game}: párrafo ${n}`);
    if (e.game === 'palabra-a-la-medida') for (const r of p.rounds) {
      inRange(r.p);
      assert.ok(P(r.p).includes(`${r.before}${r.word}${r.after}`), `${l.id}: «${r.before}${r.word}${r.after}» no está en ¶${r.p}`);
      assert.ok(!r.options.includes(r.word), `${l.id}: la palabra del texto no puede ser una opción`);
    }
    if (e.game === 'hilo-referente') for (const r of p.rounds) {
      inRange(r.p);
      assert.ok(P(r.p).includes(r.text.split('|').join('')), `${l.id}: hilo fuera de ¶${r.p}`);
      assert.notEqual(r.from, r.answer);
    }
    if (e.game === 'signos-que-hablan') for (const r of p.rounds) if (r.p) assert.ok(P(r.p).includes(r.text.split('|').join('')), `${l.id}: signo fuera de ¶${r.p}`);
    if (e.game === 'mapa-del-texto') assert.equal(p.key.length, d.paras.length, `${l.id}: una etiqueta por párrafo`);
    if (e.game === 'resume-parrafo') p.paras.forEach(inRange);
    if (['donde-buscar', 'intruso-excepto'].includes(e.game)) for (const [, ps] of p.cards) for (const n of ps || []) inRange(n);
  }
});

test('la pista no regala la respuesta en las preguntas de una sola respuesta', () => {
  for (const u of units.filter(u => DONE.includes(u.world))) for (const l of u.lessons) for (const e of l.ex) {
    if (!['palabra-a-la-medida', 'conector-bisagra', 'signos-que-hablan'].includes(e.game)) continue;
    for (const r of e.params.rounds) assert.ok(!e.hint.toLowerCase().includes(`«${r.options[r.answer].toLowerCase()}»`), `${l.id}: la pista dice la respuesta`);
  }
});

test('evaluación en formato real: pregunta-examen sobre un texto nuevo, dos o más por lección, opciones distintas', () => {
  for (const u of units.filter(u => DONE.includes(u.world))) {
    assert.ok(u.exam?.items?.length, u.world);
    const lessonDocs = new Set(u.lessons.flatMap(l => l.ex.flatMap(e => docsOf(e.params).map(d => d.id))));
    for (const l of u.lessons) assert.ok(u.exam.items.filter(it => it.lesson === l.id).length >= 2, `${u.world}: ${l.id}`);
    for (const it of u.exam.items) {
      const e = it.ex, p = e.params;
      assert.equal(e.game, 'pregunta-examen', `${u.world}: ${e.game}`);
      assert.ok(it.review?.length > 10, `${u.world}: sin nota de repaso`);
      assert.equal(p.options.length, 4);
      assert.equal(new Set(p.options).size, 4, `${u.world}: opciones repetidas en «${p.q}»`);
      assert.ok(p.answer >= 0 && p.answer < 4);
      for (const d of docsOf(p)) assert.ok(!lessonDocs.has(d.id), `${u.world}: la evaluación repite el texto ${d.id}`);
      assert.ok(e.hint?.length > 20 && e.explain?.length > 20, `${u.world}: ${p.q}`);
    }
    const keys = u.exam.items.map(it => it.ex.params.answer);
    assert.ok(new Set(keys).size >= 3, `${u.world}: las claves no varían (${keys})`);
  }
});

test('revisión: pestañas usables tras comprobar, bandeja enfocable y teclas que no escapan a la lección', () => {
  const kit = read('js/games/lectura-kit.js');
  const click = kit.slice(kit.indexOf("play.addEventListener('click'"));
  assert.ok(click.indexOf("closest('.lec-tab')") < click.indexOf('if (locked'), 'la pestaña se maneja antes de cortar por locked');
  assert.doesNotMatch(kit, /class="lec-pool" role="[^"]+" tabindex="-1"/, 'la bandeja se puede enfocar');
  assert.match(kit, /closest\('\.lec-pool'\) && sel >= 0\) \{\s*e\.preventDefault/, 'Enter en la bandeja devuelve la ficha');
  assert.match(kit, /\|\| drag\) return;/, 'un solo arrastre a la vez');
  for (const g of ['hilo-referente', 'termometro-tono', 'pregunta-examen']) assert.match(read(`js/games/${g}.js`), /LEC\.guardKeys\(box\)/, g);
  assert.match(kit, /guardKeys\(box\);\s*render\(\);/);
  assert.match(read('js/exam.js'), /it\.ex\.kind \|\| EX_KIND/);
});

test('el orden en pantalla no delata la respuesta: fichas y tonos se muestran revueltos', () => {
  const firstPos = [], tonePos = [];
  let sameAsParagraphs = 0, maps = 0;
  for (const u of units.filter(u => DONE.includes(u.world))) for (const l of u.lessons) for (const e of l.ex) {
    if (e.game === 'termometro-tono') for (const r of e.params.rounds) tonePos.push(LEC.mix(r.scale).indexOf(r.answer));
    if (!LESSON_GAMES.includes(e.game) || ['hilo-referente', 'termometro-tono'].includes(e.game)) continue;
    for (const r of LEC.rounds(e.game, e.params)) {
      const shown = LEC.mix(r.chips);
      if (r.zones.length === 1) firstPos.push(shown.indexOf(r.key.findIndex(k => k != null)));
      if (e.game === 'mapa-del-texto') { maps++; if (shown.slice(0, r.zones.length).join() === r.zones.map((_, i) => r.chips.indexOf(r.chips[e.params.key[i]])).join()) sameAsParagraphs++; }
    }
  }
  assert.ok(new Set(firstPos).size >= 2, `la respuesta de los huecos sale siempre en la misma posición (${firstPos})`);
  assert.ok(firstPos.filter(p => p === 0).length < firstPos.length / 2, `la respuesta sale primera demasiadas veces (${firstPos})`);
  assert.ok(new Set(tonePos).size >= 2, `el tono correcto siempre en el mismo lugar del dial (${tonePos})`);
  assert.equal(sameAsParagraphs, 0, `${sameAsParagraphs} de ${maps} mapas muestran las etiquetas en el orden de los párrafos`);
});
