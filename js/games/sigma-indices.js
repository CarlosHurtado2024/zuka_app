// Los límites de la sigma (Álgebra, alg-15; spec 2026-11-18-algebra-revision): en Σ el índice recorre de un límite a otro.
// Se ve la suma escrita término a término y una fila de índices k; se arrastran los dos topes (desde y hasta) y la
// sigma se desarrolla sola. Hay que dejar justo los términos de la suma pedida.
// params = { rounds: [{ f: 'texto de f(k)', vals: [f(1), …, f(10)], lo, hi }] }   state = { rounds: [{ a, b }] }
GAMES['sigma-indices'] = (() => {
  const ok = (s, q) => s.a === q.lo && s.b === q.hi;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ a: 1, b: 10 }),
    ok,
    solution: q => `k de ${q.lo} a ${q.hi}`,
    prompt: q => `Escribe $${q.vals.slice(q.lo - 1, q.hi).join(' + ')}$ con una sigma`,
    foot: () => 'Arrastra los topes: desde dónde y hasta dónde va k',
    layout(G) { G.y = G.H * 0.42; G.x0 = 20; G.u = (G.W - 40) / 10; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r: q } = G, s = G.locked && !ok(G.s, q) ? { a: q.lo, b: q.hi } : G.s;
      for (let k = 1; k <= 10; k++) {
        const x = G.x0 + (k - 0.5) * G.u, on = k >= s.a && k <= s.b;
        RK.chip(p, C, { x: x - G.u / 2 + 2, y: G.y - 18, w: G.u - 4, h: 36 }, String(q.vals[k - 1]), { on, col: C.mint, size: 12 });
        TK.label(p, C, `k=${k}`, x, G.y + 30, C.mute, 9, G.u);
      }
      [['a', s.a - 0.5], ['b', s.b + 0.5]].forEach(([key, v]) => { const x = G.x0 + v * G.u - G.u / 2; RK.knob(p, C, x, G.y - 40, G.grab === key ? C.brand : C.coral); p.stroke(C.coral); p.strokeWeight(2); p.line(x, G.y - 28, x, G.y + 22); });
      const terms = q.vals.slice(s.a - 1, s.b);
      RK.strip(p, C, G.fb, `$\\sum_{k=${s.a}}^{${s.b}} ${q.f} = ${terms.length > 4 ? `${terms.slice(0, 2).join(' + ')} + \\cdots + ${terms.at(-1)}` : terms.join(' + ')}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      if (Math.abs(y - (G.y - 40)) > 30 && Math.abs(y - G.y) > 24) return false;
      const xa = G.x0 + (G.s.a - 1) * G.u, xb = G.x0 + G.s.b * G.u;
      G.grab = Math.abs(x - xa) <= Math.abs(x - xb) ? 'a' : 'b'; game.move(G, x); return true;
    },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.x0, y: G.y - 40 }, to: { x: G.x0 + 2 * G.u, y: G.y - 40 }, text: 'Arrastra los topes', ty: G.y + 56 }),
    peek: G => ({ y: G.y, x0: G.x0, u: G.u }),
  });
  game.move = (G, x) => {
    const s = G.s, k = Math.round((x - G.x0) / G.u);   // un tope está en el hueco k (entre k y k + 1)
    if (G.grab === 'a') s.a = Math.max(1, Math.min(s.b, k + 1)); else s.b = Math.max(s.a, Math.min(10, k));
    G.touch();
  };
  return game;
})();
