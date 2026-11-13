// La caja veloz (Álgebra, porcentajes; juego dinámico de la lección alg-13): en la caja de una tienda llegan clientes
// con una cuenta («25 % de 80», «¿Qué % es 12 de 48?»). Se escribe el resultado en el teclado y se toca OK antes de
// que al cliente se le acabe la paciencia (la barra). Un resultado equivocado quita una vida; si el cliente se cansa
// no se pierde nada, pero vuelve a la fila. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, answer }] }], patience?, lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-razones.

GAMES['caja-veloz'] = (() => {
  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];
  // Lo que queda escrito al tocar una tecla: hasta cuatro cifras, sin ceros a la izquierda; ⌫ borra la última.
  function typeKey(buf, key) {
    if (key === '⌫') return buf.slice(0, -1);
    if (!/^\d$/.test(key) || buf.length >= 4) return buf;
    return buf === '0' ? key : buf + key;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask}: ${it.answer}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, PATIENCE = params.patience ?? 14;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, keys = [], queue = [], buf = '', left = PATIENCE, pause = 0, result = null, press = -1;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); next(); },
      lost(i) { st.done[i] = 0; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];
    function next() { buf = ''; left = PATIENCE; pause = 0; result = null; }

    function layout(w, h) {
      W = w; H = h;
      const kw = (w - 28 - 16) / 3, kh = 40, y0 = h - 30 - 4 * (kh + 7);
      keys = KEYS.map((k, i) => ({ k, x: 14 + (i % 3) * (kw + 8), y: y0 + Math.floor(i / 3) * (kh + 7), w: kw, h: kh }));
    }
    function submit() {
      const it = item(), good = buf !== '' && +buf === it.answer;
      result = good ? 'ok' : 'bad'; pause = good ? 0.9 : 1.2;
      if (good) { st.done[a.cur]++; a.hit(); a.say(`${it.ask}: ${it.answer}`, C.ok); }
      else { a.say(`${buf || '—'} no es: revisa la cuenta`, C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        if (pause > 0) {
          pause -= dt;
          if (pause <= 0) { if (result === 'ok') queue.shift(); else queue.push(queue.shift()); if (!queue.length) { a.win(); return; } next(); }
          return;
        }
        left -= dt;
        if (left <= 0) { result = 'gone'; pause = 1; a.say('El cliente se cansó: vuelve a la fila', C.sun); }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), y0 = keys[0].y;

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · ${Math.min(st.done[a.cur], r.items.length)} de ${r.items.length}`, W / 2, 40);

        if (a.phase !== 'idle' && !(locked || a.phase === 'all')) {
          // El cliente (una carita) con su cuenta y la barra de paciencia.
          const cy = 78, face = result === 'ok' ? C.ok : result === 'bad' ? C.bad : C.sun;
          p.noStroke(); p.fill(face); p.circle(34, cy, 34);
          p.fill(C.night); p.circle(28, cy - 4, 4); p.circle(40, cy - 4, 4);
          p.noFill(); p.stroke(C.night); p.strokeWeight(2); p.arc(34, cy + 4, 14, result === 'bad' || result === 'gone' ? -8 : 8, 0, Math.PI);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER);
          p.textSize(20); while (p.textWidth(it.ask) > W - 76 && p.textSize() > 12) p.textSize(p.textSize() - 1);
          p.text(it.ask, 60, cy - 6);
          p.noStroke(); p.fill(C.line); p.rect(60, cy + 12, W - 76, 7, 4);
          p.fill(left < PATIENCE * 0.3 ? C.coral : C.mint); p.rect(60, cy + 12, Math.max(0, (W - 76) * (left / PATIENCE)), 7, 4);
          // La pantalla de la caja.
          p.stroke(result === 'ok' ? C.ok : result === 'bad' ? C.bad : C.sun); p.strokeWeight(2.5); p.fill(C.card); p.rect(14, y0 - 52, W - 28, 42, 10);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(24); p.textAlign(p.RIGHT, p.CENTER); p.text(buf || '0', W - 28, y0 - 30);
        }
        // El teclado.
        keys.forEach((k, i) => drawTile(p, C, k, k.k, { fill: k.k === 'OK' ? C.mint : k.k === '⌫' ? C.coral : C.cream, size: 18, lift: press === i ? 1 : 3 }));
        press = -1;

        arcadeToast(p, C, a, W / 2, H - 15, locked);
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), 108);
        else drawArcadeBanner(p, C, a, 108, { idle: 'Escribe el resultado y toca OK', lost: 'Demasiadas cuentas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Fila atendida! Ya puedes comprobar' : 'Escribe el número y toca OK', W / 2, H - 14);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const i = keys.findIndex(k => hitBox(k, p.mouseX, p.mouseY));
        if (i < 0) return false;
        press = i; api.sfx?.tap?.();
        if (keys[i].k === 'OK') { if (buf !== '') submit(); } else buf = typeKey(buf, keys[i].k);
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, buf, pause, answer: item().answer, keys: keys.map(k => ({ k: k.k, x: k.x + k.w / 2, y: k.y + k.h / 2 })) }),
    };
  }

  return { grade, create, typeKey };
})();
