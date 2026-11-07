// Arma la sigma (lección 1.5): una Σ grande con tres casillas, el índice inicial (abajo), el
// límite superior (arriba) y el término general (al lado); se arrastran fichas a las casillas
// para representar la suma del enunciado. Varias rondas con pestañas; las fichas con cell = null
// son distractores (el último valor en vez del número de términos, otro término…).
// params = { rounds: [{ text, chips: [{ label, cell: 'lower' | 'upper' | 'term' | null }] }] }
// state = { rounds: [{ cells: { lower, upper, term } }] }

GAMES['arma-sigma'] = (() => {
  const CELLS = ['lower', 'upper', 'term'];

  function grade(state, params) {
    const ok = params.rounds.every((r, k) => CELLS.every(c => {
      const i = state.rounds[k]?.cells?.[c];
      return i != null && r.chips[i]?.cell === c;
    }));
    const sigma = r => { const f = c => r.chips.find(ch => ch.cell === c).label; return `Σ (${f('lower').replace(/\s/g, '')} … ${f('upper')}) de ${f('term')}`; };
    return { ok, solution: params.rounds.map(r => `${r.text} = ${sigma(r)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { rounds: params.rounds.map(() => ({ cells: { lower: null, upper: null, term: null } })) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], slots = {}, tray = [], drag = null, sig = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      // Se reparte de arriba abajo: pestañas (8–38), enunciado (46–86), casilla «hasta» desde 92,
      // la Σ, la casilla «desde» y, con 24 px de margen, la bandeja anclada al pie. La Σ se encoge
      // para que todo quepa (lienzo alto, aspecto 1.45).
      const chips = params.rounds[cur].chips, cols = Math.min(chips.length, 3), tw = Math.min(90, (w - 24 - (cols - 1) * 8) / cols), gap = (w - 24 - cols * tw) / Math.max(1, cols - 1);
      const rows = Math.ceil(chips.length / cols), trayTop = h - 34 - rows * 42;
      tray = chips.map((_, i) => ({ x: 12 + (i % cols) * (tw + gap), y: trayTop + Math.floor(i / cols) * 42, w: tw, h: 34 }));
      const sw = Math.min(96, w * 0.28), sh = 34, upperY = 92;
      const size = Math.max(44, Math.min(90, w * 0.26, trayTop - 24 - sh - 6 - 6 - sh - upperY));
      sig = { x: 46 + sw / 2, y: upperY + sh + 6 + size / 2, size };
      slots = {
        upper: { x: sig.x - sw / 2, y: upperY, w: sw, h: sh },
        lower: { x: sig.x - sw / 2, y: sig.y + size / 2 + 6, w: sw, h: sh },
        term: { x: sig.x + size / 2 + 14, y: sig.y - sh / 2, w: Math.min(110, w - (sig.x + size / 2 + 14) - 12), h: sh },
      };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const cellsOf = () => st.rounds[cur].cells;
    const placedAt = i => CELLS.find(c => cellsOf()[c] === i);
    const ready = () => api.ready(st.rounds.every(r => CELLS.every(c => r.cells[c] !== null)));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function chip(b, label, col, fill = C.card, dashed = false) {
        if (dashed) p.drawingContext.setLineDash([5, 4]);
        p.stroke(col); p.strokeWeight(2); p.fill(fill); p.rect(b.x, b.y, b.w, b.h, 9);
        p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(b.w < 70 ? 12 : 14);
        p.text(label, b.x + b.w / 2, b.y + b.h / 2);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], cells = cellsOf();
        tabs.forEach((t, i) => {
          const done = CELLS.every(c => st.rounds[i].cells[c] !== null);
          const good = CELLS.every(c => params.rounds[i].chips[st.rounds[i].cells[c]]?.cell === c);
          const col = locked ? (good ? C.ok : C.bad) : i === cur ? C.brand : done ? C.ok : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(15);
        p.text(r.text, 12, 46, W - 24, 40);
        // La sigma.
        p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(sig.size); p.textFont('serif');
        p.text('Σ', sig.x, sig.y); p.textFont('system-ui');
        const NAMES = { upper: 'hasta', lower: 'desde', term: 'término' };
        CELLS.forEach(c => {
          const s = slots[c], i = cells[c], good = i !== null && r.chips[i].cell === c;
          const col = locked ? (good ? C.ok : C.bad) : i !== null ? C.brand : C.line;
          if (i === null) chip(s, '', col, C.bg, true); else chip(s, r.chips[i].label, col);
          // Rótulo: «hasta»/«desde» a la izquierda de su casilla, «término» debajo; la corrección
          // (bloqueado) a la derecha de la casilla, o debajo en el término.
          p.noStroke(); p.fill(i === null ? C.mute : col); p.textSize(10); p.textStyle(p.NORMAL);
          if (c === 'term') { p.textAlign(p.CENTER, p.TOP); p.text(NAMES[c], s.x + s.w / 2, s.y + s.h + 3); }
          else { p.textAlign(p.RIGHT, p.CENTER); p.text(NAMES[c], s.x - 5, s.y + s.h / 2); }
          if (locked && !good) {
            p.fill(C.ok); p.textSize(11); p.textStyle(p.BOLD);
            const want = `→ ${r.chips.find(ch => ch.cell === c).label}`;
            if (c === 'term') { p.textAlign(p.CENTER, p.TOP); p.text(want, s.x + s.w / 2, s.y + s.h + 15); }
            else { p.textAlign(p.LEFT, p.CENTER); p.text(want, s.x + s.w + 6, s.y + s.h / 2); }
          }
        });
        if (!locked) r.chips.forEach((ch, i) => { if (placedAt(i) === undefined && !(drag && drag.i === i)) chip(tray[i], ch.label, C.Z); });
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Sigmas bien armadas!' : 'Mira las fichas en verde') : 'Arrastra cada ficha a su casilla; sobran fichas', 12, H - 24, W - 24, 22);
        if (drag) chip({ x: p.mouseX - 45, y: p.mouseY - 17, w: 90, h: 34 }, r.chips[drag.i].label, C.brand);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const cells = cellsOf();
        for (const c of CELLS) if (cells[c] !== null && inside(slots[c], p.mouseX, p.mouseY)) { drag = { i: cells[c] }; cells[c] = null; ready(); return false; }
        const i = tray.findIndex((b, i) => placedAt(i) === undefined && inside(b, p.mouseX, p.mouseY));
        if (i >= 0) { drag = { i }; return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const cells = cellsOf();
        const c = CELLS.find(c => inside({ x: slots[c].x - 6, y: slots[c].y - 8, w: slots[c].w + 12, h: slots[c].h + 16 }, p.mouseX, p.mouseY));
        if (c) { cells[c] = drag.i; api.sfx?.tap?.(); }
        drag = null;
        ready();
        return false;
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: st.rounds.map(r => ({ cells: { ...r.cells } })) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
