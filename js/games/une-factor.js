// Une cada cambio con su factor (lección 1.3): a la izquierda, cambios porcentuales (+25 %, −5 %…);
// a la derecha, factores multiplicativos (×1.25, ×0.95…) con algún distractor. Se arrastra desde
// un cambio hasta un factor para tender la cuerda; un factor solo puede tener una cuerda (la nueva
// le quita la vieja al otro cambio) y arrastrar desde un cambio ya unido lo suelta.
// params = { changes: [%], factors: [número] }   state = { links: [índice de factor | null] }

GAMES['une-factor'] = (() => {
  const factorOf = c => 1 + c / 100;
  const same = (a, b) => Math.abs(a - b) < 1e-9;
  const pct = c => `${c > 0 ? '+' : '−'}${Math.abs(c)} %`;
  const fac = f => `×${f}`;

  function grade(state, params) {
    const ok = params.changes.every((c, i) => {
      const j = state.links[i];
      return j != null && params.factors[j] !== undefined && same(params.factors[j], factorOf(c));
    });
    const solution = params.changes.map(c => `${pct(c)} → ${fac(factorOf(c))}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const COLS = [C.N, C.Z, C.Q, C.I, C.R, C.brand];
    const st = { links: params.changes.map(() => null) };
    let locked = false, W = 0, H = 0, left = [], right = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      const n = Math.max(params.changes.length, params.factors.length);
      const top = 50, rowH = (h - top - 36) / n, ph = Math.min(40, rowH - 10), pw = Math.min(118, w * 0.34);
      const rowY = (k, count) => top + (k + 0.5) * rowH + ((n - count) * rowH) / 2 - ph / 2;
      left = params.changes.map((_, i) => ({ x: 14, y: rowY(i, params.changes.length), w: pw, h: ph }));
      right = params.factors.map((_, j) => ({ x: w - 14 - pw, y: rowY(j, params.factors.length), w: pw, h: ph }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.links.every(j => j !== null));
    const linkedBy = j => st.links.indexOf(j);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function pill(b, label, col, strong) {
        p.stroke(col); p.strokeWeight(strong ? 2.5 : 1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, b.h / 2);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(15);
        p.text(label, b.x + b.w / 2, b.y + b.h / 2);
      }
      function rope(x0, y0, x1, y1, col) {
        p.stroke(col); p.strokeWeight(3); p.noFill();
        p.bezier(x0, y0, x0 + (x1 - x0) * 0.45, y0, x1 - (x1 - x0) * 0.45, y1, x1, y1);
        p.noStroke(); p.fill(col); p.circle(x0, y0, 9); p.circle(x1, y1, 9);
      }

      p.draw = () => {
        p.background(C.bg);
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text('Une cada cambio con el factor por el que multiplica', 12, 8, W - 24, 40);
        // Cuerdas tendidas.
        st.links.forEach((j, i) => {
          if (j === null) return;
          const good = same(params.factors[j], factorOf(params.changes[i]));
          const col = locked ? (good ? C.ok : C.bad) : COLS[i % COLS.length];
          rope(left[i].x + left[i].w, left[i].y + left[i].h / 2, right[j].x, right[j].y + right[j].h / 2, col);
        });
        if (locked) st.links.forEach((j, i) => {   // la cuerda que faltaba o estaba mal, en verde punteado
          const k = params.factors.findIndex(f => same(f, factorOf(params.changes[i])));
          if (k < 0 || (j !== null && same(params.factors[j], factorOf(params.changes[i])))) return;
          p.drawingContext.setLineDash([6, 5]);
          rope(left[i].x + left[i].w, left[i].y + left[i].h / 2, right[k].x, right[k].y + right[k].h / 2, C.ok);
          p.drawingContext.setLineDash([]);
        });
        if (drag) rope(left[drag.i].x + left[drag.i].w, left[drag.i].y + left[drag.i].h / 2, p.mouseX, p.mouseY, COLS[drag.i % COLS.length]);
        // Pastillas.
        params.changes.forEach((c, i) => {
          const j = st.links[i], good = j !== null && same(params.factors[j], factorOf(c));
          const col = locked ? (good ? C.ok : C.bad) : j !== null || (drag && drag.i === i) ? COLS[i % COLS.length] : C.line;
          pill(left[i], pct(c), col, j !== null);
        });
        params.factors.forEach((f, j) => {
          const i = linkedBy(j);
          const col = i >= 0 ? (locked ? (same(f, factorOf(params.changes[i])) ? C.ok : C.bad) : COLS[i % COLS.length]) : C.line;
          pill(right[j], fac(f), col, i >= 0);
        });
        const extra = params.factors.length - params.changes.length;
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Todas las cuerdas en su sitio!' : 'Mira las cuerdas verdes') : `Arrastra desde un cambio hasta su factor${extra > 0 ? ` · sobra${extra > 1 ? 'n' : ''} ${extra}` : ''}`, 12, H - 30, W - 24, 28);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = left.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (i < 0) return;
        st.links[i] = null;   // arrastrar desde un cambio ya unido lo suelta
        drag = { i };
        ready();
        return false;
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const j = right.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (j >= 0) {
          const other = linkedBy(j);
          if (other >= 0) st.links[other] = null;   // el factor solo aguanta una cuerda
          st.links[drag.i] = j;
          api.sfx?.tap?.();
        }
        drag = null;
        ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ links: [...st.links] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
