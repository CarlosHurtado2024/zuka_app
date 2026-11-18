// Contar triángulos con orden (Preuniversitario, pu-co-5; spec 2026-11-18-preuda-razonamiento-completo): un triángulo partido
// por rectas desde la punta; cada triángulo de la figura sale de escoger dos de las rectas que llegan a la base, así que hay
// C(k, 2). Se arrastra sobre la base desde una recta hasta otra: se ilumina ese triángulo y se guarda (cada uno una vez).
// Hay que encontrarlos todos, por tamaños, sin repetir.
// params = { rounds: [{ k }] }   (k rectas desde la punta, contando los dos lados)   state = { rounds: [{ found: ['i-j'] }] }
GAMES['cuenta-triangulos'] = (() => {
  const total = r => r.k * (r.k - 1) / 2;
  const ok = (s, r) => s.found.length === total(r);
  const geo = G => { const x0 = 30, x1 = G.W - 30, yb = G.H - 150, apex = { x: G.W / 2, y: 110 }; return { apex, yb, X: i => x0 + (x1 - x0) * i / (G.r.k - 1) }; };
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ found: [] }),
    ok,
    answered: s => s.found.length > 0,
    solution: r => `${total(r)} triángulos`,
    prompt: r => `¿Cuántos triángulos hay en la figura? Encuéntralos todos`,
    foot: () => 'Arrastra sobre la base de una recta a otra para marcar un triángulo',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { found: [...Array(r.k).keys()].flatMap(i => [...Array(r.k).keys()].filter(j => j > i).map(j => `${i}-${j}`)) } : G.s, g = geo(G), good = ok(s, r);
      const tri = (i, j, col, a) => { p.noStroke(); p.fill(RK.al(p, col, a)); p.triangle(g.apex.x, g.apex.y, g.X(i), g.yb, g.X(j), g.yb); };
      s.found.forEach(k => { const [i, j] = k.split('-').map(Number); tri(i, j, good ? C.ok : C.sky, 40); });
      if (G.drag && G.drag.j != null && G.drag.j !== G.drag.i) tri(Math.min(G.drag.i, G.drag.j), Math.max(G.drag.i, G.drag.j), C.brand, 120);
      p.stroke(C.ink); p.strokeWeight(1.8); for (let i = 0; i < r.k; i++) p.line(g.apex.x, g.apex.y, g.X(i), g.yb); p.line(g.X(0), g.yb, g.X(r.k - 1), g.yb);
      for (let i = 0; i < r.k; i++) drawDot(p, C, g.X(i), g.yb, 10, C.brand);
      const bySize = Array.from({ length: r.k - 1 }, (_, w) => s.found.filter(k => { const [i, j] = k.split('-').map(Number); return j - i === w + 1; }).length);
      TK.label(p, C, bySize.map((c, w) => `de ${w + 1}: ${c}`).join(' · '), G.W / 2, g.yb + 22, C.mute, 10, G.W - 30);
      RK.strip(p, C, G.fb, `$\\text{${s.found.length} triángulos encontrados}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const g = geo(G); if (Math.abs(y - g.yb) > 30) return false; let best = 0; for (let i = 1; i < G.r.k; i++) if (Math.abs(g.X(i) - x) < Math.abs(g.X(best) - x)) best = i; G.drag = { i: best, j: best }; return true; },
    drag(G, x, y) { if (!G.drag) return false; const g = geo(G); let best = 0; for (let i = 1; i < G.r.k; i++) if (Math.abs(g.X(i) - x) < Math.abs(g.X(best) - x)) best = i; G.drag.j = best; return true; },
    release(G) { const d = G.drag; G.drag = null; if (!d || d.i === d.j) return; const k = `${Math.min(d.i, d.j)}-${Math.max(d.i, d.j)}`; if (!G.s.found.includes(k)) { G.s.found.push(k); G.touch(); } },
    demo: G => { const g = geo(G); return { from: { x: g.X(0), y: g.yb }, to: { x: g.X(1), y: g.yb }, text: 'Arrastra sobre la base', ty: g.yb + 40 }; },
    peek: G => geo(G),
  });
  return Object.assign(game, { total });
})();
