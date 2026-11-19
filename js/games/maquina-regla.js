// La máquina de la regla (Preuniversitario, pu-cd-2; spec 2026-11-18-preuda-razonamiento-completo): una máquina convierte
// números según una regla escondida. Se arrastra una ficha de regla a la máquina (y, si lleva número, se desliza ese número);
// la máquina prueba la regla con todos los ejemplos y marca cuáles cumple. La regla buena tiene que servir para todos; entonces
// la máquina dice qué sale con el número nuevo.
// params = { rounds: [{ ex: [[entra, sale], …], ask, op, k? }] }   state = { rounds: [{ op: índice | −1, k }] }   (k de 0 a 12)
GAMES['maquina-regla'] = (() => {
  const OPS = [
    { id: 'add', lab: '+ k', f: (x, k) => x + k, k: true },
    { id: 'sub', lab: '− k', f: (x, k) => x - k, k: true },
    { id: 'mul', lab: '× k', f: (x, k) => x * k, k: true },
    { id: 'dsum', lab: 'suma cifras', f: x => [...String(x)].reduce((a, c) => a + +c, 0) },
    { id: 'dmul', lab: 'multiplica cifras', f: x => [...String(x)].reduce((a, c) => a * +c, 1) },
    { id: 'rev', lab: 'al revés', f: x => +[...String(x)].reverse().join('') },
  ];
  const run = (s, x) => (s.op < 0 ? null : OPS[s.op].f(x, s.k));
  const ok = (s, r) => s.op >= 0 && r.ex.every(([a, b]) => run(s, a) === b);
  const answer = r => ({ op: OPS.findIndex(o => o.id === r.op), k: r.k ?? 0 });
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ op: -1, k: 0 }),
    answered: s => s.op >= 0,
    ok,
    solution: r => { const s = answer(r), o = OPS[s.op]; return `regla «${o.k ? o.lab.replace('k', s.k) : o.lab}»: ${r.ask} → ${run(s, r.ask)}`; },
    prompt: () => 'Descubre la regla de la máquina',
    foot: (r, s) => (s.op >= 0 && OPS[s.op].k ? 'Desliza el número de la regla' : 'Arrastra una regla a la máquina'),
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; G.tY = G.H - 96; },
    enter(G) { G.drag = null; G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r);
      const mx = 16, mw = G.W - 32, my = 92, rowH = 24;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 210)); p.rect(mx, my, mw, (r.ex.length + 1) * rowH + 44, 10);
      G.mbox = { x: G.W / 2 - 70, y: my + 6, w: 140, h: 30 };
      p.stroke(good ? C.ok : C.brand); p.strokeWeight(1.5); p.fill(RK.al(p, good ? C.ok : C.brand, 40)); p.rect(G.mbox.x, G.mbox.y, G.mbox.w, G.mbox.h, 8);
      const o = s.op >= 0 ? OPS[s.op] : null;
      TK.label(p, C, o ? (o.k ? o.lab.replace('k', s.k) : o.lab) : 'regla: ?', G.W / 2, my + 21, C.ink, 13, 136);
      const rows = [...r.ex.map(e => [e[0], e[1]]), [r.ask, null]];
      rows.forEach(([a, b], i) => {
        const y = my + 50 + i * rowH, got = run(s, a), hit = b != null && got === b;
        TK.label(p, C, String(a), G.W * 0.2, y, C.ink, 13, 60);
        TK.label(p, C, '→', G.W * 0.36, y, C.mute, 12, 20);
        TK.label(p, C, got == null ? '?' : String(got), G.W * 0.52, y, b == null ? (good ? C.ok : C.brand) : hit ? C.ok : C.bad, 13, 70);
        TK.label(p, C, b == null ? 'nuevo' : `debe dar ${b}`, G.W * 0.78, y, C.mute, 10, G.W * 0.36);
      });
      const per = 3, tw = (G.W - 32) / per - 6, ty0 = my + (r.ex.length + 1) * rowH + 56;
      G.chips = OPS.map((op, i) => ({ x: 16 + (i % per) * (tw + 6), y: ty0 + Math.floor(i / per) * 40, w: tw, h: 32, i }));
      G.chips.forEach(b => RK.chip(p, C, b, OPS[b.i].lab, { on: b.i === s.op, col: C.sky, size: 11 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - tw / 2, y: G.drag.y - 16, w: tw, h: 32 }, OPS[G.drag.i].lab, { on: true, col: C.brand, size: 11 });
      if (o?.k) G.X = RK.track(p, C, 30, G.W - 30, G.tY, 13, s.k, i => (i % 2 === 0 ? String(i) : null), C.brand);
      else G.X = null;
      RK.strip(p, C, G.fb, good ? `$${r.ask} \\to ${run(s, r.ask)}$` : '$\\text{la regla debe servir para todos}$', { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const c = (G.chips || []).find(b => hitBox(b, x, y));
      if (c) { G.drag = { i: c.i, x, y }; return true; }
      if (G.X && Math.abs(y - G.tY) < 26) { G.grab = true; game.move(G, x); return true; }
      return false;
    },
    drag(G, x, y) { if (G.drag) { G.drag.x = x; G.drag.y = y; return true; } if (G.grab) { game.move(G, x); return true; } return false; },
    release(G, x, y) {
      if (G.drag) { const m = G.mbox; if (hitBox({ x: m.x - 20, y: m.y - 20, w: m.w + 40, h: m.h + 60 }, x, y)) { G.s.op = G.drag.i; G.touch(); } G.drag = null; }
      G.grab = false;
    },
    demo: G => { if (!G.chips || !G.mbox) return null; const c = G.chips[answer(G.r).op === 0 ? 1 : 0]; return { from: { x: c.x + c.w / 2, y: c.y + 16 }, to: { x: G.mbox.x + 70, y: G.mbox.y + 15 }, text: 'Arrastra una regla', ty: c.y + 52 }; },
    peek: G => ({ chips: G.chips, mbox: G.mbox, tY: G.tY }),
  });
  game.move = (G, x) => { const k = RK.pick(x, 30, G.W - 30, 13); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { answer });
})();
