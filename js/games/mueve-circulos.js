// Mueve los círculos (Álgebra 0, relaciones entre conjuntos): arriba están A y B por extensión. El círculo A
// está fijo; el de B se arrastra para dibujar cómo se relacionan: B dentro de A (B ⊆ A), encima (A = B),
// separados (A ∩ B = ∅, disjuntos) o cruzados (comparten algo, pero ninguno contiene al otro). Debajo se escribe
// en vivo la notación de lo que está dibujado.
// params = { rounds: [{ A, B, rB, rel: 'sub' | 'equal' | 'disjoint' | 'overlap' }] }   (rB: radio de B / radio de A)
// state = { pos: [[dx, dy] | null] }   (centro de B respecto al de A, en radios de A)

GAMES['mueve-circulos'] = (() => {
  function relationOf(d, rB) {
    if (Math.abs(rB - 1) < 1e-9 && d < 0.2) return 'equal';
    if (d + rB <= 1 + 1e-9) return 'sub';
    if (d >= 1 + rB - 1e-9) return 'disjoint';
    return 'overlap';
  }
  const TXT = { sub: 'B ⊆ A', equal: 'A = B', disjoint: 'A ∩ B = ∅ (disjuntos)', overlap: 'se cruzan: A ∩ B ≠ ∅' };
  const good = (ps, r) => !!ps && relationOf(Math.hypot(ps[0], ps[1]), r.rB) === r.rel;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.pos?.[i], r));
    const solution = params.rounds.map(r => TXT[r.rel]).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { pos: R.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, rA = 0, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      box = { x: 14, y: 112, w: w - 28, h: h - 112 - 50 };
      rA = Math.min(box.w, box.h) * 0.27;
    }
    const center = () => ({ x: box.x + box.w * 0.38, y: box.y + box.h / 2 });
    // B empieza a la derecha de A, sin salirse del universo.
    const startPos = r => { const c = center(); return [Math.min(1 + r.rB + 0.25, (box.x + box.w - r.rB * rA - 4 - c.x) / rA), 0.55]; };
    const posOf = i => st.pos[i] ?? startPos(R[i]);
    function setFrom(mx, my) {
      const c = center(), r = R[cur], rb = r.rB * rA;
      const x = Math.min(box.x + box.w - rb, Math.max(box.x + rb, mx)), y = Math.min(box.y + box.h - rb, Math.max(box.y + rb, my));
      let dx = (x - c.x) / rA, dy = (y - c.y) / rA;
      if (Math.hypot(dx, dy) < 0.2) { dx = 0; dy = 0; }   // imán al centro: así se pueden encimar con el dedo
      st.pos[cur] = [+dx.toFixed(3), +dy.toFixed(3)];
      api.ready(st.pos.every(Boolean));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      const tint = (col, a) => { const c = p.color(col); c.setAlpha(a); return c; };

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], ps = posOf(cur), c = center(), rel = relationOf(Math.hypot(ps[0], ps[1]), r.rB);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.pos[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.pos[i] ? C.Z : C.line));
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.Z); fitText(p, `A = ${r.A}`, W / 2, 56, W - 28, 15);
        p.fill(C.I); fitText(p, `B = ${r.B}`, W / 2, 82, W - 28, 15);
        // Universo y círculos
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 12);
        p.noStroke(); p.fill(C.mute); p.textSize(12); p.textAlign(p.LEFT, p.TOP); p.text('U', box.x + 8, box.y + 6);
        p.stroke(C.Z); p.strokeWeight(3); p.fill(tint(C.Z, 50)); p.circle(c.x, c.y, 2 * rA);
        const bx = c.x + ps[0] * rA, by = c.y + ps[1] * rA, rb = r.rB * rA;
        p.stroke(locked ? (good(st.pos[cur], r) ? C.ok : C.bad) : C.I); p.strokeWeight(3); p.fill(tint(C.I, 60)); p.circle(bx, by, 2 * rb);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(18); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.Z); p.text('A', c.x - rA * 0.7, c.y - rA * 0.7);
        p.fill(C.I); p.text('B', bx + rb * 0.55, by - rb * 0.55);
        // La notación de lo dibujado
        p.fill(C.ink); p.textSize(14);
        fitText(p, st.pos[cur] ? `Dibujaste: ${TXT[rel]}` : 'Arrastra el círculo B', W / 2, H - 30, W - 28, 14);
        if (locked && !good(st.pos[cur], r)) { p.fill(C.ok); p.textSize(12); fitText(p, `Era: ${TXT[r.rel]}`, W / 2, H - 10, W - 28, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(box, p.mouseX, p.mouseY)) { drag = true; setFrom(p.mouseX, p.mouseY); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setFrom(p.mouseX, p.mouseY); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ pos: st.pos.map(x => (x ? [...x] : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, relationOf };
})();
