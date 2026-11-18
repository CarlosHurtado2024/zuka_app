// Probar y descartar (Preuniversitario, pu-or-1 a pu-or-4; spec 2026-11-18-preuda-razonamiento-completo): cuando las pistas
// dejan pocas posibilidades, se escriben todas y se tachan las que chocan con alguna pista. Hay tarjetas con acomodos
// posibles y fichas con las pistas; se arrastra una pista sobre la tarjeta que la incumple y esa tarjeta queda tachada (si la
// pista sí se cumple en esa tarjeta, no pasa nada). Hay que dejar en pie solo el acomodo que cumple todo.
// params = { rounds: [{ cands: [[nombres]], clues, circ? }] }   state = { rounds: [{ out: [índices de tarjetas tachadas] }] }
GAMES['descarta-casos'] = (() => {
  const good = r => r.cands.findIndex(a => r.clues.every(c => ORD.sat(a, c, !!r.circ)));
  const ok = (s, r) => s.out.length === r.cands.length - 1 && !s.out.includes(good(r));
  const answer = r => ({ out: r.cands.map((_, i) => i).filter(i => i !== good(r)) });
  const lay = G => { const n = G.r.cands.length, w = G.W - 40, h = Math.min(34, (G.H * 0.42) / n - 6); G.cards = G.r.cands.map((_, i) => ({ i, x: 20, y: 100 + i * (h + 6), w, h })); };
  const game = roundsGame({
    aspect: 1.35,
    init: () => ({ out: [] }),
    ok,
    answered: s => s.out.length > 0,
    solution: r => r.cands[good(r)].join(', '),
    prompt: () => 'Tacha cada acomodo con la pista que incumple',
    foot: () => 'Arrastra una pista sobre la tarjeta que la incumple',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      G.cards.forEach(b => { const off = s.out.includes(b.i); RK.chip(p, C, b, r.cands[b.i].join(' · '), { on: !off, col: off ? C.line : ok(s, r) ? C.ok : C.sky, size: 12 }); if (off) { p.stroke(C.bad); p.strokeWeight(2); p.line(b.x + 6, b.y + b.h / 2, b.x + b.w - 6, b.y + b.h / 2); } });
      const y0 = G.cards[G.cards.length - 1].y + 50, n = r.clues.length, w = G.W - 32;
      G.clueBoxes = r.clues.map((c, i) => ({ i, x: 16, y: y0 + i * 30, w, h: 26 }));
      G.clueBoxes.forEach(b => { if (G.drag?.i !== b.i) RK.chip(p, C, b, r.clues[b.i].say, { size: 10, col: C.mint }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 13, w, h: 26 }, r.clues[G.drag.i].say, { on: true, size: 10 });
      RK.strip(p, C, G.fb, `$\\text{quedan ${r.cands.length - s.out.length} de ${r.cands.length}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const b = (G.clueBoxes || []).find(b => hitBox(b, x, y)); if (b) { G.drag = { i: b.i, x, y }; return true; }
      const c = G.cards.find(c => hitBox(c, x, y)); if (c && G.s.out.includes(c.i)) { G.s.out.splice(G.s.out.indexOf(c.i), 1); G.touch(); return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const c = G.cards.find(c => hitBox(c, x, y)); if (!c || G.s.out.includes(c.i)) return;
      if (ORD.sat(G.r.cands[c.i], G.r.clues[d.i], !!G.r.circ) === false) { G.s.out.push(c.i); G.touch(); }
    },
    demo(G) { const b = G.clueBoxes?.[0], c = G.cards?.[0]; return b && c ? { from: { x: b.x + b.w / 2, y: b.y + 13 }, to: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, text: 'Arrastra la pista a una tarjeta', ty: b.y - 12 } : null; },
    peek: G => ({ cards: G.cards, clues: G.clueBoxes }),
  });
  return Object.assign(game, { answer, good });
})();
