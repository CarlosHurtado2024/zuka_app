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
  const pieces = G => {
    const keys = keysOf(G.r), n = keys.length - OPS.length;
    return keys.map((k, i) => ({ ...((i < n) ? G.num(i) : G.op(i - n)), label: i < n ? `$${tileTex(k)}$` : OP_TXT[k] }));
  };
  const add = (G, i) => {
    if (G.s.seq.length < MAX) { G.s.seq.push(i); G.touch(); }
  };

  const game = roundsGame({
    aspect: 1.02,
    init: () => ({ seq: [] }),
    // Una ficha suelta no es una cuenta: si la solución tiene varias fichas, hay que plantear al menos una operación
    // (a veces un dato del problema vale lo mismo que la respuesta).
    ok: (s, r) => { const t = tokensOf(s, r), v = evaluate(t); return Number.isFinite(v) && Math.abs(v - r.answer) <= tolOf(r) && (r.sol.length === 1 || hasOp(t)); },
    answered: (s, r) => { const t = tokensOf(s, r); return Number.isFinite(evaluate(t)) && (r.sol.length === 1 || hasOp(t)); },
    solution: r => { const tx = exprTex(r.sol); return tx ? `$${tx} = ${numTex(r.answer, r)}${unitTex(r)}$` : `${exprText(r.sol)} = ${withUnit(numText(r.answer, r), r)}`; },
    prompt: () => 'Construye la operación',
    keyboard: 'Usa las flechas para elegir una pieza, espacio para añadirla y retroceso para quitar la última.',
    foot: (r, s) => (s.seq.length ? 'Cuando sea la cuenta que responde la pregunta, comprueba' : 'Sobran fichas: elige solo los datos que sirven'),
    layout(G) {
      const { W, H } = G, n = Math.max(...G.params.rounds.map(r => numbersOf(r).length)), cols = Math.min(4, n), tw = (W - 24 - (cols - 1) * 8) / cols;
      G.rows = Math.ceil(n / cols);
      const y0 = H - 72 - G.rows * 40;
      G.num = i => ({ x: 12 + (i % cols) * (tw + 8), y: y0 + Math.floor(i / cols) * 40, w: tw, h: 33 });
      const ow = (W - 24 - 7 * 6) / 8;
      G.op = j => ({ x: 12 + j * (ow + 6), y: H - 63, w: ow, h: 34 });
      G.board = { x: 12, y: 84, w: W - 24, h: y0 - 93 };
      G.del = { x: W - 12 - 42, y: G.board.y + G.board.h - 34, w: 35, h: 28 };
    },
    draw(G) {
      const { p, C, W, s, r } = G, toks = tokensOf(s, r), v = evaluate(toks), b = G.board, tray = pieces(G);
      // La pizarra con la cuenta y su resultado.
      const border = G.locked ? (game.grade({ rounds: [s] }, { rounds: [r] }).ok ? C.ok : C.bad) : G.piece ? C.brand : C.line;
      drawPracticePanel(p, b, C.card, border, 11);
      p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
      if (!toks.length) { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Arrastra aquí las piezas de tu cuenta', W / 2, b.y + b.h / 2, b.w - 24, 14); }
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
        fitText(p, okV ? `= ${withUnit(numText(v, r), r)}` : s.seq.length >= MAX ? 'Puedes quitar la última pieza' : 'Operación en construcción', W / 2, b.y + b.h - 22, b.w - 100, okV ? 22 : 12);
        if (!G.locked) drawTile(p, C, G.del, '⌫', { fill: C.coral, size: 14, r: 8, lift: 2 });
      }
      tray.forEach((tile, i) => drawTile(p, C, tile, tile.label, {
        fill: i >= tray.length - OPS.length ? C.bg : C.card,
        ring: G.focus === i || G.piece?.i === i ? C.brand : undefined, size: 16,
      }));
      if (G.piece?.dragged) {
        const { i, x, y } = G.piece, tile = tray[i];
        drawTile(p, C, { x: x - tile.w / 2, y: y - 17, w: tile.w, h: 34 }, tile.label, { ring: C.brand, size: 16 });
      }
    },
    press(G, x, y) {
      delete G.focus;
      if (G.s.seq.length && hitBox(G.del, x, y)) { G.s.seq.pop(); G.touch(); return true; }
      const i = pieces(G).findIndex(tile => hitBox(tile, x, y));
      if (i < 0) return false;
      G.piece = { i, x, y, x0: x, y0: y, dragged: false };
      return true;
    },
    drag(G, x, y) {
      if (!G.piece) return false;
      Object.assign(G.piece, { dragged: G.piece.dragged || Math.hypot(x - G.piece.x0, y - G.piece.y0) >= 6, x, y });
      return true;
    },
    release(G, x, y) {
      const piece = G.piece;
      G.piece = null;
      if (piece && (hitBox(G.board, x, y) || (!piece.dragged && hitBox(pieces(G)[piece.i], x, y)))) add(G, piece.i);
    },
    cancel(G) { G.piece = null; },
    key(G, key) {
      if (key === 'Backspace') { if (G.s.seq.length) { G.s.seq.pop(); G.touch(); } return true; }
      if (key === ' ' || key === 'Enter') { G.focus ??= 0; add(G, G.focus); return true; }
      if (!['ArrowLeft', 'ArrowRight'].includes(key)) return false;
      const n = pieces(G).length;
      G.focus = G.focus == null ? 0 : (G.focus + n + (key === 'ArrowRight' ? 1 : -1)) % n;
      return true;
    },
    demo(G) {
      const a = G.num(0), b = G.board;
      return { from: { x: a.x + a.w / 2, y: a.y + a.h / 2 }, to: { x: b.x + b.w / 2, y: b.y + b.h / 2 } };
    },
    peek: G => { const keys = keysOf(G.r), n = keys.length - OPS.length; return { keys, boxes: keys.map((_, i) => (i < n ? G.num(i) : G.op(i - n))), del: G.del, want: G.r.sol.map(t => keys.indexOf(t)), value: valueOf(G.s, G.r) }; },
  });
  return { ...game, evaluate, tileValue, tileText, tileTex, exprText, exprTex, keysOf, numbersOf, OPS };
})();
