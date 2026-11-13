// Las parejas de Gauss (lección 1.4): fichas con los términos de una progresión aritmética; se
// unen con cuerdas por parejas que sumen lo mismo que los extremos (primero + último). Con un
// número impar de términos, el del medio queda solo. Tocar una ficha unida deshace su pareja.
// params = { terms: [números] }   state = { pairs: [[i, j]] }

GAMES['parejas-gauss'] = (() => {
  const pairSum = p => p.terms[0] + p.terms[p.terms.length - 1];
  const totalOf = p => p.terms.reduce((s, v) => s + v, 0);

  function grade(state, params) {
    const n = params.terms.length, need = Math.floor(n / 2), sum = pairSum(params);
    const used = new Set();
    let ok = state.pairs.length === need;
    for (const [i, j] of state.pairs) {
      if (i === j || used.has(i) || used.has(j) || params.terms[i] === undefined || params.terms[j] === undefined) ok = false;
      used.add(i); used.add(j);
      if (params.terms[i] + params.terms[j] !== sum) ok = false;
    }
    const solution = `Cada pareja suma $${params.terms[0]} + ${params.terms[n - 1]} = ${sum}$; ${need} parejas${n % 2 ? ` y el ${params.terms[(n - 1) / 2]} del centro` : ''}: $S = ${totalOf(params)}$`;
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const COLS = [C.N, C.Z, C.Q, C.I, C.R, C.brand];
    const st = { pairs: [] };
    let locked = false, W = 0, H = 0, tiles = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      const n = params.terms.length, cols = Math.min(n, 6), rows = Math.ceil(n / cols);
      const tw = (w - 24 - (cols - 1) * 8) / cols, th = 40, top = 60 + (h - 60 - 50 - rows * (th + 26)) / 2;
      tiles = params.terms.map((_, i) => ({ x: 12 + (i % cols) * (tw + 8), y: top + Math.floor(i / cols) * (th + 26), w: tw, h: th }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const center = t => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 });
    const pairOf = i => st.pairs.findIndex(pr => pr.includes(i));
    const need = Math.floor(params.terms.length / 2);
    const ready = () => api.ready(st.pairs.length === need);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      // Las parejas de extremos comparten el punto medio: cada cuerda sube un poco más que la
      // anterior (k) para que sus rótulos no se pisen.
      const liftOf = k => 22 + k * 15;
      function rope(a, b, col, k) {
        const ca = center(a), cb = center(b), lift = liftOf(k);
        p.stroke(col); p.strokeWeight(3); p.noFill();
        p.bezier(ca.x, a.y, ca.x, a.y - lift, cb.x, b.y - lift, cb.x, b.y);
        return { x: (ca.x + cb.x) / 2, y: (4 * a.y + 4 * b.y - 6 * lift) / 8 };   // punto medio de la curva
      }

      p.draw = () => {
        p.background(C.bg);
        const sum = pairSum(params);
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`Une las parejas que suman lo mismo que los extremos (${params.terms[0]} + ${params.terms[params.terms.length - 1]})`, 12, 8, W - 24, 40);
        st.pairs.forEach(([i, j], k) => {
          const good = params.terms[i] + params.terms[j] === sum;
          const col = locked ? (good ? C.ok : C.bad) : COLS[k % COLS.length];
          const mid = rope(tiles[i], tiles[j], col, k);
          // Rótulo bajo (13 px), relleno con el color de la cuerda: las cuerdas quedan a 11 px unas de otras y una píldora normal las taparía.
          p.noStroke(); p.fill(col); p.rect(mid.x - 15, mid.y - 6.5, 30, 13, 6.5);
          p.fill(inkOn(col, C.ink)); p.textSize(10); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          p.text(params.terms[i] + params.terms[j], mid.x, mid.y + 0.5);
        });
        if (drag) { const c = center(tiles[drag.i]); p.stroke(C.brand); p.strokeWeight(3); p.line(c.x, tiles[drag.i].y, p.mouseX, p.mouseY); }
        params.terms.forEach((v, i) => {
          const k = pairOf(i), paired = k >= 0;
          const col = locked ? (paired ? (params.terms[st.pairs[k][0]] + params.terms[st.pairs[k][1]] === sum ? C.ok : C.bad) : (params.terms.length % 2 && i === (params.terms.length - 1) / 2 ? C.ok : C.bad)) : paired ? COLS[k % COLS.length] : drag && drag.i === i ? C.brand : C.line;
          // Ficha crema; al emparejarla toma el color de su cuerda.
          drawTile(p, C, tiles[i], v, { fill: col === C.line ? C.cream : col === C.brand ? C.sun : col, size: 15 });
        });
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? `¡${need} parejas de ${sum}!` : 'En verde, lo que estaba bien') : `${st.pairs.length} de ${need} parejas · arrastra de una ficha a otra${params.terms.length % 2 ? ' · una queda sola' : ''}`, 12, H - 26, W - 24, 24);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = tiles.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (i < 0) return;
        const k = pairOf(i);
        if (k >= 0) st.pairs.splice(k, 1);   // deshace la pareja y permite rehacerla
        drag = { i };
        ready();
        return false;
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const j = tiles.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (j >= 0 && j !== drag.i) {
          const k = pairOf(j);
          if (k >= 0) st.pairs.splice(k, 1);
          st.pairs.push([drag.i, j]);
          api.sfx?.tap?.();
        }
        drag = null;
        ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ pairs: st.pairs.map(pr => [...pr]) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
