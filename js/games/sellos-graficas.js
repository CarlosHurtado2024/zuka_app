// Sellos de transformación (cálculo, transformaciones de funciones): en el plano está la gráfica base
// (√x, |x|, x², x³ o 1/x) y la fantasma de la meta, con su fórmula arriba. Cada sello transforma la gráfica
// actual: → ← (correr 1), ↑ ↓ (subir o bajar 1), ×2 y ×½ (estirar o encoger en vertical), reflejos en el
// eje x y en el eje y. Los sellos se apilan en orden (↶ quita el último): el orden importa, porque estirar
// después de subir también estira la subida.
// params = { rounds: [{ base, target: { A, B, C, D }, xr, yr }] }   (y = A·base(Bx + C) + D)
// state = { stamps: [[código…]] }

GAMES['sellos-graficas'] = (() => {
  const BASES = {
    sqrt: { f: Math.sqrt, wrap: s => (s === 'x' ? '√x' : `√(${s})`) },
    abs: { f: Math.abs, wrap: s => `|${s}|` },
    sq: { f: x => x * x, wrap: s => (s === 'x' ? 'x²' : `(${s})²`) },
    cube: { f: x => x * x * x, wrap: s => (s === 'x' ? 'x³' : `(${s})³`) },
    recip: { f: x => 1 / x, wrap: s => `1/${s === 'x' ? 'x' : `(${s})`}` },
  };
  const STAMPS = [
    { code: 'R', label: '→' }, { code: 'L', label: '←' }, { code: 'U', label: '↑' }, { code: 'D', label: '↓' },
    { code: 'V2', label: '×2' }, { code: 'Vh', label: '×½' }, { code: 'Fx', label: '⇅ x' }, { code: 'Fy', label: '⇆ y' },
  ];
  function apply(stamps) {
    const t = { A: 1, B: 1, C: 0, D: 0 };
    for (const s of stamps) {
      if (s === 'R') t.C -= t.B; else if (s === 'L') t.C += t.B;
      else if (s === 'U') t.D += 1; else if (s === 'D') t.D -= 1;
      else if (s === 'V2') { t.A *= 2; t.D *= 2; } else if (s === 'Vh') { t.A /= 2; t.D /= 2; }
      else if (s === 'Fx') { t.A = -t.A; t.D = -t.D; } else if (s === 'Fy') t.B = -t.B;
    }
    for (const k of 'ABCD') t[k] += 0;
    return t;
  }
  const fnOf = (base, t) => x => t.A * BASES[base].f(t.B * x + t.C) + t.D;
  function exprText(base, t) {
    const inner = (t.B === 1 ? 'x' : t.B === -1 ? '−x' : `${numTxt(t.B)}x`) + (t.C ? ` ${t.C < 0 ? '−' : '+'} ${numTxt(Math.abs(t.C))}` : '');
    const coef = t.A === 1 ? '' : t.A === -1 ? '−' : numTxt(t.A);
    return `y = ${coef}${BASES[base].wrap(inner)}${t.D ? ` ${t.D < 0 ? '−' : '+'} ${numTxt(Math.abs(t.D))}` : ''}`;
  }
  // Se compara la gráfica (no los números), porque |−x| = |x| y (−x)² = x².
  function sameGraph(base, t1, t2) {
    const f = fnOf(base, t1), g = fnOf(base, t2);
    for (let x = -8; x <= 8; x += 0.25) {
      const a = f(x), b = g(x);
      if (Number.isNaN(a) !== Number.isNaN(b) || Number.isFinite(a) !== Number.isFinite(b)) return false;
      if (Number.isFinite(a) && Math.abs(a - b) > 1e-9) return false;
    }
    return true;
  }
  const fits = (stamps, r) => !!stamps && sameGraph(r.base, apply(stamps), r.target);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.stamps[i], r));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) ${exprText(r.base, r.target)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const stamps = params.rounds.map(() => []), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, btns = [];

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], w = W - 24, h = Math.min(H - 84 - 160, w * (r.yr[1] - r.yr[0]) / (r.xr[1] - r.xr[0]));
      v = planeView({ x: 12, y: 84, w, h }, r.xr, r.yr);
      const items = [...STAMPS, { code: 'undo', label: '↶' }, { code: 'clear', label: '⌫' }];
      const bw = (W - 24 - 4 * 6) / 5, by = H - 2 * 44 - 4;
      btns = items.map((it, k) => ({ ...it, x: 12 + (k % 5) * (bw + 6), y: by + Math.floor(k / 5) * 46, w: bw, h: 40 }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], t = apply(stamps[cur]), ok = fits(stamps[cur], r);
        drawTabs(p, C, tabs, cur, i => (locked ? (fits(stamps[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, `meta: ${exprText(r.base, r.target)}`, W / 2, 62, W - 24, 17);
        drawPlane(p, C, v);
        const split = (f, col, w, dash) => {
          p.stroke(col); p.strokeWeight(w); if (dash) p.drawingContext.setLineDash(dash);
          drawCurve(p, v, f, v.xr[0], v.xr[1], r.base === 'recip' ? 400 : 240);
          p.drawingContext.setLineDash([]);
        };
        split(fnOf(r.base, { A: 1, B: 1, C: 0, D: 0 }), C.line, 2, null);
        split(fnOf(r.base, r.target), locked ? C.ok : C.mute, 5, [2, 8]);
        split(fnOf(r.base, t), locked ? (ok ? C.ok : C.bad) : C.brand, 3.5, null);
        // Fórmula actual y pila de sellos.
        const by = v.box.y + v.box.h + 20;
        p.noStroke(); p.fill(locked ? (ok ? C.ok : C.bad) : C.brand); p.textStyle(p.BOLD);
        fitText(p, exprText(r.base, t), W / 2, by, W - 24, 17);
        const list = stamps[cur].map(c => STAMPS.find(s => s.code === c).label).join('  ');
        p.fill(C.N); p.textStyle(p.NORMAL); fitText(p, list || 'sin sellos todavía', W / 2, by + 24, W - 24, 14);
        btns.forEach(b => {
          const tool = b.code === 'undo' || b.code === 'clear';
          p.stroke(locked ? C.line : tool ? C.I : C.R); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textStyle(p.BOLD); fitText(p, b.label, b.x + b.w / 2, b.y + b.h / 2, b.w - 6, 17);
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = btns.find(b => hitBox(b, p.mouseX, p.mouseY));
        if (!b) return;
        const s = stamps[cur];
        if (b.code === 'undo') s.pop(); else if (b.code === 'clear') s.length = 0; else if (s.length < 12) s.push(b.code);
        touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.();
        return false;
      };
    }, 1.55);

    return {
      loaded: m.ready,
      getState: () => ({ stamps: stamps.map(s => s.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, apply, exprText, fnOf, BASES };
})();
