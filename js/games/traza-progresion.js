// Traza la progresión (Álgebra, progresiones aritméticas; juego dinámico de la lección alg-14): en una cuadrícula de
// 3 × 3 hay puntos con números. Arriba se dan los dos primeros términos de una progresión aritmética («4, 7, …») y
// hay que trazar el camino, sin levantar el dedo o por tramos, pasando por los términos en orden y rodeando los demás
// puntos. Pasar por un punto que no es el siguiente quita una vida. Una mecha va quemando el camino por detrás: si
// alcanza la punta, el camino se borra y se empieza de nuevo (sin perder vida). Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ a1, d, len, traps: [...] }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-progresiones.

GAMES['traza-progresion'] = (() => {
  const termsOf = it => Array.from({ length: it.len }, (_, k) => it.a1 + k * it.d);
  // Reparte los términos y las trampas en casillas distintas de la cuadrícula de 3 × 3 (siempre igual para una semilla).
  function placeDots(it, seed) {
    const values = [...termsOf(it), ...(it.traps || [])], order = shuffledOrder(9, `${seed}|${values.join()}`);
    return values.map((value, i) => ({ value, cell: order[i] }));
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => termsOf(it).map(negTxt).join(', ')).join(' · ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, RAD = 21, FUSE = 26;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, grid = { x0: 0, y0: 0, cw: 0, ch: 0 }, queue = [], dots = [], path = [], burn = 0, press = false, over = -1, pause = 0, n = 0, finger = null;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); load(); },
      lost(i) { st.done[i] = 0; press = false; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];
    const pos = d => ({ x: grid.x0 + ((d.cell % 3) + 0.5) * grid.cw, y: grid.y0 + (Math.floor(d.cell / 3) + 0.5) * grid.ch });
    const seg = (i, j) => { const p = pos(dots[i]), q = pos(dots[j]); return Math.hypot(p.x - q.x, p.y - q.y); };

    function layout(w, h) { W = w; H = h; grid = { x0: 14, y0: 112, cw: (w - 28) / 3, ch: (h - 112 - 40) / 3 }; }
    // Carga la progresión: los puntos en sus casillas y el camino empezando en el primer término.
    function load() {
      const it = item();
      dots = placeDots(it, `${a.cur}-${n++}`);
      path = [0]; burn = 0; over = -1; pause = 0; finger = null;   // dots[0..len-1] son los términos, en orden
    }
    function touch(x, y) {
      const i = dots.findIndex(d => { const p = pos(d); return Math.hypot(p.x - x, p.y - y) <= RAD; });
      if (i === over) return;   // sigue sobre el mismo punto: no cuenta otra vez
      over = i;
      if (i < 0 || path.includes(i)) return;
      const it = item();
      if (i === path.length) {   // es el término siguiente
        path.push(i); api.sfx?.tap?.();
        if (path.length === it.len) { st.done[a.cur]++; a.hit(); a.say(termsOf(it).map(negTxt).join(', '), C.ok); pause = 1.2; press = false; }
      } else { a.say(`${negTxt(dots[i].value)} no es el término que sigue`, C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        if (pause > 0) { pause -= dt; if (pause <= 0) { queue.shift(); if (!queue.length) { a.win(); return; } load(); } return; }
        if (path.length < 2) return;
        // La mecha avanza por el camino ya trazado; si llega a la punta, el camino se borra.
        burn += FUSE * (1 + a.cur * 0.15) * dt;
        let total = 0; for (let k = 1; k < path.length; k++) total += seg(path[k - 1], path[k]);
        if (burn >= total) { path = [0]; burn = 0; over = -1; press = false; finger = null; a.say('La mecha alcanzó la punta: empieza otra vez', C.sun); }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), terms = termsOf(it);

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · sigue la progresión`, W / 2, 40);
        if (a.phase === 'play') {
          drawPill(p, C, `${negTxt(terms[0])}, ${negTxt(terms[1])}, …`, W / 2, 68, C.sun, 18);
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(`${path.length} de ${it.len} términos`, W / 2, 94);
        }

        if (a.phase !== 'idle' && dots.length) {
          // El camino trazado, la parte ya quemada y el tramo hacia el dedo.
          const pts = path.map(i => pos(dots[i]));
          p.noFill(); p.stroke(C.sun); p.strokeWeight(7);
          for (let k = 1; k < pts.length; k++) p.line(pts[k - 1].x, pts[k - 1].y, pts[k].x, pts[k].y);
          if (press && finger && pause <= 0) { const e = pts[pts.length - 1]; p.stroke(C.sun); p.strokeWeight(3); p.line(e.x, e.y, finger.x, finger.y); }
          let left = burn;
          for (let k = 1; k < pts.length && left > 0; k++) {
            const d = Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y), q = Math.min(1, left / d);
            p.stroke(C.coral); p.strokeWeight(7); p.line(pts[k - 1].x, pts[k - 1].y, pts[k - 1].x + (pts[k].x - pts[k - 1].x) * q, pts[k - 1].y + (pts[k].y - pts[k - 1].y) * q);
            if (q < 1 || k === pts.length - 1) { p.noStroke(); p.fill(C.sun); p.circle(pts[k - 1].x + (pts[k].x - pts[k - 1].x) * q, pts[k - 1].y + (pts[k].y - pts[k - 1].y) * q, 12 + 3 * Math.sin(p.frameCount * 0.6)); }
            left -= d;
          }
          // Los puntos.
          dots.forEach((d, i) => {
            const c = pos(d), on = path.includes(i), fill = on ? (pause > 0 ? C.ok : C.sun) : C.cream;
            p.noStroke(); p.fill(shade(fill, 0.76)); p.circle(c.x, c.y + 3, RAD * 2);
            p.fill(fill); p.circle(c.x, c.y, RAD * 2);
            if (i === 0 && path.length === 1) { p.noFill(); p.stroke(C.sun); p.strokeWeight(3); p.circle(c.x, c.y, RAD * 2 + 10 + 3 * Math.sin(p.frameCount * 0.15)); }
            p.noStroke(); p.fill(inkOn(fill, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, negTxt(d.value), c.x, c.y + 1, RAD * 2 - 8, 16);
          });
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = grid.y0 + grid.ch * 1.5;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.flatMap((rr, i) => rr.items.map(x => ({ ok: st.done[i] >= rr.items.length, text: termsOf(x).map(negTxt).join(', ') }))).slice(0, 7), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Pasa el dedo por los términos, en orden', lost: 'Demasiados puntos equivocados' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Caminos completos! Ya puedes comprobar' : 'Rodea los puntos que no son de la progresión', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play' && pause <= 0) { press = true; over = -1; finger = { x: p.mouseX, y: p.mouseY }; touch(p.mouseX, p.mouseY); }
        return false;
      };
      p.mouseDragged = () => { if (press && !locked && a.phase === 'play' && pause <= 0) { finger = { x: p.mouseX, y: p.mouseY }; touch(p.mouseX, p.mouseY); return false; } };
      p.mouseReleased = () => { press = false; over = -1; finger = null; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; press = false; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, grid, visited: path.length, len: item().len, dots: dots.map(d => ({ ...pos(d), cell: d.cell, value: d.value })) }),
    };
  }

  return { grade, create, termsOf, placeDots };
})();
