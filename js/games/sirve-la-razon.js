// Sirve la razón (Álgebra, razones; juego dinámico de la lección alg-12): dos vasos con marcas. El primero ya tiene
// un ingrediente; arriba está la receta («por cada 2 de jugo, 3 de agua»). Se mantiene presionada la pantalla para
// servir el otro ingrediente y se suelta cuando la cantidad mantiene la razón. Soltar lejos (de menos o de más) quita
// una vida y la pregunta vuelve después. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, a, b, items: [{ p, q, have, max }] }], lives? }   (razón p : q, `have` unidades de a)
// state = { done: [n] }      Spec 2026-11-13-juegos-dinamicos-razones.

GAMES['sirve-la-razon'] = (() => {
  const TOL = 0.5, RATE = 2.2;   // margen (en unidades del vaso) y unidades que se sirven por segundo
  const targetOf = it => (it.have * it.q) / it.p;
  // Cómo quedó lo servido: 'ok' si está a menos de TOL de la marca justa, 'low' si faltó, 'high' si sobró.
  const judge = (level, it) => (Math.abs(level - targetOf(it)) <= TOL ? 'ok' : level < targetOf(it) ? 'low' : 'high');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.p} : ${it.q} = ${it.have} : ${targetOf(it)}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 118, bottom = 0, queue = [], level = 0, pouring = false, pause = 0, result = null;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); level = 0; pouring = false; pause = 0; result = null; },
      lost(i) { st.done[i] = 0; pouring = false; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];

    function layout(w, h) { W = w; H = h; bottom = h - 64; }
    function release() {
      if (!pouring) return;
      pouring = false;
      const it = item(), j = judge(level, it);
      result = j; pause = j === 'ok' ? 1.2 : 1.4;
      if (j === 'ok') { st.done[a.cur]++; a.hit(); a.say(`${it.p} : ${it.q} = ${it.have} : ${targetOf(it)}`, C.ok); }
      else { a.say(j === 'low' ? 'Faltó: así no queda la misma razón' : 'Sobró: así no queda la misma razón', C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        const it = item();
        if (pause > 0) {
          pause -= dt;
          if (pause <= 0) {   // tras la pausa: siguiente pregunta (la fallada vuelve al final) con el vaso vacío
            if (result === 'ok') queue.shift(); else queue.push(queue.shift());
            result = null; level = 0;
            if (!queue.length) a.win();
          }
          return;
        }
        if (pouring) { level += RATE * dt; if (level >= it.max) { level = it.max; release(); } }
      }

      // Un vaso con marcas cada unidad y números; `fill` es hasta dónde está lleno.
      function glass(x, w, it, fill, col, name) {
        const hgt = bottom - top, y = v => bottom - (v / it.max) * hgt, every = it.max > 8 ? 2 : 1;
        p.noStroke(); p.fill(col); p.rect(x + 3, y(fill), w - 6, bottom - y(fill) - 3, 0, 0, 10, 10);
        p.stroke(C.ink); p.strokeWeight(3); p.noFill(); p.line(x, top - 6, x, bottom); p.line(x + w, top - 6, x + w, bottom); p.line(x, bottom, x + w, bottom);
        for (let v = 1; v <= it.max; v++) {
          p.stroke(C.ink); p.strokeWeight(v % every ? 1 : 2); p.line(x + w - (v % every ? 8 : 14), y(v), x + w, y(v));
          if (v % every === 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text(v, x + w + 5, y(v)); }
        }
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, name, x + w / 2, bottom + 16, w + 30, 13);
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), gw = Math.min(84, W * 0.27), xa = W * 0.25 - gw / 2, xb = W * 0.7 - gw / 2;

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · sirve para mantener la razón`, W / 2, 42);
        drawPill(p, C, `Por cada ${it.p} de ${r.a}, ${it.q} de ${r.b}`, W / 2, 70, C.sun, 15);

        if (a.phase !== 'idle') {
          glass(xa, gw, it, it.have, C.coral, r.a);
          const colB = result === 'ok' ? C.ok : result ? C.bad : C.sky;
          glass(xb, gw, it, level, colB, r.b);
          // El chorro mientras se sirve y la cantidad que va.
          if (pouring) { p.stroke(C.sky); p.strokeWeight(6); p.line(xb + gw / 2, top - 22, xb + gw / 2, bottom - (level / it.max) * (bottom - top)); }
          p.noStroke(); p.fill(C.mute); p.rect(xb + gw / 2 - 16, top - 30, 32, 10, 5);
          if (result === 'ok') { p.stroke(C.ok); p.strokeWeight(3); const y = bottom - (targetOf(it) / it.max) * (bottom - top); p.line(xb - 8, y, xb + gw + 8, y); }
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + bottom) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Mantén presionado para servir y suelta', lost: 'Demasiados vasos mal servidos' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Recetas en su punto! Ya puedes comprobar' : 'Mantén presionado · suelta en la marca justa', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play' && pause <= 0 && !pouring) { pouring = true; api.sfx?.tap?.(); }
        return false;
      };
      p.mouseReleased = () => { if (!locked && a.phase === 'play') release(); };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; pouring = false; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, level, pouring, pause, target: targetOf(item()), tol: TOL }),
    };
  }

  return { grade, create, targetOf, judge, TOL };
})();
