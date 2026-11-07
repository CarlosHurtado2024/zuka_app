// El brazo robot (trigonometría, ley de cosenos): un brazo con hombro fijo, un tramo a horizontal y un
// antebrazo b. Se dobla el codo (ángulo C entre los dos tramos) arrastrando la pinza o con − / + (de 1°
// en 1°) para que la pinza quede a distancia c del hombro, donde está la gema: c² = a² + b² − 2ab cos C.
// En las rondas con anillo se ve el círculo de alcance c; en las demás hay que calcular C. Al acertar, la
// pinza se cierra. Rondas con pestañas.
// params = { rounds: [{ a, b, c, ring?: true }] }   state = { angles: [grados | null] }

GAMES['brazo-robot'] = (() => {
  const D = Math.PI / 180;
  const elbowFor = r => Math.acos((r.a * r.a + r.b * r.b - r.c * r.c) / (2 * r.a * r.b)) / D;
  const reach = (a, b, C) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * D));
  const okOne = (v, r) => v != null && Math.abs(v - elbowFor(r)) <= 1;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okOne(state.angles[i], r));
    return { ok, solution: params.rounds.map(r => `a = ${r.a}, b = ${r.b}, c = ${r.c}: C ≈ ${Math.round(elbowFor(r))}°`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { angles: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], k = 1, S = [0, 0], minus = null, plus = null, drag = false, shown = 90;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      minus = { x: 12, y: h - 52, w: 52, h: 42 }; plus = { x: w - 64, y: h - 52, w: 52, h: 42 };
    }
    function fit() {
      const r = params.rounds[cur], span = r.a + r.b;
      k = Math.min((W - 60) / (span + 0.6), (H - 260) / (r.b + 0.6));
      S = [W / 2 - (r.a / 2) * k, 104 + r.b * k + 20];
    }
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const setAng = v => { st.angles[cur] = Math.max(5, Math.min(175, Math.round(v))); api.ready(st.angles.every(a => a !== null)); };
    const elbow = r => [S[0] + r.a * k, S[1]];
    const gripAt = (r, Cdeg) => { const [ex, ey] = elbow(r); return [ex - r.b * k * Math.cos(Cdeg * D), ey - r.b * k * Math.sin(Cdeg * D)]; };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg); fit();
        const r = params.rounds[cur], v = st.angles[cur], good = okOne(v, r), want = elbowFor(r);
        shown += ((v ?? 90) - shown) * 0.25;
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.angles[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.angles[i] !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const ask = `a = ${r.a}  ·  b = ${r.b}  ·  la gema está a c = ${r.c}`;
        let ts = 17; p.textSize(ts); while (p.textWidth(ask) > W - 20 && ts > 11) p.textSize(--ts);
        p.text(ask, W / 2, 56);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(r.ring ? 'dobla el codo C hasta que la pinza llegue a la gema' : 'calcula C: la gema está escondida a distancia c', W / 2, 78);

        // Mesa, anillo de alcance y gema.
        p.stroke(C.line); p.strokeWeight(2); p.line(14, S[1] + 18, W - 14, S[1] + 18);
        if (r.ring) { p.noFill(); p.stroke(C.Q + '99'); p.strokeWeight(2); p.drawingContext.setLineDash([6, 6]); p.arc(S[0], S[1], 2 * r.c * k, 2 * r.c * k, Math.PI, 2 * Math.PI); p.drawingContext.setLineDash([]); }
        const [gx, gy] = gripAt(r, want);
        if (r.ring || locked) { p.noStroke(); p.fill(locked && !good ? C.ok : C.Q); p.quad(gx, gy - 11, gx + 9, gy, gx, gy + 11, gx - 9, gy); }
        // Brazo: base, tramo a, codo, antebrazo b y pinza.
        const [ex, ey] = elbow(r), [hx, hy] = gripAt(r, shown);
        p.noStroke(); p.fill(C.card); p.stroke(C.line); p.strokeWeight(2); p.rect(S[0] - 18, S[1] - 6, 36, 24, 6);
        p.stroke(C.Z); p.strokeWeight(10); p.line(S[0], S[1], ex, ey);
        p.stroke(C.I); p.strokeWeight(8); p.line(ex, ey, hx, hy);
        p.noStroke(); p.fill(C.ink); p.circle(S[0], S[1], 16); p.fill(C.N); p.circle(ex, ey, 18);
        const show = good && (r.ring || locked), dir = Math.atan2(hy - ey, hx - ex), open = show ? 0.12 : 0.55;
        p.stroke(locked ? (good ? C.ok : C.bad) : C.ink); p.strokeWeight(4);
        [-1, 1].forEach(s => p.line(hx, hy, hx + 16 * Math.cos(dir + s * open), hy + 16 * Math.sin(dir + s * open)));
        // Ángulo C en el codo (entre el tramo que vuelve al hombro y el antebrazo).
        p.noFill(); p.stroke(C.N); p.strokeWeight(3); p.arc(ex, ey, 52, 52, Math.PI, Math.PI + shown * D);
        p.noStroke(); p.fill(C.Z); p.textSize(12); p.textStyle(p.BOLD); p.text(`a = ${r.a}`, (S[0] + ex) / 2, S[1] + 32);
        p.fill(C.I); p.text(`b = ${r.b}`, (ex + hx) / 2 + 20, (ey + hy) / 2);

        const y0 = H - 80;
        p.textSize(18); p.fill(v === null ? C.mute : show ? C.ok : C.ink); p.text(v === null ? 'C = ?' : `C = ${v}°`, W / 2, y0);
        if (locked && !good) { p.fill(C.ok); p.textSize(13); p.text(`era C ≈ ${Math.round(want)}°`, W / 2, y0 + 22); }
        else if (show && !locked) { p.fill(C.ok); p.textSize(13); p.text('¡agarrada!', W / 2, y0 + 22); }
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10); p.noStroke(); p.fill(C.ink); p.textSize(22); p.text(s, b.x + b.w / 2, b.y + b.h / 2); });
      };

      const aim = () => { const [ex, ey] = elbow(params.rounds[cur]); let a = Math.atan2(ey - p.mouseY, ex - p.mouseX) / D; if (a < 0) a = a < -90 ? 175 : 5; setAng(a); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; shown = st.angles[t] ?? 90; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(minus, p.mouseX, p.mouseY)) { setAng((st.angles[cur] ?? 90) - 1); api.sfx?.tap?.(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { setAng((st.angles[cur] ?? 90) + 1); api.sfx?.tap?.(); return false; }
        if (p.mouseY > 90 && p.mouseY < H - 100) { drag = true; aim(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; aim(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ angles: [...st.angles] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, elbowFor, reach };
})();
