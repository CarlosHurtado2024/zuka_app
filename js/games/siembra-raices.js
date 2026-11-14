// Siembra de raíces (Álgebra, raíces; juego dinámico de la lección alg-22a): en la recta hay una semilla por cada
// entero. La pregunta es de dos clases. 'eq': «un número elevado a la n dio a: ¿cuáles pudieron ser?» (pueden ser
// dos, uno o ninguno). 'root': «ⁿ√a = ?» (la raíz es un solo número: con índice par, el positivo; y no existe si a es
// negativo). Se tocan las semillas de la respuesta y «Sembrar» hace crecer cada semilla x hasta la altura xⁿ: las que
// llegan justo a la línea de a son las que cumplen. Si ninguna cumple, se siembra sin elegir. No hay reloj.
// Fallar quita una vida y dice por qué. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, items: [{ kind: 'eq' | 'root', n, a }] }], span?, lives? }   state = { done: [n] }
// Spec 2026-11-15-torres-de-potencias.

GAMES['siembra-raices'] = (() => {
  const rootSym = n => ({ 2: '√', 3: '∛', 4: '∜' }[n] || `${sup(n)}√`);
  // Los enteros de la respuesta, dentro de −span … span.
  function wantOf(it, span = 6) {
    const xs = []; for (let x = -span; x <= span; x++) if (x ** it.n === it.a) xs.push(x);
    return it.kind === 'root' && it.n % 2 === 0 ? xs.filter(x => x >= 0) : xs;
  }
  const askTxt = it => (it.kind === 'eq' ? `x${sup(it.n)} = ${negTxt(it.a)}: ¿qué números x?` : `${rootSym(it.n)}${it.a < 0 ? `(${negTxt(it.a)})` : it.a} = ?`);
  const ansTxt = (it, span) => { const w = wantOf(it, span).map(negTxt); return `${askTxt(it).replace(': ¿qué números x?', '').replace(' = ?', '')} → ${w.length ? w.join(' y ') : (it.kind === 'eq' ? 'ningún real' : 'no es real')}`; };
  // ¿Lo elegido es la respuesta? Si no, por qué.
  function judge(it, sel, span = 6) {
    const want = wantOf(it, span), extra = sel.find(x => !want.includes(x));
    if (extra !== undefined) {
      if (it.kind === 'root' && it.n % 2 === 0 && want.includes(-extra)) return { ok: false, msg: `La raíz es un solo número: el positivo, ${-extra}` };
      return { ok: false, msg: want.length ? `${extra < 0 ? `(${negTxt(extra)})` : extra}${sup(it.n)} = ${negTxt(extra ** it.n)}, no ${negTxt(it.a)}` : 'Ningún número real llega ahí' };
    }
    if (want.some(x => !sel.includes(x))) return { ok: false, msg: sel.length ? 'Falta otro número que también cumple' : 'Sí hay alguno que cumple: mira la recta' };
    return { ok: true, msg: ansTxt(it, span) };
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => ansTxt(it, params.span)).join(' · ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, SPAN = params.span ?? 6;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, lineY = 0, sel = new Set(), grow = 0, sown = false, pause = 0, result = null, btn = {};
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; reset(); },
      lost(i) { st.done[i] = 0; },
    });
    const round = () => R[a.cur], item = () => round().items[Math.min(st.done[a.cur], round().items.length - 1)];
    const X = x => 14 + ((x + SPAN) / (2 * SPAN)) * (W - 28);
    // La recta va más arriba cuando lo pedido es negativo: las plantas crecen hacia abajo y necesitan sitio.
    const baseOf = it => H * (it.a < 0 ? 0.42 : 0.62);

    function layout(w, h) { W = w; H = h; lineY = h * 0.62; btn = { x: w / 2 - 62, y: h - 60, w: 124, h: 32 }; }
    function reset() { sel = new Set(); grow = 0; sown = false; pause = 0; result = null; }
    function sow() {
      const res = judge(item(), [...sel], SPAN);
      sown = true; result = res; pause = res.ok ? 2.2 : 2.0;
      if (res.ok) { st.done[a.cur]++; a.hit(); a.say(res.msg, C.ok); }
      else { a.say(res.msg, C.bad); if (a.miss()) reset(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        if (sown) grow = Math.min(1, grow + dt * 1.6);
        if (pause > 0) { pause -= dt; if (pause <= 0) { const good = result && result.ok; reset(); if (good && st.done[a.cur] >= round().items.length) a.win(); } }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = round(), it = shownItem(), live = a.phase === 'play', over = locked || a.phase === 'all', want = wantOf(it, SPAN);
        const lineY = baseOf(it), upMax = lineY - 104, dnMax = H - 110 - lineY, unit = (it.a < 0 ? dnMax : upMax) / (Math.max(1, Math.abs(it.a)) * 1.25);

        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · ${it.kind === 'eq' ? 'toca todos los que cumplen' : 'la raíz es un solo número'}`, W / 2, 40, W - 24, 11);
        if (live) drawPill(p, C, askTxt(it), W / 2, 68, C.sun, 17);

        if (!over && a.phase !== 'idle') {
          // La línea de la altura pedida y las plantas.
          const ty = lineY - it.a * unit, inRange = ty <= lineY + dnMax && ty >= lineY - upMax;
          if (inRange) { p.stroke(C.sun); p.strokeWeight(2); p.drawingContext.setLineDash([6, 6]); p.line(14, ty, W - 14, ty); p.drawingContext.setLineDash([]); p.noStroke(); p.fill(C.sun); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.RIGHT, p.CENTER); p.text(negTxt(it.a), W - 16, ty - 9); }
          p.stroke(C.ink); p.strokeWeight(3); p.line(10, lineY, W - 10, lineY);
          for (let x = -SPAN; x <= SPAN; x++) {
            const v = x ** it.n, h = Math.max(-dnMax, Math.min(upMax, v * unit)) * grow, hitsIt = v === it.a, on = sel.has(x);
            if (sown && v !== 0) { p.stroke(hitsIt ? C.ok : C.mint); p.strokeWeight(hitsIt ? 6 : 4); p.line(X(x), lineY, X(x), lineY - h); }
            const fill = sown && grow >= 1 ? (on ? (want.includes(x) ? C.ok : C.bad) : want.includes(x) ? C.sun : C.cream) : on ? C.sun : C.cream;
            p.noStroke(); p.fill(shade(fill, 0.74)); p.circle(X(x), lineY + 2, 21); p.fill(fill); p.circle(X(x), lineY, 21);
            p.fill(inkOn(fill, C.ink)); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(x), X(x), lineY + 1);
          }
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER);
          p.text(sel.size ? `Elegidos: ${[...sel].sort((u, v) => u - v).map(negTxt).join(', ')}` : 'Ninguno elegido', W / 2, H - 78);
          if (live && pause <= 0) drawTile(p, C, btn, 'Sembrar', { fill: C.mint, size: 15, r: 10, lift: 2 });
        }

        arcadeToast(p, C, a, W / 2, H - 13, locked);
        if (over) drawArcadeSummary(p, C, R.flatMap((rr, i) => rr.items.map(x => ({ ok: st.done[i] >= rr.items.length, text: ansTxt(x, SPAN) }))).slice(0, 10), H / 2);
        else drawArcadeBanner(p, C, a, lineY - 60, { idle: 'Sin prisa: elige y luego siembra', lost: 'Varias siembras no dieron la altura' });
        if (!a.toast && (over || a.phase === 'idle')) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(over ? '¡Buena cosecha! Ya puedes comprobar' : 'Cada semilla x crece hasta la altura de su potencia', W / 2, H - 13);
        }
        arcadeStop(p, a, locked);
      };
      // Mientras se ve el resultado sigue en pantalla la pregunta respondida.
      function shownItem() { const r = round(); return pause > 0 && result && result.ok ? r.items[Math.max(0, st.done[a.cur] - 1)] : item(); }

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const x = p.mouseX, y = p.mouseY;
        if (hitBox({ x: btn.x - 6, y: btn.y - 4, w: btn.w + 12, h: btn.h + 10 }, x, y)) { sow(); return false; }
        if (Math.abs(y - baseOf(item())) > 26) return;
        const k = Math.round(((x - 14) / (W - 28)) * 2 * SPAN - SPAN);
        if (k < -SPAN || k > SPAN) return;
        if (sel.has(k)) sel.delete(k); else sel.add(k);
        api.sfx?.tap?.();
        return false;
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, want: wantOf(item(), SPAN), ok: { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 }, seeds: Array.from({ length: 2 * SPAN + 1 }, (_, i) => ({ v: i - SPAN, x: X(i - SPAN), y: baseOf(item()), sel: sel.has(i - SPAN) })) }),
    };
  }

  return { grade, create, wantOf, judge, askTxt, rootSym };
})();
