// Frena la aguja (Álgebra 1.1, irracionales y reales; juego dinámico de la lección alg-11c): una aguja recorre la
// recta numérica de un lado al otro sin parar. Arriba sale un número irracional (√7, π, −√5) y hay que tocar para
// frenar la aguja justo donde queda ese número. Si se frena lejos se pierde una vida y sale una pista para ubicarlo
// (entre qué enteros está); se sigue intentando con el mismo número. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, min, max, tol, period?, items: [{ label, value, why }] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-valle.

GAMES['frena-aguja'] = (() => {
  // Dónde va la aguja a los t segundos: va de min a max y vuelve, una ida y vuelta cada `period` segundos.
  function needleAt(t, min, max, period) {
    const ph = ((t % period) + period) % period / period, u = ph < 0.5 ? ph * 2 : 2 - ph * 2;
    return min + u * (max - min);
  }
  const hits = (pos, value, tol) => Math.abs(pos - value) <= tol;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.label} ≈ ${negTxt(it.value.toFixed(2))}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, lineY = 0, t = 0, pos = 0, pause = 0, shown = null, why = '';
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; t = 0; pause = 0; shown = null; why = ''; },
      lost(i) { st.done[i] = 0; },
    });
    const X = v => { const r = R[a.cur]; return 22 + ((v - r.min) / (r.max - r.min)) * (W - 44); };
    const item = () => R[a.cur].items[Math.min(st.done[a.cur], R[a.cur].items.length - 1)];
    const periodOf = r => ((r.period ?? 5.4) * (r.max - r.min)) / 4 - a.cur * 0.4;

    function layout(w, h) { W = w; H = h; lineY = h * 0.56; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        const r = R[a.cur];
        if (pause > 0) {
          // Pausa tras frenar: se ve dónde cayó y dónde era; luego sigue (con el siguiente número si acertó).
          pause -= dt;
          if (pause <= 0) { if (shown && shown.ok) { shown = null; why = ''; if (st.done[a.cur] >= r.items.length) { a.win(); return; } } else shown = null; }
          return;
        }
        t += dt; pos = needleAt(t, r.min, r.max, periodOf(r));
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = shown ? shown.it : item();

        // La recta: enteros con número y décimas sin número.
        p.stroke(C.ink); p.strokeWeight(3); p.line(14, lineY, W - 14, lineY);
        for (let k = Math.round(r.min * 10); k <= Math.round(r.max * 10); k++) {
          const v = k / 10, whole = k % 10 === 0, half = k % 5 === 0;
          p.stroke(whole && v === 0 ? C.sun : C.ink); p.strokeWeight(whole ? 2.5 : 1); p.line(X(v), lineY - (whole ? 10 : half ? 7 : 4), X(v), lineY + (whole ? 10 : half ? 7 : 4));
          if (whole) { p.noStroke(); p.fill(v === 0 ? C.N : v < 0 ? C.I : C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(v), X(v), lineY + 24); }
        }
        // Tras frenar: la zona donde valía y dónde queda el número.
        if (shown && shown.ok) {
          const g = p.color(C.ok); g.setAlpha(90);
          p.noStroke(); p.fill(g); p.rect(X(it.value - r.tol), lineY - 16, X(it.value + r.tol) - X(it.value - r.tol), 32, 6);
          p.stroke(C.ok); p.strokeWeight(3); p.line(X(it.value), lineY - 22, X(it.value), lineY + 12); drawPill(p, C, `${it.label} ≈ ${negTxt(it.value.toFixed(2))}`, X(it.value), lineY - 36, C.ok, 13);
        }
        // La aguja.
        if (a.phase === 'play' || shown) {
          const x = X(shown ? shown.pos : pos), col = shown ? (shown.ok ? C.ok : C.bad) : C.sun;
          p.stroke(col); p.strokeWeight(3); p.line(x, lineY - 46, x, lineY + 8);
          p.noStroke(); p.fill(col); p.triangle(x - 9, lineY - 58, x + 9, lineY - 58, x, lineY - 42);
        }

        // Encabezado: ronda, vidas y el número que hay que clavar.
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · frena la aguja en`, W / 2, 42, W - 24, 11);
        if (a.phase === 'play') drawPill(p, C, it.label, W / 2, 72, C.sun, 22);
        // La pista para ubicarlo, después de un fallo.
        if (why && a.phase === 'play') { p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(why, 16, lineY + 44, W - 32, 50); }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: rr.items.map(x => `${x.label} ≈ ${negTxt(x.value.toFixed(2))}`).join(' · ') })), lineY + 78);
        else drawArcadeBanner(p, C, a, lineY + 96, { idle: 'Toca cuando la aguja pase por el número', lost: 'Frenaste lejos demasiadas veces' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Agujas clavadas! Ya puedes comprobar' : 'Toca en cualquier parte para frenar', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const r = R[a.cur], it = item(), ok = hits(pos, it.value, r.tol);
        shown = { pos, ok, it }; pause = ok ? 1.3 : 1.5;
        if (ok) { st.done[a.cur]++; why = ''; a.hit(); }
        else { why = it.why; a.say(pos < it.value ? 'Frenaste antes: va más a la derecha' : 'Te pasaste: va más a la izquierda', C.bad); if (a.miss()) { shown = null; pause = 0; why = ''; } }
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, pos, pause, value: item().value, tol: R[a.cur].tol }),
    };
  }

  return { grade, create, needleAt, hits };
})();
