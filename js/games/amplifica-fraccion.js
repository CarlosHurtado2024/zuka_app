// Completa cada fracción (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): para llevar una fracción al común
// denominador se multiplica arriba y abajo por el factor que le falta. Ya está el común denominador; se arrastra a cada
// fracción el factor que le falta (arriba y abajo a la vez), y luego se suman los numeradores.
// params = { rounds: [{ f1: [num, [factores]], f2: [num, [factores]], chips: [..], sum }] }   state = { rounds: [{ m: [índice | null, índice | null] }] }
GAMES['amplifica-fraccion'] = (() => {
  const missing = (r, k) => { const L = GAMES['denominador-comun'].lcd({ d1: r.f1[1], d2: r.f2[1] }), own = [...(k ? r.f2 : r.f1)[1]]; return L.filter(f => { const i = own.indexOf(f); if (i >= 0) { own.splice(i, 1); return false; } return true; }); };
  const ok = (s, r) => [0, 1].every(k => { const need = missing(r, k); return need.length === 0 ? s.m[k] == null : s.m[k] != null && r.chips[s.m[k]] === need[0]; });
  const answer = r => ({ m: [0, 1].map(k => { const need = missing(r, k); return need.length ? r.chips.indexOf(need[0]) : null; }) });
  const mul = fs => GAMES['denominador-comun'].mul(fs);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ m: [null, null] }),
    ok,
    answered: s => s.m.some(v => v != null),
    solution: r => r.sum,
    prompt: r => `Suma $\\dfrac{${r.f1[0]}}{${mul(r.f1[1])}} + \\dfrac{${r.f2[0]}}{${mul(r.f2[1])}}$: completa cada fracción`,
    foot: () => 'Arrastra a cada fracción el factor que le falta',
    layout(G) { G.fr = [0, 1].map(k => ({ x: 16 + k * (G.W - 32) / 2 + 4, y: 108, w: (G.W - 32) / 2 - 8, h: 92 })); G.cy = G.H * 0.6; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      [r.f1, r.f2].forEach((f, k) => {
        const b = G.fr[k], c = s.m[k] == null ? null : r.chips[s.m[k]];
        p.stroke(C.line); p.strokeWeight(1.2); p.fill(RK.al(p, C.card, 220)); p.rect(b.x, b.y, b.w, b.h, 12);
        const tex = c ? `\\dfrac{${f[0]}\\cdot ${c.length > 2 ? `(${c})` : c}}{${mul(f[1])}\\cdot ${c.length > 2 ? `(${c})` : c}}` : `\\dfrac{${f[0]}}{${mul(f[1])}}`;
        TK.label(p, C, `$${tex}$`, b.x + b.w / 2, b.y + b.h / 2, C.ink, 15, b.w - 8);
      });
      const w = Math.min(64, (G.W - 20) / r.chips.length - 6);
      G.cards = r.chips.map((_, i) => ({ i, x: G.W / 2 - (r.chips.length * (w + 6) - 6) / 2 + i * (w + 6), y: G.cy, w, h: 36 }));
      G.cards.forEach(b => { if (G.drag?.i !== b.i) RK.chip(p, C, b, `$${r.chips[b.i]}$`, { size: 13 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, `$${r.chips[G.drag.i]}$`, { on: true, size: 13 });
      RK.strip(p, C, G.fb, ok(s, r) ? `$${r.sum}$` : '$\\text{completa las dos fracciones}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const b = (G.cards || []).find(b => hitBox(b, x, y)); if (b) { G.drag = { i: b.i, x, y }; return true; }
      const k = G.fr.findIndex(f => hitBox(f, x, y)); if (k >= 0 && G.s.m[k] != null) { G.s.m[k] = null; G.touch(); return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const k = G.fr.findIndex(f => hitBox({ x: f.x - 6, y: f.y - 10, w: f.w + 12, h: f.h + 20 }, x, y)); if (k >= 0) { G.s.m[k] = d.i; G.touch(); } },
    demo(G) { const b = G.cards?.[0]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 18 }, to: { x: G.fr[0].x + G.fr[0].w / 2, y: G.fr[0].y + 46 }, text: 'Arrastra a una fracción', ty: G.cy + 56 } : null; },
    peek: G => ({ cards: G.cards, fr: G.fr }),
  });
  return Object.assign(game, { answer });
})();
