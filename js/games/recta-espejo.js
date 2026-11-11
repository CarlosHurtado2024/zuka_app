// La recta del espejo (Álgebra 1.1, enteros y opuestos): una recta de enteros con un espejo en el 0. Cada ronda
// describe un número con palabras o con notación («el opuesto de 5», «−(−3)», «el número que sumado con 6 da 0»).
// Se toca o se arrastra sobre la recta para poner el punto (se ajusta a enteros) y al otro lado del espejo aparece
// su reflejo (sin número, para que el estudiante lo razone). Califica el entero exacto.
// params = { min, max, rounds: [{ text, value }] }   state = { xs: [entero | null] }

GAMES['recta-espejo'] = (() => {
  const snap = (v, min, max) => Math.min(max, Math.max(min, Math.round(v)));
  const neg = v => String(v).replace('-', '−');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.xs?.[i] === r.value);
    const solution = params.rounds.map(r => `${r.text}: ${neg(r.value)}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, min = params.min, max = params.max;
    const st = { xs: R.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], line = null, drag = false, t = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      line = { x0: 22, x1: w - 22, y: h * 0.66 };
    }
    const X = v => line.x0 + (v - min) / (max - min) * (line.x1 - line.x0);
    const V = px => min + (px - line.x0) / (line.x1 - line.x0) * (max - min);
    function setX(px) { st.xs[cur] = snap(V(px), min, max); api.ready(st.xs.every(x => x != null)); }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        t += 0.05;
        const r = R[cur], x = st.xs[cur], ok = x === r.value;
        drawTabs(p, C, tabs, cur, i => (locked ? (st.xs[i] === R[i].value ? C.ok : C.bad) : i === cur ? C.brand : st.xs[i] != null ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        p.text('Pon en la recta:', W / 2, 58);
        p.fill(C.ink); p.textStyle(p.BOLD); fitText(p, r.text, W / 2, 84, W - 28, 20);
        // Espejo en el 0
        const z = X(0);
        p.stroke(C.R); p.strokeWeight(2); p.drawingContext.setLineDash([5, 5]); p.line(z, line.y - 70, z, line.y + 9); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.R); p.textSize(11); p.textStyle(p.BOLD); p.text('espejo', z, line.y - 80);
        // Recta y marcas
        p.stroke(C.ink); p.strokeWeight(2.5); p.line(line.x0 - 6, line.y, line.x1 + 6, line.y);
        const step = (line.x1 - line.x0) / (max - min) < 20 ? 2 : 1;
        for (let k = min; k <= max; k++) {
          p.stroke(k === 0 ? C.ink : C.line); p.strokeWeight(k === 0 ? 2.5 : 1.5); p.line(X(k), line.y - 7, X(k), line.y + 7);
          if (k % step === 0) { p.noStroke(); p.fill(k < 0 ? C.Z : k > 0 ? C.N : C.ink); p.textStyle(p.NORMAL); p.textSize(11); p.text(neg(k), X(k), line.y + 20); }
        }
        if (x != null) {
          // Reflejo (el opuesto), tenue, al otro lado del espejo
          if (x !== 0) {
            const c = p.color(C.mute); c.setAlpha(140);
            p.noFill(); p.stroke(c); p.strokeWeight(2); p.circle(X(-x), line.y, 16);
            p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL);
            const tw = p.textWidth('reflejo') / 2 + 4;
            p.text('reflejo', Math.min(W - tw, Math.max(tw, X(-x))), line.y - 24);
            p.stroke(c); p.strokeWeight(1); p.drawingContext.setLineDash([3, 4]);
            p.noFill(); p.arc(z, line.y, Math.abs(X(x) - X(-x)), 50, Math.PI, 2 * Math.PI); p.drawingContext.setLineDash([]);
          }
          p.noStroke(); p.fill(locked ? (ok ? C.ok : C.bad) : C.brand); p.circle(X(x), line.y, 18 + 2 * Math.sin(t));
          p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(15); p.text(neg(x), X(x), line.y - 46);
        }
        p.noStroke(); p.textStyle(p.NORMAL); p.textSize(12);
        if (locked && !ok) { p.noFill(); p.stroke(C.ok); p.strokeWeight(3); p.circle(X(r.value), line.y, 22); p.noStroke(); }
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`Era ${neg(r.value)}`, W / 2, H - 16); }
        else { p.fill(C.mute); p.text('Toca o arrastra sobre la recta', W / 2, H - 16); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (Math.abs(p.mouseY - line.y) < 60) { drag = true; setX(p.mouseX); api.sfx?.tap?.(); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setX(p.mouseX); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ xs: [...st.xs] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, snap };
})();
