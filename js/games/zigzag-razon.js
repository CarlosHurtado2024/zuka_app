// Razón negativa o menor que 1 (Álgebra, alg-14c; spec 2026-11-18-algebra-revision): en una geométrica cada término es el
// anterior por r; si r es negativa los términos alternan de signo (zigzag) y si |r| < 1 se achican. Se ven los términos
// pedidos; se arrastra r y la cadena de puntos cambia en vivo hasta coincidir.
// params = { rounds: [{ a, r }] }   state = { rounds: [{ ri }] }   (r de la lista R)
GAMES['zigzag-razon'] = (() => {
  const R = [-3, -2, -1, -0.5, 0.5, 1, 2, 3], RT = ['-3', '-2', '-1', '-\\tfrac12', '\\tfrac12', '1', '2', '3'];
  const ok = (s, r) => R[s.ri] === r.r;
  const answer = r => ({ ri: R.indexOf(r.r) });
  const terms = (a, q) => Array.from({ length: 5 }, (_, k) => a * q ** k);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ ri: r.r === 1 ? 6 : 5 }),
    ok,
    solution: r => `r = ${r.r}`,
    prompt: r => `Los términos son ${terms(r.a, r.r).slice(0, 3).join(', ')}, … ¿Cuál es la razón?`,
    foot: () => 'Arrastra la razón: cada punto es el anterior por r',
    layout(G) { G.b = { x: 16, y: 98, w: G.W - 32, h: G.H * 0.5 }; G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, T = terms(r.a, r.r), Y = Math.max(...T.map(Math.abs)) * 1.2, V = { x0: 0, x1: 6, y0: -Y, y1: Y }, M = RK.plane(p, C, G.b, V, { step: Y > 30 ? 20 : Y > 10 ? 5 : 1 });
      T.forEach((v, k) => { p.noFill(); p.stroke(C.coral); p.strokeWeight(2); p.circle(M.X(k + 1), M.Y(v), 16); });
      const mine = terms(r.a, R[s.ri]);
      p.stroke(C.sky); p.strokeWeight(1.4); for (let k = 1; k < 5; k++) if (Math.abs(mine[k]) <= Y && Math.abs(mine[k - 1]) <= Y) p.line(M.X(k), M.Y(mine[k - 1]), M.X(k + 1), M.Y(mine[k]));
      mine.forEach((v, k) => { if (Math.abs(v) <= Y) drawDot(p, C, M.X(k + 1), M.Y(v), 9, ok(s, r) ? C.ok : C.sky); });
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, R.length, s.ri, i => `$${RT[i]}$`);
      RK.strip(p, C, G.fb, `$r = ${RT[s.ri]}:\\ ${mine.slice(0, 4).map(v => +v.toFixed(3)).join(',\\ ')}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.ri), y: G.tY }, to: { x: G.X([7, 4, 6].find(i => R[i] !== G.r.r && i !== G.s.ri)), y: G.tY }, text: 'Arrastra la razón', ty: G.tY - 28 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const i = RK.pick(x, 30, G.W - 30, R.length); if (i !== G.s.ri || !G.touched[G.cur]) { G.s.ri = i; G.touch(); } };
  return Object.assign(game, { answer });
})();
