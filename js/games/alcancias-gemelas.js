// Las alcancías gemelas (Álgebra 1.4, simple contra compuesto): dos alcancías arrancan con el mismo capital.
// La de la derecha crece con interés compuesto a una tasa fija durante n periodos; la de la izquierda, con
// interés simple a la tasa que se elija (deslizador o − / +, de décima en décima). Meta: que al final las dos
// queden al mismo nivel. La tasa simple tiene que ser MAYOR que la compuesta, porque el compuesto gana
// interés sobre el interés: ((1 + r)ⁿ − 1)/n.
// params = { rounds: [{ C, r, n }], tol, max }   state = { rates: [tasa % | null] }

GAMES['alcancias-gemelas'] = (() => {
  const equivalent = (r, n) => (((1 + r / 100) ** n - 1) / n) * 100;
  const near = (x, r, tol) => x != null && Math.abs(x - equivalent(r.r, r.n)) <= tol + 1e-9;
  const fmt = v => { const r = +v.toFixed(2); return Number.isInteger(r) ? String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(r); };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => near(state.rates?.[i], r, params.tol));
    const solution = params.rounds.map(r => `${r.r} % compuesto en ${r.n} periodos ≈ ${fmt(+equivalent(r.r, r.n).toFixed(2))} % simple`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, max = params.max ?? 40, step = 0.1;
    const st = { rates: R.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], jars = [], slider = null, minus = null, plus = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const jw = Math.min(110, (w - 60) / 2);
      jars = [{ x: w * 0.28 - jw / 2, y: 104, w: jw, h: h - 270 }, { x: w * 0.72 - jw / 2, y: 104, w: jw, h: h - 270 }];
      slider = { x0: 24, x1: w - 24, y: h - 104 };
      minus = { x: 14, y: h - 56, w: 64, h: 38 }; plus = { x: w - 78, y: h - 56, w: 64, h: 38 };
    }
    const setRate = v => { st.rates[cur] = Math.min(max, Math.max(0, Math.round(v / step) * step)); st.rates[cur] = +st.rates[cur].toFixed(1); api.ready(st.rates.every(x => x != null)); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function jar(b, amounts, col, title, sub) {
        const top = amounts[amounts.length - 1], scaleTop = Math.max(...amounts, R[cur].C * (1 + max * R[cur].n / 100)) * 1.02;
        const Yv = v => b.y + b.h - (v / scaleTop) * b.h;
        p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 6, 6, 22, 22);
        // Capas: una por periodo (la primera es el capital)
        for (let k = amounts.length - 1; k >= 0; k--) {
          const c = p.color(col); c.setAlpha(k === 0 ? 90 : 120 + 120 * k / amounts.length);
          p.noStroke(); p.fill(c); p.rect(b.x + 4, Yv(amounts[k]), b.w - 8, b.y + b.h - 4 - Yv(amounts[k]), 4, 4, 18, 18);
        }
        p.stroke(C.ink); p.strokeWeight(2); p.line(b.x - 6, Yv(top), b.x + b.w + 6, Yv(top));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM); fitText(p, fmt(top), b.x + b.w / 2, Yv(top) - 5, b.w + 30, 14);
        p.fill(col); p.textSize(13); p.textAlign(p.CENTER, p.TOP); p.text(title, b.x + b.w / 2, b.y + b.h + 8);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); fitText(p, sub, b.x + b.w / 2, b.y + b.h + 32, b.w + 40, 11);
        return Yv(top);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], x = st.rates[cur], ok = near(x, r, params.tol);
        drawTabs(p, C, tabs, cur, i => (locked ? (near(st.rates[i], R[i], params.tol) ? C.ok : C.bad) : i === cur ? C.brand : st.rates[i] != null ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.TOP);
        p.text(`Las dos empiezan con ${fmt(r.C)} y pasan ${r.n} periodos. Elige la tasa simple que las iguala.`, 14, 48, W - 28, 40);
        const comp = Array.from({ length: r.n + 1 }, (_, k) => r.C * (1 + r.r / 100) ** k);
        const simp = Array.from({ length: r.n + 1 }, (_, k) => r.C * (1 + (x ?? 0) * k / 100));
        const ys = jar(jars[0], simp, C.Z, 'Simple', x == null ? 'tasa: ?' : `tasa: ${String(x.toFixed(1))} %`);
        const yc = jar(jars[1], comp, C.R, 'Compuesto', `tasa: ${String(r.r)} %`);
        if (x != null) { p.stroke(ok ? C.ok : C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 5]); p.line(jars[0].x + jars[0].w, ys, jars[1].x, yc); p.drawingContext.setLineDash([]); }
        // Deslizador de la tasa simple
        const sx = v => slider.x0 + (v / max) * (slider.x1 - slider.x0);
        p.stroke(C.line); p.strokeWeight(4); p.line(slider.x0, slider.y, slider.x1, slider.y);
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.TOP);
        for (let k = 0; k <= max; k += 10) p.text(`${k} %`, sx(k), slider.y + 10);
        if (x != null) { p.fill(C.Z); p.stroke(C.ink); p.strokeWeight(2); p.circle(sx(x), slider.y, 22); }
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(20); p.textAlign(p.CENTER, p.CENTER); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(12);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `≈ ${fmt(+equivalent(r.r, r.n).toFixed(2))} % simple`, W / 2, minus.y + 19, W - 170, 12); }
        else { p.fill(ok ? C.ok : C.mute); p.textStyle(ok ? p.BOLD : p.NORMAL); fitText(p, ok ? '¡Mismo nivel!' : '0.1 % por toque', W / 2, minus.y + 19, W - 170, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const d = hitBox(plus, p.mouseX, p.mouseY) ? 1 : hitBox(minus, p.mouseX, p.mouseY) ? -1 : 0;
        if (d) { setRate((st.rates[cur] ?? R[cur].r) + d * step); api.sfx?.tap?.(); return false; }
        if (Math.abs(p.mouseY - slider.y) < 26 && p.mouseX > slider.x0 - 12 && p.mouseX < slider.x1 + 12) { drag = true; setRate((p.mouseX - slider.x0) / (slider.x1 - slider.x0) * max); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setRate((p.mouseX - slider.x0) / (slider.x1 - slider.x0) * max); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ rates: [...st.rates] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, equivalent };
})();
