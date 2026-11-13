// Salta los signos (Álgebra 1.2, consecuencias de los axiomas; juego dinámico de la lección alg-12c): un corredor
// avanza y por el suelo vienen fichas con operaciones («(−3)(−4)», «10 ÷ (−2)», «3 − 8»). La misión de la ronda dice
// qué signo es peligroso («salta las que dan negativo»): esas se saltan tocando la pantalla; las demás se atrapan
// corriendo, sin saltar. Chocar con una peligrosa quita una vida; saltar una buena no quita nada, pero vuelve después.
// Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, mission: 'neg'|'pos', items: [{ text, sign: 1|-1 }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-valle.

GAMES['salta-signos'] = (() => {
  const VY = 520, GRAV = 1000, AIR = (2 * VY) / GRAV, CLEAR = 38;   // salto: velocidad, gravedad, tiempo en el aire y altura que libra una ficha
  const mustJump = (item, mission) => (mission === 'neg' ? item.sign < 0 : item.sign > 0);
  // Altura del corredor a los t segundos de saltar (0 en el suelo).
  const jumpHeight = t => (t <= 0 || t >= AIR ? 0 : VY * t - (GRAV * t * t) / 2);
  const SAY = { neg: 'Salta las que dan negativo', pos: 'Salta las que dan positivo' };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    const solution = params.rounds.map(r => `${r.title}: ${r.items.filter(it => mustJump(it, r.mission)).map(it => it.text).join(', ')} dan ${r.mission === 'neg' ? 'negativo' : 'positivo'}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, RX = 64;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, ground = 0, queue = [], block = null, gap = 0, jumpT = -1, scroll = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); block = null; gap = 1.5; jumpT = -1; },
      lost(i) { st.done[i] = 0; block = null; },
    });

    function layout(w, h) { W = w; H = h; ground = h - 92; }
    // La ficha pasa rápido bajo un salto largo: queda como medio segundo de margen para saltar a tiempo. Para que
    // alcance el tiempo de pensar el signo, la operación se anuncia antes de que la ficha entre.
    const speedOf = () => 215 + a.cur * 8;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function spawn() {
        const it = R[a.cur].items[queue[0]];
        p.textStyle(p.BOLD); p.textSize(14);
        block = { it, x: W + 10, w: Math.min(72, Math.max(50, p.textWidth(it.text) + 16)), danger: mustJump(it, R[a.cur].mission), state: 'run' };
      }
      function step(dt) {
        a.tick(dt);
        if (jumpT >= 0) { jumpT += dt; if (jumpT >= AIR) jumpT = -1; }
        if (a.phase !== 'play') return;
        const speed = speedOf();
        scroll = (scroll + speed * dt) % 36;
        if (!block) { gap -= dt; if (gap <= 0 && queue.length) spawn(); return; }
        block.x -= speed * dt;
        // Mientras la ficha pasa por donde está el corredor: si va por el suelo la toca; si va en el aire, la libra.
        if (block.state === 'run' && block.x < RX + 6 && block.x + block.w > RX - 6) {
          const high = jumpHeight(jumpT) >= CLEAR, it = block.it;
          if (!high) {
            if (block.danger) { block.state = 'bad'; a.say(`${it.text} da ${it.sign < 0 ? 'negativo' : 'positivo'}: había que saltarla`, C.bad); queue.push(queue.shift()); if (a.miss()) return; }
            else { block.state = 'got'; st.done[a.cur]++; queue.shift(); a.hit(); a.say(`${it.text} da ${it.sign < 0 ? 'negativo' : 'positivo'}: atrapada`, C.ok); }
          }
        }
        if (block.state === 'run' && block.x + block.w < RX - 6) {
          // Pasó por debajo del salto: bien si era peligrosa; si era buena, se fue y vuelve después.
          if (block.danger) { block.state = 'ok'; st.done[a.cur]++; queue.shift(); a.hit(); a.say(`${block.it.text} da ${block.it.sign < 0 ? 'negativo' : 'positivo'}: bien saltada`, C.ok); }
          else { block.state = 'gone'; queue.push(queue.shift()); a.say('Esa no era peligrosa: vuelve después', C.sun); }
        }
        if (block.x + block.w < -10 || block.state === 'got') { if (!queue.length) { a.win(); block = null; return; } block = null; gap = 1.3; }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur];

        // El suelo, con rayas que corren.
        p.stroke(C.mint); p.strokeWeight(4); p.line(8, ground, W - 8, ground);
        p.stroke(C.line); p.strokeWeight(2);
        for (let x = W - scroll; x > 8; x -= 36) p.line(x, ground + 10, x - 12, ground + 10);
        // La ficha que viene.
        if (block) {
          const fill = block.state === 'bad' ? C.bad : block.state === 'ok' || block.state === 'got' ? C.ok : C.cream;
          drawTile(p, C, { x: block.x, y: ground - 35, w: block.w, h: 32 }, block.it.text, { fill, size: 14, r: 9, lift: 3 });
        }
        // El aviso de la que viene, mientras todavía no entra.
        if (!block && queue.length && a.phase === 'play') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text('VIENE', W - 58, ground - 96);
          drawTile(p, C, { x: W - 104, y: ground - 86, w: 92, h: 36 }, r.items[queue[0]].text, { fill: C.card, ink: C.ink, size: 14, r: 9, lift: 0, ring: C.sun });
        }
        // El corredor.
        const hgt = jumpHeight(jumpT), y = ground - 17 - hgt, bob = a.phase === 'play' && hgt === 0 ? Math.abs(Math.sin(p.frameCount * 0.3)) * 2 : 0;
        p.noStroke(); p.fill(C.line); p.ellipse(RX, ground + 3, 26 - hgt * 0.12, 6);
        p.fill(shade(C.coral, 0.74)); p.rect(RX - 14, y - 11 - bob, 28, 30, 9);
        p.fill(C.coral); p.rect(RX - 14, y - 15 - bob, 28, 30, 9);
        p.fill(C.cream); p.circle(RX + 2, y - 4 - bob, 6); p.circle(RX + 10, y - 4 - bob, 6);
        p.fill(C.night); p.circle(RX + 3, y - 4 - bob, 3); p.circle(RX + 11, y - 4 - bob, 3);

        // Encabezado: ronda, vidas y la misión.
        drawArcadeHead(p, C, a, R.length);
        drawPill(p, C, SAY[r.mission], W / 2, 50, r.mission === 'neg' ? C.coral : C.mint, 15);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · las demás, atrápalas corriendo`, W / 2, 78, W - 20, 11);
        p.text(`${Math.min(st.done[a.cur], r.items.length)} de ${r.items.length}`, W / 2, 96);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (110 + ground) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Toca la pantalla para saltar', lost: 'Demasiados choques' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Carrera sin tropiezos! Ya puedes comprobar' : 'Piensa el signo antes de que llegue la ficha', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play' && jumpT < 0) { jumpT = 0; api.sfx?.tap?.(); }
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, runX: RX, speed: speedOf(), onGround: jumpT < 0, block: block && { x: block.x, w: block.w, danger: block.danger, state: block.state } }),
    };
  }

  return { grade, create, mustJump, jumpHeight, AIR };
})();
