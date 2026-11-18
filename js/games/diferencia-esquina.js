// La esquina que falta (Álgebra, alg-24b; spec 2026-11-18-algebra-revision): factorizar x² − c cuando c es un cuadrado.
// Al cuadrado de lado x se le quita una esquina de b por b; se arrastra b hasta que la esquina valga c. Entonces la tira
// se pasa abajo y queda el rectángulo (x + b)(x − b).
// params = { rounds: [{ c }] }   state = { rounds: [{ b }] }   (de 1 a 7)
GAMES['diferencia-esquina'] = (() => {
  const ok = (s, r) => s.b * s.b === r.c;
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ b: 1 }),
    ok,
    solution: r => `x² − ${r.c} = (x + ${Math.sqrt(r.c)})(x − ${Math.sqrt(r.c)})`,
    prompt: r => `Factoriza $x^2 - ${r.c}$ quitando una esquina`,
    foot: () => 'Arrastra el lado de la esquina',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, b = G.locked && !ok(G.s, r) ? Math.sqrt(r.c) : G.s.b, X = 150, k = X / 10, ox = 24, oy = 108, good = b * b === r.c;
      p.stroke(C.bg); p.strokeWeight(1.5); p.fill(C.mint); p.rect(ox, oy, X - b * k, X); p.fill(C.sky); p.rect(ox + X - b * k, oy, b * k, X - b * k);
      p.noFill(); p.stroke(C.coral); p.drawingContext.setLineDash([3, 3]); p.rect(ox + X - b * k, oy + X - b * k, b * k, b * k); p.drawingContext.setLineDash([]);
      TK.label(p, C, `${b}²`, ox + X - b * k / 2, oy + X - b * k / 2, C.coral, 11, 30); TK.label(p, C, 'x', ox + X / 2, oy - 10, C.mute, 11, 20);
      if (good) { const rx = ox + X + 18, rw = Math.min(G.W - rx - 10, (X + b * k) * 0.55), rh = (X - b * k) * 0.55; p.stroke(C.ink); p.fill(RK.al(p, C.ok, 60)); p.rect(rx, oy, rw, rh); TK.label(p, C, `(x + ${b})(x − ${b})`, rx + rw / 2, oy + rh / 2, C.ink, 11, rw); }
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 7, b - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, good ? `$x^2 - ${r.c} = (x + ${b})(x - ${b})$` : `$\\text{esquina } ${b}^2 = ${b * b}$`, { kicker: `Meta: esquina de ${r.c}`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.b - 1), y: G.tY }, to: { x: G.X(G.s.b + 2), y: G.tY }, text: 'Arrastra la esquina', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const b = RK.pick(x, 30, G.W - 30, 7) + 1; if (b !== G.s.b || !G.touched[G.cur]) { G.s.b = b; G.touch(); } };
  return game;
})();
