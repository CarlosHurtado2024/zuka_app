// Capas de una operación (Preuniversitario UdeA, pu-cm-1; spec 2026-11-18-preuda-enteros): la jerarquía se decide,
// no se memoriza. La expresión aparece en fichas; el estudiante ARRASTRA un número sobre su vecino y el juego los opera
// (las dos fichas se funden en su resultado; para una potencia se juntan la base y el exponente). Si junta dos que
// todavía no tocan, pierde una vida y el juego le dice qué capa va antes: paréntesis, potencias, × y ÷ (de izquierda a
// derecha), + y − (de izquierda a derecha). Una fila de capas marca las que ya quedaron resueltas.
// item = { expr: '6 + 2 * ( 5 - 8 ) ^ 2' }   (fichas separadas por espacios; '-3' es un número negativo, así que
// '-3 ^ 2' sería (−3)²: para −3² se escribe '0 - 3 ^ 2')
// state del reto = { tk: [fichas], last: índice de la ficha recién calculada, log: [pasos] }
GAMES['capas-operacion'] = (() => {
  const OPS = ['+', '-', '*', '/', '^'], SYM = { '+': '+', '-': '−', '*': '×', '/': '÷', '^': '^' };
  const m = TK.minusTxt;
  const parse = expr => expr.trim().split(/\s+/).map(t => (OPS.includes(t) ? { op: t } : t === '(' || t === ')' ? { p: t } : { n: +t }));
  const depth = (tk, i) => tk.slice(0, i).reduce((d, t) => d + (t.p === '(' ? 1 : t.p === ')' ? -1 : 0), 0);
  // El grupo (entre paréntesis, o la expresión entera) al que pertenece la ficha i: [desde, hasta).
  function group(tk, i) {
    let a = i, d = 0;
    while (a > 0) { const t = tk[a - 1]; if (t.p === ')') d++; else if (t.p === '(') { if (!d) break; d--; } a--; }
    let b = i; d = 0;
    while (b < tk.length) { const t = tk[b]; if (t.p === '(') d++; else if (t.p === ')') { if (!d) break; d--; } b++; }
    return [a, b];
  }
  // Operaciones de un grupo que están en su mismo nivel (no dentro de paréntesis más adentro).
  const opsIn = (tk, [a, b]) => { const out = []; let d = 0; for (let j = a; j < b; j++) { const t = tk[j]; if (t.p === '(') d++; else if (t.p === ')') d--; else if (t.op && !d) out.push(j); } return out; };
  const nextIn = (tk, g) => {
    const ops = opsIn(tk, g);
    const pw = ops.filter(j => tk[j].op === '^'); if (pw.length) return pw;
    const md = ops.filter(j => '*/'.includes(tk[j].op)); if (md.length) return [md[0]];
    return ops.length ? [ops[0]] : [];
  };
  // Las operaciones que se pueden hacer ya: en cada grupo (un paréntesis o la expresión entera), la que sigue según la
  // jerarquía, siempre que sus dos vecinos ya sean números (si uno es un paréntesis sin resolver, ese va primero).
  // Así 3² − 4 · (1 − 3) deja hacer 3² o el paréntesis en cualquier orden: los dos son pasos correctos.
  function legal(tk) {
    const num = j => tk[j]?.n !== undefined, out = [], seen = new Set();
    tk.forEach((t, i) => {
      if (!t.op) return;
      const g = group(tk, i), key = g.join(); if (seen.has(key)) return; seen.add(key);
      const ops = opsIn(tk, g), pw = ops.filter(j => tk[j].op === '^');
      if (pw.length) { out.push(...pw.filter(j => num(j - 1) && num(j + 1))); return; }
      const md = ops.filter(j => '*/'.includes(tk[j].op)), f = md.length ? md[0] : ops[0];
      if (f !== undefined && num(f - 1) && num(f + 1)) out.push(f);
    });
    return out.sort((a, b) => a - b);
  }
  // Por qué no se puede hacer todavía la operación i ('' si sí se puede).
  function why(tk, i) {
    if (legal(tk).includes(i)) return '';
    const g = group(tk, i), mine = opsIn(tk, g), op = tk[i].op;
    // Mientras quede un paréntesis sin resolver en su grupo, ese va antes.
    if (tk.slice(g[0], g[1]).some(t => t.p === '(')) return 'Primero lo que está entre paréntesis';
    if (op !== '^' && mine.some(j => tk[j].op === '^')) return 'Las potencias van antes que × ÷ + −';
    if ('+-'.includes(op) && mine.some(j => '*/'.includes(tk[j].op))) return 'La multiplicación y la división van antes que la suma y la resta';
    return 'Del mismo nivel: de izquierda a derecha';
  }
  const calc = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? a / b : Math.pow(a, b));
  // Hace la operación i: sus dos números se vuelven uno; un paréntesis que queda con un solo número se quita.
  function apply(tk, i) {
    const r = calc(tk[i - 1].n, tk[i].op, tk[i + 1].n);
    let out = [...tk.slice(0, i - 1), { n: r, fresh: true }, ...tk.slice(i + 2)];
    for (let j = 1; j < out.length - 1; j++) if (out[j - 1].p === '(' && out[j].n !== undefined && out[j + 1].p === ')') { out = [...out.slice(0, j - 1), out[j], ...out.slice(j + 2)]; j = 0; }
    return out;
  }
  const value = expr => { let tk = parse(expr), g = 0; while (tk.length > 1 && g++ < 40) tk = apply(tk, legal(tk)[0]); return tk[0].n; };
  // La expresión como se lee: «6 + 2 × (−3)²».
  function show(tk) {
    let s = '';
    tk.forEach((t, i) => {
      if (t.op === '^') return;
      if (tk[i - 1]?.op === '^') { s += sup(t.n); return; }
      const neg = t.n < 0 && (i > 0 || tk[i + 1]?.op === '^');
      const txt = t.op ? ` ${SYM[t.op]} ` : t.p === '(' ? '(' : t.p === ')' ? ')' : neg ? `(${m(t.n)})` : m(t.n);
      s += txt;
    });
    return s.replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')').trim();
  }
  // Fichas en una sola fila centrada (un paréntesis nunca se parte): número 40 px o más, operación 32, paréntesis 14 y el
  // exponente arriba, más pequeño. Si no cabe, todo se achica por igual (G.k).
  function lay(G) {
    const tk = G.s.tk, gap = 5;
    const wOf = (t, i) => (t.op === '^' ? 0 : tk[i - 1]?.op === '^' ? 30 : t.op ? 32 : t.p ? 14 : Math.max(40, 14 + 10 * m(t.n).length));
    const tot = tk.reduce((s, t, i) => s + wOf(t, i) + (wOf(t, i) ? gap : 0), -gap);
    const k = G.k = Math.min(1, (G.W - 16) / tot), h = 44 * k, y0 = G.top + 70;
    let x = (G.W - tot * k) / 2;
    G.boxes = tk.map((t, i) => { const w = wOf(t, i) * k, up = tk[i - 1]?.op === '^', b = { x, y: up ? y0 - 16 * k : y0, w, h: up ? 30 * k : h }; if (w) x += w + gap * k; return b; });
    // El ^ se toca en el exponente: la caja del exponente sirve de botón.
    tk.forEach((t, i) => { if (t.op === '^') G.boxes[i] = G.boxes[i + 1]; });
  }
  return Object.assign(questGame({
    aspect: 1.25,
    init: it => ({ tk: parse(it.expr), last: -1, log: [] }),
    ok: (s, it) => s.tk.length === 1 && s.tk[0].n === value(it.expr),
    answer: it => ({ tk: [{ n: value(it.expr) }] }),
    solution: it => `${show(parse(it.expr))} = ${m(value(it.expr))}`,
    prompt: () => 'Junta las dos fichas que se operan primero',
    foot: () => 'Arrastra un número sobre su vecino: el juego hace la cuenta',
    layout: G => { G.grab = null; lay(G); },
    draw(G) {
      const { p, C, s } = G, tk = s.tk, g = G.grab;
      const isNum = i => tk[i]?.n !== undefined, over = g ? tk.findIndex((t, j) => j !== g.i && isNum(j) && hitBox(G.boxes[j], g.x, g.y)) : -1;
      const tile = (i, b, lifted) => {
        const t = tk[i], exp = tk[i - 1]?.op === '^', neg = t.n < 0 && !exp && (i > 0 || tk[i + 1]?.op === '^');
        drawTile(p, C, b, exp ? m(t.n) : neg ? `(${m(t.n)})` : m(t.n), { fill: exp ? C.sun : t.fresh && i === s.last ? C.mint : C.cream, size: (exp ? 14 : 18) * G.k, lift: lifted ? 5 : 2, ring: i === over ? C.brand : undefined });
      };
      tk.forEach((t, i) => {
        const b = G.boxes[i]; if (!b || t.op === '^') return;
        if (t.p) { TK.label(p, C, t.p, b.x + b.w / 2, b.y + b.h / 2, C.mute, 26 * G.k, 20); return; }
        // Las operaciones son el «pegante» entre fichas: se dibujan como signos, no como botones.
        if (t.op) { TK.label(p, C, SYM[t.op], b.x + b.w / 2, b.y + b.h / 2, C.sky, 24 * G.k, 30); return; }
        if (g && g.i === i) { p.noFill(); p.stroke(C.line); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); return; }
        tile(i, b);
      });
      // Las capas: se marca la que ya no tiene operaciones pendientes.
      const left = [tk.some(t => t.p), tk.some(t => t.op === '^'), tk.some(t => t.op === '*' || t.op === '/'), tk.some(t => t.op === '+' || t.op === '-')];
      const pw = (G.W - 24 - 18) / 4, py = G.top + 150;
      ['( )', 'xⁿ', '× ÷', '+ −'].forEach((lab, k) => {
        const b = { x: 12 + k * (pw + 6), y: py, w: pw, h: 30 };
        p.noFill(); p.stroke(left[k] ? C.line : C.ok); p.strokeWeight(left[k] ? 1.5 : 2); p.rect(b.x, b.y, b.w, b.h, 15);
        TK.label(p, C, left[k] ? lab : `${lab} ✓`, b.x + b.w / 2, b.y + b.h / 2, left[k] ? C.mute : C.ok, 13, pw - 8);
      });
      // Los últimos pasos hechos, debajo.
      s.log.slice(-3).forEach((l, k, a) => TK.label(p, C, l, G.W / 2, G.bottom - 64 + (k - a.length + 1) * 22, k === a.length - 1 ? C.Q : C.mute, 14, G.W - 30));
      if (tk.length === 1) TK.label(p, C, G.solved ? '¡Resuelto!' : 'Ese es el resultado', G.W / 2, G.bottom - 20, C.ok, 14, 200);
      // La ficha que va en el dedo, por encima de todo.
      if (g) { const b = G.boxes[g.i]; tile(g.i, { x: g.x - b.w / 2, y: g.y - b.h / 2 - 6, w: b.w, h: b.h }, true); }
    },
    press(G, x, y) {
      const tk = G.s.tk, i = tk.findIndex((t, j) => t.n !== undefined && hitBox(G.boxes[j], x, y));
      if (i < 0 || tk.length === 1) return false;
      G.grab = { i, x, y }; G.api.sfx?.tap?.();
      return true;
    },
    drag(G, x, y) { if (!G.grab) return false; G.grab.x = x; G.grab.y = y; return true; },
    release(G, x, y) {
      const g = G.grab; if (!g) return;
      G.grab = null;
      const s = G.s, tk = s.tk, j = tk.findIndex((t, k) => k !== g.i && t.n !== undefined && hitBox(G.boxes[k], x, y));
      if (j < 0) return;   // se soltó en el aire: la ficha vuelve a su sitio
      const lo = Math.min(g.i, j), i = lo + 1;
      if (Math.abs(g.i - j) !== 2 || !tk[i].op) { G.a.say('Esas dos fichas no son vecinas: entre ellas hay más cosas', G.C.bad); return; }
      const reason = why(tk, i);
      if (reason) { G.bad(reason); return; }
      const a = tk[i - 1].n, b = tk[i + 1].n, r = calc(a, tk[i].op, b);
      s.log.push(tk[i].op === '^' ? `${a < 0 ? `(${m(a)})` : m(a)}${sup(b)} = ${m(r)}` : `${m(a)} ${SYM[tk[i].op]} ${b < 0 ? `(${m(b)})` : m(b)} = ${m(r)}`);
      s.tk = apply(tk, i); s.last = s.tk.findIndex(t => t.fresh); s.tk.forEach((t, k) => { if (k !== s.last) delete t.fresh; });
      lay(G);
      if (s.tk.length === 1) G.submit();
    },
    // La mano junta dos fichas vecinas (las del primer paso correcto): así se ve qué es «operar» en este juego.
    demo(G) {
      const tk = G.s.tk; if (tk.length === 1) return null;
      const i = legal(tk)[0], c = b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
      return { from: c(G.boxes[i - 1]), to: c(G.boxes[i + 1]), text: 'Arrastra un número sobre su vecino', ty: G.top + 44 };
    },
    // Para el robot: las dos cajas que hay que juntar ahora, y un par que todavía no toca.
    peek: G => {
      const tk = G.s.tk, c = b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
      if (tk.length === 1) return {};
      const i = legal(tk)[0], bad = tk.findIndex((t, j) => t.op && why(tk, j));
      return { from: c(G.boxes[i - 1]), to: c(G.boxes[i + 1]), wrong: bad >= 0 ? [c(G.boxes[bad - 1]), c(G.boxes[bad + 1])] : null };
    },
  }), { parse, legal, why, apply, show, value });
})();
