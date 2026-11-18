// El punto de las dos rectas (Álgebra, alg-101; spec 2026-11-18-algebra-revision): la solución de un sistema de dos
// ecuaciones lineales es el punto que cumple las dos a la vez, el cruce de sus rectas. Se arrastra un punto por el plano;
// cada ecuación se enciende cuando el punto la cumple. Hay que dejarlo donde se encienden las dos.
// params = { rounds: [{ e1: [a, b, c], e2: [a, b, c] }] }   (ax + by = c)   state = { rounds: [{ x, y }] }   (enteros de −6 a 6)
GAMES['dos-rectas'] = (() => {
  const V = { x0: -6, x1: 6, y0: -6, y1: 6 };
  const on = (e, x, y) => e[0] * x + e[1] * y === e[2];
  const ok = (s, r) => on(r.e1, s.x, s.y) && on(r.e2, s.x, s.y);
  const answer = r => { for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) if (ok({ x, y }, r)) return { x, y }; return null; };
  const eq = ([a, b, c]) => b === 0 ? `${a === 1 ? '' : a}x = ${c}` : `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${c}`;
  const game = roundsGame({
    aspect: 1.35,
    init: r => (ok({ x: 0, y: 0 }, r) ? { x: 1, y: -1 } : { x: 0, y: 0 }),
    ok,
    solution: r => { const a = answer(r); return `(${a.x}, ${a.y})`; },
    prompt: r => `Deja el punto donde se cumplen $${eq(r.e1)}$ y $${eq(r.e2)}$`,
    foot: () => 'Arrastra el punto; cada ecuación se enciende cuando el punto la cumple',
    layout(G) { const s = Math.min(G.W - 32, G.H * 0.5); G.b = { x: (G.W - s) / 2, y: 100, w: s, h: s }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, M = G.M = RK.plane(p, C, G.b, V, { step: 1, lx: 'x', ly: 'y' });
      [[r.e1, C.sky], [r.e2, C.coral]].forEach(([e, col]) => {
        if (e[1] === 0) { const x = e[2] / e[0]; p.stroke(col); p.strokeWeight(2.4); p.line(M.X(x), G.b.y, M.X(x), G.b.y + G.b.h); }
        else RK.curve(p, G.b, M, V, x => (e[2] - e[0] * x) / e[1], col, 2.4);
      });
      [[r.e1, C.sky], [r.e2, C.coral]].forEach(([e, col], i) => { const b = { x: 12 + i * (G.W - 24) / 2 + 3, y: G.b.y + G.b.h + 8, w: (G.W - 24) / 2 - 6, h: 30 }, yes = on(e, s.x, s.y); RK.chip(p, C, b, `$${eq(e)}$`, { on: yes, col: yes ? C.ok : col, size: 12 }); });
      drawDot(p, C, M.X(s.x), M.Y(s.y), 16, ok(s, r) ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$(x, y) = (${s.x}, ${s.y})$`, { kicker: ok(s, r) ? 'Cumple las dos: es la solución' : 'Busca el cruce', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.x), y: G.M.Y(G.s.y) }, to: { x: G.M.X(G.s.x + 2), y: G.M.Y(G.s.y + 1) }, text: 'Arrastra el punto', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x, y) => { const c = v => Math.max(-6, Math.min(6, Math.round(v))), nx = c(G.M.iX(x)), ny = c(G.M.iY(y)); if (nx !== G.s.x || ny !== G.s.y || !G.touched[G.cur]) { G.s.x = nx; G.s.y = ny; G.touch(); } };
  return Object.assign(game, { answer });
})();
