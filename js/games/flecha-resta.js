// La flecha del cambio (Álgebra, alg-11; spec 2026-11-18-algebra-revision): restar mide un cambio. Se arrastran la cola
// de una flecha al valor de antes y la punta al valor de después; la flecha dice cuánto cambió, con su signo:
// después − antes. Si va a la izquierda el cambio es negativo, aunque los dos números sean positivos.
// params = { min, max, rounds: [{ text, from, to }] }   state = { rounds: [{ t, h }] }   (cola y punta, enteros)
GAMES['flecha-resta'] = (() => {
  const ok = (s, r) => s.t === r.from && s.h === r.to;
  const game = roundsGame({
    aspect: 0.95,
    init: () => ({ t: 0, h: 1 }),
    ok,
    solution: r => `${r.to} − (${r.from}) = ${r.to - r.from}`,
    prompt: r => r.text,
    foot: () => 'La cola va en el valor de antes y la punta en el de después',
    layout(G) { G.L = { x0: 22, x1: G.W - 22, y: G.H * 0.5, min: G.params.min ?? -9, max: G.params.max ?? 9 }; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r, L } = G, good = ok(G.s, r), s = G.locked && !good ? { t: r.from, h: r.to } : G.s;
      const X = drawNumLine(p, C, L, { step: 1, every: 3 }), d = s.h - s.t, col = d > 0 ? C.mint : d < 0 ? C.coral : C.mute;
      G.X = X;
      if (d) RK.arrow(p, X(s.t), X(s.h), L.y - 34, col, 5);
      TK.label(p, C, `${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)}`, (X(s.t) + X(s.h)) / 2, L.y - 54, col, 15, 60);
      p.stroke(col); p.strokeWeight(1.4); p.drawingContext.setLineDash([3, 4]); p.line(X(s.t), L.y - 34, X(s.t), L.y); p.line(X(s.h), L.y - 34, X(s.h), L.y); p.drawingContext.setLineDash([]);
      p.noFill(); p.stroke(C.ink); p.strokeWeight(3); p.circle(X(s.t), L.y + 40, 20);
      RK.knob(p, C, X(s.h), L.y + 40, col);
      TK.label(p, C, 'antes', X(s.t), L.y + 62, C.mute, 10, 60); TK.label(p, C, 'después', X(s.h), L.y + 62, C.mute, 10, 60);
      RK.strip(p, C, G.fb, `$${RK.num(s.h)} - ${RK.par(s.t)} = ${RK.num(d)}$`, { kicker: 'Cambio = después − antes', col: G.locked ? C.ok : col, size: 18 });
    },
    press(G, x, y) {
      if (Math.abs(y - (G.L.y + 40)) > 34) return false;
      G.grab = Math.abs(x - G.X(G.s.h)) <= Math.abs(x - G.X(G.s.t)) ? 'h' : 't'; game.move(G, x); return true;
    },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.X(G.s.h), y: G.L.y + 40 }, to: { x: G.X(G.s.h + 4), y: G.L.y + 40 }, text: 'Arrastra la cola y la punta', ty: G.L.y + 86 }),
    peek: G => ({ L: G.L }),
  });
  game.move = (G, x) => {
    const L = G.L, v = Math.max(L.min, Math.min(L.max, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min))));
    if (v !== G.s[G.grab] || !G.touched[G.cur]) { G.s[G.grab] = v; G.touch(); }
  };
  return game;
})();
