// La lupa de la recta (Álgebra 1.1, densidad de los reales): dos banderitas marcan números casi pegados
// (⅓ y 0.34, 1.41 y √2, π y 22/7). De lejos parecen el mismo punto. Con la lupa (+ / −) la recta se amplía
// 10 veces alrededor del punto elegido y aparecen marcas nuevas; hay que soltar el punto ESTRICTAMENTE entre
// las dos banderitas. Siempre cabe otro número: entre dos reales distintos hay infinitos.
// params = { rounds: [{ a: { label, value }, b: { label, value }, view: [lo, hi] }] }   state = { xs: [x | null] }

GAMES['lupa-densidad'] = (() => {
  const inside = (x, r) => x != null && x > Math.min(r.a.value, r.b.value) && x < Math.max(r.a.value, r.b.value);
  // Un número «redondo» entre a y b: el promedio con las menos cifras posibles.
  function between(r) {
    const lo = Math.min(r.a.value, r.b.value), hi = Math.max(r.a.value, r.b.value), mid = (lo + hi) / 2;
    for (let d = 0; d <= 12; d++) { const x = +mid.toFixed(d); if (x > lo && x < hi) return x; }
    return mid;
  }
  const zoomView = (v, c, f) => { const w = (v.hi - v.lo) / f; return { lo: c - w / 2, hi: c + w / 2 }; };
  // Paso «redondo» (1, 0.1, 0.01…) para unas 10 a 100 marcas en la vista.
  const stepOf = v => 10 ** Math.floor(Math.log10((v.hi - v.lo) / 10) + 1e-9);
  const decimalsOf = st => Math.max(0, -Math.round(Math.log10(st)));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => inside(state.xs?.[i], r));
    const solution = params.rounds.map(r => `entre ${r.a.label} y ${r.b.label} está ${between(r)}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { xs: R.map(() => null) };
    const views = R.map(r => ({ lo: r.view[0], hi: r.view[1] }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], line = null, zin = null, zout = null, drag = false, pulse = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      line = { x0: 24, x1: w - 24, y: h * 0.5 };
      zout = { x: 14, y: h - 56, w: (w - 38) / 2, h: 42 };
      zin = { x: w / 2 + 5, y: h - 56, w: (w - 38) / 2, h: 42 };
    }
    const toPx = v => line.x0 + (v - views[cur].lo) / (views[cur].hi - views[cur].lo) * (line.x1 - line.x0);
    const toVal = px => views[cur].lo + (px - line.x0) / (line.x1 - line.x0) * (views[cur].hi - views[cur].lo);
    function setX(px) {
      const s = stepOf(views[cur]) / 10, raw = toVal(Math.min(line.x1, Math.max(line.x0, px)));
      st.xs[cur] = +(Math.round(raw / s) * s).toFixed(decimalsOf(s));
      api.ready(st.xs.every(x => x != null));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function flag(v, label, col, up) {
        let x = toPx(v), off = false;
        if (x < line.x0 - 2 || x > line.x1 + 2) { off = true; x = x < line.x0 ? line.x0 : line.x1; }
        const dy = up ? -1 : 1, top = line.y + dy * 58;
        p.stroke(col); p.strokeWeight(2);
        if (!off) p.line(x, line.y, x, top);
        p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.CENTER, up ? p.BOTTOM : p.TOP);
        p.text(off ? (x <= line.x0 ? `◀ ${label}` : `${label} ▶`) : label, Math.min(W - 30, Math.max(30, x)), top + dy * 4);
        if (!off) p.triangle(x, top, x + 14 * (up ? 1 : -1), top + dy * 6, x, top + dy * 12);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], v = views[cur], x = st.xs[cur], good = inside(x, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (inside(st.xs[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.xs[i] != null ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        p.text(`Suelta un punto entre ${r.a.label} y ${r.b.label}`, 14, 56);
        const zoom = (r.view[1] - r.view[0]) / (v.hi - v.lo);
        p.textAlign(p.RIGHT, p.CENTER); p.fill(C.R); p.textStyle(p.BOLD);
        p.text(`lupa ×${zoom >= 1 ? Math.round(zoom).toLocaleString('es-CO') : zoom}`, W - 14, 56);

        // Lente: un círculo suave detrás de la recta.
        p.noStroke(); p.fill(C.card); p.rect(10, line.y - 96, W - 20, 192, 16);
        // Marcas: cada paso fino y cada 10 más largas, con número.
        const s = stepOf(v), fine = s / 10, dec = decimalsOf(fine);
        p.stroke(C.ink); p.strokeWeight(2.5); p.line(line.x0, line.y, line.x1, line.y);
        const k0 = Math.ceil(v.lo / fine - 1e-9), k1 = Math.floor(v.hi / fine + 1e-9);
        const gapPx = toPx(s) - toPx(0), every = gapPx < 22 ? 5 : gapPx < 48 ? 2 : 1;
        for (let k = k0; k <= k1; k++) {
          const t = k * fine, px = toPx(t), big = Math.abs(Math.round(k / 10) * 10 - k) < 1e-6;
          p.stroke(big ? C.ink : C.line); p.strokeWeight(big ? 2 : 1);
          p.line(px, line.y - (big ? 9 : 5), px, line.y + (big ? 9 : 5));
          if (big && Math.round(k / 10) % every === 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(t.toFixed(Math.max(0, dec - 1)), px, line.y + 12); }
        }
        flag(r.a.value, r.a.label, C.Z, true);
        flag(r.b.value, r.b.label, C.I, false);
        // Punto del estudiante
        if (x != null) {
          const px = toPx(x), onView = px >= line.x0 - 1 && px <= line.x1 + 1;
          if (onView) { p.noStroke(); p.fill(good ? C.ok : C.N); p.circle(px, line.y, 16 + 3 * Math.sin(pulse)); }
          pulse += 0.12;
          p.noStroke(); p.fill(good ? C.ok : C.ink); p.textStyle(p.BOLD); p.textSize(18); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, `tu punto: ${x.toFixed(decimalsOf(stepOf(v) / 10))}${onView ? '' : ' (fuera de la vista)'}`, W / 2, zout.y - 38, W - 28, 18);
        } else { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text('Toca la recta para poner tu punto', W / 2, zout.y - 38); }
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(13); p.text(`Por ejemplo: ${between(r)}`, W / 2, zout.y - 14); }
        // Botones de la lupa
        [[zout, '🔍 −  alejar'], [zin, '🔍 +  acercar']].forEach(([b, t]) => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.CENTER, p.CENTER); p.text(t, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = R[cur], v = views[cur];
        if (hitBox(zin, p.mouseX, p.mouseY)) {
          if (v.hi - v.lo > 1e-6) {
            const x = st.xs[cur], c = x != null && x > v.lo && x < v.hi ? x : (r.a.value + r.b.value) / 2;
            views[cur] = zoomView(v, c, 10);
          }
          api.sfx?.tap?.(); return false;
        }
        if (hitBox(zout, p.mouseX, p.mouseY)) {
          const c = (v.lo + v.hi) / 2, w = v.hi - v.lo;
          views[cur] = w * 10 >= r.view[1] - r.view[0] ? { lo: r.view[0], hi: r.view[1] } : zoomView(v, c, 0.1);
          api.sfx?.tap?.(); return false;
        }
        if (Math.abs(p.mouseY - line.y) < 60 && p.mouseX > line.x0 - 10 && p.mouseX < line.x1 + 10) { drag = true; setX(p.mouseX); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setX(p.mouseX); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ xs: [...st.xs] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, zoomView, between };
})();
