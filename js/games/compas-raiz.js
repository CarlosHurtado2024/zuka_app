// El compás de la raíz (Álgebra 1.1, irracionales en la recta): sobre la recta hay una banderita en √n. Con
// − / + se eligen los catetos a (sobre la recta) y b (hacia arriba) de un rectángulo con esquina en el 0;
// su diagonal mide √(a² + b²). Al tocar «Girar», el compás clavado en el 0 acuesta la diagonal sobre la recta:
// cae justo en la banderita cuando a² + b² = n. Así se construye un irracional exacto con regla y compás.
// params = { rounds: [{ n }], max }   state = { legs: [[a, b] | null] }

GAMES['compas-raiz'] = (() => {
  const fits = (lg, n) => !!lg && lg[0] >= 1 && lg[1] >= 1 && lg[0] * lg[0] + lg[1] * lg[1] === n;
  function legsFor(n, max) {
    for (let a = 1; a <= max; a++) for (let b = a; b <= max; b++) if (a * a + b * b === n) return [a, b];
    return null;
  }
  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.legs?.[i], r.n));
    const solution = params.rounds.map(r => { const l = legsFor(r.n, params.max); return l ? `√${r.n}: ${l[0]}² + ${l[1]}² = ${r.n}` : ''; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, max = params.max;
    const st = { legs: R.map(() => [1, 1]) };
    const swung = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], btns = [], go = null, ang = 0, view = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const top = 70, bottom = h - 120;
      const unit = Math.min((w - 40) / Math.ceil(Math.sqrt(2) * max + 0.6), (bottom - top) / (max + 0.6));
      view = { x0: 22, y0: bottom, u: unit };
      // Dos pares − valor + que ocupan cada uno media fila, con margen entre ellos.
      const bw = 38, y = h - 96, half = (w - 28 - 12) / 2;
      btns = [
        { k: 0, d: -1, x: 14, y, w: bw, h: 34 }, { k: 0, d: 1, x: 14 + half - bw, y, w: bw, h: 34 },
        { k: 1, d: -1, x: 26 + half, y, w: bw, h: 34 }, { k: 1, d: 1, x: w - 14 - bw, y, w: bw, h: 34 },
      ];
      go = { x: 14, y: h - 52, w: w - 28, h: 38 };
    }
    const X = v => view.x0 + v * view.u, Y = v => view.y0 - v * view.u;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], [a, b] = st.legs[cur], d = Math.hypot(a, b), good = fits(st.legs[cur], r.n);
        const full = Math.atan2(b, a);
        ang = swung[cur] ? Math.max(0, ang - 0.05) : full;
        drawTabs(p, C, tabs, cur, i => (locked ? (fits(st.legs[i], R[i].n) ? C.ok : C.bad) : i === cur ? C.brand : swung[i] ? (fits(st.legs[i], R[i].n) ? C.Q : C.Z) : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        p.text('Haz caer el compás en la banderita', 14, 56);

        // Cuadrícula y recta
        const nMax = Math.floor((W - 30 - view.x0) / view.u);
        p.stroke(C.line); p.strokeWeight(0.7);
        for (let x = 0; x <= nMax; x++) p.line(X(x), Y(0), X(x), Y(max));
        for (let y = 0; y <= max; y++) p.line(X(0), Y(y), X(nMax), Y(y));
        p.stroke(C.ink); p.strokeWeight(2.5); p.line(X(0) - 8, Y(0), W - 12, Y(0));
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP);
        for (let x = 0; x <= nMax; x++) p.text(x, X(x), Y(0) + 6);
        // Banderita en √n
        const fx = X(Math.sqrt(r.n));
        p.stroke(C.I); p.strokeWeight(2); p.line(fx, Y(0), fx, Y(0) - 34);
        p.noStroke(); p.fill(C.I); p.triangle(fx, Y(0) - 34, fx + 18, Y(0) - 28, fx, Y(0) - 22);
        p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.BOTTOM); p.text(`√${r.n}`, fx, Y(0) - 36);
        // Rectángulo a × b y su diagonal (girando con el compás)
        const tint = p.color(C.R); tint.setAlpha(45); p.stroke(C.R); p.strokeWeight(2); p.fill(tint);
        p.rect(X(0), Y(b), a * view.u, b * view.u);
        p.noFill(); p.stroke(C.mute); p.strokeWeight(1.2); p.drawingContext.setLineDash([4, 4]);
        p.arc(X(0), Y(0), 2 * d * view.u, 2 * d * view.u, -full, 0); p.drawingContext.setLineDash([]);
        const ex = X(0) + d * view.u * Math.cos(ang), ey = Y(0) - d * view.u * Math.sin(ang);
        p.stroke(good && ang === 0 ? C.ok : C.Q); p.strokeWeight(4); p.line(X(0), Y(0), ex, ey);
        p.noStroke(); p.fill(C.ink); p.circle(X(0), Y(0), 8);
        if (swung[cur] && ang === 0) {
          p.fill(good ? C.ok : C.bad); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER);
          p.text(good ? '¡Justo en la banderita!' : `Cayó en √${a * a + b * b}`, W / 2, 76);
        }
        // Controles
        p.textAlign(p.CENTER, p.CENTER);
        [['a', a, 0], ['b', b, 2]].forEach(([nm, v, k]) => {
          const b1 = btns[k], b2 = btns[k + 1];
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(16); p.text(`${nm} = ${v}`, (b1.x + b1.w + b2.x) / 2, b1.y + b1.h / 2);
          [[b1, '−'], [b2, '+']].forEach(([bt, s]) => { p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.5); p.fill(C.card); p.rect(bt.x, bt.y, bt.w, bt.h, 8); p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(18); p.text(s, bt.x + bt.w / 2, bt.y + bt.h / 2); });
        });
        p.stroke(locked ? C.line : C.brand); p.strokeWeight(2); p.fill(C.card); p.rect(go.x, go.y, go.w, go.h, 10);
        p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(14); p.textStyle(p.BOLD);
        const sol = locked && !good ? legsFor(r.n, max) : null;
        fitText(p, sol ? `Con a = ${sol[0]} y b = ${sol[1]}: ${sol[0]}² + ${sol[1]}² = ${r.n}` : `Girar el compás  (${a}² + ${b}² = ${a * a + b * b})`, W / 2, go.y + go.h / 2, go.w - 16, 14);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; ang = swung[t] ? 0 : Math.atan2(st.legs[t][1], st.legs[t][0]); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const lg = st.legs[cur];
        const bi = btns.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (bi >= 0) { const bt = btns[bi]; lg[bt.k] = Math.min(max, Math.max(1, lg[bt.k] + bt.d)); swung[cur] = false; api.ready(swung.every(Boolean)); api.sfx?.tap?.(); return false; }
        if (hitBox(go, p.mouseX, p.mouseY)) { swung[cur] = true; api.ready(swung.every(Boolean)); api.sfx?.tap?.(); return false; }
      };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ legs: st.legs.map((l, i) => (swung[i] ? [...l] : null)) }),
      lock() { locked = true; swung.fill(true); },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, legsFor };
})();
