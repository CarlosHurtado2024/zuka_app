// Encesta la suma (Álgebra, suma de una progresión aritmética; juego dinámico de la lección alg-14b): arriba hay
// tres canastas con números y una suma por calcular («2 + 4 + 6 + 8 + 10», «Los pares del 2 al 40»). Abajo hay un
// balón: se desliza el dedo hacia arriba, en la dirección de la canasta, y al soltar el balón sale lanzado. Hay que
// encestar en la que tiene la suma. Encestar en otra quita una vida; fallar el tiro no quita nada. Si se acaba el
// tiempo de la jugada, la pregunta vuelve después. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, sum: [a1, d, n], options: [a, b, c], answer }] }], lives? }
// state = { done: [n] }      Spec 2026-11-13-juegos-dinamicos-progresiones.

GAMES['encesta-suma'] = (() => {
  const SPEED = 560, HOOP = 30, CLOCK = 20;
  // Velocidad del balón al deslizar (dx, dy): solo si el deslizón va hacia arriba y mide al menos 14 px.
  function flickVel(dx, dy, speed) {
    const d = Math.hypot(dx, dy);
    if (d < 14 || dy > -6) return null;
    return { vx: (dx / d) * speed, vy: (dy / d) * speed };
  }
  // Canasta que tiene enfrente un balón en x (−1 si pasa entre dos).
  function hoopAt(x, centers, r) {
    let best = -1, bd = r;
    centers.forEach((c, i) => { const d = Math.abs(x - c); if (d <= bd) { bd = d; best = i; } });
    return best;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask} = ${it.options[it.answer]}`).join(' · ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, hoopY = 0, home = { x: 0, y: 0 }, queue = [], perm = [0, 1, 2], ball = null, drag = null, aim = null, pause = 0, result = null, clock = CLOCK, sway = 0, n = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); load(); },
      lost(i) { st.done[i] = 0; ball = null; drag = null; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];
    // Las canastas se mecen un poco a partir de la segunda ronda.
    const centers = () => [1, 3, 5].map(k => (W * k) / 6 + (a.cur ? Math.sin(sway) * 14 : 0));

    function layout(w, h) { W = w; H = h; hoopY = 150; home = { x: w / 2, y: h - 84 }; }
    function load() { perm = shuffledOrder(3, item().ask + (n++)); ball = null; drag = null; aim = null; pause = 0; result = null; clock = CLOCK; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        sway += dt * 1.3;
        if (a.phase !== 'play') return;
        if (pause > 0) {
          pause -= dt;
          if (pause <= 0) { if (result.good) queue.shift(); else if (result.requeue) queue.push(queue.shift()); if (!queue.length) { a.win(); return; } if (result.good || result.requeue) load(); else { ball = null; result = null; } }
          return;
        }
        clock -= dt;
        if (clock <= 0 && !ball) { result = { requeue: true, pick: -1 }; pause = 1; a.say('Se acabó el tiempo: vuelve después', C.sun); return; }
        if (!ball) return;
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        if (ball.x < 14 || ball.x > W - 14) ball.vx = -ball.vx;
        if (ball.y <= hoopY) {
          const i = hoopAt(ball.x, centers(), HOOP), it = item();
          if (i < 0) { result = { pick: -1 }; pause = 0.6; a.say('No entró en ninguna: otra vez', C.sun); }
          else if (perm[i] === it.answer) { result = { good: true, pick: i }; pause = 1.1; st.done[a.cur]++; a.hit(); a.say(`${it.ask} = ${it.options[it.answer]}`, C.ok); }
          else { result = { requeue: true, pick: i }; pause = 1.2; a.say(`${it.options[perm[i]]} no es la suma`, C.bad); a.miss(); }
          ball = null;
        }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), cs = centers();

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · encesta en la suma`, W / 2, 40);
        if (a.phase === 'play') {
          drawPill(p, C, it.ask, W / 2, 68, C.sun, 15);
          p.noStroke(); p.fill(C.line); p.rect(40, 90, W - 80, 6, 3);
          p.fill(clock < 5 ? C.coral : C.mint); p.rect(40, 90, Math.max(0, (W - 80) * (clock / CLOCK)), 6, 3);
        }
        // Las canastas: tablero con el número y aro.
        if (a.phase !== 'idle' && !(locked || a.phase === 'all')) cs.forEach((cx, i) => {
          const good = perm[i] === it.answer, fill = result && result.pick === i ? (good ? C.ok : C.bad) : C.cream;
          drawTile(p, C, { x: cx - 36, y: hoopY - 46, w: 72, h: 36 }, it.options[perm[i]], { fill, size: 17, lift: 2 });
          p.noFill(); p.stroke(C.coral); p.strokeWeight(5); p.ellipse(cx, hoopY, HOOP * 2 - 6, 14);
          p.stroke(C.mute); p.strokeWeight(1.5); for (let k = -2; k <= 2; k++) p.line(cx + k * 9, hoopY + 6, cx + k * 6, hoopY + 24);
        });
        // El balón (en casa, mientras se apunta o en vuelo) y la guía del tiro.
        if (a.phase === 'play' && pause <= 0) {
          if (drag && aim) { p.stroke(C.mute); p.strokeWeight(2); p.drawingContext.setLineDash([4, 7]); p.line(home.x, home.y, home.x + aim.vx * 0.28, home.y + aim.vy * 0.28); p.drawingContext.setLineDash([]); }
          const b = ball || home, d = ball ? 22 + (4 * (ball.y - hoopY)) / (home.y - hoopY) : 26;
          p.noStroke(); p.fill(shade(C.sun, 0.76)); p.circle(b.x, b.y + 3, d);
          p.fill(C.sun); p.circle(b.x, b.y, d);
          p.noFill(); p.stroke(shade(C.sun, 0.6)); p.strokeWeight(1.5); p.arc(b.x, b.y, d, d * 0.5, 0, Math.PI); p.line(b.x, b.y - d / 2, b.x, b.y + d / 2);
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (hoopY + home.y) / 2 + 10;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.flatMap((rr, i) => rr.items.map(x => ({ ok: st.done[i] >= rr.items.length, text: `${x.ask} = ${x.options[x.answer]}` }))).slice(0, 9), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Desliza el dedo hacia la canasta y suelta', lost: 'Demasiadas canastas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Puras canastas! Ya puedes comprobar' : 'Desliza hacia arriba, apuntando a la canasta', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play' && !ball && pause <= 0) { drag = { x: p.mouseX, y: p.mouseY }; aim = null; }
        return false;
      };
      p.mouseDragged = () => { if (drag && !locked && a.phase === 'play') { aim = flickVel(p.mouseX - drag.x, p.mouseY - drag.y, SPEED); return false; } };
      p.mouseReleased = () => {
        if (drag && aim && !locked && a.phase === 'play' && !ball && pause <= 0) { ball = { x: home.x, y: home.y, ...aim }; api.sfx?.tap?.(); }
        drag = null; aim = null;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, home, hoopY, busy: !!ball || pause > 0, hoops: centers().map((x, i) => ({ x, good: perm[i] === item().answer })) }),
    };
  }

  return { grade, create, flickVel, hoopAt };
})();
