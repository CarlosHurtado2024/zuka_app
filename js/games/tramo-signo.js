// El signo en cada tramo (Álgebra, alg-93; spec 2026-11-18-algebra-revision): entre dos ceros seguidos un polinomio no
// cambia de signo. Se arrastra una ficha de prueba por la recta; arriba se ve el signo de cada factor y el del producto.
// Hay que dejar la ficha en un tramo donde el polinomio tenga el signo pedido.
// params = { rounds: [{ zeros: [..], want: 1 | -1, a?: 1 | -1 }] }   state = { rounds: [{ x }] }   (de −5.5 a 5.5 de medio en medio)
GAMES['tramo-signo'] = (() => {
  const sg = (r, x) => Math.sign((r.a || 1) * r.zeros.reduce((a, c) => a * (x - c), 1));
  const ok = (s, r) => sg(r, s.x) === r.want && !r.zeros.includes(s.x);
  const answer = r => { for (let x = -5.5; x <= 5.5; x += 0.5) if (ok({ x }, r)) return { x }; return null; };
  const fac = c => (c === 0 ? 'x' : `x ${c < 0 ? '+' : '-'} ${Math.abs(c)}`);
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ x: r.zeros[0] }),
    ok,
    solution: r => `por ejemplo x = ${answer(r).x}`,
    prompt: r => `¿Dónde es ${r.want > 0 ? 'positivo' : 'negativo'} $${r.a === -1 ? '-' : ''}${r.zeros.map(c => `(${fac(c)})`).join('')}$?`,
    foot: () => 'Arrastra la ficha de prueba por los tramos',
    layout(G) { G.L = { x0: 24, x1: G.W - 24, y: G.H - 112, min: -6, max: 6 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? answer(r).x : G.s.x, w = (G.W - 40) / (r.zeros.length + 1);
      r.zeros.forEach((c, i) => { const v = Math.sign(x - c); RK.chip(p, C, { x: 20 + i * w + 4, y: 110, w: w - 8, h: 40 }, `${fac(c)}: ${v > 0 ? '+' : v < 0 ? '−' : '0'}`, { on: true, col: v > 0 ? C.sky : v < 0 ? C.coral : C.line, size: 11 }); });
      const t = sg(r, x); RK.chip(p, C, { x: 20 + r.zeros.length * w + 4, y: 110, w: w - 8, h: 40 }, `P: ${t > 0 ? '+' : t < 0 ? '−' : '0'}`, { on: true, col: t === r.want ? C.ok : C.coral, size: 13 });
      const X = drawNumLine(p, C, G.L, { step: 1 }); G.X = X;
      r.zeros.forEach(c => drawDot(p, C, X(c), G.L.y, 10, C.ink));
      RK.knob(p, C, X(x), G.L.y - 24, C.brand);
      RK.strip(p, C, G.fb, `$x = ${x}:\\ P ${t > 0 ? '> 0' : t < 0 ? '< 0' : '= 0'}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.L.y) > 46) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x), y: G.L.y - 24 }, to: { x: G.X(G.s.x + 2), y: G.L.y - 24 }, text: 'Arrastra la ficha', ty: G.L.y - 60 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => { const L = G.L, v = Math.max(-5.5, Math.min(5.5, Math.round((L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)) * 2) / 2)); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
