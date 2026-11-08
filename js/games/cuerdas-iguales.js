// Cuerdas iguales (cálculo, distancia y equidistancia): un anillo se desliza por un riel (el eje x o el
// eje y) y de él salen dos cuerdas hasta los puntos A y B; sus largos se ven en vivo. Hay que dejar el
// anillo donde las dos cuerdas miden lo mismo: el punto del eje a igual distancia de A y de B.
// params = { rounds: [{ A: [x, y], B: [x, y], rail: 'x'|'y' }] }   state = { ps: [coordenada sobre el riel] }

GAMES['cuerdas-iguales'] = (() => {
  const RANGE = 8;
  const clean = v => { const r = Math.round(v * 1e9) / 1e9; return r === 0 ? 0 : r; };
  function target(r) {
    const k = r.B[0] ** 2 + r.B[1] ** 2 - r.A[0] ** 2 - r.A[1] ** 2;
    return clean(r.rail === 'y' ? k / (2 * (r.B[1] - r.A[1])) : k / (2 * (r.B[0] - r.A[0])));
  }
  const ringAt = (r, v) => (r.rail === 'y' ? [0, v] : [v, 0]);
  const len = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  const num = v => String(v).replace('-', '−');
  const fits = (v, r) => v != null && Math.abs(v - target(r)) < 1e-9;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.ps[i], r));
    return { ok, solution: params.rounds.map(r => { const P = ringAt(r, target(r)); return `P = (${P[0]}, ${P[1]})`; }).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ps = params.rounds.map(() => 0), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, minus = null, plus = null, drag = false;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const n = 2 * RANGE + 1;
    const X = x => box.x + (x + RANGE + 0.5) / n * box.w, Y = y => box.y + (RANGE + 0.5 - y) / n * box.h;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(W - 24, H - 150);
      box = { x: (W - side) / 2, y: 46, w: side, h: side };
      minus = { x: 12, y: H - 50, w: 56, h: 40 }; plus = { x: W - 68, y: H - 50, w: 56, h: 40 };
    }
    const changed = () => { touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean)); };
    const set = v => { const s = Math.max(-RANGE, Math.min(RANGE, Math.round(v * 2) / 2)); if (s !== ps[cur]) { ps[cur] = s; changed(); } else { touched[cur] = true; api.ready(touched.every(Boolean)); } };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], v = ps[cur], P = ringAt(r, v), la = len(P, r.A), lb = len(P, r.B), ok = fits(v, r);
        tabs.forEach((tb, i) => {
          const g = fits(ps[i], params.rounds[i]);
          const col = locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
        for (let k = -RANGE; k <= RANGE; k++) {
          p.stroke(C.line); p.strokeWeight(0.6); p.line(X(k), box.y + 2, X(k), box.y + box.h - 2); p.line(box.x + 2, Y(k), box.x + box.w - 2, Y(k));
        }
        p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(0), box.y + 2, X(0), box.y + box.h - 2); p.line(box.x + 2, Y(0), box.x + box.w - 2, Y(0));
        // Riel resaltado.
        p.stroke(C.R); p.strokeWeight(6);
        if (r.rail === 'y') p.line(X(0), box.y + 6, X(0), box.y + box.h - 6); else p.line(box.x + 6, Y(0), box.x + box.w - 6, Y(0));
        p.noStroke(); p.fill(C.R); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.LEFT, p.TOP); p.text(`riel: eje ${r.rail}`, box.x + 6, box.y + 6);
        // Cuerdas con su largo.
        const px = X(P[0]), py = Y(P[1]);
        [[r.A, C.Z, la, 'A'], [r.B, C.I, lb, 'B']].forEach(([Q, col, l, name]) => {
          const qx = X(Q[0]), qy = Y(Q[1]);
          p.stroke(ok ? C.ok : col); p.strokeWeight(3); p.line(px, py, qx, qy);
          p.stroke(C.ink); p.strokeWeight(2); p.fill(col); p.circle(qx, qy, 14);
          p.noStroke(); p.fill(C.ink); p.textSize(12); p.textAlign(p.CENTER, p.BOTTOM); p.text(`${name}(${num(Q[0])}, ${num(Q[1])})`, Math.max(box.x + 34, Math.min(box.x + box.w - 34, qx)), qy - 9);
        });
        p.stroke(C.ink); p.strokeWeight(2.5); p.fill(ok ? C.ok : C.N); p.circle(px, py, 18);
        p.noStroke(); p.fill(ok ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const read = `P(${num(P[0])}, ${num(P[1])})   |PA| = ${la.toFixed(2)}   |PB| = ${lb.toFixed(2)}`;
        let sz = 15; p.textSize(sz); while (sz > 10 && p.textWidth(read) > W - 24) { sz -= 1; p.textSize(sz); }
        p.text(read, W / 2, box.y + box.h + 22); p.textSize(15);
        if (ok && !locked) { p.fill(C.ok); p.text('¡cuerdas iguales!', W / 2, box.y + box.h + 44); }
        if (locked && !ok) { const T = ringAt(r, target(r)); p.fill(C.ok); p.textSize(13); p.text(`era P(${num(T[0])}, ${num(T[1])})`, W / 2, box.y + box.h + 44); }
        [[minus, r.rail === 'y' ? '▼' : '◀'], [plus, r.rail === 'y' ? '▲' : '▶']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(16); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      const fromMouse = () => { const r = params.rounds[cur]; return r.rail === 'y' ? RANGE + 0.5 - (p.mouseY - box.y) / box.h * n : (p.mouseX - box.x) / box.w * n - RANGE - 0.5; };
      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(minus, p.mouseX, p.mouseY)) { set(ps[cur] - 0.5); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { set(ps[cur] + 0.5); return false; }
        if (inside(box, p.mouseX, p.mouseY)) { drag = true; set(fromMouse()); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { set(fromMouse()); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.42);

    return {
      loaded: m.ready,
      getState: () => ({ ps: ps.slice() }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, target };
})();
