// El plano de los complejos (Álgebra, alg-23c; spec 2026-11-18-algebra-revision): a + bi es el punto que está a de ancho
// y b de alto. Se arrastra el punto (salta a enteros) y se escribe el número que representa. Hay que ubicar el complejo
// pedido; los reales viven en el eje horizontal y los imaginarios puros en el vertical.
// params = { rounds: [{ a, b }] }   state = { rounds: [{ a, b }] }
GAMES['plano-complejo'] = (() => {
  const V = { x0: -6, x1: 6, y0: -6, y1: 6 };
  const ok = (s, r) => s.a === r.a && s.b === r.b;
  const z = (a, b) => (b === 0 ? `${a}` : `${a === 0 ? '' : a}${b < 0 ? '-' : a === 0 ? '' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}i`);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ a: 1, b: 1 }),
    ok,
    solution: r => z(r.a, r.b),
    prompt: r => `Ubica $${z(r.a, r.b)}$ en el plano complejo`,
    foot: () => 'Arrastra el punto: el ancho es la parte real y el alto la imaginaria',
    layout(G) { const s = Math.min(G.W - 32, G.H - 190); G.b = { x: (G.W - s) / 2, y: 96, w: s, h: s }; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? r : G.s, M = G.M = RK.plane(p, C, G.b, V, { lx: 'Re', ly: 'Im' });
      p.stroke(RK.al(p, C.brand, 120)); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 4]); p.line(M.X(s.a), M.Y(0), M.X(s.a), M.Y(s.b)); p.line(M.X(0), M.Y(s.b), M.X(s.a), M.Y(s.b)); p.drawingContext.setLineDash([]);
      RK.knob(p, C, M.X(s.a), M.Y(s.b), C.brand);
      RK.strip(p, C, G.fb, `$${z(s.a, s.b)}$`, { kicker: `parte real ${s.a} · parte imaginaria ${s.b}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 20 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.a), y: G.M.Y(G.s.b) }, to: { x: G.M.X(G.s.a - 3), y: G.M.Y(G.s.b + 2) }, text: 'Arrastra el punto', ty: G.b.y + G.b.h + 14 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x, y) => { const a = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x)))), b = Math.max(V.y0, Math.min(V.y1, Math.round(G.M.iY(y)))); if (a !== G.s.a || b !== G.s.b || !G.touched[G.cur]) { G.s.a = a; G.s.b = b; G.touch(); } };
  return Object.assign(game, { z });
})();
