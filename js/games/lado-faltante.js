// El lado que falta (Álgebra, alg-23b; spec 2026-11-18-algebra-revision): dividir x² + sx + p entre x + a es buscar el
// otro lado del rectángulo. Se arrastra b y se arma el rectángulo (x + a)(x + b) con los bloques; los cuadritos que no
// caben (o que faltan) son el residuo. Hay que dejar el residuo más pequeño posible, menor que el divisor: aquí, un número.
// params = { rounds: [{ a, s, p }] }   state = { rounds: [{ b }] }   (de 0 a 9)
GAMES['lado-faltante'] = (() => {
  const need = r => r.s - r.a;
  const res = (r, b) => r.p - r.a * b;
  const ok = (s, r) => s.b === need(r);
  const poly = c => GAMES['bloques-polinomio'].poly(c);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ b: 0 }),
    ok,
    solution: r => `(${poly([1, r.s, r.p])}) ÷ (x + ${r.a}) = x + ${need(r)}, residuo ${res(r, need(r))}`,
    prompt: r => `Divide $${poly([1, r.s, r.p])}$ entre $x + ${r.a}$`,
    foot: (r, s) => (s.b + r.a !== r.s ? `Las barras no cuadran: hay ${r.s} y el rectángulo usa ${s.b + r.a}` : 'Las barras cuadran: lo que sobra de cuadritos es el residuo'),
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, b = G.locked && !ok(G.s, r) ? need(r) : G.s.b, u = 64, sz = 13, ox = 30, oy = 108;
      RK.tile(p, C, 2, ox, oy, u, sz, false);
      for (let i = 0; i < b; i++) RK.tile(p, C, 1, ox + u + i * sz, oy, u, sz, false, { label: false });
      for (let i = 0; i < r.a; i++) { p.stroke(C.line); p.fill(RK.al(p, C.sky, 170)); p.rect(ox, oy + u + i * sz, u, sz, 3); }
      for (let i = 0; i < r.a * b; i++) RK.tile(p, C, 0, ox + u + (i % Math.max(1, b)) * sz, oy + u + Math.floor(i / Math.max(1, b)) * sz, u, sz, false, { label: false });
      const rr = res(r, b), bars = r.s - (r.a + b);
      TK.label(p, C, `sobran ${Math.max(0, bars)} barras y ${rr} cuadritos`, G.W - 90, oy + 30, bars === 0 ? C.ink : C.coral, 11, 150);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 10, b, i => String(i));
      RK.strip(p, C, G.fb, `$${poly([1, r.s, r.p])} = (x + ${r.a})(x + ${b}) ${bars ? `${bars > 0 ? '+' : '-'} ${Math.abs(bars)}x` : ''} ${rr < 0 ? '-' : '+'} ${Math.abs(rr)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.b), y: G.tY }, to: { x: G.X(G.s.b + 3), y: G.tY }, text: 'Arrastra el otro lado', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const b = RK.pick(x, 30, G.W - 30, 10); if (b !== G.s.b || !G.touched[G.cur]) { G.s.b = b; G.touch(); } };
  return Object.assign(game, { need });
})();
