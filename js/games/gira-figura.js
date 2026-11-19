// Girar una figura (Preuniversitario, pu-es-4; spec 2026-11-18-preuda-razonamiento-completo): girar no le cambia la «mano» a
// una figura; solo cambia hacia dónde mira. A la izquierda está la figura pedida; a la derecha, la misma figura en otra
// posición. Se arrastra alrededor de la de la derecha para girarla de cuarto en cuarto de vuelta hasta que coincidan.
// params = { rounds: [{ cells: [[x, y]], k }] }   (la figura pedida es la de la derecha girada k cuartos)   state = { rounds: [{ q }] }
GAMES['gira-figura'] = (() => {
  const rot = (cells, q) => { let c = cells.map(p => [...p]); for (let i = 0; i < ((q % 4) + 4) % 4; i++) c = c.map(([x, y]) => [-y, x]); const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const ok = (s, r) => same(rot(r.cells, s.q), rot(r.cells, r.k));
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ q: same(rot(r.cells, 0), rot(r.cells, r.k)) ? 1 : 0 }),
    ok,
    solution: r => `${r.k} cuarto${r.k === 1 ? '' : 's'} de vuelta`,
    prompt: () => 'Gira la figura de la derecha hasta que quede como la otra',
    foot: () => 'Arrastra alrededor de la figura de la derecha para girarla',
    layout(G) { G.cL = { x: G.W * 0.27, y: 190 }; G.cR = { x: G.W * 0.73, y: 190 }; G.u = Math.min(22, G.W * 0.06); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { q: r.k } : G.s, good = ok(s, r), u = G.u;
      const shape = (cells, c, col) => { const w = Math.max(...cells.map(q => q[0])) + 1, h = Math.max(...cells.map(q => q[1])) + 1; cells.forEach(([x, y]) => { p.stroke(C.bg); p.strokeWeight(1.5); p.fill(col); p.rect(c.x - w * u / 2 + x * u, c.y - h * u / 2 + y * u, u, u, 2); }); };
      shape(rot(r.cells, r.k), G.cL, C.sky);
      p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 4]); p.circle(G.cR.x, G.cR.y, 130); p.drawingContext.setLineDash([]);
      shape(rot(r.cells, s.q), G.cR, good ? C.ok : C.coral);
      TK.label(p, C, 'así', G.cL.x, G.cL.y + 80, C.mute, 10, 40); TK.label(p, C, '↻ gírala', G.cR.x, G.cR.y + 80, C.mute, 10, 60);
      RK.strip(p, C, G.fb, good ? '$\\text{coinciden}$' : `$\\text{girada ${((s.q % 4) + 4) % 4} cuartos}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.hypot(x - G.cR.x, y - G.cR.y) > 90) return false; G.grab = true; G.a0 = Math.atan2(y - G.cR.y, x - G.cR.x); G.q0 = G.s.q; return true; },
    drag(G, x, y) { if (!G.grab) return false; const a = Math.atan2(y - G.cR.y, x - G.cR.x), d = Math.round((a - G.a0) / (Math.PI / 2)), q = ((G.q0 + d) % 4 + 4) % 4; if (q !== G.s.q || !G.touched[G.cur]) { G.s.q = q; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.cR.x + 60, y: G.cR.y }, to: { x: G.cR.x, y: G.cR.y + 60 }, text: 'Gira la figura', ty: G.cR.y + 100 }),
    peek: G => ({ cR: G.cR }),
  });
  return Object.assign(game, { answer: r => ({ q: r.k }) });
})();
