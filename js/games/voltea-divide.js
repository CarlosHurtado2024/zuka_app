// Dividir fracciones (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): dividir entre una fracción es multiplicar por
// su recíproca. La segunda fracción se arrastra al volteador (cambia arriba por abajo) y luego al signo ×; entonces se
// cancelan los factores comunes y se ve el resultado. Si se multiplica sin voltear, el resultado sale mal.
// params = { rounds: [{ a: [num, den], b: [num, den], res }] }   (factores en TeX)   state = { rounds: [{ flip, mult }] }
GAMES['voltea-divide'] = (() => {
  const ok = s => s.flip && s.mult;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ flip: false, mult: false }),
    ok,
    answered: s => s.flip || s.mult,
    solution: r => r.res.replace(/\\[a-z]+|[{}]/g, ''),
    prompt: r => `Divide: $\\dfrac{${r.a[0]}}{${r.a[1]}} \\div \\dfrac{${r.b[0]}}{${r.b[1]}}$`,
    foot: (r, s) => (!s.flip ? 'Arrastra la segunda fracción al volteador' : !s.mult ? 'Ahora arrástrala junto a la primera para multiplicar' : 'Dividir es multiplicar por la recíproca'),
    layout(G) { G.f1 = { x: 16, y: 110, w: G.W / 2 - 24, h: 80 }; G.f2 = { x: G.W / 2 + 8, y: 110, w: G.W / 2 - 24, h: 80 }; G.flipB = { x: G.W / 2 - 60, y: 220, w: 120, h: 40 }; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s) ? { flip: true, mult: true } : G.s, b = s.flip ? [r.b[1], r.b[0]] : r.b;
      RK.chip(p, C, G.f1, `$\\dfrac{${r.a[0]}}{${r.a[1]}}$`, { on: true, col: C.sky, size: 16 });
      TK.label(p, C, s.mult ? '×' : '÷', G.W / 2, 150, C.ink, 20, 20);
      if (!G.drag) RK.chip(p, C, G.f2, `$\\dfrac{${b[0]}}{${b[1]}}$`, { on: true, col: s.flip ? C.mint : C.coral, size: 16 });
      p.stroke(C.brand); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 22)); p.rect(G.flipB.x, G.flipB.y, G.flipB.w, G.flipB.h, 10); TK.label(p, C, 'volteador', G.flipB.x + 60, G.flipB.y + 20, C.ink, 11, 100);
      if (G.drag) RK.chip(p, C, { x: G.drag.x - G.f2.w / 2, y: G.drag.y - 40, w: G.f2.w, h: 80 }, `$\\dfrac{${b[0]}}{${b[1]}}$`, { on: true, size: 16 });
      RK.strip(p, C, G.fb, s.mult ? (s.flip ? `$${r.res}$` : '$\\text{¡sin voltear no es dividir!}$') : '$\\text{voltea y multiplica}$', { col: G.locked || ok(G.s) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (!hitBox(G.f2, x, y)) return false; G.drag = { x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      if (hitBox(G.flipB, x, y)) { G.s.flip = !G.s.flip; G.s.mult = false; G.touch(); return; }
      if (hitBox({ x: G.f1.x - 10, y: G.f1.y - 10, w: G.f1.w + 30, h: G.f1.h + 20 }, x, y)) { G.s.mult = true; G.touch(); }
    },
    demo: G => ({ from: { x: G.f2.x + G.f2.w / 2, y: G.f2.y + 40 }, to: { x: G.flipB.x + 60, y: G.flipB.y + 20 }, text: 'Primero al volteador', ty: G.flipB.y - 14 }),
    peek: G => ({ f1: G.f1, f2: G.f2, flipB: G.flipB }),
  });
  return game;
})();
