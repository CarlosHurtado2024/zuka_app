// Multiplica y cancela (Álgebra, alg-25b; spec 2026-11-18-algebra-revision): al multiplicar fracciones algebraicas los
// factores de un numerador se pueden cancelar con los de CUALQUIER denominador. Arriba van los factores de los dos
// numeradores y abajo los de los dos denominadores; se arrastra un factor de arriba sobre uno igual de abajo y los dos se
// van. Hay que cancelar todo lo que se pueda.
// params = { rounds: [{ top: [..], bottom: [..] }] }   (factores como TeX)   state = { rounds: [{ gone: [[i, j], …] }] }
GAMES['multiplica-cancela'] = (() => {
  const pairs = r => { const out = [], used = new Set(); r.top.forEach((t, i) => { const j = r.bottom.findIndex((b, k) => b === t && !used.has(k)); if (j >= 0) { used.add(j); out.push([i, j]); } }); return out; };
  const ok = (s, r) => s.gone.length === pairs(r).length;
  const fx = f => (f.length > 2 ? `(${f})` : f);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ gone: [] }),
    ok,
    answered: s => s.gone.length > 0,
    solution: r => { const g = pairs(r), T = r.top.filter((_, i) => !g.some(p => p[0] === i)), B = r.bottom.filter((_, j) => !g.some(p => p[1] === j)); return `${T.map(fx).join('') || '1'} / ${B.map(fx).join('') || '1'}`; },
    prompt: () => 'Multiplica y cancela todos los factores comunes',
    foot: () => 'Arrastra un factor de arriba sobre uno igual de abajo',
    layout(G) { G.yt = G.H * 0.34; G.yb = G.H * 0.56; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { gone: pairs(r) } : G.s, gt = s.gone.map(g => g[0]), gb = s.gone.map(g => g[1]);
      p.stroke(C.ink); p.strokeWeight(2.5); p.line(20, (G.yt + G.yb) / 2 + 10, G.W - 20, (G.yt + G.yb) / 2 + 10);
      const row = (list, y, gone, key) => { const w = Math.min(72, (G.W - 20) / list.length - 6); return list.map((f, i) => { const b = { i, x: G.W / 2 - (list.length * (w + 6) - 6) / 2 + i * (w + 6), y: y - 18, w, h: 36, gone: gone.includes(i) }; if (b.gone) { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([3, 3]); p.rect(b.x, b.y, w, 36, 8); p.drawingContext.setLineDash([]); } else if (!(key === 't' && G.drag?.i === i)) RK.chip(p, C, b, `$${fx(f)}$`, { on: true, col: key === 't' ? C.sky : C.coral, size: 13 }); return b; }); };
      G.T = row(r.top, G.yt, gt, 't'); G.B = row(r.bottom, G.yb + 18, gb, 'b');
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 34, y: G.drag.y - 18, w: 68, h: 36 }, `$${fx(r.top[G.drag.i])}$`, { on: true, size: 13 });
      const T = r.top.filter((_, i) => !gt.includes(i)), B = r.bottom.filter((_, j) => !gb.includes(j));
      RK.strip(p, C, G.fb, `$\\dfrac{${T.map(fx).join('') || '1'}}{${B.map(fx).join('') || '1'}}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const b = (G.T || []).find(b => !b.gone && hitBox(b, x, y)); if (!b) return false; G.drag = { i: b.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const b = (G.B || []).find(b => !b.gone && hitBox({ x: b.x - 6, y: b.y - 8, w: b.w + 12, h: b.h + 16 }, x, y));
      if (b && G.r.bottom[b.i] === G.r.top[d.i]) { G.s.gone.push([d.i, b.i]); G.touch(); }
    },
    demo(G) { const a = G.T?.[0], b = G.B?.[G.B.length - 1]; return a && b ? { from: { x: a.x + a.w / 2, y: a.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 18 }, text: 'Arrastra arriba sobre abajo', ty: G.yb + 60 } : null; },
    peek: G => ({ T: G.T, B: G.B }),
  });
  return Object.assign(game, { pairs });
})();
