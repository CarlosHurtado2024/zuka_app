// La palabra en el espejo (Preuniversitario, pu-es-4; spec 2026-11-18-preuda-razonamiento-completo): un espejo vertical da
// vuelta a la palabra completa: la primera letra queda de última, y cada letra se ve al revés. Se arrastran las letras a las
// casillas del espejo en el orden en que se verían.
// params = { rounds: [{ word }] }   state = { rounds: [{ put: [índice de letra | null] }] }
GAMES['espejo-palabra'] = (() => {
  const want = r => [...r.word].map((_, i) => r.word.length - 1 - i);
  const ok = (s, r) => s.put.every((v, i) => v != null && r.word[v] === r.word[want(r)[i]]);
  const lay = G => { const n = G.r.word.length, w = Math.min(40, (G.W - 30) / n - 4); G.slots = [...G.r.word].map((_, i) => ({ i, x: G.W / 2 - (n * (w + 4) - 4) / 2 + i * (w + 4), y: 186, w, h: 40 })); G.wl = w; };
  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ put: [...r.word].map(() => null) }),
    ok,
    answered: s => s.put.some(v => v != null),
    solution: r => [...r.word].reverse().join(''),
    prompt: r => `¿Cómo se ve ${r.word} en un espejo puesto a su derecha?`,
    foot: () => 'Arrastra las letras a las casillas del espejo',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { put: want(r) } : G.s, good = ok(s, r), n = r.word.length, w = G.wl;
      [...r.word].forEach((c, i) => RK.chip(p, C, { x: G.W / 2 - (n * (w + 4) - 4) / 2 + i * (w + 4), y: 112, w, h: 40 }, c, { on: true, col: C.sky, size: 16 }));
      TK.label(p, C, 'en el espejo se ve:', G.W / 2, 172, C.mute, 10, 160);
      G.slots.forEach(b => { const v = s.put[b.i]; if (v != null && G.drag?.from !== b.i) { RK.chip(p, C, b, '', { on: true, col: good ? C.ok : C.coral, size: 16 }); p.push(); p.translate(b.x + b.w / 2, b.y + b.h / 2); p.scale(-1, 1); TK.label(p, C, r.word[v], 0, 0, C.ink, 16, b.w); p.pop(); } else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); } });
      const free = [...r.word].map((_, i) => i).filter(i => !s.put.includes(i) && G.drag?.i !== i);
      G.tray = free.map((i, j) => ({ i, x: G.W / 2 - (free.length * (w + 6) - 6) / 2 + j * (w + 6), y: G.H - 110, w, h: 36 }));
      G.tray.forEach(b => RK.chip(p, C, b, r.word[b.i], { size: 14 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 18, w, h: 36 }, r.word[G.drag.i], { on: true, col: C.brand, size: 14 });
      RK.strip(p, C, G.fb, good ? '$\\text{así se ve en el espejo}$' : '$\\text{la primera letra queda de última}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { i: t.i, from: -1, x, y }; return true; }
      const b = G.slots.find(b => hitBox(b, x, y)); if (b && G.s.put[b.i] != null) { G.drag = { i: G.s.put[b.i], from: b.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return; const P = G.s.put, b = G.slots.find(b => hitBox({ x: b.x - 3, y: b.y - 8, w: b.w + 6, h: b.h + 16 }, x, y));
      if (d.from >= 0) P[d.from] = null;
      if (b) { const prev = P[b.i]; P[b.i] = d.i; if (prev != null && d.from >= 0) P[d.from] = prev; }
      G.touch();
    },
    demo(G) { const t = G.tray?.[0], b = G.slots[0]; return t ? { from: { x: t.x + t.w / 2, y: t.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 20 }, text: 'Arrastra una letra', ty: t.y - 12 } : null; },
    peek: G => ({ slots: G.slots, tray: G.tray }),
  });
  return Object.assign(game, { answer: r => ({ put: want(r) }) });
})();
