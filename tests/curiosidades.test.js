// Pestaña Clips: solo videos cortos de curiosidades (js/curiosidades.js), nunca los videos de las lecciones.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = loadScripts(['js/content.js', 'js/curiosidades.js']);
const CURIOS = get(ctx, 'CURIOS'), TOPICS = get(ctx, 'CURIO_TOPICS');
const curioFeed = get(ctx, 'curioFeed'), findCurio = get(ctx, 'findCurio'), curioTopics = get(ctx, 'curioTopics');

test('hay al menos una curiosidad y la primera es el origen de los números', () => {
  assert.ok(CURIOS.length >= 1);
  assert.equal(CURIOS[0].id, 'cur-origen-numeros');
});

test('cada curiosidad tiene id propio, tema, título, dato y un clip reproducible', () => {
  const ids = new Set();
  for (const q of CURIOS) {
    assert.match(q.id, /^cur-[a-z0-9-]+$/, q.id);
    assert.ok(!ids.has(q.id), `id repetido: ${q.id}`); ids.add(q.id);
    assert.ok(TOPICS.some(t => t.id === q.topic), `${q.id}: tema desconocido`);
    assert.ok(q.title && q.title.length <= 40, `${q.id}: título`);
    assert.ok(q.fact && q.fact.length <= 110, `${q.id}: el dato debe caber en dos renglones`);
    assert.ok(q.clip.video || q.clip.bunny, `${q.id}: sin video`);
    assert.ok(q.clip.duration > 0 && q.clip.duration <= 120, `${q.id}: un clip corto dura menos de dos minutos`);
    assert.ok(q.clip.scenes.length >= 1, `${q.id}: faltan escenas de respaldo`);
    if (q.clip.video) assert.ok(fs.existsSync(path.join(ROOT, q.clip.video)), `${q.id}: no existe ${q.clip.video}`);
  }
});

test('el feed solo trae curiosidades, con su tema, y filtra por tema', () => {
  const all = curioFeed('all');
  assert.equal(all.length, CURIOS.length);
  for (const { c, l } of all) { assert.ok(CURIOS.includes(l)); assert.equal(c.id, l.topic); assert.ok(c.color); }
  for (const t of TOPICS) assert.ok(curioFeed(t.id).every(({ l }) => l.topic === t.id));
  assert.equal(curioFeed('mate').length, CURIOS.filter(q => q.topic === 'mate').length);
});

test('findCurio encuentra por id y no inventa', () => {
  assert.equal(findCurio('cur-origen-numeros').l, CURIOS[0]);
  assert.equal(findCurio('alg-11'), undefined);
});

test('solo se ofrecen como chips los temas que ya tienen clips', () => {
  const ts = curioTopics();
  assert.ok(ts.length >= 1);
  for (const t of ts) assert.ok(CURIOS.some(q => q.topic === t.id));
});

test('ninguna curiosidad usa el id de una lección', () => {
  const all = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/courses/trig.js', 'js/courses/calculo.js', 'js/courses/geometria.js', 'js/data.js']);
  const lessonIds = new Set(get(all, 'COURSES').flatMap(c => c.units.flatMap(u => u.lessons.map(l => l.id))));
  for (const q of CURIOS) assert.ok(!lessonIds.has(q.id), q.id);
});

test('la pestaña Clips no pinta videos de lecciones ni el botón Practicar', () => {
  const app = read('js/app.js');
  const a = app.indexOf('// ---- pestaña Clips'), b = app.indexOf('function watched');
  assert.ok(a > 0 && b > a);
  const feed = app.slice(a, b);
  assert.match(feed, /curioFeed\(/);
  assert.doesNotMatch(feed, /lessonsOf|COURSES|findLesson/);
  assert.doesNotMatch(feed, /data-act="practice"|data-act="voice"/);
  assert.match(feed, /feed-cap/);
});

test('curiosidades.js está cargado en index.html y en el SHELL; el mp4 no se precachea', () => {
  const index = read('index.html'), sw = read('sw.js');
  assert.ok(index.includes('src="js/curiosidades.js"'));
  assert.ok(index.indexOf('js/content.js') < index.indexOf('js/curiosidades.js') && index.indexOf('js/curiosidades.js') < index.indexOf('js/app.js'));
  assert.ok(sw.includes("'js/curiosidades.js'"));
  assert.doesNotMatch(sw, /media\/clips/);
  assert.match(sw, /headers\.has\('range'\)/, 'las peticiones de video con Range pasan sin caché');
  assert.ok(sw.includes('if (sameOrigin && /\\/media\\//.test('), 'un mp4 pedido entero tampoco se guarda');
});

test('si el video no carga, el feed cambia a las escenas de respaldo', () => {
  assert.match(read('js/player.js'), /addEventListener\('error', \(\) => \{ this\.stall\(\); opts\.onFail\?\.\(\); \}\)/);
  const app = read('js/app.js');
  assert.match(app, /onFail: \(\) => \{[\s\S]{0,260}mountClip\(host, c, l, \{ scenes: clip\.scenes \}\)/);
});

test('en pausa, el pie del clip sube por encima de la barra de adelantar', () => {
  assert.match(read('css/styles.css'), /\.feed-item:has\(\.clip\.paused\) \.feed-cap \{ opacity: 1; bottom: calc\(var\(--tabbar-h/);
  assert.match(read('css/styles.css'), /\.feed-cap \{[^}]*opacity: 0/, 'mientras el clip corre, el pie no tapa el video');
});

test('el recorrido guiado presenta Clips como curiosidades, no como videos de lecciones', () => {
  const tour = loadScripts(['js/tour.js']);
  const s = get(tour, 'TOUR_STEPS').find(x => x.id === 'clips');
  assert.match(s.title + s.text, /curios/i);
  assert.doesNotMatch(s.text, /todas las lecciones|Practicar/);
});

test('«La razón que no cambia» (Art Deco) está en Clips con su video y escenas de respaldo', () => {
  const q = CURIOS.find(c => c.id === 'cur-razon-deco');
  assert.ok(q, 'falta cur-razon-deco');
  assert.equal(q.topic, 'mate');
  assert.ok(q.clip.video === 'media/clips/razon-deco.mp4' || q.clip.bunny);
  assert.equal(q.clip.duration, 90);
  assert.ok(q.clip.scenes.length >= 4);
  assert.match(q.fact, /0\.5 mL/);
});
