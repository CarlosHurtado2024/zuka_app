// Reduce los semejantes (Álgebra, alg-23a; spec 2026-11-18-algebra-revision): solo se juntan piezas iguales. En la mesa
// hay bloques revueltos de un polinomio sin reducir; se arrastra un bloque sobre otro del mismo tipo y signo contrario y
// los dos se anulan. Cuando no quedan parejas que anular, lo que queda es el polinomio reducido. Un cuadrado y una barra
// no se anulan: no son semejantes.
// params = { rounds: [{ tiles: [[k, neg], …] }] }   (k: 2 = x², 1 = x, 0 = 1)   state = { rounds: [{ gone: [índices] }] }
GAMES['reduce-semejantes'] = (() => {
  const left = (s, r) => r.tiles.map((t, i) => i).filter(i => !s.gone.includes(i));
  const coef = (s, r) => { const c = [0, 0, 0]; left(s, r).forEach(i => { const [k, neg] = r.tiles[i]; c[2 - k] += neg ? -1 : 1; }); return c; };
  const ok = (s, r) => [2, 1, 0].every(k => { const L = left(s, r).map(i => r.tiles[i]).filter(t => t[0] === k); return !(L.some(t => t[1]) && L.some(t => !t[1])); });
  const answer = r => { const gone = [], used = new Set(); r.tiles.forEach((t, i) => { if (used.has(i)) return; const j = r.tiles.findIndex((u, k) => k !== i && !used.has(k) && u[0] === t[0] && u[1] !== t[1]); if (j >= 0) { used.add(i); used.add(j); gone.push(i, j); } }); return { gone }; };
  const poly = c => GAMES['bloques-polinomio'].poly(c);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ gone: [] }),
    ok,
    answered: s => s.gone.length > 0,
    solution: r => poly(coef(answer(r), r)),
    prompt: () => 'Reduce el polinomio: anula los bloques opuestos',
    foot: () => 'Arrastra un bloque sobre otro igual de signo contrario',
    layout(G) { G.mat = { x: 12, y: 96, w: G.W - 24, h: G.H * 0.52 }; G.u = 40; G.s = 14; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, mat, u, s } = G, st = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(mat.x, mat.y, mat.w, mat.h, 14);
      let x = mat.x + 10, y = mat.y + 10, rowH = 0; G.pos = [];
      r.tiles.forEach(([k, neg], i) => { const [w, h] = RK.tileSize(k, u, s); if (x + w > mat.x + mat.w - 8) { x = mat.x + 10; y += rowH + 8; rowH = 0; } G.pos[i] = { x, y, w, h }; if (!st.gone.includes(i) && G.drag?.i !== i) RK.tile(p, C, k, x, y, u, s, neg); x += w + 8; rowH = Math.max(rowH, h); });
      if (G.drag) { const [k, neg] = r.tiles[G.drag.i]; RK.tile(p, C, k, G.drag.x - 10, G.drag.y - 10, u, s, neg, { lift: true }); }
      RK.strip(p, C, G.fb, `$${poly(coef(st, r))}$`, { kicker: 'Lo que queda', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { const i = G.pos.findIndex((q, k) => q && !G.s.gone.includes(k) && hitBox(q, x, y)); if (i < 0) return false; G.drag = { i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const [k, neg] = G.r.tiles[d.i], j = G.pos.findIndex((q, m) => m !== d.i && !G.s.gone.includes(m) && hitBox({ x: q.x - 4, y: q.y - 4, w: q.w + 8, h: q.h + 8 }, x, y));
      if (j >= 0 && G.r.tiles[j][0] === k && G.r.tiles[j][1] !== neg) { G.s.gone.push(d.i, j); G.touch(); }
    },
    demo(G) { const a = answer(G.r).gone, q1 = G.pos[a[0]], q2 = G.pos[a[1]]; return q1 && q2 ? { from: { x: q1.x + 6, y: q1.y + 6 }, to: { x: q2.x + 6, y: q2.y + 6 }, text: 'Arrastra sobre su opuesto', ty: G.mat.y + G.mat.h + 14 } : null; },
    peek: G => ({ pos: G.pos }),
  });
  return Object.assign(game, { answer, coef });
})();
