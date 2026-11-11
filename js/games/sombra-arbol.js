// La sombra del árbol (Álgebra, proporciones). A la misma hora los rayos del sol llegan paralelos, así que la altura
// de cada cosa y su sombra están en la misma razón: palo / sombra del palo = árbol / sombra del árbol. Se conoce el
// palo y su sombra, y se midió la sombra del árbol (la banderita). Se ajusta la altura del árbol (arrastre o − / +)
// hasta que el rayo que pasa por su copa caiga justo en la banderita.
// params = { rounds: [{ stick, shadow, treeShadow, tree }], step, max }   state = { hs: [altura | null por ronda] }

GAMES['sombra-arbol'] = (() => {
  const okRound = (h, r) => typeof h === 'number' && Math.abs(h - r.tree) < 1e-9;
  const shadowOf = (h, r) => (h * r.shadow) / r.stick;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.hs?.[i], r));
    const solution = params.rounds.map(r => `${numTxt(r.stick)}/${numTxt(r.shadow)} = h/${numTxt(r.treeShadow)} → h = ${String(r.tree)} m`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, STEP = params.step || 0.5, MAX = params.max || 12;
    const hs = R.map(() => STEP * 4), touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = {}, G = null, drag = false;

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      B = { minus: { x: 12, y: h - 46, w: 44, h: 36 }, plus: { x: w - 56, y: h - 46, w: 44, h: 36 } };
    }
    const geo = () => {
      const r = R[cur], ground = H - 96, room = ground - 104;
      const u = Math.min((W - 92) / (r.shadow + r.treeShadow), room / MAX);
      const xs = 22, xt = xs + r.shadow * u + 44;   // hueco para el rótulo del árbol, lejos del rayo del palo
      return { u, ground, xs, xt };
    };
    const snap = v => Math.min(MAX, Math.max(STEP, Math.round(v / STEP) * STEP));
    function setH(v) {
      if (locked) return;
      hs[cur] = snap(v); touched[cur] = true; api.ready(touched.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function dashed(x1, y1, x2, y2) {
        const n = Math.max(1, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 8));
        for (let k = 0; k < n; k += 2) p.line(x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n, x1 + ((x2 - x1) * (k + 1)) / n, y1 + ((y2 - y1) * (k + 1)) / n);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], h = hs[cur], good = okRound(h, r);
        G = geo();
        const { u, ground, xs, xt } = G;
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(hs[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Q : C.line));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, '¿Cuánto mide el árbol?', W / 2, 56, W - 24, 15);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Su sombra termina en la banderita', W / 2, 76, W - 24, 12);
        // Suelo
        p.stroke(C.mute); p.strokeWeight(2); p.line(8, ground, W - 8, ground);
        // Palo y su sombra
        const sEnd = xs + r.shadow * u;
        p.noStroke(); p.fill(C.line); p.rect(xs, ground - 1, r.shadow * u, 5, 2);
        p.stroke(C.ink); p.strokeWeight(4); p.line(xs, ground, xs, ground - r.stick * u);
        p.stroke(C.N); p.strokeWeight(1.5); dashed(xs, ground - r.stick * u, sEnd, ground);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(11);
        p.textAlign(p.CENTER, p.BOTTOM); p.text(`${numTxt(r.stick)} m`, Math.max(xs, 18), ground - r.stick * u - 5);
        p.textAlign(p.CENTER, p.TOP); p.fill(C.mute); p.text(`${numTxt(r.shadow)} m`, xs + (r.shadow * u) / 2, ground + 8);
        // Banderita: donde termina la sombra medida del árbol
        const fx = xt + r.treeShadow * u;
        p.stroke(C.ink); p.strokeWeight(1.5); p.line(fx, ground, fx, ground - 16);
        p.noStroke(); p.fill(C.bad); p.triangle(fx, ground - 16, fx + 10, ground - 12.5, fx, ground - 9);
        p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.text(`sombra: ${numTxt(r.treeShadow)} m`, (xt + fx) / 2, ground + 8);
        // Árbol con la altura elegida y la sombra que tendría
        const top = ground - h * u, end = xt + shadowOf(h, r) * u;
        p.fill(C.line); p.rect(xt, ground - 1, Math.max(0, Math.min(end, W - 6) - xt), 5, 2);
        p.stroke('#8a5a2b'); p.strokeWeight(5); p.line(xt, ground, xt, top + Math.min(14, h * u * 0.35));
        const d = Math.max(16, Math.min(34, h * u * 0.45));
        p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.Q); p.circle(xt, top + d / 2, d);
        p.stroke(C.N); p.strokeWeight(1.5); const x2 = Math.min(end, W - 6);   // si la sombra se sale del lienzo, el rayo se corta en el borde
        dashed(xt, top, x2, top + ((x2 - xt) * (h * u)) / Math.max(1e-6, end - xt));
        // Rótulo a la izquierda del tronco: el rayo sale hacia la derecha y no lo tapa.
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.RIGHT, p.CENTER); p.textSize(12);
        p.text(`${String(h)} m`, xt - Math.max(9, d / 2 + 3), ground - Math.max(h * u / 2, 10));
        // Lectura y botones
        p.textAlign(p.CENTER, p.CENTER);
        const msg = locked && !good ? `Medía ${String(r.tree)} m` : `árbol: ${String(h)} m`;
        p.fill(locked ? (good ? C.ok : C.bad) : C.ink); fitText(p, msg, W / 2, H - 28, W - 132, 14);
        for (const [b, t] of [[B.minus, '−'], [B.plus, '+']]) {
          p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
          p.noStroke(); p.fill(C.ink); p.textSize(20); p.text(t, b.x + b.w / 2, b.y + b.h / 2 - 1);
        }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; drag = false; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(B.minus, x, y)) { setH(hs[cur] - STEP); api.sfx?.tap?.(); return false; }
        if (hitBox(B.plus, x, y)) { setH(hs[cur] + STEP); api.sfx?.tap?.(); return false; }
        if (G && y > 88 && y < G.ground && Math.abs(x - G.xt) < 40) { drag = true; setH((G.ground - y) / G.u); return false; }
      };
      p.mouseDragged = () => { if (drag && G) { setH((G.ground - p.mouseY) / G.u); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ hs: hs.map((h, i) => (touched[i] ? h : null)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, shadowOf };
})();
