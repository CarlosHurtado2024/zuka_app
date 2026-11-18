// Contar códigos casilla por casilla (Preuniversitario, pu-co-1 y pu-co-2; spec 2026-11-18-preuda-razonamiento-completo): en
// un código cada casilla tiene sus opciones; si no se puede repetir, cada casilla tiene una menos que la anterior. Se arrastra
// a cada casilla la ficha con su número de opciones; el juego multiplica.
// params = { rounds: [{ slots: [rótulo], rule, want: [n], tray: [n] }] }   state = { rounds: [{ put: [índice de ficha | null] }] }
GAMES['placas-codigo'] = (() => {
  const ok = (s, r) => r.want.every((w, i) => s.put[i] != null && r.tray[s.put[i]] === w);
  const answer = r => { const used = new Set(); return { put: r.want.map(w => { const i = r.tray.findIndex((t, k) => t === w && !used.has(k)); used.add(i); return i; }) }; };
  const lay = G => { const n = G.r.slots.length, w = Math.min(58, (G.W - 30) / n - 6); G.boxes = G.r.slots.map((_, i) => ({ i, x: G.W / 2 - (n * (w + 6) - 6) / 2 + i * (w + 6), y: 140, w, h: 48 })); };
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ put: r.slots.map(() => null) }),
    ok,
    answered: s => s.put.some(v => v != null),
    solution: r => `${r.want.join(' · ')} = ${r.want.reduce((a, b) => a * b, 1)}`,
    prompt: r => `¿Cuántos códigos hay? ${r.rule}`,
    foot: () => 'Arrastra a cada casilla cuántas opciones tiene',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
      G.boxes.forEach(b => { TK.label(p, C, r.slots[b.i], b.x + b.w / 2, b.y - 10, C.mute, 9, b.w + 6); const v = s.put[b.i]; if (v != null && G.drag?.from !== b.i) RK.chip(p, C, b, String(r.tray[v]), { on: true, col: good ? C.ok : C.sky, size: 15 }); else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); } });
      const free = r.tray.map((_, i) => i).filter(i => !s.put.includes(i) && G.drag?.i !== i), w = Math.min(50, (G.W - 20) / Math.max(1, r.tray.length) - 6);
      G.tbox = free.map((i, j) => ({ i, x: G.W / 2 - (free.length * (w + 6) - 6) / 2 + j * (w + 6), y: G.H - 112, w, h: 34 }));
      G.tbox.forEach(b => RK.chip(p, C, b, String(r.tray[b.i]), { size: 13, col: C.mint }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 17, w, h: 34 }, String(r.tray[G.drag.i]), { on: true, col: C.brand, size: 13 });
      const vals = s.put.map(v => (v == null ? '\\square' : r.tray[v])), tot = s.put.every(v => v != null) ? s.put.reduce((a, v) => a * r.tray[v], 1) : null;
      RK.strip(p, C, G.fb, `$${vals.join(' \\cdot ')}${tot != null ? ` = ${tot}` : ''}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) {
      const t = (G.tbox || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { i: t.i, from: -1, x, y }; return true; }
      const b = G.boxes.find(b => hitBox(b, x, y)); if (b && G.s.put[b.i] != null) { G.drag = { i: G.s.put[b.i], from: b.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return; const P = G.s.put, b = G.boxes.find(b => hitBox({ x: b.x - 4, y: b.y - 8, w: b.w + 8, h: b.h + 16 }, x, y));
      if (d.from >= 0) P[d.from] = null;
      if (b) { const prev = P[b.i]; P[b.i] = d.i; if (prev != null && d.from >= 0) P[d.from] = prev; }
      G.touch();
    },
    demo(G) { const t = G.tbox?.[0], b = G.boxes.find(b => G.r.want[b.i] !== G.r.tray[t?.i]) || G.boxes[0]; return t ? { from: { x: t.x + t.w / 2, y: t.y + 17 }, to: { x: b.x + b.w / 2, y: b.y + 24 }, text: 'Arrastra a una casilla', ty: t.y - 12 } : null; },
    peek: G => ({ boxes: G.boxes, tray: G.tbox }),
  });
  return Object.assign(game, { answer });
})();
