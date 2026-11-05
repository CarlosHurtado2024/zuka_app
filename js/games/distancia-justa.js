// Distancia justa (lección 1.1): con `a` fijo en la recta, colocar `b` de modo que |b − a| = d.
// Una "cuerda" entre ambos muestra la distancia en vivo; hay dos respuestas válidas (a + d y a − d).
// params = { min, max, a, d }   state = { b: entero | null }

GAMES['distancia-justa'] = (() => {
  function grade(state, params) {
    const sols = [params.a + params.d, params.a - params.d];
    const ok = state.b !== null && sols.includes(state.b);
    return { ok, solution: `$|b - (${params.a})| = ${params.d}$ se cumple con $b = ${sols[0]}$ o $b = ${sols[1]}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { b: null };
    let locked = false, map = null, lineY = 0, W = 0, H = 0, drag = false, bx = 0;
    const R = 14;

    function layout(w, h) {
      W = w; H = h; lineY = h * 0.6;
      map = lineMap(params.min, params.max, 26, w - 26);
      bx = st.b === null ? w / 2 : map.toPx(st.b);
    }
    const neg = s => String(s).replace(/-/g, '−');

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const ax = map.toPx(params.a);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text('Coloca b para que la distancia sea', W / 2, 10);
        p.fill(C.ink); p.textSize(22); p.text(`|b − a| = ${params.d}`, W / 2, 28);
        // Cuerda con la distancia actual.
        if (st.b !== null) {
          const d = Math.abs(st.b - params.a), good = d === params.d;
          const col = locked ? (good ? C.ok : C.bad) : (good ? C.ok : C.brand);
          p.stroke(col); p.strokeWeight(4); p.line(ax, lineY - 34, bx, lineY - 34);
          p.line(ax, lineY - 34, ax, lineY - 16); p.line(bx, lineY - 34, bx, lineY - 16);
          p.noStroke(); p.fill(col); p.textSize(18); p.textAlign(p.CENTER, p.BOTTOM);
          p.text(`|${neg(st.b)} − (${neg(params.a)})| = ${d}`, W / 2, lineY - 40);
        } else {
          p.noStroke(); p.fill(C.mute); p.textSize(14); p.textAlign(p.CENTER, p.BOTTOM);
          p.text('Arrastra la ficha b sobre la recta', W / 2, lineY - 40);
        }
        // Recta con marcas enteras.
        p.stroke(C.mute); p.strokeWeight(2); p.line(map.toPx(params.min), lineY, map.toPx(params.max), lineY);
        p.textAlign(p.CENTER, p.TOP); p.textSize(12);
        for (let v = params.min; v <= params.max; v++) {
          p.stroke(C.mute); p.strokeWeight(v % 5 === 0 ? 2 : 1); p.line(map.toPx(v), lineY - 6, map.toPx(v), lineY + 6);
          if (v % 2 === 0) { p.noStroke(); p.fill(C.mute); p.text(neg(v), map.toPx(v), lineY + 12); }
        }
        if (locked) {
          // Las dos posiciones válidas, con arcos de radio d a cada lado de a.
          [params.a + params.d, params.a - params.d].forEach(v => {
            p.noStroke(); p.fill(C.ok); p.circle(map.toPx(v), lineY, 12);
            p.textAlign(p.CENTER, p.TOP); p.textSize(13); p.text(`b = ${neg(v)}`, map.toPx(v), lineY + 30);
          });
          p.noFill(); p.stroke(C.ok + '88'); p.strokeWeight(2);
          p.arc(ax, lineY, 2 * params.d * (map.toPx(1) - map.toPx(0)), 70, Math.PI, 2 * Math.PI);
        }
        // Punto a fijo.
        p.noStroke(); p.fill(C.R); p.circle(ax, lineY, R * 1.6);
        p.fill(C.bg); p.textAlign(p.CENTER, p.CENTER); p.textSize(13); p.text('a', ax, lineY + 1);
        // Ficha b.
        const bcol = locked ? (grade(st, params).ok ? C.ok : C.bad) : (drag ? C.ink : C.brand);
        p.fill(bcol); p.circle(bx, st.b === null ? H * 0.82 : lineY, R * 2);
        p.fill(C.bg); p.text('b', bx, (st.b === null ? H * 0.82 : lineY) + 1);
      };

      const by = () => (st.b === null ? H * 0.82 : lineY);
      p.mousePressed = () => {
        if (locked) return;
        if (Math.hypot(p.mouseX - bx, p.mouseY - by()) < R + 12) { drag = true; api.sfx?.tap?.(); return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        bx = p.constrain(p.mouseX, map.toPx(params.min), map.toPx(params.max));
        st.b = Math.round(map.toVal(bx));
        return false;
      };
      p.mouseReleased = () => {
        if (!drag) return;
        drag = false;
        bx = map.toPx(st.b);
        api.ready(st.b !== null);
        return false;
      };
    }, 0.85);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
