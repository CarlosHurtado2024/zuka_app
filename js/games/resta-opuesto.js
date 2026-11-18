// Restar es sumar el opuesto (Álgebra, alg-12c; spec 2026-11-18-algebra-revision): a − b se hace con flechas. La flecha
// de a sale del 0. La de b está abajo: primero se voltea (se arrastra su punta al otro lado de su cola: queda −b) y
// luego se pega su cola a la punta de a. Donde termina es a + (−b) = a − b. Pegarla sin voltear sería sumar b.
// params = { min, max, rounds: [{ a, b }] }   state = { rounds: [{ flip, att }] }
GAMES['resta-opuesto'] = (() => {
  const ok = s => s.flip && s.att;
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ flip: false, att: false }),
    ok,
    answered: s => s.flip || s.att,
    solution: r => `${r.a} − (${r.b}) = ${r.a} + (${-r.b}) = ${r.a - r.b}`,
    prompt: r => `Calcula $${RK.num(r.a)} - ${RK.par(r.b)}$ sumando el opuesto`,
    foot: (r, s) => (!s.flip ? 'Voltea la flecha de abajo: arrastra su punta al otro lado' : !s.att ? 'Ahora arrastra la flecha y pega su cola a la punta de arriba' : 'Donde termina está el resultado'),
    layout(G) { G.L = { x0: 22, x1: G.W - 22, y: G.H * 0.36, min: G.params.min ?? -12, max: G.params.max ?? 12 }; G.yb = G.H * 0.62; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, L } = G, s = G.locked && !ok(G.s) ? { flip: true, att: true } : G.s;
      const X = drawNumLine(p, C, L, { step: 1, every: 3 }), bv = s.flip ? -r.b : r.b;
      G.X = X;
      RK.arrow(p, X(0), X(r.a), L.y - 26, C.sky, 5); TK.label(p, C, `$${RK.num(r.a)}$`, (X(0) + X(r.a)) / 2, L.y - 44, C.sky, 13, 40);
      // La flecha de b: abajo, o pegada en la punta de a.
      const t0 = s.att ? r.a : 0, y = s.att ? L.y - 26 : G.yb, col = s.flip ? C.mint : C.coral;
      if (G.drag?.what === 'move') { const dx = G.drag.x - G.drag.x0; RK.arrow(p, X(0) + dx, X(bv) + dx, G.drag.y, col, 5); }
      else RK.arrow(p, X(t0), X(t0 + bv), y, col, 5);
      if (!s.att) { drawDot(p, C, X(0), G.yb, 10, C.ink); RK.knob(p, C, X(bv), G.yb + 26, col); TK.label(p, C, `$${s.flip ? '-' : ''}${RK.par(r.b)}$`, (X(0) + X(bv)) / 2, G.yb - 18, col, 13, 60); }
      if (s.att) { p.stroke(C.brand); p.strokeWeight(1.4); p.drawingContext.setLineDash([3, 4]); p.line(X(r.a + bv), L.y - 26, X(r.a + bv), L.y); p.drawingContext.setLineDash([]); drawDot(p, C, X(r.a + bv), L.y, 13, C.brand); }
      G.bt = { x: X(bv), y: G.yb + 26 }; G.bbody = { x: Math.min(X(0), X(bv)), y: G.yb - 14, w: Math.abs(X(bv) - X(0)) + 1, h: 28 };
      const tex = s.att ? `${RK.num(r.a)} + ${RK.par(bv)} = ${RK.num(r.a + bv)}` : `${RK.num(r.a)} - ${RK.par(r.b)} = ${RK.num(r.a)} + ${s.flip ? RK.par(-r.b) : '\\square'}`;
      RK.strip(p, C, G.fb, `$${tex}$`, { kicker: s.flip ? 'Con el opuesto' : 'Primero el opuesto', col: G.locked ? C.ok : col, size: 17 });
    },
    press(G, x, y) {
      if (G.s.att) { if (Math.abs(y - (G.L.y - 26)) < 22) { G.s.att = false; G.touch(); return true; } return false; }
      if (Math.hypot(x - G.bt.x, y - G.bt.y) < 26) { G.drag = { what: 'flip', x, y }; return true; }
      if (hitBox(G.bbody, x, y)) { G.drag = { what: 'move', x, y, x0: x }; return true; }
      return false;
    },
    drag(G, x, y) {
      const d = G.drag; if (!d) return false; d.x = x; d.y = y;
      if (d.what === 'flip') { const f = Math.sign(x - G.X(0)) !== Math.sign(G.r.b); if (f !== G.s.flip) { G.s.flip = f; G.touch(); } }
      return true;
    },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d || d.what !== 'move') return;
      const tail = G.X(0) + (x - d.x0);
      if (Math.abs(tail - G.X(G.r.a)) < 24 && Math.abs(y - (G.L.y - 26)) < 50) { G.s.att = true; G.touch(); }
    },
    demo(G) { return !G.s.flip ? { from: G.bt, to: { x: 2 * G.X(0) - G.bt.x, y: G.bt.y }, text: 'Voltea la flecha', ty: G.yb + 60 } : { from: { x: G.X(0) + 10, y: G.yb }, to: { x: G.X(G.r.a) + 10, y: G.L.y - 26 }, text: 'Pégala en la punta', ty: G.yb + 60 }; },
    peek: G => ({ L: G.L, yb: G.yb }),
  });
  return game;
})();
