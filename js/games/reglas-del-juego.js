// Reglas del juego (lección 1.1): arrastrar el nombre de cada propiedad de los reales sobre la
// igualdad que la muestra. Una etiqueta sirve para varias igualdades (se clona al soltarla).
// Si la distributiva queda bien al bloquear, se anima el modelo de área a(b + c) = ab + ac.
// params = { rules: string[], items: [{ label, tex, rule }] }   state = { assigned: [regla | null] }

GAMES['reglas-del-juego'] = (() => {
  function grade(state, params) {
    const wrong = params.items.filter((it, i) => state.assigned[i] !== it.rule);
    if (!wrong.length) return { ok: true, solution: 'Cada igualdad tiene su propiedad.' };
    return { ok: false, solution: wrong.map(it => `$${it.tex}$ → ${it.rule}`).join(', ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const assigned = params.items.map(() => null);
    let locked = false, rows = [], tags = [], drag = null, W = 0, H = 0, animT = -1, animRow = -1;
    const ROW_H = 44, TAG_H = 30;

    function layout(w, h) {
      W = w; H = h;
      // Filas: igualdad a la izquierda y hueco para la etiqueta a la derecha.
      const slotW = Math.min(118, w * 0.36), top = 12;
      rows = params.items.map((it, i) => ({ ...it, i, y: top + i * (ROW_H + 8), slot: { x: w - 12 - slotW, y: top + i * (ROW_H + 8) + (ROW_H - TAG_H) / 2, w: slotW, h: TAG_H } }));
      // Bandeja de etiquetas en dos columnas bajo las filas.
      const trayY = rows[rows.length - 1].y + ROW_H + 22, tw = (w - 24 - 8) / 2;
      tags = params.rules.map((r, k) => ({ rule: r, x: 12 + (k % 2) * (tw + 8), y: trayY + Math.floor(k / 2) * (TAG_H + 8), w: tw, h: TAG_H }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function tag(b, text, color, fill = C.card) {
        p.stroke(color); p.strokeWeight(2); p.fill(fill); p.rect(b.x, b.y, b.w, b.h, 9);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(Math.min(14, b.w / 8));
        p.text(text, b.x + b.w / 2, b.y + b.h / 2 + 1);
      }

      // Modelo de área: un rectángulo a × (b + c) que se parte en a·b y a·c.
      function area(t) {
        const r = rows[animRow], bx = 12, by = r.y, bh = ROW_H - 6, bw = r.slot.x - 24;
        const b = bw * 0.6, c = bw * 0.4, gap = 10 * Math.min(1, t * 2);
        p.noStroke(); p.fill(C.Q + '55'); p.rect(bx, by, b, bh, 6); p.fill(C.N + '55'); p.rect(bx + b + gap, by, c - gap, bh, 6);
        p.stroke(C.ok); p.strokeWeight(2); p.noFill(); p.rect(bx, by, b, bh, 6); p.rect(bx + b + gap, by, c - gap, bh, 6);
        p.noStroke(); p.fill(C.ink); p.textSize(14); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        if (t > 0.5) { p.text('a·b', bx + b / 2, by + bh / 2); p.text('a·c', bx + b + gap + (c - gap) / 2, by + bh / 2); }
        else p.text('a(b + c)', bx + bw / 2, by + bh / 2);
      }

      p.draw = () => {
        p.background(C.bg);
        rows.forEach(r => {
          const good = assigned[r.i] === r.rule;
          if (locked && animRow === r.i) { animT = Math.min(1, animT + 0.02); area(animT); }
          else {
            p.noStroke(); p.fill(C.ink); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(Math.min(17, (r.slot.x - 24) / 11));
            p.text(r.label, 14, r.y + ROW_H / 2);
          }
          const col = locked ? (good ? C.ok : C.bad) : (assigned[r.i] ? C.brand : C.line);
          if (assigned[r.i]) tag(r.slot, locked && !good ? r.rule : assigned[r.i], col, locked && !good ? C.bad + '33' : C.card);
          else { p.stroke(col); p.strokeWeight(2); p.drawingContext.setLineDash([6, 5]); p.noFill(); p.rect(r.slot.x, r.slot.y, r.slot.w, r.slot.h, 9); p.drawingContext.setLineDash([]); }
        });
        tags.forEach(t => tag(t, t.rule, C.line));
        if (drag) tag({ x: p.mouseX - drag.dx, y: p.mouseY - drag.dy, w: drag.w, h: drag.h }, drag.rule, C.brand);
      };

      p.mousePressed = () => {
        if (locked) return;
        // Tocar una etiqueta colocada la quita.
        const r = rows.find(r => assigned[r.i] && inside(r.slot, p.mouseX, p.mouseY));
        if (r) { assigned[r.i] = null; api.ready(false); return false; }
        const t = tags.find(t => inside(t, p.mouseX, p.mouseY));
        if (t) { drag = { rule: t.rule, w: t.w, h: t.h, dx: p.mouseX - t.x, dy: p.mouseY - t.y }; api.sfx?.tap?.(); return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const cx = p.mouseX - drag.dx + drag.w / 2, cy = p.mouseY - drag.dy + drag.h / 2;
        const r = rows.find(r => inside({ x: r.slot.x - 10, y: r.y, w: r.slot.w + 22, h: ROW_H }, cx, cy));
        if (r) assigned[r.i] = drag.rule;
        drag = null;
        api.ready(assigned.every(Boolean));
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ assigned: [...assigned] }),
      lock() {
        locked = true;
        const d = rows.find(r => /distributiva/i.test(r.rule) && assigned[r.i] === r.rule);
        if (d) { animRow = d.i; animT = 0; }
      },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
