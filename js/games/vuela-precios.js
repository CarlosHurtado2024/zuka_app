// Vuela por el precio (Álgebra, aumentos y descuentos; juego dinámico de la lección alg-13c): un pajarito vuela a
// toques (cada toque es un aleteo; si no se toca, cae). Arriba sale una cuenta («200 con 10 % de descuento») y vienen
// tres aros a distintas alturas, cada uno con un precio: hay que pasar por el del resultado. Pasar por otro quita una
// vida; no pasar por ninguno no quita nada (la pregunta vuelve). Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, options: [a, b, c], answer }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-razones.

GAMES['vuela-precios'] = (() => {
  const GRAV = 520, FLAP = -230, RING = 34;
  // Un paso del vuelo: la gravedad acelera hacia abajo y la altura sigue a la velocidad.
  const stepBird = (b, dt) => { const vy = b.vy + GRAV * dt; return { y: b.y + vy * dt, vy }; };
  // Aro por el que pasa un pájaro a la altura y (−1 si pasa entre dos).
  function ringAt(y, centers, r) {
    let best = -1, bd = r;
    centers.forEach((c, i) => { const d = Math.abs(y - c); if (d <= bd) { bd = d; best = i; } });
    return best;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask}: ${it.options[it.answer]}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, BX = 66;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 112, bottom = 0, bird = { y: 0, vy: 0 }, queue = [], col = null, gap = 0, n = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); col = null; gap = 0.8; bird = { y: (top + bottom) / 2, vy: FLAP }; },
      lost(i) { st.done[i] = 0; col = null; },
    });
    const centers = () => [1, 3, 5].map(k => top + ((bottom - top) * k) / 6);

    function layout(w, h) { W = w; H = h; bottom = h - 36; if (!bird.y) bird.y = (top + bottom) / 2; }
    function spawn() { const it = R[a.cur].items[queue[0]]; col = { x: W + 40, it, perm: shuffledOrder(3, it.ask + (n++)), done: false, pick: -1 }; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        bird = stepBird(bird, dt);
        const lim = centers();
        if (bird.y > lim[2] + 10) { bird.y = lim[2] + 10; bird.vy = 0; }   // el piso y el techo no hacen daño
        if (bird.y < lim[0] - 10) { bird.y = lim[0] - 10; bird.vy = 0; }
        if (!col) { gap -= dt; if (gap <= 0 && queue.length) spawn(); return; }
        col.x -= ((W - BX) / 4.1) * (1 + a.cur * 0.08) * (col.done ? 3 : 1) * dt;
        if (!col.done && col.x <= BX + 6) {
          col.done = true;
          const i = ringAt(bird.y, centers(), RING), it = col.it;
          col.pick = i;
          if (i < 0) { a.say('Pasaste entre dos aros: vuelve después', C.sun); queue.push(queue.shift()); }
          else if (col.perm[i] === it.answer) {
            st.done[a.cur]++; queue.shift(); a.hit(); a.say(`${it.ask}: ${it.options[it.answer]}`, C.ok);
            if (!queue.length) { a.win(); col = null; return; }
          } else { a.say(`${it.options[col.perm[i]]} no es el resultado`, C.bad); queue.push(queue.shift()); if (a.miss()) return; }
        }
        if (col.x < -50) { col = null; gap = 0.5; }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], cs = centers();

        // Los tres aros con su precio.
        if (col && col.x < W + 16) cs.forEach((cy, i) => {
          const opt = col.it.options[col.perm[i]], good = col.perm[i] === col.it.answer;
          const c = !col.done ? C.sky : good ? C.ok : col.pick === i ? C.bad : C.sky;
          p.noFill(); p.stroke(c); p.strokeWeight(6); p.ellipse(col.x, cy, 30, RING * 2 - 6);
          drawPill(p, C, opt, col.x + 42 > W - 30 ? col.x : col.x + 42, cy, c, 14);
        });
        // El pajarito: cuerpo color sol, ala que sube al aletear, ojo y pico.
        const y = bird.y, flap = bird.vy < -60;
        p.noStroke(); p.fill(shade(C.sun, 0.74)); p.ellipse(BX, y + 3, 30, 24);
        p.fill(C.sun); p.ellipse(BX, y, 30, 24);
        p.fill(shade(C.sun, 0.84)); p.ellipse(BX - 6, y + (flap ? -7 : 5), 16, 10);
        p.fill(C.night); p.circle(BX + 7, y - 4, 5);
        p.fill(C.coral); p.triangle(BX + 13, y - 1, BX + 22, y + 2, BX + 13, y + 5);

        // Encabezado: ronda, vidas y la cuenta.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 8);
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · pasa por el aro del resultado`, W / 2, 40);
        const it = col ? col.it : queue.length ? r.items[queue[0]] : null;
        if (it && a.phase === 'play') drawPill(p, C, it.ask, W / 2, 70, C.sun, 15);
        p.stroke(C.line); p.strokeWeight(2); p.line(8, cs[2] + 26, W - 8, cs[2] + 26);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + bottom) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Cada toque es un aleteo', lost: 'Demasiados aros equivocados' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Vuelo perfecto! Ya puedes comprobar' : 'Toca para subir · deja de tocar para bajar', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play') { bird.vy = FLAP; api.sfx?.tap?.(); }
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, birdY: bird.y, vy: bird.vy, col: col && { x: col.x, done: col.done, goodY: centers()[col.perm.indexOf(col.it.answer)], badY: centers()[col.perm.findIndex(k => k !== col.it.answer)] } }),
    };
  }

  return { grade, create, stepBird, ringAt, GRAV, FLAP };
})();
