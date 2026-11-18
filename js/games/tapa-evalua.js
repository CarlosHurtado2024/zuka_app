// Tapar y evaluar (Álgebra, alg-102; spec 2026-11-18-algebra-revision): para hallar A en A/(x − p) se tapa el factor
// (x − p) de la fracción original y lo que queda se evalúa en x = p (el valor que anula lo tapado). Se arrastra la tapa
// sobre un factor del denominador y el juego evalúa lo que queda en el cero de ese factor; el número se arrastra luego a
// la casilla de su fracción parcial. Hay que llenar todas las casillas.
// params = { rounds: [{ num: [c, d], ps: [p, q, …] }] }   (numerador c·x + d, factores x − p)   state = { rounds: [{ put: [índice | null, …] }] }
GAMES['tapa-evalua'] = (() => {
  const lay = G => { const n = G.r.ps.length, w = Math.min(84, (G.W - 40) / n - 8); G.fac = G.r.ps.map((_, k) => ({ k, x: G.W / 2 - (n * (w + 8) - 8) / 2 + k * (w + 8), y: 128, w, h: 36 })); G.lid = { x: 20, y: 182, w: 62, h: 30 }; G.slots = G.r.ps.map((_, k) => ({ k, x: G.W / 2 - (n * (w + 8) - 8) / 2 + k * (w + 8), y: G.H * 0.62, w, h: 64 })); G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; };
  const coef = (r, k) => { const p = r.ps[k]; let den = 1; r.ps.forEach((q, j) => { if (j !== k) den *= p - q; }); return (r.num[0] * p + r.num[1]) / den; };
  const ok = (s, r) => s.put.every((v, k) => v === k);
  const fac = v => (v === 0 ? 'x' : `x ${v < 0 ? '+' : '-'} ${Math.abs(v)}`);
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ put: r.ps.map(() => null) }),
    ok,
    answered: s => s.put.some(v => v != null),
    solution: r => r.ps.map((p, k) => `${RK.num(coef(r, k))}/(${fac(p)})`).join(' + '),
    prompt: r => `Parte $\\dfrac{${r.num[0] === 1 ? '' : r.num[0]}x ${r.num[1] < 0 ? '-' : '+'} ${Math.abs(r.num[1])}}{${r.ps.map(p => `(${fac(p)})`).join('')}}$ tapando cada factor`,
    foot: () => 'Tapa un factor y lleva el número a su casilla',
    layout: G => lay(G),
    enter(G) { G.drag = null; G.cov = -1; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { put: r.ps.map((_, k) => k) } : G.s;
      TK.label(p, C, `numerador: ${r.num[0] === 1 ? "" : r.num[0]}x ${r.num[1] < 0 ? '−' : '+'} ${Math.abs(r.num[1])}`, G.W / 2, 104, C.mute, 12, G.W - 30);
      G.fac.forEach(b => { if (G.cov === b.k) { RK.chip(p, C, b, 'tapado', { on: true, col: C.mute, size: 11 }); } else RK.chip(p, C, b, `$(${fac(r.ps[b.k])})$`, { on: true, col: C.sky, size: 13 }); });
      if (!(G.drag && G.drag.lid)) RK.chip(p, C, G.lid, 'tapa', { on: true, col: C.brand, size: 12 });
      if (G.cov >= 0) { const v = coef(r, G.cov); G.val = { x: G.W - 96, y: 182, w: 76, h: 34 }; TK.label(p, C, `en x = ${r.ps[G.cov]}:`, G.W - 150, 199, C.mute, 11, 80); if (!(G.drag && G.drag.val)) RK.chip(p, C, G.val, RK.num(v), { on: true, col: C.mint, size: 15 }); } else G.val = null;
      G.slots.forEach(b => { const v = s.put[b.k]; RK.chip(p, C, b, v == null ? `$\\dfrac{\\square}{${fac(r.ps[b.k])}}$` : `$\\dfrac{${RK.num(coef(r, v))}}{${fac(r.ps[b.k])}}$`, { on: v != null, col: v == null ? C.line : v === b.k ? C.ok : C.bad, size: 14 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 34, y: G.drag.y - 16, w: 68, h: 32 }, G.drag.lid ? 'tapa' : RK.num(coef(r, G.drag.v)), { on: true, col: G.drag.lid ? C.brand : C.mint, size: 13 });
      RK.strip(p, C, G.fb, s.put.every(v => v != null) ? `$${r.ps.map((pp, k) => `\\dfrac{${RK.num(coef(r, s.put[k]))}}{${fac(pp)}}`).join(' + ')}$` : '$\\text{llena las casillas}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      if (hitBox(G.lid, x, y)) { G.drag = { lid: true, x, y }; return true; }
      if (G.val && hitBox(G.val, x, y)) { G.drag = { val: true, v: G.cov, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const near = b => hitBox({ x: b.x - 6, y: b.y - 10, w: b.w + 12, h: b.h + 20 }, x, y);
      if (d.lid) { const b = G.fac.find(near); if (b) { G.cov = b.k; G.touch(); } return; }
      const b = G.slots.find(near); if (b) { G.s.put[b.k] = d.v; G.touch(); }
    },
    demo: G => ({ from: { x: G.lid.x + 31, y: G.lid.y + 15 }, to: { x: G.fac[0].x + G.fac[0].w / 2, y: G.fac[0].y + 18 }, text: 'Tapa un factor', ty: G.lid.y + 30 }),
    peek: G => ({ fac: G.fac, lid: G.lid, slots: G.slots, val: G.val }),
  });
  return Object.assign(game, { coef });
})();
