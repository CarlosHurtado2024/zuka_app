// El muro de radicales (Álgebra, radicales semejantes; juego dinámico de la lección alg-22b): cada ladrillo mide
// √n de largo, dibujado a escala. Un ladrillo como √12 trae una costura: son dos ladrillos de √3 pegados (√12 = 2√3).
// (la costura y el color del tipo solo se ven al ponerlo en la fila: el montón es neutro).
// Se tocan ladrillos del montón para ponerlos en fila (tocarlos en la fila los devuelve) hasta que la fila mida lo
// pedido, por ejemplo 4√3. Solo se juntan en un solo radical los ladrillos del mismo tipo: √2 con √3 no se suman.
// No hay reloj. «¡Listo!» comprueba; fallar quita una vida y dice por qué. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ target: { c, r }, bricks: [n, …] }] }], lives? }   state = { done: [n] }
// Spec 2026-11-15-torres-de-potencias.

GAMES['muro-radicales'] = (() => {
  // √n = c·√r, con r sin cuadrados escondidos.
  function simp(n) { let c = 1, r = n; for (let f = Math.floor(Math.sqrt(n)); f > 1; f--) if (r % (f * f) === 0) { c *= f; r /= f * f; } return { c, r }; }
  const radTxt = t => (t.r === 1 ? `${t.c}` : `${t.c === 1 ? '' : t.c}√${t.r}`);
  // Largo total de unos ladrillos: cuántos √r de cada tipo.
  function totalOf(ns) {
    const by = new Map(); ns.forEach(n => { const t = simp(n); by.set(t.r, (by.get(t.r) || 0) + t.c); });
    return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([r, c]) => ({ c, r }));
  }
  const totalTxt = ts => (ts.length ? ts.map(radTxt).join(' + ') : '0');
  function judge(it, ns) {
    const tot = totalOf(ns), g = it.target;
    if (!ns.length) return { ok: false, msg: 'Pon ladrillos en la fila' };
    if (tot.length > 1) return { ok: false, msg: `Hay ladrillos de ${tot.map(t => `√${t.r}`).join(' y de ')}: no se juntan en uno solo` };
    if (tot[0].r !== g.r) return { ok: false, msg: `La fila es de √${tot[0].r} y la meta es de √${g.r}` };
    if (tot[0].c !== g.c) return { ok: false, msg: `Mide ${radTxt(tot[0])}: ${tot[0].c < g.c ? 'le falta' : 'le sobra'}` };
    return { ok: true, msg: `${ns.map(n => `√${n}`).join(' + ')} = ${radTxt(g)}` };
  }
  // Un grupo de ladrillos (sus posiciones) que da la meta, o null.
  function solve(it) {
    for (let mask = 1; mask < 1 << it.bricks.length; mask++) {
      const idx = it.bricks.map((_, i) => i).filter(i => mask & (1 << i));
      if (judge(it, idx.map(i => it.bricks[i])).ok) return idx;
    }
    return null;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => judge(it, solve(it).map(i => it.bricks[i])).msg).join(' · ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, row = [], pause = 0, result = null, btn = {}, pile = [];
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; row = []; pause = 0; result = null; },
      lost(i) { st.done[i] = 0; },
    });
    const round = () => R[a.cur], item = () => round().items[Math.min(st.done[a.cur], round().items.length - 1)];
    const colOf = r => ({ 2: C.sky, 3: C.mint, 5: C.coral, 7: C.sun }[r] || C.Q);
    const unit = () => (W - 28) / 13;

    function layout(w, h) { W = w; H = h; btn = { x: w / 2 - 62, y: h - 60, w: 124, h: 32 }; }
    function boxes(it = item()) { const n = it.bricks.length, per = Math.min(n, 3), bw = Math.min(96, (W - 24) / per - 8); pile = it.bricks.map((_, i) => ({ x: W / 2 - (per * (bw + 8) - 8) / 2 + (i % per) * (bw + 8), y: 262 + Math.floor(i / per) * 46, w: bw, h: 36 })); }
    function check() {
      const it = item(), res = judge(it, row.map(i => it.bricks[i]));
      if (!row.length) { a.say(res.msg, C.sun); return; }
      result = res; pause = res.ok ? 1.6 : 1.3;
      if (res.ok) { st.done[a.cur]++; a.hit(); a.say(res.msg, C.ok); }
      else { a.say(res.msg, C.bad); if (a.miss()) { result = null; pause = 0; row = []; } }
    }
    // Una barra de ladrillos a escala, con la costura de cada ladrillo compuesto.
    function bar(p, ns, y, h, ghost) {
      let x = 14; const u = unit(), cells = [];
      ns.forEach((n, k) => {
        const t = simp(n), len = Math.sqrt(n) * u, w = Math.min(len, W - 14 - x);
        if (w <= 0) return;
        if (ghost) { p.noFill(); p.stroke(C.mute); p.strokeWeight(2); p.drawingContext.setLineDash([5, 5]); p.rect(x, y, w, h, 5); p.drawingContext.setLineDash([]); }
        else {
          p.noStroke(); p.fill(shade(colOf(t.r), 0.74)); p.rect(x, y + 3, w, h, 5); p.fill(colOf(t.r)); p.rect(x, y, w, h, 5);
          p.stroke(C.night); p.strokeWeight(1.5); for (let j = 1; j < t.c; j++) { const sx = x + (j * len) / t.c; if (sx < W - 14) p.line(sx, y + 3, sx, y + h - 3); }
          p.noStroke(); p.fill(inkOn(colOf(t.r), C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, `√${n}`, x + w / 2, y + h / 2 + 1, w - 4, 13);
        }
        cells.push({ x, y, w, h, k }); x += len;
      });
      return cells;
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play' || pause <= 0) return;
        pause -= dt;
        if (pause <= 0) { const good = result && result.ok; result = null; if (good) { row = []; if (st.done[a.cur] >= round().items.length) a.win(); } }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = round(), live = a.phase === 'play', over = locked || a.phase === 'all';
        const it = pause > 0 && result && result.ok ? r.items[Math.max(0, st.done[a.cur] - 1)] : item();

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · cada ladrillo mide lo que dice, a escala`, W / 2, 40, W - 24, 11);
        if (live) {
          drawPill(p, C, `Arma una fila que mida ${radTxt(it.target)}`, W / 2, 68, C.sun, 16);
          boxes(it);   // el montón de la pregunta que se ve (mientras se muestra un acierto, la anterior)
          const g = it.target, ns = row.map(i => it.bricks[i]), tot = totalOf(ns);
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text('meta', 14, 98);
          bar(p, Array(g.c).fill(g.r), 106, 22, true);
          p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text('tu fila', 14, 144);
          G_row = bar(p, ns, 152, 30, false);
          p.noStroke(); p.fill(result ? (result.ok ? C.ok : C.bad) : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, ns.length ? `${ns.map(n => `√${n}`).join(' + ')} = ${totalTxt(tot)}` : 'Toca ladrillos del montón para ponerlos en fila', W / 2, 206, W - 24, 15);
          p.fill(C.mute); p.textSize(11); p.text('montón', W / 2, 246);
          it.bricks.forEach((n, i) => { const usedB = row.includes(i), t = simp(n); drawTile(p, C, pile[i], `√${n}`, { fill: usedB ? C.card : C.cream, ink: usedB ? C.mute : undefined, size: 16, r: 9, lift: usedB ? 0 : 3 }); });
          if (pause <= 0) drawTile(p, C, btn, '¡Listo!', { fill: C.mint, size: 15, r: 10, lift: 2 });
        }

        arcadeToast(p, C, a, W / 2, H - 13, locked);
        if (over) drawArcadeSummary(p, C, R.flatMap((rr, i) => rr.items.map(x => ({ ok: st.done[i] >= rr.items.length, text: judge(x, solve(x).map(k => x.bricks[k])).msg }))).slice(0, 8), H / 2);
        else drawArcadeBanner(p, C, a, H / 2 - 20, { idle: 'Sin prisa: mira las costuras de cada ladrillo', lost: 'Varias filas no midieron lo pedido' });
        if (!a.toast && (over || a.phase === 'idle')) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(over ? '¡Muro terminado! Ya puedes comprobar' : 'Solo se juntan los ladrillos del mismo tipo', W / 2, H - 13);
        }
        arcadeStop(p, a, locked);
      };
      let G_row = [];

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const x = p.mouseX, y = p.mouseY;
        if (hitBox({ x: btn.x - 6, y: btn.y - 4, w: btn.w + 12, h: btn.h + 10 }, x, y)) { check(); return false; }
        const i = pile.findIndex(b => hitBox(b, x, y));
        if (i >= 0) { if (row.includes(i)) row = row.filter(k => k !== i); else row.push(i); api.sfx?.tap?.(); return false; }
        const c = G_row.find(b => hitBox(b, x, y));
        if (c) { row.splice(c.k, 1); api.sfx?.tap?.(); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => { if (a.phase === 'play') boxes(); return { phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, row: [...row], sol: solve(item()), ok: { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 }, pile: pile.map(b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 })) }; },
    };
  }

  return { grade, create, simp, totalOf, judge, solve, radTxt };
})();
