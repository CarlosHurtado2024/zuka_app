// Los valores prohibidos (Álgebra, alg-25a; spec 2026-11-18-algebra-revision): una fracción algebraica no existe donde su
// denominador vale cero. Se arrastran cruces a la recta, a los valores que anulan el denominador (factorizado o no). Hay
// que tachar todos los prohibidos y ninguno más: el dominio es lo que queda.
// params = { rounds: [{ tex, bad: [..] }] }   state = { rounds: [{ marks: [..] }] }   (enteros de −6 a 6)
GAMES['prohibidos'] = (() => {
  const L = { min: -6, max: 6 };
  const ok = (s, r) => [...s.marks].sort((a, b) => a - b).join() === [...r.bad].sort((a, b) => a - b).join();
  const game = roundsGame({
    aspect: 0.95,
    init: () => ({ marks: [] }),
    ok,
    answered: s => s.marks.length > 0,
    solution: r => `x ≠ ${r.bad.join(', ')}`,
    prompt: r => `Tacha los valores prohibidos de $${r.tex}$`,
    foot: () => 'Arrastra cruces a la recta; arrástralas afuera para quitarlas',
    layout(G) { G.L = { x0: 24, x1: G.W - 24, y: G.H * 0.5, ...L }; G.src = { x: G.W / 2 - 22, y: G.L.y + 46, w: 44, h: 32 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { marks: r.bad } : G.s, X = drawNumLine(p, C, G.L, { step: 1, every: 2 });
      G.X = X;
      s.marks.forEach(v => { const x = X(v), y = G.L.y - 24; p.stroke(C.bad); p.strokeWeight(3); p.line(x - 8, y - 8, x + 8, y + 8); p.line(x - 8, y + 8, x + 8, y - 8); });
      RK.chip(p, C, G.src, '✕', { on: true, col: C.bad, size: 16 });
      if (G.drag) { p.stroke(C.brand); p.strokeWeight(3); p.line(G.drag.x - 8, G.drag.y - 8, G.drag.x + 8, G.drag.y + 8); p.line(G.drag.x - 8, G.drag.y + 8, G.drag.x + 8, G.drag.y - 8); }
      RK.strip(p, C, G.fb, s.marks.length ? `$x \\ne ${[...s.marks].sort((a, b) => a - b).join(',\\ ')}$` : '$\\text{sin tachar}$', { kicker: 'Dominio: todos los reales menos estos', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) {
      if (hitBox(G.src, x, y)) { G.drag = { from: null, x, y }; return true; }
      const L = G.L, v = Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min));
      if (Math.abs(y - (L.y - 24)) < 26 && G.s.marks.includes(v)) { G.drag = { from: v, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))), m = G.s.marks;
      if (d.from != null) m.splice(m.indexOf(d.from), 1);
      if (Math.abs(y - L.y) < 46 && !m.includes(v)) m.push(v);
      G.touch();
    },
    demo: G => ({ from: { x: G.src.x + 22, y: G.src.y + 16 }, to: { x: G.X([5, -5, 6].find(v => !G.r.bad.includes(v))), y: G.L.y - 20 }, text: 'Arrastra la cruz a la recta', ty: G.src.y + 50 }),
    peek: G => ({ L: G.L, src: G.src }),
  });
  return game;
})();
