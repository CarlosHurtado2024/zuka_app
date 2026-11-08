// Completa la simetría (cálculo, funciones par e impar): la mitad derecha de una gráfica está dada (puntos
// en x = 1, 2, 3 unidos por segmentos). Se arrastran hacia arriba o abajo los puntos de la izquierda
// (x = −1, −2, −3, ajuste de ½) para que la gráfica completa sea PAR (espejo en el eje y: f(−x) = f(x)) o
// IMPAR (media vuelta alrededor del origen: f(−x) = −f(x)).
// params = { rounds: [{ mode: 'par'|'impar', pts: [[1, y], [2, y], [3, y]], y0?, yr: [min, max] }] }
// state = { ys: [[y(−1), y(−2), y(−3)]] }

GAMES['completa-simetria'] = (() => {
  const target = r => r.pts.map(([, y]) => (r.mode === 'par' ? y : -y) + 0);
  const same = (ys, r) => !!ys && target(r).every((t, k) => Math.abs(ys[k] - t) < 1e-9);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.ys[i], r));
    return {
      ok,
      solution: params.rounds.map((r, i) => `${i + 1}) ${r.pts.map(([x], k) => `f(−${x}) = ${numTxt(target(r)[k])}`).join(', ')}`).join(' · '),
    };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ys = params.rounds.map(r => r.pts.map(() => 0)), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, drag = -1;

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], w = W - 24, h = Math.min(H - 46 - 80, w * (r.yr[1] - r.yr[0]) / 8);
      v = planeView({ x: 12, y: 46, w, h }, [-4, 4], r.yr);
    }
    const y0Of = r => (r.mode === 'impar' ? 0 : r.y0);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], my = ys[cur], ok = same(my, r), y0 = y0Of(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(ys[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        drawPlane(p, C, v);
        // Guía de la simetría: el eje y (par) o el origen (impar).
        p.stroke(C.R); p.strokeWeight(2.5); p.drawingContext.setLineDash([6, 6]);
        if (r.mode === 'par') p.line(v.X(0), v.box.y + 4, v.X(0), v.box.y + v.box.h - 4);
        p.drawingContext.setLineDash([]);
        if (r.mode === 'impar') { p.noFill(); p.circle(v.X(0), v.Y(0), 22); }
        // Polilínea completa: izquierda (del estudiante) + centro + derecha (dada).
        const left = r.pts.map(([x], k) => [-x, my[k]]).reverse(), all = [...left, ...(y0 != null ? [[0, y0]] : []), ...r.pts];
        p.noFill(); p.stroke(locked ? (ok ? C.ok : C.bad) : C.brand); p.strokeWeight(3.5);
        p.beginShape(); all.forEach(([x, y]) => p.vertex(v.X(x), v.Y(y))); p.endShape();
        if (locked && !ok) {
          p.stroke(C.ok); p.strokeWeight(2.5); p.drawingContext.setLineDash([5, 5]);
          p.beginShape(); r.pts.map(([x], k) => [-x, target(r)[k]]).reverse().forEach(([x, y]) => p.vertex(v.X(x), v.Y(y))); if (y0 != null) p.vertex(v.X(0), v.Y(y0)); p.endShape();
          p.drawingContext.setLineDash([]);
        }
        r.pts.forEach(([x, y]) => { p.noStroke(); p.fill(C.Z); p.circle(v.X(x), v.Y(y), 13); });
        if (y0 != null) { p.noStroke(); p.fill(C.Z); p.circle(v.X(0), v.Y(y0), 13); }
        r.pts.forEach(([x], k) => {
          p.stroke(C.ink); p.strokeWeight(2); p.fill(drag === k ? C.N : C.card); p.circle(v.X(-x), v.Y(my[k]), 20);
          p.noStroke(); p.fill(C.N); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM);
          p.text(numTxt(my[k]), v.X(-x), v.Y(my[k]) - 12);
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.fill(r.mode === 'par' ? C.R : C.N);
        const by = v.box.y + v.box.h + 22;
        fitText(p, r.mode === 'par' ? 'Hazla PAR: f(−x) = f(x)' : 'Hazla IMPAR: f(−x) = −f(x)', W / 2, by, W - 24, 17);
        p.fill(C.mute); p.textStyle(p.NORMAL);
        fitText(p, r.mode === 'par' ? 'espejo en el eje y' : 'media vuelta alrededor del origen', W / 2, by + 24, W - 24, 13);
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = params.rounds[cur];
        drag = nearest(r.pts.map(([x], k) => ({ x: v.X(-x), y: v.Y(ys[cur][k]) })), p.mouseX, p.mouseY, 30);
        if (drag < 0) drag = r.pts.findIndex(([x]) => Math.abs(v.X(-x) - p.mouseX) < 16 && hitBox(v.box, p.mouseX, p.mouseY));
        if (drag >= 0) return false;
      };
      p.mouseDragged = () => {
        if (drag < 0 || locked) return;
        const r = params.rounds[cur], y = Math.max(r.yr[0] + 0.5, Math.min(r.yr[1] - 0.5, Math.round(v.toY(p.mouseY) * 2) / 2));
        if (y !== ys[cur][drag]) { ys[cur][drag] = y; touched[cur] = true; api.ready(touched.every(Boolean)); }
        return false;
      };
      p.mouseReleased = () => { drag = -1; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ ys: ys.map(a => a.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, target };
})();
