// El cubo pintado (Preuniversitario, pu-es-2; spec 2026-11-18-preuda-razonamiento-completo): un cubo de n × n × n se pinta por
// fuera y se corta en cubitos. Las 8 esquinas tienen 3 caras pintadas; los de las 12 aristas (sin esquinas), 2; los del
// centro de cada cara, 1; y los de adentro, ninguna. Se arrastra cuántos cubitos hay de cada tipo; el juego resalta en el
// dibujo dónde están los del tipo que se está moviendo.
// params = { rounds: [{ n }] }   state = { rounds: [{ c: [c3, c2, c1, c0] }] }   (de 0 a 30)
GAMES['cubo-pintado'] = (() => {
  const want = r => { const m = r.n - 2; return [8, 12 * m, 6 * m * m, m * m * m]; };
  const ok = (s, r) => s.c.join() === want(r).join();
  const LAB = ['3 caras', '2 caras', '1 cara', 'ninguna'];
  const game = roundsGame({
    aspect: 1.55,
    init: () => ({ c: [0, 0, 0, 0] }),
    ok,
    answered: s => s.c.some(v => v > 0),
    solution: r => want(r).map((v, i) => `${LAB[i]}: ${v}`).join(', '),
    prompt: r => `Cubo de ${r.n} × ${r.n} × ${r.n} pintado por fuera. ¿Cuántos cubitos de cada tipo?`,
    foot: () => 'Arrastra cuántos cubitos tienen 3, 2, 1 y ninguna cara pintada',
    layout(G) { G.tr = [0, 1, 2, 3].map(i => G.H - 196 + i * 34); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { c: want(r) } : G.s, n = r.n, c = Math.min(26, 120 / n), dx = c * 0.5, dy = c * 0.5, ox = G.W / 2 - (n * c + n * dx) / 2, oy = 110 + n * dy, hi = G.grab;
      const kind = (i, j, k) => [i, j, k].filter(v => v === 0 || v === n - 1).length;             // cuántas caras exteriores toca
      const col = t => (hi >= 0 && 3 - hi === t ? C.coral : RK.al(p, C.sky, 180));
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { p.stroke(C.bg); p.strokeWeight(1); p.fill(col(kind(i, j, n - 1))); p.rect(ox + i * c, oy + j * c, c, c); }
      for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const x = ox + i * c + k * dx, y = oy - k * dy; p.fill(col(kind(i, 0, n - 1 - k))); p.quad(x, y, x + c, y, x + c + dx, y - dy, x + dx, y - dy); }
      for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { const x = ox + n * c + k * dx, y = oy + j * c - k * dy; p.fill(col(kind(n - 1, j, n - 1 - k))); p.quad(x, y, x + dx, y - dy, x + dx, y - dy + c, x, y + c); }
      G.X = G.tr.map((ty, i) => { TK.label(p, C, `${LAB[i]}: ${s.c[i]}`, 54, ty - 14, C.ink, 10, 100); return RK.track(p, C, 110, G.W - 24, ty, 31, s.c[i], k => (k % 5 === 0 ? String(k) : null), C.sky); });
      RK.strip(p, C, G.fb, `$${s.c.join(' + ')} = ${s.c.reduce((a, b) => a + b, 0)}\\ (\\text{de } ${n ** 3})$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const j = G.tr.findIndex(t => Math.abs(y - t) < 18); if (j < 0) return false; G.grab = j; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => ({ from: { x: G.X[0](0), y: G.tr[0] }, to: { x: G.X[0](4), y: G.tr[0] }, text: 'Arrastra un conteo', ty: G.tr[0] - 30 }),
    peek: G => ({ tr: G.tr }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 110, G.W - 24, 31), j = G.grab; if (v !== G.s.c[j] || !G.touched[G.cur]) { G.s.c[j] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ c: want(r) }) });
})();
