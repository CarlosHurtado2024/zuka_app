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
      // Bandeja compacta anclada al pie (dos filas de 34 px) y las etiquetas reparten lo que queda.
      const n = params.items.length, rows = Math.ceil(params.stickers.length / 3), top = 48;
      const trayY = h - 22 - rows * 40, bottom = trayY - 6, rowH = (bottom - top) / n;
      tags = params.items.map((_, i) => ({ x: 12, y: top + i * rowH + 4, w: w - 24, h: rowH - 8 }));
      const sw = Math.min(92, (w - 24 - 8 * 2) / 3), gap = (w - 24 - 3 * sw) / 2, slotH = Math.min(38, rowH - 16);
      slots = tags.map(t => ({ x: t.x + t.w - sw - 8, y: t.y + (t.h - slotH) / 2, w: sw, h: slotH }));
      tray = params.stickers.map((_, j) => ({ x: 12 + (j % 3) * (sw + gap), y: trayY + Math.floor(j / 3) * 40, w: sw, h: 34 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const placedAt = j => st.placed.indexOf(j);
    const ready = () => api.ready(st.placed.every(j => j !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function sticker(b, label, col) {
        // Hueco vacío: solo el borde (el punteado lo pone quien llama). Sticker: crema en la bandeja, color sol ya pegado.
        if (label === '') { p.stroke(col === C.line ? C.mute : col); p.strokeWeight(1.5); p.noFill(); p.rect(b.x, b.y, b.w, b.h, 8); return; }
        const f = col === C.ok || col === C.bad ? col : col === C.brand ? C.sun : C.cream;
        drawTile(p, C, b, label, { fill: f, r: 8, lift: 2, size: b.w < 80 ? 12 : 14 });
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
          // Dos líneas: «Tenis  −20 %» y «Lista: $ 45.000» (al bloquear, el precio correcto si falló).
          const small = t.h < 52, y1 = t.y + t.h / 2 - (small ? 15 : 17), y2 = t.y + t.h / 2 + (small ? 2 : 3);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.LEFT, p.TOP); p.textStyle(p.BOLD); p.textSize(small ? 13 : 14);
          p.text(it.name, t.x + 28, y1);
          const nameW = p.textWidth(it.name);
          p.fill(it.change < 0 ? C.I : C.Q); p.textSize(small ? 12 : 13);
          p.text(pct(it.change), t.x + 28 + nameW + 8, y1 + 1);
          if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(12); p.text(`→ $ ${fmt(finalOf(it))}`, t.x + 28, y2); }
          else { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.text(`Lista: $ ${fmt(it.price)}`, t.x + 28, y2); }
          // Casilla del precio final.
          if (j === null) {
            p.drawingContext.setLineDash([5, 4]); sticker(s, '', col); p.drawingContext.setLineDash([]);
            p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); p.text('precio final', s.x + s.w / 2, s.y + s.h / 2);
          } else sticker(s, `$ ${fmt(params.stickers[j])}`, col);
        });
        params.stickers.forEach((v, j) => {
          if (placedAt(j) >= 0 || (drag && drag.j === j)) return;
          sticker(tray[j], `$ ${fmt(v)}`, C.Z);
        });
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        const extra = params.stickers.length - params.items.length;
        p.text(locked ? (grade(st, params).ok ? '¡Precios bien pegados!' : 'Mira los precios en verde') : extra > 0 ? `Sobra${extra > 1 ? 'n' : ''} ${extra} sticker${extra > 1 ? 's' : ''}: ${extra > 1 ? 'son trampas' : 'es trampa'}` : 'Arrastra cada sticker a su etiqueta', W / 2, H - 10);
        if (drag) sticker({ x: p.mouseX - tray[0].w / 2, y: p.mouseY - 17, w: tray[0].w, h: 34 }, `$ ${fmt(params.stickers[drag.j])}`, C.brand);
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
