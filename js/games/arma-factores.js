// De los ceros a los factores (Álgebra, alg-92; spec 2026-11-18-algebra-revision): si c es un cero, x − c es un factor,
// con el signo contrario al del cero. La gráfica muestra los ceros; abajo hay casillas (x − □) y fichas con números. Se
// arrastra a cada casilla el número que la anula y el producto se escribe solo.
// params = { rounds: [{ roots: [..], chips: [..] }] }   state = { rounds: [{ slots: [índice de ficha | null] }] }
GAMES['arma-factores'] = (() => {
  const ok = (s, r) => s.slots.every(c => c != null) && s.slots.map(c => r.chips[c]).sort((a, b) => a - b).join() === [...r.roots].sort((a, b) => a - b).join();
  const answer = r => ({ slots: r.roots.map(v => r.chips.indexOf(v)) });
  const fac = v => (v === 0 ? 'x' : `(x ${v < 0 ? '+' : '-'} ${Math.abs(v)})`);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ slots: r.roots.map(() => null) }),
    ok,
    answered: s => s.slots.some(c => c != null),
    solution: r => r.roots.map(fac).join(''),
    prompt: () => 'Escribe el polinomio con sus factores',
    foot: () => 'Arrastra a cada casilla el número que anula ese factor',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.36 }; G.sy = G.b.y + G.b.h + 22; G.cy = G.sy + 60; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, V = { x0: -5, x1: 5, y0: -12, y1: 12 }, M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => r.roots.reduce((a, c) => a * (x - c), 1), C.sky, 2.4);
      r.roots.forEach(c => drawDot(p, C, M.X(c), M.Y(0), 11, C.coral));
      const n = r.roots.length, w = Math.min(84, (G.W - 20) / n - 6);
      G.slots = r.roots.map((_, i) => ({ i, x: G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6), y: G.sy, w, h: 38 }));
      G.slots.forEach(b => { const c = s.slots[b.i]; p.stroke(C.brand); p.strokeWeight(1.3); p.fill(RK.al(p, C.brand, 18)); p.rect(b.x, b.y, b.w, b.h, 9); TK.label(p, C, c == null || G.drag?.from === b.i ? '(x − □)' : `$${fac(r.chips[c])}$`, b.x + b.w / 2, b.y + b.h / 2, C.ink, 13, b.w - 6); });
      const free = r.chips.map((_, i) => i).filter(i => !s.slots.includes(i)), cw = Math.min(46, (G.W - 20) / Math.max(1, free.length) - 4);
      G.tray = free.map((i, j) => ({ i, x: G.W / 2 - (free.length * (cw + 4) - 4) / 2 + j * (cw + 4), y: G.cy, w: cw, h: 32 }));
      G.tray.forEach(b => { if (!(G.drag?.c === b.i && G.drag.from == null)) RK.chip(p, C, b, String(r.chips[b.i]), { size: 13 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 22, y: G.drag.y - 16, w: 44, h: 32 }, String(r.chips[G.drag.c]), { on: true, size: 13 });
      RK.strip(p, C, G.fb, `$P(x) = ${s.slots.map(c => (c == null ? '(x - \\square)' : fac(r.chips[c]))).join('')}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { c: t.i, from: null, x, y }; return true; }
      const sl = (G.slots || []).find(b => hitBox(b, x, y) && G.s.slots[b.i] != null); if (sl) { G.drag = { c: G.s.slots[sl.i], from: sl.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const sl = (G.slots || []).find(b => hitBox({ x: b.x - 4, y: b.y - 8, w: b.w + 8, h: b.h + 16 }, x, y));
      if (d.from != null) G.s.slots[d.from] = null;
      if (sl) G.s.slots[sl.i] = d.c;
      G.touch();
    },
    demo(G) { const t = G.tray?.[0], sl = G.slots?.[0]; return t && sl ? { from: { x: t.x + t.w / 2, y: t.y + 16 }, to: { x: sl.x + sl.w / 2, y: sl.y + 19 }, text: 'Arrastra a una casilla', ty: G.cy + 50 } : null; },
    peek: G => ({ tray: G.tray, slots: G.slots }),
  });
  return Object.assign(game, { answer });
})();
