// Bolsas y sobrantes (Álgebra, alg-23b; spec 2026-11-18-algebra-revision): dividir es empacar. N objetos en bolsas de d:
// se arrastra cuántas bolsas llenar; lo que queda suelto es el residuo, y solo vale si es menor que una bolsa. Así se lee
// dividendo = divisor · cociente + residuo, la misma igualdad de la división de polinomios.
// params = { rounds: [{ N, d }] }   state = { rounds: [{ q }] }   (de 0 a 15)
GAMES['bolsas-residuo'] = (() => {
  const ok = (s, r) => s.q === Math.floor(r.N / r.d);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ q: 1 }),
    ok,
    solution: r => `${r.N} = ${r.d} · ${Math.floor(r.N / r.d)} + ${r.N % r.d}`,
    prompt: r => `Empaca ${r.N} en bolsas de ${r.d}: ¿cociente y residuo?`,
    foot: (r, s) => { const res = r.N - r.d * s.q; return res < 0 ? 'No alcanzan para tantas bolsas' : res >= r.d ? 'Sobra para otra bolsa: el residuo debe ser menor que el divisor' : 'El residuo es menor que una bolsa'; },
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, q = G.locked && !ok(G.s, r) ? Math.floor(r.N / r.d) : G.s.q, res = r.N - r.d * q, cols = 5, bw = (G.W - 40) / cols;
      for (let b = 0; b < Math.min(q, 15); b++) { const x = 20 + (b % cols) * bw, y = 104 + Math.floor(b / cols) * 40; p.stroke(res < 0 && b >= Math.floor(r.N / r.d) ? C.bad : C.line); p.strokeWeight(1.4); p.fill(RK.al(p, C.sky, 70)); p.rect(x + 3, y, bw - 6, 34, 8); TK.label(p, C, String(r.d), x + bw / 2, y + 17, C.ink, 12, bw); }
      const loose = Math.max(0, res);
      for (let i = 0; i < Math.min(loose, 40); i++) { p.noStroke(); p.fill(res >= r.d ? C.coral : C.sun); p.circle(28 + (i % 16) * 17, 238 + Math.floor(i / 16) * 16, 11); }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 16, q, i => (i % 3 === 0 ? String(i) : null));
      RK.strip(p, C, G.fb, `$${r.N} = ${r.d}\\cdot${q} + ${res}$`, { kicker: `cociente ${q} · residuo ${res}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.q), y: G.tY }, to: { x: G.X(G.s.q + 4), y: G.tY }, text: 'Arrastra las bolsas', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const q = RK.pick(x, 30, G.W - 30, 16); if (q !== G.s.q || !G.touched[G.cur]) { G.s.q = q; G.touch(); } };
  return game;
})();
