// La máquina de dos etapas (lección 1.3, ejercicio 1.19): una cantidad entra, sube un 30 % y luego
// baja un 20 %; la salida es conocida. Con una perilla se fija la entrada y la máquina recalcula
// las etapas en vivo. Hay que dar con la entrada que produce exactamente esa salida.
// params = { changes, output, max, step }   state = { input: número | null }

GAMES['dos-etapas'] = (() => {
  const factor = p => p.changes.reduce((f, c) => f * (1 + c / 100), 1);
  const answerOf = p => Math.round(p.output / factor(p));
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const texNum = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  const dec = n => String(+n.toFixed(2)).replace('.', '{,}');

  function grade(state, params) {
    const ok = state.input !== null && Math.round(state.input * factor(params)) === params.output;
    const prod = params.changes.map(c => dec(1 + c / 100)).join(' \\cdot ');
    return { ok, solution: `$${prod} = ${dec(factor(params))} \\Rightarrow x = \\dfrac{${texNum(params.output)}}{${dec(factor(params))}} = ${texNum(answerOf(params))}$` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { input: null };
    const TURN = 2000;   // una vuelta completa de la perilla
    let locked = false, W = 0, H = 0, knob = null, boxes = [], buttons = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      knob = { x: w * 0.26, y: h * 0.5, r: Math.min(w * 0.17, 60) };
      const bx = w * 0.52, bw = w * 0.44, bh = 44, gap = 22;
      const names = ['entrada', ...params.changes.map(c => `${c > 0 ? '+' : '−'}${Math.abs(c)} %`), 'salida'];
      boxes = names.map((t, i) => ({ t, x: bx, y: 64 + i * (bh + gap), w: bw, h: bh }));
      buttons = [
        { d: -params.step, x: knob.x - knob.r - 4, y: knob.y + knob.r + 16, w: knob.r - 2, h: 32, t: `−${params.step}` },
        { d: params.step, x: knob.x + 6, y: knob.y + knob.r + 16, w: knob.r - 2, h: 32, t: `+${params.step}` },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const valueOf = () => (st.input === null ? 0 : st.input);
    function setInput(v) {
      st.input = Math.max(0, Math.min(params.max, Math.round(v / params.step) * params.step));
      api.ready(true);
    }
    const stages = () => {
      const out = [valueOf()];
      params.changes.forEach(c => out.push(out[out.length - 1] * (1 + c / 100)));
      return out;
    };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const vals = stages(), out = vals[vals.length - 1];
        const good = st.input !== null && Math.round(out) === params.output;
        const col = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.brand;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text(`Subió ${params.changes[0]} % y luego bajó ${Math.abs(params.changes[1])} %; terminó en ${fmt(params.output)}. ¿Cuánto valía al principio?`, W / 2, 6, W - 24, 50);
        // Perilla.
        const ang = (valueOf() / TURN) * Math.PI * 2 - Math.PI / 2;
        p.stroke(C.line); p.strokeWeight(3); p.fill(C.card); p.circle(knob.x, knob.y, knob.r * 2);
        for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; p.stroke(C.mute); p.strokeWeight(1.5); p.line(knob.x + Math.cos(a) * (knob.r + 4), knob.y + Math.sin(a) * (knob.r + 4), knob.x + Math.cos(a) * (knob.r + 9), knob.y + Math.sin(a) * (knob.r + 9)); }
        p.stroke(col); p.strokeWeight(5); p.line(knob.x, knob.y, knob.x + Math.cos(ang) * (knob.r - 10), knob.y + Math.sin(ang) * (knob.r - 10));
        p.noStroke(); p.fill(C.ink); p.circle(knob.x, knob.y, 10);
        p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.TOP); p.text(`una vuelta = ${fmt(TURN)}`, knob.x, knob.y - knob.r - 22);
        buttons.forEach(b => {
          p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(C.ink); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2);
        });
        // Máquina: cajas en columna con flechas.
        boxes.forEach((b, i) => {
          const last = i === boxes.length - 1;
          const bc = last ? col : i === 0 ? C.brand : C.line;
          p.stroke(bc); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.LEFT, p.TOP); p.text(b.t, b.x + 8, b.y + 4);
          p.fill(C.ink); p.textSize(15); p.textStyle(p.BOLD); p.textAlign(p.RIGHT, p.BOTTOM);
          const v = last ? params.output : vals[i];
          p.text(st.input === null && i < boxes.length - 1 ? '—' : fmt(v), b.x + b.w - 8, b.y + b.h - 4);
          if (!last) { p.stroke(C.mute); p.strokeWeight(2); p.line(b.x + b.w / 2, b.y + b.h + 2, b.x + b.w / 2, b.y + b.h + 18); p.line(b.x + b.w / 2 - 5, b.y + b.h + 12, b.x + b.w / 2, b.y + b.h + 18); p.line(b.x + b.w / 2 + 5, b.y + b.h + 12, b.x + b.w / 2, b.y + b.h + 18); }
        });
        // Semáforo: la salida calculada frente a la esperada.
        const sb = boxes[boxes.length - 1];
        p.noStroke(); p.fill(col); p.circle(sb.x + sb.w - 10, sb.y - 8, 14);
        p.fill(col); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.RIGHT, p.BOTTOM);
        p.text(st.input === null ? '' : good ? '¡coincide!' : `sale ${fmt(out)}`, sb.x + sb.w - 20, sb.y - 2);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked && !good ? `La entrada era ${fmt(answerOf(params))}` : 'Gira la perilla (o toca ±) hasta que la salida coincida', W / 2, H - 12);
      };

      const angleAt = (x, y) => Math.atan2(y - knob.y, x - knob.x);
      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { setInput(valueOf() + b.d); api.sfx?.tap?.(); return false; }
        if (Math.hypot(p.mouseX - knob.x, p.mouseY - knob.y) <= knob.r + 14) { drag = { a: angleAt(p.mouseX, p.mouseY), v: valueOf() }; return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        let d = angleAt(p.mouseX, p.mouseY) - drag.a;
        if (d > Math.PI) d -= Math.PI * 2; else if (d < -Math.PI) d += Math.PI * 2;
        drag.a += d; drag.v += (d / (Math.PI * 2)) * TURN;
        drag.v = Math.max(0, Math.min(params.max, drag.v));
        setInput(drag.v);
        return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = null; api.sfx?.tap?.(); return false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
