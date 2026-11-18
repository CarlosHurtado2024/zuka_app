// Cancela factores (Álgebra, alg-21b; spec 2026-11-18-algebra-revision): dividir potencias de la misma base es cancelar
// por parejas. Arriba hay a copias de x y abajo b copias; se arrastra una de arriba sobre una de abajo y las dos se van
// (x/x = 1). Lo que queda dice el exponente: arriba si a > b, abajo (exponente negativo) si b > a, y 1 si son iguales.
// params = { rounds: [{ a, b, v }] }   (v: la letra)   state = { rounds: [{ k }] }   (parejas canceladas)
GAMES['cancela-pisos'] = (() => {
  const ok = (s, r) => s.k === Math.min(r.a, r.b);
  const res = r => r.a - r.b;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ k: 0 }),
    ok,
    answered: s => s.k > 0,
    solution: r => `${r.v}^${r.a} / ${r.v}^${r.b} = ${r.v}^${res(r)}`,
    prompt: r => `Simplifica $\\dfrac{${r.v}^{${r.a}}}{${r.v}^{${r.b}}}$ cancelando por parejas`,
    foot: () => 'Arrastra una ficha de arriba sobre una de abajo',
    layout(G) { G.yt = G.H * 0.36; G.yb = G.H * 0.56; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, k = G.locked && !ok(G.s, r) ? Math.min(r.a, r.b) : G.s.k, w = Math.min(34, (G.W - 30) / Math.max(r.a, r.b) - 4);
      p.stroke(C.ink); p.strokeWeight(2.5); p.line(20, (G.yt + G.yb) / 2 + 8, G.W - 20, (G.yt + G.yb) / 2 + 8);
      G.top = []; G.bot = [];
      const row = (n, y, list) => { const x0 = G.W / 2 - (n * (w + 4) - 4) / 2; for (let i = 0; i < n; i++) { const b = { x: x0 + i * (w + 4), y: y - 16, w, h: 32, gone: i < k }; list.push(b); if (b.gone) { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([3, 3]); p.rect(b.x, b.y, w, 32, 8); p.drawingContext.setLineDash([]); } else if (!(G.drag && list === G.top && G.drag.i === i)) RK.chip(p, C, b, `$${r.v}$`, { on: true, col: list === G.top ? C.sky : C.coral, size: 15 }); } };
      row(r.a, G.yt, G.top); row(r.b, G.yb + 16, G.bot);
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 16, w, h: 32 }, `$${r.v}$`, { on: true, col: C.brand, size: 15 });
      const ra = r.a - k, rb = r.b - k;
      const tex = `\\dfrac{${r.v}^{${r.a}}}{${r.v}^{${r.b}}} = ${ra && rb ? `\\dfrac{${r.v}^{${ra}}}{${r.v}^{${rb}}}` : ra ? `${r.v}^{${ra}}` : rb ? `\\dfrac{1}{${r.v}^{${rb}}} = ${r.v}^{${-rb}}` : '1'}`;
      RK.strip(p, C, G.fb, `$${tex}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const i = G.top.findIndex(b => !b.gone && hitBox(b, x, y)); if (i < 0) return false; G.drag = { i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; if (G.bot.some(b => !b.gone && hitBox({ x: b.x - 6, y: b.y - 6, w: b.w + 12, h: b.h + 12 }, x, y)) && G.s.k < Math.min(G.r.a, G.r.b)) { G.s.k++; G.touch(); } },
    demo(G) { const a = G.top.find(b => !b.gone), b = G.bot.find(b => !b.gone); return a && b ? { from: { x: a.x + a.w / 2, y: a.y + 16 }, to: { x: b.x + b.w / 2, y: b.y + 16 }, text: 'Arrastra sobre una de abajo', ty: G.yb + 60 } : null; },
    peek: G => ({ top: G.top, bot: G.bot }),
  });
  return game;
})();
