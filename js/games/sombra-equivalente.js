// Las dos sombras (cálculo, inecuaciones lineales): se despeja x tocando fichas de operación que se
// aplican a los DOS lados (sumar, restar, multiplicar, dividir). El signo de desigualdad es un botón: se
// voltea tocándolo. Sobre la recta hay dos sombras: la de la desigualdad original (arriba, gris) y la de la
// actual (abajo). Mientras los pasos sean válidos coinciden; si se divide entre un negativo y no se voltea
// el signo, la sombra de abajo salta al otro lado y se pinta de rojo. Meta: «x ⟂ número», equivalente.
// params = { rounds: [{ start: { a, b, rel, c, d } (a·x + b ⟂ c·x + d), chips: [{ op: '+'|'*'|'/', k, x? }], min?, max? }] }
// state = { rounds: [{ ops: [índice de ficha | 'flip'] }] }

GAMES['sombra-equivalente'] = (() => {
  const SYM = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
  const FLIP = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
  const clean = v => { const r = Math.round(v * 1e10) / 1e10; return r === 0 ? 0 : r; };

  function frac(v) {
    v = clean(v);
    for (let d = 1; d <= 12; d++) {
      const n = Math.round(v * d);
      if (Math.abs(v * d - n) < 1e-9) {
        const sg = n < 0 ? '−' : '';
        return d === 1 ? `${sg}${Math.abs(n)}` : `${sg}${Math.abs(n)}/${d}`;
      }
    }
    return String(+v.toFixed(3)).replace('-', '−');
  }
  function side(a, b) {
    const parts = [];
    if (a !== 0) parts.push(a === 1 ? 'x' : a === -1 ? '−x' : Number.isInteger(a) ? `${frac(a)}x` : `(${frac(a)})x`);
    if (b !== 0 || a === 0) parts.push(parts.length ? `${b < 0 ? '−' : '+'} ${frac(Math.abs(b))}` : frac(b));
    return parts.join(' ');
  }
  const formText = f => `${side(f.a, f.b)} ${SYM[f.rel]} ${side(f.c, f.d)}`;

  function chipText(ch) {
    const k = Math.abs(ch.k), neg = ch.k < 0;
    if (ch.op === '+') return `${neg ? '−' : '+'}${ch.x ? (k === 1 ? '' : frac(k)) + 'x' : frac(k)}`;
    const sym = ch.op === '*' ? '×' : '÷';
    return neg ? `${sym}(−${frac(k)})` : `${sym}${frac(k)}`;
  }
  function apply(f, ch) {
    if (ch === 'flip') return { ...f, rel: FLIP[f.rel] };
    if (ch.op === '+') return ch.x ? { ...f, a: clean(f.a + ch.k), c: clean(f.c + ch.k) } : { ...f, b: clean(f.b + ch.k), d: clean(f.d + ch.k) };
    const k = ch.op === '*' ? ch.k : 1 / ch.k;
    return { a: clean(f.a * k), b: clean(f.b * k), rel: f.rel, c: clean(f.c * k), d: clean(f.d * k) };
  }
  // Conjunto solución: x ⟂ p (null si la x desaparece).
  function setOf(f) {
    const A = clean(f.a - f.c), B = clean(f.d - f.b);
    if (A === 0) return null;
    return { p: clean(B / A), rel: A > 0 ? f.rel : FLIP[f.rel] };
  }
  const replay = (r, ops) => ops.reduce((f, o) => apply(f, o === 'flip' ? 'flip' : r.chips[o]), r.start);
  const sameSet = (u, v) => !!u && !!v && Math.abs(u.p - v.p) < 1e-9 && u.rel === v.rel;
  const isolated = f => f.a === 1 && f.b === 0 && f.c === 0;
  const roundOk = (s, r) => { if (!s) return false; const f = replay(r, Array.from(s.ops)); return isolated(f) && sameSet(setOf(f), setOf(r.start)); };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => roundOk(state.rounds[i], r));
    return { ok, solution: params.rounds.map(r => { const t = setOf(r.start); return `${formText(r.start)} ⇒ x ${SYM[t.rel]} ${frac(t.p)}`; }).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ops = params.rounds.map(() => []);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], chipBoxes = [], undo = null, relBox = null;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const chips = params.rounds[cur].chips, per = Math.min(4, chips.length), cw = (W - 24 - (per - 1) * 8) / per, ch = 40, y0 = H - 112;
      chipBoxes = chips.map((_, i) => ({ x: 12 + (i % per) * (cw + 8), y: y0 + Math.floor(i / per) * (ch + 8), w: cw, h: ch }));
      undo = { x: W - 104, y: 44, w: 92, h: 30 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };
      function fit(s, sz, maxW) { p.textSize(sz); while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); } return sz; }
      // Sombra de un conjunto x ⟂ p sobre la recta, a la altura y.
      function shadow(set, y, col, X, lo, hi) {
        if (!set) return;
        const right = set.rel[0] === '>', px = X(Math.max(lo, Math.min(hi, set.p)));
        p.stroke(col); p.strokeWeight(9); p.strokeCap(p.ROUND);
        p.line(px, y, right ? X(hi) : X(lo), y);
        p.strokeCap(p.SQUARE);
        p.stroke(col); p.strokeWeight(2.5); p.fill(set.rel.includes('=') ? col : C.bg); p.circle(px, y, 15);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], f = replay(r, ops[cur]), target = setOf(r.start), now = setOf(f);
        const good = sameSet(now, target), done = good && isolated(f);
        tabs.forEach((tb, i) => {
          const ok = roundOk({ ops: ops[i] }, params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : ok ? C.Q : ops[i].length ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        // Deshacer.
        p.stroke(locked || !ops[cur].length ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(undo.x, undo.y, undo.w, undo.h, 8);
        p.noStroke(); p.fill(ops[cur].length && !locked ? C.ink : C.mute); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text('↶ deshacer', undo.x + undo.w / 2, undo.y + undo.h / 2);

        // La desigualdad actual con el signo como botón.
        const L = side(f.a, f.b), R = side(f.c, f.d), S = SYM[f.rel];
        p.textStyle(p.BOLD);
        const sz = fit(`${L}  ${S}  ${R}`, 26, W - 40);
        const wL = p.textWidth(L), wS = p.textWidth(S) + 22, wR = p.textWidth(R), total = wL + wS + wR + 16, x0 = (W - total) / 2, y = 100;
        p.noStroke(); p.fill(done ? C.ok : C.ink); p.textAlign(p.LEFT, p.CENTER); p.text(L, x0, y);
        relBox = { x: x0 + wL + 8, y: y - sz * 0.8, w: wS, h: sz * 1.6 };
        p.stroke(locked ? C.line : C.N); p.strokeWeight(2); p.fill(C.card); p.rect(relBox.x, relBox.y, relBox.w, relBox.h, 8);
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.CENTER); p.text(S, relBox.x + relBox.w / 2, y);
        p.fill(done ? C.ok : C.ink); p.textAlign(p.LEFT, p.CENTER); p.text(R, relBox.x + relBox.w + 8, y);
        p.fill(C.mute); p.textStyle(p.NORMAL); fit(`original: ${formText(r.start)}   ·   toca el signo para voltearlo`, 12, W - 24);
        p.textAlign(p.CENTER, p.CENTER); p.text(`original: ${formText(r.start)}   ·   toca el signo para voltearlo`, W / 2, 136);

        // Recta con las dos sombras.
        const lo = r.min ?? -8, hi = r.max ?? 8, X = v => 22 + (v - lo) / (hi - lo) * (W - 44), ly = 196;
        p.stroke(C.line); p.strokeWeight(2); p.line(14, ly, W - 14, ly);
        for (let v = Math.ceil(lo); v <= hi; v++) {
          p.stroke(C.line); p.strokeWeight(1); p.line(X(v), ly - 5, X(v), ly + 5);
          if (v % 2 === 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(String(v).replace('-', '−'), X(v), ly + 8); }
        }
        shadow(target, ly - 22, C.mute, X, lo, hi);
        shadow(now, ly + 30, good ? C.Q : C.bad, X, lo, hi);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.LEFT, p.CENTER);
        p.fill(C.mute); p.text('original', 14, ly - 36);
        p.fill(good ? C.Q : C.bad); p.text(now ? (good ? 'actual · equivalente' : 'actual · ¡otra solución!') : 'actual · sin x', 14, ly + 48);
        if (done) { p.fill(C.ok); p.textAlign(p.RIGHT, p.CENTER); p.text('¡x despejada!', W - 14, ly + 48); }

        // Fichas.
        r.chips.forEach((ch, i) => {
          const b = chipBoxes[i];
          p.stroke(locked ? C.line : ch.op === '+' ? C.Z : C.R); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fit(chipText(ch), 17, b.w - 8);
          p.text(chipText(ch), b.x + b.w / 2, b.y + b.h / 2);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.BOTTOM);
        if (!locked) p.text('cada ficha se aplica a los dos lados', W / 2, chipBoxes[0].y - 6);
        if (locked && !roundOk({ ops: ops[cur] }, r)) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(`era x ${SYM[target.rel]} ${frac(target.p)}`, W / 2, ly + 66); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        let did = false;
        if (inside(relBox, p.mouseX, p.mouseY)) { ops[cur].push('flip'); did = true; }
        else if (inside(undo, p.mouseX, p.mouseY) && ops[cur].length) { ops[cur].pop(); did = true; }
        else {
          const i = chipBoxes.findIndex(b => inside(b, p.mouseX, p.mouseY));
          if (i >= 0 && ops[cur].length < 30) { ops[cur].push(i); did = true; }
        }
        if (did) { api.sfx?.tap?.(); api.ready(ops.every(o => o.length > 0)); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: ops.map(o => ({ ops: o.slice() })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, setOf, apply, chipText, frac, formText };
})();
