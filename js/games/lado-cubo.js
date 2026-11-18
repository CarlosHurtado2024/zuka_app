// La raíz cúbica es el lado (Álgebra, alg-22a; spec 2026-11-18-algebra-revision): ∛V es el lado del cubo de volumen V.
// Se arrastra el lado y el cubo se arma con cubitos (se ven las capas); hay que llegar al volumen pedido.
// params = { rounds: [{ V }] }   state = { rounds: [{ s }] }   (lado de 1 a 6)
GAMES['lado-cubo'] = (() => {
  const ok = (st, r) => st.s ** 3 === r.V;
  const answer = r => ({ s: Math.round(Math.cbrt(r.V)) });
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ s: 1 }),
    ok,
    solution: r => `∛${r.V} = ${answer(r).s}`,
    prompt: r => `Arma un cubo de ${r.V} cubitos: ¿cuánto mide su lado?`,
    foot: () => 'Arrastra el lado del cubo',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, st = G.locked && !ok(G.s, r) ? answer(r) : G.s, n = st.s, c = Math.min(26, (G.tY - 150) / (n * 1.5 + 1), (G.W - 60) / (n * 1.5 + 1)), dx = c * 0.5, dy = c * 0.5, ox = G.W / 2 - (n * c + n * dx) / 2, oy = 110 + n * dy;
      const col = ok(st, r) ? C.ok : C.sky;
      // Caras visibles: frente, techo y lado derecho, con su cuadrícula.
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { p.stroke(C.bg); p.strokeWeight(1); p.fill(col); p.rect(ox + i * c, oy + j * c, c, c); }
      for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const x = ox + i * c + k * dx, y = oy - k * dy; p.fill(RK.al(p, col, 200)); p.quad(x, y, x + c, y, x + c + dx, y - dy, x + dx, y - dy); }
      for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { const x = ox + n * c + k * dx, y = oy + j * c - k * dy; p.fill(RK.al(p, col, 150)); p.quad(x, y, x + dx, y - dy, x + dx, y - dy + c, x, y + c); }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 6, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$${n}^3 = ${n ** 3}\\ ${ok(st, r) ? '=' : '\\ne'}\\ ${r.V}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X([1, 2, 5].find(i => (i + 1) ** 3 !== G.r.V)), y: G.tY }, text: 'Arrastra el lado', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 6) + 1; if (v !== G.s.s || !G.touched[G.cur]) { G.s.s = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
