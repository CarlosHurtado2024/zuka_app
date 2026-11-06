// El químico (lección 1.3): un vaso con 40 g de alcohol al que se le añade agua con un grifo
// (de 10 en 10 g); un medidor muestra el % de alcohol de la mezcla en vivo. Hay que dejar la
// mezcla con el porcentaje pedido (ejercicio 1.12 del texto guía).
// params = { solute, target, step, max }   state = { water }

GAMES['mezcla'] = (() => {
  const pctOf = (p, water) => (p.solute / (p.solute + water)) * 100;
  const answerOf = p => (100 * p.solute) / p.target - p.solute;

  function grade(state, params) {
    const ok = Math.abs(pctOf(params, state.water) - params.target) < 1e-9;
    const total = (100 * params.solute) / params.target;
    return { ok, solution: `$\\dfrac{100 \\cdot ${params.solute}}{${params.target}} = ${total}$ g de mezcla, así que ${answerOf(params)} g de agua` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { water: 0 };
    let locked = false, W = 0, H = 0, beaker = null, gauge = null, buttons = [], timer = null;
    const WATER = '#5FB8FF', ALCOHOL = C.R;

    function layout(w, h) {
      W = w; H = h;
      beaker = { x: w * 0.1, y: 56, w: w * 0.42, h: h * 0.56 };
      gauge = { x: w * 0.68, y: 56, w: 26, h: h * 0.56 };
      buttons = [
        { d: params.step, x: beaker.x, y: beaker.y + beaker.h + 42, w: beaker.w / 2 - 4, h: 36, t: `+ ${params.step} g` },
        { d: -params.step, x: beaker.x + beaker.w / 2 + 4, y: beaker.y + beaker.h + 42, w: beaker.w / 2 - 4, h: 36, t: `− ${params.step} g` },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    function add(d) {
      st.water = Math.max(0, Math.min(params.max, st.water + d));
      api.ready(st.water > 0);
    }
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const pct = pctOf(params, st.water), good = Math.abs(pct - params.target) < 1e-9;
        const col = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.brand;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`${params.solute} g de alcohol. Añade agua hasta que sea el ${params.target} % de la mezcla`, W / 2, 8, W - 24, 40);
        // Vaso: capa de alcohol y capa de agua (escala: max + solute = vaso lleno).
        const full = params.max + params.solute, unit = beaker.h / full;
        const hA = params.solute * unit, hW = st.water * unit, bottom = beaker.y + beaker.h;
        p.noStroke(); p.fill(ALCOHOL); p.rect(beaker.x, bottom - hA, beaker.w, hA);
        p.fill(WATER); p.rect(beaker.x, bottom - hA - hW, beaker.w, hW);
        p.stroke(C.line); p.strokeWeight(3); p.noFill(); p.rect(beaker.x, beaker.y, beaker.w, beaker.h, 0, 0, 14, 14);
        for (let g = 100; g < full; g += 100) { const y = bottom - g * unit; p.strokeWeight(1); p.line(beaker.x, y, beaker.x + 10, y); }
        p.noStroke(); p.fill(C.ink); p.textSize(12); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD);
        p.text(`alcohol ${params.solute} g`, beaker.x + 14, bottom - hA / 2);
        if (st.water > 0) p.text(`agua ${st.water} g`, beaker.x + 14, bottom - hA - hW / 2);
        p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.NORMAL); p.textSize(11);
        p.text(`mezcla: ${params.solute + st.water} g`, beaker.x + beaker.w / 2, bottom + 8);
        // Grifo sobre el vaso.
        p.stroke(C.mute); p.strokeWeight(6); p.line(beaker.x + beaker.w / 2, beaker.y - 22, beaker.x + beaker.w / 2, beaker.y - 6);
        if (timer) { p.stroke(WATER); p.strokeWeight(4); p.line(beaker.x + beaker.w / 2, beaker.y - 4, beaker.x + beaker.w / 2, bottom - hA - hW); }
        // Medidor de % de alcohol.
        p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(gauge.x, gauge.y, gauge.w, gauge.h, 8);
        const yOf = v => gauge.y + gauge.h - (v / 100) * gauge.h;
        p.noStroke(); p.fill(col); p.rect(gauge.x + 3, yOf(pct), gauge.w - 6, gauge.y + gauge.h - yOf(pct) - 3, 4);
        p.stroke(C.ok); p.strokeWeight(2); p.line(gauge.x - 8, yOf(params.target), gauge.x + gauge.w + 8, yOf(params.target));
        p.noStroke(); p.fill(C.ok); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text(`meta ${params.target} %`, gauge.x + gauge.w + 12, yOf(params.target));
        p.fill(col); p.textSize(20); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD);
        p.text(`${pct.toFixed(1)} %`, gauge.x + gauge.w / 2, gauge.y + gauge.h + 8);
        p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.text('de alcohol', gauge.x + gauge.w / 2, gauge.y + gauge.h + 32);
        [0, 50, 100].forEach(v => { p.fill(C.mute); p.textSize(10); p.textAlign(p.RIGHT, p.CENTER); p.text(v, gauge.x - 4, yOf(v)); });
        buttons.forEach(b => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(C.ink); p.textSize(14); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked && !good ? `Hacían falta ${answerOf(params)} g de agua` : 'Toca o mantén el grifo para añadir agua', W / 2, H - 12);
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        add(b.d); api.sfx?.tap?.();
        stop(); timer = setInterval(() => add(b.d), 140);
        return false;
      };
      p.mouseReleased = () => { if (!timer) return; stop(); return false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; stop(); },
      destroy: () => { stop(); m.remove(); },
    };
  }

  return { grade, create };
})();
