// Caras opuestas del cubo (Preuniversitario, pu-es-3; spec 2026-11-18-preuda-razonamiento-completo): en un desarrollo, dos
// cuadrados que se tocan nunca quedan opuestos; en una fila de tres, el primero y el tercero sí. Hay un desarrollo con letras;
// junto a tres letras hay un hueco: se arrastra a cada hueco la letra que queda frente a ella al armar el cubo.
// params = { rounds: [{ cells: [[col, fila]], letters: [..], ask: [índices] }] }   state = { rounds: [{ put: [letra | null] }] }
GAMES['caras-opuestas'] = (() => {
  const want = r => r.ask.map(i => r.letters[CUBO.opposite(r.cells, i)]);
  const ok = (s, r) => s.put.join() === want(r).join();
  const lay = G => { const r = G.r, W = Math.max(...r.cells.map(c => c[0])) + 1, H = Math.max(...r.cells.map(c => c[1])) + 1; G.u = Math.min(42, (G.W - 40) / W, 180 / H); G.o = { x: (G.W - W * G.u) / 2, y: 104 }; G.slots = r.ask.map((_, k) => ({ k, x: G.W / 2 - (r.ask.length * 96 - 8) / 2 + k * 96 + 46, y: 104 + H * G.u + 22, w: 40, h: 36 })); };
  const game = roundsGame({
    aspect: 1.5,
    init: r => ({ put: r.ask.map(() => null) }),
    ok,
    answered: s => s.put.some(v => v != null),
    solution: r => r.ask.map((i, k) => `${r.letters[i]} ↔ ${want(r)[k]}`).join(', '),
    prompt: () => 'Al armar el cubo, ¿qué letra queda frente a cada una?',
    foot: () => 'Arrastra a cada hueco la letra opuesta',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { put: want(r) } : G.s, good = ok(s, r), u = G.u, o = G.o;
      r.cells.forEach((c, i) => { const b = { x: o.x + c[0] * u, y: o.y + c[1] * u, w: u, h: u }; p.stroke(C.ink); p.strokeWeight(1.4); p.fill(r.ask.includes(i) ? RK.al(p, C.sky, 120) : RK.al(p, C.card, 200)); p.rect(b.x, b.y, u, u); TK.label(p, C, r.letters[i], b.x + u / 2, b.y + u / 2, C.ink, 14, u); });
      G.slots.forEach(b => { TK.label(p, C, `${r.letters[r.ask[b.k]]} ↔`, b.x - 26, b.y + 18, C.ink, 13, 40); const v = s.put[b.k]; if (v != null) RK.chip(p, C, b, v, { on: true, col: G.locked ? (v === want(r)[b.k] ? C.ok : C.bad) : good ? C.ok : C.mint, size: 13 }); else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(b.x, b.y, b.w, b.h, 8); p.drawingContext.setLineDash([]); } });
      G.tray = r.letters.map((L, i) => ({ L, x: G.W / 2 - (r.letters.length * 40 - 6) / 2 + i * 40, y: G.H - 110, w: 34, h: 32 }));
      G.tray.forEach(b => RK.chip(p, C, b, b.L, { size: 13, col: C.coral }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 17, y: G.drag.y - 16, w: 34, h: 32 }, G.drag.L, { on: true, col: C.brand, size: 13 });
      RK.strip(p, C, G.fb, good ? '$\\text{bien doblado}$' : '$\\text{dobla el desarrollo en tu cabeza}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { L: t.L, x, y }; return true; } const b = G.slots.find(b => hitBox(b, x, y)); if (b && G.s.put[b.k] != null) { G.drag = { L: G.s.put[b.k], x, y }; G.s.put[b.k] = null; return true; } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const b = G.slots.find(b => hitBox({ x: b.x - 6, y: b.y - 8, w: b.w + 12, h: b.h + 16 }, x, y)); if (b) G.s.put[b.k] = d.L; G.touch(); },
    demo(G) { const t = G.tray?.find(b => b.L !== want(G.r)[0]), b = G.slots[0]; return t ? { from: { x: t.x + 17, y: t.y + 16 }, to: { x: b.x + 20, y: b.y + 18 }, text: 'Arrastra una letra', ty: t.y - 12 } : null; },
    peek: G => ({ slots: G.slots, tray: G.tray }),
  });
  return Object.assign(game, { answer: r => ({ put: want(r) }), want });
})();
