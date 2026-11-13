// Acorrala la raíz (lección 1.1, irracionales): √n vive entre dos enteros; se elige el tramo de una
// décima donde está, luego el de una centésima, luego el de una milésima. Cada marca se pinta según su
// cuadrado: azul si da menos que n, coral si da más; la raíz está donde cambia el color. Cada elección
// abre una lupa sobre ese tramo, y las cifras nunca se acaban. Rondas con pestañas.
// params = { rounds: [{ n }], levels }   state = { picks: [[cifra, cifra, …]] }

GAMES['acorrala-raiz'] = (() => {
  // Las primeras `levels` cifras decimales de √n.
  const digitsOf = (n, levels) => Array.from({ length: levels }, (_, k) => Math.floor(Math.sqrt(n) * 10 ** (k + 1) + 1e-9) % 10);
  const fmt = (v, d) => v.toFixed(d);

  function grade(state, params) {
    const L = params.levels;
    const ok = params.rounds.every((r, i) => (state.picks[i] || []).join() === digitsOf(r.n, L).join());
    const solution = params.rounds.map(r => {
      const lo = Math.floor(Math.sqrt(r.n) * 10 ** L) / 10 ** L;
      return `$${fmt(lo, L)} < \\sqrt{${r.n}} < ${fmt(lo + 10 ** -L, L)}$`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, L = params.levels;
    const st = { picks: params.rounds.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], lines = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(params.rounds.length, w);
      const top = 104, rowH = (h - top - 60) / L;
      lines = Array.from({ length: L }, (_, k) => ({ x0: 22, x1: w - 22, y: top + k * rowH + rowH * 0.42 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.picks.every(pk => pk.length === L));
    // Extremo izquierdo del tramo que se ve en el nivel k (según lo elegido arriba).
    const loAt = (n, picks, k) => Math.floor(Math.sqrt(n)) + picks.slice(0, k).reduce((s, d, j) => s + d * 10 ** -(j + 1), 0);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const n = params.rounds[cur].n, picks = st.picks[cur], want = digitsOf(n, L);
        tabs.forEach((t, i) => {
          const ok = st.picks[i].join() === digitsOf(params.rounds[i].n, L).join();
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : st.picks[i].length ? C.Z : C.line;
          // Fichas como las de las rondas, con la raíz de cada una.
          const plain = col === C.line;
          drawTile(p, C, t, `√${params.rounds[i].n}`, { fill: plain ? C.card : col, ink: plain ? C.mute : undefined, r: 8, lift: 0, size: 13, ring: i === cur ? C.sun : null });
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.LEFT, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`Acorrala √${n}: toca el tramo donde el cuadrado pasa de menos de ${n} a más de ${n}`, 12, 46, W - 24, 40);
        // Lo acorralado hasta ahora.
        const lo = loAt(n, picks, picks.length), d = picks.length;
        drawPill(p, C, d ? `${fmt(lo, d)} < √${n} < ${fmt(lo + 10 ** -d, d)}` : `${Math.floor(Math.sqrt(n))} < √${n} < ${Math.floor(Math.sqrt(n)) + 1}`, W / 2, 94, C.sun, 14);

        for (let k = 0; k <= Math.min(picks.length, L - 1); k++) {
          const ln = lines[k], a = loAt(n, picks, k), step = 10 ** -(k + 1), px = (ln.x1 - ln.x0) / 10;
          p.stroke(C.ink); p.strokeWeight(2.5); p.line(ln.x0, ln.y, ln.x1, ln.y);
          const sel = picks[k];
          if (sel !== undefined) {
            const good = !locked || sel === want[k];
            p.noStroke(); p.fill((good ? C.sun : C.bad) + '73'); p.rect(ln.x0 + sel * px, ln.y - 12, px, 24, 5);
            // La lupa: el tramo elegido se abre en la línea de abajo.
            if (k + 1 < L) {
              const nx = lines[k + 1];
              p.stroke(C.sun); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]);
              p.line(ln.x0 + sel * px, ln.y + 12, nx.x0, nx.y - 14); p.line(ln.x0 + (sel + 1) * px, ln.y + 12, nx.x1, nx.y - 14);
              p.drawingContext.setLineDash([]);
            }
          }
          if (locked && sel !== want[k]) { p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.rect(ln.x0 + want[k] * px, ln.y - 12, px, 24, 4); p.drawingContext.setLineDash([]); }
          for (let j = 0; j <= 10; j++) {
            const v = a + j * step, x = ln.x0 + j * px, below = v * v < n;
            p.noStroke(); p.fill(below ? C.sky : C.coral); p.circle(x, ln.y, j % 5 === 0 ? 11 : 8);
            if (j % 5 === 0) { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(fmt(v, k + 1), x, ln.y + 14); }
          }
          // Los cuadrados de los dos extremos del tramo elegido, para comprobar.
          if (sel !== undefined) {
            const l2 = a + sel * step, r2 = l2 + step, inside2 = l2 * l2 < n && r2 * r2 > n;
            p.fill(inside2 ? C.ok : C.bad); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.BOTTOM);
            p.text(`${fmt(l2, k + 1)}² = ${fmt(l2 * l2, 2 * (k + 1))}   ·   ${fmt(r2, k + 1)}² = ${fmt(r2 * r2, 2 * (k + 1))}`, W / 2, ln.y - 16);
          }
        }
        // Leyenda.
        const yl = H - 40;
        p.noStroke(); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.LEFT, p.CENTER);
        // La segunda marca va después del primer rótulo: en un lienzo angosto no se le monta encima.
        const l1 = `al cuadrado da menos de ${n}`, x2 = Math.max(W / 2 + 12, 26 + p.textWidth(l1) + 16);
        p.fill(C.sky); p.circle(18, yl, 9); p.fill(C.mute); p.text(l1, 26, yl);
        p.fill(C.coral); p.circle(x2, yl, 9); p.fill(C.mute); p.text(x2 + 8 + p.textWidth(`da más de ${n}`) > W - 4 ? `más de ${n}` : `da más de ${n}`, x2 + 8, yl);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Raíces acorraladas! Y las cifras siguen sin fin' : 'El tramo correcto va punteado en verde') : picks.length === L ? 'Puedes cambiar un tramo de arriba o pasar a la otra pestaña' : 'Toca entre dos marcas para elegir el tramo', 12, H - 16, W - 24, 18);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const picks = st.picks[cur];
        for (let k = 0; k <= Math.min(picks.length, L - 1); k++) {
          const ln = lines[k];
          if (Math.abs(p.mouseY - ln.y) <= 22 && p.mouseX >= ln.x0 && p.mouseX <= ln.x1) {
            const j = Math.min(9, Math.floor((p.mouseX - ln.x0) / ((ln.x1 - ln.x0) / 10)));
            st.picks[cur] = [...picks.slice(0, k), j];
            api.sfx?.tap?.(); ready(); return false;
          }
        }
      };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(pk => [...pk]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, digitsOf };
})();
