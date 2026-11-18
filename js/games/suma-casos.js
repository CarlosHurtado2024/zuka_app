// ¿Se suma o se multiplica? (Preuniversitario, pu-co-4; spec 2026-11-18-preuda-razonamiento-completo): si hay que tomar una
// decisión Y otra, las opciones se multiplican; si se toma una u OTRA (casos que no se cruzan), se suman. Cada ronda tiene
// dos grupos de opciones; se arrastra la ficha «+» o «×» al hueco entre ellos y el juego dibuja lo que cuenta (una fila de
// opciones o una cuadrícula de parejas).
// params = { rounds: [{ text, m, n, A, B, op: '+' | '×' }] }   state = { rounds: [{ op }] }
GAMES['suma-casos'] = (() => {
  const ok = (s, r) => s.op === r.op;
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ op: null }),
    ok,
    answered: s => s.op != null,
    solution: r => `${r.m} ${r.op} ${r.n} = ${r.op === '+' ? r.m + r.n : r.m * r.n}`,
    prompt: r => r.text,
    foot: () => 'Arrastra + o × al hueco entre los dos grupos',
    layout(G) { G.gap = { x: G.W / 2 - 24, y: 116, w: 48, h: 40 }; G.ops = [{ op: '+', x: G.W / 2 - 64, y: G.H - 112, w: 48, h: 36 }, { op: '×', x: G.W / 2 + 16, y: G.H - 112, w: 48, h: 36 }]; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { op: r.op } : G.s, good = ok(s, r);
      RK.chip(p, C, { x: 20, y: 116, w: G.W / 2 - 56, h: 40 }, `${r.m} ${r.A}`, { on: true, col: C.sky, size: 11 });
      RK.chip(p, C, { x: G.W / 2 + 36, y: 116, w: G.W / 2 - 56, h: 40 }, `${r.n} ${r.B}`, { on: true, col: C.coral, size: 11 });
      if (s.op && !G.drag) RK.chip(p, C, G.gap, s.op, { on: true, col: good ? C.ok : C.brand, size: 20 }); else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(G.gap.x, G.gap.y, G.gap.w, G.gap.h, 8); p.drawingContext.setLineDash([]); }
      const y0 = 176, room = G.H - 300;
      if (s.op === '×') { const c = Math.min(18, room / r.m, (G.W - 40) / r.n); for (let i = 0; i < r.m; i++) for (let j = 0; j < r.n; j++) drawDot(p, C, G.W / 2 - r.n * c / 2 + (j + 0.5) * c, y0 + (i + 0.5) * c, Math.min(10, c * 0.6), good ? C.ok : C.mint); TK.label(p, C, 'cada pareja es un caso', G.W / 2, y0 + r.m * c + 12, C.mute, 10, 200); }
      if (s.op === '+') { const tot = r.m + r.n, c = Math.min(18, (G.W - 40) / tot); for (let i = 0; i < tot; i++) drawDot(p, C, G.W / 2 - tot * c / 2 + (i + 0.5) * c, y0 + 10, Math.min(10, c * 0.6), i < r.m ? C.sky : C.coral); TK.label(p, C, 'cada opción es un caso', G.W / 2, y0 + 32, C.mute, 10, 200); }
      G.ops.forEach(o => { if (!(G.drag && G.drag.op === o.op)) RK.chip(p, C, o, o.op, { size: 18 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 24, y: G.drag.y - 18, w: 48, h: 36 }, G.drag.op, { on: true, col: C.brand, size: 18 });
      RK.strip(p, C, G.fb, s.op ? `$${r.m} ${s.op === '×' ? '\\times' : '+'} ${r.n} = ${s.op === '+' ? r.m + r.n : r.m * r.n}$` : '$\\text{¿y, u o?}$', { col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const o = G.ops.find(o => hitBox(o, x, y)); if (o) { G.drag = { op: o.op, x, y }; return true; } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; if (hitBox({ x: G.gap.x - 20, y: G.gap.y - 20, w: G.gap.w + 40, h: G.gap.h + 40 }, x, y)) { G.s.op = d.op; G.touch(); } },
    demo: G => ({ from: { x: G.ops[0].x + 24, y: G.ops[0].y + 18 }, to: { x: G.gap.x + 24, y: G.gap.y + 20 }, text: 'Arrastra al hueco', ty: G.ops[0].y - 12 }),
    peek: G => ({ gap: G.gap, ops: G.ops }),
  });
  return Object.assign(game, { answer: r => ({ op: r.op }) });
})();
