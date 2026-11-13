// Suma de filas (lecciones 1.4 y 1.5): tocar «+ fila» añade una fila de puntos (la primera tiene
// `first`, cada una `d` más) y el contador muestra el total; «− fila» quita la última.
// Meta: que el total sea exactamente `target`. Sirve para el teatro (8, 10, 12…) y la pirámide (1, 2, 3…).
// params = { first, d, target, max, item }   state = { rows }

GAMES['suma-filas'] = (() => {
  const total = (rows, p) => (rows * (2 * p.first + (rows - 1) * p.d)) / 2;
  const answerOf = p => { for (let n = 1; n <= p.max; n++) if (total(n, p) === p.target) return n; return null; };

  function grade(state, params) {
    const ok = state.rows > 0 && total(state.rows, params) === params.target;
    const n = answerOf(params);
    return { ok, solution: n === null ? `Ninguna cantidad de filas da ${params.target}` : `$S_{${n}} = \\dfrac{${n}\\,(2 \\cdot ${params.first} + ${n - 1} \\cdot ${params.d})}{2} = ${params.target}$: ${n} filas` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { rows: 0 };
    let locked = false, W = 0, H = 0, buttons = [], area = null;

    function layout(w, h) {
      W = w; H = h;
      area = { x: 12, y: 50, w: w - 24, h: h - 50 - 142 };   // termina antes del total (H − 126)
      const bw = (w - 36) / 2, by = h - 100;
      buttons = [
        { v: -1, x: 12, y: by, w: bw, h: 44, t: '− fila', col: C.I },
        { v: 1, x: 24 + bw, y: by, w: bw, h: 44, t: '+ fila', col: C.Q },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.rows > 0);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const sum = total(st.rows, params), good = sum === params.target;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        const one = params.item.replace(/s$/, '');
        p.text(`Fila 1: ${params.first} ${params.first === 1 ? one : params.item} · cada fila ${params.d} más · meta ${params.target}`, 12, 8, W - 24, 36);
        // Filas de puntos, de arriba abajo, centradas; el tamaño baja si hay muchas.
        const rowH = Math.min(22, area.h / Math.max(params.max, 1));
        for (let k = 0; k < st.rows; k++) {
          const n = params.first + k * params.d, y = area.y + (k + 0.5) * rowH;
          const dotW = Math.min(rowH * 0.7, (area.w - 40) / n), x0 = W / 2 - ((n - 1) * dotW) / 2;
          p.noStroke(); p.fill(k === st.rows - 1 ? C.coral : C.sky);   // coral: el sol casi no se ve sobre el papel del tema claro
          for (let i = 0; i < n; i++) p.circle(x0 + i * dotW, y, Math.max(3, dotW * 0.72));
          if (rowH >= 11) { p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.RIGHT, p.CENTER); p.text(n, area.x + area.w, y); }
        }
        p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(18);
        p.text(`${st.rows} fila${st.rows === 1 ? '' : 's'} · ${sum} ${params.item}`, W / 2, H - 126);
        buttons.forEach(b => {
          const dim = locked || (b.v < 0 ? st.rows === 0 : st.rows >= params.max);
          drawTile(p, C, b, b.t, { fill: dim ? C.card : b.col, ink: dim ? C.mute : undefined, r: 12, size: 15, lift: dim ? 1 : 3 });
        });
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        const ans = answerOf(params);
        p.text(locked ? (good ? '¡Justo la meta!' : ans === null ? `Ninguna cantidad de filas da ${params.target}` : `Eran ${ans} filas`) : `Añade filas hasta llegar exactamente a ${params.target}`, 12, H - 30, W - 24, 24);
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        const next = st.rows + b.v;
        if (next < 0 || next > params.max) return false;
        st.rows = next; api.sfx?.tap?.(); ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ rows: st.rows }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, total };
})();
