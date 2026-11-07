// Ángulos encadenados (trigonometría, suma y resta de ángulos): para sacar el valor exacto de un ángulo
// «raro» (75°, 15°, 165°…) se arma con dos notables. En la circunferencia unitaria hay dos brazos: el
// primero (amarillo) gira hasta un ángulo α; el segundo (rosa) sale desde α y suma o resta β según hacia
// dónde se arrastre. Si los dos son notables y la punta cae en el ángulo pedido, se enciende y aparece
// la fórmula de suma con los valores. Paso de 15°. Rondas con pestañas.
// params = { rounds: [{ target }] }   state = { chains: [{ a, b, op } | null] }

GAMES['encadena-angulos'] = (() => {
  const norm = d => ((d % 360) + 360) % 360;
  const isNotable = d => d > 0 && d < 360 && (d % 30 === 0 || d % 45 === 0);
  const lands = c => norm(c.a + (c.op === '-' ? -c.b : c.b));
  const okOne = (c, r) => !!c && isNotable(c.a) && isNotable(c.b) && lands(c) === norm(r.target);
  const NOT = Array.from({ length: 23 }, (_, k) => (k + 1) * 15).filter(isNotable);
  function example(t) {
    for (const op of ['+', '-']) for (const a of NOT) for (const b of NOT) if (b <= 90 && lands({ a, b, op }) === norm(t)) return `${t}° = ${a}° ${op === '+' ? '+' : '−'} ${b}°`;
    return `${t}°`;
  }

  function grade(state, params) {
    return { ok: params.rounds.every((r, i) => okOne(state.chains[i], r)), solution: params.rounds.map(r => example(r.target)).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { chains: params.rounds.map(() => null) };
    const arms = params.rounds.map(() => ({ a: 0, t: 0, touched: false }));     // t = ángulo de la punta del segundo brazo
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, grab = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.36, h * 0.27); cx = w / 2; cy = 92 + R + 6;
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const pt = (deg, r = R) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
    function sync() {
      const A = arms[cur], d = ((A.t - A.a) % 360 + 540) % 360 - 180;      // de −180 a 180
      st.chains[cur] = A.touched ? { a: norm(A.a), b: Math.abs(d), op: d < 0 ? '-' : '+' } : null;
      api.ready(st.chains.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], A = arms[cur], c = st.chains[cur], good = okOne(c, r);
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.chains[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.chains[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const ask = `Arma ${r.target}° con dos ángulos notables`;
        let ts = 18; p.textSize(ts); while (p.textWidth(ask) > W - 20 && ts > 11) p.textSize(--ts);
        p.text(ask, W / 2, 58);

        p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - R - 16, cy, cx + R + 16, cy); p.line(cx, cy - R - 16, cx, cy + R + 16);
        p.noFill(); p.stroke(C.ink + '77'); p.strokeWeight(2.5); p.circle(cx, cy, 2 * R);
        // Marcas notables en el borde.
        NOT.forEach(d => { const [x0, y0] = pt(d, R - 5), [x1, y1] = pt(d, R + 5); p.stroke(C.mute); p.strokeWeight(1.5); p.line(x0, y0, x1, y1); });
        // Meta punteada.
        const [tx, ty] = pt(r.target, R + 14);
        p.stroke(good ? C.ok : C.mute); p.strokeWeight(2); p.drawingContext.setLineDash([5, 6]); p.line(cx, cy, tx, ty); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(good ? C.ok : C.mute); p.textSize(12); p.text(`${r.target}°`, ...pt(r.target, R + 30));

        // Arcos de α (desde 0) y de β (desde α).
        const d = ((A.t - A.a) % 360 + 540) % 360 - 180, aa = norm(A.a);
        p.noFill(); p.stroke(C.N); p.strokeWeight(4);
        if (aa > 0) p.arc(cx, cy, R * 0.5, R * 0.5, -aa * Math.PI / 180, 0);
        p.stroke(C.I); p.strokeWeight(4);
        if (Math.abs(d) > 0) { const s = Math.min(A.a, A.a + d), e = Math.max(A.a, A.a + d); p.arc(cx, cy, R * 0.82, R * 0.82, -e * Math.PI / 180, -s * Math.PI / 180); }
        // Brazos.
        const [ax, ay] = pt(A.a), [bx, by] = pt(A.t);
        p.stroke(C.N); p.strokeWeight(5); p.line(cx, cy, ax, ay);
        p.stroke(C.I); p.strokeWeight(4); p.line(ax, ay, bx, by); p.line(cx, cy, bx, by);
        p.noStroke(); p.fill(C.N); p.circle(ax, ay, 22); p.fill(locked ? (good ? C.ok : C.bad) : good ? C.ok : C.I); p.circle(bx, by, 22);
        p.fill(C.bg); p.textSize(11); p.text('α', ax, ay); p.text('β', bx, by);

        // Lecturas.
        const y0 = cy + R + 34;
        p.textStyle(p.BOLD); p.textSize(16);
        if (!c) { p.fill(C.mute); p.text('arrastra el punto α y luego el punto β', W / 2, y0); }
        else {
          const tick = v => (isNotable(v) ? ' ✓' : ' ✗');
          p.fill(C.N); p.text(`α = ${c.a}°${tick(c.a)}`, W / 2 - 76, y0);
          p.fill(C.I); p.text(`β = ${c.b}°${tick(c.b)}`, W / 2 + 76, y0);
          p.fill(good ? C.ok : C.ink); p.textSize(15);
          p.text(`${c.a}° ${c.op === '+' ? '+' : '−'} ${c.b}° = ${lands(c)}°`, W / 2, y0 + 26);
          if (good) {
            p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.ink);
            const s = c.op === '+' ? ['+', '−'] : ['−', '+'];
            const l1 = `sen(α ${s[0]} β) = sen α cos β ${s[0]} cos α sen β`, l2 = `cos(α ${s[0]} β) = cos α cos β ${s[1]} sen α sen β`;
            let fs = 12; while (p.textWidth(l1) > W - 16 && fs > 9) p.textSize(--fs);
            p.text(l1, W / 2, y0 + 50); p.text(l2, W / 2, y0 + 68);
          }
        }
        if (locked && !good) { p.fill(C.ok); p.textSize(13); p.textStyle(p.BOLD); p.text(example(r.target), W / 2, y0 + 92); }
      };

      const angAt = () => { let d = Math.atan2(cy - p.mouseY, p.mouseX - cx) * 180 / Math.PI; return Math.round(d / 15) * 15; };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const A = arms[cur], [ax, ay] = pt(A.a), [bx, by] = pt(A.t);
        const da = Math.hypot(p.mouseX - ax, p.mouseY - ay), db = Math.hypot(p.mouseX - bx, p.mouseY - by);
        if (Math.min(da, db) < 34) { grab = db <= da && A.touched ? 'b' : da < 34 ? 'a' : 'b'; return false; }
        if (Math.hypot(p.mouseX - cx, p.mouseY - cy) < R + 30) { grab = A.touched ? 'b' : 'a'; p.mouseDragged(); return false; }
      };
      p.mouseDragged = () => {
        if (!grab) return;
        const A = arms[cur], d = angAt();
        if (grab === 'a') { const keep = ((A.t - A.a) % 360 + 540) % 360 - 180; A.a = norm(d); A.t = A.a + (A.touched ? keep : 0); }
        else A.t = A.a + ((d - A.a) % 360 + 540) % 360 - 180;
        A.touched = true; sync(); return false;
      };
      p.mouseReleased = () => { if (!grab) return; grab = null; api.sfx?.tap?.(); return false; };
    }, 1.5);

    return {
      loaded: m.ready,
      getState: () => ({ chains: st.chains.map(c => (c ? { ...c } : null)) }),
      lock() { locked = true; grab = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, isNotable, lands };
})();
