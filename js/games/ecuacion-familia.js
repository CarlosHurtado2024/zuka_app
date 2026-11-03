// Ecuación → familia (lección 1.1): cada familia nace de una ecuación que la anterior no resuelve.
// Se une con el dedo cada ecuación (izquierda) con la familia donde vive su solución (derecha, barajada).
// params = { pairs: [{ left, right }] }   state = { links: [índice de pairs | null] }

GAMES['ecuacion-familia'] = (() => {
  function grade(state, params) {
    if (params.pairs.every((_, i) => state.links[i] === i)) return { ok: true, solution: 'Cada ecuación está unida con su familia.' };
    return { ok: false, solution: params.pairs.map(pr => `${pr.left} → ${pr.right}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const n = params.pairs.length;
    const links = params.pairs.map(() => null);
    // Orden en que se muestran las familias: barajado, pero nunca idéntico al de las ecuaciones.
    let order = params.pairs.map((_, i) => i);
    do { order.sort(() => Math.random() - 0.5); } while (n > 1 && order.every((v, i) => v === i));
    let locked = false, left = [], right = [], drag = null;

    function layout(w, h) {
      const top = 18, rowH = (h - top * 2) / n, cardH = Math.min(56, rowH - 16), cw = w * 0.4;
      left = params.pairs.map((pr, i) => ({ x: 12, y: top + i * rowH + (rowH - cardH) / 2, w: cw, h: cardH, text: pr.left }));
      right = order.map((j, k) => ({ j, x: w - 12 - cw, y: top + k * rowH + (rowH - cardH) / 2, w: cw, h: cardH, text: params.pairs[j].right }));
    }
    const anchorL = i => ({ x: left[i].x + left[i].w, y: left[i].y + left[i].h / 2 });
    const anchorR = j => { const r = right.find(c => c.j === j); return { x: r.x, y: r.y + r.h / 2 }; };
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    // Distancia de un punto a un segmento (para tocar una línea y borrarla).
    function segDist(px, py, a, b) {
      const dx = b.x - a.x, dy = b.y - a.y, t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(px - a.x - t * dx, py - a.y - t * dy);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function card(c, color) {
        p.stroke(color); p.strokeWeight(2.5); p.fill(C.card); p.rect(c.x, c.y, c.w, c.h, 12);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.textSize(Math.min(20, c.w / 6)); p.text(c.text, c.x + c.w / 2, c.y + c.h / 2 + 1);
      }
      function dot(pt, color) { p.noStroke(); p.fill(color); p.circle(pt.x, pt.y, 12); }
      function line(a, b, color, weight = 4) { p.stroke(color); p.strokeWeight(weight); p.line(a.x, a.y, b.x, b.y); }

      p.draw = () => {
        p.background(C.bg);
        if (locked) {
          // Las uniones equivocadas quedan tenues en rojo; las correctas se dibujan en verde.
          links.forEach((j, i) => { if (j !== null && j !== i) line(anchorL(i), anchorR(j), C.bad + '66', 3); });
          params.pairs.forEach((_, i) => line(anchorL(i), anchorR(i), C.ok));
        } else {
          links.forEach((j, i) => { if (j !== null) line(anchorL(i), anchorR(j), C.brand); });
          if (drag) line(anchorL(drag.i), { x: p.mouseX, y: p.mouseY }, C.brand + 'aa', 3);
        }
        left.forEach((c, i) => { card(c, locked ? (links[i] === i ? C.ok : C.bad) : (links[i] !== null || drag?.i === i ? C.brand : C.line)); dot(anchorL(i), C.brand); });
        right.forEach(c => { card(c, links.includes(c.j) && !locked ? C.brand : C.line); dot({ x: c.x, y: c.y + c.h / 2 }, C.brand); });
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = left.findIndex((c, k) => inside(c, p.mouseX, p.mouseY) || Math.hypot(p.mouseX - anchorL(k).x, p.mouseY - anchorL(k).y) < 18);
        if (i >= 0) { drag = { i }; api.sfx?.tap?.(); return false; }
        // Tocar una línea la borra.
        const hit = links.findIndex((j, k) => j !== null && segDist(p.mouseX, p.mouseY, anchorL(k), anchorR(j)) < 10);
        if (hit >= 0) { links[hit] = null; api.ready(false); return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const r = right.find(c => inside(c, p.mouseX, p.mouseY) || Math.hypot(p.mouseX - c.x, p.mouseY - c.y - c.h / 2) < 18);
        if (r) {
          // Uniones uno a uno: si otra ecuación ya iba a esa familia, se suelta.
          links.forEach((j, k) => { if (j === r.j) links[k] = null; });
          links[drag.i] = r.j;
        }
        drag = null;
        api.ready(links.every(j => j !== null));
        return false;
      };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ links: [...links] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
