// Directa, inversa o ninguna (lección 1.2): arrastrar cada situación a la caja de la relación que
// describe. Al bloquear, las mal clasificadas se mueven a su caja correcta.
// params = { items: [{ text, kind: 'directa'|'inversa'|'ninguna' }] }   state = { assigned: [kind | null] }

GAMES['directa-inversa'] = (() => {
  const KINDS = ['directa', 'inversa', 'ninguna'];
  const NAMES = { directa: 'Directa', inversa: 'Inversa', ninguna: 'Ninguna' };

  function grade(state, params) {
    const wrong = params.items.filter((it, i) => state.assigned[i] !== it.kind);
    if (!wrong.length) return { ok: true, solution: 'Todas las situaciones están bien clasificadas.' };
    return { ok: false, solution: wrong.map(it => `${it.text} → ${NAMES[it.kind]}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const assigned = params.items.map(() => null);
    let locked = false, boxes = {}, cards = [], drag = -1, grab = { x: 0, y: 0 }, W = 0, H = 0;
    const CARD_H = 44, COLORS = { directa: C.Q, inversa: C.N, ninguna: C.I };

    function layout(w, h) {
      W = w; H = h;
      const bw = (w - 32) / 3, by = 30, bh = h * 0.5;
      KINDS.forEach((k, i) => { boxes[k] = { x: 12 + i * (bw + 4), y: by, w: bw, h: bh }; });
      const cw = (w - 28) / 2;
      cards = params.items.map((it, i) => {
        const hx = 12 + (i % 2) * (cw + 4), hy = by + bh + 14 + Math.floor(i / 2) * (CARD_H + 6);
        return { ...it, i, w: cw, h: CARD_H, hw: cw, hx, hy, x: hx, y: hy, tx: hx, ty: hy };
      });
      arrange(c => assigned[c.i]);
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    // Las tarjetas colocadas se apilan dentro de su caja, más angostas; las demás vuelven a la bandeja.
    function arrange(where) {
      const n = {};
      cards.forEach(c => {
        const k = where(c);
        if (!k) { c.w = c.hw; c.tx = c.hx; c.ty = c.hy; return; }
        const b = boxes[k], slot = (n[k] = (n[k] || 0) + 1) - 1;
        c.w = b.w - 8; c.tx = b.x + 4; c.ty = b.y + 26 + slot * (CARD_H + 4);
      });
    }
    // Texto en hasta tres líneas que quepa en la tarjeta.
    function wrap(p, text, maxW) {
      const words = text.split(' '), lines = [''];
      words.forEach(w => { const t = (lines[lines.length - 1] + ' ' + w).trim(); if (p.textWidth(t) <= maxW || !lines[lines.length - 1]) lines[lines.length - 1] = t; else lines.push(w); });
      return lines.slice(0, 3);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); cards.forEach(c => { c.x = c.tx; c.y = c.ty; }); };

      function drawCard(c) {
        const k = locked ? c.kind : assigned[c.i];
        const border = locked ? (assigned[c.i] === c.kind ? C.ok : C.bad) : (c.i === drag ? C.brand : k ? COLORS[k] : C.line);
        p.stroke(border); p.strokeWeight(2); p.fill(C.card); p.rect(c.x, c.y, c.w, c.h, 9);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.textSize(c.w < 140 ? 9.5 : 11); const lh = c.w < 140 ? 11 : 12.5;
        const lines = wrap(p, c.text, c.w - 10);
        lines.forEach((ln, j) => p.text(ln, c.x + c.w / 2, c.y + c.h / 2 + (j - (lines.length - 1) / 2) * lh));
      }

      p.draw = () => {
        p.background(C.bg);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(12);
        p.text('¿Cómo se relacionan las dos magnitudes?', W / 2, 8);
        KINDS.forEach(k => {
          const b = boxes[k], col = COLORS[k];
          p.stroke(col); p.strokeWeight(2); p.fill(p.red(p.color(col)), p.green(p.color(col)), p.blue(p.color(col)), 24); p.rect(b.x, b.y, b.w, b.h, 12);
          p.noStroke(); p.fill(col); p.textSize(13); p.textAlign(p.CENTER, p.TOP); p.text(NAMES[k], b.x + b.w / 2, b.y + 6);
        });
        cards.forEach(c => { if (c.i !== drag) { c.x = p.lerp(c.x, c.tx, 0.2); c.y = p.lerp(c.y, c.ty, 0.2); } });
        cards.filter(c => c.i !== drag).forEach(drawCard);
        if (drag >= 0) drawCard(cards[drag]);
      };

      p.mousePressed = () => {
        if (locked) return;
        for (let k = cards.length - 1; k >= 0; k--) {
          const c = cards[k];
          if (inside(c, p.mouseX, p.mouseY)) { drag = c.i; grab = { x: p.mouseX - c.x, y: p.mouseY - c.y }; api.sfx?.tap?.(); return false; }
        }
      };
      p.mouseDragged = () => {
        if (drag < 0) return;
        const c = cards[drag];
        c.x = p.constrain(p.mouseX - grab.x, 0, W - c.w); c.y = p.constrain(p.mouseY - grab.y, 0, H - c.h);
        return false;
      };
      p.mouseReleased = () => {
        if (drag < 0) return;
        assigned[drag] = KINDS.find(k => inside(boxes[k], p.mouseX, p.mouseY)) || null;
        drag = -1;
        arrange(c => assigned[c.i]);
        api.ready(assigned.every(Boolean));
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ assigned: [...assigned] }),
      lock() { locked = true; arrange(c => c.kind); },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
