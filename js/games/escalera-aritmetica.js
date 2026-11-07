// La escalera aritmética (lección 1.4): n peldaños; el primero mide a1 y se arrastra el segundo
// hacia arriba o abajo para fijar la diferencia d; toda la escalera se reacomoda. Meta: que el
// último peldaño mida `target`.
// params = { a1, n, target, step, max }   state = { d: número | null }

GAMES['escalera-aritmetica'] = (() => {
  const termAt = (p, d, k) => p.a1 + (k - 1) * d;
  const answerOf = p => (p.target - p.a1) / (p.n - 1);

  function grade(state, params) {
    const ok = state.d != null && termAt(params, state.d, params.n) === params.target;
    const d = answerOf(params);
    return { ok, solution: `$a_{${params.n}} = ${params.a1} + ${params.n - 1}d = ${params.target} \\Rightarrow d = ${d}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { d: null };
    let locked = false, W = 0, H = 0, base = 0, unit = 0, stepW = 0, left = 0, drag = false;

    function layout(w, h) {
      W = w; H = h;
      base = h - 44; left = 16; stepW = (w - 32) / params.n;
      unit = (base - 70) / Math.max(params.target, params.a1 + (params.n - 1) * params.max);   // px por unidad
    }
    const d = () => st.d ?? 0;
    const topOf = k => base - termAt(params, d(), k) * unit;
    const ready = () => api.ready(st.d !== null);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const last = termAt(params, d(), params.n), good = last === params.target;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`Primer peldaño ${params.a1}; el peldaño ${params.n} debe medir ${params.target}`, 12, 8, W - 24, 36);
        for (let k = 1; k <= params.n; k++) {
          const x = left + (k - 1) * stepW, y = topOf(k), hgt = base - y;
          const isKnob = k === 2 && !locked;
          const col = k === params.n ? (locked ? (good ? C.ok : C.bad) : C.brand) : isKnob ? C.N : C.line;
          p.stroke(col); p.strokeWeight(isKnob ? 3 : 1.5); p.fill(C.card); p.rect(x + 2, y, stepW - 4, Math.max(2, hgt), 4, 4, 0, 0);
          p.noStroke(); p.fill(k === 2 ? C.N : C.ink); p.textAlign(p.CENTER, p.BOTTOM); p.textStyle(p.BOLD); p.textSize(stepW < 34 ? 10 : 12);
          p.text(termAt(params, d(), k), x + stepW / 2, y - 3);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(k, x + stepW / 2, base + 4);
          if (isKnob) { p.fill(C.N); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text('▲▼', x + stepW / 2, y + Math.min(18, hgt / 2)); }
        }
        p.stroke(C.line); p.strokeWeight(2); p.line(12, base, W - 12, base);
        p.noStroke(); p.fill(st.d === null ? C.mute : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(16);
        p.text(st.d === null ? 'd = ?' : `d = ${st.d}`, W / 2, 56);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL);
        p.text(locked ? (good ? '¡Escalera perfecta!' : `Era d = ${answerOf(params)}`) : 'Arrastra el segundo peldaño: fija la diferencia d', 12, H - 20, W - 24, 18);
      };

      const onKnob = () => p.mouseX >= left + stepW && p.mouseX <= left + 2 * stepW && p.mouseY >= Math.min(topOf(2), base) - 24 && p.mouseY <= base + 4;
      const setFromY = y => {
        const v = (base - y) / unit;   // valor del peldaño 2
        st.d = Math.max(-params.max, Math.min(params.max, Math.round((v - params.a1) / params.step) * params.step));
        ready();
      };
      p.mousePressed = () => { if (locked || !onKnob()) return; drag = true; setFromY(p.mouseY); return false; };
      p.mouseDragged = () => { if (!drag) return; setFromY(p.mouseY); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ d: st.d }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
