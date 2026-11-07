// Ubica en la recta (lección 1.1): soltar cada número sobre la recta real en su lugar.
// params = { min, max, tol, points: [{ label, tex, value }] }   state = { values: [número | null] }

GAMES['ubica-en-recta'] = (() => {
  function grade(state, params) {
    const ok = params.points.every((pt, i) => state.values[i] !== null && Math.abs(state.values[i] - pt.value) < params.tol);
    if (ok) return { ok: true, solution: 'Todos los puntos están en su lugar.' };
    return { ok: false, solution: params.points.map(pt => `$${pt.tex} \\approx ${pt.value.toFixed(2)}$`).join(', ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const values = params.points.map(() => null);
    let locked = false, chips = [], map = null, lineY = 0, drag = -1, grab = { x: 0, y: 0 }, W = 0;
    const CH = 34;

    function layout(w, h) {
      W = w;
      lineY = h * 0.56;
      map = lineMap(params.min, params.max, 26, w - 26);
      const cw = Math.min(70, (w - 24) / params.points.length - 8);
      chips = params.points.map((pt, i) => {
        const hx = 12 + i * (cw + 8) + ((w - 24) - params.points.length * (cw + 8) + 8) / 2, hy = 16;
        return { ...pt, i, w: cw, h: CH, hx, hy, x: hx, y: hy };
      });
      arrange();
    }
    // Las fichas colocadas cuelgan sobre su punto de la recta; de izquierda a derecha, cada una
    // toma el nivel más bajo donde no choca con la anterior de ese nivel (hasta 3 niveles).
    function arrange() {
      const ends = [-Infinity, -Infinity, -Infinity];
      chips.forEach(c => { if (values[c.i] === null) { c.tx = c.hx; c.ty = c.hy; } });
      chips.filter(c => values[c.i] !== null).sort((a, b) => values[a.i] - values[b.i]).forEach(c => {
        c.tx = map.toPx(values[c.i]) - c.w / 2;
        let lv = ends.findIndex(e => c.tx > e + 4);
        if (lv < 0) lv = ends.indexOf(Math.min(...ends));
        ends[lv] = c.tx + c.w;
        c.ty = lineY - 30 - lv * (CH + 6) - CH;
      });
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); chips.forEach(c => { c.x = c.tx; c.y = c.ty; }); };

      function axis(y, mp, from, to, step, labels) {
        p.stroke(C.mute); p.strokeWeight(2); p.line(mp.toPx(from), y, mp.toPx(to), y);
        p.textAlign(p.CENTER, p.TOP); p.textSize(14); p.textStyle(p.BOLD);
        for (let k = Math.ceil(from / step - 1e-9); k * step <= to + 1e-9; k++) {
          const v = k * step, x = mp.toPx(v), whole = Math.abs(v - Math.round(v)) < 1e-9;
          p.stroke(C.mute); p.strokeWeight(whole ? 2 : 1); p.line(x, y - (whole ? 8 : 4), x, y + (whole ? 8 : 4));
          if (labels && whole) { p.noStroke(); p.fill(C.mute); p.text(String(Math.round(v)).replace('-', '−'), x, y + 12); }
        }
      }

      // Lupa: amplía ±0.5 alrededor del valor exacto y muestra dónde quedó la ficha.
      function lens(cx, cy, r, pt, v) {
        p.push();
        p.fill(C.card); p.stroke(C.brand); p.strokeWeight(3); p.circle(cx, cy, r * 2);
        p.drawingContext.save(); p.drawingContext.beginPath(); p.drawingContext.arc(cx, cy, r - 2, 0, Math.PI * 2); p.drawingContext.clip();
        const mp = lineMap(pt.value - 0.5, pt.value + 0.5, cx - r, cx + r);
        axis(cy, mp, pt.value - 0.5, pt.value + 0.5, 0.1, false);
        p.noStroke(); p.fill(C.ok); p.circle(mp.toPx(pt.value), cy, 12);
        if (v !== null) { p.fill(Math.abs(v - pt.value) < params.tol ? C.ok + '99' : C.bad); p.circle(mp.toPx(v), cy, 10); }
        p.drawingContext.restore();
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.TOP); p.textSize(13); p.textStyle(p.BOLD);
        p.text(`${pt.label} ≈ ${pt.value.toFixed(2).replace('-', '−')}`, cx, cy + r + 4);
        p.pop();
      }

      p.draw = () => {
        p.background(C.bg);
        axis(lineY, map, params.min, params.max, 1, true);
        if (locked) params.points.forEach(pt => { p.noStroke(); p.fill(C.ok); p.circle(map.toPx(pt.value), lineY, 9); });
        chips.forEach(c => {
          if (c.i !== drag) { c.x = p.lerp(c.x, c.tx, 0.25); c.y = p.lerp(c.y, c.ty, 0.25); }
          const v = values[c.i], good = v !== null && Math.abs(v - c.value) < params.tol;
          const color = locked ? (good ? C.ok : C.bad) : (c.i === drag ? C.brand : v !== null ? C.brand : C.line);
          if (v !== null && c.i !== drag) {
            // Palito desde la ficha hasta su punto en la recta.
            const x = map.toPx(v);
            p.stroke(color); p.strokeWeight(2); p.line(c.x + c.w / 2, c.y + c.h, x, lineY - 6);
            p.noStroke(); p.fill(color); p.triangle(x - 6, lineY - 12, x + 6, lineY - 12, x, lineY - 1);
          }
          p.stroke(color); p.strokeWeight(2.5); p.fill(C.card); p.rect(c.x, c.y, c.w, c.h, 10);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(Math.min(18, c.w / 3)); p.textStyle(p.BOLD);
          p.text(c.label, c.x + c.w / 2, c.y + c.h / 2 + 1);
        });
        if (drag >= 0) {
          // Lectura en vivo: el valor donde caería la ficha y una guía hasta la recta.
          const c = chips[drag], x = Math.max(map.toPx(params.min), Math.min(map.toPx(params.max), c.x + c.w / 2)), v = map.toVal(x);
          p.stroke(C.brand); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.line(x, c.y + c.h, x, lineY); p.drawingContext.setLineDash([]);
          p.noStroke(); p.fill(C.brand); p.textAlign(p.CENTER, p.TOP); p.textSize(13); p.textStyle(p.BOLD);
          p.text(`≈ ${v.toFixed(2).replace('-', '−')}`, x, c.y + c.h + 6);
        }
        if (locked) {
          // Hasta tres lupas, empezando por las fichas peor ubicadas.
          const worst = params.points.map((pt, i) => ({ pt, v: values[i], d: values[i] === null ? 99 : Math.abs(values[i] - pt.value) }))
            .sort((a, b) => b.d - a.d).slice(0, 3);
          const r = Math.min(46, (W - 40) / 6);
          worst.forEach((o, k) => lens(W / 2 + (k - (worst.length - 1) / 2) * (r * 2 + 16), lineY + 40 + r, r, o.pt, o.v));
        }
      };

      p.mousePressed = () => {
        if (locked) return;
        for (let k = chips.length - 1; k >= 0; k--) {
          const c = chips[k];
          if (p.mouseX >= c.x && p.mouseX <= c.x + c.w && p.mouseY >= c.y && p.mouseY <= c.y + c.h) {
            drag = c.i; grab = { x: p.mouseX - c.x, y: p.mouseY - c.y }; api.sfx?.tap?.();
            return false;
          }
        }
      };
      p.mouseDragged = () => {
        if (drag < 0) return;
        const c = chips[drag];
        c.x = p.constrain(p.mouseX - grab.x, 0, size.w - c.w);
        c.y = p.constrain(p.mouseY - grab.y, 0, size.h - c.h);
        return false;
      };
      p.mouseReleased = () => {
        if (drag < 0) return;
        const c = chips[drag], cx = c.x + c.w / 2, cy = c.y + c.h;
        // Vale soltar la ficha sobre la recta o justo encima de ella; si no, vuelve arriba.
        const onLine = cy > lineY - 110 && cy < lineY + 40 && cx >= map.toPx(params.min) - 10 && cx <= map.toPx(params.max) + 10;
        values[c.i] = onLine ? Math.min(params.max, Math.max(params.min, map.toVal(cx))) : null;
        drag = -1;
        arrange();
        api.ready(values.every(v => v !== null));
        return false;
      };
    }, 1.1);

    return {
      loaded: m.ready,
      getState: () => ({ values: [...values] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
