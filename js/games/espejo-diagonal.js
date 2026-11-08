// El espejo diagonal (cálculo, función inversa): en el plano está la gráfica de f con algunos puntos
// marcados y el espejo y = x. Encima de cada punto hay una ficha que se arrastra (ajuste a enteros) hasta
// su reflejo: (a, b) pasa a (b, a). Las fichas colocadas se unen y, al comprobar, aparece la gráfica de f⁻¹.
// params = { rounds: [{ f, fTxt, pts: [[x, y]…], t: [t0, t1], range: [min, max] }] }  (t: tramo de f a dibujar)
// state = { pts: [[[x, y]…]] }

GAMES['espejo-diagonal'] = (() => {
  // Se compara como conjunto: no importa qué ficha llegó a cada reflejo.
  const key = ps => ps.map(([x, y]) => `${x},${y}`).sort().join(' ');
  const same = (qs, r) => !!qs && key(qs) === key(r.pts.map(([a, b]) => [b, a]));
  const good = (q, r) => !!q && r.pts.some(([a, b]) => q[0] === b && q[1] === a);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.pts[i], r));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) ${r.pts.map(([a, b]) => `(${numTxt(b)}, ${numTxt(a)})`).join(' ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const qs = params.rounds.map(r => r.pts.map(pt => pt.slice())), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, drag = -1;

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], side = Math.min(W - 24, H - 84 - 50);
      v = planeView({ x: (W - side) / 2, y: 84, w: side, h: side }, r.range, r.range);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], my = qs[cur], ok = same(my, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(qs[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.fill(C.Z);
        fitText(p, `f(x) = ${r.fTxt}`, W / 2, 62, W - 24, 18);
        drawPlane(p, C, v);
        p.stroke(C.R); p.strokeWeight(2); p.drawingContext.setLineDash([7, 6]);
        p.line(v.X(r.range[0]), v.Y(r.range[0]), v.X(r.range[1]), v.Y(r.range[1])); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.R); p.textSize(12); p.textAlign(p.RIGHT, p.BOTTOM); p.text('y = x', v.X(r.range[1]) - 6, v.Y(r.range[1]) + 18);
        // f y, al comprobar, f⁻¹ (curva paramétrica (f(t), t)).
        const curveP = (fx, fy, col, w) => {
          p.stroke(col); p.strokeWeight(w); p.noFill();
          const ctx = p.drawingContext; ctx.save(); ctx.beginPath(); ctx.rect(v.box.x, v.box.y, v.box.w, v.box.h); ctx.clip();
          p.beginShape(); for (let k = 0; k <= 200; k++) { const t = r.t[0] + (r.t[1] - r.t[0]) * k / 200; p.vertex(v.X(fx(t)), v.Y(fy(t))); } p.endShape(); ctx.restore();
        };
        curveP(t => t, r.f, C.Z, 3);
        if (locked) curveP(r.f, t => t, C.ok, 3);
        r.pts.forEach(([a, b]) => { p.noStroke(); p.fill(C.Z); p.circle(v.X(a), v.Y(b), 10); });
        // Fichas del estudiante.
        if (!locked) { p.stroke(C.N); p.strokeWeight(2); p.noFill(); p.beginShape(); [...my].sort((u, w) => u[0] - w[0]).forEach(([x, y]) => p.vertex(v.X(x), v.Y(y))); p.endShape(); }
        my.forEach(([x, y], k) => {
          const g = good(my[k], r);
          p.stroke(C.ink); p.strokeWeight(2); p.fill(locked ? (g ? C.ok : C.bad) : drag === k ? C.ink : C.N); p.circle(v.X(x), v.Y(y), 18);
          if (drag === k) { p.noStroke(); p.fill(C.N); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM); p.text(`(${numTxt(x)}, ${numTxt(y)})`, v.X(x), v.Y(y) - 12); }
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, 'Lleva cada ficha a su reflejo en el espejo y = x', W / 2, v.box.y + v.box.h + 22, W - 24, 13);
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        drag = nearest(qs[cur].map(([x, y]) => ({ x: v.X(x), y: v.Y(y) })), p.mouseX, p.mouseY, 26);
        if (drag >= 0) return false;
      };
      p.mouseDragged = () => {
        if (drag < 0 || locked) return;
        const r = params.rounds[cur], cl = z => Math.max(r.range[0] + 1, Math.min(r.range[1] - 1, Math.round(z)));
        const q = [cl(v.toX(p.mouseX)), cl(v.toY(p.mouseY))], old = qs[cur][drag];
        if (q[0] !== old[0] || q[1] !== old[1]) { qs[cur][drag] = q; touched[cur] = true; api.ready(touched.every(Boolean)); }
        return false;
      };
      p.mouseReleased = () => { drag = -1; };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ pts: qs.map(a => a.map(q => q.slice())) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
