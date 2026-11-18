// El factor que falta (Álgebra, alg-92; spec 2026-11-18-algebra-revision): por el teorema del factor, x − c es factor de P
// si y solo si P(c) = 0. P tiene un coeficiente desconocido k; se arrastra k y se ve P(c), que es el residuo. Hay que
// dejar el residuo en cero, y la gráfica pasa entonces por (c, 0).
// params = { rounds: [{ P: [coef. con null en el lugar de k], c }] }   state = { rounds: [{ k }] }   (de −12 a 12)
GAMES['factor-k'] = (() => {
  const fill = (r, k) => r.P.map(v => (v == null ? k : v));
  const val = (P, x) => P.reduce((a, q) => a * x + q, 0);
  const need = r => { for (let k = -12; k <= 12; k++) if (val(fill(r, k), r.c) === 0) return k; return null; };
  const ok = (s, r) => val(fill(r, s.k), r.c) === 0;
  const tex = r => { const n = r.P.length - 1; return r.P.map((v, i) => { const e = n - i, x = e === 0 ? '' : e === 1 ? 'x' : `x^${e}`; const co = v == null ? 'k' : v; if (co === 0) return ''; return `${i && (co === 'k' || co > 0) ? '+' : ''}${co === 1 && x ? '' : co === -1 && x ? '-' : co}${x}`; }).join(''); };
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ k: 0 }),
    ok,
    solution: r => `k = ${need(r)}`,
    prompt: r => `¿Qué k hace que $x ${r.c < 0 ? '+' : '-'} ${Math.abs(r.c)}$ sea factor de $${tex(r)}$?`,
    foot: () => 'Arrastra k: el residuo es P(c)',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.44 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? need(r) : G.s.k, P = fill(r, k), V = { x0: -5, x1: 5, y0: -20, y1: 20 }, M = RK.plane(p, C, G.b, V, { step: 5 });
      RK.curve(p, G.b, M, V, x => val(P, x), C.sky, 2.4);
      const y = val(P, r.c); drawDot(p, C, M.X(r.c), M.Y(Math.max(-20, Math.min(20, y))), 12, y === 0 ? C.ok : C.coral);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, 25, k + 12, i => (i % 4 === 0 ? String(i - 12) : null));
      RK.strip(p, C, G.fb, `$P(${r.c}) = ${y}$`, { kicker: `k = ${k}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.k + 12), y: G.tY }, to: { x: G.X(G.s.k + 16), y: G.tY }, text: 'Arrastra k', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 24, G.W - 24, 25) - 12; if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { need });
})();
