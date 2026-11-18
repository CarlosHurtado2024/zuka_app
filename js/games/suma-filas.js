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
    let locked = false, W = 0, H = 0, area = null, rail, drag = false;

    function layout(w, h) {
      W = w; H = h;
      area = { x: 12, y: 68, w: w - 64, h: h - 143 };
      rail = lineMap(0, params.max, area.y, area.y + area.h);
    }
    const ready = () => api.ready(st.rows > 0);
    const handle = () => ({ x: W - 26, y: rail.toPx(st.rows) });

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
        const rowH = area.h / Math.max(params.max, 1);
        for (let k = 0; k < st.rows; k++) {
          const n = params.first + k * params.d, y = area.y + (k + 0.5) * rowH;
          const dotW = Math.min(rowH * 0.7, (area.w - 40) / n), x0 = area.x + area.w / 2 - ((n - 1) * dotW) / 2;
          p.noStroke(); p.fill(k === st.rows - 1 ? C.coral : C.sky);   // coral: el sol casi no se ve sobre el papel del tema claro
          for (let i = 0; i < n; i++) p.circle(x0 + i * dotW, y, Math.max(3, dotW * 0.72));
          if (rowH >= 11) { p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.RIGHT, p.CENTER); p.text(n, area.x + area.w, y); }
        }
        p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(18);
        p.text(`${st.rows} fila${st.rows === 1 ? '' : 's'} · ${sum} ${params.item}`, W / 2, H - 44);
        const { x, y } = handle();
        p.stroke(C.line); p.strokeWeight(3); p.line(x, rail.toPx(0), x, rail.toPx(params.max));
        p.stroke(C.brand); p.strokeWeight(2); p.fill(C.card); p.circle(x, y, 21);
        p.noStroke(); p.fill(C.ink); p.textSize(12); p.text(st.rows, x, y);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        const ans = answerOf(params);
        p.text(locked ? (good ? '¡Justo la meta!' : ans === null ? `Ninguna cantidad de filas da ${params.target}` : `Eran ${ans} filas`) : 'Arrastra la manija para desplegar las filas', 12, H - 23, W - 24, 24);
      };

      const move = () => {
        const next = Math.max(0, Math.min(params.max, Math.round(rail.toVal(p.mouseY))));
        if (next !== st.rows) { st.rows = next; api.sfx?.tap?.(); ready(); }
      };
      p.mousePressed = () => {
        if (locked || !inCanvas(p) || Math.abs(p.mouseX - handle().x) > 24 || p.mouseY < area.y - 18 || p.mouseY > area.y + area.h + 18) return;
        drag = true; move(); return false;
      };
      p.mouseDragged = () => { if (drag && !locked) { move(); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.12, () => {
      if (locked || !rail) return null;
      return { from: handle(), to: { x: handle().x, y: rail.toPx(st.rows ? st.rows - 1 : 1) } };
    });

    return {
      loaded: m.ready,
      getState: () => ({ rows: st.rows }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      demo: m.demo,
    };
  }

  return { grade, create, total, demo: true };
})();
