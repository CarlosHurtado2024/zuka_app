// Del logaritmo a la potencia (Álgebra, alg-73; spec 2026-11-18-algebra-revision): log_b(x + k) = c quiere decir
// x + k = bᶜ. Se ve la curva y = log_b(x + k), que solo existe a la derecha de x = −k (zona rayada), y la altura c; se
// arrastra x por el eje hasta que la curva alcance esa altura.
// params = { rounds: [{ b, k, c }] }   state = { rounds: [{ x }] }   (de −6 a 12, de media en media)
GAMES['sube-al-exponente'] = (() => {
  const V = { x0: -6, x1: 12, y0: -4, y1: 5 };
  const need = r => r.b ** r.c - r.k;
  const ok = (s, r) => Math.abs(s.x - need(r)) < 1e-9;
  const arg = r => (r.k === 0 ? 'x' : `x ${r.k < 0 ? '-' : '+'} ${Math.abs(r.k)}`);
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ x: need(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => `x + ${r.k} = ${r.b}^${r.c}: x = ${RK.num(need(r))}`,
    prompt: r => `Resuelve $\\log_{${r.b}}(${arg(r)}) = ${r.c}$`,
    foot: () => 'Arrastra x por el eje; en la zona rayada el logaritmo no existe',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.56 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, M = G.M = RK.plane(p, C, G.b, V, { step: 1 }), wall = M.X(-r.k);
      p.noStroke(); p.fill(RK.al(p, C.bad, 30)); p.rect(G.b.x, G.b.y, Math.max(0, wall - G.b.x), G.b.h);
      p.stroke(RK.al(p, C.bad, 120)); p.strokeWeight(1); for (let yy = G.b.y; yy < G.b.y + G.b.h; yy += 12) p.line(G.b.x, yy, Math.max(G.b.x, wall), yy + 0);
      RK.curve(p, G.b, M, V, t => (t + r.k > 0 ? Math.log(t + r.k) / Math.log(r.b) : NaN), C.sky, 2.6);
      p.stroke(C.coral); p.strokeWeight(1.4); p.drawingContext.setLineDash([5, 4]); p.line(G.b.x, M.Y(r.c), G.b.x + G.b.w, M.Y(r.c)); p.drawingContext.setLineDash([]);
      const a = x + r.k, y = a > 0 ? Math.log(a) / Math.log(r.b) : null;
      if (y != null && y >= V.y0 && y <= V.y1) { p.stroke(C.brand); p.strokeWeight(1.4); p.line(M.X(x), M.Y(0), M.X(x), M.Y(y)); drawDot(p, C, M.X(x), M.Y(y), 13, ok({ x }, r) ? C.ok : C.brand); }
      RK.knob(p, C, M.X(x), M.Y(0), C.brand);
      RK.strip(p, C, G.fb, a > 0 ? `$\\log_{${r.b}}(${RK.num(a)}) ${y != null && Math.abs(y - r.c) < 1e-9 ? '=' : '\\approx'} ${RK.num(Math.round(y * 100) / 100)}$` : `$${RK.num(a)} \\le 0:\\ \\text{no existe}$`, { kicker: `x = ${String(x).replace('-', '−')}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.x), y: G.M.Y(0) }, to: { x: G.M.X(G.s.x + 3), y: G.M.Y(0) }, text: 'Arrastra x', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  game.move = (G, x) => { const v = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x) * 2) / 2)); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need });
})();
