// La báscula del mercado (lección 1.2): se conoce el precio de unos kilos y hay que fijar, con una
// rueda de precio, lo que cuestan otros kilos (regla de tres simple directa).
// params = { knownKg, knownPrice, askKg, max, step, tol }   state = { price: número | null }

GAMES['bascula'] = (() => {
  const answerOf = p => (p.knownPrice * p.askKg) / p.knownKg;
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const texNum = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  function grade(state, params) {
    const ans = answerOf(params);
    const ok = state.price !== null && Math.abs(state.price - ans) <= params.tol;
    return { ok, solution: `$\\dfrac{${texNum(params.knownPrice)}}{${params.knownKg}} \\cdot ${params.askKg} = ${texNum(ans)}$ pesos` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { price: null };
    let locked = false, W = 0, H = 0, wheel = null, buttons = [], drag = null, shown = 0;
    const APPLE = '#E8453C', LEAF = '#5FBF5F';

    function layout(w, h) {
      W = w; H = h;
      wheel = { x: w * 0.62, y: h * 0.5, w: w * 0.3, h: h * 0.3 };
      buttons = [
        { d: -params.step, x: wheel.x, y: wheel.y + wheel.h + 8, w: wheel.w / 2 - 3, h: 32, t: '−' },
        { d: params.step, x: wheel.x + wheel.w / 2 + 3, y: wheel.y + wheel.h + 8, w: wheel.w / 2 - 3, h: 32, t: '+' },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const shownPrice = () => (st.price === null ? 0 : st.price);
    function setPrice(v) {
      st.price = Math.max(0, Math.min(params.max, Math.round(v / params.step) * params.step));
      api.ready(true);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function apple(x, y, r) {
        p.noStroke(); p.fill(APPLE); p.circle(x, y, r * 2);
        p.fill('#fff6'); p.circle(x - r * 0.3, y - r * 0.3, r * 0.5);
        p.stroke('#7a4a2a'); p.strokeWeight(2); p.line(x, y - r, x + 2, y - r - 6);
        p.noStroke(); p.fill(LEAF); p.ellipse(x + 6, y - r - 4, 9, 5);
      }

      // Báscula: plato con las manzanas pedidas y pantalla con el precio fijado.
      function scale(cx, cy, kg, price, col) {
        const sink = 6 + kg * 2;
        p.stroke(C.line); p.strokeWeight(4); p.line(cx, cy + 10, cx, cy + 60);
        p.noStroke(); p.fill(C.line); p.rect(cx - 34, cy + 58, 68, 8, 4);
        p.stroke(C.ink); p.strokeWeight(3); p.noFill(); p.arc(cx, cy + sink, 90, 24, 0, p.PI);
        for (let i = 0; i < kg; i++) apple(cx - 28 + (i % 4) * 19, cy + sink - 10 - Math.floor(i / 4) * 16, 9);
        p.fill(C.card); p.stroke(col); p.strokeWeight(2); p.rect(cx - 44, cy + 70, 88, 30, 8);
        p.noStroke(); p.fill(col); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        p.text(price === null ? '— — —' : `$ ${fmt(price)}`, cx, cy + 85);
        p.fill(C.mute); p.textSize(11); p.text(`${kg} kg`, cx, cy + 112);
      }

      p.draw = () => {
        p.background(C.bg);
        shown = p.lerp(shown, shownPrice(), 0.3);
        const ans = answerOf(params), good = st.price !== null && Math.abs(st.price - ans) <= params.tol;
        // Dato conocido.
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(12);
        p.text('En el mercado', W / 2, 8);
        p.fill(C.ink); p.textSize(18); p.text(`${params.knownKg} kg de manzanas → $ ${fmt(params.knownPrice)}`, W / 2, 24);
        p.fill(C.N); p.textSize(14); p.text(`¿Cuánto cuestan ${params.askKg} kg?`, W / 2, 50);
        for (let i = 0; i < params.knownKg; i++) apple(W / 2 - (params.knownKg - 1) * 11 + i * 22, 86, 9);
        // Báscula con el pedido y rueda de precio.
        const col = locked ? (good ? C.ok : C.bad) : st.price !== null && good ? C.ok : C.brand;
        scale(W * 0.27, H * 0.42, params.askKg, locked && !good ? ans : st.price, col);
        p.stroke(drag ? C.brand : C.line); p.strokeWeight(2.5); p.fill(C.card); p.rect(wheel.x, wheel.y, wheel.w, wheel.h, 14);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        const v = shownPrice(), cy = wheel.y + wheel.h / 2;
        p.fill(C.mute + '66'); p.textSize(13);
        if (v + params.step <= params.max) p.text(fmt(v + params.step), wheel.x + wheel.w / 2, cy - wheel.h * 0.3);
        if (v - params.step >= 0) p.text(fmt(v - params.step), wheel.x + wheel.w / 2, cy + wheel.h * 0.3);
        p.fill(C.ink); p.textSize(Math.min(20, wheel.w / 4.6)); p.text(st.price === null ? '0' : fmt(v), wheel.x + wheel.w / 2, cy);
        p.fill(C.mute); p.textSize(11); p.text('precio', wheel.x + wheel.w / 2, wheel.y - 10);
        buttons.forEach(b => {
          p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(C.ink); p.textSize(18); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.fill(C.mute); p.textSize(11); p.text('arrastra la rueda o toca ±', wheel.x + wheel.w / 2, buttons[0].y + 46);
        if (locked && !good) { p.fill(C.bad); p.textSize(13); p.text(`Debía ser $ ${fmt(ans)}`, W * 0.27, H * 0.42 + 134); }
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { setPrice(shownPrice() + b.d); api.sfx?.tap?.(); return false; }
        if (inside(wheel, p.mouseX, p.mouseY)) { drag = { y: p.mouseY, v: shownPrice() }; return false; }
      };
      // Arrastrar hacia arriba sube el precio; cuanto más lejos, más rápido.
      p.mouseDragged = () => {
        if (!drag) return;
        const dy = drag.y - p.mouseY;
        setPrice(drag.v + Math.sign(dy) * Math.pow(Math.abs(dy) / 6, 1.6) * params.step);
        return false;
      };
      p.mouseReleased = () => { if (drag) { drag = null; return false; } };
    }, 1.1);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
