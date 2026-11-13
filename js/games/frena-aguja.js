// Frena la aguja (Álgebra 1.1, irracionales y reales; juego dinámico de la lección alg-11c): una aguja recorre la
// recta numérica de un lado al otro sin parar. Arriba sale un número irracional (√7, π, −√5) y hay que tocar para
// frenar la aguja justo donde queda ese número. Al acertar se abre una lupa con las décimas del tramo, dónde está el
// número y dónde cayó la aguja, y se ganan de una a tres estrellas según la puntería. Si se frena lejos se pierde una
// vida, se ilumina el tramo entre los dos enteros que encierran al número y sale una pista; se sigue intentando con
// el mismo número. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, min, max, tol, period?, items: [{ label, value, why }] }], lives? }   state = { done: [n] }
// Specs 2026-11-13-juegos-dinamicos-valle y 2026-11-14-mejoras-carrera-y-aguja.

GAMES['frena-aguja'] = (() => {
  // Dónde va la aguja a los t segundos: va de min a max y vuelve, una ida y vuelta cada `period` segundos.
  function needleAt(t, min, max, period) {
    const ph = ((t % period) + period) % period / period, u = ph < 0.5 ? ph * 2 : 2 - ph * 2;
    return min + u * (max - min);
  }
  const hits = (pos, value, tol) => Math.abs(pos - value) <= tol;
  // Estrellas por puntería: dentro de un tercio de la tolerancia 3, de dos tercios 2, de la tolerancia 1.
  const starsOf = (err, tol) => (err > tol ? 0 : err <= tol / 3 ? 3 : err <= (2 * tol) / 3 ? 2 : 1);
  // Los dos enteros seguidos que encierran al número.
  const bracket = value => [Math.floor(value), Math.floor(value) + 1];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.label} ≈ ${negTxt(it.value.toFixed(2))}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) }, stars = R.map(() => 0);
    let locked = false, W = 0, H = 0, lineY = 0, t = 0, pos = 0, pause = 0, shown = null, why = '', lens = 0;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; stars[i] = 0; t = 0; pause = 0; shown = null; why = ''; },
      lost(i) { st.done[i] = 0; },
    });
    const X = v => { const r = R[a.cur]; return 22 + ((v - r.min) / (r.max - r.min)) * (W - 44); };
    const item = () => R[a.cur].items[Math.min(st.done[a.cur], R[a.cur].items.length - 1)];
    const periodOf = r => ((r.period ?? 5.4) * (r.max - r.min)) / 4 - a.cur * 0.4;

    function layout(w, h) { W = w; H = h; lineY = h * 0.45; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        lens = shown && shown.ok ? Math.min(1, lens + dt * 5) : 0;
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

      function star(cx, cy, rad, on) {
        if (on) { p.noStroke(); p.fill(C.sun); } else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); }
        p.beginShape();
        for (let k = 0; k < 10; k++) { const ang = -Math.PI / 2 + (k * Math.PI) / 5, q = k % 2 ? rad * 0.45 : rad; p.vertex(cx + Math.cos(ang) * q, cy + Math.sin(ang) * q); }
        p.endShape(p.CLOSE);
      }

      // La lupa: el tramo de una unidad alrededor del número, con sus décimas, el número y la aguja.
      function drawLens(it, r) {
        const c = Math.round(it.value * 10) / 10, lo = c - 0.5, hi = c + 0.5, bx = 16, bw = W - 32, by = lineY + 50, bh = 118 * lens;
        const LX = v => bx + 16 + ((v - lo) / (hi - lo)) * (bw - 32), ly = by + 68;
        p.stroke(C.mute); p.strokeWeight(1); p.line(X(lo), lineY + 34, bx + 6, by); p.line(X(hi), lineY + 34, bx + bw - 6, by);
        p.noStroke(); p.fill(C.card); p.rect(bx, by, bw, bh, 14);
        p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.rect(bx, by, bw, bh, 14);
        if (lens < 1) return;
        for (let k = 0; k < 3; k++) star(W / 2 + (k - 1) * 26, by + 18, 10, k < shown.stars);
        p.stroke(C.ink); p.strokeWeight(2.5); p.line(bx + 10, ly, bx + bw - 10, ly);
        for (let k = 0; k <= 10; k++) {
          const v = lo + k / 10, whole = Math.abs(v - Math.round(v)) < 1e-6;
          p.stroke(C.ink); p.strokeWeight(whole ? 2.5 : 1.2); p.line(LX(v), ly - (whole ? 9 : 5), LX(v), ly + (whole ? 9 : 5));
          // Se rotulan las décimas pares y siempre el entero (π queda «un poco después del 3»: el 3 debe verse).
          if (whole || Math.abs(Math.round(v * 10)) % 2 === 0) { p.noStroke(); p.fill(whole ? C.ink : C.mute); p.textStyle(p.BOLD); p.textSize(whole ? 12 : 10); p.textAlign(p.CENTER, p.CENTER); p.text(whole ? negTxt(Math.round(v)) : negTxt(v.toFixed(1)), LX(v), ly + 20); }
        }
        const g = p.color(C.ok); g.setAlpha(70);
        p.noStroke(); p.fill(g); p.rect(LX(Math.max(lo, it.value - r.tol)), ly - 9, LX(Math.min(hi, it.value + r.tol)) - LX(Math.max(lo, it.value - r.tol)), 18, 5);
        p.stroke(C.ok); p.strokeWeight(3); p.line(LX(it.value), ly - 16, LX(it.value), ly + 10);
        const nx = Math.max(bx + 14, Math.min(bx + bw - 14, LX(shown.pos)));
        p.noStroke(); p.fill(C.sun); p.triangle(nx - 7, ly + 40, nx + 7, ly + 40, nx, ly + 28);
        drawPill(p, C, `${it.label} ≈ ${negTxt(it.value.toFixed(3))}`, Math.max(bx + 60, Math.min(bx + bw - 60, LX(it.value))), ly - 28, C.ok, 12);
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = shown ? shown.it : item();

        // Tras fallar: el tramo entre los dos enteros que encierran al número.
        if (why && a.phase === 'play') {
          const [b0, b1] = bracket(it.value), band = p.color(C.sun); band.setAlpha(110);
          p.stroke(C.N); p.strokeWeight(2); p.fill(band); p.rect(X(b0), lineY - 15, X(b1) - X(b0), 30, 6);
        }
        // La recta: enteros con número y décimas sin número.
        p.stroke(C.ink); p.strokeWeight(3); p.line(14, lineY, W - 14, lineY);
        for (let k = Math.round(r.min * 10); k <= Math.round(r.max * 10); k++) {
          const v = k / 10, whole = k % 10 === 0, half = k % 5 === 0;
          p.stroke(whole && v === 0 ? C.sun : C.ink); p.strokeWeight(whole ? 2.5 : 1); p.line(X(v), lineY - (whole ? 10 : half ? 7 : 4), X(v), lineY + (whole ? 10 : half ? 7 : 4));
          if (whole) { p.noStroke(); p.fill(v === 0 ? C.N : v < 0 ? C.I : C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(v), X(v), lineY + 24); }
        }
        // Tras acertar: la zona donde valía y dónde queda el número.
        if (shown && shown.ok) {
          const g = p.color(C.ok); g.setAlpha(90);
          p.noStroke(); p.fill(g); p.rect(X(it.value - r.tol), lineY - 16, X(it.value + r.tol) - X(it.value - r.tol), 32, 6);
          p.stroke(C.ok); p.strokeWeight(3); p.line(X(it.value), lineY - 22, X(it.value), lineY + 12);
        }
        // La aguja, con su estela mientras se mueve.
        if (a.phase === 'play' || shown) {
          const col = shown ? (shown.ok ? C.ok : C.bad) : C.sun;
          if (!shown && pause <= 0) for (let k = 4; k >= 1; k--) {
            const gx = X(needleAt(t - k * 0.035, r.min, r.max, periodOf(r))), c = p.color(C.sun); c.setAlpha(80 - k * 16);
            p.stroke(c); p.strokeWeight(3); p.line(gx, lineY - 46, gx, lineY + 8);
          }
          const x = X(shown ? shown.pos : pos);
          p.stroke(col); p.strokeWeight(3); p.line(x, lineY - 46, x, lineY + 8);
          p.noStroke(); p.fill(col); p.triangle(x - 9, lineY - 58, x + 9, lineY - 58, x, lineY - 42);
        }
        if (shown && shown.ok && a.phase === 'play') drawLens(it, r);

        // Encabezado: ronda, vidas y el número que hay que clavar.
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · frena la aguja en`, W / 2, 42, W - 24, 11);
        if (a.phase === 'play') drawPill(p, C, it.label, W / 2, 72, C.sun, 22);
        // La pista para ubicarlo, después de un fallo.
        if (why && a.phase === 'play') { p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(why, 16, lineY + 50, W - 32, 60); }

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        if (locked || a.phase === 'all') {
          drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: rr.items.map(x => `${x.label} ≈ ${negTxt(x.value.toFixed(2))}`).join(' · ') })), lineY + 84);
          const total = stars.reduce((s, v) => s + v, 0), max = R.reduce((s, rr) => s + rr.items.length * 3, 0);
          if (total) { star(W / 2 - 62, lineY + 140, 9, true); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.LEFT, p.CENTER); p.text(`${total} de ${max} estrellas`, W / 2 - 46, lineY + 141); }
        } else drawArcadeBanner(p, C, a, lineY + 104, { idle: 'Toca cuando la aguja pase por el número', lost: 'Frenaste lejos demasiadas veces' });
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
        const r = R[a.cur], it = item(), ok = hits(pos, it.value, r.tol), s = starsOf(Math.abs(pos - it.value), r.tol);
        shown = { pos, ok, it, stars: s }; pause = ok ? 2.1 : 1.5;
        if (ok) { st.done[a.cur]++; stars[a.cur] += s; why = ''; a.hit(); a.say(['', 'Por poco, pero vale', '¡Cerca!', '¡Diana!'][s], C.ok); }
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
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, pos, pause, value: item().value, tol: R[a.cur].tol, stars: [...stars], help: !!why }),
    };
  }

  return { grade, create, needleAt, hits, starsOf, bracket };
})();
