// Dos binomios con x (Álgebra, alg-3; spec 2026-11-18-algebra-revision): (x + a)(x + b) = x² + (a + b)x + ab. Se
// arrastran a y b y el rectángulo se arma con un cuadrado, a + b barras y ab cuadritos. Hay que armar el trinomio pedido:
// las barras dicen la suma y los cuadritos el producto.
// params = { rounds: [{ s, p }] }   (x² + s x + p)   state = { rounds: [{ a, b }] }   (de 1 a 9)
GAMES['binomios-comun'] = (() => {
  const ok = (st, r) => st.a + st.b === r.s && st.a * st.b === r.p;
  const answer = r => { for (let a = 1; a <= 9; a++) for (let b = a; b <= 9; b++) if (a + b === r.s && a * b === r.p) return { a, b }; return null; };
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ a: 1, b: 1 }),
    ok,
    solution: r => { const { a, b } = answer(r); return `(x + ${a})(x + ${b})`; },
    prompt: r => `Arma $x^2 + ${r.s}x + ${r.p}$ como $(x + a)(x + b)$`,
    foot: () => 'Arrastra a y b: mira cuántas barras y cuántos cuadritos salen',
    layout(G) { G.t1 = G.H - 150; G.t2 = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, u = 64, sz = 12, ox = 40, oy = 108;
      RK.tile(p, C, 2, ox, oy, u, sz, false);
      for (let i = 0; i < s.b; i++) RK.tile(p, C, 1, ox + u + i * sz, oy, u, sz, false, { label: false });
      for (let i = 0; i < s.a; i++) { p.stroke(C.line); p.fill(RK.al(p, C.sky, 170)); p.rect(ox, oy + u + i * sz, u, sz, 3); }
      for (let i = 0; i < s.a * s.b; i++) RK.tile(p, C, 0, ox + u + (i % s.b) * sz, oy + u + Math.floor(i / s.b) * sz, u, sz, false, { label: false });
      TK.label(p, C, `${s.a + s.b} barras · ${s.a * s.b} cuadritos`, G.W - 80, oy + 30, C.ink, 12, 140);
      G.X1 = RK.track(p, C, 70, G.W - 24, G.t1, 9, s.a - 1, i => String(i + 1)); TK.label(p, C, 'a', 40, G.t1, C.mute, 12, 20);
      G.X2 = RK.track(p, C, 70, G.W - 24, G.t2, 9, s.b - 1, i => String(i + 1)); TK.label(p, C, 'b', 40, G.t2, C.mute, 12, 20);
      RK.strip(p, C, G.fb, `$(x + ${s.a})(x + ${s.b}) = x^2 + ${s.a + s.b}x + ${s.a * s.b}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const k = Math.abs(y - G.t1) < 20 ? 'a' : Math.abs(y - G.t2) < 20 ? 'b' : null; if (!k) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X1(G.s.a - 1), y: G.t1 }, to: { x: G.X1(G.s.a + 2), y: G.t1 }, text: 'Arrastra a y b', ty: G.t1 - 26 }),
    peek: G => ({ t1: G.t1, t2: G.t2 }),
  });
  game.move = (G, x) => { G.s[G.grab] = RK.pick(x, 70, G.W - 24, 9) + 1; G.touch(); };
  return Object.assign(game, { answer });
})();
