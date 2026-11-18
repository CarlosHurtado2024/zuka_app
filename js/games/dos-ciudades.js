// ¿Cuándo alcanza una ciudad a la otra? (Álgebra, alg-73; spec 2026-11-18-algebra-revision): dos cantidades que crecen
// en porcentajes distintos: A·(1 + a)ᵗ y B·(1 + b)ᵗ. La que empieza abajo pero crece más rápido termina pasando; el año se
// despeja con logaritmos: t = log(A/B) ÷ log((1 + b)/(1 + a)). Se arrastran los años; dos barras por año muestran las dos
// cantidades. Hay que hallar el primer año en que la de abajo ya pasó (en habitantes).
// params = { rounds: [{ names: [a, b], A, a, B, b }] }   (a y b en %)   state = { rounds: [{ t }] }   (t de 0 a 30)
GAMES['dos-ciudades'] = (() => {
  const val = (r, t) => [r.A * (1 + r.a / 100) ** t, r.B * (1 + r.b / 100) ** t];
  const exact = r => Math.log(r.A / r.B) / Math.log((1 + r.b / 100) / (1 + r.a / 100));
  const need = r => Math.ceil(exact(r) - 1e-9);
  const ok = (s, r) => s.t === need(r);
  const fmt = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ t: 0 }),
    ok,
    solution: r => `año ${need(r)} (t ≈ ${exact(r).toFixed(2)})`,
    prompt: r => `${r.names[0]}: ${fmt(r.A)}, crece ${r.a} %/año. ${r.names[1]}: ${fmt(r.B)}, crece ${r.b} %/año. ¿Cuándo la pasa?`,
    foot: () => 'Arrastra los años',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: need(r) } : G.s, [a, b] = val(r, s.t), top = Math.max(...val(r, 30)), u = (G.W - 130) / top;
      [[r.names[0], a, C.sky], [r.names[1], b, C.coral]].forEach(([n, v, col], i) => { const y = 120 + i * 40; TK.label(p, C, n, 52, y + 11, C.mute, 10, 90); p.noStroke(); p.fill(col); p.rect(104, y, v * u, 22, 4); TK.label(p, C, fmt(v), Math.min(G.W - 34, 104 + v * u + 34), y + 11, C.ink, 9, 66); });
      const passed = b > a;
      TK.label(p, C, `año ${s.t}: ${passed ? `${r.names[1]} ya pasó` : `${r.names[1]} todavía no pasa`}`, G.W / 2, 220, ok(s, r) ? C.ok : C.mute, 12, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 31, s.t, i => (i % 5 === 0 ? String(i) : null));
      RK.strip(p, C, G.fb, ok(s, r) ? `$t = \\dfrac{\\log(${r.A}/${r.B})}{\\log(${(1 + r.b / 100).toFixed(2)}/${(1 + r.a / 100).toFixed(2)})} \\approx ${exact(r).toFixed(2)}$` : `$t = ${s.t}$`, { kicker: ok(s, r) ? 'Con logaritmos' : 'Busca el primer año', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 14 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(0), y: G.tY }, to: { x: G.X(3), y: G.tY }, text: 'Arrastra los años', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 31); if (v !== G.s.t || !G.touched[G.cur]) { G.s.t = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ t: need(r) }), need });
})();
