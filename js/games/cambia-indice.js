// Corre el índice (Álgebra, alg-15; spec 2026-11-18-algebra-revision): la misma suma se escribe con otros límites si se
// corre el índice. Arriba está Σ desde a hasta b de f(k) con sus términos; abajo la misma suma con j = k + c: se arrastra
// el corrimiento c y los términos de abajo se mueven. Hay que alinearlos para que las dos sigmas sumen lo mismo.
// params = { rounds: [{ lo, hi, add, newLo }] }   (arriba Σ_{k=lo}^{hi} (k + add); abajo Σ_{j}^{} j)   state = { rounds: [{ c }] }
GAMES['cambia-indice'] = (() => {
  const need = q => q.add;   // j = k + add
  const ok = (s, q) => s.c === need(q);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ c: 0 }),
    ok,
    solution: q => `j = k + ${q.add}: Σ_{j=${q.lo + q.add}}^{${q.hi + q.add}} j`,
    prompt: q => `Escribe $\\sum_{k=${q.lo}}^{${q.hi}} (k + ${q.add})$ como $\\sum j$`,
    foot: () => 'Arrastra el corrimiento: con j = k + c cambian los límites',
    layout(G) { G.y1 = 140; G.y2 = 210; G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q } = G, c = G.locked && !ok(G.s, q) ? need(q) : G.s.c, n = q.hi - q.lo + 1, w = Math.min(48, (G.W - 30) / n - 4);
      for (let i = 0; i < n; i++) {
        const k = q.lo + i, x = G.W / 2 - (n * (w + 4) - 4) / 2 + i * (w + 4);
        RK.chip(p, C, { x, y: G.y1 - 16, w, h: 32 }, String(k + q.add), { on: true, col: C.sky, size: 14 });
        const j = k + c, good = j === k + q.add;
        RK.chip(p, C, { x, y: G.y2 - 16, w, h: 32 }, String(j), { on: true, col: good ? C.ok : C.coral, size: 14 });
      }
      TK.label(p, C, 'k + ' + q.add, 30, G.y1, C.mute, 10, 50); TK.label(p, C, 'j', 30, G.y2, C.mute, 11, 20);
      G.X = RK.track(p, C, 40, G.W - 40, G.tY, 7, c, i => String(i));
      RK.strip(p, C, G.fb, `$\\sum_{k=${q.lo}}^{${q.hi}} (k + ${q.add}) \\;\\;?\\;\\; \\sum_{j=${q.lo + c}}^{${q.hi + c}} j$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.c), y: G.tY }, to: { x: G.X(G.s.c + 2), y: G.tY }, text: 'Arrastra el corrimiento', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const c = RK.pick(x, 40, G.W - 40, 7); if (c !== G.s.c || !G.touched[G.cur]) { G.s.c = c; G.touch(); } };
  return game;
})();
