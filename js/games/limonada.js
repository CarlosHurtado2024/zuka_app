// Limonada (lección 1.2): una jarra modelo con la razón limones : agua y una jarra grande que se
// llena tocando botones. El color de la mezcla depende solo de la razón, así que si coincide con
// el modelo, la limonada «sabe igual». Correcto si la razón es la del modelo y hay bastantes limones.
// params = { base: [limones, agua], minLemons, maxEach }   state = { lemons, water }

GAMES['limonada'] = (() => {
  function grade(state, params) {
    const [bl, bw] = params.base;
    const ok = state.lemons >= params.minLemons && state.lemons * bw === state.water * bl;
    return { ok, solution: `La razón debe ser $${bl} : ${bw}$ con al menos ${params.minLemons} limones, por ejemplo $${bl * 2} : ${bw * 2}$.` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { lemons: 0, water: 0 };
    const [bl, bw] = params.base;
    let locked = false, W = 0, H = 0, jars = {}, buttons = [], pour = 0;

    function layout(w, h) {
      W = w; H = h;
      const jw = w * 0.3, jh = h * 0.38, y = h * 0.14;
      jars = { model: { x: w * 0.22 - jw / 2, y, w: jw, h: jh }, big: { x: w * 0.68 - jw * 0.6, y: y - 20, w: jw * 1.2, h: jh + 20 } };
      const bw2 = (w - 36) / 4, by = h * 0.82;
      buttons = [
        { k: 'lemons', d: -1, x: 12, y: by, w: bw2, h: 36, t: '− 🍋' }, { k: 'lemons', d: 1, x: 16 + bw2, y: by, w: bw2, h: 36, t: '+ 🍋' },
        { k: 'water', d: -1, x: 20 + 2 * bw2, y: by, w: bw2, h: 36, t: '− 💧' }, { k: 'water', d: 1, x: 24 + 3 * bw2, y: by, w: bw2, h: 36, t: '+ 💧' },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    // Color de la mezcla: de agua clara (0 limones) a amarillo intenso (solo limones).
    const mix = (p, l, w) => { const t = l + w ? l / (l + w) : 0; return p.lerpColor(p.color('#5EC8FF'), p.color('#FFD23F'), Math.min(1, t * 1.6)); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function jar(j, l, w, label, cap) {
        const fill = Math.min(1, (l + w) / cap), lvl = j.h * (0.1 + 0.85 * fill);
        p.noStroke(); p.fill(mix(p, l, w)); p.rect(j.x + 3, j.y + j.h - lvl, j.w - 6, lvl - 3, 0, 0, 12, 12);
        // Limones flotando.
        p.fill(C.sun); p.stroke(shade(C.sun, 0.7)); p.strokeWeight(1);
        for (let i = 0; i < Math.min(l, 24); i++) p.circle(j.x + 12 + (i % 4) * (j.w - 24) / 3, j.y + j.h - 12 - Math.floor(i / 4) * 14, 9);
        p.stroke(C.ink); p.strokeWeight(2.5); p.noFill(); p.rect(j.x, j.y, j.w, j.h, 4, 4, 14, 14);
        p.line(j.x + j.w, j.y + 10, j.x + j.w + 10, j.y + 18); p.line(j.x + j.w + 10, j.y + 18, j.x + j.w, j.y + j.h - 18);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(12);
        p.text(label, j.x + j.w / 2, j.y + j.h + 6);
        p.fill(C.ink); p.textSize(16); p.text(`${l} 🍋 : ${w} 💧`, j.x + j.w / 2, j.y + j.h + 22);
      }

      p.draw = () => {
        p.background(C.bg);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        drawKicker(p, C, 'Que sepa igual que el modelo', W / 2, 16, { center: true });
        jar(jars.model, bl, bw, 'Modelo', bl + bw);
        jar(jars.big, st.lemons, st.water, 'Tu jarra', 2 * params.maxEach);
        pour = Math.max(0, pour - 0.05);
        const same = st.lemons + st.water > 0 && st.lemons * bw === st.water * bl;
        const good = grade(st, params).ok;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(14); p.textStyle(p.BOLD);
        p.fill(locked ? (good ? C.ok : C.bad) : same ? C.ok : C.mute);
        const msg = locked && !good ? `Debía ser ${bl} : ${bw} con ≥ ${params.minLemons} limones` : same ? (st.lemons >= params.minLemons ? '¡Mismo sabor y jarra grande!' : 'Mismo sabor… pero la jarra es pequeña') : st.lemons + st.water ? 'El color no coincide con el modelo' : 'Toca los botones para agregar';
        p.text(msg, W / 2, H * 0.72);
        buttons.forEach(b => {
          drawTile(p, C, b, b.t, { size: 15 });
        });
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        st[b.k] = Math.max(0, Math.min(params.maxEach, st[b.k] + b.d));
        api.sfx?.tap?.(); pour = 1;
        api.ready(st.lemons > 0 && st.water > 0);
        return false;
      };
    }, 1.05);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
