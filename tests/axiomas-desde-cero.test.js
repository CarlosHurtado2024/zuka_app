// Axiomas de campo y orden en tres lecciones (spec 2026-11-11-axiomas-desde-cero): juegos nuevos y contenido.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get } = require('./load');

const NEW = ['inversos-gemelos', 'corta-rectangulo', 'cancela-balanza', 'tren-ordenado'];
const OLD = ['atajo-axiomas', 'arma-producto', 'ordena-terminos', 'voltea-desigualdad', 'dobla-la-recta', 'distancia-justa', 'dibuja-intervalo'];
const ctx = loadScripts(['js/content.js', 'js/courses/algebra.js', 'js/games/kit.js', ...[...NEW, ...OLD].map(n => `js/games/${n}.js`)]);
const alg = get(ctx, 'COURSE_ALGEBRA'), G = get(ctx, 'GAMES');
const lesson = id => alg.units.flatMap(u => u.lessons).find(l => l.id === id);
const uses = (l, n) => l.ex.filter(e => e.game === n);

test('inversos-gemelos: el gemelo lleva al neutro (0 con +, 1 con ×) y el 0 no tiene recíproco', () => {
  const g = G['inversos-gemelos'];
  const suma = { op: '+', rounds: [{ label: '−7', v: -7, sol: '7' }, { label: '√6', v: Math.sqrt(6), sol: '−√6' }] };
  const op7 = { s: 1, n: 7, d: 1, r: false }, opR6 = { s: -1, n: 6, d: 1, r: true };
  assert.equal(g.grade({ ans: [op7, opR6] }, suma).ok, true);
  assert.equal(g.grade({ ans: [op7, { ...opR6, s: 1 }] }, suma).ok, false);
  assert.equal(g.grade({ ans: [op7, null] }, suma).ok, false);
  const prod = { op: '×', rounds: [{ label: '3/8', v: 3 / 8, sol: '8/3' }, { label: '0', v: 0, sol: 'no tiene' }] };
  assert.equal(g.grade({ ans: [{ s: 1, n: 8, d: 3, r: false }, { none: true }] }, prod).ok, true);
  assert.equal(g.grade({ ans: [{ s: 1, n: 16, d: 6, r: false }, { none: true }] }, prod).ok, true, 'una fracción equivalente también');
  assert.equal(g.grade({ ans: [{ s: 1, n: 8, d: 3, r: false }, { s: 1, n: 0, d: 1, r: false }] }, prod).ok, false);
  assert.equal(g.grade({ ans: [{ none: true }, { none: true }] }, prod).ok, false, '3/8 sí tiene recíproco');
  assert.ok(g.grade({ ans: [] }, prod).solution.includes('8/3'));
  assert.equal(g.valueOf({ s: -1, n: 9, d: 2, r: true }), -1.5);
});

test('corta-rectangulo: el corte deja una pieza con el área pedida', () => {
  const g = G['corta-rectangulo'];
  const P = { rounds: [{ h: 8, w: 14, piece: 80 }, { h: 6, w: 15, piece: 18 }] };
  assert.equal(g.grade({ cuts: [10, 3] }, P).ok, true);
  assert.equal(g.grade({ cuts: [4, 12] }, P).ok, true, 'la pieza puede quedar a cualquier lado');
  assert.equal(g.grade({ cuts: [9, 3] }, P).ok, false);
  assert.equal(g.grade({ cuts: [10, null] }, P).ok, false);
  assert.ok(g.grade({ cuts: [] }, P).solution.includes('8 · 10 + 8 · 4'));
});

test('cancela-balanza: solo se cancelan fichas iguales, nunca un 0 que multiplica, y gana con x sola', () => {
  const g = G['cancela-balanza'];
  const r = { op: '+', left: ['x', '6', '−2'], right: ['−2', '11', '6'], ans: 'x = 11' };
  assert.equal(g.canCancel(r, 1, 2), true);
  assert.equal(g.canCancel(r, 2, 0), true);
  assert.equal(g.canCancel(r, 1, 1), false);
  assert.equal(g.canCancel(r, 0, 1), false, 'la x no se cancela');
  const z = { op: '·', left: ['0', 'x'], right: ['0', '5'], ans: '' };
  assert.equal(g.canCancel(z, 0, 0), false, 'el 0 no se cancela en un producto');
  const P = { rounds: [r] };
  assert.equal(g.grade({ pairs: [[[1, 2], [2, 0]]] }, P).ok, true);
  assert.equal(g.grade({ pairs: [[[1, 2]]] }, P).ok, false);
  assert.equal(g.grade({ pairs: [[[1, 1], [2, 0]]] }, P).ok, false, 'pareja que no vale');
  assert.equal(g.grade({ pairs: [[[1, 2], [1, 2], [2, 0]]] }, P).ok, false, 'ficha usada dos veces');
  assert.ok(g.grade({ pairs: [] }, P).solution.includes('x = 11'));
});

