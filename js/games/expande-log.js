// Abrir un logaritmo (Álgebra, alg-72; spec 2026-11-18-algebra-revision): el logaritmo convierte productos en sumas,
// cocientes en restas y exponentes en factores. El logaritmo se abre en un término por cada factor; se arrastra a cada
// término su coeficiente desde la bandeja (lo que multiplica, con signo).
// params = { rounds: [{ tex, base, parts: [[letra, coef]], tray: [números] }] }   state = { rounds: [{ c: [índice | null] }] }
GAMES['expande-log'] = (() => {
  const lay = G => { const n = G.r.parts.length, w = Math.min(110, (G.W - 30) / n - 8); G.slots = G.r.parts.map((_, i) => ({ i, x: G.W / 2 - (n * (w + 8) - 8) / 2 + i * (w + 8), y: 120, w, h: 54 })); G.ty = G.H * 0.56; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; };
  const ok = (s, r) => r.parts.every((q, i) => s.c[i] != null && Math.abs(r.tray[s.c[i]] - q[1]) < 1e-9);
  const answer = r => ({ c: r.parts.map(q => r.tray.findIndex(v => Math.abs(v - q[1]) < 1e-9)) });
  const ct = v => (v === 0.5 ? '\\tfrac12' : v === -0.5 ? '-\\tfrac12' : String(v));
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ c: r.parts.map(() => null) }),
    ok,
    answered: s => s.c.some(v => v != null),
    solution: r => r.parts.map(q => `${q[1]}·log ${q[0]}`).join(' + '),
    prompt: r => `Abre $${r.tex}$ en una suma de logaritmos`,
    foot: () => 'Arrastra a cada término lo que lo multiplica (con su signo)',
    layout: G => lay(G),
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, lg = r.base ? `\\log_{${r.base}}` : '\\log';
      G.slots.forEach((b, i) => { const v = s.c[i], good = v != null && Math.abs(r.tray[v] - r.parts[i][1]) < 1e-9; RK.chip(p, C, b, `$${v == null ? '\\square' : ct(r.tray[v])}\\cdot ${lg} ${r.parts[i][0]}$`, { on: v != null, col: v == null ? C.line : G.locked ? (good ? C.ok : C.bad) : C.sky, size: 13 }); });
      const n = r.tray.length, w = Math.min(46, (G.W - 20) / n - 5);
      G.cards = r.tray.map((v, i) => ({ i, x: G.W / 2 - (n * (w + 5) - 5) / 2 + i * (w + 5), y: G.ty, w, h: 36 }));
      G.cards.forEach(b => RK.chip(p, C, b, `$${ct(r.tray[b.i])}$`, { size: 12 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, `$${ct(r.tray[G.drag.i])}$`, { on: true, size: 12 });
      const sum = r.parts.map((q, i) => { const v = s.c[i] == null ? null : r.tray[s.c[i]]; return v == null ? `\\square\\,${lg} ${q[0]}` : `${v < 0 ? '-' : '+'} ${ct(Math.abs(v))}\\,${lg} ${q[0]}`; }).join(' ').replace(/^\+ /, '');
      RK.strip(p, C, G.fb, `$${sum}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const b = (G.cards || []).find(b => hitBox(b, x, y)); if (b) { G.drag = { i: b.i, x, y }; return true; }
      const sl = G.slots.find(b => hitBox(b, x, y)); if (sl && G.s.c[sl.i] != null) { G.s.c[sl.i] = null; G.touch(); return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const sl = G.slots.find(b => hitBox({ x: b.x - 6, y: b.y - 12, w: b.w + 12, h: b.h + 24 }, x, y)); if (sl) { G.s.c[sl.i] = d.i; G.touch(); } },
    demo(G) { const b = G.cards?.[0], sl = G.slots[0]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 18 }, to: { x: sl.x + 18, y: sl.y + 27 }, text: 'Arrastra el coeficiente', ty: G.ty + 56 } : null; },
    peek: G => ({ cards: G.cards, slots: G.slots }),
  });
  return Object.assign(game, { answer });
})();
