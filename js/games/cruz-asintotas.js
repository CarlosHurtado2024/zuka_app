// La cruz de asíntotas (cálculo, funciones racionales): arriba está la fórmula y = (px + q)/(x − h). En el
// plano hay una cruz (dos rectas punteadas) que se arrastra (ajuste a enteros); la hipérbola se dibuja
// pegada a la cruz, así que hay que llevarla al lugar correcto: la vertical donde el denominador se anula
// (x = h) y la horizontal a la altura del cociente de los coeficientes principales (y = p).
// params = { rounds: [{ p, q, h, xr, yr }] }   state = { cross: [[x, y]] }

GAMES['cruz-asintotas'] = (() => {
  const center = r => [r.h, r.p];
  const kOf = r => r.p * r.h + r.q;
  function lin(m, b) {
    const mx = m === 1 ? 'x' : m === -1 ? '−x' : `${numTxt(m)}x`;
    return b === 0 ? mx : `${mx} ${b < 0 ? '−' : '+'} ${numTxt(Math.abs(b))}`;
  }
  const fText = r => `y = (${lin(r.p, r.q)}) / (${lin(1, -r.h)})`;
  const same = (c, r) => !!c && c[0] === r.h && c[1] === r.p;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.cross[i], r));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) x = ${numTxt(r.h)}, y = ${numTxt(r.p)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const cross = params.rounds.map(() => [0, 0]), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, drag = null;

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], w = W - 24, h = Math.min(H - 84 - 70, w * (r.yr[1] - r.yr[0]) / (r.xr[1] - r.xr[0]));
      v = planeView({ x: 12, y: 84, w, h }, r.xr, r.yr);
    }
    function dashed(p, x, y, col) {
      p.stroke(col); p.strokeWeight(2.5); p.drawingContext.setLineDash([7, 6]);
      p.line(v.X(x), v.box.y + 3, v.X(x), v.box.y + v.box.h - 3); p.line(v.box.x + 3, v.Y(y), v.box.x + v.box.w - 3, v.Y(y));
      p.drawingContext.setLineDash([]);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], [cx, cy] = cross[cur], k = kOf(r), ok = same(cross[cur], r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(cross[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, fText(r), W / 2, 62, W - 24, 19);
        drawPlane(p, C, v);
        if (locked && !ok) dashed(p, r.h, r.p, C.ok);
        dashed(p, cx, cy, locked ? (ok ? C.ok : C.bad) : C.N);
        p.stroke(C.brand); p.strokeWeight(3.5);
        drawCurve(p, v, x => k / (x - cx) + cy, v.xr[0], cx - 1e-6, 160);
        drawCurve(p, v, x => k / (x - cx) + cy, cx + 1e-6, v.xr[1], 160);
        // Manija de la cruz.
        p.stroke(C.ink); p.strokeWeight(2); p.fill(drag ? C.N : C.card); p.circle(v.X(cx), v.Y(cy), 22);
        p.noStroke(); p.fill(C.N); p.textSize(12); p.textAlign(p.LEFT, p.BOTTOM);
        p.text(`(${numTxt(cx)}, ${numTxt(cy)})`, Math.min(v.X(cx) + 13, W - 70), v.Y(cy) - 8);
        p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        const by = v.box.y + v.box.h + 22;
        p.fill(C.N); fitText(p, `Dominio: ℝ ∖ {${numTxt(cx)}}`, W / 4 + 4, by, W / 2 - 12, 14);
        p.fill(C.Z); fitText(p, `Rango: ℝ ∖ {${numTxt(cy)}}`, 3 * W / 4 - 4, by, W / 2 - 12, 14);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Arrastra el centro de la cruz', W / 2, by + 24, W - 24, 12);
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked || !hitBox(v.box, p.mouseX, p.mouseY)) return;
        drag = true; p.mouseDragged(); return false;
      };
      p.mouseDragged = () => {
        if (!drag || locked) return;
        const r = params.rounds[cur];
        const x = Math.max(Math.ceil(r.xr[0]) + 1, Math.min(Math.floor(r.xr[1]) - 1, Math.round(v.toX(p.mouseX))));
        const y = Math.max(Math.ceil(r.yr[0]) + 1, Math.min(Math.floor(r.yr[1]) - 1, Math.round(v.toY(p.mouseY))));
        if (x !== cross[cur][0] || y !== cross[cur][1]) { cross[cur] = [x, y]; touched[cur] = true; api.ready(touched.every(Boolean)); }
        return false;
      };
      p.mouseReleased = () => { drag = null; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ cross: cross.map(c => c.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, center, kOf, fText };
})();
