// Corredores dobles (trigonometría, ángulo doble y medio): en una pista circular corren dos atletas que
// salen juntos de 0°. El lento (azul) recorre θ y el rápido (rosa) va siempre al doble, 2θ. Mientras se
// mantiene presionado «Correr» avanzan; al soltar, el lento se detiene en el múltiplo de 15° más cercano
// (− / + ajustan). Hay que frenar cuando se cumpla la condición de la ronda, sobre θ, sobre 2θ o sobre
// cos 2θ y sen 2θ. Al ir hacia atrás desde 2θ aparece el ángulo medio: dos lentos posibles por cada
// rápido. Rondas con pestañas.
// params = { rounds: [{ prompt, fast?, q?, cos2?, sen2?, slowSen?: '+' | '-', slowCos? }] }
// state = { angles: [grados | null] }

GAMES['corredores-dobles'] = (() => {
  const norm = d => ((Math.round(d) % 360) + 360) % 360;
  const quad = d => { const t = norm(d); return t % 90 === 0 ? 0 : Math.floor(t / 90) + 1; };
  const sgn = v => (Math.abs(v) < 1e-9 ? 0 : Math.sign(v));
  function fits(deg, r) {
    const t = norm(deg), rad = t * Math.PI / 180;
    if (r.q != null && quad(t) !== r.q) return false;
    if (r.fast != null && norm(2 * t) !== norm(r.fast)) return false;
    if (r.cos2 != null && Math.abs(Math.cos(2 * rad) - r.cos2) > 1e-6) return false;
    if (r.sen2 != null && Math.abs(Math.sin(2 * rad) - r.sen2) > 1e-6) return false;
    if (r.slowSen && sgn(Math.sin(rad)) !== (r.slowSen === '+' ? 1 : -1)) return false;
    if (r.slowCos && sgn(Math.cos(rad)) !== (r.slowCos === '+' ? 1 : -1)) return false;
    return true;
  }
  const valid = r => Array.from({ length: 24 }, (_, k) => k * 15).filter(a => fits(a, r));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.angles[i] != null && fits(state.angles[i], r));
    return { ok, solution: params.rounds.map(r => `${r.prompt}: θ = ${valid(r).map(a => `${a}°`).join(' o ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { angles: params.rounds.map(() => null) };
    const pos = params.rounds.map(() => 0);          // ángulo continuo mientras corren
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, run = null, minus = null, plus = null, running = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      R = Math.min(w * 0.34, h * 0.24); cx = w / 2; cy = 104 + R + 8;
      const by = h - 54;
      minus = { x: 12, y: by, w: 52, h: 42 }; plus = { x: w - 64, y: by, w: 52, h: 42 }; run = { x: 74, y: by, w: w - 148, h: 42 };
    }
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const pt = (deg, r = R) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
    const settle = () => { pos[cur] = Math.round(pos[cur] / 15) * 15; st.angles[cur] = norm(pos[cur]); api.ready(st.angles.every(a => a !== null)); };
    const f2 = v => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2).replace('-', '−'));

    function runner(p, deg, col, r, label) {
      const [x, y] = pt(deg, r), bob = running ? Math.sin(p.frameCount * 0.6) * 2 : 0;
      p.noStroke(); p.fill(col); p.circle(x, y - 9 + bob, 12);
      p.stroke(col); p.strokeWeight(4); p.line(x, y - 3 + bob, x, y + 8);
      p.strokeWeight(3); const leg = running ? Math.sin(p.frameCount * 0.6) * 5 : 3; p.line(x, y + 8, x - leg, y + 15); p.line(x, y + 8, x + leg, y + 15);
      p.noStroke(); p.fill(col); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      const [lx, ly] = pt(deg, r + (r < R ? -22 : 24)); p.text(label, lx, ly);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        if (running && !locked) { pos[cur] += 75 * (p.deltaTime / 1000); if (pos[cur] >= 360) pos[cur] -= 360; }
        p.background(C.bg);
        const r = params.rounds[cur], a = st.angles[cur], th = pos[cur], good = a !== null && fits(a, r);
        tabs.forEach((t, i) => {
          const v = st.angles[i], col = locked ? (v !== null && fits(v, params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.textSize(15);
        p.text(r.prompt, 12, 44, W - 24, 54);

        // Pista: dos carriles (el lento por dentro, el rápido por fuera) y la línea de salida.
        p.noFill(); p.stroke(C.line); p.strokeWeight(16); p.circle(cx, cy, 2 * R); p.circle(cx, cy, 2 * (R - 26));
        p.stroke(C.bg); p.strokeWeight(1); p.drawingContext.setLineDash([4, 6]); p.circle(cx, cy, 2 * R); p.circle(cx, cy, 2 * (R - 26)); p.drawingContext.setLineDash([]);
        p.stroke(C.ink); p.strokeWeight(3); p.line(cx + R - 40, cy, cx + R + 10, cy);
        p.stroke(C.line); p.strokeWeight(1); p.line(cx - R + 34, cy, cx + R - 40, cy); p.line(cx, cy - R + 34, cx, cy + R - 34);
        // Recorridos.
        p.noFill(); p.strokeWeight(4);
        p.stroke(C.Z + 'aa'); if (th > 0.5) p.arc(cx, cy, 2 * (R - 26), 2 * (R - 26), -th * Math.PI / 180, 0);
        p.stroke(C.I + 'aa'); const t2 = (2 * th) % 360; if (t2 > 0.5) p.arc(cx, cy, 2 * R + 20, 2 * R + 20, -t2 * Math.PI / 180, 0);
        runner(p, 2 * th, locked ? (good ? C.ok : C.bad) : C.I, R, '2θ');
        runner(p, th, locked ? (good ? C.ok : C.bad) : C.Z, R - 26, 'θ');
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); p.text('salida', cx + R - 12, cy + 12);

        // Marcador.
        const rad = th * Math.PI / 180, y0 = cy + R + 34;
        p.textStyle(p.BOLD); p.textSize(16); p.fill(C.Z); p.text(`θ = ${Math.round(th)}°`, W / 2 - 64, y0); p.fill(C.I); p.text(`2θ = ${Math.round(2 * th) % 360}°`, W / 2 + 64, y0);
        p.textSize(13); p.textStyle(p.NORMAL); p.fill(C.ink);
        p.text(`cos 2θ = ${f2(Math.cos(2 * rad))}   ·   sen 2θ = ${f2(Math.sin(2 * rad))}`, W / 2, y0 + 22);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`valía θ = ${valid(r).map(v => `${v}°`).join(' o ')}`, W / 2, y0 + 42); }

        [[minus, '−'], [run, running ? 'corriendo…' : 'mantén: correr'], [plus, '+']].forEach(([b, s]) => {
          const on = b === run && running;
          p.stroke(on ? C.brand : C.line); p.strokeWeight(on ? 3 : 1.5); p.fill(on ? C.brand + '33' : C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(b === run ? 15 : 22); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { if (running) { running = false; settle(); } cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(run, p.mouseX, p.mouseY)) { running = true; return false; }
        if (inside(minus, p.mouseX, p.mouseY)) { pos[cur] = (pos[cur] + 345) % 360; settle(); api.sfx?.tap?.(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { pos[cur] = (pos[cur] + 15) % 360; settle(); api.sfx?.tap?.(); return false; }
      };
      p.mouseReleased = () => { if (!running) return; running = false; settle(); api.sfx?.tap?.(); return false; };
    }, 1.55);

    return {
      loaded: m.ready,
      getState: () => ({ angles: [...st.angles] }),
      lock() { locked = true; if (running) { running = false; settle(); } },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, fits };
})();
