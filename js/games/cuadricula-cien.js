// Pinta el porcentaje (lección 1.3): una cuadrícula de 10 × 10 que se pinta arrastrando el dedo.
// Tres rondas («35 %», «3/4», «0,08»): hay que dejar pintadas exactamente las casillas que pide
// cada una (por ciento = de cada 100).
// params = { rounds: [{ ask, count }] }   state = { counts: (número | null)[] }

GAMES['cuadricula-cien'] = (() => {
  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.counts[i] === r.count);
    const asks = params.rounds.map(r => r.ask), counts = params.rounds.map(r => r.count);
    const list = a => a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];
    return { ok, solution: `${list(asks)} son ${list(counts)} casillas de 100` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const N = params.rounds.length;
    const cells = params.rounds.map(() => new Array(100).fill(false));
    const st = { counts: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, round = 0, paint = null, grid = null, tabs = [], nextBtn = null;

    function layout(w, h) {
      W = w; H = h;
      const size = Math.min(w - 24, h - 130);
      grid = { x: (w - size) / 2, y: 60, s: size, c: size / 10 };
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * ((w - 24) / N), y: 8, w: (w - 24) / N - 6, h: 40 }));
      nextBtn = { x: grid.x + grid.s - 150, y: grid.y + grid.s + 12, w: 150, h: 34 };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const cellAt = (x, y) => {
      const i = Math.floor((x - grid.x) / grid.c), j = Math.floor((y - grid.y) / grid.c);
      return i >= 0 && i < 10 && j >= 0 && j < 10 ? j * 10 + i : -1;
    };
    const count = k => cells[k].filter(Boolean).length;
    function setCell(idx, v) {
      if (idx < 0 || cells[round][idx] === v) return;
      cells[round][idx] = v;
      st.counts[round] = count(round);
      api.ready(st.counts.every(c => c !== null));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function mini(k, x, y, s) {
        for (let i = 0; i < 100; i++) {
          p.fill(cells[k][i] ? C.N : C.line); p.noStroke();   // C.N: en el tema claro el sol casi no se distingue de lo vacío
          p.rect(x + (i % 10) * s, y + Math.floor(i / 10) * s, s - 0.6, s - 0.6);
        }
      }

      p.draw = () => {
        p.background(C.bg);
        // Pestañas de ronda (con miniatura de las rondas ya tocadas).
        tabs.forEach((t, i) => {
          const good = st.counts[i] === params.rounds[i].count;
          const col = locked ? (good ? C.ok : C.bad) : i === round ? C.brand : C.line;
          p.stroke(col); p.strokeWeight(i === round ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 10);
          p.noStroke(); p.fill(i === round || locked ? C.ink : C.mute); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
          p.text(params.rounds[i].ask, t.x + 10, t.y + t.h / 2);
          if (st.counts[i] !== null) mini(i, t.x + t.w - 34, t.y + 5, 3);
        });
        // Cuadrícula.
        const g = cells[round];
        for (let i = 0; i < 100; i++) {
          const x = grid.x + (i % 10) * grid.c, y = grid.y + Math.floor(i / 10) * grid.c;
          p.stroke(C.line); p.strokeWeight(1); p.fill(g[i] ? C.sun : C.card);
          p.rect(x, y, grid.c, grid.c, 3);
        }
        const n = count(round), good = n === params.rounds[round].count;
        const col = locked ? (good ? C.ok : C.bad) : C.N;
        p.noStroke(); p.fill(col); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(18);
        p.text(`${n} de 100`, grid.x + 2, nextBtn.y + nextBtn.h / 2);
        if (!locked && round < N - 1) {
          drawTile(p, C, nextBtn, 'Siguiente ronda →', { fill: C.sky, size: 14 });
        }
        p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.NORMAL);
        p.text(locked && !good ? `Eran ${params.rounds[round].count} casillas` : 'Arrastra el dedo para pintar; vuelve a pasar para borrar', W / 2, H - 12);
      };

      p.mousePressed = () => {
        if (locked) return;
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { round = t; api.sfx?.tap?.(); return false; }
        if (round < N - 1 && inside(nextBtn, p.mouseX, p.mouseY)) { round++; api.sfx?.tap?.(); return false; }
        const idx = cellAt(p.mouseX, p.mouseY);
        if (idx < 0) return;
        paint = !cells[round][idx];
        setCell(idx, paint);
        return false;
      };
      p.mouseDragged = () => {
        if (locked || paint === null) return;
        setCell(cellAt(p.mouseX, p.mouseY), paint);
        return false;
      };
      p.mouseReleased = () => {
        if (paint === null) return;
        paint = null;
        api.sfx?.tap?.();
        return false;
      };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ counts: [...st.counts] }),
      lock() { locked = true; paint = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
