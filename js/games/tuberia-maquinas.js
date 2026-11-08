// La tubería de máquinas (cálculo, composición de funciones): cada ficha es una máquina (x + 3, x², √x…).
// Tocar una ficha la mete en el primer tubo libre; tocar un tubo lo vacía. Una bolita entra con un número
// y pasa por las máquinas de izquierda a derecha mostrando el valor en cada tramo: la primera máquina es
// la de adentro de la composición. Meta: que la tubería sea la función pedida (se comprueba en varios x).
// params = { chips: [{ tpl: '(□)²', f }], rounds: [{ n, input, goal, goalTxt, chips?: [i…], tests: [x…] }] }
// state = { slots: [[i…]] }

GAMES['tuberia-maquinas'] = (() => {
  const run = (chips, seq, x) => seq.reduce((acc, i) => chips[i].f(acc), x);
  const formulaText = (chips, seq) => seq.reduce((inner, i) => chips[i].tpl.replace('□', inner).replace(/\(x\)/g, 'x'), 'x');
  const eq = (a, b) => (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) < 1e-9;
  const fits = (seq, r, chips) => !!seq && seq.length === r.n && seq.every(i => i != null) && r.tests.every(x => eq(run(chips, seq, x), r.goal(x)));
  const val = y => (Number.isFinite(y) ? numTxt(+y.toFixed(2)) : '¡atasco!');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => fits(state.slots[i], r, params.chips));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) ${r.goalTxt}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const slots = params.rounds.map(r => Array(r.n).fill(null)), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], pipe = [], tray = [], inB = null, outB = null, t0 = 0;

    const avail = r => r.chips || params.chips.map((_, i) => i);
    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], py = 96, ph = 54, side = 46, gap = 8;
      inB = { x: 12, y: py, w: side, h: ph };
      outB = { x: W - 12 - side, y: py, w: side, h: ph };
      const sw = (W - 24 - 2 * side - (r.n + 1) * gap) / r.n;
      pipe = slots[cur].map((_, k) => ({ x: 12 + side + gap + k * (sw + gap), y: py, w: sw, h: ph }));
      const ids = avail(r), cols = W < 360 ? 3 : 4, cw = (W - 24 - (cols - 1) * 8) / cols;
      tray = ids.map((id, k) => ({ id, x: 12 + (k % cols) * (cw + 8), y: py + ph + 92 + Math.floor(k / cols) * 50, w: cw, h: 42 }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); t0 = p.millis(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], seq = slots[cur], full = seq.every(i => i != null), ok = fits(seq, r, params.chips);
        drawTabs(p, C, tabs, cur, i => (locked ? (fits(slots[i], params.rounds[i], params.chips) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, `Arma ${r.goalTxt}`, W / 2, 66, W - 24, 18);
        // Tubo de fondo.
        const cy = inB.y + inB.h / 2;
        p.stroke(C.line); p.strokeWeight(14); p.line(inB.x + inB.w / 2, cy, outB.x + outB.w / 2, cy);
        // Entrada y salida.
        const filled = seq.filter(i => i != null);
        const outVal = run(params.chips, filled, r.input);
        [[inB, `${numTxt(r.input)}`, C.Z], [outB, val(outVal), locked ? (ok ? C.ok : C.bad) : C.N]].forEach(([b, t, col]) => {
          p.stroke(col); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 23);
          p.noStroke(); p.fill(col); fitText(p, t, b.x + b.w / 2, b.y + b.h / 2, b.w - 6, 15);
        });
        // Máquinas.
        let acc = r.input;
        pipe.forEach((b, k) => {
          const id = seq[k];
          p.stroke(id == null ? C.line : C.brand); p.strokeWeight(2); p.fill(id == null ? C.bg : C.card);
          if (id == null) p.drawingContext.setLineDash([5, 4]);
          p.rect(b.x, b.y, b.w, b.h, 10); p.drawingContext.setLineDash([]);
          p.noStroke(); p.fill(id == null ? C.mute : C.ink); p.textStyle(p.BOLD);
          fitText(p, id == null ? `${k + 1}` : formulaText(params.chips, [id]), b.x + b.w / 2, b.y + b.h / 2, b.w - 8, 16);
          if (id != null) { acc = params.chips[id].f(acc); p.fill(C.N); p.textStyle(p.NORMAL); fitText(p, val(acc), b.x + b.w / 2, b.y + b.h + 14, b.w, 12); }
        });
        // Bolita viajera.
        const stops = [inB, ...pipe, outB], tt = ((p.millis() - t0) / 900) % (stops.length - 1), k0 = Math.floor(tt), fr = tt - k0;
        const bx = p.lerp(stops[k0].x + stops[k0].w / 2, stops[k0 + 1].x + stops[k0 + 1].w / 2, fr);
        p.noStroke(); p.fill(C.N); p.circle(bx, inB.y - 10, 10);
        // Fórmula de la tubería.
        p.textStyle(p.BOLD); p.fill(locked ? (ok ? C.ok : C.bad) : C.brand);
        fitText(p, `tu tubería: ${full ? formulaText(params.chips, seq) : '…'}`, W / 2, inB.y + inB.h + 48, W - 24, 16);
        if (locked && !ok) { p.fill(C.ok); fitText(p, r.goalTxt, W / 2, inB.y + inB.h + 70, W - 24, 13); }
        // Bandeja.
        tray.forEach(b => {
          const used = seq.includes(b.id);
          p.stroke(used ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(used ? C.mute : C.ink); p.textStyle(p.BOLD); fitText(p, formulaText(params.chips, [b.id]), b.x + b.w / 2, b.y + b.h / 2, b.w - 8, 16);
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const seq = slots[cur], k = pipe.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (k >= 0 && seq[k] != null) { seq[k] = null; api.ready(false); api.sfx?.tap?.(); return false; }
        const c = tray.find(b => hitBox(b, p.mouseX, p.mouseY));
        if (c) {
          const free = seq.indexOf(null);
          if (free < 0 || seq.includes(c.id)) return false;
          seq[free] = c.id; touched[cur] = true; api.sfx?.tap?.();
          api.ready(slots.every(s => s.every(i => i != null)));
          return false;
        }
      };
    }, 1.1);

    return {
      loaded: m.ready,
      getState: () => ({ slots: slots.map(s => s.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, run, formulaText };
})();
