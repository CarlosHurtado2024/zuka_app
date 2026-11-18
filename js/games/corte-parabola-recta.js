// La recta que corta la parábola (Álgebra, alg-102; spec 2026-11-18-algebra-revision): en un sistema no lineal los cortes
// son los x donde las dos expresiones de y coinciden: al igualarlas queda una cuadrática. La pendiente de la recta está
// fija; se arrastra su altura n hasta que pase por el corte marcado. Entonces aparece el otro corte y la cuadrática
// factorizada.
// params = { rounds: [{ a, m, x0 }] }   (parábola y = a·x², recta y = m·x + n)   state = { rounds: [{ n }] }   (entero de −8 a 12)
GAMES['corte-parabola-recta'] = (() => {
  const V = { x0: -5, x1: 5, y0: -8, y1: 14 };
  const need = r => r.a * r.x0 ** 2 - r.m * r.x0;
  const ok = (s, r) => s.n === need(r);
  const other = r => r.m / r.a - r.x0;
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ n: need(r) === 0 ? 2 : 0 }),
    ok,
    solution: r => `n = ${need(r)}: corta en x = ${r.x0} y x = ${RK.num(other(r))}`,
    prompt: r => `Sube o baja $y = ${r.m === 0 ? '' : `${r.m === 1 ? '' : r.m === -1 ? '-' : r.m}x + `}n$ hasta que corte a $y = ${r.a === 1 ? '' : r.a}x^2$ en $x = ${r.x0}$`,
    foot: () => 'Arrastra la recta arriba o abajo',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.56 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, M = G.M = RK.plane(p, C, G.b, V, { step: 1 });
      RK.curve(p, G.b, M, V, x => r.a * x * x, C.sky, 2.6);
      RK.curve(p, G.b, M, V, x => r.m * x + n, ok({ n }, r) ? C.ok : C.coral, 2.6);
      p.noFill(); p.stroke(C.brand); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.line(M.X(r.x0), G.b.y, M.X(r.x0), G.b.y + G.b.h); p.drawingContext.setLineDash([]);
      // Cortes reales: raíces de a·x² − m·x − n = 0.
      const D = r.m * r.m + 4 * r.a * n;
      if (D >= 0) [(r.m + Math.sqrt(D)) / (2 * r.a), (r.m - Math.sqrt(D)) / (2 * r.a)].forEach(x => { if (x >= V.x0 && x <= V.x1) drawDot(p, C, M.X(x), M.Y(r.a * x * x), 11, ok({ n }, r) ? C.ok : C.ink); });
      RK.knob(p, C, M.X(V.x1 - 0.6), M.Y(r.m * (V.x1 - 0.6) + n), C.coral);
      const q = `${r.a === 1 ? '' : r.a}x^2${r.m === 0 ? '' : ` ${r.m < 0 ? '+' : '-'} ${Math.abs(r.m) === 1 ? '' : Math.abs(r.m)}x`}${n === 0 ? '' : ` ${n > 0 ? '-' : '+'} ${Math.abs(n)}`} = 0`;
      RK.strip(p, C, G.fb, ok({ n }, r) ? `$${q}:\\ x = ${r.x0},\\ x = ${RK.num(other(r))}$` : `$${q}$`, { kicker: 'Igualar las dos y y pasar todo a un lado', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (!hitBox(G.b, x, y)) return false; G.grab = true; G.y0 = y; G.n0 = G.s.n; return true; },
    drag(G, x, y) { if (!G.grab) return false; const d = G.M.iY(y) - G.M.iY(G.y0), n = Math.max(-8, Math.min(12, Math.round(G.n0 + d))); if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(3), y: G.M.Y(G.s.n + 3 * G.r.m) }, to: { x: G.M.X(3), y: G.M.Y(G.s.n + 3 * G.r.m + 3) }, text: 'Arrastra la recta', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  return Object.assign(game, { need });
})();
