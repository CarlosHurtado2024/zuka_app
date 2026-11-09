// El semillero del interés (Álgebra 1.4, interés simple y compuesto): cuatro macetas, una por mes (0 a 3).
// Las plantas de los meses 0 y 1 ya crecieron con el dinero de la cuenta; la etiqueta dice si el interés es
// simple o compuesto. Hay que hacer crecer las de los meses 2 y 3 (arrastre o −10, −1, +1, +10): con
// interés simple la planta crece lo mismo cada mes; con compuesto crece cada vez más, porque el interés
// también gana interés.
// params = { rounds: [{ kind: 'simple' | 'compuesto', C, M1, step }] }   state = { hs: [[m2, m3]] }

GAMES['crece-planta'] = (() => {
  function targets(r) {
    if (r.kind === 'simple') { const d = r.M1 - r.C; return [r.M1 + d, r.M1 + 2 * d]; }
    const f = r.M1 / r.C;
    return [+(r.M1 * f).toFixed(2), +(r.M1 * f * f).toFixed(2)];
  }
  const near = (h, r) => { const t = targets(r); return !!h && h.every((v, k) => v != null && Math.abs(v - t[k]) <= (r.step ?? 1) / 2 + 1e-9); };
  const fmt = v => { const r = +v.toFixed(2); return Number.isInteger(r) ? String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(r); };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => near(state.hs?.[i], r));
    const solution = params.rounds.map(r => { const t = targets(r); return `${r.kind}: ${fmt(r.C)}, ${fmt(r.M1)}, ${fmt(t[0])}, ${fmt(t[1])}`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { hs: R.map(() => [null, null]) };
    let locked = false, W = 0, H = 0, cur = 0, sel = 0, tabs = [], pots = [], soil = 0, top = 0, btns = [], drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      top = 96; soil = h - 118;
      const pw = (w - 28) / 4;
      pots = [0, 1, 2, 3].map(k => ({ cx: 14 + pw * (k + 0.5), w: pw }));
      const labels = ['−10', '−1', '+1', '+10'], bw = (w - 28 - 3 * 8) / 4;
      btns = labels.map((t, k) => ({ t, d: [-10, -1, 1, 10][k], x: 14 + k * (bw + 8), y: h - 50, w: bw, h: 36 }));
    }
    const hmax = r => Math.max(...targets(r), r.M1) * 1.25;
    // La escala arranca un poco por debajo del capital para que se note cuánto crece cada mes.
    const hmin = r => r.C * 0.8;
    const Y = (v, r) => soil - Math.max(0, (v - hmin(r)) / (hmax(r) - hmin(r))) * (soil - top);
    const fromY = (y, r) => hmin(r) + (soil - y) / (soil - top) * (hmax(r) - hmin(r));
    const ready = () => api.ready(st.hs.every(h => h.every(v => v != null)));
    function setH(k, v) {
      const r = R[cur], s = r.step ?? 1;
      st.hs[cur][k] = Math.min(Math.floor(hmax(r)), Math.max(Math.ceil(hmin(r)), Math.round(v / s) * s)); ready();
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function plant(cx, v, r, col, active) {
        const y = Y(v, r);
        p.stroke(col); p.strokeWeight(4); p.line(cx, soil, cx, y);
        const leaves = Math.max(1, Math.floor((soil - y) / 26));
        for (let k = 1; k <= leaves; k++) {
          const ly = soil - k * (soil - y) / (leaves + 0.5), dir = k % 2 ? 1 : -1;
          p.noStroke(); p.fill(col); p.ellipse(cx + dir * 9, ly, 16, 8);
        }
        p.noStroke(); p.fill(C.N); p.circle(cx, y, active ? 18 : 14);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM); fitText(p, fmt(v), cx, y - 11, 80, 12);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], hs = st.hs[cur], ok = near(hs, r), t = targets(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (near(st.hs[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.hs[i].every(v => v != null) ? C.Z : C.line));
        p.noStroke(); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        p.fill(r.kind === 'simple' ? C.Z : C.R); p.text(`Interés ${r.kind}`, 14, 56);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); if (!(locked && !ok)) p.text('Haz crecer las plantas de los meses 2 y 3', 14, 76);
        // Macetas
        pots.forEach((pt, k) => {
          const v = k === 0 ? r.C : k === 1 ? r.M1 : hs[k - 2];
          const active = k >= 2 && sel === k - 2 && !locked;
          if (k >= 2 && active) { p.noStroke(); p.fill(C.card); p.rect(pt.cx - pt.w / 2 + 4, top - 10, pt.w - 8, soil - top + 14, 10); }
          if (v != null) {
            const col = k < 2 ? C.Q : locked ? (Math.abs(v - t[k - 2]) <= (r.step ?? 1) / 2 + 1e-9 ? C.ok : C.bad) : C.Q;
            plant(pt.cx, v, r, col, active);
          } else { p.noStroke(); p.fill(C.mute); p.textSize(22); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text('?', pt.cx, (top + soil) / 2); }
          p.noStroke(); p.fill(C.N); p.rect(pt.cx - 22, soil, 44, 26, 0, 0, 8, 8);
          p.fill(C.ink); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text(`mes ${k}`, pt.cx, soil + 30);
        });
        // Cuánto creció cada mes
        p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const vals = [r.C, r.M1, hs[0], hs[1]];
        for (let k = 1; k < 4; k++) if (vals[k] != null && vals[k - 1] != null) {
          const d = vals[k] - vals[k - 1];
          p.fill(C.mute); p.text(`${d >= 0 ? '+' : '−'}${fmt(Math.abs(d))}`, (pots[k - 1].cx + pots[k].cx) / 2, soil + 46);
        }
        btns.forEach(b => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.CENTER, p.CENTER); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2);
        });
        if (locked && !ok) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.LEFT, p.CENTER); p.text(`Meses 2 y 3: ${fmt(t[0])} y ${fmt(t[1])}`, 14, 76); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; sel = 0; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = btns.find(b => hitBox(b, p.mouseX, p.mouseY));
        if (b) { const r = R[cur], v = st.hs[cur][sel] ?? (sel ? st.hs[cur][0] ?? r.M1 : r.M1); setH(sel, v + b.d * (r.step ?? 1)); api.sfx?.tap?.(); return false; }
        const k = pots.findIndex((pt, k) => k >= 2 && Math.abs(p.mouseX - pt.cx) < pt.w / 2 && p.mouseY > top - 20 && p.mouseY < soil + 10);
        if (k >= 2) {
          sel = k - 2;
          // Tocar la maceta (abajo) solo la elige para afinar con los botones; tocar arriba la hace crecer.
          if (p.mouseY < soil - 6) { drag = true; setH(sel, fromY(p.mouseY, R[cur])); }
          api.sfx?.tap?.(); return false;
        }
      };
      p.mouseDragged = () => { if (drag && !locked) { setH(sel, fromY(p.mouseY, R[cur])); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ hs: st.hs.map(h => [...h]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, targets };
})();
