// Llena la tabla sintética (Álgebra, alg-92; spec 2026-11-18-algebra-revision): la división sintética entre x − c. Arriba
// van los coeficientes; se baja el primero y en cada columna se multiplica por c el último de abajo y se suma. Las
// casillas de abajo están vacías; se arrastran fichas de la bandeja a cada una. La última es el residuo.
// params = { rounds: [{ coef: [..], c, extra: [números de más] }] }   state = { rounds: [{ cells: [índice de ficha | null] }] }
GAMES['llena-sintetica'] = (() => {
  const bottom = r => { const o = [r.coef[0]]; for (let i = 1; i < r.coef.length; i++) o.push(r.coef[i] + r.c * o[i - 1]); return o; };
  const chips = r => [...bottom(r), ...r.extra].sort((a, b) => a - b);
  const ok = (s, r) => s.cells.every((c, i) => c != null && chips(r)[c] === bottom(r)[i]);
  const answer = r => { const ch = chips(r), used = new Set(); return { cells: bottom(r).map(v => { const i = ch.findIndex((x, k) => x === v && !used.has(k)); used.add(i); return i; }) }; };
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ cells: r.coef.map(() => null) }),
    ok,
    answered: s => s.cells.some(c => c != null),
    solution: r => `abajo: ${bottom(r).join(', ')}; residuo ${bottom(r).at(-1)}`,
    prompt: r => `Divide entre $x ${r.c < 0 ? '+' : '-'} ${Math.abs(r.c)}$: llena la fila de abajo`,
    foot: () => 'Baja el primero; luego multiplica por c el de abajo y súmalo a la columna siguiente',
    layout(G) { const n = G.r.coef.length; G.cw = Math.min(56, (G.W - 70) / n); G.x0 = 60; G.y1 = 120; G.y2 = 160; G.y3 = 206; G.trayY = G.H - 134; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.drag = null; const n = G.r.coef.length; G.cw = Math.min(56, (G.W - 70) / n); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, ch = chips(r), B = bottom(r), n = r.coef.length, cw = G.cw = Math.min(56, (G.W - 70) / n);
      TK.label(p, C, String(r.c), 30, G.y1 + 14, C.brand, 16, 30);
      p.stroke(C.ink); p.strokeWeight(2); p.line(48, G.y1 - 6, 48, G.y3 + 30); p.line(48, G.y3 - 6, G.x0 + n * cw, G.y3 - 6);
      G.slots = [];
      r.coef.forEach((k, i) => {
        const x = G.x0 + i * cw;
        TK.label(p, C, String(k), x + cw / 2, G.y1 + 14, C.ink, 14, cw);
        if (i > 0) { const prev = s.cells[i - 1] != null ? ch[s.cells[i - 1]] : null; TK.label(p, C, prev == null ? '·' : String(prev * r.c), x + cw / 2, G.y2 + 10, C.mute, 12, cw); }
        const b = { x: x + 3, y: G.y3, w: cw - 6, h: 32, i };
        G.slots.push(b);
        if (s.cells[i] == null || G.drag?.from === i) { p.noFill(); p.stroke(i === n - 1 ? C.coral : C.brand); p.drawingContext.setLineDash([3, 3]); p.rect(b.x, b.y, b.w, b.h, 6); p.drawingContext.setLineDash([]); }
        else RK.chip(p, C, b, String(ch[s.cells[i]]), { on: true, col: i === n - 1 ? C.coral : C.mint, size: 13 });
      });
      TK.label(p, C, 'residuo', G.x0 + (n - 0.5) * cw, G.y3 + 46, C.coral, 10, 60);
      const free = ch.map((_, i) => i).filter(i => !s.cells.includes(i)), w = Math.min(44, (G.W - 20) / Math.max(1, free.length) - 4);
      G.tray = free.map((i, j) => ({ i, x: G.W / 2 - (free.length * (w + 4) - 4) / 2 + j * (w + 4), y: G.trayY, w, h: 30 }));
      G.tray.forEach(b => { if (!(G.drag?.c === b.i && G.drag.from == null)) RK.chip(p, C, b, String(ch[b.i]), { size: 12 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 20, y: G.drag.y - 15, w: 40, h: 30 }, String(ch[G.drag.c]), { on: true, size: 12 });
      const filled = s.cells.every(c => c != null);
      RK.strip(p, C, G.fb, filled ? `$\\text{cociente: } ${s.cells.slice(0, -1).map(c => ch[c]).join(',\\ ')}\\quad R = ${ch[s.cells.at(-1)]}$` : '$\\text{llena la fila de abajo}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { c: t.i, from: null, x, y }; return true; }
      const sl = (G.slots || []).find(b => hitBox(b, x, y) && G.s.cells[b.i] != null); if (sl) { G.drag = { c: G.s.cells[sl.i], from: sl.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const sl = (G.slots || []).find(b => hitBox({ x: b.x - 4, y: b.y - 8, w: b.w + 8, h: b.h + 16 }, x, y));
      if (d.from != null) G.s.cells[d.from] = null;
      if (sl) G.s.cells[sl.i] = d.c;
      G.touch();
    },
    demo(G) { const t = G.tray?.[0], sl = G.slots?.[0]; return t && sl ? { from: { x: t.x + t.w / 2, y: t.y + 15 }, to: { x: sl.x + sl.w / 2, y: sl.y + 16 }, text: 'Arrastra a la fila de abajo', ty: G.trayY - 18 } : null; },
    peek: G => ({ tray: G.tray, slots: G.slots }),
  });
  return Object.assign(game, { bottom, answer });
})();
