// La noria (trigonometría, signos y ángulo de referencia): se gira la noria arrastrando la cabina
// dorada (de 15° en 15°) hasta un ángulo que cumpla la condición de la ronda: signos de sen, cos o tan,
// o un ángulo de referencia en cierto cuadrante. Suele haber varias respuestas. La altura de la cabina
// (seno) y su avance (coseno) se ven en vivo. Rondas con pestañas.
// params = { rounds: [{ prompt, sen?: '+' | '-', cos?, tan?, ref? }] }   state = { angles: [grados | null] }

GAMES['noria'] = (() => {
  const norm = d => ((d % 360) + 360) % 360;
  function refOf(deg) {
    const d = norm(deg);
    return d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d;
  }
  const sgn = v => (Math.abs(v) < 1e-9 ? 0 : Math.sign(v));
  function fits(deg, cond) {
    const t = deg * Math.PI / 180, vals = { sen: Math.sin(t), cos: Math.cos(t), tan: Math.abs(Math.cos(t)) < 1e-9 ? NaN : Math.tan(t) };
    for (const k of ['sen', 'cos', 'tan']) {
      if (!cond[k]) continue;
      const s = sgn(vals[k]);
      if (!(cond[k] === '+' ? s > 0 : s < 0)) return false;
    }
    return cond.ref == null || refOf(deg) === cond.ref;
  }
  const valid = cond => Array.from({ length: 24 }, (_, k) => k * 15).filter(a => fits(a, cond));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.angles[i] != null && fits(state.angles[i], r));
    return { ok, solution: params.rounds.map(r => `${r.prompt}: por ejemplo ${valid(r).slice(0, 3).map(a => `${a}°`).join(', ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { angles: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, drag = false, spin = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.33, h * 0.27); cx = w / 2; cy = 92 + R;
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.angles.every(a => a !== null));
    const pt = (deg, r = R) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], a = st.angles[cur] ?? 0, good = st.angles[cur] !== null && fits(a, r);
        let dSpin = ((a - spin) % 360 + 540) % 360 - 180;   // camino corto entre el ángulo dibujado y el elegido
        spin += dSpin * 0.2;
        tabs.forEach((t, i) => {
          const v = st.angles[i], ok = v !== null && fits(v, params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.CENTER, p.TOP);
        p.text(r.prompt, 12, 44, W - 24, 40);

        // Estructura, ejes y cuadrantes.
        p.stroke(C.line); p.strokeWeight(3); p.line(cx, cy, cx - R * 0.7, cy + R + 22); p.line(cx, cy, cx + R * 0.7, cy + R + 22);
        p.stroke(C.line); p.strokeWeight(1); p.drawingContext.setLineDash([4, 5]); p.line(cx - R - 18, cy, cx + R + 18, cy); p.line(cx, cy - R - 18, cx, cy + R + 18); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        [['I', 45], ['II', 135], ['III', 225], ['IV', 315]].forEach(([q, d]) => { const [x, y] = pt(d, R * 0.45); p.text(q, x, y); });
        p.noFill(); p.stroke(C.ink + '99'); p.strokeWeight(3); p.circle(cx, cy, 2 * R);
        for (let k = 0; k < 8; k++) { const [x, y] = pt(spin + k * 45); p.stroke(C.line); p.strokeWeight(1.5); p.line(cx, cy, x, y); }
        for (let k = 1; k < 8; k++) { const [x, y] = pt(spin + k * 45); p.noStroke(); p.fill(C.Z + '99'); p.rect(x - 9, y - 4, 18, 14, 4); }
        // Cabina dorada: su altura (seno, rosa) y su avance (coseno, azul).
        const [hx, hy] = pt(spin);
        p.stroke(C.I); p.strokeWeight(4); p.line(hx, cy, hx, hy);
        p.stroke(C.Z); p.strokeWeight(4); p.line(cx, cy, hx, cy);
        const col = locked ? (good ? C.ok : C.bad) : C.N;
        p.noStroke(); p.fill(col); p.rect(hx - 13, hy - 6, 26, 20, 5); p.fill(C.bg); p.rect(hx - 8, hy - 2, 16, 7, 2);
        p.noFill(); p.stroke(C.N); p.strokeWeight(2.5); p.arc(cx, cy, 40, 40, -norm(spin) * Math.PI / 180, 0);
        // Lecturas.
        const t = a * Math.PI / 180, y0 = cy + R + 40, f = v => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2).replace('-', '−'));
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(16); p.fill(st.angles[cur] === null ? C.mute : C.ink);
        p.text(st.angles[cur] === null ? 'arrastra la cabina dorada' : `θ = ${norm(a)}°   ·   referencia ${refOf(a)}°`, W / 2, y0);
        p.textSize(13); p.fill(C.I); p.text(`sen θ = ${f(Math.sin(t))}`, W / 2 - 70, y0 + 24);
        p.fill(C.Z); p.text(`cos θ = ${f(Math.cos(t))}`, W / 2 + 70, y0 + 24);
        if (locked && !good) { p.fill(C.ok); p.text(`por ejemplo ${valid(r).slice(0, 3).map(v => `${v}°`).join(', ')}`, W / 2, y0 + 46); }
      };

      const place = () => { let d = Math.atan2(cy - p.mouseY, p.mouseX - cx) * 180 / Math.PI; if (d < 0) d += 360; st.angles[cur] = Math.round(d / 15) * 15 % 360; ready(); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; spin = st.angles[t] ?? 0; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const d = Math.hypot(p.mouseX - cx, p.mouseY - cy);
        if (d > R * 0.3 && d < R + 34) { drag = true; place(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; place(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ angles: [...st.angles] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, fits, refOf };
})();
