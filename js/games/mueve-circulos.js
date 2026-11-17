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
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, fb = null, rA = 0, drag = false;
    const TEX = { sub: '$B \\subseteq A$', equal: '$A = B$', disjoint: '$A \\cap B = \\varnothing$', overlap: '$A \\cap B ≠ \\varnothing$' };
    const SAY = { sub: 'B dentro de A', equal: 'Iguales', disjoint: 'Disjuntos', overlap: 'Se cruzan' };

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      fb = { x: 12, y: h - 62, w: w - 24, h: 50 };
      box = { x: 12, y: 104, w: w - 24, h: fb.y - 10 - 104 };
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

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], ps = posOf(cur), c = center(), rel = relationOf(Math.hypot(ps[0], ps[1]), r.rB), [A, B] = SK.sets(C);
        const okB = good(st.pos[cur], r), Bc = locked ? (okB ? { line: C.ok, ink: C.ok } : { line: C.bad, ink: C.bad }) : B;
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.pos[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.pos[i] ? C.Z : C.line));
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.fill(A.ink); fitText(p, `A = ${r.A}`, W / 2, 58, W - 28, 15);
        p.fill(B.ink); fitText(p, `B = ${r.B}`, W / 2, 82, W - 28, 15);
        // Universo y membranas: A quieta, B se arrastra.
        SK.panel(p, C, box, { u: true });
        SK.membrane(p, C, c.x, c.y, rA, rA, A.line);
        const bx = c.x + ps[0] * rA, by = c.y + ps[1] * rA, rb = r.rB * rA;
        SK.membrane(p, C, bx, by, rb, rb, Bc.line, { fill: drag ? 60 : 40, w: drag ? 2.6 : 2 });
        SK.tag(p, C, 'A', c.x - rA * 0.72, c.y - rA * 0.72, A);
        SK.tag(p, C, 'B', bx + rb * 0.72, by - rb * 0.72, Bc);
        if (!st.pos[cur] && !locked) { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text('arrastra', bx, by); }
        // La notación de lo dibujado
        SK.formal(p, C, fb, st.pos[cur] ? TEX[rel] : '$A \\ \\ ? \\ \\ B$', { kicker: st.pos[cur] ? `Dibujaste: ${SAY[rel]}` : 'Arrastra el círculo B', col: Bc.line });
        if (locked && !okB) { p.fill(C.ok); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, `Era: ${TXT[r.rel]}`, W / 2, H - 6, W - 28, 11); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(box, p.mouseX, p.mouseY)) { drag = true; setFrom(p.mouseX, p.mouseY); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setFrom(p.mouseX, p.mouseY); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.25);

    return {
      loaded: m.ready,
      getState: () => ({ pos: st.pos.map(x => (x ? [...x] : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, relationOf };
})();
