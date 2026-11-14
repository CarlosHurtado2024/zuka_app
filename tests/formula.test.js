// Fórmulas en el lienzo (spec 2026-11-18-formulas-tex): TeX y textos con símbolos dibujados como matemática.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const ctx = loadScripts(['js/games/kit.js', 'js/games/formula.js', 'js/games/arma-la-cuenta.js', 'js/games/escala-solucion.js']);
const parseTex = get(ctx, 'parseTex'), plainToTex = get(ctx, 'plainToTex'), wanted = get(ctx, 'formulaWanted'), texify = get(ctx, 'texify');
const layoutTex = get(ctx, 'layoutTex'), drawFormulaCtx = get(ctx, 'drawFormulaCtx'), GAMES = get(ctx, 'GAMES');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
// Lienzo de mentira: cada letra mide medio tamaño de ancho; anota lo que se escribe y dónde.
function fake() {
  const calls = [];
  const t = { font: '10px x', calls, measureText: s => ({ width: String(s).length * parseFloat(/(\d+(?:\.\d+)?)px/.exec(t.font)[1]) * 0.5 }), fillText: (s, x, y) => calls.push({ s, x, y, font: t.font }), fillRect: (x, y, w, h) => calls.push({ bar: true, x, y, w, h }) };
  return new Proxy(t, { get: (o, k) => (k in o ? o[k] : () => {}), set: (o, k, v) => { o[k] = v; return true; } });
}
const kinds = n => (n.t === 'row' ? n.c.map(kinds).join(' ') : n.t === 'sym' ? `${n.cls}:${n.s}` : n.t === 'frac' ? `frac(${kinds(n.n)}|${kinds(n.d)})` : n.t === 'script' ? `${kinds(n.base)}^(${n.sup ? kinds(n.sup) : ''})_(${n.sub ? kinds(n.sub) : ''})` : n.t === 'sqrt' ? `sqrt[${n.idx ? kinds(n.idx) : ''}](${kinds(n.b)})` : n.t);

test('parseTex entiende fracciones, potencias, subíndices, raíces, funciones y símbolos', () => {
  assert.equal(kinds(parseTex('\\frac{3}{4}')), 'frac(ord:3|ord:4)');
  assert.equal(kinds(parseTex('x^2')), 'var:x^(ord:2)_()');
  assert.equal(kinds(parseTex('a_{n+1}^2')), 'var:a^(ord:2)_(var:n op:+ ord:1)');
  assert.equal(kinds(parseTex('\\sqrt[3]{27}')), 'sqrt[ord:3](ord:27)');
  assert.equal(kinds(parseTex('\\operatorname{sen}\\theta\\le 1')), 'fn:sen var:θ rel:≤ ord:1');
  assert.equal(kinds(parseTex('2\\cdot 3-1')), 'ord:2 op:· ord:3 op:− ord:1');
  assert.equal(kinds(parseTex('\\left(\\tfrac12\\right)')), 'open:( frac(ord:1|ord:2) close:)');
  assert.equal(kinds(parseTex('200\\,000\\text{ km}')), 'ord:200 space ord:000 text: km');
  assert.equal(kinds(parseTex('\\mathbb{R}')), 'ord:ℝ');
  // Lo que no entiende no rompe nada.
  for (const bad of ['\\frac{1', 'x^', '}{', '\\', '\\nada{x}', '^2', '$$']) assert.doesNotThrow(() => layoutTex(parseTex(bad), 16, fake()), bad);
});

