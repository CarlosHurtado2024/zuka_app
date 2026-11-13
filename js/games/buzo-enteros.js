// El buzo de los enteros (Álgebra 1.1, naturales y enteros; juego dinámico de la lección alg-11): una recta vertical
// de enteros con el nivel del mar en 0 (arriba el cielo, abajo el agua). El buzo sube y baja arrastrando el dedo.
// Arriba sale una pregunta («Estás en 3 y bajas 5», «El opuesto de −2», «1 − 4») y vienen tres perlas a distintas
// alturas: hay que estar en la altura del resultado cuando lleguen. Tocar otra perla quita una vida; dejarlas pasar
// no quita nada (la pregunta vuelve después). Sin vidas, la ronda empieza otra vez.
// params = { min, max, rounds: [{ title, items: [{ text, value, traps: [a, b] }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-valle.

GAMES['buzo-enteros'] = (() => {
  // Perla que toca el buzo estando en la altura `level` (número, puede ir entre dos enteros): la más cercana a medio
  // nivel o menos; −1 si no toca ninguna.
  function hitIndex(level, values) {
    let best = -1, bd = 0.5;
    values.forEach((v, i) => { const d = Math.abs(level - v); if (d <= bd) { bd = d; best = i; } });
    return best;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.text}: ${negTxt(it.value)}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, MIN = params.min, MAX = params.max;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 96, bottom = 0, unit = 0, queue = [], wave = null, gap = 0, drag = false;
    const diver = { x: 78, y: 0, ty: 0 };
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); wave = null; gap = 0.4; },
      lost(i) { st.done[i] = 0; wave = null; },
    });
    const Y = v => top + (MAX + 0.5 - v) * unit, levelAt = y => MAX + 0.5 - (y - top) / unit;

    function layout(w, h) {
      W = w; H = h; bottom = h - 34; unit = (bottom - top) / (MAX - MIN + 1);
      if (!diver.y) diver.y = diver.ty = Y(0);
      diver.ty = Math.min(bottom - 6, Math.max(top + 6, diver.ty)); diver.y = Math.min(bottom - 6, Math.max(top + 6, diver.y));
    }
    function spawn() {
      const it = R[a.cur].items[queue[0]], vals = shuffledOrder(3, it.text + queue.length + st.done[a.cur]).map(k => [it.value, ...it.traps][k]);
      wave = { x: W + 24, vals, it, done: false, pick: -1 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        diver.y += (diver.ty - diver.y) * Math.min(1, dt * 16);
        if (a.phase !== 'play') return;
        if (!wave) { gap -= dt; if (gap <= 0 && queue.length) spawn(); return; }
        wave.x -= ((W - diver.x) / 4.2) * (1 + a.cur * 0.12) * (wave.done ? 3 : 1) * dt;   // ya resueltas, se van rápido
        if (!wave.done && wave.x <= diver.x + 8) {
          wave.done = true;
          const i = hitIndex(levelAt(diver.y), wave.vals), it = wave.it;
          wave.pick = i;
          if (i < 0) { a.say('Se fueron de largo: vuelven después', C.sun); queue.push(queue.shift()); }
          else if (wave.vals[i] === it.value) {
            st.done[a.cur]++; queue.shift(); a.hit(); a.say(`${it.text}: ${negTxt(it.value)}`, C.ok);
            if (!queue.length) { a.win(); wave = null; return; }
          } else {
            a.say(`Esa perla estaba en ${negTxt(wave.vals[i])}`, C.bad); queue.push(queue.shift());
            if (a.miss()) return;
          }
        }
        if (wave.x < -30) { wave = null; gap = 0.45; }
      }

      function drawDiver() {
        const x = diver.x, y = diver.y;
        p.noStroke(); p.fill(C.coral); p.ellipse(x - 6, y + 2, 26, 15);                 // cuerpo
        p.fill(shade(C.coral, 0.74)); p.triangle(x - 19, y + 2, x - 28, y - 6, x - 28, y + 10);   // aletas
        p.fill(C.cream); p.circle(x + 7, y, 15);                                          // cabeza
        p.fill(C.sky); p.circle(x + 10, y - 1, 8);                                        // visor
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], y0 = Y(0);

        // El agua (del nivel 0 hacia abajo) y la recta de enteros a la izquierda.
        const water = p.color(C.sky); water.setAlpha(70);
        p.noStroke(); p.fill(water); p.rect(8, y0, W - 16, bottom - y0, 0, 0, 12, 12);
        p.stroke(C.sky); p.strokeWeight(3); p.line(8, y0, W - 8, y0);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
        for (let v = MIN; v <= MAX; v++) {
          p.stroke(C.line); p.strokeWeight(1); p.line(40, Y(v), W - 10, Y(v));
          p.noStroke(); p.fill(v === 0 ? C.N : v < 0 ? C.I : C.ink); p.text(negTxt(v), 24, Y(v));
        }
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(9); p.textAlign(p.RIGHT, p.BOTTOM); p.text('nivel del mar', W - 12, y0 - 3);

        // Las tres perlas que vienen.
        if (wave) {
          const d = Math.min(unit * 0.92, 24);
          wave.vals.forEach((v, i) => {
            const col = !wave.done ? C.cream : v === wave.it.value ? (wave.pick === i ? C.ok : C.cream) : wave.pick === i ? C.bad : C.cream;
            p.stroke(wave.done && wave.pick === i ? col : C.creamD); p.strokeWeight(2); p.fill(col); p.circle(wave.x, Y(v), d);
            p.noStroke(); p.fill(255, 255, 255, 150); p.circle(wave.x - d * 0.18, Y(v) - d * 0.18, d * 0.26);
          });
        }
        drawDiver();

        // Encabezado: ronda, vidas y la pregunta.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 10);
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(r.title, W / 2, 40);
        const it = wave ? wave.it : queue.length ? r.items[queue[0]] : null;
        if (it && a.phase === 'play') drawPill(p, C, it.text, W / 2, 66, C.sun, 16);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + bottom) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Sube o baja al buzo con el dedo', lost: 'Demasiadas perlas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Perlas recogidas! Ya puedes comprobar' : 'Ponte a la altura del resultado', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      const aim = () => { diver.ty = Math.min(bottom - 6, Math.max(top + 6, p.mouseY)); };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const t = a.tap(locked);
        if (t === 'off') return;
        if (t !== 'wait') { drag = true; aim(); }
        return false;
      };
      p.mouseDragged = () => { if (drag && a.phase === 'play' && !locked) { aim(); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, diverX: diver.x, diverY: diver.y, wave: wave && { x: wave.x, done: wave.done, answerY: Y(wave.it.value), trapY: Y(wave.it.traps[0]) } }),
    };
  }

  return { grade, create, hitIndex };
})();
