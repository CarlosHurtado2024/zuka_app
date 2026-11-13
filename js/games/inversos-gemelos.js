// Los inversos gemelos (Álgebra 1.2, axiomas de campo: opuesto y recíproco). Cada ronda trae un número y la
// máquina opera con su «gemelo», que el estudiante arma con un botón de signo, ruedas − / + para el numerador y el
// denominador y un interruptor √ (para raíces como √6). Con + la meta es el neutro 0 (el opuesto); con × la meta
// es el neutro 1 (el recíproco). El 0 no tiene recíproco: para él está el botón «no tiene». La máquina muestra el
// resultado en vivo. Cualquier fracción equivalente vale.
// params = { op: '+' | '×', rounds: [{ label, v, sol }] }   state = { ans: [{ s, n, d, r, none } | null] }

GAMES['inversos-gemelos'] = (() => {
  const valueOf = a => a.s * (a.r ? Math.sqrt(a.n) : a.n) / a.d;
  const close = (x, y) => Math.abs(x - y) < 1e-9;

  function okRound(a, r, op) {
    if (!a) return false;
    if (op === '×' && r.v === 0) return !!a.none;
    if (a.none) return false;
    return op === '+' ? close(r.v + valueOf(a), 0) : close(r.v * valueOf(a), 1);
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.ans?.[i], r, params.op));
    const word = params.op === '+' ? 'opuesto' : 'recíproco';
    const solution = params.rounds.map(r => `${word} de ${r.label}: ${r.sol}`).join(' · ');
    return { ok, solution };
  }

  const txt = a => {
    if (a.none) return 'no tiene';
    const num = (a.r ? '√' : '') + a.n;
    return (a.s < 0 ? '−' : '') + (a.d === 1 ? num : `${num}/${a.d}`);
  };
  const show = v => {
    const k = Math.round(v * 1e6) / 1e6;
    return Math.abs(k - Math.round(k)) < 1e-9 ? String(Math.round(k)).replace('-', '−') : `≈ ${numTxt(+k.toFixed(3))}`;
  };

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, op = params.op, mul = op === '×';
    const A = R.map(() => ({ s: 1, n: 0, d: 1, r: false, none: false, touched: false }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = {}, shake = 0;

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      const cx = w / 2, bw = 44, bh = 36;
      B = {
        nMinus: { x: cx - 92, y: 148, w: bw, h: bh }, nPlus: { x: cx + 48, y: 148, w: bw, h: bh },
        dMinus: { x: cx - 92, y: 206, w: bw, h: bh }, dPlus: { x: cx + 48, y: 206, w: bw, h: bh },
        sign: { x: cx - 100, y: 258, w: 92, h: 34 },
        root: { x: cx + 8, y: 258, w: 92, h: 34 },
        none: mul ? { x: cx - 92, y: 304, w: 184, h: 34 } : null,
      };
    }
    function touch(f) {
      if (locked) return;
      const a = A[cur]; f(a); a.touched = true;
      api.ready(A.every(x => x.touched)); api.sfx?.tap?.();
    }
    function button(b, label, on, col) {
      if (!b) return;
      // Ficha con relieve: crema apagada, de su color cuando está activa; los − / + van en azul.
      drawTile(p5i, C, b, label, { fill: on ? col : label === '−' || label === '+' ? C.sky : C.cream, r: 9, lift: on ? 1 : 3, size: 16 });
    }
    let p5i = null;

    const m = mountSketch(host, (p, size) => {
      p5i = p;
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], a = A[cur], good = okRound(a, r, op);
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(A[i], R[i], op) ? C.ok : C.bad) : i === cur ? C.brand : A[i].touched ? C.Q : C.line));
        drawKicker(p, C, mul ? 'El gemelo que al multiplicar da 1' : 'El gemelo que al sumar da 0', W / 2, 56, { center: true });
        p.textAlign(p.CENTER, p.CENTER); p.noStroke();
        // La máquina: número ⊕ gemelo = resultado
        const sx = shake > 0 ? Math.sin(shake * 2) * 4 : 0; shake = Math.max(0, shake - 1);
        p.stroke(locked ? (good ? C.ok : C.bad) : C.sun); p.strokeWeight(2.5); p.fill(C.card); p.rect(12 + sx, 74, W - 24, 58, 14);
        const eq = `${r.label}  ${op}  ${a.none ? '?' : `(${txt(a)})`}`;
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); fitText(p, eq, W / 2 + sx, 94, W - 40, 19);
        let res = '';
        if (a.none) res = mul && r.v === 0 ? '0 · lo que sea = 0, nunca 1' : 'sí tiene: búscalo';
        else res = '= ' + show(mul ? r.v * valueOf(a) : r.v + valueOf(a));
        p.fill(locked ? (good ? C.ok : C.bad) : C.mute); p.textStyle(p.NORMAL); fitText(p, res, W / 2 + sx, 117, W - 40, 13);
        // El constructor del gemelo
        const cx = W / 2;
        button(B.sign, a.s < 0 ? 'signo  −' : 'signo  +', a.s < 0, C.Z);
        button(B.root, a.r ? 'con √' : 'sin √', a.r, C.I);
        button(B.nMinus, '−', false); button(B.nPlus, '+', false); button(B.dMinus, '−', false); button(B.dPlus, '+', false);
        p.noStroke(); p.fill(a.none ? C.mute : C.ink); p.textStyle(p.BOLD); p.textSize(24);
        p.text((a.r ? '√' : '') + a.n, cx, 166);
        p.stroke(a.none ? C.line : C.ink); p.strokeWeight(2.5); p.line(cx - 30, 195, cx + 30, 195);
        p.noStroke(); p.text(a.d, cx, 224);
        if (B.none) button(B.none, 'no tiene recíproco', a.none, C.R);
        p.noStroke(); p.textStyle(p.NORMAL); p.textSize(12);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `Era: ${r.sol}`, W / 2, H - 18, W - 24, 13); }
        else { p.fill(C.mute); fitText(p, mul ? 'Recíproco: a · (1/a) = 1' : 'Opuesto: a + (−a) = 0', W / 2, H - 18, W - 24, 12); }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(B.sign, x, y)) { touch(a => { a.s = -a.s; a.none = false; }); return false; }
        if (hitBox(B.root, x, y)) { touch(a => { a.r = !a.r; a.none = false; }); return false; }
        if (hitBox(B.nMinus, x, y)) { touch(a => { a.n = Math.max(0, a.n - 1); a.none = false; }); return false; }
        if (hitBox(B.nPlus, x, y)) { touch(a => { a.n = Math.min(20, a.n + 1); a.none = false; }); return false; }
        if (hitBox(B.dMinus, x, y)) { touch(a => { a.d = Math.max(1, a.d - 1); a.none = false; }); return false; }
        if (hitBox(B.dPlus, x, y)) { touch(a => { a.d = Math.min(20, a.d + 1); a.none = false; }); return false; }
        if (B.none && hitBox(B.none, x, y)) { touch(a => { a.none = !a.none; }); if (A[cur].none && R[cur].v !== 0) shake = 12; return false; }
      };
    }, 1.48);

    return {
      loaded: m.ready,
      getState: () => ({ ans: A.map(a => (a.touched ? { s: a.s, n: a.n, d: a.d, r: a.r, none: a.none } : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, valueOf };
})();
