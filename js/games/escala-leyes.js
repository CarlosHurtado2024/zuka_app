// La escalada de las leyes (Álgebra, leyes de los exponentes; juego dinámico de la lección alg-21b): un escalador
// está en el piso del exponente de una potencia de x. Cada tarjeta es una operación: «· x³» sube 3 pisos (se suman),
// «÷ x⁴» baja 4 (se restan) y «( )²» lo manda al doble del piso en que esté (se multiplican). Hay que usar todas las
// tarjetas, en el orden que lo deje en la bandera: el orden importa porque elevar multiplica lo que ya se lleva.
// No hay reloj y se puede deshacer. Terminar en otro piso quita una vida. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ start, cards: [{ op: 'mul' | 'div' | 'pow', k }], target }] }], lives?, letter? }
// state = { done: [n] }      Spec 2026-11-15-torres-de-potencias.

GAMES['escala-leyes'] = (() => {
  const applyCard = (e, c) => (c.op === 'mul' ? e + c.k : c.op === 'div' ? e - c.k : e * c.k);
  const perms = xs => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map(q => [x, ...q])));
  // Recorrido de un orden de tarjetas: los pisos por los que pasa.
  const pathOf = (it, order) => order.reduce((acc, i) => [...acc, applyCard(acc[acc.length - 1], it.cards[i])], [it.start]);
  const solutionsOf = it => perms(it.cards.map((_, i) => i)).filter(o => pathOf(it, o).pop() === it.target);
  // Pisos más bajo y más alto que se pueden pisar con cualquier orden.
  function reach(it) { const all = perms(it.cards.map((_, i) => i)).flatMap(o => pathOf(it, o)); return [Math.min(...all, it.target), Math.max(...all, it.target)]; }
  const cardTxt = (c, x = 'x') => (c.op === 'mul' ? `· ${x}${sup(c.k)}` : c.op === 'div' ? `÷ ${x}${sup(c.k)}` : `( )${sup(c.k)}`);
  const chainTxt = (it, order, x = 'x') => pathOf(it, order).map(e => `${x}${sup(e)}`).join(' → ');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => chainTxt(it, solutionsOf(it)[0], params.letter)).join(' · ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, X = params.letter || 'x';
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, used = [], pause = 0, result = null, ey = 0, cards = [], undo = {}, top = 100, bot = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; used = []; pause = 0; result = null; ey = item().start; },
      lost(i) { st.done[i] = 0; },
    });
    const round = () => R[a.cur], item = () => round().items[Math.min(st.done[a.cur], round().items.length - 1)];
    // Mientras se ve un acierto sigue en pantalla la pregunta respondida, no la siguiente.
    const shown = () => (pause > 0 && result && result.good ? round().items[Math.max(0, st.done[a.cur] - 1)] : item());
    const cur = () => pathOf(shown(), used).pop();

    function layout(w, h) { W = w; H = h; bot = h - 128; undo = { x: w / 2 - 56, y: h - 54, w: 112, h: 28 }; }
    function boxes() { const n = shown().cards.length, cw = Math.min(92, (W - 24) / n - 8); cards = shown().cards.map((_, i) => ({ x: W / 2 - (n * (cw + 8) - 8) / 2 + i * (cw + 8), y: H - 104, w: cw, h: 38 })); }
    function play(i) {
      used.push(i); api.sfx?.tap?.();
      const it = item();
      if (used.length < it.cards.length) return;
      const good = cur() === it.target;
      result = { good }; pause = good ? 1.5 : 1.3;
      if (good) { st.done[a.cur]++; a.hit(); a.say(chainTxt(it, used, X), C.ok); }
      else { a.say(`Quedó en ${X}${sup(cur())}, no en ${X}${sup(it.target)}: prueba otro orden`, C.bad); if (a.miss()) { result = null; pause = 0; } }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        ey += (cur() - ey) * Math.min(1, dt * 9);
        if (pause > 0) { pause -= dt; if (pause <= 0) { const good = result && result.good; result = null; used = []; if (good && st.done[a.cur] >= round().items.length) { a.win(); return; } ey = item().start; } }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = round(), it = shown(), live = a.phase === 'play', over = locked || a.phase === 'all';

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · el piso es el exponente de ${X}`, W / 2, 40, W - 24, 11);
        if (live) drawPill(p, C, `De ${X}${sup(it.start)} a ${X}${sup(it.target)} usando todas las tarjetas`, W / 2, 68, C.sun, 14);

        if (live) {
          boxes();
          // La escalera de pisos, la bandera y el escalador.
          const [lo, hi] = reach(it), n = hi - lo + 1, sp = (bot - top) / Math.max(1, n - 1), Y = e => bot - (e - lo) * sp, lx = 54, every = n > 16 ? 2 : 1;
          p.stroke(C.line); p.strokeWeight(3); p.line(lx, top, lx, bot);
          for (let e = lo; e <= hi; e++) {
            p.stroke(C.line); p.strokeWeight(2); p.line(lx - 8, Y(e), lx + 8, Y(e));
            if (e % every === 0 || e === it.target || e === it.start) { p.noStroke(); p.fill(e === 0 ? C.sun : C.mute); p.textStyle(p.BOLD); p.textSize(Math.min(11, sp + 2)); p.textAlign(p.RIGHT, p.CENTER); p.text(negTxt(e), lx - 13, Y(e)); }
          }
          p.noStroke(); p.fill(C.sun); p.triangle(lx + 10, Y(it.target) - 12, lx + 30, Y(it.target) - 6, lx + 10, Y(it.target)); p.stroke(C.sun); p.strokeWeight(2); p.line(lx + 10, Y(it.target) - 12, lx + 10, Y(it.target) + 2);
          const path = pathOf(it, used);
          p.noFill(); p.stroke(C.sky); p.strokeWeight(2);
          for (let k = 1; k < path.length; k++) p.arc(lx, (Y(path[k - 1]) + Y(path[k])) / 2, 22 + k * 6, Math.abs(Y(path[k]) - Y(path[k - 1])), -Math.PI / 2, Math.PI / 2);
          const col = result ? (result.good ? C.ok : C.bad) : C.coral;
          p.noStroke(); p.fill(shade(col, 0.74)); p.circle(lx, Y(ey) + 2, 20); p.fill(col); p.circle(lx, Y(ey), 20); p.fill(C.cream); p.circle(lx - 3, Y(ey) - 2, 4); p.circle(lx + 4, Y(ey) - 2, 4);
          // La cuenta, paso a paso.
          const tx = 106;
          p.noStroke(); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD);
          p.fill(C.ink); p.textSize(17); p.text(`${X}${sup(it.start)}`, tx, top + 14);
          used.forEach((ci, k) => {
            const c = it.cards[ci], from = path[k], to = path[k + 1], y = top + 14 + (k + 1) * 34;
            p.fill(C.mute); p.textSize(12); p.text(cardTxt(c, X), tx, y - 9);
            p.fill(C.ink); p.textSize(15); p.text(`${c.op === 'mul' ? `${negTxt(from)} + ${c.k}` : c.op === 'div' ? `${negTxt(from)} − ${c.k}` : `${negTxt(from)} · ${c.k}`} = ${negTxt(to)}  →  ${X}${sup(to)}`, tx, y + 8);
          });
          it.cards.forEach((c, i) => { const done = used.includes(i); drawTile(p, C, cards[i], cardTxt(c, X), { fill: done ? C.card : c.op === 'pow' ? C.sun : c.op === 'mul' ? C.mint : C.sky, ink: done ? C.mute : undefined, size: 16, r: 10, lift: done ? 0 : 3 }); });
          if (used.length && pause <= 0) drawTile(p, C, undo, 'Deshacer', { fill: C.cream, size: 12, r: 9, lift: 2 });
        }

        arcadeToast(p, C, a, W / 2, H - 13, locked);
        if (over) drawArcadeSummary(p, C, R.flatMap((rr, i) => rr.items.map(x => ({ ok: st.done[i] >= rr.items.length, text: chainTxt(x, solutionsOf(x)[0], X) }))).slice(0, 8), H / 2);
        else drawArcadeBanner(p, C, a, (top + bot) / 2, { idle: 'Sin prisa: el orden de las tarjetas importa', lost: 'Varios órdenes no llegaron a la bandera' });
        if (!a.toast && (over || a.phase === 'idle')) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(over ? '¡Cumbre! Ya puedes comprobar' : 'Multiplicar suma pisos · dividir resta · elevar multiplica el piso', W / 2, H - 13);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const x = p.mouseX, y = p.mouseY;
        if (used.length && hitBox({ x: undo.x - 4, y: undo.y - 4, w: undo.w + 8, h: undo.h + 8 }, x, y)) { used = []; api.sfx?.tap?.(); return false; }
        const i = cards.findIndex(b => hitBox(b, x, y));
        if (i < 0) return;
        if (!used.includes(i)) play(i);
        return false;
      };
    }, 1.4);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => { if (a.phase === 'play') boxes(); return { phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, used: [...used], cards: cards.map(b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 })), sol: solutionsOf(item())[0], undo: { x: undo.x + undo.w / 2, y: undo.y + undo.h / 2 } }; },
    };
  }

  return { grade, create, applyCard, pathOf, solutionsOf, reach, cardTxt, chainTxt };
})();
