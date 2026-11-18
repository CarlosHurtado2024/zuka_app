// El cono es un tercio del cilindro (Preuniversitario, pu-ge-6; spec 2026-11-18-preuda-razonamiento-completo): un cono (o una
// pirámide) llena la tercera parte del cilindro (o prisma) de la misma base y altura: V = ⅓ · base · altura. Se arrastra la
// altura del cono; al lado, el cilindro igual con su agua a un tercio. Hay que llegar al volumen pedido.
// params = { rounds: [{ base: 'circ' | 'rect', dims: [..], target }] }   (circ: target en múltiplos de π)   state = { rounds: [{ h }] }   (de 1 a 12)
GAMES['cono-tercio'] = (() => {
  const A = r => (r.base === 'rect' ? r.dims[0] * r.dims[1] : r.dims[0] ** 2);
  const V = (r, h) => A(r) * h / 3;
  const ok = (s, r) => Math.abs(V(r, s.h) - r.target) < 1e-9;
  const answer = r => ({ h: 3 * r.target / A(r) });
  const pi = r => (r.base === 'circ' ? '\\pi' : '');
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ h: 1 }),
    ok,
    solution: r => `altura ${3 * r.target / A(r)}`,
    prompt: r => `${r.base === 'circ' ? `Cono de radio ${r.dims[0]}` : `Pirámide de base ${r.dims[0]} × ${r.dims[1]}`}: ¿qué altura da volumen $${r.target}${pi(r)}$?`,
    foot: () => 'Arrastra la altura del cono',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), yb = G.tY - 56, u = (G.tY - 190) / 12, w = Math.min(110, G.W * 0.3), hp = s.h * u, x1 = G.W * 0.3, x2 = G.W * 0.7;
      p.stroke(C.ink); p.strokeWeight(1.6); p.fill(RK.al(p, good ? C.ok : C.coral, 140)); p.triangle(x1 - w / 2, yb, x1 + w / 2, yb, x1, yb - hp); p.ellipse(x1, yb, w, w * 0.25);
      p.noFill(); p.rect(x2 - w / 2, yb - hp, w, hp); p.noStroke(); p.fill(RK.al(p, C.sky, 160)); p.rect(x2 - w / 2, yb - hp / 3, w, hp / 3);
      TK.label(p, C, 'cono', x1, yb + 22, C.mute, 10, 60); TK.label(p, C, 'cilindro: ⅓ lleno', x2, yb + 22, C.mute, 10, 120);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 12, s.h - 1, i => (i % 2 === 1 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$\\tfrac13 \\cdot ${A(r)}${pi(r)} \\cdot ${s.h} = ${RK.num(V(r, s.h))}${pi(r)}$`, { col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X([2, 4, 6].find(i => i + 1 !== answer(G.r).h)), y: G.tY }, text: 'Arrastra la altura', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 12) + 1; if (v !== G.s.h || !G.touched[G.cur]) { G.s.h = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
