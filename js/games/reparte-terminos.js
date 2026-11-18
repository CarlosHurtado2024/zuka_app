// Dividir un polinomio entre un monomio (Álgebra, alg-23b; spec 2026-11-18-algebra-revision): el divisor reparte: cada
// término se divide por separado (números entre números, exponentes que se restan). Bajo cada término del dividendo hay
// una casilla; se arrastra a cada una su cociente desde la bandeja.
// params = { rounds: [{ terms: [tex], d, ans: [tex], tray: [tex] }] }   state = { rounds: [{ put: [índice | null] }] }
GAMES['reparte-terminos'] = (() => {
  const ok = (s, r) => r.ans.every((a, i) => s.put[i] != null && r.tray[s.put[i]] === a);
  const answer = r => ({ put: r.ans.map(a => r.tray.indexOf(a)) });
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ put: r.terms.map(() => null) }),
    ok,
    answered: s => s.put.some(v => v != null),
    solution: r => r.ans.join(' '),
    prompt: r => `Divide $(${r.terms.join(' ')}) \\div ${r.d}$ término a término`,
    foot: () => 'Arrastra a cada casilla el cociente de su término',
    layout(G) { const n = G.r.terms.length, w = Math.min(90, (G.W - 30) / n - 8); G.slots = G.r.terms.map((_, i) => ({ i, x: G.W / 2 - (n * (w + 8) - 8) / 2 + i * (w + 8), y: 112, w, h: 96 })); G.cy = G.H * 0.6; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; game.lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      G.slots.forEach(b => {
        p.stroke(C.line); p.strokeWeight(1.2); p.fill(RK.al(p, C.card, 200)); p.rect(b.x, b.y, b.w, b.h, 10);
        TK.label(p, C, `$\\dfrac{${r.terms[b.i]}}{${r.d}}$`, b.x + b.w / 2, b.y + 28, C.ink, 14, b.w - 6);
        const v = s.put[b.i], good = v != null && r.tray[v] === r.ans[b.i];
        RK.chip(p, C, { x: b.x + 6, y: b.y + 58, w: b.w - 12, h: 30 }, v == null ? '?' : `$${r.tray[v]}$`, { on: v != null, col: v == null ? C.line : G.locked ? (good ? C.ok : C.bad) : C.sky, size: 13 });
      });
      const n = r.tray.length, w = Math.min(60, (G.W - 20) / n - 6), order = r.tray.map((_, i) => i).sort((a, b) => r.tray[a].replace(/^[+-]/, '').localeCompare(r.tray[b].replace(/^[+-]/, '')) || a - b);
      G.cards = order.map((i, j) => ({ i, x: G.W / 2 - (n * (w + 6) - 6) / 2 + j * (w + 6), y: G.cy, w, h: 36 }));
      G.cards.forEach(b => RK.chip(p, C, b, `$${r.tray[b.i]}$`, { size: 12 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, `$${r.tray[G.drag.i]}$`, { on: true, size: 12 });
      RK.strip(p, C, G.fb, s.put.every(v => v != null) ? `$${s.put.map(v => r.tray[v]).join(' ').replace(/^\+/, '')}$` : '$\\text{llena las casillas}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const b = (G.cards || []).find(b => hitBox(b, x, y)); if (!b) return false; G.drag = { i: b.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const b = G.slots.find(b => hitBox(b, x, y)); if (b) { G.s.put[b.i] = d.i; G.touch(); } },
    demo(G) { const sl = G.slots[0], b = G.cards?.find(c => G.r.tray[c.i] !== G.r.ans[0]); return b ? { from: { x: b.x + b.w / 2, y: b.y + 18 }, to: { x: sl.x + sl.w / 2, y: sl.y + 72 }, text: 'Arrastra a una casilla', ty: G.cy + 54 } : null; },
    peek: G => ({ cards: G.cards, slots: G.slots }),
  });
  game.lay = G => { const n = G.r.terms.length, w = Math.min(90, (G.W - 30) / n - 8); G.slots = G.r.terms.map((_, i) => ({ i, x: G.W / 2 - (n * (w + 8) - 8) / 2 + i * (w + 8), y: 112, w, h: 96 })); };
  return Object.assign(game, { answer });
})();
