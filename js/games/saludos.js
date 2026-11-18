// Los saludos (Preuniversitario, pu-co-3 y pu-co-5; spec 2026-11-18-preuda-razonamiento-completo): si cada persona saluda una
// vez a cada otra, cada saludo es una pareja sin orden: hay C(n, 2) = n(n − 1)/2. Se arrastra de una persona a otra para
// trazar su saludo (cada pareja cuenta una sola vez, en cualquier sentido). Hay que trazarlos todos.
// params = { rounds: [{ n }] }   state = { rounds: [{ pairs: ['i-j'] }] }   (i < j)
GAMES['saludos'] = (() => {
  const total = r => r.n * (r.n - 1) / 2;
  const ok = (s, r) => s.pairs.length === total(r);
  const pt = (G, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / G.r.n; return { x: G.c.x + G.R * Math.cos(a), y: G.c.y + G.R * Math.sin(a) }; };
  const game = roundsGame({
    aspect: 1.35,
    init: () => ({ pairs: [] }),
    ok,
    answered: s => s.pairs.length > 0,
    solution: r => `${total(r)} saludos`,
    prompt: r => `${r.n} personas: cada una saluda una vez a cada otra. Traza todos los saludos`,
    foot: () => 'Arrastra de una persona a otra para trazar su saludo',
    layout(G) { G.c = { x: G.W / 2, y: 200 }; G.R = Math.min(G.W / 2 - 40, 96); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { pairs: [...Array(r.n).keys()].flatMap(i => [...Array(r.n).keys()].filter(j => j > i).map(j => `${i}-${j}`)) } : G.s, good = ok(s, r);
      s.pairs.forEach(k => { const [i, j] = k.split('-').map(Number), a = pt(G, i), b = pt(G, j); p.stroke(good ? C.ok : C.sky); p.strokeWeight(2); p.line(a.x, a.y, b.x, b.y); });
      if (G.drag) { const a = pt(G, G.drag.i); p.stroke(C.brand); p.strokeWeight(2); p.line(a.x, a.y, G.drag.x, G.drag.y); }
      for (let i = 0; i < r.n; i++) { const q = pt(G, i); p.stroke(C.ink); p.strokeWeight(1.4); p.fill(C.card); p.circle(q.x, q.y, 28); TK.label(p, C, String.fromCharCode(65 + i), q.x, q.y, C.ink, 12, 24); }
      RK.strip(p, C, G.fb, `$\\text{${s.pairs.length} saludos}$`, { kicker: good ? 'Todos: cada pareja una vez' : 'Sigue trazando', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { for (let i = 0; i < G.r.n; i++) { const q = pt(G, i); if (Math.hypot(x - q.x, y - q.y) < 22) { G.drag = { i, x, y }; return true; } } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      for (let j = 0; j < G.r.n; j++) { const q = pt(G, j); if (j !== d.i && Math.hypot(x - q.x, y - q.y) < 24) { const k = `${Math.min(d.i, j)}-${Math.max(d.i, j)}`; if (!G.s.pairs.includes(k)) { G.s.pairs.push(k); G.touch(); } } }
    },
    demo: G => { const a = pt(G, 0), b = pt(G, 1); return { from: a, to: b, text: 'Arrastra de una a otra', ty: G.c.y + G.R + 30 }; },
    peek: G => ({ c: G.c, R: G.R }),
  });
  return Object.assign(game, { total });
})();
