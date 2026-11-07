// El límite de la serie (lección 1.4): una recta numérica; el botón «+ término» va sumando los
// términos de una serie geométrica (los saltos se hacen cada vez más cortos) y un marcador se
// arrastra al valor al que se acerca la suma. Meta: el límite a1 / (1 − r).
// params = { a1, r, max, step, tol }   state = { guess: número | null }

GAMES['limite-serie'] = (() => {
  const partial = (n, p) => +(p.a1 * (1 - p.r ** n) / (1 - p.r)).toFixed(6);
  const limitOf = p => p.a1 / (1 - p.r);
  const fmt = n => String(+n.toFixed(2));

  function grade(state, params) {
    const L = limitOf(params);
    const ok = state.guess != null && Math.abs(state.guess - L) <= params.tol;
    return { ok, solution: `$S_\\infty = \\dfrac{a_1}{1 - r} = \\dfrac{${params.a1}}{1 - ${fmt(params.r)}} = ${fmt(L)}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { guess: null };
    let locked = false, W = 0, H = 0, line = null, btn = null, shown = 0, drag = false;

    function layout(w, h) {
      W = w; H = h;
      line = { x0: 24, x1: w - 24, y: h * 0.5 };
      btn = { x: w / 2 - 70, y: h - 96, w: 140, h: 42 };
    }
    const toPx = v => line.x0 + (v / params.max) * (line.x1 - line.x0);
    const toVal = x => Math.max(0, Math.min(params.max, Math.round(((x - line.x0) / (line.x1 - line.x0)) * params.max / params.step) * params.step));
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.guess !== null);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const L = limitOf(params), good = st.guess !== null && Math.abs(st.guess - L) <= params.tol;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`${params.a1} + ${fmt(params.a1 * params.r)} + ${fmt(params.a1 * params.r ** 2)} + … · ¿a qué valor se acerca la suma?`, 12, 8, W - 24, 40);
        // Recta con marcas.
        p.stroke(C.line); p.strokeWeight(2); p.line(line.x0, line.y, line.x1, line.y);
        for (let v = 0; v <= params.max; v += params.max / 4) { p.line(toPx(v), line.y - 6, toPx(v), line.y + 6); p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text(v, toPx(v), line.y + 10); p.stroke(C.line); }
        // Saltos de las sumas parciales.
        let prev = 0;
        for (let n = 1; n <= shown; n++) {
          const s = partial(n, params), x0 = toPx(prev), x1 = toPx(s), lift = Math.min(40, 12 + (x1 - x0) * 0.4);
          p.stroke(C.Q); p.strokeWeight(2.5); p.noFill();
          p.bezier(x0, line.y - 2, x0, line.y - lift, x1, line.y - lift, x1, line.y - 2);
          p.noStroke(); p.fill(C.Q); p.circle(x1, line.y, 7);
          prev = s;
        }
        if (shown) { p.noStroke(); p.fill(C.Q); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM); p.text(`S${shown} = ${fmt(partial(shown, params))}`, toPx(partial(shown, params)), line.y - 44); }
        // Marcador del alumno.
        if (st.guess !== null || drag) {
          const x = toPx(st.guess ?? 0), col = locked ? (good ? C.ok : C.bad) : C.brand;
          p.stroke(col); p.strokeWeight(3); p.line(x, line.y - 16, x, line.y + 26);
          p.noStroke(); p.fill(col); p.triangle(x - 8, line.y + 26, x + 8, line.y + 26, x, line.y + 38);
          p.textSize(14); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(fmt(st.guess ?? 0), x, line.y + 42);
        }
        if (locked && !good) { const x = toPx(L); p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([4, 4]); p.line(x, line.y - 30, x, line.y + 30); p.drawingContext.setLineDash([]); p.noStroke(); p.fill(C.ok); p.textSize(12); p.textAlign(p.CENTER, p.BOTTOM); p.text(fmt(L), x, line.y - 32); }
        const dim = locked || shown >= 12;
        p.stroke(dim ? C.line : C.Q); p.strokeWeight(2); p.fill(C.card); p.rect(btn.x, btn.y, btn.w, btn.h, 12);
        p.noStroke(); p.fill(dim ? C.mute : C.Q); p.textSize(14); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text('+ término', btn.x + btn.w / 2, btn.y + btn.h / 2 + 1);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL);
        p.text(locked ? (good ? '¡Ese es el límite!' : 'En verde, el valor al que se acerca') : 'Suma términos para ver el patrón y arrastra el marcador al límite', 12, H - 36, W - 24, 28);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (inside(btn, p.mouseX, p.mouseY)) { if (shown < 12) { shown += 1; api.sfx?.tap?.(); } return false; }
        if (Math.abs(p.mouseY - line.y) <= 48) { drag = true; st.guess = toVal(p.mouseX); ready(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; st.guess = toVal(p.mouseX); ready(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ guess: st.guess }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, partial };
})();
