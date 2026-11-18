// Bajar el exponente con logaritmos (Álgebra, alg-73; spec 2026-11-18-algebra-revision): si en bˣ = N no se pueden igualar
// las bases, se toma logaritmo a los dos lados y el exponente baja: x·log b = log N, y luego se divide. Se arrastran
// operaciones a la ecuación; cada una se aplica a los dos lados y escribe un renglón nuevo. Tocar el último renglón lo
// deshace.
// params = { rounds: [{ b, N }] }   state = { rounds: [{ seq: [índices de OPS] }] }
GAMES['baja-con-log'] = (() => {
  const OPS = ['log', 'divb', 'divN', 'minb'];
  const ok = s => s.seq.join() === '0,1';
  const x = r => Math.log(r.N) / Math.log(r.b);
  const chipTex = (r, i) => ['\\log\\ \\text{a los dos lados}', `\\div \\log ${r.b}`, `\\div \\log ${r.N}`, `- \\log ${r.b}`][i];
  // Renglón que resulta de aplicar la lista de operaciones.
  const lines = (r, seq) => {
    const out = [`${r.b}^{x} = ${r.N}`]; let st = 'exp';
    seq.forEach(i => {
      if (st === 'exp' && i === 0) { st = 'lin'; out.push(`x \\log ${r.b} = \\log ${r.N}`); }
      else if (st === 'lin' && i === 1) { st = 'done'; out.push(`x = \\dfrac{\\log ${r.N}}{\\log ${r.b}} \\approx ${x(r).toFixed(2)}`); }
      else if (st === 'lin' && i === 2) { st = 'bad'; out.push(`\\dfrac{x \\log ${r.b}}{\\log ${r.N}} = 1\\ \\ (\\text{x sigue acompañada})`); }
      else if (st === 'lin' && i === 3) { st = 'bad'; out.push(`x \\log ${r.b} - \\log ${r.b} = \\log ${r.N} - \\log ${r.b}`); }
      else { st = 'bad'; out.push(`\\text{esa operación no despeja x}`); }
    });
    return out;
  };
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ seq: [] }),
    ok,
    answered: s => s.seq.length > 0,
    solution: r => `log a los dos lados y ÷ log ${r.b}: x ≈ ${x(r).toFixed(2)}`,
    prompt: r => `Resuelve $${r.b}^x = ${r.N}$`,
    foot: () => 'Arrastra operaciones; toca el último renglón para deshacer',
    layout(G) { G.ly = 100; G.cy = G.H - 196; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s) ? { seq: [0, 1] } : G.s, L = lines(r, s.seq);
      G.rows = L.map((t, i) => { const b = { x: 16, y: G.ly + i * 44, w: G.W - 32, h: 38 }; RK.chip(p, C, b, `$${t}$`, { on: true, col: i === L.length - 1 ? (ok(s) ? C.ok : C.sky) : C.line, size: 14 }); return b; });
      G.board = { x: 16, y: G.ly, w: G.W - 32, h: L.length * 44 + 30 };
      const w = (G.W - 40) / 2 - 4;
      G.cards = OPS.map((_, i) => ({ i, x: 20 + (i % 2) * (w + 8), y: G.cy + Math.floor(i / 2) * 44, w, h: 36 }));
      G.cards.forEach(b => { if (G.drag?.i !== b.i) RK.chip(p, C, b, `$${chipTex(r, b.i)}$`, { size: 12 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, `$${chipTex(r, G.drag.i)}$`, { on: true, size: 12 });
      RK.strip(p, C, G.fb, ok(s) ? `$x \\approx ${x(r).toFixed(2)}:\\ ${r.b}^{${x(r).toFixed(2)}} \\approx ${r.N}$` : '$\\text{deja la x sola}$', { col: G.locked || ok(G.s) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const b = (G.cards || []).find(b => hitBox(b, x, y)); if (b) { G.drag = { i: b.i, x, y }; return true; }
      const last = G.rows?.[G.rows.length - 1]; if (G.s.seq.length && last && hitBox(last, x, y)) { G.s.seq.pop(); G.touch(); return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; if (hitBox(G.board, x, y) && G.s.seq.length < 2) { G.s.seq.push(d.i); G.touch(); } },
    demo(G) { const b = G.cards?.[0]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 18 }, to: { x: G.W / 2, y: G.ly + 20 }, text: 'Arrastra a la ecuación', ty: G.cy - 20 } : null; },
    peek: G => ({ cards: G.cards, rows: G.rows, board: G.board }),
  });
  return game;
})();
