// Contar por el complemento (Preuniversitario, pu-co-4; spec 2026-11-18-preuda-razonamiento-completo): «al menos uno» es más
// fácil al revés: todos los casos menos los que no tienen ninguno. Dos filas de casillas: arriba el total (sin condición) y
// abajo los casos que NO sirven; se arrastran las opciones de cada casilla y el juego resta.
// params = { rounds: [{ slots: [rótulo], all: [n], none: [n], tray: [n], ask }] }
// state = { rounds: [{ a: [índice | null], b: [índice | null] }] }
GAMES['complemento-conteo'] = (() => {
  const P = l => l.reduce((x, y) => x * y, 1);
  const fit = (put, tray, want) => want.every((w, i) => put[i] != null && tray[put[i]] === w);
  const ok = (s, r) => fit(s.a, r.tray, r.all) && fit(s.b, r.tray, r.none);
  const pick = (r, want) => want.map(w => r.tray.indexOf(w));
  const answer = r => ({ a: pick(r, r.all), b: pick(r, r.none) });
  const lay = G => { const n = G.r.slots.length, w = Math.min(54, (G.W - 120) / n - 6); G.rowA = G.r.slots.map((_, i) => ({ i, x: 104 + i * (w + 6), y: 128, w, h: 40 })); G.rowB = G.rowA.map(b => ({ ...b, y: 196 })); };
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ a: r.slots.map(() => null), b: r.slots.map(() => null) }),
    ok,
    answered: s => s.a.some(v => v != null) || s.b.some(v => v != null),
    solution: r => `${P(r.all)} − ${P(r.none)} = ${P(r.all) - P(r.none)}`,
    prompt: r => r.ask,
    foot: () => 'Arrastra fichas: arriba todos los casos, abajo los que no sirven',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
      TK.label(p, C, 'todos', 50, 148, C.ink, 11, 80); TK.label(p, C, 'no sirven', 50, 216, C.coral, 11, 80);
      r.slots.forEach((t, i) => TK.label(p, C, t, G.rowA[i].x + G.rowA[i].w / 2, 116, C.mute, 9, G.rowA[i].w + 4));
      [['a', G.rowA, C.sky], ['b', G.rowB, C.coral]].forEach(([k, row, col]) => row.forEach(b => { const v = s[k][b.i]; if (v != null && !(G.drag && G.drag.k === k && G.drag.from === b.i)) RK.chip(p, C, b, String(r.tray[v]), { on: true, col: good ? C.ok : col, size: 14 }); else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); } }));
      const w = Math.min(48, (G.W - 20) / r.tray.length - 6);
      G.tbox = r.tray.map((v, i) => ({ i, x: G.W / 2 - (r.tray.length * (w + 6) - 6) / 2 + i * (w + 6), y: G.H - 112, w, h: 32 }));
      G.tbox.forEach(b => RK.chip(p, C, b, String(r.tray[b.i]), { size: 13, col: C.mint }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 16, w, h: 32 }, String(r.tray[G.drag.i]), { on: true, col: C.brand, size: 13 });
      const full = k => s[k].every(v => v != null), A = full('a') ? P(s.a.map(v => r.tray[v])) : null, B = full('b') ? P(s.b.map(v => r.tray[v])) : null;
      RK.strip(p, C, G.fb, A != null && B != null ? `$${A} - ${B} = ${A - B}$` : '$\\text{todos} - \\text{los que no sirven}$', { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) {
      const t = (G.tbox || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { i: t.i, k: null, from: -1, x, y }; return true; }
      for (const [k, row] of [['a', G.rowA], ['b', G.rowB]]) { const b = row.find(b => hitBox(b, x, y)); if (b && G.s[k][b.i] != null) { G.drag = { i: G.s[k][b.i], k, from: b.i, x, y }; return true; } }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      if (d.k) G.s[d.k][d.from] = null;
      for (const [k, row] of [['a', G.rowA], ['b', G.rowB]]) { const b = row.find(b => hitBox({ x: b.x - 3, y: b.y - 8, w: b.w + 6, h: b.h + 16 }, x, y)); if (b) G.s[k][b.i] = d.i; }
      G.touch();
    },
    demo(G) { const t = G.tbox?.[0], b = G.rowB[0]; return t ? { from: { x: t.x + t.w / 2, y: t.y + 16 }, to: { x: b.x + b.w / 2, y: b.y + 20 }, text: 'Arrastra a una casilla', ty: t.y - 12 } : null; },
    peek: G => ({ rowA: G.rowA, rowB: G.rowB, tray: G.tbox }),
  });
  return Object.assign(game, { answer });
})();
