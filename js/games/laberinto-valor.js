// Laberinto de valores (evaluaciones). Una cuadrícula de casillas con números o afirmaciones; se traza un
// camino de la entrada (verde) a la salida (bandera) pisando solo las casillas que cumplen la regla del
// enunciado. Se avanza tocando o arrastrando por casillas vecinas (arriba, abajo, izquierda, derecha); tocar
// la última casilla del camino la quita, y tocar una anterior recorta el camino hasta ahí.
// params = { rule, rounds: [{ cols, cells: [{ t, ok }], start, end }] }   state = { paths: [[índice, …] por ronda] }

GAMES['laberinto-valor'] = (() => {
  const adj = (a, b, cols) => {
    const ra = Math.floor(a / cols), ca = a % cols, rb = Math.floor(b / cols), cb = b % cols;
    return Math.abs(ra - rb) + Math.abs(ca - cb) === 1;
  };
  const valid = (path, r) => Array.isArray(path) && path.length > 1 && path[0] === r.start && path[path.length - 1] === r.end
    && new Set(path).size === path.length && path.every(k => r.cells[k]?.ok)
    && path.every((k, i) => i === 0 || adj(path[i - 1], k, r.cols));

  // Camino más corto por casillas válidas (BFS), o null.
  function shortest(r) {
    const prev = new Map([[r.start, -1]]), q = [r.start];
    if (!r.cells[r.start]?.ok) return null;
    while (q.length) {
      const k = q.shift();
      if (k === r.end) { const p = []; for (let x = k; x !== -1; x = prev.get(x)) p.unshift(x); return p; }
      const row = Math.floor(k / r.cols), col = k % r.cols, rows = Math.ceil(r.cells.length / r.cols);
      [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([a, b]) => {
        if (a < 0 || b < 0 || a >= rows || b >= r.cols) return;
        const n = a * r.cols + b;
        if (r.cells[n]?.ok && !prev.has(n)) { prev.set(n, k); q.push(n); }
      });
    }
    return null;
  }

  function solve(params) {
    const paths = params.rounds.map(shortest);
    return paths.every(Boolean) ? { paths } : null;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => valid(state.paths?.[i], r));
    const solution = params.rounds.map(r => (shortest(r) || []).map(k => r.cells[k].t).join(' → ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const P = R.map(r => [r.start]);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], dragging = false;

    function layout(w, h) { W = w; H = h; tabs = R.length > 1 ? roundTabs(R.length, w) : []; }
    const geo = () => {
      const r = R[cur], rows = Math.ceil(r.cells.length / r.cols), top = R.length > 1 ? 84 : 52;
      const s = Math.min((W - 20) / r.cols, (H - top - 12) / rows);
      return { r, rows, s, x0: (W - s * r.cols) / 2, y0: top };
    };
    const cellAt = (x, y) => {
      const g = geo(), c = Math.floor((x - g.x0) / g.s), rr = Math.floor((y - g.y0) / g.s);
      return c >= 0 && rr >= 0 && c < g.r.cols && rr < g.rows ? rr * g.r.cols + c : -1;
    };
    const update = () => api.ready(P.every((p, i) => p[p.length - 1] === R[i].end));

    // Toque en una casilla: quitar la última, recortar o avanzar a una vecina libre.
    function touch(k, fromDrag) {
      const p = P[cur], r = R[cur];
      if (k < 0 || !r.cells[k]) return;
      const at = p.indexOf(k);
      if (at >= 0) {
        if (fromDrag) { if (at === p.length - 2) p.pop(); }
        else if (at === p.length - 1 && p.length > 1) p.pop();
        else p.length = at + 1;
      } else if (adj(p[p.length - 1], k, r.cols) && p[p.length - 1] !== r.end) {
        p.push(k); api.sfx?.tap?.();
      } else return;
      update();
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const g = geo(), r = g.r, path = P[cur], good = valid(path, r);
        if (tabs.length) drawTabs(p, C, tabs, cur, i => (locked ? (valid(P[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : P[i].length > 1 ? C.R : C.line));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, params.rule, W / 2, g.y0 - 22, W - 24, 15);
        const show = locked && !good ? shortest(r) || [] : path;
        const pathCol = locked ? C.ok : C.brand;
        r.cells.forEach((cell, k) => {
          const x = g.x0 + (k % r.cols) * g.s, y = g.y0 + Math.floor(k / r.cols) * g.s, pad = 3;
          const on = show.includes(k), wrongStep = locked && !good && path.includes(k) && !cell.ok;
          p.stroke(wrongStep ? C.bad : on ? pathCol : C.line); p.strokeWeight(on || wrongStep ? 3 : 1.5);
          p.fill(on ? p.color(...hexA(pathCol, 0.18)) : C.card);
          p.rect(x + pad, y + pad, g.s - 2 * pad, g.s - 2 * pad, 10);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
          const cy = y + g.s / 2 + (k === r.start || k === r.end ? g.s * 0.1 : 0), maxW = g.s - 12, fs = Math.min(17, g.s * 0.3);
          p.textSize(11);
          // Corte en el espacio más cercano al centro que no quede dentro de |…|.
          const sp = [...cell.t].reduce((best, ch, i) => (ch === ' ' && (cell.t.slice(0, i).split('|').length % 2 === 1)
            && (best < 0 || Math.abs(i - cell.t.length / 2) < Math.abs(best - cell.t.length / 2)) ? i : best), -1);
          if (p.textWidth(cell.t) > maxW && sp > 0) {   // texto largo en casilla angosta: dos líneas
            fitText(p, cell.t.slice(0, sp), x + g.s / 2, cy - 8, maxW, Math.min(fs, 14));
            fitText(p, cell.t.slice(sp + 1), x + g.s / 2, cy + 8, maxW, Math.min(fs, 14));
          } else fitText(p, cell.t, x + g.s / 2, cy, maxW, fs);
          if (k === r.start || k === r.end) {
            p.fill(k === r.start ? C.ok : C.N); p.textSize(Math.min(10, g.s * 0.15)); p.textStyle(p.BOLD);
            p.text(k === r.start ? 'ENTRADA' : 'SALIDA ⚑', x + g.s / 2, y + 3 + g.s * 0.12);
          }
        });
        // Puentes entre casillas seguidas del camino (en el borde, sin tapar el texto)
        p.stroke(pathCol); p.strokeWeight(6); p.strokeCap(p.ROUND);
        const ctr = k => [g.x0 + (k % r.cols + 0.5) * g.s, g.y0 + (Math.floor(k / r.cols) + 0.5) * g.s];
        show.forEach((k, i) => {
          if (!i) return;
          const [ax, ay] = ctr(show[i - 1]), [bx, by] = ctr(k), mx = (ax + bx) / 2, my = (ay + by) / 2;
          const dx = Math.sign(bx - ax) * 9, dy = Math.sign(by - ay) * 9;
          p.line(mx - dx, my - dy, mx + dx, my + dy);
        });
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const k = cellAt(x, y);
        if (k < 0) return;
        dragging = true; touch(k, false); return false;
      };
      p.mouseDragged = () => {
        if (!dragging || locked) return;
        const k = cellAt(p.mouseX, p.mouseY);
        if (k >= 0 && k !== P[cur][P[cur].length - 1]) touch(k, true);
        return false;
      };
      p.mouseReleased = () => { dragging = false; };
    }, (() => {   // alto para que las casillas salgan cuadradas con el ancho disponible (también a 260 px)
      const w = Math.max(240, Math.floor(host.clientWidth || 320)), top = R.length > 1 ? 84 : 52;
      return Math.max(...R.map(r => (top + Math.ceil(r.cells.length / r.cols) * ((w - 20) / r.cols) + 12) / w));
    })());

    // Color con transparencia a partir de un hex de la paleta.
    function hexA(hex, a) {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255, Math.round(a * 255)];
    }

    return {
      loaded: m.ready,
      getState: () => ({ paths: P.map(p => [...p]) }),
      lock() { locked = true; dragging = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, solve };
})();
