// Números seguidos (Álgebra, alg-1; spec 2026-11-18-algebra-revision): plantear una ecuación con una incógnita. Hay k
// números consecutivos (o de dos en dos) que suman S; se arrastra el primero, x, y los demás lo siguen: x, x + d, x + 2d…
// Las barras muestran la suma, que es kx + (algo fijo). Hay que encontrar x.
// params = { rounds: [{ k, d, S }] }   state = { rounds: [{ x }] }   (de 1 a 60)
GAMES['consecutivos'] = (() => {
  const sum = (r, x) => r.k * x + (r.d * r.k * (r.k - 1)) / 2;
  const need = r => (r.S - (r.d * r.k * (r.k - 1)) / 2) / r.k;
  const ok = (s, r) => sum(r, s.x) === r.S;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ x: 1 }),
    ok,
    solution: r => Array.from({ length: r.k }, (_, i) => need(r) + i * r.d).join(' + ') + ` = ${r.S}`,
    prompt: r => `${r.k} números ${r.d === 1 ? 'seguidos' : r.d === 2 ? 'pares (o impares) seguidos' : `de ${r.d} en ${r.d}`} suman ${r.S}. ¿Cuál es el primero?`,
    foot: () => 'Arrastra el primero: los demás lo siguen',
    layout(G) { G.base = G.H - 150; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, w = (G.W - 40) / r.k, top = 60 + r.d * r.k, Y = v => G.base - (G.base - 104) * v / top;
      for (let i = 0; i < r.k; i++) { const v = x + i * r.d; p.noStroke(); p.fill(C.sky); p.rect(20 + i * w + 4, Y(v), w - 8, G.base - Y(v), 3); TK.label(p, C, String(v), 20 + i * w + w / 2, Y(v) - 10, C.ink, 12, w); }
      TK.label(p, C, `suma: ${sum(r, x)}`, G.W / 2, 104, sum(r, x) === r.S ? C.ok : C.mute, 13, 140);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 60, x - 1, i => ((i + 1) % 10 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$${r.k}x + ${(r.d * r.k * (r.k - 1)) / 2} = ${r.S}$`, { kicker: `x = ${x}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x - 1), y: G.tY }, to: { x: G.X(G.s.x + 12), y: G.tY }, text: 'Arrastra el primero', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 60) + 1; if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need });
})();
