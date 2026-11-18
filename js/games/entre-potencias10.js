// Entre potencias de 10 (Álgebra, alg-72; spec 2026-11-18-algebra-revision): el logaritmo en base 10 cuenta las cifras: si
// 10ᵏ ≤ N < 10ᵏ⁺¹, entonces k ≤ log N < k + 1 y N tiene k + 1 cifras antes de la coma. Una regla con tramos entre potencias
// de 10; se arrastra el número N a su tramo y el juego muestra su logaritmo.
// params = { rounds: [{ N, tex }] }   state = { rounds: [{ k }] }   (k de −3 a 6)
GAMES['entre-potencias10'] = (() => {
  const K = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  const need = r => Math.floor(Math.log10(r.N) + 1e-12);
  const ok = (s, r) => s.k === need(r);
  const game = roundsGame({
    aspect: 1,
    init: r => ({ k: need(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => `10^${need(r)} ≤ ${r.N} < 10^${need(r) + 1}`,
    prompt: r => `¿Entre qué potencias de 10 está $${r.tex}$?`,
    foot: () => 'Arrastra el número a su tramo de la regla',
    layout(G) { G.tY = G.H * 0.5; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? need(r) : G.s.k, x0 = 18, x1 = G.W - 18, w = (x1 - x0) / K.length, y = G.tY;
      K.forEach((v, i) => { const on = v === k; p.stroke(C.line); p.strokeWeight(1); p.fill(on ? RK.al(p, ok({ k }, r) ? C.ok : C.brand, 60) : RK.al(p, C.card, 160)); p.rect(x0 + i * w, y, w, 28); if (i % 2 === 0 || K.length * 34 < x1 - x0) TK.label(p, C, `$10^{${v}}$`, x0 + i * w, y + 44, C.mute, 10, 34); });
      TK.label(p, C, '$10^{7}$', x1, y + 44, C.mute, 10, 34);
      const cx = x0 + (K.indexOf(k) + 0.5) * w;
      RK.chip(p, C, { x: Math.max(6, Math.min(G.W - 116, cx - 55)), y: y - 54, w: 110, h: 34 }, `$${r.tex}$`, { on: true, col: C.sky, size: 13 });
      p.stroke(C.sky); p.strokeWeight(2); p.line(cx, y - 20, cx, y);
      G.cx = cx;
      const L = Math.log10(r.N);
      RK.strip(p, C, G.fb, ok({ k }, r) ? `$\\log ${r.tex} \\approx ${L.toFixed(3)}$` : `$10^{${k}} \\le N < 10^{${k + 1}}\\ ?$`, { kicker: ok({ k }, r) ? `Entre ${k} y ${k + 1}` : 'Ubica el tramo', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (y < G.tY - 60 || y > G.tY + 50) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.cx, y: G.tY - 36 }, to: { x: G.cx + 70, y: G.tY + 14 }, text: 'Arrastra a su tramo', ty: G.tY + 70 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const i = Math.max(0, Math.min(K.length - 1, Math.floor((x - 18) / ((G.W - 36) / K.length)))), k = K[i]; if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { need });
})();
