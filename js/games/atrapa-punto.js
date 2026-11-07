// Atrapa el punto (trigonometría, circunferencia unitaria): los 16 puntos notables (múltiplos de 30° y
// de 45°) están marcados; se toca el que cumple la pista de cada ronda: coordenadas exactas, un ángulo en
// radianes o un valor con signo. Al tocar se ve el ángulo, nunca las coordenadas. Rondas con pestañas.
// params = { rounds: [{ prompt, angles: [grados aceptados] }] }   state = { picks: [grados | null] }

GAMES['atrapa-punto'] = (() => {
  const POINTS = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => r.angles.includes(state.picks[i]));
    return { ok, solution: params.rounds.map(r => `${r.prompt} → ${r.angles.map(a => `${a}°`).join(' o ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { picks: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, pulse = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.38, h * 0.28); cx = w / 2; cy = 92 + R;
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.picks.every(v => v !== null));
    const pt = deg => [cx + R * Math.cos(deg * Math.PI / 180), cy - R * Math.sin(deg * Math.PI / 180)];

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], pick = st.picks[cur];
        tabs.forEach((t, i) => {
          const v = st.picks[i], ok = params.rounds[i].angles.includes(v);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text('Atrapa el punto donde', W / 2, 52);
        p.fill(C.N); p.textStyle(p.BOLD); p.textSize(19); p.text(r.prompt, W / 2, 74);

        // Ejes, circunferencia y guías de cuadrante.
        p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - R - 16, cy, cx + R + 16, cy); p.line(cx, cy - R - 16, cx, cy + R + 16);
        p.noFill(); p.stroke(C.line); p.strokeWeight(2); p.circle(cx, cy, 2 * R);
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL);
        p.text('1', cx + R + 8, cy + 10); p.text('−1', cx - R - 10, cy + 10); p.text('1', cx + 9, cy - R - 6); p.text('−1', cx + 11, cy + R + 8);
        // El radio al punto elegido.
        if (pick !== null) { const [x, y] = pt(pick); p.stroke(locked ? (r.angles.includes(pick) ? C.ok : C.bad) : C.brand); p.strokeWeight(3); p.line(cx, cy, x, y); }
        POINTS.forEach(a => {
          const [x, y] = pt(a), sel = a === pick, right = locked && r.angles.includes(a);
          if (right && !sel) { p.noFill(); p.stroke(C.ok); p.strokeWeight(3); p.drawingContext.setLineDash([4, 3]); p.circle(x, y, 26); p.drawingContext.setLineDash([]); }
          if (sel) { p.noFill(); p.stroke(locked ? (r.angles.includes(a) ? C.ok : C.bad) : C.brand); p.strokeWeight(3); p.circle(x, y, 26 + 6 * pulse); }
          p.noStroke(); p.fill(sel ? (locked ? (r.angles.includes(a) ? C.ok : C.bad) : C.brand) : a % 90 === 0 ? C.mute : C.Z); p.circle(x, y, sel ? 14 : 11);
        });
        pulse = Math.max(0, pulse - 0.06);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(16);
        p.fill(pick === null ? C.mute : C.ink);
        p.text(pick === null ? 'Toca uno de los puntos' : `elegiste θ = ${pick}°`, W / 2, cy + R + 36);
        if (locked && !r.angles.includes(pick)) { p.fill(C.ok); p.textSize(13); p.text(`era ${r.angles.map(a => `${a}°`).join(' o ')}`, W / 2, cy + R + 58); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        let best = null, bd = 26;
        POINTS.forEach(a => { const [x, y] = pt(a), d = Math.hypot(p.mouseX - x, p.mouseY - y); if (d < bd) { bd = d; best = a; } });
        if (best === null) return;
        st.picks[cur] = best; pulse = 1; api.sfx?.tap?.(); ready();
        return false;
      };
    }, 1.32);

    return {
      loaded: m.ready,
      getState: () => ({ picks: [...st.picks] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, POINTS };
})();
