// La serpiente ordenada (Álgebra 1.2, axiomas de orden y valor absoluto; juego dinámico de la lección alg-12d): una
// serpiente avanza sola por una cuadrícula y gira hacia donde se toca. En la cuadrícula hay fichas con números
// («−5», «3/2», «|−4|») y hay que comérselas de menor a mayor. Morder una que no es la menor quita una vida (la ficha
// se queda). Al salir por un borde, la serpiente entra por el otro. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ label, value }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-valle.

GAMES['serpiente-orden'] = (() => {
  const COLS = 7, ROWS = 8;
  // Índice de la ficha que toca comer: la de menor valor entre las que quedan (−1 si no queda ninguna).
  function nextIndex(items, eaten) {
    let best = -1;
    items.forEach((it, i) => { if (!eaten.includes(i) && (best < 0 || it.value < items[best].value)) best = i; });
    return best;
  }
  // Nueva dirección al tocar a (dx, dy) de la cabeza: hacia el lado donde más lejos quedó el toque; nunca se devuelve.
  function turnTo(dir, dx, dy) {
    const nd = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if ((nd.x === 0 && nd.y === 0) || (nd.x === -dir.x && nd.y === -dir.y)) return { x: dir.x, y: dir.y };
    return nd;
  }
  const stepCell = (cell, dir, cols, rows) => ({ c: (cell.c + dir.x + cols) % cols, r: (cell.r + dir.y + rows) % rows });

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => [...r.items].sort((x, y) => x.value - y.value).map(it => it.label).join(' < ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, grid = { x0: 0, y0: 0, cell: 0 }, snake = [], dir = { x: 1, y: 0 }, want = null, acc = 0, eaten = [], spots = [], safeK = -1, n = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; reset(i); },
      lost(i) { st.done[i] = 0; },
    });
    const px = cell => ({ x: grid.x0 + (cell.c + 0.5) * grid.cell, y: grid.y0 + (cell.r + 0.5) * grid.cell });

    function layout(w, h) {
      W = w; H = h;
      const top = 96, cell = Math.min((w - 20) / COLS, (h - top - 34) / ROWS);
      grid = { x0: (w - cell * COLS) / 2, y0: top, cell };
    }
    // Empieza la ronda: la serpiente en el centro y las fichas repartidas lejos de ella y sin tocarse.
    function reset(i) {
      snake = [{ c: 2, r: 4 }, { c: 1, r: 4 }, { c: 0, r: 4 }]; dir = { x: 1, y: 0 }; want = null; acc = 0; eaten = []; safeK = -1;
      const free = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (r !== 4 && (c + r) % 2 === 0) free.push({ c, r });
      const order = shuffledOrder(free.length, R[i].title + (n++));
      spots = R[i].items.map((_, k) => free[order[k]]);
    }
    const period = () => Math.max(0.24, 0.36 - a.cur * 0.03);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function advance() {
        if (want) { dir = want; want = null; }
        const head = stepCell(snake[0], dir, COLS, ROWS), items = R[a.cur].items;
        snake.unshift(head);
        const k = spots.findIndex((s, i) => !eaten.includes(i) && s.c === head.c && s.r === head.r);
        if (k >= 0 && k === nextIndex(items, eaten)) {
          eaten.push(k); st.done[a.cur]++; a.hit(); a.say(`${items[k].label}: era la menor`, C.ok);   // crece: no se quita la cola
          if (eaten.length === items.length) { a.win(); return; }
        } else {
          snake.pop();
          if (k >= 0 && k !== safeK) { a.say(`${items[k].label} no es la menor que queda`, C.bad); a.miss(); }
          safeK = k;
        }
      }
      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        acc += dt;
        while (acc >= period() && a.phase === 'play') { acc -= period(); advance(); }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], g = grid, items = r.items;

        // La cuadrícula.
        p.noStroke(); p.fill(C.card); p.rect(g.x0 - 4, g.y0 - 4, g.cell * COLS + 8, g.cell * ROWS + 8, 12);
        p.stroke(C.line); p.strokeWeight(0.8);
        for (let c = 1; c < COLS; c++) p.line(g.x0 + c * g.cell, g.y0, g.x0 + c * g.cell, g.y0 + ROWS * g.cell);
        for (let k = 1; k < ROWS; k++) p.line(g.x0, g.y0 + k * g.cell, g.x0 + COLS * g.cell, g.y0 + k * g.cell);
        // Las fichas que quedan.
        if (a.phase !== 'idle') spots.forEach((s, i) => {
          if (eaten.includes(i)) return;
          drawTile(p, C, { x: g.x0 + s.c * g.cell + 2, y: g.y0 + s.r * g.cell + 2, w: g.cell - 4, h: g.cell - 6 }, items[i].label, { size: Math.min(15, g.cell * 0.4), r: 7, lift: 2 });
        });
        // La serpiente: cuerpo menta y cabeza con ojos.
        if (a.phase !== 'idle') snake.forEach((s, i) => {
          const c = px(s), d = g.cell * (i === 0 ? 0.86 : 0.7);
          p.noStroke(); p.fill(i === 0 ? C.mint : shade(C.mint, i % 2 ? 0.86 : 0.94)); p.rect(c.x - d / 2, c.y - d / 2, d, d, d * 0.32);
          if (i === 0) { const ex = dir.x * d * 0.18, ey = dir.y * d * 0.18, sx = dir.y * d * 0.2, sy = dir.x * d * 0.2; p.fill(C.night); p.circle(c.x + ex + sx, c.y + ey + sy, d * 0.18); p.circle(c.x + ex - sx, c.y + ey - sy, d * 0.18); }
        });

        // Encabezado: ronda, vidas y qué se lleva comido, en orden.
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, 'Cómelas de menor a mayor', W / 2, 44, W - 24, 15);
        p.fill(C.N); fitText(p, eaten.length ? eaten.map(i => items[i].label).join(' < ') + (eaten.length < items.length ? ' < …' : '') : r.title, W / 2, 70, W - 24, 13);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = g.y0 + (g.cell * ROWS) / 2;
        if (locked || a.phase === 'all') {
          p.noStroke(); p.fill(C.card); p.rect(g.x0, mid - R.length * 13 - 8, g.cell * COLS, R.length * 26 + 16, 10);
          drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: [...rr.items].sort((x, y) => x.value - y.value).map(it => it.label).join(' < ') })), mid, g.cell * COLS - 16);
        } else drawArcadeBanner(p, C, a, mid, { idle: 'Toca hacia donde quieres que gire', lost: 'Demasiados mordiscos fuera de orden' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Todo en orden! Ya puedes comprobar' : 'Rodea las fichas que todavía no tocan', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play') { const h = px(snake[0]); want = turnTo(dir, p.mouseX - h.x, p.mouseY - h.y); }
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, grid, cols: COLS, rows: ROWS, head: snake[0], dir, next: nextIndex(R[a.cur].items, eaten), spots: spots.map((s, i) => ({ c: s.c, r: s.r, gone: eaten.includes(i) })) }),
    };
  }

  return { grade, create, nextIndex, turnTo, stepCell };
})();
