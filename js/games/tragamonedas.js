// La tragamonedas del factor (Álgebra 1.3, aumentos y descuentos): cada cambio porcentual es multiplicar
// por un factor, 1 + r/100. La máquina tiene cuatro rodillos, × d . d d d: se giran tocando la mitad de
// arriba (sube) o la de abajo (baja) de cada uno. Debajo, un billete de 100 pasa por la máquina y muestra en
// qué se convierte. Ronda ganada cuando el factor es el del cambio pedido (+35 % → ×1.350; −0.5 % → ×0.995).
// params = { rounds: [{ change }] }   state = { reels: [[entero, décimas, centésimas, milésimas]] }

GAMES['tragamonedas'] = (() => {
  const MAXI = 3;
  const factorOf = d => +(d[0] + d[1] / 10 + d[2] / 100 + d[3] / 1000).toFixed(3);
  function reelsFor(change) {
    const f = Math.round((1 + change / 100) * 1000);
    return [Math.floor(f / 1000), Math.floor(f / 100) % 10, Math.floor(f / 10) % 10, f % 10];
  }
  const target = r => +(1 + r.change / 100).toFixed(3);
  const good = (d, r) => !!d && Math.abs(factorOf(d) - target(r)) < 1e-9;
  const pct = c => `${c > 0 ? '+' : '−'}${String(Math.abs(c))} %`;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.reels?.[i], r));
    const solution = params.rounds.map(r => `${pct(r.change)} → ×${target(r).toFixed(3)}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { reels: R.map(() => [1, 0, 0, 0]) };
    const touched = R.map(() => false);
    const anim = R.map(() => [0, 0, 0, 0]);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], reels = [], glow = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      const rw = Math.min(56, (w - 130) / 4), gap = 8, total = 4 * rw + 3 * gap + 18, x0 = w / 2 - total / 2 + 14, y = h * 0.36;
      reels = [0, 1, 2, 3].map(k => ({ x: x0 + k * (rw + gap) + (k >= 1 ? 18 : 0), y, w: rw, h: 110 }));
    }
    function spin(k, d) {
      const dg = st.reels[cur], top = k === 0 ? MAXI + 1 : 10;
      dg[k] = (dg[k] + d + top) % top;
      anim[cur][k] = -d;
      touched[cur] = true; api.ready(touched.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], dg = st.reels[cur], f = factorOf(dg), ok = good(dg, r);
        glow += 0.08;
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.reels[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        p.text('Arma el factor por el que se multiplica:', 14, 56);
        p.fill(r.change > 0 ? C.Q : C.I); p.textStyle(p.BOLD); p.textSize(28); p.text(pct(r.change), 14, 84);

        // Cuerpo de la máquina con luces
        const b0 = reels[0], bx = Math.max(4, b0.x - 50), bw = reels[3].x + reels[3].w + 18 - bx, by = b0.y - 26, bh = b0.h + 52;
        p.stroke(ok ? C.ok : C.R); p.strokeWeight(3); p.fill(C.card); p.rect(bx, by, bw, bh, 18);
        for (let k = 0; k < 9; k++) {
          const on = ok ? (Math.floor(glow * 2) + k) % 2 === 0 : k % 3 === Math.floor(glow) % 3;
          p.noStroke(); p.fill(on ? C.N : C.line); p.circle(bx + 14 + k * (bw - 28) / 8, by + 12, 7);
        }
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(30); p.textAlign(p.CENTER, p.CENTER);
        p.text('×', bx + 28, b0.y + b0.h / 2);
        p.text('.', (reels[0].x + reels[0].w + reels[1].x) / 2, b0.y + b0.h / 2 + 10);
        // Palanca (decorativa)
        const lx = bx + bw + 10;
        if (lx + 12 < W) { p.stroke(C.mute); p.strokeWeight(4); p.line(lx, by + bh * 0.6, lx, by + 10); p.noStroke(); p.fill(C.I); p.circle(lx, by + 8, 16); }
        reels.forEach((b, k) => {
          anim[cur][k] *= 0.75;
          const top = k === 0 ? MAXI + 1 : 10, off = anim[cur][k] * 34;
          p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.bg); p.rect(b.x, b.y, b.w, b.h, 10);
          const ctx = p.drawingContext; ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
          for (let j = -2; j <= 2; j++) {
            const v = ((dg[k] - j) % top + top) % top, y = b.y + b.h / 2 + j * 34 + off;
            p.noStroke(); p.fill(j === 0 ? (k === 0 ? C.N : C.Z) : C.mute); p.textStyle(p.BOLD); p.textSize(j === 0 ? 32 : 20);
            p.text(v, b.x + b.w / 2, y);
          }
          ctx.restore();
          p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL);
          p.text('▲', b.x + b.w / 2, b.y - 10); p.text('▼', b.x + b.w / 2, b.y + b.h + 10);
        });
        // El billete de prueba
        const yb = by + bh + 26;
        p.noStroke(); p.fill(C.mute); p.textSize(12); p.textStyle(p.NORMAL); p.text('Un precio de 100 sale convertido en', W / 2, yb);
        p.fill(ok ? C.ok : C.ink); p.textStyle(p.BOLD); p.textSize(24);
        p.text(String(+(100 * f).toFixed(1)), W / 2, yb + 30);
        p.textSize(12); p.textStyle(p.NORMAL);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`Factor: ×${target(r).toFixed(3)}`, W / 2, H - 16); }
        else { p.fill(C.mute); p.text('Toca arriba o abajo de cada rodillo para girarlo', W / 2, H - 16); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const k = reels.findIndex(b => p.mouseX >= b.x - 3 && p.mouseX <= b.x + b.w + 3 && p.mouseY >= b.y - 22 && p.mouseY <= b.y + b.h + 22);
        if (k >= 0) { spin(k, p.mouseY < reels[k].y + reels[k].h / 2 ? 1 : -1); api.sfx?.tap?.(); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ reels: st.reels.map(d => [...d]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, factorOf, reelsFor };
})();
