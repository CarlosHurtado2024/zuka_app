// TeX que se dibuja en el lienzo (js/games/formula.js): todo comando con barra que aparezca en los parámetros de los juegos del
// Preuniversitario tiene que ser uno que formula.js sabe dibujar; si no, sale escrito con letras («negp vee negq»). Lo encontró
// la revisión fresca del componente de razonamiento (2026-11-19).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds|guia/.test(f));
const ctx = loadScripts(all);
const SYM = get(ctx, 'TEX_SYM'), SPACE = get(ctx, 'TEX_SPACE');
const KNOWN = new Set([...Object.keys(SYM), ...Object.keys(SPACE), 'frac', 'tfrac', 'dfrac', 'sqrt', 'text', 'mathrm', 'textbf', 'mathbf',
  'operatorname', 'mathbb', 'left', 'right', 'big', 'Big', 'overline', 'bar']);

const strings = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
  return out;
};

test('los comandos TeX de los juegos del Preuniversitario se dibujan en el lienzo', () => {
  const course = get(ctx, 'COURSES').find(c => c.id === 'preuda');
  const exs = course.units.flatMap(u => [...u.lessons.flatMap(l => l.ex || []), ...(u.exam?.items || []).map(i => i.ex)]);
  const bad = new Set();
  exs.filter(e => e && e.params).forEach(e => strings(e.params).forEach(s => {
    for (const m of s.matchAll(/\\([A-Za-z]+)/g)) if (!KNOWN.has(m[1])) bad.add(`${e.game}: \\${m[1]}`);
  }));
  assert.deepEqual([...bad], []);
});

test('arma-negacion acepta las respuestas conmutadas (¬q ∨ ¬p, 7 + 3x…) que trae alt', () => {
  const g = get(ctx, 'GAMES')['arma-negacion'];
  const course = get(ctx, 'COURSES').find(c => c.id === 'preuda');
  const rounds = course.units.flatMap(u => [...u.lessons.flatMap(l => l.ex || []), ...(u.exam?.items || []).map(i => i.ex)])
    .filter(e => e && e.game === 'arma-negacion').flatMap(e => e.params.rounds).filter(r => r.alt);
  assert.ok(rounds.length >= 8);
  rounds.forEach(r => r.alt.forEach(a => assert.ok(g.grade({ rounds: [{ f: a }] }, { rounds: [r] }).ok, JSON.stringify(a))));
});
