// Nivela las barras (Álgebra, alg-14b; spec 2026-11-18-algebra-revision): la suma de una progresión aritmética es el
// número de términos por el promedio de los extremos. Las barras de los términos están en fila; se arrastra una línea de
// nivel: lo que sobra arriba de la línea llena lo que falta abajo. Cuando todo queda parejo, la línea está en el
// promedio (a₁ + aₙ)/2 y la suma es n por esa altura.
// params = { rounds: [{ a1, d, n }] }   state = { rounds: [{ h }] }   (altura de la línea, de medio en medio)
GAMES['nivela-barras'] = (() => {
  const terms = r => Array.from({ length: r.n }, (_, i) => r.a1 + i * r.d);
  const avg = r => (2 * r.a1 + (r.n - 1) * r.d) / 2;
  const ok = (s, r) => Math.abs(s.h - avg(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ h: r.a1 }),
    ok,
    solution: r => `nivel ${avg(r)}: suma = ${r.n} · ${avg(r)} = ${r.n * avg(r)}`,
    prompt: r => `Nivela las barras de $${terms(r).join(' + ')}$`,
    foot: () => 'Arrastra la línea hasta que lo que sobra arriba llene lo que falta abajo',
    layout(G) { G.base = G.H - 110; G.fb = { x: 12, y: G.H - 74, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, h = G.locked && !ok(G.s, r) ? avg(r) : G.s.h, T = terms(r), top = Math.max(...T) * 1.15, Y = v => G.base - (G.base - 110) * v / top, w = (G.W - 40) / r.n;
      let over = 0, under = 0;
      T.forEach((v, i) => { const x = 20 + i * w + 3; p.noStroke(); p.fill(C.sky); p.rect(x, Y(v), w - 6, G.base - Y(v), 3); if (v > h) { p.fill(RK.al(p, C.coral, 150)); p.rect(x, Y(v), w - 6, Y(h) - Y(v)); over += v - h; } else if (v < h) { p.noFill(); p.stroke(C.mint); p.strokeWeight(1.5); p.drawingContext.setLineDash([3, 3]); p.rect(x, Y(h), w - 6, Y(v) - Y(h)); p.drawingContext.setLineDash([]); under += h - v; } });
      p.stroke(C.brand); p.strokeWeight(3); p.line(14, Y(h), G.W - 14, Y(h)); RK.knob(p, C, G.W - 22, Y(h), C.brand); G.ky = Y(h); G.Y = Y; G.top = top;
      TK.label(p, C, `sobra ${over}  ·  falta ${under}`, G.W / 2, 104, over === under ? C.ok : C.mute, 12, G.W - 30);
      RK.strip(p, C, G.fb, `$S = ${r.n} \\cdot ${h} = ${r.n * h}$`, { kicker: 'n · nivel', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.ky) > 40) return false; G.grab = true; game.move(G, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.W - 22, y: G.ky }, to: { x: G.W - 22, y: G.ky - 50 }, text: 'Arrastra la línea', ty: G.base + 22 }),
    peek: G => ({ base: G.base }),
  });
  game.move = (G, y) => { const v = Math.max(0, Math.round(((G.base - y) / (G.base - 110)) * G.top * 2) / 2); if (v !== G.s.h || !G.touched[G.cur]) { G.s.h = v; G.touch(); } };
  return Object.assign(game, { avg });
})();