test('plainToTex convierte los textos con símbolos que ya usan los juegos', () => {
  const cases = {
    'x² + 2x − 143 = 0': 'x^{2} + 2x − 143 = 0', '2^(x − 1) = 2³': '2^{x − 1} = 2^{3}', '√12 = 2√3': '\\sqrt{12} = 2\\sqrt{3}', '⁴√16 = 2': '\\sqrt[4]{16} = 2',
    'a⁻³': 'a^{-3}', '3 + 1/x²': '3 + \\frac{1}{x^{2}}', 'x = π/12 + kπ/3': 'x = \\frac{π}{12} + \\frac{kπ}{3}', 'n₁ · n₂ = 0': 'n_{1} · n_{2} = 0',
    '5π/6': '\\frac{5π}{6}', 'sen θ = √3/2': '\\operatorname{sen} θ = \\frac{\\sqrt{3}}{2}', 'g(x) = x²/2': 'g(x) = \\frac{x^{2}}{2}', 'Era a₁ = 7': '\\text{Era}\\ a_{1} = 7', '2√3/3': '\\frac{2\\sqrt{3}}{3}',
    'x = 2  o  x = 3': 'x = 2\\ \\text{o}\\ x = 3', 'Σ k², k de 1 a 4': 'Σ k^{2}, k\\ \\text{de}\\ 1\\ \\text{a}\\ 4', 'Con a = 1 y b = 2: 1² + 2² = 5': '\\text{Con}\\ a = 1\\ \\text{y}\\ b = 2: 1^{2} + 2^{2} = 5', 'x + y = 3²': 'x + y = 3^{2}',
    'θ = sen⁻¹(5/6)': 'θ = \\operatorname{sen}^{-1}(\\frac{5}{6})', '√(7² + 9²)': '\\sqrt{7^{2} + 9^{2}}', 'Aᵀ es 2 × 3': 'A^{T}\\ \\text{es}\\ 2 × 3', '½ de 3/4': '\\tfrac{1}{2}\\ \\text{de}\\ \\frac{3}{4}',
    '27^⅓ = 3': '27^{\\tfrac{1}{3}} = 3', 'a^-b': 'a^{-b}', 'h = 8 m': 'h = 8\\ \\text{m}', '1/√3': '\\frac{1}{\\sqrt{3}}', '2⁸/2²': '\\frac{2^{8}}{2^{2}}', 'x^(2)^3': 'x^{2}{}^{3}', 'θ en III': 'θ\\ \\text{en}\\ \\text{III}',
  };
  for (const [a, b] of Object.entries(cases)) assert.equal(plainToTex(a), b, a);
  // Solo se convierte lo que lo necesita: nombres, unidades y controles quedan como texto corrido.
  for (const s of ['Ronda 1 de 3', '200 km/h', '−/+', '^', 'Suma las dos: 4x = 8', '{a, b}', '4 cis 540°', 'x', '', '12', 'sen 30°']) assert.equal(wanted(s), false, s);
  for (const s of ['x²', '3/4', '√2', 'a₁', '2^(n − 1)', '$\\frac12$', 'π/6', '10^3']) assert.equal(wanted(s), true, s);
  const mathStep = get(ctx, 'mathStep');
  assert.equal(mathStep('(x − 2)(x − 3) = 0'), '$(x − 2)(x − 3) = 0$'); assert.equal(mathStep('la mayor: 3'), 'la mayor: 3'); assert.equal(mathStep('Suma las dos: 4x = 8'), '$\\text{Suma}\\ \\text{las}\\ \\text{dos}: 4x = 8$'); assert.equal(mathStep('3 filas'), '3 filas');
  assert.equal(texify('x² = 4'), '$x^{2} = 4$'); assert.equal(texify('Listo'), 'Listo'); assert.equal(texify('ya $x^2$'), 'ya $x^2$');
  assert.equal(texify('Σ (2k + 3) = 2·Σk + 12'), 'Σ (2k + 3) = 2·Σk + 12');
});

