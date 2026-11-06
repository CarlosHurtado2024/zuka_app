// Descuentos en cascada (lección 1.3, ejercicio 1.10): una etiqueta de precio a la que se le pegan
// stickers de descuento en cualquier orden (el precio cae con cada uno) y un deslizador para fijar
// el descuento único equivalente: los descuentos sucesivos se multiplican, no se suman.
// params = { price, changes, step }   state = { applied: índices[], single: % | null }

GAMES['cascada'] = (() => {
  const factor = p => p.changes.reduce((f, c) => f * (1 + c / 100), 1);
  const answerOf = p => Math.round(100 * (1 - factor(p)));
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const dec = n => String(+n.toFixed(2)).replace('.', '{,}');

  function grade(state, params) {
    const all = params.changes.every((_, i) => state.applied.filter(j => j === i).length === 1) && state.applied.length === params.changes.length;
    const ok = all && state.single === answerOf(params);
    const prod = params.changes.map(c => dec(1 + c / 100)).join(' \\cdot ');
    const sum = params.changes.reduce((s, c) => s + Math.abs(c), 0);
    return { ok, solution: `$${prod} = ${dec(factor(params))} \\Rightarrow ${answerOf(params)}\\%$ (no ${sum} %)` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const COLS = [C.I, C.N, C.Q, C.R];
    const st = { applied: [], single: null };
    let locked = false, W = 0, H = 0, tag = null, tray = [], slider = null, drag = null, shown = params.price;

    function layout(w, h) {
      W = w; H = h;
      tag = { x: w * 0.16, y: 48, w: w * 0.68, h: h * 0.3 };
      tray = params.changes.map((_, i) => ({ x: w / 2 - 36 + (i - (params.changes.length - 1) / 2) * 90, y: tag.y + tag.h + 20, w: 72, h: 72 }));
      slider = { x: 32, y: h - 70, w: w - 64 };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const priceNow = () => st.applied.reduce((v, i) => v * (1 + params.changes[i] / 100), params.price);
    const ready = () => api.ready(st.applied.length === params.changes.length && st.single !== null);
    function setSingle(x) {
      st.single = Math.max(0, Math.min(100, Math.round(((x - slider.x) / slider.w) * 100 / params.step) * params.step));
      ready();
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function sticker(x, y, s, i) {
        p.stroke(C.card); p.strokeWeight(3); p.fill(COLS[i % COLS.length]); p.circle(x, y, s);
        p.noStroke(); p.fill('#fff'); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(s * 0.26);
        p.text(`${params.changes[i] > 0 ? '+' : '−'}${Math.abs(params.changes[i])} %`, x, y);
      }

      p.draw = () => {
        p.background(C.bg);
        const target = priceNow();
        shown += (target - shown) * 0.12;   // el precio cae contando hacia abajo
        if (Math.abs(target - shown) < 1) shown = target;
        const ans = answerOf(params), good = st.single === ans;
        const col = locked ? (good && st.applied.length === params.changes.length ? C.ok : C.bad) : C.brand;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text('Pega los dos descuentos y halla el descuento único', 12, 8, W - 24, 40);
        // Etiqueta.
        p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(tag.x, tag.y, tag.w, tag.h, 16);
        p.noStroke(); p.fill(C.line); p.circle(tag.x + tag.w / 2, tag.y + 14, 12);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.text('precio', tag.x + tag.w / 2, tag.y + 26);
        let y = tag.y + 44;
        let v = params.price;
        st.applied.forEach(i => {
          p.fill(C.mute); p.textSize(13); p.textAlign(p.CENTER, p.TOP); p.text(`$ ${fmt(v)}`, tag.x + tag.w / 2, y);
          p.stroke(C.bad); p.strokeWeight(1.5); p.line(tag.x + tag.w / 2 - 34, y + 8, tag.x + tag.w / 2 + 34, y + 8); p.noStroke();
          v *= 1 + params.changes[i] / 100; y += 18;
        });
        p.fill(C.ink); p.textSize(26); p.textStyle(p.BOLD); p.text(`$ ${fmt(shown)}`, tag.x + tag.w / 2, y + 4);
        st.applied.forEach((i, k) => sticker(tag.x + 24 + k * 34, tag.y + 24, 40, i));
        // Bandeja de stickers.
        params.changes.forEach((_, i) => {
          if (st.applied.includes(i) || drag?.i === i) return;
          sticker(tray[i].x + tray[i].w / 2, tray[i].y + tray[i].h / 2, 64, i);
        });
        // Deslizador del descuento único.
        const xOf = s => slider.x + (s / 100) * slider.w;
        p.fill(C.mute); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.BOTTOM); p.text('descuento único', slider.x, slider.y - 14);
        p.textAlign(p.RIGHT, p.BOTTOM); p.fill(col); p.textSize(16);
        p.text(st.single === null ? '— %' : `${st.single} %  →  $ ${fmt(params.price * (1 - st.single / 100))}`, slider.x + slider.w, slider.y - 12);
        p.stroke(C.line); p.strokeWeight(6); p.line(slider.x, slider.y, slider.x + slider.w, slider.y);
        if (st.single !== null) { p.stroke(col); p.line(slider.x, slider.y, xOf(st.single), slider.y); }
        p.noStroke(); p.fill(C.card); p.stroke(col); p.strokeWeight(3); p.circle(xOf(st.single ?? 0), slider.y, 26);
        if (locked) { p.noStroke(); p.fill(C.ok); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text(`${ans} %`, xOf(ans), slider.y + 16); p.stroke(C.ok); p.strokeWeight(2); p.line(xOf(ans), slider.y - 10, xOf(ans), slider.y + 10); }
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked && !good ? `El descuento único era ${ans} %` : 'Arrastra los stickers a la etiqueta; luego el deslizador', W / 2, H - 12);
        if (drag) sticker(p.mouseX, p.mouseY, 64, drag.i);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = tray.findIndex((b, i) => !st.applied.includes(i) && inside(b, p.mouseX, p.mouseY));
        if (i >= 0) { drag = { i }; return false; }
        if (Math.abs(p.mouseY - slider.y) <= 22 && p.mouseX >= slider.x - 16 && p.mouseX <= slider.x + slider.w + 16) { drag = { slider: true }; setSingle(p.mouseX); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; if (drag.slider) setSingle(p.mouseX); return false; };
      p.mouseReleased = () => {
        if (!drag) return;
        if (!drag.slider && inside(tag, p.mouseX, p.mouseY)) { st.applied.push(drag.i); api.sfx?.tap?.(); ready(); }
        drag = null;
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ applied: [...st.applied], single: st.single }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
