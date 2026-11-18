// El factor común en filas (Álgebra, alg-24b; spec 2026-11-18-algebra-revision): sacar factor común es repartir los
// bloques en filas iguales. Las barras y los cuadritos de px + q se acomodan en g filas: si g reparte justo los dos, las
// filas quedan iguales y se lee g(·x + ·). El más grande que sirve es el máximo común divisor.
// params = { rounds: [{ p, q }] }   (p barras x y q cuadritos)   state = { rounds: [{ g }] }   (filas, de 1 a 8)
GAMES['factor-comun-bloques'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const ok = (s, r) => s.g === gcd(r.p, r.q);
  const fits = (g, r) => r.p % g === 0 && r.q % g === 0;
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ g: 1 }),
    ok,
    solution: r => { const g = gcd(r.p, r.q); return `${g}(${r.p / g}x + ${r.q / g})`; },
    prompt: r => `Saca el mayor factor común de $${r.p}x + ${r.q}$`,
    foot: (r, s) => (fits(s.g, r) ? 'Busca el número de filas más grande que reparta justo' : `En ${s.g} filas no se reparte justo`),
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, g = G.locked && !ok(G.s, r) ? gcd(r.p, r.q) : G.s.g, good = fits(g, r), perP = Math.ceil(r.p / g), perQ = Math.ceil(r.q / g), u = 30, s = 11;
      const rh = Math.min(u + 6, (G.tY - 140) / g);
      for (let row = 0; row < g; row++) {
        const y = 106 + row * rh, nP = Math.min(perP, r.p - row * perP), nQ = Math.min(perQ, r.q - row * perQ);
        let x = 20;
        for (let i = 0; i < Math.max(0, nP); i++) { p.stroke(C.line); p.fill(RK.al(p, good ? C.sky : C.coral, 170)); p.rect(x, y, s, rh - 6, 2); x += s + 2; }
        x += 6;
        for (let i = 0; i < Math.max(0, nQ); i++) { p.stroke(C.line); p.fill(RK.al(p, good ? C.sun : C.coral, 170)); p.rect(x, y + (rh - 6) / 2 - 5, 10, 10, 2); x += 12; }
      }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 8, g - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, good ? `$${r.p}x + ${r.q} = ${g}(${r.p / g}x + ${r.q / g})$` : `$${g}\\text{ filas: no reparte justo}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.g - 1), y: G.tY }, to: { x: G.X(G.s.g + 2), y: G.tY }, text: 'Arrastra las filas', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const g = RK.pick(x, 30, G.W - 30, 8) + 1; if (g !== G.s.g || !G.touched[G.cur]) { G.s.g = g; G.touch(); } };
  return Object.assign(game, { gcd });
})();
