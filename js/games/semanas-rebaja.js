// Semana a semana (Álgebra, alg-13d; spec 2026-11-18-algebra-revision): un cambio porcentual repetido es una potencia del
// factor. Cada semana el precio cambia el mismo r %; se arrastra el número de semanas y aparecen las barras de cada
// semana. Hay que encontrar la primera semana en que el precio cruza la línea marcada (la mitad, el 30 %…).
// params = { rounds: [{ r, line }] }   (r en %, negativo = rebaja; line: % del precio inicial)   state = { rounds: [{ n }] }
GAMES['semanas-rebaja'] = (() => {
  const MAX = 12;
  const val = (r, n) => 100 * (1 + r.r / 100) ** n;
  const need = r => { for (let n = 1; n <= MAX; n++) if (r.r < 0 ? val(r, n) < r.line : val(r, n) > r.line) return n; return -1; };
  const ok = (s, r) => s.n === need(r);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ n: 1 }),
    ok,
    solution: r => `semana ${need(r)}: 100 × ${1 + r.r / 100}^${need(r)} ≈ ${val(r, need(r)).toFixed(1)}`,
    prompt: r => `Cada semana ${r.r < 0 ? 'baja' : 'sube'} el ${Math.abs(r.r)} %. ¿Cuándo ${r.r < 0 ? 'baja de' : 'pasa de'} ${r.line}?`,
    foot: () => 'Arrastra las semanas: busca la primera que cruza la línea',
    layout(G) { G.base = G.H - 150; G.top = 104; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, top = Math.max(100, val(r, MAX), r.line) * 1.05, Y = v => G.base - (G.base - G.top) * v / top, w = (G.W - 40) / (MAX + 1);
      for (let k = 0; k <= n; k++) { const v = val(r, k), cross = r.r < 0 ? v < r.line : v > r.line; p.noStroke(); p.fill(k === 0 ? C.line : cross ? C.coral : C.sky); p.rect(20 + k * w + 2, Y(v), w - 4, G.base - Y(v), 3); }
      p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.line(16, Y(r.line), G.W - 16, Y(r.line)); p.drawingContext.setLineDash([]); TK.label(p, C, String(r.line), G.W - 22, Y(r.line) - 10, C.ok, 11, 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, MAX, n - 1, i => ((i + 1) % 2 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$100 \\times ${1 + r.r / 100}^{${n}} \\approx ${val(r, n).toFixed(1)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n - 1), y: G.tY }, to: { x: G.X(G.s.n + 3), y: G.tY }, text: 'Arrastra las semanas', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, MAX) + 1; if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need, val });
})();
