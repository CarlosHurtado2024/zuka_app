// Arma los tramos (cálculo, funciones a tramos): arriba está la definición con dos fórmulas y el punto de
// corte c. Cada tramo es un segmento con dos asas que se arrastran en vertical (ajuste de ½): el tramo 1
// va del borde izquierdo hasta c y el tramo 2 de c al borde derecho (las asas de c se agarran por su lado).
// Abajo, dos botones deciden si en x = c el punto de cada tramo es lleno (pertenece) o vacío.
// params = { rounds: [{ c, xr, yr, left: { m, b }, right: { m, b }, leftIncl, txt: [t1, t2] }] }
// state = { rounds: [{ ys: [y(x0), y(c⁻), y(c⁺), y(x1)], dots: [lleno1, lleno2] }] }

GAMES['arma-tramos'] = (() => {
  const L = (q, x) => q.m * x + q.b;
  const targetYs = r => [L(r.left, r.xr[0]), L(r.left, r.c), L(r.right, r.c), L(r.right, r.xr[1])].map(y => y + 0);
  const targetDots = r => [!!r.leftIncl, !r.leftIncl];
  const same = (s, r) => !!s && targetYs(r).every((y, k) => Math.abs(s.ys[k] - y) < 1e-9) && targetDots(r).every((d, k) => s.dots[k] === d);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.rounds[i], r));
    return {
      ok,
      solution: params.rounds.map((r, i) => {
        const t = targetYs(r);
        return `${i + 1}) tramo 1 de (${numTxt(r.xr[0])}, ${numTxt(t[0])}) a (${numTxt(r.c)}, ${numTxt(t[1])}) ${r.leftIncl ? '●' : '○'}; tramo 2 de (${numTxt(r.c)}, ${numTxt(t[2])}) ${r.leftIncl ? '○' : '●'} a (${numTxt(r.xr[1])}, ${numTxt(t[3])})`;
      }).join(' · '),
    };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = params.rounds.map(() => ({ ys: [0, 0, 0, 0], dots: [true, true] })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, drag = -1, dotB = [];

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], w = W - 24, h = Math.min(H - 108 - 64, w * (r.yr[1] - r.yr[0]) / (r.xr[1] - r.xr[0]));
      v = planeView({ x: 12, y: 108, w, h }, r.xr, r.yr);
      const bw = (W - 32) / 2;
      dotB = [0, 1].map(k => ({ k, x: 12 + k * (bw + 8), y: H - 50, w: bw, h: 40 }));
    }
    const hx = (r, k) => [v.X(r.xr[0]), v.X(r.c) - 6, v.X(r.c) + 6, v.X(r.xr[1])][k];
    const touch = () => { touched[cur] = true; api.ready(touched.every(Boolean)); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], s = st[cur], ok = same(s, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(st[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD);
        p.fill(C.ink); p.textSize(15); p.text('f(x) =', 12, 76);
        const tx = 12 + p.textWidth('f(x) = ') + 4;
        p.fill(C.Z); fitTextLeft(r.txt[0], tx, 62); p.fill(C.N); fitTextLeft(r.txt[1], tx, 88);
        function fitTextLeft(t, x, y) { let sz = 15; p.textSize(sz); while (sz > 9 && p.textWidth(t) > W - 12 - x) p.textSize(--sz); p.text(t, x, y); }
        drawPlane(p, C, v);
        // Línea del corte.
        p.stroke(C.R); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 5]); p.line(v.X(r.c), v.box.y + 3, v.X(r.c), v.box.y + v.box.h - 3); p.drawingContext.setLineDash([]);
        const seg = (x0, y0, x1, y1, col, w = 3.5) => { p.stroke(col); p.strokeWeight(w); p.line(v.X(x0), v.Y(y0), v.X(x1), v.Y(y1)); };
        if (locked && !ok) {
          const t = targetYs(r); p.drawingContext.setLineDash([6, 5]);
          seg(r.xr[0], t[0], r.c, t[1], C.ok, 2.5); seg(r.c, t[2], r.xr[1], t[3], C.ok, 2.5); p.drawingContext.setLineDash([]);
        }
        const c1 = locked ? (ok ? C.ok : C.bad) : C.Z, c2 = locked ? (ok ? C.ok : C.bad) : C.N;
        seg(r.xr[0], s.ys[0], r.c, s.ys[1], c1); seg(r.c, s.ys[2], r.xr[1], s.ys[3], c2);
        // Puntos del corte.
        [[1, c1, 0], [2, c2, 1]].forEach(([k, col, d]) => { p.stroke(col); p.strokeWeight(2.5); p.fill(s.dots[d] ? col : C.card); p.circle(v.X(r.c), v.Y(s.ys[k]), 12); });
        // Asas.
        [0, 1, 2, 3].forEach(k => {
          if (locked) return;
          p.stroke(C.ink); p.strokeWeight(1.5); p.fill(drag === k ? C.ink : k < 2 ? C.Z : C.N);
          p.rect(hx(r, k) - (k === 1 ? 8 : k === 2 ? 0 : 4), v.Y(s.ys[k]) - 13, 8, 26, 3);
        });
        dotB.forEach(b => {
          const col = b.k ? C.N : C.Z;
          p.stroke(locked ? C.line : col); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
          fitText(p, `tramo ${b.k + 1} en x = ${numTxt(r.c)}: ${s.dots[b.k] ? '● lleno' : '○ vacío'}`, b.x + b.w / 2, b.y + b.h / 2, b.w - 8, 13);
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = params.rounds[cur], s = st[cur], b = dotB.find(b => hitBox(b, p.mouseX, p.mouseY));
        if (b) { s.dots[b.k] = !s.dots[b.k]; touch(); api.sfx?.tap?.(); return false; }
        if (!hitBox({ x: v.box.x - 10, y: v.box.y - 10, w: v.box.w + 20, h: v.box.h + 20 }, p.mouseX, p.mouseY)) return;
        const xc = v.X(r.c);
        if (Math.abs(p.mouseX - xc) < 24) drag = p.mouseX < xc ? 1 : 2;
        else if (Math.abs(p.mouseX - v.X(r.xr[0])) < 30) drag = 0;
        else if (Math.abs(p.mouseX - v.X(r.xr[1])) < 30) drag = 3;
        else drag = -1;
        if (drag >= 0) { p.mouseDragged(); return false; }
      };
      p.mouseDragged = () => {
        if (drag < 0 || locked) return;
        const r = params.rounds[cur], y = Math.max(r.yr[0], Math.min(r.yr[1], Math.round(v.toY(p.mouseY) * 2) / 2));
        if (y !== st[cur].ys[drag]) { st[cur].ys[drag] = y; touch(); }
        return false;
      };
      p.mouseReleased = () => { drag = -1; };
    }, 1.4);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: st.map(s => ({ ys: s.ys.slice(), dots: s.dots.slice() })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, targetYs, targetDots };
})();
