// Dobla lo negativo (cálculo, función valor absoluto): está la gráfica de g y la meta es dibujar |g|. La
// gráfica viene partida en trozos por sus cortes con el eje x; tocar un trozo lo dobla como papel sobre el
// eje x (se refleja) y volver a tocarlo lo desdobla. |g| deja igual lo que está arriba y voltea lo de abajo.
// params = { rounds: [{ f, fTxt, xr, yr, roots: [x…] }] }   state = { folds: [[bool…]] }

GAMES['dobla-negativos'] = (() => {
  function pieces(r) {
    const cuts = [r.xr[0], ...r.roots, r.xr[1]];
    return cuts.slice(0, -1).map((a, k) => { const b = cuts[k + 1]; return { a, b, neg: r.f((a + b) / 2) < 0 }; });
  }
  const same = (fs, r) => !!fs && pieces(r).every((pc, k) => !!fs[k] === pc.neg);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.folds[i], r));
    return {
      ok,
      solution: params.rounds.map((r, i) => `${i + 1}) doblar ${pieces(r).filter(pc => pc.neg).map(pc => `(${numTxt(pc.a)}, ${numTxt(pc.b)})`).join(' y ')}`).join(' · '),
    };
  }

  function create(host, params, api) {
    const C = api.palette;
    const folds = params.rounds.map(r => pieces(r).map(() => false)), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null;

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
        const r = params.rounds[cur], fs = folds[cur], ok = same(fs, r), pcs = pieces(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(folds[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, `Dibuja y = |${r.fTxt}|`, W / 2, 62, W - 24, 18);
        drawPlane(p, C, v);
        // Zona negativa sombreada.
        p.noStroke(); p.fill(p.color(C.I + '18')); p.rect(v.box.x + 2, v.Y(0), v.box.w - 4, v.box.y + v.box.h - 2 - v.Y(0));
        pcs.forEach((pc, k) => {
          const f = fs[k] ? x => -r.f(x) : r.f;
          if (fs[k]) { p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 5]); drawCurve(p, v, r.f, pc.a, pc.b, 80); p.drawingContext.setLineDash([]); }
          const good = fs[k] === pc.neg;
          p.stroke(locked ? (good ? C.ok : C.bad) : fs[k] ? C.N : k % 2 ? C.brand : C.Z); p.strokeWeight(4);
          drawCurve(p, v, f, pc.a, pc.b, 100);
        });
        r.roots.forEach(x => { p.noStroke(); p.fill(C.ink); p.circle(v.X(x), v.Y(0), 8); });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL);
        fitText(p, 'Toca un trozo para doblarlo sobre el eje x', W / 2, v.box.y + v.box.h + 22, W - 24, 13);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, grade({ folds }, { rounds: [r] }).solution.replace(/^1\) /, ''), W / 2, v.box.y + v.box.h + 44, W - 24, 13); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked || !hitBox(v.box, p.mouseX, p.mouseY)) return;
        const x = v.toX(p.mouseX), k = pieces(params.rounds[cur]).findIndex(pc => x >= pc.a && x <= pc.b);
        if (k < 0) return;
        folds[cur][k] = !folds[cur][k]; touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ folds: folds.map(a => a.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, pieces };
})();
