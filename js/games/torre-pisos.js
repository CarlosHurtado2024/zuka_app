// La torre de pisos (Álgebra, potencias; juego dinámico de la lección alg-21a): una torre donde el piso n es la
// potencia aⁿ. En la planta baja (piso 0) vive el 1; subir un piso multiplica por la base y bajar uno divide, así que
// en los sótanos (pisos negativos) viven fracciones. Solo se ven la planta baja y el piso 1: las demás ventanas están
// cerradas y hay que contar pisos (cada una se abre cuando se entrega ahí).
// Hay que llevar cada paquete al piso donde vive el número pedido y tocar «Entregar». No hay reloj. Entregar en otro
// piso quita una vida (y dice quién vive ahí). Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, base, lo, hi, items: [{ exp }] }], lives? }   state = { done: [n] }
// Spec 2026-11-15-torres-de-potencias.

GAMES['torre-pisos'] = (() => {
  // Cómo se escribe aᵏ: entero, fracción o decimal (con base 10).
  const valTxt = (base, k) => (k >= 0 ? String(base ** k) : base === 10 ? (10 ** k).toFixed(-k) : `1/${base ** -k}`);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${valTxt(r.base, it.exp)} = ${r.base}${sup(it.exp)}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, pos = 0, dest = 0, seen = new Set(), pause = 0, result = null, btn = {}, top = 104, bot = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; pos = 0; dest = 0; seen = new Set([0, 1]); pause = 0; result = null; },
      lost(i) { st.done[i] = 0; },
    });
    const round = () => R[a.cur], item = () => round().items[Math.min(st.done[a.cur], round().items.length - 1)];
    const rowH = () => (bot - top) / (round().hi - round().lo + 1);
    const Y = k => bot - (k - round().lo + 0.5) * rowH();   // centro del piso k

    function layout(w, h) { W = w; H = h; bot = h - 78; btn = { x: w / 2 - 70, y: h - 62, w: 140, h: 32 }; }
    function deliver() {
      const r = round(), it = item(), k = Math.round(pos), good = k === it.exp;
      result = { good }; pause = good ? 1.2 : 1.0; seen.add(k);
      if (good) { st.done[a.cur]++; a.hit(); a.say(`${valTxt(r.base, k)} = ${r.base}${sup(k)}`, C.ok); }
      else { a.say(`Aquí vive ${valTxt(r.base, k)}: es ${r.base}${sup(k)}`, C.bad); if (a.miss()) { result = null; pause = 0; } }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        if (pos !== dest) { const d = Math.sign(dest - pos) * dt * 5; pos = Math.abs(dest - pos) <= Math.abs(d) ? dest : pos + d; }
        if (pause > 0) { pause -= dt; if (pause <= 0) { const good = result && result.good; result = null; if (good && st.done[a.cur] >= round().items.length) a.win(); } }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = round(), it = pause > 0 && result && result.good ? r.items[Math.max(0, st.done[a.cur] - 1)] : item(), live = a.phase === 'play', over = locked || a.phase === 'all', rh = rowH(), x0 = 46, x1 = W - 22;

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · subir un piso multiplica por ${r.base}; bajar divide`, W / 2, 40, W - 24, 11);
        if (live) drawPill(p, C, `Lleva el paquete a donde vive ${valTxt(r.base, it.exp)}`, W / 2, 68, C.sun, 15);

        // La torre: un renglón por piso; los sótanos van en otro tono y bajo la línea del suelo.
        if (!over) for (let k = r.lo; k <= r.hi; k++) {
          const y = Y(k), open = seen.has(k) && a.phase !== 'idle', here = Math.round(pos) === k && live;
          p.noStroke(); p.fill(k < 0 ? C.card : C.halo); p.rect(x0, y - rh / 2 + 2, x1 - x0, rh - 4, 7);
          p.fill(k === 0 ? C.sun : C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.RIGHT, p.CENTER); p.text(negTxt(k), x0 - 8, y);
          drawTile(p, C, { x: W / 2 - 46, y: y - Math.min(13, rh / 2 - 5), w: 92, h: Math.min(24, rh - 12) }, open ? valTxt(r.base, k) : '?', { fill: open ? (here ? C.sun : C.cream) : C.line, ink: open ? undefined : C.mute, size: 14, r: 7, lift: open ? 2 : 0 });
          if (k === 0) { p.stroke(C.ink); p.strokeWeight(3); p.line(14, y + rh / 2, W - 14, y + rh / 2); }
        }
        if (!over) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text('piso', 26, top - 10);
          // El ascensor.
          const y = Y(pos), col = result ? (result.good ? C.ok : C.bad) : C.coral;
          p.noFill(); p.stroke(col); p.strokeWeight(3); p.rect(x0 + 3, y - rh / 2 + 4, x1 - x0 - 6, rh - 8, 7);
          p.noStroke(); p.fill(col); p.rect(x1 - 30, y - 9, 20, 18, 4); p.fill(C.cream); p.rect(x1 - 25, y - 5, 10, 8, 2);
        }
        if (live && pause <= 0) drawTile(p, C, btn, 'Entregar aquí', { fill: C.mint, size: 14, r: 10, lift: 2 });

        arcadeToast(p, C, a, W / 2, H - 13, locked);
        if (over) drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `Base ${rr.base}: ${rr.items.map(x => `${rr.base}${sup(x.exp)} = ${valTxt(rr.base, x.exp)}`).join(' · ')}` })), H / 2);
        else drawArcadeBanner(p, C, a, (top + bot) / 2, { idle: 'Sin prisa: cuenta los pisos y mueve el ascensor', lost: 'Varios paquetes en el piso equivocado' });
        if (!a.toast && (over || a.phase === 'idle')) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(over ? '¡Todo entregado! Ya puedes comprobar' : 'El piso es el exponente', W / 2, H - 13);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const r = round(), x = p.mouseX, y = p.mouseY;
        if (hitBox({ x: btn.x - 6, y: btn.y - 4, w: btn.w + 12, h: btn.h + 10 }, x, y)) { if (pos === dest) deliver(); return false; }
        if (y < top || y > bot) return;
        dest = Math.max(r.lo, Math.min(r.hi, r.lo + Math.floor((bot - y) / rowH()))); api.sfx?.tap?.();
        return false;
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => { const r = round(); return { phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, floor: pos, moving: pos !== dest, target: item().exp, ok: { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 }, floors: Array.from({ length: r.hi - r.lo + 1 }, (_, i) => ({ k: r.lo + i, x: W / 2 - 80, y: Y(r.lo + i) })) }; },
    };
  }

  return { grade, create, valTxt };
})();
