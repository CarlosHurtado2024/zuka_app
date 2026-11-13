// Dos escaleras (Álgebra, suma de una progresión aritmética). Una escalera de n columnas mide a₁, a₁ + d, …, aₙ y
// una copia volteada cuelga de una tapa. Se sube o baja la tapa (− / + o arrastre) hasta que las dos escaleras
// encajen sin huecos ni encimarse: el rectángulo mide n × (a₁ + aₙ) y cada escalera es la mitad. Es el truco de
// Gauss hecho con bloques: Sₙ = n(a₁ + aₙ)/2.
// params = { rounds: [{ a1, d, n }], max }   state = { hs: [altura de la tapa | null por ronda] }

GAMES['dos-escaleras'] = (() => {
  const terms = r => Array.from({ length: r.n }, (_, k) => r.a1 + k * r.d);
  const fit = r => 2 * r.a1 + (r.n - 1) * r.d;
  const okRound = (h, r) => h === fit(r);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.hs?.[i], r));
    const solution = params.rounds.map(r => `tapa a ${fit(r)}: ${r.n} · ${fit(r)} = ${r.n * fit(r)}, la suma es ${(r.n * fit(r)) / 2}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, MAX = params.max || 20;
    const hs = R.map(r => terms(r)[r.n - 1]), touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = {}, G = null, drag = false;

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      B = { minus: { x: 12, y: h - 46, w: 44, h: 36 }, plus: { x: w - 56, y: h - 46, w: 44, h: 36 } };
    }
    const geo = () => {
      const r = R[cur], base = H - 92, top = 108;
      // Ancho de columna y alto de cada unidad por separado: las columnas no quedan finas como palillos.
      const uw = Math.min(36, (W - 60) / r.n), u = (base - top) / MAX;
      return { u, uw, base, x0: (W - r.n * uw) / 2 };
    };
    function setH(v) {
      if (locked) return;
      hs[cur] = Math.min(MAX, Math.max(1, Math.round(v))); touched[cur] = true; api.ready(touched.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], good = okRound(hs[cur], r), h = locked && !good ? fit(r) : hs[cur], t = terms(r);
        G = geo();
        const { u, uw, base, x0 } = G, lidY = base - h * u, fits = h === fit(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(hs[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Q : C.line));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `${t.join(' + ')} = ?`, W / 2, 56, W - 24, 15);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Mueve la tapa hasta que las dos escaleras encajen', W / 2, 78, W - 24, 12);
        // Escalera original (desde el suelo) y copia volteada (desde la tapa), translúcidas: donde se enciman se ve más oscuro
        for (let k = 0; k < r.n; k++) {
          const x = x0 + k * uw;
          p.stroke(C.bg); p.strokeWeight(1); p.fill(p.color(C.mint + 'CC')); p.rect(x, base - t[k] * u, uw, t[k] * u);
          p.fill(p.color(C.sky + '99')); p.rect(x, lidY, uw, t[r.n - 1 - k] * u);
          p.noStroke(); p.fill(C.mute); p.textSize(10); p.text(t[k], x + uw / 2, base + 10);
          p.fill(C.Z); p.text(t[r.n - 1 - k], x + uw / 2, lidY - 9);
        }
        p.stroke(C.mute); p.strokeWeight(2); p.line(x0 - 8, base, x0 + r.n * uw + 8, base);
        p.stroke(locked ? C.ok : C.sun); p.strokeWeight(4); p.line(x0 - 8, lidY, x0 + r.n * uw + 8, lidY);
        if (fits) { p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.rect(x0, lidY, r.n * uw, h * u); }
        // Lectura y botones
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
        const msg = fits ? `${r.n} × ${h} = ${r.n * h}, la mitad: ${(r.n * h) / 2}` : `tapa a ${h}`;
        p.fill(fits || locked ? C.ok : C.ink); p.textStyle(p.BOLD); fitText(p, msg, W / 2, H - 28, W - 132, 13);
        for (const [b, s] of [[B.minus, '−'], [B.plus, '+']]) {
          drawTile(p, C, b, s, { fill: C.sky, r: 9, lift: 2, size: 20 });
        }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; drag = false; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(B.minus, x, y)) { setH(hs[cur] - 1); api.sfx?.tap?.(); return false; }
        if (hitBox(B.plus, x, y)) { setH(hs[cur] + 1); api.sfx?.tap?.(); return false; }
        if (G && Math.abs(y - (G.base - hs[cur] * G.u)) < 30) { drag = true; return false; }
      };
      p.mouseDragged = () => { if (drag && G) { setH((G.base - p.mouseY) / G.u); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ hs: hs.map((h, i) => (touched[i] ? h : null)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
