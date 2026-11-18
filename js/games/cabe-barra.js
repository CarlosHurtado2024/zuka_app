// Cambio de base (Álgebra, alg-72; spec 2026-11-18-algebra-revision): log_b a = log a ÷ log b: cuántas veces cabe la barra
// de log b en la de log a. Arriba está la barra de log a (con logaritmos en base 10, los de la calculadora); abajo se
// arrastra cuántas copias de la barra de log b se ponen, de media en media. Hay que igualar los largos.
// params = { rounds: [{ a, b }] }   state = { rounds: [{ n }] }   (n de 0 a 6, de media en media)
GAMES['cabe-barra'] = (() => {
  const S = Array.from({ length: 13 }, (_, i) => i / 2);
  const need = r => Math.log(r.a) / Math.log(r.b);
  const ok = (s, r) => Math.abs(s.n - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `log_${r.b} ${r.a} = ${RK.num(need(r))}`,
    prompt: r => `Calcula $\\log_{${r.b}} ${r.a}$ con logaritmos en base 10`,
    foot: () => 'Arrastra cuántas barras de log b caben en la de log a',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, la = Math.log10(r.a), lb = Math.log10(r.b), x0 = 20, u = (G.W - 40) / Math.max(la, lb * 6, 0.1);
      TK.label(p, C, `log ${r.a} ≈ ${la.toFixed(3)}`, x0 + 60, 104, C.mute, 10, 120);
      p.noStroke(); p.fill(C.sky); p.rect(x0, 114, la * u, 26, 4);
      TK.label(p, C, `log ${r.b} ≈ ${lb.toFixed(3)}`, x0 + 60, 162, C.mute, 10, 120);
      for (let i = 0; i < Math.ceil(n); i++) { const part = Math.min(1, n - i); p.stroke(C.bg); p.strokeWeight(1.5); p.fill(ok({ n }, r) ? C.ok : C.coral); p.rect(x0 + i * lb * u, 172, lb * u * part, 26, 3); }
      p.stroke(C.ink); p.strokeWeight(1.6); p.drawingContext.setLineDash([4, 3]); p.line(x0 + la * u, 108, x0 + la * u, 206); p.drawingContext.setLineDash([]);
      G.X = RK.track(p, C, 24, G.W - 24, G.tY, S.length, Math.round(n * 2), i => (i % 2 === 0 ? String(S[i]) : null));
      RK.strip(p, C, G.fb, `$\\dfrac{\\log ${r.a}}{\\log ${r.b}} ${ok({ n }, r) ? '=' : '\\ne'} ${RK.num(n)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(2), y: G.tY }, to: { x: G.X(5), y: G.tY }, text: 'Arrastra cuántas caben', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = S[RK.pick(x, 24, G.W - 24, S.length)]; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
