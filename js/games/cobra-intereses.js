// Cobra los intereses (lección 1.3b): una línea de meses; tocar el siguiente mes «cobra» la
// moneda del interés simple (capital × tasa, siempre igual) y el acumulado sube. Tocar el último
// mes cobrado lo devuelve. Meta: acumular exactamente el interés pedido.
// params = { capital, rate, target, months }   state = { paid: meses cobrados }

GAMES['cobra-intereses'] = (() => {
  const coinOf = p => Math.round(p.capital * p.rate);
  const answerOf = p => Math.round(p.target / coinOf(p));
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const tex = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  function grade(state, params) {
    const coin = coinOf(params), ans = answerOf(params);
    const ok = state.paid > 0 && state.paid * coin === params.target;
    return { ok, solution: `Cada mes paga $${tex(params.capital)} \\cdot ${params.rate} = ${tex(coin)}$; $${tex(params.target)} / ${tex(coin)} = ${ans}$ meses` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { paid: 0 };
    const coin = coinOf(params);
    let locked = false, W = 0, H = 0, cells = [], pile = null, pop = [];

    function layout(w, h) {
      W = w; H = h;
      // Pila y acumulado arriba; la cuadrícula de meses (6 columnas) se ancla al pie y nunca sube
      // por encima del acumulado.
      pile = { x: w / 2, y: 70, r: Math.min(36, w * 0.1) };
      const cols = 6, rows = Math.ceil(params.months / cols), cw = (w - 24 - (cols - 1) * 6) / cols, ch = 38;
      const top = Math.max(h - 30 - rows * (ch + 6), pile.y + pile.r + 72);
      cells = Array.from({ length: params.months }, (_, i) => ({ x: 12 + (i % cols) * (cw + 6), y: top + Math.floor(i / cols) * (ch + 6), w: cw, h: ch }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.paid > 0);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function coinAt(x, y, r, alpha = 255) {
        p.stroke(C.card); p.strokeWeight(2); p.fill(p.color(C.N)); p.circle(x, y, r * 2);
        p.noStroke(); p.fill(60, 40, 0, alpha); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(r * 0.42);
        p.text(fmt(coin), x, y);
      }

      p.draw = () => {
        p.background(C.bg);
        const total = st.paid * coin, good = total === params.target;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`$ ${fmt(params.capital)} al ${+(params.rate * 100).toFixed(4)} % mensual simple`, 12, 8, W - 24, 30);
        // La pila de monedas cobradas (hasta 6 visibles, apiladas) y el acumulado.
        const shown = Math.min(st.paid, 6);
        for (let k = 0; k < shown; k++) coinAt(pile.x, pile.y + 12 - k * 5, pile.r);
        if (!st.paid) { p.noFill(); p.stroke(C.line); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.circle(pile.x, pile.y + 12, pile.r * 2); p.drawingContext.setLineDash([]); }
        pop.forEach(c => { c.t += 0.1; coinAt(c.x + (pile.x - c.x) * c.t, c.y + (pile.y - c.y) * c.t, pile.r * 0.6); });
        pop = pop.filter(c => c.t < 1);
        p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(22);
        p.text(`$ ${fmt(total)}`, W / 2, pile.y + pile.r + 18);
        p.fill(C.mute); p.textSize(12); p.textStyle(p.NORMAL);
        p.text(`interés acumulado · meta $ ${fmt(params.target)}`, 12, pile.y + pile.r + 44, W - 24, 20);
        cells.forEach((c, i) => {
          const paid = i < st.paid;
          const col = locked ? (paid ? (good ? C.ok : C.bad) : C.line) : paid ? C.N : C.line;
          p.stroke(col); p.strokeWeight(paid ? 2.5 : 1.5); p.fill(paid ? C.card : C.bg); p.rect(c.x, c.y, c.w, c.h, 8);
          p.noStroke(); p.fill(paid ? C.N : C.mute); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
          p.text(i + 1, c.x + c.w / 2, c.y + c.h / 2);   // número del mes; la moneda ya aparece en la pila
        });
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (good ? '¡Justo la meta!' : `Eran ${answerOf(params)} meses`) : `Toca los meses en orden para cobrar $ ${fmt(coin)}; toca el último para devolverlo`, 12, H - 26, W - 24, 24);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = cells.findIndex(c => inside(c, p.mouseX, p.mouseY));
        if (i < 0) return;
        if (i === st.paid) { st.paid += 1; pop.push({ x: cells[i].x + cells[i].w / 2, y: cells[i].y + cells[i].h / 2, t: 0 }); api.sfx?.tap?.(); }
        else if (i === st.paid - 1) st.paid -= 1;
        else return;
        ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ paid: st.paid }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
