// La prueba de la división (Álgebra, alg-23b; spec 2026-11-18-algebra-revision): dividendo = divisor · cociente +
// residuo. Se conocen el dividendo, el divisor y el cociente; se arrastra el residuo (un número) hasta que la igualdad se
// cumpla: el producto divisor · cociente se desarrolla solo y se compara con el dividendo.
// params = { rounds: [{ P: [x², x, 1], d, Q: [x, 1] }] }   (divisor x + d)   state = { rounds: [{ R }] }   (de −12 a 12)
GAMES['completa-identidad'] = (() => {
  const prod = r => [r.Q[0], r.Q[1] + r.d * r.Q[0], r.d * r.Q[1]];
  const need = r => r.P[2] - prod(r)[2];
  const ok = (s, r) => s.R === need(r) && prod(r)[0] === r.P[0] && prod(r)[1] === r.P[1];
  const poly = c => GAMES['bloques-polinomio'].poly(c);
  const game = roundsGame({
    aspect: 1,
    init: () => ({ R: 0 }),
    ok,
    solution: r => `residuo ${need(r)}`,
    prompt: r => `$${poly(r.P)} = (x ${r.d < 0 ? '-' : '+'} ${Math.abs(r.d)})(${poly([0, ...r.Q])}) + R$. ¿R?`,
    foot: () => 'Arrastra el residuo',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, R = G.locked && !ok(G.s, r) ? need(r) : G.s.R, pr = prod(r), tot = [pr[0], pr[1], pr[2] + R];
      TK.label(p, C, `$(x ${r.d < 0 ? '-' : '+'} ${Math.abs(r.d)})(${poly([0, ...r.Q])}) = ${poly(pr)}$`, G.W / 2, 124, C.ink, 15, G.W - 30);
      TK.label(p, C, `$${poly(pr)} ${R < 0 ? '-' : '+'} ${Math.abs(R)} = ${poly(tot)}$`, G.W / 2, 168, tot.join() === r.P.join() ? C.ok : C.coral, 15, G.W - 30);
      TK.label(p, C, `meta: $${poly(r.P)}$`, G.W / 2, 208, C.mute, 13, G.W - 30);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, 25, R + 12, i => (i % 4 === 0 ? String(i - 12) : null));
      RK.strip(p, C, G.fb, `$R = ${R}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.R + 12), y: G.tY }, to: { x: G.X(G.s.R + 16), y: G.tY }, text: 'Arrastra el residuo', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const R = RK.pick(x, 24, G.W - 24, 25) - 12; if (R !== G.s.R || !G.touched[G.cur]) { G.s.R = R; G.touch(); } };
  return Object.assign(game, { need });
})();
