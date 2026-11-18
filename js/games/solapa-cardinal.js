// Solapa los conjuntos (Álgebra 0, alg-0c; spec 2026-11-18-algebra-revision): el cardinal de la unión. A y B tienen
// sus puntos (personas); al arrastrar B sobre A, algunos puntos pasan a la zona común y la cuenta se escribe sola:
// n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Hay que solapar justo lo que hace falta para que la unión tenga el total dado.
// params = { rounds: [{ a, b, total, A, B }] }   (A, B: qué cuenta cada conjunto)   state = { rounds: [{ k }] }   (k = n(A ∩ B))
GAMES['solapa-cardinal'] = (() => {
  const need = r => r.a + r.b - r.total;
  // Puntos repartidos en un óvalo (rejilla que llena la zona).
  function dots(p, n, cx, cy, rx, ry, col) {
    const cols = Math.max(1, Math.ceil(Math.sqrt(n * rx / ry))), rows = Math.ceil(n / cols);
    p.noStroke(); p.fill(col);
    for (let i = 0; i < n; i++) { const c = i % cols, rr = Math.floor(i / cols); p.circle(cx + (c - (cols - 1) / 2) * Math.min(14, (2 * rx) / cols), cy + (rr - (rows - 1) / 2) * Math.min(14, (2 * ry) / rows), 7); }
  }
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ k: 1 }),
    ok: (s, r) => s.k === need(r),
    solution: r => `n(A ∩ B) = ${r.a} + ${r.b} − ${r.total} = ${need(r)}`,
    prompt: r => `${r.a} ${r.A}, ${r.b} ${r.B}: en total son ${r.total}. Solapa B`,
    foot: () => 'Arrastra B: lo que comparten queda en la zona común',
    layout(G) { const W = G.W, H = G.H; G.cy = H * 0.46; G.R = Math.min(W * 0.25, H * 0.2); G.fb = { x: 12, y: H - 88, w: W - 24, h: 54 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, [SA, SB] = SK.sets(C), good = G.s.k === need(r), k = G.locked && !good ? need(r) : G.s.k, m = Math.min(r.a, r.b);
      // La distancia entre centros sale de k: sin compartir, separados; todo compartido, el menor adentro del mayor.
      const R = G.R, f = m ? k / m : 0, d = 2 * R * (1 - f) + 0.15 * R * f, ax = G.W / 2 - d / 2, bx = G.W / 2 + d / 2;
      G.bx = bx;
      SK.membrane(p, C, ax, G.cy, R, R * 0.85, SA.line, { fill: 26 }); SK.membrane(p, C, bx, G.cy, R, R * 0.85, SB.line, { fill: 26 });
      SK.tag(p, C, 'A', ax - R * 0.7, G.cy - R * 0.85, SA); SK.tag(p, C, 'B', bx + R * 0.7, G.cy - R * 0.85, SB);
      const lensW = Math.max(0, 2 * R - d) / 2;
      dots(p, r.a - k, ax - lensW / 2 - R * 0.15, G.cy, Math.max(12, (R - lensW) * 0.6), R * 0.55, SA.line);
      dots(p, r.b - k, bx + lensW / 2 + R * 0.15, G.cy, Math.max(12, (R - lensW) * 0.6), R * 0.55, SB.line);
      if (k) dots(p, k, (ax + bx) / 2, G.cy, Math.max(8, lensW * 0.7), R * 0.6, C.brand);
      TK.label(p, C, `${r.a - k}`, ax - R * 0.55, G.cy + R * 0.95, SA.ink, 12, 40);
      TK.label(p, C, `${k}`, (ax + bx) / 2, G.cy + R * 0.95, C.ink, 12, 40);
      TK.label(p, C, `${r.b - k}`, bx + R * 0.55, G.cy + R * 0.95, SB.ink, 12, 40);
      const u = r.a + r.b - k;
      SK.formal(p, C, G.fb, `$n(A \\cup B) = ${r.a} + ${r.b} - ${k} = ${u}$`, { kicker: `Meta: ${r.total}`, col: G.locked ? C.ok : u === r.total ? C.ok : SB.line, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.cy) > G.R * 1.1 || x < G.W * 0.3) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.bx, y: G.cy }, to: { x: G.bx - G.R * 0.6, y: G.cy }, text: 'Arrastra B sobre A', ty: G.cy - G.R - 22 }),
    peek: G => ({ cy: G.cy, R: G.R, need: need(G.r) }),
  });
  // El dedo fija dónde está B; de ahí sale cuántos puntos comparten.
  game.move = (G, x) => {
    const r = G.r, m = Math.min(r.a, r.b), R = G.R, d = Math.max(0.15 * R, Math.min(2 * R, 2 * (x - G.W / 2))), f = (2 * R - d) / (2 * R - 0.15 * R);
    const k = Math.max(0, Math.min(m, Math.round(f * m)));
    if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); }
  };
  return Object.assign(game, { need });
})();