test('las cajas: la fracción se apila, el exponente sube, la raíz lleva su barra y todo cabe en el ancho pedido', () => {
  const c = fake();
  const fr = layoutTex(parseTex('\\frac{3}{4}'), 20, c); fr.draw(c, 0, 100);
  const [num, den] = c.calls.filter(k => k.s), bar = c.calls.find(k => k.bar);
  assert.ok(num.y < bar.y && den.y > bar.y + bar.h, 'numerador arriba de la raya y denominador abajo');
  assert.ok(fr.a > 14 && fr.d > 6, 'la fracción es más alta que un renglón');
  const c2 = fake(); layoutTex(parseTex('x^2'), 20, c2).draw(c2, 0, 100);
  const [x, two] = c2.calls;
  assert.ok(two.y < x.y - 5 && two.x > x.x && /14px/.test(two.font), 'el exponente va arriba, a la derecha y más pequeño');
  assert.match(x.font, /italic/, 'las variables van en cursiva'); assert.doesNotMatch(two.font, /italic/);
  // Un menos al principio es un signo (pegado); entre dos números es una resta (con aire).
  const w = s => layoutTex(parseTex(s), 20, fake()).w;
  assert.ok(w('3-1') - w('31') > w('-1') - w('1') + 4);
  // El espacio escrito separa letras y números sueltos («1 y b»), pero no añade aire junto a un + o un =.
  assert.ok(w('1 y b') > w('1yb') + 8); assert.equal(w('a = b'), w('a=b')); assert.equal(w('\\frac{1}{2} \\times 3'), w('\\frac{1}{2}\\times 3'));
  // Encoge para caber y devuelve el ancho dibujado.
  const c3 = fake(), got = drawFormulaCtx(c3, '$\\sqrt{7^2 + 9^2 - 2\\cdot 7\\cdot 9\\cdot\\cos 60^\\circ}$', 100, 50, { size: 20, maxW: 90 });
  assert.ok(got <= 90.5, `ancho ${got}`);
  const xs = c3.calls.filter(k => k.s).map(k => k.x);
  assert.ok(Math.min(...xs) >= 100 - 46 && Math.max(...xs) <= 100 + 46, 'centrado en x');
  // Texto mezclado: lo de afuera de $…$ va con la letra del juego.
  const c4 = fake(); drawFormulaCtx(c4, 'Mide $2\\sqrt{3}$ m', 0, 0, { align: 'left' });
  assert.equal(c4.calls.filter(k => k.s).map(k => k.s).join('|'), 'Mide |2|3| m');
});

test('Arma la cuenta escribe la cuenta en TeX y la respuesta sale como fórmula', () => {
  const g = GAMES['arma-la-cuenta'], tx = s => g.exprTex(s.split(' '));
  assert.equal(tx('r ( 7 ^ 2 + 9 ^ 2 )'), '\\sqrt{{7}^{2} + {9}^{2}}');
  assert.equal(tx('3/5 * -5/13'), '\\frac{3}{5} \\times (-\\frac{5}{13})');
  assert.equal(tx('( -1 ) ^ 2 + 3 * -1'), '{(-1)}^{2} + 3 \\times (-1)');
  assert.equal(tx('( 29 - 2 ) ^ 1/3'), '{(29 - 2)}^{\\frac{1}{3}}');
  assert.equal(tx('2.25 - -3.5'), '2.25 - (-3.5)');
  assert.equal(tx('7 * 200000 / 100000'), '7 \\times 200\\,000 \\div 100\\,000');
  assert.equal(tx('10 * sen(60°)'), '10 \\times \\operatorname{sen}60^{\\circ}');
  assert.equal(tx('2 +'), null); assert.equal(tx('( 2'), null);
  assert.equal(g.tileTex('-5/13'), '-\\frac{5}{13}'); assert.equal(g.tileTex('π/2'), '\\frac{\\pi}{2}'); assert.equal(g.tileTex('ln(2)'), '\\ln 2');
  const sol = g.grade({}, { rounds: [{ sol: '7 * 15 / 2'.split(' '), traps: [], answer: 52.5, unit: 'km' }] }).solution;
  assert.equal(sol, '$7 \\times 15 \\div 2 = 52.5\\text{ km}$');
  assert.equal(GAMES['escala-solucion'].grade({}, { rounds: [{ levels: [['x² = 9', 'x² = 3'], ['x = 3', 'x = 9'], ['El orden no importa', 'Sí importa']] }] }).solution, '$x^{2} = 9$  →  $x = 3$  →  El orden no importa');
});

