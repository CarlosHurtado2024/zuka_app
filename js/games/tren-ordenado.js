// El tren ordenado (Álgebra 1.3, axiomas de orden). Cada ronda trae un tren de vagones con números reales
// (enteros, fracciones, decimales, raíces, π) en desorden. Se arrastra cada vagón a su lugar para que el tren
// quede de menor a mayor, de izquierda a derecha como en la recta. a < b quiere decir que b − a es positivo:
// b va más a la derecha. Al comprobar aparecen los signos < entre vagones.
// params = { rounds: [{ items: [{ label, v }] }] }   state = { orders: [[índice de item, …] por ronda] }

GAMES['tren-ordenado'] = (() => {
  const sorted = order => order.every((v, k) => k === 0 || order[k - 1] < v);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => {
      const o = state.orders?.[i];
      return Array.isArray(o) && o.length === r.items.length && new Set(o).size === o.length && o.every(k => r.items[k]) && sorted(o.map(k => r.items[k].v));
    });
    const solution = params.rounds.map(r => [...r.items].sort((a, b) => a.v - b.v).map(it => it.label).join(' < ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const O = R.map((r, i) => shuffledOrder(r.items.length, `tren${i}${r.items.map(t => t.label).join()}`));
    const moved = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], drag = null, slot = { w: 0, y: 0 };

    function layout(w, h) { W = w; H = h; tabs = roundTabs(R.length, w); }
    const geo = () => { const n = R[cur].items.length, sw = (W - 20) / n; return { n, sw, ww: sw - 8, y: H * 0.56 }; };
    const slotX = k => { const g = geo(); return 10 + k * g.sw + 4; };

    function wagon(p, x, y, w, label, col, lifted) {
      const h = 40;
      // Vagón: bloque crema con relieve (color sol al levantarlo), techo del color del estado y ruedas con centro sol.
      drawTile(p, C, { x, y: y - h, w, h: h - 3 }, '', { fill: lifted ? C.sun : C.cream, r: 7, lift: 3, ring: lifted ? C.sun : null });
      p.noFill(); p.stroke(col); p.strokeWeight(2); p.rect(x, y - h, w, h - 3, 7);   // borde: en el tema claro el vagón crema casi no se distingue del papel
      p.noStroke(); p.fill(col); p.rect(x, y - h, w, 7, 7, 7, 0, 0);
      p.fill(C.ink); p.circle(x + w * 0.25, y + 5, 13); p.circle(x + w * 0.75, y + 5, 13);
      p.fill(C.sun); p.circle(x + w * 0.25, y + 5, 5); p.circle(x + w * 0.75, y + 5, 5);
      p.fill(inkOn(lifted ? C.sun : C.cream, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, label, x + w / 2, y - h / 2 + 3, w - 6, 16);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], o = O[cur], g = geo(), good = sorted(o.map(k => r.items[k].v));
        drawTabs(p, C, tabs, cur, i => (locked ? (sorted(O[i].map(k => R[i].items[k].v)) ? C.ok : C.bad) : i === cur ? C.brand : moved[i] ? C.R : C.line));
        drawKicker(p, C, 'Ordena el tren de menor a mayor', W / 2, 58, { center: true });
        p.textAlign(p.CENTER, p.CENTER); p.noStroke();
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Arrastra cada vagón a su lugar', W / 2, 80, W - 24, 12);
        // Riel
        p.stroke(C.mute); p.strokeWeight(3); p.line(6, g.y + 12, W - 6, g.y + 12);
        for (let x = 12; x < W; x += 16) { p.strokeWeight(2); p.line(x, g.y + 12, x - 4, g.y + 18); }
        // Vagones
        o.forEach((k, pos) => {
          if (drag && drag.k === k) return;
          const col = locked ? (good ? C.ok : C.bad) : C.R;
          wagon(p, slotX(pos), g.y, g.ww, r.items[k].label, col, false);
          if (pos > 0) {
            p.noStroke(); p.fill(locked ? (good ? C.ok : C.mute) : C.line); p.textStyle(p.BOLD); p.textSize(14);
            p.text(locked && good ? '<' : '•', slotX(pos) - 4, g.y - 20);
          }
        });
        if (drag) wagon(p, drag.x - g.ww / 2, g.y - 18, g.ww, r.items[drag.k].label, C.brand, true);
        // Recta-guía: menor a la izquierda, mayor a la derecha
        const yy = g.y + 52;
        p.stroke(C.mute); p.strokeWeight(1.5); p.line(30, yy, W - 30, yy);
        p.noStroke(); p.fill(C.mute); p.triangle(W - 30, yy, W - 38, yy - 4, W - 38, yy + 4); p.triangle(30, yy, 38, yy - 4, 38, yy + 4);
        p.textStyle(p.NORMAL); p.textSize(11); p.text('menor', 52, yy + 14); p.text('mayor', W - 52, yy + 14);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, [...r.items].sort((a, b) => a.v - b.v).map(t => t.label).join(' < '), W / 2, H - 20, W - 20, 13); }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY, g = geo();
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; drag = null; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (y < g.y - 60 || y > g.y + 24) return;
        const pos = Math.floor((x - 10) / g.sw);
        if (pos < 0 || pos >= g.n) return;
        drag = { k: O[cur][pos], x }; api.sfx?.tap?.(); return false;
      };
      p.mouseDragged = () => { if (drag) { drag.x = p.mouseX; return false; } };
      p.mouseReleased = () => {
        if (!drag) return;
        const g = geo(), o = O[cur].filter(k => k !== drag.k);
        const pos = Math.min(g.n - 1, Math.max(0, Math.floor((drag.x - 10) / g.sw)));
        o.splice(pos, 0, drag.k); O[cur] = o; moved[cur] = true; drag = null;
        api.ready(moved.every(Boolean));
      };
    }, 1.1);

    return {
      loaded: m.ready,
      getState: () => ({ orders: O.map(o => [...o]) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
