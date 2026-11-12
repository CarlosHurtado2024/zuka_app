// Pirámide numérica (evaluaciones). Cada bloque es la suma (o el producto) de los dos bloques que lo
// sostienen. Algunos bloques están vacíos: se arrastran fichas desde la bandeja (también se puede tocar
// una ficha y luego el bloque). Hay fichas trampa (el signo cambiado, el exponente equivocado…).
// Tocar un bloque lleno devuelve su ficha.
// params = { op: 'sum' | 'prod', rows: [[{ t, v } | null, …] desde la fila de abajo], tokens: [{ t, v }] }
// state = { fill: [[índice de ficha | null, …] por fila] }

GAMES['piramide-numerica'] = (() => {
  const apply = (op, a, b) => (op === 'prod' ? a * b : a + b);
  const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  const blanks = params => params.rows.flatMap((row, r) => row.map((c, k) => (c === null ? [r, k] : null)).filter(Boolean));

  function consistent(params, fill) {
    const val = (r, k) => (params.rows[r][k] ? params.rows[r][k].v : params.tokens[fill?.[r]?.[k]]?.v);
    const used = blanks(params).map(([r, k]) => fill?.[r]?.[k]);
    if (used.some(u => u == null || !params.tokens[u]) || new Set(used).size !== used.length) return false;
    for (let r = 1; r < params.rows.length; r++) {
      for (let k = 0; k < params.rows[r].length; k++) if (!near(val(r, k), apply(params.op, val(r - 1, k), val(r - 1, k + 1)))) return false;
    }
    return true;
  }

  function solve(params) {
    const B = blanks(params), fill = params.rows.map(row => row.map(() => null));
    const go = i => {
      if (i === B.length) return consistent(params, fill);
      for (let t = 0; t < params.tokens.length; t++) {
        if (B.some(([r, k], j) => j < i && fill[r][k] === t)) continue;
        fill[B[i][0]][B[i][1]] = t;
        if (go(i + 1)) return true;
      }
      fill[B[i][0]][B[i][1]] = null;
      return false;
    };
    return go(0) ? { fill: fill.map(r => [...r]) } : null;
  }

  function grade(state, params) {
    const s = solve(params);
    const solution = s ? blanks(params).map(([r, k]) => params.tokens[s.fill[r][k]].t).join(', ') : '';
    return { ok: consistent(params, state.fill), solution: `Los bloques vacíos (de abajo hacia arriba): ${solution}` };
  }

  // Alto del lienzo según el contenido (no según el ancho): así cabe igual en un celular de 300 px.
  const aspectFor = (host, px) => Math.max(1, px / Math.max(240, Math.floor(host.clientWidth || 320)));

  function create(host, params, api) {
    const C = api.palette, rows = params.rows, toks = params.tokens;
    const fill = rows.map(row => row.map(() => null));
    const order = shuffledOrder(toks.length, `pir${toks.map(t => t.t).join()}`);
    let locked = false, W = 0, H = 0, drag = null, sel = null, sol = null;

    const geo = () => {
      const n = rows[0].length, bw = Math.min((W - 16) / n, 84), bh = 42, base = 66 + rows.length * (bh + 6);
      return { n, bw, bh, base, x: (r, k) => W / 2 + (k - (rows[r].length - 1) / 2) * bw - bw / 2, y: r => base - (r + 1) * (bh + 6) };
    };
    const trayGeo = () => {
      const per = Math.min(toks.length, 4), cw = Math.min(76, (W - 16 - (per - 1) * 8) / per), ch = 38, g = geo(), y0 = g.base + 40;
      return { per, cw, ch, pos: j => ({ x: (W - (per * cw + (per - 1) * 8)) / 2 + (j % per) * (cw + 8), y: y0 + Math.floor(j / per) * (ch + 10) }) };
    };
    const placed = t => fill.some(row => row.includes(t));
    const blankAt = (x, y) => {
      const g = geo();
      for (let r = 0; r < rows.length; r++) for (let k = 0; k < rows[r].length; k++) {
        if (rows[r][k] === null && hitBox({ x: g.x(r, k), y: g.y(r), w: g.bw, h: g.bh }, x, y)) return [r, k];
      }
      return null;
    };
    const tokenAt = (x, y) => {
      const tg = trayGeo();
      const j = order.findIndex((t, j) => !placed(t) && hitBox({ ...tg.pos(j), w: tg.cw, h: tg.ch }, x, y));
      return j >= 0 ? order[j] : null;
    };
    const update = () => api.ready(blanks(params).every(([r, k]) => fill[r][k] != null));
    const place = (t, [r, k]) => { fill[r][k] = t; api.sfx?.tap?.(); update(); };

    function block(p, x, y, w, h, txt, kind) {
      const col = { given: C.line, blank: C.brand, filled: C.R, ok: C.ok, bad: C.bad }[kind];
      p.stroke(col); p.strokeWeight(kind === 'given' ? 1.5 : 2.5); p.fill(kind === 'given' ? C.card : C.bg);
      if (kind === 'blank') p.drawingContext.setLineDash([5, 4]);
      p.rect(x + 2, y, w - 4, h, 8); p.drawingContext.setLineDash([]);
      p.noStroke(); p.fill(kind === 'given' ? C.mute : C.ink); p.textStyle(p.BOLD);
      if (txt) fitText(p, txt, x + w / 2, y + h / 2, w - 12, 17);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; };
      p.onResize = () => { W = size.w; H = size.h; };

      p.draw = () => {
        p.background(C.bg);
        const g = geo(), tg = trayGeo(), good = locked && consistent(params, fill);
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, params.op === 'prod' ? 'Bloque = producto de los dos de abajo' : 'Bloque = suma de los dos de abajo', W / 2, 18, W - 20, 14);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Arrastra fichas a los bloques vacíos', W / 2, 38, W - 20, 12);
        rows.forEach((row, r) => row.forEach((c, k) => {
          const x = g.x(r, k), y = g.y(r);
          if (c) return block(p, x, y, g.bw, g.bh, c.t, 'given');
          const showSol = locked && !good;
          const t = showSol ? sol?.fill[r][k] : fill[r][k];
          block(p, x, y, g.bw, g.bh, t != null ? toks[t].t : '', locked ? (good || showSol ? 'ok' : 'bad') : t != null ? 'filled' : 'blank');
        }));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11);
        if (locked && !good) p.text('Así quedaba la pirámide', W / 2, g.base + 18);
        order.forEach((t, j) => {
          if (placed(t) || (drag && drag.t === t)) return;
          const q = tg.pos(j);
          p.stroke(sel === t ? C.brand : C.N); p.strokeWeight(sel === t ? 3 : 2); p.fill(C.card); p.rect(q.x, q.y, tg.cw, tg.ch, 19);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); fitText(p, toks[t].t, q.x + tg.cw / 2, q.y + tg.ch / 2, tg.cw - 10, 16);
        });
        if (drag) {
          p.stroke(C.brand); p.strokeWeight(3); p.fill(C.card); p.rect(drag.x - tg.cw / 2, drag.y - tg.ch / 2, tg.cw, tg.ch, 19);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); fitText(p, toks[drag.t].t, drag.x, drag.y, tg.cw - 10, 16);
        }
      };

      p.mousePressed = () => {
        if (locked) return;
        const x = p.mouseX, y = p.mouseY, t = tokenAt(x, y);
        if (t != null) { drag = { t, x, y, x0: x, y0: y }; return false; }
        const b = blankAt(x, y);
        if (!b) return;   // un toque en vacío (o un desplazamiento) no quita la ficha elegida
        if (sel != null) { place(sel, b); sel = null; } else if (fill[b[0]][b[1]] != null) { fill[b[0]][b[1]] = null; api.sfx?.tap?.(); update(); }
        return false;
      };
      p.mouseDragged = () => { if (drag) { drag.x = p.mouseX; drag.y = p.mouseY; return false; } };
      p.mouseReleased = () => {
        if (!drag) return;
        const d = drag; drag = null;
        if (Math.hypot(d.x - d.x0, d.y - d.y0) < 8) { sel = sel === d.t ? null : d.t; api.sfx?.tap?.(); return; }
        const b = blankAt(d.x, d.y);
        if (b) { place(d.t, b); sel = null; }
      };
    }, aspectFor(host, 66 + params.rows.length * 48 + 40 + 48 * Math.ceil(params.tokens.length / 4) + 24));

    return {
      loaded: m.ready,
      getState: () => ({ fill: fill.map(r => [...r]) }),
      lock() { locked = true; drag = null; sel = null; sol = solve(params); },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, solve };
})();
