// La carrera de las fracciones (Álgebra 1.1, racionales; juego dinámico de la lección alg-11b): un corredor avanza
// por una pista de tres carriles. Arriba sale un número («1/4») y viene una fila de tres puertas («0.25», «0.4»,
// «1.4»): se toca un carril (o se arrastra el dedo) para pasar por la puerta que vale lo mismo. Pasar por otra quita
// una vida y la pregunta vuelve después, ahora con una ayuda bajo el número («1/4 es 1 ÷ 4»). Los aciertos seguidos
// suben la racha y la pista corre más rápido. Tras la última puerta baja la meta. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, options: [a, b, c], answer }] }], lives? }   state = { done: [n] }
// Specs 2026-11-13-juegos-dinamicos-valle y 2026-11-14-mejoras-carrera-y-aguja.

GAMES['carrera-fracciones'] = (() => {
  const laneOf = (x, w) => Math.max(0, Math.min(2, Math.floor((x / w) * 3)));
  // Valor de un texto: «1/4», «−6/3», «0.125», «4».
  function valueOf(txt) {
    const t = String(txt).replace(/−/g, '-'), fr = t.split('/');
    return fr.length === 2 ? +fr[0] / +fr[1] : +t;
  }
  // Ayuda para una pregunta fallada: dice qué hacer, no cuánto da.
  function helpOf(it) {
    const ask = String(it.ask), fr = ask.split('/');
    if (fr.length === 2) {
      if (String(it.options[it.answer]).includes('/')) return 'Divide o multiplica arriba y abajo por el mismo número';
      if (+fr[0] === 0) return `${ask}: no hay nada que repartir entre ${fr[1]}`;
      return `${ask} es ${fr[0]} ÷ ${fr[1]}`;
    }
    const dec = (ask.split('.')[1] || '').length;
    if (!dec) return `${ask} es un entero: ${ask}/1`;
    const whole = Math.round(Math.abs(valueOf(ask)) * 10 ** dec), place = ['décimas', 'centésimas', 'milésimas'][dec - 1] || 'partes';
    // Si la respuesta es esa misma cuenta sin simplificar (0.9 = 9/10), decirla sería regalarla: solo el lugar.
    if (String(it.options[it.answer]) === `${whole}/${10 ** dec}`) return `${ask} llega hasta las ${place}: ¿sobre qué número va?`;
    return `${ask} son ${whole} ${place}`;
  }
  // Cuánto más rápido corre la pista con una racha de aciertos (tope ×1.4).
  const turbo = streak => 1 + 0.08 * Math.min(5, Math.max(0, streak));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask} = ${it.options[it.answer]}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 112, runY = 0, lane = 1, runX = 0, queue = [], row = null, finish = null, gap = 0, scroll = 0, n = 0;
    let streak = 0, missed = new Set(), bits = [], shake = 0, run = 0, press = false;
    const missedOf = R.map(() => new Set());   // las falladas de cada ronda: la ayuda sigue si la ronda se reintenta
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); row = null; finish = null; gap = 0.5; streak = 0; missed = missedOf[i]; bits = []; },
      lost(i) { st.done[i] = 0; row = null; finish = null; streak = 0; },
    });
    const laneX = k => 14 + ((W - 28) / 3) * (k + 0.5), laneW = () => (W - 28) / 3;

    function layout(w, h) { W = w; H = h; runY = h - 78; if (!runX) runX = laneX(1); }
    function spawn() {
      const idx = queue[0], it = R[a.cur].items[idx];
      row = { y: top + 4, it, idx, perm: shuffledOrder(3, it.ask + (n++)), done: false, pick: -1 };
    }
    // La puerta acertada estalla en pedazos.
    function burst(x, y, col) {
      for (let k = 0; k < 14; k++) { const ang = Math.random() * Math.PI * 2, v = 60 + Math.random() * 150; bits.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 60, t: 1, col: k % 3 ? col : C.sun, s: 4 + Math.random() * 5 }); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); runX = laneX(lane); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        runX += (laneX(lane) - runX) * Math.min(1, dt * 14);
        shake = Math.max(0, shake - dt * 3);
        bits = bits.filter(b => { b.t -= dt * 1.6; b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 420 * dt; return b.t > 0; });
        if (a.phase !== 'play') return;
        const speed = ((runY - top) / Math.max(2.5, 3.7 - a.cur * 0.3)) * turbo(streak);
        scroll = (scroll + speed * dt) % 40; run += dt * (9 + streak);
        if (finish) {   // la meta: al cruzarla se gana la ronda
          finish.y += speed * 1.6 * dt;
          if (finish.y >= runY - 10) { finish = null; a.win(); }
          return;
        }
        if (!row) { gap -= dt; if (gap <= 0 && queue.length) spawn(); return; }
        row.y += speed * dt * (row.done ? 2.5 : 1);   // ya resuelta, la fila se va rápido
        if (!row.done && row.y >= runY - 22) {
          row.done = true; row.pick = lane;
          const it = row.it, good = row.perm[lane] === it.answer;
          if (good) {
            st.done[a.cur]++; queue.shift(); streak++; a.hit(); burst(laneX(lane), runY - 22, C.ok);
            a.say(streak >= 2 ? `${it.ask} = ${it.options[it.answer]} · racha ×${streak}` : `${it.ask} = ${it.options[it.answer]}`, C.ok);
          } else {
            a.say(`${it.options[row.perm[lane]]} no es ${it.ask}`, C.bad); queue.push(queue.shift()); missed.add(row.idx); streak = 0; shake = 1;
            if (a.miss()) return;
          }
        }
        if (row.y > H + 30) { row = null; if (queue.length) gap = 0.35; else finish = { y: top - 10 }; }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], lw = laneW(), sx = shake > 0 ? Math.sin(shake * 40) * 5 * shake : 0;

        p.push(); p.translate(sx, 0);
        // La pista: tres carriles con rayas que corren hacia abajo.
        for (let k = 0; k < 3; k++) {
          p.noStroke(); p.fill(C.halo); p.rect(14 + k * lw + 3, top - 4, lw - 6, H - top - 30, 12);   // tono propio: las puertas crema se distinguen en los dos temas
          p.stroke(C.line); p.strokeWeight(3);
          for (let y = top + scroll - 40; y < H - 40; y += 40) if (y > top) p.line(laneX(k), y, laneX(k), Math.min(H - 40, y + 14));
        }
        // La meta a cuadros.
        if (finish) {
          const s = (W - 28) / 18;
          p.noStroke(); p.fill(C.sun); p.rect(12, finish.y - 3, W - 24, s * 3 + 6, 4);
          for (let k = 0; k < 18; k++) for (let j = 0; j < 3; j++) { p.fill((k + j) % 2 ? C.night : C.cream); p.rect(14 + k * s, finish.y + j * s, s + 0.5, s + 0.5); }
        }
        // La fila de puertas.
        if (row) for (let k = 0; k < 3; k++) {
          const opt = row.it.options[row.perm[k]], good = row.perm[k] === row.it.answer;
          if (row.done && good && row.pick === k) continue;   // la acertada ya estalló
          const fill = !row.done ? C.cream : good ? C.ok : row.pick === k ? C.bad : C.cream;
          drawTile(p, C, { x: 14 + k * lw + 7, y: row.y - 20, w: lw - 14, h: 40 }, opt, { fill, size: 17 });
        }
        bits.forEach(b => { const c = p.color(b.col); c.setAlpha(255 * Math.min(1, b.t * 1.5)); p.noStroke(); p.fill(c); p.rect(b.x - b.s / 2, b.y - b.s / 2, b.s, b.s, 2); });

        // El corredor: cuadradito color sol con ojos y piernas; con racha deja estela.
        const moving = a.phase === 'play', bob = moving ? Math.abs(Math.sin(run)) * 3 : 0, x = runX, y = runY - bob;
        if (moving && streak >= 2) for (let k = 1; k <= 3; k++) { const c = p.color(k % 2 ? C.sun : C.coral); c.setAlpha(110 - k * 28); p.noStroke(); p.fill(c); p.rect(x - 11 + k, y + 14 + k * 11, 22 - k * 2, 8, 4); }
        const g = p.color(C.night); g.setAlpha(60); p.noStroke(); p.fill(g); p.ellipse(x, runY + 21, 30 - bob * 2, 7);
        const leg = moving ? Math.sin(run) * 5 : 0;
        p.fill(shade(C.sun, 0.6)); p.rect(x - 10, y + 12, 7, 8 + leg, 3); p.rect(x + 3, y + 12, 7, 8 - leg, 3);
        p.fill(shade(C.sun, 0.74)); p.rect(x - 15, y - 11, 30, 28, 9);
        p.fill(C.sun); p.rect(x - 15, y - 15, 30, 28, 9);
        p.fill(C.night); p.circle(x - 5, y - 4, 5); p.circle(x + 5, y - 4, 5);
        if (moving && streak >= 2) drawPill(p, C, `×${streak}`, x + (lane === 2 ? -30 : 30), y - 2, C.coral, 11);   // al lado: no tapa la puerta que llega
        p.pop();

        // Encabezado: ronda, vidas, el número que hay que igualar y la ayuda si ya se falló.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 8);
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · pasa por la puerta igual a`, W / 2, 40, W - 24, 11);
        const idx = row ? row.idx : queue.length ? queue[0] : -1, it = idx >= 0 ? r.items[idx] : null;
        if (a.phase === 'play' && finish) drawPill(p, C, '¡A la meta!', W / 2, 68, C.mint, 18);
        else if (it && a.phase === 'play') {
          drawPill(p, C, it.ask, W / 2, 66, C.sun, 20);
          if (missed.has(idx)) { p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, helpOf(it), W / 2, 93, W - 24, 12); }
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + H) / 2 - 30;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid, W - 44);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Toca o arrastra para cambiar de carril', lost: 'Demasiadas puertas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Carrera terminada! Ya puedes comprobar' : 'Lleva al corredor a la puerta correcta', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const t = a.tap(locked);
        if (t === 'off') return;
        if (t !== 'wait') { lane = laneOf(p.mouseX, W); press = true; }
        return false;
      };
      // El corredor sigue el dedo de un carril a otro.
      p.mouseDragged = () => { if (press && !locked && a.phase === 'play') { lane = laneOf(p.mouseX, W); return false; } };
      p.mouseReleased = () => { press = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; press = false; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, lane, streak, finish: !!finish, help: row && missed.has(row.idx) ? helpOf(row.it) : '', row: row && { y: row.y, done: row.done, good: row.perm.indexOf(row.it.answer) } }),
    };
  }

  return { grade, create, laneOf, valueOf, helpOf, turbo };
})();
