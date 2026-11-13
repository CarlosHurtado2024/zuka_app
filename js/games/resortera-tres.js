// La resortera de la regla de tres (Álgebra, regla de tres; juego dinámico de la lección alg-12f): una resortera
// lanza una piedra sobre una regla en metros. El estirón y la distancia son directamente proporcionales, y arriba
// está el tiro de muestra («con 2 de estirón llega a 6 m»). Se arrastra hacia atrás para estirar (el número del
// estirón se ve mientras se arrastra) y se suelta: la piedra tiene que caer en la bandera. Caer en otro lado quita
// una vida y la pregunta vuelve después. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, ref: [estirón, metros], items: [{ target }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-razones.

GAMES['resortera-tres'] = (() => {
  const MAX_PULL = 8;
  const pullFor = it => (it.target * it.ref[0]) / it.ref[1];
  const landing = (it, pull) => (pull * it.ref[1]) / it.ref[0];
  // Estirón (en medios) que corresponde a arrastrar `px` píxeles hacia atrás.
  const snapPull = (px, unitPx, max) => Math.max(0, Math.min(max, Math.round((px / unitPx) * 2) / 2));
  const fmt = v => String(+v.toFixed(1));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    const solution = params.rounds.map(r => r.items.map(it => `${it.target} m: estirón ${fmt(pullFor({ ref: r.ref, target: it.target }))}`).join(', ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, UNIT = 12;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, ground = 0, sling = { x: 0, y: 0 }, queue = [], pull = 0, drag = null, shot = null, pause = 0, result = null;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); pull = 0; drag = null; shot = null; pause = 0; result = null; },
      lost(i) { st.done[i] = 0; shot = null; drag = null; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];
    const maxD = () => landing({ ref: R[a.cur].ref }, MAX_PULL);
    const X = mts => sling.x + 20 + (mts / maxD()) * (W - sling.x - 38);

    function layout(w, h) { W = w; H = h; ground = h - 70; sling = { x: 64, y: ground - 44 }; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        if (shot) {
          shot.t += dt / 0.9;
          if (shot.t >= 1) {
            const r = R[a.cur], it = item(), good = Math.abs(shot.dist - it.target) < 1e-6;
            result = { dist: shot.dist, good }; shot = null; pause = good ? 1.2 : 1.5;
            if (good) { st.done[a.cur]++; a.hit(); a.say(`${fmt(pullFor({ ref: r.ref, target: it.target }))} de estirón: ${it.target} m`, C.ok); }
            else { a.say(result.dist < it.target ? `Cayó en ${fmt(result.dist)} m: se quedó corta` : `Cayó en ${fmt(result.dist)} m: se pasó`, C.bad); a.miss(); }
          }
          return;
        }
        if (pause > 0) {
          pause -= dt;
          if (pause <= 0) { if (result.good) queue.shift(); else queue.push(queue.shift()); result = null; pull = 0; if (!queue.length) a.win(); }
        }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), md = maxD(), stepM = md > 30 ? 10 : 5;

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · tiro de muestra`, W / 2, 40);
        drawPill(p, C, `Con ${r.ref[0]} de estirón llega a ${r.ref[1]} m`, W / 2, 66, C.sun, 14);
        if (a.phase === 'play') { p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, `La bandera está a ${it.target} m`, W / 2, 96, W - 24, 15); }

        // El suelo, la regla en metros y la bandera.
        p.stroke(C.mint); p.strokeWeight(4); p.line(8, ground, W - 8, ground);
        p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
        for (let v = 0; v <= md; v += stepM) { p.stroke(C.ink); p.strokeWeight(1.5); p.line(X(v), ground, X(v), ground + 7); p.noStroke(); p.fill(C.mute); p.text(v, X(v), ground + 17); }
        if (a.phase !== 'idle') {
          const fx = X(it.target);
          p.stroke(C.ink); p.strokeWeight(2); p.line(fx, ground, fx, ground - 34);
          p.noStroke(); p.fill(C.coral); p.triangle(fx, ground - 34, fx + 16, ground - 28, fx, ground - 22);
        }
        if (result) { p.noStroke(); p.fill(result.good ? C.ok : C.bad); p.circle(X(result.dist), ground - 6, 12); }

        // La resortera: horquilla, liga estirada y la piedra.
        const px = drag ? pull * UNIT : 0, sx = Math.max(12, sling.x - px * 0.6), sy = Math.min(ground - 8, sling.y + px * 0.4);
        p.stroke(shade(C.sun, 0.7)); p.strokeWeight(6); p.line(sling.x, ground, sling.x, sling.y + 10); p.line(sling.x, sling.y + 10, sling.x - 10, sling.y - 8); p.line(sling.x, sling.y + 10, sling.x + 10, sling.y - 8);
        if (!shot && !result && a.phase === 'play') {
          p.stroke(C.coral); p.strokeWeight(3); p.line(sling.x - 10, sling.y - 8, sx, sy); p.line(sling.x + 10, sling.y - 8, sx, sy);
          p.noStroke(); p.fill(C.cream); p.circle(sx, sy, 15);
          if (drag) drawPill(p, C, `estirón ${fmt(pull)}`, Math.max(60, sx + 54), sy - 26, C.sky, 14);
        }
        if (shot) {
          const q = shot.t, x = sling.x + (X(shot.dist) - sling.x) * q, y = sling.y + (ground - 6 - sling.y) * q - Math.sin(q * Math.PI) * 110;
          p.noStroke(); p.fill(C.cream); p.circle(x, y, 15);
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (110 + ground) / 2 - 10;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${rr.ref[0]} de estirón → ${rr.ref[1]} m` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Arrastra hacia atrás para estirar y suelta', lost: 'Demasiados tiros fuera' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Puntería de regla de tres! Ya puedes comprobar' : 'Arrastra hacia atrás o hacia abajo · suelta para lanzar', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play' && !shot && pause <= 0) { drag = { x: p.mouseX, y: p.mouseY }; pull = 0; }
        return false;
      };
      p.mouseDragged = () => { if (drag && !locked && a.phase === 'play') { pull = snapPull(Math.max(drag.x - p.mouseX, p.mouseY - drag.y), UNIT, MAX_PULL); return false; } };
      p.mouseReleased = () => {
        if (!drag || locked || a.phase !== 'play') { drag = null; return; }
        drag = null;
        if (pull > 0) { shot = { t: 0, dist: landing({ ref: R[a.cur].ref }, pull) }; api.sfx?.tap?.(); }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, unit: UNIT, busy: !!shot || pause > 0, need: pullFor({ ref: R[a.cur].ref, target: item().target }) }),
    };
  }

  return { grade, create, pullFor, landing, snapPull, MAX_PULL };
})();
