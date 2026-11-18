// Copias de una potencia (Álgebra, alg-21b; spec 2026-11-18-algebra-revision): potencia de una potencia. Una caja con la
// potencia de adentro (a factores) se copia arrastrando la manija: cada copia es una vez más el exponente de afuera. Los
// factores se cuentan solos: (xᵃ)ᵇ tiene a · b factores. Hay que llegar a la potencia pedida.
// params = { rounds: [{ a, total, v }] }   state = { rounds: [{ b }] }   (copias, de 1 a 6)
GAMES['copias-potencia'] = (() => {
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ b: 1 }),
    ok: (s, r) => s.b * r.a === r.total,
    solution: r => `(${r.v}^${r.a})^${r.total / r.a} = ${r.v}^${r.total}`,
    prompt: r => `Escribe $${r.v}^{${r.total}}$ como $(${r.v}^{${r.a}})^{?}$`,
    foot: () => 'Arrastra la manija para hacer copias de la caja',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, b = G.locked && G.s.b * r.a !== r.total ? r.total / r.a : G.s.b, cw = Math.min(22, (G.W - 60) / r.a - 2), h = 26;
      for (let j = 0; j < b; j++) {
        const y = 104 + j * (h + 8), x0 = G.W / 2 - (r.a * (cw + 2) + 8) / 2;
        p.stroke(C.brand); p.strokeWeight(1.5); p.noFill(); p.rect(x0 - 4, y - 3, r.a * (cw + 2) + 6, h + 6, 7);
        for (let i = 0; i < r.a; i++) RK.chip(p, C, { x: x0 + i * (cw + 2), y, w: cw, h }, r.v, { on: true, col: C.sky, size: 11, r: 5 });
      }
      G.X = RK.track(p, C, 40, G.W - 40, G.tY, 6, b - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$(${r.v}^{${r.a}})^{${b}} = ${r.v}^{${r.a} \\cdot ${b}} = ${r.v}^{${r.a * b}}$`, { col: G.locked || b * r.a === r.total ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.b - 1), y: G.tY }, to: { x: G.X(G.s.b + 1), y: G.tY }, text: 'Arrastra para copiar', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const b = RK.pick(x, 40, G.W - 40, 6) + 1; if (b !== G.s.b || !G.touched[G.cur]) { G.s.b = b; G.touch(); } };
  return game;
})();
