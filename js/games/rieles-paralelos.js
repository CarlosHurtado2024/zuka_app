// Los rieles (cálculo, rectas paralelas y perpendiculares): en el plano hay una vía dada y una estación.
// El riel nuevo sale de la estación y se gira arrastrando su manija (o con ◀ ▶): las pendientes saltan
// entre valores «bonitos» (0, ±1/4, ±1/3, ±1/2, ±2/3, ±3/4, ±1, ±4/3, ±3/2, ±2, ±3, ±4 y la vertical).
// Según la ronda, el riel tiene que quedar paralelo a la vía (misma pendiente) o perpendicular a ella
// (m₁ · m₂ = −1; la perpendicular a una horizontal es vertical).
// params = { rounds: [{ base: { m, b } | { m: 'v', x0 }, baseTxt, through: [x, y], mode: 'par'|'perp' }] }
// state = { slopes: [m | 'v'] }

GAMES['rieles-paralelos'] = (() => {
  const RANGE = 6;
  const NUMS = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1, 4 / 3, 3 / 2, 2, 3, 4];
  const SLOPES = [...NUMS.slice(1).reverse().map(v => -v), ...NUMS, 'v'];
  const angleOf = m => (m === 'v' ? 90 : Math.atan(m) * 180 / Math.PI);
  const norm = m => (m === 'v' ? 'v' : SLOPES.find(s => s !== 'v' && Math.abs(s - m) < 1e-9) ?? m);
  function targetSlope(r) {
    const m = r.base.m;
    if (r.mode === 'par') return norm(m);
    if (m === 'v') return 0;
    if (m === 0) return 'v';
    return norm(-1 / m);
  }
  function slopeText(m) {
    if (m === 'v') return 'vertical';
    for (let d = 1; d <= 12; d++) { const n = Math.round(m * d); if (Math.abs(m * d - n) < 1e-9) return (n < 0 ? '−' : '') + (d === 1 ? Math.abs(n) : `${Math.abs(n)}/${d}`); }
    return String(m);
  }
  const same = (a, b) => a != null && (a === 'v' || b === 'v' ? a === b : Math.abs(a - b) < 1e-9);
  const num = v => String(v).replace('-', '−');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.slopes[i], targetSlope(r)));
    return { ok, solution: params.rounds.map(r => `${r.mode === 'par' ? 'paralela' : 'perpendicular'} a ${r.baseTxt}: pendiente ${slopeText(targetSlope(r))}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const idx = params.rounds.map(() => SLOPES.indexOf(1)), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, minus = null, plus = null, drag = false;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const n = 2 * RANGE + 1;
    const X = x => box.x + (x + RANGE + 0.5) / n * box.w, Y = y => box.y + (RANGE + 0.5 - y) / n * box.h;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(W - 24, H - 170);
      box = { x: (W - side) / 2, y: 76, w: side, h: side };
      minus = { x: 12, y: H - 50, w: 56, h: 40 }; plus = { x: W - 68, y: H - 50, w: 56, h: 40 };
    }
    const changed = () => { touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean)); };
    // Recta por (x1, y1) con pendiente m, recortada a la ventana.
    function drawLine(m, x1, y1, col, w, ties) {
      let a, b;
      if (m === 'v') { a = [x1, -RANGE - 1]; b = [x1, RANGE + 1]; } else { a = [-RANGE - 1, y1 + m * (-RANGE - 1 - x1)]; b = [RANGE + 1, y1 + m * (RANGE + 1 - x1)]; }
      if (ties) {   // durmientes de la vía
        const dx = X(b[0]) - X(a[0]), dy = Y(b[1]) - Y(a[1]), L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        p5ref.stroke(C.mute); p5ref.strokeWeight(2);
        for (let s = 0; s < L; s += 14) { const cx = X(a[0]) + ux * s, cy = Y(a[1]) + uy * s; p5ref.line(cx - uy * 7, cy + ux * 7, cx + uy * 7, cy - ux * 7); }
      }
      p5ref.stroke(col); p5ref.strokeWeight(w); p5ref.line(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]));
    }
    let p5ref = null;

    const m = mountSketch(host, (p, size) => {
      p5ref = p;
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };
      function fit(s, x, y, sz, maxW) { p.textSize(sz); while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); } p.text(s, x, y); }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], s = SLOPES[idx[cur]], ok = same(s, targetSlope(r)), T = r.through;
        tabs.forEach((tb, i) => {
          const g = same(SLOPES[idx[i]], targetSlope(params.rounds[i]));
          const col = locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fit(`riel ${r.mode === 'par' ? 'PARALELO' : 'PERPENDICULAR'} a ${r.baseTxt}`, W / 2, 58, 16, W - 24);
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
        for (let k = -RANGE; k <= RANGE; k++) { p.stroke(C.line); p.strokeWeight(0.6); p.line(X(k), box.y + 2, X(k), box.y + box.h - 2); p.line(box.x + 2, Y(k), box.x + box.w - 2, Y(k)); }
        p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(0), box.y + 2, X(0), box.y + box.h - 2); p.line(box.x + 2, Y(0), box.x + box.w - 2, Y(0));
        p.drawingContext.save(); p.drawingContext.beginPath(); p.drawingContext.rect(box.x, box.y, box.w, box.h); p.drawingContext.clip();
        if (r.base.m === 'v') drawLine('v', r.base.x0, 0, C.ink, 4, true); else drawLine(r.base.m, 0, r.base.b, C.ink, 4, true);
        drawLine(s, T[0], T[1], locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.I, 4, false);
        p.drawingContext.restore();
        // Estación y manija para girar.
        const sx = X(T[0]), sy = Y(T[1]), ang = angleOf(s) * Math.PI / 180, hr = Math.min(70, box.w * 0.25);
        const hx = sx + Math.cos(ang) * hr, hy = sy - Math.sin(ang) * hr;
        p.stroke(C.ink); p.strokeWeight(2); p.fill(C.N); p.rect(sx - 8, sy - 8, 16, 16, 3);
        p.noStroke(); p.fill(C.ink); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(`(${num(T[0])}, ${num(T[1])})`, sx, sy + 10);
        if (!locked) { p.stroke(C.ink); p.strokeWeight(2); p.fill(C.brand); p.circle(Math.max(box.x + 9, Math.min(box.x + box.w - 9, hx)), Math.max(box.y + 9, Math.min(box.y + box.h - 9, hy)), 18); }
        // Lectura.
        p.noStroke(); p.fill(ok ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const mb = r.base.m, prod = r.mode === 'perp' && s !== 'v' && mb !== 'v' ? `   m₁·m₂ = ${slopeText(mb * s)}` : '';
        fit(`pendiente del riel: ${slopeText(s)}${prod}`, W / 2, box.y + box.h + 20, 15, W - 24);
        if (locked && !ok) { p.fill(C.ok); p.textSize(12); p.text(`era ${slopeText(targetSlope(r))}`, W / 2, box.y + box.h + 40); }
        [[minus, '↻'], [plus, '↺']].forEach(([b, t]) => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(20); p.text(t, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      function aim() {
        const T = params.rounds[cur].through, dx = p.mouseX - X(T[0]), dy = Y(T[1]) - p.mouseY;
        if (Math.hypot(dx, dy) < 12) return;
        let a = Math.atan2(dy, dx) * 180 / Math.PI;
        if (a > 90) a -= 180; if (a <= -90) a += 180;
        let best = 0, bd = 1e9;
        SLOPES.forEach((s, i) => { const sa = angleOf(s), dd = Math.min(Math.abs(sa - a), 180 - Math.abs(sa - a)); if (dd < bd) { bd = dd; best = i; } });
        if (best !== idx[cur]) { idx[cur] = best; changed(); }
      }
      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(minus, p.mouseX, p.mouseY)) { idx[cur] = (idx[cur] - 1 + SLOPES.length) % SLOPES.length; changed(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { idx[cur] = (idx[cur] + 1) % SLOPES.length; changed(); return false; }
        if (inside(box, p.mouseX, p.mouseY)) { drag = true; aim(); touched[cur] = true; api.ready(touched.every(Boolean)); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { aim(); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.5);

    return {
      loaded: m.ready,
      getState: () => ({ slopes: idx.map(i => SLOPES[i]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, targetSlope, slopeText, SLOPES };
})();
