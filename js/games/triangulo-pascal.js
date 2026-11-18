// Completa el triángulo (Álgebra, alg-24c; spec 2026-11-18-algebra-revision): en el triángulo de Pascal cada número es la
// suma de los dos de arriba. Se ven las filas hasta la n − 1 y la fila n tiene casillas vacías (las puntas son 1); se
// arrastran fichas de la bandeja a las casillas. Esa fila son los coeficientes de (a + b)ⁿ.
// params = { rounds: [{ n, extra: [números de más] }] }   state = { rounds: [{ cells: [índice de ficha | null] }] }
GAMES['triangulo-pascal'] = (() => {
  const row = n => { let r = [1]; for (let i = 0; i < n; i++) r = [1, ...r.slice(1).map((v, j) => v + r[j]), 1]; return r; };
  const inner = n => row(n).slice(1, -1);
  const chips = r => [...inner(r.n), ...r.extra].sort((a, b) => a - b);
  const ok = (s, r) => s.cells.every((c, i) => c != null && chips(r)[c] === inner(r.n)[i]);
  const answer = r => { const ch = chips(r), used = new Set(); return { cells: inner(r.n).map(v => { const i = ch.findIndex((x, k) => x === v && !used.has(k)); used.add(i); return i; }) }; };
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ cells: inner(r.n).map(() => null) }),
    ok,
    answered: s => s.cells.some(c => c != null),
    solution: r => row(r.n).join(' '),
    prompt: r => `Completa la fila ${r.n}: cada número suma los dos de arriba`,
    foot: () => 'Arrastra fichas a las casillas vacías',
    layout(G) { G.cw = Math.min(40, (G.W - 20) / (G.r.n + 1)); G.top = 104; G.rh = 30; G.trayY = G.H - 132; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.drag = null; G.cw = Math.min(40, (G.W - 20) / (G.r.n + 1)); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, ch = chips(r), cw = G.cw = Math.min(40, (G.W - 20) / (r.n + 1));
      G.slots = [];
      for (let k = 0; k <= r.n; k++) {
        const R = row(k), y = G.top + k * G.rh;
        R.forEach((v, i) => {
          const x = G.W / 2 + (i - k / 2) * cw - cw / 2 + 2, b = { x, y, w: cw - 4, h: G.rh - 4 };
          if (k < r.n || i === 0 || i === k) RK.chip(p, C, b, String(v), { on: k === r.n, col: C.sky, size: 11, r: 6 });
          else { const c = s.cells[i - 1]; G.slots.push({ ...b, i: i - 1 }); if (c == null || G.drag?.from === i - 1) { p.noFill(); p.stroke(C.brand); p.drawingContext.setLineDash([3, 3]); p.rect(b.x, b.y, b.w, b.h, 6); p.drawingContext.setLineDash([]); } else RK.chip(p, C, b, String(ch[c]), { on: true, col: C.mint, size: 11, r: 6 }); }
        });
      }
      const free = ch.map((_, i) => i).filter(i => !s.cells.includes(i)), w = Math.min(40, (G.W - 20) / free.length - 4);
      G.tray = free.map((i, j) => ({ i, x: G.W / 2 - (free.length * (w + 4) - 4) / 2 + j * (w + 4), y: G.trayY, w, h: 30 }));
      G.tray.forEach(b => { if (!(G.drag?.c === b.i && G.drag.from == null)) RK.chip(p, C, b, String(ch[b.i]), { size: 12 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 18, y: G.drag.y - 15, w: 36, h: 30 }, String(ch[G.drag.c]), { on: true, size: 12 });
      RK.strip(p, C, G.fb, `$(a + b)^{${r.n}}:\\ ${row(r.n).map((v, i) => (i === 0 || i === r.n ? v : s.cells[i - 1] != null ? ch[s.cells[i - 1]] : '\\square')).join(',\\ ')}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { c: t.i, from: null, x, y }; return true; }
      const sl = (G.slots || []).find(b => hitBox(b, x, y) && G.s.cells[b.i] != null); if (sl) { G.drag = { c: G.s.cells[sl.i], from: sl.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const sl = (G.slots || []).find(b => hitBox({ x: b.x - 4, y: b.y - 6, w: b.w + 8, h: b.h + 12 }, x, y));
      if (d.from != null) G.s.cells[d.from] = null;
      if (sl) G.s.cells[sl.i] = d.c;
      G.touch();
    },
    demo(G) { const t = G.tray?.[0], sl = G.slots?.[0]; return t && sl ? { from: { x: t.x + t.w / 2, y: t.y + 15 }, to: { x: sl.x + sl.w / 2, y: sl.y + 13 }, text: 'Arrastra a una casilla', ty: G.trayY - 18 } : null; },
    peek: G => ({ tray: G.tray, slots: G.slots }),
  });
  return Object.assign(game, { row, answer });
})();
