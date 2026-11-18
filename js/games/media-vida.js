// La vida media (Álgebra, alg-73; spec 2026-11-18-algebra-revision): una sustancia que se reduce a la mitad cada T horas
// queda en A₀·(½)^(t/T). Se arrastra el tiempo (de media vida en media vida) por la curva de decaimiento; hay que llegar al
// momento en que queda la cantidad pedida. Al final el juego muestra la ecuación y su solución con logaritmos.
// params = { rounds: [{ A0, T, target, thing, unit }] }   state = { rounds: [{ i }] }   (t = i·T, i de 0 a 6)
GAMES['media-vida'] = (() => {
  const amt = (r, i) => r.A0 * 0.5 ** i;
  const need = r => Math.round(Math.log2(r.A0 / r.target));
  const ok = (s, r) => s.i === need(r);
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ i: 0 }),
    ok,
    solution: r => `t = ${need(r) * r.T} h (${need(r)} medias vidas)`,
    prompt: r => `${r.A0} ${r.unit} de ${r.thing}, mitad cada ${r.T} h: ¿cuándo quedan ${r.target}?`,
    foot: () => 'Arrastra el tiempo por la curva',
    layout(G) { G.b = { x: 16, y: 100, w: G.W - 32, h: G.H * 0.5 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, i = G.locked && !ok(G.s, r) ? need(r) : G.s.i, V = { x0: 0, x1: 6 * r.T, y0: 0, y1: r.A0 * 1.1 }, M = G.M = RK.plane(p, C, G.b, V, { step: r.T });
      RK.curve(p, G.b, M, V, t => r.A0 * 0.5 ** (t / r.T), C.sky, 2.6);
      p.stroke(C.coral); p.strokeWeight(1.4); p.drawingContext.setLineDash([5, 4]); p.line(G.b.x, M.Y(r.target), G.b.x + G.b.w, M.Y(r.target)); p.drawingContext.setLineDash([]);
      for (let k = 0; k <= 6; k++) TK.label(p, C, `${k * r.T}`, M.X(k * r.T), G.b.y + G.b.h + 10, C.mute, 9, 30);
      const a = amt(r, i); drawDot(p, C, M.X(i * r.T), M.Y(a), 14, ok({ i }, r) ? C.ok : C.brand);
      TK.label(p, C, `$${+a.toFixed(3)}\\ \\text{${r.unit}}$`, Math.min(G.W - 50, M.X(i * r.T) + 40), M.Y(a) - 14, C.ink, 12, 80);
      RK.strip(p, C, G.fb, ok({ i }, r) ? `$${r.A0}\\left(\\tfrac12\\right)^{t/${r.T}} = ${r.target} \\Rightarrow t = ${r.T}\\log_2 \\tfrac{${r.A0}}{${r.target}} = ${i * r.T}$` : `$t = ${i * r.T}\\ \\text{h}:\\ ${+a.toFixed(3)}\\ \\text{${r.unit}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { if (!hitBox({ x: G.b.x, y: G.b.y, w: G.b.w, h: G.b.h + 24 }, x, y)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.M.X(0), y: G.M.Y(G.r.A0) }, to: { x: G.M.X(G.r.T), y: G.M.Y(G.r.A0 / 2) }, text: 'Arrastra el tiempo', ty: G.b.y + G.b.h + 30 }),
    peek: G => ({ b: G.b, M: G.M }),
  });
  game.move = (G, x) => { const i = Math.max(0, Math.min(6, Math.round(G.M.iX(x) / G.r.T))); if (i !== G.s.i || !G.touched[G.cur]) { G.s.i = i; G.touch(); } };
  return Object.assign(game, { need });
})();
