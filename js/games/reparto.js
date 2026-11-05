// Reparto proporcional (lección 1.2): una barra representa el total; dos separadores arrastrables
// la parten en tres montos que se ven en vivo. Correcto si cada parte queda en la razón pedida.
// params = { total, parts: [p1, p2, p3], tol }   state = { cuts: [fracción, fracción] } (0–1, en cualquier orden)

GAMES['reparto'] = (() => {
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const shares = params => { const s = params.parts.reduce((a, b) => a + b, 0); return params.parts.map(p => p / s); };
  const amounts = (cuts, total) => { const [a, b] = [...cuts].sort((x, y) => x - y); return [a * total, (b - a) * total, (1 - b) * total]; };

  function grade(state, params) {
    const want = shares(params).map(s => s * params.total), got = amounts(state.cuts, params.total);
    const ok = got.every((g, i) => Math.abs(g - want[i]) <= params.tol * params.total);
    return { ok, solution: `${params.parts.join(' + ')} = ${params.parts.reduce((a, b) => a + b, 0)} partes; cada parte vale ${fmt(params.total / params.parts.reduce((a, b) => a + b, 0))}: ${want.map(fmt).join(' / ')}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { cuts: [1 / 3, 2 / 3] };
    let locked = false, W = 0, H = 0, bar = null, drag = -1;
    const COLS = [C.Q, C.N, C.R];

    function layout(w, h) { W = w; H = h; bar = { x: 16, y: h * 0.42, w: w - 32, h: 44 }; }
    const cx = f => bar.x + f * bar.w;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const cuts = [...st.cuts].sort((a, b) => a - b), got = amounts(st.cuts, params.total);
        const want = shares(params);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text(`Reparte ${fmt(params.total)} en la razón ${params.parts.join(' : ')}`, W / 2, 10);
        p.fill(C.ink); p.textSize(12); p.text('Arrastra los separadores', W / 2, 30);
        // Barra en tres tramos.
        const edges = [0, ...cuts, 1];
        for (let i = 0; i < 3; i++) {
          const x0 = cx(edges[i]), x1 = cx(edges[i + 1]);
          const good = Math.abs(got[i] - want[i] * params.total) <= params.tol * params.total;
          p.noStroke(); p.fill(COLS[i]); p.rect(x0, bar.y, x1 - x0, bar.h, i === 0 ? 10 : 0, i === 2 ? 10 : 0, i === 2 ? 10 : 0, i === 0 ? 10 : 0);
          // Monto y porcentaje de cada tramo, debajo (alternando alturas si el tramo es angosto).
          p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.TOP); p.textSize(13);
          const ty = bar.y + bar.h + 10 + (i % 2) * 34;
          p.text(fmt(got[i]), (x0 + x1) / 2, ty);
          p.fill(C.mute); p.textSize(11); p.text(`${Math.round((edges[i + 1] - edges[i]) * 100)} %`, (x0 + x1) / 2, ty + 16);
        }
        if (locked) {
          // Cortes correctos marcados en verde.
          let acc = 0; want.slice(0, 2).forEach(s => { acc += s; p.stroke(C.ok); p.strokeWeight(3); p.line(cx(acc), bar.y - 14, cx(acc), bar.y + bar.h + 6); });
        }
        // Separadores.
        st.cuts.forEach((f, i) => {
          const x = cx(f);
          p.stroke(i === drag ? C.ink : C.brand); p.strokeWeight(4); p.line(x, bar.y - 8, x, bar.y + bar.h + 8);
          p.noStroke(); p.fill(i === drag ? C.ink : C.brand); p.circle(x, bar.y - 16, 22);
          p.fill(C.bg); p.textAlign(p.CENTER, p.CENTER); p.textSize(12); p.text('⇔', x, bar.y - 15);
        });
        // Marcas de referencia en la barra: décimos.
        p.stroke(C.bg); p.strokeWeight(1);
        for (let k = 1; k < 10; k++) p.line(cx(k / 10), bar.y + bar.h - 6, cx(k / 10), bar.y + bar.h);
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP);
        p.text(`Partes: ${params.parts.join(' + ')} = ${params.parts.reduce((a, b) => a + b, 0)} · ¿cuánto vale una parte?`, W / 2, H - 22);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (Math.abs(p.mouseY - (bar.y + bar.h / 2)) > 40) return;
        drag = st.cuts.map((f, i) => [Math.abs(p.mouseX - cx(f)), i]).sort((a, b) => a[0] - b[0])[0][1];
        api.sfx?.tap?.();
        return false;
      };
      p.mouseDragged = () => {
        if (drag < 0) return;
        // Ajuste fino al 0.5 % para que los montos salgan redondos.
        st.cuts[drag] = Math.round(p.constrain((p.mouseX - bar.x) / bar.w, 0, 1) * 200) / 200;
        return false;
      };
      p.mouseReleased = () => { if (drag >= 0) { drag = -1; api.ready(true); return false; } };
    }, 0.72);

    return {
      loaded: m.ready,
      getState: () => ({ cuts: [...st.cuts] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
