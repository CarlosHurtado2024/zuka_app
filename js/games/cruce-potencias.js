// Exponencial contra polinomio (Álgebra, alg-71; spec 2026-11-18-algebra-revision): 2ˣ empieza más despacio que x² o que
// 2x, pero al final siempre gana: la exponencial multiplica y el polinomio no. Se ven las dos curvas; se arrastran
// banderas a los x (enteros, x ≥ 0) donde valen lo mismo.
// params = { rounds: [{ b, g: 'sq' | 'lin' | 'plus1', zeros: [..] }] }   state = { rounds: [{ marks: [..] }] }   (x de 0 a 6)
GAMES['cruce-potencias'] = (() => {
  const G2 = { sq: x => x * x, lin: x => 2 * x, plus1: x => x + 1 }, GT = { sq: 'x^2', lin: '2x', plus1: 'x + 1' };
  const ok = (s, r) => [...s.marks].sort((a, b) => a - b).join() === [...r.zeros].sort((a, b) => a - b).join();
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ marks: [] }),
    ok,
    answered: s => s.marks.length > 0,
    solution: r => `x = ${r.zeros.join(' y x = ')}`,
    prompt: r => `¿Dónde valen lo mismo $${r.b}^x$ y $${GT[r.g]}$?`,
    foot: () => 'Arrastra banderas a los cruces; fuera de la recta se quitan',
    layout(G) { G.b = { x: 16, y: 98, w: G.W - 32, h: G.H * 0.46 }; G.src = { x: G.W / 2 - 34, y: G.b.y + G.b.h + 10, w: 68, h: 30 }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { marks: r.zeros } : G.s, V = { x0: 0, x1: 6, y0: 0, y1: 40 }, M = G.M = RK.plane(p, C, G.b, V, { step: 2 });
      RK.curve(p, G.b, M, V, x => r.b ** x, C.sky, 2.6); RK.curve(p, G.b, M, V, G2[r.g], C.coral, 2.6);
      TK.label(p, C, `$${r.b}^x$`, M.X(5.2), M.Y(Math.min(36, r.b ** 5.2)) + 14, C.sky, 12, 40);
      s.marks.forEach(u => { const x = M.X(u), y = M.Y(0); p.stroke(C.ink); p.strokeWeight(2); p.line(x, y, x, y - 26); p.noStroke(); p.fill(C.brand); p.triangle(x, y - 26, x + 14, y - 21, x, y - 16); });
      RK.chip(p, C, G.src, 'bandera', { on: true, col: C.brand, size: 10 });
      if (G.drag) { p.noStroke(); p.fill(C.brand); p.triangle(G.drag.x, G.drag.y - 10, G.drag.x + 14, G.drag.y - 5, G.drag.x, G.drag.y); }
      const vals = [...s.marks].sort((a, b) => a - b).map(u => `${r.b}^{${u}} = ${r.b ** u},\\ ${GT[r.g].replace('x', `(${u})`)} = ${G2[r.g](u)}`);
      RK.strip(p, C, G.fb, vals.length ? `$${vals.join(';\\ ')}$` : '$\\text{sin banderas}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 13 });
    },
    press(G, x, y) {
      if (hitBox(G.src, x, y)) { G.drag = { from: null, x, y }; return true; }
      const u = Math.round(G.M.iX(x)); if (Math.abs(y - G.M.Y(0) + 14) < 22 && G.s.marks.includes(u)) { G.drag = { from: u, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const u = Math.max(0, Math.min(6, Math.round(G.M.iX(x)))), m = G.s.marks;
      if (d.from != null) m.splice(m.indexOf(d.from), 1);
      if (Math.abs(y - G.M.Y(0)) < 40 && !m.includes(u) && m.length < 3) m.push(u);
      G.touch();
    },
    demo: G => ({ from: { x: G.src.x + 34, y: G.src.y + 15 }, to: { x: G.M.X([6, 5, 3].find(u => !G.r.zeros.includes(u))), y: G.M.Y(0) }, text: 'Arrastra una bandera', ty: G.src.y + 46 }),
    peek: G => ({ b: G.b, M: G.M, src: G.src }),
  });
  return Object.assign(game, { answer: r => ({ marks: r.zeros }) });
})();
