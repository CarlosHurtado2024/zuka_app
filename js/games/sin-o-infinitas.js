// Una, ninguna o infinitas (Álgebra, alg-1; spec 2026-11-18-algebra-revision): en ax + b = cx + d las dos partes son
// rectas. Se arrastra el número que falta y se ven las dos rectas: si se cortan hay una solución, si son paralelas no hay
// ninguna y si son la misma hay infinitas. Cada ronda pide uno de los tres casos.
// params = { rounds: [{ a, b, c, want: 'una' | 'ninguna' | 'infinitas', what: 'd' }] }   state = { rounds: [{ d }] }   (de −6 a 6)
GAMES['sin-o-infinitas'] = (() => {
  const kind = (r, d) => (r.a !== r.c ? 'una' : r.b === d ? 'infinitas' : 'ninguna');
  const ok = (s, r) => kind(r, s.d) === r.want;
  const answer = r => { for (let d = -6; d <= 6; d++) if (kind(r, d) === r.want) return { d }; return null; };
  const t = (a, b) => `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
  const V = { x0: -5, x1: 5, y0: -12, y1: 12 };
  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ d: r.want === 'infinitas' ? (r.b === 6 ? 5 : r.b + 1) : r.b }),
    ok,
    solution: r => `d = ${answer(r).d}`,
    prompt: r => `Elige d para que $${t(r.a, r.b)} = ${t(r.c, 0).replace('+ 0', '+ d')}$ tenga ${r.want === 'una' ? 'una solución' : r.want === 'ninguna' ? 'ninguna solución' : 'infinitas soluciones'}`,
    foot: () => 'Arrastra d y mira las dos rectas',
    layout(G) { G.b = { x: 16, y: 104, w: G.W - 32, h: G.H * 0.42 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, d = G.locked && !ok(G.s, r) ? answer(r).d : G.s.d, M = RK.plane(p, C, G.b, V, { step: 2 }), k = kind(r, d);
      RK.curve(p, G.b, M, V, x => r.a * x + r.b, C.sky, 3); RK.curve(p, G.b, M, V, x => r.c * x + d, C.coral, k === 'infinitas' ? 1.5 : 3);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 13, d + 6, i => (i % 2 === 0 ? String(i - 6) : null));
      RK.strip(p, C, G.fb, `$${t(r.a, r.b)} = ${t(r.c, d)}$`, { kicker: k === 'una' ? 'se cortan: una solución' : k === 'ninguna' ? 'paralelas: ninguna' : 'la misma recta: infinitas', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.d + 6), y: G.tY }, to: { x: G.X(G.s.d + 8), y: G.tY }, text: 'Arrastra d', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const d = RK.pick(x, 30, G.W - 30, 13) - 6; if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } };
  return Object.assign(game, { answer, kind });
})();
