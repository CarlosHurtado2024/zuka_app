// El balancín (cálculo, punto medio y punto que divide un segmento): una tabla va del punto A al punto B
// del plano y en cada punta hay un peso (×1, ×2, ×3). Se arrastra el apoyo por la tabla (o con − / +,
// de doceavo en doceavo) hasta que quede en equilibrio; un nivel de burbuja y la tabla que se ladea
// muestran hacia dónde se va. Con pesos iguales el equilibrio es el punto medio; con pesos distintos, el
// punto que divide el segmento en la razón de los pesos: G = (m_A·A + m_B·B)/(m_A + m_B).
// params = { rounds: [{ A: [x, y], B: [x, y], mA, mB }] }   state = { ts: [t] }  (t = fracción de A a B)

GAMES['balancin'] = (() => {
  const clean = v => { const r = Math.round(v * 1e9) / 1e9; return r === 0 ? 0 : r; };
  const targetT = r => r.mB / (r.mA + r.mB);
  const pointAt = (A, B, t) => [clean(A[0] + t * (B[0] - A[0])), clean(A[1] + t * (B[1] - A[1]))];
  function frac(v) {
    for (let d = 1; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(v * d - n) < 1e-6) return (n < 0 ? '−' : '') + (d === 1 ? Math.abs(n) : `${Math.abs(n)}/${d}`); }
    return v.toFixed(2).replace('-', '−');
  }
  const pt = P => `(${frac(P[0])}, ${frac(P[1])})`;
  const fits = (t, r) => t != null && Math.abs(t - targetT(r)) < 1e-9;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.ts[i], r));
    return { ok, solution: params.rounds.map(r => `equilibrio en ${pt(pointAt(r.A, r.B, targetT(r)))}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ks = params.rounds.map(() => 1), touched = params.rounds.map(() => false);   // t = k/12
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, minus = null, plus = null, drag = false, tilt = 0;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(W - 24, H - 160);
      box = { x: (W - side) / 2, y: 46, w: side, h: side };
      minus = { x: 12, y: H - 50, w: 56, h: 40 }; plus = { x: W - 68, y: H - 50, w: 56, h: 40 };
    }
    function view(r) {
      const xs = [r.A[0], r.B[0]], ys = [r.A[1], r.B[1]];
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const half = Math.ceil(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2) + 2;
      const x0 = Math.floor(cx - half), y0 = Math.floor(cy - half), n = 2 * half + 1;
      return { x0, y0, n, X: x => box.x + (x - x0) / n * box.w, Y: y => box.y + box.h - (y - y0) / n * box.h };
    }
    const changed = () => { touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean)); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], t = ks[cur] / 12, v = view(r), ok = fits(t, r);
        tabs.forEach((tb, i) => {
          const g = fits(ks[i] / 12, params.rounds[i]);
          const col = locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
        for (let k = 0; k <= v.n; k++) {
          const gx = v.x0 + k, gy = v.y0 + k;
          p.stroke(gx === 0 ? C.mute : C.line); p.strokeWeight(gx === 0 ? 1.5 : 0.6); p.line(v.X(gx), box.y + 2, v.X(gx), box.y + box.h - 2);
          p.stroke(gy === 0 ? C.mute : C.line); p.strokeWeight(gy === 0 ? 1.5 : 0.6); p.line(box.x + 2, v.Y(gy), box.x + box.w - 2, v.Y(gy));
        }
        // Torque: positivo si gana A. La tabla gira un poco alrededor del apoyo.
        const torque = r.mA * t - r.mB * (1 - t);
        const G = pointAt(r.A, r.B, t), gx = v.X(G[0]), gy = v.Y(G[1]);
        const side = v.X(r.A[0]) < gx ? -1 : 1;   // gira de modo que baje la punta más pesada
        tilt += (Math.max(-0.25, Math.min(0.25, torque * 0.35)) * side * (ok ? 0 : 1) - tilt) * 0.15;
        const rot = (x, y) => { const dx = x - gx, dy = y - gy, c = Math.cos(tilt), s = Math.sin(tilt); return [gx + dx * c - dy * s, gy + dx * s + dy * c]; };
        const [ax, ay] = rot(v.X(r.A[0]), v.Y(r.A[1])), [bx, by] = rot(v.X(r.B[0]), v.Y(r.B[1]));
        p.stroke(locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.N); p.strokeWeight(7); p.line(ax, ay, bx, by);
        // Marcas de doceavos sobre la tabla.
        for (let k = 1; k < 12; k++) { const [mx, my] = rot(v.X(r.A[0] + k / 12 * (r.B[0] - r.A[0])), v.Y(r.A[1] + k / 12 * (r.B[1] - r.A[1]))); p.noStroke(); p.fill(C.bg); p.circle(mx, my, k % 6 === 0 ? 5 : 3); }
        // Pesos.
        [[ax, ay, r.mA, 'A', r.A], [bx, by, r.mB, 'B', r.B]].forEach(([x, y, w, n, P]) => {
          const s = 16 + 7 * w;
          p.stroke(C.ink); p.strokeWeight(2); p.fill(n === 'A' ? C.Z : C.I); p.rect(x - s / 2, y - s, s, s, 4);
          p.noStroke(); p.fill(C.bg); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(`×${w}`, x, y - s / 2);
          p.fill(C.ink); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text(`${n}${pt(P)}`, Math.max(box.x + 30, Math.min(box.x + box.w - 30, x)), y + 6);
        });
        // Apoyo (triángulo) en el punto elegido.
        p.stroke(C.ink); p.strokeWeight(2); p.fill(ok ? C.ok : C.Q); p.triangle(gx, gy + 3, gx - 11, gy + 22, gx + 11, gy + 22);
        // Nivel de burbuja.
        const lx = W / 2, lyy = box.y + box.h + 22, bw2 = 120;
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(lx - bw2 / 2, lyy - 9, bw2, 18, 9);
        p.stroke(C.mute); p.line(lx - 8, lyy - 9, lx - 8, lyy + 9); p.line(lx + 8, lyy - 9, lx + 8, lyy + 9);
        p.noStroke(); p.fill(ok ? C.ok : C.N); p.circle(lx + Math.max(-50, Math.min(50, -torque * 40)), lyy, 14);
        p.fill(ok ? C.ok : C.ink); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
        p.text(`apoyo en ${pt(G)}${ok ? '  ¡equilibrio!' : ''}`, W / 2, lyy + 26);
        if (locked && !ok) { p.fill(C.ok); p.textSize(12); p.text(`era ${pt(pointAt(r.A, r.B, targetT(r)))}`, W / 2, lyy + 44); }
        [[minus, '◀'], [plus, '▶']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(16); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      function moveTo(mx, my) {
        const r = params.rounds[cur], v = view(r), ax = v.X(r.A[0]), ay = v.Y(r.A[1]), bx = v.X(r.B[0]), by = v.Y(r.B[1]);
        const dx = bx - ax, dy = by - ay, t = ((mx - ax) * dx + (my - ay) * dy) / (dx * dx + dy * dy);
        const k = Math.max(1, Math.min(11, Math.round(t * 12)));
        if (k !== ks[cur]) { ks[cur] = k; changed(); } else touched[cur] = true;
      }
      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(minus, p.mouseX, p.mouseY)) { ks[cur] = Math.max(1, ks[cur] - 1); changed(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { ks[cur] = Math.min(11, ks[cur] + 1); changed(); return false; }
        if (inside(box, p.mouseX, p.mouseY)) { drag = true; moveTo(p.mouseX, p.mouseY); api.ready(touched.every(Boolean)); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { moveTo(p.mouseX, p.mouseY); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.42);

    return {
      loaded: m.ready,
      getState: () => ({ ts: ks.map(k => k / 12) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, targetT, pointAt };
})();
