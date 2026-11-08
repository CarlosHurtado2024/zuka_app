// La espiral de potencias (trigonometría, De Moivre): hay que decidir cuántas veces multiplicar por z
// para caer justo en la estrella. «× z» y «÷ z» cambian n; la espiral queda tapada por una nube hasta
// comprobar: entonces el punto salta potencia por potencia (zⁿ = rⁿ cis nθ) y se ve si llega. Mientras
// tanto solo se ven z, la estrella y n. Rondas con pestañas.
// params = { rounds: [{ z: { r, deg }, goal: { r, deg }, label?, zLabel? }] }   state = { ns: [n | null] }

GAMES['espiral-potencias'] = (() => {
  const N_MAX = 24;
  const norm = d => ((Math.round(d) % 360) + 360) % 360;
  const power = (z, n) => ({ r: Math.pow(z.r, n), deg: norm(z.deg * n) });
  const okOne = (n, r) => n != null && n > 0 && Math.abs(power(r.z, n).r - r.goal.r) < 1e-6 * Math.max(1, r.goal.r) && power(r.z, n).deg === norm(r.goal.deg);
  const first = r => { for (let n = 1; n <= N_MAX; n++) if (okOne(n, r)) return n; return null; };
  const fmt = v => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : String(+v.toFixed(2)));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okOne(state.ns[i], r));
    return { ok, solution: params.rounds.map(r => `${r.label || 'meta'}: n = ${first(r)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { ns: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, bMul = null, bDiv = null, anim = 1, scale = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.44, (h - 230) / 2); cx = w / 2; cy = 96 + R;
      const bw = (w - 36) / 2; bDiv = { x: 12, y: h - 54, w: bw, h: 44 }; bMul = { x: 24 + bw, y: h - 54, w: bw, h: 44 };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], n = st.ns[cur] ?? 0;
        anim = Math.min(1, anim + 0.06);
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.ns[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.ns[i] != null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textSize(16); p.textAlign(p.CENTER, p.CENTER);
        const ask = `z = ${r.zLabel || `${fmt(r.z.r)} cis ${r.z.deg}°`}   ·   llega a la estrella ${r.label || ''}`;
        let ts = 16; p.textSize(ts); while (p.textWidth(ask) > W - 16 && ts > 10) p.textSize(--ts);
        p.text(ask, W / 2, 56);

        // Escala: que quepan la meta y la potencia actual (con animación suave).
        const need = Math.max(r.goal.r, locked ? power(r.z, n).r : 1, r.z.r, 1) * 1.15;
        scale = scale == null ? need : scale + (need - scale) * 0.12;
        const k = R / scale, P = (mod, deg) => [cx + mod * k * Math.cos(deg * Math.PI / 180), cy - mod * k * Math.sin(deg * Math.PI / 180)];
        p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - R, cy, cx + R, cy); p.line(cx, cy - R, cx, cy + R);
        p.noFill(); p.stroke(C.line); p.strokeWeight(1); p.drawingContext.setLineDash([3, 5]); p.circle(cx, cy, 2 * k); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.text('1', cx + k + 6, cy + 8);
        // Estrella meta.
        const [gx, gy] = P(r.goal.r, r.goal.deg), tw = p.frameCount * 0.05;
        p.fill(C.N); p.noStroke(); p.beginShape();
        for (let j = 0; j < 10; j++) { const a = tw + j * Math.PI / 5, rr = j % 2 ? 5 : 12; p.vertex(gx + rr * Math.cos(a), gy + rr * Math.sin(a)); }
        p.endShape(p.CLOSE);
        // z (flecha corta) siempre visible; la espiral solo al comprobar.
        const [zx, zy] = P(r.z.r, r.z.deg); p.stroke(C.R); p.strokeWeight(3); p.line(cx, cy, zx, zy); p.noStroke(); p.fill(C.R); p.circle(zx, zy, 9);
        p.textSize(12); p.textStyle(p.BOLD); p.text('z', zx + 10, zy - 10);
        if (!locked) {
        } else {
        p.noFill(); p.stroke(C.Z); p.strokeWeight(2.5); p.beginShape();
        for (let j = 0; j <= n; j++) {
          const steps = 12, lim = j === n ? Math.round(steps * anim) : steps;
          if (j === 0) { p.vertex(...P(1, 0)); continue; }
          for (let s = 1; s <= lim; s++) { const f = (j - 1) + s / steps; p.vertex(...P(Math.pow(r.z.r, f), r.z.deg * f)); }
        }
        p.endShape();
        for (let j = 0; j < n; j++) { const q = power(r.z, j), [x, y] = P(q.r, q.deg); p.noStroke(); p.fill(C.Z + '99'); p.circle(x, y, 7); }
        const f = n === 0 ? 0 : n - 1 + anim, [hx, hy] = P(Math.pow(r.z.r, f), r.z.deg * f);
        const on = st.ns[cur] != null && okOne(st.ns[cur], r) && locked;
        p.noStroke(); p.fill(locked ? (okOne(st.ns[cur], r) ? C.ok : C.bad) : C.I); p.circle(hx, hy, 16);
        if (on) { p.noFill(); p.stroke(C.ok); p.strokeWeight(3); p.circle(gx, gy, 30); }
        }

        // Marcador y botones.
        const q = power(r.z, n), y0 = cy + R + 20;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(17); p.fill(C.ink);
        p.text(n === 0 ? 'n = 0   (pulsa × z)' : `multiplicar ${n} ${n === 1 ? 'vez' : 'veces'}: z^${n}`, W / 2, y0);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(locked ? `z^${n} = ${fmt(q.r)} cis ${q.deg}°` : 'la espiral se revela al comprobar', W / 2, y0 + 20);
        if (locked && !okOne(st.ns[cur], r)) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(13); p.text(`llegaba con n = ${first(r)}`, W / 2, y0 + 40); }
        [[bDiv, '÷ z'], [bMul, '× z']].forEach(([b, s]) => { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10); p.noStroke(); p.fill(C.ink); p.textSize(18); p.textStyle(p.BOLD); p.text(s, b.x + b.w / 2, b.y + b.h / 2); });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; anim = 1; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const n = st.ns[cur] ?? 0;
        if (inside(bMul, p.mouseX, p.mouseY) && n < N_MAX) { st.ns[cur] = n + 1; anim = 1; api.ready(st.ns.every(v => v != null && v > 0)); api.sfx?.tap?.(); return false; }
        if (inside(bDiv, p.mouseX, p.mouseY) && n > 0) { st.ns[cur] = n - 1; anim = 1; api.ready(st.ns.every(v => v != null && v > 0)); api.sfx?.tap?.(); return false; }
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ ns: [...st.ns] }),
      lock() { locked = true; anim = 0; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, power, first };
})();
