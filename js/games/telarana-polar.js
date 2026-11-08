// La telaraña polar (trigonometría, producto y cociente de complejos): dos flechas z₁ (cian) y z₂
// (rosa) salen del centro de una telaraña. Los hilos circulares son módulos candidatos (el correcto y
// trampas como r₁ + r₂) y los rayos van cada 15°. Se arrastra la araña al nudo del producto z₁·z₂ o del
// cociente z₁/z₂: módulos multiplicados (o divididos) y ángulos sumados (o restados). Rondas con pestañas.
// params = { rounds: [{ op: '×' | '÷', z1: { r, deg }, z2: { r, deg } }] }   state = { picks: [{ r, deg } | null] }

GAMES['telarana-polar'] = (() => {
  const norm = d => ((Math.round(d) % 360) + 360) % 360;
  const round6 = v => Math.round(v * 1e6) / 1e6;
  function target(r) {
    const mul = r.op === '×';
    return { r: round6(mul ? r.z1.r * r.z2.r : r.z1.r / r.z2.r), deg: norm(mul ? r.z1.deg + r.z2.deg : r.z1.deg - r.z2.deg) };
  }
  // Hilos: el módulo correcto y las trampas típicas, sin repetir.
  function rings(r) {
    const t = target(r).r, a = r.z1.r, b = r.z2.r;
    // Trampas cercanas al correcto (entre t/4 y 4t) para que los hilos no se amontonen en el centro.
    const c = [a + b, Math.abs(a - b), a * b, a / b, b / a, a, b].map(round6).filter(v => v > 0.05 && v >= t / 4 && v <= 4 * t && Math.abs(v - t) > 1e-6);
    const out = [...new Set([t, ...c])];
    for (const extra of [round6(2 * t), round6(t / 2)]) if (out.length < 3 && !out.includes(extra)) out.push(extra);
    return out.sort((x, y) => x - y).slice(0, 6);
  }
  const fmt = v => (Number.isInteger(v) ? String(v) : String(+v.toFixed(2)));
  const okOne = (pk, r) => !!pk && Math.abs(pk.r - target(r).r) < 1e-6 && norm(pk.deg) === target(r).deg;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okOne(state.picks[i], r));
    const solution = params.rounds.map(r => { const t = target(r); return `z₁ ${r.op} z₂ = ${fmt(t.r)} cis ${t.deg}°`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { picks: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, drag = false, spider = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.44, (h - 200) / 2); cx = w / 2; cy = 104 + R;
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    // Los hilos se reparten parejo en pantalla (el i-ésimo a (i + 1)/n del radio) con su valor real escrito;
    // entre hilos se interpola, así que las flechas z₁ y z₂ quedan bien ordenadas aunque su módulo no sea un hilo.
    const maxR = r => Math.max(...rings(r)) * 1.08;
    function scr(r, mod) {
      const v = rings(r), n = v.length, xs = [0, ...v], ys = [0, ...v.map((_, i) => (i + 1) / (n + 0.4) * R)];
      for (let i = 1; i < xs.length; i++) if (mod <= xs[i]) return ys[i - 1] + (ys[i] - ys[i - 1]) * (mod - xs[i - 1]) / (xs[i] - xs[i - 1]);
      return Math.min(R * 1.04, ys[n] + (mod - xs[n]) / xs[n] * (ys[n] - ys[n - 1]));
    }
    const P = (r, mod, deg) => { const d = scr(r, mod), a = deg * Math.PI / 180; return [cx + d * Math.cos(a), cy - d * Math.sin(a)]; };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function arrow(x0, y0, x1, y1, col) {
        p.stroke(col); p.strokeWeight(4); p.line(x0, y0, x1, y1);
        const a = Math.atan2(y1 - y0, x1 - x0); p.noStroke(); p.fill(col);
        p.triangle(x1, y1, x1 - 12 * Math.cos(a - 0.4), y1 - 12 * Math.sin(a - 0.4), x1 - 12 * Math.cos(a + 0.4), y1 - 12 * Math.sin(a + 0.4));
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], pk = st.picks[cur], good = okOne(pk, r);
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.picks[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.picks[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        const ask = `z₁ = ${fmt(r.z1.r)} cis ${r.z1.deg}°   ${r.op}   z₂ = ${fmt(r.z2.r)} cis ${r.z2.deg}°`;
        let ts = 16; p.textSize(ts); while (p.textWidth(ask) > W - 16 && ts > 10) p.textSize(--ts);
        p.fill(C.ink); p.text(ask, W / 2, 56);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(`lleva la araña al nudo de z₁ ${r.op} z₂`, W / 2, 78);

        // Telaraña: rayos cada 15° e hilos en los módulos candidatos.
        for (let d = 0; d < 360; d += 15) { const [x, y] = P(r, maxR(r), d); p.stroke(C.line); p.strokeWeight(d % 90 ? 1 : 2); p.line(cx, cy, x, y); }
        rings(r).forEach(v => {
          p.noFill(); p.stroke(C.mute + '99'); p.strokeWeight(1.5); p.beginShape();
          for (let d = 0; d <= 360; d += 15) { const [x, y] = P(r, v, d); const sag = 0.06 * v; const [mx, my] = P(r, v - sag, d + 7.5); p.vertex(x, y); if (d < 360) p.quadraticVertex(mx, my, ...P(r, v, d + 15)); }
          p.endShape();
          const [lx, ly] = P(r, v, 82); p.noStroke(); p.fill(C.mute); p.textSize(10); p.text(fmt(v), lx + 8, ly);
        });
        // Las dos flechas.
        arrow(cx, cy, ...P(r, r.z1.r, r.z1.deg), C.Z);
        arrow(cx, cy, ...P(r, r.z2.r, r.z2.deg), C.I);
        const lab = (mod, deg) => { const [x, y] = P(r, mod, deg), a = deg * Math.PI / 180; return [x + 14 * Math.cos(a), y - 14 * Math.sin(a)]; };
        const [l1x, l1y] = lab(r.z1.r, r.z1.deg), [l2x, l2y] = lab(r.z2.r, r.z2.deg);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(13); p.fill(C.Z); p.text('z₁', l1x, l1y); p.fill(C.I); p.text('z₂', l2x, l2y);
        // La araña.
        const sp = pk ? P(r, pk.r, pk.deg) : [cx + R + 4, cy + 26];
        spider = sp;
        const col = locked ? (good ? C.ok : C.bad) : C.N;
        p.stroke(col); p.strokeWeight(2);
        for (let j = 0; j < 4; j++) { const a = -0.9 + j * 0.6; p.line(sp[0], sp[1], sp[0] + 14 * Math.cos(a), sp[1] + 14 * Math.sin(a)); p.line(sp[0], sp[1], sp[0] - 14 * Math.cos(a), sp[1] + 14 * Math.sin(a)); }
        p.noStroke(); p.fill(col); p.ellipse(sp[0], sp[1], 14, 16);
        if (locked && !good) { const t = target(r), [gx, gy] = P(r, t.r, t.deg); p.noFill(); p.stroke(C.ok); p.strokeWeight(3); p.circle(gx, gy, 22); }

        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.fill(pk ? C.ink : C.mute);
        const msg = pk ? `araña en ${fmt(pk.r)} cis ${pk.deg}°` : 'arrastra la araña dorada a un nudo';
        let fs = 16; p.textSize(fs); while (p.textWidth(msg) > W - 16 && fs > 10) p.textSize(--fs);
        p.text(msg, W / 2, H - 30);
        if (locked && !good) { const t = target(r); p.fill(C.ok); p.textSize(13); p.text(`era ${fmt(t.r)} cis ${t.deg}°`, W / 2, H - 10); }
      };

      // Suelta en el nudo más cercano (hilo y rayo).
      function snap() {
        const r = params.rounds[cur], dx = p.mouseX - cx, dy = cy - p.mouseY, d = Math.hypot(dx, dy);
        const ring = rings(r).reduce((b, v) => (Math.abs(scr(r, v) - d) < Math.abs(scr(r, b) - d) ? v : b));
        const deg = norm(Math.round(Math.atan2(dy, dx) * 180 / Math.PI / 15) * 15);
        st.picks[cur] = { r: ring, deg }; api.ready(st.picks.every(Boolean));
      }
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (spider && Math.hypot(p.mouseX - spider[0], p.mouseY - spider[1]) < 30) { drag = true; return false; }
        if (Math.hypot(p.mouseX - cx, p.mouseY - cy) < R + 10) { drag = true; snap(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; snap(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.4);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(x => (x ? { ...x } : null)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, target, rings };   // scr (posición en pantalla) es interna
})();
