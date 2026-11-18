// Las diagonales de un polígono (Preuniversitario, pu-co-5; spec 2026-11-18-preuda-razonamiento-completo): de cada vértice salen
// diagonales a todos menos a sí mismo y a sus dos vecinos (n − 3), y cada diagonal se contaría dos veces: n(n − 3)/2. Se
// arrastra de un vértice a otro no vecino para trazar la diagonal. Hay que trazarlas todas.
// params = { rounds: [{ n }] }   state = { rounds: [{ d: ['i-j'] }] }
GAMES['diagonales'] = (() => {
  const total = r => r.n * (r.n - 3) / 2;
  const ok = (s, r) => s.d.length === total(r);
  const pt = (G, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / G.r.n; return { x: G.c.x + G.R * Math.cos(a), y: G.c.y + G.R * Math.sin(a) }; };
  const game = roundsGame({
    aspect: 1.35,
    init: () => ({ d: [] }),
    ok,
    answered: s => s.d.length > 0,
    solution: r => `${total(r)} diagonales`,
    prompt: r => `Traza todas las diagonales del polígono de ${r.n} lados`,
    foot: () => 'Arrastra de un vértice a otro que no sea su vecino',
    layout(G) { G.c = { x: G.W / 2, y: 200 }; G.R = Math.min(G.W / 2 - 40, 96); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, n = r.n, all = [...Array(n).keys()].flatMap(i => [...Array(n).keys()].filter(j => j > i + 1 && !(i === 0 && j === n - 1)).map(j => `${i}-${j}`)), s = G.locked && !ok(G.s, r) ? { d: all } : G.s, good = ok(s, r);
      p.stroke(C.ink); p.strokeWeight(2); p.noFill(); p.beginShape(); for (let i = 0; i < n; i++) { const q = pt(G, i); p.vertex(q.x, q.y); } p.endShape(p.CLOSE);
      s.d.forEach(k => { const [i, j] = k.split('-').map(Number), a = pt(G, i), b = pt(G, j); p.stroke(good ? C.ok : C.coral); p.strokeWeight(1.8); p.line(a.x, a.y, b.x, b.y); });
      if (G.drag) { const a = pt(G, G.drag.i); p.stroke(C.brand); p.strokeWeight(2); p.line(a.x, a.y, G.drag.x, G.drag.y); }
      for (let i = 0; i < n; i++) { const q = pt(G, i); drawDot(p, C, q.x, q.y, 12, C.brand); }
      RK.strip(p, C, G.fb, `$\\text{${s.d.length} diagonales}$`, { kicker: good ? 'Están todas' : 'Sigue trazando', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { for (let i = 0; i < G.r.n; i++) { const q = pt(G, i); if (Math.hypot(x - q.x, y - q.y) < 20) { G.drag = { i, x, y }; return true; } } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return; const n = G.r.n;
      for (let j = 0; j < n; j++) { const q = pt(G, j), gap = Math.abs(j - d.i); if (Math.hypot(x - q.x, y - q.y) < 22 && gap > 1 && gap < n - 1) { const k = `${Math.min(d.i, j)}-${Math.max(d.i, j)}`; if (!G.s.d.includes(k)) { G.s.d.push(k); G.touch(); } } }
    },
    demo: G => { const a = pt(G, 0), b = pt(G, 2); return { from: a, to: b, text: 'Traza una diagonal', ty: G.c.y + G.R + 30 }; },
    peek: G => ({ c: G.c, R: G.R }),
  });
  return Object.assign(game, { total });
})();
