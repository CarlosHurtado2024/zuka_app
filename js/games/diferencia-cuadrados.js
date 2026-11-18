// La esquina que se mueve (Álgebra, alg-3; spec 2026-11-18-algebra-revision): (a + b)(a − b) = a² − b². Un cuadrado de
// lado a al que se le quita una esquina b × b; la tira que sobra se pasa abajo y queda un rectángulo (a + b) por (a − b).
// Se arrastran a y b hasta que el rectángulo sea el producto pedido: así 32 · 28 = 30² − 2².
// params = { rounds: [{ p, q }] }   (p > q, p + q par)   state = { rounds: [{ a, b }] }   (a de 10 a 60, b de 1 a 9)
GAMES['diferencia-cuadrados'] = (() => {
  const need = r => ({ a: (r.p + r.q) / 2, b: (r.p - r.q) / 2 });
  const ok = (s, r) => s.a + s.b === r.p && s.a - s.b === r.q;
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ a: 20, b: 1 }),
    ok,
    solution: r => { const { a, b } = need(r); return `${r.p} · ${r.q} = ${a}² − ${b}² = ${a * a - b * b}`; },
    prompt: r => `Calcula $${r.p}\\cdot${r.q}$ como diferencia de cuadrados`,
    foot: () => 'Arrastra a (arriba) y b (abajo): el rectángulo mide (a + b) por (a − b)',
    layout(G) { G.t1 = G.H - 150; G.t2 = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? need(r) : G.s, k = Math.min(3.2, (G.W - 60) / (s.a + s.b) / 1, 150 / s.a), ox = 30, oy = 104;
      p.stroke(C.bg); p.strokeWeight(1.5); p.fill(C.mint); p.rect(ox, oy, (s.a - s.b) * k, s.a * k); p.fill(C.sky); p.rect(ox + (s.a - s.b) * k, oy, s.b * k, (s.a - s.b) * k);
      p.noFill(); p.stroke(C.coral); p.strokeWeight(1.5); p.drawingContext.setLineDash([3, 3]); p.rect(ox + (s.a - s.b) * k, oy + (s.a - s.b) * k, s.b * k, s.b * k); p.drawingContext.setLineDash([]);
      TK.label(p, C, `a = ${s.a}`, ox + s.a * k / 2, oy - 10, C.mute, 11, 60);
      // El rectángulo armado, a la derecha si cabe.
      const rx = ox + s.a * k + 16, rw = Math.min(G.W - rx - 12, (s.a + s.b) * k * 0.6), rh = (s.a - s.b) * k * 0.6;
      if (rw > 30) { p.stroke(C.ink); p.strokeWeight(1.5); p.fill(RK.al(p, C.brand, 60)); p.rect(rx, oy, rw, rh); TK.label(p, C, `${s.a + s.b} × ${s.a - s.b}`, rx + rw / 2, oy + rh / 2, C.ink, 11, rw); }
      G.X1 = RK.track(p, C, 70, G.W - 24, G.t1, 51, s.a - 10, i => ((i + 10) % 10 === 0 ? String(i + 10) : null)); TK.label(p, C, 'a', 40, G.t1, C.mute, 12, 20);
      G.X2 = RK.track(p, C, 70, G.W - 24, G.t2, 9, s.b - 1, i => String(i + 1)); TK.label(p, C, 'b', 40, G.t2, C.mute, 12, 20);
      RK.strip(p, C, G.fb, `$(${s.a} + ${s.b})(${s.a} - ${s.b}) = ${s.a}^2 - ${s.b}^2 = ${s.a * s.a - s.b * s.b}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const k = Math.abs(y - G.t1) < 20 ? 'a' : Math.abs(y - G.t2) < 20 ? 'b' : null; if (!k) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X1(G.s.a - 10), y: G.t1 }, to: { x: G.X1(G.s.a), y: G.t1 }, text: 'Arrastra a y b', ty: G.t1 - 26 }),
    peek: G => ({ t1: G.t1, t2: G.t2 }),
  });
  game.move = (G, x) => { const s = G.s; if (G.grab === 'a') s.a = RK.pick(x, 70, G.W - 24, 51) + 10; else s.b = RK.pick(x, 70, G.W - 24, 9) + 1; G.touch(); };
  return Object.assign(game, { need });
})();
