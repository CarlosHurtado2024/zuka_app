// La tirolesa (cálculo, distancia entre dos puntos): dos torres en el plano cartesiano y un carrete de
// cable. Con −1 / −0.1 / +0.1 / +1 se suelta o se recoge cable desde la torre A: si es corto no alcanza
// la torre B (queda colgando el gancho); si sobra, el cable se pandea; con la medida justa (a la décima)
// queda tenso y se puede lanzar. La distancia es √((x₂ − x₁)² + (y₂ − y₁)²).
// params = { rounds: [{ A: [x, y], B: [x, y] }] }   state = { lens: [L] }

GAMES['tirolesa'] = (() => {
  const dist = (A, B) => Math.hypot(B[0] - A[0], B[1] - A[1]);
  const target = (A, B) => Math.round(dist(A, B) * 10) / 10;
  const fits = (L, r) => L != null && Math.abs(L - target(r.A, r.B)) <= 0.05 + 1e-9;
  const num = v => String(v).replace('-', '−');
  function exact(r) {
    const s = (r.B[0] - r.A[0]) ** 2 + (r.B[1] - r.A[1]) ** 2, q = Math.round(Math.sqrt(s));
    return q * q === s ? `${q}` : `\\sqrt{${s}} \\approx ${target(r.A, r.B)}`;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.lens[i], r));
    return { ok, solution: params.rounds.map(r => `$d = ${exact(r)}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const lens = params.rounds.map(() => 1), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], btns = [], box = null;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    function layout() {
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(W - 24, H - 170);
      box = { x: (W - side) / 2, y: 46, w: side, h: side };
      const bw = (W - 24 - 3 * 8) / 4, by = H - 50;
      btns = [-1, -0.1, 0.1, 1].map((d, i) => ({ d, x: 12 + i * (bw + 8), y: by, w: bw, h: 40 }));
    }
    // Ventana del plano: cuadrada, con margen alrededor de las dos torres.
    function view(r) {
      const xs = [r.A[0], r.B[0]], ys = [r.A[1], r.B[1]];
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const half = Math.ceil(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2) + 2;
      const x0 = Math.floor(cx - half), y0 = Math.floor(cy - half), n = 2 * half + 1;
      return { x0, y0, n, X: x => box.x + (x - x0) / n * box.w, Y: y => box.y + box.h - (y - y0) / n * box.h, u: box.w / n };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], L = lens[cur], d = dist(r.A, r.B), ok = fits(L, r), v = view(r);
        tabs.forEach((tb, i) => {
          const g = fits(lens[i], params.rounds[i]);
          const col = locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        // Cuadrícula con ejes.
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
        for (let k = 0; k <= v.n; k++) {
          const gx = v.x0 + k, gy = v.y0 + k;
          p.stroke(gx === 0 ? C.mute : C.line); p.strokeWeight(gx === 0 ? 1.5 : 0.6); p.line(v.X(gx), box.y + 2, v.X(gx), box.y + box.h - 2);
          p.stroke(gy === 0 ? C.mute : C.line); p.strokeWeight(gy === 0 ? 1.5 : 0.6); p.line(box.x + 2, v.Y(gy), box.x + box.w - 2, v.Y(gy));
        }
        const ax = v.X(r.A[0]), ay = v.Y(r.A[1]), bx = v.X(r.B[0]), by = v.Y(r.B[1]);
        // Triángulo de Pitágoras (al bloquear).
        if (locked) {
          p.drawingContext.setLineDash([5, 5]); p.stroke(C.N); p.strokeWeight(2);
          p.line(ax, ay, bx, ay); p.line(bx, ay, bx, by); p.drawingContext.setLineDash([]);
          p.noStroke(); p.fill(C.N); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP);
          p.text(`Δx = ${num(r.B[0] - r.A[0])}`, (ax + bx) / 2, ay + 4); p.textAlign(p.LEFT, p.CENTER); p.text(`Δy = ${num(r.B[1] - r.A[1])}`, bx + 6, (ay + by) / 2);
        }
        // Cable: corto (no llega), justo (tenso) o largo (se pandea).
        p.noFill(); p.strokeWeight(3.5);
        const ux = (bx - ax) / Math.hypot(bx - ax, by - ay), uy = (by - ay) / Math.hypot(bx - ax, by - ay);
        if (ok) { p.stroke(locked ? C.ok : C.Q); p.line(ax, ay, bx, by); }
        else if (L < d) {
          const ex = ax + ux * L * v.u, ey = ay + uy * L * v.u;
          p.stroke(C.I); p.line(ax, ay, ex, ey);
          p.stroke(C.I); p.line(ex, ey, ex, ey + 14); p.noFill(); p.arc(ex + 4, ey + 16, 8, 8, 0, Math.PI);
        } else {
          const sag = Math.min(box.h * 0.4, Math.sqrt(L * L - d * d) * 0.5 * v.u), mx = (ax + bx) / 2, my = (ay + by) / 2 + sag;
          p.stroke(C.R); p.beginShape(); for (let k = 0; k <= 30; k++) { const t = k / 30, x = (1 - t) ** 2 * ax + 2 * (1 - t) * t * mx + t * t * bx, y = (1 - t) ** 2 * ay + 2 * (1 - t) * t * (2 * my - (ay + by) / 2) + t * t * by; p.vertex(x, y); } p.endShape();
        }
        // Torres.
        [[ax, ay, 'A', r.A], [bx, by, 'B', r.B]].forEach(([x, y, n, P]) => {
          p.stroke(C.ink); p.strokeWeight(2); p.fill(C.N); p.rect(x - 7, y - 7, 14, 14, 3);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.BOTTOM);
          p.text(`${n}(${num(P[0])}, ${num(P[1])})`, Math.max(box.x + 34, Math.min(box.x + box.w - 34, x)), y - 10);
        });
        // Lectura y botones.
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(18);
        p.fill(ok ? C.ok : C.ink);
        p.text(`cable: ${L.toFixed(1)}  ${ok ? '¡tenso!' : L < d ? '· no alcanza' : '· sobra cable'}`, W / 2, box.y + box.h + 26);
        if (locked && !ok) { p.fill(C.ok); p.textSize(13); p.text(`medía ${target(r.A, r.B).toFixed(1)}`, W / 2, box.y + box.h + 48); }
        btns.forEach(b => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(16); p.text(`${b.d > 0 ? '+' : '−'}${Math.abs(b.d)}`, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = btns.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        lens[cur] = Math.max(0, Math.min(20, +(lens[cur] + b.d).toFixed(1)));
        touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
        return false;
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ lens: lens.slice() }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, dist, target };
})();
