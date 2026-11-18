// El factor del cambio (Álgebra, alg-13c; spec 2026-11-18-algebra-revision): cambiar un r % es multiplicar por un factor,
// y el cambio se mide sobre el valor de antes. Se arrastra el factor en una regla (de 0.50 a 1.50) y la barra de antes se
// estira o se encoge; hay que dejarla igual a la de después. El cambio porcentual se escribe solo: de 40 a 50 es +25 %,
// pero de 50 a 40 es −20 %.
// params = { rounds: [{ from, to }] }   state = { rounds: [{ k }] }   (k: índice del factor, de 0.50 a 1.50 de 0.05 en 0.05)
GAMES['factor-cambio'] = (() => {
  const F = Array.from({ length: 21 }, (_, i) => +(0.5 + i * 0.05).toFixed(2));
  const need = r => F.findIndex(f => Math.abs(f * r.from - r.to) < 1e-9);
  const ok = (s, r) => s.k === need(r);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ k: 10 }),
    ok,
    solution: r => { const f = F[need(r)]; return `× ${f}: ${f > 1 ? '+' : '−'}${Math.round(Math.abs(f - 1) * 100)} %`; },
    prompt: r => `Pasó de ${r.from} a ${r.to}. ¿Por cuánto se multiplicó?`,
    foot: () => 'Arrastra el factor hasta que las dos barras queden iguales',
    layout(G) { G.y1 = 124; G.y2 = 184; G.tY = G.H - 120; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? need(r) : G.s.k, f = F[k], u = (G.W - 70) / (Math.max(r.from, r.to) * 1.5);
      TK.label(p, C, 'antes', 30, G.y1 - 16, C.mute, 10, 50); TK.label(p, C, 'después', 34, G.y2 - 16, C.mute, 10, 60);
      p.noStroke(); p.fill(RK.al(p, C.sky, 90)); p.rect(20, G.y1, r.from * u, 24, 5); p.fill(C.sky); p.rect(20, G.y1, r.from * f * u, 24, 5);
      TK.label(p, C, `${r.from} × ${f} = ${+(r.from * f).toFixed(2)}`, Math.min(G.W - 70, 20 + r.from * f * u + 60), G.y1 + 12, C.ink, 11, 120);
      p.fill(C.coral); p.rect(20, G.y2, r.to * u, 24, 5); TK.label(p, C, String(r.to), 20 + r.to * u + 20, G.y2 + 12, C.ink, 12, 40);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, F.length, k, i => (i % 4 === 0 ? F[i].toFixed(1) : null));
      const pc = Math.round((f - 1) * 100);
      RK.strip(p, C, G.fb, `$\\times\\,${f}\\;\\Rightarrow\\;${pc >= 0 ? '+' : '-'}${Math.abs(pc)}\\,\\%$`, { kicker: 'Cambio sobre el valor de antes', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k), y: G.tY }, to: { x: G.X(G.s.k + 4), y: G.tY }, text: 'Arrastra el factor', ty: G.tY - 36 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 24, G.W - 24, F.length); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { need, F });
})();
