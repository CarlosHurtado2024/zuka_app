// La barra elástica (Álgebra 1.3, porcentajes): la barra punteada es el 100 % de una cantidad. Hay que
// estirarla o encogerla (arrastre del tirador o − / +, de 1 % en 1 %) hasta lo que pide la ronda: «el 60 %
// más» es estirarla al 160 %, «el 15 % menos» es dejarla en el 85 %, «la quinta parte» es el 20 %. Encima
// se ve el porcentaje y debajo cuánto vale la barra.
// params = { rounds: [{ base, text, pct }], max }   state = { pcts: [p | null] }

GAMES['estira-barra'] = (() => {
  const valueAt = (base, pct) => +(base * pct / 100).toFixed(6);
  const fmt = v => { const r = +v.toFixed(2); return Number.isInteger(r) ? String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(r); };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.pcts?.[i] === r.pct);
    const solution = params.rounds.map(r => `${r.pct} % de ${fmt(r.base)} = ${fmt(valueAt(r.base, r.pct))}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, max = params.max ?? 200;
    const st = { pcts: R.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], bar = null, minus = null, plus = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      bar = { x0: 20, x1: w - 20, y: h * 0.48, h: 46 };
      minus = { x: 14, y: h - 52, w: 64, h: 38 }; plus = { x: w - 78, y: h - 52, w: 64, h: 38 };
    }
    const X = pct => bar.x0 + (pct / max) * (bar.x1 - bar.x0);
    function setPct(mx) {
      const v = Math.round((mx - bar.x0) / (bar.x1 - bar.x0) * max);
      st.pcts[cur] = Math.min(max, Math.max(0, v));
      api.ready(st.pcts.every(x => x != null));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], pc = st.pcts[cur] ?? 100, good = st.pcts[cur] === r.pct;
        drawTabs(p, C, tabs, cur, i => (locked ? (st.pcts[i] === R[i].pct ? C.ok : C.bad) : i === cur ? C.brand : st.pcts[i] != null ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(17); p.textAlign(p.LEFT, p.TOP);
        p.text(r.text, 14, 50, W - 28, 50);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        p.text(`La barra punteada es el 100 % = ${fmt(r.base)}`, 14, 104);

        // Regla de porcentajes
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = 0; k <= max; k += 10) {
          const big = k % 50 === 0, x = X(k);
          p.line(x, bar.y - bar.h / 2 - (big ? 14 : 7), x, bar.y - bar.h / 2 - 2);
          if (big) { p.noStroke(); p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.BOTTOM); p.text(`${k}%`, x, bar.y - bar.h / 2 - 15); p.stroke(C.line); }
        }
        // El 100 % de referencia y la barra elástica
        const col = locked ? (good ? C.ok : C.bad) : pc > 100 ? C.Q : pc < 100 ? C.I : C.R;
        p.noStroke(); p.fill(col); p.rect(bar.x0, bar.y - bar.h / 2, Math.max(0, X(pc) - bar.x0), bar.h, 10);
        p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.drawingContext.setLineDash([6, 5]);
        p.rect(bar.x0, bar.y - bar.h / 2 - 6, X(100) - bar.x0, bar.h + 12, 12); p.drawingContext.setLineDash([]);
        // Tirador
        p.stroke(C.ink); p.strokeWeight(2); p.fill(C.card); p.rect(X(pc) - 9, bar.y - 30, 18, 60, 8);
        p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(pc) - 3, bar.y - 10, X(pc) - 3, bar.y + 10); p.line(X(pc) + 3, bar.y - 10, X(pc) + 3, bar.y + 10);
        // Lecturas
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
        p.fill(col); p.textStyle(p.BOLD); p.textSize(28); p.text(`${pc} %`, W / 2, bar.y + 62);
        p.fill(C.ink); p.textSize(16); p.text(`vale ${fmt(valueAt(r.base, pc))}`, W / 2, bar.y + 94);
        const diff = pc - 100;
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        p.text(diff === 0 ? 'igual que el original' : diff > 0 ? `el original y ${diff} % más` : `el original menos el ${-diff} %`, W / 2, bar.y + 120);
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(20); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(12); fitText(p, `Era el ${r.pct} %: ${fmt(valueAt(r.base, r.pct))}`, W / 2, minus.y + 19, W - 170, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const d = hitBox(plus, p.mouseX, p.mouseY) ? 1 : hitBox(minus, p.mouseX, p.mouseY) ? -1 : 0;
        if (d) { st.pcts[cur] = Math.min(max, Math.max(0, (st.pcts[cur] ?? 100) + d)); api.ready(st.pcts.every(x => x != null)); api.sfx?.tap?.(); return false; }
        if (Math.abs(p.mouseY - bar.y) < 50 && p.mouseX > bar.x0 - 10 && p.mouseX < bar.x1 + 10) { drag = true; setPct(p.mouseX); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setPct(p.mouseX); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ pcts: [...st.pcts] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, valueAt };
})();
