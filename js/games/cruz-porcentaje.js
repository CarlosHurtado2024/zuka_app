// La cruz del porcentaje (lección 1.3): la regla de tres del tanto por ciento, 100 → C y p → B.
// Tres problemas; en cada uno se arrastran las fichas (los datos y la «?» de la incógnita) a las
// casillas p, C y B de la cruz. Una ficha con cell = null es un distractor.
// params = { problems: [{ text, chips: [{ label, cell }] }] }   state = { problems: [{ cells: { p, C, B } }] }

GAMES['cruz-porcentaje'] = (() => {
  const CELLS = ['p', 'C', 'B'];
  const NAMES = { p: 'porcentaje', C: 'base', B: 'parte' };

  function grade(state, params) {
    const ok = params.problems.every((pr, k) => CELLS.every(c => {
      const i = state.problems[k]?.cells?.[c];
      return i != null && pr.chips[i]?.cell === c;
    }));
    const solution = params.problems.map(pr => CELLS.map(c => `${c} = ${pr.chips.find(ch => ch.cell === c).label}`).join(', ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const N = params.problems.length;
    const st = { problems: params.problems.map(() => ({ cells: { p: null, C: null, B: null } })) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], slots = {}, tray = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.problems.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const cw = Math.min(118, (w - 60) / 2), ch = 44, cx = w / 2, cy = h * 0.47;
      slots = {
        // 24 px entre las dos filas: ahí va el rótulo de la casilla de arriba.
        100: { x: cx - cw - 8, y: cy - ch - 12, w: cw, h: ch },
        p: { x: cx + 8, y: cy - ch - 12, w: cw, h: ch },
        C: { x: cx - cw - 8, y: cy + 12, w: cw, h: ch },
        B: { x: cx + 8, y: cy + 12, w: cw, h: ch },
      };
      tray = [];
      const chips = params.problems[cur].chips, tw = 70, gap = 8;
      const x0 = (w - chips.length * tw - (chips.length - 1) * gap) / 2;
      chips.forEach((_, i) => tray.push({ x: x0 + i * (tw + gap), y: h - 78, w: tw, h: 36 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const cellsOf = () => st.problems[cur].cells;
    const placedAt = i => CELLS.find(c => cellsOf()[c] === i);
    const ready = () => api.ready(st.problems.every(pr => CELLS.every(c => pr.cells[c] !== null)));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function chip(x, y, w, h, label, col, fill) {
        // Casilla vacía: solo el borde (el punteado lo pone quien llama). Ficha: crema en la bandeja, color sol ya puesta.
        if (label === '') { p.stroke(col === C.line ? C.mute : col); p.strokeWeight(1.5); p.noFill(); p.rect(x, y, w, h, 10); return; }
        const f = col === C.ok || col === C.bad ? col : col === C.brand ? C.sun : C.cream;
        drawTile(p, C, { x, y, w, h }, label, { fill: f, lift: 2, size: 15 });
      }

      p.draw = () => {
        p.background(C.bg);
        const pr = params.problems[cur], cells = cellsOf();
        tabs.forEach((t, i) => {
          const done = CELLS.every(c => st.problems[i].cells[c] !== null);
          const good = CELLS.every(c => params.problems[i].chips[st.problems[i].cells[c]]?.cell === c);
          const col = locked ? (good ? C.ok : C.bad) : i === cur ? C.brand : done ? C.Z : C.line;   // respondida (no «correcta»): azul, no verde
          const plain = col === C.line;   // ficha de ronda, como las de drawTabs
          drawTile(p, C, t, i + 1, { fill: plain ? C.card : col, ink: plain ? C.mute : undefined, r: 8, lift: 0, size: 14, ring: i === cur ? C.sun : null });
        });
        p.noStroke(); p.fill(C.N); p.textAlign(p.LEFT, p.CENTER); p.textSize(14); p.textStyle(p.BOLD);
        p.text(pr.text, 12, 62, W - 24, 44);
        // Cruz: 100 fijo y tres casillas.
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.BOTTOM);
        p.text('de cada 100  →  del total C', W / 2, slots[100].y - 10);
        chip(slots[100].x, slots[100].y, slots[100].w, slots[100].h, '100', C.mute, C.card);
        CELLS.forEach(c => {
          const s = slots[c], i = cells[c];
          const good = i !== null && pr.chips[i].cell === c;
          const col = locked ? (good ? C.ok : C.bad) : i !== null ? C.brand : C.line;
          if (i === null) { p.drawingContext.setLineDash([5, 4]); chip(s.x, s.y, s.w, s.h, '', col, C.bg); p.drawingContext.setLineDash([]); }
          else chip(s.x, s.y, s.w, s.h, pr.chips[i].label, col, C.card);
          p.noStroke(); p.fill(i === null ? C.mute : col); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.NORMAL);
          p.text(`${c} · ${NAMES[c]}`, s.x + s.w / 2, s.y + s.h + 3);
        });
        p.stroke(C.line); p.strokeWeight(1.5);
        p.line(W / 2, slots[100].y - 2, W / 2, slots.B.y + slots.B.h + 2);
        // Bandeja.
        pr.chips.forEach((ch, i) => {
          if (placedAt(i) !== undefined || (drag && drag.i === i)) return;
          chip(tray[i].x, tray[i].y, tray[i].w, tray[i].h, ch.label, C.Z, C.card);
        });
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.NORMAL);
        p.text(locked ? grade(st, params).ok ? '¡Cruz armada!' : 'Mira la solución' : 'Arrastra cada ficha a su casilla; la «?» va en la incógnita', W / 2, H - 12);
        if (drag) chip(p.mouseX - 35, p.mouseY - 18, 70, 36, pr.chips[drag.i].label, C.brand, C.card);
      };

      p.mousePressed = () => {
        if (locked) return;
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; layout(W, H); api.sfx?.tap?.(); return false; }
        const cells = cellsOf();
        for (const c of CELLS) if (cells[c] !== null && inside(slots[c], p.mouseX, p.mouseY)) { drag = { i: cells[c] }; cells[c] = null; ready(); return false; }
        const i = tray.findIndex((b, i) => placedAt(i) === undefined && inside(b, p.mouseX, p.mouseY));
        if (i >= 0) { drag = { i }; return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const cells = cellsOf();
        const c = CELLS.find(c => inside(slots[c], p.mouseX, p.mouseY));
        if (c) { cells[c] = drag.i; api.sfx?.tap?.(); }  // la ficha que estaba vuelve sola a la bandeja
        drag = null;
        ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ problems: st.problems.map(pr => ({ cells: { ...pr.cells } })) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
