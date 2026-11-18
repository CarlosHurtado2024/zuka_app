// Problemas de edades (Álgebra, alg-1; spec 2026-11-18-algebra-revision): una ecuación lineal traduce dos condiciones. Hoy la
// madre tiene k₁ veces la edad del hijo; dentro de L años tendrá k₂ veces la de él. Se arrastra la edad del hijo hoy; las
// barras de hoy y de dentro de L años se ajustan (las dos crecen lo mismo). Hay que cumplir las dos condiciones.
// params = { rounds: [{ k1, L, k2 }] }   state = { rounds: [{ s }] }   (edad del hijo de 1 a 20)
GAMES['edades-barras'] = (() => {
  const need = r => r.L * (r.k2 - 1) / (r.k1 - r.k2);
  const ok = (st, r) => st.s === need(r);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ s: 1 }),
    ok,
    solution: r => `hijo ${need(r)}, madre ${r.k1 * need(r)}`,
    prompt: r => `La madre tiene ${r.k1} veces la edad de su hijo. En ${r.L} años tendrá ${r.k2} veces su edad.`,
    foot: () => 'Arrastra la edad del hijo hoy',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, st = G.locked && !ok(G.s, r) ? { s: need(r) } : G.s, h = st.s, m = r.k1 * h, u = (G.W - 110) / (r.k1 * 20 + r.L);
      [['hoy', h, m], [`en ${r.L} años`, h + r.L, m + r.L]].forEach(([t, a, b], i) => {
        const y = 112 + i * 76; TK.label(p, C, t, 40, y + 22, C.mute, 10, 70);
        p.noStroke(); p.fill(C.sky); p.rect(84, y, a * u, 18, 3); TK.label(p, C, `hijo ${a}`, 84 + a * u + 32, y + 9, C.ink, 10, 60);
        p.fill(C.coral); p.rect(84, y + 24, b * u, 18, 3); TK.label(p, C, `madre ${b}`, Math.min(G.W - 34, 84 + b * u + 36), y + 33, C.ink, 10, 66);
      });
      const later = (m + r.L) === r.k2 * (h + r.L);
      TK.label(p, C, `en ${r.L} años: ${m + r.L} ${later ? '=' : '≠'} ${r.k2} × ${h + r.L}`, G.W / 2, 272, later ? C.ok : C.mute, 11, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 20, h - 1, i => (i % 3 === 2 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$${r.k1}x + ${r.L} = ${r.k2}(x + ${r.L})$`, { kicker: `x = ${h}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(1), y: G.tY }, text: 'Arrastra la edad', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 20) + 1; if (v !== G.s.s || !G.touched[G.cur]) { G.s.s = v; G.touch(); } };
  return Object.assign(game, { need });
})();
