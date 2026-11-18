// ¿Dónde cae cada potencia? (Álgebra, alg-21a; spec 2026-11-18-algebra-revision): una potencia es un número; calcularla
// permite compararla. Fichas con potencias se arrastran a su lugar en una recta numérica (una base más grande no siempre
// gana: 2⁵ > 5²). Cada ficha queda a su valor; hay que ubicarlas todas.
// params = { rounds: [{ chips: [[tex, valor]], max, snap }] }   state = { rounds: [{ pos: [x | null] }] }
GAMES['ubica-potencias'] = (() => {
  const ok = (s, r) => r.chips.every(([, v], i) => s.pos[i] != null && Math.abs(s.pos[i] - v) <= r.snap / 2 + 1e-9);
  const answer = r => ({ pos: r.chips.map(c => c[1]) });
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ pos: r.chips.map(() => null) }),
    ok,
    answered: s => s.pos.some(v => v != null),
    solution: r => r.chips.map(([t, v]) => `${t.replace(/[{}]/g, '')} = ${v}`).join(', '),
    prompt: () => 'Lleva cada potencia a su lugar en la recta',
    foot: () => 'Arrastra cada ficha a su valor; arrástrala otra vez para moverla',
    layout(G) { G.ly = G.H * 0.5; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, x0 = 22, x1 = G.W - 22, X = v => x0 + v / r.max * (x1 - x0);
      p.stroke(C.ink); p.strokeWeight(1.6); p.line(x0, G.ly, x1, G.ly);
      const st = r.max / 10; for (let k = 0; k <= 10; k++) { const v = +(k * st).toFixed(4); p.strokeWeight(1); p.line(X(v), G.ly - 5, X(v), G.ly + 5); if (k % 2 === 0) TK.label(p, C, String(v), X(v), G.ly + 16, C.mute, 9, 34); }
      const w = Math.min(56, (G.W - 30) / r.chips.length - 6);
      // Las fichas puestas se escalonan en tres alturas según su orden en la recta, para que las cercanas no se tapen.
      const rank = r.chips.map((_, i) => i).filter(i => s.pos[i] != null).sort((a, b) => s.pos[a] - s.pos[b]);
      G.cards = r.chips.map(([t], i) => (s.pos[i] == null ? { i, x: G.W / 2 - (r.chips.length * (w + 6) - 6) / 2 + i * (w + 6), y: G.ly + 34, w, h: 36 } : { i, x: X(s.pos[i]) - w / 2, y: G.ly - 46 - (rank.indexOf(i) % 3) * 34, w, h: 30, at: true }));
      G.cards.forEach(b => { if (G.drag?.i === b.i) return; if (b.at) { p.stroke(C.brand); p.strokeWeight(1.4); p.line(b.x + w / 2, b.y + b.h, b.x + w / 2, G.ly); } const good = b.at && Math.abs(s.pos[b.i] - r.chips[b.i][1]) <= r.snap / 2 + 1e-9; RK.chip(p, C, b, `$${r.chips[b.i][0]}$`, { on: !!b.at, col: G.locked ? (good ? C.ok : C.bad) : C.sky, size: 13 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, `$${r.chips[G.drag.i][0]}$`, { on: true, size: 13 });
      const n = s.pos.filter(v => v != null).length;
      RK.strip(p, C, G.fb, `$\\text{${n} de ${r.chips.length} ubicadas}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const b = (G.cards || []).find(b => hitBox(b, x, y)); if (!b) return false; G.drag = { i: b.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const r = G.r, x0 = 22, x1 = G.W - 22;
      if (Math.abs(y - G.ly) < 60) { const v = Math.max(0, Math.min(r.max, Math.round((x - x0) / (x1 - x0) * r.max / r.snap) * r.snap)); G.s.pos[d.i] = +v.toFixed(4); } else G.s.pos[d.i] = null;
      G.touch();
    },
    demo(G) { const b = G.cards?.[0]; return b && !b.at ? { from: { x: b.x + b.w / 2, y: b.y + 18 }, to: { x: G.W * 0.8, y: G.ly }, text: 'Arrastra a la recta', ty: G.ly - 30 } : null; },
    peek: G => ({ cards: G.cards, ly: G.ly }),
  });
  return Object.assign(game, { answer });
})();
