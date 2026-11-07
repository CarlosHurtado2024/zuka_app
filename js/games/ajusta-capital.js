// Ajusta el capital (lección 1.3b): una pila de billetes cuya altura se arrastra para fijar el
// capital; a la derecha, el monto compuesto tras los periodos pedidos se calcula en vivo.
// Meta: que el monto sea exactamente el pedido.
// params = { rate, periods, target, step, max, tol }   state = { capital: número | null }

GAMES['ajusta-capital'] = (() => {
  const amount = (c, p) => c * (1 + p.rate) ** p.periods;
  const answerOf = p => Math.round(p.target / (1 + p.rate) ** p.periods / p.step) * p.step;
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const tex = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  function grade(state, params) {
    const ok = state.capital != null && Math.abs(amount(state.capital, params) - params.target) <= params.tol;
    const ans = answerOf(params);
    return { ok, solution: `$C = \\dfrac{${tex(params.target)}}{(1 + ${params.rate})^{${params.periods}}} = ${tex(ans)}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { capital: null };
    let locked = false, W = 0, H = 0, rail = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      rail = { x: 24, w: Math.min(150, w * 0.42), top: 96, bottom: h - 70 };
    }
    const toPx = v => rail.bottom - (v / params.max) * (rail.bottom - rail.top);
    const toVal = y => Math.max(0, Math.min(params.max, Math.round(((rail.bottom - y) / (rail.bottom - rail.top)) * params.max / params.step) * params.step));
    const ready = () => api.ready(st.capital !== null && st.capital > 0);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const cap = st.capital ?? 0, m = amount(cap, params), good = Math.abs(m - params.target) <= params.tol;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`${+(params.rate * 100).toFixed(4)} % por periodo compuesto, ${params.periods} periodos · meta $ ${fmt(params.target)}`, 12, 8, W - 24, 40);
        // Riel y pila de billetes.
        p.stroke(C.line); p.strokeWeight(1.5); p.noFill(); p.rect(rail.x, rail.top, rail.w, rail.bottom - rail.top, 8);
        const top = toPx(cap), nBills = Math.round(cap / params.step);
        for (let k = 0; k < nBills; k++) {
          const y = rail.bottom - (k + 1) * ((rail.bottom - top) / nBills);
          p.stroke(C.bg); p.strokeWeight(1); p.fill(k % 2 ? C.Q : '#2BB383'); p.rect(rail.x + 6, y, rail.w - 12, (rail.bottom - top) / nBills, 2);
        }
        const col = locked ? (good ? C.ok : C.bad) : C.brand;
        p.stroke(col); p.strokeWeight(3); p.fill(C.card); p.rect(rail.x - 6, top - 10, rail.w + 12, 20, 6);
        p.noStroke(); p.fill(col); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text('▲ ▼', rail.x + rail.w / 2, top);
        p.fill(C.ink); p.textSize(16); p.textAlign(p.CENTER, p.BOTTOM); p.text(`C = $ ${fmt(cap)}`, rail.x + rail.w / 2, rail.top - 10);
        // El monto, a la derecha: capital × (1 + r)^n.
        const rx = rail.x + rail.w + 16, rw = W - rx - 12, ry = rail.top + 20;
        p.textAlign(p.LEFT, p.TOP); p.fill(C.mute); p.textSize(12); p.textStyle(p.NORMAL);
        p.text(`× (1 + ${params.rate})^${params.periods} = × ${((1 + params.rate) ** params.periods).toFixed(4)}`, rx, ry, rw, 40);
        p.fill(locked ? col : C.ink); p.textSize(20); p.textStyle(p.BOLD);
        p.text(`M = $ ${fmt(m)}`, rx, ry + 50, rw, 60);
        const diff = m - params.target;
        p.fill(Math.abs(diff) <= params.tol ? C.ok : C.mute); p.textSize(12); p.textStyle(p.NORMAL);
        p.text(Math.abs(diff) <= params.tol ? '¡justo en la meta!' : diff > 0 ? `sobran $ ${fmt(diff)}` : `faltan $ ${fmt(-diff)}`, rx, ry + 100, rw, 40);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(14); p.text(`Era C = $ ${fmt(answerOf(params))}`, rx, ry + 140, rw, 40); }
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text('Arrastra la pila para fijar el capital', 12, H - 30, W - 24, 28);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (p.mouseX >= rail.x - 10 && p.mouseX <= rail.x + rail.w + 10 && p.mouseY >= rail.top - 16 && p.mouseY <= rail.bottom + 10) {
          drag = true; st.capital = toVal(p.mouseY); ready(); return false;
        }
      };
      p.mouseDragged = () => { if (!drag) return; st.capital = toVal(p.mouseY); ready(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ capital: st.capital }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, amount };
})();
