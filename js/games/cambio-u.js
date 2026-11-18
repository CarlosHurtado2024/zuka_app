// La incógnita escondida (Álgebra, alg-73; spec 2026-11-18-algebra-revision): en a²ˣ + p·aˣ + q = 0, si u = aˣ queda la
// cuadrática u² + pu + q = 0. Se ve su parábola en el eje u; se arrastran banderas a sus ceros que sirven. Como aˣ siempre
// es positivo, un cero negativo de u no da ninguna x (zona rayada). Al acertar, el juego pasa de u a x con el logaritmo.
// params = { rounds: [{ a, p, q }] }   state = { rounds: [{ marks: [..] }] }   (u entero de −4 a 9)
GAMES['cambio-u'] = (() => {
  const V = { x0: -4, x1: 9, y0: -8, y1: 10 };
  const roots = r => { const d = Math.sqrt(r.p * r.p - 4 * r.q); return [(-r.p - d) / 2, (-r.p + d) / 2]; };
  const good = r => roots(r).filter(u => u > 0);
  const ok = (s, r) => [...s.marks].sort((a, b) => a - b).join() === good(r).sort((a, b) => a - b).join();
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ marks: [] }),
    ok,
    answered: s => s.marks.length > 0,
    solution: r => good(r).map(u => `u = ${u} → x = ${RK.num(Math.log(u) / Math.log(r.a))}`).join('; '),
    prompt: r => `Resuelve $${r.a}^{2x} ${r.p < 0 ? '-' : '+'} ${Math.abs(r.p)}\\cdot ${r.a}^x ${r.q < 0 ? '-' : '+'} ${Math.abs(r.q)} = 0$ con $u = ${r.a}^x$`,
    foot: () => 'Arrastra banderas a los ceros de u que sirven; arrástralas afuera para quitarlas',
    layout(G) { G.b = { x: 16, y: 96, w: G.W - 32, h: G.H * 0.5 }; G.src = { x: G.W / 2 - 34, y: G.b.y + G.b.h + 10, w: 68, h: 30 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { marks: good(r) } : G.s, M = G.M = RK.plane(p, C, G.b, V, { step: 1, lx: 'u' });
      p.noStroke(); p.fill(RK.al(p, C.bad, 30)); p.rect(G.b.x, G.b.y, M.X(0) - G.b.x, G.b.h);
      TK.label(p, C, `${r.a}ˣ > 0`, (G.b.x + M.X(0)) / 2, G.b.y + 14, C.bad, 10, M.X(0) - G.b.x);
      RK.curve(p, G.b, M, V, u => u * u + r.p * u + r.q, C.sky, 2.6);
      s.marks.forEach(u => { const x = M.X(u), y = M.Y(0); p.stroke(C.ink); p.strokeWeight(2); p.line(x, y, x, y - 26); p.noStroke(); p.fill(C.brand); p.triangle(x, y - 26, x + 14, y - 21, x, y - 16); });
      RK.chip(p, C, G.src, 'bandera', { on: true, col: C.brand, size: 10 });
      if (G.drag) { p.noStroke(); p.fill(C.brand); p.triangle(G.drag.x, G.drag.y - 10, G.drag.x + 14, G.drag.y - 5, G.drag.x, G.drag.y); }
      const xs = s.marks.filter(u => u > 0).map(u => `x = \\log_{${r.a}} ${u} = ${RK.num(Math.log(u) / Math.log(r.a))}`);
      RK.strip(p, C, G.fb, xs.length ? `$${xs.join(',\\ ')}$` : '$u^2 ' + `${r.p < 0 ? '-' : '+'} ${Math.abs(r.p)}u ${r.q < 0 ? '-' : '+'} ${Math.abs(r.q)} = 0$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      if (hitBox(G.src, x, y)) { G.drag = { from: null, x, y }; return true; }
      const u = Math.round(G.M.iX(x)); if (Math.abs(y - G.M.Y(0) + 14) < 22 && G.s.marks.includes(u)) { G.drag = { from: u, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const u = Math.max(V.x0, Math.min(V.x1, Math.round(G.M.iX(x)))), m = G.s.marks;
      if (d.from != null) m.splice(m.indexOf(d.from), 1);
      if (Math.abs(y - G.M.Y(0)) < 40 && !m.includes(u) && m.length < 3) m.push(u);
      G.touch();
    },
    demo: G => ({ from: { x: G.src.x + 34, y: G.src.y + 15 }, to: { x: G.M.X([6, 7, 8].find(u => !good(G.r).includes(u))), y: G.M.Y(0) }, text: 'Arrastra la bandera', ty: G.src.y + 46 }),
    peek: G => ({ b: G.b, M: G.M, src: G.src }),
  });
  return Object.assign(game, { good });
})();
