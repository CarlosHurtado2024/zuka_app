// La fracción compuesta (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): una fracción que tiene fracciones adentro se
// simplifica multiplicando arriba y abajo por el común denominador de las fracciones de adentro. Se arrastra una ficha
// multiplicadora sobre la fracción grande; el juego multiplica y muestra qué queda. Con la ficha justa no queda ninguna
// fracción adentro y sale la expresión simple.
// params = { rounds: [{ tex, chips: [tex], good, res, why: [texto por ficha] }] }   state = { rounds: [{ m }] }   (índice de la ficha)
GAMES['fraccion-compuesta'] = (() => {
  const ok = (s, r) => s.m === r.good;
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ m: null }),
    ok,
    answered: s => s.m != null,
    solution: r => `× ${r.chips[r.good]}: ${r.res.replace(/\\[a-z]+|[{}]/g, '')}`,
    prompt: () => 'Simplifica la fracción compuesta',
    foot: () => 'Arrastra una ficha sobre la fracción: multiplica arriba y abajo',
    layout(G) { G.box = { x: 30, y: 104, w: G.W - 60, h: 104 }; G.cy = G.H * 0.6; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { m: r.good } : G.s;
      p.stroke(s.m == null ? C.line : ok(s, r) ? C.ok : C.coral); p.strokeWeight(1.4); p.fill(RK.al(p, C.card, 200)); p.rect(G.box.x, G.box.y, G.box.w, G.box.h, 12);
      TK.label(p, C, `$${r.tex}$`, G.W / 2, G.box.y + G.box.h / 2, C.ink, 17, G.box.w - 20);
      if (s.m != null) RK.chip(p, C, { x: G.box.x + G.box.w - 62, y: G.box.y + 6, w: 56, h: 28 }, `$\\times ${r.chips[s.m]}$`, { on: true, col: C.brand, size: 12 });
      const n = r.chips.length, w = Math.min(64, (G.W - 20) / n - 8);
      G.cards = r.chips.map((_, i) => ({ i, x: G.W / 2 - (n * (w + 8) - 8) / 2 + i * (w + 8), y: G.cy, w, h: 36 }));
      G.cards.forEach(b => RK.chip(p, C, b, `$${r.chips[b.i]}$`, { size: 13 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, `$${r.chips[G.drag.i]}$`, { on: true, size: 13 });
      RK.strip(p, C, G.fb, s.m == null ? '$\\text{elige el multiplicador}$' : ok(s, r) ? `$= ${r.res}$` : `$\\text{${r.why[s.m]}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const b = (G.cards || []).find(b => hitBox(b, x, y)); if (!b) return false; G.drag = { i: b.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; if (hitBox({ x: G.box.x - 10, y: G.box.y - 20, w: G.box.w + 20, h: G.box.h + 40 }, x, y)) { G.s.m = d.i; G.touch(); } },
    demo(G) { const b = G.cards?.[G.cards.length - 1]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 18 }, to: { x: G.W / 2, y: G.box.y + G.box.h / 2 }, text: 'Arrastra sobre la fracción', ty: G.cy + 54 } : null; },
    peek: G => ({ cards: G.cards, box: G.box }),
  });
  return game;
})();
