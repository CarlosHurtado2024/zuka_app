// El terreno de área dada (Álgebra, alg-4; spec 2026-11-18-algebra-revision): un rectángulo de lados x y x + m tiene área
// x(x + m): una ecuación cuadrática. Se arrastra x y el rectángulo se llena de cuadritos con su área. Hay que llegar al
// área pedida; la otra raíz de la ecuación es negativa y no sirve como medida.
// params = { rounds: [{ m, area }] }   state = { rounds: [{ x }] }   (de 1 a 15)
GAMES['area-ecuacion'] = (() => {
  const A = (r, x) => x * (x + r.m);
  const need = r => { for (let x = 1; x <= 15; x++) if (A(r, x) === r.area) return x; return -1; };
  const ok = (s, r) => A(r, s.x) === r.area;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ x: 1 }),
    ok,
    solution: r => `x = ${need(r)}: ${need(r)} · ${need(r) + r.m} = ${r.area} (la otra raíz, ${-need(r) - r.m}, no es una medida)`,
    prompt: r => `Un terreno mide x por x + ${r.m} y tiene ${r.area} m². ¿Cuánto vale x?`,
    foot: () => 'Arrastra x',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, w = x + r.m, u = Math.min((G.W - 60) / (15 + r.m), (G.tY - 150) / 15);
      p.stroke(C.line); p.strokeWeight(0.6); for (let i = 0; i <= w; i++) p.line(30 + i * u, 108, 30 + i * u, 108 + x * u); for (let j = 0; j <= x; j++) p.line(30, 108 + j * u, 30 + w * u, 108 + j * u);
      p.noFill(); p.stroke(A(r, x) === r.area || G.locked ? C.ok : C.brand); p.strokeWeight(2.5); p.rect(30, 108, w * u, x * u);
      TK.label(p, C, `${x} × ${w} = ${A(r, x)}`, 30 + w * u / 2, 108 + x * u + 14, C.ink, 12, 140);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 15, x - 1, i => ((i + 1) % 3 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$x(x + ${r.m}) = ${r.area}\\quad\\to\\quad x^2 + ${r.m}x - ${r.area} = 0$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x - 1), y: G.tY }, to: { x: G.X(G.s.x + 4), y: G.tY }, text: 'Arrastra x', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 15) + 1; if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need });
})();
