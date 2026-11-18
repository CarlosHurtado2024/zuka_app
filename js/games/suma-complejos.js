// Suma de complejos (Álgebra, alg-23c; spec 2026-11-18-algebra-revision): sumar complejos es poner una flecha después de
// la otra: real con real e imaginaria con imaginaria. La flecha de z₁ está fija; se arrastra la punta de z₂ (que sale de
// la punta de z₁) hasta que la suma caiga en la estrella.
// params = { rounds: [{ z1: [a, b], target: [a, b] }] }   state = { rounds: [{ a, b }] }   (z₂)
GAMES['suma-complejos'] = (() => {
  const V = { x0: -7, x1: 7, y0: -7, y1: 7 };
  const need = r => ({ a: r.target[0] - r.z1[0], b: r.target[1] - r.z1[1] });
  const ok = (s, r) => s.a === need(r).a && s.b === need(r).b;
  const z = (a, b) => GAMES['plano-complejo'].z(a, b);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ a: 1, b: 0 }),
    ok,
    solution: r => { const n = need(r); return `z₂ = ${z(n.a, n.b)}`; },
    prompt: r => `$z_1 = ${z(...r.z1)}$. ¿Qué $z_2$ suma $${z(...r.target)}$?`,
    foot: () => 'Arrastra la punta de z₂: sale de la punta de z₁',
    layout(G) { const s = Math.min(G.W - 32, G.H - 190); G.b = { x: (G.W - s) / 2, y: 96, w: s, h: s }; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? need(r) : G.s, M = G.M = RK.plane(p, C, G.b, V, { lx: 'Re', ly: 'Im' });
      const [a1, b1] = r.z1, ax = a1 + s.a, by = b1 + s.b;
      p.noStroke(); p.fill(C.ok); p.circle(M.X(r.target[0]), M.Y(r.target[1]), 14);
      p.stroke(C.sky); p.strokeWeight(3.5); p.line(M.X(0), M.Y(0), M.X(a1), M.Y(b1));
      p.stroke(C.coral); p.line(M.X(a1), M.Y(b1), M.X(ax), M.Y(by));
      p.stroke(RK.al(p, C.brand, 160)); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 4]); p.line(M.X(0), M.Y(0), M.X(ax), M.Y(by)); p.drawingContext.setLineDash([]);
      RK.knob(p, C, M.X(ax), M.Y(by), C.coral);
      RK.strip(p, C, G.fb, `$(${z(a1, b1)}) + (${z(s.a, s.b)}) = ${z(ax, by)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.r.z1[0] + G.s.a), y: G.M.Y(G.r.z1[1] + G.s.b) }, to: { x: G.M.X(G.r.z1[0] + G.s.a + 2), y: G.M.Y(G.r.z1[1] + G.s.b + 2) }, text: 'Arrastra la punta de z₂', ty: G.b.y + G.b.h + 14 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x, y) => { const r = G.r, A = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x)))), B = Math.max(V.y0, Math.min(V.y1, Math.round(G.M.iY(y)))); G.s.a = A - r.z1[0]; G.s.b = B - r.z1[1]; G.touch(); };
  return Object.assign(game, { need });
})();
