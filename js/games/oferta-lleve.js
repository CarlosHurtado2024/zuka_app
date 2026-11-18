// «Lleve n, pague m» como porcentaje (Álgebra, alg-13c; spec 2026-11-18-algebra-revision): en una oferta así se regalan
// n − m de cada n unidades, así que el descuento es (n − m)/n del total. Se ven las unidades (las pagadas y las regaladas)
// y una regla de porcentaje encima; se arrastra el porcentaje de descuento hasta cubrir justo lo regalado.
// params = { rounds: [{ take, pay }] }   state = { rounds: [{ p }] }   (p de 0 a 60, de 5 en 5)
GAMES['oferta-lleve'] = (() => {
  const P = Array.from({ length: 13 }, (_, i) => i * 5);
  const need = r => (r.take - r.pay) / r.take * 100;
  const ok = (s, r) => Math.abs(s.p - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ p: 0 }),
    ok,
    solution: r => `${need(r)} % de descuento`,
    prompt: r => `«Lleve ${r.take}, pague ${r.pay}»: ¿qué porcentaje de descuento es?`,
    foot: () => 'Arrastra el descuento hasta cubrir lo que no se paga',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, pc = G.locked && !ok(G.s, r) ? need(r) : G.s.p, x0 = 20, w = G.W - 40, cw = w / r.take, y = 130;
      for (let i = 0; i < r.take; i++) { p.stroke(C.bg); p.strokeWeight(2); p.fill(i < r.pay ? C.sky : C.mint); p.rect(x0 + i * cw, y, cw, 46, 6); TK.label(p, C, i < r.pay ? 'paga' : 'gratis', x0 + (i + 0.5) * cw, y + 60, C.mute, 9, cw); }
      const dx = x0 + w * (1 - pc / 100);
      p.noStroke(); p.fill(RK.al(p, ok({ p: pc }, r) ? C.ok : C.coral, 90)); p.rect(dx, y - 10, x0 + w - dx, 66, 6);
      p.stroke(C.brand); p.strokeWeight(2); p.line(dx, y - 16, dx, y + 62);
      TK.label(p, C, `descuento ${pc} %`, Math.max(60, Math.min(G.W - 60, dx)), y - 26, C.ink, 11, 120);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, P.length, P.indexOf(pc), i => (i % 2 === 0 ? `${P[i]}` : null));
      RK.strip(p, C, G.fb, `$\\dfrac{${r.take - r.pay}}{${r.take}} ${ok({ p: pc }, r) ? '=' : '\\ne'} ${pc}\\%$`, { kicker: 'Gratis sobre el total', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(3), y: G.tY }, text: 'Arrastra el descuento', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = P[RK.pick(x, 30, G.W - 30, P.length)]; if (v !== G.s.p || !G.touched[G.cur]) { G.s.p = v; G.touch(); } };
  return Object.assign(game, { need });
})();
