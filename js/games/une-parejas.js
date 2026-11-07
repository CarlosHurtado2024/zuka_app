// Une las parejas (varias lecciones): etiquetas a la izquierda y a la derecha (con distractores a
// la derecha); se arrastra desde una de la izquierda hasta su pareja. Un destino solo aguanta una
// cuerda y arrastrar desde una etiqueta ya unida la suelta. Como «une-factor», pero con textos.
// params = { left: [label], right: [label], pairs: [[i, j]] }   state = { links: [j | null] }

GAMES['une-parejas'] = (() => {
  const mateOf = (p, i) => p.pairs.find(pr => pr[0] === i)?.[1];

  function grade(state, params) {
    const ok = params.left.every((_, i) => state.links[i] != null && state.links[i] === mateOf(params, i));
    const solution = params.left.map((l, i) => `${l} → ${params.right[mateOf(params, i)]}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const COLS = [C.N, C.Z, C.Q, C.I, C.R, C.brand];
    const st = { links: params.left.map(() => null) };
    let locked = false, W = 0, H = 0, left = [], right = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      const n = Math.max(params.left.length, params.right.length);
      const top = 50, rowH = (h - top - 36) / n, ph = Math.max(28, Math.min(40, rowH - 8)), pw = Math.min(130, w * 0.4);
      const rowY = (k, count) => top + (k + 0.5) * rowH + ((n - count) * rowH) / 2 - ph / 2;
      left = params.left.map((_, i) => ({ x: 12, y: rowY(i, params.left.length), w: pw, h: ph }));
      right = params.right.map((_, j) => ({ x: w - 12 - pw, y: rowY(j, params.right.length), w: pw, h: ph }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.links.every(j => j !== null));
    const linkedBy = j => st.links.indexOf(j);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function pill(b, label, col, strong) {
        p.stroke(col); p.strokeWeight(strong ? 2.5 : 1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, b.h / 2);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(label.length > 9 ? 12 : 14);
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
        p.text('Une cada expresión de la izquierda con su pareja', 12, 8, W - 24, 40);
        st.links.forEach((j, i) => {
          if (j === null) return;
          const good = j === mateOf(params, i);
          rope(left[i].x + left[i].w, left[i].y + left[i].h / 2, right[j].x, right[j].y + right[j].h / 2, locked ? (good ? C.ok : C.bad) : COLS[i % COLS.length]);
        });
        if (locked) st.links.forEach((j, i) => {
          const k = mateOf(params, i);
          if (k === undefined || j === k) return;
          p.drawingContext.setLineDash([6, 5]);
          rope(left[i].x + left[i].w, left[i].y + left[i].h / 2, right[k].x, right[k].y + right[k].h / 2, C.ok);
          p.drawingContext.setLineDash([]);
        });
        if (drag) rope(left[drag.i].x + left[drag.i].w, left[drag.i].y + left[drag.i].h / 2, p.mouseX, p.mouseY, COLS[drag.i % COLS.length]);
        params.left.forEach((l, i) => {
          const j = st.links[i], good = j !== null && j === mateOf(params, i);
          pill(left[i], l, locked ? (good ? C.ok : C.bad) : j !== null || (drag && drag.i === i) ? COLS[i % COLS.length] : C.line, j !== null);
        });
        params.right.forEach((r, j) => {
          const i = linkedBy(j);
          pill(right[j], r, i >= 0 ? (locked ? (j === mateOf(params, i) ? C.ok : C.bad) : COLS[i % COLS.length]) : C.line, i >= 0);
        });
        const extra = params.right.length - params.left.length;
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Todas las parejas!' : 'Mira las cuerdas verdes') : `Arrastra de izquierda a derecha${extra > 0 ? ` · sobra${extra > 1 ? 'n' : ''} ${extra}` : ''}`, 12, H - 30, W - 24, 28);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = left.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (i < 0) return;
        st.links[i] = null; drag = { i }; ready();
        return false;
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const j = right.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (j >= 0) { const other = linkedBy(j); if (other >= 0) st.links[other] = null; st.links[drag.i] = j; api.sfx?.tap?.(); }
        drag = null; ready();
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
