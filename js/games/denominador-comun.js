// El denominador común (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): el mínimo común denominador lleva cada
// factor de los denominadores, con la mayor potencia que aparece. Arriba están las dos fracciones con sus denominadores
// factorizados; abajo, fichas de factores. Se arrastran a la caja del común denominador las fichas justas.
// params = { rounds: [{ d1: [factores], d2: [factores], chips: [factores] }] }   state = { rounds: [{ box: [índices] }] }
GAMES['denominador-comun'] = (() => {
  const lcd = r => { const o = [...r.d1], rest = [...r.d2]; r.d1.forEach(f => { const i = rest.indexOf(f); if (i >= 0) rest.splice(i, 1); }); return [...o, ...rest]; };
  const ok = (s, r) => s.box.map(i => r.chips[i]).sort().join('|') === lcd(r).sort().join('|');
  const answer = r => { const used = new Set(); return { box: lcd(r).map(f => { const i = r.chips.findIndex((c, k) => c === f && !used.has(k)); used.add(i); return i; }) }; };
  // Producto de factores con potencias: ['x', 'x', 'x+1'] → x^{2}(x+1).
  const mul = fs => { const n = new Map(); fs.forEach(f => n.set(f, (n.get(f) || 0) + 1)); return [...n].map(([f, k]) => `${f.length > 2 ? `(${f})` : f}${k > 1 ? `^{${k}}` : ''}`).join(''); };
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ box: [] }),
    ok,
    answered: s => s.box.length > 0,
    solution: r => mul(lcd(r)),
    prompt: r => `Común denominador de $\\dfrac{1}{${mul(r.d1)}}$ y $\\dfrac{1}{${mul(r.d2)}}$`,
    foot: () => 'Arrastra a la caja los factores justos',
    layout(G) { G.box = { x: 16, y: 112, w: G.W - 32, h: 64 }; G.cy = G.H * 0.56; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      p.stroke(C.brand); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 18)); p.rect(G.box.x, G.box.y, G.box.w, G.box.h, 12);
      TK.label(p, C, 'común denominador', G.box.x + 70, G.box.y - 10, C.mute, 10, 140);
      G.spots = [];
      s.box.forEach((i, j) => G.spots.push({ i, inBox: true, x: G.box.x + 8 + j * 66, y: G.box.y + 14, w: 60, h: 36 }));
      const free = r.chips.map((_, i) => i).filter(i => !s.box.includes(i));
      const fw = Math.min(60, (G.W - 24) / Math.max(1, free.length) - 6); free.forEach((i, j) => G.spots.push({ i, x: G.W / 2 - (free.length * (fw + 6) - 6) / 2 + j * (fw + 6), y: G.cy, w: fw, h: 36 }));
      G.spots.forEach(q => { if (G.drag?.i !== q.i) RK.chip(p, C, q, `$${r.chips[q.i]}$`, { on: q.inBox, col: C.mint, size: q.w < 56 ? 11 : 13 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 30, y: G.drag.y - 18, w: 60, h: 36 }, `$${r.chips[G.drag.i]}$`, { on: true, size: 13 });
      RK.strip(p, C, G.fb, s.box.length ? `$${mul(s.box.map(i => r.chips[i]))}$` : '$\\text{caja vacía}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { i: q.i, inBox: !!q.inBox, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const inB = hitBox({ x: G.box.x - 8, y: G.box.y - 16, w: G.box.w + 16, h: G.box.h + 32 }, x, y), b = G.s.box;
      if (!d.inBox && inB && b.length < 4) { b.push(d.i); G.touch(); } else if (d.inBox && !inB) { b.splice(b.indexOf(d.i), 1); G.touch(); }
    },
    demo(G) { const q = G.spots?.find(q => !q.inBox); return q ? { from: { x: q.x + 30, y: q.y + 18 }, to: { x: G.box.x + 40, y: G.box.y + 32 }, text: 'Arrastra a la caja', ty: G.cy + 56 } : null; },
    peek: G => ({ spots: G.spots, box: G.box }),
  });
  return Object.assign(game, { lcd, answer, mul });
})();
