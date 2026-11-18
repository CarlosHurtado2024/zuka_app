// El precio del máximo ingreso (Álgebra, alg-4a; spec 2026-11-18-algebra-revision): si al subir el precio se venden menos
// unidades, el ingreso precio × ventas es una parábola que abre hacia abajo. Se arrastra el precio; a la izquierda se ven
// las ventas y a la derecha el punto del ingreso en su gráfica. El mejor precio está en el vértice.
// params = { rounds: [{ base, drop }] }   (ventas = base − drop·p)   state = { rounds: [{ p }] }   (de 1 a base/drop − 1)
GAMES['ingreso-maximo'] = (() => {
  const sales = (r, p) => r.base - r.drop * p;
  const inc = (r, p) => p * sales(r, p);
  const best = r => r.base / (2 * r.drop);
  const maxP = r => r.base / r.drop;
  const ok = (s, r) => s.p === best(r);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ p: 1 }),
    ok,
    solution: r => `precio ${best(r)}: ingreso ${inc(r, best(r))}`,
    prompt: r => `A precio p se venden ${r.base} − ${r.drop}p. ¿Qué precio da el mayor ingreso?`,
    foot: () => 'Arrastra el precio y mira el punto en la gráfica del ingreso',
    layout(G) { G.top = 104; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, pr = G.locked && !ok(G.s, r) ? best(r) : G.s.p, m = maxP(r), Imax = inc(r, best(r)), v = sales(r, pr);
      const bh = G.tY - G.top - 70;
      p.noStroke(); p.fill(C.sky); p.rect(30, G.top + bh * (1 - v / r.base), 40, bh * v / r.base, 4);
      TK.label(p, C, `ventas ${v}`, 50, G.top + bh + 14, C.mute, 10, 80);
      p.fill(C.sun); p.rect(90, G.top + bh * (1 - inc(r, pr) / (Imax * 1.1)), 40, bh * inc(r, pr) / (Imax * 1.1), 4);
      TK.label(p, C, `ingreso ${inc(r, pr)}`, 110, G.top + bh + 14, C.mute, 10, 80);
      const b = { x: G.W / 2 + 10, y: G.top, w: G.W / 2 - 26, h: bh }, V = { x0: 0, x1: m, y0: 0, y1: Imax * 1.15 }, M = RK.plane(p, C, b, V, { step: Math.max(1, Math.round(m / 6)) });
      RK.curve(p, b, M, V, t => inc(r, t), C.sky, 2);
      drawDot(p, C, M.X(pr), M.Y(inc(r, pr)), 11, C.coral);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, m - 1, pr - 1, i => ((i + 1) % 5 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$I = ${pr}\\,(${r.base} - ${r.drop}\\cdot${pr}) = ${inc(r, pr)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.p - 1), y: G.tY }, to: { x: G.X(G.s.p + 4), y: G.tY }, text: 'Arrastra el precio', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, maxP(G.r) - 1) + 1; if (v !== G.s.p || !G.touched[G.cur]) { G.s.p = v; G.touch(); } };
  return Object.assign(game, { best });
})();
