// La rana que se achica (Álgebra, suma geométrica y suma infinita; juego dinámico de la lección alg-14d): una rana
// salta sobre una recta numérica y cada salto mide una fracción del anterior (8, 4, 2, 1…). Cada toque en el estanque
// es un salto: se ve la suma que lleva. Hay tres banderas. En las preguntas cortas («da 3 saltos: ¿dónde cae?») se da
// la cantidad de saltos y se toca la bandera donde quedó; en las infinitas hay que saltar varias veces, ver que cada
// vez avanza menos y tocar la bandera a la que se acerca sin llegar nunca. Una garza viene detrás: si alcanza a la
// rana, la pregunta vuelve después (sin perder vida). Tocar otra bandera quita una vida. Sin vidas, la ronda empieza
// otra vez.
// params = { rounds: [{ title, items: [{ a1, r: [num, den], n?, flags: [a, b, c], answer, max }] }], lives? }
// state = { done: [n] }      Spec 2026-11-13-juegos-dinamicos-progresiones.

GAMES['rana-zenon'] = (() => {
  const MIN_INF = 5;   // saltos que hay que dar antes de responder una suma infinita
  const ratio = it => it.r[0] / it.r[1];
  // Suma de los k primeros saltos.
  function partial(it, k) { let s = 0, t = it.a1; for (let i = 0; i < k; i++) { s += t; t *= ratio(it); } return +s.toFixed(9); }
  const limitOf = it => +(it.a1 / (1 - ratio(it))).toFixed(9);
  const answerOf = it => (it.n ? partial(it, it.n) : limitOf(it));
  const fmt = v => String(+v.toFixed(3));
  const rtxt = it => (it.r[1] === 1 ? `${it.r[0]} veces` : it.r[0] === 1 ? ({ 2: 'la mitad', 3: 'la tercera parte', 4: 'la cuarta parte', 5: 'la quinta parte' }[it.r[1]] || `1/${it.r[1]}`) : `${it.r[0]}/${it.r[1]}`);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    const solution = params.rounds.map(r => r.items.map(it => (it.n ? `${it.n} saltos desde ${it.a1} (${rtxt(it)} cada vez): ${fmt(answerOf(it))}` : `saltos sin fin desde ${it.a1} (${rtxt(it)} cada vez): se acerca a ${fmt(answerOf(it))}`)).join(' · ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, lineY = 0, queue = [], perm = [0, 1, 2], jumps = 0, frog = 0, hop = 0, from = 0, heron = 0, pause = 0, result = null, n = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); load(); },
      lost(i) { st.done[i] = 0; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];
    const X = v => 22 + (v / item().max) * (W - 44);
    const need = it => it.n || MIN_INF;

    function layout(w, h) { W = w; H = h; lineY = h * 0.6; }
    function load() { const it = item(); perm = shuffledOrder(3, `${it.a1}|${it.flags.join()}|${n++}`); jumps = 0; frog = 0; from = 0; hop = 0; heron = -0.34 * it.max; pause = 0; result = null; }
    function answer(i) {
      const it = item(), good = perm[i] === it.answer;
      result = { pick: i, good }; pause = good ? 1.3 : 1.4;
      if (good) { st.done[a.cur]++; a.hit(); a.say(it.n ? `Después de ${it.n} saltos: ${it.flags[it.answer]}` : `Se acerca a ${it.flags[it.answer]} y nunca lo pasa`, C.ok); }
      else { a.say(it.n ? `No cae en ${it.flags[perm[i]]}` : `No se acerca a ${it.flags[perm[i]]}`, C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        const it = item();
        if (hop > 0) hop = Math.max(0, hop - dt / 0.28);
        if (pause > 0) {
          pause -= dt;
          if (pause <= 0) { if (result.good) queue.shift(); else queue.push(queue.shift()); if (!queue.length) { a.win(); return; } load(); }
          return;
        }
        // La garza: empieza a caminar con el primer salto y, si alcanza a la rana, la pregunta vuelve después.
        if (jumps > 0) heron += it.max * 0.05 * dt;
        if (heron >= frog - it.max * 0.02) { result = { pick: -1, good: false }; pause = 1.1; a.say('La garza la alcanzó: vuelve después', C.sun); }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), fx = X(from + (frog - from) * (1 - hop)), up = Math.sin((1 - hop) * Math.PI) * (hop > 0 ? 26 : 0);

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · primer salto ${it.a1}, luego ${rtxt(it)} cada vez`, W / 2, 40, W - 24, 11);
        if (a.phase === 'play') {
          drawPill(p, C, it.n ? `Da ${it.n} saltos: ¿dónde cae?` : 'Sin parar: ¿a cuál se acerca?', W / 2, 68, C.sun, 15);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER);
          p.text(jumps ? `saltos: ${jumps} · va en ${fmt(frog)}` : 'toca el estanque para saltar', W / 2, 96);
        }

        // El estanque, la recta y las banderas.
        const water = p.color(C.sky); water.setAlpha(60);
        p.noStroke(); p.fill(water); p.rect(8, lineY, W - 16, H - lineY - 36, 12);
        p.stroke(C.ink); p.strokeWeight(3); p.line(14, lineY, W - 14, lineY);
        const stepV = it.max > 12 ? 4 : 2;
        p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER);
        for (let v = 0; v <= it.max; v += stepV) { p.stroke(C.ink); p.strokeWeight(1.5); p.line(X(v), lineY - 5, X(v), lineY + 5); p.noStroke(); p.fill(C.mute); p.text(v, X(v), lineY + 16); }
        if (a.phase !== 'idle' && !(locked || a.phase === 'all')) {
          perm.forEach((k, i) => {
            const x = X(+it.flags[k]), good = k === it.answer, col = result && result.pick === i ? (good ? C.ok : C.bad) : result && result.good && good ? C.ok : [C.coral, C.sky, C.mint][i];
            const top = lineY - 44 - i * 26;   // cada bandera a una altura distinta: no se tapan si quedan juntas
            p.stroke(C.ink); p.strokeWeight(2); p.line(x, lineY, x, top);
            drawPill(p, C, it.flags[k], x + 20 > W - 26 ? x - 20 : x + 20, top + 2, col, 13);
          });
          // Los saltos ya dados (arcos), la garza y la rana.
          p.noFill(); p.stroke(C.mint); p.strokeWeight(2);
          for (let k = 0; k < jumps - (hop > 0 ? 1 : 0); k++) { const x0 = X(partial(it, k)), x1 = X(partial(it, k + 1)); p.arc((x0 + x1) / 2, lineY, x1 - x0, Math.min(40, (x1 - x0) * 0.8), Math.PI, 0); }
          const hx = Math.max(10, X(Math.max(0, heron)));
          p.stroke(C.ink); p.strokeWeight(3); p.line(hx, lineY, hx, lineY - 26); p.strokeWeight(1.5); p.fill(C.cream); p.ellipse(hx, lineY - 30, 14, 18); p.noStroke(); p.fill(C.coral); p.triangle(hx + 6, lineY - 33, hx + 20, lineY - 30, hx + 6, lineY - 27);
          p.noStroke(); p.fill(shade(C.mint, 0.76)); p.ellipse(fx, lineY - 8 - up + 3, 24, 17);
          p.fill(C.mint); p.ellipse(fx, lineY - 8 - up, 24, 17);
          p.fill(C.cream); p.circle(fx + 5, lineY - 15 - up, 7); p.fill(C.night); p.circle(fx + 6, lineY - 15 - up, 3.5);
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = lineY + (H - lineY - 36) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.title}: ${Math.min(st.done[i], rr.items.length)} de ${rr.items.length}` })), 170);
        else drawArcadeBanner(p, C, a, 170, { idle: 'Toca el estanque para saltar', lost: 'Demasiadas banderas equivocadas' });
        if (a.phase === 'play' && pause <= 0) {
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
          p.text(jumps < need(it) ? `Salta ${need(it) - jumps} ${need(it) - jumps === 1 ? 'vez' : 'veces'} más` : 'Ahora toca la bandera', W / 2, mid);
        }
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡La rana se salvó! Ya puedes comprobar' : 'Estanque: saltar · bandera: responder', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const it = item();
        // ¿Tocó una bandera? (su píldora o su asta); si no, es un salto.
        const f = perm.findIndex((k, i) => { const x = X(+it.flags[k]), top = lineY - 44 - i * 26, px = x + 20 > W - 26 ? x - 20 : x + 20; return Math.hypot(p.mouseX - px, p.mouseY - (top + 2)) < 26 || (Math.abs(p.mouseX - x) < 12 && p.mouseY > top - 10 && p.mouseY < lineY - 12); });
        if (f >= 0 && p.mouseY < lineY - 10) {
          if (jumps < need(it)) a.say(it.n ? `Primero da los ${it.n} saltos` : 'Salta más veces: mira cuánto avanza', C.sun);
          else answer(f);
          return false;
        }
        if (p.mouseY < lineY) return false;
        if (it.n && jumps >= it.n) { a.say(`Ya diste los ${it.n} saltos: toca la bandera`, C.sun); return false; }
        if (hop > 0 || jumps >= 14) return false;
        from = frog; jumps++; frog = partial(it, jumps); hop = 1; api.sfx?.tap?.();
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => { const it = item(); return { phase: a.phase, cur: a.cur, lives: a.lives, W, H, jumps, need: need(it), pause, hopping: hop > 0, pondY: lineY + 50, flags: perm.map((k, i) => { const x = X(+it.flags[k]); return { x: x + 20 > W - 26 ? x - 20 : x + 20, y: lineY - 42 - i * 26, good: k === it.answer }; }) }; },
    };
  }

  return { grade, create, partial, limitOf, answerOf };
})();
