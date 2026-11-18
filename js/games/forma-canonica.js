// De la forma general a la canónica (Álgebra, alg-4a; spec 2026-11-18-algebra-revision): y = x² + bx + c es una
// parábola cuyo vértice (h, k) se lee en y = (x − h)² + k. Se arrastran h y k y la parábola de trazos (la canónica) se
// mueve sobre la dada; cuando coinciden, h = −b/2 y k = c − h².
// params = { rounds: [{ b, c }] }   (b par)   state = { rounds: [{ h, k }] }   (h de −5 a 5; k de −8 a 8)
GAMES['forma-canonica'] = (() => {
  const V = { x0: -7, x1: 7, y0: -9, y1: 12 };
  const need = r => ({ h: -r.b / 2, k: r.c - (r.b / 2) ** 2 });
  const ok = (s, r) => s.h === need(r).h && s.k === need(r).k;
  const sg = v => (v < 0 ? `- ${Math.abs(v)}` : `+ ${v}`);
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ h: 0, k: 0 }),
    ok,
    solution: r => { const { h, k } = need(r); return `y = (x ${sg(-h)})² ${sg(k)}`; },
    prompt: r => `Lleva $y = x^2 ${sg(r.b)}x ${sg(r.c)}$ a la forma $(x - h)^2 + k$`,
    foot: () => 'Arrastra h (arriba) y k (abajo) hasta que la parábola de trazos se monte encima',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.44 }; G.t1 = G.H - 150; G.t2 = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? need(r) : G.s, M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => x * x + r.b * x + r.c, C.sky, 4);
      p.drawingContext.setLineDash([6, 5]); RK.curve(p, G.b, M, V, x => (x - s.h) ** 2 + s.k, ok(s, r) ? C.ok : C.coral, 2); p.drawingContext.setLineDash([]);
      drawDot(p, C, M.X(s.h), M.Y(s.k), 11, C.coral);
      G.X1 = RK.track(p, C, 50, G.W - 24, G.t1, 11, s.h + 5, i => (i % 2 === 0 ? String(i - 5) : null)); TK.label(p, C, 'h', 26, G.t1, C.mute, 12, 20);
      G.X2 = RK.track(p, C, 50, G.W - 24, G.t2, 17, s.k + 8, i => (i % 4 === 0 ? String(i - 8) : null)); TK.label(p, C, 'k', 26, G.t2, C.mute, 12, 20);
      RK.strip(p, C, G.fb, `$y = (x ${sg(-s.h)})^2 ${sg(s.k)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const k = Math.abs(y - G.t1) < 20 ? 'h' : Math.abs(y - G.t2) < 20 ? 'k' : null; if (!k) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X1(G.s.h + 5), y: G.t1 }, to: { x: G.X1(G.s.h + 3), y: G.t1 }, text: 'Arrastra h y k', ty: G.t1 - 26 }),
    peek: G => ({ t1: G.t1, t2: G.t2 }),
  });
  game.move = (G, x) => { if (G.grab === 'h') G.s.h = RK.pick(x, 50, G.W - 24, 11) - 5; else G.s.k = RK.pick(x, 50, G.W - 24, 17) - 8; G.touch(); };
  return Object.assign(game, { need });
})();
