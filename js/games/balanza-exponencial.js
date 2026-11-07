// Balanza exponencial (ecuaciones exponenciales y logarítmicas): cada lado de la ecuación cuelga de un
// platillo. Con − / + o arrastrando el cursor se cambia x; cada platillo muestra su valor y el brazo se
// inclina hacia el lado mayor hasta nivelarse en la solución. Si un lado no existe para ese x (un
// logaritmo de un número ≤ 0), el platillo dice «no existe» y el brazo se pone rojo: así se ve por qué
// una solución extraña no sirve.
// params = { rounds: [{ tex, txt, L, R, x, min?, max?, step?, extra? }] }  (L, R: funciones de x;
//   extra: la solución extraña que aparece al resolver, si la hay)   state = { xs: [x] }

GAMES['balanza-exponencial'] = (() => {
  const MAXT = 0.35;
  // Ángulo del brazo (positivo: baja el platillo izquierdo); null si algún lado no existe.
  function tilt(l, r) {
    if (!Number.isFinite(l) || !Number.isFinite(r)) return null;
    if (Math.abs(l - r) <= 1e-9 * Math.max(1, Math.abs(l))) return 0;
    return MAXT * (l - r) / (Math.abs(l) + Math.abs(r));
  }
  const fmt = v => {
    if (!Number.isFinite(v)) return 'no existe';
    const s = Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(2) : String(+v.toPrecision(4));
    return s.replace('-', '−');
  };
  const range = r => ({ min: r.min ?? -4, max: r.max ?? 6, step: r.step ?? 0.5 });

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.xs[i] != null && Math.abs(state.xs[i] - r.x) < 1e-9);
    return { ok, solution: params.rounds.map(r => `$${r.tex}$: $x = ${r.x}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const xs = params.rounds.map(r => r.start ?? range(r).min), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], minus = null, plus = null, track = null, shown = 0;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      minus = { x: 12, y: h - 58, w: 44, h: 40 };
      plus = { x: w - 56, y: h - 58, w: 44, h: 40 };
      track = { x: 72, y: h - 58, w: w - 144, h: 40 };
    }
    const ready = () => api.ready(touched.every(Boolean));
    const setX = (i, x) => {
      const { min, max, step } = range(params.rounds[i]);
      const v = +(Math.round((Math.max(min, Math.min(max, x)) - min) / step) * step + min).toFixed(6);
      if (v !== xs[i]) api.sfx?.tap?.();
      xs[i] = v; touched[i] = true; ready();
    };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      function fit(s, x, y, sz, maxW) {
        p.textSize(sz);
        while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); }
        p.text(s, x, y);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], x = xs[cur], { min, max } = range(r);
        const l = r.L(x), rr = r.R(x), t = tilt(l, rr), good = t === 0;
        tabs.forEach((tb, i) => {
          const ok = Math.abs(xs[i] - params.rounds[i].x) < 1e-9;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(tb.x, tb.y, tb.w, tb.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, tb.x + tb.w / 2, tb.y + tb.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fit(r.txt || r.tex, W / 2, 62, 20, W - 24);

        // Balanza: el brazo gira suave hacia su ángulo; rojo si un lado no existe.
        shown += ((t ?? 0) - shown) * 0.2;
        const cx = W / 2, cy = 112, arm = Math.min(W * 0.36, 150), dx = arm * Math.cos(shown), dy = arm * Math.sin(shown);
        const beamCol = t === null ? C.bad : locked ? (good ? C.ok : C.bad) : good ? C.ok : C.mute;
        p.noStroke(); p.fill(C.line); p.triangle(cx, cy, cx - 26, cy + 150, cx + 26, cy + 150); p.rect(cx - 50, cy + 148, 100, 8, 4);
        p.stroke(beamCol); p.strokeWeight(6); p.line(cx - dx, cy + dy, cx + dx, cy - dy);
        p.noStroke(); p.fill(beamCol); p.circle(cx, cy, 14);
        const pan = (px, py, val, col, label) => {
          p.stroke(C.mute); p.strokeWeight(1.5); p.line(px, py, px - 30, py + 56); p.line(px, py, px + 30, py + 56);
          p.noStroke(); p.fill(Number.isFinite(val) ? col : C.bad); p.arc(px, py + 56, 76, 34, 0, Math.PI, p.CHORD);
          p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text(label, px, py + 78);
          p.fill(Number.isFinite(val) ? C.ink : C.bad); fit(fmt(val), px, py + 98, 15, W / 2 - 20);
        };
        pan(cx - dx, cy + dy, l, C.Z, 'izquierda');
        pan(cx + dx, cy - dy, rr, C.I, 'derecha');
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13);
        if (t === null) { p.fill(C.bad); p.text('para este x un lado no existe', W / 2, cy + 172); }
        else if (good) { p.fill(C.ok); p.text('¡equilibrio!', W / 2, cy + 172); }

        // x: − / + y cursor.
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(20); p.textAlign(p.CENTER, p.CENTER); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        const ty = track.y + 28, kx = track.x + 8 + (x - min) / (max - min) * (track.w - 16);
        p.stroke(C.line); p.strokeWeight(4); p.line(track.x + 8, ty, track.x + track.w - 8, ty);
        p.noStroke(); p.fill(locked ? C.mute : C.brand); p.circle(kx, ty, 18);
        p.fill(C.ink); p.textSize(15); p.textStyle(p.BOLD); p.text(`x = ${String(x).replace('-', '−')}`, W / 2, track.y + 6);
        if (locked && !(Math.abs(x - r.x) < 1e-9)) { p.fill(C.ok); p.textSize(12); p.text(`era x = ${String(r.x).replace('-', '−')}`, W / 2, H - 8); }
      };

      let dragging = false;
      const fromTrack = () => { const { min, max } = range(params.rounds[cur]); setX(cur, min + (p.mouseX - track.x - 8) / (track.w - 16) * (max - min)); };
      p.mousePressed = () => {
        const tb = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const { step } = range(params.rounds[cur]);
        if (inside(minus, p.mouseX, p.mouseY)) { setX(cur, xs[cur] - step); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { setX(cur, xs[cur] + step); return false; }
        if (inside(track, p.mouseX, p.mouseY)) { dragging = true; fromTrack(); return false; }
      };
      p.mouseDragged = () => { if (dragging && !locked) { fromTrack(); return false; } };
      p.mouseReleased = () => { dragging = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ xs: xs.slice() }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, tilt };
})();
