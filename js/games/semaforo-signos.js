// El semáforo de signos (cálculo, inecuaciones con productos y cocientes): una tabla con una fila por
// factor y una columna por tramo de la recta (los puntos críticos la parten). Se toca cada casilla para
// poner + o −; la fila del producto (o cociente) se calcula sola. Después se encienden los tramos que
// forman la solución y se tocan los puntos críticos para incluirlos (lleno) o no (vacío). El cero de un
// denominador nunca entra.
// params = { rounds: [{ txt, factors: [{ txt, root, s (signo del coeficiente de x), den? }], rel: '<'|'<='|'>'|'>=' }] }
// state = { rounds: [{ cells: [[±1 | 0]], picks: [bool], dots: [bool] }] }

GAMES['semaforo-signos'] = (() => {
  const signAt = (f, x) => (f.s * (x - f.root) > 0 ? 1 : -1);
  const num = v => String(v).replace('-', '−');
  const sat = (sg, rel) => (rel[0] === '<' ? sg < 0 : sg > 0);

  function truth(r) {
    const crit = r.factors.map(f => f.root).sort((a, b) => a - b);
    const n = crit.length;
    const mids = Array.from({ length: n + 1 }, (_, j) => (j === 0 ? crit[0] - 1 : j === n ? crit[n - 1] + 1 : (crit[j - 1] + crit[j]) / 2));
    const cells = r.factors.map(f => mids.map(x => signAt(f, x)));
    const product = mids.map((_, j) => cells.reduce((s, row) => s * row[j], 1));
    const picks = product.map(sg => sat(sg, r.rel));
    const dots = crit.map(c => r.rel.includes('=') && !r.factors.find(f => f.root === c).den);
    return { crit, cells, product, picks, dots };
  }

  function solutionText(r) {
    const t = truth(r), n = t.crit.length, parts = [];
    t.picks.forEach((on, j) => {
      if (!on) return;
      const lo = j === 0 ? '(−∞' : `${t.dots[j - 1] ? '[' : '('}${num(t.crit[j - 1])}`;
      const hi = j === n ? '∞)' : `${num(t.crit[j])}${t.dots[j] ? ']' : ')'}`;
      parts.push(`${lo}, ${hi}`);
    });
    return parts.join(' ∪ ') || '∅';
  }

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  function roundOk(s, r) {
    const t = truth(r);
    return !!s && same(s.cells.map(row => Array.from(row)), t.cells) && same(Array.from(s.picks), t.picks) && same(Array.from(s.dots), t.dots);
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => roundOk(state.rounds[i], r));
    return { ok, solution: params.rounds.map(r => `${r.txt}: ${solutionText(r)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = params.rounds.map(r => ({
      cells: r.factors.map(() => Array(r.factors.length + 1).fill(0)),
      picks: Array(r.factors.length + 1).fill(false),
      dots: Array(r.factors.length).fill(false),
    }));
    const touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [];
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const LW = 78;

    function geo() {
      const r = params.rounds[cur], T = r.factors.length + 1, colW = (W - LW - 12) / T, rh = 38;
      const lineY = 104, top = 134;
      const rows = r.factors.map((_, i) => top + i * (rh + 6));
      const prodY = top + r.factors.length * (rh + 6) + 6, solY = prodY + rh + 12;
      return { r, T, colW, rh, lineY, top, rows, prodY, solY, cx: k => LW + (k + 1) * colW };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layoutTabs(); };
      p.onResize = () => { W = size.w; H = size.h; layoutTabs(); };
      function layoutTabs() { tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 })); }
      function fit(s, x, y, sz, maxW) {
        p.textSize(sz);
        while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); }
        p.text(s, x, y);
      }
      function cell(x, y, w, h, fill, stroke, label, col) {
        p.stroke(stroke); p.strokeWeight(1.5); p.fill(fill); p.rect(x + 3, y, w - 6, h, 8);
        p.noStroke(); p.fill(col); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(20); p.text(label, x + w / 2, y + h / 2);
      }

      p.draw = () => {
        p.background(C.bg);
        const g = geo(), s = st[cur], t = truth(g.r);
        tabs.forEach((tb, i) => {
          const ok = roundOk(st[i], params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fit(g.r.txt, W / 2, 60, 19, W - 24);

        // Recta con los tramos elegidos encendidos y los puntos críticos.
        p.stroke(C.line); p.strokeWeight(3); p.line(LW, g.lineY, W - 12, g.lineY);
        for (let j = 0; j < g.T; j++) if (s.picks[j]) {
          p.stroke(locked && s.picks[j] !== t.picks[j] ? C.bad : C.Q); p.strokeWeight(7);
          p.line(LW + j * g.colW + (j ? 0 : 4), g.lineY, LW + (j + 1) * g.colW - (j === g.T - 1 ? 4 : 0), g.lineY);
        }
        t.crit.forEach((c, k) => {
          const x = g.cx(k), wrong = locked && s.dots[k] !== t.dots[k];
          p.stroke(wrong ? C.bad : C.ink); p.strokeWeight(2.5); p.fill(s.dots[k] ? C.ink : C.bg); p.circle(x, g.lineY, 15);
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.BOTTOM); p.text(num(c), x, g.lineY - 11);
          p.stroke(C.line); p.strokeWeight(1); p.drawingContext.setLineDash([3, 4]); p.line(x, g.lineY + 10, x, g.solY + g.rh); p.drawingContext.setLineDash([]);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text('puntos ● ○', 8, g.lineY);

        // Filas de los factores.
        g.r.factors.forEach((f, i) => {
          const y = g.rows[i];
          p.noStroke(); p.fill(f.den ? C.I : C.ink); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD);
          fit(f.den ? `÷ ${f.txt}` : f.txt, 8, y + g.rh / 2, 14, LW - 12);
          for (let j = 0; j < g.T; j++) {
            const v = s.cells[i][j], wrong = locked && v !== t.cells[i][j];
            cell(LW + j * g.colW, y, g.colW, g.rh, C.card, wrong ? C.bad : v ? (v > 0 ? C.Q : C.I) : C.line, v ? (v > 0 ? '+' : '−') : '·', v ? (v > 0 ? C.Q : C.I) : C.mute);
          }
        });
        // Producto (se calcula solo cuando la columna está completa).
        p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(13);
        p.text(g.r.factors.some(f => f.den) ? 'cociente' : 'producto', 8, g.prodY + g.rh / 2);
        for (let j = 0; j < g.T; j++) {
          const col = s.cells.map(row => row[j]), full = col.every(v => v);
          const v = full ? col.reduce((a, b) => a * b, 1) : 0;
          cell(LW + j * g.colW, g.prodY, g.colW, g.rh, C.bg, C.line, v ? (v > 0 ? '+' : '−') : '?', v ? (v > 0 ? C.Q : C.I) : C.mute);
        }
        // Fila de la solución: se encienden los tramos.
        p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.CENTER); p.textSize(13); p.text('solución', 8, g.solY + g.rh / 2);
        for (let j = 0; j < g.T; j++) {
          const on = s.picks[j], wrong = locked && on !== t.picks[j];
          cell(LW + j * g.colW, g.solY, g.colW, g.rh, on ? C.Q : C.card, wrong ? C.bad : on ? C.Q : C.line, on ? '✓' : '', C.bg);
        }
        if (locked && !roundOk(s, g.r)) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fit(`solución: ${solutionText(g.r)}`, W / 2, H - 14, 14, W - 24); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const g = geo(), s = st[cur], t = truth(g.r), mx = p.mouseX, my = p.mouseY;
        let hit = false;
        t.crit.forEach((_, k) => { if (!hit && Math.abs(mx - g.cx(k)) < 16 && Math.abs(my - g.lineY) < 18) { s.dots[k] = !s.dots[k]; hit = true; } });
        if (!hit && mx > LW) {
          const j = Math.floor((mx - LW) / g.colW);
          if (j >= 0 && j < g.T) {
            g.rows.forEach((y, i) => { if (!hit && my >= y && my <= y + g.rh) { const v = s.cells[i][j]; s.cells[i][j] = v === 1 ? -1 : 1; hit = true; } });
            if (!hit && my >= g.solY && my <= g.solY + g.rh) { s.picks[j] = !s.picks[j]; hit = true; }
          }
        }
        if (hit) { touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean)); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: st.map(s => ({ cells: s.cells.map(r => r.slice()), picks: s.picks.slice(), dots: s.dots.slice() })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, truth, signAt, solutionText };
})();
