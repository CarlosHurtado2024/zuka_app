// La máquina sigma (Álgebra, sumatoria y productoria; juego dinámico de la lección alg-15): arriba está la orden
// («Σ 3k, de k = 1 a 4») y por una cinta van pasando fichas con números. Abajo hay una máquina que pide el término
// del k actual: hay que agarrar de la cinta la ficha que vale ese término y soltarla en la máquina. La máquina la
// suma (o la multiplica, si es una productoria) y pasa al k siguiente. Soltar otra ficha quita una vida. Sin vidas,
// la ronda empieza otra vez.
// params = { rounds: [{ title, kind: 'sum' | 'prod', items: [{ expr, lo, hi, f, traps: [...] }] }], lives? }
// state = { done: [n] }      Spec 2026-11-13-juegos-dinamicos-progresiones.

GAMES['maquina-sigma'] = (() => {
  const TW = 46, TH = 40, GAP = 12;
  const termsOf = it => Array.from({ length: it.hi - it.lo + 1 }, (_, j) => it.f(it.lo + j));
  const totalOf = (it, kind) => termsOf(it).reduce((s, v) => (kind === 'prod' ? s * v : s + v), kind === 'prod' ? 1 : 0);
  const sym = kind => (kind === 'prod' ? 'Π' : 'Σ');
  const op = kind => (kind === 'prod' ? ' · ' : ' + ');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    const solution = params.rounds.map(r => r.items.map(it => `${sym(r.kind)} ${it.expr} (k de ${it.lo} a ${it.hi}) = ${termsOf(it).join(op(r.kind))} = ${totalOf(it, r.kind)}`).join(' · ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, beltY = 0, mach = { x: 0, y: 0, w: 0, h: 0 }, queue = [], tiles = [], fed = 0, off = 0, drag = null, pause = 0, n = 0, gulp = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); load(); },
      lost(i) { st.done[i] = 0; drag = null; },
    });
    const item = () => R[a.cur].items[queue[0] ?? 0];
    const loopLen = () => Math.max(W + TW, tiles.length * (TW + GAP));
    // Posición de una ficha en la cinta (da la vuelta) o bajo el dedo.
    const posOf = t => (t === drag ? { x: drag.fx, y: drag.fy } : { x: ((((t.slot * loopLen()) / tiles.length + off) % loopLen()) + loopLen()) % loopLen() - TW / 2, y: beltY });
    const want = () => termsOf(item())[fed];

    function layout(w, h) { W = w; H = h; beltY = 176; mach = { x: w / 2 - 92, y: h - 150, w: 184, h: 96 }; }
    function load() {
      const it = item(), values = [...termsOf(it), ...it.traps], order = shuffledOrder(values.length, `${it.expr}|${n++}`);
      tiles = values.map((value, i) => ({ value, slot: order[i], gone: false }));
      fed = 0; off = 0; drag = null; pause = 0;
    }
    function drop(t) {
      const r = R[a.cur], it = item();
      if (t.value === want()) {
        t.gone = true; fed++; gulp = 1; a.hit(); api.sfx?.tap?.();
        if (fed === termsOf(it).length) { st.done[a.cur]++; pause = 1.5; a.say(`${termsOf(it).join(op(r.kind))} = ${totalOf(it, r.kind)}`, C.ok); }
      } else { a.say(`${t.value} no es el término de k = ${it.lo + fed}`, C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        gulp = Math.max(0, gulp - dt * 3);
        if (a.phase !== 'play') return;
        if (pause > 0) { pause -= dt; if (pause <= 0) { queue.shift(); if (!queue.length) { a.win(); return; } load(); } return; }
        off += (40 + a.cur * 10) * dt;
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item(), terms = termsOf(it), live = a.phase !== 'idle' && !(locked || a.phase === 'all');

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${r.title} · ${r.kind === 'prod' ? 'productoria: se multiplica' : 'sumatoria: se suma'}`, W / 2, 40);
        if (live) {
          // La orden: el símbolo con sus límites y la fórmula.
          p.noStroke(); p.fill(C.sun); p.textStyle(p.BOLD); p.textSize(40); p.textAlign(p.CENTER, p.CENTER);
          p.text(sym(r.kind), W / 2 - 46, 96);
          p.fill(C.ink); p.textSize(12); p.text(it.hi, W / 2 - 46, 66); p.text(`k = ${it.lo}`, W / 2 - 46, 126);
          p.textSize(24); p.textAlign(p.LEFT, p.CENTER); p.text(it.expr, W / 2 - 20, 96);

          // La cinta y sus fichas.
          p.noStroke(); p.fill(C.card); p.rect(0, beltY - TH / 2 - 8, W, TH + 16);
          p.stroke(C.line); p.strokeWeight(2);
          for (let x = ((off % 24) + 24) % 24 - 24; x < W; x += 24) p.line(x, beltY + TH / 2 + 8, x + 10, beltY + TH / 2 + 2);
          tiles.forEach(t => { if (t.gone || t === drag) return; const q = posOf(t); drawTile(p, C, { x: q.x - TW / 2, y: q.y - TH / 2, w: TW, h: TH - 3 }, t.value, { fill: C.cream, size: 18, r: 9 }); });

          // La máquina: pide el término del k actual y muestra lo que lleva.
          const k = 1 + 0.06 * gulp, mw = mach.w * k, mh = mach.h * k, mx = W / 2 - mw / 2, my = mach.y + mach.h / 2 - mh / 2;
          p.noStroke(); p.fill(shade(C.sky, 0.72)); p.rect(mx, my + 5, mw, mh, 16);
          p.fill(pause > 0 ? C.ok : C.sky); p.rect(mx, my, mw, mh, 16);
          p.fill(C.night); p.rect(W / 2 - 34, my - 8, 68, 16, 8);
          p.fill(inkOn(pause > 0 ? C.ok : C.sky, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          if (pause > 0) { p.textSize(22); p.text(`= ${totalOf(it, r.kind)}`, W / 2, mach.y + 34); }
          else { p.textSize(13); p.text('Échale el término de', W / 2, mach.y + 26); p.textSize(22); p.text(`k = ${it.lo + fed}`, W / 2, mach.y + 50); }
          const got = terms.slice(0, fed).join(op(r.kind));
          fitText(p, fed ? `${got}${fed < terms.length ? op(r.kind) + '…' : ''}` : 'vacía', W / 2, mach.y + 78, mach.w - 20, 13);

          if (drag) drawTile(p, C, { x: drag.fx - TW / 2, y: drag.fy - TH / 2 - 6, w: TW, h: TH - 3 }, drag.value, { fill: C.sun, size: 18, r: 9, lift: 5 });
        }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (beltY + mach.y) / 2 + 20;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.flatMap((rr, i) => rr.items.map(x => ({ ok: st.done[i] >= rr.items.length, text: `${sym(rr.kind)} ${x.expr}, k de ${x.lo} a ${x.hi}: ${totalOf(x, rr.kind)}` }))).slice(0, 9), H / 2);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Arrastra a la máquina el término que pide', lost: 'Demasiadas fichas equivocadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Máquina llena! Ya puedes comprobar' : 'Reemplaza k en la fórmula y busca ese número en la cinta', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const t = tiles.find(x => { if (x.gone) return false; const q = posOf(x); return Math.abs(p.mouseX - q.x) <= TW / 2 + 5 && Math.abs(p.mouseY - q.y) <= TH / 2 + 8; });
        if (t) { drag = t; t.fx = p.mouseX; t.fy = p.mouseY; }
        return false;
      };
      p.mouseDragged = () => { if (drag && !locked && a.phase === 'play') { drag.fx = p.mouseX; drag.fy = p.mouseY; return false; } };
      p.mouseReleased = () => {
        if (!drag) return;
        const t = drag; drag = null;
        if (locked || a.phase !== 'play' || pause > 0) return;
        if (t.fx > mach.x - 10 && t.fx < mach.x + mach.w + 10 && t.fy > mach.y - 16) drop(t);
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, want: want(), machine: { x: mach.x + mach.w / 2, y: mach.y + mach.h / 2 }, tiles: tiles.filter(t => !t.gone).map(t => ({ ...posOf(t), value: t.value })) }),
    };
  }

  return { grade, create, termsOf, totalOf };
})();
