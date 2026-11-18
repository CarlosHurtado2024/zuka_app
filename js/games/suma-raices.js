// La raíz no se reparte (Álgebra, alg-22a; spec 2026-11-18-algebra-revision): √(a + b) no es √a + √b. Dos cuadrados de
// áreas a y b; se arrastra el lado de un tercer cuadrado hasta que su área sea a + b. Al lado se ve la tira √a + √b,
// que es más larga: la raíz de una suma no se reparte.
// params = { rounds: [{ a, b }] }   (a + b es un cuadrado perfecto)   state = { rounds: [{ s }] }   (lado, de 1 a 12)
GAMES['suma-raices'] = (() => {
  const need = r => Math.round(Math.sqrt(r.a + r.b));
  const ok = (s, r) => s.s * s.s === r.a + r.b;
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ s: 1 }),
    ok,
    solution: r => `lado ${need(r)}: √${r.a + r.b} = ${need(r)}, no √${r.a} + √${r.b} = ${+(Math.sqrt(r.a) + Math.sqrt(r.b)).toFixed(2)}`,
    prompt: r => `Arma un cuadrado con el área de los dos: ${r.a} + ${r.b}`,
    foot: () => 'Arrastra el lado del cuadrado nuevo',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, sd = G.locked && !ok(G.s, r) ? need(r) : G.s.s, sa = Math.sqrt(r.a), sb = Math.sqrt(r.b), u = Math.min(14, (G.W - 60) / (sa + sb + need(r) + 2));
      const sq = (x, side, col, txt) => { p.stroke(col); p.strokeWeight(2); p.fill(RK.al(p, col, 60)); p.rect(x, 200 - side * u, side * u, side * u, 2); TK.label(p, C, txt, x + side * u / 2, 200 + 12, C.ink, 11, 70); };
      sq(16, sa, C.sky, `${r.a}`); sq(24 + sa * u, sb, C.mint, `${r.b}`); sq(G.W - 16 - sd * u, sd, ok(G.s, r) || G.locked ? C.ok : C.coral, `${sd}² = ${sd * sd}`);
      // La tira √a + √b frente al lado nuevo.
      const y = 236; p.noStroke(); p.fill(C.sky); p.rect(16, y, sa * u, 8); p.fill(C.mint); p.rect(16 + sa * u, y, sb * u, 8); p.fill(C.coral); p.rect(16, y + 14, sd * u, 8);
      TK.label(p, C, `√${r.a} + √${r.b} ≈ ${(sa + sb).toFixed(2)}`, 16 + (sa + sb) * u + 60, y + 4, C.mute, 10, 120);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 12, sd - 1, i => ((i + 1) % 2 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$\\sqrt{${r.a} + ${r.b}} = \\sqrt{${r.a + r.b}}${ok({ s: sd }, r) ? ` = ${sd}` : ''} \\ne \\sqrt{${r.a}} + \\sqrt{${r.b}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.s - 1), y: G.tY }, to: { x: G.X(G.s.s + 3), y: G.tY }, text: 'Arrastra el lado', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 12) + 1; if (v !== G.s.s || !G.touched[G.cur]) { G.s.s = v; G.touch(); } };
  return Object.assign(game, { need });
})();
