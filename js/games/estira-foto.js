// Estira la foto (Álgebra, razones). Una foto de w0 × h0 se debe ampliar (o reducir) a un ancho nuevo sin
// deformarla. El ancho ya está puesto; se arrastra el borde de abajo (o − / +) para fijar el alto. El dibujo se
// estira con el marco: solo si ancho : alto es la misma razón que la original el zorrito sale bien; si se suma lo
// mismo a los dos lados, sale aplastado o alargado.
// params = { rounds: [{ w0, h0, w, h }], step, max }   state = { hs: [alto | null por ronda] }

GAMES['estira-foto'] = (() => {
  const okRound = (h, r) => typeof h === 'number' && Math.abs(h - r.h) < 1e-9;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.hs?.[i], r));
    const solution = params.rounds.map(r => `${numTxt(r.w0)} : ${numTxt(r.h0)} = ${numTxt(r.w)} : ${String(r.h)}`).join(' · ');
    return { ok, solution };
  }

  // El dibujo en las unidades de la foto original (w0 × h0): cielo, colina, sol y la cara del zorrito.
  function picture(p, C, w0, h0) {
    const k = Math.min(w0, h0);
    p.noStroke(); p.fill(C.Z); p.rect(0, 0, w0, h0);
    p.fill(C.Q); p.rect(0, h0 * 0.8, w0, h0 * 0.2);
    p.fill(C.N); p.circle(w0 * 0.84, h0 * 0.16, k * 0.22);
    const cx = w0 / 2, cy = h0 * 0.52, r = k * 0.3;
    p.fill('#f08a3c');
    p.triangle(cx - r * 0.95, cy - r * 0.35, cx - r * 0.75, cy - r * 1.45, cx - r * 0.15, cy - r * 0.85);
    p.triangle(cx + r * 0.95, cy - r * 0.35, cx + r * 0.75, cy - r * 1.45, cx + r * 0.15, cy - r * 0.85);
    p.circle(cx, cy, 2 * r);
    p.fill('#fff3e6'); p.ellipse(cx, cy + r * 0.38, r * 1.1, r * 0.8);
    p.fill('#1b1b2b'); p.circle(cx - r * 0.38, cy - r * 0.12, r * 0.26); p.circle(cx + r * 0.38, cy - r * 0.12, r * 0.26);
    p.circle(cx, cy + r * 0.2, r * 0.22);
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, STEP = params.step || 0.5, MAX = params.max || 12;
    const hs = R.map(r => r.h0), touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], B = {}, G = null, drag = false;

    function layout(w, h) {
      W = w; H = h; tabs = roundTabs(R.length, w);
      B = { minus: { x: 12, y: h - 46, w: 44, h: 36 }, plus: { x: w - 56, y: h - 46, w: 44, h: 36 } };
    }
    const geo = () => {
      const r = R[cur], top = 120, room = H - top - 64;
      const u = Math.min((W - 60) / Math.max(r.w, 1), room / MAX);
      return { u, x: (W - r.w * u) / 2, top };
    };
    const snap = v => Math.min(MAX, Math.max(STEP, Math.round(v / STEP) * STEP));
    function setH(v) {
      if (locked) return;
      hs[cur] = snap(v); touched[cur] = true; api.ready(touched.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], h = hs[cur], good = okRound(h, r);
        G = geo();
        const { u, x, top } = G;
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(hs[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Q : C.line));
        // Enunciado y foto original en miniatura
        p.textAlign(p.LEFT, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `Ampliar a ${numTxt(r.w)} de ancho`, 14, 56, W - 96, 14);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'sin deformar la foto', 14, 76, W - 96, 12);
        const tk = Math.min(60 / r.w0, 44 / r.h0), tw = r.w0 * tk, th = r.h0 * tk, tx = W - 14 - tw, ty = 46;
        p.push(); p.translate(tx, ty); p.scale(tk, tk); picture(p, C, r.w0, r.h0); p.pop();
        p.noFill(); p.stroke(C.line); p.strokeWeight(1); p.rect(tx, ty, tw, th);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textSize(10);
        p.text(`original ${numTxt(r.w0)} × ${numTxt(r.h0)}`, Math.min(tx + tw / 2, W - 50), ty + th + 2);
        // Cuadrícula de unidades y la foto estirada
        p.stroke(C.line); p.strokeWeight(0.6);
        for (let k = 0; k <= r.w; k++) p.line(x + k * u, top, x + k * u, top + MAX * u);
        for (let k = 0; k <= MAX; k++) p.line(x, top + k * u, x + r.w * u, top + k * u);
        p.push(); p.translate(x, top); p.scale((r.w * u) / r.w0, (h * u) / r.h0); picture(p, C, r.w0, r.h0); p.pop();
        p.noFill(); p.stroke(locked ? (good ? C.ok : C.bad) : C.brand); p.strokeWeight(2.5); p.rect(x, top, r.w * u, h * u);
        if (!locked) { p.noStroke(); p.fill(C.brand); p.rect(x + (r.w * u) / 2 - 18, top + h * u - 4, 36, 8, 4); }
        // Medidas
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM); p.textSize(12);
        p.text(numTxt(r.w), x + (r.w * u) / 2, top - 2);
        p.textAlign(p.RIGHT, p.CENTER); p.text(String(h), x - 4, top + (h * u) / 2);
        // Lectura y botones
        p.textAlign(p.CENTER, p.CENTER);
        const msg = locked && !good ? `Era ${String(r.h)} de alto` : `ancho : alto = ${numTxt(r.w)} : ${String(h)}`;
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
        if (G && y > G.top && y < H - 56) { drag = true; setH((y - G.top) / G.u); return false; }
      };
      p.mouseDragged = () => { if (drag && G) { setH((p.mouseY - G.top) / G.u); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ hs: hs.map((h, i) => (touched[i] ? h : null)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
