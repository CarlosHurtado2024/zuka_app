// Hacia el número e (Álgebra, alg-71; spec 2026-11-18-algebra-revision): un banco paga el 100 % al año repartido en n
// pagos de 1/n cada uno; un peso se vuelve (1 + 1/n)ⁿ. Al repartir más, se gana más, pero cada vez menos: el valor se
// acerca a e ≈ 2.718 sin pasarlo. Se arrastra n y crece la barra; hay que hallar el primer n que supera la meta.
// params = { rounds: [{ target }] }   state = { rounds: [{ i }] }   (índice en N)
GAMES['hacia-e'] = (() => {
  const N = [1, 2, 3, 5, 10, 20, 50, 100, 1000];
  const v = n => (1 + 1 / n) ** n;
  const need = r => N.findIndex(n => v(n) > r.target);
  const ok = (s, r) => s.i === need(r);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ i: 0 }),
    ok,
    solution: r => `n = ${N[need(r)]}: ${v(N[need(r)]).toFixed(4)}`,
    prompt: r => `Un peso al 100 % anual en n pagos: ¿desde qué n pasa de ${r.target}?`,
    foot: () => 'Arrastra n: cuántas veces al año se paga el interés',
    layout(G) { G.tY = G.H - 106; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, i = G.locked && !ok(G.s, r) ? need(r) : G.s.i, n = N[i], val = v(n), x0 = 30, x1 = G.W - 30, X = t => x0 + (t - 1) / 2 * (x1 - x0), y = 150;
      [1, 1.5, 2, 2.5, 3].forEach(t => { p.stroke(C.line); p.strokeWeight(1); p.line(X(t), y - 30, X(t), y + 40); TK.label(p, C, String(t), X(t), y + 52, C.mute, 10, 30); });
      p.noStroke(); p.fill(ok({ i }, r) ? C.ok : C.sky); p.rect(x0, y, X(val) - x0, 30, 4);
      [[Math.E, 'e', C.coral], [r.target, 'meta', C.brand]].forEach(([t, lab, col]) => { p.stroke(col); p.strokeWeight(2); p.drawingContext.setLineDash([4, 3]); p.line(X(t), y - 24, X(t), y + 36); p.drawingContext.setLineDash([]); TK.label(p, C, lab, X(t), y - 34, col, 11, 40); });
      TK.label(p, C, `cada pago: × (1 + 1/${n})`, G.W / 2, y + 80, C.mute, 11, G.W - 40);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N.length, i, k => String(N[k]));
      RK.strip(p, C, G.fb, `$\\left(1 + \\tfrac{1}{${n}}\\right)^{${n}} \\approx ${val.toFixed(4)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.i), y: G.tY }, to: { x: G.X(G.s.i + 3), y: G.tY }, text: 'Arrastra n', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const i = RK.pick(x, 30, G.W - 30, N.length); if (i !== G.s.i || !G.touched[G.cur]) { G.s.i = i; G.touch(); } };
  return Object.assign(game, { need });
})();
