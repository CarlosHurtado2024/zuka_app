// El producto cero (Álgebra, alg-4; spec 2026-11-18-algebra-revision): si (x − p)(x − q) = 0, algún factor es cero. Dos
// barras muestran el valor de cada factor y una tercera su producto; se arrastran dos marcas por la recta y hay que
// dejarlas en los dos valores de x que anulan el producto.
// params = { rounds: [{ p, q, a? }] }   (a(x − p)(x − q) = 0)   state = { rounds: [{ m, n }] }   (de −6 a 6)
GAMES['producto-cero'] = (() => {
  const ok = (s, r) => [s.m, s.n].sort((x, y) => x - y).join() === [r.p, r.q].sort((x, y) => x - y).join();
  const f = (v, k) => `(x ${k < 0 ? '+' : '-'} ${Math.abs(k)})`;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ m: 0, n: 1 }),
    ok,
    solution: r => `x = ${r.p} o x = ${r.q}`,
    prompt: r => `Resuelve $${r.a && r.a !== 1 ? r.a : ''}${f(0, r.p)}${f(0, r.q)} = 0$`,
    foot: () => 'Arrastra las dos marcas: busca dónde se anula algún factor',
    layout(G) { G.L = { x0: 22, x1: G.W - 22, y: G.H - 120, min: -6, max: 6 }; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r, L } = G, s = G.locked && !ok(G.s, r) ? { m: r.p, n: r.q } : G.s, X = drawNumLine(p, C, L, { step: 1, every: 2 });
      G.X = X;
      [s.m, s.n].forEach((v, j) => {
        const f1 = v - r.p, f2 = v - r.q, pr = (r.a || 1) * f1 * f2, bx = j === 0 ? 20 : G.W / 2 + 6, w = G.W / 2 - 26;
        TK.label(p, C, `x = ${v}`, bx + w / 2, 104, C.ink, 13, w);
        [[f1, `x ${r.p < 0 ? '+' : '-'} ${Math.abs(r.p)}`], [f2, `x ${r.q < 0 ? '+' : '-'} ${Math.abs(r.q)}`], [pr, 'producto']].forEach(([val, t], k) => { const y = 124 + k * 26; p.noStroke(); p.fill(val === 0 ? C.ok : val < 0 ? C.coral : C.sky); p.rect(bx + w / 2, y, Math.max(-w / 2, Math.min(w / 2, val * 4)), 16, 3); TK.label(p, C, `${t}: ${val}`, bx + w / 2, y + 8, C.ink, 10, w); });
      });
      RK.knob(p, C, X(s.m), L.y - 22, C.sky); RK.knob(p, C, X(s.n), L.y + 26, C.coral);
      RK.strip(p, C, G.fb, `$x = ${s.m}\\quad\\text{y}\\quad x = ${s.n}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 46) return false; G.grab = y < G.L.y ? 'm' : 'n'; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X(G.s.m), y: G.L.y - 22 }, to: { x: G.X(G.s.m - 2), y: G.L.y - 22 }, text: 'Arrastra las marcas', ty: G.L.y + 56 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L; G.s[G.grab] = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); G.touch(); };
  return game;
})();
