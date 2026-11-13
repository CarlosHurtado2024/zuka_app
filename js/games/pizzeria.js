// La pizzería de Zuka (lección 1.1): cada pedido trae una fracción disfrazada (decimal, porcentaje,
// palabras, punto en la recta). Se corta la pizza en el número de porciones que se quiera y se tocan
// las porciones que van con ingredientes; vale cualquier fracción equivalente (0.75 = 3/4 = 6/8).
// params = { maxSlices, orders: [{ label, num, den }] }   state = { orders: [{ slices, shaded }] }

GAMES['pizzeria'] = (() => {
  const matches = (o, t) => o.shaded > 0 && o.shaded * t.den === t.num * o.slices;

  function grade(state, params) {
    const wrong = params.orders.filter((t, i) => !matches(state.orders[i], t));
    if (!wrong.length) return { ok: true, solution: 'Todos los pedidos están bien servidos.' };
    return { ok: false, solution: wrong.map(t => `«${t.label}» es ${t.num}/${t.den} de la pizza`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const orders = params.orders.map(() => ({ slices: 4, shaded: 0 }));
    let locked = false, W = 0, H = 0, cur = 0, pizza = null, buttons = [], tray = [], bite = 0;
    const CRUST = '#D9A066', CHEESE = '#F6D365', TOP = '#D64545', GREEN = '#5FBF5F';

    function layout(w, h) {
      W = w; H = h;
      pizza = { x: w / 2, y: h * 0.43, r: Math.min(w, h) * 0.26 };
      const by = pizza.y + pizza.r + 18, bw = 46;
      buttons = [
        { d: -1, x: w / 2 - 92, y: by, w: bw, h: 36, t: '−' },
        { d: 1, x: w / 2 + 46, y: by, w: bw, h: 36, t: '+' },
      ];
      const n = params.orders.length, tw = Math.min(70, (w - 24) / n);
      tray = params.orders.map((_, i) => ({ x: w / 2 + (i - (n - 1) / 2) * tw, y: h - 40, r: 20 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const fmt = v => String(+v.toFixed(3)).replace('.', ',');

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      // Pizza con sus porciones; las marcadas llevan queso e ingredientes, las demás solo masa.
      function drawPizza(cx, cy, r, o, opts = {}) {
        const n = o.slices, a = p.TWO_PI / n;
        for (let i = 0; i < n; i++) {
          const on = i < o.shaded;
          p.stroke(opts.border || CRUST); p.strokeWeight(r > 40 ? 3 : 1.5);
          p.fill(on ? CHEESE : '#8A6A48');
          p.arc(cx, cy, 2 * r, 2 * r, -p.HALF_PI + i * a, -p.HALF_PI + (i + 1) * a, p.PIE);
          if (on && r > 40) {
            // Ingredientes en la porción, repartidos de forma fija.
            p.noStroke(); p.fill(TOP);
            for (let k = 0; k < 3; k++) {
              const ang = -p.HALF_PI + (i + 0.25 + 0.25 * k) * a, rad = r * (0.35 + 0.2 * ((k + i) % 3));
              p.circle(cx + rad * Math.cos(ang), cy + rad * Math.sin(ang), 9);
            }
            p.fill(GREEN); const ang = -p.HALF_PI + (i + 0.5) * a; p.circle(cx + r * 0.72 * Math.cos(ang), cy + r * 0.72 * Math.sin(ang), 6);
          }
        }
        p.noFill(); p.stroke(opts.border || CRUST); p.strokeWeight(r > 40 ? 5 : 2); p.circle(cx, cy, 2 * r);
        if (opts.ghost) {
          // Porción fantasma: la fracción correcta marcada con línea punteada.
          p.stroke(C.ok); p.strokeWeight(3); p.drawingContext.setLineDash([6, 5]);
          p.arc(cx, cy, 2 * r + 14, 2 * r + 14, -p.HALF_PI, -p.HALF_PI + p.TWO_PI * opts.ghost, p.PIE);
          p.drawingContext.setLineDash([]);
        }
      }

      p.draw = () => {
        p.background(C.bg);
        const t = params.orders[cur], o = orders[cur], good = matches(o, t);
        // Pedido en curso, con su punto en la recta de 0 a 1.
        drawKicker(p, C, `Pedido ${cur + 1} de ${params.orders.length}: sirve`, W / 2, 14, { center: true });
        p.noStroke(); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD);
        p.fill(C.ink); p.textSize(26); p.text(`«${t.label}»`, W / 2, 24);
        const lx0 = W * 0.2, lx1 = W * 0.8, ly = 68;
        p.stroke(C.ink); p.strokeWeight(3); p.line(lx0, ly, lx1, ly);
        [0, 0.5, 1].forEach(v => { p.stroke(C.ink); p.strokeWeight(2); p.line(lx0 + v * (lx1 - lx0), ly - 5, lx0 + v * (lx1 - lx0), ly + 5); });
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.text('0', lx0, ly + 8); p.text('1', lx1, ly + 8);
        drawDot(p, C, lx0 + (t.num / t.den) * (lx1 - lx0), ly, 11, C.sun);
        p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD);
        // Pizza grande.
        drawPizza(pizza.x, pizza.y, pizza.r, o, { border: locked ? (good ? C.ok : C.bad) : null, ghost: locked && !good ? t.num / t.den : 0 });
        if (bite > 0) { bite -= 0.08; }
        // Cortes y lectura de la fracción.
        buttons.forEach(b => {
          drawTile(p, C, b, b.t, { fill: C.sky, size: 22 });
        });
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text('porciones', W / 2, buttons[0].y + 30);
        p.fill(C.ink); p.textSize(20); p.text(o.slices, W / 2, buttons[0].y + 12);
        const col = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.ink;
        p.fill(col); p.textSize(18);
        const read = o.shaded ? `${o.shaded}/${o.slices} = ${fmt(o.shaded / o.slices)}` : 'Toca las porciones';
        p.text(locked && !good ? `Debía ser ${t.num}/${t.den} = ${fmt(t.num / t.den)}` : read, W / 2, buttons[0].y + 58);
        if (good && !locked) { p.fill(C.ok); p.textSize(12); p.text('¡Mismo tamaño que el pedido!', W / 2, buttons[0].y + 78); }
        // Bandeja de pedidos.
        tray.forEach((tr, i) => {
          const oi = orders[i], ti = params.orders[i], gi = matches(oi, ti);
          drawPizza(tr.x, tr.y, tr.r, oi, { border: locked ? (gi ? C.ok : C.bad) : i === cur ? C.brand : gi ? C.ok : CRUST });
          p.noStroke(); p.fill(i === cur ? C.ink : C.mute); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(ti.label, tr.x, tr.y + tr.r + 4);
        });
      };

      p.mousePressed = () => {
        const tr = tray.findIndex(t => Math.hypot(p.mouseX - t.x, p.mouseY - t.y) < t.r + 8);
        if (tr >= 0) { cur = tr; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const o = orders[cur];
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) {
          o.slices = Math.max(1, Math.min(params.maxSlices, o.slices + b.d));
          o.shaded = Math.min(o.shaded, o.slices);
          api.sfx?.tap?.(); ready(); return false;
        }
        const dx = p.mouseX - pizza.x, dy = p.mouseY - pizza.y;
        if (Math.hypot(dx, dy) <= pizza.r + 4) {
          // Tocar una porción: las marcadas van siempre desde arriba en el sentido del reloj.
          const ang = (Math.atan2(dy, dx) + p.HALF_PI + p.TWO_PI) % p.TWO_PI;
          const k = Math.floor(ang / (p.TWO_PI / o.slices));
          o.shaded = k < o.shaded ? k : k + 1;
          bite = 1; api.sfx?.tap?.(); ready(); return false;
        }
      };
      const ready = () => api.ready(orders.every(o => o.shaded > 0));
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ orders: orders.map(o => ({ ...o })) }),
      lock() { locked = true; const bad = params.orders.findIndex((t, i) => !matches(orders[i], t)); if (bad >= 0) cur = bad; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
