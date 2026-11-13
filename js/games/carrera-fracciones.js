// La carrera de las fracciones (Álgebra 1.1, racionales; juego dinámico de la lección alg-11b). La idea del video:
// un mismo número racional tiene muchos nombres (1/4, 0.25, 2/8). Un corredor avanza por una pista de tres carriles;
// arriba sale un número y llega una fila de tres puertas que SE DETIENE y espera: no hay prisa ni cuentas a
// contrarreloj. Arriba hay dos reglas con la misma escala: la del número pedido (cortada en sus partes: 1/4 son 1 paso
// de los 4 en que se parte la unidad) y la de la puerta que se toque. Tocar una puerta la compara; si las dos barras
// miden lo mismo, son el mismo número. Tocarla otra vez hace pasar al corredor. Pasar por otra quita una vida y la
// pregunta vuelve después con una ayuda. Tras la última puerta baja la meta. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ ask, options: [a, b, c], answer }] }], lives? }   state = { done: [n] }
// Specs 2026-11-13-juegos-dinamicos-valle, 2026-11-14-mejoras-carrera-y-aguja y 2026-11-14-juegos-conceptuales-valle.

GAMES['carrera-fracciones'] = (() => {
  const laneOf = (x, w) => Math.max(0, Math.min(2, Math.floor((x / w) * 3)));
  // Valor de un texto: «1/4», «−6/3», «0.125», «4».
  function valueOf(txt) {
    const t = String(txt).replace(/−/g, '-'), fr = t.split('/');
    return fr.length === 2 ? +fr[0] / +fr[1] : +t;
  }
  // En cuántas partes iguales corta la unidad ese nombre del número: el denominador, 10, 100 o 1000 para un decimal, 1 para un entero.
  function partsOf(txt) {
    const t = String(txt), fr = t.split('/');
    if (fr.length === 2) return Math.abs(+fr[1]);
    return t.includes('.') ? 10 ** t.split('.')[1].length : 1;
  }
  // Tramo de enteros que deben mostrar las reglas para que quepan el número pedido y las tres puertas.
  function rangeOf(it) {
    const vs = [it.ask, ...it.options].map(valueOf);
    return [Math.min(0, Math.floor(Math.min(...vs))), Math.max(1, Math.ceil(Math.max(...vs)))];
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

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask} = ${it.options[it.answer]}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, TOP = 150;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, runY = 0, stopY = 0, lane = 1, runX = 0, queue = [], row = null, finish = null, gap = 0, scroll = 0, n = 0;
    let streak = 0, missed = new Set(), bits = [], shake = 0, run = 0, grow = 0;
    const missedOf = R.map(() => new Set());   // las falladas de cada ronda: la ayuda sigue si la ronda se reintenta
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); row = null; finish = null; gap = 0.5; streak = 0; missed = missedOf[i]; bits = []; },
      lost(i) { st.done[i] = 0; row = null; finish = null; streak = 0; },
    });
    const laneX = k => 14 + ((W - 28) / 3) * (k + 0.5), laneW = () => (W - 28) / 3;

    function layout(w, h) { W = w; H = h; runY = h - 78; stopY = TOP + 46; if (!runX) runX = laneX(1); }
    function spawn() {
      const idx = queue[0], it = R[a.cur].items[idx];
      // state: 'coming' (baja hasta la raya de espera) → 'waiting' (espera a que se elija) → 'going' (va hacia el corredor)
      row = { y: TOP + 4, it, idx, perm: shuffledOrder(3, it.ask + (n++)), state: 'coming', sel: -1, done: false, pick: -1 };
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
        shake = Math.max(0, shake - dt * 3); grow = Math.min(1, grow + dt * 3.5);
        bits = bits.filter(b => { b.t -= dt * 1.6; b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 420 * dt; return b.t > 0; });
        if (a.phase !== 'play') return;
        const speed = (runY - TOP) / 1.5, waiting = row && row.state === 'waiting';
        if (!waiting) { scroll = (scroll + speed * dt) % 40; run += dt * 10; }   // mientras la fila espera, todo se detiene
        if (finish) {   // la meta: al cruzarla se gana la ronda
          finish.y += speed * dt;
          if (finish.y >= runY - 10) { finish = null; a.win(); }
          return;
        }
        if (!row) { gap -= dt; if (gap <= 0 && queue.length) spawn(); return; }
        if (row.state === 'coming') { row.y = Math.min(stopY, row.y + speed * dt); if (row.y >= stopY) row.state = row.go ? 'going' : 'waiting'; return; }
        if (row.state === 'waiting') return;
        row.y += speed * dt * (row.done ? 1.6 : 1);
        if (!row.done && row.y >= runY - 22) {
          row.done = true; row.pick = lane;
          const it = row.it, good = row.perm[lane] === it.answer;
          if (good) {
            st.done[a.cur]++; queue.shift(); streak++; a.hit(); burst(laneX(lane), runY - 22, C.ok);
            a.say(`${it.ask} y ${it.options[it.answer]} son el mismo número`, C.ok);
          } else {
            a.say(`${it.options[row.perm[lane]]} no mide lo mismo que ${it.ask}`, C.bad); queue.push(queue.shift()); missed.add(row.idx); streak = 0; shake = 1;
            if (a.miss()) return;
          }
        }
        if (row.y > H + 30) { row = null; if (queue.length) gap = 0.35; else finish = { y: TOP - 10 }; }
      }

      // Una regla: de lo a hi, cortada en `parts` partes por unidad, con una barra desde 0 hasta el valor.
      function ruler(y, txt, col, lo, hi, k) {
        const x0 = 62, x1 = W - 16, X = v => x0 + ((v - lo) / (hi - lo)) * (x1 - x0), v = valueOf(txt), h = 13;
        let parts = partsOf(txt);
        while (parts > 10 && parts % 10 === 0 && (x1 - x0) / ((hi - lo) * parts) < 5) parts /= 10;   // centésimas que no caben: décimas
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.RIGHT, p.CENTER); fitText(p, txt, x0 - 8, y + h / 2, 44, 13);
        p.stroke(C.line); p.strokeWeight(1); p.fill(C.card); p.rect(x0, y, x1 - x0, h, 4); p.noStroke();
        p.fill(col); const xa = X(0), xb = X(v * k); p.rect(Math.min(xa, xb), y, Math.abs(xb - xa), h, 3);
        const cuts = (hi - lo) * parts;
        if (parts > 1 && (x1 - x0) / cuts >= 5) { /* más juntos que 5 px se verían como una mancha */ p.stroke(C.mute); p.strokeWeight(1); for (let j = 1; j < cuts; j++) if (j % parts) { const x = X(lo + j / parts); p.line(x, y + 2, x, y + h - 2); } }
        p.stroke(C.ink); p.strokeWeight(2); for (let u = lo; u <= hi; u++) p.line(X(u), y - 2, X(u), y + h + 2);
        return X;
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], lw = laneW(), sx = shake > 0 ? Math.sin(shake * 40) * 5 * shake : 0;

        p.push(); p.translate(sx, 0);
        // La pista: tres carriles con rayas que corren hacia abajo.
        for (let k = 0; k < 3; k++) {
          p.noStroke(); p.fill(C.halo); p.rect(14 + k * lw + 3, TOP - 4, lw - 6, H - TOP - 30, 12);   // tono propio: las puertas crema se distinguen en los dos temas
          p.stroke(C.line); p.strokeWeight(3);
          for (let y = TOP + scroll - 40; y < H - 40; y += 40) if (y > TOP) p.line(laneX(k), y, laneX(k), Math.min(H - 40, y + 14));
        }
        // La meta a cuadros.
        if (finish) {
          const s = (W - 28) / 18;
          p.noStroke(); p.fill(C.sun); p.rect(12, finish.y - 3, W - 24, s * 3 + 6, 4);
          for (let k = 0; k < 18; k++) for (let j = 0; j < 3; j++) { p.fill((k + j) % 2 ? C.night : C.cream); p.rect(14 + k * s, finish.y + j * s, s + 0.5, s + 0.5); }
        }
        // La fila de puertas; la elegida lleva aro.
        if (row) for (let k = 0; k < 3; k++) {
          const opt = row.it.options[row.perm[k]], good = row.perm[k] === row.it.answer;
          if (row.done && good && row.pick === k) continue;   // la acertada ya estalló
          const fill = !row.done ? C.cream : good ? C.ok : row.pick === k ? C.bad : C.cream;
          drawTile(p, C, { x: 14 + k * lw + 7, y: row.y - 20, w: lw - 14, h: 40 }, opt, { fill, size: 17, ring: !row.done && row.sel === k ? C.sky : null });
        }
        bits.forEach(b => { const c = p.color(b.col); c.setAlpha(255 * Math.min(1, b.t * 1.5)); p.noStroke(); p.fill(c); p.rect(b.x - b.s / 2, b.y - b.s / 2, b.s, b.s, 2); });

        // El corredor: cuadradito color sol con ojos y piernas; con racha deja estela.
        const moving = a.phase === 'play' && !(row && row.state === 'waiting'), bob = moving ? Math.abs(Math.sin(run)) * 3 : 0, x = runX, y = runY - bob;
        if (moving && streak >= 2) for (let k = 1; k <= 3; k++) { const c = p.color(k % 2 ? C.sun : C.coral); c.setAlpha(110 - k * 28); p.noStroke(); p.fill(c); p.rect(x - 11 + k, y + 14 + k * 11, 22 - k * 2, 8, 4); }
        const g = p.color(C.night); g.setAlpha(60); p.noStroke(); p.fill(g); p.ellipse(x, runY + 21, 30 - bob * 2, 7);
        const leg = moving ? Math.sin(run) * 5 : 0;
        p.fill(shade(C.sun, 0.6)); p.rect(x - 10, y + 12, 7, 8 + leg, 3); p.rect(x + 3, y + 12, 7, 8 - leg, 3);
        p.fill(shade(C.sun, 0.74)); p.rect(x - 15, y - 11, 30, 28, 9);
        p.fill(C.sun); p.rect(x - 15, y - 15, 30, 28, 9);
        p.fill(C.night); p.circle(x - 5, y - 4, 5); p.circle(x + 5, y - 4, 5);
        if (a.phase === 'play' && streak >= 2) drawPill(p, C, `×${streak}`, x + (lane === 2 ? -30 : 30), y - 2, C.coral, 11);   // al lado: no tapa la puerta que llega
        p.pop();

        // Encabezado: ronda, vidas, el número pedido y las dos reglas para comparar.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, TOP - 8);
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · busca otro nombre para`, W / 2, 40, W - 24, 11);
        const idx = row ? row.idx : queue.length ? queue[0] : -1, it = idx >= 0 ? r.items[idx] : null;
        if (a.phase === 'play' && finish) drawPill(p, C, '¡A la meta!', W / 2, 84, C.mint, 18);
        else if (it && a.phase === 'play') {
          drawPill(p, C, it.ask, W / 2, 64, C.sun, 18);
          const [lo, hi] = rangeOf(it);
          const X = ruler(86, it.ask, C.sun, lo, hi, 1);
          const sel = row && row.sel >= 0 ? row.it.options[row.perm[row.sel]] : null;
          if (sel) ruler(107, sel, C.sky, lo, hi, grow);
          else { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text(missed.has(idx) ? helpOf(it) : 'toca una puerta para medirla aquí', (62 + W - 16) / 2, 114); }
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
          for (let u = lo; u <= hi; u++) p.text(negTxt(u), X(u), 131);
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (TOP + H) / 2 - 20;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), mid, W - 44);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Sin prisa: la fila de puertas te espera', lost: 'Demasiadas puertas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          const sel = row && !row.done && row.sel >= 0;
          p.text(locked || a.phase === 'all' ? '¡Carrera terminada! Ya puedes comprobar' : sel ? '¿Miden lo mismo? Tócala otra vez para pasar' : 'Toca una puerta para compararla con el número', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const t = a.tap(locked);
        if (t === 'off') return;
        if (t !== 'play' || !row || row.done || row.state === 'going') return false;
        if (p.mouseY < TOP - 10) return false;   // tocar las reglas no elige puerta
        const k = laneOf(p.mouseX, W);
        if (row.sel === k && row.state === 'waiting') { row.state = 'going'; api.sfx?.tap?.(); }   // segundo toque: pasar
        else if (row.sel === k) row.go = true;   // segundo toque antes de que la fila llegue: pasa al llegar
        else if (row.sel !== k) { row.sel = k; row.go = false; lane = k; grow = 0; api.sfx?.tap?.(); }              // primer toque: comparar
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, lane, streak, finish: !!finish, help: row && missed.has(row.idx) ? helpOf(row.it) : '', row: row && { y: row.y, done: row.done, state: row.state, sel: row.sel, good: row.perm.indexOf(row.it.answer) } }),
    };
  }

  return { grade, create, laneOf, valueOf, partsOf, rangeOf, helpOf };
})();
