// Unidad 1 de Trigonometría: cada lección tiene juegos (nada de opción múltiple), todos con pista, y
// cada ronda de los juegos nuevos se puede resolver con los controles del juego.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, get, loadGame } = require('./load');

const unit = get(loadScripts(['js/content.js', 'js/courses/trig.js']), 'COURSE_TRIG').units[0];
const lessons = unit.lessons;
const G = name => loadGame(`js/games/${name}.js`)[name];
const NEW = ['rueda-angulo', 'corta-pizza', 'arma-triangulo', 'mide-altura', 'atrapa-punto', 'noria', 'sintoniza-onda'];

test('cada lección: sin opción múltiple, al menos tres ejercicios, mayoría juegos y todos con pista', () => {
  for (const l of lessons) {
    assert.ok(l.ex.length >= 3, `${l.id} con pocos ejercicios`);
    const plays = l.ex.filter(e => e.type === 'play').length;
    assert.ok(plays * 2 > l.ex.length, `${l.id}: ${plays} juegos de ${l.ex.length}`);
    for (const [i, e] of l.ex.entries()) {
      assert.notEqual(e.type, 'mc', `${l.id} ejercicio ${i} es de opción múltiple`);
      assert.ok(typeof e.hint === 'string' && e.hint.length > 20, `${l.id} ejercicio ${i} sin pista`);
    }
  }
});

test('los siete juegos nuevos se usan en la unidad', () => {
  const used = new Set(lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => e.game)));
  for (const g of NEW) assert.ok(used.has(g), `nadie usa ${g}`);
});

test('cada ronda de los juegos nuevos tiene solución alcanzable', () => {
  const plays = lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(e => ({ id: l.id, ...e })));
  for (const e of plays) {
    const P = e.params, where = `${e.id} ${e.game}`;
    if (e.game === 'rueda-angulo') for (const r of P.rounds) assert.ok(r.target % (P.snap || 15) === 0, `${where}: ${r.target} no cae en el paso`);
    if (e.game === 'corta-pizza') {
      const pizza = G('corta-pizza');
      const ok = pizza.grade({ cuts: P.rounds.map(r => {
        if (r.r != null) { const t = r.goal === 'arc' ? r.value / r.r : 2 * r.value / (r.r * r.r); return { deg: Math.round(t * 180 / Math.PI / 5) * 5, r: r.r }; }
        const t = r.deg * Math.PI / 180; return { deg: r.deg, r: Math.round(r.goal === 'arc' ? r.value / t : Math.sqrt(2 * r.value / t)) };
      }) }, P).ok;
      assert.ok(ok, `${where}: alguna ronda no se alcanza con pasos de 5° y radios enteros`);
    }
    if (e.game === 'arma-triangulo') {
      const tri = G('arma-triangulo');
      for (const r of P.rounds) {
        let found = false;
        for (let a = 1; a <= P.max && !found; a++) for (let b = 1; b <= P.max && !found; b++) found = Math.abs(tri.ratio(r.fn, a, b) - r.num / r.den) < 0.005;
        assert.ok(found, `${where}: ${r.fn} = ${r.num}/${r.den} no se arma con catetos hasta ${P.max}`);
      }
    }
    if (e.game === 'mide-altura') for (const r of P.rounds) assert.ok(r.h / Math.tan(r.angle * Math.PI / 180) <= r.maxD, `${where}: la distancia no cabe`);
    if (e.game === 'atrapa-punto') for (const r of P.rounds) for (const a of r.angles) assert.ok(G('atrapa-punto').POINTS.includes(a), `${where}: ${a}° no es un punto del tablero`);
    if (e.game === 'noria') for (const r of P.rounds) assert.ok(Array.from({ length: 24 }, (_, k) => k * 15).some(a => G('noria').fits(a, r)), `${where}: «${r.prompt}» no tiene respuesta`);
    if (e.game === 'sintoniza-onda') for (const r of P.rounds) {
      const t = r.target, s = (v, step, min, max) => Number.isInteger(+(v / step).toFixed(6)) && v >= min && v <= max;
      assert.ok(s(t.a, 0.5, -3, 3) && t.a !== 0 && s(t.b, 0.5, 0.5, 4) && Number.isInteger(t.cq) && t.cq >= -8 && t.cq <= 8 && s(t.d, 0.5, -2, 2), `${where}: meta fuera de las perillas`);
      for (const k of ['a', 'b', 'c', 'd']) {
        const key = k === 'c' ? 'cq' : k, start = { a: 1, b: 1, cq: 0, d: 0 }[key];
        if (!r.knobs.includes(k)) assert.equal(t[key], start, `${where}: ${k} cambia pero no tiene perilla`);
      }
    }
  }
});
