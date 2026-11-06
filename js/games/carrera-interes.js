// La carrera del interés (lección 1.3): dos corredores, uno con interés simple y otro con
// compuesto, parten del mismo capital; un deslizador de tiempo los mueve y un medidor muestra la
// ventaja del compuesto. Hay que encontrar el primer mes en que esa ventaja supera la brecha.
// params = { capital, rate, months, gap }   state = { month: número | null }

GAMES['carrera-interes'] = (() => {
  const simple = (p, n) => p.capital * (1 + p.rate * n);
  const compound = (p, n) => p.capital * (1 + p.rate) ** n;
  const gapAt = (p, n) => compound(p, n) - simple(p, n);
  const firstMonth = p => { for (let n = 1; n <= p.months; n++) if (gapAt(p, n) > p.gap) return n; return null; };
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const texNum = n => String(Math.round(n / 100) * 100).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  function grade(state, params) {
    const ans = firstMonth(params);
    const ok = state.month !== null && state.month === ans;
    return { ok, solution: `En el mes ${ans} la ventaja es $\\approx ${texNum(gapAt(params, ans))}$ (en el ${ans - 1}, $\\approx ${texNum(gapAt(params, ans - 1))}$)` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { month: null };
    let locked = false, W = 0, H = 0, track = null, slider = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      track = { x: 24, y: 96, w: w - 48, lane: 54 };
      slider = { x: 32, y: h - 64, w: w - 64 };
    }
    const month = () => (st.month === null ? 0 : st.month);
    function setMonth(x) {
      st.month = Math.max(0, Math.min(params.months, Math.round(((x - slider.x) / slider.w) * params.months)));
      api.ready(st.month > 0);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function runner(x, y, col, lean) {
        p.noStroke(); p.fill(col); p.circle(x, y - 18, 12);
        p.stroke(col); p.strokeWeight(4); p.line(x, y - 12, x + lean * 2, y + 2);
        p.line(x + lean * 2, y + 2, x - 6, y + 14); p.line(x + lean * 2, y + 2, x + 8, y + 12);
        p.line(x - 2, y - 6, x - 10 - lean * 2, y); p.line(x - 2, y - 6, x + 10, y - 10 + lean);
      }

      p.draw = () => {
        p.background(C.bg);
        const n = month(), ans = firstMonth(params);
        const s = simple(params, n), c = compound(params, n), gap = c - s;
        const beyond = gap > params.gap;
        const good = st.month === ans;
        const col = locked ? (good ? C.ok : C.bad) : beyond ? C.ok : C.brand;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text(`$ ${fmt(params.capital)} al ${(params.rate * 100).toLocaleString('es-CO')} % mensual. ¿Desde qué mes el compuesto le saca más de $ ${fmt(params.gap)} al simple?`, 12, 6, W - 24, 50);
        // Pista: dos carriles; la posición es el monto entre el capital y el máximo del compuesto.
        const maxV = compound(params, params.months);
        const mx = lineMap(params.capital, maxV, track.x + 10, track.x + track.w - 20);
        [['simple', s, C.N, 0], ['compuesto', c, C.Q, 1]].forEach(([name, v, color, k]) => {
          const y = track.y + k * track.lane;
          p.stroke(C.line); p.strokeWeight(1.5); p.line(track.x, y + 20, track.x + track.w, y + 20);
          p.drawingContext.setLineDash([3, 5]); p.stroke(C.line); p.line(track.x, y - 22, track.x + track.w, y - 22); p.drawingContext.setLineDash([]);
          runner(mx.toPx(v), y + 4, color, Math.min(6, n / 3));
          p.noStroke(); p.fill(color); p.textAlign(p.LEFT, p.BOTTOM); p.textSize(11); p.textStyle(p.BOLD); p.text(name, track.x + 2, y - 24);
          p.fill(C.ink); p.textAlign(p.RIGHT, p.BOTTOM); p.text(`$ ${fmt(v)}`, track.x + track.w - 2, y - 24);
        });
        p.stroke(C.mute); p.strokeWeight(2); p.line(track.x + track.w - 8, track.y - 26, track.x + track.w - 8, track.y + track.lane + 22);
        // Medidor de la ventaja.
        const gy = track.y + track.lane * 2 + 10, gh = 28;
        p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.BOTTOM); p.textSize(11); p.textStyle(p.NORMAL); p.text('ventaja del compuesto', track.x, gy - 4);
        p.fill(col); p.textAlign(p.RIGHT, p.BOTTOM); p.textStyle(p.BOLD); p.textSize(14); p.text(`$ ${fmt(gap)}`, track.x + track.w, gy - 2);
        p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(track.x, gy, track.w, gh, 8);
        const gmax = params.gap * 2.4, gx = lineMap(0, gmax, track.x + 3, track.x + track.w - 3);
        p.noStroke(); p.fill(col); p.rect(track.x + 3, gy + 3, Math.max(0, gx.toPx(Math.min(gap, gmax)) - track.x - 3), gh - 6, 6);
        p.stroke(C.ok); p.strokeWeight(2); p.line(gx.toPx(params.gap), gy - 6, gx.toPx(params.gap), gy + gh + 6);
        p.noStroke(); p.fill(C.ok); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(`$ ${fmt(params.gap)}`, gx.toPx(params.gap), gy + gh + 8);
        // Deslizador de meses.
        const xOf = k => slider.x + (k / params.months) * slider.w;
        p.stroke(C.line); p.strokeWeight(6); p.line(slider.x, slider.y, slider.x + slider.w, slider.y);
        p.stroke(col); p.line(slider.x, slider.y, xOf(n), slider.y);
        for (let k = 0; k <= params.months; k += 6) { p.stroke(C.mute); p.strokeWeight(1.5); p.line(xOf(k), slider.y + 8, xOf(k), slider.y + 14); p.noStroke(); p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(k, xOf(k), slider.y + 16); }
        if (locked) { p.stroke(C.ok); p.strokeWeight(2); p.line(xOf(ans), slider.y - 12, xOf(ans), slider.y + 12); }
        p.fill(C.card); p.stroke(col); p.strokeWeight(3); p.circle(xOf(n), slider.y, 26);
        p.noStroke(); p.fill(col); p.textSize(16); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM);
        p.text(st.month === null ? 'mes —' : `mes ${st.month}`, W / 2, slider.y - 16);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked && !good ? `Era el mes ${ans}` : 'Desliza el tiempo y deja el primer mes que supere la brecha', W / 2, H - 12);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (Math.abs(p.mouseY - slider.y) <= 24 && p.mouseX >= slider.x - 16 && p.mouseX <= slider.x + slider.w + 16) { drag = true; setMonth(p.mouseX); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setMonth(p.mouseX); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
