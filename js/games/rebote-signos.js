// Saltos con signo (Álgebra, alg-12c; juego en movimiento; spec 2026-11-18-algebra-revision): la ley de los signos
// repetida. Una ficha parte de un número s; cada salto la lleva a su posición por f (un número negativo), así que cambia
// de lado del 0 en cada salto. Se arrastra la ficha al punto de partida y al soltar salta n veces: debe caer en la bandera.
// Con un número par de saltos el signo vuelve a ser el de la salida.
// params = { rounds: [{ title, items: [{ f, n, target }] }] }   s = { v, shot }   (llegada = v · fⁿ)
GAMES['rebote-signos'] = (() => {
  const start = it => it.target / it.f ** it.n;
  const game = questGame({
    aspect: 1.05,
    idle: 'Pon la ficha y suelta: salta sola, sin prisa',
    init: () => ({ v: 1, shot: null }),
    ok: (s, it) => s.v * it.f ** it.n === it.target,
    answer: it => ({ v: start(it), shot: null }),
    solution: it => `salir de ${start(it)}: ${start(it)} · (${it.f})^${it.n} = ${it.target}`,
    prompt: it => `${it.n} salto${it.n === 1 ? '' : 's'} de ×(${it.f}): cae en la bandera`,
    foot: (it, s) => (s.missed ? 'Cuenta los saltos: cada uno cambia el signo' : 'Arrastra la ficha a la salida y suelta'),
    layout(G) { G.L = { x0: 20, x1: G.W - 20, y: G.top + 150, min: -24, max: 24 }; },
    draw(G) {
      const { p, C, s, item: it } = G, X = drawNumLine(p, C, G.L, { step: 6, every: 1 });
      G.X = X;
      p.stroke(C.ok); p.strokeWeight(2); p.line(X(it.target), G.L.y - 6, X(it.target), G.L.y - 44); p.noStroke(); p.fill(C.ok); p.triangle(X(it.target), G.L.y - 44, X(it.target) + 14, G.L.y - 38, X(it.target), G.L.y - 32);
      // Los saltos, uno por uno.
      const pts = [s.v]; for (let k = 0; k < it.n; k++) pts.push(pts.at(-1) * it.f);
      let x = X(s.v), y = G.L.y - 10;
      if (s.shot != null) {
        const tt = (G.t - s.shot) / 0.6, k = Math.min(it.n, Math.floor(tt)), f = Math.min(1, tt - k);
        for (let j = 0; j < k; j++) { p.noFill(); p.stroke(RK.al(p, C.brand, 120)); p.strokeWeight(1.5); const a = X(pts[j]), b = X(pts[j + 1]); p.arc((a + b) / 2, G.L.y - 10, Math.abs(b - a), Math.abs(b - a) * 0.7, Math.PI, 2 * Math.PI); TK.label(p, C, String(pts[j + 1]), b, G.L.y + 40, C.brand, 11, 30); }
        if (k < it.n) { const a = X(pts[k]), b = X(pts[k + 1]); x = a + (b - a) * f; y = G.L.y - 10 - Math.sin(f * Math.PI) * Math.abs(b - a) * 0.35; }
        else { x = X(pts[it.n]); if (!G.solved) { if (pts[it.n] === it.target) G.good('¡A la bandera!'); else { s.shot = null; s.missed = true; G.bad(`Cayó en ${pts[it.n]}`); } } }
      }
      drawDot(p, C, x, y, 20, C.mint);
      G.frog = { x: X(s.v), y: G.L.y - 10 };
      TK.label(p, C, `$\\text{salida: } ${s.v} \\qquad \\times\\,(${it.f}) \\text{ en cada salto}$`, G.W / 2, G.L.y + 80, C.ink, 15, G.W - 30);
    },
    press(G, x, y) { if (G.s.shot != null || Math.abs(y - G.frog.y) > 40) return false; G.grab = true; game.place(G, x); return true; },
    drag(G, x) { if (!G.grab || G.s.shot != null) return false; game.place(G, x); return true; },
    release(G) { if (G.grab && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } G.grab = false; },
    demo: G => (G.frog ? { from: G.frog, to: { x: G.frog.x + 40, y: G.frog.y }, text: 'Arrastra la ficha y suelta', ty: G.frog.y - 60 } : null),
    peek: G => ({ L: G.L, start: start(G.item), flying: G.s.shot != null }),
  });
  game.place = (G, x) => { const L = G.L; G.s.v = Math.max(-8, Math.min(8, Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)))); };
  return Object.assign(game, { start });
})();
