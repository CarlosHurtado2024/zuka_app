// Rompe los cambios (Álgebra, cambios sucesivos; juego dinámico de la lección alg-13d): arriba hay una cuenta con dos
// cambios seguidos («100 → +10 % → −10 %») y tres ladrillos con posibles resultados. Abajo, una paleta que se mueve
// con el dedo hace rebotar una pelota: se pone la paleta donde se quiere y, al soltar el dedo, la pelota sale hacia
// arriba; después, el lado de la paleta donde pega decide hacia dónde rebota. Hay que mandarla al
// ladrillo del resultado. Pegarle a otro quita una vida (ese ladrillo se apaga); si la pelota se cae no pasa nada,
// vuelve a salir. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, options: [a, b, c], answer }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-razones.

GAMES['rompe-cambios'] = (() => {
  const SPEED = 250, PW = 78;
  // Velocidad de la pelota al rebotar en la paleta: en el centro sale recta hacia arriba; hacia los bordes sale
  // inclinada (hasta 60°) hacia ese lado. offset = cuánto a la derecha del centro pegó; half = media paleta.
  function bounce(offset, half, speed) {
    const ang = (Math.max(-1, Math.min(1, offset / half)) * Math.PI) / 3;
    return { vx: speed * Math.sin(ang), vy: -speed * Math.cos(ang) };
  }
  const brickAt = (x, w) => Math.max(0, Math.min(2, Math.floor(((x - 14) / (w - 28)) * 3)));   // los ladrillos van de 14 a w − 14

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask} = ${it.options[it.answer]}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 108, padY = 0, pad = { x: 0, tx: 0 }, queue = [], ball = null, bricks = [], pause = 0, n = 0, drag = false, starting = false;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); load(); },
      lost(i) { st.done[i] = 0; ball = null; bricks = []; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];

    function layout(w, h) { W = w; H = h; padY = h - 62; if (!pad.x) pad.x = pad.tx = w / 2; }
    // Carga la pregunta: los tres ladrillos en orden barajado y la pelota lista sobre la paleta.
    function load() {
      const it = item(), perm = shuffledOrder(3, it.ask + (n++));
      bricks = perm.map(k => ({ label: it.options[k], good: k === it.answer, dead: false, hit: 0 }));
      ball = null; pause = 0;
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        pad.x += (pad.tx - pad.x) * Math.min(1, dt * 20);
        bricks.forEach(b => { b.hit = Math.max(0, b.hit - dt * 2.5); });
        if (a.phase !== 'play') return;
        if (pause > 0) { pause -= dt; if (pause <= 0) { queue.shift(); if (!queue.length) { a.win(); bricks = []; return; } load(); } return; }
        if (!ball) return;
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        if (ball.x < 16) { ball.x = 16; ball.vx = Math.abs(ball.vx); }
        if (ball.x > W - 16) { ball.x = W - 16; ball.vx = -Math.abs(ball.vx); }
        // Rebote en la paleta.
        if (ball.vy > 0 && ball.y >= padY - 12 && ball.y <= padY + 6 && Math.abs(ball.x - pad.x) <= PW / 2 + 8) { Object.assign(ball, bounce(ball.x - pad.x, PW / 2, SPEED)); ball.y = padY - 12; api.sfx?.tap?.(); }
        // Llegó a la fila de ladrillos.
        if (ball.vy < 0 && ball.y <= top + 56) {
          const b = bricks[brickAt(ball.x, W)];
          ball.vy = Math.abs(ball.vy); ball.y = top + 56;
          if (b.dead) return;
          b.hit = 1;
          if (b.good) { const it = item(); st.done[a.cur]++; a.hit(); a.say(`${it.ask} = ${b.label}`, C.ok); ball = null; pause = 1.1; }
          else { b.dead = true; a.say(`${b.label} no es: aplica un cambio y luego el otro`, C.bad); a.miss(); }
          return;
        }
        if (ball.y > H + 20) ball = null;   // se cayó: vuelve a salir de la paleta, sin castigo
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], bw = (W - 28) / 3;

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · manda la pelota al resultado`, W / 2, 40);
        if (a.phase === 'play') drawPill(p, C, item().ask, W / 2, 70, C.sun, 15);

        // Los ladrillos.
        bricks.forEach((b, i) => {
          const fill = b.dead ? C.card : pause > 0 && b.good ? C.ok : b.hit > 0 && !b.good ? C.bad : [C.sky, C.coral, C.mint][i];
          drawTile(p, C, { x: 14 + i * bw + 3, y: top + 12, w: bw - 6, h: 40 }, b.label, { fill, ink: b.dead ? C.mute : undefined, size: 18, lift: b.dead ? 0 : 3 });
        });
        // La paleta y la pelota (o la pelota esperando sobre la paleta, con cuenta atrás).
        p.noStroke(); p.fill(shade(C.sun, 0.74)); p.rect(pad.x - PW / 2, padY + 3, PW, 12, 6);
        p.fill(C.sun); p.rect(pad.x - PW / 2, padY, PW, 12, 6);
        if (ball) { p.fill(C.cream); p.circle(ball.x, ball.y, 16); }
        else if (a.phase === 'play' && pause <= 0) {
          p.fill(C.cream); p.circle(pad.x, padY - 14, 16);
          p.fill(C.N); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text('suelta para lanzar', W / 2, padY - 44);
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + 60 + padY) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Mueve la paleta y suelta para lanzar', lost: 'Demasiados ladrillos equivocados' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Ladrillos rotos! Ya puedes comprobar' : ball ? 'Rebota hacia el lado de la paleta donde pega' : 'Pon la paleta bajo el resultado y suelta', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      const aim = () => { pad.tx = Math.max(14 + PW / 2, Math.min(W - 14 - PW / 2, p.mouseX)); };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        starting = tp === 'start';   // el toque de «empezar» no lanza la pelota
        if (tp !== 'wait') { drag = true; aim(); }
        return false;
      };
      p.mouseDragged = () => { if (drag && a.phase === 'play' && !locked) { aim(); return false; } };
      p.mouseReleased = () => {
        const was = drag; drag = false;
        if (was && !starting && !locked && a.phase === 'play' && !ball && pause <= 0 && bricks.length) { pad.x = pad.tx; ball = { x: pad.x, y: padY - 14, vx: 0, vy: -SPEED }; api.sfx?.tap?.(); }
        starting = false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, padX: pad.x, padY, half: PW / 2, brickY: top + 56, ball: ball && { ...ball }, bricks: bricks.map(b => ({ good: b.good, dead: b.dead })) }),
    };
  }

  return { grade, create, bounce, brickAt };
})();
