// El compás ambiguo (trigonometría, ley de senos, caso LLA): se conocen el ángulo A, el lado b (de A
// a C) y el lado a, opuesto a A. El lado a es el brazo de un compás clavado en C: se arrastra su punta
// para que toque la base. Si la toca, se suelta ahí y queda marcado un triángulo. Puede haber dos
// lugares, uno o ninguno; si no alcanza, se pulsa «No hay triángulo». Rondas con pestañas.
// params = { rounds: [{ A, b, a }] }   state = { marks: [[x] | 'none' | null] }

GAMES['compas-ambiguo'] = (() => {
  const D = Math.PI / 180;
  function solutions(r) {
    const h = r.b * Math.sin(r.A * D), cx = r.b * Math.cos(r.A * D);
    if (r.a < h - 1e-9) return [];
    if (Math.abs(r.a - h) < 1e-9) return [cx];
    const d = Math.sqrt(r.a * r.a - h * h);
    return [cx - d, cx + d].filter(x => x > 1e-9);
  }
  // Todos los cortes de la circunferencia (centro C, radio a) con la recta de la base, sin filtrar.
  function cuts(r) {
    const h = r.b * Math.sin(r.A * D), cx = r.b * Math.cos(r.A * D);
    if (r.a < h - 1e-9) return [];
    if (Math.abs(r.a - h) < 1e-9) return [cx];
    const d = Math.sqrt(r.a * r.a - h * h);
    return [cx - d, cx + d];
  }
  function okOne(m, r) {
    const s = solutions(r);
    if (!s.length) return m === 'none';
    return Array.isArray(m) && m.length === s.length && s.every(x => m.some(y => Math.abs(x - y) < 0.05));
  }
  const n2 = n => ['ningún triángulo', 'un triángulo', 'dos triángulos'][n];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okOne(state.marks[i], r));
    const solution = params.rounds.map(r => { const s = solutions(r); return `A = ${r.A}°, b = ${r.b}, a = ${r.a}: ${n2(s.length)}${s.length ? ` (c = ${s.map(x => x.toFixed(2)).join(' o ')})` : ''}`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { marks: params.rounds.map(() => null) };
    const phi = params.rounds.map(() => 50);        // ángulo del brazo del compás (empieza hacia arriba, lejos de la base)
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], k = 1, A0 = [0, 0], none = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      none = { x: 12, y: h - 52, w: w - 24, h: 42 };
    }
    function fit() {
      const r = params.rounds[cur], cx = r.b * Math.cos(r.A * D), cy = r.b * Math.sin(r.A * D);
      const minX = Math.min(0, cx - r.a) - 0.6, maxX = Math.max(cx + r.a, r.b, 4) + 0.5, maxY = cy + r.a;
      k = Math.min((W - 30) / (maxX - minX), (H - 250) / Math.max(maxY, 1), 40);
      A0 = [15 - minX * k, 100 + maxY * k];
    }
    const P = (x, y) => [A0[0] + x * k, A0[1] - y * k];
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.marks.every(m => m !== null));
    function tipOf(r, f) { const cx = r.b * Math.cos(r.A * D), cy = r.b * Math.sin(r.A * D); return [cx + r.a * Math.cos(f * D), cy + r.a * Math.sin(f * D)]; }
    // Si la punta está a menos de 0.35 unidades de la base cerca de una solución, se pega a ella.
    function snapped(r, f) { const [x, y] = tipOf(r, f); return cuts(r).find(s => Math.abs(y) < 0.35 * Math.max(1, r.a / 6) && Math.abs(x - s) < 0.8 * Math.max(1, r.a / 6)); }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg); fit();
        const r = params.rounds[cur], mk = st.marks[cur], cx = r.b * Math.cos(r.A * D), cy = r.b * Math.sin(r.A * D), sols = solutions(r);
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.marks[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.marks[i] !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const ask = `A = ${r.A}°   ·   b = ${r.b}   ·   a = ${r.a}`;
        let ts = 17; p.textSize(ts); while (p.textWidth(ask) > W - 20 && ts > 11) p.textSize(--ts);
        p.text(ask, W / 2, 56);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text('¿Dónde puede estar el vértice B?', W / 2, 78);

        const [ax, ay] = P(0, 0), [Cx, Cy] = P(cx, cy);
        // Triángulos marcados.
        if (Array.isArray(mk)) mk.forEach(x => { const [bx, by] = P(x, 0); p.noStroke(); p.fill((locked ? (okOne(mk, r) ? C.ok : C.bad) : C.Z) + '33'); p.triangle(ax, ay, Cx, Cy, bx, by); p.fill(locked ? (sols.some(x0 => Math.abs(x0 - x) < 0.05) ? C.ok : C.bad) : C.Z); p.circle(bx, by, 12); p.textSize(11); p.textStyle(p.BOLD); p.text('B', bx, by + 16); });
        if (locked && !okOne(mk, r)) sols.forEach(x => { const [bx, by] = P(x, 0); p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.circle(bx, by, 18); });
        // Base, lado b y ángulo A.
        p.stroke(C.ink); p.strokeWeight(3); p.line(8, ay, W - 8, ay);
        p.stroke(C.Z); p.strokeWeight(4); p.line(ax, ay, Cx, Cy);
        p.noFill(); p.stroke(C.N); p.strokeWeight(2.5); p.arc(ax, ay, 46, 46, -r.A * D, 0);
        p.noStroke(); p.fill(C.N); p.textSize(12); p.textStyle(p.BOLD); p.text('A', ax - 8, ay + 14);
        p.fill(C.Z); p.text(`b = ${r.b}`, (ax + Cx) / 2 - 22, (ay + Cy) / 2);
        // Arco que barre la punta (traza tenue del compás) y el brazo.
        p.noFill(); p.stroke(C.I + '44'); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 6]); p.circle(Cx, Cy, 2 * r.a * k); p.drawingContext.setLineDash([]);
        const s = snapped(r, phi[cur]), [tx, ty] = s != null ? P(s, 0) : P(...tipOf(r, phi[cur]));
        p.stroke(C.I); p.strokeWeight(5); p.line(Cx, Cy, tx, ty);
        p.noStroke(); p.fill(s != null ? C.N : C.I); p.circle(tx, ty, s != null ? 16 : 12);
        p.fill(C.card); p.stroke(C.ink); p.strokeWeight(2); p.circle(Cx, Cy, 12);
        p.noStroke(); p.fill(C.ink); p.text('C', Cx, Cy - 16);
        p.fill(C.I); p.text(`a = ${r.a}`, (Cx + tx) / 2 + 22, (Cy + ty) / 2);

        // Estado y botón.
        p.textSize(14); p.fill(C.ink); p.textStyle(p.BOLD);
        const msg = mk === 'none' ? 'dijiste: no hay triángulo' : Array.isArray(mk) ? `marcaste ${n2(mk.length)}` : 'arrastra la punta rosa hasta la base';
        p.text(msg, W / 2, H - 76);
        if (locked && !okOne(mk, r)) { p.fill(C.ok); p.text(`había ${n2(sols.length)}`, W / 2, H - 98); }
        p.stroke(mk === 'none' ? C.brand : C.line); p.strokeWeight(mk === 'none' ? 3 : 1.5); p.fill(mk === 'none' ? C.brand + '33' : C.card); p.rect(none.x, none.y, none.w, none.h, 10);
        p.noStroke(); p.fill(C.ink); p.textSize(15); p.text('No hay triángulo', W / 2, none.y + none.h / 2);
      };

      const aimAt = () => {
        const r = params.rounds[cur], [Cx, Cy] = P(r.b * Math.cos(r.A * D), r.b * Math.sin(r.A * D));
        phi[cur] = Math.atan2(Cy - p.mouseY, p.mouseX - Cx) / D;
      };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(none, p.mouseX, p.mouseY)) { st.marks[cur] = 'none'; ready(); api.sfx?.tap?.(); return false; }
        if (p.mouseY > 90 && p.mouseY < none.y - 30) { drag = true; aimAt(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; aimAt(); return false; };
      p.mouseReleased = () => {
        if (!drag) return; drag = false;
        const r = params.rounds[cur], s = snapped(r, phi[cur]);
        if (s != null) {
          let mk = Array.isArray(st.marks[cur]) ? st.marks[cur] : [];
          mk = mk.some(x => Math.abs(x - s) < 0.05) ? mk.filter(x => Math.abs(x - s) >= 0.05) : [...mk, s];
          st.marks[cur] = mk.length ? mk : null; ready(); api.sfx?.tap?.();
        }
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ marks: st.marks.map(m => (Array.isArray(m) ? [...m] : m)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, solutions, cuts };
})();
