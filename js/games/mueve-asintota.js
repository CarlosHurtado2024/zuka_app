// Mover la exponencial (Álgebra, alg-71; spec 2026-11-18-algebra-revision): y = b^(x − h) + k es la curva bˣ corrida h a
// la derecha y k hacia arriba; su asíntota horizontal sube con ella hasta y = k. Se arrastra el punto ancla (h, k + 1),
// que en bˣ es (0, 1), y la curva y su asíntota lo siguen. Hay que hacerla pasar por los dos puntos marcados.
// params = { rounds: [{ b, h, k }] }   (puntos en x = h y x = h + 2)   state = { rounds: [{ h, k }] }   (enteros de −4 a 4)
GAMES['mueve-asintota'] = (() => {
  const V = { x0: -6, x1: 6, y0: -6, y1: 8 };
  const f = (b, h, k) => x => b ** (x - h) + k;
  const ok = (s, r) => s.h === r.h && s.k === r.k;
  const bt = b => (b < 1 ? `\\left(\\tfrac{1}{${Math.round(1 / b)}}\\right)` : String(b));
  const game = roundsGame({
    aspect: 1.15,
    init: r => (r.h === 0 && r.k === 0 ? { h: 1, k: 1 } : { h: 0, k: 0 }),
    ok,
    solution: r => `y = ${r.b}^(x ${r.h < 0 ? '+' : '−'} ${Math.abs(r.h)}) ${r.k < 0 ? '−' : '+'} ${Math.abs(r.k)}`,
    prompt: r => `Corre $y = ${bt(r.b)}^x$ para que pase por los dos puntos`,
    foot: () => 'Arrastra el punto ancla: la curva y su asíntota lo siguen',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.6 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { h: r.h, k: r.k } : G.s, M = G.M = RK.plane(p, C, G.b, V, { step: 1 });
      p.stroke(C.coral); p.strokeWeight(1.6); p.drawingContext.setLineDash([6, 4]); p.line(G.b.x, M.Y(s.k), G.b.x + G.b.w, M.Y(s.k)); p.drawingContext.setLineDash([]);
      TK.label(p, C, `y = ${s.k}`, G.b.x + 34, M.Y(s.k) - 9, C.coral, 10, 60);
      RK.curve(p, G.b, M, V, f(r.b, s.h, s.k), ok(s, r) ? C.ok : C.sky, 2.6);
      [r.h, r.h + (r.b < 1 ? -2 : 2)].forEach(x => { const y = f(r.b, r.h, r.k)(x), hit = Math.abs(f(r.b, s.h, s.k)(x) - y) < 1e-9; drawDot(p, C, M.X(x), M.Y(y), 13, hit ? C.ok : C.coral); });
      RK.knob(p, C, M.X(s.h), M.Y(s.k + 1), C.brand);
      const ex = s.h === 0 ? 'x' : `x ${s.h < 0 ? '+' : '-'} ${Math.abs(s.h)}`;
      RK.strip(p, C, G.fb, `$y = ${bt(r.b)}^{${ex}}${s.k === 0 ? '' : ` ${s.k < 0 ? '-' : '+'} ${Math.abs(s.k)}`}$`, { kicker: `Asíntota y = ${s.k}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.hypot(x - G.M.X(G.s.h), y - G.M.Y(G.s.k + 1)) > 40) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const c = v => Math.max(-4, Math.min(4, Math.round(v))), h = c(G.M.iX(x)), k = c(G.M.iY(y) - 1); if (h !== G.s.h || k !== G.s.k || !G.touched[G.cur]) { G.s.h = h; G.s.k = k; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(G.s.h), y: G.M.Y(G.s.k + 1) }, to: { x: G.M.X(G.s.h + 2), y: G.M.Y(G.s.k - 1) }, text: 'Arrastra el ancla', ty: G.b.y + 16 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  return game;
})();
