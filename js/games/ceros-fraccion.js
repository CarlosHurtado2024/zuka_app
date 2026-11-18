// Ceros que son fracciones (Álgebra, alg-93; spec 2026-11-18-algebra-revision): un cero racional p/q de un polinomio con
// coeficientes enteros tiene p que divide al término independiente y q que divide al principal: por eso 2x³ − 3x² − 3x + 2
// puede tener ceros en las mitades. Se ve la gráfica; se arrastran banderas a la recta (de media en media) en todos sus ceros.
// params = { rounds: [{ P: [coef], zeros: [..] }] }   state = { rounds: [{ marks: [..] }] }   (de −3 a 3)
GAMES['ceros-fraccion'] = (() => {
  const V = { x0: -3, x1: 3, y0: -6, y1: 6 };
  const ev = (P, x) => P.reduce((s, k) => s * x + k, 0);
  const ok = (s, r) => [...s.marks].sort((a, b) => a - b).join() === [...r.zeros].sort((a, b) => a - b).join();
  const pt = P => P.map((k, i) => { const e = P.length - 1 - i; if (!k) return ''; const m = Math.abs(k) === 1 && e ? '' : Math.abs(k); return `${k < 0 ? ' - ' : i ? ' + ' : ''}${m}${e ? (e === 1 ? 'x' : `x^{${e}}`) : ''}`; }).join('');
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ marks: [] }),
    ok,
    answered: s => s.marks.length > 0,
    solution: r => `ceros ${r.zeros.join(', ')}`,
    prompt: r => `Marca los ceros de $${pt(r.P)}$`,
    foot: () => 'Arrastra banderas a los ceros; fuera de la recta se quitan',
    layout(G) { G.b = { x: 16, y: 98, w: G.W - 32, h: G.H * 0.46 }; G.src = { x: G.W / 2 - 34, y: G.b.y + G.b.h + 10, w: 68, h: 30 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { marks: r.zeros } : G.s, M = G.M = RK.plane(p, C, G.b, V, { step: 0.5 });
      RK.curve(p, G.b, M, V, x => ev(r.P, x), C.sky, 2.4);
      s.marks.forEach(u => { const x = M.X(u), y = M.Y(0), z = Math.abs(ev(r.P, u)) < 1e-9; p.stroke(C.ink); p.strokeWeight(2); p.line(x, y, x, y - 26); p.noStroke(); p.fill(G.locked ? (z ? C.ok : C.bad) : C.brand); p.triangle(x, y - 26, x + 14, y - 21, x, y - 16); });
      RK.chip(p, C, G.src, 'bandera', { on: true, col: C.brand, size: 10 });
      if (G.drag) { p.noStroke(); p.fill(C.brand); p.triangle(G.drag.x, G.drag.y - 10, G.drag.x + 14, G.drag.y - 5, G.drag.x, G.drag.y); }
      const vals = [...s.marks].sort((a, b) => a - b).map(u => `P(${u}) = ${+ev(r.P, u).toFixed(3)}`);
      RK.strip(p, C, G.fb, vals.length ? `$${vals.join(',\\ ')}$` : '$\\text{sin banderas}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 14 });
    },
    press(G, x, y) {
      if (hitBox(G.src, x, y)) { G.drag = { from: null, x, y }; return true; }
      const u = Math.round(G.M.iX(x) * 2) / 2; if (Math.abs(y - G.M.Y(0) + 14) < 22 && G.s.marks.includes(u)) { G.drag = { from: u, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const u = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x) * 2) / 2)), m = G.s.marks;
      if (d.from != null) m.splice(m.indexOf(d.from), 1);
      if (Math.abs(y - G.M.Y(0)) < 40 && !m.includes(u) && m.length < 4) m.push(u);
      G.touch();
    },
    demo: G => ({ from: { x: G.src.x + 34, y: G.src.y + 15 }, to: { x: G.M.X([2.5, -2.5, 3].find(u => !G.r.zeros.includes(u))), y: G.M.Y(0) }, text: 'Arrastra una bandera', ty: G.src.y + 46 }),
    peek: G => ({ b: G.b, M: G.M, src: G.src }),
  });
  return Object.assign(game, { answer: r => ({ marks: r.zeros }) });
})();
