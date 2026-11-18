// ¿Cuál multiplico primero? (Álgebra, alg-12b; spec 2026-11-18-algebra-revision): la asociativa y la conmutativa del
// producto. Tres factores sueltos: se arrastra uno sobre otro para multiplicarlos primero (se funden en una ficha con su
// producto) y luego el resultado con el que queda. El orden no cambia el resultado, pero sí lo fácil: hay que empezar
// por la pareja que da una cifra redonda. Arrastrar la ficha fundida la separa otra vez.
// params = { rounds: [{ nums: [a, b, c] }] }   state = { rounds: [{ first: [i, j] | null }] }
GAMES['multiplica-primero'] = (() => {
  const prod = (r, P) => P.reduce((a, i) => a * r.nums[i], 1);
  const zeros = v => { let z = 0; while (v && v % 10 === 0) { v /= 10; z++; } return z; };
  // La mejor pareja: la que deja más ceros.
  const best = r => [[0, 1], [0, 2], [1, 2]].reduce((b, P) => (zeros(prod(r, P)) > zeros(prod(r, b)) ? P : b));
  const ok = (s, r) => !!s.first && zeros(prod(r, s.first)) === zeros(prod(r, best(r))) && zeros(prod(r, s.first)) > 0;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ first: null }),
    ok,
    answered: s => !!s.first,
    solution: r => { const P = best(r), k = [0, 1, 2].find(i => !P.includes(i)); return `(${P.map(i => r.nums[i]).join(' · ')}) · ${r.nums[k]} = ${prod(r, P)} · ${r.nums[k]} = ${prod(r, [0, 1, 2])}`; },
    prompt: r => `Calcula $${r.nums.join(' \\cdot ')}$ empezando por lo fácil`,
    foot: () => 'Arrastra un factor sobre otro para multiplicarlos primero',
    layout(G) { G.y = G.H * 0.38; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, good = ok(G.s, r), s = G.locked && !good ? { first: best(r) } : G.s, w = 74, h = 48;
      G.spots = [];
      const items = s.first ? [{ P: s.first }, { P: [[0, 1, 2].find(i => !s.first.includes(i))] }] : [0, 1, 2].map(i => ({ P: [i] }));
      items.forEach((it, j) => { const x = G.W / 2 - (items.length * (w + 18) - 18) / 2 + j * (w + 18); G.spots.push({ ...it, x, y: G.y, w, h, k: j }); });
      G.spots.forEach(q => {
        if (G.drag?.k === q.k) return;
        const merged = q.P.length > 1;
        RK.chip(p, C, q, merged ? `${prod(r, q.P)}` : `${r.nums[q.P[0]]}`, { on: merged, col: merged ? (zeros(prod(r, q.P)) ? C.mint : C.coral) : C.brand, size: 20 });
        if (merged) TK.label(p, C, `${q.P.map(i => r.nums[i]).join(' · ')}`, q.x + q.w / 2, q.y - 12, C.mute, 11, q.w + 20);
      });
      if (G.drag) { const q = G.spots[G.drag.k]; RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - h / 2, w, h }, q.P.length > 1 ? prod(r, q.P) : r.nums[q.P[0]], { on: true, size: 20 }); }
      let tex = r.nums.join(' \\cdot ');
      if (s.first) { const k = [0, 1, 2].find(i => !s.first.includes(i)); tex = `(${s.first.map(i => r.nums[i]).join(' \\cdot ')}) \\cdot ${r.nums[k]} = ${prod(r, s.first)} \\cdot ${r.nums[k]} = ${prod(r, [0, 1, 2])}`; }
      RK.strip(p, C, G.fb, `$${tex}$`, { kicker: s.first ? (zeros(prod(r, s.first)) ? 'Primero lo redondo' : 'Se puede, pero no es lo más fácil') : 'Elige la primera pareja', col: G.locked ? C.ok : C.mint, size: 16 });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { k: q.k, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const q = G.spots[d.k];
      if (q.P.length > 1) { G.s.first = null; G.touch(); return; }
      const t = G.spots.find(o => o.k !== d.k && o.P.length === 1 && hitBox({ x: o.x - 10, y: o.y - 10, w: o.w + 20, h: o.h + 20 }, x, y));
      if (t && !G.s.first) { G.s.first = [q.P[0], t.P[0]].sort(); G.touch(); }
    },
    demo(G) { const a = G.spots?.[0], b = G.spots?.[1]; return a && b && !G.s.first ? { from: { x: a.x + a.w / 2, y: a.y + 24 }, to: { x: b.x + b.w / 2, y: b.y + 24 }, text: 'Arrastra un factor sobre otro', ty: G.y + 80 } : null; },
    peek: G => ({ spots: G.spots }),
  });
  return Object.assign(game, { best, zeros });
})();
