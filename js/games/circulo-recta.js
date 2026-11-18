// La recta y el círculo (Álgebra, alg-102; spec 2026-11-18-algebra-revision): un sistema con un círculo y una recta puede
// tener dos, una o ninguna solución: al sustituir queda una cuadrática y su discriminante lo dice. Se arrastra la recta
// (pendiente fija) arriba o abajo hasta que tenga los cortes pedidos; el juego muestra el discriminante.
// params = { rounds: [{ R, m, want }] }   (x² + y² = R², y = m·x + n)   state = { rounds: [{ n }] }   (n de −8 a 8, de cuarto en cuarto)
GAMES['circulo-recta'] = (() => {
  const V = { x0: -8, x1: 8, y0: -8, y1: 8 };
  // (1 + m²)x² + 2mn·x + n² − R² = 0  →  D/4 = m²n² − (1 + m²)(n² − R²) = (1 + m²)R² − n²
  const disc = (r, n) => (1 + r.m * r.m) * r.R * r.R - n * n;
  const cuts = (r, n) => { const d = disc(r, n); return Math.abs(d) < 1e-9 ? 1 : d > 0 ? 2 : 0; };
  const ok = (s, r) => cuts(r, s.n) === r.want;
  const answer = r => ({ n: r.want === 1 ? r.R * Math.sqrt(1 + r.m * r.m) : r.want === 2 ? 0 : 8 });
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ n: r.want === 0 ? 0 : 7.5 }),
    ok,
    solution: r => (r.want === 1 ? `n = ±${RK.num(answer(r).n)}: la recta toca al círculo` : r.want === 2 ? 'la recta pasa por dentro del círculo' : 'la recta queda por fuera'),
    prompt: r => `Mueve $y = ${r.m === 0 ? '' : `${RK.num(r.m)}x + `}n$ para que corte a $x^2 + y^2 = ${r.R * r.R}$ en ${r.want === 1 ? 'un solo punto' : r.want === 2 ? 'dos puntos' : 'ningún punto'}`,
    foot: () => 'Arrastra la recta; un solo corte es tocar sin entrar',
    layout(G) { const s = Math.min(G.W - 32, G.H * 0.56); G.b = { x: (G.W - s) / 2, y: 100, w: s, h: s }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? answer(r).n : G.s.n, M = G.M = RK.plane(p, C, G.b, V, { step: 2 }), k = cuts(r, n);
      p.noFill(); p.stroke(C.sky); p.strokeWeight(2.6); p.circle(M.X(0), M.Y(0), (M.X(r.R) - M.X(0)) * 2);
      RK.curve(p, G.b, M, V, x => r.m * x + n, ok({ n }, r) ? C.ok : C.coral, 2.6);
      const a = 1 + r.m * r.m, d = disc(r, n);
      if (d >= -1e-9) [1, -1].forEach(sg => { const x = (-r.m * n + sg * Math.sqrt(Math.max(0, d))) / a; drawDot(p, C, M.X(x), M.Y(r.m * x + n), 11, C.ink); });
      RK.knob(p, C, M.X(6.5), M.Y(r.m * 6.5 + n), C.coral);
      RK.strip(p, C, G.fb, `$\\tfrac{\\Delta}{4} = ${RK.num(Math.round(d * 100) / 100)}\\ \\Rightarrow\\ ${k}\\ \\text{corte${k === 1 ? '' : 's'}}$`, { kicker: `Al sustituir y = ${r.m}x ${n < 0 ? '−' : '+'} ${Math.abs(n)}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; G.y0 = y; G.n0 = G.s.n; return true; },
    drag(G, x, y) { if (!G.grab) return false; const n = Math.max(-8, Math.min(8, Math.round((G.n0 + G.M.iY(y) - G.M.iY(G.y0)) * 4) / 4)); if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(3), y: G.M.Y(G.r.m * 3 + G.s.n) }, to: { x: G.M.X(3), y: G.M.Y(G.r.m * 3 + G.s.n - 3) }, text: 'Arrastra la recta', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  return Object.assign(game, { answer, cuts });
})();
