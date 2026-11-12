// Porcentajes en tres lecciones (spec 2026-11-11-porcentajes-desde-cero): juegos nuevos y contenido.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const NEW = ['pinta-personas', 'porcentaje-cambio'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...NEW.map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), G = get(ctx, 'GAMES');
const lesson = id => alg.units.flatMap(u => u.lessons).find(l => l.id === id);
const uses = (l, n) => l.ex.filter(e => e.game === n);
const IDS = ['alg-13', 'alg-13c', 'alg-13d'];
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out)); return out; };

test('pinta-personas: se pintan justo las personas del porcentaje', () => {
  const g = G['pinta-personas'];
  const P = { rounds: [{ total: 20, pct: 35, what: 'usan gafas' }, { total: 8, pct: 12.5, what: 'x' }] };
  assert.equal(g.grade({ painted: [7, 1] }, P).ok, true);
  assert.equal(g.grade({ painted: [35, 1] }, P).ok, false, 'el 35 % de 20 no son 35 personas');
  assert.equal(g.grade({ painted: [7, null] }, P).ok, false);
  assert.ok(g.grade({}, P).solution.includes('7 de 20'));
});

test('porcentaje-cambio: el cambio se mide sobre el valor viejo', () => {
  const g = G['porcentaje-cambio'];
  const P = { rounds: [{ from: 40, to: 50, unit: '' }, { from: 50, to: 40, unit: '' }] };
  assert.equal(g.grade({ pcts: [25, -20] }, P).ok, true);
  assert.equal(g.grade({ pcts: [25, -25] }, P).ok, false, 'bajar no es simétrico');
  assert.equal(g.grade({ pcts: [20, -20] }, P).ok, false, 'no se divide entre el valor nuevo');
  assert.ok(g.grade({}, P).solution.includes('+25 %'));
  assert.equal(g.changeOf({ from: 80, to: 200 }), 150);
});

test('porcentajes: tres lecciones al final del mundo de razones', () => {
  const unit = alg.units.find(u => u.world === 'razones');
  assert.equal(unit.lessons.map(l => l.id).join(' '), 'alg-12 alg-12e alg-12f alg-13 alg-13c alg-13d');
});

test('porcentajes: cada lección con su video (escenas) y luego juegos con pista', () => {
  const need = {
    'alg-13': ['pinta-personas', 'cuadricula-cien', 'rueda-porcentaje', 'cruz-porcentaje'],
    'alg-13c': ['porcentaje-cambio', 'estira-barra', 'tragamonedas', 'etiqueta-rebaja'],
    'alg-13d': ['cascada', 'mejor-oferta', 'cadena-cambios', 'rebote', 'dos-etapas'],
  };
  for (const id of IDS) {
    const l = lesson(id);
    for (const n of need[id]) assert.ok(uses(l, n).length, `${id} sin ${n}`);
    assert.ok(l.clip.scenes.length >= 3 && !l.clip.bunny, `${id}: escenas de respaldo y sin el video viejo`);
    assert.ok(!l.more || !l.more.length, `${id}: un solo video`);
    l.ex.forEach((e, i) => {
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      assert.ok(['play', 'input'].includes(e.type), `${id} ejercicio ${i} es ${e.type}`);
      if (e.type === 'input') assert.ok(!e.hint.includes(String(e.answer)), `${id}: la pista dice ${e.answer}`);
    });
    assert.deepEqual(strings([l.ex, l.clip]).filter(x => /\d,\d/.test(x)), [], `${id}: coma decimal`);
    assert.deepEqual(strings(l.ex).filter(s => /inter[eé]s/i.test(s)), [], `${id}: el interés va en otra lección`);
  }
});

test('porcentajes: los ejemplos de los videos no se repiten en los ejercicios', () => {
  const bad = {
    'alg-13': ['"ask":"35 %"', '15 %', '18 de 72', '40 %', '150 %', '0.5 %', 'gafas'],
    'alg-13c': ['60 000', '50 000', '71 400', '2 500', '"change":8', '"from":2500', '"price":60000'],
    'alg-13d': ['80 000', '72 000', '1.331', '50 % y', '"drop":20', '"goal":0.75', '"goal":1.21'],
  };
  for (const [id, words] of Object.entries(bad)) {
    const t = JSON.stringify(lesson(id).ex);
    for (const w of words) assert.ok(!t.includes(w), `${id}: «${w}» sale en el video`);
  }
});

test('porcentajes: las rondas de los juegos nuevos son exactas y alcanzables', () => {
  for (const r of uses(lesson('alg-13'), 'pinta-personas')[0].params.rounds) {
    const k = (r.total * r.pct) / 100;
    assert.ok(Number.isInteger(k) && k > 0 && k <= r.total, `${r.pct} % de ${r.total}`);
  }
  for (const r of uses(lesson('alg-13c'), 'porcentaje-cambio')[0].params.rounds) {
    const c = G['porcentaje-cambio'].changeOf(r);
    assert.ok(Number.isInteger(c) && c >= -100 && c <= 300, `${r.from} → ${r.to}`);
  }
  const iva = lesson('alg-13c').ex.find(e => e.type === 'input');
  assert.equal(iva.answer, 400000);
});
