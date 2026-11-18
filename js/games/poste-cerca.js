// Los postes de la cerca (Álgebra, alg-14; spec 2026-11-18-algebra-revision): términos y saltos no son lo mismo. Una
// cerca de L metros con un poste cada d metros: se arrastra cuántos postes poner y se ven los tramos. Entre el primero y
// el último hay n − 1 tramos, así que hacen falta L/d + 1 postes (los de las puntas también cuentan).
// params = { rounds: [{ L, d }] }   state = { rounds: [{ n }] }   (postes, de 2 a 13)
GAMES['poste-cerca'] = (() => {
  const MAX = 13;
  const need = r => r.L / r.d + 1;
  const ok = (s, r) => s.n === need(r);
  const game = roundsGame({
    aspect: 0.95,
    init: () => ({ n: 2 }),
    ok,
    solution: r => `${need(r)} postes: ${need(r) - 1} tramos de ${r.d} m = ${r.L} m`,
    prompt: r => `Una cerca de ${r.L} m con un poste cada ${r.d} m. ¿Cuántos postes?`,
    foot: () => 'Arrastra cuántos postes poner',
    layout(G) { G.y = G.H * 0.42; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, x0 = 24, x1 = G.W - 24, len = (n - 1) * r.d, X = m => x0 + (x1 - x0) * m / r.L;
      p.stroke(C.line); p.strokeWeight(2); p.drawingContext.setLineDash([4, 4]); p.line(x0, G.y + 30, x1, G.y + 30); p.drawingContext.setLineDash([]);
      TK.label(p, C, `${r.L} m`, G.W / 2, G.y + 46, C.mute, 11, 60);
      for (let k = 0; k < n; k++) { const x = X(Math.min(k * r.d, r.L * 1.08)); if (k) { p.stroke(C.sun); p.strokeWeight(3); p.line(X((k - 1) * r.d), G.y - 10, x, G.y - 10); p.line(X((k - 1) * r.d), G.y + 6, x, G.y + 6); } p.stroke(C.ink); p.strokeWeight(5); p.line(x, G.y - 26, x, G.y + 22); }
      TK.label(p, C, `${n - 1} tramos · ${len} m`, G.W / 2, G.y - 44, len === r.L ? C.ok : C.ink, 13, 160);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, MAX - 1, n - 2, i => ((i + 2) % 2 === 0 ? String(i + 2) : null));
      RK.strip(p, C, G.fb, `$${n}\\text{ postes} \\to ${n - 1}\\text{ tramos} \\cdot ${r.d} = ${len}\\text{ m}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 2), y: G.tY }, to: { x: G.X(G.s.n + 1), y: G.tY }, text: 'Arrastra los postes', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, MAX - 1) + 2; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
