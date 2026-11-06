// Arma la regla (lección 1.2): para cada problema se arrastran los cuatro datos a una tabla de
// dos filas (misma magnitud por columna, misma situación por fila) y se elige el tipo de flechas:
// paralelas (directa) o cruzadas (inversa). Al bloquear se escribe la proporción que queda armada.
// params = { problems: [{ text, kind: 'directa'|'inversa', chips: [{ label, mag, row }] }] }
// state = { problems: [{ cells: [[i, i], [i, i]], arrow: 'directa'|'inversa'|null }] }

GAMES['arma-regla'] = (() => {
  const ARROWS = { directa: 'paralelas', inversa: 'cruzadas' };

  // La tabla está bien si cada columna tiene una sola magnitud y cada fila una sola situación.
  function tableOk(p, cells) {
    const idx = cells.flat();
    if (idx.some(i => i == null) || new Set(idx).size !== 4) return false;
    return cells.every((row, r) => row.every((i, c) => p.chips[i].mag === c)) &&
      cells.every(row => p.chips[row[0]].row === p.chips[row[1]].row) &&
      p.chips[cells[0][0]].row !== p.chips[cells[1][0]].row;
  }

  function grade(state, params) {
    const wrong = params.problems.map((p, k) => {
      const s = state.problems[k];
      const table = tableOk(p, s.cells), arrow = s.arrow === p.kind;
      if (table && arrow) return null;
      return `Problema ${k + 1}: ${table ? '' : 'cada columna lleva una sola magnitud y cada fila una situación; '}flechas ${ARROWS[p.kind]} (${p.kind})`;
    }).filter(Boolean);
    return { ok: !wrong.length, solution: wrong.length ? wrong.join(' · ') : 'Las dos reglas están bien armadas.' };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = params.problems.map(() => ({ cells: [[null, null], [null, null]], arrow: null }));
    let locked = false, cur = 0, W = 0, H = 0, tabs = [], cells = [], arrowBtns = [], chips = [], drag = -1, grab = { x: 0, y: 0 };
    const CH = 36;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.problems.map((_, k) => ({ x: w / 2 + (k - (params.problems.length - 1) / 2) * 70 - 30, y: 8, w: 60, h: 26 }));
      // Hueco ancho entre columnas: ahí se dibujan las flechas paralelas o cruzadas.
      const cw = (w - 84) / 2, ty = 108;
      cells = [0, 1].map(r => [0, 1].map(c => ({ x: 20 + c * (cw + 44), y: ty + r * 50, w: cw, h: CH + 4 })));
      arrowBtns = ['directa', 'inversa'].map((k, i) => ({ k, x: 12 + i * ((w - 32) / 2 + 8), y: ty + 118, w: (w - 32) / 2, h: 34 }));
      const hw = (w - 36) / 2;
      chips = params.problems.map(p => p.chips.map((c, i) => ({ ...c, i, w: hw, h: CH, hx: 12 + (i % 2) * (hw + 12), hy: ty + 196 + Math.floor(i / 2) * (CH + 10), x: 0, y: 0 })));
      chips.forEach((list, k) => list.forEach(c => { const pos = cellOf(k, c.i); c.x = pos ? pos.x + 2 : c.hx; c.y = pos ? pos.y + 2 : c.hy; }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    function cellOf(k, i) {
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) if (st[k].cells[r][c] === i) return cells[r][c];
      return null;
    }
    function place(k, c) { const pos = cellOf(k, c.i); c.tx = pos ? pos.x + 2 : c.hx; c.ty = pos ? pos.y + 2 : c.hy; }
    const ready = () => api.ready(st.every(s => s.arrow && s.cells.flat().every(i => i != null)));
    function wrap(p, text, maxW) {
      const lines = [''];
      text.split(' ').forEach(w => { const t = (lines[lines.length - 1] + ' ' + w).trim(); if (p.textWidth(t) <= maxW || !lines[lines.length - 1]) lines[lines.length - 1] = t; else lines.push(w); });
      return lines;
    }
    const num = label => label.split(' ')[0];

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); chips.forEach(l => l.forEach(c => place(0, c))); chips.forEach((l, k) => l.forEach(c => { place(k, c); c.x = c.tx; c.y = c.ty; })); };
      p.onResize = () => { layout(size.w, size.h); chips.forEach((l, k) => l.forEach(c => { place(k, c); c.x = c.tx; c.y = c.ty; })); };

      function arrows(kind, col) {
        const a = cells[0][0], b = cells[0][1], c2 = cells[1][0], d = cells[1][1];
        p.stroke(col); p.strokeWeight(3); p.noFill();
        const L = (x1, y1, x2, y2) => { p.line(x1, y1, x2, y2); const ang = Math.atan2(y2 - y1, x2 - x1); p.line(x2, y2, x2 - 9 * Math.cos(ang - 0.5), y2 - 9 * Math.sin(ang - 0.5)); p.line(x2, y2, x2 - 9 * Math.cos(ang + 0.5), y2 - 9 * Math.sin(ang + 0.5)); };
        if (kind === 'directa') { L(a.x + a.w + 2, a.y + a.h / 2, b.x - 2, b.y + b.h / 2); L(c2.x + c2.w + 2, c2.y + c2.h / 2, d.x - 2, d.y + d.h / 2); }
        else { L(a.x + a.w + 2, a.y + a.h - 4, d.x - 2, d.y + 4); L(c2.x + c2.w + 2, c2.y + 4, b.x - 2, b.y + b.h - 4); }
      }

      p.draw = () => {
        p.background(C.bg);
        const prob = params.problems[cur], s = st[cur];
        const good = locked && tableOk(prob, s.cells) && s.arrow === prob.kind;
        tabs.forEach((t, k) => {
          const done = st[k].arrow && st[k].cells.flat().every(i => i != null);
          p.stroke(k === cur ? C.brand : C.line); p.strokeWeight(2); p.fill(k === cur ? C.brand + '33' : C.card); p.rect(t.x, t.y, t.w, t.h, 13);
          p.noStroke(); p.fill(k === cur ? C.ink : C.mute); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(12);
          p.text(`${k + 1}${done ? ' ✓' : ''}`, t.x + t.w / 2, t.y + t.h / 2 + 1);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.TOP); p.textSize(13); p.textStyle(p.BOLD);
        wrap(p, prob.text, W - 24).slice(0, 3).forEach((ln, i) => p.text(ln, W / 2, 44 + i * 17));
        // Tabla.
        cells.forEach(row => row.forEach(cell => { p.stroke(C.line); p.strokeWeight(2); p.drawingContext.setLineDash([6, 5]); p.noFill(); p.rect(cell.x, cell.y, cell.w, cell.h, 10); p.drawingContext.setLineDash([]); }));
        if (s.arrow) arrows(s.arrow, locked ? (s.arrow === prob.kind ? C.ok : C.bad) : C.brand);
        arrowBtns.forEach(b => {
          const on = s.arrow === b.k;
          p.stroke(on ? C.brand : C.line); p.strokeWeight(2); p.fill(on ? C.brand + '33' : C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(13); p.text(b.k === 'directa' ? '⇉ paralelas' : '⤧ cruzadas', b.x + b.w / 2, b.y + b.h / 2 + 1);
        });
        if (locked) {
          const ch = s.cells, lab = (r, c) => (ch[r][c] == null ? '?' : num(prob.chips[ch[r][c]].label));
          const prop = prob.kind === 'directa' ? `${lab(0, 0)}/${lab(1, 0)} = ${lab(0, 1)}/${lab(1, 1)}` : `${lab(0, 0)}/${lab(1, 0)} = ${lab(1, 1)}/${lab(0, 1)}`;
          p.noStroke(); p.fill(good ? C.ok : C.bad); p.textSize(16); p.textAlign(p.CENTER, p.CENTER);
          p.text(`${prop}  ·  flechas ${ARROWS[prob.kind]}`, W / 2, arrowBtns[0].y + 58);
        } else { p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text('Arrastra los datos a la tabla y elige las flechas', W / 2, arrowBtns[0].y + 58); }
        // Fichas del problema actual.
        chips[cur].forEach(c => {
          if (c.i !== drag) { c.x = p.lerp(c.x, c.tx, 0.25); c.y = p.lerp(c.y, c.ty, 0.25); }
          // Dentro de una celda la ficha toma el ancho de la celda; en la bandeja, el suyo.
          const inCell = cellOf(cur, c.i), cw = inCell && c.i !== drag ? inCell.w - 4 : c.w;
          p.stroke(c.i === drag ? C.brand : inCell ? (locked ? (good ? C.ok : C.bad) : C.brand) : C.line); p.strokeWeight(2); p.fill(C.card); p.rect(c.x, c.y, cw, c.h, 9);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(Math.min(14, cw / 8)); p.text(c.label, c.x + cw / 2, c.y + c.h / 2 + 1);
        });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = arrowBtns.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { st[cur].arrow = b.k; api.sfx?.tap?.(); ready(); return false; }
        for (let k = chips[cur].length - 1; k >= 0; k--) {
          const c = chips[cur][k];
          if (inside({ x: c.x, y: c.y, w: c.w, h: c.h }, p.mouseX, p.mouseY)) { drag = c.i; grab = { x: p.mouseX - c.x, y: p.mouseY - c.y }; api.sfx?.tap?.(); return false; }
        }
      };
      p.mouseDragged = () => {
        if (drag < 0) return;
        const c = chips[cur][drag];
        c.x = p.constrain(p.mouseX - grab.x, 0, W - c.w); c.y = p.constrain(p.mouseY - grab.y, 0, H - c.h);
        return false;
      };
      p.mouseReleased = () => {
        if (drag < 0) return;
        const s = st[cur], from = (() => { for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) if (s.cells[r][c] === drag) return [r, c]; return null; })();
        let target = null;
        for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) if (inside(cells[r][c], p.mouseX, p.mouseY)) target = [r, c];
        if (from) s.cells[from[0]][from[1]] = null;
        if (target) {
          // Soltar sobre un hueco ocupado intercambia las dos fichas.
          const other = s.cells[target[0]][target[1]];
          if (other != null && from) s.cells[from[0]][from[1]] = other;
          s.cells[target[0]][target[1]] = drag;
        }
        drag = -1;
        chips[cur].forEach(c => place(cur, c));
        ready();
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ problems: st.map(s => ({ cells: s.cells.map(r => [...r]), arrow: s.arrow })) }),
      lock() { locked = true; const bad = params.problems.findIndex((p, k) => !(tableOk(p, st[k].cells) && st[k].arrow === p.kind)); if (bad >= 0) cur = bad; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
