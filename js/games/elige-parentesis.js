// ¿De cuántas maneras? (Álgebra, alg-24c; spec 2026-11-18-algebra-revision): el coeficiente de aⁿ⁻ᵏbᵏ en (a + b)ⁿ cuenta
// de cuántas maneras se puede tomar b de k paréntesis. Hay n paréntesis (a + b); se arrastran fichas b a k de ellos (los
// demás dan a). Cada manera nueva queda anotada; hay que encontrarlas todas, y su número es el coeficiente.
// params = { rounds: [{ n, k }] }   state = { rounds: [{ cur: [índices con b], found: ['mascara', …] }] }
GAMES['elige-parentesis'] = (() => {
  const C_ = (n, k) => (k === 0 || k === n ? 1 : C_(n - 1, k - 1) + C_(n - 1, k));
  const key = cur => [...cur].sort().join('');
  const ok = (s, r) => s.found.length === C_(r.n, r.k);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ cur: [], found: [] }),
    ok,
    answered: s => s.found.length > 0,
    solution: r => `${C_(r.n, r.k)} maneras: el término es ${C_(r.n, r.k)}a^${r.n - r.k}b^${r.k}`,
    prompt: r => `En $(a + b)^{${r.n}}$, ¿de cuántas maneras sale $a^{${r.n - r.k}}b^{${r.k}}$?`,
    foot: r => `Pon ${r.k} fichas b; cada manera nueva se anota. Saca fichas para probar otra`,
    layout(G) { const n = G.r.n; G.pw = Math.min(56, (G.W - 20) / n - 6); G.py = 118; G.trayY = 186; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.drag = null; G.pw = Math.min(56, (G.W - 20) / G.r.n - 6); },
    draw(G) {
      const { p, C, r, pw } = G, s = G.s;
      G.par = [];
      for (let i = 0; i < r.n; i++) { const b = { i, x: G.W / 2 - (r.n * (pw + 6) - 6) / 2 + i * (pw + 6), y: G.py, w: pw, h: 44 }; G.par.push(b); const on = s.cur.includes(i); RK.chip(p, C, b, on ? 'b' : 'a', { on: true, col: on ? C.coral : C.sky, size: 16 }); TK.label(p, C, '( a + b )', b.x + pw / 2, b.y - 10, C.mute, 9, pw + 6); }
      const left = r.k - s.cur.length;
      G.src = { x: 20, y: G.trayY, w: 44, h: 36 };
      if (left > 0) RK.chip(p, C, G.src, `b × ${left}`, { on: true, col: C.coral, size: 13 });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 20, y: G.drag.y - 18, w: 40, h: 36 }, 'b', { on: true, col: C.brand, size: 15 });
      // Las maneras halladas.
      const total = C_(r.n, r.k), cols = Math.max(1, Math.floor((G.W - 90) / 64));
      s.found.forEach((m, j) => { const x = 80 + (j % cols) * 64, y = G.trayY + Math.floor(j / cols) * 22; TK.label(p, C, Array.from({ length: r.n }, (_, i) => (m.includes(String(i)) ? 'b' : 'a')).join(''), x + 24, y + 10, C.ink, 11, 60); });
      RK.strip(p, C, G.fb, `$${s.found.length}\\text{ de }C(${r.n}, ${r.k})\\ \\text{maneras}$`, { kicker: `${r.n - r.k} paréntesis dan a y ${r.k} dan b`, col: G.locked || ok(s, r) ? C.ok : C.brand, size: 17 });
      if (G.locked && !ok(s, r)) TK.label(p, C, `eran ${total} maneras`, G.W / 2, G.fb.y - 12, C.ok, 12, 160);
    },
    press(G, x, y) {
      if (G.s.cur.length < G.r.k && hitBox(G.src, x, y)) { G.drag = { from: null, x, y }; return true; }
      const b = (G.par || []).find(b => hitBox(b, x, y) && G.s.cur.includes(b.i)); if (b) { G.drag = { from: b.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const s = G.s, b = (G.par || []).find(b => hitBox({ x: b.x - 4, y: b.y - 8, w: b.w + 8, h: b.h + 16 }, x, y));
      if (d.from != null) s.cur.splice(s.cur.indexOf(d.from), 1);
      if (b && !s.cur.includes(b.i) && s.cur.length < G.r.k) s.cur.push(b.i);
      if (s.cur.length === G.r.k && !s.found.includes(key(s.cur))) s.found.push(key(s.cur));
      G.touch();
    },
    demo(G) { const b = G.par?.[0]; return b && G.src ? { from: { x: G.src.x + 22, y: G.src.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 22 }, text: 'Arrastra fichas b a los paréntesis', ty: G.trayY + 56 } : null; },
    peek: G => ({ par: G.par, src: G.src }),
  });
  return Object.assign(game, { C: C_ });
})();
