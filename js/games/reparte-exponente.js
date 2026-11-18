// La potencia de un producto (Álgebra, alg-21b; spec 2026-11-18-algebra-revision): (a·b)ⁿ = aⁿ·bⁿ y (a/b)ⁿ = aⁿ/bⁿ: el
// exponente le llega a cada factor. Arriba está el valor de la potencia; se arrastra el exponente de cada factor por
// separado y una barra muestra el valor que dan. Hay que igualarlo.
// params = { rounds: [{ a, b, n, div }] }   state = { rounds: [{ e: [ea, eb] }] }   (exponentes de 0 a 6)
GAMES['reparte-exponente'] = (() => {
  const val = (r, ea, eb) => (r.div ? r.a ** ea / r.b ** eb : r.a ** ea * r.b ** eb);
  const ok = (s, r) => s.e[0] === r.n && s.e[1] === r.n;
  const answer = r => ({ e: [r.n, r.n] });
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ e: [1, 0] }),
    ok,
    solution: r => `${r.a}^${r.n} ${r.div ? '÷' : '·'} ${r.b}^${r.n} = ${val(r, r.n, r.n)}`,
    prompt: r => `Reparte el exponente: $\\left(${r.a} ${r.div ? '\\div' : '\\cdot'} ${r.b}\\right)^{${r.n}}$`,
    foot: () => 'Arrastra el exponente de cada factor',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, goal = val(r, r.n, r.n), now = val(r, s.e[0], s.e[1]), top = Math.max(goal, now) * 1.1, u = (G.W - 60) / top;
      [['meta', goal, C.mute], ['tus exponentes', now, ok(s, r) ? C.ok : C.sky]].forEach(([t, v, col], i) => { const y = 112 + i * 44; p.noStroke(); p.fill(col); p.rect(24, y, Math.max(2, v * u), 24, 4); TK.label(p, C, `${t}: ${+v.toFixed(4)}`, G.W / 2, y + 34, C.mute, 10, G.W - 30); });
      G.X = [0, 1].map(j => { TK.label(p, C, `exponente de ${j ? r.b : r.a}`, 70, G.tr[j] - 16, C.ink, 10, 130); return RK.track(p, C, 30, G.W - 30, G.tr[j], 7, s.e[j], i => String(i), j ? C.coral : C.sky); });
      RK.strip(p, C, G.fb, `$${r.a}^{${s.e[0]}} ${r.div ? '\\div' : '\\cdot'} ${r.b}^{${s.e[1]}} = ${+now.toFixed(4)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[1](0), y: G.tr[1] }, to: { x: G.X[1](1), y: G.tr[1] }, text: 'Arrastra un exponente', ty: G.tr[0] - 34 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 7), j = G.grab; if (v !== G.s.e[j] || !G.touched[G.cur]) { G.s.e[j] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
