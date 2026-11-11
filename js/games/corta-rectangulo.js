// Corta el rectángulo (Álgebra 1.2, propiedad distributiva). Un rectángulo de h × w cuadritos tiene área h · w.
// Se arrastra un corte vertical (salta de cuadrito en cuadrito) para partirlo en dos piezas, y debajo aparece
// h · w = h · k + h · (w − k): la distributiva vista como áreas. La meta de cada ronda es que una de las dos piezas
// tenga el área pedida (una pieza «redonda» que hace fácil la cuenta de cabeza).
// params = { rounds: [{ h, w, piece }] }   state = { cuts: [k | null] }

GAMES['corta-rectangulo'] = (() => {
  const okRound = (k, r) => k != null && k > 0 && k < r.w && (r.h * k === r.piece || r.h * (r.w - k) === r.piece);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.cuts?.[i], r));
    const solution = params.rounds.map(r => {
      const k = r.piece / r.h;
      return `${r.h} · ${r.w} = ${r.h} · ${k} + ${r.h} · ${r.w - k} = ${r.piece} + ${r.h * (r.w - k)} = ${r.h * r.w}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const cuts = R.map(() => null);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, drag = false, bm = null, bp = null;

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      const r = R[cur], u = Math.min((w - 48) / r.w, 150 / r.h);
      box = { x: (w - u * r.w) / 2, y: 112, u, w: u * r.w, h: u * r.h };
      bm = { x: w / 2 - 98, y: h - 62, w: 44, h: 36 }; bp = { x: w / 2 + 54, y: h - 62, w: 44, h: 36 };
    }
    function setCut(px) {
      const r = R[cur];
      cuts[cur] = Math.min(r.w - 1, Math.max(1, Math.round((px - box.x) / box.u)));
      api.ready(cuts.every(k => k != null));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], k = cuts[cur], good = okRound(k, r), b = box;
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(cuts[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : cuts[i] != null ? C.Q : C.line));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `Calcula ${r.h} · ${r.w} partiendo el rectángulo`, W / 2, 56, W - 24, 15);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, `Una de las piezas debe tener área ${r.piece}`, W / 2, 78, W - 24, 12);
        // Piezas
        const kx = k == null ? null : b.x + k * b.u;
        p.noStroke();
        if (k == null) { p.fill(C.card); p.rect(b.x, b.y, b.w, b.h); }
        else {
          const c1 = p.color(C.Q), c2 = p.color(C.N); c1.setAlpha(70); c2.setAlpha(70);
          p.fill(c1); p.rect(b.x, b.y, kx - b.x, b.h); p.fill(c2); p.rect(kx, b.y, b.x + b.w - kx, b.h);
        }
        // Cuadrícula
        p.stroke(C.line); p.strokeWeight(b.u > 7 ? 1 : 0.5);
        for (let i = 1; i < r.w; i++) p.line(b.x + i * b.u, b.y, b.x + i * b.u, b.y + b.h);
        for (let j = 1; j < r.h; j++) p.line(b.x, b.y + j * b.u, b.x + b.w, b.y + j * b.u);
        p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.rect(b.x, b.y, b.w, b.h);
        // Medidas
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13);
        p.text(r.h, b.x - 12, b.y + b.h / 2);
        if (k == null) { p.text(r.w, b.x + b.w / 2, b.y - 12); }
        else {
          p.fill(C.Q); p.text(k, (b.x + kx) / 2, b.y - 12); p.fill(C.N); p.text(r.w - k, (kx + b.x + b.w) / 2, b.y - 12);
          p.stroke(locked ? (good ? C.ok : C.bad) : C.brand); p.strokeWeight(3.5); p.line(kx, b.y - 4, kx, b.y + b.h + 4);
          p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.brand); p.circle(kx, b.y + b.h + 12, 16);
          // Áreas dentro de cada pieza (si caben)
          p.fill(C.ink); p.textSize(12);
          if (kx - b.x > 26) p.text(r.h * k, (b.x + kx) / 2, b.y + b.h / 2);
          if (b.x + b.w - kx > 26) p.text(r.h * (r.w - k), (kx + b.x + b.w) / 2, b.y + b.h / 2);
        }
        // La distributiva
        const y0 = b.y + b.h + 40;
        p.noStroke(); p.textStyle(p.BOLD);
        if (k == null) { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Toca o arrastra sobre el rectángulo para cortarlo', W / 2, y0, W - 24, 12); }
        else {
          p.fill(C.ink); fitText(p, `${r.h} · ${r.w} = ${r.h} · ${k} + ${r.h} · ${r.w - k}`, W / 2, y0, W - 24, 16);
          p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, `= ${r.h * k} + ${r.h * (r.w - k)} = ${r.h * r.w}`, W / 2, y0 + 24, W - 24, 14);
        }
        if (!locked) for (const [bb, t] of [[bm, '−'], [bp, '+']]) {
          p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(bb.x, bb.y, bb.w, bb.h, 9);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(18); p.text(t, bb.x + bb.w / 2, bb.y + bb.h / 2);
        }
        if (!locked) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.text('mover el corte', W / 2, H - 44); }
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `Cortar en ${r.piece / r.h}: pieza de ${r.piece}`, W / 2, H - 30, W - 24, 12); }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(t => hitBox(t, x, y));
        if (tb >= 0) { cur = tb; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const step = d => { const rr = R[cur]; cuts[cur] = Math.min(rr.w - 1, Math.max(1, (cuts[cur] ?? Math.floor(rr.w / 2)) + d)); api.ready(cuts.every(k => k != null)); api.sfx?.tap?.(); };
        if (hitBox(bm, x, y)) { step(-1); return false; }
        if (hitBox(bp, x, y)) { step(1); return false; }
        if (x > box.x - 10 && x < box.x + box.w + 10 && y > box.y - 24 && y < box.y + box.h + 26) { drag = true; setCut(x); api.sfx?.tap?.(); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setCut(p.mouseX); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.6);

    return {
      loaded: m.ready,
      getState: () => ({ cuts: [...cuts] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