test('carga en Safari viejo y la app sigue andando sin el motor o sin KaTeX', () => {
  assert.doesNotMatch(read('js/games/formula.js'), /\(\?<[=!]/, 'sin lookbehind: iOS < 16.4 no cargaría el archivo');
  assert.ok(read('js/app.js').includes("window.katex && typeof texify === 'function' ? texify(r.solution) : r.solution"));
  assert.ok(read('js/exam.js').includes("typeof texify === 'function' ? texify(examSolution(it.ex)) : examSolution(it.ex)"));
  const g = GAMES['arma-la-cuenta'];
  assert.equal(g.exprTex('r 4 ^ 2'.split(' ')), '{(\\sqrt{4})}^{2}'); assert.equal(g.exprTex('sen(30°) ^ 2'.split(' ')), '{(\\operatorname{sen}30^{\\circ})}^{2}');
  // Cerca del borde la fórmula se corre hacia adentro, no se encoge.
  const c = fake(); drawFormulaCtx(c, 'x² + 1', 6, 20, { size: 16, align: 'center', clamp: [4, 300] });
  assert.ok(Math.min(...c.calls.filter(k => k.s).map(k => k.x)) >= 4); assert.match(c.calls[0].font, /16px/);
});

test('está conectado: fichas y textos de los juegos, guías y respuestas', () => {
  assert.match(read('js/games/kit.js'), /formulaWanted\(txt\).*drawFormula\(p, txt, x, y, maxW, size, maxH\)/);
  assert.match(read('js/guia.js'), /formulaWanted\(txt\)\) \{ ctx\.fillStyle = col; drawFormulaCtx/);
  assert.ok(read('js/app.js').includes('texify(r.solution)')); assert.ok(read('js/exam.js').includes('texify(examSolution(it.ex))'));
  const html = read('index.html');
  assert.ok(html.indexOf('js/games/formula.js') > html.indexOf('js/games/kit.js') && html.indexOf('js/games/formula.js') < html.indexOf('js/games/cajas-numericas.js'));
  assert.ok(read('sw.js').includes("'js/games/formula.js'"));
});

test('lo que texify entrega lo entiende KaTeX: llaves parejas y solo órdenes conocidas', () => {
  const files = [...read('index.html').matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js/.test(f));
  const app = loadScripts(files), G = get(app, 'GAMES'), tf = get(app, 'texify');
  const known = /^(frac|tfrac|sqrt|text|operatorname|circ|times|div|pi|ln|log|wedge|,)$/;
  let n = 0;
  for (const c of get(app, 'COURSES')) for (const u of c.units || []) for (const l of [...(u.lessons || []), ...((u.exam?.items || []).map(i => ({ ex: [i.ex] })))]) for (const ex of l.ex || []) {
    if (ex.type !== 'play' || !G[ex.game]) continue;
    let sol = ''; try { sol = G[ex.game].grade({}, ex.params).solution || ''; } catch { continue; }   // algunos juegos viejos piden estado
    if (sol.includes('$') && !['arma-la-cuenta', 'escala-solucion'].includes(ex.game)) continue;   // ya venía en TeX, escrito a mano
    const out = tf(sol);
    for (const m of String(out).matchAll(/\$([^$]+)\$/g)) {
      n++;
      let d = 0; for (const ch of m[1].replace(/\\[{}]/g, '')) { if (ch === '{') d++; if (ch === '}') d--; assert.ok(d >= 0, `${ex.game}: ${m[1]}`); }
      assert.equal(d, 0, `${ex.game}: llaves de ${m[1]}`);
      // KaTeX no cuenta los espacios: entre dos palabras, o entre una palabra y un dato, tiene que haber «\ ».
      assert.doesNotMatch(m[1], /\\text\{[^{}]*\} +[\w\\(]|[\w)}] +\\text\{/, `${ex.game}: espacio que KaTeX se comería en ${m[1]}`);
      assert.doesNotMatch(m[1], /\}\^\{[^{}]*\}\^/, `${ex.game}: doble potencia en ${m[1]}`);
      for (const cmd of m[1].matchAll(/\\([A-Za-z]+|.)/g)) assert.ok(known.test(cmd[1]) || '{}%$#&_ '.includes(cmd[1]), `${ex.game}: \\${cmd[1]} en ${m[1]}`);
    }
  }
  assert.ok(n > 30, `se revisaron ${n} fórmulas`);
});
