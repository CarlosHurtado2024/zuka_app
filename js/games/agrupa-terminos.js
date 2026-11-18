// Agrupa y factoriza (Álgebra, alg-24b; spec 2026-11-18-algebra-revision): factorizar por agrupación. Cuatro términos y
// dos cajas: se arrastran de a dos a cada caja; cada caja muestra su factor común. Si las dos cajas dejan el mismo
// paréntesis, se puede sacar otra vez: (·)(·). Hay agrupaciones que no sirven.
// params = { rounds: [{ terms: [tex, …4], groups: { 'i,j': [factor, paréntesis] }, goods: [['i,j','k,l'], …], result }] }
// state = { rounds: [{ boxes: [[i, j], [k, l]] }] }
GAMES['agrupa-terminos'] = (() => {
  const key = b => [...b].sort().join(',');
  const ok = (s, r) => s.boxes.every(b => b.length === 2) && r.goods.some(([g1, g2]) => { const k = s.boxes.map(key).sort().join('|'); return k === [g1, g2].sort().join('|'); });
  const answer = r => ({ boxes: r.goods[0].map(g => g.split(',').map(Number)) });
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ boxes: [[], []] }),
    ok,
    answered: s => s.boxes.some(b => b.length),
    solution: r => r.result.replace(/\\/g, ''),
    prompt: r => `Factoriza $${r.terms.join(' + ').replace(/\+ -/g, '- ')}$ agrupando`,
    foot: () => 'Arrastra los términos de a dos a cada caja',
    layout(G) { G.trayY = 108; G.bx = [0, 1].map(k => ({ x: 14 + k * (G.W - 28) / 2 + 4, y: G.H * 0.38, w: (G.W - 28) / 2 - 8, h: 96 })); G.fb = { x: 12, y: G.H - 80, w: G.W - 24, h: 50 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, w = 64;
      G.spots = [];
      const free = r.terms.map((_, i) => i).filter(i => !s.boxes.some(b => b.includes(i)));
      free.forEach((i, j) => G.spots.push({ i, x: G.W / 2 - (free.length * (w + 6) - 6) / 2 + j * (w + 6), y: G.trayY, w, h: 34 }));
      s.boxes.forEach((B, k) => {
        const b = G.bx[k], g = B.length === 2 ? r.groups[key(B)] : null;
        p.stroke(g ? C.ok : C.line); p.strokeWeight(1.4); p.fill(RK.al(p, C.card, 220)); p.rect(b.x, b.y, b.w, b.h, 12);
        B.forEach((i, j) => G.spots.push({ i, x: b.x + 6 + j * (b.w - 12 - w), y: b.y + 8, w, h: 34 }));
        TK.label(p, C, g ? `$${g[0]}(${g[1]})$` : B.length === 2 ? 'sin factor común' : 'caja', b.x + b.w / 2, b.y + b.h - 22, g ? C.ok : C.mute, 13, b.w - 8);
      });
      G.spots.forEach(q => { if (G.drag?.i !== q.i) RK.chip(p, C, q, `$${r.terms[q.i]}$`, { on: s.boxes.some(b => b.includes(q.i)), col: C.mint, size: 13 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 17, w, h: 34 }, `$${r.terms[G.drag.i]}$`, { on: true, size: 13 });
      RK.strip(p, C, G.fb, ok(s, r) ? `$${r.result}$` : '$\\text{agrupa para que salga el mismo paréntesis}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { i: q.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const s = G.s, k = G.bx.findIndex(b => hitBox({ x: b.x - 6, y: b.y - 10, w: b.w + 12, h: b.h + 20 }, x, y));
      s.boxes.forEach(B => { const j = B.indexOf(d.i); if (j >= 0) B.splice(j, 1); });
      if (k >= 0 && s.boxes[k].length < 2) s.boxes[k].push(d.i);
      G.touch();
    },
    demo(G) { const q = G.spots?.[0]; return q ? { from: { x: q.x + q.w / 2, y: q.y + 17 }, to: { x: G.bx[0].x + G.bx[0].w / 2, y: G.bx[0].y + 30 }, text: 'Arrastra a una caja', ty: G.bx[0].y + G.bx[0].h + 16 } : null; },
    peek: G => ({ spots: G.spots, bx: G.bx }),
  });
  return Object.assign(game, { answer });
})();
