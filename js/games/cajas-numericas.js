// Cajas numéricas (lección 1.1): arrastrar cada número a la caja MÁS PEQUEÑA que lo contiene,
// en el diagrama ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ con 𝕀 aparte dentro de ℝ.
// params = { cards: [{ label, tex, set: 'N'|'Z'|'Q'|'I'|'R' }] }   state = { placed: [set|null] }

GAMES['cajas-numericas'] = (() => {
  const NAMES = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', I: '𝕀', R: 'ℝ' };

  function grade(state, params) {
    const wrong = params.cards.filter((c, i) => state.placed[i] !== c.set);
    if (!wrong.length) return { ok: true, solution: 'Cada número está en su caja más pequeña.' };
    return { ok: false, solution: wrong.map(c => `$${c.tex}$ → ${NAMES[c.set]}`).join(', ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const placed = params.cards.map(() => null);
    let locked = false;
    let cards = [], boxes = {}, cols = {}, dragging = -1, grab = { x: 0, y: 0 };
    const CARD_H = 40, SLOT_H = 32;

    // Cajas anidadas en escalera: cada caja deja una columna propia a la derecha para sus números
    // (ℕ ocupa su caja entera); 𝕀 va en una columna aparte dentro de ℝ.
    function layout(w, h) {
      const top = 10, bottom = h * 0.64, gap = 8, head = 28;
      boxes.R = { x: 8, y: top, w: w - 16, h: bottom - top };
      boxes.Q = { x: 16, y: top + head, w: w * 0.75 - 24, h: bottom - top - head - gap };
      boxes.I = { x: w * 0.75, y: boxes.Q.y, w: w * 0.25 - 16, h: boxes.Q.h };
      const colW = (boxes.Q.w - 2 * gap) / 3;
      boxes.Z = { x: boxes.Q.x + gap, y: boxes.Q.y + head, w: boxes.Q.w - gap - colW, h: boxes.Q.h - head - gap };
      boxes.N = { x: boxes.Z.x + gap, y: boxes.Z.y + head, w: boxes.Z.w - gap - colW, h: boxes.Z.h - head - gap };
      const own = (b, inner) => ({ x: inner ? inner.x + inner.w : b.x, y: b.y + head, w: inner ? b.x + b.w - inner.x - inner.w : b.w, h: b.h - head - 4 });
      cols = { N: own(boxes.N), Z: own(boxes.Z, boxes.N), Q: own(boxes.Q, boxes.Z), I: own(boxes.I), R: { x: boxes.R.x, y: boxes.R.y + boxes.R.h - 4, w: 0, h: 0 } };
      const cw = (w - 40) / 3;
      cards = params.cards.map((c, i) => {
        const hx = 14 + (i % 3) * (cw + 6), hy = h * 0.665 + Math.floor(i / 3) * (CARD_H + 10);
        return { ...c, i, w: cw, h: CARD_H, hw: cw, hx, hy, x: hx, y: hy, tx: hx, ty: hy };
      });
    }

    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const regionAt = (x, y) => ['N', 'Z', 'Q', 'I', 'R'].find(k => inside(boxes[k], x, y)) || null;

    // Reacomoda las tarjetas: las colocadas se apilan en la columna propia de su caja (sin taparse);
    // `where(c)` dice en qué caja va cada tarjeta (lo colocado, o la respuesta correcta al bloquear).
    function arrange(where) {
      const groups = {};
      cards.forEach(c => { const k = where(c); if (k) (groups[k] ||= []).push(c); });
      cards.forEach(c => {
        const k = where(c);
        if (!k) { c.w = c.hw; c.h = CARD_H; c.tx = c.hx; c.ty = c.hy; return; }
        const col = cols[k], list = groups[k], n = list.indexOf(c);
        const step = Math.min(SLOT_H + 5, (col.h - SLOT_H) / Math.max(1, list.length - 1));
        c.w = Math.max(40, col.w - 8); c.h = SLOT_H;
        c.tx = col.x + 4; c.ty = col.y + n * step;
      });
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => {
        p.createCanvas(size.w, size.h);
        p.textFont('system-ui');
        layout(size.w, size.h);
      };
      p.onResize = () => {
        layout(size.w, size.h);
        arrange(c => (locked ? c.set : placed[c.i]));
        cards.forEach(c => { c.x = c.tx; c.y = c.ty; });
      };

      function drawBox(k) {
        const b = boxes[k];
        p.stroke(C[k]); p.strokeWeight(2); p.fill(p.red(p.color(C[k])), p.green(p.color(C[k])), p.blue(p.color(C[k])), 28);
        p.rect(b.x, b.y, b.w, b.h, 12);
        p.noStroke(); p.fill(C[k]); p.textSize(18); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.TOP);
        p.text(NAMES[k], b.x + 8, b.y + 6);
      }

      function drawCard(c) {
        const border = locked ? (placed[c.i] === c.set ? C.ok : C.bad) : (c.i === dragging ? C.brand : C.line);
        p.stroke(border); p.strokeWeight(2.5); p.fill(C.card);
        p.rect(c.x, c.y, c.w, c.h, 10);
        p.noStroke(); p.fill(C.ink); p.textSize(Math.min(19, c.w / 3.2)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.text(c.label, c.x + c.w / 2, c.y + c.h / 2 + 1);
      }

      p.draw = () => {
        p.background(C.bg);
        ['R', 'Q', 'Z', 'N', 'I'].forEach(drawBox);
        // Las tarjetas se deslizan hacia su lugar (al soltarlas o al mostrar la respuesta).
        cards.forEach(c => {
          if (c.i !== dragging) { c.x = p.lerp(c.x, c.tx, 0.2); c.y = p.lerp(c.y, c.ty, 0.2); }
        });
        cards.filter(c => c.i !== dragging).forEach(drawCard);
        if (dragging >= 0) drawCard(cards[dragging]);
      };

      p.mousePressed = () => {
        if (locked) return;
        for (let k = cards.length - 1; k >= 0; k--) {
          const c = cards[k];
          if (p.mouseX >= c.x && p.mouseX <= c.x + c.w && p.mouseY >= c.y && p.mouseY <= c.y + c.h) {
            dragging = c.i; grab = { x: p.mouseX - c.x, y: p.mouseY - c.y };
            api.sfx?.tap?.();
            return false;
          }
        }
      };
      p.mouseDragged = () => {
        if (dragging < 0) return;
        const c = cards[dragging];
        c.x = p.constrain(p.mouseX - grab.x, 0, size.w - c.w);
        c.y = p.constrain(p.mouseY - grab.y, 0, size.h - c.h);
        return false;
      };
      p.mouseReleased = () => {
        if (dragging < 0) return;
        const c = cards[dragging];
        placed[c.i] = regionAt(p.mouseX, p.mouseY);
        dragging = -1;
        arrange(k => placed[k.i]);
        api.ready(placed.every(Boolean));
        return false;
      };
    }, 1.5);

    return {
      loaded: m.ready,
      getState: () => ({ placed: [...placed] }),
      lock() {
        locked = true;
        arrange(c => c.set);
      },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
