// La regla del 72 (Álgebra, alg-13b; spec 2026-11-18-algebra-revision): con interés compuesto al r % por periodo, el
// dinero se duplica en unos 72 ÷ r periodos. Se arrastran los años y una barra muestra cuánto vale un peso; hay que hallar
// el primer año en que ya se duplicó, y compararlo con la regla.
// params = { rounds: [{ r }] }   state = { rounds: [{ t }] }   (t de 1 a 20)
GAMES['regla-del-72'] = (() => {
  const need = r => { let t = 1; while ((1 + r.r / 100) ** t < 2) t++; return t; };
  const ok = (s, r) => s.t === need(r);
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ t: 1 }),
    ok,
    solution: r => `${need(r)} años (la regla dice ${+(72 / r.r).toFixed(1)})`,
    prompt: r => `Al ${r.r} % anual compuesto, ¿en qué año se duplica el dinero?`,
    foot: () => 'Arrastra los años',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: need(r) } : G.s, v = (1 + r.r / 100) ** s.t, u = (G.W - 60) / 3, x0 = 24, y = 130;
      p.noStroke(); p.fill(ok(s, r) ? C.ok : v >= 2 ? C.coral : C.sky); p.rect(x0, y, Math.min(3, v) * u, 32, 4);
      [1, 2, 3].forEach(k => { p.stroke(k === 2 ? C.ink : C.line); p.strokeWeight(k === 2 ? 2 : 1); p.line(x0 + k * u, y - 10, x0 + k * u, y + 44); TK.label(p, C, `${k} peso${k > 1 ? 's' : ''}`, x0 + k * u, y + 56, C.mute, 9, 60); });
      TK.label(p, C, `1 peso en ${s.t} año${s.t > 1 ? 's' : ''}: ${v.toFixed(3)}`, G.W / 2, y - 22, C.ink, 12, G.W - 30);
      TK.label(p, C, `regla del 72: 72 ÷ ${r.r} ≈ ${+(72 / r.r).toFixed(1)} años`, G.W / 2, y + 86, C.mute, 11, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 20, s.t - 1, i => (i % 3 === 2 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$${(1 + r.r / 100).toFixed(2)}^{${s.t}} \\approx ${v.toFixed(3)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(1), y: G.tY }, text: 'Arrastra los años', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 20) + 1; if (v !== G.s.t || !G.touched[G.cur]) { G.s.t = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ t: need(r) }) });
})();
