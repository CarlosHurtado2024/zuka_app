// Preuniversitario UdeA · lección pu-cm-1 «Enteros, signos y jerarquía» (spec 2026-11-18-preuda-enteros): tres juegos
// nuevos (salta-recta, voltea-flecha, capas-operacion), la lección y su video (video/preuda-cosmos, sin reloj abajo).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const html = read('index.html'), sw = read('sw.js');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const GAMES = get(ctx, 'GAMES'), GUIDES = get(ctx, 'GUIDES'), GUIDE_ARCADE = get(ctx, 'GUIDE_ARCADE');
const C = get(ctx, 'COURSES').find(c => c.id === 'preuda');
const L = C.units.flatMap(u => u.lessons).find(l => l.id === 'pu-cm-1');
const exOf = g => L.ex.filter(e => e.game === g);
const items = g => exOf(g).flatMap(e => e.params.rounds.flatMap(r => r.items));
const NEW = ['globo-lastre', 'voltea-flecha', 'capas-operacion'];
const rounds = g => exOf(g).flatMap(e => e.params.rounds);

test('los tres juegos nuevos existen, están registrados y con guía; se juegan arrastrando, no con botones', () => {
  for (const g of NEW) {
    assert.ok(GAMES[g], g);
    assert.ok(html.includes(`src="js/games/${g}.js"`) && sw.includes(`'js/games/${g}.js'`), `${g} registrado`);
    assert.ok(GUIDES[g]?.length >= 1, `${g}: guía`);
    assert.ok(['drag', 'slide'].includes(GUIDES[g][0][0]), `${g}: el gesto es arrastrar`);
    const src = read(`js/games/${g}.js`);
    assert.match(src, /\n    drag\(G/, `${g}: tiene arrastre`);
    assert.ok(!/drawBtn\(/.test(src), `${g}: sin botones de fila`);
  }
});

test('la lección: ocho ejercicios distintos con los tres juegos propios; todos con pista y explicación', () => {
  assert.equal(L.ex.map(e => e.game).join(), 'recta-espejo,globo-lastre,ascensor,tren-ordenado,voltea-flecha,pares-negativos,capas-operacion,salta-signos');
  assert.ok([...GUIDE_ARCADE].includes('capas-operacion'));
  for (const e of L.ex) {
    assert.ok(e.hint?.length > 20 && e.explain?.length > 20, e.game);
    assert.ok(e.params.rounds.length >= 1);
  }
  assert.ok(exOf('capas-operacion')[0].params.rounds.every(r => r.title && r.items.length >= 2));
  for (const g of ['globo-lastre', 'voltea-flecha']) assert.ok(rounds(g).length >= 4 && rounds(g).length <= 5, `${g}: de cuatro a cinco pestañas`);
  assert.ok(L.clip.scenes.length >= 6, 'las escenas de respaldo cuentan el video');
});

test('globo-lastre: globos +1 y sacos −1; cada ronda se gana con su única acción y hay de las cuatro', () => {
  const g = GAMES['globo-lastre'], R = rounds('globo-lastre');
  for (const r of R) {
    const k = g.need(r);
    assert.ok(Number.isInteger(k) && k >= 1 && k <= g.maxK(r), JSON.stringify(r));
    assert.equal(g.alt(r, k), r.target);
    for (let i = 0; i <= k; i++) assert.ok(Math.abs(g.alt(r, i)) <= 8, 'cabe en la escala');
    assert.ok(r.g <= 8 && r.s <= 8);
  }
  assert.ok(g.grade({ rounds: R.map(x => ({ k: g.need(x) })) }, { rounds: R }).ok);
  assert.equal(g.grade({ rounds: [] }, { rounds: R }).ok, false);
  assert.equal(new Set(R.map(r => r.act)).size, 4);
  // Soltar sacos (restar negativos) sube; soltar globos baja.
  assert.equal(g.alt({ g: 1, s: 6, act: 'remS' }, 4), -1);
  assert.equal(g.alt({ g: 6, s: 2, act: 'remG' }, 5), -1);
  assert.equal(g.expr({ g: 1, s: 6, act: 'remS' }, 4), '−5 − (−4) = −1');
});

test('voltea-flecha: el multiplicador entero (de −6 a 6) lleva la flecha al aro; hay de los tres casos con negativos', () => {
  const g = GAMES['voltea-flecha'], R = rounds('voltea-flecha');
  for (const r of R) {
    const b = r.target / r.a;
    assert.ok(Number.isInteger(b) && Math.abs(b) >= 2 && Math.abs(b) <= 6, JSON.stringify(r));
    assert.ok(Math.abs(r.target) <= g.range(r), 'el aro cabe en la recta');
  }
  assert.ok(g.grade({ rounds: R.map(r => ({ b: r.target / r.a })) }, { rounds: R }).ok);
  assert.ok(!g.grade({ rounds: R.map(() => ({ b: 1 })) }, { rounds: R }).ok);
  const sg = r => `${Math.sign(r.a)}${Math.sign(r.target / r.a)}`;
  assert.ok(R.some(r => sg(r) === '-1-1') && R.some(r => sg(r) === '1-1') && R.some(r => sg(r) === '-11'), 'negativo por negativo, y los dos mixtos');
});

test('capas-operacion: solo deja la operación que va primero y explica por qué; al final da el valor correcto', () => {
  const g = GAMES['capas-operacion'];
  const val = expr => Function(`return (${expr.replace(/\^/g, '**')})`)();
  const run = expr => { let tk = g.parse(expr); let guard = 0; while (tk.length > 1 && guard++ < 30) tk = g.apply(tk, g.legal(tk)[0]); return tk; };
  // Reglas: paréntesis, potencia, × ÷ de izquierda a derecha, + − de izquierda a derecha.
  let tk = g.parse('6 + 2 * ( 5 - 8 ) ^ 2');
  const opAt = (tk, s) => tk.findIndex(t => t.op === s);
  assert.equal(g.legal(tk).join(), String(opAt(tk, '-')), 'primero el paréntesis');
  assert.match(g.why(tk, opAt(tk, '+')), /paréntesis/i);
  tk = g.apply(tk, opAt(tk, '-'));
  assert.equal(g.show(tk), '6 + 2 × (−3)²', 'el paréntesis con un solo número queda como (−3)');
  assert.match(g.why(tk, opAt(tk, '*')), /potencia/i);
  tk = g.apply(tk, opAt(tk, '^'));
  assert.match(g.why(tk, opAt(tk, '+')), /×|multiplica/);
  // Dos pasos correctos a la vez: la potencia de afuera y el paréntesis.
  tk = g.parse('3 ^ 2 - 4 * ( 1 - 3 )');
  assert.equal(g.legal(tk).join(), [opAt(tk, '^'), tk.findIndex((t, k) => t.op === '-' && k > 5)].join());
  assert.match(g.why(tk, opAt(tk, '*')), /paréntesis/i);
  tk = g.parse('20 / 4 * 5 - 3');
  assert.equal(g.legal(tk).join(), String(opAt(tk, '/')), 'izquierda a derecha');
  assert.match(g.why(tk, opAt(tk, '*')), /izquierda/i);
  for (const it of items('capas-operacion')) {
    const end = run(it.expr);
    assert.equal(end.length, 1, it.expr);
    assert.equal(end[0].n, val(it.expr), it.expr);
    assert.ok(g.ok({ tk: end }, it) && !g.ok({ tk: g.parse(it.expr) }, it));
    assert.ok(g.parse(it.expr).length <= 13, `${it.expr}: cabe en el celular`);
  }
  assert.ok(items('capas-operacion').some(it => it.expr.includes('^')) && items('capas-operacion').some(it => it.expr.includes('(')));
});

test('los ejemplos del video no salen en los ejercicios', () => {
  const ex = JSON.stringify(L.ex);
  for (const s of ['5 - 7', '3 - 7', '8 - 2']) assert.ok(!ex.includes(s), s);
  // Video: −4 + 6, 5 + (−8), 3 − 7, 2 − (−5), 3 · 4, (−3) · 4, (−3)(−4).
  const G = GAMES['globo-lastre'];
  for (const r of rounds('globo-lastre')) assert.ok(!['−4 + 6 = 2', '5 + (−8) = −3', '3 − 7 = −4', '2 − (−5) = 7'].includes(G.expr(r, G.need(r))));
  for (const r of rounds('voltea-flecha')) assert.ok(!(Math.abs(r.a) === 3 && Math.abs(r.target) === 12), JSON.stringify(r));
});

test('el video: proyecto preuda-cosmos, película enteros de 4 a 5 minutos, sin reloj ni barra de tiempo abajo', () => {
  const dir = 'video/preuda-cosmos';
  const kit = read(`${dir}/kit.js`), hud = kit.slice(kit.indexOf('function hud('), kit.indexOf('function caption('));
  assert.ok(!/t = '|toFixed\(2\)|fillRect\(70, 17/.test(hud), 'sin reloj ni barra de avance');
  assert.match(hud, /PREUNIVERSITARIO/);
  const D = require(`../${dir}/films/enteros.data.js`), film = read(`${dir}/films/enteros.js`);
  assert.equal(D.LESSON, 'pu-cm-1');
  assert.ok(D.DUR >= 240 && D.DUR <= 300, String(D.DUR));
  assert.equal(D.SCENES.length, 10);
  for (const s of D.SCENES) {
    assert.ok(film.includes(`\n  ${s.id}(t) {`), `falta la escena ${s.id}`);
    s.caps.forEach(([a, b, title, sub], i) => {
      assert.ok(a >= 0.5 && b <= s.dur - 0.4 && b - a >= 5 && title.length <= 36 && sub.length <= 58, `${s.id}: ${title}`);
      if (i) assert.ok(a >= s.caps[i - 1][1] + 0.3);
    });
    for (const [a, b, txt] of s.narr) assert.ok(txt.split(/\s+/).length / (b - a) <= 3.4, `${s.id}: ${txt.slice(0, 40)}`);
  }
  const txt = D.SCENES.flatMap(s => [...s.caps.flatMap(c => c.slice(2)), ...s.narr.map(n => n[2])]).join(' ');
  assert.ok(!/[¿?]/.test(txt), 'sin preguntas al espectador');
  for (const w of ['recta', 'opuesto', 'deuda', 'vuelta', 'signos', 'paréntesis', 'potencia', 'izquierda a derecha']) assert.ok(txt.toLowerCase().includes(w), w);
  assert.doesNotThrow(() => new (require('vm').Script)(film));
  // La matemática del video.
  assert.ok(-4 + 6 === 2 && 3 - 7 === -4 && 2 - (-5) === 7 && (-3) * 4 === -12 && (-3) * (-4) === 12 && (-1) * (-2) * (-3) === -6);
  assert.ok(8 - 2 * (5 - 7) ** 2 === 0 && (8 - 2) * (5 - 7) ** 2 === 24 && (-2) ** 2 === 4 && -(2 ** 2) === -4);
});
