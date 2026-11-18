// El decimal periódico es una serie (Álgebra, alg-14d; spec 2026-11-18-algebra-revision): 0.454545… = 45/100 + 45/100² + …
// es una geométrica de razón 1/100, y su suma es una fracción. Las barras muestran las sumas parciales, que se acercan a
// una altura; se arrastran numerador y denominador hasta que la fracción caiga justo en ese límite.
// params = { rounds: [{ block }] }   (bloque que se repite, como texto: '45')   state = { rounds: [{ n, d }] }   (n de 1 a 20, d de 2 a 40)
GAMES['periodico-serie'] = (() => {
  const lim = r => +r.block / (10 ** r.block.length - 1);
  const ok = (s, r) => Math.abs(s.n / s.d - lim(r)) < 1e-12;
  const answer = r => { for (let d = 2; d <= 40; d++) for (let n = 1; n <= 20; n++) if (ok({ n, d }, r)) return { n, d }; return null; };
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ n: 1, d: 2 }),
    ok,
    solution: r => { const a = answer(r); return `${a.n}/${a.d}`; },
    prompt: r => `¿Qué fracción es $0.${r.block.repeat(Math.ceil(6 / r.block.length))}\\ldots$?`,
    foot: () => 'Arrastra numerador y denominador hasta el límite de las barras',
    layout(G) { G.tr = [G.H - 150, G.H - 108]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, L = lim(r), top = 104, h = G.tr[0] - 60 - top, Y = v => top + h - v * h, k = r.block.length, q = 10 ** -k;
      let S = 0; const w = (G.W - 60) / 5;
      for (let i = 0; i < 5; i++) { S += +r.block * q ** (i + 1); p.noStroke(); p.fill(C.sky); p.rect(30 + i * w + 4, Y(S), w - 8, top + h - Y(S), 3); TK.label(p, C, `${i + 1} bloque${i ? 's' : ''}`, 30 + (i + 0.5) * w, top + h + 10, C.mute, 9, w); }
      p.stroke(C.ink); p.strokeWeight(1.2); p.line(24, Y(0), G.W - 24, Y(0)); p.line(24, Y(1), G.W - 24, Y(1)); TK.label(p, C, '1', 16, Y(1), C.mute, 9, 16);
      const f = Math.min(1, s.n / s.d); p.stroke(ok(s, r) ? C.ok : C.coral); p.strokeWeight(2.2); p.drawingContext.setLineDash([6, 4]); p.line(24, Y(f), G.W - 24, Y(f)); p.drawingContext.setLineDash([]);
      G.X = [RK.track(p, C, 30, G.W - 30, G.tr[0], 20, s.n - 1, i => (i % 4 === 3 ? String(i + 1) : null), C.coral), RK.track(p, C, 30, G.W - 30, G.tr[1], 39, s.d - 2, i => (i % 8 === 7 ? String(i + 2) : null), C.sky)];
      RK.strip(p, C, G.fb, `$\\dfrac{${s.n}}{${s.d}} = ${(s.n / s.d).toFixed(6)}\\ldots$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 20); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[1](0), y: G.tr[1] }, to: { x: G.X[1](5), y: G.tr[1] }, text: 'Arrastra el denominador', ty: G.tr[0] - 30 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const j = G.grab; if (j === 0) { const n = RK.pick(x, 30, G.W - 30, 20) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } } else { const d = RK.pick(x, 30, G.W - 30, 39) + 2; if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } } };
  return Object.assign(game, { answer, lim });
})();
