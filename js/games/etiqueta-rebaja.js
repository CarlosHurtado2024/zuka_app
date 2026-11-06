// Etiquetas de rebaja (lección 1.3): tres productos con su precio de lista y un cambio (−20 %,
// +30 %…) y una bandeja de stickers con precios; se arrastra a cada etiqueta el sticker del precio
// final. Entre los stickers hay trampas típicas: el descuento en pesos en vez del precio final y
// restar cuando el cambio era un aumento.
// params = { items: [{ name, price, change }], stickers: [precio] }   state = { placed: [índice de sticker | null] }

GAMES['etiqueta-rebaja'] = (() => {
  const finalOf = it => Math.round(it.price * (1 + it.change / 100));
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const dec = n => String(+n.toFixed(4));
  const pct = c => `${c > 0 ? '+' : '−'}${Math.abs(c)} %`;

  function grade(state, params) {
    const ok = params.items.every((it, i) => {
      const j = state.placed[i];
      return j != null && params.stickers[j] === finalOf(it);
    });
    const solution = params.items.map(it => `${it.name}: ${fmt(it.price)} × ${dec(1 + it.change / 100)} = ${fmt(finalOf(it))}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { placed: params.items.map(() => null) };
    let locked = false, W = 0, H = 0, tags = [], slots = [], tray = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      const n = params.items.length, top = 48, bottom = h - 118, rowH = (bottom - top) / n;
      tags = params.items.map((_, i) => ({ x: 12, y: top + i * rowH + 6, w: w - 24, h: rowH - 12 }));
      slots = tags.map(t => ({ x: t.x + t.w - 104, y: t.y + (t.h - 40) / 2, w: 92, h: 40 }));
      const sw = Math.min(92, (w - 24 - 8 * 2) / 3), gap = (w - 24 - 3 * sw) / 2;
      tray = params.stickers.map((_, j) => ({ x: 12 + (j % 3) * (sw + gap), y: h - 108 + Math.floor(j / 3) * 44, w: sw, h: 38 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const placedAt = j => st.placed.indexOf(j);
    const ready = () => api.ready(st.placed.every(j => j !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function sticker(b, label, col) {
        p.stroke(col); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        p.text(label, b.x + b.w / 2, b.y + b.h / 2);
      }

      p.draw = () => {
        p.background(C.bg);
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text('Pega en cada etiqueta el sticker del precio final', 12, 8, W - 24, 40);
        params.items.forEach((it, i) => {
          const t = tags[i], s = slots[i], j = st.placed[i];
          const good = j !== null && params.stickers[j] === finalOf(it);
          const col = locked ? (good ? C.ok : C.bad) : j !== null ? C.brand : C.line;
          // Etiqueta con agujero y cordel.
          p.stroke(col); p.strokeWeight(2); p.fill(C.card);
          p.beginShape(); p.vertex(t.x + 18, t.y); p.vertex(t.x + t.w, t.y); p.vertex(t.x + t.w, t.y + t.h); p.vertex(t.x + 18, t.y + t.h); p.vertex(t.x, t.y + t.h / 2); p.endShape(p.CLOSE);
          p.fill(C.bg); p.circle(t.x + 16, t.y + t.h / 2, 7);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.LEFT, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
          p.text(it.name, t.x + 30, t.y + 10);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
          p.text(`Lista: $ ${fmt(it.price)}`, t.x + 30, t.y + 30);
          p.fill(it.change < 0 ? C.I : C.Q); p.textStyle(p.BOLD); p.textSize(13);
          p.text(pct(it.change), t.x + 30, t.y + 48);
          // Casilla del precio final.
          if (j === null) {
            p.drawingContext.setLineDash([5, 4]); sticker(s, '', col); p.drawingContext.setLineDash([]);
            p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); p.text('precio final', s.x + s.w / 2, s.y + s.h / 2);
          } else sticker(s, `$ ${fmt(params.stickers[j])}`, col);
          if (locked && !good) {
            p.noStroke(); p.fill(C.ok); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.RIGHT, p.TOP);
            p.text(`→ $ ${fmt(finalOf(it))}`, s.x + s.w, s.y + s.h + 2);
          }
        });
        params.stickers.forEach((v, j) => {
          if (placedAt(j) >= 0 || (drag && drag.j === j)) return;
          sticker(tray[j], `$ ${fmt(v)}`, C.Z);
        });
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Precios bien pegados!' : 'Mira los precios en verde') : 'Sobran tres stickers: son trampas', W / 2, H - 10);
        if (drag) sticker({ x: p.mouseX - 46, y: p.mouseY - 19, w: 92, h: 38 }, `$ ${fmt(params.stickers[drag.j])}`, C.brand);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = slots.findIndex((s, i) => st.placed[i] !== null && inside(s, p.mouseX, p.mouseY));
        if (i >= 0) { drag = { j: st.placed[i] }; st.placed[i] = null; ready(); return false; }
        const j = tray.findIndex((b, j) => placedAt(j) < 0 && inside(b, p.mouseX, p.mouseY));
        if (j >= 0) { drag = { j }; return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const i = tags.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (i >= 0) { st.placed[i] = drag.j; api.sfx?.tap?.(); }   // el sticker que estaba vuelve a la bandeja
        drag = null;
        ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ placed: [...st.placed] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
