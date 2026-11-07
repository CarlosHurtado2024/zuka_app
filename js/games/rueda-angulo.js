// La rueda del ángulo (trigonometría, grados y radianes): se gira el lado terminal arrastrando su
// punta (también varias vueltas y en sentido negativo) hasta el ángulo pedido, en grados o radianes.
// El giro deja una espiral que cuenta las vueltas; los botones ajustan de a un paso. Rondas con pestañas.
// params = { snap, rounds: [{ target (grados), label, tex }] }   state = { angles: [grados | null] }

GAMES['rueda-angulo'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  // Grados → múltiplo de π en texto (150 → 5π/6); con múltiplos de 5°.
  function fmtRad(deg) {
    if (deg === 0) return '0';
    if (deg % 5 !== 0) return (deg * Math.PI / 180).toFixed(2).replace('-', '−');
    const n = deg / 5, g = gcd(Math.abs(n), 36), num = n / g, den = 36 / g, k = Math.abs(num);
    const top = k === 1 ? 'π' : `${k}π`;
    return (num < 0 ? '−' : '') + (den === 1 ? top : `${top}/${den}`);
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.angles[i] != null && Math.abs(state.angles[i] - r.target) < 0.5);
    return { ok, solution: params.rounds.map(r => `$${r.tex} = ${r.target}^\\circ$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, snap = params.snap || 15;
    const st = { angles: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], btns = [], cx = 0, cy = 0, R = 0, drag = false, raw = 0, last = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.34, h * 0.27); cx = w / 2; cy = 70 + R + 26;
      const bw = 96, by = h - 50;
      btns = [{ d: snap, x: w / 2 - bw - 6, y: by, w: bw, h: 36, t: `↺ +${snap}°` }, { d: -snap, x: w / 2 + 6, y: by, w: bw, h: 36, t: `↻ −${snap}°` }];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ang = () => st.angles[cur] ?? 0;
    const ready = () => api.ready(st.angles.every(a => a !== null));
    const pt = (deg, r) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function spiral(deg, col, weight) {
        if (Math.abs(deg) < 1) return;
        p.noFill(); p.stroke(col); p.strokeWeight(weight); p.beginShape();
        const n = Math.max(2, Math.ceil(Math.abs(deg) / 3));
        for (let k = 0; k <= n; k++) {
          const d = deg * k / n, [x, y] = pt(d, R * 0.3 + R * 0.12 * Math.abs(d) / 360);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], a = ang(), good = Math.abs(a - r.target) < 0.5;
        tabs.forEach((t, i) => {
          const v = st.angles[i], ok = v !== null && Math.abs(v - params.rounds[i].target) < 0.5;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER); p.text('Gira hasta', 12, 54);
        p.fill(C.N); p.textStyle(p.BOLD); p.textSize(24); p.text(r.label, 82, 54);

        // Ejes y circunferencia.
        p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - R - 14, cy, cx + R + 14, cy); p.line(cx, cy - R - 14, cx, cy + R + 14);
        p.noFill(); p.stroke(C.line); p.strokeWeight(2); p.circle(cx, cy, 2 * R);
        // Espiral del giro (amarilla si es positivo, coral si es negativo) y lado inicial.
        spiral(a, a >= 0 ? C.N : C.I, 3);
        p.stroke(C.Z); p.strokeWeight(4); p.line(cx, cy, cx + R, cy);
        if (locked && !good) {
          const [gx, gy] = pt(r.target, R);
          p.stroke(C.ok); p.strokeWeight(3); p.drawingContext.setLineDash([6, 5]); p.line(cx, cy, gx, gy); p.drawingContext.setLineDash([]);
        }
        const col = locked ? (good ? C.ok : C.bad) : drag ? C.ink : C.brand;
        const [hx, hy] = pt(a, R);
        p.stroke(col); p.strokeWeight(5); p.line(cx, cy, hx, hy);
        p.noStroke(); p.fill(col); p.circle(hx, hy, 22);
        p.fill(C.bg); p.circle(hx, hy, 8);

        // Lectura: grados, radianes y vueltas.
        const turns = Math.trunc(a / 360), rest = a - 360 * turns;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
        p.fill(st.angles[cur] === null ? C.mute : C.ink); p.textStyle(p.BOLD); p.textSize(20);
        p.text(st.angles[cur] === null ? 'arrastra el punto' : `θ = ${String(a).replace('-', '−')}° = ${fmtRad(a)}`, W / 2, cy + R + 34);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        if (st.angles[cur] !== null && turns !== 0) p.text(`${Math.abs(turns)} ${Math.abs(turns) === 1 ? 'vuelta' : 'vueltas'} ${a < 0 ? 'hacia atrás' : ''} y ${String(rest).replace('-', '−')}° más`, W / 2, cy + R + 56);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`era ${String(r.target).replace('-', '−')}° = ${fmtRad(r.target)}`, W / 2, cy + R + 56); }
        btns.forEach(b => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textStyle(p.BOLD); p.textSize(14); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      const setAngle = v => { st.angles[cur] = Math.round(v / snap) * snap; ready(); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = btns.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { setAngle(ang() + b.d); api.sfx?.tap?.(); return false; }
        const d = Math.hypot(p.mouseX - cx, p.mouseY - cy);
        if (d > R * 0.25 && d < R + 34) {
          drag = true; raw = ang(); last = Math.atan2(cy - p.mouseY, p.mouseX - cx) * 180 / Math.PI;
          // Al tocar, la punta salta al lugar tocado (dentro de la misma vuelta).
          let delta = last - (((raw % 360) + 360) % 360); if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
          raw += delta; setAngle(raw); return false;
        }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        const now = Math.atan2(cy - p.mouseY, p.mouseX - cx) * 180 / Math.PI;
        let delta = now - last; if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
        last = now; raw += delta; setAngle(raw);
        return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.38);

    return {
      loaded: m.ready,
      getState: () => ({ angles: [...st.angles] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, fmtRad };
})();
