// La torre geométrica (Álgebra, alg-14d; spec 2026-11-18-algebra-revision): la suma de los n primeros términos de una
// progresión geométrica. Cada término es un bloque que se apila; se arrastra cuántos términos sumar y la altura de la
// torre se escribe con la fórmula Sₙ = a(rⁿ − 1)/(r − 1). Hay que llegar justo a la altura pedida.
// params = { rounds: [{ a, r, target }] }   state = { rounds: [{ n }] }
GAMES['torre-geometrica'] = (() => {
  const MAX = 8;
  const S = (q, n) => (q.a * (q.r ** n - 1)) / (q.r - 1);
  const need = q => { for (let n = 1; n <= MAX; n++) if (Math.abs(S(q, n) - q.target) < 1e-9) return n; return -1; };
  const ok = (s, q) => s.n === need(q);
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ n: 1 }),
    ok,
    solution: q => `${need(q)} términos: S = ${q.target}`,
    prompt: q => `Apila ${q.a}, ${q.a * q.r}, ${q.a * q.r * q.r}, … hasta llegar a ${q.target}`,
    foot: () => 'Arrastra cuántos términos apilar',
    layout(G) { G.base = G.H - 142; G.tY = G.H - 100; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r: q } = G, n = G.locked && !ok(G.s, q) ? need(q) : G.s.n, top = Math.max(q.target * 1.25, S(q, n)), u = (G.base - 104) / top;
      let y = G.base;
      for (let k = 0; k < n; k++) { const v = q.a * q.r ** k, h = v * u; p.stroke(C.bg); p.strokeWeight(1); p.fill(k % 2 ? C.sky : C.mint); p.rect(G.W / 2 - 50, y - h, 100, h, 2); if (h > 14) TK.label(p, C, String(v), G.W / 2, y - h / 2, C.ink, 11, 90); y -= h; }
      const ty = G.base - q.target * u; p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.line(30, ty, G.W - 30, ty); p.drawingContext.setLineDash([]); TK.label(p, C, String(q.target), 40, ty - 10, C.ok, 11, 40);
      G.X = RK.track(p, C, 34, G.W - 34, G.tY, MAX, n - 1, i => String(i + 1));
      RK.strip(p, C, G.fb, `$S_{${n}} = \\tfrac{${q.a}\\,(${q.r}^{${n}} - 1)}{${q.r} - 1} = ${S(q, n)}$`, { col: G.locked || ok(G.s, q) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 2), y: G.tY }, text: 'Arrastra los términos', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 34, G.W - 34, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
