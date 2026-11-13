// La carrera de las fracciones (Álgebra 1.1, racionales; juego dinámico de la lección alg-11b): un corredor avanza
// por una pista de tres carriles. Arriba sale un número («1/4») y viene una fila de tres puertas («0.25», «0.4»,
// «1.4»): se toca un carril para pasar por la puerta que vale lo mismo. Pasar por otra quita una vida y la pregunta
// vuelve después. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, options: [a, b, c], answer }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-valle.

GAMES['carrera-fracciones'] = (() => {
  const laneOf = (x, w) => Math.max(0, Math.min(2, Math.floor((x / w) * 3)));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask} = ${it.options[it.answer]}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 104, runY = 0, lane = 1, runX = 0, queue = [], row = null, gap = 0, scroll = 0, n = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); row = null; gap = 0.5; },
      lost(i) { st.done[i] = 0; row = null; },
    });
    const laneX = k => 14 + ((W - 28) / 3) * (k + 0.5), laneW = () => (W - 28) / 3;

    function layout(w, h) { W = w; H = h; runY = h - 78; if (!runX) runX = laneX(1); }
    function spawn() {
      const it = R[a.cur].items[queue[0]];
      row = { y: top + 4, it, perm: shuffledOrder(3, it.ask + (n++)), done: false, pick: -1 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); runX = laneX(lane); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        runX += (laneX(lane) - runX) * Math.min(1, dt * 14);
        if (a.phase !== 'play') return;
        const speed = (runY - top) / Math.max(2.5, 3.7 - a.cur * 0.3);
        scroll = (scroll + speed * dt) % 40;
        if (!row) { gap -= dt; if (gap <= 0 && queue.length) spawn(); return; }
        row.y += speed * dt * (row.done ? 2.5 : 1);   // ya resuelta, la fila se va rápido
        if (!row.done && row.y >= runY - 22) {
          row.done = true; row.pick = lane;
          const it = row.it, good = row.perm[lane] === it.answer;
          if (good) {
            st.done[a.cur]++; queue.shift(); a.hit(); a.say(`${it.ask} = ${it.options[it.answer]}`, C.ok);
            if (!queue.length) { a.win(); row = null; return; }
          } else {
            a.say(`${it.options[row.perm[lane]]} no es ${it.ask}`, C.bad); queue.push(queue.shift());
            if (a.miss()) return;
          }
        }
        if (row.y > H + 30) { row = null; gap = 0.35; }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], lw = laneW();

        // La pista: tres carriles con rayas que corren hacia abajo.
        for (let k = 0; k < 3; k++) {
          p.noStroke(); p.fill(C.halo); p.rect(14 + k * lw + 3, top - 4, lw - 6, H - top - 30, 12);   // tono propio: las puertas crema se distinguen en los dos temas
          p.stroke(C.line); p.strokeWeight(3);
          for (let y = top + scroll - 40; y < H - 40; y += 40) if (y > top) p.line(laneX(k), y, laneX(k), Math.min(H - 40, y + 14));
        }
        // La fila de puertas.
        if (row) for (let k = 0; k < 3; k++) {
          const opt = row.it.options[row.perm[k]], good = row.perm[k] === row.it.answer;
          const fill = !row.done ? C.cream : good ? C.ok : row.pick === k ? C.bad : C.cream;
          drawTile(p, C, { x: 14 + k * lw + 7, y: row.y - 20, w: lw - 14, h: 40 }, opt, { fill, size: 17 });
        }
        // El corredor: un cuadradito color sol con ojos, que rebota un poco.
        const bob = a.phase === 'play' ? Math.abs(Math.sin(p.frameCount * 0.25)) * 3 : 0, x = runX, y = runY - bob;
        p.noStroke(); p.fill(shade(C.sun, 0.74)); p.rect(x - 15, y - 11, 30, 30, 9);
        p.fill(C.sun); p.rect(x - 15, y - 15, 30, 30, 9);
        p.fill(C.night); p.circle(x - 5, y - 3, 5); p.circle(x + 5, y - 3, 5);

        // Encabezado: ronda, vidas y el número que hay que igualar.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 8);
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · pasa por la puerta igual a`, W / 2, 40, W - 24, 11);
        const it = row ? row.it : queue.length ? r.items[queue[0]] : null;
        if (it && a.phase === 'play') drawPill(p, C, it.ask, W / 2, 68, C.sun, 20);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + H) / 2 - 30;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid, W - 44);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Toca un carril para cambiarte', lost: 'Demasiadas puertas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Carrera terminada! Ya puedes comprobar' : 'Toca el carril de la puerta correcta', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const t = a.tap(locked);
        if (t === 'off') return;
        if (t !== 'wait') lane = laneOf(p.mouseX, W);
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, lane, row: row && { y: row.y, done: row.done, good: row.perm.indexOf(row.it.answer) } }),
    };
  }

  return { grade, create, laneOf };
})();
