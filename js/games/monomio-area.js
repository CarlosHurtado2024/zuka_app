// El producto de monomios es un área (Álgebra, alg-23a; spec 2026-11-18-algebra-revision): (a·xᵐ)(b·xⁿ) = ab·x^(m+n): los
// números se multiplican y los exponentes se suman. Un rectángulo con esos dos lados; se arrastran el coeficiente y el
// exponente del área, y el juego comprueba con un valor de x que el área coincida.
// params = { rounds: [{ f: [[c, e], [c, e]] }] }   state = { rounds: [{ c, e }] }   (c de 1 a 24, e de 0 a 7)
GAMES['monomio-area'] = (() => {
  const need = r => ({ c: r.f[0][0] * r.f[1][0], e: r.f[0][1] + r.f[1][1] });
  const ok = (s, r) => s.c === need(r).c && s.e === need(r).e;
  const mono = (c, e) => `${c === 1 && e ? '' : c}${e ? (e === 1 ? 'x' : `x^{${e}}`) : ''}`;
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ c: 1, e: 0 }),
    ok,
    solution: r => mono(need(r).c, need(r).e).replace(/[{}^]/g, ''),
    prompt: r => `Área del rectángulo de lados $${mono(...r.f[0])}$ y $${mono(...r.f[1])}$`,
    foot: () => 'Arrastra el número y el exponente del área',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? need(r) : G.s, w = G.W * 0.55, h = 90, x0 = (G.W - w) / 2, y0 = 120;
      p.stroke(C.ink); p.strokeWeight(1.4); p.fill(RK.al(p, ok(s, r) ? C.ok : C.sky, 90)); p.rect(x0, y0, w, h, 4);
      TK.label(p, C, `$${mono(...r.f[0])}$`, x0 + w / 2, y0 - 12, C.ink, 14, w); TK.label(p, C, `$${mono(...r.f[1])}$`, x0 - 22, y0 + h / 2, C.ink, 14, 40);
      TK.label(p, C, `$${mono(s.c, s.e)}$`, x0 + w / 2, y0 + h / 2, C.ink, 18, w - 10);
      const t = 2, A = need(r).c * t ** need(r).e, B = s.c * t ** s.e;
      TK.label(p, C, `con x = 2: el área vale ${A}; tu monomio da ${B}`, G.W / 2, y0 + h + 22, ok(s, r) ? C.ok : C.mute, 10, G.W - 30);
      G.X = [RK.track(p, C, 40, G.W - 30, G.tr[0], 24, s.c - 1, i => (i % 4 === 3 ? String(i + 1) : null), C.sky), RK.track(p, C, 40, G.W - 30, G.tr[1], 8, s.e, i => String(i), C.coral)];
      TK.label(p, C, 'número', 22, G.tr[0] - 16, C.mute, 10, 44); TK.label(p, C, 'exponente', 30, G.tr[1] - 16, C.mute, 10, 60);
      RK.strip(p, C, G.fb, `$${mono(...r.f[0])} \\cdot ${mono(...r.f[1])} ${ok(s, r) ? '=' : '\\ne'} ${mono(s.c, s.e)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[1](0), y: G.tr[1] }, to: { x: G.X[1](1), y: G.tr[1] }, text: 'Arrastra el exponente', ty: G.tr[0] - 32 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const j = G.grab; if (j === 0) { const c = RK.pick(x, 40, G.W - 30, 24) + 1; if (c !== G.s.c || !G.touched[G.cur]) { G.s.c = c; G.touch(); } } else { const e = RK.pick(x, 40, G.W - 30, 8); if (e !== G.s.e || !G.touched[G.cur]) { G.s.e = e; G.touch(); } } };
  return Object.assign(game, { need });
})();
