// Apila alturas (cálculo, operaciones entre funciones): en el plano están las gráficas de f y g. Sobre
// cada x marcada hay una cuenta que se arrastra hacia arriba o abajo (ajuste de ½) hasta la altura de
// (f + g)(x), (f − g)(x) o (f·g)(x), según la ronda: las operaciones se hacen punto a punto. Al comprobar,
// en la suma y la resta se apilan las barras de f y g, y aparece la gráfica verdadera.
// params = { rounds: [{ mode: 'sum'|'diff'|'prod', f, g, fTxt, gTxt, xs: [x…], xr, yr }] }
// state = { ys: [[y…]] }

GAMES['apila-alturas'] = (() => {
  const OPS = { sum: (a, b) => a + b, diff: (a, b) => a - b, prod: (a, b) => a * b };
  const NAME = { sum: 'f + g', diff: 'f − g', prod: 'f · g' };
  const target = r => r.xs.map(x => OPS[r.mode](r.f(x), r.g(x)) + 0);
  const same = (ys, r) => !!ys && target(r).every((t, k) => Math.abs(ys[k] - t) < 1e-9);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.ys[i], r));
    return {
      ok,
      solution: params.rounds.map((r, i) => `${i + 1}) ${r.xs.map((x, k) => `(${NAME[r.mode]})(${numTxt(x)}) = ${numTxt(target(r)[k])}`).join(', ')}`).join(' · '),
    };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ys = params.rounds.map(r => r.xs.map(() => 0)), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, drag = -1;

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], w = W - 24, h = Math.min(H - 84 - 50, w * (r.yr[1] - r.yr[0]) / (r.xr[1] - r.xr[0]));
      v = planeView({ x: 12, y: 84, w, h }, r.xr, r.yr);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], my = ys[cur], ok = same(my, r), T = target(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(ys[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        // Leyenda.
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.Z); fitText(p, `f(x) = ${r.fTxt}`, W / 4 + 4, 62, W / 2 - 12, 15);
        p.fill(C.N); fitText(p, `g(x) = ${r.gTxt}`, 3 * W / 4 - 4, 62, W / 2 - 12, 15);
        drawPlane(p, C, v);
        if (locked && r.mode !== 'prod') r.xs.forEach(x => {
          const a = r.f(x), b = (r.mode === 'sum' ? 1 : -1) * r.g(x), bw = 12;
          p.noStroke(); p.fill(p.color(C.Z + '88')); p.rect(v.X(x) - bw - 1, Math.min(v.Y(0), v.Y(a)), bw, Math.abs(v.Y(a) - v.Y(0)));
          p.fill(p.color(C.N + '88')); p.rect(v.X(x) + 1, Math.min(v.Y(a), v.Y(a + b)), bw, Math.abs(v.Y(a + b) - v.Y(a)));
        });
        p.strokeWeight(3); p.stroke(C.Z); drawCurve(p, v, r.f); p.stroke(C.N); drawCurve(p, v, r.g);
        if (locked) { p.stroke(C.ok); p.strokeWeight(2.5); p.drawingContext.setLineDash([6, 5]); drawCurve(p, v, x => OPS[r.mode](r.f(x), r.g(x))); p.drawingContext.setLineDash([]); }
        // Guías verticales y cuentas.
        r.xs.forEach((x, k) => {
          p.stroke(C.line); p.strokeWeight(1); p.drawingContext.setLineDash([3, 4]); p.line(v.X(x), v.box.y + 3, v.X(x), v.box.y + v.box.h - 3); p.drawingContext.setLineDash([]);
        });
        p.stroke(C.brand); p.strokeWeight(2.5); p.noFill(); p.beginShape(); r.xs.forEach((x, k) => p.vertex(v.X(x), v.Y(my[k]))); p.endShape();
        r.xs.forEach((x, k) => {
          const good = Math.abs(my[k] - T[k]) < 1e-9;
          p.stroke(C.ink); p.strokeWeight(2); p.fill(locked ? (good ? C.ok : C.bad) : drag === k ? C.N : C.brand); p.circle(v.X(x), v.Y(my[k]), 18);
        });
        p.noStroke(); p.fill(C.brand); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const by = v.box.y + v.box.h + 22;
        fitText(p, `Lleva cada cuenta a la altura de (${NAME[r.mode]})(x)`, W / 2, by, W - 24, 15);
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked || !hitBox(v.box, p.mouseX, p.mouseY)) return;
        const r = params.rounds[cur];
        let best = -1, bd = 22;
        r.xs.forEach((x, k) => { const d = Math.abs(v.X(x) - p.mouseX); if (d < bd) { bd = d; best = k; } });
        drag = best;
        if (drag >= 0) { p.mouseDragged(); return false; }
      };
      p.mouseDragged = () => {
        if (drag < 0 || locked) return;
        const r = params.rounds[cur], y = Math.max(r.yr[0], Math.min(r.yr[1], Math.round(v.toY(p.mouseY) * 2) / 2));
        if (y !== ys[cur][drag]) { ys[cur][drag] = y; touched[cur] = true; api.ready(touched.every(Boolean)); }
        return false;
      };
      p.mouseReleased = () => { drag = -1; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ ys: ys.map(a => a.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, target };
})();
