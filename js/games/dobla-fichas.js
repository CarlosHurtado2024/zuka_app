// Dobla las fichas (Álgebra, progresiones geométricas; juego dinámico de la lección alg-14c): un tablero de 4 × 4
// como el del 2048. Se desliza el dedo hacia un lado y todas las fichas se corren hacia allá; dos fichas iguales que
// chocan se funden en una que vale el doble. Las fichas son los términos de una progresión geométrica de razón 2 que
// empieza en a₁ (5, 10, 20, 40…): la meta de la ronda es armar un término dado. Arriba se van encendiendo los
// términos alcanzados. Si el tablero se llena y no queda jugada, la ronda empieza otra vez.
// params = { rounds: [{ title, base, n }] }   (meta: el término n, base · 2ⁿ⁻¹)   state = { done: [0 | 1] }
// Spec 2026-11-13-juegos-dinamicos-progresiones.

GAMES['dobla-fichas'] = (() => {
  const N = 4, DIRS = { left: [0, 1], right: [3, -1], up: [0, 1], down: [3, -1] };
  const goalOf = r => r.base * 2 ** (r.n - 1);
  // Qué término de la progresión es `value` (1 para la base, 2 para el doble…).
  const termIndex = (value, base) => Math.round(Math.log2(value / base)) + 1;
  // Corre una fila hacia el inicio: los ceros son huecos y dos iguales seguidas se funden una sola vez.
  function slide(line) {
    const xs = line.filter(v => v), out = [];
    let merged = 0;
    for (let i = 0; i < xs.length; i++) {
      if (xs[i] === xs[i + 1]) { out.push(xs[i] * 2); merged = Math.max(merged, xs[i] * 2); i++; } else out.push(xs[i]);
    }
    while (out.length < line.length) out.push(0);
    return { line: out, moved: out.some((v, i) => v !== line[i]), merged };
  }
  // Mueve todo el tablero (arreglo de 16, por filas) hacia dir: 'left' | 'right' | 'up' | 'down'.
  function move(grid, dir) {
    const g = [...grid], [start, stepK] = DIRS[dir], vertical = dir === 'up' || dir === 'down';
    let moved = false, merged = 0;
    for (let k = 0; k < N; k++) {
      const idx = Array.from({ length: N }, (_, j) => { const q = start + stepK * j; return vertical ? q * N + k : k * N + q; });
      const res = slide(idx.map(i => g[i]));
      res.line.forEach((v, j) => { g[idx[j]] = v; });
      moved = moved || res.moved; merged = Math.max(merged, res.merged);
    }
    return { grid: g, moved, merged };
  }
  const canMove = grid => ['left', 'right', 'up', 'down'].some(d => move(grid, d).moved);

  function grade(state, params) {
    const ok = params.rounds.every((_, i) => (state.done?.[i] ?? 0) >= 1);
    const solution = params.rounds.map(r => `${Array.from({ length: r.n }, (_, k) => r.base * 2 ** k).join(' → ')} (cada término es el doble)`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, box = { x: 0, y: 0, s: 0 }, grid = new Array(16).fill(0), best = 0, pops = [], drag = null, used = false;
    const a = makeArcade(R.length, 1, api, {
      start(i) { st.done[i] = 0; grid = new Array(16).fill(0); best = R[i].base; pops = []; spawn(); spawn(); },
      lost(i) { st.done[i] = 0; },
    });

    function layout(w, h) { W = w; H = h; const s = Math.min(w - 28, h - 150 - 44); box = { x: (w - s) / 2, y: 148, s }; }
    function spawn() {
      const free = grid.map((v, i) => (v ? -1 : i)).filter(i => i >= 0);
      if (!free.length) return;
      const i = free[Math.floor(Math.random() * free.length)];
      grid[i] = R[a.cur].base * (Math.random() < 0.12 ? 2 : 1); pops.push({ i, t: 1 });
    }
    function play(dir) {
      const r = R[a.cur], res = move(grid, dir);
      if (!res.moved) return;
      grid = res.grid; api.sfx?.tap?.();
      if (res.merged) { grid.forEach((v, i) => { if (v === res.merged) pops.push({ i, t: 1 }); }); if (res.merged > best) { best = res.merged; a.hit(); a.say(`${res.merged} = ${r.base} · 2${['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'][termIndex(res.merged, r.base) - 1] || ''}`, C.ok); } }
      if (grid.includes(goalOf(r))) { st.done[a.cur] = 1; a.win(); return; }
      spawn();
      if (!canMove(grid)) { a.say('Tablero lleno, sin jugadas', C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) a.tick(dt);
        pops = pops.filter(q => (q.t -= dt * 5) > 0);
        const r = R[a.cur], cell = box.s / N, COLS = [C.cream, C.sun, C.mint, C.sky, C.coral, C.R, C.ok];

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `Arma la ficha ${goalOf(r)}`, W / 2, 44, W - 24, 16);
        p.fill(C.mute); p.textSize(11); p.text(`${r.title} · empieza en ${r.base} y cada término es el doble`, W / 2, 66);
        // Los términos de la progresión: encendidos los que ya se armaron.
        const tw = Math.min(52, (W - 28) / r.n - 4), x0 = W / 2 - (r.n * (tw + 4) - 4) / 2;
        for (let k = 0; k < r.n; k++) {
          const v = r.base * 2 ** k, on = v <= best && a.phase !== 'idle';
          drawTile(p, C, { x: x0 + k * (tw + 4), y: 84, w: tw, h: 30 }, v, { fill: on ? COLS[k % COLS.length] : C.card, ink: on ? undefined : C.mute, size: 14, r: 8, lift: on ? 2 : 0, ring: k === r.n - 1 ? C.sun : null });
        }

        // El tablero.
        p.noStroke(); p.fill(C.card); p.rect(box.x - 5, box.y - 5, box.s + 10, box.s + 10, 14);
        for (let i = 0; i < 16; i++) {
          const x = box.x + (i % N) * cell, y = box.y + Math.floor(i / N) * cell, v = grid[i];
          p.noStroke(); p.fill(C.halo); p.rect(x + 3, y + 3, cell - 6, cell - 6, 9);
          if (!v || a.phase === 'idle') continue;
          const pop = pops.find(q => q.i === i), k = pop ? 1 + 0.16 * pop.t : 1;
          drawTile(p, C, { x: x + 4, y: y + 4, w: cell - 8, h: cell - 11 }, v, { fill: COLS[(termIndex(v, r.base) - 1) % COLS.length], size: Math.min(22, cell * 0.36), r: 9, k });
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = box.y + box.s / 2;
        if (locked || a.phase === 'all') {
          p.noStroke(); p.fill(C.card); p.rect(box.x, mid - R.length * 13 - 8, box.s, R.length * 26 + 16, 10);
          drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= 1, text: Array.from({ length: rr.n }, (_, k) => rr.base * 2 ** k).join(' → ') })), mid, box.s - 16);
        } else drawArcadeBanner(p, C, a, mid, { idle: 'Desliza el dedo: iguales se funden en el doble', lost: 'Tablero lleno, sin jugadas', won: `¡Armaste ${goalOf(r)}!` });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Progresiones armadas! Ya puedes comprobar' : 'Desliza hacia un lado para correr todas las fichas', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play') { drag = { x: p.mouseX, y: p.mouseY }; used = false; }
        return false;
      };
      // La jugada sale en cuanto el dedo se desliza lo suficiente (una por gesto).
      p.mouseDragged = () => {
        if (!drag || used || locked || a.phase !== 'play') return;
        const dx = p.mouseX - drag.x, dy = p.mouseY - drag.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 26) return false;
        used = true; play(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
        return false;
      };
      p.mouseReleased = () => { drag = null; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, grid: [...grid], goal: goalOf(R[a.cur]), box }),
    };
  }

  return { grade, create, slide, move, canMove, termIndex, goalOf };
})();
