// El conjugado en el espejo (Álgebra, alg-23c; spec 2026-11-18-algebra-revision): el conjugado de a + bi es a − bi, su
// reflejo en el eje real. Se arrastra el reflejo hasta su lugar; al acertar se ve que z·z̄ = a² + b² es un número real
// (lo que permite dividir complejos).
// params = { rounds: [{ a, b }] }   state = { rounds: [{ a, b }] }   (el punto que se arrastra)
GAMES['conjugado-espejo'] = (() => {
  const V = { x0: -6, x1: 6, y0: -6, y1: 6 };
  const ok = (s, r) => s.a === r.a && s.b === -r.b;
  const z = (a, b) => GAMES['plano-complejo'].z(a, b);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ a: 0, b: 0 }),
    ok,
    solution: r => `${z(r.a, -r.b)}; (${z(r.a, r.b)})(${z(r.a, -r.b)}) = ${r.a * r.a + r.b * r.b}`,
    prompt: r => `Pon el conjugado de $${z(r.a, r.b)}$`,
    foot: () => 'Arrastra el punto al reflejo de z en el eje real',
    layout(G) { const s = Math.min(G.W - 32, G.H - 190); G.b = { x: (G.W - s) / 2, y: 96, w: s, h: s }; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { a: r.a, b: -r.b } : G.s, M = G.M = RK.plane(p, C, G.b, V, { lx: 'Re', ly: 'Im' }), good = ok(s, r);
      p.stroke(C.sky); p.strokeWeight(3); p.line(M.X(0), M.Y(0), M.X(r.a), M.Y(r.b)); drawDot(p, C, M.X(r.a), M.Y(r.b), 12, C.sky); TK.label(p, C, 'z', M.X(r.a) + 12, M.Y(r.b) - 10, C.sky, 13, 20);
      p.stroke(RK.al(p, C.coral, 140)); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 4]); p.line(M.X(r.a), M.Y(r.b), M.X(s.a), M.Y(s.b)); p.drawingContext.setLineDash([]);
      RK.knob(p, C, M.X(s.a), M.Y(s.b), C.coral);
      RK.strip(p, C, G.fb, good ? `$(${z(r.a, r.b)})(${z(r.a, -r.b)}) = ${r.a}^2 + ${Math.abs(r.b)}^2 = ${r.a * r.a + r.b * r.b}$` : `$\\bar z \\;?\\; ${z(s.a, s.b)}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.a), y: G.M.Y(G.s.b) }, to: { x: G.M.X(2), y: G.M.Y(-2) }, text: 'Arrastra el reflejo', ty: G.b.y + G.b.h + 14 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x, y) => { G.s.a = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x)))); G.s.b = Math.max(V.y0, Math.min(V.y1, Math.round(G.M.iY(y)))); G.touch(); };
  return game;
})();