test('tren-ordenado: los vagones quedan de menor a mayor', () => {
  const g = G['tren-ordenado'];
  const P = { rounds: [{ items: [{ label: '0', v: 0 }, { label: '−4', v: -4 }, { label: '2/3', v: 2 / 3 }] }] };
  assert.equal(g.grade({ orders: [[1, 0, 2]] }, P).ok, true);
  assert.equal(g.grade({ orders: [[0, 1, 2]] }, P).ok, false);
  assert.ok(g.grade({ orders: [[0, 1, 2]] }, P).solution.includes('−4 < 0 < 2/3'));
});

test('axiomas: tres lecciones seguidas tras sistemas numéricos, cada una con su video y luego sus juegos', () => {
  const unit = alg.units.find(u => u.lessons.some(l => l.id === 'alg-12b'));
  assert.equal(unit.lessons.slice(0, 6).map(l => l.id).join(' '), 'alg-11 alg-11b alg-11c alg-12b alg-12c alg-12d');
  const need = {
    'alg-12b': ['inversos-gemelos', 'corta-rectangulo', 'atajo-axiomas'],
    'alg-12c': ['arma-producto', 'cancela-balanza', 'ordena-terminos'],
    'alg-12d': ['tren-ordenado', 'voltea-desigualdad', 'dobla-la-recta', 'distancia-justa', 'dibuja-intervalo'],
  };
  for (const [id, games] of Object.entries(need)) {
    const l = lesson(id);
    for (const n of games) assert.ok(uses(l, n).length, `${id} sin ${n}`);
    assert.ok(l.clip.scenes.length >= 3, `${id}: escenas de respaldo`);
    assert.ok(!l.more || !l.more.length, `${id}: un solo video`);
    assert.ok(l.ex.length >= 4, `${id}: pocos ejercicios`);
    l.ex.forEach((e, i) => {
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${id} ejercicio ${i} sin pista`);
      assert.ok(['play', 'input'].includes(e.type), `${id} ejercicio ${i} es ${e.type}`);
      if (e.type === 'input') assert.ok(!e.hint.includes(String(e.answer)), `${id}: la pista dice ${e.answer}`);
    });
  }
  // Cada lección solo usa lo que su video enseña: la de campo no trae signos ni orden; la de orden no trae balanzas.
  for (const n of ['arma-producto', 'voltea-desigualdad', 'dobla-la-recta']) assert.ok(!uses(lesson('alg-12b'), n).length, `alg-12b trae ${n}`);
  assert.ok(!uses(lesson('alg-12d'), 'cancela-balanza').length);
});

test('axiomas: los ejemplos de los videos no se repiten en los ejercicios', () => {
  const bad = {
    'alg-12b': ['38 + 19', '6 · 102', '4/9', '"3/2"', '"label":"5"', '"h":3,"w":6'],
    'alg-12c': ['9 − 4', '12 ÷ 3', '2/5', '7 + x', '0 · 2'],
    'alg-12d': ['"a":-4', '|−6|', '√2 − 1.5', '|x − 1|', '"label":"1.4"'],
  };
  for (const [id, words] of Object.entries(bad)) {
    const t = JSON.stringify(lesson(id).ex);
    for (const w of words) assert.ok(!t.includes(w), `${id}: «${w}» sale en el video`);
  }
});

test('axiomas: cada ronda de los juegos nuevos se puede ganar con sus controles', () => {
  for (const e of uses(lesson('alg-12b'), 'inversos-gemelos')) {
    for (const r of e.params.rounds) {
      const g = G['inversos-gemelos'], P = { op: e.params.op, rounds: [r] };
      let found = g.grade({ ans: [{ none: true }] }, P).ok;
      for (const s of [1, -1]) for (let n = 0; n <= 20 && !found; n++) for (let d = 1; d <= 20 && !found; d++) for (const rt of [false, true]) {
        if (g.grade({ ans: [{ s, n, d, r: rt }] }, P).ok) found = true;
      }
      assert.ok(found, `${r.label}: sin gemelo alcanzable`);
    }
  }
  for (const e of uses(lesson('alg-12b'), 'corta-rectangulo')) for (const r of e.params.rounds) {
    assert.ok(r.piece % r.h === 0 && r.piece / r.h > 0 && r.piece / r.h < r.w, `${r.h}×${r.w}: pieza ${r.piece}`);
  }
  for (const e of uses(lesson('alg-12c'), 'cancela-balanza')) {
    const g = G['cancela-balanza'];
    const pairs = e.params.rounds.map(r => {
      const used = new Set(), out = [];
      r.left.forEach((_, i) => { const j = r.right.findIndex((_, j) => !used.has(j) && g.canCancel(r, i, j)); if (j >= 0) { used.add(j); out.push([i, j]); } });
      return out;
    });
    assert.equal(g.grade({ pairs }, e.params).ok, true, 'alguna balanza no termina con x sola');
  }
  for (const e of uses(lesson('alg-12d'), 'tren-ordenado')) for (const r of e.params.rounds) {
    const vs = r.items.map(i => i.v);
    assert.equal(new Set(vs).size, vs.length, 'dos vagones con el mismo valor');
    assert.ok(r.items.length <= 6, 'demasiados vagones para un celular');
  }
});
