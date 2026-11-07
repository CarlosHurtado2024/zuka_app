// El cañón inverso (trigonometría, funciones inversas): un cañón en el centro de la circunferencia
// unitaria solo puede girar dentro del RANGO de la inversa (media vuelta derecha para sen⁻¹ y tan⁻¹,
// media vuelta de arriba para cos⁻¹; la zona fuera del rango se ve rayada). El cañón gira la vuelta
// completa: hay dos globos con el mismo seno (o coseno, o tangente) y solo el del rango es el valor
// principal. Nada revienta hasta comprobar. En rondas de precisión (snap < 15) o sin guía no hay globos.
// Se apunta arrastrando o con − / +. Rondas con pestañas.
// params = { rounds: [{ fn: 'asin' | 'acos' | 'atan', x, label, snap?: grados (15), guide?: true }] }
// state = { aims: [grados | null] }

GAMES['canon-inverso'] = (() => {
  const RANGE = { asin: [-90, 90], acos: [0, 180], atan: [-90, 90] };
  const D = 180 / Math.PI;
  const NAME = { asin: 'sen⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹' };
  const FN = { asin: 'sen', acos: 'cos', atan: 'tan' };
  function principal(fn, x) { return (fn === 'asin' ? Math.asin(x) : fn === 'acos' ? Math.acos(x) : Math.atan(x)) * D; }
  // Los dos globos: el principal y su «gemelo» con el mismo valor fuera del rango.
  function balloons(fn, x) {
    const t = principal(fn, x);
    return [t, fn === 'asin' ? 180 - t : fn === 'acos' ? -t : t + 180];
  }
  const hits = (aim, r) => aim != null && Math.abs(aim - principal(r.fn, r.x)) <= (r.snap || 15) / 2 + 1e-6;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => hits(state.aims[i], r));
    const solution = params.rounds.map(r => `${NAME[r.fn]}(${r.label ?? +r.x.toFixed(3)}) = ${+principal(r.fn, r.x).toFixed(1)}°`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { aims: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, drag = false, shown = 0, minus = null, plus = null, pop = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.36, h * 0.27); cx = w / 2; cy = 96 + R + 8;
      minus = { x: 14, y: h - 52, w: 48, h: 40 }; plus = { x: w - 62, y: h - 52, w: 48, h: 40 };
    }
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const pt = (deg, r = R) => [cx + r * Math.cos(deg / D), cy - r * Math.sin(deg / D)];
    const clampAim = (r, d) => { const s = r.snap || 15; let v = ((Math.round(d / s) * s) % 360 + 360) % 360; if (v > 180) v -= 360; return v; };
    const setAim = d => { const r = params.rounds[cur]; st.aims[cur] = clampAim(r, d); api.ready(st.aims.every(a => a !== null)); };
    const fmt = v => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2).replace('-', '−'));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], aim = st.aims[cur], [lo, hi] = RANGE[r.fn];
        const goal = aim ?? (lo + hi) / 2; shown += (((goal - shown) % 360 + 540) % 360 - 180) * 0.25;
        if (locked) pop = Math.max(0, pop - 0.03);
        tabs.forEach((t, i) => {
          const a = st.aims[i], col = locked ? (hits(a, params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : a !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        let ts = 19; p.textStyle(p.BOLD); p.textSize(ts);
        const ask = `θ = ${NAME[r.fn]}(${r.label ?? r.x})`;
        while (p.textWidth(ask) > W - 24 && ts > 12) p.textSize(--ts);
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.CENTER); p.text(ask, W / 2, 62);

        // Zona prohibida rayada y zona del rango sombreada.
        p.noStroke(); p.fill(C.brand + '22'); p.arc(cx, cy, 2 * R + 30, 2 * R + 30, -hi / D, -lo / D, p.PIE);
        p.stroke(C.line); p.strokeWeight(1);
        for (let d = lo + 3; d < lo + 360; d += 6) if (d > hi) { const [x0, y0] = pt(d, R * 0.25), [x1, y1] = pt(d, R * 0.95); p.line(x0, y0, x1, y1); }
        // Ejes y circunferencia.
        p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - R - 18, cy, cx + R + 18, cy); p.line(cx, cy - R - 18, cx, cy + R + 18);
        p.noFill(); p.stroke(C.ink + '88'); p.strokeWeight(2.5); p.circle(cx, cy, 2 * R);
        // Recta guía: altura x (seno), abscisa x (coseno) o pendiente x (tangente).
        if (r.guide !== false) {
          p.stroke(C.N + 'aa'); p.strokeWeight(2); p.drawingContext.setLineDash([6, 6]);
          if (r.fn === 'asin') p.line(cx - R - 18, cy - r.x * R, cx + R + 18, cy - r.x * R);
          else if (r.fn === 'acos') p.line(cx + r.x * R, cy - R - 18, cx + r.x * R, cy + R + 18);
          else { const t = principal('atan', r.x); const [x0, y0] = pt(t, R + 18), [x1, y1] = pt(t + 180, R + 18); p.line(x0, y0, x1, y1); }
          p.drawingContext.setLineDash([]);
        }
        // Globos: el del rango y su gemelo.
        const showB = r.guide !== false && (r.snap || 15) >= 15;
        balloons(r.fn, r.x).forEach((b, k) => {
          if (!showB && !(locked && k === 0)) return;
          const [bx, by] = pt(b), burst = locked && k === 0 && hits(aim, r);
          if (burst) {
            p.noFill(); p.stroke(C.ok); p.strokeWeight(2);
            for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4, s = 12 + 14 * (1 - pop); p.line(bx + Math.cos(a) * s * 0.6, by + Math.sin(a) * s * 0.6, bx + Math.cos(a) * s, by + Math.sin(a) * s); }
            return;
          }
          const col = locked && k === 0 ? C.ok : C.I;
          p.stroke(C.mute); p.strokeWeight(1); p.line(bx, by + 11, bx, by + 22);
          p.noStroke(); p.fill(col); p.ellipse(bx, by, 20, 24);
          p.fill(C.bg + '88'); p.ellipse(bx - 4, by - 5, 5, 7);
        });
        // El cañón.
        const ang = -shown / D;
        p.push(); p.translate(cx, cy); p.rotate(ang);
        if (aim !== null) { p.stroke(C.N); p.strokeWeight(2); p.drawingContext.setLineDash([2, 5]); p.line(26, 0, R, 0); p.drawingContext.setLineDash([]); }
        p.noStroke(); p.fill(locked ? (hits(aim, r) ? C.ok : C.bad) : C.brand); p.rect(0, -8, 34, 16, 4);
        p.pop();
        p.noStroke(); p.fill(C.card); p.stroke(C.brand); p.strokeWeight(2); p.circle(cx, cy, 28);
        p.noFill(); p.stroke(C.N); p.strokeWeight(2.5); if (Math.abs(shown) > 0.5) p.arc(cx, cy, 64, 64, Math.min(0, -shown / D), Math.max(0, -shown / D));

        // Lecturas y botones.
        const y0 = cy + R + 34;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(17); p.fill(aim === null ? C.mute : C.ink);
        if (aim === null) p.text('arrastra para apuntar el cañón', W / 2, y0);
        else { const t = aim / D, v = r.fn === 'asin' ? Math.sin(t) : r.fn === 'acos' ? Math.cos(t) : Math.tan(t); p.text(`θ = ${String(aim).replace('-', '−')}°   ·   ${FN[r.fn]} θ = ${Math.abs(v) > 1e6 ? 'no existe' : fmt(v)}`, W / 2, y0); }
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(`el rango de ${NAME[r.fn]} va de ${String(lo).replace('-', '−')}° a ${hi}°`, W / 2, y0 + 22);
        if (locked && !hits(aim, r)) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`era ${+principal(r.fn, r.x).toFixed(1)}°`, W / 2, y0 + 42); }
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10); p.noStroke(); p.fill(C.ink); p.textSize(22); p.textStyle(p.BOLD); p.text(s, b.x + b.w / 2, b.y + b.h / 2); });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; shown = st.aims[t] ?? 0; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = params.rounds[cur], s = r.snap || 15;
        if (inside(minus, p.mouseX, p.mouseY)) { setAim((st.aims[cur] ?? 0) - s); api.sfx?.tap?.(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { setAim((st.aims[cur] ?? 0) + s); api.sfx?.tap?.(); return false; }
        if (Math.hypot(p.mouseX - cx, p.mouseY - cy) < R + 40) { drag = true; p.mouseDragged(); return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        let d = Math.atan2(cy - p.mouseY, p.mouseX - cx) * D;
        setAim(d); return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ aims: [...st.aims] }),
      lock() { locked = true; drag = false; pop = 1; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, principal, balloons, RANGE };
})();
