// Arma la cuenta (todos los cursos; reemplaza a los ejercicios de escribir un número; spec 2026-11-17-sin-escribir):
// en vez de teclear el resultado, el estudiante PLANTEA la cuenta. Hay fichas con números (los datos del problema y
// algunos que sobran o despistan) y fichas de operación (+ − × ÷ ( ) ^ √). Se tocan en orden para escribir la
// operación en la pizarra y el juego la calcula en vivo. Pensar es decidir qué datos van y cómo se combinan; la
// aritmética la hace el juego. Vale cualquier cuenta que dé el resultado. «⌫» borra la última ficha.
// params = { rounds: [{ sol: [fichas de una cuenta correcta], traps: [fichas que sobran], answer, unit?, tol? }] }
//   Fichas de número: '7', '-3', '200000', '5/6', '0.4', 'π', 'π/2', 'sen(30°)', 'cos(60°)', 'tan(45°)', 'log(30)', 'ln(2)'.
//   Operaciones en `sol`: + - * / ( ) ^ y r (raíz cuadrada de lo que sigue).
// state = { rounds: [{ seq: [índice de ficha] }] }   (las fichas: primero los números, barajados; luego las operaciones)

GAMES['arma-la-cuenta'] = (() => {
  const OPS = ['+', '-', '*', '/', '(', ')', '^', 'r'], OP_TXT = { '+': '+', '-': '−', '*': '×', '/': '÷', '(': '(', ')': ')', '^': '^', r: '√' };
  const MAX = 21;
  const isOp = k => OPS.includes(k);
  const hasOp = t => t.some(k => ['+', '-', '*', '/', '^', 'r'].includes(k));   // los paréntesis solos no son una operación

  // Valor de una ficha de número.
  function tileValue(t) {
    const s = String(t).replace(/\s/g, '').replace(/−/g, '-');
    let m;
    if (s === 'π') return Math.PI;
    if ((m = s.match(/^π\/(\d+)$/))) return Math.PI / +m[1];
    if ((m = s.match(/^(sen|cos|tan)\((-?\d+(?:\.\d+)?)°\)$/))) { const a = +m[2] * Math.PI / 180; return +({ sen: Math.sin, cos: Math.cos, tan: Math.tan })[m[1]](a).toFixed(12); }
    if ((m = s.match(/^log\((\d+(?:\.\d+)?)\)$/))) return Math.log10(+m[1]);
    if ((m = s.match(/^ln\((\d+(?:\.\d+)?)\)$/))) return Math.log(+m[1]);
    if ((m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/))) return +m[1] / +m[2];
    return /^-?\d+(\.\d+)?$/.test(s) ? +s : NaN;
  }
  // Cómo se lee una ficha: menos tipográfico, miles separados, «sen 30°».
  function tileText(t) {
    if (isOp(t)) return OP_TXT[t];
    return String(t).replace(/-/g, '−').replace(/\((\d[\d.]*°?)\)/, ' $1').replace(/\d{5,}/g, d => d.replace(/\B(?=(\d{3})+$)/g, ' '));
  }
  // Calcula una cuenta (lista de fichas) con las reglas de siempre: paréntesis, potencias y raíces, × ÷, + −.
  // Devuelve NaN si la cuenta no está bien escrita.
  function evaluate(tokens) {
    let i = 0;
    const peek = () => tokens[i];
    function atom() {
      const t = tokens[i++];
      if (t === '(') { const v = expr(); if (tokens[i++] !== ')') throw 0; return v; }
      if (t === undefined || isOp(t)) throw 0;
      return tileValue(t);
    }
    const unary = () => (peek() === 'r' ? (i++, Math.sqrt(unary())) : atom());
    function factor() { const b = unary(); if (peek() === '^') { i++; return Math.pow(b, factor()); } return b; }
    function term() { let v = factor(); while (peek() === '*' || peek() === '/') v = tokens[i++] === '*' ? v * factor() : v / factor(); return v; }
    function expr() { let v = term(); while (peek() === '+' || peek() === '-') v = tokens[i++] === '+' ? v + term() : v - term(); return v; }
    try { const v = expr(); return i === tokens.length && Number.isFinite(v) ? v : NaN; } catch { return NaN; }
  }
  const numbersOf = r => [...new Set([...r.sol.filter(t => !isOp(t)), ...(r.traps || [])])];
  // Las fichas de la ronda: los números barajados (siempre igual para la misma ronda) y luego las operaciones.
  function keysOf(r) {
    const nums = numbersOf(r), o = shuffledOrder(nums.length, r.sol.join(' '));
    return [...o.map(i => nums[i]), ...OPS];
  }
  const tokensOf = (s, r) => { const k = keysOf(r); return (s?.seq || []).map(i => k[i]); };
  const valueOf = (s, r) => evaluate(tokensOf(s, r));
  const tolOf = r => r.tol ?? 1e-6 * Math.max(1, Math.abs(r.answer));
  const numText = (v, r) => {
    const d = r?.digits >= 0.005 ? 2 : r?.digits >= 0.0005 ? 3 : 4, s = String(+(+v).toFixed(d));
    const [a, b] = s.replace('-', '').split('.');
    return (v < 0 ? '−' : '') + (a.length > 4 ? a.replace(/\B(?=(\d{3})+$)/g, ' ') : a) + (b ? '.' + b : '');
  };
  // La cuenta como texto: los negativos que siguen a una operación van entre paréntesis.
  function exprText(tokens) {
    return tokens.map((t, i) => {
      // Entre paréntesis lo que se leería mal: un negativo tras una operación o elevado, y una fracción que divide o va con potencia.
      const s = tileText(t), prev = tokens[i - 1], next = tokens[i + 1];
      const neg = s.startsWith('−') && ((prev !== undefined && prev !== '(') || next === '^');
      const frac = s.includes('/') && (prev === '/' || prev === '^' || next === '^');
      return !isOp(t) && (neg || frac) ? `(${s})` : s;
    }).join(' ').replace(/√ /g, '√').replace(/\( /g, '(').replace(/ \)/g, ')').replace(/ \^ /g, '^');
  }
  // Una ficha de número en TeX: fracciones apiladas, π, «sen 30°», miles separados.
  function tileTex(t) {
    const s = String(t).replace(/−/g, '-'); let m;
    if ((m = s.match(/^(sen|cos|tan)\((-?[\d.]+)°\)$/))) return `\\operatorname{${m[1]}}${m[2]}^{\\circ}`;
    if ((m = s.match(/^(log|ln)\(([\d.]+)\)$/))) return `\\${m[1]} ${m[2]}`;
    if ((m = s.match(/^(-?)(π|[\d.]+)\/([\d.]+)$/))) return `${m[1]}\\frac{${m[2] === 'π' ? '\\pi' : m[2]}}{${m[3]}}`;
    if (s === 'π') return '\\pi';
    return s.replace(/\d{5,}/g, d => d.replace(/\B(?=(\d{3})+$)/g, '\\,'));
  }
  // La cuenta en TeX (misma gramática que evaluate): potencias arriba, raíces con su barra, negativos entre
  // paréntesis donde hace falta. Devuelve null si la cuenta aún no está bien escrita.
  function exprTex(tokens) {
    let i = 0;
    const peek = () => tokens[i], par = b => (b.neg ? `(${b.tex})` : b.tex);
    function atom() {
      const t = tokens[i++];
      if (t === '(') { const e = expr(); if (tokens[i++] !== ')') throw 0; return { tex: `(${e.tex})`, inner: e.tex }; }
      if (t === undefined || isOp(t)) throw 0;
      const tx = tileTex(t);
      return { tex: tx, neg: tx.startsWith('-'), frac: tx.includes('\\frac'), fn: /operatorname|\\ln|\\log/.test(tx) };
    }
    function unary() { if (peek() === 'r') { i++; const u = unary(); return { tex: `\\sqrt{${u.inner ?? u.tex}}`, root: true }; } return atom(); }
    function factor() {
      const b = unary();
      if (peek() !== '^') return b;
      i++; const e = factor();
      // Entre paréntesis lo que, elevado, se leería distinto de lo que se calcula: negativos, fracciones, raíces y «sen 30°».
      return { tex: `{${b.neg || b.frac || b.root || b.fn ? `(${b.tex})` : b.tex}}^{${e.inner ?? e.tex}}` };
    }
    function term() { const f = factor(); let tex = f.tex; while (peek() === '*' || peek() === '/') tex += (tokens[i++] === '*' ? ' \\times ' : ' \\div ') + par(factor()); return { tex, neg: f.neg && tex === f.tex, lead: f.neg }; }
    function expr() { const f = term(); let tex = f.tex; while (peek() === '+' || peek() === '-') { const op = tokens[i++] === '+' ? ' + ' : ' - ', n = term(); tex += op + (n.lead ? n.tex.replace(/^(-(?:\\frac\{[^{}]*\}\{[^{}]*\}|[\d.,\\]+))/, '($1)') : n.tex); } return { tex, neg: f.neg && tex === f.tex }; }
    try { const e = expr(); return i === tokens.length ? e.tex : null; } catch { return null; }
  }
  const numTex = (v, r) => numText(v, r).replace(/ /g, '\\,').replace('−', '-');
  const unitTex = r => { if (!r.unit) return ''; if (r.unit === '°') return '^{\\circ}'; const m = String(r.unit).match(/^(.*?)([²³])$/); return m ? `\\text{ ${m[1]}}^{${m[2] === '²' ? 2 : 3}}` : `\\text{ ${r.unit}}`; };
  const withUnit = (txt, r) => (r.unit ? `${txt}${r.unit === '°' ? '' : ' '}${r.unit}` : txt);

  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ seq: [] }),
    // Una ficha suelta no es una cuenta: si la solución tiene varias fichas, hay que plantear al menos una operación
    // (a veces un dato del problema vale lo mismo que la respuesta).
    ok: (s, r) => { const t = tokensOf(s, r), v = evaluate(t); return Number.isFinite(v) && Math.abs(v - r.answer) <= tolOf(r) && (r.sol.length === 1 || hasOp(t)); },
    answered: (s, r) => { const t = tokensOf(s, r); return Number.isFinite(evaluate(t)) && (r.sol.length === 1 || hasOp(t)); },
    solution: r => { const tx = exprTex(r.sol); return tx ? `$${tx} = ${numTex(r.answer, r)}${unitTex(r)}$` : `${exprText(r.sol)} = ${withUnit(numText(r.answer, r), r)}`; },
    prompt: () => 'Plantea la cuenta con las fichas: el juego la calcula',
    foot: (r, s) => (s.seq.length ? 'Cuando sea la cuenta que responde la pregunta, comprueba' : 'Sobran fichas: elige solo los datos que sirven'),
    layout(G) {
      const { W, H } = G, n = Math.max(...G.params.rounds.map(r => numbersOf(r).length)), cols = Math.min(4, n), tw = (W - 24 - (cols - 1) * 8) / cols;
      G.rows = Math.ceil(n / cols);
      const y0 = H - 64 - 46 - G.rows * 46;
      G.num = i => ({ x: 12 + (i % cols) * (tw + 8), y: y0 + Math.floor(i / cols) * 46, w: tw, h: 38 });
      const ow = (W - 24 - 7 * 6) / 8;
      G.op = j => ({ x: 12 + j * (ow + 6), y: H - 64 - 38, w: ow, h: 36 });
      G.board = { x: 12, y: 88, w: W - 24, h: Math.max(84, y0 - 100) };
      G.del = { x: W - 12 - 46, y: G.board.y + G.board.h - 34, w: 40, h: 28 };
    },
    draw(G) {
      const { p, C, W, s, r } = G, keys = keysOf(r), nNum = keys.length - OPS.length, toks = tokensOf(s, r), v = evaluate(toks), b = G.board;
      // La pizarra con la cuenta y su resultado.
      p.noStroke(); p.fill(shade(C.card, 0.82)); p.rect(b.x, b.y + 3, b.w, b.h, 14);
      p.stroke(G.locked ? (game.grade({ rounds: [s] }, { rounds: [r] }).ok ? C.ok : C.bad) : C.line); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 14);
      p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
      if (!toks.length) { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Toca las fichas para escribir la cuenta', W / 2, b.y + b.h / 2, b.w - 24, 13); }
      else {
        const txt = exprText(toks), tx = exprTex(toks);
        p.fill(C.ink); p.textSize(19);
        // Cuenta completa: se dibuja como fórmula. A medias, como texto (se va escribiendo ficha a ficha).
        if (tx && typeof drawFormulaCtx === 'function') drawFormulaCtx(p.drawingContext, `$${tx}$`, W / 2, b.y + 28, { size: 21, maxW: b.w - 24, maxH: 44, weight: 700 });
        else
        // Una cuenta larga se parte en dos renglones por la mitad.
        if (p.textWidth(txt) > b.w - 24 && toks.length > 6) {
          const h = Math.ceil(toks.length / 2);
          fitText(p, exprText(toks.slice(0, h)), W / 2, b.y + 17, b.w - 24, 16); fitText(p, exprText(toks.slice(h)), W / 2, b.y + 37, b.w - 24, 16);
        } else fitText(p, txt, W / 2, b.y + 27, b.w - 24, 19);
        const okV = Number.isFinite(v);
        p.fill(okV ? C.N : C.mute); p.textStyle(okV ? p.BOLD : p.NORMAL);
        fitText(p, okV ? `= ${withUnit(numText(v, r), r)}` : s.seq.length >= MAX ? 'No caben más fichas: borra con ⌫' : 'Sigue: así la cuenta no se puede calcular', W / 2 - (okV ? 0 : 0), b.y + b.h - 22, b.w - 110, okV ? 22 : 12);
        if (!G.locked) drawTile(p, C, G.del, '⌫', { fill: C.coral, size: 14, r: 8, lift: 2 });
      }
      // Fichas de números y de operaciones.
      for (let i = 0; i < nNum; i++) drawTile(p, C, G.num(i), `$${tileTex(keys[i])}$`, { size: 17, lift: 3 });
      OPS.forEach((o, j) => drawTile(p, C, G.op(j), OP_TXT[o], { fill: C.sky, size: 17, r: 9, lift: 2 }));
    },
    press(G, x, y) {
      const keys = keysOf(G.r), nNum = keys.length - OPS.length, s = G.s;
      if (s.seq.length && hitBox(G.del, x, y)) { s.seq.pop(); G.touch(); return true; }
      let k = -1;
      for (let i = 0; i < nNum; i++) if (hitBox(G.num(i), x, y)) k = i;
      OPS.forEach((o, j) => { if (hitBox(G.op(j), x, y)) k = nNum + j; });
      if (k < 0) return false;
      if (s.seq.length < MAX) { s.seq.push(k); G.touch(); }
      return true;
    },
    peek: G => { const keys = keysOf(G.r), n = keys.length - OPS.length; return { keys, boxes: keys.map((_, i) => (i < n ? G.num(i) : G.op(i - n))), del: G.del, want: G.r.sol.map(t => keys.indexOf(t)), value: valueOf(G.s, G.r) }; },
  });
  return { ...game, evaluate, tileValue, tileText, tileTex, exprText, exprTex, keysOf, numbersOf, OPS };
})();
