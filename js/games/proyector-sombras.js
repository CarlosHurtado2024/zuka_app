// El proyector de sombras (cálculo, dominio y rango): una gráfica en el plano. Bajo el plano hay un riel
// con dos corchetes (el dominio, la sombra sobre el eje x) y a la izquierda otro riel (el rango, la sombra
// sobre el eje y). Los corchetes se arrastran (se ajustan a enteros); llevarlos al borde del riel los
// vuelve ∞ y tocarlos alterna extremo lleno (incluido) / vacío. Al comprobar se encienden las linternas y
// las sombras verdaderas se pintan sobre los ejes.
// params = { rounds: [{ f, xr, yr, dom: [a, b, ac, bc], ran: [c, d, cc, dc] }] }  (null = ∞; extremos enteros)
// state = { rounds: [{ dom: [a, b, ac, bc], ran: [c, d, cc, dc] }] }

GAMES['proyector-sombras'] = (() => {
  const ivText = ([a, b, ac, bc]) => `${a == null ? '(' : ac ? '[' : '('}${a == null ? '−∞' : numTxt(a)}, ${b == null ? '∞' : numTxt(b)}${b == null ? ')' : bc ? ']' : ')'}`;
  const sameIv = (u, w) => !!u && u[0] === w[0] && u[1] === w[1] && (w[0] == null || u[2] === w[2]) && (w[1] == null || u[3] === w[3]);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => sameIv(state.rounds[i]?.dom, r.dom) && sameIv(state.rounds[i]?.ran, r.ran));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) dominio ${ivText(r.dom)}, rango ${ivText(r.ran)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    // Cada riel guarda dos asas: { v: número | ±Infinity, c: lleno }.
    const st = params.rounds.map(() => ({ x: [{ v: -1, c: true }, { v: 1, c: true }], y: [{ v: -1, c: true }, { v: 1, c: true }], touched: false }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], v = null, xs = null, ys = null, drag = null;

    const toIv = hs => { const [h1, h2] = [...hs].sort((a, b) => a.v - b.v); return [Number.isFinite(h1.v) ? h1.v : null, Number.isFinite(h2.v) ? h2.v : null, h1.c, h2.c]; };
    const stateOf = s => ({ dom: toIv(s.x), ran: toIv(s.y) });

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], side = Math.min(W - 24 - 44, H - 46 - 130);
      const box = { x: 12 + 44, y: 46, w: side, h: side * (r.yr[1] - r.yr[0]) / (r.xr[1] - r.xr[0]) };
      if (box.h > H - 176) { box.h = H - 176; }
      v = planeView(box, r.xr, r.yr);
      xs = { x: box.x, y: box.y + box.h + 8, w: box.w, h: 30 };
      ys = { x: 12, y: box.y, w: 34, h: box.h };
    }
    const xPx = val => (val === -Infinity ? xs.x : val === Infinity ? xs.x + xs.w : v.X(val));
    const yPx = val => (val === -Infinity ? ys.y + ys.h : val === Infinity ? ys.y : v.Y(val));
    function snapX(px) {
      const r = params.rounds[cur];
      if (px < v.X(r.xr[0] + 0.5)) return -Infinity;
      if (px > v.X(r.xr[1] - 0.5)) return Infinity;
      return Math.round(v.toX(px));
    }
    function snapY(py) {
      const r = params.rounds[cur];
      if (py > v.Y(r.yr[0] + 0.5)) return -Infinity;
      if (py < v.Y(r.yr[1] - 0.5)) return Infinity;
      return Math.round(v.toY(py));
    }

    function bracket(p, x, y, h, horiz, isLeft, closed, col) {
      // Corchete o paréntesis (o flecha si es infinito) dibujado sobre el riel.
      p.stroke(col); p.strokeWeight(3); p.noFill();
      const s = 7;
      if (horiz) {
        if (closed) { p.line(x, y - h / 2, x, y + h / 2); p.line(x, y - h / 2, x + (isLeft ? s : -s), y - h / 2); p.line(x, y + h / 2, x + (isLeft ? s : -s), y + h / 2); }
        else p.arc(x + (isLeft ? s : -s), y, 2 * s, h, isLeft ? Math.PI / 2 : -Math.PI / 2, isLeft ? 3 * Math.PI / 2 : Math.PI / 2);
      } else {
        if (closed) { p.line(x - h / 2, y, x + h / 2, y); p.line(x - h / 2, y, x - h / 2, y + (isLeft ? -s : s)); p.line(x + h / 2, y, x + h / 2, y + (isLeft ? -s : s)); }
        else p.arc(x, y + (isLeft ? -s : s), h, 2 * s, isLeft ? 0 : Math.PI, isLeft ? Math.PI : 2 * Math.PI);
      }
    }
    function arrow(p, x, y, dx, dy, col) {
      p.stroke(col); p.strokeWeight(3); p.line(x, y, x + dx * 12, y + dy * 12);
      p.noStroke(); p.fill(col); p.triangle(x + dx * 16, y + dy * 16, x + dx * 8 - dy * 6, y + dy * 8 + dx * 6, x + dx * 8 + dy * 6, y + dy * 8 - dx * 6);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], s = st[cur], my = stateOf(s);
        drawTabs(p, C, tabs, cur, i => {
          const g = sameIv(stateOf(st[i]).dom, params.rounds[i].dom) && sameIv(stateOf(st[i]).ran, params.rounds[i].ran);
          return locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : st[i].touched ? C.Z : C.line;
        });
        drawPlane(p, C, v);
        // Sombras verdaderas (al bloquear): bandas sobre los ejes.
        if (locked) {
          const band = (iv, horiz) => {
            const a = iv[0] == null ? (horiz ? r.xr[0] : r.yr[0]) : iv[0], b = iv[1] == null ? (horiz ? r.xr[1] : r.yr[1]) : iv[1];
            p.noStroke(); p.fill(p.color(C.ok + '55'));
            if (horiz) p.rect(v.X(a), v.Y(0) - 5, v.X(b) - v.X(a), 10); else p.rect(v.X(0) - 5, v.Y(b), 10, v.Y(a) - v.Y(b));
          };
          band(r.dom, true); band(r.ran, false);
        }
        // Gráfica: solo dentro del dominio, con sus puntos extremos.
        const a = r.dom[0] == null ? r.xr[0] : r.dom[0], b = r.dom[1] == null ? r.xr[1] : r.dom[1];
        p.stroke(C.brand); p.strokeWeight(3.5); drawCurve(p, v, r.f, a, b);
        [[r.dom[0], r.dom[2]], [r.dom[1], r.dom[3]]].forEach(([x, c]) => {
          if (x == null) return;
          p.stroke(C.brand); p.strokeWeight(2.5); p.fill(c ? C.brand : C.card); p.circle(v.X(x), v.Y(r.f(x)), 11);
        });
        // Rieles con la sombra que propone el estudiante.
        [[xs, true], [ys, false]].forEach(([rail, horiz]) => {
          p.noStroke(); p.fill(C.card); p.rect(rail.x, rail.y, rail.w, rail.h, 8);
          const iv = horiz ? my.dom : my.ran, col = locked ? (sameIv(iv, horiz ? r.dom : r.ran) ? C.ok : C.bad) : horiz ? C.N : C.Z;
          const lo = horiz ? xPx(iv[0] == null ? -Infinity : iv[0]) : yPx(iv[0] == null ? -Infinity : iv[0]);
          const hi = horiz ? xPx(iv[1] == null ? Infinity : iv[1]) : yPx(iv[1] == null ? Infinity : iv[1]);
          p.fill(p.color(col + '44'));
          if (horiz) p.rect(lo, rail.y + 8, hi - lo, rail.h - 16); else p.rect(rail.x + 8, hi, rail.w - 16, lo - hi);
          if (horiz) {
            if (iv[0] == null) arrow(p, lo + 18, rail.y + rail.h / 2, -1, 0, col); else bracket(p, lo, rail.y + rail.h / 2, rail.h - 8, true, true, iv[2], col);
            if (iv[1] == null) arrow(p, hi - 18, rail.y + rail.h / 2, 1, 0, col); else bracket(p, hi, rail.y + rail.h / 2, rail.h - 8, true, false, iv[3], col);
          } else {
            if (iv[0] == null) arrow(p, rail.x + rail.w / 2, lo - 18, 0, 1, col); else bracket(p, rail.x + rail.w / 2, lo, rail.w - 8, false, true, iv[2], col);
            if (iv[1] == null) arrow(p, rail.x + rail.w / 2, hi + 18, 0, -1, col); else bracket(p, rail.x + rail.w / 2, hi, rail.w - 8, false, false, iv[3], col);
          }
        });
        // Lectura.
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        const ty = xs.y + xs.h + 22;
        p.fill(C.N); fitText(p, `Dominio: ${ivText(my.dom)}`, W / 4 + 6, ty, W / 2 - 16, 15);
        p.fill(C.Z); fitText(p, `Rango: ${ivText(my.ran)}`, 3 * W / 4 - 6, ty, W / 2 - 16, 15);
        if (locked) {
          p.fill(C.ok); p.textStyle(p.NORMAL);
          fitText(p, `Sombras: ${ivText(r.dom)} y ${ivText(r.ran)}`, W / 2, ty + 24, W - 24, 13);
        } else { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Arrastra los corchetes · tócalos para incluir o excluir', W / 2, ty + 24, W - 24, 12); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const s = st[cur];
        const pick = (hs, pos, rail) => {
          if (!hitBox({ x: rail.x - 6, y: rail.y - 6, w: rail.w + 12, h: rail.h + 12 }, p.mouseX, p.mouseY)) return -1;
          let best = -1, bd = 26;
          hs.forEach((h, i) => { const d = Math.abs(pos(h.v) - (rail === xs ? p.mouseX : p.mouseY)); if (d < bd) { bd = d; best = i; } });
          return best;
        };
        let i = pick(s.x, xPx, xs);
        if (i >= 0) { drag = { axis: 'x', i, moved: false }; return false; }
        i = pick(s.y, yPx, ys);
        if (i >= 0) { drag = { axis: 'y', i, moved: false }; return false; }
      };
      p.mouseDragged = () => {
        if (!drag || locked) return;
        const h = st[cur][drag.axis][drag.i], nv = drag.axis === 'x' ? snapX(p.mouseX) : snapY(p.mouseY);
        if (nv !== h.v) { h.v = nv; drag.moved = true; st[cur].touched = true; api.ready(st.every(t => t.touched)); }
        return false;
      };
      p.mouseReleased = () => {
        if (!drag) return;
        if (!drag.moved) { const h = st[cur][drag.axis][drag.i]; if (Number.isFinite(h.v)) { h.c = !h.c; st[cur].touched = true; api.ready(st.every(t => t.touched)); api.sfx?.tap?.(); } }
        drag = null; return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: st.map(stateOf) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, ivText };
})();
