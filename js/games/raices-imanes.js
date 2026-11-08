// Imanes de raíces (cálculo, funciones polinómicas): en el plano está la gráfica fantasma de un polinomio.
// Unos imanes se deslizan por el eje x (se ajustan a enteros) y marcan las raíces; dos imanes en el mismo
// lugar hacen una raíz doble (la curva rebota en vez de cruzar). Con ◀ ▶ se elige el coeficiente
// principal a. La curva del estudiante y su fórmula factorizada y = a(x − r₁)(x − r₂)… se arman en vivo.
// params = { rounds: [{ roots: [r…], a, xr, yr, mark: [x, y] }] }   (mark: un punto rotulado de la fantasma)
// state = { rounds: [{ roots: [r…], a }] }

GAMES['raices-imanes'] = (() => {
  const AS = [-2, -1, -0.5, 0.5, 1, 2];
  const value = (roots, a, x) => roots.reduce((acc, r) => acc * (x - r), a);
  const SUP = { 2: '²', 3: '³', 4: '⁴' };
  function formula(roots, a) {
    const count = new Map();
    [...roots].sort((u, w) => u - w).forEach(r => count.set(r, (count.get(r) || 0) + 1));
    const parts = [...count].sort(([u], [w]) => (u === 0 ? -1 : w === 0 ? 1 : u - w)).map(([r, k]) => {
      const e = SUP[k] || '';
      return r === 0 ? `x${e}` : `(x ${r < 0 ? '+' : '−'} ${numTxt(Math.abs(r))})${e}`;
    });
    const coef = a === 1 ? '' : a === -1 ? '−' : numTxt(a);
    return `y = ${coef}${parts.join('')}`;
  }
  const sorted = a => [...a].sort((u, w) => u - w).join(',');
  const same = (s, r) => !!s && sorted(s.roots) === sorted(r.roots) && s.a === r.a;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.rounds[i], r));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) ${formula(r.roots, r.a)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = params.rounds.map(r => ({ roots: r.roots.map((_, k) => Math.ceil(r.xr[0]) + 1 + k), a: 1 }));
    const touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, drag = -1, btns = [];

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], w = W - 24, h = Math.min(H - 46 - 110, w * (r.yr[1] - r.yr[0]) / (r.xr[1] - r.xr[0]));
      v = planeView({ x: 12, y: 46, w, h }, r.xr, r.yr);
      const by = H - 48;
      btns = [{ d: -1, x: 12, y: by, w: 56, h: 40 }, { d: 1, x: W - 68, y: by, w: 56, h: 40 }];
    }
    const touch = () => { touched[cur] = true; api.ready(touched.every(Boolean)); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], s = st[cur], ok = same(s, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(st[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        drawPlane(p, C, v);
        // Fantasma.
        p.stroke(C.mute); p.strokeWeight(5); p.drawingContext.setLineDash([2, 8]);
        drawCurve(p, v, x => value(r.roots, r.a, x)); p.drawingContext.setLineDash([]);
        if (r.mark) {
          p.noStroke(); p.fill(C.mute); p.circle(v.X(r.mark[0]), v.Y(r.mark[1]), 10);
          p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER);
          p.text(`(${numTxt(r.mark[0])}, ${numTxt(r.mark[1])})`, v.X(r.mark[0]) + 8, v.Y(r.mark[1]) - 10);
        }
        // Curva del estudiante.
        p.stroke(locked ? (ok ? C.ok : C.bad) : C.brand); p.strokeWeight(3);
        drawCurve(p, v, x => value(s.roots, s.a, x));
        // Imanes (apilados si coinciden).
        const seen = new Map();
        s.roots.forEach((x, k) => {
          const n = seen.get(x) || 0; seen.set(x, n + 1);
          const cx = v.X(x), cy = v.Y(0) - n * 22;
          p.stroke(C.ink); p.strokeWeight(2); p.fill(drag === k ? C.N : C.I); p.rect(cx - 9, cy - 9, 18, 18, 4);
          p.noStroke(); p.fill(C.card); p.rect(cx - 9, cy + 3, 18, 6);
        });
        // Fórmula y coeficiente.
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.fill(locked ? (ok ? C.ok : C.bad) : C.ink);
        fitText(p, formula(s.roots, s.a), W / 2, v.box.y + v.box.h + 24, W - 24, 18);
        if (locked && !ok) { p.fill(C.ok); fitText(p, formula(r.roots, r.a), W / 2, v.box.y + v.box.h + 46, W - 24, 14); }
        p.fill(C.R); p.textSize(16); p.text(`a = ${numTxt(s.a)}`, W / 2, H - 28);
        btns.forEach(b => {
          p.stroke(locked ? C.line : C.R); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(16); p.text(b.d < 0 ? '◀' : '▶', b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const s = st[cur], b = btns.find(b => hitBox(b, p.mouseX, p.mouseY));
        if (b) { s.a = AS[Math.max(0, Math.min(AS.length - 1, AS.indexOf(s.a) + b.d))]; touch(); api.sfx?.tap?.(); return false; }
        const seen = new Map();
        const pts = s.roots.map(x => { const n = seen.get(x) || 0; seen.set(x, n + 1); return { x: v.X(x), y: v.Y(0) - n * 22 }; });
        // El imán de arriba de la pila es el que se agarra.
        let best = -1, bd = 26;
        pts.forEach((pt, k) => { const d = Math.hypot(pt.x - p.mouseX, pt.y - p.mouseY); if (d <= bd + 0.5) { bd = d; best = k; } });
        drag = best;
        if (drag >= 0) return false;
      };
      p.mouseDragged = () => {
        if (drag < 0 || locked) return;
        const r = params.rounds[cur], x = Math.max(Math.ceil(r.xr[0]) + 1, Math.min(Math.floor(r.xr[1]) - 1, Math.round(v.toX(p.mouseX))));
        if (x !== st[cur].roots[drag]) { st[cur].roots[drag] = x; touch(); }
        return false;
      };
      p.mouseReleased = () => { drag = -1; };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: st.map(s => ({ roots: s.roots.slice(), a: s.a })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, formula, value, AS };
})();
